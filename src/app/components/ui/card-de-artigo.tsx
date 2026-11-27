import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "./utils";

/**
 * CardDeArtigo (artigo, insight ou notícia)
 *
 * Os cartões de "Insights & artigos" da página inicial (grade "bento": um destaque largo e cartões horizontais) e da
 * seção de artigos das páginas de apresentação. Foto, categoria e data, título (o link), resumo em até 3 linhas e o
 * rodapé com o tempo de leitura e "Ler artigo".
 *
 * formato:
 *   destaque   — foto e texto lado a lado (metade cada) a partir de 48rem do próprio card; título maior. Um por seção.
 *   horizontal — foto à esquerda (2/5) a partir de 36rem; abaixo disso, foto em cima.
 *   vertical   — foto em cima (padrão).
 * O card inteiro é clicável pelo link do título (que se estende sobre o card); "Ler artigo" fica no canto inferior
 * direito, depois do divisor (regra dos cards com ação), e o tempo de leitura à esquerda, na mesma linha.
 * Hover: borda mais forte, título na cor de texto da primária e a foto aproxima um pouco (parada com menos movimento).
 * Selo opcional sobre a foto ("Mais recente"). Links externos abrem em nova aba e avisam leitores de tela.
 */

export type CardDeArtigoProps = {
  titulo: string;
  href: string;
  resumo?: string;
  imagem?: string;
  /** Texto alternativo da foto (vazio se for decorativa). */
  alt?: string;
  categoria?: string;
  data?: string;
  tempoDeLeitura?: string;
  selo?: React.ReactNode;
  formato?: "destaque" | "horizontal" | "vertical";
  novaAba?: boolean;
  nivel?: 2 | 3 | 4;
  textos?: { ler?: string; novaAba?: string };
  className?: string;
};

function CardDeArtigo({ titulo, href, resumo, imagem, alt = "", categoria, data, tempoDeLeitura, selo, formato = "vertical", novaAba = false, nivel = 3, textos, className }: CardDeArtigoProps) {
  const tx = { ler: "Ler artigo", novaAba: " (abre em nova aba)", ...textos };
  const H = (`h${nivel}` as unknown) as React.ElementType;
  const lado = formato === "destaque" ? "@min-[48rem]/artigo:grid-cols-2" : formato === "horizontal" ? "@min-[36rem]/artigo:grid-cols-[2fr_3fr]" : "";
  const alvo = novaAba ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <div data-slot="card-de-artigo" data-formato={formato} className={cn("@container/artigo h-full", className)}>
      <article className={cn("group/artigo relative grid h-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-colors duration-[var(--duration-normal)] hover:border-[var(--border-strong)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2", lado)}>
        {imagem && (
          <div className={cn("relative overflow-hidden bg-muted", formato === "destaque" ? "aspect-[16/10] @min-[48rem]/artigo:aspect-auto @min-[48rem]/artigo:min-h-80" : formato === "horizontal" ? "aspect-[16/10] @min-[36rem]/artigo:aspect-auto" : "aspect-[16/10]")}>
            <img src={imagem} alt={alt} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[var(--duration-xslow)] ease-[var(--ease-out)] group-hover/artigo:scale-105 motion-reduce:transition-none motion-reduce:group-hover/artigo:scale-100" />
            {selo && <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-label font-bold uppercase tracking-[0.08em] text-primary-text shadow-sm"><span aria-hidden className="size-1.5 rounded-full bg-primary" />{selo}</span>}
          </div>
        )}
        <div className={cn("flex min-w-0 flex-col p-6", formato === "destaque" && "@min-[48rem]/artigo:p-8")}>
          {(categoria || data) && (
            <p className="mb-3 flex flex-wrap items-center gap-x-2 text-label font-medium text-muted-foreground">
              {categoria && <span className="font-bold uppercase tracking-[0.08em] text-primary-text">{categoria}</span>}
              {categoria && data && <span aria-hidden>•</span>}
              {data && <span>{data}</span>}
            </p>
          )}
          <H className={cn("font-bold leading-snug text-foreground text-balance transition-colors group-hover/artigo:text-primary-text", formato === "destaque" ? "text-h4 @min-[48rem]/artigo:text-h3" : "text-body")}>
            <a href={href} {...alvo} className="outline-none after:absolute after:inset-0 after:content-['']">
              {titulo}
              {novaAba && <span className="sr-only">{tx.novaAba}</span>}
            </a>
          </H>
          {resumo && <p className={cn("mt-3 line-clamp-3 text-pretty leading-relaxed text-muted-foreground", formato === "destaque" ? "text-body-sm @min-[48rem]/artigo:text-body" : "text-body-sm")}>{resumo}</p>}
          <div aria-hidden className="min-h-6 flex-1" />
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-label font-medium text-muted-foreground">{tempoDeLeitura}</span>
            <span aria-hidden className="inline-flex items-center gap-2 text-body-sm font-bold text-primary-text transition-[gap] duration-[var(--duration-fast)] group-hover/artigo:gap-3">
              {tx.ler} <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

export { CardDeArtigo };
