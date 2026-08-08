import { SectionHeader } from "@/components/ui/section-header";
import { Chip } from "@/components/ui/chip";
import { Gallery } from "./gallery";
import { SpellbookReplay } from "./spellbook-replay";
import { projects } from "./data";
import { Project, ProjectDetail } from "./types";
import { ExternalLink } from "@/components/ui/external-link";

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
              <ExternalLink
                href={project.href}
                className="transition-colors hover:text-accent"
              >
                {project.title}
              </ExternalLink>
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
                  <Chip key={capability} as="li">
                    {capability}
                  </Chip>
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
                <ExternalLink
                  href={project.href}
                  className="mono-link !text-inherit hover:!text-accent"
                  icon
                >
                  Live
                </ExternalLink>
              </li>
            ) : null}
            {project.githubUrl ? (
              <li>
                <ExternalLink
                  href={project.githubUrl}
                  className="mono-link !text-inherit hover:!text-accent"
                  icon
                >
                  Source
                </ExternalLink>
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
