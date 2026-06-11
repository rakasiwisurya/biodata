import type { Profile, SocialLink } from "@prisma/client";
import { LuArrowDown, LuMouse, LuSend } from "react-icons/lu";
import { SocialIcon } from "./SocialIcon";

const BLOB_PATH =
  "M190.312 36.4879C206.582 62.1187 201.309 102.826 182.328 134.186C163.346 165.547 130.807 187.559 100.226 186.353C69.6454 185.297 41.0228 161.023 21.7403 129.362C2.45775 97.8511 -7.48481 59.1033 6.67581 34.5279C20.9871 10.1032 59.7028 -0.149132 97.9666 0.00163737C136.23 0.303176 174.193 10.857 190.312 36.4879Z";

export function Hero({
  profile,
  socialLinks,
}: {
  profile: Profile;
  socialLinks: SocialLink[];
}) {
  return (
    <section className="section" id="home">
      <div className="container-site grid grid-cols-[max-content_1fr] items-center gap-4 pt-14 sm:grid-cols-[max-content_1fr_1fr]">
        <div className="col-start-1 row-start-1 flex flex-col gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              aria-label={link.platform}
              className="text-xl text-first transition-colors hover:text-first-alt"
            >
              <SocialIcon platform={link.platform} />
            </a>
          ))}
        </div>

        <div className="justify-self-center sm:col-start-3 sm:row-start-1">
          <svg
            className="w-[200px] fill-first sm:w-[230px] md:w-[270px] lg:w-[320px]"
            viewBox="0 0 200 187"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="heroBlobMask" mask-type="alpha">
              <path d={BLOB_PATH} />
            </mask>
            <g mask="url(#heroBlobMask)">
              <path d={BLOB_PATH} />
              <image
                x="12"
                y="18"
                width="176"
                href={profile.avatarUrl ?? "/avatar-placeholder.svg"}
              />
            </g>
          </svg>
        </div>

        <div className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          <h1 className="text-big">Hi, I&apos;m {profile.name}</h1>
          <h3 className="mb-3 text-h3 font-semibold text-text">
            {profile.headline}
          </h3>
          <p className="mb-8">{profile.heroDescription}</p>
          <a href="#contact" className="button">
            Contact Me <LuSend />
          </a>
        </div>
      </div>

      <div className="container-site mt-12 hidden sm:block">
        <a
          href="#about"
          className="inline-flex items-center gap-2 text-first transition-colors hover:text-first-alt"
        >
          <LuMouse className="text-2xl" />
          <span className="text-small font-medium text-title">Scroll down</span>
          <LuArrowDown className="text-title" />
        </a>
      </div>
    </section>
  );
}
