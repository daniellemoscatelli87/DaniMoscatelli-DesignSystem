import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { categoriasLucide, versaoLucide } from "../ui/lucide-catalogo";
import * as IconesPreservados from "../ui/icones-preservados";
import { nomesIconesPreservados } from "../ui/icones-preservados";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";

const {
  Zap, Bell, Settings, Search, Check, Plus, Download, Filter,
  MoreHorizontal, AlertCircle, CheckCircle, Clock,
} = LucideIcons;

/* ─────────────────────────────────────────────
   All icon categories
───────────────────────────────────────────── */
type IconEntry = { icon: React.ElementType; label: string };
type IconCategory = { name: string; pt: string; icons: IconEntry[] };

/* Biblioteca completa da Lucide (categorias oficiais) + ícones que o DS mantém fora da Lucide atual */
const iconesLucide = (LucideIcons as unknown as { icons: Record<string, React.ElementType> }).icons;
const iconCategories: IconCategory[] = [
  ...categoriasLucide.map(c => ({ name: c.en, pt: c.pt, icons: c.icones.map(n => ({ icon: iconesLucide[n], label: n })) })),
  {
    name: "Brands (kept in the DS)",
    pt: "Marcas (mantidas no DS)",
    icons: nomesIconesPreservados.map(n => ({ icon: IconesPreservados[n] as React.ElementType, label: n })),
  },
];

/* Filter out any entries where the icon resolved to undefined/null */
const safeCategories = iconCategories.map(cat => ({
  ...cat,
  icons: cat.icons.filter(({ icon }) => icon != null),
}));

const totalIcons = safeCategories.reduce((acc, c) => acc + c.icons.length, 0);

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const sizes = [
  { label: "XS",   px: 12 },
  { label: "SM",   px: 16 },
  { label: "MD",   px: 20 },
  { label: "LG",   px: 24 },
  { label: "XL",   px: 32 },
  { label: "2XL",  px: 40 },
];

const colorLabelPt: Record<string, string> = {
  Foreground: "Foreground", Muted: "Muted", Primary: "Primária", Success: "Sucesso", Warning: "Alerta", Info: "Info",
};

const colorVariants = [
  { label: "Foreground",  cls: "text-foreground" },
  { label: "Muted",       cls: "text-muted-foreground" },
  { label: "Primary",     cls: "text-primary" },
  { label: "Success",     cls: "text-success" },
  { label: "Warning",     cls: "text-warning" },
  { label: "Info",        cls: "text-info" },
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground">{description}</p>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card rounded-[16px] border border-border p-6 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function IconsShowcase() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (label: string) => {
    navigator.clipboard.writeText(label).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = search.trim()
    ? safeCategories
        .map(cat => ({
          ...cat,
          icons: cat.icons.filter(ic =>
            ic.label.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter(cat => cat.icons.length > 0)
    : safeCategories;

  const filteredTotal = filtered.reduce((acc, c) => acc + c.icons.length, 0);

  const localizedTokenGroups: TokenGroup[] = iconsTokenGroups.map(g => ({
    ...g,
    group: t(g.group, groupPt[g.group] ?? g.group),
    tokens: g.tokens.map(tk => ({ ...tk, description: t(tk.description, descPt[tk.name] ?? tk.description) })),
  }));

  return (
    <div className="space-y-16">

      {/* ── USAGE GUIDE ── */}
      <section id="icon-sizes">
        <SectionHeader
          title={t("Icons", "Ícones")}
          description={t("Outline Lucide React icons only. Never use filled, skeuomorphic, or heavy-stroke icons.", "Apenas ícones outline do Lucide React. Nunca use ícones preenchidos, esqueuomórficos ou de traço grosso.")}
        />

        <SubSection title={t("Sizes", "Tamanhos")}>
          <ShowcaseCard>
            <div className="flex flex-wrap items-end gap-8">
              {sizes.map(s => (
                <div key={s.label} className="flex flex-col items-center gap-3">
                  <Zap
                    style={{ width: s.px, height: s.px }}
                    className="text-foreground"
                    strokeWidth={1.75}
                  />
                  <div className="text-center">
                    <div className="text-[0.8125rem] font-semibold text-foreground">{s.label}</div>
                    <div className="text-[0.6875rem] text-muted-foreground font-mono">{s.px}px</div>
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Colors", "Cores")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {colorVariants.map(v => (
                <div key={v.label} className="flex flex-col items-center gap-2">
                  <Bell className={`w-5 h-5 ${v.cls}`} strokeWidth={1.75} />
                  <span className="text-[0.75rem] text-muted-foreground">{t(v.label, colorLabelPt[v.label] ?? v.label)}</span>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Stroke weight", "Espessura do traço")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { label: "1.25",           sw: 1.25 },
                { label: "1.5",            sw: 1.5  },
                { label: "1.75 (default)",  sw: 1.75 },
                { label: "2.0",            sw: 2    },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center gap-2">
                  <Settings className="w-6 h-6 text-foreground" strokeWidth={s.sw} />
                  <span
                    className={`text-[0.75rem] ${
                      s.sw === 1.75
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.sw === 1.75 ? t("1.75 (default)", "1.75 (padrão)") : s.label}
                  </span>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("In context", "Em contexto")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] bg-primary text-primary-foreground text-[0.9375rem] font-semibold hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" strokeWidth={2} /> {t("New", "Novo")}
              </button>
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] border border-border bg-card text-foreground text-[0.9375rem] font-semibold hover:bg-accent transition-colors">
                <Download className="w-4 h-4" strokeWidth={1.75} /> {t("Export", "Exportar")}
              </button>
              <button className="inline-flex items-center gap-2 h-10 px-4 rounded-[12px] border border-border bg-card text-foreground text-[0.9375rem] font-semibold hover:bg-accent transition-colors">
                <Filter className="w-4 h-4" strokeWidth={1.75} /> {t("Filter", "Filtrar")}
              </button>
              {([Search, Settings, Bell, MoreHorizontal] as React.ElementType[]).map((Icon, i) => (
                <button
                  key={i}
                  className="h-10 w-10 rounded-[12px] border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </button>
              ))}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-success/10 text-success border border-success/20">
                <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} /> {t("Active", "Ativo")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-primary/10 text-primary border border-primary/20">
                <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} /> {t("Alert", "Alerta")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[0.8125rem] font-medium bg-warning/10 text-warning border border-warning/20">
                <Clock className="w-3.5 h-3.5" strokeWidth={2} /> {t("Pending", "Pendente")}
              </span>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── LIBRARY ── */}
      <section id="icon-library">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">
              {t("Library", "Biblioteca")}
            </h2>
            <p className="text-[0.9375rem] text-muted-foreground">
              {search ? t(`${filteredTotal} of ${totalIcons}`, `${filteredTotal} de ${totalIcons}`) : totalIcons} {t("icons in", "ícones em")}{" "}
              {safeCategories.length} {t(`categories · Lucide ${versaoLucide} complete, plus brand icons kept in the DS · Click to copy the name`, `categorias · Lucide ${versaoLucide} completa, mais os ícones de marca mantidos no DS · Clique para copiar o nome`)}
            </p>
          </div>
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search icon...", "Buscar ícone...")}
              aria-label={t("Search icon", "Buscar ícone")}
              className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] pl-9 pr-3 py-2 text-[0.875rem] outline-none focus:ring-2 focus:ring-ring focus:border-primary/60 transition-all"
            />
          </div>
        </div>

        <div className="space-y-8">
          {filtered.map(cat => (
            <div key={cat.name}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  {t(cat.name, cat.pt)}
                </h3>
                <span className="text-[0.6875rem] text-muted-foreground/50 font-mono">
                  {cat.icons.length}
                </span>
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(76px,1fr))] gap-1">
                {cat.icons.map(({ icon: Icon, label }) => (
                  <button
                    key={`${cat.name}-${label}`}
                    onClick={() => handleCopy(label)}
                    title={label}
                    className={`flex flex-col items-center gap-2 p-3 rounded-[10px] border transition-all duration-150 cursor-pointer
                      ${copied === label
                        ? "border-primary/40 bg-primary/5 text-primary"
                        : "border-transparent hover:border-border hover:bg-accent text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {copied === label
                      ? <Check className="w-5 h-5 text-primary" strokeWidth={2} />
                      : <Icon className="w-5 h-5" strokeWidth={1.75} />
                    }
                    <span className="text-[0.5625rem] font-medium text-center leading-tight w-full truncate">
                      {copied === label ? t("Copied!", "Copiado!") : label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Search className="w-8 h-8 opacity-30" />
              <p className="text-[0.9rem]">
                {t("No icon found for", "Nenhum ícone encontrado para")}{" "}
                <strong className="text-foreground">"{search}"</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Tokens ── */}
      <section id="icons-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties for icon color, sizing, and context.", "Propriedades CSS customizadas para cor, tamanho e contexto dos ícones.")}</p>
        </div>
        <TokenTable groups={localizedTokenGroups} />
      </section>
    </div>
  );
}

const iconsTokenGroups: TokenGroup[] = [
  {
    group: "Icon Colors",
    tokens: [
      { name: "--foreground",       description: "Default / emphasis icon",    light: "#131A27", dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground", description: "Secondary / subdued icon",   light: "#627288", dark: "#8898B0", isColor: true },
      { name: "--foreground-subtle",description: "Decorative / disabled icon", light: "#8898B0", dark: "#627288", isColor: true },
      { name: "--primary",          description: "Accent / active icon",       light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--success",          description: "Confirmation / done icon",   light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--warning",          description: "Caution / alert icon",       light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--error",            description: "Error / danger icon",        light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--info",             description: "Informational icon",         light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--violet",           description: "Purple accent icon",         light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--orange",           description: "Orange accent icon",         light: "#fa9852", dark: "#ff8833", isColor: true },
    ],
  },
  {
    group: "Icon Containers",
    tokens: [
      { name: "--muted",            description: "Icon container background",  light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--primary-muted",    description: "Primary icon container bg",  light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
      { name: "--success-muted",    description: "Success icon container bg",  light: "rgba(79,181,123,0.10)",dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning-muted",    description: "Warning icon container bg",  light: "rgba(229,169,78,0.10)",dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--info-muted",       description: "Info icon container bg",     light: "rgba(68,138,188,0.10)",dark: "rgba(59,130,246,0.12)", isColor: true },
    ],
  },
  {
    group: "Sizing (Tailwind shortcuts)",
    tokens: [
      { name: "h-3 w-3",  description: "Extra small  (12px) — inline hint" },
      { name: "h-4 w-4",  description: "Small        (16px) — nav, labels" },
      { name: "h-5 w-5",  description: "Default      (20px) — body, buttons" },
      { name: "h-6 w-6",  description: "Medium       (24px) — section headers" },
      { name: "h-8 w-8",  description: "Large        (32px) — feature icons" },
      { name: "h-10 w-10",description: "Extra large  (40px) — hero / splash" },
    ],
  },
];

const groupPt: Record<string, string> = {
  "Icon Colors": "Cores de Ícone",
  "Icon Containers": "Containers de Ícone",
  "Sizing (Tailwind shortcuts)": "Tamanhos (atalhos do Tailwind)",
};

const descPt: Record<string, string> = {
  "--foreground": "Ícone padrão / de ênfase",
  "--muted-foreground": "Ícone secundário / discreto",
  "--foreground-subtle": "Ícone decorativo / desabilitado",
  "--primary": "Ícone de destaque / ativo",
  "--success": "Ícone de confirmação / concluído",
  "--warning": "Ícone de cautela / alerta",
  "--error": "Ícone de erro / perigo",
  "--info": "Ícone informativo",
  "--violet": "Ícone de destaque roxo",
  "--orange": "Ícone de destaque laranja",
  "--muted": "Fundo do container de ícone",
  "--primary-muted": "Fundo do container de ícone primário",
  "--success-muted": "Fundo do container de ícone de sucesso",
  "--warning-muted": "Fundo do container de ícone de alerta",
  "--info-muted": "Fundo do container de ícone de info",
  "h-3 w-3": "Extra pequeno  (12px) — dica inline",
  "h-4 w-4": "Pequeno        (16px) — nav, rótulos",
  "h-5 w-5": "Padrão         (20px) — corpo, botões",
  "h-6 w-6": "Médio          (24px) — cabeçalhos de seção",
  "h-8 w-8": "Grande         (32px) — ícones de destaque",
  "h-10 w-10": "Extra grande   (40px) — hero / splash",
};
