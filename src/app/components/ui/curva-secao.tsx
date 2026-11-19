import * as React from "react";
import { cn } from "./utils";

/**
 * CurvaSecao (divisor curvo entre seções)
 *
 * Borda curva e suave entre uma seção clara e uma escura (Projeto Piloto, seção "Onde podemos atuar"). É um SVG
 * decorativo, de ponta a ponta, que se estica na largura (preserveAspectRatio="none") e fica dentro da seção, por
 * cima do fundo dela:
 *
 * topo — no alto da seção, pintado com a cor da seção de CIMA: a seção anterior "desce" em curva sobre esta.
 * base — no pé da seção, pintado com a cor da seção de BAIXO: a próxima seção "sobe" em curva sobre esta.
 *
 * A seção precisa de position relative e overflow hidden, e de respiro extra no topo/base para o conteúdo não
 * ficar sob a curva (no site, +3rem / +5rem / +6rem conforme a tela, a mesma altura da curva).
 * Altura padrão: 48 px, 80 px a partir de 640 px e 96 px a partir de 1024 px.
 */

export type CurvaSecaoProps = Omit<React.SVGProps<SVGSVGElement>, "children"> & {
  posicao?: "topo" | "base";
  /** Cor da seção vizinha, sempre por token (por exemplo "var(--background)" ou "var(--card)"). */
  cor?: string;
};

const CAMINHOS = {
  topo: "M0 0H1440V24C1080 96 360 96 0 24Z",
  base: "M0 96H1440V72C1080 0 360 0 0 72Z",
};

function CurvaSecao({ posicao = "topo", cor = "var(--background)", className, ...props }: CurvaSecaoProps) {
  return (
    <svg
      aria-hidden
      focusable="false"
      data-slot="curva-secao"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute left-0 z-[2] block h-12 w-full sm:h-20 lg:h-24",
        posicao === "topo" ? "top-0" : "bottom-0",
        className,
      )}
      {...props}
    >
      <path fill={cor} d={CAMINHOS[posicao]} />
    </svg>
  );
}

export { CurvaSecao };
