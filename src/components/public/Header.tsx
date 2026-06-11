"use client";

import { useEffect, useState } from "react";
import {
  LuHouse,
  LuUser,
  LuFileText,
  LuBriefcase,
  LuImage,
  LuAward,
  LuSend,
  LuX,
  LuLayoutGrid,
} from "react-icons/lu";
import { ThemeToggle } from "./ThemeToggle";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: LuHouse },
  { id: "about", label: "About", icon: LuUser },
  { id: "skills", label: "Skills", icon: LuFileText },
  { id: "qualification", label: "Qualification", icon: LuBriefcase },
  { id: "projects", label: "Projects", icon: LuImage },
  { id: "certificates", label: "Certificates", icon: LuAward },
  { id: "contact", label: "Contact", icon: LuSend },
];

export function Header({ name }: { name: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y >= 80);
      let current = "home";
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.offsetTop - 160 <= y) current = item.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed bottom-0 left-0 z-50 w-full bg-body transition-shadow md:bottom-auto md:top-0 ${
        scrolled
          ? "shadow-[0_-1px_4px_rgba(0,0,0,0.15)] md:shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
          : ""
      }`}
    >
      <nav className="container-site flex h-12 max-w-[968px] items-center justify-between md:h-[4.5rem]">
        <a
          href="#home"
          className="font-medium text-title transition-colors hover:text-first"
        >
          {name}
        </a>

        <div
          className={`fixed left-0 w-full rounded-t-2xl bg-body px-6 pb-16 pt-8 shadow-[0_-1px_4px_rgba(0,0,0,0.15)] transition-[bottom] duration-300 md:static md:w-auto md:rounded-none md:bg-transparent md:p-0 md:shadow-none ${
            menuOpen ? "bottom-0" : "bottom-[-100%]"
          }`}
        >
          <ul className="grid grid-cols-3 gap-8 md:flex md:gap-8">
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`flex flex-col items-center gap-1 text-smaller font-medium transition-colors hover:text-first ${
                    active === id ? "text-first" : "text-title"
                  }`}
                >
                  <Icon className="text-[1.2rem] md:hidden" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute bottom-2 right-5 cursor-pointer text-2xl text-first hover:text-first-alt md:hidden"
          >
            <LuX />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="cursor-pointer text-xl text-title hover:text-first md:hidden"
          >
            <LuLayoutGrid />
          </button>
        </div>
      </nav>
    </header>
  );
}
