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
    <section id="about" className="scroll-mt-16 pb-20 sm:pb-28" data-reveal>
      <SectionHeader number="01" title="About" annotation="9+ years · design systems" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 text-[1.0625rem] leading-[1.75] lg:col-span-8">
          <p>
            I'm an engineer with over 9 years of experience working the seam
            between design and engineering — design systems and the platforms
            around them, frontend architecture, REST APIs, accessibility, and
            the research and measurement that keep all of it honest. I build
            accessible, reusable foundations that let product teams ship
            high-quality user experiences efficiently.
          </p>
          <p>
            Currently, I'm a Senior Design Systems Engineer at{" "}
            <ProseLink href="https://magicschool.ai">MagicSchool AI</ProseLink>,
            working on Spellbook — the React design system behind an AI
            platform for K-12 educators used by roughly 8 million people across
            36,000 schools. I designed and built the Spellbook MCP server so AI
            coding agents build with real components instead of inventing them,
            rebuilt the token layer on a DTCG pipeline, and led the
            accessibility remediation behind the company's first VPAT.
          </p>
          <p>
            Before that, I spent seven years at{" "}
            <ProseLink href="https://edx.org">edX</ProseLink> /{" "}
            <ProseLink href="https://2u.com">2U</ProseLink>, where I led{" "}
            <ProseLink href="https://paragon-openedx-v22.netlify.app">
              Paragon
            </ProseLink>
            , the open-source design system adopted across 40+ projects in the{" "}
            <ProseLink href="https://openedx.org">Open edX</ProseLink> platform
            with 5.9M+ npm downloads, supporting over 100 million learners — and
            helped build the edX for Business enterprise platform from zero to
            ~$15M in annual revenue.
          </p>
          <p>
            Earlier in my career, I conducted and published research in
            human-computer interaction (HCI) and edtech, focusing on
            collaborative and social learning experiences at scale — five
            peer-reviewed publications in ACM venues.
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
