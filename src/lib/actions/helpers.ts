import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

export function revalidateSite(adminPath: string) {
  revalidatePath("/");
  revalidatePath(adminPath);
}

export function toDate(value: string | undefined | null): Date | null {
  return value ? new Date(value) : null;
}

export function toNullable(value: string | undefined | null): string | null {
  return value ? value : null;
}

export function lines(value: string | undefined | null): string[] {
  return (value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function commaList(value: string | undefined | null): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

type OrderedRow = { id: string; order: number };

type OrderedDelegate = {
  findMany(args: {
    orderBy: { order: "asc" };
    select: { id: true; order: true };
  }): Promise<OrderedRow[]>;
  update(args: {
    where: { id: string };
    data: { order: number };
  }): unknown;
};

/** Swap a row with its neighbor, renumbering all rows sequentially. */
export async function swapOrder(
  delegate: OrderedDelegate,
  id: string,
  direction: "up" | "down"
) {
  const rows = await delegate.findMany({
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });
  const idx = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapWith < 0 || swapWith >= rows.length) return;

  const reordered = [...rows];
  [reordered[idx], reordered[swapWith]] = [reordered[swapWith], reordered[idx]];

  await prisma.$transaction(
    reordered.map(
      (r, i) =>
        delegate.update({
          where: { id: r.id },
          data: { order: i },
        }) as Prisma.PrismaPromise<unknown>
    )
  );
}

export async function nextOrder(delegate: {
  aggregate(args: { _max: { order: true } }): Promise<{ _max: { order: number | null } }>;
}): Promise<number> {
  const result = await delegate.aggregate({ _max: { order: true } });
  return (result._max.order ?? -1) + 1;
}
