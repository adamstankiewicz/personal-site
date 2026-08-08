import { About } from "@/components/about";
import { Atmosphere } from "@/components/atmosphere";
import { Experience } from "@/components/experience";
import { HeroName } from "@/components/hero-name";
import { Lab } from "@/components/lab";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";
import { ExternalIcon, ExternalLink } from "@/components/ui/external-link";

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
        underneath: the features people use, and the components, design
        tokens, and tooling they’re built from.
      </p>

      {/* One quiet line instead of a spec sheet. */}
      <p className="rise rise-4 mono-label mt-14 border-t border-line pb-20 pt-6 text-ink-muted sm:pb-24">
        {/* Segments hold together; narrow screens wrap only at the
            separators instead of mid-phrase. */}
        <span className="whitespace-nowrap">
          <ExternalLink
            href="https://magicschool.ai"
            className="mono-link !text-ink hover:!text-accent"
          >
            MagicSchool AI
          </ExternalLink>
          , since 2025
        </span>{" "}
        · <span className="whitespace-nowrap">previously edX / 2U</span> ·{" "}
        <ExternalLink
          href="/pdfs/Adam_Stankiewicz_Resume.pdf"
          className="mono-link whitespace-nowrap !text-ink hover:!text-accent"
        >
          Résumé ↓
        </ExternalLink>
      </p>
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
        Always glad to talk product engineering, design systems, or work
        that needs both.
      </p>
      <a
        href="mailto:agstanki@gmail.com"
        className="contact-link display-title mt-6 inline-block text-[clamp(1.75rem,5.5vw,4.25rem)]"
      >
        agstanki@gmail.com
        <ExternalIcon className="contact-arrow" />
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
