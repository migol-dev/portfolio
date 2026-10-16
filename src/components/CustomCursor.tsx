"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

function subscribeFinePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getFinePointerSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getFinePointerServerSnapshot(): boolean {
  return false;
}

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const isFinePointer = useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );

  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [hoverTag, setHoverTag] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Position motion values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trailing spring for the outer ring
  const ringX = useSpring(mouseX, { stiffness: 320, damping: 28 });
  const ringY = useSpring(mouseY, { stiffness: 320, damping: 28 });

  useEffect(() => {
    if (shouldReduceMotion || !isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Check target element for interactive states
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveEl = target.closest(
          "button, a, input, textarea, select, [role='button'], [data-cursor]"
        ) as HTMLElement | null;

        if (interactiveEl) {
          setIsHoveringInteractive(true);
          const customTag = interactiveEl.getAttribute("data-cursor");
          setHoverTag(customTag);
        } else {
          setIsHoveringInteractive(false);
          setHoverTag(null);
        }
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY, shouldReduceMotion, isFinePointer]);

  if (!isFinePointer || shouldReduceMotion) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Precision center dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        className="w-1 h-1 rounded-full bg-[var(--color-accent-bright)] shadow-[0_0_6px_var(--color-accent)]"
      />

      {/* Subtle outer technical reticle with smooth spring lag */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHoveringInteractive ? 34 : 22,
          height: isHoveringInteractive ? 34 : 22,
          borderColor: isHoveringInteractive
            ? "var(--color-accent)"
            : "rgba(255, 255, 255, 0.22)",
        }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="rounded-full border border-dashed flex items-center justify-center backdrop-blur-[0.5px]"
      >
        {/* Subtle crosshair cardinal ticks when hovering interactive elements */}
        {isHoveringInteractive && !hoverTag && (
          <span className="text-[8px] font-mono text-[var(--color-accent)] opacity-70 select-none">
            +
          </span>
        )}

        {/* Micro-label tag if specified (e.g. 3D, COPY) */}
        {hoverTag && (
          <span className="absolute -bottom-4 text-[8px] font-mono uppercase tracking-wider text-[var(--color-accent-bright)] bg-black/80 px-1 py-0.2 rounded border border-[var(--color-border)] select-none">
            {hoverTag}
          </span>
        )}
      </motion.div>
    </div>
  );
}
