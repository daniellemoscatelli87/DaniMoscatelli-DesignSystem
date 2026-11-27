"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * Calendar (seletor de data de um campo; para ver o mês com compromissos, use a AgendaDoMes)
 *
 * Tamanho (27/11/2026, igual nos dois DS): no computador com mouse, dias de 32 px; no toque (celular ou tela de dedo),
 * dias de 40 px desenhados, com área de toque de 44 px (2 px a mais de cada lado, sobre a borda do vizinho, que é
 * vazia). Assim o mês inteiro cabe em 304 px (7 × 40 + 24 de respiro) e entra num card de celular a partir de 320 px
 * de tela, sem cortar a última coluna. Antes, a regra global de 44 px empurrava cada dia para 44 px e o mês pedia
 * cerca de 336 px.
 * Estados (iguais aos da AgendaDoMes): escolhido no rosa de selecionado (--primary-suave, texto --primary-text, contorno
 * na primária), nunca vermelho cheio; hoje com contorno no texto e número em negrito; hover cinza (--accent); dias de
 * outro mês esmaecidos.
 */
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const escolhido =
    "bg-primary-suave text-primary-text ring-1 ring-inset ring-primary hover:bg-primary-suave hover:text-primary-text focus:bg-primary-suave focus:text-primary-text";
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-body-sm leading-5 font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 toque:size-11 toque:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 toque:w-10 font-normal text-label",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-body-sm leading-5 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md [&:has([aria-selected])]:bg-transparent",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          // min-w-0/min-h-0 desligam o mínimo global de 44 px; a área de toque de 44 px vem do ::after (2 px por lado).
          "relative size-8 min-h-0 min-w-0 p-0 font-normal aria-selected:opacity-100 toque:size-10 toque:after:absolute toque:after:-inset-0.5 toque:after:content-['']",
        ),
        day_range_start: cn("day-range-start", escolhido),
        day_range_end: cn("day-range-end", escolhido),
        day_selected: escolhido,
        day_today: "font-bold ring-1 ring-inset ring-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground aria-selected:ring-0",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

export { Calendar };
