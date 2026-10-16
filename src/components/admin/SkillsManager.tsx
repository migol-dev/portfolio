"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { Skill } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillForm } from "@/components/admin/SkillForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { resolveIcon } from "@/lib/icons";

export function SkillsManager({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [search, setSearch] = useState("");
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
  }

  async function confirmDelete() {
    if (!deletingSkill) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/skills/${deletingSkill.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo eliminar la habilidad.");
      }
      setSkills((prev) => prev.filter((s) => s.id !== deletingSkill.id));
      toast.success("Habilidad eliminada.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar habilidad.");
    } finally {
      setIsDeleting(false);
      setDeletingSkill(null);
    }
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return skills;
    const q = search.toLowerCase();
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [skills, search]);

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-text-faint)] uppercase mb-1">
            GESTIÓN DE ENTIDADES
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            Habilidades ({skills.length})
          </h1>
          <p className="text-sm text-[var(--color-text-dim)]">
            Catálogo técnico clasificado por dominio y nivel de competencia.
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          <span>[NUEVA HABILIDAD]</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-[var(--color-text-faint)] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="w-full h-9 pl-9 pr-3 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-hidden focus:border-[var(--color-accent)]"
        />
      </div>

      {/* 1px Hairline Table with Hover Actions */}
      <div className="border border-[var(--color-border)] rounded-[8px] bg-[var(--color-panel)] overflow-hidden shadow-lg surface-elevation">
        <div className="grid grid-cols-12 px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-[10px] font-mono text-[var(--color-text-faint)] uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-5">NOMBRE &amp; RESUMEN</div>
          <div className="hidden sm:block sm:col-span-3">CATEGORÍA</div>
          <div className="hidden sm:block sm:col-span-2 text-center">NIVEL</div>
          <div className="col-span-6 sm:col-span-2 text-right">ACCIONES</div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--color-text-faint)]">
              No se encontraron habilidades.
            </div>
          ) : (
            filtered.map((skill) => {
              const Icon = resolveIcon(skill.icon);
              return (
                <div
                  key={skill.id}
                  className="grid grid-cols-12 items-center px-4 py-3 text-xs font-mono transition-colors hover:bg-white/[0.02] group"
                >
                  {/* Name & Summary */}
                  <div className="col-span-6 sm:col-span-5 min-w-0 pr-2 flex items-center gap-2.5">
                    <div className="p-1.5 rounded-[4px] bg-white/[0.03] border border-[var(--color-border)] shrink-0">
                      <Icon className="w-3.5 h-3.5 text-[var(--color-text)]" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[var(--color-text)] truncate">
                        {skill.name}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-faint)] truncate font-normal">
                        {skill.summary}
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:block sm:col-span-3 text-[11px] text-[var(--color-text-dim)] uppercase">
                    {skill.category}
                  </div>

                  {/* Level */}
                  <div className="hidden sm:block sm:col-span-2 text-center">
                    <Badge
                      variant={skill.level === "AVANZADO" ? "live" : skill.level === "INTERMEDIO" ? "accent" : "telemetry"}
                      className="text-[9px]"
                    >
                      {skill.level}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(skill)}
                      className="h-8 w-8 text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
                      title="Editar habilidad"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingSkill(skill)}
                      className="h-8 w-8 text-[var(--color-text-dim)] hover:text-[var(--color-danger)]"
                      title="Eliminar habilidad"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Edit/Create Form Dialog */}
      <SkillForm
        open={formOpen}
        onOpenChange={setFormOpen}
        skill={editing}
        onSaved={handleSaved}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingSkill)}
        onOpenChange={(open) => !open && setDeletingSkill(null)}
        title={`¿Eliminar "${deletingSkill?.name}"?`}
        description="Esta acción eliminará la tecnología de la base de datos PostgreSQL de forma permanente e invalidará la caché del sitio público."
        confirmLabel="Eliminar Habilidad"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
