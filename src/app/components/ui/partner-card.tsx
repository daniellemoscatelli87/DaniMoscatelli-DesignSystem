import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "./utils";
import { Selo } from "./selo";
import { withHighlight } from "./heading";

/**
 * PartnerCard (card de convite ao parceiro)
 *
 * Card que convida ao cadastro: selo, título com destaque, texto curto, ação principal
 * e link secundário opcional. Vertical ou horizontal; tamanhos p, m e g.
 * Fundo de card com um brilho suave na cor primária no canto, como o hero do site.
 */
type Size = "p" | "m" | "g";

export type PartnerCardProps = React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "vertical" | "horizontal";
  size?: Size;
  /** Texto do selo (eyebrow). */
  eyebrow?: React.ReactNode;
  /** Título; destaque entre **asteriscos**. */
  title: string;
  description?: React.ReactNode;
  /** Ação principal. */
  cta: { label: string; href?: string; onClick?: () => void };
  /** Link secundário discreto. */
  secondary?: { label: string; href?: string; onClick?: () => void };
  /** Ícone, símbolo ou imagem (ocupa a área visual). */
  visual?: React.ReactNode;
  /** Superfície: card branco, rosa de apoio ou grafite. */
  surface?: "card" | "tint" | "dark";
};

const pad: Record<Size, string> = { p: "p-5", m: "p-6 sm:p-8", g: "p-8 sm:p-12" };
const titleSize: Record<Size, string> = {
  p: "text-[1.125rem] leading-snug tracking-[-0.015em]",
  m: "text-[1.5rem] sm:text-[1.75rem] leading-tight tracking-[-0.025em]",
  g: "text-[2rem] sm:text-[2.5rem] leading-[1.1] tracking-[-0.03em]",
};
const descSize: Record<Size, string> = { p: "text-[0.8125rem]", m: "text-[0.9375rem]", g: "text-[1.0625rem]" };
const visualBox: Record<Size, string> = { p: "h-12 w-12", m: "h-16 w-16", g: "h-24 w-24" };
const ctaSize: Record<Size, string> = { p: "h-9 px-4 text-[0.8125rem]", m: "h-10 px-5 text-[0.875rem]", g: "h-12 px-6 text-[0.9375rem]" };

export function PartnerCard({
  orientation = "vertical", size = "m", eyebrow, title, description, cta, secondary, visual, surface = "card", className, ...props
}: PartnerCardProps) {
  const horizontal = orientation === "horizontal";
  const dark = surface === "dark";
  const Cta = cta.href ? "a" : "button";
  const Sec = secondary?.href ? "a" : "button";
  return (
    <div
      data-slot="partner-card"
      className={cn(
        "relative isolate overflow-hidden rounded-[24px] border transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]",
        surface === "card" && "border-border bg-card text-card-foreground shadow-[var(--shadow-sm)]",
        surface === "tint" && "border-primary/15 bg-[var(--surface-tint,var(--primary-muted))] text-foreground shadow-[var(--shadow-sm)]",
        dark && "border-white/10 bg-[var(--graphite-950)] text-white shadow-[var(--shadow-md)]",
        pad[size],
        horizontal ? "flex flex-col gap-6 sm:flex-row sm:items-center" : "flex flex-col gap-5",
        className,
      )}
      {...props}
    >
      {/* brilho na cor primária, como o fundo do hero */}
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      <span aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 -z-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />

      {visual && (
        <div className={cn("flex shrink-0 items-center justify-center rounded-[18px]", dark ? "bg-white/10" : "bg-[var(--primary-muted)]", visualBox[size], horizontal ? "sm:order-last" : "")}>
          <span className={cn("flex items-center justify-center text-primary", size === "p" ? "[&>svg]:h-6 [&>svg]:w-6 [&>img]:h-7" : size === "m" ? "[&>svg]:h-8 [&>svg]:w-8 [&>img]:h-10" : "[&>svg]:h-12 [&>svg]:w-12 [&>img]:h-14")}>{visual}</span>
        </div>
      )}

      <div className={cn("min-w-0", horizontal && "flex-1")}>
        {eyebrow && (
          <div className="mb-3">
            {dark ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/85"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />{eyebrow}</span>
            ) : (
              <Selo size="sm">{eyebrow}</Selo>
            )}
          </div>
        )}
        <h3 className={cn("font-bold [text-wrap:balance]", titleSize[size], dark ? "text-white" : "text-foreground")} style={{ fontFamily: "var(--font-sans)" }}>
          {withHighlight(title, "text-primary")}
        </h3>
        {description && <p className={cn("mt-2 max-w-prose leading-relaxed", descSize[size], dark ? "text-white/70" : "text-muted-foreground")}>{description}</p>}
        <div className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", size === "p" ? "mt-4" : "mt-6")}>
          <Cta
            {...(cta.href ? { href: cta.href } : { type: "button", onClick: cta.onClick })}
            className={cn("group inline-flex items-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground shadow-[var(--shadow-sm)] transition-all hover:-translate-y-0.5 hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", dark && "focus-visible:ring-offset-[var(--graphite-950)]", ctaSize[size])}
          >
            {cta.label}
            <ArrowRight className={cn("transition-transform group-hover:translate-x-0.5", size === "g" ? "h-5 w-5" : "h-4 w-4")} aria-hidden />
          </Cta>
          {secondary && (
            <Sec
              {...(secondary.href ? { href: secondary.href } : { type: "button", onClick: secondary.onClick })}
              className={cn("text-[0.8125rem] font-semibold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded", dark ? "text-white/80" : "text-[var(--primary-text,var(--primary))]")}
            >
              {secondary.label}
            </Sec>
          )}
        </div>
      </div>
    </div>
  );
}
