"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

/**
 * ChipFiltravel e GrupoDeChipsFiltraveis (filtros em pílulas)
 *
 * Filtros rápidos acima de uma lista (status, assunto, tipo), uma ou várias opções ao mesmo tempo. Era o padrão
 * "Chips (filtráveis)" de Rótulos e o assunto do contato da landing, só em demonstração.
 *
 * - Desligado: card com borda neutra; hover cinza (--accent), nunca rosa.
 * - Ligado: rosa de selecionado (--primary-suave) com borda e texto na primária (--primary-text 5,5:1) e o check na
 *   frente; com o mouse em cima continua rosa. O check e aria-pressed dizem o estado, nunca só a cor.
 * - 44 px de altura no celular, 36 px no computador; quebram de linha (nunca rolam para o lado), alinhados à borda
 *   esquerda do conteúdo.
 * GrupoDeChipsFiltraveis: escolha única (`multiplo={false}`) ou várias (padrão); controlado por `valor`/`onValorChange`.
 */

type ChipFiltravelProps = Omit<React.ComponentProps<"button">, "onChange"> & {
  ativo: boolean;
  onAtivoChange?: (ativo: boolean) => void;
  /** Quantidade opcional depois do texto ("Novas 3"). */
  contagem?: number;
};

function ChipFiltravel({ ativo, onAtivoChange, contagem, className, children, onClick, ...props }: ChipFiltravelProps) {
  return (
    <button
      type="button"
      data-slot="chip-filtravel"
      aria-pressed={ativo}
      onClick={e => { onClick?.(e); onAtivoChange?.(!ativo); }}
      className={cn(
        "inline-flex min-h-9 toque:min-h-11 items-center gap-2 rounded-full border px-4 text-body-sm font-medium transition-colors duration-[var(--duration-fast)] sm:px-3",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        ativo
          ? "border-primary/40 bg-primary-suave text-primary-text"
          : "border-border bg-card text-foreground hover:border-[var(--border-strong)] hover:bg-accent",
        className,
      )}
      {...props}
    >
      {ativo && <Check aria-hidden className="size-4 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-[var(--duration-fast)]" />}
      {children}
      {contagem !== undefined && (
        <span className={cn("rounded-full px-2 text-label font-semibold tabular-nums", ativo ? "bg-card text-primary-text" : "bg-muted text-muted-foreground")}>{contagem}</span>
      )}
    </button>
  );
}

type OpcaoDoChip = { valor: string; rotulo: React.ReactNode; contagem?: number; desabilitado?: boolean };

type GrupoDeChipsFiltraveisProps = {
  opcoes: OpcaoDoChip[];
  valor: string[];
  onValorChange: (valor: string[]) => void;
  /** Várias ao mesmo tempo (padrão) ou só uma. */
  multiplo?: boolean;
  /** Nome do grupo para leitores de tela ("Filtrar por status"). */
  rotulo: string;
  className?: string;
};

function GrupoDeChipsFiltraveis({ opcoes, valor, onValorChange, multiplo = true, rotulo, className }: GrupoDeChipsFiltraveisProps) {
  return (
    <div role="group" aria-label={rotulo} data-slot="grupo-de-chips-filtraveis" className={cn("flex flex-wrap items-center gap-2", className)}>
      {opcoes.map(o => {
        const ativo = valor.includes(o.valor);
        return (
          <ChipFiltravel
            key={o.valor}
            ativo={ativo}
            contagem={o.contagem}
            disabled={o.desabilitado}
            onAtivoChange={liga => onValorChange(multiplo ? (liga ? [...valor, o.valor] : valor.filter(v => v !== o.valor)) : liga ? [o.valor] : [])}
          >
            {o.rotulo}
          </ChipFiltravel>
        );
      })}
    </div>
  );
}

export { ChipFiltravel, GrupoDeChipsFiltraveis };
export type { ChipFiltravelProps, GrupoDeChipsFiltraveisProps, OpcaoDoChip };
