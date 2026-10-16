"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { InteractiveSystemsStage } from "@/components/InteractiveSystemsStage";
import { useCommandPalette } from "@/components/CommandPalette";

export function Hero() {
  const { toggle: toggleCommandPalette } = useCommandPalette();

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-3.5rem)] flex items-center pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden"
    >
      {/* Background architectural coordinate line */}
      <div className="absolute top-1/4 inset-x-0 h-px bg-[var(--color-border)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: 7 columns narrative */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.165, 0.84, 0.44, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* System Status Pill */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="live" className="py-1 px-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-live)] animate-pulse" />
                SYS.READY // C/C++ &amp; FULL-STACK WEB — DISPONIBLE
              </Badge>
              <span className="text-[10px] font-mono text-[var(--color-text-faint)] hidden sm:inline">
                COLIMA, MX · UTC-6
              </span>
            </div>

            {/* Display Headline: Syne + Instrument Serif italic */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-[-0.035em] text-[var(--color-text)] leading-[1.08] font-[family-name:var(--font-display)]">
              Del control de memoria en{" "}
              <span className="font-[family-name:var(--font-editorial)] italic text-[var(--color-accent-bright)] font-normal">
                C/C++
              </span>{" "}
              a interfaces reactivas en la{" "}
              <span className="font-[family-name:var(--font-editorial)] italic text-[var(--color-text)] font-normal">
                web
              </span>
              .
            </h1>

            {/* Subheadline & Value Proposition */}
            <p className="max-w-[58ch] text-sm sm:text-base text-[var(--color-text-dim)] leading-relaxed font-[family-name:var(--font-body)]">
              Soy <span className="text-[var(--color-text)] font-semibold">Miguel García (MIGOL)</span> — desarrollador enfocado en ingeniería de sistemas con C/C++ y en aplicaciones web full stack con React, TypeScript, Vite y PostgreSQL. Bilingüe español/inglés, con criterio riguroso de arquitectura y diseño.
            </p>

            {/* CTAs with tactile micro-physics */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="#projects">
                  <span>[01 // EXPLORAR PROYECTOS]</span>
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
              </Button>

              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <a href="#contact">
                  <span>[02 // CONTACTAR]</span>
                </a>
              </Button>
            </div>

            {/* Micro Hint for Command Palette */}
            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[var(--color-text-faint)]">
              <span>Consejo:</span>
              <button
                type="button"
                onClick={toggleCommandPalette}
                className="inline-flex items-center gap-1.5 text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
              >
                <span>Presiona</span>
                <Kbd>⌘K</Kbd>
                <span className="hidden sm:inline">para abrir la paleta de comandos</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: 5 columns 3D Interactive Systems Stage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.165, 0.84, 0.44, 1] }}
            className="lg:col-span-5 w-full"
          >
            <InteractiveSystemsStage />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
