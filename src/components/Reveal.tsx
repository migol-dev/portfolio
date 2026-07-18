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

  const viewportMargin = isMobile ? "-50px" : "-80px";
  const transitionDuration = shouldReduceMotion ? 0.01 : 0.5;
  const initialY = shouldReduceMotion ? 0 : 20;
  const animateY = shouldReduceMotion ? 0 : 0;

  return (
    <motion.div
      initial={{ opacity: shouldReduceMotion ? 1 : 0, y: initialY }}
      whileInView={{ opacity: 1, y: animateY }}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration: transitionDuration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionEyebrow({ path, label }: { path: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-xs text-text-faint">{path}</span>
      <span className="h-px flex-1 max-w-8 bg-border-strong" />
      <span className="font-mono text-xs uppercase tracking-widest text-cyan">{label}</span>
    </div>
  );
}
