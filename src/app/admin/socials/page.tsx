import { prisma } from "@/lib/prisma";
import { deleteSocial, moveSocial } from "@/lib/actions/socials";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function SocialsAdminPage() {
  const socials = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <PageHeader title="Social Links" newHref="/admin/socials/new" />
      {socials.length === 0 ? (
        <EmptyState message="No social links yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Platform</th>
              <th className={thCls}>URL</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {socials.map((social, i) => (
              <tr key={social.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>{social.platform}</td>
                <td className={`${tdCls} break-all`}>{social.url}</td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/socials/${social.id}`}
                    onDelete={deleteSocial.bind(null, social.id)}
                    onMove={moveSocial.bind(null, social.id)}
                    isFirst={i === 0}
                    isLast={i === socials.length - 1}
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
