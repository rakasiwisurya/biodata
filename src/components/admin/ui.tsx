import Link from "next/link";
import { LuPlus } from "react-icons/lu";

export const inputCls =
  "w-full rounded-lg bg-input px-3 py-2 text-normal text-title outline-none ring-first/40 focus:ring-2";

export const labelCls = "mb-1 block text-small font-medium text-title";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {error && <p className="mt-1 text-smaller text-red-500">{error}</p>}
    </div>
  );
}

export function PageHeader({
  title,
  newHref,
}: {
  title: string;
  newHref?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h1 className="text-h2">{title}</h1>
      {newHref && (
        <Link href={newHref} className="button px-3 py-2 text-small">
          <LuPlus /> Add new
        </Link>
      )}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-container p-6 text-center text-small text-text-light">
      {message}
    </p>
  );
}

export const tableCls = "w-full overflow-hidden rounded-lg bg-container text-left";
export const thCls = "px-4 py-3 text-small font-semibold text-title";
export const tdCls = "px-4 py-3 text-small align-top";
export const trCls = "border-t border-body";
