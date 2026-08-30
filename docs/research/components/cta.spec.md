# CTA Section Specification

## Overview

- **Target file:** `src/components/CtaSection.tsx` (server component OK; video is declarative)
- **Screenshot:** `docs/design-references/desktop-06-y5160.jpg` (top half)
- **Interaction model:** static + autoplay video
- **Raw extraction:** `docs/research/raw/cta.json`

## DOM Structure

```
<section> bg rgb(244,244,244) #F4F4F4, height ~360px, overflow hidden
└─ container: maxW 1920, margin auto, h full
   └─ content: flex row, justify space-between, align center, padding-left 57.6px
      ├─ left (w ~658):
      │  ├─ header row (flex, gap 12, mb 16): h2 "开启 AI 办公新范式" — 50px/58, 700, Alimama FangYuanTi VF, #000
      │  ├─ p: 免费开始，无限可能。把重复、繁琐、跨工具的任务交给 WorkBuddy，把判断和创造力留给自己。 — 20px/32, 500, font-round, rgb(25,26,35), mb 40
      │  └─ 立即下载 button (same style as hero): bg #28B894, white 18px bold Alimama ShuHeiTi, h 48, radius 4, padding 0 24, dog icon /icons-inline/DownloadDogIcon.svg; hover #00B578
      └─ right (w ~658, h 360, flex center): <video /cta/join.mp4> autoplay muted loop playsInline, objectFit cover, h full (robot desert scene, see screenshot)
```

## Text Content (verbatim)

开启 AI 办公新范式 · 免费开始，无限可能。把重复、繁琐、跨工具的任务交给 WorkBuddy，把判断和创造力留给自己。 · 立即下载

## Responsive

- Mobile: stacks — text block padding 40px 24px, heading 30px, video below full-width h ~240 (see mobile-07 jpg).
