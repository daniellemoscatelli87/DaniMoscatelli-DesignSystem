"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "./utils";

/**
 * Caixa de seleção. O desenho tem 20 px; no toque (celular ou tela de dedo, 27/11/2026) a área clicável cresce para
 * 44 × 44 px em volta dele, com margem negativa, sem mudar o tamanho do desenho nem o espaço que ele ocupa.
 */
function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer group relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 toque:-m-3 toque:size-11",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="checkbox-caixa"
        className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-input-background group-disabled:group-data-[state=unchecked]:border-[var(--border-strong)] text-primary-foreground shadow-xs transition-shadow dark:bg-input-fundo/30 group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary group-data-[state=indeterminate]:border-primary group-data-[state=indeterminate]:bg-primary group-focus-visible:border-ring group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-aria-invalid:border-error group-aria-invalid:ring-error/20"
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
