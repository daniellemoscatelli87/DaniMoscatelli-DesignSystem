"use client";

import * as React from "react";

import { cn } from "./utils";

/**
 * Textarea. `contador` (com maxLength) mostra "120 de 500" embaixo, alinhado à borda esquerda do campo: cinza enquanto há folga, no tom de aviso
 * quando faltam 10% ou menos e no tom de erro no limite. Para leitores de tela, o aviso só fala quando faltam 20
 * caracteres ou menos ("Restam 12 caracteres"), para não anunciar cada letra.
 */
type TextareaProps = React.ComponentProps<"textarea"> & { contador?: boolean };

// forwardRef (28/11/2026): a ref chega ao <textarea> (Radix asChild, react-hook-form), como no Button e no Input.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, contador = false, maxLength, onChange, "aria-describedby": descritos, ...props }, ref) {
  const inicial = String(props.value ?? props.defaultValue ?? "").length;
  const [quantos, setQuantos] = React.useState(inicial);
  const idContador = React.useId();
  React.useEffect(() => {
    if (props.value !== undefined) setQuantos(String(props.value).length);
  }, [props.value]);

  const campo = (
    <textarea
      ref={ref}
      data-slot="textarea"
      maxLength={maxLength}
      onChange={(e) => { setQuantos(e.target.value.length); onChange?.(e); }}
      aria-describedby={contador && maxLength ? [descritos, idContador].filter(Boolean).join(" ") : descritos}
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error dark:bg-input-fundo/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-body leading-6 transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-[var(--border-strong)]",
        className,
      )}
      {...props}
    />
  );
  if (!contador || !maxLength) return campo;

  const restam = maxLength - quantos;
  const tom = restam <= 0 ? "text-error-text" : restam <= maxLength * 0.1 ? "text-warning-text" : "text-muted-foreground";
  return (
    <div data-slot="textarea-com-contador" className="grid gap-1">
      {campo}
      <p className={cn("m-0 text-label tabular-nums transition-colors", tom)}>
        <span aria-hidden>{quantos} de {maxLength}</span>
        <span id={idContador} className="sr-only">Até {maxLength} caracteres.</span>
        <span className="sr-only" aria-live="polite">{restam <= 20 ? (restam <= 0 ? "Limite de caracteres atingido." : `Restam ${restam} caracteres.`) : ""}</span>
      </p>
    </div>
  );
});

export { Textarea };
