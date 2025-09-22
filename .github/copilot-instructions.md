# Flinkord CLI Development Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

**Bootstrap and build the repository:**
- Install dependencies: `npm install` -- takes 40 seconds first time, ~1 second if cached. NEVER CANCEL. Set timeout to 90+ seconds.
- Build the application: `npm run build` -- takes 5 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
- Run linting: `npm run lint` -- takes 6 seconds. NEVER CANCEL. Set timeout to 30+ seconds.
- Run tests: `npm run test` -- takes 37 seconds. NEVER CANCEL. Set timeout to 90+ seconds.

**Run the CLI:**
- ALWAYS run the build step first: `npm run build`
- Test CLI functionality: `node dist/src/cli.js --version`
- Show help: `node dist/src/cli.js --help`
- View configuration: `node dist/src/cli.js config`

**Docker container usage:**
- Build Docker image: `docker build -t flinkord-cli .` -- can take 10+ minutes. NEVER CANCEL. Set timeout to 30+ minutes.
- Test Docker image: `docker run --rm flinkord-cli --version`
- Interactive Docker shell: `docker run --rm -it --entrypoint /bin/bash flinkord-cli`

## Validation

**ALWAYS run through these validation steps after making changes:**
- Build verification: `npm run build` followed by `node dist/src/cli.js --version`
- Help command test: `node dist/src/cli.js --help` should display all available commands
- Configuration test: `node dist/src/cli.js config` should show merged configuration
- Docker functionality: If Docker changes are made, build and test the container image

**Test scenarios to validate functionality:**
- CLI shows version correctly without errors
- CLI displays help with all commands listed (create, free, deliver, cancel, setup, etc.)
- Configuration command displays the merged config from default.json and user settings
- Docker container can start and run basic commands like --version and --help

**ALWAYS run before committing changes:**
- `npm run lint` -- fix any errors or warnings
- `npm run build` -- ensure clean build with no TypeScript errors
- Test basic CLI functionality as described above

## Build and Test Process

**Build timing expectations:**
- `npm install`: 40 seconds first time, ~1 second if cached (dependency installation). NEVER CANCEL - set timeout to 90+ seconds.
- `npm run build`: 5 seconds (TypeScript compilation). NEVER CANCEL - set timeout to 60+ seconds.
- `npm run lint`: 6 seconds (ESLint validation). NEVER CANCEL - set timeout to 30+ seconds.
- `npm run test`: 37 seconds (Vitest test suite). NEVER CANCEL - set timeout to 90+ seconds.

**Note:** Tests require staging environment secrets and will fail without proper configuration. This is expected behavior in development environments.

**Docker build timing:**
- `docker build`: 10-30 minutes depending on network and cache. NEVER CANCEL - set timeout to 45+ minutes.

## Important Code Locations

**Core CLI entry points:**
- `/src/cli.ts` - Main CLI application entry point with all command definitions
- `/src/commands/` - Individual command implementations (create, setup, deliver, etc.)
- `/src/commands/setup.ts` - Environment and secret management setup

**Configuration and secrets:**
- `/config/default.json` - Default configuration for all environments
- `/resources/env.default.json` - Embedded default environment variables
- `/embedded-secrets.enc` - SOPS encrypted secrets for staging environment
- `~/.flinkord/config.json` - User-specific configuration (created by setup command)

**Key business logic:**
- `/src/cart.ts` - Shopping cart and order creation logic
- `/src/api/` - API client implementations for various services
- `/src/commercetools/` - CommerceTools integration for order management
- `/src/shared/hubs.ts` - Hub definitions and configurations

**Build and deployment:**
- `/package.json` - npm scripts and dependencies
- `/tsconfig.json` - TypeScript compilation configuration
- `/Dockerfile` - Multi-stage Docker build for containerization
- `/.github/workflows/ci.yaml` - GitHub Actions CI pipeline

## Secret Management

**The CLI uses SOPS + Age encryption for secret management:**
- Secrets are embedded in the Docker image and npm package
- Run `flinkord setup --secrets` to decrypt and configure locally
- Local config stored in `~/.flinkord/config.json` with 600 permissions
- Annual key rotation process documented in `/docs/ANNUAL_ROTATION.md`

**Setup process:**
- `node dist/src/cli.js setup` - Interactive configuration setup
- `node dist/src/cli.js setup --secrets` - Automated secret decryption (requires SOPS/Age)

## Repository Structure

**Key directories:**
- `/src/` - TypeScript source code
- `/tests/` - Vitest test suites  
- `/config/` - Configuration files
- `/resources/` - Static assets and default configs
- `/scripts/` - Utility scripts (Docker installer, key rotation)
- `/docs/` - Documentation including key rotation guide
- `/.github/` - GitHub Actions workflows and configurations

**Generated directories (excluded from commits):**
- `/dist/` - Compiled TypeScript output
- `/node_modules/` - npm dependencies
- `/html/` - Test report output

## Common Commands Reference

**Development workflow:**
```bash
# Fresh development setup
npm install
npm run build
node dist/src/cli.js config

# Validate changes
npm run lint
npm run build  
npm run test

# Test CLI functionality
node dist/src/cli.js --version
node dist/src/cli.js --help
node dist/src/cli.js config
```

**Docker workflow:**
```bash
# Build and test container
docker build -t flinkord-cli .
docker run --rm flinkord-cli --version
docker run --rm flinkord-cli --help

# Interactive container debugging
docker run --rm -it --entrypoint /bin/bash flinkord-cli
```

## Troubleshooting

**Common issues:**
- **Build fails**: Ensure Node.js 20+ is installed, run `npm install` first
- **Tests fail with "Missing INVENTORY_SERVICE_TOKEN"**: Expected behavior without staging secrets
- **Docker build timeout**: Normal for first build, can take 30+ minutes
- **CLI shows dotenv warnings**: Normal behavior, CLI functions correctly
- **Type errors**: Run `npm run build` to see specific TypeScript compilation errors

**Network and dependency issues:**
- If `npm install` fails: Clear cache with `npm cache clean --force`
- If Docker build fails on apk packages: Network connectivity issue, retry later
- If Google Artifact Registry access fails: Authentication issue, see README.md setup instructions

## CI/CD Integration

**GitHub Actions configuration:**
- Uses Devbox for consistent development environment
- Runs lint, build, and test steps in sequence
- Publishes test reports to GitHub Pages
- Requires staging environment secrets for full functionality

**Manual CI validation:**
```bash
# Replicate CI steps locally
npm run lint    # Must pass with no errors
npm run build   # Must complete successfully
npm run test    # May fail without secrets, but should not crash
```