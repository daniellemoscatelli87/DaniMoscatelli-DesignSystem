import * as React from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "./utils";

/**
 * LinkSaibaMais (alça "Saiba mais" do hero)
 *
 * O link que convida a rolar até a próxima seção, centralizado na base do hero (`ih-alca` da página inicial e
 * `rp-alca` da Rede de Parceiros): texto e a seta num círculo que desce e sobe devagar. Com `direcao="direita"`,
 * vira um link de continuação no fim de um bloco ("Saiba mais →").
 *
 * - Sem borda e sem fundo; a seta fica num círculo de 32 px com borda; tudo com 44 px de altura de toque.
 * - A seta para baixo se move 4 px a cada 2 s; parada com "menos movimento".
 * - `href` aponta para o id da seção ("#rede"). Para rolar suave, a página usa scroll-behavior: smooth (o DS já usa).
 * - Superfície escura (`sobreEscuro`): texto e círculo em branco.
 * - `comoLink`: o link do produto no lugar do <a> (por exemplo, o Link do Next.js). Mesma API do DS FindLook.
 */

export type LinkSaibaMaisProps = Omit<React.ComponentProps<"a">, "children"> & {
  children?: React.ReactNode;
  direcao?: "baixo" | "direita";
  sobreEscuro?: boolean;
  comoLink?: React.ElementType;
};

function LinkSaibaMais({ children = "Saiba mais", direcao = "baixo", sobreEscuro = false, comoLink, className, ...props }: LinkSaibaMaisProps) {
  const Comp = comoLink ?? "a";
  const Seta = direcao === "baixo" ? ArrowDown : ArrowRight;
  return (
    <Comp
      data-slot="link-saiba-mais"
      className={cn(
        "group/alca inline-flex min-h-11 items-center gap-3 rounded-full text-body-sm font-semibold transition-colors duration-[var(--duration-fast)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        direcao === "baixo" && "flex-col gap-2",
        sobreEscuro ? "text-white hover:text-crimson-100" : "text-foreground hover:text-primary-text",
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          "flex size-8 items-center justify-center rounded-full border transition-[translate,background-color] duration-[var(--duration-normal)]",
          sobreEscuro ? "border-white/60" : "border-[var(--border-strong)] group-hover/alca:bg-accent",
          direcao === "baixo" ? "motion-safe:animate-[alca-desce_2s_var(--ease-in-out)_infinite]" : "group-hover/alca:translate-x-1",
        )}
      >
        <Seta className="size-4" />
      </span>
      {direcao === "baixo" && <style>{"@keyframes alca-desce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}"}</style>}
    </Comp>
  );
}

export { LinkSaibaMais };
