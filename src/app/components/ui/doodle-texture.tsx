import * as React from "react";
import { cn } from "./utils";

/**
 * DoodleTexture (textura doodle)
 *
 * Padrão de ícones de traço, sem emenda, no universo da marca: pesquisa, inovação, UX, UI, usuário, jornada, post-it e design thinking.
 * O desenho vem de `public/texturas/doodle-studio-traco.svg` e é aplicado como máscara,
 * então a cor do traço é qualquer token (sólida, sem transparência) e segue o tema.
 * Padrão: grafite-200 no claro e grafite-800 no escuro, como no papel de parede de referência.
 * Arquivos prontos para uso fora do React: -claro, -escuro e -primaria (SVG e PNG).
 */
export const doodleTextureFiles = {
  traco: "texturas/doodle-studio-traco.svg",
  claro: "texturas/doodle-studio-claro.svg",
  escuro: "texturas/doodle-studio-escuro.svg",
  primaria: "texturas/doodle-studio-primaria.svg",
  pngClaro: "texturas/doodle-studio-claro.png",
  pngEscuro: "texturas/doodle-studio-escuro.png",
} as const;

export type DoodleTextureProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tamanho do ladrilho: p 480 px, m 640 px, g 800 px. */
  scale?: "p" | "m" | "g";
  /** Cor do traço (qualquer cor CSS ou token). Sem ela, grafite-200 no claro e grafite-800 no escuro. */
  color?: string;
  /** Posição do ladrilho, para alinhar com outro fundo. */
  position?: string;
};

const tile = { p: "480px", m: "640px", g: "800px" } as const;

export function DoodleTexture({ scale = "m", color, position = "0 0", className, style, ...props }: DoodleTextureProps) {
  const url = `url(${import.meta.env.BASE_URL}${doodleTextureFiles.traco})`;
  return (
    <div
      aria-hidden
      data-slot="doodle-texture"
      className={cn("pointer-events-none absolute inset-0 -z-10", !color && "bg-graphite-200 dark:bg-graphite-800", className)}
      style={{
        backgroundColor: color,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: tile[scale],
        maskSize: tile[scale],
        WebkitMaskRepeat: "repeat",
        maskRepeat: "repeat",
        WebkitMaskPosition: position,
        maskPosition: position,
        ...style,
      }}
      {...props}
    />
  );
}
