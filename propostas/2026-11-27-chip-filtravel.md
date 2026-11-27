# Chip filtrável

- **Status:** proposta
- **Componente:** `ChipFiltravel`, `GrupoDeChipsFiltraveis` em `src/app/components/ui/chip-filtravel.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Chips de filtro (`campos#campos-chips`)

## Motivo
Era o padrão "Chips (filtráveis)" de Rótulos, só em demonstração. Mesmo nome do componente previsto no FindLook DS.

## Tela de origem
Filtros da área restrita (Comunicados, Lançamento, Parceiros).

## API
ChipFiltravel: `ativo`, `onAtivoChange`, `contagem` + props de botão. GrupoDeChipsFiltraveis: `opcoes` ({valor, rotulo, contagem, desabilitado}[]), `valor`, `onValorChange`, `multiplo` (true), `rotulo`.

## Variações e estados
Ligado no rosa de selecionado com check; desligado com borda e hover cinza.

## Acessibilidade
aria-pressed; check + cor (nunca só cor); 44 px no toque; quebram de linha. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
