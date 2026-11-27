"use client";

import * as React from "react";

import { cn } from "./utils";
import { Card } from "./card";
import { RadioGroup, RadioGroupItem } from "./radio-group";
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
 * Aparência (a do card selecionável do design system, Cards › Estados): card branco com borda de 2 px; selecionado,
 * a borda fica na primária com o brilho animado (BrilhoDeSelecionado; parado com "menos movimento"), o ícone fica na
 * base rosa (IconeComBase tom "marca"), o fundo fica no rosa de selecionado (--primary-suave, regra dos rosas claros de
 * 27/11/2026) e o rádio à direita fica marcado. Não selecionado: borda neutra, fundo do card e hover cinza, ícone na
 * base cinza e rádio vazio. A seleção aparece na borda, no ícone e no rádio, nunca só na cor.
 *
 * Acessibilidade: é um grupo de rádios de verdade (RadioGroup do design system). O cartão inteiro é o rótulo do rádio
 * (clicar em qualquer ponto escolhe), as setas do teclado trocam a opção, o nome lido é o título e a explicação é a
 * descrição. Dê um nome ao grupo com aria-labelledby (ou aria-label), por exemplo a legenda da pergunta.
 */

const ValorDoGrupo = React.createContext<string | null>(null);

type GrupoDeCartoesDeEscolhaProps = Omit<React.ComponentProps<typeof RadioGroup>, "value" | "defaultValue" | "onValueChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (valor: string) => void;
  /** 1 (padrão): um cartão por linha. 2: dois lado a lado quando o espaço do grupo tem 28 rem (448 px) ou mais. */
  colunas?: 1 | 2;
};

function GrupoDeCartoesDeEscolha({ value, defaultValue, onValueChange, colunas = 1, className, ...props }: GrupoDeCartoesDeEscolhaProps) {
  const [interno, setInterno] = React.useState(defaultValue ?? "");
  const valor = value ?? interno;
  const mudar = (v: string) => {
    if (value === undefined) setInterno(v);
    onValueChange?.(v);
  };
  return (
    <ValorDoGrupo.Provider value={valor}>
      <div className="@container/escolha min-w-0">
        <RadioGroup
          data-slot="grupo-de-cartoes-de-escolha"
          value={valor}
          onValueChange={mudar}
          className={cn("grid gap-3", colunas === 2 && "@min-[28rem]/escolha:grid-cols-2", className)}
          {...props}
        />
      </div>
    </ValorDoGrupo.Provider>
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

function CartaoDeEscolha({ valor, titulo, descricao, icone, desabilitado = false, id, className }: CartaoDeEscolhaProps) {
  const auto = React.useId();
  const idDoRadio = id ?? `${auto}-radio`;
  const idDoTitulo = `${auto}-titulo`, idDaDescricao = `${auto}-descricao`;
  const selecionado = React.useContext(ValorDoGrupo) === valor;
  return (
    <label
      htmlFor={idDoRadio}
      data-slot="cartao-de-escolha"
      data-selecionado={selecionado || undefined}
      data-desabilitado={desabilitado || undefined}
      className={cn("group/escolha block h-full", desabilitado ? "cursor-not-allowed" : "cursor-pointer", className)}
    >
      <Card
        orientacao="vertical"
        className={cn(
          "relative h-full min-h-16 flex-row items-center gap-4 p-4",
          "transition-[border-color,box-shadow,scale] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-safe:active:scale-[0.995] motion-reduce:transition-none",
          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
          desabilitado ? "border-2 border-border bg-disabled motion-safe:active:scale-100" : molduraDoSelecionavel(selecionado),
        )}
      >
        {selecionado && !desabilitado && <BrilhoDeSelecionado />}
        {icone && (
          <IconeComBase tom={selecionado && !desabilitado ? "marca" : "neutro"} tamanho="md" className="transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none">
            {icone}
          </IconeComBase>
        )}
        <span className="min-w-0 flex-1">
          <span id={idDoTitulo} className={cn("block text-base font-semibold leading-snug text-balance", desabilitado ? "text-disabled-foreground" : "text-foreground")}>
            {titulo}
          </span>
          {descricao && (
            <span id={idDaDescricao} className={cn("mt-1 block text-sm text-pretty", desabilitado ? "text-disabled-foreground" : "text-muted-foreground")}>
              {descricao}
            </span>
          )}
        </span>
        {/* O rádio fica à direita, longe do ícone: mostra que é uma escolha única antes de escolher e marca a opção
            escolhida sem mudar o tamanho de nada. O anel de foco é o do cartão inteiro. */}
        <RadioGroupItem
          value={valor}
          id={idDoRadio}
          disabled={desabilitado}
          aria-labelledby={idDoTitulo}
          aria-describedby={descricao ? idDaDescricao : undefined}
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </Card>
    </label>
  );
}

export { GrupoDeCartoesDeEscolha, CartaoDeEscolha };
export type { GrupoDeCartoesDeEscolhaProps, CartaoDeEscolhaProps };
