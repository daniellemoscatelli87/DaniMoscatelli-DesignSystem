# Moldura de conta

- **Status:** proposta
- **Componente:** `MolduraDeConta` em `src/app/components/ui/moldura-de-conta.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Molduras e estados › Moldura de conta (`molduras#molduras-conta`)

## Motivo
O template Auth era só demonstração; a área restrita montou a própria `Moldura`.

## Tela de origem
Área restrita em React, telas de acesso (`telas/Acesso.tsx:46-62`).

## API
`titulo`, `descricao`, `selo` (texto vira Selo primário), `logo`, `inicioHref`, `rotuloInicio`, `rodape`, `telaCheia` (true), children (o formulário).

## Variações e estados
Card estreito centralizado na página; logo, selo, título e formulário na mesma borda esquerda; rodapé com divisor.

## Acessibilidade
<main> e <h1>; link do logo com nome; entrada suave só sem "menos movimento". Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
