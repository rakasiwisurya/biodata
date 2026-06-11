import { prisma } from "@/lib/prisma";
import { deleteSkill, moveSkill } from "@/lib/actions/skills";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function SkillsAdminPage() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Skills" newHref="/admin/skills/new" />
      {skills.length === 0 ? (
        <EmptyState message="No skills yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Name</th>
              <th className={thCls}>Category</th>
              <th className={thCls}>Proficiency</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, i) => (
              <tr key={skill.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>{skill.name}</td>
                <td className={tdCls}>{skill.category}</td>
                <td className={tdCls}>{skill.proficiency}%</td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/skills/${skill.id}`}
                    onDelete={deleteSkill.bind(null, skill.id)}
                    onMove={moveSkill.bind(null, skill.id)}
                    isFirst={i === 0}
                    isLast={i === skills.length - 1}
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
