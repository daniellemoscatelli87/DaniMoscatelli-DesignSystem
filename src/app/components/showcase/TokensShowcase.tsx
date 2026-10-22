import React, { useState } from "react";
import { useI18n } from "../../i18n";
import {
  Copy, Check, ChevronRight, AlertTriangle, Sparkles,
  RefreshCw, Palette, Code2, Layers, Lightbulb, Bot,
} from "lucide-react";

/* ── helpers ── */
function CopyBtn({ text }: { text: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button onClick={copy} aria-label={t("Copy", "Copiar")}
      className="h-5 w-5 rounded-[4px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0">
      {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

function Pill({ children, color = "muted" }: { children: React.ReactNode; color?: string }) {
  const map: Record<string, string> = {
    muted:   "bg-muted/60 text-muted-foreground border-border",
    primary: "bg-primary/10 text-primary border-primary/20",
    violet:  "bg-violet-500/10 text-violet-400 border-violet-500/20",
    blue:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
    success: "bg-success/10 text-success border-success/20",
    slate:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return (
    <span className={`inline-block text-[0.5625rem] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-full border ${map[color] ?? map.muted}`}>
      {children}
    </span>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[0.6875rem] font-mono px-1.5 py-0.5 rounded-[5px] bg-muted/60 text-foreground border border-border">
      {children}
    </code>
  );
}

function SectionTitle({ label, title, subtitle }: { label: string; title: string; subtitle?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-primary">{label}</p>
      <h2 className="text-[1.25rem] font-black text-foreground tracking-[-0.03em] leading-tight">{title}</h2>
      {subtitle && <p className="text-[0.8125rem] text-muted-foreground leading-relaxed mt-1">{subtitle}</p>}
    </div>
  );
}

/* ── bridge table data ── */
const bridgeRows = [
  { category: "Color",        intent: { en: "Interface background", pt: "Fundo da interface" },         design: "Background",          dev: "--background",            tw: "bg-background" },
  { category: "Color",        intent: { en: "Primary text color", pt: "Cor do texto principal" },     design: "Foreground",           dev: "--foreground",            tw: "text-foreground" },
  { category: "Color",        intent: { en: "Primary brand color", pt: "Cor principal da marca" },      design: "Primary",              dev: "--primary",               tw: "bg-primary / text-primary" },
  { category: "Color",        intent: { en: "Text on primary color", pt: "Texto sobre a cor primária" },   design: "Primary Foreground",   dev: "--primary-foreground",    tw: "text-primary-foreground" },
  { category: "Color",        intent: { en: "Card surface", pt: "Superfície do card" },         design: "Card",                 dev: "--card",                  tw: "bg-card" },
  { category: "Color",        intent: { en: "Neutral surface", pt: "Superfície neutra" },          design: "Muted",                dev: "--muted",                 tw: "bg-muted" },
  { category: "Color",        intent: { en: "Secondary text", pt: "Texto secundário" },           design: "Muted Foreground",     dev: "--muted-foreground",      tw: "text-muted-foreground" },
  { category: "Color",        intent: { en: "Lines and dividers", pt: "Linhas e divisores" },         design: "Border",               dev: "--border",                tw: "border-border" },
  { category: "Color",        intent: { en: "Focus / ring color", pt: "Cor de foco / anel" },         design: "Ring",                 dev: "--ring",                  tw: "ring-ring" },
  { category: "Color",        intent: { en: "Destructive action / error", pt: "Ação destrutiva / erro" },     design: "Destructive",          dev: "--destructive",           tw: "bg-destructive" },
  { category: "Color",        intent: { en: "Confirmation / success", pt: "Confirmação / sucesso" },      design: "Success",              dev: "--success",               tw: "text-success / bg-success" },
  { category: "Color",        intent: { en: "Alert / attention", pt: "Alerta / atenção" },           design: "Warning",              dev: "--warning",               tw: "text-warning" },
  { category: "Typography", intent: { en: "Default interface font", pt: "Fonte padrão da interface" },  design: "Font/Sans",            dev: "--font-sans",             tw: "font-sans" },
  { category: "Typography", intent: { en: "Display / heading font", pt: "Fonte de destaque / títulos" },   design: "Font/Display",         dev: "--font-display",          tw: "font-display" },
  { category: "Typography", intent: { en: "Editorial / accent font", pt: "Fonte editorial / de acento" },     design: "Font/Accent",          dev: "--font-accent",           tw: "font-accent" },
  { category: "Typography", intent: { en: "Mono / code font", pt: "Fonte mono / de código" },        design: "Font/Mono",            dev: "--font-mono",             tw: "font-mono" },
  { category: "Radius",     intent: { en: "Default rounding", pt: "Arredondamento padrão" },      design: "Radius/Base",          dev: "--radius",                tw: "rounded-[var(--radius)]" },
  { category: "Radius",     intent: { en: "Small radius (input, badge)", pt: "Raio pequeno (input, badge)" },design: "Radius/SM",            dev: "--radius-sm",             tw: "rounded-sm" },
  { category: "Radius",     intent: { en: "Medium radius (card, panel)", pt: "Raio médio (card, painel)" },  design: "Radius/MD",            dev: "--radius-md",             tw: "rounded-md" },
  { category: "Radius",     intent: { en: "Large radius (modal, sheet)", pt: "Raio grande (modal, sheet)" }, design: "Radius/LG",            dev: "--radius-lg",             tw: "rounded-lg" },
  { category: "Shadow",     intent: { en: "Subtle shadow", pt: "Sombra sutil" },               design: "Shadow/XS",            dev: "--shadow-xs",             tw: "shadow-xs" },
  { category: "Shadow",     intent: { en: "Card shadow", pt: "Sombra de card" },             design: "Shadow/SM",            dev: "--shadow-sm",             tw: "shadow-sm" },
  { category: "Shadow",     intent: { en: "Modal shadow", pt: "Sombra de modal" },            design: "Shadow/MD",            dev: "--shadow-md",             tw: "shadow-md" },
  { category: "Motion",     intent: { en: "Fast duration", pt: "Duração rápida" },             design: "Duration/Fast",        dev: "--duration-fast",         tw: "duration-[var(--duration-fast)]" },
  { category: "Motion",     intent: { en: "Default duration", pt: "Duração padrão" },             design: "Duration/Base",        dev: "--duration-base",         tw: "duration-[var(--duration-base)]" },
  { category: "Motion",     intent: { en: "Default animation curve", pt: "Curva de animação padrão" },   design: "Easing/Default",       dev: "--ease-default",          tw: "ease-[var(--ease-default)]" },
];

const categories = ["All", "Color", "Typography", "Radius", "Shadow", "Motion"] as const;
type Category = (typeof categories)[number];
const catLabel: Record<string, { en: string; pt: string }> = {
  All: { en: "All", pt: "Todos" }, Color: { en: "Color", pt: "Cor" }, Typography: { en: "Typography", pt: "Tipografia" },
  Radius: { en: "Radius", pt: "Raio" }, Shadow: { en: "Shadow", pt: "Sombra" }, Motion: { en: "Motion", pt: "Motion" },
};
const catPill: Record<string, string> = {
  Color: "blue", Typography: "violet", Radius: "amber", Shadow: "slate", Motion: "success",
};

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function TokensShowcase() {
  const { t, bi, lang } = useI18n();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const filtered = activeCategory === "All" ? bridgeRows : bridgeRows.filter(r => r.category === activeCategory);

  return (
    <div className="space-y-16 pb-16">

      {/* ══════════════════════════════════════
          1. WHAT ARE TOKENS — for beginners
      ══════════════════════════════════════ */}
      <section className="space-y-5" id="tokens-intro">
        <div className="space-y-1">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-primary">{t("Fundamentals", "Fundamentos")}</p>
          <h1 className="text-[2.25rem] font-black text-foreground tracking-[-0.04em] leading-none">
            Design Tokens
          </h1>
          <p className="text-[1rem] text-muted-foreground max-w-2xl leading-relaxed mt-2">
            {t("The shared language between design and development — where every visual decision gets a name, and that name is shared by everyone.", "A linguagem compartilhada entre design e desenvolvimento — onde cada decisão visual ganha um nome, e esse nome é de todo mundo.")}
          </p>
        </div>

        {/* Visual analogy */}
        <div className="rounded-[16px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary shrink-0" />
            <p className="text-[0.8125rem] font-bold text-foreground">{t("The simple analogy", "A analogia simples")}</p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-muted-foreground/60">{t("Without tokens", "Sem tokens")}</p>
              <div className="rounded-[10px] border border-border bg-muted/30 p-3 space-y-2">
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {lang === "pt" ? <>O designer diz <em>"use o vermelho <strong className="font-mono text-foreground">#D44D4D</strong>"</em>.
                  O dev copia o hex. Três meses depois, o tom muda para <span className="font-mono">#C94040</span> no rebrand.</> : <>The designer says <em>"use the red <strong className="font-mono text-foreground">#D44D4D</strong>"</em>.
                  The dev copies the hex. Three months later, the shade changes to <span className="font-mono">#C94040</span> in the rebrand.</>}
                </p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {t("Result: someone spends days hunting down every place the old hex appears in the code.", "Resultado: alguém passa dias caçando cada lugar do código onde o hex antigo aparece.")}
                </p>
                <div className="flex gap-2 pt-1">
                  {["#D44D4D","#d44d4d","#D44D4D","#D44D4E"].map((h, i) => (
                    <div key={i} className="h-5 rounded-[4px] flex-1" style={{ background: h }} />
                  ))}
                </div>
                <p className="text-[0.5625rem] text-muted-foreground/50 text-center">{t("same color, different spellings scattered across the code", "mesma cor, grafias diferentes espalhadas pelo código")}</p>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <ChevronRight className="h-6 w-6 text-primary" />
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-primary">tokens</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-success">{t("With tokens", "Com tokens")}</p>
              <div className="rounded-[10px] border border-success/20 bg-success/5 p-3 space-y-2">
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {lang === "pt" ? <>O designer define: <em>"Este vermelho se chama <strong className="font-mono text-foreground">Primary</strong>"</em>.
                  O dev usa <InlineCode>bg-primary</InlineCode> em todo lugar.</> : <>The designer defines: <em>"This red is called <strong className="font-mono text-foreground">Primary</strong>"</em>.
                  The dev uses <InlineCode>bg-primary</InlineCode> everywhere.</>}
                </p>
                <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                  {lang === "pt" ? <>No rebrand: altere <strong>um único valor</strong> no arquivo de tokens. A interface inteira se atualiza em segundos.</> : <>On rebrand: change <strong>a single value</strong> in the tokens file. The whole interface updates in seconds.</>}
                </p>
                <div className="mt-2 rounded-[6px] bg-muted/40 border border-border px-3 py-2 font-mono text-[0.6875rem]">
                  <span className="text-violet-400">--primary</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-success">var(--crimson-400)</span>
                  <span className="text-muted-foreground">; </span>
                  <span className="text-muted-foreground/40">{t("/* change here */", "/* altere aqui */")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: RefreshCw,  color: "text-primary",  bg: "bg-primary/10",  title: { en: "Rebrand in minutes", pt: "Rebrand em minutos" },   body: { en: "Changing the brand color across the entire product means changing a single token. No find-and-replace, nothing forgotten.", pt: "Mudar a cor da marca em todo o produto significa mudar um único token. Sem buscar e substituir, sem esquecer nada." } },
            { icon: Layers,     color: "text-violet-400", bg: "bg-violet-500/10", title: { en: "Themes without rework", pt: "Temas sem retrabalho" }, body: { en: "Light mode, dark mode, high contrast — each theme is just a different set of values for the same token names.", pt: "Light mode, dark mode, alto contraste — cada tema é apenas um conjunto diferente de valores para os mesmos nomes de token." } },
            { icon: Code2,      color: "text-blue-400",  bg: "bg-blue-500/10",  title: { en: "Design and code aligned", pt: "Design e código alinhados" }, body: { en: "The designer calls it 'Primary', the dev uses --primary. The same name in both places eliminates manual translation and errors.", pt: "O designer chama de 'Primary', o dev usa --primary. O mesmo nome nos dois lugares elimina tradução manual e erros." } },
          ].map(p => (
            <div key={p.title.en} className="rounded-[14px] border border-border bg-card p-4 space-y-2.5" style={{ boxShadow: "var(--shadow-xs)" }}>
              <div className={`h-8 w-8 rounded-[9px] ${p.bg} flex items-center justify-center`}>
                <p.icon className={`h-4 w-4 ${p.color}`} />
              </div>
              <p className="text-[0.8125rem] font-bold text-foreground">{bi(p.title)}</p>
              <p className="text-[0.75rem] text-muted-foreground leading-relaxed">{bi(p.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. THE THREE LAYERS — why the designer
             defines the first one if the code is different
      ══════════════════════════════════════ */}
      <section className="space-y-5" id="tokens-hierarchy">
        <SectionTitle
          label={t("Hierarchy", "Hierarquia")}
          title={t("Why three layers?", "Por que três camadas?")}
          subtitle={t("The designer defines the primitives layer because it is the catalog — the vocabulary of everything that exists in the system. Semantics are the usage decisions made on top of that vocabulary. The code implements the same decisions using the same names.", "O designer define a camada de primitivos porque ela é o catálogo — o vocabulário de tudo que existe no sistema. Os semânticos são as decisões de uso tomadas sobre esse vocabulário. O código implementa as mesmas decisões usando os mesmos nomes.")}
        />

        {/* Visual of the three layers */}
        <div className="rounded-[16px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
          {/* Flow diagram */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_32px_1fr_32px_1fr] gap-0 items-stretch">

            {/* Layer 1 */}
            <div className="rounded-[12px] border border-border bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/40">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t("Layer 1 — Primitives", "Camada 1 — Primitivos")}</p>
                <p className="text-[0.9375rem] font-black text-foreground mt-0.5">{t("The catalog", "O catálogo")}</p>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                  {t("All the raw values the system can use: the full color palette, the size scale, the font weights. They carry no intent — they are just raw material.", "Todos os valores brutos que o sistema pode usar: a paleta de cores completa, a escala de tamanhos, os pesos de fonte. Eles não carregam intenção — são só matéria-prima.")}
                </p>
                <div className="rounded-[8px] bg-background border border-border p-2.5 space-y-1.5 font-mono text-[0.625rem]">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#D44D4D" }} />
                    <span className="text-violet-400">--crimson-400</span>
                    <span className="text-muted-foreground ml-auto">#D44D4D</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#B82828" }} />
                    <span className="text-violet-400">--crimson-500</span>
                    <span className="text-muted-foreground ml-auto">#B82828</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#0D1119" }} />
                    <span className="text-violet-400">--graphite-950</span>
                    <span className="text-muted-foreground ml-auto">#0D1119</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: "#EDF0F5", border: "1px solid var(--border)" }} />
                    <span className="text-violet-400">--graphite-50</span>
                    <span className="text-muted-foreground ml-auto">#EDF0F5</span>
                  </div>
                </div>
                <div className="rounded-[6px] bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5">
                  <p className="text-[0.5625rem] text-amber-500/80 leading-snug">
                    <strong>{t("Rule:", "Regra:")}</strong> {t("primitives are never applied directly to components.", "primitivos nunca são aplicados diretamente aos componentes.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="flex md:hidden items-center justify-center h-6 my-1">
              <div className="h-full w-px border-l border-dashed border-border" />
            </div>

            {/* Layer 2 */}
            <div className="rounded-[12px] border border-primary/30 bg-primary/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-primary/20 bg-primary/8">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-primary/60">{t("Layer 2 — Semantics", "Camada 2 — Semânticos")}</p>
                <p className="text-[0.9375rem] font-black text-foreground mt-0.5">{t("The decisions", "As decisões")}</p>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                  {lang === "pt" ? <>Eles dão <strong className="text-foreground">intenção</strong> aos primitivos. Dizem "este primitivo É a cor primária da marca". O valor muda por tema — o nome continua o mesmo.</> : <>They give primitives <strong className="text-foreground">intent</strong>. They say "this primitive IS the brand's primary color". Their value changes per theme — the name stays the same.</>}
                </p>
                <div className="rounded-[8px] bg-background border border-border p-2.5 space-y-1.5 font-mono text-[0.625rem]">
                  <div><span className="text-primary">--primary</span><span className="text-muted-foreground">: var(--crimson-400);</span></div>
                  <div><span className="text-primary">--background</span><span className="text-muted-foreground">: var(--graphite-50);</span></div>
                  <div className="border-t border-border/60 pt-1.5 text-muted-foreground/50 text-[0.5625rem]">.dark {"{"}</div>
                  <div className="pl-2"><span className="text-primary">--background</span><span className="text-muted-foreground">: var(--graphite-950);</span></div>
                  <div className="text-muted-foreground/50 text-[0.5625rem">{"}"}</div>
                </div>
                <div className="rounded-[6px] bg-success/10 border border-success/20 px-2.5 py-1.5">
                  <p className="text-[0.5625rem] text-success/80 leading-snug">
                    {lang === "pt" ? <><strong>Mesmos nomes</strong> no Figma e no CSS — essa é a ponte entre os dois times.</> : <><strong>Same names</strong> in Figma and CSS — that is the bridge between the two teams.</>}
                  </p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="flex md:hidden items-center justify-center h-6 my-1">
              <div className="h-full w-px border-l border-dashed border-border" />
            </div>

            {/* Layer 3 */}
            <div className="rounded-[12px] border border-border bg-muted/30 overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/40">
                <p className="text-[0.5625rem] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">{t("Layer 3 — Component", "Camada 3 — Componente")}</p>
                <p className="text-[0.9375rem] font-black text-foreground mt-0.5">{t("Application", "Aplicação")}</p>
              </div>
              <div className="px-4 py-3 space-y-2.5">
                <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                  {t("Component-specific tokens that reference semantics. They let you tune one component without affecting the entire system.", "Tokens específicos de componente que referenciam semânticos. Permitem ajustar um componente sem afetar o sistema inteiro.")}
                </p>
                <div className="rounded-[8px] bg-background border border-border p-2.5 space-y-1.5 font-mono text-[0.625rem]">
                  <div><span className="text-blue-400">button.bg</span><span className="text-muted-foreground">: var(--primary);</span></div>
                  <div><span className="text-blue-400">button.radius</span><span className="text-muted-foreground">: var(--radius);</span></div>
                  <div><span className="text-blue-400">card.border</span><span className="text-muted-foreground">: var(--border);</span></div>
                  <div><span className="text-blue-400">input.bg</span><span className="text-muted-foreground">: var(--muted);</span></div>
                </div>
                <div className="rounded-[6px] bg-blue-500/10 border border-blue-500/20 px-2.5 py-1.5">
                  <p className="text-[0.5625rem] text-blue-400/80 leading-snug">
                    {lang === "pt" ? <>Esta camada é <strong>opcional</strong> — muitos sistemas vão direto do semântico para o componente.</> : <>This layer is <strong>optional</strong> — many systems skip straight from semantic to component.</>}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Why the designer defines primitives */}
          <div className="px-5 py-4 border-t border-border bg-muted/10">
            <p className="text-[0.75rem] font-bold text-foreground mb-1">{t("Answering the question: \"why does the designer define primitives if the code has them too?\"", "Respondendo à pergunta: \"por que o designer define primitivos se o código também os tem?\"")}</p>
            <p className="text-[0.75rem] text-muted-foreground leading-relaxed max-w-3xl">
              {lang === "pt" ? <>Porque os primitivos são o <strong className="text-foreground">vocabulário combinado entre os dois times</strong>. O designer lista no Figma toda cor que existe no sistema (a paleta). O dev lista as mesmas cores no CSS. Quando o designer diz "Primary é <InlineCode>crimson-400</InlineCode>", o dev já sabe exatamente qual é o hex — sem precisar trocar mensagens. O código não é "diferente" do Figma: ambos implementam a mesma decisão, em ferramentas diferentes.</> : <>Because primitives are the <strong className="text-foreground">vocabulary agreed between the two teams</strong>. The designer lists in Figma every color that exists in the system (the palette). The dev lists the same colors in CSS. When the designer says "Primary is <InlineCode>crimson-400</InlineCode>", the dev already knows exactly which hex that is — no need to exchange messages. The code is not "different" from Figma: both implement the same decision, in different tools.</>}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. DESIGNER GUIDE — how to define tokens correctly
      ══════════════════════════════════════ */}
      <section className="space-y-5" id="tokens-design">
        <SectionTitle
          label={t("Practical guide", "Guia prático")}
          title={t("How designers define tokens correctly", "Como designers definem tokens corretamente")}
          subtitle={t("A step-by-step guide to creating Figma variables that translate directly to code — without ambiguity or rework.", "Um passo a passo para criar variáveis no Figma que se traduzem direto em código — sem ambiguidade nem retrabalho.")}
        />

        {/* Steps */}
        <div className="space-y-3">
          {[
            {
              step: "01",
              title: { en: "Create the Primitives collection in Figma", pt: "Crie a coleção Primitives no Figma" },
              color: "border-l-violet-500",
              body: { en: "In Assets → Variables → New Collection, name it \"Primitives\". Add every palette color using the exact names the dev will use in CSS. Example: crimson-400, graphite-950.", pt: "Em Assets → Variables → New Collection, nomeie como \"Primitives\". Adicione cada cor da paleta usando exatamente os nomes que o dev usará no CSS. Exemplo: crimson-400, graphite-950." },
              do: { en: ["Names identical to CSS: crimson-400, graphite-50", "One value per primitive — no aliases here", "Include every step of the scale (50 to 950)"], pt: ["Nomes idênticos ao CSS: crimson-400, graphite-50", "Um valor por primitivo — sem aliases aqui", "Inclua todos os passos da escala (50 a 950)"] },
              dont: { en: ["Don't name them 'Dark red' or 'Gray background'", "Don't apply primitives directly to components", "Don't create primitives without a CSS counterpart"], pt: ["Não use nomes como 'Vermelho escuro' ou 'Fundo cinza'", "Não aplique primitivos diretamente nos componentes", "Não crie primitivos sem equivalente no CSS"] },
            },
            {
              step: "02",
              title: { en: "Create the Semantic collection with aliases", pt: "Crie a coleção Semantic com aliases" },
              color: "border-l-primary",
              body: { en: "New collection named \"Semantics\". Each variable here is an alias to a primitive — never a raw hex value. Set up two modes: Light and Dark.", pt: "Nova coleção chamada \"Semantics\". Cada variável aqui é um alias para um primitivo — nunca um hex solto. Configure dois modos: Light e Dark." },
              do: { en: ["Primary → alias to crimson-400", "Background/Light → graphite-50 | Background/Dark → graphite-950", "Names describe intent: Primary, Background, Muted"], pt: ["Primary → alias para crimson-400", "Background/Light → graphite-50 | Background/Dark → graphite-950", "Nomes descrevem intenção: Primary, Background, Muted"] },
              dont: { en: ["Never paste a hex directly — always alias a primitive", "Don't create tokens that duplicate others (e.g. 'ButtonColor' when 'Primary' already works)", "Don't use visual names: 'BrandRed', 'LightBackground'"], pt: ["Nunca cole um hex direto — sempre faça alias de um primitivo", "Não crie tokens que duplicam outros (ex.: 'ButtonColor' quando 'Primary' já resolve)", "Não use nomes visuais: 'BrandRed', 'LightBackground'"] },
            },
            {
              step: "03",
              title: { en: "Apply semantics to components", pt: "Aplique os semânticos nos componentes" },
              color: "border-l-blue-500",
              body: { en: "When building or editing a component in Figma, every color, radius and spacing property must reference the Semantic collection — not Primitives, not a manual hex.", pt: "Ao construir ou editar um componente no Figma, toda propriedade de cor, raio e espaçamento deve referenciar a coleção Semantic — não Primitives, nem um hex manual." },
              do: { en: ["Button fill → Primary variable", "Label text → Foreground variable", "Borders → Border variable"], pt: ["Preenchimento do botão → variável Primary", "Texto do rótulo → variável Foreground", "Bordas → variável Border"] },
              dont: { en: ["Never use a Fill with a manual hex in components", "Never use a Primitives variable directly in a component", "Never guess a value — look it up in the collection"], pt: ["Nunca use um Fill com hex manual nos componentes", "Nunca use uma variável de Primitives direto em um componente", "Nunca chute um valor — consulte a coleção"] },
            },
            {
              step: "04",
              title: { en: "Keep it in sync with the CSS", pt: "Mantenha sincronizado com o CSS" },
              color: "border-l-success",
              body: { en: "Every time a new token is created in Figma, the dev needs to add the matching variable in theme.css. Adopt a PR convention: token changes always include updates on both ends.", pt: "Sempre que um novo token é criado no Figma, o dev precisa adicionar a variável correspondente no theme.css. Adote uma convenção de PR: mudanças de token sempre incluem atualizações nas duas pontas." },
              do: { en: ["Token PR: includes Figma + CSS + documentation", "Review this design system's token table every sprint", "Name things exactly the same: Primary in Figma = --primary in CSS"], pt: ["PR de token: inclui Figma + CSS + documentação", "Revise a tabela de tokens deste design system a cada sprint", "Use exatamente o mesmo nome: Primary no Figma = --primary no CSS"] },
              dont: { en: ["Don't add a token only in Figma without telling the dev", "Don't use approximate values — if the token doesn't exist, create it first", "Don't rename tokens without aligning with the whole team"], pt: ["Não adicione um token só no Figma sem avisar o dev", "Não use valores aproximados — se o token não existe, crie-o primeiro", "Não renomeie tokens sem alinhar com o time todo"] },
            },
          ].map(s => (
            <div key={s.step} className={`rounded-[14px] border border-border bg-card overflow-hidden border-l-[3px] ${s.color}`} style={{ boxShadow: "var(--shadow-xs)" }}>
              <div className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="text-[0.625rem] font-black text-muted-foreground/40 font-mono mt-0.5 w-6 shrink-0">{s.step}</span>
                  <div className="flex-1 space-y-3">
                    <p className="text-[0.875rem] font-bold text-foreground">{bi(s.title)}</p>
                    <p className="text-[0.75rem] text-muted-foreground leading-relaxed">{bi(s.body)}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-[10px] bg-success/5 border border-success/20 p-3 space-y-1.5">
                        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-success">✓ {t("Do", "Faça")}</p>
                        {bi(s.do).map(d => (
                          <p key={d} className="text-[0.6875rem] text-muted-foreground leading-snug flex items-start gap-1.5">
                            <span className="text-success mt-0.5 shrink-0">·</span>{d}
                          </p>
                        ))}
                      </div>
                      <div className="rounded-[10px] bg-destructive/5 border border-destructive/20 p-3 space-y-1.5">
                        <p className="text-[0.5625rem] font-bold uppercase tracking-[0.08em] text-destructive">✕ {t("Don't", "Não faça")}</p>
                        {bi(s.dont).map(d => (
                          <p key={d} className="text-[0.6875rem] text-muted-foreground leading-snug flex items-start gap-1.5">
                            <span className="text-destructive mt-0.5 shrink-0">·</span>{d}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. AI AND TOKENS
      ══════════════════════════════════════ */}
      <section className="space-y-5" id="tokens-ia">
        <SectionTitle
          label={t("Artificial Intelligence", "Inteligência Artificial")}
          title={t("AI and tokens: opportunities and pitfalls", "IA e tokens: oportunidades e armadilhas")}
          subtitle={t("AI tools generate code and design very quickly — but by default they ignore tokens. Understanding this is essential to keeping the system consistent.", "Ferramentas de IA geram código e design muito rápido — mas, por padrão, ignoram tokens. Entender isso é essencial para manter o sistema consistente.")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Pitfalls */}
          <div className="rounded-[14px] border border-destructive/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="px-5 py-3 border-b border-destructive/20 flex items-center gap-2" style={{ background: "rgba(212,77,77,0.05)" }}>
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
              <p className="text-[0.8125rem] font-bold text-foreground">{t("Common pitfalls", "Armadilhas comuns")}</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                {
                  title: { en: "AI generates hardcoded hex", pt: "A IA gera hex fixo no código" },
                  body: { en: "When you ask for \"create a red button\", the AI writes background: #D44D4D or bg-red-500. That code violates the token system and breaks when the theme changes.", pt: "Quando você pede \"crie um botão vermelho\", a IA escreve background: #D44D4D ou bg-red-500. Esse código viola o sistema de tokens e quebra quando o tema muda." },
                  fix: { en: "Always review the generated code and replace literal colors with the matching token.", pt: "Sempre revise o código gerado e troque as cores literais pelo token correspondente." },
                },
                {
                  title: { en: "AI invents token names", pt: "A IA inventa nomes de token" },
                  body: { en: "Tools like Copilot or Cursor may suggest --brand-color, --accent-red, or $primary-button without knowing which tokens exist in your system.", pt: "Ferramentas como Copilot ou Cursor podem sugerir --brand-color, --accent-red ou $primary-button sem saber quais tokens existem no seu sistema." },
                  fix: { en: "Give the AI the tokens file as context, or list the allowed tokens in the prompt.", pt: "Dê o arquivo de tokens como contexto para a IA, ou liste os tokens permitidos no prompt." },
                },
                {
                  title: { en: "AI design plugins ignore variables", pt: "Plugins de design com IA ignoram variáveis" },
                  body: { en: "UI generation tools in Figma (Galileo, Relume, etc.) create components with absolute colors — without binding them to your collection's Variables.", pt: "Ferramentas de geração de UI no Figma (Galileo, Relume etc.) criam componentes com cores absolutas — sem vinculá-las às Variables da sua coleção." },
                  fix: { en: "After importing, manually bind each fill and stroke to the system's semantic variables.", pt: "Depois de importar, vincule manualmente cada fill e stroke às variáveis semânticas do sistema." },
                },
              ].map(item => (
                <div key={item.title.en} className="space-y-1">
                  <p className="text-[0.75rem] font-bold text-foreground">{bi(item.title)}</p>
                  <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">{bi(item.body)}</p>
                  <div className="flex items-start gap-1.5 rounded-[6px] bg-muted/40 px-2.5 py-1.5">
                    <span className="text-[0.5625rem] font-bold text-success shrink-0 mt-0.5">↳</span>
                    <p className="text-[0.6875rem] text-muted-foreground">{bi(item.fix)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opportunities */}
          <div className="rounded-[14px] border border-success/30 bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="px-5 py-3 border-b border-success/20 flex items-center gap-2" style={{ background: "rgba(79,181,123,0.05)" }}>
              <Sparkles className="h-4 w-4 text-success shrink-0" />
              <p className="text-[0.8125rem] font-bold text-foreground">{t("How to make AI work for you", "Como fazer a IA trabalhar a seu favor")}</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                {
                  title: { en: "Prompt with token context", pt: "Prompt com contexto de tokens" },
                  body: { en: 'When asking the AI to generate a component, include in the prompt: "use only design tokens from this list: --primary, --background, --muted, --border". The AI follows the constraint.', pt: 'Ao pedir para a IA gerar um componente, inclua no prompt: "use apenas design tokens desta lista: --primary, --background, --muted, --border". A IA segue a restrição.' },
                },
                {
                  title: { en: "Token audit with AI", pt: "Auditoria de tokens com IA" },
                  body: { en: "Ask the AI to scan the codebase and list every place with hardcoded hex or raw Tailwind classes (red-500, gray-200) instead of semantic tokens.", pt: "Peça para a IA varrer o código e listar todo lugar com hex fixo ou classes Tailwind cruas (red-500, gray-200) no lugar de tokens semânticos." },
                },
                {
                  title: { en: "Token generation for new themes", pt: "Geração de tokens para novos temas" },
                  body: { en: "With the primitive palette defined, the AI can suggest semantic mappings for special themes (high contrast, partner brand theme). Review and adjust, but the first draft is quick.", pt: "Com a paleta de primitivos definida, a IA pode sugerir mapeamentos semânticos para temas especiais (alto contraste, tema de marca parceira). Revise e ajuste, mas o primeiro rascunho sai rápido." },
                },
                {
                  title: { en: "Figma ↔ CSS synchronization", pt: "Sincronização Figma ↔ CSS" },
                  body: { en: "Emerging tools (Tokens Studio, Style Dictionary + AI) already export Figma variables directly to CSS tokens. This removes the manual step and reduces sync errors.", pt: "Ferramentas emergentes (Tokens Studio, Style Dictionary + IA) já exportam variáveis do Figma direto para tokens CSS. Isso elimina o passo manual e reduz erros de sincronia." },
                },
              ].map(item => (
                <div key={item.title.en} className="space-y-1">
                  <p className="text-[0.75rem] font-bold text-foreground">{bi(item.title)}</p>
                  <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">{bi(item.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Example prompt */}
        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[0.625rem] font-mono text-muted-foreground">{t("Example AI prompt", "Exemplo de prompt para IA")}</span>
            </div>
            <CopyBtn text={t(`Generate a card component in React with Tailwind CSS. Use ONLY the following semantic design tokens:\n\nColors: bg-background, bg-card, bg-muted, bg-primary, text-foreground, text-muted-foreground, text-primary-foreground, border-border\nRadius: rounded-[var(--radius)]\nShadow: shadow with var(--shadow-sm)\n\nDO NOT use literal Tailwind colors (red-500, gray-200) or hex (#...).\nThe component must work in light and dark mode automatically.`, `Gere um componente de card em React com Tailwind CSS. Use APENAS os seguintes design tokens semânticos:\n\nCores: bg-background, bg-card, bg-muted, bg-primary, text-foreground, text-muted-foreground, text-primary-foreground, border-border\nRaio: rounded-[var(--radius)]\nSombra: shadow com var(--shadow-sm)\n\nNÃO use cores literais do Tailwind (red-500, gray-200) nem hex (#...).\nO componente deve funcionar automaticamente em light e dark mode.`)} />
          </div>
          <div className="p-4 font-mono text-[0.6875rem] leading-relaxed space-y-1" style={{ color: "var(--muted-foreground)" }}>
            <p>{t("Generate a card component in React with Tailwind CSS.", "Gere um componente de card em React com Tailwind CSS.")}</p>
            <p>{lang === "pt" ? <>Use <strong className="text-foreground">APENAS</strong> os seguintes design tokens semânticos:</> : <>Use <strong className="text-foreground">ONLY</strong> the following semantic design tokens:</>}</p>
            <div className="mt-2 space-y-1 pl-3 border-l-2 border-primary/30">
              <p><span className="text-violet-400">{t("Colors:", "Cores:")}</span> <span className="text-success">bg-background, bg-card, bg-muted, bg-primary,</span></p>
              <p className="pl-10"><span className="text-success">text-foreground, text-muted-foreground, border-border</span></p>
              <p><span className="text-violet-400">{t("Radius:", "Raio:")}</span> <span className="text-success">rounded-[var(--radius)]</span></p>
              <p><span className="text-violet-400">{t("Shadow:", "Sombra:")}</span> <span className="text-success">var(--shadow-sm)</span></p>
            </div>
            <p className="mt-2"><span className="text-destructive">{t("DO NOT", "NÃO")}</span> {t("use literal Tailwind colors (red-500, gray-200) or hex (#...).", "use cores literais do Tailwind (red-500, gray-200) nem hex (#...).")}</p>
            <p>{lang === "pt" ? <>O componente deve funcionar em light e dark mode <strong className="text-foreground">automaticamente</strong>.</> : <>The component must work in light and dark mode <strong className="text-foreground">automatically</strong>.</>}</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. RESPONSIBILITIES
      ══════════════════════════════════════ */}
      <section className="space-y-4">
        <SectionTitle
          label={t("Teams", "Times")}
          title={t("Who does what", "Quem faz o quê")}
          subtitle={t("Each team has clear responsibilities in a token's lifecycle.", "Cada time tem responsabilidades claras no ciclo de vida de um token.")}
        />

        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.75rem]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-bold text-foreground w-52">{t("Action", "Ação")}</th>
                  <th className="text-left px-4 py-3 font-bold text-violet-400">{t("Design (Figma)", "Design (Figma)")}</th>
                  <th className="text-left px-4 py-3 font-bold text-blue-400">{t("Dev (CSS/Tailwind)", "Dev (CSS/Tailwind)")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {[
                  { action: { en: "Create token", pt: "Criar token" }, design: { en: "Defines name, intent and alias to a primitive in the Semantics collection", pt: "Define nome, intenção e alias para um primitivo na coleção Semantics" }, dev: { en: "Adds --token in theme.css and maps it in @theme inline", pt: "Adiciona --token no theme.css e mapeia em @theme inline" } },
                  { action: { en: "Change value", pt: "Alterar valor" }, design: { en: "Updates the alias in the collection (e.g. Primary → new shade)", pt: "Atualiza o alias na coleção (ex.: Primary → novo tom)" }, dev: { en: "Updates the value in theme.css — the whole interface inherits it", pt: "Atualiza o valor no theme.css — a interface inteira herda" } },
                  { action: { en: "New theme", pt: "Novo tema" }, design: { en: "Creates a new Mode in the collection with the theme values", pt: "Cria um novo Mode na coleção com os valores do tema" }, dev: { en: "Adds a CSS selector (.theme-x) with the theme's custom properties", pt: "Adiciona um seletor CSS (.theme-x) com as custom properties do tema" } },
                  { action: { en: "Use in component", pt: "Usar no componente" }, design: { en: "Applies semantic variable via Fill/Stroke/Corner — never hex", pt: "Aplica a variável semântica via Fill/Stroke/Corner — nunca hex" }, dev: { en: "Uses semantic Tailwind class (bg-card) or var(--token) — never hex", pt: "Usa classe Tailwind semântica (bg-card) ou var(--token) — nunca hex" } },
                  { action: { en: "Name token", pt: "Nomear token" }, design: { en: "Name describes intent: 'Primary', not 'BrandRed'", pt: "O nome descreve a intenção: 'Primary', não 'BrandRed'" }, dev: { en: "Same name in kebab-case: --primary, not --brand-red", pt: "Mesmo nome em kebab-case: --primary, não --brand-red" } },
                  { action: { en: "Sync", pt: "Sincronizar" }, design: { en: "Ensures the Figma collection mirrors the same set as the CSS", pt: "Garante que a coleção do Figma espelhe o mesmo conjunto do CSS" }, dev: { en: "Ensures theme.css reflects all tokens in the Figma collection", pt: "Garante que o theme.css reflita todos os tokens da coleção do Figma" } },
                ].map(row => (
                  <tr key={row.action.en} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3 font-semibold text-foreground align-top">{bi(row.action)}</td>
                    <td className="px-4 py-3 text-muted-foreground align-top">{bi(row.design)}</td>
                    <td className="px-4 py-3 text-muted-foreground align-top">{bi(row.dev)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. MAPPING TABLE
      ══════════════════════════════════════ */}
      <section className="space-y-4" id="tokens-bridge">
        <SectionTitle
          label={t("Reference", "Referência")}
          title={t("Design ↔ Dev Mapping", "Mapeamento Design ↔ Dev")}
          subtitle={t("Complete map: intent, Figma name, CSS property and Tailwind class. Hover to copy any value.", "Mapa completo: intenção, nome no Figma, propriedade CSS e classe Tailwind. Passe o mouse para copiar qualquer valor.")}
        />

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[0.6875rem] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/40 text-muted-foreground border-border hover:bg-muted/70"
              }`}>{bi(catLabel[cat])}</button>
          ))}
        </div>

        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.6875rem]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-bold text-muted-foreground w-28">{t("Category", "Categoria")}</th>
                  <th className="text-left px-3 py-2.5 font-bold text-muted-foreground">{t("Intent", "Intenção")}</th>
                  <th className="text-left px-3 py-2.5 font-bold text-violet-400">Design Token</th>
                  <th className="text-left px-3 py-2.5 font-bold text-blue-400">CSS / Dev</th>
                  <th className="text-left px-3 py-2.5 font-bold text-muted-foreground">Tailwind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors group">
                    <td className="px-4 py-2.5">
                      <Pill color={catPill[row.category] ?? "muted"}>{bi(catLabel[row.category])}</Pill>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{bi(row.intent)}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-violet-400">{row.design}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyBtn text={row.design} />
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-blue-400">{row.dev}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyBtn text={row.dev} />
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-success/80">{row.tw}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <CopyBtn text={row.tw} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. HOW THEY ARE DEFINED — real code
      ══════════════════════════════════════ */}
      <section className="space-y-4" id="tokens-definition">
        <SectionTitle
          label={t("Implementation", "Implementação")}
          title={t("How tokens are defined in code", "Como os tokens são definidos no código")}
          subtitle={t("Anatomy of the token files in this design system.", "Anatomia dos arquivos de tokens deste design system.")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400/60" />
                <div className="h-2 w-2 rounded-full bg-amber-400/60" />
                <div className="h-2 w-2 rounded-full bg-success/60" />
                <span className="text-[0.625rem] font-mono text-muted-foreground ml-2">src/styles/theme.css</span>
              </div>
              <span className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-muted-foreground/60">{t("Definition", "Definição")}</span>
            </div>
            <pre className="px-4 py-4 text-[0.6875rem] font-mono leading-relaxed overflow-x-auto" style={{ color: "var(--muted-foreground)" }}>
{``}<span style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>{"/* 1. Primitives — raw values */"}</span>{`
`}<span style={{ color: "#3b82f6" }}>:root</span>{` {
  `}<span style={{ color: "#8B5CF6" }}>--crimson-400</span>{`: `}<span style={{ color: "var(--success)" }}>#D44D4D</span>{`;
  `}<span style={{ color: "#8B5CF6" }}>--graphite-50</span>{`:  `}<span style={{ color: "var(--success)" }}>#EDF0F5</span>{`;
  `}<span style={{ color: "#8B5CF6" }}>--graphite-950</span>{`: `}<span style={{ color: "var(--success)" }}>#0D1119</span>{`;
}

`}<span style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>{"/* 2. Semantics — reference primitives */"}</span>{`
`}<span style={{ color: "#3b82f6" }}>:root</span>{` {
  `}<span style={{ color: "#8B5CF6" }}>--primary</span>{`:    `}<span style={{ color: "var(--success)" }}>var(--crimson-400)</span>{`;
  `}<span style={{ color: "#8B5CF6" }}>--background</span>{`: `}<span style={{ color: "var(--success)" }}>var(--graphite-50)</span>{`;
}
`}<span style={{ color: "#3b82f6" }}>.dark</span>{` {
  `}<span style={{ color: "#8B5CF6" }}>--background</span>{`: `}<span style={{ color: "var(--success)" }}>var(--graphite-950)</span>{`;
}`}
            </pre>
          </div>

          <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-400/60" />
                <div className="h-2 w-2 rounded-full bg-amber-400/60" />
                <div className="h-2 w-2 rounded-full bg-success/60" />
                <span className="text-[0.625rem] font-mono text-muted-foreground ml-2">src/styles/index.css</span>
              </div>
              <span className="text-[0.5625rem] font-bold uppercase tracking-[0.07em] text-muted-foreground/60">{t("Tailwind mapping", "Mapeamento Tailwind")}</span>
            </div>
            <pre className="px-4 py-4 text-[0.6875rem] font-mono leading-relaxed overflow-x-auto" style={{ color: "var(--muted-foreground)" }}>
{``}<span style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>{"/* Exposes tokens as Tailwind classes */"}</span>{`
`}<span style={{ color: "#f59e0b" }}>@theme inline</span>{` {
  `}<span style={{ color: "#8B5CF6" }}>--color-primary</span>{`:
    `}<span style={{ color: "var(--success)" }}>var(--primary)</span>{`;

  `}<span style={{ color: "#8B5CF6" }}>--color-background</span>{`:
    `}<span style={{ color: "var(--success)" }}>var(--background)</span>{`;
}

`}<span style={{ color: "var(--muted-foreground)", opacity: 0.45 }}>{"/* Usage in the component */"}</span>{`
`}<span style={{ color: "#f59e0b" }}>className</span>{`="`}<span style={{ color: "var(--success)" }}>bg-primary text-foreground</span>{`"`}
            </pre>
          </div>
        </div>

        <div className="rounded-[14px] border border-primary/20 bg-primary/5 px-5 py-4 flex items-start gap-3">
          <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="text-[0.8125rem] font-bold text-foreground">{t("Golden rule", "Regra de ouro")}</p>
            <p className="text-[0.75rem] text-muted-foreground leading-relaxed mt-0.5">
              {lang === "pt" ? <>Nos componentes, <strong className="text-foreground">use sempre classes Tailwind semânticas</strong> (<InlineCode>bg-primary</InlineCode>, <InlineCode>text-foreground</InlineCode>, <InlineCode>border-border</InlineCode>) — nunca cores literais (<InlineCode>bg-red-500</InlineCode>, <InlineCode>bg-[#D44D4D]</InlineCode>). Isso garante que o componente funcione em qualquer tema, agora e no futuro.</> : <>In components, <strong className="text-foreground">always use semantic Tailwind classes</strong> (<InlineCode>bg-primary</InlineCode>, <InlineCode>text-foreground</InlineCode>, <InlineCode>border-border</InlineCode>) — never literal colors (<InlineCode>bg-red-500</InlineCode>, <InlineCode>bg-[#D44D4D]</InlineCode>). This ensures the component works in any theme, now and in the future.</>}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
