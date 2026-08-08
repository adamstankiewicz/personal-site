"use client";

import dynamic from "next/dynamic";
import { useDarkTheme, useIdleMounted, useReducedMotion } from "@/lib/hooks";

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
 */
export function Atmosphere({ flip = false }: { flip?: boolean }) {
  // Idle-gated so the shader chunk fetches outside the critical path
  // instead of racing the page's LCP.
  const mounted = useIdleMounted();
  const dark = useDarkTheme();
  const reducedMotion = useReducedMotion();

  if (!mounted) return null;

  return (
    <div className="atmosphere" data-flip={flip || undefined} aria-hidden="true">
      <MeshGradient
        style={{ width: "100%", height: "100%" }}
        colors={dark ? DARK : LIGHT}
        distortion={0.7}
        swirl={0.4}
        grainMixer={0.12}
        grainOverlay={0}
        speed={reducedMotion ? 0 : 0.45}
      />
    </div>
  );
}
