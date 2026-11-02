import * as React from "react";
import { cn } from "./utils";
import { DoodleTexture } from "./doodle-texture";
import { over, contrastRatio, resolveCssColor, AA, type RGB } from "./contrast";

/**
 * GlassCard (card glassmorphism)
 *
 * Superfície translúcida com desfoque do fundo, borda clara e um fio de luz no topo.
 * Só funciona sobre um fundo com cor, gradiente ou imagem; sobre fundo liso vira um card comum.
 * Use para poucos elementos em destaque (hero, resumo, chamada); não para listas longas
 * nem para leitura extensa. Com prefers-reduced-transparency o card vira sólido.
 */
export type GlassFinish = "padrao" | "translucido" | "fosco" | "luz" | "cristal";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Acabamento do vidro (grau de transparência):
   * padrao — vidro equilibrado; translucido — bem transparente, quase sem desfoque, o fundo aparece inteiro;
   * fosco — vidro jateado, muito desfoque e mais opaco, sem reflexo; luz — vidro com um foco de luz no canto;
   * cristal — vidro nítido com borda brilhante e um reflexo diagonal.
   */
  finish?: GlassFinish;
  /** Quantidade de opacidade dentro do acabamento (e de desfoque no acabamento padrão). */
  intensity?: "leve" | "media" | "forte";
  /** Opacidade do fundo do vidro em %, de 0 (totalmente transparente) a 100 (sólido). Sobrepõe o acabamento. */
  opacity?: number;
  /** Desfoque do fundo em px, de 0 a 80. Sobrepõe o acabamento. */
  blur?: number;
  /** clara: vidro branco (texto escuro). escura: vidro grafite (texto branco). */
  tone?: "clara" | "escura";
  /** Leve tingimento na cor primária. */
  tint?: boolean;
  /** Eleva ao passar o mouse (para cards clicáveis). */
  interactive?: boolean;
};

const blur = { leve: "backdrop-blur-md", media: "backdrop-blur-xl", forte: "backdrop-blur-2xl" } as const;
const claraBg = { leve: "bg-white/40 dark:bg-white/8", media: "bg-white/55 dark:bg-white/12", forte: "bg-white/70 dark:bg-white/16" } as const;
const escuraBg = { leve: "bg-[var(--graphite-950)]/55 dark:bg-[var(--graphite-950)]/35", media: "bg-[var(--graphite-950)]/70 dark:bg-[var(--graphite-950)]/50", forte: "bg-[var(--graphite-950)]/85 dark:bg-[var(--graphite-950)]/65" } as const;

/** Desfoque e opacidade por acabamento (claro; escuro; dark theme do claro). */
const finishes: Record<Exclude<GlassFinish, "padrao">, { blur: string; clara: Record<"leve" | "media" | "forte", string>; escura: Record<"leve" | "media" | "forte", string>; extra?: string; border?: string }> = {
  translucido: {
    blur: "backdrop-blur-[2px]",
    clara: { leve: "bg-white/10 dark:bg-white/4", media: "bg-white/18 dark:bg-white/6", forte: "bg-white/28 dark:bg-white/9" },
    escura: { leve: "bg-[var(--graphite-950)]/32 dark:bg-[var(--graphite-950)]/12", media: "bg-[var(--graphite-950)]/42 dark:bg-[var(--graphite-950)]/22", forte: "bg-[var(--graphite-950)]/52 dark:bg-[var(--graphite-950)]/32" },
    border: "border-white/40 dark:border-white/12",
  },
  fosco: {
    blur: "backdrop-blur-3xl backdrop-saturate-125",
    clara: { leve: "bg-white/60 dark:bg-white/14", media: "bg-white/72 dark:bg-white/18", forte: "bg-white/84 dark:bg-white/22" },
    escura: { leve: "bg-[var(--graphite-950)]/80 dark:bg-[var(--graphite-950)]/60", media: "bg-[var(--graphite-950)]/90 dark:bg-[var(--graphite-950)]/72", forte: "bg-[var(--graphite-950)]/90 dark:bg-[var(--graphite-950)]/84" },
    border: "border-white/50 dark:border-white/10 before:hidden",
  },
  luz: {
    blur: "backdrop-blur-xl",
    clara: { leve: "bg-white/35 dark:bg-white/8", media: "bg-white/48 dark:bg-white/12", forte: "bg-white/62 dark:bg-white/16" },
    escura: { leve: "bg-[var(--graphite-950)]/50 dark:bg-[var(--graphite-950)]/30", media: "bg-[var(--graphite-950)]/65 dark:bg-[var(--graphite-950)]/45", forte: "bg-[var(--graphite-950)]/80 dark:bg-[var(--graphite-950)]/60" },
    // foco de luz no canto superior esquerdo + brilho interno
    extra: "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[radial-gradient(120%_80%_at_12%_0%,rgba(255,255,255,0.55),rgba(255,255,255,0.12)_38%,transparent_62%)] dark:after:bg-[radial-gradient(120%_80%_at_12%_0%,rgba(255,255,255,0.28),rgba(255,255,255,0.06)_38%,transparent_62%)] data-[tone=escura]:after:bg-[radial-gradient(120%_80%_at_12%_0%,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_38%,transparent_62%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_32px_rgba(6,6,8,0.10)]",
  },
  cristal: {
    blur: "backdrop-blur-md backdrop-brightness-105",
    clara: { leve: "bg-white/22 dark:bg-white/6", media: "bg-white/32 dark:bg-white/9", forte: "bg-white/44 dark:bg-white/12" },
    escura: { leve: "bg-[var(--graphite-950)]/42 dark:bg-[var(--graphite-950)]/22", media: "bg-[var(--graphite-950)]/54 dark:bg-[var(--graphite-950)]/34", forte: "bg-[var(--graphite-950)]/66 dark:bg-[var(--graphite-950)]/46" },
    border: "border-white/90 dark:border-white/30",
    // reflexo diagonal
    extra: "after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.45)_45%,rgba(255,255,255,0.08)_52%,transparent_60%)] dark:after:bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.03)_52%,transparent_60%)] data-[tone=escura]:after:bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.14)_45%,rgba(255,255,255,0.03)_52%,transparent_60%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_8px_32px_rgba(6,6,8,0.10)]",
  },
};

export function GlassCard({ finish = "padrao", intensity = "media", tone = "clara", tint = false, interactive = false, opacity, blur: blurPx, className, style, children, ...props }: GlassCardProps) {
  const escura = tone === "escura";
  const f = finish === "padrao" ? null : finishes[finish];
  // controle livre: opacidade e desfoque numéricos vencem as classes do acabamento
  const clamp = (v: number, max: number) => Math.min(max, Math.max(0, v));
  const livre: React.CSSProperties = {};
  if (opacity !== undefined) {
    const pct = clamp(opacity, 100);
    livre.backgroundColor = escura ? `color-mix(in srgb, var(--graphite-950) ${pct}%, transparent)` : `color-mix(in srgb, #fff ${pct}%, transparent)`;
  }
  if (blurPx !== undefined) {
    const px = clamp(blurPx, 80);
    livre.backdropFilter = `blur(${px}px) saturate(150%)`;
    (livre as Record<string, string>).WebkitBackdropFilter = `blur(${px}px) saturate(150%)`;
  }
  return (
    <div
      data-slot="glass-card"
      data-tone={tone}
      data-finish={finish}
      style={{ ...livre, ...style }}
      className={cn(
        "relative isolate overflow-hidden rounded-[20px] border p-6 backdrop-saturate-150",
        f ? f.blur : blur[intensity],
        escura
          ? cn(f ? f.escura[intensity] : escuraBg[intensity], "border-white/15 text-white shadow-[0_8px_32px_rgba(6,6,8,0.25)]")
          : cn(f ? f.clara[intensity] : claraBg[intensity], "border-white/60 text-foreground shadow-[0_8px_32px_rgba(6,6,8,0.08)] dark:border-white/15 dark:text-white"),
        f?.border,
        f?.extra,
        // fio de luz no topo, como o reflexo de um vidro
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/80 before:to-transparent dark:before:via-white/40",
        interactive && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(6,6,8,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // sem transparência: card sólido
        "[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none",
        escura
          ? "[@media(prefers-reduced-transparency:reduce)]:bg-[var(--graphite-950)]"
          : "[@media(prefers-reduced-transparency:reduce)]:bg-card",
        className,
      )}
      {...props}
    >
      {/* tingimento na primária como camada, sem substituir o fundo do vidro */}
      {tint && <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", escura ? "bg-primary/20" : "bg-primary/10 dark:bg-primary/15")} />}
      {children}
    </div>
  );
}

/** Cenário de demonstração: fundo da página com a textura doodle do sistema em ícones pequenos. Segue o tema.
 *  Cores da textura expostas para o cálculo de contraste: grafite-300 no claro, grafite-700 no escuro. */
export const glassSceneTexture = { light: "var(--graphite-300)", dark: "var(--graphite-700)", coverage: 0.08 } as const;

export function GlassScene({ dark, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { /** Força a cena escura; sem a prop, segue o tema. */ dark?: boolean }) {
  return (
    <div
      className={cn("relative isolate overflow-hidden rounded-[24px] border border-border bg-background p-6 sm:p-8", dark && "dark bg-[var(--graphite-950)]", className)}
      {...props}
    >
      <DoodleTexture scale="xs" color={glassSceneTexture.light} className="-z-10 dark:[background-color:var(--graphite-700)]" />
      {children}
    </div>
  );
}

/* ── Avaliação de contraste do texto sobre o vidro ─────────────────────────────── */

/** Opacidade (%) do fundo do vidro por acabamento, tom, intensidade e tema. Espelha as classes acima. */
export const glassOpacityTable: Record<GlassFinish, { clara: [number, number, number]; claraDark: [number, number, number]; escura: [number, number, number]; escuraDark: [number, number, number] }> = {
  padrao:      { clara: [40, 55, 70], claraDark: [8, 12, 16],  escura: [55, 70, 85], escuraDark: [35, 50, 65] },
  translucido: { clara: [10, 18, 28], claraDark: [4, 6, 9],    escura: [32, 42, 52], escuraDark: [12, 22, 32] },
  fosco:       { clara: [60, 72, 84], claraDark: [14, 18, 22], escura: [80, 90, 90], escuraDark: [60, 72, 84] },
  luz:         { clara: [35, 48, 62], claraDark: [8, 12, 16],  escura: [50, 65, 80], escuraDark: [30, 45, 60] },
  cristal:     { clara: [22, 32, 44], claraDark: [6, 9, 12],   escura: [42, 54, 66], escuraDark: [22, 34, 46] },
};

export type GlassContrastInput = {
  finish?: GlassFinish;
  tone?: "clara" | "escura";
  intensity?: "leve" | "media" | "forte";
  opacity?: number;
  tint?: boolean;
  /** Tema escuro ativo. */
  darkTheme: boolean;
  /** Cor de fundo da cena (resolvida) e cor da textura com sua cobertura aproximada (0–1). */
  sceneBg: RGB;
  texture?: { color: RGB; coverage: number };
  /** Cores do texto já resolvidas. */
  title: RGB;
  subtitle: RGB;
};

export type GlassContrastResult = {
  /** Cor efetiva atrás do texto (fundo + textura + vidro + tingimento). */
  surface: RGB;
  title: number;
  subtitle: number;
  /** Título grande (3:1) e subtítulo normal (4,5:1). */
  titleOk: boolean;
  subtitleOk: boolean;
};

/**
 * Estima o contraste do título e do subtítulo sobre o vidro, compondo as camadas:
 * fundo da cena → textura (cobertura média) → vidro (branco ou grafite-950 na opacidade) → tingimento.
 * O desfoque não muda a luminância média, então não entra na conta.
 */
export function glassTextContrast(i: GlassContrastInput): GlassContrastResult {
  const finish = i.finish ?? "padrao", tone = i.tone ?? "clara", intensity = i.intensity ?? "media";
  const idx = intensity === "leve" ? 0 : intensity === "media" ? 1 : 2;
  const t = glassOpacityTable[finish];
  const pct = i.opacity ?? (tone === "escura" ? (i.darkTheme ? t.escuraDark : t.escura) : (i.darkTheme ? t.claraDark : t.clara))[idx];
  let surface = i.sceneBg;
  if (i.texture) surface = over(i.texture.color, surface, i.texture.coverage);
  const glass: RGB = tone === "escura" ? resolveCssColor("var(--graphite-950)") ?? { r: 0, g: 0, b: 0, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
  surface = over(glass, surface, Math.min(100, Math.max(0, pct)) / 100);
  if (i.tint) {
    const primary = resolveCssColor("var(--primary)");
    if (primary) surface = over(primary, surface, tone === "escura" ? 0.2 : i.darkTheme ? 0.15 : 0.1);
  }
  // arredonda a uma casa, como é exibido, para o veredito bater com o número mostrado
  const r1 = (v: number) => Math.round(v * 10) / 10;
  const title = r1(contrastRatio(i.title, surface)), subtitle = r1(contrastRatio(i.subtitle, surface));
  return { surface, title, subtitle, titleOk: title >= AA.large, subtitleOk: subtitle >= AA.normal };
}
