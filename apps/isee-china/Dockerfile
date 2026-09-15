# ============================================================
# isee-china — Next.js standalone (pnpm workspace App)
#
# Context = Workspace root:
#   docker build -f apps/isee-china/Dockerfile -t isee-china:latest .
#   docker run -d -p 3001:3000 isee-china:latest
# ============================================================

# ---------- stage 1: deps ----------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/isee-china/package.json ./apps/isee-china/

RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile

# ---------- stage 2: builder ----------
FROM node:24-alpine AS builder
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter isee-china build

# ---------- stage 3: runner ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/.next/static ./apps/isee-china/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/isee-china/public ./apps/isee-china/public

USER nextjs
EXPOSE 3000
CMD ["node", "apps/isee-china/server.js"]
