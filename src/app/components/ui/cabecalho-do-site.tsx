"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronRight, Menu, X } from "lucide-react";
import { cn } from "./utils";
import { Logo } from "./logo";
import { Button } from "./button";

/**
 * CabecalhoDoSite (cabeçalho do site + menu do celular)
 *
 * O cabeçalho de todas as páginas do site do estúdio (src/compartilhado/partes.ts, menu.ts e menu.css), no modelo
 * documentado em Header e menus: logo, links das páginas, um botão de ação ("Contato") e, no celular, o menu em
 * folha inferior. Use-o no topo de cada página; os links são páginas, e a atual fica marcada.
 *
 * Comportamento:
 * - Computador (a partir de 768 px): pílula clara que flutua no topo (modelo "pilula", padrão) com o símbolo, os links
 *   e a ação; ou faixa de ponta a ponta (modelo "faixa") com o logo completo, que vira símbolo ao rolar.
 * - Celular: faixa com o símbolo, a ação escondida e o botão Menu (44 px); sem `itens` (28/11/2026), sem o botão Menu e
 *   com as ações na faixa. Transparente no topo; ao rolar, fundo do
 *   card a 85% com desfoque e borda. O menu abre uma folha inferior com os links (a página atual no rosa de
 *   selecionado, --primary-suave) e a ação em botão cheio.
 * - Some ao rolar para baixo e volta ao rolar para cima (esconderAoRolar); recebe o foco de volta pelo teclado.
 * - superficie="escura" (sobre foto ou fundo escuro no topo): no topo, links e botões em branco; ao rolar, volta ao claro.
 *
 * Acessibilidade: <header> com <nav aria-label="Principal">, aria-current="page" na página atual (sublinhado + cor,
 * nunca só cor), menu do celular em janela (foco preso, Esc fecha, o foco volta ao botão Menu), alvos de 44 px no
 * celular e movimento só com "menos movimento" desligado.
 */

export type ItemDoCabecalho = { id: string; rotulo: string; href: string };

export type AcaoDoCabecalho = { rotulo: string; href?: string; onClick?: () => void; icone?: React.ReactNode };

export type CabecalhoDoSiteProps = {
  itens: ItemDoCabecalho[];
  /** id do item da página atual. */
  atual?: string;
  acao?: AcaoDoCabecalho;
  modelo?: "pilula" | "faixa";
  /** O que fica atrás do cabeçalho no topo da página. */
  superficie?: "clara" | "escura";
  esconderAoRolar?: boolean;
  inicioHref?: string;
  rotuloInicio?: string;
  /** Logo próprio (padrão: o Logo do DS). */
  logo?: { completo: React.ReactNode; simbolo: React.ReactNode };
  /** Elemento com rolagem própria (demonstrações). Padrão: a janela. */
  raiz?: React.RefObject<HTMLElement | null>;
  /** Posição: "sticky" (padrão, no fluxo da página) ou "absolute" (demonstrações dentro de uma caixa). */
  posicao?: "sticky" | "fixed" | "absolute";
  /** Força a largura de celular ou de computador (demonstrações). Padrão: pela tela. */
  tela?: "auto" | "celular" | "computador";
  textos?: { principal?: string; menu?: string; abrirMenu?: string; fecharMenu?: string };
  className?: string;
  /* Props em comum com o CabecalhoDoSite do DS FindLook (27/11/2026): os dois DS aceitam as mesmas; cada um mantém o
     seu modelo de marca (aqui, a pílula ou a faixa; no FindLook, a faixa). */
  /** Ação secundária, antes da principal (aqui, em texto; no FindLook, a pílula de contorno "Sou Lojista"). */
  acaoSecundaria?: AcaoDoCabecalho;
  /** Faixa transparente sobre a capa até rolar (padrão: sim, no modelo faixa). */
  transparenteNoTopo?: boolean;
  /** Na faixa, o logo vira o símbolo ao rolar (padrão: sim). */
  iconeAoRolar?: boolean;
  /** A partir de qual largura aparece o cabeçalho de computador: "md" (768 px, padrão aqui), "lg" ou "xl". */
  telaLarga?: "md" | "lg" | "xl";
  /** O link do produto (por exemplo, o Link do Next.js) no lugar do <a>. */
  comoLink?: React.ElementType;
  /** Onde a folha do menu do celular é montada (demonstrações). Padrão: body. */
  containerDoMenu?: HTMLElement | null;
};

const ROLADO_APOS = 8;
const SENSIBILIDADE = 6;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const movimento = "transition-[translate,background-color,box-shadow,border-color] duration-[var(--duration-slow)] ease-[var(--ease-snappy)] motion-reduce:transition-none";

function useRolagem(raiz: React.RefObject<HTMLElement | null> | undefined, esconder: boolean, altura: number) {
  const [y, setY] = React.useState(0);
  const [escondido, setEscondido] = React.useState(false);
  const ultimo = React.useRef(0);
  React.useEffect(() => {
    const alvo: HTMLElement | Window = raiz?.current ?? window;
    const ler = () => (alvo instanceof Window ? alvo.scrollY : alvo.scrollTop);
    const aoRolar = () => {
      const atual = ler();
      const delta = atual - ultimo.current;
      if (!esconder || atual < altura) setEscondido(false);
      else if (delta > SENSIBILIDADE) setEscondido(true);
      else if (delta < -SENSIBILIDADE) setEscondido(false);
      if (Math.abs(delta) > SENSIBILIDADE || atual < altura) ultimo.current = atual;
      setY(atual);
    };
    aoRolar();
    alvo.addEventListener("scroll", aoRolar, { passive: true });
    return () => alvo.removeEventListener("scroll", aoRolar);
  }, [raiz, esconder, altura]);
  return { rolado: y > ROLADO_APOS, escondido, mostrar: () => setEscondido(false) };
}

/** Uma ação do cabeçalho (link ou botão) desenhada pelo Button do DS. Fora do componente para não remontar a cada rolagem. */
function BotaoDaAcao({ a, A, variant, forma = "pilula", className, slot, aoClicar }: { a: AcaoDoCabecalho; A: React.ElementType; variant: "default" | "outline" | "ghost"; forma?: "pilula" | "padrao"; className?: string; slot: string; aoClicar?: () => void }) {
  const onClick = () => { aoClicar?.(); a.onClick?.(); };
  return a.href ? (
    <Button asChild variant={variant} forma={forma} quebra="nunca" className={className}>
      <A href={a.href} onClick={onClick} data-slot={slot}>{a.icone}{a.rotulo}</A>
    </Button>
  ) : (
    <Button type="button" variant={variant} forma={forma} quebra="nunca" onClick={onClick} data-slot={slot} className={className}>{a.icone}{a.rotulo}</Button>
  );
}

function CabecalhoDoSite({
  itens,
  atual,
  acao,
  modelo = "pilula",
  superficie = "clara",
  esconderAoRolar = true,
  inicioHref = "/",
  rotuloInicio = "Dani Moscatelli Experience Design Studio: página inicial",
  logo,
  raiz,
  posicao = "sticky",
  tela = "auto",
  textos,
  className,
  acaoSecundaria,
  transparenteNoTopo = true,
  iconeAoRolar = true,
  telaLarga = "md",
  comoLink,
  containerDoMenu,
}: CabecalhoDoSiteProps) {
  const A = (comoLink ?? "a") as React.ElementType;
  const tx = { principal: "Principal", menu: "Menu", abrirMenu: "Abrir menu", fecharMenu: "Fechar menu", ...textos };
  const [aberto, setAberto] = React.useState(false);
  const { rolado, escondido, mostrar } = useRolagem(raiz, esconderAoRolar, 72);
  const escuro = superficie === "escura" && !rolado;
  // Classes por tela: "auto" usa o ponto de quebra md; "celular"/"computador" fixam uma das duas (demonstrações).
  const LARGA = { md: ["hidden md:flex", "flex md:hidden"], lg: ["hidden lg:flex", "flex lg:hidden"], xl: ["hidden xl:flex", "flex xl:hidden"] } as const;
  const soComputador = tela === "auto" ? LARGA[telaLarga][0] : tela === "computador" ? "flex" : "hidden";
  const soCelular = tela === "auto" ? LARGA[telaLarga][1] : tela === "celular" ? "flex" : "hidden";
  const pilulaNoComputador = modelo === "pilula";

  const simbolo = logo?.simbolo ?? <Logo variante="simbolo" className="h-10" />;
  const completo = logo?.completo ?? <Logo variante="horizontal" superficie={escuro ? "escura" : "clara"} className="h-11" />;

  const corLink = escuro
    ? "text-white hover:text-crimson-100 aria-[current=page]:decoration-white"
    : "text-foreground hover:text-primary-text aria-[current=page]:text-primary-text aria-[current=page]:decoration-primary";

  const links = (
    <nav aria-label={tx.principal} className="flex items-center gap-6 lg:gap-8">
      {itens.map(i => (
        <A
          key={i.id}
          href={i.href}
          aria-current={i.id === atual ? "page" : undefined}
          className={cn("whitespace-nowrap rounded-sm text-body-sm font-semibold decoration-2 underline-offset-[6px] transition-colors duration-[var(--duration-fast)] aria-[current=page]:underline", corLink, foco)}
        >
          {i.rotulo}
        </A>
      ))}
    </nav>
  );

  // Ações desenhadas pelo Button do DS (28/11/2026; antes, classes próprias): pílula de contorno escuro na ação,
  // pílula transparente na secundária; no menu do celular, botões de 48 px na largura toda.
  const contornoDaAcao = (sobreEscuro: boolean) => sobreEscuro
    ? "border-white/85 bg-transparent px-6 text-white hover:bg-white hover:text-graphite-900 dark:bg-transparent"
    : "border-foreground bg-transparent px-6 text-foreground hover:bg-foreground hover:text-background dark:bg-transparent dark:border-foreground";
  const botaoAcao = acao && <BotaoDaAcao A={A} a={acao} variant="outline" slot="cabecalho-acao" className={contornoDaAcao(escuro)} />;
  const botaoSecundario = (extra?: string, aoClicar?: () => void) => acaoSecundaria && (
    <BotaoDaAcao A={A} a={acaoSecundaria} variant="ghost" slot="cabecalho-acao-secundaria" aoClicar={aoClicar}
      className={cn("px-4", escuro ? "text-white hover:bg-white/15 hover:text-white" : "text-foreground", extra)} />
  );

  const linkInicio = (conteudo: React.ReactNode, extra?: string) => (
    <A href={inicioHref} aria-label={rotuloInicio} className={cn("flex min-h-11 min-w-11 shrink-0 items-center rounded-sm", foco, extra)}>
      {conteudo}
    </A>
  );

  return (
    <div
      data-slot="cabecalho-do-site"
      data-rolado={rolado ? "sim" : "nao"}
      data-escondido={escondido && !aberto ? "sim" : "nao"}
      onFocusCapture={mostrar}
      className={cn(
        posicao === "sticky" ? "sticky" : posicao,
        "inset-x-0 top-0 z-40 w-full font-sans",
        movimento,
        escondido && !aberto ? "-translate-y-full" : "translate-y-0",
        className,
      )}
    >
      {/* Computador */}
      {pilulaNoComputador ? (
        <div className={cn(soComputador, "justify-center px-6 pt-6")}>
          <header
            className={cn(
              "flex items-center gap-10 rounded-full border border-border bg-card/95 py-2 pl-6 pr-2 backdrop-blur-xl lg:gap-12",
              rolado ? "shadow-lg" : "shadow-md",
              movimento,
            )}
          >
            {linkInicio(simbolo)}
            {/* Dentro da pílula a superfície é sempre clara */}
            <nav aria-label={tx.principal} className="flex items-center gap-6 lg:gap-8">
              {itens.map(i => (
                <A
                  key={i.id}
                  href={i.href}
                  aria-current={i.id === atual ? "page" : undefined}
                  className={cn("whitespace-nowrap rounded-sm text-body-sm font-semibold text-foreground decoration-2 underline-offset-[6px] transition-colors duration-[var(--duration-fast)] hover:text-primary-text aria-[current=page]:text-primary-text aria-[current=page]:underline aria-[current=page]:decoration-primary", foco)}
                >
                  {i.rotulo}
                </A>
              ))}
            </nav>
            {botaoSecundario("text-foreground hover:bg-accent")}
            {acao && <BotaoDaAcao A={A} a={acao} variant="outline" slot="cabecalho-acao" className={contornoDaAcao(false)} />}
          </header>
        </div>
      ) : (
        <div
          className={cn(
            soComputador,
            "border-b",
            rolado || !transparenteNoTopo ? "border-border bg-card/85 shadow-sm backdrop-blur-xl" : "border-transparent",
            movimento,
          )}
        >
          <header className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-10">
            {linkInicio(rolado && iconeAoRolar ? <span className="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">{simbolo}</span> : completo)}
            <div className="flex items-center gap-6 lg:gap-8">
              {links}
              {acaoSecundaria && <span className="-mr-4 flex">{botaoSecundario()}</span>}
              {botaoAcao}
            </div>
          </header>
        </div>
      )}

      {/* Celular */}
      <div
        className={cn(
          soCelular,
          "border-b",
          rolado || aberto ? "border-border bg-card/85 shadow-sm backdrop-blur-xl" : "border-transparent",
          movimento,
        )}
      >
        <header className="flex h-16 w-full items-center justify-between gap-4 px-4">
          {linkInicio(simbolo)}
          {/* Sem itens (28/11/2026): não há o que pôr no menu; o botão Menu some e as ações ficam na faixa. */}
          {itens.length === 0 ? (
            <div className="flex items-center gap-2">
              {acaoSecundaria && <BotaoDaAcao A={A} a={acaoSecundaria} variant="ghost" slot="cabecalho-acao-secundaria" className={cn("px-4", escuro ? "text-white hover:bg-white/15 hover:text-white" : "text-foreground")} />}
              {acao && <BotaoDaAcao A={A} a={acao} variant="outline" slot="cabecalho-acao" className={contornoDaAcao(escuro)} />}
            </div>
          ) : (
          <DialogPrimitive.Root open={aberto} onOpenChange={setAberto}>
            <DialogPrimitive.Trigger
              aria-label={tx.abrirMenu}
              className={cn(
                "-mr-1 flex size-11 items-center justify-center rounded-full transition-colors duration-[var(--duration-fast)]",
                escuro && !aberto ? "text-white hover:bg-white/15" : "text-foreground hover:bg-accent",
                foco,
              )}
            >
              <Menu aria-hidden className="size-6" />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal container={containerDoMenu ?? undefined}>
              <DialogPrimitive.Overlay
                data-slot="cabecalho-menu-fundo"
                className="fixed inset-0 z-50 bg-sobreposicao data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none"
              />
              <DialogPrimitive.Content
                data-slot="cabecalho-menu"
                aria-describedby={undefined}
                className={cn(
                  "fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-xl border-t border-border bg-card px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 text-card-foreground shadow-xl outline-none",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom duration-[var(--duration-slow)] ease-[var(--ease-snappy)] motion-reduce:animate-none",
                )}
              >
                <div className="flex items-center justify-between">
                  <span aria-hidden className="ml-[calc(50%-1.25rem)] h-1 w-10 rounded-full bg-graphite-200" />
                  <DialogPrimitive.Close aria-label={tx.fecharMenu} className={cn("flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", foco)}>
                    <X aria-hidden className="size-5" />
                  </DialogPrimitive.Close>
                </div>
                <DialogPrimitive.Title className="sr-only">{tx.menu}</DialogPrimitive.Title>
                <nav aria-label={tx.principal} className="mt-1 grid gap-1 overflow-y-auto">
                  {itens.map(i => (
                    <A
                      key={i.id}
                      href={i.href}
                      aria-current={i.id === atual ? "page" : undefined}
                      onClick={() => setAberto(false)}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-md px-4 text-body font-semibold text-foreground transition-colors duration-[var(--duration-fast)] hover:bg-accent",
                        "aria-[current=page]:bg-primary-suave aria-[current=page]:text-primary-text",
                        foco,
                      )}
                    >
                      {i.rotulo}
                      <ChevronRight aria-hidden className="size-4 text-primary-text" />
                    </A>
                  ))}
                </nav>
                {acao && <BotaoDaAcao A={A} a={acao} variant="default" forma="padrao" slot="cabecalho-acao" aoClicar={() => setAberto(false)} className="mt-4 h-12 w-full text-body" />}
                {acaoSecundaria && <BotaoDaAcao A={A} a={acaoSecundaria} variant="outline" forma="padrao" slot="cabecalho-acao-secundaria" aoClicar={() => setAberto(false)} className={cn("mt-2 h-12 w-full text-body", !acao && "mt-4")} />}
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
          )}
        </header>
      </div>
    </div>
  );
}

export { CabecalhoDoSite };
