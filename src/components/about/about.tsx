import { SectionHeader } from "@/components/section-header";

function ProseLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {children}
    </a>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-16 pb-20 sm:pb-28">
      <SectionHeader number="01" title="About" annotation="The story so far" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 text-[1.0625rem] leading-[1.75] lg:col-span-8">
          <p>
            For over a decade I've worked both sides of one line: the product,
            and the system underneath it. Features as an engineer and tech
            lead; design systems, token pipelines, and tooling as a platform
            builder. Mostly in edtech, where the products serve teachers and
            learners and the systems serve the teams behind them.
          </p>
          <p>
            An undergrad video learning platform pulled me into HCI research at{" "}
            Carnegie Mellon. Research pulled me into industry: seven years at{" "}
            <ProseLink href="https://edx.org">edX</ProseLink> /{" "}
            <ProseLink href="https://2u.com">2U</ProseLink> building edX for
            Business while leading{" "}
            <ProseLink href="https://paragon-openedx-v22.netlify.app">
              Paragon
            </ProseLink>{" "}
            for the <ProseLink href="https://openedx.org">Open edX</ProseLink>{" "}
            ecosystem. Now at{" "}
            <ProseLink href="https://magicschool.ai">MagicSchool AI</ProseLink>,
            the threads converge: a product squad, a design system, and AI
            coding agents taught to respect it. The habit underneath all of it
            came from the research years: instrument the product, measure real
            behavior, let evidence set the roadmap.
          </p>
        </div>
        <aside className="lg:col-span-4">
          <div className="border-l border-line pl-6">
            <p className="mono-label text-ink-muted">Off hours</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
              Usually hiking with my Australian Cattle Dog (Duke), flying my
              Cessna 172 around New England, or reminiscing about my days on
              the U.S. Boomerang Team.
            </p>
            <figure className="mt-6">
              <div className="photo">
                <img
                  src="/images/flying/winnipesaukee.jpg"
                  alt="Aerial view from a small plane over Lake Winnipesaukee, New Hampshire, in fall, the wing strut in frame, foliage and a runway below"
                  width={2400}
                  height={1800}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mono-label mt-3 text-ink-muted">
                Lake Winnipesaukee, from the left seat
              </figcaption>
            </figure>
            <figure className="mt-6">
              <div className="photo">
                <img
                  src="/images/flying/monadnock.jpg"
                  alt="View from a small plane of Mount Monadnock under late-day clouds, the wing strut crossing the frame"
                  width={1400}
                  height={1050}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="mono-label mt-3 text-ink-muted">
                Mount Monadnock, from 4,500 ft
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </section>
  );
}
