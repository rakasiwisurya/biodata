"use server";

import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/lib/validation";
import {
  type ActionResult,
  commaList,
  lines,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
  toDate,
  toNullable,
} from "./helpers";

export async function saveProject(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;
  const data = {
    title: v.title,
    description: v.description,
    responsibilities: lines(v.responsibilities),
    techStack: commaList(v.techStack),
    teamSize: v.teamSize ? Number(v.teamSize) : null,
    periodStart: toDate(v.periodStart),
    periodEnd: toDate(v.periodEnd),
    imageUrl: toNullable(v.imageUrl),
    demoUrl: toNullable(v.demoUrl),
    repoUrl: toNullable(v.repoUrl),
    featured: v.featured,
    workExperienceId: toNullable(v.workExperienceId),
  };
  if (id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({
      data: { ...data, order: await nextOrder(prisma.project) },
    });
  }
  revalidateSite("/admin/projects");
  return { ok: true };
}

export async function deleteProject(id: string): Promise<void> {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidateSite("/admin/projects");
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.project, id, direction);
  revalidateSite("/admin/projects");
}
