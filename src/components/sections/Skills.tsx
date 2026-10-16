"use client";

import React, { useState, useMemo } from "react";
import type { Skill } from "@prisma/client";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { resolveIcon } from "@/lib/icons";
import { Search, ChevronDown, Cpu, Filter } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  ALL: "Todos",
  LANGUAGE: "Lenguajes",
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  DATABASE: "Datos",
  TOOLING: "Herramientas",
};

const LEVEL_CONFIG: Record<
  string,
  { label: string; percent: number; variant: "live" | "accent" | "telemetry" }
> = {
  AVANZADO: { label: "Avanzado", percent: 90, variant: "live" },
  INTERMEDIO: { label: "Intermedio", percent: 65, variant: "accent" },
  APRENDIENDO: { label: "Aprendiendo", percent: 35, variant: "telemetry" },
};

export function Skills({ skills }: { skills: Skill[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter skills by search query and category
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesCategory =
        selectedCategory === "ALL" || skill.category === selectedCategory;
      const matchesQuery =
        !query.trim() ||
        skill.name.toLowerCase().includes(query.toLowerCase()) ||
        skill.summary.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [skills, query, selectedCategory]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = skills.length;
    const intermedio = skills.filter((s) => s.level === "INTERMEDIO").length;
    const avanzado = skills.filter((s) => s.level === "AVANZADO").length;
    const aprendiendo = skills.filter((s) => s.level === "APRENDIENDO").length;
    return { total, intermedio, avanzado, aprendiendo };
  }, [skills]);

  return (
    <section id="skills" className="py-20 sm:py-24 lg:py-32 border-t border-[var(--color-border)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow
            index="0x03"
            label="HABILIDADES"
            sublabel="MATRIZ TÉCNICA C/C++, WEB &amp; HERRAMIENTAS"
          />
        </Reveal>

        {/* 4:8 Asymmetric Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mt-8">
          {/* Left Column: 4 Cols -> Sticky Narrative, Search & Category Filters */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
                Stack &amp; Dominio
              </h2>
              <p className="text-sm text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
                Desde la gestión manual de memoria en C/C++ hasta interfaces reactivas y sistemas de telemetría concurrentes. Filtra por categoría o busca cualquier concepto.
              </p>
            </div>

            {/* Real-time Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--color-text-faint)] absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tecnología o concepto..."
                className="w-full h-10 pl-9 pr-3 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-hidden focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-text-faint)] uppercase tracking-wider">
                <Filter className="w-3 h-3 text-[var(--color-accent)]" strokeWidth={1.5} />
                <span>Filtrar por Dominio:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
                  const isActive = selectedCategory === catKey;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setSelectedCategory(catKey)}
                      className={`px-2.5 py-1 rounded-[4px] text-[11px] font-mono transition-all duration-150 active:scale-[0.97] cursor-pointer border ${
                        isActive
                          ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)] font-semibold shadow-xs"
                          : "bg-[var(--color-panel-2)] text-[var(--color-text-dim)] border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]"
                      }`}
                    >
                      {catLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Distribution Telemetry */}
            <div className="p-3.5 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] font-mono text-xs space-y-2">
              <div className="text-[10px] uppercase text-[var(--color-text-faint)] tracking-wider">
                Distribución de Competencias
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="flex flex-col p-1.5 rounded-[3px] bg-black/20 border border-[var(--color-border)]">
                  <span className="text-[9px] text-[var(--color-status-live)]">AVANZADO</span>
                  <span className="text-sm font-semibold tnum text-[var(--color-text)]">{stats.avanzado}</span>
                </div>
                <div className="flex flex-col p-1.5 rounded-[3px] bg-black/20 border border-[var(--color-border)]">
                  <span className="text-[9px] text-[var(--color-accent-bright)]">INTERMEDIO</span>
                  <span className="text-sm font-semibold tnum text-[var(--color-text)]">{stats.intermedio}</span>
                </div>
                <div className="flex flex-col p-1.5 rounded-[3px] bg-black/20 border border-[var(--color-border)]">
                  <span className="text-[9px] text-[var(--color-telemetry)]">APRENDIENDO</span>
                  <span className="text-sm font-semibold tnum text-[var(--color-text)]">{stats.aprendiendo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 8 Cols -> Indexed Rows (No Card-itis, pure hairlines) */}
          <div className="lg:col-span-8">
            <div className="border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel)] overflow-hidden">
              {/* Header row */}
              <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-[10px] font-mono text-[var(--color-text-faint)] uppercase tracking-wider">
                <div className="col-span-2 sm:col-span-1">IDX</div>
                <div className="col-span-6 sm:col-span-5">TECNOLOGÍA</div>
                <div className="hidden sm:block sm:col-span-3">DOMINIO</div>
                <div className="col-span-4 sm:col-span-3 text-right">NIVEL</div>
              </div>

              {/* Indexed rows */}
              <div className="divide-y divide-[var(--color-border)]">
                {filteredSkills.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-[var(--color-text-faint)]">
                    No se encontraron tecnologías que coincidan con &ldquo;{query}&rdquo;.
                  </div>
                ) : (
                  filteredSkills.map((skill, index) => {
                    const Icon = resolveIcon(skill.icon);
                    const hexIndex = `0x0${index + 1}`.slice(-4);
                    const config = LEVEL_CONFIG[skill.level] || LEVEL_CONFIG.INTERMEDIO;
                    const isExpanded = expandedId === skill.id;

                    return (
                      <div
                        key={skill.id}
                        className="transition-colors hover:bg-white/[0.02]"
                      >
                        <div
                          onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                          className="grid grid-cols-12 items-center px-4 py-3 text-xs font-mono cursor-pointer select-none"
                        >
                          {/* Index 0x01 */}
                          <div className="col-span-2 sm:col-span-1 text-[11px] text-[var(--color-accent)] font-semibold">
                            {hexIndex}
                          </div>

                          {/* Skill Name & Icon */}
                          <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 min-w-0 pr-2">
                            <div className="p-1.5 rounded-[4px] bg-white/[0.03] border border-[var(--color-border)] shrink-0">
                              <Icon className="w-3.5 h-3.5 text-[var(--color-text)]" strokeWidth={1.5} />
                            </div>
                            <span className="font-semibold text-[var(--color-text)] truncate">
                              {skill.name}
                            </span>
                          </div>

                          {/* Category Tag */}
                          <div className="hidden sm:flex sm:col-span-3 items-center text-[10px] text-[var(--color-text-faint)] uppercase tracking-wider">
                            {CATEGORY_LABELS[skill.category] ?? skill.category}
                          </div>

                          {/* Level Badge & Expand Arrow */}
                          <div className="col-span-4 sm:col-span-3 flex items-center justify-end gap-2">
                            <Badge variant={config.variant} className="text-[9px]">
                              {config.label}
                            </Badge>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-[var(--color-text-faint)] transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[var(--color-text)]" : ""
                              }`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>

                        {/* Expandable Technical Summary Stage */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 bg-white/[0.01] border-t border-[var(--color-border)]/50 space-y-2">
                            <p className="text-xs text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)] pl-7">
                              {skill.summary}
                            </p>
                            <div className="pl-7 flex items-center gap-3 text-[10px] font-mono text-[var(--color-text-faint)]">
                              <span>Nivel de competencia estimado:</span>
                              <div className="flex-1 max-w-48 h-1.5 bg-black/40 rounded-full overflow-hidden border border-[var(--color-border)]">
                                <div
                                  className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
                                  style={{ width: `${config.percent}%` }}
                                />
                              </div>
                              <span className="tnum text-[var(--color-text)]">{config.percent}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
