"use client";

import { useState } from "react";
import type { Skill, SkillCategory } from "@/lib/types";
import {
  LuChevronDown,
  LuCloud,
  LuCode,
  LuDatabase,
  LuServer,
  LuSmartphone,
  LuSparkles,
} from "react-icons/lu";

const CATEGORY_META: Record<
  SkillCategory,
  { title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }
> = {
  FRONTEND: { title: "Frontend Developer", subtitle: "Modern web interfaces", icon: LuCode },
  BACKEND: { title: "Backend Developer", subtitle: "APIs & services", icon: LuServer },
  DATABASE: { title: "Database & ORM", subtitle: "Data modeling & queries", icon: LuDatabase },
  DEVOPS: { title: "DevOps & Infrastructure", subtitle: "CI/CD & servers", icon: LuCloud },
  MOBILE: { title: "Mobile Developer", subtitle: "Cross-platform apps", icon: LuSmartphone },
  OTHER: { title: "Design & AI", subtitle: "UI/UX & emerging tech", icon: LuSparkles },
};

const CATEGORY_ORDER: SkillCategory[] = [
  "FRONTEND",
  "BACKEND",
  "DATABASE",
  "DEVOPS",
  "MOBILE",
  "OTHER",
];

export function Skills({ skills }: { skills: Skill[] }) {
  const [open, setOpen] = useState<SkillCategory | null>("FRONTEND");

  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: skills.filter((s) => s.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="section" id="skills">
      <h2 className="section-title">Skills</h2>
      <span className="section-subtitle">My technical level</span>

      <div className="container-site grid sm:grid-cols-2 sm:gap-x-8">
        {groups.map(({ category, items }) => {
          const meta = CATEGORY_META[category];
          const Icon = meta.icon;
          const isOpen = open === category;
          return (
            <div key={category} className="mb-6 self-start">
              <header
                className="flex cursor-pointer items-center"
                onClick={() => setOpen(isOpen ? null : category)}
              >
                <Icon className="mr-3 text-3xl text-first" />
                <div>
                  <h3 className="text-h3">{meta.title}</h3>
                  <span className="text-small">{meta.subtitle}</span>
                </div>
                <LuChevronDown
                  className={`ml-auto text-xl text-first transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </header>

              <div
                className="grid transition-[grid-template-rows] duration-300"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="grid gap-y-4 px-1 pt-6">
                    {items.map((skill) => (
                      <div key={skill.id}>
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-normal font-medium text-title">
                            {skill.name}
                          </h4>
                          <span className="text-small">{skill.proficiency}%</span>
                        </div>
                        <div className="h-[5px] rounded bg-first-lighter">
                          <span
                            className="block h-full rounded bg-first"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
