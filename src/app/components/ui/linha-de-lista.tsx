import * as React from "react";

import { cn } from "./utils";

/*
 * Linha de lista: início (caixa de seleção, avatar, ícone), conteúdo (título e descrição) e fim (tags, status, ações).
 *
 * Regras da dona do produto (24/11/2026):
 * 1. Nos grids, o texto nunca ultrapassa a coluna de tags ou ações. O conteúdo fica na coluna dele
 *    (minmax(0,1fr)) e quebra ou é encurtado ali dentro; a coluna do fim mantém a largura (auto). Sem espaço,
 *    as tags e ações descem para uma linha própria abaixo de todo o texto (quebraAcoes), nunca ao lado de um
 *    texto que continua por baixo delas.
 *    Decisão da dona do produto (27/11/2026): no celular, tags e ações descem para uma linha própria embaixo do
 *    texto, que usa a largura toda. É o padrão (quebraAcoes="estreito"); quebraAcoes={false} as mantém ao lado
 *    do texto em qualquer largura, e quebraAcoes={true} as põe embaixo sempre.
 * 2. O hover da linha cobre a linha inteira, de ponta a ponta, sem cantos arredondados (--row-hover). A linha
 *    selecionada tem a mesma forma, e o foco do teclado é um contorno por dentro, também sem cantos.
 *
 * Documentação: Dados > Tabelas e Cards > Comportamento responsivo.
 */

type Elemento = "div" | "li" | "button" | "a" | "label";

export type LinhaDeListaProps = Omit<React.HTMLAttributes<HTMLElement>, "title"> & {
  /** Elemento da linha. Use "li" dentro de ul/ol; "button", "a" ou "label" quando a linha inteira é clicável. */
  as?: Elemento;
  href?: string;
  type?: "button" | "submit" | "reset";
  htmlFor?: string;
  /** Coluna do início: caixa de seleção, avatar ou ícone. */
  inicio?: React.ReactNode;
  titulo?: React.ReactNode;
  descricao?: React.ReactNode;
  /** Coluna do fim: tags, status e ações. Mantém a largura; o texto nunca passa por baixo dela. */
  fim?: React.ReactNode;
  /**
   * "estreito" (padrão, decisão de 27/11/2026): no celular (abaixo de 640 px), as tags e ações descem para uma linha
   * própria embaixo do texto, que usa a largura toda. true: embaixo sempre. false: ao lado do texto em qualquer largura.
   */
  quebraAcoes?: boolean | "estreito";
  /** Lado das tags e ações quando descem para baixo do texto. */
  alinharAcoesAbaixo?: "fim" | "inicio";
  /** "centro" centraliza início e fim na altura da linha (do tablet em diante); "inicio" alinha tudo no topo. */
  alinhar?: "inicio" | "centro";
  /** Pinta o hover (--row-hover) na linha inteira. Padrão: ligado quando a linha é botão, link ou rótulo. */
  interativa?: boolean;
  selecionada?: boolean;
};

const COLUNAS = {
  tres: "grid-cols-[auto_minmax(0,1fr)_auto]",
  inicioEConteudo: "grid-cols-[auto_minmax(0,1fr)]",
  conteudoEFim: "grid-cols-[minmax(0,1fr)_auto]",
  conteudo: "grid-cols-[minmax(0,1fr)]",
};

export function LinhaDeLista({
  as = "div",
  inicio,
  titulo,
  descricao,
  fim,
  quebraAcoes = "estreito",
  alinharAcoesAbaixo = "fim",
  alinhar = "inicio",
  interativa,
  selecionada = false,
  className,
  children,
  ...props
}: LinhaDeListaProps) {
  const Comp = as as React.ElementType;
  // dentro de botão, link ou rótulo, só elementos de frase (span); nos outros casos, div
  const Bloco = as === "button" || as === "a" || as === "label" ? "span" : "div";
  const clicavel = interativa ?? (as === "button" || as === "a" || as === "label" || !!props.onClick);
  const temInicio = inicio != null && inicio !== false;
  const temFim = fim != null && fim !== false;
  const sempreAbaixo = temFim && quebraAcoes === true;
  const abaixoNoCelular = temFim && quebraAcoes === "estreito";

  const colunas = temFim && !sempreAbaixo
    ? cn(temInicio ? COLUNAS.tres : COLUNAS.conteudoEFim, abaixoNoCelular && (temInicio ? "max-sm:grid-cols-[auto_minmax(0,1fr)]" : "max-sm:grid-cols-[minmax(0,1fr)]"))
    : temInicio ? COLUNAS.inicioEConteudo : COLUNAS.conteudo;

  const posicaoAbaixo = cn(temInicio ? "col-start-2" : "col-start-1", "row-start-2 mt-2", alinharAcoesAbaixo === "fim" ? "justify-self-end" : "justify-self-start");

  return (
    <Comp
      data-slot="linha-de-lista"
      data-selecionada={selecionada ? "" : undefined}
      type={as === "button" ? (props.type ?? "button") : undefined}
      className={cn(
        "grid w-full gap-x-3 rounded-none px-4 py-3 text-left",
        colunas,
        alinhar === "centro" ? "items-start sm:items-center" : "items-start",
        clicavel && "cursor-pointer transition-colors hover:bg-[var(--row-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        selecionada && "bg-[var(--primary-muted)] hover:bg-[var(--primary-muted)]",
        className,
      )}
      {...props}
    >
      {temInicio && <Bloco data-slot="linha-de-lista-inicio" className="flex shrink-0 items-center">{inicio}</Bloco>}
      <Bloco data-slot="linha-de-lista-conteudo" className="block min-w-0">
        {titulo != null && <span className="block text-[0.875rem] font-semibold text-foreground [overflow-wrap:anywhere]">{titulo}</span>}
        {descricao != null && <span className="mt-0.5 block text-[0.8125rem] text-muted-foreground [overflow-wrap:anywhere]">{descricao}</span>}
        {children}
      </Bloco>
      {temFim && (
        <Bloco
          data-slot="linha-de-lista-fim"
          className={cn(
            "flex shrink-0 flex-wrap items-center gap-2 self-start",
            alinhar === "centro" && !sempreAbaixo && "sm:self-center",
            sempreAbaixo && posicaoAbaixo,
            abaixoNoCelular && cn(temInicio ? "max-sm:col-start-2" : "max-sm:col-start-1", "max-sm:row-start-2 max-sm:mt-2", alinharAcoesAbaixo === "fim" ? "max-sm:justify-self-end" : "max-sm:justify-self-start"),
          )}
        >
          {fim}
        </Bloco>
      )}
    </Comp>
  );
}
