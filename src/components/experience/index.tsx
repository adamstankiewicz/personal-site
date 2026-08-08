"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { hoverCapable, prefersReducedMotion } from "@/lib/hooks";
import { earlierWork, experiences } from "./data";
import { ExperienceItemProps } from "./types";
import { ExternalLink } from "@/components/ui/external-link";

function RouteFlyer({ onArrive }: { onArrive: (index: number) => void }) {
  const flyerRef = useRef<HTMLDivElement>(null);
  const onArriveRef = useRef(onArrive);

  // Layout effect, not passive: the flyer's rAF loop can fire between
  // paint and passive-effect flush, and an arrival dispatched into last
  // render's closure would compare against a stale openIndex.
  useLayoutEffect(() => {
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
    let navArrival = false;

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
        if (navArrival) {
          // Jumping here via the nav lands the anchor partway down the
          // course; the first row is where reading starts, so it opens
          // instead, and arrivals hold (tracking geometry silently)
          // until the visitor scrolls on their own.
          lastArrived = arrived;
        } else if (arrived !== lastArrived) {
          // A fast flick can cross several waypoints in one frame;
          // every crossed row arrives, not just the one the frame
          // lands on (batched, so hover devices still settle on the
          // last one).
          for (let i = lastArrived + 1; i <= arrived; i++) {
            onArriveRef.current(i);
          }
          if (arrived < lastArrived) onArriveRef.current(arrived);
          lastArrived = arrived;
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
      (entries) => {
        // Crossings can batch; the latest entry is where we really are.
        running = entries[entries.length - 1].isIntersecting;
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
      navArrival = false;
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

    const onNavEnd = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== "route") return;
      navArrival = true;
      onArriveRef.current(0);
      start();
    };
    // The hold releases on the first gesture that is unmistakably the
    // visitor's own.
    const releaseNavHold = () => {
      navArrival = false;
    };

    start();
    window.addEventListener("nav-scroll-end", onNavEnd);
    window.addEventListener("wheel", releaseNavHold, { passive: true });
    window.addEventListener("touchstart", releaseNavHold, { passive: true });
    window.addEventListener("keydown", releaseNavHold);
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
      window.removeEventListener("nav-scroll-end", onNavEnd);
      window.removeEventListener("wheel", releaseNavHold);
      window.removeEventListener("touchstart", releaseNavHold);
      window.removeEventListener("keydown", releaseNavHold);
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

// Descriptions stay plain strings (llms.txt serializes them as
// markdown, where *…* already reads as emphasis); on the page, the
// same markers become real <em>s — used for work titles in prose.
function emphasize(text: string) {
  return text
    .split(/\*([^*]+)\*/g)
    .map((part, i) => (i % 2 ? <em key={i}>{part}</em> : part));
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
        <span className="mono-label tabular-nums text-ink-muted">
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
              <p className="max-w-[62ch] text-[1rem] leading-[1.7]">
                {emphasize(description)}
              </p>
              <ExternalLink
                href={companyUrl}
                className="mono-link mt-4 inline-block"
                icon
              >
                Visit {company}
              </ExternalLink>
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
  // Hover devices read as a single-open ledger; touch devices as an
  // additive reveal. On touch, rows open as the handle reaches them and
  // never auto-close — every height change lands below the reading
  // anchor, so nothing fights momentum scrolling and nothing above the
  // eye ever shifts. A tap toggles only its own row, so the tapped
  // header (and the handle riding the scroll position) holds still.
  const [openRows, setOpenRows] = useState<ReadonlySet<number>>(
    () => new Set([0])
  );
  const routeRef = useRef<HTMLDivElement>(null);
  // Hover devices only — on scroll-arrival, the newly arrived row opens
  // with its normal animation (growth happens below the handle, which
  // is harmless), while the previously open row collapses in a single
  // frame with a synchronous scroll compensation. Nothing animates
  // against the user's wheel, and the collapse above can't cascade the
  // trigger past short rows.
  const autoOpenRef = useRef<{ index: number; top: number } | null>(null);


  const handleArrive = (index: number) => {
    if (!hoverCapable()) {
      setOpenRows((prev) =>
        prev.has(index) ? prev : new Set(prev).add(index)
      );
      return;
    }
    // Arriving on the already-open row changes nothing; skip it so the
    // layout effect below never sees a pending entry it won't consume.
    if (openRows.has(index) && openRows.size === 1) return;
    const row =
      routeRef.current?.querySelectorAll<HTMLElement>(".ledger-row")[index];
    if (row) {
      autoOpenRef.current = { index, top: row.getBoundingClientRect().top };
      routeRef.current?.setAttribute("data-instant-close", "");
    }
    setOpenRows(new Set([index]));
  };

  useLayoutEffect(() => {
    const pending = autoOpenRef.current;
    if (!pending) return;
    autoOpenRef.current = null;
    const route = routeRef.current;
    // A pending entry for anything but the row that actually opened is
    // stale (a race left it behind); discard it but still lift the
    // attribute below so collapses don't stay permanently instant.
    const row = openRows.has(pending.index)
      ? route?.querySelectorAll<HTMLElement>(".ledger-row")[pending.index]
      : undefined;
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
  }, [openRows]);

  return (
    <section id="route" className="scroll-mt-28 pb-24 sm:scroll-mt-16 sm:pb-32">
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
              open={openRows.has(index)}
              // Closing collapses below its own header (nothing above
              // shifts). Opening routes through handleArrive: on hover
              // devices that's the same compensation as scroll arrivals,
              // so the tapped header holds still even where scroll
              // anchoring is missing (iOS Safari); on touch it's a plain
              // additive open — no other row moves at all.
              onToggle={() =>
                openRows.has(index)
                  ? setOpenRows((prev) => {
                      const next = new Set(prev);
                      next.delete(index);
                      return next;
                    })
                  : handleArrive(index)
              }
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
