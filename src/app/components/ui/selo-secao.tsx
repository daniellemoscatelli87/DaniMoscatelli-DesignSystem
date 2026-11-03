import * as React from "react";
import { cn } from "./utils";

/**
 * SeloSecao (selo de seção)
 *
 * Padrão das seções da página Experience Intelligence 2 do site do estúdio ("Cenário Atual", "O Desafio",
 * "Método"…): pílula preenchida com o tom claro da primária, borda fina na primária, texto na cor primária
 * de texto, em caixa alta com espaçamento largo (0,2em), sem ponto. Fica centralizada acima do título da seção.
 * Diferença para o Selo (tag do hero): o do hero é neutro, com fundo de card e ponto; este é colorido e
 * marca o assunto de cada seção.
 */
type SeloSecaoProps = React.ComponentProps<"span"> & {
  /** Ícone opcional antes do texto (14 px). */
  icon?: React.ReactNode;
  size?: "md" | "sm";
};

function SeloSecao({ className, icon, size = "md", children, ...props }: SeloSecaoProps) {
  return (
    <span
      data-slot="selo-secao"
      className={cn(
        "inline-flex w-fit select-none items-center whitespace-nowrap rounded-full border font-bold uppercase tracking-[0.2em] shadow-[var(--shadow-xs)]",
        "border-primary/25 bg-[var(--primary-muted)] text-[var(--primary-text,var(--primary))] dark:border-primary/30",
        size === "md" ? "gap-2 px-4 py-1.5 text-[0.75rem]" : "gap-1.5 px-3 py-1 text-[0.6875rem]",
        className,
      )}
      {...props}
    >
      {icon && <span aria-hidden className="flex h-3.5 w-3.5 shrink-0 items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
      {children}
    </span>
  );
}

export { SeloSecao };
