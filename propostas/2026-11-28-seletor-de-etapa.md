# Seletor de etapa

- **Status:** proposta
- **Componente:** `SeletorDeEtapa` em `src/app/components/ui/seletor-de-etapa.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Linha do tempo › Seletor de etapa (`timeline#seletor-de-etapa`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
Os botões das etapas da ativação da loja parceira eram cartões feitos à mão. Conferido: o Stepper é progresso de assistente (etapas futuras não abrem, sem explicação) e o SegmentedControl troca uma vista, sem ordem nem etapas passadas; por isso a peça nova.

## Tela de origem
FindLook, Lojas parceiras › ficha › Etapa da ativação (Cadastro, Treinamento, Ativa). Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`etapas` (`{ id, titulo, descricao?, icone? }[]`), `atual`, `onEscolher` (sem ela, só leitura), `salvando`, `feita`, `rotulo` (“Etapas”), `textos` (`atual`, `mover`, `salvando`, `passou`, `futura`).

## Variações e estados
Atual (--primary-suave, borda primária a 40 %, círculo na primária, “Etapa atual”); passada (check verde); futura (ícone em cinza); hover cinza; salvando (carregando, as outras travadas); feita (check com escala); só leitura.

## Acessibilidade
Lista ordenada com nome; cada etapa é um botão; a atual tem aria-current=“step” e aria-disabled (continua focável); salvando com aria-busy; o estado passado/futuro vai em texto para leitores de tela; 44 px no toque; “Mover para cá” desce para baixo do texto abaixo de 28 rem.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
