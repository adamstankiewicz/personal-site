export interface ProjectImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** When set, the slide is a muted looping video; `src` is its poster. */
  videoSrc?: string;
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
}
