"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "./utils";
import { Selo } from "./selo";
import { withHighlight } from "./heading";
import { useOrientacaoDoCard } from "./grade-de-cards";
import { Button } from "./button";
import { AcoesDoCard } from "./acoes-do-card";

/**
 * PartnerCard (card de convite ao parceiro)
 *
 * Card que convida ao cadastro: selo, título com destaque, texto curto, ação principal (no horizontal, o visual fica à
 * esquerda, como a mídia do Card, e as ações na ponta direita; 28/11/2026)
 * e link secundário opcional. Vertical ou horizontal; tamanhos p, m e g. Sem orientation, segue a GradeDeCards:
 * horizontal quando a grade virou lista (regra da dona do produto, 27/11/2026).
 * Fundo de card com um brilho suave na cor primária no canto, como o hero do site.
 *
 * Ações (regra da ação nos cards, 28/11/2026): divisor e, à direita, o link secundário (Button link) e a ação principal
 * (pílula). No celular, os dois na largura toda, um embaixo do outro, o principal em cima. Alvos de 44 px no toque.
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
  p: "text-body-lg leading-snug tracking-[-0.015em]",
  m: "text-h3 sm:text-h2 leading-tight tracking-[-0.025em]",
  g: "text-h2 sm:text-h1 leading-[1.1] tracking-[-0.03em]",
};
const descSize: Record<Size, string> = { p: "text-body-sm", m: "text-body", g: "text-body-lg" };
const visualBox: Record<Size, string> = { p: "h-12 w-12", m: "h-16 w-16", g: "h-24 w-24" };
const tamanhoDoBotao: Record<Size, "default" | "lg"> = { p: "default", m: "default", g: "lg" };

export function PartnerCard({
  orientation: orientacaoFixa, size = "m", eyebrow, title, description, cta, secondary, visual, surface = "card", className, ...props
}: PartnerCardProps) {
  const daGrade = useOrientacaoDoCard();
  const horizontal = (orientacaoFixa ?? daGrade ?? "vertical") === "horizontal";
  const dark = surface === "dark";
  return (
    <div
      data-slot="partner-card"
      className={cn(
        "relative isolate overflow-hidden rounded-xl border transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]",
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
        <div className={cn("flex shrink-0 items-center justify-center rounded-lg", dark ? "bg-white/10" : "bg-[var(--primary-muted)]", visualBox[size])}>
          <span className={cn("flex items-center justify-center text-primary-text", size === "p" ? "[&>svg]:h-6 [&>svg]:w-6 [&>img]:h-7" : size === "m" ? "[&>svg]:h-8 [&>svg]:w-8 [&>img]:h-10" : "[&>svg]:h-12 [&>svg]:w-12 [&>img]:h-14")}>{visual}</span>
        </div>
      )}

      <div className={cn("min-w-0", horizontal ? "flex-1" : "flex flex-1 flex-col")}>
        {eyebrow && (
          <div className="mb-3">
            {dark ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-caption font-semibold uppercase tracking-[0.14em] text-white/85"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />{eyebrow}</span>
            ) : (
              <Selo size="sm">{eyebrow}</Selo>
            )}
          </div>
        )}
        <h3 className={cn("font-bold [text-wrap:pretty]", titleSize[size], dark ? "text-white" : "text-foreground")} style={{ fontFamily: "var(--font-sans)" }}>
          {withHighlight(title, "text-primary-text")}
        </h3>
        {description && <p className={cn("mt-2 max-w-prose leading-relaxed", descSize[size], dark ? "text-white/70" : surface === "tint" ? "text-[color:color-mix(in_oklab,var(--muted-foreground)_85%,var(--foreground))]" : "text-muted-foreground")}>{description}</p>}
        {/* Ações (regra da ação nos cards, dona do produto, 28/11/2026): divisor e a linha da ação (AcoesDoCard), com a
            ação principal (pílula) na ponta direita e o secundário como botão link. No celular, os dois ocupam a largura
            toda, um embaixo do outro, o principal em cima; do tablet em diante, lado a lado, à direita. */}
        <div className={cn("mt-auto", size === "p" ? "pt-4" : "pt-6")}>
          <AcoesDoCard className={dark ? "border-white/10" : undefined}>
            {secondary && (
              <Button asChild={!!secondary.href} variant="link" size={tamanhoDoBotao[size]} onClick={secondary.href ? undefined : secondary.onClick} type={secondary.href ? undefined : "button"} className={dark ? "text-white/85 hover:text-white" : undefined}>
                {secondary.href ? <a href={secondary.href}>{secondary.label}</a> : secondary.label}
              </Button>
            )}
            <Button asChild={!!cta.href} size={tamanhoDoBotao[size]} onClick={cta.href ? undefined : cta.onClick} type={cta.href ? undefined : "button"} className={cn("group", dark && "focus-visible:ring-offset-[var(--graphite-950)]")}>
              {cta.href ? (
                <a href={cta.href}>{cta.label}<ArrowRight className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden /></a>
              ) : (
                <>{cta.label}<ArrowRight className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden /></>
              )}
            </Button>
          </AcoesDoCard>
        </div>
      </div>
    </div>
  );
}
