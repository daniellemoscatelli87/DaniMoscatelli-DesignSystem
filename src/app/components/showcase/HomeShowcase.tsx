import React from "react";
import { ChevronRight, Sparkles, Fingerprint, Layers, Coins, Compass, Accessibility, Image, Wind, LayoutTemplate, Component, Plug, Rocket, Lightbulb, Code2 } from "lucide-react";
import logoVermelho from "../../../imports/LogoVermelho.png";
import { SectionLabel, CardGrid, useGo, type Navigate, type CardItem } from "./GetStartedShowcase";
import { changelog, type ChangeKind } from "./shared/changelog";

const display = "font-[family-name:var(--font-display)]";

const kindStyle: Record<ChangeKind, string> = {
  New: "bg-primary/12 text-primary border-primary/25",
  Updated: "bg-muted text-foreground border-border",
  Removed: "bg-transparent text-muted-foreground border-border border-dashed",
};

const explore: { label: string; items: CardItem[] }[] = [
  {
    label: "Start",
    items: [
      { icon: Rocket, title: "Get Started", desc: "What the system is, how it is organized and where to begin.", target: { page: "get-started" } },
      { icon: Lightbulb, title: "Design Principles", desc: "The decisions behind every screen, told as a timeline.", target: { page: "principles" } },
      { icon: Code2, title: "Develop", desc: "React, Tailwind v4 and the token files, ready to hand to your AI tool.", target: { page: "develop" } },
    ],
  },
  {
    label: "Identity and foundations",
    items: [
      { icon: Fingerprint, title: "Brand Identity", desc: "Logo versions, symbol, palette and clear space.", target: { page: "brand" } },
      { icon: Layers, title: "Foundation", desc: "Color, type, spacing, radius and shadows in both modes.", target: { page: "colors" } },
      { icon: Coins, title: "Design Tokens", desc: "Primitives, semantics and components, and how AI reads them.", target: { page: "tokens" } },
      { icon: Plug, title: "Integration", desc: "Connect the system to Claude, Cursor, Bolt and Lovable.", target: { page: "integration" } },
    ],
  },
  {
    label: "Guidelines",
    items: [
      { icon: Compass, title: "Usability", desc: "Hierarchy, target size, states and microcopy.", target: { page: "usability" } },
      { icon: Accessibility, title: "Accessibility", desc: "Contrast, focus, keyboard and ARIA, with a checklist.", target: { page: "accessibility" } },
    ],
  },
  {
    label: "Styles, components and templates",
    items: [
      { icon: Image, title: "Backgrounds", desc: "Animated surfaces: gradients, canvas reveal, vortex and lines.", target: { page: "backgrounds" } },
      { icon: Wind, title: "Motion Design", desc: "Presets, easing, spring physics and motion tokens.", target: { page: "motion" } },
      { icon: Component, title: "Components", desc: "Buttons, data display, feedback, labels, icons and overlays.", target: { page: "buttons" } },
      { icon: LayoutTemplate, title: "Templates", desc: "Dashboard, auth, pricing, landing page and more.", target: { page: "templates" } },
    ],
  },
];

const graphite = ["#EDF0F5","#D6DCE6","#B3BDD0","#8898B0","#627288","#495669","#374155","#283043","#1C2333","#131A27","#0D1119"];
const crimson = ["#FDF2F2","#F9DADA","#F3B3B3","#E88080","#D44D4D","#B82828","#8C1B1B","#6D1313","#520E0E","#3A0909","#220505"];

export function HomeShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);
  const latest = changelog[0];

  return (
    <div className="space-y-14">
      <div className="relative overflow-hidden rounded-[24px] border border-border p-6 sm:p-10 bg-card shadow-[var(--shadow-lg)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative flex items-start gap-8">
          <img src={logoVermelho} alt="" className="hidden sm:block h-24 w-24 object-contain shrink-0 opacity-90" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/12 text-primary border border-primary/25 text-[0.75rem] font-semibold uppercase tracking-[0.08em]">
                Design System
              </span>
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">v1.0</span>
            </div>
            <h1 className={`${display} text-[2rem] sm:text-[2.5rem] tracking-[-0.035em] text-foreground mb-3 leading-none`}>
              Dani Moscatelli
            </h1>
            <p className="text-[1.0625rem] text-muted-foreground max-w-xl leading-relaxed mb-6">
              A design system for vibe coders. Named tokens, accessible components and clear guidelines,
              so Claude, Cursor, Bolt and Lovable build interfaces that look and behave like yours.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                onClick={() => onNavigate("get-started")}
                className="group inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-[0.875rem] font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Get started
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => go({ scroll: "whats-new" })}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-[0.875rem] font-medium text-foreground hover:border-[var(--border-strong)] hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                What's new
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Tailwind v4 tokens", "Dark and light mode", "Radix UI primitives", "Usability and a11y guidelines"].map((t, i) => (
                <span key={t} className={`inline-flex items-center px-3 py-1 rounded-full text-[0.8125rem] font-medium ${i === 0 ? "bg-primary/12 text-primary" : "bg-muted text-foreground"}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="whats-new" className="scroll-mt-32">
        <SectionLabel>Changelog</SectionLabel>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h2 className={`${display} text-[1.5rem] tracking-[-0.02em] text-foreground`}>What's New</h2>
          <p className="text-[0.8125rem] text-muted-foreground">Latest: {latest.title} · {latest.date}</p>
        </div>
        <p className="max-w-2xl mb-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Every addition, change and removal in the design system, newest first.
        </p>
        <ol className="relative border-l border-border ml-1.5 space-y-3">
          {changelog.map((e, i) => {
            const Tag = e.page ? "button" : "div";
            return (
              <li key={e.title} className="relative pl-6">
                <span
                  aria-hidden
                  className={`absolute -left-[5px] top-5 h-2.5 w-2.5 rounded-full border-2 border-background ${i === 0 ? "bg-primary" : "bg-border"}`}
                />
                <Tag
                  {...(e.page ? { type: "button" as const, onClick: () => onNavigate(e.page!, e.anchor) } : {})}
                  className={`group w-full text-left flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-4 rounded-[var(--radius)] bg-card border border-border shadow-[var(--shadow-xs)] ${
                    e.page ? "transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" : ""
                  }`}
                >
                  <span className={`shrink-0 self-start inline-flex items-center px-2 py-0.5 rounded-full border text-[0.6875rem] font-semibold uppercase tracking-[0.06em] sm:mt-0.5 ${kindStyle[e.kind]}`}>
                    {e.kind}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`${display} block text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground mb-0.5`}>{e.title}</span>
                    <span className="block text-[0.8125rem] leading-relaxed text-muted-foreground">{e.desc}</span>
                  </span>
                  <span className="shrink-0 text-[0.75rem] text-muted-foreground sm:mt-0.5">{e.date}</span>
                </Tag>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="home-explore" className="scroll-mt-32 space-y-8">
        <div>
          <SectionLabel>Explore</SectionLabel>
          <h2 className={`${display} text-[1.5rem] tracking-[-0.02em] text-foreground`}>Everything in the system</h2>
        </div>
        {explore.map(g => (
          <div key={g.label}>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3">{g.label}</p>
            <CardGrid items={g.items} onGo={go} cols={g.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} compact />
          </div>
        ))}
      </section>

      <section>
        <SectionLabel>Palette preview</SectionLabel>
        <div className="flex rounded-[16px] overflow-hidden h-16 border border-border/40 shadow-[var(--shadow-sm)]" role="img" aria-label="Graphite and Crimson scales, 50 to 950">
          {graphite.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
          <div className="w-px bg-background/20" />
          {crimson.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
        </div>
        <div className="flex justify-between text-[0.6875rem] text-muted-foreground mt-2 px-1">
          <span>Graphite scale, 50 to 950</span>
          <span>Crimson scale, 50 to 950</span>
        </div>
      </section>
    </div>
  );
}
