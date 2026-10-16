import Link from "next/link";
import { FolderKanban, Sparkles, Mail, AlertCircle, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getCounts() {
  if (!process.env.DATABASE_URL) return { projects: 0, skills: 0, messages: 0, unread: 0, isDbConnected: false };
  try {
    const [projects, skills, messages, unread] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
    ]);
    return { projects, skills, messages, unread, isDbConnected: true };
  } catch {
    return { projects: 0, skills: 0, messages: 0, unread: 0, isDbConnected: false };
  }
}

export default async function AdminHome() {
  const counts = await getCounts();

  const metrics = [
    {
      href: "/admin/projects",
      label: "PROYECTOS ACTIVOS",
      value: counts.projects,
      sublabel: "Mostrados en /projects",
      icon: FolderKanban,
      accent: "text-[var(--color-accent)]",
    },
    {
      href: "/admin/skills",
      label: "HABILIDADES INDEXADAS",
      value: counts.skills,
      sublabel: "Matriz técnica en /skills",
      icon: Sparkles,
      accent: "text-[var(--color-telemetry)]",
    },
    {
      href: "/admin/messages",
      label: "BANDEJA DE CONTACTO",
      value: counts.messages,
      sublabel: counts.unread > 0 ? `${counts.unread} mensajes sin leer` : "Todos revisados",
      icon: Mail,
      accent: counts.unread > 0 ? "text-[var(--color-status-live)]" : "text-[var(--color-text-dim)]",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-faint)] mb-1">
          <span>SISTEMA // RESUMEN DE TELEMETRÍA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-text)] font-[family-name:var(--font-display)]">
          Consola Central
        </h1>
        <p className="text-sm text-[var(--color-text-dim)] font-[family-name:var(--font-body)] mt-1">
          Monitorea y gestiona las entidades de tu portfolio sincronizadas con PostgreSQL.
        </p>
      </div>

      {/* Database Warning if disconnected */}
      {!counts.isDbConnected && (
        <div className="p-4 rounded-[6px] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-xs font-mono text-[var(--color-accent-bright)] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={1.5} />
          <div className="space-y-1">
            <span className="font-semibold uppercase tracking-wider block">
              BASE DE DATOS NO CONECTADA (MODO FALLBACK)
            </span>
            <p className="text-[var(--color-text-dim)] leading-relaxed">
              `DATABASE_URL` no está enlazada o no responde. El sitio público muestra contenido de respaldo estático (Finance Pal, AutoMod Sentinel, C/C++ Lab). Configura tus credenciales y ejecuta `npm run db:seed` para habilitar mutaciones en vivo.
            </p>
          </div>
        </div>
      )}

      {/* Metrics Row (Divided by Vertical Hairlines, zero card-itis) */}
      <div className="border border-[var(--color-border)] rounded-[8px] bg-[var(--color-panel)] overflow-hidden shadow-lg surface-elevation">
        <div className="px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-panel-2)] text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-faint)] flex items-center justify-between">
          <span>MÉTRICAS DEL SISTEMA</span>
          <span className="flex items-center gap-1.5 text-[var(--color-status-live)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-live)] animate-pulse" />
            SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-border)]">
          {metrics.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="p-6 transition-colors hover:bg-white/[0.02] flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between font-mono mb-4">
                <span className="text-[11px] text-[var(--color-text-faint)] uppercase tracking-wider">
                  {m.label}
                </span>
                <m.icon className={`w-4 h-4 ${m.accent}`} strokeWidth={1.5} />
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-bold font-mono text-[var(--color-text)] tnum">
                  {m.value}
                </div>
                <div className="text-xs text-[var(--color-text-dim)] font-mono mt-1 flex items-center justify-between">
                  <span>{m.sublabel}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent)]" strokeWidth={1.5} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
