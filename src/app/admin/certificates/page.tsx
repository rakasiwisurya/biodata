import { prisma } from "@/lib/prisma";
import { deleteCertificate, moveCertificate } from "@/lib/actions/certificates";
import { EmptyState, PageHeader, tableCls, tdCls, thCls, trCls } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/RowActions";

export default async function CertificatesAdminPage() {
  const certificates = await prisma.certificate.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <PageHeader title="Certificates & Achievements" newHref="/admin/certificates/new" />
      {certificates.length === 0 ? (
        <EmptyState message="No certificates yet. Add your first one." />
      ) : (
        <table className={tableCls}>
          <thead>
            <tr>
              <th className={thCls}>Title</th>
              <th className={thCls}>Issuer</th>
              <th className={thCls}>Kind</th>
              <th className={thCls} />
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, i) => (
              <tr key={cert.id} className={trCls}>
                <td className={`${tdCls} font-medium text-title`}>{cert.title}</td>
                <td className={tdCls}>{cert.issuer}</td>
                <td className={tdCls}>
                  {cert.kind === "AWARD" ? (
                    <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-smaller font-medium text-amber-600 dark:text-amber-400">
                      Award
                    </span>
                  ) : (
                    "Certificate"
                  )}
                </td>
                <td className={tdCls}>
                  <RowActions
                    editHref={`/admin/certificates/${cert.id}`}
                    onDelete={deleteCertificate.bind(null, cert.id)}
                    onMove={moveCertificate.bind(null, cert.id)}
                    isFirst={i === 0}
                    isLast={i === certificates.length - 1}
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
