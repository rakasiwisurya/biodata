import { getPortfolioData } from "@/lib/data";
import { Header } from "@/components/public/Header";
import { Hero } from "@/components/public/Hero";
import { About, type Stat } from "@/components/public/About";
import { Skills } from "@/components/public/Skills";
import { Qualification } from "@/components/public/Qualification";
import { Projects } from "@/components/public/Projects";
import { Certificates } from "@/components/public/Certificates";
import { Contact } from "@/components/public/Contact";
import { Footer } from "@/components/public/Footer";
import { ScrollUp } from "@/components/public/ScrollUp";

export const revalidate = 60;

const YEAR_MS = 365.25 * 24 * 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default async function HomePage() {
  const data = await getPortfolioData();
  const { profile } = data;

  if (!profile) {
    return (
      <main className="section container-site">
        <h1 className="section-title">Portfolio not set up yet</h1>
        <p className="mt-4 text-center">
          Run <code>npx prisma db seed</code> to populate the database.
        </p>
      </main>
    );
  }

  const minStart = data.experiences.length
    ? Math.min(...data.experiences.map((e) => e.startDate.getTime()))
    : Date.now();
  const years = Math.max(1, Math.floor((Date.now() - minStart) / YEAR_MS));
  const stats: Stat[] = [
    { value: `${pad(years)}+`, label: "Years experience" },
    { value: `${pad(data.projects.length)}+`, label: "Completed projects" },
    { value: `${pad(data.experiences.length)}+`, label: "Companies worked" },
  ];

  const firstName = profile.name.split(" ")[0];

  return (
    <>
      <Header name={firstName} />
      <main className="md:pt-18">
        <Hero profile={profile} socialLinks={data.socialLinks} />
        <About profile={profile} stats={stats} />
        <Skills skills={data.skills} />
        <Qualification experiences={data.experiences} education={data.education} />
        <Projects projects={data.projects} />
        <Certificates certificates={data.certificates} />
        <Contact profile={profile} socialLinks={data.socialLinks} />
      </main>
      <Footer profile={profile} socialLinks={data.socialLinks} />
      <ScrollUp />
    </>
  );
}
