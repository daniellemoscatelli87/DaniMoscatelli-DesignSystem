"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "./utils";

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * Lista de abas: nunca rola para o lado. Quando as abas não cabem numa linha, quebram para a linha de baixo. No celular
 * (abaixo de 640 px) viram uma grade de colunas iguais (quantas couberem com 8rem cada, em geral duas), na largura toda,
 * e cada aba tem 44 px de altura (regra do DS, 27/11/2026).
 */
function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex w-fit max-w-full flex-wrap items-center gap-1 rounded-md p-1 max-sm:grid max-sm:w-full max-sm:grid-cols-[repeat(auto-fit,minmax(8rem,1fr))]",
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-[var(--shadow-sm)] data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-muted-foreground inline-flex items-center justify-center gap-1 rounded-sm border border-transparent px-4 py-2 text-body-sm font-medium whitespace-nowrap max-sm:min-h-11 max-sm:whitespace-normal max-sm:px-3 max-sm:text-center transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
