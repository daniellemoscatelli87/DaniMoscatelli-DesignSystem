# Fechar das janelas, busca de comandos, cabeçalho sem itens e nome do arquivo no recorte

- **Status:** proposta
- **Componente:** `DialogContent` (`ui/dialog.tsx`), `CommandDialog` (`ui/command.tsx`), `CabecalhoDoSite` (`ui/cabecalho-do-site.tsx`), `RecorteDeFoto` (`ui/recorte-de-foto.tsx`)
- **Data:** 2026-11-28
- **Branch:** `claude/pecas-findlook`
- **Documentação:** Sobreposições › Janela, busca e cabeçalho sem itens (`overlays#janelas-e-cabecalho`); Upload › Recorte de foto
- **Design systems:** FindLook e Dani Moscatelli, com a mesma API

## Motivo
Pedidos do site do estúdio (Dani Moscatelli): o X das janelas tinha alvo pequeno no celular; o CommandDialog punha o título fora do conteúdo (o Radix avisava) e não deixava passar `filter`/`shouldFilter`; o cabeçalho sem itens mostrava o botão Menu (folha vazia); o recorte não devolvia o nome do arquivo.

## Tela de origem
Site Dani Moscatelli (área restrita e páginas sem menu) e listas de arquivos enviados.

## API
- `DialogContent`: sem prop nova; o fechar tem `data-alvo-compacto`, desenho de 24 px e um `::after` de 44 × 44 px no toque.
- `CommandDialog`: `filter`, `shouldFilter`, `loop`, `value`, `onValueChange` (passam para o `Command`); `title` e `description` dentro do `DialogContent`, escondidos na tela.
- `CabecalhoDoSite`: com `itens` vazio, sem botão Menu nem folha; as ações aparecem na faixa também no celular.
- `RecorteDeFoto`: `onRecortar(foto, url, { nome, tipo, nomeDoRecorte })` (`ArquivoDoRecorte`); os dois primeiros argumentos não mudaram.

## Variações e estados
Janela no computador e no toque; busca com filtro do próprio Command ou com a lista filtrada fora; cabeçalho com e sem itens.

## Acessibilidade
44 px no toque sem mudar o desenho; nome acessível da busca vindo do título dentro do diálogo; sem botão que abre uma folha vazia.

## Testes
`pnpm build`, `pnpm catalogo:check`; `interacao.cjs` (FindLook 116/116, Dani Moscatelli 84/84): medida do X (24 px e área de 44 px a 390 px) e clique no centro fechando, nome da janela de busca, digitar “flo” com shouldFilter=false (só Florianópolis), Enter escolhe, sem aviso do Radix no console, cabeçalho sem “Abrir menu” e com “Entrar” visível, recorte de “praia-teste.png” mostrando “praia-teste.jpg”; axe da seção sem violações; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`; `comparar-ds.mjs`.

## Capturas
No relatório do branch `claude/pecas-findlook`.
