import * as React from "react";

import { cn } from "./utils";

/**
 * Combinações de cores prontas, só com tokens do design system.
 * O dourado é o token `--warning` (âmbar), que fica mais vivo no tema escuro.
 */
export const shinePresets = {
  /** Primária com o azul de apoio (chart-2). */
  primaria: ["var(--primary)", "var(--chart-2)", "var(--primary)"],
  /** Dourado com a primária: premium, recomendado, destaque de plano. */
  dourada: ["var(--warning)", "var(--primary)", "var(--warning)"],
  /** Primária com um toque dourado. */
  "primaria-dourada": ["var(--primary)", "var(--warning)", "var(--primary)"],
  /** Só dourado: selo, conquista, edição especial. */
  ouro: ["var(--warning)", "var(--warning-foreground)", "var(--warning)"],
  /** Primária com o texto: mais contraste, menos cor. */
  contraste: ["var(--primary)", "var(--foreground)", "var(--primary)"],
} as const;

export type ShinePreset = keyof typeof shinePresets;

export type ShineBorderProps = React.HTMLAttributes<HTMLDivElement> & {
  borderWidth?: number;
  duration?: number;
  /** Uma cor ou uma lista de cores (tokens CSS). Tem prioridade sobre `preset`. */
  shineColor?: string | string[];
  /** Combinação pronta de cores do design system. */
  preset?: ShinePreset;
};

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor,
  preset,
  className,
  style,
  ...props
}: ShineBorderProps) {
  const colors = shineColor ?? (preset ? shinePresets[preset] : "var(--primary)");
  return (
    <div
      aria-hidden
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--duration": `${duration}s`,
          backgroundImage: `radial-gradient(transparent, transparent, ${
            Array.isArray(colors) ? colors.join(", ") : colors
          }, transparent, transparent)`,
          backgroundSize: "300% 300%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "var(--border-width)",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 size-full rounded-[inherit] motion-safe:animate-shine will-change-[background-position]",
        className,
      )}
      {...props}
    />
  );
}
