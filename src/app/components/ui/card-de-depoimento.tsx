import * as React from "react";
import { Quote } from "lucide-react";
import { cn } from "./utils";
import { ChipDeEstado } from "./chip-de-estado";
import { Avaliacao } from "./avaliacao";

/**
 * CardDeDepoimento (depoimento de cliente, par ou de quem usou a plataforma)
 *
 * O cartão padrão de depoimento nos dois design systems (decisão da dona do produto, 28/11/2026): o ícone de aspas, o
 * depoimento em cima e, depois de um divisor, a pessoa (foto ou iniciais, nome, cargo e, opcional, a origem, como
 * "Recomendação no LinkedIn"). No Dani Moscatelli, os depoimentos da página inicial (`testimonial-card`) e das páginas
 * de apresentação; no FindLook, o feedback de quem usou a plataforma, com o perfil ("Cliente" ou "Loja parceira"), a
 * loja e a nota. Use dentro do Carousel (um por vez no celular, dois no tablet, três no computador) ou numa GradeDeCards.
 *
 * Uma fonte só do desenho: as classes .ds-card-depoimento e suas partes (theme.css, bloco "@ds-css-puro"). Este
 * componente só monta o HTML com elas; as páginas em HTML puro usam as mesmas classes (ver a documentação).
 *
 * - Card do DS só com borda (sem sombra parada); altura total da célula, para os vizinhos ficarem iguais.
 * - Depoimento num <blockquote>; trechos em <strong> ficam no texto principal. Pessoa num <figcaption>.
 * - perfil: "consumidor" (selo "Cliente") ou "lojista" (selo "Loja parceira"), no ChipDeEstado neutro.
 * - loja: o nome da loja, na linha do cargo. nota: a nota de 1 a 5 que a pessoa deu, na Avaliacao do DS (estrela e
 *   número), no alto à direita.
 * - Não invente depoimentos nem notas: o conteúdo vem do produto, com autorização de quem escreveu.
 */

export type PerfilDoDepoimento = "consumidor" | "lojista";

export type CardDeDepoimentoProps = Omit<React.ComponentProps<"figure">, "children"> & {
  nome: string;
  cargo?: string;
  /** URL da foto (quadrada). Sem foto, aparecem as iniciais. */
  foto?: string;
  /** Origem do depoimento ("Recomendação no LinkedIn"). */
  origem?: React.ReactNode;
  /** Quem escreveu: "consumidor" (selo "Cliente") ou "lojista" (selo "Loja parceira"). */
  perfil?: PerfilDoDepoimento;
  /** Nome da loja (para lojistas), na linha do cargo. */
  loja?: string;
  /** Nota de 1 a 5 dada pela pessoa (Avaliacao do DS). */
  nota?: number;
  children: React.ReactNode;
};

const SELO_DO_PERFIL: Record<PerfilDoDepoimento, string> = { consumidor: "Cliente", lojista: "Loja parceira" };

const iniciais = (nome: string) => nome.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join("").toUpperCase();

function CardDeDepoimento({ nome, cargo, foto, origem, perfil, loja, nota, children, className, ...props }: CardDeDepoimentoProps) {
  const linha = [cargo, loja].filter(Boolean).join(" · ");
  return (
    <figure data-slot="card-de-depoimento" className={cn("ds-card-depoimento", className)} {...props}>
      <blockquote className="ds-card-depoimento__texto">
        <span className="ds-card-depoimento__topo">
          <Quote aria-hidden="true" className="ds-card-depoimento__aspas" />
          {typeof nota === "number" && <Avaliacao nota={nota} fonte="dada por quem escreveu" />}
        </span>
        {children}
      </blockquote>
      <figcaption className="ds-card-depoimento__pessoa">
        {foto ? (
          <img src={foto} alt="" loading="lazy" className="ds-card-depoimento__foto" />
        ) : (
          <span aria-hidden="true" className="ds-card-depoimento__iniciais">{iniciais(nome)}</span>
        )}
        <span className="ds-card-depoimento__quem">
          <span className="ds-card-depoimento__nome">{nome}</span>
          {linha && <span className="ds-card-depoimento__cargo" title={linha}>{linha}</span>}
          {origem && <span className="ds-card-depoimento__origem">{origem}</span>}
          {perfil && (
            <span className="ds-card-depoimento__perfil">
              <ChipDeEstado tom="neutro">{SELO_DO_PERFIL[perfil]}</ChipDeEstado>
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

export { CardDeDepoimento };
