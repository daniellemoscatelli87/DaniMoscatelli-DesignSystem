import React, { useRef } from "react";
import { useI18n } from "../../i18n";
import { SectionHeader } from "./shared/SectionHeader";
import { DataTable, DoDont, Mono } from "./shared/Guidance";
import { HeroComAba } from "../ui/hero-com-aba";
import { CurvaSecao } from "../ui/curva-secao";
import { Parallax } from "../ui/parallax";
import { MenuDeAncoras } from "../ui/menu-de-ancoras";
import { ProgressoDeLeitura } from "../ui/progresso-de-leitura";
import { SecaoFixa } from "../ui/secao-fixa";
import { SurgirAoRolar } from "../ui/surgir-ao-rolar";
import { SeloSecao } from "../ui/selo-secao";
import { Button } from "../ui/button";
import { BotaoSubir } from "../ui/botao-subir";

/* Navegação de landing page (28/11/2026, aprovada pela dona do produto): as peças que conduzem a leitura de uma página
   longa. Todo o conteúdo das demonstrações é de exemplo. Cada demonstração rola dentro da própria caixa (a página do
   DS tem o cabeçalho dela), passando a caixa como `raiz`. */

const BASE = import.meta.env.BASE_URL;
const FOTO = `${BASE}fotos/projeto-piloto-hero.webp`;

/** Camada de fundo do parallax nas demonstrações: a foto do Projeto Piloto. */
function FundoDeExemplo({ velocidade = 0.2, raiz, className, children }: { velocidade?: number; raiz: React.RefObject<HTMLDivElement | null>; className?: string; children: React.ReactNode }) {
  return <Parallax raiz={raiz} imagem={FOTO} posicaoImagem="70% 40%" velocidade={velocidade} className={className}>{children}</Parallax>;
}

/** Imagem do hero de exemplo (só no computador, como a foto do site). */
function MidiaDoHero() {
  return <img src={FOTO} alt="" className="hidden aspect-[4/3] w-full rounded-lg object-cover object-[70%_40%] lg:block" />;
}

/** Voltar ao topo dentro da caixa de demonstração. */
function SubirDaDemo({ raiz, rodape, focoEm }: { raiz: React.RefObject<HTMLDivElement | null>; rodape: React.RefObject<HTMLElement | null>; focoEm: string }) {
  return <BotaoSubir raiz={raiz} alvo={rodape} fixo={false} aoLadoDoWhatsApp={false} focoEm={focoEm} />;
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-4 font-[family-name:var(--font-mono)] text-label leading-relaxed text-foreground">
      {children}
    </pre>
  );
}

/** Caixa de demonstração com rolagem própria (região rolável, alcançável pelo teclado). */
function CaixaDeRolagem({ refCaixa, rotulo, altura = "h-120", children, depois }: { refCaixa: React.RefObject<HTMLDivElement | null>; rotulo: string; altura?: string; children: React.ReactNode; depois?: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card">
      <div ref={refCaixa} role="region" aria-label={rotulo} tabIndex={0} className={`${altura} overflow-y-auto overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}>
        {children}
      </div>
      {depois}
    </div>
  );
}

function Bloco({ id, titulo, quando, arquivo, nomes, children, api, props, html, faca, naoFaca }: {
  id: string; titulo: string; quando: string; arquivo: string; nomes: string[]; children: React.ReactNode;
  api?: string; props?: React.ReactNode[][]; html?: string; faca: string[]; naoFaca: string[];
}) {
  const { t } = useI18n();
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div>
        <SectionHeader title={titulo} description={quando} />
        <dl className="-mt-6 grid gap-2 text-body-sm text-muted-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-x-3">
          <dt>{t("File", "Arquivo")}</dt>
          <dd className="flex flex-wrap gap-2">{arquivo.split(" · ").map(a => <Mono key={a}>{a}</Mono>)}</dd>
          <dt>{t("Components", "Componentes")}</dt>
          <dd className="flex flex-wrap gap-2">{nomes.map(n => <Mono key={n}>{n}</Mono>)}</dd>
        </dl>
      </div>
      {children}
      {props && <DataTable head={[t("Prop", "Prop"), t("What it does", "O que faz")]} rows={props} />}
      {api && (
        <div className="space-y-2">
          <h3 className="text-body-sm font-semibold text-foreground">{t("How to use (React)", "Como usar (React)")}</h3>
          <CodeBlock>{api}</CodeBlock>
        </div>
      )}
      {html && (
        <div className="space-y-2">
          <h3 className="text-body-sm font-semibold text-foreground">{t("How to use (HTML pages, plain CSS)", "Como usar (páginas em HTML, CSS puro)")}</h3>
          <CodeBlock>{html}</CodeBlock>
        </div>
      )}
      <DoDont dos={faca} donts={naoFaca} />
    </section>
  );
}

/** Blocos neutros para dar rolagem às demonstrações (decorativos). */
function Recheio({ linhas = 3 }: { linhas?: number }) {
  return (
    <div aria-hidden className="space-y-4 px-6 py-8 sm:px-10">
      <div className="h-4 w-2/3 rounded-full bg-graphite-100" />
      {Array.from({ length: linhas }, (_, i) => <div key={i} className="h-16 rounded-lg border border-border bg-card" />)}
    </div>
  );
}

function ConteudoDoHero({ titulo, celular = false }: { titulo: string; celular?: boolean }) {
  const { t } = useI18n();
  return (
    <div className={celular ? "grid gap-8" : "grid items-center gap-8 lg:grid-cols-2"}>
      <div className="flex flex-col items-start gap-4">
        <SeloSecao size="sm">{t("Example page", "Página de exemplo")}</SeloSecao>
        <h3 className="text-h3 font-bold tracking-[-0.02em] text-foreground [text-wrap:pretty] sm:text-h2">{titulo}</h3>
        <p className="max-w-xl text-body leading-relaxed text-muted-foreground">
          {t("Example text: on the site, a sentence that explains the page in plain words.", "Texto de exemplo: no site, uma frase que explica a página em palavras simples.")}
        </p>
        <Button>{t("Main action", "Ação principal")}</Button>
      </div>
      {!celular && <MidiaDoHero />}
    </div>
  );
}

export function NavegacaoLandingShowcase() {
  const { t } = useI18n();
  const caixaExemplo = useRef<HTMLDivElement>(null);
  const rodapeExemplo = useRef<HTMLElement>(null);
  const caixaHeroPc = useRef<HTMLDivElement>(null);
  const caixaHeroCel = useRef<HTMLDivElement>(null);
  const caixaParallax = useRef<HTMLDivElement>(null);
  const caixaMenu = useRef<HTMLDivElement>(null);
  const caixaMenuVertical = useRef<HTMLDivElement>(null);
  const caixaProgresso = useRef<HTMLDivElement>(null);
  const artigo = useRef<HTMLElement>(null);
  const caixaFixa = useRef<HTMLDivElement>(null);
  const caixaSurgir = useRef<HTMLDivElement>(null);
  const rodapeSurgir = useRef<HTMLElement>(null);

  const itensExemplo = [
    { id: "ex-sobre", rotulo: t("About", "Sobre") },
    { id: "ex-como", rotulo: t("How it works", "Como funciona") },
    { id: "ex-etapas", rotulo: t("Steps", "Etapas") },
    { id: "ex-contato", rotulo: t("Contact", "Contato") },
  ];
  const etapas = [1, 2, 3, 4].map(n => ({
    titulo: t(`Step ${n}`, `Etapa ${n}`),
    texto: t("Example text for this step. On the site, what happens here, in one or two sentences.", "Texto de exemplo desta etapa. No site, o que acontece aqui, em uma ou duas frases."),
  }));

  return (
    <div className="space-y-20">
      <div className="space-y-4">
        <SectionHeader
          title={t("Landing page navigation", "Navegação de landing page")}
          description={t(
            "The pieces that guide reading on a long page: the hero with the Learn more tab, curves between sections, parallax, the anchor menu with the section being read, the reading bar, the sticky section, reveal on scroll and back to top. Each one is a component (same API in both DS) and a set of plain CSS classes for the site's HTML pages, from a single source: the classes live in theme.css and the components use them.",
            "As peças que conduzem a leitura de uma página longa: o hero com a aba Saiba mais, as curvas entre seções, o parallax, o menu de âncoras com a seção em leitura, a barra de leitura, a seção fixa, a entrada ao rolar e o voltar ao topo. Cada uma é um componente (mesma API nos dois DS) e um conjunto de classes de CSS puro para as páginas em HTML do site, de uma fonte só: as classes ficam no theme.css e os componentes usam as mesmas.",
          )}
        />
      </div>

      {/* 1. Página de exemplo: tudo junto */}
      <section id="nav-exemplo" className="scroll-mt-32 space-y-6">
        <SectionHeader
          title={t("Example page", "Página de exemplo")}
          description={t(
            "All the pieces together, scrolling inside the box: the reading bar at the top, the hero with the tab (tap it), the anchor menu that sticks and marks the section being read, blocks that appear on scroll, a parallax band, the sticky section, the curve into the dark section and the back-to-top button at the end.",
            "Todas as peças juntas, rolando dentro da caixa: a barra de leitura no topo, o hero com a aba (toque nela), o menu de âncoras que gruda e marca a seção em leitura, blocos que surgem ao rolar, uma faixa com parallax, a seção fixa, a curva para a seção escura e o botão de voltar ao topo no fim.",
          )}
        />
        <CaixaDeRolagem
          refCaixa={caixaExemplo}
          rotulo={t("Example page (scrolls inside)", "Página de exemplo (rola por dentro)")}
          altura="h-140 lg:h-160"
          depois={<SubirDaDemo raiz={caixaExemplo} rodape={rodapeExemplo} focoEm="#ex-topo" />}
        >
          <div id="ex-topo" className="bg-card">
            <ProgressoDeLeitura raiz={caixaExemplo} posicao="grudado" className="-mb-1" />
            <HeroComAba raiz={caixaExemplo} telaCheia={false} rotulo={t("Learn more", "Saiba mais")} alvo="#ex-sobre" classNamePainel="px-6 pt-10 sm:px-10 lg:px-12 lg:pt-12">
              <ConteudoDoHero titulo={t("Example hero title", "Título do hero de exemplo")} />
            </HeroComAba>
            <MenuDeAncoras raiz={caixaExemplo} fixo noCelular="seletor" itens={itensExemplo} rotulo={t("On this page", "Nesta página")} className="px-6 sm:px-10" />
            <section id="ex-sobre" className="px-6 py-12 sm:px-10">
              <SurgirAoRolar raiz={caixaExemplo} escalonar className="max-w-2xl space-y-3">
                <h4 className="text-h4 font-bold text-foreground">{t("About", "Sobre")}</h4>
                <p className="text-body leading-relaxed text-muted-foreground">{t("Example text. The blocks appear as they reach the screen.", "Texto de exemplo. Os blocos surgem quando chegam na tela.")}</p>
                <p className="text-body leading-relaxed text-muted-foreground">{t("Second example paragraph, entering right after the first.", "Segundo parágrafo de exemplo, entrando logo depois do primeiro.")}</p>
              </SurgirAoRolar>
            </section>
            <FundoDeExemplo raiz={caixaExemplo} className="px-6 py-20 sm:px-10 sm:py-24">
              <section id="ex-como" className="max-w-md rounded-lg border border-border bg-card p-6">
                <h4 className="text-h4 font-bold text-foreground">{t("How it works", "Como funciona")}</h4>
                <p className="mt-2 text-body leading-relaxed text-muted-foreground">{t("The photo behind this card moves slower than the page.", "A foto atrás deste card anda mais devagar que a página.")}</p>
              </section>
            </FundoDeExemplo>
            <section id="ex-etapas" className="px-6 py-12 sm:px-10">
              <SecaoFixa
                topo={72}
                fixo={
                  <div className="space-y-2">
                    <h4 className="text-h4 font-bold text-foreground">{t("Steps", "Etapas")}</h4>
                    <p className="text-body leading-relaxed text-muted-foreground">{t("This title stays beside the steps on the computer.", "Este título fica parado ao lado das etapas no computador.")}</p>
                  </div>
                }
              >
                <ol className="m-0 list-none space-y-4 p-0">
                  {etapas.map(e => (
                    <li key={e.titulo} className="rounded-lg border border-border bg-card p-5">
                      <p className="text-body font-semibold text-foreground">{e.titulo}</p>
                      <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">{e.texto}</p>
                    </li>
                  ))}
                </ol>
              </SecaoFixa>
            </section>
            <section id="ex-contato" className="relative overflow-hidden bg-graphite-900 px-6 pb-12 pt-20 sm:px-10 sm:pt-28 lg:pt-32">
              <CurvaSecao posicao="topo" cor="var(--card)" />
              <h4 className="text-h4 font-bold text-white">{t("Contact", "Contato")}</h4>
              <p className="mt-2 max-w-xl text-body leading-relaxed text-graphite-100">{t("Example dark section, opened by the curve.", "Seção escura de exemplo, aberta pela curva.")}</p>
            </section>
            <footer ref={rodapeExemplo} className="border-t border-border px-6 py-6 text-body-sm text-muted-foreground sm:px-10">
              {t("Example footer: the back-to-top button appears here.", "Rodapé de exemplo: o botão de voltar ao topo aparece aqui.")}
            </footer>
          </div>
        </CaixaDeRolagem>
      </section>

      {/* 2. Hero com a aba Saiba mais */}
      <Bloco
        id="nav-hero-aba"
        titulo={t("Hero with the Learn more tab", "Hero com a aba Saiba mais")}
        quando={t(
          "The hero of the studio site's pages (home, Projeto Piloto, Rede de Parceiros), as it is live: a large rounded panel with a white tab cut out at the bottom centre, with Learn more and the arrow in a capsule. The tab has the colour of the next section, so the two become one piece. Tapping it scrolls smoothly to the next section (instantly with reduced motion) and moves the focus there.",
          "O hero das páginas do site do estúdio (página inicial, Projeto Piloto, Rede de Parceiros), como está no ar: um painel grande e arredondado com uma aba branca recortada no centro da base, com Saiba mais e a seta numa cápsula. A aba tem a cor da seção seguinte, então as duas viram uma peça só. Tocar nela leva à seção seguinte com rolagem suave (instantânea com menos movimento) e põe o foco lá.",
        )}
        arquivo="ui/hero-com-aba.tsx"
        nomes={["HeroComAba", "AbaSaibaMais"]}
        props={[
          [<Mono>alvo</Mono>, t("id of the next section (\"#about\"). Without it, the element right after the hero.", "id da seção seguinte (\"#sobre\"). Sem ele, o elemento logo depois do hero.")],
          [<Mono>rotulo</Mono>, t("Tab text. Default: Saiba mais.", "Texto da aba. Padrão: Saiba mais.")],
          [<Mono>corDaAba</Mono>, t("Colour of the next section, by token. Default: var(--card) (white).", "Cor da seção seguinte, por token. Padrão: var(--card) (branco).")],
          [<Mono>fundo</Mono>, t("Panel colour, by token. Default: the page grey.", "Cor do painel, por token. Padrão: o cinza do fundo da página.")],
          [<Mono>telaCheia</Mono>, t("On the computer, the panel fills the first screen with the tab visible (default: yes).", "No computador, o painel ocupa a primeira tela com a aba visível (padrão: sim).")],
          [<Mono>deslocamento</Mono>, t("Height of the fixed header, so the section stops right below it. \"auto\" (default) reads the site header and the fixed anchor menu.", "Altura do cabeçalho fixo, para a seção parar logo abaixo dele. \"auto\" (padrão) lê o cabeçalho do site e o menu de âncoras fixo.")],
          [<Mono>tela</Mono>, t("\"celular\" or \"computador\" forces one drawing (demos). Default: by screen width, 1024 px.", "\"celular\" ou \"computador\" força um desenho (demonstrações). Padrão: pela largura da tela, 1024 px.")],
          [<Mono>raiz</Mono>, t("Container with its own scroll (demos).", "Contêiner com rolagem própria (demonstrações).")],
        ]}
        api={`<HeroComAba alvo="#sobre">
  {/* conteúdo do hero: selo, título, texto, ação, foto */}
</HeroComAba>
<section id="sobre">…</section>  {/* seção seguinte, no branco do card */}`}
        html={`<section class="ds-hero-com-aba" data-tela-cheia>
  <div class="ds-hero-com-aba-painel">
    … conteúdo do hero …
    <a class="ds-aba-saiba-mais" href="#sobre">Saiba mais<span class="ds-aba-saiba-mais-seta" aria-hidden="true"><svg …seta para baixo do Lucide…></svg></span></a>
  </div>
</section>
<section id="sobre" class="ds-alvo-de-ancora">…</section>`}
        faca={[
          t("Make the next section the same colour as the tab (white by default), so they read as one piece.", "Deixe a seção seguinte da mesma cor da aba (branco, por padrão), para as duas virarem uma peça só."),
          t("Point the tab to the section that really comes next, with a real id.", "Aponte a aba para a seção que vem de fato a seguir, com um id de verdade."),
        ]}
        naoFaca={[
          t("Don't paint the tab grey or any colour other than the next section's.", "Não pinte a aba de cinza nem de outra cor que não a da seção seguinte."),
          t("Don't put text or buttons where the tab sits (the bottom centre of the hero).", "Não ponha texto nem botões onde a aba fica (o centro da base do hero)."),
        ]}
      >
        <div className="space-y-6">
          <div className="hidden space-y-2 md:block">
            <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Computer (from 1024 px)", "Computador (a partir de 1024 px)")}</p>
            <CaixaDeRolagem refCaixa={caixaHeroPc} rotulo={t("Hero on the computer", "Hero no computador")} altura="h-144">
              <HeroComAba raiz={caixaHeroPc} tela="computador" telaCheia={false} rotulo={t("Learn more", "Saiba mais")} alvo="#hero-pc-proxima" classNamePainel="px-10 pt-12">
                <ConteudoDoHero titulo={t("Example hero title", "Título do hero de exemplo")} />
              </HeroComAba>
              <section id="hero-pc-proxima" className="px-10 py-10">
                <h4 className="text-h4 font-bold text-foreground">{t("Next section", "Seção seguinte")}</h4>
                <p className="mt-2 text-body text-muted-foreground">{t("White, like the tab: the two become one piece.", "Branca, como a aba: as duas viram uma peça só.")}</p>
              </section>
              <Recheio linhas={4} />
            </CaixaDeRolagem>
          </div>
          <div className="space-y-2">
            <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Phone and tablet", "Celular e tablet")}</p>
            <div className="mx-auto w-full max-w-[24.375rem]">
              <CaixaDeRolagem refCaixa={caixaHeroCel} rotulo={t("Hero on the phone", "Hero no celular")} altura="h-140">
                <HeroComAba raiz={caixaHeroCel} tela="celular" telaCheia={false} rotulo={t("Learn more", "Saiba mais")} alvo="#hero-cel-proxima" classNamePainel="px-6 pt-8">
                  <ConteudoDoHero celular titulo={t("Example hero title", "Título do hero de exemplo")} />
                </HeroComAba>
                <section id="hero-cel-proxima" className="px-6 py-8">
                  <h4 className="text-h4 font-bold text-foreground">{t("Next section", "Seção seguinte")}</h4>
                  <p className="mt-2 text-body text-muted-foreground">{t("It starts with rounded corners, with the tab in the centre.", "Começa com os cantos arredondados, com a aba no centro.")}</p>
                </section>
                <Recheio linhas={4} />
              </CaixaDeRolagem>
            </div>
          </div>
          <DataTable
            head={[t("Measure", "Medida"), t("Computer", "Computador"), t("Phone and tablet", "Celular e tablet")]}
            rows={[
              [t("Panel", "Painel"), t("16 px of space around, corners of 32 px", "16 px de respiro em volta, cantos de 32 px"), t("Edge to edge; next section with corners of 28 px", "De ponta a ponta; seção seguinte com cantos de 28 px")],
              [t("Tab", "Aba"), t("320 × 56 px, top corners of 40 px, 12 px of padding", "320 × 56 px, cantos de cima de 40 px, 12 px de respiro"), t("132 × 28 px, top corners of 20 px; touch area of 44 px", "132 × 28 px, cantos de cima de 20 px; área de toque de 44 px")],
              [t("Text", "Texto"), t("16 px semibold, 16 px from the capsule", "16 px seminegrito, a 16 px da cápsula"), t("12 px semibold, 8 px from the capsule", "12 px seminegrito, a 8 px da cápsula")],
              [t("Arrow capsule", "Cápsula da seta"), t("20 × 32 px, border graphite 100, arrow of 14 px in --primary", "20 × 32 px, borda grafite 100, seta de 14 px em --primary"), t("14 × 20 px, arrow of 10 px", "14 × 20 px, seta de 10 px")],
              [t("Motion", "Movimento"), t("The tab rises from the panel base (0.7 s, snappy curve, after 0.6 s); hover: capsule in light grey", "A aba sobe da base do painel (0,7 s, curva snappy, depois de 0,6 s); hover: cápsula no cinza claro"), t("No entrance; the same hover and focus", "Sem entrada; o mesmo hover e o mesmo foco")],
            ]}
          />
        </div>
      </Bloco>

      {/* 3. Curva entre seções */}
      <Bloco
        id="nav-curva"
        titulo={t("Curve between sections", "Curva entre seções")}
        quando={t(
          "A soft curved edge between a light section and a dark one. Top: painted with the colour of the section above, which \"comes down\" over this one. Bottom: painted with the colour of the section below, which \"comes up\". 48 px on phones, 80 px from 640 px and 96 px from 1024 px.",
          "Uma borda curva e suave entre uma seção clara e uma escura. Topo: pintada com a cor da seção de cima, que \"desce\" sobre esta. Base: pintada com a cor da seção de baixo, que \"sobe\". 48 px no celular, 80 px a partir de 640 px e 96 px a partir de 1024 px.",
        )}
        arquivo="ui/curva-secao.tsx"
        nomes={["CurvaSecao"]}
        props={[
          [<Mono>posicao</Mono>, t("\"topo\" (default) or \"base\".", "\"topo\" (padrão) ou \"base\".")],
          [<Mono>cor</Mono>, t("Colour of the neighbouring section, by token. Default: var(--background).", "Cor da seção vizinha, por token. Padrão: var(--background).")],
        ]}
        api={`<section className="relative overflow-hidden bg-graphite-900 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32">
  <CurvaSecao posicao="topo" cor="var(--card)" />
  …
  <CurvaSecao posicao="base" cor="var(--card)" />
</section>`}
        html={`<section style="position:relative; overflow:hidden">
  <svg class="ds-curva-secao" data-posicao="topo" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path fill="var(--card)" d="M0 0H1440V24C1080 96 360 96 0 24Z"/>
  </svg>
  …
  <svg class="ds-curva-secao" data-posicao="base" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path fill="var(--card)" d="M0 96H1440V72C1080 0 360 0 0 72Z"/>
  </svg>
</section>`}
        faca={[t("Leave extra space at the top and bottom of the section, the same height as the curve.", "Deixe respiro extra no topo e na base da seção, da mesma altura da curva.")]}
        naoFaca={[t("Don't use the curve between two sections of the same colour: it disappears.", "Não use a curva entre duas seções da mesma cor: ela some.")]}
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-card px-6 py-8 sm:px-10">
            <p className="text-body font-semibold text-foreground">{t("Light section", "Seção clara")}</p>
          </div>
          <div className="relative overflow-hidden bg-graphite-900 px-6 pb-20 pt-20 sm:px-10 sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
            <CurvaSecao posicao="topo" cor="var(--card)" />
            <p className="text-body font-semibold text-white">{t("Dark section between two curves", "Seção escura entre duas curvas")}</p>
            <CurvaSecao posicao="base" cor="var(--card)" />
          </div>
          <div className="bg-card px-6 py-8 sm:px-10">
            <p className="text-body font-semibold text-foreground">{t("Light section", "Seção clara")}</p>
          </div>
        </div>
      </Bloco>

      {/* 4. Parallax */}
      <Bloco
        id="nav-parallax"
        titulo="Parallax"
        quando={t(
          "A background layer that moves slower than the content, giving depth to a photo band or a highlight section. Only the background moves, never text or buttons, and only a little. Transform only (nothing shifts in the layout); stopped with reduced motion and, by default, on touch screens. Scroll the box.",
          "Uma camada de fundo que anda mais devagar que o conteúdo, dando profundidade a uma faixa de foto ou a uma seção de destaque. Só o fundo se move, nunca o texto nem os botões, e pouco. Só transform (nada muda de lugar no layout); parado com menos movimento e, por padrão, nas telas de toque. Role a caixa.",
        )}
        arquivo="ui/parallax.tsx"
        nomes={["Parallax"]}
        props={[
          [<Mono>imagem</Mono>, t("Background photo (decorative, no alternative text). Or fundo: any layer (texture, lights).", "Foto do fundo (decorativa, sem texto alternativo). Ou fundo: qualquer camada (textura, luzes).")],
          [<Mono>velocidade</Mono>, t("From 0 to 0.5 (default 0.2): how much the layer lags behind the scroll.", "De 0 a 0,5 (padrão 0,2): quanto a camada se atrasa em relação à rolagem.")],
          [<Mono>desligarNoToque</Mono>, t("Stopped on touch screens (default: yes).", "Parado nas telas de toque (padrão: sim).")],
          [<Mono>posicaoImagem</Mono>, t("Framing of the photo (object-position).", "Enquadramento da foto (object-position).")],
          [<Mono>raiz</Mono>, t("Container with its own scroll (demos).", "Contêiner com rolagem própria (demonstrações).")],
        ]}
        api={`<Parallax imagem="/fotos/faixa.webp" velocidade={0.2} className="py-24">
  <div className="…">conteúdo por cima</div>
</Parallax>`}
        html={`<div class="ds-parallax" data-toque="parado" style="--parallax-velocidade: .2">
  <div class="ds-parallax-camada" aria-hidden="true"><img src="/fotos/faixa.webp" alt=""></div>
  … conteúdo por cima …
</div>
<!-- Sem JavaScript nos navegadores com animação ligada à rolagem; nos outros, a foto fica parada. -->`}
        faca={[
          t("Use it on one or two bands per page, with a photo or texture behind.", "Use em uma ou duas faixas por página, com foto ou textura atrás."),
          t("Put text on a card or on a surface with contrast, never straight on the photo.", "Ponha o texto num card ou numa superfície com contraste, nunca direto sobre a foto."),
        ]}
        naoFaca={[
          t("Don't move text, buttons or the whole page.", "Não mova texto, botões nem a página inteira."),
          t("Don't raise the speed to make it \"more visible\": it causes discomfort.", "Não aumente a velocidade para ficar \"mais visível\": causa desconforto."),
        ]}
      >
        <CaixaDeRolagem refCaixa={caixaParallax} rotulo={t("Parallax (scrolls inside)", "Parallax (rola por dentro)")} altura="h-120">
          <Recheio linhas={4} />
          <FundoDeExemplo raiz={caixaParallax} velocidade={0.3} className="px-6 py-24 sm:px-10">
            <div className="max-w-sm rounded-lg border border-border bg-card p-6">
              <p className="text-body font-semibold text-foreground">{t("Content on top", "Conteúdo por cima")}</p>
              <p className="mt-1 text-body-sm text-muted-foreground">{t("The photo behind moves slower than this card.", "A foto atrás anda mais devagar que este card.")}</p>
            </div>
          </FundoDeExemplo>
          <Recheio linhas={5} />
        </CaixaDeRolagem>
      </Bloco>

      {/* 5. Menu de âncoras */}
      <Bloco
        id="nav-menu-ancoras"
        titulo={t("Anchor menu", "Menu de âncoras")}
        quando={t(
          "Links to the sections of a long page. As the person scrolls, the item of the section being read is marked: selected pink (--primary-suave), a border in the brand colour and aria-current, never colour alone. A row of chips that wraps (never scrolls sideways); vertical list on the computer; on the phone, optionally a compact select. Fixed: it sticks right below the site header, and the sections stop below both.",
          "Os links para as seções de uma página longa. Conforme a pessoa rola, o item da seção em leitura fica marcado: rosa de selecionado (--primary-suave), borda na cor da marca e aria-current, nunca só cor. Uma fileira de chips que quebra de linha (nunca rola para o lado); lista vertical no computador; no celular, se quiser, uma lista de seleção compacta. Fixo: gruda logo abaixo do cabeçalho do site, e as seções param abaixo dos dois.",
        )}
        arquivo="ui/menu-de-ancoras.tsx"
        nomes={["MenuDeAncoras", "useSecaoAtiva"]}
        props={[
          [<Mono>itens</Mono>, t("{ id, rotulo }[]: the sections, in page order.", "{ id, rotulo }[]: as seções, na ordem da página.")],
          [<Mono>orientacao</Mono>, t("\"horizontal\" (default, chips) or \"vertical\" (list from 1024 px, chips below).", "\"horizontal\" (padrão, chips) ou \"vertical\" (lista a partir de 1024 px, chips abaixo).")],
          [<Mono>noCelular</Mono>, t("\"chips\" (default) or \"seletor\": a compact select on phones and tablets.", "\"chips\" (padrão) ou \"seletor\": uma lista de seleção compacta no celular e no tablet.")],
          [<Mono>fixo</Mono>, t("Sticks below the site header while the page scrolls (glass background, like the header).", "Gruda abaixo do cabeçalho do site enquanto a página rola (fundo de vidro, como o do cabeçalho).")],
          [<Mono>deslocamento</Mono>, t("Height of the fixed site header. \"auto\" (default) reads --altura-cabecalho or the fixed CabecalhoDoSite.", "Altura do cabeçalho fixo do site. \"auto\" (padrão) lê --altura-cabecalho ou o CabecalhoDoSite fixo.")],
          [<Mono>rotulo</Mono>, t("Name for screen readers. Default: Nesta página.", "Nome para leitores de tela. Padrão: Nesta página.")],
          [<Mono>aoMudar</Mono>, t("Called with the id of the section being read.", "Chamada com o id da seção em leitura.")],
          [<Mono>tela</Mono>, t("Forces the phone or computer drawing (demos).", "Força o desenho de celular ou de computador (demonstrações).")],
        ]}
        api={`<MenuDeAncoras fixo itens={[
  { id: "sobre", rotulo: "Sobre" },
  { id: "como-funciona", rotulo: "Como funciona" },
  { id: "contato", rotulo: "Contato" },
]} />`}
        html={`<nav class="ds-menu-de-ancoras" data-fixo data-orientacao="horizontal" aria-label="Nesta página">
  <ul class="ds-menu-de-ancoras-lista">
    <li><a class="ds-menu-de-ancoras-item" href="#sobre" aria-current="true">Sobre</a></li>
    <li><a class="ds-menu-de-ancoras-item" href="#como-funciona">Como funciona</a></li>
  </ul>
</nav>
<section id="sobre" class="ds-alvo-de-ancora">…</section>
<!-- Em HTML, o script da página troca o aria-current conforme a rolagem (a mesma regra do useSecaoAtiva). -->`}
        faca={[
          t("Use short labels, the same as the section titles.", "Use rótulos curtos, iguais aos títulos das seções."),
          t("Keep between 3 and 7 items.", "Mantenha entre 3 e 7 itens."),
        ]}
        naoFaca={[
          t("Don't let the chip row scroll sideways: it wraps, or becomes the select on phones.", "Não deixe a fileira de chips rolar para o lado: ela quebra de linha ou vira a lista de seleção no celular."),
          t("Don't mark the current item with colour only, and don't use pink for hover.", "Não marque o item atual só com cor nem use rosa no hover."),
        ]}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Fixed chips row", "Fileira de chips fixa")}</p>
            <CaixaDeRolagem refCaixa={caixaMenu} rotulo={t("Anchor menu (scrolls inside)", "Menu de âncoras (rola por dentro)")} altura="h-120">
              <div className="px-6 pb-4 pt-8 sm:px-10">
                <p className="text-body font-semibold text-foreground">{t("Example page top", "Topo da página de exemplo")}</p>
              </div>
              <MenuDeAncoras raiz={caixaMenu} fixo itens={[
                { id: "ma-sobre", rotulo: t("About", "Sobre") },
                { id: "ma-como", rotulo: t("How it works", "Como funciona") },
                { id: "ma-etapas", rotulo: t("Steps", "Etapas") },
                { id: "ma-contato", rotulo: t("Contact", "Contato") },
              ]} rotulo={t("On this page", "Nesta página")} className="px-6 sm:px-10" />
              {[["ma-sobre", t("About", "Sobre")], ["ma-como", t("How it works", "Como funciona")], ["ma-etapas", t("Steps", "Etapas")], ["ma-contato", t("Contact", "Contato")]].map(([id, nome]) => (
                <section key={id} id={id} className="border-b border-border px-6 py-8 sm:px-10">
                  <h4 className="text-h4 font-bold text-foreground">{nome}</h4>
                  <div aria-hidden className="mt-4 space-y-3">
                    {[0, 1, 2].map(i => <div key={i} className="h-12 rounded-lg border border-border bg-card" />)}
                  </div>
                </section>
              ))}
            </CaixaDeRolagem>
          </div>
          <div className="space-y-2">
            <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Vertical on the computer, select on the phone", "Vertical no computador, lista de seleção no celular")}</p>
            <CaixaDeRolagem refCaixa={caixaMenuVertical} rotulo={t("Vertical anchor menu (scrolls inside)", "Menu de âncoras vertical (rola por dentro)")} altura="h-120">
              <div className="grid gap-6 px-6 py-6 sm:px-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                  <MenuDeAncoras raiz={caixaMenuVertical} orientacao="vertical" noCelular="seletor" deslocamento={0} itens={[
                    { id: "mv-visao", rotulo: t("Overview", "Visão geral") },
                    { id: "mv-metodo", rotulo: t("Method", "Método") },
                    { id: "mv-resultados", rotulo: t("Results", "Resultados") },
                    { id: "mv-duvidas", rotulo: t("Questions", "Dúvidas") },
                  ]} rotulo={t("On this page", "Nesta página")} />
                </div>
                <div>
                  {[["mv-visao", t("Overview", "Visão geral")], ["mv-metodo", t("Method", "Método")], ["mv-resultados", t("Results", "Resultados")], ["mv-duvidas", t("Questions", "Dúvidas")]].map(([id, nome]) => (
                    <section key={id} id={id} className="border-b border-border py-6">
                      <h4 className="text-h4 font-bold text-foreground">{nome}</h4>
                      <div aria-hidden className="mt-4 space-y-3">
                        {[0, 1, 2].map(i => <div key={i} className="h-12 rounded-lg border border-border bg-card" />)}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </CaixaDeRolagem>
          </div>
        </div>
      </Bloco>

      {/* 6. Progresso de leitura */}
      <Bloco
        id="nav-progresso"
        titulo={t("Reading progress", "Progresso de leitura")}
        quando={t(
          "A thin bar (4 px) at the top, in the brand colour, that fills as the page or a long text scrolls. It is only a visual cue, hidden from screen readers. No transition: it follows the scroll frame by frame, so it never animates on its own.",
          "Uma barra fina (4 px) no topo, na cor da marca, que enche conforme a página ou um texto longo rola. É só um sinal visual, fora da leitura de tela. Sem transição: acompanha a rolagem quadro a quadro, então nunca anima sozinha.",
        )}
        arquivo="ui/progresso-de-leitura.tsx"
        nomes={["ProgressoDeLeitura"]}
        props={[
          [<Mono>alvo</Mono>, t("ref of the element to follow (the article). Without it, the whole page.", "ref do elemento a acompanhar (o artigo). Sem ela, a página toda.")],
          [<Mono>posicao</Mono>, t("\"fixo\" (default, top of the screen), \"grudado\" (sticky) or \"absoluto\".", "\"fixo\" (padrão, topo da tela), \"grudado\" (sticky) ou \"absoluto\".")],
          [<Mono>topo</Mono>, t("Distance from the top (below a fixed header), in px or CSS.", "Distância do topo (abaixo de um cabeçalho fixo), em px ou CSS.")],
          [<Mono>raiz</Mono>, t("Container with its own scroll (demos).", "Contêiner com rolagem própria (demonstrações).")],
        ]}
        api={`<ProgressoDeLeitura />              {/* a página toda */}
<ProgressoDeLeitura alvo={artigoRef} />  {/* só o artigo */}`}
        html={`<div class="ds-progresso-de-leitura" aria-hidden="true"><div class="ds-progresso-de-leitura-barra"></div></div>
<!-- Sem JavaScript nos navegadores com animation-timeline (a página toda). -->`}
        faca={[t("Use it on long reading pages: articles, terms, case studies.", "Use em páginas longas de leitura: artigos, termos, estudos de caso.")]}
        naoFaca={[t("Don't use it as a loading bar or to show steps of a form.", "Não use como barra de carregamento nem para mostrar etapas de um formulário.")]}
      >
        <CaixaDeRolagem refCaixa={caixaProgresso} rotulo={t("Reading progress (scrolls inside)", "Progresso de leitura (rola por dentro)")} altura="h-120">
          <ProgressoDeLeitura raiz={caixaProgresso} alvo={artigo} posicao="grudado" className="-mb-1" />
          <article ref={artigo} className="mx-auto max-w-2xl space-y-4 px-6 py-10 sm:px-10">
            <h4 className="text-h4 font-bold text-foreground">{t("Example article", "Artigo de exemplo")}</h4>
            {[1, 2, 3, 4, 5, 6, 7].map(n => (
              <p key={n} className="text-body leading-relaxed text-muted-foreground">
                {t(`Example paragraph ${n}. The bar at the top fills as this text scrolls, from its beginning to its end.`, `Parágrafo de exemplo ${n}. A barra no topo enche conforme este texto rola, do começo dele até o fim dele.`)}
              </p>
            ))}
          </article>
        </CaixaDeRolagem>
      </Bloco>

      {/* 7. Seção fixa */}
      <Bloco
        id="nav-secao-fixa"
        titulo={t("Sticky section", "Seção fixa")}
        quando={t(
          "Two columns for long content (method steps, questions, a story in parts): on the computer, the title or image stays still beside the text column while it scrolls; when the section ends, both leave together. On phones and tablets everything stacks normally. CSS only (position: sticky).",
          "Duas colunas para conteúdo longo (etapas de um método, perguntas, uma história em partes): no computador, o título ou a imagem fica parado ao lado da coluna de texto enquanto ela rola; quando a seção acaba, os dois saem juntos. No celular e no tablet, tudo empilha normalmente. Só CSS (position: sticky).",
        )}
        arquivo="ui/secao-fixa.tsx"
        nomes={["SecaoFixa"]}
        props={[
          [<Mono>fixo</Mono>, t("What stays still: the title with the introduction, or an image.", "O que fica parado: o título com a introdução, ou uma imagem.")],
          [<Mono>children</Mono>, t("The column that scrolls.", "A coluna que rola.")],
          [<Mono>lado</Mono>, t("\"esquerda\" (default) or \"direita\". Columns of 5/12 and 7/12, 64 px apart.", "\"esquerda\" (padrão) ou \"direita\". Colunas de 5/12 e 7/12, a 64 px uma da outra.")],
          [<Mono>topo</Mono>, t("Where the column stops. Default: below the site header, with the standard space (--espaco-abaixo-do-cabecalho).", "Onde a coluna para. Padrão: abaixo do cabeçalho do site, com o espaço padrão (--espaco-abaixo-do-cabecalho).")],
        ]}
        api={`<SecaoFixa fixo={<><h2>Como funciona</h2><p>…</p></>}>
  <ol>…etapas…</ol>
</SecaoFixa>`}
        html={`<section class="ds-secao-fixa">
  <div class="ds-secao-fixa-lado">… título ou imagem …</div>
  <div class="ds-secao-fixa-conteudo">… texto que rola …</div>
</section>`}
        faca={[t("Use it when the text column is clearly longer than the sticky one.", "Use quando a coluna de texto é bem mais longa que a parada.")]}
        naoFaca={[t("Don't make the sticky column taller than the screen: its end would never be seen.", "Não deixe a coluna parada mais alta que a tela: o fim dela nunca apareceria.")]}
      >
        <CaixaDeRolagem refCaixa={caixaFixa} rotulo={t("Sticky section (scrolls inside)", "Seção fixa (rola por dentro)")} altura="h-120">
          <div className="px-6 py-10 sm:px-10">
            <SecaoFixa
              topo={24}
              fixo={
                <div className="space-y-2">
                  <h4 className="text-h4 font-bold text-foreground">{t("How it works", "Como funciona")}</h4>
                  <p className="text-body leading-relaxed text-muted-foreground">{t("Example introduction that stays still while the steps scroll.", "Introdução de exemplo que fica parada enquanto as etapas rolam.")}</p>
                </div>
              }
            >
              <ol className="m-0 list-none space-y-4 p-0">
                {etapas.concat(etapas.map(e => ({ ...e, titulo: e.titulo + " " + t("(continued)", "(continuação)") }))).map((e, i) => (
                  <li key={i} className="rounded-lg border border-border bg-card p-5">
                    <p className="text-body font-semibold text-foreground">{e.titulo}</p>
                    <p className="mt-1 text-body-sm leading-relaxed text-muted-foreground">{e.texto}</p>
                  </li>
                ))}
              </ol>
            </SecaoFixa>
          </div>
          <Recheio linhas={3} />
        </CaixaDeRolagem>
      </Bloco>

      {/* 8. Surgir ao rolar e voltar ao topo (já existiam) */}
      <Bloco
        id="nav-surgir"
        titulo={t("Reveal on scroll and back to top", "Surgir ao rolar e voltar ao topo")}
        quando={t(
          "Already in the DS, part of the same navigation: blocks appear as they reach the screen (nothing hidden and nothing animated with reduced motion), and the back-to-top button appears at the end of the page and returns the focus to the start.",
          "Já existiam no DS e fazem parte da mesma navegação: os blocos surgem quando chegam na tela (nada escondido e nada animado com menos movimento), e o botão de voltar ao topo aparece no fim da página e devolve o foco ao começo.",
        )}
        arquivo="ui/surgir-ao-rolar.tsx · ui/botao-subir.tsx"
        nomes={["SurgirAoRolar", "TituloQueSurge", "BotaoSubir"]}
        api={`<SurgirAoRolar escalonar>…blocos…</SurgirAoRolar>
<BotaoSubir />  {/* aparece quando o rodapé entra na tela */}`}
        faca={[t("Use the reveal on section openings and groups of cards.", "Use a entrada nas aberturas de seção e nos grupos de cards.")]}
        naoFaca={[t("Don't animate every paragraph of a long text.", "Não anime cada parágrafo de um texto longo.")]}
      >
        <CaixaDeRolagem
          refCaixa={caixaSurgir}
          rotulo={t("Reveal on scroll (scrolls inside)", "Surgir ao rolar (rola por dentro)")}
          altura="h-120"
          depois={<SubirDaDemo raiz={caixaSurgir} rodape={rodapeSurgir} focoEm="#ex-topo-surgir" />}
        >
          <div id="ex-topo-surgir" className="px-6 py-10 sm:px-10">
            <p className="text-body text-muted-foreground">{t("Scroll down: the cards appear one after the other, again on each descent.", "Role para baixo: os cards surgem um depois do outro, de novo a cada descida.")}</p>
            <div className="h-80" aria-hidden />
            <SurgirAoRolar raiz={caixaSurgir} escalonar repetir className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-body font-semibold text-foreground">{t(`Card ${n}`, `Card ${n}`)}</p>
                  <p className="mt-1 text-body-sm text-muted-foreground">{t("Example text.", "Texto de exemplo.")}</p>
                </div>
              ))}
            </SurgirAoRolar>
            <div className="h-80" aria-hidden />
          </div>
          <footer ref={rodapeSurgir} className="border-t border-border px-6 py-6 text-body-sm text-muted-foreground sm:px-10">
            {t("Example footer: the back-to-top button appears here.", "Rodapé de exemplo: o botão de voltar ao topo aparece aqui.")}
          </footer>
        </CaixaDeRolagem>
      </Bloco>

      {/* 9. Classes de CSS puro */}
      <section id="nav-classes" className="scroll-mt-32 space-y-6">
        <SectionHeader
          title={t("Plain CSS classes (HTML pages)", "Classes de CSS puro (páginas em HTML)")}
          description={t(
            "For the site pages still written in HTML. The classes are in theme.css, in their own block (@ds-css-puro:navegacao-landing); the React components use the same ones, so a change in the DS reaches both. data-tela=\"celular\" or \"computador\" forces a drawing; without it, the screen width decides (1024 px).",
            "Para as páginas do site ainda escritas em HTML. As classes ficam no theme.css, num bloco próprio (@ds-css-puro:navegacao-landing); os componentes React usam as mesmas, então uma mudança no DS chega aos dois. data-tela=\"celular\" ou \"computador\" força um desenho; sem ele, vale a largura da tela (1024 px).",
          )}
        />
        <DataTable
          head={[t("Class", "Classe"), t("Piece", "Peça"), t("Variables and attributes", "Variáveis e atributos")]}
          rows={[
            [<Mono>.ds-hero-com-aba</Mono>, "HeroComAba", <span><Mono>--hero-aba-cor</Mono> <Mono>--hero-fundo</Mono> <Mono>data-tela-cheia</Mono></span>],
            [<Mono>.ds-hero-com-aba-painel</Mono>, t("the rounded panel", "o painel arredondado"), "—"],
            [<Mono>.ds-aba-saiba-mais</Mono>, "AbaSaibaMais", <Mono>.ds-aba-saiba-mais-seta</Mono>],
            [<Mono>.ds-curva-secao</Mono>, "CurvaSecao", <Mono>data-posicao="topo|base"</Mono>],
            [<Mono>.ds-parallax</Mono>, "Parallax", <span><Mono>--parallax-velocidade</Mono> <Mono>data-toque="parado"</Mono> <Mono>.ds-parallax-camada</Mono></span>],
            [<Mono>.ds-menu-de-ancoras</Mono>, "MenuDeAncoras", <span><Mono>data-fixo</Mono> <Mono>data-orientacao</Mono> <Mono>.ds-menu-de-ancoras-item[aria-current]</Mono></span>],
            [<Mono>.ds-alvo-de-ancora</Mono>, t("the target sections", "as seções de destino"), t("stop below the header and the fixed menu", "param abaixo do cabeçalho e do menu fixo")],
            [<Mono>.ds-progresso-de-leitura</Mono>, "ProgressoDeLeitura", <span><Mono>--progresso-topo</Mono> <Mono>data-posicao</Mono></span>],
            [<Mono>.ds-secao-fixa</Mono>, "SecaoFixa", <span><Mono>--secao-fixa-topo</Mono> <Mono>data-lado="direita"</Mono></span>],
          ]}
        />
      </section>
    </div>
  );
}
