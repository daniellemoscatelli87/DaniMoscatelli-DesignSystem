# Campo de busca e campo copiável

- **Status:** proposta
- **Componente:** `CampoDeBusca`, `CampoCopiavel` em `src/app/components/ui/campo-de-busca.tsx`, `src/app/components/ui/campo-copiavel.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Busca e copiar (`campos#campos-busca`)

## Motivo
Busca e link copiável eram feitos à mão na área restrita (`filters/search`, `pa-link-copiar`).

## Tela de origem
Área restrita › Parceiros e Pesquisas.

## API
CampoDeBusca: `valor`, `onValorChange`, `onBusca`, `atraso`, `rotulo`, `resultados`, `textos`. CampoCopiavel: `valor`, `rotulo`, `mostrarRotulo`, `onCopiar`, `textos`.

## Variações e estados
Limpar só com texto; Esc limpa. Copiar vira "Copiado" com check por 2 s; sem permissão, seleciona e orienta.

## Acessibilidade
searchbox com nome; resultados e cópia anunciados; botão desce para a largura toda quando o campo é estreito. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
