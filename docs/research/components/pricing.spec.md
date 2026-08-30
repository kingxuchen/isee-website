# Pricing Specification

## Overview

- **Target file:** `src/components/Pricing.tsx` (client component — billing toggle)
- **Screenshots:** `docs/design-references/desktop-04-y3440.jpg`, `desktop-05-y4300.jpg`
- **Interaction model:** click-driven monthly/yearly toggle
- **Raw extraction:** `docs/research/raw/pricing-monthly.json` (structure/styles; yearly content captured in `docs/research/raw/targeted.json`)

## DOM Structure

```
<section> white, padding ~100px 0
└─ container maxW 1920 px-60 centered
   ├─ h2 "选择适合的方案" — 50px/60 700, Alimama FangYuanTi VF (font-round), #000, centered
   ├─ p "支持年付和月付，按需选择适合你的方案" — 16px, rgb(90,90,90), centered, mb ~48
   └─ panel: bg #F4F5F5, radius ~32px, padding ~64px 48px, relative
      ├─ toggle (centered, margin-bottom 40): track bg #E5E5E5-ish rounded-8px padding 4, two buttons h ~44 px-24 16px:
      │  按月计费 + badge "限时 5 折" (small chip, green tint bg rgb(198,230,209)-ish, green text rgb(37,171,82), radius 4, 12px)
      │  按年计费
      │  active button: bg #fff, shadow sm, color #000; inactive: transparent, color #666. transition 0.3s
      ├─ note row (centered, 14px, #333, mb 40): WorkBuddy套餐同时适用于 + <a> img /brand/codebuddy.svg (h ~24 inline) + ↗ (href https://www.codebuddy.ai/)
      └─ cards: flex gap 24, justify center, align start; Free and Pro side by side top row, Team below-left (per screenshot layout: Free | Pro on one row, Team below Free). Actually per desktop-04/05: row 1 = Free + Pro (2 cols), row 2 = Team (left col). Use grid grid-cols-2 max-w ~1100 margin auto.
         Card: bg #fff, radius 16px, padding 32px, border 1px solid transparent; Pro: border-color #28B894 + soft green shadow.
         ├─ name chip: bg #F4F5F5, radius 4, padding 4 10, 13px/500 #333
         ├─ price row: "$" + number 40px/700 #0D0D0D (Alimama ShuHeiTi or font-round 700) + original struck-through (#999, 20px, line-through) + unit /月 (#666 14px)
         ├─ CTA button: full width, h 48, radius 8, 16px/600 — Free/Team: black bg white text "免费开始"/"立即订阅"; Pro: green #28B894 bg white "开始 7 天免费试用"
         ├─ divider border-t #F0F0F0 my 6
         └─ features: ul, li flex gap 8, PricingCheckIcon (/icons-inline/PricingCheckIcon.svg, 24px, green stroke) + 14px #333, lineHeight ~36px
```

## Per-State Content (verbatim)

### 按月计费 (default, badge 限时 5 折)

- **Free** — $0 /月 · CTA 免费开始 · features: 每月 100 积分 / 每日活跃奖励：30 积分/天 / Auto 模型调度 / 5,000 次代码补全 / 3 个自动任务 / 专家、技能与连接器 / 跨文件理解 / 注释生成代码
- **Pro** (highlighted, green border) — $10 (struck 20) /月 · CTA 开始 7 天免费试用 · features: 每月 1,000 基础积分 / 每月 1,000 赠送积分 / 每日活跃奖励：50 积分/天 / 可使用全部模型 / 无限代码补全 / 15 个自动任务 / 专家、技能与连接器 / 跨文件理解 / 注释生成代码
- **Team** — $40 /坐席/月 · CTA 立即订阅 · note paragraph "企业特性：" (green #28B894, 13px) · features: 每月每坐席基础 1000 Credit 积分 / 企业加量包购买 / 第三方登录认证 / 组织架构管理 / 统一订阅管理 / 成员用量控制 / 企业 Skill / 企业专家 / 企业模型配置 / 安全与审计 / OpenAPI 开放

### 按年计费

- Free: unchanged ($0 /月)
- Pro: **$8** (struck 20) /月
- Team: **$480** /坐席/年
- Everything else identical.

## States & Behaviors

- Toggle click switches prices with immediate swap (original may animate number; a simple swap is fine).
- CTA buttons hover: Free/Team black→#333, Pro green→#00B578. transition 0.3s.

## Responsive

- Mobile: cards stack single column, panel padding 32 20, toggle full width, price 32px (see mobile-05/06 jpgs).
