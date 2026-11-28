"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "./utils";

/**
 * FaixaDeLogos (empresas atendidas, parceiros, imprensa)
 *
 * Uma faixa de logos que corre devagar, como "Empresas atendidas" da página inicial (carrossel `client-marquee`
 * com CSS próprio). O FindLook DS tem a FaixaDeParceiros, com a mesma ideia.
 *
 * - Os logos ficam em cinza e ganham a cor ao passar o mouse ou focar (`colorirAoPassar`); as bordas da faixa se
 *   dissolvem no fundo.
 * - Movimento: para ao passar o mouse e tem o botão Pausar/Continuar (44 px; WCAG 2.2.2, conteúdo que se move por
 *   mais de 5 s). Com "menos movimento", não corre: vira uma grade centralizada que quebra de linha.
 * - Cada logo tem texto alternativo (o nome da empresa); a cópia que fecha o laço é escondida dos leitores de tela.
 * - Altura padrão dos logos: 40 px, com largura proporcional.
 * - Silhueta (`silhueta`, 28/11/2026): para logos brancos ou muito coloridos, que somem ou gritam num fundo claro. O
 *   desenho do logo vira uma silhueta lisa na cor --muted-foreground (máscara com o próprio arquivo do logo) e passa
 *   para --foreground ao passar o mouse ou focar. Vale para a faixa toda ou só para um logo (`silhueta` no item). O
 *   arquivo do logo precisa estar no mesmo site (ou liberar CORS), porque a máscara lê a imagem.
 */

export type LogoDaFaixa = {
  nome: string;
  src: string;
  href?: string;
  /** Só este logo em silhueta cinza (por exemplo, um logo branco). */
  silhueta?: boolean;
};

export type FaixaDeLogosProps = {
  logos: LogoDaFaixa[];
  /** Nome da faixa para leitores de tela ("Empresas atendidas"). */
  rotulo: string;
  /** Segundos para uma volta completa (padrão 48). */
  duracao?: number;
  colorirAoPassar?: boolean;
  /** Todos os logos em silhueta cinza no token --muted-foreground (logos brancos ou coloridos demais no fundo claro). */
  silhueta?: boolean;
  textos?: { pausar?: string; continuar?: string };
  className?: string;
};

function FaixaDeLogos({ logos, rotulo, duracao = 48, colorirAoPassar = true, silhueta = false, textos, className }: FaixaDeLogosProps) {
  const tx = { pausar: "Pausar a faixa de logos", continuar: "Continuar a faixa de logos", ...textos };
  const [pausada, setPausada] = React.useState(false);
  const item = (l: LogoDaFaixa, copia: boolean) => {
    const img = silhueta || l.silhueta ? (
      // A imagem invisível dá o tamanho; por cima, a mesma imagem como máscara de uma superfície no token de cor.
      <span role={copia ? undefined : "img"} aria-label={copia ? undefined : l.nome} className="relative block">
        <img src={l.src} alt="" loading="lazy" className="invisible block h-10 w-auto max-w-40 object-contain" />
        <span
          aria-hidden
          data-slot="silhueta-do-logo"
          className="absolute inset-0 bg-muted-foreground transition-colors duration-[var(--duration-normal)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] group-hover/logo:bg-foreground group-focus-visible/logo:bg-foreground"
          style={{ maskImage: `url("${l.src}")`, WebkitMaskImage: `url("${l.src}")` }}
        />
      </span>
    ) : (
      <img
        src={l.src}
        alt={copia ? "" : l.nome}
        loading="lazy"
        className={cn("h-10 w-auto max-w-40 object-contain", colorirAoPassar && "opacity-70 grayscale transition-[filter,opacity] duration-[var(--duration-normal)] group-hover/logo:opacity-100 group-hover/logo:grayscale-0 group-focus-visible/logo:opacity-100 group-focus-visible/logo:grayscale-0")}
      />
    );
    return (
      <li key={(copia ? "c-" : "") + l.nome} aria-hidden={copia || undefined} className="flex shrink-0 items-center px-6">
        {l.href && !copia ? (
          <a href={l.href} className="group/logo rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{img}</a>
        ) : (
          <span className="group/logo">{img}</span>
        )}
      </li>
    );
  };
  return (
    <section data-slot="faixa-de-logos" aria-label={rotulo} className={cn("relative w-full", className)}>
      {/* Com movimento: faixa que corre */}
      <div
        className="group/faixa overflow-hidden py-4 motion-reduce:hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
        data-pausada={pausada ? "sim" : "nao"}
      >
        <ul
          className="flex w-max animate-faixa-de-logos group-hover/faixa:[animation-play-state:paused] group-data-[pausada=sim]/faixa:[animation-play-state:paused] group-focus-within/faixa:[animation-play-state:paused]"
          style={{ "--duracao": `${duracao}s` } as React.CSSProperties}
        >
          {logos.map(l => item(l, false))}
          {logos.map(l => item(l, true))}
        </ul>
      </div>
      <div className="mt-2 flex justify-center motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPausada(p => !p)}
          aria-label={pausada ? tx.continuar : tx.pausar}
          className="flex size-11 items-center justify-center rounded-full border border-input bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {pausada ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
        </button>
      </div>
      {/* Menos movimento: grade parada */}
      <ul className="hidden flex-wrap items-center justify-center gap-y-6 py-4 motion-reduce:flex">
        {logos.map(l => item(l, false))}
      </ul>
    </section>
  );
}

export { FaixaDeLogos };
