/**
 * High-water-mark merge for baked GitHub PR stats.
 *
 * The search API only counts what the current token can see, so losing
 * access to a private org would silently shrink history on the next
 * bake. Reality only ever grows — PRs opened in a past year stay
 * opened — so the committed floor (data/gh-stats-floor.json) acts as a
 * ratchet: fresh results win when they're higher, the floor holds when
 * visibility drops.
 */
export function mergeStats(fresh, floor) {
  if (!floor) return fresh;

  const maxCount = (a, b) =>
    a === null || a === undefined
      ? b ?? null
      : b === null || b === undefined
        ? a
        : Math.max(a, b);

  const freshYears = new Map((fresh.years ?? []).map((e) => [e.y, e.opened]));
  const floorYears = new Map((floor.years ?? []).map((e) => [e.y, e.opened]));
  const years = [...new Set([...floorYears.keys(), ...freshYears.keys()])]
    .sort((a, b) => a - b)
    .map((y) => ({ y, opened: maxCount(freshYears.get(y), floorYears.get(y)) }));

  return {
    opened: maxCount(fresh.opened, floor.opened),
    reviewed: maxCount(fresh.reviewed, floor.reviewed),
    // "all" is sticky: once any bake has seen the full scope, the
    // preserved numbers keep describing it.
    scope: fresh.scope === "all" || floor.scope === "all" ? "all" : fresh.scope,
    years,
  };
}
