# ============================================================
# isee-website 多阶段构建镜像（Next.js standalone 输出）
#
#   stage 1 deps    ：pnpm 安装全量依赖（含 devDependencies）
#   stage 2 builder ：next build 产出 .next/standalone
#   stage 3 runner  ：仅打包运行时产物，非 root 用户启动
#
# 构建：docker build -t isee-website:latest .
# 运行：docker run -d -p 3001:3000 isee-website:latest
# ============================================================

# ---------- stage 1: deps ----------
FROM node:24-alpine AS deps
RUN apk add --no-cache libc6-compat
# 固定 pnpm 10（对应 lockfileVersion 9.0）
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# 构建脚本白名单（sharp/esbuild/unrs-resolver）由 pnpm-workspace.yaml 的 allowBuilds 提供
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile

# ---------- stage 2: builder ----------
FROM node:24-alpine AS builder
RUN npm install -g pnpm@10.28.2 --registry=https://registry.npmmirror.com
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---------- stage 3: runner ----------
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001 -G nodejs

# standalone 产物 + 静态资源 + public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
