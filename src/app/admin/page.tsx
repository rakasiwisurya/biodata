import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminDashboard() {
  const [skills, experiences, projects, education, certificates, socials, profile] =
    await Promise.all([
      prisma.skill.count(),
      prisma.workExperience.count(),
      prisma.project.count(),
      prisma.education.count(),
      prisma.certificate.count(),
      prisma.socialLink.count(),
      prisma.profile.findFirst({ select: { updatedAt: true } }),
    ]);

  const cards = [
    { label: "Skills", count: skills, href: "/admin/skills" },
    { label: "Work Experiences", count: experiences, href: "/admin/experiences" },
    { label: "Projects", count: projects, href: "/admin/projects" },
    { label: "Education", count: education, href: "/admin/education" },
    { label: "Certificates", count: certificates, href: "/admin/certificates" },
    { label: "Social Links", count: socials, href: "/admin/socials" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl bg-container p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="block text-h1 font-semibold text-first">
              {card.count}
            </span>
            <span className="text-small text-text">{card.label}</span>
          </Link>
        ))}
      </div>
      <div className="mt-6 space-y-2 text-small text-text-light">
        {profile && (
          <p>Profile last updated: {profile.updatedAt.toLocaleString("en-US")}</p>
        )}
        <p>
          View the public site at{" "}
          <Link href="/" className="text-first hover:underline">
            /
          </Link>{" "}
          — changes appear after save (revalidated automatically).
        </p>
      </div>
    </div>
  );
}
