FROM oven/bun:latest

WORKDIR /app

# Copy root package.json and lockfile (if exists)
COPY package.json bun.lockb* ./
COPY packages/server/package.json ./packages/server/

# Install dependencies
RUN bun install

# Copy source code
COPY packages/server ./packages/server

# Set working directory to server package
WORKDIR /app/packages/server

# Expose port
EXPOSE 3000

# Start command
CMD ["bun", "start"]
