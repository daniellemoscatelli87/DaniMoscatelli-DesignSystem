"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayButton } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";

import { cn } from "./utils";
import { buttonVariants } from "./button";

/**
 * Calendar (seletor de data de um campo; para ver o mês com compromissos, use a AgendaDoMes)
 *
 * Biblioteca (28/11/2026, igual nos dois DS): react-day-picker 9, que funciona com React 16.8 a 19 (a 8 só aceitava
 * até o 18, e o produto FindLook usa o 19). As datas em português vêm do próprio react-day-picker
 * (`react-day-picker/locale`); não é preciso instalar o date-fns no produto. A API das props é a do DayPicker 9
 * (mode, selected, onSelect, defaultMonth, disabled, locale…); só a interface de classes mudou por dentro.
 *
 * Tamanho (27/11/2026, igual nos dois DS): no computador com mouse, dias de 32 px. No toque (celular ou tela de dedo),
 * o mês ocupa a largura que tem (até 320 px) e cada dia é um quadrado de até 40 px; a área de toque é sempre de
 * 44 × 44 px, centralizada no dia, e passa um pouco sobre o vizinho quando a coluna é mais estreita. Assim o mês cabe
 * inteiro num card de celular a partir de 320 px de tela, sem cortar a última coluna.
 * Em português por padrão (dias da semana e meses); troque com a prop locale.
 * Estados (iguais aos da AgendaDoMes): escolhido no rosa de selecionado (--primary-suave, texto --primary-text, contorno
 * na primária), nunca vermelho cheio; hoje com contorno no texto e número em negrito; hover cinza (--accent); dias de
 * outro mês esmaecidos; desabilitado a 50 %.
 */
const escolhido = "bg-primary-suave text-primary-text ring-1 ring-inset ring-primary hover:bg-primary-suave hover:text-primary-text";

function BotaoDoDia({ className, day, modifiers, ...props }: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  // O DayPicker move o foco pelas setas do teclado marcando o dia como "focused"; o botão precisa receber o foco.
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  const meio = modifiers.range_middle;
  return (
    <button
      ref={ref}
      data-dia={day.isoDate}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        // min-w-0/min-h-0 desligam o mínimo global de 44 px. No toque, o dia ocupa a coluna até 40 px (quadrado) e a área
        // de toque é um ::after de 44 × 44 px centralizado.
        "relative size-8 min-h-0 min-w-0 p-0 text-body-sm font-normal leading-5 toque:aspect-square toque:h-auto toque:w-10 toque:max-w-full toque:after:absolute toque:after:left-1/2 toque:after:top-1/2 toque:after:size-11 toque:after:-translate-x-1/2 toque:after:-translate-y-1/2 toque:after:content-['']",
        modifiers.today && "font-bold ring-1 ring-inset ring-foreground",
        modifiers.outside && "text-muted-foreground",
        modifiers.selected && !meio && escolhido,
        meio && "rounded-none bg-accent text-accent-foreground ring-0 hover:bg-accent",
        modifiers.disabled && "text-muted-foreground opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ptBR}
      className={cn("p-3 toque:w-full toque:max-w-xs toque:p-2", className)}
      classNames={{
        root: "relative",
        months: "relative flex flex-col gap-2 sm:flex-row toque:w-full",
        month: "flex flex-col gap-4 toque:w-full",
        month_caption: "flex h-7 w-full items-center justify-center toque:h-11",
        caption_label: "text-body-sm font-medium leading-5",
        nav: "absolute inset-x-0 top-0 z-10 flex items-center justify-between px-1",
        button_previous: cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 toque:size-11 toque:opacity-100"),
        button_next: cn(buttonVariants({ variant: "outline" }), "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 toque:size-11 toque:opacity-100"),
        chevron: "size-4",
        // No toque, a tabela vira blocos e linhas flexíveis, para as colunas poderem encolher até caber.
        month_grid: "w-full border-collapse toque:block toque:[&>thead]:block",
        weekdays: "flex",
        weekday: "w-8 rounded-md text-label font-normal text-muted-foreground toque:w-auto toque:min-w-0 toque:flex-1",
        weeks: "toque:block",
        week: "mt-2 flex w-full",
        day: cn(
          "relative p-0 text-center toque:flex toque:min-w-0 toque:flex-1 toque:justify-center focus-within:relative focus-within:z-20",
          props.mode === "range" && "[&.rdp-range-middle]:bg-accent",
        ),
        range_start: "rdp-range-start rounded-l-md",
        range_middle: "rdp-range-middle",
        range_end: "rdp-range-end rounded-r-md",
        today: "",
        outside: "",
        disabled: "",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: c }) => (orientation === "left" ? <ChevronLeft aria-hidden className={cn("size-4", c)} /> : <ChevronRight aria-hidden className={cn("size-4", c)} />),
        DayButton: BotaoDoDia,
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
