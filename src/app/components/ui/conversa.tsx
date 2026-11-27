"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertCircle, Check, CheckCheck, Clock } from "lucide-react";
import { cn } from "./utils";

/**
 * Conversa (histórico de mensagens em balões)
 *
 * A troca de mensagens entre duas partes, como a resposta por e-mail no Contato da área restrita e o convite da
 * simulação da Rede de Parceiros. As mensagens de quem usa o sistema ("eu") ficam no cinza de apoio (--secondary);
 * as da outra pessoa ("outro"), no card com borda. Nunca o rosa de selecionado nem a primária cheia: balão não é
 * botão nem seleção.
 * alinhamento: "esquerda" (padrão) põe todas as mensagens na mesma borda esquerda, como um histórico de e-mails:
 * quem escreveu aparece no nome e na cor do balão; "lados" põe as suas à direita, como num chat (use só em chat).
 *
 * Peças: Conversa (a lista, role="log"), BalaoDaConversa (uma mensagem: nome, texto, hora e o estado do envio em
 * ícone + texto para leitores de tela), SeparadorDaConversa ("Hoje", "24 de novembro") e IndicadorDeDigitacao
 * (três pontos que pulsam; parados com "menos movimento").
 * Alinhamento: o balão tem no máximo 80% da largura (85% no celular); nome e hora ficam dentro do balão, na mesma
 * borda do texto. O avatar (opcional) fica fora, na borda de baixo do balão.
 */

type Autor = "eu" | "outro";

const AlinhamentoDaConversa = React.createContext<"esquerda" | "lados">("esquerda");

function Conversa({ className, children, rotulo = "Conversa", alinhamento = "esquerda", ...props }: React.ComponentProps<"div"> & { rotulo?: string; alinhamento?: "esquerda" | "lados" }) {
  return (
    <AlinhamentoDaConversa.Provider value={alinhamento}>
      <div role="log" aria-label={rotulo} data-slot="conversa" data-alinhamento={alinhamento} className={cn("flex flex-col gap-3", className)} {...props}>
        {children}
      </div>
    </AlinhamentoDaConversa.Provider>
  );
}

const ESTADOS = {
  enviando: { Icone: Clock, texto: "Enviando" },
  enviada: { Icone: Check, texto: "Enviada" },
  lida: { Icone: CheckCheck, texto: "Lida" },
  erro: { Icone: AlertCircle, texto: "Não enviada" },
} as const;

export type BalaoDaConversaProps = Omit<React.ComponentProps<"div">, "children"> & {
  autor: Autor;
  nome?: React.ReactNode;
  quando?: React.ReactNode;
  avatar?: React.ReactNode;
  estado?: keyof typeof ESTADOS;
  /** Anexos ou ações depois do texto (UploadList, botões). */
  depois?: React.ReactNode;
  children: React.ReactNode;
};

function BalaoDaConversa({ autor, nome, quando, avatar, estado, depois, children, className, ...props }: BalaoDaConversaProps) {
  const reduzir = useReducedMotion();
  const eu = autor === "eu";
  const alinhamento = React.useContext(AlinhamentoDaConversa);
  const aDireita = eu && alinhamento === "lados";
  const est = estado ? ESTADOS[estado] : null;
  return (
    <motion.div
      data-slot="balao-da-conversa"
      data-autor={autor}
      initial={reduzir ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.58, 1] }}
      className={cn("flex items-end gap-2", aDireita ? "flex-row-reverse" : "flex-row", className)}
      {...(props as object)}
    >
      {avatar && <span className="shrink-0">{avatar}</span>}
      <div
        className={cn(
          "min-w-0 max-w-[85%] rounded-lg px-4 py-3 text-body-sm leading-relaxed sm:max-w-[80%]",
          eu ? "bg-secondary text-secondary-foreground" : "border border-border bg-card text-card-foreground",
          aDireita ? "rounded-br-sm" : "rounded-bl-sm",
        )}
      >
        {nome && <p className="mb-1 text-label font-semibold text-foreground">{nome}</p>}
        <div className="whitespace-pre-line [overflow-wrap:anywhere]">{children}</div>
        {depois && <div className="mt-3">{depois}</div>}
        {(quando || est) && (
          <p className="mt-2 flex items-center gap-1 text-label text-muted-foreground">
            {quando}
            {est && (
              <span className={cn("inline-flex items-center gap-1", estado === "erro" && "font-semibold text-error-text")}>
                <est.Icone aria-hidden className="size-3.5" />
                <span className={estado === "erro" ? undefined : "sr-only"}>{est.texto}</span>
              </span>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SeparadorDaConversa({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-slot="separador-da-conversa" role="separator" aria-label={typeof children === "string" ? children : undefined} className={cn("my-2 flex items-center gap-3 text-label font-medium text-muted-foreground", className)}>
      <span aria-hidden className="h-px flex-1 bg-border" />
      <span aria-hidden>{children}</span>
      <span aria-hidden className="h-px flex-1 bg-border" />
    </div>
  );
}

function IndicadorDeDigitacao({ autor = "outro", avatar, rotulo = "Digitando", className }: { autor?: Autor; avatar?: React.ReactNode; rotulo?: string; className?: string }) {
  const alinhamento = React.useContext(AlinhamentoDaConversa);
  const aDireita = autor === "eu" && alinhamento === "lados";
  return (
    <div data-slot="indicador-de-digitacao" role="status" className={cn("flex items-end gap-2", aDireita ? "flex-row-reverse" : "flex-row", className)}>
      {avatar && <span className="shrink-0">{avatar}</span>}
      <span className={cn("inline-flex h-10 items-center gap-1 rounded-lg px-4", autor === "eu" ? "bg-secondary" : "border border-border bg-card", aDireita ? "rounded-br-sm" : "rounded-bl-sm")}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            aria-hidden
            className="size-2 rounded-full bg-muted-foreground motion-safe:animate-pulse"
            style={{ animationDelay: `${i * 180}ms` }}
          />
        ))}
        <span className="sr-only">{rotulo}</span>
      </span>
    </div>
  );
}

export { Conversa, BalaoDaConversa, SeparadorDaConversa, IndicadorDeDigitacao };
