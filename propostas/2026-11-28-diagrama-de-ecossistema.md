# Diagrama do ecossistema

- **Status:** proposta
- **Componente:** `DiagramaDeEcossistema` em `src/app/components/ui/diagrama-de-ecossistema.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/lacunas-finais`
- **Documentação:** Seções do site › Diagrama do ecossistema (`secoes-site#secoes-ecossistema`)

## Motivo
A roda do ecossistema da Rede de Parceiros virou etiquetas e cards na migração para React por falta da peça no DS (lote S4).

## Tela de origem
Site do estúdio, `rede-parceiros/` em HTML (`rx-eco`, antes do PR #261).

## API
`centro: { titulo, descricao?, icone? }`, `itens: { id, rotulo, icone? }[]`, `anelExterno?`, `rotulo`, `rotuloDosItens`, `rotuloDoAnelExterno`, `animar` (padrão sim), `raiz`, `className`.

## Variações e estados
Roda (a partir de 48 rem do bloco): centro, pétalas e anel de fora com linhas e pontos. Vertical (abaixo): centro em cima, tronco e raios. Entrada ao aparecer (centro, pétalas, anel de fora); hover cinza.

## Acessibilidade
Grupo com nome; cada anel é uma lista com nome; o desenho é aria-hidden; nada fica escondido sem script; menos movimento sem animação.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React); navegador (Playwright) em 390, 768, 1024 e 1280 px sem erros no console nem rolagem lateral; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`, `auditoria-ds/auditar.cjs` nas páginas mudadas e axe nos componentes novos. Resultados no relatório do branch `claude/lacunas-finais` e no changelog.
