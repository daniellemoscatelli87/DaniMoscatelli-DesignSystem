import * as React from "react";
import { cn } from "./utils";
import { Logo } from "./logo";
import { Selo } from "./selo";

/**
 * MolduraDeConta (telas de acesso)
 *
 * A moldura das telas de conta: entrar, criar ou definir senha, esqueci a senha, link expirado, sem acesso. Página
 * inteira no fundo da página, com um card estreito centralizado: logo (link para o início), selo opcional
 * ("Área restrita"), título, uma frase de apoio, o formulário (children) e um rodapé opcional (links como
 * "Voltar para entrar"). Veio da área restrita em React (telas/Acesso.tsx, a Moldura feita com Card, Heading e Selo)
 * e do template Auth, que era só demonstração.
 *
 * Alinhamento: logo, selo, título e texto alinhados à esquerda na mesma borda do formulário (a mesma coluna); no
 * celular o card ocupa a largura toda com 16 px de margem e 24 px de respiro. O rodapé fica embaixo do formulário,
 * separado por um divisor, alinhado à mesma borda.
 * Acessibilidade: <main> com o título em <h1>; o link do logo tem nome ("Página inicial"); mensagens de erro e
 * sucesso vão num Alert dentro do formulário (aria-live no produto).
 */

export type MolduraDeContaProps = Omit<React.ComponentProps<"main">, "title"> & {
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** Selo acima do título, por exemplo "Área restrita". */
  selo?: React.ReactNode;
  /** Logo próprio (padrão: o Logo horizontal do DS). */
  logo?: React.ReactNode;
  inicioHref?: string;
  rotuloInicio?: string;
  /** Links depois do formulário ("Voltar para entrar", "Precisa de ajuda?"). */
  rodape?: React.ReactNode;
  /** Ocupa a altura da tela (padrão) ou só o conteúdo (demonstrações). */
  telaCheia?: boolean;
};

function MolduraDeConta({
  titulo,
  descricao,
  selo,
  logo,
  inicioHref = "/",
  rotuloInicio = "Ir para a página inicial",
  rodape,
  telaCheia = true,
  children,
  className,
  ...props
}: MolduraDeContaProps) {
  return (
    <main
      data-slot="moldura-de-conta"
      className={cn("flex w-full items-center justify-center bg-background px-4 py-12", telaCheia && "min-h-svh", className)}
      {...props}
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground sm:p-8 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-[var(--duration-slow)]">
        <a
          href={inicioHref}
          aria-label={rotuloInicio}
          className="mb-8 inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {logo ?? <Logo variante="horizontal" superficie="auto" className="h-12" />}
        </a>
        {selo && (
          <div className="mb-3">
            {typeof selo === "string" ? <Selo size="sm" tone="primary">{selo}</Selo> : selo}
          </div>
        )}
        <h1 className="text-h3 font-bold leading-tight tracking-[-0.02em] text-foreground text-balance">{titulo}</h1>
        {descricao && <p className="mt-2 text-pretty text-body-sm leading-relaxed text-muted-foreground sm:text-body">{descricao}</p>}
        <div className="mt-6">{children}</div>
        {rodape && (
          <div data-slot="moldura-de-conta-rodape" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-4 text-body-sm">
            {rodape}
          </div>
        )}
      </div>
    </main>
  );
}

export { MolduraDeConta };
