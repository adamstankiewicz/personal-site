"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TextMorph } from "torph/react";
import { CommandMenu, type Command } from "@/components/command-menu";
import { ProgressRail } from "@/components/progress-rail";
import { scrollToSection } from "@/lib/section-scroll";
import buildInfo from "@/generated/build-info.json";
import bakedGhStats from "@/generated/gh-stats.json";

// Aggregate public-GitHub leverage: PRs opened, and others' PRs
// reviewed. Fetched client-side (unauthenticated, so private-org work
// is not counted — labeled accordingly), cached per session, and
// silently absent if the API is unavailable.
function GitHubStats() {
  const [stats, setStats] = useState<{ opened: number; reviewed: number } | null>(
    null
  );

  // Baked at build time with an org-authorized token when available;
  // covers private work too and skips the client fetch entirely.
  const baked =
    bakedGhStats.scope === "all" &&
    typeof bakedGhStats.opened === "number" &&
    typeof bakedGhStats.reviewed === "number";

  useEffect(() => {
    if (baked) return;
    try {
      const cached = sessionStorage.getItem("gh-pr-stats");
      if (cached) {
        setStats(JSON.parse(cached));
        return;
      }
    } catch {}
    const count = (q: string) =>
      fetch(
        `https://api.github.com/search/issues?q=${encodeURIComponent(q)}&per_page=1`
      )
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
        .then((d) => d.total_count as number);
    Promise.all([
      count("type:pr author:adamstankiewicz"),
      count("type:pr reviewed-by:adamstankiewicz -author:adamstankiewicz"),
    ])
      .then(([opened, reviewed]) => {
        const next = { opened, reviewed };
        setStats(next);
        try {
          sessionStorage.setItem("gh-pr-stats", JSON.stringify(next));
        } catch {}
      })
      .catch(() => {});
  }, [baked]);

  const display = baked
    ? {
        opened: bakedGhStats.opened as number,
        reviewed: bakedGhStats.reviewed as number,
        label: "across GitHub",
      }
    : stats
      ? { ...stats, label: "public GitHub" }
      : null;

  if (!display) return null;

  // Yearly shape, leading empty years trimmed (pre-GitHub-flow work).
  const allYears = baked ? (bakedGhStats.years ?? []) : [];
  const firstActive = allYears.findIndex((y) => y.opened > 0);
  const years = firstActive >= 0 ? allYears.slice(firstActive) : [];
  const max = Math.max(1, ...years.map((y) => y.opened));

  return (
    <>
      <p className="mono-label mt-3 text-ink-muted">
        {display.opened.toLocaleString()} PRs opened ·{" "}
        {display.reviewed.toLocaleString()} reviewed · {display.label}
      </p>
      {years.length > 1 ? (
        <svg
          width={years.length * 8 - 3}
          height={16}
          className="mt-2 inline-block"
          role="img"
          aria-label={`Pull requests opened per year, ${years[0].y} through ${years[years.length - 1].y}`}
        >
          {years.map((d, i) => {
            const h = Math.max(1.5, (d.opened / max) * 16);
            return (
              <rect
                key={d.y}
                x={i * 8}
                y={16 - h}
                width={5}
                height={h}
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

// The footer clock reads Merrimack's wall time, ticking by the minute.
function LocalTime() {
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
      <TextMorph as="span">{time}</TextMorph> in Merrimack, New Hampshire
    </>
  );
}

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "route", label: "Experience" },
  { id: "work", label: "Work" },
  { id: "research", label: "Publications" },
  { id: "lab", label: "Lab" },
];

const TOKENS = [
  { name: "paper", varName: "--paper" },
  { name: "raised", varName: "--paper-raised" },
  { name: "line", varName: "--line" },
  { name: "muted", varName: "--ink-muted" },
  { name: "ink", varName: "--ink" },
  { name: "accent", varName: "--accent" },
];

function applyTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

// Theme changes sweep across the page like a day/night terminator,
// when the browser supports view transitions and motion is welcome.
function toggleTheme() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    applyTheme();
    return;
  }
  document.startViewTransition(applyTheme);
}

function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mono-link nav-link -my-2 cursor-pointer py-2"
      aria-label="Toggle color theme"
    >
      <span className="theme-glyph" aria-hidden="true">
        ◐
      </span>
      <span className="ml-1.5 hidden md:inline">Theme</span>
    </button>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...NAV_ITEMS.map((item) => ({
        id: `nav-${item.id}`,
        label: `Go to ${item.label}`,
        group: "Navigate" as const,
        hint: `§ ${String(NAV_ITEMS.indexOf(item) + 1).padStart(2, "0")}`,
        run: () => scrollToSection(item.id),
      })),
      {
        id: "theme",
        label: "Toggle theme",
        group: "Actions",
        hint: "light / dark",
        run: toggleTheme,
      },
      {
        id: "resume",
        label: "Download résumé",
        group: "Actions",
        hint: "pdf",
        run: () => window.open("/pdfs/Adam_Stankiewicz_Resume.pdf", "_blank"),
      },
      {
        id: "email",
        label: "Copy email address",
        group: "Actions",
        hint: "@",
        run: () => {
          navigator.clipboard?.writeText("agstanki@gmail.com");
        },
      },
      {
        id: "github",
        label: "GitHub",
        group: "Elsewhere",
        hint: "↗",
        run: () => window.open("https://github.com/adamstankiewicz", "_blank"),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        group: "Elsewhere",
        hint: "↗",
        run: () => window.open("https://linkedin.com/in/stankiewiczadam", "_blank"),
      },
      {
        id: "scholar",
        label: "Google Scholar",
        group: "Elsewhere",
        hint: "↗",
        run: () =>
          window.open(
            "https://scholar.google.com/citations?user=lJSHz8QAAAAJ",
            "_blank"
          ),
      },
    ],
    []
  );

  // Global keyboard: ⌘K opens the command menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the section in view: the nav and the progress rail follow it.
  useEffect(() => {
    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <CommandMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        commands={commands}
      />
      <ProgressRail sections={NAV_ITEMS} activeSection={activeSection} />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-y-3 px-6 py-5">
          <Link
            href="/"
            className="mono-label !text-ink no-underline transition-colors hover:!text-accent"
            aria-label="Adam Stankiewicz, home"
          >
            {/* Squeeze the window: the wordmark folds down to a monogram. */}
            <span className="hidden sm:inline" aria-hidden="true">
              Adam Stankiewicz
            </span>
            <span className="sm:hidden" aria-hidden="true">
              AS<span className="text-accent">.</span>
            </span>
          </Link>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:gap-x-6">
            <nav aria-label="Main navigation" className="flex flex-wrap items-baseline gap-x-5 gap-y-2 sm:gap-x-6">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.replaceState(null, "", `#${item.id}`);
                    scrollToSection(item.id);
                  }}
                  className="mono-link nav-link -my-2 inline-block py-2"
                  data-active={activeSection === item.id}
                  aria-current={activeSection === item.id ? "true" : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="mono-link -my-2 hidden cursor-pointer items-baseline gap-1.5 py-2 sm:flex"
            >
              <kbd className="key-hint">⌘K</kbd>
              <span className="sr-only">opens the command menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">{children}</main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              <p className="mono-label text-ink-muted">Colophon</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                Set in <span className="font-display text-ink">Bricolage Grotesque</span>,{" "}
                <span className="text-ink">Archivo</span>, and{" "}
                <span className="font-mono text-[0.8125rem] text-ink">IBM Plex Mono</span>,
                self-hosted. Statically rendered with Next.js, styled with
                Tailwind, served from Netlify’s CDN.{" "}
                <a
                  href="https://github.com/adamstankiewicz/personal-site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  View source ↗
                </a>
              </p>
            </div>
            <div>
              <p className="mono-label text-ink-muted">Elsewhere</p>
              <ul className="mt-2">
                <li>
                  <a href="https://github.com/adamstankiewicz" target="_blank" rel="noopener noreferrer" className="mono-link inline-block py-1.5">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/stankiewiczadam" target="_blank" rel="noopener noreferrer" className="mono-link inline-block py-1.5">
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a href="https://scholar.google.com/citations?user=lJSHz8QAAAAJ" target="_blank" rel="noopener noreferrer" className="mono-link inline-block py-1.5">
                    Google Scholar ↗
                  </a>
                </li>
                <li>
                  <a href="/pdfs/Adam_Stankiewicz_Resume.pdf" target="_blank" rel="noopener noreferrer" className="mono-link inline-block py-1.5">
                    Résumé ↓
                  </a>
                </li>
              </ul>
            </div>
            <div className="sm:text-right">
              <p className="mono-label text-ink-muted">
                v{buildInfo.version} ·{" "}
                <a
                  href={`https://github.com/adamstankiewicz/personal-site/commit/${buildInfo.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  {buildInfo.commit}
                </a>
              </p>
              <p className="mono-label mt-3 text-ink-muted">
                Updated {buildInfo.updated} ·{" "}
                <a
                  href="https://github.com/adamstankiewicz/personal-site/commits/master"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  History ↗
                </a>
              </p>
              <p className="mono-label mt-3 text-ink-muted">
                <kbd className="key-hint">⌘K</kbd> for commands
              </p>
              <p className="mono-label mt-3 text-ink-muted">
                <LocalTime />
              </p>
              <GitHubStats />
            </div>
          </div>

          {/* The site's own design tokens, resolved live from CSS variables. */}
          <div className="mt-12 border-t border-line pt-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="mono-label text-ink-muted">
                Design tokens · generated from{" "}
                <a
                  href="https://github.com/adamstankiewicz/personal-site/blob/master/tokens/tokens.json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  tokens.json ↗
                </a>{" "}
                (DTCG)
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {TOKENS.map((token) => (
                  <li key={token.name} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-3.5 w-3.5 border border-line"
                      style={{ background: `var(${token.varName})` }}
                    />
                    <span className="mono-label text-ink-muted">{token.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
