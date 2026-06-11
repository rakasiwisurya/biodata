import { PageHeader } from "@/components/admin/ui";
import { EducationForm } from "@/components/admin/forms/EducationForm";

export default function NewEducationPage() {
  return (
    <div>
      <PageHeader title="New education" />
      <EducationForm
        id={null}
        defaultValues={{
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          gpa: "",
          description: "",
        }}
      />
    </div>
  );
}
