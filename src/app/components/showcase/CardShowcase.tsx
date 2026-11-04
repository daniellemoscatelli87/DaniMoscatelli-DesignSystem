import React, { useState } from "react";
import { Check, ChevronRight, Image, LayoutPanelTop, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ShineBorder } from "../ui/shine-border";
import { PartnerCard } from "../ui/partner-card";
import { GlassCard, GlassScene, glassTextContrast, glassSceneTexture, type GlassFinish, type GlassCardProps } from "../ui/glass-card";
import { resolveCssColor, formatRatio, AA } from "../ui/contrast";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { SegmentedControl } from "../ui/segmented-control";
import { Slider } from "../ui/slider";
import { AvatarCircles } from "../ui/avatar-circles";
import { ArrowUpRight, MapPin, Heart } from "lucide-react";
import { Handshake, Store } from "lucide-react";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, SubTitle, display } from "./shared/Guidance";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { cn } from "../ui/utils";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className={`${display} text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1`}>{title}</h2>
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground max-w-3xl">{description}</p>
    </div>
  );
}

function SpecCard({
  title,
  description,
  action,
  children,
  footer,
  className = "",
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`gap-5 border-border shadow-[var(--shadow-sm)] ${className}`}>
      <CardHeader className="gap-1.5">
        <CardTitle className={`${display} text-[1rem] font-semibold tracking-[-0.01em]`}>{title}</CardTitle>
        <CardDescription className="text-[0.8125rem] leading-relaxed">{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="border-t border-border">{footer}</CardFooter>}
    </Card>
  );
}


/** Observa o tema (classe .dark no html). */
function useIsDark() {
  const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  React.useEffect(() => {
    const obs = new MutationObserver(() => setDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/**
 * Card de teste: título e subtítulo reais sobre o vidro, com avaliação de contraste (WCAG AA)
 * e alerta dentro do card quando a configuração compromete a acessibilidade.
 */
function GlassTestCard({ finish, tone = "clara", intensity = "media", opacity, blur, tint, interactive, compact = false, eyebrow, title, subtitle, cta, className }: Pick<GlassCardProps, "finish" | "tone" | "intensity" | "opacity" | "blur" | "tint" | "interactive" | "className"> & { compact?: boolean; eyebrow?: string; title: string; subtitle: string; cta?: string }) {
  const { t } = useI18n();
  const dark = useIsDark();
  const escura = tone === "escura";
  const result = React.useMemo(() => {
    const sceneBg = resolveCssColor("var(--background)");
    const texture = resolveCssColor(dark ? glassSceneTexture.dark : glassSceneTexture.light);
    const titleColor = resolveCssColor(escura ? "#FFFFFF" : dark ? "#FFFFFF" : "var(--foreground)");
    const subColor = escura || dark ? resolveCssColor("rgba(255,255,255,0.7)") : resolveCssColor("var(--muted-foreground)");
    if (!sceneBg || !texture || !titleColor || !subColor) return null;
    // subtítulo a 70% de branco: compõe sobre a superfície dentro do cálculo
    // pior caso: o texto cruzando um traço da textura (a cor do traço é o fundo), não a média da cena
    void sceneBg;
    const base = glassTextContrast({ finish, tone, intensity, opacity, tint, darkTheme: dark, sceneBg: texture, title: titleColor, subtitle: subColor });
    if (escura || dark) {
      const sub70 = { r: 255 * 0.7 + base.surface.r * 0.3, g: 255 * 0.7 + base.surface.g * 0.3, b: 255 * 0.7 + base.surface.b * 0.3, a: 1 };
      const r = glassTextContrast({ finish, tone, intensity, opacity, tint, darkTheme: dark, sceneBg: texture, title: titleColor, subtitle: sub70 });
      return r;
    }
    return base;
  }, [finish, tone, intensity, opacity, tint, dark, escura]);
  const ok = result ? result.titleOk && result.subtitleOk : true;
  const subCls = escura ? "text-white/70" : "text-muted-foreground dark:text-white/70";
  const monoCls = escura ? "text-white/60" : "text-muted-foreground dark:text-white/60";
  return (
    <GlassCard finish={finish} tone={tone} intensity={intensity} opacity={opacity} blur={blur} tint={tint} interactive={interactive} tabIndex={interactive ? 0 : undefined} className={cn(compact && "p-4", className)} aria-describedby={undefined}>
      {eyebrow && <p className={`inline-flex items-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] ${subCls}`}><MapPin className="h-3 w-3" aria-hidden /> {eyebrow}</p>}
      <p className={`${display} ${compact ? "mt-1 text-[1.0625rem]" : "mt-2 text-[1.25rem]"} font-semibold tracking-[-0.01em]`}>{title}</p>
      <p className={`${compact ? "mt-1 text-[0.75rem]" : "mt-2 text-[0.8125rem]"} leading-relaxed ${subCls}`}>{subtitle}</p>
      {cta && !compact && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))]">{cta}</span>
          <ArrowUpRight className="h-5 w-5 text-primary" aria-hidden />
        </div>
      )}
      {/* avaliação de contraste: sempre visível; vira alerta quando abaixo do mínimo AA */}
      {result && (
        <div role={ok ? undefined : "alert"} className={cn("mt-3 flex items-start gap-2 rounded-[10px] border px-2.5 py-1.5 text-[0.6875rem] leading-snug", ok ? "border-border/60 bg-card/80 text-muted-foreground" : "border-[var(--warning)] bg-card text-foreground shadow-[var(--shadow-sm)]")}>
          {ok ? <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden /> : <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--warning)]" aria-hidden />}
          <span>
            {ok ? t("Contrast OK", "Contraste OK") : t("Accessibility compromised", "Acessibilidade comprometida")}{" "}<span className="opacity-70">({t("worst case: text over a texture stroke", "pior caso: texto sobre um traço da textura")})</span>
            {" · "}{t("title", "título")} <strong className={result.titleOk ? "" : "text-[var(--error,var(--destructive))]"}>{t(`${result.title.toFixed(1)}:1`, formatRatio(result.title))}</strong> ({t("min.", "mín.")} {AA.large}:1)
            {" · "}{t("subtitle", "subtítulo")} <strong className={result.subtitleOk ? "" : "text-[var(--error,var(--destructive))]"}>{t(`${result.subtitle.toFixed(1)}:1`, formatRatio(result.subtitle))}</strong> ({t("min.", "mín.")} {t(String(AA.normal), String(AA.normal).replace(".", ","))}:1)
          </span>
        </div>
      )}
      {!compact && <p className={`mt-3 text-[0.6875rem] font-mono ${monoCls}`}>finish="{finish ?? "padrao"}" tone="{tone}" intensity="{intensity}"{opacity !== undefined ? ` opacity={${opacity}}` : ""}{blur !== undefined ? ` blur={${blur}}` : ""}{tint ? " tint" : ""}</p>}
    </GlassCard>
  );
}
function GlassFinishPicker() {
  const { t } = useI18n();
  const [finish, setFinish] = useState<GlassFinish>("translucido");
  const [tone, setTone] = useState<"clara" | "escura">("clara");
  const [intensity, setIntensity] = useState<"leve" | "media" | "forte">("media");
  // controle livre: null = segue o acabamento
  const [opacidade, setOpacidade] = useState<number | null>(null);
  const [desfoque, setDesfoque] = useState<number | null>(null);
  const livre = opacidade !== null || desfoque !== null;
  const finishes: { value: GlassFinish; label: string; desc: string }[] = [
    { value: "translucido", label: t("Translucent", "Translúcido"), desc: t("Very transparent, almost no blur: the background shows through whole. For short labels over calm images.", "Bem transparente, quase sem desfoque: o fundo aparece inteiro. Para rótulos curtos sobre imagens calmas.") },
    { value: "fosco", label: t("Frosted", "Fosco"), desc: t("Sandblasted glass: heavy blur, more opaque, no reflection. The most legible; works over busy photos.", "Vidro jateado: muito desfoque, mais opaco, sem reflexo. O mais legível; funciona sobre fotos movimentadas.") },
    { value: "luz", label: t("Light focus", "Foco de luz"), desc: t("Medium glass with a light spot in the top-left corner and an inner glow. For hero and highlight cards.", "Vidro médio com um foco de luz no canto superior esquerdo e brilho interno. Para cards de hero e destaque.") },
    { value: "cristal", label: t("Crystal", "Cristal"), desc: t("Sharp glass: bright edge and a diagonal reflection. For premium moments, one per screen.", "Vidro nítido: borda brilhante e um reflexo diagonal. Para momentos premium, um por tela.") },
    { value: "padrao", label: t("Default", "Padrão"), desc: t("Balanced glass, the one used in the intensities above.", "Vidro equilibrado, o mesmo das intensidades acima.") },
  ];
  const current = finishes.find(x => x.value === finish)!;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Finish", "Acabamento")}</span>
          <SegmentedControl size="sm" aria-label={t("Finish", "Acabamento")} value={finish} onValueChange={setFinish} options={finishes.map(x => ({ value: x.value, label: x.label }))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Tone", "Tom")}</span>
          <SegmentedControl size="sm" aria-label={t("Tone", "Tom")} value={tone} onValueChange={setTone} options={[{ value: "clara", label: t("Light", "Claro") }, { value: "escura", label: t("Dark", "Escuro") }]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Opacity", "Opacidade")}</span>
          <SegmentedControl size="sm" aria-label={t("Opacity", "Opacidade")} value={intensity} onValueChange={setIntensity} options={[{ value: "leve", label: t("Light", "Leve") }, { value: "media", label: t("Medium", "Média") }, { value: "forte", label: t("Strong", "Forte") }]} />
        </div>
      </div>
      <div className="grid gap-x-8 gap-y-4 rounded-[14px] border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[0.75rem]">
            <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Background opacity", "Opacidade do fundo")}</span>
            <span className="font-mono text-foreground">{opacidade === null ? t("by finish", "do acabamento") : `${opacidade}%`}</span>
          </div>
          <Slider aria-label={t("Background opacity", "Opacidade do fundo")} min={0} max={100} step={1} value={[opacidade ?? 55]} onValueChange={([v]) => setOpacidade(v)} />
          <p className="text-[0.6875rem] text-muted-foreground">{t("0% = fully transparent · 100% = solid", "0% = totalmente transparente · 100% = sólido")}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[0.75rem]">
            <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Blur", "Desfoque")}</span>
            <span className="font-mono text-foreground">{desfoque === null ? t("by finish", "do acabamento") : `${desfoque} px`}</span>
          </div>
          <Slider aria-label={t("Blur", "Desfoque")} min={0} max={80} step={1} value={[desfoque ?? 24]} onValueChange={([v]) => setDesfoque(v)} />
          <p className="text-[0.6875rem] text-muted-foreground">{t("0 px = sees through sharp · 80 px = fully frosted", "0 px = vê através nítido · 80 px = totalmente jateado")}</p>
        </div>
        <button type="button" onClick={() => { setOpacidade(null); setDesfoque(null); }} disabled={!livre}
          className="h-9 rounded-full border border-border bg-card px-4 text-[0.75rem] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none">
          {t("Back to finish", "Voltar ao acabamento")}
        </button>
      </div>
      <GlassScene>
        <div className="grid gap-5 md:grid-cols-2 items-start">
          <GlassTestCard finish={finish} tone={tone} intensity={intensity} opacity={opacidade ?? undefined} blur={desfoque ?? undefined} interactive eyebrow={t("Organization · Health", "Organização · Saúde")} title={t("Clínica Horizonte", "Clínica Horizonte")} subtitle={t("Reception journey: 4 hypotheses, 2 tests planned.", "Jornada da recepção: 4 hipóteses, 2 testes planejados.")} cta={t("Open challenge", "Abrir desafio")} />
          <GlassTestCard finish={finish} tone={tone} intensity={intensity} opacity={opacidade ?? undefined} blur={desfoque ?? undefined} tint title={current.label} subtitle={current.desc} />
        </div>
      </GlassScene>
      <GlassScene className="p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {finishes.filter(x => x.value !== "padrao").map(x => (
            <GlassTestCard key={x.value} compact finish={x.value} intensity="media" title={x.label} subtitle={`finish="${x.value}"`} />
          ))}
        </div>
      </GlassScene>
    </div>
  );
}

export function CardShowcase() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(1);

  const cardTokens: TokenGroup[] = [
    {
      group: t("Surface", "Superfície"),
      tokens: [
        { name: "--card", description: t("Card background", "Fundo do card"), light: "#FFFFFF", dark: "rgba(19,26,39,0.75)", isColor: true },
        { name: "--card-foreground", description: t("Primary content", "Conteúdo principal"), light: "#131A27", dark: "#E4E9F0", isColor: true },
        { name: "--muted-foreground", description: t("Descriptions and metadata", "Descrições e metadados"), light: "#627288", dark: "#8898B0", isColor: true },
        { name: "--border", description: t("Default outline", "Contorno padrão"), light: "#D6DCE6", dark: "#283043", isColor: true },
      ],
    },
    {
      group: t("Shape and elevation", "Forma e elevação"),
      tokens: [
        { name: "--radius", description: t("Default card radius", "Raio padrão do card"), light: "0.75rem" },
        { name: "--shadow-sm", description: t("Default elevation", "Elevação padrão"), light: "0 1px 3px …", dark: "0 1px 3px …" },
        { name: "--shadow-md", description: t("Hover elevation", "Elevação no hover"), light: "0 4px 12px …", dark: "0 4px 12px …" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="card-anatomy" className="scroll-mt-32">
        <SectionHeader
          title={t("Card anatomy", "Anatomia do card")}
          description={t(
            "Cards group related information and actions into a scannable surface. Use a clear hierarchy and include only elements that belong to the same task or subject.",
            "Cards agrupam informações e ações relacionadas em uma superfície fácil de escanear. Use uma hierarquia clara e inclua apenas elementos da mesma tarefa ou assunto.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          <div className="relative">
            <SpecCard
              title={t("Workspace activity", "Atividade do workspace")}
              description={t("A concise description establishes context before the main content.", "Uma descrição concisa estabelece o contexto antes do conteúdo principal.")}
              action={<Button variant="ghost" size="icon" aria-label={t("Open options", "Abrir opções")}><Sparkles /></Button>}
              footer={
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-[0.75rem] text-muted-foreground">{t("Updated 5 minutes ago", "Atualizado há 5 minutos")}</span>
                  <Button size="sm">{t("View report", "Ver relatório")}<ChevronRight /></Button>
                </div>
              }
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  [t("Views", "Visualizações"), "24.8K"],
                  [t("Actions", "Ações"), "1,284"],
                  [t("Rate", "Taxa"), "5.2%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[var(--radius)] bg-muted p-3">
                    <p className="text-[0.6875rem] text-muted-foreground mb-1">{label}</p>
                    <p className={`${display} text-[1rem] font-semibold text-foreground`}>{value}</p>
                  </div>
                ))}
              </div>
            </SpecCard>
          </div>
          <DataTable
            head={[t("Part", "Parte"), t("Purpose", "Finalidade")]}
            rows={[
              [t("Container", "Container"), t("Groups the content and defines surface, border, radius and elevation.", "Agrupa o conteúdo e define superfície, borda, raio e elevação.")],
              [t("Header", "Cabeçalho"), t("Holds title, description and an optional contextual action.", "Contém título, descrição e uma ação contextual opcional.")],
              [t("Content", "Conteúdo"), t("Carries the primary information. Its structure changes by use case.", "Carrega a informação principal. Sua estrutura muda conforme o caso de uso.")],
              [t("Footer", "Rodapé"), t("Contains metadata or actions related to the whole card.", "Contém metadados ou ações relacionadas ao card inteiro.")],
            ]}
          />
        </div>
      </section>

      <section id="card-variants" className="scroll-mt-32">
        <SectionHeader
          title={t("Variants", "Variantes")}
          description={t("Choose a composition based on content and behavior, not decoration.", "Escolha a composição com base no conteúdo e no comportamento, não na decoração.")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpecCard title={t("Standard", "Padrão")} description={t("For grouped information with optional actions.", "Para informações agrupadas com ações opcionais.")}>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{t("Keep the content focused and let the surrounding layout define its width.", "Mantenha o conteúdo focado e deixe o layout ao redor definir sua largura.")}</p>
          </SpecCard>
          <Card className="gap-0 overflow-hidden border-border shadow-[var(--shadow-sm)]">
            <div className="h-32 bg-muted flex items-center justify-center border-b border-border">
              <Image className="h-8 w-8 text-muted-foreground/60" aria-hidden />
            </div>
            <CardHeader>
              <CardTitle className={`${display} text-[1rem] font-semibold`}>{t("Media card", "Card com mídia")}</CardTitle>
              <CardDescription>{t("Use meaningful imagery that adds context.", "Use imagens relevantes que adicionem contexto.")}</CardDescription>
            </CardHeader>
            <CardFooter><Button variant="outline" size="sm">{t("Learn more", "Saiba mais")}</Button></CardFooter>
          </Card>
          <SpecCard
            title={t("Action card", "Card de ação")}
            description={t("For a single, clear destination or task.", "Para um único destino ou tarefa clara.")}
            className="transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-3 text-[0.875rem] font-medium text-foreground">
              <MousePointer2 className="h-5 w-5 text-primary" aria-hidden />
              {t("The complete surface may be interactive.", "A superfície completa pode ser interativa.")}
            </div>
          </SpecCard>
          <Card className="gap-3 border-border px-4 py-3 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className={`${display} text-[0.875rem] font-semibold`}>{t("Compact card", "Card compacto")}</CardTitle>
                <CardDescription className="truncate text-[0.75rem]">{t("Dense lists and secondary information.", "Listas densas e informações secundárias.")}</CardDescription>
              </div>
              <Button variant="ghost" size="sm">{t("Open", "Abrir")}</Button>
            </div>
          </Card>
        </div>
      </section>

      <section id="card-shine" className="scroll-mt-32">
        <SectionHeader
          title="Shine Border"
          description={t(
            "An opt-in animated border for a single high-priority card. The effect decorates the card without changing its anatomy, layout or interaction.",
            "Uma borda animada opcional para um único card de alta prioridade. O efeito decora o card sem alterar sua anatomia, layout ou interação.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5">
          <Card className="relative gap-5 overflow-hidden border-border shadow-[var(--shadow-sm)]">
            <ShineBorder
              borderWidth={1}
              duration={12}
              shineColor={["var(--primary)", "var(--chart-2)", "var(--primary)"]}
            />
            <CardHeader>
              <span className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-primary">
                {t("Recommended", "Recomendado")}
              </span>
              <CardTitle className={`${display} text-[1.125rem] font-semibold`}>{t("Studio plan", "Plano Studio")}</CardTitle>
              <CardDescription>{t("Use Shine Border to call attention to one exceptional option.", "Use Shine Border para chamar atenção para uma única opção excepcional.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className={`${display} text-[1.75rem] font-semibold text-foreground`}>$49</span>
                <span className="text-[0.75rem] text-muted-foreground">/{t("month", "mês")}</span>
              </div>
            </CardContent>
            <CardFooter><Button className="w-full">{t("Choose Studio", "Escolher Studio")}</Button></CardFooter>
          </Card>
          <div className="space-y-4">
            <Callout title={t("Opt-in, not a Card default", "Opcional, não padrão do Card")}>
              <p>{t(
                "Shine Border is composed inside a relative, overflow-hidden card. It is not built into the base Card because most surfaces should remain quiet and static.",
                "Shine Border é composto dentro de um card relativo com overflow-hidden. Ele não faz parte do Card base porque a maioria das superfícies deve permanecer discreta e estática.",
              )}</p>
            </Callout>
            <DataTable
              head={[t("Rule", "Regra"), t("Guidance", "Orientação")]}
              rows={[
                [t("Quantity", "Quantidade"), t("Use on at most one card in the same decision group.", "Use em no máximo um card no mesmo grupo de decisão.")],
                [t("Hierarchy", "Hierarquia"), t("Reserve for recommended, premium or newly highlighted content.", "Reserve para conteúdo recomendado, premium ou recém-destacado.")],
                [t("Interaction", "Interação"), t("The border is decorative and never captures pointer events.", "A borda é decorativa e nunca captura eventos de ponteiro.")],
                [t("Reduced motion", "Movimento reduzido"), t("The border remains visible but stops animating.", "A borda continua visível, mas deixa de animar.")],
              ]}
            />
          </div>
        </div>
      </section>

      <section id="card-glass" className="scroll-mt-32">
        <SectionHeader
          title={t("Glassmorphism cards", "Cards glassmorphism")}
          description={t(
            "Translucent surfaces that blur what is behind them, with a light border and a thin highlight on top. They only work over a colorful background, gradient or image; on a flat background they become a regular card. Use for a few highlighted elements, never for long lists or extended reading.",
            "Superfícies translúcidas que desfocam o que está atrás, com borda clara e um fio de luz no topo. Só funcionam sobre um fundo com cor, gradiente ou imagem; sobre fundo liso viram um card comum. Use para poucos elementos em destaque, nunca para listas longas ou leitura extensa.",
          )}
        />
        <div className="space-y-6">
          <div>
            <SubTitle>{t("Finishes — degrees of transparency", "Acabamentos — graus de transparência")}</SubTitle>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground max-w-3xl">{t("Test area: choose the finish, tone and opacity, or set free values, and read title and subtitle inside the cards over the system texture. Each card measures the contrast of its texts in the worst case, where text crosses a texture stroke through the glass (WCAG AA: 3:1 for the title, 4.5:1 for the subtitle), and shows an alert when the configuration compromises accessibility.", "Área de teste: escolha acabamento, tom e opacidade, ou valores livres, e leia título e subtítulo dentro dos cards sobre a textura do sistema. Cada card mede o contraste dos seus textos no pior caso, onde o texto cruza um traço da textura através do vidro (WCAG AA: 3:1 no título, 4,5:1 no subtítulo), e mostra um alerta quando a configuração compromete a acessibilidade.")}</p>
            <GlassFinishPicker />
          </div>
          <div>
            <SubTitle>{t("Light glass — intensities", "Vidro claro — intensidades")}</SubTitle>
            <GlassScene>
              <div className="grid gap-5 md:grid-cols-3">
                <GlassCard intensity="leve">
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:text-white/70">{t("Challenges in progress", "Desafios em andamento")}</p>
                  <p className={`${display} mt-2 text-[2.25rem] font-bold leading-none tracking-[-0.03em]`}>{"12"}</p>
                  <p className="mt-2 text-[0.8125rem] text-muted-foreground dark:text-white/70">{t("3 with evidence collected this week", "3 com evidências coletadas nesta semana")}</p>
                  <p className="mt-4 text-[0.6875rem] font-mono text-muted-foreground dark:text-white/60">intensity="leve"</p>
                </GlassCard>
                <GlassCard intensity="media" interactive tabIndex={0} role="link">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="inline-flex items-center gap-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground dark:text-white/70"><MapPin className="h-3 w-3" aria-hidden /> {t("Organization · Health", "Organização · Saúde")}</p>
                      <p className={`${display} mt-2 text-[1.125rem] font-semibold tracking-[-0.01em]`}>{t("Clínica Horizonte", "Clínica Horizonte")}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                  </div>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground dark:text-white/70">{t("Reception journey: 4 hypotheses, 2 tests planned.", "Jornada da recepção: 4 hipóteses, 2 testes planejados.")}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <AvatarCircles size="sm" numPeople={12} avatarUrls={[1, 2, 3].map(i => ({ imageUrl: `${import.meta.env.BASE_URL}avatares/avatar-${i}.svg`, profileUrl: "#card-glass", name: `Pessoa ${i}` }))} />
                    <span className="text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))]">{t("Open challenge", "Abrir desafio")}</span>
                  </div>
                  <p className="mt-4 text-[0.6875rem] font-mono text-muted-foreground dark:text-white/60">intensity="media" interactive</p>
                </GlassCard>
                <GlassCard intensity="forte" tint>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[var(--primary-text,var(--primary))]">{t("What do you want to improve?", "O que você deseja melhorar?")}</p>
                  <p className={`${display} mt-2 text-[1.125rem] font-semibold tracking-[-0.01em]`}>{t("Start a challenge", "Comece um desafio")}</p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground dark:text-white/70">{t("Describe the human problem in your own words; the system guides the rest.", "Descreva o problema humano com suas palavras; o sistema conduz o resto.")}</p>
                  <Button className="mt-4 w-full rounded-full">{t("Start", "Começar")}</Button>
                  <p className="mt-4 text-[0.6875rem] font-mono text-muted-foreground dark:text-white/60">intensity="forte" tint</p>
                </GlassCard>
              </div>
            </GlassScene>
          </div>
          {/* só no tema escuro: no modo claro nada da cena escura aparece */}
          <div className="hidden dark:block">
            <SubTitle>{t("Dark glass (tone escura)", "Vidro escuro (tom escuro)")}</SubTitle>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground max-w-3xl">{t("Graphite glass with white text, for photos and busy scenes. This block only appears in dark mode.", "Vidro grafite com texto branco, para fotos e cenas movimentadas. Este bloco só aparece no modo escuro.")}</p>
            <GlassScene>
              <div className="grid gap-5 md:grid-cols-[1.2fr_0.8fr]">
                <GlassCard tone="escura" intensity="media">
                  <p className={`${display} text-[1.375rem] font-bold leading-tight tracking-[-0.02em]`}>{t("Turn people\u2019s experience into a strategic asset.", "Transforme a experiência das pessoas em ativo estratégico.")}</p>
                  <p className="mt-2 max-w-prose text-[0.875rem] leading-relaxed text-white/75">{t("Dark glass cards over photos and ambient scenes: the content reads well and the image stays visible.", "Cards de vidro escuro sobre fotos e ambientes: o conteúdo lê bem e a imagem continua aparecendo.")}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button className="rounded-full">{t("Learn more", "Saiba mais")}</Button>
                    <span className="text-[0.6875rem] font-mono text-white/60">tone="escura"</span>
                  </div>
                </GlassCard>
                <GlassCard tone="escura" intensity="forte" tint>
                  <div className="flex items-center gap-2 text-white/80"><Heart className="h-4 w-4 text-primary" aria-hidden /><span className="text-[0.8125rem] font-semibold">{t("Favorites", "Favoritos")}</span></div>
                  <p className={`${display} mt-3 text-[2rem] font-bold leading-none tracking-[-0.03em]`}>36</p>
                  <p className="mt-2 text-[0.8125rem] text-white/70">{t("saved this month", "salvos neste mês")}</p>
                  <p className="mt-4 text-[0.6875rem] font-mono text-white/60">tone="escura" intensity="forte" tint</p>
                </GlassCard>
              </div>
            </GlassScene>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <DataTable
              head={[t("Rule", "Regra"), t("Guidance", "Orientação")]}
              rows={[
                [t("Background", "Fundo"), t("Only over color, image or texture. In the docs the examples sit over the system texture with small icons; in the product, the hero, a photo or a brand surface does this job. Check the contrast against the busiest area of the real background.", "Só sobre cor, imagem ou textura. Na documentação os exemplos ficam sobre a textura do sistema com ícones pequenos; no produto, o hero, uma foto ou uma superfície da marca fazem esse papel. Confira o contraste contra a área mais movimentada do fundo real.")],
                [t("Quantity", "Quantidade"), t("One to three per view. Glass loses meaning when everything is glass.", "De um a três por tela. O vidro perde sentido quando tudo é vidro.")],
                [t("Contrast", "Contraste"), t("Light glass at 55% or more for body text; dark glass at 50% or more. Check contrast against the busiest part of the background.", "Vidro claro com 55% ou mais para texto corrido; vidro escuro com 50% ou mais. Confira o contraste contra a parte mais movimentada do fundo.")],
                [t("Content", "Conteúdo"), t("Short content: a number, a title, one sentence, one action. Long reading goes on a solid card.", "Conteúdo curto: um número, um título, uma frase, uma ação. Leitura longa vai em card sólido.")],
                [t("Performance", "Desempenho"), t("backdrop-filter is costly: avoid in long lists and inside scroll areas on mobile.", "backdrop-filter custa caro: evite em listas longas e dentro de áreas de rolagem no celular.")],
                [t("Reduced transparency", "Transparência reduzida"), t("With prefers-reduced-transparency the card becomes solid (card or graphite).", "Com prefers-reduced-transparency o card vira sólido (card ou grafite).")],
              ]}
            />
            <div className="space-y-4">
              <DoDont
                dos={[
                  t("Use for a hero summary, a highlighted store or a floating action card.", "Use para um resumo no hero, uma loja em destaque ou um card de ação flutuante."),
                  t("Keep the system radius (20 px) and spacing; glass changes the surface, not the anatomy.", "Mantenha o raio do sistema (20 px) e os espaçamentos; o vidro muda a superfície, não a anatomia."),
                  t("Pair dark glass with photos and light glass with the brand gradient.", "Combine vidro escuro com fotos e vidro claro com o gradiente da marca."),
                ]}
                donts={[
                  t("Do not use glass on a flat background or inside another glass card.", "Não use vidro sobre fundo liso nem dentro de outro card de vidro."),
                  t("Do not place forms, tables or long text on glass.", "Não coloque formulários, tabelas ou textos longos sobre vidro."),
                  t("Do not lower the opacity to make it “more glassy” at the cost of contrast.", "Não baixe a opacidade para ficar “mais vidro” à custa do contraste."),
                ]}
              />
              <pre className="overflow-x-auto rounded-[10px] bg-muted/60 p-3 text-[0.75rem] text-muted-foreground"><code>{`import { GlassCard } from "@/app/components/ui/glass-card";

<GlassCard finish="fosco" tone="clara" interactive>…</GlassCard>
<GlassCard finish="luz" intensity="forte">…</GlassCard>
<GlassCard finish="cristal" tone="escura" tint>…</GlassCard>
<GlassCard opacity={35} blur={10}>…</GlassCard>   {/* controle livre */}`}</code></pre>
            </div>
          </div>
          <TokenTable groups={[{
            group: t("Glass tokens", "Tokens do vidro"),
            tokens: [
              { name: "finish translucido", description: t("Very transparent", "Bem transparente"), light: "blur 2 px · white 10/18/28%", dark: "white 4/6/9%" },
              { name: "finish fosco", description: t("Frosted, matte", "Jateado, sem reflexo"), light: "blur 64 px · white 60/72/84%", dark: "white 14/18/22%" },
              { name: "finish luz", description: t("Light spot top-left", "Foco de luz no canto"), light: "blur 24 px · white 35/48/62% + radial 55%", dark: "radial 28%" },
              { name: "finish cristal", description: t("Bright edge, diagonal sheen", "Borda brilhante, reflexo diagonal"), light: "blur 12 px · white 22/32/44% · border 90%", dark: "border 30%" },
              { name: "intensity leve / media / forte", description: t("Backdrop blur (default finish)", "Desfoque do fundo (acabamento padrão)"), light: "blur 12 px · 24 px · 40 px" },
              { name: "opacity / blur", description: t("Free control, overrides the finish", "Controle livre, sobrepõe o acabamento"), light: "opacity 0–100 % · blur 0–80 px" },
              { name: "clara — bg", description: t("Light glass background", "Fundo do vidro claro"), light: "white 40% · 55% · 70%", dark: "white 8% · 12% · 16%" },
              { name: "escura — bg", description: t("Dark glass background", "Fundo do vidro escuro"), light: "graphite-950 35% · 50% · 65%" },
              { name: "border", description: t("Glass edge", "Borda do vidro"), light: "white 60% (clara) · white 15% (escura)", dark: "white 15%" },
              { name: "highlight", description: t("1 px top highlight", "Fio de luz no topo, 1 px"), light: "gradient white 80%", dark: "gradient white 40%" },
              { name: "radius / padding", description: t("Same anatomy as Card", "Mesma anatomia do Card"), light: "20 px / 24 px" },
              { name: "shadow", description: t("Soft elevation", "Elevação suave"), light: "0 8px 32px graphite-950 8% (clara) · 25% (escura)" },
            ],
          }]} />
        </div>
      </section>

      <section id="card-layout" className="scroll-mt-32">
        <SectionHeader
          title={t("Layout and sizing", "Layout e dimensionamento")}
          description={t("Card dimensions respond to the parent grid. Prefer consistent internal spacing over fixed heights.", "As dimensões do card respondem ao grid pai. Prefira espaçamento interno consistente a alturas fixas.")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel className="p-5">
            <SubTitle>{t("Default specification", "Especificação padrão")}</SubTitle>
            <div className="space-y-3 text-[0.8125rem]">
              {[
                [t("Padding", "Padding"), "24px", t("16px for compact cards", "16px para cards compactos")],
                [t("Section gap", "Espaço entre seções"), "24px", t("Use 12–16px in dense layouts", "Use 12–16px em layouts densos")],
                [t("Radius", "Raio"), "var(--radius)", t("Keep consistent within the same grid", "Mantenha consistente no mesmo grid")],
                [t("Border", "Borda"), "1px", t("Use border-border", "Use border-border")],
                [t("Elevation", "Elevação"), "var(--shadow-sm)", t("Increase only for hover or overlays", "Aumente apenas em hover ou overlays")],
              ].map(([label, value, note]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div><p className="font-medium text-foreground">{label}</p><p className="text-muted-foreground">{note}</p></div>
                  <Mono>{value}</Mono>
                </div>
              ))}
            </div>
          </Panel>
          <Callout title={t("Responsive behavior", "Comportamento responsivo")}>
            <p>{t(
              "Let cards fill their grid column. Collapse multi-column content before reducing internal padding, and avoid horizontal scrolling inside a card.",
              "Deixe os cards preencherem sua coluna no grid. Reduza conteúdos em múltiplas colunas antes de diminuir o padding interno e evite rolagem horizontal dentro do card.",
            )}</p>
          </Callout>
        </div>
      </section>

      <section id="card-nested" className="scroll-mt-32">
        <SectionHeader
          title={t("Nested cards", "Cards aninhados")}
          description={t(
            "When a card needs to contain another card, only the outer card defines elevation. Inner cards must never have shadows.",
            "Quando um card precisa conter outro card, apenas o card externo define a elevação. Cards internos nunca devem ter sombras.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          <Card className="gap-5 border-border p-6 shadow-[var(--shadow-sm)]">
            <div>
              <CardTitle className={`${display} text-[1rem] font-semibold`}>{t("Project overview", "Visão geral do projeto")}</CardTitle>
              <CardDescription className="mt-1">{t("The parent card owns the visual elevation.", "O card pai é responsável pela elevação visual.")}</CardDescription>
            </div>
            <Card className="gap-4 border-border bg-muted/40 p-4 shadow-none">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className={`${display} text-[0.875rem] font-semibold`}>{t("Delivery status", "Status da entrega")}</CardTitle>
                  <CardDescription className="mt-1 text-[0.75rem]">{t("This inner card uses a border and no shadow.", "Este card interno usa borda e nenhuma sombra.")}</CardDescription>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-success">
                  {t("On track", "Em dia")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </Card>
            <p className="text-[0.75rem] text-muted-foreground">
              <Mono>shadow-[var(--shadow-sm)]</Mono>{" "}
              {t("on the parent", "no card pai")} · <Mono>shadow-none</Mono>{" "}
              {t("on the child", "no card filho")}
            </p>
          </Card>
          <div className="space-y-4">
            <Callout title={t("Elevation rule", "Regra de elevação")}>
              <p>{t(
                "Nested surfaces belong to the parent's elevation context. Adding a shadow to the child creates a false layer and makes the hierarchy ambiguous.",
                "Superfícies aninhadas pertencem ao contexto de elevação do card pai. Adicionar sombra ao filho cria uma camada falsa e torna a hierarquia ambígua.",
              )}</p>
            </Callout>
            <DataTable
              head={[t("Layer", "Camada"), t("Surface treatment", "Tratamento da superfície")]}
              rows={[
                [t("Parent card", "Card pai"), t("Border plus the elevation defined for its context.", "Borda mais a elevação definida para seu contexto.")],
                [t("Inner card", "Card interno"), t("Border or tonal background with shadow-none.", "Borda ou fundo tonal com shadow-none.")],
                [t("Inner interactive card", "Card interno interativo"), t("Use border and focus ring—not elevation—to communicate state.", "Use borda e anel de foco — não elevação — para comunicar o estado.")],
              ]}
            />
          </div>
        </div>
      </section>

      <section id="card-actions" className="scroll-mt-32">
        <SectionHeader
          title={t("Buttons in cards", "Botões em cards")}
          description={t(
            "Button placement and emphasis should reflect the card's task. Keep one primary action and reduce the emphasis of supporting actions.",
            "O posicionamento e a ênfase dos botões devem refletir a tarefa do card. Mantenha uma ação principal e reduza a ênfase das ações de apoio.",
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpecCard
            title={t("Primary and secondary actions", "Ações primária e secundária")}
            description={t("Place task-level actions together in the footer, with the primary action last.", "Coloque ações da tarefa juntas no rodapé, com a ação principal por último.")}
            footer={
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" size="sm">{t("Cancel", "Cancelar")}</Button>
                <Button size="sm">{t("Save changes", "Salvar alterações")}</Button>
              </div>
            }
          >
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t("Use this pattern when the card represents a form, configuration or focused task.", "Use este padrão quando o card representa um formulário, configuração ou tarefa focada.")}
            </p>
          </SpecCard>

          <SpecCard
            title={t("Contextual ghost action", "Ação ghost contextual")}
            description={t("Header actions should be compact and visually quiet.", "Ações no cabeçalho devem ser compactas e visualmente discretas.")}
            action={<Button variant="ghost" size="icon" aria-label={t("More options", "Mais opções")}><Sparkles /></Button>}
          >
            <div className="rounded-[var(--radius)] bg-muted p-4">
              <p className="text-[0.8125rem] text-foreground">{t("Ghost works for menus, dismiss, edit or other tertiary actions.", "Ghost funciona para menus, dispensar, editar ou outras ações terciárias.")}</p>
            </div>
          </SpecCard>

          <SpecCard
            title={t("Navigation with a link button", "Navegação com botão link")}
            description={t("Use a link button when the action only navigates to related detail.", "Use um botão link quando a ação apenas navega para um detalhe relacionado.")}
            footer={
              <Button variant="link" size="sm" className="px-0">
                {t("View full report", "Ver relatório completo")}<ChevronRight />
              </Button>
            }
          >
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t("Do not use the link style for save, submit, delete or other state-changing actions.", "Não use o estilo link para salvar, enviar, excluir ou outras ações que alteram estado.")}
            </p>
          </SpecCard>

          <SpecCard
            title={t("Destructive action", "Ação destrutiva")}
            description={t("Separate destructive actions from the primary flow and name the consequence.", "Separe ações destrutivas do fluxo principal e nomeie a consequência.")}
            footer={
              <div className="flex w-full items-center justify-between gap-2">
                <Button variant="ghost" size="sm">{t("Keep project", "Manter projeto")}</Button>
                <Button variant="destructive" size="sm">{t("Delete project", "Excluir projeto")}</Button>
              </div>
            }
          >
            <Callout title={t("Confirmation required", "Confirmação necessária")}>
              <p>{t("Irreversible actions should open a confirmation dialog.", "Ações irreversíveis devem abrir um diálogo de confirmação.")}</p>
            </Callout>
          </SpecCard>
        </div>
        <div className="mt-5">
          <DataTable
            head={[t("Position", "Posição"), t("Recommended use", "Uso recomendado"), t("Variant", "Variante")]}
            rows={[
              [t("Header", "Cabeçalho"), t("Contextual actions and overflow menus", "Ações contextuais e menus de opções"), "Ghost / icon"],
              [t("Content", "Conteúdo"), t("Inline navigation related to the content", "Navegação inline relacionada ao conteúdo"), "Link"],
              [t("Footer", "Rodapé"), t("Task completion and supporting actions", "Conclusão da tarefa e ações de apoio"), "Primary + Outline"],
              [t("Separated footer edge", "Extremidade separada do rodapé"), t("Destructive action with explicit consequence", "Ação destrutiva com consequência explícita"), "Destructive"],
            ]}
          />
        </div>
      </section>

      <section id="card-states" className="scroll-mt-32">
        <SectionHeader
          title={t("Interactive states", "Estados interativos")}
          description={t("Only cards with a clear action should look interactive. Selection must remain visible without relying on color alone.", "Apenas cards com uma ação clara devem parecer interativos. A seleção deve continuar visível sem depender apenas de cor.")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map(index => {
            const isSelected = selected === index;
            const labels = [
              [t("Starter", "Inicial"), t("For personal projects", "Para projetos pessoais")],
              [t("Studio", "Studio"), t("For growing teams", "Para equipes em crescimento")],
              [t("Enterprise", "Enterprise"), t("For complex organizations", "Para organizações complexas")],
            ];
            return (
              <Card key={index} className={`gap-4 border-2 transition-all ${isSelected ? "border-primary shadow-[var(--shadow-md)]" : "border-border hover:border-[var(--border-strong)]"}`}>
                <CardHeader>
                  <CardTitle className={`${display} text-[1rem] font-semibold flex items-center gap-2`}>
                    {labels[index][0]}
                    {isSelected && <Check className="h-4 w-4 text-primary" aria-label={t("Selected", "Selecionado")} />}
                  </CardTitle>
                  <CardDescription>{labels[index][1]}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" variant={isSelected ? "default" : "outline"} onClick={() => setSelected(index)} aria-pressed={isSelected}>
                    {isSelected ? t("Selected", "Selecionado") : t("Select", "Selecionar")}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>


      {/* ── CARD DE CONVITE AO PARCEIRO ── */}
      <section id="card-partner" className="scroll-mt-32">
        <SectionHeader title={t("Partner invitation card", "Card de convite ao parceiro")} description={t("Invitation to join the studio's Partner Network: hero tag, headline with highlight, one-sentence benefit, primary action and a secondary link. Vertical for columns and page ends; horizontal for bands between sections.", 'Convite para a Rede de Parceiros do estúdio: selo, título com destaque, benefício em uma frase, ação principal e link secundário. Vertical para colunas e fim de página; horizontal para faixas entre seções.')} />
        <div className="space-y-8">
          <div>
            <SubTitle>{t("Vertical — sizes S, M and L", "Vertical — tamanhos P, M e G")}</SubTitle>
            <div className="grid gap-5 md:grid-cols-[2fr_3fr] items-start">
              <PartnerCard size="p" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
              <PartnerCard size="m" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
            </div>
            <div className="mt-5 max-w-[600px]">
              <PartnerCard size="g" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
            </div>
          </div>
          <div>
            <SubTitle>{t("Horizontal — sizes S, M and L", "Horizontal — tamanhos P, M e G")}</SubTitle>
            <div className="space-y-5">
              <PartnerCard orientation="horizontal" size="p" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
              <PartnerCard orientation="horizontal" size="m" surface="tint" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
              <PartnerCard orientation="horizontal" size="g" surface="dark" eyebrow={t("Partner network", "Rede de Parceiros")} title={t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**")} description={t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação.")} cta={{ label: t("I want to be a partner", "Quero ser parceiro"), href: "#" }} secondary={{ label: t("How it works", "Como funciona"), href: "#" }} visual={<Handshake />} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [t("Sizes", "Tamanhos"), t("S: sidebars and lists (title 18 px). M: content columns (24–28 px). L: page ends and landing bands (32–40 px).", "P: barras laterais e listas (título 18 px). M: colunas de conteúdo (24–28 px). G: fim de página e faixas de landing (32–40 px).")],
              [t("Surfaces", "Superfícies"), t("card (default), tint (support surface) and dark (graphite, for contrast bands). The primary glow in the corner echoes the hero background.", "card (padrão), tint (superfície de apoio) e dark (grafite, para faixas de contraste). O brilho primário no canto ecoa o fundo do hero.")],
              [t("Content", "Conteúdo"), t("One headline with one highlight, one benefit sentence, one primary action (verb first) and at most one secondary link.", "Um título com um destaque, uma frase de benefício, uma ação principal (verbo primeiro) e no máximo um link secundário.")],
            ].map(([a, b]) => (
              <div key={a} className="rounded-[14px] border border-border bg-card p-4"><p className="mb-1 text-[0.875rem] font-semibold text-foreground">{a}</p><p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{b}</p></div>
            ))}
          </div>
          <pre className="overflow-x-auto rounded-[10px] bg-muted/60 p-3 text-[0.75rem] text-muted-foreground"><code>{`import { PartnerCard } from "@/app/components/ui/partner-card";
<PartnerCard orientation="horizontal" size="m" eyebrow="…" title="… **destaque** …" description="…" cta={{ label: "…", href: "/…" }} />`}</code></pre>
        </div>
      </section>
      <section id="card-guidelines" className="scroll-mt-32">
        <SectionHeader
          title={t("Usage guidelines", "Diretrizes de uso")}
          description={t("Cards are a grouping mechanism, not the default container for every element.", "Cards são um mecanismo de agrupamento, não o container padrão para todos os elementos.")}
        />
        <DoDont
          dos={[
            t("Group content that shares one subject or task.", "Agrupe conteúdos que compartilham um assunto ou tarefa."),
            t("Keep card structures consistent within the same grid.", "Mantenha estruturas consistentes no mesmo grid."),
            t("Use shadow-none on every card nested inside another card.", "Use shadow-none em todo card aninhado dentro de outro card."),
            t("Use one primary action and move secondary actions to the footer or menu.", "Use uma ação principal e mova ações secundárias para o rodapé ou menu."),
          ]}
          donts={[
            t("Give an inner card its own elevation or hover shadow.", "Não dê ao card interno elevação própria nem sombra no hover."),
            t("Make the whole surface clickable when it contains other interactive controls.", "Não torne toda a superfície clicável quando houver outros controles interativos."),
            t("Use elevation only as decoration or mix multiple shadow levels in one grid.", "Não use elevação apenas como decoração nem misture vários níveis de sombra no mesmo grid."),
          ]}
        />
      </section>

      <section id="card-accessibility" className="scroll-mt-32">
        <SectionHeader
          title={t("Accessibility", "Acessibilidade")}
          description={t("Card semantics depend on purpose. A visual card does not automatically need an ARIA role.", "A semântica do card depende da finalidade. Um card visual não precisa automaticamente de um papel ARIA.")}
        />
        <PrincipleGrid
          items={[
            { icon: LayoutPanelTop, title: t("Heading structure", "Estrutura de títulos"), desc: t("Use the card title at the correct heading level within the page hierarchy.", "Use o título do card no nível correto da hierarquia da página.") },
            { icon: MousePointer2, title: t("Keyboard behavior", "Comportamento no teclado"), desc: t("Interactive cards need a visible focus ring and must activate with Enter or Space.", "Cards interativos precisam de foco visível e devem ser ativados com Enter ou Espaço.") },
            { icon: ShieldCheck, title: t("Clear labeling", "Rotulagem clara"), desc: t("Icon-only actions need accessible names, and images need useful alternative text.", "Ações apenas com ícone precisam de nomes acessíveis e imagens precisam de texto alternativo útil.") },
          ]}
        />
      </section>

      <section id="card-tokens" className="scroll-mt-32">
        <SectionHeader
          title={t("Card tokens", "Tokens de card")}
          description={t("Semantic tokens keep every variant consistent across light and dark modes.", "Tokens semânticos mantêm todas as variantes consistentes nos modos claro e escuro.")}
        />
        <TokenTable groups={cardTokens} />
      </section>
    </div>
  );
}
