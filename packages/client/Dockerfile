# Build Stage
FROM oven/bun:latest as build-stage

WORKDIR /app

COPY package.json bun.lockb* ./
COPY packages/client/package.json ./packages/client/

# Install dependencies
RUN bun install

# Copy source
COPY packages/client ./packages/client

# Build
WORKDIR /app/packages/client
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

# Production Stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/packages/client/dist /usr/share/nginx/html
COPY packages/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
