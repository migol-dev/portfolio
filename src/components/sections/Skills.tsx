import type { Skill } from "@prisma/client";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  LANGUAGE: "Lenguaje",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Datos",
  TOOLING: "Herramientas",
  OTHER: "Otro",
};

const LEVEL_VARIANT: Record<string, "default" | "amber" | "green"> = {
  AVANZADO: "green",
  INTERMEDIO: "default",
  APRENDIENDO: "amber",
};

const LEVEL_LABEL: Record<string, string> = {
  AVANZADO: "avanzado",
  INTERMEDIO: "intermedio",
  APRENDIENDO: "aprendiendo",
};

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow path="src/skills.ts" label="Habilidades" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Con qué construyo</h2>
          <p className="max-w-xl text-text-dim mb-12">
            Del bot de Discord al deploy en producción. Estas son las herramientas que
            uso todos los días, y algunas que estoy aprendiendo ahora mismo.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill, i) => {
            const Icon = resolveIcon(skill.icon);
            return (
              <Reveal key={skill.id} delay={Math.min(i * 0.05, 0.4)}>
                <article
                  className={cn(
                    "group h-full rounded-lg border border-border bg-panel/60 p-5",
                    "transition-all duration-300 hover:border-cyan/40 hover:-translate-y-0.5"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="rounded-md border border-border-strong bg-panel-2 p-2 text-cyan group-hover:text-amber transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant={LEVEL_VARIANT[skill.level] ?? "default"}>
                      {LEVEL_LABEL[skill.level] ?? skill.level.toLowerCase()}
                    </Badge>
                  </div>
                  <h3 className="text-base font-semibold text-text mb-1">{skill.name}</h3>
                  <p className="text-xs font-mono text-text-faint mb-2 uppercase tracking-wide">
                    {CATEGORY_LABELS[skill.category] ?? skill.category}
                  </p>
                  <p className="text-sm text-text-dim leading-relaxed">{skill.summary}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
