"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CommandMenu, type Command } from "@/components/command-menu";
import { ProgressRail } from "@/components/progress-rail";
import { prefersReducedMotion, useHighContrast } from "@/lib/hooks";
import { scrollToSection } from "@/lib/section-scroll";
import { GitHubStats, LocalTime } from "./footer-meta";
import buildInfo from "@/generated/build-info.json";
import { ExternalIcon, ExternalLink } from "@/components/ui/external-link";
import { Kbd } from "@/components/ui/kbd";

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

function applyContrast() {
  const hc = document.documentElement.classList.toggle("hc");
  try {
    localStorage.setItem("contrast", hc ? "high" : "normal");
  } catch {}
}

// Mode changes sweep across the page like a day/night terminator,
// when the browser supports view transitions and motion is welcome.
function withWipe(apply: () => void) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    apply();
    return;
  }
  document.startViewTransition(apply);
}

const toggleTheme = () => withWipe(applyTheme);
const toggleContrast = () => withWipe(applyContrast);

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

// High contrast, on demand: the same token variants the OS preference
// activates, wired to a visible control so the mode is inspectable.
function ContrastToggle() {
  const hc = useHighContrast();
  return (
    <button
      type="button"
      onClick={toggleContrast}
      className="mono-link nav-link -my-2 cursor-pointer py-2"
      aria-pressed={hc}
      aria-label="Toggle high contrast"
    >
      <span className="theme-glyph" aria-hidden="true">
        ◉
      </span>
      <span className="ml-1.5 hidden md:inline">Contrast</span>
    </button>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...NAV_ITEMS.map((item, index) => ({
        id: `nav-${item.id}`,
        label: `Go to ${item.label}`,
        group: "Navigate" as const,
        hint: `§ ${String(index + 1).padStart(2, "0")}`,
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
        id: "contrast",
        label: "Toggle high contrast",
        group: "Actions",
        hint: "a11y",
        run: toggleContrast,
      },
      {
        id: "resume",
        label: "Download résumé",
        group: "Actions",
        hint: "pdf",
        run: () => window.open("/pdfs/Adam_Stankiewicz_Resume.pdf", "_blank", "noopener,noreferrer"),
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
        hint: <ExternalIcon />,
        run: () => window.open("https://github.com/adamstankiewicz", "_blank", "noopener,noreferrer"),
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        group: "Elsewhere",
        hint: <ExternalIcon />,
        run: () => window.open("https://linkedin.com/in/stankiewiczadam", "_blank", "noopener,noreferrer"),
      },
      {
        id: "scholar",
        label: "Google Scholar",
        group: "Elsewhere",
        hint: <ExternalIcon />,
        run: () =>
          window.open(
            "https://scholar.google.com/citations?user=lJSHz8QAAAAJ",
            "_blank",
            "noopener,noreferrer"
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
            <ContrastToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="mono-link -my-2 hidden cursor-pointer items-baseline gap-1.5 py-2 sm:flex"
            >
              <Kbd>⌘K</Kbd>
              <span className="sr-only">opens the command menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">{children}</main>

      <footer className="border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <p className="mono-label text-ink-muted">Elsewhere</p>
              <ul className="mt-2">
                <li>
                  <ExternalLink href="https://github.com/adamstankiewicz" className="mono-link inline-block py-1.5" icon>
                    GitHub
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://linkedin.com/in/stankiewiczadam" className="mono-link inline-block py-1.5" icon>
                    LinkedIn
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://scholar.google.com/citations?user=lJSHz8QAAAAJ" className="mono-link inline-block py-1.5" icon>
                    Google Scholar
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="/pdfs/Adam_Stankiewicz_Resume.pdf" className="mono-link inline-block py-1.5">
                    Résumé ↓
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href="https://github.com/adamstankiewicz/personal-site"
                    className="mono-link inline-block py-1.5"
                    icon
                  >
                    View source
                  </ExternalLink>
                </li>
              </ul>
            </div>
            <div className="sm:text-right">
              <p className="mono-label text-ink-muted">
                v{buildInfo.version} ·{" "}
                <ExternalLink
                  href={`https://github.com/adamstankiewicz/personal-site/commit/${buildInfo.commit}`}
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  {buildInfo.commit}
                </ExternalLink>
              </p>
              <p className="mono-label mt-3 text-ink-muted">
                Updated {buildInfo.updated} ·{" "}
                <ExternalLink
                  href="https://github.com/adamstankiewicz/personal-site/commits/master"
                  className="mono-link !text-inherit hover:!text-accent"
                  icon
                >
                  History
                </ExternalLink>
              </p>
              <p className="mono-label mt-3 text-ink-muted">
                <Kbd>⌘K</Kbd> for commands
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
                <ExternalLink
                  href="https://github.com/adamstankiewicz/personal-site/blob/master/tokens/tokens.json"
                  className="mono-link !text-inherit hover:!text-accent"
                  icon
                >
                  tokens.json
                </ExternalLink>{" "}
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
