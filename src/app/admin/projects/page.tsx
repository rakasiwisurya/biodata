"use client";

import { EntityList } from "@/components/admin/EntityList";
import { formatPeriod } from "@/lib/format";
import type { Project } from "@/lib/types";

export default function ProjectsAdminPage() {
  return (
    <EntityList<Project>
      collectionName="projects"
      title="Projects"
      editBase="/admin/projects/edit"
      emptyMessage="No projects yet. Add your first one."
      columns={[
        {
          header: "Title",
          render: (p) => (
            <span className="font-medium text-title">
              {p.title}
              {p.featured && (
                <span className="ml-2 rounded bg-first/15 px-1.5 py-0.5 text-smaller text-first">
                  Featured
                </span>
              )}
            </span>
          ),
        },
        { header: "Company", render: (p) => p.company || "—" },
        { header: "Period", render: (p) => formatPeriod(p.periodStart, p.periodEnd) || "—" },
      ]}
    />
  );
}
