"use client";

import { useEffect, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";

// Barely-there tints of the chart palette so the type stays in charge.
const LIGHT = {
  colorBack: "#f4efdf",
  colors: ["#ede4d6", "#ecdde4", "#e0e4ec"],
};

const DARK = {
  colorBack: "#101318",
  colors: ["#151a22", "#231825", "#182130"],
};

/**
 * A slow weather layer drifting behind the title block, courtesy of
 * paper.design's shader library. Client-only (WebGL canvas), swaps
 * palettes with the theme, and holds still under reduced motion.
 */
export function ChartWeather() {
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
    <div className="absolute inset-0" aria-hidden="true">
      <GrainGradient
        style={{ width: "100%", height: "100%" }}
        colorBack={palette.colorBack}
        colors={palette.colors}
        shape="wave"
        softness={0.85}
        intensity={0.32}
        noise={0.35}
        speed={reducedMotion ? 0 : 0.35}
      />
    </div>
  );
}
