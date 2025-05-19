import type { Route } from "./+types/home";
import { About } from "@/components/about/about";
import { Experience, loader as experienceLoader } from "@/components/experience";
import { Projects, loader as projectsLoader } from "@/components/projects";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Adam Stankiewicz" },
    { name: "description", content: "Adam Stankiewicz" },
  ];
}

// Data loader for the route
export async function loader() {
  const [experiences, projects] = await Promise.all([
    experienceLoader(),
    projectsLoader()
  ]);
  
  return {
    experiences: experiences.experiences,
    projects: projects.projects
  };
}

// Default export the component
export default function Home() {
  return (
    <>
      <About />
      <Experience />
      <Projects />
    </>
  );
}
