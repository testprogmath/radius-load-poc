package main

import (
    "bufio"
    "encoding/json"
    "fmt"
    "io"
    "math"
    "os"
    "sort"
    "strings"
)

type rec struct {
    Phase     string  `json:"phase"`
    LatencyMS float64 `json:"latency_ms"`
    Code      string  `json:"code"`
    Err       string  `json:"err"`
}

type stats struct {
    count   int
    ok      int
    errors  int
    latency []float64
    min     float64
    max     float64
}

func main() {
    phaseStats := map[string]*stats{}

    reader := bufio.NewReader(os.Stdin)
    lineNo := 0
    for {
        line, err := reader.ReadBytes('\n')
        if len(line) > 0 {
            lineNo++
            var r rec
            if jerr := json.Unmarshal(line, &r); jerr != nil {
                fmt.Fprintf(os.Stderr, "warn: skipping line %d: %v\n", lineNo, jerr)
            } else {
                ph := r.Phase
                if ph == "" {
                    ph = "unknown"
                }
                s := phaseStats[ph]
                if s == nil {
                    s = &stats{min: math.MaxFloat64}
                    phaseStats[ph] = s
                }
                s.count++
                if strings.EqualFold(r.Code, "Access-Accept") {
                    s.ok++
                } else {
                    s.errors++
                }
                if r.LatencyMS > 0 {
                    s.latency = append(s.latency, r.LatencyMS)
                    if r.LatencyMS < s.min {
                        s.min = r.LatencyMS
                    }
                    if r.LatencyMS > s.max {
                        s.max = r.LatencyMS
                    }
                }
            }
        }
        if err == io.EOF {
            break
        }
        if err != nil {
            fmt.Fprintf(os.Stderr, "error: reading input: %v\n", err)
            os.Exit(1)
        }
    }

    // Print summary table
    fmt.Printf("Phase\tCount\tOK\tErrors\tErrorRate%%\tP50(ms)\tP95(ms)\tP99(ms)\tMin(ms)\tMax(ms)\n")
    ordered := make([]string, 0, len(phaseStats))
    for ph := range phaseStats {
        ordered = append(ordered, ph)
    }
    sort.Strings(ordered)

    for _, ph := range ordered {
        s := phaseStats[ph]
        p50, p95, p99 := percentile(s.latency, 50), percentile(s.latency, 95), percentile(s.latency, 99)
        errRate := 0.0
        if s.count > 0 {
            errRate = float64(s.errors) / float64(s.count) * 100.0
        }
        min, max := s.min, s.max
        if len(s.latency) == 0 {
            min, max = 0, 0
        }
        fmt.Printf("%s\t%d\t%d\t%d\t%.2f\t%.1f\t%.1f\t%.1f\t%.1f\t%.1f\n",
            ph, s.count, s.ok, s.errors, errRate, p50, p95, p99, min, max)
    }
}

func percentile(samples []float64, p int) float64 {
    if len(samples) == 0 {
        return 0
    }
    cp := make([]float64, len(samples))
    copy(cp, samples)
    sort.Float64s(cp)
    if p <= 0 {
        return cp[0]
    }
    if p >= 100 {
        return cp[len(cp)-1]
    }
    pos := (float64(p) / 100.0) * float64(len(cp)-1)
    l := int(math.Floor(pos))
    u := int(math.Ceil(pos))
    if l == u {
        return cp[l]
    }
    frac := pos - float64(l)
    return cp[l]*(1.0-frac) + cp[u]*frac
}

