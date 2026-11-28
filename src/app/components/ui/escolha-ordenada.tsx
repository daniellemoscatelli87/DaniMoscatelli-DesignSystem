"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";
import { MensagemDeErro } from "./campo";

/**
 * EscolhaOrdenada (escolher até N opções, na ordem dos toques)
 *
 * Veio da pesquisa Moda em Curitiba (perguntas 2 e 5: "Escolha até 3, na ordem"). Classifica sem arrastar: o primeiro
 * toque é o 1º lugar, o próximo toque fica com o próximo lugar livre; tocar de novo numa escolhida tira-a, e as que
 * vinham depois sobem uma posição. Com o máximo atingido, as outras ficam travadas (a exclusiva continua livre). A
 * opção `exclusiva` ("Não comprei nenhuma peça este ano") fica sozinha: escolhê-la tira as outras, e escolher outra
 * tira a exclusiva. O valor é a lista dos `valor` na ordem dos toques.
 *
 * - Aparência: a moldura do CartaoDeEscolha (borda de 2 px; hover cinza --muted; escolhida: borda primária e fundo no
 *   rosa de selecionado --primary-suave; travada: --disabled). À esquerda, um selo redondo de 32 px: vazio com contorno
 *   (--input); escolhido, cheio na primária com "1º", "2º", "3º"; na exclusiva, o check. Embaixo, a contagem.
 * - Movimento: o selo entra com um pulo curto (--duration-fast) ao ganhar o número; parado com "menos movimento".
 * - Acessibilidade: cada opção é uma caixa de marcar nativa, com o cartão inteiro como rótulo e alvo de toque (44 px ou
 *   mais); o nome lido inclui a posição ("Marketplaces, 1º lugar"); uma região aria-live anuncia cada mudança
 *   ("Marketplaces: 1º lugar."). Dê nome ao grupo com `rotulo` (fica só para leitores de tela) ou `aria-labelledby`.
 * - Estados: erro (MensagemDeErro embaixo e borda de erro nas opções), desabilitado e somente leitura.
 */

export type OpcaoOrdenada = { valor: string; titulo: string; descricao?: React.ReactNode; exclusiva?: boolean };

const TEXTOS = {
  lugar: (n: number) => `${n}º lugar`,
  selo: (n: number) => `${n}º`,
  escolhida: "escolhida",
  vazia: (max: number) => `Toque em até ${max} ${max === 1 ? "opção" : "opções"}, na ordem.`,
  contagem: (n: number, max: number) => `${n} de até ${max} ${max === 1 ? "escolhida" : "escolhidas"} · toque de novo para tirar`,
  exclusiva: "Escolhida · toque de novo para tirar",
  entrou: (t: string, n: number) => `${t}: ${n}º lugar.`,
  saiu: (t: string) => `${t}: tirada.`,
  exclusivaEntrou: (t: string) => `${t}: escolhida. As outras foram tiradas.`,
};

export type EscolhaOrdenadaProps = {
  opcoes: OpcaoOrdenada[];
  /** Os valores escolhidos, na ordem dos toques. */
  valor: string[];
  onValorChange: (valor: string[]) => void;
  /** Quantas opções podem ser escolhidas (padrão 3). */
  maximo?: number;
  /** Nome do grupo para leitores de tela (quando não há aria-labelledby). */
  rotulo?: string;
  "aria-labelledby"?: string;
  erro?: React.ReactNode;
  desabilitado?: boolean;
  /** Mostra a resposta sem deixar mudar (área restrita). */
  somenteLeitura?: boolean;
  /** Nome das caixas de marcar no formulário. */
  name?: string;
  textos?: Partial<typeof TEXTOS>;
  className?: string;
};

/** A próxima lista depois de tocar em `v` (regras da pesquisa). */
export function proximaOrdem(atual: string[], v: string, opcoes: OpcaoOrdenada[], maximo: number) {
  const exclusiva = (x: string) => !!opcoes.find(o => o.valor === x)?.exclusiva;
  if (atual.includes(v)) return atual.filter(x => x !== v);
  if (exclusiva(v)) return [v];
  const semExclusiva = atual.filter(x => !exclusiva(x));
  if (semExclusiva.length >= maximo) return atual;
  return [...semExclusiva, v];
}

function EscolhaOrdenada({
  opcoes, valor, onValorChange, maximo = 3, rotulo, "aria-labelledby": rotuladoPor, erro, desabilitado = false, somenteLeitura = false, name, textos, className,
}: EscolhaOrdenadaProps) {
  const tx = { ...TEXTOS, ...textos };
  const id = React.useId();
  const [anuncio, setAnuncio] = React.useState("");
  const temExclusiva = valor.some(v => opcoes.find(o => o.valor === v)?.exclusiva);
  const comuns = valor.filter(v => !opcoes.find(o => o.valor === v)?.exclusiva).length;
  const cheio = comuns >= maximo;

  const tocar = (o: OpcaoOrdenada) => {
    if (desabilitado || somenteLeitura) return;
    const nova = proximaOrdem(valor, o.valor, opcoes, maximo);
    if (nova === valor) return;
    onValorChange(nova);
    const pos = nova.indexOf(o.valor);
    setAnuncio(pos < 0 ? tx.saiu(o.titulo) : o.exclusiva ? tx.exclusivaEntrou(o.titulo) : tx.entrou(o.titulo, pos + 1));
  };

  const contagem = temExclusiva ? tx.exclusiva : valor.length === 0 ? tx.vazia(maximo) : tx.contagem(comuns, maximo);

  return (
    <div data-slot="escolha-ordenada" className={cn("grid min-w-0 gap-3", className)}>
      <div
        role="group"
        aria-label={rotuladoPor ? undefined : rotulo}
        aria-labelledby={rotuladoPor}
        aria-describedby={[`${id}-contagem`, erro ? `${id}-erro` : null].filter(Boolean).join(" ")}
        className="grid gap-3"
      >
        {opcoes.map(o => {
          const pos = valor.indexOf(o.valor);
          const escolhida = pos >= 0;
          const travada = desabilitado || (!escolhida && !o.exclusiva && cheio && !temExclusiva);
          const idDaOpcao = `${id}-${o.valor}`;
          return (
            <label
              key={o.valor}
              htmlFor={idDaOpcao}
              data-slot="opcao-ordenada"
              data-escolhida={escolhida || undefined}
              data-travada={travada || undefined}
              className={cn(
                "relative flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-3 transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                escolhida
                  ? "border-primary bg-primary-suave"
                  : travada
                    ? "border-border bg-disabled"
                    : cn("bg-card hover:bg-muted", erro ? "border-error" : "border-border hover:border-[var(--border-strong)]"),
                travada ? "cursor-not-allowed" : somenteLeitura ? "cursor-default" : "cursor-pointer",
              )}
            >
              <input
                id={idDaOpcao}
                type="checkbox"
                name={name}
                value={o.valor}
                checked={escolhida}
                disabled={travada}
                readOnly={somenteLeitura}
                aria-invalid={erro && !escolhida ? true : undefined}
                onChange={() => tocar(o)}
                className="peer sr-only"
              />
              <span
                key={escolhida ? `pos-${pos}` : "vazio"}
                aria-hidden
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-body-sm font-bold tabular-nums",
                  escolhida
                    ? "bg-primary text-primary-foreground motion-safe:animate-in motion-safe:zoom-in-75 motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-out)]"
                    : cn("border-2 bg-card", travada ? "border-[var(--border-strong)]" : "border-input"),
                )}
              >
                {escolhida && (o.exclusiva ? <Check className="size-4" strokeWidth={3} /> : tx.selo(pos + 1))}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block text-body leading-snug text-pretty", escolhida ? "font-semibold text-foreground" : travada ? "text-disabled-foreground" : "text-foreground")}>
                  {o.titulo}
                  {escolhida && <span className="sr-only">, {o.exclusiva ? tx.escolhida : tx.lugar(pos + 1)}</span>}
                </span>
                {o.descricao && <span className={cn("mt-1 block text-body-sm leading-5", travada ? "text-disabled-foreground" : "text-muted-foreground")}>{o.descricao}</span>}
              </span>
            </label>
          );
        })}
      </div>
      <p id={`${id}-contagem`} className="m-0 text-body-sm text-muted-foreground">{contagem}</p>
      {erro && <MensagemDeErro id={`${id}-erro`}>{erro}</MensagemDeErro>}
      <span className="sr-only" aria-live="polite">{anuncio}</span>
    </div>
  );
}

export { EscolhaOrdenada };
