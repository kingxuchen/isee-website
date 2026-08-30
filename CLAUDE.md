# isee-website — WorkBuddy clone

Pixel-perfect clone of <https://www.workbuddy.ai/> (zh-CN landing page) built with Next.js 16 (App Router) + Tailwind v4 + shadcn/ui primitives.

## Run

```bash
npm run dev        # or: npm run build && npx next start
```

## Structure

- `src/app/page.tsx` — section wiring, in source order:
  Header → Hero → ProductDemo → Capabilities → Ecosystem → Pricing → CTA → Footer
- `src/components/*.tsx` — one file per section; all layout uses Tailwind arbitrary values (`px-[Npx]`) rather than theme config.
- `src/components/SmoothScroll.tsx` — Lenis smooth scrolling (matches the original).
- `src/components/icons.tsx` — `<img>`-based wrappers for extracted inline SVGs.
- `src/types/index.ts` — shared SectionProps.

## Assets

All assets are local, downloaded by `scripts/download-assets.mjs` from Tencent COS:

- `public/fonts/` — Alimama ShuHeiTi (headings, `--font-heading`) + Alimama FangYuanTi VF (rounded body, `--font-round`); loaded via `next/font/local` in `layout.tsx`. System UI text = PingFang SC.
- `public/hero/`, `public/demo/`, `public/cap/`, `public/eco/`, `public/footer/`, `public/cta/` — images + 5 mp4 demos (muted autoplay loop) with webp posters.
- `public/icons-inline/*.svg` — 43 SVGs extracted from the live DOM. **They carry `xmlns` (required for `<img>` loading) — don't strip it.**

## Behaviors

- Hero: letter-stagger word ticker (写文档→做分析→写代码→做设计→做投资), download dropdown (3 platforms).
- Capabilities: click-driven tabs (研究/文档/设计/汇报) swapping video + copy; hover plays, leave pauses+resets.
- Ecosystem: 60s CSS orbit, pills counter-spin to stay upright.
- Pricing: 按月计费/按年计费 toggle ($10↔$8 Pro, $40↔$480 Team).
- Mobile (<1024px): hamburger slide-in drawer, nav hidden.

## Research artifacts

- `docs/research/PAGE_TOPOLOGY.md` — sections, colors (#28B894 green / #32E6B9 teal / #0D0D0D ink / #F4F5F5 panel), typography scale, animation inventory.
- `docs/research/BEHAVIORS.md` — runtime state/behavior findings.
- `docs/research/components/*.spec.md` — per-section builder specs.
- `docs/research/raw/*.json|html` — verbatim DOM/text/animation extractions.
- `docs/design-references/desktop-*.jpg`, `mobile-*.jpg` — original-site screenshots (1440px / 390px).

## Known intentional approximations

- Lenis wheel scrolling vs the original's exact easing.
- Capabilities auto-advance tab timer omitted (original is click-driven with hover play).
- Locale switcher is a static menu (no actual i18n switch).
