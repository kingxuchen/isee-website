# AgentsPage Specification (/agents)

## Overview

- **Target file:** `src/app/agents/page.tsx`
- **Interaction model:** click-driven (scenario tabs reuse Capabilities), static page otherwise
- **Route:** `/agents`

## Assembly (top → bottom)

Reuse existing components — /agents is the homepage variant with the same building blocks:

1. `<Header />` (reuse, unmodified)
2. `<Hero />` (reuse — identical layout: WorkBuddy wordmark + 我帮你 rotating word + description + 立即下载/在线使用 buttons + bg image + robot overhang)
3. `<ProductDemo />` (reuse — the exact 研究报告 chat demo: sidebar nav 新建任务/Claw/专家/技能/探索/连接器/自动化, task list, user bubble, assistant turn with tool timeline, insight section 核心要点速览, outputs 产物汇总, composer)
4. `<Capabilities />` (reuse — 你的工作好帮手 section with 研究/文档/设计/开发 tabs + carousel gallery)
5. `<Ecosystem />` (reuse — WorkBuddy 连接打通办公生态 orbit)
6. `<Pricing />` (reuse — 选择适合的方案 with Free/Pro/Team, monthly/yearly toggle, CodeBuddy note)
7. `<CtaSection />` (reuse — 开启 AI 办公新范式)
8. `<Footer />` (reuse)

## Page-level differences from homepage (verified against live site)

- The original /agents page body text contains the SAME sections as the homepage clone (hero slogan 我帮你/写文档/做分析, demo report, modes intro, ecosystem, pricing incl Team, cta). No new content blocks exist.
- Keep page wrapper `div.workbuddy-page overflow-x-hidden bg-white text-[#191a23]` + `<SmoothScroll />` like `src/app/page.tsx`.

## Notes

- Pure assembly file, no new styles needed.
- Metadata: title "WorkBuddy - AI Agent for Everyday Office Work", same description as home.
