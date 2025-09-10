#!/usr/bin/env bash
set -euo pipefail

# Installer for the flinkord Docker wrapper
# - Installs a small launcher at /usr/local/bin/flinkord
# - The launcher runs the published Docker image and mounts ~/.flinkord
# - On Apple Silicon, it uses --platform=linux/amd64 until multi-arch images are published

REGISTRY="europe-west3-docker.pkg.dev"
REPO="flink-core-shared/flinkord-cli/flinkord-cli"
# Default to :latest; allow override via FLINKORD_IMAGE env var at install time
DEFAULT_IMAGE="$REGISTRY/$REPO:latest"
TARGET="/usr/local/bin/flinkord"
ALT_TARGET="/usr/local/bin/flinkord-docker"
EXISTING_BIN="$(command -v flinkord || true)"

tmp="$(mktemp)"
cat >"$tmp" <<'WRAP'
#!/usr/bin/env bash
set -euo pipefail

# You can override the image at runtime with FLINKORD_IMAGE env var
IMAGE_DEFAULT="europe-west3-docker.pkg.dev/flink-core-shared/flinkord-cli/flinkord-cli:latest"
IMAGE="${FLINKORD_IMAGE:-$IMAGE_DEFAULT}"

# Choose container engine: prefer docker, fallback to podman
if command -v docker >/dev/null 2>&1; then
  ENGINE="docker"
elif command -v podman >/dev/null 2>&1; then
  ENGINE="podman"
else
  echo "Error: neither docker nor podman found in PATH" >&2
  exit 1
fi

# On Apple Silicon, force amd64 until multi-arch images are published
# Docker uses --platform, Podman uses --arch
PLATFORM_ARGS=()
ARCH="$(uname -m)"
if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
  if [ "$ENGINE" = "docker" ]; then
    PLATFORM_ARGS=("--platform=linux/amd64")
  else
    PLATFORM_ARGS=("--arch=amd64")
  fi
fi

# Ensure config dir exists and is mounted inside the container
mkdir -p "$HOME/.flinkord"

# Optional: if gcloud is available and we're not logged in, try Artifact Registry login
maybe_login() {
  if command -v gcloud >/dev/null 2>&1; then
    echo "Attempting Artifact Registry login via gcloud..." >&2
    if [ "$ENGINE" = "docker" ]; then
      gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin europe-west3-docker.pkg.dev >/dev/null 2>&1 || true
    else
      gcloud auth print-access-token | podman login -u oauth2accesstoken --password-stdin europe-west3-docker.pkg.dev >/dev/null 2>&1 || true
    fi
  fi
}

# Pull policy: only pull if missing, unless FLINKORD_ALWAYS_PULL=1
has_local_image() {
  "$ENGINE" image inspect "$IMAGE" >/dev/null 2>&1
}

if [ "${FLINKORD_ALWAYS_PULL:-0}" = "1" ]; then
  maybe_login
  "$ENGINE" pull -q "${PLATFORM_ARGS[@]}" "$IMAGE" >/dev/null 2>&1 || true
else
  if ! has_local_image; then
    maybe_login
    "$ENGINE" pull -q "${PLATFORM_ARGS[@]}" "$IMAGE" >/dev/null 2>&1 || true
  fi
fi

exec "$ENGINE" run --rm -it "${PLATFORM_ARGS[@]}" \
  -e DOTENV_CONFIG_QUIET=true \
  -e DOTENV_CONFIG_OVERRIDE=true \
  -e NPM_CONFIG_UPDATE_NOTIFIER=false \
  -e NO_UPDATE_NOTIFIER=1 \
  -v "$HOME/.flinkord:/home/nodejs/.flinkord" \
  "$IMAGE" "$@"
WRAP

# Install the wrapper into PATH
sudo install -m 0755 "$tmp" "$TARGET"
rm -f "$tmp"

# Also provide an alternative launcher name that users can call explicitly
sudo ln -sf "$TARGET" "$ALT_TARGET"

echo "Installed $TARGET"
echo "Also available as: $ALT_TARGET"
echo "Usage: flinkord --help"
echo "Set FLINKORD_IMAGE to pin a specific tag, e.g.:"
echo "  FLINKORD_IMAGE=$DEFAULT_IMAGE flinkord --version"

# If another flinkord exists earlier in PATH, warn the user
if [ -n "$EXISTING_BIN" ] && [ "$EXISTING_BIN" != "$TARGET" ]; then
  echo "" >&2
  echo "Warning: another 'flinkord' found at: $EXISTING_BIN" >&2
  echo "It may shadow the new Docker/Podman wrapper at $TARGET." >&2
  echo "Fix options:" >&2
  echo "  1) Ensure /usr/local/bin precedes that path in \$PATH" >&2
  echo "  2) Run the wrapper explicitly: $TARGET (or use $ALT_TARGET)" >&2
  echo "  3) Remove the global npm CLI: npm uninstall -g @flink/flinkord-cli" >&2
fi
