"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "./utils";

/**
 * SegmentedControl (controle segmentado)
 *
 * Opções acopladas, uma selecionada por vez, que se tocam como botões.
 * Use para escolhas curtas e exclusivas (2 a 5 opções, rótulos de uma ou duas palavras):
 * filtro, condição, período, modo de exibição. Sempre há uma opção selecionada.
 * Teclado: setas movem a seleção; Tab entra e sai do grupo.
 */
export type SegmentedOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type SegmentedControlProps<T extends string = string> = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange" | "dir"
> & {
  options: SegmentedOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** suave: opção ativa com fundo claro da primária (padrão). solida: fundo na primária. */
  variant?: "suave" | "solida";
  size?: "sm" | "md" | "lg";
  /** Ocupa toda a largura, dividindo o espaço igualmente. */
  fullWidth?: boolean;
};

const sizes = {
  sm: { root: "rounded-[8px]", item: "h-8 px-3 text-[0.8125rem] gap-1.5 [&_svg]:size-3.5" },
  md: { root: "rounded-[12px]", item: "h-10 px-4 text-[0.9375rem] gap-2 [&_svg]:size-4" },
  lg: { root: "rounded-[12px]", item: "h-11 px-5 text-[1rem] gap-2 [&_svg]:size-[18px]" },
} as const;

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  variant = "suave",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: SegmentedControlProps<T>) {
  const [inner, setInner] = React.useState<T>(defaultValue ?? options[0]?.value);
  const current = value ?? inner;
  const s = sizes[size];
  const rootRef = React.useRef<HTMLDivElement>(null);
  const select = (v: T) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };
  // Setas selecionam a próxima opção habilitada (como em um grupo de rádio), com volta ao início.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const enabled = options.filter((o) => !o.disabled);
    if (enabled.length < 2) return;
    const i = enabled.findIndex((o) => o.value === current);
    const next = enabled[(i + dir + enabled.length) % enabled.length];
    select(next.value);
    const idx = options.findIndex((o) => o.value === next.value);
    rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-slot=segmented-item]")[idx]?.focus();
  };
  return (
    <ToggleGroupPrimitive.Root
      ref={rootRef}
      type="single"
      rovingFocus={false}
      onKeyDown={onKeyDown}
      value={current}
      onValueChange={(v) => {
        if (!v) return; // sempre há uma opção selecionada
        select(v as T);
      }}
      data-slot="segmented-control"
      data-variant={variant}
      className={cn(
        "inline-grid max-w-full grid-flow-col auto-cols-[minmax(max-content,1fr)] items-stretch overflow-hidden border border-border bg-card p-0 shadow-[var(--shadow-xs)]",
        fullWidth && "grid w-full",
        s.root,
        className,
      )}
      {...props}
    >
      {options.map((opt) => (
        <ToggleGroupPrimitive.Item
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          tabIndex={opt.value === current ? 0 : -1}
          data-slot="segmented-item"
          className={cn(
            "relative inline-flex min-w-0 items-center justify-center whitespace-nowrap font-semibold text-muted-foreground",
            "border-l border-border first:border-l-0 outline-none transition-colors duration-150",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            "disabled:pointer-events-none disabled:opacity-50",
            variant === "suave" && "data-[state=on]:bg-[var(--primary-muted)] data-[state=on]:text-[var(--primary-text,var(--primary))]",
            variant === "solida" && "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-[var(--primary-hover)]",
            s.item,
          )}
        >
          {opt.icon && <span aria-hidden className="shrink-0">{opt.icon}</span>}
          <span>{opt.label}</span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
