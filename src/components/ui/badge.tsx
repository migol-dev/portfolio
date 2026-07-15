import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium tracking-tight transition-colors",
  {
    variants: {
      variant: {
        default: "border-cyan/30 bg-cyan/10 text-cyan",
        amber: "border-amber/30 bg-amber/10 text-amber",
        green: "border-green/30 bg-green/10 text-green",
        magenta: "border-magenta/30 bg-magenta/10 text-magenta",
        outline: "border-border-strong text-text-dim",
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
