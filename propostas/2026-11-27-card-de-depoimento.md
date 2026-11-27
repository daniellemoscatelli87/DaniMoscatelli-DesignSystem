# Card de depoimento

- **Status:** proposta
- **Componente:** `CardDeDepoimento` em `src/app/components/ui/card-de-depoimento.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Seções do site (`secoes-site#secoes-depoimentos`)

## Motivo
Peça do site feita à mão, sem componente no DS: o site não conseguia trocá-la por uma peça do DS sem mudar o conteúdo.

## Tela de origem
Página inicial (`index.html:117-181`, 21 cartões com sombra em `style`) e páginas EI.

## API
`nome`, `cargo`, `foto`, `origem`, children (o depoimento) + props de figure.

## Variações e estados
Card só com borda, h-full; foto 48 px ou iniciais; <figure>/<blockquote>/<figcaption>.

## Acessibilidade
Estado nunca só por cor; movimento só sem "menos movimento". Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
