"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { LuArrowDown, LuArrowUp, LuPencil, LuTrash2 } from "react-icons/lu";

export function RowActions({
  editHref,
  onDelete,
  onMove,
  isFirst,
  isLast,
}: {
  editHref: string;
  onDelete: () => Promise<void>;
  onMove?: (direction: "up" | "down") => Promise<void>;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  const btn =
    "inline-flex cursor-pointer items-center rounded p-1.5 text-text transition-colors hover:bg-input hover:text-first disabled:opacity-30 disabled:pointer-events-none";

  return (
    <div className="flex items-center justify-end gap-1">
      {onMove && (
        <>
          <button
            aria-label="Move up"
            className={btn}
            disabled={pending || isFirst}
            onClick={() => run(() => onMove("up"))}
          >
            <LuArrowUp />
          </button>
          <button
            aria-label="Move down"
            className={btn}
            disabled={pending || isLast}
            onClick={() => run(() => onMove("down"))}
          >
            <LuArrowDown />
          </button>
        </>
      )}
      <Link href={editHref} aria-label="Edit" className={btn}>
        <LuPencil />
      </Link>
      <button
        aria-label="Delete"
        className={`${btn} hover:text-red-500`}
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this item? This cannot be undone.")) {
            run(onDelete);
          }
        }}
      >
        <LuTrash2 />
      </button>
    </div>
  );
}
