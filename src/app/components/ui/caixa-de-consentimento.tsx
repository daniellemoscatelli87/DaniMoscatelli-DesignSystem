"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "./utils";
import { MensagemDeErro } from "./campo";

/**
 * CaixaDeConsentimento (28/11/2026, aprovada pela dona do produto; mesma API nos dois DS)
 *
 * Um "sim" de consentimento (receber avisos, aceitar os termos) num card que a pessoa marca inteiro: caixa de marcar
 * QUADRADA (22 px, cantos de 6 px), título e a frase legal, com os links do texto. Uma caixa de marcar nativa dentro
 * de um <label>: tocar em qualquer parte do card marca e desmarca (o card inteiro é o alvo de toque, bem acima de 44 px).
 *
 * Estados:
 * - desmarcado: card branco com borda neutra; com o mouse em cima, fundo cinza claro (hover nunca é rosa);
 * - marcado: fundo --primary-suave e borda --primary (a regra do selecionado), caixa cheia na primária com o check branco;
 * - foco pelo teclado: anel em volta do card;
 * - erro (prop erro): borda --error e a MensagemDeErro do DS embaixo (aria-invalid e aria-describedby no campo);
 * - desativado: mais claro e sem clique.
 *
 * Texto: titulo (16 px, seminegrito) e a frase (14 px, cinza escuro, 7:1 ou mais), em children (texto rico, numa linha
 * corrida) ou em paragrafos (uma lista; cada item começa numa linha nova, por exemplo a frase "Posso revogar…" depois de
 * "Política de Privacidade."). Os parágrafos são <span> em bloco, porque o card é um <label> (só aceita texto em linha).
 * Links do texto em --primary-text, seminegrito e sublinhados, sem quebra por dentro ("Política de Privacidade" não
 * fica com uma palavra sozinha na linha; use links curtos); clicar num link abre o link e não marca a caixa.
 *
 * Use caixa QUADRADA para um sim/não de consentimento; nunca um círculo (círculo é escolha entre opções, o rádio).
 */
export type CaixaDeConsentimentoProps = Omit<React.ComponentProps<"input">, "type" | "title" | "children"> & {
  titulo: React.ReactNode;
  /** A frase legal numa linha corrida: texto e links. */
  children?: React.ReactNode;
  /** A frase legal em partes: cada item começa numa linha nova (no lugar de children). */
  paragrafos?: React.ReactNode[];
  /** Mensagem de erro (por exemplo, "Marque para continuar."). */
  erro?: React.ReactNode;
  /** Chamado com o novo valor, além do onChange. */
  onCheckedChange?: (marcado: boolean) => void;
  /** Classe do bloco de fora (card e mensagem de erro). */
  className?: string;
};

const CaixaDeConsentimento = React.forwardRef<HTMLInputElement, CaixaDeConsentimentoProps>(function CaixaDeConsentimento(
  { titulo, children, paragrafos, erro, onCheckedChange, onChange, className, id: idProp, disabled, ...props },
  ref,
) {
  const gerado = React.useId();
  const id = idProp ?? `consentimento-${gerado}`;
  const tituloId = `${id}-titulo`;
  const textoId = `${id}-texto`;
  const erroId = `${id}-erro`;
  const texto = paragrafos?.length ? paragrafos.map((p, i) => <span key={i} className="block">{p}</span>) : children;
  const descritoPor = [texto ? textoId : null, erro ? erroId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div data-slot="caixa-de-consentimento" className={cn("grid min-w-0 gap-2", className)}>
      <label
        htmlFor={id}
        data-erro={erro ? "sim" : undefined}
        className={cn(
          "group/consentimento flex min-w-0 cursor-pointer items-start gap-4 rounded-lg border border-border bg-card p-4 text-left sm:p-5",
          "transition-[background-color,border-color,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none",
          "hover:bg-[var(--row-hover)]",
          "has-[input:checked]:border-primary has-[input:checked]:bg-[var(--primary-suave)] has-[input:checked]:hover:bg-[var(--primary-suave)]",
          "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
          "data-[erro=sim]:border-error data-[erro=sim]:has-[input:checked]:border-error",
          disabled && "cursor-not-allowed opacity-50 hover:bg-card",
        )}
      >
        <span className="relative mt-px flex size-5.5 shrink-0">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            disabled={disabled}
            aria-labelledby={tituloId}
            aria-describedby={descritoPor}
            aria-invalid={erro ? true : undefined}
            onChange={(e) => {
              onChange?.(e);
              onCheckedChange?.(e.currentTarget.checked);
            }}
            className="peer absolute inset-0 m-0 size-full cursor-[inherit] appearance-none rounded-xs outline-none"
            {...props}
          />
          <span
            aria-hidden
            data-slot="caixa-de-consentimento-caixa"
            className={cn(
              "pointer-events-none flex size-5.5 items-center justify-center rounded-xs border-[1.5px] border-input bg-input-background text-primary-foreground",
              "transition-colors duration-[var(--duration-fast)] motion-reduce:transition-none",
              "peer-checked:border-primary peer-checked:bg-primary",
              "group-data-[erro=sim]/consentimento:border-error group-data-[erro=sim]/consentimento:peer-checked:border-primary",
            )}
          >
            <CheckIcon
              strokeWidth={3}
              className="size-3.5 scale-50 opacity-0 transition-[opacity,transform] duration-[var(--duration-fast)] ease-[var(--ease-back)] group-has-[input:checked]/consentimento:scale-100 group-has-[input:checked]/consentimento:opacity-100 motion-reduce:transition-none"
            />
          </span>
        </span>
        <span className="min-w-0">
          <span id={tituloId} className="block text-body font-semibold leading-snug text-foreground text-pretty">{titulo}</span>
          {texto && (
            <span
              id={textoId}
              className={cn(
                "mt-1 block space-y-1 text-body-sm leading-[1.55] text-graphite-600 text-pretty dark:text-muted-foreground",
                "[&_a]:whitespace-nowrap [&_a]:rounded-sm [&_a]:font-semibold [&_a]:text-primary-text [&_a]:underline [&_a]:underline-offset-4 [&_a]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring",
              )}
            >
              {texto}
            </span>
          )}
        </span>
      </label>
      {erro && <MensagemDeErro id={erroId}>{erro}</MensagemDeErro>}
    </div>
  );
});

export { CaixaDeConsentimento };
