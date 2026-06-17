"use client";

import { useState } from "react";
import type { Education, WorkExperience } from "@/lib/types";
import { LuBriefcase, LuCalendar, LuGraduationCap } from "react-icons/lu";
import { formatPeriod } from "@/lib/format";

type Tab = "work" | "education";

function TimelineMarker({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <span className="mt-1 inline-block h-[13px] w-[13px] shrink-0 rounded-full bg-first" />
      {!isLast && <span className="block h-full w-px bg-first" />}
    </div>
  );
}

export function Qualification({
  experiences,
  education,
}: {
  experiences: WorkExperience[];
  education: Education[];
}) {
  const [tab, setTab] = useState<Tab>("work");

  return (
    <section className="section" id="qualification">
      <h2 className="section-title">Qualification</h2>
      <span className="section-subtitle">My personal journey</span>

      <div className="container-site">
        <div className="mb-8 flex justify-center gap-8">
          <button
            onClick={() => setTab("work")}
            className={`flex cursor-pointer items-center gap-2 text-h3 font-medium transition-colors hover:text-first ${
              tab === "work" ? "text-first" : "text-title"
            }`}
          >
            <LuBriefcase /> Work
          </button>
          <button
            onClick={() => setTab("education")}
            className={`flex cursor-pointer items-center gap-2 text-h3 font-medium transition-colors hover:text-first ${
              tab === "education" ? "text-first" : "text-title"
            }`}
          >
            <LuGraduationCap /> Education
          </button>
        </div>

        {tab === "work" && (
          <div>
            {experiences.map((exp, i) => {
              const data = (
                <div className="pb-8">
                  <h3 className="text-normal font-medium text-title">
                    {exp.position}
                  </h3>
                  <span className="mb-1 block text-small">
                    {exp.company}
                    {exp.location ? ` — ${exp.location}` : ""}
                  </span>
                  <div className="flex items-center gap-1 text-smaller text-text-light">
                    <LuCalendar />
                    {formatPeriod(exp.startDate, exp.endDate)}
                  </div>
                  {exp.summary && (
                    <p className="mt-2 text-small">{exp.summary}</p>
                  )}
                </div>
              );
              const isLast = i === experiences.length - 1;
              return (
                <div
                  key={exp.id}
                  className="grid grid-cols-[1fr_max-content_1fr] gap-x-6"
                >
                  {i % 2 === 0 ? data : <div />}
                  <TimelineMarker isLast={isLast} />
                  {i % 2 === 0 ? <div /> : data}
                </div>
              );
            })}
          </div>
        )}

        {tab === "education" && (
          <div>
            {education.map((edu, i) => {
              const data = (
                <div className="pb-8">
                  <h3 className="text-normal font-medium text-title">
                    {edu.degree}
                  </h3>
                  <span className="mb-1 block text-small">
                    {edu.institution}
                  </span>
                  <div className="flex items-center gap-1 text-smaller text-text-light">
                    <LuCalendar />
                    {edu.startYear} – {edu.endYear ?? "Present"}
                  </div>
                  {edu.gpa && (
                    <span className="mt-1 block text-small">
                      GPA: {edu.gpa}
                    </span>
                  )}
                  {edu.description && (
                    <p className="mt-1 text-small">{edu.description}</p>
                  )}
                </div>
              );
              const isLast = i === education.length - 1;
              return (
                <div
                  key={edu.id}
                  className="grid grid-cols-[1fr_max-content_1fr] gap-x-6"
                >
                  {i % 2 === 0 ? data : <div />}
                  <TimelineMarker isLast={isLast} />
                  {i % 2 === 0 ? <div /> : data}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
