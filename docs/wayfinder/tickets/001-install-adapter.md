# Ticket 001: Install and configure @opennextjs/cloudflare

## Type

`wayfinder:task`

## Question

What is the correct dependency set, Next.js config, open-next config, and wrangler config to build and run isee-website on Cloudflare Workers using `@opennextjs/cloudflare`?

## Status

Open

## Blocking

- 002 (Local font migration)
- 003 (Build and dev verification)

## Context

- Next.js 16.3.3 + React 19 + Tailwind v4 + pnpm
- No API routes, no middleware, App Router only
- Target: Cloudflare Workers, root path, GitHub auto-deployment later

## Acceptance criteria

- [ ] `@opennextjs/cloudflare`, `wrangler` added to dev dependencies
- [ ] `open-next.config.ts` exists and uses correct Cloudflare adapter
- [ ] `wrangler.jsonc` / `wrangler.toml` configured for Workers with assets
- [ ] `next.config.ts` updated for OpenNext (distDir, output settings)
- [ ] `.gitignore` excludes `.open-next`, `.wrangler`, `wrangler.toml` if it contains secrets
