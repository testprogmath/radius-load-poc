# radius-load-poc

Для русской версии перейдите по ссылке: [README.ru.md](README.ru.md)

A self-contained harness for load testing RADIUS authentication on a laptop or VM. One `make up` starts FreeRADIUS in Docker with synthetic users; a Go client (layeh.com/radius) then sends PAP Access-Requests at a target rate through warmup, steady and spike phases, writes one NDJSON record per request, and a parser turns those records into a per-phase latency and error summary.

The question it answers is "does this setup hold N authentications per second, and what happens in a burst?" before a real network access control deployment is involved. Every run can carry a test ID, sent as `Calling-Station-Id`, so its requests can be found in FreeRADIUS logs and picked out of the NDJSON.

## Output

Format only; the values below are placeholders, not a measurement.

`make load` writes one line per request to `logs/steady.ndjson`:

```json
{"ts":"<RFC3339 UTC>","phase":"steady","latency_ms":<float>,"code":"Access-Accept","err":"","bytes_in":<int>,"bytes_out":<int>,"test_id":"my-run-001"}
```

`make parse` prints one row per phase:

```text
Phase   Count  OK  Errors  ErrorRate%  P50(ms)  P95(ms)  P99(ms)  Min(ms)  Max(ms)
steady  ...
```

## Prereqs
- Docker and Docker Compose
- Go 1.22+

## Quickstart
- One-time init (creates local secrets file from example):
  - `make init`
- Start FreeRADIUS:
  - `make up`
  - Follow logs in another terminal: `make logs`
- Sanity-check via radclient:
  - `make radclient`
- Smoke test (single Access-Request):
  - `make smoke`
- Load test (steady phase, emits NDJSON):
  - `make load`
- Parse NDJSON logs into a summary:
  - `make parse`
  - Optional: `TEST_ID=my-run-001 make parse` (parses only matching records)

Tip: to tag requests, set a test identifier (goes into RADIUS Calling-Station-Id):
- `export TEST_ID=my-run-001` or use flag `-test-id=my-run-001` for `cmd/load`.

Testing flow for TEST_ID:
- Prefer per-run override so Makefile env defaults don’t mask it:
- `TEST_ID=my-run-001 make smoke` (sends one request with Calling-Station-Id)
- `TEST_ID=my-run-001 make load` (NDJSON now includes `"test_id":"my-run-001"`)
- Or export once in your shell: `export TEST_ID=my-run-001` and then run `make smoke`, `make load`.
- Filter in FreeRADIUS logs by Calling-Station-Id, or filter NDJSON: e.g., `jq 'select(.test_id=="my-run-001")' logs/steady.ndjson`

Makefile helpers for filtering by TEST_ID:
- `TEST_ID=my-run-001 make parse` — parses only records with that `test_id`
- `TEST_ID=my-run-001 make filter` — writes `logs/filtered-my-run-001.ndjson`

## What it does
- FreeRADIUS runs with a permissive client config and a simple users file:
  - Client `localdev` accepts all IPs with secret `testing123`
  - Users:
    - `testuser` / `pass123`
    - `user0000`..`user0999` with `pass123`
- Go client:
  - Smoke: one Access-Request → expects Access-Accept
  - Load: generates Access-Requests at target RPS with configurable workers and timeouts
  - Emits NDJSON per request to stdout with:
    - `ts`, `phase`, `latency_ms`, `code`, `err`, `bytes_in`, `bytes_out`
 - Docker Compose:
   - Image `freeradius/freeradius-server:3.2.3`
   - Healthcheck uses `radclient` to validate Access-Accept
   - Ports: 1812/udp (auth), 1813/udp (acct)

## Tuning RPS/Workers
- Edit `configs/example.env` or export env vars:
  - `RPS` (default 200)
  - `WORKERS` (default 512)
  - `RADIUS_TIMEOUT` (default 2s)
  - Phase durations: `WARMUP`, `STEADY`, `SPIKE`
  - Spike multiplier: `SPIKE_MULT`
- Use `make load` for steady-only or `make spike` for spike-only. The full warmup, steady and spike sequence is the client's default (`-phase=all`) and has no Makefile target: run `mkdir -p logs && go run ./cmd/load | tee logs/all.ndjson`.

## Troubleshooting
- UDP drops / MTU:
  - High RPS over localhost/bridged networks can drop packets; consider reducing `RPS` or increasing `WORKERS`, and check Docker network settings.
- Secrets mismatch:
  - If `RADIUS_SECRET` is wrong, you’ll see `Access-Reject` or timeouts. Ensure `clients.conf` and client secret match (`testing123`).
- macOS / WSL UDP throttling:
  - Some environments throttle UDP bursts; use higher `WORKERS`, lower `RPS`, or run on Linux.
- FreeRADIUS modules:
  - This PoC sticks to `files` + `pap`. Disable EAP/TTLS or other modules if they add noise or overhead for your tests.
 - Apple Silicon (arm64):
   - docker-compose pins `platform: linux/amd64` for the FreeRADIUS image. Ensure Docker Desktop supports x86_64 emulation.

## Debian VM (on Windows)
- Install Docker inside Debian VM:
  - `sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg`
  - `sudo install -m 0755 -d /etc/apt/keyrings`
  - `curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg`
  - `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release; echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
  - `sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin`
  - `sudo usermod -aG docker $USER && newgrp docker`

- Clone and run in the VM:
  - `git clone <repo-url> && cd radius-load-poc`
  - `make up && make smoke`
  - `make load && make parse`

- CPU/arch notes:
  - Debian x86_64 VM: works as-is.
  - Debian arm64 VM: override the platform to avoid emulation.
    - Create `docker-compose.override.yml` locally with:
      ```yaml
      services:
        radius:
          platform: linux/arm64
      ```
    - Then run: `docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --wait`

- Networking from Windows host:
  - Use a bridged adapter so Windows can reach the VM IP directly, or
  - With NAT, port-forward UDP 1812 and 1813 to the VM.
  - Open Debian firewall if enabled: `sudo ufw allow 1812/udp && sudo ufw allow 1813/udp`

- radclient:
  - `make radclient` runs radclient inside the container; no host install is needed.

- Performance tips in VMs:
  - Allocate sufficient vCPU/RAM.
  - Prefer bridged networking; NAT often adds jitter/drops for high UDP rates.
  - Tune `RPS`, `WORKERS`, and `RADIUS_TIMEOUT` in `configs/example.env` to match VM capacity.

## Limits
Read the numbers with these in mind:
- The client paces requests with a ticker but never exceeds `WORKERS` requests in flight. When all workers are busy it waits, so the achieved rate can fall below `RPS`, and that waiting time is not part of any recorded latency.
- Latency percentiles include failed requests. A timed-out request is recorded at roughly `RADIUS_TIMEOUT`.
- Any error from the client is recorded with `"code":"timeout"`; the `err` field carries the actual error.
- Only PAP against the `files` module is exercised, from one client machine, with one shared password for all synthetic users.
- On Apple Silicon the FreeRADIUS image runs under x86_64 emulation, so absolute latencies there say little about a real server.
- There are no automated tests or CI; `make lint` runs `go vet`.

## Notes
- EAP/TTLS, TLS setup, and advanced policies are intentionally omitted for this PoC.
- NDJSON file outputs are kept under `logs/` via `tee`.
- Format and vet:
  - `make fmt`
  - `make lint`

Security note: the repo stores only `raddb/mods-config/files/authorize.example`.
The actual `authorize` with plaintext demo creds is generated locally by `make init` and is gitignored.
