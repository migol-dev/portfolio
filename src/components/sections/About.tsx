"use client";

import React, { useState } from "react";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MapPin,
  Languages,
  Cpu,
  ShieldCheck,
} from "lucide-react";

interface CognitiveNode {
  id: string;
  code: string;
  title: string;
  tag: string;
  systemRole: string;
  description: string;
  workImpact: string;
}

const COGNITIVE_NODES: CognitiveNode[] = [
  {
    id: "infp",
    code: "COG_01",
    title: "INFP",
    tag: "MBTI · Mediador (Fi-Ne-Si-Te)",
    systemRole: "Arquitectura humana & sentido de propósito",
    description:
      "Orientado a conectar la lógica interna de los sistemas con una experiencia de usuario clara, empática y respetuosa. Atención meticulosa tanto al diseño visual como a la solidez de las bases de código.",
    workImpact:
      "Capacidad para concebir soluciones elegantes y mantener estándares éticos elevados en el software que produce.",
  },
  {
    id: "sosx",
    code: "COG_02",
    title: "SO/SX",
    tag: "Instinto · Social / Sexual (Uno a uno)",
    systemRole: "Orientación comunitaria & lealtad técnica",
    description:
      "Combina la vocación de construir para comunidades reales y colectivos masivos (+5,000 usuarios) con una profunda lealtad y enfoque en colaboración técnica directa uno a uno.",
    workImpact:
      "Excelente sinergia en pair-programming, mentoría y comunicación transparente en equipos reducidos.",
  },
  {
    id: "9w1",
    code: "COG_03",
    title: "9w1",
    tag: "Eneatipo 9 ala 1 · Pacificador & Orden",
    systemRole: "Calma ante incidentes & rigor estructurado",
    description:
      "Mantiene la serenidad y la cabeza fría en situaciones de alta presión o bugs críticos en producción, sumado al estándar deontológico innegociable de orden, modularidad y legibilidad (ala 1).",
    workImpact:
      "Mitiga conflictos técnicos de forma constructiva y prioriza estabilidad, testing y refactorizaciones limpias.",
  },
  {
    id: "946",
    code: "COG_04",
    title: "946",
    tag: "Tritipo 9-4-6 · 'The Seeker'",
    systemRole: "Armonía + Identidad estética + Prevención de riesgos",
    description:
      "La convergencia entre la búsqueda de equilibrio (9), el afán por una voz estética y de diseño singular (4), y la anticipación analítica y preventiva ante casos límite y edge cases (6).",
    workImpact:
      "Diseño exhaustivo de casos extremos, validación de inputs y protección defensiva en APIs y memoria.",
  },
];

export function About() {
  const [selectedCog, setSelectedCog] = useState<string>("infp");
  const activeNode = COGNITIVE_NODES.find((n) => n.id === selectedCog) || COGNITIVE_NODES[0];

  return (
    <section id="about" className="py-20 sm:py-24 lg:py-32 border-t border-[var(--color-border)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow
            index="0x02"
            label="SOBRE MÍ"
            sublabel="MANIFIESTO TÉCNICO &amp; TOPOLOGÍA COGNITIVA"
          />
        </Reveal>

        {/* 5:7 Asymmetric Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mt-8">
          {/* Left Column: 5 Cols -> Manifesto & Personal Telemetry */}
          <div className="lg:col-span-5 space-y-8">
            <Reveal delay={0.05}>
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[var(--color-accent)] font-semibold">
                  02.A // MANIFIESTO
                </span>
                <p className="text-xl sm:text-2xl text-[var(--color-text)] font-semibold leading-snug font-[family-name:var(--font-display)]">
                  La ingeniería en C/C++ enseña el respeto por cada byte; el desarrollo web moderno ofrece el lienzo para impactar a personas reales.
                </p>
                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
                  No concibo el software como una caja negra de dependencias sin entender qué ocurre debajo. Busco la convergencia entre el rendimiento nativo del metal y la fluidez de interfaces web accesibles y atractivas.
                </p>
              </div>
            </Reveal>

            {/* Personal Telemetry Panel (1px hairlines, no card-itis) */}
            <Reveal delay={0.1}>
              <div className="border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel-2)] overflow-hidden font-mono text-xs">
                <div className="px-3.5 py-2 border-b border-[var(--color-border)] bg-[var(--color-panel)] text-[10px] uppercase tracking-wider text-[var(--color-text-faint)] flex items-center justify-between">
                  <span>TELEMETRÍA // DEV_PROFILE</span>
                  <span className="text-[var(--color-status-live)]">● ACTIVO</span>
                </div>

                <div className="divide-y divide-[var(--color-border)]">
                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
                      Ubicación:
                    </span>
                    <span className="text-[var(--color-text)] font-medium">Colima, México (UTC-6)</span>
                  </div>

                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-[var(--color-telemetry)]" strokeWidth={1.5} />
                      Trayectoria:
                    </span>
                    <span className="text-[var(--color-text)] font-medium">4 años en código (desde 2022)</span>
                  </div>

                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-status-live)]" strokeWidth={1.5} />
                      Comunidades:
                    </span>
                    <span className="text-[var(--color-text)] font-medium">+5,000 usuarios gestionados</span>
                  </div>

                  <div className="px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-[var(--color-text-dim)] flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
                      Núcleo Técnico:
                    </span>
                    <span className="text-[var(--color-text)] font-medium">React · TS · Vite · C/C++ (aspirante)</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 7 Cols -> Narrative & Cognitive Topology */}
          <div className="lg:col-span-7 space-y-10">
            {/* Narrative 01/02/03 with 1px hairlines */}
            <Reveal delay={0.15}>
              <div className="space-y-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.08em] text-[var(--color-text-faint)]">
                  02.B // TRAYECTORIA TÉCNICA
                </span>

                <div className="space-y-6 text-sm text-[var(--color-text-dim)] leading-relaxed">
                  <div className="border-l-2 border-[var(--color-border-strong)] pl-4 space-y-1">
                    <div className="text-xs font-mono font-semibold text-[var(--color-text)]">
                      01 // El metal y la memoria (C / C++ · 2026)
                    </div>
                    <p>
                      En 2026 inicié mi aprendizaje de C y C++ como aspirante en desarrollo de bajo nivel. Mi objetivo es dominar punteros, gestión manual de memoria (malloc/free, new/delete) y estructuras de datos nativas para entender a fondo el hardware y construir software sin sobrecarga innecesaria.
                    </p>
                  </div>

                  <div className="border-l-2 border-[var(--color-accent)] pl-4 space-y-1">
                    <div className="text-xs font-mono font-semibold text-[var(--color-text)]">
                      02 // Desarrollo web full-stack (React, Vite, TS &amp; Next.js · 2025—presente)
                    </div>
                    <p>
                      Mi dedicación central como desarrollador web junior-intermedio: interfaces reactivas, consistentes y orientadas a tipos con React 19, TypeScript, Vite, Next.js y Zustand. Destacan proyectos como <em>Finance Pal</em> (gestión financiera privada), <em>Ritmo</em> (gestor de hábitos) y <em>FinanceMate Webpage</em>.
                    </p>
                  </div>

                  <div className="border-l-2 border-[var(--color-telemetry)] pl-4 space-y-1">
                    <div className="text-xs font-mono font-semibold text-[var(--color-text)]">
                      03 // Comunidades, Azure Mod &amp; Networks de Minecraft (2022—2025)
                    </div>
                    <p>
                      Inicié en 2022 creando bots en Discord, escalé como Community Manager de comunidades que congregaron a más de 5,000 miembros y desarrollé <em>Azure Mod</em> (automoderación reactiva, detección de toxicidad y sanciones escalonadas). Posteriormente administré y aseguré redes de servidores de Minecraft con plugins y datapacks personalizados.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Cognitive Topology Module [02.C // COGNITIVE TOPOLOGY] */}
            <Reveal delay={0.2}>
              <div id="cognitive" className="border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel)] overflow-hidden transition-all duration-300">
                <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--color-text)] font-semibold">
                      [02.C // COGNITIVE TOPOLOGY]
                    </span>
                  </div>
                  <Badge variant="telemetry" className="text-[9px]">
                    INFP · SO/SX · 9w1 · 946
                  </Badge>
                </div>

                {/* Interactive Node Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[var(--color-border)] font-mono text-xs">
                  {COGNITIVE_NODES.map((node) => {
                    const isSelected = selectedCog === node.id;
                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedCog(node.id)}
                        className={`p-3 text-left transition-all duration-150 active:scale-[0.98] border-r border-b sm:border-b-0 border-[var(--color-border)] cursor-pointer ${
                          isSelected
                            ? "bg-white/[0.05] text-[var(--color-text)] font-semibold shadow-inner"
                            : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="text-[10px] text-[var(--color-accent)] font-semibold">
                          {node.code}
                        </div>
                        <div className="text-xs font-bold text-[var(--color-text)]">
                          {node.title}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Node Detail Stage */}
                <div className="p-4 sm:p-5 space-y-3 bg-[var(--color-panel-2)]/40 font-mono">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs font-semibold text-[var(--color-accent-bright)]">
                      {activeNode.tag}
                    </div>
                    <span className="text-[10px] text-[var(--color-text-faint)]">
                      ROL: {activeNode.systemRole}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
                    {activeNode.description}
                  </p>

                  <div className="pt-2 border-t border-[var(--color-border)] flex items-start gap-2 text-[11px] text-[var(--color-text)]">
                    <span className="text-[var(--color-status-live)]">↳</span>
                    <span>
                      <strong className="text-[var(--color-text)] font-medium">Impacto en desarrollo:</strong>{" "}
                      <span className="text-[var(--color-text-dim)]">{activeNode.workImpact}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
