import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronDown, Info, Lightbulb } from "lucide-react";
import { cn } from "./utils";

/**
 * Gráficos do design system: componentes de apresentação (dados entram por props; nada é buscado aqui).
 *
 * Regra de cor (decisão da dona do produto, 19/11/2026): só a cor primária e variações tonais dela
 * (tokens --chart-1 a --chart-5). O grafite (--chart-neutral) aparece só no que não está em destaque
 * ("Outros", contexto, linha de base, desativado), nunca como série par da primária. Grade em --chart-grid.
 * A cor nunca carrega o significado sozinha: todo gráfico escreve rótulos e valores junto das marcas.
 *
 * Os SVGs são desenhados na largura real do contêiner (ResizeObserver), para o texto não encolher no celular.
 * Com "menos movimento", nada anima.
 */

/* ── Cores ─────────────────────────────────────────────────────────────────────────────────────────────── */

/** Tons das séries, na ordem de uso: chart-1 é o destaque (primária); os demais são variações tonais. */
export const CORES_GRAFICO = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"] as const;
/** Grafite: só para o que não está em destaque ("Outros", contexto, desativado). */
export const COR_NEUTRA = "var(--chart-neutral)";
/** Linhas de grade. */
export const COR_GRADE = "var(--chart-grid)";

/**
 * Escala sequencial (do menor para o maior) com a cor de texto que passa no contraste AA em cada tom.
 * A ordem e as cores de texto vêm dos tokens --chart-seq-* de cada DS.
 */
export const ESCALA_SEQUENCIAL = [
  { cor: "var(--chart-seq-1)", texto: "var(--chart-seq-1-texto)" },
  { cor: "var(--chart-seq-2)", texto: "var(--chart-seq-2-texto)" },
  { cor: "var(--chart-seq-3)", texto: "var(--chart-seq-3-texto)" },
  { cor: "var(--chart-seq-4)", texto: "var(--chart-seq-4-texto)" },
] as const;

/** Tons categóricos que aceitam texto por cima (mosaico); a cor do texto vem de cada DS (--chart-N-texto). */
const TONS_COM_TEXTO = [
  { cor: "var(--chart-1)", texto: "var(--chart-1-texto)" },
  { cor: "var(--chart-2)", texto: "var(--chart-2-texto)" },
  { cor: "var(--chart-4)", texto: "var(--chart-4-texto)" },
  { cor: "var(--chart-5)", texto: "var(--chart-5-texto)" },
] as const;
const NEUTRO_COM_TEXTO = { cor: COR_NEUTRA, texto: "var(--foreground)" };

/* ── Utilidades ────────────────────────────────────────────────────────────────────────────────────────── */

export type Formatador = (n: number) => string;

/** Número no formato da localidade (padrão pt-BR), sem casas decimais por padrão. */
export function formatarNumero(n: number, casas = 0, localidade = "pt-BR") {
  return n.toLocaleString(localidade, { maximumFractionDigits: casas, minimumFractionDigits: 0 });
}
/** Percentual já calculado (0 a 100). */
export function formatarPercentual(p: number, casas = 0, localidade = "pt-BR") {
  return `${formatarNumero(p, casas, localidade)}%`;
}

const soma = (xs: number[]) => xs.reduce((s, x) => s + x, 0);

/** Largura real do elemento, atualizada quando muda (0 até medir). */
function useLargura<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [largura, setLargura] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    setLargura(Math.round(el.clientWidth));
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setLargura(Math.round(e!.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, largura] as const;
}

/** Marcas de eixo "redondas" entre 0 (ou mínimo) e o máximo. */
function marcasDoEixo(minimo: number, maximo: number, quantas = 4) {
  const amplitude = Math.max(1e-9, maximo - minimo);
  const passoBruto = amplitude / quantas;
  const mag = Math.pow(10, Math.floor(Math.log10(passoBruto)));
  const passo = [1, 2, 2.5, 5, 10].map(m => m * mag).find(p => p >= passoBruto) ?? 10 * mag;
  const ini = Math.floor(minimo / passo) * passo;
  const fim = Math.ceil(maximo / passo) * passo;
  const marcas: number[] = [];
  for (let v = ini; v <= fim + passo / 2; v += passo) marcas.push(Number(v.toFixed(6)));
  return marcas;
}

/** Afasta rótulos verticais que se sobrepõem (mantém a ordem, distância mínima `gap`). */
function afastar(ys: number[], gap: number, min: number, max: number) {
  const ordem = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  for (let k = 1; k < ordem.length; k++) if (ordem[k]!.y - ordem[k - 1]!.y < gap) ordem[k]!.y = ordem[k - 1]!.y + gap;
  const excesso = ordem.length ? ordem[ordem.length - 1]!.y - max : 0;
  if (excesso > 0) for (const o of ordem) o.y -= excesso;
  for (let k = ordem.length - 2; k >= 0; k--) if (ordem[k + 1]!.y - ordem[k]!.y < gap) ordem[k]!.y = ordem[k + 1]!.y - gap;
  if (ordem.length && ordem[0]!.y < min) { const d = min - ordem[0]!.y; for (const o of ordem) o.y += d; }
  const saida = [...ys];
  for (const o of ordem) saida[o.i] = o.y;
  return saida;
}

/** Largura aproximada de um texto (Plus Jakarta / Inter em px). */
const larguraTexto = (s: string, px = 12) => s.length * px * 0.56;

type Base = {
  /** Nome acessível do gráfico (vira o começo do aria-label). */
  rotulo: string;
  /** Formata os valores escritos junto das marcas. */
  formatar?: Formatador;
  className?: string;
};

const fmtPadrao: Formatador = n => formatarNumero(n);

/* ── Moldura da descoberta (os 4 passos do design de inteligência) ─────────────────────────────────────── */

export type DadosDaTabela = { colunas: string[]; linhas: (string | number)[][] };

/** Tabela de dados (alternativa acessível ao gráfico e detalhamento para quem quer conferir). */
export function TabelaDeDados({ dados, legenda, className }: { dados: DadosDaTabela; legenda?: string; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <table className="w-full table-fixed border-collapse text-left text-[0.8125rem]">
        {legenda && <caption className="sr-only">{legenda}</caption>}
        <thead>
          <tr className="border-b border-border">
            {dados.colunas.map((c, i) => (
              <th key={c} scope="col" className={cn("py-2 pr-2 font-semibold text-muted-foreground", i > 0 && "text-right")}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.linhas.map((l, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {l.map((c, j) =>
                j === 0
                  ? <th key={j} scope="row" className="py-2 pr-2 font-medium text-foreground [overflow-wrap:anywhere]">{c}</th>
                  : <td key={j} className="py-2 pr-2 text-right tabular-nums text-foreground">{c}</td>,
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type DescobertaVisualProps = {
  /** Assunto, em cima do título (ex.: "Buscas"). */
  tema?: string;
  /** 01 · Conclusão em linguagem natural: o que foi descoberto. */
  conclusao: string;
  /** Contexto: comparado com o quê e em qual período. */
  contexto?: string;
  /** 02 · A visualização adequada à pergunta. */
  children: React.ReactNode;
  /** 03 · Por que importa para quem decide. */
  porQueImporta?: string;
  /** 04 · Próximo passo concreto, sem prometer resultado. */
  acao?: string;
  /** Dados do gráfico em tabela ("Ver dados"): detalhamento e alternativa acessível. */
  dados?: DadosDaTabela;
  /** Selo de origem dos dados (ex.: "Dados de exemplo"). */
  selo?: string;
  /** Mostra os números 01 a 04 de cada parte (útil em documentação). */
  numerar?: boolean;
  rotulos?: { porQue?: string; acao?: string; verDados?: string; ocultarDados?: string };
  className?: string;
};

function Passo({ n, mostrar }: { n: string; mostrar?: boolean }) {
  if (!mostrar) return null;
  return <span aria-hidden className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded-sm bg-[var(--primary-muted)] px-1 text-[0.6875rem] font-bold tabular-nums text-[var(--primary-text,var(--primary))]">{n}</span>;
}

/** Card de descoberta: conclusão, gráfico, por que importa, próximo passo e dados (recolhidos). */
export function DescobertaVisual({ tema, conclusao, contexto, children, porQueImporta, acao, dados, selo, numerar, rotulos, className }: DescobertaVisualProps) {
  const [aberto, setAberto] = React.useState(false);
  const id = React.useId();
  const r = { porQue: "Por que importa", acao: "Próximo passo", verDados: "Ver dados", ocultarDados: "Ocultar dados", ...rotulos };
  return (
    <article className={cn("flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 sm:p-6", className)}>
      {(tema || selo) && (
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {tema && <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--primary-text,var(--primary))]">{tema}</p>}
          {selo && <span className="inline-flex h-6 items-center rounded-sm border border-border px-2 text-[0.6875rem] font-medium text-muted-foreground">{selo}</span>}
        </div>
      )}
      <h3 className="flex items-start text-[1.0625rem] font-bold leading-snug tracking-[-0.01em] text-foreground"><Passo n="01" mostrar={numerar} /><span>{conclusao}</span></h3>
      {contexto && <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{contexto}</p>}
      <div className="relative mt-5 min-w-0">
        {numerar && <span className="absolute -top-3 left-0"><Passo n="02" mostrar /></span>}
        <div className={cn(numerar && "pt-4")}>{children}</div>
      </div>
      {(porQueImporta || acao) && (
        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
          {porQueImporta && (
            <div>
              <p className="mb-1 flex items-center text-[0.75rem] font-semibold text-muted-foreground"><Passo n="03" mostrar={numerar} /><Info aria-hidden className="mr-1.5 h-3.5 w-3.5" />{r.porQue}</p>
              <p className="text-[0.8125rem] leading-relaxed text-foreground">{porQueImporta}</p>
            </div>
          )}
          {acao && (
            <div>
              <p className="mb-1 flex items-center text-[0.75rem] font-semibold text-[var(--primary-text,var(--primary))]"><Passo n="04" mostrar={numerar} /><Lightbulb aria-hidden className="mr-1.5 h-3.5 w-3.5" />{r.acao}</p>
              <p className="text-[0.8125rem] leading-relaxed text-foreground">{acao}</p>
            </div>
          )}
        </div>
      )}
      {dados && (
        <div className="mt-4">
          <button
            type="button"
            aria-expanded={aberto}
            aria-controls={id}
            onClick={() => setAberto(v => !v)}
            className="inline-flex items-center gap-1 rounded-sm text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {aberto ? r.ocultarDados : r.verDados}
            <ChevronDown aria-hidden className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", aberto && "rotate-180")} />
          </button>
          <div id={id} hidden={!aberto} className="mt-2 rounded-md bg-muted/50 px-3 py-1">
            <TabelaDeDados dados={dados} legenda={conclusao} />
          </div>
        </div>
      )}
    </article>
  );
}

/* ── Legenda compacta (sempre junto de rótulos diretos, nunca sozinha) ────────────────────────────────── */

export function LegendaDoGrafico({ itens, className }: { itens: { rotulo: string; cor: string; forma?: "ponto" | "linha" | "anel" }[]; className?: string }) {
  return (
    <ul className={cn("m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-[0.75rem] text-muted-foreground", className)}>
      {itens.map(i => (
        <li key={i.rotulo} className="flex items-center gap-1.5">
          {i.forma === "linha"
            ? <span aria-hidden className="inline-block h-[2px] w-3.5 rounded-sm" style={{ background: i.cor }} />
            : i.forma === "anel"
              ? <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full border-2 bg-card" style={{ borderColor: i.cor }} />
              : <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: i.cor }} />}
          {i.rotulo}
        </li>
      ))}
    </ul>
  );
}

/* ── 1. Rosca ──────────────────────────────────────────────────────────────────────────────────────────── */

export type ParteDaRosca = { rotulo: string; valor: number; /** "Outros" e afins: grafite, sempre no fim. */ neutro?: boolean };

export type GraficoDeRoscaProps = Base & {
  partes: ParteDaRosca[];
  /** Texto do centro: o total (quantidade), não o número de partes. */
  centro: { valor: string; rotulo: string };
  /** Escreve a quantidade de cada parte ao lado do percentual na lista. */
  formatarQuantidade?: Formatador;
  localidade?: string;
  /** Lado do desenho em px (padrão 220). */
  tamanho?: number;
};

function arco(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)] as const;
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * Rosca de participação, no traço fino do DS: as partes em destaque em tons da primária (da maior para a menor),
 * "Outros" em grafite no fim, percentuais escritos junto de cada parte e lista com nome, quantidade e percentual.
 * O centro mostra o total. Passar o cursor sobre a lista realça a parte.
 */
export function GraficoDeRosca({ partes, centro, rotulo, formatarQuantidade, localidade = "pt-BR", tamanho = 220, className }: GraficoDeRoscaProps) {
  const menos = useReducedMotion();
  const [ativa, setAtiva] = React.useState<number | null>(null);
  const ordenadas = React.useMemo(() => {
    const destaque = partes.filter(p => !p.neutro).sort((a, b) => b.valor - a.valor);
    const neutras = partes.filter(p => p.neutro);
    return [...destaque, ...neutras].map((p, i) => ({ ...p, cor: p.neutro ? COR_NEUTRA : CORES_GRAFICO[i % CORES_GRAFICO.length]! }));
  }, [partes]);
  const total = soma(ordenadas.map(p => p.valor)) || 1;
  const pct = (v: number) => (v / total) * 100;
  const c = 110, r = 64, espaco = 0.035; // espaço entre partes, em radianos
  let acumulado = 0;
  const fatias = ordenadas.map(p => {
    const a0 = (acumulado / total) * 2 * Math.PI;
    acumulado += p.valor;
    const a1 = (acumulado / total) * 2 * Math.PI;
    const meio = (a0 + a1) / 2;
    return { ...p, a0: a0 + espaco / 2, a1: Math.max(a0 + espaco / 2 + 0.001, a1 - espaco / 2), meio };
  });
  const parteAtiva = ativa != null ? fatias[ativa] : null;
  const resumo = `${rotulo}: ${centro.valor} ${centro.rotulo}. ${fatias.map(f => `${f.rotulo} ${formatarPercentual(pct(f.valor), 0, localidade)}`).join(", ")}.`;

  return (
    <div className={cn("@container", className)}>
    <div className="flex flex-col items-center gap-5 @min-[32rem]:flex-row">
      <svg viewBox="0 0 220 220" width={tamanho} height={tamanho} role="img" aria-label={resumo} className="max-w-full shrink-0 overflow-visible">
        {fatias.map((f, i) => (
          <motion.path
            key={f.rotulo}
            d={arco(c, c, r, f.a0, f.a1)}
            fill="none"
            stroke={f.cor}
            strokeWidth={ativa === i ? 14 : 10}
            style={{ opacity: ativa == null || ativa === i ? 1 : 0.28, transition: menos ? undefined : "opacity 200ms, stroke-width 200ms" }}
            initial={menos ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: menos ? 0 : 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        {fatias.map(f => {
          const p = pct(f.valor);
          if (p < 4) return null;
          const lx = c + 90 * Math.sin(f.meio);
          const ly = c - 90 * Math.cos(f.meio);
          const s = Math.sin(f.meio);
          const ancora = Math.abs(s) < 0.3 ? "middle" : s > 0 ? "start" : "end";
          return (
            <text key={f.rotulo} x={lx} y={ly + 4} textAnchor={ancora} className="fill-foreground text-[12px] font-semibold tabular-nums">
              {formatarPercentual(p, 0, localidade)}
            </text>
          );
        })}
        <text x={c} y={c - 2} textAnchor="middle" className="fill-foreground text-[28px] font-bold tabular-nums tracking-[-0.02em]">
          {parteAtiva ? formatarPercentual(pct(parteAtiva.valor), 0, localidade) : centro.valor}
        </text>
        <text x={c} y={c + 18} textAnchor="middle" className="fill-muted-foreground text-[11px]">
          {parteAtiva ? parteAtiva.rotulo : centro.rotulo}
        </text>
      </svg>
      <ul className="m-0 w-full min-w-0 flex-1 list-none space-y-1 p-0" onMouseLeave={() => setAtiva(null)}>
        {fatias.map((f, i) => (
          <li
            key={f.rotulo}
            onMouseEnter={() => setAtiva(i)}
            className={cn("flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-[0.875rem] transition-colors motion-reduce:transition-none", ativa === i && "bg-muted")}
          >
            <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: f.cor }} />
            <span className={cn("min-w-0 flex-1 leading-snug", f.neutro ? "text-muted-foreground" : "text-foreground")}>{f.rotulo}</span>
            {formatarQuantidade && <span className="shrink-0 text-[0.8125rem] tabular-nums text-muted-foreground">{formatarQuantidade(f.valor)}</span>}
            <span className="w-11 shrink-0 text-right font-semibold tabular-nums text-foreground">{formatarPercentual(pct(f.valor), 0, localidade)}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

/* ── 2. Barras horizontais ordenadas ──────────────────────────────────────────────────────────────────── */

export type BarrasOrdenadasProps = Base & {
  itens: { rotulo: string; valor: number }[];
  /** Quantos itens do topo ficam na primária (os outros em tom claro). Padrão 3. */
  destaques?: number;
  /** Ordena do maior para o menor (padrão: sim). */
  ordenar?: boolean;
  /** Mostra a posição (1º, 2º…) antes do nome. */
  posicao?: boolean;
};

/** Barras horizontais ordenadas, com o nome em cima e o valor escrito no fim de cada barra. */
export function BarrasOrdenadas({ itens, destaques = 3, ordenar = true, posicao = true, rotulo, formatar = fmtPadrao, className }: BarrasOrdenadasProps) {
  const menos = useReducedMotion();
  const lista = ordenar ? [...itens].sort((a, b) => b.valor - a.valor) : itens;
  const maximo = Math.max(1, ...lista.map(i => i.valor));
  const resumo = `${rotulo}: ${lista.map(i => `${i.rotulo} ${formatar(i.valor)}`).join(", ")}.`;
  return (
    <div role="img" aria-label={resumo} className={cn("space-y-3", className)}>
      {lista.map((item, i) => {
        const destaque = i < destaques;
        return (
          <div key={item.rotulo} className="min-w-0">
            <p className={cn("mb-1 text-[0.8125rem] leading-snug", destaque ? "font-semibold text-foreground" : "text-muted-foreground")}>
              {posicao && <span className="mr-1.5 tabular-nums text-muted-foreground">{i + 1}º</span>}{item.rotulo}
            </p>
            <div className="flex items-center gap-2">
              <motion.div
                className="h-2 rounded-sm"
                style={{ width: `calc((100% - 4.5rem) * ${item.valor / maximo})`, background: destaque ? "var(--chart-1)" : "var(--chart-4)", originX: 0 }}
                initial={menos ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: menos ? 0 : 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              />
              <span className={cn("shrink-0 text-[0.8125rem] tabular-nums", destaque ? "font-semibold text-foreground" : "text-muted-foreground")}>{formatar(item.valor)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── 3. Mapa de calor por região (esquemático) ────────────────────────────────────────────────────────── */

export type RegiaoDoMapa = {
  id: string;
  rotulo: string;
  valor: number;
  /** Posição na grade (começa em 1) e tamanho em células. */
  coluna: number;
  linha: number;
  largura?: number;
  altura?: number;
};

export type MapaDeCalorPorRegiaoProps = Base & {
  regioes: RegiaoDoMapa[];
  colunas: number;
  linhas: number;
  /** Região contornada (a descoberta). */
  destaque?: string;
  rotulos?: { menos?: string; mais?: string; nota?: string };
};

/** Faixa da escala sequencial (0 a 3) para um valor. */
function faixa(v: number, min: number, max: number) {
  if (max <= min) return ESCALA_SEQUENCIAL.length - 1;
  return Math.min(ESCALA_SEQUENCIAL.length - 1, Math.floor(((v - min) / (max - min)) * ESCALA_SEQUENCIAL.length));
}

function LegendaSequencial({ menos, mais }: { menos: string; mais: string }) {
  return (
    <div aria-hidden className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
      <span>{menos}</span>
      <span className="flex gap-0.5">
        {ESCALA_SEQUENCIAL.map(e => <span key={e.cor} className="h-2.5 w-6 rounded-[3px]" style={{ background: e.cor }} />)}
      </span>
      <span>{mais}</span>
    </div>
  );
}

/**
 * Mapa de calor esquemático: cada região é um bloco numa grade, na posição aproximada (não é mapa em escala).
 * As posições vêm por props; nada de dados geográficos é buscado. Nome e valor ficam escritos em cada bloco.
 */
export function MapaDeCalorPorRegiao({ regioes, colunas, linhas, destaque, rotulo, formatar = fmtPadrao, rotulos, className }: MapaDeCalorPorRegiaoProps) {
  const menos = useReducedMotion();
  const r = { menos: "Menos", mais: "Mais", nota: "Mapa esquemático: cada bloco é uma região, em posição aproximada, sem escala.", ...rotulos };
  const valores = regioes.map(x => x.valor);
  const min = Math.min(...valores), max = Math.max(...valores);
  const resumo = `${rotulo}: ${[...regioes].sort((a, b) => b.valor - a.valor).map(x => `${x.rotulo} ${formatar(x.valor)}`).join(", ")}.`;
  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="img"
        aria-label={resumo}
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${linhas}, minmax(4.25rem, auto))` }}
      >
        {regioes.map((x, i) => {
          const e = ESCALA_SEQUENCIAL[faixa(x.valor, min, max)]!;
          return (
            <motion.div
              key={x.id}
              title={`${x.rotulo}: ${formatar(x.valor)}`}
              className={cn(
                "flex min-w-0 flex-col justify-between rounded-sm p-2 transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                destaque === x.id && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
              )}
              style={{ gridColumn: `${x.coluna} / span ${x.largura ?? 1}`, gridRow: `${x.linha} / span ${x.altura ?? 1}`, background: e.cor, color: e.texto }}
              initial={menos ? false : { opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: menos ? 0 : 0.03 * i }}
            >
              <span className="text-[0.6875rem] font-semibold leading-tight [overflow-wrap:anywhere]">{x.rotulo}</span>
              <span className="text-[0.9375rem] font-bold tabular-nums leading-none">{formatar(x.valor)}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <LegendaSequencial menos={r.menos} mais={r.mais} />
        <p className="text-[0.6875rem] text-muted-foreground">{r.nota}</p>
      </div>
    </div>
  );
}

/* ── 4. Halteres (dumbbell): duas medidas lado a lado ─────────────────────────────────────────────────── */

export type GraficoDeHalteresProps = Base & {
  itens: { rotulo: string; a: number; b: number }[];
  /** Nomes das duas medidas: [a, b]. "b" é a medida em destaque (primária). */
  series: [string, string];
  /** Máximo do eixo (padrão: o maior valor). */
  maximo?: number;
  /** Texto da diferença ao lado do nome (ex.: d => `+${d} pontos`). */
  formatarDiferenca?: (diferenca: number) => string;
};

/** Halteres: para cada item, um ponto para cada medida ligados por uma linha; os valores ficam escritos nos pontos. */
export function GraficoDeHalteres({ itens, series, maximo, rotulo, formatar = fmtPadrao, formatarDiferenca, className }: GraficoDeHalteresProps) {
  const menos = useReducedMotion();
  const max = maximo ?? Math.max(1, ...itens.flatMap(i => [i.a, i.b]));
  const pos = (v: number) => `${(v / max) * 100}%`;
  const resumo = `${rotulo}: ${itens.map(i => `${i.rotulo}, ${series[0]} ${formatar(i.a)}, ${series[1]} ${formatar(i.b)}`).join("; ")}.`;
  return (
    <div className={cn("space-y-4", className)}>
      <LegendaDoGrafico itens={[{ rotulo: series[0], cor: "var(--chart-4)", forma: "anel" }, { rotulo: series[1], cor: "var(--chart-1)" }]} />
      <div role="img" aria-label={resumo} className="space-y-3.5">
        {itens.map((item, i) => {
          const menor = Math.min(item.a, item.b), maior = Math.max(item.a, item.b);
          const aEsquerda = item.a <= item.b;
          const dif = item.b - item.a;
          return (
            <div key={item.rotulo}>
              <div className="flex items-baseline justify-between gap-3 text-[0.8125rem]">
                <span className="min-w-0 font-medium text-foreground">{item.rotulo}</span>
                {formatarDiferenca && <span className={cn("shrink-0 tabular-nums", dif > 0 ? "font-semibold text-[var(--primary-text,var(--primary))]" : "text-muted-foreground")}>{formatarDiferenca(dif)}</span>}
              </div>
              <div className="px-10">
                <div className="relative h-6">
                  <span aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2" style={{ background: COR_GRADE }} />
                  <motion.span
                    aria-hidden
                    className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-sm"
                    style={{ left: pos(menor), width: `${((maior - menor) / max) * 100}%`, background: COR_NEUTRA, originX: aEsquerda ? 0 : 1 }}
                    initial={menos ? false : { scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: menos ? 0 : 0.06 * i }}
                  />
                  {/* a: anel em tom claro */}
                  <span aria-hidden className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-card" style={{ left: pos(item.a), borderColor: "var(--chart-4)" }} />
                  {/* b: ponto cheio na primária */}
                  <span aria-hidden className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: pos(item.b), background: "var(--chart-1)" }} />
                  <span aria-hidden className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.75rem] tabular-nums text-muted-foreground"
                    style={aEsquerda ? { right: `calc(100% - ${pos(item.a)} + 0.6rem)` } : { left: `calc(${pos(item.a)} + 0.6rem)` }}>
                    {formatar(item.a)}
                  </span>
                  <span aria-hidden className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.75rem] font-semibold tabular-nums text-foreground"
                    style={aEsquerda ? { left: `calc(${pos(item.b)} + 0.6rem)` } : { right: `calc(100% - ${pos(item.b)} + 0.6rem)` }}>
                    {formatar(item.b)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 5. Linhas ou área (tendência no tempo) ───────────────────────────────────────────────────────────── */

export type SerieDeLinha = { rotulo: string; valores: number[]; destaque?: boolean };

export type GraficoDeLinhasProps = Base & {
  series: SerieDeLinha[];
  rotulosX: string[];
  /** Preenche a área abaixo da série em destaque. */
  area?: boolean;
  altura?: number;
  /** Começa o eixo em zero (padrão: sim). */
  zero?: boolean;
};

/** Linhas finas com o nome e o último valor escritos no fim de cada linha; passe o cursor para ler cada ponto. */
export function GraficoDeLinhas({ series, rotulosX, area, altura = 240, zero = true, rotulo, formatar = fmtPadrao, className }: GraficoDeLinhasProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [indice, setIndice] = React.useState<number | null>(null);
  const idGrad = React.useId().replace(/:/g, "");
  const temDestaque = series.some(s => s.destaque);
  const outras = ["var(--chart-4)", "var(--chart-5)", "var(--chart-3)", "var(--chart-2)"];
  let k = 0;
  const cores = series.map((s, i) => (temDestaque ? (s.destaque ? "var(--chart-1)" : outras[k++ % outras.length]!) : CORES_GRAFICO[i % 5]!));
  const todos = series.flatMap(s => s.valores);
  const marcas = marcasDoEixo(zero ? 0 : Math.min(...todos), Math.max(...todos), 4);
  const yMin = marcas[0]!, yMax = marcas[marcas.length - 1]!;
  const larguraRotulo = Math.min(120, Math.max(...series.map(s => Math.max(larguraTexto(s.rotulo, 11), larguraTexto(formatar(s.valores[s.valores.length - 1] ?? 0), 12)))) + 12);
  const m = { t: 12, r: larguraRotulo, b: 26, l: Math.max(28, ...marcas.map(v => larguraTexto(formatar(v), 11) + 8)) };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const n = rotulosX.length;
  const x = (i: number) => m.l + (n <= 1 ? 0 : (i / (n - 1)) * w);
  const y = (v: number) => m.t + h - ((v - yMin) / (yMax - yMin || 1)) * h;
  const caminho = (vs: number[]) => vs.map((v, i) => `${i ? "L" : "M"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const passoX = Math.max(1, Math.ceil((n * 54) / Math.max(1, w)));
  const finais = afastar(series.map(s => y(s.valores[s.valores.length - 1] ?? 0)), 28, m.t + 6, m.t + h - 4);
  const resumo = `${rotulo}: ${series.map(s => `${s.rotulo} de ${formatar(s.valores[0] ?? 0)} em ${rotulosX[0]} para ${formatar(s.valores[s.valores.length - 1] ?? 0)} em ${rotulosX[n - 1]}`).join("; ")}.`;

  const aoMover = (e: React.PointerEvent<SVGRectElement>) => {
    const caixa = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    const px = e.clientX - caixa.left;
    setIndice(Math.max(0, Math.min(n - 1, Math.round(((px - m.l) / (w || 1)) * (n - 1)))));
  };

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <defs>
            <linearGradient id={idGrad} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          {marcas.map(v => (
            <g key={v}>
              <line x1={m.l} x2={m.l + w} y1={y(v)} y2={y(v)} stroke={COR_GRADE} strokeWidth={1} />
              <text x={m.l - 8} y={y(v) + 4} textAnchor="end" className="fill-muted-foreground text-[11px] tabular-nums">{formatar(v)}</text>
            </g>
          ))}
          {rotulosX.map((r, i) => (i % passoX === 0 || i === n - 1) && (i === n - 1 || n - 1 - i >= passoX) ? (
            <text key={r + i} x={x(i)} y={altura - 6} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px]">{r}</text>
          ) : null)}
          {series.map((s, si) => s.destaque && area ? (
            <motion.path key={"a" + s.rotulo} d={`${caminho(s.valores)} L ${x(s.valores.length - 1)} ${m.t + h} L ${x(0)} ${m.t + h} Z`} fill={`url(#${idGrad})`}
              initial={menos ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: menos ? 0 : 0.3 + si * 0.05 }} />
          ) : null)}
          {/* séries sem destaque primeiro, para o destaque ficar por cima */}
          {series.map((s, si) => ({ s, si })).sort((a, b) => Number(!!a.s.destaque) - Number(!!b.s.destaque)).map(({ s, si }) => (
            <motion.path key={s.rotulo} d={caminho(s.valores)} fill="none" stroke={cores[si]} strokeWidth={s.destaque || !temDestaque ? 2 : 1.5} strokeLinejoin="round" strokeLinecap="round"
              initial={menos ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: menos ? 0 : si * 0.08, ease: [0.22, 1, 0.36, 1] }} />
          ))}
          {series.map((s, si) => {
            const ult = s.valores.length - 1;
            const yy = finais[si]!;
            return (
              <g key={"r" + s.rotulo}>
                <circle cx={x(ult)} cy={y(s.valores[ult] ?? 0)} r={3} fill={cores[si]} />
                <text x={x(ult) + 10} y={yy - 2} className={cn("text-[11px]", s.destaque ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{s.rotulo}</text>
                <text x={x(ult) + 10} y={yy + 12} className={cn("text-[12px] tabular-nums", s.destaque ? "fill-foreground font-bold" : "fill-muted-foreground")}>{formatar(s.valores[ult] ?? 0)}</text>
              </g>
            );
          })}
          {indice != null && (
            <g aria-hidden>
              <line x1={x(indice)} x2={x(indice)} y1={m.t} y2={m.t + h} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
              {series.map((s, si) => <circle key={s.rotulo} cx={x(indice)} cy={y(s.valores[indice] ?? 0)} r={4} fill="var(--card)" stroke={cores[si]} strokeWidth={2} />)}
            </g>
          )}
          <rect x={m.l} y={m.t} width={w} height={h} fill="transparent" onPointerMove={aoMover} onPointerLeave={() => setIndice(null)} />
        </svg>
      )}
      {indice != null && largura > 0 && (
        <div aria-hidden className="pointer-events-none absolute top-0 z-10 rounded-md border border-border bg-card px-2.5 py-1.5 text-[0.75rem] shadow-md"
          style={{ left: Math.min(Math.max(0, x(indice) - 70), largura - 150), width: 140 }}>
          <p className="mb-0.5 font-semibold text-foreground">{rotulosX[indice]}</p>
          {series.map((s, si) => (
            <p key={s.rotulo} className="flex items-center justify-between gap-2 text-muted-foreground">
              <span className="flex min-w-0 items-center gap-1.5"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cores[si] }} /><span className="truncate">{s.rotulo}</span></span>
              <span className="tabular-nums text-foreground">{formatar(s.valores[indice] ?? 0)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 6. Inclinação (slope): antes e depois ─────────────────────────────────────────────────────────────── */

export type GraficoDeInclinacaoProps = Base & {
  itens: { rotulo: string; inicio: number; fim: number }[];
  periodos: [string, string];
  /** Itens em destaque (pelo nome). Padrão: os 2 que mais cresceram em proporção. */
  destaques?: string[];
  altura?: number;
};

/** Duas colunas (antes e agora) ligadas por linhas: o destaque na primária, o restante em grafite como contexto. */
export function GraficoDeInclinacao({ itens, periodos, destaques, altura = 260, rotulo, formatar = fmtPadrao, className }: GraficoDeInclinacaoProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const emDestaque = destaques ?? [...itens].sort((a, b) => b.fim / (b.inicio || 1) - a.fim / (a.inicio || 1)).slice(0, 2).map(i => i.rotulo);
  const todos = itens.flatMap(i => [i.inicio, i.fim]);
  const min = Math.min(...todos), max = Math.max(...todos);
  const larguraDireita = Math.min(150, Math.max(...itens.map(i => larguraTexto(`${formatar(i.fim)}  ${i.rotulo}`, 12))) + 12);
  const m = { t: 28, b: 10, l: Math.max(...itens.map(i => larguraTexto(formatar(i.inicio), 12))) + 14, r: larguraDireita };
  const x0 = m.l, x1 = Math.max(m.l + 60, largura - m.r);
  const h = altura - m.t - m.b;
  const y = (v: number) => m.t + h - ((v - min) / (max - min || 1)) * h;
  const ysIni = afastar(itens.map(i => y(i.inicio)), 16, m.t, m.t + h);
  const ysFim = afastar(itens.map(i => y(i.fim)), 16, m.t, m.t + h);
  const ordem = itens.map((it, i) => ({ it, i })).sort((a, b) => Number(emDestaque.includes(a.it.rotulo)) - Number(emDestaque.includes(b.it.rotulo)));
  const resumo = `${rotulo}: ${itens.map(i => `${i.rotulo} de ${formatar(i.inicio)} para ${formatar(i.fim)}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          <text x={x0} y={12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-[0.06em]">{periodos[0]}</text>
          <text x={x1} y={12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-semibold uppercase tracking-[0.06em]">{periodos[1]}</text>
          <line x1={x0} x2={x0} y1={m.t - 6} y2={m.t + h + 4} stroke={COR_GRADE} />
          <line x1={x1} x2={x1} y1={m.t - 6} y2={m.t + h + 4} stroke={COR_GRADE} />
          {ordem.map(({ it, i }) => {
            const d = emDestaque.includes(it.rotulo);
            const cor = d ? "var(--chart-1)" : COR_NEUTRA;
            return (
              <g key={it.rotulo}>
                <motion.line x1={x0} y1={y(it.inicio)} x2={x1} y2={y(it.fim)} stroke={cor} strokeWidth={d ? 2 : 1.25} strokeLinecap="round"
                  initial={menos ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: menos ? 0 : 0.05 * i }} />
                <circle cx={x0} cy={y(it.inicio)} r={d ? 3.5 : 2.5} fill={cor} />
                <circle cx={x1} cy={y(it.fim)} r={d ? 3.5 : 2.5} fill={cor} />
                <text x={x0 - 8} y={ysIni[i]! + 4} textAnchor="end" className={cn("text-[12px] tabular-nums", d ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{formatar(it.inicio)}</text>
                <text x={x1 + 8} y={ysFim[i]! + 4} className={cn("text-[12px]", d ? "fill-foreground font-semibold" : "fill-muted-foreground")}>
                  <tspan className="tabular-nums">{formatar(it.fim)}</tspan><tspan dx={6}>{it.rotulo}</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ── 7. Mosaico (treemap) ─────────────────────────────────────────────────────────────────────────────── */

type Ret = { x: number; y: number; w: number; h: number };

function pior(linha: number[], lado: number) {
  const s = soma(linha), mx = Math.max(...linha), mn = Math.min(...linha);
  return Math.max((lado * lado * mx) / (s * s), (s * s) / (lado * lado * mn));
}
function colocarLinha(linha: number[], r: Ret): { rets: Ret[]; resto: Ret } {
  const s = soma(linha);
  if (r.w >= r.h) {
    const lw = s / r.h;
    let yy = r.y;
    return { rets: linha.map(a => { const q = { x: r.x, y: yy, w: lw, h: a / lw }; yy += a / lw; return q; }), resto: { x: r.x + lw, y: r.y, w: r.w - lw, h: r.h } };
  }
  const lh = s / r.w;
  let xx = r.x;
  return { rets: linha.map(a => { const q = { x: xx, y: r.y, w: a / lh, h: lh }; xx += a / lh; return q; }), resto: { x: r.x, y: r.y + lh, w: r.w, h: r.h - lh } };
}
/** Layout "squarified" (Bruls, Huizing e van Wijk): retângulos o mais quadrados possível. */
function squarify(areas: number[], r: Ret): Ret[] {
  const saida: Ret[] = [];
  let linha: number[] = [], i = 0, atual = r;
  while (i < areas.length) {
    const lado = Math.min(atual.w, atual.h);
    const a = areas[i]!;
    if (linha.length === 0 || pior([...linha, a], lado) <= pior(linha, lado)) { linha.push(a); i++; }
    else { const { rets, resto } = colocarLinha(linha, atual); saida.push(...rets); atual = resto; linha = []; }
  }
  if (linha.length) saida.push(...colocarLinha(linha, atual).rets);
  return saida;
}

export type MosaicoProps = Base & {
  itens: { rotulo: string; valor: number; neutro?: boolean }[];
  altura?: number;
  localidade?: string;
};

/**
 * Mosaico (treemap): a área de cada bloco é a fatia do total. Os 4 maiores em tons da primária,
 * o restante em grafite; nome e percentual escritos dentro do bloco quando cabem (com contraste AA).
 */
export function Mosaico({ itens, altura = 260, rotulo, localidade = "pt-BR", className }: MosaicoProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const lista = [...itens].sort((a, b) => Number(!!a.neutro) - Number(!!b.neutro) || b.valor - a.valor);
  const total = soma(lista.map(i => i.valor)) || 1;
  const rets = largura > 0 ? squarify(lista.map(i => (i.valor / total) * largura * altura), { x: 0, y: 0, w: largura, h: altura }) : [];
  let k = 0;
  const tons = lista.map(i => (i.neutro || k >= TONS_COM_TEXTO.length ? NEUTRO_COM_TEXTO : TONS_COM_TEXTO[k++]!));
  const resumo = `${rotulo}: ${lista.map(i => `${i.rotulo} ${formatarPercentual((i.valor / total) * 100, 0, localidade)}`).join(", ")}.`;
  return (
    <div ref={ref} role="img" aria-label={resumo} className={cn("relative w-full", className)} style={{ height: altura }}>
      {rets.map((r, i) => {
        const item = lista[i]!;
        const t = tons[i]!;
        const p = formatarPercentual((item.valor / total) * 100, 0, localidade);
        const maiorPalavra = Math.max(...item.rotulo.split(/\s+/).map(w => larguraTexto(w, 12)));
        const cabeNome = r.w >= maiorPalavra + 18 && r.h >= 44;
        const cabePct = r.w >= 34 && r.h >= 22;
        return (
          <motion.div
            key={item.rotulo}
            title={`${item.rotulo}: ${p}`}
            className="absolute overflow-hidden rounded-sm p-2 transition-[filter] duration-200 hover:brightness-95 motion-reduce:transition-none"
            style={{ left: r.x + 1, top: r.y + 1, width: Math.max(0, r.w - 2), height: Math.max(0, r.h - 2), background: t.cor, color: t.texto }}
            initial={menos ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: menos ? 0 : 0.04 * i }}
          >
            {cabeNome && <p className="text-[0.75rem] font-semibold leading-tight">{item.rotulo}</p>}
            {cabePct && <p className={cn("tabular-nums leading-tight", cabeNome ? "mt-0.5 text-[0.8125rem] font-bold" : "text-[0.6875rem] font-semibold")}>{p}</p>}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── 8. Barras 100% empilhadas ────────────────────────────────────────────────────────────────────────── */

export type BarrasEmpilhadas100Props = Base & {
  categorias: { rotulo: string; neutro?: boolean }[];
  /** Uma linha por grupo; `valores` na ordem de `categorias`. */
  linhas: { rotulo: string; valores: number[] }[];
  /** Percentual mínimo para escrever o valor em cima da parte (padrão 9). */
  minimoParaRotulo?: number;
  localidade?: string;
};

/** Barras 100%: cada linha soma 100%; o percentual de cada parte fica escrito logo acima dela. */
export function BarrasEmpilhadas100({ categorias, linhas, minimoParaRotulo = 9, rotulo, localidade = "pt-BR", className }: BarrasEmpilhadas100Props) {
  const menos = useReducedMotion();
  let k = 0;
  const cores = categorias.map(c => (c.neutro ? COR_NEUTRA : CORES_GRAFICO[k++ % 5]!));
  const resumo = `${rotulo}: ${linhas.map(l => { const t = soma(l.valores) || 1; return `${l.rotulo}: ${l.valores.map((v, i) => `${categorias[i]?.rotulo} ${formatarPercentual((v / t) * 100, 0, localidade)}`).join(", ")}`; }).join("; ")}.`;
  return (
    <div className={cn("space-y-4", className)}>
      <LegendaDoGrafico itens={categorias.map((c, i) => ({ rotulo: c.rotulo, cor: cores[i]! }))} />
      <div role="img" aria-label={resumo} className="space-y-3">
        {linhas.map((l, li) => {
          const t = soma(l.valores) || 1;
          return (
            <div key={l.rotulo}>
              <p className="mb-1 text-[0.8125rem] font-medium text-foreground">{l.rotulo}</p>
              <div className="flex gap-[2px]" aria-hidden>
                {l.valores.map((v, i) => (
                  <span key={i} className="min-w-0 text-center text-[0.75rem] font-semibold tabular-nums text-foreground" style={{ flex: `${v} 1 0` }}>
                    {(v / t) * 100 >= minimoParaRotulo ? formatarPercentual((v / t) * 100, 0, localidade) : ""}
                  </span>
                ))}
              </div>
              <motion.div className="mt-0.5 flex h-3 gap-[2px] overflow-hidden rounded-sm" style={{ originX: 0 }}
                initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: menos ? 0 : 0.08 * li, ease: [0.22, 1, 0.36, 1] }}>
                {l.valores.map((v, i) => <span key={i} className="block h-full min-w-0" style={{ flex: `${v} 1 0`, background: cores[i] }} />)}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 9. Bolhas ────────────────────────────────────────────────────────────────────────────────────────── */

export type BolhaDoGrafico = { rotulo: string; x: number; y: number; tamanho: number; destaque?: boolean };

export type GraficoDeBolhasProps = Base & {
  itens: BolhaDoGrafico[];
  eixoX: { rotulo: string; formatar?: Formatador };
  eixoY: { rotulo: string; formatar?: Formatador };
  /** O que o tamanho do círculo representa (vai para a nota abaixo do gráfico). */
  rotuloTamanho: string;
  formatarTamanho?: Formatador;
  altura?: number;
};

/** Bolhas: posição em dois eixos e tamanho como terceira medida. Destaques na primária; o restante em grafite. */
export function GraficoDeBolhas({ itens, eixoX, eixoY, rotuloTamanho, formatarTamanho = fmtPadrao, altura = 300, rotulo, className }: GraficoDeBolhasProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const fx = eixoX.formatar ?? fmtPadrao, fy = eixoY.formatar ?? fmtPadrao;
  const xs = itens.map(i => i.x), ys = itens.map(i => i.y), ts = itens.map(i => i.tamanho);
  const mx = marcasDoEixo(Math.min(...xs) * 0.8, Math.max(...xs) * 1.08, 4);
  const my = marcasDoEixo(0, Math.max(...ys) * 1.12, 4);
  const m = { t: 22, r: 12, b: 36, l: Math.max(...my.map(v => larguraTexto(fy(v), 11))) + 12 };
  const w = Math.max(0, largura - m.l - m.r), h = altura - m.t - m.b;
  const X = (v: number) => m.l + ((v - mx[0]!) / (mx[mx.length - 1]! - mx[0]! || 1)) * w;
  const Y = (v: number) => m.t + h - ((v - my[0]!) / (my[my.length - 1]! - my[0]! || 1)) * h;
  const rMax = Math.max(12, Math.min(26, w / 12)), tMax = Math.max(...ts);
  const R = (t: number) => Math.max(5, Math.sqrt(t / tMax) * rMax);
  const passoX = Math.max(1, Math.ceil((mx.length * 58) / Math.max(1, w)));
  const resumo = `${rotulo}: ${itens.map(i => `${i.rotulo}, ${eixoX.rotulo} ${fx(i.x)}, ${eixoY.rotulo} ${fy(i.y)}, ${rotuloTamanho} ${formatarTamanho(i.tamanho)}`).join("; ")}.`;
  return (
    <div className={cn("space-y-2", className)}>
      <div ref={ref} className="w-full">
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
            {[...itens].sort((a, b) => Number(!!a.destaque) - Number(!!b.destaque) || b.tamanho - a.tamanho).map((b, i) => {
              const cor = b.destaque ? "var(--chart-1)" : COR_NEUTRA;
              const cx = X(b.x), cy = Y(b.y), r = R(b.tamanho);
              const direita = cx + r + 6 + larguraTexto(b.rotulo, 11) < m.l + w + m.r;
              return (
                <g key={b.rotulo} className="group">
                  <title>{`${b.rotulo}: ${eixoX.rotulo} ${fx(b.x)}, ${eixoY.rotulo} ${fy(b.y)}, ${rotuloTamanho} ${formatarTamanho(b.tamanho)}`}</title>
                  <motion.circle cx={cx} cy={cy} r={r} fill={cor} fillOpacity={b.destaque ? 0.22 : 0.28} stroke={cor} strokeWidth={1.5}
                    className="transition-[fill-opacity] duration-200 group-hover:[fill-opacity:0.45] motion-reduce:transition-none"
                    initial={menos ? false : { scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }} transition={{ duration: 0.45, delay: menos ? 0 : 0.05 * i, ease: [0.22, 1, 0.36, 1] }} />
                  <text x={direita ? cx + r + 5 : cx - r - 5} y={cy + 4} textAnchor={direita ? "start" : "end"}
                    className={cn("text-[11px]", b.destaque ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{b.rotulo}</text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
      <p className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
        <span aria-hidden className="flex items-end gap-0.5"><span className="h-2 w-2 rounded-full border border-current" /><span className="h-3.5 w-3.5 rounded-full border border-current" /></span>
        {rotuloTamanho}
      </p>
    </div>
  );
}

/* ── 10. Mapa de calor em matriz ──────────────────────────────────────────────────────────────────────── */

export type MapaDeCalorMatricialProps = Base & {
  linhas: string[];
  colunas: string[];
  /** valores[linha][coluna] */
  valores: number[][];
  /** Texto do canto da tabela (o que as linhas são). */
  rotuloLinhas?: string;
  /** Célula em destaque: [linha, coluna]. */
  destaque?: [number, number];
  rotulos?: { menos?: string; mais?: string };
};

/** Matriz com a cor de cada célula pela escala sequencial e o valor escrito nela. É uma tabela de verdade. */
export function MapaDeCalorMatricial({ linhas, colunas, valores, rotuloLinhas = "", destaque, rotulo, formatar = fmtPadrao, rotulos, className }: MapaDeCalorMatricialProps) {
  const menos = useReducedMotion();
  const r = { menos: "Menos", mais: "Mais", ...rotulos };
  const todos = valores.flat();
  const min = Math.min(...todos), max = Math.max(...todos);
  return (
    <div className={cn("space-y-3", className)}>
      <table className="w-full table-fixed border-separate border-spacing-[3px] text-[0.8125rem]">
        <caption className="sr-only">{rotulo}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-[30%] pb-1 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{rotuloLinhas}</th>
            {colunas.map(c => <th key={c} scope="col" className="pb-1 text-center text-[0.75rem] font-semibold leading-tight text-muted-foreground [overflow-wrap:anywhere]">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, li) => (
            <tr key={l}>
              <th scope="row" className="pr-1 text-left text-[0.8125rem] font-medium leading-tight text-foreground [overflow-wrap:anywhere]">{l}</th>
              {colunas.map((c, ci) => {
                const v = valores[li]?.[ci] ?? 0;
                const e = ESCALA_SEQUENCIAL[faixa(v, min, max)]!;
                const marcado = destaque && destaque[0] === li && destaque[1] === ci;
                return (
                  <motion.td key={c} className={cn("h-11 rounded-sm text-center font-semibold tabular-nums", marcado && "outline outline-2 outline-offset-1 outline-foreground")}
                    style={{ background: e.cor, color: e.texto }}
                    initial={menos ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: menos ? 0 : 0.02 * (li * colunas.length + ci) }}>
                    {formatar(v)}
                  </motion.td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <LegendaSequencial menos={r.menos} mais={r.mais} />
    </div>
  );
}

/* ── 11. Ranking ao longo do tempo (bump chart) ───────────────────────────────────────────────────────── */

export type GraficoDeRankingProps = Base & {
  /** posicoes[i] = posição no período i (1 = primeiro lugar). */
  series: { rotulo: string; posicoes: number[]; destaque?: boolean }[];
  periodos: string[];
  /** Escreve a posição (ex.: p => `${p}º`). */
  formatarPosicao?: (p: number) => string;
};

/** Bump chart: como a posição de cada item muda ao longo dos períodos. Destaques na primária, o restante em grafite. */
export function GraficoDeRanking({ series, periodos, rotulo, formatarPosicao = p => `${p}º`, className }: GraficoDeRankingProps) {
  const menos = useReducedMotion();
  const [ref, largura] = useLargura<HTMLDivElement>();
  const [ativa, setAtiva] = React.useState<string | null>(null);
  const n = periodos.length;
  const total = Math.max(...series.flatMap(s => s.posicoes));
  const linhaH = 38;
  const m = { t: 26, b: 8, l: 30, r: Math.min(130, Math.max(...series.map(s => larguraTexto(s.rotulo, 12))) + 16) };
  const altura = m.t + (total - 1) * linhaH + m.b + 12;
  const w = Math.max(0, largura - m.l - m.r);
  const X = (i: number) => m.l + (n <= 1 ? 0 : (i / (n - 1)) * w);
  const Y = (p: number) => m.t + 6 + (p - 1) * linhaH;
  const curva = (ps: number[]) => ps.map((p, i) => {
    if (i === 0) return `M ${X(0)} ${Y(p)}`;
    const xa = X(i - 1), xb = X(i), meio = (xa + xb) / 2;
    return `C ${meio} ${Y(ps[i - 1]!)} ${meio} ${Y(p)} ${xb} ${Y(p)}`;
  }).join(" ");
  let kd = 0;
  const cores = series.map(s => (s.destaque ? (kd++ === 0 ? "var(--chart-1)" : "var(--chart-4)") : COR_NEUTRA));
  const passo = Math.max(1, Math.ceil((n * 44) / Math.max(1, w)));
  const ordem = series.map((s, i) => ({ s, i })).sort((a, b) => Number(!!a.s.destaque) - Number(!!b.s.destaque));
  const resumo = `${rotulo}: ${series.map(s => `${s.rotulo} de ${formatarPosicao(s.posicoes[0]!)} em ${periodos[0]} para ${formatarPosicao(s.posicoes[n - 1]!)} em ${periodos[n - 1]}`).join("; ")}.`;
  return (
    <div ref={ref} className={cn("w-full", className)} onMouseLeave={() => setAtiva(null)}>
      {largura > 0 && (
        <svg width={largura} height={altura} role="img" aria-label={resumo} className="block overflow-visible">
          {periodos.map((p, i) => (i % passo === 0 || i === n - 1) && (i === n - 1 || n - 1 - i >= passo) ? (
            <text key={p + i} x={X(i)} y={11} textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"} className="fill-muted-foreground text-[11px]">{p}</text>
          ) : null)}
          {Array.from({ length: total }, (_, k) => (
            <text key={k} x={0} y={Y(k + 1) + 4} className="fill-muted-foreground text-[11px] tabular-nums">{formatarPosicao(k + 1)}</text>
          ))}
          {ordem.map(({ s, i }) => {
            const apagada = ativa != null && ativa !== s.rotulo;
            const d = !!s.destaque;
            const fim = s.posicoes[n - 1]!;
            return (
              <g key={s.rotulo} onMouseEnter={() => setAtiva(s.rotulo)} style={{ opacity: apagada ? 0.25 : 1, transition: menos ? undefined : "opacity 200ms" }}>
                <motion.path d={curva(s.posicoes)} fill="none" stroke={cores[i]} strokeWidth={d ? 2.5 : 1.5} strokeLinecap="round"
                  initial={menos ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: menos ? 0 : 0.06 * i }} />
                {s.posicoes.map((p, pi) => <circle key={pi} cx={X(pi)} cy={Y(p)} r={d ? 4 : 3} fill={d ? cores[i] : "var(--card)"} stroke={cores[i]} strokeWidth={1.5} />)}
                <text x={X(n - 1) + 10} y={Y(fim) + 4} className={cn("text-[12px]", d ? "fill-foreground font-semibold" : "fill-muted-foreground")}>{s.rotulo}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

/* ── 12. Funil ────────────────────────────────────────────────────────────────────────────────────────── */

export type FunilProps = Base & {
  etapas: { rotulo: string; valor: number }[];
  /** Marca a passagem com a maior perda (padrão: sim). */
  destacarMaiorPerda?: boolean;
  localidade?: string;
  rotulos?: {
    /** Texto entre etapas: recebe o percentual que seguiu. */
    seguiram?: (pct: string) => string;
    maiorPerda?: string;
  };
};

/** Funil: etapas da jornada com o valor escrito e, entre elas, quanto seguiu para a próxima. A maior perda fica marcada. */
export function Funil({ etapas, destacarMaiorPerda = true, rotulo, formatar = fmtPadrao, localidade = "pt-BR", rotulos, className }: FunilProps) {
  const menos = useReducedMotion();
  const r = { seguiram: (p: string) => `${p} seguiram`, maiorPerda: "Maior perda", ...rotulos };
  const max = Math.max(1, ...etapas.map(e => e.valor));
  const taxas = etapas.slice(1).map((e, i) => e.valor / (etapas[i]!.valor || 1));
  const piorPassagem = destacarMaiorPerda && taxas.length ? taxas.indexOf(Math.min(...taxas)) : -1;
  const tons = ["var(--chart-1)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
  const resumo = `${rotulo}: ${etapas.map(e => `${e.rotulo} ${formatar(e.valor)}`).join(", ")}.`;
  return (
    <ol role="img" aria-label={resumo} className={cn("m-0 list-none p-0", className)}>
      {etapas.map((e, i) => (
        <li key={e.rotulo}>
          {i > 0 && (
            <p className={cn("my-1.5 flex items-center justify-center gap-1.5 text-[0.75rem] tabular-nums", i - 1 === piorPassagem ? "font-semibold text-[var(--primary-text,var(--primary))]" : "text-muted-foreground")}>
              <span aria-hidden>↓</span>
              {r.seguiram(formatarPercentual(taxas[i - 1]! * 100, 0, localidade))}
              {i - 1 === piorPassagem && <span className="rounded-sm border border-current px-1.5 py-px text-[0.6875rem]">{r.maiorPerda}</span>}
            </p>
          )}
          <div className="mb-1 flex items-baseline justify-between gap-3 text-[0.8125rem]">
            <span className="min-w-0 font-medium text-foreground">{e.rotulo}</span>
            <span className="shrink-0 font-semibold tabular-nums text-foreground">{formatar(e.valor)}</span>
          </div>
          <motion.div className="mx-auto h-5 rounded-sm" style={{ width: `${Math.max(3, (e.valor / max) * 100)}%`, background: tons[Math.min(i, tons.length - 1)] }}
            initial={menos ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: menos ? 0 : 0.08 * i, ease: [0.22, 1, 0.36, 1] }} />
        </li>
      ))}
    </ol>
  );
}
