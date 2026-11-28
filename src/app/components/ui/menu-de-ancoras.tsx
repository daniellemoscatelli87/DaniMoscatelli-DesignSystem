"use client";

import * as React from "react";
import { cn } from "./utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

/**
 * MenuDeAncoras (menu da página, com a seção em leitura marcada)
 *
 * Os links para as seções de uma página longa (landing, página de apresentação). Conforme a pessoa rola, o item da
 * seção em leitura fica marcado: rosa de selecionado (--primary-suave), borda na cor da marca e aria-current="true"
 * (nunca só cor). Tocar num item leva até a seção, com rolagem suave (instantânea com "menos movimento"), e o foco
 * vai para ela, para quem usa teclado ou leitor de tela continuar dali.
 *
 * - orientacao "horizontal" (padrão): fileira de chips que quebra de linha (nunca rola para o lado). "vertical": no
 *   computador (a partir de 1024 px), uma lista de linhas, a atual com um traço à esquerda; abaixo disso, os chips.
 * - noCelular "seletor": no celular e no tablet, os chips viram uma lista de seleção compacta (Select do DS).
 * - fixo: o menu gruda logo abaixo do cabeçalho do site enquanto a página rola (na horizontal, com o fundo de vidro
 *   do cabeçalho).
 * - deslocamento: a altura do cabeçalho fixo do site, onde o menu fixo gruda; "auto" (padrão) lê a variável
 *   --altura-cabecalho, quando a página a define, ou o CabecalhoDoSite fixo; senão, 0. Ao levar até uma seção, o
 *   menu desconta o cabeçalho e, quando é fixo, a própria altura: a seção começa logo abaixo dos dois.
 * - raiz: um contêiner com rolagem própria (demonstrações). Sem ela, a página.
 *
 * Classes de CSS puro (páginas em HTML): .ds-menu-de-ancoras, .ds-menu-de-ancoras-lista, .ds-menu-de-ancoras-item
 * (com aria-current="true" no atual) e .ds-alvo-de-ancora nas seções. Mesma API no DS FindLook.
 */

export type ItemDeAncora = { id: string; rotulo: string };

type Raiz = React.RefObject<HTMLElement | null>;

/** Altura do cabeçalho fixo do site: a variável --altura-cabecalho, quando a página a define, ou o CabecalhoDoSite
 *  fixo (sticky ou fixed). Dentro de uma caixa com rolagem própria, 0. */
export function alturaDoCabecalho(caixa?: HTMLElement | null): number {
  if (caixa || typeof window === "undefined") return 0;
  const variavel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--altura-cabecalho"));
  if (variavel > 0) return variavel;
  const cab = document.querySelector<HTMLElement>('[data-slot="cabecalho-do-site"]');
  if (cab) {
    const pos = getComputedStyle(cab).position;
    if (pos === "fixed" || pos === "sticky") return cab.getBoundingClientRect().height;
  }
  return 0;
}

/** Altura do MenuDeAncoras fixo quando ele é uma faixa por cima do conteúdo (chips ou lista de seleção); a lista
 *  vertical do computador fica ao lado do texto e não cobre nada. */
export function alturaDoMenuFixo(escopo: ParentNode | null = typeof document === "undefined" ? null : document): number {
  const menu = escopo?.querySelector<HTMLElement>('[data-slot="menu-de-ancoras"][data-fixo]');
  if (!menu) return 0;
  const lista = menu.querySelector<HTMLElement>(".ds-menu-de-ancoras-lista");
  const vertical = lista && getComputedStyle(lista).display !== "none" && getComputedStyle(lista).flexDirection === "column";
  return vertical ? 0 : menu.getBoundingClientRect().height;
}

/** Quanto do topo fica coberto: o número dado ou (auto) o cabeçalho fixo do site mais o menu de âncoras fixo. */
export function resolverDeslocamento(deslocamento: number | "auto" = "auto", caixa?: HTMLElement | null): number {
  if (typeof deslocamento === "number") return deslocamento;
  return alturaDoCabecalho(caixa) + alturaDoMenuFixo(caixa ?? (typeof document === "undefined" ? null : document));
}

/** Rola até o elemento, com o deslocamento do topo, suave (ou instantâneo com "menos movimento"), e põe o foco nele. */
export function rolarAte(el: HTMLElement, { raiz, deslocamento = "auto", focar = true }: { raiz?: Raiz; deslocamento?: number | "auto"; focar?: boolean } = {}) {
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduzir ? "auto" : "smooth";
  const caixa = raiz?.current ?? null;
  const topo = resolverDeslocamento(deslocamento, caixa);
  if (caixa) {
    const y = el.getBoundingClientRect().top - caixa.getBoundingClientRect().top + caixa.scrollTop - topo;
    caixa.scrollTo({ top: Math.max(0, y), behavior });
  } else {
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - topo), behavior });
  }
  if (focar) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.classList.add("ds-alvo-de-ancora");
    el.focus({ preventScroll: true });
  }
}

/** Procura a seção pelo id (dentro da raiz, quando houver). */
function acharSecao(id: string, caixa?: HTMLElement | null) {
  return (caixa?.querySelector<HTMLElement>(`#${CSS.escape(id)}`) ?? document.getElementById(id)) as HTMLElement | null;
}

/**
 * Seção em leitura: a última cujo topo já passou da linha de leitura (o deslocamento + 1/4 da altura que sobra).
 * No fim da rolagem, a última seção.
 */
export function useSecaoAtiva(ids: string[], { raiz, deslocamento = "auto" }: { raiz?: Raiz; deslocamento?: number | "auto" | (() => number) } = {}) {
  const [ativo, setAtivo] = React.useState<string | null>(null);
  const travaAte = React.useRef(0);
  const chave = ids.join("|");

  React.useEffect(() => {
    const caixa = raiz?.current ?? null;
    const alvo: HTMLElement | Window = caixa ?? window;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      if (Date.now() < travaAte.current) return;
      const topo = typeof deslocamento === "function" ? deslocamento() : resolverDeslocamento(deslocamento, caixa);
      const topoRaiz = caixa ? caixa.getBoundingClientRect().top : 0;
      const altura = caixa ? caixa.clientHeight : window.innerHeight;
      const linha = topoRaiz + topo + (altura - topo) * 0.25;
      const rolado = caixa ? caixa.scrollTop : window.scrollY;
      const total = caixa ? caixa.scrollHeight : document.documentElement.scrollHeight;
      let atual: string | null = null;
      for (const id of ids) {
        const el = acharSecao(id, caixa);
        if (el && el.getBoundingClientRect().top <= linha) atual = id;
      }
      if (rolado > 0 && rolado + altura >= total - 2 && ids.length) {
        const ultimo = acharSecao(ids[ids.length - 1], caixa);
        if (ultimo && ultimo.getBoundingClientRect().top < topoRaiz + altura) atual = ids[ids.length - 1];
      }
      setAtivo(atual);
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(medir); };
    medir();
    alvo.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    const fim = () => { travaAte.current = 0; agendar(); };
    alvo.addEventListener("scrollend", fim);
    return () => {
      cancelAnimationFrame(quadro);
      alvo.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
      alvo.removeEventListener("scrollend", fim);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, raiz, deslocamento]);

  /** Marca já o item escolhido e segura a marcação enquanto a rolagem suave passa pelas outras seções. */
  const fixar = React.useCallback((id: string) => {
    travaAte.current = Date.now() + 1200;
    setAtivo(id);
  }, []);

  return { ativo, fixar };
}

export type MenuDeAncorasProps = Omit<React.ComponentProps<"nav">, "children"> & {
  itens: ItemDeAncora[];
  /** Nome do menu para leitores de tela (e texto da lista de seleção). */
  rotulo?: string;
  orientacao?: "horizontal" | "vertical";
  noCelular?: "chips" | "seletor";
  fixo?: boolean;
  deslocamento?: number | "auto";
  raiz?: Raiz;
  /** Força o desenho de celular ou de computador (demonstrações). Padrão: pela largura da tela. */
  tela?: "auto" | "celular" | "computador";
  aoMudar?: (id: string | null) => void;
};

function MenuDeAncoras({
  itens,
  rotulo = "Nesta página",
  orientacao = "horizontal",
  noCelular = "chips",
  fixo = false,
  deslocamento = "auto",
  raiz,
  tela = "auto",
  aoMudar,
  className,
  style,
  ...props
}: MenuDeAncorasProps) {
  const ids = React.useMemo(() => itens.map(i => i.id), [itens]);
  const ref = React.useRef<HTMLElement>(null);
  const [topo, setTopo] = React.useState<number | null>(null);
  /** O que cobre o topo para este menu: o cabeçalho (o número dado ou o do site) e, se ele é fixo, ele mesmo. */
  const cobertura = React.useCallback(() => {
    const caixa = raiz?.current ?? null;
    const cabecalho = typeof deslocamento === "number" ? deslocamento : alturaDoCabecalho(caixa);
    const proprio = fixo && ref.current ? alturaDoMenuFixo(ref.current.parentElement) : 0;
    return cabecalho + proprio;
  }, [raiz, deslocamento, fixo]);
  const { ativo, fixar } = useSecaoAtiva(ids, { raiz, deslocamento: cobertura });

  React.useEffect(() => { aoMudar?.(ativo); }, [ativo, aoMudar]);

  React.useEffect(() => {
    const medir = () => setTopo(typeof deslocamento === "number" ? deslocamento : alturaDoCabecalho(raiz?.current ?? null));
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [deslocamento, raiz]);

  const ir = (id: string) => {
    const el = acharSecao(id, raiz?.current ?? null);
    if (!el) return;
    fixar(id);
    rolarAte(el, { raiz, deslocamento: cobertura() });
  };

  return (
    <nav
      ref={ref}
      aria-label={rotulo}
      data-slot="menu-de-ancoras"
      data-orientacao={orientacao}
      data-celular={noCelular}
      data-tela={tela === "auto" ? undefined : tela}
      data-fixo={fixo ? "" : undefined}
      className={cn("ds-menu-de-ancoras", className)}
      style={{ ...(topo !== null ? { "--menu-ancoras-topo": `${topo}px` } : {}), ...style } as React.CSSProperties}
      {...props}
    >
      <ul className="ds-menu-de-ancoras-lista">
        {itens.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="ds-menu-de-ancoras-item"
              aria-current={ativo === item.id ? "true" : undefined}
              onClick={e => { e.preventDefault(); ir(item.id); }}
            >
              {item.rotulo}
            </a>
          </li>
        ))}
      </ul>
      {noCelular === "seletor" && (
        <div className="ds-menu-de-ancoras-seletor">
          <Select value={ativo ?? ""} onValueChange={ir}>
            <SelectTrigger aria-label={rotulo} className="w-full">
              <SelectValue placeholder={rotulo} />
            </SelectTrigger>
            <SelectContent>
              {itens.map(item => <SelectItem key={item.id} value={item.id}>{item.rotulo}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
    </nav>
  );
}

export { MenuDeAncoras };
