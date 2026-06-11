"use server";

import { prisma } from "@/lib/prisma";
import { skillSchema } from "@/lib/validation";
import {
  type ActionResult,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
} from "./helpers";

export async function saveSkill(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = skillSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const data = {
    name: parsed.data.name,
    category: parsed.data.category,
    proficiency: Number(parsed.data.proficiency),
  };
  if (id) {
    await prisma.skill.update({ where: { id }, data });
  } else {
    await prisma.skill.create({
      data: { ...data, order: await nextOrder(prisma.skill) },
    });
  }
  revalidateSite("/admin/skills");
  return { ok: true };
}

export async function deleteSkill(id: string): Promise<void> {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidateSite("/admin/skills");
}

export async function moveSkill(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.skill, id, direction);
  revalidateSite("/admin/skills");
}
