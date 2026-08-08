import { About } from "@/components/about/about";
import { CompassRose } from "@/components/compass-rose";
import { RouteStrip } from "@/components/route-strip";
import { TerrainPlate } from "@/components/terrain-plate";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

function TitleBlock() {
  return (
    <section className="pt-14 sm:pt-20" aria-label="Introduction">
      <div className="rise rise-1 border-2 border-line-strong">
        {/* Edition strip */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-2.5 sm:px-8">
          <p className="mono-label text-ink-muted">
            Personal site · 2026 edition
          </p>
          <p className="mono-label text-ink-muted">
            Merrimack, New Hampshire
          </p>
        </div>

        {/* Name + compass */}
        <div className="flex flex-wrap items-center justify-between gap-8 px-5 py-8 sm:px-8 sm:py-10">
          <div className="min-w-0">
            <h1 className="rise rise-2 display-title text-[clamp(2.5rem,8vw,5.5rem)]">
              Adam
              <br />
              Stankiewicz
            </h1>
            <p className="rise rise-3 condensed-caps mt-5 text-[0.9375rem] text-ink-muted">
              Product engineering & design systems at MagicSchool AI
            </p>
            <p className="rise rise-3 mt-4 max-w-xl text-[1rem] leading-[1.65] text-ink-muted">
              I build the product, and the system underneath it.
            </p>
          </div>
          <div className="rise rise-3 shrink-0">
            <CompassRose />
          </div>
        </div>

        {/* The route so far, 2010 to now — each stop jumps to its details */}
        <div className="rise rise-4 border-t border-line">
          <RouteStrip />
        </div>
      </div>

      {/* A real view from the left seat, treated as part of the chart */}
      <TerrainPlate />

      {/* Flight-data strip */}
      <dl className="mt-10 grid gap-x-8 gap-y-6 pb-20 sm:grid-cols-2 sm:pb-24 lg:grid-cols-4">
        <div>
          <dt className="mono-label text-ink-muted">Focus</dt>
          <dd className="mt-2 text-[0.9375rem]">
            Product Engineering · Design Systems · AI Tooling · Accessibility
          </dd>
        </div>
        <div>
          <dt className="mono-label text-ink-muted">Currently</dt>
          <dd className="mt-2 text-[0.9375rem]">
            <a
              href="https://magicschool.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              MagicSchool AI
            </a>
            , since 2025
          </dd>
        </div>
        <div>
          <dt className="mono-label text-ink-muted">Previously</dt>
          <dd className="mt-2 text-[0.9375rem]">
            <a
              href="https://paragon-openedx-v22.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Paragon
            </a>{" "}
            at edX / 2U, 2018 — 2025
          </dd>
        </div>
        <div>
          <dt className="mono-label text-ink-muted">Résumé</dt>
          <dd className="mt-2 text-[0.9375rem]">
            <a
              href="/pdfs/Adam_Stankiewicz_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Download PDF ↓
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <TitleBlock />
      <About />
      <Experience />
      <Projects />
      <Research />
    </>
  );
}
