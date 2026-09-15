# Hero Shell Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: static hero plus click-driven product mockup below

## DOM Structure

`relative full-width hero` > `max-w-7xl content rail` > `nav` + `header`; then centered `h1`, subtitle, CTA row, supported-agent badges; then `HeroMockup`.

## Computed Styles

### Hero Container

- Width: `1440px`
- Height: `1413px` desktop
- Position: `relative`
- Background: cover, center, no-repeat

### Content Rail

- Max width: `1280px` visual outer, `1024px` header/title rail at 1440px
- Desktop padding: `24px 128px 48px`
- Mobile padding: `16px 24px 40px`

### Header

- Display: `flex`
- Desktop: row, justify-space-between, gap `16px`, height `28px`
- Mobile: column, centered, height `100px`
- Logo: `24x24`
- Wordmark: `18px`, weight `500`

### H1

- Desktop: `60px/57px`, weight `500`, letter-spacing `-1.5px`
- Mobile: `36px/34.2px`
- Text: `The control plane` / `for coding agents`

### Subtitle

- Desktop: `18px/29.25px`, max width `512px`, color `rgba(255,255,255,0.7)`
- Mobile: `16px/26px`, width `342px`

### Primary CTA

- Width: `175px`
- Height: `40px`
- Padding: `10px 16px`
- Gap: `8px`
- Radius: `8px`
- Background: `#fafafa`
- Text: `#101615`

## States & Behaviors

### Hero entrance

- Trigger: initial page load
- State A: opacity `0`, translateY `40px`
- State B: opacity `1`, translateY `0`
- Transition: `800ms ease-out`, delay `500ms`

### Link and CTA hover

- Header links: muted -> foreground, `transition-colors`
- Primary CTA: foreground -> foreground/90, `transition-colors`

## Content

- Header: Blog, Docs, Changelog, Download, Sponsor, Discord, GitHub
- H1: `The control plane / for coding agents`
- Subtitle: `Run any coding agent from anywhere. / Self-hosted, multi-provider, open source`
- Primary CTA label: `Download for Mac` or platform-specific equivalent.
- Supported labels: Claude Code, Codex, OpenCode, Pi, Cursor, `+34 more`

## Assets

- Logo: `public/logo.svg`
- Background: `public/hero-bg.jpg`
- Icons: China icon library and upstream agent/provider marks

## Responsive Behavior

- Desktop `1440px`: header row; title `1024x114`, hero mockup `1280x734`.
- Tablet `768px`: title `512x114`; mockup `704x404`.
- Mobile `390px`: stacked header; title `342x68`; mockup `342x196`.

