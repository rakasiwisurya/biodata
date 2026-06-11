import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { CertificateForm } from "@/components/admin/forms/CertificateForm";

export default async function EditCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cert = await prisma.certificate.findUnique({ where: { id } });
  if (!cert) notFound();

  return (
    <div>
      <PageHeader title={`Edit certificate — ${cert.title}`} />
      <CertificateForm
        id={cert.id}
        defaultValues={{
          title: cert.title,
          issuer: cert.issuer,
          kind: cert.kind,
          issueDate: cert.issueDate ? cert.issueDate.toISOString().slice(0, 10) : "",
          credentialUrl: cert.credentialUrl ?? "",
        }}
      />
    </div>
  );
}
