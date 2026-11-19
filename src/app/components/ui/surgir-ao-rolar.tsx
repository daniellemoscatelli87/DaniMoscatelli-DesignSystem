import * as React from "react";
import { cn } from "./utils";

/**
 * SurgirAoRolar e TituloQueSurge (entrada ao rolar)
 *
 * Os blocos entram quando chegam na tela, como no site do estúdio. Dois efeitos, os dois do site:
 *
 * subir    — Slide Up do Motion do DS: sobe 24 px e aparece em 0,7 s, curva snappy (0.16, 1, 0.3, 1).
 *            Projeto Piloto (classes .rv, .rv-cabecalho e .rv-grupo de src/projeto-piloto.ts).
 * desfoque — sobe 24 px saindo de um desfoque de 6 px, em 0,9 s (Home e Seja Parceiro, "textos que surgem",
 *            src/compartilhado/textos-surgem.ts).
 *
 * escalonar — os filhos diretos entram um depois do outro (`passo` ms entre eles; até 12 filhos).
 * repetir   — o que volta a ficar abaixo da tela é recolhido e anima de novo na próxima descida (Projeto Piloto).
 *             Desligado (padrão): anima uma vez só (Home e Seja Parceiro).
 * raiz      — ref de um contêiner com rolagem própria (demonstrações); sem ela, a página.
 *
 * TituloQueSurge: o título surge palavra por palavra, saindo de um desfoque de 10 px e subindo um pouco
 * (45 ms entre as palavras). O texto inteiro fica disponível para leitores de tela; as palavras animadas ficam ocultas
 * para eles.
 *
 * Movimento reduzido: com prefers-reduced-motion, nada fica escondido e nada anima.
 */

type Efeito = "subir" | "desfoque";

type OpcoesVisivel = {
  raiz?: React.RefObject<HTMLElement | null>;
  limiar?: number;
  margem?: string;
  repetir?: boolean;
};

const CURVA = "cubic-bezier(0.16, 1, 0.3, 1)";

const filhos = Array.from({ length: 11 }, (_, i) => `[data-surgir][data-escalonar] > :nth-child(${i + 2}) { --surgir-i: ${i + 1}; }`).join("\n");

const CSS = `
[data-surgir][data-estado="oculto"]:not([data-escalonar]),
[data-surgir][data-estado="oculto"][data-escalonar] > * { opacity: 0; transform: translateY(24px); }
[data-surgir="desfoque"][data-estado="oculto"]:not([data-escalonar]),
[data-surgir="desfoque"][data-estado="oculto"][data-escalonar] > * { filter: blur(6px); }
[data-surgir][data-estado="visto"]:not([data-escalonar]),
[data-surgir][data-estado="visto"][data-escalonar] > * {
  opacity: 1; transform: none; filter: none;
  transition: opacity var(--surgir-dur) ${CURVA}, transform var(--surgir-dur) ${CURVA}, filter var(--surgir-dur) ${CURVA};
  transition-delay: calc(var(--surgir-atraso, 0ms) + var(--surgir-i, 0) * var(--surgir-passo, 70ms));
}
${filhos}
[data-surgir-titulo] .surgir-palavra { display: inline-block; }
[data-surgir-titulo][data-estado="oculto"] .surgir-palavra { opacity: 0; filter: blur(10px); transform: translateY(.35em); }
[data-surgir-titulo][data-estado="visto"] .surgir-palavra {
  opacity: 1; filter: none; transform: none;
  transition: opacity .7s ${CURVA}, filter .7s ${CURVA}, transform .7s ${CURVA};
  transition-delay: calc(var(--surgir-atraso, 0ms) + 120ms + var(--surgir-k, 0) * var(--surgir-passo, 45ms));
}
@media (prefers-reduced-motion: reduce) {
  [data-surgir], [data-surgir][data-escalonar] > *, [data-surgir-titulo] .surgir-palavra { transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
}
`;

/** Põe o CSS dos efeitos uma vez só no <head> (assim nenhum <style> entra entre os filhos escalonados). */
function useEstiloSurgir() {
  React.useInsertionEffect(() => {
    if (document.getElementById("dm-surgir-ao-rolar")) return;
    const el = document.createElement("style");
    el.id = "dm-surgir-ao-rolar";
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

/** "inicial" (sem estilo, antes do script), "oculto" (esperando a tela) ou "visto". */
export function useSurgirAoRolar<T extends HTMLElement>({ raiz, limiar = 0.15, margem = "0px 0px -8% 0px", repetir = false }: OpcoesVisivel = {}) {
  useEstiloSurgir();
  const ref = React.useRef<T>(null);
  const [estado, setEstado] = React.useState<"inicial" | "oculto" | "visto">("inicial");

  React.useLayoutEffect(() => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzir || !("IntersectionObserver" in window)) return;
    setEstado("oculto");
  }, []);

  React.useEffect(() => {
    if (estado === "inicial") return;
    const el = ref.current;
    if (!el) return;
    const caixa = raiz?.current ?? null;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setEstado("visto");
        if (!repetir) obs.disconnect();
      } else if (repetir) {
        const fundo = caixa ? caixa.getBoundingClientRect().bottom : window.innerHeight;
        if (e.boundingClientRect.top > fundo) setEstado("oculto");
      }
    }, { root: caixa, threshold: limiar, rootMargin: margem });
    // só observa depois que o estado escondido foi desenhado; senão o que já está na tela aparece sem a transição
    let r2 = 0;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => obs.observe(el)); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); obs.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado === "inicial", raiz, limiar, margem, repetir]);

  return { ref, estado };
}

export type SurgirAoRolarProps = React.HTMLAttributes<HTMLElement> & OpcoesVisivel & {
  as?: React.ElementType;
  efeito?: Efeito;
  escalonar?: boolean;
  /** Intervalo entre os filhos, em ms (padrão: 70 no subir, 150 no desfoque). */
  passo?: number;
  /** Atraso antes de começar, em ms. */
  atraso?: number;
};

function SurgirAoRolar({
  as: Tag = "div",
  efeito = "subir",
  escalonar = false,
  passo,
  atraso = 0,
  raiz,
  limiar,
  margem,
  repetir,
  className,
  style,
  children,
  ...props
}: SurgirAoRolarProps) {
  const { ref, estado } = useSurgirAoRolar<HTMLElement>({ raiz, limiar, margem, repetir });
  const vars = {
    "--surgir-dur": efeito === "desfoque" ? "900ms" : escalonar ? "600ms" : "700ms",
    "--surgir-passo": `${passo ?? (efeito === "desfoque" ? 150 : 70)}ms`,
    "--surgir-atraso": `${atraso}ms`,
  } as React.CSSProperties;
  return (
    <Tag
      ref={ref}
      data-slot="surgir-ao-rolar"
      data-surgir={efeito}
      data-escalonar={escalonar ? "" : undefined}
      data-estado={estado}
      className={className}
      style={{ ...vars, ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

export type TituloQueSurgeProps = Omit<React.HTMLAttributes<HTMLHeadingElement>, "children"> & OpcoesVisivel & {
  as?: "h1" | "h2" | "h3" | "h4" | "p";
  children: string;
  /** Intervalo entre as palavras, em ms. */
  passo?: number;
  atraso?: number;
};

function TituloQueSurge({ as: Tag = "h2", children, passo = 45, atraso = 0, raiz, limiar, margem, repetir, className, style, ...props }: TituloQueSurgeProps) {
  const { ref, estado } = useSurgirAoRolar<HTMLHeadingElement>({ raiz, limiar, margem, repetir });
  const partes = children.split(/(\s+)/);
  let k = 0;
  return (
    <Tag
      ref={ref}
      data-slot="titulo-que-surge"
      data-surgir-titulo=""
      data-estado={estado}
      className={cn(className)}
      style={{ "--surgir-passo": `${passo}ms`, "--surgir-atraso": `${atraso}ms`, ...style } as React.CSSProperties}
      {...props}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden>
        {partes.map((p, i) =>
          !p ? null : /^\s+$/.test(p) ? p : (
            <span key={i} className="surgir-palavra" style={{ "--surgir-k": k++ } as React.CSSProperties}>{p}</span>
          ),
        )}
      </span>
    </Tag>
  );
}

export { SurgirAoRolar, TituloQueSurge };
