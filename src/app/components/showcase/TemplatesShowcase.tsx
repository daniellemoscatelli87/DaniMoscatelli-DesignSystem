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
  { label: "Total Revenue",    value: "$84,320",  delta: "+12.5%", up: true,  icon: DollarSign },
  { label: "Active Users",     value: "12,840",   delta: "+8.2%",  up: true,  icon: Users },
  { label: "Orders",           value: "3,204",    delta: "+5.1%",  up: true,  icon: ShoppingCart },
  { label: "Churn Rate",       value: "1.8%",     delta: "-0.3%",  up: false, icon: Activity },
];

const recentActivity = [
  { user: "Ana Lima",    action: "purchased Pro plan",   time: "2m ago",  status: "success" },
  { user: "Carlos M.",  action: "opened a support ticket", time: "14m ago", status: "info" },
  { user: "Beatriz S.", action: "cancelled subscription", time: "1h ago",  status: "error" },
  { user: "Diego F.",   action: "upgraded to Enterprise", time: "3h ago",  status: "success" },
  { user: "Fernanda P.",action: "submitted a review",    time: "5h ago",  status: "warning" },
];

const statusDot: Record<string, string> = {
  success: "bg-success",
  info:    "bg-info",
  error:   "bg-primary",
  warning: "bg-warning",
};

function DashboardTemplate() {
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
            { icon: LayoutDashboard, label: "Dashboard", active: true  },
            { icon: BarChart2,       label: "Analytics",  active: false },
            { icon: Users,           label: "Customers",  active: false },
            { icon: ShoppingCart,    label: "Orders",     active: false },
            { icon: FileText,        label: "Reports",    active: false },
            { icon: Settings,        label: "Settings",   active: false },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] text-[0.75rem] font-medium mb-0.5 w-full text-left transition-colors
                  ${item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
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
              <p className="text-[0.6875rem] text-muted-foreground">July 29, 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="h-7 w-7 rounded-[7px] border border-border bg-card flex items-center justify-center text-muted-foreground">
                <Bell className="h-3.5 w-3.5" />
              </button>
              <button className="h-7 px-2.5 rounded-[7px] bg-primary text-primary-foreground text-[0.6875rem] font-semibold flex items-center gap-1">
                <Plus className="h-3 w-3" /> New Report
              </button>
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* KPIs */}
            <div className="grid grid-cols-4 gap-3">
              {kpis.map(k => {
                const Icon = k.icon;
                return (
                  <div key={k.label} className="bg-card rounded-[12px] border border-border p-3" style={{ boxShadow: "var(--shadow-xs)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[0.6875rem] text-muted-foreground font-medium">{k.label}</span>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="text-[1.0625rem] font-bold text-foreground mb-1">{k.value}</div>
                    <div className={`flex items-center gap-0.5 text-[0.6875rem] font-medium ${k.up ? "text-success" : "text-primary"}`}>
                      {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {k.delta} vs last month
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
                    <div className="text-[0.8125rem] font-semibold text-foreground">Revenue Overview</div>
                    <div className="text-[0.6875rem] text-muted-foreground">Last 12 months</div>
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
                <div className="text-[0.8125rem] font-semibold text-foreground mb-3">Recent Activity</div>
                <div className="space-y-2.5">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: `var(--${a.status === "error" ? "primary" : a.status})` }} />
                      <div>
                        <div className="text-[0.6875rem] font-medium text-foreground leading-tight">{a.user}</div>
                        <div className="text-[0.625rem] text-muted-foreground leading-tight">{a.action}</div>
                        <div className="text-[0.5625rem] text-muted-foreground/60 mt-0.5">{a.time}</div>
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
    { id: "profile",       label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "appearance",    label: "Appearance" },
    { id: "billing",       label: "Billing" },
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
            { icon: Home,     label: "Home",     active: false },
            { icon: Users,    label: "Team",     active: false },
            { icon: Settings, label: "Settings", active: true  },
            { icon: HelpCircle, label: "Help",   active: false },
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
            <h1 className="text-[0.9375rem] font-bold text-foreground">Settings</h1>
            <p className="text-[0.6875rem] text-muted-foreground">Manage your account preferences</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border px-6">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-2.5 text-[0.75rem] font-medium border-b-2 transition-colors -mb-px
                  ${activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t.label}
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
                    <button className="mt-1 text-[0.6875rem] text-primary font-medium hover:underline">Change photo</button>
                  </div>
                </div>
                {[
                  { label: "Full Name",    val: "Dani Moscatelli", type: "text" },
                  { label: "Email",        val: "dani@moscatelli.co", type: "email" },
                  { label: "Job Title",    val: "Design Lead", type: "text" },
                  { label: "Company",      val: "Moscatelli Co.", type: "text" },
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
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-3 max-w-md">
                {[
                  { label: "Email notifications", desc: "Receive updates via email", val: notifEmail, set: setNotifEmail },
                  { label: "Push notifications",  desc: "Receive browser push alerts", val: notifPush, set: setNotifPush },
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
                <div className="text-[0.8125rem] font-medium text-foreground mb-3">Theme</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Dark Mode", icon: Moon,  active: darkToggle },
                    { label: "Light Mode", icon: Sun, active: !darkToggle },
                  ].map(t => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.label}
                        onClick={() => {
                          const newDark = t.label === "Dark Mode";
                          document.documentElement.classList.toggle("dark", newDark);
                        }}
                        className={`p-3 rounded-[10px] border-2 flex flex-col items-center gap-2 transition-all
                          ${t.active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                      >
                        <Icon className={`h-5 w-5 ${t.active ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-[0.75rem] font-medium ${t.active ? "text-primary" : "text-muted-foreground"}`}>{t.label}</span>
                        {t.active && <Check className="h-3 w-3 text-primary" />}
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
                      <Star className="h-3.5 w-3.5 text-primary" /> Pro Plan
                    </div>
                    <div className="text-[0.6875rem] text-muted-foreground">$49/month · Renews Aug 1, 2026</div>
                  </div>
                  <button className="h-7 px-3 rounded-[7px] border border-border bg-card text-[0.6875rem] font-medium text-foreground">Manage</button>
                </div>
                <div className="p-3 rounded-[10px] border border-border bg-card flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-[0.8125rem] font-medium text-foreground">•••• 4242</div>
                      <div className="text-[0.6875rem] text-muted-foreground">Expires 09/27</div>
                    </div>
                  </div>
                  <button className="text-[0.6875rem] text-primary font-medium hover:underline">Update</button>
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
              Premium Design System for modern SaaS applications.
            </p>
            <div className="mt-6 space-y-2">
              {["40+ Components", "Dark & Light Mode", "Radix UI Powered"].map(f => (
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
              {(["login", "signup"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-1.5 rounded-[8px] text-[0.75rem] font-semibold transition-all
                    ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                >
                  {t === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <h1 className="text-[1.125rem] font-bold text-foreground">
                {tab === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-[0.75rem] text-muted-foreground mt-0.5">
                {tab === "login" ? "Sign in to your workspace" : "Get started for free"}
              </p>
            </div>

            <div className="space-y-3">
              {tab === "signup" && (
                <div>
                  <label className="block text-[0.75rem] font-medium text-foreground mb-1">Full Name</label>
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
                  <label className="text-[0.75rem] font-medium text-foreground">Password</label>
                  {tab === "login" && <button className="text-[0.6875rem] text-primary hover:underline">Forgot?</button>}
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
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative text-center"><span className="bg-background px-2 text-[0.625rem] text-muted-foreground">or continue with</span></div>
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

const statusColor: Record<string, string> = {
  Active:   "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-border",
  Pending:  "bg-warning/10 text-warning border-warning/20",
};

function TeamTemplate() {
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
            <h1 className="text-[0.9375rem] font-bold text-foreground">Team Members</h1>
            <p className="text-[0.6875rem] text-muted-foreground">{teamMembers.length} members in your workspace</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="h-8 px-3 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <UserPlus className="h-3.5 w-3.5" /> Invite
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
              placeholder="Search members..."
              className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-1.5 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
            />
          </div>
          <button className="h-8 px-3 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-muted-foreground flex items-center gap-1.5 hover:bg-accent transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-muted/40 border-b border-border">
              <tr>
                {["Member", "Role", "Status", "Joined", ""].map(h => (
                  <th key={h} className="text-left px-6 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">{h}</th>
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
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-medium border ${statusColor[m.status]}`}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[0.75rem] text-muted-foreground">Jul 2026</td>
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
              <p className="text-[0.8125rem]">No members found for "<strong className="text-foreground">{search}</strong>"</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-6 py-2.5 flex items-center justify-between shrink-0 bg-background">
          <span className="text-[0.6875rem] text-muted-foreground">{filtered.length} of {teamMembers.length} results</span>
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
  { icon: CheckCircle, type: "success", title: "Payment confirmed",        body: "Invoice #INV-2048 for $1,200 has been paid.",            time: "Just now",   read: false },
  { icon: UserPlus,    type: "info",    title: "New team member",           body: "Ana Lima joined your workspace as Editor.",              time: "5m ago",    read: false },
  { icon: AlertCircle, type: "error",   title: "Deployment failed",         body: "Build #1049 failed during the test stage.",              time: "22m ago",   read: false },
  { icon: Bell,        type: "warning", title: "Usage limit approaching",   body: "You've used 87% of your monthly API quota.",             time: "1h ago",    read: true  },
  { icon: Clock,       type: "info",    title: "Scheduled maintenance",     body: "Planned downtime Sunday Jul 30 from 02:00–04:00 UTC.",   time: "3h ago",    read: true  },
  { icon: Info,        type: "info",    title: "New feature: Templates",    body: "Check out the new templates section in the Design System.", time: "Yesterday", read: true  },
  { icon: Star,        type: "warning", title: "Review requested",          body: "Diego F. requested a review on PR #204.",               time: "2d ago",    read: true  },
];

const notifColor: Record<string, string> = {
  success: "text-success bg-success/10",
  info:    "text-info bg-info/10",
  error:   "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
};

function InboxTemplate() {
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
                Inbox
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
                        {n.title}
                      </span>
                      {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                    </div>
                    <p className="text-[0.625rem] text-muted-foreground leading-tight line-clamp-1">{n.body}</p>
                    <span className="text-[0.5625rem] text-muted-foreground/60">{n.time}</span>
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
                      <h2 className="text-[0.9375rem] font-semibold text-foreground">{n.title}</h2>
                      <span className="text-[0.75rem] text-muted-foreground">{n.time}</span>
                    </div>
                  </div>
                  <button className="h-7 w-7 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-6">{n.body}</p>
                <div className="flex gap-2">
                  <button className="h-8 px-4 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
                    View Details
                  </button>
                  <button className="h-8 px-4 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })() : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Inbox className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-[0.875rem]">Select a notification</p>
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
    period: "",
    desc: "For freelancers and personal projects.",
    features: ["3 projects", "2 users", "1GB storage", "Email support"],
    cta: "Get Started",
    highlight: false,
    icon: Package,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "For growing teams.",
    features: ["Unlimited projects", "10 users", "50GB storage", "Priority support", "Advanced analytics"],
    cta: "Upgrade to Pro",
    highlight: true,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/month",
    desc: "For large companies.",
    features: ["Everything in Pro", "Unlimited users", "500GB storage", "99.99% SLA", "Dedicated manager"],
    cta: "Contact Sales",
    highlight: false,
    icon: Building2,
  },
];

function PricingTemplate() {
  const [annual, setAnnual] = useState(false);

  return (
    <TemplateFrame>
      <div className="bg-background min-h-[480px] p-6">
        <div className="text-center mb-6">
          <h2 className="text-[1.25rem] font-bold text-foreground mb-1">Plans & Pricing</h2>
          <p className="text-[0.8125rem] text-muted-foreground mb-4">Start for free. Scale as you grow.</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3">
            <span className={`text-[0.75rem] font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(v => !v)}
              className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center ${annual ? "bg-primary" : "bg-muted-foreground/30"}`}
              style={{ height: "22px" }}
            >
              <span className={`absolute h-4 w-4 rounded-full bg-white transition-all ${annual ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className={`text-[0.75rem] font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[0.5625rem] font-bold">-20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {plans.map(plan => {
            const Icon = plan.icon;
            const price = annual && plan.price !== "Free"
              ? `$${Math.round(parseInt(plan.price.replace("$", "")) * 0.8)}`
              : plan.price;
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
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`h-8 w-8 rounded-[9px] flex items-center justify-center ${plan.highlight ? "bg-primary/15" : "bg-muted"}`}>
                    <Icon className={`h-4 w-4 ${plan.highlight ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="text-[0.8125rem] font-bold text-foreground">{plan.name}</div>
                    <div className="text-[0.5625rem] text-muted-foreground">{plan.desc}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-[1.5rem] font-extrabold text-foreground">{price}</span>
                  <span className="text-[0.75rem] text-muted-foreground">{plan.period}</span>
                </div>
                <div className="space-y-1.5 flex-1 mb-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
                      <CheckCircle className={`h-3 w-3 shrink-0 ${plan.highlight ? "text-primary" : "text-success"}`} />
                      {f}
                    </div>
                  ))}
                </div>
                <button className={`w-full h-8 rounded-[8px] text-[0.75rem] font-semibold transition-all
                  ${plan.highlight
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-card text-foreground hover:bg-accent"
                  }`}>
                  {plan.cta}
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
    label: "Email",
    value: "contato@danimos.co",
    desc: "Response within 24h",
    color: "bg-info/10 text-info",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+55 (11) 9 9999-0000",
    desc: "Mon–Fri, 9am–6pm BRT",
    color: "bg-success/10 text-success",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "São Paulo, SP — Brazil",
    desc: "Av. Paulista, 1000",
    color: "bg-warning/10 text-warning",
  },
];

const subjects = [
  "Technical support",
  "Sales / Plans",
  "Partnership",
  "Press",
  "Other",
];

function ContactTemplate() {
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
            <h2 className="text-[1rem] font-bold text-foreground mb-1">Contact us</h2>
            <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
              Have a question, a suggestion, or want to learn more about our plans? Get in touch.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {contactChannels.map(ch => {
              const Icon = ch.icon;
              return (
                <div key={ch.label} className="flex items-start gap-3 p-3 rounded-[10px] border border-border bg-background/60">
                  <div className={`h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0 ${ch.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[0.75rem] font-semibold text-foreground">{ch.value}</div>
                    <div className="text-[0.6875rem] text-muted-foreground">{ch.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social links */}
          <div className="relative z-10 mt-auto pt-4 border-t border-border">
            <p className="text-[0.6875rem] text-muted-foreground mb-3">Follow us</p>
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
              <h3 className="text-[1.0625rem] font-bold text-foreground mb-2">Message sent!</h3>
              <p className="text-[0.875rem] text-muted-foreground max-w-xs mb-6">
                Thanks for reaching out. Our team will get back to you within 24 business hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="h-9 px-5 rounded-[10px] border border-border bg-card text-[0.875rem] font-medium text-foreground hover:bg-accent transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4 max-w-md">
              <div>
                <h3 className="text-[0.9375rem] font-bold text-foreground mb-0.5">New message</h3>
                <p className="text-[0.75rem] text-muted-foreground">Fill out the form below and we will get back to you shortly.</p>
              </div>

              {/* Name + Email row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.75rem] font-medium text-foreground mb-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      required
                      type="text"
                      placeholder="Your name"
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
                      placeholder="you@email.com"
                      className="w-full bg-background border border-border rounded-[8px] pl-8 pr-3 py-2 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">
                  Phone <span className="text-muted-foreground font-normal">(optional)</span>
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
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">Subject</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSubjectOpen(v => !v)}
                    className="w-full bg-background border border-border rounded-[8px] px-3 py-2 text-[0.8125rem] text-foreground text-left flex items-center justify-between outline-none focus:ring-1 focus:ring-ring transition-all"
                  >
                    {subject}
                    <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${subjectOpen ? "rotate-180" : ""}`} />
                  </button>
                  {subjectOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-popover border border-border rounded-[10px] py-1 shadow-lg" style={{ boxShadow: "var(--shadow-md)" }}>
                      {subjects.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => { setSubject(s); setSubjectOpen(false); }}
                          className={`w-full text-left px-3 py-2 text-[0.8125rem] transition-colors flex items-center justify-between
                            ${subject === s ? "text-primary font-medium bg-primary/5" : "text-foreground hover:bg-accent"}`}
                        >
                          {s}
                          {subject === s && <Check className="h-3 w-3 text-primary" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[0.75rem] font-medium text-foreground mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your question or request in detail..."
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
                  I agree to the <span className="text-primary underline underline-offset-2 cursor-pointer">Terms of Use</span> and <span className="text-primary underline underline-offset-2 cursor-pointer">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send message
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
  return (
    <div className="space-y-16">
      <div className="mb-2">
        <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">Templates</h2>
        <p className="text-[0.9375rem] text-muted-foreground">
          Ready-to-use layouts that combine design system components into real product screens.
        </p>
      </div>

      {/* 1 — Dashboard */}
      <section id="template-dashboard">
        <TemplateLabel icon={LayoutDashboard} label="Dashboard" />
        <DashboardTemplate />
      </section>

      {/* 2 — Settings */}
      <section id="template-settings">
        <TemplateLabel icon={Settings} label="Settings Page" />
        <SettingsTemplate />
      </section>

      {/* 3 — Auth */}
      <section id="template-auth">
        <TemplateLabel icon={LogIn} label="Authentication" />
        <AuthTemplate />
      </section>

      {/* 4 — Team */}
      <section id="template-team">
        <TemplateLabel icon={Users} label="Team Management" />
        <TeamTemplate />
      </section>

      {/* 5 — Inbox */}
      <section id="template-inbox">
        <TemplateLabel icon={Inbox} label="Notifications / Inbox" />
        <InboxTemplate />
      </section>

      {/* 6 — Pricing */}
      <section id="template-pricing">
        <TemplateLabel icon={CreditCard} label="Pricing & Plans" />
        <PricingTemplate />
      </section>

      {/* 7 — Contact */}
      <section id="template-contact">
        <TemplateLabel icon={MessageSquare} label="Contact" />
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
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">Core CSS custom properties shared across all templates.</p>
        </div>
        <TokenTable groups={templatesTokenGroups} />
      </section>
    </div>
  );
}

const templatesTokenGroups: TokenGroup[] = [
  {
    group: "Layout Background",
    tokens: [
      { name: "--background",      description: "Page / app shell background",  light: "#ECF0F5",              dark: "#0D1119",              isColor: true },
      { name: "--foreground",      description: "Default body text",             light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--muted-foreground",description: "Subdued labels and captions",   light: "#627288",              dark: "#8898B0",              isColor: true },
    ],
  },
  {
    group: "Sidebar",
    tokens: [
      { name: "--sidebar",                   description: "Sidebar panel background",      light: "#FFFFFF",              dark: "rgba(13,17,25,0.97)",  isColor: true },
      { name: "--sidebar-foreground",        description: "Sidebar text",                  light: "#131A27",              dark: "#E4E9F0",              isColor: true },
      { name: "--sidebar-primary",           description: "Active nav item",               light: "#D44D4D",              dark: "#D44D4D",              isColor: true },
      { name: "--sidebar-primary-foreground",description: "Text on active nav item",       light: "#FFFFFF",              dark: "#FFFFFF",              isColor: true },
      { name: "--sidebar-accent",            description: "Nav hover background",          light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--sidebar-border",            description: "Sidebar separator",             light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.06)", isColor: true },
    ],
  },
  {
    group: "Card & Section Surfaces",
    tokens: [
      { name: "--card",            description: "Content card background",       light: "#FFFFFF",             dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--card-foreground", description: "Card body text",                light: "#131A27",             dark: "#E4E9F0",             isColor: true },
      { name: "--border",          description: "Section divider",               light: "rgba(19,26,39,0.09)",dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--muted",           description: "Subtle row / alternate bg",    light: "#E8EDF3",             dark: "rgba(40,48,67,0.60)", isColor: true },
    ],
  },
  {
    group: "Brand & CTA",
    tokens: [
      { name: "--primary",            description: "Primary CTA button / link",  light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-foreground", description: "Text on CTA",               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--primary-muted",      description: "Tinted CTA zone",           light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
    ],
  },
  {
    group: "Elevation",
    tokens: [
      { name: "--shadow-sm", description: "Card lift",                light: "0 1px 3px …" },
      { name: "--shadow",    description: "Section container shadow", light: "0 2px 6px …" },
      { name: "--shadow-lg", description: "Hero / modal shadow",     light: "0 8px 24px …" },
    ],
  },
  {
    group: "Shape",
    tokens: [
      { name: "--radius",    description: "Default border radius", light: "0.75rem" },
      { name: "--radius-lg", description: "Cards and panels",      light: "calc(0.75rem + 4px)" },
      { name: "--radius-xl", description: "Hero sections",         light: "calc(0.75rem + 12px)" },
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
  { m: "Jan", v: 38 }, { m: "Feb", v: 52 }, { m: "Mar", v: 47 },
  { m: "Apr", v: 68 }, { m: "May", v: 61 }, { m: "Jun", v: 80 },
  { m: "Jul", v: 74 }, { m: "Aug", v: 93 }, { m: "Sep", v: 87 },
  { m: "Oct", v: 105 },{ m: "Nov", v: 118 },{ m: "Dec", v: 134 },
];

const allTestimonials = [
  { name: "Ana Lima",       role: "CTO @ Fintech BR",      text: "We cut our time-to-market by 60%. We would never go back to separate tools.", avatar: "AL", stars: 5 },
  { name: "Carlos Mendes",  role: "Head of Growth",         text: "The analytics dashboard changed how we make product decisions. Total clarity.",  avatar: "CM", stars: 5 },
  { name: "Beatriz Santos", role: "Engineering Manager",    text: "Set up in minutes, scales to millions of users with zero friction. Impressive.",   avatar: "BS", stars: 5 },
  { name: "Diego Ferreira", role: "Founder @ Startup SP",   text: "The only platform that delivered on its promise. Positive ROI in under 30 days.",    avatar: "DF", stars: 5 },
  { name: "Fernanda Paiva", role: "CPO @ ScaleUp",          text: "Flawless design, exceptional support and APIs any dev loves working with.",           avatar: "FP", stars: 5 },
];

const roadmapItems = [
  { date: "Q1 2026", label: "Launch",     desc: "Core platform with dashboard, analytics and basic integrations.",    done: true  },
  { date: "Q2 2026", label: "AI & Automation", desc: "Proactive suggestion engine and natural-language automations.",    done: true  },
  { date: "Q3 2026", label: "Enterprise",     desc: "SSO, advanced RBAC, 99.99% SLA and dedicated account manager.",        done: false },
  { date: "Q4 2026", label: "Global Edge",    desc: "Expansion to 20 CDN regions and GDPR + SOC 2 compliance.",          done: false },
];

const faqItems = [
  { q: "Do I need a credit card to get started?",   a: "No. The Starter plan is free forever, no card required. You only enter payment details when you upgrade." },
  { q: "Can I cancel at any time?",            a: "Yes. Cancel with one click in the settings panel. No fees, no red tape. Access stays active until the end of the paid period." },
  { q: "How does data migration work?",            a: "We offer automatic CSV import, direct connections to Notion, Airtable and Google Sheets, plus dedicated support for enterprise migrations." },
  { q: "Does the platform scale with my growth?",      a: "Yes. Our serverless infrastructure adjusts resources automatically — from 10 to 10 million users with no reconfiguration." },
  { q: "Do you offer support in Portuguese?",               a: "Yes. PT-BR support via chat, email and, on Pro+ plans, by phone and video call during business hours." },
];

const comparisonPlans = [
  { feature: "Projects",        starter: "3",          pro: "Unlimited",  enterprise: "Unlimited"  },
  { feature: "Users",        starter: "2",          pro: "10",          enterprise: "Unlimited"  },
  { feature: "Storage",   starter: "1 GB",       pro: "50 GB",       enterprise: "500 GB"      },
  { feature: "Analytics",       starter: "Basic",     pro: "Advanced",    enterprise: "Custom"      },
  { feature: "AI & Automation",  starter: "—",          pro: "✓",           enterprise: "✓ + Custom"  },
  { feature: "SSO / SAML",      starter: "—",          pro: "—",           enterprise: "✓"           },
  { feature: "SLA",             starter: "—",          pro: "99.9%",       enterprise: "99.99%"      },
  { feature: "Support",         starter: "Email",      pro: "Priority", enterprise: "Dedicated"    },
];


function LandingTemplate() {
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
            {["Product", "Pricing", "Roadmap", "Blog", "Contact"].map(item => (
              <button key={item} className="text-[0.75rem] font-medium text-muted-foreground hover:text-foreground transition-colors">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3 text-[0.75rem] font-medium text-muted-foreground hover:text-foreground transition-colors">Sign in</button>
            <button className="h-7 px-3 rounded-[7px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
              Get started free
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
              <Sparkles className="h-3 w-3" /> New — Built-in AI in the dashboard <ArrowRight className="h-3 w-3" />
            </div>
            <h1 className="text-[2.25rem] font-black text-foreground tracking-[-0.04em] leading-[1.1] mb-4">
              A plataforma SaaS que<br/>
              <span style={{ color: "var(--primary)" }}>accelerates your growth</span><br/>
              for real
            </h1>
            <p className="text-[0.9375rem] text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              Real-time analytics, smart AI automations and enterprise infrastructure — all in one premium dashboard your team will love.
            </p>
            <div className="flex items-center justify-center gap-3 mb-5">
              {subscribed ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-success/10 border border-success/20 text-success text-[0.8125rem] font-medium">
                  <CheckCircle className="h-4 w-4" /> Great! We will be in touch soon.
                </div>
              ) : (
                <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-2 w-full max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"
                      className="w-full bg-card border border-border rounded-[9px] pl-9 pr-3 py-2.5 text-[0.8125rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition-all" />
                  </div>
                  <button type="submit" className="h-10 px-4 rounded-[9px] bg-primary text-primary-foreground text-[0.8125rem] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap flex items-center gap-1.5">
                    <Rocket className="h-3.5 w-3.5" /> Get started free
                  </button>
                </form>
              )}
            </div>
            <div className="flex items-center justify-center gap-5 text-[0.6875rem] text-muted-foreground">
              {["No credit card", "Setup in 2 minutes", "Cancel anytime"].map(t => (
                <span key={t} className="flex items-center gap-1.5"><Check className="h-3 w-3 text-success" />{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ STATS BAR ══ */}
        <div className="border-y border-border bg-card/50 px-6 py-5">
          <div className="grid grid-cols-4 gap-0 divide-x divide-border max-w-2xl mx-auto">
            {[
              { value: "99.99%", label: "Uptime SLA" },
              { value: "50ms",   label: "P99 Latency" },
              { value: "12k+",   label: "Active customers" },
              { value: "200+",   label: "Integrations" },
            ].map(s => (
              <div key={s.label} className="text-center px-4">
                <div className="text-[1.375rem] font-black text-foreground tracking-tight">{s.value}</div>
                <div className="text-[0.6875rem] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ PRODUCT MOCKUP ══ */}
        <div className="px-6 py-10">
          <div className="text-center mb-6">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Platform</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">Everything your team needs, in one place</h2>
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
                  { label: "MRR Revenue",  value: "$134k", delta: "+12.5%", up: true  },
                  { label: "Users",     value: "12.8k", delta: "+8.2%",  up: true  },
                  { label: "Conversion",   value: "3.4%",  delta: "+0.5%",  up: true  },
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
                  <span className="text-[0.625rem] font-semibold text-foreground">Revenue — last 12 months</span>
                  <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-success/10 text-success font-semibold">+12.5%</span>
                </div>
                <div className="h-[80px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
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
                  {["Customer", "Plan", "MRR", "Status"].map(h => (
                    <div key={h} className="text-[0.5rem] font-semibold uppercase tracking-wide text-muted-foreground">{h}</div>
                  ))}
                </div>
                {[
                  { name: "Fintech BR",  plan: "Enterprise", mrr: "$4,200", status: "Ativo",   sc: "text-success" },
                  { name: "ScaleUp SP",  plan: "Pro",        mrr: "$490",   status: "Ativo",   sc: "text-success" },
                  { name: "StartupMVP",  plan: "Starter",    mrr: "—",      status: "Trial",   sc: "text-warning" },
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
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Why DaniMS</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">Built for teams that scale fast</h2>
          </div>
          <div className="max-w-2xl mx-auto grid grid-cols-3 grid-rows-2 gap-3" style={{ gridTemplateRows: "auto auto" }}>
            {/* Large card - spans 2 cols */}
            <div className="col-span-2 rounded-[14px] border border-border bg-card p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" />
              <div className="h-8 w-8 rounded-[10px] bg-primary/10 flex items-center justify-center mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="text-[0.875rem] font-bold text-foreground mb-1">AI that works for you</div>
              <div className="text-[0.75rem] text-muted-foreground leading-snug mb-3">Proactive suggestions, natural-language automations and automatically generated reports.</div>
              <div className="flex gap-2">
                {["Daily summaries", "Smart alerts", "Auto-tagging"].map(t => (
                  <span key={t} className="text-[0.5625rem] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium border border-primary/15">{t}</span>
                ))}
              </div>
            </div>
            {/* Small card */}
            <div className="rounded-[14px] border border-border bg-card p-4 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-xs)" }}>
              <ShieldCheck className="h-5 w-5 text-success mb-2" />
              <div>
                <div className="text-[0.8125rem] font-bold text-foreground mb-1">SOC 2 Type II</div>
                <div className="text-[0.6875rem] text-muted-foreground">Compliance and end-to-end encryption by default.</div>
              </div>
            </div>
            {/* Small card */}
            <div className="rounded-[14px] border border-border bg-card p-4 flex flex-col justify-between" style={{ boxShadow: "var(--shadow-xs)" }}>
              <Globe className="h-5 w-5 text-info mb-2" />
              <div>
                <div className="text-[0.8125rem] font-bold text-foreground mb-1">20 CDN regions</div>
                <div className="text-[0.6875rem] text-muted-foreground">Minimal latency for users in any country.</div>
              </div>
            </div>
            {/* Medium card - spans 2 cols */}
            <div className="col-span-2 rounded-[14px] border border-border bg-card p-5 relative overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-info/6 blur-2xl pointer-events-none" />
              <div className="h-8 w-8 rounded-[10px] bg-info/10 flex items-center justify-center mb-3">
                <Layers className="h-4 w-4 text-info" />
              </div>
              <div className="text-[0.875rem] font-bold text-foreground mb-1">200+ Native integrations</div>
              <div className="text-[0.75rem] text-muted-foreground leading-snug mb-3">Connect with Slack, Notion, HubSpot, Stripe and more in one click. No manual setup.</div>
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
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Analytics</p>
                <h2 className="text-[1.125rem] font-black text-foreground tracking-tight">Measurable results, month by month</h2>
              </div>
              <div className="flex gap-3 text-[0.625rem] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block" />Revenue</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info inline-block" />Users (×10)</span>
              </div>
            </div>
            <div className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="h-[130px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={revenueData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }} barGap={3}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                    <ReTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 10, color: "var(--popover-foreground)" }} />
                    <Bar dataKey="v" name="Revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} opacity={0.9} />
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
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">Where we are and where we are going</h2>
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
                      {item.done && <span className="text-[0.5625rem] px-1.5 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-semibold">Done</span>}
                    </div>
                    <div className="text-[0.875rem] font-bold text-foreground mb-0.5">{item.label}</div>
                    <div className="text-[0.75rem] text-muted-foreground leading-snug">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ COMPARISON TABLE ══ */}
        <div className="px-6 py-10">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Plans</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">Compare and choose your plan</h2>
          </div>
          <div className="max-w-2xl mx-auto rounded-[14px] border border-border overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-border bg-muted/40">
              <div className="px-4 py-3 text-[0.6875rem] font-semibold text-muted-foreground">Feature</div>
              {[
                { name: "Starter", price: "Free",   highlight: false },
                { name: "Pro",     price: "$49/month",  highlight: true  },
                { name: "Enterprise", price: "$199/month", highlight: false },
              ].map(p => (
                <div key={p.name} className={`px-4 py-3 text-center ${p.highlight ? "bg-primary/5" : ""}`}>
                  <div className={`text-[0.75rem] font-bold ${p.highlight ? "text-primary" : "text-foreground"}`}>{p.name}</div>
                  <div className="text-[0.6875rem] text-muted-foreground">{p.price}</div>
                </div>
              ))}
            </div>
            {/* Rows */}
            {comparisonPlans.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 border-b border-border last:border-0 ${i % 2 === 0 ? "bg-card" : "bg-muted/20"}`}>
                <div className="px-4 py-2.5 text-[0.75rem] font-medium text-foreground">{row.feature}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-muted-foreground text-center">{row.starter}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-foreground font-medium text-center bg-primary/3">{row.pro}</div>
                <div className="px-4 py-2.5 text-[0.75rem] text-muted-foreground text-center">{row.enterprise}</div>
              </div>
            ))}
            {/* CTA row */}
            <div className="grid grid-cols-4 border-t border-border bg-muted/20 px-0 py-3">
              <div />
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] border border-border bg-card text-[0.6875rem] font-semibold text-foreground hover:bg-accent transition-colors">Get started</button>
              </div>
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] bg-primary text-primary-foreground text-[0.6875rem] font-semibold hover:opacity-90 transition-opacity">Upgrade</button>
              </div>
              <div className="px-4 flex justify-center">
                <button className="h-7 px-4 rounded-[7px] border border-border bg-card text-[0.6875rem] font-semibold text-foreground hover:bg-accent transition-colors">Talk to sales</button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ TESTIMONIALS CAROUSEL ══ */}
        <div className="px-6 py-10 bg-card/30 border-y border-border">
          <div className="text-center mb-7">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">Testimonials</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">What our customers say</h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {visibleTestimonials.map((t, i) => (
                <div key={`${t.name}-${slide}-${i}`} className="p-4 rounded-[12px] border border-border bg-card" style={{ boxShadow: "var(--shadow-xs)" }}>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, si) => <Star key={si} className="h-3 w-3 text-warning" />)}
                  </div>
                  <p className="text-[0.75rem] text-muted-foreground leading-snug mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-2.5 mt-auto">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                      <span className="text-[0.5625rem] font-black text-primary">{t.avatar}</span>
                    </div>
                    <div>
                      <div className="text-[0.75rem] font-bold text-foreground leading-none">{t.name}</div>
                      <div className="text-[0.5625rem] text-muted-foreground mt-0.5">{t.role}</div>
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
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-primary mb-1">FAQ</p>
            <h2 className="text-[1.25rem] font-black text-foreground tracking-tight">Frequently asked questions</h2>
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-[12px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-[0.875rem] font-semibold text-foreground pr-4">{item.q}</span>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-90" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-border mb-3" />
                    <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">{item.a}</p>
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
                <MessageSquare className="h-3 w-3" /> Contato
              </div>
              <h2 className="text-[1.375rem] font-black text-foreground tracking-[-0.03em] mb-2">
                Vamos construir algo<br/>
                <span style={{ color: "var(--primary)" }}>amazing together</span>
              </h2>
              <p className="text-[0.8125rem] text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Our team replies in under 2 hours on business days. Pick your preferred channel or fill out the form.
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
                  label: "Book a demo",
                  value: "Calendar available",
                  badge: "30 min",
                  badgeColor: "bg-primary/10 text-primary border-primary/20",
                  iconBg: "bg-primary/10 text-primary",
                },
                {
                  icon: MessageSquare,
                  label: "Live chat",
                  value: "Mon–Fri, 9am–6pm",
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
                      Acessar <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="max-w-2xl mx-auto flex items-center gap-3 mb-8">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground px-2">or send a message</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Main content: trust left + form right */}
            <div className="max-w-2xl mx-auto grid grid-cols-[1fr_1.6fr] gap-6 items-start">

              {/* Left — trust panel */}
              <div className="space-y-5">
                <div>
                  <div className="text-[0.875rem] font-bold text-foreground mb-1">Why choose us?</div>
                  <p className="text-[0.75rem] text-muted-foreground leading-relaxed">
                    Over 12,000 teams trust DaniMS to accelerate their growth.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { icon: CheckCircle, text: "Guaranteed response within 2h",  color: "text-success" },
                    { icon: ShieldCheck, text: "100% data protection (SOC 2)", color: "text-info"    },
                    { icon: Star,        text: "4.9★ customer satisfaction", color: "text-warning" },
                    { icon: Rocket,      text: "Free guided onboarding",  color: "text-primary" },
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
                    "The team replied in minutes and helped us integrate everything. Exceptional support."
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
                    <div className="text-[0.875rem] font-bold text-foreground">Send your message</div>
                    <div className="text-[0.6875rem] text-muted-foreground">We reply within 2 business hours</div>
                  </div>
                </div>

                <div className="p-5">
                  {contactSent ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                      <div className="h-14 w-14 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                        <CheckCircle className="h-7 w-7 text-success" />
                      </div>
                      <div>
                        <p className="text-[0.9375rem] font-bold text-foreground mb-1">Message sent!</p>
                        <p className="text-[0.75rem] text-muted-foreground leading-relaxed max-w-[200px] mx-auto">
                          Our team will reply within 2 hours. Check your inbox.
                        </p>
                      </div>
                      <button
                        onClick={() => setContactSent(false)}
                        className="mt-1 h-8 px-4 rounded-[8px] border border-border bg-muted text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={e => { e.preventDefault(); setContactSent(true); }} className="space-y-3">
                      {/* Name + Email */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">
                            Nome <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input required type="text" placeholder="Your name"
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">
                            Email <span className="text-primary">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input required type="email" placeholder="you@email.com"
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Company + Phone */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">Company</label>
                          <div className="relative">
                            <Building2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input type="text" placeholder="DaniMS Co."
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[0.6875rem] font-semibold text-foreground">Telefone</label>
                          <div className="relative">
                            <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                            <input type="tel" placeholder="+55 11 9 0000-0000"
                              className="w-full bg-background border border-border rounded-[8px] pl-7 pr-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all" />
                          </div>
                        </div>
                      </div>

                      {/* Subject chips */}
                      <div className="space-y-1.5">
                        <label className="block text-[0.6875rem] font-semibold text-foreground">Subject</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["Support", "Sales", "Demo", "Partnership", "Other"].map(s => (
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
                          Mensagem <span className="text-primary">*</span>
                        </label>
                        <textarea required rows={3} placeholder="Describe your question or project in detail..."
                          className="w-full bg-background border border-border rounded-[8px] px-2.5 py-2 text-[0.75rem] text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring focus:border-primary/50 transition-all resize-none" />
                      </div>

                      {/* Footer: consent + submit */}
                      <div className="flex items-center justify-between gap-3 pt-0.5">
                        <label className="flex items-start gap-1.5 cursor-pointer flex-1">
                          <input type="checkbox" required className="mt-0.5 h-3 w-3 rounded accent-[var(--primary)] shrink-0" />
                          <span className="text-[0.5625rem] text-muted-foreground leading-snug">
                            I agree to the <span className="text-primary underline underline-offset-1">Terms</span> and <span className="text-primary underline underline-offset-1">Privacy</span>
                          </span>
                        </label>
                        <button type="submit"
                          className="shrink-0 h-8 px-4 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 whitespace-nowrap">
                          <Send className="h-3 w-3" /> Send
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
                {["Product", "Pricing", "Blog", "Careers", "Contact"].map(l => (
                  <button key={l} className="text-[0.6875rem] text-muted-foreground hover:text-foreground transition-colors">{l}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-[0.625rem] text-muted-foreground">© 2026 DaniMoscatelli. All rights reserved.</span>
              <div className="flex items-center gap-3">
                {["Privacy", "Terms", "Cookies"].map(l => (
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
