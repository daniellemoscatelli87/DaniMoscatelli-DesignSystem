"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";

import { cn } from "./utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

/** Opção de rádio: desenho de 20 px; no toque, área clicável de 44 × 44 px em volta, sem mudar o desenho (27/11/2026). */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "group relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-50 toque:-m-3 toque:size-11",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="radio-group-circulo"
        className="relative flex aspect-square size-5 shrink-0 items-center justify-center rounded-full border-2 border-input group-disabled:group-data-[state=unchecked]:border-[var(--border-strong)] shadow-xs transition-[color,box-shadow] dark:bg-input-fundo/30 group-data-[state=checked]:border-primary group-focus-visible:border-ring group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-aria-invalid:border-error"
      >
        <RadioGroupPrimitive.Indicator
          data-slot="radio-group-indicator"
          className="relative flex items-center justify-center"
        >
          <CircleIcon className="fill-primary text-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" />
        </RadioGroupPrimitive.Indicator>
      </span>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
