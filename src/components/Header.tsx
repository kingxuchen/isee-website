"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Header — fixed 80px, rgba(255,255,255,.85) + backdrop blur(40px), z-50.
 * No scroll-state change (the original is identical at y=0 and y=600).
 * Spec: docs/research/components/header.spec.md
 * Raw:  docs/research/raw/header.json
 * ------------------------------------------------------------------ */

const LOGO_SRC = "/brand/workbuddy-logo.png";
/** Source is 1620×560 → 162×56 (@2x) for the h-32px / h-28px renders. */
const LOGO_SIZE = { width: 162, height: 56 };

const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "定价", href: "/pricing" },
];

const LANGUAGES = [
  { label: "中文", value: "zh-CN" },
  { label: "English", value: "en" },
];

/** Header body font (raw/header.json). */
const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

/** Original drawer easing (raw/header.json). */
const DRAWER_STYLE = {
  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
} satisfies CSSProperties;

/**
 * 15×14 caret — inline copy of /icons-inline/DropdownArrowIcon.svg so it can
 * inherit the button text color (an <img> cannot).
 */
function CaretGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 15 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M4.78625 4.78648C4.66184 4.67056 4.4973 4.60745 4.32729 4.61045C4.15728 4.61345 3.99506 4.68233 3.87483 4.80256C3.75459 4.9228 3.68572 5.08501 3.68272 5.25502C3.67972 5.42504 3.74283 5.58958 3.85875 5.71398L7.35875 9.21398C7.48077 9.3361 7.64599 9.40522 7.81861 9.40637C7.99124 9.40751 8.15737 9.34059 8.281 9.22011L11.781 5.80498C11.9029 5.68282 11.9718 5.51754 11.9727 5.34494C11.9737 5.17235 11.9066 5.00634 11.786 4.88286C11.6654 4.75939 11.501 4.6884 11.3284 4.68526C11.1559 4.68212 10.989 4.7471 10.864 4.86611L7.82775 7.82798L4.78625 4.78648Z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * 24×24 hamburger — inline copy of /icons-inline/MobileMenuIcon.svg, scaled to
 * the original's 20×2 bars (the svg has 3px padding inside its viewBox).
 */
function MobileMenuGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  );
}

/** Close `open` on outside mousedown or Escape. */
function useDismiss(
  open: boolean,
  ref: RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, ref, close]);
}

/** Static 中文 / English menu — opens and closes on click, no locale switch yet. */
function LanguageSwitcher({ block = false }: { block?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  useDismiss(open, ref, close);

  return (
    <div ref={ref} className={cn("relative", block && "w-full")}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[8px] bg-transparent font-round text-sm font-medium text-wb-ink-2 transition-colors duration-300 hover:bg-black/[.04]",
          block
            ? "h-11 w-full px-3 leading-[22.4px]"
            : "px-2 py-2 leading-[25.6px]",
        )}
      >
        {/* /icons-inline/ChevronDownIcon.svg is the site's 16px globe glyph */}
        <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-90" />
        <span>Intl - 中文</span>
        <span
          className={cn(
            "flex items-center transition-transform duration-300",
            open && "rotate-180",
          )}
        >
          <CaretGlyph className="h-[14px] w-[15px]" />
        </span>
      </button>

      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          "absolute top-[calc(100%+8px)] right-0 z-50 min-w-[140px] rounded-lg border border-black/[.06] bg-white p-1 shadow-[0_12px_32px_rgba(13,13,13,0.12)] transition-all duration-300",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        {LANGUAGES.map((language) => (
          <button
            key={language.value}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={close}
            className="flex h-9 w-full cursor-pointer items-center rounded-md px-3 text-sm font-medium text-wb-ink-2 transition-colors duration-300 hover:bg-wb-panel"
          >
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  // Exact /pricing matches the pricing page; everything else is 首页.
  const activeHref = pathname.startsWith("/pricing") ? "/pricing" : "/";
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Lock page scroll while the drawer is open.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  // Drop the drawer when the viewport grows back to desktop.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 z-50 h-20 w-full bg-white/85 text-base leading-[25.6px] transition-all duration-300 backdrop-blur-[40px]"
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <nav className="relative h-full">
        <div className="mx-auto grid h-full max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-5 px-10">
          {/* Logo */}
          <Link
            href="/"
            aria-label="WorkBuddy"
            className="flex items-center gap-3 self-center overflow-hidden rounded-lg transition-opacity duration-300 hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="WorkBuddy"
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              className="block h-8 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <ul className="m-0 hidden list-none items-center justify-center gap-6 whitespace-nowrap p-0 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = item.href === activeHref;
              return (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="relative flex items-center gap-1 overflow-hidden rounded-[8px] px-2 py-1.5 font-heading text-sm leading-[22.4px] font-bold whitespace-nowrap text-wb-ink-2 transition-colors duration-300 hover:text-wb-green"
                  >
                    {item.label}
                    {/* active / hover underline bar */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-wb-green transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop actions */}
          <div className="hidden items-center justify-end gap-4 self-center lg:flex">
            <LanguageSwitcher />
            <button
              type="button"
              className="flex h-[42px] min-w-[104px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#1a1a1a] px-[22px] font-round text-sm leading-[25.6px] font-medium tracking-wide text-white transition-all duration-300 hover:bg-black hover:opacity-90"
            >
              下载
            </button>
            <button
              type="button"
              className="flex h-[42px] min-w-[104px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-transparent px-2 font-round text-sm leading-[25.6px] font-medium text-wb-text transition-opacity duration-300 hover:opacity-70"
            >
              登录
            </button>
          </div>

          {/* Mobile hamburger (<1024px) */}
          <button
            type="button"
            aria-label="打开菜单"
            aria-expanded={menuOpen}
            onClick={openMenu}
            className="col-start-3 z-[1002] flex h-8 w-8 cursor-pointer items-center justify-center self-center justify-self-end rounded bg-transparent p-1 text-[#4c4f6b] transition-opacity duration-300 hover:opacity-70 lg:hidden"
          >
            <MobileMenuGlyph className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={cn(
          "fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[4px] transition-opacity duration-300 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Mobile drawer (right, 320px) */}
      <aside
        aria-label="移动端菜单"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        style={DRAWER_STYLE}
        className={cn(
          "fixed top-0 right-0 z-[10000] flex h-full w-[320px] max-w-[85vw] flex-col bg-white/95 backdrop-blur-[20px]",
          // `inert` + aria-hidden keep the off-canvas drawer out of the a11y
          // tree and tab order without cutting the slide-out transition short.
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header — logo + × close */}
        <div className="flex h-[73px] shrink-0 items-center justify-between border-b border-[rgba(226,232,240,0.6)] bg-white px-6">
          <Link
            href="/"
            aria-label="WorkBuddy"
            onClick={closeMenu}
            className="flex items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="WorkBuddy"
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              className="block h-7 w-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="关闭菜单"
            onClick={closeMenu}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-transparent text-2xl leading-none font-light text-[#4c4f6b] transition-opacity duration-300 hover:opacity-70"
          >
            ×
          </button>
        </div>

        {/* Drawer nav list */}
        <ul className="m-0 shrink-0 list-none p-0">
          {NAV_ITEMS.map((item) => {
            const active = item.href === activeHref;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between border-b border-[rgba(226,232,240,0.3)] px-6 py-4 text-base leading-[25.6px] font-medium transition-colors duration-300",
                    active
                      ? "bg-wb-green/5 text-wb-green"
                      : "text-[#4c4f6b] hover:text-wb-green",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Drawer bottom actions */}
        <div className="mt-auto flex shrink-0 flex-col gap-3 px-6 py-5">
          <LanguageSwitcher block />
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-transparent font-round text-sm leading-[22.4px] font-medium text-wb-text transition-opacity duration-300 hover:opacity-70"
          >
            登录
          </button>
          <button
            type="button"
            className="flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] bg-[#1a1a1a] font-round text-sm leading-[22.4px] font-medium text-white transition-all duration-300 hover:bg-black hover:opacity-90"
          >
            下载 WorkBuddy
          </button>
        </div>
      </aside>
    </header>
  );
}

export default Header;
