"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItemProps } from "./types";

const experiences: ExperienceItemProps[] = [
    {
      company: "MagicSchool AI",
      companyUrl: "https://magicschool.ai",
      period: "2025 — Present",
      positions: [
        { title: "Senior Design Systems Engineer", period: "2025 — Present" }
      ],
      description: "I lead design systems and accessibility work on Spellbook, the React design system behind MagicSchool's AI platform for K-12 educators — used by roughly 8 million people across 36,000 schools. I designed and built the Spellbook MCP server so AI coding agents build with real components instead of inventing them, raising first-attempt component correctness from 36% to 88% in a controlled evaluation. I rebuilt the token layer on a DTCG pipeline with CI drift gates, led the accessibility remediation behind the company's first VPAT, and serve as tech lead for a product squad that delivered five projects from ideation through rollout in a single quarter.",
      technologies: [
        'TypeScript', 'React', 'Next.js', 'Node.js', 'MCP',
        'DTCG Design Tokens', 'Tailwind', 'Playwright', 'axe-core',
        'LLM Evaluation'
      ],
    },
    {
      company: "edX / 2U",
      companyUrl: "https://edx.org",
      period: "2018 — 2025",
      positions: [
        { title: "Principal Software Engineer", period: "2023 — 2025" },
        { title: "Senior Software Engineer II", period: "2022 — 2023" },
        { title: "Senior Software Engineer I", period: "2020 — 2022" },
        { title: "Software Engineer II", period: "2018 — 2020" }
      ],
      description: "I led Paragon, an open-source design system and React component library adopted across 40+ Open edX projects with 5.9M+ npm downloads — the UI foundation for a platform reaching over 100 million learners. I architected its design-token system on Style Dictionary, directed its documentation platform (500+ monthly actives), and led its internationalization initiative as design authority. As an early engineer on edX for Business, I architected the React SPAs and Django REST APIs underpinning enterprise partnerships worth ~$15M in annual revenue, and served as primary point of contact for Paragon support across 2U and the Open edX community.",
      technologies: [
        'JavaScript', 'TypeScript', 'React', 'Style Dictionary',
        'React Query', 'React Router', 'Sass', 'Webpack',
        'Python', 'Django', 'Node.js', 'MySQL', 'GitHub Actions',
        'Docker', 'Datadog RUM'
      ],
    },
    {
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

function LedgerRow({
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
  const { company, companyUrl, period, positions, description, technologies } =
    experience;
  const number = String(index + 1).padStart(2, "0");
  const currentRole = positions[0]?.title ?? "";
  const bodyId = `experience-${index}-body`;

  return (
    <li
      className="ledger-row stagger border-b border-line"
      data-open={open}
      style={{ "--stagger-delay": `${index * 70}ms` } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 text-left sm:grid-cols-[2.5rem_1fr_1fr_8.5rem_1.5rem]"
      >
        <span className="mono-label text-ink-muted transition-colors group-hover:text-accent">
          {number}
        </span>
        <span className="font-serif text-xl font-normal tracking-tight transition-colors group-hover:text-accent sm:text-2xl">
          {company}
        </span>
        <span className="mono-label hidden text-ink-muted sm:block">
          {currentRole}
        </span>
        <span className="mono-label text-ink-muted sm:text-right">{period}</span>
        <span
          className="ledger-toggle-glyph mono-label hidden text-right text-ink-muted group-hover:text-accent sm:inline-block"
          aria-hidden="true"
        >
          +
        </span>
      </button>

      <div className="ledger-row-body" id={bodyId}>
        <div>
          <div className="grid gap-8 pb-8 pr-2 sm:pl-[3.5rem] lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="text-[1rem] leading-[1.75]">{description}</p>
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
                  <ul className="mt-3 space-y-1.5 border-l border-line pl-4">
                    {positions.map((position) => (
                      <li
                        key={position.title}
                        className="flex items-baseline justify-between gap-4 font-mono text-[0.75rem] tracking-wide"
                      >
                        <span>{position.title}</span>
                        <span className="text-ink-muted">{position.period}</span>
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
    <section id="index" className="scroll-mt-16 pb-20 sm:pb-28" data-reveal>
      <SectionHeader number="02" title="Index of Experience" annotation="2010 — Present" />
      <ol className="mt-6 border-t border-line">
        {listed.map((experience, index) => (
          <LedgerRow
            key={experience.company}
            experience={experience}
            index={index}
            open={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </ol>
      {footnote ? (
        <p className="mt-5 text-[0.9375rem] italic text-ink-muted sm:pl-[3.5rem]">
          {footnote.description}{" "}
          <span className="mono-label not-italic">({footnote.period})</span>
        </p>
      ) : null}
    </section>
  );
}

export default Experience;
