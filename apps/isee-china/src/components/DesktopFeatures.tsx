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
 * 桌面端功能介绍（/features）
 *
 * 数据在 src/data/desktop-features.ts，这里只管展示与两处交互：
 * 分组筛选、点截图放大。截图是真实客户端截图（webp，1400px 宽）。
 * ------------------------------------------------------------------ */

type Filter = DesktopFeatureGroupId | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "全部" },
  ...DESKTOP_FEATURE_GROUPS.map((g) => ({ id: g.id as Filter, label: g.label })),
];

/** 卡片画框固定高度；截图用 object-cover + object-top，竖版窗口也只看顶部。 */
const FRAME_HEIGHT = "h-[240px] md:h-[300px]";

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
      aria-label={`${feature.title} 截图`}
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-10"
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
          <p className="font-round text-sm">{feature.title} · {feature.summary}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer rounded-md border border-white/30 px-3 py-1 text-sm transition-colors hover:bg-white/15"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export function DesktopFeatures() {
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
      ? "下面每一张都是 iSee 桌面客户端的真实界面。点开可以放大看细节。"
      : (DESKTOP_FEATURE_GROUPS.find((g) => g.id === filter)?.blurb ?? "");

  return (
    <section
      aria-labelledby="desktop-features-title"
      className="bg-white pt-[120px] pb-[80px] text-[#191a23] md:pt-[160px]"
    >
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="text-center">
          <h1
            id="desktop-features-title"
            className="font-heading text-[34px] leading-[1.15] font-bold text-wb-ink md:text-[52px]"
          >
            桌面端长什么样
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] font-round text-[15px] leading-[26px] font-medium text-wb-muted md:text-[17px] md:leading-[30px]">
            iSee 桌面客户端把会话、Agent、工作区和设置收进一个窗口。下面是逐项界面与能力说明。
          </p>
        </div>

        <div
          role="group"
          aria-label="功能分组筛选"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
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
                  "cursor-pointer rounded-full px-[18px] py-2 font-round text-sm font-medium transition-colors duration-300",
                  active
                    ? "bg-wb-green text-white"
                    : "bg-wb-panel text-wb-ink-2 hover:bg-black/[.06]",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-4 text-center font-round text-sm text-wb-muted-2"
        >
          {groupBlurb}
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {visible.map((feature) => (
            <li
              key={feature.id}
              className="flex h-full flex-col overflow-hidden rounded-[16px] border border-wb-line bg-white shadow-[0_10px_30px_rgba(20,30,40,0.05)]"
            >
              <button
                type="button"
                onClick={() => setZoomed(feature)}
                aria-label={`放大查看 ${feature.title} 截图`}
                className={cn(
                  "group relative w-full cursor-zoom-in overflow-hidden bg-[#1b1d22]",
                  FRAME_HEIGHT,
                )}
              >
                <img
                  src={feature.image}
                  alt={feature.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </button>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h2 className="font-heading text-[20px] leading-tight font-bold text-wb-ink md:text-[22px]">
                  {feature.title}
                </h2>
                <p className="mt-2 font-round text-[14px] leading-[23px] text-wb-muted md:text-[15px] md:leading-[25px]">
                  {feature.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {feature.points.map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 font-round text-[13.5px] leading-[22px] text-wb-text md:text-[14px]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-wb-green"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {zoomed ? (
        <Lightbox feature={zoomed} onClose={() => setZoomed(null)} />
      ) : null}
    </section>
  );
}

export default DesktopFeatures;
