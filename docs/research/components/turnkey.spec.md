# Run It Anywhere Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: static cards with hover CTAs

## DOM Structure

Feature section title > outer bordered card > desktop-app feature row > three extension cards.

## Computed Styles

### Section

- Desktop: `864x507`
- Tablet: `608x577`
- Mobile: `342x969`

### Outer Card

- Radius: `16px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(255,255,255,0.02)`
- Overflow: hidden

### Feature Row

- Desktop: `flex`, row, align center, justify space-between
- Mobile: column, gap `24px`
- Padding: `32px` desktop, `24px` mobile

### Extension Cards

- Min height: `192px`
- Padding: `20px`
- Radius: `12px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(255,255,255,0.025)`
- Desktop grid: `3` columns, gap `16px`
- Mobile grid: one column, gap `16px`

## States & Behaviors

- CTA buttons use a white pill, `8px` radius, and foreground/90 hover background.
- No section-specific animation beyond the shared in-view reveal.

## Content

- Heading: `Run it anywhere`
- Description: `Use Isee locally, from another machine, or with a team`
- Desktop app block: `The one click experience, download the app and it just works`
- Mobile and web: `Connect to the same workspaces from any client`
- Remote machines: `Run Isee on a home lab, or a cloud machine`
- Teams and triggers: `Share access or start work from GitHub, Slack, and Discord`

## Assets

- Lucide UI icons: Monitor, Smartphone, Laptop, Users, ArrowRight.
- Provider/social marks: GitHub, Slack, Discord.

## Responsive Behavior

- Desktop and tablet: desktop feature row then `3` extension columns.
- Mobile: all rows stack; outer padding reduces to `24px`.

