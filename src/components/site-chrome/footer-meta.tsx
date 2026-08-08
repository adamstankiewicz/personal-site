"use client";

import { useEffect, useState } from "react";
import { TextMorph } from "torph/react";
import rawGhStats from "@/generated/gh-stats.json";

const GITHUB_USER = "adamstankiewicz";

// build-gh-stats.mjs writes one of two shapes: the full counts when a
// token was available, or an all-null fallback. The generated JSON's
// inferred type is whichever shape was last baked locally, so widen it
// here — otherwise a tokenless CI bake would fail the type check.
interface GhStats {
  opened: number | null;
  reviewed: number | null;
  scope: string | null;
  years: { y: number; opened: number }[];
}
const bakedGhStats: GhStats = rawGhStats;

// Narrow the two shapes once: non-null when the bake had full scope.
const bakedCounts =
  bakedGhStats.scope === "all" &&
  bakedGhStats.opened !== null &&
  bakedGhStats.reviewed !== null
    ? { opened: bakedGhStats.opened, reviewed: bakedGhStats.reviewed }
    : null;

/**
 * Aggregate GitHub leverage: PRs opened, and others' PRs reviewed.
 * Baked at build time when an org-authorized token is available
 * (covers private work, labeled "across GitHub"); otherwise fetched
 * client-side unauthenticated (public work only, labeled so), cached
 * per session, and silently absent if the API is unavailable.
 */
export function GitHubStats() {
  const [stats, setStats] = useState<{ opened: number; reviewed: number } | null>(
    null
  );

  const baked = bakedCounts !== null;

  useEffect(() => {
    if (baked) return;
    let cancelled = false;
    (async () => {
      try {
        const cached = sessionStorage.getItem("gh-pr-stats");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (!cancelled) setStats(parsed);
          return;
        }
      } catch {}
      const count = (query: string) =>
        fetch(
          `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`
        )
          .then((r) =>
            r.ok ? r.json() : Promise.reject(new Error(`GitHub API ${r.status}`))
          )
          .then((data) => data.total_count as number);
      try {
        const [opened, reviewed] = await Promise.all([
          count(`type:pr author:${GITHUB_USER}`),
          count(`type:pr reviewed-by:${GITHUB_USER} -author:${GITHUB_USER}`),
        ]);
        const next = { opened, reviewed };
        if (!cancelled) setStats(next);
        try {
          sessionStorage.setItem("gh-pr-stats", JSON.stringify(next));
        } catch {}
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [baked]);

  const display = bakedCounts
    ? { ...bakedCounts, label: "across GitHub" }
    : stats
      ? { ...stats, label: "public GitHub" }
      : null;

  if (!display) return null;

  // Yearly shape, leading empty years trimmed (pre-GitHub-flow work).
  const allYears = baked ? bakedGhStats.years : [];
  const firstActive = allYears.findIndex((year) => year.opened > 0);
  const years = firstActive >= 0 ? allYears.slice(firstActive) : [];
  const max = Math.max(1, ...years.map((year) => year.opened));
  // The sparkline's origin, made legible: "since 2014".
  const since = years[0]?.y;

  return (
    <>
      <p className="mono-label mt-3 text-ink-muted">
        <span className="whitespace-nowrap">
          {display.opened.toLocaleString()} PRs opened
        </span>{" "}
        ·{" "}
        <span className="whitespace-nowrap">
          {display.reviewed.toLocaleString()} reviewed
        </span>{" "}
        ·{" "}
        <span className="whitespace-nowrap">
          {display.label}
          {since ? ` since ${since}` : ""}
        </span>
      </p>
      {years.length > 1 ? (
        <svg
          width={years.length * 8 - 3}
          height={16}
          className="mt-2 inline-block"
          role="img"
          aria-label={`Pull requests opened per year, ${years[0].y} through ${years[years.length - 1].y}`}
        >
          {years.map((year, i) => {
            const barHeight = Math.max(1.5, (year.opened / max) * 16);
            return (
              <rect
                key={year.y}
                x={i * 8}
                y={16 - barHeight}
                width={5}
                height={barHeight}
                rx={1}
                className="fill-accent"
              />
            );
          })}
        </svg>
      ) : null}
    </>
  );
}

/** The footer clock reads Merrimack's wall time, ticking by the minute. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const read = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "America/New_York",
        })
      );
    read();
    const interval = setInterval(read, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <>Merrimack, New Hampshire</>;
  return (
    <>
      <span className="whitespace-nowrap">
        <TextMorph as="span">{time}</TextMorph> in
      </span>{" "}
      <span className="whitespace-nowrap">Merrimack, New Hampshire</span>
    </>
  );
}
