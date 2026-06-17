"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getProfile } from "@/lib/firestore";
import type { ProfileFormValues } from "@/lib/validation";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { ProfileForm } from "@/components/admin/forms/ProfileForm";

export default function ProfileAdminPage() {
  const { isAdmin } = useAuth();
  const [values, setValues] = useState<ProfileFormValues | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    getProfile()
      .then((p) =>
        setValues({
          name: p.name,
          headline: p.headline,
          heroDescription: p.heroDescription,
          aboutDescription: p.aboutDescription,
          avatarUrl: p.avatarUrl,
          cvUrl: p.cvUrl,
          email: p.email,
          phone: p.phone,
          location: p.location,
        })
      )
      .catch(() => {});
  }, [isAdmin]);

  return (
    <div>
      <PageHeader title="Profile" />
      {values ? <ProfileForm defaultValues={values} /> : <EmptyState message="Loading…" />}
    </div>
  );
}
