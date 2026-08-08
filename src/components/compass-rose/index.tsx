"use client";

import { useEffect, useRef } from "react";

/**
 * The title-block compass. On devices with a mouse the needle quietly
 * tracks the pointer; everywhere else (and under reduced motion) it
 * holds steady on north.
 */
export function CompassRose() {
  const needleRef = useRef<SVGGElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let raf: number | null = null;
    let target = { x: 0, y: 0 };

    const update = () => {
      raf = null;
      const svg = svgRef.current;
      const needle = needleRef.current;
      if (!svg || !needle) return;
      const rect = svg.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = (Math.atan2(target.x - cx, cy - target.y) * 180) / Math.PI;
      needle.style.transform = `rotate(${angle}deg)`;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target = { x: e.clientX, y: e.clientY };
      if (raf === null) raf = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 96 96"
      className="h-20 w-20 text-accent sm:h-24 sm:w-24"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="48" cy="48" r="34" />
        <circle cx="48" cy="48" r="26" strokeDasharray="2 4" />
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const isCardinal = i % 9 === 0;
          const r1 = isCardinal ? 28 : 31;
          // Fixed precision keeps server and client HTML byte-identical.
          const x1 = (48 + r1 * Math.sin(angle)).toFixed(2);
          const y1 = (48 - r1 * Math.cos(angle)).toFixed(2);
          const x2 = (48 + 34 * Math.sin(angle)).toFixed(2);
          const y2 = (48 - 34 * Math.cos(angle)).toFixed(2);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <g
        ref={needleRef}
        style={{ transformOrigin: "48px 48px", willChange: "transform" }}
      >
        <path d="M48 10 L52 24 L48 21 L44 24 Z" fill="currentColor" />
      </g>
      <text
        x="48"
        y="52"
        textAnchor="middle"
        fill="currentColor"
        style={{ font: "700 11px var(--font-mono)" }}
      >
        N
      </text>
    </svg>
  );
}
