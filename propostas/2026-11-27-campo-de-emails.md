# Campo de vários e-mails

- **Status:** proposta
- **Componente:** `CampoDeEmails` em `src/app/components/ui/campo-de-emails.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Vários e-mails (`campos#campos-emails`)

## Motivo
O Novo e-mail do Contato tinha etiquetas de e-mail feitas à mão (`ne-tag`).

## Tela de origem
Área restrita › Contato › Novo e-mail (Para, Cc, Cco).

## API
`id`, `valor` (string[]), `onValorChange`, `placeholder`, `maximo`, `desabilitado`, `invalido`, `aria-describedby`, `textos`. Sugestões de domínio do CampoDeEmail embaixo do campo enquanto a pessoa digita (especificação da área restrita).

## Variações e estados
Etiqueta válida em cinza de apoio; inválida com borda e texto de erro e ícone; Enter, vírgula, ponto e vírgula, espaço, colar e sair do campo criam etiquetas; Backspace devolve a última para editar.

## Acessibilidade
Remover com nome ("Remover ana@…"); formato inválido anunciado; 44 px no toque. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.
