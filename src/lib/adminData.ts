// Client-side admin operations. These run in the browser via the Firebase
// Web SDK; Firestore security rules enforce that only allowlisted admins can
// actually write. Each returns a small result object the forms can surface.

import {
  getProfile as fsGetProfile,
  saveProfile as fsSaveProfile,
  upsertDoc,
  nextOrder,
} from "./firestore";
import {
  certificateSchema,
  educationSchema,
  experienceSchema,
  profileSchema,
  projectSchema,
  skillSchema,
  socialSchema,
} from "./validation";
import type { Profile } from "./types";

export type ActionResult = { ok: true } | { ok: false; error: string };

const str = (v: string | undefined | null) => (v ?? "").trim();
const lines = (v: string | undefined | null) =>
  (v ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
const commaList = (v: string | undefined | null) =>
  (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);

export async function saveProfile(values: unknown): Promise<ActionResult> {
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  const existing = await fsGetProfile();
  const profile: Profile = {
    name: v.name,
    headline: v.headline,
    heroDescription: v.heroDescription,
    aboutDescription: v.aboutDescription,
    avatarUrl: str(v.avatarUrl) || existing.avatarUrl || "/profile.png",
    cvUrl: str(v.cvUrl) || existing.cvUrl || "/cv/CV_Rakasiwi_Surya.pdf",
    email: v.email,
    phone: str(v.phone),
    location: str(v.location),
  };
  try {
    await fsSaveProfile(profile);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveSkill(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("skills", id ?? "", {
      name: v.name,
      category: v.category,
      proficiency: Number(v.proficiency),
      ...(id ? {} : { order: await nextOrder("skills") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveSocial(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = socialSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("socials", id ?? "", {
      platform: v.platform,
      url: v.url,
      ...(id ? {} : { order: await nextOrder("socials") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveExperience(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = experienceSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("experiences", id ?? "", {
      company: v.company,
      position: v.position,
      location: str(v.location),
      startDate: v.startDate,
      endDate: str(v.endDate),
      summary: str(v.summary),
      ...(id ? {} : { order: await nextOrder("experiences") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveProject(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("projects", id ?? "", {
      title: v.title,
      description: v.description,
      responsibilities: lines(v.responsibilities),
      techStack: commaList(v.techStack),
      teamSize: v.teamSize ? Number(v.teamSize) : null,
      periodStart: str(v.periodStart),
      periodEnd: str(v.periodEnd),
      imageUrl: str(v.imageUrl),
      demoUrl: str(v.demoUrl),
      repoUrl: str(v.repoUrl),
      featured: v.featured,
      company: str(v.company),
      ...(id ? {} : { order: await nextOrder("projects") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveEducation(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = educationSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("education", id ?? "", {
      institution: v.institution,
      degree: v.degree,
      fieldOfStudy: str(v.fieldOfStudy),
      startYear: Number(v.startYear),
      endYear: v.endYear ? Number(v.endYear) : null,
      gpa: str(v.gpa),
      description: str(v.description),
      ...(id ? {} : { order: await nextOrder("education") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

export async function saveCertificate(id: string | null, values: unknown): Promise<ActionResult> {
  const parsed = certificateSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const v = parsed.data;
  try {
    await upsertDoc("certificates", id ?? "", {
      title: v.title,
      issuer: v.issuer,
      kind: v.kind,
      issueDate: str(v.issueDate),
      credentialUrl: str(v.credentialUrl),
      ...(id ? {} : { order: await nextOrder("certificates") }),
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: errMsg(e) };
  }
}

function errMsg(e: unknown): string {
  if (e instanceof Error) {
    if (e.message.includes("permission") || e.message.includes("PERMISSION")) {
      return "Permission denied — your account is not on the admin allowlist in the Firestore rules.";
    }
    return e.message;
  }
  return "Something went wrong";
}
