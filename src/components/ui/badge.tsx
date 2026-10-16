import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[4px] border px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-[0.08em] select-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent-bright)]",
        accent:
          "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent-bright)]",
        telemetry:
          "border-[var(--color-telemetry)]/30 bg-[var(--color-telemetry)]/10 text-[var(--color-telemetry)]",
        live:
          "border-[var(--color-status-live)]/30 bg-[var(--color-status-live)]/10 text-[var(--color-status-live)]",
        green:
          "border-[var(--color-status-live)]/30 bg-[var(--color-status-live)]/10 text-[var(--color-status-live)]",
        amber:
          "border-[var(--color-telemetry)]/30 bg-[var(--color-telemetry)]/10 text-[var(--color-telemetry)]",
        outline:
          "border-[var(--color-border-strong)] bg-white/[0.02] text-[var(--color-text-dim)]",
        faint:
          "border-transparent bg-white/[0.03] text-[var(--color-text-faint)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
