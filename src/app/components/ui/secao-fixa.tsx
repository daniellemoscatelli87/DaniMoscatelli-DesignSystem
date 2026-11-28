import * as React from "react";
import { cn } from "./utils";

/**
 * SecaoFixa (título ou imagem parado enquanto o texto rola)
 *
 * Uma seção em duas colunas para conteúdo longo (etapas de um método, perguntas, uma história em partes): no
 * computador (a partir de 1024 px), a coluna `fixo` (o título com a introdução, ou uma imagem) fica parada ao lado
 * enquanto a coluna de texto rola; quando a seção acaba, as duas saem juntas. No celular e no tablet, tudo empilha
 * na ordem normal (o fixo primeiro), sem nada preso.
 *
 * - lado: onde fica a coluna parada ("esquerda", padrão, ou "direita"). Colunas de 5/12 e 7/12, com 64 px entre elas.
 * - topo: onde a coluna para (padrão: logo abaixo do cabeçalho do site, com o espaço padrão abaixo dele,
 *   --altura-cabecalho + --espaco-abaixo-do-cabecalho), em px ou em CSS.
 * - É só CSS (position: sticky): nada de JavaScript, nada de layout que pula.
 *
 * Classes de CSS puro (páginas em HTML): .ds-secao-fixa (data-lado="direita") > .ds-secao-fixa-lado +
 * .ds-secao-fixa-conteudo. Mesma API no DS FindLook.
 */

export type SecaoFixaProps = Omit<React.ComponentProps<"section">, "children"> & {
  fixo: React.ReactNode;
  children: React.ReactNode;
  lado?: "esquerda" | "direita";
  topo?: number | string;
};

function SecaoFixa({ fixo, children, lado = "esquerda", topo, className, style, ...props }: SecaoFixaProps) {
  const vars = topo !== undefined ? { "--secao-fixa-topo": typeof topo === "number" ? `${topo}px` : topo } : {};
  return (
    <section
      data-slot="secao-fixa"
      data-lado={lado}
      className={cn("ds-secao-fixa", className)}
      style={{ ...vars, ...style } as React.CSSProperties}
      {...props}
    >
      <div className="ds-secao-fixa-lado">{fixo}</div>
      <div className="ds-secao-fixa-conteudo">{children}</div>
    </section>
  );
}

export { SecaoFixa };
