/* eslint-disable @next/next/no-img-element */

const NAV_ITEMS = [
  { icon: "/icons-inline/NavNewTaskIcon.svg", label: "新建任务" },
  { icon: "/icons-inline/NavClawIcon.svg", label: "Claw" },
  { icon: "/icons-inline/NavExpertIcon.svg", label: "专家" },
  { icon: "/icons-inline/NavSkillIcon.svg", label: "技能" },
  { icon: "/icons-inline/NavExploreIcon.svg", label: "探索" },
  { icon: "/icons-inline/NavConnectorIcon.svg", label: "连接器" },
  { icon: "/icons-inline/NavAutomationIcon.svg", label: "自动化" },
];

const TASKS = [
  "AI 行业趋势深度研究报告",
  "新能源公司官网生成",
  "金融分析师 Skill 自动创建",
];

const WORKSPACES = ["数据分析", "用户反馈收集", "工作周报"];

const REPORT_POINTS = [
  "Anthropic ARR 反超 OpenAI（约 300 亿 vs 250 亿美元），Claude Code 单产品撑起 25 亿——验证“价值变现单点”路径。",
  "北美四大云 2026 年 AI Capex ≈ 7100—7250 亿美元（同比 +77%），算力卖铲人仍是确定性最高的仓位。",
  "多模态原生 + 推理时计算 + Agent 编排三位一体，前沿模型与开源差距收窄，开源 TOP2 被中国队占据。",
  "中国大模型从规模竞争切向价值变现：豆包订阅、Kimi ARR 超 2 亿美元、DeepSeek 估值 450 亿。",
  "监管全球三分化：EU 8 月严管、美国放权、中国分级分类——跨境 ToB 合规成新隐形成本。",
  "风险：Agent 真生产渗透率仅 11%，若 18 个月内 ROI 不达预期，Capex 故事将被估值重估。",
];

const FILES = [
  { icon: "/demo/markdown.svg", name: "2026 AI 行业趋势.md" },
  { icon: "/demo/word.svg", name: "2026 AI 行业趋势.docx" },
  { icon: "/demo/ppt.svg", name: "2026 AI 行业趋势.pptx" },
];

export function ProductDemo() {
  return (
    <main className="bg-white px-5 py-[60px] text-[#333]">
      <div className="relative mx-auto w-full max-w-[1024px]">
        <img
          src="/demo/demo-ava.png"
          alt=""
          aria-hidden
          className="absolute -top-[120px] right-[-40px] z-10 hidden w-[240px] md:block"
        />
        <section className="grid h-[768px] w-full grid-cols-1 overflow-hidden rounded-t-xl border border-wb-line bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-[240px_1fr]">
          {/* macOS title bar */}
          <div className="col-span-full flex h-[44px] items-center gap-2 border-b border-[#F0F0F0] bg-white px-4">
            <span className="h-3 w-3 rounded-full bg-[rgb(255,95,87)]" />
            <span className="h-3 w-3 rounded-full bg-[rgb(255,189,46)]" />
            <span className="h-3 w-3 rounded-full bg-[rgb(40,200,64)]" />
          </div>

          {/* Sidebar */}
          <aside className="hidden flex-col gap-1 bg-[#F3F3F3] p-4 md:flex">
            <img src="/brand/workbuddy-logo.png" alt="WorkBuddy" className="mb-3 h-6 w-auto self-start" />
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-[#333]">
                <img src={item.icon} alt="" aria-hidden className="h-4 w-4" />
                {item.label}
              </div>
            ))}
            <div className="mt-4 px-2 text-xs text-[#999]">任务</div>
            {TASKS.map((t) => (
              <div key={t} className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-[13px] text-[#333]">
                <span className="flex items-center gap-2 truncate">
                  <img src="/icons-inline/ConvActionIcon1.svg" alt="" aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t}</span>
                </span>
                <img src="/icons-inline/ChevronSmallIcon.svg" alt="" aria-hidden className="h-3 w-3 shrink-0" />
              </div>
            ))}
            <div className="mt-4 px-2 text-xs text-[#999]">工作空间</div>
            {WORKSPACES.map((w) => (
              <div key={w} className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-[13px] text-[#333]">
                <span className="flex items-center gap-2">
                  <img src="/icons-inline/PlusSquareIcon.svg" alt="" aria-hidden className="h-4 w-4" />
                  {w}
                </span>
                <span className="text-[#999]">›</span>
              </div>
            ))}
          </aside>

          {/* Main chat panel */}
          <section className="flex min-w-0 flex-col bg-white">
            <div className="border-b border-[#F0F0F0] px-6 py-3.5 text-base font-semibold text-[#191A23]">
              AI 行业趋势深度研究报告
            </div>
            <div className="flex-1 space-y-4 overflow-hidden px-6 py-6">
              <div className="flex justify-end">
                <div className="max-w-[70%] rounded-xl bg-wb-panel px-3.5 py-2.5 text-sm text-[#333]">
                  帮我分析当前的 AI 行业趋势，并生成 markdown、word 和 ppt 报告
                </div>
              </div>
              <div className="flex items-center gap-2">
                <img src="/demo/work-face.svg" alt="WorkBuddy" className="h-6 w-6" />
                <span className="text-[13px] font-semibold text-[#191A23]">WorkBuddy</span>
              </div>
              <p className="text-sm leading-[22px] text-[#333]">我开始执行深度研究：先搜集最新行业动态，再产出结构化报告。</p>
              <div className="flex items-center justify-between border-t border-[#F0F0F0] py-2 text-[13px] text-[#666]">
                <span className="flex items-center gap-2">
                  <img src="/icons-inline/SearchToolIcon.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
                  搜索 20 篇行业深度报告
                </span>
                <span className="flex items-center gap-1 text-[#999]">
                  展开详情
                  <img src="/icons-inline/ExpandDetailIcon.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="text-sm leading-[22px] text-[#333]">信息已经足够丰富，我整合现有调研结果，撰写报告并交付。</p>
              <div className="flex items-center justify-between border-t border-[#F0F0F0] py-2 text-[13px] text-[#666]">
                <span className="flex items-center gap-2">
                  <img src="/icons-inline/CreateFileToolIcon.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
                  创建 .md .pptx .docx 格式的研究报告
                </span>
                <span className="flex items-center gap-1 text-[#999]">
                  展开详情
                  <img src="/icons-inline/ExpandDetailIcon.svg" alt="" aria-hidden className="h-3.5 w-3.5" />
                </span>
              </div>
              <p className="text-sm leading-[22px] text-[#333]">交付 AI 行业趋势研究报告</p>

              <div className="rounded-lg bg-[#F8F9FA] p-4 text-[13px] leading-[22px] text-[#333]">
                <div className="font-semibold text-[#191A23]">核心要点速览：</div>
                <ul className="mb-2 list-disc pl-5">
                  <li>
                    <b>一句话结论：</b>2026 年的 AI 行业焦点已经从“模型参数大战”切换到“Agent 落地战”，资本仍在加速涌入算力，但 ROI 兑现窗口正在收紧。
                  </li>
                </ul>
                <div className="font-semibold text-[#191A23]">六个最值得您关注的拐点：</div>
                <ul className="list-disc pl-5">
                  {REPORT_POINTS.map((p) => (
                    <li key={p.slice(0, 12)}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 text-sm font-semibold text-[#191A23]">产物汇总 6</div>
                <div className="flex flex-wrap gap-2">
                  {FILES.map((f) => (
                    <span key={f.name} className="flex items-center gap-1.5 rounded-md border border-wb-line px-2.5 py-1.5 text-[13px] text-[#333]">
                      <img src={f.icon} alt="" aria-hidden className="h-4 w-4" />
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#999]">
                <img src="/icons-inline/CopyIcon.svg" alt="复制" className="h-4 w-4" />
                <img src="/icons-inline/ThumbUpIcon.svg" alt="点赞" className="h-4 w-4" />
                <img src="/icons-inline/ThumbDownIcon.svg" alt="点踩" className="h-4 w-4" />
                <img src="/icons-inline/MoreOpsIcon.svg" alt="更多操作" className="h-4 w-4" />
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t border-[#F0F0F0] px-6 py-4">
              <div className="rounded-xl border border-wb-line p-3">
                <div className="flex items-center gap-2 text-sm text-[#999]">
                  <img src="/icons-inline/AttachIcon.svg" alt="" aria-hidden className="h-4 w-4" />
                  输入消息...
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[13px] text-[#666]">
                    <span className="flex items-center gap-1">
                      <img src="/demo/junheng.svg" alt="" aria-hidden className="h-4 w-4" />
                      Craft
                      <img src="/icons-inline/ChevronSmallIcon.svg" alt="" aria-hidden className="h-3 w-3" />
                    </span>
                    <span className="flex items-center gap-1">
                      均衡
                      <img src="/icons-inline/ChevronSmallIcon.svg" alt="" aria-hidden className="h-3 w-3" />
                    </span>
                  </div>
                  <img src="/icons-inline/SendIcon.svg" alt="发送" className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-[#999]">内容由 AI 生成，请核实重要信息。</div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
