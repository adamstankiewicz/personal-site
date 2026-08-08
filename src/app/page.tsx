import { About } from "@/components/about/about";
import { Experience } from "@/components/experience";
import { Projects } from "@/components/projects";
import { Research } from "@/components/research";

const STATS = [
  { value: "8M+", label: "Users served today" },
  { value: "5.9M+", label: "npm downloads" },
  { value: "100M+", label: "Learners reached" },
  { value: "5", label: "ACM publications" },
];

function CompassRose() {
  return (
    <svg
      viewBox="0 0 96 96"
      className="h-20 w-20 text-accent sm:h-24 sm:w-24"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="48" cy="48" r="34" />
        <circle cx="48" cy="48" r="26" strokeDasharray="2 4" />
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const isCardinal = i % 9 === 0;
          const r1 = isCardinal ? 28 : 31;
          const x1 = 48 + r1 * Math.sin(angle);
          const y1 = 48 - r1 * Math.cos(angle);
          const x2 = 48 + 34 * Math.sin(angle);
          const y2 = 48 - 34 * Math.cos(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      {/* North needle */}
      <path d="M48 10 L52 24 L48 21 L44 24 Z" fill="currentColor" />
      <text
        x="48"
        y="52"
        textAnchor="middle"
        fill="currentColor"
        style={{ font: "700 11px var(--font-mono)" }}
      >
        N
      </text>
    </svg>
  );
}

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
              Product engineer & design systems — MagicSchool AI
            </p>
            <p className="rise rise-3 mt-4 max-w-xl text-[1rem] leading-[1.65] text-ink-muted">
              I build the product, and the system underneath it.
            </p>
          </div>
          <div className="rise rise-3 shrink-0">
            <CompassRose />
          </div>
        </div>

        {/* Stats row */}
        <dl className="rise rise-4 grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`px-5 py-5 sm:px-8 ${i > 0 ? "border-l border-line" : ""} ${
                i >= 2 ? "max-lg:border-t max-lg:border-line" : ""
              } ${i === 2 ? "max-lg:border-l-0" : ""}`}
            >
              <dd className="stat-value">{stat.value}</dd>
              <dt className="mono-label mt-1.5 text-ink-muted">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* A real view from the left seat, treated as part of the chart */}
      <figure className="terrain-plate rise rise-4 mt-6">
        <img
          src="/images/flying/winnipesaukee.jpg"
          alt="Aerial view from a small plane over Lake Winnipesaukee, New Hampshire, in fall — the wing strut in frame, foliage and a runway below"
          width={2400}
          height={1800}
          decoding="async"
        />
        <svg
          className="terrain-plate-course"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M8 33 L38 21 L72 24 L94 8"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.45"
            strokeDasharray="2 1.2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <svg className="terrain-plate-course" viewBox="0 0 100 40" aria-hidden="true">
          <g fill="var(--paper)" stroke="currentColor" strokeWidth="0.5">
            <path d="M8 31.6 L9.4 34 L6.6 34 Z" />
            <path d="M94 6.6 L95.4 9 L92.6 9 Z" />
          </g>
        </svg>
        <figcaption className="terrain-plate-caption mono-label text-ink-muted">
          Over Lake Winnipesaukee, NH — from the left seat of my Cessna 172
        </figcaption>
      </figure>

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
