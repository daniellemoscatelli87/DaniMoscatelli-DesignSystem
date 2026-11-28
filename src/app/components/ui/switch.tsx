"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "./utils";

/** Interruptor: trilho de 44 × 24 px; no toque, a área clicável tem 44 px de altura, sem mudar o desenho (27/11/2026). */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-50 toque:-my-2 toque:h-11",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="switch-trilho"
        className="inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-all group-data-[state=checked]:bg-primary group-data-[state=unchecked]:bg-switch-background group-focus-visible:border-ring group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2"
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-card dark:data-[state=unchecked]:bg-card-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-5 rounded-full shadow-sm ring-0 transition-transform data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-[1px]",
          )}
        />
      </span>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
