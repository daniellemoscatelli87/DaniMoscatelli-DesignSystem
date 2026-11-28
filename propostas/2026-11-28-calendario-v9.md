# Calendário no react-day-picker 9

- **Status:** proposta
- **Componente:** `Calendar` em `src/app/components/ui/calendar.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Campos › Seletor de data (Calendar)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
O calendar.tsx usava o react-day-picker 8.10.1, que só aceita React 16 a 18; o produto FindLook usa React 19 e excluía o arquivo da sincronização.

## Tela de origem
FindLook, `design-system/arquivos.txt` (exclusão do calendar.tsx). Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
A do DayPicker 9 (mode, selected, onSelect, defaultMonth, disabled, locale…). Dependências: `react-day-picker` 9.14.0; o `date-fns` direto saiu (as datas em português vêm de `react-day-picker/locale`). O dia é um DayButton próprio (estados por modificador).

## Variações e estados
Igual ao anterior: 32 px no computador; no toque, dias de até 40 px com área de 44 px e o mês fluido até 320 px; escolhido no rosa de selecionado com contorno primário; hoje com contorno e negrito; outro mês e desabilitado esmaecidos; intervalo com o meio em --accent.

## Acessibilidade
Nomes dos dias em português (“sábado, 15 de novembro de 2026”), setas movem o foco (testado), botões de mês com 44 px no toque. Consumidores conferidos: Campos › Seletor de data e a janela com data em Sobreposições (Popover), nos dois DS; a AgendaDoMes (Dani Moscatelli) não usa o Calendar.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
