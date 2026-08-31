/* ------------------------------------------------------------------ *
 * Footer — pale page band, 4 link cards, giant clipped iSee wordmark,
 * copyright line. Server component (static + CSS hovers).
 * Spec: docs/research/components/footer.spec.md
 * Raw:  docs/research/raw/footer.json
 * Ref:  docs/design-references/desktop-06-y5160.jpg / desktop-07-y5327.jpg
 *
 * Measured from footer.json + screenshots @1440 (device px = CSS px):
 *   footer      bg #F8F9FA, padding 60px 0 20px, overflow hidden
 *   container   max-width 1920, padding 0 60px  → content 1312px
 *   cards       grid 4 × 304px, gap 32, wrapper padding 28px 0
 *               card bg #F3F3F3, radius 8, padding 24px 28px
 *   card title  14px/700 #1A1A1A + 5px black square, pb 12,
 *               border-bottom 1px #E0E0E0
 *   links       14px #666, row pitch 30px (text 19.6 + gap 10), hover wb-green
 *   wordmark    large iSee text, centered and clipped at the footer edge
 *   copyright   14px rgb(160,174,192), pb 24
 * ------------------------------------------------------------------ */

import type { FooterColumn } from "@/types";

const COPYRIGHT = "版权 © 2026 iSee 版权所有";

const COLUMNS: FooterColumn[] = [
  {
    title: "条款与政策",
    links: [
      { label: "服务协议", href: "/document/term" },
      {
        label: "企业版服务协议",
        href: "/document/enterprise-agreement",
      },
      { label: "隐私协议", href: "/document/privacy-policy" },
      {
        label: "企业版隐私协议",
        href: "/document/privacy-policy",
      },
      { label: "可接受使用政策", href: "/document/acceptable-use-policy" },
    ],
  },
  {
    title: "文档指引",
    links: [
      { label: "产品介绍", href: "/#" },
      { label: "常见问题", href: "/#" },
    ],
  },
  {
    title: "产品下载",
    links: [{ label: "客户端下载", href: "/#" }],
  },
  {
    title: "联系我们",
    links: [
      { label: "建议反馈", href: "#" },
      { label: "售前咨询", href: "mailto:support@isee.ai" },
    ],
  },
];

const COLUMN_CLASS =
  "flex flex-col items-start gap-4 rounded-lg bg-wb-panel-2 px-7 py-6";

const COLUMN_TITLE_CLASS =
  "flex w-full items-center gap-2 border-b border-[#E0E0E0] pb-3 " +
  "text-sm font-bold leading-[22px] text-wb-ink-2";

const MARKER_CLASS = "h-[5px] w-[5px] shrink-0 bg-wb-ink-2";

const LINK_CLASS =
  "w-fit text-sm leading-[20px] text-wb-muted transition-colors " +
  "duration-200 hover:text-wb-green";

const LINK_ROW_CLASS = "flex flex-col gap-[10px]";

export function Footer() {
  return (
    <footer className="relative z-[999] overflow-hidden bg-[#F8F9FA] pb-5 pt-[60px]">
      <div className="mx-auto w-full max-w-[1920px] px-[60px] max-lg:px-5">
        {/* Link cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8 py-7">
          {COLUMNS.map((column) => (
            <div key={column.title} className={COLUMN_CLASS}>
              <h3 className={COLUMN_TITLE_CLASS}>
                <span aria-hidden className={MARKER_CLASS} />
                {column.title}
              </h3>
              <ul className={LINK_ROW_CLASS}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={LINK_CLASS}
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
        </div>

        {/* Giant iSee wordmark, clipped by the footer's overflow. */}
        <div
          aria-hidden
          className="flex h-[150px] items-center justify-center overflow-hidden pt-10 max-lg:h-[104px] max-sm:pt-6"
        >
          <span className="font-heading text-[clamp(88px,14vw,150px)] leading-none font-bold tracking-[-0.06em] text-wb-ink">
            iSee
          </span>
        </div>

        {/* Copyright */}
        <div className="flex items-center pb-6 pt-6 max-sm:block">
          <p className="text-sm leading-[22px] text-[#A0AEC0] max-sm:text-center max-sm:text-[13px]">
            {COPYRIGHT}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
