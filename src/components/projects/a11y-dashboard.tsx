"use client";

import { useState } from "react";
import { TextMorph } from "torph/react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";

const IMPACTS = ["critical", "serious", "moderate", "minor"] as const;
type Impact = (typeof IMPACTS)[number];
type Filter = Impact | "all";

// Demonstration data, shaped like the real pipeline's output.
const SCREENS: { route: string; counts: Record<Impact, number> }[] = [
  { route: "/tools/lesson-planner", counts: { critical: 2, serious: 6, moderate: 9, minor: 4 } },
  { route: "/chat", counts: { critical: 1, serious: 4, moderate: 7, minor: 3 } },
  { route: "/tools/rubric-generator", counts: { critical: 0, serious: 3, moderate: 6, minor: 2 } },
  { route: "/history", counts: { critical: 0, serious: 2, moderate: 4, minor: 2 } },
  { route: "/account/settings", counts: { critical: 0, serious: 1, moderate: 3, minor: 1 } },
  { route: "/tools/report-cards", counts: { critical: 0, serious: 1, moderate: 1, minor: 1 } },
];

// Introduced vs resolved, per week: the momentum the guild watches.
const WEEKS: { introduced: number; resolved: number }[] = [
  { introduced: 9, resolved: 2 },
  { introduced: 7, resolved: 4 },
  { introduced: 11, resolved: 5 },
  { introduced: 6, resolved: 8 },
  { introduced: 8, resolved: 7 },
  { introduced: 5, resolved: 9 },
  { introduced: 7, resolved: 12 },
  { introduced: 4, resolved: 10 },
  { introduced: 6, resolved: 14 },
  { introduced: 3, resolved: 11 },
  { introduced: 5, resolved: 13 },
  { introduced: 2, resolved: 9 },
];

const WEEK_MAX = Math.max(
  ...WEEKS.flatMap((week) => [week.introduced, week.resolved])
);

function screenCount(counts: Record<Impact, number>, filter: Filter) {
  if (filter === "all") {
    return IMPACTS.reduce((sum, impact) => sum + counts[impact], 0);
  }
  return counts[filter];
}

/**
 * A working miniature of the accessibility guild's dashboard, rebuilt
 * from this site's own primitives. The numbers are demonstration
 * data; the interactions — impact filtering, per-screen ranking,
 * introduced-versus-resolved momentum — are the real thing.
 */
export function A11yDashboard() {
  const [filter, setFilter] = useState<Filter>("all");

  const totals = SCREENS.map((screen) => ({
    route: screen.route,
    count: screenCount(screen.counts, filter),
  }));
  const open = totals.reduce((sum, screen) => sum + screen.count, 0);
  const max = Math.max(1, ...totals.map((screen) => screen.count));

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="mono-label text-ink-muted">
          Violations by screen · <span className="text-accent">live</span>
        </p>
        <p className="mono-label tabular-nums text-ink-muted">
          <TextMorph as="span">{String(open)}</TextMorph> open ·{" "}
          {filter === "all" ? "all impacts" : filter}
        </p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Filter by impact">
        {(["all", ...IMPACTS] as Filter[]).map((impact) => (
          <li key={impact}>
            <Chip
              as="button"
              type="button"
              active={filter === impact}
              onClick={() => setFilter(impact)}
            >
              {impact}
            </Chip>
          </li>
        ))}
      </ul>

      <ul className="mt-5 space-y-2.5">
        {totals.map((screen) => (
          <li key={screen.route} className="grid grid-cols-[minmax(0,11rem)_1fr_2ch] items-center gap-3">
            <span className="mono-label truncate text-ink-muted">{screen.route}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-line/60">
              <span
                className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
                style={{ width: `${(screen.count / max) * 100}%` }}
              />
            </span>
            <span className="mono-label tabular-nums text-right">
              <TextMorph as="span">{String(screen.count)}</TextMorph>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
        <div>
          <p className="mono-label text-ink-muted">Momentum · last 12 weeks</p>
          <svg
            width={WEEKS.length * 13 - 4}
            height={30}
            className="mt-2 block"
            role="img"
            aria-label="Violations introduced versus resolved per week; resolved now outpaces introduced"
          >
            {WEEKS.map((week, i) => {
              const introducedHeight = Math.max(2, (week.introduced / WEEK_MAX) * 28);
              const resolvedHeight = Math.max(2, (week.resolved / WEEK_MAX) * 28);
              return (
                <g key={i}>
                  <title>{`Week ${i + 1} · ${week.introduced} introduced · ${week.resolved} resolved`}</title>
                  <rect x={i * 13} y={30 - introducedHeight} width={4} height={introducedHeight} rx={1} className="fill-ink-muted/50" />
                  <rect x={i * 13 + 5} y={30 - resolvedHeight} width={4} height={resolvedHeight} rx={1} className="fill-accent" />
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mono-label text-ink-muted">
          <span className="mr-1 inline-block h-2 w-2 rounded-[2px] bg-ink-muted/50" aria-hidden="true" />{" "}
          introduced
          <span className="ml-4 mr-1 inline-block h-2 w-2 rounded-[2px] bg-accent" aria-hidden="true" />{" "}
          resolved
        </p>
      </div>
    </Card>
  );
}
