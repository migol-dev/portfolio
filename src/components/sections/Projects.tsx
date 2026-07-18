import type { Project } from "@prisma/client";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { ProjectCard } from "@/components/ProjectCard";

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-16 sm:py-20 lg:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow path="src/projects/" label="Proyectos" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Cosas que he construido</h2>
          <p className="max-w-xl text-text-dim mb-8 sm:mb-12">
            Una selección de proyectos propios, desde bots en producción hasta
            aplicaciones que uso todos los días.
          </p>
        </Reveal>

        {projects.length === 0 ? (
          <p className="font-mono text-sm text-text-faint">
            {"// aún no hay proyectos publicados — vuelve pronto"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={Math.min(i * 0.08, 0.3)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
