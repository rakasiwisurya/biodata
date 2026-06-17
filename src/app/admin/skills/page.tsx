"use client";

import { EntityList } from "@/components/admin/EntityList";
import type { Skill } from "@/lib/types";

export default function SkillsAdminPage() {
  return (
    <EntityList<Skill>
      collectionName="skills"
      title="Skills"
      editBase="/admin/skills/edit"
      emptyMessage="No skills yet. Add your first one."
      columns={[
        { header: "Name", render: (s) => <span className="font-medium text-title">{s.name}</span> },
        { header: "Category", render: (s) => s.category },
        { header: "Proficiency", render: (s) => `${s.proficiency}%` },
      ]}
    />
  );
}
