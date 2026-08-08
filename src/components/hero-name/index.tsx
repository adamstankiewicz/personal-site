"use client";

import { useEffect, useRef } from "react";

const NAME_LINES = ["Adam", "Stankiewicz"];
const BASE_WEIGHT = 560;
const MAX_BOOST = 190;
const RADIUS = 200;

/**
 * The name, set letter by letter in Bricolage Grotesque. On pointer
 * devices each letter's weight responds to cursor proximity through
 * the variable font's wght axis — the type itself is the interaction.
 * Static under reduced motion and on touch screens.
 */
export function HeroName() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const letters = Array.from(el.querySelectorAll<HTMLElement>(".hero-letter"));
    let raf: number | null = null;
    let px = -10000;
    let py = -10000;

    const update = () => {
      raf = null;
      const bounds = el.getBoundingClientRect();
      // Skip the per-letter math entirely while the hero is off-screen.
      if (bounds.bottom < 0 || bounds.top > window.innerHeight) return;
      for (const letter of letters) {
        const rect = letter.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(px - cx, py - cy);
        const t = Math.max(0, 1 - distance / RADIUS);
        const weight = Math.round(BASE_WEIGHT + t * t * MAX_BOOST);
        letter.style.fontVariationSettings = `"wght" ${weight}`;
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (raf === null) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      px = -10000;
      py = -10000;
      if (raf === null) raf = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <h1
      ref={ref}
      className="rise rise-2 display-title mt-6 text-[clamp(3.25rem,10vw,7.5rem)]"
      aria-label="Adam Stankiewicz"
    >
      {NAME_LINES.map((line, lineIndex) => (
        <span key={line} aria-hidden="true" className="block">
          {Array.from(line).map((char, charIndex) => (
            <span key={`${lineIndex}-${charIndex}`} className="hero-letter">
              {char}
            </span>
          ))}
          {lineIndex === NAME_LINES.length - 1 ? (
            <span className="text-accent">.</span>
          ) : null}
        </span>
      ))}
    </h1>
  );
}
