# Capabilities （你的工作好帮手） Specification

## Overview

- **Target file:** `src/components/Capabilities.tsx` (client component — tabs + video)
- **Screenshots:** `docs/design-references/desktop-01-y860.jpg` (bottom: header + mascots), `desktop-02-y1720.jpg` (tabs + text + laptop + controls)
- **Interaction model:** CLICK-driven tabs (`.scenario-tab`); NOT scroll-driven
- **Raw extraction:** `docs/research/raw/capabilities.json`; per-state content: `docs/research/raw/capabilities-states.json`

## DOM Structure

```
<div> white
└─ container: padding 0 60px, maxW 1920, centered
   └─ panel: bg #F4F5F5, borderRadius ~32px (large, match screenshot), padding-top 115.2px, overflow hidden, relative
      ├─ header (max-w 70%, margin auto, margin-bottom 160px, text centered):
      │  ├─ row: brand svg /icons-inline/HeroBuddySvg.svg (smaller, ~120px wide) + h2 "你的工作好帮手" (Alimama ShuHeiTi, ~48px, #0D0D0D)
      │  ├─ p subtitle: 把任务交给它，WorkBuddy 会自主规划、调用工具、生成文件，并把过程与结果都留给你审核 (16px, #666)
      │  └─ two mascot imgs absolutely placed bottom-left of panel: /cap/scenario1-feature1.png (160×128) dog-robot, /cap/scenario1-feature2.png (283×233) cat-robot — see screenshot desktop-01 bottom
      ├─ white content wrapper (bg #fff, grid 2 cols [~40% 60%], radius top, padding ~60px):
      │  ├─ left column:
      │  │  ├─ tab pills row (bg #F4F5F5 rounded-8px container, padding ~4px): 研究 文档 设计 开发 — each tab: 21px/400, padding 8px 25.2px, radius 4px, color #000; ACTIVE: bg rgb(40,184,148), color #fff; transition 0.3s
      │  │  ├─ h3 title (32px+, Alimama ShuHeiTi, #0D0D0D) + h4 subtitle (bold) + p description (14-16px, #666) + arrow link button (black square 48×48 radius 8, ArrowUpRightIcon white 30px → /icons-inline/ArrowUpRightIcon.svg; href #)
      │  └─ right: laptop composition (relative):
      │     ├─ img /cap/mac.png (3072×2346) laptop frame, w 100%
      │     └─ video absolutely positioned inside screen area (inset ~7% top, ~13% sides — tune to fit inside the mac screen): active tab's video, autoplay muted loop playsinline, poster per tab
      └─ play controls row (padding 100px 0 60px, flex center, gap 16): round play/pause button (48px circle, border #E5E5E5, PlayIcon 12px) + progress pill (w ~64px h 12px rounded-full bg #E5E5E5 with dark fill portion — a static ~40% fill is acceptable)
```

## Per-State Content (verbatim)

| Tab | Title | Subtitle | Video | Poster |
| --- | --- | --- | --- | --- |
| 研究 | 深度调研 | 从查资料到给结论，15 分钟交付报告 | /cap/scene1.mp4 | /cap/scene1-poster.webp |
| 文档 | 办公文件生成 | Word、Excel、PPT 描述需求，拿到成品 | /cap/scene2.mp4 | /cap/scene2-poster.webp |
| 设计 | AI 设计 | 不用设计工具也能产出专业视觉 | /cap/scene3.mp4 | /cap/scene3-poster.webp |
| 开发 | 应用构建 | 把想法变成能落地的应用 | /cap/scene4.mp4 | /cap/scene4-poster.webp |

Description for 研究 (verbatim): 告诉 WorkBuddy 你要研究的课题，它会拆出检索路径、对信息源交叉验证，再生成结构化报告、竞品矩阵和策略建议。
For the other 3 tabs, write a matching one-line description in the same style (originals not fully captured; keep tone identical, e.g. 文档: 描述你要的文档、表格或演示，WorkBuddy 直接生成可编辑的 Word、Excel、PPT 成品。)

## States & Behaviors

- **Tab click:** switches title/subtitle/description AND swaps the playing video (src+poster), transition 0.3s on tab pill. Video element: key by tab so it remounts and autoplays.
- **Play button:** toggles video play/pause (icon can stay PlayIcon; state wiring expected).
- Hover on tab (inactive): bg rgba(0,0,0,0.05).

## Responsive

- Mobile: single column — tabs row (scrollable if needed), text block, laptop below at full width; mascots smaller; panel radius ~20px (see mobile-02/03 jpgs).
