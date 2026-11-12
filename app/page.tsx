import { ContactSection } from "@/components/contact";
import { ExperienceSection } from "@/components/experience";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SkillsSection } from "@/components/skills";

export default function HomePage() {
  return (
    <>
      <main id="main">
        <Hero />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
