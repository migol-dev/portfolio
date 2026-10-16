"use client";

import React, { useState, useMemo } from "react";
import type { Project } from "@prisma/client";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectDetailSheet } from "@/components/ProjectCard";
import {
  ExternalLink,
  Code2,
  Terminal,
  FileText,
} from "lucide-react";

const FILTER_TABS = [
  { id: "ALL", label: "Todos" },
  { id: "CPP", label: "C/C++" },
  { id: "REACT", label: "React / Vite" },
  { id: "TYPESCRIPT", label: "TypeScript" },
];

export function Projects({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedSlug, setSelectedSlug] = useState<string>(
    projects[0]?.slug || "finance-pal"
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeFilter === "ALL") return true;
      const tags = p.tags.map((t) => t.toUpperCase());
      if (activeFilter === "CPP") {
        return tags.some((t) => t.includes("C++") || t === "C");
      }
      if (activeFilter === "REACT") {
        return tags.some((t) => t.includes("REACT") || t.includes("VITE"));
      }
      if (activeFilter === "TYPESCRIPT") {
        return tags.some((t) => t.includes("TYPESCRIPT") || t.includes("TS"));
      }
      return true;
    });
  }, [projects, activeFilter]);

  const activeProject = useMemo(() => {
    return (
      filteredProjects.find((p) => p.slug === selectedSlug) ||
      filteredProjects[0] ||
      projects[0]
    );
  }, [filteredProjects, selectedSlug, projects]);

  return (
    <section id="projects" className="py-20 sm:py-24 lg:py-32 border-t border-[var(--color-border)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow
            index="0x04"
            label="PROYECTOS SELECCIONADOS"
            sublabel="SISTEMAS NATIVOS &amp; APLICACIONES WEB"
          />
        </Reveal>

        {/* Filters and Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-6 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
              Obras de Software
            </h2>
            <p className="text-sm text-[var(--color-text-dim)] font-[family-name:var(--font-body)] mt-1">
              Selección de sistemas en producción, laboratorios nativos y herramientas locales.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] overflow-x-auto select-none">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(tab.id);
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-[4px] transition-all duration-150 active:scale-[0.97] whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[var(--color-accent)] text-white font-medium shadow-xs"
                      : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5:7 Asymmetric Split */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 5 Cols -> Numbered Index List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel)] font-mono text-xs text-[var(--color-text-faint)]">
                No hay proyectos en la categoría seleccionada.
              </div>
            ) : (
              filteredProjects.map((p, idx) => {
                const isSelected = activeProject?.slug === p.slug;
                const formattedNum = `0${idx + 1}`.slice(-2);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedSlug(p.slug)}
                    className={`p-4 rounded-[6px] border transition-all duration-150 cursor-pointer select-none ${
                      isSelected
                        ? "bg-white/[0.04] border-[var(--color-border-strong)] shadow-sm"
                        : "bg-[var(--color-panel)] border-[var(--color-border)] hover:bg-white/[0.02] hover:border-[var(--color-border-strong)]"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="text-[10px] text-[var(--color-accent)] font-semibold">
                        [{formattedNum}]
                      </span>
                      <Badge
                        variant={p.status === "LIVE" ? "live" : p.status === "ARCHIVED" ? "outline" : "accent"}
                        className="text-[9px]"
                      >
                        {p.status === "LIVE" ? "LIVE" : p.status === "ARCHIVED" ? "ARCHIVE" : "DEV"}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
                      {p.name}
                    </h3>
                    <p className="text-xs text-[var(--color-text-dim)] font-mono line-clamp-1 mt-0.5">
                      {p.tagline}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[9px] font-mono rounded-[3px] bg-white/[0.03] text-[var(--color-text-faint)] border border-[var(--color-border)]"
                        >
                          {tag}
                        </span>
                      ))}
                      {p.tags.length > 3 && (
                        <span className="text-[9px] font-mono text-[var(--color-text-faint)] self-center">
                          +{p.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: 7 Cols -> Elevated Interactive Stage (Sticky on desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24">
            {activeProject ? (
              <div className="rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-panel)] overflow-hidden surface-elevation shadow-2xl">
                {/* Stage top header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono">
                  <div className="flex items-center gap-2 truncate">
                    <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
                    <span className="text-[var(--color-text-faint)] truncate">
                      SHOWCASE // {activeProject.slug}
                    </span>
                  </div>
                  <Badge
                    variant={
                      activeProject.status === "LIVE"
                        ? "live"
                        : activeProject.status === "ARCHIVED"
                        ? "outline"
                        : "accent"
                    }
                    className="text-[9px]"
                  >
                    {activeProject.status === "LIVE"
                      ? "EN PRODUCCIÓN"
                      : activeProject.status === "ARCHIVED"
                      ? "ARCHIVADO"
                      : "EN DESARROLLO"}
                  </Badge>
                </div>

                {/* Main Showcase Body */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
                      {activeProject.name}
                    </h3>
                    <p className="text-sm font-mono text-[var(--color-accent-bright)] mt-1">
                      {activeProject.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
                    {activeProject.description}
                  </p>

                  {/* Technical Stack Tags */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[var(--color-text-faint)] tracking-wider">
                      Tecnologías Clave
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
                    <ProjectDetailSheet
                      project={activeProject}
                      trigger={
                        <Button variant="secondary" size="default" className="gap-2">
                          <FileText className="w-4 h-4" strokeWidth={1.5} />
                          <span>Ver Ficha Técnica Completa</span>
                        </Button>
                      }
                    />

                    <div className="flex items-center gap-3 font-mono text-xs">
                      {activeProject.repoUrl && (
                        <a
                          href={activeProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors p-2"
                        >
                          <Code2 className="w-4 h-4" strokeWidth={1.5} />
                          <span>Código</span>
                        </a>
                      )}
                      {activeProject.liveUrl && (
                        <a
                          href={activeProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[var(--color-accent-bright)] hover:underline transition-colors p-2 font-semibold"
                        >
                          <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                          <span>Visitar</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
