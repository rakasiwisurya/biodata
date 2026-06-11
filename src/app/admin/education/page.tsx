import { prisma } from "@/lib/prisma";
import { deleteEducation, moveEducation } from "@/lib/actions/education";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function EducationAdminPage() {
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Education" newHref="/admin/education/new" />
      {education.length === 0 ? (
        <EmptyState message="No education entries yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Institution</th>
              <th className={thCls}>Degree</th>
              <th className={thCls}>Years</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {education.map((edu, i) => (
              <tr key={edu.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>{edu.institution}</td>
                <td className={tdCls}>{edu.degree}</td>
                <td className={tdCls}>
                  {edu.startYear} – {edu.endYear ?? "Present"}
                </td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/education/${edu.id}`}
                    onDelete={deleteEducation.bind(null, edu.id)}
                    onMove={moveEducation.bind(null, edu.id)}
                    isFirst={i === 0}
                    isLast={i === education.length - 1}
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
