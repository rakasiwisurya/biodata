import { FaGithub, FaLinkedinIn, FaWhatsapp } from "react-icons/fa6";
import { LuLink, LuMail } from "react-icons/lu";

export function SocialIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  switch (platform.toLowerCase()) {
    case "linkedin":
      return <FaLinkedinIn className={className} />;
    case "github":
      return <FaGithub className={className} />;
    case "whatsapp":
      return <FaWhatsapp className={className} />;
    case "email":
      return <LuMail className={className} />;
    default:
      return <LuLink className={className} />;
  }
}
