import * as React from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "./utils";

/**
 * Links de texto do site e do painel (um sinal = um sentido: o mesmo desenho para o mesmo tipo de link).
 * - LinkDeTexto: link dentro de uma frase ou numa linha de dados (site, e-mail, Instagram). --primary-text, sublinhado,
 *   seminegrito. `externo` abre em outra aba, mostra o ícone de saída e avisa os leitores de tela. `forte={false}` deixa
 *   o link em --foreground (links de rodapé e créditos, que não competem com o conteúdo).
 * - LinkDeVoltar: volta para a tela de onde a pessoa veio ("Parceiros", "Pesquisas"). Seta à esquerda,
 *   no topo da página, alinhado à borda esquerda do título. 44 px de altura no celular (alvo de toque).
 * (A alça "Saiba mais" do hero é o LinkSaibaMais, em ui/link-saiba-mais.)
 * - LinkPularConteudo: o primeiro item da página, para quem usa teclado: só aparece com o foco e leva ao <main>.
 * Todos aceitam `comoLink` para usar o link do produto (por exemplo, o Link do Next.js) no lugar do <a>.
 * Mesma API e mesmo arquivo do DS FindLook (27/11/2026). O <main> da página precisa do id do `href` (padrão
 * "#conteudo") e de tabIndex={-1}, para o foco ir para ele.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type BaseDoLink = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  comoLink?: React.ElementType;
};

export function LinkDeTexto({ href, comoLink, externo = false, forte = true, className, children, ...props }: BaseDoLink & { externo?: boolean; forte?: boolean }) {
  const Comp = externo ? "a" : comoLink ?? "a";
  return (
    <Comp
      href={href}
      data-slot="link-de-texto"
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "rounded-sm underline decoration-1 underline-offset-[3px] transition-colors [overflow-wrap:anywhere] hover:decoration-2",
        forte ? "font-semibold text-primary-text" : "text-foreground",
        foco,
        className,
      )}
      {...props}
    >
      {children}
      {externo && (
        <>
          <ExternalLink aria-hidden className="ml-1 inline size-3.5 align-[-0.125em]" />
          <span className="sr-only"> (abre em nova aba)</span>
        </>
      )}
    </Comp>
  );
}

export function LinkDeVoltar({ href, comoLink, className, children, ...props }: BaseDoLink) {
  const Comp = comoLink ?? "a";
  return (
    <Comp
      href={href}
      data-slot="link-de-voltar"
      className={cn(
        "group -ml-2 inline-flex min-h-9 items-center gap-1.5 rounded-sm px-2 text-body-sm font-semibold text-foreground transition-colors hover:bg-accent toque:min-h-11",
        foco,
        className,
      )}
      {...props}
    >
      <ArrowLeft aria-hidden className="size-4 shrink-0 transition-transform duration-[var(--duration-fast)] group-hover:-translate-x-0.5 motion-reduce:transition-none" />
      {children}
    </Comp>
  );
}

export function LinkPularConteudo({ href = "#conteudo", children = "Pular para o conteúdo", className, ...props }: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href?: string }) {
  return (
    <a
      href={href}
      data-slot="link-pular-conteudo"
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:text-body-sm focus:font-semibold focus:text-foreground focus:shadow-[var(--shadow-md)]",
        foco,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
