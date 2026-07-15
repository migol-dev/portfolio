import Link from "next/link";
import { FolderKanban, Sparkles, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCounts() {
  if (!process.env.DATABASE_URL) return { projects: 0, skills: 0, messages: 0, unread: 0 };
  try {
    const [projects, skills, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);
    return { projects, skills, messages, unread };
  } catch {
    return { projects: 0, skills: 0, messages: 0, unread: 0 };
  }
}

export default async function AdminHome() {
  const counts = await getCounts();

  const cards = [
    { href: "/admin/projects", label: "Proyectos", value: counts.projects, icon: FolderKanban },
    { href: "/admin/skills", label: "Habilidades", value: counts.skills, icon: Sparkles },
    {
      href: "/admin/messages",
      label: "Mensajes",
      value: counts.messages,
      sub: counts.unread > 0 ? `${counts.unread} sin leer` : undefined,
      icon: Mail,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text mb-1">Resumen</h1>
      <p className="text-sm text-text-dim mb-8">
        Gestiona el contenido que se muestra en tu portfolio público.
      </p>

      {!process.env.DATABASE_URL && (
        <div className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber font-mono">
          DATABASE_URL no está configurado. El sitio público está mostrando contenido de
          respaldo. Configura tu base de datos para poder editar desde aquí.
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-border bg-panel/60 p-5 hover:border-cyan/40 transition-colors"
          >
            <card.icon className="h-5 w-5 text-cyan mb-3" />
            <p className="text-2xl font-bold text-text">{card.value}</p>
            <p className="text-sm text-text-dim">{card.label}</p>
            {card.sub && <p className="text-xs text-amber mt-1 font-mono">{card.sub}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
