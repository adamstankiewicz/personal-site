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
      <SectionHeader number="01" title="About" annotation="8+ years · edtech" />
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 text-[1.0625rem] leading-[1.75] lg:col-span-8">
          <p>
            I'm a software engineer with over 8 years of experience, specializing
            in design systems, frontend architecture, REST API design, and user
            experience, particularly in the edtech space. I thrive at the
            intersection of design and engineering, crafting accessible, reusable
            components that empower product teams to deliver high-quality user
            experiences efficiently.
          </p>
          <p>
            Currently, I serve as a Principal Software Engineer at{" "}
            <ProseLink href="https://edx.org">edX</ProseLink> /{" "}
            <ProseLink href="https://2u.com">2U</ProseLink>, where I've led the
            frontend architecture for the{" "}
            <ProseLink href="https://business.edx.org">edX Enterprise</ProseLink>{" "}
            product line and contributed to the backend Django REST API design
            and development. I also maintain{" "}
            <ProseLink href="https://paragon-openedx-v22.netlify.app">
              Paragon
            </ProseLink>
            , an open-source design system and React component library that
            powers over 40 projects within the{" "}
            <ProseLink href="https://openedx.org">Open edX</ProseLink> learning
            platform, supporting over 100 million learners.
          </p>
          <p>
            Earlier in my career, I conducted and published research in
            human-computer interaction (HCI) and edtech, focusing on
            collaborative and social learning experiences at scale. This work
            included prototyping systems, interviewing stakeholders, and
            analyzing user behavior to inform product direction.
          </p>
        </div>
        <aside className="lg:col-span-4">
          <div className="border-l border-line pl-6">
            <p className="mono-label text-ink-muted">Off hours</p>
            <p className="mt-3 text-[0.9375rem] italic leading-relaxed text-ink-muted">
              Usually hiking with my Australian Cattle Dog (Duke), or flying as a
              Private Pilot and aircraft owner (Cessna 172).
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
