"use client";

import * as React from "react";
import { cn } from "./utils";
import { Campo, type CampoProps } from "./campo";

/**
 * CampoDeEmail (e-mail com sugestão de domínio)
 *
 * O Campo de e-mail com as sugestões do site: enquanto a pessoa digita "ana@gm", aparecem botões "ana@gmail.com",
 * "ana@…" com os domínios mais comuns no Brasil; um toque completa o e-mail. Veio da gaveta de contato do site
 * (src/compartilhado/menu.ts, sugerirEmail) e do app EI (campos.tsx, CampoEmail), que tinham duas cópias.
 *
 * - Sugestões só com o campo em foco, no máximo 4, numa linha que quebra (nunca rola para o lado), alinhadas à borda
 *   do campo. Cada uma é um botão de 44 px de altura no celular (36 px no computador), contorno neutro e hover cinza.
 * - A lista é anunciada ("3 sugestões de e-mail") numa região aria-live; Tab passa pelas sugestões antes do próximo
 *   campo. Escolher uma devolve o foco ao campo.
 * - type="email", inputMode="email" e autoComplete="email" por padrão (teclado certo no celular).
 * Controlado: `valor` e `onValorChange`; o resto das props é do Campo (rotulo, ajuda, erro, obrigatorio…).
 */

export const DOMINIOS_COMUNS = ["gmail.com", "outlook.com", "hotmail.com", "icloud.com", "yahoo.com.br", "live.com", "uol.com.br", "terra.com.br"];

/** As sugestões para o que já foi digitado (no máximo 4). */
export function sugestoesDeEmail(valor: string, dominios = DOMINIOS_COMUNS) {
  const v = valor.trim();
  const arroba = v.indexOf("@");
  const usuario = arroba < 0 ? v : v.slice(0, arroba);
  const dominio = arroba < 0 ? "" : v.slice(arroba + 1).toLowerCase();
  if (!usuario || /\s/.test(usuario)) return [];
  return dominios.filter(d => d.startsWith(dominio) && d !== dominio).slice(0, 4).map(d => `${usuario}@${d}`);
}

export type CampoDeEmailProps = Omit<CampoProps, "value" | "onChange" | "children" | "depois"> & {
  valor: string;
  onValorChange: (valor: string) => void;
  dominios?: string[];
  textos?: { sugestoes?: string; sugestao?: string };
};

function CampoDeEmail({ valor, onValorChange, dominios, textos, onFocus, onBlur, placeholder = "nome@exemplo.com", ...props }: CampoDeEmailProps) {
  const tx = { sugestoes: "sugestões de e-mail", sugestao: "sugestão de e-mail", ...textos };
  const [emFoco, setEmFoco] = React.useState(false);
  const blocoRef = React.useRef<HTMLDivElement>(null);
  // O Input do DS não repassa ref (React 18): o campo é achado dentro do bloco.
  const focarCampo = () => blocoRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  const opcoes = emFoco ? sugestoesDeEmail(valor, dominios) : [];

  return (
    <div
      ref={blocoRef}
      onFocus={() => setEmFoco(true)}
      onBlur={e => { if (!blocoRef.current?.contains(e.relatedTarget as Node)) setEmFoco(false); }}
    >
      <Campo
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder={placeholder}
        value={valor}
        onChange={e => onValorChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        depois={
          <>
            <span className="sr-only" aria-live="polite">{opcoes.length ? `${opcoes.length} ${opcoes.length === 1 ? tx.sugestao : tx.sugestoes}` : ""}</span>
            {opcoes.length > 0 && (
              <div data-slot="sugestoes-de-email" className="flex flex-wrap gap-2 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1">
                {opcoes.map(o => (
                  <button
                    key={o}
                    type="button"
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { onValorChange(o); setEmFoco(false); focarCampo(); }}
                    className={cn(
                      "inline-flex min-h-11 max-w-full items-center rounded-full border border-[var(--border-strong)] bg-card px-4 text-sm font-medium text-foreground transition-colors sm:min-h-9 sm:px-3",
                      "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    <span className="truncate">{o}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        }
        {...props}
      />
    </div>
  );
}

export { CampoDeEmail };
