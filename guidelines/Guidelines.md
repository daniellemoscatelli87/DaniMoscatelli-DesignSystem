# Dani Moscatelli Design System: working rules

* The site is bilingual (English default, Português BR). Every user-visible string must exist in both languages: use `const { t, bi } = useI18n()` from `src/app/i18n.tsx` (`t("English", "Português")`). Sidebar labels live in the `ptLabels` map in `src/app/App.tsx`.
* Every addition, change or removal in the design system (new page, component, token, menu change) must be logged as a new entry at the TOP of `src/app/components/showcase/shared/changelog.ts` with both `en` and `pt` text. It renders in the "What's New" section on Home.
* Rows with tags or actions (rules of the product owner, 24/11/2026): in grids, text never goes past the tags or actions column. The trailing column keeps its width (auto, shrink-0); the text column is minmax(0,1fr) / min-w-0 flex-1 and wraps or clamps inside it at every width (no col-span-full, flex-basis 100% or grid areas like "res res" under the trailing column). On phones, tags and actions move to their own row below the whole text block, so the text uses the full width (decision of the product owner, 27/11/2026; "no celular, tags e ações descem para uma linha própria embaixo do texto"): this is the default of LinhaDeLista, `quebraAcoes="estreito"`; `quebraAcoes={false}` keeps them beside the text at every width and `quebraAcoes={true}` puts them below at every width. Or the row becomes a stacked card. Row hover (--row-hover) covers the whole row edge to edge with border-radius 0 (only a row that is itself a standalone card keeps its radius); selected rows have the same shape; row focus is an inset outline. Use `ui/linha-de-lista.tsx` (LinhaDeLista). Docs: Data display > Rows with tags and actions.
* Cards side by side always have the same height (rule of the product owner, 27/11/2026). Put them in `GradeDeCards` (`ui/grade-de-cards.tsx`; label + card in `ItemDaGrade`): it stretches the row, keeps footers at the bottom and, when the content difference would leave a large empty area (more than 120 px, or more than 1/3 of the tallest card and at least 64 px), switches to horizontal cards, one per row. Card with an action: divider and button in the bottom-right corner (in the horizontal card the `CardFooter` is a full-width row below the content). Never hand-build a grid of cards with `grid` + `items-start`.
* Keep the Home "Explore" grid and the sidebar groups in `src/app/App.tsx` in sync when pages are added or removed.

## Cores aprovadas e regra dos rosas claros (decisão da dona do produto, 27/11/2026)

- `--primary` #CC4545 (texto branco 4,66:1), hover `--primary-hover` #B82828 (crimson-500, 6,2:1). No escuro, a mesma primária e o mesmo hover (antes 4,2:1 e 3,7:1).
- `--muted-foreground` #5A6A80: 4,83:1 no fundo #EDF0F5, 5,5:1 no branco.
- Três níveis, cores sólidas, iguais em regra nos dois design systems:
  - **Selecionado** `--primary-suave` #FCEEEE (o rosa do meio): item ativo do menu, chip, segmento e linha selecionados, plano escolhido. Selecionado com o mouse em cima continua neste rosa. Texto `--primary-text`: 5,5:1.
  - **Hover** cinza claro `--accent` #E8EDF3, nunca rosa (linhas de lista de ponta a ponta: `--row-hover`, cinza mais claro). Texto `--foreground` 14,8:1 ou `--muted-foreground` 4,7:1.
  - **Destaque** `--primary-muted` #FAE4E4: bases de ícones clicáveis (IconeComBase clicavel; o informativo usa a base cinza), chips de estado, faixas de apoio. Nunca marca seleção. Texto `--primary-text`: 5,1:1.

## Correções da auditoria de celular (27/11/2026)

Regras aplicadas em todo o DS, nos componentes, nas demonstrações e nos templates:

- **Alvos de toque.** No celular (abaixo de 640 px) e em qualquer tela usada com o dedo, todo botão, aba, campo e lista de opções tem pelo menos 44 × 44 px; com mouse no computador, botões e campos ficam com 40 px. No código: a variante `toque:` (`h-10 toque:h-11`, `size-10 toque:size-11`) e uma regra de segurança na camada base do `theme.css`. Caixa de seleção, rádio e interruptor guardam o desenho de 20 a 24 px num `span` interno; a área de toque cresce em volta com margem negativa (`toque:-m-3 toque:size-11`). Botões dentro de uma linha de texto (como o "i" de explicação) usam `data-alvo-compacto` e ganham a área de toque com uma margem invisível.
- **Tamanho de texto só por token.** Classes `text-caption`, `text-label`, `text-body-sm`, `text-button`, `text-body`, `text-body-lg`, `text-subtitle`, `text-subtitle-lg`, `text-h4`, `text-h3`, `text-h2`, `text-h1`, `text-display-md`, `text-display-lg`, `text-display-xl` (mesmos nomes no FindLook). Nada de `text-[…]`. Fora da escala vai para o passo mais perto (13 → 14, 15 → 16, 10 → 11, 28 → 32). O `cn()` conhece esses nomes (não os confunde com cor).
- **Raios só por token:** `rounded-sm` (8), `rounded-md` (12), `rounded-lg` (16), `rounded-xl` (24) e `rounded-full`. Os cards de vidro passaram de 20 para 16 px.
- **Espaçamento no ritmo de 4/8 px:** nada de `*-0.5`, `*-1.5`, `*-2.5`, `*-3.5` nem `[Npx]` em padding, margem e espaço entre itens (2 → 4, 6 → 4, 10 → 8, 14 → 12). Margens negativas que compensam uma área de toque ficam.
- **Títulos** quebram as linhas com `text-wrap: pretty`: nenhuma palavra sozinha na última linha e nenhuma primeira linha curta demais.
- **Abas** nunca rolam para o lado: quebram de linha; no celular viram uma grade de colunas iguais.
- **Paginação** fica numa linha só; no celular, "4 de 12" entre as setas.
- **Tabelas dentro de card** nunca rolam para o lado: mostram as colunas que cabem, com aviso, ou viram lista abaixo de 768 px (`DataTable` da documentação faz isso sozinha). Blocos de código quebram a linha.
- **Ação no cabeçalho de card** (`CardComCabecalho`): na linha do título, à direita; em card estreito, embaixo do texto, na mesma borda esquerda dele, nunca na borda do ícone.
- **Botão e link lado a lado** (`PartnerCard`, `VejaEm`): na mesma linha quando cabem; quando não cabem, um grupo empilhado com os dois na largura toda. O link nunca fica sozinho embaixo do botão.
- **Hover é cinza:** borda `--border-strong` e fundo `--accent`; rosa só para selecionado (`--primary-suave`).
- **Templates antigos** (Dashboard, Configurações, Caixa de entrada) usam a casca do painel: menu lateral que vira gaveta abaixo de 56rem. A Landing se adapta pela própria largura: menu em folha inferior, números 2 × 2, um card por linha, um card por plano e formulário embaixo da lista de confiança.
- **Textos de acessibilidade em português** nos componentes (Fechar, Anterior, Próxima, Mais páginas, Paginação, Trilha de navegação).
