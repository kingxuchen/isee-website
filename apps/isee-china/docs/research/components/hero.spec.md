# Hero Specification

## Overview

- **Target file:** `src/components/Hero.tsx` (client component for ticker animation)
- **Screenshot:** `docs/design-references/desktop-00-y0.jpg`
- **Interaction model:** time-driven rotating word ticker; click-driven download dropdown
- **Raw extraction:** `docs/research/raw/hero.json`, DOM: `docs/research/raw/hero-main.html`

## DOM Structure

```
<section> relative, white bg, height ~490px (content height; original section h=490 at 1440w), overflow hidden
├─ .hero-container: padding 120px 60px 60px, maxWidth 1920, centered
│  ├─ .hero-bg-image: ABSOLUTE, zIndex 1 — img /hero/home-bg.png (2946×2293), rendered w 1224px h ~1080px, maxWidth 1500px, anchored left/top so the giant gray "WORK BUDDY" watermark + diagonal lines show behind/left of content, robot-with-flag appears at right edge of the section (visible in screenshot right side, near bottom of hero). Position: left 0-ish, top ~-100px. Reproduce visually per screenshot.
│  └─ .hero-banner-main: relative zIndex 10, flex column centered (visually centered stack), gap ~60px
│     ├─ .hero-brand (w 720, centered, flex column, align center)
│     │  ├─ .hero-brand-logo: flex row, align center, gap 8px — inline brand SVG (use <img src="/icons-inline/HeroBuddySvg.svg" height ~68>) + slogan "我帮你" + ROTATING WORD ticker
│     │  └─ p.description: 20px/40px, weight 500, font Alimama FangYuanTi VF, color rgb(25,26,35), maxW 720, centered, margin-top ~24
│     └─ .hero-banner-button: flex row, gap 24px, align center, h 48
│        ├─ download wrapper (relative): button "立即下载" green + dropdown menu
│        └─ <a> 在线使用 outline button, href "#" (original /app)
```

## Computed Styles (exact)

### slogan "我帮你" + ticker word

- Big display text, visually ~48px+ bold black (#0D0D0D), sits on same baseline right of brand SVG. Alimama ShuHeiTi. (See screenshot: logo block + 我帮你 are one visual line; the ticker word renders black bold with a small teal square "_" suffix visible after the word in screenshot — the brand svg includes the green dot/underscore motif.)

### Ticker

- Container: inline-flex, overflow hidden, vertical padding 4px (py-1)
- Letters animate individually: each letter span `inline-block`, `transform: translateY()` cycles with slight per-letter stagger (observed translateY ~-123% at one instant). Effect: words roll vertically upward, letters cascading.
- Words cycle: **写文档 → 做分析 → 写代码 → 做设计 → 做投资** (interval ~2s per word, transition ~0.5s, stagger per letter ~30-50ms)

### description

- 20px/40px 500, color rgb(25,26,35), font var(--font-round)

### 立即下载 button

- bg rgb(40,184,148) #28B894, white bold text 18px, Alimama ShuHeiTi, radius 4px, h 48px, padding 0 24px, flex center gap 8, includes dog icon `/icons-inline/DownloadDogIcon.svg` (~24px, white). Hover: bg deepens (#00B578-ish), transition 0.3s.

### download dropdown menu (opens on click of 立即下载)

- White rounded (8px) shadow list below button: items "Mac x64", "Mac ARM64" + badge "当前设备" (small green-tinted chip), "Windows x64 (兼容 ARM64)". Items hover bg #F5F5F5. (Non-functional links are OK.)

### 在线使用

- border 1px solid rgb(40,184,148), transparent bg, color #000, 18px/700 Alimama ShuHeiTi, radius 4px, h 48, padding 0 24, w ~184. Hover: bg rgba(40,184,148,0.05).

## Text Content (verbatim)

我帮你 · WorkBuddy 是腾讯出品的全场景 AI 办公工作台。说出要求、开始执行任务、交付完整成果。完美连接腾讯办公生态，你的办公好搭子 · 立即下载 · 在线使用 · Mac x64 · Mac ARM64 · 当前设备 · Windows x64 (兼容 ARM64)

## Assets

- `/hero/home-bg.png`, `/icons-inline/HeroBuddySvg.svg` (160×68), `/icons-inline/DownloadDogIcon.svg` (49×48)

## Responsive

- Mobile (390px): brand stack centers, slogan shrinks (~28px), description 16px/1.8, buttons full-width-ish stacked row wrap, bg image still left-anchored (see mobile-00-y0.jpg).
