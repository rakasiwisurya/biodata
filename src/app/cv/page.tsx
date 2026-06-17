"use client";

import { useEffect, useState } from "react";
import { LuArrowLeft, LuPrinter } from "react-icons/lu";
import Link from "next/link";
import { defaultData } from "@/lib/defaultData";
import { fetchPortfolio } from "@/lib/firestore";
import { formatPeriod } from "@/lib/format";
import type { PortfolioData, SkillCategory } from "@/lib/types";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Databases & ORM",
  DEVOPS: "DevOps & Infrastructure",
  MOBILE: "Mobile",
  OTHER: "Design & Other",
};
const CATEGORY_ORDER: SkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "MOBILE",
  "OTHER",
];

export default function CvPage() {
  const [data, setData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    let active = true;
    fetchPortfolio()
      .then((d) => active && setData(d))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const { profile, skills, experiences, projects, education, certificates } = data;

  const contactParts = [
    profile.email,
    profile.phone,
    profile.location.replace(/\s*\(.*\)\s*/, ""),
    ...data.socials
      .filter((s) => s.platform === "linkedin" || s.platform === "github")
      .map((s) => s.url.replace(/^https?:\/\//, "")),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 py-8 text-gray-900 print:bg-white print:py-0">
      {/* Toolbar (not printed) */}
      <div className="print-hidden mx-auto mb-6 flex max-w-[820px] items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <LuArrowLeft /> Back to site
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          <LuPrinter /> Print / Save as PDF
        </button>
      </div>

      {/* A4 sheet */}
      <article className="mx-auto max-w-[820px] bg-white px-12 py-10 text-[13px] leading-relaxed shadow-lg print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {/* Header */}
        <header className="border-b-2 border-gray-900 pb-4">
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-base font-medium text-gray-700">{profile.headline}</p>
          <p className="mt-2 text-[12px] text-gray-600">{contactParts.join("  •  ")}</p>
        </header>

        {/* Summary */}
        <Section title="Professional Summary">
          <p>{profile.aboutDescription}</p>
        </Section>

        {/* Skills */}
        <Section title="Technical Skills">
          <ul className="space-y-1">
            {CATEGORY_ORDER.map((cat) => {
              const names = skills.filter((s) => s.category === cat).map((s) => s.name);
              if (names.length === 0) return null;
              return (
                <li key={cat}>
                  <span className="font-semibold">{CATEGORY_LABELS[cat]}:</span>{" "}
                  {names.join(", ")}
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Experience */}
        <Section title="Work Experience">
          <div className="space-y-4">
            {experiences.map((exp) => {
              const expProjects = projects.filter((p) => p.company === exp.company);
              return (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-bold">
                      {exp.position} — {exp.company}
                    </h3>
                    <span className="shrink-0 text-[12px] text-gray-600">
                      {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-[12px] italic text-gray-600">{exp.location}</p>
                  )}
                  {exp.summary && <p className="mt-1">{exp.summary}</p>}
                  {expProjects.map((p) => (
                    <div key={p.id} className="mt-2">
                      <p className="font-semibold">
                        {p.title}
                        {p.teamSize ? ` (Team of ${p.teamSize})` : ""}
                      </p>
                      <ul className="ml-5 list-disc">
                        {p.responsibilities.slice(0, 4).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                      {p.techStack.length > 0 && (
                        <p className="mt-0.5 text-[12px] text-gray-600">
                          <span className="font-semibold">Tech:</span> {p.techStack.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Section>

        {/* Education */}
        <Section title="Education">
          {education.map((edu) => (
            <div key={edu.id} className="flex items-baseline justify-between gap-4">
              <div>
                <h3 className="font-bold">{edu.degree}</h3>
                <p>
                  {edu.institution}
                  {edu.gpa ? ` — GPA: ${edu.gpa}` : ""}
                </p>
                {edu.description && (
                  <p className="text-[12px] italic text-gray-600">{edu.description}</p>
                )}
              </div>
              <span className="shrink-0 text-[12px] text-gray-600">
                {edu.startYear} – {edu.endYear ?? "Present"}
              </span>
            </div>
          ))}
        </Section>

        {/* Certificates */}
        <Section title="Certificates & Achievements">
          <ul className="ml-5 list-disc">
            {certificates.map((c) => (
              <li key={c.id}>
                {c.title} — <span className="text-gray-700">{c.issuer}</span>
                {c.kind === "AWARD" && <span className="font-semibold"> (Award)</span>}
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 border-b border-gray-300 pb-1 text-[13px] font-bold uppercase tracking-wide text-gray-800">
        {title}
      </h2>
      {children}
    </section>
  );
}
