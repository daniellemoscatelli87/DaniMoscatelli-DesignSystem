import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "./utils";

/**
 * CardDeDepoimento (depoimento de cliente ou par)
 *
 * O cartão dos depoimentos da página inicial (21 recomendações do LinkedIn, `testimonial-card`) e das páginas de
 * apresentação: foto, nome e cargo em cima, o depoimento embaixo e, opcional, a origem ("Recomendação no LinkedIn").
 * Use dentro do Carousel (um por vez no celular, dois no tablet, três no computador) ou numa GradeDeCards.
 *
 * - Card do DS só com borda (sem sombra parada); altura total da célula (h-full), para os vizinhos ficarem iguais.
 * - Depoimento num <blockquote> (aspas de abertura decorativas em ícone); trechos em <strong> ficam no texto principal.
 * - Pessoa num <figcaption>: foto redonda de 48 px (ou as iniciais), nome em negrito e cargo numa linha.
 * - Não invente depoimentos: o conteúdo vem do produto, com autorização de quem escreveu.
 */

export type CardDeDepoimentoProps = Omit<React.ComponentProps<"figure">, "children"> & {
  nome: string;
  cargo?: string;
  /** URL da foto (quadrada). Sem foto, aparecem as iniciais. */
  foto?: string;
  /** Origem do depoimento ("Recomendação no LinkedIn"). */
  origem?: React.ReactNode;
  children: React.ReactNode;
};

const iniciais = (nome: string) => nome.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();

function CardDeDepoimento({ nome, cargo, foto, origem, children, className, ...props }: CardDeDepoimentoProps) {
  return (
    <figure
      data-slot="card-de-depoimento"
      className={cn("flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6 text-left text-card-foreground transition-colors duration-[var(--duration-normal)] hover:border-[var(--border-strong)]", className)}
      {...props}
    >
      <figcaption className="flex items-center gap-3">
        {foto ? (
          <img src={foto} alt="" loading="lazy" className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary-muted" />
        ) : (
          <span aria-hidden className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-muted text-sm font-bold text-primary-text">{iniciais(nome)}</span>
        )}
        <span className="min-w-0">
          <span className="block text-sm font-bold text-foreground">{nome}</span>
          {cargo && <span className="block truncate text-xs text-muted-foreground" title={cargo}>{cargo}</span>}
        </span>
      </figcaption>
      <blockquote className="relative flex-1 text-sm leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
        <Quote aria-hidden className="mb-2 size-5 text-primary-text" />
        {children}
      </blockquote>
      {origem && <p className="border-t border-border pt-4 text-xs font-medium text-muted-foreground">{origem}</p>}
    </figure>
  );
}

export { CardDeDepoimento };
