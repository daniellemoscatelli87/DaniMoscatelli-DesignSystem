"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "date-fns/locale";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * Calendar (seletor de data de um campo; para ver o mês com compromissos, use a AgendaDoMes)
 *
 * Tamanho (27/11/2026, igual nos dois DS): no computador com mouse, dias de 32 px. No toque (celular ou tela de dedo),
 * o mês ocupa a largura que tem (até 320 px) e cada dia é um quadrado de até 40 px; a área de toque é sempre de
 * 44 × 44 px, centralizada no dia, e passa um pouco sobre o vizinho quando a coluna é mais estreita. Assim o mês cabe
 * inteiro num card de celular a partir de 320 px de tela, sem cortar a última coluna. Antes, a regra global de 44 px
 * empurrava cada dia para 44 px e o mês pedia cerca de 336 px.
 * Em português por padrão (dias da semana e meses, date-fns ptBR); troque com a prop locale.
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
      locale={ptBR}
      className={cn("p-3 toque:w-full toque:max-w-xs toque:p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2 toque:w-full",
        month: "flex flex-col gap-4 toque:w-full",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-body-sm leading-5 font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 toque:size-11 toque:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        // No toque, a tabela vira blocos e linhas flexíveis, para as colunas poderem encolher até caber.
        table: "w-full border-collapse space-x-1 toque:block",
        head: "toque:block",
        tbody: "toque:block",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-label toque:w-auto toque:min-w-0 toque:flex-1",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-body-sm leading-5 toque:flex toque:min-w-0 toque:flex-1 toque:justify-center focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full [&:has([aria-selected])]:bg-transparent",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          // min-w-0/min-h-0 desligam o mínimo global de 44 px. No toque, o dia ocupa a coluna até 40 px (quadrado) e a área
          // de toque é um ::after de 44 × 44 px centralizado, que passa um pouco sobre a borda dos vizinhos quando a coluna
          // é mais estreita (tela de 320 px dentro de um card).
          "relative size-8 min-h-0 min-w-0 p-0 font-normal aria-selected:opacity-100 toque:aspect-square toque:h-auto toque:w-10 toque:max-w-full toque:after:absolute toque:after:left-1/2 toque:after:top-1/2 toque:after:size-11 toque:after:-translate-x-1/2 toque:after:-translate-y-1/2 toque:after:content-['']",
        ),
        day_range_start: cn("day-range-start", escolhido),
        day_range_end: cn("day-range-end", escolhido),
        day_selected: escolhido,
        day_today: "font-bold ring-1 ring-inset ring-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:rounded-none aria-selected:bg-accent aria-selected:text-accent-foreground aria-selected:ring-0",
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
