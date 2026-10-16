"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Sparkles,
  Mail,
  ExternalLink,
  Terminal,
} from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/skills", label: "Habilidades", icon: Sparkles },
  { href: "/admin/messages", label: "Mensajes", icon: Mail },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If login page, don't show admin sidebar rail
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[var(--color-void)]">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--color-void)] text-[var(--color-text)]">
      {/* Sidebar Rail */}
      <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-[var(--color-border)] p-4 flex flex-col justify-between bg-[var(--color-panel)] md:sticky md:top-0 md:h-screen select-none">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--color-text)]">
              <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
              <span>[0xMIGOL]</span>
              <span className="text-[var(--color-accent)] font-bold">{"// ADMIN"}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-[var(--color-status-live)] animate-pulse" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-xs font-mono transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-white/[0.06] text-[var(--color-text)] font-semibold border border-[var(--color-border-strong)]"
                      : "text-[var(--color-text-dim)] hover:bg-white/[0.02] hover:text-[var(--color-text)] border border-transparent"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-faint)]"
                    )}
                    strokeWidth={1.5}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-xs font-mono text-[var(--color-text-dim)] hover:bg-white/[0.02] hover:text-[var(--color-text)] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[var(--color-text-faint)]" strokeWidth={1.5} />
            <span>Ver Sitio Público</span>
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Admin Workspace Stage */}
      <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
