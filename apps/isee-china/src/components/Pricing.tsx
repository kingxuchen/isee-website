"use client";

/* eslint-disable @next/next/no-img-element */
// Plain <img> for /brand/codebuddy.svg: next/image would re-encode the SVG
// (requires dangerouslyAllowSVG) and the asset is 1.4 kB — same pattern as
// src/components/icons.tsx.

import { useState } from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Pricing — 选择适合的方案
 * Spec: docs/research/components/pricing.spec.md
 * Raw:  docs/research/raw/pricing-monthly.json / targeted.json (yearly)
 * Refs: docs/design-references/desktop-04-y3440.jpg, desktop-05-y4300.jpg
 *
 * Section (white, py 80/40) > container (max-w 1180, px 24)
 *   ├─ h2 50px/60 700 font-round #000 centered
 *   ├─ p  16px/25.6 500 #5A5A5A centered
 *   └─ panel #F4F5F5 radius 24 padding 64/48 (mobile 32/20)
 *        ├─ billing toggle (track #E8E8E8 rounded-8 p-1, 44px tabs)
 *        ├─ CodeBuddy compatibility note
 *        └─ 2-col grid, max-w 880, gap 16 → Free | Pro / Team
 * ------------------------------------------------------------------ */

const CODEBUDDY_LOGO = "/brand/codebuddy.svg";
const CODEBUDDY_HREF = "https://www.codebuddy.ai/";

type BillingMode = "monthly" | "yearly";

type Price = {
  /** big number, without the leading $ */
  amount: string;
  /** struck-through list price, Pro only */
  original?: string;
  /** "/月" | "/坐席/月" | "/坐席/年" */
  unit: string;
};

type Plan = {
  id: string;
  name: string;
  cta: string;
  popular?: boolean;
  /** small green label above the feature list (Team: 企业特性：) */
  groupLabel?: string;
  price: Record<BillingMode, Price>;
  features: string[];
};

/** Verbatim content from docs/research/raw/targeted.json (both billing modes). */
const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    cta: "免费开始",
    price: {
      monthly: { amount: "0", unit: "/月" },
      yearly: { amount: "0", unit: "/月" },
    },
    features: [
      "每月 100 积分",
      "每日活跃奖励：30 积分/天",
      "Auto 模型调度",
      "5,000 次代码补全",
      "3 个自动任务",
      "专家、技能与连接器",
      "跨文件理解",
      "注释生成代码",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    cta: "开始 7 天免费试用",
    popular: true,
    price: {
      monthly: { amount: "10", original: "20", unit: "/月" },
      yearly: { amount: "8", original: "20", unit: "/月" },
    },
    features: [
      "每月 1,000 基础积分",
      "每月 1,000 赠送积分",
      "每日活跃奖励：50 积分/天",
      "可使用全部模型",
      "无限代码补全",
      "15 个自动任务",
      "专家、技能与连接器",
      "跨文件理解",
      "注释生成代码",
    ],
  },
  {
    id: "team",
    name: "Team",
    cta: "立即订阅",
    groupLabel: "企业特性：",
    price: {
      monthly: { amount: "40", unit: "/坐席/月" },
      yearly: { amount: "480", unit: "/坐席/年" },
    },
    features: [
      "每月每坐席基础 1000 Credit 积分",
      "企业加量包购买",
      "第三方登录认证",
      "组织架构管理",
      "统一订阅管理",
      "成员用量控制",
      "企业 Skill",
      "企业专家",
      "企业模型配置",
      "安全与审计",
      "OpenAPI 开放",
    ],
  },
];

const BILLING_TABS: { mode: BillingMode; label: string; badge?: string }[] = [
  { mode: "monthly", label: "按月计费", badge: "限时 5 折" },
  { mode: "yearly", label: "按年计费" },
];

/**
 * /icons-inline/PricingCheckIcon.svg inlined so `stroke="currentColor"` can
 * pick up wb-green — an <img> would render it black (no CSS inheritance).
 */
function PricingCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */

function BillingToggle({
  mode,
  onChange,
}: {
  mode: BillingMode;
  onChange: (mode: BillingMode) => void;
}) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="计费周期"
        className="flex h-[52px] items-center gap-1 rounded-lg bg-[#E8E8E8] p-1"
      >
        {BILLING_TABS.map((tab) => {
          const active = tab.mode === mode;
          return (
            <button
              key={tab.mode}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.mode)}
              className={cn(
                "flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] px-9 text-[15px] leading-[24px] font-semibold whitespace-nowrap transition-colors duration-300",
                active
                  ? "bg-white text-wb-ink shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  : "bg-transparent text-wb-gray hover:text-wb-muted",
              )}
            >
              <span>{tab.label}</span>
              {tab.badge ? (
                <span className="rounded-[4px] bg-[#C6E0CD] px-1.5 py-px text-xs leading-[18px] font-bold text-[#25AB52]">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompatibleNote() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-10 text-base leading-[24px] font-medium text-wb-ink-2">
      <span>iSee 套餐同时适用于</span>
      <a
        href={CODEBUDDY_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 transition-opacity duration-200 hover:opacity-70"
      >
        <img
          src={CODEBUDDY_LOGO}
          alt="CodeBuddy"
          width={64}
          height={22}
          className="block h-[22px] w-auto"
        />
        <span
          aria-hidden="true"
          className="flex h-[18px] w-[18px] items-center justify-center rounded-[2px] bg-wb-ink-2 text-[13px] leading-[13px] font-bold text-white"
        >
          ↗
        </span>
      </a>
    </div>
  );
}

function PriceRow({ price }: { price: Price }) {
  return (
    <div className="flex items-baseline gap-2 font-round">
      <span className="text-[32px] leading-[40px] font-bold text-wb-ink tabular-nums md:text-[40px] md:leading-[48px]">
        ${price.amount}
      </span>
      {price.original ? (
        <span className="text-[20px] leading-[28px] font-normal text-wb-gray line-through">
          {price.original}
        </span>
      ) : null}
      <span className="text-base leading-[25.6px] font-normal text-wb-muted">
        {price.unit}
      </span>
    </div>
  );
}

function PlanCard({ plan, mode }: { plan: Plan; mode: BillingMode }) {
  return (
    <article
      className={cn(
        "group flex flex-col gap-5 rounded-2xl border bg-white p-6 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1",
        plan.popular
          ? "border-wb-teal shadow-[0_0_0_1px_#32E6B9,0_18px_40px_-24px_rgba(40,184,148,0.55)] hover:shadow-[0_0_0_1px_#32E6B9,0_26px_56px_-24px_rgba(40,184,148,0.7)]"
          : "border-transparent shadow-[0_10px_30px_-20px_rgba(13,13,13,0.35)] hover:shadow-[0_22px_48px_-24px_rgba(13,13,13,0.45)]",
      )}
    >
      {/* name chip */}
      <div>
        <span className="inline-flex items-center rounded bg-wb-panel px-2.5 py-1 text-[13px] leading-[20px] font-medium text-wb-text">
          {plan.name}
        </span>
      </div>

      {/* price */}
      <PriceRow price={plan.price[mode]} />

      {/* CTA */}
      <button
        type="button"
        className={cn(
          "flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-base leading-[25.6px] font-semibold text-white transition-colors duration-300",
          plan.popular
            ? "bg-wb-green hover:bg-wb-deepgreen"
            : "bg-[#191919] hover:bg-[#333333]",
        )}
      >
        {plan.cta}
      </button>

      {/* divider + features */}
      <div className="border-t border-[#F0F0F0]" />
      <div className="flex flex-col gap-2 pt-5 pb-1">
        {plan.groupLabel ? (
          <p className="m-0 mb-2 text-[13px] leading-[20px] font-medium text-wb-green">
            {plan.groupLabel}
          </p>
        ) : null}
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm leading-[25.6px] text-wb-text"
            >
              <PricingCheckIcon className="h-6 w-6 shrink-0 text-wb-green" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */

export function Pricing() {
  // Original site default = 按月计费 (carries the 限时 5 折 badge).
  const [mode, setMode] = useState<BillingMode>("monthly");

  return (
    <section
      id="pricing"
      className="w-full bg-white pt-20 pb-10 font-sans text-wb-text"
    >
      <div className="mx-auto w-full max-w-[1180px] px-6">
        <div className="mb-7 text-center">
          <h2 className="m-0 mb-4 font-round text-[34px] leading-[44px] font-bold text-black md:text-[50px] md:leading-[60px]">
            选择适合的方案
          </h2>
          <p className="mx-auto m-0 max-w-[720px] font-round text-base leading-[25.6px] font-medium text-[#5A5A5A]">
            支持年付和月付，按需选择适合你的方案
          </p>
        </div>

        <div className="rounded-[24px] bg-wb-panel px-5 py-8 md:px-12 md:py-16">
          <BillingToggle mode={mode} onChange={setMode} />
          <CompatibleNote />
          <div className="mx-auto grid w-full max-w-[880px] grid-cols-1 items-start gap-4 md:grid-cols-2">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} mode={mode} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
