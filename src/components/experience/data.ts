import { ExperienceItemProps } from "./types";

export const experiences: ExperienceItemProps[] = [
  {
    company: "MagicSchool AI",
    companyUrl: "https://magicschool.ai",
    period: "2025–Present",
    positions: [
      { title: "Senior Design Systems Engineer", period: "2025–Present" },
    ],
    description:
      "Tech lead on a product squad and steward of Spellbook, the design system behind an AI platform for K-12 educators serving ~8M people across 36,000 schools. Built the Spellbook MCP server, giving AI agents semantic component discovery and a compiler-backed validator so they build against real APIs instead of inventing markup, and rebuilt the design-token layer on DTCG. Working with the accessibility guild, a designer and a handful of engineers, automated the axe-core checks that run on every pull request and led the remediation behind the company's first VPAT, which unlocked enterprise deals.",
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "MCP",
      "DTCG Design Tokens",
      "Tailwind",
      "Playwright",
      "axe-core",
      "LLM Evaluation",
    ],
  },
  {
    company: "edX / 2U",
    companyUrl: "https://edx.org",
    period: "2018–2025",
    positions: [
      { title: "Principal Software Engineer", period: "2023–2025" },
      { title: "Senior Software Engineer II", period: "2022–2023" },
      { title: "Senior Software Engineer I", period: "2020–2022" },
      { title: "Software Engineer II", period: "2018–2020" },
    ],
    description:
      "Led Paragon, the open-source design system behind 40+ Open edX projects (5.9M+ npm downloads, 100M+ learners): design-token architecture on Style Dictionary, a documentation platform with 500+ monthly actives, and the internationalization initiative that shipped its first language pack, consumed by other product teams, edX/2U's own eng org, and the wider Open edX open-source contributor community. In parallel, an early engineer on edX for Business, a 0-to-1 enterprise platform serving 1.2M+ learners: shaped scope and timeline together with product and design while architecting its React SPAs and Django REST APIs and establishing React Query as its server-state architecture.",
    technologies: [
      "JavaScript",
      "TypeScript",
      "React",
      "Style Dictionary",
      "React Query",
      "React Router",
      "Sass",
      "Webpack",
      "Python",
      "Django",
      "Node.js",
      "MySQL",
      "GitHub Actions",
      "Docker",
      "Datadog RUM",
    ],
  },
  {
    company: "Ground Signal",
    companyUrl: "https://groundsignal.ai/",
    period: "2017–2018",
    positions: [{ title: "Software Engineer", period: "2017–2018" }],
    description:
      "Shipped reusable Ractive.js components for a B2B web application, partnering directly with a designer and a product manager. Revamped the dashboard with fuzzy search, venue filtering, and CSV export, and built the real-time social data ingestion behind it.",
    technologies: ["JavaScript", "Ractive.js", "Ruby on Rails", "Python"],
  },
  {
    company: "Carnegie Mellon University",
    companyUrl: "https://www.cmu.edu/",
    period: "2015–2017",
    positions: [
      { title: "Graduate Research Assistant / Ph.D. Student", period: "2015–2017" },
    ],
    description:
      "Prototyped a browser-based conversational turn-detection model for video communication in Python and JavaScript, analyzing 392 Coursera discussion groups (1,027 users, 800K+ conversational turns) to assess dominant behavior in multi-party conversation. The work became the *$1 Conversational Turn Detector* paper at ACM Learning @ Scale; a separate research proposal earned an honorable mention for the NSF Graduate Research Fellowship.",
    technologies: ["JavaScript", "R", "Python"],
  },
  {
    company: "University of Hartford",
    companyUrl: "https://hartford.edu/",
    period: "2012–2015",
    positions: [
      { title: "Undergraduate Research Assistant", period: "2012–2015" },
    ],
    description:
      "Developed a collaborative video-based learning platform enabling threaded discussion anchored inside video lectures, used by ~5,000 learners across three universities. Ran the user interviews and mixed-methods evaluations that drove prioritization, and co-authored the peer-reviewed publications behind a $448k National Science Foundation grant (IIS-1318345). Alongside a B.A. in Web Design & Development with University Honors, and minors in Computer Science and Psychology.",
    technologies: ["JavaScript", "jQuery", "PHP", "MySQL", "Python", "SPSS"],
  },
];

/** The italic footnote below the timeline, not a timeline row itself. */
export const earlierWork = {
  period: "2010–2015",
  description:
    "Earlier: internships, co-ops, and part-time web development roles including Carbonite, Diebold, ForeSite Technologies, and Green Bridge Guide, plus a visiting research appointment at Carnegie Mellon.",
};
