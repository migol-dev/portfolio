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
      onClick={handleLogout}
      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-text-dim hover:bg-red/10 hover:text-red transition-colors text-left"
    >
      <LogOut className="h-4 w-4" />
      Cerrar sesión
    </button>
  );
}
