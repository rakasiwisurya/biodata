import { PageHeader } from "@/components/admin/ui";
import { SkillForm } from "@/components/admin/forms/SkillForm";

export default function NewSkillPage() {
  return (
    <div>
      <PageHeader title="New skill" />
      <SkillForm
        id={null}
        defaultValues={{ name: "", category: "FRONTEND", proficiency: "80" }}
      />
    </div>
  );
}
