"use client";

import * as React from "react";
import { cn } from "./utils";
import { useSurgirAoRolar } from "./surgir-ao-rolar";

/**
 * DiagramaDeEcossistema (centro com as partes em volta: a "roda do ecossistema")
 *
 * Veio da seção "Quem buscamos" da Rede de Parceiros em HTML (`rx-eco`, antes do site em React): um centro ("12 setores ·
 * Expertises conectadas"), as especialidades em pétalas em volta dele e, num anel de fora, os setores, cada um ligado ao
 * anel por uma linha. Na migração para React, por falta deste componente, a roda virou etiquetas e cards.
 *
 * - É uma lista de verdade: o centro é um parágrafo e cada anel é uma <ul> com nome (`rotuloDosItens`,
 *   `rotuloDoAnelExterno`). O desenho (pétalas, anel, linhas e pontos) é só enfeite (aria-hidden).
 * - Responsivo pela própria largura (container query): a partir de 48 rem (768 px) de espaço, a roda; abaixo, o mesmo
 *   conteúdo na vertical, mantendo a ideia de centro e raios: o centro em cima, um tronco descendo dele e cada item
 *   ligado ao tronco por um raio curto com um ponto; o anel de fora vira uma grade de etiquetas, duas por linha.
 * - Movimento ao aparecer (useSurgirAoRolar): o centro cresce, as pétalas entram uma depois da outra e, por fim, o anel
 *   de fora e as linhas. Uma vez só. Com "menos movimento", tudo já aparece parado. No servidor e sem JavaScript, tudo
 *   aparece (nada fica escondido esperando o script).
 * - Os itens não são links nem botões, então não mudam no hover (um hover diria que dá para clicar).
 * - Cores e tamanhos só por tokens: pétalas e etiquetas no --card com borda --border; ícones em --primary-text;
 *   linhas e pontos na primária. Textos: --text-label nas pétalas e etiquetas, --text-body-sm e --text-h4 no centro.
 * - Funciona melhor com 6 a 10 itens no anel de dentro e até 12 no de fora; rótulos curtos (uma ou duas palavras).
 */

export type ItemDoEcossistema = { id: string; rotulo: string; icone?: React.ReactNode };

export type DiagramaDeEcossistemaProps = {
  /** O centro da roda: título curto (por exemplo, "12 setores"), uma frase e um ícone. */
  centro: { titulo: React.ReactNode; descricao?: React.ReactNode; icone?: React.ReactNode };
  /** O anel de dentro (pétalas). */
  itens: ItemDoEcossistema[];
  /** O anel de fora (etiquetas ligadas por linhas), opcional. */
  anelExterno?: ItemDoEcossistema[];
  /** Nome do diagrama para leitores de tela ("Ecossistema da Rede de Parceiros"). */
  rotulo: string;
  rotuloDosItens?: string;
  rotuloDoAnelExterno?: string;
  /** Liga a entrada ao aparecer na tela (padrão: sim). */
  animar?: boolean;
  /** Contêiner com rolagem própria (demonstrações). */
  raiz?: React.RefObject<HTMLElement | null>;
  className?: string;
};

/* Geometria em unidades do desenho (viewBox). Com anel de fora: 1000 × 660; sem ele: 600 × 600. */
const R_CENTRO = 105, R_DENTRO = 120, R_FORA = 228, R_ANEL = 262;
const graus = (a: number) => (a * Math.PI) / 180;
const pt = (cx: number, cy: number, r: number, a: number) => [cx + r * Math.sin(graus(a)), cy - r * Math.cos(graus(a))] as const;
const f = (n: number) => n.toFixed(1);

function petala(cx: number, cy: number, a0: number, a1: number) {
  const [x0, y0] = pt(cx, cy, R_FORA, a0), [x1, y1] = pt(cx, cy, R_FORA, a1);
  const [x2, y2] = pt(cx, cy, R_DENTRO, a1), [x3, y3] = pt(cx, cy, R_DENTRO, a0);
  const g = a1 - a0 > 180 ? 1 : 0;
  return `M${f(x0)} ${f(y0)} A${R_FORA} ${R_FORA} 0 ${g} 1 ${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${R_DENTRO} ${R_DENTRO} 0 ${g} 0 ${f(x3)} ${f(y3)} Z`;
}


function DiagramaDeEcossistema({
  centro, itens, anelExterno = [], rotulo, rotuloDosItens = "Itens", rotuloDoAnelExterno = "Anel de fora", animar = true, raiz, className,
}: DiagramaDeEcossistemaProps) {
  const { ref, estado: estadoDaEntrada } = useSurgirAoRolar<HTMLDivElement>({ raiz, limiar: 0.25, duracao: 2600 });
  const estado = animar ? estadoDaEntrada : "inicial";
  const comFora = anelExterno.length > 0;
  const W = comFora ? 1000 : 600, H = comFora ? 660 : 600, cx = W / 2, cy = H / 2;
  const passo = 360 / Math.max(itens.length, 1);
  const folga = Math.min(4, passo * 0.08);
  const x = (v: number) => `${((v / W) * 100).toFixed(3)}%`;
  const y = (v: number) => `${((v / H) * 100).toFixed(3)}%`;
  const larguraDaPetala = ((2 * Math.PI * ((R_DENTRO + R_FORA) / 2)) / Math.max(itens.length, 1) - 16) / W * 100;
  // Anel de fora numa elipse mais larga que alta (as etiquetas aproveitam a largura).
  const RX = 400, RY = 292;
  const fora = anelExterno.map((item, i) => {
    const a = (360 / anelExterno.length) * i;
    const [ex, ey] = [cx + RX * Math.sin(graus(a)), cy - RY * Math.cos(graus(a))];
    const d = Math.hypot(ex - cx, ey - cy) || 1;
    const [px, py] = [cx + ((ex - cx) / d) * R_ANEL, cy + ((ey - cy) / d) * R_ANEL];
    return { item, ex, ey, px, py };
  });

  /* Entrada: escondido em "oculto"; em "visto", cada peça entra com o seu atraso (--i). Fora disso, nada no estilo. */
  const entra = "group-data-[estado=visto]/eco:transition-[opacity,transform,scale] group-data-[estado=visto]/eco:duration-[var(--duration-xslow)] group-data-[estado=visto]/eco:ease-[var(--ease-snappy)] group-data-[estado=visto]/eco:[transition-delay:calc(var(--atraso,0ms)+var(--i,0)*90ms)] motion-reduce:!transition-none";
  const oculto = "group-data-[estado=oculto]/eco:opacity-0";

  return (
    <div
      ref={ref}
      role="group"
      aria-label={rotulo}
      data-slot="diagrama-de-ecossistema"
      data-estado={estado}
      className={cn("group/eco @container/eco w-full", className)}
    >
      <div className={cn("relative mx-auto w-full", comFora ? `@min-[48rem]/eco:aspect-[1000/660] @min-[48rem]/eco:max-w-6xl` : `@min-[48rem]/eco:aspect-square @min-[48rem]/eco:max-w-xl`)}>
        {/* Desenho (só no largo) */}
        <svg viewBox={`0 0 ${W} ${H}`} aria-hidden focusable="false" className={cn("hidden", `@min-[48rem]/eco:absolute @min-[48rem]/eco:inset-0 @min-[48rem]/eco:block @min-[48rem]/eco:size-full`)}>
          {comFora && (
            <g className="text-primary">
              <circle cx={cx} cy={cy} r={R_ANEL} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5}
                className={cn(oculto, entra)} style={{ "--atraso": "900ms" } as React.CSSProperties} />
              {fora.map(({ item, ex, ey, px, py }, i) => (
                <g key={item.id} className={cn(oculto, entra)} style={{ "--i": i, "--atraso": "1100ms" } as React.CSSProperties}>
                  <line x1={f(px)} y1={f(py)} x2={f(ex)} y2={f(ey)} stroke="currentColor" strokeOpacity={0.25} strokeWidth={1.5} />
                  <circle cx={f(px)} cy={f(py)} r={6} className="fill-card" stroke="currentColor" strokeWidth={2.5} />
                </g>
              ))}
            </g>
          )}
          {itens.map((item, i) => {
            const c = passo * i;
            return (
              <path
                key={item.id}
                d={petala(cx, cy, c - passo / 2 + folga / 2, c + passo / 2 - folga / 2)}
                className={cn("fill-card stroke-border", oculto, "group-data-[estado=oculto]/eco:scale-90", entra)}
                strokeWidth={1.5}
                strokeLinejoin="round"
                style={{ "--i": i, "--atraso": "300ms", transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" } as React.CSSProperties}
              />
            );
          })}
        </svg>

        {/* Centro */}
        <div
          className={cn(
            "relative z-[1] flex items-center gap-3 rounded-lg border border-border bg-card p-4",
            `@min-[48rem]/eco:absolute @min-[48rem]/eco:left-1/2 @min-[48rem]/eco:top-1/2 @min-[48rem]/eco:h-[var(--altura)] @min-[48rem]/eco:w-[var(--largura)] @min-[48rem]/eco:flex-col @min-[48rem]/eco:justify-center @min-[48rem]/eco:gap-1 @min-[48rem]/eco:rounded-full @min-[48rem]/eco:p-3 @min-[48rem]/eco:text-center @min-[48rem]/eco:-translate-x-1/2 @min-[48rem]/eco:-translate-y-1/2`,
            oculto, "group-data-[estado=oculto]/eco:scale-75", entra,
          )}
          style={{ "--largura": x(R_CENTRO * 2), "--altura": y(R_CENTRO * 2) } as React.CSSProperties}
          data-parte="centro"
        >
          {centro.icone && (
            <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] text-[var(--primary-text)] [&>svg]:size-5">
              {centro.icone}
            </span>
          )}
          <p className="m-0 min-w-0">
            <strong className="block text-h4 font-bold leading-tight text-primary-text">{centro.titulo}</strong>
            {centro.descricao && <span className="mt-0.5 block text-body-sm font-semibold leading-snug text-foreground">{centro.descricao}</span>}
          </p>
        </div>

        {/* Anel de dentro: no estreito, o tronco à esquerda e um raio para cada item */}
        <ul
          aria-label={rotuloDosItens}
          className={cn(
            "relative m-0 mt-0 grid list-none gap-2 py-3 pl-8 pr-0",
            "before:absolute before:bottom-6 before:left-[0.9375rem] before:top-0 before:w-px before:bg-[var(--primary)] before:opacity-30 before:content-['']",
            `@min-[48rem]/eco:absolute @min-[48rem]/eco:inset-0 @min-[48rem]/eco:block @min-[48rem]/eco:p-0 @min-[48rem]/eco:before:hidden`,
          )}
        >
          {itens.map((item, i) => {
            const [lx, ly] = pt(cx, cy, (R_DENTRO + R_FORA) / 2, passo * i);
            return (
              <li
                key={item.id}
                data-parte="item"
                className={cn(
                  "relative flex min-h-11 items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-body-sm font-semibold leading-snug text-foreground",
                  // raio e ponto no tronco (estreito)
                  "before:absolute before:-left-[1.0625rem] before:top-1/2 before:h-px before:w-4 before:bg-[var(--primary)] before:opacity-30 before:content-['']",
                  "after:absolute after:-left-[1.3125rem] after:top-1/2 after:size-2.5 after:-translate-y-1/2 after:rounded-full after:border-2 after:border-[var(--primary)] after:bg-card after:content-['']",
                  // pétala (largo): só o rótulo e o ícone, por cima do desenho
                  `@min-[48rem]/eco:absolute @min-[48rem]/eco:left-[var(--x)] @min-[48rem]/eco:top-[var(--y)] @min-[48rem]/eco:w-[var(--w)] @min-[48rem]/eco:min-h-0 @min-[48rem]/eco:-translate-x-1/2 @min-[48rem]/eco:-translate-y-1/2 @min-[48rem]/eco:flex-col @min-[48rem]/eco:gap-1 @min-[48rem]/eco:rounded-md @min-[48rem]/eco:border-0 @min-[48rem]/eco:bg-transparent @min-[48rem]/eco:p-1 @min-[48rem]/eco:text-center @min-[48rem]/eco:text-label @min-[48rem]/eco:before:hidden @min-[48rem]/eco:after:hidden`,
                  oculto, "group-data-[estado=oculto]/eco:-translate-x-2", entra,
                )}
                style={{ "--x": x(lx), "--y": y(ly), "--w": `${larguraDaPetala.toFixed(2)}%`, "--i": i, "--atraso": "450ms" } as React.CSSProperties}
              >
                {item.icone && <span aria-hidden className="flex shrink-0 text-primary-text [&>svg]:size-5">{item.icone}</span>}
                <span className="min-w-0 text-pretty">{item.rotulo}</span>
              </li>
            );
          })}
        </ul>

        {/* Anel de fora */}
        {comFora && (
          <>
            <p aria-hidden className={cn("m-0 mb-3 mt-6 text-label font-semibold uppercase tracking-wide text-muted-foreground", `@min-[48rem]/eco:hidden`, oculto, entra)} style={{ "--atraso": "900ms" } as React.CSSProperties}>
              {rotuloDoAnelExterno}
            </p>
            <ul aria-label={rotuloDoAnelExterno} className={cn("m-0 grid list-none grid-cols-2 gap-2 p-0", `@min-[48rem]/eco:absolute @min-[48rem]/eco:inset-0 @min-[48rem]/eco:block`)}>
              {fora.map(({ item, ex, ey }, i) => (
                <li
                  key={item.id}
                  data-parte="anel-externo"
                  className={cn(
                    "flex min-h-11 min-w-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-label font-semibold leading-snug text-foreground",
                    `@min-[48rem]/eco:absolute @min-[48rem]/eco:left-[var(--x)] @min-[48rem]/eco:top-[var(--y)] @min-[48rem]/eco:min-h-10 @min-[48rem]/eco:max-w-[11rem] @min-[48rem]/eco:-translate-x-1/2 @min-[48rem]/eco:-translate-y-1/2 @min-[48rem]/eco:px-4`,
                    oculto, "group-data-[estado=oculto]/eco:scale-95", entra,
                  )}
                  style={{ "--x": x(ex), "--y": y(ey), "--i": i, "--atraso": "1100ms" } as React.CSSProperties}
                >
                  {item.icone && <span aria-hidden className="flex shrink-0 text-primary-text [&>svg]:size-4">{item.icone}</span>}
                  <span className="min-w-0 text-pretty">{item.rotulo}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export { DiagramaDeEcossistema };
