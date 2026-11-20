import React from "react";
import { ChartColumnBig, ChartLine, ChartPie, ChartScatter, ChartSpline, MapPinned, Check, X, MessageSquareText, ChartColumn, AlertTriangle, ChevronDown } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionHeader } from "./shared/SectionHeader";
import { VejaEm } from "./shared/VejaEm";
import { Callout, DoDont } from "./shared/Guidance";
import {
  DescobertaVisual, GraficoDeRosca, BarrasOrdenadas, MapaDeCalorPorRegiao, GraficoDeHalteres, GraficoDeLinhas,
  GraficoDeInclinacao, Mosaico, BarrasEmpilhadas100, GraficoDeBolhas, MapaDeCalorMatricial, GraficoDeRanking, Funil,
  formatarNumero, TabelaDeDados, type RegiaoDoMapa, type DadosDaTabela,
} from "../ui/graficos-inteligencia";
import {
  BarrasAgrupadas, BarrasEmpilhadas, Pirulito, AreaEmpilhada, Streamgraph, LinhaDoTempo, CalendarioDeCalor, GraficoDeVelas,
  Pizza, Sunburst, Waffle, Piramide, Cascata, Dispersao, MatrizDeCorrelacao, Radar, CoordenadasParalelas, Sankey, RedeDeConexoes,
  Histograma, BoxPlot, Violino, Densidade, MapaDePontos, MapaDeBolhas, resumoDaDistribuicao,
} from "../ui/graficos-catalogo";

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

/* ── Full catalog: example data (fictitious; fixed seeds, always the same) ── */

/** Seeded pseudo-random numbers (mulberry32): the example does not change on every load. */
function sorteador(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Roughly normal sample (sum of uniforms), rounded, with a floor. */
function amostra(semente: number, quantos: number, media: number, dp: number, piso = 0) {
  const r = sorteador(semente);
  return Array.from({ length: quantos }, () => Math.max(piso, Math.round(media + (r() + r() + r() + r() - 2) * dp * 1.73)));
}

const ESPERA_A = [...amostra(51, 110, 14, 6, 2), 42, 47, 55];
const ESPERA_MANHA = amostra(52, 110, 22, 8, 2);
const ESPERA_POR_UNIDADE_VALORES = [
  [...amostra(61, 18, 8, 3, 1), ...amostra(62, 18, 26, 4, 1)],
  amostra(63, 34, 15, 5, 1),
  [...amostra(64, 32, 28, 8, 3), 64],
  [...amostra(65, 32, 18, 5, 2), 49, 1],
];
const CALENDARIO_DM = (() => {
  const r = sorteador(17);
  const peso = [22, 10, 6, 4, 8, -26, -36]; // Monday to Sunday
  return Array.from({ length: 91 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 7, 3 + i));
    const valor = Math.max(2, Math.round(48 + peso[i % 7]! + 10 * Math.sin(i / 11) + (r() - 0.5) * 18 + (i === 56 ? 34 : 0)));
    return { data: d.toISOString().slice(0, 10), valor };
  });
})();

/** Catalog card: name, component, when to use, the chart, the reading caveat and See data. */
function CartaoDoCatalogo({ nome, componente, quando, cuidado, dados, children }: { nome: string; componente: string; quando: string; cuidado?: string; dados: DadosDaTabela; children: React.ReactNode }) {
  const { t } = useI18n();
  const [aberto, setAberto] = React.useState(false);
  const id = React.useId();
  return (
    <article className="flex min-w-0 flex-col rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h4 className="text-[1rem] font-bold leading-snug text-foreground">{nome}</h4>
          <p className="font-mono text-[0.75rem] text-muted-foreground">{componente}</p>
        </div>
        <span className="inline-flex h-6 shrink-0 items-center rounded-sm border border-border px-2 text-[0.6875rem] font-medium text-muted-foreground">{t("Example data", "Dados de exemplo")}</span>
      </div>
      <p className="mt-2 text-[0.8125rem] leading-relaxed text-foreground"><span className="font-semibold">{t("When to use: ", "Quando usar: ")}</span>{quando}</p>
      <div className="mt-5 min-w-0 flex-1">{children}</div>
      {cuidado && (
        <p className="mt-4 flex gap-2 rounded-md bg-[var(--warning-muted)] px-3 py-2 text-[0.8125rem] leading-relaxed text-foreground">
          <AlertTriangle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
          <span><span className="font-semibold">{t("Careful: ", "Cuidado: ")}</span>{cuidado}</span>
        </p>
      )}
      <div className="mt-4">
        <button type="button" aria-expanded={aberto} aria-controls={id} onClick={() => setAberto(v => !v)}
          className="inline-flex items-center gap-1 rounded-sm text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          {aberto ? t("Hide data", "Ocultar dados") : t("See data", "Ver dados")}
          <ChevronDown aria-hidden className={`h-4 w-4 transition-transform motion-reduce:transition-none ${aberto ? "rotate-180" : ""}`} />
        </button>
        <div id={id} hidden={!aberto} className="mt-2 max-h-80 overflow-y-auto rounded-md bg-muted/50 px-3 py-1">
          <TabelaDeDados dados={dados} legenda={nome} />
        </div>
      </div>
    </article>
  );
}

function Familia({ id, icone: Icone, nome, descricao, children }: { id: string; icone: React.ElementType; nome: string; descricao: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-32">
      <div className="mb-4 flex items-start gap-3">
        <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary-muted)] text-[var(--primary-text)]"><Icone className="h-[18px] w-[18px]" /></span>
        <div>
          <h3 className="text-[1.125rem] font-bold text-foreground">{nome}</h3>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{descricao}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
    </div>
  );
}

function SecaoCatalogo() {
  const { t, lang } = useI18n();
  const loc = lang === "pt" ? "pt-BR" : "en-US";
  const n = (v: number) => formatarNumero(v, 0, loc);
  const pct = (v: number) => `${formatarNumero(v, 0, loc)}%`;
  const min = (v: number) => `${formatarNumero(v, 0, loc)} min`;
  const nota = t("Schematic map: approximate positions, not to scale.", "Mapa esquemático: posições aproximadas, sem escala.");
  const tabela = (colunas: string[], linhas: (string | number)[][]) => ({ colunas, linhas });
  const resumoDist = (vs: number[], f: (v: number) => string) => {
    const s = resumoDaDistribuicao(vs);
    return [[t("Minimum", "Mínimo"), f(s.minimo)], [t("1st quartile", "1º quartil"), f(s.q1)], [t("Median", "Mediana"), f(s.mediana)], [t("3rd quartile", "3º quartil"), f(s.q3)], [t("Maximum", "Máximo"), f(s.maximo)], [t("Count", "Quantidade"), n(vs.length)]];
  };
  const mediana = t("median", "mediana");

  /* Comparison */
  const MOTIVOS_SERIES = ["WhatsApp", t("Phone", "Telefone"), "E-mail"];
  const MOTIVOS_GRUPOS = [
    { rotulo: t("Booking", "Agendamento"), valores: [164, 92, 40] },
    { rotulo: t("Questions", "Dúvidas"), valores: [120, 104, 58] },
    { rotulo: t("Documents", "Documentos"), valores: [46, 38, 84] },
    { rotulo: t("Complaints", "Reclamações"), valores: [28, 44, 36] },
  ];
  const POR_UNIDADE = {
    categorias: [{ rotulo: "WhatsApp" }, { rotulo: t("Phone", "Telefone") }, { rotulo: t("In person", "Presencial") }, { rotulo: t("Other", "Outros"), neutro: true }],
    linhas: [
      { rotulo: t("Unit A", "Unidade A"), valores: [120, 84, 52, 30] },
      { rotulo: t("Unit B", "Unidade B"), valores: [96, 132, 58, 44] },
      { rotulo: t("Unit C", "Unidade C"), valores: [70, 48, 40, 22] },
    ],
  };
  const ESPERA_SERVICO = [
    { rotulo: t("Document copy", "Segunda via"), valor: 31 },
    { rotulo: t("First visit", "Primeiro atendimento"), valor: 24 },
    { rotulo: t("Registration update", "Atualização de cadastro"), valor: 19 },
    { rotulo: t("Rescheduling", "Troca de horário"), valor: 16 },
    { rotulo: t("Follow-up", "Retorno"), valor: 12 },
    { rotulo: t("Information", "Informações"), valor: 9 },
    { rotulo: t("Pick-up", "Retirada"), valor: 6 },
  ];

  /* Time */
  const SEMANAS_8 = Array.from({ length: 8 }, (_, i) => t(`Wk ${i + 1}`, `Sem. ${i + 1}`));
  const POR_CANAL = [
    { rotulo: "WhatsApp", valores: [220, 236, 250, 272, 290, 310, 334, 352] },
    { rotulo: t("Phone", "Telefone"), valores: [300, 296, 290, 282, 276, 270, 262, 256] },
    { rotulo: t("In person", "Presencial"), valores: [180, 176, 182, 178, 172, 170, 168, 166] },
  ];
  const SEMANAS_12 = Array.from({ length: 12 }, (_, i) => t(`W${i + 1}`, `S${i + 1}`));
  const POR_MOTIVO = [
    { rotulo: t("Rescheduling", "Troca de horário"), valores: [40, 44, 52, 66, 80, 96, 112, 128, 140, 150, 158, 166] },
    { rotulo: t("Booking", "Agendamento"), valores: [150, 148, 152, 146, 150, 144, 140, 146, 142, 138, 140, 136] },
    { rotulo: t("Deadlines", "Prazos"), valores: [110, 122, 136, 148, 140, 126, 114, 106, 100, 94, 90, 86] },
    { rotulo: t("Other", "Outros"), valores: [80, 82, 78, 84, 86, 82, 80, 84, 82, 86, 84, 82], neutro: true },
  ];
  const MARCOS = [
    { quando: 34, data: t("Feb 3", "03 fev"), rotulo: t("Interviews with clients", "Entrevistas com clientes") },
    { quando: 52, data: t("Feb 21", "21 fev"), rotulo: t("Journey map", "Mapa da jornada") },
    { quando: 72, data: t("Mar 13", "13 mar"), rotulo: t("New reception test", "Teste da nova recepção"), destaque: true },
    { quando: 95, data: t("Apr 5", "05 abr"), rotulo: t("Booking adjusted", "Ajuste no agendamento") },
    { quando: 118, data: t("Apr 28", "28 abr"), rotulo: t("Team training", "Treinamento da equipe") },
    { quando: 140, data: t("May 20", "20 mai"), rotulo: t("Results review", "Avaliação dos resultados") },
  ];
  const MESES_MARCOS = [{ quando: 32, rotulo: t("Feb", "fev") }, { quando: 60, rotulo: t("Mar", "mar") }, { quando: 91, rotulo: t("Apr", "abr") }, { quando: 121, rotulo: t("May", "mai") }];
  const DIAS = [t("Monday", "Segunda"), t("Tuesday", "Terça"), t("Wednesday", "Quarta"), t("Thursday", "Quinta"), t("Friday", "Sexta"), t("Saturday", "Sábado"), t("Sunday", "Domingo")];
  const CAL_MEDIAS = DIAS.map((d, k) => { const vs = CALENDARIO_DM.filter((_, i) => i % 7 === k).map(x => x.valor); return [d, n(vs.reduce((s, v) => s + v, 0) / vs.length)]; });
  const VELAS = Array.from({ length: 8 }, (_, i) => {
    const base = [[14, 26, 9, 18], [18, 31, 12, 24], [24, 33, 15, 20], [20, 28, 11, 13], [13, 22, 8, 16], [16, 21, 9, 11], [11, 19, 7, 15], [15, 20, 8, 10]][i]!;
    return { rotulo: SEMANAS_8[i]!, abertura: base[0]!, maxima: base[1]!, minima: base[2]!, fechamento: base[3]! };
  });

  /* Composition */
  const CANAIS = [
    { rotulo: "WhatsApp", valor: 52 },
    { rotulo: t("Phone", "Telefone"), valor: 27 },
    { rotulo: "E-mail", valor: 13 },
    { rotulo: t("Other channels", "Outros canais"), valor: 8, neutro: true },
  ];
  const SUNBURST = [
    { rotulo: t("Booking", "Agendamento"), filhos: [{ rotulo: t("Book", "Marcar"), valor: 120 }, { rotulo: t("Reschedule", "Remarcar"), valor: 80 }, { rotulo: t("Cancel", "Cancelar"), valor: 45 }] },
    { rotulo: t("Information", "Informações"), filhos: [{ rotulo: t("Deadlines", "Prazos"), valor: 70 }, { rotulo: t("Prices", "Preços"), valor: 40 }] },
    { rotulo: t("Documents", "Documentos"), filhos: [{ rotulo: t("Copies", "Segunda via"), valor: 55 }, { rotulo: t("Statements", "Declarações"), valor: 25 }] },
    { rotulo: t("Other", "Outros"), neutro: true, filhos: [{ rotulo: t("Other reasons", "Outros motivos"), valor: 35 }] },
  ];
  const ORIGEM = [
    { rotulo: t("Referral", "Indicação"), valor: 38 },
    { rotulo: t("Web search", "Busca na internet"), valor: 29 },
    { rotulo: t("Social media", "Redes sociais"), valor: 21 },
    { rotulo: t("Other", "Outros"), valor: 12, neutro: true },
  ];
  const FAIXAS_IDADE = ["65+", "50–64", "35–49", "25–34", "18–24"];
  const PIRAMIDE = { esquerda: { rotulo: t("First visit", "Primeiro atendimento"), valores: [42, 96, 150, 128, 64] }, direita: { rotulo: t("Follow-up", "Retorno"), valores: [88, 132, 118, 70, 26] } };
  const CASCATA = {
    inicio: { rotulo: t("Waiting list at the start of the month", "Fila no início do mês"), valor: 320 },
    passos: [
      { rotulo: t("New requests", "Novas solicitações"), valor: 210 },
      { rotulo: t("Served", "Atendidas"), valor: -260 },
      { rotulo: t("Gave up", "Desistências"), valor: -35 },
      { rotulo: t("Came back", "Retornos"), valor: 40 },
    ],
    fim: { rotulo: t("Waiting list at the end of the month", "Fila no fim do mês") },
  };

  /* Relationships */
  const DISPERSAO = (() => {
    const r = sorteador(13);
    const pts = Array.from({ length: 28 }, (_, i) => {
      const x = Math.round(4 + r() * 40);
      return { x, y: Math.round(Math.min(10, Math.max(2, 9.4 - x * 0.12 + (r() - 0.5) * 2)) * 10) / 10, rotulo: t(`Visit ${String(i + 1).padStart(2, "0")}`, `Atendimento ${String(i + 1).padStart(2, "0")}`) };
    });
    return [...pts, { x: 38, y: 8.6, rotulo: t("Unit C, Tuesday", "Unidade C, terça"), destaque: true }, { x: 8, y: 3.2, rotulo: t("Unit A, Monday", "Unidade A, segunda"), destaque: true }];
  })();
  const d1 = (v: number) => v.toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const CORRELACAO = {
    variaveis: [t("Waiting", "Espera"), t("Visit length", "Duração"), t("Clarity", "Clareza"), t("Return", "Retorno"), t("Satisfaction", "Satisfação")],
    valores: [
      [1, 0.14, -0.22, -0.41, -0.68],
      [0.14, 1, 0.36, 0.08, 0.18],
      [-0.22, 0.36, 1, 0.52, 0.74],
      [-0.41, 0.08, 0.52, 1, 0.61],
      [-0.68, 0.18, 0.74, 0.61, 1],
    ],
  };
  const RADAR = {
    eixos: [t("Access", "Acesso"), t("Reception", "Recepção"), t("Waiting", "Espera"), t("Service", "Atendimento"), t("Clarity", "Clareza"), t("Follow-up", "Retorno")],
    series: [
      { rotulo: t("Unit A", "Unidade A"), valores: [8.6, 9.1, 5.4, 9.0, 7.8, 6.2], destaque: true },
      { rotulo: t("Average of units", "Média das unidades"), valores: [7.4, 8.0, 6.6, 8.4, 7.2, 7.0] },
    ],
  };
  const PARALELAS = {
    eixos: [{ rotulo: t("Visits per week", "Atendimentos por semana") }, { rotulo: t("Average wait", "Espera média"), formatar: min }, { rotulo: t("Satisfaction", "Satisfação"), formatar: d1 }, { rotulo: t("Returns", "Retornos"), formatar: pct }],
    itens: [
      { rotulo: t("Unit A", "Unidade A"), valores: [320, 18, 8.4, 22] },
      { rotulo: t("Unit B", "Unidade B"), valores: [140, 26, 7.1, 9] },
      { rotulo: t("Unit C", "Unidade C"), valores: [90, 8, 9.2, 31], destaque: true },
      { rotulo: t("Unit D", "Unidade D"), valores: [410, 22, 7.8, 18] },
      { rotulo: t("Unit E", "Unidade E"), valores: [220, 14, 8.0, 14] },
      { rotulo: t("Unit F", "Unidade F"), valores: [380, 34, 6.2, 6], destaque: true },
      { rotulo: t("Unit G", "Unidade G"), valores: [160, 16, 8.6, 16] },
      { rotulo: t("Unit H", "Unidade H"), valores: [260, 20, 7.5, 12] },
    ],
  };
  const SANKEY = {
    nos: [
      { id: "wpp", rotulo: "WhatsApp", coluna: 0 },
      { id: "tel", rotulo: t("Phone", "Telefone"), coluna: 0 },
      { id: "site", rotulo: "Site", coluna: 0 },
      { id: "resolvido", rotulo: t("Solved on first contact", "Resolvido no 1º contato"), coluna: 1 },
      { id: "encaminhado", rotulo: t("Referred", "Encaminhado"), coluna: 1 },
      { id: "sem", rotulo: t("No answer", "Sem resposta"), coluna: 1, neutro: true },
    ],
    ligacoes: [
      { de: "wpp", para: "resolvido", valor: 380, destaque: true }, { de: "wpp", para: "encaminhado", valor: 160 }, { de: "wpp", para: "sem", valor: 80 },
      { de: "tel", para: "resolvido", valor: 120 }, { de: "tel", para: "encaminhado", valor: 70 }, { de: "tel", para: "sem", valor: 50 },
      { de: "site", para: "resolvido", valor: 40 }, { de: "site", para: "encaminhado", valor: 30 }, { de: "site", para: "sem", valor: 70 },
    ],
  };
  const REDE = {
    nos: [
      { id: "espera", rotulo: t("Waiting", "Espera"), valor: 9, destaque: true },
      { id: "agenda", rotulo: t("Booking", "Agendamento"), valor: 7 },
      { id: "info", rotulo: t("Information", "Informação"), valor: 6 },
      { id: "recepcao", rotulo: t("Reception", "Recepção"), valor: 5 },
      { id: "sinal", rotulo: t("Signage", "Sinalização"), valor: 4 },
      { id: "retorno", rotulo: t("Follow-up", "Retorno"), valor: 6 },
      { id: "preco", rotulo: t("Price", "Preço"), valor: 3 },
    ],
    ligacoes: [
      { de: "espera", para: "agenda", valor: 58 }, { de: "espera", para: "recepcao", valor: 44 }, { de: "espera", para: "info", valor: 30 },
      { de: "agenda", para: "retorno", valor: 36 }, { de: "info", para: "sinal", valor: 28 }, { de: "recepcao", para: "sinal", valor: 22 },
      { de: "info", para: "preco", valor: 16 }, { de: "retorno", para: "info", valor: 20 }, { de: "espera", para: "retorno", valor: 12 },
    ],
  };

  /* Distribution */
  const ESPERA_POR_UNIDADE = [t("Unit A", "Unidade A"), t("Unit B", "Unidade B"), t("Unit C", "Unidade C"), t("Unit D", "Unidade D")].map((r, i) => ({ rotulo: r, valores: ESPERA_POR_UNIDADE_VALORES[i]!, destaque: i === 2 }));
  const MEDIANA_A = resumoDaDistribuicao(ESPERA_A).mediana;

  /* Geography */
  const REGIOES_ESQ = [
    { id: "no", rotulo: t("Northwest", "Noroeste"), coluna: 1, linha: 1 }, { id: "n", rotulo: t("North", "Norte"), coluna: 2, linha: 1 }, { id: "ne", rotulo: t("Northeast", "Nordeste"), coluna: 3, linha: 1 },
    { id: "o", rotulo: t("West", "Oeste"), coluna: 1, linha: 2 }, { id: "c", rotulo: t("Centre", "Centro"), coluna: 2, linha: 2 }, { id: "l", rotulo: t("East", "Leste"), coluna: 3, linha: 2 },
    { id: "so", rotulo: t("Southwest", "Sudoeste"), coluna: 1, linha: 3 }, { id: "s", rotulo: t("South", "Sul"), coluna: 2, linha: 3 }, { id: "se", rotulo: t("Southeast", "Sudeste"), coluna: 3, linha: 3 },
  ];
  const VALORES_REGIAO: Record<string, number> = { no: 410, n: 620, ne: 540, o: 380, c: 890, l: 1180, so: 260, s: 320, se: 700 };
  const PONTOS = (() => {
    const r = sorteador(43);
    const centros: [number, number, number][] = [[1.5, 1.62, 5], [2.5, 1.62, 4], [1.5, 0.65, 3], [2.4, 2.62, 3], [0.6, 1.62, 2], [0.6, 2.62, 1]];
    let k = 0;
    return centros.flatMap(([cx, cy, q]) => Array.from({ length: q }, () => {
      k++;
      const parceiro = k % 3 === 0;
      return { rotulo: parceiro ? t(`Partner point ${k}`, `Posto parceiro ${k}`) : t(`Unit ${k}`, `Unidade ${k}`), x: cx + (r() - 0.5) * 0.7, y: cy + (r() - 0.5) * 0.45, tipo: parceiro ? 1 : 0 };
    })).map((p, i) => (i === 0 ? { ...p, rotulo: t("Main unit", "Unidade central"), destaque: true } : p));
  })();
  const BOLHAS = REGIOES_ESQ.map(r => ({ rotulo: r.rotulo, x: r.coluna - 0.5, y: r.linha - 0.56, valor: VALORES_REGIAO[r.id]!, destaque: r.id === "l" }));

  return (
    <section id="graficos-catalogo" className="scroll-mt-32">
      <SectionHeader
        title={t("Full catalog", "Catálogo completo")}
        description={t(
          "The other 25 models from the reference catalog, ready as components and organised by the 6 families. Start with the recommended charts; use these when the question calls for them. Each card says when to use it, shows the chart with fictitious example data and warns where the reading tends to mislead.",
          "Os outros 25 modelos do catálogo de referência, prontos como componentes, organizados pelas 6 famílias. Use primeiro os recomendados; recorra a estes quando a pergunta pedir. Cada card diz quando usar, mostra o gráfico com dados de exemplo (fictícios) e avisa onde a leitura costuma enganar.",
        )}
      />
      <div className="space-y-12">
        <Familia id="graficos-catalogo-comparacao" icone={ChartColumnBig} nome={t("Comparison", "Comparação")} descricao={t("Compare values across items and groups.", "Comparar valores entre itens e grupos.")}>
          <CartaoDoCatalogo nome={t("Grouped bars", "Barras agrupadas")} componente="BarrasAgrupadas" quando={t("To compare two or three measures side by side within each group.", "Para comparar duas ou três medidas lado a lado dentro de cada grupo.")}
            cuidado={t("With more than 3 series the reading slows down: split into smaller charts.", "Com mais de 3 séries a leitura fica lenta: divida em gráficos menores.")}
            dados={tabela([t("Reason", "Motivo"), ...MOTIVOS_SERIES], MOTIVOS_GRUPOS.map(g => [g.rotulo, ...g.valores.map(n)]))}>
            <BarrasAgrupadas formatar={n} rotulo={t("Contacts by reason and channel (example data)", "Contatos por motivo e canal (dados de exemplo)")} grupos={MOTIVOS_GRUPOS} series={MOTIVOS_SERIES} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Stacked bars", "Barras empilhadas")} componente="BarrasEmpilhadas" quando={t("When the total matters and you also want to show what it is made of.", "Quando o total importa e você também quer mostrar do que ele é feito.")}
            cuidado={t("Only the first part starts at zero; the others are hard to compare across bars. To compare the parts, use grouped bars.", "Só a primeira parte começa do zero; as outras são difíceis de comparar entre as barras. Para comparar as partes, use barras agrupadas.")}
            dados={tabela([t("Unit", "Unidade"), ...POR_UNIDADE.categorias.map(c => c.rotulo), "Total"], POR_UNIDADE.linhas.map(l => [l.rotulo, ...l.valores.map(n), n(l.valores.reduce((s, v) => s + v, 0))]))}>
            <BarrasEmpilhadas formatar={n} rotulo={t("Contacts by unit and channel (example data)", "Contatos por unidade e canal (dados de exemplo)")} {...POR_UNIDADE} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Lollipop", "Pirulito (lollipop)")} componente="Pirulito" quando={t("For a ranking with many items, when full bars would weigh too much; takes a reference line.", "Para um ranking com muitos itens, quando barras cheias pesariam demais; aceita uma linha de referência.")}
            dados={tabela([t("Service", "Serviço"), t("Average wait", "Espera média")], [...ESPERA_SERVICO.map(e => [e.rotulo, min(e.valor)]), [t("Target", "Meta"), min(15)]])}>
            <Pirulito formatar={min} rotulo={t("Average wait by service (example data)", "Espera média por serviço (dados de exemplo)")} itens={ESPERA_SERVICO} destaques={1} referencia={{ valor: 15, rotulo: t("Target", "Meta") }} />
          </CartaoDoCatalogo>
        </Familia>

        <Familia id="graficos-catalogo-tempo" icone={ChartLine} nome={t("Time", "Tempo")} descricao={t("Show how something evolves and when things happen.", "Mostrar como algo evolui e quando as coisas acontecem.")}>
          <CartaoDoCatalogo nome={t("Stacked area", "Área empilhada")} componente="AreaEmpilhada" quando={t("To see the total over time and how much each part contributes.", "Para ver o total ao longo do tempo e quanto cada parte contribui para ele.")}
            cuidado={t("Only the bottom layer has a straight baseline; the upper ones are hard to compare. With 3 or more series, check the numbers in See data.", "Só a camada de baixo tem a base reta; as de cima são difíceis de comparar entre si. Com 3 ou mais séries, confira os números em Ver dados.")}
            dados={tabela([t("Week", "Semana"), ...POR_CANAL.map(s => s.rotulo)], SEMANAS_8.map((s, i) => [s, ...POR_CANAL.map(x => n(x.valores[i]!))]))}>
            <AreaEmpilhada formatar={n} rotulos={{ total: "Total" }} rotulo={t("Contacts per week by channel (example data)", "Contatos por semana, por canal (dados de exemplo)")} series={POR_CANAL} rotulosX={SEMANAS_8} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Streamgraph" componente="Streamgraph" quando={t("To show the mix changing over many periods, when the movement matters more than the number.", "Para mostrar a mistura mudando ao longo de muitos períodos, quando o movimento importa mais que o número.")}
            cuidado={t("Not for reading values: the layers share no baseline. Use it for the overall picture and keep the numbers in the table.", "Não serve para ler valores: as camadas não têm base comum. Use para dar a ideia geral e deixe os números na tabela.")}
            dados={tabela([t("Week", "Semana"), ...POR_MOTIVO.map(s => s.rotulo)], SEMANAS_12.map((s, i) => [s, ...POR_MOTIVO.map(x => n(x.valores[i]!))]))}>
            <Streamgraph formatar={n} rotulo={t("Contact reasons over 12 weeks (example data)", "Motivos de contato em 12 semanas (dados de exemplo)")} series={POR_MOTIVO} rotulosX={SEMANAS_12} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Timeline", "Linha do tempo")} componente="LinhaDoTempo" quando={t("To place events in time and show the gaps between them.", "Para situar acontecimentos no tempo e mostrar os intervalos entre eles.")}
            dados={tabela([t("Date", "Data"), t("Event", "Acontecimento")], MARCOS.map(m => [m.data, m.rotulo]))}>
            <LinhaDoTempo rotulo={t("Milestones of an example improvement project", "Marcos de um projeto de melhoria de exemplo")} eventos={MARCOS} marcas={MESES_MARCOS} inicio={30} fim={146} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Calendar heat map", "Calendário de calor")} componente="CalendarioDeCalor" quando={t("To find weekday patterns and out-of-the-ordinary dates over weeks or months.", "Para achar padrões por dia da semana e datas fora da curva ao longo de semanas ou meses.")}
            cuidado={t("Neighbouring shades are hard to compare: the highest day is written out and the numbers are in See data.", "Tons vizinhos são difíceis de comparar: o dia de maior valor vai escrito e os números ficam em Ver dados.")}
            dados={tabela([t("Weekday", "Dia da semana"), t("Average contacts", "Média de contatos")], CAL_MEDIAS)}>
            <CalendarioDeCalor formatar={n} rotulo={t("Contacts per day over 13 weeks (example data)", "Contatos por dia em 13 semanas (dados de exemplo)")} dias={CALENDARIO_DM}
              rotulosDias={[t("Mon", "Seg"), t("Tue", "Ter"), t("Wed", "Qua"), t("Thu", "Qui"), t("Fri", "Sex"), t("Sat", "Sáb"), t("Sun", "Dom")]}
              rotulosMeses={lang === "pt" ? undefined : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
              formatarData={lang === "pt" ? undefined : d => `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getUTCMonth()]} ${d.getUTCDate()}`}
              rotulos={{ menos: t("Less", "Menos"), mais: t("More", "Mais"), maior: (d, v) => t(`Busiest day: ${d} (${v})`, `Dia com mais: ${d} (${v})`) }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Candlestick", "Velas (candlestick)")} componente="GraficoDeVelas" quando={t("To show, for each period, the first and last value and the range from lowest to highest, like waiting times through the week.", "Para mostrar, em cada período, o primeiro e o último valor e a variação entre o menor e o maior, como a espera ao longo da semana.")}
            cuidado={t("Little known outside financial markets: explain the body and the wick next to the chart, or use a line.", "Pouco conhecido fora do mercado financeiro: explique o corpo e o traço junto do gráfico, ou prefira uma linha.")}
            dados={tabela([t("Week", "Semana"), t("First", "Primeira"), t("Highest", "Maior"), t("Lowest", "Menor"), t("Last", "Última")], VELAS.map(v => [v.rotulo, min(v.abertura), min(v.maxima), min(v.minima), min(v.fechamento)]))}>
            <GraficoDeVelas rotulo={t("Waiting time per week (example data)", "Tempo de espera por semana (dados de exemplo)")} velas={VELAS} formatar={min}
              rotulos={{ subiu: t("Week ended with a longer wait", "Semana terminou com espera maior"), caiu: t("Week ended with a shorter wait", "Semana terminou com espera menor"), abertura: t("first", "primeira"), maxima: t("highest", "maior"), minima: t("lowest", "menor"), fechamento: t("last", "última") }} />
          </CartaoDoCatalogo>
        </Familia>

        <Familia id="graficos-catalogo-composicao" icone={ChartPie} nome={t("Composition", "Composição")} descricao={t("Show the parts of a whole and how it builds up.", "Mostrar as partes de um todo e como ele se forma.")}>
          <CartaoDoCatalogo nome={t("Pie", "Pizza")} componente="Pizza" quando={t("For 2 to 4 parts of a whole, when one of them is clearly bigger.", "Para 2 a 4 partes de um todo, quando uma delas é claramente maior.")}
            cuidado={t("Angles are hard to compare: with more than 4 parts, or parts of similar size, use bars or the donut.", "Ângulos são difíceis de comparar: com mais de 4 partes, ou partes de tamanho parecido, use barras ou a rosca.")}
            dados={tabela([t("Channel", "Canal"), t("Share", "Fatia")], CANAIS.map(p => [p.rotulo, pct(p.valor)]))}>
            <Pizza localidade={loc} rotulo={t("Contacts by channel (example data)", "Contatos por canal (dados de exemplo)")} partes={CANAIS} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Sunburst" componente="Sunburst" quando={t("For a two-level hierarchy: the groups and the parts of each group.", "Para uma hierarquia em dois níveis: os grupos e as partes de cada grupo.")}
            cuidado={t("The outer ring looks bigger than the inner one for the same share: compare by the written percentages, never by size.", "O anel de fora parece maior que o de dentro para a mesma fatia: compare pelos percentuais escritos, nunca pelo tamanho.")}
            dados={tabela([t("Group", "Grupo"), t("Part", "Parte"), t("Contacts", "Contatos")], SUNBURST.flatMap(g => g.filhos.map(f => [g.rotulo, f.rotulo, n(f.valor)])))}>
            <Sunburst localidade={loc} rotulo={t("Contact reasons by theme (example data)", "Motivos de contato por tema (dados de exemplo)")} grupos={SUNBURST} centro={{ valor: n(470), rotulo: t("contacts", "contatos") }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Waffle" componente="Waffle" quando={t("To show a proportion in a concrete way, like 29 in every 100.", "Para mostrar uma proporção de um jeito concreto, como 29 em cada 100.")}
            dados={tabela([t("Origin", "Origem"), t("Share", "Fatia")], ORIGEM.map(p => [p.rotulo, pct(p.valor)]))}>
            <Waffle localidade={loc} nota={t("Each square is 1% of the total.", "Cada quadrado é 1% do total.")} rotulo={t("How people found the service (example data)", "Como as pessoas chegaram ao serviço (dados de exemplo)")} partes={ORIGEM} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Pyramid", "Pirâmide")} componente="Piramide" quando={t("To compare how two groups spread across the same bands, side by side.", "Para comparar como dois grupos se distribuem pelas mesmas faixas, lado a lado.")}
            dados={tabela([t("Age band", "Faixa de idade"), PIRAMIDE.esquerda.rotulo, PIRAMIDE.direita.rotulo], FAIXAS_IDADE.map((f, i) => [f, n(PIRAMIDE.esquerda.valores[i]!), n(PIRAMIDE.direita.valores[i]!)]))}>
            <Piramide formatar={n} rotulo={t("People served by age band and visit type (example data)", "Pessoas atendidas por faixa de idade e tipo de atendimento (dados de exemplo)")} faixas={FAIXAS_IDADE} {...PIRAMIDE} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Waterfall", "Cascata (waterfall)")} componente="Cascata" quando={t("To explain how you get from one value to another, step by step, with what was added and what was taken away.", "Para explicar como se chega de um valor a outro, passo a passo, com o que somou e o que tirou.")}
            dados={tabela([t("Step", "Passo"), t("People", "Pessoas")], [[CASCATA.inicio.rotulo, n(CASCATA.inicio.valor)], ...CASCATA.passos.map(p => [p.rotulo, `${p.valor > 0 ? "+" : "−"}${n(Math.abs(p.valor))}`]), [CASCATA.fim.rotulo, n(CASCATA.inicio.valor + CASCATA.passos.reduce((s, p) => s + p.valor, 0))]])}>
            <Cascata formatar={n} rotulos={{ total: "Total", aumento: t("Increase", "Aumento"), reducao: t("Decrease", "Redução") }} rotulo={t("Waiting list over the month (example data)", "Fila de espera ao longo do mês (dados de exemplo)")} {...CASCATA} />
          </CartaoDoCatalogo>
        </Familia>

        <Familia id="graficos-catalogo-relacoes" icone={ChartScatter} nome={t("Relationships", "Relações")} descricao={t("See how measures move together and how things connect.", "Ver como medidas andam juntas e como as coisas se conectam.")}>
          <CartaoDoCatalogo nome={t("Scatter", "Dispersão")} componente="Dispersao" quando={t("To see whether two measures move together and find the items that stand out.", "Para ver se duas medidas andam juntas e encontrar os itens fora da curva.")}
            cuidado={t("Moving together is not cause: the trend line shows the direction, not the why.", "Andar junto não é causa: a linha de tendência mostra a direção, não o porquê.")}
            dados={tabela([t("Visit", "Atendimento"), t("Wait", "Espera"), t("Satisfaction", "Satisfação")], [...DISPERSAO].sort((a, b) => a.x - b.x).map(p => [p.rotulo, min(p.x), d1(p.y)]))}>
            <Dispersao rotulo={t("Waiting time and satisfaction (example data)", "Tempo de espera e satisfação (dados de exemplo)")} pontos={DISPERSAO} tendencia rotulos={{ tendencia: t("Trend", "Tendência") }}
              eixoX={{ rotulo: t("Wait", "Espera"), formatar: min }} eixoY={{ rotulo: t("Satisfaction (0–10)", "Satisfação (0 a 10)"), formatar: v => formatarNumero(v, 1, loc) }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Correlation matrix", "Matriz de correlação")} componente="MatrizDeCorrelacao" quando={t("To get an overview of which measures move together before looking into one pair.", "Para ter uma visão geral de quais medidas andam juntas antes de investigar um par.")}
            cuidado={t("Correlation is not cause. A value near zero only says there is no straight-line relation, not that there is no relation at all.", "Correlação não é causa. Um valor perto de zero só diz que não há relação em linha reta, não que não há relação nenhuma.")}
            dados={tabela([t("Measure", "Medida"), ...CORRELACAO.variaveis], CORRELACAO.variaveis.map((v, i) => [v, ...CORRELACAO.valores[i]!.map(x => x.toLocaleString(loc, { minimumFractionDigits: 2 }))]))}>
            <MatrizDeCorrelacao localidade={loc} rotulo={t("Correlation between experience measures (example data)", "Correlação entre medidas da experiência (dados de exemplo)")} {...CORRELACAO} destaque={[4, 0]}
              rotulos={{ fraca: t("Weak relation", "Relação fraca"), forte: t("Strong relation", "Relação forte"), nota: t("Striped: inverse relation, when one rises the other falls. Plain: they move together.", "Com listras: relação inversa, quando uma sobe a outra desce. Sem listras: andam juntas."), destaque: (a, b, v) => t(`Highlighted: ${a} and ${b} (${v})`, `Em destaque: ${a} e ${b} (${v})`) }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Radar" componente="Radar" quando={t("To compare the profile of 1 to 3 items across several measures on the same scale.", "Para comparar o perfil de 1 a 3 itens em várias medidas na mesma escala.")}
            cuidado={t("The area changes with the order of the axes and exaggerates differences; with more than 3 series it becomes a tangle. To compare numbers, use bars.", "A área muda com a ordem dos eixos e exagera diferenças; com mais de 3 séries vira um emaranhado. Para comparar números, use barras.")}
            dados={tabela([t("Measure", "Medida"), ...RADAR.series.map(s => s.rotulo)], RADAR.eixos.map((e, i) => [e, ...RADAR.series.map(s => d1(s.valores[i]!))]))}>
            <Radar formatar={d1} rotulo={t("Experience rating, 0 to 10 (example data)", "Avaliação da experiência, de 0 a 10 (dados de exemplo)")} {...RADAR} maximo={10} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Parallel coordinates", "Coordenadas paralelas")} componente="CoordenadasParalelas" quando={t("To compare many items across several measures with different scales and find similar profiles.", "Para comparar muitos itens em várias medidas de escalas diferentes e achar perfis parecidos.")}
            cuidado={t("With many items it becomes a tangle: highlight a few and leave the rest in grey. The order of the axes changes the drawing.", "Com muitos itens vira um emaranhado: destaque poucos e deixe o resto em cinza. A ordem dos eixos muda o desenho.")}
            dados={tabela([t("Unit", "Unidade"), ...PARALELAS.eixos.map(e => e.rotulo)], PARALELAS.itens.map(i => [i.rotulo, n(i.valores[0]!), min(i.valores[1]!), d1(i.valores[2]!), pct(i.valores[3]!)]))}>
            <CoordenadasParalelas rotulo={t("Units across four measures (example data)", "Unidades em quatro medidas (dados de exemplo)")} {...PARALELAS} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Sankey" componente="Sankey" quando={t("To show where a flow comes from and where it goes, and how much goes through each path.", "Para mostrar de onde vem e para onde vai um fluxo, e quanto passa por cada caminho.")}
            cuidado={t("With many crossing links it becomes unreadable: group the small ones into Other and use at most 3 columns.", "Com muitas ligações cruzadas fica ilegível: junte as pequenas em Outros e use no máximo 3 colunas.")}
            dados={tabela([t("From", "De"), t("To", "Para"), t("Contacts", "Contatos")], SANKEY.ligacoes.map(l => [SANKEY.nos.find(x => x.id === l.de)!.rotulo, SANKEY.nos.find(x => x.id === l.para)!.rotulo, n(l.valor)]))}>
            <Sankey formatar={n} rotulo={t("Contacts from channel to outcome (example data)", "Contatos do canal ao resultado (dados de exemplo)")} {...SANKEY} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Network", "Rede de conexões")} componente="RedeDeConexoes" quando={t("To see what connects with what and what sits at the centre of the connections.", "Para ver o que se conecta com o quê e o que fica no centro das conexões.")}
            cuidado={t("The position on the circle means nothing: read the links and their thickness.", "A posição no círculo não significa nada: leia as ligações e a espessura delas.")}
            dados={tabela([t("Theme", "Tema"), t("Appears with", "Aparece junto com"), t("Complaints", "Reclamações")], REDE.ligacoes.map(l => [REDE.nos.find(x => x.id === l.de)!.rotulo, REDE.nos.find(x => x.id === l.para)!.rotulo, n(l.valor)]))}>
            <RedeDeConexoes formatar={n} rotulo={t("Themes that appear together in complaints (example data)", "Temas que aparecem juntos nas reclamações (dados de exemplo)")} {...REDE} />
          </CartaoDoCatalogo>
        </Familia>

        <Familia id="graficos-catalogo-distribuicao" icone={ChartSpline} nome={t("Distribution", "Distribuição")} descricao={t("See how values spread: where they cluster and what stands out.", "Ver como os valores se espalham: onde se concentram e o que foge do padrão.")}>
          <CartaoDoCatalogo nome={t("Histogram", "Histograma")} componente="Histograma" quando={t("To see how a measure spreads: where it clusters and where it thins out.", "Para ver como uma medida se espalha: onde se concentra e onde rareia.")}
            cuidado={t("The width of the bands changes the shape: use equal bands with round numbers.", "A largura das faixas muda a forma do desenho: use faixas iguais e com números redondos.")}
            dados={tabela([t("Measure", "Medida"), t("Wait", "Espera")], resumoDist(ESPERA_A, min))}>
            <Histograma formatar={n} rotulo={t("Waiting time in the afternoon (example data)", "Tempo de espera à tarde (dados de exemplo)")} valores={ESPERA_A} faixas={8} destaque={[10, 20]}
              referencia={{ valor: MEDIANA_A, rotulo: t("Median", "Mediana") }} eixoX={{ rotulo: t("Wait", "Espera"), formatar: min }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome="Box plot" componente="BoxPlot" quando={t("To compare the distribution of several groups compactly: median, middle range and outliers.", "Para comparar a distribuição de vários grupos de forma compacta: mediana, faixa do meio e valores fora do padrão.")}
            cuidado={t("It hides the shape: Unit A has two peaks of waiting time (see the violin) and the box does not show it.", "Esconde a forma: a Unidade A tem dois picos de espera (veja o violino), e a caixa não mostra isso.")}
            dados={tabela([t("Unit", "Unidade"), t("Median", "Mediana"), t("1st quartile", "1º quartil"), t("3rd quartile", "3º quartil")], ESPERA_POR_UNIDADE.map(g => { const s = resumoDaDistribuicao(g.valores); return [g.rotulo, min(s.mediana), min(s.q1), min(s.q3)]; }))}>
            <BoxPlot rotulo={t("Waiting time by unit (example data)", "Tempo de espera por unidade (dados de exemplo)")} grupos={ESPERA_POR_UNIDADE} formatar={min} eixo={t("Wait", "Espera")}
              rotulos={{ mediana, nota: t("Box: the middle half of the values. Line: median. Hollow points: outliers.", "Caixa: metade do meio dos valores. Traço: mediana. Pontos vazados: fora do padrão.") }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Violin", "Violino")} componente="Violino" quando={t("Like the box plot, but showing the shape of the distribution, for example when there are two peaks.", "Como o box plot, mas mostrando a forma da distribuição, por exemplo quando há dois picos.")}
            cuidado={t("With few values (under 20 per group) the shape invents details: prefer the box plot.", "Com poucos valores (menos de 20 por grupo) a forma inventa detalhes: prefira o box plot.")}
            dados={tabela([t("Unit", "Unidade"), t("Median", "Mediana"), t("1st quartile", "1º quartil"), t("3rd quartile", "3º quartil")], ESPERA_POR_UNIDADE.map(g => { const s = resumoDaDistribuicao(g.valores); return [g.rotulo, min(s.mediana), min(s.q1), min(s.q3)]; }))}>
            <Violino rotulo={t("Waiting time by unit (example data)", "Tempo de espera por unidade (dados de exemplo)")} grupos={ESPERA_POR_UNIDADE} formatar={min} eixo={t("Wait", "Espera")}
              rotulos={{ mediana, nota: t("Wider: more values in that range. Dark bar: middle half. Dot: median.", "Mais largo: mais valores naquela faixa. Barra escura: metade do meio. Ponto: mediana.") }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Density", "Densidade")} componente="Densidade" quando={t("To compare the shape of 2 or 3 distributions on the same scale.", "Para comparar a forma de 2 ou 3 distribuições na mesma escala.")}
            cuidado={t("The curve is a smoothed estimate: it can suggest values where there are none.", "A curva é uma estimativa suavizada: pode sugerir valores onde não há nenhum.")}
            dados={tabela([t("Measure", "Medida"), t("Afternoon", "Tarde"), t("Morning", "Manhã")], resumoDist(ESPERA_A, min).map((l, i) => [l[0]!, l[1]!, resumoDist(ESPERA_MANHA, min)[i]![1]!]))}>
            <Densidade rotulo={t("Waiting time in the morning and afternoon (example data)", "Tempo de espera de manhã e à tarde (dados de exemplo)")} eixoX={{ rotulo: t("Wait", "Espera"), formatar: min }}
              rotulos={{ nota: t("The higher the curve, the more values in that range.", "Quanto mais alta a curva, mais valores naquela faixa.") }}
              series={[{ rotulo: t("Morning", "Manhã"), valores: ESPERA_MANHA, destaque: true }, { rotulo: t("Afternoon", "Tarde"), valores: ESPERA_A }]} />
          </CartaoDoCatalogo>
        </Familia>

        <Familia id="graficos-catalogo-geografia" icone={MapPinned} nome={t("Geography", "Geografia")} descricao={t("When place is part of the answer. Schematic maps: positions come from props, not to scale and with no real geographic data.", "Quando o lugar faz parte da resposta. Mapas esquemáticos: posições por props, sem escala e sem dados geográficos reais.")}>
          <CartaoDoCatalogo nome={t("Point map", "Mapa de pontos")} componente="MapaDePontos" quando={t("To show where things are and where they cluster, when place matters.", "Para mostrar onde as coisas estão e onde se concentram, quando o lugar importa.")}
            cuidado={t("Points very close to each other overlap; and the map is schematic: positions are approximate.", "Pontos muito próximos se sobrepõem; e o mapa é esquemático: as posições são aproximadas.")}
            dados={tabela([t("Region", "Região"), t("Units", "Unidades"), t("Partner points", "Postos parceiros")], REGIOES_ESQ.map(rg => { const dentro = PONTOS.filter(p => Math.ceil(p.x) === rg.coluna && Math.ceil(p.y) === rg.linha); return [rg.rotulo, n(dentro.filter(p => p.tipo === 0).length), n(dentro.filter(p => p.tipo === 1).length)]; }))}>
            <MapaDePontos rotulo={t("Service points by region (example data)", "Pontos de atendimento por região (dados de exemplo)")} regioes={REGIOES_ESQ} colunas={3} linhas={3} pontos={PONTOS}
              tipos={[t("Unit", "Unidade"), t("Partner point", "Posto parceiro")]} rotulos={{ nota }} />
          </CartaoDoCatalogo>
          <CartaoDoCatalogo nome={t("Bubble map", "Mapa de bolhas")} componente="MapaDeBolhas" quando={t("To compare quantities by place without painting whole regions.", "Para comparar quantidades por lugar sem pintar regiões inteiras.")}
            cuidado={t("Areas are hard to compare precisely: that is why the value is written next to each bubble.", "Áreas são difíceis de comparar com precisão: por isso o valor vai escrito junto de cada bolha.")}
            dados={tabela([t("Region", "Região"), t("Contacts", "Contatos")], [...BOLHAS].sort((a, b) => b.valor - a.valor).map(b => [b.rotulo, n(b.valor)]))}>
            <MapaDeBolhas formatar={n} rotulo={t("Contacts by region (example data)", "Contatos por região (dados de exemplo)")} regioes={REGIOES_ESQ} colunas={3} linhas={3} bolhas={BOLHAS} nomesDasRegioes={false}
              rotuloTamanho={t("Bubble size: contacts in the last 4 weeks", "Tamanho da bolha: contatos nas últimas 4 semanas")} rotulos={{ nota }} />
          </CartaoDoCatalogo>
        </Familia>
      </div>
    </section>
  );
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
    { icone: ChartColumnBig, nome: t("Comparison", "Comparação"), quando: t("Compare values across items: what is bigger, what changed places, how far apart two measures are.", "Comparar valores entre itens: o que é maior, o que mudou de lugar, qual a distância entre duas medidas."), tipos: [t("Vertical and horizontal bars", "Barras verticais e horizontais"), t("Grouped", "Agrupadas"), t("Stacked and 100%", "Empilhadas e 100%"), "Lollipop", "Dumbbell", "Slope"], ds: `BarrasOrdenadas, GraficoDeHalteres, GraficoDeInclinacao, BarrasEmpilhadas100; ${t("in the catalog", "no catálogo")}: BarrasAgrupadas, BarrasEmpilhadas, Pirulito` },
    { icone: ChartLine, nome: t("Time", "Tempo"), quando: t("Show how something evolves: trend, seasonality, before and after.", "Mostrar como algo evolui: tendência, sazonalidade, antes e depois."), tipos: [t("Lines", "Linhas"), t("Multiple lines", "Múltiplas linhas"), t("Area and stacked area", "Área e área empilhada"), "Streamgraph", "Timeline", t("Calendar heat map", "Calendário de calor"), "Candlestick"], ds: `GraficoDeLinhas, GraficoDeRanking; ${t("in the catalog", "no catálogo")}: AreaEmpilhada, Streamgraph, LinhaDoTempo, CalendarioDeCalor, GraficoDeVelas` },
    { icone: ChartPie, nome: t("Composition", "Composição"), quando: t("Show the parts of a whole: share, shrinking stages, what each part contributes.", "Mostrar as partes de um todo: participação, etapas que se reduzem, contribuição de cada parte."), tipos: [t("Pie and donut", "Pizza e rosca"), "Treemap", "Sunburst", "Waffle", t("Funnel", "Funil"), t("Pyramid", "Pirâmide"), "Waterfall"], ds: `GraficoDeRosca, Mosaico, BarrasEmpilhadas100, Funil; ${t("in the catalog", "no catálogo")}: Pizza, Sunburst, Waffle, Piramide, Cascata` },
    { icone: ChartScatter, nome: t("Relationships", "Relações"), quando: t("See how two or more measures move together, or how things connect.", "Ver como duas ou mais medidas andam juntas, ou como as coisas se conectam."), tipos: [t("Scatter", "Dispersão"), t("Bubbles", "Bolhas"), t("Heat map", "Mapa de calor"), t("Correlation matrix", "Matriz de correlação"), "Radar", t("Parallel coordinates", "Coordenadas paralelas"), "Sankey", t("Network", "Rede")], ds: `GraficoDeBolhas, MapaDeCalorMatricial; ${t("in the catalog", "no catálogo")}: Dispersao, MatrizDeCorrelacao, Radar, CoordenadasParalelas, Sankey, RedeDeConexoes` },
    { icone: ChartSpline, nome: t("Distribution", "Distribuição"), quando: t("See how values spread: where they cluster, what stands out from the pattern.", "Ver como os valores se espalham: onde se concentram, o que foge do padrão."), tipos: [t("Histogram", "Histograma"), "Box plot", t("Violin", "Violino"), t("Density", "Densidade")], ds: t("In the catalog: Histograma, BoxPlot, Violino, Densidade", "No catálogo: Histograma, BoxPlot, Violino, Densidade") },
    { icone: MapPinned, nome: t("Geography", "Geografia"), quando: t("When place is part of the answer: where demand is higher, where service is thinner.", "Quando o lugar faz parte da resposta: onde há mais procura, onde o atendimento é menor."), tipos: [t("Choropleth", "Coroplético"), t("Points", "Pontos"), t("Bubbles on a map", "Bolhas no mapa"), t("Geographic heat", "Calor geográfico")], ds: t("MapaDeCalorPorRegiao (schematic); in the catalog: MapaDePontos, MapaDeBolhas (schematic)", "MapaDeCalorPorRegiao (esquemático); no catálogo: MapaDePontos, MapaDeBolhas (esquemáticos)") },
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
    { token: "--chart-3", passo: "crimson-400", uso: t("Third series (the primary)", "Terceira série (a primária)") },
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
            <ul className="m-0 grid list-none grid-cols-4 gap-1 p-0">
              {["--chart-seq-1", "--chart-seq-2", "--chart-seq-3", "--chart-seq-4"].map(tk => (
                <li key={tk} className="min-w-0">
                  <span aria-hidden className="block h-10 rounded-sm" style={{ background: `var(${tk})` }} />
                  <span className="mt-1 block font-mono text-[0.6875rem] text-foreground [overflow-wrap:anywhere]">{tk}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[0.75rem] text-muted-foreground">{t(
              "Heat cells carry no numbers: the color shows the range, the highlighted cell gets an outline and is stated in a sentence below, and the numbers are in the tooltip and in See data.",
              "As células de calor não levam número: a cor mostra a faixa, a célula em destaque é contornada e dita numa frase abaixo, e os números ficam na dica e em Ver dados.",
            )}</p>
          </div>
          <div className="mt-6 border-t border-border pt-5">
            <Rotulo>{t("Text in charts", "Texto nos gráficos")}</Rotulo>
            <p className="text-[0.9375rem] font-semibold leading-snug text-foreground">{t(
              "No text on top of chart colors: values and labels stay outside the mark, always in the same text color.",
              "Nenhum texto sobre a cor do gráfico: valores e rótulos ficam fora da marca, sempre na mesma cor de texto.",
            )}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">{t(
              "No single text color reaches 4.5:1 on every tone of the palette, and switching the text color from one part to another makes the chart harder to read. So bars, slices, cells, blocks and bubbles carry no numbers or names. Values and names in --foreground; --muted-foreground only for secondary text, such as axes. When a value has to be tied to a part (stacked bars, treemap, donut), it follows a dot in that part's color, in the same order as the parts. Product owner's decision, 19/11/2026.",
              "Nenhuma cor de texto passa de 4,5:1 sobre todos os tons da paleta, e trocar a cor do texto de uma parte para outra confunde a leitura. Por isso barras, fatias, células, blocos e bolhas não levam número nem nome. Valores e nomes em --foreground; --muted-foreground só no texto secundário, como os eixos. Quando o valor precisa ser ligado a uma parte (barras empilhadas, mosaico, rosca), ele vem depois de um ponto na cor dela, na mesma ordem das partes. Decisão da dona do produto, 19/11/2026.",
            )}</p>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">{t("Areas:", "Áreas:")}</span> {t("a thin line in the series color and a transparent gradient fill.", "linha fina na cor da série e preenchimento em degradê transparente.")}</p>
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
              t("Values and names outside the marks, always in the same text color, with a dot in the part's color when they need to be tied to it.", "Valores e nomes fora das marcas, sempre na mesma cor de texto, com um ponto na cor da parte quando for preciso ligá-los a ela."),
              t("Graphite (--chart-neutral) for Other, context and baseline.", "Grafite (--chart-neutral) para Outros, contexto e linha de base."),
            ]}
            donts={[
              t("Use graphite and the primary as two series of equal weight.", "Usar grafite e primária como duas séries de mesmo peso."),
              t("Create colors outside the scale (green, blue, orange) to separate series.", "Criar cores fora da escala (verde, azul, laranja) para separar séries."),
              t("Rely on the legend alone to say what each color is.", "Depender só da legenda para dizer o que é cada cor."),
              t("Write a number or name on a bar, slice, cell, block or bubble, or switch the text color by tone.", "Escrever número ou nome sobre uma barra, fatia, célula, bloco ou bolha, ou trocar a cor do texto conforme o tom."),
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
                rotulos={{ ...escala, nota: t("Schematic map: each block is a region, in an approximate position, not to scale.", "Mapa esquemático: cada bloco é uma região, em posição aproximada, sem escala."), destaque: (r, v) => t(`Highlighted: ${r} (${v})`, `Em destaque: ${r} (${v})`) }} />
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
                rotuloLinhas={t("Period", "Período")} destaque={[0, 0]} rotulos={{ ...escala, destaque: (l, c, v) => t(`Highlighted: ${l}, ${c} (${v})`, `Em destaque: ${l}, ${c} (${v})`) }} />
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

      {/* ── FULL CATALOG ── */}
      <SecaoCatalogo />

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
            "The recommended charts are in ui/graficos-inteligencia.tsx and the full catalog in ui/graficos-catalogo.tsx. They are presentational: they receive ready data through props and fetch nothing. Each one accepts rotulo (accessible name), formatar (how to write values) and className.",
            "Os recomendados ficam em ui/graficos-inteligencia.tsx e os do catálogo completo em ui/graficos-catalogo.tsx. São de apresentação: recebem os dados prontos por props e não buscam nada. Cada um aceita rotulo (nome acessível), formatar (como escrever os valores) e className.",
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
            ["BarrasAgrupadas", t("Two to four measures per group", "Duas a quatro medidas por grupo"), "grupos (rotulo, valores), series, maximo"],
            ["BarrasEmpilhadas", t("The total and its parts", "Total e as partes dele"), "categorias (rotulo, neutro), linhas (rotulo, valores)"],
            ["Pirulito", t("Light ranking, with a reference", "Ranking leve, com referência"), "itens, destaques, ordenar, referencia (valor, rotulo), maximo"],
            ["AreaEmpilhada", t("Total over time and its parts", "Total no tempo e as partes"), "series (rotulo, valores, neutro), rotulosX, altura, rotulos"],
            ["Streamgraph", t("Mix changing over time", "Mistura mudando no tempo"), "series (rotulo, valores, neutro), rotulosX, altura"],
            ["LinhaDoTempo", t("Events in time", "Eventos no tempo"), "eventos (quando, data, rotulo, destaque), marcas, inicio, fim"],
            ["CalendarioDeCalor", t("Value per day", "Valor por dia"), "dias (data AAAA-MM-DD, valor), rotulosDias, rotulosMeses, formatarData, rotulos"],
            ["GraficoDeVelas", t("Open, high, low, close", "Abertura, máxima, mínima, fechamento"), "velas (rotulo, abertura, maxima, minima, fechamento), rotulos"],
            ["Pizza", t("Up to 4 parts of a whole", "Até 4 partes de um todo"), "partes (rotulo, valor, neutro), formatarQuantidade, tamanho, localidade"],
            ["Sunburst", t("Two-level hierarchy", "Hierarquia em dois níveis"), "grupos (rotulo, neutro, filhos), centro, tamanho, localidade"],
            ["Waffle", t("Proportion in 100 squares", "Proporção em 100 quadrados"), "partes (rotulo, valor, neutro), nota, localidade"],
            ["Piramide", t("Two groups per band", "Dois grupos por faixa"), "faixas, esquerda (rotulo, valores), direita, maximo"],
            ["Cascata", t("From start to end, step by step", "Do início ao fim, passo a passo"), "inicio (rotulo, valor), passos (rotulo, valor), fim (rotulo), rotulos"],
            ["Dispersao", t("Two measures per item", "Duas medidas por item"), "pontos (x, y, rotulo, destaque), eixoX, eixoY, tendencia, rotulos"],
            ["MatrizDeCorrelacao", t("Which measures move together", "Quais medidas andam juntas"), "variaveis, valores (−1 a 1), destaque, localidade, rotulos"],
            ["Radar", t("Profile across several measures", "Perfil em várias medidas"), "eixos, series (rotulo, valores, destaque), maximo, niveis"],
            ["CoordenadasParalelas", t("Many items, several scales", "Muitos itens, várias escalas"), "eixos (rotulo, formatar, min, max), itens (rotulo, valores, destaque)"],
            ["Sankey", t("Flows between stages", "Fluxos entre etapas"), "nos (id, rotulo, coluna, neutro), ligacoes (de, para, valor, destaque)"],
            ["RedeDeConexoes", t("What links with what", "O que se liga com o quê"), "nos (id, rotulo, valor, destaque), ligacoes (de, para, valor)"],
            ["Histograma", t("How a measure spreads", "Como uma medida se espalha"), "valores, faixas, destaque, referencia, eixoX"],
            ["BoxPlot", t("Distribution by group, compact", "Distribuição por grupo, compacta"), "grupos (rotulo, valores, destaque), eixo, rotulos"],
            ["Violino", t("Distribution by group, with the shape", "Distribuição por grupo, com a forma"), "grupos (rotulo, valores, destaque), eixo, rotulos"],
            ["Densidade", t("Shape of 2 or 3 distributions", "Forma de 2 ou 3 distribuições"), "series (rotulo, valores, destaque), eixoX, rotulos"],
            ["MapaDePontos", t("Where things are (schematic)", "Onde as coisas estão (esquemático)"), "regioes, colunas, linhas, pontos (rotulo, x, y, tipo, destaque), tipos, rotulos"],
            ["MapaDeBolhas", t("Quantity by place (schematic)", "Quantidade por lugar (esquemático)"), "regioes, colunas, linhas, bolhas (rotulo, x, y, valor, destaque), rotuloTamanho, rotulos"],
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
              <li>{t("No text on top of chart colors: values and labels stay outside the mark, always in the same text color. In heat maps, the highlight gets an outline and a sentence.", "Nenhum texto sobre a cor do gráfico: valores e rótulos ficam fora da marca, sempre na mesma cor de texto. Nos mapas de calor, o destaque vai contornado e dito numa frase.")}</li>
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
