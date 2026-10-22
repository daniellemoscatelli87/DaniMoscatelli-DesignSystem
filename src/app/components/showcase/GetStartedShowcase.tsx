import React from "react";
import {
  ArrowRight, BookOpen, Compass, Palette, Code2, Fingerprint, Layers, Coins,
  Component, Type, PenTool, SunMoon, Braces, ArrowLeftRight, FileCode2,
  Image, LayoutTemplate, Link as LinkIcon, Check,
} from "lucide-react";

export type Navigate = (id: string, anchor?: string) => void;

export type Target = { page?: string; anchor?: string; scroll?: string };

export type CardItem = {
  icon: React.ElementType;
  title: string;
  desc: string;
  target: Target;
};

const display = "font-[family-name:var(--font-display)]";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3">
      {children}
    </p>
  );
}

export function NavCard({
  item, onGo, compact = false,
}: { item: CardItem; onGo: (t: Target) => void; compact?: boolean }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onGo(item.target)}
      className={`group flex flex-col text-left h-full bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] transition-all duration-150 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <Icon className="h-5 w-5 text-primary mb-4 shrink-0" strokeWidth={1.75} />
      <h3 className={`${display} text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground mb-1.5`}>
        {item.title}
      </h3>
      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground mb-5">{item.desc}</p>
      <ArrowRight
        className="mt-auto self-end h-4 w-4 text-muted-foreground transition-all duration-150 group-hover:text-primary group-hover:translate-x-0.5"
        aria-hidden
      />
    </button>
  );
}

export function CardGrid({
  items, onGo, cols = "lg:grid-cols-3", compact,
}: { items: CardItem[]; onGo: (t: Target) => void; cols?: string; compact?: boolean }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-3`}>
      {items.map(i => (
        <NavCard key={i.title} item={i} onGo={onGo} compact={compact} />
      ))}
    </div>
  );
}

export function PageHeader({
  eyebrow, title, description,
}: { eyebrow: string; title: string; description: string }) {
  return (
    <header>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-primary mb-3">{eyebrow}</p>
      <h1 className={`${display} text-[2.5rem] tracking-[-0.035em] leading-none text-foreground mb-4`}>{title}</h1>
      <p className="text-[1.0625rem] text-muted-foreground max-w-2xl leading-relaxed">{description}</p>
    </header>
  );
}

export function CopyLinkButton({ id }: { id: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <span className="relative inline-flex group/link">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy link"
        className="h-7 w-7 rounded-[var(--radius)] inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <LinkIcon className="h-3.5 w-3.5" />}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap rounded-[6px] bg-foreground px-2 py-1 text-[0.6875rem] font-medium text-background opacity-0 group-hover/link:opacity-100 group-focus-within/link:opacity-100 transition-opacity z-10"
      >
        {copied ? "Copied" : "Copy link"}
      </span>
    </span>
  );
}

export function PageSection({
  id, label, title, children, intro,
}: { id: string; label: string; title: string; intro: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex items-center gap-2 mb-3">
        <h2 className={`${display} text-[1.5rem] tracking-[-0.02em] text-foreground`}>{title}</h2>
        <CopyLinkButton id={id} />
      </div>
      <div className="space-y-3 max-w-2xl mb-6 text-[0.9375rem] leading-relaxed text-muted-foreground">{intro}</div>
      {children}
    </section>
  );
}

const quickLinks: CardItem[] = [
  { icon: BookOpen, title: "What's this design system?", desc: "Learn what the system is and who it is for.", target: { scroll: "gs-overview" } },
  { icon: Compass, title: "Using the system", desc: "Get to know how the system is organized.", target: { scroll: "gs-structure" } },
  { icon: Palette, title: "Design", desc: "Start applying color, type, tokens and templates.", target: { scroll: "gs-design" } },
  { icon: Code2, title: "Develop", desc: "Implement the system with React, Tailwind CSS and design tokens.", target: { page: "develop" } },
  { icon: Fingerprint, title: "Brand Identity", desc: "Logo versions, symbol, palette and usage rules.", target: { page: "brand" } },
];

const overview: CardItem[] = [
  { icon: Layers, title: "Foundations", desc: "Color, typography, spacing, radius and shadows: the raw material of every screen.", target: { page: "colors" } },
  { icon: Coins, title: "Design tokens", desc: "Three layers — primitives, semantics and component — that keep Figma and CSS aligned.", target: { page: "tokens" } },
  { icon: Component, title: "Components", desc: "Buttons, data display, feedback, labels, icons and overlays, ready to use.", target: { page: "buttons" } },
];

const structure: CardItem[] = [
  { icon: Fingerprint, title: "Brand", desc: "Logo versions, symbol, brand palette, institutional typography and usage rules.", target: { page: "brand" } },
  { icon: Layers, title: "Foundation", desc: "Color Palette, Typography, Spacing, Radius, Shadows and Tokens.", target: { page: "colors" } },
  { icon: Coins, title: "Concepts", desc: "What tokens are, the three layers, the guide for designers, AI and tokens, and the Design ↔ Dev mapping.", target: { page: "tokens" } },
  { icon: Image, title: "Styles", desc: "Backgrounds and Motion Design to bring surfaces and interactions to life.", target: { page: "backgrounds" } },
  { icon: LayoutTemplate, title: "Components & Templates", desc: "Buttons, Data Display, Feedback, Labels, Icons, Overlays and ready-made templates.", target: { page: "templates" } },
];

const design: CardItem[] = [
  { icon: Type, title: "Color & typography", desc: "Crimson and Graphite palettes, Plus Jakarta Sans and Space Grotesk.", target: { page: "colors", anchor: "colors" } },
  { icon: PenTool, title: "Guide for designers", desc: "Step by step to create Figma Variables that translate directly to code.", target: { page: "tokens", anchor: "tokens-design" } },
  { icon: SunMoon, title: "Light & dark mode", desc: "Each theme is just a different set of values for the same token names.", target: { page: "colors", anchor: "colors-tokens" } },
];

const develop: CardItem[] = [
  { icon: Braces, title: "Web — React + Tailwind CSS", desc: "Semantic Tailwind classes connected to the token files.", target: { page: "develop" } },
  { icon: ArrowLeftRight, title: "Design ↔ Dev Mapping", desc: "Intent, Figma name, CSS property and Tailwind class for every token.", target: { page: "tokens", anchor: "tokens-bridge" } },
  { icon: FileCode2, title: "Implementation in code", desc: "Anatomy of theme.css and index.css in this design system.", target: { page: "tokens", anchor: "tokens-definition" } },
];

export function useGo(onNavigate: Navigate) {
  return (t: Target) => {
    if (t.scroll) {
      document.getElementById(t.scroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (t.page) {
      onNavigate(t.page, t.anchor);
    }
  };
}

export function GetStartedShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);

  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow="Start"
        title="Get Started"
        description="Get to know the Dani Moscatelli Design System — from brand and foundations to reusable components and the tokens that connect design and code."
      />

      <CardGrid items={quickLinks} onGo={go} cols="lg:grid-cols-5" compact />

      <PageSection
        id="gs-overview"
        label="Overview"
        title="What's the Dani Moscatelli Design System?"
        intro={
          <>
            <p>
              The Dani Moscatelli Design System is a premium, scalable design system with dark and light
              modes, tailored for modern SaaS dashboards — built to enhance usability and enterprise aesthetics.
            </p>
            <p>
              It is the shared language between design and development: every visual decision gets a name,
              and that name is the same in Figma and in code. Change a token once and the whole interface
              updates — in light mode, dark mode, or any future theme.
            </p>
          </>
        }
      >
        <CardGrid items={overview} onGo={go} />
      </PageSection>

      <PageSection
        id="gs-structure"
        label="Structure"
        title="Using the system"
        intro={
          <p>
            The design system is organized in five main parts. Each one includes guidance, rules and the
            tokens that support it.
          </p>
        }
      >
        <CardGrid items={structure} onGo={go} />
      </PageSection>

      <PageSection
        id="gs-design"
        label="Design"
        title="Design"
        intro={
          <p>Guidance, rules and tools to go from Figma to finished product without ambiguity or rework.</p>
        }
      >
        <CardGrid items={design} onGo={go} />
      </PageSection>

      <PageSection
        id="gs-develop"
        label="Develop"
        title="Develop"
        intro={<p>Implementation resources: token files, Tailwind mapping and the Design ↔ Dev reference.</p>}
      >
        <CardGrid items={develop} onGo={go} />
      </PageSection>

      <p className="pt-6 border-t border-border text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        Version 1.0 · 2024
      </p>
    </div>
  );
}

