"use client";

import { useEffect, useRef } from "react";
import { useHoverCapable, useReducedMotion } from "@/lib/hooks";

/**
 * An honest photo handled like a print: it tilts a few degrees
 * toward the cursor while a broad, faint pool of light drifts across
 * it, the way a glossy photo catches a lamp when you tilt it in
 * hand. Pure CSS driven by eased custom properties — no WebGL, no
 * distortion. Everything settles flat when the pointer leaves.
 * Inert on touch screens and under reduced motion.
 */
export function PrintPhoto({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 50, y: 50, tx: 50, ty: 50 });
  const hovering = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hoverable = useHoverCapable();
  const reduced = useReducedMotion();
  const active = hoverable && !reduced;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = () => {
    const p = pos.current;
    p.x += (p.tx - p.x) * 0.1;
    p.y += (p.ty - p.y) * 0.1;
    const el = wrapRef.current;
    if (el) {
      el.style.setProperty("--mx", `${p.x}%`);
      el.style.setProperty("--my", `${p.y}%`);
    }
    const settled = Math.hypot(p.tx - p.x, p.ty - p.y) < 0.15;
    rafRef.current =
      hovering.current || !settled ? requestAnimationFrame(tick) : null;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    pos.current.tx = ((e.clientX - rect.left) / rect.width) * 100;
    pos.current.ty = ((e.clientY - rect.top) / rect.height) * 100;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  const onPointerLeave = () => {
    hovering.current = false;
    // Ease back to flat; the loop keeps running until settled.
    pos.current.tx = 50;
    pos.current.ty = 50;
    if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div
      ref={wrapRef}
      className="photo print-photo"
      style={{ aspectRatio: `${width} / ${height}` }}
      onPointerEnter={active ? () => (hovering.current = true) : undefined}
      onPointerMove={active ? onPointerMove : undefined}
      onPointerLeave={active ? onPointerLeave : undefined}
    >
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      {active ? <div className="photo-sheen" aria-hidden="true" /> : null}
    </div>
  );
}
