"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LuAward,
  LuBriefcase,
  LuFileText,
  LuFolderGit2,
  LuGraduationCap,
  LuHouse,
  LuLink,
  LuUser,
} from "react-icons/lu";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LuHouse },
  { href: "/admin/profile", label: "Profile", icon: LuUser },
  { href: "/admin/skills", label: "Skills", icon: LuFileText },
  { href: "/admin/experiences", label: "Experience", icon: LuBriefcase },
  { href: "/admin/projects", label: "Projects", icon: LuFolderGit2 },
  { href: "/admin/education", label: "Education", icon: LuGraduationCap },
  { href: "/admin/certificates", label: "Certificates", icon: LuAward },
  { href: "/admin/socials", label: "Social Links", icon: LuLink },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="overflow-x-auto px-2 pb-2 md:flex-1 md:pb-0">
      <ul className="flex gap-1 md:flex-col">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(href);
          return (
            <li key={href} className="shrink-0">
              <Link
                href={href}
                className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-small font-medium transition-colors ${
                  active
                    ? "bg-first text-white"
                    : "text-text hover:bg-input hover:text-first"
                }`}
              >
                <Icon /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
