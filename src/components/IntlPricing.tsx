"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * IntlPricing — standalone pricing page body (/pricing).
 * Spec: docs/research/components/pricing-page.spec.md
 * Raw:  docs/research/raw/pricing intl extraction (live site @1440)
 *
 * Structure (white bg, py 92/96):
 *   container max-w 1200 px 24 pb 64
 *   ├─ signup bonus banner      (min-h 52, bg rgb(51,51,51,6%), r14)
 *   ├─ kicker (AlimamaShuHeiTi 64/800) + h2 24px rgba(25,26,35,.5)
 *   ├─ group tabs 个人|企业      (266px, bg #EDF3F2, r14, 20px/700)
 *   ├─ billing tabs 按月|按年 8折 (266px, bg rgba(25,26,35,5%), r12, 14px)
 *   ├─ pricing grid             (max-w 736, gap 16, 360px cards)
 *   ├─ payment methods          (7 brand svgs)
 *   └─ compare card (mt 120) + FAQ (mt 120)
 * ------------------------------------------------------------------ */

const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

type BillingMode = "monthly" | "yearly";
type GroupMode = "personal" | "business";

interface Feature {
  text: string;
  /** stacked secondary line, e.g. 限时免费 */
  note?: string;
}

interface Plan {
  id: string;
  name: string;
  cta: string;
  price: Record<BillingMode, { amount: string; original?: string }>;
  unit: Record<BillingMode, string>;
  /** green group label above features (Team) */
  groupLabel?: string;
  features: Feature[];
  trialBadge?: string;
}

const GROUPS: { id: GroupMode; label: string }[] = [
  { id: "personal", label: "个人" },
  { id: "business", label: "企业" },
];

const PLANS: Record<GroupMode, Plan[]> = {
  personal: [
    {
      id: "free",
      name: "Free",
      cta: "免费开始",
      price: { monthly: { amount: "0" }, yearly: { amount: "0" } },
      unit: { monthly: "/月", yearly: "/月" },
      features: [
        { text: "每月 100 积分" },
        { text: "每日活跃奖励：30 积分/天" },
        { text: "Auto 模型调度" },
        { text: "5,000 次代码补全" },
        { text: "3 个自动任务" },
        { text: "专家、技能与连接器" },
        { text: "跨文件理解" },
        { text: "注释生成代码" },
      ],
    },
    {
      id: "pro",
      name: "Pro",
      cta: "开始 7 天免费试用",
      trialBadge: "7 天免费试用：500 基础积分/7天",
      price: {
        monthly: { amount: "10", original: "20" },
        yearly: { amount: "8", original: "20" },
      },
      unit: { monthly: "/月", yearly: "/月" },
      features: [
        { text: "每月 1,000 基础积分" },
        { text: "每月 1,000 赠送积分" },
        { text: "每日活跃奖励：50 积分/天" },
        { text: "可使用全部模型" },
        { text: "无限代码补全" },
        { text: "15 个自动任务" },
        { text: "专家、技能与连接器" },
        { text: "跨文件理解" },
        { text: "注释生成代码" },
      ],
    },
  ],
  business: [
    {
      id: "team",
      name: "Team",
      cta: "立即订阅",
      groupLabel: "企业特性：",
      price: { monthly: { amount: "40" }, yearly: { amount: "480" } },
      unit: { monthly: "/坐席/月", yearly: "/坐席/年" },
      features: [
        { text: "每月每坐席基础 1000 Credit 积分" },
        { text: "企业加量包购买" },
        { text: "第三方登录认证" },
        { text: "组织架构管理" },
        { text: "统一订阅管理" },
        { text: "成员用量控制" },
        { text: "企业 Skill" },
        { text: "企业专家" },
        { text: "企业模型配置" },
        { text: "安全与审计" },
        { text: "OpenAPI 开放" },
      ],
    },
  ],
};

const PAYMENT_ICONS = [
  { name: "wechat-pay", src: "/pricing/B3ACWGWC.svg" },
  { name: "unionpay", src: "/pricing/CfYRO3sR.svg" },
  { name: "visa", src: "/pricing/QGsXcEKE.svg" },
  { name: "mastercard", src: "/pricing/CAEw_CTq.svg" },
  { name: "jcb", src: "/pricing/IwB4cE_A.svg" },
  { name: "discover", src: "/pricing/BxfZ1o19.svg" },
  { name: "amex", src: "/pricing/uQigfOoY.svg" },
];

interface CompareRow {
  label: string;
  free: { value: string; note?: string };
  pro: { value: string; note?: string };
  /** checkbox rows (both columns checked) */
  checks?: boolean;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: "积分基础用量", free: { value: "100" }, pro: { value: "1,000" } },
  {
    label: "积分赠送用量",
    free: { value: "-" },
    pro: { value: "1,000" },
  },
  {
    label: "每日活跃奖励",
    free: { value: "30 积分/天", note: "限时免费" },
    pro: { value: "50 积分/天", note: "限时免费" },
  },
  {
    label: "代码实时补全额度",
    free: { value: "5,000 次 / 限免无限次", note: "限时免费" },
    pro: { value: "无限代码补全" },
  },
  {
    label: "自动任务",
    free: { value: "3（限免99个）", note: "限时免费" },
    pro: { value: "15（限免99个）", note: "限时免费" },
  },
  {
    label: "功能抢先体验",
    free: { value: "-" },
    pro: { value: "逐步开放" },
  },
  {
    label: "模型调度",
    free: { value: "Auto 调度 / 限免全模型", note: "限时免费" },
    pro: { value: "全模型可选" },
  },
  { label: "跨文件理解能力", free: { value: "" }, pro: { value: "" }, checks: true },
  { label: "注释生成代码", free: { value: "" }, pro: { value: "" }, checks: true },
  { label: "专家、技能与连接器", free: { value: "" }, pro: { value: "" }, checks: true },
];

const FAQS = [
  {
    id: "trial",
    q: "如何申请 Pro 的 7 天免费试用？",
    a: "选择 Pro 套餐并点击“开始 7 天免费试用”，绑定有效信用卡后即可开通。试用期间，你可以体验 7 天 Pro 权益，并获得 500 基础积分。开通当天不会扣费。试用结束后，订阅将根据你选择的计费周期，以每月 10 美元或每年 96 美元加适用税费自动续订；如不希望续订，请至少在试用结束前 1 天取消。",
  },
  {
    id: "cancel",
    q: "我可以随时取消订阅吗？",
    a: "可以。你可以随时前往个人中心取消订阅。取消后，系统将不再自动续订；在当前计费周期结束前，你仍可以继续使用当前套餐及套餐内剩余额度。",
  },
  {
    id: "limited-time",
    q: "标有“限时活动”的权益会一直提供吗？",
    a: "不会。每日活跃奖励、临时提升的代码补全额度、自动任务额度或模型使用权限等权益均为限时提供，具体变更以官网说明和后续通知为准。",
  },
  {
    id: "daily-credits",
    q: "每日活跃积分如何发放？",
    a: "当日通过客户端发起过至少一次对话，即视为当日活跃。对应积分将在次日发放至你的账户，查看详细规则。",
  },
];

/** Gift icon for the signup bonus banner. */
function GiftIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

/** Green check for feature rows & the compare table. */
function CheckGlyph({ className }: { className?: string }) {
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

function SignupBonus() {
  return (
    <div className="mb-8 flex min-h-[52px] flex-wrap items-center justify-between gap-4 rounded-[14px] bg-[#333]/[0.06] px-4 py-2.5">
      <div className="flex items-center gap-3">
        <GiftIcon className="h-6 w-6 shrink-0 text-wb-green" />
        <span className="text-[20px] leading-[28px] font-semibold text-[#050505]">
          新用户福利
        </span>
        <span className="text-[20px] leading-[28px] font-medium text-[rgba(5,5,5,0.46)]">
          注册即可领取 250 欢迎积分
        </span>
      </div>
      <button
        type="button"
        className="flex h-[52px] min-w-[110px] cursor-pointer items-center justify-center rounded-[12px] bg-wb-green px-4 text-[14px] leading-[16px] font-medium text-white transition-[opacity,background] duration-300 hover:bg-wb-deepgreen"
      >
        立即注册
      </button>
    </div>
  );
}

function GroupTabs({
  group,
  onChange,
}: {
  group: GroupMode;
  onChange: (g: GroupMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="产品类型"
      className="relative mx-auto mb-12 flex w-[266px] items-center gap-0.5 rounded-[14px] bg-[#EDF3F2] p-0.5 shadow-[0_2px_0_rgba(25,26,35,0.03)]"
    >
      <span
        aria-hidden
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[128px] rounded-[10px] bg-white shadow-[0_1px_3px_rgba(5,5,5,0.08)] transition-transform duration-300"
        style={{
          transform: `translateX(${group === "personal" ? 0 : 130}px)`,
        }}
      />
      {GROUPS.map((g) => (
        <button
          key={g.id}
          type="button"
          role="tab"
          aria-selected={group === g.id}
          onClick={() => onChange(g.id)}
          className={cn(
            "relative z-10 flex w-[130px] cursor-pointer items-center justify-center rounded-[10px] py-2 text-[20px] leading-[35px] font-bold tracking-[-0.4px] transition-colors duration-300",
            group === g.id ? "text-[#050505]" : "text-[rgba(5,5,5,0.6)]",
          )}
          style={{ fontFamily: SYSTEM_FONT }}
        >
          <span className="relative z-10">{g.label}</span>
        </button>
      ))}
    </div>
  );
}

function BillingTabs({
  mode,
  onChange,
}: {
  mode: BillingMode;
  onChange: (m: BillingMode) => void;
}) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="计费周期"
        className="relative flex w-[266px] items-center gap-0.5 rounded-[12px] bg-[rgba(25,26,35,0.05)] p-0.5"
      >
        <span
          aria-hidden
          className="absolute top-0.5 bottom-0.5 left-0.5 w-[128px] rounded-[12px] bg-white transition-transform duration-300"
          style={{
            transform: `translateX(${mode === "monthly" ? 0 : 130}px)`,
          }}
        />
        {[
          { id: "monthly", label: "按月计费" },
          { id: "yearly", label: "按年计费", badge: "8折" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            onClick={() => onChange(tab.id as BillingMode)}
            className="relative z-10 flex h-[35px] w-[130px] cursor-pointer items-center justify-center gap-1.5 rounded-[12px] text-[14px] leading-[16px] font-medium transition-colors duration-200"
            style={{
              fontFamily: SYSTEM_FONT,
              color: mode === tab.id ? "#050505" : "rgba(5,5,5,0.6)",
            }}
          >
            <span className="relative z-10">{tab.label}</span>
            {tab.badge ? (
              <span className="relative z-10 rounded-[4px] bg-[#C6E0CD] px-1.5 py-px text-[12px] leading-[18px] font-bold text-[#25AB52]">
                {tab.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, mode }: { plan: Plan; mode: BillingMode }) {
  const popular = plan.id === "pro";
  return (
    <article
      className={cn(
        "relative flex w-full max-w-[360px] flex-col rounded-[24px] bg-white p-6 transition-transform duration-300 md:p-10 md:px-6",
        popular
          ? "border border-wb-teal bg-[#1BC69B] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
          : "border border-[rgba(25,26,35,0.08)]",
      )}
    >
      {/* pro: white inner panel leaves a 32px green strip across the top */}
      {popular ? (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute top-px right-px left-px h-[32px] rounded-t-[23px] bg-[#1BC69B]"
          />
          <div className="relative flex min-w-0 flex-col">
            {plan.trialBadge ? (
              <div className="absolute top-[-32px] left-0 text-[12px] leading-[22px] font-semibold whitespace-nowrap text-white">
                {plan.trialBadge}
              </div>
            ) : null}
          </div>
        </>
      ) : null}

      <div
        className={cn(
          "relative flex min-w-0 flex-col",
          popular && "rounded-[20px] bg-white pt-2",
        )}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-[20px] leading-[35px] font-normal"
            style={{
              fontFamily: SYSTEM_FONT,
              color: "rgba(0,0,0,0.75)",
            }}
          >
            {plan.name}
          </span>
        </div>

        {/* price */}
        <div
          className="flex min-h-[44px] flex-row items-end gap-1 pt-1"
          style={{ fontFamily: SYSTEM_FONT }}
        >
          <span className="text-[32px] leading-[44px] font-semibold text-[#1A1A1A]">
            ${plan.price[mode].amount}
          </span>
          <span className="text-[14px] leading-[28px] font-normal text-[#808080]">
            {plan.unit[mode]}
          </span>
          {plan.price[mode].original ? (
            <span className="ml-1 text-[14px] leading-[28px] font-normal text-[#999999] line-through">
              {plan.price[mode].original} /月
            </span>
          ) : null}
        </div>
        {mode === "yearly" && plan.id === "pro" ? (
          <p className="mt-0.5 text-[14px] leading-[28px] text-[#808080]">
            （按年计费）
          </p>
        ) : null}

        {/* CTA */}
        <button
          type="button"
          className={cn(
            "mb-6 mt-5 flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-[12px] px-6 text-[14px] leading-[16px] font-medium text-white transition-opacity duration-300 hover:opacity-90",
            plan.id === "free" ? "bg-[#0A0B0F]" : "bg-black",
          )}
          style={{ fontFamily: SYSTEM_FONT }}
        >
          {plan.cta}
        </button>

        {/* features */}
        <div className="border-t border-[rgba(25,26,35,0.06)] pt-6">
          {plan.groupLabel ? (
            <p className="mb-2 text-[13px] leading-[20px] font-medium text-wb-green">
              {plan.groupLabel}
            </p>
          ) : null}
          <ul className="flex flex-col gap-3">
            {plan.features.map((f) => (
              <li
                key={f.text}
                className="flex items-start gap-2.5 text-[14px] leading-[22px] text-[#242424]"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                <CheckGlyph className="mt-1 h-[18px] w-[18px] shrink-0 text-wb-green" />
                <span>{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function PaymentMethods() {
  return (
    <div className="mt-8 text-center">
      <p
        className="text-[20px] leading-[28px] font-bold text-[rgba(0,0,0,0.5)]"
        style={{ fontFamily: SYSTEM_FONT }}
      >
        可使用多种支付方式升级
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4">
        {PAYMENT_ICONS.map((icon) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={icon.name}
            src={icon.src}
            alt={icon.name}
            className="h-7 w-auto opacity-80"
          />
        ))}
      </div>
    </div>
  );
}

function CompareCard() {
  return (
    <section className="mt-[120px]">
      <h3
        className="m-0 mb-6 text-center text-[32px] leading-[44px] font-medium text-wb-ink-2"
        style={{ fontFamily: SYSTEM_FONT }}
      >
        哪个计划更适合你？
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[rgba(25,26,35,0.1)]">
              <th
                className="w-[240px] py-3 pr-4 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                订阅计划
              </th>
              <th
                className="py-3 pr-4 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                Free
                <span className="mt-0.5 block text-[14px] leading-[24px] text-[#808080]">
                  $0/月
                </span>
              </th>
              <th
                className="py-3 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                Pro
                <span className="mt-0.5 block text-[14px] leading-[24px] text-[#808080]">
                  $8/月
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr
                key={row.label}
                className="border-b border-[rgba(25,26,35,0.06)]"
              >
                <td
                  className="py-3 pr-4 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {row.label}
                </td>
                <td
                  className="py-3 pr-4 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {row.checks ? (
                    <CheckGlyph className="h-5 w-5 text-wb-green" />
                  ) : (
                    <CompareCellValue cell={row.free} />
                  )}
                </td>
                <td
                  className="py-3 text-[16px] leading-[32px] font-normal text-[rgba(0,0,0,0.86)]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {row.checks ? (
                    <CheckGlyph className="h-5 w-5 text-wb-green" />
                  ) : (
                    <CompareCellValue cell={row.pro} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className="mt-[15px] max-w-full px-0 text-[12px] leading-[16px] text-[rgba(0,0,0,0.66)] md:px-[39px]"
        style={{ fontFamily: SYSTEM_FONT }}
      >
        限时免费非固定权益，具体变更以官网说明和后续通知为准
      </p>
    </section>
  );
}

function CompareCellValue({ cell }: { cell: { value: string; note?: string } }) {
  return (
    <span>
      {cell.value}
      {cell.note ? (
        <span className="mt-0.5 block text-[13px] leading-[20px] text-wb-green">
          {cell.note}
        </span>
      ) : null}
    </span>
  );
}

function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <section className="mt-[120px]">
      <h3
        className="m-0 mb-4 text-center text-[32px] leading-[44px] font-medium text-wb-ink-2"
        style={{ fontFamily: SYSTEM_FONT }}
      >
        常见问题
      </h3>
      <div>
        {FAQS.map((faq) => {
          const open = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="border-b border-[rgba(25,26,35,0.22)] py-6"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`intl-pricing-faq-${faq.id}`}
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 text-left text-[16px] leading-[22px] text-wb-ink-2 transition-opacity duration-300 hover:opacity-80"
                style={{ fontFamily: SYSTEM_FONT }}
              >
                <span>{faq.q}</span>
                <ArrowUpRight
                  aria-hidden
                  strokeWidth={1.4}
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-300",
                    open && "rotate-90",
                  )}
                />
              </button>
              <div
                id={`intl-pricing-faq-${faq.id}`}
                className="overflow-hidden transition-[max-height,padding] duration-[240ms] ease-in-out"
                style={{
                  maxHeight: open ? "200px" : "0px",
                  paddingTop: open ? "12px" : "0px",
                }}
              >
                <p
                  className="m-0 text-[16px] leading-[25.6px] text-[rgba(0,0,0,0.48)]"
                  style={{ fontFamily: SYSTEM_FONT }}
                >
                  {faq.a}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function IntlPricing() {
  const [group, setGroup] = useState<GroupMode>("personal");
  const [mode, setMode] = useState<BillingMode>("monthly");

  return (
    <section
      className="w-full bg-white px-6 pt-[92px] pb-24"
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <div className="mx-auto w-full max-w-[1200px] pb-16">
        {/* signup bonus */}
        <SignupBonus />

        {/* heading */}
        <div className="text-center">
          <h1
            className="m-0 font-heading text-[40px] leading-[52px] font-extrabold tracking-[-2.56px] text-[#050505] md:text-[64px] md:leading-[72px]"
            style={{ letterSpacing: "-2.56px" }}
          >
            WorkBuddy {group === "personal" ? "个人版" : "企业版"}
          </h1>
          <p
            className="mt-4 text-[24px] leading-[32px] text-[rgba(25,26,35,0.5)]"
            style={{ fontFamily: SYSTEM_FONT }}
          >
            根据您的实际需求，选择最合适的方案
          </p>
        </div>

        {/* group tabs + billing tabs */}
        <div className="mt-10">
          <GroupTabs group={group} onChange={setGroup} />
          <BillingTabs mode={mode} onChange={setMode} />
        </div>

        {/* pricing grid */}
        <div className="mx-auto mt-10 grid w-full max-w-[736px] grid-cols-1 justify-center gap-4 md:grid-cols-2">
          {PLANS[group].map((plan) => (
            <PlanCard key={plan.id} plan={plan} mode={mode} />
          ))}
        </div>

        {/* payment methods */}
        <PaymentMethods />

        {/* compare + faq */}
        <CompareCard />
        <Faq />
      </div>
    </section>
  );
}

export default IntlPricing;
