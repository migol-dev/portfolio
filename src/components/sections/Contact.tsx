"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  MessageCircle,
  Copy,
  Check,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function Contact() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Copiado: ${label}`);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  async function onSubmit(data: ContactInput) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "No se pudo enviar el mensaje.");
      }

      toast.success("Mensaje enviado con éxito. Te responderé a la brevedad.");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al enviar el mensaje.");
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-24 lg:py-32 border-t border-[var(--color-border)] relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow
            index="0x06"
            label="CONTACTO"
            sublabel="CANALES DIRECTOS &amp; MENSAJERÍA SEGURA"
          />
        </Reveal>

        {/* 5:7 Asymmetric Split */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start mt-8">
          {/* Left Column: 5 Cols -> Direct Channels with 1-Click Copy */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
                Iniciemos Conversación
              </h2>
              <p className="text-sm text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
                ¿Buscas un desarrollador con criterio de bajo nivel en C/C++ y solidez en React, TypeScript y PostgreSQL? Puedes copiar mis canales directos con un clic o enviar un mensaje directo por el formulario.
              </p>
            </div>

            {/* Direct Channel Items (Hairlines, zero card-itis) */}
            <div className="border border-[var(--color-border)] rounded-[6px] bg-[var(--color-panel)] divide-y divide-[var(--color-border)] overflow-hidden font-mono text-xs">
              {/* Email */}
              <div className="p-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-[4px] bg-white/[0.03] text-[var(--color-accent)] shrink-0">
                    <Mail className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[var(--color-text-faint)] uppercase">
                      Correo Electrónico
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                      mgarcia245@ucol.mx
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-cursor="[COPY]"
                  onClick={() => copyToClipboard("mgarcia245@ucol.mx", "email", "mgarcia245@ucol.mx")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[var(--color-panel-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] active:scale-[0.97] transition-all text-[11px] text-[var(--color-text)] shrink-0 cursor-pointer"
                  title="Copiar correo"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedKey === "email" ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1 text-[var(--color-status-live)]"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Copiado</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1 text-[var(--color-text-dim)]"
                      >
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Copiar</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* Discord */}
              <div className="p-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-[4px] bg-white/[0.03] text-[var(--color-telemetry)] shrink-0">
                    <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[var(--color-text-faint)] uppercase">
                      Discord Handle
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                      migol
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  data-cursor="[COPY]"
                  onClick={() => copyToClipboard("migol", "discord", "migol")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[var(--color-panel-2)] border border-[var(--color-border)] hover:border-[var(--color-telemetry)] active:scale-[0.97] transition-all text-[11px] text-[var(--color-text)] shrink-0 cursor-pointer"
                  title="Copiar usuario de Discord"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedKey === "discord" ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1 text-[var(--color-status-live)]"
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Copiado</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1 text-[var(--color-text-dim)]"
                      >
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.5} />
                        <span>Copiar</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {/* GitHub */}
              <div className="p-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-[4px] bg-white/[0.03] text-[var(--color-text)] shrink-0">
                    <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-[var(--color-text-faint)] uppercase">
                      Perfil de GitHub
                    </div>
                    <div className="text-xs font-semibold text-[var(--color-text)] truncate">
                      github.com/migol-dev
                    </div>
                  </div>
                </div>

                <a
                  href="https://github.com/migol-dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[4px] bg-[var(--color-panel-2)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] active:scale-[0.97] transition-all text-[11px] text-[var(--color-text)] shrink-0"
                >
                  Abrir
                </a>
              </div>
            </div>

            {/* Availability status badge */}
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-dim)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-status-live)] animate-pulse" />
              <span>DISPONIBILIDAD: Proyectos, empleo junior y colaboraciones técnicas</span>
            </div>
          </div>

          {/* Right Column: 7 Cols -> Concentric Radii Form */}
          <div className="lg:col-span-7">
            <div className="rounded-[10px] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 sm:p-8 shadow-xl surface-elevation">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border)] font-mono text-xs">
                <span className="text-[10px] text-[var(--color-text-faint)] uppercase tracking-wider">
                  FORM // TRANSMISIÓN_DIRECTA
                </span>
                <span className="text-[var(--color-status-live)] text-[10px]">
                  ● SECURE TLS ENCRYPTED
                </span>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                {/* Honeypot anti-spam (invisible para humanos) */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                  {...register("company")}
                />

                <div className="space-y-1.5">
                  <Label htmlFor="contact-name" className="text-xs font-mono text-[var(--color-text)]">
                    Nombre Completo
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Ej. Sofia Navarro"
                    {...register("name")}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-mono text-[var(--color-danger)]">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-email" className="text-xs font-mono text-[var(--color-text)]">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="tu.correo@empresa.com"
                    {...register("email")}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-[11px] font-mono text-[var(--color-danger)]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-xs font-mono text-[var(--color-text)]">
                    Mensaje Técnico o Propuesta
                  </Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Cuéntame sobre tu proyecto, requerimientos de sistemas o vacante..."
                    {...register("message")}
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && (
                    <p className="text-[11px] font-mono text-[var(--color-danger)]">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full sm:w-auto min-w-[180px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando mensaje...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" strokeWidth={1.5} />
                        <span>[ENVIAR MENSAJE]</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
