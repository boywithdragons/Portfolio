export type KnowledgeCategory =
  | "me"
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "fun"
  | "education";

export interface KnowledgeEntry {
  id: string;
  category: KnowledgeCategory;
  title: string;
  keywords: string[];
  question?: string;
  answer: string;
  source: string;
  href?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  features: string[];
  impact: { value: string; label: string }[];
  tech: string[];
  links: {
    live: string;
    source: string;
  };
  image: string;
  imageLink?: string;
  imageAlt: string;
}

export interface Skill {
  name: string;
  icon: string;
  level: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  blurb: string;
  skills: Skill[];
}

export interface ExperienceRole {
  id: string;
  title: string;
  track: string;
  company: string;
  location: string;
  start: string;
  end: string;
  dateLabel: string;
  current: boolean;
  summary: string;
  bullets: string[];
  tags: string[];
}

export interface CredentialItem {
  degree: string;
  school: string;
  period: string;
  status: string;
}

export interface Credentials {
  education: CredentialItem[];
  certifications: string[];
}
