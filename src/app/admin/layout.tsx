import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { LuLogOut } from "react-icons/lu";

export const metadata = { title: "Admin — Rakasiwi Surya", robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-scroll-bar bg-container md:flex md:min-h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="px-4 pb-2 pt-4 md:pb-4">
          <span className="block font-semibold text-title">Admin Dashboard</span>
          <span className="block truncate text-smaller text-text-light">
            {session.user.email}
          </span>
        </div>
        <AdminNav />
        <form
          className="px-4 py-3 md:mt-auto"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center gap-2 text-small text-text transition-colors hover:text-red-500"
          >
            <LuLogOut /> Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
