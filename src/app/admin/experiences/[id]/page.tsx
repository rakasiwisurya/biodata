import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ExperienceForm } from "@/components/admin/forms/ExperienceForm";

function toDateInput(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await prisma.workExperience.findUnique({ where: { id } });
  if (!exp) notFound();

  return (
    <div>
      <PageHeader title={`Edit experience — ${exp.company}`} />
      <ExperienceForm
        id={exp.id}
        defaultValues={{
          company: exp.company,
          position: exp.position,
          location: exp.location ?? "",
          startDate: toDateInput(exp.startDate),
          endDate: toDateInput(exp.endDate),
          summary: exp.summary ?? "",
        }}
      />
    </div>
  );
}
