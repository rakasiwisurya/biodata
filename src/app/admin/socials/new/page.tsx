import { PageHeader } from "@/components/admin/ui";
import { SocialForm } from "@/components/admin/forms/SocialForm";

export default function NewSocialPage() {
  return (
    <div>
      <PageHeader title="New social link" />
      <SocialForm id={null} defaultValues={{ platform: "", url: "" }} />
    </div>
  );
}
