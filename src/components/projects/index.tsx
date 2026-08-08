import { SectionHeader } from "@/components/section-header";
import { Project, ProjectDetail } from "./types";

const projects: Project[] = [
  {
    title: 'Spellbook MCP Server',
    description: "The design system, made legible to AI. An MCP server that lets coding agents build UI against Spellbook's real component APIs instead of inventing markup.",
    details: [
      {
        label: 'The problem',
        text: "Coding agents guessed at component APIs and invented markup that looked right and wasn't. Designers had no way to check resolved token values before handoff.",
      },
      {
        label: 'The build',
        text: "Nine MCP tools over 70+ React component specs, resolved design tokens, icon catalogs, and curated examples, backed by a compiler-backed validator that type-checks generated JSX against the real APIs. The manifest regenerates from source on every release, so the tools can never drift from the system.",
      },
      {
        label: 'The test',
        text: "A controlled evaluation before rollout: 25 production UI tasks, three model tiers, identical harness. The baseline agent already had full access to the design system source. The treatment added only the MCP tools.",
      },
    ],
    capabilities: [
      'component specs',
      'resolved tokens',
      'icon catalog',
      'curated examples',
      'JSX type-checking',
      'release-synced manifest',
      'generative UI',
    ],
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
    description: 'The open-source design system and React component library underneath the Open edX platform: tokens, components, docs, and the tooling that keeps 40+ consuming projects consistent and accessible.',
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
    description: 'The enterprise learning platform at edX, built 0 → 1: onboarding, discovery, enrollment, and administration for corporate customers — frontend architecture and REST APIs alike.',
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

function Inset({ project, index }: { project: Project; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const [cover, ...rest] = project.images ?? [];
  const thumbnails = rest.slice(0, 3);

  return (
    <article className="inset mt-10 p-5 sm:p-8">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="inset-tab -ml-1">No. {number}</p>
          <h3 className="condensed-caps mt-5 text-2xl sm:text-[1.75rem]">
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

          {project.details ? (
            <dl className="mt-8 space-y-5">
              {project.details.map((detail: ProjectDetail) => (
                <div key={detail.label} className="border-l-2 border-line pl-4">
                  <dt className="mono-label text-accent-2">{detail.label}</dt>
                  <dd className="mt-1.5 max-w-[58ch] text-[0.9375rem] leading-[1.7]">
                    {detail.text}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {project.capabilities ? (
            <div className="mt-6">
              <p className="mono-label text-ink-muted">What the tools cover</p>
              <ul className="mt-2.5 flex flex-wrap gap-1.5">
                {project.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="border border-line px-2 py-0.5 font-mono text-[0.6875rem] tracking-wide text-ink"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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
            <dl className="grid grid-cols-2 gap-px overflow-hidden bg-paper-raised">
              {project.figures.map((figure) => (
                <div
                  key={figure.label}
                  className="bg-paper-raised p-6 sm:p-8"
                >
                  <dt className="mono-label text-ink-muted">{figure.label}</dt>
                  <dd className="stat-value mt-4 text-ink">
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
              className="group plate block overflow-hidden bg-paper-raised"
            >
              <img
                src={cover.src}
                alt={cover.alt}
                loading="lazy"
                decoding="async"
                width={3024}
                height={1550}
                className="plate-img h-auto w-full"
              />
            </a>
          ) : null}
          {thumbnails.length ? (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {thumbnails.map((image) => (
                <div
                  key={image.src}
                  className="plate overflow-hidden bg-paper-raised"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    width={3024}
                    height={1550}
                    className="h-auto w-full"
                  />
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
    <section id="work" className="scroll-mt-16 pb-24 sm:pb-32">
      <SectionHeader number="03" title="Selected Work" annotation="Three things, up close" />
      <div>
        {projects.map((project, index) => (
          <Inset key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
