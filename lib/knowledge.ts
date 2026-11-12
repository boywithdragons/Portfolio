import experienceData from "@/data/knowledge-base/experience.json";
import faqData from "@/data/knowledge-base/faq.json";
import profileData from "@/data/knowledge-base/profile.json";
import projectsData from "@/data/knowledge-base/projects.json";
import skillsData from "@/data/knowledge-base/skills.json";

import type {
  Credentials,
  ExperienceRole,
  KnowledgeEntry,
  Project,
  SkillCategory,
} from "@/lib/types";

interface KnowledgeFile {
  meta: { name: string; description: string; updated: string };
  entries: KnowledgeEntry[];
}

const files = [experienceData, profileData, skillsData, projectsData, faqData] as unknown as KnowledgeFile[];

export const knowledgeBase: KnowledgeEntry[] = files.flatMap((file) => file.entries);

export const knowledgeSources = [
  { file: "profile.json", label: "Profile", count: profileData.entries.length },
  { file: "experience.json", label: "Experience", count: experienceData.entries.length },
  { file: "skills.json", label: "Skills", count: skillsData.entries.length },
  { file: "projects.json", label: "Projects", count: projectsData.entries.length },
  { file: "faq.json", label: "FAQ", count: faqData.entries.length },
];

export const projects = projectsData.projects as unknown as Project[];

export const skillCategories = skillsData.categories as unknown as SkillCategory[];

export const experienceRoles = experienceData.roles as unknown as ExperienceRole[];

export const credentials = profileData.credentials as unknown as Credentials;
