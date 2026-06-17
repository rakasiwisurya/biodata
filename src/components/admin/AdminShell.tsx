"use client";

import { FaGoogle } from "react-icons/fa6";
import { LuLogOut, LuTriangleAlert } from "react-icons/lu";
import { useAuth } from "@/lib/auth";
import { AdminNav } from "./AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin, configured, signIn, signOut } = useAuth();

  if (!configured) {
    return (
      <Centered>
        <LuTriangleAlert className="mb-3 text-4xl text-amber-500" />
        <h1 className="mb-2 text-h2">Firebase not configured</h1>
        <p className="max-w-md text-small text-text-light">
          Set the <code>NEXT_PUBLIC_FIREBASE_*</code> environment variables in
          <code> .env.local</code>, then rebuild. See the README for the exact
          keys.
        </p>
      </Centered>
    );
  }

  if (loading) {
    return (
      <Centered>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-first border-t-transparent" />
      </Centered>
    );
  }

  if (!user) {
    return (
      <Centered>
        <h1 className="mb-2 text-h2">Admin sign in</h1>
        <p className="mb-6 max-w-md text-small text-text-light">
          Sign in with an authorized Google account to manage your portfolio.
        </p>
        <button onClick={() => signIn()} className="button px-5 py-3">
          <FaGoogle /> Sign in with Google
        </button>
      </Centered>
    );
  }

  if (!isAdmin) {
    return (
      <Centered>
        <h1 className="mb-2 text-h2">Not authorized</h1>
        <p className="mb-6 max-w-md text-small text-text-light">
          <strong>{user.email}</strong> is not on the admin allowlist.
        </p>
        <button onClick={() => signOut()} className="button px-4 py-2.5 text-small">
          <LuLogOut /> Sign out
        </button>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-scroll-bar bg-container md:flex md:min-h-screen md:w-60 md:shrink-0 md:flex-col md:border-b-0 md:border-r">
        <div className="px-4 pb-2 pt-4 md:pb-4">
          <span className="block font-semibold text-title">Admin Dashboard</span>
          <span className="block truncate text-smaller text-text-light">{user.email}</span>
        </div>
        <AdminNav />
        <div className="px-4 py-3 md:mt-auto">
          <button
            onClick={() => signOut()}
            className="inline-flex cursor-pointer items-center gap-2 text-small text-text transition-colors hover:text-red-500"
          >
            <LuLogOut /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      {children}
    </div>
  );
}
