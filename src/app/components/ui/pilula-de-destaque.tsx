import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "./utils";

/**
 * PilulaDeDestaque e GrupoDePilulasDeDestaque (destaques que não são clicáveis)
 *
 * Os destaques curtos da seção de depoimentos da página inicial do site (`ih-tags`: "35 recomendações",
 * "Excelência e compromisso", "Líderes, clientes & pares"): pílula de fundo cinza bem claro, borda fina, texto em
 * --foreground e um ícone Lucide de 18 px no vermelho do texto da marca (--primary-text), o mesmo tamanho em todas.
 * Aprovados pela dona do produto em 28/11/2026.
 *
 * Não é link nem botão: não tem hover, foco nem cursor de clique. Cada pílula é um item de lista (<li>) dentro do
 * grupo (<ul>), centralizado e quebrando em linhas, 12 px entre elas. Para uma ação, use o Button; para um estado
 * (pendente, ativo), o ChipDeEstado.
 *
 * Uma fonte só do desenho: as classes .ds-pilula-destaque e .ds-grupo-pilulas-destaque do theme.css (bloco
 * "@ds-css-puro"); as páginas em HTML puro usam as mesmas classes (HTML pronto em htmlDaPilulaDeDestaque).
 *
 * Texto de 12 px no celular e 14 px a partir de 768 px, como no site; 8 × 16 px de respiro.
 */

export type PilulaDeDestaqueProps = Omit<React.ComponentProps<"li">, "children"> & {
  /** Um ícone da Lucide (CircleCheck, Handshake, Users…), passado como componente: icone={Users}. */
  icone?: LucideIcon;
  children: React.ReactNode;
};

function PilulaDeDestaque({ icone: Icone, className, children, ...props }: PilulaDeDestaqueProps) {
  return (
    <li data-slot="pilula-de-destaque" className={cn("ds-pilula-destaque", className)} {...props}>
      {Icone && <Icone aria-hidden="true" focusable="false" className="ds-pilula-destaque__icone" strokeWidth={2} />}
      <span>{children}</span>
    </li>
  );
}

export type GrupoDePilulasDeDestaqueProps = React.ComponentProps<"ul"> & {
  /** "centro" (padrão, como na página inicial) ou "inicio" (alinhado à esquerda, junto de um texto à esquerda). */
  alinhamento?: "centro" | "inicio";
};

/** A lista das pílulas (<ul>); os filhos são PilulaDeDestaque. Dê um aria-label quando não houver título perto. */
function GrupoDePilulasDeDestaque({ alinhamento = "centro", className, ...props }: GrupoDePilulasDeDestaqueProps) {
  return (
    <ul
      data-slot="grupo-de-pilulas-de-destaque"
      className={cn("ds-grupo-pilulas-destaque", alinhamento === "inicio" && "ds-grupo-pilulas-destaque--inicio", className)}
      {...props}
    />
  );
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * A mesma pílula em HTML puro (páginas sem React). `svgDoIcone` é o <svg> do ícone Lucide, copiado da biblioteca de
 * ícones do DS (Ícones › Biblioteca), sem width/height: a classe dá os 18 px e a cor.
 */
export function htmlDaPilulaDeDestaque({ texto, svgDoIcone }: { texto: string; svgDoIcone?: string }) {
  const icone = svgDoIcone
    ? svgDoIcone.replace(/<svg\b/, '<svg class="ds-pilula-destaque__icone" aria-hidden="true" focusable="false"').replace(/\s(width|height)="[^"]*"/g, "")
    : "";
  return `<li class="ds-pilula-destaque">${icone}<span>${escapar(texto)}</span></li>`;
}

export { PilulaDeDestaque, GrupoDePilulasDeDestaque };
