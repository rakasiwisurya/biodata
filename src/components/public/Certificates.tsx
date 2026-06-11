import type { Certificate } from "@prisma/client";
import { LuAward, LuExternalLink, LuTrophy } from "react-icons/lu";

export function Certificates({ certificates }: { certificates: Certificate[] }) {
  if (certificates.length === 0) return null;

  const groups = new Map<string, Certificate[]>();
  for (const cert of certificates) {
    const list = groups.get(cert.issuer) ?? [];
    list.push(cert);
    groups.set(cert.issuer, list);
  }

  return (
    <section className="section" id="certificates">
      <h2 className="section-title">Certificates &amp; Achievements</h2>
      <span className="section-subtitle">Continuous learning</span>

      <div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...groups.entries()].map(([issuer, certs]) => (
          <div
            key={issuer}
            className="rounded-xl bg-container p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]"
          >
            <h3 className="mb-4 flex items-center gap-2 text-normal">
              <LuAward className="shrink-0 text-xl text-first" />
              {issuer}
            </h3>
            <ul className="space-y-2">
              {certs.map((cert) => (
                <li key={cert.id} className="flex items-start gap-2 text-small">
                  {cert.kind === "AWARD" ? (
                    <LuTrophy className="mt-0.5 shrink-0 text-amber-500" />
                  ) : (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-first" />
                  )}
                  <span>
                    {cert.title}
                    {cert.kind === "AWARD" && (
                      <span className="ml-2 rounded bg-amber-500/15 px-1.5 py-0.5 text-smaller font-medium text-amber-600 dark:text-amber-400">
                        Award
                      </span>
                    )}
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 inline-flex align-middle text-first hover:text-first-alt"
                        aria-label="View credential"
                      >
                        <LuExternalLink />
                      </a>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
