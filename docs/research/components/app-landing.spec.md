# AppLandingPage Specification (/app)

## Overview

- **Target file:** `src/app/app/page.tsx` + optional `src/components/AppLanding.tsx`
- **Route:** `/app`
- **Interaction model:** static (mock shell — the real /app is a logged-in SPA; we reproduce the welcome surface only)
- **Reference:** live <https://www.workbuddy.ai/app> — SPA shell with: top nav (WorkBuddy logo, IDE | CLI | 定价 | 文档 | 博客 | 登录), welcome card "WorkBuddy, 我帮你", scenario pill chips, input area, right column (默认权限/概览/产物 empty states)

## Layout (measured from live app)

1. Nav bar: WorkBuddy logo left; center/right links "IDE CLI 定价 文档 博客" + 登录 (dark text on white). Reuse the site Header? NO — the app shell has its OWN minimal nav (different links, no 下载 button). Build a minimal inline nav.
2. Main welcome surface (light background, centered or left-aligned):
   - H1 / hero: "WorkBuddy, 我帮你" (large, brand heading)
   - Scenario chips (12): 日常办公 代码开发 幻灯片 视频生成 深度研究 文档处理 数据分析 可视化 金融服务 产品管理 设计 邮件编辑 — pill buttons
   - Composer input: rounded input with placeholder "今天帮你做些什么？" + hint "@ 引用对话文件，/ 调用技能与指令"
   - Right side panel: tabs 默认权限/概览/产物 + empty states ("暂无内容", "引用来源 (0)")

## Implementation Notes

- Because the real /app is an authenticated app with no marketing copy, this is a faithful static mock of the visible welcome frame. Keep it minimal and elegant using existing brand tokens (wb-green, font-heading, wb-ink-2).
- Add a link back to the main site (首页) and keep 定价 link to /pricing and 文档 → /docs (or drop 文档 link if no docs pages).
- `src/app/app/page.tsx` renders with the shared Header/Footer omitted? The original app shell has its own chrome — standalone page WITHOUT the marketing Header/Footer, using its own minimal nav.
