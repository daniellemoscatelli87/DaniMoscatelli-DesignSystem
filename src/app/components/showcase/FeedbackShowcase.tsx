import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  CheckCircle, AlertCircle, AlertTriangle, Info, X,
  Loader2, Clock, Check,
} from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

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

/* ── Alert component ── */
type AlertKind = "success" | "error" | "warning" | "info";
const alertConfig: Record<AlertKind, { icon: React.ElementType; title: string; msg: string; bg: string; border: string; iconColor: string; titleColor: string }> = {
  success: {
    icon: CheckCircle, title: "Changes saved",
    msg: "Your configuration has been updated successfully.",
    bg: "bg-[var(--success-muted,rgba(21,128,61,0.07))]",
    border: "border-success/20", iconColor: "text-success", titleColor: "text-success",
  },
  info: {
    icon: Info, title: "New features available",
    msg: "We've shipped several improvements to the dashboard.",
    bg: "bg-[var(--info-muted,rgba(29,78,216,0.07))]",
    border: "border-info/20", iconColor: "text-info", titleColor: "text-info",
  },
  warning: {
    icon: AlertTriangle, title: "Subscription expiring",
    msg: "Your plan renews in 3 days. Update billing to avoid interruptions.",
    bg: "bg-[var(--warning-muted,rgba(180,83,9,0.07))]",
    border: "border-warning/20", iconColor: "text-warning", titleColor: "text-warning",
  },
  error: {
    icon: AlertCircle, title: "Deployment failed",
    msg: "Build #1042 failed due to a type error in src/app/App.tsx.",
    bg: "bg-[var(--error-muted,rgba(140,27,27,0.07))]",
    border: "border-primary/20", iconColor: "text-primary", titleColor: "text-primary",
  },
};

function Alert({ kind, dismissible = false }: { kind: AlertKind; dismissible?: boolean }) {
  const [visible, setVisible] = useState(true);
  const cfg = alertConfig[kind];
  const Icon = cfg.icon;
  if (!visible) return null;
  return (
    <div className={`flex items-start gap-3 rounded-[12px] border px-4 py-3.5 ${cfg.bg} ${cfg.border}`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-[0.9rem] font-semibold ${cfg.titleColor}`}>{cfg.title}</p>
        <p className="text-[0.875rem] text-muted-foreground mt-0.5 leading-relaxed">{cfg.msg}</p>
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground shrink-0 transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── Toast ── */
const toastTypes = [
  { label: "Success", icon: CheckCircle, color: "text-success", bg: "bg-card", msg: "Report exported successfully!" },
  { label: "Error",   icon: AlertCircle, color: "text-primary", bg: "bg-card", msg: "Failed to connect to server." },
  { label: "Warning", icon: AlertTriangle,color: "text-warning",bg: "bg-card", msg: "Low disk space — 2 GB remaining." },
  { label: "Loading", icon: Loader2,     color: "text-info",   bg: "bg-card", msg: "Syncing your data..." },
];

/* ── Skeleton ── */
function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-[8px] ${className}`} />;
}

/* ── Progress ── */
const progressItems = [
  { label: "Storage",    value: 65, color: "var(--chart-1)" },
  { label: "Bandwidth",  value: 32, color: "var(--chart-2)" },
  { label: "API Calls",  value: 88, color: "var(--warning)" },
  { label: "Seats",      value: 20, color: "var(--success)" },
];

/* ── Tabs ── */
const tabItems = [
  { id: "overview",  label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "reports",   label: "Reports" },
  { id: "settings",  label: "Settings" },
];

/* ── Badges ── */
const badgeVariants = [
  { label: "Default",  cls: "bg-muted text-foreground border-border" },
  { label: "Primary",  cls: "bg-primary/10 text-primary border-primary/20" },
  { label: "Success",  cls: "bg-success/10 text-success border-success/20" },
  { label: "Warning",  cls: "bg-warning/10 text-warning border-warning/20" },
  { label: "Error",    cls: "bg-primary/10 text-primary border-primary/20" },
  { label: "Info",     cls: "bg-info/10 text-info border-info/20" },
];

const chipVariants = [
  { label: "Design", active: true },
  { label: "Development", active: false },
  { label: "Marketing", active: false },
  { label: "Finance", active: true },
  { label: "Operations", active: false },
];

const tagVariants = [
  { label: "react", color: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" },
  { label: "typescript", color: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400" },
  { label: "ui-design", color: "bg-primary/10 text-primary border-primary/20" },
  { label: "performance", color: "bg-success/10 text-success border-success/20" },
  { label: "api", color: "bg-muted text-muted-foreground border-border" },
];

/* ── Timeline ── */
const timelineItems = [
  { icon: Check,         color: "bg-success text-white",   title: "Deployment completed",    desc: "Production build deployed to edge network.",    time: "Just now" },
  { icon: Loader2,       color: "bg-info text-white",      title: "Running tests",           desc: "96 of 112 test suites passing.",                time: "2 min ago" },
  { icon: Clock,         color: "bg-muted text-muted-foreground", title: "Build queued",  desc: "Waiting for available runner.",                  time: "5 min ago" },
  { icon: AlertCircle,   color: "bg-warning text-white",   title: "Warning: API latency",    desc: "P95 latency exceeded 800ms threshold.",         time: "12 min ago" },
  { icon: CheckCircle,   color: "bg-success text-white",   title: "PR #284 merged",          desc: "Feature: enhanced search indexing.",            time: "1 hr ago" },
];

export function FeedbackShowcase() {
  const [defaultTab,   setDefaultTab]   = useState("overview");
  const [underlineTab, setUnderlineTab] = useState("overview");
  const [chipActive, setChipActive] = useState<string[]>(["Design", "Finance"]);

  return (
    <div className="space-y-16">

      {/* ── TABS ── */}
      <section id="tabs">
        <SectionHeader title="Tabs" description="Clean tab navigation for switching between content panels." />
        <SubSection title="Default Tabs">
          <ShowcaseCard>
            <TabsPrimitive.Root value={defaultTab} onValueChange={setDefaultTab}>
              <TabsPrimitive.List className="flex items-center gap-1 p-1 bg-muted rounded-[10px] w-fit mb-5">
                {tabItems.map(tab => (
                  <TabsPrimitive.Trigger
                    key={tab.id}
                    value={tab.id}
                    className={`px-4 py-2 text-[0.875rem] font-medium rounded-[8px] transition-all duration-150 outline-none
                      data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm
                      data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground`}
                    style={{ boxShadow: defaultTab === tab.id ? "var(--shadow-sm)" : undefined }}
                  >
                    {tab.label}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>
              <TabsPrimitive.Content value={defaultTab}>
                <div className="rounded-[12px] bg-muted/30 border border-border p-4 text-[0.875rem] text-muted-foreground">
                  Content for <strong className="text-foreground">{tabItems.find(t => t.id === defaultTab)?.label}</strong> tab.
                </div>
              </TabsPrimitive.Content>
            </TabsPrimitive.Root>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Underline Tabs">
          <ShowcaseCard>
            <div className="flex items-center border-b border-border gap-1 mb-5">
              {tabItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUnderlineTab(tab.id)}
                  className={`px-4 py-2.5 text-[0.875rem] font-medium transition-all duration-150 border-b-2 -mb-px outline-none
                    ${underlineTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-[0.875rem] text-muted-foreground">
              Viewing: <strong className="text-foreground">{tabItems.find(t => t.id === underlineTab)?.label}</strong>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── ALERTS ── */}
      <section id="alerts">
        <SectionHeader title="Alerts" description="Status messages for feedback, warnings, and errors. Inline and dismissible variants." />
        <SubSection title="Alert Variants">
          <ShowcaseCard>
            <div className="space-y-3">
              {(Object.keys(alertConfig) as AlertKind[]).map(k => (
                <Alert key={k} kind={k} />
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Dismissible Alerts">
          <ShowcaseCard>
            <div className="space-y-3">
              {(["success", "warning"] as AlertKind[]).map(k => (
                <Alert key={k} kind={k} dismissible />
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── TOASTS ── */}
      <section id="toasts">
        <SectionHeader title="Toasts" description="Floating notification toasts for transient feedback messages." />
        <SubSection title="Toast Variants">
          <ShowcaseCard>
            <div className="space-y-2 max-w-sm">
              {toastTypes.map(t => {
                const Icon = t.icon;
                return (
                  <div key={t.label} className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3" style={{ boxShadow: "var(--shadow-md)" }}>
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${t.color} ${t.label === "Loading" ? "animate-spin" : ""}`} style={{ height: "18px", width: "18px" }} />
                    <span className="text-[0.875rem] font-medium text-foreground flex-1">{t.msg}</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── PROGRESS ── */}
      <section id="progress">
        <SectionHeader title="Progress Bars" description="Visual feedback for task completion and resource utilization." />
        <SubSection title="Progress Variants">
          <ShowcaseCard>
            <div className="space-y-5">
              {progressItems.map(p => (
                <div key={p.label}>
                  <div className="flex justify-between text-[0.8125rem] mb-1.5">
                    <span className="font-medium text-foreground">{p.label}</span>
                    <span className="text-muted-foreground font-mono">{p.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${p.value}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Indeterminate / Loading">
          <ShowcaseCard>
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full animate-[progress-indeterminate_1.5s_ease-in-out_infinite]"
                  style={{ animation: "indeterminate 1.5s ease-in-out infinite" }}
                />
              </div>
              <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                Processing your request...
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── SKELETON ── */}
      <section id="skeleton">
        <SectionHeader title="Skeleton Loading" description="Placeholder content while data loads. Matches the shape of the actual content." />
        <SubSection title="Skeleton States">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card skeleton */}
            <ShowcaseCard>
              <div className="flex items-start gap-3 mb-4">
                <SkeletonPulse className="h-10 w-10 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <SkeletonPulse className="h-4 w-32" />
                  <SkeletonPulse className="h-3 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <SkeletonPulse className="h-3.5 w-full" />
                <SkeletonPulse className="h-3.5 w-5/6" />
                <SkeletonPulse className="h-3.5 w-4/6" />
              </div>
              <div className="mt-4 flex gap-2">
                <SkeletonPulse className="h-8 w-20 rounded-[8px]" />
                <SkeletonPulse className="h-8 w-16 rounded-[8px]" />
              </div>
            </ShowcaseCard>

            {/* Table skeleton */}
            <ShowcaseCard className="p-0 overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <SkeletonPulse className="h-4 w-28" />
              </div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50">
                  <SkeletonPulse className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <SkeletonPulse className="h-3.5 w-36" />
                    <SkeletonPulse className="h-3 w-24" />
                  </div>
                  <SkeletonPulse className="h-6 w-16 rounded-[6px]" />
                  <SkeletonPulse className="h-3.5 w-16" />
                </div>
              ))}
            </ShowcaseCard>
          </div>
        </SubSection>
      </section>

      {/* ── BADGES CHIPS TAGS ── */}
      <section id="badges">
        <SectionHeader title="Badges, Chips & Tags" description="Compact informational labels for categorization and status indication." />

        <SubSection title="Badges">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map(b => (
                <span key={b.label} className={`inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[0.75rem] font-semibold border ${b.cls}`}>
                  {b.label}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] text-[0.75rem] font-semibold border bg-primary/10 text-primary border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Live
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-primary text-primary-foreground">
                42
              </span>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Chips (Filterable)">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {chipVariants.map(c => {
                const active = chipActive.includes(c.label);
                return (
                  <button
                    key={c.label}
                    onClick={() => setChipActive(prev => active ? prev.filter(x => x !== c.label) : [...prev, c.label])}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.8125rem] font-medium border transition-all duration-150
                      ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:border-[var(--border-strong)]"}`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    {c.label}
                  </button>
                );
              })}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Tags">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {tagVariants.map(t => (
                <span key={t.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[0.75rem] font-medium border ${t.color}`}>
                  <span className="opacity-60">#</span>{t.label}
                </span>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline">
        <SectionHeader title="Timeline" description="Activity feed and event history with status indicators." />
        <SubSection title="Activity Timeline">
          <ShowcaseCard>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-5">
                {timelineItems.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="relative flex gap-4 pl-12">
                      <div className={`absolute left-5 -translate-x-1/2 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon className="h-3.5 w-3.5" style={{ height: "14px", width: "14px" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-[0.9rem] font-semibold text-foreground">{item.title}</p>
                          <span className="text-[0.75rem] text-muted-foreground shrink-0">{item.time}</span>
                        </div>
                        <p className="text-[0.8125rem] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── AVATAR ── */}
      <section id="avatar">
        <SectionHeader title="Avatar" description="User identity representation in various sizes with presence indicators." />
        <SubSection title="Avatar Sizes & States">
          <ShowcaseCard>
            <div className="flex flex-wrap items-end gap-6">
              {[
                { size: "h-6 w-6 text-[0.5rem]",  label: "XS" },
                { size: "h-8 w-8 text-[0.625rem]", label: "SM" },
                { size: "h-10 w-10 text-[0.75rem]",label: "MD" },
                { size: "h-12 w-12 text-[0.875rem]",label: "LG" },
                { size: "h-14 w-14 text-[1rem]",   label: "XL" },
              ].map(({ size, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className={`${size} rounded-full bg-primary/15 text-primary font-semibold flex items-center justify-center border-2 border-background`}>
                      AN
                    </div>
                    {label === "MD" && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
                    )}
                  </div>
                  <span className="text-[0.6875rem] text-muted-foreground">{label}</span>
                </div>
              ))}
              {/* Avatar group */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-2">
                  {["AN", "SL", "YT", "LO"].map((init, i) => (
                    <div
                      key={init}
                      className="h-10 w-10 rounded-full flex items-center justify-center text-[0.75rem] font-semibold border-2 border-background"
                      style={{ backgroundColor: `hsl(${i * 60}, 40%, ${35 + i * 8}%)`, color: "white", zIndex: 4 - i }}
                    >
                      {init}
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[0.75rem] font-semibold text-muted-foreground z-0">
                    +5
                  </div>
                </div>
                <span className="text-[0.6875rem] text-muted-foreground">Group</span>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── EMPTY STATE ── */}
      <section id="empty-states">
        <SectionHeader title="Empty States" description="Clear, actionable empty states that guide users forward." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ShowcaseCard>
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="h-16 w-16 rounded-[20px] bg-muted flex items-center justify-center">
                <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3h9L21 7.5v9L16.5 21h-9L3 16.5v-9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <div>
                <h4 className="text-[1rem] font-semibold text-foreground mb-1">No results found</h4>
                <p className="text-[0.875rem] text-muted-foreground max-w-[220px]">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
              <button className="inline-flex items-center gap-2 h-9 px-4 text-[0.875rem] font-semibold rounded-[10px] border border-border bg-card hover:bg-accent text-foreground transition-colors">
                Clear filters
              </button>
            </div>
          </ShowcaseCard>

          <ShowcaseCard>
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <div className="h-16 w-16 rounded-[20px] bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h4 className="text-[1rem] font-semibold text-foreground mb-1">Create your first project</h4>
                <p className="text-[0.875rem] text-muted-foreground max-w-[220px]">Projects help you organize your work and collaborate with your team.</p>
              </div>
              <button className="inline-flex items-center gap-2 h-9 px-4 text-[0.875rem] font-semibold rounded-[10px] bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                New Project
              </button>
            </div>
          </ShowcaseCard>
        </div>
      </section>

      {/* ── Feedback Tokens ── */}
      <section id="feedback-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens — Feedback</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">CSS custom properties used by alerts, toasts, and status components.</p>
        </div>
        <TokenTable groups={feedbackTokenGroups} />
      </section>

      {/* ── Labels / Badges Tokens ── */}
      <section id="badges-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens — Labels & Badges</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">CSS custom properties used by badges, tags, avatars, and status pills.</p>
        </div>
        <TokenTable groups={badgesTokenGroups} />
      </section>
    </div>
  );
}

const feedbackTokenGroups: TokenGroup[] = [
  {
    group: "Status Colors",
    tokens: [
      { name: "--success",              description: "Positive / confirmed action",    light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--success-foreground",   description: "Text on success",               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--success-muted",        description: "Success tinted background",      light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning",              description: "Caution / pending action",       light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--warning-foreground",   description: "Text on warning",               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--warning-muted",        description: "Warning tinted background",      light: "rgba(229,169,78,0.10)", dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--error",                description: "Error / failure state",          light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--error-foreground",     description: "Text on error",                 light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--error-muted",          description: "Error tinted background",        light: "rgba(212,77,77,0.10)",  dark: "rgba(212,77,77,0.15)",  isColor: true },
      { name: "--info",                 description: "Informational notice",           light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--info-foreground",      description: "Text on info",                  light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--info-muted",           description: "Info tinted background",         light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--destructive",          description: "Destructive / irreversible",     light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--destructive-foreground",description: "Text on destructive",           light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
    ],
  },
  {
    group: "Toast / Notification Surface",
    tokens: [
      { name: "--popover",           description: "Toast background",       light: "#FFFFFF",             dark: "rgba(19,26,39,0.95)", isColor: true },
      { name: "--popover-foreground",description: "Toast text",             light: "#131A27",             dark: "#E4E9F0",             isColor: true },
      { name: "--border",            description: "Toast border",           light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--shadow-md",         description: "Toast elevation",       light: "0 4px 12px …" },
    ],
  },
];

const badgesTokenGroups: TokenGroup[] = [
  {
    group: "Badge / Tag Colors",
    tokens: [
      { name: "--primary",      description: "Primary badge fill",   light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-muted",description: "Primary badge tinted", light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
      { name: "--success",      description: "Success badge",        light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--success-muted",description: "Success badge tinted", light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning",      description: "Warning badge",        light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--warning-muted",description: "Warning badge tinted", light: "rgba(229,169,78,0.10)", dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--info",         description: "Info badge",           light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--info-muted",   description: "Info badge tinted",    light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--violet",       description: "Violet accent badge",  light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--violet-muted", description: "Violet badge tinted",  light: "rgba(186,105,220,0.10)", dark: "rgba(235,108,255,0.12)", isColor: true },
      { name: "--orange",       description: "Orange accent badge",  light: "#fa9852", dark: "#ff8833", isColor: true },
      { name: "--orange-muted", description: "Orange badge tinted",  light: "rgba(250,152,82,0.10)", dark: "rgba(255,136,51,0.12)", isColor: true },
      { name: "--muted",        description: "Neutral / default badge",light: "#E8EDF3", dark: "rgba(40,48,67,0.60)", isColor: true },
    ],
  },
  {
    group: "Avatar",
    tokens: [
      { name: "--border",        description: "Avatar ring border",      light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--muted",         description: "Avatar fallback bg",     light: "#E8EDF3",             dark: "rgba(40,48,67,0.60)",    isColor: true },
      { name: "--muted-foreground",description: "Avatar initials text", light: "#627288",             dark: "#8898B0",                isColor: true },
      { name: "--primary",       description: "Avatar active ring",     light: "#D44D4D",             dark: "#D44D4D",                isColor: true },
    ],
  },
];
