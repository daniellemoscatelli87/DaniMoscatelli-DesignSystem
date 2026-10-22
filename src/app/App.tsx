import React, { useState, useEffect, useRef } from "react";
import logoVermelho from "../imports/LogoVermelho.png";
import logoIconRed from "../imports/IconeLogo-red.png";
import {
  Sun, Moon, Palette, Type, Layers, MousePointer2,
  BarChart2, Bell, Grid3X3,
  ChevronRight, Zap,
  TableProperties, Box,
  Search, Code2, Shapes, LayoutTemplate, Wind, Image, Fingerprint, Coins, Plug, Rocket, Accessibility, Compass, Lightbulb, Home,
} from "lucide-react";
import { I18nProvider, useI18n } from "./i18n";
import { FoundationShowcase } from "./components/showcase/FoundationShowcase";
import { FormShowcase } from "./components/showcase/FormShowcase";
import { DataShowcase } from "./components/showcase/DataShowcase";
import { FeedbackShowcase } from "./components/showcase/FeedbackShowcase";
import { OverlaysShowcase } from "./components/showcase/OverlaysShowcase";
import { IconsShowcase } from "./components/showcase/IconsShowcase";
import { TemplatesShowcase } from "./components/showcase/TemplatesShowcase";
import { MotionShowcase } from "./components/showcase/MotionShowcase";
import { BackgroundsShowcase } from "./components/showcase/BackgroundsShowcase";
import { BrandShowcase } from "./components/showcase/BrandShowcase";
import { TokensShowcase } from "./components/showcase/TokensShowcase";
import { IntegrationShowcase } from "./components/showcase/IntegrationShowcase";
import { DevelopShowcase } from "./components/showcase/DevelopShowcase";
import { GetStartedShowcase } from "./components/showcase/GetStartedShowcase";
import { HomeShowcase } from "./components/showcase/HomeShowcase";
import { PrinciplesShowcase } from "./components/showcase/PrinciplesShowcase";
import { UsabilityShowcase } from "./components/showcase/UsabilityShowcase";
import { AccessibilityShowcase } from "./components/showcase/AccessibilityShowcase";

/* ── pt-BR labels for nav (keys are the English labels) ── */
const ptLabels: Record<string, string> = {
  "Start": "Início",
  "Brand": "Marca",
  "Foundation": "Fundamentos",
  "Concepts": "Conceitos",
  "Guidelines": "Diretrizes",
  "Backgrounds": "Fundos",
  "Motion": "Motion",
  "Templates": "Templates",
  "Components": "Componentes",
  "Home": "Início",
  "Get Started": "Primeiros passos",
  "Design Principles": "Princípios de design",
  "Develop": "Desenvolvimento",
  "Brand Identity": "Identidade de marca",
  "Logo Vertical": "Logo vertical",
  "Logo Horizontal": "Logo horizontal",
  "Symbol / Icon": "Símbolo / Ícone",
  "Symbol Usage": "Uso do símbolo",
  "Responsiveness": "Responsividade",
  "Application on Backgrounds": "Aplicação em fundos",
  "Brand Palette": "Paleta da marca",
  "Typography": "Tipografia",
  "Usage Rules": "Regras de uso",
  "Clear Space": "Área de respiro",
  "Color Palette": "Paleta de cores",
  "Spacing": "Espaçamento",
  "Radius": "Raio",
  "Shadows": "Sombras",
  "Tokens": "Tokens",
  "Design Tokens": "Design Tokens",
  "What are tokens": "O que são tokens",
  "The three layers": "As três camadas",
  "Guide for designers": "Guia para designers",
  "AI and tokens": "IA e tokens",
  "Design ↔ Dev Mapping": "Mapeamento Design ↔ Dev",
  "Implementation in code": "Implementação em código",
  "Integration": "Integração",
  "Usability": "Usabilidade",
  "Accessibility": "Acessibilidade",
  "Principles": "Princípios",
  "Action hierarchy": "Hierarquia de ações",
  "Target size": "Tamanho de alvo",
  "System status": "Status do sistema",
  "Content states": "Estados de conteúdo",
  "Errors & microcopy": "Erros e microcopy",
  "Destructive actions": "Ações destrutivas",
  "Quick review": "Revisão rápida",
  "Contrast": "Contraste",
  "Focus": "Foco",
  "Keyboard": "Teclado",
  "Forms & labels": "Formulários e rótulos",
  "Structure & ARIA": "Estrutura e ARIA",
  "Checklist": "Checklist",
  "Gradient Animation": "Gradiente animado",
  "Canvas Reveal": "Canvas Reveal",
  "Vortex": "Vórtice",
  "Background Lines": "Linhas de fundo",
  "Motion Design": "Motion Design",
  "Enter & Exit Presets": "Presets de entrada e saída",
  "Easing Reference": "Referência de easing",
  "Spring Physics": "Física de mola",
  "Stagger & Sequences": "Stagger e sequências",
  "Hover Interactions": "Interações de hover",
  "Micro-interactions": "Microinterações",
  "Loaders & Progress": "Loaders e progresso",
  "Layout Transitions": "Transições de layout",
  "Marquee": "Marquee",
  "Animated List": "Lista animada",
  "Orbiting Circles": "Círculos orbitais",
  "Wobble Card": "Card Wobble",
  "Motion Tokens": "Tokens de movimento",
  "Dashboard": "Dashboard",
  "Settings": "Configurações",
  "Auth": "Autenticação",
  "Team": "Equipe",
  "Inbox": "Caixa de entrada",
  "Pricing": "Preços",
  "Contact": "Contato",
  "Landing Page": "Landing page",
  "Buttons": "Botões",
  "Button Variants": "Variantes de botão",
  "Form Controls": "Controles de formulário",
  "Data Display": "Exibição de dados",
  "KPI Cards": "Cards de KPI",
  "Charts": "Gráficos",
  "Table": "Tabela",
  "Feedback": "Feedback",
  "Tabs": "Abas",
  "Alerts": "Alertas",
  "Toasts": "Toasts",
  "Progress": "Progresso",
  "Skeleton": "Skeleton",
  "Labels": "Rótulos",
  "Badges & Tags": "Badges e tags",
  "Avatar": "Avatar",
  "Empty States": "Estados vazios",
  "Timeline": "Linha do tempo",
  "Icons": "Ícones",
  "Sizes & Colors": "Tamanhos e cores",
  "Library": "Biblioteca",
  "Overlays": "Overlays",
  "Breadcrumb": "Breadcrumb",
  "Pagination": "Paginação",
  "Tooltips": "Tooltips",
  "Dropdown": "Dropdown",
  "Dialogs": "Diálogos",
  "Accordion": "Accordion",
  "Feedback & Status": "Feedback e status",
  "Labels & Patterns": "Rótulos e padrões",
  "Overlays & Navigation": "Overlays e navegação",
};

/* ── Sidebar nav structure ── */
type SubItem = { id: string; label: string; sectionId: string };
type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  items?: SubItem[];
};

const navGroups: { group: string; items: NavItem[] }[] = [
  {
    group: "Start",
    items: [
      { id: "overview", label: "Home", icon: Home },
      { id: "get-started", label: "Get Started", icon: Rocket },
      { id: "principles", label: "Design Principles", icon: Lightbulb },
      { id: "develop", label: "Develop", icon: Code2 },
    ],
  },
  {
    group: "Brand",
    items: [
      { id: "brand", label: "Brand Identity", icon: Fingerprint,
        items: [
          { id: "brand-logo-vertical",   label: "Logo Vertical",    sectionId: "brand" },
          { id: "brand-logo-horizontal", label: "Logo Horizontal",  sectionId: "brand" },
          { id: "brand-symbol",          label: "Symbol / Icon",      sectionId: "brand" },
          { id: "brand-symbol-usage",    label: "Symbol Usage",       sectionId: "brand" },
          { id: "brand-responsive",      label: "Responsiveness",       sectionId: "brand" },
          { id: "brand-backgrounds",     label: "Application on Backgrounds",  sectionId: "brand" },
          { id: "brand-colors",          label: "Brand Palette",  sectionId: "brand" },
          { id: "brand-typography",      label: "Typography",       sectionId: "brand" },
          { id: "brand-rules",           label: "Usage Rules",    sectionId: "brand" },
          { id: "brand-clearspace",      label: "Clear Space", sectionId: "brand" },
        ],
      },
    ],
  },
  {
    group: "Foundation",
    items: [
      { id: "colors", label: "Foundation", icon: Palette,
        items: [
          { id: "colors",          label: "Color Palette",   sectionId: "colors" },
          { id: "typography",      label: "Typography",       sectionId: "colors" },
          { id: "spacing",         label: "Spacing",          sectionId: "colors" },
          { id: "radius",          label: "Radius",           sectionId: "colors" },
          { id: "shadows",         label: "Shadows",          sectionId: "colors" },
          { id: "colors-tokens",   label: "Tokens",           sectionId: "colors" },
        ],
      },
    ],
  },
  {
    group: "Concepts",
    items: [
      { id: "tokens", label: "Design Tokens", icon: Coins,
        items: [
          { id: "tokens-intro",      label: "What are tokens",        sectionId: "tokens" },
          { id: "tokens-hierarchy",  label: "The three layers",         sectionId: "tokens" },
          { id: "tokens-design",     label: "Guide for designers",     sectionId: "tokens" },
          { id: "tokens-ia",         label: "AI and tokens",             sectionId: "tokens" },
          { id: "tokens-bridge",     label: "Design ↔ Dev Mapping", sectionId: "tokens" },
          { id: "tokens-definition", label: "Implementation in code", sectionId: "tokens" },
        ],
      },
      { id: "integration", label: "Integration", icon: Plug },
    ],
  },
  {
    group: "Guidelines",
    items: [
      { id: "usability", label: "Usability", icon: Compass,
        items: [
          { id: "ux-principles",   label: "Principles",         sectionId: "usability" },
          { id: "ux-hierarchy",    label: "Action hierarchy",   sectionId: "usability" },
          { id: "ux-targets",      label: "Target size",        sectionId: "usability" },
          { id: "ux-feedback",     label: "System status",      sectionId: "usability" },
          { id: "ux-states",       label: "Content states",     sectionId: "usability" },
          { id: "ux-errors",       label: "Errors & microcopy", sectionId: "usability" },
          { id: "ux-destructive",  label: "Destructive actions",sectionId: "usability" },
          { id: "ux-checklist",    label: "Quick review",       sectionId: "usability" },
        ],
      },
      { id: "accessibility", label: "Accessibility", icon: Accessibility,
        items: [
          { id: "a11y-principles", label: "Principles",         sectionId: "accessibility" },
          { id: "a11y-contrast",   label: "Contrast",           sectionId: "accessibility" },
          { id: "a11y-focus",      label: "Focus",              sectionId: "accessibility" },
          { id: "a11y-keyboard",   label: "Keyboard",           sectionId: "accessibility" },
          { id: "a11y-forms",      label: "Forms & labels",     sectionId: "accessibility" },
          { id: "a11y-structure",  label: "Structure & ARIA",   sectionId: "accessibility" },
          { id: "a11y-motion",     label: "Motion",             sectionId: "accessibility" },
          { id: "a11y-checklist",  label: "Checklist",          sectionId: "accessibility" },
        ],
      },
    ],
  },
  {
    group: "Backgrounds",
    items: [
      { id: "backgrounds", label: "Backgrounds", icon: Image,
        items: [
          { id: "gradient-anim-bg",  label: "Gradient Animation", sectionId: "backgrounds" },
          { id: "canvas-reveal-bg",  label: "Canvas Reveal",      sectionId: "backgrounds" },
          { id: "vortex-bg",         label: "Vortex",             sectionId: "backgrounds" },
          { id: "bg-lines-bg",       label: "Background Lines",   sectionId: "backgrounds" },
          { id: "backgrounds-tokens",label: "Tokens",             sectionId: "backgrounds" },
        ],
      },
    ],
  },
  {
    group: "Motion",
    items: [
      { id: "motion", label: "Motion Design", icon: Wind,
        items: [
          { id: "enter-presets", label: "Enter & Exit Presets", sectionId: "motion" },
          { id: "easing",        label: "Easing Reference",     sectionId: "motion" },
          { id: "spring",        label: "Spring Physics",       sectionId: "motion" },
          { id: "stagger",       label: "Stagger & Sequences",  sectionId: "motion" },
          { id: "hover",         label: "Hover Interactions",   sectionId: "motion" },
          { id: "micro",         label: "Micro-interactions",   sectionId: "motion" },
          { id: "loaders",       label: "Loaders & Progress",   sectionId: "motion" },
          { id: "layout",          label: "Layout Transitions",   sectionId: "motion" },
          { id: "marquee",         label: "Marquee",              sectionId: "motion" },
          { id: "animated-list",   label: "Animated List",        sectionId: "motion" },
          { id: "orbiting-circles",label: "Orbiting Circles",     sectionId: "motion" },
          { id: "wobble-card",     label: "Wobble Card",          sectionId: "motion" },
          { id: "tokens",          label: "Motion Tokens",        sectionId: "motion" },
        ],
      },
    ],
  },
  {
    group: "Templates",
    items: [
      { id: "templates", label: "Templates", icon: LayoutTemplate,
        items: [
          { id: "template-dashboard",  label: "Dashboard",     sectionId: "templates" },
          { id: "template-settings",   label: "Settings",      sectionId: "templates" },
          { id: "template-auth",       label: "Auth",          sectionId: "templates" },
          { id: "template-team",       label: "Team",          sectionId: "templates" },
          { id: "template-inbox",      label: "Inbox",         sectionId: "templates" },
          { id: "template-pricing",    label: "Pricing",       sectionId: "templates" },
          { id: "template-contact",    label: "Contact",       sectionId: "templates" },
          { id: "template-landing",    label: "Landing Page",  sectionId: "templates" },
          { id: "templates-tokens",    label: "Tokens",        sectionId: "templates" },
        ],
      },
    ],
  },
  {
    group: "Components",
    items: [
      { id: "buttons", label: "Buttons", icon: MousePointer2,
        items: [
          { id: "buttons",        label: "Button Variants", sectionId: "buttons" },
          { id: "inputs",         label: "Form Controls",   sectionId: "buttons" },
          { id: "buttons-tokens", label: "Tokens",          sectionId: "buttons" },
        ],
      },
      { id: "data", label: "Data Display", icon: TableProperties,
        items: [
          { id: "kpi-cards",   label: "KPI Cards", sectionId: "data" },
          { id: "charts",      label: "Charts",    sectionId: "data" },
          { id: "table",       label: "Table",     sectionId: "data" },
          { id: "data-tokens", label: "Tokens",    sectionId: "data" },
        ],
      },
      { id: "feedback", label: "Feedback", icon: Bell,
        items: [
          { id: "tabs",              label: "Tabs",     sectionId: "feedback" },
          { id: "alerts",            label: "Alerts",   sectionId: "feedback" },
          { id: "toasts",            label: "Toasts",   sectionId: "feedback" },
          { id: "progress",          label: "Progress", sectionId: "feedback" },
          { id: "skeleton",          label: "Skeleton", sectionId: "feedback" },
          { id: "feedback-tokens",   label: "Tokens",   sectionId: "feedback" },
        ],
      },
      { id: "badges", label: "Labels", icon: Layers,
        items: [
          { id: "badges",        label: "Badges & Tags", sectionId: "badges" },
          { id: "avatar",        label: "Avatar",        sectionId: "badges" },
          { id: "empty-states",  label: "Empty States",  sectionId: "badges" },
          { id: "timeline",      label: "Timeline",      sectionId: "badges" },
          { id: "badges-tokens", label: "Tokens",        sectionId: "badges" },
        ],
      },
      { id: "icons", label: "Icons", icon: Shapes,
        items: [
          { id: "icon-sizes",   label: "Sizes & Colors", sectionId: "icons" },
          { id: "icon-library", label: "Library",       sectionId: "icons" },
          { id: "icons-tokens", label: "Tokens",           sectionId: "icons" },
        ],
      },
      { id: "overlays", label: "Overlays", icon: Box,
        items: [
          { id: "breadcrumb",       label: "Breadcrumb", sectionId: "overlays" },
          { id: "pagination",       label: "Pagination", sectionId: "overlays" },
          { id: "tooltips",         label: "Tooltips",   sectionId: "overlays" },
          { id: "dropdown",         label: "Dropdown",   sectionId: "overlays" },
          { id: "dialogs",          label: "Dialogs",    sectionId: "overlays" },
          { id: "accordion",        label: "Accordion",  sectionId: "overlays" },
          { id: "overlays-tokens",  label: "Tokens",     sectionId: "overlays" },
        ],
      },
    ],
  },
];

const groupIcons: Record<string, React.ElementType> = {
  Start: Rocket,
  Concepts: Lightbulb,
  Guidelines: Compass,
  Components: Layers,
};

const sectionComponents: Record<string, React.ReactNode> = {
  usability:     <UsabilityShowcase />,
  accessibility: <AccessibilityShowcase />,
  brand:     <BrandShowcase />,
  colors:    <FoundationShowcase />,
  tokens:      <TokensShowcase />,
  integration: <IntegrationShowcase />,
  buttons:   <FormShowcase />,
  data:      <DataShowcase />,
  feedback:  <FeedbackShowcase />,
  badges:    <FeedbackShowcase />,
  icons:     <IconsShowcase />,
  overlays:  <OverlaysShowcase />,
  motion:      <MotionShowcase />,
  backgrounds: <BackgroundsShowcase />,
  templates:   <TemplatesShowcase />,
};

const sectionLabels: Record<string, string> = {
  overview:  "Home",
  "get-started": "Get Started",
  principles: "Design Principles",
  develop:   "Develop",
  usability:     "Usability",
  accessibility: "Accessibility",
  brand:     "Brand Identity",
  colors:    "Foundation",
  buttons:   "Form Controls",
  data:      "Data Display",
  feedback:  "Feedback & Status",
  badges:    "Labels & Patterns",
  icons:     "Icons",
  overlays:  "Overlays & Navigation",
  motion:      "Motion Design",
  backgrounds: "Backgrounds",
  templates:   "Templates",
};

function AppShell() {
  const { lang, setLang, t } = useI18n();
  const tl = (label: string) => (lang === "pt" ? ptLabels[label] ?? label : label);
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarExpanded, setSidebarExpanded] = useState<Record<string, boolean>>({
    brand:     false,
    usability: false,
    accessibility: false,
    tokens:    false,
    templates: false,
    colors:    false,
    buttons:   false,
    data:      false,
    feedback:  false,
    badges:    false,
    icons:     false,
    overlays:  false,
    motion:      false,
    backgrounds: false,
  });
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const collapsed = !hovered;
  // Anchor to scroll to after a section switch
  const [pendingAnchor, setPendingAnchor] = useState<string | null>(null);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  // After activeSection changes and the new content renders, scroll to the pending anchor
  useEffect(() => {
    if (!pendingAnchor) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(pendingAnchor);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setPendingAnchor(null);
    }, 60);
    return () => clearTimeout(timer);
  }, [pendingAnchor, activeSection]);

  // Click on a parent nav item: toggle expand + switch section
  const handleParentClick = (id: string) => {
    setSidebarExpanded(prev => ({ [id]: !prev[id] }));
    const owner = navGroups.find(g => g.items.some(i => i.id === id));
    if (owner && owner.items.length === 1) setOpenGroups({});
    setActiveSection(id);
    setPendingAnchor(null);
    setMobileSidebarOpen(false);
    // Scroll main area back to top when switching sections
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Click on a sub-item: switch to its parent section then scroll to anchor
  const handleSubItemClick = (sectionId: string, anchorId: string) => {
    setMobileSidebarOpen(false);
    if (activeSection !== sectionId) {
      // Section needs to switch first; scroll happens via useEffect
      setActiveSection(sectionId);
      setPendingAnchor(anchorId);
    } else {
      // Already on the right section — scroll immediately
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const navigateTo = (id: string, anchor?: string) => {
    const owner = navGroups.find(g => g.items.some(i => i.id === id));
    const target = owner?.items.find(i => i.id === id);
    setOpenGroups(owner && owner.items.length > 1 ? { [owner.group]: true } : {});
    setSidebarExpanded(target?.items ? { [id]: true } : {});
    setActiveSection(id);
    setPendingAnchor(anchor ?? null);
    setMobileSidebarOpen(false);
    if (!anchor) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentContent =
    activeSection === "get-started"
      ? <GetStartedShowcase onNavigate={navigateTo} />
      : activeSection === "principles"
      ? <PrinciplesShowcase onNavigate={navigateTo} />
      : activeSection === "develop"
      ? <DevelopShowcase onNavigate={navigateTo} />
      : activeSection === "overview"
        ? <HomeShowcase onNavigate={navigateTo} />
        : sectionComponents[activeSection];
  const currentLabel = tl(sectionLabels[activeSection]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── TOP NAV ── */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3" style={{ boxShadow: "var(--shadow-sm)" }}>
        {/* Menu toggle: collapses the sidebar on desktop, opens the drawer on mobile */}
        <button
          type="button"
          className="lg:hidden h-9 w-9 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          onClick={() => setMobileSidebarOpen(v => !v)}
          aria-label={t("Toggle menu", "Abrir/fechar menu")}
          title={t("Toggle menu", "Abrir/fechar menu")}
        >
          <svg style={{ height: "18px", width: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>

        {/* Logo + wordmark */}
        <style>{`
          @keyframes ds-shimmer {
            from { background-position: 0% 50%; }
            to   { background-position: 200% 50%; }
          }
          .ds-wordmark { color: var(--graphite-900); }
          .dark .ds-wordmark { color: #ffffff; }
          .ds-shimmer {
            display: inline-block;
            line-height: 1.4;
            padding-bottom: 0.12em;
            background-image: linear-gradient(
              90deg,
              #627288 0%,
              #8898B0 25%,
              #C8D2E0 50%,
              #8898B0 75%,
              #627288 100%
            );
            background-size: 200% 100%;
            background-repeat: repeat-x;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            animation: ds-shimmer 5.5s linear infinite;
          }
          html:not(.dark) .ds-shimmer {
            background-image: linear-gradient(90deg, #627288 0%, #495669 25%, #131A27 50%, #495669 75%, #627288 100%);
          }
          @media (prefers-reduced-motion: reduce) { .ds-shimmer { animation: none; } }
        `}</style>
        <button type="button" onClick={() => navigateTo("overview")} aria-label={tl("Home")} className="flex items-center gap-2.5 min-w-0 text-left">
          <img src={logoIconRed} alt="" className="h-[34px] w-[34px] object-contain shrink-0" />
          <div className="flex items-center gap-0">
            <span
              className="ds-wordmark text-[1.0625rem] font-semibold tracking-tight whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Dani Moscatelli
            </span>
            <span
              className="mx-2 text-[1.0625rem] font-light"
              style={{ color: "#627288", opacity: 0.4 }}
            >
              |
            </span>
            <span
              className="text-[1.0625rem] font-normal tracking-tight whitespace-nowrap ds-shimmer"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Design System
            </span>
          </div>
        </button>

        <div className="flex-1" />

        {/* Search hint */}
        <button className="hidden md:flex items-center gap-2 h-7 px-3 rounded-[8px] border border-border bg-background/60 text-muted-foreground text-[0.75rem] hover:border-[var(--border-strong)] hover:bg-background transition-colors">
          <Search className="h-3 w-3" />
          <span>{t("Search", "Buscar")}</span>
          <kbd className="ml-1.5 px-1 py-0.5 text-[0.5625rem] rounded-[3px] bg-muted font-medium border border-border tracking-wide">⌘K</kbd>
        </button>


        {/* Language segmented pill */}
        <div role="group" aria-label={t("Language", "Idioma")} className="flex items-center h-8 p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
          {([["en", "EN", "English"], ["pt", "PT", "Português (BR)"]] as const).map(([code, short, full]) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              aria-pressed={lang === code}
              title={full}
              aria-label={full}
              className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] text-[0.75rem] font-medium transition-all duration-150 ${
                lang === code
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {short}
            </button>
          ))}
        </div>

        {/* Dark/Light segmented pill */}
        <div className="flex items-center h-8 p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
          <button
            onClick={() => setDark(false)}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] text-[0.75rem] font-medium transition-all duration-150 ${
              !dark
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sun style={{ height: "13px", width: "13px" }} />
            <span className="hidden sm:inline">{t("Light", "Claro")}</span>
          </button>
          <button
            onClick={() => setDark(true)}
            className={`flex items-center gap-1.5 h-7 px-2.5 rounded-[8px] text-[0.75rem] font-medium transition-all duration-150 ${
              dark
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Moon style={{ height: "13px", width: "13px" }} />
            <span className="hidden sm:inline">{t("Dark", "Escuro")}</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* ── SIDEBAR ── */}
        <>
          {/* Mobile overlay */}
          {mobileSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
          )}

          <aside
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false); }}
            className={`fixed top-16 bottom-0 z-40 w-60 ${collapsed ? "lg:w-16" : ""} border-r border-border bg-sidebar ${collapsed ? "" : "lg:shadow-[8px_0_24px_-12px_rgba(0,0,0,0.25)]"} flex flex-col transition-[transform,width] duration-200
              ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          >
            <div className={`hidden lg:flex h-12 shrink-0 items-center px-3 ${collapsed ? "lg:justify-center lg:px-0" : ""}`}>
              <div
                className={`flex items-center gap-2 text-muted-foreground ${collapsed ? "" : "w-full"}`}
                title={t("Menu", "Menu")}
                role="img"
                aria-label={t("Menu", "Menu")}
              >
                <span className="h-9 w-9 flex items-center justify-center shrink-0">
                  <svg style={{ height: "18px", width: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
                </span>
                <span className={`text-xs font-medium uppercase tracking-wider whitespace-nowrap ${collapsed ? "lg:hidden" : ""}`}>{t("Menu", "Menu")}</span>
              </div>
            </div>
            <div className={`flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 ${collapsed ? "lg:px-2" : ""}`}>
              {navGroups.map(group => {
                const single = group.items.length === 1;
                const GroupIcon = groupIcons[group.group] ?? Layers;
                const groupOpen = !!openGroups[group.group];
                const groupActive = group.items.some(i => i.id === activeSection || i.items?.some(s => s.sectionId === activeSection));
                const renderItem = (item: NavItem, label: string, nested: boolean) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  const isExpanded = sidebarExpanded[item.id];
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => handleParentClick(item.id)}
                        title={collapsed ? tl(label) : undefined}
                        aria-label={tl(label)}
                        aria-expanded={item.items ? !!isExpanded : undefined}
                        className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-[9px] text-[0.875rem] font-medium transition-all duration-150 mb-0.5
                          ${collapsed ? "lg:justify-center lg:px-0" : ""}
                          ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className={`whitespace-nowrap truncate ${collapsed ? "lg:hidden" : ""}`}>{tl(label)}</span>
                        </span>
                        {item.items && (
                          <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""} ${collapsed ? "lg:hidden" : ""}`} />
                        )}
                      </button>

                      {item.items && isExpanded && (
                        <div className={`mb-1 space-y-0.5 ${nested ? "ml-9" : "ml-3 pl-2 border-l border-border"} ${collapsed ? "lg:hidden" : ""}`}>
                          {item.items.map(sub => {
                            const isSubActive =
                              activeSection === sub.sectionId &&
                              (pendingAnchor === sub.id || (!pendingAnchor && sub.id === item.id));
                            return (
                              <button
                                key={sub.id}
                                onClick={() => handleSubItemClick(sub.sectionId, sub.id)}
                                className={`w-full text-left px-3 py-1.5 rounded-[7px] text-[0.8125rem] transition-colors
                                  ${isSubActive
                                    ? "text-primary font-medium bg-primary/8"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent font-normal"
                                  }`}
                              >
                                {tl(sub.label)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                };

                if (single) {
                  return <div key={group.group} className="mb-1">{renderItem(group.items[0], group.group, false)}</div>;
                }

                return (
                  <div key={group.group} className="mb-1">
                    <button
                      onClick={() => {
                        setOpenGroups(prev => ({ [group.group]: !prev[group.group] }));
                        setSidebarExpanded({});
                      }}
                      title={collapsed ? tl(group.group) : undefined}
                      aria-label={tl(group.group)}
                      aria-expanded={groupOpen}
                      className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-[9px] text-[0.875rem] font-medium transition-all duration-150 mb-0.5
                        ${collapsed ? "lg:justify-center lg:px-0" : ""}
                        ${groupActive && !groupOpen ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <GroupIcon className="h-4 w-4 shrink-0" />
                        <span className={`whitespace-nowrap truncate ${collapsed ? "lg:hidden" : ""}`}>{tl(group.group)}</span>
                      </span>
                      <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-transform duration-150 ${groupOpen ? "rotate-90" : ""} ${collapsed ? "lg:hidden" : ""}`} />
                    </button>
                    {groupOpen && (
                      <div className={`ml-3 pl-2 border-l border-border ${collapsed ? "lg:hidden" : ""}`}>
                        {group.items.map(item => renderItem(item, item.label, true))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </aside>
        </>

        {/* ── MAIN CONTENT ── */}
        <main className={`flex-1 lg:ml-16 min-w-0 flex flex-col transition-[margin] duration-200`}>
          {/* Section header bar */}
          <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 md:px-10 py-3">
            <nav className="max-w-5xl mx-auto w-full flex items-center gap-1.5 text-[0.8125rem]">
              <img src={logoVermelho} alt="" className="h-4 w-4 object-contain opacity-70" />
              <span className="text-muted-foreground">Dani Moscatelli</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="font-medium text-foreground">{currentLabel}</span>
            </nav>
          </div>

          <div className="px-6 md:px-10 py-10 w-full flex-1">
            <div className="max-w-5xl mx-auto w-full">
              {currentContent}
            </div>
          </div>

          <footer className="relative z-10 border-t border-border px-6 md:px-10 py-6">
            <div className="max-w-5xl mx-auto flex items-center justify-center text-center">
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                © 2026{" "}
                <a
                  href="https://www.daniellemoscatelli.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary"
                >
                  Dani Moscatelli
                </a>{" "}
                <span aria-hidden className="mx-1 text-muted-foreground/60">•</span>{" "}
                {t("Experience Design Studio. All rights reserved.", "Experience Design Studio. Todos os direitos reservados.")}
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* ── DARK MODE BG EFFECT ── */}
      {dark && (
        <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
          <div
            className="absolute top-0 right-1/4 w-[600px] h-[400px] rounded-full opacity-[0.03]"
            style={{ background: "var(--primary)", filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-[400px] h-[400px] rounded-full opacity-[0.02]"
            style={{ background: "var(--graphite-400)", filter: "blur(100px)" }}
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  );
}
