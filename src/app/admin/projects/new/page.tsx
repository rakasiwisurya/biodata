import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

export default async function NewProjectPage() {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: "asc" },
    select: { id: true, company: true, position: true },
  });

  return (
    <div>
      <PageHeader title="New project" />
      <ProjectForm
        id={null}
        defaultValues={{
          title: "",
          description: "",
          responsibilities: "",
          techStack: "",
          teamSize: "",
          periodStart: "",
          periodEnd: "",
          imageUrl: "",
          demoUrl: "",
          repoUrl: "",
          featured: false,
          workExperienceId: "",
        }}
        experienceOptions={experiences.map((e) => ({
          id: e.id,
          label: `${e.company} (${e.position})`,
        }))}
      />
    </div>
  );
}
