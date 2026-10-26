"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Showcase — 「可以输入的标题」（原 ProductDemo）。
 *
 * 页面唯一的 live thing：标题本身是一个真实 <input>，预填一个用户会给
 * iSee 的任务；下面按输入内容换成客户端处理这类事的真实界面截图。
 * 底部三个示例是纯文本按钮，点按重新填充这一行。
 *
 * 无脚本时输入框仍可编辑、默认截图仍在 —— 截图全部是真实客户端界面，
 * 不是伪造的「实时演示」。
 * ------------------------------------------------------------------ */

type DemoTask = {
  /** 匹配输入的关键词（任一命中即切换到这张真实界面）。 */
  keys: string[];
  image: string;
  alt: string;
  caption: string;
};

const TASKS: DemoTask[] = [
  {
    keys: ["analy", "data", "report", "summar", "doc", "sheet", "table"],
    image: "/features/02-agent-chat.webp",
    alt: "Real iSee desktop client: agent chat returning a table",
    caption: "Ask for it — the agent delivers the analysis",
  },
  {
    keys: ["collaborat", "team", "group", "together", "multiple"],
    image: "/features/03-group-chat.webp",
    alt: "Real iSee desktop client: multiple agents collaborating in a group chat",
    caption: "@ the group — each agent claims its own task",
  },
  {
    keys: ["market", "install", "new agent", "find"],
    image: "/features/09-agent-market.webp",
    alt: "Real iSee desktop client: the Agent Market",
    caption: "Pick an agent from the market and it starts working",
  },
];

const EXAMPLES = [
  "Run a quarterly sales analysis for me",
  "Have a few agents run the release check together",
  "Find an agent in the market that makes slide decks",
];

/** 输入命中哪张真实界面：按关键词，未命中回落到第一张。 */
function matchTask(text: string): DemoTask {
  for (const task of TASKS) {
    if (task.keys.some((key) => text.includes(key))) return task;
  }
  return TASKS[0];
}

export function ProductDemo() {
  const [value, setValue] = useState(EXAMPLES[0]);
  const task = useMemo(() => matchTask(value), [value]);

  return (
    <section
      aria-labelledby="demo-title"
      className="bg-white px-5 py-[120px] lg:px-[60px] lg:py-[160px]"
    >
      <div className="mx-auto max-w-[1280px]">
        <h2 id="demo-title" className="m-0">
          <label className="block cursor-text">
            <span className="sr-only">Type what you want iSee to do</span>
            <input
              type="text"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              spellCheck={false}
              autoComplete="off"
              className="w-full cursor-text border-0 bg-transparent p-0 font-heading text-[clamp(32px,5.2vw,76px)] leading-[1.1] font-bold tracking-[-0.02em] text-wb-ink caret-wb-action outline-none placeholder:text-wb-gray"
              placeholder="Say what you need done"
            />
          </label>
        </h2>

        {/* 产品的回答：与任务匹配的真实客户端界面，真实尺寸、左侧对齐 */}
        <figure className="mt-12">
          <div
            data-ui
            className="relative w-full max-w-[880px] overflow-hidden rounded-[8px] bg-[#1b1d22]"
          >
            {TASKS.map((item) => (
              <img
                key={item.image}
                src={item.image}
                alt={item.alt}
                width={1366}
                height={854}
                className={cn(
                  "block w-full transition-opacity duration-500",
                  item.image === task.image
                    ? "opacity-100"
                    : "absolute inset-0 opacity-0",
                )}
              />
            ))}
          </div>
          <figcaption className="mt-4 text-[15px] leading-[24px] text-wb-muted">
            {task.caption} — captured from the real client
          </figcaption>
        </figure>

        {/* 三个示例：纯文本按钮，点按重填这一行 */}
        <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setValue(example)}
              className={cn(
                "cursor-pointer p-0 text-left text-[17px] leading-[28px] transition-colors duration-200",
                value === example
                  ? "font-medium text-wb-ink"
                  : "text-wb-muted hover:text-wb-ink",
              )}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductDemo;
