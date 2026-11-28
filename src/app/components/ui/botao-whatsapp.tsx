import * as React from "react";
import { cn } from "./utils";
import { IconeDeRedeSocial, svgDaRedeSocial } from "./link-de-rede-social";

/**
 * BotaoWhatsApp (botão flutuante do WhatsApp)
 *
 * Botão redondo de 56 px no canto inferior direito que abre a conversa no WhatsApp em nova aba, com uma mensagem
 * pronta. Mesmo componente e mesma API nos dois design systems (pedido da dona do produto, 28/11/2026), documentado
 * junto das peças de redes sociais (LinkDeRedeSocial). Só os valores padrão mudam: o número e a mensagem de cada marca.
 *
 * - Cor: o verde oficial do WhatsApp (--marca-whatsapp, #25D366) com o ícone branco: exceção da dona do produto ao DS
 *   (19/11/2026). O ícone é o mesmo do LinkDeRedeSocial (IconeDeRedeSocial rede="whatsapp").
 * - Posição: 20 px da borda (24 px a partir de 640 px), somando a área segura do aparelho (env(safe-area-inset-*)).
 *   Camada 45: acima das faixas fixas (43) e dos outros flutuantes (44). Para não cobrir o fim da página, o último
 *   bloco (o rodapé) leva a classe .ds-espaco-botao-whatsapp (96 px embaixo, mais a área segura).
 * - 56 px de alvo (acima dos 44 px), nome acessível em `rotulo` (com "(abre em nova aba)"), foco com anel --ring.
 * - Hover: cresce 5%; parado com "menos movimento".
 * - Uma fonte só do desenho: as classes .ds-botao-whatsapp (+ --na-caixa) do theme.css (bloco "@ds-css-puro"); as
 *   páginas em HTML puro usam as mesmas classes (HTML pronto em htmlDoBotaoWhatsApp).
 *
 * fixo — true (padrão): fixo na página. false: dentro de uma caixa (demonstrações), com a classe --na-caixa.
 */

// Valores padrão do Dani Moscatelli (o botão de todas as páginas do site; nas páginas em HTML, htmlDoBotaoWhatsApp).
const PADRAO: { numero?: string; mensagem?: string; rotulo: string } = {
  numero: "5541997485414",
  mensagem: "Olá, Dani! Vim pelo site danimoscatelli.com.br e gostaria de conversar sobre um projeto.",
  rotulo: "Conversar com a Dani no WhatsApp",
};

/** @deprecated use var(--marca-whatsapp); mantido para quem já importava. */
export const VERDE_WHATSAPP = "#25D366";

export function linkWhatsApp(numero?: string, mensagem?: string) {
  return `https://wa.me/${numero ?? ""}${mensagem ? `?text=${encodeURIComponent(mensagem)}` : ""}`;
}

export type BotaoWhatsAppProps = Omit<React.ComponentProps<"a">, "href" | "children"> & {
  /** Número com DDI e DDD, só dígitos. */
  numero?: string;
  mensagem?: string;
  /** Nome lido pelos leitores de tela ("Conversar com a Dani no WhatsApp"). */
  rotulo?: string;
  titulo?: string;
  fixo?: boolean;
};

/** O ícone do WhatsApp (o mesmo do LinkDeRedeSocial). */
export function IconeWhatsApp({ className }: { className?: string }) {
  return <IconeDeRedeSocial rede="whatsapp" className={className} />;
}

function BotaoWhatsApp({
  numero = PADRAO.numero,
  mensagem = PADRAO.mensagem,
  rotulo = PADRAO.rotulo,
  titulo = "Conversar no WhatsApp",
  fixo = true,
  className,
  ...props
}: BotaoWhatsAppProps) {
  return (
    <a
      data-slot="botao-whatsapp"
      href={linkWhatsApp(numero, mensagem)}
      target="_blank"
      rel="noopener"
      aria-label={`${rotulo} (abre em nova aba)`}
      title={titulo}
      className={cn("ds-botao-whatsapp", !fixo && "ds-botao-whatsapp--na-caixa", className)}
      {...props}
    >
      <IconeWhatsApp className="ds-botao-whatsapp__icone" />
    </a>
  );
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** O mesmo botão em HTML puro (páginas sem React): mesmas classes e mesmo ícone. */
export function htmlDoBotaoWhatsApp({ numero = PADRAO.numero, mensagem = PADRAO.mensagem, rotulo = PADRAO.rotulo, titulo = "Conversar no WhatsApp" }: { numero?: string; mensagem?: string; rotulo?: string; titulo?: string } = {}) {
  const svg = svgDaRedeSocial("whatsapp", "ds-botao-whatsapp__icone");
  return `<a class="ds-botao-whatsapp" href="${escapar(linkWhatsApp(numero, mensagem))}" target="_blank" rel="noopener" aria-label="${escapar(rotulo)} (abre em nova aba)" title="${escapar(titulo)}">${svg}</a>`;
}

export { BotaoWhatsApp };
