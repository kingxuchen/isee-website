# Hero Mockup Specification

## Overview

- Target: `apps/isee-international/src/components/hero-mockup.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: click-driven tabs

## DOM Structure

Pill tab list > selected pill background + label; mockup shell > fixed-size `MockupWindow` scaled to container width.

## Computed Styles

### Tab Row

- Display: `flex`
- Justify: center
- Wrap: wrap
- Gap: `8px` desktop, `4px` mobile
- Margin bottom: `16px`

### Pills

- Padding: `14px 12px`
- Text: `14px`
- Radius: `9999px`
- Active background: `rgba(255,255,255,0.08)`
- Active inset ring: `rgba(255,255,255,0.12)`

### Window Shell

- Desktop: `1280x734`
- Tablet: `704x404`
- Mobile: `342x196`
- Radius: `16px` desktop, `12px` mobile
- Ring: `1px rgba(255,255,255,0.1)`
- Overflow: hidden

## States & Behaviors

### Tab switching

- Trigger: click `Build`, `Review`, `Ship`, or `Extend`.
- State A: selected pill surface at one tab.
- State B: shared layout surface moves to clicked tab.
- Transition: `340ms` cubic bezier `(0.22, 0.61, 0.36, 1)`.
- Content: each tab swaps a complete desktop mockup scene.

### Pill hover

- Inactive text: muted -> foreground.

## Content

- Tabs: `Build`, `Review`, `Ship`, `Extend`
- Default: `Build`
- ARIA label: `Isee desktop app with coding agents, a conversation, and a code diff open side by side`

## Assets

- Mockup UI icons: `components/mockup/icons.tsx`
- Finder icon: `src/assets/editor-apps/finder.png`
- No raster screenshot is used for the desktop scene.

## Responsive Behavior

- Desktop: full `1280px` mockup with side panels.
- Tablet: scales to `704px`.
- Mobile: scales to `342px`; tabs stay in one centered row.

