# IntlPricingPage Specification (独立定价页 /pricing)

## Overview

- **Target file:** `src/app/pricing/page.tsx` + `src/components/IntlPricing.tsx`
- **Reference screenshots:** `docs/design-references/qa-pricing-cards-final.jpg`, `pricing-top.jpg`, `qa-pricing-mobile-final2.jpg`
- **Interaction model:** click-driven (个人/企业 group tabs + 按月/按年 billing tabs + FAQ accordion)
- **Route:** `/pricing`

## Page Structure (top → bottom)

1. Header (reuse `src/components/Header.tsx`)
2. `section.pricing-plans.intl-pricing` — white bg, **padding: 92px 24px 96px** (mobile px 32)
   - container `.intl-container` max-width 1200px, **padding-bottom 64px**
   - **Signup bonus banner** `.intl-signup-bonus`
   - **Heading**: kicker "WorkBuddy 个人版"/"WorkBuddy 企业版" + h2, **wrapper mb 62px**
   - **Group tabs** 个人/企业 (**h 55px, mb 48px**)
   - **Billing tabs** 按月/按年 + 8折 badge (**h 36px, wrapper mb 24px**)
   - **Pricing grid** — **fixed rows 641px**, gap 16, max-w 736 (个人: Free|Pro; 企业: Team)
   - **Payment methods** (mt 32px)
   - **Compare card** (mt 120px; h3 mb 48px; table wrap padding 39px)
   - **FAQ** (mt 120px)
3. Footer (reuse `src/components/Footer.tsx`)

## Computed Styles (exact values @1440)

### Signup bonus banner `.intl-signup-bonus`

- flex, space-between, items center, gap 16, **padding 10px 16px, margin-bottom 32px, min-height 52px**
- background rgb(51,51,51,6%) ≈ #E5E5E6, border-radius 14px
- gift svg icon (24px, wb-green) + title "新用户福利" 20px/600/28 #050505 + desc 20px/500/28 rgba(5,5,5,.46)
- action "立即注册": 14px/500/16 white, bg **wb-green #28B894**, padding 0 16px, radius 12, hover deepgreen

### Heading

- kicker "WorkBuddy 个人版": **64px/800/72, letter-spacing -2.56px**, AlimamaShuHeiTi (font-heading), #050505, center
  - responsive: 48px @<1200, 40px/52 @<768
- h2: "根据您的实际需求，选择最合适的方案" — **24px/400/32, rgba(25,26,35,.5)**, center
- wrapper: **margin-bottom 62px**

### Group tabs `.intl-group-tabs` (个人 | 企业)

- width 266px, margin 0 auto, **padding 2px, gap 2px, height 55px**, radius 14, bg #EDF3F2, shadow 0 2px 0 rgba(25,26,35,.03)
- tab: w 130, **20px/700/35, letter-spacing -0.4, #050505**, radius 10, transition .3
- active tab = white sliding pill (`.intl-group-bg`) + shadow; inactive text rgba(5,5,5,.6)
- switching re-renders grid (Free+Pro ⇄ Team) and kicker text

### Billing tabs `.billing-tabs` (按月计费 | 按年计费 8折)

- wrapper **margin-bottom 24px**, flex center
- track: 266w, h 36, padding 2, gap 2, radius 12, bg rgba(25,26,35,5%)
- tab: w 130, **14px/500/16**, radius 12, active bg white pill + #050505, inactive rgba(5,5,5,.6)
- badge "8折": bg #C6E0CD, text #25AB52, 12px bold, radius 4
- monthly → Pro $10 orig 20; yearly → Pro $8 orig 20 + "（按年计费）" note below price

### Pricing grid `.intl-pricing-grid`

- display grid, **fixed row height 641px** (desktop `641px`; mobile `641px 641px`) — cards stretch, ~124px whitespace below last feature (intentional parity)
- gap 16, justify center, max-width 736, margin 0 auto
- card: personal tab Free|Pro 2 cols, enterprise Team 1 col
- mobile: 1 col, card w 326 (px 32 section padding), **card padding 40px 22px**

### Card `.intl-pricing-card`

- Free: bg white, **border 1px rgba(25,26,35,.08)**, radius 24
- Pro: **bg #1BC69B, border 1px #1BC69B**, shadow 0 4px 20px rgba(0,0,0,.05), radius 24
  - white inner panel via **absolute ::before — top 32px, left 1px, right 1px, bottom 1px, radius 20px 20px 23px 23px** (green strip 32px across top)
  - `.intl-trial-badge`: absolute **top 6px left 17px**, 12px/600/22 white (on the green strip)

### Card anatomy (identical for Free + Pro — NO inner wrapper, content stays in 40px padding)

- padding: **40px 24px** (mobile 40px 22px)
- header: mb 24, h 35, flex space-between
  - name: **20px/400/35, rgba(0,0,0,.75)**
- price: mb 16, min-h 44, flex items-end gap 4
  - value "$10": **32px/600/44 #1A1A1A**
  - unit "/月": 14px/400/28 #808080
  - original "20 /月": **14px/400/28 #999 line-through**
  - billed-yearly "（按年计费）": 14px #808080 (yearly only)
- CTA: w 310 (100%), **min-h 48, mb 24 (NO mt — spacing from price mb-16)**, radius 12
  - Free bg #0A0B0F · Pro bg #000000 · 14px/500/16 white
- features: **pt 24 (NO border-top)**
  - li: **14px/400/22 #242424, gap 12, icon 16×16 green check**

### Payment methods

- mt 32, p 20px/700 rgba(0,0,0,.5) "可使用多种支付方式升级", icons **mt 12, h 20px** gap 16 (7 svg logos)

### Compare card

- mt 120; h3 "哪个计划更适合你？" 32px/500/44 #191A23, **mb 48**
- table wrap **padding 39px**, overflow-x auto on mobile
- th/td 16px/400/32 rgba(0,0,0,.86), first col w 240; row border-b rgba(25,26,35,.06-.1)
- plan col header: name + $x/月 14px #808080 stacked
- 限时免费 → stacked sub-line 13px wb-green; check rows → 20px green check
- promo note 12px/16 rgba(0,0,0,.66) mt 15

### Compare rows (verbatim)

1. 积分基础用量 | 100 | 1,000
2. 积分赠送用量 | - | 1,000
3. 每日活跃奖励 | 30 积分/天 +限时免费 | 50 积分/天 +限时免费
4. 代码实时补全额度 | 5,000 次 / 限免无限次 +限时免费 | 无限代码补全
5. 自动任务 | 3（限免99个） +限时免费 | 15（限免99个） +限时免费
6. 功能抢先体验 | - | 逐步开放
7. 模型调度 | Auto 调度 / 限免全模型 +限时免费 | 全模型可选
8. 跨文件理解能力 | ✓ | ✓
9. 注释生成代码 | ✓ | ✓
10. 专家、技能与连接器 | ✓ | ✓

### FAQ

- mt 120; h3 "常见问题" 32px/500/44 #191A23 center
- item: **padding 24px 0, border-bottom .5px rgba(25,26,35,.22)** (no top border)
- q: 16px/400/22 #191A23, flex space-between, ArrowUpRight (lucide, 20px, stroke 1.4) rotates 90° on open
- a: max-height 0 → ~200px transition .24s, 16px/400/25.6 rgba(0,0,0,.48), pt 12 when open
- aria-expanded + aria-controls

### FAQ items (verbatim)

1. Q 如何申请 Pro 的 7 天免费试用？ A 选择 Pro 套餐并点击"开始 7 天免费试用"，绑定有效信用卡后即可开通。试用期间，你可以体验 7 天 Pro 权益，并获得 500 基础积分。开通当天不会扣费。试用结束后，订阅将根据你选择的计费周期，以每月 10 美元或每年 96 美元加适用税费自动续订；如不希望续订，请至少在试用结束前 1 天取消。
2. Q 我可以随时取消订阅吗？ A 可以。你可以随时前往个人中心取消订阅。取消后，系统将不再自动续订；在当前计费周期结束前，你仍可以继续使用当前套餐及套餐内剩余额度。
3. Q 标有"限时活动"的权益会一直提供吗？ A 不会。每日活跃奖励、临时提升的代码补全额度、自动任务额度或模型使用权限等权益均为限时提供，具体变更以官网说明和后续通知为准。
4. Q 每日活跃积分如何发放？ A 当日通过客户端发起过至少一次对话，即视为当日活跃。对应积分将在次日发放至你的账户，查看详细规则。

## Assets

- Payment logos: `public/pricing/*.svg` (wechat, unionpay, visa, mastercard, jcb, discover, amex), h-20px
- Gift icon: inline svg (stroke currentColor, wb-green)
- Check: inline svg (PricingCheckIcon path), 16px features / 20px compare
- ArrowUpRight: lucide-react

## Billing data

Free $0 (both); Pro monthly $10 orig 20, yearly $8 orig 20 + "（按年计费）"; Team $40 /坐席/月 monthly, 480 /坐席/年 yearly (enterprise only)

## Responsive

- ≥768: 2-col, card 360 (pad 40×24), section px 24
- <768: 1-col, card 326 (pad 40×22), section px 32, grid rows 641px 641px, kicker 40px
- compare table: overflow-x auto
- signup banner: flex-wrap on narrow

## Notes

- "use client" (tabs + accordion state)
- kicker uses font-heading (Alimama ShuHeiTi); body system stack
- tokens: wb-green #28B894, wb-deepgreen #00B578, wb-ink-2 — nothing global to add
