"use client";

import React, { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function ArchitecturalBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [bootFinished, setBootFinished] = useState(false);

  useEffect(() => {
    // 600ms quick integrated system boot sequence
    const timer = setTimeout(() => {
      setBootFinished(true);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Laser Boot Sweep Line along the top window edge */}
      {!shouldReduceMotion && !bootFinished && (
        <div
          className="fixed top-0 left-0 right-0 h-[1.5px] z-50 pointer-events-none bg-gradient-to-r from-transparent via-[var(--color-accent-bright)] to-[var(--color-telemetry)]"
          style={{
            animation: "laser-sweep 0.65s cubic-bezier(0.165, 0.84, 0.44, 1) forwards",
          }}
        />
      )}

      {/* Structural Vertical Rails aligned to max-w-7xl */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full relative">
          {/* Left Vertical Rail (Visible from tablet up) */}
          <div className="hidden md:block absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60">
            {!shouldReduceMotion && (
              <div
                className="w-full h-24 bg-gradient-to-b from-transparent via-[var(--color-accent)] to-transparent opacity-80"
                style={{
                  animation: "pulse-rail 9s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {/* Right Vertical Rail (Visible from tablet up) */}
          <div className="hidden md:block absolute right-4 sm:right-6 top-0 bottom-0 w-px bg-[var(--color-border)] opacity-60">
            {!shouldReduceMotion && (
              <div
                className="w-full h-24 bg-gradient-to-b from-transparent via-[var(--color-telemetry)] to-transparent opacity-80"
                style={{
                  animation: "pulse-rail 9s ease-in-out infinite 4.5s",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
