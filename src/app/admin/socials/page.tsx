"use client";

import { EntityList } from "@/components/admin/EntityList";
import type { SocialLink } from "@/lib/types";

export default function SocialsAdminPage() {
  return (
    <EntityList<SocialLink>
      collectionName="socials"
      title="Social Links"
      editBase="/admin/socials/edit"
      emptyMessage="No social links yet. Add your first one."
      columns={[
        { header: "Platform", render: (s) => <span className="font-medium text-title">{s.platform}</span> },
        { header: "URL", render: (s) => <span className="break-all">{s.url}</span> },
      ]}
    />
  );
}
