FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY tsconfig.base.json ./

# Copy packages
COPY packages/orot-ui/package.json ./packages/orot-ui/
COPY apps/docs/package.json ./apps/docs/

# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/orot-ui ./packages/orot-ui
COPY apps/docs ./apps/docs

# Build library then docs
RUN pnpm build && pnpm build:docs

# Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/apps/docs/dist /usr/share/nginx/html

COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
