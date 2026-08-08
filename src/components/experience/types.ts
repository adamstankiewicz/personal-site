export interface Position {
  title: string;
  period: string;
}

export interface ExperienceItemProps {
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
