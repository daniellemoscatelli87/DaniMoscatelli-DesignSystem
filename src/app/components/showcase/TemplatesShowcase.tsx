import React, { useState, useEffect } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  LayoutDashboard, Settings, LogIn, Bell, Users,
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Activity,
  ArrowUpRight, MoreHorizontal, Search, Filter, Plus, Check,
  ChevronRight, X, Mail, Lock, Eye, EyeOff, User,
  Home, BarChart2, Inbox, FileText, HelpCircle,
  CheckCircle, AlertCircle, Clock, Info,
  CreditCard, Zap, Building2, Star,
  Edit2, Trash2, UserPlus, Download,
  Moon, Sun, ChevronDown, Package,
  Phone, MapPin, MessageSquare, Send, AtSign,
  Globe, Sparkles, Layers, ArrowRight, PlayCircle,
  ShieldCheck, Rocket, BarChart, Layout,
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as ReTooltip,
} from "recharts";
import { useI18n } from "../../i18n";

type L = { en: string; pt: string };

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground">{description}</p>}
    </div>
  );
}

function TemplateLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-7 w-7 rounded-[8px] bg-muted flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-[0.8125rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">{label}</span>
    </div>
  );
}

/* Wraps each template in a browser-chrome frame */
function TemplateFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border border-border overflow-hidden ${className}`} style={{ boxShadow: "var(--shadow-lg)" }}>
      {/* Browser chrome */}
      <div className="h-9 bg-muted/60 border-b border-border flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
        </div>
        <div className="flex-1 mx-4">
          <div className="h-5 bg-background/70 rounded-[6px] max-w-[280px] mx-auto flex items-center px-3">
            <span className="text-[0.625rem] text-muted-foreground/60 truncate">app.danimos.co</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   1. Dashboard Template
───────────────────────────────────────────── */
const sparkData = [
  { v: 40 }, { v: 52 }, { v: 44 }, { v: 68 }, { v: 55 }, { v: 72 }, { v: 88 },
  { v: 76 }, { v: 92 }, { v: 84 }, { v: 98 }, { v: 110 },
];

const kpis = [
  { label: { en: "Total Revenue", pt: "Receita total" },    value: "$84,320",  delta: "+12.5%", up: true,  icon: DollarSign },
  { label: { en: "Active Users", pt: "Usuários ativos" },     value: "12,840",   delta: "+8.2%",  up: true,  icon: Users },
  { label: { en: "Orders", pt: "Pedidos" },           value: "3,204",    delta: "+5.1%",  up: true,  icon: ShoppingCart },
  { label: { en: "Churn Rate", pt: "Taxa de churn" },       value: "1.8%",     delta: "-0.3%",  up: false, icon: Activity },
];

const recentActivity = [
  { user: "Ana Lima",    action: { en: "purchased Pro plan", pt: "comprou o plano Pro" },   time: { en: "2m ago", pt: "há 2 min" },  status: "success" },
  { user: "Carlos M.",  action: { en: "opened a support ticket", pt: "abriu um chamado de suporte" }, time: { en: "14m ago", pt: "há 14 min" }, status: "info" },
  { user: "Beatriz S.", action: { en: "cancelled subscription", pt: "cancelou a assinatura" }, time: { en: "1h ago", pt: "há 1 h" },  status: "error" },
  { user: "Diego F.",   action: { en: "upgraded to Enterprise", pt: "fez upgrade para Enterprise" }, time: { en: "3h ago", pt: "há 3 h" },  status: "success" },
  { user: "Fernanda P.",action: { en: "submitted a review",    pt: "enviou uma avaliação" }, time: { en: "5h ago", pt: "há 5 h" },  status: "warning" },
];

const statusDot: Record<string, string> = {
  success: "bg-success",
  info:    "bg-info",
  error:   "bg-primary",
  warning: "bg-warning",
};

function DashboardTemplate() {
  const { t, bi } = useI18n();
  return (
    <TemplateFrame>
      <div className="flex h-[540px] bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[188px] shrink-0 border-r border-border bg-card/50 flex flex-col py-3 px-2.5">
          <div className="flex items-center gap-2 px-2 mb-5">
            <div className="h-6 w-6 rounded-[6px] bg-primary/15 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-[0.8125rem] font-bold text-foreground">DaniMS</span>
          </div>
          {[
            { icon: LayoutDashboard, label: { en: "Dashboard", pt: "Dashboard" }, active: true  },
            { icon: BarChart2,       label: { en: "Analytics", pt: "Análises" },  active: false },
            { icon: Users,           label: { en: "Customers", pt: "Clientes" },  active: false },
            { icon: ShoppingCart,    label: { en: "Orders", pt: "Pedidos" },     active: false },
            { icon: FileText,        label: { en: "Reports", pt: "Relatórios" },     active: false },
            { icon: Settings,        label: { en: "Settings", pt: "Configurações" },   active: false },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label.en}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] text-[0.75rem] font-medium mb-0.5 w-full text-left transition-colors
                  ${item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {bi(item.label)}
              </button>
            );
          })}
          <div className="mt-auto pt-3 border-t border-border">
            <div className="flex items-center gap-2 px-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="h-3 w-3 text-primary" />
              </div>
              <div>
                <div className="text-[0.6875rem] font-semibold text-foreground leading-none">Dani M.</div>
                <div className="text-[0.625rem] text-muted-foreground">Admin</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-y-auto">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b border-border px-5 py-2.5 flex items-center justify-between">
            <div>
              <h1 className="text-[0.9375rem] font-bold text-foreground">Dashboard</h1>
              <p className="text-[0.6875rem] text-muted-foreground">{t("July 29, 2026", "29 de julho de 2026")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-7 w-7 rounded-[7px] border border-border bg-card flex items-center justify-center text-muted-foreground">
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button className="h-7 px-2.5 rounded-[7px] bg-primary text-primary-foreground text-[0.6875rem] font-semibold flex items-center gap-1">
                <Plus className="h-3 w-3" /> {t("New Report", "Novo relatório")}
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {kpis.map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label.en} className="bg-card rounded-[12px] border border-border p-3" style={{ boxShadow: "var(--shadow-xs)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.6875rem] text-muted-foreground font-medium">{bi(k.label)}</span>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="text-[1.0625rem] font-bold text-foreground mb-1">{k.value}</div>
                    <div className={`flex items-center gap-0.5 text-[0.6875rem] font-medium ${k.up ? "text-success" : "text-primary"}`}>
                      {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {k.delta} {t("vs last month", "vs. mês passado")}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chart + Activity */}
            <div className="grid grid-cols-[1fr_220px] gap-3">
              {/* Chart */}
              <div className="bg-card rounded-[12px] border border-border p-4" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[0.8125rem] font-semibold text-foreground">{t("Revenue Overview", "Visão geral da receita")}</div>
                    <div className="text-[0.6875rem] text-muted-foreground">{t("Last 12 months", "Últimos 12 meses")}</div>
                  </div>
                  <span className="text-[0.6875rem] px-2 py-0.5 rounded-full bg-success/10 text-success font-medium flex items-center gap-0.5">
                    <TrendingUp className="h-2.5 w-2.5" /> 12.5%
                  </span>
                </div>
                <div className="h-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tRevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <ReTooltip
                        contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "11px", color: "var(--popover-foreground)" }}
                        itemStyle={{ color: "var(--popover-foreground)" }}
                      />
                      <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={1.75} fill="url(#tRevGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-card rounded-[12px] border border-border p-3" style={{ boxShadow: "var(--shadow-xs)" }}>
                <div className="text-[0.8125rem] font-semibold text-foreground mb-3">{t("Recent Activity", "Atividade recente")}</div>
                <div className="space-y-2.5">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: `var(--${a.status === "error" ? "primary" : a.status})` }} />
                      <div>
                        <div className="text-[0.6875rem] font-medium text-foreground leading-tight">{a.user}</div>
                        <div className="text-[0.625rem] text-muted-foreground leading-tight">{bi(a.action)}</div>
                        <div className="text-[0.5625rem] text-muted-foreground/60 mt-0.5">{bi(a.time)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   2. Settings Template
───────────────────────────────────────────── */
function SettingsTemplate() {
  const { t, bi } = useI18n();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [darkToggle, setDarkToggle] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setDarkToggle(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const tabs = [
    { id: "profile",       label: t("Profile", "Perfil") },
    { id: "notifications", label: t("Notifications", "Notificações") },
    { id: "appearance",    label: t("Appearance", "Aparência") },
    { id: "billing",       label: t("Billing", "Cobrança") },
  ];

  return (
    <TemplateFrame>
      <div className="flex h-[520px] bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[188px] shrink-0 border-r border-border bg-card/50 py-3 px-2.5">
          <div className="flex items-center gap-2 px-2 mb-5">
            <div className="h-6 w-6 rounded-[6px] bg-primary/15 flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-[0.8125rem] font-bold text-foreground">DaniMS</span>
          </div>
          {[
            { icon: Home,     label: t("Home", "Início"),     active: false },
            { icon: Users,    label: t("Team", "Equipe"),     active: false },
            { icon: Settings, label: t("Settings", "Configurações"), active: true  },
            { icon: HelpCircle, label: t("Help", "Ajuda"),   active: false },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] text-[0.75rem] font-medium mb-0.5 w-full text-left transition-colors ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-border px-6 py-3">
            <h1 className="text-[0.9375rem] font-bold text-foreground">{t("Settings", "Configurações")}</h1>
            <p className="text-[0.6875rem] text-muted-foreground">{t("Manage your account preferences", "Gerencie as preferências da sua conta")}</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-6">
            {tabs.map(tb => (
              <button
                key={tb.id}
                onClick={() => setActiveTab(tb.id)}
                className={`px-3 py-2.5 text-[0.75rem] font-medium border-b-2 transition-colors -mb-px
                  ${activeTab === tb.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "profile" && (
              <div className="space-y-4 max-w-md">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <div className="text-[0.875rem] font-semibold text-foreground">Dani Moscatelli</div>
                    <div className="text-[0.75rem] text-muted-foreground">dani@moscatelli.co</div>
                    <button className="mt-1 text-[0.6875rem] text-primary font-medium hover:underline">{t("Change photo", "Alterar foto")}</button>
                  </div>
                </div>
                {[
                  { label: t("Full Name", "Nome completo"),    val: "Dani Moscatelli", type: "text" },
                  { label: "Email",        val: "dani@moscatelli.co", type: "email" },
                  { label: t("Job Title", "Cargo"),    val: t("Design Lead", "Líder de Design"), type: "text" },
                  { label: t("Company", "Empresa"),      val: "Moscatelli Co.", type: "text" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-[0.75rem] font-medium text-foreground mb-1">{f.label}</label>
                    <input
                      type={f.type}
                      defaultValue={f.val}
                      className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
                    />
                  </div>
                ))}
                <div className="flex justify-end pt-1">
                  <button className="h-8 px-4 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
                    {t("Save Changes", "Salvar alterações")}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-3 max-w-md">
                {[
                  { label: t("Email notifications", "Notificações por email"), desc: t("Receive updates via email", "Receba atualizações por email"), val: notifEmail, set: setNotifEmail },
                  { label: t("Push notifications", "Notificações push"),  desc: t("Receive browser push alerts", "Receba alertas push no navegador"), val: notifPush, set: setNotifPush },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-[10px] border border-border bg-card">
                    <div>
                      <div className="text-[0.8125rem] font-medium text-foreground">{item.label}</div>
                      <div className="text-[0.6875rem] text-muted-foreground">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => item.set(v => !v)}
                      className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center ${item.val ? "bg-primary" : "bg-muted-foreground/30"}`}
                      style={{ height: "22px" }}
                    >
                      <span className={`absolute h-4 w-4 rounded-full bg-white transition-all ${item.val ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-3 max-w-md">
                <div className="text-[0.8125rem] font-medium text-foreground mb-3">{t("Theme", "Tema")}</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "dark", label: t("Dark Mode", "Modo escuro"), icon: Moon,  active: darkToggle },
                    { id: "light", label: t("Light Mode", "Modo claro"), icon: Sun, active: !darkToggle },
                  ].map(th => {
                    const Icon = th.icon;
                    return (
                      <button
                        key={th.id}
                        onClick={() => {
                          const newDark = th.id === "dark";
                          document.documentElement.classList.toggle("dark", newDark);
                        }}
                        className={`p-3 rounded-[10px] border-2 flex flex-col items-center gap-2 transition-all
                          ${th.active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                      >
                        <Icon className={`h-5 w-5 ${th.active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-[0.75rem] font-medium ${th.active ? "text-primary" : "text-muted-foreground"}`}>{th.label}</span>
                        {th.active && <Check className="h-3 w-3 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-3 max-w-md">
                <div className="p-3 rounded-[10px] border border-primary/30 bg-primary/5 flex items-center justify-between">
                  <div>
                    <div className="text-[0.8125rem] font-semibold text-foreground flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-primary" /> {t("Pro Plan", "Plano Pro")}
                    </div>
                    <div className="text-[0.6875rem] text-muted-foreground">{t("$49/month · Renews Aug 1, 2026", "$49/mês · Renova em 1 de ago de 2026")}</div>
                  </div>
                  <button className="h-7 px-3 rounded-[7px] border border-border bg-card text-[0.6875rem] font-medium text-foreground">{t("Manage", "Gerenciar")}</button>
                </div>
                <div className="p-3 rounded-[10px] border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-[0.8125rem] font-medium text-foreground">•••• 4242</div>
                      <div className="text-[0.6875rem] text-muted-foreground">{t("Expires 09/27", "Expira em 09/27")}</div>
                    </div>
                  </div>
                  <button className="text-[0.6875rem] text-primary font-medium hover:underline">{t("Update", "Atualizar")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   3. Login / Auth Template
───────────────────────────────────────────── */
function AuthTemplate() {
  const { t, bi } = useI18n();
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <TemplateFrame>
      <div className="bg-background flex h-[480px] overflow-hidden">
        {/* Left decorative panel */}
        <div className="hidden md:flex w-[44%] bg-card border-r border-border flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-info/6 blur-3xl" />
          <div className="relative z-10 text-center">
            <div className="h-14 w-14 rounded-[16px] bg-primary/12 flex items-center justify-center mx-auto mb-5">
              <Zap className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-[1.125rem] font-bold text-foreground mb-2">DaniMoscatelli</h2>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed max-w-[200px]">
              {t("Premium Design System for modern SaaS applications.", "Design System premium para aplicações SaaS modernas.")}
            </p>
            <div className="mt-6 space-y-2">
              {[t("40+ Components", "Mais de 40 componentes"), t("Dark & Light Mode", "Modo escuro e claro"), t("Radix UI Powered", "Baseado em Radix UI")].map(f => (
                <div key={f} className="flex items-center gap-2 text-[0.75rem] text-muted-foreground">
                  <Check className="h-3.5 w-3.5 text-success shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-[280px]">
            {/* Toggle */}
            <div className="flex rounded-[10px] border border-border bg-muted/40 p-0.5 mb-6">
              {(["login", "signup"] as const).map(tb => (
                <button
                  key={tb}
                  onClick={() => setTab(tb)}
                  className={`flex-1 py-1.5 rounded-[8px] text-[0.75rem] font-semibold transition-all
                    ${tab === tb ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {tb === "login" ? t("Sign In", "Entrar") : t("Sign Up", "Cadastrar")}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <h1 className="text-[1.125rem] font-bold text-foreground">
                {tab === "login" ? t("Welcome back", "Bem-vindo de volta") : t("Create account", "Criar conta")}
              </h1>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">
                {tab === "login" ? t("Sign in to your workspace", "Entre no seu workspace") : t("Get started for free", "Comece gratuitamente")}
              </p>
            </div>

            <div className="space-y-3">
              {tab === "signup" && (
                <div>
                  <label className="block text-[0.75rem] font-medium text-foreground mb-1">{t("Full Name", "Nome completo")}</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input type="text" placeholder="Dani Moscatelli" className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input type="email" placeholder="dani@moscatelli.co" className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[0.75rem] font-medium text-foreground">{t("Password", "Senha")}</label>
                  {tab === "login" && <button className="text-[0.6875rem] text-primary hover:underline">{t("Forgot?", "Esqueceu?")}</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-background border border-border rounded-[8px] pl-8 pr-8 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
                  <button onClick={() => setShowPass(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <button className="w-full h-9 rounded-[8px] bg-primary text-primary-foreground text-[0.8125rem] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 mt-1">
                <LogIn className="h-3.5 w-3.5" />
                {tab === "login" ? t("Sign In", "Entrar") : t("Create Account", "Criar conta")}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative text-center"><span className="bg-background px-2 text-[0.625rem] text-muted-foreground">{t("or continue with", "ou continue com")}</span></div>
              </div>

              <button className="w-full h-9 rounded-[8px] border border-border bg-card text-[0.8125rem] font-medium text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   4. Team Management Template
───────────────────────────────────────────── */
const teamMembers = [
  { name: "Dani Moscatelli",  email: "dani@moscatelli.co",   role: "Admin",     status: "Active",   avatar: "DM" },
  { name: "Ana Lima",         email: "ana@moscatelli.co",    role: "Editor",    status: "Active",   avatar: "AL" },
  { name: "Carlos Mendes",    email: "carlos@moscatelli.co", role: "Viewer",    status: "Inactive", avatar: "CM" },
  { name: "Beatriz Santos",   email: "beat@moscatelli.co",   role: "Editor",    status: "Active",   avatar: "BS" },
  { name: "Diego Ferreira",   email: "diego@moscatelli.co",  role: "Developer", status: "Pending",  avatar: "DF" },
  { name: "Fernanda Paiva",   email: "fer@moscatelli.co",    role: "Viewer",    status: "Active",   avatar: "FP" },
];

const roleColor: Record<string, string> = {
  Admin:     "bg-primary/10 text-primary",
  Editor:    "bg-info/10 text-info",
  Viewer:    "bg-muted text-muted-foreground",
  Developer: "bg-success/10 text-success",
};

const roleLabel: Record<string, L> = {
  Admin:     { en: "Admin", pt: "Admin" },
  Editor:    { en: "Editor", pt: "Editor" },
  Viewer:    { en: "Viewer", pt: "Leitor" },
  Developer: { en: "Developer", pt: "Desenvolvedor" },
};

const statusLabel: Record<string, L> = {
  Active:   { en: "Active", pt: "Ativo" },
  Inactive: { en: "Inactive", pt: "Inativo" },
  Pending:  { en: "Pending", pt: "Pendente" },
};

const statusColor: Record<string, string> = {
  Active:   "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending:  "bg-warning/10 text-warning border-warning/20",
};

function TeamTemplate() {
  const { t, bi } = useI18n();
  const [search, setSearch] = useState("");
  const filtered = teamMembers.filter(
    m => m.name.toLowerCase().includes(search.toLowerCase()) ||
         m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TemplateFrame>
      <div className="bg-background h-[520px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[0.9375rem] font-bold text-foreground">{t("Team Members", "Membros da equipe")}</h1>
            <p className="text-[0.6875rem] text-muted-foreground">{teamMembers.length} {t("members in your workspace", "membros no seu workspace")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
              <Download className="h-3.5 w-3.5" /> {t("Export", "Exportar")}
            </button>
            <button className="h-8 px-3 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <UserPlus className="h-3.5 w-3.5" /> {t("Invite", "Convidar")}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 flex items-center gap-3 border-b border-border shrink-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("Search members...", "Buscar membros...")}
              className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-1.5 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
            />
          </div>
          <button className="h-8 px-3 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-muted-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
            <Filter className="h-3.5 w-3.5" /> {t("Filter", "Filtrar")}
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/40 border-b border-border">
              <tr>
                {[t("Member", "Membro"), t("Role", "Função"), "Status", t("Joined", "Entrada"), ""].map((h, hi) => (
                  <th key={hi} className="text-left px-6 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.email} className={`border-b border-border hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : ""}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <span className="text-[0.5625rem] font-bold text-primary">{m.avatar}</span>
                      </div>
                      <div>
                        <div className="text-[0.8125rem] font-medium text-foreground">{m.name}</div>
                        <div className="text-[0.6875rem] text-muted-foreground">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.625rem] font-semibold ${roleColor[m.role]}`}>
                      {bi(roleLabel[m.role])}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-medium border ${statusColor[m.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                      {bi(statusLabel[m.status])}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[0.75rem] text-muted-foreground">{t("Jul 2026", "jul de 2026")}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="h-6 w-6 rounded-[6px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button className="h-6 w-6 rounded-[6px] flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Search className="h-6 w-6 mb-2 opacity-30" />
              <p className="text-[0.8125rem]">{t("No members found for", "Nenhum membro encontrado para")} "<strong className="text-foreground">{search}</strong>"</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-6 py-2.5 flex items-center justify-between shrink-0 bg-background">
          <span className="text-[0.6875rem] text-muted-foreground">{filtered.length} {t("of", "de")} {teamMembers.length} {t("results", "resultados")}</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(p => (
              <button key={p} className={`h-6 w-6 rounded-[6px] text-[0.6875rem] font-medium transition-colors ${p === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   5. Notifications / Inbox Template
───────────────────────────────────────────── */
const notifications = [
  { icon: CheckCircle, type: "success", title: { en: "Payment confirmed", pt: "Pagamento confirmado" },        body: { en: "Invoice #INV-2048 for $1,200 has been paid.", pt: "A fatura #INV-2048 de $1,200 foi paga." },            time: { en: "Just now", pt: "Agora mesmo" },   read: false },
  { icon: UserPlus,    type: "info",    title: { en: "New team member", pt: "Novo membro na equipe" },           body: { en: "Ana Lima joined your workspace as Editor.", pt: "Ana Lima entrou no seu workspace como Editora." },              time: { en: "5m ago", pt: "há 5 min" },    read: false },
  { icon: AlertCircle, type: "error",   title: { en: "Deployment failed", pt: "Falha no deploy" },         body: { en: "Build #1049 failed during the test stage.", pt: "O build #1049 falhou na etapa de testes." },              time: { en: "22m ago", pt: "há 22 min" },   read: false },
  { icon: Bell,        type: "warning", title: { en: "Usage limit approaching", pt: "Limite de uso próximo" },   body: { en: "You've used 87% of your monthly API quota.", pt: "Você usou 87% da sua cota mensal de API." },             time: { en: "1h ago", pt: "há 1 h" },    read: true  },
  { icon: Clock,       type: "info",    title: { en: "Scheduled maintenance", pt: "Manutenção programada" },     body: { en: "Planned downtime Sunday Jul 30 from 02:00–04:00 UTC.", pt: "Indisponibilidade planejada no domingo, 30 de jul, das 02:00 às 04:00 UTC." },   time: { en: "3h ago", pt: "há 3 h" },    read: true  },
  { icon: Info,        type: "info",    title: { en: "New feature: Templates", pt: "Novo recurso: Templates" },    body: { en: "Check out the new templates section in the Design System.", pt: "Conheça a nova seção de templates no Design System." }, time: { en: "Yesterday", pt: "Ontem" }, read: true  },
  { icon: Star,        type: "warning", title: { en: "Review requested", pt: "Revisão solicitada" },          body: { en: "Diego F. requested a review on PR #204.", pt: "Diego F. pediu uma revisão no PR #204." },               time: { en: "2d ago", pt: "há 2 dias" },    read: true  },
];

const notifColor: Record<string, string> = {
  success: "text-success bg-success/10",
  info:    "text-info bg-info/10",
  error:   "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
};

function InboxTemplate() {
  const { t, bi } = useI18n();
  const [selected, setSelected] = useState<number | null>(0);
  const [items, setItems] = useState(notifications.map((n, i) => ({ ...n, id: i })));

  const markRead = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const unread = items.filter(n => !n.read).length;

  return (
    <TemplateFrame>
      <div className="flex h-[520px] bg-background overflow-hidden">
        {/* List */}
        <div className="w-[260px] shrink-0 border-r border-border flex flex-col">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-[0.875rem] font-bold text-foreground flex items-center gap-2">
                {t("Inbox", "Caixa de entrada")}
                {unread > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[0.5625rem] font-bold">{unread}</span>
                )}
              </h1>
            </div>
            <button className="h-6 w-6 rounded-[6px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {items.map(n => {
              const Icon = n.icon;
              return (
                <button
                  key={n.id}
                  onClick={() => { setSelected(n.id); markRead(n.id); }}
                  className={`w-full text-left px-4 py-3 border-b border-border transition-colors flex gap-3
                    ${selected === n.id ? "bg-primary/5 border-l-2 border-l-primary" : "hover:bg-muted/40 border-l-2 border-l-transparent"}`}
                >
                  <div className={`h-7 w-7 rounded-[8px] flex items-center justify-center shrink-0 mt-0.5 ${notifColor[n.type]}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1 mb-0.5">
                      <span className={`text-[0.75rem] font-semibold leading-tight truncate ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {bi(n.title)}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                    </div>
                    <p className="text-[0.625rem] text-muted-foreground leading-tight line-clamp-1">{bi(n.body)}</p>
                    <span className="text-[0.5625rem] text-muted-foreground/60">{bi(n.time)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="flex-1 overflow-y-auto">
          {selected !== null ? (() => {
            const n = items.find(i => i.id === selected);
            if (!n) return null;
            const Icon = n.icon;
            return (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-[12px] flex items-center justify-center ${notifColor[n.type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-[0.9375rem] font-semibold text-foreground">{bi(n.title)}</h2>
                      <span className="text-[0.75rem] text-muted-foreground">{bi(n.time)}</span>
                    </div>
                  </div>
                  <button className="h-7 w-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-6">{bi(n.body)}</p>
                <div className="flex gap-2">
                  <button className="h-8 px-4 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
                    {t("View Details", "Ver detalhes")}
                  </button>
                  <button className="h-8 px-4 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors">
                    {t("Dismiss", "Dispensar")}
                  </button>
                </div>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Inbox className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-[0.875rem]">{t("Select a notification", "Selecione uma notificação")}</p>
            </div>
          )}
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   6. Pricing / Plans Template
───────────────────────────────────────────── */
const plans = [
  {
    name: "Starter",
    price: "Free",
    period: { en: "", pt: "" },
    desc: { en: "For freelancers and personal projects.", pt: "Para freelancers e projetos pessoais." },
    features: [
      { en: "3 projects", pt: "3 projetos" }, { en: "2 users", pt: "2 usuários" },
      { en: "1GB storage", pt: "1GB de armazenamento" }, { en: "Email support", pt: "Suporte por email" },
    ],
    cta: { en: "Get Started", pt: "Começar" },
    highlight: false,
    icon: Package,
  },
  {
    name: "Pro",
    price: "$49",
    period: { en: "/month", pt: "/mês" },
    desc: { en: "For growing teams.", pt: "Para equipes em crescimento." },
    features: [
      { en: "Unlimited projects", pt: "Projetos ilimitados" }, { en: "10 users", pt: "10 usuários" },
      { en: "50GB storage", pt: "50GB de armazenamento" }, { en: "Priority support", pt: "Suporte prioritário" },
      { en: "Advanced analytics", pt: "Análises avançadas" },
    ],
    cta: { en: "Upgrade to Pro", pt: "Fazer upgrade para Pro" },
    highlight: true,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: { en: "/month", pt: "/mês" },
    desc: { en: "For large companies.", pt: "Para grandes empresas." },
    features: [
      { en: "Everything in Pro", pt: "Tudo do Pro" }, { en: "Unlimited users", pt: "Usuários ilimitados" },
      { en: "500GB storage", pt: "500GB de armazenamento" }, { en: "99.99% SLA", pt: "SLA de 99,99%" },
      { en: "Dedicated manager", pt: "Gerente dedicado" },
    ],
    cta: { en: "Contact Sales", pt: "Falar com vendas" },
    highlight: false,
    icon: Building2,
  },
];

function PricingTemplate() {
  const { t, bi } = useI18n();
  const [annual, setAnnual] = useState(false);

  return (
    <TemplateFrame>
      <div className="bg-background min-h-[480px] p-6">
        <div className="text-center mb-6">
          <h2 className="text-[1.25rem] font-bold text-foreground mb-1">{t("Plans & Pricing", "Planos e preços")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mb-4">{t("Start for free. Scale as you grow.", "Comece grátis. Escale conforme você cresce.")}</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3">
            <span className={`text-[0.75rem] font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>{t("Monthly", "Mensal")}</span>
            <button
              onClick={() => setAnnual(v => !v)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center ${annual ? "bg-primary" : "bg-muted-foreground/30"}`}
              style={{ height: "22px" }}
            >
              <span className={`absolute h-4 w-4 rounded-full bg-white transition-all ${annual ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className={`text-[0.75rem] font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              {t("Yearly", "Anual")}
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[0.5625rem] font-bold">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {plans.map(plan => {
            const Icon = plan.icon;
            const price = annual && plan.price !== "Free"
              ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
              : plan.price === "Free" ? t("Free", "Grátis") : plan.price;
            return (
              <div
                key={plan.name}
                className={`relative rounded-[14px] border p-4 flex flex-col transition-all
                  ${plan.highlight
                    ? "border-primary/40 bg-primary/5 shadow-md"
                    : "border-border bg-card"
                  }`}
                style={{ boxShadow: plan.highlight ? "var(--shadow-md)" : "var(--shadow-xs)" }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[0.5625rem] font-bold whitespace-nowrap">
                    {t("Most Popular", "Mais popular")}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-8 w-8 rounded-[9px] flex items-center justify-center ${plan.highlight ? "bg-primary/15" : "bg-muted"}`}>
                    <Icon className={`h-4 w-4 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="text-[0.8125rem] font-bold text-foreground">{plan.name}</div>
                    <div className="text-[0.5625rem] text-muted-foreground">{bi(plan.desc)}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-[1.5rem] font-extrabold text-foreground">{price}</span>
                  <span className="text-[0.75rem] text-muted-foreground">{bi(plan.period)}</span>
                </div>
                <div className="space-y-1.5 flex-1 mb-4">
                  {plan.features.map(f => (
                    <div key={f.en} className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
                      <CheckCircle className={`h-3 w-3 shrink-0 ${plan.highlight ? "text-primary" : "text-success"}`} />
                      {bi(f)}
                    </div>
                  ))}
                </div>
                <button className={`w-full h-8 rounded-[8px] text-[0.75rem] font-semibold transition-all
                  ${plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                  }`}>
                  {bi(plan.cta)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   7. Contact Template
───────────────────────────────────────────── */
const contactChannels = [
  {
    icon: Mail,
    label: { en: "Email", pt: "Email" },
    value: "contato@danimos.co",
    desc: { en: "Response within 24h", pt: "Resposta em até 24h" },
    color: "bg-info/10 text-info",
  },
  {
    icon: Phone,
    label: { en: "Phone", pt: "Telefone" },
    value: "+55 (11) 9 9999-0000",
    desc: { en: "Mon–Fri, 9am–6pm BRT", pt: "Seg–Sex, 9h–18h BRT" },
    color: "bg-success/10 text-success",
  },
  {
    icon: MapPin,
    label: { en: "Address", pt: "Endereço" },
    value: { en: "São Paulo, SP — Brazil", pt: "São Paulo, SP — Brasil" } as string | L,
    desc: { en: "Av. Paulista, 1000", pt: "Av. Paulista, 1000" },
    color: "bg-warning/10 text-warning",
  },
];

const subjects: L[] = [
  { en: "Technical support", pt: "Suporte técnico" },
  { en: "Sales / Plans", pt: "Vendas / Planos" },
  { en: "Partnership", pt: "Parcerias" },
  { en: "Press", pt: "Imprensa" },
  { en: "Other", pt: "Outro" },
];

function ContactTemplate() {
  const { t, bi } = useI18n();
  const [sent, setSent] = useState(false);
  const [subject, setSubject] = useState("Technical support");
  const [subjectOpen, setSubjectOpen] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <TemplateFrame>
      <div className="bg-background min-h-[520px] flex flex-col md:flex-row overflow-hidden">

        {/* Left panel — info */}
        <div className="w-full md:w-[280px] shrink-0 bg-card border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-6 relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-info/6 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="h-10 w-10 rounded-[12px] bg-primary/12 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-[1rem] font-bold text-foreground mb-1">{t("Contact us", "Fale conosco")}</h2>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
              {t("Have a question, a suggestion, or want to learn more about our plans? Get in touch.", "Tem uma dúvida, uma sugestão ou quer saber mais sobre nossos planos? Entre em contato.")}
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {contactChannels.map(ch => {
              const Icon = ch.icon;
              return (
                <div key={ch.label.en} className="flex items-start gap-3 p-3 rounded-[10px] border border-border bg-background/60">
                  <div className={`h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0 ${ch.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[0.75rem] font-semibold text-foreground">{typeof ch.value === "string" ? ch.value : bi(ch.value)}</div>
                    <div className="text-[0.6875rem] text-muted-foreground">{bi(ch.desc)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social links */}
          <div className="relative z-10 mt-auto pt-4 border-t border-border">
            <p className="text-[0.6875rem] text-muted-foreground mb-3">{t("Follow us", "Siga-nos")}</p>
            <div className="flex items-center gap-2">
              {["LinkedIn", "Twitter", "GitHub"].map(s => (
                <button
                  key={s}
                  className="h-7 px-2.5 rounded-[7px] border border-border bg-background text-[0.625rem] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 p-6 overflow-y-auto">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-[1.0625rem] font-bold text-foreground mb-2">{t("Message sent!", "Mensagem enviada!")}</h3>
              <p className="text-[0.875rem] text-muted-foreground max-w-xs mb-6">
                {t("Thanks for reaching out. Our team will get back to you within 24 business hours.", "Obrigado pelo contato. Nossa equipe responderá em até 24 horas úteis.")}
              </p>
              <button
                onClick={() => setSent(false)}
                className="h-9 px-5 rounded-[10px] border border-border bg-card text-[0.875rem] font-medium text-foreground hover:bg-accent transition-colors"
              >
                {t("Send another message", "Enviar outra mensagem")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4 max-w-md">
              <div>
                <h3 className="text-[0.9375rem] font-bold text-foreground mb-0.5">{t("New message", "Nova mensagem")}</h3>
                <p className="text-[0.75rem] text-muted-foreground">{t("Fill out the form below and we will get back to you shortly.", "Preencha o formulário abaixo e retornaremos em breve.")}</p>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.75rem] font-medium text-foreground mb-1">{t("Name", "Nome")}</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      required
                      type="text"
                      placeholder={t("Your name", "Seu nome")}
                      className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[0.75rem] font-medium text-foreground mb-1">Email</label>
                  <div className="relative">
                    <AtSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      required
                      type="email"
                      placeholder={t("you@email.com", "voce@email.com")}
                      className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">
                  {t("Phone", "Telefone")} <span className="text-muted-foreground font-normal">({t("optional", "opcional")})</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="+55 (11) 9 0000-0000"
                    className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
                  />
                </div>
              </div>

              {/* Subject dropdown */}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">{t("Subject", "Assunto")}</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSubjectOpen(v => !v)}
                    className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[0.8125rem] text-foreground text-left flex items-center justify-between outline-none focus:ring-1 focus:ring-ring transition-all"
                  >
                    {bi(subjects.find(x => x.en === subject) ?? subjects[0])}
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
                  </button>
                  {subjectOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-popover border border-border rounded-[10px] py-1 shadow-lg" style={{ boxShadow: "var(--shadow-md)" }}>
                      {subjects.map(s => (
                        <button
                          key={s.en}
                          type="button"
                          onClick={() => { setSubject(s.en); setSubjectOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-[0.8125rem] transition-colors flex items-center justify-between
                            ${subject === s.en ? "text-primary font-medium bg-primary/5" : "text-foreground hover:bg-accent"}`}
                        >
                          {bi(s)}
                          {subject === s.en && <Check className="h-3 w-3 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">{t("Message", "Mensagem")}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t("Describe your question or request in detail...", "Descreva sua dúvida ou solicitação em detalhes...")}
                  className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all resize-none"
                />
              </div>

              {/* Consent */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  id="consent"
                  className="mt-0.5 h-3.5 w-3.5 rounded accent-[var(--primary)] shrink-0"
                />
                <label htmlFor="consent" className="text-[0.6875rem] text-muted-foreground leading-snug cursor-pointer">
                  {t("I agree to the ", "Concordo com os ")}<span className="text-primary underline underline-offset-2 cursor-pointer">{t("Terms of Use", "Termos de Uso")}</span>{t(" and ", " e a ")}<span className="text-primary underline underline-offset-2 cursor-pointer">{t("Privacy Policy", "Política de Privacidade")}</span>.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                {t("Send message", "Enviar mensagem")}
              </button>
            </form>
          )}
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export function TemplatesShowcase() {
  const { t, bi } = useI18n();
  return (
    <div className="space-y-16">
      <div className="mb-2">
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{t("Templates", "Templates")}</h2>
        <p className="text-[0.9375rem] text-muted-foreground">
          {t("Ready-to-use layouts that combine design system components into real product screens.", "Layouts prontos para usar que combinam componentes do design system em telas reais de produto.")}
        </p>
      </div>

      {/* 1 — Dashboard */}
      <section id="template-dashboard">
        <TemplateLabel icon={LayoutDashboard} label="Dashboard" />
        <DashboardTemplate />
      </section>

      {/* 2 — Settings */}
      <section id="template-settings">
        <TemplateLabel icon={Settings} label={t("Settings Page", "Página de configurações")} />
        <SettingsTemplate />
      </section>

      {/* 3 — Auth */}
      <section id="template-auth">
        <TemplateLabel icon={LogIn} label={t("Authentication", "Autenticação")} />
        <AuthTemplate />
      </section>

      {/* 4 — Team */}
      <section id="template-team">
        <TemplateLabel icon={Users} label={t("Team Management", "Gestão de equipe")} />
        <TeamTemplate />
      </section>

      {/* 5 — Inbox */}
      <section id="template-inbox">
        <TemplateLabel icon={Inbox} label={t("Notifications / Inbox", "Notificações / Caixa de entrada")} />
        <InboxTemplate />
      </section>

      {/* 6 — Pricing */}
      <section id="template-pricing">
        <TemplateLabel icon={CreditCard} label={t("Pricing & Plans", "Preços e planos")} />
        <PricingTemplate />
      </section>

      {/* 7 — Contact */}
      <section id="template-contact">
        <TemplateLabel icon={MessageSquare} label={t("Contact", "Contato")} />
        <ContactTemplate />
      </section>

      {/* 8 — Landing Page */}
      <section id="template-landing">
        <TemplateLabel icon={Layout} label="Landing Page" />
        <LandingTemplate />
      </section>

      {/* ── Tokens ── */}
      <section id="templates-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("Core CSS custom properties shared across all templates.", "Propriedades CSS personalizadas principais compartilhadas por todos os templates.")}</p>
        </div>
        <TokenTable groups={templatesTokenGroups(t)} />
      </section>
    </div>
  );
}

const templatesTokenGroups = (t: (en: string, pt: string) => string): TokenGroup[] => [
  {
    group: t("Layout Background", "Fundo do layout"),
    tokens: [
      { name: "--background",      description: t("Page / app shell background", "Fundo da página / estrutura do app"),  light: "#ECF0F5",              dark: "#0D1119",              isColor: true },
      { name: "--foreground",      description: t("Default body text", "Texto padrão do corpo"),             light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--muted-foreground",description: t("Subdued labels and captions", "Rótulos e legendas discretos"),   light: "#627288",              dark: "#8898B0",              isColor: true },
    ],
  },
  {
    group: t("Sidebar", "Barra lateral"),
    tokens: [
      { name: "--sidebar",                   description: t("Sidebar panel background", "Fundo do painel da barra lateral"),      light: "#FFFFFF",              dark: "rgba(13,17,25,0.97)",  isColor: true },
      { name: "--sidebar-foreground",        description: t("Sidebar text", "Texto da barra lateral"),                  light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--sidebar-primary",           description: t("Active nav item", "Item de navegação ativo"),               light: "#D44D4D",              dark: "#D44D4D",              isColor: true },
      { name: "--sidebar-primary-foreground",description: t("Text on active nav item", "Texto no item de navegação ativo"),       light: "#FFFFFF",              dark: "#FFFFFF",              isColor: true },
      { name: "--sidebar-accent",            description: t("Nav hover background", "Fundo de hover da navegação"),          light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--sidebar-border",            description: t("Sidebar separator", "Separador da barra lateral"),             light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.06)", isColor: true },
    ],
  },
  {
    group: t("Card & Section Surfaces", "Superfícies de cards e seções"),
    tokens: [
      { name: "--card",            description: t("Content card background", "Fundo do card de conteúdo"),       light: "#FFFFFF",             dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--card-foreground", description: t("Card body text", "Texto do corpo do card"),                light: "#131A27",             dark: "#E4E9F0",             isColor: true },
      { name: "--border",          description: t("Section divider", "Divisor de seção"),               light: "rgba(19,26,39,0.09)",dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--muted",           description: t("Subtle row / alternate bg", "Linha sutil / fundo alternado"),    light: "#E8EDF3",             dark: "rgba(40,48,67,0.60)", isColor: true },
    ],
  },
  {
    group: t("Brand & CTA", "Marca e CTA"),
    tokens: [
      { name: "--primary",            description: t("Primary CTA button / link", "Botão / link CTA primário"),  light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-foreground", description: t("Text on CTA", "Texto sobre o CTA"),               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--primary-muted",      description: t("Tinted CTA zone", "Área de CTA com tom"),           light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
    ],
  },
  {
    group: t("Elevation", "Elevação"),
    tokens: [
      { name: "--shadow-sm", description: t("Card lift", "Elevação do card"),                light: "0 1px 3px …" },
      { name: "--shadow",    description: t("Section container shadow", "Sombra do container de seção"), light: "0 2px 6px …" },
      { name: "--shadow-lg", description: t("Hero / modal shadow", "Sombra de hero / modal"),     light: "0 8px 24px …" },
    ],
  },
  {
    group: t("Shape", "Forma"),
    tokens: [
      { name: "--radius",    description: t("Default border radius", "Raio de borda padrão"), light: "0.75rem" },
      { name: "--radius-lg", description: t("Cards and panels", "Cards e painéis"),      light: "calc(0.75rem + 4px)" },
      { name: "--radius-xl", description: t("Hero sections", "Seções hero"),         light: "calc(0.75rem + 12px)" },
    ],
  },
];

/* ─────────────────────────────────────────────
   8. Landing Page Template — Full SaaS
───────────────────────────────────────────── */
const landingFeatures = [
  { icon: Zap,         title: "Extreme speed",    desc: "Responses in under 50ms with globally distributed edge infrastructure." },
  { icon: ShieldCheck, title: "Enterprise security",  desc: "End-to-end encryption, SSO and SOC 2 Type II compliance out of the box." },
  { icon: BarChart,    title: "Real-time analytics", desc: "Live dashboards with drill-down to the individual session level." },
  { icon: Layers,      title: "Native integrations",   desc: "Connect with Slack, Notion, HubSpot and 200+ tools in one click." },
  { icon: Globe,       title: "Global presence",       desc: "20 CDN regions ensure minimal latency for users in any country." },
  { icon: Sparkles,    title: "Built-in AI",          desc: "Proactive suggestions and smart automations that learn from your workflow." },
];

const testimonials = [
  { name: "Ana Lima",      role: "CTO @ Fintech BR",     text: "We cut our time-to-market by 60% after migrating to the platform.", avatar: "AL" },
  { name: "Carlos Mendes", role: "Head of Growth @ SaaS", text: "The analytics dashboard changed how we make product decisions.",  avatar: "CM" },
  { name: "Beatriz S.",    role: "Engineering Manager",   text: "Set up in minutes, scales to millions of users with zero friction.",   avatar: "BS" },
];

const landingStats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "50ms",   label: "P99 Latency" },
  { value: "12k+",   label: "Active customers" },
  { value: "200+",   label: "Integrations" },
];

/* ── extra data ── */
const revenueData = [
  { m: "Jan", mp: "Jan", v: 38 }, { m: "Feb", mp: "Fev", v: 52 }, { m: "Mar", mp: "Mar", v: 47 },
  { m: "Apr", mp: "Abr", v: 68 }, { m: "May", mp: "Mai", v: 61 }, { m: "Jun", mp: "Jun", v: 80 },
  { m: "Jul", mp: "Jul", v: 74 }, { m: "Aug", mp: "Ago", v: 93 }, { m: "Sep", mp: "Set", v: 87 },
  { m: "Oct", mp: "Out", v: 105 },{ m: "Nov", mp: "Nov", v: 118 },{ m: "Dec", mp: "Dez", v: 134 },
];

const allTestimonials = [
  { name: "Ana Lima",       role: { en: "CTO @ Fintech BR", pt: "CTO @ Fintech BR" },      text: { en: "We cut our time-to-market by 60%. We would never go back to separate tools.", pt: "Reduzimos nosso time-to-market em 60%. Nunca voltaríamos a usar ferramentas separadas." }, avatar: "AL", stars: 5 },
  { name: "Carlos Mendes",  role: { en: "Head of Growth", pt: "Head de Growth" },         text: { en: "The analytics dashboard changed how we make product decisions. Total clarity.", pt: "O dashboard de análises mudou a forma como tomamos decisões de produto. Clareza total." },  avatar: "CM", stars: 5 },
  { name: "Beatriz Santos", role: { en: "Engineering Manager", pt: "Gerente de Engenharia" },    text: { en: "Set up in minutes, scales to millions of users with zero friction. Impressive.", pt: "Configurado em minutos, escala para milhões de usuários sem atrito. Impressionante." },   avatar: "BS", stars: 5 },
  { name: "Diego Ferreira", role: { en: "Founder @ Startup SP", pt: "Fundador @ Startup SP" },   text: { en: "The only platform that delivered on its promise. Positive ROI in under 30 days.", pt: "A única plataforma que cumpriu o que prometeu. ROI positivo em menos de 30 dias." },    avatar: "DF", stars: 5 },
  { name: "Fernanda Paiva", role: { en: "CPO @ ScaleUp", pt: "CPO @ ScaleUp" },          text: { en: "Flawless design, exceptional support and APIs any dev loves working with.", pt: "Design impecável, suporte excepcional e APIs com as quais qualquer dev adora trabalhar." },           avatar: "FP", stars: 5 },
];

const roadmapItems = [
  { date: "Q1 2026", label: { en: "Launch", pt: "Lançamento" },     desc: { en: "Core platform with dashboard, analytics and basic integrations.", pt: "Plataforma principal com dashboard, análises e integrações básicas." },    done: true  },
  { date: "Q2 2026", label: { en: "AI & Automation", pt: "IA e automação" }, desc: { en: "Proactive suggestion engine and natural-language automations.", pt: "Motor de sugestões proativas e automações em linguagem natural." },    done: true  },
  { date: "Q3 2026", label: { en: "Enterprise", pt: "Enterprise" },     desc: { en: "SSO, advanced RBAC, 99.99% SLA and dedicated account manager.", pt: "SSO, RBAC avançado, SLA de 99,99% e gerente de conta dedicado." },        done: false },
  { date: "Q4 2026", label: { en: "Global Edge", pt: "Edge global" },    desc: { en: "Expansion to 20 CDN regions and GDPR + SOC 2 compliance.", pt: "Expansão para 20 regiões de CDN e conformidade com GDPR + SOC 2." },          done: false },
];

const faqItems = [
  { q: { en: "Do I need a credit card to get started?", pt: "Preciso de cartão de crédito para começar?" },   a: { en: "No. The Starter plan is free forever, no card required. You only enter payment details when you upgrade.", pt: "Não. O plano Starter é gratuito para sempre, sem cartão. Você só informa os dados de pagamento ao fazer upgrade." } },
  { q: { en: "Can I cancel at any time?", pt: "Posso cancelar a qualquer momento?" },            a: { en: "Yes. Cancel with one click in the settings panel. No fees, no red tape. Access stays active until the end of the paid period.", pt: "Sim. Cancele com um clique no painel de configurações. Sem taxas, sem burocracia. O acesso continua ativo até o fim do período pago." } },
  { q: { en: "How does data migration work?", pt: "Como funciona a migração de dados?" },            a: { en: "We offer automatic CSV import, direct connections to Notion, Airtable and Google Sheets, plus dedicated support for enterprise migrations.", pt: "Oferecemos importação automática de CSV, conexões diretas com Notion, Airtable e Google Sheets, além de suporte dedicado para migrações enterprise." } },
  { q: { en: "Does the platform scale with my growth?", pt: "A plataforma escala junto com o meu crescimento?" },      a: { en: "Yes. Our serverless infrastructure adjusts resources automatically — from 10 to 10 million users with no reconfiguration.", pt: "Sim. Nossa infraestrutura serverless ajusta os recursos automaticamente — de 10 a 10 milhões de usuários, sem reconfiguração." } },
  { q: { en: "Do you offer support in Portuguese?", pt: "Vocês oferecem suporte em português?" },               a: { en: "Yes. PT-BR support via chat, email and, on Pro+ plans, by phone and video call during business hours.", pt: "Sim. Suporte em PT-BR por chat, email e, nos planos Pro+, por telefone e videochamada em horário comercial." } },
];

type Cell = string | L;
const comparisonPlans: { feature: Cell; starter: Cell; pro: Cell; enterprise: Cell }[] = [
  { feature: { en: "Projects", pt: "Projetos" },        starter: "3",          pro: { en: "Unlimited", pt: "Ilimitado" },  enterprise: { en: "Unlimited", pt: "Ilimitado" }  },
  { feature: { en: "Users", pt: "Usuários" },        starter: "2",          pro: "10",          enterprise: { en: "Unlimited", pt: "Ilimitado" }  },
  { feature: { en: "Storage", pt: "Armazenamento" },   starter: "1 GB",       pro: "50 GB",       enterprise: "500 GB"      },
  { feature: { en: "Analytics", pt: "Análises" },       starter: { en: "Basic", pt: "Básico" },     pro: { en: "Advanced", pt: "Avançado" },    enterprise: { en: "Custom", pt: "Personalizado" }      },
  { feature: { en: "AI & Automation", pt: "IA e automação" },  starter: "—",          pro: "✓",           enterprise: { en: "✓ + Custom", pt: "✓ + Personalizado" }  },
  { feature: "SSO / SAML",      starter: "—",          pro: "—",           enterprise: "✓"           },
  { feature: "SLA",             starter: "—",          pro: "99.9%",       enterprise: "99.99%"      },
  { feature: { en: "Support", pt: "Suporte" },         starter: "Email",      pro: { en: "Priority", pt: "Prioritário" }, enterprise: { en: "Dedicated", pt: "Dedicado" }    },
];


function LandingTemplate() {
  const { t, bi, lang } = useI18n();
  const cell = (v: string | L) => (typeof v === "string" ? v : bi(v));
  const revData = revenueData.map(d => ({ ...d, m: lang === "pt" ? d.mp : d.m }));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [contactSent, setContactSent] = useState(false);

  const prevSlide = () => setSlide(s => (s - 1 + allTestimonials.length) % allTestimonials.length);
  const nextSlide = () => setSlide(s => (s + 1) % allTestimonials.length);
  const visibleTestimonials = [
    allTestimonials[slide % allTestimonials.length],
    allTestimonials[(slide + 1) % allTestimonials.length],
    allTestimonials[(slide + 2) % allTestimonials.length],
  ];

  return (
    <TemplateFrame>
      <div className="bg-background overflow-y-auto" style={{ maxHeight: 720 }}>

        {/* ══ NAVBAR ══ */}
        <nav className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-[8px] bg-primary/15 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[0.875rem] font-extrabold text-foreground tracking-tight">DaniMS</span>
          </div>
          <div className="flex items-center gap-4">
            {[t("Product", "Produto"), t("Pricing", "Preços"), "Roadmap", "Blog", t("Contact", "Contato")].map(item => (
              <button key={item} className="text-[0.75rem] font-medium text-muted-foreground hover:text-foreground transition-colors">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3 text-[0.75rem] font-medium text-muted-foreground hover:text-foreground transition-colors">{t("Sign in", "Entrar")}</button>
            <button className="h-7 px-3 rounded-[7px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
              {t("Get started free", "Comece grátis")}
            </button>
          </div>
        </nav>

        {/* ══ HERO ══ */}
        <div className="relative overflow-hidden px-6 pt-14 pb-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] rounded-full bg-primary/7 blur-3xl pointer-events-none" />
          <div className="absolute top-10 left-1/5 w-[220px] h-[220px] rounded-full bg-info/5 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-1/5 w-[180px] h-[180px] rounded-full bg-warning/4 blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/25 bg-primary/8 text-primary text-[0.6875rem] font-semibold mb-5">
              <Sparkles className="h-3 w-3" /> {t("New — Built-in AI in the dashboard", "Novo — IA integrada ao dashboard")} <ArrowRight className="h-3 w-3" />
            </div>
            <h1 className="text-[2.25rem] font-black text-foreground tracking-[-0.04em] leading-[1.1] mb-4">
              {t("The SaaS platform that", "A plataforma SaaS que")}<br/>
              <span style={{ color: "var(--primary)" }}>{t("accelerates your growth", "acelera o seu crescimento")}</span><br/>
              {t("for real", "de verdade")}
            </h1>
            <p className="text-[0.9375rem] text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              {t("Real-time analytics, smart AI automations and enterprise infrastructure — all in one premium dashboard your team will love.", "Análises em tempo real, automações inteligentes com IA e infraestrutura enterprise — tudo em um dashboard premium que sua equipe vai adorar.")}
            </p>
            <div className="flex items-center justify-center gap-3 mb-5">
              {subscribed ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-success/10 border border-success/20 text-success text-[0.8125rem] font-medium">
                  <CheckCircle className="h-4 w-4" /> {t("Great! We will be in touch soon.", "Ótimo! Entraremos em contato em breve.")}
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-2 w-full max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t("you@email.com", "voce@email.com")}
                      className="w-full bg-card border border-border rounded-[9px] pl-9 pr-3 py-2.5 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
                  </div>
                  <button type="submit" className="h-10 px-4 rounded-[9px] bg-primary text-primary-foreground text-[0.8125rem] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-1.5">
                    <Rocket className="h-3.5 w-3.5" /> {t("Get started free", "Comece grátis")}
                  </button>
                </form>
              )}
            </div>
            <div className="flex items-center justify-center gap-5 text-[0.6875rem] text-muted-foreground">
              {[t("No credit card", "Sem cartão de crédito"), t("Setup in 2 minutes", "Configuração em 2 minutos"), t("Cancel anytime", "Cancele quando quiser")].map(item => (
                <span key={item} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ STATS BAR ══ */}
        <div className="border-y border-border bg-card/50 px-6 py-5">
          <div className="grid grid-cols-4 gap-0 divide-x divide-border max-w-2xl mx-auto">
            {[
              { value: "99.99%", label: t("Uptime SLA", "SLA de uptime") },
              { value: "50ms",   label: t("P99 Latency", "Latência P99") },
              { value: "12k+",   label: t("Active customers", "Clientes ativos") },
              { value: "200+",   label: t("Integrations", "Integrações") },
            ].map(s => (
              <div key={s.value} className="text-center px-4">
                <div className="text-[1.375rem] font-black text-foreground tracking-tight">{s.value}</div>
                <div className="text-[0.6875rem] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ PRODUCT MOCKUP ══ */}
        <div className="px-6 py-10">
          <div className="text-center mb-6">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("Platform", "Plataforma")}</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("Everything your team needs, in one place", "Tudo o que sua equipe precisa, em um só lugar")}</h2>
          </div>
          <div className="max-w-2xl mx-auto rounded-[16px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xl)" }}>
            <div className="h-8 bg-muted/60 border-b border-border flex items-center px-4 gap-2 shrink-0">
              <div className="flex gap-1.5"><div className="h-2 w-2 rounded-full bg-primary/50" /><div className="h-2 w-2 rounded-full bg-warning/50" /><div className="h-2 w-2 rounded-full bg-success/50" /></div>
              <div className="flex-1 mx-6"><div className="h-4 bg-background/60 rounded-[4px] max-w-[200px] mx-auto flex items-center px-2"><span className="text-[0.5rem] text-muted-foreground/50">app.danimos.co/dashboard</span></div></div>
            </div>
            <div className="p-4">
              {/* KPIs */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { label: t("MRR Revenue", "Receita MRR"),  value: "$134k", delta: "+12.5%", up: true  },
                  { label: t("Users", "Usuários"),     value: "12.8k", delta: "+8.2%",  up: true  },
                  { label: t("Conversion", "Conversão"),   value: "3.4%",  delta: "+0.5%",  up: true  },
                  { label: "Churn",        value: "1.8%",  delta: "-0.3%",  up: false },
                ].map(k => (
                  <div key={k.label} className="rounded-[9px] border border-border bg-background p-2.5">
                    <div className="text-[0.5625rem] text-muted-foreground mb-1">{k.label}</div>
                    <div className="text-[0.9375rem] font-black text-foreground leading-none">{k.value}</div>
                    <div className={`text-[0.5rem] flex items-center gap-0.5 mt-1 font-medium ${k.up ? "text-success" : "text-primary"}`}>
                      {k.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}{k.delta}
                    </div>
                  </div>
                ))}
              </div>
              {/* Chart */}
              <div className="rounded-[9px] border border-border bg-background p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.625rem] font-semibold text-foreground">{t("Revenue — last 12 months", "Receita — últimos 12 meses")}</span>
                  <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-semibold">+12.5%</span>
                </div>
                <div className="h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="lRevGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%"  stopColor="var(--primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="m" tick={{ fontSize: 8, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10, color: "var(--popover-foreground)" }} />
                      <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#lRevGrad)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Table preview */}
              <div className="rounded-[9px] border border-border bg-background overflow-hidden">
                <div className="grid grid-cols-4 gap-0 border-b border-border bg-muted/40 px-3 py-1.5">
                  {[t("Customer", "Cliente"), t("Plan", "Plano"), "MRR", "Status"].map(h => (
                    <div key={h} className="text-[0.5rem] font-semibold uppercase tracking-wide text-muted-foreground">{h}</div>
                  ))}
                </div>
                {[
                  { name: "Fintech BR",  plan: "Enterprise", mrr: "$4,200", status: t("Active", "Ativo"),   sc: "text-success" },
                  { name: "ScaleUp SP",  plan: "Pro",        mrr: "$490",   status: t("Active", "Ativo"),   sc: "text-success" },
                  { name: "StartupMVP",  plan: "Starter",    mrr: "—",      status: t("Trial", "Em teste"),   sc: "text-warning" },
                ].map(r => (
                  <div key={r.name} className="grid grid-cols-4 gap-0 px-3 py-2 border-b border-border last:border-0 items-center">
                    <div className="text-[0.625rem] font-medium text-foreground">{r.name}</div>
                    <div className="text-[0.5625rem] text-muted-foreground">{r.plan}</div>
                    <div className="text-[0.625rem] font-semibold text-foreground">{r.mrr}</div>
                    <div className={`text-[0.5625rem] font-medium ${r.sc}`}>{r.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ BENTO GRID ══ */}
        <div className="px-6 py-10 bg-card/30 border-y border-border">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("Why DaniMS", "Por que o DaniMS")}</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("Built for teams that scale fast", "Feito para equipes que crescem rápido")}</h2>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-3 grid-rows-2 gap-3" style={{ gridTemplateRows: "auto auto" }}>
            {/* Large card - spans 2 cols */}
            <div className="col-span-2 rounded-[14px] border border-border bg-card p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" />
              <div className="h-8 w-8 rounded-[10px] bg-primary/10 flex items-center justify-center mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="text-[0.875rem] font-bold text-foreground mb-1">{t("AI that works for you", "IA que trabalha para você")}</div>
              <div className="text-[0.75rem] text-muted-foreground leading-snug mb-3">{t("Proactive suggestions, natural-language automations and automatically generated reports.", "Sugestões proativas, automações em linguagem natural e relatórios gerados automaticamente.")}</div>
              <div className="flex gap-2">
                {[t("Daily summaries", "Resumos diários"), t("Smart alerts", "Alertas inteligentes"), t("Auto-tagging", "Marcação automática")].map(chip => (
                  <span key={chip} className="text-[0.5625rem] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium border border-primary/15">{chip}</span>
                ))}
              </div>
            </div>
            {/* Small card */}
            <div className="rounded-[14px] border border-border bg-card p-4 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-xs)" }}>
              <ShieldCheck className="h-5 w-5 text-success mb-2" />
              <div>
                <div className="text-[0.8125rem] font-bold text-foreground mb-1">SOC 2 Type II</div>
                <div className="text-[0.6875rem] text-muted-foreground">{t("Compliance and end-to-end encryption by default.", "Conformidade e criptografia de ponta a ponta por padrão.")}</div>
              </div>
            </div>
            {/* Small card */}
            <div className="rounded-[14px] border border-border bg-card p-4 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-xs)" }}>
              <Globe className="h-5 w-5 text-info mb-2" />
              <div>
                <div className="text-[0.8125rem] font-bold text-foreground mb-1">{t("20 CDN regions", "20 regiões de CDN")}</div>
                <div className="text-[0.6875rem] text-muted-foreground">{t("Minimal latency for users in any country.", "Latência mínima para usuários em qualquer país.")}</div>
              </div>
            </div>
            {/* Medium card - spans 2 cols */}
            <div className="col-span-2 rounded-[14px] border border-border bg-card p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-info/6 blur-2xl pointer-events-none" />
              <div className="h-8 w-8 rounded-[10px] bg-info/10 flex items-center justify-center mb-3">
                <Layers className="h-4 w-4 text-info" />
              </div>
              <div className="text-[0.875rem] font-bold text-foreground mb-1">{t("200+ Native integrations", "Mais de 200 integrações nativas")}</div>
              <div className="text-[0.75rem] text-muted-foreground leading-snug mb-3">{t("Connect with Slack, Notion, HubSpot, Stripe and more in one click. No manual setup.", "Conecte com Slack, Notion, HubSpot, Stripe e mais em um clique. Sem configuração manual.")}</div>
              <div className="flex gap-2">
                {["Slack", "Notion", "Stripe", "HubSpot", "Zapier"].map(t => (
                  <span key={t} className="text-[0.5625rem] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium border border-border">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ BAR CHART — GROWTH ══ */}
        <div className="px-6 py-10">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("Analytics", "Análises")}</p>
                <h2 className="text-[1.125rem] font-black text-foreground tracking-tight">{t("Measurable results, month by month", "Resultados mensuráveis, mês a mês")}</h2>
              </div>
              <div className="flex gap-3 text-[0.625rem] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" />{t("Revenue", "Receita")}</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info inline-block" />{t("Users (×10)", "Usuários (×10)")}</span>
              </div>
            </div>
            <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="h-[130px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={revData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <ReTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10, color: "var(--popover-foreground)" }} />
                    <Bar dataKey="v" name={t("Revenue", "Receita")} fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.9} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ══ ROADMAP TIMELINE ══ */}
        <div className="px-6 py-10 bg-card/30 border-y border-border">
          <div className="text-center mb-8">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Roadmap</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("Where we are and where we are going", "Onde estamos e para onde vamos")}</h2>
          </div>
          <div className="max-w-lg mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
            <div className="space-y-6">
              {roadmapItems.map((item, i) => (
                <div key={i} className="flex gap-4 relative">
                  {/* Dot */}
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${item.done ? "bg-primary border-primary" : "bg-card border-border"}`}>
                    {item.done
                      ? <CheckCircle className="h-4 w-4 text-white" />
                      : <Clock className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  <div className="pt-1.5 pb-2">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[0.6875rem] font-semibold text-primary">{item.date}</span>
                      {item.done && <span className="text-[0.5625rem] px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-semibold">{t("Done", "Concluído")}</span>}
                    </div>
                    <div className="text-[0.875rem] font-bold text-foreground mb-0.5">{bi(item.label)}</div>
                    <div className="text-[0.75rem] text-muted-foreground leading-snug">{bi(item.desc)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ COMPARISON TABLE ══ */}
        <div className="px-6 py-10">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("Plans", "Planos")}</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("Compare and choose your plan", "Compare e escolha seu plano")}</h2>
          </div>
          <div className="max-w-2xl mx-auto rounded-[14px] border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-border bg-muted/40">
              <div className="px-4 py-3 text-[0.6875rem] font-semibold text-muted-foreground">{t("Feature", "Recurso")}</div>
              {[
                { name: "Starter", price: t("Free", "Grátis"),   highlight: false },
                { name: "Pro",     price: t("$49/month", "$49/mês"),  highlight: true  },
                { name: "Enterprise", price: t("$199/month", "$199/mês"), highlight: false },
              ].map(p => (
                <div key={p.name} className={`px-4 py-3 text-center ${p.highlight ? "bg-primary/5" : ""}`}>
                  <div className={`text-[0.75rem] font-bold ${p.highlight ? "text-primary" : "text-foreground"}`}>{p.name}</div>
                  <div className="text-[0.6875rem] text-muted-foreground">{p.price}</div>
                </div>
              ))}
            </div>
            {/* Rows */}
            {comparisonPlans.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                <div className="px-4 py-2.5 text-[0.75rem] font-medium text-foreground">{cell(row.feature)}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-muted-foreground text-center">{cell(row.starter)}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-foreground font-medium text-center bg-primary/3">{cell(row.pro)}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-muted-foreground text-center">{cell(row.enterprise)}</div>
              </div>
            ))}
            {/* CTA row */}
            <div className="grid grid-cols-4 border-t border-border bg-muted/20 px-0 py-3">
              <div />
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] border border-border bg-card text-[0.6875rem] font-semibold text-foreground hover:bg-accent transition-colors">{t("Get started", "Começar")}</button>
              </div>
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] bg-primary text-primary-foreground text-[0.6875rem] font-semibold hover:opacity-90 transition-opacity">{t("Upgrade", "Fazer upgrade")}</button>
              </div>
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] border border-border bg-card text-[0.6875rem] font-semibold text-foreground hover:bg-accent transition-colors">{t("Talk to sales", "Falar com vendas")}</button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ TESTIMONIALS CAROUSEL ══ */}
        <div className="px-6 py-10 bg-card/30 border-y border-border">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("Testimonials", "Depoimentos")}</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("What our customers say", "O que nossos clientes dizem")}</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {visibleTestimonials.map((tm, i) => (
                <div key={`${tm.name}-${slide}-${i}`} className="p-4 rounded-[12px] border border-border bg-card" style={{ boxShadow: "var(--shadow-xs)" }}>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: tm.stars }).map((_, si) => <Star key={si} className="h-3 w-3 text-warning" />)}
                  </div>
                  <p className="text-[0.75rem] text-muted-foreground leading-snug mb-4 italic">"{bi(tm.text)}"</p>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-[0.5625rem] font-black text-primary">{tm.avatar}</span>
                    </div>
                    <div>
                      <div className="text-[0.75rem] font-bold text-foreground leading-none">{tm.name}</div>
                      <div className="text-[0.5625rem] text-muted-foreground mt-0.5">{bi(tm.role)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevSlide} className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
              <div className="flex gap-1.5">
                {allTestimonials.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide % allTestimonials.length ? "w-5 bg-primary" : "w-1.5 bg-border"}`} />
                ))}
              </div>
              <button onClick={nextSlide} className="h-8 w-8 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ══ FAQ ACCORDION ══ */}
        <div className="px-6 py-10">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">{t("FAQ", "FAQ")}</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">{t("Frequently asked questions", "Perguntas frequentes")}</h2>
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-[12px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-[0.875rem] font-semibold text-foreground pr-4">{bi(item.q)}</span>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-border mb-3" />
                    <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{bi(item.a)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ══ CONTACT / CTA FINAL ══ */}
        <div className="relative overflow-hidden border-y border-border">
          {/* Background layer */}
          <div className="absolute inset-0 bg-card/40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full bg-primary/6 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-[180px] h-[180px] rounded-full bg-info/5 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-10 w-[140px] h-[140px] rounded-full bg-warning/4 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-6 py-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary text-[0.6875rem] font-semibold mb-3">
                <MessageSquare className="h-3 w-3" /> {t("Contact", "Contato")}
              </div>
              <h2 className="text-[1.375rem] font-black text-foreground tracking-[-0.03em] mb-2">
                {t("Let's build something", "Vamos construir algo")}<br/>
                <span style={{ color: "var(--primary)" }}>{t("amazing together", "incrível juntos")}</span>
              </h2>
              <p className="text-[0.8125rem] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {t("Our team replies in under 2 hours on business days. Pick your preferred channel or fill out the form.", "Nossa equipe responde em menos de 2 horas em dias úteis. Escolha seu canal preferido ou preencha o formulário.")}
              </p>
            </div>

            {/* Contact channels row */}
            <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3 mb-8">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "contato@danimos.co",
                  badge: "< 2h",
                  badgeColor: "bg-success/10 text-success border-success/20",
                  iconBg: "bg-info/10 text-info",
                },
                {
                  icon: PlayCircle,
                  label: t("Book a demo", "Agendar demo"),
                  value: t("Calendar available", "Agenda disponível"),
                  badge: "30 min",
                  badgeColor: "bg-primary/10 text-primary border-primary/20",
                  iconBg: "bg-primary/10 text-primary",
                },
                {
                  icon: MessageSquare,
                  label: t("Live chat", "Chat ao vivo"),
                  value: t("Mon–Fri, 9am–6pm", "Seg–Sex, 9h–18h"),
                  badge: "Online",
                  badgeColor: "bg-success/10 text-success border-success/20",
                  iconBg: "bg-success/10 text-success",
                },
              ].map(ch => {
                const Icon = ch.icon;
                return (
                  <div key={ch.label} className="group relative rounded-[14px] border border-border bg-card p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer" style={{ boxShadow: "var(--shadow-xs)" }}>
                    <div className="flex items-start justify-between">
                      <div className={`h-9 w-9 rounded-[10px] flex items-center justify-center ${ch.iconBg}`}>
                        <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
                      </div>
                      <span className={`text-[0.5625rem] font-bold px-1.5 py-0.5 rounded-full border ${ch.badgeColor}`}>{ch.badge}</span>
                    </div>
                    <div>
                      <div className="text-[0.8125rem] font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{ch.label}</div>
                      <div className="text-[0.6875rem] text-muted-foreground">{ch.value}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[0.6875rem] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      {t("Access", "Acessar")} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="max-w-2xl mx-auto flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground px-2">{t("or send a message", "ou envie uma mensagem")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Main content: trust left + form right */}
            <div className="max-w-2xl mx-auto grid grid-cols-[1fr_1.6fr] gap-6 items-start">

              {/* Left — trust panel */}
              <div className="space-y-5">
                <div>
                  <div className="text-[0.875rem] font-bold text-foreground mb-1">{t("Why choose us?", "Por que nos escolher?")}</div>
                  <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                    {t("Over 12,000 teams trust DaniMS to accelerate their growth.", "Mais de 12.000 equipes confiam no DaniMS para acelerar o crescimento.")}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { icon: CheckCircle, text: t("Guaranteed response within 2h", "Resposta garantida em até 2h"),  color: "text-success" },
                    { icon: ShieldCheck, text: t("100% data protection (SOC 2)", "100% de proteção de dados (SOC 2)"), color: "text-info"    },
                    { icon: Star,        text: t("4.9★ customer satisfaction", "4,9★ de satisfação dos clientes"), color: "text-warning" },
                    { icon: Rocket,      text: t("Free guided onboarding", "Onboarding guiado gratuito"),  color: "text-primary" },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-start gap-2.5">
                        <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${item.color}`} />
                        <span className="text-[0.75rem] text-muted-foreground leading-snug">{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Testimonial snippet */}
                <div className="rounded-[12px] border border-border bg-card p-3.5" style={{ boxShadow: "var(--shadow-xs)" }}>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-2.5 w-2.5 text-warning" />)}
                  </div>
                  <p className="text-[0.6875rem] text-muted-foreground italic leading-snug mb-2.5">
                    "{t("The team replied in minutes and helped us integrate everything. Exceptional support.", "A equipe respondeu em minutos e nos ajudou a integrar tudo. Suporte excepcional.")}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-[0.4375rem] font-black text-primary">FP</span>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold text-foreground leading-none">Fernanda Paiva</div>
                      <div className="text-[0.5625rem] text-muted-foreground">CPO @ ScaleUp</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — form */}
              <div className="rounded-[16px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
                {/* Form header stripe */}
                <div className="px-5 py-4 border-b border-border bg-muted/30 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[9px] bg-primary/12 flex items-center justify-center">
                    <Send className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-[0.875rem] font-bold text-foreground">{t("Send your message", "Envie sua mensagem")}</div>
                    <div className="text-[0.6875rem] text-muted-foreground">{t("We reply within 2 business hours", "Respondemos em até 2 horas úteis")}</div>
                  </div>
                </div>

                <div className="p-5">
                  {contactSent ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                      <div className="h-14 w-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-success" />
                      </div>
                      <div>
                        <p className="text-[0.9375rem] font-bold text-foreground mb-1">{t("Message sent!", "Mensagem enviada!")}</p>
                        <p className="text-[0.75rem] text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                          {t("Our team will reply within 2 hours. Check your inbox.", "Nossa equipe responderá em até 2 horas. Confira sua caixa de entrada.")}
                        </p>
                      </div>
                      <button
                        onClick={() => setContactSent(false)}
                        className="mt-1 h-8 px-4 rounded-[8px] border border-border bg-muted text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        {t("Send another message", "Enviar outra mensagem")}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); setContactSent(true); }} className="space-y-3">
                      {/* Name + Email */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">
                            {t("Name", "Nome")} <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input required type="text" placeholder={t("Your name", "Seu nome")}
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">
                            Email <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input required type="email" placeholder={t("you@email.com", "voce@email.com")}
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Company + Phone */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">{t("Company", "Empresa")}</label>
                          <div className="relative">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input type="text" placeholder="DaniMS Co."
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">{t("Phone", "Telefone")}</label>
                          <div className="relative">
                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input type="tel" placeholder="+55 11 9 0000-0000"
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Subject chips */}
                      <div className="space-y-1.5">
                        <label className="block text-[0.6875rem] font-semibold text-foreground">{t("Subject", "Assunto")}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {[t("Support", "Suporte"), t("Sales", "Vendas"), "Demo", t("Partnership", "Parcerias"), t("Other", "Outro")].map(s => (
                            <button key={s} type="button"
                              className="px-2.5 py-1 rounded-full border border-border bg-muted text-[0.625rem] font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all">
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-1">
                        <label className="block text-[0.6875rem] font-semibold text-foreground">
                          {t("Message", "Mensagem")} <span className="text-primary">*</span>
                        </label>
                        <textarea required rows={3} placeholder={t("Describe your question or project in detail...", "Descreva sua dúvida ou projeto em detalhes...")}
                          className="w-full bg-background border border-border rounded-[8px] px-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all resize-none" />
                      </div>

                      {/* Footer: consent + submit */}
                      <div className="flex items-center justify-between gap-3 pt-0.5">
                        <label className="flex items-start gap-1.5 cursor-pointer flex-1">
                          <input type="checkbox" required className="mt-0.5 h-3 w-3 rounded accent-[var(--primary)] shrink-0" />
                          <span className="text-[0.5625rem] text-muted-foreground leading-snug">
                            {t("I agree to the ", "Concordo com os ")}<span className="text-primary underline underline-offset-1">{t("Terms", "Termos")}</span>{t(" and ", " e a ")}<span className="text-primary underline underline-offset-1">{t("Privacy", "Privacidade")}</span>
                          </span>
                        </label>
                        <button type="submit"
                          className="shrink-0 h-8 px-4 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap">
                          <Send className="h-3 w-3" /> {t("Send", "Enviar")}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <footer className="border-t border-border px-6 py-6 bg-card/20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-[6px] bg-primary/15 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-[0.875rem] font-extrabold text-foreground">DaniMS</span>
              </div>
              <div className="flex items-center gap-4">
                {[t("Product", "Produto"), t("Pricing", "Preços"), "Blog", t("Careers", "Carreiras"), t("Contact", "Contato")].map(l => (
                  <button key={l} className="text-[0.6875rem] text-muted-foreground hover:text-foreground transition-colors">{l}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[0.625rem] text-muted-foreground">© 2026 DaniMoscatelli. {t("All rights reserved.", "Todos os direitos reservados.")}</span>
              <div className="flex items-center gap-3">
                {[t("Privacy", "Privacidade"), t("Terms", "Termos"), "Cookies"].map(l => (
                  <button key={l} className="text-[0.6875rem] text-muted-foreground hover:text-foreground transition-colors">{l}</button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TemplateFrame>
  );
}
