"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Project } from "@prisma/client";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const EMPTY: ProjectInput = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  logoUrl: "",
  coverUrl: "",
  tags: [],
  status: "LIVE",
  repoUrl: "",
  liveUrl: "",
  featured: false,
  order: 0,
};

export function ProjectForm({
  open,
  onOpenChange,
  project,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSaved: (project: Project) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    if (project) {
      reset({
        slug: project.slug,
        name: project.name,
        tagline: project.tagline,
        description: project.description,
        logoUrl: project.logoUrl ?? "",
        coverUrl: project.coverUrl ?? "",
        tags: project.tags,
        status: project.status,
        repoUrl: project.repoUrl ?? "",
        liveUrl: project.liveUrl ?? "",
        featured: project.featured,
        order: project.order,
      });
    } else {
      reset(EMPTY);
    }
  }, [project, reset, open]);

  async function onSubmit(data: ProjectInput) {
    const url = project ? `/api/projects/${project.id}` : "/api/projects";
    const method = project ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo guardar el proyecto.");
      }

      const saved = (await res.json()) as Project;
      toast.success(project ? "Proyecto actualizado." : "Proyecto creado.");
      onSaved(saved);
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar proyecto.");
    }
  }

  const status = useWatch({ control, name: "status" });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Nombre</Label>
              <Input id="project-name" placeholder="Ej. Finance Pal" {...register("name")} />
              {errors.name && <p className="text-xs text-[var(--color-danger)]">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-slug">Slug (URL)</Label>
              <Input id="project-slug" placeholder="finance-pal" {...register("slug")} />
              {errors.slug && <p className="text-xs text-[var(--color-danger)]">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-tagline">Tagline</Label>
            <Input
              id="project-tagline"
              placeholder="Una línea descriptiva del proyecto"
              {...register("tagline")}
            />
            {errors.tagline && <p className="text-xs text-[var(--color-danger)]">{errors.tagline.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="project-description">Descripción</Label>
            <Textarea
              id="project-description"
              placeholder="Explica qué hace el proyecto, retos técnicos, etc."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-[var(--color-danger)]">{errors.description.message}</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-tags">Tags (separados por coma)</Label>
              <Input
                id="project-tags"
                placeholder="React, TypeScript, Vite"
                defaultValue={project?.tags?.join(", ") ?? ""}
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  setValue("tags", tags);
                }}
              />
              {errors.tags && <p className="text-xs text-[var(--color-danger)]">{errors.tags.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setValue("status", v as "LIVE" | "IN_PROGRESS" | "ARCHIVED")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIVE">En producción</SelectItem>
                  <SelectItem value="IN_PROGRESS">En desarrollo</SelectItem>
                  <SelectItem value="ARCHIVED">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-repo">URL del repositorio</Label>
              <Input
                id="project-repo"
                placeholder="https://github.com/..."
                {...register("repoUrl")}
              />
              {errors.repoUrl && <p className="text-xs text-[var(--color-danger)]">{errors.repoUrl.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="project-live">URL del demo / sitio</Label>
              <Input id="project-live" placeholder="https://..." {...register("liveUrl")} />
              {errors.liveUrl && <p className="text-xs text-[var(--color-danger)]">{errors.liveUrl.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-mono text-[var(--color-text)] cursor-pointer">
              <input
                type="checkbox"
                className="rounded-[3px] accent-[var(--color-accent)]"
                {...register("featured")}
              />
              <span>Destacado (aparece primero)</span>
            </label>

            <div className="flex items-center gap-2">
              <Label htmlFor="project-order" className="text-xs font-mono">
                Orden:
              </Label>
              <Input
                id="project-order"
                type="number"
                className="w-20 h-8 text-xs font-mono"
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[var(--color-border)]">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar proyecto</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
