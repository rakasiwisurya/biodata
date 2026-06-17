"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { LuDownload, LuExternalLink } from "react-icons/lu";
import { useAuth } from "@/lib/auth";
import { listDocs, importStarterData } from "@/lib/firestore";
import type { CollectionName } from "@/lib/types";
import { PageHeader } from "@/components/admin/ui";

const CARDS: { name: CollectionName; label: string; href: string }[] = [
  { name: "skills", label: "Skills", href: "/admin/skills" },
  { name: "experiences", label: "Work Experiences", href: "/admin/experiences" },
  { name: "projects", label: "Projects", href: "/admin/projects" },
  { name: "education", label: "Education", href: "/admin/education" },
  { name: "certificates", label: "Certificates", href: "/admin/certificates" },
  { name: "socials", label: "Social Links", href: "/admin/socials" },
];

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const entries = await Promise.all(
      CARDS.map(async (c) => [c.name, (await listDocs(c.name)).length] as const)
    );
    setCounts(Object.fromEntries(entries));
  }, []);

  useEffect(() => {
    if (isAdmin) refresh().catch(() => {});
  }, [isAdmin, refresh]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  async function handleImport() {
    setImporting(true);
    setMessage(null);
    try {
      await importStarterData();
      await refresh();
      setMessage("Starter CV data imported into Firestore. You can now edit it.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div>
      <PageHeader title="Dashboard" />

      {total === 0 && (
        <div className="mb-6 rounded-xl border border-first/30 bg-first/5 p-5">
          <h2 className="mb-1 text-h3">Get started</h2>
          <p className="mb-4 text-small text-text">
            Firestore is empty — the public site is currently showing the bundled
            CV defaults. Import them into Firestore to make everything editable.
          </p>
          <button
            onClick={handleImport}
            disabled={importing}
            className="button px-4 py-2.5 text-small disabled:opacity-50"
          >
            <LuDownload /> {importing ? "Importing…" : "Import starter CV data"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl bg-container p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="block text-h1 font-semibold text-first">
              {counts[card.name] ?? 0}
            </span>
            <span className="text-small text-text">{card.label}</span>
          </Link>
        ))}
      </div>

      {message && <p className="mt-4 text-small text-green-600">{message}</p>}

      <div className="mt-6 flex flex-wrap gap-4 text-small">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-first hover:underline"
        >
          View public site <LuExternalLink />
        </a>
        <a
          href="/cv"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-first hover:underline"
        >
          View ATS CV <LuExternalLink />
        </a>
      </div>
    </div>
  );
}
