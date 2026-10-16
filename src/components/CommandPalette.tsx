"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  ArrowRight,
  Palette,
  Copy,
  Check,
  Cpu,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Code2,
} from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { useTheme } from "@/components/ThemeProvider";

interface CommandPaletteContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({
  open: false,
  setOpen: () => {},
  toggle: () => {},
});

export function useCommandPalette() {
  return useContext(CommandPaletteContext);
}

interface CommandItem {
  id: string;
  category: "Navegación" | "Perfil Cognitivo" | "Proyectos" | "Acciones";
  title: string;
  subtitle?: string;
  keywords?: string[];
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Atajo de teclado global: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
      setOpen(false);
    }, 900);
  };

  const navigateTo = (hash: string) => {
    setOpen(false);
    if (window.location.pathname !== "/") {
      router.push(`/${hash}`);
    } else {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const items: CommandItem[] = useMemo(() => [
    {
      id: "nav-hero",
      category: "Navegación",
      title: "01 // HERO & STAGE 3D",
      subtitle: "Inicio y stage interactivo de sistemas",
      keywords: ["inicio", "hero", "3d", "systems"],
      icon: <Cpu className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => navigateTo("#hero"),
    },
    {
      id: "nav-about",
      category: "Navegación",
      title: "02 // SOBRE MÍ",
      subtitle: "Manifiesto, telemetría y topología cognitiva",
      keywords: ["sobre mi", "about", "bio", "manifiesto"],
      icon: <Code2 className="w-4 h-4 text-[var(--color-telemetry)]" strokeWidth={1.5} />,
      action: () => navigateTo("#about"),
    },
    {
      id: "nav-skills",
      category: "Navegación",
      title: "03 // HABILIDADES",
      subtitle: "Matriz técnica C/C++, Web, Herramientas",
      keywords: ["skills", "habilidades", "tecnologias", "stack"],
      icon: <Cpu className="w-4 h-4 text-[var(--color-telemetry)]" strokeWidth={1.5} />,
      action: () => navigateTo("#skills"),
    },
    {
      id: "nav-projects",
      category: "Navegación",
      title: "04 // PROYECTOS",
      subtitle: "Finance Pal, AutoMod Sentinel, C/C++ Lab",
      keywords: ["proyectos", "projects", "trabajos"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => navigateTo("#projects"),
    },
    {
      id: "nav-experience",
      category: "Navegación",
      title: "05 // TRAYECTORIA",
      subtitle: "Registro cronológico y changelog de roles",
      keywords: ["experiencia", "trayectoria", "timeline", "changelog"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-text-dim)]" strokeWidth={1.5} />,
      action: () => navigateTo("#experience"),
    },
    {
      id: "nav-contact",
      category: "Navegación",
      title: "06 // CONTACTO",
      subtitle: "Canales directos y formulario de mensaje",
      keywords: ["contacto", "contact", "email", "mensaje"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => navigateTo("#contact"),
    },
    {
      id: "cog-infp",
      category: "Perfil Cognitivo",
      title: "INFP · SO/SX · 9w1 · 946",
      subtitle: "Topología cognitiva y arquetipo 'The Seeker'",
      keywords: ["infp", "mbti", "9w1", "946", "so/sx", "personalidad", "seeker", "eneatipo"],
      icon: <Sparkles className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => navigateTo("#cognitive"),
    },
    {
      id: "proj-finance",
      category: "Proyectos",
      title: "Finance Pal",
      subtitle: "React + TS + Vite + Zustand + Capacitor",
      keywords: ["finance", "finanzas", "vite", "capacitor"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-telemetry)]" strokeWidth={1.5} />,
      action: () => navigateTo("#projects"),
    },
    {
      id: "proj-automod",
      category: "Proyectos",
      title: "AutoMod Sentinel",
      subtitle: "Discord.js v14 + TypeScript + Node.js (+5k usuarios)",
      keywords: ["automod", "discord", "bot", "sentinel"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-telemetry)]" strokeWidth={1.5} />,
      action: () => navigateTo("#projects"),
    },
    {
      id: "proj-cpp",
      category: "Proyectos",
      title: "C/C++ Systems & Memory Lab",
      subtitle: "Gestión manual de memoria, custom allocators, Valgrind",
      keywords: ["c", "c++", "memory", "allocator", "valgrind", "systems"],
      icon: <ArrowRight className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => navigateTo("#projects"),
    },
    {
      id: "act-theme",
      category: "Acciones",
      title: `Alternar paleta: ${theme === "crimson" ? "Cryo (Frío)" : "Crimson (Carmesí)"}`,
      subtitle: "Cambia entre paleta cálida carmesí y fría cobalto",
      keywords: ["tema", "theme", "crimson", "cryo", "color", "paleta"],
      icon: <Palette className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => toggleTheme(),
    },
    {
      id: "act-copy-email",
      category: "Acciones",
      title: copiedText === "email" ? "¡Correo copiado al portapapeles!" : "Copiar correo electrónico",
      subtitle: "mgarcia245@ucol.mx",
      keywords: ["email", "correo", "copiar", "gmail"],
      icon: copiedText === "email" ? <Check className="w-4 h-4 text-[var(--color-status-live)]" strokeWidth={1.5} /> : <Copy className="w-4 h-4" strokeWidth={1.5} />,
      action: () => copyToClipboard("mgarcia245@ucol.mx", "email"),
    },
    {
      id: "act-admin",
      category: "Acciones",
      title: "Abrir consola /admin",
      subtitle: "Panel protegido de gestión de contenido",
      keywords: ["admin", "login", "panel", "consola", "gestion"],
      icon: <ShieldAlert className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={1.5} />,
      action: () => {
        setOpen(false);
        router.push("/admin");
      },
    },
  ], [theme, copiedText]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
    );
  }, [items, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Manejo de flechas ↑↓ y Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
      }
    }
  };

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen, toggle: () => setOpen((p) => !p) }}>
      {children}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Paleta de comandos"
          className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-xs animate-in fade-in-0 duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[var(--color-panel)] border border-[var(--color-border-strong)] rounded-[8px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Input de búsqueda */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel-2)]">
              <Search className="w-4 h-4 text-[var(--color-accent)] shrink-0" strokeWidth={1.5} />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escribe un comando, sección o perfil cognitivo..."
                className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] focus:outline-hidden"
              />
              <Kbd>ESC</Kbd>
            </div>

            {/* Lista de resultados */}
            <div className="max-h-[360px] overflow-y-auto p-2 space-y-1">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--color-text-faint)] font-mono">
                  No se encontraron comandos para &ldquo;{query}&rdquo;
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-[4px] text-left transition-colors duration-100 cursor-pointer ${
                        isSelected
                          ? "bg-white/[0.06] text-[var(--color-text)] border border-[var(--color-border-strong)]"
                          : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="shrink-0 p-1.5 rounded-[4px] bg-white/[0.03]">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-mono font-medium truncate text-[var(--color-text)]">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="text-[11px] text-[var(--color-text-faint)] truncate">
                              {item.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono uppercase text-[var(--color-text-faint)] hidden sm:inline">
                          {item.category}
                        </span>
                        {isSelected && (
                          <Kbd className="text-[9px]">↵</Kbd>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer con hints */}
            <div className="px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-panel-2)]/50 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-faint)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd> <Kbd>↓</Kbd> Navegar
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> Ejecutar
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-status-live)]" />
                <span>MIGOL.DEV // COMMAND_PALETTE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </CommandPaletteContext.Provider>
  );
}
