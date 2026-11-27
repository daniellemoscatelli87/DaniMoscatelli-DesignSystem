import type { Bi } from "../../../i18n";

export type ChangeKind = "New" | "Updated" | "Removed";

export type ChangeEntry = {
  date: string;
  kind: ChangeKind;
  title: Bi;
  desc: Bi;
  page?: string;
  anchor?: string;
};

// Newest first. Every entry needs both en and pt. Add every new DS inclusion at the TOP of this list.
export const changelog: ChangeEntry[] = [
  {
    date: "Nov 2026", kind: "New", title: { en: "Design system catalog (CATALOGO.md and catalogo.json) and consumption rule", pt: "Catálogo do design system (CATALOGO.md e catalogo.json) e regra de consumo" },
    desc: {
      en: "Requested by the product owner (27/11/2026): no conversation or agent should rebuild by hand what the DS already has. New catalog generated automatically by scripts/gerar-catalogo.mjs before every pnpm build: CATALOGO.md (for people and AI agents) and catalogo.json (for programs), at the repository root, with every ui/ component (purpose, props, variants and where to see it), the templates and patterns that still only exist in the demo pages (backlog for promotion to components), the tokens, the usage rules and the component proposals. pnpm catalogo:check fails if the committed catalog is out of date. CLAUDE.md at the root with the consumption rule and propostas/README.md with the process to create a new component inside the DS. New Catalog section on the Develop page.",
      pt: "Pedido da dona do produto (27/11/2026): nenhuma conversa ou agente deve recriar à mão o que o DS já tem. Novo catálogo gerado automaticamente por scripts/gerar-catalogo.mjs antes de cada pnpm build: CATALOGO.md (para pessoas e agentes de IA) e catalogo.json (para programas), na raiz do repositório, com todos os componentes de ui/ (para que servem, props, variantes e onde ver), os templates e padrões que ainda só existem nas páginas de demonstração (backlog de promoção a componente), os tokens, as regras de uso e as propostas de componente. pnpm catalogo:check falha se o catálogo gravado estiver desatualizado. CLAUDE.md na raiz com a regra de consumo e propostas/README.md com o processo para criar componente novo dentro do DS. Nova seção Catálogo na página Desenvolvimento.",
    },
    page: "develop", anchor: "dev-catalogo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Rows with tags and actions: text never passes the trailing column, and hover covers the whole row", pt: "Linhas com tags e ações: o texto nunca passa da coluna final, e o hover cobre a linha inteira" },
    desc: {
      en: "Product owner's rule (24/11/2026): in grids, text never goes past the tags or actions column. In any row of a list, table, grid or card list with a trailing column of tags, badges, status or actions, the text stays in its own column (minmax(0,1fr)) at every width and the trailing column keeps its width (auto); on phones, no col-span-full, flex-basis 100% or grid areas such as \"res res\" passing under it. Without room, the tags and actions move to their own row below the whole text, or the row becomes a stacked card. Second product owner's rule, the same day: row hover covers the whole row, edge to edge, with no rounded corners (--row-hover), including the leading checkbox and the trailing tags and actions; the selected row has the same shape, keyboard focus is an inset outline, and only a row that is itself a standalone card keeps the card's radius. New LinhaDeLista component (ui/linha-de-lista.tsx), with leading, content (title and description) and trailing (tags and actions) slots, an auto | minmax(0,1fr) | auto grid and the quebraAcoes option (always or on phones only). New section Data display > Rows with tags and actions, with correct and incorrect examples at phone width; both rules also in Cards > Responsive behavior. Fixed: the unread dot in notifications (own column, inset focus) and the Accessibility checklist (square hover).",
      pt: "Regra da dona do produto (24/11/2026): nos grids, o texto nunca deve ultrapassar a coluna de tags ou ações. Em toda linha de lista, tabela, grade ou lista de cards com uma coluna final de tags, selos, status ou ações, o texto fica na coluna dele (minmax(0,1fr)) em qualquer largura e a coluna final mantém a largura (auto); no celular, nada de col-span-full, flex-basis 100% ou áreas de grid como \"res res\" passando por baixo dela. Sem espaço, as tags e ações descem para uma linha própria abaixo de todo o texto, ou a linha vira um card empilhado. Segunda regra da dona do produto, no mesmo dia: o hover da linha cobre a linha inteira, de ponta a ponta, sem cantos arredondados (--row-hover), incluindo a caixa de seleção do início e as tags e ações do fim; a linha selecionada tem a mesma forma, o foco do teclado é um contorno por dentro, e só a linha que é um card sozinho mantém o raio do card. Novo componente LinhaDeLista (ui/linha-de-lista.tsx), com início, conteúdo (título e descrição) e fim (tags e ações), grade auto | minmax(0,1fr) | auto e a opção quebraAcoes (sempre ou só no celular). Nova seção Dados > Linhas com tags e ações, com exemplo certo e errado na largura do celular, e as duas regras também em Cards > Comportamento responsivo. Corrigidos: o ponto de não lida das notificações (coluna própria, foco por dentro) e a lista de verificação de Acessibilidade (hover sem cantos).",
    },
    page: "data", anchor: "linhas-colunas",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Alert with action, every alert in the same pattern and new warning and error colours", pt: "Alerta com ação, todos os alertas no mesmo padrão e novas cores de aviso e erro" },
    desc: {
      en: "Approved by the product owner (23/11/2026). New AlertaComAcao (ui/alerta-com-acao.tsx), with BotaoDoAlerta and LinkDoAlerta: 44 px icon with base (state colour at 18%, 30% for warning), 15 px bold title and everything else at 14 px, border in the state colour at 22% and card background tinted with the state colour at 7% (9% for warning). Actions always below the text: one outline-only primary, with text in the state's text colour, and a secondary styled as an underlined link; in a narrow alert the action row also uses the width under the icon. role=\"alert\" for warning and error, role=\"status\" for info and success. New state colours approved by the product owner on 23/11/2026: warning is now a yellowish orange (--warning #F0A020, with graphite text on it: --warning-foreground = --graphite-900, never white) and error is pinker, separate from the brand red (--error #D9416E); --primary, --primary-text, --destructive and the crimson scale do not change. Dark theme: --warning #F5B040 and --error #E5688F (5.7:1 on the dark card), both with graphite text on them. New tokens, only for text and icons on light backgrounds, approved the same day: --success-text (#327650), --info-text (#366E97), --warning-text (#935E0A) and --error-text (#C52756), 5.0–5.1:1 on the alert background; in the dark theme they point to --success, --info, --warning and --error. Text and icons that used --warning or --error as text colour now use the -text tokens (badges, toasts, form and upload errors). The Alert (ui/alert.tsx) now has the same look without changing its API: the svg child becomes the icon with base; pattern icons: info Info, success CheckCircle2, warning AlertCircle, error TriangleAlert.",
      pt: "Aprovado pela dona do produto (23/11/2026). Novo AlertaComAcao (ui/alerta-com-acao.tsx), com BotaoDoAlerta e LinkDoAlerta: ícone com base de 44 px (cor do estado a 18%, 30% no aviso), título de 15 px em negrito e todo o resto em 14 px, borda na cor do estado a 22% e fundo do card com a cor do estado a 7% (9% no aviso). Ações sempre embaixo do texto: uma principal só de contorno, com texto na cor de texto do estado, e uma secundária em forma de link sublinhado; em alerta estreito, a linha de ações usa também a largura sob o ícone. role=\"alert\" em aviso e erro, role=\"status\" em info e sucesso. Novas cores de estado aprovadas pela dona do produto em 23/11/2026: aviso laranja amarelado (--warning #F0A020, com texto em grafite sobre ele: --warning-foreground = --graphite-900, nunca branco) e erro mais rosa, separado do vermelho da marca (--error #D9416E); --primary, --primary-text, --destructive e a escala crimson não mudam. Tema escuro: --warning #F5B040 e --error #E5688F (5,7:1 no card escuro), os dois com texto em grafite sobre eles. Tokens novos, só para texto e ícone sobre fundo claro, aprovados no mesmo dia: --success-text (#327650), --info-text (#366E97), --warning-text (#935E0A) e --error-text (#C52756), 5,0–5,1:1 no fundo do alerta; no tema escuro apontam para --success, --info, --warning e --error. Textos e ícones que usavam --warning ou --error como cor de texto passam aos tokens -text (badges, toasts, erros de formulário e de upload). O Alert (ui/alert.tsx) passa a ter a mesma aparência, sem mudar a API: o svg filho vira o ícone com base; ícones do padrão: info Info, sucesso CheckCircle2, aviso AlertCircle, erro TriangleAlert.",
    },
    page: "feedback", anchor: "alerta-com-acao",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Panels: menu that pushes, border-only cards, lighter hover and disabled", pt: "Painéis: menu que empurra, cards só com borda, hover e desabilitado mais claros" },
    desc: { en: "Product owner's decisions (23/11/2026): on the computer the side menu opens and closes with the Menu button at its top and, when open, pushes the content column instead of covering it (phones keep the drawer). A card sitting directly on the page background, white or light grey, is always border only (1 px border, no shadow). Row and item hovers inside cards use the new --row-hover token, a very light, subtle grey (half of --graphite-50 over the card, ≈ #F6F8FA; 4% white in the dark theme). Disabled: --disabled is now --graphite-100 (#D6DCE6) and --disabled-foreground --graphite-400, 3.6:1.", pt: "Decisões da dona do produto (23/11/2026): no computador, o menu lateral abre e fecha pelo botão Menu no topo dele e, aberto, empurra a coluna de conteúdo em vez de cobri-la (o celular continua com a gaveta). Card que fica direto sobre o fundo da página, branco ou cinza claro, é sempre só borda (borda de 1 px, sem sombra). O hover de linha ou item dentro do card usa o novo token --row-hover, um cinza bem claro e sutil (metade do --graphite-50 sobre o card, ≈ #F6F8FA; branco a 4% no tema escuro). Desabilitado: --disabled passa a ser --graphite-100 (#D6DCE6) e --disabled-foreground --graphite-400, 3,6:1." },
    page: "cards", anchor: "card-fundos",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "7-tone chart palette", pt: "Paleta de 7 tons nos gráficos" },
    desc: { en: "Product owner's decision (21/11/2026): 7 tones in order of importance, from the brand red to gray (--chart-1 to --chart-7: #D44D4D, #F0828B, #F2BDC2, #D99BA1, #BFA0A3, #D4D7DC, #EBEEF4), the same in the light and dark themes. Ranges: 1–2 highlight, 3–5 support and transition, 6–7 context. Five usage rules: 1 chart = 1 focus, importance in order, context in gray, at most 2 intense tones and continuous scales from gray to red (--chart-seq-1 to 4 = tones 6, 4, 2 and 1). Series take the tones in order; \"Other\" goes on tone 6 when the parts stop before it and on tone 7 otherwise. --chart-neutral is now tone 7; --chart-8 stays only for compatibility and points to tone 7. Components pick tones with coresPorImportancia(n), configured in graficos-paleta.ts; BarrasOrdenadas gets cores=\"importancia\" and GraficoDeLinhas accepts neutro (dashed) and tom series.", pt: "Decisão da dona do produto (21/11/2026): 7 tons em ordem de importância, do vermelho da marca ao cinza (--chart-1 a --chart-7: #D44D4D, #F0828B, #F2BDC2, #D99BA1, #BFA0A3, #D4D7DC, #EBEEF4), os mesmos no tema claro e no escuro. Faixas: 1–2 destaque, 3–5 apoio e transição, 6–7 contexto. Cinco regras de uso: 1 gráfico = 1 foco, importância em ordem, contexto em cinza, no máximo 2 tons intensos e escalas contínuas do cinza ao vermelho (--chart-seq-1 a 4 = tons 6, 4, 2 e 1). As séries usam os tons em sequência; \"Outros\" fica no tom 6 quando as partes param antes dele e no tom 7 nos demais casos. --chart-neutral passa a ser o tom 7; --chart-8 fica só por compatibilidade e aponta para o tom 7. Os componentes escolhem os tons com coresPorImportancia(n), configurada em graficos-paleta.ts; BarrasOrdenadas ganha cores=\"importancia\" e GraficoDeLinhas aceita séries neutro (tracejadas) e tom." },
    page: "graficos", anchor: "graficos-cores",
  },
  {
    date: "Nov 2026", kind: "Removed", title: { en: "Sunburst and Waterfall", pt: "Sunburst e Cascata" },
    desc: { en: "Product owner's decision (20/11/2026): the Sunburst and Waterfall (Cascata) charts leave the chart catalog.", pt: "Decisão da dona do produto (20/11/2026): os gráficos Sunburst e Cascata (waterfall) saem do catálogo de gráficos." },
    page: "graficos", anchor: "graficos-catalogo-composicao",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Charts and visualizations", pt: "Gráficos e visualizações" },
    desc: { en: "New page and ui/graficos-inteligencia.tsx: how to choose a chart, chart colours, a redesigned donut, the recommended charts (ranked bars, regional heat map, dumbbell, lines and area, slope, treemap, 100% bars, bubbles, matrix heat map, bump chart, funnel), each as a discovery card (conclusion, chart, why it matters, next step), and the intelligence design principle. Chart tokens become tonal variations of the brand red; graphite only for non-highlighted or disabled information.", pt: "Página nova e ui/graficos-inteligencia.tsx: como escolher o gráfico, cores dos gráficos, rosca redesenhada, os gráficos recomendados (barras ordenadas, mapa de calor por região, dumbbell, linhas e área, slope, treemap, barras 100%, bolhas, heatmap matricial, bump, funil), cada um como um card de descoberta (conclusão, gráfico, por que importa, próximo passo), e o princípio do design de inteligência. Os tokens de gráfico passam a ser variações de tom do vermelho da marca; o grafite fica só para informação sem destaque ou desabilitada." },
    page: "graficos", anchor: "graficos-recomendados",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Site patterns", pt: "Padrões do site" },
    desc: { en: "New page with the site's patterns as components: footer (light, dark and compact), WhatsApp button, \"Tem um projeto?\" notice and back-to-top, cookie notice, reveal on scroll (slide up and blur, word by word), area-of-work card and curved dividers. Header: on phones the site bar stays light when scrolling.", pt: "Página nova com os padrões do site como componentes: rodapé (claro, escuro e compacto), botão do WhatsApp, aviso \"Tem um projeto?\" e voltar ao topo, aviso de cookies, entrada ao rolar (subir e desfoque, palavra por palavra), card de frente de atuação e divisores curvos. Header: no celular, a faixa do site continua clara ao rolar." },
    page: "site", anchor: "site-rodape",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "No sideways scroll on phones", pt: "Celular sem rolagem lateral" },
    desc: { en: "Every page fits 390 px: pagination and tabs wrap instead of scrolling, typography cards break long text, and the orbiting circles stack on phones.", pt: "Todas as páginas cabem em 390 px: paginação e abas quebram linha em vez de rolar, os cards de tipografia quebram textos longos e os círculos em órbita ficam um embaixo do outro no celular." },
    page: "overlays", anchor: "pagination",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Organization and cleanup", pt: "Organização e limpeza" },
    desc: { en: "One section title style in every page (title font, 24 px). Radii moved to the scale (8, 12, 16 and 24 px). Tailwind default colors and leftover hex values replaced by tokens; all red text uses --primary-text. Feedback and Labels now show different content; Motion tokens got their own address; menu items that only led to \"See in\" notices were removed. Toasts work (ui/sonner, without next-themes) and the Feedback page shows real notifications. Tabs, accordion, dropdown menu, dialog, confirmation (ui/alert-dialog), checkbox, radio and switch pages now use the ui/ components, adjusted to the documented look. New Component catalog page with every ui/ file.", pt: "Um estilo só de título de seção em todas as páginas (fonte de títulos, 24 px). Raios levados para a escala (8, 12, 16 e 24 px). Cores padrão do Tailwind e hexadecimais que sobravam trocados por tokens; todo texto em vermelho usa --primary-text. Feedback e Rótulos passam a ter conteúdo próprio; os tokens de Movimento ganham endereço próprio; saem do menu os itens que só levavam a avisos \"Ver em\". As notificações (toast) funcionam (ui/sonner, sem next-themes) e a página Feedback mostra notificações reais. Abas, sanfona, menu suspenso, diálogo, confirmação (ui/alert-dialog), caixa de seleção, opção e chave passam a usar os componentes de ui/, ajustados ao visual documentado. Página nova Catálogo de componentes, com todos os arquivos de ui/." },
    page: "catalogo", anchor: "catalogo-lista",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Voice and UX writing", pt: "Tom de voz e UX writing" },
    desc: { en: "New Guidelines page: four writing principles, the types of information (statement, observation, record, measurement, hypothesis, conclusion) and how to write intelligence texts as a conversation, not a report: rules, one structure for every discovery (discovery, context, possible reading, next step, details), avoid and prefer pairs and a review checklist. Also: breadcrumb, pagination, tooltip and side panel on the Overlays page now use the real ui/ components; the side panel (ui/sheet) traps focus and closes with Esc.", pt: "Página nova em Diretrizes: quatro princípios de escrita, os tipos de informação (declaração, observação, registro, medição, hipótese, conclusão) e como escrever textos de inteligência como uma conversa, e não um relatório: regras, uma estrutura única para toda descoberta (descoberta, contexto, leitura possível, próximo passo, detalhamento), pares evitar e preferir e perguntas de revisão. Também: trilha de navegação, paginação, dica de contexto e painel lateral da página Overlays passam a usar os componentes reais de ui/; o painel lateral (ui/sheet) prende o foco e fecha com Esc." },
    page: "voice", anchor: "escrita-principios",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "One standard for buttons, fields and focus", pt: "Padrão único de botão, campo e foco" },
    desc: { en: "ui/button now matches what the docs show: 40 px, 15 px semibold text, 12 px corners; text field, select and toggle are also 40 px, so they line up side by side. One focus ring for the whole DS: 2 px ring with 2 px offset, keyboard only. The Form controls and Feedback pages now render the real ui/ components (button, input, alert). ui/alert gains the state variants (success, info, warning, error). Motion tokens (--duration-*, --ease-*) now exist in theme.css, the *-muted colors work as classes, and token tables read their values from theme.css. Password field: lighter tip box and checks in the primary color.", pt: "O ui/button passa a ser igual ao que a documentação mostra: 40 px, texto 15 px seminegrito e cantos de 12 px; campo de texto, seleção e alternador também com 40 px, para alinharem lado a lado. Um destaque de foco só para o DS inteiro: anel de 2 px com respiro de 2 px, só pelo teclado. As páginas Controles de formulário e Feedback passam a mostrar os componentes reais (botão, campo, alerta). O ui/alert ganha as variantes de estado (sucesso, informação, aviso, erro). Os tokens de movimento (--duration-*, --ease-*) passam a existir no theme.css, as cores *-muted funcionam como classes e as tabelas de tokens leem os valores do theme.css. Campo de senha: caixa de dicas mais clara e checks na cor primária." },
    page: "buttons", anchor: "buttons",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Accessibility and consistency fixes", pt: "Correções de acessibilidade e consistência" },
    desc: { en: "shadow-* classes now use the DS shadow tokens (they used Tailwind's defaults). Form field borders are visible in the light theme (--input = --border-strong). Success and info darkened just enough for white text (4.5:1) and warning became burnt orange (#C2410C, 5.2:1). Alert titles in graphite, with colored icon and border. Error states use the error tokens. New --primary-text (crimson 500, 6.2:1) for red text and links. The Cards page now states the real default radius: 24 px (rounded-xl).", pt: "As classes shadow-* passam a usar as sombras do DS (usavam as padrão do Tailwind). A borda dos campos aparece no tema claro (--input = --border-strong). Sucesso e informação escurecidos só o necessário para o texto branco (4,5:1) e aviso em laranja queimado (#C2410C, 5,2:1). Título dos alertas em grafite, com ícone e borda coloridos. Estados de erro usam os tokens de erro. Novo --primary-text (carmim 500, 6,2:1) para texto e links em vermelho. A página Cards informa o raio real do card padrão: 24 px (rounded-xl)." },
    page: "feedback", anchor: "alerts",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Grid and spacing", pt: "Grid e espaçamento" },
    desc: { en: "New Foundation page with the grid system: 4 px spacing scale with real tokens (--space-1 to --space-24), 4, 8 and 12-column grid (phone, tablet from 640 px and desktop from 1024 px) with 16, 24 and 32 px margin and 16, 24 and 24 px gutter, maximum widths for reading (768 px), default (1152 px) and wide (1280 px), 64/80 px rhythm between sections and 96 px around the hero, usage examples, what to avoid and tokens. Ready classes: .ds-container, .ds-grid and .ds-section. The old Spacing section in Foundation links to the new page.", pt: "Nova página em Fundamentos com o sistema de grid: escala de espaçamento de 4 px com tokens reais (--space-1 a --space-24), grid de 4, 8 e 12 colunas (celular, tablet a partir de 640 px e desktop a partir de 1024 px) com margem de 16, 24 e 32 px e calha de 16, 24 e 24 px, larguras máximas de leitura (768 px), padrão (1152 px) e larga (1280 px), ritmo de 64/80 px entre seções e 96 px no hero, exemplos de uso, o que evitar e tokens. Classes prontas: .ds-container, .ds-grid e .ds-section. A antiga seção Espaçamento de Fundamentos leva para a página nova." },
    page: "grid", anchor: "grid-visao",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Faster Shine Border", pt: "Shine Border mais ligeiro" },
    desc: { en: "The shine loop is about 40% faster: component default from 14 s to 8 s; slow, standard and fast examples at 11, 8 and 5 s; highlight card and colour combinations at 7 s.", pt: "A volta do brilho ficou cerca de 40% mais rápida: padrão do componente de 14 s para 8 s; exemplos lento, padrão e rápido em 11, 8 e 5 s; card de destaque e combinações de cor em 7 s." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Shine Border: the light now travels around the whole border", pt: "Shine Border: a luz agora dá a volta pela borda inteira" },
    desc: { en: "Before, a radial gradient slid back and forth on the diagonal: the border only changed tone and the shine did not travel through the corners. Now a beam (conic gradient) goes around the card every duration and passes through every corner. Colours, presets, duration and reduced motion stay the same.", pt: "Antes, um gradiente radial ia e voltava na diagonal: a borda só mudava de tom e o brilho não percorria os cantos. Agora um feixe (gradiente cônico) gira em volta do card a cada duration e passa por todos os cantos. Cores, presets, duração e movimento reduzido continuam iguais." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Cards page reorganized: everything about cards in one place", pt: "Página Cards reorganizada: tudo sobre cards num só lugar" },
    desc: { en: "The Cards page now gathers everything about cards. It starts with “How to choose” (the background defines card, border, shadow and radius), then: 1) Solid card: anatomy, by background (white, light grey, and dark in light mode: white card without border and with strong shadow), border, shadow and radius, vertical and horizontal, with and without photo and button, buttons, information architecture (with the KPI cards), states (including loading), animation and where to apply it (lift on hover, Wobble, Canvas Reveal), Shine Border, nested and ready-made components; 2) Glass card: only combinations that pass the contrast check, by background (light, dark and photo) and with content; the “Default” finish is now called “Glass”; 3) Test the glass: the workbench, separated; 4) What to avoid: every “don't” in one place. Wobble Card, Shine Border, Canvas Reveal and the KPI cards left Motion, Backgrounds and Data Display; a “See in Cards” link stays there.", pt: "A página Cards foi reorganizada e passou a concentrar tudo sobre cards. Começa por “Como escolher” (o fundo define card, borda, sombra e raio) e segue em partes: 1) Card sólido: anatomia, por fundo (branco, cinza claro e escuro no modo claro: card branco sem borda e com sombra forte), borda, sombra e raio, vertical e horizontal, com e sem foto e botão, botões, arquitetura de informação (com os cards de KPI), estados (incluindo carregando), animação e onde aplicar (elevação no hover, Wobble, Canvas Reveal), Shine Border, aninhados e componentes prontos; 2) Card de vidro: só combinações aprovadas no contraste, por fundo (claro, escuro e foto) e com conteúdo; o acabamento “Padrão” passou a se chamar “Vidro”; 3) Testar o vidro: a bancada de teste, separada; 4) O que evitar: todos os “não faça” num só lugar. Wobble Card, Shine Border, Canvas Reveal e os cards de KPI saíram de Motion, Backgrounds e Exibição de dados; lá ficou um link “Ver em Cards”." },
    page: "cards", anchor: "card-escolher",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glass cards: test background", pt: "Cards de vidro: fundo de teste" },
    desc: { en: "The finish picker gained a “Test background” control: default, dense texture, open texture, dark texture, light and subtle, and solid colour (light grey, mid grey, graphite or primary). The contrast check of each card uses the chosen background (worst case between the background and a texture stroke). The default glass now also appears in the finish gallery. On phones, the finish control and the rules table no longer push the page sideways.", pt: "O seletor de acabamentos ganhou o controle “Fundo de teste”: padrão, textura fechada, textura aberta, textura escura, clara e discreta e cor sólida (cinza claro, cinza médio, grafite ou primária). A conferência de contraste de cada card usa o fundo escolhido (pior caso entre o fundo e um traço da textura). O vidro padrão passou a aparecer também na galeria de acabamentos. No celular, o seletor de acabamento e a tabela de regras não empurram mais a página para o lado." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Header & menus: current site model", pt: "Header e menus: modelo atual do site" },
    desc: { en: "The default is now the current header of the studio site: floating light pill on desktop, bar that turns graphite on phones, bottom-sheet menu. Scrolling became three independent switches (transparent at the top, logo becomes the icon, hides on scroll down). The full logo version is chosen by what is behind it (light, dark or photo). The menu stays in one place only: header or bottom bar.", pt: "O padrão agora é o header atual do site do estúdio: pílula clara flutuando no desktop, faixa que fica grafite no celular e menu em folha inferior. A rolagem virou três chaves independentes (transparente no topo, logo vira ícone ao rolar, some ao descer e volta ao subir). A versão do logo completo é escolhida pelo que está atrás dele (claro, escuro ou foto). O menu fica em um lugar só: header ou barra inferior." },
    page: "header", anchor: "header-demo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Header & menus", pt: "Header e menus" },
    desc: { en: "New section with the site header pattern, based on the studio site and this DS header. Interactive demo in a window with its own scroll: three scroll behaviours (transparent → solid, hide and return, compact on scroll), three phone menus (side drawer, full screen, bottom bar for apps) and four backgrounds behind the header (page background, dark photo with veil, brand gradient, dark mode). Includes accessibility checklist, usage and tokens.", pt: "Nova seção com o padrão de header de site, a partir do site do estúdio e do header deste DS. Demonstração em uma janela com rolagem própria: três comportamentos de rolagem (transparente → sólido, some e volta, compacto ao rolar), três menus no celular (gaveta lateral, tela cheia e barra inferior para apps) e quatro fundos por trás do header (fundo da página, foto escura com véu, gradiente da marca e modo escuro). Inclui checklist de acessibilidade, uso e tokens." },
    page: "header", anchor: "header-demo",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing cards: collapsible features and optional “Who it's for”", pt: "Cards de preço: recursos recolhíveis e “Para quem” opcional" },
    desc: { en: "The feature list starts collapsed, with a “Show plan features” button and the count (for example, 5 of 10). Opening or closing applies to every card, so they stay aligned; the button uses aria-expanded. The “Who it's for” box is optional: a plan without that text does not show it, and a switch in the demo shows the card with and without it.", pt: "A lista de recursos começa recolhida, com o botão “Ver recursos do plano” e a contagem (por exemplo, 5 de 10). Abrir ou fechar vale para todos os cards, que ficam sempre alinhados; o botão usa aria-expanded. O bloco “Para quem” é opcional: plano sem esse texto não mostra o bloco, e um interruptor na demonstração mostra o card com e sem ele." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing cards in the wobble card style", pt: "Cards de preço no estilo do card com wobble" },
    desc: { en: "The pricing template now borrows the wobble card's look: larger rounding, round icon, “Recommended” chip with a star, bold plan name, checks in tinted circles and a footer with price and action. It keeps the Monthly/Yearly switch, the “Who it's for” box, included and not-included features and the selected state. Columns now follow the available width, and the “Who it's for” box grows instead of overflowing when the card is too narrow.", pt: "O template de preços passou a usar o visual do card com wobble: cantos mais arredondados, ícone em círculo, selo “Recomendado” com estrela, nome do plano em destaque, checks em círculo colorido e rodapé com preço e ação. Continuam o seletor Mensal/Anual, o bloco “Para quem”, os recursos incluídos e não incluídos e o estado selecionado. As colunas agora seguem a largura disponível, e o bloco “Para quem” cresce em vez de vazar quando o card fica estreito demais." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Cards on white: border, no shadow", pt: "Card sobre fundo branco: borda, sem sombra" },
    desc: { en: "New rule in Cards: on a white background, a card has no shadow and uses a light gray border (--border); shadows are for hover and overlays.", pt: "Nova regra em Cards: sobre fundo branco, o card não tem sombra e usa borda cinza clara (--border); a sombra fica para o hover e para sobreposições." },
    page: "cards", anchor: "card-guidelines",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Real version number", pt: "Número de versão real" },
    desc: { en: "Pages now show the published version and year (for example “Version 37 · 2026”), updated on every publication, instead of the fixed “Version 1.0 · 2024” left over from the template.", pt: "As páginas passaram a mostrar a versão publicada e o ano (por exemplo, “Versão 37 · 2026”), atualizados a cada publicação, no lugar do texto fixo “Versão 1.0 · 2024” que veio do modelo." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Header shimmer visible in light mode", pt: "Brilho do cabeçalho visível no modo claro" },
    desc: { en: "In light mode, the shimmer on “Design System” in the header now sweeps in the primary colour over graphite text, so the animation can be seen. Dark mode is unchanged.", pt: "No modo claro, o brilho que passa por “Design System” no cabeçalho agora corre na cor primária sobre o texto grafite, e a animação fica visível. O modo escuro não mudou." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Menu: “Comece aqui” group", pt: "Menu: grupo “Comece aqui”" },
    desc: { en: "In Portuguese, the first menu group is now called “Comece aqui”, so it no longer repeats the name of its first item, “Início”.", pt: "O primeiro grupo do menu passou a se chamar “Comece aqui”, para não repetir o nome do primeiro item, “Início”." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Opens in light mode", pt: "DS abre no modo claro" },
    desc: { en: "Light mode is now the default: the design system opens in light. Dark mode is still one click away in the header. In dark mode, the Clear Space logo now uses the white-text version.", pt: "O modo claro passou a ser o padrão: o design system abre no claro. O modo escuro continua a um clique, no topo. No escuro, o logo da Área de respiro agora usa a versão com texto branco." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Complete Lucide library", pt: "Biblioteca Lucide completa" },
    desc: { en: "Icons › Library now shows the whole Lucide library (lucide-react 1.70.0, 2,029 icons in Lucide's official categories, searchable). The 18 brand icons Lucide removed in 1.x (Figma, Github, Instagram, Linkedin, Youtube…) are kept in the DS in their own group. No icon was removed.", pt: "Ícones › Biblioteca agora mostra a Lucide inteira (lucide-react 1.70.0, 2.029 ícones nas categorias oficiais da Lucide, com busca). Os 18 ícones de marca que a Lucide tirou na versão 1.x (Figma, Github, Instagram, Linkedin, Youtube…) continuam no DS, num grupo próprio. Nenhum ícone foi removido." },
    page: "icons", anchor: "icon-library",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: new texts and calmer dark mode", pt: "Template de preços: textos novos e modo escuro mais sóbrio" },
    desc: { en: "New \"Who it's for\" texts; the box now has a fixed height of four lines. In dark mode, plan name, price, icon and the \"Who it's for\" box are neutral (only the lightbulb stays yellow); the primary colour remains on the Recommended tag, checks, highlighted border and button.", pt: "Textos novos em \"Para quem\"; a caixa agora tem altura fixa de quatro linhas. No modo escuro, nome, preço, ícone e a caixa \"Para quem\" ficaram neutros (só a lâmpada continua amarela); a cor primária fica na etiqueta Recomendado, nos checks, na borda do destaque e no botão." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: \"Who it's for\" box", pt: "Template de preços: caixa \"Para quem\"" },
    desc: { en: "The \"Who it's for\" box is now light yellow (warning-muted) with a lightbulb icon, has a fixed height of three lines in every card and no ellipsis: the text must fit in three lines. Three columns from 1280 px; one column below.", pt: "A caixa \"Para quem\" ficou amarelo-clara (warning-muted), com ícone de lâmpada, altura fixa de três linhas em todos os cards e sem reticências: o texto deve caber em até três linhas. Três colunas a partir de 1280 px; uma coluna abaixo disso." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: plan names and selected state", pt: "Template de preços: nomes dos planos e estado selecionado" },
    desc: { en: "Plans are now named after what each tag meant (Visibility, Performance, Opportunities) and the tag was removed. The button reads \"Select Plan\" and, once clicked, fills with the primary colour, shows a check and \"Plan selected\"; the chosen card gets the primary border. Under Templates › Pricing.", pt: "Os planos passaram a se chamar pelo que cada tag dizia (Visibilidade, Desempenho, Oportunidades) e a tag saiu do card. O botão agora diz \"Selecionar Plano\" e, ao ser clicado, fica preenchido na primária, com check e \"Plano selecionado\"; o card escolhido ganha a borda na primária. Em Templates › Preços." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template", pt: "Template de preços" },
    desc: { en: "Plan cards now have a section seal above the name, name and price in the primary colour with \"/ month\", a \"Who it's for\" box limited to two lines, a description, a divider, included items with a check and not-included items with a dash, a \"Recommended\" tag on the highlighted plan and an outlined \"Select\" button. Equal heights; one column on phones. Under Templates › Pricing.", pt: "Os cards de plano ganharam selo de seção acima do nome, nome e preço na cor primária com \"/ mês\", caixa \"Para quem\" com no máximo duas linhas, descrição, divisor, itens incluídos com check e não incluídos com traço, etiqueta \"Recomendado\" no plano em destaque e botão \"Selecionar\" em contorno. Mesma altura; uma coluna no celular. Em Templates › Preços." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "English review", pt: "Revisão do inglês" },
    desc: { en: "Texts that showed in Portuguese in English mode are now in English: the upload components (drop area, file list, single image and gallery, including validation and status messages), the Heading examples in Typography, the section seal description, the side panel rules and the glass card contrast numbers.", pt: "Textos que apareciam em português no modo inglês agora estão em inglês: componentes de upload (área de soltar, lista de arquivos, imagem única e galeria, incluindo mensagens de validação e de estado), exemplos do Heading em Tipografia, descrição do selo de seção, regras do painel lateral e números de contraste do card de vidro." },
    page: "upload", anchor: "upload-dropzone",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Password field with confirmation", pt: "Campo de senha com confirmação" },
    desc: { en: "Password and confirmation with show/hide, strength in four bars with a label, hints that get a green check as each requirement is met, and a match message. Under Components › Buttons › Password.", pt: "Senha e confirmação com exibir/ocultar, força da senha em quatro barras com rótulo, dicas de preenchimento que ganham check verde conforme os requisitos são atendidos e aviso de coincidência. Em Componentes › Botões › Senha." },
    page: "buttons", anchor: "password",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Section seal", pt: "Selo de seção" },
    desc: { en: "The coloured pill from the site's sections (light primary fill, primary border, primary uppercase text with wide tracking), naming the subject above each section title. Next to the hero tag, under Components › Badges.", pt: "Pílula colorida das seções do site (tom claro da primária, borda na primária, texto na primária em caixa alta com espaçamento largo), para nomear o assunto acima do título de cada seção. Ao lado do selo do hero, em Componentes › Rótulos." },
    page: "badges", anchor: "selo-secao",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Timeline", pt: "Linha do tempo" },
    desc: { en: "Ported from the studio site's \"How it works\" section: steps with a round marker and a card, rail on the left on phones and centred with alternating cards from 768 px, plus the scroll-driven Step Indicator animation (current step grows, done steps fill the rail, cards slide in once). Honours reduced motion. Under Components.", pt: "Portada da seção \"Como funciona\" do site do estúdio: etapas com marcador redondo e card, linha à esquerda no celular e no centro com cards alternados a partir de 768 px, e a animação Step Indicator na rolagem (etapa atual cresce, feitas preenchem a linha, cards entram uma vez). Respeita movimento reduzido. Em Componentes." },
    page: "timeline", anchor: "timeline-demo",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glassmorphism cards: test area with contrast alert", pt: "Cards glassmorphism: área de teste com alerta de contraste" },
    desc: { en: "Examples over the system texture with small icons; each test card measures title and subtitle contrast against the effective glass surface (WCAG AA) and alerts when accessibility is compromised. glassTextContrast helper and contrast utilities exported.", pt: "Exemplos sobre a textura do sistema em ícones pequenos; cada card de teste mede o contraste de título e subtítulo contra a superfície efetiva do vidro (WCAG AA) e alerta quando a acessibilidade fica comprometida. Helper glassTextContrast e utilitários de contraste exportados." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glass card with free opacity and blur control", pt: "Card de vidro com controle livre de opacidade e desfoque" },
    desc: { en: "Numeric props opacity (0–100 %) and blur (0–80 px) override the finish; sliders in the glassmorphism picker show the result and the code live.", pt: "Props numéricas opacity (0–100 %) e blur (0–80 px) sobrepõem o acabamento; sliders no seletor da seção Cards glassmorphism mostram o resultado e o código na hora." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glassmorphism cards with finishes", pt: "Cards glassmorphism com acabamentos" },
    desc: { en: "New finish prop with degrees of transparency: translucent, frosted, light focus and crystal, combinable with tone and opacity. Interactive picker in the glassmorphism cards section; finish tokens.", pt: "Nova prop finish com graus de transparência: translúcido, fosco, foco de luz e cristal, combináveis com tom e opacidade. Seletor interativo na seção de cards glassmorphism; tokens dos acabamentos." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Doodle texture", pt: "Textura doodle" },
    desc: { en: "Seamless pattern with 66 line icons from the studio's universe (research, innovation, UX, UI, people, journeys, sticky notes, design thinking). Solid stroke color: graphite-200 on light, graphite-800 on dark, or any token via mask. SVG and PNG downloads. Under Backgrounds.", pt: "Padrão sem emenda com 66 ícones de traço do universo do estúdio (pesquisa, inovação, UX, UI, pessoas, jornadas, post-its, design thinking). Traço em cor sólida: grafite-200 no claro, grafite-800 no escuro, ou qualquer token via máscara. Download em SVG e PNG. Em Backgrounds." },
    page: "backgrounds", anchor: "doodle-bg",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Glassmorphism cards", pt: "Cards glassmorphism" },
    desc: { en: "New Cards subcategory: GlassCard component with light and dark glass, three intensities, primary tint, interactive version and a solid fallback under reduced transparency; rules for background, contrast and quantity.", pt: "Nova subcategoria em Cards: componente GlassCard com vidro claro e escuro, três intensidades, tingimento na primária, versão interativa e fallback sólido com transparência reduzida; regras de fundo, contraste e quantidade." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Segmented control", pt: "Controle segmentado" },
    desc: { en: "Coupled options tapped like buttons, always with one selected: soft and solid variants, three sizes, icons, full width and disabled option. Under Components › Buttons › Segmented control.", pt: "Opções acopladas que se tocam como botões, sempre com uma selecionada: variantes suave e sólida, três tamanhos, ícones, largura total e opção desabilitada. Em Componentes › Botões › Controle segmentado." },
    page: "buttons", anchor: "segmented",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Shine Border with color combinations", pt: "Shine Border com combinações de cores" },
    desc: { en: "New preset prop with five token-only combinations (primaria, dourada, primaria-dourada, ouro, contraste); the gold is the --warning token. shineColor still accepts a list of colors. Documented under Motion › Shine Border.", pt: "Nova prop preset com cinco combinações só de tokens (primária, dourada, primária-dourada, ouro, contraste); o dourado é o token --warning. shineColor segue aceitando uma lista de cores. Documentado em Motion › Shine Border." },
    page: "motion", anchor: "shine-border",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Avatar Circles", pt: "Avatar Circles" },
    desc: { en: "Overlapping avatar circles with a “+N” count, ported from Magic UI and adapted to the tokens (borders follow the background, three sizes, “+N” clickable only with a destination). Under Components › Badges › Avatar.", pt: "Círculos de avatares sobrepostos com “+N”, portado do Magic UI e adaptado aos tokens (bordas seguem o fundo, três tamanhos, “+N” clicável só com destino). Em Componentes › Badges › Avatar." },
    page: "badges", anchor: "avatar-circles",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Partner invitation card", pt: "Card de convite ao parceiro" },
    desc: { en: "Card inviting professionals to join the Partner Network: hero tag, headline with highlight, benefit, primary action and secondary link. Vertical and horizontal, sizes S, M and L, card, tint and dark surfaces. Under Components › Cards.", pt: "Card que convida profissionais para a Rede de Parceiros: selo, título com destaque, benefício, ação principal e link secundário. Vertical e horizontal, tamanhos P, M e G, superfícies card, apoio e grafite. Em Componentes › Cards." },
    page: "cards", anchor: "card-partner",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Headlines with a primary-color highlight", pt: "Títulos com destaque na cor primária" },
    desc: { en: "The site's hero pattern applied to headlines: the key expression is set in the primary color (Heading component, highlight between asterisks). Page titles updated and the rule documented under Foundation › Typography.", pt: "Padrão do hero do site aplicado aos títulos: a expressão-chave fica na cor primária (componente Heading, destaque entre asteriscos). Títulos de página atualizados e regra documentada em Fundamentos › Tipografia." },
    page: "colors", anchor: "typography",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Upload components", pt: "Componentes de upload" },
    desc: { en: "Drop area (with camera on mobile), file list with progress and states, single image with preview and image gallery with cover. Type, size and count validation, accessibility checklist, usage and tokens.", pt: "Área de arrastar e soltar (com câmera no celular), lista de arquivos com progresso e estados, imagem única com prévia e galeria de imagens com capa. Validação de tipo, tamanho e quantidade, checklist de acessibilidade, uso e tokens." },
    page: "upload", anchor: "upload-dropzone",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Hero tag (selo)", pt: "Selo (tag do hero)" },
    desc: { en: "The pill at the top of the Experience Intelligence page on the studio site is now a component: card background, thin border, uppercase with wide tracking and a primary dot or icon. Under Labels › Hero tag, with usage rules and tokens.", pt: "A pílula do topo da página Experience Intelligence do site do estúdio virou componente: fundo de card, borda fina, caixa alta com espaçamento largo e ponto ou ícone na cor primária. Em Rótulos › Selo, com regras de uso e tokens." },
    page: "badges", anchor: "selo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Side panel (drawer)", pt: "Painel lateral (gaveta)" },
    desc: { en: "The studio site's contact drawer documented and turned into a component: anatomy (header, scrollable body, fixed action bar, footer), behavior, the full contact form variant with validation and success state, accessibility checklist, usage and tokens.", pt: "A gaveta de contato do site do estúdio documentada e transformada em componente: anatomia (cabeçalho, corpo rolável, barra de ação fixa, rodapé), comportamento, a variante formulário de contato com validação e estado de sucesso, checklist de acessibilidade, uso e tokens." },
    page: "sidepanel", anchor: "sidepanel-anatomy",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Maintained on GitHub, no longer in Figma Make", pt: "Mantido no GitHub, não mais no Figma Make" },
    desc: { en: "From November 1st, 2026 the repository is the single source of truth: every change is made in code, published automatically as a numbered version (v1, v2, ...) and checked against the previous version so nothing disappears unnoticed.", pt: "A partir de 1º de novembro de 2026 o repositório é a única fonte da verdade: toda mudança é feita no código, publicada automaticamente como versão numerada (v1, v2, ...) e comparada com a anterior para que nada suma sem aviso." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Shine Border for highlighted cards", pt: "Shine Border para cards em destaque" },
    desc: { en: "A Magic UI-inspired Shine Border primitive is now available as an opt-in Card decoration, with timing and reduced-motion guidance documented under Motion.", pt: "Um primitive Shine Border inspirado no Magic UI agora está disponível como decoração opcional de Card, com orientações de timing e movimento reduzido documentadas em Motion." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Ghost, link and card button patterns", pt: "Padrões de botões ghost, link e em cards" },
    desc: { en: "Buttons now documents Ghost and Link usage, while Cards covers header, content, footer, navigation and destructive action patterns.", pt: "Botões agora documenta o uso de Ghost e Link, enquanto Cards contempla padrões no cabeçalho, conteúdo, rodapé, navegação e ações destrutivas." },
    page: "cards", anchor: "card-actions",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Nested card elevation rule", pt: "Regra de elevação para cards aninhados" },
    desc: { en: "The Cards specification now covers nested cards: the parent owns elevation, while every inner card uses shadow-none.", pt: "A especificação de Cards agora contempla cards aninhados: o card pai define a elevação, enquanto todo card interno usa shadow-none." },
    page: "cards", anchor: "card-nested",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Global search no longer depends on forwarded refs", pt: "Busca global não depende mais de refs encaminhadas" },
    desc: { en: "The search palette now uses a local React dialog, preserving bilingual filtering, keyboard shortcuts, focus and navigation without the unstable cmdk/Radix forwardRef path.", pt: "A paleta de busca agora usa um diálogo React local, preservando filtro bilíngue, atalhos, foco e navegação sem o caminho instável de forwardRef do cmdk/Radix." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Dialog composition stabilized for hot reload", pt: "Composição do diálogo estabilizada no hot reload" },
    desc: { en: "The Radix overlay now renders directly inside the portal, preserving function component identity while keeping SlotClone refs on the primitive.", pt: "O overlay Radix agora é renderizado diretamente no portal, preservando a identidade dos function components e mantendo as refs do SlotClone no primitive." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Dialog refs now reach Radix primitives", pt: "Refs do diálogo agora chegam aos primitives Radix" },
    desc: { en: "Dialog wrappers now forward refs correctly, removing SlotClone warnings from global search and every shared dialog.", pt: "Os wrappers de diálogo agora encaminham refs corretamente, removendo warnings do SlotClone na busca global e em todos os diálogos compartilhados." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Complete Cards specification restored", pt: "Especificação completa de Cards restaurada" },
    desc: { en: "Cards is back under Components with anatomy, variants, layout, interactive states, usage guidance, accessibility and semantic tokens.", pt: "Cards voltou para Componentes com anatomia, variantes, layout, estados interativos, diretrizes de uso, acessibilidade e tokens semânticos." },
    page: "cards",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Stable search dialog runtime", pt: "Runtime estável no diálogo de busca" },
    desc: { en: "React is now deduplicated by the Vite resolver, preventing the global search dialog from loading hooks from a second runtime instance.", pt: "O React agora é deduplicado pelo resolver do Vite, evitando que o diálogo de busca global carregue hooks de uma segunda instância do runtime." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Global search is now functional", pt: "Busca global agora funciona" },
    desc: { en: "Open search from the header or with Command/Ctrl + K to find and navigate to any page or section in English or Portuguese.", pt: "Abra a busca pelo cabeçalho ou com Command/Ctrl + K para encontrar e acessar qualquer página ou seção em inglês ou português." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Caption for the sidebar menu icon", pt: "Legenda no ícone de menu da sidebar" },
    desc: { en: "The menu icon at the top of the sidebar now has a tooltip and shows a \"Menu\" label when the sidebar is expanded.", pt: "O ícone de menu no topo da sidebar agora tem tooltip e exibe o rótulo \"Menu\" quando a sidebar está expandida." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "\"Motion\" kept as-is in Portuguese", pt: "\"Motion\" mantido em português" },
    desc: { en: "The Motion menu group and token category no longer translate to \"Movimento\", matching how the term is used in Portuguese design and development.", pt: "O grupo Motion do menu e a categoria de tokens deixam de ser traduzidos como \"Movimento\", seguindo o uso do termo no design e desenvolvimento em português." },
    page: "motion",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Cleaner sidebar header", pt: "Cabeçalho da sidebar mais limpo" },
    desc: { en: "Removed the divider line under the menu icon at the top of the sidebar.", pt: "Removida a linha divisória abaixo do ícone de menu no topo da sidebar." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Content aligned with the breadcrumb", pt: "Conteúdo alinhado ao breadcrumb" },
    desc: { en: "The breadcrumb trail and the page content now share the same container, so their left edges always line up.", pt: "O breadcrumb e o conteúdo da página agora compartilham o mesmo container, e suas bordas esquerdas ficam sempre alinhadas." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Consistent sidebar guide line", pt: "Linha guia consistente no menu lateral" },
    desc: { en: "Every open sidebar group now shows the same vertical guide line, including single-page groups with sub-items.", pt: "Todo grupo aberto do menu lateral agora mostra a mesma linha vertical, inclusive grupos de página única com subitens." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar behaves as an accordion", pt: "Menu lateral funciona como acordeão" },
    desc: { en: "Opening a category now closes the others, so only one group is expanded at a time.", pt: "Ao abrir uma categoria, as demais são fechadas: apenas um grupo fica expandido por vez." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar starts with 9 groups", pt: "Menu lateral começa com 9 grupos" },
    desc: { en: "The menu now opens collapsed, showing only Start, Brand, Foundation, Concepts, Guidelines, Backgrounds, Motion, Templates and Components. Click a group to reveal its pages.", pt: "O menu agora abre recolhido, mostrando só Start, Brand, Foundation, Concepts, Guidelines, Backgrounds, Motion, Templates e Components. Clique em um grupo para ver suas páginas." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar expands on hover", pt: "Menu lateral expande ao passar o mouse" },
    desc: { en: "On desktop, the sidebar stays as a 64px icon rail and only expands, over the content, while you hover or focus it.", pt: "No desktop, o menu lateral fica como uma faixa de ícones de 64px e só expande, por cima do conteúdo, enquanto você passa o mouse ou foca nele." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar overlays the content", pt: "Menu lateral fica por cima do conteúdo" },
    desc: { en: "On desktop, expanding the sidebar no longer pushes the page. It slides over the content while the page keeps a fixed 64px rail.", pt: "No desktop, expandir o menu lateral não empurra mais a página. Ele fica por cima do conteúdo, que mantém uma faixa fixa de 64px." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Menu toggle now inside the sidebar", pt: "Botão do menu agora dentro do menu lateral" },
    desc: { en: "On desktop, the hamburger icon sits at the top of the sidebar itself. On mobile it stays in the header.", pt: "No desktop, o ícone de hambúrguer fica no topo do próprio menu lateral. No mobile ele continua no cabeçalho." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Menu toggle moved to the header", pt: "Botão do menu agora no cabeçalho" },
    desc: { en: "The hamburger icon before the logo now opens and closes the sidebar on every screen size.", pt: "O ícone de hambúrguer antes do logo agora abre e fecha o menu lateral em qualquer tamanho de tela." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Collapsible sidebar", pt: "Menu lateral retraível" },
    desc: { en: "On desktop, collapse the menu down to icons only and expand it back. Your choice is remembered.", pt: "No desktop, recolha o menu para mostrar só os ícones e expanda de novo. Sua escolha fica salva." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "What's New on Home", pt: "Novidades na Home" },
    desc: { en: "This log. Every addition to the design system is recorded here, newest first.", pt: "Este registro. Toda adição ao design system é anotada aqui, da mais recente para a mais antiga." },
    page: "overview", anchor: "whats-new",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Home refreshed", pt: "Home renovada" },
    desc: { en: "Rewritten for vibe coders and AI tools, with a map of every section in the system.", pt: "Reescrita para vibe coders e ferramentas de IA, com um mapa de todas as seções do sistema." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Design Principles as a timeline", pt: "Princípios de Design em linha do tempo" },
    desc: { en: "A vertical timeline with cards alternating left and right on desktop, and a single rail on mobile.", pt: "Uma linha do tempo vertical com cards alternando entre esquerda e direita no desktop, e um único trilho no mobile." },
    page: "principles",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Home in the sidebar", pt: "Home na barra lateral" },
    desc: { en: "Home is now the first item in the Start group, above Get Started.", pt: "A Home agora é o primeiro item do grupo Início, acima de Primeiros passos." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Removed", title: { en: "Posts & Carousels", pt: "Posts e Carrosséis" },
    desc: { en: "Removed from the menu to keep the system focused on product interfaces.", pt: "Removidos do menu para manter o sistema focado em interfaces de produto." },
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Single-line header", pt: "Cabeçalho em uma linha" },
    desc: { en: "Icon, Dani Moscatelli, a divider and a shimmering Design System label on one line.", pt: "Ícone, Dani Moscatelli, um divisor e um rótulo Design System com brilho, tudo em uma linha." },
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Guidelines: Usability and Accessibility", pt: "Diretrizes: Usabilidade e Acessibilidade" },
    desc: { en: "Action hierarchy, target sizes, microcopy, contrast, focus, keyboard and ARIA, each with a checklist.", pt: "Hierarquia de ações, tamanhos de alvo, microcopy, contraste, foco, teclado e ARIA, cada um com um checklist." },
    page: "usability",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Start group", pt: "Grupo Início" },
    desc: { en: "Get Started, Design Principles and Develop sit at the top of the menu, above Brand.", pt: "Primeiros passos, Princípios de Design e Desenvolvimento ficam no topo do menu, acima de Marca." },
    page: "get-started",
  },
];
