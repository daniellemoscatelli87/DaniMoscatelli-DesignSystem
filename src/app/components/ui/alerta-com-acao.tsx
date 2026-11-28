"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import { cn } from "./utils";

/**
 * Alerta com ação (aprovado pela dona do produto em 23/11/2026)
 *
 * Aviso que pede uma ação de quem lê: ícone com base, título, descrição (com nota opcional) e, embaixo do texto,
 * uma ação principal de contorno (BotaoDoAlerta) e, se precisar, uma secundária em forma de link (LinkDoAlerta).
 * Regras:
 *  - as ações ficam sempre embaixo do texto, nunca ao lado;
 *  - uma só ação principal, de contorno (sem preenchimento);
 *  - dentro do card só o título muda de tamanho (15 px); todo o resto tem 14 px;
 *  - role="alert" para aviso e erro; role="status" para info e sucesso.
 * Tudo vem dos tokens: cor do estado (--info, --success, --warning, --error), cor de texto do estado
 * (--info-text, --success-text, --warning-text, --error-text), --card, --foreground, --muted-foreground, --ring,
 * --disabled e os tokens de movimento. O arquivo é o mesmo nos dois design systems; só os tokens mudam.
 * O texto de apoio usa --muted-foreground com 15% de --foreground, para passar de 4,5:1 em todos os fundos coloridos,
 * inclusive o rosado do erro (27/11/2026).
 *
 * Celular (abaixo de 640 px; pedido da dona do produto, 27/11/2026): uma borda esquerda só. A base do ícone fica menor
 * (36 px) e na mesma linha do título, centralizada com ele; a descrição, o botão e o link começam todos na borda do
 * respiro do card, alinhados com a base do ícone. Botão e link ficam lado a lado, centralizados na altura um do outro,
 * e só quebram de linha quando não cabem (o link, então, começa na mesma borda). Do 640 px em diante, o layout de
 * sempre: o ícone numa coluna e título, descrição e ações na coluna do texto.
 */

type TomDoAlerta = "info" | "sucesso" | "aviso" | "erro";

/* Cada tom define as variáveis que o alerta e os botões usam:
   --alerta-cor (borda, fundo e contorno do botão), --alerta-texto (texto do botão), --alerta-icone (ícone),
   --alerta-fundo (tinta do fundo sobre o card) e --alerta-base (tinta da base do ícone). */
const variaveisDoTom = cva("", {
  variants: {
    tom: {
      info: "[--alerta-cor:var(--info)] [--alerta-texto:var(--info-text)] [--alerta-icone:var(--info)] [--alerta-fundo:7%] [--alerta-base:18%]",
      sucesso: "[--alerta-cor:var(--success)] [--alerta-texto:var(--success-text)] [--alerta-icone:var(--success)] [--alerta-fundo:7%] [--alerta-base:18%]",
      aviso: "[--alerta-cor:var(--warning)] [--alerta-texto:var(--warning-text)] [--alerta-icone:var(--warning-text)] [--alerta-fundo:9%] [--alerta-base:30%]",
      erro: "[--alerta-cor:var(--error)] [--alerta-texto:var(--error-text)] [--alerta-icone:var(--error-text)] [--alerta-fundo:7%] [--alerta-base:18%]",
    },
  },
  defaultVariants: { tom: "info" },
});

const ICONE_DO_TOM: Record<TomDoAlerta, React.ElementType> = {
  info: Info,
  sucesso: CheckCircle2,
  aviso: AlertCircle,
  erro: XCircle,
};

const transicao =
  "transition-[background-color,color,border-color,text-decoration-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none";
const foco =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const ContextoDoAlerta = React.createContext<TomDoAlerta | null>(null);

type AlertaComAcaoProps = Omit<React.ComponentProps<"div">, "title"> & {
  tom?: TomDoAlerta;
  titulo: React.ReactNode;
  /** Troca o ícone padrão do tom (ícone lucide de 20 px). */
  icone?: React.ReactNode;
  /** Ações embaixo do texto: um BotaoDoAlerta e, se precisar, um LinkDoAlerta. */
  acoes?: React.ReactNode;
  /** Mostra o botão Fechar no canto (32 px). */
  onFechar?: () => void;
  rotuloFechar?: string;
};

function AlertaComAcao({
  tom = "info",
  titulo,
  icone,
  acoes,
  onFechar,
  rotuloFechar = "Fechar",
  className,
  children,
  ...props
}: AlertaComAcaoProps) {
  const Icone = ICONE_DO_TOM[tom];
  return (
    <ContextoDoAlerta.Provider value={tom}>
      <div
        data-slot="alerta-com-acao"
        data-tom={tom}
        role={tom === "aviso" || tom === "erro" ? "alert" : "status"}
        className={cn(
          variaveisDoTom({ tom }),
          "[--alerta-tinta:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-fundo),transparent)]",
          "@container/alerta relative grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-x-3 rounded-lg border border-[color:color-mix(in_oklab,var(--alerta-cor)_22%,transparent)] bg-card bg-[image:linear-gradient(var(--alerta-tinta),var(--alerta-tinta))] px-4 py-4 text-left sm:grid-cols-[2.75rem_minmax(0,1fr)] sm:gap-x-4 sm:px-6 sm:py-5",
          onFechar && "pr-12 sm:pr-12",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden
          data-slot="alerta-com-acao-icone"
          className="col-start-1 row-start-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-[color:color-mix(in_oklab,var(--alerta-cor)_var(--alerta-base),var(--card))] text-[color:var(--alerta-icone)] [&>svg]:size-[18px] sm:row-span-2 sm:size-11 sm:[&>svg]:size-5"
        >
          {icone ?? <Icone />}
        </span>
        {/* Celular: título ao lado do ícone, centralizado com ele. Computador: título no alto da coluna do texto. */}
        <div data-slot="alerta-com-acao-titulo" className="col-start-2 row-start-1 min-w-0 self-center text-body font-bold leading-[1.35] text-foreground sm:self-start sm:pt-1">
          {titulo}
        </div>
        {/* Celular: descrição na largura toda, a partir da borda do respiro (alinhada com a base do ícone). */}
        {children != null && (
          <div
            data-slot="alerta-com-acao-descricao"
            className="col-span-2 col-start-1 row-start-2 mt-3 min-w-0 text-body-sm leading-[1.6] text-[color:color-mix(in_oklab,var(--muted-foreground)_85%,var(--foreground))] sm:col-span-1 sm:col-start-2 sm:mt-1 [&_strong]:font-semibold [&_strong]:text-foreground [&>p+p]:mt-1"
          >
            {children}
          </div>
        )}
        {/* Ações sempre embaixo do texto, lado a lado e centralizadas na altura uma da outra; quebram só se não couberem.
            Celular: começam na mesma borda da descrição. Computador: na coluna do texto (em alerta estreito, a menos de
            352 px de conteúdo, usam também a largura sob o ícone). */}
        {acoes != null && (
          <div
            data-slot="alerta-com-acao-acoes"
            className="col-span-2 col-start-1 row-start-3 mt-4 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 sm:col-span-1 sm:col-start-2 sm:mt-3 sm:gap-x-2 sm:@max-[22rem]/alerta:col-span-2 sm:@max-[22rem]/alerta:col-start-1 max-sm:[&>[data-slot=link-do-alerta]]:px-0"
          >
            {acoes}
          </div>
        )}
        {onFechar && (
          <button
            type="button"
            aria-label={rotuloFechar}
            onClick={onFechar}
            className={cn(
              "absolute right-3 top-3 flex size-8 items-center justify-center rounded-sm text-muted-foreground hover:bg-[color:color-mix(in_oklab,var(--alerta-cor)_10%,transparent)] hover:text-foreground [&_svg]:size-4",
              transicao,
              foco,
            )}
          >
            <X aria-hidden />
          </button>
        )}
      </div>
    </ContextoDoAlerta.Provider>
  );
}

type BotaoDoAlertaProps = React.ComponentProps<"button"> & {
  /** Por padrão usa o tom do AlertaComAcao em volta. */
  tom?: TomDoAlerta;
  asChild?: boolean;
};

/** Ação principal do alerta: só contorno, na cor do estado; texto e ícone na cor de texto do estado. */
function BotaoDoAlerta({ tom, asChild = false, className, ...props }: BotaoDoAlertaProps) {
  const tomDoContexto = React.useContext(ContextoDoAlerta);
  const tomFinal = tom ?? tomDoContexto ?? "info";
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="botao-do-alerta"
      data-tom={tomFinal}
      className={cn(
        variaveisDoTom({ tom: tomFinal }),
        "inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-full toque:min-h-11 border-[length:1.5px] border-[color:var(--alerta-cor)] bg-transparent px-4 py-1 text-left text-body-sm font-semibold leading-snug text-[color:var(--alerta-texto)]",
        "hover:bg-[color:color-mix(in_oklab,var(--alerta-cor)_8%,transparent)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground aria-disabled:pointer-events-none aria-disabled:border-transparent aria-disabled:bg-disabled aria-disabled:text-disabled-foreground",
        transicao,
        foco,
        className,
      )}
      {...props}
    />
  );
}

type LinkDoAlertaProps = React.ComponentProps<"button"> & { asChild?: boolean };

/** Ação secundária do alerta: botão com cara de link, sublinhado, em --foreground. */
function LinkDoAlerta({ asChild = false, className, ...props }: LinkDoAlertaProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="link-do-alerta"
      className={cn(
        "inline-flex min-h-10 max-w-full items-center gap-2 rounded-full bg-transparent toque:min-h-11 px-2 text-left text-body-sm font-semibold leading-snug text-foreground underline decoration-[color:color-mix(in_oklab,var(--foreground)_35%,transparent)] underline-offset-4 hover:decoration-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        "disabled:cursor-not-allowed disabled:text-disabled-foreground disabled:no-underline aria-disabled:pointer-events-none aria-disabled:text-disabled-foreground aria-disabled:no-underline",
        transicao,
        foco,
        className,
      )}
      {...props}
    />
  );
}

export { AlertaComAcao, BotaoDoAlerta, LinkDoAlerta, variaveisDoTom as variaveisDoAlerta };
export type { TomDoAlerta, AlertaComAcaoProps, BotaoDoAlertaProps, LinkDoAlertaProps };
