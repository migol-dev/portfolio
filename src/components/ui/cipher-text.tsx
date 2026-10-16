"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const HEX_CHARS = "0123456789ABCDEF";

interface CipherTextProps {
  text: string;
  className?: string;
  speed?: number; // ms per tick
  duration?: number; // total duration in ms
  scrambleOnHover?: boolean;
}

export function CipherText({
  text,
  className = "",
  speed = 28,
  duration = 320,
  scrambleOnHover = false,
}: CipherTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const isScramblingRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = useCallback(() => {
    if (shouldReduceMotion || isScramblingRef.current) {
      setDisplayText(text);
      return;
    }

    isScramblingRef.current = true;
    const startTime = Date.now();
    const length = text.length;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const revealedCount = Math.floor(progress * length);

      let result = "";
      for (let i = 0; i < length; i++) {
        const char = text[i];
        if (char === " " || char === "\n" || char === "/" || char === "[" || char === "]") {
          result += char;
        } else if (i < revealedCount) {
          result += char;
        } else {
          result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
        }
      }

      setDisplayText(result);

      if (progress >= 1) {
        if (timerRef.current) clearInterval(timerRef.current);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
    }, speed);
  }, [text, duration, speed, shouldReduceMotion]);

  useEffect(() => {
    startScramble();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startScramble]);

  const handleMouseEnter = () => {
    if (scrambleOnHover) {
      startScramble();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      className={`font-mono tnum inline-block ${className}`}
    >
      {displayText}
    </span>
  );
}
