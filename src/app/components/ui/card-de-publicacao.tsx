import * as React from "react";
import { cn } from "./utils";

/**
 * CardDePublicacao (artigo, novidade, notícia, promoção) — o card de publicação do DS (28/11/2026)
 *
 * O card de "Insights & artigos" da página inicial do site do estúdio, agora padrão dos dois design systems: foto com
 * selo opcional ("Mais recente"), categoria na cor da marca e data, título (o link), resumo com limite de linhas,
 * divisor e a linha da ação: a informação (tempo de leitura) à esquerda e "Ler artigo →" à DIREITA (regra da ação nos
 * cards, dona do produto, 28/11/2026). O CardDeArtigo (ui/card-de-artigo.tsx) é este mesmo card.
 *
 * formato:
 *   destaque   — foto e texto lado a lado (metade cada) a partir de 48rem do próprio card; título maior. Um por seção.
 *   horizontal — foto à esquerda (2/5) a partir de 26rem; abaixo disso, foto em cima. Resumo em até 2 linhas.
 *   vertical   — foto em cima (padrão). Resumo em até 3 linhas.
 * O card inteiro é clicável pelo link do título (que se estende sobre o card). Hover: borda mais forte, título na cor
 * de texto da primária, a foto aproxima um pouco e a seta se afasta (parado com "menos movimento"). Foco: anel em
 * volta do card. Links externos abrem em nova aba e avisam leitores de tela.
 *
 * Uma fonte só do desenho: as classes .ds-card-publicacao e suas partes do theme.css (bloco "@ds-css-puro:cards-acao").
 * Este componente só monta o HTML com essas classes; as páginas em HTML puro usam as mesmas classes (o HTML pronto sai
 * de htmlDoCardDePublicacao, abaixo).
 */
export type FormatoDoCardDePublicacao = "destaque" | "horizontal" | "vertical";

export type CardDePublicacaoProps = {
  titulo: string;
  href: string;
  resumo?: string;
  imagem?: string;
  /** Texto alternativo da foto (vazio se for decorativa). */
  alt?: string;
  /** Categoria, na cor da marca, em maiúsculas ("Business design", "Novidades da plataforma"). */
  categoria?: string;
  data?: string;
  /** Informação à esquerda da linha da ação. Padrão: tempoDeLeitura. */
  info?: React.ReactNode;
  tempoDeLeitura?: string;
  /** Selo sobre a foto ("Mais recente"). */
  selo?: React.ReactNode;
  formato?: FormatoDoCardDePublicacao;
  novaAba?: boolean;
  nivel?: 2 | 3 | 4;
  /** ler: o convite à direita da linha da ação (padrão "Ler publicação"; no CardDeArtigo, "Ler artigo"). */
  textos?: { ler?: string; novaAba?: string };
  className?: string;
};

const SETA = (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

function CardDePublicacao({ titulo, href, resumo, imagem, alt = "", categoria, data, info, tempoDeLeitura, selo, formato = "vertical", novaAba = false, nivel = 3, textos, className }: CardDePublicacaoProps) {
  const tx = { ler: "Ler publicação", novaAba: " (abre em nova aba)", ...textos };
  const H = (`h${nivel}` as unknown) as React.ElementType;
  const alvo = novaAba ? { target: "_blank", rel: "noopener noreferrer" } : {};
  const aEsquerda = info ?? tempoDeLeitura;
  return (
    <div data-slot="card-de-publicacao" data-formato={formato} className={cn("ds-card-publicacao", `ds-card-publicacao--${formato}`, className)}>
      <article className="ds-card-publicacao__cartao">
        {imagem && (
          <div className="ds-card-publicacao__midia">
            <img className="ds-card-publicacao__foto" src={imagem} alt={alt} loading="lazy" />
            {selo && (
              <span className="ds-card-publicacao__selo">
                <span aria-hidden className="ds-card-publicacao__ponto" />
                {selo}
              </span>
            )}
          </div>
        )}
        <div className="ds-card-publicacao__corpo">
          {(categoria || data) && (
            <p className="ds-card-publicacao__meta">
              {categoria && <span className="ds-card-publicacao__categoria">{categoria}</span>}
              {categoria && data && <span aria-hidden>•</span>}
              {data && <span>{data}</span>}
            </p>
          )}
          <H className="ds-card-publicacao__titulo">
            <a className="ds-card-publicacao__link" href={href} {...alvo}>
              {titulo}
              {novaAba && <span className="ds-card-publicacao__so-leitor">{tx.novaAba}</span>}
            </a>
          </H>
          {resumo && <p className="ds-card-publicacao__resumo">{resumo}</p>}
          <div className="ds-acoes-do-card ds-card-publicacao__rodape">
            {aEsquerda && <span className="ds-acoes-do-card__info">{aEsquerda}</span>}
            <span aria-hidden className="ds-card-publicacao__acao">
              {tx.ler} {SETA}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * O mesmo card em HTML puro, para as páginas que não usam React (as páginas originais do site). Precisa do bloco
 * "@ds-css-puro:cards-acao" do theme.css na página. Os textos são escapados.
 */
function htmlDoCardDePublicacao({ titulo, href, resumo, imagem, alt = "", categoria, data, tempoDeLeitura, selo, formato = "vertical", novaAba = false, nivel = 3, textos }: Omit<CardDePublicacaoProps, "info" | "selo" | "className"> & { selo?: string }) {
  const tx = { ler: "Ler publicação", novaAba: " (abre em nova aba)", ...textos };
  const alvo = novaAba ? ' target="_blank" rel="noopener noreferrer"' : "";
  const midia = imagem
    ? `<div class="ds-card-publicacao__midia"><img class="ds-card-publicacao__foto" src="${esc(imagem)}" alt="${esc(alt)}" loading="lazy">${selo ? `<span class="ds-card-publicacao__selo"><span aria-hidden="true" class="ds-card-publicacao__ponto"></span>${esc(selo)}</span>` : ""}</div>`
    : "";
  const meta = categoria || data
    ? `<p class="ds-card-publicacao__meta">${categoria ? `<span class="ds-card-publicacao__categoria">${esc(categoria)}</span>` : ""}${categoria && data ? '<span aria-hidden="true">•</span>' : ""}${data ? `<span>${esc(data)}</span>` : ""}</p>`
    : "";
  return [
    `<div class="ds-card-publicacao ds-card-publicacao--${formato}" data-formato="${formato}"><article class="ds-card-publicacao__cartao">`,
    midia,
    `<div class="ds-card-publicacao__corpo">${meta}`,
    `<h${nivel} class="ds-card-publicacao__titulo"><a class="ds-card-publicacao__link" href="${esc(href)}"${alvo}>${esc(titulo)}${novaAba ? `<span class="ds-card-publicacao__so-leitor">${esc(tx.novaAba)}</span>` : ""}</a></h${nivel}>`,
    resumo ? `<p class="ds-card-publicacao__resumo">${esc(resumo)}</p>` : "",
    `<div class="ds-acoes-do-card ds-card-publicacao__rodape">${tempoDeLeitura ? `<span class="ds-acoes-do-card__info">${esc(tempoDeLeitura)}</span>` : ""}`,
    `<span aria-hidden="true" class="ds-card-publicacao__acao">${esc(tx.ler)} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span></div>`,
    `</div></article></div>`,
  ].join("");
}

export { CardDePublicacao, htmlDoCardDePublicacao };
