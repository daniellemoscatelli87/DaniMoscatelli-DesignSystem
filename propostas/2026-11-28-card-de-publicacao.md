# Card de publicação

- **Status:** proposta
- **Componente:** `CardDePublicacao` e `htmlDoCardDePublicacao` em `src/app/components/ui/card-de-publicacao.tsx`; `CardDeArtigo` (`ui/card-de-artigo.tsx`) passa a ser o mesmo card com "Ler artigo"
- **Data:** 2026-11-28
- **Branch:** `claude/cards-acao`
- **Documentação:** Cards › Card de publicação (`cards#card-publicacao`)

## Motivo
Pedido da dona do produto (28/11/2026): "O DS precisa ter componente de card de publicação." Uso: artigos, insights e notícias do site do estúdio ("Insights & artigos" da página inicial).

## Tela de origem
Página inicial do site do estúdio, grade "Insights & artigos" (`index.html`, card "Mais recente"); o CardDeArtigo do DS (27/11/2026) já reproduzia o card, com o "Ler artigo" à esquerda no original.

## API
`titulo`, `href`, `resumo`, `imagem`, `alt`, `categoria`, `data`, `info` (ou `tempoDeLeitura`), `selo`, `formato` ("destaque" | "horizontal" | "vertical"), `novaAba`, `nivel`, `textos` (`ler`, padrão "Ler publicação"; `novaAba`), `className`. Mesma API nos dois DS.

## Uma fonte só (CSS puro)
O desenho mora nas classes `.ds-card-publicacao` (`--destaque | --horizontal | --vertical`, `__cartao`, `__midia`, `__foto`, `__selo`, `__ponto`, `__corpo`, `__meta`, `__categoria`, `__titulo`, `__link`, `__resumo`, `__acao`, `__so-leitor`) e `.ds-acoes-do-card` no rodapé, no bloco "@ds-css-puro:cards-acao" do `theme.css` (igual nos dois DS). O componente em React só monta o HTML; páginas em HTML puro usam as mesmas classes (HTML pronto em `htmlDoCardDePublicacao`).

## Variações e estados
Destaque (foto e texto lado a lado a partir de 48rem do card), horizontal (foto à esquerda a partir de 26rem), vertical e sem foto. Card inteiro clicável pelo link do título; hover com borda mais forte, título na cor de texto da primária, foto que aproxima e seta que se afasta; foco com anel no card. "Ler artigo →" à DIREITA da linha da ação e a informação à esquerda (regra da ação nos cards, 28/11/2026).

## Acessibilidade
Um link só por card (o título); o convite à direita é só visual (aria-hidden). Aviso "(abre em nova aba)" para leitores de tela. 44 px de toque no título no celular. Sem movimento com "menos movimento". Contraste dos textos pelos tokens (--primary-text, --muted-foreground).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `cards-altura-check.cjs`, `cards-acao-check.cjs` (regra da ação) e axe na página Cards, em 390, 768 e 1280 px.

## Capturas
`cards-acao-capturas/` na pasta de trabalho da entrega.
