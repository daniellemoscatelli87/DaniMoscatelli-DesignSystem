import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { useI18n } from "../../i18n";
import { VejaEm } from "./shared/VejaEm";
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Users, DollarSign, Activity, BarChart2, ChevronUp, ChevronDown,
  ChevronsUpDown, ExternalLink, MoreHorizontal, Filter, Download,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { SectionHeader } from "./shared/SectionHeader";
import { RegraDasLinhas } from "./shared/RegraDasLinhas";
import { GradeDeCards } from "../ui/grade-de-cards";
import { Button } from "../ui/button";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { LinhaDeLista } from "../ui/linha-de-lista";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-lg border border-border p-6 ${className}`} style={{ boxShadow: "var(--shadow)" }}>
      {children}
    </div>
  );
}


function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-body-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

/* ── Metric data ── */
const kpis = [
  {
    label: "Total Revenue", pt: "Receita total",
    value: "$1,284,090",
    delta: "+18.2%",
    trend: "up",
    icon: DollarSign,
    sparkData: [42, 55, 48, 70, 63, 88, 75, 92, 110, 98, 125, 140],
  },
  {
    label: "Active Users", pt: "Usuários ativos",
    value: "42,850",
    delta: "+12.5%",
    trend: "up",
    icon: Users,
    sparkData: [30, 45, 38, 50, 55, 48, 62, 58, 72, 68, 80, 85],
  },
  {
    label: "Conversion Rate", pt: "Taxa de conversão",
    value: "3.87%",
    delta: "-0.4%",
    trend: "down",
    icon: Activity,
    sparkData: [5, 4.2, 4.8, 4.5, 3.9, 4.1, 3.8, 4.0, 3.6, 3.8, 3.9, 3.87],
  },
  {
    label: "Avg. Order Value", pt: "Ticket médio",
    value: "$298.40",
    delta: "+6.1%",
    trend: "up",
    icon: BarChart2,
    sparkData: [240, 255, 260, 248, 270, 265, 280, 272, 290, 285, 295, 298],
  },
];

const areaMonthsPt = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const barDaysPt = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const areaDataBase = [
  { month: "Jan", revenue: 42000, users: 2400 },
  { month: "Feb", revenue: 55000, users: 3200 },
  { month: "Mar", revenue: 48000, users: 2900 },
  { month: "Apr", revenue: 70000, users: 4100 },
  { month: "May", revenue: 63000, users: 3800 },
  { month: "Jun", revenue: 88000, users: 5200 },
  { month: "Jul", revenue: 75000, users: 4500 },
  { month: "Aug", revenue: 92000, users: 5600 },
  { month: "Sep", revenue: 110000, users: 6800 },
  { month: "Oct", revenue: 98000, users: 6100 },
  { month: "Nov", revenue: 125000, users: 7800 },
  { month: "Dec", revenue: 140000, users: 8900 },
];

const barDataBase = [
  { name: "Mon", value: 400 }, { name: "Tue", value: 640 }, { name: "Wed", value: 520 },
  { name: "Thu", value: 780 }, { name: "Fri", value: 890 }, { name: "Sat", value: 320 },
  { name: "Sun", value: 210 },
];

const pieData = [
  { name: "Organic", pt: "Orgânico", value: 42 },
  { name: "Paid", pt: "Pago", value: 28 },
  { name: "Social", pt: "Social", value: 18 },
  { name: "Email", pt: "E-mail", value: 12 },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

/* ── Table data ── */
const tableData = [
  { id: "USR-001", name: "Amara Nwosu",     email: "a.nwosu@company.io",    plan: "Enterprise", status: "Active",   mrr: "$2,400", joined: "Jan 12, 2024", joinedPt: "12 jan 2024" },
  { id: "USR-002", name: "Soren Lindqvist", email: "s.lindqvist@studio.dk", plan: "Pro",        status: "Active",   mrr: "$149",   joined: "Mar 3, 2024", joinedPt: "3 mar 2024" },
  { id: "USR-003", name: "Yuki Tanaka",     email: "y.tanaka@design.co",    plan: "Team",       status: "Inactive", mrr: "$599",   joined: "Feb 18, 2024", joinedPt: "18 fev 2024" },
  { id: "USR-004", name: "Lila Okonkwo",    email: "l.okonkwo@fintech.ng",  plan: "Enterprise", status: "Active",   mrr: "$2,400", joined: "Dec 5, 2023", joinedPt: "5 dez 2023" },
  { id: "USR-005", name: "Marcus Feld",     email: "m.feld@ventures.de",    plan: "Starter",    status: "Trial",    mrr: "$0",     joined: "Apr 22, 2024", joinedPt: "22 abr 2024" },
];

const tomDoStatus: Record<string, "sucesso" | "neutro" | "aviso"> = { Active: "sucesso", Inactive: "neutro", Trial: "aviso" };

type SortDir = "asc" | "desc" | null;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-md px-3 py-2 text-body-sm shadow-lg">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {typeof p.value === "number" && p.value > 1000 ? `$${(p.value/1000).toFixed(0)}K` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DataShowcase() {
  const { t } = useI18n();
  const dataTokenGroups = getDataTokenGroups(t);
  const areaData = areaDataBase.map((d, i) => ({ ...d, month: t(d.month, areaMonthsPt[i]) }));
  const barData = barDataBase.map((d, i) => ({ ...d, name: t(d.name, barDaysPt[i]) }));
  const statusPt: Record<string, string> = { Active: "Ativo", Inactive: "Inativo", Trial: "Teste" };
  const planPt: Record<string, string> = { Enterprise: "Enterprise", Pro: "Pro", Team: "Equipe", Starter: "Starter" };
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(d => d === "asc" ? "desc" : d === "desc" ? null : "asc");
      if (sortDir === "desc") setSortCol(null);
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/40" />;
    return sortDir === "asc"
      ? <ChevronUp className="h-3.5 w-3.5 text-primary-text" />
      : <ChevronDown className="h-3.5 w-3.5 text-primary-text" />;
  };

  return (
    <div className="space-y-16">

      {/* ── KPI CARDS ── */}
      <section id="kpi-cards">
        <SectionHeader title={t("KPI Cards", "Cards de KPI")} description={t("Key performance indicators with trend indicators and sparkline charts.", "Indicadores-chave de desempenho com indicadores de tendência e gráficos sparkline.")} />
        <VejaEm secao="cards" ancora="card-ia" titulo={t("KPI cards moved to Cards", "Os cards de KPI agora ficam em Cards")} texto={t("They are a card pattern (metric with chart): see them in Cards › Information architecture.", "São um padrão de card (métrica com gráfico): veja em Cards › Arquitetura de informação.")} />
      </section>

      {/* ── CHARTS ── */}
      <section id="charts">
        <SectionHeader title={t("Charts", "Gráficos")} description={t("Minimal analytics charts using thin strokes and tones of the primary crimson.", "Gráficos de analytics minimalistas, com traços finos e tons do carmim primário.")} />
        <div className="mb-4">
          <VejaEm secao="graficos" titulo={t("More charts, colors and the discovery card", "Mais gráficos, cores e o card de descoberta")} texto={t("The redesigned donut, the 10 recommended charts for intelligence and the color rule live in Charts and visualizations.", "A rosca redesenhada, os 10 gráficos recomendados para a inteligência e a regra de cor ficam em Gráficos e visualizações.")} rotuloBotao={t("See in Charts", "Ver em Gráficos")} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Area Chart */}
          <ShowcaseCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-body font-semibold text-foreground">{t("Revenue Overview", "Visão geral da receita")}</h3>
                <p className="text-body-sm text-muted-foreground">{t("Monthly revenue & user growth", "Receita mensal e crescimento de usuários")}</p>
              </div>
              <div className="flex items-center gap-4 text-label text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-1 inline-block" />{t("Revenue", "Receita")}</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-chart-6 inline-block" />{t("Users", "Usuários")}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-6)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--chart-6)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <RechartTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#gradRevenue)" name={t("Revenue", "Receita")} />
                <Area type="monotone" dataKey="users" stroke="var(--chart-6)" strokeWidth={1.5} fill="url(#gradUsers)" name={t("Users", "Usuários")} />
              </AreaChart>
            </ResponsiveContainer>
          </ShowcaseCard>

          {/* Pie Chart */}
          <ShowcaseCard>
            <div className="mb-4">
              <h3 className="text-body font-semibold text-foreground">{t("Traffic Sources", "Fontes de tráfego")}</h3>
              <p className="text-body-sm text-muted-foreground">{t("Acquisition breakdown", "Detalhamento da aquisição")}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-body-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-foreground">{t(item.name, item.pt)}</span>
                    </span>
                    <span className="font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </ShowcaseCard>
        </div>

        {/* Bar Chart */}
        <ShowcaseCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-body font-semibold text-foreground">{t("Daily Sessions", "Sessões diárias")}</h3>
              <p className="text-body-sm text-muted-foreground">{t("User sessions by day of week", "Sessões de usuários por dia da semana")}</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <RechartTooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", radius: 4 }} />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name={t("Sessions", "Sessões")} />
            </BarChart>
          </ResponsiveContainer>
        </ShowcaseCard>
      </section>

      {/* ── TABLE ── */}
      <section id="table">
        <SectionHeader title={t("Data Table", "Tabela de dados")} description={t("Clean, sortable data table with status badges and action menus.", "Tabela de dados limpa e ordenável, com badges de status e menus de ações.")} />
        {/* Card nunca rola para o lado: abaixo de 36rem, a tabela vira lista (LinhaDeLista); a partir dela, a tabela mostra
            as colunas que cabem (Entrada só a partir de 48rem) e avisa quando alguma ficou de fora. */}
        <ShowcaseCard className="@container/tabela p-0 overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border px-4 py-4 sm:px-6">
            <div className="min-w-0 flex-1">
              <h3 className="text-body font-semibold text-foreground">{t("Customers", "Clientes")}</h3>
              <p className="text-body-sm text-muted-foreground">{tableData.length} {t("total users", "usuários no total")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm"><Filter aria-hidden /> {t("Filter", "Filtrar")}</Button>
              <Button variant="outline" size="sm"><Download aria-hidden /> {t("Export", "Exportar")}</Button>
            </div>
          </div>

          <ul className="m-0 list-none p-0 @xl/tabela:hidden">
            {tableData.map(row => (
              <li key={row.id} className="border-b border-border/60 last:border-0">
                <LinhaDeLista
                  inicio={<span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-label font-semibold text-foreground">{row.name.split(" ").map(n => n[0]).join("")}</span>}
                  titulo={row.name}
                  descricao={<>{row.email}<span className="block">{t(row.plan, planPt[row.plan])} · {row.mrr}</span></>}
                  fim={
                    <span className="flex items-center gap-2">
                      <ChipDeEstado tom={tomDoStatus[row.status]}>{t(row.status, statusPt[row.status])}</ChipDeEstado>
                      <Button variant="ghost" size="icon" aria-label={t(`Actions for ${row.name}`, `Ações de ${row.name}`)}><MoreHorizontal aria-hidden /></Button>
                    </span>
                  }
                  className="px-4"
                />
              </li>
            ))}
          </ul>

          <table className="hidden w-full @xl/tabela:table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  { key: "name",   label: t("Customer", "Cliente"), cls: "" },
                  { key: "plan",   label: t("Plan", "Plano"), cls: "" },
                  { key: "status", label: "Status", cls: "" },
                  { key: "mrr",    label: "MRR", cls: "" },
                  { key: "joined", label: t("Joined", "Entrada"), cls: "hidden @3xl/tabela:table-cell" },
                ].map(col => (
                  <th key={col.key} scope="col" className={`px-4 py-3 text-left text-label font-semibold uppercase tracking-[0.06em] text-muted-foreground ${col.cls}`}>
                    <button type="button" onClick={() => handleSort(col.key)} className="inline-flex min-h-8 items-center gap-1 rounded-sm uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      {col.label}
                      <SortIcon col={col.key} />
                    </button>
                  </th>
                ))}
                <th className="w-12 px-4 py-3"><span className="sr-only">{t("Actions", "Ações")}</span></th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(row => (
                <tr key={row.id} className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-[var(--row-hover)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-label font-semibold text-foreground">{row.name.split(" ").map(n => n[0]).join("")}</span>
                      <div className="min-w-0">
                        <div className="text-body-sm font-medium text-foreground">{row.name}</div>
                        <div className="text-label text-muted-foreground [overflow-wrap:anywhere]">{row.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><ChipDeEstado tom="neutro">{t(row.plan, planPt[row.plan])}</ChipDeEstado></td>
                  <td className="px-4 py-3"><ChipDeEstado tom={tomDoStatus[row.status]}>{t(row.status, statusPt[row.status])}</ChipDeEstado></td>
                  <td className="px-4 py-3 text-body-sm font-semibold tabular-nums text-foreground">{row.mrr}</td>
                  <td className="hidden px-4 py-3 text-body-sm text-muted-foreground @3xl/tabela:table-cell">{t(row.joined, row.joinedPt)}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" aria-label={t(`Actions for ${row.name}`, `Ações de ${row.name}`)}><MoreHorizontal aria-hidden /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hidden border-t border-border px-4 py-2 text-label text-muted-foreground @xl/tabela:block @3xl/tabela:hidden">
            {t("The Joined column appears on wider screens.", "A coluna Entrada aparece em telas mais largas.")}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-6">
            <span className="text-body-sm text-muted-foreground">{t("Showing", "Exibindo")} 1–{tableData.length} {t("of", "de")} {tableData.length}</span>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                {[1, 2, 3].map(p => (
                  <PaginationItem key={p}><PaginationLink href="#" onClick={e => e.preventDefault()} isActive={p === 1}>{p}</PaginationLink></PaginationItem>
                ))}
              </PaginationContent>
            </Pagination>
          </div>
        </ShowcaseCard>
      </section>

      {/* ── LINHAS COM TAGS E AÇÕES (regras da dona do produto, 24/11/2026) ── */}
      <section id="linhas-colunas" className="scroll-mt-32">
        <SectionHeader
          title={t("Rows with tags and actions", "Linhas com tags e ações")}
          description={t(
            "Lists, tables, grids and card lists: the text never goes past the tags or actions column, and the row hover covers the whole row, square.",
            "Listas, tabelas, grades e listas de cards: o texto nunca ultrapassa a coluna de tags ou ações, e o hover cobre a linha inteira, sem cantos.",
          )}
        />
        <RegraDasLinhas />
      </section>

      {/* ── Tokens ── */}
      <section id="data-tokens" className="space-y-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold tracking-[-0.02em] text-foreground">Tokens</h2>
          <p className="text-body-sm text-muted-foreground mt-1">{t("CSS custom properties used by data display components.", "CSS custom properties usadas por componentes de exibição de dados.")}</p>
        </div>
        <TokenTable groups={dataTokenGroups} />
      </section>
    </div>
  );
}

function getDataTokenGroups(t: (en: string, pt: string) => string): TokenGroup[] {
  return [
  {
    group: t("Chart Palette", "Paleta de gráficos"),
    tokens: [
      { name: "--chart-1", description: t("Tone 1 of the chart palette — highlight: the main data point", "Tom 1 da paleta de gráficos — destaque: o dado principal"), light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--chart-2", description: t("Tone 2 of the chart palette — highlight", "Tom 2 da paleta de gráficos — destaque"), light: "#F0828B", dark: "#F0828B", isColor: true },
      { name: "--chart-3", description: t("Tone 3 of the chart palette — support and transition", "Tom 3 da paleta de gráficos — apoio e transição"), light: "#F2BDC2", dark: "#F2BDC2", isColor: true },
      { name: "--chart-4", description: t("Tone 4 of the chart palette — support and transition", "Tom 4 da paleta de gráficos — apoio e transição"), light: "#D99BA1", dark: "#D99BA1", isColor: true },
      { name: "--chart-5", description: t("Tone 5 of the chart palette — support and transition", "Tom 5 da paleta de gráficos — apoio e transição"), light: "#BFA0A3", dark: "#BFA0A3", isColor: true },
      { name: "--chart-6", description: t("Tone 6 of the chart palette — context", "Tom 6 da paleta de gráficos — contexto"), light: "#D4D7DC", dark: "#D4D7DC", isColor: true },
      { name: "--chart-7", description: t("Tone 7 of the chart palette — context; same as --chart-neutral", "Tom 7 da paleta de gráficos — contexto; igual a --chart-neutral"), light: "#EBEEF4", dark: "#EBEEF4", isColor: true },
      { name: "--chart-neutral", description: t("Other and information with no highlight (tone 7)", "Outros e informação sem destaque (tom 7)"), light: "#EBEEF4", dark: "#EBEEF4", isColor: true },
      { name: "--chart-grid", description: t("Chart grid lines", "Linhas de grade dos gráficos"), light: "#D6DCE6", dark: "#1C2333", isColor: true },
    ],
  },
  {
    group: t("Card & Table Surface", "Superfície de card e tabela"),
    tokens: [
      { name: "--card",             description: t("Card / table background", "Fundo de card / tabela"),    light: "#FFFFFF",              dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--card-foreground",  description: t("Primary text on card", "Texto principal no card"),       light: "#131A27",              dark: "#E4E9F0",             isColor: true },
      { name: "--muted",            description: t("Row hover / stripe", "Hover / zebra de linha"),         light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--muted-foreground", description: t("Secondary cell text", "Texto secundário da célula"),        light: "#627288",              dark: "#8898B0",             isColor: true },
      { name: "--border",           description: t("Table dividers", "Divisores da tabela"),             light: "rgba(19,26,39,0.09)",  dark: "rgba(255,255,255,0.07)", isColor: true },
    ],
  },
  {
    group: t("KPI Semantic", "Semântica de KPI"),
    tokens: [
      { name: "--success",  description: t("Positive delta / up trend", "Variação positiva / tendência de alta"),  light: "#388459", dark: "#22C55E", isColor: true },
      { name: "--error",    description: t("Negative delta / down trend", "Variação negativa / tendência de queda"), light: "#B82828", dark: "#E88080", isColor: true },
      { name: "--warning",  description: t("Caution / neutral trend", "Atenção / tendência neutra"),    light: "#F0A020", dark: "#F5B040", isColor: true },
      { name: "--primary",  description: t("Highlighted KPI accent", "Acento de KPI em destaque"),     light: "#D44D4D", dark: "#D44D4D", isColor: true },
    ],
  },
  {
    group: t("Elevation", "Elevação"),
    tokens: [
      { name: "--shadow-xs", description: t("Card micro-shadow", "Microssombra do card"),    light: "0 1px 2px …" },
      { name: "--shadow-sm", description: t("Table elevation", "Elevação da tabela"),      light: "0 1px 3px …" },
      { name: "--shadow",    description: t("Chart container lift", "Elevação do container de gráfico"), light: "0 2px 6px …" },
    ],
  },
];
}

/** Cards de KPI: métrica, ícone, minigráfico e tendência (usados na página Cards). */
export function CardsDeKpi() {
  const { t } = useI18n();
  return (
    <GradeDeCards className="sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
        const trendColor = kpi.trend === "up" ? "text-success-text" : "text-primary-text";
        return (
          <div key={kpi.label} className="bg-card rounded-lg border border-border p-5 flex flex-col gap-4" style={{ boxShadow: "var(--shadow)" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body-sm font-medium text-muted-foreground mb-1">{t(kpi.label, kpi.pt)}</p>
                <p className="text-h3 font-bold text-foreground tracking-[-0.025em] leading-none">{kpi.value}</p>
              </div>
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                <Icon className="h-4.5 w-4.5 text-[var(--primary-text,var(--primary))]" style={{ height: "18px", width: "18px" }} />
              </div>
            </div>
            <div className="h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={kpi.sparkData.map((v, i) => ({ v, i }))}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={kpi.trend === "up" ? "var(--chart-1)" : "var(--chart-6)"}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className={`flex items-center gap-1 text-body-sm font-semibold ${trendColor}`}>
              <TrendIcon className="h-3.5 w-3.5" />
              {kpi.delta}
              <span className="text-muted-foreground font-normal ml-1">{t("vs last month", "vs mês passado")}</span>
            </div>
          </div>
        );
      })}
    </GradeDeCards>
  );
}
