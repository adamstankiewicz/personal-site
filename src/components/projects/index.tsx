import { useRouteLoaderData } from "react-router";
import { SectionHeader } from "@/components/section-header";
import { Project } from "./types";

export const projects: Project[] = [
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
    installs: 4000000,
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

export async function loader() {
  return { projects };
}

function formatInstalls(installs: number) {
  return `${new Intl.NumberFormat("en-US").format(installs)}+ installs`;
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
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-accent"
            >
              {project.title}
            </a>
          </h3>
          <p className="mt-6 text-[1rem] leading-[1.75]">{project.description}</p>

          <ul className="mono-label mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 text-ink-muted">
            {typeof project.stars === "number" ? (
              <li>★ {project.stars}</li>
            ) : null}
            {typeof project.installs === "number" ? (
              <li>{formatInstalls(project.installs)}</li>
            ) : null}
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
  const { projects } = useRouteLoaderData("routes/home") as {
    projects: Project[];
  };

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
