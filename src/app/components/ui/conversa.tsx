"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, CheckCheck, Clock, Eye, MousePointerClick, XCircle } from "lucide-react";
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
 * Peças: Conversa (a lista, role="log"), BalaoDaConversa (uma mensagem: nome, texto, hora, anexos em `depois`, a
 * marca de não lida e o estado do envio em ícone + texto: enviando, enviada, lida, aberto, clicado, não enviada), SeparadorDaConversa ("Hoje", "24 de novembro") e IndicadorDeDigitacao
 * (três pontos que pulsam; parados com "menos movimento").
 * Também: `rolagem` (a Conversa vira uma área com rolagem própria), `citacao` e `imagem` no balão e `texto`/`icone` no
 * IndicadorDeDigitacao (um balão de etapa no lugar dos pontos): mesmas props do DS FindLook (27/11/2026).
 * Alinhamento: o balão tem no máximo 80% da largura (85% no celular); nome e hora ficam dentro do balão, na mesma
 * borda do texto. O avatar (opcional) fica fora, na borda de baixo do balão.
 */

type Autor = "eu" | "outro";

const AlinhamentoDaConversa = React.createContext<"esquerda" | "lados">("esquerda");

export type ConversaProps = React.ComponentProps<"div"> & {
  rotulo?: string;
  /** "esquerda" (padrão): todas na mesma borda, como um histórico; "lados": as suas à direita, como num chat. */
  alinhamento?: "esquerda" | "lados";
  /** Área com rolagem própria (por exemplo, dentro de uma moldura de celular), fundo cinza e rolagem até a última mensagem. */
  rolagem?: boolean;
};

function Conversa({ className, children, rotulo = "Conversa", alinhamento = "esquerda", rolagem = false, ...props }: ConversaProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !rolagem) return;
    const menos = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: menos ? "auto" : "smooth" });
  }, [children, rolagem]);
  return (
    <AlinhamentoDaConversa.Provider value={alinhamento}>
      <div
        ref={ref}
        role="log"
        aria-label={rotulo}
        data-slot="conversa"
        data-alinhamento={alinhamento}
        tabIndex={rolagem ? 0 : undefined}
        className={cn(
          "flex flex-col gap-3",
          rolagem && "min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted px-3 py-4 [scrollbar-width:thin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </AlinhamentoDaConversa.Provider>
  );
}

/* Estado da mensagem enviada, sempre em ícone + texto visível (e-mail: aberto, clicado). */
const ESTADOS = {
  enviando: { Icone: Clock, texto: "Enviando" },
  enviada: { Icone: Check, texto: "Enviada" },
  lida: { Icone: CheckCheck, texto: "Lida" },
  aberto: { Icone: Eye, texto: "Aberto" },
  clicado: { Icone: MousePointerClick, texto: "Clicado" },
  erro: { Icone: XCircle, texto: "Não enviada" },
} as const;

export type BalaoDaConversaProps = Omit<React.ComponentProps<"div">, "children"> & {
  autor: Autor;
  nome?: React.ReactNode;
  quando?: React.ReactNode;
  avatar?: React.ReactNode;
  estado?: keyof typeof ESTADOS;
  /** Troca o texto do estado (por exemplo, "Aberto 2 vezes"). */
  textoDoEstado?: string;
  /** Mensagem recebida que ainda não foi lida: ponto na primária e "Não lida" em texto. */
  naoLida?: boolean;
  /** Anexos ou ações depois do texto (UploadItem só leitura, botões). */
  depois?: React.ReactNode;
  /** A mensagem respondida, no topo do balão (texto e, opcional, a miniatura). */
  citacao?: { texto: string; imagem?: string };
  /** Foto enviada, antes do texto. */
  imagem?: { src: string; alt: string };
  children?: React.ReactNode;
};

function BalaoDaConversa({ autor, nome, quando, avatar, estado, textoDoEstado, naoLida, depois, citacao, imagem, children, className, ...props }: BalaoDaConversaProps) {
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
        {(nome || naoLida) && (
          <p className="mb-1 flex flex-wrap items-center gap-x-2 text-label font-semibold text-foreground">
            {nome}
            {naoLida && <span className="inline-flex items-center gap-1 text-primary-text"><span aria-hidden className="size-2 rounded-full bg-primary" />Não lida</span>}
          </p>
        )}
        {citacao && (
          <span className="mb-2 flex items-center gap-2 rounded-sm border-l-4 border-primary bg-card/60 py-1 pl-2 pr-1">
            <span className="min-w-0 flex-1"><span className="sr-only">Respondendo a: </span><span className="block truncate text-label font-semibold">{citacao.texto}</span></span>
            {citacao.imagem && <img src={citacao.imagem} alt="" className="size-9 shrink-0 rounded-sm object-cover" />}
          </span>
        )}
        {imagem && <img src={imagem.src} alt={imagem.alt} loading="lazy" className="mb-2 max-h-56 w-full rounded-md bg-muted object-cover" />}
        {children != null && <div className="whitespace-pre-line [overflow-wrap:anywhere]">{children}</div>}
        {depois && <div className="mt-3">{depois}</div>}
        {(quando || est) && (
          <p className="mt-2 flex items-center gap-1 text-label text-muted-foreground">
            {quando}
            {est && (
              <span className={cn("inline-flex items-center gap-1", estado === "erro" && "font-semibold text-error-text")}>
                <est.Icone aria-hidden className="size-3.5" />
                <span>{textoDoEstado ?? est.texto}</span>
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

function IndicadorDeDigitacao({ autor = "outro", avatar, rotulo = "Digitando", texto, icone, className }: {
  autor?: Autor; avatar?: React.ReactNode; rotulo?: string;
  /** Em vez dos pontos, um balão de etapa ("Procurando…") com o ícone pulsando. Mesma prop do DS FindLook. */
  texto?: string; icone?: React.ReactNode; className?: string;
}) {
  const alinhamento = React.useContext(AlinhamentoDaConversa);
  const aDireita = autor === "eu" && alinhamento === "lados";
  const balao = cn("inline-flex min-h-10 items-center gap-2 rounded-lg px-4", autor === "eu" ? "bg-secondary" : "border border-border bg-card", aDireita ? "rounded-br-sm" : "rounded-bl-sm");
  if (texto) {
    return (
      <div data-slot="indicador-de-digitacao" role="status" className={cn("flex items-end gap-2", aDireita ? "flex-row-reverse" : "flex-row", className)}>
        {avatar && <span className="shrink-0">{avatar}</span>}
        <span className={cn(balao, "max-w-[85%] py-2 text-body-sm text-foreground")}>
          {icone && <span aria-hidden className="inline-flex text-primary-text [&>svg]:size-4 [&>svg]:motion-safe:animate-pulse">{icone}</span>}
          <span key={texto} className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1">{texto}</span>
        </span>
      </div>
    );
  }
  return (
    <div data-slot="indicador-de-digitacao" role="status" className={cn("flex items-end gap-2", aDireita ? "flex-row-reverse" : "flex-row", className)}>
      {avatar && <span className="shrink-0">{avatar}</span>}
      <span className={cn(balao, "gap-1")}>
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
