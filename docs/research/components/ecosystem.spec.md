# Ecosystem Specification

## Overview

- **Target file:** `src/components/Ecosystem.tsx` (client or server; animation is pure CSS)
- **Screenshot:** `docs/design-references/desktop-03-y2580.jpg`
- **Interaction model:** time-driven — continuous 60s orbit rotation (CSS animation, no JS)
- **Raw extraction:** `docs/research/raw/ecosystem.json`

## DOM Structure

```
<section> white, padding 115.2px 0 80px
└─ container: padding 0 60px, maxW 1920, centered
   ├─ header:
   │  ├─ h2 "WorkBuddy 连接打通办公生态" — 50px/60, weight 700, Alimama FangYuanTi VF (font-round), color #000, centered, margin-bottom 16
   │  └─ p subtitle — 16px/25.6, 500, font-round, color rgb(90,90,90), maxW 720, centered: WorkBuddy 可以无缝连接办公 IM、文档、邮箱、会议、知识库等常用办公工具，打通办公生态
   └─ orbit area: relative, 720×720, margin auto
      ├─ orbit ring SVG outer 720×720: /icons-inline/OrbitRingOuter.svg (absolute, centered)
      ├─ orbit ring SVG middle 561.6×561.6: /icons-inline/OrbitRingMiddle.svg (absolute, centered)
      ├─ inner ring div: circle ~375px (from ring transform 187px offset), background: linear-gradient(#EEF9F7,#EEF9F7) padding-box + border gradient rgba(40,184,148,0→0.08→0.12→0), absolute centered
      ├─ center: 130×130 flex center, absolute centered — soft green radial glow behind (radial-gradient rgba(40,184,148,0.15) → transparent, larger ~300px circle) + img /brand/workbuddy-icon.svg (130×130)
      └─ items orbit layer: absolute inset 0, animation: spin 60s linear infinite (CSS keyframes rotate 0→360deg)
         └─ 7 pills, each absolute at center (top 50% left 50%) with transform: rotate(A) translateX(R) rotate(-A) — then inner counter-rotation handled by the pill wrapper animating counter-spin 60s linear infinite reverse so pills stay upright while orbiting. Angles: 7 items evenly spaced (i * 360/7 deg), radius ~310px (pills sit between middle and outer rings).
            Pill style: bg #fff, height 80px, padding 14px 32px 14px 14px, borderRadius 40px (pill), display flex, alignItems center, gap 14px, boxShadow soft (0 8px 24px rgba(0,0,0,0.08)); icon img ~52px + name 18px/500 color #191A23.
```

## Apps (icon → name, in original order)

Jira /eco/jira.svg · Google Drive /eco/google-drive.svg · Github /eco/github.svg · Linear /eco/linear.svg · Office /eco/office.svg · Notion /eco/notion.svg · Slack /eco/slack.svg

## States & Behaviors

- **Orbit:** whole items layer rotates 360deg over 60s linear infinite; each pill counter-rotates so it stays horizontal (implement: outer wrapper `animate-[spin_60s_linear_infinite]`, inner pill `animate-[spin_60s_linear_infinite_reverse]`).
- Reduced motion: respect prefers-reduced-motion (pause animations).

## Text Content (verbatim)

WorkBuddy 连接打通办公生态 · WorkBuddy 可以无缝连接办公 IM、文档、邮箱、会议、知识库等常用办公工具，打通办公生态

## Responsive

- Mobile (390): orbit scales to ~min(720px, 100vw-32px) — scale proportionally (transform scale or smaller base + scaled radius ~43%); title 30px, subtitle 14px. Pills shrink to ~60% (h ~48, icon 32, text 14). See mobile-04 jpg.
