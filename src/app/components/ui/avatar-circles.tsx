import * as React from "react";
import { cn } from "./utils";

/**
 * AvatarCircles — portado do Magic UI (magicui.design/docs/components/avatar-circles).
 *
 * Círculos de avatares sobrepostos com um último círculo "+N".
 * Adaptações ao design system: bordas em `border-background` (funciona nos temas claro e escuro),
 * o círculo "+N" usa `foreground`/`background`, e o "+N" só vira link quando `moreHref` é informado.
 * Cada avatar aceita `name` para o texto alternativo da imagem.
 *
 * Modo decorativo (`decorativo`, 28/11/2026): as fotos são só ilustração (por exemplo, ao lado de "800 pessoas já
 * encontraram seus looks"), então não são links, não recebem foco e ficam fora dos leitores de tela (a frase ao lado
 * já diz o que importa). Também sem link: o avatar sem `profileUrl`, que vira só a foto com o nome no texto alternativo.
 */
export interface Avatar {
  imageUrl: string;
  /** Página da pessoa. Sem ele (ou com `decorativo`), a foto não é link. */
  profileUrl?: string;
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
  /** Fotos só de enfeite: sem links, sem foco e escondidas dos leitores de tela (aria-hidden). */
  decorativo?: boolean;
}

const sizes = {
  sm: { box: "h-8 w-8 text-caption", px: 32, gap: "-space-x-3" },
  md: { box: "h-10 w-10 text-xs", px: 40, gap: "-space-x-4" },
  lg: { box: "h-12 w-12 text-sm", px: 48, gap: "-space-x-4" },
} as const;

export const AvatarCircles = ({ numPeople, className, avatarUrls, moreHref, size = "md", decorativo = false }: AvatarCirclesProps) => {
  const s = sizes[size];
  const comLinkNoMais = !!moreHref && !decorativo;
  const More = comLinkNoMais ? "a" : "span";
  return (
    <div data-slot="avatar-circles" data-decorativo={decorativo || undefined} aria-hidden={decorativo || undefined} className={cn("z-10 flex rtl:space-x-reverse", s.gap, className)}>
      {avatarUrls.map((url, index) => {
        const img = (
          <img
            className={cn("rounded-full border-2 border-background object-cover", s.box)}
            src={url.imageUrl}
            width={s.px}
            height={s.px}
            alt={decorativo ? "" : url.name ?? `Avatar ${index + 1}`}
          />
        );
        if (decorativo || !url.profileUrl) return <span key={index} className="shrink-0 rounded-full">{img}</span>;
        return (
          <a
            key={index}
            href={url.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={url.name}
            className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {img}
          </a>
        );
      })}
      {(numPeople ?? 0) > 0 && (
        <More
          {...(comLinkNoMais ? { href: moreHref } : {})}
          className={cn(
            "flex items-center justify-center rounded-full border-2 border-background bg-foreground text-center font-medium text-background",
            comLinkNoMais && "transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            s.box,
          )}
        >
          +{numPeople}
        </More>
      )}
    </div>
  );
};
