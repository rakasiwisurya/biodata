"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormValues } from "@/lib/validation";
import { saveProject } from "@/lib/adminData";
import { Field, inputCls } from "@/components/admin/ui";

export function ProjectForm({
  id,
  defaultValues,
  companyOptions,
}: {
  id: string | null;
  defaultValues: ProjectFormValues;
  companyOptions: string[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues,
  });

  async function onSubmit(values: ProjectFormValues) {
    const result = await saveProject(id, values);
    if (result.ok) {
      router.push("/admin/projects");
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <input className={inputCls} {...register("title")} />
      </Field>
      <Field label="Company (optional)" error={errors.company?.message}>
        <input className={inputCls} list="company-options" {...register("company")} />
        <datalist id="company-options">
          {companyOptions.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </Field>
      <Field label="Description" error={errors.description?.message}>
        <textarea rows={5} className={inputCls} {...register("description")} />
      </Field>
      <Field label="Responsibilities (one per line)" error={errors.responsibilities?.message}>
        <textarea rows={6} className={inputCls} {...register("responsibilities")} />
      </Field>
      <Field label="Tech stack (comma separated)" error={errors.techStack?.message}>
        <input
          className={inputCls}
          placeholder="TypeScript, Next JS, PostgreSQL"
          {...register("techStack")}
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Team size (optional)" error={errors.teamSize?.message}>
          <input type="number" min={1} className={inputCls} {...register("teamSize")} />
        </Field>
        <Field label="Period start" error={errors.periodStart?.message}>
          <input type="date" className={inputCls} {...register("periodStart")} />
        </Field>
        <Field label="Period end" error={errors.periodEnd?.message}>
          <input type="date" className={inputCls} {...register("periodEnd")} />
        </Field>
      </div>
      <Field label="Project image URL (optional)" error={errors.imageUrl?.message}>
        <input className={inputCls} placeholder="https://…" {...register("imageUrl")} />
        <p className="mt-1 text-smaller text-text-light">
          Leave empty to show a styled placeholder.
        </p>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Demo URL (optional)" error={errors.demoUrl?.message}>
          <input className={inputCls} placeholder="https://…" {...register("demoUrl")} />
        </Field>
        <Field label="Repository URL (optional)" error={errors.repoUrl?.message}>
          <input className={inputCls} placeholder="https://github.com/…" {...register("repoUrl")} />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-small text-title">
        <input type="checkbox" className="accent-first" {...register("featured")} />
        Featured project
      </label>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save project"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
