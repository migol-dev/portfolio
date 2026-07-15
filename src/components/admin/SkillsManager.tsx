"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Skill } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillForm } from "@/components/admin/SkillForm";
import { resolveIcon } from "@/lib/icons";

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditing(skill);
    setFormOpen(true);
  }

  function handleSaved(saved: Skill) {
    setSkills((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
    });
    toast.success("Habilidad guardada.");
  }

  async function handleDelete(skill: Skill) {
    if (!confirm(`¿Eliminar "${skill.name}"?`)) return;

    const res = await fetch(`/api/skills/${skill.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("No se pudo eliminar la habilidad.");
      return;
    }
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    toast.success("Habilidad eliminada.");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Habilidades</h1>
          <p className="text-sm text-text-dim">Se muestran en la sección /skills del sitio.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Nueva habilidad
        </Button>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-text-faint font-mono">{"// aún no hay habilidades"}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {skills.map((skill) => {
            const Icon = resolveIcon(skill.icon);
            return (
              <div
                key={skill.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-panel/60 p-4"
              >
                <div className="rounded-md border border-border-strong bg-panel-2 p-2 text-cyan shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text text-sm truncate">{skill.name}</h3>
                    <Badge variant="outline">{skill.level.toLowerCase()}</Badge>
                  </div>
                  <p className="text-xs text-text-dim truncate">{skill.summary}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(skill)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(skill)}>
                    <Trash2 className="h-4 w-4 text-red" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <SkillForm open={formOpen} onOpenChange={setFormOpen} skill={editing} onSaved={handleSaved} />
    </div>
  );
}
