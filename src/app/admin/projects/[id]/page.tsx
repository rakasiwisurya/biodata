import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

function toDateInput(date: Date | null): string {
  return date ? date.toISOString().slice(0, 10) : "";
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, experiences] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.workExperience.findMany({
      orderBy: { order: "asc" },
      select: { id: true, company: true, position: true },
    }),
  ]);
  if (!project) notFound();

  return (
    <div>
      <PageHeader title={`Edit project — ${project.title}`} />
      <ProjectForm
        id={project.id}
        defaultValues={{
          title: project.title,
          description: project.description,
          responsibilities: project.responsibilities.join("\n"),
          techStack: project.techStack.join(", "),
          teamSize: project.teamSize ? String(project.teamSize) : "",
          periodStart: toDateInput(project.periodStart),
          periodEnd: toDateInput(project.periodEnd),
          imageUrl: project.imageUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          featured: project.featured,
          workExperienceId: project.workExperienceId ?? "",
        }}
        experienceOptions={experiences.map((e) => ({
          id: e.id,
          label: `${e.company} (${e.position})`,
        }))}
      />
    </div>
  );
}
