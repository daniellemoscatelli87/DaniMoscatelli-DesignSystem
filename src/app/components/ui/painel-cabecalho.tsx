import * as React from "react";
import { cn } from "./utils";
import { Heading } from "./heading";

/**
 * Cabeçalho da página do painel, "Opção A" (aprovada pela dona do produto para os painéis; trazido do FindLook Design
 * System, ui/painel-cabecalho.tsx, com as cores e o Heading deste DS): saudação opcional, título (Heading tamanho
 * "page", com o destaque entre ** ** em --primary-text), descrição, ações e, opcionalmente, as abas da página. Fica
 * fora de qualquer card, direto no fundo cinza da página; o conteúdo vem embaixo, em cards (CardComCabecalho,
 * CardIndicador numa GradeDeCards).
 */

type CabecalhoDaPaginaProps = {
  /** Abas da página, logo abaixo do título, fora de qualquer card (Tabs do DS). */
  abas?: React.ReactNode;
  /** Linha curta acima do título, em --primary-text (ex.: "Área restrita"). */
  saudacao?: string;
  /** Título; o trecho entre ** ** fica em destaque, como no Heading. */
  titulo: string;
  descricao?: React.ReactNode;
  /** Ações da página (no máximo um botão principal preenchido; o resto secundário ou link). */
  acoes?: React.ReactNode;
  /** Nível do título (padrão h1; use 2 ou 3 quando já houver um h1 na página). */
  nivel?: 1 | 2 | 3;
  /** Id do título, para aria-labelledby ou para levar o foco a ele ao trocar de página. */
  idDoTitulo?: string;
  className?: string;
};

/**
 * Texto primeiro, com largura garantida (base de 36rem): as ações ficam no alto, à direita, quando cabem na mesma linha;
 * quando não cabem, descem juntas para baixo do texto, sem apertar o título.
 * A descrição usa --foreground: sobre o fundo cinza (--background), o --muted-foreground fica abaixo de 4,5:1.
 */
function CabecalhoDaPagina({ saudacao, titulo, descricao, acoes, abas, nivel = 1, idDoTitulo, className }: CabecalhoDaPaginaProps) {
  const topo = (
    <header data-slot="cabecalho-da-pagina" className={cn("flex flex-wrap items-start justify-between gap-x-8 gap-y-4", !abas && className)}>
      <div className="min-w-0 flex-[1_1_36rem]">
        {saudacao && <p className="mb-2 text-body font-semibold text-primary-text">{saudacao}</p>}
        <Heading level={nivel} size="page" id={idDoTitulo} tabIndex={idDoTitulo ? -1 : undefined} className="outline-none">{titulo}</Heading>
        {descricao && <p className="mt-3 max-w-[70ch] text-body leading-relaxed text-foreground [text-wrap:pretty]">{descricao}</p>}
      </div>
      {acoes && <div data-slot="acoes-da-pagina" className="flex max-w-full flex-wrap items-center gap-2">{acoes}</div>}
    </header>
  );
  if (!abas) return topo;
  return (
    <div data-slot="cabecalho-da-pagina-com-abas" className={cn("space-y-4", className)}>
      {topo}
      {abas}
    </div>
  );
}

export { CabecalhoDaPagina };
export type { CabecalhoDaPaginaProps };
