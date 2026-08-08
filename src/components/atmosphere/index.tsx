"use client";

import { useEffect, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

// Barely-there cobalt tints so the type stays in charge.
const LIGHT = {
  colorBack: "#ffffff",
  colors: ["#eef1fe", "#e7ecfd", "#f3f4f8"],
};

const DARK = {
  colorBack: "#0d0e11",
  colors: ["#101322", "#0f1120", "#11141c"],
};

/**
 * A slow atmospheric layer drifting behind the hero, courtesy of
 * paper.design's shader library. Client-only (WebGL canvas), swaps
 * palettes with the theme, and holds still under reduced motion.
 */
export function Atmosphere() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) return null;

  const palette = dark ? DARK : LIGHT;

  return (
    <div className="atmosphere" aria-hidden="true">
      <GrainGradient
        style={{ width: "100%", height: "100%" }}
        colorBack={palette.colorBack}
        colors={palette.colors}
        shape="wave"
        softness={0.9}
        intensity={dark ? 0.18 : 0.28}
        noise={0.25}
        speed={reducedMotion ? 0 : 0.3}
      />
    </div>
  );
}
