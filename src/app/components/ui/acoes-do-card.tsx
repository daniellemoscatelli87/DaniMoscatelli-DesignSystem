import * as React from "react";
import { cn } from "./utils";

/**
 * AcoesDoCard (a linha da ação do card) — regra da dona do produto, 28/11/2026
 *
 * "Em todo tipo de card, a ação (botão) fica do lado direito e/ou ocupando 100% da largura do card. Com 2 botões num
 * card pequeno, os dois ocupam a largura toda, um embaixo do outro (apenas no mobile). No desktop, se houver espaço,
 * um ao lado do outro."
 *
 * - Divisor em cima e a ação no lado DIREITO; a informação (tempo de leitura, data, preço) fica à esquerda (prop info).
 * - Celular (tela abaixo de 640 px): os botões ocupam a largura toda; com 2 botões, um embaixo do outro, o principal
 *   em cima. A informação fica numa linha só dela, em cima. Um link de texto continua à direita.
 * - Do tablet em diante: lado a lado, à direita; se não couberem, quebram para a linha de baixo, ainda à direita.
 * - Escreva a secundária ANTES da principal: a principal fica na ponta direita (e em cima, no celular).
 * - Par padrão: principal = Button (pílula preenchida); secundária = Button variant="link". Quando as duas ações
 *   importam de verdade: secundária = Button variant="outline" (contorno). Mais de 2 ações: a principal e o
 *   BotaoDeAcoes (as outras num menu); sem uma principal clara, só o BotaoDeAcoes.
 *
 * Uma fonte só do desenho: as classes .ds-acoes-do-card (+ --sem-divisor, __info, __botao) do theme.css (bloco
 * "@ds-css-puro:cards-acao"). O CardFooter do Card segue as mesmas regras. Páginas em HTML puro usam as mesmas classes.
 */
export type AcoesDoCardProps = React.ComponentProps<"div"> & {
  /** Informação à esquerda (tempo de leitura, data, preço). */
  info?: React.ReactNode;
  /** Divisor em cima (padrão: sim). Sem divisor quando o card já separa o rodapé de outro jeito. */
  divisor?: boolean;
};

function AcoesDoCard({ info, divisor = true, className, children, ...props }: AcoesDoCardProps) {
  return (
    <div data-slot="acoes-do-card" className={cn("ds-acoes-do-card", !divisor && "ds-acoes-do-card--sem-divisor", className)} {...props}>
      {info != null && info !== false && <span className="ds-acoes-do-card__info">{info}</span>}
      {children}
    </div>
  );
}

export { AcoesDoCard };
