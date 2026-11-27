# Tabela adaptável

- **Status:** proposta
- **Componente:** `TabelaAdaptavel` em `src/app/components/ui/tabela-adaptavel.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Tabela adaptável (`campos#campos-tabela`)

## Motivo
Regra do DS: card nunca rola para o lado. O padrão TabelaQueQuebra era só demonstração e várias tabelas rolavam.

## Tela de origem
Área restrita › Parceiros e Pesquisas; tabelas das páginas do DS.

## API
`colunas` ({id, titulo, celula, prioridade 1|2|3, alinhar, principal, ordenavel, valorParaOrdenar}[]), `linhas`, `chave`, `legenda`, `mostrarLegenda`, `acoes`, `vazio`, `ordemInicial` ({coluna, direcao}), `textos`. Ordenação por coluna, aviso de quantas colunas ficaram de fora e lista de LinhaDeLista no celular (ADMIN_REACT.md §7.1).

## Variações e estados
Prioridade 2 sai abaixo de 36rem, 3 abaixo de 48rem, com aviso; abaixo de 30rem vira lista de blocos rótulo:valor.

## Acessibilidade
<table> com caption e th scope; lista com dl; hover de ponta a ponta sem cantos. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
