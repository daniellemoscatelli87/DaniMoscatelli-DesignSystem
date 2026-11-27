"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "./utils";

/**
 * CampoDeBusca (buscar numa lista): mesma API nos dois DS (FindLook e Dani Moscatelli, 27/11/2026).
 * O campo de busca das listas e tabelas (parceiros, pesquisas, contatos): lupa à esquerda, o texto e o
 * botão Limpar (×) quando há texto, que devolve o foco ao campo. Enter não envia formulário; Esc limpa. Para
 * buscar no sistema inteiro, use o CampoDeBuscaGlobal do painel.
 *
 * - role="searchbox" e nome acessível (`rotulo`, que também vira o texto de exemplo se você não passar outro).
 * - `resultados`: quantos itens a busca achou, anunciados ("12 resultados") numa região aria-live.
 * - `atraso` (ms, padrão 0): espera a pessoa parar de digitar antes de chamar onBusca (onValorChange é imediato).
 * - `rotuloVisivel` mostra o rótulo em cima do campo (sem ele, o rótulo fica só para leitores de tela).
 * - 44 px no toque e 40 px no computador; Limpar com 44 px no toque.
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
  /** O rótulo visível em cima do campo. */
  rotuloVisivel?: boolean;
};

function CampoDeBusca({ valor, onValorChange, onBusca, atraso = 0, rotulo = "Buscar", resultados, textos, rotuloVisivel = false, placeholder, className, id: idProp, ...props }: CampoDeBuscaProps) {
  const tx = { limpar: "Limpar busca", resultado: "resultado", resultados: "resultados", nenhum: "Nenhum resultado", ...textos };
  const autoId = React.useId();
  const id = idProp ?? autoId;
  React.useEffect(() => {
    if (!onBusca) return;
    const t = window.setTimeout(() => onBusca(valor), atraso);
    return () => window.clearTimeout(t);
  }, [valor, atraso, onBusca]);
  const anuncio = resultados === undefined || !valor ? "" : resultados === 0 ? tx.nenhum : `${resultados} ${resultados === 1 ? tx.resultado : tx.resultados}`;
  return (
    <div data-slot="campo-de-busca" className={cn("w-full min-w-0", rotuloVisivel && "space-y-2", className)}>
      {rotuloVisivel && <label htmlFor={id} className="block text-body-sm font-semibold text-foreground">{rotulo}</label>}
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type="search"
          role="searchbox"
          aria-label={rotuloVisivel ? undefined : rotulo}
          placeholder={placeholder ?? rotulo}
          value={valor}
          autoComplete="off"
          onChange={(e) => onValorChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && valor) { e.preventDefault(); onValorChange(""); }
            if (e.key === "Enter") e.preventDefault();
          }}
          className={cn(
            "flex h-10 w-full min-w-0 rounded-md border border-input bg-card pl-10 pr-11 text-body text-foreground transition-[color,box-shadow] outline-none placeholder:text-muted-foreground toque:h-11",
            "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
          {...props}
        />
        {valor && (
          <button
            type="button"
            aria-label={tx.limpar}
            onClick={() => { onValorChange(""); document.getElementById(id)?.focus(); }}
            className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring motion-safe:animate-in motion-safe:fade-in toque:size-11"
          >
            <X aria-hidden className="size-4" />
          </button>
        )}
      </div>
      <span className="sr-only" aria-live="polite">{anuncio}</span>
    </div>
  );
}

export { CampoDeBusca };
