"use client";

import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

import { cn } from "./utils";
import { useEscolhaSegmentada, type SegmentedOption } from "./segmented-control";

/**
 * AlternadorCompacto (28/11/2026, pedido da dona do produto: "esse componente de claro/escuro – português/inglês é um
 * switch que deve estar disponível no DS para outros usos")
 *
 * Duas a quatro opções curtas e exclusivas em um trilho cinza em pílula, com a opção escolhida em branco, borda e
 * sombra leve (o "polegar", que desliza até a opção escolhida). É o seletor de preferência que fica no cabeçalho:
 * tema claro/escuro, idioma, unidade. Para filtros e escolhas dentro do conteúdo, use o SegmentedControl.
 *
 * Medidas (iguais às do cabeçalho do site do DS desde 28/11/2026): trilho de 36 px (h-9, p-1, gap-1), opções de 28 px
 * (h-7, px-3) e área de toque de 44 px de altura, com uma extensão invisível acima e abaixo de cada opção (::after),
 * sem mudar o desenho.
 *
 * Mesma lógica do SegmentedControl (useEscolhaSegmentada): valor controlado ou não, sempre uma opção escolhida, setas
 * mudam a escolha e levam o foco junto, Tab entra e sai do grupo.
 *
 * Acessibilidade: role="radiogroup" com aria-label (obrigatório) e cada opção como role="radio" com aria-checked.
 * Quando o texto some (rotuloVisivel "sm" ou "nunca"), ele continua para o leitor de tela; `nome` dá um nome completo
 * à opção (aria-label e dica), e deve começar pelo texto visível (WCAG 2.5.3), por exemplo "EN, English".
 * Movimento: o polegar desliza com --duration-normal e --ease-snappy; com "menos movimento", troca sem deslizar.
 */
export type OpcaoDoAlternador<T extends string = string> = SegmentedOption<T> & {
  /** Nome completo para o leitor de tela e a dica (title). Comece pelo texto visível. */
  nome?: string;
};

export type AlternadorCompactoProps<T extends string = string> = Omit<
  React.ComponentProps<typeof ToggleGroupPrimitive.Root>,
  "type" | "value" | "defaultValue" | "onValueChange" | "dir" | "children" | "aria-label"
> & {
  options: OpcaoDoAlternador<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Nome do grupo para o leitor de tela (por exemplo, "Tema" ou "Idioma"). */
  "aria-label": string;
  /**
   * Quando o texto das opções aparece: "sempre" (padrão); "sm", só a partir de 640 px (abaixo, só o ícone);
   * "nunca", só o ícone. Nos dois últimos casos, toda opção precisa de ícone.
   */
  rotuloVisivel?: "sempre" | "sm" | "nunca";
};

type Posicao = { x: number; y: number; w: number; h: number };

const useLayoutSeguro = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const rotuloPorTela = {
  sempre: "",
  sm: "sr-only sm:not-sr-only",
  nunca: "sr-only",
} as const;

export function AlternadorCompacto<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  rotuloVisivel = "sempre",
  className,
  ...props
}: AlternadorCompactoProps<T>) {
  const { current, select, rootRef, onKeyDown } = useEscolhaSegmentada({
    options,
    value,
    defaultValue,
    onValueChange,
    seletorDoItem: "[data-slot=alternador-item]",
  });

  // O polegar acompanha a opção escolhida. Ele só desliza quando a escolha muda; quando a largura muda (o texto aparece
  // a partir de 640 px, a fonte carrega), ele se ajusta sem animação.
  const [pos, setPos] = React.useState<Posicao | null>(null);
  const [animar, setAnimar] = React.useState(false);
  const ultimo = React.useRef<T | undefined>(undefined);
  const chave = options.map((o) => o.value).join("|");
  const medir = React.useCallback(() => {
    const raiz = rootRef.current;
    if (!raiz) return;
    const i = chave.split("|").indexOf(current);
    const el = raiz.querySelectorAll<HTMLElement>("[data-slot=alternador-item]")[i];
    if (!el) return setPos(null);
    const R = raiz.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const novo = { x: r.left - R.left - raiz.clientLeft, y: r.top - R.top - raiz.clientTop, w: r.width, h: r.height };
    const mudou = ultimo.current !== undefined && ultimo.current !== current;
    ultimo.current = current;
    if (mudou) setAnimar(true);
    setPos((p) => (p && p.x === novo.x && p.y === novo.y && p.w === novo.w && p.h === novo.h ? p : novo));
  }, [current, chave, rootRef]);

  useLayoutSeguro(medir, [medir]);
  // O deslize dura --duration-normal (250 ms); depois disso, os ajustes de largura voltam a ser sem animação.
  React.useEffect(() => {
    if (!animar) return;
    const id = window.setTimeout(() => setAnimar(false), 400);
    return () => window.clearTimeout(id);
  }, [animar, current]);
  React.useEffect(() => {
    const raiz = rootRef.current;
    if (!raiz || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => medir());
    ro.observe(raiz);
    raiz.querySelectorAll("[data-slot=alternador-item]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [medir, rootRef]);

  return (
    <ToggleGroupPrimitive.Root
      ref={rootRef}
      type="single"
      role="radiogroup"
      rovingFocus={false}
      onKeyDown={onKeyDown}
      value={current}
      onValueChange={(v) => {
        if (!v) return; // sempre há uma opção escolhida
        select(v as T);
      }}
      data-slot="alternador-compacto"
      data-medido={pos ? "sim" : "nao"}
      className={cn(
        "group/alternador relative inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-border bg-muted p-1",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        data-slot="alternador-polegar"
        data-animar={animar ? "sim" : "nao"}
        className={cn(
          "pointer-events-none absolute left-0 top-0 rounded-full border border-border bg-card shadow-sm",
          "motion-safe:data-[animar=sim]:transition-[transform,width] motion-safe:data-[animar=sim]:duration-[var(--duration-normal)] motion-safe:data-[animar=sim]:ease-[var(--ease-snappy)]",
          !pos && "hidden",
        )}
        style={pos ? { width: pos.w, height: pos.h, transform: `translate(${pos.x}px, ${pos.y}px)` } : undefined}
      />
      {options.map((opt) => (
        <ToggleGroupPrimitive.Item
          key={opt.value}
          value={opt.value}
          disabled={opt.disabled}
          tabIndex={opt.value === current ? 0 : -1}
          aria-label={opt.nome}
          title={opt.nome}
          data-slot="alternador-item"
          data-alvo-compacto=""
          className={cn(
            "relative inline-flex h-7 items-center gap-1 whitespace-nowrap rounded-full border border-transparent px-3 text-label font-medium text-muted-foreground outline-none",
            "motion-safe:transition-colors motion-safe:duration-[var(--duration-fast)] hover:text-foreground data-[state=on]:text-foreground",
            // Antes de medir (primeira pintura no servidor), a própria opção escolhida mostra o fundo do polegar.
            "group-data-[medido=nao]/alternador:data-[state=on]:border-border group-data-[medido=nao]/alternador:data-[state=on]:bg-card group-data-[medido=nao]/alternador:data-[state=on]:shadow-sm",
            "focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            // Área de toque de 44 px de altura, invisível (28 px da opção + 8 px acima e abaixo).
            "after:absolute after:inset-x-0 after:-inset-y-2 after:content-['']",
            "[&_svg]:size-3.25 [&_svg]:shrink-0",
          )}
        >
          {opt.icon && <span aria-hidden className="inline-flex shrink-0">{opt.icon}</span>}
          <span className={rotuloPorTela[opt.icon ? rotuloVisivel : "sempre"]}>{opt.label}</span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
