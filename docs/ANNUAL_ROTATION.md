# Annual Key Rotation Guide

## Overview

This guide explains the semi-automated annual key rotation process for flinkord-cli's SOPS + Age secret management system.

## Automation Features

### GitHub Actions Monitoring
The `.github/workflows/key-rotation-reminder.yml` workflow automatically:
- ✅ **Checks key age daily** (runs January 1st annually)
- ✅ **Creates GitHub issues** when rotation is due (365 days)
- ✅ **Sends 30-day advance notice** for planning
- ✅ **Optional Slack notifications** (if webhook configured)

### Manual Rotation Script
The `scripts/rotate-keys-annual.sh` script provides:
- ✅ **Comprehensive validation** before rotation
- ✅ **Dry-run mode** for testing (`--dry-run`)
- ✅ **Automatic backups** with detailed logging
- ✅ **CLI functionality testing** after rotation
- ✅ **Rollback capability** if issues occur

## Annual Rotation Process

### 1. Automation Triggers Rotation
```bash
# When GitHub Actions detects keys are 365+ days old:
# - Creates issue titled "🔐 Annual Key Rotation Required"
# - Notifies via Slack if configured
# - Provides detailed checklist
```

### 2. Manual Rotation Execution
```bash
# Test first (always recommended)
./scripts/rotate-keys-annual.sh --dry-run

# Execute actual rotation
./scripts/rotate-keys-annual.sh

# Or skip confirmations
./scripts/rotate-keys-annual.sh --force
```

### 3. Post-Rotation Steps
```bash
# 1. Rebuild CLI
npm run build

# 2. Test CLI functionality
node dist/src/cli.js --version

# 3. Build new Docker image
docker build -t flinkord-cli .

# 4. Test Docker image
docker run --rm flinkord-cli --version

# 5. Deploy updated Docker image
docker push your-registry/flinkord-cli:latest
```

## Setup Instructions

### 1. Enable GitHub Actions
1. Ensure your repository has GitHub Actions enabled
2. The workflow will run automatically on January 1st annually
3. You can also trigger manually: Actions → Key Rotation Reminder → Run workflow

### 2. Optional: Configure Slack Notifications
Add to your repository secrets:
```bash
# Repository Settings → Secrets and variables → Actions
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### 3. Verify Workflow Permissions
Ensure GitHub Actions has permissions to create issues:
```yaml
# .github/workflows/key-rotation-reminder.yml already includes
permissions:
  contents: read
  issues: write
```

## Rotation Schedule

### Timeline
- **Day 0**: Keys rotated
- **Days 1-30**: Monitoring period (keep backup)
- **Day 30**: Remove old backup if everything works
- **Day 335**: 30-day advance notice
- **Day 365**: Next rotation due

### Monitoring Period
After rotation, monitor for:
- CLI command failures
- Docker image issues
- Secret decryption errors
- Build failures

## Dry Run Testing

### Test the Rotation Process
```bash
# Run dry run to see what would happen
./scripts/rotate-keys-annual.sh --dry-run

# Output shows:
# - Backup location
# - Key generation
# - Files that would be modified
# - No actual changes made
```

### Test GitHub Actions Locally
```bash
# Use act to test GitHub Actions locally (if installed)
act -W .github/workflows/key-rotation-reminder.yml

# Or trigger manually from GitHub UI
# Actions → Key Rotation Reminder → Run workflow
```

## Backup and Recovery

### Automatic Backups
The script creates comprehensive backups:
```
backups/secrets-annual-YYYY-MM-DD/
├── embedded-secrets.enc      # Old encrypted secrets
├── embedded-key.js           # Old embedded key
├── git-status.txt           # Git state before rotation
├── git-commit.txt           # Last commit info
├── embedded-secrets.json    # Decrypted secrets (temporary)
├── rotation-summary.txt     # Detailed rotation log
└── rotation.log            # Complete process log
```

### Recovery Process
If rotation fails:
```bash
# Restore from backup
cp backups/secrets-annual-YYYY-MM-DD/embedded-secrets.enc ./embedded-secrets.enc
cp backups/secrets-annual-YYYY-MM-DD/embedded-key.js ./keys/embedded-key.js

# Rebuild and test
npm run build
node dist/src/cli.js --version
```

## Security Considerations

### Backup Security
- Backups contain unencrypted private keys
- Store backups securely (encrypted at rest)
- Delete backups after 30 days
- Monitor backup location access

### Key Generation
- New keys are generated locally, not in CI/CD
- No keys are exposed in logs or outputs
- Private keys are obfuscated in source code
- Public keys are safe to share

## Troubleshooting

### Common Issues

**GitHub Actions not running:**
- Check repository has Actions enabled
- Verify workflow file is in correct location
- Ensure proper permissions are set

**Rotation script fails:**
- Run with `--dry-run` first to diagnose
- Check all required tools are installed (sops, age, git)
- Verify working directory is clean
- Ensure sufficient disk space for backups

**CLI tests fail after rotation:**
- Use automatic rollback feature
- Restore from backup manually
- Check Node.js version compatibility
- Verify Docker build process

**Docker image issues:**
- Rebuild from scratch with `--no-cache`
- Check embedded files are included in Dockerfile
- Verify volume mount permissions
- Test with interactive shell for debugging

## Integration with CI/CD

### Docker Pipeline Example
```yaml
# .github/workflows/docker.yml
name: Build and Deploy Docker Image

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t flinkord-cli .
        
      - name: Test Docker image
        run: docker run --rm flinkord-cli --version
        
      - name: Push to registry
        if: github.ref == 'refs/heads/main'
        run: |
          docker tag flinkord-cli your-registry/flinkord-cli:latest
          docker push your-registry/flinkord-cli:latest
```

### Rotation and Deployment Workflow
```yaml
# Example combined workflow
1. GitHub Actions detects rotation due
2. Creates issue with checklist
3. Team runs rotation script locally
4. Commit and push updated keys
5. CI/CD builds new Docker image
6. Automated tests run
7. Deploy to production
8. Monitor for 30 days
```

## Summary

The semi-automated annual rotation provides:
- ✅ **Minimal manual effort** - GitHub Actions monitors and reminds
- ✅ **Comprehensive safety** - Dry run, backups, rollback capability  
- ✅ **Complete audit trail** - Logs, summaries, GitHub issues
- ✅ **Flexible timing** - Annual schedule with manual override
- ✅ **Production ready** - Docker integration, monitoring, recovery

The system balances automation with security, requiring manual execution for key operations while providing automated monitoring and reminders.