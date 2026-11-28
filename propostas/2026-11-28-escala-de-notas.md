# Escala de notas

- **Status:** proposta
- **Componente:** `EscalaDeNotas` e `GrupoDeEscalas` em `src/app/components/ui/escala-de-notas.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/lacunas-finais`
- **Documentação:** Campos › Escala de notas (`campos#escala-de-notas`)

## Motivo
A pesquisa Moda em Curitiba pede notas de 1 a 10 por aspecto; o DS não tinha a peça (SITE_REACT.md §6f).

## Tela de origem
Site do estúdio, `pesquisa/moda-curitiba/` (pergunta 4).

## API
`rotulo`, `descricao`, `minimo` (1), `maximo` (10), `valor`, `onValorChange`, `rotuloMinimo`, `rotuloMaximo`, `erro`, `desabilitado`, `name`, `obrigatorio`, `className`. `GrupoDeEscalas`: card com as escalas separadas por divisor.

## Variações e estados
1 a 10, 0 a 10 (NPS), 1 a 5. Estreito: metade dos números por linha; a partir de 34 rem do bloco, todos numa linha. Escolhido: `--primary-suave`, borda primária, número em `--primary-text` e negrito (a regra dos rosas claros vale sobre a especificação, que pedia o fundo primário). Hover cinza; erro; desabilitado.

## Acessibilidade
Rádios nativos num `role=radiogroup` com o nome do aspecto (setas trocam a nota); o nome das pontas inclui o significado ("1, Muito ruim"); 44 px no toque.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React); navegador (Playwright) em 390, 768, 1024 e 1280 px sem erros no console nem rolagem lateral; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`, `auditoria-ds/auditar.cjs` nas páginas mudadas e axe nos componentes novos. Resultados no relatório do branch `claude/lacunas-finais` e no changelog.
