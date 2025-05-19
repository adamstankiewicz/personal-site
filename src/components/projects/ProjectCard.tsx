import { Project } from './types';
import { TechnologyTags } from '../experience/TechnologyTags';
import { useState } from 'react';
import { ImageCarousel } from '../ui/ImageCarousel';
import { CompanyHeader } from '../experience/CompanyHeader';

export function ProjectCard({ project }: { project: Project }) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { images = [] } = project;
  const featuredImage = images[0];

  const openCarousel = (index: number) => {
    if (images.length === 0) return;
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  // Format date range
  const dateRange = project.date
    ? new Date(project.date).getFullYear().toString()
    : project.period || '';

  return (
    <li className="mb-24">
      <div className="pb-1">
        <div className="mb-2 mt-1">
          <header className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {dateRange}
          </header>
        </div>
        <div>
          <CompanyHeader
            company={project.title}
            companyUrl={project.href}
            isProject={true}
          />

          {/* Project Images */}
          {images.length > 0 && (
            <div className="mt-4 mb-6 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800">
              <div
                onClick={() => openCarousel(0)}
                className="relative overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 rounded-lg"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openCarousel(0);
                  }
                }}
                role="button"
                aria-haspopup="dialog"
                aria-label={`View ${project.title} project images`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={featuredImage.src}
                    alt={featuredImage.alt || project.title}
                    className="w-full h-auto max-h-80 object-contain bg-white dark:bg-slate-900 p-4 transition-all duration-300 ease-out hover:scale-[1.02] group-focus-visible:scale-[1.02] shadow-sm hover:shadow-md group-focus-visible:shadow-md"
                    loading="lazy"
                  />
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{images.length - 1} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Description */}
          <p className="mt-4 text-sm leading-normal text-slate-700 dark:text-slate-300">
            {project.description}
          </p>

          {/* Stats */}
          {(project.stars || project.installs) && (
            <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              {project.stars && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mr-1 h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {project.stars.toLocaleString()}
                </a>
              )}
              {project.installs && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mr-1 h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v4.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 10.586V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {project.installs.toLocaleString()}+ Installs
                </a>
              )}
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mt-4">
              <TechnologyTags technologies={project.technologies} />
            </div>
          )}
        </div>
      </div>

      {/* Image Carousel Modal */}
      {isCarouselOpen && images.length > 0 && (
        <ImageCarousel
          images={images}
          defaultIndex={selectedImageIndex}
          onClose={() => setIsCarouselOpen(false)}
        />
      )}
    </li>
  );
}
