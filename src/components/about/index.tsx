import { SectionHeader } from "@/components/ui/section-header";
import { PrintPhoto } from "@/components/ui/print-photo";
import { ExternalLink } from "@/components/ui/external-link";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <ExternalLink href={href} className="link">
      {children}
    </ExternalLink>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-16 pb-24 sm:pb-32">
      <SectionHeader number="01" title="About" annotation="The story so far" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="max-w-[65ch] space-y-6 text-[1.0625rem] leading-[1.75] lg:col-span-8">
          <p>
            Most of my career has happened in edtech, and the work has
            always split two ways — usually both at once. The day job is
            shipping features on a product team; running alongside it, I’m
            building the design system, the design tokens, and the
            accessibility tooling that team builds with. I stopped trying
            to pick a side a long time ago; each one makes me better at
            the other.
          </p>
          <p>
            I started out in research. A video learning platform I built as
            an undergrad turned into published papers and two years of a
            Ph.D. at Carnegie Mellon before I traded the lab for industry.
            That meant seven years at{" "}
            <ProseLink href="https://edx.org">edX</ProseLink> /{" "}
            <ProseLink href="https://2u.com">2U</ProseLink>, leading{" "}
            <ProseLink href="https://paragon-openedx-v22.netlify.app">
              Paragon
            </ProseLink>{" "}
            for the <ProseLink href="https://openedx.org">Open edX</ProseLink>{" "}
            ecosystem while building edX for Business, and now{" "}
            <ProseLink href="https://magicschool.ai">MagicSchool AI</ProseLink>,
            where I’ve been teaching AI coding agents to respect a design
            system. The research years still show up:
            for the big calls, I’d rather run an evaluation than argue
            from taste.
          </p>
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
            src="/images/flying/winnipesaukee.jpg"
            alt="Aerial view from a small plane over Lake Winnipesaukee, New Hampshire, in fall, the wing strut in frame, foliage and a runway below"
            width={2400}
            height={1800}
          />
          <figcaption className="mono-label mt-3 text-ink-muted">
            Lake Winnipesaukee, from the left seat
          </figcaption>
        </figure>
        <figure>
          <PrintPhoto
            src="/images/flying/monadnock.jpg"
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
