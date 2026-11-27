# Agenda do mês

- **Status:** proposta
- **Componente:** `AgendaDoMes` em `src/app/components/ui/agenda-do-mes.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Peças da área restrita › Agenda do mês (`pecas-admin#admin-agenda`)

## Motivo
O Calendar serve para escolher data num campo; as Reuniões da área restrita desenharam um calendário-agenda à mão (`cal-*`).

## Tela de origem
Área restrita › Reuniões.

## API
Segue a especificação da área restrita (claude, `docs/engineering/ADMIN_REACT.md` §7.1): `mes`, `aoMudarMes`, `eventos` ({data: Date | "AAAA-MM-DD", passado?, titulo?, hora?, descricao?, tom?, id?}[]), `selecionado`, `aoSelecionar`, `rotuloDoDia(dia, eventos)`, `diasSemEventos` ("focaveis" padrão | "inativos": dias sem compromisso não recebem foco). Também: `dia`/`diaInicial`/`onDiaChange` (texto AAAA-MM-DD), `hoje`, `mostrarLista` (lista do dia ao lado; padrão sim), `renderEvento`, `acoesDoDia`, `locale`, `textos`.

## Variações e estados
Mês e lista lado a lado a partir de 56rem; abaixo, um embaixo do outro; dias com pontos (estreito) ou nomes (largo); hoje com contorno e número em negrito, dia escolhido no rosa de selecionado (texto --primary-text) com borda na primária, nunca vermelho cheio; dia só com compromissos passados em pontos cinza; mês e lista do dia num card só, com divisor (sem área vazia ao lado).

## Acessibilidade
role=grid com setas, Home/End e PageUp/PageDown; cada dia com nome completo e contagem; botões de mês com 44 px no toque. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
