import * as React from "react";
import { cn } from "./utils";

/**
 * Chip de estado: o estado de um item (mensagem, candidatura, pedido) sempre em texto, com ícone opcional e o fundo do
 * tom. Regra: estado nunca só por cor ou forma; o texto é obrigatório. Vai na coluna do fim de uma LinhaDeLista (tags e
 * ações), que no celular desce para uma linha própria embaixo do texto.
 * Tons (texto escuro do tom sobre a tinta do tom, todos com 4,5:1 ou mais sobre o card):
 * marca (rosa com texto --primary-text: pede ação, novo), neutro (cinza com --foreground: resolvido, registro),
 * sucesso, info, aviso e erro (tinta -muted do tom com o texto -text do tom). Use poucos tons por lista e o mesmo tom
 * para o mesmo sentido em toda a tela.
 * aoVivo (decisão da dona do produto, 28/11/2026: "Onde 'no ar' aparecer ele tem que vir no formato de tag com a bolinha
 * piscando"): uma bolinha na cor do tom antes do texto, com um halo que pulsa (parado com "menos movimento"). A bolinha
 * é decorativa (aria-hidden); o texto ("No ar", "Ao vivo") carrega o sentido. Use com tom="sucesso" para "No ar"; o
 * estado oposto ("Fora do ar") é o chip neutro, sem bolinha.
 */

type TomDoChip = "marca" | "neutro" | "sucesso" | "info" | "aviso" | "erro";

const TONS: Record<TomDoChip, string> = {
  marca: "border-primary/25 bg-[var(--primary-muted)] text-primary-text",
  neutro: "border-border bg-muted text-foreground",
  sucesso: "border-success/30 bg-success-muted text-success-text",
  info: "border-info/30 bg-info-muted text-info-text",
  aviso: "border-warning/40 bg-warning-muted text-warning-text",
  erro: "border-error/30 bg-error-muted text-error-text",
};

/** Cor da bolinha do aoVivo: o tom cheio do chip. */
const PONTOS: Record<TomDoChip, string> = {
  marca: "bg-primary",
  neutro: "bg-muted-foreground",
  sucesso: "bg-success",
  info: "bg-info",
  aviso: "bg-warning",
  erro: "bg-error",
};

type ChipDeEstadoProps = Omit<React.ComponentProps<"span">, "children"> & {
  tom?: TomDoChip;
  /** Ícone lucide opcional (14 px). Dispense quando a linha já mostra o mesmo ícone no início. */
  icone?: React.ReactNode;
  /** Tamanho: "sm" (24 px de altura, padrão em listas) ou "md" (28 px). */
  tamanho?: "sm" | "md";
  /** Estado ao vivo ("No ar"): bolinha do tom com halo pulsando antes do texto; parada com "menos movimento". */
  aoVivo?: boolean;
  children: React.ReactNode;
};

function ChipDeEstado({ tom = "neutro", icone, tamanho = "sm", aoVivo = false, className, children, ...props }: ChipDeEstadoProps) {
  return (
    <span
      data-slot="chip-de-estado"
      data-tom={tom}
      data-ao-vivo={aoVivo ? "" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full border font-semibold leading-none [&>svg]:shrink-0",
        tamanho === "sm" ? "h-6 gap-1 px-2 text-xs [&>svg]:size-3.5" : "h-7 gap-1 px-3 text-body-sm [&>svg]:size-4",
        TONS[tom],
        className,
      )}
      {...props}
    >
      {aoVivo && (
        <span aria-hidden data-slot="chip-de-estado-ponto" className="relative inline-flex size-2 shrink-0">
          <span className={cn("absolute inset-0 rounded-full opacity-75 motion-safe:animate-ping motion-reduce:hidden", PONTOS[tom])} />
          <span className={cn("relative inline-flex size-2 rounded-full", PONTOS[tom])} />
        </span>
      )}
      {icone && <span aria-hidden className="inline-flex [&>svg]:size-3.5">{icone}</span>}
      {children}
    </span>
  );
}

export { ChipDeEstado };
export type { TomDoChip, ChipDeEstadoProps };
