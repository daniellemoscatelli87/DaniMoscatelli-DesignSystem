import * as React from "react";
import { cn } from "./utils";

/**
 * AvatarCircles — portado do Magic UI (magicui.design/docs/components/avatar-circles).
 *
 * Círculos de avatares sobrepostos com um último círculo "+N".
 * Adaptações ao design system: bordas em `border-background` (funciona nos temas claro e escuro),
 * o círculo "+N" usa `foreground`/`background`, e o "+N" só vira link quando `moreHref` é informado.
 * Cada avatar aceita `name` para o texto alternativo da imagem.
 */
export interface Avatar {
  imageUrl: string;
  profileUrl: string;
  /** Nome da pessoa, usado no texto alternativo e no title. */
  name?: string;
}

export interface AvatarCirclesProps {
  className?: string;
  /** Número que aparece no último círculo. */
  numPeople?: number;
  avatarUrls: Avatar[];
  /** Destino do círculo "+N" (por exemplo, a lista completa). Sem ele, o "+N" não é clicável. */
  moreHref?: string;
  /** Tamanho dos círculos. */
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { box: "h-8 w-8 text-[0.625rem]", px: 32, gap: "-space-x-3" },
  md: { box: "h-10 w-10 text-xs", px: 40, gap: "-space-x-4" },
  lg: { box: "h-12 w-12 text-sm", px: 48, gap: "-space-x-4" },
} as const;

export const AvatarCircles = ({ numPeople, className, avatarUrls, moreHref, size = "md" }: AvatarCirclesProps) => {
  const s = sizes[size];
  const More = moreHref ? "a" : "span";
  return (
    <div data-slot="avatar-circles" className={cn("z-10 flex rtl:space-x-reverse", s.gap, className)}>
      {avatarUrls.map((url, index) => (
        <a
          key={index}
          href={url.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={url.name}
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <img
            className={cn("rounded-full border-2 border-background object-cover", s.box)}
            src={url.imageUrl}
            width={s.px}
            height={s.px}
            alt={url.name ?? `Avatar ${index + 1}`}
          />
        </a>
      ))}
      {(numPeople ?? 0) > 0 && (
        <More
          {...(moreHref ? { href: moreHref } : {})}
          className={cn(
            "flex items-center justify-center rounded-full border-2 border-background bg-foreground text-center font-medium text-background",
            moreHref && "transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            s.box,
          )}
        >
          +{numPeople}
        </More>
      )}
    </div>
  );
};
