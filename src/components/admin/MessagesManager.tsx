"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { ContactMessage } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function toggleRead(message: ContactMessage) {
    const res = await fetch(`/api/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !message.read }),
    });
    if (!res.ok) {
      toast.error("No se pudo actualizar el mensaje.");
      return;
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, read: !m.read } : m))
    );
  }

  async function handleDelete(message: ContactMessage) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const res = await fetch(`/api/messages/${message.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("No se pudo eliminar el mensaje.");
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== message.id));
    toast.success("Mensaje eliminado.");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Mensajes</h1>
        <p className="text-sm text-text-dim">Enviados desde el formulario de contacto.</p>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-text-faint font-mono">{"// no hay mensajes todavía"}</p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className="rounded-lg border border-border bg-panel/60 p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text text-sm">{message.name}</h3>
                    {!message.read && <Badge>nuevo</Badge>}
                  </div>
                  <a
                    href={`mailto:${message.email}`}
                    className="text-xs text-cyan hover:underline"
                  >
                    {message.email}
                  </a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toggleRead(message)}>
                    {message.read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(message)}>
                    <Trash2 className="h-4 w-4 text-red" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-text-dim whitespace-pre-wrap">{message.message}</p>
              <p className="text-xs text-text-faint font-mono mt-2">
                {new Date(message.createdAt).toLocaleString("es-MX")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
