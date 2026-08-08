export interface ProjectImage {
  src: string;
  alt: string;
}

export interface ProjectFigure {
  label: string;
  value: string;
}

export interface ProjectDetail {
  label: string;
  text: string;
}

export interface Project {
  title: string;
  description: string;
  href?: string;
  githubUrl?: string;
  images?: ProjectImage[];
  figures?: ProjectFigure[];
  figuresNote?: string;
  details?: ProjectDetail[];
  capabilities?: string[];
  technologies?: string[];
  replay?: boolean;
  stars?: number;
  installs?: number;
  date?: string | Date;
  period?: string;
}
