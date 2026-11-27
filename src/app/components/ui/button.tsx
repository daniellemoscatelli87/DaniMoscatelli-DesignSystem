import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

// Padrão único (decisão de 16/11/2026): botão de 40 px, cantos 12 px; mesma altura do campo de texto.
// Texto no token do botão (14 px, seminegrito; escala tipográfica de 27/11/2026). No toque (celular ou tela de dedo),
// todo botão tem 44 px de altura (decisão de 27/11/2026); no computador com mouse, 40 px (sm: 32 px).

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-button font-semibold transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground disabled:hover:bg-disabled disabled:hover:text-disabled-foreground dark:disabled:bg-disabled dark:disabled:hover:bg-disabled dark:disabled:border-transparent [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-[var(--border-strong)] bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // O botão secundário do DS é o de contorno (decisão da dona do produto, 20/11/2026)
        secondary:
          "border border-[var(--border-strong)] bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:bg-transparent disabled:hover:bg-transparent dark:disabled:bg-transparent",
        link: "text-primary-text underline-offset-4 hover:underline disabled:bg-transparent disabled:hover:bg-transparent disabled:no-underline",
      },
      size: {
        default: "h-10 px-4 has-[>svg]:px-3 toque:h-11",
        sm: "h-8 rounded-sm gap-1 px-3 text-button has-[>svg]:px-2 toque:h-11",
        lg: "h-11 rounded-md px-5 text-body has-[>svg]:px-4",
        icon: "size-10 rounded-md toque:size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
