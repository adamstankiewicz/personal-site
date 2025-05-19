import { useRouteLoaderData } from 'react-router';
import { Project } from './types';
import { ProjectCard } from './ProjectCard';

export const projects: Project[] = [
  {
    title: 'Paragon, Design System & Component Library',
    description: 'Developed and maintained Paragon, an open-source design system and React component library providing the UI foundation for the Open edX learning platform, empowering product teams to build consistent and accessible user interfaces.',
    href: 'https://paragon-openedx-v22.netlify.app',
    githubUrl: 'https://github.com/openedx/paragon',
    images: [
      {
        src: '/images/projects/paragon.png',
        alt: 'Paragon home page',
      },
      {
        src: '/images/projects/paragon-colors.png',
        alt: 'Paragon color palette',
      },
      {
        src: '/images/projects/paragon-button.png',
        alt: 'Paragon button component',
      },
      {
        src: '/images/projects/paragon-pagination.png',
        alt: 'Paragon pagination component',
      },
      {
        src: '/images/projects/paragon-usage.png',
        alt: 'Paragon usage insights',
      },
    ],
    technologies: [
      'JavaScript',
      'TypeScript',
      'React',
      'Style Dictionary',
      'CSS',
      'Sass',
      'Gatsby',
      'GitHub Actions',
      'Figma',
    ],
    stars: 130,
    installs: 4000000,
  },
  {
    title: 'edX Enterprise',
    description: 'Led the frontend architecture for the enterprise platform at edX, providing comprehensive solutions for both learners and administrators. The platform supports user onboarding, content discovery, course enrollment, and administrative management for enterprise customers.',
    href: 'https://business.edx.org',
    images: [
      {
        src: '/images/projects/enterprise-learner-dashboard.png',
        alt: 'Enterprise Learner Portal - Dashboard',
      },
      {
        src: '/images/projects/enterprise-learner-search.png',
        alt: 'Enterprise Learner Portal - Search',
      },
      {
        src: '/images/projects/enterprise-learner-course.png',
        alt: 'Enterprise Learner Portal - Course',
      },
      {
        src: '/images/projects/enterprise-admin-learner-credit.png',
        alt: 'Enterprise Admin Portal - Learner Credit',
      },
      {
        src: '/images/projects/enterprise-admin-learner-credit-assignment-allocation.png',
        alt: 'Enterprise Admin Portal - Learner Credit Allocation',
      },
      {
        src: '/images/projects/enterprise-admin-highlights.png',
        alt: 'Enterprise Admin Portal - Highlights',
      },
    ],
    technologies: [
      'JavaScript',
      'TypeScript',
      'React',
      'React Router',
      'State Management',
      'React Query',
      'Redux',
      'Python',
      'Django',
      'MySQL',
      'Redis',
      'Celery',
      'GitHub Actions',
      'Docker',
    ],
  },
];

// Export the loader function
export async function loader() {
  return { projects };
}

// Export the Projects component
export function Projects() {
  const { projects } = useRouteLoaderData('routes/home') as { projects: Project[] };

  return (
    <section id="projects" className="mb-16 scroll-mt-16 md:mb-24 lg:mb-24 lg:scroll-mt-24">
      <div>
        <ol className="group/list">
          {projects.map((project, index) => (
            <div key={index}>
              <ProjectCard project={project} />
            </div>
          ))}
        </ol>
      </div>
    </section>
  );
}
