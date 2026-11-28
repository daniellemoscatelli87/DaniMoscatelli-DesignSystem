"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, LoaderCircle, RotateCcw } from "lucide-react";
import { cn } from "./utils";
import { Button, classeDoCarregando } from "./button";

/**
 * BotaoDeEnvio (botão com os estados de envio)
 *
 * O Button do DS com o retorno de cada envio, sem mudar de tamanho: parado → "Enviando…" (girando) → "Enviado" com
 * check → volta sozinho ao estado parado; ou "Tentar de novo" quando falha. Veio do formulário "Notificar
 * lançamento" da página inicial e dos botões "Enviar"/"Salvar" da área restrita, que pintavam os estados à mão
 * (verde solto, #16a34a).
 *
 * estado: "parado" | "enviando" | "feito" | "erro". Em "enviando" o botão fica ocupado como o Button carregando
 * (28/11/2026): na cor de sempre, um pouco esmaecido, aria-busy e aria-disabled, sem receber clique (nunca o cinza
 * de desabilitado, que quer dizer "não disponível");
 * em "feito" fica no verde de sucesso (--success, texto branco 4,5:1) com o check; `voltarApos` (ms, padrão 2400)
 * chama onVoltar para o produto trocar o estado para "parado". Em "erro", o texto vira `textos.erro` e o clique
 * tenta de novo. A largura fica fixa na maior das quatro mensagens (nada pula na linha).
 * O anúncio para leitores de tela sai numa região aria-live dentro do botão. Movimento só com "menos movimento"
 * desligado.
 */

export type EstadoDoEnvio = "parado" | "enviando" | "feito" | "erro";

export type BotaoDeEnvioProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  estado?: EstadoDoEnvio;
  children: React.ReactNode;
  textos?: { enviando?: string; feito?: string; erro?: string };
  /** Ícone do estado parado (por exemplo, Send). */
  icone?: React.ReactNode;
  voltarApos?: number;
  onVoltar?: () => void;
};

function BotaoDeEnvio({ estado = "parado", children, textos, icone, voltarApos = 2400, onVoltar, className, variant, onClick, ...props }: BotaoDeEnvioProps) {
  const tx = { enviando: "Enviando…", feito: "Enviado", erro: "Tentar de novo", ...textos };
  const reduzir = useReducedMotion();
  React.useEffect(() => {
    if (estado !== "feito" || !onVoltar) return;
    const t = window.setTimeout(onVoltar, voltarApos);
    return () => window.clearTimeout(t);
  }, [estado, onVoltar, voltarApos]);

  const conteudo: Record<EstadoDoEnvio, React.ReactNode> = {
    parado: <>{icone}{children}</>,
    enviando: <><LoaderCircle aria-hidden className="motion-safe:animate-spin" />{tx.enviando}</>,
    feito: <><Check aria-hidden />{tx.feito}</>,
    erro: <><RotateCcw aria-hidden />{tx.erro}</>,
  };
  const anuncio = estado === "enviando" ? tx.enviando : estado === "feito" ? tx.feito : "";

  return (
    <Button
      data-slot="botao-de-envio"
      data-estado={estado}
      aria-busy={estado === "enviando" || undefined}
      aria-disabled={estado === "enviando" || undefined}
      onClick={estado === "enviando" ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault() : onClick}
      variant={variant}
      className={cn(
        "relative grid place-items-center [grid-template-areas:'x'] *:[grid-area:x]",
        // Ocupado: o mesmo estado do Button carregando (cor da variante a 80%, sem clique), nunca o cinza de desabilitado.
        estado === "enviando" && classeDoCarregando,
        estado === "feito" && "bg-success text-success-foreground hover:bg-success",
        className,
      )}
      {...props}
    >
      {/* Medidas invisíveis: a largura do botão é a da maior mensagem */}
      {(Object.keys(conteudo) as EstadoDoEnvio[]).map(k => (
        <span key={k} aria-hidden className="invisible inline-flex items-center gap-2">{conteudo[k]}</span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={estado}
          className="inline-flex items-center gap-2"
          initial={reduzir ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduzir ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0, 0, 0.58, 1] }}
        >
          {conteudo[estado]}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite">{anuncio}</span>
    </Button>
  );
}

export { BotaoDeEnvio };
