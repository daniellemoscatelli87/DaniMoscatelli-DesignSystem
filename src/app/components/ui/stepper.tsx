"use client";

import * as React from "react";
import { cn } from "./utils";

/**
 * Stepper (indicador de etapas) — progresso de um formulário em várias telas.
 *
 * Trazido do FindLook Design System (mesmo nome e mesma API, 27/11/2026), com a escala deste DS: etapas em abas
 * numeradas ("01", "02"…), lado a lado sobre uma linha. Serve ao cadastro de parceiro da Rede de Parceiros e a
 * qualquer formulário em várias telas.
 * - Atual: número em círculo preenchido na primária, nome em negrito escuro e sublinhado de 3 px na primária
 *   (aria-current="step").
 * - Concluída: número em círculo preenchido em grafite escuro (--foreground); pode ser reaberta quando `onIrPara`
 *   é informado (voltar sem perder dados).
 * - Futura: número em círculo cinza claro (--secondary); não pode ser aberta antes da hora.
 *
 * Nomes completos sempre que cabem (decisão da dona do produto, 27/11/2026): o Stepper mede a largura que ele mesmo
 * tem (não a da tela) e, quando os nomes de todas as etapas não cabem inteiros, mostra "Etapa X de N · nome da etapa
 * atual" e só os números (os nomes continuam para leitores de tela). Nunca corta o nome com reticências. Funciona igual
 * na página inteira, num card estreito, numa gaveta ou ao lado de outra coluna. Antes da primeira medida (por exemplo,
 * no HTML gerado no servidor), vale a regra por largura do próprio Stepper: nomes a partir de 640 px. O estado nunca
 * depende só da cor: preenchimento escuro, primária ou claro, sublinhado na atual e o estado em texto para leitores
 * de tela.
 */
export type StepperEtapa = {
  titulo: string;
  /** Texto curto opcional; não aparece no visual de abas (fica para leitores de tela). */
  descricao?: string;
  /**
   * Segunda linha, embaixo do nome (uma data, "12/12, 14:00"), em cinza e menor (27/11/2026). Ponha a data aqui, e
   * não no título: o nome continua curto e o Stepper só fica compacto quando os nomes não cabem de verdade.
   */
  detalhe?: string;
};

export type StepperProps = {
  etapas: StepperEtapa[];
  /** Índice da etapa atual (começa em 0). */
  atual: number;
  /** Índices das etapas concluídas. Padrão: todas as anteriores à atual. */
  concluidas?: number[];
  /** Abre uma etapa concluída (voltar sem perder dados). Sem esta função, as etapas não são clicáveis. */
  onIrPara?: (indice: number) => void;
  /** Nome da navegação para leitores de tela (padrão: "Etapas"). */
  rotulo?: string;
  /** Textos da interface. */
  textos?: { etapa?: string; de?: string; concluida?: string; atualTexto?: string; pendente?: string; voltarPara?: string; todasConcluidas?: string };
  className?: string;
};

const numero = (i: number) => String(i + 1).padStart(2, "0");

const useLayoutSeguro = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** "auto": antes da medida (regra por largura do Stepper); "completo": todos os nomes cabem; "compacto": só números. */
type Modo = "auto" | "completo" | "compacto";

/* Classes de cada modo. No "auto", a regra é a container query do próprio Stepper (nomes a partir de 40rem). */
const porModo = {
  cabecalho: { auto: "@min-[40rem]/stepper:hidden", completo: "hidden", compacto: "" },
  nome: { auto: "hidden @min-[40rem]/stepper:flex", completo: "flex", compacto: "hidden" },
  marcador: {
    auto: "h-8 w-8 text-label @min-[40rem]/stepper:h-10 @min-[40rem]/stepper:w-10 @min-[40rem]/stepper:text-body-sm",
    completo: "h-10 w-10 text-body-sm",
    compacto: "h-8 w-8 text-label",
  },
  item: { auto: "pb-4 pt-1 @min-[40rem]/stepper:pb-5 @min-[40rem]/stepper:pt-4", completo: "pb-5 pt-4", compacto: "pb-4 pt-1" },
  lista: { auto: "gap-2 @min-[40rem]/stepper:gap-0", completo: "gap-0", compacto: "gap-2" },
} as const;

/* Tamanho do nome: maior quando o Stepper tem 60rem ou mais (no lugar do antigo lg: da tela). */
const nomeTexto = "text-body font-bold leading-tight @min-[60rem]/stepper:text-subtitle";

export function Stepper({ etapas, atual, concluidas, onIrPara, rotulo = "Etapas", textos, className }: StepperProps) {
  const tx = {
    etapa: "Etapa",
    de: "de",
    concluida: "concluída",
    atualTexto: "etapa atual",
    pendente: "pendente",
    voltarPara: "Voltar para",
    todasConcluidas: "Todas as etapas concluídas",
    ...textos,
  };
  const feitas = new Set(concluidas ?? etapas.map((_, i) => i).filter((i) => i < atual));
  const total = etapas.length;
  const corrente = etapas[atual];
  const navRef = React.useRef<HTMLElement>(null);
  const medidaRef = React.useRef<HTMLOListElement>(null);
  const [modo, setModo] = React.useState<Modo>("auto");
  const chaveDosNomes = etapas.map((e) => `${e.titulo}~${e.detalhe ?? ""}`).join("|");

  // Mede se todos os nomes cabem inteiros (27/11/2026): cada etapa ocupa a largura do próprio conteúdo (nome ou
  // detalhe, o que for maior) e o espaço que sobra é dividido entre elas; vale a soma real das larguras, não a
  // etapa mais larga vezes o número de etapas (que deixava o Stepper compacto cedo demais, com datas nos nomes).
  useLayoutSeguro(() => {
    const nav = navRef.current;
    const medida = medidaRef.current;
    if (!nav || !medida || typeof ResizeObserver === "undefined") return;
    const checar = () => {
      const itens = Array.from(medida.children) as HTMLElement[];
      const soma = itens.reduce((m, el) => m + el.getBoundingClientRect().width, 0);
      const largura = nav.getBoundingClientRect().width;
      if (!largura) return;
      setModo(soma <= largura + 0.5 ? "completo" : "compacto");
    };
    checar();
    const ro = new ResizeObserver(checar);
    ro.observe(nav);
    ro.observe(medida);
    document.fonts?.ready.then(checar).catch(() => undefined);
    return () => ro.disconnect();
  }, [chaveDosNomes]);

  return (
    <nav ref={navRef} aria-label={rotulo} data-slot="stepper" data-modo={modo} className={cn("@container/stepper relative w-full", className)}>
      {/* Medida invisível: cada etapa com o nome inteiro, no tamanho do modo completo. */}
      <div aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 h-0 overflow-hidden">
        <ol ref={medidaRef} className="flex w-max">
          {etapas.map((e, i) => (
            <li key={i} className="flex w-max items-center gap-3 whitespace-nowrap px-2">
              <span className="h-10 w-10 shrink-0" />
              <span className="flex flex-col">
                <span className={nomeTexto}>{e.titulo}</span>
                {e.detalhe && <span className="text-label">{e.detalhe}</span>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      {/* Sem espaço para os nomes: "Etapa X de N" e o nome da etapa atual. */}
      <p className={cn("mb-3 text-body-sm text-muted-foreground", porModo.cabecalho[modo])} aria-hidden>
        {corrente ? (
          <>
            {tx.etapa} {atual + 1} {tx.de} {total} · <span className="font-semibold text-foreground">{corrente.titulo}</span>
          </>
        ) : (
          <span className="font-semibold text-foreground">{tx.todasConcluidas}</span>
        )}
      </p>
      <ol className={cn("flex items-stretch border-b border-border", porModo.lista[modo])}>
        {etapas.map((e, i) => {
          const ehAtual = i === atual;
          const feita = feitas.has(i) && !ehAtual;
          const clicavel = Boolean(onIrPara) && feita;
          const estado = ehAtual ? tx.atualTexto : feita ? tx.concluida : tx.pendente;
          const conteudo = (
            <>
              <span
                aria-hidden
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-full font-extrabold tabular-nums transition-colors duration-[var(--duration-normal)] motion-reduce:transition-none",
                  porModo.marcador[modo],
                  ehAtual && "bg-primary text-primary-foreground",
                  feita && "bg-foreground text-background",
                  !feita && !ehAtual && "bg-secondary text-graphite-600",
                )}
              >
                {numero(i)}
              </span>
              <span aria-hidden data-slot="stepper-nome" className={cn("min-w-0 flex-col text-left", porModo.nome[modo])}>
                <span className={cn("whitespace-nowrap", nomeTexto, ehAtual ? "text-foreground" : "text-muted-foreground")}>{e.titulo}</span>
                {e.detalhe && <span className="whitespace-nowrap text-label font-medium text-muted-foreground">{e.detalhe}</span>}
              </span>
              {/* Sublinhado da etapa atual. */}
              {ehAtual && <span aria-hidden className="absolute inset-x-0 -bottom-px h-1 rounded-full bg-primary" />}
              <span className="sr-only">{`${clicavel ? `${tx.voltarPara} ${tx.etapa.toLowerCase()}` : tx.etapa} ${i + 1} ${tx.de} ${total}, ${e.titulo}${e.detalhe ? `, ${e.detalhe}` : ""} (${estado})`}</span>
            </>
          );
          const classe = cn("relative flex min-h-11 w-full min-w-0 items-center justify-center gap-3 px-2", porModo.item[modo]);
          return (
            <li key={i} className={cn("flex min-w-0", modo === "completo" ? "flex-[1_1_auto]" : "flex-1")} aria-current={ehAtual ? "step" : undefined}>
              {clicavel ? (
                <button
                  type="button"
                  onClick={() => onIrPara!(i)}
                  className={cn(classe, "rounded-t-md outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background")}
                >
                  {conteudo}
                </button>
              ) : (
                <span className={classe}>{conteudo}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
