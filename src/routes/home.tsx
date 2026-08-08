import type { Route } from "./+types/home";
import { About } from "@/components/about/about";
import { Experience, loader as experienceLoader } from "@/components/experience";
import { Projects, loader as projectsLoader } from "@/components/projects";
import { Research } from "@/components/research";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adam Stankiewicz — Senior Design Systems Engineer" },
    {
      name: "description",
      content:
        "Design systems engineer building the platform around the design system — tokens, tooling, documentation, and accessibility. Senior Design Systems Engineer at MagicSchool AI; previously led Paragon at edX/2U.",
    },
  ];
}

export async function loader() {
  const [experiences, projects] = await Promise.all([
    experienceLoader(),
    projectsLoader(),
  ]);

  return {
    experiences: experiences.experiences,
    projects: projects.projects,
  };
}

function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-20" aria-label="Introduction">
      <p className="mono-label rise rise-1 text-accent">
        Senior Design Systems Engineer — MagicSchool AI
      </p>
      <h1 className="rise rise-2 mt-8 max-w-4xl font-serif text-[clamp(2.375rem,6.5vw,4.75rem)] font-light leading-[1.06] tracking-[-0.015em] [text-wrap:balance]">
        I work the seam between <em className="font-normal">design</em> and{" "}
        <em className="font-normal">engineering</em> — and measure what ships.
      </h1>
      <p className="rise rise-3 mt-8 max-w-2xl text-[1.0625rem] leading-[1.7] text-ink-muted">
        Design systems and the platforms around them, frontend architecture,
        REST APIs, accessibility, and AI tooling that earns its rollout with a
        controlled evaluation.
      </p>

      <dl className="rise rise-3 mt-14 grid gap-x-8 gap-y-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="mono-label text-ink-muted">Focus</dt>
          <dd className="mt-2 text-[0.9375rem]">
            Design Systems · Frontend & APIs · AI Tooling · Accessibility
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
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Research />
    </>
  );
}
