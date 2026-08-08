import { About } from "@/components/about/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

function TitleBlock() {
  return (
    <section className="pt-20 sm:pt-28" aria-label="Introduction">
      <div aria-hidden="true" className="rise rise-1 h-0.5 w-10 bg-accent" />
      <p className="rise rise-1 mono-label mt-6 text-ink-muted">
        Product engineering · Design systems · Accessibility
      </p>
      <h1 className="rise rise-2 display-title mt-6 text-[clamp(3.25rem,10vw,7.5rem)]">
        Adam
        <br />
        Stankiewicz
      </h1>
      <p className="rise rise-3 mt-8 max-w-2xl text-[1.1875rem] leading-[1.6] text-ink-muted sm:text-[1.3125rem]">
        I build the product, and the system underneath it. Currently at{" "}
        <a
          href="https://magicschool.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          MagicSchool AI
        </a>
        : tech lead on a product squad, steward of the Spellbook design
        system.
      </p>

      {/* Facts strip */}
      <dl className="rise rise-4 mt-14 grid gap-x-8 gap-y-6 border-t border-line pb-20 pt-8 sm:grid-cols-2 sm:pb-24 lg:grid-cols-4">
        <div>
          <dt className="mono-label text-ink-muted">Location</dt>
          <dd className="mt-2 text-[0.9375rem]">Merrimack, New Hampshire</dd>
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
