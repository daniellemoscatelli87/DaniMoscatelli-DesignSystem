import React, { useState, useEffect, useRef } from "react";
import logoVermelho from "../imports/LogoVermelho.png";
import logoIconRed from "../imports/IconeLogo-red.png";
import {
  Sun, Moon, Palette, Type, Layers, MousePointer2,
  BarChart2, Bell, Grid3X3,
  ChevronRight, Zap,
  TableProperties, Box,
  Search, Shapes, LayoutTemplate, Wind, Image, Fingerprint, Coins,
} from "lucide-react";
import { FoundationShowcase } from "./components/showcase/FoundationShowcase";
import { FormShowcase } from "./components/showcase/FormShowcase";
import { DataShowcase } from "./components/showcase/DataShowcase";
import { FeedbackShowcase } from "./components/showcase/FeedbackShowcase";
import { OverlaysShowcase } from "./components/showcase/OverlaysShowcase";
import { IconsShowcase } from "./components/showcase/IconsShowcase";
import { TemplatesShowcase } from "./components/showcase/TemplatesShowcase";
import { PostsShowcase } from "./components/showcase/PostsShowcase";
import { MotionShowcase } from "./components/showcase/MotionShowcase";
import { BackgroundsShowcase } from "./components/showcase/BackgroundsShowcase";
import { BrandShowcase } from "./components/showcase/BrandShowcase";
import { TokensShowcase } from "./components/showcase/TokensShowcase";
import { IntegrationShowcase } from "./components/showcase/IntegrationShowcase";

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
    group: "Conceitos",
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
      { id: "icons", label: "Ícones", icon: Shapes,
        items: [
          { id: "icon-sizes",   label: "Tamanhos & Cores", sectionId: "icons" },
          { id: "icon-library", label: "Biblioteca",       sectionId: "icons" },
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

/* ── Overview hero ── */
const highlights = [
  { icon: Palette,      label: "Design Tokens",    desc: "Semantic color, radius, shadow, and typography tokens for both modes." },
  { icon: Type,         label: "Plus Jakarta Sans", desc: "Modern rounded geometric sans-serif for maximum legibility." },
  { icon: Layers,       label: "Glassmorphism",     desc: "Dark mode surface treatment with backdrop blur and ambient shadows." },
  { icon: Zap,          label: "Radix UI",          desc: "Accessible interactive primitives with full keyboard support." },
  { icon: BarChart2,    label: "Charts",            desc: "Minimal Recharts integration with crimson highlights." },
  { icon: Grid3X3,      label: "8pt Grid",          desc: "Consistent 4px base grid creating visual rhythm and alignment." },
];

function OverviewSection() {
  return (
    <section id="overview" className="space-y-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[24px] border border-border p-10 bg-card" style={{ boxShadow: "var(--shadow-lg)" }}>
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chart-2/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative flex items-start gap-8">
          <img
            src={logoVermelho}
            alt="Dani Moscatelli"
            className="hidden sm:block h-24 w-24 object-contain shrink-0 opacity-90"
          />
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <span aria-hidden className="h-px w-6 bg-primary translate-y-[-0.35em]" />
              <span className="text-[1.75rem] leading-none text-foreground font-semibold tracking-[-0.03em]">
                Design System
              </span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground font-[family-name:var(--font-sans)]">
                v1.0
              </span>
            </div>
            <h1 className="text-[2.5rem] tracking-[-0.035em] text-foreground mb-3 leading-none">
              Dani<br />
              <span style={{ color: "var(--primary)" }}>Moscatelli</span>
            </h1>
            <p className="text-[1.0625rem] text-muted-foreground max-w-lg leading-relaxed mb-6">
              Premium design system built on cool graphite with a burnt crimson accent.
              Optimized for modern SaaS dashboards and enterprise applications.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "40+ Components", color: "bg-primary/12 text-primary" },
                { label: "Dark & Light Mode", color: "bg-muted text-foreground" },
                { label: "Fully Accessible", color: "bg-muted text-foreground" },
                { label: "Radix UI Primitives", color: "bg-muted text-foreground" },
              ].map(tag => (
                <span key={tag.label} className={`inline-flex items-center px-3 py-1 rounded-full text-[0.8125rem] font-medium ${tag.color}`}>
                  {tag.label}
                </span>
              ))}
            </div>
          </div>{/* end content col */}
        </div>{/* end flex row */}
      </div>{/* end hero card */}

      {/* Principles */}
      <div>
        <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4">Design Principles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {highlights.map(h => {
            const Icon = h.icon;
            return (
              <div key={h.label} className="flex gap-4 p-4 rounded-[14px] bg-card border border-border hover:border-[var(--border-strong)] transition-colors" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="h-9 w-9 rounded-[10px] bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4.5 w-4.5 text-muted-foreground" style={{ height: "18px", width: "18px" }} />
                </div>
                <div>
                  <div className="text-[0.9rem] font-semibold text-foreground mb-0.5">{h.label}</div>
                  <div className="text-[0.8125rem] text-muted-foreground leading-snug">{h.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color preview strip */}
      <div>
        <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4">Palette Preview</h2>
        <div className="flex rounded-[16px] overflow-hidden h-16 border border-border/40" style={{ boxShadow: "var(--shadow-sm)" }}>
          {[
            "#EDF0F5","#D6DCE6","#B3BDD0","#8898B0","#627288",
            "#495669","#374155","#283043","#1C2333","#131A27","#0D1119",
          ].map(c => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
          <div className="w-px bg-background/20" />
          {[
            "#FDF2F2","#F9DADA","#F3B3B3","#E88080","#D44D4D",
            "#B82828","#8C1B1B","#6D1313","#520E0E","#3A0909","#220505",
          ].map(c => (
            <div key={c} className="flex-1" style={{ backgroundColor: c }} />
          ))}
        </div>
        <div className="flex justify-between text-[0.6875rem] text-muted-foreground mt-2 px-1">
          <span>Graphite Scale — 50 → 950</span>
          <span>Crimson Scale — 50 → 950</span>
        </div>
      </div>
    </section>
  );
}

const sectionComponents: Record<string, React.ReactNode> = {
  overview:  <OverviewSection />,
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
  posts:       <PostsShowcase />,
};

const sectionLabels: Record<string, string> = {
  overview:  "Home",
  brand:     "Brand Identity",
  colors:    "Foundation",
  buttons:   "Form Controls",
  data:      "Data Display",
  feedback:  "Feedback & Status",
  badges:    "Labels & Patterns",
  icons:     "Ícones",
  overlays:  "Overlays & Navigation",
  motion:      "Motion Design",
  backgrounds: "Backgrounds",
  templates:   "Templates",
  posts:       "Posts & Carrosseis",
};

export default function App() {
  const [dark, setDark] = useState(true);
  const [activeSection, setActiveSection] = useState("brand");
  const [sidebarExpanded, setSidebarExpanded] = useState<Record<string, boolean>>({
    brand:     false,
    templates: false,
    colors:    true,
    buttons:   false,
    data:      false,
    feedback:  false,
    badges:    false,
    icons:     false,
    overlays:  false,
    motion:      false,
    backgrounds: false,
    posts:       false,
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    setSidebarExpanded(prev => ({ ...prev, [id]: !prev[id] }));
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

  const currentContent = sectionComponents[activeSection];
  const currentLabel = sectionLabels[activeSection];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── TOP NAV ── */}
      <header className="fixed top-0 inset-x-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3" style={{ boxShadow: "var(--shadow-sm)" }}>
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
          onClick={() => setMobileSidebarOpen(v => !v)}
        >
          <svg style={{ height: "18px", width: "18px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>

        {/* Logo + wordmark */}
        <style>{`
          @keyframes ds-shimmer {
            0%   { background-position: -300% center; }
            100% { background-position: 300% center; }
          }
          .ds-shimmer {
            background: linear-gradient(
              90deg,
              #627288 0%,
              #8898B0 25%,
              #C8D2E0 50%,
              #8898B0 75%,
              #627288 100%
            );
            background-size: 300% auto;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: ds-shimmer 5.5s linear infinite;
          }
        `}</style>
        <div className="flex items-center gap-2.5 min-w-0">
          <img src={logoIconRed} alt="" className="h-[34px] w-[34px] object-contain shrink-0" />
          <div className="flex items-center gap-0">
            <span
              className="text-[1.0625rem] font-semibold tracking-tight whitespace-nowrap"
              style={{ fontFamily: "var(--font-sans)", color: "#ffffff" }}
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
        </div>

        <div className="flex-1" />

        {/* Search hint */}
        <button className="hidden md:flex items-center gap-2 h-7 px-3 rounded-[8px] border border-border bg-background/60 text-muted-foreground text-[0.75rem] hover:border-[var(--border-strong)] hover:bg-background transition-colors">
          <Search className="h-3 w-3" />
          <span>Search</span>
          <kbd className="ml-1.5 px-1 py-0.5 text-[0.5625rem] rounded-[3px] bg-muted font-medium border border-border tracking-wide">⌘K</kbd>
        </button>

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
            <span className="hidden sm:inline">Light</span>
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
            <span className="hidden sm:inline">Dark</span>
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
            className={`fixed top-16 bottom-0 z-30 w-60 border-r border-border overflow-y-auto bg-sidebar transition-transform duration-200
              ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
          >
            <div className="py-4 px-3">
              {navGroups.map(group => (
                <div key={group.group} className="mb-5">
                  {group.group && (
                    <p className="px-3 mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {group.group}
                    </p>
                  )}
                  {group.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    const isExpanded = sidebarExpanded[item.id];
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => handleParentClick(item.id)}
                          className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-[9px] text-[0.875rem] font-medium transition-all duration-150 mb-0.5
                            ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                        >
                          <span className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4 shrink-0" />
                            {item.label}
                          </span>
                          {item.items && (
                            <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`} />
                          )}
                        </button>

                        {item.items && isExpanded && (
                          <div className="ml-9 mb-1 space-y-0.5">
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
                                  {sub.label}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Mode toggle in sidebar */}
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setDark(d => !d)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[0.875rem] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {dark ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </div>
          </aside>
        </>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 lg:ml-60 min-w-0">
          {/* Section header bar */}
          <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl border-b border-border px-6 md:px-10 py-3 flex items-center gap-2">
            <nav className="flex items-center gap-1.5 text-[0.8125rem]">
              <img src={logoVermelho} alt="" className="h-4 w-4 object-contain opacity-70" />
              <span className="text-muted-foreground">Dani Moscatelli</span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="font-medium text-foreground">{currentLabel}</span>
            </nav>
          </div>

          <div className="px-6 md:px-10 py-10 max-w-5xl mx-auto">
            {currentContent}
          </div>
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
