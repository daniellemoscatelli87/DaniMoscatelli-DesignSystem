"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "./utils";

/**
 * Grade de miniaturas (28/11/2026, igual nos dois DS): poucas fotos pequenas, quadradas, com o nome e uma linha de
 * detalhe embaixo, para dar uma ideia do que existe (as peças de uma ideia de post no Plano de divulgação do FindLook,
 * os trabalhos de um projeto). Não é a galeria de envio (ImageGrid, com capa e remover) nem uma vitrine (ProductCard).
 * - `colunas` (2, 3 ou 4) é o máximo: a grade usa o espaço do próprio bloco e nunca rola para o lado; em bloco estreito
 *   (menos de 20 rem), fica em 2 colunas.
 * - `maximo` corta a lista (padrão: todas); `vazio` aparece quando não há itens.
 * - Sem foto: o ícone de imagem em cinza, no mesmo quadrado (a grade não pula).
 * - Com `href` (ou `onClick`), cada miniatura vira link (ou botão) com hover cinza e foco visível; sem, só mostra.
 * Texto: nome em text-label (12 px, médio, cortado em 1 linha com o nome inteiro no title) e detalhe em text-caption
 * (11 px) cinza. A foto é decorativa (alt vazio): o nome escrito diz o que ela é.
 * Movimento: as fotos aparecem com um esmaecer curto; com "menos movimento", aparecem prontas.
 */

export type MiniaturaDaGrade = {
  id: string;
  titulo: string;
  foto?: string | null;
  detalhe?: string;
  href?: string;
  onClick?: () => void;
};

export type GradeDeMiniaturasProps = {
  itens: MiniaturaDaGrade[];
  colunas?: 2 | 3 | 4;
  maximo?: number;
  vazio?: React.ReactNode;
  /** Nome da lista para leitores de tela. */
  rotulo?: string;
  /** Componente de link do produto (por exemplo, o Link do Next) para os itens com href. */
  comoLink?: React.ElementType;
  className?: string;
};

const COLUNAS = {
  2: "grid-cols-2",
  3: "grid-cols-2 @min-[20rem]/miniaturas:grid-cols-3",
  4: "grid-cols-2 @min-[20rem]/miniaturas:grid-cols-3 @min-[28rem]/miniaturas:grid-cols-4",
} as const;

export function GradeDeMiniaturas({ itens, colunas = 2, maximo, vazio, rotulo, comoLink, className }: GradeDeMiniaturasProps) {
  const lista = maximo ? itens.slice(0, maximo) : itens;
  if (lista.length === 0) return vazio ? <>{vazio}</> : null;
  const Link = comoLink ?? "a";
  return (
    <div data-slot="grade-de-miniaturas" className={cn("@container/miniaturas min-w-0", className)}>
      <ul aria-label={rotulo} className={cn("m-0 grid list-none gap-2 p-0", COLUNAS[colunas])}>
        {lista.map((m) => {
          const corpo = (
            <>
              <span className="flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-muted">
                {m.foto ? (
                  <img src={m.foto} alt="" loading="lazy" className="size-full object-cover motion-safe:animate-in motion-safe:fade-in motion-safe:duration-[var(--duration-normal)]" />
                ) : (
                  <ImageOff aria-hidden className="size-5 text-muted-foreground" />
                )}
              </span>
              <span title={m.titulo} className="mt-1 block truncate text-label font-medium text-foreground">{m.titulo}</span>
              {m.detalhe && <span className="block truncate text-caption text-muted-foreground">{m.detalhe}</span>}
            </>
          );
          const interativo = "-m-1 block rounded-md p-1 text-left transition-colors duration-[var(--duration-fast)] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
          return (
            <li key={m.id} className="min-w-0">
              {m.href ? (
                <Link href={m.href} className={interativo}>{corpo}</Link>
              ) : m.onClick ? (
                <button type="button" onClick={m.onClick} className={cn(interativo, "w-[calc(100%+0.5rem)] font-normal")}>{corpo}</button>
              ) : (
                corpo
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
