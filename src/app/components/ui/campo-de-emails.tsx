"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";
import { cn } from "./utils";

/**
 * CampoDeEmails (vários e-mails em etiquetas)
 *
 * Para (destinatários), Cc e Cco de um e-mail novo, convites para várias pessoas. Cada e-mail digitado vira uma
 * etiqueta quando a pessoa aperta Enter, vírgula, ponto e vírgula, espaço ou sai do campo; colar uma lista separa os
 * e-mails sozinho. Veio do "Novo e-mail" do Contato da área restrita (etiquetas `ne-tag` feitas à mão).
 *
 * - Etiqueta válida: cinza de apoio com o e-mail e o botão Remover (nome lido: "Remover ana@exemplo.com").
 * - Etiqueta com formato inválido: borda e texto de erro, ícone de alerta e "formato inválido" para leitores de tela;
 *   continua na lista para a pessoa corrigir (clique no texto devolve o e-mail ao campo para editar).
 * - Backspace com o campo vazio devolve a última etiqueta ao campo, para editar. Repetidos são ignorados.
 * - Mesma altura mínima e borda do Input (40 px no computador, 44 px no celular); as etiquetas quebram de linha
 *   dentro do campo, nunca rolam para o lado.
 * Controlado: `valor` (lista de e-mails) e `onValorChange`. Use com um Label (htmlFor = id).
 */

const FORMATO = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]{2,}$/;
const separar = (texto: string) => texto.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);

export type CampoDeEmailsProps = {
  id?: string;
  valor: string[];
  onValorChange: (emails: string[]) => void;
  placeholder?: string;
  /** Limite de e-mails (padrão: sem limite). */
  maximo?: number;
  desabilitado?: boolean;
  invalido?: boolean;
  "aria-describedby"?: string;
  textos?: { remover?: string; invalido?: string; editar?: string };
  className?: string;
};

function CampoDeEmails({ id, valor, onValorChange, placeholder = "nome@exemplo.com", maximo, desabilitado = false, invalido, textos, className, ...aria }: CampoDeEmailsProps) {
  const tx = { remover: "Remover", invalido: "formato inválido", editar: "Editar", ...textos };
  const [texto, setTexto] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const cheio = maximo !== undefined && valor.length >= maximo;

  const adicionar = (bruto: string) => {
    const novos = separar(bruto).filter(e => !valor.some(v => v.toLowerCase() === e.toLowerCase()));
    if (!novos.length) return;
    const lista = [...valor, ...novos];
    onValorChange(maximo ? lista.slice(0, maximo) : lista);
  };
  const remover = (email: string) => {
    onValorChange(valor.filter(v => v !== email));
    inputRef.current?.focus();
  };
  const editar = (email: string) => {
    onValorChange(valor.filter(v => v !== email));
    setTexto(email);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const algumInvalido = valor.some(v => !FORMATO.test(v));

  return (
    <div
      data-slot="campo-de-emails"
      onClick={() => inputRef.current?.focus()}
      aria-disabled={desabilitado || undefined}
      className={cn(
        "flex min-h-10 toque:min-h-11 w-full cursor-text flex-wrap items-center gap-2 rounded-md border border-input bg-input-background px-2 py-1 transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        (invalido || algumInvalido) && "border-destructive",
        desabilitado && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {valor.map(email => {
        const ok = FORMATO.test(email);
        return (
          <span
            key={email}
            data-valido={ok ? "sim" : "nao"}
            className={cn(
              "inline-flex min-h-8 toque:min-h-11 max-w-full items-center rounded-full pl-1 text-body-sm",
              ok ? "bg-secondary text-secondary-foreground" : "border border-[var(--error-text)] bg-card text-error-text",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-[var(--duration-fast)]",
            )}
          >
            <button
              type="button"
              disabled={desabilitado}
              onClick={e => { e.stopPropagation(); editar(email); }}
              className="inline-flex min-h-8 toque:min-h-11 min-w-0 items-center gap-1 rounded-full px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${tx.editar} ${email}${ok ? "" : ` (${tx.invalido})`}`}
            >
              {!ok && <AlertCircle aria-hidden className="size-4 shrink-0" />}
              <span className="truncate">{email}</span>
            </button>
            <button
              type="button"
              disabled={desabilitado}
              onClick={e => { e.stopPropagation(); remover(email); }}
              aria-label={`${tx.remover} ${email}`}
              className="flex size-8 toque:size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden className="size-4" />
            </button>
          </span>
        );
      })}
      <input
        ref={inputRef}
        id={id}
        type="email"
        inputMode="email"
        autoComplete="off"
        multiple
        disabled={desabilitado || cheio}
        value={texto}
        placeholder={valor.length ? undefined : placeholder}
        aria-invalid={invalido || algumInvalido || undefined}
        aria-describedby={aria["aria-describedby"]}
        onChange={e => {
          const v = e.target.value;
          if (/[,;\s]$/.test(v)) { adicionar(v); setTexto(""); } else setTexto(v);
        }}
        onKeyDown={e => {
          if (e.key === "Enter" && texto.trim()) { e.preventDefault(); adicionar(texto); setTexto(""); }
          if (e.key === "Backspace" && !texto && valor.length) { e.preventDefault(); editar(valor[valor.length - 1]); }
        }}
        onPaste={e => {
          const colado = e.clipboardData.getData("text");
          if (/[,;\s]/.test(colado.trim())) { e.preventDefault(); adicionar(texto + colado); setTexto(""); }
        }}
        onBlur={() => { if (texto.trim()) { adicionar(texto); setTexto(""); } }}
        className="h-8 toque:h-11 min-w-[10rem] flex-1 bg-transparent px-2 text-body outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed sm:text-body-sm"
      />
    </div>
  );
}

export { CampoDeEmails };
