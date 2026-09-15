"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DownloadDogIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Hero — white section, 490px tall at ≥768px (raw/hero.json: h=490 @1440w).
 *
 * Artwork note:
 *   · The flag-bearing robot sits above the demo card as its own absolute
 *     layer, matching the original desktop composition.
 *
 * Slogan line = iSee + 我帮你 + rolling word.
 * Raw snapshot computes 60px/80px Alimama ShuHeiTi 700 (the brief's ~48px is
 * the mobile size — see the "deviations" note in the PR summary).
 *
 * Spec: docs/research/components/hero.spec.md
 * Raw:  docs/research/raw/hero.json · docs/research/raw/hero-main.html
 * ------------------------------------------------------------------ */

/** Source 596×484 → rendered 240×194.9. */
const AVA_SIZE = { width: 596, height: 484 };
const AVA_SRC = "/demo/demo-ava.png";

const WORDS = ["写文档", "做分析", "写代码", "做设计", "做投资"] as const;
const WORD_INTERVAL = 2000;
const LETTER_STAGGER = 40;

/** Scoped keyframes (kept in-component so globals.css stays untouched). */
const TICKER_CSS = `@keyframes wb-hero-word{0%{transform:translateY(130%)}25%,100%{transform:translateY(0)}}`;
const TICKER_ANIMATION = "wb-hero-word 1000ms cubic-bezier(0.22,1,0.36,1) both";

const DOWNLOAD_ITEMS = [
  { label: "Mac x64", current: false },
  { label: "Mac ARM64", current: true },
  { label: "Windows x64 (兼容 ARM64)", current: false },
];

/** Body/label font of the original hero (raw/hero.json). */
const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

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
        className="relative inline-flex overflow-hidden py-1 whitespace-pre"
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
      <style>{TICKER_CSS}</style>
    </>
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
        className="flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-[4px] bg-wb-green px-6 font-heading text-[18px] leading-[27px] font-bold whitespace-nowrap text-white transition-colors duration-300 hover:bg-wb-deepgreen"
      >
        <DownloadDogIcon className="h-6 w-6 shrink-0" />
        <span>立即下载</span>
      </button>

      <ul
        role="listbox"
        aria-label="下载版本"
        aria-hidden={!open}
        className={cn(
          "absolute top-[54px] right-0 z-20 min-w-full rounded-lg border border-wb-green/25 bg-white p-1.5 font-round shadow-[0_12px_32px_rgba(40,184,148,0.18),0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
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
              <span className="rounded-full bg-wb-green/10 px-1.5 py-0.5 text-[11px] leading-[16px] font-medium text-wb-green">
                当前设备
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
    <section
      className="relative w-full overflow-hidden bg-white"
      style={{ fontFamily: SYSTEM_FONT, color: "rgb(25, 26, 35)" }}
    >
      {/* ---------- content ---------- */}
      <div className="relative z-10 mx-auto flex min-h-[490px] max-w-[1920px] flex-col items-center justify-center gap-6 px-6 pt-[104px] pb-12 md:gap-[60px] md:px-[60px] md:pt-[120px] md:pb-[60px]">
        <div className="relative z-10 flex w-full max-w-[720px] flex-col items-center">
          <h1 className="flex max-w-[1000px] flex-wrap items-center justify-center gap-2 text-center font-heading text-[28px] leading-[40px] font-bold text-wb-ink-2 md:flex-nowrap md:text-[60px] md:leading-[80px]">
            <span className="sr-only">iSee 我帮你</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-[42px] leading-none md:text-[68px]"
            >
              iSee
            </span>
            <span className="whitespace-pre">
              我帮你
              <RotatingWord />
            </span>
          </h1>

          <p className="mt-6 max-w-[720px] text-center font-round text-[16px] leading-[1.8] font-medium text-wb-ink-2 md:mt-0 md:text-[20px] md:leading-[40px]">
            iSee 是一款全场景 AI 办公工作台。说出要求、开始执行任务、交付完整成果。连接 iSee 办公生态，你的办公好搭子
          </p>
        </div>

        <div
          id="download-section"
          className="relative z-10 flex flex-wrap items-center justify-center gap-6"
        >
          <DownloadButton />
          <a
            href="#"
            className="flex h-12 w-[184px] items-center justify-center rounded-[4px] border border-wb-green bg-transparent font-heading text-[18px] leading-[36px] font-bold tracking-[1.08px] text-wb-green transition-colors duration-300 hover:bg-wb-green/5"
          >
            <span>在线使用</span>
          </a>
        </div>
      </div>

      {/* ---------- robot overhang (demo section decoration) ---------- */}
      <div className="pointer-events-none absolute top-[375px] right-[-20px] z-20 hidden h-[195px] w-[240px] lg:block">
        <Image
          src={AVA_SRC}
          alt=""
          aria-hidden
          width={AVA_SIZE.width}
          height={AVA_SIZE.height}
          loading="eager"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    </section>
  );
}

export default Hero;
