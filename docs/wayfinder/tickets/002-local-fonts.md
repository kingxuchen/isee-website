# Ticket 002: Migrate local fonts to CSS @font-face

## Type

`wayfinder:task`

## Question

How should local fonts be loaded so they work in Cloudflare Workers runtime without `next/font/local` file-system reads?

## Status

Open

## Blocking

- 003 (Build and dev verification)

## Context

Current `layout.tsx` uses `next/font/local` with `public/fonts/AlimamaShuHeiTi-Bold.subset.woff2` and `public/fonts/AlimamaFangYuanTiVF-Thin.subset.woff2`.

Cloudflare Workers cannot access the file system at request time, so `next/font/local` must be replaced with CSS `@font-face` declarations in `globals.css` or a separate `fonts.css`.

## Acceptance criteria

- [ ] `layout.tsx` no longer imports `next/font/local`
- [ ] `globals.css` contains `@font-face` rules referencing `public/fonts/*.woff2`
- [ ] CSS variables `--font-alimama-shuheiti` and `--font-alimama-fangyuanti` still work
- [ ] Visual QA: headings and body text render with correct fonts in local dev
