"use client";

import * as React from "react";
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import { EstadoVazio } from "./estado-vazio";

/**
 * AgendaDoMes (calendário do mês com compromissos)
 *
 * O mês inteiro com os compromissos de cada dia e, ao lado (ou embaixo, quando não cabe), a lista do dia escolhido,
 * num card só, separados por um divisor. Veio das Reuniões da área restrita (calendário `cal-*` feito à mão) e segue a
 * especificação de ADMIN_REACT.md §7.1. O Calendar do DS continua sendo o seletor de data de um campo; esta agenda
 * serve para ver o mês e o que acontece em cada dia.
 *
 * Responsiva pela própria largura (container query):
 * - a partir de 56rem: o mês à esquerda e a lista do dia à direita (20rem); os dias mostram até 2 compromissos
 *   pelo nome e "+N";
 * - abaixo disso: o mês em cima (cada dia mostra só pontos, até 3) e a lista do dia embaixo, na largura toda.
 * Estados: hoje com contorno e o número em negrito; dia escolhido no rosa de selecionado (--primary-suave, texto
 * --primary-text), nunca vermelho cheio; dia só com compromissos passados com pontos cinza; dias de outro mês
 * esmaecidos; hover cinza (--accent). Com diasSemEventos="inativos", só os dias com compromisso podem ser escolhidos.
 * Teclado: a grade é um grid (role="grid"); setas andam entre os dias (pulando os inativos), Home/End vão ao início e
 * ao fim da semana, PageUp/PageDown trocam o mês; Enter ou espaço escolhem. Cada dia tem nome completo para leitores de
 * tela ("terça, 25 de novembro, 2 compromissos"; troque com rotuloDoDia). Botões de mês com 44 px no toque.
 */

export type TomDoEvento = "marca" | "neutro" | "sucesso" | "info" | "aviso";
export type EventoDaAgenda = {
  id?: string;
  /** Dia do compromisso: Date ou "AAAA-MM-DD". */
  data: Date | string;
  titulo?: string;
  /** "14:00" ou "14:00–15:00" */
  hora?: string;
  descricao?: string;
  tom?: TomDoEvento;
  /** Compromisso que já passou (ponto cinza). */
  passado?: boolean;
};

const COR_DO_PONTO: Record<TomDoEvento, string> = {
  marca: "bg-primary",
  neutro: "bg-muted-foreground",
  sucesso: "bg-success",
  info: "bg-info",
  aviso: "bg-warning",
};
const corDoPonto = (e: EventoDaAgenda) => (e.passado ? "bg-graphite-300" : COR_DO_PONTO[e.tom ?? "marca"]);

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const deIso = (s: string) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
const paraIso = (v: Date | string) => (typeof v === "string" ? v.slice(0, 10) : iso(v));
const somarDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const inicioDoMes = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export type AgendaDoMesProps = {
  eventos: EventoDaAgenda[];
  /** Dia escolhido (controlado). `selecionado` e `dia` são o mesmo; use um dos dois. */
  selecionado?: Date | string;
  dia?: string;
  diaInicial?: Date | string;
  aoSelecionar?: (dia: Date) => void;
  onDiaChange?: (dia: string) => void;
  /** Mês mostrado (controlado; qualquer dia do mês). Sem ele, segue o dia escolhido. */
  mes?: Date;
  aoMudarMes?: (mes: Date) => void;
  /** Hoje (padrão: a data do aparelho). */
  hoje?: Date | string;
  /** Nome do dia para leitores de tela (padrão: "terça, 25 de novembro, 2 compromissos"). */
  rotuloDoDia?: (dia: Date, eventos: EventoDaAgenda[]) => string;
  /** "focaveis" (padrão): todo dia pode ser escolhido. "inativos": dias sem compromisso não recebem foco nem clique. */
  diasSemEventos?: "focaveis" | "inativos";
  /** Mostra a lista do dia escolhido (padrão: sim). */
  mostrarLista?: boolean;
  renderEvento?: (e: EventoDaAgenda) => React.ReactNode;
  acoesDoDia?: React.ReactNode;
  locale?: string;
  textos?: { anterior?: string; proximo?: string; hoje?: string; semEventos?: string; semEventosTexto?: string; compromisso?: string; compromissos?: string };
  className?: string;
};

function AgendaDoMes({
  eventos, selecionado, dia: diaProp, diaInicial, aoSelecionar, onDiaChange, mes: mesProp, aoMudarMes, hoje: hojeProp,
  rotuloDoDia, diasSemEventos = "focaveis", mostrarLista = true, renderEvento, acoesDoDia, locale = "pt-BR", textos, className,
}: AgendaDoMesProps) {
  const tx = {
    anterior: "Mês anterior", proximo: "Próximo mês", hoje: "hoje", semEventos: "Nenhum compromisso neste dia",
    semEventosTexto: "Escolha outro dia no calendário para ver os compromissos.", compromisso: "compromisso", compromissos: "compromissos",
    ...textos,
  };
  const hoje = hojeProp ? paraIso(hojeProp) : iso(new Date());
  const controlado = selecionado ?? diaProp;
  const [diaInterno, setDiaInterno] = React.useState(diaInicial ? paraIso(diaInicial) : hoje);
  const dia = controlado !== undefined ? paraIso(controlado) : diaInterno;
  const [mesInterno, setMesInterno] = React.useState(() => inicioDoMes(deIso(dia)));
  const mes = mesProp ? inicioDoMes(mesProp) : mesInterno;
  const gradeRef = React.useRef<HTMLDivElement>(null);
  const idDoDia = React.useId();
  const focarAoMudar = React.useRef(false);

  const mudarMes = React.useCallback((m: Date) => {
    const novo = inicioDoMes(m);
    if (!mesProp) setMesInterno(novo);
    aoMudarMes?.(novo);
  }, [mesProp, aoMudarMes]);

  // O mês acompanha o dia escolhido quando o mês não é controlado.
  React.useEffect(() => {
    if (mesProp) return;
    setMesInterno(m => (iso(inicioDoMes(deIso(dia))) === iso(m) ? m : inicioDoMes(deIso(dia))));
  }, [dia, mesProp]);
  React.useEffect(() => {
    if (!focarAoMudar.current) return;
    focarAoMudar.current = false;
    gradeRef.current?.querySelector<HTMLElement>(`[data-dia="${dia}"]`)?.focus();
  }, [dia, mes]);

  const porDia = React.useMemo(() => {
    const m = new Map<string, EventoDaAgenda[]>();
    for (const e of eventos) { const k = paraIso(e.data); m.set(k, [...(m.get(k) ?? []), e]); }
    for (const l of m.values()) l.sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""));
    return m;
  }, [eventos]);
  const ativo = (k: string) => diasSemEventos === "focaveis" || porDia.has(k);

  const escolher = (k: string, focar = false) => {
    focarAoMudar.current = focar;
    if (controlado === undefined) setDiaInterno(k);
    onDiaChange?.(k);
    aoSelecionar?.(deIso(k));
    if (mesProp && iso(inicioDoMes(deIso(k))) !== iso(mes)) mudarMes(deIso(k));
  };

  // Semana começa no domingo (padrão brasileiro). 6 linhas sempre, para a altura não pular entre os meses.
  const primeiro = somarDias(mes, -mes.getDay());
  const dias = Array.from({ length: 42 }, (_, i) => somarDias(primeiro, i));
  const nomeDoMes = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(mes);
  const semana = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(somarDias(primeiro, i)).replace(".", ""));
  const nomeCompleto = (d: Date) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(d);
  const contar = (n: number) => `${n} ${n === 1 ? tx.compromisso : tx.compromissos}`;
  const rotulo = (d: Date, lista: EventoDaAgenda[]) =>
    rotuloDoDia ? rotuloDoDia(d, lista) : `${nomeCompleto(d)}${iso(d) === hoje ? `, ${tx.hoje}` : ""}${lista.length ? `, ${contar(lista.length)}` : ""}`;

  // Anda pelos dias pulando os inativos (no máximo 6 semanas).
  const mover = (passo: number) => {
    let d = deIso(dia);
    for (let i = 0; i < 42; i++) {
      d = somarDias(d, passo);
      if (ativo(iso(d))) return escolher(iso(d), true);
    }
  };
  const trocarMes = (n: number) => {
    const d = deIso(dia);
    const alvo = new Date(d.getFullYear(), d.getMonth() + n, 1);
    if (diasSemEventos === "inativos") {
      mudarMes(alvo);
      const primeiroComEvento = [...porDia.keys()].filter(k => k.startsWith(iso(alvo).slice(0, 7))).sort()[0];
      if (primeiroComEvento) escolher(primeiroComEvento);
      return;
    }
    const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
    const k = iso(new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(d.getDate(), ultimo)));
    mudarMes(alvo);
    escolher(k);
  };
  const aoTeclar = (e: React.KeyboardEvent) => {
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => mover(-1), ArrowRight: () => mover(1), ArrowUp: () => mover(-7), ArrowDown: () => mover(7),
      Home: () => mover(-Math.max(1, deIso(dia).getDay())), End: () => mover(Math.max(1, 6 - deIso(dia).getDay())),
      PageUp: () => { focarAoMudar.current = true; trocarMes(-1); }, PageDown: () => { focarAoMudar.current = true; trocarMes(1); },
    };
    const f = mapa[e.key];
    if (f) { e.preventDefault(); f(); }
  };

  const doDia = porDia.get(dia) ?? [];
  const botaoMes = "flex size-10 toque:size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  // O dia que recebe o Tab: o escolhido, se estiver ativo neste mês; senão, o primeiro dia ativo do mês.
  const alvoDoTab = (() => {
    const doMes = dias.filter(d => d.getMonth() === mes.getMonth()).map(iso);
    if (doMes.includes(dia) && ativo(dia)) return dia;
    return doMes.find(ativo) ?? null;
  })();

  return (
    <div data-slot="agenda-do-mes" className={cn("@container/agenda w-full", className)}>
      <div className={cn("grid overflow-hidden rounded-xl border border-border bg-card", mostrarLista && "@min-[56rem]/agenda:grid-cols-[minmax(0,1fr)_20rem]")}>
        {/* Mês */}
        <div className="min-w-0 p-3 @min-[40rem]/agenda:p-6">
          <div className="mb-4 flex items-center justify-between gap-2 pl-1">
            <h3 aria-live="polite" className="text-subtitle font-semibold text-foreground first-letter:uppercase">{nomeDoMes}</h3>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => trocarMes(-1)} aria-label={tx.anterior} className={botaoMes}><ChevronLeft aria-hidden className="size-5" /></button>
              <button type="button" onClick={() => trocarMes(1)} aria-label={tx.proximo} className={botaoMes}><ChevronRight aria-hidden className="size-5" /></button>
            </div>
          </div>
          <div ref={gradeRef} role="grid" aria-label={nomeDoMes} onKeyDown={aoTeclar}>
            <div role="row" className="grid grid-cols-7">
              {semana.map(s => (
                <span key={s} role="columnheader" className="pb-2 text-center text-label font-semibold uppercase tracking-[0.06em] text-muted-foreground">{s}</span>
              ))}
            </div>
            {Array.from({ length: 6 }, (_, l) => (
              <div role="row" key={l} className="grid grid-cols-7 @min-[40rem]/agenda:gap-1">
                {dias.slice(l * 7, l * 7 + 7).map(d => {
                  const chave = iso(d);
                  const lista = porDia.get(chave) ?? [];
                  const foraDoMes = d.getMonth() !== mes.getMonth();
                  const ehHoje = chave === hoje;
                  const escolhido = chave === dia;
                  const podeEscolher = ativo(chave);
                  return (
                    <div role="gridcell" key={chave} aria-selected={escolhido} aria-disabled={!podeEscolher || undefined} className="relative min-w-0 py-1">
                      <div
                        className={cn(
                          "pointer-events-none flex h-12 w-full min-w-0 flex-col items-center gap-1 rounded-md border px-1 pt-1 text-body-sm transition-colors duration-[var(--duration-fast)]",
                          "@min-[40rem]/agenda:h-24 @min-[40rem]/agenda:items-stretch @min-[40rem]/agenda:px-2 @min-[40rem]/agenda:pt-2",
                          escolhido ? "border-primary bg-primary-suave text-primary-text" : ehHoje ? "border-foreground" : "border-transparent",
                          foraDoMes ? "text-muted-foreground/60" : !escolhido && (podeEscolher ? "text-foreground" : "text-muted-foreground"),
                        )}
                      >
                        <span aria-hidden className={cn("tabular-nums @min-[40rem]/agenda:self-start", ehHoje && "font-bold")}>{d.getDate()}</span>
                        {/* Estreito: pontos */}
                        {lista.length > 0 && (
                          <span aria-hidden className="flex gap-1 @min-[40rem]/agenda:hidden">
                            {lista.slice(0, 3).map((e, i) => <span key={e.id ?? i} className={cn("size-1.5 rounded-full", corDoPonto(e))} />)}
                          </span>
                        )}
                        {/* Largo: nomes */}
                        {lista.length > 0 && (
                          <span aria-hidden className="hidden min-w-0 flex-col gap-1 @min-[40rem]/agenda:flex">
                            {lista.slice(0, 2).map((e, i) => (
                              <span key={e.id ?? i} className={cn("flex min-w-0 items-center gap-1 text-left text-label leading-tight", e.passado ? "text-muted-foreground" : "text-foreground")}>
                                <span className={cn("size-1.5 shrink-0 rounded-full", corDoPonto(e))} />
                                <span className="truncate">{e.hora ? `${e.hora} ` : ""}{e.titulo}</span>
                              </span>
                            ))}
                            {lista.length > 2 && <span className="text-left text-label font-semibold text-muted-foreground">+{lista.length - 2}</span>}
                          </span>
                        )}
                      </div>
                      {/* O botão cobre a célula; o texto do dia fica no rótulo. */}
                      {podeEscolher && (
                        <button
                          type="button"
                          data-dia={chave}
                          tabIndex={chave === alvoDoTab ? 0 : -1}
                          onClick={() => escolher(chave)}
                          aria-label={rotulo(d, lista)}
                          aria-current={ehHoje ? "date" : undefined}
                          aria-pressed={escolhido}
                          className={cn(
                            "absolute inset-x-0 inset-y-1 rounded-md transition-colors duration-[var(--duration-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            !escolhido && "hover:bg-accent/60",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Lista do dia */}
        {mostrarLista && (
          <section aria-labelledby={idDoDia} className="min-w-0 border-t border-border @min-[56rem]/agenda:border-l @min-[56rem]/agenda:border-t-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 @min-[40rem]/agenda:px-6">
              <div className="min-w-0">
                <h3 id={idDoDia} className="text-body font-semibold text-foreground first-letter:uppercase">{nomeCompleto(deIso(dia))}</h3>
                <p className="text-body-sm text-muted-foreground">{doDia.length ? contar(doDia.length) : tx.semEventos}</p>
              </div>
              {acoesDoDia}
            </div>
            {doDia.length ? (
              <ul className="divide-y divide-border">
                {doDia.map((e, i) => (
                  <li key={e.id ?? i} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 px-4 py-3 @min-[40rem]/agenda:px-6 motion-safe:animate-in motion-safe:fade-in">
                    {renderEvento ? <div className="col-span-2">{renderEvento(e)}</div> : (
                      <>
                        <span aria-hidden className={cn("mt-2 size-2 rounded-full", corDoPonto(e))} />
                        <div className="min-w-0">
                          {e.hora && <p className="text-label font-semibold tabular-nums text-muted-foreground">{e.hora}</p>}
                          <p className="text-body-sm font-semibold text-foreground [overflow-wrap:anywhere]">{e.titulo}</p>
                          {e.descricao && <p className="mt-1 text-body-sm text-muted-foreground">{e.descricao}</p>}
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EstadoVazio tamanho="sm" nivel={4} icone={<CalendarX2 />} titulo={tx.semEventos} descricao={tx.semEventosTexto} className="px-4" />
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export { AgendaDoMes };
