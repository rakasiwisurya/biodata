"use client";

import { EntityList } from "@/components/admin/EntityList";
import { formatPeriod } from "@/lib/format";
import type { WorkExperience } from "@/lib/types";

export default function ExperiencesAdminPage() {
  return (
    <EntityList<WorkExperience>
      collectionName="experiences"
      title="Work Experience"
      editBase="/admin/experiences/edit"
      emptyMessage="No work experience yet. Add your first one."
      columns={[
        { header: "Company", render: (e) => <span className="font-medium text-title">{e.company}</span> },
        { header: "Position", render: (e) => e.position },
        { header: "Period", render: (e) => formatPeriod(e.startDate, e.endDate) },
      ]}
    />
  );
}
