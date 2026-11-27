"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "./utils";
import { LinhaDeLista } from "./linha-de-lista";

/**
 * TabelaAdaptavel (tabela que nunca rola para o lado)
 *
 * Regra do DS: card nunca tem rolagem horizontal. A tabela mostra as colunas que cabem na largura dela (não da tela):
 * - prioridade 1 (padrão): sempre aparece;
 * - prioridade 2: some abaixo de 36rem (576 px);
 * - prioridade 3: some abaixo de 48rem (768 px);
 * quando alguma coluna sai, um aviso curto embaixo diz quantas e quais ("2 colunas ficaram de fora nesta largura:
 * Plano, Cidade").
 * Abaixo de 30rem (480 px) ela vira lista de LinhaDeLista: a coluna principal como título e as outras em pares
 * "rótulo: valor", alinhados à mesma borda esquerda; as ações vão para uma linha própria embaixo do texto.
 * Ordenação (especificação da área restrita, ADMIN_REACT.md §7.1): colunas com `ordenavel` viram botões no cabeçalho
 * (crescente, decrescente; aria-sort no cabeçalho); na lista do celular a ordem escolhida continua valendo.
 * Era o padrão "TabelaQueQuebra" das demonstrações e resolve as tabelas que rolavam nas páginas do DS e na área
 * restrita (parceiros, pesquisas).
 *
 * Linhas: hover cinza de ponta a ponta, sem cantos (--row-hover). Cabeçalho em <th scope="col">; a tabela tem
 * legenda (visível ou só para leitores de tela).
 */

export type ColunaDaTabela<T> = {
  id: string;
  titulo: string;
  celula: (linha: T) => React.ReactNode;
  prioridade?: 1 | 2 | 3;
  /** Valores numéricos ou datas: à direita, com algarismos de mesma largura. */
  alinhar?: "inicio" | "fim";
  /** A coluna que vira título na lista (padrão: a primeira). */
  principal?: boolean;
  /** A coluna pode ordenar a tabela (botão no cabeçalho). */
  ordenavel?: boolean;
  /** Valor usado para ordenar (padrão: o texto da célula, quando for texto ou número). */
  valorParaOrdenar?: (linha: T) => string | number;
};

export type TabelaAdaptavelProps<T> = {
  colunas: ColunaDaTabela<T>[];
  linhas: T[];
  chave: (linha: T) => string;
  /** Legenda da tabela (nome para leitores de tela). */
  legenda: string;
  mostrarLegenda?: boolean;
  /** Ações de cada linha (botões, menu), numa coluna própria no fim. */
  acoes?: (linha: T) => React.ReactNode;
  vazio?: React.ReactNode;
  /** Ordem inicial: { coluna: id, direcao: "asc" | "desc" }. */
  ordemInicial?: { coluna: string; direcao: "asc" | "desc" };
  textos?: { foraDaTela?: string; acoes?: string; coluna?: string; colunas?: string; ordenar?: string };
  className?: string;
};

const ESCONDE = { 1: "", 2: "hidden @min-[36rem]/tabela:table-cell", 3: "hidden @min-[48rem]/tabela:table-cell" } as const;

function TabelaAdaptavel<T>({ colunas, linhas: linhasProp, chave, legenda, mostrarLegenda = false, acoes, vazio, ordemInicial, textos, className }: TabelaAdaptavelProps<T>) {
  const tx = { foraDaTela: "ficaram de fora nesta largura", acoes: "Ações", coluna: "coluna", colunas: "colunas", ordenar: "Ordenar por", ...textos };
  const [ordem, setOrdem] = React.useState(ordemInicial ?? null);
  const linhas = React.useMemo(() => {
    if (!ordem) return linhasProp;
    const c = colunas.find(x => x.id === ordem.coluna);
    if (!c) return linhasProp;
    const valor = (l: T) => {
      if (c.valorParaOrdenar) return c.valorParaOrdenar(l);
      const v = c.celula(l);
      return typeof v === "string" || typeof v === "number" ? v : "";
    };
    const r = [...linhasProp].sort((a, b) => {
      const va = valor(a), vb = valor(b);
      return typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb), "pt-BR", { numeric: true });
    });
    return ordem.direcao === "desc" ? r.reverse() : r;
  }, [linhasProp, ordem, colunas]);
  const ordenar = (id: string) => setOrdem(o => (o?.coluna === id ? { coluna: id, direcao: o.direcao === "asc" ? "desc" : "asc" } : { coluna: id, direcao: "asc" }));
  const fora = (l: string[]) => `${l.length} ${l.length === 1 ? tx.coluna : tx.colunas} ${tx.foraDaTela}: ${l.join(", ")}.`;
  const principal = colunas.find(c => c.principal) ?? colunas[0];
  const outras = colunas.filter(c => c !== principal);
  const p2 = colunas.filter(c => c.prioridade === 2).map(c => c.titulo);
  const p3 = colunas.filter(c => c.prioridade === 3).map(c => c.titulo);
  const celulaBase = (c: ColunaDaTabela<T>) => cn("px-4 py-3 align-top", c.alinhar === "fim" && "text-right tabular-nums", ESCONDE[c.prioridade ?? 1]);

  return (
    <div data-slot="tabela-adaptavel" className={cn("@container/tabela min-w-0 overflow-hidden rounded-xl border border-border bg-card", className)}>
      {mostrarLegenda && <p className="border-b border-border px-4 py-3 text-body-sm font-semibold text-foreground">{legenda}</p>}
      {linhas.length === 0 && vazio ? (
        <div className="px-4">{vazio}</div>
      ) : (
        <>
          {/* Tabela (30rem ou mais) */}
          <table className="hidden w-full border-collapse text-left text-body-sm @min-[30rem]/tabela:table">
            <caption className="sr-only">{legenda}</caption>
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {colunas.map(c => {
                  const ativa = ordem?.coluna === c.id;
                  const Seta = !ativa ? ArrowUpDown : ordem!.direcao === "asc" ? ArrowUp : ArrowDown;
                  return (
                    <th
                      key={c.id}
                      scope="col"
                      aria-sort={c.ordenavel ? (ativa ? (ordem!.direcao === "asc" ? "ascending" : "descending") : "none") : undefined}
                      className={cn(celulaBase(c), "py-3 text-label font-semibold uppercase tracking-[0.06em] text-muted-foreground")}
                    >
                      {c.ordenavel ? (
                        <button
                          type="button"
                          onClick={() => ordenar(c.id)}
                          aria-label={`${tx.ordenar} ${c.titulo}`}
                          className={cn("-mx-2 inline-flex min-h-8 items-center gap-1 rounded-sm px-2 uppercase tracking-[0.06em] transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", ativa && "text-foreground")}
                        >
                          {c.titulo}
                          <Seta aria-hidden className="size-3.5" />
                        </button>
                      ) : c.titulo}
                    </th>
                  );
                })}
                {acoes && <th scope="col" className="w-px whitespace-nowrap px-4 py-3 text-right text-label font-semibold uppercase tracking-[0.06em] text-muted-foreground"><span className="sr-only">{tx.acoes}</span></th>}
              </tr>
            </thead>
            <tbody>
              {linhas.map(l => (
                <tr key={chave(l)} className="border-b border-border transition-colors last:border-0 hover:bg-[var(--row-hover)]">
                  {colunas.map(c => (
                    <td key={c.id} className={cn(celulaBase(c), "[overflow-wrap:anywhere]", c === principal ? "font-semibold text-foreground" : "text-muted-foreground")}>{c.celula(l)}</td>
                  ))}
                  {acoes && <td className="w-px whitespace-nowrap px-4 py-2 text-right align-middle"><div className="flex justify-end gap-2">{acoes(l)}</div></td>}
                </tr>
              ))}
            </tbody>
          </table>
          {(p2.length > 0 || p3.length > 0) && (
            <p className="hidden border-t border-border px-4 py-2 text-label text-muted-foreground @min-[30rem]/tabela:block @min-[48rem]/tabela:hidden">
              <span className="@min-[36rem]/tabela:hidden">{fora([...p2, ...p3])}</span>
              <span className="hidden @min-[36rem]/tabela:inline">{p3.length ? fora(p3) : ""}</span>
            </p>
          )}

          {/* Lista (abaixo de 30rem) */}
          <ul aria-label={legenda} className="divide-y divide-border @min-[30rem]/tabela:hidden">
            {linhas.map(l => (
              <LinhaDeLista key={chave(l)} as="li" titulo={principal.celula(l)} fim={acoes?.(l)} quebraAcoes className="py-4">
                <dl className="mt-2 grid gap-1 text-body-sm">
                  {outras.map(c => (
                    <div key={c.id} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                      <dt className="text-muted-foreground">{c.titulo}</dt>
                      <dd className="text-foreground [overflow-wrap:anywhere]">{c.celula(l)}</dd>
                    </div>
                  ))}
                </dl>
              </LinhaDeLista>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export { TabelaAdaptavel };
