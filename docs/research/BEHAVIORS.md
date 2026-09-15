# Live Site Behavior Bible

## Global

- `html`, `body`: dark theme, `16px/24px`, normal scrolling.
- No smooth-scroll library or scroll snapping.
- CSS scrollbar: `8px`, transparent track, rounded translucent thumb.
- Primary palette: background `#101615`, foreground `#fafafa`, muted `#1a1f1e`, muted text `#a8adac`, border `#252b2a`, primary green `#239956`.
- System font stack is inherited; the site does not load a custom webfont.
- Section entrance animation: `opacity: 0; y: 20px` -> `opacity: 1; y: 0`; `500ms ease-out`; viewport margin `-60px`; runs once.

## Header and Hero

- Desktop header computed box: `1024x28` at `y=24` with `16px` gap.
- H1: desktop `60px/57px`; mobile `36px/34.2px`; weight `500`.
- Subtitle: desktop `18px/29.25px`; mobile `16px/26px`; color `rgba(255,255,255,0.7)`.
- Primary CTA: `175x40`, padding `10px 16px`, gap `8px`, radius `8px`.
- Hero background image covers the section and is centered.
- Hero mockup wrapper animates upward: `y: 40` -> `0`, `opacity: 0` -> `1`, `800ms`, delay `500ms`.

## Hero Mockup Tabs

- Tabs are click-driven, not scroll-driven.
- Default state: `Build`.
- Available states: `Build`, `Review`, `Ship`, `Extend`.
- Active pill background uses `layoutId="hero-mockup-pill"` and Framer Motion spring/transition `340ms` with cubic bezier `(0.22, 0.61, 0.36, 1)`.
- Active label is foreground; inactive labels are muted and brighten on hover.
- The mockup is authored at a fixed design size and scaled with `tan(atan2(100cqw, DESIGN_WIDTH))`.

## Phone Showcase

- Scroll-driven with Framer Motion `useScroll` and offset `["start end", "center center"]`.
- Side phones start behind the center, opacity `0`, x `0`.
- From progress `0.2` to `0.6`, side phone opacity goes `0 -> 1`.
- Desktop side travel: `0 -> -260px` and `0 -> 260px`.
- Mobile side travel: `0 -> -140px` and `0 -> 140px`.
- Side phones use `rotateY(-15deg)` and `rotateY(15deg)`, scale `0.97`.
- Center phone enters with `opacity: 0; y: 30px` -> `opacity: 1; y: 0` at `600ms`, delay `100ms`.

## Social Proof

- Two horizontal marquee rows loop with CSS animation.
- Top row: `46s linear infinite`, left.
- Bottom row: `52s linear infinite`, reverse.
- Each row contains a duplicated track for seamless wrapping.
- Hovering the marquee pauses both tracks.
- Cards: `154px` high, `320px` wide on mobile and `420px` wide at `md`.
- Card border `rgba(255,255,255,0.1)` -> `rgba(255,255,255,0.2)` on hover.
- Card background `rgba(255,255,255,0.03)` -> `rgba(255,255,255,0.05)` on hover.
- `prefers-reduced-motion: reduce` disables the marquee.

## Run It Anywhere and Automation

- Run-it-anywhere CTA buttons are white pills with `8px` radius and hover opacity via `foreground/90`.
- Automation is a click-driven tab set: `MCP`, `CLI`, `SDK`.
- Selected selector: border `rgba(255,255,255,0.2)`, background `rgba(255,255,255,0.07)`.
- Unselected selector: border `rgba(255,255,255,0.1)`, background `rgba(255,255,255,0.025)`.
- Unselected hover: border `rgba(255,255,255,0.15)`, background `rgba(255,255,255,0.04)`.

## FAQ and Footer

- FAQ uses native `<details>` elements. The marker is replaced by `+` and changes to a minus glyph when open.
- Open state reveals content in the document flow; no animation.
- Footer links transition from muted to foreground color.
- Footer border is `rgba(255,255,255,0.1)`.

