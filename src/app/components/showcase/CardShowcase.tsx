import React, { useState } from "react";
import { Check, ChevronRight, Image, LayoutPanelTop, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";
import { ResumoDaRegraDasLinhas } from "./shared/RegraDasLinhas";
import {
  Card,
  CardMidia,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { GradeDeCards, ItemDaGrade, LIMITE_DE_DIFERENCA, type LayoutDaGrade } from "../ui/grade-de-cards";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Columns2, Rows2, Search, TrendingUp } from "lucide-react";
import { ShineBorder } from "../ui/shine-border";
import { PartnerCard } from "../ui/partner-card";
import { GlassCard, GlassScene, glassTextContrast, glassSceneTexture, type GlassFinish, type GlassCardProps } from "../ui/glass-card";
import { DoodleTexture } from "../ui/doodle-texture";
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
import { Skeleton } from "../ui/skeleton";
import { X } from "lucide-react";
import { CardsDeKpi } from "./DataShowcase";
import { WobbleCardConteudo, ShineBorderConteudo, evitarWobble } from "./MotionShowcase";
import { CanvasRevealCard, evitarCanvasReveal } from "./BackgroundsShowcase";
import { SectionHeader } from "./shared/SectionHeader";


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
    <Card className={`gap-5 border-border shadow-none ${className}`}>
      <CardHeader className="gap-1.5">
        <CardTitle className={`${display} text-body font-semibold tracking-[-0.01em]`}>{title}</CardTitle>
        <CardDescription className="text-body-sm leading-relaxed">{description}</CardDescription>
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

/* ── Fundo de teste dos cards de vidro ──
   O seletor de acabamentos deixa trocar o que fica atrás dos cards, para testar o vidro
   (e o contraste do texto) sobre texturas mais fechadas, mais abertas, mais escuras ou mais claras e sobre cores sólidas. */
type FundoDeTeste = "padrao" | "fechada" | "aberta" | "escura" | "clara" | "solida" | "foto";
type CorSolida = "cinza-claro" | "cinza-medio" | "grafite" | "primaria";
const coresSolidas: Record<CorSolida, string> = {
  "cinza-claro": "var(--graphite-100)",
  "cinza-medio": "var(--graphite-500)",
  grafite: "var(--graphite-950)",
  primaria: "var(--primary)",
};
type CenaDeTeste = { fundo: FundoDeTeste; cor: CorSolida };
const CenaDeTesteCtx = React.createContext<CenaDeTeste | null>(null);

/** Fundo e traço da textura (null = sem textura) e tamanho do ladrilho da cena, em px. */
function coresDaCena(c: CenaDeTeste | null, dark: boolean): { bg: string; traco: string | null; ladrilho: number } {
  const tracoDoTema = dark ? glassSceneTexture.dark : glassSceneTexture.light;
  switch (c?.fundo ?? "padrao") {
    // foto: qualquer ponto pode ser escuro ou claro; o pior caso é preto ou branco
    case "foto": return { bg: "#000000", traco: "#FFFFFF", ladrilho: 0 };
    case "fechada": return { bg: "var(--background)", traco: tracoDoTema, ladrilho: 200 };
    case "aberta": return { bg: "var(--background)", traco: tracoDoTema, ladrilho: 640 };
    case "escura": return { bg: "var(--graphite-950)", traco: "var(--graphite-700)", ladrilho: 320 };
    case "clara": return { bg: "var(--graphite-50)", traco: "var(--graphite-100)", ladrilho: 320 };
    case "solida": return { bg: coresSolidas[c!.cor], traco: null, ladrilho: 0 };
    default: return { bg: "var(--background)", traco: tracoDoTema, ladrilho: 320 };
  }
}

/** Cena do seletor: usa o fundo escolhido; fora do seletor, é a cena padrão (GlassScene). */
function CenaDoVidro({ className, children }: { className?: string; children: React.ReactNode }) {
  const cena = React.useContext(CenaDeTesteCtx);
  const dark = useIsDark();
  if (!cena) return <GlassScene className={className}>{children}</GlassScene>;
  const c = coresDaCena(cena, dark);
  if (cena.fundo === "foto") {
    return (
      <div data-testid="cena-vidro" data-fundo="foto" className={cn("relative isolate overflow-hidden rounded-xl border border-border bg-[var(--graphite-950)] p-6 sm:p-8", className)}>
        <img src={FOTO.src} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        {children}
      </div>
    );
  }
  return (
    <div data-testid="cena-vidro" data-fundo={cena.fundo} className={cn("relative isolate overflow-hidden rounded-xl border border-border p-6 sm:p-8 transition-colors", className)} style={{ backgroundColor: c.bg }}>
      {c.traco && <DoodleTexture color={c.traco} className="-z-10" style={{ WebkitMaskSize: `${c.ladrilho}px`, maskSize: `${c.ladrilho}px` }} />}
      {children}
    </div>
  );
}

/** Contraste do título e do subtítulo sobre o vidro, no pior caso entre o fundo e o traço da textura (ou entre preto e branco, sobre foto). */
type ConfigVidro = Pick<GlassCardProps, "finish" | "tone" | "intensity" | "opacity" | "tint">;
function contrasteDoVidro({ finish, tone = "clara", intensity = "media", opacity, tint }: ConfigVidro, cena: CenaDeTeste | null, dark: boolean) {
  const escura = tone === "escura";
  const c = coresDaCena(cena, dark);
  const fundos = [c.bg, c.traco].filter((x): x is string => !!x).map(x => resolveCssColor(x));
  const titleColor = resolveCssColor(escura ? "#FFFFFF" : dark ? "#FFFFFF" : "var(--foreground)");
  const subColor = escura || dark ? resolveCssColor("rgba(255,255,255,0.7)") : resolveCssColor("var(--muted-foreground)");
  if (fundos.some(x => !x) || !titleColor || !subColor) return null;
  const calc = (sceneBg: NonNullable<ReturnType<typeof resolveCssColor>>) => {
    const base = glassTextContrast({ finish, tone, intensity, opacity, tint, darkTheme: dark, sceneBg, title: titleColor, subtitle: subColor });
    if (!(escura || dark)) return base;
    // subtítulo a 70% de branco: compõe sobre a superfície dentro do cálculo
    const sub70 = { r: 255 * 0.7 + base.surface.r * 0.3, g: 255 * 0.7 + base.surface.g * 0.3, b: 255 * 0.7 + base.surface.b * 0.3, a: 1 };
    return glassTextContrast({ finish, tone, intensity, opacity, tint, darkTheme: dark, sceneBg, title: titleColor, subtitle: sub70 });
  };
  const rs = fundos.map(x => calc(x!));
  const title = Math.min(...rs.map(r => r.title)), subtitle = Math.min(...rs.map(r => r.subtitle));
  return { ...rs[0], title, subtitle, titleOk: title >= AA.large, subtitleOk: subtitle >= AA.normal };
}

/** Primeira configuração da lista que passa no contraste (AA) na cena e no tema atuais. */
function primeiraAprovada(candidatas: ConfigVidro[], cena: CenaDeTeste | null, dark: boolean): ConfigVidro | null {
  for (const c of candidatas) { const r = contrasteDoVidro(c, cena, dark); if (r && r.titleOk && r.subtitleOk) return c; }
  return null;
}
const tons: ("clara" | "escura")[] = ["clara", "escura"];
const intensidades: ("media" | "forte" | "leve")[] = ["media", "forte", "leve"];
/** Candidatas de um acabamento: tom claro antes do escuro, média antes de forte e de leve. */
function candidatasDe(finish: GlassFinish): ConfigVidro[] {
  return tons.flatMap(tone => intensidades.map(intensity => ({ finish, tone, intensity })));
}
/** Texto da configuração, como as props do componente. */
function propsDoVidro(c: ConfigVidro) {
  return `finish="${c.finish ?? "padrao"}" tone="${c.tone ?? "clara"}" intensity="${c.intensity ?? "media"}"${c.tint ? " tint" : ""}`;
}

/**
 * Card de teste: título e subtítulo reais sobre o vidro, com avaliação de contraste (WCAG AA)
 * e alerta dentro do card quando a configuração compromete a acessibilidade.
 */
function GlassTestCard({ finish, tone = "clara", intensity = "media", opacity, blur, tint, interactive, compact = false, eyebrow, title, subtitle, cta, className }: Pick<GlassCardProps, "finish" | "tone" | "intensity" | "opacity" | "blur" | "tint" | "interactive" | "className"> & { compact?: boolean; eyebrow?: string; title: string; subtitle: string; cta?: string }) {
  const { t } = useI18n();
  const dark = useIsDark();
  const escura = tone === "escura";
  const cena = React.useContext(CenaDeTesteCtx);
  void escura;
  const comTextura = coresDaCena(cena, dark).traco !== null;
  const naFoto = cena?.fundo === "foto";
  const result = React.useMemo(() => contrasteDoVidro({ finish, tone, intensity, opacity, tint }, cena, dark), [finish, tone, intensity, opacity, tint, dark, cena]);
  const ok = result ? result.titleOk && result.subtitleOk : true;
  const subCls = escura ? "text-white/70" : "text-muted-foreground dark:text-white/70";
  const monoCls = escura ? "text-white/60" : "text-muted-foreground dark:text-white/60";
  return (
    <GlassCard finish={finish} tone={tone} intensity={intensity} opacity={opacity} blur={blur} tint={tint} interactive={interactive} tabIndex={interactive ? 0 : undefined} className={cn(compact && "p-4", className)} aria-describedby={undefined}>
      {eyebrow && <p className={`inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.08em] ${subCls}`}><MapPin className="h-3 w-3" aria-hidden /> {eyebrow}</p>}
      <p className={`${display} ${compact ? "mt-1 text-body-lg" : "mt-2 text-h4"} font-semibold tracking-[-0.01em]`}>{title}</p>
      <p className={`${compact ? "mt-1 text-label" : "mt-2 text-body-sm"} leading-relaxed ${subCls}`}>{subtitle}</p>
      {cta && !compact && (
        <div className="mt-4 flex items-center justify-between">
          <span className="text-body-sm font-semibold text-[var(--primary-text,var(--primary))]">{cta}</span>
          <ArrowUpRight className="h-5 w-5 text-primary-text" aria-hidden />
        </div>
      )}
      {/* avaliação de contraste: sempre visível; vira alerta quando abaixo do mínimo AA */}
      {result && (
        <div role={ok ? undefined : "alert"} className={cn("mt-3 flex items-start gap-2 rounded-md border px-2.5 py-1.5 text-caption leading-snug", ok ? "border-border/60 bg-card/80 text-muted-foreground" : "border-[var(--warning)] bg-card text-foreground shadow-[var(--shadow-sm)]")}>
          {ok ? <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden /> : <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-[var(--warning-text)]" aria-hidden />}
          <span>
            {ok ? t("Contrast OK", "Contraste OK") : t("Accessibility compromised", "Acessibilidade comprometida")}{" "}<span className="opacity-70">({naFoto ? t("worst case: any area of the photo, from black to white", "pior caso: qualquer área da foto, do preto ao branco") : comTextura ? t("worst case: text over the background or a texture stroke", "pior caso: texto sobre o fundo ou um traço da textura") : t("solid background", "fundo sólido")})</span>
            {" · "}{t("title", "título")} <strong className={result.titleOk ? "" : "text-[var(--error-text)]"}>{t(`${result.title.toFixed(1)}:1`, formatRatio(result.title))}</strong> ({t("min.", "mín.")} {AA.large}:1)
            {" · "}{t("subtitle", "subtítulo")} <strong className={result.subtitleOk ? "" : "text-[var(--error-text)]"}>{t(`${result.subtitle.toFixed(1)}:1`, formatRatio(result.subtitle))}</strong> ({t("min.", "mín.")} {t(String(AA.normal), String(AA.normal).replace(".", ","))}:1)
          </span>
        </div>
      )}
      {!compact && <p className={`mt-3 text-caption font-mono ${monoCls}`}>finish="{finish ?? "padrao"}" tone="{tone}" intensity="{intensity}"{opacity !== undefined ? ` opacity={${opacity}}` : ""}{blur !== undefined ? ` blur={${blur}}` : ""}{tint ? " tint" : ""}</p>}
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
  const [cena, setCena] = useState<CenaDeTeste>({ fundo: "padrao", cor: "grafite" });
  const fundos: { value: FundoDeTeste; label: string }[] = [
    { value: "padrao", label: t("Default", "Padrão") },
    { value: "fechada", label: t("Dense texture", "Textura fechada") },
    { value: "aberta", label: t("Open texture", "Textura aberta") },
    { value: "escura", label: t("Dark texture", "Textura escura") },
    { value: "clara", label: t("Light and subtle", "Clara e discreta") },
    { value: "solida", label: t("Solid colour", "Cor sólida") },
  ];
  const cores: { value: CorSolida; label: string }[] = [
    { value: "cinza-claro", label: t("Light grey", "Cinza claro") },
    { value: "cinza-medio", label: t("Mid grey", "Cinza médio") },
    { value: "grafite", label: t("Graphite", "Grafite") },
    { value: "primaria", label: t("Primary", "Primária") },
  ];
  const finishes: { value: GlassFinish; label: string; desc: string }[] = [
    { value: "translucido", label: t("Translucent", "Translúcido"), desc: t("Very transparent, almost no blur: the background shows through whole. For short labels over calm images.", "Bem transparente, quase sem desfoque: o fundo aparece inteiro. Para rótulos curtos sobre imagens calmas.") },
    { value: "fosco", label: t("Frosted", "Fosco"), desc: t("Sandblasted glass: heavy blur, more opaque, no reflection. The most legible; works over busy photos.", "Vidro jateado: muito desfoque, mais opaco, sem reflexo. O mais legível; funciona sobre fotos movimentadas.") },
    { value: "luz", label: t("Light focus", "Foco de luz"), desc: t("Medium glass with a light spot in the top-left corner and an inner glow. For hero and highlight cards.", "Vidro médio com um foco de luz no canto superior esquerdo e brilho interno. Para cards de hero e destaque.") },
    { value: "cristal", label: t("Crystal", "Cristal"), desc: t("Sharp glass: bright edge and a diagonal reflection. For premium moments, one per screen.", "Vidro nítido: borda brilhante e um reflexo diagonal. Para momentos premium, um por tela.") },
    { value: "padrao", label: t("Glass", "Vidro"), desc: t("Balanced glass: medium blur and medium opacity. The main finish.", "Vidro equilibrado: desfoque médio e opacidade média. O acabamento principal.") },
  ];
  const current = finishes.find(x => x.value === finish)!;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex min-w-0 max-w-full flex-col gap-1.5 overflow-x-auto">
          <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Finish", "Acabamento")}</span>
          <SegmentedControl size="sm" aria-label={t("Finish", "Acabamento")} value={finish} onValueChange={setFinish} options={finishes.map(x => ({ value: x.value, label: x.label }))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Tone", "Tom")}</span>
          <SegmentedControl size="sm" aria-label={t("Tone", "Tom")} value={tone} onValueChange={setTone} options={[{ value: "clara", label: t("Light", "Claro") }, { value: "escura", label: t("Dark", "Escuro") }]} />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Opacity", "Opacidade")}</span>
          <SegmentedControl size="sm" aria-label={t("Opacity", "Opacidade")} value={intensity} onValueChange={setIntensity} options={[{ value: "leve", label: t("Light", "Leve") }, { value: "media", label: t("Medium", "Média") }, { value: "forte", label: t("Strong", "Forte") }]} />
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
        <div className="flex min-w-0 max-w-full flex-col gap-1.5 overflow-x-auto">
          <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Test background", "Fundo de teste")}</span>
          <SegmentedControl size="sm" aria-label={t("Test background", "Fundo de teste")} value={cena.fundo} onValueChange={v => setCena(c => ({ ...c, fundo: v }))} options={fundos} />
        </div>
        {cena.fundo === "solida" && (
          <div className="flex min-w-0 max-w-full flex-col gap-1.5 overflow-x-auto">
            <span className="text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Colour", "Cor")}</span>
            <SegmentedControl size="sm" aria-label={t("Colour", "Cor")} value={cena.cor} onValueChange={v => setCena(c => ({ ...c, cor: v }))}
              options={cores.map(x => ({ value: x.value, label: <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-3 w-3 rounded-full border border-border" style={{ backgroundColor: coresSolidas[x.value] }} />{x.label}</span> }))} />
          </div>
        )}
      </div>
      <div className="grid gap-x-8 gap-y-4 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-label">
            <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Background opacity", "Opacidade do fundo")}</span>
            <span className="font-mono text-foreground">{opacidade === null ? t("by finish", "do acabamento") : `${opacidade}%`}</span>
          </div>
          <Slider aria-label={t("Background opacity", "Opacidade do fundo")} min={0} max={100} step={1} value={[opacidade ?? 55]} onValueChange={([v]) => setOpacidade(v)} />
          <p className="text-caption text-muted-foreground">{t("0% = fully transparent · 100% = solid", "0% = totalmente transparente · 100% = sólido")}</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-label">
            <span className="font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Blur", "Desfoque")}</span>
            <span className="font-mono text-foreground">{desfoque === null ? t("by finish", "do acabamento") : `${desfoque} px`}</span>
          </div>
          <Slider aria-label={t("Blur", "Desfoque")} min={0} max={80} step={1} value={[desfoque ?? 24]} onValueChange={([v]) => setDesfoque(v)} />
          <p className="text-caption text-muted-foreground">{t("0 px = sees through sharp · 80 px = fully frosted", "0 px = vê através nítido · 80 px = totalmente jateado")}</p>
        </div>
        <button type="button" onClick={() => { setOpacidade(null); setDesfoque(null); }} disabled={!livre}
          className="h-9 rounded-full border border-border bg-card px-4 text-label font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-text disabled:opacity-40 disabled:pointer-events-none">
          {t("Back to finish", "Voltar ao acabamento")}
        </button>
      </div>
      <CenaDeTesteCtx.Provider value={cena}>
      <CenaDoVidro>
        <GradeDeCards className="gap-5 md:grid-cols-2">
          <GlassTestCard finish={finish} tone={tone} intensity={intensity} opacity={opacidade ?? undefined} blur={desfoque ?? undefined} interactive eyebrow={t("Organization · Health", "Organização · Saúde")} title={t("Clínica Horizonte", "Clínica Horizonte")} subtitle={t("Reception journey: 4 hypotheses, 2 tests planned.", "Jornada da recepção: 4 hipóteses, 2 testes planejados.")} cta={t("Open challenge", "Abrir desafio")} />
          <GlassTestCard finish={finish} tone={tone} intensity={intensity} opacity={opacidade ?? undefined} blur={desfoque ?? undefined} tint title={current.label} subtitle={current.desc} />
        </GradeDeCards>
      </CenaDoVidro>
      <CenaDoVidro className="p-4 sm:p-5">
        <GradeDeCards className="gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {finishes.map(x => (
            <GlassTestCard key={x.value} compact finish={x.value} intensity="media" title={x.label} subtitle={`finish="${x.value}"`} />
          ))}
        </GradeDeCards>
      </CenaDoVidro>
      </CenaDeTesteCtx.Provider>
    </div>
  );
}

/* ── Partes da página: Card sólido, Card de vidro, Testar o vidro e O que evitar ── */
function Parte({ id, numero, titulo, texto }: { id: string; numero: string; titulo: string; texto: string }) {
  return (
    <div id={id} className="scroll-mt-32 border-t border-border pt-8">
      <p className="text-label font-semibold uppercase tracking-[0.12em] text-[var(--primary-text,var(--primary))]">{numero}</p>
      <h2 className={`${display} mt-1 text-h2 font-bold tracking-[-0.025em] text-foreground`}>{titulo}</h2>
      <p className="mt-2 max-w-3xl text-body leading-relaxed text-muted-foreground">{texto}</p>
    </div>
  );
}

/** Rótulo curto acima de cada exemplo. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>;
}

/* Exemplos "por fundo" mostram o modo claro mesmo com o DS no escuro: cores fixas da escala grafite. */
type FundoSolido = "branco" | "cinza" | "escuro";
function CardPorFundo({ fundo }: { fundo: FundoSolido }) {
  const { t } = useI18n();
  const regras: Record<FundoSolido, { painel: string; card: string; sombra?: string; regra: string }> = {
    branco: { painel: "bg-white", card: "border border-[var(--graphite-100)]", regra: t("Border, no shadow", "Borda, sem sombra") },
    cinza: { painel: "bg-[var(--graphite-50)]", card: "border border-[var(--graphite-100)]", regra: t("Border, no shadow", "Borda, sem sombra") },
    escuro: { painel: "bg-[var(--graphite-950)]", card: "", sombra: "var(--shadow-lg)", regra: t("No border, strong shadow", "Sem borda, sombra forte") },
  };
  const r = regras[fundo];
  return (
    <div data-fundo-solido={fundo} className={cn("rounded-lg border border-border p-6", r.painel)}>
      <div className={cn("rounded-xl bg-white p-5 text-[var(--graphite-900)]", r.card)} style={{ boxShadow: r.sombra }}>
        <p className={`${display} text-body font-semibold`}>{t("Card title", "Título do card")}</p>
        <p className="mt-1 text-body-sm leading-relaxed text-[var(--graphite-500)]">{t("Short description of the content.", "Descrição curta do conteúdo.")}</p>
        <Button size="sm" className="mt-4">{t("Action", "Ação")}</Button>
      </div>
      <p className={cn("mt-3 text-label font-semibold", fundo === "escuro" ? "text-white/80" : "text-[var(--graphite-700)]")}>{r.regra}</p>
    </div>
  );
}

/** Foto de exemplo para os cards com imagem (a mesma do Projeto Piloto). */
const FOTO = { src: `${import.meta.env.BASE_URL}fotos/projeto-piloto-hero.webp`, alt: { en: "Dani Moscatelli in a meeting with clients at the studio office", pt: "Dani Moscatelli em reunião com clientes no escritório do estúdio" } };

/* ── Mesma altura, ou um por linha (regra da dona do produto, 27/11/2026) ── */
/** Dois cards lado a lado; o interruptor põe muito conteúdo no segundo e a GradeDeCards troca para um por linha. */
function DemoMesmaAltura() {
  const { t } = useI18n();
  const [mais, setMais] = useState(false);
  const [layout, setLayout] = useState<LayoutDaGrade>("grade");
  const id = React.useId();
  const itens = [
    t("Long queue at check-in", "Fila longa no check-in"),
    t("Form with too many fields", "Formulário com campos demais"),
    t("Missing signage", "Falta de sinalização"),
    t("Callback with no date", "Retorno sem previsão"),
    t("Shift change without handover", "Troca de turno sem passagem"),
  ];
  return (
    <Panel className="p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Switch id={id} checked={mais} onCheckedChange={setMais} />
          <Label htmlFor={id} className="text-body-sm">{t("Much more content in the second card", "Muito mais conteúdo no segundo card")}</Label>
        </div>
        <Badge variant="outline" role="status" className="gap-1.5 px-2.5 py-1 text-label">
          {layout === "grade" ? <Columns2 aria-hidden /> : <Rows2 aria-hidden />}
          {layout === "grade" ? t("Side by side · same height", "Lado a lado · mesma altura") : t("One per row · horizontal cards", "Um por linha · cards horizontais")}
        </Badge>
      </div>
      <GradeDeCards data-demo="mesma-altura" colunas={{ base: 1, md: 2 }} onLayoutChange={setLayout}>
        <Card className="border-border">
          <CardMidia tipo="icone"><Search /></CardMidia>
          <CardHeader>
            <CardTitle className={`${display} text-body font-semibold`}>{t("Customer research", "Pesquisa com clientes")}</CardTitle>
            <CardDescription className="text-body-sm leading-relaxed">{t("Interviews and observations gathered this month.", "Entrevistas e observações reunidas neste mês.")}</CardDescription>
          </CardHeader>
          <CardFooter><Button variant="outline" size="sm">{t("See research", "Ver pesquisa")}</Button></CardFooter>
        </Card>
        <Card className="border-border">
          <CardMidia tipo="icone"><TrendingUp /></CardMidia>
          <CardHeader>
            <CardTitle className={`${display} text-body font-semibold`}>{t("Friction points", "Pontos de atrito")}</CardTitle>
            <CardDescription className="text-body-sm leading-relaxed">{t("Where the journey gets stuck the most.", "Onde a jornada mais trava.")}</CardDescription>
          </CardHeader>
          {mais && (
            <CardContent>
              <ol className="space-y-2 text-body-sm text-foreground">
                {itens.map((x, i) => (
                  <li key={x} className="flex items-center gap-3"><span className="w-4 text-right font-semibold text-muted-foreground">{i + 1}</span>{x}</li>
                ))}
              </ol>
            </CardContent>
          )}
          <CardFooter><Button size="sm">{t("See journey", "Ver jornada")}<ChevronRight /></Button></CardFooter>
        </Card>
      </GradeDeCards>
    </Panel>
  );
}

/** Exemplo certo ou errado: selo com ícone e texto, a frase e o exemplo. */
function ExemploDeAltura({ certo, titulo, children }: { certo: boolean; titulo: string; children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline" className={cn("gap-1 px-2 py-0.5", certo ? "text-[var(--success-text,var(--success))]" : "text-[var(--error-text,var(--destructive))]")}>
          {certo ? <Check aria-hidden /> : <X aria-hidden />}{certo ? t("Correct", "Certo") : t("Incorrect", "Errado")}
        </Badge>
        <p className="text-body-sm text-muted-foreground">{titulo}</p>
      </div>
      {children}
    </div>
  );
}

/** Card pequeno dos exemplos certo e errado. */
function CardDeExemplo({ titulo, texto, acao }: { titulo: string; texto: string; acao: string }) {
  return (
    <Card className="gap-3 border-border">
      <CardHeader className="px-4 pt-4">
        <CardTitle className={`${display} text-body-sm font-semibold`}>{titulo}</CardTitle>
        <CardDescription className="text-label leading-relaxed">{texto}</CardDescription>
      </CardHeader>
      <CardFooter className="px-4 pb-4"><Button variant="outline" size="sm">{acao}</Button></CardFooter>
    </Card>
  );
}


export function CardShowcase() {
  const { t, bi } = useI18n();
  const dark = useIsDark();
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
        { name: "--radius", description: t("Base radius. The card uses rounded-xl = --radius + 12 px = 24 px", "Raio base. O card usa rounded-xl = --radius + 12 px = 24 px"), light: "0.75rem (12 px)" },
        { name: t("Highlight radius", "Raio de destaque"), description: t("Media, highlight and partner cards", "Cards com mídia, destaque e convite"), light: "16 px" },
        { name: t("Glass radius", "Raio do vidro"), description: t("Glass cards", "Cards de vidro"), light: "16 px (rounded-lg)" },
        { name: "--shadow-sm", description: t("Soft shadow for small raised controls (active tab, top bar). Never on a resting card", "Sombra suave para controles pequenos em destaque (aba ativa, barra do topo). Nunca em card parado"), light: "0 1px 3px …", dark: "0 1px 3px …" },
        { name: "--shadow-md", description: t("Hover elevation", "Elevação no hover"), light: "0 4px 12px …", dark: "0 4px 12px …" },
        { name: "--shadow-lg", description: t("Strong shadow: light card on a dark background", "Sombra forte: card claro sobre fundo escuro"), light: "0 8px 24px …", dark: "0 8px 32px …" },
      ],
    },
  ];

  const glassTokens: TokenGroup = {
    group: t("Glass tokens", "Tokens do vidro"),
    tokens: [
      { name: "finish padrao (Vidro)", description: t("Balanced glass", "Vidro equilibrado"), light: "blur 12/24/40 px · white 40/55/70%", dark: "white 8/12/16%" },
      { name: "finish translucido", description: t("Very transparent", "Bem transparente"), light: "blur 2 px · white 10/18/28%", dark: "white 4/6/9%" },
      { name: "finish fosco", description: t("Frosted, matte", "Jateado, sem reflexo"), light: "blur 64 px · white 60/72/84%", dark: "white 14/18/22%" },
      { name: "finish luz", description: t("Light spot top-left", "Foco de luz no canto"), light: "blur 24 px · white 35/48/62% + radial 55%", dark: "radial 28%" },
      { name: "finish cristal", description: t("Bright edge, diagonal sheen", "Borda brilhante, reflexo diagonal"), light: "blur 12 px · white 22/32/44% · border 90%", dark: "border 30%" },
      { name: "opacity / blur", description: t("Free control, overrides the finish", "Controle livre, sobrepõe o acabamento"), light: "opacity 0–100 % · blur 0–80 px" },
      { name: "escura — bg", description: t("Dark glass background", "Fundo do vidro escuro"), light: "graphite-950 35% · 50% · 65%" },
      { name: "border", description: t("Glass edge", "Borda do vidro"), light: "white 60% (clara) · white 15% (escura)", dark: "white 15%" },
      { name: "highlight", description: t("1 px top highlight", "Fio de luz no topo, 1 px"), light: "gradient white 80%", dark: "gradient white 40%" },
      { name: "radius / padding", description: t("Same anatomy as Card", "Mesma anatomia do Card"), light: "16 px / 24 px" },
      { name: "shadow", description: t("Soft elevation", "Elevação suave"), light: "0 8px 32px graphite-950 8% (clara) · 25% (escura)" },
    ],
  };

  // Vidro: só combinações aprovadas no contraste (AA), calculadas no tema atual
  const acabamentos: { value: GlassFinish; label: string; desc: string }[] = [
    { value: "padrao", label: t("Glass", "Vidro"), desc: t("Balanced glass: medium blur and medium opacity. The main finish.", "Vidro equilibrado: desfoque médio e opacidade média. O acabamento principal.") },
    { value: "translucido", label: t("Translucent", "Translúcido"), desc: t("Very transparent, almost no blur. For short labels over calm images.", "Bem transparente, quase sem desfoque. Para rótulos curtos sobre imagens calmas.") },
    { value: "fosco", label: t("Frosted", "Fosco"), desc: t("Heavy blur, more opaque, no reflection. The most legible.", "Muito desfoque, mais opaco, sem reflexo. O mais legível.") },
    { value: "luz", label: t("Light focus", "Foco de luz"), desc: t("Light spot in the top-left corner. For hero and highlight cards.", "Foco de luz no canto superior esquerdo. Para hero e destaque.") },
    { value: "cristal", label: t("Crystal", "Cristal"), desc: t("Bright edge and diagonal reflection. One per screen.", "Borda brilhante e reflexo diagonal. Um por tela.") },
  ];
  const cenaPadrao: CenaDeTeste = { fundo: "padrao", cor: "grafite" };
  const cenaEscura: CenaDeTeste = { fundo: "escura", cor: "grafite" };
  const cenaFoto: CenaDeTeste = { fundo: "foto", cor: "grafite" };
  const aprovados = React.useMemo(() => acabamentos.map(a => ({ ...a, cfg: primeiraAprovada(candidatasDe(a.value), cenaPadrao, dark) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dark, t]);
  const semAprovacao = aprovados.filter(a => !a.cfg).map(a => a.label);
  const vidroConteudo = React.useMemo(() => primeiraAprovada([
    { finish: "padrao", tone: "clara", intensity: "forte" }, { finish: "fosco", tone: "clara", intensity: "media" }, { finish: "fosco", tone: "clara", intensity: "forte" },
    { finish: "padrao", tone: "escura", intensity: "forte" }, { finish: "fosco", tone: "escura", intensity: "forte" },
  ], cenaPadrao, dark), [dark]);
  const vidroPorFundo = React.useMemo(() => ({
    padrao: primeiraAprovada([...candidatasDe("padrao"), ...candidatasDe("fosco")], cenaPadrao, dark),
    escura: primeiraAprovada([...candidatasDe("padrao").filter(c => c.tone === "escura"), ...candidatasDe("fosco").filter(c => c.tone === "escura"), ...candidatasDe("padrao"), ...candidatasDe("fosco")], cenaEscura, dark),
    foto: primeiraAprovada([...candidatasDe("fosco").filter(c => c.tone === "escura"), ...candidatasDe("padrao").filter(c => c.tone === "escura"), ...candidatasDe("fosco")], cenaFoto, dark),
  }), [dark]);
  const corSub = (c: ConfigVidro | null) => (c?.tone === "escura" ? "text-white/70" : "text-muted-foreground dark:text-white/70");
  const corMono = (c: ConfigVidro | null) => (c?.tone === "escura" ? "text-white/60" : "text-muted-foreground dark:text-white/60");

  const exemploParceiro = {
    eyebrow: t("Partner network", "Rede de Parceiros"),
    title: t("Join the **Partner Network**", "Faça parte da **Rede de Parceiros**"),
    description: t("The studio is expanding and building a multidisciplinary ecosystem of independent professionals to collaborate on Design, Human Experience, Business, Technology and Innovation projects.", "O estúdio está ampliando sua atuação e construindo um ecossistema multidisciplinar de profissionais independentes (PJ) para colaborar em projetos de Design, Experiência Humana, Negócios, Tecnologia e Inovação."),
    cta: { label: t("I want to be a partner", "Quero ser parceiro"), href: "#" },
    secondary: { label: t("How it works", "Como funciona"), href: "#" },
    visual: <Handshake />,
  };

  return (
    <div className="space-y-16">
      {/* ═══ COMO ESCOLHER ═══ */}
      <section id="card-escolher" className="scroll-mt-32">
        <SectionHeader
          title={t("How to choose a card", "Como escolher o card")}
          description={t(
            "Start from what is behind the card. The background defines the type of card, the border, the shadow and the radius. Solid cards are the default; glass cards are only for photos, colour or gradients.",
            "Comece pelo que está atrás do card. O fundo define o tipo de card, a borda, a sombra e o raio. O card sólido é o padrão; o card de vidro é só para foto, cor ou gradiente.",
          )}
        />
        <DataTable
          head={[t("Background behind the card", "Fundo atrás do card"), t("Card", "Card"), t("Border", "Borda"), t("Shadow", "Sombra"), t("Radius", "Raio")]}
          rows={[
            [t("White", "Branco"), t("Solid", "Sólido"), "--border", t("None", "Nenhuma"), "12 px"],
            [t("Light grey (like this page)", "Cinza claro (como esta página)"), t("Solid", "Sólido"), "--border", t("None", "Nenhuma"), "12 px"],
            [t("Dark, in light mode", "Escuro, no modo claro"), t("Solid white", "Sólido branco"), t("None", "Nenhuma"), "--shadow-lg", "12 px"],
            [t("Photo, colour or gradient", "Foto, cor ou gradiente"), t("Glass", "Vidro"), t("Light glass edge", "Borda clara do vidro"), t("Glass shadow", "Sombra do vidro"), "16 px"],
          ]}
        />
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">{t("In the dark theme the card tokens change on their own; the same rules apply. Media, highlight and partner cards use 16 px.", "No tema escuro os tokens do card mudam sozinhos; as mesmas regras valem. Cards com mídia, de destaque e de convite usam 16 px.")}</p>
      </section>

      {/* ═══ PARTE 1: CARD SÓLIDO ═══ */}
      <Parte id="card-solido" numero={t("Part 1", "Parte 1")} titulo={t("Solid card", "Card sólido")} texto={t("The default card: an opaque surface for grouping one subject or task. Everything here is recommended.", "O card padrão: superfície opaca para agrupar um assunto ou tarefa. Tudo aqui é recomendado.")} />

      <section id="card-anatomy" className="scroll-mt-32">
        <SectionHeader
          title={t("Anatomy", "Anatomia")}
          description={t(
            "Cards group related information and actions into a scannable surface. Use a clear hierarchy and include only elements that belong to the same task or subject.",
            "Cards agrupam informações e ações relacionadas em uma superfície fácil de escanear. Use uma hierarquia clara e inclua apenas elementos da mesma tarefa ou assunto.",
          )}
        />
        <GradeDeCards className="gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <SpecCard
            title={t("Workspace activity", "Atividade do workspace")}
            description={t("A concise description establishes context before the main content.", "Uma descrição concisa estabelece o contexto antes do conteúdo principal.")}
            action={<Button variant="ghost" size="icon" aria-label={t("Open options", "Abrir opções")}><Sparkles /></Button>}
            footer={
              <div className="flex w-full items-center justify-between gap-3">
                <span className="text-label text-muted-foreground">{t("Updated 5 minutes ago", "Atualizado há 5 minutos")}</span>
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
                <div key={label} className="rounded-md bg-muted p-3">
                  <p className="text-caption text-muted-foreground mb-1">{label}</p>
                  <p className={`${display} text-body font-semibold text-foreground`}>{value}</p>
                </div>
              ))}
            </div>
          </SpecCard>
          <DataTable
            head={[t("Part", "Parte"), t("Purpose", "Finalidade")]}
            rows={[
              [t("Container", "Container"), t("Groups the content and defines surface, border, radius and elevation.", "Agrupa o conteúdo e define superfície, borda, raio e elevação.")],
              [t("Header", "Cabeçalho"), t("Holds title, description and an optional contextual action.", "Contém título, descrição e uma ação contextual opcional.")],
              [t("Content", "Conteúdo"), t("Carries the primary information. Its structure changes by use case.", "Carrega a informação principal. Sua estrutura muda conforme o caso de uso.")],
              [t("Footer", "Rodapé"), t("Contains metadata or actions related to the whole card.", "Contém metadados ou ações relacionadas ao card inteiro.")],
            ]}
          />
        </GradeDeCards>
      </section>

      <section id="card-fundos" className="scroll-mt-32">
        <SectionHeader
          title={t("By background", "Por fundo")}
          description={t(
            "The same light-mode card on the three backgrounds where solid cards are used. On the page background, white or light grey, the card is always border only: 1 px border, no shadow. On a dark background (not the dark theme), the white card drops the border and gains a strong shadow.",
            "O mesmo card do modo claro nos três fundos em que o card sólido é usado. Sobre o fundo da página, branco ou cinza claro, o card é sempre só borda: borda de 1 px, sem sombra. Sobre fundo escuro (não é o tema escuro), o card branco fica sem borda e ganha sombra forte.",
          )}
        />
        <GradeDeCards className="gap-4 md:grid-cols-3">
          <ItemDaGrade><Rotulo>{t("White background", "Fundo branco")}</Rotulo><CardPorFundo fundo="branco" /></ItemDaGrade>
          <ItemDaGrade><Rotulo>{t("Light grey background", "Fundo cinza claro")}</Rotulo><CardPorFundo fundo="cinza" /></ItemDaGrade>
          <ItemDaGrade><Rotulo>{t("Dark background (light mode)", "Fundo escuro (modo claro)")}</Rotulo><CardPorFundo fundo="escuro" /></ItemDaGrade>
        </GradeDeCards>
      </section>

      <section id="card-layout" className="scroll-mt-32">
        <SectionHeader
          title={t("Border, shadow and radius", "Borda, sombra e raio")}
          description={t("When each card gets a border or a shadow, and which radius to use. Card dimensions respond to the parent grid; prefer consistent internal spacing over fixed heights.", "Quando o card tem borda ou sombra e qual raio usar. As dimensões respondem ao grid pai; prefira espaçamento interno consistente a alturas fixas.")}
        />
        <div className="space-y-6">
          <GradeDeCards className="gap-4 sm:grid-cols-3">
            {[
              { nome: t("Border only", "Só borda"), quando: t("Resting card on the page background, white or light grey: 1 px border, no shadow.", "Card parado sobre o fundo da página, branco ou cinza claro: borda de 1 px, sem sombra."), cls: "border border-border", sombra: undefined },
              { nome: t("Medium shadow", "Sombra média"), quando: t("Hover on a clickable card.", "Hover de card clicável."), cls: "border border-[var(--border-strong)]", sombra: "var(--shadow-md)" },
              { nome: t("Strong shadow, no border", "Sombra forte, sem borda"), quando: t("Light card on a dark background.", "Card claro sobre fundo escuro."), cls: "", sombra: "var(--shadow-lg)" },
            ].map(x => (
              <div key={x.nome} className={cn("rounded-xl bg-card p-5", x.cls)} style={{ boxShadow: x.sombra }}>
                <p className="text-body-sm font-semibold text-foreground">{x.nome}</p>
                <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">{x.quando}</p>
              </div>
            ))}
          </GradeDeCards>
          <GradeDeCards className="gap-4 sm:grid-cols-3">
            {[
              { raio: "rounded-xl", valor: "24 px · rounded-xl", uso: t("Default card, lists, forms and data.", "Card padrão, listas, formulários e dados.") },
              { raio: "rounded-lg", valor: "16 px", uso: t("Media, highlight and partner cards.", "Cards com mídia, de destaque e de convite.") },
              { raio: "rounded-lg", valor: "16 px", uso: t("Glass cards.", "Cards de vidro.") },
            ].map(x => (
              <div key={x.valor} className={cn("border border-border bg-card p-5", x.raio)}>
                <p className="font-mono text-body-sm text-foreground">{x.valor}</p>
                <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">{x.uso}</p>
              </div>
            ))}
          </GradeDeCards>
          <GradeDeCards className="gap-5 lg:grid-cols-2">
            <Panel className="p-5">
              <SubTitle>{t("Default specification", "Especificação padrão")}</SubTitle>
              <div className="space-y-3 text-body-sm">
                {[
                  [t("Padding", "Padding"), "24px", t("16px for compact cards", "16px para cards compactos")],
                  [t("Section gap", "Espaço entre seções"), "24px", t("Use 12–16px in dense layouts", "Use 12–16px em layouts densos")],
                  [t("Radius", "Raio"), "24px · rounded-xl", t("Keep consistent within the same grid", "Mantenha consistente no mesmo grid")],
                  [t("Border", "Borda"), "1px", t("Use border-border", "Use border-border")],
                  [t("Elevation", "Elevação"), t("By background", "Pelo fundo"), t("See the table at the top of the page", "Veja a tabela no topo da página")],
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
                "Let cards fill their grid column. Collapse multi-column content before reducing internal padding, and keep the content inside the card without horizontal scrolling.",
                "Deixe os cards preencherem sua coluna no grid. Reduza conteúdos em múltiplas colunas antes de diminuir o padding interno e mantenha o conteúdo dentro do card, sem rolagem horizontal.",
              )}</p>
              <ResumoDaRegraDasLinhas />
            </Callout>
          </GradeDeCards>
        </div>
      </section>

      <section id="card-orientacao" className="scroll-mt-32">
        <SectionHeader
          title={t("Vertical and horizontal", "Vertical e horizontal")}
          description={t("Vertical for grids of 2 to 4 columns; horizontal for lists and full-width bands. On phones, the horizontal card becomes vertical.", "Vertical para grids de 2 a 4 colunas; horizontal para listas e faixas de largura inteira. No celular, o card horizontal vira vertical.")}
        />
        <GradeDeCards className="gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <ItemDaGrade>
            <Rotulo>{t("Vertical", "Vertical")}</Rotulo>
            <Card orientacao="vertical" className="overflow-hidden rounded-lg border-border">
              <CardMidia><img src={FOTO.src} alt={bi(FOTO.alt)} /></CardMidia>
              <CardHeader>
                <CardTitle className={`${display} text-body font-semibold`}>{t("Pilot Project Programme", "Programa Projeto Piloto")}</CardTitle>
                <CardDescription>{t("A new perspective on your business experience challenges.", "Uma nova perspectiva sobre os desafios de experiência do seu negócio.")}</CardDescription>
              </CardHeader>
              <CardFooter><Button variant="outline" size="sm">{t("Learn more", "Saiba mais")}</Button></CardFooter>
            </Card>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("Horizontal", "Horizontal")}</Rotulo>
            <Card orientacao="horizontal" className="overflow-hidden rounded-lg border-border">
              <CardMidia><img src={FOTO.src} alt={bi(FOTO.alt)} /></CardMidia>
              <CardHeader>
                <CardTitle className={`${display} text-body font-semibold`}>{t("Pilot Project Programme", "Programa Projeto Piloto")}</CardTitle>
                <CardDescription>{t("A new perspective on your business experience challenges.", "Uma nova perspectiva sobre os desafios de experiência do seu negócio.")}</CardDescription>
              </CardHeader>
              <CardFooter><Button variant="outline" size="sm">{t("Learn more", "Saiba mais")}</Button></CardFooter>
            </Card>
          </ItemDaGrade>
        </GradeDeCards>
        <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">{t("Same Card, same parts: orientacao=\"horizontal\" puts the CardMidia on the left and the header and content in the rest of the width; the footer goes below, across the whole card. Inside a GradeDeCards that became a list, the Card turns horizontal on its own.", "O mesmo Card, as mesmas partes: orientacao=\"horizontal\" põe a CardMidia à esquerda e o cabeçalho e o conteúdo no resto da largura; o rodapé vai para baixo, na largura inteira do card. Dentro de uma GradeDeCards que virou lista, o Card fica horizontal sozinho.")}</p>
        <div className="mt-4">
          <Callout title={t("Card with an action: divider and button in the bottom-right corner", "Card com ação: divisor e botão no canto inferior direito")}>
            <p>{t("Rule of the product owner (27/11/2026). In the horizontal card, the actions never form a column on the right, centred beside the content: the CardFooter becomes a full-width row below, with the card divider on top and the buttons aligned to the bottom-right corner. The vertical card keeps its footer at the bottom, as before.", "Regra da dona do produto (27/11/2026). No card horizontal, as ações nunca formam uma coluna à direita, centrada ao lado do conteúdo: o CardFooter vira uma linha de largura inteira embaixo, com o divisor do card em cima e os botões alinhados no canto inferior direito. O card vertical mantém o rodapé na base, como antes.")}</p>
          </Callout>
        </div>
      </section>

      <section id="card-mesma-altura" className="scroll-mt-32">
        <SectionHeader
          title={t("Same height, or one per row", "Mesma altura, ou um por linha")}
          description={t(
            "Rule of the product owner (27/11/2026): cards side by side never have different heights. If the content is so different that one card would be left with a large empty vertical area, the cards become horizontal, one per row, and the card that was beside goes below. GradeDeCards does this on its own.",
            "Regra da dona do produto (27/11/2026): cards lado a lado nunca têm tamanhos diferentes. Se o conteúdo for tão diferente que um card ficaria com uma área vazia vertical grande, os cards passam a ser horizontais, um por linha, e o card que estava do lado vai para baixo. A GradeDeCards faz isso sozinha.",
          )}
        />
        <div className="space-y-6">
          <DemoMesmaAltura />
          {/* exemplos (não são cards): cada um com o selo Certo ou Errado */}
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-2">
            <ExemploDeAltura certo titulo={t("Similar content: side by side, same height, actions aligned at the bottom.", "Conteúdo parecido: lado a lado, mesma altura, ações alinhadas na base.")}>
              <GradeDeCards colunas={{ base: 1, sm: 2 }}>
                <CardDeExemplo titulo={t("Journey map", "Mapa da jornada")} texto={t("Steps, people and channels.", "Etapas, pessoas e canais.")} acao={t("Edit", "Editar")} />
                <CardDeExemplo titulo={t("Evidence", "Evidências")} texto={t("Interviews, observations and records of each step.", "Entrevistas, observações e registros de cada etapa.")} acao={t("Open", "Abrir")} />
              </GradeDeCards>
            </ExemploDeAltura>
            <ExemploDeAltura certo titulo={t("Very different content: horizontal cards, one per row, with the divider and the action in the bottom-right corner.", "Conteúdo muito diferente: cards horizontais, um por linha, com divisor e ação no canto inferior direito.")}>
              <GradeDeCards colunas={{ base: 1, sm: 2 }}>
                <CardDeExemplo titulo={t("Journey map", "Mapa da jornada")} texto={t("Steps, people and channels.", "Etapas, pessoas e canais.")} acao={t("Edit", "Editar")} />
                <CardDeExemplo titulo={t("Evidence", "Evidências")} texto={t("Interviews, observations and records of each step. Separate what a person said from what was observed and what was measured, and note the source and the date of each one, so the hypotheses that come next rest on evidence and not on impressions.", "Entrevistas, observações e registros de cada etapa. Separe o que a pessoa disse do que foi observado e do que foi medido, e anote a fonte e a data de cada um, para que as hipóteses seguintes partam de evidências e não de impressões.")} acao={t("Open", "Abrir")} />
              </GradeDeCards>
            </ExemploDeAltura>
            <ExemploDeAltura certo={false} titulo={t("Different heights side by side.", "Alturas diferentes lado a lado.")}>
              <GradeDeCards data-cards-ignorar layout="grade" colunas={{ base: 1, sm: 2 }} className="items-start">
                <CardDeExemplo titulo={t("Journey map", "Mapa da jornada")} texto={t("Steps, people and channels.", "Etapas, pessoas e canais.")} acao={t("Edit", "Editar")} />
                <CardDeExemplo titulo={t("Evidence", "Evidências")} texto={t("Interviews, observations and records of each step, with source and date.", "Entrevistas, observações e registros de cada etapa, com fonte e data.")} acao={t("Open", "Abrir")} />
              </GradeDeCards>
            </ExemploDeAltura>
            <ExemploDeAltura certo={false} titulo={t("Same height, but with a large empty area.", "Mesma altura, mas com uma área vazia grande.")}>
              <GradeDeCards data-cards-ignorar layout="grade" colunas={{ base: 1, sm: 2 }}>
                <CardDeExemplo titulo={t("Journey map", "Mapa da jornada")} texto={t("Steps, people and channels.", "Etapas, pessoas e canais.")} acao={t("Edit", "Editar")} />
                <CardDeExemplo titulo={t("Evidence", "Evidências")} texto={t("Interviews, observations and records of each step. Separate what a person said from what was observed and what was measured, and note the source and the date of each one, so the hypotheses that come next rest on evidence and not on impressions.", "Entrevistas, observações e registros de cada etapa. Separe o que a pessoa disse do que foi observado e do que foi medido, e anote a fonte e a data de cada um, para que as hipóteses seguintes partam de evidências e não de impressões.")} acao={t("Open", "Abrir")} />
              </GradeDeCards>
            </ExemploDeAltura>
          </div>
          <GradeDeCards colunas={{ base: 1, lg: 2 }} className="gap-5">
            <DataTable
              head={[t("Situation", "Situação"), t("Layout", "Layout")]}
              rows={[
                [t("Difference up to the limit", "Diferença até o limite"), t("Side by side; the grid stretches the cards to the same height and the footer goes to the bottom.", "Lado a lado; a grade estica os cards até a mesma altura e o rodapé desce para a base.")],
                [t(`Difference above ${LIMITE_DE_DIFERENCA.px} px`, `Diferença acima de ${LIMITE_DE_DIFERENCA.px} px`), t("One per row, horizontal cards.", "Um por linha, cards horizontais.")],
                [t("Difference above 1/3 of the tallest card (and at least 64 px)", "Diferença acima de 1/3 do card mais alto (e de pelo menos 64 px)"), t("One per row, horizontal cards.", "Um por linha, cards horizontais.")],
                [t("Card with an action (one per row)", "Card com ação (um por linha)"), t("Card with an action: divider and button in the bottom-right corner.", "Card com ação: divisor e botão no canto inferior direito.")],
                [t("Back to side by side", "Volta para lado a lado"), t("Only when the difference falls below 75% of the limit (90 px, or 1/4 and 48 px), so it does not flicker.", "Só quando a diferença cai abaixo de 75% do limite (90 px, ou 1/4 e 48 px), para não piscar.")],
                [t("One column (phone)", "Uma coluna (celular)"), t("Nothing changes: the cards are already one per row, vertical.", "Nada muda: os cards já ficam um por linha, na vertical.")],
              ]}
            />
            <Callout title={t("Why this limit", "Por que este limite")}>
              <p>{t(
                "120 px is about 5 lines of text: an empty area that shows in any card. One third catches small cards: in a 180 px indicator, 60 px empty already looks half empty. The 64 px floor avoids switching for differences the size of the card's own padding.",
                "120 px são cerca de 5 linhas de texto: uma área vazia que aparece em qualquer card. Um terço pega os cards pequenos: num indicador de 180 px, 60 px vazios já parecem pela metade. O piso de 64 px evita a troca por diferenças do tamanho do próprio respiro do card.",
              )}</p>
              <p className="mt-2">{t(
                "The grid measures again when the width or the content changes (ResizeObserver), before painting, and the switch fades in briefly; with reduced motion, without animation.",
                "A grade mede de novo quando a largura ou o conteúdo mudam (ResizeObserver), antes da pintura, e a troca entra com um esmaecimento curto; com \"menos movimento\", sem animação.",
              )}</p>
            </Callout>
          </GradeDeCards>
          <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { GradeDeCards, ItemDaGrade } from "@/app/components/ui/grade-de-cards";
import { Card, CardMidia, CardHeader, CardTitle, CardFooter } from "@/app/components/ui/card";

<GradeDeCards colunas={{ base: 1, md: 2, lg: 3 }}>      {/* ou larguraMinima={280} */}
  <Card>
    <CardMidia tipo="icone"><Search /></CardMidia>      {/* ou tipo="imagem" com <img> */}
    <CardHeader><CardTitle>…</CardTitle></CardHeader>
    <CardFooter><Button>…</Button></CardFooter>          {/* na base; no horizontal: divisor e botão no canto inferior direito */}
  </Card>
  <ItemDaGrade><Rotulo>…</Rotulo><Card>…</Card></ItemDaGrade>  {/* rótulo + card */}
</GradeDeCards>
// data-layout="grade" | "lista"; limiteDeDiferenca={{ px, proporcao, minimo }}; onLayoutChange; layout="grade" | "lista" fixa.
// Card, PartnerCard e ProductCard ficam horizontais sozinhos na lista (useOrientacaoDoCard); orientacao fixa a orientação.`}</code></pre>
        </div>
      </section>

      <section id="card-variants" className="scroll-mt-32">
        <SectionHeader
          title={t("With and without photo, with and without button", "Com e sem foto, com e sem botão")}
          description={t("Choose by content and behaviour, not decoration. A photo only when it adds context; a button only when there is an action.", "Escolha pelo conteúdo e pelo comportamento, não pela decoração. Foto só quando adiciona contexto; botão só quando há uma ação.")}
        />
        <GradeDeCards className="gap-4 md:grid-cols-2">
          <ItemDaGrade>
            <Rotulo>{t("No photo, no button", "Sem foto, sem botão")}</Rotulo>
            <SpecCard title={t("Information", "Informação")} description={t("For grouped information to read, with no action.", "Para informações agrupadas para leitura, sem ação.")}>
              <p className="text-body-sm leading-relaxed text-muted-foreground">{t("Keep the content focused and let the surrounding layout define its width.", "Mantenha o conteúdo focado e deixe o layout ao redor definir sua largura.")}</p>
            </SpecCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("No photo, with button", "Sem foto, com botão")}</Rotulo>
            <SpecCard title={t("Task", "Tarefa")} description={t("For one clear action related to the content.", "Para uma ação clara relacionada ao conteúdo.")} footer={<Button size="sm">{t("Continue", "Continuar")}<ChevronRight /></Button>}>
              <p className="text-body-sm leading-relaxed text-muted-foreground">{t("The button goes in the footer, aligned with the content.", "O botão fica no rodapé, alinhado ao conteúdo.")}</p>
            </SpecCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("With photo, no button (whole card clickable)", "Com foto, sem botão (card inteiro clicável)")}</Rotulo>
            <a href="#card-variants" onClick={e => e.preventDefault()} className="group flex flex-col rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Card className="flex-1 gap-0 overflow-hidden rounded-lg border-border transition-all group-hover:-translate-y-0.5 group-hover:border-[var(--border-strong)] group-hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                <img src={FOTO.src} alt="" className="h-32 w-full object-cover" />
                <CardHeader className="pb-6 pt-5">
                  <CardTitle className={`${display} flex items-center justify-between gap-2 text-body font-semibold`}>{t("Pilot Project Programme", "Programa Projeto Piloto")} <ArrowUpRight className="h-4 w-4 text-primary-text" aria-hidden /></CardTitle>
                  <CardDescription>{t("The whole surface is the link; there is no other control inside.", "A superfície inteira é o link; não há outro controle dentro.")}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("With photo and button", "Com foto e botão")}</Rotulo>
            <Card className="gap-0 overflow-hidden rounded-lg border-border">
              <img src={FOTO.src} alt={bi(FOTO.alt)} className="h-32 w-full object-cover" />
              <CardHeader className="pt-5">
                <CardTitle className={`${display} text-body font-semibold`}>{t("Media card", "Card com mídia")}</CardTitle>
                <CardDescription>{t("Use meaningful imagery that adds context.", "Use imagens relevantes que adicionem contexto.")}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-5"><Button variant="outline" size="sm">{t("Learn more", "Saiba mais")}</Button></CardFooter>
            </Card>
          </ItemDaGrade>
          <div className="md:col-span-2">
            <Rotulo>{t("Compact", "Compacto")}</Rotulo>
            <Card className="gap-3 border-border px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <CardTitle className={`${display} text-body-sm font-semibold`}>{t("Compact card", "Card compacto")}</CardTitle>
                  <CardDescription className="truncate text-label">{t("Dense lists and secondary information.", "Listas densas e informações secundárias.")}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">{t("Open", "Abrir")}</Button>
              </div>
            </Card>
          </div>
        </GradeDeCards>
      </section>

      <section id="card-actions" className="scroll-mt-32">
        <SectionHeader
          title={t("Buttons in cards", "Botões em cards")}
          description={t(
            "Button placement and emphasis reflect the card's task. Keep one primary action and reduce the emphasis of supporting actions.",
            "O posicionamento e a ênfase dos botões refletem a tarefa do card. Mantenha uma ação principal e reduza a ênfase das ações de apoio.",
          )}
        />
        <GradeDeCards className="md:grid-cols-2 gap-4">
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
            <p className="text-body-sm leading-relaxed text-muted-foreground">
              {t("Use this pattern when the card represents a form, configuration or focused task.", "Use este padrão quando o card representa um formulário, configuração ou tarefa focada.")}
            </p>
          </SpecCard>
          <SpecCard
            title={t("Contextual ghost action", "Ação ghost contextual")}
            description={t("Header actions should be compact and visually quiet.", "Ações no cabeçalho devem ser compactas e visualmente discretas.")}
            action={<Button variant="ghost" size="icon" aria-label={t("More options", "Mais opções")}><Sparkles /></Button>}
          >
            <div className="rounded-md bg-muted p-4">
              <p className="text-body-sm text-foreground">{t("Ghost works for menus, dismiss, edit or other tertiary actions.", "Ghost funciona para menus, dispensar, editar ou outras ações terciárias.")}</p>
            </div>
          </SpecCard>
          <SpecCard
            title={t("Navigation with a link button", "Navegação com botão link")}
            description={t("Use a link button when the action only navigates to related detail.", "Use um botão link quando a ação apenas navega para um detalhe relacionado.")}
            footer={<Button variant="link" size="sm" className="px-0">{t("View full report", "Ver relatório completo")}<ChevronRight /></Button>}
          >
            <p className="text-body-sm leading-relaxed text-muted-foreground">{t("For opening a report, a profile or a related page.", "Para abrir um relatório, um perfil ou uma página relacionada.")}</p>
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
              <p>{t("Irreversible actions open a confirmation dialog.", "Ações irreversíveis abrem um diálogo de confirmação.")}</p>
            </Callout>
          </SpecCard>
        </GradeDeCards>
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

      <section id="card-ia" className="scroll-mt-32">
        <SectionHeader
          title={t("Information architecture", "Arquitetura de informação")}
          description={t("The order of the content changes with what the card is for. These are the card patterns available in the system.", "A ordem do conteúdo muda com o que o card faz. Estes são os padrões de card disponíveis no sistema.")}
        />
        <div className="space-y-8">
          <div>
            <Rotulo>{t("Metric with chart (KPI): label → value → chart → trend", "Métrica com gráfico (KPI): rótulo → valor → gráfico → tendência")}</Rotulo>
            <CardsDeKpi />
          </div>
          <GradeDeCards className="gap-5 lg:grid-cols-2">
            <ItemDaGrade>
              <Rotulo>{t("Summary: title → description → indicators → action", "Resumo: título → descrição → indicadores → ação")}</Rotulo>
              <SpecCard
                title={t("Workspace activity", "Atividade do workspace")}
                description={t("Context first, then the numbers, then what to do.", "Primeiro o contexto, depois os números, depois o que fazer.")}
                footer={<Button size="sm">{t("View report", "Ver relatório")}<ChevronRight /></Button>}
              >
                <div className="grid grid-cols-3 gap-3">
                  {[[t("Views", "Visualizações"), "24.8K"], [t("Actions", "Ações"), "1,284"], [t("Rate", "Taxa"), "5.2%"]].map(([label, value]) => (
                    <div key={label} className="rounded-md bg-muted p-3">
                      <p className="mb-1 text-caption text-muted-foreground">{label}</p>
                      <p className={`${display} text-body font-semibold text-foreground`}>{value}</p>
                    </div>
                  ))}
                </div>
              </SpecCard>
            </ItemDaGrade>
            <ItemDaGrade>
              <Rotulo>{t("Invitation: tag → headline → benefit → action", "Convite: selo → título → benefício → ação")}</Rotulo>
              <PartnerCard size="p" {...exemploParceiro} />
            </ItemDaGrade>
          </GradeDeCards>
          <div>
            <Rotulo>{t("Choice (plan): name → who it is for → select", "Escolha (plano): nome → para quem → selecionar")}</Rotulo>
            <p className="mb-3 text-body-sm text-muted-foreground">{t("See the selectable plans in Interactive states, below.", "Veja os planos selecionáveis em Estados, logo abaixo.")}</p>
          </div>
        </div>
      </section>

      <section id="card-states" className="scroll-mt-32">
        <SectionHeader
          title={t("States", "Estados")}
          description={t("Only cards with a clear action look interactive. Selection stays visible without relying on colour alone; while content loads, the card keeps its shape.", "Só cards com uma ação clara parecem interativos. A seleção continua visível sem depender só de cor; enquanto o conteúdo carrega, o card mantém o formato.")}
        />
        <div className="space-y-6">
          <div>
            <Rotulo>{t("Selected", "Selecionado")}</Rotulo>
            <GradeDeCards className="sm:grid-cols-3 gap-3">
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
                      <CardTitle className={`${display} text-body font-semibold flex items-center gap-2`}>
                        {labels[index][0]}
                        {isSelected && <Check className="h-4 w-4 text-primary-text" aria-label={t("Selected", "Selecionado")} />}
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
            </GradeDeCards>
          </div>
          <GradeDeCards className="gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <ItemDaGrade>
              <Rotulo>{t("Loading", "Carregando")}</Rotulo>
              <Card className="gap-4 border-border p-6" aria-busy="true" aria-label={t("Loading card", "Carregando card")}>
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-3/5" />
                <Skeleton className="mt-2 h-9 w-28 rounded-md" />
              </Card>
            </ItemDaGrade>
            <ItemDaGrade>
              <Rotulo>{t("Treatment by state", "Tratamento por estado")}</Rotulo>
              <DataTable
                head={[t("State", "Estado"), t("Treatment", "Tratamento")]}
                rows={[
                  [t("Resting", "Parado"), t("Rule of the background (see How to choose).", "Regra do fundo (veja Como escolher).")],
                  [t("Hover (clickable card)", "Hover (card clicável)"), t("Stronger border and medium shadow; may rise 2 px.", "Borda mais forte e sombra média; pode subir 2 px.")],
                  [t("Hover of a row or item inside a card", "Hover de linha ou item dentro do card"), t("Very light, subtle grey background (--row-hover: half of --graphite-50 over the card, ≈ #F6F8FA), no shadow; the card itself does not change.", "Fundo cinza bem claro e sutil (--row-hover: metade do --graphite-50 sobre o card, ≈ #F6F8FA), sem sombra; o card em si não muda.")],
                  [t("Focus", "Foco"), t("Visible focus ring around the whole card.", "Anel de foco visível em volta do card inteiro.")],
                  [t("Selected", "Selecionado"), t("2 px primary border, check icon and aria-pressed.", "Borda primária de 2 px, ícone de check e aria-pressed.")],
                  [t("Loading", "Carregando"), t("Skeleton in the shape of the content and aria-busy.", "Skeleton no formato do conteúdo e aria-busy.")],
                ]}
              />
            </ItemDaGrade>
          </GradeDeCards>
        </div>
      </section>

      <section id="card-animacao" className="scroll-mt-32">
        <SectionHeader
          title={t("Animation and where to apply it", "Animação e onde aplicar")}
          description={t("Cards are static by default. Animation goes on the card that needs attention, never on every card in a grid.", "Cards são estáticos por padrão. A animação vai no card que precisa de atenção, nunca em todos os cards de um grid.")}
        />
        <div className="space-y-8">
          <DataTable
            head={[t("Animation", "Animação"), t("Where to apply", "Onde aplicar"), t("How many", "Quantos")]}
            rows={[
              [t("Lift on hover", "Elevação no hover"), t("Whole clickable cards (lists of stores, articles, projects).", "Cards inteiros clicáveis (listas de lojas, artigos, projetos).")],
              [t("Wobble (3D tilt)", "Wobble (inclinação 3D)"), t("Recommended plan, premium feature or testimonial, on desktop.", "Plano recomendado, recurso premium ou depoimento, no desktop.")],
              [t("Shine Border", "Shine Border"), t("Recommended or premium card in a decision group.", "Card recomendado ou premium num grupo de decisão.")],
              [t("Canvas Reveal", "Canvas Reveal"), t("Feature or differentiator cards in exploration sections.", "Cards de funcionalidade ou diferencial em seções de exploração.")],
            ].map(([a, b], i) => [a, b, i === 0 ? t("All clickable cards", "Todos os cards clicáveis") : t("One per group", "Um por grupo")])}
          />
          <div>
            <Rotulo>{t("Lift on hover", "Elevação no hover")}</Rotulo>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[t("Store", "Loja"), t("Article", "Artigo"), t("Project", "Projeto")].map(x => (
                <a key={x} href="#card-animacao" onClick={e => e.preventDefault()} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Card className="gap-2 border-border p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[var(--border-strong)] group-hover:shadow-[var(--shadow-md)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
                    <p className="flex items-center justify-between text-body-sm font-semibold text-foreground">{x} <ArrowUpRight className="h-4 w-4 text-primary-text" aria-hidden /></p>
                    <p className="text-body-sm text-muted-foreground">{t("Hover: rises 2 px, stronger border, medium shadow.", "Hover: sobe 2 px, borda mais forte, sombra média.")}</p>
                  </Card>
                </a>
              ))}
            </div>
          </div>
          <div>
            <Rotulo>{t("Wobble (3D tilt with spotlight)", "Wobble (inclinação 3D com spotlight)")}</Rotulo>
            <WobbleCardConteudo />
          </div>
          <div>
            <Rotulo>{t("Canvas Reveal", "Canvas Reveal")}</Rotulo>
            <CanvasRevealCard />
          </div>
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
        <div className="space-y-8">
          <GradeDeCards className="gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Card className="relative gap-5 overflow-hidden border-border">
              <ShineBorder borderWidth={1} duration={7} shineColor={["var(--primary)", "var(--chart-2)", "var(--primary)"]} />
              <CardHeader>
                <span className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-caption font-semibold text-primary-text">{t("Recommended", "Recomendado")}</span>
                <CardTitle className={`${display} text-body-lg font-semibold`}>{t("Studio plan", "Plano Studio")}</CardTitle>
                <CardDescription>{t("Use Shine Border to call attention to one exceptional option.", "Use Shine Border para chamar atenção para uma única opção excepcional.")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-1">
                  <span className={`${display} text-h2 font-semibold text-foreground`}>$49</span>
                  <span className="text-label text-muted-foreground">/{t("month", "mês")}</span>
                </div>
              </CardContent>
              <CardFooter><Button className="w-full">{t("Choose Studio", "Escolher Studio")}</Button></CardFooter>
            </Card>
            <div className="space-y-4">
              <Callout title={t("Opt-in, not a Card default", "Opcional, não padrão do Card")}>
                <p>{t("Shine Border is composed inside a relative, overflow-hidden card. It is not built into the base Card because most surfaces should remain quiet and static.", "Shine Border é composto dentro de um card relativo com overflow-hidden. Ele não faz parte do Card base porque a maioria das superfícies deve permanecer discreta e estática.")}</p>
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
          </GradeDeCards>
          <ShineBorderConteudo />
        </div>
      </section>

      <section id="card-nested" className="scroll-mt-32">
        <SectionHeader
          title={t("Nested cards", "Cards aninhados")}
          description={t("When a card contains another card, only the outer card defines elevation; the inner card uses a border or a tonal background.", "Quando um card contém outro, só o card externo define a elevação; o card interno usa borda ou fundo tonal.")}
        />
        <GradeDeCards className="gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Card className="gap-5 border-border p-6 shadow-none">
            <div>
              <CardTitle className={`${display} text-body font-semibold`}>{t("Project overview", "Visão geral do projeto")}</CardTitle>
              <CardDescription className="mt-1">{t("The parent card owns the visual elevation.", "O card pai é responsável pela elevação visual.")}</CardDescription>
            </div>
            <Card className="gap-4 border-border bg-muted/40 p-4 shadow-none">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className={`${display} text-body-sm font-semibold`}>{t("Delivery status", "Status da entrega")}</CardTitle>
                  <CardDescription className="mt-1 text-label">{t("This inner card uses a border and no shadow.", "Este card interno usa borda e nenhuma sombra.")}</CardDescription>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-caption font-semibold text-success">{t("On track", "Em dia")}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-3/4 rounded-full bg-primary" /></div>
            </Card>
            <p className="text-label text-muted-foreground"><Mono>border</Mono> {t("on the parent", "no card pai")} · <Mono>border bg-muted/40</Mono> {t("on the child", "no card filho")}</p>
          </Card>
          <DataTable
            head={[t("Layer", "Camada"), t("Surface treatment", "Tratamento da superfície")]}
            rows={[
              [t("Parent card", "Card pai"), t("Border only on the page background; shadow only on a dark background.", "Só borda sobre o fundo da página; sombra só sobre fundo escuro.")],
              [t("Inner card", "Card interno"), t("Border or tonal background with shadow-none.", "Borda ou fundo tonal com shadow-none.")],
              [t("Inner interactive card", "Card interno interativo"), t("Border and focus ring communicate the state.", "Borda e anel de foco comunicam o estado.")],
            ]}
          />
        </GradeDeCards>
      </section>

      <section id="card-partner" className="scroll-mt-32">
        <SectionHeader title={t("Ready-made component: partner invitation card", "Componente pronto: card de convite ao parceiro")} description={t("Invitation to join the studio's Partner Network: hero tag, headline with highlight, one-sentence benefit, primary action and a secondary link. Vertical for columns and page ends; horizontal for bands between sections.", "Convite para a Rede de Parceiros do estúdio: selo, título com destaque, benefício em uma frase, ação principal e link secundário. Vertical para colunas e fim de página; horizontal para faixas entre seções.")} />
        <div className="space-y-8">
          <div>
            <SubTitle>{t("Vertical — sizes S, M and L", "Vertical — tamanhos P, M e G")}</SubTitle>
            <GradeDeCards className="gap-5 md:grid-cols-[2fr_3fr]">
              <PartnerCard size="p" {...exemploParceiro} />
              <PartnerCard size="m" {...exemploParceiro} />
            </GradeDeCards>
            <div className="mt-5 max-w-[600px]"><PartnerCard size="g" {...exemploParceiro} /></div>
          </div>
          <div>
            <SubTitle>{t("Horizontal — sizes S, M and L", "Horizontal — tamanhos P, M e G")}</SubTitle>
            <div className="space-y-5">
              <PartnerCard orientation="horizontal" size="p" {...exemploParceiro} />
              <PartnerCard orientation="horizontal" size="m" surface="tint" {...exemploParceiro} />
              <PartnerCard orientation="horizontal" size="g" surface="dark" {...exemploParceiro} />
            </div>
          </div>
          <GradeDeCards className="gap-4 md:grid-cols-3">
            {[
              [t("Sizes", "Tamanhos"), t("S: sidebars and lists (title 18 px). M: content columns (24–28 px). L: page ends and landing bands (32–40 px).", "P: barras laterais e listas (título 18 px). M: colunas de conteúdo (24–28 px). G: fim de página e faixas de landing (32–40 px).")],
              [t("Surfaces", "Superfícies"), t("card (default), tint (support surface) and dark (graphite, for contrast bands). The primary glow in the corner echoes the hero background.", "card (padrão), tint (superfície de apoio) e dark (grafite, para faixas de contraste). O brilho primário no canto ecoa o fundo do hero.")],
              [t("Content", "Conteúdo"), t("One headline with one highlight, one benefit sentence, one primary action (verb first) and at most one secondary link.", "Um título com um destaque, uma frase de benefício, uma ação principal (verbo primeiro) e no máximo um link secundário.")],
            ].map(([a, b]) => (
              <div key={a} className="rounded-lg border border-border bg-card p-4"><p className="mb-1 text-body-sm font-semibold text-foreground">{a}</p><p className="text-body-sm leading-relaxed text-muted-foreground">{b}</p></div>
            ))}
          </GradeDeCards>
          <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { PartnerCard } from "@/app/components/ui/partner-card";
<PartnerCard orientation="horizontal" size="m" eyebrow="…" title="… **destaque** …" description="…" cta={{ label: "…", href: "/…" }} />`}</code></pre>
        </div>
      </section>

      {/* ═══ PARTE 2: CARD DE VIDRO ═══ */}
      <Parte id="card-vidro" numero={t("Part 2", "Parte 2")} titulo={t("Glass card", "Card de vidro")} texto={t("Translucent surface that blurs what is behind it, for photos, colour or gradients. Only combinations that pass the contrast check (WCAG AA) appear here; to test others, use Test the glass.", "Superfície translúcida que desfoca o que está atrás, para foto, cor ou gradiente. Aqui só aparecem combinações que passam na conferência de contraste (WCAG AA); para testar outras, use Testar o vidro.")} />

      <section id="card-glass" className="scroll-mt-32">
        <SectionHeader
          title={t("Finishes: transparency and blur", "Acabamentos: transparência e desfoque")}
          description={t("Each finish with the tone and opacity that pass the contrast check on the system texture, in the current theme. The props are shown in each card.", "Cada acabamento com o tom e a opacidade que passam na conferência de contraste sobre a textura do sistema, no tema atual. As props aparecem em cada card.")}
        />
        <div className="space-y-5">
          <CenaDeTesteCtx.Provider value={cenaPadrao}>
            <CenaDoVidro className="p-4 sm:p-5">
              <GradeDeCards className="gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {aprovados.filter(a => a.cfg).map(a => (
                  <ItemDaGrade key={a.value} data-acabamento-aprovado={a.value} data-props={propsDoVidro(a.cfg!)}>
                    <GlassTestCard {...a.cfg!} title={a.label} subtitle={a.desc} />
                  </ItemDaGrade>
                ))}
              </GradeDeCards>
            </CenaDoVidro>
          </CenaDeTesteCtx.Provider>
          {semAprovacao.length > 0 && (
            <p className="text-body-sm text-muted-foreground">{t("No approved combination on this background in the current theme: ", "Sem combinação aprovada sobre este fundo no tema atual: ")}{semAprovacao.join(", ")}. {t("Test them in Test the glass.", "Teste em Testar o vidro.")}</p>
          )}
          <DataTable
            head={[t("Rule", "Regra"), t("Guidance", "Orientação")]}
            rows={[
              [t("Background", "Fundo"), t("Only over colour, image or texture. Check the contrast against the busiest area of the real background.", "Só sobre cor, imagem ou textura. Confira o contraste contra a área mais movimentada do fundo real.")],
              [t("Quantity", "Quantidade"), t("One to three per view. Glass loses meaning when everything is glass.", "De um a três por tela. O vidro perde sentido quando tudo é vidro.")],
              [t("Contrast", "Contraste"), t("Light glass at 55% or more for body text; dark glass at 50% or more.", "Vidro claro com 55% ou mais para texto corrido; vidro escuro com 50% ou mais.")],
              [t("Content", "Conteúdo"), t("Short content: a number, a title, one sentence, one action. Long reading goes on a solid card.", "Conteúdo curto: um número, um título, uma frase, uma ação. Leitura longa vai em card sólido.")],
              [t("Shape", "Forma"), t("Radius 16 px, light glass edge and the glass shadow; same anatomy and spacing as the solid card.", "Raio de 16 px, borda clara do vidro e a sombra do vidro; mesma anatomia e espaçamentos do card sólido.")],
              [t("Reduced transparency", "Transparência reduzida"), t("With prefers-reduced-transparency the card becomes solid (card or graphite).", "Com prefers-reduced-transparency o card vira sólido (card ou grafite).")],
            ]}
          />
          <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { GlassCard } from "@/app/components/ui/glass-card";

<GlassCard finish="padrao" intensity="forte">…</GlassCard>   {/* Vidro */}
<GlassCard finish="fosco" tone="clara" interactive>…</GlassCard>`}</code></pre>
        </div>
      </section>

      <section id="card-glass-fundos" className="scroll-mt-32">
        <SectionHeader
          title={t("Glass by background", "Vidro por fundo")}
          description={t("Light background, dark background and photo, each with an approved glass. Over a photo the check considers any area of the image, from black to white.", "Fundo claro, fundo escuro e foto, cada um com um vidro aprovado. Sobre foto, a conferência considera qualquer área da imagem, do preto ao branco.")}
        />
        <GradeDeCards className="gap-4 lg:grid-cols-3">
          {([
            [t("Light background", "Fundo claro"), cenaPadrao, vidroPorFundo.padrao],
            [t("Dark background", "Fundo escuro"), cenaEscura, vidroPorFundo.escura],
            [t("Photo", "Foto"), cenaFoto, vidroPorFundo.foto],
          ] as [string, CenaDeTeste, ConfigVidro | null][]).map(([nome, cena, cfg]) => (
            <ItemDaGrade key={nome}>
              <Rotulo>{nome}</Rotulo>
              <CenaDeTesteCtx.Provider value={cena}>
                <CenaDoVidro className="p-4 sm:p-5">
                  {cfg
                    ? <GlassTestCard compact {...cfg} title={nome} subtitle={propsDoVidro(cfg)} />
                    : <p className="rounded-md bg-card p-4 text-body-sm text-foreground">{t("No approved glass on this background in the current theme: use a solid card.", "Sem vidro aprovado neste fundo no tema atual: use card sólido.")}</p>}
                </CenaDoVidro>
              </CenaDeTesteCtx.Provider>
            </ItemDaGrade>
          ))}
        </GradeDeCards>
      </section>

      <section id="card-glass-conteudo" className="scroll-mt-32">
        <SectionHeader
          title={t("Glass with content", "Vidro com conteúdo")}
          description={t("Number in focus, whole clickable card with lift on hover, and call to action with a button, all with an approved glass. Same anatomy, border and radius rules as the solid card.", "Número em destaque, card inteiro clicável com elevação no hover e chamada com botão, todos com um vidro aprovado. Mesmas regras de anatomia, borda e raio do card sólido.")}
        />
        {vidroConteudo ? (
          <>
          <Rotulo><span className="font-mono normal-case tracking-normal">{propsDoVidro(vidroConteudo)}</span></Rotulo>
          <CenaDeTesteCtx.Provider value={cenaPadrao}>
            <CenaDoVidro>
              <GradeDeCards className="gap-5 md:grid-cols-3">
                <GlassCard {...vidroConteudo}>
                  <p className={`text-caption font-semibold uppercase tracking-[0.08em] ${corSub(vidroConteudo)}`}>{t("Challenges in progress", "Desafios em andamento")}</p>
                  <p className={`${display} mt-2 text-display-m font-bold leading-none tracking-[-0.03em]`}>12</p>
                  <p className={`mt-2 text-body-sm ${corSub(vidroConteudo)}`}>{t("3 with evidence collected this week", "3 com evidências coletadas nesta semana")}</p>
                </GlassCard>
                <GlassCard {...vidroConteudo} interactive tabIndex={0} role="link">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className={`inline-flex items-center gap-1 text-caption font-semibold uppercase tracking-[0.08em] ${corSub(vidroConteudo)}`}><MapPin className="h-3 w-3" aria-hidden /> {t("Organization · Health", "Organização · Saúde")}</p>
                      <p className={`${display} mt-2 text-body-lg font-semibold tracking-[-0.01em]`}>Clínica Horizonte</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-primary-text" aria-hidden />
                  </div>
                  <p className={`mt-2 text-body-sm leading-relaxed ${corSub(vidroConteudo)}`}>{t("Reception journey: 4 hypotheses, 2 tests planned.", "Jornada da recepção: 4 hipóteses, 2 testes planejados.")}</p>
                  <div className="mt-4"><AvatarCircles size="sm" numPeople={12} avatarUrls={[1, 2, 3].map(i => ({ imageUrl: `${import.meta.env.BASE_URL}avatares/avatar-${i}.svg`, profileUrl: "#card-glass-conteudo", name: `Pessoa ${i}` }))} /></div>
                </GlassCard>
                <GlassCard {...vidroConteudo}>
                  <p className="text-caption font-semibold uppercase tracking-[0.08em] text-[var(--primary-text,var(--primary))]">{t("What do you want to improve?", "O que você deseja melhorar?")}</p>
                  <p className={`${display} mt-2 text-body-lg font-semibold tracking-[-0.01em]`}>{t("Start a challenge", "Comece um desafio")}</p>
                  <p className={`mt-2 text-body-sm leading-relaxed ${corSub(vidroConteudo)}`}>{t("Describe the human problem in your own words; the system guides the rest.", "Descreva o problema humano com suas palavras; o sistema conduz o resto.")}</p>
                  <Button className="mt-4 w-full rounded-full">{t("Start", "Começar")}</Button>
                </GlassCard>
              </GradeDeCards>
            </CenaDoVidro>
          </CenaDeTesteCtx.Provider>
          </>
        ) : (
          <p className="text-body-sm text-muted-foreground">{t("No approved glass for content in the current theme.", "Sem vidro aprovado para conteúdo no tema atual.")}</p>
        )}
      </section>

      {/* ═══ PARTE 3: TESTAR O VIDRO ═══ */}
      <Parte id="card-testar" numero={t("Part 3", "Parte 3")} titulo={t("Test the glass", "Testar o vidro")} texto={t("A workbench, not a recommendation: combine finish, tone, opacity, blur and background, and read the contrast check of each card. Combinations that fail show an alert.", "Uma bancada de teste, não uma recomendação: combine acabamento, tom, opacidade, desfoque e fundo, e leia a conferência de contraste de cada card. Combinações que falham mostram um alerta.")} />
      <section id="card-glass-teste" className="scroll-mt-32">
        <GlassFinishPicker />
      </section>

      {/* ═══ PARTE 4: O QUE EVITAR ═══ */}
      <Parte id="card-evitar" numero={t("Part 4", "Parte 4")} titulo={t("What to avoid", "O que evitar")} texto={t("Practices that are not recommended, gathered in one place.", "Práticas que não são recomendadas, reunidas num só lugar.")} />
      <section id="card-guidelines" className="scroll-mt-32 space-y-6">
        <div>
          <SubTitle>{t("Solid card", "Card sólido")}</SubTitle>
          <DoDont
            dos={[
              t("Group content that shares one subject or task.", "Agrupe conteúdos que compartilham um assunto ou tarefa."),
              t("Keep card structures consistent within the same grid.", "Mantenha estruturas consistentes no mesmo grid."),
              t("Put cards side by side in a GradeDeCards: same height, actions at the bottom and, with very different content, one per row (rule of 27/11/2026).", "Coloque cards lado a lado numa GradeDeCards: mesma altura, ações na base e, com conteúdo muito diferente, um por linha (regra de 27/11/2026)."),
              t("Choose border and shadow by the background (see How to choose).", "Escolha borda e sombra pelo fundo (veja Como escolher)."),
              t("Use one primary action and move secondary actions to the footer or menu.", "Use uma ação principal e mova ações secundárias para o rodapé ou menu."),
            ]}
            donts={[
              t("Put a resting shadow on a card that sits on the page background, white or light grey.", "Não coloque sombra em card parado sobre o fundo da página, branco ou cinza claro."),
              t("Give an inner card its own elevation or hover shadow: it creates a false layer.", "Não dê ao card interno elevação própria nem sombra no hover: isso cria uma camada falsa."),
              t("Make the whole surface clickable when it contains other interactive controls.", "Não torne toda a superfície clicável quando houver outros controles interativos."),
              t("Use the link style for save, submit, delete or other state-changing actions.", "Não use o estilo link para salvar, enviar, excluir ou outras ações que alteram estado."),
              t("Use elevation only as decoration or mix multiple shadow levels in one grid.", "Não use elevação apenas como decoração nem misture vários níveis de sombra no mesmo grid."),
              t("Add horizontal scrolling inside a card.", "Não coloque rolagem horizontal dentro do card."),
              t("Leave cards side by side with different heights, or stretched with a large empty area.", "Não deixe cards lado a lado com alturas diferentes, nem esticados com uma área vazia grande."),
            ]}
          />
        </div>
        <div>
          <SubTitle>{t("Glass card", "Card de vidro")}</SubTitle>
          <DoDont
            dos={[
              t("Use for a hero summary, a highlighted item or a floating action card.", "Use para um resumo no hero, um item em destaque ou um card de ação flutuante."),
              t("Keep the 16 px radius and the spacing; glass changes the surface, not the anatomy.", "Mantenha o raio de 16 px e os espaçamentos; o vidro muda a superfície, não a anatomia."),
              t("Pair dark glass with photos and light glass with the brand gradient.", "Combine vidro escuro com fotos e vidro claro com o gradiente da marca."),
            ]}
            donts={[
              t("Use glass on a flat background or inside another glass card.", "Não use vidro sobre fundo liso nem dentro de outro card de vidro."),
              t("Place forms, tables or long text on glass.", "Não coloque formulários, tabelas ou textos longos sobre vidro."),
              t("Lower the opacity to make it “more glassy” at the cost of contrast.", "Não baixe a opacidade para ficar “mais vidro” à custa do contraste."),
              t("Use backdrop-filter in long lists or inside scroll areas on mobile: it is costly.", "Não use backdrop-filter em listas longas nem dentro de áreas de rolagem no celular: custa caro."),
            ]}
          />
        </div>
        <div>
          <SubTitle>{t("Animation", "Animação")}</SubTitle>
          <GradeDeCards className="gap-3 md:grid-cols-3">
            {[
              [t("Wobble", "Wobble"), evitarWobble(t)],
              [t("Canvas Reveal", "Canvas Reveal"), evitarCanvasReveal(t)],
              [t("Shine Border", "Shine Border"), [t("More than one per decision group.", "Mais de um por grupo de decisão."), t("As the only indicator of selection.", "Como único indicador de seleção.")]],
            ].map(([nome, itens]) => (
              <Panel key={nome as string} className="p-5">
                <p className="mb-3 flex items-center gap-2 text-label font-semibold uppercase tracking-[0.08em] text-foreground"><X className="h-3.5 w-3.5 text-primary-text" aria-hidden /> {nome as string}</p>
                <ul className="space-y-2">
                  {(itens as string[]).map(i => (
                    <li key={i} className="flex gap-2 text-body-sm leading-relaxed text-muted-foreground"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />{i}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </GradeDeCards>
        </div>
      </section>

      {/* ═══ ACESSIBILIDADE E TOKENS ═══ */}
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
        <TokenTable groups={[...cardTokens, glassTokens]} />
      </section>
    </div>
  );
}
