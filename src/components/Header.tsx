"use client";

import { useEffect, useState } from "react";
import { Menu, X, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "#hero", label: "hero.tsx" },
  { href: "#about", label: "about.tsx" },
  { href: "#skills", label: "skills.ts" },
  { href: "#projects", label: "projects/" },
  { href: "#experience", label: "experience.log" },
  { href: "#contact", label: "contact.tsx" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = TABS.map((t) => document.querySelector(t.href)).filter(
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
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-40 transition-all duration-300 border-b",
        scrolled
          ? "bg-void/90 backdrop-blur-md border-border"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2 font-mono text-sm font-semibold text-text shrink-0"
          >
            <TerminalSquare className="h-4 w-4 text-cyan" aria-hidden />
            migol<span className="text-cyan">.dev</span>
          </a>

          <nav
            aria-label="Menú principal"
            className="hidden md:flex items-center gap-0.5 overflow-x-auto"
          >
            {TABS.map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative px-3.5 py-2 text-xs font-mono whitespace-nowrap transition-colors border-b-2",
                  active === tab.href
                    ? "text-cyan border-cyan"
                    : "text-text-dim border-transparent hover:text-text hover:border-border-strong"
                )}
              >
                {tab.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden md:inline-flex items-center rounded-md border border-cyan/40 bg-cyan/10 px-3.5 py-1.5 text-xs font-mono text-cyan hover:bg-cyan/20 transition-colors shrink-0"
          >
            $ contactar
          </a>

          <button
            className="md:hidden text-text-dim hover:text-text"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Menú móvil"
          className="md:hidden border-t border-border bg-void px-4 py-3 flex flex-col gap-1"
        >
          {TABS.map((tab) => (
            <a
              key={tab.href}
              href={tab.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "rounded px-3 py-2.5 text-sm font-mono",
                active === tab.href ? "bg-cyan/10 text-cyan" : "text-text-dim"
              )}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
