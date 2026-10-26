"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DownloadOwlIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Hero — sentence-as-layout：深色字报，整屏一句话。
 *
 * 句子 = iSee 的名字双关「我帮你 + 滚动动词」，行内嵌一条产品实况视频
 * （/cta/join.mp4 裁成一行高的条带）——一个方向槽位，不多不少。
 * 动效：两行各自从基线后升起（masked line reveal），随后副文案与动作淡入。
 *
 * 对比度说明：动作按钮用 wb-action 深绿（白字 5.3:1），品牌绿 #28b894
 * 只做非文字标记——品牌绿上白字仅 2.5:1，不达 AA。
 * ------------------------------------------------------------------ */

const WORDS = ["write docs", "run analysis", "write code", "make designs", "do research"] as const;
const WORD_INTERVAL = 2000;
const LETTER_STAGGER = 40;

const VIDEO_SRC = "/cta/join.mp4";
const VIDEO_POSTER = "/cta/join-poster.jpg";

const HERO_CSS = `
@keyframes wb-hero-word{0%{transform:translateY(130%)}25%,100%{transform:translateY(0)}}
@keyframes wb-hero-line{from{transform:translateY(110%)}to{transform:translateY(0)}}
@keyframes wb-hero-fade{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.wb-hero-line{display:inline-block;animation:wb-hero-line 900ms cubic-bezier(0.22,1,0.36,1) both}
.wb-hero-fade{animation:wb-hero-fade 700ms cubic-bezier(0.22,1,0.36,1) both}
@media (prefers-reduced-motion: reduce) {
  .wb-hero-line, .wb-hero-fade, .wb-hero-word { animation: none !important; }
}
`;

const TICKER_ANIMATION = "wb-hero-word 1000ms cubic-bezier(0.22,1,0.36,1) both";

const DOWNLOAD_ITEMS = [
  { label: "Mac x64", current: false },
  { label: "Mac ARM64", current: true },
  { label: "Windows x64 (ARM64 compatible)", current: false },
];

const letterStyle = (i: number) =>
  ({
    animation: TICKER_ANIMATION,
    animationDelay: `${i * LETTER_STAGGER}ms`,
  }) satisfies CSSProperties;

/** 写文档 → 做分析 → 写代码 → 做设计 → 做投资, letters rolling up into place. */
function RotatingWord() {
  const [index, setIndex] = useState(0);
  const frame = useRef<number>(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Bump on the next frame so the new word remounts cleanly and restarts
      // the CSS animation even if the tab was throttled.
      frame.current = window.requestAnimationFrame(
        () => void setIndex((current) => (current + 1) % WORDS.length),
      );
    }, WORD_INTERVAL);
    return () => {
      window.clearInterval(interval);
      window.cancelAnimationFrame(frame.current);
    };
  }, []);

  const word = WORDS[index];

  return (
    <>
      <span className="sr-only">{word}</span>
      <span
        aria-hidden="true"
        className="relative inline-flex overflow-hidden whitespace-pre"
      >
        {word.split("").map((letter, i) => (
          <span
            key={`${index}-${i}`}
            className="inline-block"
            style={letterStyle(i)}
          >
            {letter}
          </span>
        ))}
      </span>
    </>
  );
}

/** 行内媒体槽：一行高（0.74em）× 2em 宽的产品实况条，坐在句子基线上。 */
function InlineReel() {
  return (
    <span
      aria-hidden="true"
      className="relative mx-[0.12em] inline-block h-[0.74em] w-[2em] translate-y-[0.1em] overflow-hidden rounded-[0.14em] align-baseline"
    >
      <video
        className="block h-full w-full object-cover"
        src={VIDEO_SRC}
        poster={VIDEO_POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      />
    </span>
  );
}

/** 立即下载 — green CTA that opens the platform menu on click. */
function DownloadButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-wb-action px-7 font-heading text-[18px] leading-[27px] font-bold whitespace-nowrap text-white transition-colors duration-300 hover:bg-wb-action-deep"
      >
        <DownloadOwlIcon className="h-7 w-7 shrink-0" />
        <span>Download</span>
      </button>

      <ul
        role="listbox"
        aria-label="Download version"
        aria-hidden={!open}
        className={cn(
          "absolute top-[54px] right-0 z-20 min-w-full rounded-lg bg-white p-1.5 transition-[opacity,transform] duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100 shadow-[0_12px_32px_rgba(0,0,0,0.28)]"
            : "pointer-events-none -translate-y-1 opacity-0 shadow-none",
        )}
      >
        {DOWNLOAD_ITEMS.map((item) => (
          <li
            key={item.label}
            role="option"
            aria-selected={item.current}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") setOpen(false);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm leading-[22px] whitespace-nowrap text-wb-ink-2 transition-colors duration-150 hover:bg-wb-panel-2",
              item.current && "bg-black/[0.02]",
            )}
          >
            <span>{item.label}</span>
            {item.current && (
              <span className="rounded-full bg-wb-action/10 px-1.5 py-0.5 text-[13px] leading-[18px] font-medium text-wb-action">
                This device
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0d0d0d] text-white">
      <style>{HERO_CSS}</style>
      <div className="mx-auto flex min-h-[100svh] max-w-[1920px] flex-col items-center justify-center px-5 pt-24 pb-16 lg:px-[60px]">
        <h1
          aria-label="iSee helps you run analysis"
          className="text-center font-heading text-[clamp(34px,8.5vw,120px)] leading-[1.04] font-bold tracking-[-0.03em] whitespace-nowrap"
        >
          <span aria-hidden="true" className="block overflow-hidden py-[0.06em]">
            <span className="wb-hero-line">
              iSee helps you
              <InlineReel />
            </span>
          </span>
          <span aria-hidden="true" className="block overflow-hidden py-[0.06em]">
            <span
              className="wb-hero-line"
              style={{ animationDelay: "110ms" }}
            >
              <RotatingWord />
            </span>
          </span>
        </h1>

        <p
          className="wb-hero-fade mt-8 max-w-[680px] text-center text-[16px] leading-[1.8] text-[#9aa3ad] lg:text-[18px]"
          style={{ animationDelay: "520ms" }}
        >
          iSee is an all-scenario AI office workbench. Say what you need,
          let agents run the task, and get the finished result — connected to
          the office tools you already use.
        </p>

        <div
          id="download-section"
          className="wb-hero-fade mt-10 flex flex-wrap items-center justify-center gap-7"
          style={{ animationDelay: "620ms" }}
        >
          <DownloadButton />
          <a
            href="#"
            className="font-heading text-[16px] font-bold text-white/85 underline decoration-white/40 underline-offset-8 transition-colors duration-300 hover:text-white hover:decoration-white"
          >
            Use online
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
