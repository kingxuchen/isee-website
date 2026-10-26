/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DESKTOP_FEATURES,
  DESKTOP_FEATURE_GROUPS,
  type DesktopFeature,
  type DesktopFeatureGroupId,
} from "@/data/desktop-features";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * What it does — 钉住的标题 + 经过的行（绿色饱和色场，全墨文字）。
 *
 * 左列钉住「What it does」与分组筛选（纯文字按钮，活跃项带实心圆点）；
 * 右列 12 个功能块依次经过，每块一张真实客户端截图，左右交替。
 * 截图点开仍是放大灯箱。
 *
 * 对比度说明：#28b894 绿场上半透明墨色最高只有 3.7:1，不达 AA，
 * 因此本节文字一律全墨 #0d0d0d（7.2:1），层级只靠字号与字重。
 * ------------------------------------------------------------------ */

type Filter = DesktopFeatureGroupId | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...DESKTOP_FEATURE_GROUPS.map((g) => ({ id: g.id as Filter, label: g.label })),
];

function Lightbox({
  feature,
  onClose,
}: {
  feature: DesktopFeature;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${feature.title} screenshot`}
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/80 p-4 lg:p-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[1200px]"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={feature.image}
          alt={feature.imageAlt}
          className="block max-h-[82vh] w-full rounded-lg object-contain"
        />
        <div className="mt-3 flex items-center justify-between gap-4 text-white/85">
          <p className="text-sm">
            {feature.title} · {feature.summary}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-md px-3 py-1 text-sm underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function Capabilities() {
  const [filter, setFilter] = useState<Filter>("all");
  const [zoomed, setZoomed] = useState<DesktopFeature | null>(null);

  const visible = useMemo(
    () =>
      filter === "all"
        ? DESKTOP_FEATURES
        : DESKTOP_FEATURES.filter((feature) => feature.group === filter),
    [filter],
  );

  const groupBlurb =
    filter === "all"
      ? "Every screen below is the real iSee desktop client. Click one to zoom in."
      : (DESKTOP_FEATURE_GROUPS.find((g) => g.id === filter)?.blurb ?? "");

  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="bg-wb-green text-wb-ink"
    >
      <div className="mx-auto max-w-[1920px] px-5 py-[100px] lg:px-[60px] lg:py-[160px]">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* 钉住的标题列（cols 1–5） */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <h2
                id="features-title"
                className="m-0 font-heading text-[clamp(40px,6.6vw,88px)] leading-[1.05] font-bold tracking-[-0.02em]"
              >
                What it does
              </h2>
              <p className="mt-5 max-w-[38ch] text-[16px] leading-[26px]">
                Chats, agents, group collaboration, workspace and settings in one window. Every item below is a real screen with what it can do.
              </p>

              <div
                role="group"
                aria-label="Filter features by group"
                className="mt-10 flex flex-wrap gap-x-7 gap-y-2 lg:flex-col lg:items-start lg:gap-y-1"
              >
                {FILTERS.map((item) => {
                  const active = item.id === filter;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(item.id)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 py-1.5 text-[17px] leading-[28px] transition-colors duration-200",
                        active ? "font-bold" : "font-normal hover:font-medium",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "h-2.5 w-2.5 shrink-0 rounded-full bg-wb-ink transition-[opacity,transform] duration-200",
                          active ? "scale-100 opacity-100" : "scale-50 opacity-0",
                        )}
                      />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <p aria-live="polite" className="mt-6 text-[14px] leading-[22px]">
                {groupBlurb}
              </p>
            </div>
          </div>

          {/* 经过的功能行（cols 7–12） */}
          <ul className="m-0 mt-16 flex list-none flex-col gap-[72px] p-0 lg:col-span-6 lg:col-start-7 lg:mt-0 lg:gap-[120px]">
            {visible.map((feature, index) => (
              <li key={feature.id}>
                <h3 className="m-0 font-heading text-[24px] leading-[32px] font-bold lg:text-[28px]">
                  {feature.title}
                </h3>
                <div
                  className={cn(
                    "mt-6 flex flex-col gap-7 sm:flex-row sm:items-start",
                    index % 2 === 1 && "sm:flex-row-reverse",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setZoomed(feature)}
                    aria-label={`Zoom in on the ${feature.title} screenshot`}
                    className="group block w-full shrink-0 cursor-zoom-in overflow-hidden rounded-[6px] bg-wb-ink sm:w-[300px]"
                  >
                    <img
                      src={feature.image}
                      alt={feature.imageAlt}
                      width={1366}
                      height={854}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                  <div className="min-w-0">
                    <p className="m-0 text-[17px] leading-[26px] font-medium">
                      {feature.summary}
                    </p>
                    <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-[16px] leading-[24px]">
                      {feature.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {zoomed ? (
        <Lightbox feature={zoomed} onClose={() => setZoomed(null)} />
      ) : null}
    </section>
  );
}
