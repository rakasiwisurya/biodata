"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CERTIFICATE_KINDS,
  certificateSchema,
  type CertificateFormValues,
} from "@/lib/validation";
import { saveCertificate } from "@/lib/actions/certificates";
import { Field, inputCls } from "@/components/admin/ui";

export function CertificateForm({
  id,
  defaultValues,
}: {
  id: string | null;
  defaultValues: CertificateFormValues;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CertificateFormValues>({
    resolver: zodResolver(certificateSchema),
    defaultValues,
  });

  async function onSubmit(values: CertificateFormValues) {
    const result = await saveCertificate(id, values);
    if (result.ok) {
      router.push("/admin/certificates");
      router.refresh();
    } else {
      setServerError(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <Field label="Title" error={errors.title?.message}>
        <input className={inputCls} {...register("title")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Issuer" error={errors.issuer?.message}>
          <input className={inputCls} placeholder="Dicoding" {...register("issuer")} />
        </Field>
        <Field label="Kind" error={errors.kind?.message}>
          <select className={inputCls} {...register("kind")}>
            {CERTIFICATE_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Issue date (optional)" error={errors.issueDate?.message}>
          <input type="date" className={inputCls} {...register("issueDate")} />
        </Field>
        <Field label="Credential URL (optional)" error={errors.credentialUrl?.message}>
          <input className={inputCls} placeholder="https://..." {...register("credentialUrl")} />
        </Field>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={isSubmitting} className="button px-4 py-2.5 text-small disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save certificate"}
        </button>
        {serverError && <span className="text-small text-red-500">{serverError}</span>}
      </div>
    </form>
  );
}
