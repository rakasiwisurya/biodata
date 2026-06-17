"use client";

import { EntityList } from "@/components/admin/EntityList";
import type { Certificate } from "@/lib/types";

export default function CertificatesAdminPage() {
  return (
    <EntityList<Certificate>
      collectionName="certificates"
      title="Certificates & Achievements"
      editBase="/admin/certificates/edit"
      emptyMessage="No certificates yet. Add your first one."
      columns={[
        { header: "Title", render: (c) => <span className="font-medium text-title">{c.title}</span> },
        { header: "Issuer", render: (c) => c.issuer },
        {
          header: "Kind",
          render: (c) =>
            c.kind === "AWARD" ? (
              <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-smaller font-medium text-amber-600 dark:text-amber-400">
                Award
              </span>
            ) : (
              "Certificate"
            ),
        },
      ]}
    />
  );
}
