"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "./utils";

/**
 * Quadro (colunas de etapas com cartões, estilo kanban)
 *
 * Itens organizados por etapa: o quadro ilustrativo da Rede de Parceiros (`rx-kanban`: Em análise, Convite,
 * Em colaboração…) e o acompanhamento de candidaturas ou projetos na área restrita. Cada coluna tem título, a
 * quantidade e os cartões (título, uma linha de apoio, etiqueta e pessoa).
 *
 * Regra do DS (card nunca rola para o lado): as colunas ficam lado a lado quando cabem (cada uma precisa de 14rem) e,
 * no celular, uma embaixo da outra, na largura toda. 2 colunas: lado a lado a partir de 28rem; 3: a partir de 42rem;
 * 4: duas por linha a partir de 28rem e as quatro a partir de 56rem; 5: a partir de 70rem.
 * Cartões entram em sequência quando o quadro aparece na tela (parados com "menos movimento"). Cartão com `href` ou
 * `onClick` vira link ou botão, com hover cinza e foco visível; sem eles, é só leitura.
 * Acessibilidade: cada coluna é uma seção com o título e a contagem ("Convite, 2 itens"); os cartões são uma lista.
 */

export type CartaoDoQuadro = {
  id: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** ChipDeEstado ou Badge. */
  etiqueta?: React.ReactNode;
  /** Avatar da pessoa responsável. */
  pessoa?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export type ColunaDoQuadro = {
  id: string;
  titulo: string;
  /** Cor do ponto da coluna (nunca a única pista: o título diz a etapa). */
  tom?: "marca" | "neutro" | "sucesso" | "info" | "aviso";
  cartoes: CartaoDoQuadro[];
  /** Texto da coluna vazia. */
  vazio?: string;
};

const PONTO = { marca: "bg-primary", neutro: "bg-muted-foreground", sucesso: "bg-success", info: "bg-info", aviso: "bg-warning" } as const;
const COLUNAS: Record<number, string> = {
  1: "",
  2: "@min-[28rem]/quadro:grid-cols-2",
  3: "@min-[42rem]/quadro:grid-cols-3",
  4: "@min-[28rem]/quadro:grid-cols-2 @min-[56rem]/quadro:grid-cols-4",
  5: "@min-[42rem]/quadro:grid-cols-3 @min-[70rem]/quadro:grid-cols-5",
};

export type QuadroProps = {
  colunas: ColunaDoQuadro[];
  rotulo: string;
  textos?: { item?: string; itens?: string; vazio?: string };
  className?: string;
};

function Quadro({ colunas, rotulo, textos, className }: QuadroProps) {
  const tx = { item: "item", itens: "itens", vazio: "Nada nesta etapa", ...textos };
  const ref = React.useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduzir = useReducedMotion();
  let ordem = 0;
  return (
    <div ref={ref} role="region" aria-label={rotulo} data-slot="quadro" className={cn("@container/quadro", className)}>
      <div className={cn("grid items-start gap-4", COLUNAS[colunas.length] ?? COLUNAS[5])}>
        {colunas.map(c => (
          <section key={c.id} aria-label={`${c.titulo}, ${c.cartoes.length} ${c.cartoes.length === 1 ? tx.item : tx.itens}`} className="min-w-0 rounded-lg bg-muted p-3">
            <header className="mb-3 flex items-center gap-2 px-1">
              <span aria-hidden className={cn("size-2 shrink-0 rounded-full", PONTO[c.tom ?? "neutro"])} />
              <h3 className="min-w-0 flex-1 truncate text-body-sm font-semibold text-foreground">{c.titulo}</h3>
              <span aria-hidden className="rounded-full bg-card px-2 text-label font-semibold tabular-nums text-muted-foreground">{c.cartoes.length}</span>
            </header>
            {c.cartoes.length === 0 ? (
              <p className="rounded-md border border-dashed border-[var(--border-strong)] px-3 py-4 text-center text-body-sm text-muted-foreground">{c.vazio ?? tx.vazio}</p>
            ) : (
              <ul className="grid gap-2">
                {c.cartoes.map(k => {
                  const i = ordem++;
                  const conteudo = (
                    <>
                      <span className="block text-body-sm font-semibold leading-snug text-foreground [overflow-wrap:anywhere]">{k.titulo}</span>
                      {k.descricao && <span className="mt-1 block text-body-sm text-muted-foreground [overflow-wrap:anywhere]">{k.descricao}</span>}
                      {(k.etiqueta || k.pessoa) && (
                        <span className="mt-3 flex flex-wrap items-center gap-2">
                          {k.pessoa && <span className="shrink-0">{k.pessoa}</span>}
                          {k.etiqueta && <span className="min-w-0">{k.etiqueta}</span>}
                        </span>
                      )}
                    </>
                  );
                  const classe = "block w-full rounded-md border border-border bg-card p-3 text-left";
                  const interativo = "transition-colors duration-[var(--duration-fast)] hover:border-[var(--border-strong)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                  return (
                    <motion.li
                      key={k.id}
                      initial={reduzir ? false : { opacity: 0, y: 8 }}
                      animate={visivel || reduzir ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, delay: reduzir ? 0 : 0.05 * i, ease: [0, 0, 0.58, 1] }}
                    >
                      {k.href ? (
                        <a href={k.href} className={cn(classe, interativo)}>{conteudo}</a>
                      ) : k.onClick ? (
                        <button type="button" onClick={k.onClick} className={cn(classe, interativo)}>{conteudo}</button>
                      ) : (
                        <div className={classe}>{conteudo}</div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

export { Quadro };
