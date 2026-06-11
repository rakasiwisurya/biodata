"use client";

import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";

export function ScrollUp() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY >= 560);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href="#home"
      aria-label="Scroll to top"
      className={`fixed right-4 z-40 inline-flex rounded-md bg-first/80 p-1.5 transition-all duration-300 hover:bg-first ${
        show
          ? "bottom-20 opacity-100 md:bottom-12"
          : "pointer-events-none -bottom-8 opacity-0"
      }`}
    >
      <LuArrowUp className="text-xl text-white" />
    </a>
  );
}
