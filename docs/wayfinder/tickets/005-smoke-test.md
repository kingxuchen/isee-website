# Ticket 005: Production smoke test and handoff

## Type

`wayfinder:prototype`

## Question

Does the deployed Cloudflare Workers app match local dev and pass basic checks?

## Status

Open

## Context

Final verification before closing the wayfinder map.

## Acceptance criteria

- [ ] Deployed URL loads without 5xx
- [ ] All sections render correctly
- [ ] Lighthouse / WebPageTest score acceptable (no major regressions)
- [ ] SSR/ISR behavior confirmed (e.g., page source contains server-rendered content, `revalidate` header or cache behavior visible)
- [ ] README updated with deploy URL and build commands
- [ ] `feat/cloudflare-workers` can be merged to `main`
