"use client";

import * as React from "react";
import { cn } from "./utils";

/**
 * ProgressoDeLeitura (barra de leitura no topo)
 *
 * Uma barra fina (4 px) no topo da tela, na cor da marca, que enche da esquerda para a direita conforme a pessoa
 * rola a página ou um texto longo (artigo, termos). É só um sinal visual: fica fora da leitura de tela (aria-hidden).
 *
 * - Sem transição: a barra acompanha a rolagem quadro a quadro, então nunca anima sozinha ("menos movimento" ok).
 * - alvo: o elemento a acompanhar (o artigo); a barra enche do começo dele até o fim dele. Sem alvo, a página toda.
 * - posicao: "fixo" (padrão, preso no topo da tela), "grudado" (sticky, dentro de uma caixa) ou "absoluto".
 * - topo: distância do topo (por exemplo, logo abaixo de um cabeçalho fixo), em px ou em CSS.
 * - raiz: um contêiner com rolagem própria (demonstrações).
 *
 * Classes de CSS puro (páginas em HTML): .ds-progresso-de-leitura > .ds-progresso-de-leitura-barra; nos navegadores
 * com animation-timeline, a barra da página inteira funciona sem JavaScript. Mesma API no DS FindLook.
 */

export type ProgressoDeLeituraProps = {
  alvo?: React.RefObject<HTMLElement | null>;
  raiz?: React.RefObject<HTMLElement | null>;
  posicao?: "fixo" | "grudado" | "absoluto";
  topo?: number | string;
  className?: string;
};

function ProgressoDeLeitura({ alvo, raiz, posicao = "fixo", topo, className }: ProgressoDeLeituraProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const barra = ref.current;
    if (!barra) return;
    const caixa = raiz?.current ?? null;
    const rolavel: HTMLElement | Window = caixa ?? window;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const altura = caixa ? caixa.clientHeight : window.innerHeight;
      let p: number;
      const el = alvo?.current;
      if (el) {
        const topoRaiz = caixa ? caixa.getBoundingClientRect().top : 0;
        const r = el.getBoundingClientRect();
        const percurso = r.height - altura;
        p = percurso > 0 ? (topoRaiz - r.top) / percurso : r.top <= topoRaiz ? 1 : 0;
      } else {
        const rolado = caixa ? caixa.scrollTop : window.scrollY;
        const total = (caixa ? caixa.scrollHeight : document.documentElement.scrollHeight) - altura;
        p = total > 0 ? rolado / total : 0;
      }
      barra.style.setProperty("--progresso", String(Math.min(1, Math.max(0, p))));
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(medir); };
    medir();
    rolavel.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      rolavel.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [alvo, raiz]);

  return (
    <div
      ref={ref}
      aria-hidden
      data-slot="progresso-de-leitura"
      data-js=""
      data-posicao={posicao}
      className={cn("ds-progresso-de-leitura", className)}
      style={topo !== undefined ? ({ "--progresso-topo": typeof topo === "number" ? `${topo}px` : topo } as React.CSSProperties) : undefined}
    >
      <div className="ds-progresso-de-leitura-barra" />
    </div>
  );
}

export { ProgressoDeLeitura };
