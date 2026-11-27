import * as React from "react";

import { cn } from "./utils";
import { SemOrientacaoHerdada, useOrientacaoDoCard, type OrientacaoDoCard } from "./grade-de-cards";
import { DivisorDoCard } from "./divisor-do-card";

/*
 * Card vertical (padrão) ou horizontal (27/11/2026). Dentro de uma GradeDeCards que virou lista, o Card fica
 * horizontal sozinho; a prop orientacao fixa a orientação. Horizontal: mídia ou ícone (CardMidia) à esquerda, cabeçalho
 * e conteúdo ocupando o resto da largura e, embaixo, numa linha de largura inteira, o rodapé com o divisor do card
 * (DivisorDoCard) e as ações no canto inferior direito ("Card com ação: divisor e botão no canto inferior direito",
 * dona do produto, 27/11/2026). No celular (abaixo de 640 px), o horizontal vira vertical. Cards dentro do card não
 * herdam a orientação.
 */
// classes escritas por inteiro para o Tailwind encontrá-las
const horizontal = [
  "sm:data-[orientacao=horizontal]:grid sm:data-[orientacao=horizontal]:grid-cols-[auto_minmax(0,1fr)] sm:data-[orientacao=horizontal]:content-start sm:data-[orientacao=horizontal]:gap-0",
  // qualquer filho vai para a coluna do conteúdo; mídia à esquerda, rodapé embaixo
  "sm:data-[orientacao=horizontal]:*:col-start-2",
  // mídia: coluna da esquerda, ao lado do cabeçalho e do conteúdo
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:col-start-1 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:row-span-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:row-start-1 sm:data-[orientacao=horizontal]:*:data-[slot=card-midia]:mb-0",
  "sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:h-auto sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:w-44 lg:data-[orientacao=horizontal]:*:data-[tipo=imagem]:w-56 sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:rounded-none sm:data-[orientacao=horizontal]:*:data-[tipo=imagem]:rounded-tl-[inherit]",
  "sm:data-[orientacao=horizontal]:*:data-[tipo=icone]:pr-0 sm:data-[orientacao=horizontal]:*:data-[tipo=icone]:pb-6",
  // cabeçalho e conteúdo: o resto da largura, com o respiro do card
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-header]:col-start-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-header]:pb-6",
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-content]:col-start-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-content]:pb-6",
  // rodapé: linha de largura inteira embaixo; divisor em cima e ações no canto inferior direito
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:col-[1/-1] sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:mt-0 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:flex-wrap sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:justify-end sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:gap-x-2 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:border-t-0 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:pt-0",
  "sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:*:data-[slot=card-divisor]:block sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:*:data-[slot=card-divisor]:mb-4 sm:data-[orientacao=horizontal]:*:data-[slot=card-footer]:*:data-[slot=card-divisor]:basis-full",
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

/** Rodapé do card. No Card horizontal, ganha o divisor do card em cima e as ações vão para o canto inferior direito. */
function CardFooter({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("mt-auto flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    >
      <DivisorDoCard className="hidden" />
      {children}
    </div>
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
