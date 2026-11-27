# Barra de composição

- **Status:** proposta
- **Componente:** `BarraDeComposicao` em `src/app/components/ui/barra-de-composicao.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/pecas-do-painel`
- **Documentação:** Templates › Peças do painel, item 7 (`templates#template-painel-pecas`)

## Motivo
O `BarrasEmpilhadas100` põe a legenda em cima do título e os percentuais soltos sobre as partes, sem o ponto na cor; o arquivo de gráficos é igual nos dois design systems e serve a várias linhas. Para uma barra só, com poucas partes, faltava a ordem da regra dos gráficos: título, barra e legenda embaixo com o ponto, a quantidade e o percentual.

## Tela de origem
Área restrita em React, Início, card Contato: situação das últimas mensagens.

## API
`titulo`, `partes` (`{ rotulo, valor, tom? }`; o tom é 1 a 7, dos tokens `--chart-1` a `--chart-7`), `ocultarZeros` (padrão true), `formatarQuantidade`, `localidade`.

## Variações e estados
2 a 5 partes. Partes com valor zero ficam de fora (opcional). A barra entra deslizando da esquerda com `--duration-slow`; com "menos movimento", aparece sem animação.

## Acessibilidade
A barra tem `role="img"` com o resumo completo (nome, quantidade e percentual de cada parte); a legenda visível repete os valores em texto, então a informação nunca depende só da cor. As partes ficam separadas por 2 px do fundo. Contraste das partes sobre o branco (elementos não textuais): tom 1 4,2:1, tom 2 2,5:1, tom 5 2,4:1, tom 6 1,4:1. Os tons claros da paleta ficam abaixo de 3:1, mas a informação está no texto da legenda (decisão da paleta de 21/11/2026, ver pendências).

## Testes
`pnpm build`, `pnpm catalogo:check` e as conferências de páginas; no produto, o teste do navegador confere a ordem título, barra e legenda e os valores na legenda.

## Pendências para a dona do produto
Os tons 2 a 7 da paleta não chegam a 3:1 sobre o branco. A barra compensa com a legenda em texto; se a paleta mudar, nada muda no componente.
