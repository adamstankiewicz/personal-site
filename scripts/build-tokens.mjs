#!/usr/bin/env node
/**
 * Generates src/styles/tokens.css from tokens/tokens.json (DTCG format).
 *
 *   node scripts/build-tokens.mjs           regenerate the CSS layer
 *   node scripts/build-tokens.mjs --check   fail if generated output drifts
 *                                           from source (used as a build gate)
 *
 * Semantic color tokens may carry a dark-mode value under
 * $extensions["dev.adamstankiewicz.dark"]; those emit into a `.dark` block.
 *
 * The generation logic is exported for tests (build-tokens.test.mjs);
 * only direct invocation touches the filesystem.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "tokens", "tokens.json");
const OUTPUT = join(root, "src", "styles", "tokens.css");

const DARK_EXTENSION = "dev.adamstankiewicz.dark";

// CSS custom property names, grouped by DTCG path prefix.
const VAR_NAME = {
  semantic: (key) => `--${key}`,
  font: (key) => `--font-${key}`,
  radius: (key) => `--radius-${key}`,
  duration: (key) => `--dur-${key}`,
  easing: (key) => `--ease-${key}`,
};

function isToken(node) {
  return node && typeof node === "object" && "$value" in node;
}

/** Generates the tokens.css contents for a DTCG token tree. */
export function generateCss(tokens) {
  function lookup(path) {
    const segments = path.split(".");
    let node = tokens;
    for (const segment of segments) {
      node = node?.[segment];
      if (node === undefined) {
        throw new Error(`Unresolvable token alias: {${path}}`);
      }
    }
    if (!isToken(node)) {
      throw new Error(`Alias {${path}} does not point to a token`);
    }
    return node;
  }

  function resolve(value, seen = new Set()) {
    if (typeof value !== "string") return value;
    return value.replace(/\{([^}]+)\}/g, (_, path) => {
      if (seen.has(path)) throw new Error(`Circular token alias: {${path}}`);
      // `seen` tracks only the current resolution chain, so two aliases
      // sharing a base (or one referenced twice) don't read as a cycle.
      seen.add(path);
      const resolved = resolve(lookup(path).$value, seen);
      seen.delete(path);
      return resolved;
    });
  }

  const light = [];
  const dark = [];
  for (const [group, namer] of Object.entries(VAR_NAME)) {
    for (const [key, token] of Object.entries(tokens[group] ?? {})) {
      if (!isToken(token)) continue;
      light.push(`  ${namer(key)}: ${resolve(token.$value)};`);
      const darkValue = token.$extensions?.[DARK_EXTENSION];
      if (darkValue !== undefined) {
        dark.push(`  ${namer(key)}: ${resolve(darkValue)};`);
      }
    }
  }

  return `/* GENERATED FILE — do not edit by hand.
 * Source of truth: tokens/tokens.json (DTCG format)
 * Regenerate: npm run tokens · Drift gate: npm run tokens:check
 */

:root {
${light.join("\n")}
}

.dark {
${dark.join("\n")}
}
`;
}

function main() {
  const tokens = JSON.parse(readFileSync(SOURCE, "utf8"));
  const css = generateCss(tokens);

  if (process.argv.includes("--check")) {
    let existing = "";
    try {
      existing = readFileSync(OUTPUT, "utf8");
    } catch {}
    if (existing !== css) {
      console.error(
        "tokens.css has drifted from tokens/tokens.json — run `npm run tokens` and commit the result."
      );
      process.exit(1);
    }
    console.log("tokens.css matches tokens/tokens.json");
  } else {
    writeFileSync(OUTPUT, css);
    console.log(`Wrote ${OUTPUT}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main();
}
