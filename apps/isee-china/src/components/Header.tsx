"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Header — fixed 80px bar, transparent white-on-dark over the hero,
 * flat white once scrolled (homepage). No login, no locale switch:
 * the site is English-only.
 * ------------------------------------------------------------------ */

const LOGO_SRC = "/brand/logo.png";
/** Source is 512×512; the text wordmark is rendered alongside it. */
const LOGO_SIZE = { width: 40, height: 40 };

const NAV_ITEMS = [{ label: "Home", href: "/" }];

/** Header body font (raw/header.json). */
const SYSTEM_FONT =
  '-apple-system, "system-ui", "Segoe UI", Roboto, sans-serif';

/** Original drawer easing (raw/header.json). */
const DRAWER_STYLE = {
  transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
} satisfies CSSProperties;

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

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // 首页 hero 是深色字报：页头在其上透明、白字；滚出首屏后换白底墨字。
  // 其他页面顶部是浅色，始终白底。
  const isHome = pathname === "/";
  const onDark = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      className={cn(
        "fixed top-0 left-0 z-50 h-20 w-full text-base leading-[25.6px] transition-colors duration-300",
        onDark ? "bg-transparent text-white" : "bg-white text-wb-ink-2",
      )}
      style={{ fontFamily: SYSTEM_FONT }}
    >
      <nav className="relative h-full">
        <div className="mx-auto grid h-full max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-5 px-10">
          {/* Logo */}
          <Link
            href="/"
            aria-label="iSee"
            className="flex items-center gap-2 self-center overflow-hidden rounded-lg transition-opacity duration-300 hover:opacity-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt=""
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              className="block h-8 w-8"
            />
            <span
              className={cn(
                "font-heading text-xl leading-none font-bold",
                onDark ? "text-white" : "text-wb-ink-2",
              )}
            >
              iSee
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="m-0 hidden list-none items-center justify-center gap-6 whitespace-nowrap p-0 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.label} className="relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-1 overflow-hidden rounded-[8px] px-2 py-1.5 font-heading text-sm leading-[22.4px] font-bold whitespace-nowrap transition-colors duration-300",
                      onDark
                        ? "text-white/85 hover:text-white"
                        : "text-wb-ink-2 hover:text-wb-action",
                    )}
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
            <a
              href="#download-section"
              className="flex h-[42px] min-w-[104px] cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#1a1a1a] px-[22px] text-sm leading-[25.6px] font-medium tracking-wide text-white transition-colors duration-300 hover:bg-black"
            >
              Download
            </a>
          </div>

          {/* Mobile hamburger (<1024px) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={openMenu}
            className={cn(
              "col-start-3 z-[1002] flex h-8 w-8 cursor-pointer items-center justify-center self-center justify-self-end rounded bg-transparent p-1 transition-opacity duration-300 hover:opacity-70 lg:hidden",
              onDark ? "text-white" : "text-[#4c4f6b]",
            )}
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
          "fixed inset-0 z-[9999] bg-black/50 transition-opacity duration-300 lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Mobile drawer (right, 320px) */}
      <aside
        aria-label="Mobile menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        style={DRAWER_STYLE}
        className={cn(
          "fixed top-0 right-0 z-[10000] flex h-full w-[320px] max-w-[85vw] flex-col bg-white",
          // `inert` + aria-hidden keep the off-canvas drawer out of the a11y
          // tree and tab order without cutting the slide-out transition short.
          menuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Drawer header — logo + × close */}
        <div className="flex h-[73px] shrink-0 items-center justify-between bg-white px-6">
          <Link
            href="/"
            aria-label="iSee"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt=""
              width={LOGO_SIZE.width}
              height={LOGO_SIZE.height}
              className="block h-7 w-7"
            />
            <span className="font-heading text-lg leading-none font-bold text-wb-ink-2">
              iSee
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-transparent text-2xl leading-none font-light text-[#4c4f6b] transition-opacity duration-300 hover:opacity-70"
          >
            ×
          </button>
        </div>

        {/* Drawer nav list */}
        <ul className="m-0 shrink-0 list-none p-0">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between px-6 py-4 text-base leading-[25.6px] font-medium transition-colors duration-300",
                    active
                      ? "bg-wb-action/5 text-wb-action"
                      : "text-[#4c4f6b] hover:text-wb-action",
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
          <a
            href="#download-section"
            onClick={closeMenu}
            className="flex h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-[8px] bg-[#1a1a1a] text-sm leading-[22.4px] font-medium text-white transition-colors duration-300 hover:bg-black"
          >
            Download iSee
          </a>
        </div>
      </aside>
    </header>
  );
}

export default Header;
