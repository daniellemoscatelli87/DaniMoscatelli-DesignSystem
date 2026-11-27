import * as React from "react";
import { cn } from "./utils";

/**
 * Citacao (frase em destaque com autoria)
 *
 * Uma fala de cliente, participante ou especialista em destaque, como os depoimentos curtos de "Uma nova perspectiva"
 * do Projeto Piloto e o texto original citado no app EI (`TextoOriginal`). Para uma grade de depoimentos com foto,
 * use o CardDeDepoimento.
 *
 * tamanho:
 *   texto    — no meio do texto corrido: barra de 4 px na primária à esquerda, frase em 16 px.
 *   destaque — sozinha numa seção: frase em 20–24 px, sem barra, aspas grandes decorativas.
 * Autoria (opcional) embaixo, alinhada à mesma borda da frase: nome em negrito e o papel. <blockquote> + <figcaption>;
 * `cite` guarda o endereço da origem. Não invente falas: só o que a pessoa disse ou escreveu.
 */

export type CitacaoProps = Omit<React.ComponentProps<"figure">, "children"> & {
  children: React.ReactNode;
  autor?: React.ReactNode;
  papel?: React.ReactNode;
  cite?: string;
  tamanho?: "texto" | "destaque";
};

function Citacao({ children, autor, papel, cite, tamanho = "texto", className, ...props }: CitacaoProps) {
  const destaque = tamanho === "destaque";
  return (
    <figure data-slot="citacao" data-tamanho={tamanho} className={cn(destaque ? "relative max-w-3xl" : "border-l-4 border-primary pl-4", className)} {...props}>
      {destaque && <span aria-hidden className="mb-2 block font-[family-name:var(--font-accent)] text-display-lg leading-none text-primary-text">“</span>}
      <blockquote cite={cite} className={cn("text-pretty text-foreground", destaque ? "text-h4 font-semibold leading-snug tracking-[-0.01em] sm:text-h3" : "text-body leading-relaxed")}>
        {children}
      </blockquote>
      {(autor || papel) && (
        <figcaption className={cn("text-body-sm", destaque ? "mt-4" : "mt-2")}>
          {autor && <span className="font-semibold text-foreground">{autor}</span>}
          {autor && papel && <span aria-hidden className="mx-2 text-muted-foreground">·</span>}
          {papel && <span className="text-muted-foreground">{papel}</span>}
        </figcaption>
      )}
    </figure>
  );
}

export { Citacao };
