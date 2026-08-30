# Ticket 004: Cloudflare dashboard GitHub integration

## Type

`wayfinder:task`

## Question

How do we connect the GitHub repo to Cloudflare so pushes to `feat/cloudflare-workers` (and later `main`) automatically deploy?

## Status

Open

## Blocking

- 005 (Production smoke test)

## Context

This is a human-in-the-loop ticket: the user must perform dashboard steps. The agent can prepare the build command and wrangler config strings.

## Acceptance criteria

- [ ] Cloudflare Workers project created from dashboard (or `wrangler deploy`)
- [ ] GitHub repo `kingxuchen/isee-website` connected as source
- [ ] Build command and output directory configured:
  - Build command: `pnpm install && pnpm build`
  - Output directory: `.open-next` (or whatever OpenNext uses for Workers)
- [ ] Environment variables `NODE_VERSION=20` (or 22) set in dashboard
- [ ] Preview deployments enabled for `feat/cloudflare-workers`
- [ ] Production deploys from `main` after merge
