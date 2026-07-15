"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, MessageCircle, Globe2, Send, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Reveal, SectionEyebrow } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "business.migol.gg@gmail.com",
    href: "mailto:business.migol.gg@gmail.com",
  },
  { icon: MessageCircle, label: "Discord", value: "migol.gg", href: undefined },
  { icon: Globe2, label: "Idiomas", value: "Español / English", href: undefined },
];

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

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

      toast.success("Mensaje enviado. Te responderé pronto.");
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Algo salió mal.");
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionEyebrow path="src/contact.tsx" label="Contacto" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Construyamos algo</h2>
          <p className="max-w-xl text-text-dim mb-12">
            ¿Tienes un proyecto en mente, una comunidad que necesita un bot, o solo
            quieres saludar? Escríbeme.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8">
          <Reveal className="space-y-3">
            {CONTACT_LINKS.map((link) => (
              <div
                key={link.label}
                className="flex items-center gap-4 rounded-lg border border-border bg-panel/60 p-4"
              >
                <div className="rounded-md border border-border-strong bg-panel-2 p-2.5 text-cyan">
                  <link.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-text-faint uppercase tracking-wide">
                    {link.label}
                  </p>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="text-sm text-text hover:text-cyan transition-colors truncate block"
                    >
                      {link.value}
                    </a>
                  ) : (
                    <p className="text-sm text-text truncate">{link.value}</p>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-lg border border-border bg-panel/60 p-6 space-y-5"
              noValidate
            >
              {/* Honeypot anti-spam, oculto para humanos */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
                {...register("company")}
              />

              <div className="space-y-1.5">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="Tu nombre" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-red">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Mensaje</Label>
                <Textarea
                  id="message"
                  placeholder="Cuéntame sobre tu proyecto..."
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs text-red">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> enviar mensaje
                  </>
                )}
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
