"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const viewportMargin = isMobile ? "-40px" : "-70px";
  const transitionDuration = shouldReduceMotion ? 0.01 : 0.45;
  const initialY = shouldReduceMotion ? 0 : 16;

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{
        duration: transitionDuration,
        delay,
        ease: [0.165, 0.84, 0.44, 1], // easeOutQuart
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({
  index,
  label,
  sublabel,
  path, // backwards-compatible if called with path
}: {
  index?: string;
  label: string;
  sublabel?: string;
  path?: string;
}) {
  const displayIndex = index || path || "0x00";

  return (
    <div className="flex items-center gap-2.5 mb-3 font-mono text-[11px] select-none">
      <span className="text-[var(--color-accent)] font-semibold">[{displayIndex} //</span>
      <span className="uppercase tracking-[0.08em] font-medium text-[var(--color-text)]">
        {label}
      </span>
      <span className="text-[var(--color-accent)] font-semibold">]</span>
      {sublabel && (
        <>
          <span className="text-[var(--color-text-faint)]">·</span>
          <span className="text-[var(--color-text-faint)] hidden sm:inline">{sublabel}</span>
        </>
      )}
      <span className="h-px flex-1 max-w-16 bg-[var(--color-border-strong)] ml-2" />
    </div>
  );
}
