"use client";

import * as React from "react";
import { cn } from "./utils";
import { MensagemDeErro } from "./campo";

/**
 * EscalaDeNotas e GrupoDeEscalas (uma nota numa escala numerada)
 *
 * Veio da pesquisa Moda em Curitiba (pergunta 4: Qualidade, Estética e Variedade, de 1 a 10). Serve a qualquer nota
 * curta: 1 a 10, 0 a 10 (NPS), 1 a 5. GrupoDeEscalas junta várias escalas num só card, separadas por divisor.
 *
 * - Aparência: botões numerados do mesmo tamanho (40 px no computador, 44 px no toque; cantos --radius-md, contorno
 *   --input). Pela largura do próprio bloco: estreito, metade dos números por linha (1 a 5 e 6 a 10); a partir de
 *   34 rem, todos numa linha. Embaixo, as pontas ("1 = Muito ruim" à esquerda, "10 = Excelente" à direita).
 * - Estados (regra dos rosas claros): escolhido no rosa de selecionado (--primary-suave), com a borda na primária e o
 *   número em --primary-text e negrito (nunca só a cor); hover cinza (--muted); foco com o anel do DS; erro com a borda
 *   de erro em todos os botões daquele aspecto e a MensagemDeErro embaixo; desabilitado.
 * - Acessibilidade: rádios nativos num grupo com o nome do aspecto (role="radiogroup"); as setas trocam a nota; o nome
 *   do primeiro e do último inclui a ponta ("1, Muito ruim", "10, Excelente").
 * - Movimento: só a troca de cor, com --duration-fast; nada com "menos movimento".
 */

export type EscalaDeNotasProps = {
  /** Nome do aspecto ("Qualidade"), visível em cima. */
  rotulo: string;
  /** Uma linha de explicação embaixo do nome. */
  descricao?: React.ReactNode;
  minimo?: number;
  maximo?: number;
  valor?: number | null;
  onValorChange?: (nota: number) => void;
  /** O que a menor nota quer dizer ("Muito ruim"). */
  rotuloMinimo?: string;
  /** O que a maior nota quer dizer ("Excelente"). */
  rotuloMaximo?: string;
  erro?: React.ReactNode;
  desabilitado?: boolean;
  /** Nome dos rádios no formulário (padrão: um nome gerado). */
  name?: string;
  obrigatorio?: boolean;
  className?: string;
};

function EscalaDeNotas({
  rotulo, descricao, minimo = 1, maximo = 10, valor = null, onValorChange, rotuloMinimo, rotuloMaximo, erro, desabilitado = false, name, obrigatorio = false, className,
}: EscalaDeNotasProps) {
  const id = React.useId();
  const notas = Array.from({ length: Math.max(0, maximo - minimo + 1) }, (_, i) => minimo + i);
  const porLinha = Math.ceil(notas.length / 2);
  return (
    <div data-slot="escala-de-notas" className={cn("@container/notas grid min-w-0 gap-3", className)}>
      <div>
        <p id={`${id}-rotulo`} className="m-0 text-body font-semibold leading-snug text-foreground">
          {rotulo}
          {obrigatorio && <span aria-hidden className="text-primary-text"> *</span>}
        </p>
        {descricao && <p id={`${id}-descricao`} className="m-0 mt-1 text-body-sm leading-5 text-muted-foreground">{descricao}</p>}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={`${id}-rotulo`}
        aria-describedby={[descricao ? `${id}-descricao` : null, erro ? `${id}-erro` : null].filter(Boolean).join(" ") || undefined}
        aria-required={obrigatorio || undefined}
        aria-invalid={erro ? true : undefined}
        className="grid gap-2 [grid-template-columns:repeat(var(--por-linha),minmax(0,1fr))] @min-[34rem]/notas:[grid-template-columns:repeat(var(--todas),minmax(0,1fr))]"
        style={{ "--por-linha": porLinha, "--todas": notas.length } as React.CSSProperties}
      >
        {notas.map((n, i) => {
          const ponta = i === 0 ? rotuloMinimo : i === notas.length - 1 ? rotuloMaximo : undefined;
          return (
            <label key={n} className={cn("relative block", desabilitado ? "cursor-not-allowed" : "cursor-pointer")}>
              <input
                type="radio"
                name={name ?? `${id}-nota`}
                value={n}
                checked={valor === n}
                disabled={desabilitado}
                required={obrigatorio && i === 0}
                aria-label={ponta ? `${n}, ${ponta}` : String(n)}
                onChange={() => onValorChange?.(n)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-md border bg-card text-body font-semibold tabular-nums text-foreground toque:h-11",
                  "transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none",
                  erro ? "border-error" : "border-input",
                  "hover:bg-muted peer-checked:border-2 peer-checked:border-primary peer-checked:bg-primary-suave peer-checked:font-bold peer-checked:text-primary-text",
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
                  "peer-disabled:border-[var(--border-strong)] peer-disabled:bg-disabled peer-disabled:text-disabled-foreground peer-disabled:hover:bg-disabled",
                )}
              >
                {n}
              </span>
            </label>
          );
        })}
      </div>
      {(rotuloMinimo || rotuloMaximo) && (
        <p aria-hidden className="m-0 flex justify-between gap-4 text-label text-muted-foreground">
          <span>{rotuloMinimo && `${minimo} = ${rotuloMinimo}`}</span>
          <span className="text-right">{rotuloMaximo && `${maximo} = ${rotuloMaximo}`}</span>
        </p>
      )}
      {erro && <MensagemDeErro id={`${id}-erro`}>{erro}</MensagemDeErro>}
    </div>
  );
}

/** Várias escalas num só card, separadas por divisor (como os três aspectos da pesquisa). */
function GrupoDeEscalas({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="grupo-de-escalas"
      className={cn("grid gap-6 rounded-xl border border-border bg-card p-4 sm:p-6 [&>*+*]:border-t [&>*+*]:border-border [&>*+*]:pt-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { EscalaDeNotas, GrupoDeEscalas };
