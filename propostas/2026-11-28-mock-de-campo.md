# Campo de exemplo na simulação

- **Status:** proposta
- **Componente:** `MockDeCampo` (e `useCenaAtiva`) em `src/app/components/ui/simulacao.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/lacunas-finais`
- **Documentação:** Seções do site › Simulação em etapas (`secoes-site#secoes-simulacao`)

## Motivo
A simulação da Rede de Parceiros em HTML mostrava o cadastro sendo preenchido (campos de exemplo com digitação, seleção aberta e opções marcadas); a versão em React trocou por linhas de dados.

## Tela de origem
Site do estúdio, `rede-parceiros/` em HTML (`rx-mf-campo`).

## API
`rotulo`, `valor`, `tipo` ("texto" | "area" | "selecao" | "opcoes"), `opcoes`, `selecionadas`, `aberta`, `obrigatorio`, `digitar`, `atraso`, `largo`, `className`.

## Variações e estados
Texto com digitação quando a cena fica ativa; seleção com a lista aberta e a escolhida no rosa de selecionado; caixas de marcar desenhadas. Primeira pintura com o valor inteiro.

## Acessibilidade
Não é campo de verdade (sem foco); o leitor de tela lê "rótulo: valor" de uma vez; menos movimento sem digitação.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React); navegador (Playwright) em 390, 768, 1024 e 1280 px sem erros no console nem rolagem lateral; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`, `auditoria-ds/auditar.cjs` nas páginas mudadas e axe nos componentes novos. Resultados no relatório do branch `claude/lacunas-finais` e no changelog.
