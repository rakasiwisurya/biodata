"use client";

import { EditScreen } from "@/components/admin/EditScreen";
import { EducationForm } from "@/components/admin/forms/EducationForm";
import type { EducationFormValues } from "@/lib/validation";
import type { Education } from "@/lib/types";

export default function EditEducationPage() {
  return (
    <EditScreen<EducationFormValues, Education>
      collectionName="education"
      newTitle="New education"
      editTitle={(e) => `Edit education — ${e.institution}`}
      emptyValues={{
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
        gpa: "",
        description: "",
      }}
      mapDoc={(e) => ({
        institution: e.institution,
        degree: e.degree,
        fieldOfStudy: e.fieldOfStudy,
        startYear: String(e.startYear),
        endYear: e.endYear ? String(e.endYear) : "",
        gpa: e.gpa,
        description: e.description,
      })}
      render={(id, values) => <EducationForm id={id} defaultValues={values} />}
    />
  );
}
