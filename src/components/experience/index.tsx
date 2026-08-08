"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { prefersReducedMotion } from "@/lib/hooks";
import { earlierWork, experiences } from "./data";
import { ExperienceItemProps } from "./types";

function RouteFlyer({ onArrive }: { onArrive: (index: number) => void }) {
  const flyerRef = useRef<HTMLDivElement>(null);
  const onArriveRef = useRef(onArrive);

  useEffect(() => {
    onArriveRef.current = onArrive;
  });

  useEffect(() => {
    const flyer = flyerRef.current;
    const container = flyer?.parentElement;
    const line = container?.querySelector<HTMLElement>(".route-line");
    if (!flyer || !container || !line) return;

    if (prefersReducedMotion()) return;

    // A continuous loop (only while the section is on screen) lerps the
    // handle toward its target every frame, so layout shifts from rows
    // opening read as a glide rather than a teleport. Arrivals are
    // judged on the un-smoothed target so the logic stays exact.
    let raf: number | null = null;
    let running = false;
    let lastArrived = -1;
    let dragging = false;
    let smoothedY: number | null = null;

    const step = () => {
      raf = null;
      const rect = container.getBoundingClientRect();
      const anchor = window.innerHeight * 0.45;
      const progress = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height));
      const targetY = 14 + progress * (rect.height - 46);
      smoothedY =
        smoothedY === null ? targetY : smoothedY + (targetY - smoothedY) * 0.22;
      if (Math.abs(targetY - smoothedY) < 0.1) smoothedY = targetY;
      flyer.style.transform = `translate(-50%, ${smoothedY}px)`;
      // The drawn course always ends exactly at the handle.
      const lineHeight = line.offsetHeight;
      const tip = Math.min(1, Math.max(0, (smoothedY + 2) / lineHeight));
      line.style.transform = `scaleY(${tip})`;

      // The handle opens each waypoint as it arrives (suspended
      // mid-drag, and during nav-driven smooth scrolls, whose motion
      // our scroll compensation would otherwise cancel).
      if (!dragging && !document.documentElement.dataset.navScrolling) {
        const rows = container.querySelectorAll<HTMLElement>(".ledger-row");
        let arrived = 0;
        rows.forEach((row, index) => {
          const rowTop = row.getBoundingClientRect().top - rect.top;
          if (targetY >= rowTop - 8) arrived = index;
        });
        if (arrived !== lastArrived) {
          lastArrived = arrived;
          onArriveRef.current(arrived);
        }
      }
      if (running) raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(step);
    };
    const onScroll = start;

    // Only burn frames while the timeline is actually visible.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) start();
      },
      { rootMargin: "20% 0px" }
    );
    visibility.observe(container);

    // Dragging the flyer scrubs the page: pointer position maps back to a
    // scroll position, so scroll remains the single source of truth.
    // Geometry is snapshotted at drag start and auto-open is suspended
    // until release, so rows expanding mid-drag can't destabilize the math.
    let dragDocTop = 0;
    let dragHeight = 1;
    const onPointerDown = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      dragging = true;
      dragDocTop = rect.top + window.scrollY;
      dragHeight = rect.height;
      flyer.setPointerCapture(e.pointerId);
      document.documentElement.style.userSelect = "none";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const anchor = window.innerHeight * 0.45;
      const pointerDocY = e.clientY + window.scrollY;
      const progress = Math.min(
        1,
        Math.max(0, (pointerDocY - dragDocTop) / dragHeight)
      );
      window.scrollTo({
        top: progress * dragHeight + dragDocTop - anchor,
        behavior: "instant" as ScrollBehavior,
      });
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      flyer.releasePointerCapture(e.pointerId);
      document.documentElement.style.userSelect = "";
      onScroll();
    };

    start();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    flyer.addEventListener("pointerdown", onPointerDown);
    flyer.addEventListener("pointermove", onPointerMove);
    flyer.addEventListener("pointerup", onPointerUp);
    flyer.addEventListener("pointercancel", onPointerUp);
    // Rows expanding and collapsing change the container's height without
    // a scroll event; the observer keeps the course in sync through the
    // whole transition.
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(container);
    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      flyer.removeEventListener("pointerdown", onPointerDown);
      flyer.removeEventListener("pointermove", onPointerMove);
      flyer.removeEventListener("pointerup", onPointerUp);
      flyer.removeEventListener("pointercancel", onPointerUp);
      resizeObserver.disconnect();
      visibility.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={flyerRef} className="route-flyer" aria-hidden="true" />;
}

function WaypointMarker() {
  return <span className="waypoint-marker" aria-hidden="true" />;
}

function Waypoint({
  experience,
  index,
  open,
  onToggle,
}: {
  experience: ExperienceItemProps;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { company, companyUrl, period, positions, description, technologies } =
    experience;
  const currentRole = positions[0]?.title ?? "";
  const bodyId = `waypoint-${index}-body`;

  return (
    <li className="ledger-row waypoint" data-open={open}>
      <WaypointMarker />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className="group -mx-3 grid w-full cursor-pointer grid-cols-[4.5rem_1fr] items-baseline gap-x-4 px-3 py-2 text-left sm:grid-cols-[4.5rem_1fr_1fr_8.5rem_1.5rem]"
      >
        <span className="mono-label tabular-nums text-accent">
          {period.split("–")[0]}
        </span>
        <span className="title-md text-[1.125rem] transition-colors group-hover:text-accent sm:text-[1.25rem]">
          {company}
        </span>
        <span className="mono-label hidden text-ink-muted sm:block">
          {currentRole}
        </span>
        <span className="mono-label hidden tabular-nums text-ink-muted sm:block sm:text-right">
          {period}
        </span>
        <span
          className="ledger-toggle-glyph mono-label hidden text-ink-muted group-hover:text-accent sm:inline-flex"
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div className="ledger-row-body" id={bodyId}>
        <div>
          <div className="grid gap-8 pb-4 pt-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="max-w-[62ch] text-[1rem] leading-[1.7]">{description}</p>
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-link mt-4 inline-block"
              >
                Visit {company} ↗
              </a>
            </div>
            <div className="space-y-6 lg:col-span-5">
              {positions.length > 1 ? (
                <div>
                  <p className="mono-label text-ink-muted">Positions held</p>
                  <ul className="mt-3 space-y-1.5">
                    {positions.map((position) => (
                      <li
                        key={position.title}
                        className="flex items-baseline justify-between gap-4 font-mono text-[0.75rem] tracking-wide"
                      >
                        <span>{position.title}</span>
                        <span className="tabular-nums text-ink-muted">{position.period}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <p className="mono-label text-ink-muted">Stack</p>
                <p className="mt-3 font-mono text-[0.75rem] leading-relaxed tracking-wide text-ink-muted">
                  {technologies.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const routeRef = useRef<HTMLDivElement>(null);
  // On scroll-arrival, the newly arrived row opens with its normal
  // animation (growth happens below the handle, which is harmless),
  // while the previously open row collapses in a single frame with a
  // synchronous scroll compensation. Nothing animates against the
  // user's wheel, and the collapse above can't cascade the trigger
  // past short rows.
  const autoOpenRef = useRef<{ index: number; top: number } | null>(null);


  const handleArrive = (index: number) => {
    const row =
      routeRef.current?.querySelectorAll<HTMLElement>(".ledger-row")[index];
    if (row) {
      autoOpenRef.current = { index, top: row.getBoundingClientRect().top };
      routeRef.current?.setAttribute("data-instant-close", "");
    }
    setOpenIndex(index);
  };

  useLayoutEffect(() => {
    const pending = autoOpenRef.current;
    if (!pending) return;
    autoOpenRef.current = null;
    const route = routeRef.current;
    const row =
      route?.querySelectorAll<HTMLElement>(".ledger-row")[pending.index];
    if (row) {
      const delta = row.getBoundingClientRect().top - pending.top;
      if (delta !== 0) {
        window.scrollBy({ top: delta, behavior: "instant" as ScrollBehavior });
      }
    }
    // One frame is enough: the collapse has already happened without a
    // transition; the newly opened row's transition is running and
    // keeps running after the attribute lifts.
    requestAnimationFrame(() => {
      route?.removeAttribute("data-instant-close");
    });
  }, [openIndex]);

  return (
    <section id="route" className="scroll-mt-16 pb-24 sm:pb-32">
      <SectionHeader number="02" title="Experience" annotation="2010–Present" />
      <div ref={routeRef} className="route mt-10">
        <div className="route-line" aria-hidden="true" />
        <RouteFlyer onArrive={handleArrive} />
        <ol className="space-y-8">
          {experiences.map((experience, index) => (
            <Waypoint
              key={experience.company}
              experience={experience}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </ol>
        <p className="mt-8 max-w-[62ch] text-[0.9375rem] italic text-ink-muted">
          {earlierWork.description}{" "}
          <span className="mono-label not-italic">({earlierWork.period})</span>
        </p>
      </div>
    </section>
  );
}
