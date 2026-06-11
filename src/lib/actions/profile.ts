"use server";

import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validation";
import {
  type ActionResult,
  requireAdmin,
  revalidateSite,
  toNullable,
} from "./helpers";

export async function saveProfile(values: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = profileSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;
  const data = {
    name: v.name,
    headline: v.headline,
    heroDescription: v.heroDescription,
    aboutDescription: v.aboutDescription,
    avatarUrl: toNullable(v.avatarUrl),
    cvUrl: toNullable(v.cvUrl),
    email: v.email,
    phone: toNullable(v.phone),
    location: toNullable(v.location),
  };
  await prisma.profile.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });
  revalidateSite("/admin/profile");
  return { ok: true };
}
