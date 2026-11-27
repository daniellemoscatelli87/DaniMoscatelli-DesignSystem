"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "./utils";
import { IconeComBase } from "./painel-dados";

/**
 * ListaDePilares (3 a 5 ideias com ícone, em sequência)
 *
 * Os pilares de uma seção institucional: "Contato · Relacionamento · Indicação" da Rede de Parceiros (`rx-pilares`,
 * com o feixe que liga os ícones) e os passos de "Uma nova perspectiva" do Projeto Piloto. Cada pilar: ícone na base
 * rosa (IconeComBase marca), título curto e uma frase.
 *
 * Responsiva pela própria largura:
 * - a partir de 40rem: pilares lado a lado, com a linha que liga os ícones (desenhada da esquerda para a direita
 *   quando a lista aparece na tela; parada e completa com "menos movimento");
 * - abaixo disso: um embaixo do outro, cada um com o ícone em cima e o texto embaixo, tudo na mesma borda esquerda.
 * É uma lista ordenada (<ol>) quando a ordem importa (`ordenada`, padrão) e mostra o número no rótulo para leitores
 * de tela. Pilares com mesma altura (a grade estica as linhas).
 */

export type Pilar = { icone: React.ReactNode; titulo: string; texto: React.ReactNode };

export type ListaDePilaresProps = {
  pilares: Pilar[];
  /** Nome da lista para leitores de tela ("A força das conexões"). */
  rotulo: string;
  ordenada?: boolean;
  /** Mostra a linha que liga os ícones (padrão: sim). */
  linha?: boolean;
  nivel?: 3 | 4;
  className?: string;
};

const COLUNAS: Record<number, string> = {
  2: "@min-[40rem]/pilares:grid-cols-2",
  3: "@min-[40rem]/pilares:grid-cols-3",
  4: "@min-[40rem]/pilares:grid-cols-2 @min-[56rem]/pilares:grid-cols-4",
  5: "@min-[40rem]/pilares:grid-cols-3 @min-[64rem]/pilares:grid-cols-5",
};

function ListaDePilares({ pilares, rotulo, ordenada = true, linha = true, nivel = 3, className }: ListaDePilaresProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduzir = useReducedMotion();
  const Lista = ordenada ? "ol" : "ul";
  const H = (`h${nivel}` as unknown) as React.ElementType;
  const comLinhaHorizontal = linha && pilares.length <= 3;
  return (
    <div ref={ref} data-slot="lista-de-pilares" className={cn("@container/pilares relative", className)}>
      {/* Linha horizontal entre os ícones (lado a lado, até 3 pilares) */}
      {comLinhaHorizontal && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-6 hidden h-px @min-[40rem]/pilares:block"
          style={{ left: `${100 / pilares.length / 2}%`, right: `${100 / pilares.length / 2}%` }}
        >
          <motion.span
            className="block h-full origin-left bg-[linear-gradient(to_right,var(--primary),var(--crimson-200))]"
            initial={reduzir ? false : { scaleX: 0 }}
            animate={visivel || reduzir ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </span>
      )}
      <Lista aria-label={rotulo} className={cn("grid gap-8", COLUNAS[pilares.length] ?? "@min-[40rem]/pilares:grid-cols-3")}>
        {pilares.map((p, i) => (
          <motion.li
            key={p.titulo}
            className="relative grid justify-items-start gap-4 @min-[40rem]/pilares:justify-items-center @min-[40rem]/pilares:text-center"
            initial={reduzir ? false : { opacity: 0, y: 12 }}
            animate={visivel || reduzir ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.4, delay: reduzir ? 0 : 0.15 + i * 0.12, ease: [0, 0, 0.58, 1] }}
          >
            <IconeComBase tom="marca" tamanho="lg" redonda className="relative z-10 ring-4 ring-card">{p.icone}</IconeComBase>
            <div className="min-w-0">
              <H className="text-subtitle font-bold leading-snug text-foreground">
                {ordenada && <span className="sr-only">{i + 1}. </span>}
                {p.titulo}
              </H>
              <p className="mt-2 text-pretty text-body-sm leading-relaxed text-muted-foreground @min-[40rem]/pilares:mx-auto @min-[40rem]/pilares:max-w-xs">{p.texto}</p>
            </div>
          </motion.li>
        ))}
      </Lista>
    </div>
  );
}

export { ListaDePilares };
