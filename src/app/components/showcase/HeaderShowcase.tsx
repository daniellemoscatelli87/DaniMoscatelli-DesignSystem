import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight, ArrowUpDown, BarChart2, Check, Eye, FileText, Image as ImageIcon, LayoutDashboard, Maximize2,
  Menu, Minimize2, Monitor, Moon, PanelBottom, PanelRight, Palette, Settings, Smartphone, Sun, Users, X,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { DoDont, Panel } from "./shared/Guidance";
import { FundoGradienteDaMarca } from "./BackgroundsShowcase";
import logoSobreClaro from "../../../imports/Logo-Horizontal-DarkMode.png";
import logoSobreEscuro from "../../../imports/Logo-Horizontal-LightMode.png";

/* ─────────────────────────────────────────────────────────────
   Header e menus
   Base: header do site (Experience Intelligence 3: fixo, links no
   centro e botão de contato em pílula) e header do próprio DS
   (fundo translúcido com desfoque, gaveta no celular).
   ───────────────────────────────────────────────────────────── */

type L = { en: string; pt: string };

/* Conteúdo da marca: o resto do arquivo é igual nos dois design systems */
const MARCA = {
  nome: "Dani Moscatelli Experience Design Studio",
  logoSobreClaro,
  logoSobreEscuro,
  endereco: "danimoscatelli.com.br",
  links: [
    { id: "problema", rotulo: { en: "The Problem", pt: "O Problema" } },
    { id: "contexto", rotulo: { en: "Context", pt: "Contexto" } },
    { id: "abordagem", rotulo: { en: "Approach", pt: "Abordagem" } },
    { id: "metodo", rotulo: { en: "Method", pt: "Método" } },
    { id: "solucoes", rotulo: { en: "Solutions", pt: "Soluções" } },
    { id: "artigos", rotulo: { en: "Articles", pt: "Artigos" } },
  ] as { id: string; rotulo: L }[],
  entrar: null as L | null,
  cta: { en: "Contact", pt: "Contato" } as L,
  heroTitulo: {
    en: "I turn business goals into high-value experiences for your customers.",
    pt: "Transformo objetivos de negócio em experiências de alto valor para os seus clientes.",
  } as L,
  heroTexto: {
    en: "20+ years designing experience ecosystems that connect strategy, people, operations and technology.",
    pt: "+ de 20 anos projetando ecossistemas de experiência que conectam estratégia, pessoas, operação e tecnologia.",
  } as L,
  foto: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=70&auto=format&fit=crop",
  app: [
    { id: "dashboard", rotulo: { en: "Dashboard", pt: "Dashboard" }, Icone: LayoutDashboard },
    { id: "analises", rotulo: { en: "Analytics", pt: "Análises" }, Icone: BarChart2 },
    { id: "clientes", rotulo: { en: "Customers", pt: "Clientes" }, Icone: Users },
    { id: "relatorios", rotulo: { en: "Reports", pt: "Relatórios" }, Icone: FileText },
    { id: "configuracoes", rotulo: { en: "Settings", pt: "Configurações" }, Icone: Settings },
  ] as { id: string; rotulo: L; Icone: React.ElementType }[],
};

type Tela = "desktop" | "celular";
type Rolagem = "transparente" | "some" | "compacto";
type Fundo = "pagina" | "foto" | "gradiente" | "escuro";
type MenuCel = "gaveta" | "tela-cheia" | "barra";

/* Limites de rolagem (px) */
const SOLIDO_APOS = 24;
const COMPACTO_APOS = 40;
const SOME_APOS = 96;
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

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
const textoMarca = "text-[var(--primary-text,var(--primary))]";

/* ── Controle segmentado da demonstração ── */
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

/* ── Linhas neutras no lugar de texto, para dar rolagem sem inventar conteúdo ── */
function Linhas({ n = 3, claro = false }: { n?: number; claro?: boolean }) {
  const larguras = ["w-full", "w-11/12", "w-4/5", "w-2/3", "w-3/4"];
  return (
    <div aria-hidden className="space-y-2">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className={`h-2.5 rounded-full ${larguras[i % larguras.length]} ${claro ? "bg-white/25" : "bg-muted"}`} />
      ))}
    </div>
  );
}

/* ── Demonstração: janela com rolagem própria ── */
function DemoHeader({ tela, rolagem, fundo, menuCel }: { tela: Tela; rolagem: Rolagem; fundo: Fundo; menuCel: MenuCel }) {
  const { t, bi } = useI18n();
  const temaEscuro = useTemaEscuro();
  const escuro = fundo === "escuro" || temaEscuro;
  const rolagemRef = useRef<HTMLDivElement>(null);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);
  const ultimoY = useRef(0);
  const [y, setY] = useState(0);
  const [escondido, setEscondido] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const [ativo, setAtivo] = useState(MARCA.app[0].id);

  // Ao trocar de opção, volta ao topo e fecha o menu
  useEffect(() => {
    rolagemRef.current?.scrollTo({ top: 0 });
    setY(0); setEscondido(false); setMenuAberto(false); ultimoY.current = 0;
  }, [tela, rolagem, fundo, menuCel]);

  const aoRolar = useCallback(() => {
    const atual = rolagemRef.current?.scrollTop ?? 0;
    const delta = atual - ultimoY.current;
    if (rolagem === "some") {
      if (atual < SOME_APOS) setEscondido(false);
      else if (delta > SENSIBILIDADE) setEscondido(true);
      else if (delta < -SENSIBILIDADE) setEscondido(false);
    }
    if (Math.abs(delta) > SENSIBILIDADE || atual < SOME_APOS) ultimoY.current = atual;
    setY(atual);
  }, [rolagem]);

  const fecharMenu = useCallback(() => {
    setMenuAberto(false);
    requestAnimationFrame(() => botaoMenuRef.current?.focus());
  }, []);

  // Menu aberto: foco no primeiro item, Esc fecha, Tab circula dentro do menu
  useEffect(() => {
    if (!menuAberto) return;
    const painel = painelRef.current;
    const focaveis = () => Array.from(painel?.querySelectorAll<HTMLElement>("button, a[href]") ?? []);
    // Foco no primeiro link do menu (o X continua alcançável com Shift+Tab)
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

  const irPara = (id: string) => {
    const alvo = rolagemRef.current?.querySelector<HTMLElement>(`[data-secao="${id}"]`);
    setMenuAberto(false);
    if (alvo && rolagemRef.current) rolagemRef.current.scrollTo({ top: alvo.offsetTop - 64, behavior: "smooth" });
  };

  const sobreCapa = rolagem === "transparente" && y < SOLIDO_APOS && !menuAberto;
  const compacto = rolagem === "compacto" && y >= COMPACTO_APOS;
  const textoClaro = sobreCapa && fundo === "foto";
  const logo = textoClaro || escuro ? MARCA.logoSobreEscuro : MARCA.logoSobreClaro;
  const comBarra = tela === "celular" && menuCel === "barra";
  const idPainel = "demo-header-menu";

  const corLink = textoClaro
    ? "text-white/85 hover:text-white"
    : "text-muted-foreground hover:text-[var(--primary-text,var(--primary))]";

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

        {/* Área da página: header, conteúdo com rolagem própria e menus por cima */}
        <div className="@container/quadro relative h-[560px]">
          <div
            ref={rolagemRef}
            onScroll={aoRolar}
            data-testid="demo-header-rolagem"
            className={`h-full ${menuAberto ? "overflow-hidden" : "overflow-y-auto"} bg-background`}
          >
            {/* Header fixo: altura zero no fluxo, para a capa passar por trás dele */}
            <div className="sticky top-0 z-20 h-0">
              <header
                data-testid="demo-header"
                data-estado={sobreCapa ? "transparente" : "solido"}
                data-escondido={escondido ? "sim" : "nao"}
                data-compacto={compacto ? "sim" : "nao"}
                onFocusCapture={() => setEscondido(false)}
                className={`absolute inset-x-0 top-0 flex items-center justify-between gap-3 px-4 @3xl/quadro:px-6 transition-[height,transform,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none
                  ${compacto ? "h-14" : "h-16 @3xl/quadro:h-[72px]"}
                  ${escondido && !menuAberto ? "-translate-y-full" : "translate-y-0"}
                  ${sobreCapa ? "border-b border-transparent bg-transparent" : "border-b border-border bg-card/85 backdrop-blur-xl"}`}
                style={{ boxShadow: !sobreCapa && y > 0 ? "var(--shadow-sm)" : "none" }}
              >
                <a href="#" onClick={e => { e.preventDefault(); rolagemRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label={MARCA.nome} className={`flex shrink-0 items-center rounded-[6px] ${foco}`}>
                  <img src={logo} alt="" className={`w-auto object-contain transition-[height] duration-200 motion-reduce:transition-none ${compacto ? "h-7" : "h-8 @3xl/quadro:h-10"}`} />
                </a>

                {!comBarra && (
                  <nav aria-label={t("Main", "Principal")} className="hidden @3xl/quadro:flex items-center gap-6 text-[0.8125rem] font-medium">
                    {MARCA.links.map(l => (
                      <a key={l.id} href={`#${l.id}`} onClick={e => { e.preventDefault(); irPara(l.id); }} className={`rounded-[4px] transition-colors ${corLink} ${foco}`}>{bi(l.rotulo)}</a>
                    ))}
                  </nav>
                )}

                <div className="flex items-center gap-2">
                  {MARCA.entrar && !comBarra && (
                    <a href="#" onClick={e => e.preventDefault()} className={`hidden @3xl/quadro:inline-flex h-9 items-center rounded-full px-3 text-[0.8125rem] font-medium transition-colors ${corLink} ${foco}`}>{bi(MARCA.entrar)}</a>
                  )}
                  {!comBarra && (
                    <a href="#" onClick={e => e.preventDefault()} className={`hidden @md/quadro:inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-[0.8125rem] font-semibold text-primary-foreground transition-opacity hover:opacity-90 whitespace-nowrap ${foco}`}>
                      {bi(MARCA.cta)}
                    </a>
                  )}
                  {!comBarra && (
                    <button
                      ref={botaoMenuRef}
                      type="button"
                      aria-expanded={menuAberto}
                      aria-controls={idPainel}
                      aria-label={t("Open menu", "Abrir menu")}
                      onClick={() => setMenuAberto(true)}
                      className={`@3xl/quadro:hidden flex h-10 w-10 items-center justify-center rounded-[10px] transition-colors ${foco}
                        ${textoClaro ? "text-white hover:bg-white/15" : "text-foreground hover:bg-muted"}`}
                    >
                      <Menu aria-hidden className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </header>
            </div>

            {/* Capa (o fundo escolhido passa por trás do header) */}
            <Capa fundo={fundo} escuro={escuro}>
              <div className="mx-auto max-w-2xl px-5 pb-14 pt-[104px] text-center @3xl/quadro:pt-[120px]">
                <h1 className={`text-[1.5rem] @3xl/quadro:text-[2.125rem] font-bold leading-[1.18] tracking-tight ${fundo === "foto" ? "text-white" : "text-foreground"}`}>
                  {bi(MARCA.heroTitulo)}
                </h1>
                <p className={`mx-auto mt-4 max-w-xl text-[0.875rem] @3xl/quadro:text-[0.9375rem] leading-relaxed ${fundo === "foto" ? "text-white/85" : "text-muted-foreground"}`}>
                  {bi(MARCA.heroTexto)}
                </p>
              </div>
            </Capa>

            {/* Seções da página: o título é o link do menu; as linhas neutras só dão altura */}
            <div className={`mx-auto max-w-3xl space-y-12 px-5 py-12 ${comBarra ? "pb-24" : ""}`}>
              {MARCA.links.map(l => (
                <section key={l.id} data-secao={l.id} aria-label={bi(l.rotulo)}>
                  <h2 className="mb-4 text-[1.125rem] font-bold tracking-tight text-foreground">{bi(l.rotulo)}</h2>
                  <Linhas n={3} />
                  <div aria-hidden className="mt-5 grid grid-cols-1 gap-3 @md/quadro:grid-cols-3">
                    {[0, 1, 2].map(i => <div key={i} className="h-20 rounded-[12px] border border-border bg-card" />)}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Celular: barra inferior de app */}
          {comBarra && (
            <nav aria-label={t("Main", "Principal")} data-testid="demo-barra" className="absolute inset-x-0 bottom-0 z-20 grid h-16 grid-cols-5 border-t border-border bg-card/90 backdrop-blur-xl">
              {MARCA.app.map(item => {
                const atual = item.id === ativo;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={atual ? "page" : undefined}
                    onClick={() => setAtivo(item.id)}
                    className={`relative flex flex-col items-center justify-center gap-1 text-[0.625rem] font-medium transition-colors ${foco} ${atual ? textoMarca : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {atual && <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
                    <item.Icone aria-hidden className="h-5 w-5" />
                    <span className="max-w-full truncate px-0.5">{bi(item.rotulo)}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Celular: gaveta lateral */}
          {menuAberto && (menuCel === "gaveta" || tela === "desktop") && (
            <div className="absolute inset-0 z-30">
              <div aria-hidden className="absolute inset-0 bg-foreground/40 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in" onClick={fecharMenu} />
              <div
                ref={painelRef}
                id={idPainel}
                role="dialog"
                aria-modal="true"
                aria-label={t("Menu", "Menu")}
                className="absolute inset-y-0 right-0 flex w-[min(84%,320px)] flex-col border-l border-border bg-card motion-safe:animate-in motion-safe:slide-in-from-right"
                style={{ boxShadow: "var(--shadow-xl)" }}
              >
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                  <img src={escuro ? MARCA.logoSobreEscuro : MARCA.logoSobreClaro} alt="" className="h-7 w-auto object-contain" />
                  <button type="button" onClick={fecharMenu} aria-label={t("Close menu", "Fechar menu")} className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground hover:bg-muted ${foco}`}>
                    <X aria-hidden className="h-5 w-5" />
                  </button>
                </div>
                <nav aria-label={t("Main", "Principal")} className="flex-1 overflow-y-auto p-3">
                  {MARCA.links.map(l => (
                    <a key={l.id} href={`#${l.id}`} onClick={e => { e.preventDefault(); irPara(l.id); }} className={`flex h-12 items-center rounded-[10px] px-3 text-[0.9375rem] font-medium text-foreground transition-colors hover:bg-muted ${foco}`}>
                      {bi(l.rotulo)}
                    </a>
                  ))}
                </nav>
                <div className="space-y-2 border-t border-border p-4">
                  {MARCA.entrar && (
                    <a href="#" onClick={e => e.preventDefault()} className={`flex h-11 items-center justify-center rounded-full border border-border text-[0.875rem] font-medium text-foreground hover:bg-muted ${foco}`}>{bi(MARCA.entrar)}</a>
                  )}
                  <a href="#" onClick={e => e.preventDefault()} className={`flex h-11 items-center justify-center gap-2 rounded-full bg-primary text-[0.875rem] font-semibold text-primary-foreground hover:opacity-90 ${foco}`}>
                    {bi(MARCA.cta)} <ArrowRight aria-hidden className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Celular: menu em tela cheia */}
          {menuAberto && menuCel === "tela-cheia" && tela === "celular" && (
            <div
              ref={painelRef}
              id={idPainel}
              role="dialog"
              aria-modal="true"
              aria-label={t("Menu", "Menu")}
              className="absolute inset-0 z-30 flex flex-col bg-background motion-safe:animate-in motion-safe:fade-in"
            >
              <div className="flex h-16 items-center justify-between px-4">
                <img src={escuro ? MARCA.logoSobreEscuro : MARCA.logoSobreClaro} alt="" className="h-8 w-auto object-contain" />
                <button type="button" onClick={fecharMenu} aria-label={t("Close menu", "Fechar menu")} className={`flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground hover:bg-muted ${foco}`}>
                  <X aria-hidden className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label={t("Main", "Principal")} className="flex-1 overflow-y-auto px-6 pt-6">
                {MARCA.links.map((l, i) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={e => { e.preventDefault(); irPara(l.id); }}
                    className={`block rounded-[8px] py-2.5 text-[1.625rem] font-black tracking-[-0.03em] text-foreground transition-colors hover:text-[var(--primary-text,var(--primary))] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 ${foco}`}
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
                  {bi(MARCA.cta)} <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Fundos por trás do header ── */
function Capa({ fundo, escuro, children }: { fundo: Fundo; escuro: boolean; children: React.ReactNode }) {
  if (fundo === "foto") {
    return (
      <div data-testid="demo-capa" className="relative overflow-hidden bg-[var(--graphite-950,#0D1119)]">
        <img src={MARCA.foto} alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* Véu escuro: garante contraste do header transparente e do texto branco */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70" />
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

/* ── Cards de explicação, com atalho para a demonstração ── */
function CardOpcao({ Icone, titulo, desc, quando, ativo, onVer }: {
  Icone: React.ElementType; titulo: string; desc: string; quando: string; ativo: boolean; onVer: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className={`flex flex-col rounded-[16px] border bg-card p-5 ${ativo ? "border-primary" : "border-border"}`} style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-muted)]">
        <Icone aria-hidden className={`h-4 w-4 ${textoMarca}`} />
      </div>
      <h3 className="text-[1rem] font-bold tracking-tight text-foreground">{titulo}</h3>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{desc}</p>
      <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-foreground">
        <strong className="font-semibold">{t("When to use:", "Quando usar:")}</strong> {quando}
      </p>
      <button
        type="button"
        aria-pressed={ativo}
        onClick={onVer}
        className={`mt-4 inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-[10px] border border-primary px-3.5 text-[0.8125rem] font-semibold transition-colors ${foco}
          ${ativo ? "bg-primary text-primary-foreground" : `bg-card ${textoMarca} hover:bg-[var(--primary-muted)]`}`}
      >
        {ativo ? <><Check aria-hidden className="h-4 w-4" /> {t("Showing in the demo", "Na demonstração")}</> : <><Eye aria-hidden className="h-4 w-4" /> {t("See in the demo", "Ver na demonstração")}</>}
      </button>
    </div>
  );
}

export function HeaderShowcase() {
  const { t } = useI18n();
  const [tela, setTela] = useState<Tela>("desktop");
  const [rolagem, setRolagem] = useState<Rolagem>("transparente");
  const [fundo, setFundo] = useState<Fundo>("foto");
  const [menuCel, setMenuCel] = useState<MenuCel>("gaveta");
  const demoRef = useRef<HTMLDivElement>(null);
  const verNaDemo = (f: () => void) => { f(); demoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  const opRolagem: { id: Rolagem; rotulo: string; Icone: React.ElementType; desc: string; quando: string }[] = [
    {
      id: "transparente", rotulo: t("Transparent → solid", "Transparente → sólido"), Icone: ArrowUpDown,
      desc: t(`No background over the cover; after ${SOLIDO_APOS}px of scrolling it gets the translucent surface, blur, border and a light shadow.`, `Sem fundo sobre a capa; depois de ${SOLIDO_APOS}px de rolagem ganha a superfície translúcida, o desfoque, a borda e uma sombra leve.`),
      quando: t("Pages with a cover (photo or gradient) at the top: home and landing pages.", "Páginas com capa (foto ou gradiente) no topo: página inicial e landing pages."),
    },
    {
      id: "some", rotulo: t("Hide and return", "Some e volta"), Icone: Eye,
      desc: t(`Hides when scrolling down (after ${SOME_APOS}px) and comes back as soon as the person scrolls up. Opening the menu always shows it.`, `Esconde ao rolar para baixo (depois de ${SOME_APOS}px) e volta assim que a pessoa rola para cima. Abrir o menu sempre mostra o header.`),
      quando: t("Long reading pages (articles, case studies), especially on phones, where every pixel of height counts.", "Páginas longas de leitura (artigos, cases), principalmente no celular, onde cada pixel de altura conta."),
    },
    {
      id: "compacto", rotulo: t("Compact on scroll", "Compacto ao rolar"), Icone: Minimize2,
      desc: t(`After ${COMPACTO_APOS}px the header goes from 72px to 56px and the logo shrinks; links and button stay in place.`, `Depois de ${COMPACTO_APOS}px o header passa de 72px para 56px e o logo diminui; links e botão continuam no lugar.`),
      quando: t("Pages where the menu must always be at hand, such as product pages and documentation.", "Páginas em que o menu precisa estar sempre à mão, como páginas de produto e documentação."),
    },
  ];

  const opMenu: { id: MenuCel; rotulo: string; Icone: React.ElementType; desc: string; quando: string }[] = [
    {
      id: "gaveta", rotulo: t("Side drawer", "Gaveta lateral"), Icone: PanelRight,
      desc: t("The menu button opens a panel from the right over a darkened background; tapping outside, the X or Esc closes it.", "O botão de menu abre um painel pela direita sobre o fundo escurecido; tocar fora, no X ou o Esc fecham."),
      quando: t("Sites with up to about 8 links and one main action. It is the default.", "Sites com até uns 8 links e uma ação principal. É o padrão."),
    },
    {
      id: "tela-cheia", rotulo: t("Full screen", "Tela cheia"), Icone: Maximize2,
      desc: t("The menu takes the whole screen, with large links and the main action at the bottom, within thumb reach.", "O menu ocupa a tela toda, com links grandes e a ação principal embaixo, ao alcance do polegar."),
      quando: t("Institutional and campaign pages with few links, where the menu is also a brand moment.", "Páginas institucionais e de campanha com poucos links, em que o menu também é um momento de marca."),
    },
    {
      id: "barra", rotulo: t("Bottom bar (app)", "Barra inferior (app)"), Icone: PanelBottom,
      desc: t("Up to 5 destinations fixed at the bottom of the screen, with icon and name; the current one is marked in the primary colour and with aria-current.", "Até 5 destinos fixos no rodapé da tela, com ícone e nome; o atual fica marcado na cor primária e com aria-current."),
      quando: t("Logged-in areas used every day (panels and apps). It does not replace the menu of public sites.", "Áreas logadas de uso diário (painéis e apps). Não substitui o menu de sites públicos."),
    },
  ];

  const opFundo: { id: Fundo; rotulo: string; Icone: React.ElementType; desc: string; quando: string }[] = [
    {
      id: "pagina", rotulo: t("Page background", "Fundo da página"), Icone: Sun,
      desc: t("Header over the default background of the theme; dark text and the logo for light backgrounds.", "Header sobre o fundo padrão do tema; texto escuro e logo para fundo claro."),
      quando: t("Most internal pages.", "A maioria das páginas internas."),
    },
    {
      id: "foto", rotulo: t("Dark photo", "Foto escura"), Icone: ImageIcon,
      desc: t("Transparent header over the photo, with white logo and links. A dark veil over the photo (black from 70% to 45%) guarantees contrast whatever the image.", "Header transparente sobre a foto, com logo e links em branco. Um véu escuro sobre a foto (preto de 70% a 45%) garante o contraste com qualquer imagem."),
      quando: t("Covers with photos of people and places. Never put white text straight on a photo without the veil.", "Capas com foto de pessoas e lugares. Nunca use texto branco direto na foto, sem o véu."),
    },
    {
      id: "gradiente", rotulo: t("Brand gradient", "Gradiente da marca"), Icone: Palette,
      desc: t("The Gradient Animation from Backgrounds behind the header, with the default palette of the theme; text stays in the theme colours.", "O Gradient Animation da seção Backgrounds por trás do header, com a paleta padrão do tema; o texto continua nas cores do tema."),
      quando: t("Product and campaign covers without a photo.", "Capas de produto e de campanha sem foto."),
    },
    {
      id: "escuro", rotulo: t("Dark mode", "Modo escuro"), Icone: Moon,
      desc: t("Same rules in the dark theme: translucent dark surface, light text and the logo version for dark backgrounds.", "As mesmas regras no tema escuro: superfície escura translúcida, texto claro e a versão do logo para fundo escuro."),
      quando: t("Whenever the person chooses the dark theme.", "Sempre que a pessoa escolher o tema escuro."),
    },
  ];

  const tokenGroups: TokenGroup[] = [
    {
      group: t("Header — surface", "Header — superfície"),
      tokens: [
        { name: "--card / 85%", description: t("Solid header background (translucent)", "Fundo do header sólido (translúcido)"), light: "bg-card/85", dark: "bg-card/85" },
        { name: "backdrop-blur", description: t("Blur of what passes behind", "Desfoque do que passa por trás"), light: "24px (backdrop-blur-xl)" },
        { name: "--border", description: t("Bottom border when solid", "Borda inferior quando sólido"), light: "rgba(19,26,39,.09)", dark: "rgba(255,255,255,.07)", isColor: true },
        { name: "--shadow-sm", description: t("Only after scrolling, when content passes underneath", "Só depois de rolar, quando o conteúdo passa por baixo"), light: "0 1px 3px …" },
        { name: t("Photo veil", "Véu da foto"), description: t("Gradient over the photo cover", "Gradiente sobre a capa com foto"), light: "black 70% → 45% → 70%" },
      ],
    },
    {
      group: t("Header — sizes and motion", "Header — tamanhos e movimento"),
      tokens: [
        { name: t("Height", "Altura"), description: t("Desktop / phone / compact", "Desktop / celular / compacto"), light: "72px / 64px / 56px" },
        { name: t("Logo", "Logo"), description: t("Desktop / phone / compact", "Desktop / celular / compacto"), light: "40px / 32px / 28px" },
        { name: t("Touch target", "Área de toque"), description: t("Menu and close buttons", "Botões de menu e de fechar"), light: "40 × 40px" },
        { name: t("Thresholds", "Limites"), description: t("Solid / compact / hide", "Sólido / compacto / some"), light: `${SOLIDO_APOS}px / ${COMPACTO_APOS}px / ${SOME_APOS}px` },
        { name: t("Transition", "Transição"), description: t("Height, position and background; off with reduced motion", "Altura, posição e fundo; desligada com movimento reduzido"), light: "200ms ease-out" },
        { name: "z-index", description: t("Header / menus over the page", "Header / menus sobre a página"), light: "20 / 30" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="header-demo" ref={demoRef} className="scroll-mt-24">
        <SectionHeader
          title={t("Header & menus", "Header e menus")}
          description={t(
            "Site header pattern, based on the studio site header (links in the centre and a pill contact button) and on this DS header (translucent background with blur). Scroll inside the window to see each behaviour.",
            "Padrão de header de site, a partir do header do site do estúdio (links no centro e botão de contato em pílula) e do header deste DS (fundo translúcido com desfoque). Role dentro da janela para ver cada comportamento.",
          )}
        />
        <div className="mb-5 flex flex-wrap gap-x-6 gap-y-4">
          <Segmentado rotulo={t("Screen", "Tela")} valor={tela} onChange={setTela} opcoes={[
            { id: "desktop", rotulo: "Desktop", Icone: Monitor },
            { id: "celular", rotulo: t("Phone", "Celular"), Icone: Smartphone },
          ]} />
          <Segmentado rotulo={t("Scroll", "Rolagem")} valor={rolagem} onChange={setRolagem} opcoes={opRolagem.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          <Segmentado rotulo={t("Background", "Fundo")} valor={fundo} onChange={setFundo} opcoes={opFundo.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          {tela === "celular" && (
            <Segmentado rotulo={t("Phone menu", "Menu no celular")} valor={menuCel} onChange={setMenuCel} opcoes={opMenu.map(({ id, rotulo, Icone }) => ({ id, rotulo, Icone }))} />
          )}
        </div>
        <DemoHeader tela={tela} rolagem={rolagem} fundo={fundo} menuCel={menuCel} />
      </section>

      <section id="header-scroll">
        <SectionHeader title={t("Scroll behaviours", "Comportamentos de rolagem")} description={t("The same header, three ways of reacting to scrolling. They work on desktop and on phones.", "O mesmo header, três formas de reagir à rolagem. Valem para desktop e celular.")} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {opRolagem.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} desc={o.desc} quando={o.quando} ativo={rolagem === o.id} onVer={() => verNaDemo(() => setRolagem(o.id))} />
          ))}
        </div>
      </section>

      <section id="header-mobile">
        <SectionHeader title={t("Phone menus", "Menus no celular")} description={t("Below 768px of width the links leave the header and go into the menu. The header keeps the logo and the menu button.", "Abaixo de 768px de largura os links saem do header e vão para o menu. O header fica com o logo e o botão de menu.")} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {opMenu.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} desc={o.desc} quando={o.quando} ativo={tela === "celular" && menuCel === o.id} onVer={() => verNaDemo(() => { setTela("celular"); setMenuCel(o.id); })} />
          ))}
        </div>
      </section>

      <section id="header-backgrounds">
        <SectionHeader title={t("Backgrounds behind the header", "Fundos por trás do header")} description={t("What passes behind the header defines the logo version and the text colour.", "O que passa por trás do header define a versão do logo e a cor do texto.")} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {opFundo.map(o => (
            <CardOpcao key={o.id} Icone={o.Icone} titulo={o.rotulo} desc={o.desc} quando={o.quando} ativo={fundo === o.id} onVer={() => verNaDemo(() => setFundo(o.id))} />
          ))}
        </div>
      </section>

      <section id="header-a11y">
        <SectionHeader title={t("Accessibility checklist", "Checklist de acessibilidade")} />
        <Panel className="p-5">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2.5 md:grid-cols-2">
            {[
              t("The menu button has aria-expanded, aria-controls and a name (“Open menu”).", "O botão de menu tem aria-expanded, aria-controls e nome (“Abrir menu”)."),
              t("When the menu opens, focus goes to the first item; Tab stays inside the menu.", "Ao abrir o menu, o foco vai para o primeiro item; o Tab fica dentro do menu."),
              t("Esc, the X and tapping outside close the menu, and focus returns to the menu button.", "Esc, o X e tocar fora fecham o menu, e o foco volta para o botão de menu."),
              t("The page does not scroll behind an open menu.", "A página não rola por trás do menu aberto."),
              t("Header that hides comes back when the menu opens or when keyboard focus reaches it.", "Header que some volta quando o menu abre ou quando o foco do teclado chega nele."),
              t("Transitions are turned off with reduced motion.", "As transições são desligadas com movimento reduzido."),
              t("White text over a photo only with the dark veil (minimum contrast 4.5:1).", "Texto branco sobre foto só com o véu escuro (contraste mínimo de 4,5:1)."),
              t("Bottom bar: icon always with a name; current item with aria-current=\"page\".", "Barra inferior: ícone sempre com nome; item atual com aria-current=\"page\"."),
              t("Touch targets of at least 40 × 40px.", "Áreas de toque de pelo menos 40 × 40px."),
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
            t("Use one scroll behaviour per page and keep it in every page of the same type.", "Use um comportamento de rolagem por página e mantenha o mesmo em todas as páginas do mesmo tipo."),
            t("Keep the main action (for example, Contact) visible in the header and repeat it in the phone menu.", "Mantenha a ação principal (por exemplo, Contato) visível no header e repita no menu do celular."),
            t("Swap the logo version according to the background behind it.", "Troque a versão do logo conforme o fundo por trás dele."),
          ]}
          donts={[
            t("Do not combine “hide and return” with the bottom bar: the person loses both navigations.", "Não combine “some e volta” com a barra inferior: a pessoa perde as duas navegações."),
            t("Do not leave a transparent header over content after scrolling: it must become solid.", "Não deixe o header transparente sobre o conteúdo depois da rolagem: ele precisa ficar sólido."),
            t("Do not put more than 5 items in the bottom bar or links without a name.", "Não coloque mais de 5 itens na barra inferior nem ícones sem nome."),
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
