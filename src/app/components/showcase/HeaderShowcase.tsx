import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowRight, BarChart2, Check, ChevronRight, Eye, EyeOff, FileText, Image as ImageIcon, LayoutDashboard, Mail,
  Maximize2, Menu, Minimize2, Monitor, Moon, PanelBottom, PanelRight, PanelTop, Palette, Pill, Settings,
  Smartphone, Sun, SunDim, Users, X,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { Callout, DoDont, Panel } from "./shared/Guidance";
import { FundoGradienteDaMarca } from "./BackgroundsShowcase";
import logoSobreClaro from "../../../imports/Logo-Horizontal-DarkMode.png";
import logoSobreEscuro from "../../../imports/Logo-Horizontal-LightMode.png";
import logoIcone from "../../../imports/IconeLogo-red.png";

/* ─────────────────────────────────────────────────────────────
   Header e menus
   Modelo atual: cabeçalho compartilhado do site (src/compartilhado/
   partes.ts, menu.ts e menu.css): pílula clara flutuando no desktop,
   faixa que fica grafite ao rolar no celular, logo que vira ícone,
   some ao descer e volta ao subir, menu do celular em folha inferior.
   ───────────────────────────────────────────────────────────── */

type L = { en: string; pt: string };

/* Conteúdo da marca: o resto do arquivo é igual nos dois design systems */
const MARCA = {
  nome: "Dani Moscatelli Experience Design Studio",
  logoSobreClaro,
  logoSobreEscuro,
  logoIcone,
  endereco: "danimoscatelli.com.br/projeto-piloto",
  // Links do cabeçalho do site: são páginas; a atual fica marcada
  tipoLinks: "paginas" as "paginas" | "secoes",
  links: [
    { id: "inicio", rotulo: { en: "Home", pt: "Home" } },
    { id: "projeto", rotulo: { en: "Projeto Piloto", pt: "Projeto Piloto" } },
    { id: "parceiros", rotulo: { en: "Seja Parceiro", pt: "Seja Parceiro" } },
  ] as { id: string; rotulo: L }[],
  atualInicial: "projeto" as string | null,
  entrar: null as L | null,
  acao: { en: "Contato", pt: "Contato" } as L,
  acaoIcone: Mail as React.ElementType,
  heroTitulo: { en: "Programa Projeto Piloto", pt: "Programa Projeto Piloto" } as L,
  heroTexto: {
    en: "Uma nova perspectiva sobre os desafios de experiência do seu negócio.",
    pt: "Uma nova perspectiva sobre os desafios de experiência do seu negócio.",
  } as L,
  foto: `${import.meta.env.BASE_URL}fotos/projeto-piloto-hero.webp`,
  app: [
    { id: "dashboard", rotulo: { en: "Dashboard", pt: "Dashboard" }, Icone: LayoutDashboard },
    { id: "analises", rotulo: { en: "Analytics", pt: "Análises" }, Icone: BarChart2 },
    { id: "clientes", rotulo: { en: "Customers", pt: "Clientes" }, Icone: Users },
    { id: "relatorios", rotulo: { en: "Reports", pt: "Relatórios" }, Icone: FileText },
    { id: "configuracoes", rotulo: { en: "Settings", pt: "Configurações" }, Icone: Settings },
  ] as { id: string; rotulo: L; Icone: React.ElementType }[],
};

type Tela = "desktop" | "celular";
type Modelo = "pilula" | "faixa";
type Fundo = "pagina" | "foto" | "gradiente" | "escuro";
type MenuCel = "folha" | "gaveta" | "tela-cheia" | "barra";
type Superficie = "clara" | "escura" | "imagem";
type Opcoes = { transparenteNoTopo: boolean; iconeAoRolar: boolean; someAoRolar: boolean };

/* Limites de rolagem (os mesmos do site) */
const ROLADO_APOS = 8;
const SENSIBILIDADE = 6;

function useTemaEscuro() {
  const [escuro, setEscuro] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setEscuro(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return escuro;
}

/* Regra do logo completo: a versão depende do que está atrás dele.
   Superfície clara → texto escuro; superfície escura ou foto (com véu) → texto claro. */
function versaoDoLogo(s: Superficie) {
  return s === "clara" ? MARCA.logoSobreClaro : MARCA.logoSobreEscuro;
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const textoMarca = "text-[var(--primary-text,var(--primary))]";

/* ── Controles da demonstração ── */
function Segmentado<T extends string>({ rotulo, valor, opcoes, onChange }: {
  rotulo: string; valor: T; opcoes: { id: T; rotulo: string; Icone: React.ElementType }[]; onChange: (v: T) => void;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{rotulo}</p>
      <div role="group" aria-label={rotulo} className="inline-flex max-w-full flex-wrap gap-1 rounded-[12px] bg-muted p-1">
        {opcoes.map(o => {
          const ativo = o.id === valor;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={ativo}
              onClick={() => onChange(o.id)}
              className={`inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-[0.75rem] font-medium transition-colors ${foco}
                ${ativo ? "bg-card text-foreground shadow-[var(--shadow-xs)]" : "text-muted-foreground hover:text-foreground"}`}
            >
              <o.Icone aria-hidden className="h-3.5 w-3.5" />
              {o.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Chave({ id, rotulo, ligado, onChange }: { id: string; rotulo: string; ligado: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-labelledby={id}
        onClick={() => onChange(!ligado)}
        className={`relative flex w-10 shrink-0 items-center rounded-full transition-colors ${foco} ${ligado ? "bg-primary" : "bg-muted-foreground/30"}`}
        style={{ height: "22px" }}
      >
        <span className={`absolute h-4 w-4 rounded-full bg-white transition-all ${ligado ? "left-[22px]" : "left-0.5"}`} />
      </button>
      <span id={id} className="text-[0.8125rem] font-medium text-foreground">{rotulo}</span>
    </div>
  );
}

/* ── Linhas neutras no lugar de texto, para dar rolagem sem inventar conteúdo ── */
function Linhas({ n = 3 }: { n?: number }) {
  const larguras = ["w-full", "w-11/12", "w-4/5", "w-2/3", "w-3/4"];
  return (
    <div aria-hidden className="space-y-2">
      {Array.from({ length: n }).map((_, i) => <div key={i} className={`h-2.5 rounded-full bg-muted ${larguras[i % larguras.length]}`} />)}
    </div>
  );
}

/* ── Fundos por trás do header ── */
function Capa({ fundo, escuro, children }: { fundo: Fundo; escuro: boolean; children: React.ReactNode }) {
  if (fundo === "foto") {
    return (
      <div data-testid="demo-capa" className="relative overflow-hidden bg-[var(--graphite-950)]">
        <img src={MARCA.foto} alt="" className="absolute inset-0 h-full w-full object-cover object-[30%_center]" />
        {/* Véu: escurece a foto toda e reforça o topo, onde ficam o logo e os links */}
        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="relative">{children}</div>
      </div>
    );
  }
  if (fundo === "gradiente") {
    return (
      <div data-testid="demo-capa" className="relative">
        <div className="absolute inset-0"><FundoGradienteDaMarca dark={escuro}><span /></FundoGradienteDaMarca></div>
        <div className="relative">{children}</div>
      </div>
    );
  }
  return <div data-testid="demo-capa" className="border-b border-border bg-background">{children}</div>;
}

/* ── Demonstração: janela com rolagem própria ── */
function DemoHeader({ tela, modelo, fundo, menuCel, opcoes }: { tela: Tela; modelo: Modelo; fundo: Fundo; menuCel: MenuCel; opcoes: Opcoes }) {
  const { t, bi } = useI18n();
  const temaEscuro = useTemaEscuro();
  const escuro = fundo === "escuro" || temaEscuro;
  const areaRef = useRef<HTMLDivElement>(null);
  const rolagemRef = useRef<HTMLDivElement>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const ultimoY = useRef(0);
  const [largura, setLargura] = useState(1000);
  const [y, setY] = useState(0);
  const [escondido, setEscondido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [atual, setAtual] = useState<string | null>(MARCA.atualInicial);
  const [atualApp, setAtualApp] = useState(MARCA.app[0].id);

  useLayoutEffect(() => {
    const el = areaRef.current; if (!el) return;
    const medir = () => setLargura(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir); obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Ao trocar de opção, volta ao topo e fecha o menu
  useEffect(() => {
    rolagemRef.current?.scrollTo({ top: 0 });
    setY(0); setEscondido(false); setMenuAberto(false); ultimoY.current = 0;
  }, [tela, modelo, fundo, menuCel, opcoes.transparenteNoTopo, opcoes.iconeAoRolar, opcoes.someAoRolar]);

  const desktop = tela === "desktop" && largura >= 720;
  const comBarra = !desktop && menuCel === "barra";        // menu embaixo: o header fica sem menu
  const pilula = modelo === "pilula" && desktop;
  const alturaHeader = pilula ? 97 : desktop ? 72 : 64;

  const aoRolar = useCallback(() => {
    const atualY = rolagemRef.current?.scrollTop ?? 0;
    const delta = atualY - ultimoY.current;
    if (!opcoes.someAoRolar || atualY < alturaHeader) setEscondido(false);
    else if (delta > SENSIBILIDADE) setEscondido(true);
    else if (delta < -SENSIBILIDADE) setEscondido(false);
    if (Math.abs(delta) > SENSIBILIDADE || atualY < alturaHeader) ultimoY.current = atualY;
    setY(atualY);
  }, [opcoes.someAoRolar, alturaHeader]);

  const fecharMenu = useCallback(() => {
    setMenuAberto(false);
    requestAnimationFrame(() => botaoMenuRef.current?.focus());
  }, []);

  // Menu aberto: foco no primeiro link, Esc fecha, Tab circula dentro do menu
  useEffect(() => {
    if (!menuAberto) return;
    const painel = painelRef.current;
    const focaveis = () => Array.from(painel?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
    requestAnimationFrame(() => (painel?.querySelector<HTMLElement>("nav a") ?? focaveis()[0])?.focus());
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); fecharMenu(); return; }
      if (e.key !== "Tab") return;
      const lista = focaveis(); if (!lista.length) return;
      const primeiro = lista[0], ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    };
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [menuAberto, fecharMenu]);

  // Link de página: marca a página atual e volta ao topo; link de seção: rola até ela
  const irPara = (id: string) => {
    setMenuAberto(false);
    const area = rolagemRef.current; if (!area) return;
    if (MARCA.tipoLinks === "paginas") { setAtual(id); area.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const alvo = area.querySelector<HTMLElement>(`[data-secao="${id}"]`);
    if (alvo) area.scrollTo({ top: alvo.offsetTop - alturaHeader, behavior: "smooth" });
  };

  const rolado = y > ROLADO_APOS;
  const transparente = opcoes.transparenteNoTopo && !rolado && !menuAberto;

  // O que fica atrás do logo e dos links
  const superficie: Superficie = pilula
    ? (escuro ? "escura" : "clara")                                  // pílula: superfície do card
    : !transparente
      ? (modelo === "pilula" ? "escura" : escuro ? "escura" : "clara") // faixa do site fica grafite ao rolar
      : fundo === "foto" ? "imagem" : escuro ? "escura" : "clara";
  const sobreEscuro = superficie !== "clara";

  // Logo: a pílula usa sempre o ícone; no celular, o modelo do site também; ao rolar, vira ícone se a opção estiver ligada
  const soIcone = pilula || (modelo === "pilula" && !desktop) || (opcoes.iconeAoRolar && rolado);
  const corLink = sobreEscuro ? "text-white/90 hover:text-white" : "text-foreground hover:text-[var(--primary-text,var(--primary))]";
  const sombraTexto = superficie === "imagem" ? { textShadow: "0 1px 2px rgb(0 0 0 / .35)" } : undefined;
  const mostraLinks = desktop && !comBarra;
  const idPainel = "demo-header-menu";

  const Logo = (
    <a
      href="#"
      onClick={e => { e.preventDefault(); rolagemRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
      aria-label={MARCA.nome}
      data-testid="demo-logo"
      data-logo={soIcone ? "icone" : "completo"}
      data-superficie={superficie}
      className={`flex shrink-0 items-center rounded-[6px] ${foco}`}
    >
      {soIcone
        ? <img src={MARCA.logoIcone} alt="" className="h-10 w-auto object-contain motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95" />
        : <img src={versaoDoLogo(superficie)} alt="" className={`w-auto object-contain ${desktop ? "h-11" : "h-9"}`} />}
    </a>
  );

  const Links = (
    <nav aria-label={t("Main", "Principal")} className={`flex items-center ${pilula ? "gap-11" : "gap-6"}`}>
      {MARCA.links.map(l => (
        <a
          key={l.id}
          href={`#${l.id}`}
          aria-current={atual === l.id ? "page" : undefined}
          onClick={e => { e.preventDefault(); irPara(l.id); }}
          style={sombraTexto}
          className={`whitespace-nowrap rounded-[4px] text-[0.875rem] font-semibold decoration-2 underline-offset-[6px] transition-colors aria-[current=page]:underline aria-[current=page]:decoration-primary ${foco}
            ${pilula ? "font-medium text-[0.9375rem] text-foreground hover:text-[var(--primary-text,var(--primary))] aria-[current=page]:text-[var(--primary-text,var(--primary))]" : corLink}`}
        >
          {bi(l.rotulo)}
        </a>
      ))}
    </nav>
  );

  return (
    <div className={escuro && !temaEscuro ? "dark" : ""}>
      <div
        className={`mx-auto overflow-hidden rounded-[16px] border border-border bg-background transition-[max-width] duration-300 ${tela === "celular" ? "max-w-[390px]" : "max-w-full"}`}
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        {/* Barra do navegador */}
        <div className="flex h-9 items-center gap-2 border-b border-border bg-muted/60 px-4">
          <div aria-hidden className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
          </div>
          <div className="mx-4 flex-1">
            <div className="mx-auto flex h-5 max-w-[280px] items-center rounded-[6px] bg-background/70 px-3">
              <span className="truncate text-[0.625rem] text-muted-foreground">{MARCA.endereco}</span>
            </div>
          </div>
        </div>

        <div ref={areaRef} className="relative h-[560px]">
          <div ref={rolagemRef} onScroll={aoRolar} data-testid="demo-header-rolagem" className={`h-full bg-background ${menuAberto ? "overflow-hidden" : "overflow-y-auto"}`}>
            {/* Header fixo com altura zero no fluxo: a capa passa por trás dele */}
            <div className="sticky top-0 z-20 h-0">
              <div
                data-testid="demo-header"
                data-modelo={pilula ? "pilula" : "faixa"}
                data-estado={transparente ? "transparente" : "solido"}
                data-escondido={escondido && !menuAberto ? "sim" : "nao"}
                onFocusCapture={() => setEscondido(false)}
                className={`absolute inset-x-0 top-0 transition-[translate,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none
                  ${escondido && !menuAberto ? "-translate-y-full" : "translate-y-0"}
                  ${pilula ? "pt-[37px] pb-1" : ""}
                  ${!pilula && !transparente ? (modelo === "pilula" ? "bg-[var(--graphite-900)]/92 backdrop-blur-xl" : "border-b border-border bg-card/85 backdrop-blur-xl") : !pilula ? "border-b border-transparent" : ""}`}
                style={{ boxShadow: !pilula && !transparente ? (modelo === "pilula" ? "0 8px 24px -16px rgb(0 0 0 / .45)" : "var(--shadow-sm)") : "none" }}
              >
                {/* Pílula: faixa translúcida que aparece por trás ao rolar e some em degradê */}
                {pilula && (
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+2.5rem)] bg-gradient-to-b from-background/85 via-background/55 to-transparent backdrop-blur-[10px] transition-opacity duration-300 ${rolado ? "opacity-100" : "opacity-0"}`}
                    style={{ maskImage: "linear-gradient(to bottom, #000 45%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent 100%)" }}
                  />
                )}

                <header
                  className={pilula
                    ? "mx-auto flex w-fit items-center gap-12 rounded-full border border-border bg-card/95 py-2 pl-8 pr-11"
                    : `flex items-center justify-between gap-3 px-4 ${desktop ? "h-[72px] px-6" : "h-16"}`}
                  style={pilula ? { boxShadow: rolado ? "0 10px 30px -10px rgb(13 17 25 / .35)" : "0 8px 24px -12px rgb(13 17 25 / .35)" } : undefined}
                >
                  {Logo}
                  {pilula ? (
                    <>
                      {Links}
                      {MARCA.entrar && (
                        <a href="#" onClick={e => e.preventDefault()} className={`-mr-6 whitespace-nowrap rounded-[4px] text-[0.9375rem] font-medium text-foreground transition-colors hover:text-[var(--primary-text,var(--primary))] ${foco}`}>{bi(MARCA.entrar)}</a>
                      )}
                      <a href="#" onClick={e => e.preventDefault()} className={`whitespace-nowrap rounded-[4px] text-[0.9375rem] font-medium text-foreground transition-colors hover:text-[var(--primary-text,var(--primary))] ${foco}`}>{bi(MARCA.acao)}</a>
                    </>
                  ) : (
                    <>
                      {mostraLinks && Links}
                      <div className="flex items-center gap-2">
                        {mostraLinks && MARCA.entrar && (
                          <a href="#" onClick={e => e.preventDefault()} style={sombraTexto} className={`inline-flex h-9 items-center rounded-full px-3 text-[0.875rem] font-medium transition-colors ${corLink} ${foco}`}>{bi(MARCA.entrar)}</a>
                        )}
                        {mostraLinks && (
                          modelo === "pilula"
                            ? <a href="#" onClick={e => e.preventDefault()} className={`inline-flex h-10 items-center rounded-full border px-6 text-[0.875rem] font-semibold transition-colors ${foco} ${sobreEscuro ? "border-white/85 text-white hover:bg-white hover:text-[var(--graphite-900)]" : "border-foreground text-foreground hover:bg-foreground hover:text-background"}`}>{bi(MARCA.acao)}</a>
                            : <a href="#" onClick={e => e.preventDefault()} className={`inline-flex h-10 items-center rounded-full bg-primary px-5 text-[0.875rem] font-semibold text-primary-foreground transition-opacity hover:opacity-90 whitespace-nowrap ${foco}`}>{bi(MARCA.acao)}</a>
                        )}
                        {!desktop && !comBarra && (
                          <button
                            ref={botaoMenuRef}
                            type="button"
                            aria-expanded={menuAberto}
                            aria-controls={idPainel}
                            aria-label={t("Open menu", "Abrir menu")}
                            onClick={() => setMenuAberto(true)}
                            className={`-mr-1 flex h-11 w-11 items-center justify-center rounded-full transition-colors ${foco} ${sobreEscuro ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"}`}
                          >
                            <Menu aria-hidden className="h-6 w-6" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </header>
              </div>
            </div>

            <Capa fundo={fundo} escuro={escuro}>
              <div className={`mx-auto max-w-2xl px-5 pb-14 text-center ${pilula ? "pt-[150px]" : desktop ? "pt-[120px]" : "pt-[104px]"}`}>
                <h1 className={`text-[1.625rem] font-extrabold leading-tight tracking-tight ${desktop ? "text-[2.25rem]" : ""} ${fundo === "foto" ? "text-white" : "text-foreground"}`}>
                  {bi(MARCA.heroTitulo)}
                </h1>
                <p className={`mx-auto mt-3 max-w-xl text-[0.9375rem] font-semibold leading-snug ${fundo === "foto" ? "text-white/90" : "text-muted-foreground"}`}>
                  {bi(MARCA.heroTexto)}
                </p>
              </div>
            </Capa>

            {/* Conteúdo neutro só para dar rolagem */}
            <div className={`mx-auto max-w-3xl space-y-12 px-5 py-12 ${comBarra ? "pb-24" : ""}`}>
              {(MARCA.tipoLinks === "secoes" ? MARCA.links.map(l => ({ id: l.id, titulo: bi(l.rotulo) })) : [0, 1, 2, 3].map(i => ({ id: `bloco-${i}`, titulo: "" }))).map(s => (
                <section key={s.id} data-secao={s.id} aria-label={s.titulo || undefined}>
                  {s.titulo
                    ? <h2 className="mb-4 text-[1.125rem] font-bold tracking-tight text-foreground">{s.titulo}</h2>
                    : <div aria-hidden className="mb-4 h-4 w-40 rounded-full bg-muted" />}
                  <Linhas n={3} />
                  <div aria-hidden className={`mt-5 grid gap-3 ${desktop ? "grid-cols-3" : "grid-cols-1"}`}>
                    {[0, 1, 2].map(i => <div key={i} className="h-20 rounded-[12px] border border-border bg-card" />)}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Barra inferior de app: com ela, o menu sai do header (o menu fica em um lugar só) */}
          {comBarra && (
            <nav aria-label={t("Main", "Principal")} data-testid="demo-barra" className="absolute inset-x-0 bottom-0 z-20 grid h-16 grid-cols-5 border-t border-border bg-card/90 backdrop-blur-xl">
              {MARCA.app.map(item => {
                const ehAtual = item.id === atualApp;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={ehAtual ? "page" : undefined}
                    onClick={() => setAtualApp(item.id)}
                    className={`relative flex flex-col items-center justify-center gap-1 text-[0.625rem] font-medium transition-colors ${foco} ${ehAtual ? textoMarca : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {ehAtual && <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                    <item.Icone aria-hidden className="h-5 w-5" />
                    <span className="max-w-full truncate px-0.5">{bi(item.rotulo)}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Menus do celular (abertos pelo botão do header) */}
          {menuAberto && menuCel !== "tela-cheia" && (
            <div aria-hidden className="absolute inset-0 z-30 bg-[var(--graphite-950)]/55 motion-safe:animate-in motion-safe:fade-in" onClick={fecharMenu} />
          )}

          {menuAberto && menuCel === "folha" && (
            <div
              ref={painelRef}
              id={idPainel}
              role="dialog"
              aria-modal="true"
              aria-label={t("Menu", "Menu")}
              className="absolute inset-x-0 bottom-0 z-40 max-h-[85%] overflow-y-auto rounded-t-[24px] border-t border-border bg-card px-4 pb-4 pt-2 motion-safe:animate-in motion-safe:slide-in-from-bottom"
              style={{ boxShadow: "0 -12px 36px rgb(13 17 25 / .12)" }}
            >
              <div className="relative mb-1 flex h-10 items-center justify-center">
                <span aria-hidden className="h-[5px] w-10 rounded-full bg-border" />
                <button type="button" onClick={fecharMenu} aria-label={t("Close menu", "Fechar menu")} className={`absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground ${foco}`}>
                  <X aria-hidden className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label={t("Main", "Principal")}>
                {MARCA.links.map(l => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    aria-current={atual === l.id ? "page" : undefined}
                    onClick={e => { e.preventDefault(); irPara(l.id); }}
                    className={`flex items-center justify-between rounded-[12px] px-4 py-3.5 text-[0.9375rem] font-semibold text-foreground hover:bg-muted aria-[current=page]:bg-[var(--primary-muted)] aria-[current=page]:text-[var(--primary-text,var(--primary))] ${foco}`}
                  >
                    {bi(l.rotulo)} <ChevronRight aria-hidden className={`h-4 w-4 ${textoMarca}`} />
                  </a>
                ))}
              </nav>
              {MARCA.entrar && (
                <a href="#" onClick={e => e.preventDefault()} className={`mt-2 flex w-full items-center justify-center rounded-[12px] border border-border px-4 py-3.5 text-[0.9375rem] font-semibold text-foreground hover:bg-muted ${foco}`}>{bi(MARCA.entrar)}</a>
              )}
              <a href="#" onClick={e => e.preventDefault()} className={`mt-2 flex w-full items-center justify-center gap-2 rounded-[12px] bg-primary px-4 py-3.5 text-[0.9375rem] font-semibold text-primary-foreground hover:opacity-90 ${foco}`}>
                <MARCA.acaoIcone aria-hidden className="h-4 w-4" /> {bi(MARCA.acao)}
              </a>
            </div>
          )}

          {menuAberto && menuCel === "gaveta" && (
            <div
              ref={painelRef}
              id={idPainel}
              role="dialog"
              aria-modal="true"
              aria-label={t("Menu", "Menu")}
              className="absolute inset-y-0 right-0 z-40 flex w-[min(84%,320px)] flex-col border-l border-border bg-card motion-safe:animate-in motion-safe:slide-in-from-right"
              style={{ boxShadow: "var(--shadow-xl)" }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <img src={versaoDoLogo(escuro ? "escura" : "clara")} alt="" data-testid="demo-logo-menu" className="h-8 w-auto object-contain" />
                <button type="button" onClick={fecharMenu} aria-label={t("Close menu", "Fechar menu")} className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground hover:bg-muted ${foco}`}>
                  <X aria-hidden className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label={t("Main", "Principal")} className="flex-1 overflow-y-auto p-3">
                {MARCA.links.map(l => (
                  <a key={l.id} href={`#${l.id}`} aria-current={atual === l.id ? "page" : undefined} onClick={e => { e.preventDefault(); irPara(l.id); }} className={`flex h-12 items-center rounded-[10px] px-3 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-muted aria-[current=page]:bg-[var(--primary-muted)] aria-[current=page]:text-[var(--primary-text,var(--primary))] ${foco}`}>
                    {bi(l.rotulo)}
                  </a>
                ))}
              </nav>
              <div className="space-y-2 border-t border-border p-4">
                {MARCA.entrar && (
                  <a href="#" onClick={e => e.preventDefault()} className={`flex h-11 items-center justify-center rounded-full border border-border text-[0.875rem] font-medium text-foreground hover:bg-muted ${foco}`}>{bi(MARCA.entrar)}</a>
                )}
                <a href="#" onClick={e => e.preventDefault()} className={`flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-[0.875rem] font-semibold text-primary-foreground hover:opacity-90 ${foco}`}>
                  {bi(MARCA.acao)} <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}

          {menuAberto && menuCel === "tela-cheia" && (
            <div ref={painelRef} id={idPainel} role="dialog" aria-modal="true" aria-label={t("Menu", "Menu")} className="absolute inset-0 z-40 flex flex-col bg-background motion-safe:animate-in motion-safe:fade-in">
              <div className="flex h-16 items-center justify-between px-4">
                <img src={versaoDoLogo(escuro ? "escura" : "clara")} alt="" data-testid="demo-logo-menu" className="h-9 w-auto object-contain" />
                <button type="button" onClick={fecharMenu} aria-label={t("Close menu", "Fechar menu")} className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground hover:bg-muted ${foco}`}>
                  <X aria-hidden className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label={t("Main", "Principal")} className="flex-1 overflow-y-auto px-6 pt-6">
                {MARCA.links.map((l, i) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    aria-current={atual === l.id ? "page" : undefined}
                    onClick={e => { e.preventDefault(); irPara(l.id); }}
                    className={`block rounded-[8px] py-2.5 text-[1.625rem] font-black tracking-[-0.03em] text-foreground transition-colors hover:text-[var(--primary-text,var(--primary))] aria-[current=page]:text-[var(--primary-text,var(--primary))] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 ${foco}`}
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
                  >
                    {bi(l.rotulo)}
                  </a>
                ))}
              </nav>
              <div className="space-y-2 p-6">
                {MARCA.entrar && (
                  <a href="#" onClick={e => e.preventDefault()} className={`flex h-12 items-center justify-center rounded-full border border-border text-[0.9375rem] font-medium text-foreground hover:bg-muted ${foco}`}>{bi(MARCA.entrar)}</a>
                )}
                <a href="#" onClick={e => e.preventDefault()} className={`flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-primary-foreground hover:opacity-90 ${foco}`}>
                  {bi(MARCA.acao)} <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Cards de explicação, com atalho para a demonstração ── */
function CardOpcao({ Icone, titulo, selo, desc, quando, ativo, rotuloAcao, onAcao }: {
  Icone: React.ElementType; titulo: string; selo?: string; desc: string; quando: string; ativo: boolean; rotuloAcao: [string, string]; onAcao: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-col rounded-[16px] border bg-card p-5 ${ativo ? "border-primary" : "border-border"}`} style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-muted)]">
          <Icone aria-hidden className={`h-4 w-4 ${textoMarca}`} />
        </div>
        {selo && <span className={`rounded-full border border-primary/20 bg-[var(--primary-muted)] px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.06em] ${textoMarca}`}>{selo}</span>}
      </div>
      <h3 className="text-[1rem] font-bold tracking-tight text-foreground">{titulo}</h3>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{desc}</p>
      <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-foreground">
        <strong className="font-semibold">{t("When to use:", "Quando usar:")}</strong> {quando}
      </p>
      <button
        type="button"
        aria-pressed={ativo}
        onClick={onAcao}
        className={`mt-4 inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-[10px] border border-primary px-3.5 text-[0.8125rem] font-semibold transition-colors ${foco}
          ${ativo ? "bg-primary text-primary-foreground" : `bg-card ${textoMarca} hover:bg-[var(--primary-muted)]`}`}
      >
        {ativo ? <Check aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
        {ativo ? rotuloAcao[1] : rotuloAcao[0]}
      </button>
    </div>
  );
}

export function HeaderShowcase() {
  const { t } = useI18n();
  const [tela, setTela] = useState<Tela>("desktop");
  const [modelo, setModelo] = useState<Modelo>("pilula");
  const [fundo, setFundo] = useState<Fundo>("foto");
  const [menuCel, setMenuCel] = useState<MenuCel>("folha");
  const [opcoes, setOpcoes] = useState<Opcoes>({ transparenteNoTopo: true, iconeAoRolar: true, someAoRolar: true });
  const demoRef = useRef<HTMLDivElement>(null);
  const verNaDemo = (f: () => void) => { f(); demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const ver: [string, string] = [t("See in the demo", "Ver na demonstração"), t("In the demo", "Na demonstração")];
  const atual = t("Current site", "Atual do site");

  const opModelo: { id: Modelo; rotulo: string; Icone: React.ElementType; selo?: string; desc: string; quando: string }[] = [
    {
      id: "pilula", rotulo: t("Floating pill", "Pílula flutuante"), Icone: Pill, selo: atual,
      desc: t(
        "Desktop: light pill centred at the top, with the logo icon, the links and the main action; when scrolling, a translucent band appears behind it and fades out downwards. Phone: full-width bar, transparent at the top and graphite when scrolling, with the menu button.",
        "Desktop: pílula clara centralizada no topo, com o ícone do logo, os links e a ação principal; ao rolar, uma faixa translúcida aparece por trás e some em degradê. Celular: faixa de largura inteira, transparente no topo e grafite ao rolar, com o botão de menu.",
      ),
      quando: t("Site pages (Home, Projeto Piloto, Rede de Parceiros). It is the default.", "Páginas do site (Home, Projeto Piloto e Rede de Parceiros). É o padrão."),
    },
    {
      id: "faixa", rotulo: t("Full-width bar", "Faixa inteira"), Icone: PanelTop,
      desc: t("Bar across the whole width, with the full logo, links in the centre and the main action as a filled pill; when solid, it uses the translucent card surface with blur.", "Barra de ponta a ponta, com o logo completo, os links no centro e a ação principal em pílula preenchida; quando sólida, usa a superfície do card translúcida com desfoque."),
      quando: t("Landing pages with more links or two actions (for example, Sign in and Sign up).", "Landing pages com mais links ou duas ações (por exemplo, Entrar e Cadastrar)."),
    },
  ];

  const opRolagem: { id: keyof Opcoes; rotulo: string; Icone: React.ElementType; desc: string; quando: string }[] = [
    {
      id: "transparenteNoTopo", rotulo: t("Transparent at the top", "Transparente no topo"), Icone: SunDim,
      desc: t(`No background over the cover; after ${ROLADO_APOS}px of scrolling it gets its surface. Off: always solid.`, `Sem fundo sobre a capa; depois de ${ROLADO_APOS}px de rolagem ganha a superfície. Desligado: sempre sólido.`),
      quando: t("Pages with a cover (photo or gradient) at the top.", "Páginas com capa (foto ou gradiente) no topo."),
    },
    {
      id: "iconeAoRolar", rotulo: t("Logo becomes the icon", "Logo vira ícone ao rolar"), Icone: Minimize2,
      desc: t("Compact version: when scrolling, the full logo gives way to the icon only. The pill and the phone header of the site always use the icon.", "Versão compacta: ao rolar, o logo completo dá lugar só ao ícone. A pílula e o header do site no celular usam sempre o ícone."),
      quando: t("Whenever the header stays on screen while scrolling.", "Sempre que o header fica na tela durante a rolagem."),
    },
    {
      id: "someAoRolar", rotulo: t("Hides on scroll down", "Some ao descer e volta ao subir"), Icone: EyeOff,
      desc: t("Configurable: hides when scrolling down and comes back as soon as the person scrolls up. It is always visible at the top, with the menu open and when keyboard focus reaches it.", "Configurável: esconde ao rolar para baixo e volta assim que a pessoa rola para cima. Fica sempre visível no topo, com o menu aberto e quando o foco do teclado chega nele."),
      quando: t("Long pages, especially on phones. Turn it off where the menu must always be at hand.", "Páginas longas, principalmente no celular. Desligue onde o menu precisa estar sempre à mão."),
    },
  ];

  const opMenu: { id: MenuCel; rotulo: string; Icone: React.ElementType; selo?: string; desc: string; quando: string }[] = [
    {
      id: "folha", rotulo: t("Bottom sheet", "Folha inferior"), Icone: PanelBottom, selo: atual,
      desc: t("The menu button opens a sheet that rises from the bottom of the screen, with a handle, links with an arrow, the current page highlighted and the main action at the end.", "O botão de menu abre uma folha que sobe do rodapé da tela, com alça, links com seta, a página atual destacada e a ação principal no fim."),
      quando: t("Site pages. It is the default: everything stays within thumb reach.", "Páginas do site. É o padrão: tudo fica ao alcance do polegar."),
    },
    {
      id: "gaveta", rotulo: t("Side drawer", "Gaveta lateral"), Icone: PanelRight,
      desc: t("Panel from the right over the darkened background, with the logo, the links and the main action.", "Painel pela direita sobre o fundo escurecido, com o logo, os links e a ação principal."),
      quando: t("Sites with more links than fit comfortably in the sheet.", "Sites com mais links do que cabem bem na folha."),
    },
    {
      id: "tela-cheia", rotulo: t("Full screen", "Tela cheia"), Icone: Maximize2,
      desc: t("The menu takes the whole screen, with large links and the main action at the bottom.", "O menu ocupa a tela toda, com links grandes e a ação principal embaixo."),
      quando: t("Campaign pages with few links, where the menu is also a brand moment.", "Páginas de campanha com poucos links, em que o menu também é um momento de marca."),
    },
    {
      id: "barra", rotulo: t("Bottom bar (app)", "Barra inferior (app)"), Icone: PanelBottom,
      desc: t("Up to 5 destinations fixed at the bottom, with icon and name. With it, the header has no links and no menu button: the menu is in one place only.", "Até 5 destinos fixos no rodapé, com ícone e nome. Com ela, o header fica sem links e sem botão de menu: o menu fica em um lugar só."),
      quando: t("Logged-in areas used every day (panels and apps).", "Áreas logadas de uso diário (painéis e apps)."),
    },
  ];

  const opFundo: { id: Fundo; rotulo: string; Icone: React.ElementType; desc: string; quando: string }[] = [
    {
      id: "pagina", rotulo: t("Page background", "Fundo da página"), Icone: Sun,
      desc: t("Light background of the theme: logo version with dark text; links in the text colour.", "Fundo claro do tema: logo na versão de texto escuro; links na cor do texto."),
      quando: t("Most internal pages.", "A maioria das páginas internas."),
    },
    {
      id: "foto", rotulo: t("Dark photo", "Foto escura"), Icone: ImageIcon,
      desc: t("Photo with a dark veil (45% over the whole image and 60% more at the top, where the header is): logo version with light text and white links with a soft shadow.", "Foto com véu escuro (45% em toda a imagem e mais 60% no topo, onde fica o header): logo na versão de texto claro e links em branco com sombra suave."),
      quando: t("Covers with photos, like the Projeto Piloto page.", "Capas com foto, como a página do Projeto Piloto."),
    },
    {
      id: "gradiente", rotulo: t("Brand gradient", "Gradiente da marca"), Icone: Palette,
      desc: t("Gradient Animation from Backgrounds with the theme palette: it is light in light mode, so the logo uses the dark-text version.", "Gradient Animation da seção Backgrounds com a paleta do tema: no modo claro ele é claro, então o logo usa a versão de texto escuro."),
      quando: t("Product and campaign covers without a photo.", "Capas de produto e de campanha sem foto."),
    },
    {
      id: "escuro", rotulo: t("Dark mode", "Modo escuro"), Icone: Moon,
      desc: t("Dark surfaces: logo version with light text, also inside the pill and in the menus.", "Superfícies escuras: logo na versão de texto claro, também dentro da pílula e nos menus."),
      quando: t("Whenever the person chooses the dark theme.", "Sempre que a pessoa escolher o tema escuro."),
    },
  ];

  const tokenGroups: TokenGroup[] = [
    {
      group: t("Header — surfaces", "Header — superfícies"),
      tokens: [
        { name: t("Pill", "Pílula"), description: t("Card surface at 95%, border, rounded-full", "Superfície do card a 95%, borda, rounded-full"), light: "bg-card/95", dark: "bg-card/95" },
        { name: t("Pill shadow", "Sombra da pílula"), description: t("At rest / after scrolling", "Parada / depois de rolar"), light: "0 8px 24px -12px · 0 10px 30px -10px" },
        { name: t("Band behind the pill", "Faixa atrás da pílula"), description: t("Background 85% → 55% → 0, blur 10px, mask fading downwards", "Fundo 85% → 55% → 0, desfoque de 10px, máscara em degradê"), light: "from-background/85" },
        { name: "--graphite-900 / 92%", description: t("Phone bar of the site when scrolled", "Faixa do site no celular ao rolar"), light: "#131A27", isColor: true },
        { name: t("Photo veil", "Véu da foto"), description: t("Whole image + top", "Imagem toda + topo"), light: "black 45% + 60% → 0" },
      ],
    },
    {
      group: t("Header — sizes and motion", "Header — tamanhos e movimento"),
      tokens: [
        { name: t("Height", "Altura"), description: t("Pill (with top space) / bar desktop / phone", "Pílula (com o respiro) / faixa desktop / celular"), light: "97px / 72px / 64px" },
        { name: t("Logo", "Logo"), description: t("Full desktop / full phone / icon", "Completo desktop / completo celular / ícone"), light: "44px / 36px / 40px" },
        { name: t("Touch target", "Área de toque"), description: t("Menu button", "Botão de menu"), light: "44 × 44px" },
        { name: t("Thresholds", "Limites"), description: t("Scrolled / hide sensitivity", "Rolado / sensibilidade do sumir"), light: `${ROLADO_APOS}px / ${SENSIBILIDADE}px` },
        { name: t("Transition", "Transição"), description: t("Hide and return; off with reduced motion", "Sumir e voltar; desligada com movimento reduzido"), light: "300ms cubic-bezier(0.16, 1, 0.3, 1)" },
        { name: t("Bottom sheet", "Folha inferior"), description: t("Top radius / max height / backdrop", "Raio do topo / altura máxima / fundo"), light: "24px / 85% / graphite-950 55%" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="header-demo" ref={demoRef} className="scroll-mt-24">
        <SectionHeader
          title={t("Header & menus", "Header e menus")}
          description={t(
            "Site header pattern. The default is the current header of the studio site (Home, Projeto Piloto and Rede de Parceiros). Scroll inside the window and combine the options.",
            "Padrão de header de site. O padrão é o header atual do site do estúdio (Home, Projeto Piloto e Rede de Parceiros). Role dentro da janela e combine as opções.",
          )}
        />
        <div className="mb-4 flex flex-wrap gap-x-6 gap-y-4">
          <Segmentado rotulo={t("Screen", "Tela")} valor={tela} onChange={setTela} opcoes={[
            { id: "desktop", rotulo: "Desktop", Icone: Monitor },
            { id: "celular", rotulo: t("Phone", "Celular"), Icone: Smartphone },
          ]} />
          <Segmentado rotulo={t("Model", "Modelo")} valor={modelo} onChange={setModelo} opcoes={opModelo.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          <Segmentado rotulo={t("Background", "Fundo")} valor={fundo} onChange={setFundo} opcoes={opFundo.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          {tela === "celular" && (
            <Segmentado rotulo={t("Phone menu", "Menu no celular")} valor={menuCel} onChange={setMenuCel} opcoes={opMenu.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          )}
        </div>
        <div role="group" aria-label={t("Scroll", "Rolagem")} className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
          {opRolagem.map(o => (
            <Chave key={o.id} id={`chave-${o.id}`} rotulo={o.rotulo} ligado={opcoes[o.id]} onChange={v => setOpcoes(p => ({ ...p, [o.id]: v }))} />
          ))}
        </div>
        <DemoHeader tela={tela} modelo={modelo} fundo={fundo} menuCel={menuCel} opcoes={opcoes} />
      </section>

      <section id="header-models">
        <SectionHeader title={t("Models", "Modelos")} description={t("Two header models. Both follow the scroll options and the logo rule.", "Dois modelos de header. Os dois seguem as opções de rolagem e a regra do logo.")} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {opModelo.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} selo={o.selo} desc={o.desc} quando={o.quando} ativo={modelo === o.id} rotuloAcao={ver} onAcao={() => verNaDemo(() => setModelo(o.id))} />
          ))}
        </div>
      </section>

      <section id="header-scroll">
        <SectionHeader title={t("Scroll behaviours", "Comportamentos de rolagem")} description={t("Three independent options: turn each one on or off according to the page. In the site, all three are on.", "Três opções independentes: ligue ou desligue cada uma conforme a página. No site, as três estão ligadas.")} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {opRolagem.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} desc={o.desc} quando={o.quando} ativo={opcoes[o.id]} rotuloAcao={[t("Turn on in the demo", "Ligar na demonstração"), t("On in the demo", "Ligado na demonstração")]} onAcao={() => verNaDemo(() => setOpcoes(p => ({ ...p, [o.id]: !p[o.id] })))} />
          ))}
        </div>
      </section>

      <section id="header-mobile">
        <SectionHeader title={t("Phone menus", "Menus no celular")} description={t("On phones the links leave the header and go into the menu. The menu is in one place only: at the top (menu button in the header) or at the bottom (app bar), never both.", "No celular os links saem do header e vão para o menu. O menu fica em um lugar só: no topo (botão de menu no header) ou embaixo (barra de app), nunca nos dois.")} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {opMenu.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} selo={o.selo} desc={o.desc} quando={o.quando} ativo={tela === "celular" && menuCel === o.id} rotuloAcao={ver} onAcao={() => verNaDemo(() => { setTela("celular"); setMenuCel(o.id); })} />
          ))}
        </div>
      </section>

      <section id="header-backgrounds">
        <SectionHeader title={t("Backgrounds behind the header", "Fundos por trás do header")} description={t("What is behind the logo defines its version.", "O que está atrás do logo define a versão dele.")} />
        <div className="mb-4">
          <Callout title={t("Full logo rule", "Regra do logo completo")}>
            {t(
              "Whenever the full logo appears, check what is directly behind it: on a light surface, the dark-text version; on a dark surface or on a photo, the light-text version, and the photo needs the veil. Otherwise “Experience Design Studio” becomes illegible. The icon works on any background.",
              "Sempre que o logo completo aparecer, confira o que está logo atrás dele: sobre superfície clara, a versão de texto escuro; sobre superfície escura ou foto, a versão de texto claro, e a foto precisa do véu. Senão o “Experience Design Studio” fica ilegível. O ícone funciona em qualquer fundo.",
            )}
          </Callout>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {opFundo.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} desc={o.desc} quando={o.quando} ativo={fundo === o.id} rotuloAcao={ver} onAcao={() => verNaDemo(() => setFundo(o.id))} />
          ))}
        </div>
      </section>

      <section id="header-a11y">
        <SectionHeader title={t("Accessibility checklist", "Checklist de acessibilidade")} />
        <Panel className="p-5">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2">
            {[
              t("The menu button has aria-expanded, aria-controls and a name (“Open menu”).", "O botão de menu tem aria-expanded, aria-controls e nome (“Abrir menu”)."),
              t("When the menu opens, focus goes to the first link; Tab stays inside the menu.", "Ao abrir o menu, o foco vai para o primeiro link; o Tab fica dentro do menu."),
              t("Esc, the X and tapping outside close the menu, and focus returns to the menu button.", "Esc, o X e tocar fora fecham o menu, e o foco volta para o botão de menu."),
              t("The current page has aria-current=\"page\", in one place only.", "A página atual tem aria-current=\"page\", em um lugar só."),
              t("A header that hides comes back at the top, with the menu open and when keyboard focus reaches it.", "O header que some volta no topo, com o menu aberto e quando o foco do teclado chega nele."),
              t("Transitions are turned off with reduced motion.", "As transições são desligadas com movimento reduzido."),
              t("White text over a photo only with the veil (minimum contrast 4.5:1).", "Texto branco sobre foto só com o véu (contraste mínimo de 4,5:1)."),
              t("Bottom bar: icon always with a name.", "Barra inferior: ícone sempre com nome."),
              t("Touch targets of at least 44 × 44px.", "Áreas de toque de pelo menos 44 × 44px."),
              t("Links in a nav with a name (“Main”).", "Links dentro de um nav com nome (“Principal”)."),
            ].map(item => (
              <li key={item} className="flex gap-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      <section id="header-usage">
        <SectionHeader title={t("Usage", "Uso")} />
        <DoDont
          dos={[
            t("Keep the menu in one place: header (top) or app bar (bottom).", "Mantenha o menu em um lugar só: header (topo) ou barra de app (embaixo)."),
            t("Choose the logo version by what is behind it, every time the background changes.", "Escolha a versão do logo pelo que está atrás dele, toda vez que o fundo mudar."),
            t("Keep the main action in the header and repeat it in the phone menu.", "Mantenha a ação principal no header e repita no menu do celular."),
          ]}
          donts={[
            t("Do not show the menu button in the header and the bottom bar at the same time.", "Não mostre o botão de menu no header e a barra inferior ao mesmo tempo."),
            t("Do not put the full logo with light text on a light background, or with dark text on a dark one or on a photo.", "Não use o logo completo de texto claro sobre fundo claro, nem o de texto escuro sobre fundo escuro ou foto."),
            t("Do not leave a transparent header over content after scrolling.", "Não deixe o header transparente sobre o conteúdo depois da rolagem."),
          ]}
        />
      </section>

      <section id="header-tokens">
        <SectionHeader title={t("Tokens", "Tokens")} />
        <TokenTable groups={tokenGroups} />
      </section>
    </div>
  );
}
