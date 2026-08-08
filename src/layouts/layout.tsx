import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

const NAV_ITEMS = [
  { href: "/#about", label: "About" },
  { href: "/#index", label: "Index" },
  { href: "/#work", label: "Work" },
];

function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const dark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="mono-link cursor-pointer"
      aria-label="Toggle color theme"
    >
      {/* Same glyph server/client until mounted; content is theme-agnostic */}
      <span aria-hidden="true">◐</span>
      <span className="ml-1.5 hidden sm:inline">{mounted ? "Theme" : "Theme"}</span>
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

export default function Layout() {
  const [gridVisible, setGridVisible] = useState(false);

  // Press "g" anywhere to toggle the baseline grid — a small tell that the
  // page itself is set on one.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "g" || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      setGridVisible((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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

      <header className="border-b border-line">
        <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between px-6 py-5">
          <Link to="/" className="mono-label !text-ink no-underline transition-colors hover:!text-accent">
            Adam Stankiewicz
          </Link>
          <div className="flex items-baseline gap-6">
            <nav aria-label="Main navigation" className="hidden items-baseline gap-6 sm:flex">
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} className="mono-link">
                  {item.label}
                </a>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        <Outlet />
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
          <div>
            <p className="mono-label text-ink-muted">Colophon</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Set in{" "}
              <span className="italic text-ink">Newsreader</span> and{" "}
              <span className="font-mono text-[0.8125rem] text-ink">Geist Mono</span>.
              Built with React Router, styled with Tailwind, deployed on Netlify.
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
              Press <kbd className="text-accent">G</kbd> for grid
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
