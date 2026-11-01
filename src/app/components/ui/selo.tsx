import * as React from "react";
import { cn } from "./utils";

/**
 * Selo (tag do hero)
 *
 * Padrão da página Experience Intelligence do site do estúdio (`.selo`):
 * pílula com fundo de card, borda fina, texto em caixa alta pequena com espaçamento
 * largo e um ponto na cor primária. Serve para situar a pessoa no topo de uma página
 * ou seção (nome do produto, contexto, local), nunca para status ou contagem.
 */
type SeloProps = React.ComponentProps<"span"> & {
  /** Mostra o ponto na cor primária antes do texto (padrão). */
  dot?: boolean;
  /** Ícone opcional no lugar do ponto (16 px). */
  icon?: React.ReactNode;
  /** Tom do texto: neutro (grafite) ou primário. */
  tone?: "neutral" | "primary";
  /** Versão compacta para espaços menores. */
  size?: "md" | "sm";
};

function Selo({ className, dot = true, icon, tone = "neutral", size = "md", children, ...props }: SeloProps) {
  return (
    <span
      data-slot="selo"
      className={cn(
        "inline-flex w-fit items-center whitespace-nowrap rounded-full border border-border bg-card font-semibold uppercase",
        size === "md" ? "gap-2 px-3.5 py-1.5 text-[0.75rem] tracking-[0.14em]" : "gap-1.5 px-3 py-1 text-[0.6875rem] tracking-[0.12em]",
        tone === "primary" ? "text-primary" : "text-graphite-700 dark:text-graphite-300",
        className,
      )}
      {...props}
    >
      {icon ? (
        <span aria-hidden className="flex h-4 w-4 shrink-0 items-center justify-center text-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      ) : dot ? (
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-primary" />
      ) : null}
      {children}
    </span>
  );
}

export { Selo };
