"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialSchema, type SocialFormValues } from "@/lib/validation";
import { saveSocial } from "@/lib/adminData";
import { Field, inputCls } from "@/components/admin/ui";

export function SocialForm({
  id,
  defaultValues,
}: {
  id: string | null;
  defaultValues: SocialFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SocialFormValues>({
    resolver: zodResolver(socialSchema),
    defaultValues,
  });

  async function onSubmit(values: SocialFormValues) {
    const result = await saveSocial(id, values);
    if (result.ok) {
      router.push("/admin/socials");
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <Field label="Platform" error={errors.platform?.message}>
        <input
          className={inputCls}
          list="platform-options"
          placeholder="linkedin"
          {...register("platform")}
        />
        <datalist id="platform-options">
          <option value="linkedin" />
          <option value="github" />
          <option value="whatsapp" />
          <option value="email" />
        </datalist>
        <p className="mt-1 text-smaller text-text-light">
          linkedin, github, whatsapp, and email get their own icons; anything
          else shows a generic link icon.
        </p>
      </Field>
      <Field label="URL" error={errors.url?.message}>
        <input
          className={inputCls}
          placeholder="https://www.linkedin.com/in/username"
          {...register("url")}
        />
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save link"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
