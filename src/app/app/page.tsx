import type { Metadata } from "next";
import Link from "next/link";

/* ------------------------------------------------------------------ *
 * /app — static welcome shell for the iSee web app.
 * The live /app is a logged-in SPA; we reproduce its welcome surface
 * only: own minimal nav (logo + IDE | CLI | 定价 | 文档 | 博客 | 登录),
 * hero "iSee, 我帮你", 12 scenario chips, composer input, and a
 * right panel (默认权限 / 概览 / 产物 empty states).
 * Spec: docs/research/components/app-landing.spec.md
 * ------------------------------------------------------------------ */

const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

const NAV_LINKS = [
  { label: "IDE", href: "#" },
  { label: "CLI", href: "#" },
  { label: "定价", href: "/pricing" },
  { label: "文档", href: "/document/term" },
  { label: "博客", href: "#" },
];

const SCENARIOS = [
  "日常办公",
  "代码开发",
  "幻灯片",
  "视频生成",
  "深度研究",
  "文档处理",
  "数据分析",
  "可视化",
  "金融服务",
  "产品管理",
  "设计",
  "邮件编辑",
];

const PANEL_TABS = ["默认权限", "概览", "产物"];

export const metadata: Metadata = {
  title: "iSee",
  description: "iSee — 我帮你，你的 AI 办公工作台",
};

export default function AppLandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-white text-[#191a23]"
      style={{ fontFamily: SYSTEM_FONT }}
    >
      {/* minimal app nav */}
      <header className="sticky top-0 z-50 border-b border-[#EFEFEF] bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo.svg"
                alt=""
                width={40}
                height={40}
                className="block h-7 w-7"
              />
              <span className="font-heading text-xl leading-none font-bold text-wb-ink-2">
                iSee
              </span>
            </span>
            <ul className="hidden items-center gap-6 md:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] leading-[22px] text-wb-muted transition-colors duration-200 hover:text-wb-ink-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="cursor-pointer rounded-[8px] px-3 py-1.5 text-[14px] leading-[22px] text-wb-ink-2 transition-colors duration-200 hover:bg-black/[0.04]"
          >
            登录
          </button>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* left — welcome + scenarios + composer */}
          <div className="flex flex-col">
            <h1 className="font-heading text-[40px] leading-[56px] font-bold text-wb-ink-2 md:text-[56px] md:leading-[76px]">
              <span className="sr-only">iSee, 我帮你</span>
              <span className="whitespace-pre">iSee, 我帮你</span>
            </h1>

            <div className="mt-10 flex flex-wrap gap-3">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario}
                  type="button"
                  className="cursor-pointer rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[14px] leading-[22px] text-wb-ink-2 transition-all duration-200 hover:border-wb-green/40 hover:bg-wb-green/5"
                >
                  {scenario}
                </button>
              ))}
            </div>

            {/* composer */}
            <div className="mt-10 max-w-[720px]">
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-4 shadow-[0_8px_32px_rgba(13,13,13,0.06)] transition-shadow duration-300 focus-within:border-wb-green/50 focus-within:shadow-[0_8px_32px_rgba(40,184,148,0.12)]">
                <textarea
                  rows={3}
                  placeholder="今天帮你做些什么？"
                  className="w-full resize-none bg-transparent text-[16px] leading-[25.6px] text-wb-ink-2 outline-none placeholder:text-[#999]"
                />
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[13px] leading-[20px] text-[#999]">
                    @ 引用对话文件，/ 调用技能与指令
                  </p>
                  <button
                    type="button"
                    title="发送"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-wb-green text-white transition-colors duration-200 hover:bg-wb-deepgreen"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right — empty-state panel */}
          <aside className="h-fit rounded-2xl border border-[#EFEFEF] bg-[#FAFAFA]">
            <div
              role="tablist"
              aria-label="工作区"
              className="flex gap-1 border-b border-[#EFEFEF] p-2"
            >
              {PANEL_TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={tab === "默认权限"}
                  className={`flex-1 cursor-pointer rounded-lg px-2 py-2 text-[13px] leading-[20px] transition-colors duration-200 ${
                    tab === "默认权限"
                      ? "bg-white text-wb-ink-2 shadow-[0_1px_4px_rgba(13,13,13,0.08)]"
                      : "text-wb-muted hover:text-wb-ink-2"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
              <p className="m-0 text-[14px] leading-[22px] text-wb-muted">
                暂无内容
              </p>
              <p className="m-0 text-[13px] leading-[20px] text-[#999]">
                引用来源 (0)
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
