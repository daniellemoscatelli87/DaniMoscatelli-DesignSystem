import * as React from "react";
import { cn } from "./utils";

/**
 * BotaoWhatsApp (botão flutuante do WhatsApp)
 *
 * Botão redondo de 56 px no canto inferior direito (20 px da borda; 24 px a partir de 640 px), que abre a conversa
 * no WhatsApp em nova aba, com uma mensagem pronta. É o mesmo botão de todas as páginas do site (index.html e
 * public/whatsapp.js).
 *
 * Cor: o verde oficial do WhatsApp (#25D366) fica só neste botão, por ser a cor da marca do WhatsApp (escolha da
 * dona do produto, registrada no site como exceção ao design system). O resto (sombra, anel de foco, raio) é do DS.
 *
 * fixo — true (padrão): position fixed na página. false: position absolute, para demonstrações dentro de uma caixa.
 */

export const VERDE_WHATSAPP = "#25D366";

export function linkWhatsApp(numero: string, mensagem?: string) {
  return `https://wa.me/${numero}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ""}`;
}

export type BotaoWhatsAppProps = Omit<React.ComponentProps<"a">, "href" | "children"> & {
  /** Número com DDI e DDD, só dígitos. */
  numero?: string;
  mensagem?: string;
  rotulo?: string;
  titulo?: string;
  fixo?: boolean;
};

export function IconeWhatsApp({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.6.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.04c0-5.24 4.27-9.5 9.52-9.5a9.44 9.44 0 0 1 6.72 2.79 9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm8.09-17.59A11.36 11.36 0 0 0 12.05.56C5.75.56.62 5.68.62 11.98c0 2.01.53 3.98 1.53 5.71L.53 23.6l6.06-1.59a11.4 11.4 0 0 0 5.45 1.39h.01c6.3 0 11.43-5.13 11.43-11.43 0-3.05-1.19-5.92-3.35-8.08z" />
    </svg>
  );
}

function BotaoWhatsApp({
  numero = "5541997485414",
  mensagem = "Olá, Dani! Vim pelo site danimoscatelli.com.br e gostaria de conversar sobre um projeto.",
  rotulo = "Conversar com a Dani no WhatsApp",
  titulo = "Conversar no WhatsApp",
  fixo = true,
  className,
  style,
  ...props
}: BotaoWhatsAppProps) {
  return (
    <a
      data-slot="botao-whatsapp"
      href={linkWhatsApp(numero, mensagem)}
      target="_blank"
      rel="noopener"
      aria-label={rotulo}
      title={titulo}
      className={cn(
        fixo ? "fixed" : "absolute",
        "bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-full text-white shadow-md sm:bottom-6 sm:right-6",
        "transition-transform duration-200 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      style={{ backgroundColor: VERDE_WHATSAPP, ...style }}
      {...props}
    >
      <IconeWhatsApp className="size-7" />
    </a>
  );
}

export { BotaoWhatsApp };
