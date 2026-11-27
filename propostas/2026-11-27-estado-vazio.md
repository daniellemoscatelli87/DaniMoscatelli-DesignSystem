# Estado vazio, estado final e página de erro

- **Status:** proposta
- **Componente:** `EstadoVazio`, `EstadoFinal`, `PaginaDeErro` em `src/app/components/ui/estado-vazio.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Molduras e estados › Estados (`molduras#molduras-estados`)

## Motivo
Estados vazios eram só demonstração (StatesDemo, Empty States); o site e a área restrita tinham telas finais e 404 à mão.

## Tela de origem
Cadastro de parceiro (telas finais), 404, descadastro, Comunicados (vazio), área restrita (`Inicio.tsx:122`).

## API
EstadoVazio: `icone`, `titulo`, `descricao`, `acoes`, `tom` ("neutro" | "marca"), `tamanho` ("sm" | "md"), `variante` ("pagina" padrão, centralizado | "lista": dentro de um card, ícone à esquerda e ação na coluna do texto, como pede ADMIN_REACT.md §7.1), `nivel`. EstadoFinal: `tom` ("sucesso" | "info" | "aviso" | "erro"), `icone`, `titulo`, `descricao`, `acoes`, `nivel`, `focarAoAparecer`, children (resumo). PaginaDeErro: `codigo`, `ilustracao`, `titulo`, `descricao`, `acoes`, `telaCheia`.

## Variações e estados
Ações lado a lado e centralizadas; quando não cabem, coluna de botões da mesma largura. Ícone do estado final entra com mola (parado com menos movimento).

## Acessibilidade
Título em heading; EstadoFinal com role=status e foco no título; PaginaDeErro com <h1>; estado nunca só por cor (ícone + texto). Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
