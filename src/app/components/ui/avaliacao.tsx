import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "./utils";

/**
 * Avaliação: a nota de uma loja com a estrela e, ao lado, o número de avaliações entre parênteses ("★ 4,6 (128)").
 * Nota com uma casa decimal e vírgula; número de avaliações no formato pt-BR. Sem nota, mostra "Sem nota" em cinza
 * (nunca um zero). A estrela é decorativa; os leitores de tela ouvem "Nota 4,6 de 5, 128 avaliações" e, com `fonte`,
 * de onde veio a nota ("informada na ficha").
 * A estrela usa o âmbar de sinalização (--warning) só como desenho; o número fica em --foreground.
 */
export type AvaliacaoProps = {
  nota: number | null | undefined;
  total?: number | null;
  /** De onde veio a nota, só para leitores de tela ("informada na ficha", "do Google"). */
  fonte?: string;
  tamanho?: "sm" | "md";
  className?: string;
};

const fmtNota = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtTotal = new Intl.NumberFormat("pt-BR");

export function Avaliacao({ nota, total, fonte, tamanho = "sm", className }: AvaliacaoProps) {
  if (nota === null || nota === undefined) {
    return <span data-slot="avaliacao" className={cn("text-label text-muted-foreground", className)}>Sem nota</span>;
  }
  const n = fmtNota.format(nota);
  const leitura = `Nota ${n} de 5${total ? `, ${fmtTotal.format(total)} ${total === 1 ? "avaliação" : "avaliações"}` : ""}${fonte ? ` (${fonte})` : ""}`;
  return (
    <span data-slot="avaliacao" className={cn("inline-flex items-center gap-1 whitespace-nowrap text-foreground", tamanho === "sm" ? "text-body-sm" : "text-body", className)}>
      <Star aria-hidden className={cn("shrink-0 fill-[var(--warning)] text-warning-text", tamanho === "sm" ? "size-3.5" : "size-4")} />
      <span aria-hidden className="font-semibold tabular-nums">{n}</span>
      {total ? <span aria-hidden className="tabular-nums text-muted-foreground">({fmtTotal.format(total)})</span> : null}
      <span className="sr-only">{leitura}</span>
    </span>
  );
}
