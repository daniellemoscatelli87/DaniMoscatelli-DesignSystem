# Grade de miniaturas

- **Status:** proposta
- **Componente:** `GradeDeMiniaturas` em `src/app/components/ui/grade-de-miniaturas.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Exibição de dados › Grade de miniaturas (`data#grade-de-miniaturas`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
As peças de cada ideia de post (foto quadrada, nome, preço e loja) eram uma grade feita à mão; o ImageGrid é de envio (capa, remover) e o ProductCard é a vitrine.

## Tela de origem
FindLook, Plano de divulgação › Ideias para as redes sociais. Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`itens` (`{ id, titulo, foto?, detalhe?, href?, onClick? }[]`), `colunas` (2, 3 ou 4; máximo), `maximo`, `vazio`, `rotulo`, `comoLink`.

## Variações e estados
Com foto; sem foto (ícone no mesmo quadrado); com link ou botão (hover cinza, foco); vazio. As colunas seguem a largura do próprio bloco (consulta de contêiner): nunca rola para o lado.

## Acessibilidade
Lista com nome; a foto é decorativa (o nome escrito diz o que é); nome inteiro no title quando cortado; fotos aparecem com esmaecer, prontas com “menos movimento”.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
