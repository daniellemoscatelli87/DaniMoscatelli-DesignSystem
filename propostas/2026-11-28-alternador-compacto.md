# Alternador compacto

- **Status:** proposta
- **Componente:** `AlternadorCompacto` em `src/app/components/ui/alternador-compacto.tsx` (o mesmo arquivo nos dois DS)
- **Data:** 2026-11-28
- **Branch:** `claude/alternador-compacto`
- **Documentação:** Controles de formulário › Alternador compacto (`buttons#alternador-compacto`)

## Motivo
Pedido da dona do produto: "Esse componente de claro/escuro – português/inglês é um switch que deve estar disponível no DS para outros usos." Os seletores de idioma (só no DS Dani Moscatelli) e de tema (nos dois DS) do cabeçalho do site do DS eram feitos à mão em `src/app/App.tsx`.

## Tela de origem
Cabeçalho do site do DS (os dois), com o desenho aprovado em 28/11/2026: trilho de 36 px e área de toque invisível de 44 px.

## Decisão: componente novo, com a lógica do SegmentedControl
O pedido preferia um tamanho compacto do `SegmentedControl` (`size="compacto"`), se isso mantivesse uma API só. Não mantém: o alternador não muda só o tamanho, muda o desenho e o significado.
- **Trilho:** o SegmentedControl tem fundo do card, divisórias entre as opções e sombra no grupo. O alternador tem trilho cinza (`bg-muted`), com 4 px de respiro e 4 px entre as opções.
- **Opção escolhida:** no SegmentedControl, o rosa de selecionado (`--primary-suave`, ou a primária na variante sólida). No alternador, branco com borda e sombra leve, num polegar que desliza.
- **Uso:** o SegmentedControl serve para filtros e escolhas no conteúdo. O alternador serve para preferências da página ou do aplicativo (tema, idioma, unidade), no cabeçalho ou numa barra de ferramentas.

Um `size="compacto"` que trocasse também a cor da escolha e o trilho misturaria tamanho com aparência: o mesmo sinal com dois significados, e combinações sem sentido, como `variant="solida"` com `size="compacto"`. Por isso o componente é separado, com a mesma API do SegmentedControl (`options`, `value`, `defaultValue`, `onValueChange` e `aria-label`). A lógica de seleção foi extraída para `useEscolhaSegmentada`, em `segmented-control.tsx`, e os dois a usam: valor controlado ou não, sempre uma opção escolhida, setas com volta ao início e foco acompanhando.

## API
- `options`: `{ value, label, icon?, disabled?, nome? }[]`. `nome` é o nome completo para o leitor de tela e a dica. Ele começa pelo texto visível (WCAG 2.5.3), por exemplo "EN, English".
- `value`, `defaultValue`, `onValueChange`.
- `aria-label`: obrigatório.
- `rotuloVisivel`: `"sempre"` (padrão), `"sm"` (texto só a partir de 640 px) ou `"nunca"`. Quando o texto não aparece, ele continua para o leitor de tela, e toda opção precisa de ícone.
- `className` e as props do grupo do Radix.

## Medidas e estados
- Trilho: `h-9` (36 px), `p-1`, `gap-1`, `rounded-full`, `bg-muted` e `border-border`.
- Opções: `h-7` (28 px), `px-3`, `text-label` com peso médio e ícones de 13 px.
- Área de toque: 44 px de altura, por um `::after` invisível de 8 px acima e abaixo (`data-alvo-compacto`).
- Escolhida: polegar `bg-card`, `border-border` e `shadow-sm`, com o texto em `text-foreground`.
- Não escolhida: texto em `text-muted-foreground`, que vira `text-foreground` no hover.
- Foco: anel `ring`.
- Desativada: 50% de opacidade.
- Antes da primeira medição (pintura no servidor), a própria opção escolhida mostra o fundo do polegar.

## Acessibilidade
- O grupo é `role="radiogroup"`, com nome. Cada opção é `role="radio"` com `aria-checked`, e só a escolhida entra no Tab.
- As setas mudam a escolha e levam o foco junto.
- No celular, só os ícones aparecem, e o texto continua para o leitor de tela.
- O polegar desliza com `--duration-normal` e `--ease-snappy`. Com "menos movimento", troca sem deslizar (`motion-safe`).

## Cabeçalho do site do DS
Os seletores feitos à mão foram trocados pelo componente, sem mudança visual. A única diferença é que o trilho ficou 2 px mais largo: as duas opções reservam a borda, e assim o texto não pula 1 px ao trocar a escolha. O seletor de tema não tinha nome no celular e agora tem. O de idioma tinha nome sem a sigla visível e agora segue a regra 2.5.3.

## Logo no celular (mesma entrega)
Pedido da dona do produto, a mesma regra nos dois DS: no celular (abaixo de 640 px), o cabeçalho mostra só o símbolo. O nome aparece a partir de 640 px.
- **Documentação:** Header e menus › Logo no celular, com exemplo ao vivo e faça/não faça.
- **FindLook:** o cabeçalho do site do DS passou a seguir a regra, e o `CabecalhoDoSite` também, por padrão e sem prop nova.
- **Dani Moscatelli:** o cabeçalho do site e o `CabecalhoDoSite` já seguiam a regra.

## Testes
- `pnpm build` e `pnpm catalogo:check`.
- Tipos: `tsc --strict` com os tipos do React nos arquivos novos e mudados.
- `todas-paginas.js` e `quebras-paginas.js`.
- `grid-colunas-check.cjs` e `cards-altura-check.cjs` nas páginas mudadas.
- axe no cabeçalho, na seção nova e em Logo no celular.
- Teclado (setas e foco) e "menos movimento".
- Cabeçalho em 320, 340, 360, 390, 430, 640, 768, 1024 e 1280 px, nos temas claro e escuro: sem sobreposição, nada fora do trilho, toque de 44 px e capturas de antes e depois.
- `comparar-ds.mjs` sem diferenças.
