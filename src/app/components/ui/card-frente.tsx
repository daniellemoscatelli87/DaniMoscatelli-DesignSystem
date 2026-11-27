"use client";

import * as React from "react";
import { ShineBorder } from "./shine-border";
import { cn } from "./utils";

/**
 * CardDeFrente e GradeDeFrentes (frentes de atuação)
 *
 * Cards da seção "Onde podemos atuar" do Projeto Piloto (article.card-frente de projeto-piloto/index.html e
 * src/projeto-piloto.css). Ícone num quadro de 56 px, título, subtítulo em vermelho, descrição e os temas em
 * pílulas, separados por uma linha. No hover: o card sobe 6 px, a borda ganha a luz que dá a volta (Shine Border do
 * DS, 1,5 px, 6 s), uma luz suave segue o cursor, o ícone fica sólido na primária com um pequeno balanço e os temas
 * ficam vermelhos. Com movimento reduzido: sem subir, sem balanço e a borda de luz fica parada.
 *
 * tom — "escuro" (padrão, como no site): vidro claro sobre a seção escura (graphite-950).
 *       "claro": card branco do DS, para seções claras (a marcação original do site, antes da seção escura).
 * numero / barra — o número grande no fundo e a barra vermelha que cresce no topo existem na marcação do site, mas
 *       hoje estão escondidos lá (a Shine Border marca o hover). Ficam desligados por padrão; ligue se quiser.
 *
 * Dentro de um SurgirAoRolar escalonado, o ícone "salta" e os temas entram em cascata depois do card, como no site.
 *
 * Temas numa linha só quando o card tem largura para isso (o conteúdo do card a partir de 320 px, consulta de
 * contêiner); abaixo disso, quebram em mais linhas. No site, a regra era pela tela (a partir de 1280 px).
 *
 * GradeDeFrentes: 1 coluna até 767 px, um card embaixo do outro (sem rolagem lateral: regra do DS de 27/11/2026, que
 * trocou o carrossel do celular), 2 colunas a partir de 768 px e 3 a partir de 1024 px, 24 px entre os cards. Cards
 * lado a lado sempre com a mesma altura.
 */

const CSS = `
@keyframes frente-balanco { 0% { transform: rotate(0) scale(1); } 30% { transform: rotate(-8deg) scale(1.12); } 60% { transform: rotate(5deg) scale(1.1); } 100% { transform: rotate(0) scale(1.08); } }
@keyframes frente-pop { from { opacity: 0; transform: scale(.6) rotate(-10deg); } to { opacity: 1; transform: none; } }
@keyframes frente-tag { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
[data-slot="card-frente"]:hover [data-frente-icone] { animation: frente-balanco .6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
[data-surgir][data-estado="oculto"] [data-frente-icone], [data-surgir][data-estado="oculto"] [data-frente-tag] { opacity: 0; }
[data-surgir][data-estado="visto"] [data-frente-icone] { animation: frente-pop .55s cubic-bezier(0.34, 1.56, 0.64, 1) both; animation-delay: calc(var(--surgir-i, 0) * .03s + .1s); }
[data-surgir][data-estado="visto"] [data-frente-tag] { animation: frente-tag .45s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(var(--surgir-i, 0) * .03s + .2s + var(--frente-t, 0) * .04s); }
[data-surgir][data-estado="visto"] [data-slot="card-frente"]:hover [data-frente-icone] { animation: frente-balanco .6s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
@media (prefers-reduced-motion: reduce) {
  [data-slot="card-frente"] [data-frente-icone], [data-slot="card-frente"] [data-frente-tag] { animation: none !important; opacity: 1 !important; }
}
`;

function useEstiloFrente() {
  React.useInsertionEffect(() => {
    if (document.getElementById("dm-card-frente")) return;
    const el = document.createElement("style");
    el.id = "dm-card-frente";
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

const TONS = {
  escuro: {
    card: "border-white/12 bg-white/[0.04] shadow-lg backdrop-blur-[10px] backdrop-saturate-150 hover:border-white/[0.22] hover:shadow-xl",
    brilhoTopo: true,
    luz: "color-mix(in srgb, var(--primary) 10%, transparent)",
    numero: "text-white/[0.08] group-hover:text-crimson-400",
    // card de vidro não é clicável: ícone e temas continuam em vidro no hover (decisão da dona do produto, 19/11/2026)
    icone: "border-white/15 bg-white/[0.08] text-white",
    titulo: "text-graphite-50",
    subtitulo: "text-crimson-300",
    descricao: "text-graphite-300",
    divisor: "border-white/[0.07]",
    tema: "border-white/20 bg-transparent text-graphite-200",
  },
  claro: {
    card: "border-border bg-card shadow-sm hover:border-[var(--border-strong)] hover:shadow-xl",
    brilhoTopo: false,
    luz: "color-mix(in srgb, var(--primary) 8%, transparent)",
    numero: "text-graphite-100 group-hover:text-crimson-50",
    icone: "border-crimson-100 bg-crimson-50 text-[var(--primary-text)] group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25",
    titulo: "text-foreground",
    subtitulo: "text-[var(--primary-text)]",
    descricao: "text-graphite-500",
    divisor: "border-border",
    tema: "border-border bg-graphite-50 text-graphite-500 group-hover:border-crimson-100 group-hover:bg-crimson-50 group-hover:text-[var(--primary-text)]",
  },
};

export type CardDeFrenteProps = Omit<React.ComponentProps<"article">, "children"> & {
  /** Número decorativo ("01"), lido só visualmente. */
  numero?: string;
  icone: React.ReactNode;
  titulo: string;
  subtitulo: string;
  descricao: string;
  temas: string[];
  rotuloTemas?: string;
  tom?: "escuro" | "claro";
  mostrarNumero?: boolean;
  barra?: boolean;
  nivelTitulo?: "h2" | "h3" | "h4";
};

function CardDeFrente({
  numero,
  icone,
  titulo,
  subtitulo,
  descricao,
  temas,
  rotuloTemas = "Temas",
  tom = "escuro",
  mostrarNumero = false,
  barra = false,
  nivelTitulo: Titulo = "h3",
  className,
  style,
  onPointerMove,
  ...props
}: CardDeFrenteProps) {
  useEstiloFrente();
  const id = React.useId();
  const c = TONS[tom];
  const mover = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
    onPointerMove?.(e as React.PointerEvent<HTMLElement & HTMLDivElement>);
  };
  return (
    <article
      data-slot="card-frente"
      aria-labelledby={id}
      onPointerMove={mover}
      className={cn(
        "@container group relative isolate flex h-full flex-col justify-between overflow-hidden rounded-xl border p-6 font-sans sm:p-8",
        "transition-all duration-300 motion-safe:hover:-translate-y-1.5",
        c.card,
        className,
      )}
      style={style}
      {...props}
    >
      {c.brilhoTopo && <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{ background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), ${c.luz}, transparent 70%)` }}
      />
      {barra && (
        <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-crimson-500 to-crimson-400 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full motion-reduce:transition-none" />
      )}
      {mostrarNumero && numero && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-5 top-3 select-none text-display-l font-bold leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-1 group-hover:scale-[1.06] motion-reduce:transition-none",
            c.numero,
          )}
        >
          {numero}
        </span>
      )}
      <ShineBorder
        borderWidth={1.5}
        duration={6}
        shineColor={["var(--primary)", "var(--graphite-200)", "var(--primary)"]}
        className="z-[3] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">
        <span
          aria-hidden
          data-frente-icone=""
          className={cn(
            "mb-6 flex size-14 items-center justify-center rounded-lg border transition-all duration-300 [&>svg]:size-7",
            c.icone,
          )}
        >
          {icone}
        </span>
        <Titulo id={id} className={cn("mb-1.5 text-xl font-semibold leading-7", c.titulo)}>{titulo}</Titulo>
        <p className={cn("mb-3 text-sm font-semibold", c.subtitulo)}>{subtitulo}</p>
        <p className={cn("mb-6 text-sm leading-relaxed", c.descricao)}>{descricao}</p>
      </div>
      <ul aria-label={rotuloTemas} className={cn("relative flex flex-wrap gap-1.5 border-t pt-4 @min-[20rem]:flex-nowrap @min-[20rem]:gap-1", c.divisor)}>
        {temas.map((tema, j) => (
          <li
            key={tema}
            data-frente-tag=""
            style={{ "--frente-t": j } as React.CSSProperties}
            className={cn("rounded-full border px-2.5 py-1 text-xs font-medium transition-colors duration-200 @min-[20rem]:whitespace-nowrap @min-[20rem]:px-2", c.tema)}
          >
            {tema}
          </li>
        ))}
      </ul>
    </article>
  );
}

export type GradeDeFrentesProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Nome da região do carrossel, para leitores de tela. */
  rotulo?: string;
};

/** Grade de 3/2 colunas; no celular, um card por linha. Para a entrada em cascata do site:
 *  <SurgirAoRolar as={GradeDeFrentes} escalonar>…cards…</SurgirAoRolar>. */
const GradeDeFrentes = React.forwardRef<HTMLDivElement, GradeDeFrentesProps>(function GradeDeFrentes(
  { rotulo = "Frentes de atuação", className, children, ...props },
  ref,
) {
  useEstiloFrente();
  return (
    <div
      ref={ref}
      role="region"
      aria-label={rotulo}
      data-slot="grade-frentes"
      className={cn(
        "grid grid-cols-1 items-stretch gap-4 [&>*]:h-full",
        "md:mx-auto md:max-w-5xl md:grid-cols-2 md:gap-6 lg:max-w-7xl lg:grid-cols-3",
        "rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export { CardDeFrente, GradeDeFrentes };
