# Escolha ordenada

- **Status:** proposta
- **Componente:** `EscolhaOrdenada` (e `proximaOrdem`) em `src/app/components/ui/escolha-ordenada.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/lacunas-finais`
- **Documentação:** Campos › Escolha ordenada (`campos#escolha-ordenada`)

## Motivo
A pesquisa Moda em Curitiba do site do estúdio classifica até 3 opções pela ordem dos toques; o DS não tinha a peça (lote S6 parado por falta no DS, SITE_REACT.md §6f).

## Tela de origem
Site do estúdio, `pesquisa/moda-curitiba/` (perguntas 2 e 5).

## API
`opcoes: { valor, titulo, descricao?, exclusiva? }[]`, `valor: string[]` (na ordem dos toques), `onValorChange`, `maximo` (padrão 3), `rotulo` ou `aria-labelledby`, `erro`, `desabilitado`, `somenteLeitura`, `name`, `textos`, `className`.

## Variações e estados
Vazia; escolhida (selo 1º, 2º, 3º na primária, borda primária e fundo `--primary-suave`); exclusiva (check); travada no máximo (`--disabled`); erro (borda de erro e MensagemDeErro); desabilitado; somente leitura. Hover cinza. Selo entra com um pulo curto; parado com menos movimento.

## Acessibilidade
Caixas de marcar nativas com o cartão inteiro como rótulo (44 px ou mais); a posição entra no nome lido; região aria-live anuncia cada mudança; grupo com nome; contagem ligada por aria-describedby.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React); navegador (Playwright) em 390, 768, 1024 e 1280 px sem erros no console nem rolagem lateral; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`, `auditoria-ds/auditar.cjs` nas páginas mudadas e axe nos componentes novos. Resultados no relatório do branch `claude/lacunas-finais` e no changelog.
