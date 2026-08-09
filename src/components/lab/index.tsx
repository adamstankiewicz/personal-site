"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { hoverCapable, useDarkTheme, useIdleMounted, useReducedMotion } from "@/lib/hooks";

// Shares the atmosphere's async chunk; never in the critical bundle.
const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.GrainGradient),
  { ssr: false }
);

function LabCard({
  number,
  title,
  description,
  mechanism,
  children,
}: {
  number: string;
  title: string;
  description: string;
  mechanism: string;
  children: React.ReactNode;
}) {
  return (
    <Card as="article" lift>
      <div className="lab-stage">{children}</div>
      <div className="border-t border-line px-5 py-4">
        <p className="flex items-baseline gap-3">
          <span className="mono-label text-ink-muted">{number}</span>
          <span className="title-md text-[1rem]">{title}</span>
        </p>
        <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink-muted">
          {description}
        </p>
        <p className="mono-label mt-3 text-ink-muted">{mechanism}</p>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  01 — Weight, by proximity                                          */
/* ------------------------------------------------------------------ */

const WORD = "grotesque";
const LAB_BASE = 460;
const LAB_BOOST = 300;
const LAB_RADIUS = 110;

function WeightWord() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (!hoverCapable()) return;

    const letters = Array.from(el.querySelectorAll<HTMLElement>(".hero-letter"));
    let raf: number | null = null;
    let px = -10000;
    let py = -10000;

    const update = () => {
      raf = null;
      for (const letter of letters) {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(
          px - (rect.left + rect.width / 2),
          py - (rect.top + rect.height / 2)
        );
        const t = Math.max(0, 1 - distance / LAB_RADIUS);
        const weight = Math.round(LAB_BASE + t * t * LAB_BOOST);
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
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className="flex h-full items-center justify-center"
      role="img"
      aria-label={WORD}
    >
      <span aria-hidden="true" className="font-display text-[2.5rem] tracking-tight sm:text-[3rem]">
        {Array.from(WORD).map((char, index) => (
          <span
            key={index}
            className="hero-letter"
            style={{ fontVariationSettings: `"wght" ${LAB_BASE}` }}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  02 — Spring, from the token layer                                  */
/* ------------------------------------------------------------------ */

function SpringDot() {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <button
      type="button"
      aria-label="Move the dot; it arrives on the site's spring easing"
      className="lab-spring-stage"
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <span
        className="lab-spring-dot"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        aria-hidden="true"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  03 — The theme wipe                                                */
/* ------------------------------------------------------------------ */

function WipeCard() {
  const [night, setNight] = useState(false);

  return (
    <button
      type="button"
      className="lab-wipe-stage"
      data-night={night}
      onClick={() => setNight((v) => !v)}
      aria-label="Run the theme wipe"
    >
      <span className="lab-wipe-panel lab-wipe-day" aria-hidden="true">
        <span className="theme-glyph">◐</span>
        <span className="mono-label mt-3 block">Day</span>
      </span>
      <span className="lab-wipe-panel lab-wipe-night" aria-hidden="true">
        <span className="theme-glyph inline-block rotate-180">◐</span>
        <span className="mono-label mt-3 block">Night</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  04 — Grain, seven ways                                             */
/* ------------------------------------------------------------------ */

const SHAPES = [
  "wave",
  "dots",
  "truchet",
  "corners",
  "ripple",
  "blob",
  "sphere",
] as const;
type Shape = (typeof SHAPES)[number];

// Each shape gets its own baseline so none of them arrive harsh; the
// sliders scale from there.
const SHAPE_PRESETS: Record<
  Shape,
  { softness: number; intensity: number; noise: number }
> = {
  wave: { softness: 0.9, intensity: 0.35, noise: 0.25 },
  dots: { softness: 0.7, intensity: 0.55, noise: 0.3 },
  truchet: { softness: 0.7, intensity: 0.4, noise: 0.2 },
  corners: { softness: 0.8, intensity: 0.42, noise: 0.22 },
  ripple: { softness: 0.85, intensity: 0.38, noise: 0.22 },
  blob: { softness: 0.9, intensity: 0.4, noise: 0.2 },
  sphere: { softness: 0.8, intensity: 0.45, noise: 0.24 },
};

function GrainField() {
  const [shape, setShape] = useState<Shape>("dots");
  const [gain, setGain] = useState(1);
  const [tempo, setTempo] = useState(0.5);
  const dark = useDarkTheme();
  const reduced = useReducedMotion();
  const idle = useIdleMounted();
  const preset = SHAPE_PRESETS[shape];

  if (!idle) return <div className="relative h-full" />;

  const palette = dark
    ? { colorBack: "#0d0e11", colors: ["#1f2861", "#161d4d", "#11141c"] }
    : { colorBack: "#ffffff", colors: ["#c8d5ff", "#aabfff", "#e2e9ff"] };

  return (
    <div className="relative h-full">
      <GrainGradient
        style={{ width: "100%", height: "100%" }}
        colorBack={palette.colorBack}
        colors={palette.colors}
        shape={shape}
        softness={preset.softness}
        intensity={Math.min(1, preset.intensity * gain)}
        noise={Math.min(1, preset.noise * gain)}
        speed={reduced ? 0 : tempo}
      />
      <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
        <label className="lab-lever">
          <span className="mono-label text-ink-muted">grain</span>
          <input
            type="range"
            className="lab-slider"
            min={0.3}
            max={1.8}
            step={0.05}
            value={gain}
            onChange={(e) => setGain(Number(e.target.value))}
            aria-label="Grain intensity"
          />
        </label>
        <label className="lab-lever">
          <span className="mono-label text-ink-muted">speed</span>
          <input
            type="range"
            className="lab-slider"
            min={0}
            max={1.2}
            step={0.05}
            value={tempo}
            onChange={(e) => setTempo(Number(e.target.value))}
            aria-label="Animation speed"
          />
        </label>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
        {SHAPES.map((s) => (
          <Chip
            key={s}
            as="button"
            type="button"
            onMedia
            active={shape === s}
            aria-pressed={shape === s}
            onClick={() => setShape(s)}
          >
            {s}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The section                                                        */
/* ------------------------------------------------------------------ */

export function Lab() {
  return (
    <section id="lab" className="scroll-mt-28 pb-24 sm:scroll-mt-16 sm:pb-32">
      <SectionHeader number="05" title="Lab" annotation="Small experiments, live" />
      <p className="mt-8 max-w-2xl text-[1rem] leading-[1.7] text-ink-muted">
        Interaction sketches built for this site, running live on this page.
        Each one is a specimen of something the site itself uses.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <LabCard
          number="01"
          title="Weight, by proximity"
          description="Bricolage's weight axis follows the cursor, letter by letter. The same move as the name at the top of the page, with the dial turned up."
          mechanism="font-variation-settings · wght 460–760"
        >
          <WeightWord />
        </LabCard>
        <LabCard
          number="02"
          title="Spring, as a design token"
          description="Click anywhere in the field. The dot arrives on the site's spring easing, a CSS linear() curve stored in tokens.json with the rest of the design tokens."
          mechanism="easing.spring · duration.slow · linear()"
        >
          <SpringDot />
        </LabCard>
        <LabCard
          number="03"
          title="The theme wipe"
          description="The header's theme toggle sweeps the new mode across the page. Here is the same wipe in miniature. Click to run it."
          mechanism="clip-path · easing.anticipate · View Transitions API"
        >
          <WipeCard />
        </LabCard>
        <LabCard
          number="04"
          title="Grain, seven ways"
          description="A WebGL grain shader from the same library as the hero's atmosphere. It comes in seven shapes; here are all of them, with the dial turned up."
          mechanism="@paper-design/shaders-react · GrainGradient"
        >
          <GrainField />
        </LabCard>
      </div>
    </section>
  );
}
