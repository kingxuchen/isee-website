# Behaviors — workbuddy.ai

Extracted via ego-browser CDP on 2026-08-30. Browser recipe: raw `Runtime.evaluate` + `Page.captureScreenshot` via `cdp()`, Node `setTimeout` sleeps (the `js()`/`wait()` helpers hang after `Emulation.setDeviceMetricsOverride`; if a heredoc times out, abandon that task space and create a fresh one).

## Global

- **Smooth scroll: Lenis** — `<html class="performance-high lenis">`. Clone must use Lenis (or equivalent inertia smooth scroll).
- **Fonts**: body `PingFang SC, Microsoft YaHei, Alimama FangYuanTi VF, -apple-system…`; headings `"Alimama ShuHeiTi"` (woff2 subset, weight 400–900); `"Alimama FangYuanTi VF"` (variable 100–900). Self-hosted on COS:
  - `…/assets/AlimamaShuHeiTi-Bold.subset-B7GgQqeL.woff2`
  - `…/assets/AlimamaFangYuanTiVF-Thin.subset-CPWgZJiz.woff2`
- **Site keyframes**: `scroll`, `pulse`, `subtle-pulse` (plus TDesign component lib keyframes).
- Page bg `#fff`. Primary green `rgb(40,184,148)` = **#28B894**; bright teal `rgb(50,230,185)` = **#32E6B9**; deep green accent `rgb(0,181,120)` = **#00B578**; heading ink `#0D0D0D` / `rgb(25,26,35)`; gray panel `rgb(244,245,245)` = **#F4F5F5**; muted text `#666/#727272/#999`.

## Header

- Fixed 80px, `background: rgba(255,255,255,0.85)`, `backdrop-filter: blur(40px)`, transition 0.3s.
- **No scroll-state change** (identical computed styles at y=0 and y=600).
- Nav link 首页 active state: green text + green underline bar.
- Intl-中文 button: dropdown (not yet extracted — opens language menu).
- Mobile: hamburger icon opens right-side/overlay panel with close ×.

## Hero

- Headline "我帮你" + rotating word slot: cycles 写文档 / 做分析 (and likely more) — **time-driven** vertical ticker. Exact word list + interval to capture in hero extraction.
- CTAs: 立即下载 solid green (hover darker), 在线使用 outline.

## ProductDemo

- Fully static demo shell. 展开详情 buttons exist but demo is decorative.

## Capabilities （你的工作好帮手）

- **Interaction model: click-driven tabs** — 研究 / 文档 / 设计 / 开发 (`.scenario-tab`, active gets green bg).
- Clicking 文档 changes: heading → "办公文件生成", subheading → "Word、Excel、PPT 描述需求，拿到成品", and the laptop video swaps.
- Per-tab video: scene1–4 mp4 with poster webp. Custom play button + progress bar under laptop.
- Arrow button (↗) links to /docs/workbuddy/.

## Ecosystem

- `.orbit-ring` elements have gradient ring backgrounds; transform static between samples. Icon pills stationary in samples — verify CSS animation name on icon wrappers during section extraction (likely subtle float/pulse).

## Pricing

- Toggle 按月计费 (badge: 限时 5 折) / 按年计费 — click-driven.
- Monthly: Free $0/月， Pro $10 (strikethrough $20)/月， Team $40/坐席/月.
- Yearly: Pro $8/月， Team $480 — confirm exact per-card yearly values/units in pricing extraction.

## CTA

- join.mp4 autoplay loop muted playsinline, no controls.

## Footer

- Static links; hover color change (verify exact hover color during extraction).
