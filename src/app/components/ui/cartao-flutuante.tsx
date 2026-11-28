"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "./utils";
import { IconeComBase } from "./painel-dados";

/**
 * CartaoFlutuante (selo de contexto sobre uma foto do hero)
 *
 * Os cartõezinhos que flutuam sobre a foto do hero da Rede de Parceiros ("Design & UX · Protótipo em validação",
 * "Pesquisa · Entrevistas com usuários", `rp-flu`), o mesmo recurso da página do lojista da FindLook. Ícone na base,
 * título e uma linha de estado com o ponto colorido.
 *
 * - Fundo do card a 90% com desfoque, borda e sombra média (está sobre uma foto, não sobre o cinza da página).
 * - Flutua devagar para cima e para baixo (`flutuar`, 4 px, 5 s), com `atraso` para os cartões não andarem juntos;
 *   parado com "menos movimento". Entra subindo quando a página abre.
 * - É ilustração: fica com aria-hidden por padrão (`decorativo`). Posicione com className (absolute, top/left…).
 * - Ponto do estado: marca, sucesso, info ou aviso; o texto do estado diz o que é (nunca só a cor).
 */

const PONTO = { marca: "bg-primary", sucesso: "bg-success", info: "bg-info", aviso: "bg-warning" } as const;

export type CartaoFlutuanteProps = {
  icone: React.ReactNode;
  titulo: string;
  estado?: string;
  tom?: keyof typeof PONTO;
  flutuar?: boolean;
  /** Segundos de atraso da entrada e da flutuação. */
  atraso?: number;
  decorativo?: boolean;
  className?: string;
};

function CartaoFlutuante({ icone, titulo, estado, tom = "marca", flutuar = true, atraso = 0, decorativo = true, className }: CartaoFlutuanteProps) {
  const reduzir = useReducedMotion();
  return (
    <motion.div
      data-slot="cartao-flutuante"
      aria-hidden={decorativo || undefined}
      initial={reduzir ? false : { opacity: 0, y: 16 }}
      animate={reduzir || !flutuar ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, -4, 0] }}
      transition={reduzir || !flutuar
        ? { duration: 0.4, delay: atraso }
        : { opacity: { duration: 0.4, delay: atraso }, y: { duration: 5, delay: atraso, repeat: Infinity, ease: "easeInOut" } }}
      className={cn("flex w-max max-w-64 items-center gap-3 rounded-lg border border-border bg-card/90 py-2 pl-2 pr-4 shadow-md backdrop-blur-md", className)}
    >
      <IconeComBase tom="informativo" tamanho="md">{icone}</IconeComBase>
      <span className="min-w-0">
        <strong className="block truncate text-body-sm font-bold text-foreground">{titulo}</strong>
        {estado && (
          <span className="flex items-center gap-2 text-label text-muted-foreground">
            <span className={cn("size-2 shrink-0 rounded-full", PONTO[tom], !reduzir && "animate-pulse")} />
            <span className="truncate">{estado}</span>
          </span>
        )}
      </span>
    </motion.div>
  );
}

export { CartaoFlutuante };
