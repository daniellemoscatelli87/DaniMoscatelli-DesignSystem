import * as React from "react";
import { CardDePublicacao, htmlDoCardDePublicacao, type CardDePublicacaoProps } from "./card-de-publicacao";

/**
 * CardDeArtigo (artigo, insight ou notícia)
 *
 * Desde 28/11/2026, é o CardDePublicacao (ui/card-de-publicacao.tsx), o card de publicação do DS, com "Ler artigo"
 * como convite. Mesmas props de antes (titulo, href, resumo, imagem, alt, categoria, data, tempoDeLeitura, selo,
 * formato, novaAba, nivel, textos, className). O tempo de leitura fica à esquerda e "Ler artigo →" à direita da linha
 * da ação, depois do divisor (regra da ação nos cards). Precisa do bloco "@ds-css-puro:cards-acao" do theme.css.
 */
export type CardDeArtigoProps = CardDePublicacaoProps;

function CardDeArtigo({ textos, ...props }: CardDeArtigoProps) {
  return <CardDePublicacao {...props} textos={{ ler: "Ler artigo", ...textos }} />;
}

/** HTML puro do CardDeArtigo (o CardDePublicacao com "Ler artigo"). */
function htmlDoCardDeArtigo({ textos, ...props }: Parameters<typeof htmlDoCardDePublicacao>[0]) {
  return htmlDoCardDePublicacao({ ...props, textos: { ler: "Ler artigo", ...textos } });
}

export { CardDeArtigo, htmlDoCardDeArtigo };
