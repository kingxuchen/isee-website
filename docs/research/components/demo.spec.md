# ProductDemo Specification

## Overview

- **Target file:** `src/components/ProductDemo.tsx` (can be a server component — fully static)
- **Screenshot:** `docs/design-references/desktop-00-y0.jpg` (bottom half) + `desktop-01-y860.jpg` (top half)
- **Interaction model:** static (buttons/collapsibles are decorative)
- **Raw extraction:** `docs/research/raw/demo.json`

## DOM Structure

```
<main> white, padding 60px 20px
└─ wrapper: relative, w 1024px, h 768px, margin auto
   ├─ img decoration /demo/demo-ava.png (596×484 src, render 240×195) — absolute, peeks over top-right corner of the window (see screenshot: robot with checkered flag sits on the window's top-right edge)
   └─ section.demo-shell: white, w 1024 h 768, macOS window: rounded-t-xl(~12px), border #E5E5E5, subtle shadow; grid cols [240px 1fr]
      ├─ title bar strip (top, spans full width): 3 traffic-light dots rgb(255,95,87) / rgb(255,189,46) / rgb(40,200,64), 12px circles, left padding
      ├─ aside.sidebar: bg #F3F3F3, w 240, full height, flex column, padding ~16
      │  ├─ logo img /brand/workbuddy-logo.png (small, ~92px)
      │  ├─ nav items (icon 16px + label 14px, color #333, gap 8, py ~8): 新建任务(NavNewTaskIcon) · Claw(NavClawIcon) · 专家(NavExpertIcon) · 技能(NavSkillIcon) · 探索(NavExploreIcon) · 连接器(NavConnectorIcon) · 自动化(NavAutomationIcon)
      │  ├─ section label "任务" (12px, #999) + 3 task buttons (each: icon + text 13px + trailing chevron, hover bg): AI 行业趋势深度研究报告 · 新能源公司官网生成 · 金融分析师 Skill 自动创建
      │  └─ section label "工作空间" + 3 folder rows: 数据分析 · 用户反馈收集 · 工作周报 (folder icon + name + trailing ›)
      └─ section.main: white, flex column
         ├─ header: title "AI 行业趋势深度研究报告" 16px/600, border-bottom #F0F0F0, padding ~14px 24px
         ├─ chat scroll area (flex-1, padding 24px):
         │  ├─ user bubble (right-aligned): "帮我分析当前的 AI 行业趋势，并生成 markdown、word 和 ppt 报告" — bg #F4F5F5 (light gray), radius 12px, 14px/#333, padding 10px 14px, max-w 70%
         │  └─ assistant row: avatar img /demo/work-face.svg (24px) + "WorkBuddy" label 13px/600; then:
         │     ├─ p: 我开始执行深度研究：先搜集最新行业动态，再产出结构化报告。 (14px, #333, lineHeight ~22px)
         │     ├─ tool step row: SearchToolIcon + "搜索 20 篇行业深度报告" + "展开详情 ›" (row: 13px, #666, border-t dashed/light)
         │     ├─ p: 信息已经足够丰富，我整合现有调研结果，撰写报告并交付。
         │     ├─ tool step row: CreateFileToolIcon + "创建 .md .pptx .docx 格式的研究报告" + 展开详情
         │     ├─ p: 交付 AI 行业趋势研究报告
         │     ├─ report card (bg #F8F9FA, radius 8, padding 16): heading 核心要点速览： + bullet "一句话结论：2026 年的 AI 行业焦点已经从“模型参数大战”切换到“Agent 落地战”，资本仍在加速涌入算力，但 ROI 兑现窗口正在收紧。" then heading 六个最值得您关注的拐点： + 6 bullets (texts below)
         │     ├─ 产物汇总 6 (14px/600) + 3 file chips (border #E5E5E5, radius 6, padding 6 10, 13px, icon 16px + name): markdown.svg + 2026 AI 行业趋势.md · word.svg + 2026 AI 行业趋势.docx · ppt.svg + 2026 AI 行业趋势.pptx
         │     └─ action row: CopyIcon · ThumbUpIcon · ThumbDownIcon · MoreOpsIcon (16px, #999)
         ├─ input bar (padding 16 24, border-t #F0F0F0): rounded box (radius 12, border #E5E5E5, padding 12): AttachIcon + placeholder 输入消息... (#999, 14px); below row: "Craft ⌄" (junheng.svg 16px) · 均衡 ⌄ · right side SendIcon
         └─ disclaimer centered: 内容由 AI 生成，请核实重要信息。 (12px, #999)
```

## Report bullets (verbatim)

- Anthropic ARR 反超 OpenAI（约 300 亿 vs 250 亿美元），Claude Code 单产品撑起 25 亿——验证“价值变现单点”路径。
- 北美四大云 2026 年 AI Capex ≈ 7100—7250 亿美元（同比 +77%），算力卖铲人仍是确定性最高的仓位。
- 多模态原生 + 推理时计算 + Agent 编排三位一体，前沿模型与开源差距收窄，开源 TOP2 被中国队占据。
- 中国大模型从规模竞争切向价值变现：豆包订阅、Kimi ARR 超 2 亿美元、DeepSeek 估值 450 亿。
- 监管全球三分化：EU 8 月严管、美国放权、中国分级分类——跨境 ToB 合规成新隐形成本。
- 风险：Agent 真生产渗透率仅 11%，若 18 个月内 ROI 不达预期，Capex 故事将被估值重估。

## Assets

`/demo/demo-ava.png`, `/demo/work-face.svg`, `/demo/markdown.svg`, `/demo/word.svg`, `/demo/ppt.svg`, `/demo/junheng.svg`, `/brand/workbuddy-logo.png`, icons from `/icons-inline/`: NavNewTaskIcon, NavClawIcon, NavExpertIcon, NavSkillIcon, NavExploreIcon, NavConnectorIcon, NavAutomationIcon, SearchToolIcon, CreateFileToolIcon, ExpandDetailIcon, CopyIcon, ThumbUpIcon, ThumbDownIcon, MoreOpsIcon, AttachIcon, SendIcon, ChevronSmallIcon

## States & Behaviors

- N/A interactive — decorative. No hover wiring needed beyond default cursor.

## Responsive

- Desktop: fixed 1024×768 centered. Mobile (390): scales down — sidebar hidden, window w 100%, chat scrolls (see mobile-01/02 jpg). Simplest faithful approach: wrapper `overflow-x-auto` with the 1024 shell, or hide sidebar under 768px. Follow mobile screenshots.
