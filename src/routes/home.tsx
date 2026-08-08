import type { Route } from "./+types/home";
import { About } from "@/components/about/about";
import { Experience, loader as experienceLoader } from "@/components/experience";
import { Projects, loader as projectsLoader } from "@/components/projects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adam Stankiewicz — Principal Software Engineer" },
    {
      name: "description",
      content:
        "Principal Software Engineer specializing in design systems, frontend architecture, and accessible product engineering in the edtech space.",
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
        Principal Software Engineer — edX / 2U
      </p>
      <h1 className="rise rise-2 mt-8 max-w-4xl font-serif text-[clamp(2.375rem,6.5vw,4.75rem)] font-light leading-[1.06] tracking-[-0.015em]">
        I build <em className="font-normal">intuitive</em> web solutions that
        transform complex ideas into user&#8209;friendly,{" "}
        <em className="font-normal">accessible</em> products.
      </h1>

      <dl className="rise rise-3 mt-14 grid gap-x-8 gap-y-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="mono-label text-ink-muted">Focus</dt>
          <dd className="mt-2 text-[0.9375rem]">
            Design Systems · Frontend · Backend
          </dd>
        </div>
        <div>
          <dt className="mono-label text-ink-muted">Currently</dt>
          <dd className="mt-2 text-[0.9375rem]">
            <a href="https://edx.org" target="_blank" rel="noopener noreferrer" className="link">
              edX
            </a>{" "}
            /{" "}
            <a href="https://2u.com" target="_blank" rel="noopener noreferrer" className="link">
              2U
            </a>
            , since 2018
          </dd>
        </div>
        <div>
          <dt className="mono-label text-ink-muted">Maintains</dt>
          <dd className="mt-2 text-[0.9375rem]">
            <a
              href="https://paragon-openedx-v22.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Paragon
            </a>
            , Open edX design system
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
    </>
  );
}
