"use client";

import { useEffect, useRef, useState } from "react";
import {
  GrainGradient,
  ImageDithering,
  Water,
} from "@paper-design/shaders-react";
import { SectionHeader } from "@/components/section-header";

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function useDarkTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("dark"));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return reduced;
}

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
    <article className="lab-card">
      <div className="lab-stage">{children}</div>
      <div className="border-t border-line px-5 py-4">
        <p className="flex items-baseline gap-3">
          <span className="mono-label text-accent">{number}</span>
          <span className="title-md text-[1rem]">{title}</span>
        </p>
        <p className="mt-2 text-[0.9375rem] leading-[1.6] text-ink-muted">
          {description}
        </p>
        <p className="mono-label mt-3 text-ink-muted">{mechanism}</p>
      </div>
    </article>
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
    if (window.matchMedia("(hover: none)").matches) return;

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

function GrainField() {
  const [shape, setShape] = useState<Shape>("dots");
  const dark = useDarkTheme();
  const reduced = useReducedMotion();

  const palette = dark
    ? { colorBack: "#0d0e11", colors: ["#1a2150", "#131840", "#11141c"] }
    : { colorBack: "#ffffff", colors: ["#dfe6ff", "#c9d5ff", "#eef1fe"] };

  return (
    <div className="relative h-full">
      <GrainGradient
        style={{ width: "100%", height: "100%" }}
        colorBack={palette.colorBack}
        colors={palette.colors}
        shape={shape}
        softness={0.8}
        intensity={0.4}
        noise={0.3}
        speed={reduced ? 0 : 0.5}
      />
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
        {SHAPES.map((s) => (
          <button
            key={s}
            type="button"
            className="lab-chip"
            data-active={shape === s}
            onClick={() => setShape(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  05 — Water, over Winnipesaukee                                     */
/* ------------------------------------------------------------------ */

function WaterField() {
  const reduced = useReducedMotion();

  return (
    <Water
      style={{ width: "100%", height: "100%" }}
      image="/images/flying/winnipesaukee.jpg"
      fit="cover"
      caustic={0.3}
      highlights={0.15}
      layering={0.25}
      edges={0.12}
      waves={0.08}
      size={2}
      speed={reduced ? 0 : 0.4}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  06 — One-bit Monadnock                                             */
/* ------------------------------------------------------------------ */

const DOT_SIZES = [2, 3.5, 6] as const;

function DitherField() {
  const [dotSize, setDotSize] = useState<number>(3.5);
  const dark = useDarkTheme();

  return (
    <div className="relative h-full">
      <ImageDithering
        style={{ width: "100%", height: "100%" }}
        image="/images/flying/monadnock.jpg"
        fit="cover"
        type="8x8"
        size={dotSize}
        colorSteps={2}
        originalColors={false}
        colorFront={dark ? "#f1f1f3" : "#131316"}
        colorHighlight={dark ? "#f1f1f3" : "#131316"}
        colorBack={dark ? "#0d0e11" : "#ffffff"}
        speed={0}
      />
      <div className="absolute bottom-3 left-3 flex gap-1.5">
        {DOT_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className="lab-chip"
            data-active={dotSize === size}
            onClick={() => setDotSize(size)}
          >
            {size}px
          </button>
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
    <section id="lab" className="scroll-mt-16 pb-24 sm:pb-32">
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
          mechanism="clip-path · View Transitions API"
        >
          <WipeCard />
        </LabCard>
        <LabCard
          number="04"
          title="Grain, seven ways"
          description="A WebGL grain shader from the same library as the hero's atmosphere. It comes in seven shapes; here are all of them, louder than the hero would ever allow."
          mechanism="@paper-design/shaders-react · GrainGradient"
        >
          <GrainField />
        </LabCard>
        <LabCard
          number="05"
          title="Water, over Winnipesaukee"
          description="The lake from the About photos, refracted through a caustic water shader. Some subjects earn their effect."
          mechanism="Water · caustic image filter"
        >
          <WaterField />
        </LabCard>
        <LabCard
          number="06"
          title="One-bit Monadnock"
          description="The same mountain, re-screened through an ordered Bayer dither, like a 1-bit Mac. Pick the dot size."
          mechanism="ImageDithering · 8×8 Bayer"
        >
          <DitherField />
        </LabCard>
      </div>
    </section>
  );
}
