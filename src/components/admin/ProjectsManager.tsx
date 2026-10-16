"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Search, Terminal, ArrowUpRight } from "lucide-react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setFormOpen(true);
  }

  function handleSaved(saved: Project) {
    setProjects((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev];
    });
  }

  async function confirmDelete() {
    if (!deletingProject) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/projects/${deletingProject.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo eliminar el proyecto.");
      }
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      toast.success("Proyecto eliminado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar proyecto.");
    } finally {
      setIsDeleting(false);
      setDeletingProject(null);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return projects;
    const q = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q)
    );
  }, [projects, search]);

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-text-faint)] uppercase mb-1">
            GESTIÓN DE ENTIDADES
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            Proyectos ({projects.length})
          </h1>
          <p className="text-sm text-[var(--color-text-dim)]">
            Control de software expuesto en el catálogo y stage público.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>[NUEVO PROYECTO]</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-[var(--color-text-faint)] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o slug..."
          className="w-full h-9 pl-9 pr-3 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-hidden focus:border-[var(--color-accent)]"
        />
      </div>

      {/* 1px Hairline Table with Hover Actions */}
      <div className="border border-[var(--color-border)] rounded-[8px] bg-[var(--color-panel)] overflow-hidden shadow-lg surface-elevation">
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-[10px] font-mono text-[var(--color-text-faint)] uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-5">NOMBRE &amp; SLUG</div>
          <div className="hidden sm:block sm:col-span-3">ESTADO &amp; TAGS</div>
          <div className="hidden sm:block sm:col-span-2 text-center">ORDEN</div>
          <div className="col-span-6 sm:col-span-2 text-right">ACCIONES</div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--color-text-faint)]">
              No se encontraron proyectos.
            </div>
          ) : (
            filtered.map((project) => (
              <div
                key={project.id}
                className="grid grid-cols-12 items-center px-4 py-3 text-xs font-mono transition-colors hover:bg-white/[0.02] group"
              >
                {/* Name & Slug */}
                <div className="col-span-6 sm:col-span-5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5 font-semibold text-[var(--color-text)] truncate">
                    <span className="truncate">{project.name}</span>
                    {project.featured && (
                      <Star className="w-3.5 h-3.5 text-[var(--color-accent)] fill-[var(--color-accent)] shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-faint)] truncate font-mono">
                    /{project.slug}
                  </div>
                </div>

                {/* Status & Tags */}
                <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                  <Badge
                    variant={project.status === "LIVE" ? "live" : "accent"}
                    className="text-[9px]"
                  >
                    {project.status}
                  </Badge>
                  <span className="text-[10px] text-[var(--color-text-faint)] truncate">
                    {project.tags.slice(0, 2).join(", ")}
                  </span>
                </div>

                {/* Order */}
                <div className="hidden sm:block sm:col-span-2 text-center text-[var(--color-text-dim)] tnum">
                  #{project.order}
                </div>

                {/* Actions (Enhanced Hover Disclosure) */}
                <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(project)}
                    className="h-8 w-8 text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                    title="Editar proyecto"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingProject(project)}
                    className="h-8 w-8 text-[var(--color-text-dim)] hover:text-[var(--color-danger)]"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit/Create Form Dialog */}
      <ProjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editing}
        onSaved={handleSaved}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingProject)}
        onOpenChange={(open) => !open && setDeletingProject(null)}
        title={`¿Eliminar "${deletingProject?.name}"?`}
        description="Esta acción eliminará el proyecto de la base de datos PostgreSQL de forma permanente e invalidará la caché del sitio público."
        confirmLabel="Eliminar Proyecto"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
