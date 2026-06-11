import { prisma } from "@/lib/prisma";
import { deleteProject, moveProject } from "@/lib/actions/projects";
import { formatPeriod } from "@/lib/format";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function ProjectsAdminPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { workExperience: { select: { company: true } } },
  });

  return (
    <div>
      <PageHeader title="Projects" newHref="/admin/projects/new" />
      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Title</th>
              <th className={thCls}>Company</th>
              <th className={thCls}>Period</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => (
              <tr key={project.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>
                  {project.title}
                  {project.featured && (
                    <span className="ml-2 rounded bg-first/15 px-1.5 py-0.5 text-smaller text-first">
                      Featured
                    </span>
                  )}
                </td>
                <td className={tdCls}>{project.workExperience?.company ?? "—"}</td>
                <td className={tdCls}>
                  {formatPeriod(project.periodStart, project.periodEnd) || "—"}
                </td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/projects/${project.id}`}
                    onDelete={deleteProject.bind(null, project.id)}
                    onMove={moveProject.bind(null, project.id)}
                    isFirst={i === 0}
                    isLast={i === projects.length - 1}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
