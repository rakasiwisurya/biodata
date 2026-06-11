import type { Profile } from "@prisma/client";
import { LuDownload } from "react-icons/lu";

export type Stat = { value: string; label: string };

export function About({ profile, stats }: { profile: Profile; stats: Stat[] }) {
  return (
    <section className="section" id="about">
      <h2 className="section-title">About Me</h2>
      <span className="section-subtitle">My introduction</span>

      <div className="container-site">
        <p className="mb-10 text-center">{profile.aboutDescription}</p>

        <div className="mb-10 flex justify-evenly gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-h2 font-semibold text-title">
                {stat.value}
              </span>
              <span className="text-smaller">{stat.label}</span>
            </div>
          ))}
        </div>

        {profile.cvUrl && (
          <div className="flex justify-center">
            <a href={profile.cvUrl} target="_blank" rel="noreferrer" className="button">
              Download CV <LuDownload />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
