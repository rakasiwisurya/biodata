import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { EducationForm } from "@/components/admin/forms/EducationForm";

export default async function EditEducationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const edu = await prisma.education.findUnique({ where: { id } });
  if (!edu) notFound();

  return (
    <div>
      <PageHeader title={`Edit education — ${edu.institution}`} />
      <EducationForm
        id={edu.id}
        defaultValues={{
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy ?? "",
          startYear: String(edu.startYear),
          endYear: edu.endYear ? String(edu.endYear) : "",
          gpa: edu.gpa ?? "",
          description: edu.description ?? "",
        }}
      />
    </div>
  );
}
