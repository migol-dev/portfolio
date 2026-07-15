"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
    watch,
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
    onSaved(saved);
    onOpenChange(false);
  }

  const status = watch("status");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-red">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" placeholder="mi-proyecto" {...register("slug")} />
              {errors.slug && <p className="text-xs text-red">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tagline">Descripción corta</Label>
            <Input id="tagline" {...register("tagline")} />
            {errors.tagline && <p className="text-xs text-red">{errors.tagline.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción completa</Label>
            <Textarea id="description" rows={4} {...register("description")} />
            {errors.description && (
              <p className="text-xs text-red">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">URL del logo</Label>
              <Input id="logoUrl" placeholder="https://..." {...register("logoUrl")} />
              {errors.logoUrl && <p className="text-xs text-red">{errors.logoUrl.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                defaultValue={project?.tags.join(", ") ?? ""}
                onChange={(e) =>
                  setValue(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="repoUrl">Repositorio (opcional)</Label>
              <Input id="repoUrl" placeholder="https://github.com/..." {...register("repoUrl")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="liveUrl">Enlace en vivo (opcional)</Label>
              <Input id="liveUrl" placeholder="https://..." {...register("liveUrl")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={status} onValueChange={(v) => setValue("status", v as ProjectInput["status"])}>
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
            <div className="space-y-1.5">
              <Label htmlFor="order">Orden</Label>
              <Input
                id="order"
                type="number"
                {...register("order", { valueAsNumber: true })}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-text-dim">
            <input type="checkbox" {...register("featured")} className="accent-cyan" />
            Destacar en la portada
          </label>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Guardando..." : "Guardar proyecto"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
