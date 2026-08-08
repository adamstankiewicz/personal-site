import { SectionHeader } from "@/components/ui/section-header";
import { PrintPhoto } from "@/components/ui/print-photo";
import { ExternalLink } from "@/components/ui/external-link";
import { aboutParagraphs } from "./data";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ExternalLink href={href} className="link">
      {children}
    </ExternalLink>
  );
}

// [label](url) in the source strings is already valid markdown for
// llms.txt; parsed into real links here, the same split-on-pattern
// approach Experience's *emphasis* uses.
const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderProse(text: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  for (const match of text.matchAll(LINK_PATTERN)) {
    const [full, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(
      <ProseLink key={key++} href={href}>
        {label}
      </ProseLink>
    );
    lastIndex = index + full.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function About() {
  return (
    <section id="about" className="scroll-mt-28 pb-24 sm:scroll-mt-16 sm:pb-32">
      <SectionHeader number="01" title="About" annotation="The story so far" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="max-w-[65ch] space-y-6 text-[1.0625rem] leading-[1.75] lg:col-span-8">
          {aboutParagraphs.map((paragraph, index) => (
            <p key={index}>{renderProse(paragraph)}</p>
          ))}
        </div>
        <aside className="lg:col-span-4">
          <div className="border-l border-line pl-6">
            <p className="mono-label text-ink-muted">Off hours</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Hiking with my Australian Cattle Dog, Duke, or flying my
              Cessna 172 around New England. Formerly of the U.S. Boomerang
              Team.
            </p>
          </div>
        </aside>
      </div>

      {/* Both aerials are 4:3, so they sit level side by side. */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <figure>
          <PrintPhoto
            src="/images/flying/winnipesaukee.webp"
            alt="Aerial view from a small plane over Lake Winnipesaukee, New Hampshire, in fall, the wing strut in frame, foliage and a runway below"
            width={1400}
            height={1050}
          />
          <figcaption className="mono-label mt-3 text-ink-muted">
            Lake Winnipesaukee, from the left seat
          </figcaption>
        </figure>
        <figure>
          <PrintPhoto
            src="/images/flying/monadnock.webp"
            alt="View from a small plane of Mount Monadnock under late-day clouds, the wing strut crossing the frame"
            width={1400}
            height={1050}
          />
          <figcaption className="mono-label mt-3 text-ink-muted">
            Mount Monadnock, from 4,500 ft
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
