"use server";

import { prisma } from "@/lib/prisma";
import { certificateSchema } from "@/lib/validation";
import {
  type ActionResult,
  nextOrder,
  requireAdmin,
  revalidateSite,
  swapOrder,
  toDate,
  toNullable,
} from "./helpers";

export async function saveCertificate(
  id: string | null,
  values: unknown
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = certificateSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const v = parsed.data;
  const data = {
    title: v.title,
    issuer: v.issuer,
    kind: v.kind,
    issueDate: toDate(v.issueDate),
    credentialUrl: toNullable(v.credentialUrl),
  };
  if (id) {
    await prisma.certificate.update({ where: { id }, data });
  } else {
    await prisma.certificate.create({
      data: { ...data, order: await nextOrder(prisma.certificate) },
    });
  }
  revalidateSite("/admin/certificates");
  return { ok: true };
}

export async function deleteCertificate(id: string): Promise<void> {
  await requireAdmin();
  await prisma.certificate.delete({ where: { id } });
  revalidateSite("/admin/certificates");
}

export async function moveCertificate(
  id: string,
  direction: "up" | "down"
): Promise<void> {
  await requireAdmin();
  await swapOrder(prisma.certificate, id, direction);
  revalidateSite("/admin/certificates");
}
