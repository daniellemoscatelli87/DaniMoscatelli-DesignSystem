import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { useI18n } from "../../i18n";
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

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-[16px] border border-border p-6 ${className}`} style={{ boxShadow: "var(--shadow)" }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground">{description}</p>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
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

const statusStyles: Record<string, string> = {
  Active:   "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Trial:    "bg-[var(--warning-muted)] text-warning border-warning/20",
};

const planStyles: Record<string, string> = {
  Enterprise: "bg-primary/10 text-primary border-primary/20",
  Pro:        "bg-info/10 text-info border-info/20",
  Team:       "bg-muted text-foreground border-border",
  Starter:    "bg-muted text-muted-foreground border-border",
};

type SortDir = "asc" | "desc" | null;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-[10px] px-3 py-2 text-[0.8125rem] shadow-lg">
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
      ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
      : <ChevronDown className="h-3.5 w-3.5 text-primary" />;
  };

  return (
    <div className="space-y-16">

      {/* ── KPI CARDS ── */}
      <section id="kpi-cards">
        <SectionHeader title={t("KPI Cards", "Cards de KPI")} description={t("Key performance indicators with trend indicators and sparkline charts.", "Indicadores-chave de desempenho com indicadores de tendência e gráficos sparkline.")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
            const trendColor = kpi.trend === "up" ? "text-success" : "text-primary";
            return (
              <div key={kpi.label} className="bg-card rounded-[16px] border border-border p-5 flex flex-col gap-4" style={{ boxShadow: "var(--shadow)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.8125rem] font-medium text-muted-foreground mb-1">{t(kpi.label, kpi.pt)}</p>
                    <p className="text-[1.625rem] font-bold text-foreground tracking-[-0.025em] leading-none">{kpi.value}</p>
                  </div>
                  <div className="h-9 w-9 rounded-[10px] bg-muted flex items-center justify-center">
                    <Icon className="h-4.5 w-4.5 text-muted-foreground" style={{ height: "18px", width: "18px" }} />
                  </div>
                </div>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kpi.sparkData.map((v, i) => ({ v, i }))}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={kpi.trend === "up" ? "var(--chart-1)" : "var(--chart-2)"}
                        strokeWidth={1.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className={`flex items-center gap-1 text-[0.8125rem] font-semibold ${trendColor}`}>
                  <TrendIcon className="h-3.5 w-3.5" />
                  {kpi.delta}
                  <span className="text-muted-foreground font-normal ml-1">{t("vs last month", "vs mês passado")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CHARTS ── */}
      <section id="charts">
        <SectionHeader title={t("Charts", "Gráficos")} description={t("Minimal analytics charts using thin strokes and grayscale with crimson highlights.", "Gráficos de analytics minimalistas, com traços finos e escala de cinza com destaques em crimson.")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Area Chart */}
          <ShowcaseCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[1rem] font-semibold text-foreground">{t("Revenue Overview", "Visão geral da receita")}</h3>
                <p className="text-[0.8125rem] text-muted-foreground">{t("Monthly revenue & user growth", "Receita mensal e crescimento de usuários")}</p>
              </div>
              <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1 inline-block" />{t("Revenue", "Receita")}</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-2 inline-block" />{t("Users", "Usuários")}</span>
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
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}K`} />
                <RechartTooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#gradRevenue)" name={t("Revenue", "Receita")} />
                <Area type="monotone" dataKey="users" stroke="var(--chart-2)" strokeWidth={1.5} fill="url(#gradUsers)" name={t("Users", "Usuários")} />
              </AreaChart>
            </ResponsiveContainer>
          </ShowcaseCard>

          {/* Pie Chart */}
          <ShowcaseCard>
            <div className="mb-4">
              <h3 className="text-[1rem] font-semibold text-foreground">{t("Traffic Sources", "Fontes de tráfego")}</h3>
              <p className="text-[0.8125rem] text-muted-foreground">{t("Acquisition breakdown", "Detalhamento da aquisição")}</p>
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
                  <div key={item.name} className="flex items-center justify-between text-[0.8125rem]">
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
              <h3 className="text-[1rem] font-semibold text-foreground">{t("Daily Sessions", "Sessões diárias")}</h3>
              <p className="text-[0.8125rem] text-muted-foreground">{t("User sessions by day of week", "Sessões de usuários por dia da semana")}</p>
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
        <ShowcaseCard className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="text-[1rem] font-semibold text-foreground">{t("Customers", "Clientes")}</h3>
              <p className="text-[0.8125rem] text-muted-foreground">{tableData.length} {t("total users", "usuários no total")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-3 text-[0.875rem] font-medium text-muted-foreground rounded-[9px] border border-border bg-card hover:bg-accent transition-colors">
                <Filter className="h-4 w-4" /> {t("Filter", "Filtrar")}
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 text-[0.875rem] font-medium text-muted-foreground rounded-[9px] border border-border bg-card hover:bg-accent transition-colors">
                <Download className="h-4 w-4" /> {t("Export", "Exportar")}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    { key: "name",   label: t("Customer", "Cliente") },
                    { key: "plan",   label: t("Plan", "Plano") },
                    { key: "status", label: "Status" },
                    { key: "mrr",    label: "MRR" },
                    { key: "joined", label: t("Joined", "Entrada") },
                  ].map(col => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground cursor-pointer select-none"
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {col.label}
                        <SortIcon col={col.key} />
                      </span>
                    </th>
                  ))}
                  <th className="px-6 py-3 w-12" />
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i === tableData.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-[0.75rem] font-semibold text-foreground shrink-0">
                          {row.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <div className="text-[0.9rem] font-medium text-foreground">{row.name}</div>
                          <div className="text-[0.75rem] text-muted-foreground">{row.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[0.75rem] font-medium border ${planStyles[row.plan]}`}>
                        {planPt[row.plan] && t(row.plan, planPt[row.plan])}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[0.75rem] font-medium border ${statusStyles[row.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${row.status === "Active" ? "bg-success" : row.status === "Trial" ? "bg-warning" : "bg-muted-foreground"}`} />
                        {t(row.status, statusPt[row.status])}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[0.9rem] font-semibold text-foreground">{row.mrr}</td>
                    <td className="px-6 py-4 text-[0.8125rem] text-muted-foreground">{t(row.joined, row.joinedPt)}</td>
                    <td className="px-6 py-4">
                      <button className="h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
            <span className="text-[0.8125rem] text-muted-foreground">{t("Showing", "Exibindo")} 1–{tableData.length} {t("of", "de")} {tableData.length}</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map(p => (
                <button key={p} className={`h-8 w-8 rounded-[8px] text-[0.875rem] font-medium transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </ShowcaseCard>
      </section>

      {/* ── Tokens ── */}
      <section id="data-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties used by data display components.", "CSS custom properties usadas por componentes de exibição de dados.")}</p>
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
      { name: "--chart-1", description: t("Series 1 — primary crimson", "Série 1 — crimson primário"),    light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--chart-2", description: t("Series 2 — graphite mid", "Série 2 — grafite médio"),       light: "#495669", dark: "#627288", isColor: true },
      { name: "--chart-3", description: t("Series 3 — graphite light", "Série 3 — grafite claro"),     light: "#8898B0", dark: "#495669", isColor: true },
      { name: "--chart-4", description: t("Series 4 — graphite lighter", "Série 4 — grafite mais claro"),   light: "#B3BDD0", dark: "#374155", isColor: true },
      { name: "--chart-5", description: t("Series 5 — graphite pale", "Série 5 — grafite pálido"),      light: "#D6DCE6", dark: "#283043", isColor: true },
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
      { name: "--success",  description: t("Positive delta / up trend", "Variação positiva / tendência de alta"),  light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--error",    description: t("Negative delta / down trend", "Variação negativa / tendência de queda"), light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--warning",  description: t("Caution / neutral trend", "Atenção / tendência neutra"),    light: "#e5a94e", dark: "#f5b320", isColor: true },
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
