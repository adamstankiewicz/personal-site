import { About } from "@/components/about/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

function Hero() {
  return (
    <section className="pt-20 pb-16 sm:pt-28 sm:pb-20" aria-label="Introduction">
      <p className="mono-label rise rise-1 text-accent">
        Senior Design Systems Engineer — MagicSchool AI
      </p>
      <div className="inspect-box mt-8 max-w-4xl">
        <span
          className="inspect-chip -top-3 left-0"
          style={{ "--chip-delay": "0ms" } as React.CSSProperties}
          aria-hidden="true"
        >
          type/display · Newsreader opsz · 300 · lh 1.06 · tracking −0.015em
        </span>
        <h1 className="rise rise-2 font-serif text-[clamp(2.375rem,6.5vw,4.75rem)] font-light leading-[1.06] tracking-[-0.015em] [text-wrap:balance]">
          I build the <em className="font-normal">product</em> — and the{" "}
          <em className="font-normal">system</em> underneath it.
        </h1>
        <span
          className="inspect-chip -bottom-3 right-0"
          style={{ "--chip-delay": "80ms" } as React.CSSProperties}
          aria-hidden="true"
        >
          clamp(2.375rem → 4.75rem) · ital 1 on emphasis
        </span>
      </div>
      <div className="inspect-box mt-8 max-w-2xl">
        <span
          className="inspect-chip -top-3 left-0"
          style={{ "--chip-delay": "160ms" } as React.CSSProperties}
          aria-hidden="true"
        >
          type/body · 1.0625rem / 1.7 · ink-muted
        </span>
        <p className="rise rise-3 text-[1.0625rem] leading-[1.7] text-ink-muted">
          A decade across product engineering and design systems — 0→1
          enterprise platforms, frontend architecture, REST APIs,
          accessibility, and AI tooling that earns its rollout.
        </p>
      </div>

      <dl className="rise rise-3 mt-14 grid gap-x-8 gap-y-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
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
