"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "./utils";
import { Checkbox } from "./checkbox";

/**
 * Item marcável (28/11/2026, igual nos dois DS): uma etapa de checklist que a própria pessoa marca como feita. Veio do
 * Plano de divulgação do FindLook. O ItemDeChecklist do painel (FindLook) é outra coisa: um link que leva a uma tela,
 * com o estado calculado pelo sistema (em dia ou precisa de atenção).
 * - ListaMarcavel: a lista (<ol>), com 8 px entre os itens.
 * - ItemMarcavel: a linha inteira é o rótulo da caixa de marcar do DS (clicar em qualquer ponto marca); título,
 *   etiqueta opcional (quem faz), explicação (ligada à caixa por aria-describedby) e um indicador opcional embaixo
 *   (ícone + texto, como "3 posts publicados").
 * Estados: livre (borda --border, fundo do card); hover cinza (--muted, borda --border-strong), nunca rosa; feito
 * (fundo --success-muted, borda verde a 30 %, título riscado em cinza e o check verde que aparece com uma pequena
 * escala); desabilitado (sem hover, caixa esmaecida). O estado nunca é só a cor: caixa marcada, título riscado e check.
 * Toque: a caixa tem 44 × 44 px de área no celular (a do Checkbox do DS) e a linha inteira é clicável.
 * Movimento: o check entra e sai com escala; com "menos movimento", aparece e some sem animar.
 */

export function ListaMarcavel({ className, ...props }: React.OlHTMLAttributes<HTMLOListElement>) {
  return <ol data-slot="lista-marcavel" className={cn("m-0 list-none space-y-2 p-0", className)} {...props} />;
}

export type ItemMarcavelProps = {
  titulo: React.ReactNode;
  marcado: boolean;
  onMarcadoChange: (marcado: boolean) => void;
  /** Etiqueta ao lado do título (por exemplo, um Badge "Você faz"). */
  etiqueta?: React.ReactNode;
  /** Como fazer: texto de apoio, lido junto com a caixa. */
  descricao?: React.ReactNode;
  /** Linha de baixo, com ícone e texto (um resultado ou uma contagem). */
  indicador?: React.ReactNode;
  /** Texto lido antes do título ("Etapa 2:"). */
  prefixoParaLeitores?: string;
  desabilitado?: boolean;
  id?: string;
  className?: string;
};

export function ItemMarcavel({ titulo, marcado, onMarcadoChange, etiqueta, descricao, indicador, prefixoParaLeitores, desabilitado = false, id, className }: ItemMarcavelProps) {
  const reduzir = useReducedMotion();
  const gerado = React.useId();
  const base = id ?? gerado;
  return (
    <li data-slot="item-marcavel" data-marcado={marcado || undefined}>
      <label
        htmlFor={`${base}-caixa`}
        className={cn(
          "flex items-start gap-3 rounded-md border p-3 transition-colors duration-[var(--duration-fast)]",
          desabilitado ? "cursor-not-allowed" : "cursor-pointer",
          marcado ? "border-success/30 bg-success-muted" : cn("border-border bg-card", !desabilitado && "hover:border-[var(--border-strong)] hover:bg-muted"),
          className,
        )}
      >
        <Checkbox
          id={`${base}-caixa`}
          checked={marcado}
          disabled={desabilitado}
          onCheckedChange={(v) => onMarcadoChange(v === true)}
          aria-describedby={descricao ? `${base}-como` : undefined}
          className="mt-0.5"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className={cn("text-body-sm font-semibold text-foreground transition-colors", marcado && "text-muted-foreground line-through decoration-muted-foreground")}>
              {prefixoParaLeitores && <span className="sr-only">{prefixoParaLeitores} </span>}
              {titulo}
            </span>
            {etiqueta}
          </span>
          {descricao && <span id={`${base}-como`} className="mt-0.5 block text-body-sm leading-snug text-muted-foreground">{descricao}</span>}
          {indicador && <span className="mt-1.5 flex items-center gap-1.5 text-label font-medium text-foreground [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground">{indicador}</span>}
        </span>
        <AnimatePresence initial={false}>
          {marcado && (
            <motion.span
              key="feito"
              aria-hidden
              initial={reduzir ? false : { scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduzir ? { opacity: 0, transition: { duration: 0 } } : { scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-0.5 shrink-0 text-success-text"
            >
              <Check className="size-4" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </label>
    </li>
  );
}
