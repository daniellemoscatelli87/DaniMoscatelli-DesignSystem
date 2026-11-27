"use client";

import * as React from "react";

import { cn } from "./utils";


// No servidor (renderização no servidor) não existe layout: useEffect lá, useLayoutEffect no navegador (27/11/2026).
const useLayoutSeguro = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
/**
 * GradeDeCards (regra da dona do produto, 27/11/2026)
 *
 * "Cards lado a lado nunca têm tamanhos diferentes. Se a diferença for muito grande, a ponto de um card ficar com uma
 * área branca vertical muito grande, o sistema passa a usar cards horizontais, um por linha."
 *
 * 1. Mesma altura: a grade estica os cards da mesma linha (align-items: stretch). Dentro do Card, o rodapé (CardFooter)
 *    desce para a base (mt-auto), então as ações ficam alinhadas. Item com rótulo + card: use ItemDaGrade, que estica o
 *    último filho (o card).
 * 2. Troca automática: a grade mede a altura natural de cada item (sem esticar). Se, numa mesma linha, a diferença entre
 *    o mais alto e o mais baixo passa do limite, a grade vira lista (data-layout="lista"): um card por linha, na largura
 *    inteira, e os cards do sistema (Card, PartnerCard, ProductCard) passam à versão horizontal pelo contexto
 *    (useOrientacaoDoCard): mídia ou ícone à esquerda, conteúdo ao lado e, embaixo, divisor e ações no canto inferior
 *    direito ("Card com ação: divisor e botão no canto inferior direito").
 *
 * Limite (LIMITE_DE_DIFERENCA): a diferença passa do limite quando é maior que 120 px, ou maior que 1/3 da altura do card
 * mais alto e de pelo menos 64 px. 120 px são cerca de 5 linhas de texto de 24 px: uma área vazia que se vê em qualquer
 * card. 1/3 pega os cards pequenos (um KPI de 180 px com 60 px vazios já parece pela metade). Os 64 px de piso evitam a
 * troca por diferenças do tamanho do próprio respiro do card (24 px em cima e embaixo + uma linha de texto).
 * Histerese: depois de virar lista, só volta à grade quando a diferença cai abaixo de 75% do limite (FATOR_DE_VOLTA),
 * para não piscar perto da fronteira.
 *
 * Mede de novo quando a largura muda e quando o conteúdo muda (ResizeObserver, MutationObserver e carregamento de
 * imagens). A medição acontece antes da pintura (useLayoutEffect): a pessoa nunca vê o estado intermediário.
 * Itens decorativos da grade (uma seta entre dois cards) levam data-grade-ignorar e ficam fora da medição.
 * Com uma coluna só (celular), não há nada a trocar: os cards já ficam um por linha, na vertical.
 * A troca entra com um esmaecimento curto (--duration-normal); com "menos movimento", sem animação.
 */

export type OrientacaoDoCard = "vertical" | "horizontal";
export type LayoutDaGrade = "grade" | "lista";

export type LimiteDeDiferenca = {
  /** Diferença absoluta, em px, acima da qual a grade vira lista. Padrão: 120. */
  px: number;
  /** Diferença relativa à altura do card mais alto (0 a 1). Padrão: 1/3. */
  proporcao: number;
  /** Diferença mínima, em px, para a regra relativa valer. Padrão: 64. */
  minimo: number;
};

export const LIMITE_DE_DIFERENCA: LimiteDeDiferenca = { px: 120, proporcao: 1 / 3, minimo: 64 };
/** Para voltar de lista para grade, a diferença precisa cair abaixo de 75% do limite. */
export const FATOR_DE_VOLTA = 0.75;

/** A diferença entre o card mais alto e o mais baixo de uma linha passa do limite? */
export function passaDoLimite(diferenca: number, maior: number, limite: LimiteDeDiferenca = LIMITE_DE_DIFERENCA, fator = 1) {
  return diferenca > limite.px * fator || (diferenca > maior * limite.proporcao * fator && diferenca >= limite.minimo * fator);
}

const OrientacaoDoCardContext = React.createContext<OrientacaoDoCard | null>(null);

/** Orientação pedida pela GradeDeCards mais próxima: "horizontal" quando ela virou lista; null fora de uma grade. */
export function useOrientacaoDoCard() {
  return React.useContext(OrientacaoDoCardContext);
}

/** Zera a orientação herdada: um card dentro de outro card não herda a orientação da grade de fora. */
export function SemOrientacaoHerdada({ children }: { children: React.ReactNode }) {
  return <OrientacaoDoCardContext.Provider value={null}>{children}</OrientacaoDoCardContext.Provider>;
}

type N = 1 | 2 | 3 | 4 | 5 | 6;
export type ColunasDaGrade = N | { base?: N; sm?: N; md?: N; lg?: N; xl?: N };

// Classes escritas por inteiro para o Tailwind encontrá-las.
const COLUNAS: Record<"base" | "sm" | "md" | "lg" | "xl", Record<N, string>> = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" },
  xl: { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6" },
};

function classesDasColunas(colunas?: ColunasDaGrade) {
  if (colunas === undefined) return "";
  if (typeof colunas === "number") return COLUNAS.base[colunas];
  return (Object.keys(COLUNAS) as (keyof typeof COLUNAS)[]).map(k => (colunas[k] ? COLUNAS[k][colunas[k]!] : "")).join(" ");
}

export type GradeDeCardsProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Colunas por faixa de largura, por exemplo { base: 1, md: 2, lg: 3 }. Também dá para passar as classes grid-cols-* em className. */
  colunas?: ColunasDaGrade;
  /** Alternativa a colunas: quantos cards couberem com esta largura mínima (px ou valor CSS). */
  larguraMinima?: number | string;
  /** Troca o limite padrão (120 px, ou 1/3 e 64 px). */
  limiteDeDiferenca?: Partial<LimiteDeDiferenca>;
  /** "auto" (padrão) decide pela regra; "grade" ou "lista" fixam o layout. */
  layout?: "auto" | LayoutDaGrade;
  /** Avisa quando o layout troca. */
  onLayoutChange?: (layout: LayoutDaGrade) => void;
};

export const GradeDeCards = React.forwardRef<HTMLDivElement, GradeDeCardsProps>(function GradeDeCards(
  { colunas, larguraMinima, limiteDeDiferenca, layout: layoutFixo = "auto", onLayoutChange, className, style, children, ...props },
  refExterno,
) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [layoutAuto, setLayoutAuto] = React.useState<LayoutDaGrade>("grade");
  const [medindo, setMedindo] = React.useState(layoutFixo === "auto");
  const [trocou, setTrocou] = React.useState(false);
  const layout = layoutFixo === "auto" ? layoutAuto : layoutFixo;

  const limite = React.useRef(LIMITE_DE_DIFERENCA);
  limite.current = { ...LIMITE_DE_DIFERENCA, ...limiteDeDiferenca };
  // layout decidido (fonte da verdade da medição; o estado segue este valor)
  const atual = React.useRef<LayoutDaGrade>("grade");
  const observador = React.useRef<MutationObserver | null>(null);
  const pedido = React.useRef(0);

  // Decide o layout pelas alturas naturais dos itens (a grade precisa estar com data-medindo: colunas normais, sem esticar).
  const decidir = React.useCallback((el: HTMLElement): LayoutDaGrade => {
    const itens = Array.from(el.children).filter((c): c is HTMLElement => {
      if (!(c instanceof HTMLElement) || c.hasAttribute("data-grade-ignorar")) return false;
      const cs = getComputedStyle(c);
      return cs.display !== "none" && cs.position !== "absolute" && cs.position !== "fixed";
    });
    const colunasNaTela = getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length;
    if (colunasNaTela < 2 || itens.length < 2) return "grade";
    const linhas: { topo: number; alturas: number[] }[] = [];
    for (const it of itens) {
      const r = it.getBoundingClientRect();
      // ItemDaGrade (rótulo + card): conta a altura do card, o último filho
      const card = it.dataset.slot === "item-da-grade" && it.lastElementChild instanceof HTMLElement ? it.lastElementChild : it;
      let linha = linhas.find(l => Math.abs(l.topo - r.top) <= 2);
      if (!linha) linhas.push((linha = { topo: r.top, alturas: [] }));
      linha.alturas.push(card.getBoundingClientRect().height);
    }
    const fator = atual.current === "lista" ? FATOR_DE_VOLTA : 1;
    const passa = linhas.some(l => {
      if (l.alturas.length < 2) return false;
      const maior = Math.max(...l.alturas);
      return passaDoLimite(maior - Math.min(...l.alturas), maior, limite.current, fator);
    });
    return passa ? "lista" : "grade";
  }, []);

  const aplicar = React.useCallback((proximo: LayoutDaGrade) => {
    if (proximo === atual.current) return;
    atual.current = proximo;
    setLayoutAuto(proximo);
    setTrocou(true);
  }, []);

  const pedirMedida = React.useCallback(() => {
    if (pedido.current) return;
    pedido.current = requestAnimationFrame(() => {
      pedido.current = 0;
      const el = ref.current;
      if (!el) return;
      if (atual.current === "lista") {
        // Em lista, os cards estão na horizontal: a medição precisa de uma renderização com eles na vertical.
        setMedindo(true);
        return;
      }
      // Em grade, mede direto no DOM, sem renderizar de novo: solta o esticamento, lê e devolve, antes da pintura.
      el.setAttribute("data-medindo", "");
      const proximo = decidir(el);
      el.removeAttribute("data-medindo");
      aplicar(proximo);
    });
  }, [decidir, aplicar]);

  // Medição com renderização (primeira vez e em lista): data-medindo e cards na vertical; decide antes da pintura.
  useLayoutSeguro(() => {
    if (!medindo) {
      // as mudanças de DOM causadas pela própria medição não pedem outra medição
      observador.current?.takeRecords();
      return;
    }
    const el = ref.current;
    if (!el) return;
    aplicar(decidir(el));
    setMedindo(false);
  }, [medindo, decidir, aplicar]);

  React.useEffect(() => {
    if (!trocou) return;
    const id = window.setTimeout(() => setTrocou(false), 400);
    return () => window.clearTimeout(id);
  }, [trocou]);

  const primeiro = React.useRef(true);
  React.useEffect(() => {
    if (primeiro.current) { primeiro.current = false; return; }
    onLayoutChange?.(layout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || layoutFixo !== "auto" || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => pedirMedida());
    ro.observe(el);
    Array.from(el.children).forEach(c => ro.observe(c));
    const mo = new MutationObserver(registros => {
      for (const r of registros) if (r.target === el) r.addedNodes.forEach(n => n instanceof Element && ro.observe(n));
      // Em grade, o card mais baixo está esticado: mudar o conteúdo dele não muda o tamanho, então só o MutationObserver
      // percebe. Em lista, os cards têm a altura natural e o ResizeObserver já percebe.
      if (atual.current === "grade") pedirMedida();
    });
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    observador.current = mo;
    el.addEventListener("load", pedirMedida, true);
    document.fonts?.ready.then(pedirMedida).catch(() => {});
    return () => {
      ro.disconnect();
      mo.disconnect();
      observador.current = null;
      el.removeEventListener("load", pedirMedida, true);
      if (pedido.current) cancelAnimationFrame(pedido.current);
      pedido.current = 0;
    };
  }, [layoutFixo, pedirMedida]);

  const lista = layout === "lista" && !medindo;
  const largura = typeof larguraMinima === "number" ? `${larguraMinima}px` : larguraMinima;

  return (
    <OrientacaoDoCardContext.Provider value={lista ? "horizontal" : "vertical"}>
      <div
        ref={no => {
          ref.current = no;
          if (typeof refExterno === "function") refExterno(no);
          else if (refExterno) refExterno.current = no;
        }}
        data-slot="grade-de-cards"
        data-layout={lista ? "lista" : "grade"}
        data-medindo={medindo ? "" : undefined}
        data-trocou={trocou ? "" : undefined}
        className={cn(
          "grid grid-cols-1 items-stretch gap-4",
          classesDasColunas(colunas),
          className,
          // lista: um card por linha, na largura inteira
          "data-[layout=lista]:grid-cols-1!",
          // medição: sem esticar (altura natural de cada item)
          "data-[medindo]:items-start! [&[data-medindo]>.h-full]:h-auto! [&[data-medindo]>[data-slot=item-da-grade]:has(>:nth-child(2):last-child)]:items-start!",
          // troca de layout: esmaecimento curto, só sem "menos movimento"
          "motion-safe:data-[trocou]:*:animate-in motion-safe:data-[trocou]:*:fade-in-0 motion-safe:data-[trocou]:*:duration-[var(--duration-normal)]",
        )}
        style={largura && !lista ? { gridTemplateColumns: `repeat(auto-fit, minmax(min(${largura}, 100%), 1fr))`, ...style } : style}
        {...props}
      >
        {children}
      </div>
    </OrientacaoDoCardContext.Provider>
  );
});

/**
 * ItemDaGrade: item com um rótulo em cima do card. Estica o último filho (o card) até a base da linha, para os cards da
 * linha terem a mesma altura. Com exatamente dois filhos (rótulo + card), usa subgrid: os rótulos da mesma linha ocupam
 * a mesma faixa, então os cards começam e terminam juntos mesmo quando um rótulo quebra em duas linhas.
 * Numa linha, use ItemDaGrade em todos os itens ou em nenhum.
 */
export function ItemDaGrade({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-da-grade"
      className={cn(
        "flex min-w-0 flex-col [&>:last-child]:flex-1",
        "has-[>:nth-child(2):last-child]:row-span-2 has-[>:nth-child(2):last-child]:grid has-[>:nth-child(2):last-child]:grid-rows-subgrid has-[>:nth-child(2):last-child]:gap-0",
        className,
      )}
      {...props}
    />
  );
}
