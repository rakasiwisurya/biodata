"use client";

import { EditScreen } from "@/components/admin/EditScreen";
import { CertificateForm } from "@/components/admin/forms/CertificateForm";
import type { CertificateFormValues } from "@/lib/validation";
import type { Certificate } from "@/lib/types";

export default function EditCertificatePage() {
  return (
    <EditScreen<CertificateFormValues, Certificate>
      collectionName="certificates"
      newTitle="New certificate"
      editTitle={(c) => `Edit certificate — ${c.title}`}
      emptyValues={{ title: "", issuer: "", kind: "CERTIFICATE", issueDate: "", credentialUrl: "" }}
      mapDoc={(c) => ({
        title: c.title,
        issuer: c.issuer,
        kind: c.kind,
        issueDate: c.issueDate,
        credentialUrl: c.credentialUrl,
      })}
      render={(id, values) => <CertificateForm id={id} defaultValues={values} />}
    />
  );
}
