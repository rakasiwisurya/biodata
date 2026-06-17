"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceFormValues } from "@/lib/validation";
import { saveExperience } from "@/lib/adminData";
import { Field, inputCls } from "@/components/admin/ui";

export function ExperienceForm({
  id,
  defaultValues,
}: {
  id: string | null;
  defaultValues: ExperienceFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues,
  });

  async function onSubmit(values: ExperienceFormValues) {
    const result = await saveExperience(id, values);
    if (result.ok) {
      router.push("/admin/experiences");
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Company" error={errors.company?.message}>
          <input className={inputCls} {...register("company")} />
        </Field>
        <Field label="Position" error={errors.position?.message}>
          <input className={inputCls} {...register("position")} />
        </Field>
      </div>
      <Field label="Location (optional)" error={errors.location?.message}>
        <input className={inputCls} placeholder="Jakarta, Indonesia" {...register("location")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Start date" error={errors.startDate?.message}>
          <input type="date" className={inputCls} {...register("startDate")} />
        </Field>
        <Field label="End date (empty = Present)" error={errors.endDate?.message}>
          <input type="date" className={inputCls} {...register("endDate")} />
        </Field>
      </div>
      <Field label="Summary (optional)" error={errors.summary?.message}>
        <textarea rows={4} className={inputCls} {...register("summary")} />
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save experience"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
