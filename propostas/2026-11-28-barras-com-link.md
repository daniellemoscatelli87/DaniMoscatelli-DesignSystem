# Barras com link por linha

- **Status:** proposta
- **Componente:** `BarrasOrdenadas` (`graficos-inteligencia.tsx`, nos dois DS) e `BarrasHorizontais` (`graficos.tsx`, só no FindLook): `href`/`onClick` por item e `comoLink`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Gráficos › Barras ordenadas com link (`graficos#barras-com-link`); no FindLook também Exibição de dados › Barras horizontais com link
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
O ranking da Visão geral (“1. Batel · 5 lojas”, cada linha leva à lista filtrada) não cabia nas barras do DS, que não tinham link por linha.

## Tela de origem
FindLook, Visão geral › Rankings. Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
Itens com `href` ou `onClick`; prop `comoLink` (o Link do Next). Sem eles, o gráfico continua uma imagem (role=“img”) com o resumo.

## Variações e estados
Com links: lista ordenada, linha inteira clicável, hover cinza de ponta a ponta (--row-hover, sem cantos), nome sublinhado no hover, foco por dentro.

## Acessibilidade
O nome do link é o próprio texto da linha (“1º Centro 12 lojas”), na ordem visível (passa no axe label-content-name-mismatch); a barra é aria-hidden; 44 px no toque; barras crescem ao aparecer, prontas com “menos movimento”.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
