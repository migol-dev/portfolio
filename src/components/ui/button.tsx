"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[6px] text-xs font-mono uppercase tracking-[0.06em] font-medium transition-all duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:transition-transform group-hover:[&_svg]:translate-x-0.5 cursor-pointer select-none overflow-hidden spotlight-box",
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
        lg: "min-h-[48px] sm:min-h-[44px] px-4 sm:px-6 text-xs sm:text-sm",
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
  magnetic?: boolean;
  shimmer?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      magnetic = true,
      shimmer = true,
      children,
      style,
      onMouseMove,
      onMouseLeave,
      ...props
    },
    ref
  ) => {
    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseMove?.(e);
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      target.style.setProperty("--mouse-x", `${x}px`);
      target.style.setProperty("--mouse-y", `${y}px`);

      if (magnetic && typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
        const pullX = Math.max(-3, Math.min(3, (x - rect.width / 2) * 0.12));
        const pullY = Math.max(-3, Math.min(3, (y - rect.height / 2) * 0.12));
        target.style.setProperty("--btn-tx", `${pullX.toFixed(2)}px`);
        target.style.setProperty("--btn-ty", `${pullY.toFixed(2)}px`);
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseLeave?.(e);
      const target = e.currentTarget;
      target.style.setProperty("--mouse-x", "-999px");
      target.style.setProperty("--mouse-y", "-999px");
      if (magnetic) {
        target.style.setProperty("--btn-tx", "0px");
        target.style.setProperty("--btn-ty", "0px");
      }
    };

    const combinedStyle: React.CSSProperties = {
      translate: "var(--btn-tx, 0px) var(--btn-ty, 0px)",
      ...style,
    };

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          style={combinedStyle}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const showShimmer =
      shimmer &&
      (variant === "default" || variant === "primary" || !variant);

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={combinedStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
        {showShimmer && (
          <span
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
          />
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
