import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-32 w-full rounded-[6px] border border-[var(--color-border)] bg-[var(--color-panel-2)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] leading-relaxed",
        "transition-colors duration-150 focus-visible:outline-hidden focus-visible:border-[var(--color-accent)] focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]/30 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
