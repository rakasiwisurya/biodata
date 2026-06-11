import { prisma } from "@/lib/prisma";

export async function getPortfolioData() {
  const [profile, socialLinks, skills, experiences, projects, education, certificates] =
    await Promise.all([
      prisma.profile.findFirst(),
      prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.workExperience.findMany({ orderBy: { order: "asc" } }),
      prisma.project.findMany({
        orderBy: { order: "asc" },
        include: { workExperience: { select: { company: true } } },
      }),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.certificate.findMany({ orderBy: { order: "asc" } }),
    ]);

  return { profile, socialLinks, skills, experiences, projects, education, certificates };
}

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;
