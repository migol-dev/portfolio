"use client";

import { useEffect, useState } from "react";
import { Terminal, Palette, Command, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { useCommandPalette } from "@/components/CommandPalette";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "#hero", index: "01", label: "HERO" },
  { href: "#about", index: "02", label: "SOBRE MÍ" },
  { href: "#skills", index: "03", label: "HABILIDADES" },
  { href: "#projects", index: "04", label: "PROYECTOS" },
  { href: "#experience", index: "05", label: "TRAYECTORIA" },
  { href: "#contact", index: "06", label: "CONTACTO" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggle: toggleCommandPalette } = useCommandPalette();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((t) => document.querySelector(t.href)).filter(
      (el): el is Element => Boolean(el)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-200 border-b",
        scrolled
          ? "bg-[var(--color-void)]/90 backdrop-blur-md border-[var(--color-border)] shadow-xs"
          : "bg-[var(--color-void)]/60 backdrop-blur-xs border-[var(--color-border)]"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo & System Coordinate */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 font-mono text-xs font-semibold text-[var(--color-text)] shrink-0 group active:scale-[0.97] transition-transform"
          >
            <div className="p-1 rounded-[4px] bg-white/[0.04] border border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors">
              <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
            </div>
            <span>[0xMIGOL]</span>
            <span className="hidden lg:inline text-[10px] text-[var(--color-text-faint)] font-normal">
              {"// C++ & FULL-STACK"}
            </span>
          </a>

          {/* Desktop Navigation 01-06 */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-1.5 text-xs font-mono transition-colors rounded-[4px]",
                    isActive
                      ? "text-[var(--color-text)] font-medium bg-white/[0.04] border border-[var(--color-border-strong)]"
                      : "text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.02]"
                  )}
                >
                  <span className="text-[10px] text-[var(--color-accent)] mr-1.5 opacity-80">
                    {item.index}
                  </span>
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Tools: Palette Toggle, ⌘K trigger, Contact Button */}
          <div className="flex items-center gap-2">
            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Tema actual: ${theme}. Haz clic para cambiar`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] active:scale-[0.97] transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[var(--color-accent)]" strokeWidth={1.5} />
              <span className="text-[10px] uppercase font-mono hidden sm:inline">
                {theme === "crimson" ? "Crimson" : "Cryo"}
              </span>
            </button>

            {/* ⌘K Command Palette Trigger */}
            <button
              type="button"
              onClick={toggleCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] border border-[var(--color-border)] bg-[var(--color-panel-2)] text-xs font-mono text-[var(--color-text-dim)] hover:text-[var(--color-text)] active:scale-[0.97] transition-all cursor-pointer"
              title="Abrir paleta de comandos (⌘K / Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5 text-[var(--color-telemetry)]" strokeWidth={1.5} />
              <span className="text-[10px] uppercase font-mono hidden md:inline">Buscar</span>
              <Kbd className="hidden sm:inline-flex text-[9px]">⌘K</Kbd>
            </button>

            {/* Contact CTA */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-[6px] bg-[var(--color-accent)] text-white px-3.5 py-1.5 text-xs font-mono font-medium hover:bg-[var(--color-accent-bright)] active:scale-[0.97] transition-all shadow-xs shrink-0"
            >
              Contactar
            </a>

            {/* Mobile Sheet Drawer Trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-[4px] border border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-text)] active:scale-[0.97] transition-all"
                  aria-label="Abrir menú"
                >
                  <Menu className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="flex flex-col justify-between">
                <div>
                  <SheetHeader>
                    <SheetTitle>[0xMIGOL] // MENÚ</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-6">
                    {NAV_ITEMS.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-[6px] text-sm font-mono transition-colors border",
                          active === item.href
                            ? "bg-white/[0.04] text-[var(--color-text)] border-[var(--color-border-strong)]"
                            : "text-[var(--color-text-dim)] border-transparent hover:bg-white/[0.02]"
                        )}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs text-[var(--color-accent)]">{item.index}</span>
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="pt-6 border-t border-[var(--color-border)] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--color-text-dim)]">
                    <span>Paleta activa:</span>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="px-2.5 py-1 rounded-[4px] bg-[var(--color-panel-2)] border border-[var(--color-border)] text-[var(--color-accent-bright)]"
                    >
                      {theme.toUpperCase()}
                    </button>
                  </div>
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center p-3 rounded-[6px] bg-[var(--color-accent)] text-white text-xs font-mono uppercase font-semibold tracking-wider"
                  >
                    Contactar
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
