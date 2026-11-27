import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "./utils";
import { IconeComBase } from "./painel-dados";

/**
 * CardDeNavegacao (card que leva a outra página)
 *
 * Um card inteiro clicável que leva a outra página ou seção: ícone na base, título, uma frase e a seta. Era o NavCard
 * da página Começar do DS (só demonstração) e serve às grades "Explore" e aos atalhos da área restrita. Para um item
 * de ação dentro de uma lista, use a LinhaDeLista.
 *
 * - É um único link (<a>) ou botão: o card todo recebe o clique e o foco; dentro dele não vão outros botões.
 * - Hover: borda mais forte, fundo cinza claro (--accent) e a seta anda 4 px; nunca rosa.
 * - Mesma altura dos vizinhos (h-full) dentro da GradeDeCards.
 */

export type CardDeNavegacaoProps = {
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  icone?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Selo pequeno ao lado do título ("Novo"). */
  selo?: React.ReactNode;
  className?: string;
};

function CardDeNavegacao({ titulo, descricao, icone, href, onClick, selo, className }: CardDeNavegacaoProps) {
  const classe = cn(
    "group/nav flex h-full w-full items-start gap-4 rounded-xl border border-border bg-card p-5 text-left text-card-foreground",
    "transition-colors duration-[var(--duration-fast)] hover:border-[var(--border-strong)] hover:bg-accent",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    className,
  );
  const conteudo = (
    <>
      {icone && <IconeComBase tom="marca">{icone}</IconeComBase>}
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-body font-semibold text-foreground">{titulo}</span>
          {selo}
        </span>
        {descricao && <span className="mt-1 block text-body-sm text-pretty text-muted-foreground">{descricao}</span>}
      </span>
      <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)] group-hover/nav:translate-x-1 group-hover/nav:text-foreground motion-reduce:transition-none" />
    </>
  );
  return href ? (
    <a data-slot="card-de-navegacao" href={href} onClick={onClick} className={classe}>{conteudo}</a>
  ) : (
    <button data-slot="card-de-navegacao" type="button" onClick={onClick} className={classe}>{conteudo}</button>
  );
}

export { CardDeNavegacao };
