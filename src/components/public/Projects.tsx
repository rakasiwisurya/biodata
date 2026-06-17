"use client";

import type { Project } from "@/lib/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  LuBriefcase,
  LuCalendar,
  LuCode,
  LuExternalLink,
  LuUsers,
} from "react-icons/lu";
import { formatPeriod } from "@/lib/format";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function Projects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <section className="section" id="projects">
      <h2 className="section-title">Projects</h2>
      <span className="section-subtitle">Most recent work</span>

      <div className="container-site overflow-hidden">
        <Swiper
          className="projects-swiper"
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={projects.length > 2}
          spaceBetween={48}
        >
          {projects.map((project) => (
            <SwiperSlide key={project.id}>
              <div className="grid items-center gap-4 px-10 pb-2 sm:grid-cols-2 sm:gap-6">
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full self-start rounded-lg shadow-md"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center self-start rounded-lg bg-linear-to-br from-first to-first-alt">
                    <LuCode className="text-5xl text-white/80" />
                  </div>
                )}

                <div>
                  <h3 className="mb-2 text-h3">{project.title}</h3>

                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-smaller text-text-light">
                    {project.company && (
                      <span className="flex items-center gap-1">
                        <LuBriefcase /> {project.company}
                      </span>
                    )}
                    {(project.periodStart || project.periodEnd) && (
                      <span className="flex items-center gap-1">
                        <LuCalendar />
                        {formatPeriod(project.periodStart, project.periodEnd)}
                      </span>
                    )}
                    {project.teamSize && (
                      <span className="flex items-center gap-1">
                        <LuUsers /> Team of {project.teamSize}
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-small [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden">
                    {project.description}
                  </p>

                  {project.techStack.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-first/15 px-2 py-0.5 text-smaller font-medium text-first dark:text-first-lighter"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {(project.demoUrl || project.repoUrl) && (
                    <div className="flex gap-3">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button px-3 py-2 text-small"
                        >
                          Demo <LuExternalLink />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button px-3 py-2 text-small"
                        >
                          Code <LuExternalLink />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
