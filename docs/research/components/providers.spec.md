# Providers Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: static grid with hover links

## DOM Structure

Feature section title/description > grid of five provider tiles plus one dashed `+34 more` link.

## Computed Styles

### Grid

- Desktop: `3` columns, gap `16px`
- Mobile: `2` columns, gap `8px`
- Section desktop: `864x256`
- Section mobile: `342x294`

### Tiles

- Display: `flex`
- Justify: center
- Align: center
- Gap: `12px` desktop, `8px` mobile
- Padding: `16px 20px` desktop, `12px` mobile
- Radius: `12px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(255,255,255,0.03)`
- Icon: `28px` desktop, `20px` mobile
- Label: `16px` desktop, `14px` mobile

## States & Behaviors

### More link hover

- Text: `rgba(255,255,255,0.5)` -> `rgba(255,255,255,0.8)`.
- Border: `rgba(255,255,255,0.1)` -> `rgba(255,255,255,0.2)`.
- Background: `rgba(255,255,255,0.01)` -> `rgba(255,255,255,0.03)`.

## Content

- Heading: `Works with your tools`
- Description: `Bring your subscriptions, skills and configuration`
- Providers: Claude Code, Codex, OpenCode, Pi, Cursor
- Link: `+34 more`

## Assets

- Provider logos from `components/agent-icons.tsx`.

## Responsive Behavior

- Desktop and tablet: `3` columns.
- Mobile: `2` columns; last `+34 more` tile occupies one column.

