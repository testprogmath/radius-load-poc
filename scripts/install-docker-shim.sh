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

# Try a quiet pull once; if it fails, try to login, then continue to run (which will pull if needed)
"$ENGINE" pull -q "${PLATFORM_ARGS[@]}" "$IMAGE" >/dev/null 2>&1 || maybe_login

exec "$ENGINE" run --rm -it "${PLATFORM_ARGS[@]}" \
  -v "$HOME/.flinkord:/home/nodejs/.flinkord" \
  "$IMAGE" "$@"
WRAP

# Install the wrapper into PATH
sudo install -m 0755 "$tmp" "$TARGET"
rm -f "$tmp"

echo "Installed $TARGET"
echo "Usage: flinkord --help"
echo "Set FLINKORD_IMAGE to pin a specific tag, e.g.:"
echo "  FLINKORD_IMAGE=$DEFAULT_IMAGE flinkord --version"
