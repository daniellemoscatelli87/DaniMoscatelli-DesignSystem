import * as React from "react";
import { cn } from "./utils";
import { corDoTom, formatarPercentual, PontoDaCor, soma } from "./graficos-inteligencia";

/**
 * Barra de composição: como um total se divide em poucas partes (2 a 5), numa barra só. Ordem fixa, pela regra dos
 * gráficos do DS: título, a barra e, embaixo, a legenda com os valores fora da barra, cada um com o ponto na cor da
 * parte (nome, quantidade e percentual). Cores só dos tokens de gráfico (--chart-1 a --chart-7): passe o tom de cada
 * parte para o mesmo sentido ter a mesma cor na tela (por exemplo, pendentes nos tons 1 e 2, resolvidas nos tons de
 * contexto). As partes ficam separadas por 2 px do fundo; a informação nunca depende só da cor (está na legenda e no
 * nome acessível). A barra entra deslizando da esquerda (--duration-slow), sem animação com "menos movimento".
 */

type ParteDaComposicao = { rotulo: string; valor: number; /** Tom do gráfico (1 a 7). Sem ele, segue a ordem: 1, 2, 3… */ tom?: number };

type BarraDeComposicaoProps = {
  titulo: string;
  partes: ParteDaComposicao[];
  /** Esconde as partes com valor 0 (padrão). */
  ocultarZeros?: boolean;
  /** Texto de cada quantidade ("2 mensagens"); padrão: só o número. */
  formatarQuantidade?: (n: number) => string;
  localidade?: string;
  className?: string;
};

function BarraDeComposicao({ titulo, partes, ocultarZeros = true, formatarQuantidade = n => String(n), localidade = "pt-BR", className }: BarraDeComposicaoProps) {
  const visiveis = partes.map((p, i) => ({ ...p, tom: p.tom ?? i + 1 })).filter(p => !ocultarZeros || p.valor > 0);
  const total = soma(visiveis.map(p => p.valor)) || 1;
  const pct = (v: number) => formatarPercentual((v / total) * 100, 0, localidade);
  const resumo = `${titulo}: ${visiveis.map(p => `${p.rotulo}, ${formatarQuantidade(p.valor)} (${pct(p.valor)})`).join("; ")}.`;
  return (
    <figure data-slot="barra-de-composicao" className={cn("m-0 min-w-0", className)}>
      <figcaption className="text-sm font-semibold text-foreground">{titulo}</figcaption>
      <div
        role="img"
        aria-label={resumo}
        className="mt-3 flex h-3 gap-[2px] overflow-hidden rounded-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-left-4 motion-safe:duration-[var(--duration-slow)]"
      >
        {visiveis.map(p => <span key={p.rotulo} className="block h-full min-w-1" style={{ flex: `${p.valor} 1 0`, background: corDoTom(p.tom) }} />)}
      </div>
      <ul aria-hidden className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {visiveis.map(p => (
          <li key={p.rotulo} className="flex items-center gap-2 text-sm">
            <PontoDaCor cor={corDoTom(p.tom)} className="h-2.5 w-2.5" />
            <span className="text-foreground">{p.rotulo}</span>
            <span className="font-semibold tabular-nums text-foreground">{formatarQuantidade(p.valor)}</span>
            <span className="tabular-nums text-muted-foreground">{pct(p.valor)}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

export { BarraDeComposicao };
export type { ParteDaComposicao, BarraDeComposicaoProps };
