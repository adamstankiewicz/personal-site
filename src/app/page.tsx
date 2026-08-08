import { About } from "@/components/about/about";
import { Atmosphere } from "@/components/atmosphere";
import { Experience } from "@/components/experience";
import { HeroName } from "@/components/hero-name";
import { Lab } from "@/components/lab";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

function TitleBlock() {
  return (
    <section className="hero relative pt-20 sm:pt-28" aria-label="Introduction">
      <Atmosphere />
      <div aria-hidden="true" className="rise rise-1 h-0.5 w-10 bg-accent" />
      <p className="rise rise-1 mono-label mt-6 text-ink-muted">
        Product engineering · Design systems · Accessibility
      </p>
      <HeroName />
      <p className="rise rise-3 mt-8 max-w-2xl text-[1.1875rem] leading-[1.6] text-ink-muted sm:text-[1.3125rem]">
        Product engineer on the surface, design systems engineer
        underneath. I care that everything a team ships feels like one
        person made it.
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
            at edX / 2U, 2018–2025
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

function Contact() {
  return (
    <section
      aria-label="Contact"
      className="relative border-t border-line pb-24 pt-16 sm:pb-32 sm:pt-20"
    >
      <Atmosphere flip />
      <p className="mono-label text-ink-muted">Get in touch</p>
      <p className="mt-5 max-w-xl text-[1.0625rem] leading-[1.7] text-ink-muted">
        Building something that needs both the product and the platform?
      </p>
      <a
        href="mailto:agstanki@gmail.com"
        className="contact-link display-title mt-6 inline-block text-[clamp(1.75rem,5.5vw,4.25rem)]"
      >
        agstanki@gmail.com
        <span aria-hidden="true" className="contact-arrow"> ↗</span>
      </a>
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
      <Lab />
      <Contact />
    </>
  );
}
