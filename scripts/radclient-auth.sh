#!/usr/bin/env bash
set -euo pipefail

ADDR="${RADIUS_ADDR:-127.0.0.1:1812}"
SECRET="${RADIUS_SECRET:-testing123}"

# Build request attributes
REQ="User-Name = testuser, User-Password = pass123, NAS-IP-Address = 127.0.0.1"

# Send Access-Request; require Access-Accept in output
OUT="$(echo "$REQ" | radclient -sx "$ADDR" auth "$SECRET" || true)"

echo "$OUT"

if echo "$OUT" | grep -q "Access-Accept"; then
  exit 0
else
  echo "radclient did not receive Access-Accept" >&2
  exit 1
fi

