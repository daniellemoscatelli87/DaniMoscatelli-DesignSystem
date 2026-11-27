import * as React from "react";

import { cn } from "./utils";
import { SemOrientacaoHerdada, useOrientacaoDoCard, type OrientacaoDoCard } from "./grade-de-cards";

/*
 * Card vertical (padrão) ou horizontal (27/11/2026). Dentro de uma GradeDeCards que virou lista, o Card fica
 * horizontal sozinho; a prop orientacao fixa a orientação. Horizontal: três colunas, mídia ou ícone (CardMidia) à
 * esquerda, cabeçalho e conteúdo no meio, rodapé com as ações à direita. No celular (abaixo de 640 px), o horizontal
 * vira vertical. Cards dentro do card não herdam a orientação.
 */
const horizontal = [
  "sm:data-[orientacao=horizontal]:grid sm:data-[orientacao=horizontal]:grid-cols-[auto_minmax(0,1fr)_auto] sm:data-[orientacao=horizontal]:content-start sm:data-[orientacao=horizontal]:gap-0",
  // qualquer filho vai para a coluna do meio; mídia e rodapé vão para as laterais
  "sm:data-[orientacao=horizontal]:*:col-start-2",
  // mídia: coluna da esquerda, na altura inteira
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:col-start-1 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:row-span-3 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:row-start-1 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:mb-0",
  "sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:h-auto sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:w-44 lg:data-[orientacao=horizontal]:*:data-[tipo=imagem]:w-56 sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:rounded-none sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:rounded-l-[inherit]",
  "sm:data-[orientacao=horizontal]:*:data-[tipo=icone]:pr-0 sm:data-[orientacao=horizontal]:*:data-[tipo=icone]:pb-6",
  // cabeçalho e conteúdo: coluna do meio, com o respiro do card
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-header]:col-start-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-header]:pb-6",
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-content]:col-start-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-content]:pb-6",
  // rodapé: coluna da direita, centrado na altura
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:col-start-3 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:row-span-3 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:row-start-1 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:mt-0 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:self-center sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:py-6",
].join(" ");

function Card({ className, orientacao, children, ...props }: React.ComponentProps<"div"> & { orientacao?: OrientacaoDoCard }) {
  const daGrade = useOrientacaoDoCard();
  const o = orientacao ?? daGrade ?? "vertical";
  return (
    <div
      data-slot="card"
      data-orientacao={o}
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        horizontal,
        className,
      )}
      {...props}
    >
      <SemOrientacaoHerdada>{children}</SemOrientacaoHerdada>
    </div>
  );
}

/**
 * Mídia do card: foto (tipo="imagem", de ponta a ponta) ou ícone (tipo="icone", com o respiro do card; um ícone svg
 * direto ganha a base rosa clara com o ícone na cor de texto da primária, o padrão dos templates do painel).
 * Vertical: no topo. Horizontal: à esquerda, na altura inteira.
 */
function CardMidia({ className, tipo = "imagem", ...props }: React.ComponentProps<"div"> & { tipo?: "imagem" | "icone" }) {
  return (
    <div
      data-slot="card-midia"
      data-tipo={tipo}
      className={cn(
        "min-w-0",
        tipo === "imagem"
          ? "-mb-6 h-40 overflow-hidden rounded-t-[inherit] [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
          : "-mb-8 px-6 pt-6 [&>svg]:box-content [&>svg]:size-5 [&>svg]:rounded-lg [&>svg]:bg-[var(--primary-muted)] [&>svg]:p-3 [&>svg]:text-[var(--primary-text,var(--primary))]",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <h4
      data-slot="card-title"
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardMidia,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
