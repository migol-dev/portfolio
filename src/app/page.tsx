import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatusBar } from "@/components/StatusBar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { getProjects, getSkills } from "@/lib/data";

export const revalidate = 60;

export default async function Home() {
  const [projects, skills] = await Promise.all([getProjects(), getSkills()]);

  return (
    <>
      <Header />
      <main id="main" className="flex-1 pb-7">
        <Hero />
        <About />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <StatusBar />
    </>
  );
}
