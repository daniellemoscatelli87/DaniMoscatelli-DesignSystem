"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "./utils";
import {
  COR_NEUTRA, COR_GRADE, coresPorImportancia, coresDasSeries, coresDeFoco, coresDeContexto, corDoTom, ESCALA_SEQUENCIAL, LegendaDoGrafico, LegendaSequencial, PontoDaCor,
  formatarPercentual, fmtPadrao, useLargura, marcasDoEixo, afastar, larguraTexto, soma, arco, faixa,
  DegradeDaArea, LINHA_DA_AREA, TRACO_DA_GRADE, curvaMonotona, useIdDoSvg,
  type BaseDoGrafico, type Formatador, type ParteDaRosca,
} from "./graficos-inteligencia";

/**
 * Catálogo completo de gráficos (19/11/2026): os modelos do catálogo de referência que não estão entre os recomendados.
 * Mesmas regras de graficos-inteligencia.tsx: componentes de apresentação (dados por props), só os tokens de gráfico
 * (--chart-1 a --chart-N, --chart-neutral, --chart-grid, --chart-seq-*; os tons de cada DS em graficos-paleta.ts) com as 5 regras da paleta
 * (um foco no tom 1, importância em ordem, contexto em cinza, no máximo 2 tons intensos, escalas do cinza ao vermelho),
 * valores e nomes escritos junto das marcas,
 * role="img" com aria-label que resume os dados, SVG desenhado na largura real do contêiner e nada anima com "menos movimento".
 *
 * Nenhum texto sobre a cor do gráfico (decisão da dona do produto, 19/11/2026, opção B): valores e rótulos ficam fora da
 * marca, sempre na mesma cor de texto. Linhas de referência (média, tendência) usam a cor do texto secundário, não uma cor nova.
 *
 * Áreas (área empilhada, streamgraph, violino, densidade e o preenchimento do radar) seguem o estilo aprovado em
 * 20/11/2026: linha fina na cor da série e preenchimento em degradê transparente (DegradeDaArea), curvas monotônicas.
 */

/* ── Cores e utilidades do catálogo ───────────────────────────────────────────────────────────────────── */

/**
 * Tons de 4 séries lado a lado ou empilhadas, por importância (coresPorImportancia(4)).
 * Mantido por compatibilidade: para outro número de séries, use coresPorImportancia ou coresDasSeries.
 */
export const CORES_SERIES: readonly string[] = coresPorImportancia(4).map(corDoTom);

/** Cor das linhas de referência (média, tendência, ligações): a do texto secundário. */
const COR_REFERENCIA = "var(--muted-foreground)";

/** Contorno na cor do card atrás do texto: mantém o rótulo legível quando cruza linhas ou faixas. */
const HALO: React.CSSProperties = { paintOrder: "stroke", stroke: "var(--card)", strokeWidth: 3, strokeLinejoin: "round" };

/** Quebra um texto em linhas que caibam em `maximo` px (estimativa). Palavras maiores que a linha não são cortadas. */
export function quebrarTexto(texto: string, maximo: number, px = 11) {
  const linhas: string[] = [];
  let atual = "";
  for (const p of texto.split(/\s+/)) {
    const tentativa = atual ? `${atual} ${p}` : p;
    if (atual && larguraTexto(tentativa, px) > maximo) { linhas.push(atual); atual = p; } else atual = tentativa;
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/** De quantos em quantos rótulos do eixo X escrever, para não encostarem. */
const passoDosRotulos = (n: number, w: number, minimo = 52) => Math.max(1, Math.ceil((n * minimo) / Math.max(1, w)));

/** Entrada única e curta; com "menos movimento", aparece pronto. */
function Entrada({ children, atraso = 0 }: { children: React.ReactNode; atraso?: number }) {
  const menos = useReducedMotion();
  return (
    <motion.g initial={menos ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: menos ? 0 : atraso }}>
      {children}
    </motion.g>
  );
}

/** Linhas de grade horizontais com os valores à esquerda. */
function GradeY({ marcas, Y, x0, x1, formatar, tracejada }: { marcas: number[]; Y: (v: number) => number; x0: number; x1: number; formatar: Formatador; /** Grade tracejada (gráficos de área). */ tracejada?: boolean }) {
  return (
    <>
      {marcas.map(v => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={Y(v)} y2={Y(v)} stroke={COR_GRADE} strokeDasharray={tracejada ? TRACO_DA_GRADE : undefined} />
          <text x={x0 - 6} y={Y(v) + 4} textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">{formatar(v)}</text>
        </g>
      ))}
    </>
  );
}

/** Rótulos do eixo X, pulando alguns quando não cabem (o primeiro e o último sempre aparecem). */
function RotulosX({ rotulos, X, y, largura, centrado }: { rotulos: string[]; X: (i: number) => number; y: number; largura: number; /** Rótulos no meio de cada faixa (velas), não nas pontas. */ centrado?: boolean }) {
  const n = rotulos.length;
  const passo = passoDosRotulos(n, largura, Math.max(40, ...rotulos.map(r => larguraTexto(r, 11) + 12)));
  return (
    <>
      {rotulos.map((r, i) => (i % passo === 0 || i === n - 1) && (i === n - 1 || n - 1 - i >= passo) ? (
        <text key={r + i} x={X(i)} y={y} textAnchor={centrado ? "middle" : i === 0 && n > 1 ? "start" : i === n - 1 && n > 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px]">{r}</text>
      ) : null)}
    </>
  );
}

/** Curvas suaves das áreas: monotônicas em X, sem ultrapassar os dados (ver curvaMonotona). */
const curvaSuave = curvaMonotona;

/** Fatia de pizza (centro, raio, ângulos em radianos a partir do topo, sentido horário). */
function fatia(cx: number, cy: number, r: number, a0: number, a1: number) {
  if (a1 - a0 >= 2 * Math.PI - 1e-6) return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  const p = (a: number) => `${(cx + r * Math.sin(a)).toFixed(2)} ${(cy - r * Math.cos(a)).toFixed(2)}`;
  return `M ${cx} ${cy} L ${p(a0)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z`;
}

/** Setor de anel (sunburst). */
function setorDeAnel(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => `${(cx + r * Math.sin(a)).toFixed(2)} ${(cy - r * Math.cos(a)).toFixed(2)}`;
  const g = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${p(r1, a0)} A ${r1} ${r1} 0 ${g} 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 ${g} 0 ${p(r0, a0)} Z`;
}

/** Ordena as partes como a rosca: do maior para o menor (tons por importância), "Outros" (neutro) no fim, em cinza. */
function partesOrdenadas(partes: ParteDaRosca[]) {
  const destaque = partes.filter(p => !p.neutro).sort((a, b) => b.valor - a.valor);
  const lista = [...destaque, ...partes.filter(p => p.neutro)];
  const cores = coresDasSeries(lista);
  return lista.map((p, i) => ({ ...p, cor: cores[i]! }));
}

/** Lista de partes (nome, quantidade opcional, percentual), usada ao lado da pizza e do waffle. */
function ListaDePartes({ partes, total, localidade, formatarQuantidade }: { partes: (ParteDaRosca & { cor: string })[]; total: number; localidade: string; formatarQuantidade?: Formatador }) {
  return (
    <ul className="m-0 w-full min-w-0 flex-1 list-none space-y-1 p-0">
      {partes.map(p => (
        <li key={p.rotulo} className="flex items-center gap-2.5 px-2 py-1 text-[0.875rem]">
          <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: p.cor }} />
          <span className={cn("min-w-0 flex-1 leading-snug", p.neutro ? "text-muted-foreground" : "text-foreground")}>{p.rotulo}</span>
          {formatarQuantidade && <span className="shrink-0 text-[0.8125rem] tabular-nums text-muted-foreground">{formatarQuantidade(p.valor)}</span>}
          <span className="w-11 shrink-0 text-right font-semibold tabular-nums text-foreground">{formatarPercentual((p.valor / (total || 1)) * 100, 0, localidade)}</span>
        </li>
      ))}
    </ul>
  );
}

/* ── Estatística simples (distribuição) ───────────────────────────────────────────────────────────────── */

function quantil(ordenados: number[], p: number) {
  if (!ordenados.length) return 0;
  const i = (ordenados.length - 1) * p;
  const a = Math.floor(i), b = Math.ceil(i);
  return ordenados[a]! + (ordenados[b]! - ordenados[a]!) * (i - a);
}

export type ResumoDaDistribuicao = {
  minimo: number; q1: number; mediana: number; q3: number; maximo: number;
  /** Fim dos bigodes: o menor e o maior valor dentro de 1,5 × a altura da caixa. */
  bigodeMin: number; bigodeMax: number;
  /** Valores fora do padrão (além dos bigodes). */
  foraDoPadrao: number[];
};

/** Mínimo, quartis, mediana, máximo, bigodes (regra de 1,5 × IQR) e valores fora do padrão. */
export function resumoDaDistribuicao(valores: number[]): ResumoDaDistribuicao {
  const o = [...valores].sort((a, b) => a - b);
  const q1 = quantil(o, 0.25), mediana = quantil(o, 0.5), q3 = quantil(o, 0.75);
  const iqr = q3 - q1;
  const dentro = o.filter(v => v >= q1 - 1.5 * iqr && v <= q3 + 1.5 * iqr);
  return {
    minimo: o[0] ?? 0, q1, mediana, q3, maximo: o[o.length - 1] ?? 0,
    bigodeMin: dentro[0] ?? q1, bigodeMax: dentro[dentro.length - 1] ?? q3,
    foraDoPadrao: o.filter(v => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr),
  };
}

/** Largura de banda de Silverman para a estimativa de densidade. */
function banda(valores: number[]) {
  const n = valores.length || 1;
  const media = soma(valores) / n;
  const dp = Math.sqrt(soma(valores.map(v => (v - media) ** 2)) / n);
  const o = [...valores].sort((a, b) => a - b);
  const iqr = quantil(o, 0.75) - quantil(o, 0.25);
  const s = Math.min(dp, iqr / 1.34) || dp || 1;
  return 0.9 * s * Math.pow(n, -0.2);
}

/** Densidade estimada (núcleo gaussiano) em cada ponto de `xs`. */
function densidade(valores: number[], xs: number[]) {
  const h = banda(valores);
  const k = 1 / (valores.length * h * Math.sqrt(2 * Math.PI) || 1);
  return xs.map(x => k * valores.reduce((s, v) => s + Math.exp(-0.5 * ((x - v) / h) ** 2), 0));
}

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════
   COMPARAÇÃO
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ── Barras agrupadas ──────────────────────────────────────────────────────────────────────────────────── */

export type BarrasAgrupadasProps = BaseDoGrafico & {
  /** Um bloco por grupo; `valores` na ordem de `series`. */
  grupos: { rotulo: string; valores: number[] }[];
  /** Nomes das séries, da mais importante (tom 1) para a mais contextual (coresPorImportancia). */
  series: string[];
  /** Máximo do eixo (padrão: o maior valor). */
  maximo?: number;
};

/**
 * Barras agrupadas, deitadas: em cada grupo, uma barra por série com o valor escrito no fim.
 * O nome de cada série aparece em cima das barras do primeiro grupo (e na legenda).
 */
export function BarrasAgrupadas({ grupos, series, maximo, rotulo, formatar = fmtPadrao, className }: BarrasAgrupadasProps) {
  const menos = useReducedMotion();
  const max = maximo ?? Math.max(1, ...grupos.flatMap(g => g.valores));
  const cores = coresPorImportancia(series.length).map(corDoTom);
  const resumo = `${rotulo}: ${grupos.map(g => `${g.rotulo}, ${series.map((s, i) => `${s} ${formatar(g.valores[i] ?? 0)}`).join(", ")}`).join("; ")}.`;
  return (
    <div className={cn("space-y-4", className)}>
      <LegendaDoGrafico itens={series.map((s, i) => ({ rotulo: s, cor: cores[i]! }))} />
      <div role="img" aria-label={resumo} className="space-y-4">
        {grupos.map((g, gi) => (
          <div key={g.rotulo} className="min-w-0">
            <p className="mb-1 text-[0.8125rem] font-semibold leading-snug text-foreground">{g.rotulo}</p>
            <div className="space-y-1">
              {series.map((s, si) => {
                const v = g.valores[si] ?? 0;
                return (
                  <div key={s}>
                    {gi === 0 && <p className="text-[0.6875rem] leading-tight text-muted-foreground">{s}</p>}
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="h-2.5 shrink-0 rounded-sm"
                        style={{ width: `calc((100% - 4.5rem) * ${v / max})`, background: cores[si], originX: 0 }}
                        initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.55, delay: menos ? 0 : 0.04 * (gi * series.length + si), ease: [0.22, 1, 0.36, 1] }}
                      />
                      <span className={cn("shrink-0 text-[0.75rem] tabular-nums", si === 0 ? "font-semibold text-foreground" : "text-muted-foreground")}>{formatar(v)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Barras empilhadas (valores absolutos) ─────────────────────────────────────────────────────────────── */

export type BarrasEmpilhadasProps = BaseDoGrafico & {
  /** Partes de cada barra, da mais importante para a mais contextual (`neutro` = "Outros", em cinza, por último). */
  categorias: { rotulo: string; neutro?: boolean }[];
  /** Uma barra por linha; `valores` na ordem de `categorias`. */
  linhas: { rotulo: string; valores: number[] }[];
};

/**
 * Barras empilhadas com o total escrito no fim. As partes não levam texto: embaixo de cada barra, uma linha com o valor
 * de cada parte, na mesma ordem e com um ponto na cor dela.
 */
export function BarrasEmpilhadas({ categorias, linhas, rotulo, formatar = fmtPadrao, className }: BarrasEmpilhadasProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const cores = coresDasSeries(categorias);
  const totais = linhas.map(l => soma(l.valores));
  const max = Math.max(1, ...totais);
  const maxTotal = Math.max(...totais.map(t => larguraTexto(formatar(t), 12)));
  const trilho = Math.max(0, largura - maxTotal - 12);
  const resumo = `${rotulo}: ${linhas.map((l, li) => `${l.rotulo}, total ${formatar(totais[li]!)}: ${l.valores.map((v, i) => `${categorias[i]?.rotulo} ${formatar(v)}`).join(", ")}`).join("; ")}.`;
  return (
    <div className={cn("space-y-4", className)}>
      <LegendaDoGrafico itens={categorias.map((c, i) => ({ rotulo: c.rotulo, cor: cores[i]! }))} />
      <div ref={ref} role="img" aria-label={resumo} className="space-y-3">
        {largura > 0 && linhas.map((l, li) => (
          <div key={l.rotulo}>
            <p className="mb-1 text-[0.8125rem] font-medium text-foreground">{l.rotulo}</p>
            <div className="flex items-center gap-2">
              <motion.div className="flex h-4 shrink-0 gap-[2px] overflow-hidden rounded-sm" style={{ width: (totais[li]! / max) * trilho, originX: 0 }}
                initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: menos ? 0 : 0.08 * li, ease: [0.22, 1, 0.36, 1] }}>
                {l.valores.map((v, i) => (
                  <span key={i} title={`${categorias[i]?.rotulo}: ${formatar(v)}`} className="block h-full min-w-0" style={{ flex: `${v} 1 0`, background: cores[i] }} />
                ))}
              </motion.div>
              <span className="shrink-0 text-[0.8125rem] font-semibold tabular-nums text-foreground">{formatar(totais[li]!)}</span>
            </div>
            <ul className="m-0 mt-1 flex list-none flex-wrap gap-x-3 gap-y-0.5 p-0 text-[0.75rem] tabular-nums text-foreground">
              {l.valores.map((v, i) => (
                <li key={i} className="flex items-center gap-1"><PontoDaCor cor={cores[i]!} />{formatar(v)}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Pirulito (lollipop) ───────────────────────────────────────────────────────────────────────────────── */

export type PirulitoProps = BaseDoGrafico & {
  itens: { rotulo: string; valor: number }[];
  /** Quantos itens do topo ficam em destaque (o 1º no tom 1, um 2º no tom 2; o restante no cinza de contexto). Padrão 1. */
  destaques?: number;
  ordenar?: boolean;
  /** Linha de referência (ex.: a média), com nome. */
  referencia?: { valor: number; rotulo: string };
  maximo?: number;
};

/** Pirulito: haste fina e um ponto no valor, escrito ao lado. Mais leve que barras quando há muitos itens. */
export function Pirulito({ itens, destaques = 1, ordenar = true, referencia, maximo, rotulo, formatar = fmtPadrao, className }: PirulitoProps) {
  const menos = useReducedMotion();
  const lista = ordenar ? [...itens].sort((a, b) => b.valor - a.valor) : itens;
  const max = maximo ?? Math.max(1, ...lista.map(i => i.valor), referencia?.valor ?? 0);
  const pos = (v: number) => `calc((100% - 4.5rem) * ${v / max})`;
  const resumo = `${rotulo}: ${lista.map(i => `${i.rotulo} ${formatar(i.valor)}`).join(", ")}${referencia ? `. ${referencia.rotulo}: ${formatar(referencia.valor)}` : ""}.`;
  const cores = coresDeFoco(lista.map((_, i) => i < destaques));
  return (
    <div role="img" aria-label={resumo} className={cn("relative", className)}>
      {referencia && (
        <>
          <p className="mb-2 text-[0.6875rem] tabular-nums text-muted-foreground" style={{ paddingLeft: `max(0px, calc(${pos(referencia.valor)} - 3rem))` }}>
            <span className="border-b border-dashed border-current">{referencia.rotulo}: {formatar(referencia.valor)}</span>
          </p>
          <span aria-hidden className="absolute bottom-0 top-6 border-l border-dashed" style={{ left: pos(referencia.valor), borderColor: COR_REFERENCIA }} />
        </>
      )}
      <div className="space-y-2.5">
        {lista.map((item, i) => {
          const d = i < destaques;
          const cor = cores[i]!;
          return (
            <div key={item.rotulo} className="min-w-0">
              <p className={cn("mb-0.5 text-[0.8125rem] leading-snug", d ? "font-semibold text-foreground" : "text-muted-foreground")}><span className="relative bg-card pr-1 [box-decoration-break:clone]">{item.rotulo}</span></p>
              <div className="relative flex h-4 items-center">
                <motion.span aria-hidden className="block h-[2px] rounded-sm" style={{ width: pos(item.valor), background: cor, originX: 0 }}
                  initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: menos ? 0 : 0.05 * i }} />
                <span aria-hidden className="-ml-1.5 block h-3 w-3 shrink-0 rounded-full" style={{ background: cor }} />
                <span className={cn("relative ml-1 shrink-0 bg-card px-1 text-[0.8125rem] tabular-nums", d ? "font-semibold text-foreground" : "text-muted-foreground")}>{formatar(item.valor)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════
   TEMPO
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export type SerieEmpilhada = { rotulo: string; valores: number[]; neutro?: boolean };

/** Empilha as séries: para cada ponto, a base e o topo de cada camada. */
function empilhar(series: SerieEmpilhada[], n: number, centralizar: boolean) {
  const totais = Array.from({ length: n }, (_, i) => soma(series.map(s => s.valores[i] ?? 0)));
  const base = totais.map(t => (centralizar ? -t / 2 : 0));
  return {
    totais,
    camadas: series.map(s => {
      const ini = [...base];
      s.valores.forEach((v, i) => { base[i] = (base[i] ?? 0) + v; });
      return { ini, fim: [...base] };
    }),
  };
}

/** Nome e último valor de cada camada, no fim do gráfico, afastados para não encostarem. */
function RotulosDasCamadas({ series, meios, x, formatar, cores, topo, fundo }: { series: SerieEmpilhada[]; meios: number[]; x: number; formatar: Formatador; cores: string[]; topo: number; fundo: number }) {
  const ys = afastar(meios, 28, topo + 6, fundo - 10);
  return (
    <>
      {series.map((s, i) => (
        <g key={s.rotulo}>
          <circle cx={x + 4} cy={ys[i]! - 6} r={4} fill={cores[i]} />
          <text x={x + 12} y={ys[i]! - 2} className={cn("text-[11px]", i === 0 && !s.neutro ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{s.rotulo}</text>
          <text x={x + 12} y={ys[i]! + 12} className="fill-foreground text-[12px] font-semibold tabular-nums">{formatar(s.valores[s.valores.length - 1] ?? 0)}</text>
        </g>
      ))}
    </>
  );
}

/** Faixas invisíveis por período, com o detalhe ao passar o cursor (o mesmo está na tabela). */
function DicasPorPeriodo({ rotulosX, series, X, topo, altura, formatar, total }: { rotulosX: string[]; series: SerieEmpilhada[]; X: (i: number) => number; topo: number; altura: number; formatar: Formatador; total?: string }) {
  const n = rotulosX.length;
  const meia = n > 1 ? (X(1) - X(0)) / 2 : 20;
  return (
    <>
      {rotulosX.map((r, i) => (
        <rect key={r + i} x={X(i) - meia} y={topo} width={meia * 2} height={altura} fill="transparent">
          <title>{`${r}: ${series.map(s => `${s.rotulo} ${formatar(s.valores[i] ?? 0)}`).join(", ")}${total ? `; ${total} ${formatar(soma(series.map(s => s.valores[i] ?? 0)))}` : ""}`}</title>
        </rect>
      ))}
    </>
  );
}

/** Camadas empilhadas no estilo das áreas: degradê transparente em cada camada e linha fina na cor da série no topo. */
function CamadasEmDegrade({ camadas, cores, X, Y, chaves }: { camadas: { ini: number[]; fim: number[] }[]; cores: string[]; X: (i: number) => number; Y: (v: number) => number; chaves: string[] }) {
  const id = useIdDoSvg();
  const topos = camadas.map(c => curvaSuave(c.fim.map((v, i) => [X(i), Y(v)])));
  return (
    <>
      <defs>{cores.map((cor, i) => <DegradeDaArea key={i} id={`${id}-${i}`} cor={cor} />)}</defs>
      {camadas.map((c, i) => (
        <path key={"a" + chaves[i]} d={`${topos[i]} ${curvaSuave(c.ini.map((v, j) => [X(j), Y(v)] as [number, number]).reverse(), true)} Z`} fill={`url(#${id}-${i})`} />
      ))}
      {camadas.map((_, i) => (
        <path key={"l" + chaves[i]} d={topos[i]} fill="none" stroke={cores[i]} strokeWidth={LINHA_DA_AREA} strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </>
  );
}

/* ── Área empilhada ───────────────────────────────────────────────────────────────────────────────────── */

export type AreaEmpilhadaProps = BaseDoGrafico & {
  /** Camadas de baixo para cima, da mais importante para a mais contextual (`neutro` = "Outros", em cinza). */
  series: SerieEmpilhada[];
  rotulosX: string[];
  altura?: number;
  rotulos?: { total?: string };
};

/** Área empilhada: o topo é o total; cada camada é a parte de uma série. Nome e último valor no fim de cada camada. */
export function AreaEmpilhada({ series, rotulosX, altura = 240, rotulo, formatar = fmtPadrao, rotulos, className }: AreaEmpilhadaProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { total: "Total", ...rotulos };
  const n = rotulosX.length;
  const { totais, camadas } = empilhar(series, n, false);
  const cores = coresDasSeries(series);
  const marcas = marcasDoEixo(0, Math.max(1, ...totais), 4);
  const yMax = marcas[marcas.length - 1]!;
  const larguraRotulo = Math.min(120, Math.max(...series.map(s => Math.max(larguraTexto(s.rotulo, 11), larguraTexto(formatar(s.valores[n - 1] ?? 0), 12)))) + 16);
  const m = { t: 10, r: larguraRotulo, b: 24, l: Math.max(28, ...marcas.map(v => larguraTexto(formatar(v), 11) + 8)) };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const X = (i: number) => m.l + (n <= 1 ? 0 : (i / (n - 1)) * w);
  const Y = (v: number) => m.t + h - (v / yMax) * h;
  const resumo = `${rotulo}: ${series.map(s => `${s.rotulo} de ${formatar(s.valores[0] ?? 0)} em ${rotulosX[0]} para ${formatar(s.valores[n - 1] ?? 0)} em ${rotulosX[n - 1]}`).join("; ")}; ${r.total.toLowerCase()} em ${rotulosX[n - 1]}: ${formatar(totais[n - 1] ?? 0)}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <GradeY marcas={marcas} Y={Y} x0={m.l} x1={m.l + w} formatar={formatar} tracejada />
          <RotulosX rotulos={rotulosX} X={X} y={altura - 6} largura={w} />
          <Entrada>
            <CamadasEmDegrade camadas={camadas} cores={cores} X={X} Y={Y} chaves={series.map(s => s.rotulo)} />
          </Entrada>
          <RotulosDasCamadas series={series} cores={cores} formatar={formatar} x={m.l + w + 4}
            meios={camadas.map(c => (Y(c.ini[n - 1] ?? 0) + Y(c.fim[n - 1] ?? 0)) / 2)} topo={m.t} fundo={m.t + h} />
          <DicasPorPeriodo rotulosX={rotulosX} series={series} X={X} topo={m.t} altura={h} formatar={formatar} total={r.total} />
        </svg>
      )}
    </div>
  );
}

/* ── Streamgraph ──────────────────────────────────────────────────────────────────────────────────────── */

export type StreamgraphProps = BaseDoGrafico & {
  series: SerieEmpilhada[];
  rotulosX: string[];
  altura?: number;
};

/**
 * Streamgraph: camadas empilhadas em torno de um eixo central, em curvas suaves. Mostra o volume e a mistura
 * mudando no tempo; não serve para ler valores exatos (estão no fim de cada camada e na tabela).
 */
export function Streamgraph({ series, rotulosX, altura = 240, rotulo, formatar = fmtPadrao, className }: StreamgraphProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const n = rotulosX.length;
  const { totais, camadas } = empilhar(series, n, true);
  const cores = coresDasSeries(series);
  const metade = Math.max(1, ...totais) / 2;
  const larguraRotulo = Math.min(120, Math.max(...series.map(s => Math.max(larguraTexto(s.rotulo, 11), larguraTexto(formatar(s.valores[n - 1] ?? 0), 12)))) + 16);
  const m = { t: 8, r: larguraRotulo, b: 24, l: 4 };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const X = (i: number) => m.l + (n <= 1 ? 0 : (i / (n - 1)) * w);
  const Y = (v: number) => m.t + h / 2 - (v / metade) * (h / 2);
  const resumo = `${rotulo}: ${series.map(s => `${s.rotulo} de ${formatar(s.valores[0] ?? 0)} em ${rotulosX[0]} para ${formatar(s.valores[n - 1] ?? 0)} em ${rotulosX[n - 1]}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <line x1={m.l} x2={m.l + w} y1={m.t + h} y2={m.t + h} stroke={COR_GRADE} strokeDasharray={TRACO_DA_GRADE} />
          <RotulosX rotulos={rotulosX} X={X} y={altura - 6} largura={w} />
          <Entrada>
            <CamadasEmDegrade camadas={camadas} cores={cores} X={X} Y={Y} chaves={series.map(s => s.rotulo)} />
          </Entrada>
          <RotulosDasCamadas series={series} cores={cores} formatar={formatar} x={m.l + w + 4}
            meios={camadas.map(c => (Y(c.ini[n - 1] ?? 0) + Y(c.fim[n - 1] ?? 0)) / 2)} topo={m.t} fundo={m.t + h} />
          <DicasPorPeriodo rotulosX={rotulosX} series={series} X={X} topo={m.t} altura={h} formatar={formatar} />
        </svg>
      )}
    </div>
  );
}

/* ── Linha do tempo (eventos no tempo) ────────────────────────────────────────────────────────────────── */

export type EventoNoTempo = {
  /** Posição no tempo, em qualquer unidade crescente (dia do ano, data em milissegundos…): define o espaçamento. */
  quando: number;
  /** Data como deve aparecer escrita (ex.: "12 mar"). */
  data: string;
  rotulo: string;
  destaque?: boolean;
};

export type LinhaDoTempoProps = {
  rotulo: string;
  eventos: EventoNoTempo[];
  /** Começo e fim do eixo (padrão: o primeiro e o último evento). */
  inicio?: number;
  fim?: number;
  /** Marcas no eixo (ex.: meses). */
  marcas?: { quando: number; rotulo: string }[];
  className?: string;
};

/**
 * Linha do tempo com espaçamento proporcional: cada evento é um ponto no eixo, com data e nome em faixas abaixo
 * (as faixas se multiplicam quando os nomes não cabem lado a lado). Diferente do componente Timeline (lista de etapas).
 */
export function LinhaDoTempo({ eventos, inicio, fim, marcas = [], rotulo, className }: LinhaDoTempoProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const lista = [...eventos].sort((a, b) => a.quando - b.quando);
  const t0 = inicio ?? lista[0]?.quando ?? 0, t1 = fim ?? lista[lista.length - 1]?.quando ?? 1;
  const m = { l: 6, r: 6 };
  const w = Math.max(0, largura - m.l - m.r);
  const X = (t: number) => m.l + ((t - t0) / (t1 - t0 || 1)) * w;
  const eixoY = marcas.length ? 30 : 10;
  const faixaH = 38, gap = 10;
  // Faixas: cada rótulo vai na primeira faixa em que não encosta no anterior.
  const fins: number[] = [];
  const caixas = lista.map(e => {
    const lw = Math.max(larguraTexto(e.data, 11), larguraTexto(e.rotulo, 12) * (e.destaque ? 1.06 : 1)) + 4;
    const x = X(e.quando);
    const paraEsquerda = x + lw > largura;
    const a = paraEsquerda ? x - lw : x, b = paraEsquerda ? x : x + lw;
    let f = fins.findIndex(fimDaFaixa => a > fimDaFaixa + gap);
    if (f === -1) { f = fins.length; fins.push(b); } else fins[f] = b;
    return { e, x, paraEsquerda, faixa: f };
  });
  const altura = eixoY + 18 + fins.length * faixaH;
  const resumo = `${rotulo}: ${lista.map(e => `${e.data}, ${e.rotulo}`).join("; ")}.`;
  const temDestaque = eventos.some(e => e.destaque);
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          {marcas.map(mk => (
            <g key={mk.rotulo}>
              <line x1={X(mk.quando)} x2={X(mk.quando)} y1={eixoY - 6} y2={eixoY + 6} stroke={COR_REFERENCIA} />
              <text x={X(mk.quando)} y={12} textAnchor={X(mk.quando) < 20 ? "start" : X(mk.quando) > largura - 20 ? "end" : "middle"} className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-[0.06em]">{mk.rotulo}</text>
            </g>
          ))}
          <line x1={m.l} x2={m.l + w} y1={eixoY} y2={eixoY} stroke={COR_REFERENCIA} strokeWidth={1.5} strokeLinecap="round" />
          <Entrada>
            {caixas.map(({ e, x, faixa: f }) => {
              const yTexto = eixoY + 18 + f * faixaH;
              return <line key={"l" + e.rotulo} x1={x} x2={x} y1={eixoY} y2={yTexto + 2} stroke={COR_GRADE} />;
            })}
            {caixas.map(({ e, x, paraEsquerda, faixa: f }) => {
              const yTexto = eixoY + 18 + f * faixaH;
              const tx = paraEsquerda ? x - 4 : x + 4;
              const ancora = paraEsquerda ? "end" : "start";
              return (
                <g key={e.rotulo}>
                  <circle cx={x} cy={eixoY} r={e.destaque ? 6 : 4.5} fill={e.destaque ? "var(--chart-1)" : "var(--card)"} stroke={e.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} strokeWidth={2} />
                  <text x={tx} y={yTexto + 10} textAnchor={ancora} style={HALO} className="fill-muted-foreground text-[11px] tabular-nums">{e.data}</text>
                  <text x={tx} y={yTexto + 25} textAnchor={ancora} style={HALO} className={cn("text-[12px]", e.destaque ? "fill-foreground font-bold" : "fill-foreground")}>{e.rotulo}</text>
                </g>
              );
            })}
          </Entrada>
        </svg>
      )}
    </div>
  );
}

/* ── Calendário de calor ──────────────────────────────────────────────────────────────────────────────── */

export type CalendarioDeCalorProps = BaseDoGrafico & {
  /** Um valor por dia; `data` no formato AAAA-MM-DD. */
  dias: { data: string; valor: number }[];
  /** Nomes curtos dos dias, começando na segunda (7). */
  rotulosDias?: string[];
  /** Nomes curtos dos meses (12). */
  rotulosMeses?: string[];
  /** Escreve uma data (padrão: DD/MM). */
  formatarData?: (d: Date) => string;
  rotulos?: { menos?: string; mais?: string; maior?: (data: string, valor: string) => string };
};

const DIA_MS = 86400000;
const lerData = (s: string) => { const [a, m, d] = s.split("-").map(Number); return new Date(Date.UTC(a!, (m ?? 1) - 1, d ?? 1)); };

/**
 * Calendário de calor: uma coluna por semana, uma linha por dia da semana, cor pela escala sequencial.
 * O dia de maior valor fica contornado e escrito abaixo; o valor de cada dia aparece ao passar o cursor e na tabela.
 */
export function CalendarioDeCalor({
  dias, rotulo, formatar = fmtPadrao, className,
  rotulosDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
  rotulosMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  formatarData = d => `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
  rotulos,
}: CalendarioDeCalorProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { menos: "Menos", mais: "Mais", maior: (d: string, v: string) => `Dia com mais: ${d} (${v})`, ...rotulos };
  const lista = dias.map(d => ({ ...d, dt: lerData(d.data) })).sort((a, b) => a.dt.getTime() - b.dt.getTime());
  if (!lista.length) return null;
  const primeiro = lista[0]!.dt;
  const deslocamento = (primeiro.getUTCDay() + 6) % 7; // segunda = 0
  const inicio = primeiro.getTime() - deslocamento * DIA_MS;
  const semanas = Math.floor((lista[lista.length - 1]!.dt.getTime() - inicio) / DIA_MS / 7) + 1;
  const valores = lista.map(d => d.valor);
  const min = Math.min(...valores), max = Math.max(...valores);
  const maior = lista.find(d => d.valor === max)!;
  const esq = 30, topo = 16, gap = 3;
  const celula = Math.max(8, Math.min(22, Math.floor((largura - esq) / semanas) - gap));
  const passo = celula + gap;
  const altura = topo + 7 * passo;
  const resumo = `${rotulo}: ${lista.length} dias, de ${formatarData(primeiro)} a ${formatarData(lista[lista.length - 1]!.dt)}; ${r.maior(formatarData(maior.dt), formatar(maior.valor))}.`;
  let ultimoMesX = -99;
  return (
    <div className={cn("space-y-3", className)}>
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={Math.min(largura, esq + semanas * passo)} height={altura} role="img" aria-label={resumo} className="block">
            {[0, 2, 4].map(d => <text key={d} x={0} y={topo + d * passo + celula * 0.75} className="fill-muted-foreground text-[11px]">{rotulosDias[d]}</text>)}
            {lista.map(d => {
              if (d.dt.getUTCDate() > 7) return null;
              const sem = Math.floor((d.dt.getTime() - inicio) / DIA_MS / 7);
              const x = esq + sem * passo;
              if (x - ultimoMesX < 30) return null;
              ultimoMesX = x;
              return <text key={"m" + d.data} x={x} y={11} className="fill-muted-foreground text-[11px]">{rotulosMeses[d.dt.getUTCMonth()]}</text>;
            })}
            <Entrada>
              {lista.map(d => {
                const idx = Math.round((d.dt.getTime() - inicio) / DIA_MS);
                const sem = Math.floor(idx / 7), dia = idx % 7;
                const e = ESCALA_SEQUENCIAL[faixa(d.valor, min, max)]!;
                const marcado = d === maior;
                return (
                  <g key={d.data}>
                    <rect x={esq + sem * passo} y={topo + dia * passo} width={celula} height={celula} rx={3} fill={d.valor > 0 ? e.cor : "var(--muted)"}>
                      <title>{`${formatarData(d.dt)}: ${formatar(d.valor)}`}</title>
                    </rect>
                    {/* contorno com respiro na cor do card: aparece sobre qualquer tom da escala */}
                    {marcado && <rect x={esq + sem * passo - 1.5} y={topo + dia * passo - 1.5} width={celula + 3} height={celula + 3} rx={4} fill="none" stroke="var(--foreground)" strokeWidth={2} />}
                    {marcado && <rect x={esq + sem * passo + 0.75} y={topo + dia * passo + 0.75} width={celula - 1.5} height={celula - 1.5} rx={2.5} fill="none" stroke="var(--card)" strokeWidth={1.5} />}
                  </g>
                );
              })}
            </Entrada>
          </svg>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LegendaSequencial menos={r.menos} mais={r.mais} />
        <p className="text-[0.75rem] font-semibold tabular-nums text-foreground">{r.maior(formatarData(maior.dt), formatar(maior.valor))}</p>
      </div>
    </div>
  );
}

/* ── Velas (candlestick) ──────────────────────────────────────────────────────────────────────────────── */

export type VelaDoGrafico = { rotulo: string; abertura: number; maxima: number; minima: number; fechamento: number };

export type GraficoDeVelasProps = BaseDoGrafico & {
  velas: VelaDoGrafico[];
  altura?: number;
  rotulos?: { subiu?: string; caiu?: string; abertura?: string; maxima?: string; minima?: string; fechamento?: string };
};

/**
 * Velas: em cada período, o traço vai da mínima à máxima e o corpo da abertura ao fechamento.
 * Corpo cheio quando fechou acima da abertura, vazado quando fechou abaixo (a forma diz a direção, não só a cor).
 */
export function GraficoDeVelas({ velas, altura = 240, rotulo, formatar = fmtPadrao, rotulos, className }: GraficoDeVelasProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { subiu: "Fechou acima da abertura", caiu: "Fechou abaixo da abertura", abertura: "abertura", maxima: "máxima", minima: "mínima", fechamento: "fechamento", ...rotulos };
  const n = velas.length;
  const marcas = marcasDoEixo(Math.min(...velas.map(v => v.minima)), Math.max(...velas.map(v => v.maxima)), 4);
  const yMin = marcas[0]!, yMax = marcas[marcas.length - 1]!;
  const ultima = velas[n - 1]!;
  const m = { t: 10, r: larguraTexto(formatar(ultima.fechamento), 12) + 14, b: 24, l: Math.max(28, ...marcas.map(v => larguraTexto(formatar(v), 11) + 8)) };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const slot = w / Math.max(1, n);
  const X = (i: number) => m.l + slot * (i + 0.5);
  const Y = (v: number) => m.t + h - ((v - yMin) / (yMax - yMin || 1)) * h;
  const corpo = Math.max(4, Math.min(18, slot * 0.55));
  const desc = (v: VelaDoGrafico) => `${v.rotulo}: ${r.abertura} ${formatar(v.abertura)}, ${r.maxima} ${formatar(v.maxima)}, ${r.minima} ${formatar(v.minima)}, ${r.fechamento} ${formatar(v.fechamento)}`;
  const resumo = `${rotulo}: ${velas.map(desc).join("; ")}.`;
  return (
    <div className={cn("space-y-3", className)}>
      <LegendaDoGrafico itens={[{ rotulo: r.subiu, cor: "var(--chart-1)" }, { rotulo: r.caiu, cor: "var(--chart-1)", forma: "anel" }]} />
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
            <GradeY marcas={marcas} Y={Y} x0={m.l} x1={m.l + w} formatar={formatar} />
            <RotulosX rotulos={velas.map(v => v.rotulo)} X={X} y={altura - 6} largura={w} centrado />
            <Entrada>
              {velas.map((v, i) => {
                const subiu = v.fechamento >= v.abertura;
                const y0 = Y(Math.max(v.abertura, v.fechamento)), y1 = Y(Math.min(v.abertura, v.fechamento));
                return (
                  <g key={v.rotulo + i}>
                    <title>{desc(v)}</title>
                    <line x1={X(i)} x2={X(i)} y1={Y(v.maxima)} y2={Y(v.minima)} stroke="var(--chart-1)" strokeWidth={1.5} />
                    <rect x={X(i) - corpo / 2} y={y0} width={corpo} height={Math.max(2, y1 - y0)} rx={1.5}
                      fill={subiu ? "var(--chart-1)" : "var(--card)"} stroke="var(--chart-1)" strokeWidth={1.5} />
                  </g>
                );
              })}
            </Entrada>
            <line x1={X(n - 1) + corpo / 2 + 2} x2={m.l + w + 6} y1={Y(ultima.fechamento)} y2={Y(ultima.fechamento)} stroke={COR_REFERENCIA} strokeDasharray="2 2" />
            <text x={m.l + w + 8} y={Y(ultima.fechamento) + 4} className="fill-foreground text-[12px] font-bold tabular-nums">{formatar(ultima.fechamento)}</text>
          </svg>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════
   COMPOSIÇÃO
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ── Pizza ─────────────────────────────────────────────────────────────────────────────────────────────── */

export type PizzaProps = BaseDoGrafico & {
  /** Até 5 partes; "Outros" com `neutro` (grafite, sempre no fim). */
  partes: ParteDaRosca[];
  formatarQuantidade?: Formatador;
  localidade?: string;
  /** Lado do desenho em px (padrão 200). */
  tamanho?: number;
};

/** Pizza: mesmas regras da rosca (partes do maior para o menor, "Outros" em grafite no fim, percentual junto de cada fatia). */
export function Pizza({ partes, rotulo, formatarQuantidade, localidade = "pt-BR", tamanho = 200, className }: PizzaProps) {
  const lista = partesOrdenadas(partes);
  const total = soma(lista.map(p => p.valor)) || 1;
  const c = 100, raio = 66;
  let acc = 0;
  const fatias = lista.map(p => { const a0 = (acc / total) * 2 * Math.PI; acc += p.valor; return { ...p, a0, a1: (acc / total) * 2 * Math.PI }; });
  const resumo = `${rotulo}: ${fatias.map(f => `${f.rotulo} ${formatarPercentual((f.valor / total) * 100, 0, localidade)}`).join(", ")}.`;
  return (
    <div className={cn("@container", className)}>
      <div className="flex flex-col items-center gap-5 @min-[30rem]:flex-row">
        <svg viewBox="0 0 200 200" width={tamanho} height={tamanho} role="img" aria-label={resumo} className="max-w-full shrink-0 overflow-visible">
          <Entrada>
            {fatias.map(f => <path key={f.rotulo} d={fatia(c, c, raio, f.a0, f.a1)} fill={f.cor} stroke="var(--card)" strokeWidth={2} strokeLinejoin="round" />)}
          </Entrada>
          {fatias.map(f => {
            const p = (f.valor / total) * 100;
            if (p < 4) return null;
            const meio = (f.a0 + f.a1) / 2, s = Math.sin(meio);
            return (
              <text key={f.rotulo} x={c + 82 * s} y={c - 82 * Math.cos(meio) + 4} textAnchor={Math.abs(s) < 0.3 ? "middle" : s > 0 ? "start" : "end"}
                className="fill-foreground text-[12px] font-semibold tabular-nums">{formatarPercentual(p, 0, localidade)}</text>
            );
          })}
        </svg>
        <ListaDePartes partes={lista} total={total} localidade={localidade} formatarQuantidade={formatarQuantidade} />
      </div>
    </div>
  );
}

/* ── Waffle ────────────────────────────────────────────────────────────────────────────────────────────── */

export type WaffleProps = BaseDoGrafico & {
  partes: ParteDaRosca[];
  localidade?: string;
  formatarQuantidade?: Formatador;
  /** Texto da nota (padrão: "Cada quadrado é 1% do total."). */
  nota?: string;
};

/** Waffle: 100 quadrados, cada um é 1% do total; as partes se preenchem em ordem, da maior para a menor. */
export function Waffle({ partes, rotulo, localidade = "pt-BR", formatarQuantidade, nota = "Cada quadrado é 1% do total.", className }: WaffleProps) {
  const lista = partesOrdenadas(partes);
  const total = soma(lista.map(p => p.valor)) || 1;
  // Maiores restos: os 100 quadrados somam exatamente 100.
  const brutos = lista.map(p => (p.valor / total) * 100);
  const qtd = brutos.map(Math.floor);
  const faltam = 100 - soma(qtd);
  brutos.map((b, i) => ({ i, resto: b - Math.floor(b) })).sort((a, b) => b.resto - a.resto).slice(0, faltam).forEach(({ i }) => { qtd[i]! += 1; });
  const celulas = lista.flatMap((p, i) => Array.from({ length: qtd[i]! }, () => p.cor));
  const resumo = `${rotulo}: ${lista.map((p, i) => `${p.rotulo} ${qtd[i]} de 100`).join(", ")}.`;
  return (
    <div className={cn("@container", className)}>
      <div className="flex flex-col items-center gap-5 @min-[30rem]:flex-row">
        <div className="w-full max-w-[13rem] shrink-0">
          <svg viewBox="0 0 100 100" role="img" aria-label={resumo} className="block w-full">
            <Entrada>
              {celulas.map((cor, i) => <rect key={i} x={(i % 10) * 10 + 0.8} y={Math.floor(i / 10) * 10 + 0.8} width={8.4} height={8.4} rx={1.6} fill={cor} />)}
            </Entrada>
          </svg>
          <p className="mt-2 text-center text-[0.75rem] text-muted-foreground">{nota}</p>
        </div>
        <ListaDePartes partes={lista} total={total} localidade={localidade} formatarQuantidade={formatarQuantidade} />
      </div>
    </div>
  );
}

/* ── Pirâmide ──────────────────────────────────────────────────────────────────────────────────────────── */

export type PiramideProps = BaseDoGrafico & {
  /** Faixas, de cima para baixo (ex.: faixas de idade, da mais velha para a mais nova). */
  faixas: string[];
  esquerda: { rotulo: string; valores: number[] };
  direita: { rotulo: string; valores: number[] };
  maximo?: number;
};

/** Pirâmide: dois grupos de costas um para o outro, faixa a faixa, com o valor escrito na ponta de cada barra. */
export function Piramide({ faixas, esquerda, direita, maximo, rotulo, formatar = fmtPadrao, className }: PiramideProps) {
  const menos = useReducedMotion();
  const max = maximo ?? Math.max(1, ...esquerda.valores, ...direita.valores);
  const centro = Math.min(110, Math.max(40, ...faixas.map(f => larguraTexto(f, 12))) + 8);
  const resumo = `${rotulo}: ${faixas.map((f, i) => `${f}, ${esquerda.rotulo} ${formatar(esquerda.valores[i] ?? 0)}, ${direita.rotulo} ${formatar(direita.valores[i] ?? 0)}`).join("; ")}.`;
  const barra = (v: number, lado: "e" | "d", i: number) => (
    <div className={cn("flex min-w-0 items-center gap-1.5", lado === "e" && "flex-row-reverse @min-[28rem]:order-none", lado === "d" && "@min-[28rem]:order-none")}>
      <motion.span aria-hidden className="block h-4 shrink-0 rounded-sm"
        style={{ width: `calc((100% - 3rem) * ${v / max})`, background: lado === "e" ? "var(--chart-1)" : "var(--chart-6)", originX: lado === "e" ? 1 : 0 }}
        initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: menos ? 0 : 0.04 * i }} />
      <span className="shrink-0 text-[0.75rem] tabular-nums text-foreground">{formatar(v)}</span>
    </div>
  );
  return (
    <div className={cn("@container space-y-2", className)} style={{ "--centro": `${centro}px` } as React.CSSProperties}>
      <div className="grid grid-cols-2 items-end gap-x-2 text-[0.75rem] font-semibold @min-[28rem]:grid-cols-[1fr_auto_1fr]">
        <span className="flex items-center justify-end gap-1.5 text-foreground">{esquerda.rotulo}<span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--chart-1)" }} /></span>
        <span className="hidden @min-[28rem]:block @min-[28rem]:w-[var(--centro)]" />
        <span className="flex items-center gap-1.5 text-foreground"><span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--chart-6)" }} />{direita.rotulo}</span>
      </div>
      <div role="img" aria-label={resumo} className="space-y-1.5">
        {faixas.map((f, i) => (
          <div key={f} className="grid grid-cols-2 items-center gap-x-2 @min-[28rem]:grid-cols-[1fr_auto_1fr]">
            {barra(esquerda.valores[i] ?? 0, "e", i)}
            <span className="order-first col-span-2 text-center text-[0.75rem] font-medium leading-tight tabular-nums text-muted-foreground @min-[28rem]:order-none @min-[28rem]:col-span-1 @min-[28rem]:w-[var(--centro)]">{f}</span>
            {barra(direita.valores[i] ?? 0, "d", i)}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Dispersão ─────────────────────────────────────────────────────────────────────────────────────────── */

export type PontoDeDispersao = { x: number; y: number; rotulo?: string; destaque?: boolean };

export type DispersaoProps = BaseDoGrafico & {
  pontos: PontoDeDispersao[];
  eixoX: { rotulo: string; formatar?: Formatador };
  eixoY: { rotulo: string; formatar?: Formatador };
  /** Desenha a linha de tendência (mínimos quadrados). */
  tendencia?: boolean;
  altura?: number;
  rotulos?: { tendencia?: string };
};

/** Dispersão: um ponto por item em dois eixos. Os destaques ficam na cor primária e com o nome escrito. */
export function Dispersao({ pontos, eixoX, eixoY, tendencia, altura = 280, rotulo, rotulos, className }: DispersaoProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { tendencia: "Tendência", ...rotulos };
  const fx = eixoX.formatar ?? fmtPadrao, fy = eixoY.formatar ?? fmtPadrao;
  const xs = pontos.map(p => p.x), ys = pontos.map(p => p.y);
  const mx = marcasDoEixo(Math.min(...xs), Math.max(...xs), 4);
  const my = marcasDoEixo(Math.min(0, ...ys), Math.max(...ys), 4);
  const m = { t: 22, r: 12, b: 36, l: Math.max(...my.map(v => larguraTexto(fy(v), 11))) + 12 };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const X = (v: number) => m.l + ((v - mx[0]!) / (mx[mx.length - 1]! - mx[0]! || 1)) * w;
  const Y = (v: number) => m.t + h - ((v - my[0]!) / (my[my.length - 1]! - my[0]! || 1)) * h;
  const passoX = Math.max(1, Math.ceil((mx.length * 58) / Math.max(1, w)));
  // Mínimos quadrados
  const nP = pontos.length || 1, mxm = soma(xs) / nP, mym = soma(ys) / nP;
  const inc = soma(pontos.map(p => (p.x - mxm) * (p.y - mym))) / (soma(pontos.map(p => (p.x - mxm) ** 2)) || 1);
  const reta = (x: number) => mym + inc * (x - mxm);
  const xa = Math.min(...xs), xb = Math.max(...xs);
  const temDestaque = pontos.some(p => p.destaque);
  const resumo = `${rotulo}: ${pontos.length} itens; ${eixoX.rotulo} de ${fx(Math.min(...xs))} a ${fx(Math.max(...xs))}; ${eixoY.rotulo} de ${fy(Math.min(...ys))} a ${fy(Math.max(...ys))}${pontos.some(p => p.destaque) ? `; em destaque: ${pontos.filter(p => p.destaque).map(p => `${p.rotulo ?? ""} (${fx(p.x)}, ${fy(p.y)})`).join(", ")}` : ""}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <text x={m.l} y={10} className="fill-muted-foreground text-[11px] font-semibold">{eixoY.rotulo} ↑</text>
          {my.map(v => (
            <g key={"y" + v}>
              <line x1={m.l} x2={m.l + w} y1={Y(v)} y2={Y(v)} stroke={COR_GRADE} />
              <text x={m.l - 6} y={Y(v) + 4} textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">{fy(v)}</text>
            </g>
          ))}
          {mx.map((v, i) => i % passoX === 0 && (
            <text key={"x" + v} x={X(v)} y={m.t + h + 16} textAnchor={i === 0 ? "start" : "middle"} className="fill-muted-foreground text-[11px] tabular-nums">{fx(v)}</text>
          ))}
          <text x={m.l + w} y={altura - 2} textAnchor="end" className="fill-muted-foreground text-[11px] font-semibold">{eixoX.rotulo} →</text>
          {tendencia && (
            <line x1={X(xa)} x2={X(xb)} y1={Y(reta(xa))} y2={Y(reta(xb))} stroke={COR_REFERENCIA} strokeWidth={1.5} strokeDasharray="5 4" />
          )}
          <Entrada>
            {[...pontos].sort((a, b) => Number(!!a.destaque) - Number(!!b.destaque)).map((p, i) => {
              const cx = X(p.x), cy = Y(p.y);
              const direita = cx + 10 + larguraTexto(p.rotulo ?? "", 11) < m.l + w + m.r;
              return (
                <g key={i}>
                  <title>{`${p.rotulo ? p.rotulo + ": " : ""}${eixoX.rotulo} ${fx(p.x)}, ${eixoY.rotulo} ${fy(p.y)}`}</title>
                  <circle cx={cx} cy={cy} r={p.destaque ? 5.5 : 4} fill={p.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} fillOpacity={p.destaque ? 1 : 0.75} stroke={p.destaque ? "var(--card)" : p.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} strokeWidth={p.destaque ? 1.5 : 1} />
                  {p.destaque && p.rotulo && (
                    <text x={direita ? cx + 9 : cx - 9} y={cy + 4} textAnchor={direita ? "start" : "end"} style={HALO} className="fill-foreground text-[11px] font-semibold">{p.rotulo}</text>
                  )}
                </g>
              );
            })}
          </Entrada>
        </svg>
      )}
      {/* o nome da linha de tendência fica fora do desenho, para não cruzar os pontos */}
      {tendencia && largura > 0 && (
        <p className="mt-1 flex items-center gap-1.5 text-[0.75rem] font-semibold text-muted-foreground">
          <svg aria-hidden width={18} height={4} className="shrink-0"><line x1={0} x2={18} y1={2} y2={2} stroke={COR_REFERENCIA} strokeWidth={1.5} strokeDasharray="5 4" /></svg>
          {r.tendencia}
        </p>
      )}
    </div>
  );
}

/* ── Matriz de correlação ─────────────────────────────────────────────────────────────────────────────── */

export type MatrizDeCorrelacaoProps = {
  rotulo: string;
  variaveis: string[];
  /** Matriz completa (simétrica) com valores de −1 a 1. Só a metade de baixo é desenhada. */
  valores: number[][];
  /** Par em destaque: [linha, coluna]. */
  destaque?: [number, number];
  localidade?: string;
  rotulos?: { fraca?: string; forte?: string; nota?: string; destaque?: (a: string, b: string, valor: string) => string };
  className?: string;
};

/** Listras na cor do card: marcam a relação inversa sem depender da cor nem de texto sobre a célula. */
const LISTRAS_INVERSA = "repeating-linear-gradient(135deg, transparent 0 5px, var(--card) 5px 7.5px)";

/**
 * Matriz de correlação (metade de baixo, numa tabela de verdade): a cor mostra a força da relação, pela escala sequencial,
 * e as listras mostram a direção (com listras: quando uma sobe, a outra desce). As células não levam número: o par em
 * destaque (ou o de relação mais forte) é contornado e dito numa frase abaixo; os números ficam na dica e em Ver dados.
 */
export function MatrizDeCorrelacao({ variaveis, valores, destaque, localidade = "pt-BR", rotulo, rotulos, className }: MatrizDeCorrelacaoProps) {
  const menos = useReducedMotion();
  const r = {
    fraca: "Relação fraca", forte: "Relação forte", nota: "Com listras: relação inversa, quando uma sobe a outra desce. Sem listras: andam juntas.",
    destaque: (a: string, b: string, v: string) => `Em destaque: ${a} e ${b} (${v})`, ...rotulos,
  };
  const fmt = (v: number) => `${v < 0 ? "−" : v > 0 ? "+" : ""}${Math.abs(v).toLocaleString(localidade, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const nivel = (v: number) => { const a = Math.abs(v); return a >= 0.7 ? 3 : a >= 0.5 ? 2 : a >= 0.3 ? 1 : 0; };
  const linhas = variaveis.slice(1), colunas = variaveis.slice(0, -1);
  const alvo: [number, number] = destaque ?? (() => {
    let melhor: [number, number] = [1, 0];
    for (let li = 1; li < variaveis.length; li++) for (let ci = 0; ci < li; ci++)
      if (Math.abs(valores[li]?.[ci] ?? 0) > Math.abs(valores[melhor[0]]?.[melhor[1]] ?? 0)) melhor = [li, ci];
    return melhor;
  })();
  const valorAlvo = valores[alvo[0]]?.[alvo[1]];
  return (
    <div className={cn("space-y-3", className)}>
      <table className="w-full table-fixed border-separate border-spacing-[3px] text-[0.8125rem]">
        <caption className="sr-only">{rotulo}</caption>
        <thead>
          <tr>
            <td className="w-[28%]" />
            {colunas.map(c => <th key={c} scope="col" className="pb-1 text-center align-bottom text-[0.6875rem] font-semibold leading-tight text-muted-foreground [overflow-wrap:anywhere]">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, li0) => {
            const li = li0 + 1;
            return (
              <tr key={l}>
                <th scope="row" className="pr-1 text-left text-[0.75rem] font-medium leading-tight text-foreground [overflow-wrap:anywhere]">{l}</th>
                {colunas.map((c, ci) => {
                  if (ci >= li) return <td key={c} />;
                  const v = valores[li]?.[ci] ?? 0;
                  const e = ESCALA_SEQUENCIAL[nivel(v)]!;
                  const marcado = alvo[0] === li && alvo[1] === ci;
                  return (
                    <motion.td key={c} className={cn("h-10 rounded-sm transition-[filter] duration-200 hover:brightness-95 motion-reduce:transition-none", marcado && "outline outline-2 outline-offset-1 outline-foreground")}
                      style={{ backgroundColor: e.cor, backgroundImage: v < 0 ? LISTRAS_INVERSA : undefined }} title={`${l} × ${c}: ${fmt(v)}`}
                      initial={menos ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: menos ? 0 : 0.03 * (li + ci) }}>
                      <span className="sr-only">{fmt(v)}</span>
                    </motion.td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LegendaSequencial menos={r.fraca} mais={r.forte} />
        {valorAlvo != null && variaveis[alvo[0]] != null && variaveis[alvo[1]] != null && (
          <p className="text-[0.75rem] font-semibold tabular-nums text-foreground">{r.destaque(variaveis[alvo[0]]!, variaveis[alvo[1]]!, fmt(valorAlvo))}</p>
        )}
      </div>
      <p className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
        <span aria-hidden className="h-3 w-6 shrink-0 rounded-[3px]" style={{ backgroundColor: ESCALA_SEQUENCIAL[2]!.cor, backgroundImage: LISTRAS_INVERSA }} />
        {r.nota}
      </p>
    </div>
  );
}

/* ── Radar ─────────────────────────────────────────────────────────────────────────────────────────────── */

export type RadarProps = BaseDoGrafico & {
  /** Nomes dos eixos (de 3 a 8). */
  eixos: string[];
  /** Até 3 séries; `valores` na ordem dos eixos. A série em destaque é preenchida e tem os valores escritos. */
  series: { rotulo: string; valores: number[]; destaque?: boolean }[];
  /** Máximo da escala (padrão: o maior valor). */
  maximo?: number;
  /** Quantos anéis de grade (padrão 4). */
  niveis?: number;
};

/**
 * Radar: cada eixo é uma medida na mesma escala. A série em destaque é preenchida e tem os valores escritos junto do
 * nome de cada eixo, fora da área; as outras são só contorno (tracejado), para não depender só da cor.
 */
export function Radar({ eixos, series, maximo, niveis = 4, rotulo, formatar = fmtPadrao, className }: RadarProps) {
  const menos = useReducedMotion();
  const idGrad = useIdDoSvg();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const n = eixos.length;
  const max = maximo ?? Math.max(1, ...series.flatMap(s => s.valores));
  const iDestaque = Math.max(0, series.findIndex(s => s.destaque));
  const contexto = coresDeContexto(series.length - 1);
  let k = 0;
  const cores = series.map((_, i) => (i === iDestaque ? "var(--chart-1)" : contexto[k++]!));
  const larguraRotulo = Math.min(largura < 420 ? 70 : 92, Math.max(...eixos.map(e => larguraTexto(e, 11))) + 4);
  const R = Math.max(40, Math.min(112, (largura - 2 * larguraRotulo - 20) / 2));
  const valoresDestaque = series[iDestaque]?.valores;
  const folga = valoresDestaque ? 44 : 30; // espaço para o nome do eixo e, embaixo dele, o valor em destaque
  const cx = largura / 2, cy = R + folga;
  const altura = cy + R + folga;
  const ang = (i: number) => (i / n) * 2 * Math.PI;
  const P = (i: number, v: number) => [cx + (v / max) * R * Math.sin(ang(i)), cy - (v / max) * R * Math.cos(ang(i))] as const;
  const poligono = (vs: number[]) => vs.map((v, i) => P(i, v).map(c => c.toFixed(1)).join(",")).join(" ");
  const resumo = `${rotulo}: ${series.map(s => `${s.rotulo}: ${eixos.map((e, i) => `${e} ${formatar(s.valores[i] ?? 0)}`).join(", ")}`).join("; ")}.`;
  const ordem = series.map((s, i) => ({ s, i })).sort((a, b) => Number(a.i === iDestaque) - Number(b.i === iDestaque));
  return (
    <div className={cn("space-y-2", className)}>
      <LegendaDoGrafico itens={series.map((s, i) => ({ rotulo: s.rotulo, cor: cores[i]!, forma: i === iDestaque ? "ponto" : "linha" }))} />
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
            <defs><DegradeDaArea id={idGrad} cor="var(--chart-1)" /></defs>
            {Array.from({ length: niveis }, (_, j) => <polygon key={j} points={poligono(eixos.map(() => (max * (j + 1)) / niveis))} fill="none" stroke={COR_GRADE} />)}
            {eixos.map((e, i) => {
              const [x, y] = P(i, max);
              const s = Math.sin(ang(i)), c = Math.cos(ang(i));
              const lx = cx + (R + 10) * s, ly = cy - (R + 10) * c;
              const ancora = Math.abs(s) < 0.2 ? "middle" : s > 0 ? "start" : "end";
              const linhasTxt = quebrarTexto(e, larguraRotulo);
              const total = linhasTxt.length + (valoresDestaque ? 1 : 0);
              const y0 = c > 0.5 ? ly - (total - 1) * 13 - 2 : c < -0.5 ? ly + 10 : ly + 4 - ((total - 1) * 13) / 2;
              return (
                <g key={e}>
                  <line x1={cx} y1={cy} x2={x} y2={y} stroke={COR_GRADE} />
                  <text x={lx} y={y0} textAnchor={ancora} className="fill-muted-foreground text-[11px]">
                    {linhasTxt.map((t, li) => <tspan key={li} x={lx} dy={li ? 13 : 0}>{t}</tspan>)}
                    {valoresDestaque && <tspan x={lx} dy={13.5} className="fill-foreground text-[12px] font-semibold tabular-nums">{formatar(valoresDestaque[i] ?? 0)}</tspan>}
                  </text>
                </g>
              );
            })}
            {ordem.map(({ s, i }) => (
              <motion.polygon key={s.rotulo} points={poligono(s.valores)} fill={i === iDestaque ? `url(#${idGrad})` : "none"}
                stroke={cores[i]} strokeWidth={LINHA_DA_AREA} strokeDasharray={i === iDestaque ? undefined : "5 3"} strokeLinejoin="round"
                initial={menos ? false : { opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                style={{ transformOrigin: `${cx}px ${cy}px` }} transition={{ duration: 0.55, delay: menos ? 0 : 0.1 * i, ease: [0.22, 1, 0.36, 1] }} />
            ))}
            {valoresDestaque?.map((v, i) => {
              const [x, y] = P(i, v);
              return <circle key={i} cx={x} cy={y} r={3} fill="var(--chart-1)" />;
            })}
          </svg>
        )}
      </div>
    </div>
  );
}

/* ── Coordenadas paralelas ────────────────────────────────────────────────────────────────────────────── */

export type CoordenadasParalelasProps = {
  rotulo: string;
  /** Um eixo vertical por medida, cada um com a sua escala. */
  eixos: { rotulo: string; formatar?: Formatador; min?: number; max?: number }[];
  /** Um traço por item; `valores` na ordem dos eixos. Os destaques ganham cor (o 1º no tom 1) e nome; o resto fica no cinza de contexto. */
  itens: { rotulo: string; valores: number[]; destaque?: boolean }[];
  altura?: number;
  className?: string;
};

/** Coordenadas paralelas: compara itens em várias medidas de escalas diferentes; cada eixo mostra o próprio mínimo e máximo. */
export function CoordenadasParalelas({ eixos, itens, altura = 280, rotulo, className }: CoordenadasParalelasProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const ne = eixos.length;
  const escalas = eixos.map((e, j) => {
    const vs = itens.map(i => i.valores[j] ?? 0);
    return { min: e.min ?? Math.min(...vs), max: e.max ?? Math.max(...vs), f: e.formatar ?? fmtPadrao };
  });
  const destaques = itens.filter(i => i.destaque);
  const cores = coresDeFoco(destaques.map(() => true));
  const mr = Math.min(110, Math.max(0, ...destaques.map(d => larguraTexto(d.rotulo, 12))) + 14);
  const m = { l: 8, r: mr };
  const espaco = (largura - m.l - m.r) / Math.max(1, ne - 1);
  const nomes = eixos.map((e, j) => quebrarTexto(e.rotulo, Math.max(40, j === 0 || j === ne - 1 ? espaco / 2 - 6 : espaco - 10)));
  const linhasNome = Math.max(...nomes.map(l => l.length));
  const t = 10 + linhasNome * 13 + 18, b = 22;
  const h = altura - t - b;
  const X = (j: number) => m.l + j * espaco;
  const Y = (j: number, v: number) => t + h - ((v - escalas[j]!.min) / (escalas[j]!.max - escalas[j]!.min || 1)) * h;
  const caminho = (vs: number[]) => vs.map((v, j) => `${j ? "L" : "M"} ${X(j).toFixed(1)} ${Y(j, v).toFixed(1)}`).join(" ");
  const finais = afastar(destaques.map(d => Y(ne - 1, d.valores[ne - 1] ?? 0)), 16, t, t + h);
  const ancora = (j: number) => (j === 0 ? "start" : j === ne - 1 ? "end" : "middle");
  const resumo = `${rotulo}: ${itens.map(i => `${i.rotulo}: ${eixos.map((e, j) => `${e.rotulo} ${escalas[j]!.f(i.valores[j] ?? 0)}`).join(", ")}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          {eixos.map((e, j) => (
            <g key={e.rotulo}>
              <text x={X(j)} y={12} textAnchor={ancora(j)} className="fill-foreground text-[11px] font-semibold">
                {nomes[j]!.map((l, li) => <tspan key={li} x={X(j)} dy={li ? 13 : 0}>{l}</tspan>)}
              </text>
              <text x={X(j)} y={t - 6} textAnchor={ancora(j)} className="fill-muted-foreground text-[11px] tabular-nums">{escalas[j]!.f(escalas[j]!.max)}</text>
              <line x1={X(j)} x2={X(j)} y1={t} y2={t + h} stroke={COR_REFERENCIA} strokeOpacity={0.5} />
              <text x={X(j)} y={t + h + 15} textAnchor={ancora(j)} className="fill-muted-foreground text-[11px] tabular-nums">{escalas[j]!.f(escalas[j]!.min)}</text>
            </g>
          ))}
          {itens.filter(i => !i.destaque).map((it, i) => (
            <motion.path key={it.rotulo} d={caminho(it.valores)} fill="none" stroke="var(--chart-6)" strokeWidth={1.25} strokeLinejoin="round"
              initial={menos ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: menos ? 0 : 0.03 * i }}>
              <title>{it.rotulo}</title>
            </motion.path>
          ))}
          {destaques.map((d, i) => (
            <g key={d.rotulo}>
              <motion.path d={caminho(d.valores)} fill="none" stroke={cores[i % cores.length]} strokeWidth={2.25} strokeLinejoin="round"
                initial={menos ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: menos ? 0 : 0.2 + 0.08 * i }} />
              {d.valores.map((v, j) => <circle key={j} cx={X(j)} cy={Y(j, v)} r={3} fill={cores[i % cores.length]} />)}
              <text x={X(ne - 1) + 8} y={finais[i]! + 4} className="fill-foreground text-[12px] font-semibold">{d.rotulo}</text>
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

/* ── Sankey ────────────────────────────────────────────────────────────────────────────────────────────── */

export type NoDoSankey = { id: string; rotulo: string; /** Coluna, começando em 0. */ coluna: number; neutro?: boolean };
export type LigacaoDoSankey = { de: string; para: string; valor: number; destaque?: boolean };

export type SankeyProps = BaseDoGrafico & {
  nos: NoDoSankey[];
  ligacoes: LigacaoDoSankey[];
  altura?: number;
};

/**
 * Sankey: fluxos entre etapas; a espessura de cada faixa é a quantidade. O nome e o valor de cada nó ficam escritos
 * ao lado dele; a faixa em destaque fica no tom 1 e as outras no cinza de contexto (tom 6). Os nós ligados a uma faixa
 * em destaque ficam no tom 1 e os outros no tom 6 (sem faixa em destaque, todos no tom 1); nós `neutro` ficam em cinza.
 */
export function Sankey({ nos, ligacoes, altura = 280, rotulo, formatar = fmtPadrao, className }: SankeyProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const colunas = Math.max(...nos.map(n => n.coluna)) + 1;
  const entra = (id: string) => soma(ligacoes.filter(l => l.para === id).map(l => l.valor));
  const sai = (id: string) => soma(ligacoes.filter(l => l.de === id).map(l => l.valor));
  const valorDo = (id: string) => Math.max(entra(id), sai(id));
  const maxRotulo = Math.min(Math.max(70, largura * 0.27), 120);
  const linhasDe = (n: NoDoSankey) => quebrarTexto(n.rotulo, maxRotulo - 10, 12);
  const largEsq = Math.min(maxRotulo, Math.max(0, ...nos.filter(n => n.coluna === 0).map(n => Math.max(...linhasDe(n).map(l => larguraTexto(l, 12))))) + 10);
  const largDir = Math.min(maxRotulo, Math.max(0, ...nos.filter(n => n.coluna === colunas - 1).map(n => Math.max(...linhasDe(n).map(l => larguraTexto(l, 12))))) + 10);
  const m = { t: 6, b: 6, l: largEsq, r: largDir };
  const larguraNo = 10, folga = 14;
  const h = altura - m.t - m.b;
  const porColuna = Array.from({ length: colunas }, (_, c) => nos.filter(n => n.coluna === c));
  const escala = Math.min(...porColuna.map(ns => (h - folga * (ns.length - 1)) / (soma(ns.map(n => valorDo(n.id))) || 1)));
  const xCol = (c: number) => m.l + (colunas <= 1 ? 0 : (c / (colunas - 1)) * (largura - m.l - m.r - larguraNo));
  const pos: Record<string, { x: number; y: number; h: number; saida: number; entrada: number }> = {};
  porColuna.forEach((ns, c) => {
    const alturaCol = soma(ns.map(n => valorDo(n.id) * escala)) + folga * (ns.length - 1);
    let y = m.t + (h - alturaCol) / 2;
    for (const n of ns) { const hh = valorDo(n.id) * escala; pos[n.id] = { x: xCol(c), y, h: hh, saida: y, entrada: y }; y += hh + folga; }
  });
  const faixas = ligacoes.map(l => {
    const a = pos[l.de], b = pos[l.para];
    if (!a || !b) return null;
    const esp = l.valor * escala;
    const y0 = a.saida, y1 = b.entrada;
    a.saida += esp; b.entrada += esp;
    const x0 = a.x + larguraNo, x1 = b.x, xm = (x0 + x1) / 2;
    return { l, d: `M ${x0} ${y0} C ${xm} ${y0} ${xm} ${y1} ${x1} ${y1} L ${x1} ${y1 + esp} C ${xm} ${y1 + esp} ${xm} ${y0 + esp} ${x0} ${y0 + esp} Z` };
  });
  const nome = (id: string) => nos.find(n => n.id === id)?.rotulo ?? id;
  const emDestaque = ligacoes.filter(l => l.destaque);
  const corDoNo = (n: NoDoSankey) => n.neutro ? COR_NEUTRA
    : !emDestaque.length || emDestaque.some(l => l.de === n.id || l.para === n.id) ? "var(--chart-1)" : "var(--chart-6)";
  const resumo = `${rotulo}: ${ligacoes.map(l => `${nome(l.de)} para ${nome(l.para)}: ${formatar(l.valor)}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          {faixas.map((f, i) => f && (
            <motion.path key={i} d={f.d} fill={f.l.destaque ? "var(--chart-1)" : "var(--chart-6)"} fillOpacity={f.l.destaque ? 0.55 : 0.45}
              initial={menos ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: menos ? 0 : 0.05 * i }}>
              <title>{`${nome(f.l.de)} → ${nome(f.l.para)}: ${formatar(f.l.valor)}`}</title>
            </motion.path>
          ))}
          {nos.map(n => {
            const p = pos[n.id]!;
            const ultima = n.coluna === colunas - 1, primeira = n.coluna === 0;
            const tx = primeira ? p.x - 6 : p.x + larguraNo + 6;
            const linhasTxt = linhasDe(n);
            const yMeio = p.y + p.h / 2 - ((linhasTxt.length + 1) * 13) / 2 + 10;
            return (
              <g key={n.id}>
                <rect x={p.x} y={p.y} width={larguraNo} height={Math.max(1, p.h)} rx={2} fill={corDoNo(n)} />
                <text x={tx} y={yMeio} textAnchor={primeira ? "end" : "start"} style={!primeira && !ultima ? HALO : undefined} className="fill-foreground text-[12px] font-semibold">
                  {linhasTxt.map((t, li) => <tspan key={li} x={tx} dy={li ? 13 : 0}>{t}</tspan>)}
                  <tspan x={tx} dy={13} className="fill-muted-foreground text-[11px] font-normal tabular-nums">{formatar(valorDo(n.id))}</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ── Rede de conexões ─────────────────────────────────────────────────────────────────────────────────── */

export type NoDaRede = { id: string; rotulo: string; /** Tamanho do círculo (ex.: quantas vezes aparece). */ valor?: number; destaque?: boolean };
export type LigacaoDaRede = { de: string; para: string; valor: number };

export type RedeDeConexoesProps = BaseDoGrafico & {
  nos: NoDaRede[];
  ligacoes: LigacaoDaRede[];
};

/**
 * Rede de conexões em círculo: cada nó num ponto do círculo, ligações curvas por dentro, com espessura pela força.
 * As ligações do nó em destaque ficam na cor primária; passar o cursor num nó realça as ligações dele.
 */
export function RedeDeConexoes({ nos, ligacoes, rotulo, formatar = fmtPadrao, className }: RedeDeConexoesProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [ativo, setAtivo] = React.useState<string | null>(null);
  const foco = ativo ?? nos.find(n => n.destaque)?.id ?? null;
  const n = nos.length;
  const larguraRotulo = Math.min(96, Math.max(...nos.map(x => larguraTexto(x.rotulo, 11))) + 6);
  const R = Math.max(50, Math.min(115, (largura - 2 * larguraRotulo - 24) / 2));
  const cx = largura / 2, cy = R + 26, altura = cy + R + 26;
  const ang = (i: number) => (i / n) * 2 * Math.PI;
  const pos = Object.fromEntries(nos.map((no, i) => [no.id, { x: cx + R * Math.sin(ang(i)), y: cy - R * Math.cos(ang(i)), a: ang(i) }]));
  const maxV = Math.max(1, ...ligacoes.map(l => l.valor));
  const maxN = Math.max(1, ...nos.map(x => x.valor ?? 1));
  const nome = (id: string) => nos.find(x => x.id === id)?.rotulo ?? id;
  const resumo = `${rotulo}: ${[...ligacoes].sort((a, b) => b.valor - a.valor).map(l => `${nome(l.de)} e ${nome(l.para)}: ${formatar(l.valor)}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)} onMouseLeave={() => setAtivo(null)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          {[...ligacoes].sort((a, b) => Number(a.de === foco || a.para === foco) - Number(b.de === foco || b.para === foco)).map((l, i) => {
            const a = pos[l.de], b = pos[l.para];
            if (!a || !b) return null;
            const ligado = l.de === foco || l.para === foco;
            const qx = cx + ((a.x + b.x) / 2 - cx) * 0.25, qy = cy + ((a.y + b.y) / 2 - cy) * 0.25;
            return (
              <motion.path key={l.de + l.para} d={`M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}`} fill="none"
                stroke={ligado ? "var(--chart-1)" : COR_NEUTRA} strokeOpacity={ligado ? 0.85 : 0.6} strokeWidth={1 + (l.valor / maxV) * 4} strokeLinecap="round"
                style={{ transition: menos ? undefined : "stroke 200ms, stroke-opacity 200ms" }}
                initial={menos ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: menos ? 0 : 0.03 * i }}>
                <title>{`${nome(l.de)} e ${nome(l.para)}: ${formatar(l.valor)}`}</title>
              </motion.path>
            );
          })}
          {nos.map(no => {
            const p = pos[no.id]!;
            const s = Math.sin(p.a), c = Math.cos(p.a);
            const raio = 4 + Math.sqrt((no.valor ?? 1) / maxN) * 7;
            const emFoco = no.id === foco;
            return (
              <g key={no.id} onMouseEnter={() => setAtivo(no.id)} className="cursor-default">
                <circle cx={p.x} cy={p.y} r={raio} fill={emFoco ? "var(--chart-1)" : "var(--chart-6)"} stroke="var(--card)" strokeWidth={2} />
                <text x={p.x + (raio + 6) * s} y={p.y - (raio + 6) * c + 4 + (c < -0.5 ? 6 : c > 0.5 ? -4 : 0)}
                  textAnchor={Math.abs(s) < 0.25 ? "middle" : s > 0 ? "start" : "end"} style={HALO}
                  className={cn("text-[11px]", emFoco ? "fill-foreground font-bold" : "fill-foreground")}>{no.rotulo}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════
   DISTRIBUIÇÃO
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */

/* ── Histograma ────────────────────────────────────────────────────────────────────────────────────────── */

export type HistogramaProps = BaseDoGrafico & {
  /** Valores brutos; o componente conta quantos caem em cada faixa. */
  valores: number[];
  /** Quantas faixas, aproximadamente (padrão 8; os limites ficam em números redondos). */
  faixas?: number;
  /** Faixa de valores em destaque [de, até]: as barras dentro dela ficam na cor primária. */
  destaque?: [number, number];
  /** Linha de referência (ex.: a mediana). */
  referencia?: { valor: number; rotulo: string };
  eixoX: { rotulo: string; formatar?: Formatador };
  altura?: number;
};

/** Histograma: quantos valores caem em cada faixa. A contagem fica escrita em cima de cada barra quando cabe. */
export function Histograma({ valores, faixas: quantas = 8, destaque, referencia, eixoX, altura = 220, rotulo, formatar = fmtPadrao, className }: HistogramaProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const fx = eixoX.formatar ?? fmtPadrao;
  const limites = marcasDoEixo(Math.min(...valores), Math.max(...valores), quantas);
  const caixas = limites.slice(0, -1).map((a, i) => {
    const b = limites[i + 1]!;
    const ultima = i === limites.length - 2;
    return { a, b, n: valores.filter(v => v >= a && (ultima ? v <= b : v < b)).length };
  });
  const maxN = Math.max(1, ...caixas.map(c => c.n));
  const m = { t: referencia ? 36 : 18, r: 8, b: 38, l: 8 };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const lo = limites[0]!, hi = limites[limites.length - 1]!;
  const X = (v: number) => m.l + ((v - lo) / (hi - lo || 1)) * w;
  const Y = (n: number) => m.t + h - (n / maxN) * h;
  const slot = w / Math.max(1, caixas.length);
  const passo = passoDosRotulos(limites.length, w, Math.max(...limites.map(v => larguraTexto(fx(v), 11))) + 10);
  const emDestaque = (c: { a: number; b: number }) => !!destaque && c.a >= destaque[0] && c.b <= destaque[1];
  const resumo = `${rotulo}: ${valores.length} valores; ${caixas.map(c => `de ${fx(c.a)} a ${fx(c.b)}: ${formatar(c.n)}`).join(", ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <line x1={m.l} x2={m.l + w} y1={m.t + h} y2={m.t + h} stroke={COR_GRADE} />
          <Entrada>
            {caixas.map((c, i) => {
              const cor = destaque ? (emDestaque(c) ? "var(--chart-1)" : "var(--chart-6)") : "var(--chart-1)";
              const cabe = slot >= larguraTexto(formatar(c.n), 11) + 4;
              return (
                <g key={i}>
                  <title>{`${fx(c.a)} a ${fx(c.b)}: ${formatar(c.n)}`}</title>
                  <rect x={X(c.a) + 1} y={Y(c.n)} width={Math.max(1, X(c.b) - X(c.a) - 2)} height={m.t + h - Y(c.n)} rx={2} fill={cor} />
                  {(cabe || c.n === maxN) && c.n > 0 && (
                    <text x={(X(c.a) + X(c.b)) / 2} y={Y(c.n) - 5} textAnchor="middle" style={HALO} className={cn("text-[11px] tabular-nums", emDestaque(c) || !destaque ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{formatar(c.n)}</text>
                  )}
                </g>
              );
            })}
          </Entrada>
          {limites.map((v, i) => i % passo === 0 || i === limites.length - 1 ? (
            (i === limites.length - 1 || limites.length - 1 - i >= passo) && <text key={v} x={X(v)} y={m.t + h + 15} textAnchor={i === 0 ? "start" : i === limites.length - 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px] tabular-nums">{fx(v)}</text>
          ) : null)}
          <text x={m.l + w} y={altura - 2} textAnchor="end" className="fill-muted-foreground text-[11px] font-semibold">{eixoX.rotulo} →</text>
          {referencia && (
            <g>
              <line x1={X(referencia.valor)} x2={X(referencia.valor)} y1={16} y2={m.t + h} stroke="var(--foreground)" strokeWidth={1.5} strokeDasharray="4 3" />
              <text x={X(referencia.valor) + (X(referencia.valor) > m.l + w * 0.7 ? -5 : 5)} y={11} textAnchor={X(referencia.valor) > m.l + w * 0.7 ? "end" : "start"} style={HALO}
                className="fill-foreground text-[11px] font-semibold tabular-nums">{`${referencia.rotulo}: ${fx(referencia.valor)}`}</text>
            </g>
          )}
        </svg>
      )}
    </div>
  );
}

/* ── Box plot e violino (grupos de valores) ───────────────────────────────────────────────────────────── */

export type GrupoDeValores = { rotulo: string; valores: number[]; destaque?: boolean };

export type DistribuicaoPorGrupoProps = BaseDoGrafico & {
  grupos: GrupoDeValores[];
  /** Nome da medida, escrito no eixo. */
  eixo?: string;
  rotulos?: { mediana?: string; nota?: string };
};

/** Escala e eixo compartilhados pelo box plot e pelo violino. */
function useEscalaDeGrupos(grupos: GrupoDeValores[], largura: number) {
  const todos = grupos.flatMap(g => g.valores);
  const marcas = marcasDoEixo(Math.min(...todos), Math.max(...todos), 4);
  const lo = marcas[0]!, hi = marcas[marcas.length - 1]!;
  const m = { l: 6, r: 10 };
  const w = Math.max(0, largura - m.l - m.r);
  return { marcas, X: (v: number) => m.l + ((v - lo) / (hi - lo || 1)) * w, x0: m.l, x1: m.l + w };
}

function EixoDeGrupos({ marcas, X, y0, y1, formatar, eixo, largura }: { marcas: number[]; X: (v: number) => number; y0: number; y1: number; formatar: Formatador; eixo?: string; largura: number }) {
  const passo = passoDosRotulos(marcas.length, largura, Math.max(...marcas.map(v => larguraTexto(formatar(v), 11))) + 14);
  return (
    <>
      {marcas.map((v, i) => (
        <g key={v}>
          <line x1={X(v)} x2={X(v)} y1={y0} y2={y1} stroke={COR_GRADE} />
          {(i % passo === 0 || i === marcas.length - 1) && <text x={X(v)} y={y1 + 15} textAnchor={i === 0 ? "start" : i === marcas.length - 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px] tabular-nums">{formatar(v)}</text>}
        </g>
      ))}
      {eixo && <text x={X(marcas[marcas.length - 1]!)} y={y1 + 31} textAnchor="end" className="fill-muted-foreground text-[11px] font-semibold">{eixo} →</text>}
    </>
  );
}

/**
 * Box plot: a caixa vai do 1º ao 3º quartil (a metade do meio), o traço é a mediana, os bigodes vão até 1,5 × a caixa
 * e os pontos vazados são valores fora do padrão. A mediana fica escrita ao lado de cada grupo.
 */
export function BoxPlot({ grupos, eixo, rotulo, formatar = fmtPadrao, rotulos, className }: DistribuicaoPorGrupoProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { mediana: "mediana", nota: "Caixa: metade do meio dos valores. Traço: mediana. Pontos vazados: fora do padrão.", ...rotulos };
  const { marcas, X, x0, x1 } = useEscalaDeGrupos(grupos, largura);
  const H = 48, topo = 4;
  const altura = topo + grupos.length * H + (eixo ? 36 : 20);
  const resumos = grupos.map(g => resumoDaDistribuicao(g.valores));
  const temDestaque = grupos.some(g => g.destaque);
  const resumo = `${rotulo}: ${grupos.map((g, i) => { const s = resumos[i]!; return `${g.rotulo}, ${r.mediana} ${formatar(s.mediana)}, de ${formatar(s.q1)} a ${formatar(s.q3)} na metade do meio, mínimo ${formatar(s.minimo)}, máximo ${formatar(s.maximo)}`; }).join("; ")}.`;
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
            <EixoDeGrupos marcas={marcas} X={X} y0={topo} y1={topo + grupos.length * H} formatar={formatar} eixo={eixo} largura={x1 - x0} />
            <Entrada>
              {grupos.map((g, i) => {
                const s = resumos[i]!;
                const y = topo + i * H, yc = y + 30;
                const cor = g.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)";
                return (
                  <g key={g.rotulo}>
                    <text x={x0} y={y + 12} style={HALO} className={cn("text-[12px]", g.destaque ? "fill-foreground font-bold" : "fill-foreground")}>{g.rotulo}</text>
                    <text x={x1} y={y + 12} textAnchor="end" style={HALO} className="fill-muted-foreground text-[11px] tabular-nums">{`${r.mediana} `}<tspan className="fill-foreground font-semibold">{formatar(s.mediana)}</tspan></text>
                    <line x1={X(s.bigodeMin)} x2={X(s.q1)} y1={yc} y2={yc} stroke={cor} strokeWidth={1.5} />
                    <line x1={X(s.q3)} x2={X(s.bigodeMax)} y1={yc} y2={yc} stroke={cor} strokeWidth={1.5} />
                    <line x1={X(s.bigodeMin)} x2={X(s.bigodeMin)} y1={yc - 5} y2={yc + 5} stroke={cor} strokeWidth={1.5} />
                    <line x1={X(s.bigodeMax)} x2={X(s.bigodeMax)} y1={yc - 5} y2={yc + 5} stroke={cor} strokeWidth={1.5} />
                    <rect x={X(s.q1)} y={yc - 8} width={Math.max(2, X(s.q3) - X(s.q1))} height={16} rx={2}
                      fill={cor} fillOpacity={0.3} stroke={cor} strokeWidth={1.5} />
                    <line x1={X(s.mediana)} x2={X(s.mediana)} y1={yc - 8} y2={yc + 8} stroke="var(--foreground)" strokeWidth={2.5} />
                    {s.foraDoPadrao.map((v, j) => <circle key={j} cx={X(v)} cy={yc} r={3.5} fill="var(--card)" stroke={cor} strokeWidth={1.5} />)}
                  </g>
                );
              })}
            </Entrada>
          </svg>
        )}
      </div>
      <p className="text-[0.75rem] text-muted-foreground">{r.nota}</p>
    </div>
  );
}

/**
 * Violino: o contorno mostra onde os valores se concentram em cada grupo (densidade estimada, espelhada).
 * Dentro, a barra escura é a metade do meio e o ponto é a mediana, escrita ao lado do nome.
 */
export function Violino({ grupos, eixo, rotulo, formatar = fmtPadrao, rotulos, className }: DistribuicaoPorGrupoProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const idGrad = useIdDoSvg();
  const r = { mediana: "mediana", nota: "Mais largo: mais valores naquela faixa. Barra escura: metade do meio. Ponto: mediana.", ...rotulos };
  const { marcas, X, x0, x1 } = useEscalaDeGrupos(grupos, largura);
  const H = 58, topo = 4, meia = 15;
  const altura = topo + grupos.length * H + (eixo ? 36 : 20);
  const resumos = grupos.map(g => resumoDaDistribuicao(g.valores));
  const resumo = `${rotulo}: ${grupos.map((g, i) => { const s = resumos[i]!; return `${g.rotulo}, ${r.mediana} ${formatar(s.mediana)}, metade do meio de ${formatar(s.q1)} a ${formatar(s.q3)}`; }).join("; ")}.`;
  const temDestaque = grupos.some(g => g.destaque);
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
            <EixoDeGrupos marcas={marcas} X={X} y0={topo} y1={topo + grupos.length * H} formatar={formatar} eixo={eixo} largura={x1 - x0} />
            <defs>
              <DegradeDaArea id={`${idGrad}-d`} cor="var(--chart-1)" espelhado />
              <DegradeDaArea id={`${idGrad}-n`} cor="var(--chart-6)" espelhado />
            </defs>
            <Entrada>
              {grupos.map((g, i) => {
                const s = resumos[i]!;
                const y = topo + i * H, yc = y + 36;
                const xs = Array.from({ length: 48 }, (_, k) => s.minimo + ((s.maximo - s.minimo) * k) / 47);
                const ds = densidade(g.valores, xs);
                const dMax = Math.max(...ds) || 1;
                const cima = xs.map((x, k) => [X(x), yc - (ds[k]! / dMax) * meia] as [number, number]);
                const baixo = xs.map((x, k) => [X(x), yc + (ds[k]! / dMax) * meia] as [number, number]).reverse();
                return (
                  <g key={g.rotulo}>
                    <text x={x0} y={y + 12} style={HALO} className={cn("text-[12px]", g.destaque ? "fill-foreground font-bold" : "fill-foreground")}>{g.rotulo}</text>
                    <text x={x1} y={y + 12} textAnchor="end" style={HALO} className="fill-muted-foreground text-[11px] tabular-nums">{`${r.mediana} `}<tspan className="fill-foreground font-semibold">{formatar(s.mediana)}</tspan></text>
                    <path d={`${curvaSuave(cima)} ${curvaSuave(baixo, true)} Z`} fill={`url(#${idGrad}-${g.destaque || !temDestaque ? "d" : "n"})`} stroke={g.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} strokeWidth={LINHA_DA_AREA} strokeLinejoin="round" />
                    <line x1={X(s.q1)} x2={X(s.q3)} y1={yc} y2={yc} stroke="var(--foreground)" strokeWidth={4} strokeLinecap="round" />
                    <circle cx={X(s.mediana)} cy={yc} r={3.5} fill="var(--card)" stroke="var(--foreground)" strokeWidth={1.5} />
                  </g>
                );
              })}
            </Entrada>
          </svg>
        )}
      </div>
      <p className="text-[0.75rem] text-muted-foreground">{r.nota}</p>
    </div>
  );
}

/* ── Densidade ─────────────────────────────────────────────────────────────────────────────────────────── */

export type DensidadeProps = BaseDoGrafico & {
  /** Até 3 séries de valores brutos. */
  series: GrupoDeValores[];
  eixoX: { rotulo: string; formatar?: Formatador };
  altura?: number;
  rotulos?: { nota?: string };
};

/**
 * Curvas de densidade: a forma de cada distribuição, suavizada, para comparar onde cada grupo se concentra.
 * O nome de cada série fica escrito no pico da curva; o eixo vertical não tem unidade (só a forma importa).
 */
export function Densidade({ series, eixoX, altura = 220, rotulo, rotulos, className }: DensidadeProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { nota: "Quanto mais alta a curva, mais valores naquela faixa.", ...rotulos };
  const idGrad = useIdDoSvg();
  const fx = eixoX.formatar ?? fmtPadrao;
  const todos = series.flatMap(s => s.valores);
  const marcas = marcasDoEixo(Math.min(...todos), Math.max(...todos), 5);
  const lo = marcas[0]!, hi = marcas[marcas.length - 1]!;
  const xs = Array.from({ length: 60 }, (_, k) => lo + ((hi - lo) * k) / 59);
  const curvas = series.map(s => densidade(s.valores, xs));
  const dMax = Math.max(...curvas.flat()) || 1;
  const iDestaque = Math.max(0, series.findIndex(s => s.destaque));
  const contexto = coresDeContexto(series.length - 1);
  let k = 0;
  const cores = series.map((_, i) => (i === iDestaque ? "var(--chart-1)" : contexto[k++]!));
  const m = { t: 22, r: 8, b: 38, l: 8 };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const X = (v: number) => m.l + ((v - lo) / (hi - lo || 1)) * w;
  const Y = (d: number) => m.t + h - (d / dMax) * h;
  const passo = passoDosRotulos(marcas.length, w, Math.max(...marcas.map(v => larguraTexto(fx(v), 11))) + 12);
  // Rótulos no pico; sobem quando encostam num rótulo já colocado.
  const colocados: { a: number; b: number; y: number }[] = [];
  const picos = curvas.map((c, i) => {
    const j = c.indexOf(Math.max(...c));
    const x = X(xs[j]!), lw = larguraTexto(series[i]!.rotulo, 11) + 8;
    let y = Y(c[j]!) - 7;
    const a = Math.max(0, Math.min(largura - lw, x - lw / 2)), b = a + lw;
    while (colocados.some(p => a < p.b && b > p.a && Math.abs(p.y - y) < 14)) y -= 14;
    colocados.push({ a, b, y });
    return { x: a + lw / 2, y };
  });
  const resumo = `${rotulo}: ${series.map(s => { const st = resumoDaDistribuicao(s.valores); return `${s.rotulo}, mediana ${fx(st.mediana)}, a maior parte entre ${fx(st.q1)} e ${fx(st.q3)}`; }).join("; ")}.`;
  const ordem = series.map((s, i) => ({ s, i })).sort((a, b) => Number(a.i === iDestaque) - Number(b.i === iDestaque));
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
            <defs>{cores.map((cor, i) => <DegradeDaArea key={i} id={`${idGrad}-${i}`} cor={cor} topo={i === iDestaque ? 0.2 : 0.12} base={0} />)}</defs>
            <line x1={m.l} x2={m.l + w} y1={m.t + h} y2={m.t + h} stroke={COR_GRADE} strokeDasharray={TRACO_DA_GRADE} />
            {marcas.map((v, i) => (i % passo === 0 || i === marcas.length - 1) && (i === marcas.length - 1 || marcas.length - 1 - i >= passo) ? (
              <text key={v} x={X(v)} y={m.t + h + 15} textAnchor={i === 0 ? "start" : i === marcas.length - 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px] tabular-nums">{fx(v)}</text>
            ) : null)}
            <text x={m.l + w} y={altura - 2} textAnchor="end" className="fill-muted-foreground text-[11px] font-semibold">{eixoX.rotulo} →</text>
            {ordem.map(({ s, i }) => {
              const pts = xs.map((x, j) => [X(x), Y(curvas[i]![j]!)] as [number, number]);
              const d = curvaSuave(pts);
              return (
                <g key={s.rotulo}>
                  <motion.path d={`${d} L ${X(hi)} ${m.t + h} L ${X(lo)} ${m.t + h} Z`} fill={`url(#${idGrad}-${i})`}
                    initial={menos ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: menos ? 0 : 0.1 * i }} />
                  <motion.path d={d} fill="none" stroke={cores[i]} strokeWidth={LINHA_DA_AREA} strokeDasharray={i === iDestaque ? undefined : "5 3"}
                    // O traço da série sem destaque aparece por opacidade: a animação de pathLength apagaria o tracejado.
                    initial={menos ? false : i === iDestaque ? { pathLength: 0 } : { opacity: 0 }} whileInView={i === iDestaque ? { pathLength: 1 } : { opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: menos ? 0 : 0.1 * i }} />
                </g>
              );
            })}
            {series.map((s, i) => (
              <text key={s.rotulo} x={picos[i]!.x} y={picos[i]!.y} textAnchor="middle" style={HALO}
                className={cn("text-[11px]", i === iDestaque ? "fill-foreground font-bold" : "fill-foreground font-medium")}>{s.rotulo}</text>
            ))}
          </svg>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LegendaDoGrafico itens={series.map((s, i) => ({ rotulo: s.rotulo, cor: cores[i]!, forma: "linha" as const }))} />
        <p className="text-[0.75rem] text-muted-foreground">{r.nota}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════════════════════════════════
   GEOGRAFIA (esquemática)
   ════════════════════════════════════════════════════════════════════════════════════════════════════════ */

export type RegiaoEsquematica = {
  id: string;
  rotulo: string;
  /** Posição na grade (começa em 1) e tamanho em células, como no MapaDeCalorPorRegiao. */
  coluna: number;
  linha: number;
  largura?: number;
  altura?: number;
};

type MapaEsquematicoBase = {
  rotulo: string;
  regioes: RegiaoEsquematica[];
  colunas: number;
  linhas: number;
  /** Altura do desenho (padrão: proporcional à largura, até 340 px). */
  altura?: number;
  /** Escreve o nome de cada região no canto do bloco (padrão: sim). */
  nomesDasRegioes?: boolean;
  rotulos?: { nota?: string };
  className?: string;
};

const NOTA_MAPA = "Mapa esquemático: posições aproximadas, sem escala.";

/** Fundo do mapa esquemático: um bloco por região, com o nome no canto. */
function useMapaEsquematico(colunas: number, linhas: number, largura: number, altura?: number) {
  const H = altura ?? Math.min(340, Math.round(largura * (linhas / colunas) * 0.78));
  return { H, cw: largura / colunas, ch: H / linhas };
}

function FundoDoMapa({ regioes, cw, ch, nomes = true }: { regioes: RegiaoEsquematica[]; cw: number; ch: number; nomes?: boolean }) {
  return (
    <>
      {regioes.map(r => (
        <g key={r.id}>
          <rect x={(r.coluna - 1) * cw + 2} y={(r.linha - 1) * ch + 2} width={(r.largura ?? 1) * cw - 4} height={(r.altura ?? 1) * ch - 4} rx={6} fill="var(--muted)" stroke="var(--border)" />
          {nomes && <text x={(r.coluna - 1) * cw + 9} y={(r.linha - 1) * ch + 17} className="fill-muted-foreground text-[11px] font-medium">{r.rotulo}</text>}
        </g>
      ))}
    </>
  );
}

/* ── Mapa de pontos ────────────────────────────────────────────────────────────────────────────────────── */

export type PontoNoMapa = {
  rotulo: string;
  /** Posição em unidades da grade: de 0 a `colunas` (x) e de 0 a `linhas` (y). */
  x: number;
  y: number;
  /** Índice em `tipos` (padrão 0): muda a forma e o tom do ponto. */
  tipo?: number;
  /** Escreve o nome junto do ponto. */
  destaque?: boolean;
};

export type MapaDePontosProps = MapaEsquematicoBase & {
  pontos: PontoNoMapa[];
  /** Nomes dos tipos de ponto (até 3): círculo, quadrado e losango. */
  tipos?: string[];
};

/** Tipos por importância (coresPorImportancia(3)), cada um com a sua forma. */
const FORMAS_DOS_TIPOS = (["circulo", "quadrado", "losango"] as const).map((forma, i) => ({ cor: corDoTom(coresPorImportancia(3)[i]!), forma }));

function MarcaDoTipo({ tipo, x, y, r }: { tipo: number; x: number; y: number; r: number }) {
  const f = FORMAS_DOS_TIPOS[tipo % FORMAS_DOS_TIPOS.length]!;
  const comum = { fill: f.cor, stroke: "var(--card)", strokeWidth: 1.5 };
  if (f.forma === "quadrado") return <rect x={x - r} y={y - r} width={r * 2} height={r * 2} rx={1.5} {...comum} />;
  if (f.forma === "losango") return <path d={`M ${x} ${y - r * 1.3} L ${x + r * 1.3} ${y} L ${x} ${y + r * 1.3} L ${x - r * 1.3} ${y} Z`} {...comum} />;
  return <circle cx={x} cy={y} r={r} {...comum} />;
}

/**
 * Mapa de pontos esquemático: cada ponto é um lugar (loja, unidade…) na posição aproximada que o produto informar.
 * Os tipos mudam a forma e o tom; os destaques têm o nome escrito. Não é mapa em escala e não usa dados geográficos.
 */
export function MapaDePontos({ regioes, colunas, linhas, pontos, tipos = [], altura, nomesDasRegioes = true, rotulo, rotulos, className }: MapaDePontosProps) {
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { nota: NOTA_MAPA, ...rotulos };
  const { H, cw, ch } = useMapaEsquematico(colunas, linhas, largura, altura);
  const contagem = tipos.map((t, i) => `${pontos.filter(p => (p.tipo ?? 0) === i).length} ${t}`);
  const resumo = `${rotulo}: ${pontos.length} pontos${contagem.length ? ` (${contagem.join(", ")})` : ""}${pontos.some(p => p.destaque) ? `; em destaque: ${pontos.filter(p => p.destaque).map(p => p.rotulo).join(", ")}` : ""}. ${r.nota}`;
  return (
    <div className={cn("space-y-2", className)}>
      {tipos.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-[0.75rem] text-muted-foreground">
          {tipos.map((t, i) => (
            <li key={t} className="flex items-center gap-1.5">
              <svg aria-hidden width={12} height={12} className="overflow-visible"><MarcaDoTipo tipo={i} x={6} y={6} r={4.5} /></svg>{t}
            </li>
          ))}
        </ul>
      )}
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={H} role="img" aria-label={resumo} className="block overflow-visible">
            <FundoDoMapa regioes={regioes} cw={cw} ch={ch} nomes={nomesDasRegioes} />
            <Entrada>
              {[...pontos].sort((a, b) => Number(!!a.destaque) - Number(!!b.destaque)).map((p, i) => {
                const x = p.x * cw, y = p.y * ch;
                const direita = x + 10 + larguraTexto(p.rotulo, 11) < largura;
                return (
                  <g key={p.rotulo + i}>
                    <title>{p.rotulo}{tipos[p.tipo ?? 0] ? ` (${tipos[p.tipo ?? 0]})` : ""}</title>
                    {p.destaque && <circle cx={x} cy={y} r={9} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />}
                    <MarcaDoTipo tipo={p.tipo ?? 0} x={x} y={y} r={p.destaque ? 5.5 : 4.5} />
                    {p.destaque && <text x={direita ? x + 12 : x - 12} y={y + 4} textAnchor={direita ? "start" : "end"} style={HALO} className="fill-foreground text-[11px] font-semibold">{p.rotulo}</text>}
                  </g>
                );
              })}
            </Entrada>
          </svg>
        )}
      </div>
      <p className="text-[0.6875rem] text-muted-foreground">{r.nota}</p>
    </div>
  );
}

/* ── Mapa de bolhas ────────────────────────────────────────────────────────────────────────────────────── */

export type BolhaNoMapa = { rotulo: string; x: number; y: number; valor: number; destaque?: boolean };

export type MapaDeBolhasProps = MapaEsquematicoBase & {
  bolhas: BolhaNoMapa[];
  /** O que o tamanho representa (vai para a nota). */
  rotuloTamanho: string;
  formatar?: Formatador;
};

/**
 * Mapa de bolhas esquemático: uma bolha por lugar, com a área proporcional ao valor. Nome e valor ficam escritos
 * embaixo da bolha, fora dela. Não é mapa em escala e não usa dados geográficos.
 */
export function MapaDeBolhas({ regioes, colunas, linhas, bolhas, rotuloTamanho, formatar = fmtPadrao, altura, nomesDasRegioes = true, rotulo, rotulos, className }: MapaDeBolhasProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const r = { nota: NOTA_MAPA, ...rotulos };
  const { H, cw, ch } = useMapaEsquematico(colunas, linhas, largura, altura);
  const maxV = Math.max(1, ...bolhas.map(b => b.valor));
  const rMax = Math.max(12, Math.min(cw, ch) * 0.3);
  const raio = (v: number) => Math.max(5, Math.sqrt(v / maxV) * rMax);
  const resumo = `${rotulo}: ${[...bolhas].sort((a, b) => b.valor - a.valor).map(b => `${b.rotulo} ${formatar(b.valor)}`).join(", ")}. ${r.nota}`;
  const temDestaque = bolhas.some(b => b.destaque);
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={ref} className="w-full">
        {largura > 0 && (
          <svg width={largura} height={H} role="img" aria-label={resumo} className="block overflow-visible">
            <FundoDoMapa regioes={regioes} cw={cw} ch={ch} nomes={nomesDasRegioes} />
            {[...bolhas].sort((a, b) => b.valor - a.valor).map((b, i) => {
              const x = b.x * cw, y = b.y * ch, rr = raio(b.valor);
              return (
                <g key={b.rotulo}>
                  <title>{`${b.rotulo}: ${formatar(b.valor)}`}</title>
                  <motion.circle cx={x} cy={y} r={rr} fill={b.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} fillOpacity={b.destaque ? 0.38 : 0.2} stroke={b.destaque || !temDestaque ? "var(--chart-1)" : "var(--chart-6)"} strokeWidth={b.destaque ? 2 : 1.25}
                    initial={menos ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    style={{ transformOrigin: `${x}px ${y}px` }} transition={{ duration: 0.45, delay: menos ? 0 : 0.05 * i, ease: [0.22, 1, 0.36, 1] }} />
                  <text x={x} y={y + rr + 13} textAnchor="middle" style={HALO} className="fill-foreground text-[11px]">
                    <tspan className={b.destaque ? "font-semibold" : undefined}>{b.rotulo}</tspan>
                    <tspan dx={4} className="text-[12px] font-bold tabular-nums">{formatar(b.valor)}</tspan>
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
          <span aria-hidden className="flex items-end gap-0.5"><span className="h-2 w-2 rounded-full border border-current" /><span className="h-3.5 w-3.5 rounded-full border border-current" /></span>
          {rotuloTamanho}
        </p>
        <p className="text-[0.6875rem] text-muted-foreground">{r.nota}</p>
      </div>
    </div>
  );
}
