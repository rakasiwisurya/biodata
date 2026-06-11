import type { Profile, SocialLink } from "@prisma/client";
import { LuMail, LuMapPin, LuPhone } from "react-icons/lu";
import { SocialIcon } from "./SocialIcon";

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "Connect on LinkedIn",
  github: "View my GitHub",
  whatsapp: "Chat on WhatsApp",
  email: "Send an email",
};

export function Contact({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <section className="section" id="contact">
      <h2 className="section-title">Contact Me</h2>
      <span className="section-subtitle">Get in touch</span>

      <div className="container-site grid gap-10 sm:grid-cols-2">
        <div className="space-y-6">
          {profile.phone && (
            <div className="flex items-start gap-3">
              <LuPhone className="text-2xl text-first" />
              <div>
                <h3 className="text-h3">Call / WhatsApp</h3>
                <span className="text-small text-text-light">
                  {profile.phone}
                </span>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3">
            <LuMail className="text-2xl text-first" />
            <div>
              <h3 className="text-h3">Email</h3>
              <span className="text-small text-text-light">
                {profile.email}
              </span>
            </div>
          </div>
          {profile.location && (
            <div className="flex items-start gap-3">
              <LuMapPin className="text-2xl text-first" />
              <div>
                <h3 className="text-h3">Location</h3>
                <span className="text-small text-text-light">
                  {profile.location}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-start gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="button px-4 py-3 text-small"
            >
              <SocialIcon platform={link.platform} />
              {PLATFORM_LABELS[link.platform.toLowerCase()] ?? link.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
