"use client";

import * as React from "react";
import { Bell, ChevronDown, ChevronRight, ExternalLink, HelpCircle, Menu, Search } from "lucide-react";
import { cn } from "./utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

/**
 * Casca do painel (área restrita, painéis de produto): a moldura aprovada pela dona do produto para o site do design
 * system e para a área restrita, trazida do FindLook Design System (ui/painel-shell.tsx) com as cores deste DS.
 * BarraSuperiorDoPainel branca de ponta a ponta no alto (logo à esquerda; busca, notificações e perfil à direita) e,
 * embaixo dela, o menu lateral branco com linha à direita, sobre o fundo cinza da página (--background). No topo do
 * menu, o botão "≡ Menu" (BotaoRecolherMenu, dentro de TopoDoMenu) recolhe e expande: expandido (ícone + nome, 240 px)
 * ou recolhido (só ícones, 64 px, com dica ao lado), a partir de 1024 px; o menu empurra o conteúdo, nunca o cobre.
 * Item ativo e hover iguais aos do menu do site do DS: ativo no rosa do meio (--primary-suave) com texto
 * --primary-text, que continua rosa com o mouse em cima; hover dos outros itens no cinza claro (--accent). Contadores redondos em --primary (ContadorDoPainel), no item, no grupo e no sino.
 * MenuLateralProvider guarda a escolha (localStorage, uma chave por painel). Fora do MenuLateral (gaveta do celular,
 * em um SidePanel side="left"), tudo aparece expandido. O perfil (GatilhoDaConta) fica sempre no cabeçalho, à direita.
 */

/* ── Menu lateral recolhível ─────────────────────────────────── */
// Mesmas larguras do menu do site do design system (w-60 / w-16).
const LARGURA_EXPANDIDO = 240;
const LARGURA_RECOLHIDO = 64;
const MIDIA_RECOLHIVEL = "(min-width: 1024px)";

const useLayoutSeguro = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type MenuLateralContexto = {
  /** Escolha da pessoa (vale só a partir de 1024 px). */
  recolhido: boolean;
  setRecolhido: (v: boolean) => void;
  alternar: () => void;
  /** Id do <nav> do menu lateral, para o aria-controls do botão. */
  idDoMenu: string;
  /** true depois de ler a escolha guardada: só então a largura passa a animar (não anima ao abrir a página). */
  restaurado: boolean;
};

const ContextoDoMenuLateral = React.createContext<MenuLateralContexto | null>(null);
/** Dentro de um MenuLateral: se ele está recolhido agora (escolha da pessoa + tela larga). */
const ContextoDoRecolhido = React.createContext<{ recolhido: boolean; dentro: boolean; podeRecolher: boolean }>({ recolhido: false, dentro: false, podeRecolher: false });

function lerEscolha(chave?: string): boolean | null {
  if (!chave) return null;
  try {
    const v = window.localStorage.getItem(chave);
    return v === "1" ? true : v === "0" ? false : null;
  } catch {
    return null;
  }
}

function guardarEscolha(chave: string | undefined, v: boolean) {
  if (!chave) return;
  try {
    window.localStorage.setItem(chave, v ? "1" : "0");
  } catch {
    /* sem armazenamento (janela privada, bloqueio): a escolha vale só nesta visita */
  }
}

type MenuLateralProviderProps = {
  children: React.ReactNode;
  /** Chave no localStorage, uma por painel (ex.: "dm-admin-menu-recolhido"). Sem chave, não guarda. */
  chave?: string;
  /** Estado inicial quando não há escolha guardada. */
  padrao?: boolean;
  /** Para controlar de fora (opcional). */
  recolhido?: boolean;
  onRecolhidoChange?: (v: boolean) => void;
};

function MenuLateralProvider({ children, chave, padrao = false, recolhido: controlado, onRecolhidoChange }: MenuLateralProviderProps) {
  const [interno, setInterno] = React.useState(padrao);
  const [restaurado, setRestaurado] = React.useState(false);
  const idDoMenu = `menu-lateral-${React.useId().replace(/:/g, "")}`;
  const recolhido = controlado ?? interno;

  // Lê a escolha guardada antes de a tela ser pintada (sem piscar) e só depois liga a animação da largura.
  useLayoutSeguro(() => {
    const salvo = lerEscolha(chave);
    if (salvo !== null && controlado === undefined) setInterno(salvo);
    const id = window.requestAnimationFrame(() => setRestaurado(true));
    return () => window.cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  const setRecolhido = React.useCallback(
    (v: boolean) => {
      if (controlado === undefined) setInterno(v);
      guardarEscolha(chave, v);
      onRecolhidoChange?.(v);
    },
    [chave, controlado, onRecolhidoChange],
  );
  const alternar = React.useCallback(() => setRecolhido(!recolhido), [recolhido, setRecolhido]);

  const valor = React.useMemo(() => ({ recolhido, setRecolhido, alternar, idDoMenu, restaurado }), [recolhido, setRecolhido, alternar, idDoMenu, restaurado]);
  return <ContextoDoMenuLateral.Provider value={valor}>{children}</ContextoDoMenuLateral.Provider>;
}

/** Estado do menu lateral (fora de um MenuLateralProvider, devolve sempre expandido). */
function useMenuLateral(): MenuLateralContexto {
  return (
    React.useContext(ContextoDoMenuLateral) ?? { recolhido: false, setRecolhido: () => {}, alternar: () => {}, idDoMenu: "", restaurado: true }
  );
}

/** Se o componente está dentro de um MenuLateral recolhido agora. Use para trocar o logo pelo símbolo, por exemplo. */
function useMenuRecolhido() {
  return React.useContext(ContextoDoRecolhido).recolhido;
}

function useTelaLarga(midia: string) {
  const [larga, setLarga] = React.useState(false);
  useLayoutSeguro(() => {
    if (typeof window.matchMedia !== "function") { setLarga(true); return; }
    const mq = window.matchMedia(midia);
    const mudar = () => setLarga(mq.matches);
    mudar();
    mq.addEventListener("change", mudar);
    return () => mq.removeEventListener("change", mudar);
  }, [midia]);
  return larga;
}

type MenuLateralProps = React.ComponentProps<"aside"> & {
  /** A partir de qual largura de tela o menu pode recolher (padrão: 1024 px). Abaixo dela, fica sempre expandido. */
  midia?: string;
  /**
   * Página que rola inteira (área restrita): altura do cabeçalho fixo acima do menu, em px (64 para a
   * BarraSuperiorDoPainel). O menu vira uma coluna branca da altura da página toda (nunca termina no meio dela) e o
   * conteúdo dele fica grudado logo abaixo do cabeçalho enquanto a página rola. Sem ele, o menu ocupa a altura do
   * contêiner (h-full), para painéis com rolagem própria.
   */
  grudarAbaixoDe?: number;
};

/**
 * Coluna do menu lateral fixo (telas largas). Muda de largura entre 240 px e 64 px com os tokens de movimento;
 * com "menos movimento", a troca é instantânea. Use dentro de um MenuLateralProvider, numa linha flex ao lado do
 * conteúdo (o menu empurra o conteúdo). Esconder em telas estreitas (onde o menu vira gaveta) fica por conta da página.
 */
const MenuLateral = React.forwardRef<HTMLElement, MenuLateralProps>(function MenuLateral({ midia = MIDIA_RECOLHIVEL, grudarAbaixoDe, className, style, children, ...props }, ref) {
  const { recolhido: escolha, restaurado } = useMenuLateral();
  const larga = useTelaLarga(midia);
  const recolhido = escolha && larga;
  // A largura só anima depois que o menu já apareceu uma vez com a escolha guardada (nada de animação ao abrir a página).
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => {
    const id = window.requestAnimationFrame(() => setMontado(true));
    return () => window.cancelAnimationFrame(id);
  }, []);
  const valor = React.useMemo(() => ({ recolhido, dentro: true, podeRecolher: larga }), [recolhido, larga]);
  return (
    <aside
      ref={ref}
      aria-label="Menu lateral"
      data-slot="menu-lateral"
      data-recolhido={recolhido ? "" : undefined}
      className={cn(
        "flex shrink-0 flex-col border-r border-border bg-sidebar",
        // Coluna da página: estica até o fim da página; clip (e não hidden) para o conteúdo poder grudar no topo.
        grudarAbaixoDe === undefined ? "h-full overflow-hidden" : "self-stretch overflow-x-clip",
        restaurado && montado && "transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-in-out)] motion-reduce:transition-none",
        className,
      )}
      style={{ width: recolhido ? LARGURA_RECOLHIDO : LARGURA_EXPANDIDO, ...style }}
      {...props}
    >
      <ContextoDoRecolhido.Provider value={valor}>
        {grudarAbaixoDe === undefined ? children : (
          <div data-slot="menu-lateral-grudado" className="sticky flex min-h-0 flex-col overflow-hidden" style={{ top: grudarAbaixoDe, height: `calc(100dvh - ${grudarAbaixoDe}px)` }}>
            {children}
          </div>
        )}
      </ContextoDoRecolhido.Provider>
    </aside>
  );
});

/** <nav> do menu lateral, com o id que o BotaoRecolherMenu controla e a rolagem própria. */
const NavDoMenu = React.forwardRef<HTMLElement, React.ComponentProps<"nav">>(function NavDoMenu({ className, ...props }, ref) {
  const { idDoMenu } = useMenuLateral();
  const { dentro, recolhido } = React.useContext(ContextoDoRecolhido);
  return (
    <nav
      ref={ref}
      id={dentro && idDoMenu ? idDoMenu : undefined}
      data-slot="nav-do-menu"
      className={cn("min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-2 [scrollbar-width:thin]", recolhido ? "px-2" : "px-3", className)}
      {...props}
    />
  );
});

/** Linha fina entre grupos do menu. */
function DivisorDoMenu({ className }: { className?: string }) {
  return <div aria-hidden data-slot="divisor-do-menu" className={cn("my-2 border-t border-border", className)} />;
}

/**
 * Dica ao lado de um elemento do menu recolhido (mouse e foco do teclado). Fica sempre na árvore e só abre quando
 * `ativa`: assim o elemento não é recriado ao recolher ou expandir, e o foco do teclado não se perde.
 */
function DicaDoMenu({ texto, ativa = true, children }: { texto: React.ReactNode; ativa?: boolean; children: React.ReactElement }) {
  const [aberta, setAberta] = React.useState(false);
  return (
    <Tooltip open={ativa && aberta} onOpenChange={setAberta}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" sideOffset={10}>{texto}</TooltipContent>
    </Tooltip>
  );
}

/* ── Contador (item do menu, grupo e sino) ───────────────────── */
/** Mostra até 99; acima disso, "99+". */
function textoDoContador(n: number) {
  return n > 99 ? "99+" : String(n);
}

type ContadorDoPainelProps = React.ComponentProps<"span"> & {
  valor: number;
  /** Como o número é lido ("novos", "não lidas"…), só para leitores de tela. Sem ele, o contador é decorativo. */
  rotulo?: string;
  /** Anel na cor do fundo em volta (2 px), para o contador sobreposto a um ícone (sino). */
  anel?: boolean;
};

/**
 * Contador redondo do painel: fundo vermelho e número branco em negrito, números tabulares. Círculo de 20 px com um
 * algarismo; com dois ou mais, vira pílula com as pontas redondas (largura mínima de 20 px, nunca um oval alto).
 * Acima de 99, "99+". O mesmo contador do item do menu, do grupo e do sino de notificações.
 * Cor: --primary (#CC4545, 4,66:1 com o branco, desde a decisão de cores da dona do produto de 27/11/2026; antes, com
 * #D44D4D, o contador usava --primary-text). O ponto do menu recolhido, sem texto, também é --primary.
 */
function ContadorDoPainel({ valor, rotulo, anel, className, ...props }: ContadorDoPainelProps) {
  return (
    <span
      data-slot="contador-do-painel"
      className={cn(
        "inline-flex h-5 min-w-5 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-primary px-1.5 text-caption font-bold leading-none tabular-nums text-primary-foreground",
        anel && "ring-2 ring-card",
        className,
      )}
      {...props}
    >
      {textoDoContador(valor)}
      {rotulo && <span className="sr-only"> {rotulo}</span>}
    </span>
  );
}

/**
 * Botão "≡ Menu" do topo do menu lateral, no estilo do site do design system: recolhe e expande o menu.
 * Só aparece dentro do MenuLateral e em tela larga; na gaveta do celular, não aparece.
 * O nome acessível diz a ação ("Recolher menu" / "Expandir menu") e contém o texto visível "Menu".
 */
type BotaoRecolherMenuProps = React.ComponentProps<"button"> & { rotulo?: string; rotuloRecolher?: string; rotuloExpandir?: string };
const BotaoRecolherMenu = React.forwardRef<HTMLButtonElement, BotaoRecolherMenuProps>(function BotaoRecolherMenu(
  { className, onClick, rotulo = "Menu", rotuloRecolher = "Recolher menu", rotuloExpandir = "Expandir menu", ...props },
  ref,
) {
  const { recolhido: escolha, alternar, idDoMenu } = useMenuLateral();
  const { recolhido, dentro, podeRecolher } = React.useContext(ContextoDoRecolhido);
  if (!dentro || !podeRecolher) return null;
  const acao = escolha ? rotuloExpandir : rotuloRecolher;
  const botao = (
    <button
      ref={ref}
      type="button"
      data-slot="botao-recolher-menu"
      aria-expanded={!escolha}
      aria-controls={idDoMenu || undefined}
      aria-label={acao}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented) alternar(); }}
      className={cn(
        "flex h-9 items-center gap-2 rounded-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        recolhido ? "w-9 justify-center" : "w-full pr-2",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center"><Menu className="h-[18px] w-[18px]" /></span>
      {!recolhido && <span aria-hidden className="text-xs font-medium uppercase tracking-wider">{rotulo}</span>}
    </button>
  );
  return <DicaDoMenu texto={acao} ativa={recolhido}>{botao}</DicaDoMenu>;
});

/** Topo do menu lateral (como no site do DS): o botão "≡ Menu", centralizado quando recolhido. */
function TopoDoMenu({ className, children, ...rotulos }: { className?: string; children?: React.ReactNode } & Pick<BotaoRecolherMenuProps, "rotulo" | "rotuloRecolher" | "rotuloExpandir">) {
  const { recolhido, dentro, podeRecolher } = React.useContext(ContextoDoRecolhido);
  if (!dentro || !podeRecolher) return children ? <div className={className}>{children}</div> : null;
  return (
    <div data-slot="topo-do-menu" className={cn("flex h-12 shrink-0 items-center", recolhido ? "justify-center px-2" : "px-3", className)}>
      <BotaoRecolherMenu {...rotulos} />
      {children}
    </div>
  );
}

/* ── Barra superior do painel (como a do site do design system) ── */
/**
 * Faixa branca de ponta a ponta no alto do painel, acima do menu lateral, com linha fina embaixo. O logo fica à
 * esquerda; busca e notificações à direita; o perfil (GatilhoDaConta) sempre na ponta direita.
 */
function BarraSuperiorDoPainel({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header data-slot="barra-superior-do-painel" className={cn("flex h-16 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:gap-3 sm:px-4", className)} {...props}>
      {children}
    </header>
  );
}

/* ── Iniciais e avatar ───────────────────────────────────────── */
function iniciais(nome: string) {
  return nome.split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]!.toUpperCase()).join("");
}

/** Avatar do painel (Avatar do DS, 36 px): foto, ou as iniciais na base rosa clara com texto --primary-text. */
function AvatarPainel({ nome, foto, className }: { nome: string; foto?: string; className?: string }) {
  return (
    <Avatar aria-hidden data-slot="avatar-painel" className={cn("size-9", className)}>
      {foto && <AvatarImage src={foto} alt="" className="object-cover" />}
      <AvatarFallback className="bg-[var(--primary-muted)] text-label font-bold text-primary-text">{iniciais(nome)}</AvatarFallback>
    </Avatar>
  );
}

/* ── Item e grupo do menu ────────────────────────────────────── */
type ItemDoMenuProps = React.ComponentProps<"a"> & {
  /** Ícone (16 px). Obrigatório nos itens de primeiro nível (o menu recolhido mostra só ele); opcional dentro de um grupo. */
  icone?: React.ReactNode;
  ativo?: boolean;
  /** Número de novidades (mensagens, candidaturas…). 0 ou vazio não mostra. */
  contador?: number;
  /** Como o contador é lido ("novos", "não lidas"…). */
  rotuloContador?: string;
  /** Elemento do link (padrão "a"). Use o Link do roteador do produto, que recebe href ou to e repassa o ref. */
  as?: React.ElementType;
};

const classeDoItem = (ativo: boolean | undefined, recolhido: boolean, dentro: boolean) =>
  cn(
    // Fora do MenuLateral (gaveta do celular e do tablet), alvo de toque de 44 px; no menu fixo do computador, 36 px.
    dentro ? "min-h-9" : "min-h-11",
    "group relative flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-body-sm font-medium transition-[background-color,color] duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // Regra dos rosas claros (dona do produto, 27/11/2026): ativo no rosa do meio (--primary-suave) com --primary-text,
    // e continua rosa com o mouse em cima; hover dos outros itens no cinza claro (--accent), nunca rosa.
    ativo ? "bg-[var(--primary-suave)] text-primary-text" : "text-muted-foreground hover:bg-accent hover:text-foreground",
    recolhido && "justify-center px-0",
  );

const ItemDoMenu = React.forwardRef<HTMLAnchorElement, ItemDoMenuProps>(function ItemDoMenu({ icone, ativo, contador, rotuloContador = "novos", as: Elemento = "a", className, children, ...props }, ref) {
  const { recolhido, dentro } = React.useContext(ContextoDoRecolhido);
  const item = (
    <Elemento
      ref={ref}
      data-slot="item-do-menu"
      aria-current={ativo ? "page" : undefined}
      className={cn(classeDoItem(ativo, recolhido, dentro), className)}
      {...props}
    >
      {icone && (
        <span aria-hidden className="relative flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
          {icone}
          {recolhido && !!contador && <span data-slot="ponto-do-contador" className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-sidebar" />}
        </span>
      )}
      {recolhido ? (
        <span className="sr-only">{children}{!!contador && `, ${contador} ${rotuloContador}`}</span>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate animate-in fade-in-0 duration-[var(--duration-normal)] motion-reduce:animate-none">{children}</span>
          {!!contador && <ContadorDoPainel valor={contador} rotulo={rotuloContador} />}
        </>
      )}
    </Elemento>
  );
  // Fora de um MenuLateral (gaveta do celular, exemplos), o item nunca recolhe: não precisa de dica.
  if (!dentro) return item;
  return <DicaDoMenu texto={<>{children}{!!contador && `, ${contador} ${rotuloContador}`}</>} ativa={recolhido}>{item}</DicaDoMenu>;
});

type GrupoDoMenuProps = {
  titulo?: string;
  children: React.ReactNode;
  className?: string;
  /**
   * Grupo que abre e fecha, como no site do design system: ícone, nome e seta; os itens ficam embaixo, numa linha-guia
   * à esquerda. Recolhido, mostra só o ícone (com dica); um clique expande o menu e abre o grupo. Quando fechado (ou com
   * o menu recolhido) e um item de dentro está ativo, o grupo aparece ativo.
   */
  expansivel?: boolean;
  icone?: React.ReactNode;
  padraoAberto?: boolean;
  aberto?: boolean;
  onAbertoChange?: (v: boolean) => void;
  /** Contador do grupo (soma das novidades dos itens), antes da seta. */
  contador?: number;
  rotuloContador?: string;
  /** Força o grupo a aparecer ativo (quando a página atual é do grupo, mas não é um item dele). */
  ativo?: boolean;
};

function GrupoDoMenu({ titulo, children, className, expansivel, icone, padraoAberto = false, aberto: abertoControlado, onAbertoChange, contador, rotuloContador = "novos", ativo }: GrupoDoMenuProps) {
  const id = React.useId();
  const { recolhido, dentro } = React.useContext(ContextoDoRecolhido);
  const { setRecolhido } = useMenuLateral();
  const [abertoInterno, setAbertoInterno] = React.useState(padraoAberto);
  if (!expansivel) {
    return (
      <div data-slot="grupo-do-menu" className={cn("space-y-0.5", className)} role="group" aria-labelledby={titulo ? id : undefined}>
        {titulo && <p id={id} className={recolhido ? "sr-only" : "px-3 pb-1 pt-3 text-label font-semibold text-muted-foreground"}>{titulo}</p>}
        {/* Recolhido: o título vira uma linha fina (que some se já houver um divisor logo antes do grupo). */}
        {titulo && recolhido && <div aria-hidden data-slot="divisor-do-grupo" className="my-2 border-t border-border [.border-t+[data-slot=grupo-do-menu]_&]:hidden" />}
        {children}
      </div>
    );
  }
  const aberto = abertoControlado ?? abertoInterno;
  const mudar = (v: boolean) => { if (abertoControlado === undefined) setAbertoInterno(v); onAbertoChange?.(v); };
  const filhoAtivo = ativo || React.Children.toArray(children).some(c => React.isValidElement<{ ativo?: boolean }>(c) && !!c.props.ativo);
  const mostrarFilhos = aberto && !recolhido;
  const destacado = filhoAtivo && !mostrarFilhos;
  const idFilhos = `${id}-itens`;
  const leituraDoContador = contador ? `, ${contador} ${rotuloContador}` : "";
  const botao = (
    <button
      type="button"
      id={id}
      data-slot="grupo-do-menu-gatilho"
      aria-expanded={mostrarFilhos}
      aria-controls={idFilhos}
      onClick={() => { if (recolhido) { setRecolhido(false); mudar(true); } else mudar(!aberto); }}
      className={classeDoItem(destacado, recolhido, dentro)}
    >
      {icone && (
        <span aria-hidden className="relative flex h-4 w-4 shrink-0 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
          {icone}
          {recolhido && !!contador && <span data-slot="ponto-do-contador" className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-sidebar" />}
        </span>
      )}
      {recolhido ? (
        <span className="sr-only">{titulo}{leituraDoContador}</span>
      ) : (
        <>
          <span className="min-w-0 flex-1 truncate">{titulo}</span>
          {!!contador && <ContadorDoPainel valor={contador} rotulo={rotuloContador} />}
          <ChevronRight aria-hidden className={cn("h-3.5 w-3.5 shrink-0 transition-transform duration-150 motion-reduce:transition-none", aberto && "rotate-90")} />
        </>
      )}
    </button>
  );
  return (
    <div data-slot="grupo-do-menu" data-expansivel="" className={cn("space-y-0.5", className)}>
      {dentro ? <DicaDoMenu texto={<>{titulo}{leituraDoContador}</>} ativa={recolhido}>{botao}</DicaDoMenu> : botao}
      {mostrarFilhos && (
        <div id={idFilhos} role="group" aria-labelledby={id} className="ml-3 space-y-0.5 border-l border-border pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Card de ajuda (rodapé do menu) ──────────────────────────── */
function CardDeAjuda({ titulo = "Precisa de ajuda?", texto = "Acesse a central de suporte", href = "#", className }: { titulo?: string; texto?: string; href?: string; className?: string }) {
  const recolhido = useMenuRecolhido();
  if (recolhido) {
    return (
      <DicaDoMenu texto={`${titulo} ${texto}`}>
        <a
          data-slot="card-de-ajuda"
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "mx-auto flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className,
          )}
        >
          <HelpCircle aria-hidden className="h-5 w-5" />
          <span className="sr-only">{titulo} {texto} (abre em nova aba)</span>
        </a>
      </DicaDoMenu>
    );
  }
  return (
    <a
      data-slot="card-de-ajuda"
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <HelpCircle aria-hidden className="h-6 w-6 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="block text-body-sm font-bold text-foreground">{titulo}</span>
        <span className="block text-label text-muted-foreground">{texto}</span>
      </span>
      <ExternalLink aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}

/* ── Barra superior: busca, sino e conta ─────────────────────── */
function CampoDeBuscaGlobal({ placeholder = "Buscar no painel", atalho = "Ctrl + K", onAbrir, className }: { placeholder?: string; atalho?: string; onAbrir?: () => void; className?: string }) {
  return (
    <button
      type="button"
      data-slot="busca-global"
      onClick={onAbrir}
      aria-keyshortcuts={atalho === "Ctrl + K" ? "Control+K" : undefined}
      className={cn(
        "flex h-10 w-full items-center gap-3 rounded-md border border-border bg-card px-3 text-left text-body-sm text-muted-foreground transition-colors hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <Search aria-hidden className="h-4 w-4 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{placeholder}</span>
      {atalho && <kbd className="hidden shrink-0 rounded-sm border border-border bg-muted px-1.5 py-0.5 font-sans text-caption font-medium sm:inline">{atalho}</kbd>}
    </button>
  );
}

type BotaoDeNotificacoesProps = React.ComponentProps<"button"> & {
  naoLidas?: number;
  /** "numero" (padrão): contador redondo com o número, no canto do sino. "ponto": só um ponto, sem número. */
  indicador?: "numero" | "ponto";
};

/**
 * Sino de notificações (botão redondo de 44 px, o alvo de toque mínimo). Com não lidas, o ContadorDoPainel fica sobre o
 * canto superior direito do sino (centro do contador no canto do ícone), com anel de 2 px na cor do cabeçalho. O nome acessível diz quantas
 * ("Notificações, 7 não lidas"); o número visível é decorativo para leitores de tela.
 */
const BotaoDeNotificacoes = React.forwardRef<HTMLButtonElement, BotaoDeNotificacoesProps>(function BotaoDeNotificacoes({ naoLidas = 0, indicador = "numero", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={naoLidas ? `Notificações, ${naoLidas} ${naoLidas === 1 ? "não lida" : "não lidas"}` : "Notificações"}
      className={cn(
        "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
      data-slot="notificacoes"
    >
      <Bell aria-hidden className="h-5 w-5" />
      {naoLidas > 0 && (indicador === "ponto"
        ? <span aria-hidden data-slot="ponto-do-contador" className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card" />
        // Sino de 20 px centralizado no botão de 44 px: o canto superior direito do ícone fica em (32, 12). O contador
        // (20 px de altura) tem o centro do círculo nesse ponto (esquerda 22 px, topo 2 px) e, com dois algarismos, cresce para a direita.
        : <ContadorDoPainel aria-hidden valor={naoLidas} anel className="absolute left-[22px] top-0.5" />)}
    </button>
  );
});

type GatilhoDaContaProps = React.ComponentProps<"button"> & { nome: string; papel?: string; foto?: string };

const GatilhoDaConta = React.forwardRef<HTMLButtonElement, GatilhoDaContaProps>(function GatilhoDaConta({ nome, papel, foto, className, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Conta de ${nome}${papel ? `, ${papel}` : ""}. Abrir menu da conta`}
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
      data-slot="gatilho-da-conta"
    >
      <AvatarPainel nome={nome} foto={foto} />
      <span className="hidden min-w-0 sm:block">
        <span className="block truncate text-body-sm font-semibold text-foreground">{nome}</span>
        {papel && <span className="block truncate text-label text-muted-foreground">{papel}</span>}
      </span>
      <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
});

export {
  AvatarPainel, ItemDoMenu, GrupoDoMenu, CardDeAjuda, CampoDeBuscaGlobal, BotaoDeNotificacoes, GatilhoDaConta, ContadorDoPainel, iniciais, textoDoContador,
  MenuLateralProvider, MenuLateral, NavDoMenu, DivisorDoMenu, BotaoRecolherMenu, TopoDoMenu, BarraSuperiorDoPainel, useMenuLateral, useMenuRecolhido,
  LARGURA_EXPANDIDO, LARGURA_RECOLHIDO,
};
