import * as React from "react";
import { cn } from "./utils";

/**
 * GlassCard (card glassmorphism)
 *
 * Superfície translúcida com desfoque do fundo, borda clara e um fio de luz no topo.
 * Só funciona sobre um fundo com cor, gradiente ou imagem; sobre fundo liso vira um card comum.
 * Use para poucos elementos em destaque (hero, resumo, chamada); não para listas longas
 * nem para leitura extensa. Com prefers-reduced-transparency o card vira sólido.
 */
export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Quantidade de desfoque e opacidade do fundo. */
  intensity?: "leve" | "media" | "forte";
  /** clara: vidro branco (texto escuro). escura: vidro grafite (texto branco). */
  tone?: "clara" | "escura";
  /** Leve tingimento na cor primária. */
  tint?: boolean;
  /** Eleva ao passar o mouse (para cards clicáveis). */
  interactive?: boolean;
};

const blur = { leve: "backdrop-blur-md", media: "backdrop-blur-xl", forte: "backdrop-blur-2xl" } as const;
const claraBg = { leve: "bg-white/40 dark:bg-white/8", media: "bg-white/55 dark:bg-white/12", forte: "bg-white/70 dark:bg-white/16" } as const;
const escuraBg = { leve: "bg-[var(--graphite-950)]/35", media: "bg-[var(--graphite-950)]/50", forte: "bg-[var(--graphite-950)]/65" } as const;

export function GlassCard({ intensity = "media", tone = "clara", tint = false, interactive = false, className, children, ...props }: GlassCardProps) {
  const escura = tone === "escura";
  return (
    <div
      data-slot="glass-card"
      data-tone={tone}
      className={cn(
        "relative isolate overflow-hidden rounded-[20px] border p-6 backdrop-saturate-150",
        blur[intensity],
        escura
          ? cn(escuraBg[intensity], "border-white/15 text-white shadow-[0_8px_32px_rgba(6,6,8,0.25)]")
          : cn(claraBg[intensity], "border-white/60 text-foreground shadow-[0_8px_32px_rgba(6,6,8,0.08)] dark:border-white/15 dark:text-white"),
        tint && (escura ? "bg-primary/25" : "bg-[var(--primary-muted)] dark:bg-primary/15"),
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
      {children}
    </div>
  );
}

/** Cenário de demonstração: fundo com manchas de cor para o vidro ter o que desfocar. */
export function GlassScene({ dark = false, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { dark?: boolean }) {
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[24px] border border-border p-6 sm:p-8",
        dark ? "bg-[var(--graphite-950)]" : "bg-[var(--surface-tint,var(--primary-muted))]",
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn("pointer-events-none absolute -left-10 -top-16 -z-10 h-72 w-72 rounded-full blur-3xl", dark ? "bg-primary/50" : "bg-primary/35")} />
      <span aria-hidden className={cn("pointer-events-none absolute right-[-3rem] top-1/3 -z-10 h-64 w-64 rounded-full blur-3xl", dark ? "bg-[var(--warning)]/35" : "bg-[var(--warning)]/45")} />
      <span aria-hidden className={cn("pointer-events-none absolute bottom-[-4rem] left-1/3 -z-10 h-72 w-72 rounded-full blur-3xl", dark ? "bg-[var(--chart-2)]/40" : "bg-[var(--chart-2)]/35")} />
      {/* linhas finas para evidenciar o desfoque */}
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:repeating-linear-gradient(135deg,transparent_0_18px,rgba(255,255,255,.35)_18px_19px)]" />
      {children}
    </div>
  );
}
