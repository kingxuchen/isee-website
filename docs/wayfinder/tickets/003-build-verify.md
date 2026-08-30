# Ticket 003: Local build and wrangler dev verification

## Type

`wayfinder:prototype`

## Question

Does the project build cleanly with `@opennextjs/cloudflare` and run locally under `wrangler dev`?

## Status

Open

## Blocking

- 004 (Cloudflare dashboard and GitHub integration)

## Context

This ticket proves the stack works end-to-end on the local machine before touching Cloudflare dashboard.

## Acceptance criteria

- [ ] `pnpm install` succeeds
- [ ] `pnpm build` invokes OpenNext and produces `.open-next` output
- [ ] `pnpm dlx wrangler dev` or `wrangler dev` serves the app on localhost
- [ ] Home page renders all sections (Header, Hero, ProductDemo, Capabilities, Ecosystem, Pricing, CTA, Footer)
- [ ] No runtime errors in the wrangler dev console
- [ ] Fonts, images, and videos load correctly
