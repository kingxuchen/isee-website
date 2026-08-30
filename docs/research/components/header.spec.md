# Header Specification

## Overview

- **Target file:** `src/components/Header.tsx` (client component, `"use client"`)
- **Screenshot:** `docs/design-references/desktop-00-y0.jpg` (top strip), mobile: `mobile-00-y0.jpg`
- **Interaction model:** static appearance (no scroll-state change); mobile menu + language dropdown are click-driven
- **Raw extraction (for any value not listed here):** `docs/research/raw/header.json`

## DOM Structure

```
<header> fixed top, full width, h-80px, z-50
└─ <nav> relative, h-full
   └─ .nav-content: grid, grid-cols [auto 1fr auto]-ish (original: gridTemplateColumns "600px 112px 1fr" at 1440), max-width 1920px, margin auto, padding 0 40px, align center, gap 20px, h-full
      ├─ logo <a href="/">: img /brand/workbuddy-logo.png, h 32px (w ~92.6px), borderRadius 8, overflow hidden
      ├─ <ul> desktop menu: flex, justify center, gap 24px — items: 首页 (href /), 定价 (href /pricing)
      └─ .nav-actions: flex, align center, gap 16px, justify end
         ├─ lang button: "Intl - 中文" + ChevronDownIcon (/icons-inline/ChevronDownIcon.svg, 16px)
         ├─ 下载 button: black pill
         └─ 登录 button: plain text
```

Mobile (≤768px): desktop menu + nav-actions hidden; hamburger (MobileMenuIcon.svg) shown. Clicking opens: dark overlay (rgba(0,0,0,0.5)) + right drawer 320px wide, full height, bg rgba(255,255,255,0.95): header row (logo 81×28 + × close btn 32×32, 24px/300, color rgb(76,79,107)), nav list （首页/定价， each row ~58.6px), bottom actions column gap 12: Intl-中文 (h 44, radius 8), 登录 (h 44, radius 999px, color #333, font Alimama FangYuanTi VF 500 14px), 下载 WorkBuddy (h 44, radius 8, black bg, white text).

## Computed Styles (exact)

### header

- position: fixed; top 0; width 100%; height: 80px; zIndex: 50
- background: rgba(255,255,255,0.85); backdrop-filter: blur(40px); transition: 0.3s
- font: 16px/25.6px -apple-system stack

### Desktop nav links

- 首页 active: color rgb(40,184,148) (#28B894) + green underline bar (2px, bottom); 定价 inactive: near-black text; fontWeight 500-ish; hover → green

### Lang button "Intl - 中文"

- 14px/500, color rgb(25,26,35), radius 8px, padding 8px 12px, gap 6px; transparent bg

### 下载 button

- black (#000) bg, white text, pill (borderRadius 999px), ~42px height, padding 0 ~22px, 14px/500; hover: slight opacity/darken

### 登录 button

- transparent bg, color rgb(51,51,51), 14px/500, font-family "Alimama FangYuanTi VF"

## States & Behaviors

- **Scroll:** NONE — identical at y=0 and y=600.
- **Mobile menu:** click hamburger → overlay fades in + drawer slides in from right (translateX), transition 0.3s. × or overlay click closes.
- **Lang dropdown:** click toggles a small menu; for the clone, a static dropdown with "中文" / "English" items is enough (menu can be non-functional but must open/close on click).

## Text Content (verbatim)

首页 · 定价 · Intl - 中文 · 下载 · 登录 · 下载 WorkBuddy

## Assets

- Logo: `/brand/workbuddy-logo.png` (1620×560 source, render h 32px)
- Icons: `/icons-inline/ChevronDownIcon.svg`, `/icons-inline/MobileMenuIcon.svg`

## Responsive

- Desktop ≥1024: full layout. <1024: hide desktop menu+actions, show hamburger. (Original at 390px shows hamburger.)
