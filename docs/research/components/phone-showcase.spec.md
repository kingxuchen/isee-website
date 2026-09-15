# Phone Showcase Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: scroll-driven

## DOM Structure

Centered arrow + two-line intro; relative phone stage; absolute left phone, relative center phone, absolute right phone.

## Computed Styles

### Section

- Desktop: `1440x766`
- Mobile: `390x772`
- Display: `flex`, vertical
- Padding: `16px 0 64px`
- Gap: `80px`

### Intro Text

- Primary: `18px`, width max `448px`, color `rgba(255,255,255,0.8)`
- Secondary: `14px`, width max `384px`, color `rgba(255,255,255,0.5)`

### Phone Stage

- Min height: `480px`
- Perspective: `700px`
- Center width: `240px` desktop, `220px` mobile
- Side width: `240px` desktop, `160px` mobile

## States & Behaviors

### Scroll-linked side reveal

- Trigger: element start entering viewport through element center reaching viewport center.
- Progress `0.2`: side opacity `0`, x `0`.
- Progress `0.6`: side opacity `1`, left x `-260px`, right x `260px`.
- Mobile travel: `-140px` and `140px`.
- Rotation: left `rotateY(-15deg)`, right `rotateY(15deg)`.
- Scale: `0.97`.

### Center entrance

- Trigger: `useInView` with `-80px` margin, once.
- State A: opacity `0`, y `30px`.
- State B: opacity `1`, y `0`.
- Transition: `600ms ease-out`, delay `100ms`.

## Content

- `When you want to step away from your desk, you can.`
- `The native mobile app has full feature parity with desktop.`
- Phone scenes: workspace drawer, agent chat, diff view.

## Assets

- Phone frame and mobile UI are code-rendered components.
- Optional phone raster assets remain in `public/phone-*.png` and `public/phone-*-*.webp`.

## Responsive Behavior

- Desktop: `240px` phones with side travel of `260px`.
- Tablet: same stage structure, content rail `608px`.
- Mobile: `160px` side phones, `220px` center phone, side travel `140px`.

