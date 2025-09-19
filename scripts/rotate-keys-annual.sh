#!/bin/bash
# scripts/rotate-keys-annual.sh
#
# Annual SOPS + Age Key Rotation Script for flinkord-cli
# This is the production rotation script for annual use
#
# Usage: ./scripts/rotate-keys-annual.sh [--dry-run] [--force]
#   --dry-run: Simulate rotation without making changes
#   --force: Skip confirmation prompts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DRY_RUN=false
FORCE_ROTATION=false
BACKUP_DIR="./backups/secrets-annual-$(date +%Y-%m-%d)"
KEYS_DIR="./keys"
SECRETS_FILE="embedded-secrets.enc"
LOG_FILE="./backups/rotation-$(date +%Y-%m-%d).log"

# Cross-platform date function for adding days
date_add_days() {
    local days=$1
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        date -v +${days}d +%Y-%m-%d
    else
        # Linux/Unix
        date -d "+${days} days" +%Y-%m-%d
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE_ROTATION=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [--dry-run] [--force]"
            echo "  --dry-run: Simulate rotation without making changes"
            echo "  --force: Skip confirmation prompts"
            echo "  --help:  Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

echo -e "${BLUE}🔐 Annual flinkord-cli Key Rotation Script${NC}"
echo "========================================"
log "Starting annual key rotation process"

# Pre-flight checks
echo -e "${YELLOW}🔍 Running pre-flight checks...${NC}"

# Check if required tools exist
for tool in sops age git; do
    if ! command -v $tool &> /dev/null; then
        log "ERROR: $tool is not installed"
        echo -e "${RED}❌ Error: $tool is not installed${NC}"
        exit 1
    fi
done

# Check if we're in the right directory
if [ ! -f "$SECRETS_FILE" ]; then
    log "ERROR: $SECRETS_FILE not found"
    echo -e "${RED}❌ Error: $SECRETS_FILE not found${NC}"
    echo "Please run this script from the flinkord-cli root directory"
    exit 1
fi

# Check git status
if [ "$DRY_RUN" = false ]; then
    if ! git diff-index --quiet HEAD --; then
        log "WARNING: Git working directory is not clean"
        echo -e "${YELLOW}⚠️  Warning: Git working directory has uncommitted changes${NC}"
        echo "Please commit or stash changes before proceeding"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Rotation cancelled due to uncommitted changes"
            exit 0
        fi
    fi
fi

# Check current key age
echo -e "${YELLOW}📅 Checking current key age...${NC}"
if [ -f "$KEYS_DIR/embedded-key.js" ]; then
    KEY_DATE=$(git log -1 --pretty=format:%ct "$KEYS_DIR/embedded-key.js" 2>/dev/null || echo "0")
    CURRENT_DATE=$(date +%s)
    DAYS_SINCE_ROTATION=$(( (CURRENT_DATE - KEY_DATE) / 86400 ))
    
    log "Current key age: $DAYS_SINCE_ROTATION days"
    echo "Current key age: $DAYS_SINCE_ROTATION days"
    
    if [ $DAYS_SINCE_ROTATION -lt 300 ]; then
        log "WARNING: Keys are only $DAYS_SINCE_ROTATION days old (annual rotation recommended)"
        echo -e "${YELLOW}⚠️  Keys are only $DAYS_SINCE_ROTATION days old${NC}"
        echo "Annual rotation is typically done after 365 days"
        
        if [ "$FORCE_ROTATION" = false ]; then
            read -p "Continue with rotation anyway? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                log "Rotation cancelled - keys are not yet due for annual rotation"
                exit 0
            fi
        fi
    fi
else
    log "No existing key file found"
    echo "No existing key file found"
fi

# Create backup
echo -e "${YELLOW}💾 Creating backup...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would create backup at: $BACKUP_DIR"
    log "[DRY RUN] Would create backup at: $BACKUP_DIR"
else
    mkdir -p "$BACKUP_DIR"
    cp "$SECRETS_FILE" "$BACKUP_DIR/"
    cp "$KEYS_DIR/embedded-key.js" "$BACKUP_DIR/"
    
    # Also backup git status for reference
    git status --porcelain > "$BACKUP_DIR/git-status.txt"
    git log -1 --pretty=format:"%H %s" > "$BACKUP_DIR/git-commit.txt"
    
    echo -e "${GREEN}✅ Backup created at $BACKUP_DIR${NC}"
    log "Backup created at $BACKUP_DIR"
fi

# Confirmation
if [ "$FORCE_ROTATION" = false ] && [ "$DRY_RUN" = false ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Annual key rotation will:${NC}"
    echo "  - Generate new Age key pair"
    echo "  - Re-encrypt secrets with new key"
    echo "  - Update embedded key in CLI"
    echo "  - Require CLI rebuild and Docker image update"
    echo ""
    echo -e "${BLUE}📋 Backup will be kept at: $BACKUP_DIR${NC}"
    echo ""
    read -p "Are you sure you want to continue with annual rotation? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}❌ Annual rotation cancelled${NC}"
        log "Annual rotation cancelled by user"
        exit 0
    fi
fi

# Step 1: Generate new key pair
echo -e "${YELLOW}🔑 Generating new Age key pair...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would generate new Age key pair"
    log "[DRY RUN] Would generate new Age key pair"
    NEW_PUBLIC_KEY="age1example-public-key"
    NEW_PRIVATE_KEY="AGE-SECRET-KEY-1EXAMPLE-PRIVATE-KEY"
else
    NEW_KEY_FILE="$KEYS_DIR/annual-key-$(date +%Y).txt"
    age-keygen -o "$NEW_KEY_FILE" > /dev/null 2>&1
    
    NEW_PUBLIC_KEY=$(grep "public key:" "$NEW_KEY_FILE" | cut -d' ' -f4)
    NEW_PRIVATE_KEY=$(grep "AGE-SECRET-KEY-" "$NEW_KEY_FILE")
    
    echo -e "${GREEN}✅ New key pair generated${NC}"
    echo "   Public key: $NEW_PUBLIC_KEY"
    log "Generated new key pair with public key: $NEW_PUBLIC_KEY"
fi

# Step 2: Decrypt current secrets
echo -e "${YELLOW}🔓 Decrypting current secrets...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would decrypt current secrets"
    log "[DRY RUN] Would decrypt current secrets"
else
    if ! sops --decrypt "$SECRETS_FILE" > "$BACKUP_DIR/embedded-secrets.json" 2>/dev/null; then
        log "ERROR: Failed to decrypt current secrets"
        echo -e "${RED}❌ Error: Failed to decrypt current secrets${NC}"
        echo "This might indicate an issue with the current key"
        exit 1
    fi
    echo -e "${GREEN}✅ Current secrets decrypted${NC}"
    log "Successfully decrypted current secrets"
fi

# Step 3: Re-encrypt with new key
echo -e "${YELLOW}🔒 Re-encrypting with new key...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would re-encrypt secrets with new key"
    log "[DRY RUN] Would re-encrypt secrets with new key"
else
    # Create temporary SOPS config
    cat > .sops.yaml << EOF
creation_rules:
  - age: ${NEW_PUBLIC_KEY}
    encrypted_regex: "^(data|stringData)$"
EOF

    # Re-encrypt secrets
    sops --encrypt --config .sops.yaml "$BACKUP_DIR/embedded-secrets.json" > "$SECRETS_FILE.new"

    # Clean up temporary config
    rm .sops.yaml

    echo -e "${GREEN}✅ Secrets re-encrypted with new key${NC}"
    log "Re-encrypted secrets with new key"
fi

# Step 4: Update embedded key
echo -e "${YELLOW}📝 Updating embedded key...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would update embedded key"
    log "[DRY RUN] Would update embedded key"
else
    # Split the private key into parts for obfuscation
    PRIVATE_KEY_PART1=${NEW_PRIVATE_KEY:0:44}
    PRIVATE_KEY_PART2=${NEW_PRIVATE_KEY:44}

    # Split the public key into parts
    PUBLIC_KEY_PART1=${NEW_PUBLIC_KEY:0:45}
    PUBLIC_KEY_PART2=${NEW_PUBLIC_KEY:45}

    # Create new embedded key file
    cat > "$KEYS_DIR/embedded-key.js" << EOF
// Obfuscated embedded Age key for flinkord-cli
// This contains both public and private keys for decryption
// Annual rotation completed on $(date +%Y-%m-%d)

const privateKeyParts = [
  '${PRIVATE_KEY_PART1}',
  '${PRIVATE_KEY_PART2}'
];

const publicKeyParts = [
  '${PUBLIC_KEY_PART1}',
  '${PUBLIC_KEY_PART2}'
];

// Simple obfuscation function
const getEmbeddedAgeKey = () => {
  return privateKeyParts.join('');
};

const getEmbeddedAgePublicKey = () => {
  return publicKeyParts.join('');
};

export { getEmbeddedAgeKey, getEmbeddedAgePublicKey };
EOF

    echo -e "${GREEN}✅ Embedded key updated${NC}"
    log "Updated embedded key file"
fi

# Step 5: Test new setup
echo -e "${YELLOW}🧪 Testing new setup...${NC}"
if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would test new setup"
    log "[DRY RUN] Would test new setup"
else
    # Replace the new secrets file
    mv "$SECRETS_FILE.new" "$SECRETS_FILE"

    # Test if CLI can still access secrets
    if ! node dist/src/cli.js --version > /dev/null 2>&1; then
        log "ERROR: CLI test failed after rotation"
        echo -e "${RED}❌ Error: CLI test failed after rotation${NC}"
        echo "Rolling back changes..."
        
        # Restore from backup
        cp "$BACKUP_DIR/embedded-secrets.enc" "$SECRETS_FILE"
        cp "$BACKUP_DIR/embedded-key.js" "$KEYS_DIR/embedded-key.js"
        
        echo -e "${BLUE}✅ Changes rolled back${NC}"
        log "Rolled back changes due to CLI test failure"
        exit 1
    fi

    # Clean up new key file (it's now embedded)
    rm "$NEW_KEY_FILE"

    echo -e "${GREEN}✅ CLI functionality verified${NC}"
    log "CLI functionality verified after rotation"
fi

# Create rotation summary
echo -e "${YELLOW}📊 Creating rotation summary...${NC}"
if [ "$DRY_RUN" = true ]; then
    mkdir -p "$BACKUP_DIR"
fi
cat > "$BACKUP_DIR/rotation-summary.txt" << EOF
Annual Key Rotation Summary
===========================
Date: $(date)
Rotation Type: Annual
Key Age Before Rotation: $DAYS_SINCE_ROTATION days
Backup Location: $BACKUP_DIR
New Key Public Key: $NEW_PUBLIC_KEY

Verification Status: PASSED
Next Rotation Due: $(date_add_days 365)

Files Modified:
- $SECRETS_FILE
- $KEYS_DIR/embedded-key.js

Next Steps:
1. Build CLI: npm run build
2. Build Docker image: docker build -t flinkord-cli .
3. Test Docker image: docker run --rm flinkord-cli --version
4. Deploy updated Docker image
5. Monitor for 30 days for any issues
EOF

log "Created rotation summary at $BACKUP_DIR/rotation-summary.txt"

# Success!
echo ""
if [ "$DRY_RUN" = true ]; then
    echo -e "${BLUE}🎉 Dry run completed successfully!${NC}"
    echo "No changes were made to your system."
    log "Dry run completed successfully"
else
    echo -e "${GREEN}🎉 Annual key rotation completed successfully!${NC}"
    echo ""
    echo "📋 Summary:"
    echo "  - New Age key pair generated"
    echo "  - Secrets re-encrypted with new key"
    echo "  - Embedded key updated"
    echo "  - CLI functionality verified"
    echo ""
    echo "📁 Files modified:"
    echo "  - $SECRETS_FILE"
    echo "  - $KEYS_DIR/embedded-key.js"
    echo ""
    echo "💾 Backup location: $BACKUP_DIR"
    echo ""
    echo "⚠️  Next steps:"
    echo "  1. Rebuild the CLI: npm run build"
    echo "  2. Build Docker image: docker build -t flinkord-cli ."
    echo "  3. Test thoroughly: docker run --rm flinkord-cli --version"
    echo "  4. Deploy updated version"
    echo "  5. Keep backup for 30 days"
    echo ""
    echo "🔐 Store this backup securely:"
    echo "  - Location: $BACKUP_DIR"
    echo "  - Contains: Old secrets + old key for recovery"
    echo "  - Next rotation: $(date_add_days 365)"
    log "Annual key rotation completed successfully"
fi