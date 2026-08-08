"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItemProps } from "./types";

const experiences: ExperienceItemProps[] = [
    {
      fix: "MAGIC",
      company: "MagicSchool AI",
      companyUrl: "https://magicschool.ai",
      period: "2025 — Present",
      positions: [
        { title: "Senior Design Systems Engineer", period: "2025 — Present" }
      ],
      description: "Tech lead on a product squad and steward of Spellbook, the design system behind an AI platform for K-12 educators serving ~8M people across 36,000 schools. Built the Spellbook MCP server so AI agents build with real components, rebuilt the token layer on DTCG, and led the accessibility work behind the company's first VPAT.",
      technologies: [
        'TypeScript', 'React', 'Next.js', 'Node.js', 'MCP',
        'DTCG Design Tokens', 'Tailwind', 'Playwright', 'axe-core',
        'LLM Evaluation'
      ],
    },
    {
      fix: "EDEXX",
      company: "edX / 2U",
      companyUrl: "https://edx.org",
      period: "2018 — 2025",
      positions: [
        { title: "Principal Software Engineer", period: "2023 — 2025" },
        { title: "Senior Software Engineer II", period: "2022 — 2023" },
        { title: "Senior Software Engineer I", period: "2020 — 2022" },
        { title: "Software Engineer II", period: "2018 — 2020" }
      ],
      description: "Led Paragon, the open-source design system behind 40+ Open edX projects (5.9M+ npm downloads, 100M+ learners): token architecture, docs platform, internationalization. In parallel, early engineer on edX for Business — React SPAs and Django REST APIs underpinning ~$15M in annual revenue.",
      technologies: [
        'JavaScript', 'TypeScript', 'React', 'Style Dictionary',
        'React Query', 'React Router', 'Sass', 'Webpack',
        'Python', 'Django', 'Node.js', 'MySQL', 'GitHub Actions',
        'Docker', 'Datadog RUM'
      ],
    },
    {
      fix: "GRSIG",
      company: "Ground Signal",
      companyUrl: "https://groundsignal.ai/",
      period: "2017 — 2018",
      positions: [
        { title: "Software Engineer", period: "2017 — 2018" }
      ],
      description: "I shipped reusable Ractive.js components for a B2B web application, partnering with a designer and product manager to revamp the dashboard with fuzzy search, venue filtering, and CSV export, plus real-time social data ingestion.",
      technologies: [
        'JavaScript', 'Ractive.js', 'Ruby on Rails', 'Python',
      ],
    },
    {
      fix: "CARNE",
      company: "Carnegie Mellon University",
      companyUrl: "https://www.cmu.edu/",
      period: "2015 — 2017",
      positions: [
        {
          title: "Graduate Research Assistant / Ph.D. Student",
          period: "2015 — 2017"
        },
      ],
      description: "I prototyped a browser-based conversational turn-detection model for video communication in Python and JavaScript, analyzing 392 Coursera discussion groups (1,027 users, 800K+ conversational turns) to assess dominant behavior in multi-party conversation.",
      technologies: [
        'JavaScript', 'R', 'Python',
      ],
    },
    {
      fix: "HRTFD",
      company: "University of Hartford",
      companyUrl: "https://hartford.edu/",
      period: "2012 — 2015",
      positions: [
        {
          title: "Undergraduate Research Assistant",
          period: "2012 — 2015"
        }
      ],
      description: "I developed a collaborative video-based learning platform enabling threaded discussion anchored inside video lectures, used by ~5,000 learners across three universities. I ran the user interviews and mixed-methods evaluations that drove prioritization, and co-authored the peer-reviewed publications behind a $448k National Science Foundation grant (IIS-1318345).",
      technologies: [
        'JavaScript', 'jQuery', 'PHP', 'MySQL', 'Python', 'SPSS',
      ],
    },
    {
      company: "",
      companyUrl: "https://hartford.edu/",
      period: "2010 — 2015",
      positions: [],
      description: "Earlier: internships, co-ops, and part-time web development roles including Carbonite, Diebold, ForeSite Technologies, and Green Bridge Guide, plus a visiting research appointment at Carnegie Mellon.",
      technologies: [],
    }
];

function WaypointMarker() {
  return (
    <svg viewBox="0 0 22 22" className="waypoint-marker" aria-hidden="true">
      <path
        d="M11 3 L19.5 18 L2.5 18 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Waypoint({
  experience,
  index,
  open,
  onToggle,
}: {
  experience: ExperienceItemProps;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const { fix, company, companyUrl, period, positions, description, technologies } =
    experience;
  const currentRole = positions[0]?.title ?? "";
  const bodyId = `waypoint-${index}-body`;

  return (
    <li className="ledger-row waypoint" data-open={open}>
      <WaypointMarker />
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className="group -mx-3 grid w-full cursor-pointer grid-cols-[4.5rem_1fr_auto] items-baseline gap-x-4 px-3 py-2 text-left sm:grid-cols-[4.5rem_1fr_1fr_8.5rem_1.5rem]"
      >
        <span className="mono-label text-accent">{fix}</span>
        <span className="condensed-caps text-[1.0625rem] transition-colors group-hover:text-accent sm:text-[1.1875rem]">
          {company}
        </span>
        <span className="mono-label hidden text-ink-muted sm:block">
          {currentRole}
        </span>
        <span className="mono-label tabular-nums text-ink-muted sm:text-right">
          {period}
        </span>
        <span
          className="ledger-toggle-glyph mono-label hidden text-right text-ink-muted group-hover:text-accent sm:inline-block"
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div className="ledger-row-body" id={bodyId}>
        <div>
          <div className="grid gap-8 pb-4 pt-3 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="max-w-[62ch] text-[1rem] leading-[1.7]">{description}</p>
              <a
                href={companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-link mt-4 inline-block"
              >
                Visit {company} ↗
              </a>
            </div>
            <div className="space-y-6 lg:col-span-5">
              {positions.length > 1 ? (
                <div>
                  <p className="mono-label text-ink-muted">Positions held</p>
                  <ul className="mt-3 space-y-1.5">
                    {positions.map((position) => (
                      <li
                        key={position.title}
                        className="flex items-baseline justify-between gap-4 font-mono text-[0.75rem] tracking-wide"
                      >
                        <span>{position.title}</span>
                        <span className="tabular-nums text-ink-muted">{position.period}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div>
                <p className="mono-label text-ink-muted">Stack</p>
                <p className="mt-3 font-mono text-[0.75rem] leading-relaxed tracking-wide text-ink-muted">
                  {technologies.join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const listed = experiences.filter((experience) => experience.company);
  const footnote = experiences.find((experience) => !experience.company);

  return (
    <section id="route" className="scroll-mt-16 pb-20 sm:pb-28">
      <SectionHeader number="02" title="The Route" annotation="Logged 2010 — Present" />
      <div className="route mt-10">
        <div className="route-line" aria-hidden="true" />
        <ol className="space-y-8">
          {listed.map((experience, index) => (
            <Waypoint
              key={experience.company}
              experience={experience}
              index={index}
              open={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </ol>
        {footnote ? (
          <p className="mt-8 max-w-[62ch] text-[0.9375rem] italic text-ink-muted">
            {footnote.description}{" "}
            <span className="mono-label not-italic">({footnote.period})</span>
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default Experience;
