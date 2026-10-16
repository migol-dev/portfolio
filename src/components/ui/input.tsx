import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3.5 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)]",
          "transition-colors duration-150 focus-visible:outline-hidden focus-visible:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
