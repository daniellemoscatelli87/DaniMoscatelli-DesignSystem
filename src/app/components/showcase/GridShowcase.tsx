import React, { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { DataTable, DoDont, Mono, Panel } from "./shared/Guidance";
import { cn } from "../ui/utils";

/* ─────────────────────────────────────────────────────────────
   Grid e espaçamento
   Tokens em styles/theme.css: --space-*, --grid-columns/-margin/-gutter,
   --content-reading/-default/-wide e --section-space(-hero), com as
   classes .ds-container(-reading/-wide), .ds-grid e .ds-section(-hero).
   ───────────────────────────────────────────────────────────── */

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>;
}

type Tela = "celular" | "tablet" | "desktop";
/* Valores do grid por tela (os mesmos dos tokens) */
const GRID: Record<Tela, { colunas: number; margem: number; calha: number; aPartir: string; largura: number }> = {
  celular: { colunas: 4, margem: 16, calha: 16, aPartir: "0", largura: 360 },
  tablet: { colunas: 8, margem: 24, calha: 24, aPartir: "640 px", largura: 720 },
  desktop: { colunas: 12, margem: 32, calha: 24, aPartir: "1024 px", largura: 1216 },
};

/** Demonstração do grid: as colunas, a margem e a calha da tela escolhida, em escala dentro da página. */
function DemoDoGrid({ tela }: { tela: Tela }) {
  const { t } = useI18n();
  const g = GRID[tela];
  return (
    <div className="overflow-x-auto rounded-[16px] border border-border bg-card p-4">
      <div className="mx-auto" style={{ width: "100%", maxWidth: g.largura }}>
        <div className="mb-2 flex items-center justify-between text-[0.6875rem] font-mono text-muted-foreground">
          <span>{t("margin", "margem")} {g.margem}px</span>
          <span>{g.colunas} {t("columns", "colunas")} · {t("gutter", "calha")} {g.calha}px</span>
          <span>{t("margin", "margem")} {g.margem}px</span>
        </div>
        <div data-testid="demo-grid" data-colunas={g.colunas} className="rounded-[8px] bg-[var(--primary-muted)]/40" style={{ paddingInline: g.margem }}>
          <div className="grid h-40" style={{ gridTemplateColumns: `repeat(${g.colunas}, minmax(0, 1fr))`, columnGap: g.calha }}>
            {Array.from({ length: g.colunas }).map((_, i) => (
              <div key={i} className="flex items-end justify-center rounded-[4px] bg-primary/20 pb-1 text-[0.625rem] font-mono text-[var(--primary-text,var(--primary))]">{i + 1}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Exemplo de composição sobre o grid: blocos com span por tela. */
function Bloco({ span, rotulo, className }: { span: string; rotulo: string; className?: string }) {
  return (
    <div className={cn("flex min-h-16 items-center justify-center rounded-[10px] border border-border bg-card p-3 text-center text-[0.75rem] text-muted-foreground", span, className)}>
      <span><span className="block font-semibold text-foreground">{rotulo}</span><span className="font-mono text-[0.6875rem]">{span}</span></span>
    </div>
  );
}

export function GridShowcase() {
  const { t } = useI18n();
  const [tela, setTela] = useState<Tela>("desktop");

  const escala: { token: string; px: number; uso: string }[] = [
    { token: "--space-1", px: 4, uso: t("Icon and its label; tight internal details.", "Ícone e seu rótulo; detalhes internos apertados.") },
    { token: "--space-2", px: 8, uso: t("Items that belong together: chips, buttons side by side.", "Itens que andam juntos: chips, botões lado a lado.") },
    { token: "--space-3", px: 12, uso: t("Rows in dense lists; gap inside compact cards.", "Linhas de listas densas; espaço dentro de cards compactos.") },
    { token: "--space-4", px: 16, uso: t("Compact card padding; grid margin and gutter on phones.", "Padding de card compacto; margem e calha do grid no celular.") },
    { token: "--space-5", px: 20, uso: t("Between a title and its content block.", "Entre um título e o bloco de conteúdo.") },
    { token: "--space-6", px: 24, uso: t("Default card padding; gutter on tablet and desktop.", "Padding padrão do card; calha no tablet e no desktop.") },
    { token: "--space-8", px: 32, uso: t("Grid margin on desktop; between groups inside a section.", "Margem do grid no desktop; entre grupos dentro de uma seção.") },
    { token: "--space-10", px: 40, uso: t("Between a section heading and its content.", "Entre o título da seção e o conteúdo.") },
    { token: "--space-12", px: 48, uso: t("Between large blocks of the same section.", "Entre blocos grandes da mesma seção.") },
    { token: "--space-16", px: 64, uso: t("Between page sections on phones.", "Entre seções da página no celular.") },
    { token: "--space-20", px: 80, uso: t("Between page sections on desktop.", "Entre seções da página no desktop.") },
    { token: "--space-24", px: 96, uso: t("Before and after the hero.", "Antes e depois do hero.") },
  ];

  const tokenGroups: TokenGroup[] = [
    {
      group: t("Spacing scale (4 px base)", "Escala de espaçamento (base de 4 px)"),
      tokens: escala.map(e => ({ name: e.token, description: e.uso, light: `${e.px}px` })),
    },
    {
      group: t("Layout grid", "Grid de layout"),
      tokens: [
        { name: "--grid-columns", description: t("Columns: phone / tablet (≥ 640 px) / desktop (≥ 1024 px)", "Colunas: celular / tablet (≥ 640 px) / desktop (≥ 1024 px)"), light: "4 / 8 / 12" },
        { name: "--grid-margin", description: t("Side margin of the page", "Margem lateral da página"), light: "16 / 24 / 32 px" },
        { name: "--grid-gutter", description: t("Space between columns", "Espaço entre colunas"), light: "16 / 24 / 24 px" },
        { name: "--content-reading", description: t("Maximum width for reading and forms", "Largura máxima para leitura e formulários"), light: "768px" },
        { name: "--content-default", description: t("Default maximum width of the content", "Largura máxima padrão do conteúdo"), light: "1152px" },
        { name: "--content-wide", description: t("Maximum width for panels and tables", "Largura máxima para painéis e tabelas"), light: "1280px" },
        { name: "--section-space", description: t("Vertical space between sections: phone / desktop", "Espaço vertical entre seções: celular / desktop"), light: "64 / 80 px" },
        { name: "--section-space-hero", description: t("Before and after the hero", "Antes e depois do hero"), light: "96px" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="grid-visao" className="scroll-mt-32">
        <SectionHeader
          title={t("Grid and spacing", "Grid e espaçamento")}
          description={t(
            "One grid for every page: a 4 px spacing scale, columns that change with the screen (4, 8 and 12), maximum content widths and a fixed rhythm between sections. Spacing always comes from the scale; layout always sits on the grid.",
            "Um grid para todas as páginas: escala de espaçamento de 4 px, colunas que mudam com a tela (4, 8 e 12), larguras máximas do conteúdo e um ritmo fixo entre seções. Espaçamento sempre vem da escala; o layout sempre se apoia no grid.",
          )}
        />
        <DataTable
          head={[t("Screen", "Tela"), t("From", "A partir de"), t("Columns", "Colunas"), t("Margin", "Margem"), t("Gutter", "Calha"), t("Between sections", "Entre seções")]}
          rows={[
            [t("Phone", "Celular"), "0", "4", "16 px", "16 px", "64 px"],
            [t("Tablet", "Tablet"), "640 px", "8", "24 px", "24 px", "64 px"],
            [t("Desktop", "Desktop"), "1024 px", "12", "32 px", "24 px", "80 px"],
          ]}
        />
      </section>

      <section id="grid-escala" className="scroll-mt-32">
        <SectionHeader
          title={t("Spacing scale", "Escala de espaçamento")}
          description={t("Every padding, gap and margin uses one of these steps (multiples of 4 px). Small steps join related things; large steps separate groups and sections.", "Todo padding, espaço entre itens e margem usa um destes passos (múltiplos de 4 px). Passos pequenos juntam o que é relacionado; passos grandes separam grupos e seções.")}
        />
        <div className="space-y-2">
          {escala.map(e => (
            <div key={e.token} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[4.5rem_6.5rem_minmax(0,1fr)_minmax(0,1.4fr)]">
              <span className="text-right font-mono text-[0.8125rem] text-foreground">{e.px}px</span>
              <span className="hidden font-mono text-[0.75rem] text-muted-foreground sm:block">{e.token}</span>
              <div className="h-4 rounded-[3px] bg-primary/70" style={{ width: e.px * 2, maxWidth: "100%" }} />
              <span className="col-span-2 text-[0.8125rem] leading-snug text-muted-foreground sm:col-span-1">{e.uso}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="grid-colunas" className="scroll-mt-32">
        <SectionHeader
          title={t("Column grid", "Grid de colunas")}
          description={t("The page is divided into columns with a fixed margin at the sides and a fixed gutter between them. Content occupies whole columns (col-span), never half a column.", "A página é dividida em colunas, com margem fixa nas laterais e calha fixa entre elas. O conteúdo ocupa colunas inteiras (col-span), nunca meia coluna.")}
        />
        <div role="group" aria-label={t("Screen", "Tela")} className="mb-4 inline-flex flex-wrap gap-1 rounded-[12px] bg-muted p-1">
          {([
            ["celular", t("Phone", "Celular"), Smartphone],
            ["tablet", t("Tablet", "Tablet"), Tablet],
            ["desktop", "Desktop", Monitor],
          ] as [Tela, string, React.ElementType][]).map(([id, rotulo, Icone]) => (
            <button key={id} type="button" aria-pressed={tela === id} onClick={() => setTela(id)}
              className={cn("inline-flex h-8 items-center gap-1.5 rounded-[9px] px-2.5 text-[0.75rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                tela === id ? "bg-card text-foreground shadow-[var(--shadow-xs)]" : "text-muted-foreground hover:text-foreground")}>
              <Icone aria-hidden className="h-3.5 w-3.5" />{rotulo}
            </button>
          ))}
        </div>
        <DemoDoGrid tela={tela} />
        <p className="mt-3 text-[0.8125rem] text-muted-foreground">{t(`From ${GRID[tela].aPartir}: ${GRID[tela].colunas} columns, ${GRID[tela].margem} px margin and ${GRID[tela].calha} px gutter.`, `A partir de ${GRID[tela].aPartir}: ${GRID[tela].colunas} colunas, margem de ${GRID[tela].margem} px e calha de ${GRID[tela].calha} px.`)}</p>
      </section>

      <section id="grid-larguras" className="scroll-mt-32">
        <SectionHeader
          title={t("Maximum widths", "Larguras máximas")}
          description={t("On large screens the content stops growing and stays centred. Choose the width by the kind of content.", "Em telas grandes o conteúdo para de crescer e fica centralizado. Escolha a largura pelo tipo de conteúdo.")}
        />
        <div className="space-y-4">
          {[
            { nome: t("Reading", "Leitura"), px: 768, classe: ".ds-container-reading", uso: t("Long texts, articles, forms and step-by-step flows.", "Textos longos, artigos, formulários e fluxos passo a passo.") },
            { nome: t("Default", "Padrão"), px: 1152, classe: ".ds-container", uso: t("Most pages: landing pages, sections with cards, home.", "A maioria das páginas: landing pages, seções com cards, página inicial.") },
            { nome: t("Wide", "Larga"), px: 1280, classe: ".ds-container-wide", uso: t("Panels, dashboards and wide tables.", "Painéis, dashboards e tabelas largas.") },
          ].map(l => (
            <div key={l.px}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[0.875rem] font-semibold text-foreground">{l.nome} · {l.px} px <span className="font-mono text-[0.75rem] font-normal text-muted-foreground">{l.classe}</span></p>
                <p className="text-[0.8125rem] text-muted-foreground">{l.uso}</p>
              </div>
              <div className="h-3 rounded-full bg-muted"><div className="h-3 rounded-full bg-primary/70" style={{ width: `${(l.px / 1280) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section id="grid-ritmo" className="scroll-mt-32">
        <SectionHeader
          title={t("Vertical rhythm", "Ritmo vertical")}
          description={t("Sections of a page are separated by the same space, so the page reads as a sequence. The hero gets more air.", "As seções de uma página ficam separadas pelo mesmo espaço, para a página ser lida em sequência. O hero ganha mais respiro.")}
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-[16px] border border-border bg-card p-4">
            {[
              [t("Hero", "Hero"), "96 px", "--section-space-hero"],
              [t("Section", "Seção"), "64 / 80 px", "--section-space"],
              [t("Section", "Seção"), "64 / 80 px", "--section-space"],
            ].map(([nome, valor, token], i) => (
              <div key={i}>
                {i > 0 && (
                  <div className="flex items-center gap-2 py-2 text-[0.6875rem] font-mono text-[var(--primary-text,var(--primary))]">
                    <span aria-hidden className="h-6 w-px bg-primary" /> {valor} · {token}
                  </div>
                )}
                <div className={cn("flex items-center justify-center rounded-[10px] bg-muted text-[0.75rem] font-semibold text-muted-foreground", i === 0 ? "h-24" : "h-16")}>{nome}</div>
              </div>
            ))}
          </div>
          <DataTable
            head={[t("Space", "Espaço"), t("Value", "Valor"), t("Where", "Onde")]}
            rows={[
              [t("Between sections", "Entre seções"), "64 px / 80 px", t("Phone / desktop", "Celular / desktop")],
              [t("Before and after the hero", "Antes e depois do hero"), "96 px", t("All screens", "Todas as telas")],
              [t("Section heading → content", "Título da seção → conteúdo"), "40 px", "--space-10"],
              [t("Between groups in a section", "Entre grupos da seção"), "32 px", "--space-8"],
            ]}
          />
        </div>
      </section>

      <section id="grid-uso" className="scroll-mt-32">
        <SectionHeader
          title={t("How to use", "Como usar")}
          description={t("Three common layouts on the grid. The span of each block changes with the screen: on the phone everything stacks.", "Três layouts comuns sobre o grid. O span de cada bloco muda com a tela: no celular tudo empilha.")}
        />
        <div className="space-y-8">
          <div>
            <Rotulo>{t("Three cards: full width on phone, two per row on tablet, three on desktop", "Três cards: largura toda no celular, dois por linha no tablet, três no desktop")}</Rotulo>
            <div className="ds-grid rounded-[16px] border border-border bg-muted/40 p-[var(--grid-margin)]">
              {[1, 2, 3].map(i => <Bloco key={i} span="col-span-4 lg:col-span-4" rotulo={`Card ${i}`} />)}
            </div>
          </div>
          <div>
            <Rotulo>{t("Side menu and content: stacks on phone and tablet", "Menu lateral e conteúdo: empilha no celular e no tablet")}</Rotulo>
            <div className="ds-grid rounded-[16px] border border-border bg-muted/40 p-[var(--grid-margin)]">
              <Bloco span="col-span-4 sm:col-span-8 lg:col-span-3" rotulo={t("Menu", "Menu")} />
              <Bloco span="col-span-4 sm:col-span-8 lg:col-span-9" rotulo={t("Content", "Conteúdo")} className="min-h-28" />
            </div>
          </div>
          <div>
            <Rotulo>{t("Text and image: half and half on desktop", "Texto e imagem: meio a meio no desktop")}</Rotulo>
            <div className="ds-grid rounded-[16px] border border-border bg-muted/40 p-[var(--grid-margin)]">
              <Bloco span="col-span-4 sm:col-span-8 lg:col-span-6" rotulo={t("Text", "Texto")} className="min-h-28" />
              <Bloco span="col-span-4 sm:col-span-8 lg:col-span-6" rotulo={t("Image", "Imagem")} className="min-h-28" />
            </div>
          </div>
          <Panel className="p-5">
            <p className="mb-3 text-[0.875rem] font-semibold text-foreground">{t("In the code", "No código")}</p>
            <DataTable
              head={[t("Use", "Use"), t("For", "Para")]}
              rows={[
                [<Mono key="a">.ds-container</Mono>, t("Centre the page at the default width, with the grid margin at the sides (-reading and -wide for the other widths).", "Centralizar a página na largura padrão, com a margem do grid nas laterais (-reading e -wide para as outras larguras).")],
                [<Mono key="b">.ds-grid</Mono>, t("Create the 4/8/12 column grid with the gutter of the screen.", "Criar o grid de 4/8/12 colunas com a calha da tela.")],
                [<Mono key="c">col-span-4 sm:col-span-8 lg:col-span-6</Mono>, t("Say how many columns a block takes on each screen (at most 4 on phone, 8 on tablet, 12 on desktop).", "Dizer quantas colunas o bloco ocupa em cada tela (no máximo 4 no celular, 8 no tablet, 12 no desktop).")],
                [<Mono key="d">.ds-section</Mono>, t("Vertical space between page sections (-hero for the hero).", "Espaço vertical entre seções da página (-hero para o hero).")],
                [<Mono key="e">p-[var(--space-6)]</Mono>, t("Any padding, gap or margin with a step of the scale.", "Qualquer padding, espaço ou margem com um passo da escala.")],
              ]}
            />
          </Panel>
        </div>
      </section>

      <section id="grid-evitar" className="scroll-mt-32">
        <SectionHeader title={t("What to avoid", "O que evitar")} />
        <DoDont
          dos={[
            t("Take every padding, gap and margin from the 4 px scale.", "Tire todo padding, espaço e margem da escala de 4 px."),
            t("Align blocks to whole columns and let the span change with the screen.", "Alinhe os blocos a colunas inteiras e deixe o span mudar com a tela."),
            t("Use the same space between all sections of a page.", "Use o mesmo espaço entre todas as seções de uma página."),
          ]}
          donts={[
            t("Use values outside the scale (13 px, 18 px, 30 px).", "Não use valores fora da escala (13 px, 18 px, 30 px)."),
            t("Let text lines run the full width of a large screen: use the reading width.", "Não deixe linhas de texto ocuparem a largura toda de uma tela grande: use a largura de leitura."),
            t("Use a span larger than the columns of the screen (more than 4 on phone, 8 on tablet).", "Não use span maior que as colunas da tela (mais de 4 no celular, 8 no tablet)."),
            t("Remove the side margin to gain space on the phone.", "Não tire a margem lateral para ganhar espaço no celular."),
          ]}
        />
      </section>

      <section id="grid-tokens" className="scroll-mt-32">
        <SectionHeader title={t("Tokens", "Tokens")} />
        <TokenTable groups={tokenGroups} />
      </section>
    </div>
  );
}
