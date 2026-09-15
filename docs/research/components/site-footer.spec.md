# Site Footer Specification

## Overview

- Target: `apps/isee-international/src/components/site-footer.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: static links with hover color transitions

## DOM Structure

Footer `max-w-5xl` rail > top border > five-column link grid.

## Computed Styles

### Footer

- Desktop height: `377px`
- Mobile height: `765px`
- Desktop padding: `0 80px 80px`
- Mobile padding: `24px`

### Grid

- Desktop: `5` equal columns, gap `32px`
- Small: `2` columns
- Border top: `1px rgba(255,255,255,0.1)`
- Padding top: `32px`
- Section heading: `14px`, weight `500`, `rgba(255,255,255,0.6)`
- Links: `14px`, block, muted -> foreground on hover

## States & Behaviors

### Link hover

- Color: muted foreground -> foreground.
- Transition: `transition-colors`.

## Content

Columns: Product, Agents, Alternatives, Community, Download. Brand references use `Isee`; repository and community destinations retain their source URLs unless replaced by deployment configuration.

## Assets

- N/A.

## Responsive Behavior

- Desktop: five columns.
- Tablet: two columns.
- Mobile: two columns, footer stacks below sponsor CTA.

