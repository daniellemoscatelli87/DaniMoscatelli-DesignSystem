import React, { useState } from "react";
import {
  Copy, Check, Paintbrush, Code2, ChevronRight,
  FolderOpen, Package, FileCode, Layers, RefreshCw,
  CheckCircle2, Circle, ArrowRight, GitBranch, Figma,
} from "lucide-react";
import { useI18n } from "../../i18n";

/* ── helpers ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
      className="h-5 w-5 rounded-[4px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0">
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function CodeBlock({ filename, label, children }: { filename: string; label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-400/60" />
          <div className="h-2 w-2 rounded-full bg-amber-400/60" />
          <div className="h-2 w-2 rounded-full bg-success/60" />
          <span className="text-[0.625rem] font-mono text-muted-foreground ml-2">{filename}</span>
        </div>
        {label && <span className="text-[0.5rem] font-bold uppercase tracking-[0.07em] text-muted-foreground/50">{label}</span>}
      </div>
      <pre className="px-4 py-3 text-[0.6875rem] font-mono leading-relaxed overflow-x-auto" style={{ color: "var(--muted-foreground)" }}>
        {children}
      </pre>
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="h-7 w-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
      <span className="text-[0.625rem] font-black text-primary">{n}</span>
    </div>
  );
}

/* ── interactive checklist ── */
const checklistItems = [
  { id: "figma-lib",     team: "design", label: { en: "Request access to the design system Figma library", pt: "Solicitar acesso à biblioteca Figma do design system" } },
  { id: "figma-vars",    team: "design", label: { en: "Enable the library in the Figma project Variables", pt: "Ativar a biblioteca nas Variables do projeto Figma" } },
  { id: "figma-modes",   team: "design", label: { en: "Set up Light and Dark modes in the file", pt: "Configurar os modos Light e Dark no arquivo" } },
  { id: "figma-apply",   team: "design", label: { en: "Audit existing components — replace hex with variables", pt: "Auditar os componentes existentes — trocar hex por variáveis" } },
  { id: "copy-theme",    team: "dev",    label: { en: "Copy theme.css to the project's src/styles/", pt: "Copiar o theme.css para o src/styles/ do projeto" } },
  { id: "copy-index",    team: "dev",    label: { en: "Add @theme inline to index.css (Tailwind mapping)", pt: "Adicionar @theme inline ao index.css (mapeamento do Tailwind)" } },
  { id: "copy-fonts",    team: "dev",    label: { en: "Add the fonts @import to fonts.css", pt: "Adicionar o @import das fontes ao fonts.css" } },
  { id: "install-tw",    team: "dev",    label: { en: "Confirm Tailwind v4 is installed (not v3)", pt: "Confirmar que o Tailwind v4 está instalado (não o v3)" } },
  { id: "dark-class",    team: "dev",    label: { en: "Set up theme switching via the .dark class on <html>", pt: "Configurar a troca de tema pela classe .dark no <html>" } },
  { id: "audit-code",    team: "dev",    label: { en: "Audit components — replace hex/literal colors with tokens", pt: "Auditar componentes — trocar hex/cores literais por tokens" } },
  { id: "sync-meeting",  team: "both",   label: { en: "Align with the team: added tokens must update both Figma and CSS", pt: "Alinhar com o time: tokens adicionados devem atualizar Figma e CSS" } },
  { id: "token-pr",      team: "both",   label: { en: "Establish a convention: token PRs always include both sides", pt: "Definir uma convenção: PRs de tokens sempre incluem os dois lados" } },
];

export function IntegrationShowcase() {
  const { t, bi } = useI18n();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "design" | "dev" | "both">("all");

  const toggle = (id: string) => setChecked(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const visible = checklistItems.filter(i => filter === "all" || i.team === filter);
  const doneCount = visible.filter(i => checked.has(i.id)).length;

  return (
    <div className="space-y-16 pb-16">

      {/* ── Hero ── */}
      <section className="space-y-4">
        <div>
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-primary">{t("Concepts", "Conceitos")}</p>
          <h1 className="text-[2.25rem] font-black text-foreground tracking-[-0.04em] leading-none mt-1">
            {t("Connecting to your project", "Conectando ao seu projeto")}
          </h1>
          <p className="text-[1rem] text-muted-foreground max-w-2xl leading-relaxed mt-2">
            {t("How to bring this design system into a real project — on both the design side (Figma) and the development side (code). Each team has a clear path.", "Como levar este design system para um projeto real — tanto no lado do design (Figma) quanto no desenvolvimento (código). Cada time tem um caminho claro.")}
          </p>
        </div>

        {/* Two paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[14px] border border-violet-500/30 bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-[9px] bg-violet-500/10 flex items-center justify-center">
                <Figma className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-[0.875rem] font-bold text-foreground">{t("Designer path", "Caminho do designer")}</p>
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.07em] text-violet-400">Figma Variables</p>
              </div>
            </div>
            <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
              {t("Connect the Figma library to your project file and enable the semantic Variables so all components use the right tokens automatically.", "Conecte a biblioteca do Figma ao arquivo do seu projeto e ative as Variables semânticas para que todos os componentes usem os tokens certos automaticamente.")}
            </p>
            <div className="flex items-center gap-1 text-[0.6875rem] text-violet-400 font-semibold">
              <span>{t("View step by step", "Ver passo a passo")}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="rounded-[14px] border border-blue-500/30 bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-[9px] bg-blue-500/10 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-[0.875rem] font-bold text-foreground">{t("Developer path", "Caminho do desenvolvedor")}</p>
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.07em] text-blue-400">CSS + Tailwind v4</p>
              </div>
            </div>
            <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
              {t("Copy the token files into the project, configure Tailwind to read the custom properties, and use semantic classes in all components.", "Copie os arquivos de tokens para o projeto, configure o Tailwind para ler as custom properties e use classes semânticas em todos os componentes.")}
            </p>
            <div className="flex items-center gap-1 text-[0.6875rem] text-blue-400 font-semibold">
              <span>{t("View step by step", "Ver passo a passo")}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Designer path ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[9px] bg-violet-500/10 flex items-center justify-center shrink-0">
            <Paintbrush className="h-4 w-4 text-violet-400" />
          </div>
          <div>
            <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("For the design team", "Para o time de design")}</h2>
            <p className="text-[0.75rem] text-muted-foreground">{t("Connecting the Figma library to your project", "Conectando a biblioteca do Figma ao seu projeto")}</p>
          </div>
        </div>

        <div className="space-y-3">

          {/* Step 1 */}
          <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={1} />
              <div className="space-y-2 flex-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Request library access", "Solicite acesso à biblioteca")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("The design system lives as a shared Figma file with the component and variable library enabled. Ask your Figma admin to add it to your team under ", "O design system vive em um arquivo Figma compartilhado, com a biblioteca de componentes e variáveis ativada. Peça ao admin do Figma para adicioná-lo ao seu time em ")}<strong className="text-foreground">{t("Team → Libraries", "Team → Libraries")}</strong>.
                </p>
                <div className="rounded-[8px] bg-muted/40 border border-border px-3 py-2.5 space-y-1">
                  <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-muted-foreground/60">{t("In Figma", "No Figma")}</p>
                  <div className="flex flex-wrap gap-1.5 text-[0.6875rem]">
                    {[t("Main Menu", "Menu principal"), "Libraries", t("Design System — [Project Name]", "Design System — [Nome do Projeto]"), t("Enable", "Ativar")].map((s, i, arr) => (
                      <React.Fragment key={i}>
                        <span className="font-semibold text-foreground">{s}</span>
                        {i < arr.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/40 self-center" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={2} />
              <div className="space-y-2 flex-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Enable Variables in your file", "Ative as Variables no seu arquivo")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("After enabling the library, the variable collections become available in the ", "Depois de ativar a biblioteca, as coleções de variáveis ficam disponíveis no painel ")}<strong className="text-foreground">Assets → Variables</strong>{t(" panel. The ", ". As coleções ")}<strong className="text-foreground">Primitives</strong>{t(" and ", " e ")}<strong className="text-foreground">Semantics</strong>{t(" collections will appear as options when applying Fill, Stroke and Corner Radius to your components.", " aparecerão como opções ao aplicar Fill, Stroke e Corner Radius nos seus componentes.")}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { name: "Primitives", desc: t("Full palette of raw colors. Do not use directly in components.", "Paleta completa de cores brutas. Não use diretamente nos componentes."), color: "bg-muted/50 border-border" },
                    { name: "Semantics", desc: t("Intent tokens: Primary, Background, Muted. Use these in components.", "Tokens de intenção: Primary, Background, Muted. Use estes nos componentes."), color: "bg-primary/5 border-primary/20" },
                  ].map(c => (
                    <div key={c.name} className={`rounded-[8px] border p-2.5 space-y-1 ${c.color}`}>
                      <p className="text-[0.6875rem] font-bold text-foreground">{c.name}</p>
                      <p className="text-[0.5625rem] text-muted-foreground leading-snug">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={3} />
              <div className="space-y-2 flex-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Set up Light and Dark modes", "Configure os modos Light e Dark")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("The Semantics collection has two modes. To switch in your file: select a frame or component, go to ", "A coleção Semantics tem dois modos. Para alternar no seu arquivo: selecione um frame ou componente, vá em ")}<strong className="text-foreground">Variables → Semantics</strong>{t(" and choose the desired mode. This switches all linked tokens at once — no need to adjust color by color.", " e escolha o modo desejado. Isso troca todos os tokens vinculados de uma vez — sem precisar ajustar cor por cor.")}
                </p>
                <div className="rounded-[8px] bg-muted/40 border border-border p-2.5 flex items-center gap-4 text-[0.6875rem]">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md border border-border bg-card flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--graphite-50)" }} />
                    </div>
                    <span className="font-semibold text-foreground">{t("Light", "Claro")}</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-md border border-border bg-card flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--graphite-950)" }} />
                    </div>
                    <span className="font-semibold text-foreground">{t("Dark", "Escuro")}</span>
                  </div>
                  <span className="text-muted-foreground ml-auto">{t("all tokens update together", "todos os tokens mudam juntos")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={4} />
              <div className="space-y-2 flex-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Audit existing components", "Audite os componentes existentes")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("If the project already has components, use the ", "Se o projeto já tem componentes, use o plugin ")}<strong className="text-foreground">Variable Inspector</strong>{t(" plugin to find layers with raw colors (manual hex) and replace them with the matching semantic tokens. This is what keeps design and code speaking the same language.", " para encontrar camadas com cores brutas (hex manual) e trocá-las pelos tokens semânticos correspondentes. É isso que mantém design e código falando a mesma língua.")}
                </p>
                <div className="rounded-[8px] bg-amber-500/8 border border-amber-500/20 px-3 py-2">
                  <p className="text-[0.6875rem] text-amber-500/90 leading-snug">
                    <strong>{t("Warning:", "Atenção:")}</strong> {t("components copied from the internet or generated by AI often have hardcoded hex. Always audit before using in the project.", "componentes copiados da internet ou gerados por IA costumam ter hex fixo no código. Sempre audite antes de usar no projeto.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Developer path ── */}
      <section className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[9px] bg-blue-500/10 flex items-center justify-center shrink-0">
            <Code2 className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("For the development team", "Para o time de desenvolvimento")}</h2>
            <p className="text-[0.75rem] text-muted-foreground">{t("Installing the tokens in a React + Tailwind v4 project", "Instalando os tokens em um projeto React + Tailwind v4")}</p>
          </div>
        </div>

        <div className="space-y-3">

          {/* Step 1 */}
          <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={1} />
              <div className="space-y-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Install Tailwind v4 and dependencies", "Instale o Tailwind v4 e as dependências")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("This design system uses Tailwind v4 with the new ", "Este design system usa o Tailwind v4 com o novo sistema ")}<code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">@theme inline</code>{t(" system. Make sure you are on the correct version.", ". Confirme que você está na versão correta.")}
                </p>
              </div>
            </div>
            <CodeBlock filename="terminal" label="install">
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}># install tailwind v4</span>{"\n"}
              <span style={{ color: "var(--success)" }}>npm install</span>
              {" tailwindcss@next @tailwindcss/vite@next\n\n"}
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}># or with pnpm</span>{"\n"}
              <span style={{ color: "var(--success)" }}>pnpm add</span>
              {" tailwindcss@next @tailwindcss/vite@next"}
            </CodeBlock>
          </div>

          {/* Step 2 */}
          <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={2} />
              <div className="space-y-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Copy the token files", "Copie os arquivos de tokens")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("Copy the three files below into your project's ", "Copie os três arquivos abaixo para a pasta ")}<code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">src/styles/</code>{t(" folder. They are the only files needed to get the whole token system working.", " do seu projeto. São os únicos arquivos necessários para todo o sistema de tokens funcionar.")}
                </p>
              </div>
            </div>
            <div className="rounded-[10px] border border-border bg-muted/20 overflow-hidden">
              {[
                { file: "theme.css",   desc: t("Primitives, semantics, dark mode — the source of truth for tokens", "Primitivos, semânticos, dark mode — a fonte da verdade dos tokens"), icon: FileCode, color: "text-violet-400" },
                { file: "fonts.css",   desc: t("Google Fonts import (Plus Jakarta Sans, Space Grotesk, Fraunces)", "Import do Google Fonts (Plus Jakarta Sans, Space Grotesk, Fraunces)"), icon: FileCode, color: "text-amber-400" },
                { file: "index.css",   desc: t("@import of the three files + @theme inline that exposes tokens to Tailwind", "@import dos três arquivos + @theme inline que expõe os tokens ao Tailwind"), icon: FileCode, color: "text-blue-400" },
              ].map((f, i, arr) => (
                <div key={f.file} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                  <f.icon className={`h-4 w-4 shrink-0 ${f.color}`} />
                  <div className="flex-1 min-w-0">
                    <code className="text-[0.6875rem] font-mono text-foreground">{f.file}</code>
                    <p className="text-[0.5625rem] text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                  <CopyBtn text={`src/styles/${f.file}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={3} />
              <div className="space-y-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Configure the CSS entry point", "Configure o ponto de entrada do CSS")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  <code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">index.css</code> {t("imports the other files and exposes the tokens as Tailwind classes via", "importa os outros arquivos e expõe os tokens como classes do Tailwind via")} <code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">@theme inline</code>.
                </p>
              </div>
            </div>
            <CodeBlock filename="src/styles/index.css" label={t("structure", "estrutura")}>
              <span style={{ color: "#f59e0b" }}>@import</span>
              {" "}
              <span style={{ color: "var(--success)" }}>"./fonts.css"</span>
              {";\n"}
              <span style={{ color: "#f59e0b" }}>@import</span>
              {" "}
              <span style={{ color: "var(--success)" }}>"tailwindcss"</span>
              {";\n"}
              <span style={{ color: "#f59e0b" }}>@import</span>
              {" "}
              <span style={{ color: "var(--success)" }}>"./theme.css"</span>
              {";\n\n"}
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>{"/* exposes tokens as Tailwind classes */"}</span>
              {"\n"}
              <span style={{ color: "#f59e0b" }}>@theme inline</span>
              {" {\n  "}
              <span style={{ color: "#8B5CF6" }}>--color-primary</span>
              {":     "}
              <span style={{ color: "var(--success)" }}>var(--primary)</span>
              {";\n  "}
              <span style={{ color: "#8B5CF6" }}>--color-background</span>
              {": "}
              <span style={{ color: "var(--success)" }}>var(--background)</span>
              {";\n  "}
              <span style={{ color: "#8B5CF6" }}>--color-foreground</span>
              {": "}
              <span style={{ color: "var(--success)" }}>var(--foreground)</span>
              {";\n  "}
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>{"/* ... remaining tokens */"}</span>
              {"\n}"}
            </CodeBlock>
          </div>

          {/* Step 4 */}
          <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={4} />
              <div className="space-y-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Enable dark mode via class", "Ative o dark mode via classe")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("Dark mode is activated by adding the ", "O dark mode é ativado adicionando a classe ")}<code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">.dark</code>{t(" class to the ", " ao elemento ")}<code className="text-[0.6875rem] font-mono px-1 py-0.5 rounded bg-muted/60 border border-border">{"<html>"}</code>{t(" element. All semantic tokens switch automatically.", ". Todos os tokens semânticos mudam automaticamente.")}
                </p>
              </div>
            </div>
            <CodeBlock filename="src/main.tsx or App.tsx" label="theme">
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>{"// theme toggle"}</span>
              {"\n"}
              <span style={{ color: "#f59e0b" }}>const</span>
              {" toggleTheme = () => {\n  document.documentElement."}
              <span style={{ color: "var(--success)" }}>classList</span>
              {"."}
              <span style={{ color: "#3b82f6" }}>toggle</span>
              {"("}
              <span style={{ color: "var(--success)" }}>"dark"</span>
              {");\n};\n\n"}
              <span style={{ color: "var(--muted-foreground)", opacity: 0.5 }}>{"// or force dark mode:"}</span>
              {"\n"}
              {"document.documentElement."}
              <span style={{ color: "var(--success)" }}>className</span>
              {" = "}
              <span style={{ color: "var(--success)" }}>"dark"</span>
              {";"}
            </CodeBlock>
          </div>

          {/* Step 5 */}
          <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-start gap-3">
              <StepBadge n={5} />
              <div className="space-y-1">
                <p className="text-[0.875rem] font-bold text-foreground">{t("Use tokens in components", "Use tokens nos componentes")}</p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("With the tokens installed, always use Tailwind's semantic classes. Never use hex or Tailwind's literal color classes.", "Com os tokens instalados, use sempre as classes semânticas do Tailwind. Nunca use hex nem as classes de cor literais do Tailwind.")}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CodeBlock filename={t("❌ Avoid", "❌ Evite")} label={t("hex / literal", "hex / literal")}>
                <span style={{ color: "#D44D4D" }}>{"className"}</span>
                {"="}
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                <span style={{ color: "#D44D4D" }}>bg-red-500 text-white</span>
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                {"\n"}
                <span style={{ color: "#D44D4D" }}>{"style"}</span>
                {"={{ "}
                <span style={{ color: "#D44D4D" }}>background: "#D44D4D"</span>
                {" }}"}
                {"\n"}
                <span style={{ color: "#D44D4D" }}>{"className"}</span>
                {"="}
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                <span style={{ color: "#D44D4D" }}>{"bg-[#D44D4D]"}</span>
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
              </CodeBlock>
              <CodeBlock filename={t("✓ Correct", "✓ Correto")} label={t("semantic tokens", "tokens semânticos")}>
                <span style={{ color: "var(--success)" }}>{"className"}</span>
                {"="}
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                <span style={{ color: "var(--success)" }}>bg-primary text-primary-foreground</span>
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                {"\n"}
                <span style={{ color: "var(--success)" }}>{"className"}</span>
                {"="}
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                <span style={{ color: "var(--success)" }}>bg-card border-border</span>
                <span style={{ color: "var(--muted-foreground)" }}>"</span>
                {"\n"}
                <span style={{ color: "var(--success)" }}>{"style"}</span>
                {"={{ "}
                <span style={{ color: "var(--success)" }}>color: "var(--primary)"</span>
                {" }}"}
              </CodeBlock>
            </div>
          </div>

        </div>
      </section>

      {/* ── File structure ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Recommended file structure", "Estrutura de arquivos recomendada")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("How to organize token files in a React project.", "Como organizar os arquivos de tokens em um projeto React.")}</p>
        </div>

        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
            <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[0.625rem] font-mono text-muted-foreground">{t("project structure", "estrutura do projeto")}</span>
          </div>
          <div className="p-4 font-mono text-[0.6875rem] leading-[1.8] space-y-0" style={{ color: "var(--muted-foreground)" }}>
            {[
              { indent: 0, name: "src/",            type: "dir" },
              { indent: 1, name: "styles/",          type: "dir" },
              { indent: 2, name: "index.css",        type: "file", note: { en: "entry point — imports everything", pt: "ponto de entrada — importa tudo" }, color: "text-blue-400" },
              { indent: 2, name: "theme.css",        type: "file", note: { en: "primitive + semantic tokens", pt: "tokens primitivos + semânticos" }, color: "text-violet-400" },
              { indent: 2, name: "fonts.css",        type: "file", note: { en: "font imports", pt: "imports de fontes" }, color: "text-amber-400" },
              { indent: 1, name: "app/",             type: "dir" },
              { indent: 2, name: "components/",      type: "dir" },
              { indent: 3, name: "Button.tsx",       type: "file", note: { en: "uses bg-primary, text-primary-foreground", pt: "usa bg-primary, text-primary-foreground" } },
              { indent: 3, name: "Card.tsx",         type: "file", note: { en: "uses bg-card, border-border", pt: "usa bg-card, border-border" } },
              { indent: 1, name: "main.tsx",         type: "file", note: { en: "imports styles/index.css", pt: "importa styles/index.css" } },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-0" style={{ paddingLeft: row.indent * 16 }}>
                {row.type === "dir" ? (
                  <span className="text-amber-400/80">{"📁 "}</span>
                ) : (
                  <span className="text-muted-foreground/40">{"  └─ "}</span>
                )}
                <span className={row.color ?? (row.type === "dir" ? "text-foreground font-semibold" : "text-foreground")}>
                  {row.name}
                </span>
                {row.note && (
                  <span className="text-muted-foreground/40 ml-3 text-[0.5625rem]">← {bi(row.note)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full flow ── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Full flow: from token to component", "Fluxo completo: do token ao componente")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("How a design decision becomes code, step by step.", "Como uma decisão de design vira código, passo a passo.")}</p>
        </div>

        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="divide-y divide-border">
            {[
              {
                who: t("Designer", "Designer"),
                whoColor: "text-violet-400",
                whoBg: "bg-violet-500/10",
                action: t("Defines crimson-400 as the brand's primary color", "Define crimson-400 como a cor primária da marca"),
                tool: "Figma Variables → Semantics → Primary = crimson-400",
                output: t('Variable "Primary" available across the whole library', 'Variable "Primary" disponível em toda a biblioteca'),
              },
              {
                who: "Dev",
                whoColor: "text-blue-400",
                whoBg: "bg-blue-500/10",
                action: t("Declares the same mapping in CSS", "Declara o mesmo mapeamento no CSS"),
                tool: "theme.css: --primary: var(--crimson-400)",
                output: t("--primary token available via CSS custom property", "Token --primary disponível via CSS custom property"),
              },
              {
                who: "Dev",
                whoColor: "text-blue-400",
                whoBg: "bg-blue-500/10",
                action: t("Exposes the token as a Tailwind class", "Expõe o token como classe do Tailwind"),
                tool: "index.css @theme inline: --color-primary: var(--primary)",
                output: t("bg-primary and text-primary classes available", "Classes bg-primary e text-primary disponíveis"),
              },
              {
                who: "Dev",
                whoColor: "text-blue-400",
                whoBg: "bg-blue-500/10",
                action: t("Uses the class in the component", "Usa a classe no componente"),
                tool: 'Button.tsx: className="bg-primary text-primary-foreground"',
                output: t("Button with primary color that responds to theme switching", "Button com cor primária que responde à troca de tema"),
              },
              {
                who: t("Designer", "Designer"),
                whoColor: "text-violet-400",
                whoBg: "bg-violet-500/10",
                action: t("Swaps crimson-400 for a softer tone in the rebrand", "Troca crimson-400 por um tom mais suave no rebrand"),
                tool: "Figma Variables: Primary → crimson-300",
                output: t("The whole interface — design AND code — updates together", "A interface inteira — design E código — se atualiza junta"),
              },
            ].map((row, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-4">
                <span className={`text-[0.5rem] font-black uppercase tracking-[0.07em] px-2 py-1 rounded-full shrink-0 mt-0.5 ${row.whoBg} ${row.whoColor}`}>
                  {row.who}
                </span>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-[0.75rem] font-semibold text-foreground">{row.action}</p>
                  <code className="text-[0.5625rem] text-muted-foreground/70 block">{row.tool}</code>
                </div>
                <div className="hidden md:flex items-center gap-1.5 shrink-0 max-w-[200px]">
                  <ArrowRight className="h-3 w-3 text-muted-foreground/30 shrink-0" />
                  <p className="text-[0.5625rem] text-muted-foreground/60 leading-snug">{row.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive checklist ── */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Integration checklist", "Checklist de integração")}</h2>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("Everything that must be done for the design system to be correctly connected.", "Tudo o que precisa ser feito para o design system ficar conectado corretamente.")}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", "design", "dev", "both"] as const).map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`text-[0.625rem] font-bold uppercase tracking-[0.07em] px-2.5 py-1 rounded-full border transition-colors ${
                  filter === f ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
                }`}>
                {f === "all" ? t("All", "Todos") : f === "design" ? "Design" : f === "dev" ? "Dev" : t("Both", "Ambos")}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
            <div className="h-full bg-success rounded-full transition-all duration-300"
              style={{ width: visible.length > 0 ? `${(doneCount / visible.length) * 100}%` : "0%" }} />
          </div>
          <span className="text-[0.6875rem] font-bold text-muted-foreground shrink-0">
            {doneCount}/{visible.length}
          </span>
        </div>

        <div className="space-y-1.5">
          {visible.map(item => {
            const done = checked.has(item.id);
            const teamColor = item.team === "design" ? "text-violet-400 bg-violet-500/10" : item.team === "dev" ? "text-blue-400 bg-blue-500/10" : "text-amber-400 bg-amber-500/10";
            const teamLabel = item.team === "design" ? "Design" : item.team === "dev" ? "Dev" : t("Both", "Ambos");
            return (
              <button key={item.id} onClick={() => toggle(item.id)}
                className={`w-full rounded-[10px] border px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  done ? "border-success/30 bg-success/5" : "border-border bg-card hover:bg-muted/30"
                }`}
                style={{ boxShadow: "var(--shadow-xs)" }}>
                {done
                  ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  : <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                <span className={`text-[0.75rem] font-medium flex-1 ${done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {bi(item.label)}
                </span>
                <span className={`text-[0.5rem] font-bold uppercase tracking-[0.07em] px-1.5 py-0.5 rounded-full shrink-0 ${teamColor}`}>
                  {teamLabel}
                </span>
              </button>
            );
          })}
        </div>

        {doneCount === visible.length && visible.length > 0 && (
          <div className="rounded-[12px] border border-success/30 bg-success/8 px-5 py-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <p className="text-[0.8125rem] font-bold text-foreground">
              {t("All done! The design system is correctly integrated into the project.", "Tudo pronto! O design system está integrado corretamente ao projeto.")}
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
