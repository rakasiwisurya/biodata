import { prisma } from "@/lib/prisma";
import { deleteExperience, moveExperience } from "@/lib/actions/experiences";
import { formatPeriod } from "@/lib/format";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function ExperiencesAdminPage() {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div>
      <PageHeader title="Work Experience" newHref="/admin/experiences/new" />
      {experiences.length === 0 ? (
        <EmptyState message="No work experience yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Company</th>
              <th className={thCls}>Position</th>
              <th className={thCls}>Period</th>
              <th className={thCls}>Projects</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp, i) => (
              <tr key={exp.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>{exp.company}</td>
                <td className={tdCls}>{exp.position}</td>
                <td className={tdCls}>{formatPeriod(exp.startDate, exp.endDate)}</td>
                <td className={tdCls}>{exp._count.projects}</td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/experiences/${exp.id}`}
                    onDelete={deleteExperience.bind(null, exp.id)}
                    onMove={moveExperience.bind(null, exp.id)}
                    isFirst={i === 0}
                    isLast={i === experiences.length - 1}
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
