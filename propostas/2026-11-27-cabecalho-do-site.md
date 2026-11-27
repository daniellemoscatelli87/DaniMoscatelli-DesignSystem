# Cabeçalho do site

- **Status:** proposta
- **Componente:** `CabecalhoDoSite` em `src/app/components/ui/cabecalho-do-site.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Molduras e estados › Cabeçalho do site (`molduras#molduras-cabecalho`)

## Motivo
O padrão Header e menus existia só na vitrine; o site montava o cabeçalho à mão em HTML (cores `--color-ds-*` copiadas, `bg-[#D44D4D]`).

## Tela de origem
Site do estúdio, todas as páginas (`src/compartilhado/partes.ts:36-65`, `menu.css`, `menu.ts`).

## API
`itens` ({id, rotulo, href}[]), `atual`, `acao` ({rotulo, href|onClick, icone}), `modelo` ("pilula" padrão | "faixa"), `superficie` ("clara" | "escura"), `esconderAoRolar` (true), `inicioHref`, `rotuloInicio`, `logo` ({completo, simbolo}), `raiz`, `posicao` ("sticky" | "fixed" | "absolute"), `tela` ("auto" | "celular" | "computador"), `textos`.

## Variações e estados
Pílula ou faixa no computador; faixa no celular, transparente no topo e com fundo do card a 85% e desfoque ao rolar; some ao descer e volta ao subir; menu do celular em folha inferior (Radix Dialog) com a página atual no rosa de selecionado.

## Acessibilidade
Página atual com aria-current, sublinhado e cor; foco preso no menu do celular, Esc fecha, o foco volta ao botão; alvos de 44 px no celular; transições só sem "menos movimento". Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
