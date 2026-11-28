# Ícone com base: três estados (desabilitado, informativo, clicável)

- **Status:** decisão da dona do produto (28/11/2026)
- **Componente:** `IconeComBase` em `src/app/components/ui/painel-dados.tsx` (bloco igual nos dois DS; só os tamanhos mudam de um DS para o outro)
- **Data:** 2026-11-28
- **Branch:** `claude/icones-e-beneficios`
- **Documentação:** DM: Templates › Peças do painel › Ícone com base. FindLook: Ícones › Base do ícone (`icons#icon-base`). Mesmo exemplo ao vivo nos dois (`showcase/shared/RegraDoIconeComBase.tsx`).

## Motivo
A regra de 20/11 ("base rosa com ícone vermelho = pede ação; base cinza com ícone cinza = só identifica; nunca base cinza com ícone vermelho") foi substituída pela da dona do produto. Prévia aprovada: `mock-icones/icones.png`.

## Regra
1. **Desabilitado:** ícone cinza na base cinza (`--disabled` + `--disabled-foreground`). Card ou item desabilitado ou indisponível.
2. **Informativo:** ícone colorido (`--primary-text`) na base cinza clara (`--muted`). Componente que só informa e não é clicável: bloco de benefícios, card parado, cabeçalho de card que não se toca, estado vazio.
3. **Clicável:** ícone colorido na base colorida clara (`--primary-muted`). Card clicável, linha de lista clicável, link.

## API
- `tom`: `"desabilitado" | "informativo" | "clicavel"`; continuam `"marca"` (= clicavel) e `"neutro"` (= informativo), e os tons de estado `"sucesso" | "aviso" | "erro" | "info"`. `data-tom` mostra o tom já resolvido.
- `resolverTomDoIcone(tom)` e `tomSemClique(tom)` (exportados): o segundo é o tom de um ícone numa peça que não se toca (fica informativo, a não ser que esteja desabilitado).
- Componentes que escolhem o tom sozinhos: `CardIndicador` (com link, clicável; sem link, informativo), `CardComCabecalho` e `EstadoVazio` (informativo; `tom="desabilitado"` para indisponível), `ItemDeAcao` e `CartaoDeEscolha` (clicável; desabilitado, cinza), `CardMidia` (informativo; clicável sozinho dentro de um link ou botão ou com `data-clicavel`; novo prop `tom` para fixar).

## Acessibilidade
Ícone colorido na base cinza: DM `--primary-text` (#B82828) sobre `--muted` (#E8EDF3) 5,3:1; FindLook (#BC0A41) sobre #F6F6F7 6,0:1. Na base colorida: 5,1:1 e 5,2:1. Desabilitado fica fora da exigência de contraste (indisponível), e o estado vem também escrito.
