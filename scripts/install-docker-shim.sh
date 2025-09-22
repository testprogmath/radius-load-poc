#!/usr/bin/env bash
set -euo pipefail

# Installer for the flinkord Docker wrapper
# - Installs a small launcher at /usr/local/bin/flinkord
# - The launcher runs the published Docker image with SOPS + Age secret management and mounts ~/.flinkord
# - On Apple Silicon, it uses --platform=linux/amd64 until multi-arch images are published

REGISTRY="europe-west3-docker.pkg.dev"
REPO="flink-core-shared/flinkord-cli/flinkord-cli"
GITHUB_REPO="goflink/flinkord-cli"

# Function to get commit hash for latest release using GitHub CLI
get_release_commit() {
  if command -v gh >/dev/null 2>&1; then
    # Get the target commitish for the latest release
    COMMIT_HASH=$(gh release view --repo "$1" --json targetCommitish --jq '.targetCommitish' 2>/dev/null)
    if [ "$COMMIT_HASH" = "main" ] || [ -z "$COMMIT_HASH" ]; then
      # If release points to main, get the latest commit hash
      gh api "repos/$1/git/refs/heads/main" --jq '.object.sha' 2>/dev/null | head -c 7
    else
      # Use the specific commit hash, truncated to 7 characters
      echo "$COMMIT_HASH" | head -c 7
    fi
  else
    # Fallback: get latest commit hash directly
    curl --silent "https://api.github.com/repos/$1/commits/main" 2>/dev/null | \
    grep '"sha":' | \
    head -1 | \
    sed -E 's/.*"([^"]+)".*/\1/' | head -c 7 || true
  fi
}

# Get commit hash for latest release
COMMIT_HASH=$(get_release_commit "$GITHUB_REPO")
if [ -z "$COMMIT_HASH" ]; then
  echo "Failed to fetch commit hash from GitHub. Using fallback 4027972" >&2
  COMMIT_HASH="4027972"
fi

# Default to image with commit hash; allow override via FLINKORD_IMAGE env var at install time
DEFAULT_IMAGE="$REGISTRY/$REPO:$COMMIT_HASH"
TARGET="/usr/local/bin/flinkord"
ALT_TARGET="/usr/local/bin/flinkord-docker"
EXISTING_BIN="$(command -v flinkord || true)"

tmp="$(mktemp)"
cat >"$tmp" <<WRAP
#!/usr/bin/env bash
set -euo pipefail

# Ensure HOME is set
HOME="\${HOME:-\$(cd ~ && pwd)}"

# You can override the image at runtime with FLINKORD_IMAGE env var
IMAGE_DEFAULT="$DEFAULT_IMAGE"
IMAGE="\${FLINKORD_IMAGE:-\$IMAGE_DEFAULT}"

# Choose container engine: prefer docker, fallback to podman
if command -v docker >/dev/null 2>&1; then
  ENGINE="docker"
elif command -v podman >/dev/null 2>&1; then
  ENGINE="podman"
else
  echo "Error: neither docker nor podman found in PATH" >&2
  exit 1
fi

# Platform args for fallback only (prefer native first)
PLATFORM_ARGS=()
ARCH="$(uname -m)"

# Ensure HOME is set
HOME="${HOME:-$(cd ~ && pwd)}"

# Ensure config dir exists and is mounted inside the container
mkdir -p "$HOME/.flinkord"

# If local Google ADC creds exist, prepare env + mount for GCS access
EXTRA_ENV_ARGS=()
EXTRA_MOUNT_ARGS=()
ADC_FILE="$HOME/.config/gcloud/application_default_credentials.json"
if [ -f "$ADC_FILE" ]; then
  EXTRA_ENV_ARGS+=("-e" "GOOGLE_APPLICATION_CREDENTIALS=/home/nodejs/.config/gcloud/application_default_credentials.json")
  EXTRA_MOUNT_ARGS+=("-v" "$HOME/.config/gcloud:/home/nodejs/.config/gcloud:ro")
fi

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

pull_native_or_fallback() {
  # Try native pull first
  if ! "$ENGINE" pull -q "$IMAGE" >/dev/null 2>&1; then
    # On arm64 hosts, fallback to amd64 emulation
    if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
      if [ "$ENGINE" = "docker" ]; then
        "$ENGINE" pull -q --platform=linux/amd64 "$IMAGE" >/dev/null 2>&1 || true
      else
        "$ENGINE" pull -q --arch=amd64 "$IMAGE" >/dev/null 2>&1 || true
      fi
    fi
  fi
}

if [ "${FLINKORD_ALWAYS_PULL:-0}" = "1" ]; then
  maybe_login
  pull_native_or_fallback
else
  if ! has_local_image; then
    maybe_login
    pull_native_or_fallback
  fi
fi

# If the locally available image is amd64 on an arm64 host, set fallback run args
if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
  if "$ENGINE" image inspect "$IMAGE" 2>/dev/null | grep -q '"Architecture": "amd64"'; then
    if [ "$ENGINE" = "docker" ]; then
      PLATFORM_ARGS=("--platform=linux/amd64")
    else
      PLATFORM_ARGS=("--arch=amd64")
    fi
  fi
fi

exec "$ENGINE" run --rm -it ${PLATFORM_ARGS[@]+"${PLATFORM_ARGS[@]}"} \
  -e DOTENV_CONFIG_QUIET=true \
  -e DOTENV_CONFIG_OVERRIDE=true \
  -e NPM_CONFIG_UPDATE_NOTIFIER=false \
  -e NO_UPDATE_NOTIFIER=1 \
  ${EXTRA_ENV_ARGS[@]+"${EXTRA_ENV_ARGS[@]}"} \
  -v "$HOME/.flinkord:/home/nodejs/.flinkord" \
  ${EXTRA_MOUNT_ARGS[@]+"${EXTRA_MOUNT_ARGS[@]}"} \
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
echo ""
echo "🔐 The image includes SOPS + Age secret management for secure credential storage"

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
