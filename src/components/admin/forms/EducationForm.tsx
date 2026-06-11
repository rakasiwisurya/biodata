"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema, type EducationFormValues } from "@/lib/validation";
import { saveEducation } from "@/lib/actions/education";
import { Field, inputCls } from "@/components/admin/ui";

export function EducationForm({
  id,
  defaultValues,
}: {
  id: string | null;
  defaultValues: EducationFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues,
  });

  async function onSubmit(values: EducationFormValues) {
    const result = await saveEducation(id, values);
    if (result.ok) {
      router.push("/admin/education");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <Field label="Institution" error={errors.institution?.message}>
        <input className={inputCls} {...register("institution")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Degree" error={errors.degree?.message}>
          <input
            className={inputCls}
            placeholder="Bachelor of Computer Science"
            {...register("degree")}
          />
        </Field>
        <Field label="Field of study (optional)" error={errors.fieldOfStudy?.message}>
          <input className={inputCls} {...register("fieldOfStudy")} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Start year" error={errors.startYear?.message}>
          <input type="number" className={inputCls} {...register("startYear")} />
        </Field>
        <Field label="End year (empty = Present)" error={errors.endYear?.message}>
          <input type="number" className={inputCls} {...register("endYear")} />
        </Field>
        <Field label="GPA (optional)" error={errors.gpa?.message}>
          <input className={inputCls} placeholder="3.85 / 4.00" {...register("gpa")} />
        </Field>
      </div>
      <Field label="Description (optional)" error={errors.description?.message}>
        <textarea rows={3} className={inputCls} {...register("description")} />
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save education"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
