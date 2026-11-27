"use client";

import * as React from "react";
import { ArrowLeft, Inbox } from "lucide-react";
import { cn } from "./utils";
import { LinhaDeLista } from "./linha-de-lista";
import { EstadoVazio } from "./estado-vazio";

/**
 * CaixaDeEntrada (lista de mensagens + painel de leitura)
 *
 * Mensagens, contatos ou notificações numa lista à esquerda e a mensagem aberta à direita, como o Contato da área
 * restrita (Recebidos/Enviados) e o template Caixa de entrada, que era só demonstração e quebrava no celular.
 *
 * Responsiva pela própria largura (container query), não pela tela:
 * - a partir de 48rem (768 px): lista (20rem) e leitura lado a lado; sem mensagem aberta, a leitura mostra um
 *   estado vazio ("Escolha uma mensagem");
 * - abaixo disso: uma coisa por vez. A lista ocupa tudo; ao abrir uma mensagem, a leitura ocupa o lugar da lista,
 *   com "Voltar" no topo (o foco vai para o título da mensagem e, ao voltar, para a linha que estava aberta).
 *
 * Linhas: LinhaDeLista (hover cinza de ponta a ponta; aberta no rosa de selecionado, --primary-suave, com a barra na
 * primária à esquerda). Não lida: título em negrito, ponto na primária numa coluna própria e "não lida" para leitores
 * de tela. O texto nunca passa por baixo da data.
 * O conteúdo da leitura é livre (renderLeitura): use Conversa, botões e anexos do DS.
 */

export type ItemDaCaixa = {
  id: string;
  titulo: React.ReactNode;
  /** Primeira linha da mensagem (uma linha, com reticências). */
  resumo?: React.ReactNode;
  /** Data ou hora curta ("09:42", "Ontem", "24/11"). */
  quando?: React.ReactNode;
  lida?: boolean;
  /** Avatar ou ícone (IconeComBase) da coluna do início. */
  inicio?: React.ReactNode;
  /** Etiqueta curta embaixo do resumo (ChipDeEstado). */
  etiqueta?: React.ReactNode;
};

export type CaixaDeEntradaProps = {
  itens: ItemDaCaixa[];
  /** Mensagem aberta (controlado). Sem ela, a caixa guarda a seleção sozinha. */
  aberta?: string | null;
  abertaInicial?: string | null;
  /** Abre (id) ou fecha (null, pelo Voltar) uma mensagem. */
  onAbrir?: (id: string | null) => void;
  renderLeitura: (item: ItemDaCaixa) => React.ReactNode;
  /** Cabeçalho da lista: título, contador, abas ou filtros. */
  topo?: React.ReactNode;
  /** Estado da lista vazia (padrão: "Nenhuma mensagem por aqui"). */
  vazio?: React.ReactNode;
  /** Painel de leitura sem mensagem aberta (computador). */
  semSelecao?: React.ReactNode;
  rotulo?: string;
  textos?: { voltar?: string; naoLida?: string };
  className?: string;
};

function CaixaDeEntrada({
  itens,
  aberta: abertaProp,
  abertaInicial = null,
  onAbrir,
  renderLeitura,
  topo,
  vazio,
  semSelecao,
  rotulo = "Mensagens",
  textos,
  className,
}: CaixaDeEntradaProps) {
  const tx = { voltar: "Voltar", naoLida: "não lida", ...textos };
  const [interna, setInterna] = React.useState<string | null>(abertaInicial);
  const aberta = abertaProp !== undefined ? abertaProp : interna;
  const item = itens.find(i => i.id === aberta) ?? null;
  const tituloRef = React.useRef<HTMLDivElement>(null);
  const raizRef = React.useRef<HTMLDivElement>(null);
  const ultimaAberta = React.useRef<string | null>(null);

  const abrir = (id: string | null) => {
    if (abertaProp === undefined) setInterna(id);
    onAbrir?.(id);
  };

  // Ao abrir, o foco vai para a leitura; ao voltar (celular), para a linha que estava aberta.
  const montada = React.useRef(false);
  React.useEffect(() => {
    if (!montada.current) { montada.current = true; ultimaAberta.current = aberta; return; }
    if (aberta) {
      ultimaAberta.current = aberta;
      tituloRef.current?.focus({ preventScroll: true });
    } else if (ultimaAberta.current) {
      raizRef.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(ultimaAberta.current)}"]`)?.focus({ preventScroll: true });
    }
  }, [aberta]);

  return (
    <div ref={raizRef} data-slot="caixa-de-entrada" data-lendo={item ? "sim" : "nao"} className={cn("@container/caixa h-full min-h-0 w-full overflow-hidden rounded-xl border border-border bg-card", className)}>
      <div className="grid h-full min-h-0 grid-cols-1 @min-[48rem]/caixa:grid-cols-[20rem_minmax(0,1fr)]">
        {/* Lista */}
        <section
          aria-label={rotulo}
          className={cn("flex min-h-0 min-w-0 flex-col @min-[48rem]/caixa:border-r @min-[48rem]/caixa:border-border", item && "@max-[48rem]/caixa:hidden")}
        >
          {topo && <div className="shrink-0 border-b border-border px-4 py-3">{topo}</div>}
          {itens.length === 0 ? (
            <div className="flex flex-1 items-center px-4">
              {vazio ?? <EstadoVazio tamanho="sm" icone={<Inbox />} titulo="Nenhuma mensagem por aqui" descricao="Quando alguém escrever, a mensagem aparece nesta lista." />}
            </div>
          ) : (
            <ul className="min-h-0 flex-1 divide-y divide-border overflow-y-auto">
              {itens.map(i => {
                const selecionada = i.id === aberta;
                return (
                  <li key={i.id}>
                    <LinhaDeLista
                      as="button"
                      data-id={i.id}
                      aria-current={selecionada ? "true" : undefined}
                      selecionada={selecionada}
                      onClick={() => abrir(i.id)}
                      quebraAcoes={false}
                      inicio={i.inicio}
                      className={cn("relative py-4 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-transparent", selecionada && "before:bg-primary")}
                      titulo={
                        <span className={cn("block truncate", i.lida === false ? "font-bold text-foreground" : "font-semibold text-foreground")}>
                          {i.titulo}
                          {i.lida === false && <span className="sr-only"> ({tx.naoLida})</span>}
                        </span>
                      }
                      descricao={i.resumo != null ? <span className="block truncate text-sm">{i.resumo}</span> : undefined}
                      fim={
                        <span className="flex items-center gap-2">
                          {i.quando != null && <span className="whitespace-nowrap text-xs text-muted-foreground">{i.quando}</span>}
                          <span aria-hidden className={cn("size-2 shrink-0 rounded-full", i.lida === false ? "bg-primary" : "bg-transparent")} />
                        </span>
                      }
                    >
                      {i.etiqueta && <span className="mt-2 flex">{i.etiqueta}</span>}
                    </LinhaDeLista>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Leitura */}
        <section
          aria-label={item ? undefined : rotulo}
          className={cn("min-h-0 min-w-0 flex-col overflow-y-auto", item ? "flex" : "hidden @min-[48rem]/caixa:flex")}
        >
          {item ? (
            <div
              key={item.id}
              ref={tituloRef}
              tabIndex={-1}
              className="flex min-h-full flex-col outline-none motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-[var(--duration-normal)]"
            >
              <div className="shrink-0 border-b border-border px-2 py-2 @min-[48rem]/caixa:hidden">
                <button
                  type="button"
                  onClick={() => abrir(null)}
                  className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ArrowLeft aria-hidden className="size-4" /> {tx.voltar}
                </button>
              </div>
              <div className="flex-1 p-4 @min-[32rem]/caixa:p-6">{renderLeitura(item)}</div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              {semSelecao ?? <EstadoVazio tamanho="sm" icone={<Inbox />} titulo="Escolha uma mensagem" descricao="A mensagem aberta aparece aqui, com o histórico e a resposta." />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export { CaixaDeEntrada };
