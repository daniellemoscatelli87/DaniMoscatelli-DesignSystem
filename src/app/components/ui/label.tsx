"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

/**
 * Label. `obrigatorio` (28/11/2026) põe o asterisco logo depois do texto, na mesma linha e quebrando junto com ele: o
 * Label é flex (para a caixa de marcar ao lado do texto), e um asterisco solto virava outro item e ia para a ponta
 * direita num rótulo longo. O asterisco é só visual (aria-hidden); o campo leva required ou aria-required.
 */
function Label({
  className,
  obrigatorio = false,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { obrigatorio?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {obrigatorio ? (
        <span className="min-w-0 leading-snug">
          {children}
          <span aria-hidden className="text-primary-text"> *</span>
        </span>
      ) : children}
    </LabelPrimitive.Root>
  );
}

export { Label };
