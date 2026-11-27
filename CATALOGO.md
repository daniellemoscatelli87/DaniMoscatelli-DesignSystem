# Catálogo do Dani Moscatelli Design System

> Gerado automaticamente por `scripts/gerar-catalogo.mjs` a cada `pnpm build`. **Não edite à mão**: mude o código e rode o build (ou `node scripts/gerar-catalogo.mjs`). `node scripts/gerar-catalogo.mjs --check` falha se este arquivo estiver desatualizado. Versão para programas: [`catalogo.json`](catalogo.json).

**A regra:** antes de criar ou alterar qualquer elemento visual (inclusive páginas de demonstração e templates), consulte este catálogo e use o componente, template ou padrão que já existe; não recrie à mão. Peça nova nasce em `src/app/components/ui/` pelo processo de `propostas/README.md`.

**Resumo:** 76 arquivos de componentes em `src/app/components/ui/` com 318 componentes exportados · 68 templates e padrões ainda só em demonstração · 47 seções com marcação feita à mão · 157 tokens · 29 páginas e 198 âncoras no site (https://designsystem.danimoscatelli.com.br) · 0 propostas de componente.

Como procurar: use a busca do editor (Ctrl+F) pelo que a tela precisa (por exemplo "plano", "preço", "card", "alerta", "tabela", "chip"). "Onde ver" leva à página do site e à âncora da seção (`página#âncora`); no site, abra a página pelo menu e a seção pelo submenu.

## Sumário

1. [Componentes importáveis](#1-componentes-importáveis)
2. [Padrões ainda só em demonstração (não importáveis)](#2-padrões-ainda-só-em-demonstração-não-importáveis)
3. [Tokens](#3-tokens)
4. [Regras de uso](#4-regras-de-uso)
5. [Propostas de componente](#5-propostas-de-componente)
6. [Páginas e âncoras do site](#6-páginas-e-âncoras-do-site)

## 1. Componentes importáveis

Tudo o que está em `src/app/components/ui/`. Dentro do design system, importe de `../ui/<arquivo>` (ou `@/app/components/ui/<arquivo>`). No produto, use a cópia que chega pela sincronização do design system (`design-system/arquivos.txt` do produto), nunca uma cópia feita à mão.

### accordion

- **Arquivo:** [src/app/components/ui/accordion.tsx](src/app/components/ui/accordion.tsx)
- **Quando usar:** Seções que abrem e fecham pelo título; uma ou várias abertas ao mesmo tempo.
- **Componentes:**
  - `Accordion`
  - `AccordionItem` (props: `className`)
  - `AccordionTrigger` (props: `className`, `children`, `semIcone`)
  - `AccordionContent` (props: `className`, `children`)
- **Onde ver:** Overlays › Accordion (`overlays#accordion`)

### alert

- **Arquivo:** [src/app/components/ui/alert.tsx](src/app/components/ui/alert.tsx)
- **Quando usar:** Alerta (padrão de todos os alertas, decisão da dona do produto de 23/11/2026): Mesma aparência do Alerta com ação (ui/alerta-com-acao): cantos de 16 px, respiro de 20 × 22 px, borda na cor do estado a 22%, fundo do card com a cor do estado a 7% (9% no aviso), o svg filho vira o ícone com base (caixa de 44 px, cantos --radius-md, base na cor do estado a 18% ou 30% no aviso, ícone de 20 px na cor de ícone do estado), …
- **Componentes:**
  - `Alert` (props: `className`, `variant`)
  - `AlertTitle` (props: `className`)
  - `AlertDescription` (props: `className`)
- **Variantes:** `variant` = `destructive` · `success` · `info` · `warning` · `error`
- **Onde ver:** Feedback › Alertas (`feedback#alerts`)

### alert-dialog

- **Arquivo:** [src/app/components/ui/alert-dialog.tsx](src/app/components/ui/alert-dialog.tsx)
- **Quando usar:** Diálogo de confirmação para ações importantes ou destrutivas; exige uma resposta.
- **Componentes:**
  - `AlertDialog`
  - `AlertDialogTrigger`
  - `AlertDialogPortal`
  - `AlertDialogOverlay` (props: `className`)
  - `AlertDialogContent` (props: `className`)
  - `AlertDialogHeader` (props: `className`)
  - `AlertDialogFooter` (props: `className`)
  - `AlertDialogTitle` (props: `className`)
  - `AlertDialogDescription` (props: `className`)
  - `AlertDialogAction` (props: `className`)
  - `AlertDialogCancel` (props: `className`)
- **Onde ver:** Overlays (`overlays`, fora das seções)

### alerta-com-acao

- **Arquivo:** [src/app/components/ui/alerta-com-acao.tsx](src/app/components/ui/alerta-com-acao.tsx)
- **Quando usar:** Alerta com ação (aprovado pela dona do produto em 23/11/2026): Aviso que pede uma ação de quem lê: ícone com base, título, descrição (com nota opcional) e, embaixo do texto, uma ação principal de contorno (BotaoDoAlerta) e, se precisar, uma secundária em forma de link (LinkDoAlerta). Regras: - as ações ficam sempre embaixo do texto, nunca ao lado; - uma só ação principal, de contorno (sem preenchimento);
- **Componentes:**
  - `AlertaComAcao` (props: `tom`, `titulo`, `icone`, `acoes`, `onFechar`, `rotuloFechar`, `className`, `children`)
  - `BotaoDoAlerta` (props: `tom`, `asChild`, `className`): Ação principal do alerta: só contorno, na cor do estado; texto e ícone na cor de texto do estado.
  - `LinkDoAlerta` (props: `asChild`, `className`): Ação secundária do alerta: botão com cara de link, sublinhado, em --foreground.
- **Funções e constantes:** `variaveisDoAlerta`
- **Variantes:** `tom` = `info` · `sucesso` · `aviso` · `erro`
- **Onde ver:** Feedback › Alerta com ação (`feedback#alerta-com-acao`)

### aspect-ratio

- **Arquivo:** [src/app/components/ui/aspect-ratio.tsx](src/app/components/ui/aspect-ratio.tsx)
- **Quando usar:** Mantém imagem ou vídeo numa proporção fixa (por exemplo 4:5).
- **Componentes:**
  - `AspectRatio`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### avatar

- **Arquivo:** [src/app/components/ui/avatar.tsx](src/app/components/ui/avatar.tsx)
- **Quando usar:** Foto ou iniciais de uma pessoa ou loja.
- **Componentes:**
  - `Avatar` (props: `className`)
  - `AvatarImage` (props: `className`)
  - `AvatarFallback` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### avatar-circles

- **Arquivo:** [src/app/components/ui/avatar-circles.tsx](src/app/components/ui/avatar-circles.tsx)
- **Quando usar:** AvatarCircles — portado do Magic UI (magicui.design/docs/components/avatar-circles).
- **Componentes:**
  - `AvatarCircles` (props: `numPeople`, `className`, `avatarUrls`, `moreHref`, `size`)
- **Onde ver:** Rótulos › Avatar Circles (`badges#avatar-circles`) · Cards › Vidro com conteúdo (`cards#card-glass-conteudo`)

### aviso-cookies

- **Arquivo:** [src/app/components/ui/aviso-cookies.tsx](src/app/components/ui/aviso-cookies.tsx)
- **Quando usar:** AvisoCookies (aviso de cookies, LGPD): Faixa do site (public/analytics.js) que pede consentimento antes de ligar a medição de acessos. Fica no rodapé da tela, centralizada, com até 720 px; abaixo de 480 px os dois botões dividem a largura. Recusar e Aceitar têm o mesmo peso de leitura (contorno e primária) e 44 px de altura.
- **Componentes:**
  - `AvisoCookies` (props: `texto`, `politica`, `rotuloRecusar`, `rotuloAceitar`, `rotuloRegiao`, `onAceitar`, `onRecusar`, `aberto`, `chave`, `fixo`, `className`)
- **Funções e constantes:** `CHAVE_COOKIES`, `abrirAvisoCookies`, `lerEscolhaCookies`
- **Onde ver:** Padrões do site › Aviso de cookies (`site#site-cookies`)

### aviso-projeto

- **Arquivo:** [src/app/components/ui/aviso-projeto.tsx](src/app/components/ui/aviso-projeto.tsx)
- **Quando usar:** AvisoProjeto (aviso flutuante "Tem um projeto?"): Balão da página inicial do site (src/compartilhado/partes.ts e menu.ts) que aponta para o botão do WhatsApp e, ao ser clicado, abre a conversa. Entra com um leve deslize 0,6 s depois de a página abrir e flutua 3 vezes; sem animação para quem pede menos movimento. Pode ser fechado no X e não volta mais na mesma sessão (sessionStorage, chave "cta-contato-fechado");
- **Componentes:**
  - `AvisoProjeto` (props: `titulo`, `texto`, `rotuloAcao`, `rotuloFechar`, `href`, `onAcao`, `onFechar`, `posicao`, `fixo`, `lembrarFechado`, `animar`, `className`)
- **Onde ver:** Padrões do site › Elementos flutuantes (`site#site-flutuantes`)

### badge

- **Arquivo:** [src/app/components/ui/badge.tsx](src/app/components/ui/badge.tsx)
- **Quando usar:** Rótulo curto de status ou categoria.
- **Componentes:**
  - `Badge` (props: `className`, `variant`, `asChild`)
- **Funções e constantes:** `badgeVariants`
- **Variantes:** `variant` = `default` · `secondary` · `destructive` · `outline`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### botao-subir

- **Arquivo:** [src/app/components/ui/botao-subir.tsx](src/app/components/ui/botao-subir.tsx)
- **Quando usar:** BotaoSubir (voltar ao topo): Botão redondo de 56 px, de superfície clara com borda, que aparece quando o rodapé entra na tela e leva a pessoa de volta ao topo (Projeto Piloto e Seja Parceiro). Fica ao lado do botão do WhatsApp: 88 px da direita (92 px a partir de 640 px), na mesma linha de base. Entra subindo 16 px e aparecendo; sem animação e com volta instantânea para quem pede menos movimento.
- **Componentes:**
  - `BotaoSubir` (props: `alvo`, `raiz`, `visivel`, `rotulo`, `focoEm`, `aoLadoDoWhatsApp`, `fixo`, `className`)
- **Onde ver:** Padrões do site › Elementos flutuantes (`site#site-flutuantes`)

### botao-whatsapp

- **Arquivo:** [src/app/components/ui/botao-whatsapp.tsx](src/app/components/ui/botao-whatsapp.tsx)
- **Quando usar:** BotaoWhatsApp (botão flutuante do WhatsApp): Botão redondo de 56 px no canto inferior direito (20 px da borda; 24 px a partir de 640 px), que abre a conversa no WhatsApp em nova aba, com uma mensagem pronta. É o mesmo botão de todas as páginas do site (index.html e public/whatsapp.js).
- **Componentes:**
  - `IconeWhatsApp` (props: `className`)
  - `BotaoWhatsApp` (props: `numero`, `mensagem`, `rotulo`, `titulo`, `fixo`, `className`, `style`)
- **Funções e constantes:** `VERDE_WHATSAPP`, `linkWhatsApp`
- **Onde ver:** Padrões do site › Elementos flutuantes (`site#site-flutuantes`)

### breadcrumb

- **Arquivo:** [src/app/components/ui/breadcrumb.tsx](src/app/components/ui/breadcrumb.tsx)
- **Quando usar:** Trilha que mostra onde a página está na hierarquia.
- **Componentes:**
  - `Breadcrumb`
  - `BreadcrumbList` (props: `className`)
  - `BreadcrumbItem` (props: `className`)
  - `BreadcrumbLink` (props: `asChild`, `className`)
  - `BreadcrumbPage` (props: `className`)
  - `BreadcrumbSeparator` (props: `children`, `className`)
  - `BreadcrumbEllipsis` (props: `className`)
- **Onde ver:** Overlays › Breadcrumb (`overlays#breadcrumb`)

### button

- **Arquivo:** [src/app/components/ui/button.tsx](src/app/components/ui/button.tsx)
- **Quando usar:** Padrão único (decisão de 16/11/2026): botão de 40 px, texto 15 px seminegrito, cantos 12 px; mesma altura do campo de texto.
- **Componentes:**
  - `Button` (props: `className`, `variant`, `size`, `asChild`)
- **Funções e constantes:** `buttonVariants`
- **Variantes:** `variant` = `default` · `destructive` · `outline` · `ghost` · `link`; `size` = `default` · `sm` · `lg` · `icon`
- **Onde ver:** Botões › Variantes de botão (`buttons#buttons`) · Desenvolvimento › Consulte o catálogo antes de montar qualquer peça (`develop#dev-catalogo`) · Cards › Anatomia do card (`cards#card-anatomy`) · e mais 13 seções (ver `catalogo.json`)

### calendar

- **Arquivo:** [src/app/components/ui/calendar.tsx](src/app/components/ui/calendar.tsx)
- **Quando usar:** Calendário mensal para escolher uma data ou um intervalo.
- **Componentes:**
  - `Calendar` (props: `className`, `classNames`, `showOutsideDays`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### card

- **Arquivo:** [src/app/components/ui/card.tsx](src/app/components/ui/card.tsx)
- **Quando usar:** Card base com cabeçalho, conteúdo e rodapé.
- **Componentes:**
  - `Card` (props: `className`)
  - `CardHeader` (props: `className`)
  - `CardTitle` (props: `className`)
  - `CardDescription` (props: `className`)
  - `CardAction` (props: `className`)
  - `CardContent` (props: `className`)
  - `CardFooter` (props: `className`)
- **Onde ver:** Cards › Como escolher (`cards#card-escolher`) · Cards › Card sólido (`cards#card-solido`) · Cards › Anatomia do card (`cards#card-anatomy`) · e mais 15 seções (ver `catalogo.json`)

### card-frente

- **Arquivo:** [src/app/components/ui/card-frente.tsx](src/app/components/ui/card-frente.tsx)
- **Quando usar:** CardDeFrente e GradeDeFrentes (frentes de atuação): Cards da seção "Onde podemos atuar" do Projeto Piloto (article.card-frente de projeto-piloto/index.html e src/projeto-piloto.css). Ícone num quadro de 56 px, título, subtítulo em vermelho, descrição e os temas em pílulas, separados por uma linha.
- **Componentes:**
  - `CardDeFrente` (props: `numero`, `icone`, `titulo`, `subtitulo`, `descricao`, `temas`, `rotuloTemas`, `tom`, `mostrarNumero`, `barra`, `nivelTitulo`, `className`, `style`, `onPointerMove`)
  - `GradeDeFrentes` (props: `rotulo`, `className`, `children`): Grade de 3/2 colunas; no celular, carrossel com encaixe. Para a entrada em cascata do site: <SurgirAoRolar as={GradeDeFrentes} escalonar>…cards…</SurgirAoRolar>.
- **Onde ver:** Padrões do site › Card de frente de atuação (`site#site-frentes`) · Padrões do site › Entrada ao rolar (`site#site-entrada`)

### carousel

- **Arquivo:** [src/app/components/ui/carousel.tsx](src/app/components/ui/carousel.tsx)
- **Quando usar:** Lista horizontal que desliza, com botões de anterior e próximo.
- **Componentes:**
  - `Carousel` (props: `orientation`, `opts`, `setApi`, `plugins`, `className`, `children`)
  - `CarouselContent` (props: `className`)
  - `CarouselItem` (props: `className`)
  - `CarouselPrevious` (props: `className`, `variant`, `size`)
  - `CarouselNext` (props: `className`, `variant`, `size`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### chart

- **Arquivo:** [src/app/components/ui/chart.tsx](src/app/components/ui/chart.tsx)
- **Quando usar:** Format: { THEME_NAME: CSS_SELECTOR }
- **Componentes:**
  - `ChartContainer` (props: `id`, `className`, `children`, `config`)
  - `ChartStyle` (props: `id`, `config`)
  - `ChartTooltipContent` (props: `active`, `payload`, `className`, `indicator`, `hideLabel`, `hideIndicator`, `label`, `labelFormatter`, `labelClassName`, `formatter`, `color`, `nameKey`, `labelKey`)
  - `ChartLegendContent` (props: `className`, `hideIcon`, `payload`, `verticalAlign`, `nameKey`)
- **Funções e constantes:** `ChartTooltip`, `ChartLegend`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### checkbox

- **Arquivo:** [src/app/components/ui/checkbox.tsx](src/app/components/ui/checkbox.tsx)
- **Quando usar:** Caixa de seleção para escolhas independentes.
- **Componentes:**
  - `Checkbox` (props: `className`)
- **Onde ver:** Botões › Senha (`buttons#password`) · Botões › Controle segmentado (`buttons#segmented`)

### collapsible

- **Arquivo:** [src/app/components/ui/collapsible.tsx](src/app/components/ui/collapsible.tsx)
- **Quando usar:** Mostra e esconde um bloco de conteúdo.
- **Componentes:**
  - `Collapsible`
  - `CollapsibleTrigger`
  - `CollapsibleContent`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### command

- **Arquivo:** [src/app/components/ui/command.tsx](src/app/components/ui/command.tsx)
- **Quando usar:** Paleta de comandos com busca (Ctrl+K).
- **Componentes:**
  - `Command` (props: `className`)
  - `CommandDialog` (props: `title`, `description`, `children`)
  - `CommandInput` (props: `className`)
  - `CommandList` (props: `className`)
  - `CommandEmpty`
  - `CommandGroup` (props: `className`)
  - `CommandSeparator` (props: `className`)
  - `CommandItem` (props: `className`)
  - `CommandShortcut` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### context-menu

- **Arquivo:** [src/app/components/ui/context-menu.tsx](src/app/components/ui/context-menu.tsx)
- **Quando usar:** Menu aberto com o botão direito.
- **Componentes:**
  - `ContextMenu`
  - `ContextMenuTrigger`
  - `ContextMenuGroup`
  - `ContextMenuPortal`
  - `ContextMenuSub`
  - `ContextMenuRadioGroup`
  - `ContextMenuSubTrigger` (props: `className`, `inset`, `children`)
  - `ContextMenuSubContent` (props: `className`)
  - `ContextMenuContent` (props: `className`)
  - `ContextMenuItem` (props: `className`, `inset`, `variant`)
  - `ContextMenuCheckboxItem` (props: `className`, `children`, `checked`)
  - `ContextMenuRadioItem` (props: `className`, `children`)
  - `ContextMenuLabel` (props: `className`, `inset`)
  - `ContextMenuSeparator` (props: `className`)
  - `ContextMenuShortcut` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### contrast

- **Arquivo:** [src/app/components/ui/contrast.ts](src/app/components/ui/contrast.ts)
- **Quando usar:** Utilitários de contraste (WCAG 2.x) para avaliar texto sobre vidro.
- **Funções e constantes:** `parseColor`, `resolveCssColor`, `over`, `luminance`, `contrastRatio`, `AA`, `formatRatio`
- **Onde ver:** Cards › Card de vidro (`cards#card-vidro`) · Cards › Vidro: acabamentos (`cards#card-glass`) · Cards › Vidro por fundo (`cards#card-glass-fundos`) · e mais 1 seções (ver `catalogo.json`)

### curva-secao

- **Arquivo:** [src/app/components/ui/curva-secao.tsx](src/app/components/ui/curva-secao.tsx)
- **Quando usar:** CurvaSecao (divisor curvo entre seções): Borda curva e suave entre uma seção clara e uma escura (Projeto Piloto, seção "Onde podemos atuar"). É um SVG decorativo, de ponta a ponta, que se estica na largura (preserveAspectRatio="none") e fica dentro da seção, por cima do fundo dela:
- **Componentes:**
  - `CurvaSecao` (props: `posicao`, `cor`, `className`)
- **Onde ver:** Padrões do site › Divisores curvos (`site#site-curvas`) · Padrões do site › Entrada ao rolar (`site#site-entrada`)

### dialog

- **Arquivo:** [src/app/components/ui/dialog.tsx](src/app/components/ui/dialog.tsx)
- **Quando usar:** Janela modal para tarefas que pedem foco.
- **Componentes:**
  - `Dialog`
  - `DialogTrigger`
  - `DialogPortal`
  - `DialogClose`
  - `DialogOverlay` (props: `className`)
  - `DialogContent` (props: `className`, `children`)
  - `DialogHeader` (props: `className`)
  - `DialogFooter` (props: `className`)
  - `DialogTitle` (props: `className`)
  - `DialogDescription` (props: `className`)
- **Onde ver:** Overlays › Diálogos (`overlays#dialogs`)

### doodle-texture

- **Arquivo:** [src/app/components/ui/doodle-texture.tsx](src/app/components/ui/doodle-texture.tsx)
- **Quando usar:** DoodleTexture (textura doodle): Padrão de ícones de traço, sem emenda, no universo da marca: pesquisa, inovação, UX, UI, usuário, jornada, post-it e design thinking. O desenho vem de `public/texturas/doodle-studio-traco.svg` e é aplicado como máscara, então a cor do traço é qualquer token (sólida, sem transparência) e segue o tema.
- **Componentes:**
  - `DoodleTexture` (props: `scale`, `color`, `position`, `className`, `style`)
- **Funções e constantes:** `doodleTextureFiles`
- **Onde ver:** Fundos › Textura doodle (`backgrounds#doodle-bg`) · Cards › Vidro: acabamentos (`cards#card-glass`) · Cards › Vidro por fundo (`cards#card-glass-fundos`) · e mais 2 seções (ver `catalogo.json`)

### drawer

- **Arquivo:** [src/app/components/ui/drawer.tsx](src/app/components/ui/drawer.tsx)
- **Quando usar:** Painel que sobe da parte de baixo da tela (celular).
- **Componentes:**
  - `Drawer`
  - `DrawerTrigger`
  - `DrawerPortal`
  - `DrawerClose`
  - `DrawerOverlay` (props: `className`)
  - `DrawerContent` (props: `className`, `children`)
  - `DrawerHeader` (props: `className`)
  - `DrawerFooter` (props: `className`)
  - `DrawerTitle` (props: `className`)
  - `DrawerDescription` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### dropdown-menu

- **Arquivo:** [src/app/components/ui/dropdown-menu.tsx](src/app/components/ui/dropdown-menu.tsx)
- **Quando usar:** Menu de ações aberto por um botão.
- **Componentes:**
  - `DropdownMenu`
  - `DropdownMenuPortal`
  - `DropdownMenuTrigger`
  - `DropdownMenuContent` (props: `className`, `sideOffset`)
  - `DropdownMenuGroup`
  - `DropdownMenuItem` (props: `className`, `inset`, `variant`)
  - `DropdownMenuCheckboxItem` (props: `className`, `children`, `checked`)
  - `DropdownMenuRadioGroup`
  - `DropdownMenuRadioItem` (props: `className`, `children`)
  - `DropdownMenuLabel` (props: `className`, `inset`)
  - `DropdownMenuSeparator` (props: `className`)
  - `DropdownMenuShortcut` (props: `className`)
  - `DropdownMenuSub`
  - `DropdownMenuSubTrigger` (props: `className`, `inset`, `children`)
  - `DropdownMenuSubContent` (props: `className`)
- **Onde ver:** Overlays › Dropdown (`overlays#dropdown`)

### form

- **Arquivo:** [src/app/components/ui/form.tsx](src/app/components/ui/form.tsx)
- **Quando usar:** Base de formulário (react-hook-form) com rótulo, mensagem e erros.
- **Componentes:**
  - `FormField`
  - `FormItem` (props: `className`)
  - `FormLabel` (props: `className`)
  - `FormControl`
  - `FormDescription` (props: `className`)
  - `FormMessage` (props: `className`)
- **Funções e constantes:** `Form`, `useFormField`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### glass-card

- **Arquivo:** [src/app/components/ui/glass-card.tsx](src/app/components/ui/glass-card.tsx)
- **Quando usar:** GlassCard (card glassmorphism): Superfície translúcida com desfoque do fundo, borda clara e um fio de luz no topo. Só funciona sobre um fundo com cor, gradiente ou imagem; sobre fundo liso vira um card comum. Use para poucos elementos em destaque (hero, resumo, chamada); não para listas longas nem para leitura extensa. Com prefers-reduced-transparency o card vira sólido.
- **Componentes:**
  - `GlassCard` (props: `finish`, `intensity`, `tone`, `tint`, `interactive`, `opacity`, `blur`, `className`, `style`, `children`)
  - `GlassScene` (props: `dark`, `className`, `children`)
- **Funções e constantes:** `glassSceneTexture`, `glassOpacityTable`, `glassTextContrast`
- **Onde ver:** Cards › Vidro com conteúdo (`cards#card-glass-conteudo`) · Cards › Vidro: acabamentos (`cards#card-glass`) · Cards › Vidro por fundo (`cards#card-glass-fundos`) · e mais 1 seções (ver `catalogo.json`)

### graficos-catalogo

- **Arquivo:** [src/app/components/ui/graficos-catalogo.tsx](src/app/components/ui/graficos-catalogo.tsx)
- **Quando usar:** Catálogo completo de gráficos (19/11/2026): os modelos do catálogo de referência que não estão entre os recomendados. Mesmas regras de graficos-inteligencia.tsx: componentes de apresentação (dados por props), só os tokens de gráfico (--chart-1 a --chart-N, --chart-neutral, --chart-grid, --chart-seq-*;
- **Componentes:**
  - `BarrasAgrupadas` (props: `grupos`, `series`, `maximo`, `rotulo`, `formatar`, `className`): Barras agrupadas, deitadas: em cada grupo, uma barra por série com o valor escrito no fim. O nome de cada série aparece em cima das barras do primeiro grupo (e na legenda).
  - `BarrasEmpilhadas` (props: `categorias`, `linhas`, `rotulo`, `formatar`, `className`): Barras empilhadas com o total escrito no fim. As partes não levam texto: embaixo de cada barra, uma linha com o valor de cada parte, na mesma ordem e com um ponto na cor dela.
  - `Pirulito` (props: `itens`, `destaques`, `ordenar`, `referencia`, `maximo`, `rotulo`, `formatar`, `className`): Pirulito: haste fina e um ponto no valor, escrito ao lado. Mais leve que barras quando há muitos itens.
  - `AreaEmpilhada` (props: `series`, `rotulosX`, `altura`, `rotulo`, `formatar`, `rotulos`, `className`): Área empilhada: o topo é o total; cada camada é a parte de uma série. Nome e último valor no fim de cada camada.
  - `Streamgraph` (props: `series`, `rotulosX`, `altura`, `rotulo`, `formatar`, `className`): Streamgraph: camadas empilhadas em torno de um eixo central, em curvas suaves. Mostra o volume e a mistura mudando no tempo; não serve para ler valores exatos (estão no fim de cada camada e na tabela).
  - `LinhaDoTempo` (props: `eventos`, `inicio`, `fim`, `marcas`, `rotulo`, `className`): Linha do tempo com espaçamento proporcional: cada evento é um ponto no eixo, com data e nome em faixas abaixo (as faixas se multiplicam quando os nomes não cabem lado a lado). Diferente do componente Timeline (lista de etapas).
  - `CalendarioDeCalor` (props: `dias`, `rotulo`, `formatar`, `className`, `rotulosDias`, `rotulosMeses`, `formatarData`): Calendário de calor: uma coluna por semana, uma linha por dia da semana, cor pela escala sequencial. O dia de maior valor fica contornado e escrito abaixo; o valor de cada dia aparece ao passar o cursor e na tabela.
  - `GraficoDeVelas` (props: `velas`, `altura`, `rotulo`, `formatar`, `rotulos`, `className`): Velas: em cada período, o traço vai da mínima à máxima e o corpo da abertura ao fechamento. Corpo cheio quando fechou acima da abertura, vazado quando fechou abaixo (a forma diz a direção, não só a cor).
  - `Pizza` (props: `partes`, `rotulo`, `formatarQuantidade`, `localidade`, `tamanho`, `className`): Pizza: mesmas regras da rosca (partes do maior para o menor, "Outros" em grafite no fim, percentual junto de cada fatia).
  - `Waffle` (props: `partes`, `rotulo`, `localidade`, `formatarQuantidade`, `nota`, `className`): Waffle: 100 quadrados, cada um é 1% do total; as partes se preenchem em ordem, da maior para a menor.
  - `Piramide` (props: `faixas`, `esquerda`, `direita`, `maximo`, `rotulo`, `formatar`, `className`): Pirâmide: dois grupos de costas um para o outro, faixa a faixa, com o valor escrito na ponta de cada barra.
  - `Dispersao` (props: `pontos`, `eixoX`, `eixoY`, `tendencia`, `altura`, `rotulo`, `rotulos`, `className`): Dispersão: um ponto por item em dois eixos. Os destaques ficam na cor primária e com o nome escrito.
  - `MatrizDeCorrelacao` (props: `variaveis`, `valores`, `destaque`, `localidade`, `rotulo`, `rotulos`, `className`): Matriz de correlação (metade de baixo, numa tabela de verdade): a cor mostra a força da relação, pela escala sequencial, e as listras mostram a direção (com listras: quando uma sobe, a outra desce).
  - `Radar` (props: `eixos`, `series`, `maximo`, `niveis`, `rotulo`, `formatar`, `className`): Radar: cada eixo é uma medida na mesma escala. A série em destaque é preenchida e tem os valores escritos junto do nome de cada eixo, fora da área; as outras são só contorno (tracejado), para não depender só da cor.
  - `CoordenadasParalelas` (props: `eixos`, `itens`, `altura`, `rotulo`, `className`): Coordenadas paralelas: compara itens em várias medidas de escalas diferentes; cada eixo mostra o próprio mínimo e máximo.
  - `Sankey` (props: `nos`, `ligacoes`, `altura`, `rotulo`, `formatar`, `className`): Sankey: fluxos entre etapas; a espessura de cada faixa é a quantidade. O nome e o valor de cada nó ficam escritos ao lado dele; a faixa em destaque fica no tom 1 e as outras no cinza de contexto (tom 6).
  - `RedeDeConexoes` (props: `nos`, `ligacoes`, `rotulo`, `formatar`, `className`): Rede de conexões em círculo: cada nó num ponto do círculo, ligações curvas por dentro, com espessura pela força. As ligações do nó em destaque ficam na cor primária; passar o cursor num nó realça as ligações dele.
  - `Histograma` (props: `valores`, `faixas`, `destaque`, `referencia`, `eixoX`, `altura`, `rotulo`, `formatar`, `className`): Histograma: quantos valores caem em cada faixa. A contagem fica escrita em cima de cada barra quando cabe.
  - `BoxPlot` (props: `grupos`, `eixo`, `rotulo`, `formatar`, `rotulos`, `className`): Box plot: a caixa vai do 1º ao 3º quartil (a metade do meio), o traço é a mediana, os bigodes vão até 1,5 × a caixa e os pontos vazados são valores fora do padrão. A mediana fica escrita ao lado de cada grupo.
  - `Violino` (props: `grupos`, `eixo`, `rotulo`, `formatar`, `rotulos`, `className`): Violino: o contorno mostra onde os valores se concentram em cada grupo (densidade estimada, espelhada). Dentro, a barra escura é a metade do meio e o ponto é a mediana, escrita ao lado do nome.
  - `Densidade` (props: `series`, `eixoX`, `altura`, `rotulo`, `rotulos`, `className`): Curvas de densidade: a forma de cada distribuição, suavizada, para comparar onde cada grupo se concentra. O nome de cada série fica escrito no pico da curva; o eixo vertical não tem unidade (só a forma importa).
  - `MapaDePontos` (props: `regioes`, `colunas`, `linhas`, `pontos`, `tipos`, `altura`, `nomesDasRegioes`, `rotulo`, `rotulos`, `className`): Mapa de pontos esquemático: cada ponto é um lugar (loja, unidade…) na posição aproximada que o produto informar. Os tipos mudam a forma e o tom; os destaques têm o nome escrito. Não é mapa em escala e não usa dados geográficos.
  - `MapaDeBolhas` (props: `regioes`, `colunas`, `linhas`, `bolhas`, `rotuloTamanho`, `formatar`, `altura`, `nomesDasRegioes`, `rotulo`, `rotulos`, `className`): Mapa de bolhas esquemático: uma bolha por lugar, com a área proporcional ao valor. Nome e valor ficam escritos embaixo da bolha, fora dela. Não é mapa em escala e não usa dados geográficos.
- **Funções e constantes:** `CORES_SERIES`, `quebrarTexto`, `resumoDaDistribuicao`
- **Onde ver:** Gráficos › (`graficos#graficos-catalogo-comparacao`) · Gráficos › (`graficos#graficos-catalogo-tempo`) · Gráficos › (`graficos#graficos-catalogo-composicao`) · e mais 4 seções (ver `catalogo.json`)

### graficos-inteligencia

- **Arquivo:** [src/app/components/ui/graficos-inteligencia.tsx](src/app/components/ui/graficos-inteligencia.tsx)
- **Quando usar:** Os tons da paleta, do destaque (1) ao contexto (o último). Para escolher tons, use coresPorImportancia.
- **Componentes:**
  - `DegradeDaArea` (props: `id`, `cor`, `topo`, `base`, `espelhado`)
  - `PontoDaCor` (props: `cor`, `className`): Ponto na cor da marca, antes de um valor escrito fora dela (liga o número à parte).
  - `TabelaDeDados` (props: `dados`, `legenda`, `className`): Tabela de dados (alternativa acessível ao gráfico e detalhamento para quem quer conferir).
  - `DescobertaVisual` (props: `tema`, `conclusao`, `contexto`, `children`, `porQueImporta`, `acao`, `dados`, `selo`, `numerar`, `rotulos`, `className`): Card de descoberta: conclusão, gráfico, por que importa, próximo passo e dados (recolhidos).
  - `LegendaDoGrafico` (props: `itens`, `className`): Legenda compacta (sempre junto de rótulos diretos, nunca sozinha)
  - `GraficoDeRosca` (props: `partes`, `centro`, `rotulo`, `formatarQuantidade`, `localidade`, `tamanho`, `className`): Rosca de participação, no traço fino do DS: as partes nos tons por importância (da maior para a menor; a maior no tom 1), "Outros" em cinza de contexto no fim, percentuais escritos junto de cada parte e lista com nome, quantidade e …
  - `BarrasOrdenadas` (props: `itens`, `destaques`, `ordenar`, `posicao`, `cores`, `rotulo`, `formatar`, `className`): Barras horizontais ordenadas, com o nome em cima e o valor escrito no fim de cada barra.
  - `LegendaSequencial` (props: `menos`, `mais`)
  - `MapaDeCalorPorRegiao` (props: `regioes`, `colunas`, `linhas`, `destaque`, `rotulo`, `formatar`, `rotulos`, `className`): Mapa de calor esquemático: cada região é um bloco numa grade, na posição aproximada (não é mapa em escala). As posições vêm por props; nada de dados geográficos é buscado. O nome fica escrito acima de cada bloco, fora da cor;
  - `GraficoDeHalteres` (props: `itens`, `series`, `maximo`, `rotulo`, `formatar`, `formatarDiferenca`, `className`): Halteres: para cada item, um ponto para cada medida ligados por uma linha; os valores ficam escritos nos pontos.
  - `GraficoDeLinhas` (props: `series`, `rotulosX`, `area`, `altura`, `zero`, `rotulo`, `formatar`, `className`): Linhas finas com o nome e o último valor escritos no fim de cada linha; passe o cursor para ler cada ponto. Cores: com uma série em `destaque`, ela fica no tom 1 e as outras no contexto (do tom 6 em diante);
  - `GraficoDeInclinacao` (props: `itens`, `periodos`, `destaques`, `altura`, `rotulo`, `formatar`, `className`): Duas colunas (antes e agora) ligadas por linhas: o destaque no tom 1 (um 2º no tom 2), o restante no cinza de contexto.
  - `Mosaico` (props: `itens`, `altura`, `rotulo`, `localidade`, `className`): Mosaico (treemap): a área de cada bloco é a fatia do total. Tons por importância, do maior bloco (tom 1) ao menor; "Outros" em cinza de contexto.
  - `BarrasEmpilhadas100` (props: `categorias`, `linhas`, `minimoParaRotulo`, `rotulo`, `localidade`, `className`): Barras 100%: cada linha soma 100%; o percentual de cada parte fica escrito logo acima dela. Categorias em ordem de importância.
  - `GraficoDeBolhas` (props: `itens`, `eixoX`, `eixoY`, `rotuloTamanho`, `formatarTamanho`, `altura`, `rotulo`, `className`): Bolhas: posição em dois eixos e tamanho como terceira medida. O destaque no tom 1; o restante no cinza de contexto.
  - `MapaDeCalorMatricial` (props: `linhas`, `colunas`, `valores`, `rotuloLinhas`, `destaque`, `rotulo`, `formatar`, `rotulos`, `className`): Matriz com a cor de cada célula pela escala sequencial. É uma tabela de verdade: as células não mostram o número (ele fica para leitores de tela, na dica ao passar o cursor e em Ver dados);
  - `GraficoDeRanking` (props: `series`, `periodos`, `rotulo`, `formatarPosicao`): Bump chart: como a posição de cada item muda ao longo dos períodos. O destaque no tom 1 (um 2º no tom 2), o restante no cinza de contexto.
  - `Funil` (props: `etapas`, `destacarMaiorPerda`, `rotulo`, `formatar`, `localidade`, `rotulos`, `className`): Funil: etapas da jornada com o valor escrito e, entre elas, quanto seguiu para a próxima. A maior perda fica marcada: a etapa logo depois dela é o ponto de atenção (tom 1) e as outras ficam no cinza de contexto. Sem a marca, todas no tom 1.
- **Funções e constantes:** `CORES_GRAFICO`, `COR_NEUTRA`, `corDoTom`, `coresPorImportancia`, `coresDasSeries`, `coresDeFoco`, `coresDeContexto`, `COR_GRADE`, `TRACO_DA_GRADE`, `LINHA_DA_AREA`, `useIdDoSvg`, `curvaMonotona`, `ESCALA_SEQUENCIAL`, `formatarNumero`, `formatarPercentual`, `soma`, `useLargura`, `marcasDoEixo`, `afastar`, `larguraTexto`, `fmtPadrao`, `arco`, `faixa`, `TOM_NEUTRO`, `TONS_DA_ESCALA`, `TOTAL_DE_TONS`
- **Onde ver:** Gráficos › Design de inteligência (`graficos#graficos-inteligencia`) · Gráficos › (`graficos#graficos-catalogo-relacoes`) · Gráficos › Cores dos gráficos (`graficos#graficos-cores`) · e mais 8 seções (ver `catalogo.json`)

### graficos-paleta

- **Arquivo:** [src/app/components/ui/graficos-paleta.ts](src/app/components/ui/graficos-paleta.ts)
- **Quando usar:** Paleta dos gráficos deste design system (Dani Moscatelli): quantos tons existem e como os componentes os escolhem. É o único arquivo de gráficos que muda entre os design systems: graficos-inteligencia.tsx e graficos-catalogo.tsx são iguais nos dois e leem daqui. As cores ficam no theme.css (--chart-1 a --chart-7, --chart-neutral, --chart-seq-*).
- **Funções e constantes:** `TOTAL_DE_TONS`, `TOM_NEUTRO`, `tonsPorImportancia`, `tomDosOutros`, `tonsDeContexto`, `TONS_DA_ESCALA`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### heading

- **Arquivo:** [src/app/components/ui/heading.tsx](src/app/components/ui/heading.tsx)
- **Quando usar:** Heading com destaque: Padrão do hero do site do estúdio: Plus Jakarta Sans 700, tracking apertado, entrelinha 1,1 e a expressão-chave na cor primária (`.destaque`). Escreva o destaque entre dois asteriscos: <Heading level={1}>Transforme a experiência das pessoas em **ativo estratégico** para o seu negócio.</Heading> Regras: um destaque por título, de uma a três palavras, nunca o título inteiro.
- **Componentes:**
  - `Heading` (props: `level`, `size`, `tone`, `className`, `children`)
  - `Destaque` (props: `children`, `className`): Só o destaque, para usar dentro de um título já existente.
- **Funções e constantes:** `withHighlight`
- **Onde ver:** Fundamentos › Tipografia (`colors#typography`) · Primeiros passos (`get-started`, fora das seções) · Princípios de design (`principles`, fora das seções) · e mais 6 seções (ver `catalogo.json`)

### hover-card

- **Arquivo:** [src/app/components/ui/hover-card.tsx](src/app/components/ui/hover-card.tsx)
- **Quando usar:** Card de prévia que abre ao passar o mouse num link.
- **Componentes:**
  - `HoverCard`
  - `HoverCardTrigger`
  - `HoverCardContent` (props: `className`, `align`, `sideOffset`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### icones-preservados

- **Arquivo:** [src/app/components/ui/icones-preservados.tsx](src/app/components/ui/icones-preservados.tsx)
- **Quando usar:** Ícones de marcas guardados como arquivo (por exemplo redes sociais).
- **Funções e constantes:** `Chrome`, `Codepen`, `Codesandbox`, `Dribbble`, `Facebook`, `Figma`, `Framer`, `Github`, `Gitlab`, `Instagram`, `Linkedin`, `Pocket`, `RailSymbol`, `Slack`, `Trello`, `Twitch`, `Twitter`, `Youtube`, `nomesIconesPreservados`
- **Onde ver:** Integração (`integration`, fora das seções)

### input

- **Arquivo:** [src/app/components/ui/input.tsx](src/app/components/ui/input.tsx)
- **Quando usar:** Campo de texto: 40 px, borda visível e anel de foco.
- **Componentes:**
  - `Input` (props: `className`, `type`)
- **Onde ver:** Botões › Controles de formulário (`buttons#inputs`) · Catálogo de componentes › Todos os componentes (`catalogo#catalogo-lista`) · Overlays (`overlays`, fora das seções)

### input-otp

- **Arquivo:** [src/app/components/ui/input-otp.tsx](src/app/components/ui/input-otp.tsx)
- **Quando usar:** Campo de código de verificação, uma caixa por dígito.
- **Componentes:**
  - `InputOTP` (props: `className`, `containerClassName`)
  - `InputOTPGroup` (props: `className`)
  - `InputOTPSlot` (props: `index`, `className`)
  - `InputOTPSeparator`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### label

- **Arquivo:** [src/app/components/ui/label.tsx](src/app/components/ui/label.tsx)
- **Quando usar:** Rótulo de campo, ligado ao campo.
- **Componentes:**
  - `Label` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### lucide-catalogo

- **Arquivo:** [src/app/components/ui/lucide-catalogo.ts](src/app/components/ui/lucide-catalogo.ts)
- **Quando usar:** Catálogo da biblioteca Lucide (lucide-react 1.70.0): 2029 ícones nas categorias oficiais da Lucide (lucide.dev). Cada ícone aparece na sua primeira categoria. Gerado a partir de lucide.dev/api/categories.
- **Funções e constantes:** `versaoLucide`, `categoriasLucide`
- **Onde ver:** Ícones › Biblioteca (`icons#icon-library`)

### menubar

- **Arquivo:** [src/app/components/ui/menubar.tsx](src/app/components/ui/menubar.tsx)
- **Quando usar:** Barra de menus horizontal, como em programas de computador.
- **Componentes:**
  - `Menubar` (props: `className`)
  - `MenubarMenu`
  - `MenubarGroup`
  - `MenubarPortal`
  - `MenubarRadioGroup`
  - `MenubarTrigger` (props: `className`)
  - `MenubarContent` (props: `className`, `align`, `alignOffset`, `sideOffset`)
  - `MenubarItem` (props: `className`, `inset`, `variant`)
  - `MenubarCheckboxItem` (props: `className`, `children`, `checked`)
  - `MenubarRadioItem` (props: `className`, `children`)
  - `MenubarLabel` (props: `className`, `inset`)
  - `MenubarSeparator` (props: `className`)
  - `MenubarShortcut` (props: `className`)
  - `MenubarSub`
  - `MenubarSubTrigger` (props: `className`, `inset`, `children`)
  - `MenubarSubContent` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### navigation-menu

- **Arquivo:** [src/app/components/ui/navigation-menu.tsx](src/app/components/ui/navigation-menu.tsx)
- **Quando usar:** Navegação de site com submenus.
- **Componentes:**
  - `NavigationMenu` (props: `className`, `children`, `viewport`)
  - `NavigationMenuList` (props: `className`)
  - `NavigationMenuItem` (props: `className`)
  - `NavigationMenuTrigger` (props: `className`, `children`)
  - `NavigationMenuContent` (props: `className`)
  - `NavigationMenuViewport` (props: `className`)
  - `NavigationMenuLink` (props: `className`)
  - `NavigationMenuIndicator` (props: `className`)
- **Funções e constantes:** `navigationMenuTriggerStyle`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### pagination

- **Arquivo:** [src/app/components/ui/pagination.tsx](src/app/components/ui/pagination.tsx)
- **Quando usar:** Navegação entre páginas, com a ativa na cor primária.
- **Componentes:**
  - `Pagination` (props: `className`)
  - `PaginationContent` (props: `className`)
  - `PaginationItem`
  - `PaginationLink` (props: `className`, `isActive`, `size`)
  - `PaginationPrevious` (props: `className`)
  - `PaginationNext` (props: `className`)
  - `PaginationEllipsis` (props: `className`)
- **Onde ver:** Overlays › Paginação (`overlays#pagination`)

### partner-card

- **Arquivo:** [src/app/components/ui/partner-card.tsx](src/app/components/ui/partner-card.tsx)
- **Quando usar:** PartnerCard (card de convite ao parceiro): Card que convida ao cadastro: selo, título com destaque, texto curto, ação principal e link secundário opcional. Vertical ou horizontal; tamanhos p, m e g. Fundo de card com um brilho suave na cor primária no canto, como o hero do site.
- **Componentes:**
  - `PartnerCard` (props: `orientation`, `size`, `eyebrow`, `title`, `description`, `cta`, `secondary`, `visual`, `surface`, `className`)
- **Onde ver:** Cards › Arquitetura de informação (`cards#card-ia`) · Cards › Card de convite ao parceiro (`cards#card-partner`)

### password-field

- **Arquivo:** [src/app/components/ui/password-field.tsx](src/app/components/ui/password-field.tsx)
- **Quando usar:** Campo de senha com confirmação (PasswordField / PasswordConfirm): - Exibir/ocultar senha em cada campo (botão com aria-pressed e rótulo). - Força da senha em 4 barras + rótulo em texto (Fraca, Razoável, Boa, Forte), calculada pelos requisitos atendidos. - Dica de preenchimento: cada requisito ganha um check na cor primária da marca quando atendido;
- **Componentes:**
  - `PasswordInput` (props: `label`, `value`, `onValueChange`, `textos`, `invalido`, `describedBy`, `id`, `className`): Um campo de senha com o botão de exibir/ocultar.
  - `PasswordConfirm` (props: `senha`, `confirmacao`, `onSenhaChange`, `onConfirmacaoChange`, `regras`, `textos`, `semConfirmacao`, `disabled`, `className`): Senha + confirmação, com força da senha, dicas com check e verificação de coincidência.
- **Funções e constantes:** `regrasPadrao`, `textosPadrao`, `forcaDaSenha`
- **Onde ver:** Botões › Senha (`buttons#password`)

### popover

- **Arquivo:** [src/app/components/ui/popover.tsx](src/app/components/ui/popover.tsx)
- **Quando usar:** Painel flutuante preso a um botão.
- **Componentes:**
  - `Popover`
  - `PopoverTrigger`
  - `PopoverContent` (props: `className`, `align`, `sideOffset`)
  - `PopoverAnchor`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### progress

- **Arquivo:** [src/app/components/ui/progress.tsx](src/app/components/ui/progress.tsx)
- **Quando usar:** Barra de progresso.
- **Componentes:**
  - `Progress` (props: `className`, `value`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### radio-group

- **Arquivo:** [src/app/components/ui/radio-group.tsx](src/app/components/ui/radio-group.tsx)
- **Quando usar:** Escolha única entre poucas opções.
- **Componentes:**
  - `RadioGroup` (props: `className`)
  - `RadioGroupItem` (props: `className`)
- **Onde ver:** Botões › Senha (`buttons#password`)

### resizable

- **Arquivo:** [src/app/components/ui/resizable.tsx](src/app/components/ui/resizable.tsx)
- **Quando usar:** Painéis com alça para redimensionar.
- **Componentes:**
  - `ResizablePanelGroup` (props: `className`)
  - `ResizablePanel`
  - `ResizableHandle` (props: `withHandle`, `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### rodape-site

- **Arquivo:** [src/app/components/ui/rodape-site.tsx](src/app/components/ui/rodape-site.tsx)
- **Quando usar:** RodapeSite (rodapé do site): Rodapé compartilhado do site do estúdio (src/compartilhado/partes.ts): logo + links de navegação em cima, copyright, cidade e crédito do design system embaixo. Três variantes, como no código do site:
- **Componentes:**
  - `RodapeSite` (props: `variante`, `logo`, `rotuloLogo`, `inicioHref`, `links`, `privacidade`, `rotuloPreferencias`, `onPreferenciasCookies`, `areaRestrita`, `copyright`, `cidade`, `credito`, `rotuloNav`, `novaAba`, `espacoFlutuante`, `className`)
- **Onde ver:** Padrões do site › Rodapé (`site#site-rodape`)

### scroll-area

- **Arquivo:** [src/app/components/ui/scroll-area.tsx](src/app/components/ui/scroll-area.tsx)
- **Quando usar:** Área com barra de rolagem estilizada.
- **Componentes:**
  - `ScrollArea` (props: `className`, `children`)
  - `ScrollBar` (props: `className`, `orientation`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### segmented-control

- **Arquivo:** [src/app/components/ui/segmented-control.tsx](src/app/components/ui/segmented-control.tsx)
- **Quando usar:** SegmentedControl (controle segmentado): Opções acopladas, uma selecionada por vez, que se tocam como botões. Use para escolhas curtas e exclusivas (2 a 5 opções, rótulos de uma ou duas palavras): filtro, condição, período, modo de exibição. Sempre há uma opção selecionada. Teclado: setas movem a seleção; Tab entra e sai do grupo.
- **Componentes:**
  - `SegmentedControl` (props: `options`, `value`, `defaultValue`, `onValueChange`, `variant`, `size`, `fullWidth`, `className`)
- **Onde ver:** Botões › Controle segmentado (`buttons#segmented`) · Padrões do site › Entrada ao rolar (`site#site-entrada`) · Linha do tempo › Demonstração (`timeline#timeline-demo`) · e mais 1 seções (ver `catalogo.json`)

### select

- **Arquivo:** [src/app/components/ui/select.tsx](src/app/components/ui/select.tsx)
- **Quando usar:** Lista de seleção em campo de 40 px.
- **Componentes:**
  - `Select`
  - `SelectGroup`
  - `SelectValue`
  - `SelectTrigger` (props: `className`, `size`, `children`)
  - `SelectContent` (props: `className`, `children`, `position`)
  - `SelectLabel` (props: `className`)
  - `SelectItem` (props: `className`, `children`)
  - `SelectSeparator` (props: `className`)
  - `SelectScrollUpButton` (props: `className`)
  - `SelectScrollDownButton` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### selo

- **Arquivo:** [src/app/components/ui/selo.tsx](src/app/components/ui/selo.tsx)
- **Quando usar:** Selo (tag do hero): Padrão da página Experience Intelligence do site do estúdio (`.selo`): pílula com fundo de card, borda fina, texto em caixa alta pequena com espaçamento largo e um ponto na cor primária. Serve para situar a pessoa no topo de uma página ou seção (nome do produto, contexto, local), nunca para status ou contagem.
- **Componentes:**
  - `Selo` (props: `className`, `dot`, `icon`, `tone`, `size`, `children`)
- **Onde ver:** Rótulos › Selo (tag do hero) (`badges#selo`) · Rótulos › Selo de seção (`badges#selo-secao`)

### selo-secao

- **Arquivo:** [src/app/components/ui/selo-secao.tsx](src/app/components/ui/selo-secao.tsx)
- **Quando usar:** SeloSecao (selo de seção): Padrão das seções da página Experience Intelligence 2 do site do estúdio ("Cenário Atual", "O Desafio", "Método"…): pílula preenchida com o tom claro da primária, borda fina na primária, texto na cor primária de texto, em caixa alta com espaçamento largo (0,2em), sem ponto. Fica centralizada acima do título da seção.
- **Componentes:**
  - `SeloSecao` (props: `className`, `icon`, `size`, `children`)
- **Onde ver:** Rótulos › Selo de seção (`badges#selo-secao`) · Padrões do site › Divisores curvos (`site#site-curvas`) · Padrões do site › Entrada ao rolar (`site#site-entrada`)

### separator

- **Arquivo:** [src/app/components/ui/separator.tsx](src/app/components/ui/separator.tsx)
- **Quando usar:** Linha divisória horizontal ou vertical.
- **Componentes:**
  - `Separator` (props: `className`, `orientation`, `decorative`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### sheet

- **Arquivo:** [src/app/components/ui/sheet.tsx](src/app/components/ui/sheet.tsx)
- **Quando usar:** Painel lateral sobre o conteúdo; prende o foco e fecha com Esc.
- **Componentes:**
  - `Sheet`
  - `SheetTrigger`
  - `SheetClose`
  - `SheetContent` (props: `className`, `children`, `side`)
  - `SheetHeader` (props: `className`)
  - `SheetFooter` (props: `className`)
  - `SheetTitle` (props: `className`)
  - `SheetDescription` (props: `className`)
- **Onde ver:** Overlays (`overlays`, fora das seções)

### shine-border

- **Arquivo:** [src/app/components/ui/shine-border.tsx](src/app/components/ui/shine-border.tsx)
- **Quando usar:** Combinações de cores prontas, só com tokens do design system. O dourado é o token `--warning` (âmbar), que fica mais vivo no tema escuro.
- **Componentes:**
  - `ShineBorder` (props: `borderWidth`, `duration`, `shineColor`, `preset`, `className`, `style`)
- **Funções e constantes:** `shinePresets`
- **Onde ver:** Cards › Shine Border (`cards#card-shine`)

### side-panel

- **Arquivo:** [src/app/components/ui/side-panel.tsx](src/app/components/ui/side-panel.tsx)
- **Quando usar:** SidePanel (painel lateral / gaveta): Padrão do formulário de contato do site do estúdio, generalizado: - abre pela direita; largura total no celular, 500 px no tablet e 540 px no desktop; - fundo escurecido com desfoque; cantos arredondados à esquerda a partir do tablet; - três zonas: cabeçalho fixo, corpo rolável e barra de ação fixa (mais um rodapé opcional); - fecha por Esc, clique fora ou botão;
- **Componentes:**
  - `SidePanel`
  - `SidePanelTrigger`
  - `SidePanelClose`
  - `SidePanelContent` (props: `className`, `children`, `width`, `side`, `closeLabel`): Contêiner do painel: overlay + caixa deslizante com as três zonas em `children`.
  - `SidePanelHeader` (props: `eyebrow`, `title`, `description`, `className`): Cabeçalho fixo: rótulo pequeno (eyebrow), título e texto de apoio.
  - `SidePanelBody` (props: `className`): Corpo rolável.
  - `SidePanelActions` (props: `className`): Barra de ação fixa na base (botão principal).
  - `SidePanelFooter` (props: `className`): Rodapé discreto abaixo da barra de ação (nota de segurança, assinatura).
- **Onde ver:** Painel lateral › Comportamento (`sidepanel#sidepanel-behavior`) · Painel lateral › Formulário de contato (`sidepanel#sidepanel-contact`)

### sidebar

- **Arquivo:** [src/app/components/ui/sidebar.tsx](src/app/components/ui/sidebar.tsx)
- **Quando usar:** Navegação lateral recolhível para aplicativos.
- **Componentes:**
  - `SidebarProvider` (props: `defaultOpen`, `open`, `onOpenChange`, `className`, `style`, `children`)
  - `Sidebar` (props: `side`, `variant`, `collapsible`, `className`, `children`)
  - `SidebarTrigger` (props: `className`, `onClick`)
  - `SidebarRail` (props: `className`)
  - `SidebarInset` (props: `className`)
  - `SidebarInput` (props: `className`)
  - `SidebarHeader` (props: `className`)
  - `SidebarFooter` (props: `className`)
  - `SidebarSeparator` (props: `className`)
  - `SidebarContent` (props: `className`)
  - `SidebarGroup` (props: `className`)
  - `SidebarGroupLabel` (props: `className`, `asChild`)
  - `SidebarGroupAction` (props: `className`, `asChild`)
  - `SidebarGroupContent` (props: `className`)
  - `SidebarMenu` (props: `className`)
  - `SidebarMenuItem` (props: `className`)
  - `SidebarMenuButton` (props: `asChild`, `isActive`, `variant`, `size`, `tooltip`, `className`)
  - `SidebarMenuAction` (props: `className`, `asChild`, `showOnHover`)
  - `SidebarMenuBadge` (props: `className`)
  - `SidebarMenuSkeleton` (props: `className`, `showIcon`)
  - `SidebarMenuSub` (props: `className`)
  - `SidebarMenuSubItem` (props: `className`)
  - `SidebarMenuSubButton` (props: `asChild`, `size`, `isActive`, `className`)
- **Funções e constantes:** `useSidebar`
- **Variantes:** `variant` = `default` · `outline`; `size` = `default` · `sm` · `lg`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### skeleton

- **Arquivo:** [src/app/components/ui/skeleton.tsx](src/app/components/ui/skeleton.tsx)
- **Quando usar:** Espaço de carregamento no formato do conteúdo.
- **Componentes:**
  - `Skeleton` (props: `className`)
- **Onde ver:** Cards › Estados (`cards#card-states`)

### slider

- **Arquivo:** [src/app/components/ui/slider.tsx](src/app/components/ui/slider.tsx)
- **Quando usar:** Controle deslizante para escolher um valor ou intervalo.
- **Componentes:**
  - `Slider` (props: `className`, `defaultValue`, `value`, `min`, `max`)
- **Onde ver:** Cards › Testar o vidro (`cards#card-glass-teste`)

### sonner

- **Arquivo:** [src/app/components/ui/sonner.tsx](src/app/components/ui/sonner.tsx)
- **Quando usar:** Tema atual: segue a classe .dark do documento (sem depender de next-themes).
- **Componentes:**
  - `Toaster`: Notificações temporárias (toast). Monte <Toaster /> uma vez na raiz do app e chame toast(), toast.success(), toast.error(), toast.warning(), toast.info() ou toast.loading() de "sonner". Ícone e texto sempre juntos.
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### surgir-ao-rolar

- **Arquivo:** [src/app/components/ui/surgir-ao-rolar.tsx](src/app/components/ui/surgir-ao-rolar.tsx)
- **Quando usar:** SurgirAoRolar e TituloQueSurge (entrada ao rolar): Os blocos entram quando chegam na tela, como no site do estúdio. Dois efeitos, os dois do site:
- **Componentes:**
  - `SurgirAoRolar` (props: `as`, `efeito`, `escalonar`, `passo`, `atraso`, `raiz`, `limiar`, `margem`, `repetir`, `duracao`, `className`, `style`, `children`)
  - `TituloQueSurge` (props: `as`, `children`, `passo`, `atraso`, `destaque`, `raiz`, `limiar`, `margem`, `repetir`, `duracao`, `className`, `style`)
- **Funções e constantes:** `useSurgirAoRolar`
- **Onde ver:** Padrões do site › Entrada ao rolar (`site#site-entrada`)

### switch

- **Arquivo:** [src/app/components/ui/switch.tsx](src/app/components/ui/switch.tsx)
- **Quando usar:** Chave liga/desliga com efeito imediato.
- **Componentes:**
  - `Switch` (props: `className`)
- **Onde ver:** Botões › Controle segmentado (`buttons#segmented`)

### table

- **Arquivo:** [src/app/components/ui/table.tsx](src/app/components/ui/table.tsx)
- **Quando usar:** Tabela de dados com cabeçalho e linhas.
- **Componentes:**
  - `Table` (props: `className`)
  - `TableHeader` (props: `className`)
  - `TableBody` (props: `className`)
  - `TableFooter` (props: `className`)
  - `TableRow` (props: `className`)
  - `TableHead` (props: `className`)
  - `TableCell` (props: `className`)
  - `TableCaption` (props: `className`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### tabs

- **Arquivo:** [src/app/components/ui/tabs.tsx](src/app/components/ui/tabs.tsx)
- **Quando usar:** Abas que trocam o conteúdo no mesmo lugar.
- **Componentes:**
  - `Tabs` (props: `className`)
  - `TabsList` (props: `className`)
  - `TabsTrigger` (props: `className`)
  - `TabsContent` (props: `className`)
- **Onde ver:** Feedback › Abas (`feedback#tabs`)

### textarea

- **Arquivo:** [src/app/components/ui/textarea.tsx](src/app/components/ui/textarea.tsx)
- **Quando usar:** Campo de texto com várias linhas.
- **Componentes:**
  - `Textarea` (props: `className`)
- **Onde ver:** Overlays (`overlays`, fora das seções)

### timeline

- **Arquivo:** [src/app/components/ui/timeline.tsx](src/app/components/ui/timeline.tsx)
- **Quando usar:** Timeline (linha do tempo) — portada da seção "Como funciona" do site do estúdio.
- **Componentes:**
  - `Timeline` (props: `etapas`, `alternar`, `limite`, `checkNasFeitas`, `animar`, `className`)
- **Onde ver:** Linha do tempo › Demonstração (`timeline#timeline-demo`) · Linha do tempo › Uso (`timeline#timeline-usage`)

### toggle

- **Arquivo:** [src/app/components/ui/toggle.tsx](src/app/components/ui/toggle.tsx)
- **Quando usar:** Botão que fica pressionado (liga/desliga).
- **Componentes:**
  - `Toggle` (props: `className`, `variant`, `size`)
- **Funções e constantes:** `toggleVariants`
- **Variantes:** `variant` = `default` · `outline`; `size` = `default` · `sm` · `lg`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### toggle-group

- **Arquivo:** [src/app/components/ui/toggle-group.tsx](src/app/components/ui/toggle-group.tsx)
- **Quando usar:** Grupo de botões que ligam e desligam.
- **Componentes:**
  - `ToggleGroup` (props: `className`, `variant`, `size`, `children`)
  - `ToggleGroupItem` (props: `className`, `children`, `variant`, `size`)
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### tooltip

- **Arquivo:** [src/app/components/ui/tooltip.tsx](src/app/components/ui/tooltip.tsx)
- **Quando usar:** Dica curta ao passar o mouse ou focar.
- **Componentes:**
  - `TooltipProvider` (props: `delayDuration`)
  - `Tooltip`
  - `TooltipTrigger`
  - `TooltipContent` (props: `className`, `sideOffset`, `children`)
- **Onde ver:** Overlays › Tooltips (`overlays#tooltips`)

### upload

- **Arquivo:** [src/app/components/ui/upload.tsx](src/app/components/ui/upload.tsx)
- **Quando usar:** Upload Área de arrastar e soltar, lista de arquivos com progresso e estados, imagem única com prévia e galeria de imagens. Os componentes não enviam nada: recebem arquivos, validam e expõem callbacks. O envio é responsabilidade do produto.
- **Componentes:**
  - `UploadTextsProvider` (props: `textos`, `children`)
  - `UploadDropzone` (props: `onFiles`, `accept`, `maxSize`, `maxFiles`, `multiple`, `disabled`, `capture`, `title`, `description`, `actionLabel`, `error`, `onError`, `size`, `className`, `icon`)
  - `UploadItem` (props: `item`, `onRemove`, `onRetry`, `className`): Item e lista
  - `UploadList` (props: `items`, `onRemove`, `onRetry`, `className`)
  - `ImageUpload` (props: `value`, `onChange`, `shape`, `size`, `label`, `accept`, `maxSize`, `onError`, `className`, `capture`): Imagem única com prévia
  - `ImageGrid` (props: `images`, `onAdd`, `onRemove`, `onSetCover`, `coverId`, `max`, `accept`, `maxSize`, `onError`, `className`, `addLabel`)
- **Funções e constantes:** `uploadTextosPt`, `uploadTextosEn`, `useUploadTexts`, `formatBytes`, `fileKind`, `validateFiles`
- **Onde ver:** Upload › Área de soltar (`upload#upload-dropzone`) · Upload › Lista de arquivos (`upload#upload-list`) · Upload › Imagem única (`upload#upload-image`) · e mais 3 seções (ver `catalogo.json`)

### use-mobile

- **Arquivo:** [src/app/components/ui/use-mobile.ts](src/app/components/ui/use-mobile.ts)
- **Quando usar:** Hook que diz se a tela tem tamanho de celular.
- **Funções e constantes:** `useIsMobile`
- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).

### utils

- **Arquivo:** [src/app/components/ui/utils.ts](src/app/components/ui/utils.ts)
- **Quando usar:** Função cn() para combinar classes.
- **Funções e constantes:** `cn`
- **Onde ver:** Grid e espaçamento › Grid de colunas (`grid#grid-colunas`) · Grid e espaçamento › Ritmo vertical (`grid#grid-ritmo`) · Cards › Borda, sombra e raio (`cards#card-layout`) · e mais 6 seções (ver `catalogo.json`)

## 2. Padrões ainda só em demonstração (não importáveis)

Templates e padrões que existem **só dentro das páginas de demonstração** (`src/app/components/showcase/`) e não são exportados de `ui/`. **Use exatamente este visual; se precisar no produto, peça para promover a componente.** Esta lista é o backlog de promoção a componente (seguindo o processo de `propostas/README.md`).

Como a lista é feita: componentes locais das páginas de demonstração (`function X(` ou `const X = (...) =>` que devolvem JSX) com elementos de estilo visual feito à mão (borda, fundo, raio ou sombra no `className`), mais todos os templates. Ficam de fora as peças da própria documentação (títulos, rótulos, molduras e tabelas de especificação: `Bullets`, `Callout`, `CardGrid`, `CodeBlock`, `ConteudoFalso`, `CopyBtn`, `CopyLinkButton`, `CustomTooltip`, `DataTable`, `DoDont`, `DownloadButton`, `Linhas`, `Moldura`, `MolduraCelular`, `Mono`, `NavCard`, `PageHeader`, `PageSection`, `PaginaFalsa`, `Panel`, `Parte`, `Pill`, `RegraDasLinhas`, `Rotulo`, `RotuloVariante`, `SectionBlock`, `SectionHeader`, `SectionLabel`, `ShowcaseCard`, `SpecCard`, `StepBadge`, `SubSection`, `SubTitle`, `Swatch`, `TemplateFrame`, `TemplateLabel`, `TextLink`, `Token`, `TokenRowItem`, `TokenTable`, `VejaEm`) e os componentes que só montam componentes do DS sem estilo próprio. "Marcação à mão" é o número de elementos com estilo visual próprio.

### 2.1 Templates (8)

Telas inteiras montadas nas páginas de demonstração. Para uma tela parecida no produto, parta do template (mesma estrutura e as mesmas peças).

| Padrão | Onde ver | Arquivo | Usa do DS | Marcação à mão |
|---|---|---|---|---|
| `DashboardTemplate` | Templates › Dashboard (`templates#template-dashboard`) | [src/app/components/showcase/TemplatesShowcase.tsx:94](src/app/components/showcase/TemplatesShowcase.tsx#L94) |  | 13 |
| `SettingsTemplate`<br>2. Settings Template | Templates › Configurações (`templates#template-settings`) | [src/app/components/showcase/TemplatesShowcase.tsx:241](src/app/components/showcase/TemplatesShowcase.tsx#L241) |  | 14 |
| `AuthTemplate`<br>3. Login / Auth Template | Templates › Autenticação (`templates#template-auth`) | [src/app/components/showcase/TemplatesShowcase.tsx:436](src/app/components/showcase/TemplatesShowcase.tsx#L436) |  | 10 |
| `TeamTemplate` | Templates › Equipe (`templates#template-team`) | [src/app/components/showcase/TemplatesShowcase.tsx:584](src/app/components/showcase/TemplatesShowcase.tsx#L584) |  | 14 |
| `InboxTemplate` | Templates › Caixa de entrada (`templates#template-inbox`) | [src/app/components/showcase/TemplatesShowcase.tsx:720](src/app/components/showcase/TemplatesShowcase.tsx#L720) |  | 11 |
| `PricingTemplate` | Templates › Preços (`templates#template-pricing`) | [src/app/components/showcase/TemplatesShowcase.tsx:904](src/app/components/showcase/TemplatesShowcase.tsx#L904) |  | 10 |
| `ContactTemplate` | Templates › Contato (`templates#template-contact`) | [src/app/components/showcase/TemplatesShowcase.tsx:1089](src/app/components/showcase/TemplatesShowcase.tsx#L1089) |  | 14 |
| `LandingTemplate` | Templates › Landing page (`templates#template-landing`) | [src/app/components/showcase/TemplatesShowcase.tsx:1490](src/app/components/showcase/TemplatesShowcase.tsx#L1490) |  | 82 |

### 2.2 Padrões nas páginas de componentes (28)

Peças de interface (cards, painéis, menus, controles) desenhadas à mão dentro das páginas de componentes. São as primeiras candidatas a virar componente.

| Padrão | Onde ver | Arquivo | Usa do DS | Marcação à mão |
|---|---|---|---|---|
| `ChaveParaQuem`<br>Controle só da demonstração: liga e desliga o bloco opcional "Para quem" nos cards de preço | Templates › Preços (`templates#template-pricing`) | [src/app/components/showcase/TemplatesShowcase.tsx:874](src/app/components/showcase/TemplatesShowcase.tsx#L874) |  | 2 |
| `InputField` | Botões › Controles de formulário (`buttons#inputs`) | [src/app/components/showcase/FormShowcase.tsx:65](src/app/components/showcase/FormShowcase.tsx#L65) | `Input` | 1 |
| `CanvasRevealCard`<br>Cards com revelação em canvas (usado na página Cards › Animação). | Cards › Animação (`cards#card-animacao`) | [src/app/components/showcase/BackgroundsShowcase.tsx:498](src/app/components/showcase/BackgroundsShowcase.tsx#L498) |  | 9 |
| `CenaDoVidro`<br>Cena do seletor: usa o fundo escolhido; fora do seletor, é a cena padrão (GlassScene). | Cards › Vidro: acabamentos (`cards#card-glass`) (+3) | [src/app/components/showcase/CardShowcase.tsx:106](src/app/components/showcase/CardShowcase.tsx#L106) | `DoodleTexture`, `GlassScene` | 2 |
| `GlassTestCard`<br>Card de teste: título e subtítulo reais sobre o vidro, com avaliação de contraste (WCAG AA) e alerta dentro do card quando a configuração compromete a acessibilidade. | Cards › Vidro: acabamentos (`cards#card-glass`) (+2) | [src/app/components/showcase/CardShowcase.tsx:168](src/app/components/showcase/CardShowcase.tsx#L168) | `GlassCard` | 1 |
| `GlassFinishPicker` | Cards › Testar o vidro (`cards#card-glass-teste`) | [src/app/components/showcase/CardShowcase.tsx:206](src/app/components/showcase/CardShowcase.tsx#L206) | `DoodleTexture`, `GlassCard`, `GlassScene`, `SegmentedControl`, `Slider` | 3 |
| `CardPorFundo` | Cards › Por fundo (`cards#card-fundos`) | [src/app/components/showcase/CardShowcase.tsx:326](src/app/components/showcase/CardShowcase.tsx#L326) | `Button`, `Card` | 2 |
| `CardsDeKpi`<br>Cards de KPI: métrica, ícone, minigráfico e tendência (usados na página Cards). | Cards › Arquitetura de informação (`cards#card-ia`) | [src/app/components/showcase/DataShowcase.tsx:428](src/app/components/showcase/DataShowcase.tsx#L428) |  | 2 |
| `WobbleCardConteudo`<br>Card com wobble: demonstração com controles (usada na página Cards). | Cards › Animação (`cards#card-animacao`) | [src/app/components/showcase/MotionShowcase.tsx:1925](src/app/components/showcase/MotionShowcase.tsx#L1925) |  | 5 |
| `ShineBorderConteudo`<br>Shine Border: velocidades, combinações de cor, tokens e acessibilidade (usado na página Cards). | Cards › Shine Border (`cards#card-shine`) | [src/app/components/showcase/MotionShowcase.tsx:2029](src/app/components/showcase/MotionShowcase.tsx#L2029) | `ShineBorder` | 5 |
| `RoscaAntiga`<br>Earlier donut, reproduced only for comparison (thick ring, number of parts in the centre, graphite as a peer series). | Gráficos › Rosca (`graficos#graficos-rosca`) | [src/app/components/showcase/GraficosShowcase.tsx:24](src/app/components/showcase/GraficosShowcase.tsx#L24) |  | 1 |
| `TabelaQueQuebra`<br>Tabela que vira lista no celular (card nunca rola na horizontal). | Gráficos › Como escolher (`graficos#graficos-escolher`) (+1) | [src/app/components/showcase/GraficosShowcase.tsx:58](src/app/components/showcase/GraficosShowcase.tsx#L58) |  | 3 |
| `Cartao` | Gráficos › Cores dos gráficos (`graficos#graficos-cores`) (+3) | [src/app/components/showcase/GraficosShowcase.tsx:79](src/app/components/showcase/GraficosShowcase.tsx#L79) |  | 1 |
| `CartaoDoCatalogo`<br>Catalog card: name, component, when to use, the chart, the reading caveat and See data. | Gráficos › (`graficos#graficos-catalogo-comparacao`) (+5) | [src/app/components/showcase/GraficosShowcase.tsx:125](src/app/components/showcase/GraficosShowcase.tsx#L125) | `TabelaDeDados` | 5 |
| `Familia` | Gráficos › (`graficos#graficos-catalogo-comparacao`) (+5) | [src/app/components/showcase/GraficosShowcase.tsx:160](src/app/components/showcase/GraficosShowcase.tsx#L160) |  | 1 |
| `DemoInfoFechavel` | Feedback › Alerta com ação (`feedback#alerta-com-acao`) | [src/app/components/showcase/AlertaComAcaoShowcase.tsx:71](src/app/components/showcase/AlertaComAcaoShowcase.tsx#L71) | `AlertaComAcao`, `BotaoDoAlerta`, `LinkDoAlerta` | 1 |
| `AlertaComAcaoDoc` | Feedback › Alerta com ação (`feedback#alerta-com-acao`) | [src/app/components/showcase/AlertaComAcaoShowcase.tsx:133](src/app/components/showcase/AlertaComAcaoShowcase.tsx#L133) | `AlertaComAcao`, `BotaoDoAlerta`, `LinkDoAlerta` | 1 |
| `Alert` | Feedback › Alertas (`feedback#alerts`) | [src/app/components/showcase/FeedbackShowcase.tsx:76](src/app/components/showcase/FeedbackShowcase.tsx#L76) | `Alert`, `AlertDescription`, `AlertTitle` | 1 |
| `SkeletonPulse`<br>Skeleton | Feedback › Skeleton (`feedback#skeleton`) | [src/app/components/showcase/FeedbackShowcase.tsx:106](src/app/components/showcase/FeedbackShowcase.tsx#L106) |  | 1 |
| `DrawerDemo`<br>Drawer | Overlays | [src/app/components/showcase/OverlaysShowcase.tsx:128](src/app/components/showcase/OverlaysShowcase.tsx#L128) | `Button`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetFooter`, `SheetHeader`, `SheetTitle` | 3 |
| `SecaoEscopo`<br>A seção "Onde podemos atuar" do Projeto Piloto, como no site, com a entrada ao rolar (subir) do site. | Padrões do site › Entrada ao rolar (`site#site-entrada`) | [src/app/components/showcase/SitePatternsShowcase.tsx:413](src/app/components/showcase/SitePatternsShowcase.tsx#L413) | `CardDeFrente`, `CurvaSecao`, `GradeDeFrentes`, `SurgirAoRolar` | 3 |
| `SecaoArtigos`<br>Cabeçalho da seção "Insights & Artigos" da Home, com o desfoque do site; os cards são blocos neutros. | Padrões do site › Entrada ao rolar (`site#site-entrada`) | [src/app/components/showcase/SitePatternsShowcase.tsx:461](src/app/components/showcase/SitePatternsShowcase.tsx#L461) | `SeloSecao`, `SurgirAoRolar`, `TituloQueSurge` | 6 |
| `Segmentado`<br>Controles da demonstração | Header e menus › Demonstração (`header#header-demo`) | [src/app/components/showcase/HeaderShowcase.tsx:91](src/app/components/showcase/HeaderShowcase.tsx#L91) |  | 1 |
| `Chave` | Header e menus › Demonstração (`header#header-demo`) | [src/app/components/showcase/HeaderShowcase.tsx:119](src/app/components/showcase/HeaderShowcase.tsx#L119) |  | 2 |
| `Capa`<br>Fundos por trás do header | Header e menus › Demonstração (`header#header-demo`) | [src/app/components/showcase/HeaderShowcase.tsx:149](src/app/components/showcase/HeaderShowcase.tsx#L149) |  | 4 |
| `DemoHeader`<br>Demonstração: janela com rolagem própria | Header e menus › Demonstração (`header#header-demo`) | [src/app/components/showcase/HeaderShowcase.tsx:173](src/app/components/showcase/HeaderShowcase.tsx#L173) |  | 39 |
| `CardOpcao`<br>Cards de explicação, com atalho para a demonstração | Header e menus › Modelos (`header#header-models`) (+3) | [src/app/components/showcase/HeaderShowcase.tsx:559](src/app/components/showcase/HeaderShowcase.tsx#L559) |  | 3 |
| `ContactPanelDemo`<br>Variante: formulário de contato do site | Painel lateral › Comportamento (`sidepanel#sidepanel-behavior`) (+1) | [src/app/components/showcase/SidePanelShowcase.tsx:38](src/app/components/showcase/SidePanelShowcase.tsx#L38) | `SidePanel`, `SidePanelActions`, `SidePanelBody`, `SidePanelContent`, `SidePanelFooter`, `SidePanelHeader`, `SidePanelTrigger` | 10 |

### 2.3 Demonstrações nas páginas de fundamentos e diretrizes (32)

Exemplos que ilustram uma regra (usabilidade, acessibilidade, movimento, marca, tokens). Normalmente não vão para o produto como estão; servem de referência de comportamento.

| Padrão | Onde ver | Arquivo | Usa do DS | Marcação à mão |
|---|---|---|---|---|
| `PrincipleCard` | Princípios de design | [src/app/components/showcase/PrinciplesShowcase.tsx:99](src/app/components/showcase/PrinciplesShowcase.tsx#L99) |  | 3 |
| `LogoCard`<br>Logo card | Identidade de marca › Logo vertical (`brand#brand-logo-vertical`) (+2) | [src/app/components/showcase/BrandShowcase.tsx:86](src/app/components/showcase/BrandShowcase.tsx#L86) |  | 3 |
| `ColorChip`<br>Color chip | Identidade de marca › Paleta da marca (`brand#brand-colors`) | [src/app/components/showcase/BrandShowcase.tsx:125](src/app/components/showcase/BrandShowcase.tsx#L125) |  | 2 |
| `RuleCard`<br>Do / Don't card | Identidade de marca › Regras de uso (`brand#brand-rules`) | [src/app/components/showcase/BrandShowcase.tsx:157](src/app/components/showcase/BrandShowcase.tsx#L157) |  | 2 |
| `DemoDoGrid`<br>Demonstração do grid: as colunas, a margem e a calha da tela escolhida, em escala dentro da página. | Grid e espaçamento › Grid de colunas (`grid#grid-colunas`) | [src/app/components/showcase/GridShowcase.tsx:30](src/app/components/showcase/GridShowcase.tsx#L30) |  | 3 |
| `Bloco`<br>Exemplo de composição sobre o grid: blocos com span por tela. | Grid e espaçamento › Como usar (`grid#grid-uso`) | [src/app/components/showcase/GridShowcase.tsx:54](src/app/components/showcase/GridShowcase.tsx#L54) |  | 1 |
| `TargetDemo`<br>Touch targets | Usabilidade › Tamanho de alvo (`usability#ux-targets`) | [src/app/components/showcase/UsabilityShowcase.tsx:14](src/app/components/showcase/UsabilityShowcase.tsx#L14) |  | 1 |
| `FeedbackDemo`<br>System status | Usabilidade › Status do sistema (`usability#ux-feedback`) | [src/app/components/showcase/UsabilityShowcase.tsx:44](src/app/components/showcase/UsabilityShowcase.tsx#L44) |  | 1 |
| `UndoDemo` | Usabilidade › Ações destrutivas (`usability#ux-destructive`) | [src/app/components/showcase/UsabilityShowcase.tsx:81](src/app/components/showcase/UsabilityShowcase.tsx#L81) |  | 6 |
| `StatesDemo` | Usabilidade › Estados de conteúdo (`usability#ux-states`) | [src/app/components/showcase/UsabilityShowcase.tsx:145](src/app/components/showcase/UsabilityShowcase.tsx#L145) |  | 6 |
| `HierarchyDemo`<br>Button hierarchy | Usabilidade › Hierarquia de ações (`usability#ux-hierarchy`) | [src/app/components/showcase/UsabilityShowcase.tsx:211](src/app/components/showcase/UsabilityShowcase.tsx#L211) |  | 5 |
| `Descoberta` | Tom de voz e UX writing | [src/app/components/showcase/EscritaDeInteligencia.tsx:31](src/app/components/showcase/EscritaDeInteligencia.tsx#L31) |  | 4 |
| `EscritaDeInteligencia` | Tom de voz e UX writing | [src/app/components/showcase/EscritaDeInteligencia.tsx:74](src/app/components/showcase/EscritaDeInteligencia.tsx#L74) |  | 8 |
| `ContrastTable` | Acessibilidade › Contraste (`accessibility#a11y-contrast`) | [src/app/components/showcase/AccessibilityShowcase.tsx:67](src/app/components/showcase/AccessibilityShowcase.tsx#L67) |  | 3 |
| `ContrastChecker` | Acessibilidade › Contraste (`accessibility#a11y-contrast`) | [src/app/components/showcase/AccessibilityShowcase.tsx:121](src/app/components/showcase/AccessibilityShowcase.tsx#L121) |  | 1 |
| `FocusDemo`<br>Focus | Acessibilidade › Foco (`accessibility#a11y-focus`) | [src/app/components/showcase/AccessibilityShowcase.tsx:184](src/app/components/showcase/AccessibilityShowcase.tsx#L184) |  | 3 |
| `TabsDemo`<br>Keyboard: roving tablist | Acessibilidade › Teclado (`accessibility#a11y-keyboard`) | [src/app/components/showcase/AccessibilityShowcase.tsx:212](src/app/components/showcase/AccessibilityShowcase.tsx#L212) |  | 2 |
| `FormDemo`<br>Forms | Acessibilidade › Formulários e rótulos (`accessibility#a11y-forms`) | [src/app/components/showcase/AccessibilityShowcase.tsx:268](src/app/components/showcase/AccessibilityShowcase.tsx#L268) |  | 1 |
| `MotionDemo`<br>Motion | Acessibilidade › Motion (`accessibility#a11y-motion`) | [src/app/components/showcase/AccessibilityShowcase.tsx:331](src/app/components/showcase/AccessibilityShowcase.tsx#L331) |  | 2 |
| `Checklist` | Acessibilidade › Checklist (`accessibility#a11y-checklist`) | [src/app/components/showcase/AccessibilityShowcase.tsx:382](src/app/components/showcase/AccessibilityShowcase.tsx#L382) |  | 2 |
| `GradientControls`<br>Inline control panel — lives inside the card, outside the preview | Fundos › Gradiente animado (`backgrounds#gradient-anim-bg`) | [src/app/components/showcase/BackgroundsShowcase.tsx:148](src/app/components/showcase/BackgroundsShowcase.tsx#L148) |  | 1 |
| `GradientAnimCard`<br>Dedicated card for Gradient Animation — combines preview + controls + docs | Fundos › Gradiente animado (`backgrounds#gradient-anim-bg`) | [src/app/components/showcase/BackgroundsShowcase.tsx:198](src/app/components/showcase/BackgroundsShowcase.tsx#L198) |  | 4 |
| `BigBangCard`<br>BIG BANG CARD — previews with controls | Fundos › Vórtice (`backgrounds#vortex-bg`) | [src/app/components/showcase/BackgroundsShowcase.tsx:1148](src/app/components/showcase/BackgroundsShowcase.tsx#L1148) |  | 5 |
| `BgLinesCard`<br>BG LINES CARD — previews with controls | Fundos › Linhas de fundo (`backgrounds#bg-lines-bg`) | [src/app/components/showcase/BackgroundsShowcase.tsx:1240](src/app/components/showcase/BackgroundsShowcase.tsx#L1240) |  | 6 |
| `EffectCard` | Fundos | [src/app/components/showcase/BackgroundsShowcase.tsx:1488](src/app/components/showcase/BackgroundsShowcase.tsx#L1488) |  | 4 |
| `DoodleTextureCard`<br>DOODLE TEXTURE — textura de ícones de traço | Fundos › Textura doodle (`backgrounds#doodle-bg`) | [src/app/components/showcase/BackgroundsShowcase.tsx:1637](src/app/components/showcase/BackgroundsShowcase.tsx#L1637) | `DoodleTexture` | 8 |
| `SpringPlayground` | Motion Design › Física de mola (`motion#spring`) | [src/app/components/showcase/MotionShowcase.tsx:308](src/app/components/showcase/MotionShowcase.tsx#L308) |  | 3 |
| `MagneticButton` | Motion Design › Interações de hover (`motion#hover`) | [src/app/components/showcase/MotionShowcase.tsx:608](src/app/components/showcase/MotionShowcase.tsx#L608) |  | 1 |
| `StepIndicator` | Motion Design › Loaders e progresso (`motion#loaders`) | [src/app/components/showcase/MotionShowcase.tsx:959](src/app/components/showcase/MotionShowcase.tsx#L959) |  | 3 |
| `DurationBars` | Motion Design › Tokens de movimento (`motion#motion-tokens`) | [src/app/components/showcase/MotionShowcase.tsx:1124](src/app/components/showcase/MotionShowcase.tsx#L1124) |  | 1 |
| `OrbitCanvas` | Motion Design › Círculos orbitais (`motion#orbiting-circles`) | [src/app/components/showcase/MotionShowcase.tsx:1472](src/app/components/showcase/MotionShowcase.tsx#L1472) |  | 1 |
| `AvatarOrbitCanvas` | Motion Design › Círculos orbitais (`motion#orbiting-circles`) | [src/app/components/showcase/MotionShowcase.tsx:1620](src/app/components/showcase/MotionShowcase.tsx#L1620) |  | 3 |

### 2.4 Seções com marcação feita à mão no próprio corpo (47)

Seções que montam peças direto na página, sem componente local, com 3 ou mais elementos de estilo próprio. Antes de copiar uma delas, confira se a peça já existe na seção 1.

| Seção | Arquivo | Usa do DS | Marcação à mão |
|---|---|---|---|
| Início › Novidades (`overview#whats-new`) | [src/app/components/showcase/HomeShowcase.tsx:117](src/app/components/showcase/HomeShowcase.tsx#L117) |  | 3 |
| Desenvolvimento › Plataformas (`develop#dev-platforms`) | [src/app/components/showcase/DevelopShowcase.tsx:227](src/app/components/showcase/DevelopShowcase.tsx#L227) |  | 3 |
| Identidade de marca › Uso do símbolo (`brand#brand-symbol-usage`) | [src/app/components/showcase/BrandShowcase.tsx:320](src/app/components/showcase/BrandShowcase.tsx#L320) |  | 3 |
| Identidade de marca › Responsividade (`brand#brand-responsive`) | [src/app/components/showcase/BrandShowcase.tsx:442](src/app/components/showcase/BrandShowcase.tsx#L442) |  | 17 |
| Identidade de marca › Área de respiro (`brand#brand-clearspace`) | [src/app/components/showcase/BrandShowcase.tsx:705](src/app/components/showcase/BrandShowcase.tsx#L705) |  | 10 |
| Fundamentos › Paleta de cores (`colors#colors`) | [src/app/components/showcase/FoundationShowcase.tsx:115](src/app/components/showcase/FoundationShowcase.tsx#L115) |  | 3 |
| Fundamentos › Tipografia (`colors#typography`) | [src/app/components/showcase/FoundationShowcase.tsx:174](src/app/components/showcase/FoundationShowcase.tsx#L174) | `Heading` | 35 |
| Grid e espaçamento › Ritmo vertical (`grid#grid-ritmo`) | [src/app/components/showcase/GridShowcase.tsx:182](src/app/components/showcase/GridShowcase.tsx#L182) |  | 3 |
| Grid e espaçamento › Como usar (`grid#grid-uso`) | [src/app/components/showcase/GridShowcase.tsx:216](src/app/components/showcase/GridShowcase.tsx#L216) |  | 3 |
| Design Tokens › O que são tokens (`tokens#tokens-intro`) | [src/app/components/showcase/TokensShowcase.tsx:114](src/app/components/showcase/TokensShowcase.tsx#L114) |  | 8 |
| Design Tokens › As três camadas (`tokens#tokens-hierarchy`) | [src/app/components/showcase/TokensShowcase.tsx:204](src/app/components/showcase/TokensShowcase.tsx#L204) |  | 21 |
| Design Tokens › Guia para designers (`tokens#tokens-design`) | [src/app/components/showcase/TokensShowcase.tsx:335](src/app/components/showcase/TokensShowcase.tsx#L335) |  | 3 |
| Design Tokens › IA e tokens (`tokens#tokens-ia`) | [src/app/components/showcase/TokensShowcase.tsx:414](src/app/components/showcase/TokensShowcase.tsx#L414) |  | 8 |
| Design Tokens › Implementação em código (`tokens#tokens-definition`) | [src/app/components/showcase/TokensShowcase.tsx:634](src/app/components/showcase/TokensShowcase.tsx#L634) |  | 12 |
| Tom de voz e UX writing › Tipos de informação (`voice#escrita-tipos`) | [src/app/components/showcase/VoiceShowcase.tsx:125](src/app/components/showcase/VoiceShowcase.tsx#L125) |  | 3 |
| Fundos › Guia de composição (`backgrounds#section-backgrounds`) | [src/app/components/showcase/BackgroundsShowcase.tsx:1787](src/app/components/showcase/BackgroundsShowcase.tsx#L1787) |  | 7 |
| Motion Design › Física de mola (`motion#spring`) | [src/app/components/showcase/MotionShowcase.tsx:267](src/app/components/showcase/MotionShowcase.tsx#L267) |  | 4 |
| Motion Design › Stagger e sequências (`motion#stagger`) | [src/app/components/showcase/MotionShowcase.tsx:406](src/app/components/showcase/MotionShowcase.tsx#L406) |  | 3 |
| Motion Design › Interações de hover (`motion#hover`) | [src/app/components/showcase/MotionShowcase.tsx:466](src/app/components/showcase/MotionShowcase.tsx#L466) |  | 8 |
| Motion Design › Microinterações (`motion#micro`) | [src/app/components/showcase/MotionShowcase.tsx:655](src/app/components/showcase/MotionShowcase.tsx#L655) |  | 6 |
| Motion Design › Loaders e progresso (`motion#loaders`) | [src/app/components/showcase/MotionShowcase.tsx:814](src/app/components/showcase/MotionShowcase.tsx#L814) |  | 13 |
| Motion Design › Transições de layout (`motion#layout`) | [src/app/components/showcase/MotionShowcase.tsx:1031](src/app/components/showcase/MotionShowcase.tsx#L1031) |  | 6 |
| Motion Design › Lista animada (`motion#animated-list`) | [src/app/components/showcase/MotionShowcase.tsx:1315](src/app/components/showcase/MotionShowcase.tsx#L1315) |  | 7 |
| Motion Design › Círculos orbitais (`motion#orbiting-circles`) | [src/app/components/showcase/MotionShowcase.tsx:1702](src/app/components/showcase/MotionShowcase.tsx#L1702) |  | 6 |
| Catálogo de componentes › Todos os componentes (`catalogo#catalogo-lista`) | [src/app/components/showcase/CatalogoShowcase.tsx:142](src/app/components/showcase/CatalogoShowcase.tsx#L142) | `Input` | 5 |
| Cards › Borda, sombra e raio (`cards#card-layout`) | [src/app/components/showcase/CardShowcase.tsx:516](src/app/components/showcase/CardShowcase.tsx#L516) | `Card` | 3 |
| Cards › Foto e botão (`cards#card-variants`) | [src/app/components/showcase/CardShowcase.tsx:607](src/app/components/showcase/CardShowcase.tsx#L607) | `Button`, `Card`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` | 4 |
| Cards › Estados (`cards#card-states`) | [src/app/components/showcase/CardShowcase.tsx:770](src/app/components/showcase/CardShowcase.tsx#L770) | `Button`, `Card`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle`, `Skeleton` | 3 |
| Cards › Cards aninhados (`cards#card-nested`) | [src/app/components/showcase/CardShowcase.tsx:913](src/app/components/showcase/CardShowcase.tsx#L913) | `Card`, `CardDescription`, `CardTitle` | 5 |
| Gráficos › Cores dos gráficos (`graficos#graficos-cores`) | [src/app/components/showcase/GraficosShowcase.tsx:550](src/app/components/showcase/GraficosShowcase.tsx#L550) | `BarrasEmpilhadas100`, `BarrasOrdenadas`, `GraficoDeLinhas`, `GraficoDeRosca`, `MapaDeCalorMatricial` | 9 |
| Gráficos › Como escolher (`graficos#graficos-escolher`) | [src/app/components/showcase/GraficosShowcase.tsx:866](src/app/components/showcase/GraficosShowcase.tsx#L866) |  | 4 |
| Gráficos › Design de inteligência (`graficos#graficos-inteligencia`) | [src/app/components/showcase/GraficosShowcase.tsx:1134](src/app/components/showcase/GraficosShowcase.tsx#L1134) | `BarrasOrdenadas`, `DescobertaVisual` | 3 |
| Exibição de dados › Gráficos (`data#charts`) | [src/app/components/showcase/DataShowcase.tsx:181](src/app/components/showcase/DataShowcase.tsx#L181) |  | 3 |
| Exibição de dados › Tabela (`data#table`) | [src/app/components/showcase/DataShowcase.tsx:274](src/app/components/showcase/DataShowcase.tsx#L274) |  | 10 |
| Feedback › Progresso (`feedback#progress`) | [src/app/components/showcase/FeedbackShowcase.tsx:288](src/app/components/showcase/FeedbackShowcase.tsx#L288) |  | 4 |
| Rótulos › Badges e tags (`badges#badges`) | [src/app/components/showcase/FeedbackShowcase.tsx:379](src/app/components/showcase/FeedbackShowcase.tsx#L379) |  | 5 |
| Rótulos › Selo (tag do hero) (`badges#selo`) | [src/app/components/showcase/FeedbackShowcase.tsx:434](src/app/components/showcase/FeedbackShowcase.tsx#L434) | `Selo` | 3 |
| Rótulos › Avatar (`badges#avatar`) | [src/app/components/showcase/FeedbackShowcase.tsx:508](src/app/components/showcase/FeedbackShowcase.tsx#L508) |  | 4 |
| Rótulos › Estados vazios (`badges#empty-states`) | [src/app/components/showcase/FeedbackShowcase.tsx:599](src/app/components/showcase/FeedbackShowcase.tsx#L599) |  | 4 |
| Ícones › Tamanhos e cores (`icons#icon-sizes`) | [src/app/components/showcase/IconsShowcase.tsx:123](src/app/components/showcase/IconsShowcase.tsx#L123) |  | 7 |
| Overlays › Tooltips (`overlays#tooltips`) | [src/app/components/showcase/OverlaysShowcase.tsx:210](src/app/components/showcase/OverlaysShowcase.tsx#L210) | `Tooltip` | 3 |
| Overlays › Dropdown (`overlays#dropdown`) | [src/app/components/showcase/OverlaysShowcase.tsx:225](src/app/components/showcase/OverlaysShowcase.tsx#L225) | `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`, `DropdownMenuTrigger` | 4 |
| Overlays › Diálogos (`overlays#dialogs`) | [src/app/components/showcase/OverlaysShowcase.tsx:273](src/app/components/showcase/OverlaysShowcase.tsx#L273) | `Dialog` | 3 |
| Overlays › Accordion (`overlays#accordion`) | [src/app/components/showcase/OverlaysShowcase.tsx:348](src/app/components/showcase/OverlaysShowcase.tsx#L348) | `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger` | 8 |
| Padrões do site › Elementos flutuantes (`site#site-flutuantes`) | [src/app/components/showcase/SitePatternsShowcase.tsx:195](src/app/components/showcase/SitePatternsShowcase.tsx#L195) | `AvisoProjeto`, `BotaoSubir`, `BotaoWhatsApp`, `Button` | 3 |
| Padrões do site › Divisores curvos (`site#site-curvas`) | [src/app/components/showcase/SitePatternsShowcase.tsx:641](src/app/components/showcase/SitePatternsShowcase.tsx#L641) | `CurvaSecao`, `SeloSecao` | 4 |
| Painel lateral › Anatomia (`sidepanel#sidepanel-anatomy`) | [src/app/components/showcase/SidePanelShowcase.tsx:234](src/app/components/showcase/SidePanelShowcase.tsx#L234) |  | 3 |

## 3. Tokens

Todos em [src/styles/theme.css](src/styles/theme.css). No código, use sempre o token (classe do Tailwind ou `var(--token)`), nunca o valor solto. 

**Cor principal: qual token usar** (claro → escuro)

- `--primary`: `--crimson-400 (#D44D4D)`
- `--primary-hover`: `--crimson-400 (#D44D4D)` → `#DC5E5E`
- `--primary-foreground`: `#FFFFFF`
- `--primary-text`: `--crimson-500 (#B82828)` → `--crimson-300 (#E88080)`
- `--primary-muted`: `rgba(212, 77, 77, 0.1)` → `rgba(212, 77, 77, 0.15)`
- `--primary-muted-foreground`: `--crimson-400 (#D44D4D)` → `--crimson-300 (#E88080)`
- `--ring`: `rgba(212, 77, 77, 0.35)` → `rgba(212, 77, 77, 0.4)`

### 3.1 Escalas de cor (primitivas)

Primitivas: servem de base para os tokens semânticos. Em componentes, prefira os semânticos (3.2).

- **graphite:** 50 `#EDF0F5` · 100 `#D6DCE6` · 200 `#B3BDD0` · 300 `#8898B0` · 400 `#627288` · 500 `#495669` · 600 `#374155` · 700 `#283043` · 800 `#1C2333` · 900 `#131A27` · 950 `#0D1119`
- **crimson:** 50 `#FDF2F2` · 100 `#F9DADA` · 200 `#F3B3B3` · 300 `#E88080` · 400 `#D44D4D` · 500 `#B82828` · 600 `#8C1B1B` · 700 `#6D1313` · 800 `#520E0E` · 900 `#3A0909` · 950 `#220505`

### 3.2 Cores semânticas (use estas no código)

| Token | Claro | Escuro | Papel |
|---|---|---|---|
| `--background` | `--graphite-50 (#EDF0F5)` | `--graphite-950 (#0D1119)` |  |
| `--foreground` | `--graphite-900 (#131A27)` | `#E4E9F0` |  |
| `--foreground-muted` | `--graphite-400 (#627288)` | `--graphite-300 (#8898B0)` |  |
| `--foreground-subtle` | `--graphite-300 (#8898B0)` | `--graphite-400 (#627288)` |  |
| `--primary` | `--crimson-400 (#D44D4D)` | igual |  |
| `--primary-hover` | `--crimson-400 (#D44D4D)` | `#DC5E5E` |  |
| `--primary-foreground` | `#FFFFFF` | igual |  |
| `--primary-muted` | `rgba(212, 77, 77, 0.1)` | `rgba(212, 77, 77, 0.15)` |  |
| `--primary-muted-foreground` | `--crimson-400 (#D44D4D)` | `--crimson-300 (#E88080)` |  |
| `--primary-text` | `--crimson-500 (#B82828)` | `--crimson-300 (#E88080)` |  |
| `--surface-tint` | `--primary-muted (rgba(212, 77, 77, 0.1))` | igual | faixas e cards de apoio |
| `--secondary` | `#E4E9F0` | `rgba(40, 48, 67, 0.8)` |  |
| `--secondary-hover` | `--graphite-100 (#D6DCE6)` | `rgba(40, 48, 67, 1)` |  |
| `--secondary-foreground` | `--graphite-900 (#131A27)` | `#E4E9F0` |  |
| `--disabled` | `--graphite-100 (#D6DCE6)` | `color-mix(in srgb, var(--graphite-700) 60%, var(--graphite-800))` |  |
| `--disabled-foreground` | `--graphite-400 (#627288)` | `color-mix(in srgb, var(--graphite-300) 60%, var(--graphite-400))` |  |
| `--row-hover` | `color-mix(in srgb, var(--graphite-50) 50%, var(--card))` | `rgba(255, 255, 255, 0.04)` |  |
| `--muted` | `#E8EDF3` | `rgba(40, 48, 67, 0.6)` |  |
| `--muted-foreground` | `--graphite-400 (#627288)` | `--graphite-300 (#8898B0)` |  |
| `--accent` | `#E8EDF3` | `rgba(40, 48, 67, 0.6)` |  |
| `--accent-foreground` | `--graphite-900 (#131A27)` | `#E4E9F0` |  |
| `--border` | `rgba(19, 26, 39, 0.09)` | `rgba(255, 255, 255, 0.07)` |  |
| `--border-strong` | `rgba(19, 26, 39, 0.16)` | `rgba(255, 255, 255, 0.12)` |  |
| `--success` | `#388459` | `#22C55E` | texto branco atinge 4,5:1 (decisão de 16/11/2026) |
| `--success-foreground` | `#FFFFFF` | igual |  |
| `--success-muted` | `rgba(56, 132, 89, 0.1)` | `rgba(34, 197, 94, 0.12)` |  |
| `--success-text` | `#327650` | `--success (#22C55E)` | verde escuro só para texto e ícone sobre fundo claro: 5,0:1 no fundo do Alerta com ação, 5,5:1 no branco (decisão de 23/11/2026) |
| `--warning` | `#F0A020` | `#F5B040` | laranja amarelado (decisão de 23/11/2026): só como cor de sinalização; texto sobre ele em grafite (8,1:1), nunca branco (2,2:1) |
| `--warning-foreground` | `--graphite-900 (#131A27)` | igual |  |
| `--warning-muted` | `rgba(240, 160, 32, 0.14)` | `rgba(245, 176, 64, 0.14)` |  |
| `--warning-text` | `#935E0A` | `--warning (#F5B040)` | âmbar escuro só para texto e ícone sobre fundo claro: 5,1:1 no fundo do Alerta com ação, 5,5:1 no branco (decisão de 23/11/2026) |
| `--error` | `#D9416E` | `#E5688F` | erro mais rosa, separado do vermelho da marca (decisão de 23/11/2026) |
| `--error-foreground` | `#FFFFFF` | `--graphite-900 (#131A27)` |  |
| `--error-muted` | `rgba(217, 65, 110, 0.1)` | `rgba(229, 104, 143, 0.15)` |  |
| `--error-text` | `#C52756` | `--error (#E5688F)` | rosa escuro só para texto e ícone sobre fundo claro: 5,0:1 no fundo do Alerta com ação, 5,5:1 no branco (decisão de 23/11/2026) |
| `--info` | `#3D7CAA` | `#3B82F6` | texto branco atinge 4,5:1 (decisão de 16/11/2026) |
| `--info-foreground` | `#FFFFFF` | igual |  |
| `--info-muted` | `rgba(61, 124, 170, 0.1)` | `rgba(59, 130, 246, 0.12)` |  |
| `--info-text` | `#366E97` | `--info (#3B82F6)` | azul escuro só para texto e ícone sobre fundo claro: 5,0:1 no fundo do Alerta com ação, 5,5:1 no branco (decisão de 23/11/2026) |
| `--violet` | `#ba69dc` | `#eb6cff` |  |
| `--violet-foreground` | `#FFFFFF` | igual |  |
| `--violet-muted` | `rgba(186, 105, 220, 0.1)` | `rgba(235, 108, 255, 0.12)` |  |
| `--orange` | `#fa9852` | `#ff8833` |  |
| `--orange-foreground` | `#FFFFFF` | igual |  |
| `--orange-muted` | `rgba(250, 152, 82, 0.1)` | `rgba(255, 136, 51, 0.12)` |  |
| `--card` | `#FFFFFF` | `rgba(19, 26, 39, 0.75)` |  |
| `--card-foreground` | `--graphite-900 (#131A27)` | `#E4E9F0` |  |
| `--popover` | `#FFFFFF` | `rgba(19, 26, 39, 0.95)` |  |
| `--popover-foreground` | `--graphite-900 (#131A27)` | `#E4E9F0` |  |
| `--input` | `--border-strong (rgba(19, 26, 39, 0.16))` | `rgba(19, 26, 39, 0.6)` | borda clara dos campos (decisão de 16/11/2026) |
| `--input-background` | `#FFFFFF` | `rgba(19, 26, 39, 0.6)` |  |
| `--switch-background` | `--graphite-200 (#B3BDD0)` | `--graphite-600 (#374155)` |  |
| `--ring` | `rgba(212, 77, 77, 0.35)` | `rgba(212, 77, 77, 0.4)` |  |
| `--destructive` | `--crimson-400 (#D44D4D)` | igual |  |
| `--destructive-foreground` | `#FFFFFF` | igual |  |

### 3.3 Gráficos

- `--chart-1`: `#D44D4D`
- `--chart-2`: `#F0828B`
- `--chart-3`: `#F2BDC2`
- `--chart-4`: `#D99BA1`
- `--chart-5`: `#BFA0A3`
- `--chart-6`: `#D4D7DC`
- `--chart-7`: `#EBEEF4`
- `--chart-8`: `--chart-7 (#EBEEF4)`
- `--chart-neutral`: `--chart-7 (#EBEEF4)`
- `--chart-grid`: `--graphite-100 (#D6DCE6)` (escuro: `--graphite-800 (#1C2333)`)
- `--chart-seq-1`: `--chart-6 (#D4D7DC)`
- `--chart-seq-1-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-seq-2`: `--chart-4 (#D99BA1)`
- `--chart-seq-2-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-seq-3`: `--chart-2 (#F0828B)`
- `--chart-seq-3-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-seq-4`: `--chart-1 (#D44D4D)`
- `--chart-seq-4-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-1-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-2-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-4-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)
- `--chart-5-texto`: `--foreground (#131A27)` (escuro: `--background (#0D1119)`)

### 3.4 Menu lateral (sidebar)

- `--sidebar`: `#FFFFFF` (escuro: `rgba(13, 17, 25, 0.97)`)
- `--sidebar-foreground`: `--graphite-900 (#131A27)` (escuro: `#E4E9F0`)
- `--sidebar-primary`: `--crimson-400 (#D44D4D)`
- `--sidebar-primary-foreground`: `#FFFFFF`
- `--sidebar-accent`: `#E8EDF3` (escuro: `rgba(40, 48, 67, 0.6)`)
- `--sidebar-accent-foreground`: `--graphite-900 (#131A27)` (escuro: `#E4E9F0`)
- `--sidebar-border`: `rgba(19, 26, 39, 0.09)` (escuro: `rgba(255, 255, 255, 0.06)`)
- `--sidebar-ring`: `rgba(212, 77, 77, 0.35)` (escuro: `rgba(212, 77, 77, 0.4)`)

### 3.5 Tipografia

- `--font-sans`: `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- `--font-display`: `'Space Grotesk', 'Plus Jakarta Sans', sans-serif`
- `--font-accent`: `'Fraunces', Georgia, serif`
- `--font-mono`: `'JetBrains Mono', 'Fira Code', monospace`
- `--font-size`: `16px`
- `--font-weight-normal`: `400`
- `--font-weight-medium`: `500`
- `--font-weight-semibold`: `600`
- `--font-weight-bold`: `700`

### 3.6 Raio

- `--radius`: `0.75rem`
- `--radius-sm`: `calc(var(--radius) - 4px)` — classe rounded-sm
- `--radius-md`: `--radius (0.75rem)` — classe rounded-md
- `--radius-lg`: `calc(var(--radius) + 4px)` — classe rounded-lg
- `--radius-xl`: `calc(var(--radius) + 12px)` — classe rounded-xl

### 3.7 Sombras

- `--shadow-xs`: `0 1px 2px rgba(13, 17, 25, 0.05)` (escuro: `0 1px 2px rgba(0, 0, 0, 0.4)`)
- `--shadow-sm`: `0 1px 3px rgba(13, 17, 25, 0.07), 0 2px 6px rgba(13, 17, 25, 0.05)` (escuro: `0 1px 3px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.25)`)
- `--shadow`: `0 2px 6px rgba(13, 17, 25, 0.07), 0 6px 20px rgba(13, 17, 25, 0.05)` (escuro: `0 2px 8px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.25)`)
- `--shadow-md`: `0 4px 12px rgba(13, 17, 25, 0.08), 0 12px 36px rgba(13, 17, 25, 0.06)` (escuro: `0 4px 16px rgba(0, 0, 0, 0.45), 0 16px 48px rgba(0, 0, 0, 0.30)`)
- `--shadow-lg`: `0 8px 24px rgba(13, 17, 25, 0.09), 0 24px 64px rgba(13, 17, 25, 0.07)` (escuro: `0 8px 32px rgba(0, 0, 0, 0.50), 0 32px 80px rgba(0, 0, 0, 0.35)`)
- `--shadow-xl`: `0 16px 48px rgba(13, 17, 25, 0.10), 0 40px 96px rgba(13, 17, 25, 0.08)` (escuro: `0 16px 64px rgba(0, 0, 0, 0.55), 0 48px 100px rgba(0, 0, 0, 0.40)`)

### 3.8 Espaçamento, grid e larguras

- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `20px`
- `--space-6`: `24px`
- `--space-8`: `32px`
- `--space-10`: `40px`
- `--space-12`: `48px`
- `--space-16`: `64px`
- `--space-20`: `80px`
- `--space-24`: `96px`
- `--grid-columns`: `4`
- `--grid-margin`: `16px`
- `--grid-gutter`: `16px`
- `--content-reading`: `768px`
- `--content-default`: `1152px`
- `--content-wide`: `1280px`
- `--section-space`: `64px`
- `--section-space-hero`: `96px`

### 3.9 Movimento

- `--duration-instant`: `80ms`
- `--duration-fast`: `150ms`
- `--duration-normal`: `250ms`
- `--duration-slow`: `400ms`
- `--duration-xslow`: `600ms`
- `--ease-out`: `cubic-bezier(0, 0, 0.58, 1)`
- `--ease-in`: `cubic-bezier(0.42, 0, 1, 1)`
- `--ease-in-out`: `cubic-bezier(0.42, 0, 0.58, 1)`
- `--ease-snappy`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-back`: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### 3.10 Escala tipográfica (estilos base)

| Elemento | Tamanho | Peso | Altura da linha |
|---|---|---|---|
| `html` | var(--font-size) | — | — |
| `h1` | 2.5rem | var(--font-weight-bold) | 1.15 |
| `h2` | 2rem | var(--font-weight-bold) | 1.2 |
| `h3` | 1.5rem | var(--font-weight-semibold) | 1.3 |
| `h4` | 1.25rem | var(--font-weight-semibold) | 1.4 |
| `h5` | 1.125rem | var(--font-weight-semibold) | 1.4 |
| `h6` | 1rem | var(--font-weight-semibold) | 1.5 |
| `label` | 0.875rem | var(--font-weight-medium) | 1.5 |
| `button` | — | var(--font-weight-semibold) | 1.5 |
| `input, textarea, select` | 0.9375rem | var(--font-weight-normal) | — |

## 4. Regras de uso

Regras documentadas no site. Antes de montar uma tela, leia as que valem para ela.

- **Hierarquia de ações: principal, secundária e terciária** — Usabilidade › Hierarquia de ações (`usability#ux-hierarchy`) · [src/app/components/showcase/UsabilityShowcase.tsx:274](src/app/components/showcase/UsabilityShowcase.tsx#L274)
- **Como escolher o card: pelo fundo, com borda ou com sombra** — Cards › Como escolher (`cards#card-escolher`) · [src/app/components/showcase/CardShowcase.tsx:433](src/app/components/showcase/CardShowcase.tsx#L433)
- **Card: borda, sombra e raio** — Cards › Borda, sombra e raio (`cards#card-layout`) · [src/app/components/showcase/CardShowcase.tsx:516](src/app/components/showcase/CardShowcase.tsx#L516)
- **Card: o que evitar** — Cards › O que evitar (`cards#card-guidelines`) · [src/app/components/showcase/CardShowcase.tsx:1096](src/app/components/showcase/CardShowcase.tsx#L1096)
- **Alertas: tipos e quando usar cada um** — Feedback › Alertas (`feedback#alerts`) · [src/app/components/showcase/FeedbackShowcase.tsx:215](src/app/components/showcase/FeedbackShowcase.tsx#L215)
- **Alerta com ação: ações sempre embaixo do texto** — Feedback › Alerta com ação (`feedback#alerta-com-acao`) · [src/app/components/showcase/FeedbackShowcase.tsx:237](src/app/components/showcase/FeedbackShowcase.tsx#L237)
- **Grid de colunas: 4, 8 e 12 colunas por tela** — Grid e espaçamento › Grid de colunas (`grid#grid-colunas`) · [src/app/components/showcase/GridShowcase.tsx:138](src/app/components/showcase/GridShowcase.tsx#L138)
- **Grid e espaçamento: como usar** — Grid e espaçamento › Como usar (`grid#grid-uso`) · [src/app/components/showcase/GridShowcase.tsx:216](src/app/components/showcase/GridShowcase.tsx#L216)
- **Grid e espaçamento: o que evitar** — Grid e espaçamento › O que evitar (`grid#grid-evitar`) · [src/app/components/showcase/GridShowcase.tsx:258](src/app/components/showcase/GridShowcase.tsx#L258)
- **Contraste mínimo (WCAG 2.2 AA)** — Acessibilidade › Contraste (`accessibility#a11y-contrast`) · [src/app/components/showcase/AccessibilityShowcase.tsx:444](src/app/components/showcase/AccessibilityShowcase.tsx#L444)
- **Respeitar a preferência por menos movimento** — Acessibilidade › Motion (`accessibility#a11y-motion`) · [src/app/components/showcase/AccessibilityShowcase.tsx:546](src/app/components/showcase/AccessibilityShowcase.tsx#L546)
- **Durações e curvas oficiais de movimento** — Motion Design › Tokens de movimento (`motion#motion-tokens`) · [src/app/components/showcase/MotionShowcase.tsx:1095](src/app/components/showcase/MotionShowcase.tsx#L1095)
- **Ações destrutivas: confirmação e desfazer** — Usabilidade › Ações destrutivas (`usability#ux-destructive`) · [src/app/components/showcase/UsabilityShowcase.tsx:360](src/app/components/showcase/UsabilityShowcase.tsx#L360)
- **Gráficos: como escolher** — Gráficos › Como escolher (`graficos#graficos-escolher`) · [src/app/components/showcase/GraficosShowcase.tsx:866](src/app/components/showcase/GraficosShowcase.tsx#L866)
- **Gráficos: cores e ordem dos tons** — Gráficos › Cores dos gráficos (`graficos#graficos-cores`) · [src/app/components/showcase/GraficosShowcase.tsx:550](src/app/components/showcase/GraficosShowcase.tsx#L550)
- **Cabeçalho: uso** — Header e menus › Uso (`header#header-usage`) · [src/app/components/showcase/HeaderShowcase.tsx:803](src/app/components/showcase/HeaderShowcase.tsx#L803)
- **Escrita: princípios** — Tom de voz e UX writing › Princípios (`voice#escrita-principios`) · [src/app/components/showcase/VoiceShowcase.tsx:105](src/app/components/showcase/VoiceShowcase.tsx#L105)

Regras de trabalho do repositório: [`CLAUDE.md`](CLAUDE.md), [`guidelines/Guidelines.md`](guidelines/Guidelines.md), [`propostas/README.md`](propostas/README.md).

Outras seções de uso, cuidados e checklists:

- Identidade de marca › Uso do símbolo (`brand#brand-symbol-usage`)
- Identidade de marca › Regras de uso (`brand#brand-rules`)
- Design Tokens › As três camadas (`tokens#tokens-hierarchy`)
- Usabilidade › Revisão rápida (`usability#ux-checklist`)
- Acessibilidade › Checklist (`accessibility#a11y-checklist`)
- Cards › O que evitar (`cards#card-evitar`)
- Painel lateral › Uso (`sidepanel#sidepanel-usage`)
- Linha do tempo › Uso (`timeline#timeline-usage`)
- Upload › Uso (`upload#upload-usage`)

## 5. Propostas de componente

Peças novas pedidas por um produto, no processo de [`propostas/README.md`](propostas/README.md).

Nenhuma proposta registrada.

## 6. Páginas e âncoras do site

- **Início** (`overview`): `whats-new` Novidades · `home-explore` Tudo no sistema
- **Primeiros passos** (`get-started`): `gs-overview` O que é o Design System Dani Moscatelli? · `gs-structure` Usando o sistema · `gs-design` Design · `gs-develop` Desenvolvimento
- **Princípios de design** (`principles`)
- **Desenvolvimento** (`develop`): `dev-catalogo` Consulte o catálogo antes de montar qualquer peça · `dev-announcements` As últimas do desenvolvimento · `dev-platforms` Plataformas · `dev-setup` Como os tokens são definidos no código · `dev-reference` Referência de tokens · `dev-workflow` Mantendo design e código em sincronia · `dev-ai` Construindo com IA
- **Identidade de marca** (`brand`): `brand` · `brand-logo-vertical` Logo vertical · `brand-logo-horizontal` Logo horizontal · `brand-symbol` Símbolo / Ícone · `brand-symbol-usage` Uso do símbolo · `brand-responsive` Responsividade · `brand-backgrounds` Aplicação em fundos · `brand-colors` Paleta da marca · `brand-typography` Tipografia · `brand-rules` Regras de uso · `brand-clearspace` Área de respiro
- **Fundamentos** (`colors`): `colors` Paleta de cores · `typography` Tipografia · `spacing` · `radius` Raio · `shadows` Sombras · `colors-tokens` Tokens
- **Grid e espaçamento** (`grid`): `grid-visao` Visão geral · `grid-escala` Escala de espaçamento · `grid-colunas` Grid de colunas · `grid-larguras` Larguras máximas · `grid-ritmo` Ritmo vertical · `grid-uso` Como usar · `grid-evitar` O que evitar · `grid-tokens` Tokens
- **Design Tokens** (`tokens`): `tokens-intro` O que são tokens · `tokens-hierarchy` As três camadas · `tokens-design` Guia para designers · `tokens-ia` IA e tokens · `tokens-bridge` Mapeamento Design ↔ Dev · `tokens-definition` Implementação em código
- **Integração** (`integration`)
- **Usabilidade** (`usability`): `ux-principles` Princípios · `ux-hierarchy` Hierarquia de ações · `ux-targets` Tamanho de alvo · `ux-feedback` Status do sistema · `ux-states` Estados de conteúdo · `ux-errors` Erros e microcopy · `ux-destructive` Ações destrutivas · `ux-checklist` Revisão rápida
- **Tom de voz e UX writing** (`voice`): `escrita-principios` Princípios · `escrita-tipos` Tipos de informação
- **Acessibilidade** (`accessibility`): `a11y-principles` Princípios · `a11y-contrast` Contraste · `a11y-focus` Foco · `a11y-keyboard` Teclado · `a11y-forms` Formulários e rótulos · `a11y-structure` Estrutura e ARIA · `a11y-motion` Motion · `a11y-checklist` Checklist
- **Fundos** (`backgrounds`): `gradient-anim-bg` Gradiente animado · `canvas-reveal-bg` · `vortex-bg` Vórtice · `bg-lines-bg` Linhas de fundo · `doodle-bg` Textura doodle · `section-backgrounds` Guia de composição · `backgrounds-tokens` Tokens
- **Motion Design** (`motion`): `enter-presets` Presets de entrada e saída · `easing` Referência de easing · `spring` Física de mola · `stagger` Stagger e sequências · `hover` Interações de hover · `micro` Microinterações · `loaders` Loaders e progresso · `layout` Transições de layout · `motion-tokens` Tokens de movimento · `marquee` Marquee · `animated-list` Lista animada · `orbiting-circles` Círculos orbitais · `wobble-card` Card com wobble · `shine-border` Shine Border
- **Templates** (`templates`): `template-dashboard` Dashboard · `template-settings` Configurações · `template-auth` Autenticação · `template-team` Equipe · `template-inbox` Caixa de entrada · `template-pricing` Preços · `template-contact` Contato · `template-landing` Landing page · `templates-tokens` Tokens
- **Catálogo de componentes** (`catalogo`): `catalogo-lista` Todos os componentes
- **Botões** (`buttons`): `buttons` Variantes de botão · `inputs` Controles de formulário · `password` Senha · `segmented` Controle segmentado · `buttons-tokens` Tokens
- **Cards** (`cards`): `card-escolher` Como escolher · `card-solido` Card sólido · `card-anatomy` Anatomia do card · `card-fundos` Por fundo · `card-layout` Borda, sombra e raio · `card-orientacao` Vertical e horizontal · `card-variants` Foto e botão · `card-actions` Botões em cards · `card-ia` Arquitetura de informação · `card-states` Estados · `card-animacao` Animação · `card-shine` Shine Border · `card-nested` Cards aninhados · `card-partner` Card de convite ao parceiro · `card-vidro` Card de vidro · `card-glass` Vidro: acabamentos · `card-glass-fundos` Vidro por fundo · `card-glass-conteudo` Vidro com conteúdo · `card-testar` Testar o vidro · `card-glass-teste` Testar o vidro · `card-evitar` O que evitar · `card-guidelines` O que evitar · `card-accessibility` Acessibilidade do card · `card-tokens` Tokens de card
- **Gráficos** (`graficos`): `graficos-catalogo` Catálogo completo · `graficos-catalogo-comparacao` · `graficos-catalogo-tempo` · `graficos-catalogo-composicao` · `graficos-catalogo-relacoes` · `graficos-catalogo-distribuicao` · `graficos-catalogo-geografia` · `graficos-cores` Cores dos gráficos · `graficos-escolher` Como escolher · `graficos-rosca` Rosca · `graficos-recomendados` Gráficos recomendados · `graficos-inteligencia` Design de inteligência · `graficos-componentes` Componentes e props · `graficos-acessibilidade` Acessibilidade dos gráficos
- **Exibição de dados** (`data`): `kpi-cards` Cards de KPI · `charts` Gráficos · `table` Tabela · `data-tokens` Tokens
- **Feedback** (`feedback`): `tabs` Abas · `alerts` Alertas · `alerta-com-acao` Alerta com ação · `toasts` Toasts · `progress` Progresso · `skeleton` Skeleton · `feedback-tokens` Tokens
- **Rótulos** (`badges`): `badges` Badges e tags · `selo` Selo (tag do hero) · `selo-secao` Selo de seção · `rotulos-timeline` · `avatar` Avatar · `avatar-circles` Avatar Circles · `empty-states` Estados vazios · `badges-tokens` Tokens
- **Ícones** (`icons`): `icon-sizes` Tamanhos e cores · `icon-library` Biblioteca · `icons-tokens` Tokens
- **Overlays** (`overlays`): `breadcrumb` Breadcrumb · `pagination` Paginação · `tooltips` Tooltips · `dropdown` Dropdown · `dialogs` Diálogos · `accordion` Accordion · `overlays-tokens` Tokens
- **Padrões do site** (`site`): `site-rodape` Rodapé · `site-flutuantes` Elementos flutuantes · `site-cookies` Aviso de cookies · `site-entrada` Entrada ao rolar · `site-frentes` Card de frente de atuação · `site-curvas` Divisores curvos
- **Header e menus** (`header`): `header-demo` Demonstração · `header-models` Modelos · `header-scroll` Comportamentos de rolagem · `header-mobile` Menus no celular · `header-backgrounds` Fundos por trás do header · `header-a11y` Checklist de acessibilidade · `header-usage` Uso · `header-tokens` Tokens
- **Painel lateral** (`sidepanel`): `sidepanel-anatomy` Anatomia · `sidepanel-behavior` Comportamento · `sidepanel-contact` Formulário de contato · `sidepanel-a11y` Checklist de acessibilidade · `sidepanel-usage` Uso · `sidepanel-tokens` Tokens
- **Linha do tempo** (`timeline`): `timeline-demo` Demonstração · `timeline-anatomy` Anatomia · `timeline-motion` Movimento: Step Indicator · `timeline-usage` Uso
- **Upload** (`upload`): `upload-dropzone` Área de soltar · `upload-list` Lista de arquivos · `upload-image` Imagem única · `upload-gallery` Galeria · `upload-sheet` Importar planilha · `upload-states` Estados e mensagens · `upload-a11y` Checklist de acessibilidade · `upload-usage` Uso · `upload-tokens` Tokens
