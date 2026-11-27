"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "./utils";

/**
 * Luzes difusas (tema escuro). Trazido do FindLook Design System (27/11/2026), mesmo nome e mesma API, com as
 * cores deste DS (primária, violeta e crimson-600). No site do estúdio: os círculos de luz atrás da foto do hero da
 * página inicial e do card "Empresas atendidas" (`ih-luz`).
 *
 * Áreas de luz desfocadas, nas cores da marca, que ficam atrás de uma seção escura e dão ao vidro do painel
 * (GlassCard finish="painel") o que mostrar através dele. Movem-se devagar e param com "menos movimento".
 * Ficam atrás do conteúdo (-z-10): a seção precisa de `relative isolate`. Para não cortar a luz em linha reta
 * entre seções, use `overflow-x-clip` na seção (corta só nas laterais) e `dissolver` na base do hero.
 *
 * variante:
 *   hero     — três focos (rosa, violeta e rosa escuro) que trocam de lado devagar; para o hero.
 *   esquerda — rosa à esquerda e violeta à direita; para seções.
 *   direita  — rosa escuro à direita e rosa à esquerda; alterne com "esquerda" entre seções seguidas.
 */
export type LuzesDifusasProps = {
  variante?: "hero" | "esquerda" | "direita";
  /** A base das luzes se dissolve no fundo (sem linha de corte com a seção seguinte). */
  dissolver?: boolean;
  className?: string;
};

type Luz = { cor: string; classe: string; x: string[]; y?: string[]; dur: number };

const VARIANTES: Record<NonNullable<LuzesDifusasProps["variante"]>, Luz[]> = {
  hero: [
    { cor: "bg-primary/25", classe: "top-[8%] left-[-12%] size-[34rem]", x: ["0vw", "62vw", "0vw"], y: ["0%", "18%", "0%"], dur: 22 },
    { cor: "bg-[var(--violet)]/18", classe: "top-[28%] right-[-14%] size-[30rem]", x: ["0vw", "-60vw", "0vw"], y: ["0%", "-14%", "0%"], dur: 26 },
    { cor: "bg-crimson-600/30", classe: "bottom-[-18%] left-[30%] size-[28rem]", x: ["0vw", "-24vw", "20vw", "0vw"], y: ["0%", "-10%", "6%", "0%"], dur: 30 },
  ],
  esquerda: [
    { cor: "bg-primary/25", classe: "top-[18%] -left-[10%] size-[34rem]", x: ["0vw", "18vw", "0vw"], dur: 26 },
    { cor: "bg-[var(--violet)]/18", classe: "bottom-[8%] right-[-8%] size-[30rem]", x: ["0vw", "-16vw", "0vw"], dur: 30 },
  ],
  direita: [
    { cor: "bg-crimson-600/30", classe: "top-[22%] -right-[10%] size-[34rem]", x: ["0vw", "-18vw", "0vw"], dur: 26 },
    { cor: "bg-primary/22", classe: "bottom-[6%] left-[-6%] size-[30rem]", x: ["0vw", "16vw", "0vw"], dur: 30 },
  ],
};

export function LuzesDifusas({ variante = "esquerda", dissolver = false, className }: LuzesDifusasProps) {
  const reduzir = useReducedMotion();
  return (
    <div
      aria-hidden
      data-slot="luzes-difusas"
      data-variante={variante}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10",
        variante === "hero" && "overflow-hidden",
        dissolver && "[mask-image:linear-gradient(to_bottom,black_55%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_55%,transparent)]",
        className,
      )}
    >
      {VARIANTES[variante].map((l, i) => (
        <motion.span
          key={i}
          className={cn("absolute rounded-full blur-3xl", l.cor, l.classe)}
          animate={reduzir ? undefined : { x: l.x, ...(l.y ? { y: l.y } : {}) }}
          transition={{ duration: l.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
