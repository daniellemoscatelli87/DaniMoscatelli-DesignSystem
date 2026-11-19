import React from "react";
import { ChartColumnBig, ChartLine, ChartPie, ChartScatter, ChartSpline, MapPinned, Check, X, MessageSquareText, ChartColumn } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionHeader } from "./shared/SectionHeader";
import { VejaEm } from "./shared/VejaEm";
import { Callout, DoDont } from "./shared/Guidance";
import {
  DescobertaVisual, GraficoDeRosca, BarrasOrdenadas, MapaDeCalorPorRegiao, GraficoDeHalteres, GraficoDeLinhas,
  GraficoDeInclinacao, Mosaico, BarrasEmpilhadas100, GraficoDeBolhas, MapaDeCalorMatricial, GraficoDeRanking, Funil,
  formatarNumero, type RegiaoDoMapa,
} from "../ui/graficos-inteligencia";

/* Charts and visualizations (19/11/2026). Every number on this page is fictitious example data
   (neutral service examples): none describes real clients, units, regions or contacts. */

type T = (en: string, pt: string) => string;

/** Earlier donut, reproduced only for comparison (thick ring, number of parts in the centre, graphite as a peer series). */
function RoscaAntiga({ t, partes }: { t: T; partes: { rotulo: string; valor: number }[] }) {
  const cores = ["var(--crimson-400)", "var(--graphite-700)", "var(--crimson-200)", "var(--graphite-400)"];
  const total = partes.reduce((s, p) => s + p.valor, 0);
  const r = 42, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg viewBox="0 0 120 120" className="h-36 w-36 shrink-0 -rotate-90" role="img" aria-label={t("Earlier donut, for comparison", "Versão anterior da rosca, para comparação")}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--muted)" strokeWidth="16" />
        {partes.map((p, i) => {
          const tam = (p.valor / total) * c;
          const ini = acc;
          acc += tam;
          return <circle key={p.rotulo} cx="60" cy="60" r={r} fill="none" stroke={cores[i]} strokeWidth="16" strokeDasharray={`${Math.max(0, tam - 2)} ${c}`} strokeDashoffset={-ini} />;
        })}
        <g className="rotate-90" style={{ transformOrigin: "60px 60px" }}>
          <text x="60" y="58" textAnchor="middle" className="fill-foreground text-[22px] font-bold">8</text>
          <text x="60" y="74" textAnchor="middle" className="fill-muted-foreground text-[9px]">{t("channels", "canais")}</text>
        </g>
      </svg>
      <ul className="m-0 min-w-[10rem] flex-1 list-none space-y-2 p-0 text-[0.875rem]">
        {partes.map((p, i) => (
          <li key={p.rotulo} className="flex items-start gap-2.5">
            <span aria-hidden className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: cores[i] }} />
            <span className="min-w-0 flex-1 leading-snug text-foreground">{p.rotulo}</span>
            <span className="shrink-0 font-semibold tabular-nums text-foreground">{Math.round((p.valor / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Tabela que vira lista no celular (card nunca rola na horizontal). */
function TabelaQueQuebra({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="hidden grid-cols-[1.2fr_1fr_1.3fr] gap-4 border-b border-border bg-muted/50 px-4 py-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground md:grid">
        {head.map(h => <span key={h}>{h}</span>)}
      </div>
      <ul className="m-0 list-none p-0">
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-1 gap-1 border-b border-border px-4 py-3 text-[0.8125rem] last:border-0 md:grid-cols-[1.2fr_1fr_1.3fr] md:gap-4">
            {r.map((c, j) => (
              <span key={j} className={j === 0 ? "font-semibold text-foreground" : "text-muted-foreground [overflow-wrap:anywhere]"}>
                <span className="mr-1 font-medium text-foreground md:hidden">{j > 0 ? `${head[j]}:` : ""}</span>{c}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Cartao({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6 ${className}`}>{children}</div>;
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>;
}

export function GraficosShowcase() {
  const { t, lang } = useI18n();
  const loc = lang === "pt" ? "pt-BR" : "en-US";
  const n = (v: number) => formatarNumero(v, 0, loc);
  const d1 = (v: number) => v.toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const pct = (v: number) => `${formatarNumero(v, 0, loc)}%`;
  const ord = (p: number) => (lang === "pt" ? `${p}º` : `${p}${p === 1 ? "st" : p === 2 ? "nd" : p === 3 ? "rd" : "th"}`);
  const min = (v: number) => `${formatarNumero(v, 0, loc)} min`;
  const SELO = t("Example data", "Dados de exemplo");
  const rotulos = { porQue: t("Why it matters", "Por que importa"), acao: t("Next step", "Próximo passo"), verDados: t("See data", "Ver dados"), ocultarDados: t("Hide data", "Ocultar dados") };
  const escala = { menos: t("Less", "Menos"), mais: t("More", "Mais") };

  /* ── Example data ── */
  const CANAIS = [
    { rotulo: "WhatsApp", valor: 31 },
    { rotulo: t("Phone", "Telefone"), valor: 15 },
    { rotulo: "E-mail", valor: 14 },
    { rotulo: t("Other channels (5 channels)", "Outros canais (5 canais)"), valor: 63, neutro: true },
  ];
  const CANAIS_ANTES = CANAIS.map(c => ({ rotulo: c.neutro ? t("Other channels", "Outros canais") : c.rotulo, valor: c.valor }));

  const MOTIVOS = [
    { rotulo: t("Booking", "Agendamento"), valor: 1240 },
    { rotulo: t("Question about deadlines", "Dúvida sobre prazo"), valor: 980 },
    { rotulo: t("Copy of a document", "Segunda via de documento"), valor: 860 },
    { rotulo: t("Rescheduling", "Troca de horário"), valor: 720 },
    { rotulo: t("Price information", "Informação de preço"), valor: 540 },
    { rotulo: t("Complaint", "Reclamação"), valor: 410 },
    { rotulo: t("Compliment", "Elogio"), valor: 350 },
  ];

  const REGIOES: RegiaoDoMapa[] = [
    { id: "no", rotulo: t("Northwest", "Noroeste"), valor: 410, coluna: 1, linha: 1 },
    { id: "n", rotulo: t("North", "Norte"), valor: 620, coluna: 2, linha: 1 },
    { id: "ne", rotulo: t("Northeast", "Nordeste"), valor: 540, coluna: 3, linha: 1 },
    { id: "o", rotulo: t("West", "Oeste"), valor: 380, coluna: 1, linha: 2 },
    { id: "c", rotulo: t("Centre", "Centro"), valor: 890, coluna: 2, linha: 2 },
    { id: "l", rotulo: t("East", "Leste"), valor: 1180, coluna: 3, linha: 2 },
    { id: "so", rotulo: t("Southwest", "Sudoeste"), valor: 260, coluna: 1, linha: 3 },
    { id: "s", rotulo: t("South", "Sul"), valor: 320, coluna: 2, linha: 3 },
    { id: "se", rotulo: t("Southeast", "Sudeste"), valor: 700, coluna: 3, linha: 3 },
  ];

  const EXPECTATIVA = [
    { rotulo: t("Waiting", "Espera"), a: 5.1, b: 8.5 },
    { rotulo: t("Booking", "Agendamento"), a: 6.2, b: 9.1 },
    { rotulo: t("Follow-up", "Retorno"), a: 4.9, b: 7.2 },
    { rotulo: t("Service", "Atendimento"), a: 8.8, b: 9.4 },
    { rotulo: t("Reception", "Recepção"), a: 8.4, b: 7.8 },
  ];

  const SEMANAS = Array.from({ length: 8 }, (_, i) => t(`Wk ${i + 1}`, `Sem. ${i + 1}`));
  const TENDENCIA = [
    { rotulo: "WhatsApp", valores: [120, 135, 150, 170, 190, 215, 240, 262], destaque: true },
    { rotulo: t("Phone", "Telefone"), valores: [300, 310, 295, 305, 298, 312, 300, 306] },
    { rotulo: t("In person", "Presencial"), valores: [260, 250, 255, 240, 236, 230, 228, 224] },
  ];

  const ETAPAS_ANTES_DEPOIS = [
    { rotulo: t("Reception", "Recepção"), inicio: 6.1, fim: 8.4 },
    { rotulo: t("Waiting", "Espera"), inicio: 4.8, fim: 6.9 },
    { rotulo: t("Booking", "Agendamento"), inicio: 7.0, fim: 7.3 },
    { rotulo: t("Service", "Atendimento"), inicio: 8.6, fim: 8.9 },
    { rotulo: t("Payment", "Pagamento"), inicio: 7.8, fim: 7.6 },
    { rotulo: t("Follow-up", "Retorno"), inicio: 6.5, fim: 5.9 },
  ];

  const DEMANDAS = [
    { rotulo: t("Booking", "Agendamento"), valor: 28 },
    { rotulo: t("Questions", "Dúvidas"), valor: 22 },
    { rotulo: t("Documents", "Documentos"), valor: 14 },
    { rotulo: t("Payments", "Pagamentos"), valor: 12 },
    { rotulo: t("Complaints", "Reclamações"), valor: 9 },
    { rotulo: t("Suggestions", "Sugestões"), valor: 8 },
    { rotulo: t("Other", "Outras"), valor: 7, neutro: true },
  ];

  const POR_UNIDADE = {
    categorias: [{ rotulo: "WhatsApp" }, { rotulo: t("Phone", "Telefone") }, { rotulo: t("In person", "Presencial") }, { rotulo: t("Other", "Outros"), neutro: true }],
    linhas: [
      { rotulo: t("Unit A", "Unidade A"), valores: [34, 20, 16, 30] },
      { rotulo: t("Unit B", "Unidade B"), valores: [24, 36, 14, 26] },
      { rotulo: t("Unit C", "Unidade C"), valores: [30, 22, 18, 30] },
    ],
  };

  const BOLHAS = [
    { rotulo: t("Document copy", "Segunda via"), x: 38, y: 180, tamanho: 24, destaque: true },
    { rotulo: t("Booking", "Agendamento"), x: 12, y: 240, tamanho: 8 },
    { rotulo: t("Deadlines", "Dúvida de prazo"), x: 16, y: 205, tamanho: 12 },
    { rotulo: t("Rescheduling", "Troca de horário"), x: 9, y: 140, tamanho: 5 },
    { rotulo: t("Registration", "Cadastro"), x: 24, y: 105, tamanho: 6 },
    { rotulo: t("Refund", "Reembolso"), x: 46, y: 60, tamanho: 18 },
  ];

  const MATRIZ = {
    linhas: [t("Morning", "Manhã"), t("Afternoon", "Tarde"), t("Evening", "Noite")],
    colunas: [t("Mon", "Seg"), t("Tue", "Ter"), t("Wed", "Qua"), t("Thu", "Qui"), t("Fri", "Sex")],
    valores: [
      [380, 260, 240, 250, 220],
      [240, 230, 210, 220, 260],
      [90, 110, 100, 120, 150],
    ],
  };

  const MESES = [t("Jan", "Jan"), t("Feb", "Fev"), t("Mar", "Mar"), t("Apr", "Abr"), t("May", "Mai"), t("Jun", "Jun")];
  const RANKING = [
    { rotulo: t("Rescheduling", "Troca de horário"), posicoes: [5, 4, 4, 3, 2, 1], destaque: true },
    { rotulo: t("Deadlines", "Dúvida de prazo"), posicoes: [2, 2, 1, 1, 1, 2] },
    { rotulo: t("Booking", "Agendamento"), posicoes: [1, 1, 2, 2, 3, 3] },
    { rotulo: t("Document copy", "Segunda via"), posicoes: [3, 3, 3, 4, 4, 4] },
    { rotulo: t("Price", "Preço"), posicoes: [4, 5, 5, 5, 5, 5] },
  ];

  const JORNADA = [
    { rotulo: t("Opened the booking page", "Abriram a página de agendamento"), valor: 5200 },
    { rotulo: t("Chose a service", "Escolheram um serviço"), valor: 4300 },
    { rotulo: t("Chose a time", "Escolheram um horário"), valor: 1700 },
    { rotulo: t("Confirmed", "Confirmaram"), valor: 1300 },
    { rotulo: t("Showed up", "Compareceram"), valor: 1150 },
  ];

  const FAMILIAS = [
    { icone: ChartColumnBig, nome: t("Comparison", "Comparação"), quando: t("Compare values across items: what is bigger, what changed places, how far apart two measures are.", "Comparar valores entre itens: o que é maior, o que mudou de lugar, qual a distância entre duas medidas."), tipos: [t("Vertical and horizontal bars", "Barras verticais e horizontais"), t("Grouped", "Agrupadas"), t("Stacked and 100%", "Empilhadas e 100%"), "Lollipop", "Dumbbell", "Slope"], ds: "BarrasOrdenadas, GraficoDeHalteres, GraficoDeInclinacao, BarrasEmpilhadas100" },
    { icone: ChartLine, nome: t("Time", "Tempo"), quando: t("Show how something evolves: trend, seasonality, before and after.", "Mostrar como algo evolui: tendência, sazonalidade, antes e depois."), tipos: [t("Lines", "Linhas"), t("Multiple lines", "Múltiplas linhas"), t("Area and stacked area", "Área e área empilhada"), "Streamgraph", "Timeline", t("Calendar heat map", "Calendário de calor"), "Candlestick"], ds: "GraficoDeLinhas, GraficoDeRanking" },
    { icone: ChartPie, nome: t("Composition", "Composição"), quando: t("Show the parts of a whole: share, shrinking stages, what each part contributes.", "Mostrar as partes de um todo: participação, etapas que se reduzem, contribuição de cada parte."), tipos: [t("Pie and donut", "Pizza e rosca"), "Treemap", "Sunburst", "Waffle", t("Funnel", "Funil"), t("Pyramid", "Pirâmide"), "Waterfall"], ds: "GraficoDeRosca, Mosaico, BarrasEmpilhadas100, Funil" },
    { icone: ChartScatter, nome: t("Relationships", "Relações"), quando: t("See how two or more measures move together, or how things connect.", "Ver como duas ou mais medidas andam juntas, ou como as coisas se conectam."), tipos: [t("Scatter", "Dispersão"), t("Bubbles", "Bolhas"), t("Heat map", "Mapa de calor"), t("Correlation matrix", "Matriz de correlação"), "Radar", t("Parallel coordinates", "Coordenadas paralelas"), "Sankey", t("Network", "Rede")], ds: "GraficoDeBolhas, MapaDeCalorMatricial" },
    { icone: ChartSpline, nome: t("Distribution", "Distribuição"), quando: t("See how values spread: where they cluster, what stands out from the pattern.", "Ver como os valores se espalham: onde se concentram, o que foge do padrão."), tipos: [t("Histogram", "Histograma"), "Box plot", t("Violin", "Violino"), t("Density", "Densidade")], ds: t("No component yet: use bars for value ranges", "Ainda sem componente: use barras para faixas de valor") },
    { icone: MapPinned, nome: t("Geography", "Geografia"), quando: t("When place is part of the answer: where demand is higher, where service is thinner.", "Quando o lugar faz parte da resposta: onde há mais procura, onde o atendimento é menor."), tipos: [t("Choropleth", "Coroplético"), t("Points", "Pontos"), t("Bubbles on a map", "Bolhas no mapa"), t("Geographic heat", "Calor geográfico")], ds: t("MapaDeCalorPorRegiao (schematic)", "MapaDeCalorPorRegiao (esquemático)") },
  ];

  const RECOMENDACOES: React.ReactNode[][] = [
    [t("What do people ask for most?", "O que as pessoas mais pedem?"), t("Ranked horizontal bars", "Barras horizontais ordenadas"), "BarrasOrdenadas"],
    [t("Where is demand concentrated?", "Onde a procura se concentra?"), t("Geographic heat map", "Mapa de calor geográfico"), "MapaDeCalorPorRegiao"],
    [t("Does the experience match expectations?", "A experiência acompanha a expectativa?"), "Dumbbell", "GraficoDeHalteres"],
    [t("How does it evolve over time?", "Como evolui no tempo?"), t("Lines or area", "Linhas ou área"), "GraficoDeLinhas"],
    [t("What changed after an improvement?", "O que mudou depois de uma melhoria?"), "Slope", "GraficoDeInclinacao"],
    [t("What is the share of each type?", "Qual a participação de cada tipo?"), t("Treemap or 100% bars", "Treemap ou barras 100%"), "Mosaico, BarrasEmpilhadas100"],
    [t("How do effort, volume and complaints relate?", "Como esforço, volume e reclamações se relacionam?"), t("Bubbles", "Bolhas"), "GraficoDeBolhas"],
    [t("How do days and periods compare?", "Como dias e períodos se comparam?"), t("Matrix heat map", "Mapa de calor em matriz"), "MapaDeCalorMatricial"],
    [t("What moved up or down?", "O que subiu ou caiu de posição?"), "Bump chart", "GraficoDeRanking"],
    [t("Where does the journey lose people?", "Onde a jornada perde gente?"), t("Funnel", "Funil"), "Funil"],
  ];

  const PASSOS_CATALOGO = [
    { t: t("Identify the question", "Identifique a pergunta"), d: t("What does the person need to know to decide?", "O que a pessoa precisa saber para decidir?") },
    { t: t("Choose the visual family", "Escolha a família visual"), d: t("Comparison, time, composition, relationship, distribution or geography.", "Comparação, tempo, composição, relação, distribuição ou geografia.") },
    { t: t("Favour a fast read", "Priorize a leitura rápida"), d: t("The discovery must show up in a few seconds.", "A descoberta precisa aparecer em poucos segundos.") },
    { t: t("Detail only when it helps", "Detalhe só quando ajuda"), d: t("Exact numbers and method go to \"See data\".", "Números exatos e método ficam em \"Ver dados\".") },
  ];

  const PASSOS_INTELIGENCIA = [
    { n: "01", t: t("Conclusion in natural language", "Conclusão em linguagem natural"), d: t("Start with what was discovered, in clear terms. The title states the finding; the chart is there to show it.", "Comece pelo que foi descoberto, em termos claros. O título diz a descoberta; o gráfico vem para mostrar.") },
    { n: "02", t: t("The right visualization", "Visualização adequada"), d: t("Map, trend, comparison or distribution, depending on the question. One chart per idea.", "Mapa, tendência, comparação ou distribuição, conforme a pergunta. Um gráfico por ideia.") },
    { n: "03", t: t("Why the opportunity matters", "Explicação da oportunidade"), d: t("Why it matters to the person who decides, with context: compared with what, in which period.", "Por que isso importa para quem decide, com o contexto: comparado com o quê e em qual período.") },
    { n: "04", t: t("Recommended action", "Ação recomendada"), d: t("A concrete next step within the person's reach, without promising results.", "Um próximo passo concreto, ao alcance da pessoa, sem prometer resultado.") },
  ];

  const TOKENS_COR = [
    { token: "--chart-1", passo: "crimson-500", uso: t("Highlight: the main series (one step darker than the primary: 6.2:1 on white)", "Destaque: a série principal (um tom abaixo da primária: 6,2:1 sobre branco)") },
    { token: "--chart-2", passo: "crimson-700", uso: t("Second series; top of the heat scale", "Segunda série; topo da escala de calor") },
    { token: "--chart-3", passo: "crimson-400", uso: t("Third series (the primary; no text on it)", "Terceira série (a primária; sem texto por cima)") },
    { token: "--chart-4", passo: "crimson-300", uso: t("Fourth series; items outside the highlight", "Quarta série; itens fora do destaque") },
    { token: "--chart-5", passo: "crimson-200", uso: t("Fifth series; start of the heat scale", "Quinta série; começo da escala de calor") },
    { token: "--chart-neutral", passo: "graphite-200", uso: t("Not highlighted: \"Other\", context, disabled", "Sem destaque: \"Outros\", contexto, desativado") },
    { token: "--chart-grid", passo: "graphite-100", uso: t("Grid lines", "Linhas de grade") },
  ];

  const tabela = (colunas: string[], linhas: (string | number)[][]) => ({ colunas, linhas });

  return (
    <div className="space-y-16 pb-16">
      {/* ── CHOOSING ── */}
      <section id="graficos-escolher" className="scroll-mt-32">
        <SectionHeader
          title={t("Charts and visualizations", "Gráficos e visualizações")}
          description={t(
            "Charts that show discoveries, not just numbers. Start from the question, choose the visual family and make the discovery readable in a few seconds. Every example on this page uses fictitious example data.",
            "Gráficos para mostrar descobertas, não só números. Comece pela pergunta, escolha a família visual e deixe a descoberta legível em poucos segundos. Todos os exemplos desta página usam dados de exemplo, fictícios.",
          )}
        />
        <ol className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS_CATALOGO.map((p, i) => (
            <li key={p.t} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] text-[0.75rem] font-bold text-[var(--primary-text)]">{i + 1}</span>
              <div>
                <p className="text-[0.875rem] font-semibold text-foreground">{p.t}</p>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {FAMILIAS.map(f => (
            <Cartao key={f.nome}>
              <div className="mb-3 flex items-center gap-3">
                <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--primary-muted)] text-[var(--primary-text)]"><f.icone className="h-[18px] w-[18px]" /></span>
                <h3 className="text-[1rem] font-bold text-foreground">{f.nome}</h3>
              </div>
              <p className="text-[0.875rem] leading-relaxed text-foreground">{f.quando}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {f.tipos.map(tp => <li key={tp} className="rounded-sm border border-border px-2 py-0.5 text-[0.75rem] text-muted-foreground">{tp}</li>)}
              </ul>
              <p className="mt-3 text-[0.75rem] text-muted-foreground"><span className="font-semibold text-foreground">{t("In the DS:", "No DS:")}</span> {f.ds}</p>
            </Cartao>
          ))}
        </div>
        <div className="mt-8">
          <Rotulo>{t("Recommended charts", "Gráficos recomendados")}</Rotulo>
          <TabelaQueQuebra head={[t("Question", "Pergunta"), t("Chart", "Gráfico"), t("Component", "Componente")]} rows={RECOMENDACOES} />
        </div>
      </section>

      {/* ── COLORS ── */}
      <section id="graficos-cores" className="scroll-mt-32">
        <SectionHeader
          title={t("Chart colors", "Cores dos gráficos")}
          description={t(
            "Charts use only the primary color and its tonal variations. Graphite appears only on what is not highlighted (Other, context, baseline, disabled), never as a peer series of the primary. Product owner's decision, 19/11/2026.",
            "Gráficos usam só a cor primária e variações tonais dela. O grafite aparece apenas no que não está em destaque (Outros, contexto, linha de base, desativado), nunca como série par da primária. Decisão da dona do produto, 19/11/2026.",
          )}
        />
        <Cartao>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {TOKENS_COR.map(c => (
              <li key={c.token} className="min-w-0">
                <span aria-hidden className="mb-2 block h-14 rounded-md border border-border" style={{ background: `var(${c.token})` }} />
                <p className="font-mono text-[0.75rem] font-semibold text-foreground [overflow-wrap:anywhere]">{c.token}</p>
                <p className="text-[0.75rem] text-muted-foreground">{c.passo}</p>
                <p className="mt-1 text-[0.75rem] leading-snug text-muted-foreground">{c.uso}</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-border pt-5">
            <Rotulo>{t("Heat scale (lowest to highest)", "Escala de calor (do menor para o maior)")}</Rotulo>
            <div className="flex gap-1">
              {[["--chart-seq-1", "var(--chart-seq-1-texto)"], ["--chart-seq-2", "var(--chart-seq-2-texto)"], ["--chart-seq-3", "var(--chart-seq-3-texto)"], ["--chart-seq-4", "var(--chart-seq-4-texto)"]].map(([tk, tx]) => (
                <span key={tk} className="flex h-10 flex-1 items-center justify-center rounded-sm text-[0.75rem] font-semibold" style={{ background: `var(${tk})`, color: tx }}>{tk}</span>
              ))}
            </div>
            <p className="mt-2 text-[0.75rem] text-muted-foreground">{t(
              "Dark text on the two light tones and light text on the two dark ones: all above 4.5:1. chart-3 stays out of the heat scale because no text color reaches 4.5:1 on it.",
              "Texto escuro nos dois tons claros e texto claro nos dois escuros: todos passam de 4,5:1. O chart-3 fica fora da escala de calor porque nenhuma cor de texto atinge 4,5:1 sobre ele.",
            )}</p>
          </div>
        </Cartao>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Cartao>
            <p className="mb-3 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-foreground"><Check aria-hidden className="h-4 w-4 text-success" />{t("Like this: tones of the primary, Other in graphite", "Assim: tons da primária, Outros em grafite")}</p>
            <BarrasEmpilhadas100 localidade={loc} rotulo={t("Correct example", "Exemplo correto")} categorias={POR_UNIDADE.categorias} linhas={[{ rotulo: t("Contacts", "Atendimentos"), valores: [34, 26, 16, 24] }]} />
          </Cartao>
          <Cartao>
            <p className="mb-3 flex items-center gap-1.5 text-[0.8125rem] font-semibold text-foreground"><X aria-hidden className="h-4 w-4 text-error" />{t("Not like this: graphite as a peer series of the primary", "Não assim: grafite como série par da primária")}</p>
            <div aria-hidden className="flex h-3 gap-[2px] overflow-hidden rounded-sm">
              <span style={{ flex: "34 1 0", background: "var(--crimson-400)" }} />
              <span style={{ flex: "26 1 0", background: "var(--graphite-700)" }} />
              <span style={{ flex: "16 1 0", background: "var(--graphite-400)" }} />
              <span style={{ flex: "24 1 0", background: "var(--graphite-200)" }} />
            </div>
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">{t(
              "With graphite next to the primary, the chart suggests only the red part matters and the gray looks disabled. Without labels, color carries the meaning alone.",
              "Com grafite ao lado da primária, a leitura sugere que só o vermelho importa e o cinza parece desativado. Sem rótulos, a cor carrega o significado sozinha.",
            )}</p>
          </Cartao>
        </div>
        <div className="mt-4">
          <DoDont
            dos={[
              t("Highlight in --chart-1; other series in --chart-2 to --chart-5.", "Destaque na --chart-1; outras séries em --chart-2 a --chart-5."),
              t("Write values and names next to the marks; the legend is only support.", "Escreva valores e nomes junto das marcas; a legenda é só apoio."),
              t("Text on a color only on tones above 4.5:1 (the heat scale and the treemap already do this).", "Texto sobre uma cor só nos tons que passam de 4,5:1 (escala de calor e mosaico já fazem isso)."),
              t("Graphite (--chart-neutral) for Other, context and baseline.", "Grafite (--chart-neutral) para Outros, contexto e linha de base."),
            ]}
            donts={[
              t("Use graphite and the primary as two series of equal weight.", "Usar grafite e primária como duas séries de mesmo peso."),
              t("Create colors outside the scale (green, blue, orange) to separate series.", "Criar cores fora da escala (verde, azul, laranja) para separar séries."),
              t("Rely on the legend alone to say what each color is.", "Depender só da legenda para dizer o que é cada cor."),
              t("Write small text on chart-3 or on a dark --chart-neutral.", "Escrever texto pequeno sobre o chart-3 ou sobre o --chart-neutral escuro."),
            ]}
          />
        </div>
      </section>

      {/* ── DONUT ── */}
      <section id="graficos-rosca" className="scroll-mt-32">
        <SectionHeader
          title={t("Donut chart", "Rosca")}
          description={t(
            "The donut stays, redrawn in the DS stroke: thin ring, parts in tones of the primary from largest to smallest, Other in graphite at the end, the percentage written next to each part and the total in the centre (example data).",
            "A rosca continua, redesenhada no traço do DS: anel fino, partes em tons da primária da maior para a menor, Outros em grafite no fim, percentual escrito junto de cada parte e o total no centro (dados de exemplo).",
          )}
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Cartao>
            <Rotulo>{t("Before", "Antes")}</Rotulo>
            <h3 className="mb-4 text-[0.9375rem] font-bold text-foreground">{t("Contacts by channel", "Atendimentos por canal")}</h3>
            <RoscaAntiga t={t} partes={CANAIS_ANTES} />
            <p className="mt-3 text-[0.75rem] text-muted-foreground">{t("123 contacts in the month (example data).", "123 atendimentos no mês (dados de exemplo).")}</p>
            <ul className="mt-5 space-y-1.5 border-t border-border pt-4 text-[0.8125rem] text-muted-foreground">
              {[
                t("Thick ring with a gray track behind it: it weighs more than the information.", "Anel grosso, com trilho cinza por trás: pesa mais que a informação."),
                t("The centre shows 8 channels, but the legend has 4 rows: the number does not explain itself.", "O centro mostra 8 canais, mas a legenda tem 4 linhas: o número não se explica."),
                t("Dark graphite as a peer series of the red: Phone looks disabled.", "Grafite escuro como série par do vermelho: o Telefone parece desativado."),
                t("Other (51%) has the same visual weight as the highlighted parts.", "Outros (51%) tem a mesma força visual das partes em destaque."),
                t("Percentages only in the legend, far from the parts.", "Percentuais só na legenda, longe das partes."),
              ].map(p => <li key={p} className="flex gap-2"><X aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-error" />{p}</li>)}
            </ul>
          </Cartao>
          <Cartao>
            <Rotulo>{t("After", "Depois")}</Rotulo>
            <h3 className="text-[0.9375rem] font-bold text-foreground">{t("WhatsApp is the channel people use most", "WhatsApp é o canal mais usado pelas pessoas")}</h3>
            <p className="mb-4 mt-1 text-[0.8125rem] text-muted-foreground">{t("A quarter of the contacts; the other 5 channels add up to half.", "Um quarto dos atendimentos; os outros 5 canais somam metade.")}</p>
            <GraficoDeRosca
              localidade={loc}
              rotulo={t("Contacts by channel (example data)", "Atendimentos por canal (dados de exemplo)")}
              partes={CANAIS}
              centro={{ valor: "123", rotulo: t("contacts", "atendimentos") }}
              formatarQuantidade={v => n(v)}
            />
            <ul className="mt-5 space-y-1.5 border-t border-border pt-4 text-[0.8125rem] text-muted-foreground">
              {[
                t("Thin ring (10 px), no track, 2 px of breathing room between parts.", "Anel fino (10 px), sem trilho, com 2 px de respiro entre as partes."),
                t("The centre shows the total (a quantity); hovering the list shows the part.", "Centro com o total (quantidade); ao passar o cursor na lista, mostra a parte."),
                t("Tones of the primary from largest to smallest; Other in graphite, last.", "Tons da primária da maior para a menor; Outros em grafite e por último."),
                t("Percentage written next to each part; the list has quantity and percentage.", "Percentual escrito junto de cada parte; a lista traz quantidade e percentual."),
                t("The title states the discovery, in natural language.", "Título diz a descoberta, em linguagem natural."),
              ].map(p => <li key={p} className="flex gap-2"><Check aria-hidden className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />{p}</li>)}
            </ul>
          </Cartao>
        </div>
        <div className="mt-4">
          <Callout title={t("When to use the donut", "Quando usar a rosca")}>
            <p>{t(
              "To show the share of a few parts (up to 5) in a whole, when one of them is the discovery. To compare many parts or several groups, prefer 100% bars or the treemap. Proportion is not quantity: say share or part.",
              "Para mostrar a participação de poucas partes (até 5) num todo, quando uma delas é a descoberta. Para comparar muitas partes ou vários grupos, prefira barras 100% ou o mosaico. Proporção não é quantidade: diga fatia, parte ou participação.",
            )}</p>
          </Callout>
        </div>
      </section>

      {/* ── 10 RECOMMENDED ── */}
      <section id="graficos-recomendados" className="scroll-mt-32">
        <SectionHeader
          title={t("Recommended charts", "Gráficos recomendados")}
          description={t(
            "Ten charts for experience intelligence, each inside the discovery card: conclusion, chart, why it matters and next step. Texts, units, regions and numbers are example data.",
            "Dez gráficos para a inteligência de experiência, cada um dentro do card de descoberta: conclusão, gráfico, por que importa e próximo passo. Textos, unidades, regiões e números são dados de exemplo.",
          )}
        />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div id="graficos-barras" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Reasons for contact", "Motivos de contato")} selo={SELO}
              conclusao={t("Booking is the most common reason for contact", "Agendamento é o motivo de contato mais comum")}
              contexto={t("Contacts by reason in the last 4 weeks, all channels.", "Atendimentos por motivo nas últimas 4 semanas, em todos os canais.")}
              porQueImporta={t("The top three add up to almost half of the list: they shape most of the team's day.", "Os três primeiros somam quase metade da lista: são eles que ocupam boa parte do dia da equipe.")}
              acao={t("Check whether these three can be solved without waiting for a person.", "Veja se esses três motivos podem ser resolvidos sem esperar uma pessoa.")}
              dados={tabela([t("Reason", "Motivo"), t("Contacts", "Atendimentos")], MOTIVOS.map(b => [b.rotulo, n(b.valor)]))}
            >
              <BarrasOrdenadas rotulo={t("Contacts by reason (example data)", "Atendimentos por motivo (dados de exemplo)")} itens={MOTIVOS} destaques={3} formatar={n} />
            </DescobertaVisual>
          </div>

          <div id="graficos-mapa" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Where demand is", "Onde está a procura")} selo={SELO}
              conclusao={t("The East region concentrates more contacts", "A região Leste concentra mais atendimentos")}
              contexto={t("Contacts in the last 4 weeks, by region of the city.", "Atendimentos nas últimas 4 semanas, por região da cidade.")}
              porQueImporta={t("Knowing where demand concentrates helps decide where to reinforce the service.", "Saber onde a procura se concentra ajuda a decidir onde reforçar o atendimento.")}
              acao={t("Compare the East region's demand with the team available there.", "Compare a procura da região Leste com a equipe disponível nela.")}
              dados={tabela([t("Region", "Região"), t("Contacts", "Atendimentos")], [...REGIOES].sort((a, b) => b.valor - a.valor).map(r => [r.rotulo, n(r.valor)]))}
            >
              <MapaDeCalorPorRegiao rotulo={t("Contacts by region (example data)", "Atendimentos por região (dados de exemplo)")} regioes={REGIOES} colunas={3} linhas={3} destaque="l" formatar={n}
                rotulos={{ ...escala, nota: t("Schematic map: each block is a region, in an approximate position, not to scale.", "Mapa esquemático: cada bloco é uma região, em posição aproximada, sem escala.") }} />
            </DescobertaVisual>
          </div>

          <div id="graficos-halteres" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Expectation and experience", "Expectativa e experiência")} selo={SELO}
              conclusao={t("Waiting has the widest gap between importance and satisfaction", "A espera tem a maior distância entre importância e satisfação")}
              contexto={t("Average score from 0 to 10 for each stage, last quarter.", "Nota média de 0 a 10 para cada etapa, último trimestre.")}
              porQueImporta={t("The bigger the gap, the more people feel the stage falls short of what matters to them.", "Quanto maior a distância, mais as pessoas sentem que a etapa fica aquém do que importa para elas.")}
              acao={t("Start by observing the waiting stage before choosing a solution.", "Comece observando a etapa de espera antes de escolher uma solução.")}
              dados={tabela([t("Stage", "Etapa"), t("Satisfaction", "Satisfação"), t("Importance", "Importância")], EXPECTATIVA.map(o => [o.rotulo, d1(o.a), d1(o.b)]))}
            >
              <GraficoDeHalteres rotulo={t("Satisfaction and importance by stage (example data)", "Satisfação e importância por etapa (dados de exemplo)")} itens={EXPECTATIVA} maximo={10}
                series={[t("Satisfaction", "Satisfação"), t("Importance", "Importância")]} formatar={d1}
                formatarDiferenca={d => (d > 0 ? t(`gap of ${d1(d)}`, `distância de ${d1(d)}`) : t("above expectation", "acima da expectativa"))} />
            </DescobertaVisual>
          </div>

          <div id="graficos-linhas" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Trends", "Tendências")} selo={SELO}
              conclusao={t("WhatsApp contacts have grown for seven weeks", "Os atendimentos por WhatsApp crescem há sete semanas")}
              contexto={t("Contacts per week in the last 8 weeks, compared with phone and in person.", "Atendimentos por semana nas últimas 8 semanas, em comparação com telefone e presencial.")}
              porQueImporta={t("A steady rise is more reliable than a one-week peak.", "Uma subida contínua é mais confiável que um pico de uma semana só.")}
              acao={t("Follow it for two more weeks before moving people between channels.", "Acompanhe por mais duas semanas antes de mudar pessoas de canal.")}
              dados={tabela([t("Week", "Semana"), ...TENDENCIA.map(s => s.rotulo)], SEMANAS.map((s, i) => [s, ...TENDENCIA.map(x => n(x.valores[i]!))]))}
            >
              <GraficoDeLinhas rotulo={t("Contacts per week (example data)", "Atendimentos por semana (dados de exemplo)")} series={TENDENCIA} rotulosX={SEMANAS} area formatar={n} />
            </DescobertaVisual>
          </div>

          <div id="graficos-inclinacao" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Before and after", "Antes e depois")} selo={SELO}
              conclusao={t("Reception and waiting improved the most after the change", "Recepção e espera foram as etapas que mais melhoraram")}
              contexto={t("Average satisfaction score (0 to 10) per stage, before and after the new reception.", "Nota média de satisfação (0 a 10) por etapa, antes e depois da nova recepção.")}
              porQueImporta={t("Follow-up got worse in the same period: improving one stage does not guarantee the others improve.", "O retorno piorou no mesmo período: melhorar uma etapa não garante que as outras melhorem.")}
              acao={t("Look at follow-up next, with the same method used at reception.", "Olhe para o retorno em seguida, com o mesmo método usado na recepção.")}
              dados={tabela([t("Stage", "Etapa"), t("Before", "Antes"), t("After", "Depois")], ETAPAS_ANTES_DEPOIS.map(e => [e.rotulo, d1(e.inicio), d1(e.fim)]))}
            >
              <GraficoDeInclinacao rotulo={t("Satisfaction by stage, before and after (example data)", "Satisfação por etapa, antes e depois (dados de exemplo)")} itens={ETAPAS_ANTES_DEPOIS}
                periodos={[t("Before", "Antes"), t("After", "Depois")]} destaques={[t("Reception", "Recepção"), t("Waiting", "Espera")]} formatar={d1} />
            </DescobertaVisual>
          </div>

          <div id="graficos-participacao" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Share", "Participação")} selo={SELO}
              conclusao={t("Booking and questions are half of all requests", "Agendamento e dúvidas são metade das demandas")}
              contexto={t("Share of each type of request in the total, last 4 weeks.", "Fatia de cada tipo de demanda no total, últimas 4 semanas.")}
              porQueImporta={t("It shows where the bulk of the demand is; small types do not disappear, they show up as smaller blocks.", "Mostra onde está o grosso da procura; tipos pequenos não somem, aparecem em blocos menores.")}
              acao={t("Use this split to check whether the team's time follows the demand.", "Use essa divisão para conferir se o tempo da equipe acompanha a procura.")}
              dados={tabela([t("Type", "Tipo"), t("Share", "Fatia")], DEMANDAS.map(c => [c.rotulo, pct(c.valor)]))}
            >
              <Mosaico localidade={loc} rotulo={t("Share of request types (example data)", "Fatia dos tipos de demanda (dados de exemplo)")} itens={DEMANDAS} altura={240} />
            </DescobertaVisual>
          </div>

          <div className="min-w-0">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Share by unit", "Participação por unidade")} selo={SELO}
              conclusao={t("At Unit B, phone has a bigger share than at the other units", "Na Unidade B, o telefone tem uma fatia maior que nas outras")}
              contexto={t("Share of each channel in the contacts of each unit, last 4 weeks.", "Fatia de cada canal nos atendimentos de cada unidade, últimas 4 semanas.")}
              porQueImporta={t("100% bars compare proportions between groups with different totals.", "Barras 100% comparam proporções entre grupos com totais diferentes.")}
              acao={t("Ask the Unit B team why people prefer to call there.", "Pergunte à equipe da Unidade B por que as pessoas preferem ligar ali.")}
              dados={tabela([t("Unit", "Unidade"), ...POR_UNIDADE.categorias.map(c => c.rotulo)], POR_UNIDADE.linhas.map(l => [l.rotulo, ...l.valores.map(pct)]))}
            >
              <BarrasEmpilhadas100 localidade={loc} rotulo={t("Share of channels by unit (example data)", "Fatia dos canais por unidade (dados de exemplo)")} categorias={POR_UNIDADE.categorias} linhas={POR_UNIDADE.linhas} />
            </DescobertaVisual>
          </div>

          <div id="graficos-bolhas" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Effort, volume and complaints", "Esforço, volume e reclamações")} selo={SELO}
              conclusao={t("Document copies are frequent, slow and generate complaints", "Segunda via é frequente, demorada e gera reclamações")}
              contexto={t("Average resolution time, contacts per week and complaints for each reason.", "Tempo médio de resolução, atendimentos por semana e reclamações de cada motivo.")}
              porQueImporta={t("A reason that is frequent and slow at the same time takes up a large part of the team. It is not, by itself, the cause of the complaints.", "Um motivo frequente e demorado ao mesmo tempo ocupa boa parte da equipe. Isso não indica, sozinho, a causa das reclamações.")}
              acao={t("Map the document-copy journey step by step with the people who do it.", "Mapeie a jornada da segunda via passo a passo com quem faz o atendimento.")}
              dados={tabela([t("Reason", "Motivo"), t("Time", "Tempo"), t("Contacts/week", "Atendimentos/semana"), t("Complaints", "Reclamações")], BOLHAS.map(b => [b.rotulo, min(b.x), n(b.y), n(b.tamanho)]))}
            >
              <GraficoDeBolhas rotulo={t("Effort, volume and complaints (example data)", "Esforço, volume e reclamações (dados de exemplo)")} itens={BOLHAS}
                eixoX={{ rotulo: t("Resolution time", "Tempo de resolução"), formatar: min }} eixoY={{ rotulo: t("Contacts per week", "Atendimentos por semana"), formatar: n }}
                rotuloTamanho={t("Circle size: complaints", "Tamanho do círculo: reclamações")} formatarTamanho={n} />
            </DescobertaVisual>
          </div>

          <div id="graficos-matriz" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Days and periods", "Dias e períodos")} selo={SELO}
              conclusao={t("Monday morning concentrates the most contacts", "Segunda de manhã concentra mais atendimentos")}
              contexto={t("Average contacts per day and period, last 8 weeks.", "Média de atendimentos por dia e período, últimas 8 semanas.")}
              porQueImporta={t("Evenings are the calmest period on every day; Monday morning is the busiest.", "A noite é o período mais calmo em todos os dias; segunda de manhã é o mais cheio.")}
              acao={t("Check whether the Monday morning schedule has enough people.", "Confira se a escala de segunda de manhã tem gente suficiente.")}
              dados={tabela([t("Period", "Período"), ...MATRIZ.colunas], MATRIZ.linhas.map((l, i) => [l, ...MATRIZ.valores[i]!.map(n)]))}
            >
              <MapaDeCalorMatricial rotulo={t("Contacts by day and period (example data)", "Atendimentos por dia e período (dados de exemplo)")} {...MATRIZ} formatar={n}
                rotuloLinhas={t("Period", "Período")} destaque={[0, 0]} rotulos={escala} />
            </DescobertaVisual>
          </div>

          <div id="graficos-ranking" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("Changes in position", "Mudanças de posição")} selo={SELO}
              conclusao={t("Rescheduling rose from 5th to 1st among contact reasons", "Troca de horário subiu do 5º para o 1º lugar entre os motivos")}
              contexto={t("Position of each reason, month by month, in the last 6 months.", "Posição de cada motivo de contato, mês a mês, nos últimos 6 meses.")}
              porQueImporta={t("Position shows what became more frequent, even when the total number of contacts changes.", "A posição mostra o que passou a ser mais frequente, mesmo quando o total de atendimentos muda.")}
              acao={t("Talk to the people who rescheduled to understand what changed for them.", "Converse com quem trocou de horário para entender o que mudou para essas pessoas.")}
              dados={tabela([t("Reason", "Motivo"), MESES[0]!, MESES[5]!], RANKING.map(r => [r.rotulo, ord(r.posicoes[0]!), ord(r.posicoes[5]!)]))}
            >
              <GraficoDeRanking rotulo={t("Position of contact reasons (example data)", "Posição dos motivos de contato (dados de exemplo)")} series={RANKING} periodos={MESES}
                formatarPosicao={ord} />
            </DescobertaVisual>
          </div>

          <div id="graficos-funil" className="min-w-0 scroll-mt-32">
            <DescobertaVisual rotulos={rotulos}
              tema={t("From booking to visit", "Do agendamento à visita")} selo={SELO}
              conclusao={t("The biggest drop is between choosing a service and choosing a time", "A maior perda está entre escolher o serviço e escolher o horário")}
              contexto={t("People at each stage of online booking, last 4 weeks.", "Pessoas em cada etapa do agendamento on-line, últimas 4 semanas.")}
              porQueImporta={t("Whoever does not find a time does not book: it is the stage that weighs most on the journey.", "Quem não encontra horário não agenda: é a etapa que mais pesa no caminho.")}
              acao={t("Watch a few people try to choose a time and note where they hesitate.", "Observe algumas pessoas tentando escolher um horário e anote onde elas hesitam.")}
              dados={tabela([t("Stage", "Etapa"), t("People", "Pessoas")], JORNADA.map(j => [j.rotulo, n(j.valor)]))}
            >
              <Funil localidade={loc} formatar={n} rotulo={t("Booking journey (example data)", "Jornada do agendamento (dados de exemplo)")} etapas={JORNADA}
                rotulos={{ seguiram: p => t(`${p} continued`, `${p} seguiram`), maiorPerda: t("Biggest drop", "Maior perda") }} />
            </DescobertaVisual>
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE DESIGN ── */}
      <section id="graficos-inteligencia" className="scroll-mt-32">
        <SectionHeader
          title={t("Intelligence design, not just a dashboard", "Design de inteligência, não apenas um dashboard")}
          description={t(
            "Each chart answers a question and arrives with its conclusion. The AI presents discoveries in natural language and highlights what changed; technical statistics stay in a secondary layer, in See data.",
            "Cada gráfico responde a uma pergunta e chega junto com a conclusão. A IA apresenta descobertas em linguagem natural e destaca o que mudou; estatísticas técnicas ficam numa camada secundária, em Ver dados.",
          )}
        />
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {PASSOS_INTELIGENCIA.map(p => (
            <li key={p.n} className="rounded-lg border border-border bg-card p-4">
              <span className="text-[1.25rem] font-bold tabular-nums text-[var(--primary-text)]">{p.n}</span>
              <p className="mt-1 text-[0.9375rem] font-semibold text-foreground">{p.t}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="min-w-0">
            <Rotulo>{t("The four steps in the card (example data)", "Os quatro passos no card (dados de exemplo)")}</Rotulo>
            <DescobertaVisual rotulos={rotulos}
              numerar tema={t("Reasons for contact", "Motivos de contato")} selo={SELO}
              conclusao={t("Booking is the most common reason for contact", "Agendamento é o motivo de contato mais comum")}
              contexto={t("Contacts by reason in the last 4 weeks.", "Atendimentos por motivo nas últimas 4 semanas.")}
              porQueImporta={t("It is what takes up most of the team's day.", "É o que ocupa boa parte do dia da equipe.")}
              acao={t("Check whether booking can be done without waiting for a person.", "Veja se o agendamento pode ser feito sem esperar uma pessoa.")}
              dados={tabela([t("Reason", "Motivo"), t("Contacts", "Atendimentos")], MOTIVOS.slice(0, 4).map(b => [b.rotulo, n(b.valor)]))}
            >
              <BarrasOrdenadas rotulo={t("Contacts by reason (example data)", "Atendimentos por motivo (dados de exemplo)")} itens={MOTIVOS.slice(0, 4)} destaques={1} formatar={n} />
            </DescobertaVisual>
          </div>
          <div className="min-w-0 space-y-4">
            <Cartao>
              <p className="mb-2 flex items-center gap-2 text-[0.9375rem] font-semibold text-foreground"><MessageSquareText aria-hidden className="h-4 w-4 text-[var(--primary-text)]" />{t("Editorial principle", "Princípio editorial")}</p>
              <ul className="space-y-2 text-[0.875rem] leading-relaxed text-foreground">
                <li>{t("The AI presents discoveries in natural language, as someone who knows the service would say them.", "A IA apresenta descobertas em linguagem natural, como uma pessoa que conhece o serviço diria.")}</li>
                <li>{t("Highlight what changed: went up, went down, moved ahead, stayed above the average.", "Destaque o que mudou: subiu, caiu, passou à frente, ficou acima da média.")}</li>
                <li>{t("Technical statistics (sample, deviation, correlation, method) stay in the details, never in the title.", "Estatística técnica (amostra, desvio, correlação, método) fica no detalhamento, nunca no título.")}</li>
                <li>{t("A hypothesis looks like a hypothesis: \"may indicate\", and never a cause the data does not show.", "Hipótese tem cara de hipótese: \"pode indicar\", e nunca uma causa que o dado não mostra.")}</li>
              </ul>
            </Cartao>
            <Cartao>
              <p className="mb-2 flex items-center gap-2 text-[0.9375rem] font-semibold text-foreground"><ChartColumn aria-hidden className="h-4 w-4 text-[var(--primary-text)]" />{t("Chart title", "Título de gráfico")}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-md bg-muted/60 p-3">
                  <p className="mb-1 flex items-center gap-1 text-[0.75rem] font-semibold text-muted-foreground"><X aria-hidden className="h-3.5 w-3.5 text-error" />{t("Avoid", "Evitar")}</p>
                  <p className="text-[0.875rem] text-foreground">{t("Percentage distribution of requests by type (n = 4,812)", "Distribuição percentual de demandas por tipo (n = 4.812)")}</p>
                </div>
                <div className="rounded-md bg-[var(--success-muted)] p-3">
                  <p className="mb-1 flex items-center gap-1 text-[0.75rem] font-semibold text-foreground"><Check aria-hidden className="h-3.5 w-3.5 text-success" />{t("Prefer", "Preferir")}</p>
                  <p className="text-[0.875rem] text-foreground">{t("Booking and questions are half of all requests", "Agendamento e dúvidas são metade das demandas")}</p>
                </div>
              </div>
            </Cartao>
          </div>
        </div>
        <div className="mt-4">
          <VejaEm
            secao="voice" ancora="escrita-inteligencia"
            titulo={t("How to write the conclusion, the context and the next step", "Como escrever a conclusão, o contexto e o próximo passo")}
            texto={t("The writing rules for discoveries live in Voice & UX writing › A conversation, not a report.", "As regras de escrita das descobertas ficam em Tom de voz e UX writing › Uma conversa, não um relatório.")}
            rotuloBotao={t("See in Voice", "Ver em Tom de voz")}
          />
        </div>
      </section>

      {/* ── COMPONENTS ── */}
      <section id="graficos-componentes" className="scroll-mt-32">
        <SectionHeader
          title={t("Components and props", "Componentes e props")}
          description={t(
            "All in ui/graficos.tsx. They are presentational: they receive ready data through props and fetch nothing. Each one accepts rotulo (accessible name), formatar (how to write values) and className.",
            "Todos em ui/graficos.tsx. São de apresentação: recebem os dados prontos por props e não buscam nada. Cada um aceita rotulo (nome acessível), formatar (como escrever os valores) e className.",
          )}
        />
        <TabelaQueQuebra
          head={[t("Component", "Componente"), t("For", "Para quê"), t("Main props", "Props principais")]}
          rows={[
            ["DescobertaVisual", t("Card with the 4 steps and See data", "Card com os 4 passos e Ver dados"), "tema, conclusao, contexto, porQueImporta, acao, dados, selo, numerar, rotulos"],
            ["GraficoDeRosca", t("Share of up to 5 parts", "Participação de até 5 partes"), "partes (rotulo, valor, neutro), centro, formatarQuantidade, tamanho, localidade"],
            ["BarrasOrdenadas", t("Ranking of values", "Ranking de valores"), "itens, destaques, ordenar, posicao"],
            ["MapaDeCalorPorRegiao", t("Heat by region (schematic)", "Calor por região (esquemático)"), "regioes (id, rotulo, valor, coluna, linha), colunas, linhas, destaque, rotulos"],
            ["GraficoDeHalteres", t("Two measures per item", "Duas medidas por item"), "itens (rotulo, a, b), series, maximo, formatarDiferenca"],
            ["GraficoDeLinhas", t("Trend over time", "Tendência no tempo"), "series (rotulo, valores, destaque), rotulosX, area, altura, zero"],
            ["GraficoDeInclinacao", t("Before and after", "Antes e depois"), "itens (rotulo, inicio, fim), periodos, destaques"],
            ["Mosaico", t("Share of many parts", "Participação de muitas partes"), "itens (rotulo, valor, neutro), altura, localidade"],
            ["BarrasEmpilhadas100", t("Proportions across groups", "Proporções entre grupos"), "categorias, linhas (rotulo, valores), minimoParaRotulo, localidade"],
            ["GraficoDeBolhas", t("Three measures at once", "Três medidas ao mesmo tempo"), "itens (rotulo, x, y, tamanho, destaque), eixoX, eixoY, rotuloTamanho"],
            ["MapaDeCalorMatricial", t("Compare rows and columns", "Comparar linhas e colunas"), "linhas, colunas, valores, rotuloLinhas, destaque, rotulos"],
            ["GraficoDeRanking", t("Change of position", "Mudança de posição"), "series (rotulo, posicoes, destaque), periodos, formatarPosicao"],
            ["Funil", t("Shrinking stages", "Etapas que se reduzem"), "etapas (rotulo, valor), destacarMaiorPerda, rotulos, localidade"],
          ].map(l => [<code key="c" className="font-mono text-[0.8125rem]">{l[0]}</code>, l[1], l[2]])}
        />
        <div className="mt-4">
          <Callout title={t("Geographic heat map", "Mapa de calor geográfico")}>
            <p>{t(
              "The DS ships no region outlines. MapaDeCalorPorRegiao draws a schematic map: each region is a block on a grid, at the approximate position the product provides (column, row and size). The \"not to scale\" note is always shown. For a map with real outlines, the product passes its own geographic data; the DS fetches nothing.",
              "O DS não traz contornos de regiões. O MapaDeCalorPorRegiao desenha um mapa esquemático: cada região é um bloco numa grade, na posição aproximada que o produto informar (coluna, linha e tamanho). A nota \"sem escala\" aparece sempre. Para um mapa com contornos reais, o produto passa os próprios dados geográficos; o DS não busca nada.",
            )}</p>
          </Callout>
        </div>
      </section>

      {/* ── ACCESSIBILITY ── */}
      <section id="graficos-acessibilidade" className="scroll-mt-32">
        <SectionHeader title={t("Accessibility", "Acessibilidade")} description={t("A chart must be understood without color, without a mouse and without seeing the screen.", "O gráfico precisa ser entendido sem a cor, sem o mouse e sem enxergar a tela.")} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Callout title={t("Checklist", "Checklist")}>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t("Every chart has a title with the conclusion and an accessible name (role=\"img\" with an aria-label that summarizes the data). The matrix heat map is a real table.", "Todo gráfico tem título com a conclusão e um nome acessível (role=\"img\" com aria-label que resume os dados). O mapa de calor em matriz é uma tabela de verdade.")}</li>
              <li>{t("See data opens a table with the numbers: it is the detail layer and the alternative for screen readers.", "Ver dados abre uma tabela com os números: é o detalhamento e a alternativa para leitores de tela.")}</li>
              <li>{t("Values and names written next to the marks; the legend is support, never the only way to read.", "Valores e nomes escritos junto das marcas; a legenda é apoio, nunca a única forma de leitura.")}</li>
              <li>{t("Highlight also through thickness, text weight or an outline, not only color.", "Destaque também pela espessura, pelo peso do texto ou por um contorno, não só pela cor.")}</li>
              <li>{t("Text on color only on tones at 4.5:1 or above; other labels stay outside the marks.", "Texto sobre cor só em tons com 4,5:1 ou mais; os demais rótulos ficam fora das marcas.")}</li>
            </ul>
          </Callout>
          <Callout title={t("Motion and size", "Movimento e tamanho")}>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t("Short entrances (up to 0.9 s), once; with reduced motion, nothing animates.", "Entradas curtas (até 0,9 s) e uma vez só; com \"menos movimento\", nada anima.")}</li>
              <li>{t("Charts measure the card width and redraw: text does not shrink on phones and nothing scrolls sideways.", "Os gráficos medem a largura do card e se redesenham: o texto não encolhe no celular e nada rola na horizontal.")}</li>
              <li>{t("Axis text at 11 px minimum; values at 12 px.", "Texto de eixo com 11 px no mínimo; valores com 12 px.")}</li>
              <li>{t("Hover highlighting is extra: the same information is written on the chart or in the table.", "Realce ao passar o cursor é extra: a mesma informação está escrita no gráfico ou na tabela.")}</li>
            </ul>
          </Callout>
        </div>
      </section>
    </div>
  );
}
