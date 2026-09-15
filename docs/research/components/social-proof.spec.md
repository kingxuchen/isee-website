# Social Proof Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: time-driven marquee with hover pause

## DOM Structure

Section title > overflow-clipped marquee > two rows > duplicated card tracks.

## Computed Styles

### Section

- Desktop: `864x440`
- Mobile: `342x440`
- Margin-bottom via parent stack: `96px`

### Section Header

- Title: `30px/36px`, weight `500`
- Description: `16px/24px`, muted
- Header margin bottom: `48px`

### Cards

- Height: `154px`
- Width: `320px` mobile, `420px` desktop
- Gap: `16px`
- Padding: `16px`
- Radius: `16px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(255,255,255,0.03)`
- Text: `14px/22.75px`

## States & Behaviors

### Marquee

- Top row: left, `46s linear infinite`.
- Bottom row: reverse, `52s linear infinite`.
- Hover: both tracks pause.
- Duplicate tracks use `aria-hidden` and `inert` on cloned cards.
- Reduced motion: animation disabled.

### Card hover

- Border: `rgba(255,255,255,0.1)` -> `rgba(255,255,255,0.2)`.
- Background: `rgba(255,255,255,0.03)` -> `rgba(255,255,255,0.05)`.
- Transition: `transition-colors`.

## Content

The startup heading is `Loved by developers`. The source wall has nine visible testimonial cards across two rows. Full names, handles, dates, links, and copy are preserved in `landing-page.tsx`.

## Assets

- Nine avatar images in `public/social-proof/`.

## Responsive Behavior

- Desktop: cards `420px`, two rows.
- Tablet: content rail narrows to `608px`, cards remain `420px`.
- Mobile: cards `320px`, marquee edge gradients `64px`.

