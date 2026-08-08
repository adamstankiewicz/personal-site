import { SectionHeader } from "@/components/section-header";
import { Project } from "./types";

const projects: Project[] = [
  {
    title: 'Spellbook MCP Server',
    description: "Designed and built the MCP server for Spellbook, MagicSchool's design system, so AI coding agents implement UI against real component APIs instead of inventing them — and designers can verify resolved token values before handoff. Nine tools over 70+ React component specifications, resolved design tokens, icon catalogs, and curated examples, backed by a compiler-backed validator that type-checks agent-generated JSX against the real component APIs. Measured with a controlled evaluation across 25 production UI tasks and three model tiers before rollout.",
    figures: [
      { label: 'First-attempt correctness', value: '36% → 88%' },
      { label: 'Inference cost per task', value: '−35–41%' },
      { label: 'Evaluation', value: '25 tasks · 3 model tiers' },
      { label: 'Surface area', value: '9 tools · 70+ components' },
    ],
    technologies: [
      'TypeScript',
      'Node.js',
      'MCP',
      'React',
      'DTCG Design Tokens',
      'LLM Evaluation',
    ],
  },
  {
    title: 'Paragon, Design System & Component Library',
    description: 'Developed and maintained Paragon, an open-source design system and React component library providing the UI foundation for the Open edX learning platform, empowering product teams to build consistent and accessible user interfaces.',
    href: 'https://paragon-openedx-v22.netlify.app',
    githubUrl: 'https://github.com/openedx/paragon',
    images: [
      {
        src: '/images/projects/paragon.png',
        alt: 'Paragon home page',
      },
      {
        src: '/images/projects/paragon-colors.png',
        alt: 'Paragon color palette',
      },
      {
        src: '/images/projects/paragon-button.png',
        alt: 'Paragon button component',
      },
      {
        src: '/images/projects/paragon-pagination.png',
        alt: 'Paragon pagination component',
      },
      {
        src: '/images/projects/paragon-usage.png',
        alt: 'Paragon usage insights',
      },
    ],
    technologies: [
      'JavaScript',
      'TypeScript',
      'React',
      'Style Dictionary',
      'CSS',
      'Sass',
      'Gatsby',
      'GitHub Actions',
      'Figma',
    ],
    stars: 130,
    installs: 5900000,
  },
  {
    title: 'edX Enterprise',
    description: 'Led the frontend architecture for the enterprise platform at edX, providing comprehensive solutions for both learners and administrators. The platform supports user onboarding, content discovery, course enrollment, and administrative management for enterprise customers.',
    href: 'https://business.edx.org',
    images: [
      {
        src: '/images/projects/enterprise-learner-dashboard.png',
        alt: 'Enterprise Learner Portal - Dashboard',
      },
      {
        src: '/images/projects/enterprise-learner-search.png',
        alt: 'Enterprise Learner Portal - Search',
      },
      {
        src: '/images/projects/enterprise-learner-course.png',
        alt: 'Enterprise Learner Portal - Course',
      },
      {
        src: '/images/projects/enterprise-admin-learner-credit.png',
        alt: 'Enterprise Admin Portal - Learner Credit',
      },
      {
        src: '/images/projects/enterprise-admin-learner-credit-assignment-allocation.png',
        alt: 'Enterprise Admin Portal - Learner Credit Allocation',
      },
      {
        src: '/images/projects/enterprise-admin-highlights.png',
        alt: 'Enterprise Admin Portal - Highlights',
      },
    ],
    technologies: [
      'JavaScript',
      'TypeScript',
      'React',
      'React Router',
      'State Management',
      'React Query',
      'Redux',
      'Python',
      'Django',
      'MySQL',
      'Redis',
      'Celery',
      'GitHub Actions',
      'Docker',
    ],
  },
];

function formatInstalls(installs: number) {
  const millions = installs / 1_000_000;
  const compact = Number.isInteger(millions)
    ? String(millions)
    : millions.toFixed(1);
  return `${compact}M+ npm downloads`;
}

function CaseFile({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const [cover, ...rest] = project.images ?? [];
  const thumbnails = rest.slice(0, 3);

  return (
    <article className="border-b border-line py-14 first:pt-10 last:border-b-0" data-reveal>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="mono-label text-ink-muted">No. {number}</p>
          <h3 className="mt-4 font-serif text-3xl font-light leading-tight tracking-tight sm:text-4xl">
            {project.href ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-6 text-[1rem] leading-[1.75]">{project.description}</p>

          <ul className="mono-label mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-ink-muted">
            {typeof project.stars === "number" ? (
              <li>★ {project.stars}</li>
            ) : null}
            {typeof project.installs === "number" ? (
              <li>{formatInstalls(project.installs)}</li>
            ) : null}
            {project.href ? (
              <li>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  Live ↗
                </a>
              </li>
            ) : null}
            {project.githubUrl ? (
              <li>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-link !text-inherit hover:!text-accent"
                >
                  Source ↗
                </a>
              </li>
            ) : null}
          </ul>

          <p className="mt-8 border-t border-line pt-5 font-mono text-[0.75rem] leading-relaxed tracking-wide text-ink-muted">
            {(project.technologies ?? []).join(" · ")}
          </p>
        </div>

        <div className="lg:col-span-7">
          {!cover && project.figures ? (
            <dl className="grid grid-cols-2 border-t border-l border-line">
              {project.figures.map((figure, figureIndex) => (
                <div
                  key={figure.label}
                  className="stagger border-b border-r border-line bg-paper-raised p-6 sm:p-8"
                  style={
                    { "--stagger-delay": `${figureIndex * 90}ms` } as React.CSSProperties
                  }
                >
                  <dt className="mono-label text-ink-muted">{figure.label}</dt>
                  <dd className="mt-4 font-serif text-2xl font-light tracking-tight text-ink sm:text-3xl">
                    {figure.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
          {cover ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} (opens live site)`}
              className="group block overflow-hidden border border-line bg-paper-raised"
            >
              <img
                src={cover.src}
                alt={cover.alt}
                loading="lazy"
                className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              />
            </a>
          ) : null}
          {thumbnails.length ? (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {thumbnails.map((image) => (
                <div
                  key={image.src}
                  className="overflow-hidden border border-line bg-paper-raised"
                >
                  <img src={image.src} alt={image.alt} loading="lazy" className="w-full" />
                </div>
              ))}
            </div>
          ) : null}
          {cover ? (
            <p className="mono-label mt-3 text-ink-muted">{cover.alt}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="scroll-mt-16 pb-24 sm:pb-32" data-reveal>
      <SectionHeader number="03" title="Selected Work" annotation="Case files" />
      <div>
        {projects.map((project, index) => (
          <CaseFile key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
