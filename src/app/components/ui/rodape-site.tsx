import * as React from "react";
import { cn } from "./utils";

/**
 * RodapeSite (rodapé do site)
 *
 * Rodapé compartilhado do site do estúdio (src/compartilhado/partes.ts): logo + links de navegação em cima,
 * copyright, cidade e crédito do design system embaixo. Três variantes, como no código do site:
 *
 * claro    — superfície Graphite 100, logo de texto escuro, links Graphite 700 (Home, Seja Parceiro e Cadastro).
 * escuro   — superfície Graphite 950, logo de texto claro, links Graphite 50 (Projeto Piloto).
 * compacto — sem logo e sem os links de navegação (que já estão no cabeçalho): só a linha de base, com os links
 *            de privacidade, cookies, área restrita e design system à direita (página "Em breve").
 *
 * O botão "Preferências de cookies" chama `onPreferenciasCookies` (por exemplo, abrirAvisoCookies() do AvisoCookies).
 * Com `espacoFlutuante`, o rodapé reserva 96 px embaixo para o botão do WhatsApp não cobrir os links (como o site faz).
 *
 * Largura (regra do DS, 27/11/2026, pela largura do próprio rodapé): abaixo de 64rem, tudo alinhado à esquerda, com os
 * links numa grade de colunas alinhadas (2, 3 ou 4, conforme couber), para nenhum link ficar sozinho no meio de uma
 * linha; a partir de 64rem, logo e links lado a lado numa linha só. No toque, cada link tem 44 px de altura.
 * Colunas na largura do texto (27/11/2026): cada coluna tem a largura do link mais longo dela, então nenhum link quebra
 * em duas linhas ("Preferências de cookies" quebrava na grade de 2 colunas iguais do celular). Abaixo de 24rem de
 * rodapé (telas de 320 a 383 px), uma coluna só; de 24rem em diante, 2; a partir de 36rem, 3; de 48rem, 4.
 */

export type RodapeLink = { href: string; rotulo: string };

export type RodapeSiteProps = Omit<React.ComponentProps<"footer">, "children"> & {
  variante?: "claro" | "escuro" | "compacto";
  /** Imagem do logo. No claro, a versão de texto escuro; no escuro, a de texto claro. Sem logo, mostra o nome. */
  logo?: string;
  /** Nome acessível do link do logo. */
  rotuloLogo?: string;
  inicioHref?: string;
  /** Links de navegação (claro e escuro). */
  links?: RodapeLink[];
  /** Link da política de privacidade (usado no compacto; no claro e no escuro, inclua-o em `links`). */
  privacidade?: RodapeLink;
  rotuloPreferencias?: string;
  onPreferenciasCookies?: () => void;
  areaRestrita?: RodapeLink | null;
  copyright?: string;
  cidade?: string;
  /** Crédito do design system. No compacto, aparece só o rótulo curto. */
  credito?: { prefixo: string; rotulo: string; rotuloCurto: string; href: string } | null;
  rotuloNav?: string;
  /** Texto para leitores de tela nos links que abrem em nova aba. */
  novaAba?: string;
  espacoFlutuante?: boolean;
};

const LINKS_PADRAO: RodapeLink[] = [
  { href: "/", rotulo: "Home" },
  { href: "/projeto-piloto/", rotulo: "Projeto Piloto" },
  { href: "/rede-parceiros/", rotulo: "Seja Parceiro" },
  { href: "/privacidade/", rotulo: "Política de privacidade" },
];

const CREDITO_PADRAO = {
  prefixo: "Desenvolvido a partir de",
  rotulo: "Dani Moscatelli - Design System",
  rotuloCurto: "Design System",
  href: "https://designsystem.danimoscatelli.com.br/",
};

const foco = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const CORES = {
  claro: {
    superficie: "bg-graphite-100 dark:bg-graphite-800",
    divisor: "border-[var(--border-strong)] dark:border-white/10",
    link: "text-graphite-700 hover:text-[var(--primary-text)] dark:text-graphite-50 dark:hover:text-white",
    base: "text-graphite-500 dark:text-graphite-300",
    ponto: "text-graphite-300 dark:text-white/25",
    credito: "text-graphite-700 decoration-graphite-700/40 hover:decoration-graphite-700 dark:text-crimson-100 dark:decoration-crimson-100/40 dark:hover:decoration-crimson-100",
  },
  escuro: {
    superficie: "bg-graphite-950",
    divisor: "border-white/10",
    link: "text-graphite-50 hover:text-white",
    base: "text-graphite-300",
    ponto: "text-white/25",
    credito: "text-crimson-100 decoration-crimson-100/40 hover:decoration-crimson-100",
  },
};

function RodapeSite({
  variante = "claro",
  logo,
  rotuloLogo = "Dani Moscatelli Experience Design Studio: página inicial",
  inicioHref = "/",
  links = LINKS_PADRAO,
  privacidade = { href: "/privacidade/", rotulo: "Política de privacidade" },
  rotuloPreferencias = "Preferências de cookies",
  onPreferenciasCookies,
  areaRestrita = { href: "/admin/", rotulo: "Área restrita" },
  copyright = "© 2026 Dani Moscatelli Experience Design Studio. Todos os direitos reservados.",
  cidade = "Curitiba - PR",
  credito = CREDITO_PADRAO,
  rotuloNav = "Rodapé",
  novaAba = " (abre em nova aba)",
  espacoFlutuante = false,
  className,
  ...props
}: RodapeSiteProps) {
  const cor = CORES[variante === "escuro" ? "escuro" : "claro"];
  const compacto = variante === "compacto";
  const itemLink = cn("inline-flex min-h-6 items-center toque:min-h-11 bg-transparent p-0 text-left [font-weight:inherit] [line-height:inherit] transition-colors", cor.link, foco);
  const preferencias = (
    <button type="button" onClick={onPreferenciasCookies} className={cn(itemLink, "cursor-pointer")}>{rotuloPreferencias}</button>
  );
  const restrita = areaRestrita && <a href={areaRestrita.href} className={itemLink}>{areaRestrita.rotulo}</a>;
  const copy = (
    <p className="m-0">
      {copyright} <span aria-hidden className={cn("mx-1", cor.ponto)}>•</span> {cidade}
    </p>
  );

  return (
    <footer
      data-slot="rodape-site"
      data-variante={variante}
      className={cn("@container/rodape w-full font-sans", cor.superficie, compacto ? "py-6" : "py-10 sm:py-12", espacoFlutuante && "pb-24 sm:pb-24", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        {!compacto && (
          <div className={cn("flex flex-col items-start gap-5 border-b pb-5 @5xl/rodape:flex-row @5xl/rodape:items-center @5xl/rodape:justify-between", cor.divisor)}>
            <a href={inicioHref} aria-label={rotuloLogo} className={cn("inline-flex shrink-0 items-center toque:min-h-11", foco)}>
              {logo ? (
                <img src={logo} alt="" className="block h-12 w-auto" />
              ) : (
                <span className={cn("text-base font-bold", cor.link)}>Dani Moscatelli</span>
              )}
            </a>
            <nav aria-label={rotuloNav} className="grid w-full grid-cols-1 gap-x-5 gap-y-1 text-sm font-medium @min-[24rem]/rodape:grid-cols-[repeat(2,minmax(0,max-content))] @xl/rodape:grid-cols-[repeat(3,minmax(0,max-content))] @xl/rodape:gap-x-8 @3xl/rodape:grid-cols-[repeat(4,minmax(0,max-content))] @5xl/rodape:flex @5xl/rodape:w-auto @5xl/rodape:flex-nowrap @5xl/rodape:justify-end">
              {links.map(l => <a key={l.href + l.rotulo} href={l.href} className={itemLink}>{l.rotulo}</a>)}
              {preferencias}
              {restrita}
            </nav>
          </div>
        )}
        <div
          className={cn(
            "flex flex-col items-start gap-2 text-left text-xs leading-relaxed @5xl/rodape:flex-row @5xl/rodape:items-center @5xl/rodape:justify-between",
            cor.base,
            !compacto && "pt-5",
          )}
        >
          {copy}
          {compacto ? (
            <nav aria-label={rotuloNav} className="grid w-full grid-cols-1 gap-x-5 text-xs font-normal @min-[24rem]/rodape:grid-cols-[repeat(2,minmax(0,max-content))] @xl/rodape:grid-cols-[repeat(4,minmax(0,max-content))] @xl/rodape:gap-x-8 @5xl/rodape:flex @5xl/rodape:w-auto @5xl/rodape:flex-nowrap @5xl/rodape:justify-end">
              <a href={privacidade.href} className={cn(itemLink, cor.base)}>{privacidade.rotulo}</a>
              <button type="button" onClick={onPreferenciasCookies} className={cn(itemLink, cor.base, "cursor-pointer")}>{rotuloPreferencias}</button>
              {areaRestrita && <a href={areaRestrita.href} className={cn(itemLink, cor.base)}>{areaRestrita.rotulo}</a>}
              {credito && (
                <a href={credito.href} target="_blank" rel="noopener" className={cn(itemLink, cor.base)}>
                  {credito.rotuloCurto}<span className="sr-only">{novaAba}</span>
                </a>
              )}
            </nav>
          ) : (
            credito && (
              <p className="m-0">
                {credito.prefixo}{" "}
                <a
                  href={credito.href}
                  target="_blank"
                  rel="noopener"
                  className={cn("font-semibold underline underline-offset-2 transition-colors", cor.credito, foco)}
                >
                  {credito.rotulo}<span className="sr-only">{novaAba}</span>
                </a>
              </p>
            )
          )}
        </div>
      </div>
    </footer>
  );
}

export { RodapeSite };
