import { PageHeader } from "@/components/admin/ui";
import { CertificateForm } from "@/components/admin/forms/CertificateForm";

export default function NewCertificatePage() {
  return (
    <div>
      <PageHeader title="New certificate" />
      <CertificateForm
        id={null}
        defaultValues={{
          title: "",
          issuer: "",
          kind: "CERTIFICATE",
          issueDate: "",
          credentialUrl: "",
        }}
      />
    </div>
  );
}
