"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getDocById, listDocs } from "@/lib/firestore";
import type { Project, WorkExperience } from "@/lib/types";
import type { ProjectFormValues } from "@/lib/validation";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";

const EMPTY: ProjectFormValues = {
  title: "",
  company: "",
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
};

function toFormValues(p: Project): ProjectFormValues {
  return {
    title: p.title,
    company: p.company,
    description: p.description,
    responsibilities: p.responsibilities.join("\n"),
    techStack: p.techStack.join(", "),
    teamSize: p.teamSize ? String(p.teamSize) : "",
    periodStart: p.periodStart,
    periodEnd: p.periodEnd,
    imageUrl: p.imageUrl,
    demoUrl: p.demoUrl,
    repoUrl: p.repoUrl,
    featured: p.featured,
  };
}

function Inner() {
  const id = useSearchParams().get("id");
  const [values, setValues] = useState<ProjectFormValues | null>(id ? null : EMPTY);
  const [companies, setCompanies] = useState<string[]>([]);
  const [title, setTitle] = useState("New project");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listDocs<WorkExperience>("experiences")
      .then((exps) => setCompanies([...new Set(exps.map((e) => e.company))]))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    getDocById<Project>("projects", id)
      .then((p) => {
        if (!p) {
          setError("Item not found.");
          return;
        }
        setValues(toFormValues(p));
        setTitle(`Edit project — ${p.title}`);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  return (
    <div>
      <PageHeader title={title} />
      {error ? (
        <EmptyState message={error} />
      ) : values === null ? (
        <EmptyState message="Loading…" />
      ) : (
        <ProjectForm id={id} defaultValues={values} companyOptions={companies} />
      )}
    </div>
  );
}

export default function EditProjectPage() {
  return (
    <Suspense fallback={<EmptyState message="Loading…" />}>
      <Inner />
    </Suspense>
  );
}
