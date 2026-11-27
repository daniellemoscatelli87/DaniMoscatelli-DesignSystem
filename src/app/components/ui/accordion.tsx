"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "./utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  semIcone = false,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { semIcone?: boolean }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring flex flex-1 items-center justify-between gap-4 rounded-md py-4 text-left text-body font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        {!semIcone && <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

/**
 * AccordionContent (a resposta que abre e fecha)
 * - `className` vai para o bloco de dentro (o texto, com o respiro de baixo pb-4): é onde você muda respiro, cor e
 *   tamanho do texto. `classeDaRegiao` vai para a região que abre e fecha (a que anima a altura). Sempre assim, nos
 *   dois DS (27/11/2026).
 * - `manterNoHtml`: as respostas fechadas continuam no HTML (para os buscadores lerem), escondidas com display: none,
 *   fora da tela e dos leitores de tela até abrir; ao fechar, a resposta some sem a animação de recolher. Use nas
 *   perguntas frequentes de páginas públicas. Sem ele, a resposta fechada sai do HTML (padrão do Radix).
 */
function AccordionContent({
  className,
  classeDaRegiao,
  manterNoHtml = false,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content> & { classeDaRegiao?: string; manterNoHtml?: boolean }) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      forceMount={manterNoHtml ? true : props.forceMount}
      className={cn("data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-body-sm leading-5", manterNoHtml && "data-[state=closed]:hidden", classeDaRegiao)}
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
