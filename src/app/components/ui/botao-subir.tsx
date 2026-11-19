import * as React from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "./utils";

/**
 * BotaoSubir (voltar ao topo)
 *
 * Botão redondo de 56 px, de superfície clara com borda, que aparece quando o rodapé entra na tela e leva a pessoa
 * de volta ao topo (Projeto Piloto e Seja Parceiro). Fica ao lado do botão do WhatsApp: 88 px da direita
 * (92 px a partir de 640 px), na mesma linha de base. Entra subindo 16 px e aparecendo; sem animação e com volta
 * instantânea para quem pede menos movimento.
 *
 * Enquanto está escondido, sai da ordem do Tab (aria-hidden e tabIndex -1). Ao voltar ao topo, o foco vai para
 * o elemento de `focoEm` (por padrão, o <main>), para quem usa teclado ou leitor de tela continuar do começo.
 *
 * alvo            — ref do elemento que faz o botão aparecer (padrão: o último <footer> da página).
 * raiz            — ref de um contêiner com rolagem própria (por exemplo, uma caixa de demonstração).
 * visivel         — força o estado (demonstrações); sem ele, o botão segue o alvo.
 * aoLadoDoWhatsApp — false: canto inferior direito (20/24 px), para páginas sem o botão do WhatsApp.
 * fixo            — false: position absolute, dentro de uma caixa.
 */

export type BotaoSubirProps = {
  alvo?: React.RefObject<HTMLElement | null>;
  raiz?: React.RefObject<HTMLElement | null>;
  visivel?: boolean;
  rotulo?: string;
  focoEm?: string;
  aoLadoDoWhatsApp?: boolean;
  fixo?: boolean;
  className?: string;
};

function BotaoSubir({
  alvo,
  raiz,
  visivel: forcado,
  rotulo = "Voltar ao topo da página",
  focoEm = "main",
  aoLadoDoWhatsApp = true,
  fixo = true,
  className,
}: BotaoSubirProps) {
  const [noAlvo, setNoAlvo] = React.useState(false);

  React.useEffect(() => {
    if (forcado !== undefined || !("IntersectionObserver" in window)) return;
    const rodapes = document.querySelectorAll("footer");
    const el = alvo?.current ?? rodapes[rodapes.length - 1];
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setNoAlvo(e.isIntersecting), { root: raiz?.current ?? null, threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [alvo, raiz, forcado]);

  const visivel = forcado ?? noAlvo;

  const subir = () => {
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const caixa = raiz?.current ?? null;
    (caixa ?? window).scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
    const destino = (caixa ?? document).querySelector<HTMLElement>(focoEm) ?? caixa;
    if (destino) {
      if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      data-slot="botao-subir"
      data-visivel={visivel ? "sim" : "nao"}
      aria-label={rotulo}
      title={rotulo}
      aria-hidden={visivel ? undefined : true}
      tabIndex={visivel ? undefined : -1}
      onClick={subir}
      className={cn(
        fixo ? "fixed" : "absolute",
        "z-[44] inline-flex size-14 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-lg",
        "transition-[opacity,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-graphite-50 dark:hover:bg-accent motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        aoLadoDoWhatsApp ? "bottom-5 right-[5.5rem] sm:bottom-6 sm:right-[5.75rem]" : "bottom-5 right-5 sm:bottom-6 sm:right-6",
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
        className,
      )}
    >
      <ArrowUp aria-hidden className="size-6" />
    </button>
  );
}

export { BotaoSubir };
