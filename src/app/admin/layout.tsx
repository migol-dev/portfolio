import Link from "next/link";
import { LayoutDashboard, FolderKanban, Sparkles, Mail, ExternalLink } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/skills", label: "Habilidades", icon: Sparkles },
  { href: "/admin/messages", label: "Mensajes", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-void">
      <aside className="w-56 shrink-0 border-r border-border p-4 flex flex-col gap-1 sticky top-0 h-screen">
        <div className="font-mono text-sm font-semibold text-text mb-6 px-2">
          migol<span className="text-cyan">.admin</span>
        </div>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-dim hover:bg-panel-2 hover:text-text transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        <div className="mt-auto flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-dim hover:bg-panel-2 hover:text-text transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </Link>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-6 sm:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
