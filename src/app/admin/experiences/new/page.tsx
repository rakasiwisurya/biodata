import { PageHeader } from "@/components/admin/ui";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div>
      <PageHeader title="New work experience" />
      <ExperienceForm
        id={null}
        defaultValues={{
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          summary: "",
        }}
      />
    </div>
  );
}
