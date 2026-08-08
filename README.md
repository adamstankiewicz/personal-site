# adamstankiewicz.dev

Personal site of Adam Stankiewicz. Fully static Next.js 15 (App Router,
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

## Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `GH_STATS_TOKEN` | Netlify build environment | GitHub token used by `build-gh-stats.mjs` so the footer's PR counts include private-org work ("across GitHub"). Without it the script falls back to the local `gh` CLI's auth (dev machines), then to a client-side public-only fetch ("public GitHub"). Never commit a token; this is a public repository. |

Token guidance: a fine-grained PAT with **Pull requests: read** +
**Metadata: read** across the org's repositories (requires org approval),
or a classic PAT with `repo` scope authorized for the org via SSO. The
script only ever emits aggregate integers.

## Structure

- `src/app` — layout, page, theme-aware SVG favicon
- `src/components` — site chrome, hero, about, experience timeline,
  case studies + galleries + Spellbook replay, publications, lab
- `src/lib/section-scroll.ts` — nav scrolling that scroll-driven
  behaviors respect
- `tokens/` — DTCG design-token source of truth
- `public/` — images (with pre-sized `slides/` variants), video, PDFs
