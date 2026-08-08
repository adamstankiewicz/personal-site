export interface Position {
  title: string;
  period: string;
}

export interface ExperienceItemProps {
  fix?: string;
  company: string;
  companyUrl: string;
  period: string;
  positions: Position[];
  description: string;
  technologies: string[];
}

export interface ExperienceData {
  experiences: ExperienceItemProps[];
}
