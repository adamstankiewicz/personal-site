export function About() {
  return (
    <section id="about" className="mb-16 scroll-mt-16 md:mb-24 md:scroll-mt-24 lg:mb-28 lg:scroll-mt-28">
      <div className="space-y-6 tracking-tight">
        <p>
          I'm a software engineer with over 8 years of experience, specializing in design systems, frontend architecture, REST API design, and user experience, particularly in the edtech space. I thrive at the intersection of design and engineering, crafting accessible, reusable components that empower product teams to deliver high-quality user experiences efficiently.
        </p>
        <p>
          Currently, I serve as a Principal Software Engineer at{' '}
          <a className="underline text-sky-600 hover:text-sky-800" href="https://edx.org" target="_blank" rel="noopener noreferrer">edX</a>{' '}
          / <a className="underline text-sky-600 hover:text-sky-800" href="https://2u.com" target="_blank" rel="noopener noreferrer">2U</a>,
          where I've led the frontend architecture for the{' '}
          <a className="underline text-sky-600 hover:text-sky-800" href="https://business.edx.org" target="_blank" rel="noopener noreferrer">edX Enterprise</a> product
          line and contributed to the backend Django REST API design and development. I also maintain{' '}
          <a className="underline text-sky-600 hover:text-sky-800" href="https://paragon-openedx-v22.netlify.app" target="_blank" rel="noopener noreferrer">Paragon</a>, an open-source design system and React component library that powers over 40 projects within the{' '}
          <a className="underline text-sky-600 hover:text-sky-800" href="https://openedx.org" target="_blank" rel="noopener noreferrer">Open edX</a> learning platform, supporting over 100 million learners.
        </p>
        <p>
          Earlier in my career, I conducted and published research in human-computer interaction (HCI) and edtech, focusing on collaborative and social learning experiences at scale. This work included prototyping systems, interviewing stakeholders, and analyzing user behavior to inform product direction.
        </p>
        <p>
          Outside of work, I'm usually hiking with my Australian Cattle Dog (Duke), or flying as a Private Pilot and aircraft owner (Cessna 172).
        </p>
      </div>
    </section>
  );
}