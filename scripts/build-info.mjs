#!/usr/bin/env node
/**
 * Generates src/generated/build-info.json from git state at build time.
 * The footer reads it to report what version of the site you're looking
 * at — the "living document" line. Runs before dev and build; the
 * output is gitignored.
 */

import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src", "generated");
const OUTPUT = join(outDir, "build-info.json");

function git(args) {
  return execSync(`git ${args}`, { cwd: root, encoding: "utf8" }).trim();
}

let info;
try {
  const commitCount = git("rev-list --count HEAD");
  const commit = git("rev-parse --short HEAD");
  const commitDate = new Date(git("log -1 --format=%cI"));
  const updated = commitDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  info = { version: `2.0.${commitCount}`, commit, updated };
} catch {
  // Building outside a git checkout: fall back to an honest unknown.
  info = { version: "2.0.x", commit: "unknown", updated: "recently" };
}

mkdirSync(outDir, { recursive: true });
writeFileSync(OUTPUT, `${JSON.stringify(info, null, 2)}\n`);
console.log(`Wrote ${OUTPUT} (${info.version} @ ${info.commit})`);
