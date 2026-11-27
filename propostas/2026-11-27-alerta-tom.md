# Alerta por tom

- **Status:** proposta
- **Componente:** `Alert` (prop `tom`) em `src/app/components/ui/alert.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Molduras e estados › Alerta por tom (`molduras#molduras-alerta-tom`)

## Motivo
A área restrita e o app EI montavam `Mensagem` (alerta sem título por tom, com ícone escolhido à mão).

## Tela de origem
`telas/Acesso.tsx:33-44`, app EI `Shell.tsx:120-129`.

## API
`tom` ("neutro" | "info" | "sucesso" | "aviso" | "erro"): define a variante e coloca o ícone do estado (Info, CircleCheck, TriangleAlert, CircleAlert) quando não há svg filho. Sem `tom`, nada muda.

## Variações e estados
Os mesmos tons do Alert; um svg filho continua valendo no lugar do ícone padrão.

## Acessibilidade
Mesmo role de antes (alert para aviso e erro, status para os demais); o mesmo estado tem sempre o mesmo ícone. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
