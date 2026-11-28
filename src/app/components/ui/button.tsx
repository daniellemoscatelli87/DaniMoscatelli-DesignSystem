import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

// Padrão único (decisão de 16/11/2026): botão de 40 px, cantos 12 px; mesma altura do campo de texto.
// Texto no token do botão (14 px, seminegrito; escala tipográfica de 27/11/2026). No toque (celular ou tela de dedo),
// todo botão tem 44 px de altura (decisão de 27/11/2026); no computador com mouse, 40 px (sm: 32 px).

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-button font-semibold transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground disabled:hover:bg-disabled disabled:hover:text-disabled-foreground dark:disabled:bg-disabled dark:disabled:hover:bg-disabled dark:disabled:border-transparent [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input-fundo/30 dark:border-input dark:hover:bg-input-fundo/50",
        // O botão secundário do DS é o de contorno (decisão da dona do produto, 20/11/2026)
        secondary:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input-fundo/30 dark:border-input dark:hover:bg-input-fundo/50",
        // Exclusão em contorno (27/11/2026, especificação da área restrita, ADMIN_REACT.md §7.1): ação destrutiva que não
        // é a principal da área ("Excluir", "Apagar tudo"); o vermelho cheio (destructive) fica só na confirmação.
        // Contorno e texto --error-text (5,5:1 no branco), hover --error-muted, foco com anel de erro.
        "exclusao-contorno":
          "border border-[var(--error-text)] bg-background text-error-text hover:bg-error-muted focus-visible:ring-[var(--error)] dark:bg-input-fundo/30",
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
      // Quebra do texto (28/11/2026): no celular (abaixo de 640 px), um texto que não cabe na largura quebra em mais de
      // uma linha, centralizado, e o botão cresce para baixo (mínimo de 44 px, 8 px de respiro em cima e embaixo), em vez
      // de passar da borda da tela. Com um texto curto nada muda: continua uma linha só, com 44 px. Do tablet em diante,
      // uma linha só, como sempre. "nunca": uma linha em qualquer tela (para botões numa barra que rola para o lado).
      // Botão com altura própria no className (h-12, size-9) fica em "nunca", a menos que quebra venha explícita.
      // "sempre": pode quebrar em qualquer tela.
      quebra: {
        celular: "whitespace-nowrap max-sm:whitespace-normal max-sm:text-center max-sm:max-w-full",
        nunca: "whitespace-nowrap",
        sempre: "whitespace-normal text-center max-w-full",
      },
    },
    // Quando o texto pode quebrar, a altura passa a ser mínima (a mesma de sempre) e o botão cresce com as linhas.
    compoundVariants: [
      { quebra: "celular", size: ["default", "sm", "lg"], class: "max-sm:h-auto max-sm:min-h-11 max-sm:py-2 toque:h-auto toque:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "default", class: "h-auto min-h-10 py-2 toque:h-auto toque:min-h-11 max-sm:h-auto max-sm:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "sm", class: "h-auto min-h-8 py-1.5 toque:h-auto toque:min-h-11 max-sm:h-auto max-sm:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "lg", class: "h-auto min-h-11 py-2" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      forma: "padrao",
      // Padrão "nunca" para quem usa buttonVariants() direto (dia do calendário, paginação, ações do AlertDialog): o
      // desenho deles não muda. O componente Button liga a quebra do celular sozinho (veja quebraEfetiva).
      quebra: "nunca",
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
  { className, variant, size, forma, quebra, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  // Quem dá uma altura própria ao botão (h-12, size-9…) fica com uma linha só, como antes (28/11/2026): a quebra
  // automática do celular trocaria essa altura pela mínima. Com quebra explícita, vale o que foi pedido.
  const alturaPropria = /(^|\s)(h|size|min-h)-/.test(className ?? "");
  const quebraEfetiva = quebra ?? (alturaPropria ? "nunca" : "celular");

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, forma, quebra: quebraEfetiva, className }))}
      {...props}
    />
  );
});

export { Button, buttonVariants };
