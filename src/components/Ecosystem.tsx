import Image from "next/image";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ *
 * Ecosystem — white section, heading + subtitle + 720×720 orbit stage.
 * Two ring SVGs, one gradient-bordered inner ring, centered WorkBuddy
 * icon on a soft green radial glow, and 7 app pills orbiting on a
 * 60s CSS spin (each pill counter-spins so it stays upright).
 * Spec: docs/research/components/ecosystem.spec.md
 * Raw:  docs/research/raw/ecosystem.json
 * Pure CSS animation → server component.
 * ------------------------------------------------------------------ */

/** Pill centre radius: pills sit between the middle and outer rings. */
const ORBIT_RADIUS = 310;

const RING_KEYFRAMES = `
@keyframes wb-orbit-spin { to { transform: rotate(360deg); } }
@keyframes wb-orbit-counter-spin { to { transform: rotate(-360deg); } }
@media (prefers-reduced-motion: reduce) {
  .wb-orbit-layer,
  .wb-orbit-pill { animation: none !important; }
}
`;

/** Ring SVGs must stretch to their (square) box instead of letterboxing. */
const RING_STYLE = { objectFit: "fill" } as const satisfies CSSProperties;

const ECOSYSTEM_APPS = [
  { name: "Jira", icon: "/eco/jira.svg" },
  { name: "Google Drive", icon: "/eco/google-drive.svg" },
  { name: "Github", icon: "/eco/github.svg" },
  { name: "Linear", icon: "/eco/linear.svg" },
  { name: "Office", icon: "/eco/office.svg" },
  { name: "Notion", icon: "/eco/notion.svg" },
  { name: "Slack", icon: "/eco/slack.svg" },
];

const PIPE_PILL =
  // Rotation only — the anchor centres the pill, so the counter-spin can own
  // `transform` without fighting a static translate.
  "wb-orbit-pill flex h-[calc(80px*var(--orbit-scale))] shrink-0 items-center " +
  "gap-[calc(14px*var(--orbit-scale))] " +
  "rounded-full bg-white pl-[calc(14px*var(--orbit-scale))] pr-[calc(32px*var(--orbit-scale))] " +
  "whitespace-nowrap shadow-[0_8px_24px_0_rgb(20_30_40/8%),0_2px_6px_0_rgb(20_30_40/4%)] " +
  "animate-[wb-orbit-counter-spin_var(--orbit-duration)_linear_infinite]";

const PIPE_ICON =
  "block w-[calc(52px*var(--orbit-scale))] h-[calc(52px*var(--orbit-scale))] shrink-0 " +
  "object-contain";

const PIPE_NAME =
  // Whole stage scales at --orbit-scale; text keeps a 14px floor (spec mobile).
  "font-round text-[max(14px,calc(18px*var(--orbit-scale)))] leading-[max(20px,calc(25.6px*var(--orbit-scale)))] " +
  "font-medium text-[#191A23]";

export function Ecosystem() {
  return (
    <section
      id="ecosystem"
      aria-labelledby="ecosystem-title"
      className="relative overflow-hidden bg-white pt-[115px] pb-[80px] [--orbit-duration:60s] [--orbit-scale:0.5] md:[--orbit-scale:1]"
    >
      {/* Keyframes + reduced-motion guard for the orbit (no JS needed). */}
      <style>{RING_KEYFRAMES}</style>

      <div className="mx-auto max-w-[1920px] px-4 md:px-[60px]">
        <div className="text-center">
          <h2
            id="ecosystem-title"
            className="mb-3 font-round text-[30px] leading-[36px] font-bold text-black md:mb-4 md:text-[50px] md:leading-[60px]"
          >
            WorkBuddy 连接打通办公生态
          </h2>
          <p className="mx-auto max-w-[720px] font-round text-[14px] leading-[22px] font-medium text-[#5A5A5A] md:text-[16px] md:leading-[25.6px]">
            WorkBuddy 可以无缝连接办公 IM、文档、邮箱、会议、知识库等常用办公工具，打通办公生态
          </p>
        </div>

        {/* Orbit stage — 720×720, scaled down as one unit on small screens. */}
        <div
          className="wb-orbit-stage relative mx-auto mt-[calc(360px*(var(--orbit-scale)-1))] h-[calc(720px*var(--orbit-scale))] w-[calc(720px*var(--orbit-scale))]"
          aria-hidden="true"
        >
          {/* Outer ring — 720 (diameter) */}
          <Image
            src="/icons-inline/OrbitRingOuter.svg"
            alt=""
            fill
            className="z-0"
            style={RING_STYLE}
          />
          {/* Middle ring — 561.6, dashed, faint fill */}
          <Image
            src="/icons-inline/OrbitRingMiddle.svg"
            alt=""
            width={562}
            height={562}
            className="absolute top-1/2 left-1/2 z-0 h-[calc(561.6px*var(--orbit-scale))] w-[calc(561.6px*var(--orbit-scale))] -translate-x-1/2 -translate-y-1/2"
            style={RING_STYLE}
          />
          {/* Inner ring — 374.4 disc with a vertical green gradient border */}
          <div
            className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-solid border-transparent"
            style={{
              width: "calc(374.4px * var(--orbit-scale))",
              height: "calc(374.4px * var(--orbit-scale))",
              background:
                "linear-gradient(#EEF9F7, #EEF9F7) padding-box, linear-gradient(rgba(40,184,148,0), rgba(40,184,148,0.08) 8%, rgba(40,184,148,0.12) 12%, rgba(40,184,148,0)) border-box",
            }}
          />
          {/* Soft green radial glow behind the centre icon */}
          <div
            className="absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: "calc(300px * var(--orbit-scale))",
              height: "calc(300px * var(--orbit-scale))",
              background:
                "radial-gradient(circle, rgba(40,184,148,0.15) 0%, rgba(40,184,148,0.08) 45%, rgba(40,184,148,0) 70%)",
            }}
          />
          {/* Centre WorkBuddy icon — 130 */}
          <div className="absolute top-1/2 left-1/2 z-[3] flex h-[calc(130px*var(--orbit-scale))] w-[calc(130px*var(--orbit-scale))] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <Image
              src="/brand/workbuddy-icon.svg"
              alt="WorkBuddy"
              width={130}
              height={130}
              className="h-full w-full object-contain"
            />
          </div>
          {/* Orbiting pills — the whole layer spins, each pill counter-spins. */}
          <div className="wb-orbit-layer absolute inset-0 z-[2] animate-[wb-orbit-spin_var(--orbit-duration)_linear_infinite]">
            {ECOSYSTEM_APPS.map((app, i) => {
              const angle = (i * 360) / ECOSYSTEM_APPS.length;
              return (
                <div
                  key={app.name}
                  className="absolute top-1/2 left-1/2 flex h-0 w-0 items-center justify-center"
                  style={
                    {
                      transform: `rotate(${angle}deg) translateX(calc(${ORBIT_RADIUS}px * var(--orbit-scale))) rotate(${-angle}deg)`,
                    } as CSSProperties
                  }
                >
                  <div className={PIPE_PILL}>
                    <Image
                      src={app.icon}
                      alt=""
                      width={52}
                      height={52}
                      className={PIPE_ICON}
                    />
                    <span className={PIPE_NAME}>{app.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Ecosystem;
