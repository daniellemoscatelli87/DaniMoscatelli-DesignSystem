# Quadro com link esticado

- **Status:** proposta
- **Componente:** `Quadro` em `src/app/components/ui/quadro.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** FindLook: Quadro, conversa e tabela › Quadro com link esticado; Dani Moscatelli: Peças da área restrita (`#quadro-link-esticado`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
Com o cartão `relative`, um link esticado (after:absolute inset-0) cobria o botão “Mover para”, que deixava de receber o clique.

## Tela de origem
FindLook, Ativação de lojas (Quadro com a ficha no nome da loja). Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
Sem prop nova: o “Mover para” e os `button`, `input`, `select`, `textarea`, `[role=button]` e `[data-acima-do-link]` de dentro do cartão ficam em `relative z-10`.

## Variações e estados
Cartão com link esticado: clicar no cartão abre a ficha; clicar no Mover abre o menu; clicar num botão de dentro faz a ação dele.

## Acessibilidade
Testado com clique de verdade no centro de cada controle (elementFromPoint) em 390 e 1280 px; nenhum controle dentro de outro.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
