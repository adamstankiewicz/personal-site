"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CommandMenu, type Command } from "@/components/command-menu";

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "index", label: "Index" },
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
];

const TOKENS = [
  { name: "paper", varName: "--paper" },
  { name: "raised", varName: "--paper-raised" },
  { name: "line", varName: "--line" },
  { name: "muted", varName: "--ink-muted" },
  { name: "ink", varName: "--ink" },
  { name: "accent", varName: "--accent" },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

function toggleInspect() {
  const root = document.documentElement;
  root.dataset.inspect = root.dataset.inspect === "true" ? "false" : "true";
}

function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="mono-link nav-link cursor-pointer"
      aria-label="Toggle color theme"
    >
      <span className="theme-glyph" aria-hidden="true">
        ◐
      </span>
      <span className="ml-1.5 hidden md:inline">Theme</span>
    </button>
  );
}

function GridOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="grid-overlay" aria-hidden="true">
      <div className="grid-overlay-columns">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
    </div>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const [gridVisible, setGridVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        id: "inspect",
        label: "Toggle inspect mode",
        group: "Actions",
        hint: "i",
        run: toggleInspect,
      },
      {
        id: "grid",
        label: "Toggle baseline grid",
        group: "Actions",
        hint: "g",
        run: () => setGridVisible((v) => !v),
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

  // Global keyboard: ⌘K command menu, "g" grid, "i" inspect.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen((v) => !v);
        return;
      }
      if (menuOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (e.key === "g") setGridVisible((v) => !v);
      if (e.key === "i") toggleInspect();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal-on-scroll for anything marked data-reveal.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <GridOverlay visible={gridVisible} />
      <CommandMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        commands={commands}
      />

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-y-3 px-6 py-5">
          <Link
            href="/"
            className="mono-label !text-ink no-underline transition-colors hover:!text-accent"
          >
            Adam Stankiewicz
          </Link>
          <div className="flex items-baseline gap-5 sm:gap-6">
            <nav aria-label="Main navigation" className="flex items-baseline gap-5 sm:gap-6">
              {NAV_ITEMS.map((item) => (
                <a key={item.id} href={`/#${item.id}`} className="mono-link nav-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="mono-link hidden cursor-pointer items-baseline gap-1.5 sm:flex"
              aria-label="Open command menu"
            >
              <kbd className="key-hint">⌘K</kbd>
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
                Set in <span className="italic text-ink">Newsreader</span> and{" "}
                <span className="font-mono text-[0.8125rem] text-ink">Geist Mono</span>,
                self-hosted. Statically rendered with Next.js, styled with
                Tailwind, served from Netlify's CDN.{" "}
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
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="https://github.com/adamstankiewicz" target="_blank" rel="noopener noreferrer" className="mono-link">
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/stankiewiczadam" target="_blank" rel="noopener noreferrer" className="mono-link">
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a href="https://scholar.google.com/citations?user=lJSHz8QAAAAJ" target="_blank" rel="noopener noreferrer" className="mono-link">
                    Google Scholar ↗
                  </a>
                </li>
                <li>
                  <a href="/pdfs/Adam_Stankiewicz_Resume.pdf" target="_blank" rel="noopener noreferrer" className="mono-link">
                    Résumé ↓
                  </a>
                </li>
              </ul>
            </div>
            <div className="sm:text-right">
              <p className="mono-label text-ink-muted">© {new Date().getFullYear()}</p>
              <p className="mono-label mt-3 text-ink-muted">
                <kbd className="key-hint">⌘K</kbd> commands ·{" "}
                <kbd className="key-hint">G</kbd> grid ·{" "}
                <kbd className="key-hint">I</kbd> inspect
              </p>
            </div>
          </div>

          {/* The site's own design tokens, resolved live from CSS variables. */}
          <div className="mt-12 border-t border-line pt-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p className="mono-label text-ink-muted">Tokens</p>
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
