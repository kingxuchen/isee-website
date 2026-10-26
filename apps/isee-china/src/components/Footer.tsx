/* ------------------------------------------------------------------ *
 * Footer — 反色收场：深色整屏，左上邀请句 + 下载按钮，右侧链接组，
 * 底部是被下缘裁切的超大 iSee 字标（translateY 30%）。
 * 链接四组为真实法律/文档内容，全部保留；只去掉卡片底色与分隔线。
 * ------------------------------------------------------------------ */

import type { FooterColumn } from "@/types";

const COPYRIGHT = "© 2026 iSee. All rights reserved.";

const COLUMNS: FooterColumn[] = [
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/document/term" },
      {
        label: "Enterprise Agreement",
        href: "/document/enterprise-agreement",
      },
      { label: "Privacy Policy", href: "/document/privacy-policy" },
      {
        label: "Enterprise Privacy Policy",
        href: "/document/privacy-policy",
      },
      { label: "Acceptable Use Policy", href: "/document/acceptable-use-policy" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Product overview", href: "/#" },
      { label: "FAQ", href: "/#" },
    ],
  },
  {
    title: "Download",
    links: [{ label: "Desktop client", href: "/#" }],
  },
  {
    title: "Contact",
    links: [
      { label: "Send feedback", href: "#" },
      { label: "Talk to sales", href: "mailto:support@isee.ai" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#111318] pt-[100px] text-white lg:pt-[140px]">
      <div className="mx-auto w-full max-w-[1920px] px-5 lg:px-[60px]">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:justify-between">
          {/* 邀请 + 动作 */}
          <div className="max-w-[560px]">
            <h2 className="m-0 font-heading text-[clamp(32px,4.5vw,64px)] leading-[1.12] font-bold tracking-[-0.02em]">
              Free to start,
              <br />
              limitless after.
            </h2>
            <a
              href="#download-section"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-[4px] bg-wb-action px-7 font-heading text-[16px] font-bold text-white transition-colors duration-300 hover:bg-wb-action-deep"
            >
              Download
            </a>
          </div>

          {/* 链接组（真实内容，无卡片无分隔线） */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="m-0 text-[15px] leading-[24px] font-bold text-white">
                  {column.title}
                </h3>
                <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-[14px] leading-[22px] text-white/60 transition-colors duration-200 hover:text-white"
                        {...(link.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* 法律行：压在字标帽线上方，左右分开 */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3">
          <p className="m-0 text-[13px] leading-[20px] text-white/45">
            {COPYRIGHT}
          </p>
          <a
            href="mailto:support@isee.ai"
            className="text-[13px] leading-[20px] text-white/45 transition-colors duration-200 hover:text-white"
          >
            support@isee.ai
          </a>
        </div>
      </div>

      {/* 超大字标：底部与右缘都被裁切 */}
      <div aria-hidden className="pointer-events-none overflow-hidden">
        <p className="m-0 translate-y-[30%] font-heading text-[clamp(120px,28vw,420px)] leading-[0.9] font-bold tracking-[-0.05em] whitespace-nowrap text-white">
          iSee
        </p>
      </div>
    </footer>
  );
}

export default Footer;
