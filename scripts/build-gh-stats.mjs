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
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src", "generated");
const OUTPUT = join(outDir, "gh-stats.json");

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

let stats = { opened: null, reviewed: null, scope: null };
if (token) {
  try {
    const [opened, reviewed] = await Promise.all([
      count(`type:pr author:${USER}`),
      count(`type:pr reviewed-by:${USER} -author:${USER}`),
    ]);
    stats = { opened, reviewed, scope: "all" };
  } catch (error) {
    console.warn(`gh-stats: ${error.message} — footer will use client fallback`);
  }
} else {
  console.log("gh-stats: no GH_STATS_TOKEN — footer will use client fallback");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(stats, null, 2)}\n`);
console.log(`Wrote ${OUTPUT} (${stats.scope ?? "fallback"})`);
