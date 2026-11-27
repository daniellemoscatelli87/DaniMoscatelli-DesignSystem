"use client";

import * as React from "react";
import { ChevronDown, MoveRight } from "lucide-react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "./utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./dropdown-menu";

/**
 * Quadro (colunas de etapas com cartões, estilo kanban). O mesmo arquivo nos dois DS (FindLook e Dani Moscatelli,
 * 27/11/2026), com dois jeitos de usar e as mesmas props:
 *
 * 1. Cartões prontos (quadro de leitura, como o da Rede de Parceiros): cada coluna traz `cartoes` (título, uma linha de
 *    apoio, etiqueta e pessoa; com `href` ou `onClick` o cartão vira link ou botão). As colunas ficam lado a lado
 *    quando cabem (cada uma precisa de 14rem) e, no estreito, uma embaixo da outra: 2 colunas a partir de 28rem; 3 a
 *    partir de 42rem; 4 em duas por linha a partir de 28rem e as quatro a partir de 56rem; 5 a partir de 70rem.
 *    Cartões entram em sequência quando o quadro aparece na tela (parados com "menos movimento").
 * 2. Itens que mudam de etapa (acompanhamento, como a Ativação de lojas): `itens` numa lista só, com `chave(item)`,
 *    `coluna(item)`, `cartao(item)` e `onMover`. Com o quadro de 56rem ou mais, as colunas lado a lado; antes disso,
 *    uma embaixo da outra, e o título de cada coluna abre e fecha a lista (as que têm itens começam abertas). Mover:
 *    arrastar com o mouse (a coluna que aceita fica tracejada e, embaixo do item, no rosa de destaque) ou o botão
 *    "Mover para" de cada cartão (teclado, toque e leitores de tela), que lista só as colunas permitidas (`podeMover`).
 *    `limitarAltura`: cada coluna mostra até 24rem e rola por dentro (só na vertical).
 *
 * Nos dois: card nunca rola para o lado; a largura que vale é a do quadro, não a da tela. Ponto colorido (`tom`) antes
 * do título, nunca a única pista (o título diz a etapa). Coluna vazia com o texto de `vazio` (ou `textos.vazio`),
 * tracejado. Cada coluna é uma seção com o título e a contagem para leitores de tela; os cartões são uma lista.
 */

export type CartaoDoQuadro = {
  id: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** ChipDeEstado ou Badge. */
  etiqueta?: React.ReactNode;
  /** Avatar da pessoa responsável. */
  pessoa?: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

export type ColunaDoQuadro<K extends string = string> = {
  id: K;
  titulo: string;
  /** Cor do ponto da coluna (nunca a única pista: o título diz a etapa). */
  tom?: "marca" | "neutro" | "sucesso" | "info" | "aviso";
  /** Cartões prontos da coluna (jeito 1). */
  cartoes?: CartaoDoQuadro[];
  /** Quantidade mostrada (jeito 2; padrão: os itens da coluna). */
  quantidade?: number;
  icone?: React.ReactNode;
  /** Linha curta embaixo do título ("62% avançaram da etapa anterior"). */
  subtitulo?: React.ReactNode;
  /** Texto da coluna vazia. */
  vazio?: string;
  /** Embaixo da lista ("Ver todas as 32"). */
  rodape?: React.ReactNode;
};

export type QuadroProps<K extends string = string, T = unknown> = {
  colunas: ColunaDoQuadro<K>[];
  /** Nome do quadro para leitores de tela ("Ativação das lojas"). */
  rotulo: string;
  textos?: { item?: string; itens?: string; vazio?: string; mover?: string; moverPara?: string };
  className?: string;
  /** Jeito 2: os itens, numa lista só. */
  itens?: T[];
  chave?: (item: T) => string;
  coluna?: (item: T) => K;
  cartao?: (item: T) => React.ReactNode;
  onMover?: (item: T, para: K) => void;
  podeMover?: (item: T, para: K) => boolean;
  /** Nome do item no botão "Mover <nome>". */
  rotuloItem?: (item: T) => string;
  limitarAltura?: boolean;
};

const PONTO = { marca: "bg-primary", neutro: "bg-muted-foreground", sucesso: "bg-success", info: "bg-info", aviso: "bg-warning" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const COLUNAS: Record<number, string> = {
  1: "",
  2: "@min-[28rem]/quadro:grid-cols-2",
  3: "@min-[42rem]/quadro:grid-cols-3",
  4: "@min-[28rem]/quadro:grid-cols-2 @min-[56rem]/quadro:grid-cols-4",
  5: "@min-[42rem]/quadro:grid-cols-3 @min-[70rem]/quadro:grid-cols-5",
};
const TEXTOS = { item: "item", itens: "itens", vazio: "Nada nesta etapa", mover: "Mover", moverPara: "Mover para" };

function Quadro<K extends string = string, T = unknown>(props: QuadroProps<K, T>) {
  const { itens, chave, coluna, cartao } = props;
  if (itens && chave && coluna && cartao) return <QuadroDeItens {...props} itens={itens} chave={chave} coluna={coluna} cartao={cartao} />;
  return <QuadroDeCartoes colunas={props.colunas} rotulo={props.rotulo} textos={props.textos} className={props.className} />;
}

function QuadroDeCartoes({ colunas, rotulo, textos, className }: Pick<QuadroProps, "colunas" | "rotulo" | "textos" | "className">) {
  const tx = { ...TEXTOS, ...textos };
  const ref = React.useRef<HTMLDivElement>(null);
  const visivel = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduzir = useReducedMotion();
  let ordem = 0;
  return (
    <div ref={ref} role="region" aria-label={rotulo} data-slot="quadro" className={cn("@container/quadro", className)}>
      <div className={cn("grid items-start gap-4", COLUNAS[colunas.length] ?? COLUNAS[5])}>
        {colunas.map(c => (
          <section key={c.id} aria-label={`${c.titulo}, ${(c.cartoes ?? []).length} ${(c.cartoes ?? []).length === 1 ? tx.item : tx.itens}`} className="min-w-0 rounded-lg bg-muted p-3">
            <header className="mb-3 flex items-center gap-2 px-1">
              <span aria-hidden className={cn("size-2 shrink-0 rounded-full", PONTO[c.tom ?? "neutro"])} />
              <h3 className="min-w-0 flex-1 truncate text-body-sm font-semibold text-foreground">{c.titulo}</h3>
              <span aria-hidden className="rounded-full bg-card px-2 text-label font-semibold tabular-nums text-muted-foreground">{(c.cartoes ?? []).length}</span>
            </header>
            {(c.cartoes ?? []).length === 0 ? (
              <p className="rounded-md border border-dashed border-[var(--border-strong)] px-3 py-4 text-center text-body-sm text-muted-foreground">{c.vazio ?? tx.vazio}</p>
            ) : (
              <ul className="grid gap-2">
                {(c.cartoes ?? []).map(k => {
                  const i = ordem++;
                  const conteudo = (
                    <>
                      <span className="block text-body-sm font-semibold leading-snug text-foreground [overflow-wrap:anywhere]">{k.titulo}</span>
                      {k.descricao && <span className="mt-1 block text-body-sm text-muted-foreground [overflow-wrap:anywhere]">{k.descricao}</span>}
                      {(k.etiqueta || k.pessoa) && (
                        <span className="mt-3 flex flex-wrap items-center gap-2">
                          {k.pessoa && <span className="shrink-0">{k.pessoa}</span>}
                          {k.etiqueta && <span className="min-w-0">{k.etiqueta}</span>}
                        </span>
                      )}
                    </>
                  );
                  const classe = "block w-full rounded-md border border-border bg-card p-3 text-left";
                  const interativo = "transition-colors duration-[var(--duration-fast)] hover:border-[var(--border-strong)] hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                  return (
                    <motion.li
                      key={k.id}
                      initial={reduzir ? false : { opacity: 0, y: 8 }}
                      animate={visivel || reduzir ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                      transition={{ duration: 0.3, delay: reduzir ? 0 : 0.05 * i, ease: [0, 0, 0.58, 1] }}
                    >
                      {k.href ? (
                        <a href={k.href} className={cn(classe, interativo)}>{conteudo}</a>
                      ) : k.onClick ? (
                        <button type="button" onClick={k.onClick} className={cn(classe, interativo)}>{conteudo}</button>
                      ) : (
                        <div className={classe}>{conteudo}</div>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

function QuadroDeItens<K extends string, T>({
  colunas, itens, chave, coluna, cartao, onMover, podeMover = () => true, rotulo, rotuloItem = chave, limitarAltura = false, textos, className,
}: QuadroProps<K, T> & { itens: T[]; chave: (item: T) => string; coluna: (item: T) => K; cartao: (item: T) => React.ReactNode }) {
  const tx = { ...TEXTOS, ...textos };
  const [arrastando, setArrastando] = React.useState<string | null>(null);
  const [alvo, setAlvo] = React.useState<K | null>(null);
  const quantas = (c: ColunaDoQuadro<K>) => c.quantidade ?? itens.filter((t) => coluna(t) === c.id).length;
  const [fechadas, setFechadas] = React.useState<Set<K>>(() => new Set(colunas.filter((c) => quantas(c) === 0).map((c) => c.id)));
  const alternar = (id: K) => setFechadas((f) => { const n = new Set(f); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const item = arrastando ? itens.find((t) => chave(t) === arrastando) : undefined;
  const idBase = React.useId();

  const soltar = (e: React.DragEvent, para: K) => {
    e.preventDefault();
    setAlvo(null);
    setArrastando(null);
    if (item && coluna(item) !== para && podeMover(item, para)) onMover?.(item, para);
  };

  return (
    <div data-slot="quadro" className={cn("@container min-w-0", className)}>
      <div
        role="group"
        aria-label={rotulo}
        // As colunas são raias de um quadro, não cards lado a lado: têm a mesma altura (a da maior) e o vazio embaixo é
        // o lugar de soltar um item; a regra "cards da mesma altura ou um por linha" não se aplica a elas.
        data-cards-ignorar=""
        className="grid grid-cols-1 gap-3 @min-[56rem]:[grid-template-columns:repeat(var(--colunas),minmax(0,1fr))]"
        style={{ "--colunas": colunas.length } as React.CSSProperties}
      >
        {colunas.map((c) => {
          const daColuna = itens.filter((t) => coluna(t) === c.id);
          const n = quantas(c);
          const aceita = item ? coluna(item) !== c.id && podeMover(item, c.id) : false;
          const fechada = fechadas.has(c.id);
          const idLista = `${idBase}-${c.id}`;
          const cabecalho = (
            <>
              {c.tom && <span aria-hidden className={cn("size-2 shrink-0 rounded-full", PONTO[c.tom])} />}
              {c.icone && <span aria-hidden className="inline-flex shrink-0 text-muted-foreground [&>svg]:size-4">{c.icone}</span>}
              <span className="min-w-0 flex-1 text-left text-body-sm font-bold text-foreground">{c.titulo}</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-card px-2 text-label font-semibold tabular-nums text-foreground">{n}</span>
            </>
          );
          return (
            <section
              key={c.id}
              aria-label={`${c.titulo}: ${n}`}
              data-coluna={c.id}
              onDragOver={(e) => { if (aceita) { e.preventDefault(); setAlvo(c.id); } }}
              onDragLeave={() => setAlvo((a) => (a === c.id ? null : a))}
              onDrop={(e) => soltar(e, c.id)}
              className={cn(
                "flex min-w-0 flex-col rounded-lg border p-2 transition-colors duration-[var(--duration-fast)]",
                alvo === c.id ? "border-primary bg-[var(--primary-muted)]" : aceita ? "border-dashed border-primary/50 bg-muted" : "border-border bg-muted",
              )}
            >
              {/* Quadro estreito: o título abre e fecha a coluna. */}
              <button
                type="button"
                onClick={() => alternar(c.id)}
                aria-expanded={!fechada}
                aria-controls={idLista}
                className={cn("flex min-h-11 items-center gap-2 px-2 hover:bg-accent @min-[56rem]:hidden", foco)}
              >
                {cabecalho}
                <ChevronDown aria-hidden className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-normal)] motion-reduce:transition-none", !fechada && "rotate-180")} />
              </button>
              {/* Quadro largo: todas as colunas abertas. */}
              <h3 className="m-0 mb-2 hidden min-h-8 items-center gap-2 px-2 @min-[56rem]:flex">{cabecalho}</h3>
              <div id={idLista} className={cn("mt-2 flex-col @min-[56rem]:mt-0 @min-[56rem]:flex", fechada ? "hidden" : "flex")}>
                {c.subtitulo && <p className="m-0 mb-2 px-2 text-label leading-snug text-muted-foreground">{c.subtitulo}</p>}
                <ul className={cn("m-0 flex min-h-16 list-none flex-col gap-2 p-0", limitarAltura && "max-h-96 overflow-y-auto overscroll-contain p-0.5 [scrollbar-width:thin]")}>
                  {daColuna.length === 0 && (
                    <li className="rounded-md border border-dashed border-[var(--border-strong)] px-3 py-4 text-center text-label text-muted-foreground">{c.vazio ?? tx.vazio}</li>
                  )}
                  {daColuna.map((t) => {
                    const destinos = onMover ? colunas.filter((d) => d.id !== c.id && podeMover(t, d.id)) : [];
                    return (
                      <li
                        key={chave(t)}
                        draggable={destinos.length > 0}
                        onDragStart={(e) => {
                          e.dataTransfer.effectAllowed = "move";
                          e.dataTransfer.setData("text/plain", chave(t));
                          setArrastando(chave(t));
                        }}
                        onDragEnd={() => { setArrastando(null); setAlvo(null); }}
                        className={cn(
                          "flex min-w-0 items-start gap-1 rounded-md border border-border bg-card p-3 transition-[border-color,opacity] duration-[var(--duration-fast)] hover:border-[var(--border-strong)] motion-safe:animate-in motion-safe:fade-in",
                          destinos.length > 0 && "cursor-grab active:cursor-grabbing",
                          arrastando === chave(t) && "opacity-50",
                        )}
                      >
                        <div className="min-w-0 flex-1">{cartao(t)}</div>
                        {destinos.length > 0 && (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`${tx.mover} ${rotuloItem(t)}`}
                              className={cn("-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground toque:size-11", foco)}
                            >
                              <MoveRight aria-hidden className="size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{tx.moverPara}</DropdownMenuLabel>
                              {destinos.map((d) => (
                                <DropdownMenuItem key={d.id} onSelect={() => onMover?.(t, d.id)}>{d.titulo}</DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {c.rodape && <div className="mt-2 px-2">{c.rodape}</div>}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export { Quadro };
