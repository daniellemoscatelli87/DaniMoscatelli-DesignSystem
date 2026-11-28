"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "./utils";
import { rolarAte } from "./menu-de-ancoras";

/**
 * HeroComAba e AbaSaibaMais (hero com a aba "Saiba mais")
 *
 * O hero das páginas do site do estúdio (página inicial, Projeto Piloto e Rede de Parceiros), como está no ar: um painel
 * grande e arredondado com uma aba branca recortada no centro da base, com "Saiba mais" e a seta numa cápsula. A aba
 * tem a cor da seção seguinte, então ela e a seção viram uma peça só. Tocar na aba leva à seção seguinte com rolagem
 * suave (instantânea com "menos movimento") e põe o foco nela.
 *
 * - Computador (a partir de 1024 px): painel com 16 px de respiro em volta e cantos de 32 px; aba de 320 × 56 com o
 *   topo em cantos de 40 px, texto de 16 px e cápsula de 20 × 32. A aba sobe da base ao abrir a página.
 * - Celular e tablet: o hero vai de ponta a ponta; a seção seguinte começa com cantos de 28 px e a aba pequena
 *   (132 × 28, texto de 12 px) fica no centro, com área de toque de 44 px.
 * - alvo: id da seção seguinte ("#sobre"); sem ele, a aba leva ao elemento logo depois do hero.
 * - corDaAba: cor da seção seguinte, por token (padrão: var(--card), o branco). fundo: cor do painel (padrão: o cinza
 *   do fundo da página).
 * - telaCheia (padrão): no computador, o painel ocupa a primeira tela inteira, com a aba visível.
 * - deslocamento: altura do cabeçalho fixo, para a seção parar logo abaixo dele ("auto" lê a do cabeçalho do site).
 * - tela: força o desenho de celular ou de computador (demonstrações).
 *
 * Classes de CSS puro (páginas em HTML): .ds-hero-com-aba > .ds-hero-com-aba-painel > a.ds-aba-saiba-mais com
 * span.ds-aba-saiba-mais-seta. Mesma API no DS FindLook.
 */

type Raiz = React.RefObject<HTMLElement | null>;

export type AbaSaibaMaisProps = Omit<React.ComponentProps<"a">, "children"> & {
  rotulo?: string;
  /** id da seção de destino ("#sobre"). Sem ele, a seção logo depois do hero. */
  alvo?: string;
  raiz?: Raiz;
  deslocamento?: number | "auto";
};

function AbaSaibaMais({ rotulo = "Saiba mais", alvo, raiz, deslocamento = "auto", href, onClick, className, ...props }: AbaSaibaMaisProps) {
  const destino = alvo ?? href;
  const ir = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    const caixa = raiz?.current ?? null;
    let el: HTMLElement | null = null;
    if (destino && destino.startsWith("#") && destino.length > 1) {
      const id = destino.slice(1);
      el = caixa?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? document.getElementById(id);
    } else if (!destino) {
      el = e.currentTarget.closest<HTMLElement>(".ds-hero-com-aba")?.nextElementSibling as HTMLElement | null;
    }
    if (!el) return;
    e.preventDefault();
    rolarAte(el, { raiz, deslocamento });
  };
  return (
    <a data-slot="aba-saiba-mais" href={destino ?? "#"} onClick={ir} className={cn("ds-aba-saiba-mais", className)} {...props}>
      {rotulo}
      <span className="ds-aba-saiba-mais-seta" aria-hidden>
        <ArrowDown strokeWidth={2} />
      </span>
    </a>
  );
}

export type HeroComAbaProps = React.ComponentProps<"section"> & {
  rotulo?: string;
  alvo?: string;
  corDaAba?: string;
  fundo?: string;
  telaCheia?: boolean;
  tela?: "auto" | "celular" | "computador";
  raiz?: Raiz;
  deslocamento?: number | "auto";
  /** Classes do painel arredondado (o fundo, o respiro interno do conteúdo). */
  classNamePainel?: string;
};

function HeroComAba({
  rotulo,
  alvo,
  corDaAba,
  fundo,
  telaCheia = true,
  tela = "auto",
  raiz,
  deslocamento,
  classNamePainel,
  className,
  style,
  children,
  ...props
}: HeroComAbaProps) {
  const vars = {
    ...(corDaAba ? { "--hero-aba-cor": corDaAba } : {}),
    ...(fundo ? { "--hero-fundo": fundo } : {}),
  } as React.CSSProperties;
  return (
    <section
      data-slot="hero-com-aba"
      data-tela={tela === "auto" ? undefined : tela}
      data-tela-cheia={telaCheia ? "" : undefined}
      className={cn("ds-hero-com-aba", className)}
      style={{ ...vars, ...style }}
      {...props}
    >
      <div className={cn("ds-hero-com-aba-painel", classNamePainel)}>
        {children}
        <AbaSaibaMais rotulo={rotulo} alvo={alvo} raiz={raiz} deslocamento={deslocamento} />
      </div>
    </section>
  );
}

export { HeroComAba, AbaSaibaMais };
