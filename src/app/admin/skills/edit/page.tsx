"use client";

import { EditScreen } from "@/components/admin/EditScreen";
import { SkillForm } from "@/components/admin/forms/SkillForm";
import type { SkillFormValues } from "@/lib/validation";
import type { Skill } from "@/lib/types";

export default function EditSkillPage() {
  return (
    <EditScreen<SkillFormValues, Skill>
      collectionName="skills"
      newTitle="New skill"
      editTitle={(s) => `Edit skill — ${s.name}`}
      emptyValues={{ name: "", category: "FRONTEND", proficiency: "80" }}
      mapDoc={(s) => ({
        name: s.name,
        category: s.category,
        proficiency: String(s.proficiency),
      })}
      render={(id, values) => <SkillForm id={id} defaultValues={values} />}
    />
  );
}
