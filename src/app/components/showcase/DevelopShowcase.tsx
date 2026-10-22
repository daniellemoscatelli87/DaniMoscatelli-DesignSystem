import React, { useState } from "react";
import { Check, Copy, ArrowRight, Megaphone, Layers, Sparkles } from "lucide-react";
import { useI18n, type Bi } from "../../i18n";
import { Navigate, PageHeader, PageSection, useGo } from "./GetStartedShowcase";

const display = "font-[family-name:var(--font-display)]";

function CopyBtn({ text }: { text: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={t("Copy code", "Copiar código")}
      className="h-6 w-6 rounded-[6px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ file, tag, code }: { file: string; tag: string; code: string }) {
  return (
    <div className="bg-muted border border-border rounded-[var(--radius)] overflow-hidden min-w-0">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-border">
        <span className="text-[0.75rem] font-[family-name:var(--font-mono)] text-foreground truncate">{file}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{tag}</span>
          <CopyBtn text={code} />
        </div>
      </div>
      <pre className="px-4 py-4 text-[0.75rem] leading-relaxed font-[family-name:var(--font-mono)] text-foreground overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const themeCode = `/* 1. Primitives — raw values */
:root {
  --crimson-400: #D44D4D;
  --graphite-50:  #EDF0F5;
  --graphite-950: #0D1119;
}

/* 2. Semantics — reference primitives */
:root {
  --primary:    var(--crimson-400);
  --background: var(--graphite-50);
}
.dark {
  --background: var(--graphite-950);
}`;

const indexCode = `/* Exposes tokens as Tailwind classes */
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
}

/* Usage in the component */
className="bg-primary text-foreground"`;

const promptCode = `Generate a card component in React with Tailwind CSS.
Use ONLY the following semantic design tokens:
Colors: bg-background, bg-card, bg-muted, bg-primary,
text-foreground, text-muted-foreground, border-border
Radius: rounded-[var(--radius)]
Shadow: var(--shadow-sm)
DO NOT use literal Tailwind colors (red-500, gray-200) or hex (#...).
The component must work in light and dark mode automatically.`;

const rows: [string, string, string, string][] = [
  ["Color", "Background", "--background", "bg-background"],
  ["Color", "Foreground", "--foreground", "text-foreground"],
  ["Color", "Primary", "--primary", "bg-primary / text-primary"],
  ["Color", "Card", "--card", "bg-card"],
  ["Color", "Muted", "--muted", "bg-muted"],
  ["Color", "Border", "--border", "border-border"],
  ["Typography", "Font/Sans", "--font-sans", "font-sans"],
  ["Typography", "Font/Display", "--font-display", "font-display"],
  ["Radius", "Radius/Base", "--radius", "rounded-[var(--radius)]"],
  ["Shadow", "Shadow/SM", "--shadow-sm", "shadow-sm"],
  ["Motion", "Duration/Base", "--duration-base", "duration-[var(--duration-base)]"],
];

const dos: Bi[] = [
  { en: "Token PR: includes Figma + CSS + documentation", pt: "PR de token: inclui Figma + CSS + documentação" },
  { en: "Review this design system's token table every sprint", pt: "Revise a tabela de tokens deste design system a cada sprint" },
  { en: "Name things exactly the same: Primary in Figma = --primary in CSS", pt: "Dê exatamente os mesmos nomes: Primary no Figma = --primary no CSS" },
];
const donts: Bi[] = [
  { en: "Don't add a token only in Figma without telling the dev", pt: "Não adicione um token só no Figma sem avisar quem desenvolve" },
  { en: "Don't use approximate values — if the token doesn't exist, create it first", pt: "Não use valores aproximados — se o token não existe, crie-o primeiro" },
  { en: "Don't rename tokens without aligning with the whole team", pt: "Não renomeie tokens sem alinhar com o time todo" },
];
const catPt: Record<string, string> = { Color: "Cor", Typography: "Tipografia", Radius: "Raio", Shadow: "Sombra", Motion: "Motion" };

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[0.8125rem] font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded-[5px] bg-muted text-foreground border border-border">
      {children}
    </code>
  );
}

function TextLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[4px]"
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
    </button>
  );
}

export function DevelopShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);
  const { t, bi } = useI18n();

  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow={t("Start", "Início")}
        title={t("Develop", "Desenvolvimento")}
        description={t(
          "Implement the Dani Moscatelli Design System with code and developer documentation for React, Tailwind CSS and Figma Variables.",
          "Implemente o Design System Dani Moscatelli com código e documentação para desenvolvedores em React, Tailwind CSS e Figma Variables."
        )}
      />

      <PageSection
        id="dev-announcements"
        label={t("Announcements", "Novidades")}
        title={t("The latest in development", "As últimas do desenvolvimento")}
        intro={null}
      >
        <article className="bg-card border border-border border-l-4 border-l-primary rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-4 w-4 text-primary" aria-hidden />
            <time className="text-[0.75rem] font-medium text-muted-foreground">{t("October 22, 2026", "22 de outubro de 2026")}</time>
          </div>
          <h3 className={`${display} text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground mb-1.5`}>
            {t("Design tokens now documented end to end", "Design tokens agora documentados de ponta a ponta")}
          </h3>
          <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
            {t(
              "The Develop page brings token definition, Tailwind mapping and the Figma sync workflow together in one place.",
              "A página Desenvolvimento reúne a definição dos tokens, o mapeamento do Tailwind e o fluxo de sincronização com o Figma em um só lugar."
            )}
          </p>
        </article>
      </PageSection>

      <PageSection
        id="dev-platforms"
        label={t("Platforms", "Plataformas")}
        title={t("Platforms", "Plataformas")}
        intro={<p>{t("Design and code implement the same decisions, using the same names, in different tools.", "Design e código implementam as mesmas decisões, com os mesmos nomes, em ferramentas diferentes.")}</p>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5">
            <span className="self-start mb-3 rounded-full bg-primary-muted text-primary text-[0.6875rem] font-semibold uppercase tracking-[0.06em] px-2.5 py-1">
              {t("Recommended", "Recomendado")}
            </span>
            <h3 className={`${display} text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground mb-2`}>
              Web — React + Tailwind CSS
            </h3>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground mb-5">
              {t("Components are built in React with Tailwind CSS. Tokens live in ", "Os componentes são feitos em React com Tailwind CSS. Os tokens ficam em ")}<Mono>src/styles/theme.css</Mono>{t(" and are exposed as Tailwind classes in ", " e são expostos como classes do Tailwind em ")}<Mono>src/styles/index.css</Mono>{t(" through ", " por meio de ")}<Mono>@theme inline</Mono>.
            </p>
            <div className="mt-auto">
              <TextLink onClick={() => go({ page: "tokens", anchor: "tokens-definition" })}>{t("Implementation in code", "Implementação em código")}</TextLink>
            </div>
          </div>
          <div className="flex flex-col bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5">
            <h3 className={`${display} text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground mb-2 md:mt-[2.125rem]`}>
              Figma — Variables
            </h3>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground mb-5">
              {t(
                "Two collections — Primitives and Semantics — with Light and Dark modes. Names are identical to the CSS:",
                "Duas coleções — Primitives e Semantics — com modos Light e Dark. Os nomes são idênticos aos do CSS:"
              )}{" "}
              <Mono>Primary</Mono> {t("in Figma", "no Figma")} = <Mono>--primary</Mono> {t("in CSS", "no CSS")}.
            </p>
            <div className="mt-auto">
              <TextLink onClick={() => go({ page: "tokens", anchor: "tokens-design" })}>{t("Guide for designers", "Guia para designers")}</TextLink>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="dev-setup"
        label={t("Setup", "Configuração")}
        title={t("How tokens are defined in code", "Como os tokens são definidos no código")}
        intro={<p>{t("Anatomy of the token files in this design system.", "Anatomia dos arquivos de tokens deste design system.")}</p>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock file="src/styles/theme.css" tag={t("Definition", "Definição")} code={themeCode} />
            <CodeBlock file="src/styles/index.css" tag={t("Tailwind mapping", "Mapeamento Tailwind")} code={indexCode} />
          </div>
          <div className="bg-primary-muted rounded-[var(--radius)] px-5 py-4 flex items-start gap-3">
            <Layers className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
            <p className="text-[0.875rem] leading-relaxed text-foreground">
              <strong className="font-semibold">{t("Golden rule", "Regra de ouro")}</strong> — {t("In components, always use semantic Tailwind classes (", "Nos componentes, use sempre classes semânticas do Tailwind (")}<Mono>bg-primary</Mono>, <Mono>text-foreground</Mono>, <Mono>border-border</Mono>{t(") — never literal colors (", ") — nunca cores literais (")}<Mono>bg-red-500</Mono>, <Mono>bg-[#D44D4D]</Mono>{t("). This ensures the component works in any theme, now and in the future.", "). Assim o componente funciona em qualquer tema, agora e no futuro.")}
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="dev-reference"
        label={t("Reference", "Referência")}
        title={t("Token reference", "Referência de tokens")}
        intro={
          <p>
            {t(
              "The most used tokens, with their CSS property and Tailwind class. See the full map in Design ↔ Dev Mapping.",
              "Os tokens mais usados, com a propriedade CSS e a classe Tailwind. Veja o mapa completo em Mapeamento Design ↔ Dev."
            )}
          </p>
        }
      >
        <div className="bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] overflow-x-auto">
          <table className="w-full text-left min-w-[560px]">
            <thead>
              <tr className="bg-muted border-b border-border">
                {[t("Category", "Categoria"), t("Design Token", "Design Token"), "CSS / Dev", "Tailwind"].map(h => (
                  <th key={h} className="px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([cat, design, css, tw]) => (
                <tr key={css} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t(cat, catPt[cat] ?? cat)}</td>
                  <td className="px-4 py-2.5 text-[0.8125rem] text-foreground">{design}</td>
                  <td className="px-4 py-2.5 text-[0.75rem] font-[family-name:var(--font-mono)] text-primary">{css}</td>
                  <td className="px-4 py-2.5 text-[0.75rem] font-[family-name:var(--font-mono)] text-foreground">{tw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <TextLink onClick={() => go({ page: "tokens", anchor: "tokens-bridge" })}>
            {t("See the full Design ↔ Dev Mapping", "Veja o Mapeamento Design ↔ Dev completo")}
          </TextLink>
        </div>
      </PageSection>

      <PageSection
        id="dev-workflow"
        label={t("Workflow", "Fluxo de trabalho")}
        title={t("Keeping design and code in sync", "Mantendo design e código em sincronia")}
        intro={
          <p>
            {t("Every time a new token is created in Figma, the matching variable must be added in", "Toda vez que um novo token é criado no Figma, a variável correspondente deve ser adicionada em")}{" "}
            <Mono>theme.css</Mono>. {t("Token changes always include updates on both ends.", "Mudanças em tokens sempre incluem atualizações nas duas pontas.")}
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { title: "✓ DO", label: t("✓ DO", "✓ FAÇA"), items: dos, tone: "text-primary", border: "border-t-primary" },
            { title: "✕ DON'T", label: t("✕ DON'T", "✕ NÃO FAÇA"), items: donts, tone: "text-muted-foreground", border: "border-t-[var(--border-strong)]" },
          ].map(col => (
            <div
              key={col.title}
              className={`bg-card border border-border border-t-2 ${col.border} rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-5`}
            >
              <p className={`${display} text-[0.8125rem] font-bold uppercase tracking-[0.08em] mb-3 ${col.tone}`}>
                {col.label}
              </p>
              <ul className="space-y-2.5">
                {col.items.map(i => (
                  <li key={i.en} className="text-[0.875rem] leading-relaxed text-foreground">{bi(i)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="dev-ai"
        label={t("AI", "IA")}
        title={t("Building with AI", "Construindo com IA")}
        intro={
          <p>
            {t(
              "AI tools ignore tokens by default. Give them the allowed tokens as context and always review the generated code.",
              "Ferramentas de IA ignoram tokens por padrão. Passe os tokens permitidos como contexto e sempre revise o código gerado."
            )}
          </p>
        }
      >
        <div className="space-y-4">
          <CodeBlock file="prompt.txt" tag={t("Example AI prompt", "Exemplo de prompt de IA")} code={promptCode} />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <TextLink onClick={() => go({ page: "tokens", anchor: "tokens-ia" })}>{t("AI and tokens", "IA e tokens")}</TextLink>
          </div>
        </div>
      </PageSection>

      <p className="pt-6 border-t border-border text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {t("Version", "Versão")} 1.0 · 2024
      </p>
    </div>
  );
}
