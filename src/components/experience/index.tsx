import { useState } from "react";
import { useRouteLoaderData } from "react-router";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItemProps } from "./types";

export async function loader(): Promise<{ experiences: ExperienceItemProps[] }> {
  const experiences: ExperienceItemProps[] = [
    {
      company: "edX / 2U",
      companyUrl: "https://edx.org",
      period: "2018 — Present",
      positions: [
        { title: "Principal Software Engineer", period: "2023 — Present" },
        { title: "Senior Software Engineer II", period: "2022 — 2023" },
        { title: "Senior Software Engineer I", period: "2020 — 2022" },
        { title: "Software Engineer II", period: "2018 — 2020" }
      ],
      description: "At edX Enterprise, I led the development of the frontend architecture, designed and implemented REST APIs, and worked cross-functionally to craft key features to enhance the user experience for enterprise learners and administrators from the ground up. In my work with Open edX, I built and maintained Paragon, an open-source design system and React component library that empowers product teams to create cohesive and accessible learning experiences for over 100 million learners worldwide.",
      technologies: [
        'JavaScript', 'TypeScript', 'React', 'State Management',
        'React Query', 'React Router', 'CSS', 'SASS', 'Webpack',
        'Python', 'Django', 'Node.js', 'MySQL', 'GitHub Actions',
        'Docker', 'Celery', 'Redis'
      ],
    },
    {
      company: "Ground Signal",
      companyUrl: "https://groundsignal.ai/",
      period: "2017 — 2018",
      positions: [
        { title: "Software Engineer", period: "2017 — 2018" }
      ],
      description: "I developed reusable Ractive.js components for a B2B SaaS web application, working closely with a UX designer and product manager to revamp the dashboard. This update included features like fuzzy search, venue filtering, and CSV export functionality for improved usability. Additionally, I implemented scripts for real-time social media data ingestion, which enhanced the product’s analytics capabilities and provided timely insights for users.",
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
      description: "I developed a browser-based model for detecting conversational turns in video communication platforms like Google Hangouts. By analyzing data from 392 Coursera discussion groups with over 1,000 users, I gained insights into how people interact in multi-party video conversations. I also created a JavaScript library for peer-to-peer advice exchange, using findings from Amazon Mechanical Turk studies to better understand how users approach advice-giving and mentorship.",
      technologies: [
        'JavaScript', 'R', 'Python',
      ],
    },
    {
      company: "University of Hartford",
      companyUrl: "https://hartford.edu/",
      period: "2011 — 2015",
      positions: [
        {
          title: "Undergraduate Research Assistant",
          period: "2011 — 2015"
        }
      ],
      description: "I spearheaded the design and development of a collaborative video-based learning platform, enabling threaded discussions directly within video lectures. This platform was adopted by approximately 5,000 learners across three universities. To guide iterative product development and prioritize features, I conducted user interviews, mixed-methods evaluations, and implemented analytics instrumentation. Additionally, I co-authored peer-reviewed publications and contributed to securing a $448k National Science Foundation grant (IIS-1318345) to support this work.",
      technologies: [
        'JavaScript', 'jQuery', 'PHP', 'MySQL', 'Python', 'SPSS',
      ],
    },
    {
      company: "",
      companyUrl: "https://hartford.edu/",
      period: "2010 — 2015",
      positions: [],
      description: "Several internships, co-ops, and part-time work as a web designer and developer unlisted.",
      technologies: [],
    }
  ];

  return { experiences };
}

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
    <li className="ledger-row border-b border-line" data-open={open}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        className="group grid w-full cursor-pointer grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 text-left sm:grid-cols-[2.5rem_1fr_1fr_8.5rem_1.5rem]"
      >
        <span className="mono-label text-ink-muted">{number}</span>
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
  const { experiences } = useRouteLoaderData("routes/home") as {
    experiences: ExperienceItemProps[];
  };
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
