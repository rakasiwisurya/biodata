"use server";

import { prisma } from "@/lib/prisma";
import { experienceSchema } from "@/lib/validation";
import {
  type ActionResult,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
  toDate,
  toNullable,
} from "./helpers";

export async function saveExperience(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = experienceSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;
  const data = {
    company: v.company,
    position: v.position,
    location: toNullable(v.location),
    startDate: new Date(v.startDate),
    endDate: toDate(v.endDate),
    summary: toNullable(v.summary),
  };
  if (id) {
    await prisma.workExperience.update({ where: { id }, data });
  } else {
    await prisma.workExperience.create({
      data: { ...data, order: await nextOrder(prisma.workExperience) },
    });
  }
  revalidateSite("/admin/experiences");
  return { ok: true };
}

export async function deleteExperience(id: string): Promise<void> {
  await requireAdmin();
  await prisma.workExperience.delete({ where: { id } });
  revalidateSite("/admin/experiences");
}

export async function moveExperience(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.workExperience, id, direction);
  revalidateSite("/admin/experiences");
}
