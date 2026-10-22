import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  CheckCircle, AlertCircle, AlertTriangle, Info, X,
  Loader2, Clock, Check,
} from "lucide-react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { useI18n } from "../../i18n";

type Bi = { en: string; pt: string };
type TFn = (en: string, pt: string) => string;

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
const alertConfig: Record<AlertKind, { icon: React.ElementType; title: Bi; msg: Bi; bg: string; border: string; iconColor: string; titleColor: string }> = {
  success: {
    icon: CheckCircle, title: { en: "Changes saved", pt: "Alterações salvas" },
    msg: { en: "Your configuration has been updated successfully.", pt: "Sua configuração foi atualizada com sucesso." },
    bg: "bg-[var(--success-muted,rgba(21,128,61,0.07))]",
    border: "border-success/20", iconColor: "text-success", titleColor: "text-success",
  },
  info: {
    icon: Info, title: { en: "New features available", pt: "Novos recursos disponíveis" },
    msg: { en: "We've shipped several improvements to the dashboard.", pt: "Lançamos várias melhorias no painel." },
    bg: "bg-[var(--info-muted,rgba(29,78,216,0.07))]",
    border: "border-info/20", iconColor: "text-info", titleColor: "text-info",
  },
  warning: {
    icon: AlertTriangle, title: { en: "Subscription expiring", pt: "Assinatura prestes a expirar" },
    msg: { en: "Your plan renews in 3 days. Update billing to avoid interruptions.", pt: "Seu plano renova em 3 dias. Atualize o pagamento para evitar interrupções." },
    bg: "bg-[var(--warning-muted,rgba(180,83,9,0.07))]",
    border: "border-warning/20", iconColor: "text-warning", titleColor: "text-warning",
  },
  error: {
    icon: AlertCircle, title: { en: "Deployment failed", pt: "Falha no deploy" },
    msg: { en: "Build #1042 failed due to a type error in src/app/App.tsx.", pt: "O build #1042 falhou por um erro de tipo em src/app/App.tsx." },
    bg: "bg-[var(--error-muted,rgba(140,27,27,0.07))]",
    border: "border-primary/20", iconColor: "text-primary", titleColor: "text-primary",
  },
};

function Alert({ kind, dismissible = false }: { kind: AlertKind; dismissible?: boolean }) {
  const { t, bi } = useI18n();
  const [visible, setVisible] = useState(true);
  const cfg = alertConfig[kind];
  const Icon = cfg.icon;
  if (!visible) return null;
  return (
    <div className={`flex items-start gap-3 rounded-[12px] border px-4 py-3.5 ${cfg.bg} ${cfg.border}`}>
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${cfg.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-[0.9rem] font-semibold ${cfg.titleColor}`}>{bi(cfg.title)}</p>
        <p className="text-[0.875rem] text-muted-foreground mt-0.5 leading-relaxed">{bi(cfg.msg)}</p>
      </div>
      {dismissible && (
        <button aria-label={t("Dismiss", "Dispensar")} onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground shrink-0 transition-colors">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* ── Toast ── */
const toastTypes = [
  { label: { en: "Success", pt: "Sucesso" }, icon: CheckCircle, color: "text-success", bg: "bg-card", msg: { en: "Report exported successfully!", pt: "Relatório exportado com sucesso!" } },
  { label: { en: "Error", pt: "Erro" },   icon: AlertCircle, color: "text-primary", bg: "bg-card", msg: { en: "Failed to connect to server.", pt: "Falha ao conectar ao servidor." } },
  { label: { en: "Warning", pt: "Aviso" }, icon: AlertTriangle,color: "text-warning",bg: "bg-card", msg: { en: "Low disk space — 2 GB remaining.", pt: "Pouco espaço em disco — restam 2 GB." } },
  { label: "Loading", icon: Loader2,     color: "text-info",   bg: "bg-card", msg: { en: "Syncing your data...", pt: "Sincronizando seus dados..." } },
];

/* ── Skeleton ── */
function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-[8px] ${className}`} />;
}

/* ── Progress ── */
const progressItems = [
  { label: { en: "Storage", pt: "Armazenamento" },    value: 65, color: "var(--chart-1)" },
  { label: { en: "Bandwidth", pt: "Largura de banda" },  value: 32, color: "var(--chart-2)" },
  { label: { en: "API Calls", pt: "Chamadas de API" },  value: 88, color: "var(--warning)" },
  { label: { en: "Seats", pt: "Assentos" },      value: 20, color: "var(--success)" },
];

/* ── Tabs ── */
const tabItems = [
  { id: "overview",  label: { en: "Overview", pt: "Visão geral" } },
  { id: "analytics", label: { en: "Analytics", pt: "Análises" } },
  { id: "reports",   label: { en: "Reports", pt: "Relatórios" } },
  { id: "settings",  label: { en: "Settings", pt: "Configurações" } },
];

/* ── Badges ── */
const badgeVariants = [
  { label: { en: "Default", pt: "Padrão" },  cls: "bg-muted text-foreground border-border" },
  { label: { en: "Primary", pt: "Primário" },  cls: "bg-primary/10 text-primary border-primary/20" },
  { label: { en: "Success", pt: "Sucesso" },  cls: "bg-success/10 text-success border-success/20" },
  { label: { en: "Warning", pt: "Aviso" },  cls: "bg-warning/10 text-warning border-warning/20" },
  { label: { en: "Error", pt: "Erro" },    cls: "bg-primary/10 text-primary border-primary/20" },
  { label: { en: "Info", pt: "Info" },     cls: "bg-info/10 text-info border-info/20" },
];

const chipVariants = [
  { label: "Design", pt: "Design", active: true },
  { label: "Development", pt: "Desenvolvimento", active: false },
  { label: "Marketing", pt: "Marketing", active: false },
  { label: "Finance", pt: "Finanças", active: true },
  { label: "Operations", pt: "Operações", active: false },
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
  { icon: Check,         color: "bg-success text-white",   title: { en: "Deployment completed", pt: "Deploy concluído" },    desc: { en: "Production build deployed to edge network.", pt: "Build de produção publicado na rede de borda." },    time: { en: "Just now", pt: "Agora mesmo" } },
  { icon: Loader2,       color: "bg-info text-white",      title: { en: "Running tests", pt: "Executando testes" },           desc: { en: "96 of 112 test suites passing.", pt: "96 de 112 suítes de teste passando." },                time: { en: "2 min ago", pt: "há 2 min" } },
  { icon: Clock,         color: "bg-muted text-muted-foreground", title: { en: "Build queued", pt: "Build na fila" },  desc: { en: "Waiting for available runner.", pt: "Aguardando um runner disponível." },                  time: { en: "5 min ago", pt: "há 5 min" } },
  { icon: AlertCircle,   color: "bg-warning text-white",   title: { en: "Warning: API latency", pt: "Aviso: latência da API" },    desc: { en: "P95 latency exceeded 800ms threshold.", pt: "A latência P95 excedeu o limite de 800ms." },         time: { en: "12 min ago", pt: "há 12 min" } },
  { icon: CheckCircle,   color: "bg-success text-white",   title: { en: "PR #284 merged", pt: "PR #284 mesclado" },          desc: { en: "Feature: enhanced search indexing.", pt: "Funcionalidade: indexação de busca aprimorada." },            time: { en: "1 hr ago", pt: "há 1 h" } },
];

export function FeedbackShowcase() {
  const { t, bi, lang } = useI18n();
  const [defaultTab,   setDefaultTab]   = useState("overview");
  const [underlineTab, setUnderlineTab] = useState("overview");
  const [chipActive, setChipActive] = useState<string[]>(["Design", "Finance"]);

  return (
    <div className="space-y-16">

      {/* ── TABS ── */}
      <section id="tabs">
        <SectionHeader title={t("Tabs", "Abas")} description={t("Clean tab navigation for switching between content panels.", "Navegação limpa por abas para alternar entre painéis de conteúdo.")} />
        <SubSection title={t("Default Tabs", "Abas padrão")}>
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
                    {bi(tab.label)}
                  </TabsPrimitive.Trigger>
                ))}
              </TabsPrimitive.List>
              <TabsPrimitive.Content value={defaultTab}>
                <div className="rounded-[12px] bg-muted/30 border border-border p-4 text-[0.875rem] text-muted-foreground">
                  {t("Content for", "Conteúdo da aba")} <strong className="text-foreground">{bi(tabItems.find(x => x.id === defaultTab)!.label)}</strong>{lang === "en" ? " tab." : "."}
                </div>
              </TabsPrimitive.Content>
            </TabsPrimitive.Root>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Underline Tabs", "Abas sublinhadas")}>
          <ShowcaseCard>
            <div className="flex items-center border-b border-border gap-1 mb-5">
              {tabItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUnderlineTab(tab.id)}
                  className={`px-4 py-2.5 text-[0.875rem] font-medium transition-all duration-150 border-b-2 -mb-px outline-none
                    ${underlineTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
                >
                  {bi(tab.label)}
                </button>
              ))}
            </div>
            <div className="text-[0.875rem] text-muted-foreground">
              {t("Viewing:", "Visualizando:")} <strong className="text-foreground">{bi(tabItems.find(x => x.id === underlineTab)!.label)}</strong>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── ALERTS ── */}
      <section id="alerts">
        <SectionHeader title={t("Alerts", "Alertas")} description={t("Status messages for feedback, warnings, and errors. Inline and dismissible variants.", "Mensagens de status para feedback, avisos e erros. Variantes inline e dispensáveis.")} />
        <SubSection title={t("Alert Variants", "Variantes de alerta")}>
          <ShowcaseCard>
            <div className="space-y-3">
              {(Object.keys(alertConfig) as AlertKind[]).map(k => (
                <Alert key={k} kind={k} />
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Dismissible Alerts", "Alertas dispensáveis")}>
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
        <SectionHeader title={t("Toasts", "Toasts")} description={t("Floating notification toasts for transient feedback messages.", "Notificações flutuantes (toasts) para mensagens de feedback temporárias.")} />
        <SubSection title={t("Toast Variants", "Variantes de toast")}>
          <ShowcaseCard>
            <div className="space-y-2 max-w-sm">
              {toastTypes.map(toast => {
                const Icon = toast.icon;
                return (
                  <div key={toast.label} className="flex items-center gap-3 rounded-[12px] border border-border bg-card px-4 py-3" style={{ boxShadow: "var(--shadow-md)" }}>
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${toast.color} ${toast.label === "Loading" ? "animate-spin" : ""}`} style={{ height: "18px", width: "18px" }} />
                    <span className="text-[0.875rem] font-medium text-foreground flex-1">{bi(toast.msg)}</span>
                    <button aria-label={t("Close", "Fechar")} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
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
        <SectionHeader title={t("Progress Bars", "Barras de progresso")} description={t("Visual feedback for task completion and resource utilization.", "Feedback visual para conclusão de tarefas e uso de recursos.")} />
        <SubSection title={t("Progress Variants", "Variantes de progresso")}>
          <ShowcaseCard>
            <div className="space-y-5">
              {progressItems.map(p => (
                <div key={p.label.en}>
                  <div className="flex justify-between text-[0.8125rem] mb-1.5">
                    <span className="font-medium text-foreground">{bi(p.label)}</span>
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

        <SubSection title={t("Indeterminate / Loading", "Indeterminado / Carregando")}>
          <ShowcaseCard>
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-primary rounded-full animate-[progress-indeterminate_1.5s_ease-in-out_infinite]"
                  style={{ animation: "indeterminate 1.5s ease-in-out infinite" }}
                />
              </div>
              <div className="flex items-center gap-2 text-[0.875rem] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                {t("Processing your request...", "Processando sua solicitação...")}
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── SKELETON ── */}
      <section id="skeleton">
        <SectionHeader title={t("Skeleton Loading", "Skeleton loading")} description={t("Placeholder content while data loads. Matches the shape of the actual content.", "Conteúdo provisório enquanto os dados carregam. Segue a forma do conteúdo real.")} />
        <SubSection title={t("Skeleton States", "Estados de skeleton")}>
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
        <SectionHeader title={t("Badges, Chips & Tags", "Badges, chips e tags")} description={t("Compact informational labels for categorization and status indication.", "Rótulos informativos compactos para categorização e indicação de status.")} />

        <SubSection title={t("Badges", "Badges")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map(b => (
                <span key={b.label.en} className={`inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[0.75rem] font-semibold border ${b.cls}`}>
                  {bi(b.label)}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] text-[0.75rem] font-semibold border bg-primary/10 text-primary border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("Live", "Ao vivo")}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-bold bg-primary text-primary-foreground">
                42
              </span>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Chips (Filterable)", "Chips (filtráveis)")}>
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
                    {lang === "en" ? c.label : c.pt}
                  </button>
                );
              })}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Tags", "Tags")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {tagVariants.map(tag => (
                <span key={tag.label} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] text-[0.75rem] font-medium border ${tag.color}`}>
                  <span className="opacity-60">#</span>{tag.label}
                </span>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── TIMELINE ── */}
      <section id="timeline">
        <SectionHeader title={t("Timeline", "Linha do tempo")} description={t("Activity feed and event history with status indicators.", "Feed de atividades e histórico de eventos com indicadores de status.")} />
        <SubSection title={t("Activity Timeline", "Linha do tempo de atividades")}>
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
                          <p className="text-[0.9rem] font-semibold text-foreground">{bi(item.title)}</p>
                          <span className="text-[0.75rem] text-muted-foreground shrink-0">{bi(item.time)}</span>
                        </div>
                        <p className="text-[0.8125rem] text-muted-foreground">{bi(item.desc)}</p>
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
        <SectionHeader title={t("Avatar", "Avatar")} description={t("User identity representation in various sizes with presence indicators.", "Representação da identidade do usuário em vários tamanhos, com indicadores de presença.")} />
        <SubSection title={t("Avatar Sizes & States", "Tamanhos e estados de avatar")}>
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
                <span className="text-[0.6875rem] text-muted-foreground">{t("Group", "Grupo")}</span>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── EMPTY STATE ── */}
      <section id="empty-states">
        <SectionHeader title={t("Empty States", "Estados vazios")} description={t("Clear, actionable empty states that guide users forward.", "Estados vazios claros e acionáveis que orientam o usuário.")} />
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
                <h4 className="text-[1rem] font-semibold text-foreground mb-1">{t("No results found", "Nenhum resultado encontrado")}</h4>
                <p className="text-[0.875rem] text-muted-foreground max-w-[220px]">{t("Try adjusting your search or filters to find what you're looking for.", "Tente ajustar sua busca ou os filtros para encontrar o que procura.")}</p>
              </div>
              <button className="inline-flex items-center gap-2 h-9 px-4 text-[0.875rem] font-semibold rounded-[10px] border border-border bg-card hover:bg-accent text-foreground transition-colors">
                {t("Clear filters", "Limpar filtros")}
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
                <h4 className="text-[1rem] font-semibold text-foreground mb-1">{t("Create your first project", "Crie seu primeiro projeto")}</h4>
                <p className="text-[0.875rem] text-muted-foreground max-w-[220px]">{t("Projects help you organize your work and collaborate with your team.", "Projetos ajudam você a organizar seu trabalho e colaborar com sua equipe.")}</p>
              </div>
              <button className="inline-flex items-center gap-2 h-9 px-4 text-[0.875rem] font-semibold rounded-[10px] bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {t("New Project", "Novo projeto")}
              </button>
            </div>
          </ShowcaseCard>
        </div>
      </section>

      {/* ── Feedback Tokens ── */}
      <section id="feedback-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Tokens — Feedback", "Tokens — Feedback")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties used by alerts, toasts, and status components.", "Propriedades CSS customizadas usadas por alertas, toasts e componentes de status.")}</p>
        </div>
        <TokenTable groups={feedbackTokenGroups(t)} />
      </section>

      {/* ── Labels / Badges Tokens ── */}
      <section id="badges-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Tokens — Labels & Badges", "Tokens — Rótulos e badges")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties used by badges, tags, avatars, and status pills.", "Propriedades CSS customizadas usadas por badges, tags, avatares e pílulas de status.")}</p>
        </div>
        <TokenTable groups={badgesTokenGroups(t)} />
      </section>
    </div>
  );
}

const feedbackTokenGroups = (t: TFn): TokenGroup[] => [
  {
    group: t("Status Colors", "Cores de status"),
    tokens: [
      { name: "--success",              description: t("Positive / confirmed action", "Ação positiva / confirmada"),    light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--success-foreground",   description: t("Text on success", "Texto sobre sucesso"),               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--success-muted",        description: t("Success tinted background", "Fundo com tom de sucesso"),      light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning",              description: t("Caution / pending action", "Atenção / ação pendente"),       light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--warning-foreground",   description: t("Text on warning", "Texto sobre aviso"),               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--warning-muted",        description: t("Warning tinted background", "Fundo com tom de aviso"),      light: "rgba(229,169,78,0.10)", dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--error",                description: t("Error / failure state", "Estado de erro / falha"),          light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--error-foreground",     description: t("Text on error", "Texto sobre erro"),                 light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--error-muted",          description: t("Error tinted background", "Fundo com tom de erro"),        light: "rgba(212,77,77,0.10)",  dark: "rgba(212,77,77,0.15)",  isColor: true },
      { name: "--info",                 description: t("Informational notice", "Aviso informativo"),           light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--info-foreground",      description: t("Text on info", "Texto sobre info"),                  light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--info-muted",           description: t("Info tinted background", "Fundo com tom de info"),         light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--destructive",          description: t("Destructive / irreversible", "Destrutivo / irreversível"),     light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--destructive-foreground",description: t("Text on destructive", "Texto sobre destrutivo"),           light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
    ],
  },
  {
    group: t("Toast / Notification Surface", "Superfície de toast / notificação"),
    tokens: [
      { name: "--popover",           description: t("Toast background", "Fundo do toast"),       light: "#FFFFFF",             dark: "rgba(19,26,39,0.95)", isColor: true },
      { name: "--popover-foreground",description: t("Toast text", "Texto do toast"),             light: "#131A27",             dark: "#E4E9F0",             isColor: true },
      { name: "--border",            description: t("Toast border", "Borda do toast"),           light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--shadow-md",         description: t("Toast elevation", "Elevação do toast"),       light: "0 4px 12px …" },
    ],
  },
];

const badgesTokenGroups = (t: TFn): TokenGroup[] => [
  {
    group: t("Badge / Tag Colors", "Cores de badge / tag"),
    tokens: [
      { name: "--primary",      description: t("Primary badge fill", "Preenchimento do badge primário"),   light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-muted",description: t("Primary badge tinted", "Badge primário com tom"), light: "rgba(212,77,77,0.10)", dark: "rgba(212,77,77,0.15)", isColor: true },
      { name: "--success",      description: t("Success badge", "Badge de sucesso"),        light: "#4fb57b", dark: "#22C55E", isColor: true },
      { name: "--success-muted",description: t("Success badge tinted", "Badge de sucesso com tom"), light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning",      description: t("Warning badge", "Badge de aviso"),        light: "#e5a94e", dark: "#f5b320", isColor: true },
      { name: "--warning-muted",description: t("Warning badge tinted", "Badge de aviso com tom"), light: "rgba(229,169,78,0.10)", dark: "rgba(245,179,32,0.12)", isColor: true },
      { name: "--info",         description: t("Info badge", "Badge de info"),           light: "#448abc", dark: "#3B82F6", isColor: true },
      { name: "--info-muted",   description: t("Info badge tinted", "Badge de info com tom"),    light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--violet",       description: t("Violet accent badge", "Badge de destaque violeta"),  light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--violet-muted", description: t("Violet badge tinted", "Badge violeta com tom"),  light: "rgba(186,105,220,0.10)", dark: "rgba(235,108,255,0.12)", isColor: true },
      { name: "--orange",       description: t("Orange accent badge", "Badge de destaque laranja"),  light: "#fa9852", dark: "#ff8833", isColor: true },
      { name: "--orange-muted", description: t("Orange badge tinted", "Badge laranja com tom"),  light: "rgba(250,152,82,0.10)", dark: "rgba(255,136,51,0.12)", isColor: true },
      { name: "--muted",        description: t("Neutral / default badge", "Badge neutro / padrão"),light: "#E8EDF3", dark: "rgba(40,48,67,0.60)", isColor: true },
    ],
  },
  {
    group: t("Avatar", "Avatar"),
    tokens: [
      { name: "--border",        description: t("Avatar ring border", "Borda do anel do avatar"),      light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--muted",         description: t("Avatar fallback bg", "Fundo de fallback do avatar"),     light: "#E8EDF3",             dark: "rgba(40,48,67,0.60)",    isColor: true },
      { name: "--muted-foreground",description: t("Avatar initials text", "Texto das iniciais do avatar"), light: "#627288",             dark: "#8898B0",                isColor: true },
      { name: "--primary",       description: t("Avatar active ring", "Anel ativo do avatar"),     light: "#D44D4D",             dark: "#D44D4D",                isColor: true },
    ],
  },
];
