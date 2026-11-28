# Lista de passos

- **Status:** proposta
- **Componente:** `ListaDePassos`, `PassoDaLista` e `NumeroDoPasso` em `src/app/components/ui/lista-de-passos.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Linha do tempo › Lista de passos (`timeline#lista-de-passos`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
Os passos do simulador do WhatsApp (número na base rosa, título e conteúdo com controles) não são o Stepper (assistente, com a etapa atual) nem a Timeline (história ao rolar). Também cobre os círculos numerados dos achados da Inteligência.

## Tela de origem
FindLook, área administrativa: Simulador do WhatsApp (“Como testar”) e Inteligência (achados numerados). Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`ListaDePassos` (`inicio`, atributos de `<ol>`; numera sozinha). `PassoDaLista`: `titulo`, `children`, `numero`, `feito`, `nivel` (3), `rotuloDoPasso` (“Passo”), `textoFeito` (“feito”). `NumeroDoPasso`: `n`, `tamanho` (“md” 28 px ou “sm” 24 px), `feito`.

## Variações e estados
Passo normal; feito (check verde em --success-muted). Os passos entram um depois do outro (4 px); parados com “menos movimento”.

## Acessibilidade
Lista ordenada; “Passo 1:” e “(feito)” para leitores de tela; título h3 (nível configurável); o círculo é decorativo. Número em --primary-text sobre --primary-muted (4,5:1 ou mais).

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
