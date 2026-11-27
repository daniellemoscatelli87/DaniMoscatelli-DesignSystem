# Lista de pilares

- **Status:** proposta
- **Componente:** `ListaDePilares` em `src/app/components/ui/lista-de-pilares.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Seções do site (`secoes-site#secoes-pilares`)

## Motivo
Peça do site feita à mão, sem componente no DS: o site não conseguia trocá-la por uma peça do DS sem mudar o conteúdo.

## Tela de origem
Rede de Parceiros (`rx-pilares`) e Projeto Piloto ("Uma nova perspectiva").

## API
`pilares` ({icone, titulo, texto}[]), `rotulo`, `ordenada` (true), `linha` (true), `nivel`.

## Variações e estados
Lado a lado com a linha ligando os ícones a partir de 40rem; um embaixo do outro no celular; linha desenhada ao aparecer (parada com menos movimento).

## Acessibilidade
Estado nunca só por cor; movimento só sem "menos movimento". Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
