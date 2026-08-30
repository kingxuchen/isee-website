# Footer Specification

## Overview

- **Target file:** `src/components/Footer.tsx` (server component)
- **Screenshots:** `docs/design-references/desktop-06-y5160.jpg` (bottom) + `desktop-07-y5327.jpg`
- **Interaction model:** static; link hovers
- **Raw extraction:** `docs/research/raw/footer.json`

## DOM Structure

```
<div> white bg, padding ~64px 60px 32px, maxW 1920 centered, overflow hidden
├─ link columns: grid grid-cols-4, gap 24, max-w ~1312, margin auto (cards bg #F5F5F5-ish? NO — per screenshot columns are plain white with light separation; verify in footer.json — heading row has small black square marker ▪ + bold 15px #191A23 title, then links 14px rgb(102,102,102), lineHeight ~36)
│  ├─ 条款与政策: 服务协议 (/#) · 企业版服务协议 (/#) · 隐私协议 (/#) · 企业版隐私协议 (https://www.tencentcloud.com/document/product/1316/82099) · 可接受使用政策 (/#)
│  ├─ 文档指引: 产品介绍 (/#) · 常见问题 (/#)
│  ├─ 产品下载: 客户端下载 (/#)
│  └─ 联系我们: 建议反馈 (/#) · 售前咨询 (https://www.tencentcloud.com/contact-us)
├─ giant brand wordmark: row of inline SVG images, light gray (they render as the pale "🐶WORKBUDD>" artwork, ~150px tall, full width, partially clipped at bottom — see screenshot): /icons-inline/FooterLogoSvg.svg (161×161) + FooterW0..FooterW8.svg in order. Just render the 10 imgs in a flex row, gap ~5px, width full, opacity as-is (SVGs already light gray), margin-top ~80px, translate-y ~20% so bottoms clip (overflow hidden on footer).
└─ copyright: 版权 © 2026 腾讯云计算（北京）有限责任公司丨腾讯科技（深圳）有限公司 版权所有 — 13px, rgb(153,153,153), centered or left per screenshot (left-aligned at bottom, small), padding-top 24
```

## States & Behaviors

- Link hover: color → #28B894, transition 0.2s.

## Text Content (verbatim)

条款与政策 · 服务协议 · 企业版服务协议 · 隐私协议 · 企业版隐私协议 · 可接受使用政策 · 文档指引 · 产品介绍 · 常见问题 · 产品下载 · 客户端下载 · 联系我们 · 建议反馈 · 售前咨询 · 版权 © 2026 腾讯云计算（北京）有限责任公司丨腾讯科技（深圳）有限公司 版权所有

## Responsive

- Mobile: 2-col or 1-col grid stack of the 4 columns, wordmark scales down (see mobile-08 jpg).
