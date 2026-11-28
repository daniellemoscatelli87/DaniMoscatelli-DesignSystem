import * as React from "react";
import { BadgeCheck } from "lucide-react";
import { cn } from "./utils";
import { IconeDeRedeSocial, svgDaRedeSocial, type RedeSocial } from "./link-de-rede-social";

/**
 * CardDeRedeSocial (convite para ver tudo numa rede social)
 *
 * O card "Veja todas as 35 recomendações na íntegra" da seção de depoimentos da página inicial: o selo de verificado,
 * o título, o texto e o botão em pílula que abre a rede ("Acessar Recomendações no LinkedIn"). Só no DS Dani
 * Moscatelli (pedido da dona do produto, 28/11/2026), na área das redes sociais, junto do LinkDeRedeSocial.
 *
 * Enquadrado no padrão dos cards do DS: card só de borda (sem sombra parada), cantos de 24 px e 24 px de respiro; o
 * ícone numa base de 44 px (cantos de 16 px) como a CardMidia; 16 px do ícone ao título, 4 px do título ao texto.
 * Card com ação: divisor e o botão (regra da dona do produto, 28/11/2026: no card estreito, o botão na largura inteira;
 * do tablet em diante, no canto inferior direito). No celular (abaixo de 640 px), vertical (ícone em cima);
 * do tablet em diante, horizontal (ícone à esquerda, o texto no resto da largura, o rodapé na largura inteira embaixo),
 * como o Card horizontal do DS.
 *
 * - rede (padrão "linkedin"): escolhe a cor do selo e o ícone do botão (os mesmos do LinkDeRedeSocial).
 * - Cor oficial da marca: o selo usa a cor da rede (exceção da dona do produto). O botão fica na cor da rede só quando
 *   o texto branco passa de 4,5:1 sobre ela (LinkedIn #0A66C2: 5,7:1); nas outras redes, a primária do DS.
 * - Um componente para qualquer rede (e não um "CardDeRecomendacoes" só do LinkedIn): o mesmo desenho serve para
 *   "veja todas as avaliações" em outra rede, sem um card novo.
 * - Uma fonte só do desenho: as classes .ds-card-rede-social e suas partes (theme.css, bloco "@ds-css-puro"); as
 *   páginas em HTML puro usam as mesmas classes (HTML pronto em htmlDoCardDeRedeSocial).
 */

export type CardDeRedeSocialProps = Omit<React.ComponentProps<"section">, "children" | "title"> & {
  titulo: React.ReactNode;
  descricao: React.ReactNode;
  href: string;
  rotuloDoBotao: string;
  rede?: RedeSocial;
  /** Nível do título (padrão 3). */
  nivel?: 2 | 3 | 4;
  /** Abrir em nova aba (padrão: sim para link externo, com "(abre em nova aba)" para leitores de tela). */
  novaAba?: boolean;
};

const ehExterno = (href?: string) => !!href && /^https?:\/\//i.test(href);
const AVISO_NOVA_ABA = " (abre em nova aba)";

function CardDeRedeSocial({ titulo, descricao, href, rotuloDoBotao, rede = "linkedin", nivel = 3, novaAba, className, ...props }: CardDeRedeSocialProps) {
  const Titulo = `h${nivel}` as "h3";
  const abreNovaAba = novaAba ?? ehExterno(href);
  const idDoTitulo = React.useId();
  return (
    <section data-slot="card-de-rede-social" aria-labelledby={idDoTitulo} className={cn("ds-card-rede-social", `ds-card-rede-social--${rede}`, className)} {...props}>
      <span className="ds-card-rede-social__icone"><BadgeCheck aria-hidden="true" /></span>
      <div className="ds-card-rede-social__texto">
        <Titulo id={idDoTitulo} className="ds-card-rede-social__titulo">{titulo}</Titulo>
        <p className="ds-card-rede-social__descricao">{descricao}</p>
      </div>
      <div className="ds-card-rede-social__rodape">
        <a className="ds-card-rede-social__botao" href={href} {...(abreNovaAba ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <span className="ds-card-rede-social__rotulo">
            <IconeDeRedeSocial rede={rede} className="ds-card-rede-social__marca" />
            {rotuloDoBotao}
          </span>
          {abreNovaAba && <span className="ds-so-leitor">{AVISO_NOVA_ABA}</span>}
        </a>
      </div>
    </section>
  );
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const SELO = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m16 9-5.5 5.5L8 12"/></svg>';

/**
 * O mesmo card em HTML puro (páginas sem React): mesmas classes, o selo BadgeCheck da Lucide (ISC) e o ícone da
 * rede igual ao do LinkDeRedeSocial.
 */
export function htmlDoCardDeRedeSocial({ titulo, descricao, href, rotuloDoBotao, rede = "linkedin", novaAba }: { titulo: string; descricao: string; href: string; rotuloDoBotao: string; rede?: RedeSocial; novaAba?: boolean }) {
  const abreNovaAba = novaAba ?? ehExterno(href);
  const marca = svgDaRedeSocial(rede, "ds-card-rede-social__marca");
  return (
    `<section class="ds-card-rede-social ds-card-rede-social--${rede}" aria-label="${escapar(titulo)}">` +
    `<span class="ds-card-rede-social__icone">${SELO}</span>` +
    `<div class="ds-card-rede-social__texto"><h3 class="ds-card-rede-social__titulo">${escapar(titulo)}</h3><p class="ds-card-rede-social__descricao">${escapar(descricao)}</p></div>` +
    `<div class="ds-card-rede-social__rodape"><a class="ds-card-rede-social__botao" href="${escapar(href)}"${abreNovaAba ? ' target="_blank" rel="noopener noreferrer"' : ""}><span class="ds-card-rede-social__rotulo">${marca}${escapar(rotuloDoBotao)}</span>${abreNovaAba ? `<span class="ds-so-leitor">${AVISO_NOVA_ABA}</span>` : ""}</a></div>` +
    `</section>`
  );
}

export { CardDeRedeSocial };
