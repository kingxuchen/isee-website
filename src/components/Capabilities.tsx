/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";

interface ScenarioTab {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  video: string;
  poster: string;
}

const TABS: ScenarioTab[] = [
  {
    id: "research",
    label: "研究",
    title: "深度调研",
    subtitle: "从查资料到给结论，15 分钟交付报告",
    description:
      "告诉 WorkBuddy 你要研究的课题，它会拆出检索路径、对信息源交叉验证，再生成结构化报告、竞品矩阵和策略建议。",
    video: "/cap/scene1.mp4",
    poster: "/cap/scene1-poster.webp",
  },
  {
    id: "docs",
    label: "文档",
    title: "办公文件生成",
    subtitle: "Word、Excel、PPT 描述需求，拿到成品",
    description:
      "描述你要的文档、表格或演示，WorkBuddy 直接生成可编辑的 Word、Excel、PPT 成品。",
    video: "/cap/scene2.mp4",
    poster: "/cap/scene2-poster.webp",
  },
  {
    id: "design",
    label: "设计",
    title: "AI 设计",
    subtitle: "不用设计工具也能产出专业视觉",
    description:
      "说出想要的风格与内容，WorkBuddy 直接产出海报、配图与品牌视觉，拿到即可用。",
    video: "/cap/scene3.mp4",
    poster: "/cap/scene3-poster.webp",
  },
  {
    id: "dev",
    label: "开发",
    title: "应用构建",
    subtitle: "把想法变成能落地的应用",
    description:
      "从想法到可运行的应用，WorkBuddy 自动完成搭建、编码与调试，交付能落地的成果。",
    video: "/cap/scene4.mp4",
    poster: "/cap/scene4-poster.webp",
  },
];

export function Capabilities() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tab = TABS[active];

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1920px] px-5 lg:px-[60px]">
        <div className="relative overflow-hidden rounded-[20px] bg-wb-panel pt-[60px] lg:rounded-[32px] lg:pt-[115px]">
          {/* Header */}
          <div className="mx-auto mb-[60px] max-w-[70%] text-center lg:mb-[160px]">
            <div className="flex items-center justify-center gap-3">
              <img
                src="/icons-inline/HeroBuddySvg.svg"
                alt="WorkBuddy"
                className="h-10 w-auto lg:h-14"
              />
              <h2 className="font-heading text-[28px] leading-tight text-wb-ink lg:text-[48px]">
                你的工作好帮手
              </h2>
            </div>
            <p className="mt-4 text-sm text-wb-muted lg:text-base">
              把任务交给它，WorkBuddy
              会自主规划、调用工具、生成文件，并把过程与结果都留给你审核
            </p>
          </div>

          {/* White content wrapper */}
          <div className="relative grid grid-cols-1 gap-10 bg-white px-6 py-10 lg:grid-cols-[40%_60%] lg:px-[60px] lg:py-[60px]">
            {/* Mascots anchored to the wrapper's top edge, sitting in the gray zone */}
            <img
              src="/cap/scenario1-feature1.png"
              alt=""
              aria-hidden
              className="absolute -top-[96px] left-[40px] z-10 hidden w-[120px] lg:block"
            />
            <img
              src="/cap/scenario1-feature2.png"
              alt=""
              aria-hidden
              className="absolute -top-[165px] left-[150px] z-10 hidden w-[200px] lg:block"
            />
            <div className="text-left">
              {/* Tabs */}
              <div className="inline-flex gap-1 rounded-lg bg-wb-panel p-1">
                {TABS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActive(i);
                      setPlaying(true);
                    }}
                    className={`rounded px-[25px] py-2 text-base transition-all duration-300 lg:text-[21px] ${
                      i === active
                        ? "bg-wb-green text-white"
                        : "text-black hover:bg-black/5"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <h3 className="mt-8 font-heading text-[26px] text-wb-ink lg:text-[32px]">
                {tab.title}
              </h3>
              <h4 className="mt-2 text-lg font-semibold text-[#191A23] lg:text-xl">
                {tab.subtitle}
              </h4>
              <p className="mt-4 max-w-[420px] text-sm leading-[26px] text-wb-muted lg:text-base">
                {tab.description}
              </p>
              <a
                href="#"
                className="mt-8 flex h-12 w-12 items-center justify-center rounded-lg bg-black transition-colors duration-300 hover:bg-[#333]"
                aria-label="scenario detail link"
              >
                <img
                  src="/icons-inline/ArrowUpRightIcon.svg"
                  alt=""
                  aria-hidden
                  className="h-[30px] w-[30px]"
                />
              </a>
            </div>

            {/* Laptop + video */}
            <div className="relative">
              <img src="/cap/mac.png" alt="MacBook" className="w-full" />
              <video
                key={tab.id}
                ref={videoRef}
                src={tab.video}
                poster={tab.poster}
                autoPlay
                muted
                loop
                playsInline
                className="absolute left-[13%] top-[7%] w-[74%] object-cover"
              />
            </div>
          </div>

          {/* Play controls */}
          <div className="flex items-center justify-center gap-4 bg-white pb-[60px] pt-[40px] lg:pt-[100px]">
            <button
              onClick={togglePlay}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-wb-line transition-colors hover:bg-black/5"
              aria-label={playing ? "pause" : "play"}
            >
              {playing ? (
                <span className="flex h-3 items-center gap-[3px]">
                  <span className="h-3 w-[3px] bg-black" />
                  <span className="h-3 w-[3px] bg-black" />
                </span>
              ) : (
                <img
                  src="/icons-inline/PlayIcon.svg"
                  alt=""
                  aria-hidden
                  className="h-3 w-3"
                />
              )}
            </button>
            <div className="h-3 w-16 overflow-hidden rounded-full bg-[#E5E5E5]">
              <div className="h-full w-[40%] rounded-full bg-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
