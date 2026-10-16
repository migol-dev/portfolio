import * as React from "react";
import { cn } from "@/lib/utils";

export type KbdProps = React.HTMLAttributes<HTMLElement>;

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono tracking-wider uppercase rounded-[4px] bg-white/[0.04] text-[var(--color-text-dim)] border border-[var(--color-border)] shadow-xs select-none",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
