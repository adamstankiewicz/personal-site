import { SectionHeader } from "@/components/ui/section-header";
import { ExternalLink } from "@/components/ui/external-link";

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  href?: string;
}

const publications: Publication[] = [
  {
    title:
      "Supporting Learners with Distributed Mentorship Teams in Massive Online Classes",
    authors: "A. Stankiewicz",
    venue: "CSCW '16 Workshop",
    year: "2016",
  },
  {
    title:
      "$1 Conversational Turn Detector: Measuring How Video Conversations Affect Student Learning in Online Classes",
    authors: "A. Stankiewicz, C. Kulkarni",
    venue: "ACM Learning @ Scale",
    year: "2016",
    href: "https://dl.acm.org/doi/10.1145/2876034.2876048",
  },
  {
    title:
      "The Evolution of TrACE: Integration of a Collaborative Learning Platform in Flipped Classrooms",
    authors: "S. L. Dazo, A. Stankiewicz, R. M. Gibbs, B. Dorn",
    venue: "CSCL",
    year: "2015",
  },
  {
    title:
      "Piloting TrACE: Exploring Spatiotemporal Anchored Collaboration in Asynchronous Learning",
    authors: "B. Dorn, L. B. Schroeder, A. Stankiewicz",
    venue: "ACM CSCW",
    year: "2015",
    href: "https://dl.acm.org/doi/10.1145/2675133.2675178",
  },
  {
    title:
      "Lost While Searching: Difficulties in Information Seeking Among End-User Programmers",
    authors: "B. Dorn, A. Stankiewicz, C. Roggi",
    venue: "ASIS&T Annual Meeting",
    year: "2013",
  },
];

export function Research() {
  return (
    <section id="research" className="scroll-mt-16 pb-24 sm:pb-32">
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
              <p className="title-md text-[1.0625rem] leading-snug">
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
