import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

/**
 * Alerta (padrão de todos os alertas, decisão da dona do produto de 23/11/2026)
 *
 * Mesma aparência do Alerta com ação (ui/alerta-com-acao): cantos de 16 px, respiro de 20 × 22 px, borda na cor do
 * estado a 22%, fundo do card com a cor do estado a 7% (9% no aviso), o svg filho vira o ícone com base
 * (caixa de 44 px, cantos --radius-md, base na cor do estado a 18% ou 30% no aviso, ícone de 20 px na cor de ícone
 * do estado), título de 15 px em negrito e o resto em 14 px. A API não muda: <Alert> com um svg, <AlertTitle> e
 * <AlertDescription>. Para pedir uma ação de quem lê, use o AlertaComAcao.
 * role: "alert" para aviso, erro e destructive; "status" para os demais (dá para trocar pela prop role).
 *
 * Alerta só com descrição (sem AlertTitle, 27/11/2026): a frase é a informação principal, então fica na cor do texto
 * principal (--foreground), ocupa as duas linhas da grade e fica centralizada na altura do ícone, com quebra de linha
 * equilibrada (text-pretty). É automático: basta não usar o AlertTitle.
 * Texto de apoio sobre os fundos coloridos (info, sucesso, aviso, erro): --muted-foreground com 15% de --foreground,
 * para passar de 4,5:1 também no fundo rosado do erro (27/11/2026). No alerta neutro continua --muted-foreground.
 */
const alertVariants = cva(
  [
    "[--alerta-tinta:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-fundo),transparent)]",
    "[--alerta-texto-apoio:color-mix(in_oklab,var(--muted-foreground)_85%,var(--foreground))]",
    "relative w-full rounded-lg border border-[color:color-mix(in_oklab,var(--alerta-cor)_22%,transparent)] bg-card bg-[image:linear-gradient(var(--alerta-tinta),var(--alerta-tinta))] px-6 py-5 text-left text-sm text-foreground",
    "grid grid-cols-[0_1fr] items-start has-[>svg]:grid-cols-[2.75rem_1fr] has-[>svg]:gap-x-4",
    "[&>svg]:row-span-2 [&>svg]:box-border [&>svg]:size-11 [&>svg]:shrink-0 [&>svg]:rounded-md [&>svg]:p-3 [&>svg]:bg-[color:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-base),var(--card))] [&>svg]:text-[color:var(--alerta-icone)]",
  ],
  {
    variants: {
      variant: {
        // Neutro: borda e fundo do card, base cinza com ícone cinza (padrão da base do ícone neutra)
        default:
          "border-border bg-none text-card-foreground [--alerta-texto-apoio:var(--muted-foreground)] [&>svg]:bg-muted [&>svg]:text-muted-foreground",
        destructive:
          "[--alerta-cor:var(--error)] [--alerta-icone:var(--error-text)] [--alerta-fundo:7%] [--alerta-base:18%]",
        success: "[--alerta-cor:var(--success)] [--alerta-icone:var(--success)] [--alerta-fundo:7%] [--alerta-base:18%]",
        info: "[--alerta-cor:var(--info)] [--alerta-icone:var(--info)] [--alerta-fundo:7%] [--alerta-base:18%]",
        warning: "[--alerta-cor:var(--warning)] [--alerta-icone:var(--warning-text)] [--alerta-fundo:9%] [--alerta-base:30%]",
        error: "[--alerta-cor:var(--error)] [--alerta-icone:var(--error-text)] [--alerta-fundo:7%] [--alerta-base:18%]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const urgente = variant === "warning" || variant === "error" || variant === "destructive";
  return (
    <div
      data-slot="alert"
      data-variant={variant ?? "default"}
      role={urgente ? "alert" : "status"}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 pt-1 text-body font-bold leading-[1.35] text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 mt-1 grid justify-items-start gap-1 text-sm leading-[1.6] text-[color:var(--alerta-texto-apoio,var(--muted-foreground))] [&_p]:leading-[1.6] [&_strong]:font-semibold [&_strong]:text-foreground",
        // Sem AlertTitle: a descrição é a mensagem principal (cor do texto principal, centralizada na altura do ícone).
        "[[data-slot=alert]:not(:has(>[data-slot=alert-title]))>&]:row-span-2 [[data-slot=alert]:not(:has(>[data-slot=alert-title]))>&]:mt-0 [[data-slot=alert]:not(:has(>[data-slot=alert-title]))>&]:self-center [[data-slot=alert]:not(:has(>[data-slot=alert-title]))>&]:text-foreground [[data-slot=alert]:not(:has(>[data-slot=alert-title]))>&]:text-pretty",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
