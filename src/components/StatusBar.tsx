"use client";

import { useEffect, useState } from "react";
import { GitBranch, Wifi } from "lucide-react";

const SECTION_IDS = ["hero", "about", "skills", "projects", "experience", "contact"];

export function StatusBar() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState("hero");
  const [time, setTime] = useState<string>("");

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
        new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
      );
    update();
    const interval = setInterval(update, 30_000);
    return () => clearInterval(interval);
  }, []);

  const line = SECTION_IDS.indexOf(currentSection) + 1;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 hidden sm:flex items-center justify-between h-7 px-4 border-t border-border bg-panel/95 backdrop-blur-sm font-mono text-[11px] text-text-faint select-none"
      aria-hidden="true"
    >
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-green">
          <GitBranch className="h-3 w-3" /> main
        </span>
        <span className="hidden md:inline">
          Ln {line}, Sec &quot;{currentSection}&quot;
        </span>
        <span className="hidden lg:inline">UTF-8</span>
        <span className="hidden lg:inline">TypeScript</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden md:inline">scroll {progress}%</span>
        <span className="flex items-center gap-1.5">
          <Wifi className="h-3 w-3 text-cyan" /> {time}
        </span>
      </div>
    </div>
  );
}
