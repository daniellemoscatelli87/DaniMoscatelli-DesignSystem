import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
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
    label: "Total Revenue",
    value: "$1,284,090",
    delta: "+18.2%",
    trend: "up",
    icon: DollarSign,
    sparkData: [42, 55, 48, 70, 63, 88, 75, 92, 110, 98, 125, 140],
  },
  {
    label: "Active Users",
    value: "42,850",
    delta: "+12.5%",
    trend: "up",
    icon: Users,
    sparkData: [30, 45, 38, 50, 55, 48, 62, 58, 72, 68, 80, 85],
  },
  {
    label: "Conversion Rate",
    value: "3.87%",
    delta: "-0.4%",
    trend: "down",
    icon: Activity,
    sparkData: [5, 4.2, 4.8, 4.5, 3.9, 4.1, 3.8, 4.0, 3.6, 3.8, 3.9, 3.87],
  },
  {
    label: "Avg. Order Value",
    value: "$298.40",
    delta: "+6.1%",
    trend: "up",
    icon: BarChart2,
    sparkData: [240, 255, 260, 248, 270, 265, 280, 272, 290, 285, 295, 298],
  },
];

const areaData = [
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

const barData = [
  { name: "Mon", value: 400 }, { name: "Tue", value: 640 }, { name: "Wed", value: 520 },
  { name: "Thu", value: 780 }, { name: "Fri", value: 890 }, { name: "Sat", value: 320 },
  { name: "Sun", value: 210 },
];

const pieData = [
  { name: "Organic", value: 42 },
  { name: "Paid",    value: 28 },
  { name: "Social",  value: 18 },
  { name: "Email",   value: 12 },
];

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

/* ── Table data ── */
const tableData = [
  { id: "USR-001", name: "Amara Nwosu",     email: "a.nwosu@company.io",    plan: "Enterprise", status: "Active",   mrr: "$2,400", joined: "Jan 12, 2024" },
  { id: "USR-002", name: "Soren Lindqvist", email: "s.lindqvist@studio.dk", plan: "Pro",        status: "Active",   mrr: "$149",   joined: "Mar 3, 2024" },
  { id: "USR-003", name: "Yuki Tanaka",     email: "y.tanaka@design.co",    plan: "Team",       status: "Inactive", mrr: "$599",   joined: "Feb 18, 2024" },
  { id: "USR-004", name: "Lila Okonkwo",    email: "l.okonkwo@fintech.ng",  plan: "Enterprise", status: "Active",   mrr: "$2,400", joined: "Dec 5, 2023" },
  { id: "USR-005", name: "Marcus Feld",     email: "m.feld@ventures.de",    plan: "Starter",    status: "Trial",    mrr: "$0",     joined: "Apr 22, 2024" },
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
        <SectionHeader title="KPI Cards" description="Key performance indicators with trend indicators and sparkline charts." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            const TrendIcon = kpi.trend === "up" ? ArrowUpRight : ArrowDownRight;
            const trendColor = kpi.trend === "up" ? "text-success" : "text-primary";
            return (
              <div key={kpi.label} className="bg-card rounded-[16px] border border-border p-5 flex flex-col gap-4" style={{ boxShadow: "var(--shadow)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[0.8125rem] font-medium text-muted-foreground mb-1">{kpi.label}</p>
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
                  <span className="text-muted-foreground font-normal ml-1">vs last month</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CHARTS ── */}
      <section id="charts">
        <SectionHeader title="Charts" description="Minimal analytics charts using thin strokes and grayscale with crimson highlights." />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Area Chart */}
          <ShowcaseCard className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[1rem] font-semibold text-foreground">Revenue Overview</h3>
                <p className="text-[0.8125rem] text-muted-foreground">Monthly revenue & user growth</p>
              </div>
              <div className="flex items-center gap-4 text-[0.75rem] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1 inline-block" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-2 inline-block" />Users</span>
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
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#gradRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="users" stroke="var(--chart-2)" strokeWidth={1.5} fill="url(#gradUsers)" name="Users" />
              </AreaChart>
            </ResponsiveContainer>
          </ShowcaseCard>

          {/* Pie Chart */}
          <ShowcaseCard>
            <div className="mb-4">
              <h3 className="text-[1rem] font-semibold text-foreground">Traffic Sources</h3>
              <p className="text-[0.8125rem] text-muted-foreground">Acquisition breakdown</p>
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
                      <span className="text-foreground">{item.name}</span>
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
              <h3 className="text-[1rem] font-semibold text-foreground">Daily Sessions</h3>
              <p className="text-[0.8125rem] text-muted-foreground">User sessions by day of week</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <RechartTooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", radius: 4 }} />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[4, 4, 0, 0]} name="Sessions" />
            </BarChart>
          </ResponsiveContainer>
        </ShowcaseCard>
      </section>

      {/* ── TABLE ── */}
      <section id="table">
        <SectionHeader title="Data Table" description="Clean, sortable data table with status badges and action menus." />
        <ShowcaseCard className="p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="text-[1rem] font-semibold text-foreground">Customers</h3>
              <p className="text-[0.8125rem] text-muted-foreground">{tableData.length} total users</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-3 text-[0.875rem] font-medium text-muted-foreground rounded-[9px] border border-border bg-card hover:bg-accent transition-colors">
                <Filter className="h-4 w-4" /> Filter
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 text-[0.875rem] font-medium text-muted-foreground rounded-[9px] border border-border bg-card hover:bg-accent transition-colors">
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    { key: "name",   label: "Customer" },
                    { key: "plan",   label: "Plan" },
                    { key: "status", label: "Status" },
                    { key: "mrr",    label: "MRR" },
                    { key: "joined", label: "Joined" },
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
                        {row.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[0.75rem] font-medium border ${statusStyles[row.status]}`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${row.status === "Active" ? "bg-success" : row.status === "Trial" ? "bg-warning" : "bg-muted-foreground"}`} />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[0.9rem] font-semibold text-foreground">{row.mrr}</td>
                    <td className="px-6 py-4 text-[0.8125rem] text-muted-foreground">{row.joined}</td>
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
            <span className="text-[0.8125rem] text-muted-foreground">Showing 1–{tableData.length} of {tableData.length}</span>
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
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">CSS custom properties used by data display components.</p>
        </div>
        <TokenTable groups={dataTokenGroups} />
      </section>
    </div>
  );
}

const dataTokenGroups: TokenGroup[] = [
  {
    group: "Chart Palette",
    tokens: [
      { name: "--chart-1", description: "Series 1 — primary crimson",    light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--chart-2", description: "Series 2 — graphite mid",       light: "#495669", dark: "#627288", isColor: true },
      { name: "--chart-3", description: "Series 3 — graphite light",     light: "#8898B0", dark: "#495669", isColor: true },
      { name: "--chart-4", description: "Series 4 — graphite lighter",   light: "#B3BDD0", dark: "#374155", isColor: true },
      { name: "--chart-5", description: "Series 5 — graphite pale",      light: "#D6DCE6", dark: "#283043", isColor: true },
    ],
  },
  {
    group: "Card & Table Surface",
    tokens: [
      { name: "--card",             description: "Card / table background",    light: "#FFFFFF",              dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--card-foreground",  description: "Primary text on card",       light: "#131A27",              dark: "#E4E9F0",             isColor: true },
      { name: "--muted",            description: "Row hover / stripe",         light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--muted-foreground", description: "Secondary cell text",        light: "#627288",              dark: "#8898B0",             isColor: true },
      { name: "--border",           description: "Table dividers",             light: "rgba(19,26,39,0.09)",  dark: "rgba(255,255,255,0.07)", isColor: true },
    ],
  },
  {
    group: "KPI Semantic",
    tokens: [
      { name: "--success",  description: "Positive delta / up trend",  light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--error",    description: "Negative delta / down trend", light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--warning",  description: "Caution / neutral trend",    light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--primary",  description: "Highlighted KPI accent",     light: "#D44D4D", dark: "#D44D4D", isColor: true },
    ],
  },
  {
    group: "Elevation",
    tokens: [
      { name: "--shadow-xs", description: "Card micro-shadow",    light: "0 1px 2px …" },
      { name: "--shadow-sm", description: "Table elevation",      light: "0 1px 3px …" },
      { name: "--shadow",    description: "Chart container lift", light: "0 2px 6px …" },
    ],
  },
];
