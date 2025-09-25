# radius-load-poc

Для русской версии перейдите по ссылке: [README.ru.md](README.ru.md)

Local FreeRADIUS load testing PoC using Docker and a Go client (layeh.com/radius). Includes smoke test, RPS-controlled load (steady/spike), NDJSON metrics, and a parser.

Topics: radius, freeradius, load-testing, benchmarking, golang, ndjson, docker, docker-compose, radclient, udp, performance, spike-testing

## Prereqs
- Docker and Docker Compose
- Go 1.22+

## Quickstart
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
- Use `make load` for steady-only or `make spike` for spike-only. Full sequence runs with `-phase=all` (default).

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

## Notes
- EAP/TTLS, TLS setup, and advanced policies are intentionally omitted for this PoC.
- NDJSON file outputs are kept under `logs/` via `tee`.
- Format and vet:
  - `make fmt`
  - `make lint`
