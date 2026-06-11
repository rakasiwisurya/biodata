import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ProfileForm } from "@/components/admin/forms/ProfileForm";

export default async function ProfileAdminPage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div>
      <PageHeader title="Profile" />
      <ProfileForm
        defaultValues={{
          name: profile?.name ?? "",
          headline: profile?.headline ?? "",
          heroDescription: profile?.heroDescription ?? "",
          aboutDescription: profile?.aboutDescription ?? "",
          avatarUrl: profile?.avatarUrl ?? "",
          cvUrl: profile?.cvUrl ?? "",
          email: profile?.email ?? "",
          phone: profile?.phone ?? "",
          location: profile?.location ?? "",
        }}
      />
    </div>
  );
}
