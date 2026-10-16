"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { GitCommit, ChevronDown, CheckCircle2 } from "lucide-react";

interface TimelineEntry {
  version: string;
  period: string;
  commitHash: string;
  role: string;
  summary: string;
  achievements: string[];
  isCurrent?: boolean;
}

const TIMELINE: TimelineEntry[] = [
  {
    version: "v4.0.0",
    period: "2026 — presente",
    commitHash: "a0f81d2",
    role: "Aspirante C/C++ & Full Stack Web Developer",
    isCurrent: true,
    summary:
      "Inicio del aprendizaje en desarrollo de bajo nivel con C y C++ (fundamentos de memoria, punteros, estructuras nativas y compilación con GCC), en simultáneo con el desarrollo continuo de aplicaciones web modernas con React, TypeScript y PostgreSQL.",
    achievements: [
      "Prácticas continuas de manipulación de punteros, memoria manual y estructuras nativas en C/C++.",
      "Desarrollo de Ritmo (gestor de hábitos) y evolución de la suite financiera Finance Pal.",
      "Arquitectura de componentes limpios y sistemas de diseño con Tailwind CSS v4 y TypeScript.",
    ],
  },
  {
    version: "v3.0.0",
    period: "2025 — presente",
    commitHash: "7b4f91e",
    role: "Desarrollador Web Junior-Intermedio",
    summary:
      "Foco pleno en desarrollo web full-stack moderno. Creación de aplicaciones interactivas completas con React 19, TypeScript, Vite, Next.js y persistencia relacional con PostgreSQL y Prisma.",
    achievements: [
      "Diseño y despliegue de Finance Pal (React, TS, Vite, Zustand, Capacitor) para finanzas personales locales.",
      "Creación del sitio web oficial FinanceMate Webpage optimizado para SEO y desplegado en Vercel.",
      "Dominio de arquitecturas de componentes basadas en estado, TypeScript estricto y Tailwind CSS.",
    ],
  },
  {
    version: "v2.5.0",
    period: "2024 — inicios 2025",
    commitHash: "5c31b99",
    role: "Desarrollador de Networks & Servidores Minecraft",
    summary:
      "Configuración, optimización y aseguramiento de servidores y networks completas en Minecraft, junto con el desarrollo de plugins y datapacks ligeros.",
    achievements: [
      "Despliegue y mantenimiento de networks distribuidas con proxies de alto rendimiento.",
      "Políticas de seguridad, mitigación de exploits y control de integridad de datos de jugadores.",
      "Programación de plugins y datapacks sencillos para mecánicas personalizadas.",
    ],
  },
  {
    version: "v2.0.0",
    period: "2023 — 2024",
    commitHash: "4a28c31",
    role: "Community Manager & Creador de Azure Mod",
    summary:
      "Liderazgo de comunidades en Discord que agruparon a más de 5,000 miembros, y desarrollo de Azure Mod, bot de automoderación avanzada y gamificación comunitaria.",
    achievements: [
      "Desarrollo de Azure Mod: filtro inteligente de toxicidad, insultos, spam, enlaces no autorizados y contenido inapropiado.",
      "Sistema de sanciones escalonadas/progresivas y mecánicas de gamificación para fomento de la convivencia.",
      "Moderación técnica y gestión comunitaria de más de 5,000 usuarios activos concurrentes.",
    ],
  },
  {
    version: "v1.0.0",
    period: "2022",
    commitHash: "0a89d44",
    role: "Bot Developer Trainee & Inicios en Programación",
    summary:
      "Primeros pasos en programación orientada a eventos con JavaScript y Node.js, creando bots básicos para automatización en Discord.",
    achievements: [
      "Desarrollo de bots de bienvenida, respuestas automáticas a mensajes y comandos interactivos.",
      "Adquisición de bases sólidas en Git, GitHub y lógica algorítmica fundamental.",
    ],
  },
];

export function Experience() {
  const [expandedVer, setExpandedVer] = useState<string>("v4.0.0");

  return (
    <section id="experience" className="py-20 sm:py-24 lg:py-32 border-t border-[var(--color-border)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow
            index="0x05"
            label="TRAYECTORIA"
            sublabel="REGISTRO CRONOLÓGICO &amp; CHANGELOG DE ROLES"
          />
        </Reveal>

        <div className="mt-8 mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            Changelog de Evolución
          </h2>
          <p className="text-sm text-[var(--color-text-dim)] font-[family-name:var(--font-body)] mt-1 max-w-[60ch]">
            De la gestión y automatización de comunidades masivas al control minucioso de punteros y memoria en C/C++ y aplicaciones web modernas.
          </p>
        </div>

        {/* 3:9 Changelog Timeline with Git Branch Connectors */}
        <div className="border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel)] divide-y divide-[var(--color-border)] overflow-hidden">
          {TIMELINE.map((entry) => {
            const isExpanded = expandedVer === entry.version;

            return (
              <div
                key={entry.version}
                className="transition-colors hover:bg-white/[0.01]"
              >
                <div
                  onClick={() => setExpandedVer(isExpanded ? "" : entry.version)}
                  className="grid grid-cols-12 gap-4 p-4 sm:p-6 cursor-pointer select-none items-start active:scale-[0.99] transition-transform"
                >
                  {/* Left: 3 cols -> Version, Period & Hash */}
                  <div className="col-span-12 sm:col-span-4 lg:col-span-3 space-y-1.5 font-mono relative pl-3 sm:pl-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--color-accent-bright)]">
                        {entry.version}
                      </span>
                      {entry.isCurrent ? (
                        <Badge variant="live" className="text-[9px] py-0 px-1.5">
                          ACTUAL
                        </Badge>
                      ) : (
                        <span className="text-[10px] text-[var(--color-text-faint)]">
                          RELEASE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[var(--color-text-dim)] font-medium">
                      {entry.period}
                    </div>
                    <div className="text-[10px] text-[var(--color-text-faint)] flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full border ${
                        isExpanded
                          ? "bg-[var(--color-accent)] border-[var(--color-accent-bright)] animate-pulse"
                          : "bg-white/10 border-[var(--color-border)]"
                      }`} />
                      <GitCommit className="w-3 h-3 text-[var(--color-accent)]" strokeWidth={1.5} />
                      <span className="tnum">commit {entry.commitHash}</span>
                    </div>
                  </div>

                  {/* Right: 9 cols -> Role, Summary & Expand Details */}
                  <div className="col-span-12 sm:col-span-8 lg:col-span-9 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
                        {entry.role}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-[var(--color-text-faint)] transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-180 text-[var(--color-text)]" : ""
                        }`}
                        strokeWidth={1.5}
                      />
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
                      {entry.summary}
                    </p>

                    {/* Expandable Milestones with AnimatePresence */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 border-t border-[var(--color-border)]/60 space-y-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-faint)] block">
                              Hitos y aprendizajes clave:
                            </span>
                            <ul className="space-y-1.5 text-xs text-[var(--color-text)] font-[family-name:var(--font-body)]">
                              {entry.achievements.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 text-[var(--color-status-live)] shrink-0 mt-0.5"
                                    strokeWidth={1.5}
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
