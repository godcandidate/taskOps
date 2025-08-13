# Build stage
FROM node:22.11.0-alpine AS builder

# Upgrade Alpine packages, including vulnerable ones
RUN apk update && \
    apk upgrade libcrypto3 libssl3 musl musl-utils && \
    rm -rf /var/cache/apk/*
    
# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22.11.0-alpine

# Set working directory
WORKDIR /app

# Install serve for serving static files
RUN npm install -g serve

# Copy built application from the builder stage
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./package.json

# Copy the entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Expose the port that the application will run on
EXPOSE 3000

# Use the script as the entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["npm", "start"]
