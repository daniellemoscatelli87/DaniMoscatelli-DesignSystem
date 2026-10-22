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
