import React from "react";
import { ChevronRight, Sparkles, Fingerprint, Layers, Coins, Compass, Accessibility, Image, Wind, LayoutTemplate, Component, Plug, Rocket, Lightbulb, Code2 } from "lucide-react";
import { useI18n, type Bi } from "../../i18n";
import logoVermelho from "../../../imports/LogoVermelho.png";
import { SectionLabel, CardGrid, useGo, type Navigate, type CardItem } from "./GetStartedShowcase";
import { changelog, type ChangeKind } from "./shared/changelog";

const display = "font-[family-name:var(--font-display)]";

const kindStyle: Record<ChangeKind, string> = {
  New: "bg-primary/12 text-primary border-primary/25",
  Updated: "bg-muted text-foreground border-border",
  Removed: "bg-transparent text-muted-foreground border-border border-dashed",
};

const explore: { label: Bi; items: CardItem[] }[] = [
  {
    label: { en: "Start", pt: "Início" },
    items: [
      { icon: Rocket, title: { en: "Get Started", pt: "Primeiros passos" }, desc: { en: "What the system is, how it is organized and where to begin.", pt: "O que é o sistema, como ele é organizado e por onde começar." }, target: { page: "get-started" } },
      { icon: Lightbulb, title: { en: "Design Principles", pt: "Princípios de Design" }, desc: { en: "The decisions behind every screen, told as a timeline.", pt: "As decisões por trás de cada tela, contadas em uma linha do tempo." }, target: { page: "principles" } },
      { icon: Code2, title: { en: "Develop", pt: "Desenvolvimento" }, desc: { en: "React, Tailwind v4 and the token files, ready to hand to your AI tool.", pt: "React, Tailwind v4 e os arquivos de tokens, prontos para passar à sua ferramenta de IA." }, target: { page: "develop" } },
    ],
  },
  {
    label: { en: "Identity and foundations", pt: "Identidade e fundamentos" },
    items: [
      { icon: Fingerprint, title: { en: "Brand Identity", pt: "Identidade de Marca" }, desc: { en: "Logo versions, symbol, palette and clear space.", pt: "Versões do logo, símbolo, paleta e área de respiro." }, target: { page: "brand" } },
      { icon: Layers, title: { en: "Foundation", pt: "Fundação" }, desc: { en: "Color, type, spacing, radius and shadows in both modes.", pt: "Cor, tipografia, espaçamento, raio e sombras nos dois modos." }, target: { page: "colors" } },
      { icon: Coins, title: { en: "Design Tokens", pt: "Design Tokens" }, desc: { en: "Primitives, semantics and components, and how AI reads them.", pt: "Primitivos, semânticos e de componente, e como a IA os lê." }, target: { page: "tokens" } },
      { icon: Plug, title: { en: "Integration", pt: "Integração" }, desc: { en: "Connect the system to Claude, Cursor, Bolt and Lovable.", pt: "Conecte o sistema ao Claude, Cursor, Bolt e Lovable." }, target: { page: "integration" } },
    ],
  },
  {
    label: { en: "Guidelines", pt: "Diretrizes" },
    items: [
      { icon: Compass, title: { en: "Usability", pt: "Usabilidade" }, desc: { en: "Hierarchy, target size, states and microcopy.", pt: "Hierarquia, tamanho de alvo, estados e microcopy." }, target: { page: "usability" } },
      { icon: Accessibility, title: { en: "Accessibility", pt: "Acessibilidade" }, desc: { en: "Contrast, focus, keyboard and ARIA, with a checklist.", pt: "Contraste, foco, teclado e ARIA, com um checklist." }, target: { page: "accessibility" } },
    ],
  },
  {
    label: { en: "Styles, components and templates", pt: "Estilos, componentes e templates" },
    items: [
      { icon: Image, title: { en: "Backgrounds", pt: "Backgrounds" }, desc: { en: "Animated surfaces: gradients, canvas reveal, vortex and lines.", pt: "Superfícies animadas: gradientes, canvas reveal, vortex e linhas." }, target: { page: "backgrounds" } },
      { icon: Wind, title: { en: "Motion Design", pt: "Motion Design" }, desc: { en: "Presets, easing, spring physics and motion tokens.", pt: "Presets, easing, física de spring e tokens de movimento." }, target: { page: "motion" } },
      { icon: Component, title: { en: "Components", pt: "Componentes" }, desc: { en: "Buttons, data display, feedback, labels, icons and overlays.", pt: "Botões, exibição de dados, feedback, labels, ícones e overlays." }, target: { page: "buttons" } },
      { icon: LayoutTemplate, title: { en: "Templates", pt: "Templates" }, desc: { en: "Dashboard, auth, pricing, landing page and more.", pt: "Dashboard, login, preços, landing page e mais." }, target: { page: "templates" } },
    ],
  },
];

const graphite = ["#EDF0F5","#D6DCE6","#B3BDD0","#8898B0","#627288","#495669","#374155","#283043","#1C2333","#131A27","#0D1119"];
const crimson = ["#FDF2F2","#F9DADA","#F3B3B3","#E88080","#D44D4D","#B82828","#8C1B1B","#6D1313","#520E0E","#3A0909","#220505"];

export function HomeShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);
  const { t, bi, lang } = useI18n();
  const kindPt: Record<ChangeKind, string> = { New: "Novo", Updated: "Atualizado", Removed: "Removido" };
  const monthPt: Record<string, string> = { Jan: "Jan", Feb: "Fev", Mar: "Mar", Apr: "Abr", May: "Mai", Jun: "Jun", Jul: "Jul", Aug: "Ago", Sep: "Set", Oct: "Out", Nov: "Nov", Dec: "Dez" };
  const fmtDate = (d: string) => (lang === "pt" ? d.replace(/^[A-Za-z]{3}/, m => monthPt[m] ?? m) : d);
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
              {t(
                "A design system for vibe coders. Named tokens, accessible components and clear guidelines, so Claude, Cursor, Bolt and Lovable build interfaces that look and behave like yours.",
                "Um design system para vibe coders. Tokens nomeados, componentes acessíveis e diretrizes claras, para que Claude, Cursor, Bolt e Lovable criem interfaces com a cara e o comportamento das suas."
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <button
                onClick={() => onNavigate("get-started")}
                className="group inline-flex items-center gap-2 h-10 px-5 rounded-full bg-primary text-primary-foreground text-[0.875rem] font-semibold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                {t("Get started", "Começar")}
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => go({ scroll: "whats-new" })}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border text-[0.875rem] font-medium text-foreground hover:border-[var(--border-strong)] hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                {t("What's new", "Novidades")}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { en: "Tailwind v4 tokens", pt: "Tokens Tailwind v4" },
                { en: "Dark and light mode", pt: "Modo escuro e claro" },
                { en: "Radix UI primitives", pt: "Primitivos Radix UI" },
                { en: "Usability and a11y guidelines", pt: "Diretrizes de usabilidade e a11y" },
              ].map((tag, i) => (
                <span key={tag.en} className={`inline-flex items-center px-3 py-1 rounded-full text-[0.8125rem] font-medium ${i === 0 ? "bg-primary/12 text-primary" : "bg-muted text-foreground"}`}>
                  {bi(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="whats-new" className="scroll-mt-32">
        <SectionLabel>{t("Changelog", "Histórico de mudanças")}</SectionLabel>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h2 className={`${display} text-[1.5rem] tracking-[-0.02em] text-foreground`}>{t("What's New", "Novidades")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground">{t("Latest", "Mais recente")}: {bi(latest.title)} · {fmtDate(latest.date)}</p>
        </div>
        <p className="max-w-2xl mb-6 text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t("Every addition, change and removal in the design system, newest first.", "Toda adição, mudança e remoção no design system, da mais recente para a mais antiga.")}
        </p>
        <ol className="relative border-l border-border ml-1.5 space-y-3">
          {changelog.map((e, i) => {
            const Tag = e.page ? "button" : "div";
            return (
              <li key={e.title.en} className="relative pl-6">
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
                    {t(e.kind, kindPt[e.kind])}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className={`${display} block text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground mb-0.5`}>{bi(e.title)}</span>
                    <span className="block text-[0.8125rem] leading-relaxed text-muted-foreground">{bi(e.desc)}</span>
                  </span>
                  <span className="shrink-0 text-[0.75rem] text-muted-foreground sm:mt-0.5">{fmtDate(e.date)}</span>
                </Tag>
              </li>
            );
          })}
        </ol>
      </section>

      <section id="home-explore" className="scroll-mt-32 space-y-8">
        <div>
          <SectionLabel>{t("Explore", "Explorar")}</SectionLabel>
          <h2 className={`${display} text-[1.5rem] tracking-[-0.02em] text-foreground`}>{t("Everything in the system", "Tudo no sistema")}</h2>
        </div>
        {explore.map(g => (
          <div key={g.label.en}>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3">{bi(g.label)}</p>
            <CardGrid items={g.items} onGo={go} cols={g.items.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} compact />
          </div>
        ))}
      </section>

      <section>
        <SectionLabel>{t("Palette preview", "Prévia da paleta")}</SectionLabel>
        <div className="flex rounded-[16px] overflow-hidden h-16 border border-border/40 shadow-[var(--shadow-sm)]" role="img" aria-label={t("Graphite and Crimson scales, 50 to 950", "Escalas Graphite e Crimson, de 50 a 950")}>
          {graphite.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
          <div className="w-px bg-background/20" />
          {crimson.map(c => <div key={c} className="flex-1" style={{ backgroundColor: c }} />)}
        </div>
        <div className="flex justify-between text-[0.6875rem] text-muted-foreground mt-2 px-1">
          <span>{t("Graphite scale, 50 to 950", "Escala Graphite, de 50 a 950")}</span>
          <span>{t("Crimson scale, 50 to 950", "Escala Crimson, de 50 a 950")}</span>
        </div>
      </section>
    </div>
  );
}
