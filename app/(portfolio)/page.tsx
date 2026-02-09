import About from "@/components/about";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Intro from "@/components/intro";
import Projects from "@/components/projects";
import SectionDivider from "@/components/section-divider";
import Skills from "@/components/skills";
import { getPortfolioData } from "@/lib/api";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { profile, socialLinks, experiences, projects, skills } =
    await getPortfolioData();

  return (
    <main className="flex flex-col items-center px-4">
      <Intro profile={profile} socialLinks={socialLinks} />
      <SectionDivider />
      <About profile={profile} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Skills skills={skills} />
      <Contact profile={profile} />
    </main>
  );
}
