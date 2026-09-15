# Isee International Page Topology

Source: `https://paseo.sh/`
Clone target: `apps/isee-international`

## Page Order

1. Hero shell (`header`, `h1`, subtitle, CTAs, supported-agent badges)
2. Hero product mockup (`Build`, `Review`, `Ship`, `Extend` tabs)
3. Phone showcase (three phone scenes with scroll-linked side reveal)
4. Social proof marquee (two rows moving in opposite directions)
5. Multi-provider grid
6. Run-it-anywhere feature card
7. Automation tabs (`MCP`, `CLI`, `SDK`)
8. Make-it-yours card grid
9. FAQ disclosure list
10. Sponsor CTA
11. Footer link grid

## Layout Model

- The page uses a normal document scroll. No Lenis, Locomotive Scroll, scroll-snap container, canvas, or video is present.
- The hero is a full-width dark section with a centered 1024px content rail on desktop.
- The hero mockup overflows downward from the hero section and visually connects to the phone showcase.
- All lower content is inside a `max-w-5xl` content column (`1024px` including `80px` horizontal padding, yielding an `864px` content width at desktop).
- The footer shares the lower `max-w-5xl` rail.

## Interaction Map

| Region | Model | Trigger |
| --- | --- | --- |
| Header links | Static links and hover color transitions | Pointer hover |
| Hero mockup | Click-driven state switch | `Build`, `Review`, `Ship`, `Extend` buttons |
| Phone showcase | Scroll-driven | Framer Motion `useScroll` from element start/end to center |
| Hero and section reveals | Scroll-driven | Framer Motion `whileInView`, viewport margin `-60px`, once |
| Social proof | Time-driven | 46s and 52s CSS marquee loops, paused on hover |
| Providers | Static | Hover on provider rows and `+34 more` link |
| Run it anywhere | Static cards | Hover on CTA buttons |
| Automation | Click-driven | `MCP`, `CLI`, `SDK` tabs |
| FAQ | Click-driven | Native `<details>`/`<summary>` |
| Sponsor and footer | Static links | Hover color transitions |

## Responsive Layout

- Desktop `1440px`: hero content is centered in `1024px`; section rail is `864px`; page height `6426px`.
- Tablet `768px`: hero remains two-line at `60px/57px`; content rail is `608px`; page height `6227px`.
- Mobile `390px`: H1 drops to `36px/34.2px`; hero rail is `342px`; page height `7110px`.
- Main responsive breakpoint: Tailwind `md` (`768px`) for desktop rail behavior; `sm` (`640px`) for stacked controls and cards.

## Assets

- Isee logo and favicon: `public/logo.svg`, `public/favicon.svg`, `public/favicon.ico`
- China icon replacement source: `apps/isee-china/public/brand` and `apps/isee-china/public/icons-inline`
- Product visuals: `public/hero-mockup.png`, `public/homepage-hero.png`, `public/mobile-mockup.png`, `public/phone-*.png`, `public/phone-*-*.webp`
- Social avatars: `public/social-proof/*.jpg`

