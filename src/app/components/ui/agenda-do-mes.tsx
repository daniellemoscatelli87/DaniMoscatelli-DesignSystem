"use client";

import * as React from "react";
import { CalendarX2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "./utils";
import { EstadoVazio } from "./estado-vazio";

/**
 * AgendaDoMes (calendário do mês com compromissos)
 *
 * O mês inteiro com os compromissos de cada dia e, ao lado (ou embaixo, quando não cabe), a lista do dia escolhido.
 * Veio das Reuniões da área restrita (calendário `cal-*` feito à mão). O Calendar do DS serve para escolher uma data
 * num campo; esta agenda serve para ver o mês e o que acontece em cada dia.
 *
 * Responsiva pela própria largura (container query):
 * - a partir de 56rem: o mês à esquerda e a lista do dia à direita (20rem); os dias mostram até 2 compromissos
 *   pelo nome e "+N";
 * - abaixo disso: o mês em cima (cada dia mostra só pontos, até 3) e a lista do dia embaixo, na largura toda.
 * Estados: hoje (número em negrito na cor de texto da primária e "hoje" para leitores de tela), dia escolhido (rosa de
 * selecionado, --primary-suave, com borda na primária), dias de outro mês apagados, hover cinza (--accent).
 * Teclado: a grade é um grid (role="grid"); setas andam entre os dias, Home/End vão ao início e ao fim da semana,
 * PageUp/PageDown trocam o mês; Enter ou espaço escolhem. Cada dia tem nome completo ("terça, 25 de novembro, 2
 * compromissos"). Botões de mês anterior/próximo com 44 px no celular.
 */

export type TomDoEvento = "marca" | "neutro" | "sucesso" | "info" | "aviso";
export type EventoDaAgenda = {
  id: string;
  /** "AAAA-MM-DD" */
  data: string;
  titulo: string;
  /** "14:00" ou "14:00–15:00" */
  hora?: string;
  descricao?: string;
  tom?: TomDoEvento;
};

const COR_DO_PONTO: Record<TomDoEvento, string> = {
  marca: "bg-primary",
  neutro: "bg-muted-foreground",
  sucesso: "bg-success",
  info: "bg-info",
  aviso: "bg-warning",
};

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const deIso = (s: string) => { const [a, m, d] = s.split("-").map(Number); return new Date(a, m - 1, d); };
const somarDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const inicioDoMes = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export type AgendaDoMesProps = {
  eventos: EventoDaAgenda[];
  /** Dia escolhido ("AAAA-MM-DD"). Controlado com onDiaChange; sem ele, a agenda guarda sozinha. */
  dia?: string;
  diaInicial?: string;
  onDiaChange?: (dia: string) => void;
  /** Hoje (padrão: a data do aparelho). */
  hoje?: string;
  /** Conteúdo de cada compromisso na lista do dia (padrão: hora, título e descrição). */
  renderEvento?: (e: EventoDaAgenda) => React.ReactNode;
  /** Ações no topo da lista do dia (por exemplo, "Marcar reunião"). */
  acoesDoDia?: React.ReactNode;
  locale?: string;
  textos?: { anterior?: string; proximo?: string; hoje?: string; semEventos?: string; semEventosTexto?: string; compromisso?: string; compromissos?: string };
  className?: string;
};

function AgendaDoMes({ eventos, dia: diaProp, diaInicial, onDiaChange, hoje: hojeProp, renderEvento, acoesDoDia, locale = "pt-BR", textos, className }: AgendaDoMesProps) {
  const tx = {
    anterior: "Mês anterior", proximo: "Próximo mês", hoje: "hoje", semEventos: "Nenhum compromisso neste dia",
    semEventosTexto: "Escolha outro dia no calendário para ver os compromissos.", compromisso: "compromisso", compromissos: "compromissos",
    ...textos,
  };
  const hoje = hojeProp ?? iso(new Date());
  const [diaInterno, setDiaInterno] = React.useState(diaInicial ?? hoje);
  const dia = diaProp ?? diaInterno;
  const [mes, setMes] = React.useState(() => inicioDoMes(deIso(dia)));
  const gradeRef = React.useRef<HTMLDivElement>(null);
  const idDoDia = React.useId();
  const focarAoMudar = React.useRef(false);

  React.useEffect(() => { setMes(m => (iso(inicioDoMes(deIso(dia))) === iso(m) ? m : inicioDoMes(deIso(dia)))); }, [dia]);
  React.useEffect(() => {
    if (!focarAoMudar.current) return;
    focarAoMudar.current = false;
    gradeRef.current?.querySelector<HTMLElement>(`[data-dia="${dia}"]`)?.focus();
  }, [dia, mes]);

  const escolher = (d: string, focar = false) => {
    focarAoMudar.current = focar;
    if (diaProp === undefined) setDiaInterno(d);
    onDiaChange?.(d);
  };

  const porDia = React.useMemo(() => {
    const m = new Map<string, EventoDaAgenda[]>();
    for (const e of eventos) m.set(e.data, [...(m.get(e.data) ?? []), e]);
    for (const l of m.values()) l.sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""));
    return m;
  }, [eventos]);

  // Semana começa no domingo (padrão brasileiro). 6 linhas sempre, para a altura não pular entre os meses.
  const primeiro = somarDias(mes, -mes.getDay());
  const dias = Array.from({ length: 42 }, (_, i) => somarDias(primeiro, i));
  const nomeDoMes = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(mes);
  const semana = Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(locale, { weekday: "short" }).format(somarDias(primeiro, i)).replace(".", ""));
  const nomeCompleto = (d: Date) => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }).format(d);
  const contar = (n: number) => `${n} ${n === 1 ? tx.compromisso : tx.compromissos}`;

  const mover = (dias: number) => escolher(iso(somarDias(deIso(dia), dias)), true);
  const trocarMes = (n: number) => {
    const d = deIso(dia);
    const alvo = new Date(d.getFullYear(), d.getMonth() + n, 1);
    const ultimo = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
    escolher(iso(new Date(alvo.getFullYear(), alvo.getMonth(), Math.min(d.getDate(), ultimo))));
  };
  const aoTeclar = (e: React.KeyboardEvent) => {
    const mapa: Record<string, () => void> = {
      ArrowLeft: () => mover(-1), ArrowRight: () => mover(1), ArrowUp: () => mover(-7), ArrowDown: () => mover(7),
      Home: () => mover(-deIso(dia).getDay()), End: () => mover(6 - deIso(dia).getDay()),
      PageUp: () => { focarAoMudar.current = true; trocarMes(-1); }, PageDown: () => { focarAoMudar.current = true; trocarMes(1); },
    };
    const f = mapa[e.key];
    if (f) { e.preventDefault(); f(); }
  };

  const doDia = porDia.get(dia) ?? [];
  const botaoMes = "flex size-10 toque:size-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div data-slot="agenda-do-mes" className={cn("@container/agenda w-full", className)}>
      <div className="grid gap-6 @min-[56rem]/agenda:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Mês */}
        <div className="min-w-0 rounded-xl border border-border bg-card p-3 @min-[40rem]/agenda:p-6">
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
                  return (
                    <div role="gridcell" key={chave} aria-selected={escolhido} className="min-w-0 py-0.5">
                      <button
                        type="button"
                        data-dia={chave}
                        tabIndex={escolhido ? 0 : -1}
                        onClick={() => escolher(chave)}
                        aria-label={`${nomeCompleto(d)}${ehHoje ? `, ${tx.hoje}` : ""}${lista.length ? `, ${contar(lista.length)}` : ""}`}
                        aria-current={ehHoje ? "date" : undefined}
                        className={cn(
                          "flex h-12 w-full min-w-0 flex-col items-center justify-start gap-1 rounded-md border border-transparent px-1 pt-1 text-body-sm transition-colors duration-[var(--duration-fast)]",
                          "@min-[40rem]/agenda:h-24 @min-[40rem]/agenda:items-stretch @min-[40rem]/agenda:px-2 @min-[40rem]/agenda:pt-2",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          escolhido ? "border-primary bg-primary-suave" : "hover:bg-accent",
                          foraDoMes ? "text-muted-foreground/60" : "text-foreground",
                        )}
                      >
                        <span className={cn("tabular-nums @min-[40rem]/agenda:self-start", ehHoje && "font-bold text-primary-text underline decoration-2 underline-offset-4")}>{d.getDate()}</span>
                        {/* Estreito: pontos */}
                        {lista.length > 0 && (
                          <span aria-hidden className="flex gap-1 @min-[40rem]/agenda:hidden">
                            {lista.slice(0, 3).map(e => <span key={e.id} className={cn("size-1.5 rounded-full", COR_DO_PONTO[e.tom ?? "marca"])} />)}
                          </span>
                        )}
                        {/* Largo: nomes */}
                        {lista.length > 0 && (
                          <span aria-hidden className="hidden min-w-0 flex-col gap-1 @min-[40rem]/agenda:flex">
                            {lista.slice(0, 2).map(e => (
                              <span key={e.id} className="flex min-w-0 items-center gap-1 text-left text-label leading-tight text-foreground">
                                <span className={cn("size-1.5 shrink-0 rounded-full", COR_DO_PONTO[e.tom ?? "marca"])} />
                                <span className="truncate">{e.hora ? `${e.hora} ` : ""}{e.titulo}</span>
                              </span>
                            ))}
                            {lista.length > 2 && <span className="text-left text-label font-semibold text-muted-foreground">+{lista.length - 2}</span>}
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Lista do dia */}
        <section aria-labelledby={idDoDia} className="min-w-0 rounded-xl border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 @min-[40rem]/agenda:px-6">
            <div className="min-w-0">
              <h3 id={idDoDia} className="text-body font-semibold first-letter:uppercase text-foreground">{nomeCompleto(deIso(dia))}</h3>
              <p className="text-body-sm text-muted-foreground">{doDia.length ? contar(doDia.length) : tx.semEventos}</p>
            </div>
            {acoesDoDia}
          </div>
          {doDia.length ? (
            <ul className="divide-y divide-border">
              {doDia.map(e => (
                <li key={e.id} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 px-4 py-3 @min-[40rem]/agenda:px-6 motion-safe:animate-in motion-safe:fade-in">
                  {renderEvento ? <div className="col-span-2">{renderEvento(e)}</div> : (
                    <>
                      <span aria-hidden className={cn("mt-2 size-2 rounded-full", COR_DO_PONTO[e.tom ?? "marca"])} />
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
      </div>
    </div>
  );
}

export { AgendaDoMes };
