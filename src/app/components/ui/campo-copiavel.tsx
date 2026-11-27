"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "./utils";

/**
 * CampoCopiavel (link ou código para copiar)
 *
 * Um valor só de leitura com o botão Copiar ao lado: o link de uma pesquisa para enviar, um código de convite, uma
 * chave pública. Veio das Pesquisas da área restrita (`pa-link-copiar`).
 *
 * - O valor fica num campo só de leitura (seleciona tudo ao receber o foco), na fonte do texto; links longos são
 *   encurtados com reticências no meio da largura, nunca rolam para o lado.
 * - Copiar: o botão vira "Copiado" com check por 2 s (anunciado para leitores de tela) e volta. Se o navegador não
 *   deixar copiar, o texto fica selecionado e o aviso diz "Selecionado: copie com Ctrl+C".
 * - Botão com 44 px no celular; no celular estreito (abaixo de 24rem do próprio campo) o botão desce para baixo do
 *   valor, na largura toda, alinhado à mesma borda.
 */

export type CampoCopiavelProps = {
  valor: string;
  /** Nome do campo para leitores de tela (e rótulo visível, se `mostrarRotulo`). */
  rotulo: string;
  mostrarRotulo?: boolean;
  textos?: { copiar?: string; copiado?: string; selecionado?: string };
  onCopiar?: (valor: string) => void;
  className?: string;
};

function CampoCopiavel({ valor, rotulo, mostrarRotulo = false, textos, onCopiar, className }: CampoCopiavelProps) {
  const tx = { copiar: "Copiar", copiado: "Copiado", selecionado: "Selecionado: copie com Ctrl+C", ...textos };
  const id = React.useId();
  const ref = React.useRef<HTMLInputElement>(null);
  const [estado, setEstado] = React.useState<"parado" | "copiado" | "selecionado">("parado");
  React.useEffect(() => {
    if (estado === "parado") return;
    const t = window.setTimeout(() => setEstado("parado"), 2000);
    return () => window.clearTimeout(t);
  }, [estado]);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setEstado("copiado");
      onCopiar?.(valor);
    } catch {
      ref.current?.select();
      setEstado("selecionado");
    }
  };
  return (
    <div data-slot="campo-copiavel" className={cn("@container/copiar min-w-0", className)}>
      <label htmlFor={id} className={mostrarRotulo ? "mb-2 block text-sm font-semibold text-foreground" : "sr-only"}>{rotulo}</label>
      <div className="flex flex-col gap-2 @min-[24rem]/copiar:flex-row">
        <input
          ref={ref}
          id={id}
          readOnly
          value={valor}
          onFocus={e => e.currentTarget.select()}
          className="h-11 min-w-0 flex-1 truncate rounded-md border border-input bg-muted px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring sm:h-10"
        />
        <button
          type="button"
          onClick={copiar}
          className={cn(
            "inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors duration-[var(--duration-fast)] sm:h-10",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            estado === "copiado" ? "border-[var(--success-text)] bg-success-muted text-success-text" : "border-[var(--border-strong)] bg-card text-foreground hover:bg-accent",
          )}
        >
          {estado === "copiado" ? <Check aria-hidden className="size-4 motion-safe:animate-in motion-safe:zoom-in-50" /> : <Copy aria-hidden className="size-4" />}
          {estado === "copiado" ? tx.copiado : tx.copiar}
        </button>
      </div>
      <p className="sr-only" aria-live="polite">{estado === "copiado" ? tx.copiado : estado === "selecionado" ? tx.selecionado : ""}</p>
      {estado === "selecionado" && <p className="mt-2 text-sm text-muted-foreground">{tx.selecionado}</p>}
    </div>
  );
}

export { CampoCopiavel };
