"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ecosystem = Ecosystem;
const jsx_runtime_1 = require("react/jsx-runtime");
const image_1 = __importDefault(require("next/image"));
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
const RING_STYLE = { objectFit: "fill" };
const ECOSYSTEM_APPS = [
    { name: "Jira", icon: "/eco/jira.svg" },
    { name: "Google Drive", icon: "/eco/google-drive.svg" },
    { name: "Github", icon: "/eco/github.svg" },
    { name: "Linear", icon: "/eco/linear.svg" },
    { name: "Office", icon: "/eco/office.svg" },
    { name: "Notion", icon: "/eco/notion.svg" },
    { name: "Slack", icon: "/eco/slack.svg" },
];
const PIPE_PILL = "wb-orbit-pill absolute top-1/2 left-1/2 h-[calc(80px*var(--orbit-scale))] " +
    "pl-[calc(14px*var(--orbit-scale))] pr-[calc(32px*var(--orbit-scale))] " +
    "flex items-center gap-[calc(14px*var(--orbit-scale))] rounded-full " +
    "bg-white whitespace-nowrap " +
    "shadow-[0_8px_24px_0_rgb(20_30_40/8%),0_2px_6px_0_rgb(20_30_40/4%)] " +
    "animate-[wb-orbit-counter-spin_var(--orbit-duration)_linear_infinite] " +
    "[transform:translate(-50%,-50%)_rotate(calc(var(--orbit-counter-angle)*-1))]";
const PIPE_ICON = "block w-[calc(52px*var(--orbit-scale))] h-[calc(52px*var(--orbit-scale))] shrink-0 " +
    "object-contain";
const PIPE_NAME = 
// Whole stage scales at --orbit-scale; text keeps a 14px floor (spec mobile).
"font-round text-[max(14px,calc(18px*var(--orbit-scale)))] leading-[max(20px,calc(25.6px*var(--orbit-scale)))] " +
    "font-medium text-[#191A23]";
function Ecosystem() {
    return ((0, jsx_runtime_1.jsxs)("section", { id: "ecosystem", "aria-labelledby": "ecosystem-title", className: "relative overflow-hidden bg-white pt-[115px] pb-[80px] [--orbit-duration:60s] [--orbit-scale:0.5] md:[--orbit-scale:1]", children: [(0, jsx_runtime_1.jsx)("style", { children: RING_KEYFRAMES }), (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto max-w-[1920px] px-4 md:px-[60px]", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h2", { id: "ecosystem-title", className: "mb-3 font-round text-[30px] leading-[36px] font-bold text-black md:mb-4 md:text-[50px] md:leading-[60px]", children: "WorkBuddy \u8FDE\u63A5\u6253\u901A\u529E\u516C\u751F\u6001" }), (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-[720px] font-round text-[14px] leading-[22px] font-medium text-[#5A5A5A] md:text-[16px] md:leading-[25.6px]", children: "WorkBuddy \u53EF\u4EE5\u65E0\u7F1D\u8FDE\u63A5\u529E\u516C IM\u3001\u6587\u6863\u3001\u90AE\u7BB1\u3001\u4F1A\u8BAE\u3001\u77E5\u8BC6\u5E93\u7B49\u5E38\u7528\u529E\u516C\u5DE5\u5177\uFF0C\u6253\u901A\u529E\u516C\u751F\u6001" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "wb-orbit-stage relative mx-auto mt-[calc(360px*(var(--orbit-scale)-1))] h-[calc(720px*var(--orbit-scale))] w-[calc(720px*var(--orbit-scale))]", "aria-hidden": "true", children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: "/icons-inline/OrbitRingOuter.svg", alt: "", fill: true, className: "z-0", style: RING_STYLE }), (0, jsx_runtime_1.jsx)(image_1.default, { src: "/icons-inline/OrbitRingMiddle.svg", alt: "", width: 562, height: 562, className: "absolute top-1/2 left-1/2 z-0 h-[calc(561.6px*var(--orbit-scale))] w-[calc(561.6px*var(--orbit-scale))] -translate-x-1/2 -translate-y-1/2", style: RING_STYLE }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-solid border-transparent", style: {
                                    width: "calc(374.4px * var(--orbit-scale))",
                                    height: "calc(374.4px * var(--orbit-scale))",
                                    background: "linear-gradient(#EEF9F7, #EEF9F7) padding-box, linear-gradient(rgba(40,184,148,0), rgba(40,184,148,0.08) 8%, rgba(40,184,148,0.12) 12%, rgba(40,184,148,0)) border-box",
                                } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-full", style: {
                                    width: "calc(300px * var(--orbit-scale))",
                                    height: "calc(300px * var(--orbit-scale))",
                                    background: "radial-gradient(circle, rgba(40,184,148,0.15) 0%, rgba(40,184,148,0.08) 45%, rgba(40,184,148,0) 70%)",
                                } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-1/2 left-1/2 z-[3] flex h-[calc(130px*var(--orbit-scale))] w-[calc(130px*var(--orbit-scale))] -translate-x-1/2 -translate-y-1/2 items-center justify-center", children: (0, jsx_runtime_1.jsx)(image_1.default, { src: "/brand/workbuddy-icon.svg", alt: "WorkBuddy", width: 130, height: 130, className: "h-full w-full object-contain" }) }), (0, jsx_runtime_1.jsx)("div", { className: "wb-orbit-layer absolute inset-0 z-[2] animate-[wb-orbit-spin_var(--orbit-duration)_linear_infinite]", children: ECOSYSTEM_APPS.map((app, i) => {
                                    const angle = (i * 360) / ECOSYSTEM_APPS.length;
                                    return ((0, jsx_runtime_1.jsx)("div", { className: "absolute top-1/2 left-1/2 h-0 w-0", style: {
                                            "--orbit-counter-angle": `${angle}deg`,
                                            transform: `rotate(${angle}deg) translateX(calc(${ORBIT_RADIUS}px * var(--orbit-scale))) rotate(${-angle}deg)`,
                                        }, children: (0, jsx_runtime_1.jsxs)("div", { className: PIPE_PILL, children: [(0, jsx_runtime_1.jsx)(image_1.default, { src: app.icon, alt: "", width: 52, height: 52, className: PIPE_ICON }), (0, jsx_runtime_1.jsx)("span", { className: PIPE_NAME, children: app.name })] }) }, app.name));
                                }) })] })] })] }));
}
exports.default = Ecosystem;
