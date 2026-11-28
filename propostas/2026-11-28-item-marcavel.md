# Item marcável

- **Status:** proposta
- **Componente:** `ItemMarcavel` e `ListaMarcavel` em `src/app/components/ui/item-marcavel.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Campos › Item marcável (`campos#item-marcavel`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
O ItemDeChecklist do painel é um link com estado calculado (em dia, atenção); o Plano de divulgação precisa de caixa de marcar + título + quem faz + explicação + indicador, com a etapa feita riscada e o check animado.

## Tela de origem
FindLook, Plano de divulgação (etapas do plano). Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`titulo`, `marcado`, `onMarcadoChange`, `etiqueta`, `descricao`, `indicador`, `prefixoParaLeitores`, `desabilitado`, `id`, `className`. `ListaMarcavel`: `<ol>` com 8 px entre os itens.

## Variações e estados
Livre; hover cinza (--muted, borda --border-strong); feito (--success-muted, borda verde a 30 %, título riscado, check que entra com escala); desabilitado.

## Acessibilidade
A linha é o `<label>` do Checkbox do DS (área de 44 px no toque); explicação por aria-describedby; estado por caixa, risco e check (nunca só cor); check sem animação com “menos movimento”.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
