# ImageUpload enviando e com iniciais

- **Status:** proposta
- **Componente:** `ImageUpload` (`ocupado`, `textoOcupado`, `iniciais`) em `src/app/components/ui/upload.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Upload › Imagem enviando e iniciais (`upload#imagem-enviando`)
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
A foto do perfil mostrava “Enviando…” à mão ao lado e ignorava um novo arquivo durante o envio; sem foto, o produto queria as iniciais.

## Tela de origem
FindLook, área administrativa › Perfil. Especificação em `docs/produto/CONFORMIDADE_DS.md` §11.9 do produto FindLook.

## API
`ocupado` (false), `textoOcupado` (“Enviando…”), `iniciais` (até 2 letras).

## Variações e estados
Enviando: imagem esmaecida, carregando por cima, texto embaixo, Remover escondido, soltar ou escolher arquivo não faz nada. Iniciais: círculo --primary-muted com letras em --primary-text; no hover, “Adicionar”.

## Acessibilidade
role=“status” no texto de envio; aria-busy e aria-disabled no botão; as iniciais são desenho (CSS), fora do nome lido (“Adicionar foto de perfil”); carregando parado com “menos movimento”.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React, sem erro em `ui/`); navegador (Playwright) em 390 e 1280 px: teste de interação e axe da seção (`interacao.cjs` do relatório, FindLook 93/93 e Dani Moscatelli 61/61), capturas em 390, 768, 1024 e 1280 px; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas mudadas; `scripts/comparar-ds.mjs` (102 de 102 iguais).

## Capturas
No relatório do branch `claude/pecas-findlook` (capturas da seção em 390 e 1280 px).
