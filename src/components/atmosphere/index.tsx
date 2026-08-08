"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  hoverCapable,
  useDarkTheme,
  useIdleMounted,
  useReducedMotion,
} from "@/lib/hooks";

// The WebGL library stays out of the critical bundle; the atmosphere
// arrives a beat after the page does.
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

// Mostly paper with two periwinkle spots drifting through — visible
// life, but the type stays in charge.
const LIGHT = ["#ffffff", "#e3e9ff", "#f6f7fb", "#d8e0ff", "#ffffff"];
const DARK = ["#0d0e11", "#141a36", "#101218", "#121734", "#0d0e11"];

/**
 * A slow atmospheric layer, courtesy of paper.design's shader library:
 * a mesh gradient whose color spots move along their own trajectories.
 * Client-only (WebGL canvas), swaps palettes with the theme, and holds
 * still under reduced motion. `flip` fades in from the bottom instead,
 * for the contact bookend at the end of the page.
 *
 * It is also fidgetable: moving the cursor across its section stirs
 * it — pointer velocity feeds an energy value that eases back to calm,
 * briefly deepening the distortion and swirl.
 */
export function Atmosphere({ flip = false }: { flip?: boolean }) {
  // Idle-gated so the shader chunk fetches outside the critical path
  // instead of racing the page's LCP.
  const mounted = useIdleMounted();
  const dark = useDarkTheme();
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [stir, setStir] = useState(0);

  useEffect(() => {
    if (!mounted || reducedMotion || !hoverCapable()) return;
    // The atmosphere itself is pointer-events: none; its section hosts
    // the listener.
    const host = wrapRef.current?.parentElement;
    if (!host) return;
    // Two-stage motion: `energy` takes raw velocity impulses; the
    // shader only ever sees `smoothed`, which chases it — quick on
    // the attack, silky on the decay — so pointer jitter never
    // twitches the field. The perceptual curve (^1.4) keeps small
    // movements nearly invisible and big gestures unmistakable.
    let energy = 0;
    let smoothed = 0;
    let rendered = 0;
    let raf: number | null = null;
    let last: { x: number; y: number; t: number } | null = null;

    const tick = () => {
      raf = null;
      energy *= 0.94;
      if (energy < 0.002) energy = 0;
      smoothed += (energy - smoothed) * (energy > smoothed ? 0.16 : 0.08);
      if (energy === 0 && smoothed < 0.004) smoothed = 0;
      const value = Math.pow(smoothed, 1.4);
      if (Math.abs(value - rendered) > 0.003 || (value === 0 && rendered !== 0)) {
        rendered = value;
        setStir(value);
      }
      if (energy > 0 || smoothed > 0) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      if (last) {
        const dt = Math.max(1, now - last.t);
        const velocity =
          Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt;
        energy = Math.min(1, energy + velocity * 0.045);
      }
      last = { x: e.clientX, y: e.clientY, t: now };
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      last = null;
    };
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    return () => {
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  return (
    <div
      ref={wrapRef}
      className="atmosphere"
      data-flip={flip || undefined}
      aria-hidden="true"
      style={{ "--stir": stir.toFixed(3) } as React.CSSProperties}
    >
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        colors={dark ? DARK : LIGHT}
        distortion={0.7 + stir * 0.45}
        swirl={0.4 + stir * 0.3}
        grainMixer={0.12}
        grainOverlay={0}
        speed={reducedMotion ? 0 : 0.45 + stir * 0.55}
      />
    </div>
  );
}
