"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "./utils";

/**
 * Seletor de etapa (28/11/2026, igual nos dois DS): mostra em que etapa um processo está (Cadastro → Treinamento →
 * Ativa) e deixa mudar para outra com um toque. Veio da ficha da loja parceira no FindLook.
 * Por que não os que já existiam: o Stepper é o progresso de um assistente (as etapas futuras não abrem e não têm
 * explicação); o SegmentedControl troca uma vista, sem ordem nem etapas já passadas. Aqui cada etapa tem nome,
 * explicação e a ação "Mover para cá", e a mudança é salva (estado salvando e o check de sucesso).
 * Cada etapa é um botão, um embaixo do outro (lista ordenada):
 * - atual: rosa de selecionado (--primary-suave, borda primária a 40 %), círculo na primária com o ícone, "Etapa
 *   atual" e aria-current="step"; continua focável (aria-disabled), para o leitor de tela encontrá-la;
 * - já passou: círculo verde claro (--success-muted) com o check;
 * - ainda não chegou: círculo cinza (--muted) com o ícone da etapa;
 * - hover cinza (--muted, borda --border-strong), nunca rosa; a atual continua rosa com o mouse em cima.
 * Salvando: a etapa escolhida mostra o carregando e "Salvando…", e as outras ficam travadas; depois, `feita` mostra o
 * check de sucesso por um momento (quem usa limpa a prop, como o produto faz com 1,6 s).
 * No celular (seletor com menos de 28 rem), "Mover para cá" desce para baixo do texto, na mesma borda; no toque, cada
 * etapa tem pelo menos 44 px de altura. Com "menos movimento", o check aparece sem escala.
 */

export type EtapaDoSeletor = {
  id: string;
  titulo: string;
  descricao?: string;
  /** Ícone da etapa (Lucide), mostrado quando ela não é uma etapa já passada. */
  icone?: React.ReactNode;
};

export type SeletorDeEtapaProps = {
  etapas: EtapaDoSeletor[];
  /** Id da etapa atual. */
  atual: string;
  /** Muda para a etapa escolhida. Sem esta função, o seletor só mostra (sem botões). */
  onEscolher?: (id: string) => void;
  /** Id da etapa que está sendo salva (trava as outras). */
  salvando?: string | null;
  /** Id da etapa que acabou de ser salva: mostra o check de sucesso. */
  feita?: string | null;
  /** Nome da lista para leitores de tela (padrão "Etapas"). */
  rotulo?: string;
  textos?: { atual?: string; mover?: string; salvando?: string; passou?: string; futura?: string };
  className?: string;
};

export function SeletorDeEtapa({ etapas, atual, onEscolher, salvando = null, feita = null, rotulo = "Etapas", textos, className }: SeletorDeEtapaProps) {
  const reduzir = useReducedMotion();
  const tx = { atual: "Etapa atual", mover: "Mover para cá", salvando: "Salvando…", passou: "etapa concluída", futura: "etapa seguinte", ...textos };
  const indiceAtual = etapas.findIndex((e) => e.id === atual);
  return (
    <ol aria-label={rotulo} data-slot="seletor-de-etapa" className={cn("@container/etapa m-0 flex list-none flex-col gap-2 p-0", className)}>
      {etapas.map((e, i) => {
        const agora = e.id === atual;
        const passou = indiceAtual >= 0 && i < indiceAtual;
        const salvandoEsta = salvando === e.id;
        const travado = !!salvando && !salvandoEsta;
        const interativo = !!onEscolher;
        const conteudo = (
          <>
            <span
              aria-hidden
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-[var(--duration-normal)] [&_svg]:size-4",
                agora ? "bg-primary text-primary-foreground" : passou ? "bg-success-muted text-success-text" : "bg-muted text-muted-foreground",
              )}
            >
              {salvandoEsta ? (
                <Loader2 className="motion-safe:animate-spin" />
              ) : (
                <AnimatePresence initial={false} mode="wait">
                  {feita === e.id ? (
                    <motion.span key="feita" initial={reduzir ? false : { scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="flex">
                      <Check strokeWidth={3} />
                    </motion.span>
                  ) : passou ? (
                    <Check key="passou" strokeWidth={3} />
                  ) : (
                    <span key="icone" className="flex">{e.icone ?? <span className="text-body-sm font-bold tabular-nums">{i + 1}</span>}</span>
                  )}
                </AnimatePresence>
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-body font-semibold leading-snug text-foreground">{e.titulo}</span>
              {e.descricao && <span className="block text-body-sm leading-snug text-muted-foreground">{e.descricao}</span>}
              {!agora && <span className="sr-only">, {passou ? tx.passou : tx.futura}</span>}
            </span>
            {(interativo || agora) && (
              <span
                className={cn(
                  "col-start-2 text-label font-semibold @min-[28rem]/etapa:col-start-3 @min-[28rem]/etapa:row-start-1 @min-[28rem]/etapa:self-center @min-[28rem]/etapa:text-right",
                  agora ? "text-primary-text" : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {agora ? tx.atual : salvandoEsta ? tx.salvando : tx.mover}
              </span>
            )}
          </>
        );
        const caixa = cn(
          "group grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-lg border p-3 text-left transition-colors duration-[var(--duration-fast)] @min-[28rem]/etapa:grid-cols-[auto_minmax(0,1fr)_auto] @min-[28rem]/etapa:items-center",
          agora ? "border-primary/40 bg-primary-suave" : "border-border bg-card",
        );
        return (
          <li key={e.id}>
            {interativo ? (
              <button
                type="button"
                aria-current={agora ? "step" : undefined}
                aria-disabled={agora || travado || undefined}
                aria-busy={salvandoEsta || undefined}
                onClick={() => { if (!agora && !salvando) onEscolher(e.id); }}
                className={cn(
                  caixa,
                  "toque:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  agora ? "cursor-default" : travado ? "cursor-not-allowed opacity-70" : "hover:border-[var(--border-strong)] hover:bg-muted",
                )}
              >
                {conteudo}
              </button>
            ) : (
              <div aria-current={agora ? "step" : undefined} className={caixa}>{conteudo}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
