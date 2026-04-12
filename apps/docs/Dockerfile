FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.base.json tsconfig.json tsup.config.ts ./

# Copy docs manifest
COPY apps/docs/package.json ./apps/docs/package.json

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY src ./src
COPY apps/docs ./apps/docs

# Build library then docs
RUN pnpm build && pnpm build:docs

# Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/apps/docs/dist /usr/share/nginx/html

COPY --from=builder /app/apps/docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
