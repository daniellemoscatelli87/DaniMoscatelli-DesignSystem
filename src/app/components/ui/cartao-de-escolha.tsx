"use client";

import * as React from "react";

import { cn } from "./utils";
import { BrilhoDeSelecionado, molduraDoSelecionavel } from "./shine-border";
import { IconeComBase } from "./painel-dados";

/**
 * Cartão de escolha (CartaoDeEscolha, dentro de um GrupoDeCartoesDeEscolha): escolha única entre poucas opções
 * grandes, com ícone, título e uma linha de explicação. Trazido do FindLook Design System (27/11/2026), com o mesmo
 * nome e a mesma API; no DM, substitui os cartões selecionáveis feitos à mão (opções "não sei" do app EI, "Meu negócio
 * é…" da gaveta de contato do site).
 *
 * Quando usar: 2 a 4 opções que mudam o caminho da pessoa e precisam de uma frase de explicação. Para opções curtas
 * (uma ou duas palavras), use o Controle segmentado; para listas longas, o Select; para várias escolhas ao mesmo tempo,
 * Checkbox.
 *
 * Aparência: card com borda de 2 px; selecionado, a borda fica na primária com o brilho animado (BrilhoDeSelecionado;
 * parado com "menos movimento"), o fundo no rosa de selecionado (--primary-suave, regra dos rosas claros de 27/11/2026),
 * o ícone na base rosa (IconeComBase tom "marca") e o rádio à direita marcado. Não selecionado: borda neutra, fundo do
 * card e hover cinza, ícone na base cinza e rádio vazio. A seleção aparece na borda, no ícone e no rádio, nunca só na cor.
 *
 * Acessibilidade: cada cartão é o <label> de um rádio nativo do grupo (role="radiogroup", o mesmo `name`): o cartão
 * inteiro é o alvo de toque, as setas do teclado trocam a opção (comportamento do navegador), o nome lido é o título e a
 * explicação é a descrição. Dê um nome ao grupo com aria-labelledby (ou aria-label), por exemplo a legenda da pergunta.
 * No DM o rádio é nativo (no FindLook DS, o RadioGroup do Radix); a API é a mesma.
 */

type ContextoDoGrupo = { valor: string; mudar: (v: string) => void; nome: string; desabilitado?: boolean; obrigatorio?: boolean };
const ContextoDoGrupo = React.createContext<ContextoDoGrupo | null>(null);

type GrupoDeCartoesDeEscolhaProps = Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (valor: string) => void;
  /** 1 (padrão): um cartão por linha. 2: dois lado a lado quando o espaço do grupo tem 28 rem (448 px) ou mais. */
  colunas?: 1 | 2;
  /** Nome do grupo de rádios (padrão: um nome único). */
  name?: string;
  disabled?: boolean;
  required?: boolean;
};

function GrupoDeCartoesDeEscolha({ value, defaultValue, onValueChange, colunas = 1, name, disabled, required, className, children, ...props }: GrupoDeCartoesDeEscolhaProps) {
  const [interno, setInterno] = React.useState(defaultValue ?? "");
  const auto = React.useId();
  const valor = value ?? interno;
  const mudar = (v: string) => {
    if (value === undefined) setInterno(v);
    onValueChange?.(v);
  };
  return (
    <ContextoDoGrupo.Provider value={{ valor, mudar, nome: name ?? auto, desabilitado: disabled, obrigatorio: required }}>
      <div className="@container/escolha min-w-0">
        <div
          role="radiogroup"
          data-slot="grupo-de-cartoes-de-escolha"
          aria-required={required || undefined}
          aria-disabled={disabled || undefined}
          className={cn("grid gap-3", colunas === 2 && "@min-[28rem]/escolha:grid-cols-2", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </ContextoDoGrupo.Provider>
  );
}

type CartaoDeEscolhaProps = {
  /** Valor da opção (o value do rádio). */
  valor: string;
  titulo: React.ReactNode;
  /** Uma frase curta que explica a opção. */
  descricao?: React.ReactNode;
  /** Ícone lucide; vai na base cinza e passa para a base rosa quando o cartão é escolhido. */
  icone?: React.ReactNode;
  desabilitado?: boolean;
  /** id do rádio (para levar o foco a ele, por exemplo pelo resumo de erros). */
  id?: string;
  className?: string;
};

function CartaoDeEscolha({ valor, titulo, descricao, icone, desabilitado: desabilitadoProp = false, id, className }: CartaoDeEscolhaProps) {
  const grupo = React.useContext(ContextoDoGrupo);
  const auto = React.useId();
  const idDoRadio = id ?? `${auto}-radio`;
  const idDoTitulo = `${auto}-titulo`, idDaDescricao = `${auto}-descricao`;
  const selecionado = grupo?.valor === valor;
  const desabilitado = desabilitadoProp || !!grupo?.desabilitado;
  return (
    <label
      htmlFor={idDoRadio}
      data-slot="cartao-de-escolha"
      data-selecionado={selecionado || undefined}
      data-desabilitado={desabilitado || undefined}
      className={cn(
        "group/escolha relative flex h-full min-h-16 items-center gap-4 rounded-xl p-4",
        "transition-[border-color,background-color,scale] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-safe:active:scale-[0.995] motion-reduce:transition-none",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        desabilitado ? "cursor-not-allowed border-2 border-border bg-disabled motion-safe:active:scale-100" : cn("cursor-pointer", molduraDoSelecionavel(selecionado)),
        className,
      )}
    >
      {selecionado && !desabilitado && <BrilhoDeSelecionado />}
      {icone && (
        <IconeComBase tom={selecionado && !desabilitado ? "marca" : "neutro"} tamanho="md" className="transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none">
          {icone}
        </IconeComBase>
      )}
      <span className="min-w-0 flex-1">
        <span id={idDoTitulo} className={cn("block text-body font-semibold leading-snug text-balance", desabilitado ? "text-disabled-foreground" : "text-foreground")}>
          {titulo}
        </span>
        {descricao && (
          <span id={idDaDescricao} className={cn("mt-1 block text-body-sm text-pretty", desabilitado ? "text-disabled-foreground" : "text-muted-foreground")}>
            {descricao}
          </span>
        )}
      </span>
      {/* Rádio nativo à direita, longe do ícone: mostra que é uma escolha única e marca a opção sem mudar o tamanho de
          nada. O anel de foco é o do cartão inteiro. */}
      <input
        type="radio"
        id={idDoRadio}
        name={grupo?.nome}
        value={valor}
        checked={selecionado}
        disabled={desabilitado}
        required={grupo?.obrigatorio}
        onChange={() => grupo?.mudar(valor)}
        aria-labelledby={idDoTitulo}
        aria-describedby={descricao ? idDaDescricao : undefined}
        className={cn(
          "size-5 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-[var(--muted-foreground)] bg-card outline-none transition-[border-color,background-color] duration-[var(--duration-fast)]",
          "checked:border-primary checked:bg-[radial-gradient(circle,var(--primary)_0_40%,transparent_45%)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
    </label>
  );
}

export { GrupoDeCartoesDeEscolha, CartaoDeEscolha };
export type { GrupoDeCartoesDeEscolhaProps, CartaoDeEscolhaProps };
