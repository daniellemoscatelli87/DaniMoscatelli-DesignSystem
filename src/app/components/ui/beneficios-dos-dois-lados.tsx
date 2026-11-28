import * as React from "react";
import { CircleCheckBig } from "lucide-react";
import { cn } from "./utils";

/**
 * BeneficiosDosDoisLados (o que cada lado ganha, num card só)
 *
 * Mostra os benefícios de uma parceria para os dois lados (por exemplo, "Para sua empresa" e "Para o Studio"), num
 * card só. Prévia aprovada pela dona do produto em 28/11/2026. Mesmo arquivo nos dois DS (Dani Moscatelli e FindLook).
 *
 * Uma fonte só do desenho: as classes .ds-beneficios-lados e suas partes (theme.css, bloco
 * "@ds-css-puro:beneficios-dos-dois-lados"). Este componente só monta o HTML com elas; as páginas em HTML puro usam as
 * mesmas classes (ver a documentação).
 *
 * - Celular (contêiner estreito): o alternador compacto no alto, uma opção por lado com o ícone (o da opção escolhida
 *   fica colorido) e, embaixo, o título e a lista do lado escolhido. As opções são rádios de verdade: Tab entra no
 *   grupo e as setas trocam o lado.
 * - Com espaço (contêiner a partir de 40rem; 56rem com três lados): sem alternador, os lados em colunas no mesmo card,
 *   separados por uma linha; cada coluna com o ícone informativo (colorido na base cinza clara: o bloco só informa),
 *   a etiqueta em maiúsculas, o título e a lista. Etiqueta, título e lista começam na mesma altura em todas as
 *   colunas, mesmo quando os títulos têm tamanhos diferentes (subgrid).
 * - Lista: CircleCheckBig de 20 px em --primary-text.
 * - Dois lados (o uso normal); três também funcionam.
 * - Não invente benefícios: o conteúdo vem do produto.
 */

export type LadoDosBeneficios = {
  /** Identificador do lado (valor do rádio). */
  id: string;
  /** Nome do lado: vira a opção do alternador e a etiqueta da coluna ("Para sua empresa"). */
  rotulo: string;
  /** Ícone lucide do lado (Building, Sparkles…). */
  icone: React.ReactNode;
  titulo: React.ReactNode;
  itens: React.ReactNode[];
};

export type BeneficiosDosDoisLadosProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Os lados: dois (o uso normal) ou três. */
  lados: LadoDosBeneficios[];
  /** Lado escolhido quando o alternador aparece (padrão: o primeiro). */
  ladoInicial?: string;
  /** Nome do grupo do alternador para leitores de tela (padrão "Benefícios"). */
  rotulo?: string;
  /** Nível do título de cada lado (padrão 3). */
  nivel?: 2 | 3 | 4;
};

/** O ícone fica fora do leitor de tela: o nome do lado já está escrito ao lado dele. */
function semLeitor(icone: React.ReactNode) {
  return React.isValidElement<{ "aria-hidden"?: boolean }>(icone) ? React.cloneElement(icone, { "aria-hidden": true }) : icone;
}

function BeneficiosDosDoisLados({ lados, ladoInicial, rotulo = "Benefícios", nivel = 3, className, ...props }: BeneficiosDosDoisLadosProps) {
  const nome = React.useId();
  const inicial = lados.some((l) => l.id === ladoInicial) ? ladoInicial : lados[0]?.id;
  const Titulo = `h${nivel}` as "h2" | "h3" | "h4";
  return (
    <div
      data-slot="beneficios-dos-dois-lados"
      className={cn("ds-beneficios-lados", lados.length === 3 && "ds-beneficios-lados--tres", className)}
      {...props}
    >
      <div className="ds-beneficios-lados__card">
        <div className="ds-beneficios-lados__alternador" role="radiogroup" aria-label={rotulo}>
          {lados.map((l) => (
            <label key={l.id} className="ds-beneficios-lados__opcao">
              <input type="radio" name={nome} value={l.id} defaultChecked={l.id === inicial} />
              {semLeitor(l.icone)}
              <span>{l.rotulo}</span>
            </label>
          ))}
        </div>
        <div className="ds-beneficios-lados__lados">
          {lados.map((l, i) => (
            <React.Fragment key={l.id}>
              {i > 0 && <div className="ds-beneficios-lados__divisor" aria-hidden />}
              <div className="ds-beneficios-lados__lado">
                <div className="ds-beneficios-lados__cabecalho">
                  <span className="ds-beneficios-lados__base" aria-hidden>{semLeitor(l.icone)}</span>
                  <p className="ds-beneficios-lados__rotulo">{l.rotulo}</p>
                </div>
                <Titulo className="ds-beneficios-lados__titulo">{l.titulo}</Titulo>
                <ul className="ds-beneficios-lados__lista">
                  {l.itens.map((item, j) => (
                    <li key={j}>
                      <CircleCheckBig aria-hidden className="ds-beneficios-lados__check" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export { BeneficiosDosDoisLados };
