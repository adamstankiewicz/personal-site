export interface ProjectImage {
  src: string;
  alt: string;
}

export interface Project {
  title: string;
  description: string;
  href: string;
  githubUrl?: string;
  images?: ProjectImage[];
  technologies?: string[];
  stars?: number;
  installs?: number;
  date?: string | Date;
  period?: string;
}
