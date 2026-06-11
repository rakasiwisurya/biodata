"use server";

import { prisma } from "@/lib/prisma";
import { socialSchema } from "@/lib/validation";
import {
  type ActionResult,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
} from "./helpers";

export async function saveSocial(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = socialSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  if (id) {
    await prisma.socialLink.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.socialLink.create({
      data: { ...parsed.data, order: await nextOrder(prisma.socialLink) },
    });
  }
  revalidateSite("/admin/socials");
  return { ok: true };
}

export async function deleteSocial(id: string): Promise<void> {
  await requireAdmin();
  await prisma.socialLink.delete({ where: { id } });
  revalidateSite("/admin/socials");
}

export async function moveSocial(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.socialLink, id, direction);
  revalidateSite("/admin/socials");
}
