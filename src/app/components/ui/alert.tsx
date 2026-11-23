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
 */
const alertVariants = cva(
  [
    "[--alerta-tinta:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-fundo),transparent)]",
    "relative w-full rounded-lg border border-[color:color-mix(in_oklab,var(--alerta-cor)_22%,transparent)] bg-card bg-[image:linear-gradient(var(--alerta-tinta),var(--alerta-tinta))] px-[22px] py-5 text-left text-sm text-foreground",
    "grid grid-cols-[0_1fr] items-start has-[>svg]:grid-cols-[2.75rem_1fr] has-[>svg]:gap-x-[18px]",
    "[&>svg]:row-span-2 [&>svg]:box-border [&>svg]:size-11 [&>svg]:shrink-0 [&>svg]:rounded-md [&>svg]:p-3 [&>svg]:bg-[color:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-base),var(--card))] [&>svg]:text-[color:var(--alerta-icone)]",
  ],
  {
    variants: {
      variant: {
        // Neutro: borda e fundo do card, base cinza com ícone cinza (padrão da base do ícone neutra)
        default:
          "border-border bg-none text-card-foreground [&>svg]:bg-muted [&>svg]:text-muted-foreground",
        destructive:
          "[--alerta-cor:var(--error)] [--alerta-icone:var(--primary-text)] [--alerta-fundo:7%] [--alerta-base:18%]",
        success: "[--alerta-cor:var(--success)] [--alerta-icone:var(--success)] [--alerta-fundo:7%] [--alerta-base:18%]",
        info: "[--alerta-cor:var(--info)] [--alerta-icone:var(--info)] [--alerta-fundo:7%] [--alerta-base:18%]",
        warning: "[--alerta-cor:var(--warning)] [--alerta-icone:var(--warning-text)] [--alerta-fundo:9%] [--alerta-base:30%]",
        error: "[--alerta-cor:var(--error)] [--alerta-icone:var(--primary-text)] [--alerta-fundo:7%] [--alerta-base:18%]",
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
        "col-start-2 pt-[3px] text-[0.9375rem] font-bold leading-[1.35] text-foreground",
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
        "col-start-2 mt-1 grid justify-items-start gap-1.5 text-sm leading-[1.6] text-muted-foreground [&_p]:leading-[1.6] [&_strong]:font-semibold [&_strong]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
