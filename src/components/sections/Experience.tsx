import { Reveal, SectionEyebrow } from "@/components/Reveal";

const ENTRIES = [
  {
    period: "2024 — presente",
    title: "Full Stack & Discord Bot Developer",
    description:
      "Desarrollo de aplicaciones web completas (Next.js + PostgreSQL) y bots con moderación avanzada, sistemas escalables y tickets, para comunidades de más de 5,000 miembros.",
    tag: "actual",
  },
  {
    period: "2023",
    title: "Discord Community Manager",
    description:
      "Lideré y administré comunidades en Discord con sistemas propios de retención, mejorando la permanencia de nuevos miembros hasta en un 80%.",
    tag: "gestión",
  },
  {
    period: "2022",
    title: "Bot Developer Trainee",
    description:
      "Inicio en el desarrollo de bots de Discord: sistemas de música, niveles y gamificación para distintas comunidades.",
    tag: "inicio",
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow path="src/experience.log" label="Experiencia" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-12">Historial de commits</h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border-strong" aria-hidden />
          <ol className="space-y-10">
            {ENTRIES.map((entry, i) => (
              <Reveal key={entry.title} delay={i * 0.1}>
                <li className="relative pl-8">
                  <span
                    className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-cyan bg-void"
                    aria-hidden
                  />
                  <p className="font-mono text-xs text-amber mb-1.5">{entry.period}</p>
                  <h3 className="text-lg font-semibold text-text mb-1.5">{entry.title}</h3>
                  <p className="text-sm text-text-dim leading-relaxed max-w-2xl">
                    {entry.description}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
