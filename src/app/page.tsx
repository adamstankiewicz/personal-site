import { About } from "@/components/about/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

const STATS = [
  { value: "8M+", label: "Users served today" },
  { value: "5.9M+", label: "npm downloads" },
  { value: "100M+", label: "Learners reached" },
  { value: "$15M", label: "ARR built, 0 → 1" },
];

function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-24" aria-label="Introduction">
      <p className="mono-label rise rise-1 text-accent">
        Senior Design Systems Engineer — MagicSchool AI
      </p>
      <h1 className="rise rise-2 mt-8 max-w-4xl font-serif text-[clamp(2.375rem,6.5vw,4.75rem)] font-light leading-[1.06] tracking-[-0.015em] [text-wrap:balance]">
        I build the <em className="font-normal">product</em> — and the{" "}
        <em className="font-normal">system</em> underneath it.
      </h1>

      <dl className="rise rise-3 mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label}>
            <dd className="stat-value">{stat.value}</dd>
            <dt className="mono-label mt-2 text-ink-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <dl className="rise rise-4 mt-16 grid gap-x-8 gap-y-6 border-t border-line pt-6 sm:grid-cols-2 lg:grid-cols-4">
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
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Research />
    </>
  );
}
