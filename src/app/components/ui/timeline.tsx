import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "./utils";

/**
 * Timeline (linha do tempo) — portada da seção "Como funciona" do site do estúdio.
 *
 * Etapas em uma linha vertical com marcadores redondos (ícone de cada etapa) e cards. No celular, linha à esquerda
 * e cards à direita; a partir de 768 px, linha no centro e cards alternando direita/esquerda, encaixados, com a
 * setinha apontando para a linha.
 *
 * Animação "Step Indicator" (só com JavaScript e sem prefers-reduced-motion): conforme a pessoa rola, a etapa cujo
 * marcador passa de 60 % da altura da janela vira a atual (cresce, preenchida na primária); as anteriores ficam
 * feitas (preenchidas, com check quando `checkNasFeitas`), a linha entre elas é preenchida e o card de cada etapa
 * entra uma vez só, deslizando a partir do lado da linha. Sem JavaScript ou com movimento reduzido, tudo aparece
 * preenchido e parado.
 */
export type TimelineStep = {
  titulo: React.ReactNode;
  descricao: React.ReactNode;
  icone: React.ReactNode;
};

export type TimelineProps = React.HTMLAttributes<HTMLOListElement> & {
  etapas: TimelineStep[];
  /** Alternar os cards entre direita e esquerda a partir de 768 px (padrão: sim). */
  alternar?: boolean;
  /** Fração da altura da janela que o marcador precisa cruzar para a etapa virar atual (padrão 0,6). */
  limite?: number;
  /** Mostra um check no lugar do ícone nas etapas feitas (padrão: mantém o ícone, como no site). */
  checkNasFeitas?: boolean;
  /** Liga ou desliga a animação de rolagem. */
  animar?: boolean;
};

function usePrefersReducedMotion() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(mq.matches);
    on(); mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

export function Timeline({ etapas, alternar = true, limite = 0.6, checkNasFeitas = false, animar = true, className, ...props }: TimelineProps) {
  const reduzir = usePrefersReducedMotion();
  const ativo = animar && !reduzir;
  const refs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const [atual, setAtual] = React.useState(-1);
  const [vistos, setVistos] = React.useState<boolean[]>(() => etapas.map(() => false));

  React.useEffect(() => {
    if (!ativo) return;
    let agendado = false;
    const atualizar = () => {
      agendado = false;
      const lim = window.innerHeight * limite;
      let a = -1;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 < lim) a = i;
      });
      setAtual(a);
      setVistos((v) => {
        let mudou = false;
        const n = v.map((x, i) => { const y = x || i <= a; if (y !== x) mudou = true; return y; });
        return mudou ? n : v;
      });
    };
    const pedir = () => { if (!agendado) { agendado = true; requestAnimationFrame(atualizar); } };
    // capture: pega também a rolagem de contêineres internos (como o painel do design system)
    window.addEventListener("scroll", pedir, { passive: true, capture: true });
    window.addEventListener("resize", pedir);
    atualizar();
    return () => { window.removeEventListener("scroll", pedir, true); window.removeEventListener("resize", pedir); };
  }, [ativo, limite, etapas.length]);

  return (
    <ol
      data-slot="timeline"
      data-animado={ativo ? "" : undefined}
      className={cn("relative m-0 grid list-none gap-[14px] p-0 md:mx-auto md:max-w-[920px] md:gap-[18px]", className)}
      style={{ "--marco": "44px", "--trilho": "14px" } as React.CSSProperties}
      {...props}
    >
      {etapas.map((e, i) => {
        const feita = ativo ? i < atual : true;
        const ehAtual = ativo ? i === atual : false;
        const visivel = ativo ? vistos[i] : true;
        const direita = !alternar || i % 2 === 0; // card à direita nas ímpares (1ª, 3ª…), à esquerda nas pares
        const ultimo = i === etapas.length - 1;
        return (
          <li
            key={i}
            data-estado={feita ? "feita" : ehAtual ? "atual" : "pendente"}
            className={cn(
              "relative grid grid-cols-[var(--marco)_minmax(0,1fr)] items-center gap-x-[var(--trilho)]",
              "md:[--marco:52px] md:grid-cols-[minmax(0,1fr)_var(--marco)_minmax(0,1fr)] md:gap-x-7",
              alternar && i > 0 && "md:-mt-10",
            )}
          >
            {/* trilho: cinza de fundo; o preenchimento na primária cresce da etapa feita até a próxima */}
            <span aria-hidden className={cn("absolute left-[calc(var(--marco)/2-1px)] w-[2px] md:left-[calc(50%-1px)]", i === 0 ? "top-1/2" : "-top-2 md:-top-2.5", ultimo ? "bottom-1/2" : "-bottom-2 md:-bottom-2.5", ativo ? "bg-[var(--graphite-200)] dark:bg-[var(--graphite-700)]" : "bg-primary")} />
            {ativo && !ultimo && (
              <span aria-hidden className={cn("absolute left-[calc(var(--marco)/2-1px)] top-1/2 -bottom-2 w-[2px] origin-top bg-primary transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:left-[calc(50%-1px)] md:-bottom-2.5", feita ? "scale-y-100" : "scale-y-0")} />
            )}
            {ativo && i > 0 && (
              <span aria-hidden className={cn("absolute left-[calc(var(--marco)/2-1px)] -top-2 bottom-1/2 w-[2px] bg-primary transition-opacity duration-300 md:left-[calc(50%-1px)] md:-top-2.5", i - 1 < atual ? "opacity-100" : "opacity-0")} />
            )}

            {/* marcador */}
            <span
              ref={(el) => { refs.current[i] = el; }}
              aria-hidden
              className={cn(
                "relative z-[1] col-start-1 row-start-1 flex h-[var(--marco)] w-[var(--marco)] items-center justify-center rounded-full border-2 bg-card [&_svg]:h-[22px] [&_svg]:w-[22px] md:col-start-2 md:[&_svg]:h-6 md:[&_svg]:w-6",
                "transition-[background-color,border-color,color,transform,box-shadow] duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
                feita || ehAtual ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-md)]" : ativo ? "border-[var(--graphite-200)] text-[var(--graphite-400)] dark:border-[var(--graphite-700)]" : "border-primary text-primary shadow-[var(--shadow-md)]",
                ehAtual && "scale-[1.15]",
              )}
            >
              {feita && checkNasFeitas ? <Check strokeWidth={3} /> : e.icone}
            </span>

            {/* card */}
            <div
              className={cn(
                "relative col-start-2 row-start-1 flex items-start gap-[14px] rounded-[20px] border border-border bg-card px-[18px] py-4 shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[var(--shadow-md)]",
                direita ? "md:col-start-3" : "md:col-start-1",
                // setinha apontando para a linha (a partir de 768 px)
                "md:before:absolute md:before:top-1/2 md:before:h-3 md:before:w-3 md:before:-mt-1.5 md:before:rotate-45 md:before:border md:before:border-border md:before:bg-card md:before:content-['']",
                direita ? "md:before:-left-[7px] md:before:border-t-0 md:before:border-r-0" : "md:before:-right-[7px] md:before:border-b-0 md:before:border-l-0",
                ativo && !visivel && "opacity-0",
                ativo && visivel && (direita ? "animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-both [animation-delay:150ms] max-md:slide-in-from-bottom-4 max-md:slide-in-from-right-0" : "animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-both [animation-delay:150ms] max-md:slide-in-from-bottom-4 max-md:slide-in-from-left-0"),
              )}
            >
              <div className="min-w-0">
                <h4 className="mb-1 text-[1.125rem] font-bold leading-[1.3] tracking-[-0.02em] text-foreground" style={{ fontFamily: "var(--font-sans)" }}>{e.titulo}</h4>
                <p className="m-0 text-[0.9375rem] leading-normal text-muted-foreground">{e.descricao}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
