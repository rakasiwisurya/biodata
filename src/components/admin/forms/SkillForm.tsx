"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SKILL_CATEGORIES,
  skillSchema,
  type SkillFormValues,
} from "@/lib/validation";
import { saveSkill } from "@/lib/actions/skills";
import { Field, inputCls } from "@/components/admin/ui";

export function SkillForm({
  id,
  defaultValues,
}: {
  id: string | null;
  defaultValues: SkillFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues,
  });

  async function onSubmit(values: SkillFormValues) {
    const result = await saveSkill(id, values);
    if (result.ok) {
      router.push("/admin/skills");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <Field label="Skill name" error={errors.name?.message}>
        <input className={inputCls} placeholder="React JS" {...register("name")} />
      </Field>
      <Field label="Category" error={errors.category?.message}>
        <select className={inputCls} {...register("category")}>
          {SKILL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Proficiency (0–100)" error={errors.proficiency?.message}>
        <input
          type="number"
          min={0}
          max={100}
          className={inputCls}
          {...register("proficiency")}
        />
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save skill"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
