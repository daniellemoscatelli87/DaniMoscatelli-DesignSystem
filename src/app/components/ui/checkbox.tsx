"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Caixa de seleção: a caixa tem 20 px. No celular (abaixo de 640 px) a área de toque cresce para 44 px em volta da
 * caixa, sem mudar o lugar dela na tela (margem negativa de 12 px), para o dedo acertar (decisão de 27/11/2026).
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none disabled:cursor-not-allowed max-sm:-m-3 max-sm:size-11",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="checkbox-caixa"
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-input-background shadow-xs transition-shadow dark:bg-input/30",
          "group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary group-data-[state=checked]:text-primary-foreground dark:group-data-[state=checked]:bg-primary",
          "group-data-[state=indeterminate]:border-primary group-data-[state=indeterminate]:bg-primary group-data-[state=indeterminate]:text-primary-foreground",
          "group-focus-visible:border-ring group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2",
          "group-aria-invalid:border-destructive group-aria-invalid:ring-destructive/20 dark:group-aria-invalid:ring-destructive/40",
          "group-disabled:opacity-50",
        )}
      >
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon className="size-3.5 group-data-[state=indeterminate]:hidden" strokeWidth={3} />
          <MinusIcon className="hidden size-3.5 group-data-[state=indeterminate]:block" strokeWidth={3} />
        </CheckboxPrimitive.Indicator>
      </span>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
