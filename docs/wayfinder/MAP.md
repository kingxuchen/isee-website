# Wayfinder: 把 isee-website 迁移到 Cloudflare Workers

## Destination

isee-website 部署到 Cloudflare Workers，使用 `@opennextjs/cloudflare`（OpenNext Cloudflare adapter）运行 Next.js 16.3.3 App Router，保留 SSR/ISR 能力；GitHub repo 自动触发部署；根路径 `/`；pnpm 构建。

## Notes

- 项目：Next.js 16.3.3 + React 19 + Tailwind v4 + shadcn/ui，纯 App Router，当前无 API 路由、无 middleware。
- 已废弃 `@cloudflare/next-on-pages`，改用官方推荐的 `@opennextjs/cloudflare`。
- 当前 `public/` 约 12M，其中 5 个 mp4 约 10M，先保留在 repo 中。
- 本地字体使用 `next/font/local`，Workers 运行时可能需要改为 CSS `@font-face`。
- 先不启用 on-demand revalidation；仅使用 `revalidate: N` 静态增量缓存。
- 本次改动的分支：`feat/cloudflare-workers`。

## Decisions so far

- 选择 `@opennextjs/cloudflare` 而非 `@cloudflare/next-on-pages`：官方 deprecated 后者，且 OpenNext 明确支持 Next.js 16。
- 保留 SSR/ISR，不新增 API 路由或 middleware（Q5 → A）。
- mp4 资源先保留在 `public/` 中，后续迁移到 CDN/R2（Q6 → A）。
- 先不启用 on-demand revalidation；仅 `revalidate: N`（Q7 → C）。
- 使用 pnpm 作为构建包管理器（Q8 → A）。
- 先使用 Cloudflare 默认子域名（Q9 → A）。
- 本地字体改为 CSS `@font-face`（Q10 → B）。
- 保留 Tailwind v4 + shadcn/ui（Q11 → 同意）。
- 使用新分支 `feat/cloudflare-workers` 验证后再合并到 `main`（Q12 → C）。

## Not yet specified

- @opennextjs/cloudflare 与 Next.js 16.3.3 / React 19 / Tailwind v4 / pnpm 的具体兼容性细节
- 本地字体迁移到 CSS @font-face 的具体实现方案
- open-next.config 与 wrangler 配置结构
- 本地构建命令与产物验证
- Cloudflare dashboard GitHub 自动集成配置
- ISR/cache 适配器（无 KV vs R2）与 `revalidate` 值
- 是否需要处理 shadcn/ui 的客户端依赖

## Out of scope

- 迁移 mp4 到外部 CDN / R2（后续优化 ticket）
- on-demand revalidation 与 KV/Durable Objects（后续有需求时再加）
- API 路由与 middleware（本次不新增）
- 自定义域名绑定（先用 `*.workers.dev` 或 `*.pages.dev`）
