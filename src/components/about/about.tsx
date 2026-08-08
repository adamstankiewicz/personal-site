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
            and the system underneath it. I ship user-facing features as an
            engineer and tech lead, and I build the design systems, token
            pipelines, and tooling that let whole organizations ship faster —
            mostly in edtech, where the products serve teachers and learners
            and the systems serve the teams behind them.
          </p>
          <p>
            It started in undergrad, where I built a collaborative video
            learning platform that grew to about 5,000 students across three
            universities. Watching real students use something I made pulled me
            into human-computer interaction research at Carnegie Mellon,
            studying how people learn together at scale — work that still
            shapes how I build: instrument the product, measure real behavior,
            and let evidence set the roadmap.
          </p>
          <p>
            Then came seven years at <ProseLink href="https://edx.org">edX</ProseLink> /{" "}
            <ProseLink href="https://2u.com">2U</ProseLink> doing both jobs at
            once: early engineer on edX for Business, taking an enterprise
            learning platform from zero to ~$15M in annual revenue across React
            SPAs and Django REST APIs — while leading{" "}
            <ProseLink href="https://paragon-openedx-v22.netlify.app">
              Paragon
            </ProseLink>
            , the open-source design system behind 40+{" "}
            <ProseLink href="https://openedx.org">Open edX</ProseLink> projects,
            5.9M+ npm downloads, and experiences reaching over 100 million
            learners.
          </p>
          <p>
            Today I'm at <ProseLink href="https://magicschool.ai">MagicSchool AI</ProseLink>,
            where those threads converge: tech lead on a product squad shipping
            to ~8 million users across 36,000 schools, steward of Spellbook —
            the design system underneath it all — and lately, teaching AI
            coding agents to respect that system. The MCP server I built for it
            raised agents' first-attempt component correctness from 36% to 88%,
            and it shipped the way I like to ship: measured first.
          </p>
        </div>
        <aside className="space-y-10 lg:col-span-4">
          <div className="border-l border-line pl-6">
            <p className="mono-label text-ink-muted">Operating principles</p>
            <ul className="mt-3 space-y-3">
              <li className="font-serif text-[1.0625rem] italic leading-snug">
                Measure before rollout.
              </li>
              <li className="font-serif text-[1.0625rem] italic leading-snug">
                Fix it in the system, not the call site.
              </li>
              <li className="font-serif text-[1.0625rem] italic leading-snug">
                Own it end to end — API to interface.
              </li>
            </ul>
          </div>
          <div className="border-l border-line pl-6">
            <p className="mono-label text-ink-muted">Off hours</p>
            <p className="mt-3 text-[0.9375rem] italic leading-relaxed text-ink-muted">
              Usually hiking with my Australian Cattle Dog (Duke), flying as a
              Private Pilot and aircraft owner (Cessna 172), or reminiscing
              about my days on the U.S. Boomerang Team.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
