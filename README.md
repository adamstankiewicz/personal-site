# adamstankiewicz.dev

Personal site of Adam Stankiewicz. Fully static Next.js 16 (App Router,
`output: "export"`), React 19, Tailwind v4, self-hosted fonts via
`next/font`, served from Netlify.

## Commands

```bash
npm run dev        # design tokens + build info + GitHub stats, then next dev
npm run build      # token drift gate + build info + GitHub stats, then export to out/
npm run typecheck  # tsc --noEmit
```

## Build pipeline

Three zero-dependency scripts run before Next:

- `scripts/build-tokens.mjs` — generates `src/styles/tokens.css` from the
  DTCG source `tokens/tokens.json`. `npm run tokens:check` is a drift
  gate: the build fails if the generated CSS diverges from source.
- `scripts/build-info.mjs` — bakes version (`2.0.<commit count>`), short
  SHA, and last-commit date into `src/generated/build-info.json` for the
  living-document footer.
- `scripts/build-gh-stats.mjs` — bakes aggregate GitHub PR counts (and a
  per-year series) into `src/generated/gh-stats.json`. See below.

`src/generated/` is gitignored; everything in it is derived at build time.
A `postinstall` hook generates it on `npm install`, so typecheck and lint
work on a fresh clone.

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_CF_BEACON_TOKEN` | `netlify.toml` (public by design — it ships in the page source) | Cloudflare Web Analytics beacon token (free, cookieless). Absent → the site ships no analytics script at all. |
| `GH_STATS_TOKEN` | Netlify build environment | GitHub token used by `build-gh-stats.mjs` so the footer's PR counts include private-org work ("across GitHub"). Without it the script falls back to the local `gh` CLI's auth (dev machines), then to a client-side public-only fetch ("public GitHub"). Never commit a token; this is a public repository. `data/gh-stats-floor.json` is a committed high-water mark the bake merges with: counts only ever ratchet up, so a token that later loses private-org visibility cannot shrink the recorded history. |

Token guidance: a fine-grained PAT with **Pull requests: read** +
**Metadata: read** across the org's repositories (requires org approval),
or a classic PAT with `repo` scope authorized for the org via SSO. The
script only ever emits aggregate integers.

## Design system

The site is its own small design system, layered the way the big ones
are — each layer only speaks to the one below it:

1. **Tokens** — `tokens/tokens.json` (DTCG). Semantic colors carry
   mode variants as `$extensions`: `dark`, and `hc` / `dark-hc` for
   high contrast. `scripts/build-tokens.mjs` generates
   `src/styles/tokens.css` — `:root`, `.dark`, a
   `@media (prefers-contrast: more)` block, and matching `.hc` /
   `.dark.hc` classes for the header's contrast toggle — and a drift
   gate keeps source and output in lockstep. Four modes, one source
   file.
2. **Theme** — Tailwind v4's `@theme` (in `src/styles/app.css`) maps
   the generated custom properties into utilities, so every utility
   class composes token values, never raw hex.
3. **Recipes** — recurring typographic and interactive patterns are
   named classes in `app.css` (`mono-label`, `title-md`, `mono-link`,
   `key-hint`, …) rather than repeated utility strings.
4. **Primitives** — `src/components/ui/` holds the components that
   earn their place through behavior or structure: `ExternalLink`
   (the `noopener` invariant, encoded once), `Card` (the one bordered
   surface), `Chip` (tags and switches), `Kbd`, `SectionHeader`, and
   `PrintPhoto` (the cursor-tracked sheen). Pure typography stays in
   the recipe layer on purpose — a component that only applies a class
   would take semantic freedom away from the markup without adding
   anything.
5. **Sections** — each page section is a folder under
   `src/components`, with prose and data split into `data.ts` so the
   component files stay purely structural.

There's deliberately no component-library dependency (no shadcn, no
Radix). For a design systems engineer's personal site, assembling
prebuilt components would demonstrate assembly; this repo is meant to
demonstrate authorship. Every component here is inspectable to the
bottom of its stack, the native platform (`<dialog>`, View
Transitions, `scroll-snap`) covers what a library would otherwise
abstract, and the dependency count stays honest: React, Next, and two
tiny animation/shader libraries.

## Structure

- `src/app` — layout, page, theme-aware SVG favicon
- `src/components` — site chrome, hero, about, experience timeline,
  case studies + galleries + Spellbook replay, publications, lab
- `src/components/ui` — shared primitives
- `src/lib/hooks.ts` — media-query, theme, and idle-mount hooks
- `src/lib/section-scroll.ts` — nav scrolling that scroll-driven
  behaviors respect
- `tokens/` — DTCG design-token source of truth
- `public/` — images (with pre-sized `slides/` variants), video, PDFs
