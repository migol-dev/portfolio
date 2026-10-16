import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-xs font-mono uppercase tracking-[0.06em] font-medium transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-bright)] shadow-xs",
        primary:
          "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-bright)] shadow-xs",
        secondary:
          "bg-transparent text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-white/[0.02]",
        ghost:
          "bg-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text)] hover:bg-white/[0.04]",
        destructive:
          "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/30 hover:bg-[var(--color-danger)]/20",
        outline:
          "border border-[var(--color-border)] bg-[var(--color-panel-2)] text-[var(--color-text)] hover:bg-[var(--color-panel-hover)]",
        link:
          "text-[var(--color-accent)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "min-h-[44px] sm:min-h-[38px] px-4 py-2",
        sm: "min-h-[36px] sm:min-h-[32px] px-3 text-[11px]",
        lg: "min-h-[48px] sm:min-h-[44px] px-6 text-sm",
        icon: "h-10 w-10 min-h-[40px] p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
