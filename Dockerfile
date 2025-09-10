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

# Copy package files and npmrc template
COPY package*.json ./
COPY .npmrc .npmrc

# Configure npm to use a local cache
RUN npm config set cache /tmp/.npm

# Configure npm with the access token and install dependencies
# If private packages fail, continue with public packages only
RUN npm ci --include=dev || npm install --include=dev --ignore-optional

# Copy source code and other necessary files
COPY . .

# Install TypeScript globally and build the application
RUN npm install -g typescript
RUN npm run build

# Production stage
FROM node:20-alpine AS runtime

# Install runtime dependencies
RUN apk add --no-cache git

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/config ./config
COPY --from=builder --chown=nodejs:nodejs /app/resources ./resources

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