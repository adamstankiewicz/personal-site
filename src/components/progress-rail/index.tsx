"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToSection } from "@/lib/section-scroll";

export interface RailSection {
  id: string;
  label: string;
}

/**
 * A quiet scroll position indicator on the right edge (desktop only):
 * a hairline track, a cobalt fill for progress, and one tick per
 * section placed at its true position in the document. Ticks jump to
 * their section; the label names where you are, and offers the way
 * back up once you reach the end.
 */
export function ProgressRail({
  sections,
  activeSection,
}: {
  sections: RailSection[];
  activeSection: string | null;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<{ id: string; label: string; at: number }[]>([]);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    let raf: number | null = null;

    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setTicks(
        sections
          .map(({ id, label }) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const top = el.getBoundingClientRect().top + window.scrollY;
            return { id, label, at: Math.min(1, Math.max(0, top / max)) };
          })
          .filter((tick): tick is { id: string; label: string; at: number } => tick !== null)
      );
    };

    const update = () => {
      raf = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${progress})`;
      }
      setLanded(progress >= 0.995);
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Accordion rows opening/closing change the document height; keep
    // tick positions honest through it.
    const resizeObserver = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    resizeObserver.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      resizeObserver.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [sections]);

  const activeLabel =
    sections.find((section) => section.id === activeSection)?.label ?? "Top";

  return (
    // While Experience is on screen, its own scrubber is the vertical
    // instrument; two competing line-and-dot tracks would read as
    // duplicates, so the rail steps aside.
    <div
      className="progress-rail"
      data-yield={activeSection === "experience" || undefined}
    >
      <div className="progress-rail-track">
        <div ref={fillRef} className="progress-rail-fill" aria-hidden="true" />
        {ticks.map((tick) => (
          <button
            key={tick.id}
            type="button"
            className="progress-rail-tick"
            style={{ top: `${(tick.at * 100).toFixed(2)}%` }}
            data-active={activeSection === tick.id}
            aria-label={`Jump to ${tick.label}`}
            onClick={() => scrollToSection(tick.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="progress-rail-label"
        onClick={() =>
          landed
            ? window.scrollTo({ top: 0, behavior: "smooth" })
            : activeSection && scrollToSection(activeSection)
        }
      >
        {landed ? "Back to top ↑" : activeLabel}
      </button>
    </div>
  );
}
