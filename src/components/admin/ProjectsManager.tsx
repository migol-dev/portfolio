"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/admin/ProjectForm";

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

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
    toast.success("Proyecto guardado.");
  }

  async function handleDelete(project: Project) {
    if (!confirm(`¿Eliminar "${project.name}"? Esta acción no se puede deshacer.`)) return;

    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("No se pudo eliminar el proyecto.");
      return;
    }
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    toast.success("Proyecto eliminado.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Proyectos</h1>
          <p className="text-sm text-text-dim">Se muestran en la sección /projects del sitio.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nuevo proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-text-faint font-mono">{"// aún no hay proyectos"}</p>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-panel/60 p-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text truncate">{project.name}</h3>
                  {project.featured && <Star className="h-3.5 w-3.5 text-amber shrink-0" />}
                  <Badge variant="outline">{project.status.toLowerCase()}</Badge>
                </div>
                <p className="text-sm text-text-dim truncate">{project.tagline}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(project)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(project)}>
                  <Trash2 className="h-4 w-4 text-red" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectForm
        open={formOpen}
        onOpenChange={setFormOpen}
        project={editing}
        onSaved={handleSaved}
      />
    </div>
  );
}
