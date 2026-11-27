"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { ArrowDown, ArrowUp, ArrowUpDown, CheckIcon, EyeOff, MinusIcon } from "lucide-react";
import { cn } from "./utils";

/**
 * Tabela adaptável: o mesmo componente nos dois DS (FindLook e Dani Moscatelli, 27/11/2026): seleção, ordem
 * controlada (ordem + onOrdenar) ou da própria tabela, e as colunas que cabem pela medida da largura (`largura`).
 * A tabela das listas do painel (parceiros, pesquisas, contatos) que nunca rola para o lado (regra da
 * dona do produto, 18/11/2026). Ela mede a própria largura e:
 * - mostra as colunas que cabem, da mais importante para a menos importante (`prioridade`, menor = mais importante);
 *   a coluna `principal` (o nome) aparece sempre; as que não couberem são avisadas embaixo da tabela
 *   ("Nesta largura ficam de fora: Público, Estilos.");
 * - abaixo de `larguraDaLista` (480 px de largura da própria tabela, padrão aqui; 600 no DS FindLook), vira lista: cada linha é um bloco com a
 *   coluna principal como título, as outras como "Rótulo: valor" embaixo, e as ações numa linha própria, alinhadas
 *   à borda esquerda do texto (regra das linhas no celular).
 * Seleção (opcional): caixa de 44 px no celular (a caixa desenhada tem 20 px, como o Checkbox), "selecionar todas" no
 * cabeçalho; linha selecionada no rosa do selecionado (--primary-suave); hover da linha cinza (--row-hover), de ponta
 * a ponta e sem cantos. Ordenação (opcional): botão no título da coluna com a seta da direção e aria-sort.
 * Ordenação pela própria tabela: `ordemInicial` e `valorParaOrdenar` nas colunas. Textos: `textos`. Vazio: `vazio`.
 * BarraDeFerramentasDaTabela: a faixa de cima (busca à esquerda; até três botões de ferramenta à direita) e, embaixo,
 * os filtros aplicados. Quando a tabela é estreita, os botões descem para baixo da busca, numa linha só, com a mesma
 * largura; com mais de dois botões no celular, ponha os outros num menu "Mais".
 */

export type ColunaDaTabela<T> = {
  id: string;
  titulo: string;
  celula: (linha: T) => React.ReactNode;
  /** 1 = mais importante; qualquer número: a tabela mede a largura e põe as que cabem, por ordem. */
  prioridade?: number;
  alinhar?: "inicio" | "fim";
  /** A coluna principal (o nome): aparece sempre e vira o título de cada item na lista. */
  principal?: boolean;
  ordenavel?: boolean;
  /** Valor usado para ordenar (padrão: o texto da célula, quando for texto ou número). */
  valorParaOrdenar?: (linha: T) => string | number;
  /** Largura mínima da coluna, em px (padrão 140), para medir quais cabem. */
  largura?: number;
};
/** Nome antigo do DS FindLook, mesmo tipo. */
export type ColunaAdaptavel<T> = ColunaDaTabela<T>;

export type OrdemDaTabela = { coluna: string; direcao: "asc" | "desc" };

export type TabelaAdaptavelProps<T> = {
  colunas: ColunaDaTabela<T>[];
  linhas: T[];
  chave: (linha: T) => string;
  /** Legenda da tabela (lida por leitores de tela; visível com `mostrarLegenda`). */
  legenda: string;
  mostrarLegenda?: boolean;
  /** Ordem inicial quando a própria tabela ordena (colunas com valorParaOrdenar, sem onOrdenar). */
  ordemInicial?: OrdemDaTabela;
  textos?: { foraDaTela?: string; acoes?: string; coluna?: string; colunas?: string; ordenar?: string; selecionarTodas?: string };
  /** Nome da linha para leitores de tela ("Selecionar Ateliê Aurora"). */
  rotuloDaLinha?: (linha: T) => string;
  selecionadas?: Set<string>;
  onSelecionadasChange?: (s: Set<string>) => void;
  acoes?: (linha: T) => React.ReactNode;
  /** Largura das ações, em px (padrão 56). */
  larguraDasAcoes?: number;
  ordem?: OrdemDaTabela;
  onOrdenar?: (o: OrdemDaTabela) => void;
  larguraDaLista?: number;
  vazio?: React.ReactNode;
  /**
   * "card": a tabela no próprio card (borda, cantos de 12 px e fundo branco); "nenhuma": sem moldura, para ficar dentro
   * de um card que já existe. Padrão: "card" (como cada DS usava antes de 27/11/2026).
   */
  moldura?: "card" | "nenhuma";
  className?: string;
};

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const LARGURA_DA_SELECAO = 52;

/** Caixa de seleção com área de toque de 44 px no celular (36 px no computador); o desenho é o do Checkbox do DS. */
function CaixaDeSelecao({ marcada, onMarcadaChange, rotulo }: { marcada: boolean | "indeterminate"; onMarcadaChange: (v: boolean) => void; rotulo: string }) {
  return (
    <CheckboxPrimitive.Root
      checked={marcada}
      onCheckedChange={(v) => onMarcadaChange(v === true)}
      aria-label={rotulo}
      className={cn("group/caixa -m-3 flex size-9 shrink-0 items-center justify-center rounded-md sm:-m-2 toque:size-11", foco)}
    >
      <span
        aria-hidden
        className="flex size-5 items-center justify-center rounded-sm border border-input bg-input-background text-primary-foreground transition-colors group-data-[state=checked]/caixa:border-primary group-data-[state=checked]/caixa:bg-primary group-data-[state=indeterminate]/caixa:border-primary group-data-[state=indeterminate]/caixa:bg-primary"
      >
        <CheckIcon className="hidden size-3.5 group-data-[state=checked]/caixa:block" strokeWidth={3} />
        <MinusIcon className="hidden size-3.5 group-data-[state=indeterminate]/caixa:block" strokeWidth={3} />
      </span>
    </CheckboxPrimitive.Root>
  );
}

const useLayoutSeguro = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function useLargura<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [largura, setLargura] = React.useState<number | null>(null);
  useLayoutSeguro(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setLargura(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, largura };
}

export function TabelaAdaptavel<T>({
  colunas,
  linhas,
  chave,
  legenda,
  mostrarLegenda = false,
  ordemInicial,
  textos,
  rotuloDaLinha,
  selecionadas,
  onSelecionadasChange,
  acoes,
  larguraDasAcoes = 56,
  ordem,
  onOrdenar,
  moldura = "card",
  larguraDaLista = 480,
  vazio,
  className,
}: TabelaAdaptavelProps<T>) {
  const tx = { foraDaTela: "Nesta largura ficam de fora:", acoes: "Ações", ordenar: "Ordenar por", selecionarTodas: "Selecionar todas", ...textos };
  // Ordem: controlada (ordem + onOrdenar) ou da própria tabela (ordemInicial + valorParaOrdenar).
  const [ordemPropria, setOrdemPropria] = React.useState<OrdemDaTabela | undefined>(ordemInicial);
  const ordemAtual = onOrdenar ? ordem : ordemPropria;
  const ordenar = onOrdenar ?? setOrdemPropria;
  const linhasNaOrdem = React.useMemo(() => {
    if (onOrdenar || !ordemPropria) return linhas;
    const col = colunas.find((c) => c.id === ordemPropria.coluna);
    if (!col) return linhas;
    // Sem valorParaOrdenar, ordena pelo texto da célula quando ela é texto ou número (como no DS Dani Moscatelli).
    const v = col.valorParaOrdenar ?? ((l: T) => { const x = col.celula(l); return typeof x === "string" || typeof x === "number" ? x : ""; });
    return [...linhas].sort((a, b) => {
      const x = v(a), y = v(b);
      const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), "pt-BR", { numeric: true });
      return ordemPropria.direcao === "asc" ? r : -r;
    });
  }, [linhas, colunas, ordemPropria, onOrdenar]);
  const { ref, largura } = useLargura<HTMLDivElement>();
  const selecionavel = Boolean(selecionadas && onSelecionadasChange);
  const lista = largura !== null && largura < larguraDaLista;

  // Colunas que cabem, por importância; mantém a ordem original na tela.
  const visiveis = React.useMemo(() => {
    if (largura === null) return new Set(colunas.map((c) => c.id));
    let livre = largura - (selecionavel ? LARGURA_DA_SELECAO : 0) - (acoes ? larguraDasAcoes : 0);
    const cabem = new Set<string>();
    for (const c of colunas.filter((c) => c.principal)) { cabem.add(c.id); livre -= c.largura ?? 140; }
    const resto = colunas.filter((c) => !c.principal).sort((a, b) => (a.prioridade ?? 99) - (b.prioridade ?? 99));
    for (const c of resto) {
      if ((c.largura ?? 140) <= livre) { cabem.add(c.id); livre -= c.largura ?? 140; }
    }
    return cabem;
  }, [largura, colunas, selecionavel, acoes, larguraDasAcoes]);

  const mostradas = colunas.filter((c) => lista || visiveis.has(c.id));
  const fora = lista ? [] : colunas.filter((c) => !visiveis.has(c.id)).map((c) => c.titulo);
  const todas = linhas.length > 0 && linhas.every((l) => selecionadas?.has(chave(l)));
  const algumas = !todas && linhas.some((l) => selecionadas?.has(chave(l)));
  const marcar = (id: string, v: boolean) => {
    const n = new Set(selecionadas);
    if (v) n.add(id); else n.delete(id);
    onSelecionadasChange?.(n);
  };
  const marcarTodas = (v: boolean) => onSelecionadasChange?.(v ? new Set(linhas.map(chave)) : new Set());
  const nome = (l: T) => rotuloDaLinha?.(l) ?? chave(l);

  const cabecalhoDaColuna = (c: ColunaAdaptavel<T>) => {
    if (!c.ordenavel) return c.titulo;
    const atual = ordemAtual?.coluna === c.id ? ordemAtual.direcao : null;
    const Seta = atual === "asc" ? ArrowUp : atual === "desc" ? ArrowDown : ArrowUpDown;
    return (
      <button
        type="button"
        onClick={() => ordenar({ coluna: c.id, direcao: atual === "asc" ? "desc" : "asc" })}
        aria-label={`${tx.ordenar} ${c.titulo}`}
        className={cn("-mx-2 inline-flex min-h-9 items-center gap-1 rounded-sm px-2 uppercase tracking-[0.06em] transition-colors hover:bg-accent hover:text-foreground", atual && "text-foreground", foco)}
      >
        {c.titulo}
        <Seta aria-hidden className="size-3.5" />
      </button>
    );
  };

  return (
    <div ref={ref} data-slot="tabela-adaptavel" data-modo={lista ? "lista" : "tabela"} className={cn("min-w-0", moldura === "card" && "overflow-hidden rounded-xl border border-border bg-card", className)}>
      {linhas.length === 0 && vazio ? (
        <div className="p-4">{vazio}</div>
      ) : lista ? (
        <>
          <p className={mostrarLegenda ? "m-0 px-4 pb-2 pt-4 text-body-sm font-semibold text-foreground" : "sr-only"}>{legenda}</p>
          {selecionavel && (
            <div className="flex items-center gap-3 border-b border-border px-4 py-1">
              <CaixaDeSelecao marcada={todas ? true : algumas ? "indeterminate" : false} onMarcadaChange={marcarTodas} rotulo={tx.selecionarTodas} />
              <span aria-hidden className="text-body-sm text-muted-foreground">{tx.selecionarTodas}</span>
            </div>
          )}
          <ul className="m-0 list-none p-0" aria-label={legenda}>
            {linhasNaOrdem.map((l) => {
              const id = chave(l);
              const marcada = selecionadas?.has(id) ?? false;
              const [titulo, ...resto] = mostradas.filter((c) => c.principal).concat(mostradas.filter((c) => !c.principal).sort((a, b) => (a.prioridade ?? 99) - (b.prioridade ?? 99)));
              return (
                <li
                  key={id}
                  data-selecionada={marcada || undefined}
                  className={cn("flex gap-3 border-b border-border px-4 py-3 transition-colors last:border-b-0", marcada ? "bg-[var(--primary-suave)]" : "hover:bg-[var(--row-hover)]")}
                >
                  {selecionavel && <div className="pt-1"><CaixaDeSelecao marcada={marcada} onMarcadaChange={(v) => marcar(id, v)} rotulo={`Selecionar ${nome(l)}`} /></div>}
                  <div className="min-w-0 flex-1">
                    {titulo && <div className="min-w-0 text-body-sm font-semibold text-foreground">{titulo.celula(l)}</div>}
                    {resto.length > 0 && (
                      <dl className="m-0 mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-body-sm">
                        {resto.map((c) => (
                          <React.Fragment key={c.id}>
                            <dt className="text-muted-foreground">{c.titulo}</dt>
                            <dd className="m-0 min-w-0 text-foreground [overflow-wrap:anywhere]">{c.celula(l)}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    )}
                    {acoes && <div className="mt-2 flex flex-wrap items-center gap-2">{acoes(l)}</div>}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <>
          <table className="w-full table-fixed border-collapse text-body-sm">
            <caption className={mostrarLegenda ? "px-4 pb-2 pt-4 text-left text-body-sm font-semibold text-foreground" : "sr-only"}>{legenda}</caption>
            <colgroup>
              {selecionavel && <col style={{ width: LARGURA_DA_SELECAO }} />}
              {mostradas.map((c) => <col key={c.id} style={c.principal ? undefined : { width: c.largura ?? 140 }} />)}
              {acoes && <col style={{ width: larguraDasAcoes }} />}
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-muted">
                {selecionavel && (
                  <th scope="col" className="px-4 py-2 text-left">
                    <CaixaDeSelecao marcada={todas ? true : algumas ? "indeterminate" : false} onMarcadaChange={marcarTodas} rotulo={tx.selecionarTodas} />
                  </th>
                )}
                {mostradas.map((c) => (
                  <th
                    key={c.id}
                    scope="col"
                    aria-sort={ordemAtual?.coluna === c.id ? (ordemAtual.direcao === "asc" ? "ascending" : "descending") : undefined}
                    className={cn("px-4 py-2 text-label font-semibold uppercase tracking-[0.06em] text-muted-foreground", c.alinhar === "fim" ? "text-right" : "text-left")}
                  >
                    {cabecalhoDaColuna(c)}
                  </th>
                ))}
                {acoes && <th scope="col" className="px-2 py-2"><span className="sr-only">{tx.acoes}</span></th>}
              </tr>
            </thead>
            <tbody>
              {linhasNaOrdem.map((l) => {
                const id = chave(l);
                const marcada = selecionadas?.has(id) ?? false;
                return (
                  <tr key={id} data-selecionada={marcada || undefined} className={cn("border-b border-border transition-colors last:border-b-0", marcada ? "bg-[var(--primary-suave)]" : "hover:bg-[var(--row-hover)]")}>
                    {selecionavel && (
                      <td className="px-4 py-3 align-middle">
                        <CaixaDeSelecao marcada={marcada} onMarcadaChange={(v) => marcar(id, v)} rotulo={`Selecionar ${nome(l)}`} />
                      </td>
                    )}
                    {mostradas.map((c) => (
                      <td key={c.id} className={cn("px-4 py-3 align-middle text-foreground [overflow-wrap:anywhere]", c.alinhar === "fim" && "text-right", c.principal && "font-semibold")}>
                        {c.celula(l)}
                      </td>
                    ))}
                    {acoes && <td className="px-2 py-3 text-right align-middle">{acoes(l)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {fora.length > 0 && (
            <p className="m-0 flex items-start gap-1.5 border-t border-border px-4 py-3 text-label text-muted-foreground" data-colunas-fora>
              <EyeOff aria-hidden className="mt-0.5 size-3.5 shrink-0" /> {tx.foraDaTela} {fora.join(", ")}.
            </p>
          )}
        </>
      )}
    </div>
  );
}

/* ── Barra de ferramentas ── */
export function BarraDeFerramentasDaTabela({ busca, children, filtrosAtivos, className }: { busca?: React.ReactNode; children?: React.ReactNode; filtrosAtivos?: React.ReactNode; className?: string }) {
  return (
    <div data-slot="barra-de-ferramentas-da-tabela" className={cn("@container border-b border-border", className)}>
      <div className="flex flex-col gap-3 px-4 py-4 @3xl:flex-row @3xl:items-center @3xl:justify-between">
        {busca && <div className="min-w-0 flex-1 @3xl:max-w-sm">{busca}</div>}
        {children && <div className="grid auto-cols-fr grid-flow-col gap-2 @3xl:flex @3xl:flex-wrap @3xl:items-center">{children}</div>}
      </div>
      {filtrosAtivos && <div className="px-4 pb-3">{filtrosAtivos}</div>}
    </div>
  );
}
