#!/usr/bin/env node
/**
 * Bakes aggregate GitHub PR counts into src/generated/gh-stats.json at
 * build time. With GH_STATS_TOKEN set (a PAT authorized for private
 * orgs), the counts cover everything the token can see and scope is
 * "all"; without it, the file records nulls and the footer falls back
 * to its client-side public-only fetch. Fails soft: a network error
 * never breaks the build.
 */

import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mergeStats } from "./gh-stats-merge.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src", "generated");
const OUTPUT = join(outDir, "gh-stats.json");
// Committed high-water mark: a fresh bake can only raise these numbers,
// so losing visibility into a private org later (a token that no longer
// sees a former employer's repos) can't shrink the recorded history.
const FLOOR = join(root, "data", "gh-stats-floor.json");

const USER = "adamstankiewicz";

// Token order: explicit env var (CI), then the local gh CLI's auth
// (dev machines), then none.
function resolveToken() {
  if (process.env.GH_STATS_TOKEN) return process.env.GH_STATS_TOKEN;
  try {
    return execSync("gh auth token", { encoding: "utf8", timeout: 5000 }).trim();
  } catch {
    return undefined;
  }
}

const token = resolveToken();

async function count(query) {
  const res = await fetch(
    `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    {
      headers: {
        "user-agent": "adamstankiewicz.dev build",
        accept: "application/vnd.github+json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(10_000),
    }
  );
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  return data.total_count;
}

function readFloor() {
  try {
    return JSON.parse(readFileSync(FLOOR, "utf8"));
  } catch {
    return null;
  }
}

// Reuse a fresh bake (< 24h) so dev restarts don't hammer the API —
// still merged against the floor, in case a pull raised it since.
try {
  const existing = JSON.parse(readFileSync(OUTPUT, "utf8"));
  const ageMs = Date.now() - statSync(OUTPUT).mtimeMs;
  if (existing.scope === "all" && existing.years?.length && ageMs < 86_400_000) {
    const remerged = mergeStats(existing, readFloor());
    if (JSON.stringify(remerged) !== JSON.stringify(existing)) {
      writeFileSync(OUTPUT, `${JSON.stringify(remerged, null, 2)}\n`);
    }
    console.log(`Reusing ${OUTPUT} (${Math.round(ageMs / 3_600_000)}h old)`);
    process.exit(0);
  }
} catch {}

const FIRST_YEAR = 2010;
let stats = { opened: null, reviewed: null, scope: null, years: [] };
if (token) {
  try {
    const [opened, reviewed] = await Promise.all([
      count(`type:pr author:${USER}`),
      count(`type:pr reviewed-by:${USER} -author:${USER}`),
    ]);
    // Yearly series, sequential to stay friendly to the search limit.
    const years = [];
    const now = new Date().getFullYear();
    for (let y = FIRST_YEAR; y <= now; y++) {
      years.push({
        y,
        opened: await count(
          `type:pr author:${USER} created:${y}-01-01..${y}-12-31`
        ),
      });
      await new Promise((r) => setTimeout(r, 150));
    }
    stats = { opened, reviewed, scope: "all", years };
  } catch (error) {
    console.warn(`gh-stats: ${error.message} — footer will use client fallback`);
  }
} else {
  console.log("gh-stats: no GH_STATS_TOKEN — footer will use client fallback");
}

const floor = readFloor();
const merged = mergeStats(stats, floor);

mkdirSync(outDir, { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(merged, null, 2)}\n`);
console.log(`Wrote ${OUTPUT} (${merged.scope ?? "fallback"})`);

// Ratchet the committed floor upward on full-scope bakes (local builds;
// commit the change). CI writes are ephemeral, which is fine — the
// merge above is what protects CI output.
if (merged.scope === "all" && JSON.stringify(merged) !== JSON.stringify(floor)) {
  mkdirSync(dirname(FLOOR), { recursive: true });
  writeFileSync(FLOOR, `${JSON.stringify(merged, null, 2)}\n`);
  console.log(`Ratcheted ${FLOOR}`);
}
