import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

/**
 * PilulaDeAcao (pílula de ação flutuante)
 *
 * Botão em pílula, na primária, fixo ao lado do botão do WhatsApp, com a ação principal da página: "Quero ser
 * parceiro" (Seja Parceiro) e "Cadastrar empresa" (Projeto Piloto). Do site: #cta-flutuante e .faixa-flutuante
 * (src/rede-parceiros-inicio.ts e .css, src/projeto-piloto.ts e .css).
 *
 * Posição (layout "auto", como no site):
 *  - até 639 px: ocupa a largura à esquerda do WhatsApp (20 px da borda esquerda, 88 px da direita), 24 px da base,
 *    alinhada pelo centro com o botão do WhatsApp;
 *  - a partir de 640 px: largura do texto, 96 px da direita (16 px antes do WhatsApp), 28 px da base.
 *  - "celular" e "computador" fixam um dos dois, para demonstrações.
 * Faixa: até 767 px, uma faixa grafite com desfoque sobe do pé da tela por trás dos flutuantes enquanto a pílula
 *  aparece, para ela ler bem sobre qualquer conteúdo (prop faixa).
 *
 * Quando aparece (sem `visivel`):
 *  - mostrarApos: aparece quando esse elemento sai da tela (o botão do hero da página), para não repetir a ação;
 *  - esconderCom: some enquanto qualquer um desses elementos está na tela (o botão do convite no fim da página);
 *  - sempreAte: abaixo dessa largura de tela ela fica sempre visível, sem esperar o hero (Seja Parceiro: 1023;
 *    Projeto Piloto: 767). Os elementos de esconderCom continuam valendo.
 * Escondida, sai da ordem do Tab e dos leitores de tela. Entra subindo 16 px e aparecendo (0,3 s / 0,4 s); com
 * movimento reduzido, aparece sem transição.
 *
 * fixo — false: position absolute, dentro de uma caixa (demonstrações). raiz: contêiner com rolagem própria.
 */

export type PilulaDeAcaoProps = {
  rotulo: string;
  href?: string;
  onClick?: () => void;
  /** Ícone (padrão: seta para a direita, depois do texto). */
  icone?: React.ReactNode;
  iconeAntes?: boolean;
  visivel?: boolean;
  mostrarApos?: React.RefObject<HTMLElement | null>;
  esconderCom?: React.RefObject<HTMLElement | null>[];
  sempreAte?: number;
  raiz?: React.RefObject<HTMLElement | null>;
  layout?: "auto" | "celular" | "computador";
  faixa?: boolean;
  fixo?: boolean;
  className?: string;
};

const LAYOUT = {
  auto: { pilula: "left-5 right-[5.5rem] bottom-6 sm:left-auto sm:right-24 sm:bottom-7", faixa: "md:hidden" },
  celular: { pilula: "left-5 right-[5.5rem] bottom-6", faixa: "" },
  computador: { pilula: "right-24 bottom-7", faixa: "hidden" },
};

function usePilulaVisivel({ visivel, mostrarApos, esconderCom, sempreAte, raiz }: Pick<PilulaDeAcaoProps, "visivel" | "mostrarApos" | "esconderCom" | "sempreAte" | "raiz">) {
  const [auto, setAuto] = React.useState(false);
  React.useEffect(() => {
    if (visivel !== undefined) return;
    const mq = sempreAte ? window.matchMedia(`(max-width: ${sempreAte}px)`) : null;
    const root = raiz?.current ?? null;
    let heroNaTela = !!mostrarApos?.current;
    const naTela = new Map<Element, boolean>();
    const atualizar = () => {
      const bloqueio = [...naTela.values()].some(Boolean);
      setAuto(!bloqueio && (!!mq?.matches || !heroNaTela));
    };
    if (!("IntersectionObserver" in window)) { setAuto(true); return; }
    const obs: IntersectionObserver[] = [];
    if (mostrarApos?.current) {
      const o = new IntersectionObserver(([e]) => { heroNaTela = e.isIntersecting; atualizar(); }, { root, threshold: 0 });
      o.observe(mostrarApos.current);
      obs.push(o);
    }
    (esconderCom ?? []).forEach(r => {
      const el = r.current;
      if (!el) return;
      naTela.set(el, false);
      const o = new IntersectionObserver(([e]) => { naTela.set(el, e.isIntersecting); atualizar(); }, { root, threshold: 0 });
      o.observe(el);
      obs.push(o);
    });
    mq?.addEventListener("change", atualizar);
    atualizar();
    return () => { obs.forEach(o => o.disconnect()); mq?.removeEventListener("change", atualizar); };
  }, [visivel, mostrarApos, esconderCom, sempreAte, raiz]);
  return visivel ?? auto;
}

function PilulaDeAcao({
  rotulo,
  href,
  onClick,
  icone,
  iconeAntes = false,
  visivel: forcado,
  mostrarApos,
  esconderCom,
  sempreAte,
  raiz,
  layout = "auto",
  faixa = true,
  fixo = true,
  className,
}: PilulaDeAcaoProps) {
  const visivel = usePilulaVisivel({ visivel: forcado, mostrarApos, esconderCom, sempreAte, raiz });
  const l = LAYOUT[layout];
  const simbolo = icone ?? <ArrowRight className="size-[1.125rem]" />;
  const conteudo = (
    <>
      {iconeAntes && simbolo}
      <span>{rotulo}</span>
      {!iconeAntes && simbolo}
    </>
  );
  const ocultar = { "aria-hidden": visivel ? undefined : true, tabIndex: visivel ? undefined : -1 } as const;
  const classe = cn(
    fixo ? "fixed" : "absolute",
    "z-[44] h-12 rounded-full px-5 text-sm font-semibold whitespace-nowrap shadow-lg has-[>svg]:px-5",
    "transition-[opacity,transform,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
    l.pilula,
    visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
    className,
  );
  return (
    <>
      {faixa && layout !== "computador" && (
        <div
          aria-hidden
          data-slot="pilula-de-acao-faixa"
          className={cn(
            fixo ? "fixed" : "absolute",
            "pointer-events-none inset-x-0 -bottom-24 z-[43] h-[13.5rem] backdrop-blur-[8px] transition-opacity duration-300 motion-reduce:transition-none",
            l.faixa,
            visivel ? "opacity-100" : "opacity-0",
          )}
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--graphite-950) 60%, transparent) 0, color-mix(in srgb, var(--graphite-950) 60%, transparent) 6rem, color-mix(in srgb, var(--graphite-950) 35%, transparent) 9.375rem, transparent 13.5rem)",
            maskImage: "linear-gradient(to top, #000 9rem, transparent 13.5rem)",
            WebkitMaskImage: "linear-gradient(to top, #000 9rem, transparent 13.5rem)",
          }}
        />
      )}
      {href ? (
        <Button asChild data-slot="pilula-de-acao" data-visivel={visivel ? "sim" : "nao"} className={classe}>
          <a href={href} onClick={onClick} {...ocultar}>{conteudo}</a>
        </Button>
      ) : (
        <Button type="button" data-slot="pilula-de-acao" data-visivel={visivel ? "sim" : "nao"} onClick={onClick} className={classe} {...ocultar}>
          {conteudo}
        </Button>
      )}
    </>
  );
}

export { PilulaDeAcao };
