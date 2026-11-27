"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "./utils";

/**
 * CampoDeBusca (buscar numa lista)
 *
 * O campo de busca das listas e tabelas (parceiros, pesquisas, contatos): lupa à esquerda, o texto, e o botão Limpar
 * (×) quando há texto. Enter não envia formulário; Esc limpa. Veio da busca da área restrita (`filters`/`search`
 * feitos à mão). Para buscar no sistema inteiro, use o CampoDeBuscaGlobal do painel.
 *
 * - role="searchbox" e nome acessível (rotulo, que também vira o placeholder se você não passar outro).
 * - `resultados`: quantos itens a busca achou, anunciados ("12 resultados") numa região aria-live.
 * - `atraso` (ms, padrão 0): espera a pessoa parar de digitar antes de chamar onBusca (onValorChange é imediato).
 * - Altura do Input: 44 px no celular, 40 px no computador; Limpar com 44/32 px.
 */

export type CampoDeBuscaProps = Omit<React.ComponentProps<"input">, "value" | "onChange" | "type"> & {
  valor: string;
  onValorChange: (valor: string) => void;
  /** Chamado com o texto depois do atraso (para buscar no servidor). */
  onBusca?: (valor: string) => void;
  atraso?: number;
  rotulo?: string;
  resultados?: number;
  textos?: { limpar?: string; resultado?: string; resultados?: string; nenhum?: string };
};

function CampoDeBusca({ valor, onValorChange, onBusca, atraso = 0, rotulo = "Buscar", resultados, textos, placeholder, className, ...props }: CampoDeBuscaProps) {
  const tx = { limpar: "Limpar busca", resultado: "resultado", resultados: "resultados", nenhum: "Nenhum resultado", ...textos };
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (!onBusca) return;
    const t = window.setTimeout(() => onBusca(valor), atraso);
    return () => window.clearTimeout(t);
  }, [valor, atraso, onBusca]);
  const anuncio = resultados === undefined || !valor ? "" : resultados === 0 ? tx.nenhum : `${resultados} ${resultados === 1 ? tx.resultado : tx.resultados}`;
  return (
    <div data-slot="campo-de-busca" className={cn("relative w-full", className)}>
      <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={ref}
        type="search"
        role="searchbox"
        aria-label={rotulo}
        placeholder={placeholder ?? rotulo}
        value={valor}
        onChange={e => onValorChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape" && valor) { e.preventDefault(); onValorChange(""); }
          if (e.key === "Enter") e.preventDefault();
        }}
        className={cn(
          "flex h-11 w-full min-w-0 rounded-md border border-input bg-input-background pl-10 pr-12 text-base transition-[color,box-shadow] outline-none placeholder:text-muted-foreground sm:h-10 sm:pr-10",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
        {...props}
      />
      {valor && (
        <button
          type="button"
          aria-label={tx.limpar}
          onClick={() => { onValorChange(""); ref.current?.focus(); }}
          className="absolute right-0 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:right-1 sm:size-8 sm:hover:bg-accent motion-safe:animate-in motion-safe:fade-in"
        >
          <X aria-hidden className="size-4" />
        </button>
      )}
      <span className="sr-only" aria-live="polite">{anuncio}</span>
    </div>
  );
}

export { CampoDeBusca };
