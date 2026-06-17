"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/lib/validation";
import { saveProfile } from "@/lib/adminData";
import { Field, inputCls } from "@/components/admin/ui";

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileFormValues;
}) {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileFormValues) {
    setStatus("idle");
    const result = await saveProfile(values);
    if (result.ok) {
      setStatus("saved");
    } else {
      setStatus("error");
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <Field label="Full name" error={errors.name?.message}>
        <input className={inputCls} {...register("name")} />
      </Field>
      <Field label="Headline" error={errors.headline?.message}>
        <input className={inputCls} placeholder="Fullstack Developer" {...register("headline")} />
      </Field>
      <Field label="Hero description" error={errors.heroDescription?.message}>
        <textarea rows={3} className={inputCls} {...register("heroDescription")} />
      </Field>
      <Field label="About description" error={errors.aboutDescription?.message}>
        <textarea rows={5} className={inputCls} {...register("aboutDescription")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" error={errors.email?.message}>
          <input className={inputCls} {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className={inputCls} {...register("phone")} />
        </Field>
      </div>
      <Field label="Location" error={errors.location?.message}>
        <input className={inputCls} {...register("location")} />
      </Field>
      <Field label="Avatar URL" error={errors.avatarUrl?.message}>
        <input
          className={inputCls}
          placeholder="/profile.png or https://…"
          {...register("avatarUrl")}
        />
        <p className="mt-1 text-smaller text-text-light">
          Defaults to the bundled illustration. Paste an image URL to use your own photo.
        </p>
      </Field>
      <Field label="CV link (Google Drive / PDF URL)" error={errors.cvUrl?.message}>
        <input
          className={inputCls}
          placeholder="https://drive.google.com/file/d/…/view"
          {...register("cvUrl")}
        />
        <p className="mt-1 text-smaller text-text-light">
          Paste a public link to your CV (e.g. a Google Drive “Anyone with the
          link” share URL). The “Download CV” button opens it in a new tab.
        </p>
      </Field>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save profile"}
        </button>
        {status === "saved" && <span className="text-small text-green-600">Saved ✓</span>}
        {status === "error" && serverError && (
          <span className="text-small text-red-500">{serverError}</span>
        )}
      </div>
    </form>
  );
}
