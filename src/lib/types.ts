// Plain data types (no ORM). Dates are stored as ISO strings in Firestore
// and in the bundled defaults, so everything stays serializable.

export type SkillCategory =
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "DEVOPS"
  | "MOBILE"
  | "OTHER";

export type CertificateKind = "CERTIFICATE" | "AWARD";

export interface Profile {
  name: string;
  headline: string;
  heroDescription: string;
  aboutDescription: string;
  avatarUrl: string;
  cvUrl: string;
  email: string;
  phone: string;
  location: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string; // ISO date (yyyy-mm-dd)
  endDate: string; // ISO date or "" for Present
  summary: string;
  order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  techStack: string[];
  teamSize: number | null;
  periodStart: string;
  periodEnd: string;
  imageUrl: string;
  demoUrl: string;
  repoUrl: string;
  featured: boolean;
  order: number;
  /** Company name shown as a chip; replaces the old WorkExperience relation. */
  company: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number | null;
  gpa: string;
  description: string;
  order: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  kind: CertificateKind;
  issueDate: string;
  credentialUrl: string;
  order: number;
}

export interface PortfolioData {
  profile: Profile;
  socials: SocialLink[];
  skills: Skill[];
  experiences: WorkExperience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
}

export const COLLECTIONS = {
  skills: "skills",
  experiences: "experiences",
  projects: "projects",
  education: "education",
  certificates: "certificates",
  socials: "socials",
} as const;

export type CollectionName = keyof typeof COLLECTIONS;
