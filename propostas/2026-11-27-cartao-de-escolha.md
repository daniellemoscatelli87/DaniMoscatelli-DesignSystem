# Cartão de escolha

- **Status:** proposta
- **Componente:** `GrupoDeCartoesDeEscolha`, `CartaoDeEscolha`, `BrilhoDeSelecionado`, `molduraDoSelecionavel` em `src/app/components/ui/cartao-de-escolha.tsx`, `src/app/components/ui/shine-border.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Cartões de escolha (`campos#campos-escolha`)

## Motivo
O DM DS não tinha cartões selecionáveis; o app EI e o site montavam à mão. Trazidos do FindLook DS com os mesmos nomes e API.

## Tela de origem
App EI (`NextQuestion.tsx:58-70`), gaveta de contato do site ("Meu negócio é…").

## API
GrupoDeCartoesDeEscolha: `value`, `defaultValue`, `onValueChange`, `colunas` (1|2), `name`, `disabled`, `required` + props de div (aria-labelledby). No DM o rádio é nativo dentro do <label> do cartão (o cartão inteiro é o alvo de toque e as setas são as do navegador); a API é a do FindLook DS. CartaoDeEscolha: `valor`, `titulo`, `descricao`, `icone`, `desabilitado`, `id`.

## Variações e estados
Selecionado: borda de 2 px na primária com brilho, fundo --primary-suave (regra dos rosas claros de 27/11/2026), ícone na base rosa, rádio marcado. Não selecionado: borda neutra, hover cinza.

## Acessibilidade
Grupo de rádios de verdade; cartão inteiro é o rótulo; setas trocam a opção; brilho some com menos movimento. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
