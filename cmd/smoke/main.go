package main

import (
    "context"
    "fmt"
    "net"
    "os"
    "time"

    "layeh.com/radius"
    "layeh.com/radius/rfc2865"
)

func getenv(key, def string) string {
    if v := os.Getenv(key); v != "" {
        return v
    }
    return def
}

func parseDurationEnv(key, def string) time.Duration {
    s := getenv(key, def)
    d, err := time.ParseDuration(s)
    if err != nil {
        return mustDuration(def)
    }
    return d
}

func mustDuration(s string) time.Duration {
    d, _ := time.ParseDuration(s)
    return d
}

func main() {
    addr := getenv("RADIUS_ADDR", "127.0.0.1:1812")
    secret := getenv("RADIUS_SECRET", "testing123")
    user := getenv("RADIUS_USER", "testuser")
    pass := getenv("RADIUS_PASS", "pass123")
    testID := getenv("TEST_ID", "")
    timeout := parseDurationEnv("RADIUS_TIMEOUT", "2s")

    if _, _, err := net.SplitHostPort(addr); err != nil {
        fmt.Fprintf(os.Stderr, "Invalid RADIUS_ADDR: %v\n", err)
        os.Exit(2)
    }

    // Quick UDP reachability check
    conn, err := net.DialTimeout("udp", addr, timeout)
    if err != nil {
        fmt.Fprintf(os.Stderr, "UDP dial failed: %v\n", err)
        os.Exit(2)
    }
    _ = conn.Close()

    ctx, cancel := context.WithTimeout(context.Background(), timeout)
    defer cancel()

    p := radius.New(radius.CodeAccessRequest, []byte(secret))
    _ = rfc2865.UserName_SetString(p, user)
    _ = rfc2865.UserPassword_SetString(p, pass)
    _ = rfc2865.NASIPAddress_Set(p, net.ParseIP("127.0.0.1"))
    if testID != "" {
        _ = rfc2865.CallingStationID_SetString(p, testID)
    }

    resp, err := radius.Exchange(ctx, p, addr)
    if err != nil {
        fmt.Fprintf(os.Stderr, "Access error: %v\n", err)
        os.Exit(1)
    }

    fmt.Println("Access result: " + resp.Code.String())

    if resp.Code != radius.CodeAccessAccept {
        os.Exit(1)
    }
}
