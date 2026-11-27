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
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // O botão secundário do DS é o de contorno (decisão da dona do produto, 20/11/2026)
        secondary:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        // Exclusão em contorno (27/11/2026, especificação da área restrita, ADMIN_REACT.md §7.1): ação destrutiva que não
        // é a principal da área ("Excluir", "Apagar tudo"); o vermelho cheio (destructive) fica só na confirmação.
        // Contorno e texto --error-text (5,5:1 no branco), hover --error-muted, foco com anel de erro.
        "exclusao-contorno":
          "border border-[var(--error-text)] bg-background text-error-text hover:bg-error-muted focus-visible:ring-[var(--error)] dark:bg-input/30",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:bg-transparent disabled:hover:bg-transparent dark:disabled:bg-transparent",
        link: "text-primary-text underline-offset-4 hover:underline disabled:bg-transparent disabled:hover:bg-transparent disabled:no-underline",
      },
      // 44 px no toque com as variantes do próprio Tailwind (max-sm e pointer-coarse), além da variante toque do DS:
      // assim o botão tem 44 px no celular mesmo num produto que copiou ui/ e theme.css mas não carrega o theme.css no
      // mesmo CSS do @import "tailwindcss" (27/11/2026). Medido: 44 px a 390 px de tela (com e sem dedo) e 40 px no
      // computador com mouse.
      size: {
        default: "h-10 px-4 has-[>svg]:px-3 toque:h-11 max-sm:h-11 pointer-coarse:h-11",
        sm: "h-8 rounded-sm gap-1 px-3 text-button has-[>svg]:px-2 toque:h-11 max-sm:h-11 pointer-coarse:h-11",
        lg: "h-11 rounded-md px-5 text-body has-[>svg]:px-4",
        // Ícone: 40 px no computador, 44 px no toque. icon-lg: 44 px sempre (botões de ícone soltos, como o menu).
        icon: "size-10 rounded-md toque:size-11 max-sm:size-11 pointer-coarse:size-11",
        "icon-lg": "size-11 rounded-md",
      },
      // Forma (27/11/2026): "pilula" deixa o botão todo arredondado (pílula). Usada no cabeçalho do site por decisão
      // de marca (FindLook: "Sou Lojista" em contorno e "Entrar" em vermelho; Dani Moscatelli: o modelo pílula).
      forma: {
        padrao: "",
        pilula: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      forma: "padrao",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

// forwardRef (27/11/2026): com React 18, sem ele a ref do Radix (asChild em PopoverTrigger, TooltipTrigger,
// DropdownMenuTrigger…) se perdia no Button e o Popover ficava fora da tela (translate(0, -200%)), por exemplo o
// seletor de data dentro de uma janela.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, forma, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, forma, className }))}
      {...props}
    />
  );
});

export { Button, buttonVariants };
