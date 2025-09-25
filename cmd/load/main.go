package main

import (
    "bufio"
    "context"
    "encoding/json"
    "flag"
    "fmt"
    "math"
    "math/rand"
    "net"
    "os"
    "strconv"
    "strings"
    "sync"
    "time"

    "layeh.com/radius"
    "layeh.com/radius/rfc2865"
)

type metric struct {
    TS        string  `json:"ts"`
    Phase     string  `json:"phase"`
    LatencyMS float64 `json:"latency_ms"`
    Code      string  `json:"code"`
    Err       string  `json:"err"`
    BytesIn   int     `json:"bytes_in"`
    BytesOut  int     `json:"bytes_out"`
    TestID    string  `json:"test_id,omitempty"`
}

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

func envInt(key string, def int) int {
    if v := os.Getenv(key); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            return n
        }
    }
    return def
}

func envFloat(key string, def float64) float64 {
    if v := os.Getenv(key); v != "" {
        if f, err := strconv.ParseFloat(v, 64); err == nil {
            return f
        }
    }
    return def
}

func envDuration(key string, def time.Duration) time.Duration {
    if v := os.Getenv(key); v != "" {
        if d, err := time.ParseDuration(v); err == nil {
            return d
        }
    }
    return def
}

func main() {
    rand.Seed(time.Now().UnixNano())

    // Flags with env-backed defaults
    addr := flag.String("addr", getenv("RADIUS_ADDR", "127.0.0.1:1812"), "RADIUS server address (host:port)")
    secret := flag.String("secret", getenv("RADIUS_SECRET", "testing123"), "RADIUS shared secret")
    users := flag.Int("users", envInt("USERS", 1000), "Number of synthetic users (user%04d)")
    rps := flag.Float64("rps", envFloat("RPS", 200), "Target steady-state requests per second")
    workers := flag.Int("workers", envInt("WORKERS", 512), "Max concurrent workers")
    timeout := flag.Duration("timeout", envDuration("RADIUS_TIMEOUT", 2*time.Second), "Per-request timeout")
    warmup := flag.Duration("warmup", envDuration("WARMUP", 5*time.Second), "Warmup duration")
    steady := flag.Duration("steady", envDuration("STEADY", 30*time.Second), "Steady duration")
    spike := flag.Duration("spike", envDuration("SPIKE", 10*time.Second), "Spike duration")
    spikeMult := flag.Float64("spike-mult", envFloat("SPIKE_MULT", 3.0), "Spike RPS multiplier")
    phase := flag.String("phase", getenv("PHASE", "all"), "Phase to run: warmup|steady|spike|all")
    testID := flag.String("test-id", getenv("TEST_ID", ""), "Optional test identifier (sent as Calling-Station-Id)")
    flag.Parse()

    // Output writer goroutine
    out := bufio.NewWriterSize(os.Stdout, 1<<20)
    defer out.Flush()
    metricsCh := make(chan metric, 4096)
    var wgWrite sync.WaitGroup
    wgWrite.Add(1)
    go func() {
        defer wgWrite.Done()
        enc := json.NewEncoder(out)
        for m := range metricsCh {
            _ = enc.Encode(m)
        }
    }()

    // Concurrency semaphore
    sem := make(chan struct{}, *workers)

    // Build user list
    if *users <= 0 {
        *users = 1
    }
    usernames := make([]string, *users)
    for i := 0; i < *users; i++ {
        usernames[i] = fmt.Sprintf("user%04d", i%10000)
    }

    // Phase definitions
    phases := []struct {
        name string
        rps  float64
        dur  time.Duration
    }{
        {"warmup", *rps, *warmup},
        {"steady", *rps, *steady},
        {"spike", *rps * *spikeMult, *spike},
    }

    run := func(name string, rps float64, dur time.Duration) {
        if rps <= 0 || dur <= 0 {
            return
        }
        interval := time.Duration(float64(time.Second) / rps)
        if interval <= 0 {
            interval = time.Microsecond
        }
        ticker := time.NewTicker(interval)
        defer ticker.Stop()
        deadline := time.Now().Add(dur)
        for time.Now().Before(deadline) {
            select {
            case <-ticker.C:
                sem <- struct{}{}
                go func(phaseName string) {
                    defer func() { <-sem }()
                    u := usernames[rand.Intn(len(usernames))]
                    sendRequest(*addr, *secret, u, "pass123", *timeout, phaseName, *testID, metricsCh)
                }(name)
            default:
                time.Sleep(50 * time.Microsecond)
            }
        }
    }

    switch strings.ToLower(*phase) {
    case "warmup":
        run("warmup", phases[0].rps, phases[0].dur)
    case "steady":
        run("steady", phases[1].rps, phases[1].dur)
    case "spike":
        run("spike", phases[2].rps, phases[2].dur)
    default:
        run("warmup", phases[0].rps, phases[0].dur)
        run("steady", phases[1].rps, phases[1].dur)
        run("spike", phases[2].rps, phases[2].dur)
    }

    // Wait for in-flight workers
    for i := 0; i < cap(sem); i++ {
        sem <- struct{}{}
    }
    close(metricsCh)
    wgWrite.Wait()
}

func sendRequest(addr, secret, user, pass string, timeout time.Duration, phase string, testID string, out chan<- metric) {
    ctx, cancel := context.WithTimeout(context.Background(), timeout)
    defer cancel()

    p := radius.New(radius.CodeAccessRequest, []byte(secret))
    _ = rfc2865.UserName_SetString(p, user)
    _ = rfc2865.UserPassword_SetString(p, pass)
    _ = rfc2865.NASIPAddress_Set(p, net.ParseIP("127.0.0.1"))
    if testID != "" {
        _ = rfc2865.CallingStationID_SetString(p, testID)
    }

    reqBytes, _ := p.Encode()

    start := time.Now()
    resp, err := radius.Exchange(ctx, p, addr)
    elapsed := time.Since(start)

    m := metric{
        TS:        time.Now().UTC().Format(time.RFC3339Nano),
        Phase:     phase,
        LatencyMS: toMS(elapsed),
        BytesOut:  len(reqBytes),
        TestID:    testID,
    }
    if err != nil {
        m.Code = "timeout"
        m.Err = err.Error()
    } else {
        m.Code = resp.Code.String()
        if resp != nil {
            rb, _ := resp.Encode()
            m.BytesIn = len(rb)
        }
    }
    out <- m
}

func toMS(d time.Duration) float64 {
    return math.Round(float64(d)/1e6*10) / 10 // 0.1ms precision
}
