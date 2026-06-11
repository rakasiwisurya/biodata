import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { SkillForm } from "@/components/admin/forms/SkillForm";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) notFound();

  return (
    <div>
      <PageHeader title={`Edit skill — ${skill.name}`} />
      <SkillForm
        id={skill.id}
        defaultValues={{
          name: skill.name,
          category: skill.category,
          proficiency: String(skill.proficiency),
        }}
      />
    </div>
  );
}
