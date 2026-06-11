import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { SocialForm } from "@/components/admin/forms/SocialForm";

export default async function EditSocialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const social = await prisma.socialLink.findUnique({ where: { id } });
  if (!social) notFound();

  return (
    <div>
      <PageHeader title={`Edit social link — ${social.platform}`} />
      <SocialForm
        id={social.id}
        defaultValues={{ platform: social.platform, url: social.url }}
      />
    </div>
  );
}
