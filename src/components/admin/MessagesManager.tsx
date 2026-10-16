"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2, Calendar, User, Search, CheckCheck } from "lucide-react";
import type { ContactMessage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMessages[0]?.id || null
  );
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [search, setSearch] = useState("");
  const [deletingMessage, setDeletingMessage] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedId) || null;
  }, [messages, selectedId]);

  async function toggleRead(message: ContactMessage, targetState?: boolean) {
    const newState = targetState !== undefined ? targetState : !message.read;
    try {
      const res = await fetch(`/api/messages/${message.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newState }),
      });
      if (!res.ok) {
        throw new Error("No se pudo actualizar el estado del mensaje.");
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, read: newState } : m))
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar mensaje.");
    }
  }

  function handleSelectMessage(message: ContactMessage) {
    setSelectedId(message.id);
    if (!message.read) {
      toggleRead(message, true);
    }
  }

  async function confirmDelete() {
    if (!deletingMessage) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/messages/${deletingMessage.id}`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("No se pudo eliminar el mensaje.");
      }
      setMessages((prev) => prev.filter((m) => m.id !== deletingMessage.id));
      if (selectedId === deletingMessage.id) {
        const remaining = messages.filter((m) => m.id !== deletingMessage.id);
        setSelectedId(remaining[0]?.id || null);
      }
      toast.success("Mensaje eliminado.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar mensaje.");
    } finally {
      setIsDeleting(false);
      setDeletingMessage(null);
    }
  }

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filter === "UNREAD" && m.read) return false;
      if (filter === "READ" && !m.read) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [messages, filter, search]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  return (
    <div className="space-y-6">
      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-[var(--color-text-faint)] uppercase mb-1">
            CANAL DE COMUNICACIÓN
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
            Mensajes de Contacto ({messages.length})
          </h1>
          <p className="text-sm text-[var(--color-text-dim)]">
            Bandeja de entrada segura originada desde el formulario de contacto.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="live" className="text-xs py-1 px-2.5">
              {unreadCount} SIN LEER
            </Badge>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[var(--color-text-faint)] absolute left-3 top-1/2 -translate-y-1/2" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por remitente o contenido..."
            className="w-full h-9 pl-9 pr-3 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-hidden focus:border-[var(--color-accent)]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] font-mono text-xs">
          {(["ALL", "UNREAD", "READ"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-[4px] transition-colors cursor-pointer ${
                filter === tab
                  ? "bg-[var(--color-accent)] text-white font-semibold"
                  : "text-[var(--color-text-dim)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab === "ALL" ? "Todos" : tab === "UNREAD" ? "No leídos" : "Leídos"}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Split Architecture */}
      <div className="border border-[var(--color-border)] rounded-[8px] bg-[var(--color-panel)] overflow-hidden shadow-xl surface-elevation grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
        {/* Master List (5 cols on md) */}
        <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[var(--color-border)] overflow-y-auto max-h-[520px] divide-y divide-[var(--color-border)]">
          {filteredMessages.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-[var(--color-text-faint)]">
              No hay mensajes para este criterio de búsqueda.
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isSelected = selectedId === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelectMessage(m)}
                  className={`p-3.5 text-xs font-mono transition-colors cursor-pointer select-none ${
                    isSelected
                      ? "bg-white/[0.05] border-l-2 border-l-[var(--color-accent)]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[var(--color-text)] truncate max-w-[160px]">
                      {m.name}
                    </span>
                    {!m.read ? (
                      <Badge variant="live" className="text-[8px] py-0 px-1">
                        NUEVO
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-[var(--color-text-faint)]">Leído</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[var(--color-text-dim)] truncate mb-1">
                    {m.email}
                  </div>
                  <p className="text-[11px] text-[var(--color-text-faint)] line-clamp-1 font-normal font-[family-name:var(--font-body)]">
                    {m.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Detail Panel (7 cols on md) */}
        <div className="md:col-span-7 p-6 flex flex-col justify-between overflow-y-auto max-h-[520px]">
          {selectedMessage ? (
            <div className="space-y-6">
              {/* Message metadata */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
                <div>
                  <h2 className="text-lg font-bold text-[var(--color-text)] font-[family-name:var(--font-display)]">
                    {selectedMessage.name}
                  </h2>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-mono text-[var(--color-accent-bright)] hover:underline block mt-0.5"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRead(selectedMessage)}
                    title={selectedMessage.read ? "Marcar como no leído" : "Marcar como leído"}
                    className="h-8 w-8 text-[var(--color-text-dim)]"
                  >
                    {selectedMessage.read ? (
                      <MailOpen className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <Mail className="w-4 h-4 text-[var(--color-status-live)]" strokeWidth={1.5} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingMessage(selectedMessage)}
                    title="Eliminar mensaje"
                    className="h-8 w-8 text-[var(--color-text-dim)] hover:text-[var(--color-danger)]"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-faint)] flex items-center justify-between">
                  <span>CONTENIDO DE LA TRANSMISIÓN:</span>
                  <span className="tnum">
                    {new Date(selectedMessage.createdAt).toLocaleString("es-MX")}
                  </span>
                </div>
                <div className="p-4 rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs sm:text-sm font-[family-name:var(--font-body)] text-[var(--color-text)] leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Quick reply action */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                <Button asChild size="sm">
                  <a href={`mailto:${selectedMessage.email}?subject=Respuesta a tu mensaje // migol.dev`}>
                    <Mail className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Responder por correo</span>
                  </a>
                </Button>
                {selectedMessage.ip && (
                  <span className="text-[10px] font-mono text-[var(--color-text-faint)]">
                    IP: {selectedMessage.ip}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-xs font-mono text-[var(--color-text-faint)]">
              Selecciona un mensaje de la lista para inspeccionar sus detalles.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(deletingMessage)}
        onOpenChange={(open) => !open && setDeletingMessage(null)}
        title="¿Eliminar mensaje de contacto?"
        description="Esta acción eliminará el mensaje permanentemente de la base de datos."
        confirmLabel="Eliminar Mensaje"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
