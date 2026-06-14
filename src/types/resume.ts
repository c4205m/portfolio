import type { Lang, Localized } from "./content";

export interface ResumeBasics {
  name: string;
  label: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  summary: Partial<Localized>;
}

export interface ResumeJob {
  classAttr?: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  highlights?: Record<Lang, string[]>;
}

export interface ResumeProject {
  classAttr?: string;
  name: string;
  description: Localized;
  href?: string;
  url?: string;
  label: Localized;
}

export interface ResumeEducation {
  classAttr?: string;
  institution: Localized;
  area: Localized;
  studyType: Localized;
  startDate: string;
  endDate: string;
}

export interface ResumeSkill {
  name: Localized;
  keywords: string[];
}

export interface Resume {
  basics: ResumeBasics;
  work: ResumeJob[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
}
