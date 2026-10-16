"use client";

import React, { useState } from "react";
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
    version: "v3.0.0",
    period: "2025 — presente",
    commitHash: "7b4f91e",
    role: "Junior C/C++ & Full Stack Web Developer",
    isCurrent: true,
    summary:
      "Evolución hacia desarrollo de bajo nivel con C/C++ (gestión de memoria, estructuras nativas y compiladores) combinado con desarrollo web moderno en React 19, TypeScript, Vite y bases de datos PostgreSQL.",
    achievements: [
      "Diseño de laboratorios de estructuras de datos y custom memory arenas en C/C++.",
      "Creación y mantenimiento de Finance Pal (React, TS, Vite, Zustand, Capacitor).",
      "Arquitecturas full-stack robustas con Next.js App Router y Prisma ORM.",
    ],
  },
  {
    version: "v2.0.0",
    period: "2024",
    commitHash: "4a28c31",
    role: "Full Stack & Discord Bot Developer",
    summary:
      "Desarrollo integral de microservicios con Node.js y Discord.js v14 para servidores de alta concurrencia con más de 5,000 usuarios activos.",
    achievements: [
      "Implementación de AutoMod Sentinel: filtrado automático de spam, raids y enlaces maliciosos.",
      "Manejo de WebSockets en tiempo real y persistencia relacional con PostgreSQL.",
      "Sistemas de tickets de soporte técnico y telemetría de eventos en producción.",
    ],
  },
  {
    version: "v1.0.0",
    period: "2023",
    commitHash: "1e07b82",
    role: "Discord Community Manager & Tech Lead",
    summary:
      "Liderazgo técnico y gestión de comunidades masivas en Discord, diseñando mecánicas de gamificación y bots que optimizaron la retención de usuarios.",
    achievements: [
      "Aumento medible de retención y permanencia de nuevos miembros hasta en un 80%.",
      "Coordinación de flujos de moderación y directrices de seguridad contra incursiones.",
    ],
  },
  {
    version: "v0.5.0",
    period: "2022",
    commitHash: "0a89d44",
    role: "Bot Developer Trainee & Foundations",
    summary:
      "Inicios en programación orientada a eventos con JavaScript (Node.js) y fundamentos de desarrollo web.",
    achievements: [
      "Creación de los primeros bots de música, economía virtual y comandos interactivos.",
      "Dominio de Git, control de versiones en GitHub y resolución de problemas algorítmicos.",
    ],
  },
];

export function Experience() {
  const [expandedVer, setExpandedVer] = useState<string>("v3.0.0");

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

        {/* 3:9 Changelog Timeline */}
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
                  className="grid grid-cols-12 gap-4 p-4 sm:p-6 cursor-pointer select-none items-start"
                >
                  {/* Left: 3 cols -> Version, Period & Hash */}
                  <div className="col-span-12 sm:col-span-4 lg:col-span-3 space-y-1.5 font-mono">
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
                    <div className="text-[10px] text-[var(--color-text-faint)] flex items-center gap-1">
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

                    {/* Expandable Milestones */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-[var(--color-border)]/60 space-y-2 animate-in fade-in-0 duration-200">
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
                    )}
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
