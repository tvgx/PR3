# ================================
# Multi-stage Dockerfile for Backend
# Node.js + Express API
# ================================

# Stage 1: Builder - Install dependencies and prepare application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (layer caching optimization)
COPY backend/package*.json ./

# Install dependencies with clean install for reproducible builds
# --only=production excludes devDependencies
RUN npm ci --only=production

# Copy source code
COPY backend/ .

# ================================
# Stage 2: Production - Minimal runtime image
FROM node:18-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only production artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app /app

# Switch to non-root user
USER nodejs

# Expose application port
EXPOSE 8000

# Health check to verify container is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", "server.js"]
