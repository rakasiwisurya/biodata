"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultData } from "@/lib/defaultData";
import { fetchPortfolio } from "@/lib/firestore";
import type { PortfolioData } from "@/lib/types";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { About, type Stat } from "./About";
import { Skills } from "./Skills";
import { Qualification } from "./Qualification";
import { Projects } from "./Projects";
import { Certificates } from "./Certificates";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { ScrollUp } from "./ScrollUp";

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;
const pad = (n: number) => String(n).padStart(2, "0");

function computeStats(data: PortfolioData): Stat[] {
  const starts = data.experiences
    .map((e) => new Date(`${e.startDate}T00:00:00Z`).getTime())
    .filter((t) => !Number.isNaN(t));
  const minStart = starts.length ? Math.min(...starts) : Date.now();
  const years = Math.max(1, Math.floor((Date.now() - minStart) / YEAR_MS));
  return [
    { value: `${pad(years)}+`, label: "Years experience" },
    { value: `${pad(data.projects.length)}+`, label: "Completed projects" },
    { value: `${pad(data.experiences.length)}+`, label: "Companies worked" },
  ];
}

export function PortfolioApp() {
  // Start from bundled defaults so the first paint (and the static HTML) is a
  // complete CV; then live-override from Firestore once it loads.
  const [data, setData] = useState<PortfolioData>(defaultData);

  useEffect(() => {
    let active = true;
    fetchPortfolio()
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        /* keep defaults on any read error */
      });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => computeStats(data), [data]);
  const firstName = data.profile.name.split(" ")[0];

  return (
    <>
      <Header name={firstName} />
      <main className="md:pt-18">
        <Hero profile={data.profile} socialLinks={data.socials} />
        <About profile={data.profile} stats={stats} />
        <Skills skills={data.skills} />
        <Qualification experiences={data.experiences} education={data.education} />
        <Projects projects={data.projects} />
        <Certificates certificates={data.certificates} />
        <Contact profile={data.profile} socialLinks={data.socials} />
      </main>
      <Footer profile={data.profile} socialLinks={data.socials} />
      <ScrollUp />
    </>
  );
}
