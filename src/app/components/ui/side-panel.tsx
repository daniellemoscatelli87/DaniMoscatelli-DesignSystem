"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * SidePanel (painel lateral / gaveta)
 *
 * Padrão do formulário de contato do site do estúdio, generalizado:
 * - abre pela direita; largura total no celular, 500 px no tablet e 540 px no desktop;
 * - fundo escurecido com desfoque; cantos arredondados à esquerda a partir do tablet;
 * - três zonas: cabeçalho fixo, corpo rolável e barra de ação fixa (mais um rodapé opcional);
 * - fecha por Esc, clique fora ou botão; prende o foco, trava a rolagem da página e devolve
 *   o foco ao elemento que abriu (tudo pelo Radix Dialog).
 */

type SidePanelProps = React.ComponentProps<typeof DialogPrimitive.Root>;

function SidePanel(props: SidePanelProps) {
  return <DialogPrimitive.Root data-slot="side-panel" {...props} />;
}

function SidePanelTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="side-panel-trigger" {...props} />;
}

function SidePanelClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="side-panel-close" {...props} />;
}

const widths = {
  md: "w-full sm:w-[500px] md:w-[540px]",
  lg: "w-full sm:w-[560px] md:w-[640px]",
} as const;

type SidePanelContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  /** Largura a partir do tablet. No celular é sempre a tela inteira. */
  width?: keyof typeof widths;
  /** Texto do botão fechar para leitores de tela. */
  closeLabel?: string;
  /** Lado de onde o painel entra. */
  side?: "right" | "left";
};

/** Contêiner do painel: overlay + caixa deslizante com as três zonas em `children`. */
function SidePanelContent({
  className,
  children,
  width = "md",
  side = "right",
  closeLabel = "Fechar",
  ...props
}: SidePanelContentProps) {
  return (
    <DialogPrimitive.Portal data-slot="side-panel-portal">
      <DialogPrimitive.Overlay
        data-slot="side-panel-overlay"
        className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 duration-300"
      />
      <DialogPrimitive.Content
        data-slot="side-panel-content"
        className={cn(
          "fixed inset-y-0 z-50 flex max-w-full flex-col overflow-hidden bg-card text-card-foreground shadow-[var(--shadow-xl)] outline-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out duration-300 ease-in-out",
          side === "right"
            ? "right-0 sm:rounded-l-3xl data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right"
            : "left-0 sm:rounded-r-3xl data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
          widths[width],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label={closeLabel}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <XIcon className="h-5 w-5" aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Cabeçalho fixo: rótulo pequeno (eyebrow), título e texto de apoio. */
function SidePanelHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="side-panel-header" className={cn("relative z-10 shrink-0 border-b border-border bg-card px-6 pb-3.5 pt-5 pr-14 sm:px-8 sm:pr-16", className)}>
      {eyebrow && (
        <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-[var(--primary-muted)] px-3 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-primary">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </div>
      )}
      <DialogPrimitive.Title className="text-[1.5rem] font-extrabold leading-tight tracking-[-0.025em] text-foreground sm:text-[1.875rem]">
        {title}
      </DialogPrimitive.Title>
      {description ? (
        <DialogPrimitive.Description className="mt-1 text-[0.75rem] leading-snug text-muted-foreground sm:text-[0.875rem]">
          {description}
        </DialogPrimitive.Description>
      ) : (
        <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
      )}
    </div>
  );
}

/** Corpo rolável. */
function SidePanelBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-body" className={cn("flex-1 overflow-y-auto px-6 py-4 sm:px-8", className)} {...props} />;
}

/** Barra de ação fixa na base (botão principal). */
function SidePanelActions({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="side-panel-actions" className={cn("relative z-10 shrink-0 border-t border-border bg-card px-6 py-3 sm:px-8", className)} {...props} />;
}

/** Rodapé discreto abaixo da barra de ação (nota de segurança, assinatura). */
function SidePanelFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="side-panel-footer"
      className={cn("flex shrink-0 items-center justify-between gap-3 border-t border-border bg-muted/60 px-6 py-2.5 text-[0.6875rem] text-muted-foreground sm:px-8", className)}
      {...props}
    />
  );
}

export {
  SidePanel,
  SidePanelTrigger,
  SidePanelClose,
  SidePanelContent,
  SidePanelHeader,
  SidePanelBody,
  SidePanelActions,
  SidePanelFooter,
};
