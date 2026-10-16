"use client";

import React, { useState, useMemo } from "react";
import type { Project } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectDetailSheet } from "@/components/ProjectCard";
import {
  ExternalLink,
  Code2,
  Terminal,
  FileText,
  Workflow,
  ArrowRight,
  Info,
} from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  badge: string;
  details: string;
}

interface ProjectArchitecture {
  title: string;
  tagline: string;
  metric: string;
  nodes: ArchNode[];
}

const PROJECT_ARCHITECTURES: Record<string, ProjectArchitecture> = {
  "finance-pal": {
    title: "Arquitectura Local-First & Bóveda Cero-Nube",
    tagline: "Persistencia local en el dispositivo sin intermediarios externos ni telemetría invasiva",
    metric: "0% Nube · 100% Local-First",
    nodes: [
      { id: "ui", label: "React 19 + Vite UI", badge: "PRESENTACIÓN", details: "Interfaz reactiva modular con tiempos de carga sub-10ms y tipado TypeScript estricto." },
      { id: "state", label: "Zustand State Store", badge: "ESTADO", details: "Gestor atómico en memoria para balances y transacciones sin re-renders innecesarios." },
      { id: "vault", label: "IndexedDB Local Vault", badge: "PERSISTENCIA", details: "Almacén local cifrado en el sandbox del navegador con exportación JSON/CSV segura." },
      { id: "bridge", label: "Capacitor Native Bridge", badge: "NATIVO", details: "Empaquetado binario móvil multiplataforma con acceso seguro a disco local." },
    ],
  },
  "ritmo": {
    title: "Motor de Consistencia & Auditoría de Hábitos",
    tagline: "Matriz diaria de rachas y seguimiento de consistencia",
    metric: "Auditoría de Rachas Continuas",
    nodes: [
      { id: "daily", label: "Daily Checklist Layer", badge: "ENTRADA", details: "Captura de completado con compresión táctil y respuesta háptica inmediata." },
      { id: "matrix", label: "Streak Matrix Engine", badge: "ALGORITMO", details: "Cálculo analítico de rachas acumuladas, días de gracia y porcentajes de cumplimiento." },
      { id: "storage", label: "Local Offline Cache", badge: "STORAGE", details: "Almacenamiento persistente en cliente con sincronización atómica." },
    ],
  },
  "financemate-webpage": {
    title: "Pipeline de Renderizado Edge & Optimización SEO",
    tagline: "Entrega global ultrarrápida con renderizado del lado del servidor",
    metric: "Lighthouse 99+ // Sub-100ms FCP",
    nodes: [
      { id: "router", label: "Next.js App Router", badge: "SERVER", details: "Renderizado estático y dinámico optimizado con prefetch de rutas y meta-tags dinámicos." },
      { id: "style", label: "Tailwind CSS v4 Engine", badge: "ESTILOS", details: "Compilador CSS sin runtime con sistema de variables de diseño de alta precisión." },
      { id: "edge", label: "Vercel Global Edge CDN", badge: "RED GLOBAL", details: "Distribución perimetral multi-región con caché inteligente stale-while-revalidate." },
    ],
  },
  "azure-mod": {
    title: "Pipeline Reactivo de Moderación & Mitigación",
    tagline: "Filtrado heurístico de eventos para comunidades concurrentes (+5,000 miembros)",
    metric: "+5,000 Usuarios Protegidos",
    nodes: [
      { id: "gateway", label: "Discord WebSocket Gateway", badge: "SOCKET", details: "Conexión dúplex para captura de eventos MESSAGE_CREATE a escala masiva." },
      { id: "analyzer", label: "Heuristic Toxicity & Anti-Phishing", badge: "MOTOR", details: "Inspección heurística y coincidencia de patrones regex para neutralizar contenido no deseado." },
      { id: "actions", label: "Tiered Penalty Executor", badge: "MITIGACIÓN", details: "Acciones punitivas progresivas: aviso -> silencio temporal -> expulsión -> baneo permanente." },
    ],
  },
  "cpp-systems-lab": {
    title: "Arena de Memoria Nativa & Gestión de Punteros",
    tagline: "Asignación contigua en C/C++ con alineación de 8 bytes y cero fragmentación",
    metric: "Zero Overhead // O(1) Arena Alloc",
    nodes: [
      { id: "gcc", label: "GCC / Clang Native Compiler", badge: "COMPILADOR", details: "Generación de código binario nativo x86_64 con optimizaciones -O2/-O3." },
      { id: "arena", label: "Custom Memory Arena (1 MB)", badge: "MEMORIA", details: "Reserva de bloque contiguo inicial que elimina llamadas repetitivas al allocator del SO." },
      { id: "align", label: "8-Byte Alignment & Bump Pointer", badge: "PUNTEROS", details: "Alineación natural de estructuras para maximizar aciertos de línea de caché L1/L2." },
      { id: "valgrind", label: "Valgrind Memory Sentinel", badge: "AUDITORÍA", details: "Verificación estricta de límites de lectura/escritura y 0 fugas de memoria." },
    ],
  },
};

const DEFAULT_ARCH: ProjectArchitecture = {
  title: "Arquitectura Modular de Software",
  tagline: "Estructura por capas orientada a separación de responsabilidades",
  metric: "Clean Architecture // TypeScript",
  nodes: [
    { id: "ui", label: "Capa de Presentación UI", badge: "FRONTEND", details: "Componentes reactivos accesibles con diseño atómico." },
    { id: "domain", label: "Capa de Dominio & Lógica", badge: "CORE", details: "Reglas de negocio aisladas e independientes del framework." },
    { id: "data", label: "Persistencia & Datos", badge: "BACKEND", details: "Acceso seguro a datos con validación Zod estricta." },
  ],
};

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
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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

  const archData = useMemo(() => {
    if (!activeProject) return DEFAULT_ARCH;
    return PROJECT_ARCHITECTURES[activeProject.slug] || DEFAULT_ARCH;
  }, [activeProject]);

  const activeNodeInfo = useMemo(() => {
    if (!selectedNodeId) return archData.nodes[0];
    return archData.nodes.find((n) => n.id === selectedNodeId) || archData.nodes[0];
  }, [archData, selectedNodeId]);

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

          {/* Filter Tabs with layoutId smooth sliding indicator */}
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
                  className={`relative px-3 py-1 text-xs font-mono rounded-[4px] transition-all duration-150 active:scale-[0.97] whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-white font-medium"
                      : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="projects-active-filter"
                      className="absolute inset-0 bg-[var(--color-accent)] rounded-[4px] shadow-xs"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
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
                    onClick={() => {
                      setSelectedSlug(p.slug);
                      setSelectedNodeId(null);
                    }}
                    className={`p-4 rounded-[6px] border transition-all duration-150 cursor-pointer select-none active:scale-[0.98] ${
                      isSelected
                        ? "bg-white/[0.05] border-[var(--color-border-strong)] shadow-md"
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
            <AnimatePresence mode="wait">
              {activeProject ? (
                <motion.div
                  key={activeProject.slug}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.165, 0.84, 0.44, 1] }}
                  className="rounded-[8px] border border-[var(--color-border-strong)] bg-[var(--color-panel)] overflow-hidden surface-elevation shadow-2xl"
                >
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

                    {/* Animated Architecture Visualizer */}
                    <div className="p-4 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] space-y-3 font-mono">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-border)] pb-2 text-xs">
                        <div className="flex items-center gap-1.5 text-[var(--color-text)] font-semibold">
                          <Workflow className="w-3.5 h-3.5 text-[var(--color-accent)] animate-pulse" strokeWidth={1.5} />
                          <span>ESQUEMA DE ARQUITECTURA // PIPELINE VIVO</span>
                        </div>
                        <span className="flex items-center gap-1.5 text-[10px] text-[var(--color-status-live)] bg-[var(--color-status-live)]/10 px-2 py-0.5 rounded border border-[var(--color-status-live)]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-live)] animate-pulse" />
                          <span>{archData.metric}</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-[var(--color-text-faint)] flex items-center justify-between">
                        <span>{archData.tagline}</span>
                        <span className="text-[9px] uppercase tracking-wider text-[var(--color-telemetry)] hidden sm:inline">
                          DATA_FLOW: 60FPS
                        </span>
                      </div>

                      {/* Animated SVG Bus / Conduit Flow Line */}
                      <div className="w-full h-1 relative overflow-hidden py-0.5">
                        <svg className="w-full h-1 overflow-visible" preserveAspectRatio="none">
                          <line
                            x1="0"
                            y1="1"
                            x2="100%"
                            y2="1"
                            stroke="var(--color-border-strong)"
                            strokeWidth="1"
                          />
                          <line
                            x1="0"
                            y1="1"
                            x2="100%"
                            y2="1"
                            stroke="var(--color-accent)"
                            strokeWidth="1.5"
                            strokeDasharray="6 6"
                            className="animate-dash-flow opacity-80"
                          />
                        </svg>
                      </div>

                      {/* Interactive Pipeline Nodes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                        {archData.nodes.map((node, i) => {
                          const isNodeActive = activeNodeInfo.id === node.id;
                          return (
                            <button
                              key={node.id}
                              type="button"
                              onClick={() => setSelectedNodeId(node.id)}
                              className={`relative p-2.5 rounded-[4px] border text-left transition-all duration-150 active:scale-[0.97] cursor-pointer flex flex-col justify-between min-h-[68px] overflow-hidden ${
                                isNodeActive
                                  ? "text-[var(--color-text)] border-[var(--color-accent)] shadow-sm"
                                  : "bg-black/30 text-[var(--color-text-dim)] border-[var(--color-border)] hover:bg-white/[0.03] hover:text-[var(--color-text)]"
                              }`}
                            >
                              {isNodeActive && (
                                <motion.span
                                  layoutId="arch-active-node-bg"
                                  className="absolute inset-0 bg-white/[0.07] border border-[var(--color-accent)] rounded-[4px]"
                                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                              )}
                              <div className="flex items-center justify-between text-[9px] text-[var(--color-text-faint)] relative z-10">
                                <span className="flex items-center gap-1">
                                  {isNodeActive && (
                                    <span className="relative flex h-1.5 w-1.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75" />
                                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-accent)]" />
                                    </span>
                                  )}
                                  <span>{node.badge}</span>
                                </span>
                                {i < archData.nodes.length - 1 && (
                                  <ArrowRight className="w-2.5 h-2.5 opacity-50 hidden lg:block" />
                                )}
                              </div>
                              <div className="text-[11px] font-semibold truncate mt-1 relative z-10">
                                {node.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Node Detail Drawer / Inspection Stage with AnimatePresence */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeNodeInfo.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: [0.165, 0.84, 0.44, 1] }}
                          className="p-3 rounded-[4px] bg-black/40 border border-[var(--color-border)] text-xs text-[var(--color-text-dim)] flex items-start gap-2.5"
                        >
                          <Info className="w-3.5 h-3.5 text-[var(--color-telemetry)] shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div className="space-y-1 w-full">
                            <div className="flex items-center justify-between">
                              <span className="text-[var(--color-text)] font-semibold text-[11px]">
                                {activeNodeInfo.label}
                              </span>
                              <span className="text-[9px] text-[var(--color-status-live)]">
                                [ESTADO: VERIFICADO]
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-[var(--color-text-dim)] font-[family-name:var(--font-body)]">
                              {activeNodeInfo.details}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

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
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
