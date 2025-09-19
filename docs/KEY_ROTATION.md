# SOPS + Age Key Rotation Strategy

## Overview

This document outlines the key rotation strategy for the flinkord CLI's secret management system using SOPS + Age encryption.

## Current Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Age Key Pair   │───▶│  SOPS Config    │───▶│ Encrypted       │
│ (Public/Private)│    │                 │    │ Secrets File    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
       │                       │                       │
       │                       ▼                       ▼
       │              ┌─────────────────┐    ┌─────────────────┐
       │              │   SecretsMgr    │    │ ~/.flinkord/    │
       │              │   Class         │    │ config.json     │
       │              └─────────────────┘    └─────────────────┘
       │                       │                       │
       ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Key Rotation    │    │ Runtime Secret  │    │ CLI Commands    │
│ Scripts        │    │ Decryption      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Rotation Approaches

### Approach 1: Dual Key Period (Recommended)

**Strategy**: Maintain two active keys during rotation period

**Steps:**

1. **Generate New Key Pair**
```bash
# Generate new Age key pair
age-keygen -o keys/new-key.txt

# Extract public key for encryption
grep "public key:" keys/new-key.txt | cut -d' ' -f4
```

2. **Re-encrypt Secrets with Both Keys**
```bash
# Get current private key
CURRENT_PRIVATE_KEY=$(node -e "console.log(require('./keys/embedded-key.js').getEmbeddedAgeKey())")

# Create SOPS config with both keys
cat > .sops.yaml << EOF
creation_rules:
  - age: ${CURRENT_PUBLIC_KEY},${NEW_PUBLIC_KEY}
    encrypted_regex: "^(data|stringData)$"
EOF

# Re-encrypt existing secrets
sops --encrypt --config .sops.yaml embedded-secrets.json > embedded-secrets.enc
```

3. **Update Embedded Key**
```bash
# Update embedded-key.js with new key (keeping old for rotation period)
cat > keys/embedded-key.js << 'EOF'
// Obfuscated embedded Age keys for flinkord-cli
// Contains both old and new keys for rotation period

const oldPrivateKeyParts = [
  'AGE-SECRET-KEY-1CXHPKRAPN4CK06PJ6RQK2AUPU235F0QG7',
  'E5GTEZH5HNEYWU04EXSZ80FYG'
];

const newPrivateKeyParts = [
  'AGE-SECRET-KEY-NEW1CXHPKRAPN4CK06PJ6RQK2AUPU235F0QG7',
  'E5GTEZH5HNEYWU04EXSZ80FYNEW'
];

// Try new key first, fallback to old key
const getEmbeddedAgeKey = () => {
  try {
    return newPrivateKeyParts.join('');
  } catch {
    return oldPrivateKeyParts.join('');
  }
};

const getEmbeddedAgePublicKey = () => {
  return 'age1new-public-key-here';
};

export { getEmbeddedAgeKey, getEmbeddedAgePublicKey };
EOF
```

4. **Deploy and Monitor**
- Deploy updated CLI with both keys
- Monitor for any decryption failures
- After 30 days, remove old key

### Approach 2: Sequential Rotation

**Strategy**: Rotate keys in sequence with immediate switchover

**Steps:**

1. **Prepare Rotation Package**
```bash
#!/bin/bash
# scripts/rotate-keys.sh

set -e

# 1. Generate new key
echo "Generating new Age key pair..."
age-keygen -o keys/new-key.txt
NEW_PUBLIC_KEY=$(grep "public key:" keys/new-key.txt | cut -d' ' -f4)
NEW_PRIVATE_KEY=$(grep "AGE-SECRET-KEY-" keys/new-key.txt)

# 2. Decrypt current secrets
echo "Decrypting current secrets..."
sops --decrypt embedded-secrets.enc > embedded-secrets.json

# 3. Re-encrypt with new key
echo "Re-encrypting with new key..."
cat > .sops.yaml << EOF
creation_rules:
  - age: ${NEW_PUBLIC_KEY}
    encrypted_regex: "^(data|stringData)$"
EOF

sops --encrypt --config .sops.yaml embedded-secrets.json > embedded-secrets.enc.new

# 4. Update embedded key
echo "Updating embedded key..."
cat > keys/embedded-key.js << EOF
// Obfuscated embedded Age key for flinkord-cli
const privateKeyParts = [
  '${NEW_PRIVATE_KEY:0:44}',
  '${NEW_PRIVATE_KEY:44:8}'
];

const publicKeyParts = [
  '${NEW_PUBLIC_KEY:0:45}',
  '${NEW_PUBLIC_KEY:45:20}'
];

const getEmbeddedAgeKey = () => {
  return privateKeyParts.join('');
};

const getEmbeddedAgePublicKey = () => {
  return publicKeyParts.join('');
};

export { getEmbeddedAgeKey, getEmbeddedAgePublicKey };
EOF

# 5. Clean up
rm embedded-secrets.json .sops.yaml keys/new-key.txt
mv embedded-secrets.enc.new embedded-secrets.enc

echo "Key rotation complete!"
```

### Approach 3: External Key Management

**Strategy**: Use external key management system

**Benefits:**
- Centralized key management
- Audit trails
- Automated rotation policies
- Revocation capabilities

**Implementation:**
```yaml
# .sops.yaml with external key reference
creation_rules:
  - age: ${EXTERNAL_KEY_REFERENCE}
    encrypted_regex: "^(data|stringData)$"
key_groups:
  - age:
    - *external_key
```

## Automation Scripts

### 1. Health Check Script
```bash
#!/bin/bash
# scripts/health-check.sh

# Test if current secrets can be decrypted
if ! sops --decrypt embedded-secrets.enc > /dev/null 2>&1; then
    echo "❌ Secret decryption failed - rotation may be needed"
    exit 1
fi

# Test CLI functionality
if ! node dist/src/cli.js --version > /dev/null 2>&1; then
    echo "❌ CLI functionality failed"
    exit 1
fi

echo "✅ All health checks passed"
```

### 2. Rotation Validation Script
```bash
#!/bin/bash
# scripts/validate-rotation.sh

# Validate that new secrets work with both old and new keys
echo "Testing old key decryption..."
OLD_KEY_TEST=$(SOPS_AGE_KEY_FILE=keys/old-key.txt sops --decrypt embedded-secrets.enc)

echo "Testing new key decryption..."
NEW_KEY_TEST=$(SOPS_AGE_KEY_FILE=keys/new-key.txt sops --decrypt embedded-secrets.enc)

if [ "$OLD_KEY_TEST" = "$NEW_KEY_TEST" ]; then
    echo "✅ Rotation validation successful"
else
    echo "❌ Rotation validation failed - secrets don't match"
    exit 1
fi
```

## Recommended Rotation Schedule

### Quarterly Rotation (Recommended)
- **Frequency**: Every 90 days
- **Overlap**: 30-day dual-key period
- **Automation**: CI/CD pipeline with health checks

### Annual Rotation (Minimum)
- **Frequency**: Every 365 days
- **Overlap**: 60-day dual-key period
- **Manual**: Requires team coordination

## Emergency Rotation

**Trigger Events:**
- Suspected key compromise
- Team member departure
- Security audit findings
- Regulatory requirements

**Emergency Process:**
1. Immediate key generation
2. Force re-encryption of all secrets
3. Deploy new keys immediately
4. Revoke old keys
5. Audit all secret access

## Monitoring and Alerts

### Metrics to Monitor
- Secret decryption success rate
- Key age monitoring
- Access pattern anomalies
- Failed authentication attempts

### Alerting
- Decryption failure alerts
- Key age warnings (after 80 days)
- Unusual access patterns
- Rotation completion notifications

## Rollback Strategy

If rotation fails:
1. Keep old keys accessible
2. Use backup of encrypted secrets
3. Restore previous embedded key
4. Re-deploy previous version
5. Investigate failure root cause

## Documentation Updates

After each rotation:
- Update this document with new key details
- Record rotation date and reason
- Document any issues encountered
- Update monitoring thresholds