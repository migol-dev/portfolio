"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Terminal, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Credenciales inválidas.");
      }

      // Validación rigurosa para prevenir ataques de Open Redirect
      const rawNext = searchParams.get("next");
      const safeNext =
        rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
          ? rawNext
          : "/admin";

      router.push(safeNext);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-void)]">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-2.5 rounded-[6px] bg-white/[0.04] border border-[var(--color-border)] text-[var(--color-accent)]">
            <Lock className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="font-mono text-xs font-semibold text-[var(--color-text)]">
            [0xMIGOL // AUTENTICACIÓN]
          </div>
          <p className="text-xs text-[var(--color-text-dim)]">
            Acceso restringido para gestión de contenido
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-panel)] p-6 sm:p-7 space-y-4 shadow-xl surface-elevation"
        >
          <div className="space-y-1.5">
            <Label htmlFor="login-email" className="text-xs font-mono text-[var(--color-text)]">
              Correo Admin
            </Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@migol.dev"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-xs font-mono text-[var(--color-text)]">
              Contraseña Maestra
            </Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-2.5 rounded-[4px] border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 text-xs font-mono text-[var(--color-danger)] flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <span>[INGRESAR AL PANEL]</span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
