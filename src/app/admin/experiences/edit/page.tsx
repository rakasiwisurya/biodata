"use client";

import { EditScreen } from "@/components/admin/EditScreen";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";
import type { ExperienceFormValues } from "@/lib/validation";
import type { WorkExperience } from "@/lib/types";

export default function EditExperiencePage() {
  return (
    <EditScreen<ExperienceFormValues, WorkExperience>
      collectionName="experiences"
      newTitle="New work experience"
      editTitle={(e) => `Edit experience — ${e.company}`}
      emptyValues={{
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        summary: "",
      }}
      mapDoc={(e) => ({
        company: e.company,
        position: e.position,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        summary: e.summary,
      })}
      render={(id, values) => <ExperienceForm id={id} defaultValues={values} />}
    />
  );
}
