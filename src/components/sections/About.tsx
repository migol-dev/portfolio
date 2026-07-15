import { Reveal, SectionEyebrow } from "@/components/Reveal";

export function About() {
  return (
    <section id="about" className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow path="src/about.tsx" label="Sobre mí" />
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 items-start mt-6">
          <Reveal className="lg:col-span-1">
            <p className="text-xl sm:text-2xl text-text leading-snug font-medium">
              Empecé automatizando comunidades de Discord por curiosidad.
              Hoy construyo productos completos, del backend a la interfaz.
            </p>
          </Reveal>

          <div className="hidden lg:block w-px bg-border self-stretch" />

          <Reveal delay={0.1} className="space-y-4 text-[15px] leading-relaxed">
            <p>
              Soy desarrollador full stack con base en Colima, México. Todo empezó
              creando bots de moderación y gamificación para comunidades de Discord de
              miles de miembros — ahí aprendí a diseñar sistemas que se sostienen bajo
              uso real, no solo en teoría.
            </p>
            <p>
              Desde entonces amplié mi stack hacia el desarrollo web completo:
              interfaces con React y Next.js, APIs propias, y bases de datos
              relacionales con PostgreSQL. Me interesa particularmente construir
              herramientas prácticas — como una app de finanzas personales que hoy uso
              yo mismo a diario.
            </p>
            <p>
              Trabajo bilingüe en español e inglés, documento lo que construyo, y
              disfruto tanto resolver el problema técnico como pulir el último detalle
              visual.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
