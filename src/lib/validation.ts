import { z } from "zod";

/**
 * All form schemas are string-shaped (matching raw HTML form values).
 * Server actions convert to DB types (numbers, dates, arrays) after parsing.
 */

const optionalString = z.string().optional();

const intInRange = (min: number, max: number, label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= min && n <= max;
    }, `${label} must be an integer between ${min} and ${max}`);

const optionalInt = (label: string) =>
  z.string().optional().refine((v) => {
    if (!v) return true;
    const n = Number(v);
    return Number.isInteger(n) && n > 0;
  }, `${label} must be a positive integer`);

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().min(1, "Headline is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
  aboutDescription: z.string().min(1, "About description is required"),
  avatarUrl: optionalString,
  cvUrl: optionalString,
  email: z.email("Valid email is required"),
  phone: optionalString,
  location: optionalString,
});
export type ProfileFormValues = z.infer<typeof profileSchema>;

export const socialSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().min(1, "URL is required"),
});
export type SocialFormValues = z.infer<typeof socialSchema>;

export const SKILL_CATEGORIES = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "MOBILE",
  "OTHER",
] as const;

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(SKILL_CATEGORIES),
  proficiency: intInRange(0, 100, "Proficiency"),
});
export type SkillFormValues = z.infer<typeof skillSchema>;

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  location: optionalString,
  startDate: z.string().min(1, "Start date is required"),
  endDate: optionalString,
  summary: optionalString,
});
export type ExperienceFormValues = z.infer<typeof experienceSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  responsibilities: optionalString, // one per line
  techStack: optionalString, // comma separated
  teamSize: optionalInt("Team size"),
  periodStart: optionalString,
  periodEnd: optionalString,
  imageUrl: optionalString,
  demoUrl: optionalString,
  repoUrl: optionalString,
  featured: z.boolean(),
  company: optionalString,
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const educationSchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: optionalString,
  startYear: intInRange(1900, 2100, "Start year"),
  endYear: z.string().optional().refine((v) => {
    if (!v) return true;
    const n = Number(v);
    return Number.isInteger(n) && n >= 1900 && n <= 2100;
  }, "End year must be a valid year"),
  gpa: optionalString,
  description: optionalString,
});
export type EducationFormValues = z.infer<typeof educationSchema>;

export const CERTIFICATE_KINDS = ["CERTIFICATE", "AWARD"] as const;

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  kind: z.enum(CERTIFICATE_KINDS),
  issueDate: optionalString,
  credentialUrl: optionalString,
});
export type CertificateFormValues = z.infer<typeof certificateSchema>;
