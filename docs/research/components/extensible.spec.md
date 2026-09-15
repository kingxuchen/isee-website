# Make It Yours Specification

## Overview

- Target: `apps/isee-international/src/components/landing-page.tsx`
- Screenshot: `docs/design-references/paseo-live-desktop-1440.png`
- Interaction model: static cards with hover links

## DOM Structure

Feature title > two equal cards; each has a top icon, title, description, and bottom link stack.

## Computed Styles

### Section

- Desktop: `864x402`
- Tablet: `608x425`
- Mobile: `342x674`

### Card Grid

- Desktop: `2` columns, gap `16px`
- Mobile: one column, gap `16px`

### Card

- Min height: `256px`
- Padding: `24px`
- Radius: `12px`
- Border: `1px rgba(255,255,255,0.1)`
- Background: `rgba(255,255,255,0.025)`
- Icon: `24px`, muted

## States & Behaviors

- Standard links: muted -> foreground on hover.
- Accent community link: emerald `rgba(110,231,183,0.85)` -> `rgba(167,243,208,1)` on hover.
- External links open in a new tab with `rel="noopener noreferrer"`.

## Content

- Heading: `Make it yours`
- Description: `Extend Isee to work just the way you want`
- Plugins card description and Doc/community links.
- Fork-the-repo card description and repository link.

## Assets

- Lucide icons: Puzzle, GitFork, BookOpen, Coffee, ExternalLink.
- GitHub mark from `brand-icons.tsx`.

## Responsive Behavior

- Desktop and tablet: two columns.
- Mobile: stacked cards.

