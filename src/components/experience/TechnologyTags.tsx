interface TechnologyTagsProps {
  technologies: string[];
}

export function TechnologyTags({ technologies }: TechnologyTagsProps) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap" aria-label="Technologies used:">
      {technologies.map((tech) => (
        <li key={tech} className="mr-1.5 mt-2">
          <div className="flex items-center rounded-full border border-sky-700/20 bg-white px-3 py-1 text-xs font-medium leading-5 text-sky-700 shadow-sm">
            {tech}
          </div>
        </li>
      ))}
    </ul>
  );
}
