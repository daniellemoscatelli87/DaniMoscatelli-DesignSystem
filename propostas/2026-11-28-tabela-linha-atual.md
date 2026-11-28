# Linha atual na tabela adaptável

- **Status:** proposta
- **Componente:** `TabelaAdaptavel` (`linhaAtual`) em `src/app/components/ui/tabela-adaptavel.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** FindLook: Quadro, conversa e tabela › Tabela com linha atual; Dani Moscatelli: Campos › Tabela com linha atual (`#tabela-linha-atual`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
O bairro do plano precisa ficar em destaque na tabela sem caixa de seleção.

## Tela de origem
FindLook, Plano de divulgação › Bairros por lojas de moda. Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`linhaAtual?: string | null` (a chave da linha).

## Variações e estados
Tabela e lista do celular: a linha no --primary-suave, também com o mouse em cima.

## Acessibilidade
aria-current=“true” na linha; a documentação pede uma etiqueta escrita (“no plano”), porque o estado não pode ser só cor.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
