# FAQ Specification

## Overview

- Target: `apps/isee-international/src/components/faq-item.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: click-driven native disclosure

## DOM Structure

Section heading + column of `details` elements. Each `summary` contains a marker and question; content follows in a prose block.

## Computed Styles

### Section

- Width: `864px` desktop
- Vertical gap: `24px`

### Question

- Font: `14px`, weight `500`
- Display: `flex`, align start, gap `8px`
- Summary offset: `margin-left: -16px`

### Marker

- Font: monospace
- Color: `rgba(255,255,255,0.4)`
- Closed: `+`
- Open: minus glyph

### Answer

- Font: `14px/22.75px`
- Color: muted
- Spacing: `8px 0 0`

## States & Behaviors

### Open and close

- Trigger: click a summary row.
- State A: answer hidden, `+` visible.
- State B: answer visible, minus visible.
- Transition: immediate native layout change.

### Inline link hover

- Underlined answer links brighten to `rgba(255,255,255,0.8)`.

## Content

Ten questions are preserved: free, local code, supported agents, provider execution, desktop requirement, voice, remote connection, git/GitHub, provider terms, and worktrees.

## Assets

- N/A.

## Responsive Behavior

- Desktop and tablet: `864px` and `608px` content rails.
- Mobile: `342px` rail; text wraps without changing structure.

