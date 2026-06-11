import type { Profile, SocialLink } from "@prisma/client";
import { SocialIcon } from "./SocialIcon";

export function Footer({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <footer className="bg-first-second">
      <div className="container-site grid gap-8 py-12 md:grid-cols-3 md:items-start">
        <div>
          <h1 className="text-h1 text-white">{profile.name}</h1>
          <span className="text-small text-white/80">{profile.headline}</span>
        </div>

        <ul className="flex flex-wrap gap-6 md:justify-center">
          {[
            { href: "#about", label: "About" },
            { href: "#projects", label: "Projects" },
            { href: "#contact", label: "Contact" },
          ].map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-white transition-colors hover:text-first-lighter"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex gap-5 md:justify-end">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.platform}
              className="text-xl text-white transition-colors hover:text-first-lighter"
            >
              <SocialIcon platform={link.platform} />
            </a>
          ))}
        </div>
      </div>

      <p className="pb-20 text-center text-smaller text-white/70 md:pb-8">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </p>
    </footer>
  );
}
