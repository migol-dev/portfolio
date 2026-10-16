"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-xs font-mono text-[var(--color-text-dim)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] active:scale-[0.97] transition-all text-left cursor-pointer"
    >
      <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
      <span>Cerrar sesión</span>
    </button>
  );
}
