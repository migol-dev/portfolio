"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const SECTION_IDS = ["hero", "about", "skills", "projects", "experience", "contact"];

export function StatusBar() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("hero");
  const [time, setTime] = useState<string>("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrentSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "America/Mexico_City",
        })
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCognitiveClick = () => {
    const target = document.getElementById("cognitive") || document.getElementById("about");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      target.classList.add("ring-2", "ring-[var(--color-accent)]");
      setTimeout(() => {
        target.classList.remove("ring-2", "ring-[var(--color-accent)]");
      }, 1500);
    }
  };

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-between h-7 px-3 sm:px-4 border-t border-[var(--color-border)] bg-[var(--color-panel)]/95 backdrop-blur-md font-mono text-[10px] text-[var(--color-text-faint)] select-none"
      aria-label="Barra de estado del sistema"
    >
      {/* Left Telemetry Items */}
      <div className="flex items-center gap-3 truncate">
        {/* Compiler & Engine Pill */}
        <span className="flex items-center gap-1.5 text-[var(--color-text-dim)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-status-live)]" />
          <span>g++20 / TS 5.x</span>
        </span>

        {/* Cognitive Profile Badge */}
        <button
          type="button"
          onClick={handleCognitiveClick}
          className="hidden sm:flex items-center gap-1 text-[var(--color-text-dim)] hover:text-[var(--color-accent-bright)] transition-colors cursor-pointer group"
          title="Ver topología cognitiva (INFP · SO/SX · 9w1 · 946)"
        >
          <Sparkles className="w-3 h-3 text-[var(--color-accent)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          <span>COG: INFP · SO/SX · 9w1 · 946</span>
        </button>

        <span className="hidden md:inline text-[var(--color-text-faint)]">
          {`// SEC: "${currentSection}"`}
        </span>
      </div>

      {/* Right Telemetry Items */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={toggleTheme}
          className="hidden sm:inline hover:text-[var(--color-text)] transition-colors uppercase cursor-pointer"
        >
          THEME: {theme}
        </button>

        <span className="tnum hidden xs:inline">
          {progress}% SCROLL
        </span>

        <span className="text-[var(--color-text)] tnum">
          {time || "00:00:00"} <span className="text-[var(--color-text-faint)] hidden sm:inline">UTC-6</span>
        </span>
      </div>
    </div>
  );
}
