"use client";

// The career, as a horizontal chart strip. Each waypoint jumps to (and
// opens) the matching row in the Experience section below.
const START_YEAR = 2010;
const END_YEAR = 2027;

const STOPS = [
  { year: 2012, label: "U. Hartford", index: 4 },
  { year: 2015, label: "Carnegie Mellon", index: 3 },
  { year: 2017, label: "Ground Signal", index: 2 },
  { year: 2018, label: "edX / 2U", index: 1 },
  { year: 2025, label: "MagicSchool", index: 0 },
];

function positionFor(year: number) {
  return ((year - START_YEAR) / (END_YEAR - START_YEAR)) * 100;
}

function openWaypoint(index: number) {
  window.dispatchEvent(
    new CustomEvent("waypoint:open", { detail: { index } })
  );
  document.getElementById("route")?.scrollIntoView({ behavior: "smooth" });
}

export function RouteStrip() {
  return (
    <div className="px-5 pb-7 pt-6 sm:px-8">
      <div className="relative mr-2 h-16">
        {/* The course, 2010 to now */}
        <div
          className="absolute left-0 right-0 top-[26px] h-[2px] bg-accent"
          aria-hidden="true"
        />
        <svg
          className="absolute -right-2 top-[27px] h-3 w-3 -translate-y-1/2 text-accent"
          viewBox="0 0 12 12"
          aria-hidden="true"
        >
          <path d="M1 1 L11 6 L1 11 Z" fill="var(--paper)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>

        {STOPS.map((stop) => (
          <button
            key={stop.year}
            type="button"
            onClick={() => openWaypoint(stop.index)}
            className="group absolute top-0 h-full -translate-x-1/2 cursor-pointer px-2"
            style={{ left: `${positionFor(stop.year)}%` }}
            aria-label={`${stop.label}, ${stop.year} — jump to details`}
          >
            <svg
              className="mx-auto h-3.5 w-3.5 text-accent transition-transform group-hover:scale-125"
              viewBox="0 0 14 14"
              aria-hidden="true"
            >
              <path
                d="M7 2 L12.5 12 L1.5 12 Z"
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mono-label mt-3 block tabular-nums text-ink-muted transition-colors group-hover:text-accent">
              {stop.year}
            </span>
            <span className="condensed-caps mt-1 hidden whitespace-nowrap text-[0.6875rem] text-ink-muted transition-colors group-hover:text-accent lg:block">
              {stop.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
