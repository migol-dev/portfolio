"use client";

import React from "react";
import { ExternalLink, Code2, Terminal, ArrowUpRight, FileText, CheckCircle2 } from "lucide-react";
import type { Project } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "live" | "accent" | "outline" }
> = {
  LIVE: { label: "En Producción", variant: "live" },
  IN_PROGRESS: { label: "En Desarrollo", variant: "accent" },
  ARCHIVED: { label: "Archivado", variant: "outline" },
};

export function ProjectDetailSheet({
  project,
  trigger,
}: {
  project: Project;
  trigger?: React.ReactNode;
}) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.LIVE;

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="secondary" size="sm" className="gap-1.5">
            <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Ficha Técnica</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[var(--color-accent)] font-semibold">
              FICHA_TÉCNICA //
            </span>
            <Badge variant={status.variant} className="text-[9px]">
              {status.label}
            </Badge>
          </div>
          <SheetTitle className="text-xl sm:text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-text)]">
            {project.name}
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-[var(--color-text-dim)]">
            {project.tagline}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 text-xs font-mono">
          {/* Overview */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-[var(--color-text-faint)] tracking-wider">
              01 // DESCRIPCIÓN ARQUITECTÓNICA
            </span>
            <p className="text-sm font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Stack & Technologies */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-[var(--color-text-faint)] tracking-wider">
              02 // STACK &amp; DEPENDENCIAS
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Engineering Criteria */}
          <div className="space-y-2.5 p-3.5 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)]">
            <span className="text-[10px] uppercase text-[var(--color-accent)] font-semibold tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-status-live)]" strokeWidth={1.5} />
              CRITERIOS DE INGENIERÍA
            </span>
            <ul className="space-y-1.5 text-[11px] text-[var(--color-text-dim)] list-disc list-inside">
              <li>Arquitectura orientada a tipos y desacoplamiento de estado.</li>
              <li>Manejo estricto de excepciones y control de ciclos de vida.</li>
              <li>Diseño responsivo validado en múltiples dimensiones.</li>
            </ul>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-3">
            {project.repoUrl && (
              <Button asChild size="sm">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Ver Repositorio</span>
                  <ArrowUpRight className="w-3 h-3" strokeWidth={1.5} />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild variant="secondary" size="sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Visitar Proyecto</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ProjectCard({ project }: { project: Project; delay?: number }) {
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.LIVE;

  return (
    <article className="rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel)] overflow-hidden transition-all duration-200 hover:border-[var(--color-border-strong)]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
          <span className="text-[var(--color-text-faint)] truncate">
            /projects/{project.slug}
          </span>
        </div>
        <Badge variant={status.variant} className="text-[9px] shrink-0">
          {status.label}
        </Badge>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="text-base font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
            {project.name}
          </h3>
          <p className="text-xs text-[var(--color-text-dim)] font-mono mt-0.5">
            {project.tagline}
          </p>
        </div>

        <p className="text-xs text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
          <ProjectDetailSheet project={project} />

          <div className="flex items-center gap-3 text-xs font-mono">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors"
              >
                <Code2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Repo</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--color-accent-bright)] hover:underline transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>Visitar</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
