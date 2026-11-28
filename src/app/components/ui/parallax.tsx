"use client";

import * as React from "react";
import { cn } from "./utils";

/**
 * Parallax (fundo que anda mais devagar que o conteúdo)
 *
 * Um bloco (faixa de foto, hero, seção de destaque) cuja camada de fundo desliza mais devagar que a página, dando
 * profundidade. Só a camada de fundo se move, nunca o texto nem os botões, e o movimento é pequeno.
 *
 * - Só transform: nada muda de tamanho nem de lugar no layout. A camada sobra um pouco para cima e para baixo do
 *   bloco (--parallax-sobra), e o bloco corta o que passa (overflow hidden).
 * - velocidade: de 0 a 0,5 (padrão 0,2): quanto a camada se atrasa em relação à rolagem.
 * - Nos navegadores com animação ligada à rolagem, é só CSS (sem JavaScript); nos outros, o componente mede a
 *   rolagem a cada quadro, só enquanto o bloco está na tela.
 * - Parado com "menos movimento". desligarNoToque (padrão): parado também nas telas de toque, onde a rolagem por
 *   inércia deixa o efeito trêmulo.
 * - imagem: a foto do fundo (decorativa, sem texto alternativo); ou fundo: qualquer camada (textura, luzes).
 * - raiz: um contêiner com rolagem própria (demonstrações).
 *
 * Classes de CSS puro (páginas em HTML): .ds-parallax (com style="--parallax-velocidade: .2" e data-toque="parado")
 * > .ds-parallax-camada > img. Mesma API no DS FindLook.
 */

export type ParallaxProps = React.ComponentProps<"div"> & {
  imagem?: string;
  /** Posição da foto (object-position), por exemplo "50% 30%". */
  posicaoImagem?: string;
  fundo?: React.ReactNode;
  velocidade?: number;
  desligarNoToque?: boolean;
  raiz?: React.RefObject<HTMLElement | null>;
};

const suportaCss = () => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("animation-timeline: view()");

function Parallax({
  imagem,
  posicaoImagem,
  fundo,
  velocidade = 0.2,
  desligarNoToque = true,
  raiz,
  className,
  style,
  children,
  ...props
}: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const camadaRef = React.useRef<HTMLDivElement>(null);
  const [comJs, setComJs] = React.useState(false);
  const v = Math.min(0.5, Math.max(0, velocidade));

  React.useEffect(() => {
    if (suportaCss()) return;
    setComJs(true);
    const el = ref.current;
    const camada = camadaRef.current;
    if (!el || !camada) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)");
    const toque = window.matchMedia("(pointer: coarse)");
    const caixa = raiz?.current ?? null;
    const alvo: HTMLElement | Window = caixa ?? window;
    let quadro = 0;
    let naTela = true;
    const medir = () => {
      quadro = 0;
      if (reduzir.matches || (desligarNoToque && toque.matches)) { camada.style.transform = ""; return; }
      const r = el.getBoundingClientRect();
      const topo = caixa ? caixa.getBoundingClientRect().top : 0;
      const altura = caixa ? caixa.clientHeight : window.innerHeight;
      const p = Math.min(1, Math.max(0, (topo + altura - r.top) / (altura + r.height)));
      const sobra = v * 0.5 * window.innerHeight;
      camada.style.transform = `translate3d(0, ${((p * 2 - 1) * sobra).toFixed(1)}px, 0)`;
    };
    const agendar = () => { if (naTela && !quadro) quadro = requestAnimationFrame(medir); };
    const obs = "IntersectionObserver" in window
      ? new IntersectionObserver(([e]) => { naTela = e.isIntersecting; if (naTela) agendar(); }, { root: caixa })
      : null;
    obs?.observe(el);
    medir();
    alvo.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      cancelAnimationFrame(quadro);
      obs?.disconnect();
      alvo.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [raiz, v, desligarNoToque]);

  return (
    <div
      ref={ref}
      data-slot="parallax"
      data-js={comJs ? "" : undefined}
      data-toque={desligarNoToque ? "parado" : undefined}
      className={cn("ds-parallax", className)}
      style={{ "--parallax-velocidade": v, ...style } as React.CSSProperties}
      {...props}
    >
      <div ref={camadaRef} aria-hidden className="ds-parallax-camada">
        {imagem ? <img src={imagem} alt="" loading="lazy" decoding="async" style={posicaoImagem ? { objectPosition: posicaoImagem } : undefined} /> : fundo}
      </div>
      {children}
    </div>
  );
}

export { Parallax };
