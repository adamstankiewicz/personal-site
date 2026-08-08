import { SectionHeader } from "@/components/section-header";
import { Gallery } from "./gallery";
import { SpellbookReplay } from "./spellbook-replay";
import { Project, ProjectDetail } from "./types";

const projects: Project[] = [
  {
    title: 'Spellbook MCP Server',
    description: "The design system, made legible to AI. An MCP server that lets coding agents build UI against Spellbook's real component APIs instead of inventing markup.",
    details: [
      {
        label: 'The problem',
        text: "Ask an AI for a destructive button and it reaches for a raw Tailwind red that isn't registered in the app: it compiles, renders nothing, and nobody notices until someone looks. Ask whether the system has an inline alert and it invents one. The root cause is the same everywhere: guessing instead of checking what actually exists in the design system.",
      },
      {
        label: 'The build',
        text: "Nine tools over 70+ React component specs, resolved design tokens, icon catalogs, and real Storybook examples. Discovery is semantic: keyword matching fused with an embedding index baked at build time, traced query expansion so a search for a snackbar finds the Toast, and one entry-point tool that fans out across components, tokens, and guidelines in a single call. A compiler-backed validator type-checks generated JSX against the real APIs, and the manifest is derived by walking the TypeScript export graph on every release, so the tools can never drift from source.",
      },
      {
        label: 'The test',
        text: "A 25-task evaluation across three Claude model tiers: same tasks, same models, only the MCP connection toggled. First-attempt success rose from 4–36% to 72–88% depending on the model, and cost per shipped task fell 35–41%. The sharpest finding: not one baseline failure was cleanly fixed by a round of review comments; with the MCP connected, there is rarely a mistake to review. A second, 40-prompt evaluation confirmed the mechanism, with steps per task falling from 12.7 to 5.8.",
      },
    ],
    capabilities: [
      'component specs',
      'resolved design tokens',
      'icon catalog',
      'curated examples',
      'JSX type-checking',
      'release-synced manifest',
    ],
    replay: true,
    figures: [
      { label: 'First-attempt success', value: '36% → 88%' },
      { label: 'Cost per shipped task', value: '−35–41%' },
      { label: 'Steps per task', value: '12.7 → 5.8' },
      { label: 'Surface area', value: '9 tools · 70+ components' },
    ],
    figuresNote:
      'Success and cost from the 25-task, three-tier study (shown for the model with the strongest unaided baseline; every difference statistically significant). Steps from the 40-prompt study.',
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
    title: 'MagicSchool Chat Shell',
    description: "The conversational core of MagicSchool: a composable ChatInput component family in Spellbook, and the view-transition choreography that carries it between the homepage, standalone chat, and empty states.",
    details: [
      {
        label: 'The component',
        text: "ChatInput is a slot-based Spellbook family: textareas, attachment previews, file drop with drag states, animated placeholder prompts, an actions menu, a stop button. Apps compose only what they need. The animated placeholder is hidden from assistive tech, stills under reduced motion, and surfaces its first prompt as an accessible description.",
      },
      {
        label: 'The choreography',
        text: "View transitions carry the chat between states: homepage hero to standalone chat to empty state and back. The homepage handoff reads the prompt and files at submit time, so arriving in the chat feels instant, and transitions skip themselves under Save-Data and reduced motion.",
      },
      {
        label: 'The path to main',
        text: "Validated end to end as a proof of concept, now landing as reviewable pieces: the Spellbook primitives first, then the view-transition infrastructure, then the shell polish, so each chunk gets a real review.",
      },
    ],
    images: [
      {
        src: '/images/projects/chat-shell-poster.jpg',
        videoSrc: '/videos/chat-shell.mp4',
        alt: 'Homepage hero handing off to a standalone Raina chat, the input carried across by view transitions',
        width: 960,
        height: 492,
      },
      {
        src: '/images/projects/chatinput-kitchen-sink.png',
        alt: "ChatInput's Kitchen Sink story: avatar, animated placeholder, attachments, menu, chips, and send controls composed from slots",
        width: 1600,
        height: 468,
      },
      {
        src: '/images/projects/chatinput-a11y.png',
        alt: "The accessibility contract and slot-composition API from ChatInput's docs: focus behavior, reduced-motion fallback, aria-live drop announcements",
        width: 1600,
        height: 455,
      },
      {
        src: '/images/projects/chatinput-docs.png',
        alt: "ChatInput's documentation: the card-chrome organism, with its Do's and Don'ts",
        width: 1600,
        height: 524,
      },
    ],
    technologies: [
      'TypeScript',
      'React',
      'Next.js',
      'View Transitions API',
      'Spellbook Design System',
    ],
  },
  {
    title: 'Diff-Aware Accessibility CI',
    description: "Automated axe scans wired into CI with two review surfaces: a sticky pull-request comment that separates the violations a PR introduced from what already existed, and a lifecycle dashboard for the accessibility guild. Non-blocking by design: it informs review instead of failing merges.",
    details: [
      {
        label: 'The comment',
        text: "Every pull request gets a diff against the main baseline: regressions on already-scanned flows called out, pre-existing debt collapsed, and newly instrumented flows counted as coverage rather than blame.",
      },
      {
        label: 'The report',
        text: "A self-contained report.html groups findings by WCAG rule, screenshots each violation with the element highlighted, and carries a copy-ready fix prompt you can hand straight to a coding agent.",
      },
      {
        label: 'The dashboard',
        text: "Post-merge runs aggregate each violation's lifecycle (first seen, regression, resolved) into a dashboard of coverage-normalized signals the accessibility guild works from: violations per screen, regressions versus new coverage, and introduced-versus-resolved momentum.",
      },
    ],
    images: [
      {
        src: '/images/projects/a11y-pr-comment.png',
        alt: 'Sticky pull-request comment surfacing new axe violations introduced by the PR',
        width: 1796,
        height: 1016,
      },
      {
        src: '/images/projects/a11y-report.png',
        alt: 'Self-contained accessibility report with findings grouped by rule and per-finding screenshots',
        width: 3456,
        height: 3150,
      },
      {
        src: '/images/projects/a11y-dashboard-overview.png',
        alt: 'Accessibility guild dashboard overview with coverage-normalized signals',
        width: 3456,
        height: 3748,
      },
      {
        src: '/images/projects/a11y-dashboard-violations.png',
        alt: 'Dashboard violations grid with sorting and filtering by rule, impact, and screen',
        width: 3456,
        height: 2056,
      },
    ],
    technologies: [
      'TypeScript',
      'Playwright',
      'axe-core',
      'GitHub Actions',
      'WCAG 2.1 AA',
    ],
  },
  {
    title: 'Paragon, Design System & Component Library',
    description: 'The open-source design system and React component library underneath the Open edX platform: design tokens, components, docs, and the tooling that keeps 40+ consuming projects consistent and accessible.',
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
    description: 'The enterprise learning platform at edX, built 0 → 1: onboarding, discovery, enrollment, and administration for corporate customers, from the React frontends to the Django REST APIs.',
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

  return (
    <article className="py-12 first:pt-10 last:pb-0 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-5">
          <p className="mono-label text-accent">Case {number}</p>
          <h3 className="title-md mt-4 text-[1.5rem] sm:text-[1.75rem]">
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
                  <dt className="mono-label text-accent">{detail.label}</dt>
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
                    className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[0.6875rem] tracking-wide text-ink"
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

        <div className="min-w-0 lg:sticky lg:top-24 lg:col-span-7 lg:self-start">
          {project.replay ? (
            <div className="mb-6">
              <SpellbookReplay />
              <p className="mono-label mt-3 text-ink-muted">
                A scripted reconstruction of how a run works, not a recorded
                transcript
              </p>
            </div>
          ) : null}
          {!project.images?.length && project.figures ? (
            <>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line">
                {project.figures.map((figure) => (
                  <div key={figure.label} className="bg-paper p-6 sm:p-8">
                    <dt className="mono-label text-ink-muted">{figure.label}</dt>
                    <dd className="stat-value mt-4 text-ink">
                      {figure.value}
                    </dd>
                  </div>
                ))}
              </dl>
              {project.figuresNote ? (
                <p className="mono-label mt-3 text-ink-muted">
                  {project.figuresNote}
                </p>
              ) : null}
            </>
          ) : null}
          {project.images?.length ? (
            <Gallery images={project.images} title={project.title} />
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="scroll-mt-16 pb-24 sm:pb-32">
      <SectionHeader number="03" title="Selected Work" annotation="Five things, up close" />
      <div className="divide-y divide-line">
        {projects.map((project, index) => (
          <Inset key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
