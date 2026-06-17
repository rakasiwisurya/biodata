"use client";

import { EntityList } from "@/components/admin/EntityList";
import type { Education } from "@/lib/types";

export default function EducationAdminPage() {
  return (
    <EntityList<Education>
      collectionName="education"
      title="Education"
      editBase="/admin/education/edit"
      emptyMessage="No education entries yet. Add your first one."
      columns={[
        { header: "Institution", render: (e) => <span className="font-medium text-title">{e.institution}</span> },
        { header: "Degree", render: (e) => e.degree },
        { header: "Years", render: (e) => `${e.startYear} – ${e.endYear ?? "Present"}` },
      ]}
    />
  );
}
