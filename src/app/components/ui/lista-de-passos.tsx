"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

/**
 * Lista de passos (28/11/2026, igual nos dois DS): instruções numeradas de cima para baixo, com qualquer conteúdo em
 * cada passo (texto, botões, um código, um controle segmentado). Veio dos passos do simulador do WhatsApp do FindLook.
 * Não é o Stepper (assistente de várias telas, com a etapa atual) nem a Timeline (página que conta uma história ao
 * rolar): aqui todos os passos estão abertos ao mesmo tempo, e a pessoa segue na ordem que quiser.
 * - ListaDePassos: a lista (<ol>), com o espaço entre os passos. Numera sozinha os PassoDaLista de dentro.
 * - PassoDaLista: o número num círculo de destaque (--primary-muted, número em --primary-text), o título (h3 por padrão)
 *   e o conteúdo, alinhado à borda do título. "Passo 1:" vai para leitores de tela antes do título. `feito` troca o número
 *   pelo check (verde de sucesso) e diz "feito" para leitores de tela.
 * - NumeroDoPasso: só o círculo numerado, para outras listas numeradas (os achados da Inteligência, dentro do Accordion).
 * Movimento: os passos entram um depois do outro (deslizam 4 px e aparecem); com "menos movimento", aparecem prontos.
 */

export type NumeroDoPassoProps = {
  n: number;
  /** "md" (28 px, padrão) ou "sm" (24 px, dentro de títulos menores). */
  tamanho?: "sm" | "md";
  /** Mostra o check no lugar do número (passo feito). */
  feito?: boolean;
  className?: string;
};

/** Círculo numerado de destaque. É decorativo (aria-hidden): diga o número em texto perto dele, se ele importar. */
export function NumeroDoPasso({ n, tamanho = "md", feito = false, className }: NumeroDoPassoProps) {
  return (
    <span
      aria-hidden
      data-slot="numero-do-passo"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums transition-colors duration-[var(--duration-normal)]",
        tamanho === "sm" ? "size-6 text-label" : "size-7 text-body-sm",
        feito ? "bg-success-muted text-success-text" : "bg-primary-muted text-primary-text",
        className,
      )}
    >
      {feito ? <Check className={tamanho === "sm" ? "size-3.5" : "size-4"} strokeWidth={3} /> : n}
    </span>
  );
}

export type PassoDaListaProps = {
  titulo: React.ReactNode;
  children?: React.ReactNode;
  /** Número do passo; a ListaDePassos preenche sozinha (1, 2, 3…). */
  numero?: number;
  feito?: boolean;
  /** Nível do título (padrão 3). */
  nivel?: 2 | 3 | 4 | 5 | 6;
  /** Palavra lida antes do número (padrão "Passo"). */
  rotuloDoPasso?: string;
  /** Texto lido depois do título de um passo feito (padrão "feito"). */
  textoFeito?: string;
  className?: string;
};

export function PassoDaLista({ titulo, children, numero = 1, feito = false, nivel = 3, rotuloDoPasso = "Passo", textoFeito = "feito", className }: PassoDaListaProps) {
  const Titulo = `h${nivel}` as "h3";
  return (
    <li
      data-slot="passo-da-lista"
      data-feito={feito || undefined}
      className={cn(
        "flex gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:fill-mode-both motion-safe:duration-[var(--duration-normal)]",
        className,
      )}
      style={{ animationDelay: `${Math.min(numero - 1, 8) * 40}ms` }}
    >
      <NumeroDoPasso n={numero} feito={feito} />
      <div className="min-w-0 flex-1 pt-0.5 text-body-sm text-muted-foreground">
        <Titulo className="m-0 text-body font-semibold leading-snug text-foreground">
          <span className="sr-only">{rotuloDoPasso} {numero}: </span>
          {titulo}
          {feito && <span className="sr-only"> ({textoFeito})</span>}
        </Titulo>
        {children && <div className="mt-1 min-w-0">{children}</div>}
      </div>
    </li>
  );
}

export type ListaDePassosProps = React.OlHTMLAttributes<HTMLOListElement> & {
  /** Número do primeiro passo (padrão 1). */
  inicio?: number;
};

export function ListaDePassos({ inicio = 1, className, children, ...props }: ListaDePassosProps) {
  let n = inicio - 1;
  return (
    <ol data-slot="lista-de-passos" className={cn("m-0 list-none space-y-4 p-0", className)} {...props}>
      {React.Children.map(children, (filho) => {
        if (!React.isValidElement<PassoDaListaProps>(filho) || filho.type !== PassoDaLista) return filho;
        n += 1;
        return filho.props.numero === undefined ? React.cloneElement(filho, { numero: n }) : filho;
      })}
    </ol>
  );
}
