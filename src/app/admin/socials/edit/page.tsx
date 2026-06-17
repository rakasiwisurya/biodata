"use client";

import { EditScreen } from "@/components/admin/EditScreen";
import { SocialForm } from "@/components/admin/forms/SocialForm";
import type { SocialFormValues } from "@/lib/validation";
import type { SocialLink } from "@/lib/types";

export default function EditSocialPage() {
  return (
    <EditScreen<SocialFormValues, SocialLink>
      collectionName="socials"
      newTitle="New social link"
      editTitle={(s) => `Edit social link — ${s.platform}`}
      emptyValues={{ platform: "", url: "" }}
      mapDoc={(s) => ({ platform: s.platform, url: s.url })}
      render={(id, values) => <SocialForm id={id} defaultValues={values} />}
    />
  );
}
