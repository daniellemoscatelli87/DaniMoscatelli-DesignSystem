# Botão de envio e exclusão em contorno

- **Status:** proposta
- **Componente:** `BotaoDeEnvio`, `Button variant="outline-destructive"` em `src/app/components/ui/botao-de-envio.tsx`, `src/app/components/ui/button.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Botão de envio e exclusão em contorno (`campos#campos-botoes`)

## Motivo
Os estados de envio eram pintados à mão (verde solto `#16a34a` no "Notificar lançamento"); a área restrita registrou que faltava o botão de exclusão em contorno (`.btn-danger`).

## Tela de origem
Página inicial (formulário "Notificar lançamento"), área restrita (`admin.css`).

## API
BotaoDeEnvio: `estado` ("parado" | "enviando" | "feito" | "erro"), `textos`, `icone`, `voltarApos` (2400), `onVoltar` + props do Button. Button: nova variante `outline-destructive`.

## Variações e estados
Largura fixa na maior mensagem; "feito" no verde --success (texto branco 4,5:1). Contorno de exclusão: borda --destructive, texto crimson-500 (6,2:1), hover cinza.

## Acessibilidade
aria-busy no envio; anúncio aria-live; troca animada só sem menos movimento. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
