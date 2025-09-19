# Flinkord CLI Dockerfile
# 
# Build the image:
#   podman build -t flinkord .
#
# Run the CLI:
#   podman run --rm flinkord --help
#   podman run --rm -v ~/.flinkord:/home/nodejs/.flinkord flinkord create
#
# Or pull from Google Artifact Registry (requires authentication):
#   podman pull europe-west3-docker.pkg.dev/flink-core-shared/flinkord-cli:latest

FROM node:20-alpine AS builder

# Install git and other build dependencies
RUN apk add --no-cache git python3 make g++

# # Install google-artifactregistry-auth globally
# RUN npm install -g google-artifactregistry-auth

# Set working directory
WORKDIR /app

# Copy package files only (skip .npmrc to avoid registry issues)
COPY package*.json ./

# Configure npm to use a local cache
RUN npm config set cache /tmp/.npm

# Install dependencies (with dev dependencies for building)
RUN npm install --include=dev --ignore-optional || npm install --include=dev --ignore-scripts || true

# Copy source code and other necessary files
COPY . .

# Fix TypeScript issues and build
RUN npm install --save-dev @types/lodash.merge || true
RUN npm install -g typescript
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime

# Install runtime dependencies including SOPS and Age
RUN apk add --no-cache git sops age

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application and necessary files from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/config ./config
COPY --from=builder --chown=nodejs:nodejs /app/resources ./resources
COPY --from=builder --chown=nodejs:nodejs /app/keys ./keys
COPY --from=builder --chown=nodejs:nodejs /app/embedded-secrets.enc ./embedded-secrets.enc

# Create directory for config files
RUN mkdir -p /home/nodejs/.flinkord && chown -R nodejs:nodejs /home/nodejs/.flinkord

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production
ENV FLINKORD_CONFIG_DIR=/home/nodejs/.flinkord


# Set entrypoint to the CLI
ENTRYPOINT ["node", "/app/dist/src/cli.js"]

# Default command (show help)
CMD ["--help"]