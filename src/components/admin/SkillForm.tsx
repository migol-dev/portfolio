"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { Skill } from "@prisma/client";
import { skillSchema, type SkillInput } from "@/lib/validations";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICON_MAP } from "@/lib/icons";

const EMPTY: SkillInput = {
  name: "",
  category: "OTHER",
  level: "APRENDIENDO",
  summary: "",
  icon: "",
  order: 0,
};

export function SkillForm({
  open,
  onOpenChange,
  skill,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill | null;
  onSaved: (skill: Skill) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({ resolver: zodResolver(skillSchema), defaultValues: EMPTY });

  useEffect(() => {
    if (skill) {
      reset({
        name: skill.name,
        category: skill.category,
        level: skill.level,
        summary: skill.summary,
        icon: skill.icon ?? "",
        order: skill.order,
      });
    } else {
      reset(EMPTY);
    }
  }, [skill, reset, open]);

  async function onSubmit(data: SkillInput) {
    const url = skill ? `/api/skills/${skill.id}` : "/api/skills";
    const method = skill ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "No se pudo guardar la habilidad.");
    }

    const saved = (await res.json()) as Skill;
    onSaved(saved);
    onOpenChange(false);
  }

  const category = watch("category");
  const level = watch("level");
  const icon = watch("icon");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Editar habilidad" : "Nueva habilidad"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary">Descripción</Label>
            <Input id="summary" {...register("summary")} />
            {errors.summary && <p className="text-xs text-red">{errors.summary.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoría</Label>
              <Select value={category} onValueChange={(v) => setValue("category", v as SkillInput["category"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LANGUAGE">Lenguaje</SelectItem>
                  <SelectItem value="FRONTEND">Frontend</SelectItem>
                  <SelectItem value="BACKEND">Backend</SelectItem>
                  <SelectItem value="DATABASE">Datos</SelectItem>
                  <SelectItem value="TOOLING">Herramientas</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nivel</Label>
              <Select value={level} onValueChange={(v) => setValue("level", v as SkillInput["level"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APRENDIENDO">Aprendiendo</SelectItem>
                  <SelectItem value="INTERMEDIO">Intermedio</SelectItem>
                  <SelectItem value="AVANZADO">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Ícono</Label>
              <Select value={icon || undefined} onValueChange={(v) => setValue("icon", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Elegir ícono" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(ICON_MAP).map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order">Orden</Label>
              <Input id="order" type="number" {...register("order", { valueAsNumber: true })} />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Guardando..." : "Guardar habilidad"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
