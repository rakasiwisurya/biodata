"use server";

import { prisma } from "@/lib/prisma";
import { educationSchema } from "@/lib/validation";
import {
  type ActionResult,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
  toNullable,
} from "./helpers";

export async function saveEducation(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = educationSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;
  const data = {
    institution: v.institution,
    degree: v.degree,
    fieldOfStudy: toNullable(v.fieldOfStudy),
    startYear: Number(v.startYear),
    endYear: v.endYear ? Number(v.endYear) : null,
    gpa: toNullable(v.gpa),
    description: toNullable(v.description),
  };
  if (id) {
    await prisma.education.update({ where: { id }, data });
  } else {
    await prisma.education.create({
      data: { ...data, order: await nextOrder(prisma.education) },
    });
  }
  revalidateSite("/admin/education");
  return { ok: true };
}

export async function deleteEducation(id: string): Promise<void> {
  await requireAdmin();
  await prisma.education.delete({ where: { id } });
  revalidateSite("/admin/education");
}

export async function moveEducation(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.education, id, direction);
  revalidateSite("/admin/education");
}
