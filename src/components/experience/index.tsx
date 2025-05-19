import { useRouteLoaderData } from 'react-router';
import { ExperienceItem } from './ExperienceItem';
import { ExperienceItemProps } from './types';

export async function loader(): Promise<{ experiences: ExperienceItemProps[] }> {
  const experiences: ExperienceItemProps[] = [
    {
      company: "edX / 2U",
      companyUrl: "https://edx.org",
      period: "2018 — Present",
      positions: [
        { title: "Principal Software Engineer", period: "2023 — Present" },
        { title: "Senior Software Engineer II", period: "2022 — 2023" },
        { title: "Senior Software Engineer I", period: "2020 — 2022" },
        { title: "Software Engineer II", period: "2018 — 2020" }
      ],
      description: "At edX Enterprise, I led the development of the frontend architecture, designed and implemented REST APIs, and worked cross-functionally to craft key features to enhance the user experience for enterprise learners and administrators from the ground up. In my work with Open edX, I built and maintained Paragon, an open-source design system and React component library that empowers product teams to create cohesive and accessible learning experiences for over 100 million learners worldwide.",
      technologies: [
        'JavaScript', 'TypeScript', 'React', 'State Management',
        'React Query', 'React Router', 'CSS', 'SASS', 'Webpack',
        'Python', 'Django', 'Node.js', 'MySQL', 'GitHub Actions',
        'Docker', 'Celery', 'Redis'
      ],
    },
    {
      company: "Ground Signal",
      companyUrl: "https://groundsignal.ai/",
      period: "2017 - 2018",
      positions: [
        { title: "Software Engineer", period: "2017 - 2018" }
      ],
      description: "I developed reusable Ractive.js components for a B2B SaaS web application, working closely with a UX designer and product manager to revamp the dashboard. This update included features like fuzzy search, venue filtering, and CSV export functionality for improved usability. Additionally, I implemented scripts for real-time social media data ingestion, which enhanced the product’s analytics capabilities and provided timely insights for users.",
      technologies: [
        'JavaScript', 'Ractive.js', 'Ruby on Rails', 'Python',
      ],
    },
    {
      company: "Carnegie Mellon University",
      companyUrl: "https://www.cmu.edu/",
      period: "2015 - 2017",
      positions: [
        {
          title: "Graduate Research Assistant / Ph.D. Student",
          period: "2015 - 2017"
        },
      ],
      description: "I developed a browser-based model for detecting conversational turns in video communication platforms like Google Hangouts. By analyzing data from 392 Coursera discussion groups with over 1,000 users, I gained insights into how people interact in multi-party video conversations. I also created a JavaScript library for peer-to-peer advice exchange, using findings from Amazon Mechanical Turk studies to better understand how users approach advice-giving and mentorship.",
      technologies: [
        'JavaScript', 'R', 'Python',
      ],
    },
    {
      company: "University of Hartford",
      companyUrl: "https://hartford.edu/",
      period: "2011 - 2015",
      positions: [
        {
          title: "Undergraduate Research Assistant",
          period: "2011 - 2015"
        }
      ],
      description: "I spearheaded the design and development of a collaborative video-based learning platform, enabling threaded discussions directly within video lectures. This platform was adopted by approximately 5,000 learners across three universities. To guide iterative product development and prioritize features, I conducted user interviews, mixed-methods evaluations, and implemented analytics instrumentation. Additionally, I co-authored peer-reviewed publications and contributed to securing a $448k National Science Foundation grant (IIS-1318345) to support this work.",
      technologies: [
        'JavaScript', 'jQuery', 'PHP', 'MySQL', 'Python', 'SPSS',
      ],
    },
    {
      company: "",
      companyUrl: "https://hartford.edu/",
      period: "2010 - 2015",
      positions: [],
      description: "Several internships, co-ops, and part-time work as a web designer and developer unlisted.",
      technologies: [],
    }
  ];

  return { experiences };
}

export function Experience() {
  const { experiences } = useRouteLoaderData('routes/home') as { experiences: ExperienceItemProps[] };

  return (
    <section id="experience" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-24 lg:scroll-mt-24">
      <div>
        <ol>
          {experiences.map((exp, index) => (
            <ExperienceItem key={index} {...exp} />
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Experience;
