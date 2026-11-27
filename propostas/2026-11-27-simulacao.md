# Simulação em etapas

- **Status:** proposta
- **Componente:** `Simulacao` em `src/app/components/ui/simulacao.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Seções do site (`secoes-site#secoes-simulacao`)

## Motivo
Peça do site feita à mão, sem componente no DS: o site não conseguia trocá-la por uma peça do DS sem mudar o conteúdo.

## Tela de origem
Rede de Parceiros, "Da conexão à colaboração" (`rx-mt-*`).

## API
`topicos` ({id, titulo, descricao, cena}[]), `intro`, `topoDaTela`, `intervalo` (6000), `autoAvancar` (true), `rotulo`, `textos`.

## Variações e estados
Abas de verdade (tablist/tab/tabpanel), tópico ativo no rosa de selecionado; avança sozinha só na tela, para no hover/foco e com Pausar; sem avanço com menos movimento.

## Acessibilidade
Estado nunca só por cor; movimento só sem "menos movimento". Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
