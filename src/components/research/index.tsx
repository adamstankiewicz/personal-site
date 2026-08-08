import { SectionHeader } from "@/components/ui/section-header";
import { ExternalLink } from "@/components/ui/external-link";
import { publications } from "./data";

export function Research() {
  return (
    <section id="research" className="scroll-mt-28 pb-24 sm:scroll-mt-16 sm:pb-32">
      <SectionHeader
        number="04"
        title="Publications"
        annotation="HCI · peer-reviewed"
      />
      <p className="mt-8 max-w-2xl text-[1rem] leading-[1.7] text-ink-muted">
        Before industry, I studied how people learn together at scale. Five
        peer-reviewed papers in ACM venues.
      </p>
      <ol className="mt-10 space-y-8">
        {publications.map((publication, index) => (
          <li
            key={publication.title}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 sm:grid-cols-[2.5rem_1fr_10rem]"
          >
            <span className="mono-label text-ink-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="title-md text-[1.0625rem] italic leading-snug">
                {publication.href ? (
                  <ExternalLink
                    href={publication.href}
                    className="transition-colors hover:text-accent"
                  >
                    {publication.title}
                  </ExternalLink>
                ) : (
                  publication.title
                )}
              </p>
              <p className="mono-label mt-2 text-ink-muted">
                {publication.authors}
              </p>
            </div>
            <p className="mono-label col-start-2 mt-2 text-ink-muted sm:col-start-3 sm:mt-0 sm:text-right">
              {publication.venue} · {publication.year}
            </p>
          </li>
        ))}
      </ol>
      <ExternalLink
        href="https://scholar.google.com/citations?user=lJSHz8QAAAAJ"
        className="mono-link mt-10 inline-block"
        icon
      >
        Full list on Google Scholar
      </ExternalLink>
    </section>
  );
}
