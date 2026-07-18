"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CODE_LINES = [
  { indent: 0, text: "const dev = {" },
  { indent: 1, text: 'name: "Miguel García",' },
  { indent: 1, text: 'alias: "migol",' },
  { indent: 1, text: 'stack: ["TypeScript", "Next.js", "Discord.js"],' },
  { indent: 1, text: "shipsFast: true," },
  { indent: 0, text: "};" },
];

function TypedCode() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    CODE_LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines((v) => Math.max(v, i + 1)), 500 + i * 260));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="rounded-lg border border-border bg-panel overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center gap-1.5 border-b border-border bg-panel-2 px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green/70" />
        <span className="ml-2 text-[11px] font-mono text-text-faint">whoami.ts</span>
      </div>
      <pre className="p-4 sm:p-5 text-[12px] sm:text-[13px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">
        {CODE_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ paddingLeft: `${line.indent * 1.25}rem` }}>
            <span className="text-magenta">
              {line.text.split(/(".*?")/).map((part, j) =>
                part.startsWith('"') ? (
                  <span key={j} className="text-green">
                    {part}
                  </span>
                ) : (
                  <span key={j} className="text-text-dim">
                    {part}
                  </span>
                )
              )}
            </span>
          </div>
        ))}
        {visibleLines >= CODE_LINES.length && (
          <span className="inline-block w-2 h-4 bg-cyan align-middle animate-pulse ml-0.5" />
        )}
      </pre>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center pt-20 pb-16 sm:pt-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 text-xs font-mono text-green mb-5 sm:mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
              disponible para proyectos
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.05] mb-4 sm:mb-5">
              Construyo software
              <br />
              que <span className="text-cyan">funciona bien</span>
              <br />
              y <span className="text-amber">se ve mejor</span>.
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-text-dim mb-6 sm:mb-8 leading-relaxed">
              Soy Miguel García — desarrollador full stack especializado en{" "}
              <span className="text-text">TypeScript</span> y{" "}
              <span className="text-text">Next.js</span>, con raíces en el desarrollo de
              bots de Discord. Bilingüe español/inglés, con 3+ años creando
              herramientas que la gente realmente usa.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href="#contact">
                  Hablemos
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto">
                <a href="#projects">Ver proyectos</a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <TypedCode />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
