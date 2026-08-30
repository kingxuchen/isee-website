"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Inertia smooth scroll matching the original site (html.lenis). */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
  return null;
}
