# =============================================================
# Attri Nexus API - Multi-stage Production Dockerfile
# Node.js 20 on lightweight Alpine Linux
# =============================================================

FROM node:20-alpine AS base

# Install dumb-init or dependencies if needed
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies in a separate layer for fast caching
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code and scripts
COPY src/ ./src/
COPY scripts/ ./scripts/

# Create a non-privileged user for security
USER node

# Expose backend port
EXPOSE 3001

# Production Environment
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start production server
CMD ["node", "src/index.js"]
