import * as React from "react";

import { cn } from "./utils";

/**
 * Input (campo de digitar). Repassa a ref (forwardRef, 28/11/2026), como o Button: funciona dentro de um Radix com
 * asChild (PopoverTrigger, FormControl) e com react-hook-form.
 *
 * prefixo / sufixo (28/11/2026): um texto fixo antes ou depois do que a pessoa digita ("https://", "R$", "@", "kg").
 * Ele fica dentro da mesma caixa, em --muted-foreground, e não entra no valor do campo (o valor salvo é só o digitado).
 * Leitores de tela leem o prefixo e o sufixo como descrição do campo (aria-describedby). Com prefixo ou sufixo, o
 * className vai para a caixa (a borda, a altura e o fundo); sem eles, para o próprio campo, como sempre. O foco, o erro
 * (aria-invalid) e o desabilitado aparecem na caixa inteira.
 */
type InputProps = React.ComponentProps<"input"> & {
  /** Texto fixo antes do valor ("https://", "R$"). Não entra no valor. */
  prefixo?: React.ReactNode;
  /** Texto fixo depois do valor ("kg", ".com.br"). Não entra no valor. */
  sufixo?: React.ReactNode;
};

const classesDoCampo = cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input-fundo/30 border-input flex h-10 toque:h-11 w-full min-w-0 rounded-md border px-3 py-1 text-body bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:border-[var(--border-strong)]",
        "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
        "aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type, prefixo, sufixo, "aria-describedby": descritos, ...props }, ref) {
  const id = React.useId();
  if (prefixo == null && sufixo == null) {
    return <input ref={ref} type={type} data-slot="input" aria-describedby={descritos} className={cn(classesDoCampo, className)} {...props} />;
  }
  const idPrefixo = prefixo != null ? `${id}-prefixo` : undefined;
  const idSufixo = sufixo != null ? `${id}-sufixo` : undefined;
  const afixo = "flex shrink-0 select-none items-center whitespace-nowrap text-body text-muted-foreground";
  return (
    <div
      data-slot="input-com-afixo"
      // O prefixo e o sufixo fazem parte do campo: desabilitado, ficam apagados junto (isentos de contraste, como ele).
      aria-disabled={props.disabled || undefined}
      className={cn(
        classesDoCampo,
        "cursor-text items-stretch gap-0 p-0",
        "has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2",
        "has-[input[aria-invalid=true]]:border-error has-[input[aria-invalid=true]]:ring-error/20",
        "has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-50 has-[input:disabled]:border-[var(--border-strong)]",
        className,
      )}
      onPointerDown={(e) => { if (e.target === e.currentTarget) { e.preventDefault(); e.currentTarget.querySelector("input")?.focus(); } }}
    >
      {prefixo != null && <span id={idPrefixo} className={cn(afixo, "pl-3 pr-1")}>{prefixo}</span>}
      <input
        ref={ref}
        type={type}
        data-slot="input"
        aria-describedby={[idPrefixo, idSufixo, descritos].filter(Boolean).join(" ") || undefined}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent py-1 text-body text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
          prefixo != null ? "pl-0" : "pl-3",
          sufixo != null ? "pr-0" : "pr-3",
        )}
        {...props}
      />
      {sufixo != null && <span id={idSufixo} className={cn(afixo, "pl-1 pr-3")}>{sufixo}</span>}
    </div>
  );
});

export { Input };
export type { InputProps };
