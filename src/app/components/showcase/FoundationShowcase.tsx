import React from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { Check, X } from "lucide-react";

const graphiteScale = [
  { name: "50",  var: "--graphite-50",  hex: "#EDF0F5" },
  { name: "100", var: "--graphite-100", hex: "#D6DCE6" },
  { name: "200", var: "--graphite-200", hex: "#B3BDD0" },
  { name: "300", var: "--graphite-300", hex: "#8898B0" },
  { name: "400", var: "--graphite-400", hex: "#627288" },
  { name: "500", var: "--graphite-500", hex: "#495669" },
  { name: "600", var: "--graphite-600", hex: "#374155" },
  { name: "700", var: "--graphite-700", hex: "#283043" },
  { name: "800", var: "--graphite-800", hex: "#1C2333" },
  { name: "900", var: "--graphite-900", hex: "#131A27" },
  { name: "950", var: "--graphite-950", hex: "#0D1119" },
];

const crimsonScale = [
  { name: "50",  hex: "#FDF2F2" },
  { name: "100", hex: "#F9DADA" },
  { name: "200", hex: "#F3B3B3" },
  { name: "300", hex: "#E88080" },
  { name: "400", hex: "#D44D4D" },
  { name: "500", hex: "#B82828" },
  { name: "600", hex: "#8C1B1B" },
  { name: "700", hex: "#6D1313" },
  { name: "800", hex: "#520E0E" },
  { name: "900", hex: "#3A0909" },
  { name: "950", hex: "#220505" },
];

const semanticColors = [
  { name: "Background",       token: "--background",        swatch: "bg-background",       text: "text-foreground", light: "#EDF0F5", dark: "#0D1119" },
  { name: "Surface (Card)",   token: "--card",              swatch: "bg-card",             text: "text-card-foreground", light: "#FFFFFF", dark: "rgba(19,26,39,.75)" },
  { name: "Foreground",       token: "--foreground",        swatch: "bg-foreground",       text: "text-background", light: "#131A27", dark: "#E4E9F0" },
  { name: "Muted",            token: "--muted-foreground",  swatch: "bg-muted-foreground", text: "text-background", light: "#627288", dark: "#8898B0" },
  { name: "Primary",          token: "--primary",           swatch: "bg-primary",          text: "text-primary-foreground", light: "#D44D4D", dark: "#D44D4D" },
  { name: "Border",           token: "--border",            swatch: "bg-border",           text: "text-foreground", light: "rgba(19,26,39,.09)", dark: "rgba(255,255,255,.07)" },
  { name: "Success",          token: "--success",           swatch: "bg-success",          text: "text-white", light: "#4FB57B", dark: "#22C55E" },
  { name: "Warning",          token: "--warning",           swatch: "bg-warning",          text: "text-white", light: "#E5A94E", dark: "#F5B320" },
  { name: "Error",            token: "--error",             swatch: "bg-error",            text: "text-white", light: "#D44D4D", dark: "#D44D4D" },
  { name: "Info",             token: "--info",              swatch: "bg-info",             text: "text-white", light: "#448ABC", dark: "#3B82F6" },
];

const typeScaleItems = [
  { label: "H1",          size: "text-[2.5rem]",   weight: "font-bold",     tracking: "tracking-[-0.02em]",  sample: "Heading One" },
  { label: "H2",          size: "text-[2rem]",     weight: "font-bold",     tracking: "tracking-[-0.015em]", sample: "Heading Two" },
  { label: "H3",          size: "text-[1.5rem]",   weight: "font-semibold", tracking: "tracking-[-0.01em]",  sample: "Heading Three" },
  { label: "H4",          size: "text-[1.25rem]",  weight: "font-semibold", tracking: "",                    sample: "Heading Four" },
  { label: "Subtitle L",  size: "text-[1.25rem]",  weight: "font-medium",   tracking: "",                    sample: "Section subtitle large — contextual emphasis" },
  { label: "Subtitle",    size: "text-[1.125rem]", weight: "font-medium",   tracking: "",                    sample: "Section subtitle — contextual emphasis" },
  { label: "Body Large",  size: "text-[1.125rem]", weight: "font-normal",   tracking: "",                    sample: "Large body — introductions, institutional pages and strategic copy." },
  { label: "Body",        size: "text-[1rem]",     weight: "font-normal",   tracking: "",                    sample: "Standard body text used for most content and descriptions." },
  { label: "Body Small",  size: "text-[0.875rem]", weight: "font-normal",   tracking: "",                    sample: "Small body — secondary info, cards and component copy." },
  { label: "Label",       size: "text-[0.75rem]",  weight: "font-semibold", tracking: "tracking-[0.08em]",   sample: "DISCOVERY · STRATEGY · EXPERIENCE" },
  { label: "Caption",     size: "text-[0.6875rem]",weight: "font-medium",   tracking: "tracking-[0.10em]",   sample: "CATEGORIES · DATES · METADATA · OVERLINE" },
  { label: "Button",      size: "text-[0.875rem]", weight: "font-semibold", tracking: "tracking-[-0.01em]",  sample: "Button Label" },
];

const displayScaleItems = [
  { label: "Display XL", size: "4rem",   weight: "700", tracking: "-0.03em",  sample: "DESIGN WHAT'S NEXT." },
  { label: "Display L",  size: "3rem",   weight: "700", tracking: "-0.025em", sample: "MAKE EXPERIENCE MATTER." },
  { label: "Display M",  size: "2.25rem",weight: "600", tracking: "-0.02em",  sample: "Build for change." },
  { label: "Statement",  size: "1.5rem", weight: "500", tracking: "-0.01em",  sample: "Innovation · Technology · Energy" },
];

const radiusScale = [
  { name: "XS — 6px",   value: "6px",   cls: "rounded-[6px]" },
  { name: "SM — 8px",   value: "8px",   cls: "rounded-[8px]" },
  { name: "MD — 12px",  value: "12px",  cls: "rounded-[12px]" },
  { name: "LG — 16px",  value: "16px",  cls: "rounded-[16px]" },
  { name: "XL — 24px",  value: "24px",  cls: "rounded-[24px]" },
  { name: "2XL — 32px", value: "32px",  cls: "rounded-[32px]" },
  { name: "Full",       value: "9999px",cls: "rounded-full" },
];

const spacingScale = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];

const shadowTokens = [
  { name: "shadow-xs",  label: "Subtle",    css: "0 1px 2px rgba(13,17,25,0.05)" },
  { name: "shadow-sm",  label: "Small",     css: "0 1px 3px rgba(13,17,25,0.07), 0 2px 6px rgba(13,17,25,0.05)" },
  { name: "shadow",     label: "Default",   css: "0 2px 6px rgba(13,17,25,0.07), 0 6px 20px rgba(13,17,25,0.05)" },
  { name: "shadow-md",  label: "Medium",    css: "0 4px 12px rgba(13,17,25,0.08), 0 12px 36px rgba(13,17,25,0.06)" },
  { name: "shadow-lg",  label: "Large",     css: "0 8px 24px rgba(13,17,25,0.09), 0 24px 64px rgba(13,17,25,0.07)" },
  { name: "shadow-xl",  label: "XL",        css: "0 16px 48px rgba(13,17,25,0.10), 0 40px 96px rgba(13,17,25,0.08)" },
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-4">{title}</h3>
      {children}
    </div>
  );
}

export function FoundationShowcase() {
  return (
    <div className="space-y-16">

      {/* ── COLORS ── */}
      <section id="colors">
        <SectionHeader title="Color Palette" description="A cold graphite gray system with subtle blue undertones paired with a burnt crimson accent." />

        <SubSection title="Graphite Scale">
          <div className="grid grid-cols-11 gap-1.5">
            {graphiteScale.map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5">
                <div
                  className="h-14 rounded-[8px] border border-border/40"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[0.6875rem] font-medium text-muted-foreground text-center">{c.name}</span>
                <span className="text-[0.625rem] text-muted-foreground/70 text-center font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Crimson Scale">
          <div className="grid grid-cols-11 gap-1.5">
            {crimsonScale.map((c) => (
              <div key={c.name} className="flex flex-col gap-1.5">
                <div
                  className="h-14 rounded-[8px] border border-border/40"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[0.6875rem] font-medium text-muted-foreground text-center">{c.name}</span>
                <span className="text-[0.625rem] text-muted-foreground/70 text-center font-mono">{c.hex}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection title="Semantic Tokens">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {semanticColors.map((c) => (
              <div key={c.name} className="flex flex-col gap-2">
                <div className={`h-12 rounded-[10px] border border-border/40 ${c.swatch}`} />
                <div>
                  <div className="text-[0.8125rem] font-medium text-foreground">{c.name}</div>
                  <div className="text-[0.6875rem] text-muted-foreground font-mono">{c.token}</div>
                  <div className="mt-1.5 space-y-0.5 font-mono text-[0.625rem]">
                    <div className="flex items-center justify-between gap-2 text-muted-foreground">
                      <span className="uppercase tracking-[0.08em] opacity-70">Light</span>
                      <span className="text-foreground/80">{c.light}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-muted-foreground">
                      <span className="uppercase tracking-[0.08em] opacity-70">Dark</span>
                      <span className="text-foreground/80">{c.dark}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SubSection>
      </section>

      {/* ── TYPOGRAPHY ── */}
      <section id="typography" className="space-y-10">
        <SectionHeader title="Typography" description="Three-family system with complementary roles: clarity, impact and emotion." />

        {/* ── Role overview ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              role: "PRIMARY",
              family: "Plus Jakarta Sans",
              token: "--font-sans",
              proportion: "70%",
              pillColor: "bg-primary/10 text-primary border-primary/20",
              barColor: "bg-primary",
              traits: ["Humano", "Funcional", "Claro", "Sistema"],
              uses: "Body · Headings · UI · Navigation · Buttons · Forms",
              weights: "400 · 500 · 600 · 700 · 800",
              specimen: "The quick brown fox jumps.",
              specimenStyle: { fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em" },
            },
            {
              role: "DISPLAY",
              family: "Space Grotesk",
              token: "--font-display",
              proportion: "20%",
              pillColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
              barColor: "bg-blue-500",
              traits: ["Innovation", "Impact", "Technology", "Energy"],
              uses: "Hero headlines · Campaigns · Numbers · Statements · Strategic sections",
              weights: "500 · 600 · 700",
              specimen: "MAKE IT MATTER.",
              specimenStyle: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.025em" },
            },
            {
              role: "ACCENT",
              family: "Fraunces",
              token: "--font-accent",
              proportion: "10%",
              pillColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
              barColor: "bg-amber-500",
              traits: ["Emotion", "Editorial", "Personality", "Humanity"],
              uses: "Manifestos · Quotes · Emotional statements · Editorial headings · Storytelling",
              weights: "Regular · Italic",
              specimen: "But make it human.",
              specimenStyle: { fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400, fontSize: "1.5rem" },
            },
          ].map(f => (
            <div key={f.role} className="rounded-[16px] border border-border bg-card p-5 flex flex-col gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-[5px] border text-[0.5625rem] font-bold tracking-[0.08em] ${f.pillColor}`}>{f.role}</span>
                  <p className="mt-1.5 text-[0.9375rem] font-bold text-foreground leading-tight">{f.family}</p>
                  <p className="text-[0.625rem] font-mono text-muted-foreground mt-0.5">{f.token}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[1.5rem] font-black text-foreground leading-none">{f.proportion}</p>
                  <p className="text-[0.5625rem] text-muted-foreground mt-0.5">of usage</p>
                </div>
              </div>

              {/* Proportion bar */}
              <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${f.barColor}`} style={{ width: f.proportion }} />
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-1">
                {f.traits.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-[5px] bg-muted text-[0.5625rem] font-semibold text-muted-foreground">{t}</span>
                ))}
              </div>

              {/* Specimen */}
              <div className="rounded-[10px] bg-muted/40 border border-border/60 px-4 py-3 min-h-[52px] flex items-center">
                <span style={f.specimenStyle} className="text-foreground leading-tight">{f.specimen}</span>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 text-[0.6875rem]">
                <p className="text-muted-foreground leading-relaxed"><span className="font-semibold text-foreground/70">Use in:</span> {f.uses}</p>
                <p className="text-muted-foreground"><span className="font-semibold text-foreground/70">Weights:</span> {f.weights}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Plus Jakarta Sans — escala ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-[0.8125rem] font-bold text-foreground uppercase tracking-[0.07em]">Plus Jakarta Sans — Type scale</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="bg-card rounded-[16px] border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            {typeScaleItems.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-baseline gap-6 px-6 py-4 ${i < typeScaleItems.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <div className="w-24 shrink-0">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</span>
                </div>
                <div className={`${item.size} ${item.weight} ${item.tracking} text-foreground leading-tight flex-1 min-w-0`}
                  style={{ fontFamily: "var(--font-sans)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.sample}
                </div>
                <div className="shrink-0 hidden md:flex gap-3 text-[0.6875rem] text-muted-foreground/70 font-mono">
                  <span>{item.size.replace("text-[", "").replace("]", "")}</span>
                  <span>{item.weight.replace("font-", "")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Space Grotesk — escala display ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-[0.8125rem] font-bold text-foreground uppercase tracking-[0.07em]">Space Grotesk — Display Scale</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="bg-card rounded-[16px] border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            {displayScaleItems.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-baseline gap-6 px-6 py-4 ${i < displayScaleItems.length - 1 ? "border-b border-border/60" : ""}`}
              >
                <div className="w-24 shrink-0">
                  <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{item.label}</span>
                </div>
                <div
                  className="text-foreground leading-tight flex-1 min-w-0"
                  style={{ fontFamily: "var(--font-display)", fontWeight: item.weight, fontSize: item.size, letterSpacing: item.tracking, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.sample}
                </div>
                <div className="shrink-0 hidden md:flex gap-3 text-[0.6875rem] text-muted-foreground/70 font-mono">
                  <span>{item.size}</span>
                  <span>{item.weight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fraunces — editorial specimen ── */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-[0.8125rem] font-bold text-foreground uppercase tracking-[0.07em]">Fraunces — Editorial Specimen</h3>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specimen cards */}
            <div className="bg-card rounded-[16px] border border-border p-6 space-y-5" style={{ boxShadow: "var(--shadow-xs)" }}>
              <span className="text-[0.5625rem] font-bold uppercase tracking-[0.10em] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>Italic contrast</span>
              <p className="text-foreground leading-snug" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.025em" }}>
                Design what's{" "}
                <span style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400 }}>next.</span>
              </p>
              <p className="text-[0.75rem] text-muted-foreground leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                Space Grotesk creates impact. Fraunces in italic adds emotion to the last word.
              </p>
            </div>

            <div className="bg-card rounded-[16px] border border-border p-6 space-y-5" style={{ boxShadow: "var(--shadow-xs)" }}>
              <span className="text-[0.5625rem] font-bold uppercase tracking-[0.10em] text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>Editorial statement</span>
              <div className="space-y-1">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-primary" style={{ fontFamily: "var(--font-sans)" }}>HUMAN EXPERIENCE</p>
                <p className="text-foreground leading-none" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.75rem", letterSpacing: "-0.02em" }}>MAKE IT MEANINGFUL.</p>
                <p className="text-foreground" style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400, fontSize: "1.25rem" }}>But make it human.</p>
                <p className="text-[0.8125rem] text-muted-foreground leading-relaxed pt-1" style={{ fontFamily: "var(--font-sans)" }}>
                  We turn insights into products and experiences that connect people and businesses.
                </p>
              </div>
            </div>

            {/* Rules */}
            {/* Usage rules — 4 detailed cards */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-3">

              {/* ✓ Use as an accent */}
              <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="px-4 pt-4 pb-3 border-b border-border" style={{ background: "var(--success-muted)" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "color-mix(in srgb, var(--success) 18%, transparent)" }}>
                      <Check style={{ height: 11, width: 11, color: "var(--success)" }} />
                    </div>
                    <p className="text-[0.6875rem] font-bold" style={{ color: "var(--success)" }}>Use as an accent</p>
                  </div>
                </div>
                <ul className="px-4 py-3 space-y-2.5">
                  {["Last word of a headline", "Quotes and manifestos", "Editorial statements", "Italic for contrast", "Special editorial headings"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0 bg-success opacity-70" />
                      <span className="text-[0.6875rem] text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ✕ Evitar */}
              <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="px-4 pt-4 pb-3 border-b border-border" style={{ background: "rgba(212,77,77,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(212,77,77,0.15)" }}>
                      <X style={{ height: 11, width: 11, color: "#D44D4D" }} />
                    </div>
                    <p className="text-[0.6875rem] font-bold" style={{ color: "#D44D4D" }}>Evitar</p>
                  </div>
                </div>
                <ul className="px-4 py-3 space-y-2.5">
                  {["Long interface text", "Buttons and functional labels", "Navigation and menus", "Standard body text", "Functional components"].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "#D44D4D", opacity: 0.6 }} />
                      <span className="text-[0.6875rem] text-muted-foreground leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Peso preferencial */}
              <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="px-4 pt-4 pb-3 border-b border-border bg-muted/20">
                  <p className="text-[0.6875rem] font-bold text-foreground">Peso preferencial</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {[
                    { label: "Regular 400", specimen: "Aa", italic: false, allowed: true },
                    { label: "Italic 400", specimen: "Aa", italic: true,  allowed: true },
                    { label: "Bold 700",    specimen: "Aa", italic: false, allowed: false },
                    { label: "Extra 800",   specimen: "Aa", italic: false, allowed: false },
                  ].map(w => (
                    <div key={w.label} className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-[7px] flex items-center justify-center shrink-0 ${w.allowed ? "bg-muted/50" : "bg-muted/20"}`}>
                        <span style={{
                          fontFamily: "var(--font-accent)",
                          fontStyle: w.italic ? "italic" : "normal",
                          fontWeight: w.label.includes("Bold") ? 700 : w.label.includes("Extra") ? 800 : 400,
                          fontSize: "0.9375rem",
                          color: w.allowed ? "var(--foreground)" : "var(--muted-foreground)",
                          opacity: w.allowed ? 1 : 0.4,
                        }}>{w.specimen}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[0.625rem] font-semibold leading-none ${w.allowed ? "text-foreground" : "text-muted-foreground line-through"}`}>{w.label}</p>
                        <p className="text-[0.5625rem] text-muted-foreground mt-0.5">{w.allowed ? "recommended" : "do not use"}</p>
                      </div>
                      <span className={`text-[0.5625rem] font-bold ${w.allowed ? "text-success" : "text-destructive/60"}`}>{w.allowed ? "✓" : "✕"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended proportion */}
              <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="px-4 pt-4 pb-3 border-b border-border bg-muted/20">
                  <p className="text-[0.6875rem] font-bold text-foreground">Proportion in layout</p>
                </div>
                <div className="px-4 py-3 space-y-3">
                  {/* Stacked bar */}
                  <div className="space-y-1.5">
                    <p className="text-[0.5625rem] font-semibold text-muted-foreground uppercase tracking-[0.07em]">Ideal composition</p>
                    <div className="flex h-4 w-full rounded-full overflow-hidden gap-px">
                      <div className="h-full rounded-l-full" style={{ width: "70%", background: "var(--primary)" }} />
                      <div className="h-full" style={{ width: "20%", background: "#3b82f6" }} />
                      <div className="h-full rounded-r-full" style={{ width: "10%", background: "#f59e0b" }} />
                    </div>
                    <div className="flex items-center justify-between text-[0.5rem] font-mono text-muted-foreground">
                      <span>70%</span><span>20%</span><span>10%</span>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="space-y-2">
                    {[
                      { color: "var(--primary)", label: "Plus Jakarta Sans", pct: "70%" },
                      { color: "#3b82f6",         label: "Space Grotesk",    pct: "20%" },
                      { color: "#f59e0b",          label: "Fraunces", pct: "10%" },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: l.color }} />
                        <span className="text-[0.5625rem] text-muted-foreground flex-1 leading-none">{l.label}</span>
                        <span className="text-[0.5625rem] font-bold text-foreground">{l.pct}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[0.5625rem] text-muted-foreground/60 leading-relaxed border-t border-border pt-2">
                    Fraunces appears at strategic moments — it should not dominate the interface.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SPACING ── */}
      <section id="spacing">
        <SectionHeader title="Spacing Scale" description="8-point grid system with 4px base unit. Consistent spacing creates rhythm and visual harmony." />

        <div className="space-y-3">
          {spacingScale.map((sp) => (
            <div key={sp} className="flex items-center gap-4">
              <span className="w-12 text-right text-[0.8125rem] font-mono text-muted-foreground shrink-0">{sp}px</span>
              <div
                className="bg-primary/80 rounded-[4px] h-5"
                style={{ width: `${sp * 2}px`, minWidth: "4px" }}
              />
              <span className="text-[0.75rem] text-muted-foreground/70">--space-{sp / 4}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RADIUS ── */}
      <section id="radius">
        <SectionHeader title="Border Radius" description="Modern rounded corners. Larger radii for cards and dialogs; smaller for inline elements." />

        <div className="flex flex-wrap gap-6">
          {radiusScale.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-3">
              <div
                className={`w-20 h-20 border-2 border-primary/60 bg-primary/10 ${r.cls}`}
              />
              <div className="text-center">
                <div className="text-[0.8125rem] font-medium text-foreground">{r.name.split(" — ")[0]}</div>
                <div className="text-[0.6875rem] text-muted-foreground font-mono">{r.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHADOWS ── */}
      <section id="shadows">
        <SectionHeader title="Shadow System" description="Diffused floating shadows for light mode. Ambient depth shadows for dark mode." />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {shadowTokens.map((s) => (
            <div key={s.name} className="flex flex-col gap-3">
              <div
                className="h-20 bg-card rounded-[12px]"
                style={{ boxShadow: s.css }}
              />
              <div>
                <div className="text-[0.875rem] font-medium text-foreground">{s.label}</div>
                <div className="text-[0.75rem] text-muted-foreground font-mono">--{s.name}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tokens Reference ── */}
      <section id="colors-tokens" className="space-y-5">
        <SectionHeader title="Tokens" description="All semantic CSS custom properties. Copy any token name and use it in var(--token-name)." />
        <TokenTable groups={foundationTokenGroups} />
      </section>
    </div>
  );
}

const foundationTokenGroups: TokenGroup[] = [
  {
    group: "Brand",
    tokens: [
      { name: "--primary",            description: "Brand accent — crimson",          light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-foreground", description: "Text on primary",                 light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--primary-muted",      description: "Tinted primary background",       light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
    ],
  },
  {
    group: "Background & Surface",
    tokens: [
      { name: "--background",      description: "Page background",           light: "#ECF0F5",              dark: "#0D1119",              isColor: true },
      { name: "--foreground",      description: "Primary text",              light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--muted-foreground",description: "Secondary / label text",    light: "#627288",              dark: "#8898B0",              isColor: true },
      { name: "--card",            description: "Card surface",              light: "#FFFFFF",              dark: "rgba(19,26,39,0.75)",  isColor: true },
      { name: "--card-foreground", description: "Text on card",              light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--popover",         description: "Popover / tooltip surface", light: "#FFFFFF",              dark: "rgba(19,26,39,0.95)",  isColor: true },
      { name: "--muted",           description: "Subtle background",        light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--accent",          description: "Hover background",         light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--secondary",       description: "Secondary button surface", light: "#E4E9F0",              dark: "rgba(40,48,67,0.80)", isColor: true },
    ],
  },
  {
    group: "Semantic Colors",
    tokens: [
      { name: "--success",         description: "Positive / confirmed",     light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--warning",         description: "Caution / pending",        light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--error",           description: "Error / danger",           light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--info",            description: "Informational",            light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--destructive",     description: "Destructive action",       light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--violet",          description: "Accent purple",            light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--orange",          description: "Accent orange",            light: "#fa9852", dark: "#ff8833", isColor: true },
    ],
  },
  {
    group: "Border & Ring",
    tokens: [
      { name: "--border",       description: "Default border",          light: "rgba(19,26,39,0.09)",  dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--border-strong",description: "Emphasized border",       light: "rgba(19,26,39,0.16)",  dark: "rgba(255,255,255,0.12)", isColor: true },
      { name: "--ring",         description: "Focus ring / outline",    light: "rgba(212,77,77,0.35)", dark: "rgba(212,77,77,0.40)",   isColor: true },
    ],
  },
  {
    group: "Charts",
    tokens: [
      { name: "--chart-1", description: "Series 1 — crimson",  light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--chart-2", description: "Series 2 — graphite", light: "#495669", dark: "#627288", isColor: true },
      { name: "--chart-3", description: "Series 3",            light: "#8898B0", dark: "#495669", isColor: true },
      { name: "--chart-4", description: "Series 4",            light: "#B3BDD0", dark: "#374155", isColor: true },
      { name: "--chart-5", description: "Series 5",            light: "#D6DCE6", dark: "#283043", isColor: true },
    ],
  },
  {
    group: "Shape",
    tokens: [
      { name: "--radius",    description: "Base border radius",    light: "0.75rem",                   dark: undefined },
      { name: "--radius-sm", description: "Small radius (card)",   light: "calc(0.75rem - 4px)",        dark: undefined },
      { name: "--radius-md", description: "Medium radius",         light: "0.75rem",                   dark: undefined },
      { name: "--radius-lg", description: "Large radius (dialog)", light: "calc(0.75rem + 4px)",        dark: undefined },
      { name: "--radius-xl", description: "XL radius (hero card)", light: "calc(0.75rem + 12px)",       dark: undefined },
    ],
  },
  {
    group: "Elevation",
    tokens: [
      { name: "--shadow-xs", description: "Surface lift (inputs)",  light: "0 1px 2px …",             dark: "0 1px 2px (darker)" },
      { name: "--shadow-sm", description: "Cards, dropdowns",       light: "0 1px 3px …",             dark: "0 1px 3px (darker)" },
      { name: "--shadow",    description: "Default elevation",      light: "0 2px 6px …",             dark: "0 2px 8px (darker)" },
      { name: "--shadow-md", description: "Popover, modals",       light: "0 4px 12px …",            dark: "0 4px 16px (darker)" },
      { name: "--shadow-lg", description: "Large panel",           light: "0 8px 24px …",            dark: "0 8px 32px (darker)" },
      { name: "--shadow-xl", description: "Full-page overlays",    light: "0 16px 48px …",           dark: "0 16px 64px (darker)" },
    ],
  },
  {
    group: "Typography — Font Families",
    tokens: [
      { name: "--font-sans",    description: "PRIMARY — Plus Jakarta Sans (70%)",   light: "Plus Jakarta Sans" },
      { name: "--font-display", description: "DISPLAY — Space Grotesk (20%)",       light: "Space Grotesk" },
      { name: "--font-accent",  description: "ACCENT — Fraunces (10%)",     light: "Fraunces" },
      { name: "--font-mono",    description: "Code — JetBrains Mono",               light: "JetBrains Mono" },
    ],
  },
  {
    group: "Typography — Weights",
    tokens: [
      { name: "--font-weight-normal",   description: "Regular — body text",           light: "400" },
      { name: "--font-weight-medium",   description: "Medium — subtitles, controls",  light: "500" },
      { name: "--font-weight-semibold", description: "SemiBold — headings, nav",      light: "600" },
      { name: "--font-weight-bold",     description: "Bold — titles, impact",         light: "700" },
      { name: "800",                    description: "ExtraBold — display (Jakarta)",  light: "800" },
    ],
  },
];
