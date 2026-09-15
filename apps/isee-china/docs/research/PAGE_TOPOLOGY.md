# Page Topology — workbuddy.ai (homepage, zh-CN)

Target: <https://www.workbuddy.ai/> — desktop page height ~6227px @1440w, mobile ~6682px @390w.
Tech of original: React SPA (Vite build) on Tencent COS assets. Lenis smooth scroll active (`html.lenis`).

## Sections (top → bottom)

1. **Header** (`<header class="header">`) — FIXED overlay, 80px tall, full-width. z-index above all. Contains: logo (workbuddy-logo.png), nav links 首页 / 定价, right cluster: Intl-中文 dropdown button, 下载 black pill button, 登录 text button. Mobile: hamburger menu opens a panel (logo + ×, 首页/定价 list, Intl button, 登录, 下载 WorkBuddy).
2. **Hero** — white bg with layered artwork: `home-bg.png` (2946×2293, contains diagonal lines + giant WORK BUDDY watermark text, positioned left/bottom), robot mascot with checkered flag (right side). Content: WORK BUDDY logo image + "我帮你" headline with **rotating word** (写文档 / 做分析 / …), subtitle paragraph, CTA row: 立即下载 (green solid) + 在线使用 (green outline, links /app).
3. **ProductDemo** — macOS-window-framed static chat demo. Sidebar: logo, 新建任务, Claw, 专家, 技能, 探索, 连接器, 自动化 + 任务 list (3 items) + 工作空间 (3 folders). Main: chat titled "AI 行业趋势深度研究报告", user bubble, WorkBuddy avatar + reply with 2 collapsible tool steps (搜索 20 篇行业深度报告 / 创建 .md .pptx .docx), delivered report summary (核心要点速览 + 六个拐点 bullet list), 产物汇总 6 file chips (md/docx/pptx), input bar (输入消息…, Craft, 均衡, send) + disclaimer "内容由 AI 生成，请核实重要信息。".
4. **Capabilities** — rounded light-gray panel (#F4F5F5-ish) containing: WORK BUDDY logo + "你的工作好帮手" heading + subtitle, two small mascot images (dog-robot, cat-robot), **tab pills: 研究 / 文档 / 设计 / 开发** (click-driven), then per-tab: heading (深度调研…), paragraph, arrow-button link to docs, laptop mockup (`mac.png` frame) playing per-tab video (scene1..4 mp4 + posters), play/progress controls below.
5. **Ecosystem** — white bg. Heading "WorkBuddy 连接打通办公生态" + paragraph. Visual: center WorkBuddy app icon in soft green radial glow, two `.orbit-ring` circles (gradient border rings), 7 app pills positioned around: Jira, Google Drive, Github, Linear, Office, Notion, Slack (icon svg + name in white rounded pill with shadow).
6. **Pricing** — heading 选择适合的方案 + subtitle. Light gray rounded panel: toggle [按月计费(限时 5 折 badge) | 按年计费], note "WorkBuddy套餐同时适用于 CodeBuddy ↗" (codebuddy.svg), 3 cards: Free $0/月, Pro $10(划线20)/月 green border, Team $40/坐席/月. Each: name chip, price, CTA button, feature checklist with green check icons. Yearly state: Pro $8/月, Team $480(?/年) — verify per-card values during extraction.
7. **CTA** — two-column: left "开启 AI 办公新范式" + paragraph + 立即下载 green button; right autoplaying looping muted video (join.mp4, robot in desert scene).
8. **Footer** — 4 columns (条款与政策 / 文档指引 / 产品下载 / 联系我们) with link lists, giant WORK BUDDY watermark image at bottom (workbuddy-logo.png light gray), copyright line: "版权 © 2026 腾讯云计算（北京）有限责任公司丨腾讯科技（深圳）有限公司 版权所有".

## Layout / layering

- Header: fixed, z high, backdrop-blur.
- All sections in normal document flow; Lenis wraps scroll.
- No scroll-snap. No dark section transitions. Page bg white.

## Per-section interaction models

| Section | Model |
| --- | --- |
| Header | static appearance (no scroll state change); dropdown + mobile menu are click-driven |
| Hero | rotating word = time-driven ticker |
| ProductDemo | static (decorative collapsibles are inert in demo) |
| Capabilities | click-driven tabs (4 states: 研究/文档/设计/开发), video playback per tab |
| Ecosystem | check orbit ring animation during extraction (likely CSS `scroll`/`pulse` keyframes) |
| Pricing | click-driven monthly/yearly toggle (price values change) |
| CTA | autoplay video, static otherwise |
| Footer | static; link hovers |
