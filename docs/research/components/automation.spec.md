# Automation Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: click-driven tabs

## DOM Structure

Feature title + docs links > two-column grid > vertical selector tablist + detail tabpanel.

## Computed Styles

### Grid

- Desktop: `224px minmax(0, 1fr)`, gap `16px`
- Mobile: one column, gap `16px`

### Selectors

- Padding: `16px` desktop, `12px` mobile
- Radius: `12px`
- Active border: `rgba(255,255,255,0.2)`
- Active background: `rgba(255,255,255,0.07)`
- Inactive border: `rgba(255,255,255,0.1)`
- Inactive background: `rgba(255,255,255,0.025)`

### Detail Panel

- Desktop: `416px` minimum height
- Mobile: `320px` minimum height
- Padding: `24px` desktop, `20px` mobile
- Radius: `12px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(0,0,0,0.2)`
- Overflow: hidden

## States & Behaviors

### Tab switching

- Trigger: click `MCP`, `CLI`, or `SDK`.
- State A: one selector active and one panel visible.
- State B: clicked selector active and its panel visible.
- Transition: selector colors only; panel content swaps immediately.

### Selector hover

- Inactive border -> `rgba(255,255,255,0.15)`.
- Inactive background -> `rgba(255,255,255,0.04)`.

## Per-State Content

- `MCP`: prompt, two `create_agent` calls for issues `#412` and `#417`, completion response.
- `CLI`: `isee run`, `isee ls`, `isee ls --host devbox:6767`.
- `SDK`: TypeScript snippet using `createIseeClient`.

## Assets

- Lucide icons: Bot, Terminal, Braces.

## Responsive Behavior

- Desktop: selectors form a narrow left column; detail panel on the right.
- Tablet: same two-column model; content rail `608px`.
- Mobile: selectors stack above the detail panel.

