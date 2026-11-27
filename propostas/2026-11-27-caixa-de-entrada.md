# Caixa de entrada

- **Status:** proposta
- **Componente:** `CaixaDeEntrada` em `src/app/components/ui/caixa-de-entrada.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Peças da área restrita › Caixa de entrada (`pecas-admin#admin-caixa`)

## Motivo
O InboxTemplate era só demonstração e quebrava no celular (lista e leitura espremidas).

## Tela de origem
Área restrita › Contato (`admin/contatos`, Recebidos/Enviados).

## API
`itens` ({id, titulo, resumo, quando, lida, inicio, etiqueta}[]), `aberta` | `abertaInicial`, `onAbrir(id|null)`, `renderLeitura(item)`, `topo`, `vazio`, `semSelecao`, `rotulo`, `textos`.

## Variações e estados
Lado a lado a partir de 42rem da própria largura; abaixo, uma coisa por vez com Voltar. Linhas com LinhaDeLista (hover cinza, aberta no rosa de selecionado com barra na primária).

## Acessibilidade
Foco vai para a leitura ao abrir e volta à linha ao voltar; não lida em negrito + ponto + texto para leitores de tela. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
