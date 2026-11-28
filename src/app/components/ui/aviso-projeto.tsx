"use client";

import * as React from "react";
import { Lightbulb, X } from "lucide-react";
import { cn } from "./utils";

/**
 * AvisoProjeto (aviso flutuante "Tem um projeto?")
 *
 * Balão da página inicial do site (src/compartilhado/partes.ts e menu.ts) que aponta para o botão do WhatsApp e,
 * ao ser clicado, abre a conversa. Entra com um leve deslize 0,6 s depois de a página abrir e flutua 3 vezes;
 * sem animação para quem pede menos movimento (classe motion-safe:animate-aviso-projeto, com os keyframes no theme.css; sem
 * <style> dentro do componente, que quebrava a hidratação no servidor). Pode ser fechado no X e não volta mais na mesma sessão
 * (sessionStorage, chave "cta-contato-fechado"); também some quando a pessoa clica nele ou no botão do WhatsApp.
 *
 * posicao — "acima": em cima do botão do WhatsApp, com a seta apontando para baixo (computador, a partir de 1024 px).
 *           "ao-lado": à esquerda do botão, ocupando a largura que sobra, com a seta apontando para a direita
 *           (celular e tablet). "auto" (padrão): ao lado até 1023 px e acima a partir de 1024 px, como no site.
 * fixo    — false: position absolute, para demonstrações dentro de uma caixa.
 */

export type AvisoProjetoProps = {
  titulo?: string;
  texto?: string;
  /** Nome acessível da ação (inclui o destino). */
  rotuloAcao?: string;
  rotuloFechar?: string;
  /** Link da conversa (por exemplo, linkWhatsApp(...) de botao-whatsapp). Sem href, a ação é um botão (onAcao). */
  href?: string;
  onAcao?: () => void;
  onFechar?: () => void;
  posicao?: "auto" | "acima" | "ao-lado";
  fixo?: boolean;
  /** Guarda o fechamento na sessão. Desligue em demonstrações. */
  lembrarFechado?: boolean;
  animar?: boolean;
  className?: string;
};

const CHAVE = "cta-contato-fechado";


const POS = {
  acima: {
    caixa: "right-6 bottom-24 w-max max-w-[calc(100%-3rem)]",
    seta: "-bottom-[7px] right-[21px] rotate-[225deg]",
    botao: "gap-3 py-3 pl-4 pr-11",
    icone: "size-10",
    titulo: "text-sm sm:text-body",
    texto: "text-body-sm sm:text-sm",
  },
  "ao-lado": {
    caixa: "left-5 right-[5.5rem] bottom-5 flex min-h-14 items-center sm:left-6 sm:right-[5.75rem] sm:bottom-6",
    seta: "top-[calc(50%-7px)] -right-[7px] rotate-[135deg]",
    botao: "gap-2 py-2 pl-3 pr-10",
    icone: "size-8",
    titulo: "text-body-sm",
    texto: "text-xs",
  },
  auto: {
    caixa:
      "left-5 right-[5.5rem] bottom-5 flex min-h-14 items-center sm:left-6 sm:right-[5.75rem] sm:bottom-6 lg:left-auto lg:right-6 lg:bottom-24 lg:block lg:min-h-0 lg:w-max lg:max-w-[calc(100%-3rem)]",
    seta: "top-[calc(50%-7px)] -right-[7px] rotate-[135deg] lg:top-auto lg:-bottom-[7px] lg:right-[21px] lg:rotate-[225deg]",
    botao: "gap-2 py-2 pl-3 pr-10 lg:gap-3 lg:py-3 lg:pl-4 lg:pr-11",
    icone: "size-8 lg:size-10",
    titulo: "text-body-sm lg:text-body",
    texto: "text-xs lg:text-sm",
  },
};

function AvisoProjeto({
  titulo = "Tem um projeto?",
  texto = "Vamos conversar sobre ele.",
  rotuloAcao = "Tem um projeto? Conversar com a Dani no WhatsApp",
  rotuloFechar = "Fechar aviso",
  href,
  onAcao,
  onFechar,
  posicao = "auto",
  fixo = true,
  lembrarFechado = true,
  animar = true,
  className,
}: AvisoProjetoProps) {
  const [fechado, setFechado] = React.useState(false);
  React.useEffect(() => {
    if (!lembrarFechado) return;
    try { if (sessionStorage.getItem(CHAVE) === "1") setFechado(true); } catch { /* sem armazenamento */ }
  }, [lembrarFechado]);

  const esconder = () => {
    setFechado(true);
    if (lembrarFechado) { try { sessionStorage.setItem(CHAVE, "1"); } catch { /* sem armazenamento */ } }
    onFechar?.();
  };

  if (fechado) return null;
  const p = POS[posicao];
  const classeAcao = cn(
    "flex w-full cursor-pointer items-center rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    p.botao,
  );
  const conteudo = (
    <>
      <span aria-hidden className={cn("flex shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] text-[var(--primary-text)]", p.icone)}>
        <Lightbulb className="size-5" />
      </span>
      <span className="block">
        <span className={cn("block font-bold leading-snug text-foreground", p.titulo)}>{titulo}</span>
        <span className={cn("mt-1 block leading-relaxed text-muted-foreground", p.texto)}>{texto}</span>
      </span>
    </>
  );

  return (
    <div
      data-slot="aviso-projeto"
      data-animar={animar ? "sim" : "nao"}
      className={cn("z-[44] font-sans", animar && "motion-safe:animate-aviso-projeto", fixo ? "fixed" : "absolute", p.caixa, className)}
    >
      <div className="relative w-full rounded-lg border border-border bg-card text-foreground shadow-xl">
        {href ? (
          <a href={href} target="_blank" rel="noopener" aria-label={rotuloAcao} onClick={() => { onAcao?.(); esconder(); }} className={classeAcao}>
            {conteudo}
          </a>
        ) : (
          <button type="button" aria-label={rotuloAcao} onClick={() => { onAcao?.(); esconder(); }} className={classeAcao}>
            {conteudo}
          </button>
        )}
        <button
          type="button"
          aria-label={rotuloFechar}
          onClick={esconder}
          className="absolute right-2 top-2 flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <X aria-hidden className="size-4" strokeWidth={2.25} />
        </button>
        <span aria-hidden className={cn("absolute z-[2] size-3.5 border-l border-t border-border bg-card", p.seta)} />
      </div>
    </div>
  );
}

export { AvisoProjeto };
