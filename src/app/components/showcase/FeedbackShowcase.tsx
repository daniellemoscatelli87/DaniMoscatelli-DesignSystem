import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { Selo } from "@/app/components/ui/selo";
import { SeloSecao } from "@/app/components/ui/selo-secao";
import { AvatarCircles } from "@/app/components/ui/avatar-circles";
import { MapPin, Plus, SearchX, Sparkles, XCircle } from "lucide-react";
import {
  CheckCircle, CheckCircle2, AlertCircle, Info, X,
  Loader2, Clock, Check,
} from "lucide-react";
import { useI18n } from "../../i18n";
import { Alert as UiAlert, AlertTitle, AlertDescription } from "../ui/alert";
import { SectionHeader } from "./shared/SectionHeader";
import { AlertaComAcaoDoc } from "./AlertaComAcaoShowcase";
import { VejaEm } from "./shared/VejaEm";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { EstadoVazio } from "../ui/estado-vazio";
import { GrupoDeChipsFiltraveis } from "../ui/chip-filtravel";
import { GradeDeCards } from "../ui/grade-de-cards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

type Bi = { en: string; pt: string };
type TFn = (en: string, pt: string) => string;

const DEMO_AVATARS = ["Ana", "Bruno", "Carla", "Diego", "Elisa", "Fábio"].map((name, i) => ({
  imageUrl: `${import.meta.env.BASE_URL}avatares/avatar-${i + 1}.svg`,
  profileUrl: "#avatar-circles",
  name,
}));

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

/* ── Alert component ── */
type AlertKind = "success" | "error" | "warning" | "info";
const alertConfig: Record<AlertKind, { icon: React.ElementType; title: Bi; msg: Bi; bg: string; border: string; iconColor: string; titleColor: string }> = {
  success: {
    icon: CheckCircle2, title: { en: "Changes saved", pt: "Alterações salvas" },
    msg: { en: "Your configuration has been updated successfully.", pt: "Sua configuração foi atualizada com sucesso." },
    bg: "bg-[var(--success-muted,rgba(21,128,61,0.07))]",
    border: "border-success/20", iconColor: "text-success-text", titleColor: "text-foreground",
  },
  info: {
    icon: Info, title: { en: "New features available", pt: "Novos recursos disponíveis" },
    msg: { en: "We've shipped several improvements to the dashboard.", pt: "Lançamos várias melhorias no painel." },
    bg: "bg-[var(--info-muted,rgba(29,78,216,0.07))]",
    border: "border-info/20", iconColor: "text-info-text", titleColor: "text-foreground",
  },
  warning: {
    icon: AlertCircle, title: { en: "Subscription expiring", pt: "Assinatura prestes a expirar" },
    msg: { en: "Your plan renews in 3 days. Update billing to avoid interruptions.", pt: "Seu plano renova em 3 dias. Atualize o pagamento para evitar interrupções." },
    bg: "bg-[var(--warning-muted,rgba(180,83,9,0.07))]",
    border: "border-warning/20", iconColor: "text-warning-text", titleColor: "text-foreground",
  },
  error: {
    icon: XCircle, title: { en: "Deployment failed", pt: "Falha no deploy" },
    msg: { en: "Build #1042 failed due to a type error in src/app/App.tsx.", pt: "O build #1042 falhou por um erro de tipo em src/app/App.tsx." },
    bg: "bg-[var(--error-muted,rgba(140,27,27,0.07))]",
    border: "border-error/20", iconColor: "text-error-text", titleColor: "text-foreground",
  },
};

function Alert({ kind, dismissible = false }: { kind: AlertKind; dismissible?: boolean }) {
  const { t, bi } = useI18n();
  const [visible, setVisible] = useState(true);
  const cfg = alertConfig[kind];
  const Icon = cfg.icon;
  if (!visible) return null;
  // Componente real (ui/alert), o mesmo que o produto copia
  return (
    <UiAlert variant={kind} className={dismissible ? "pr-[52px]" : ""}>
      <Icon aria-hidden />
      <AlertTitle>{bi(cfg.title)}</AlertTitle>
      <AlertDescription>{bi(cfg.msg)}</AlertDescription>
      {dismissible && (
        <button aria-label={t("Dismiss", "Dispensar")} onClick={() => setVisible(false)} className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-[var(--duration-fast)] hover:bg-[color:color-mix(in_oklab,var(--alerta-cor)_10%,transparent)] hover:text-foreground motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <X className="h-4 w-4" aria-hidden />
        </button>
      )}
    </UiAlert>
  );
}

/* ── Toast ── */
const toastTypes = [
  { tipo: "success", label: { en: "Success", pt: "Sucesso" }, icon: CheckCircle, color: "text-success-text", bg: "bg-card", msg: { en: "Report exported successfully!", pt: "Relatório exportado com sucesso!" } },
  { tipo: "error", label: { en: "Error", pt: "Erro" },   icon: XCircle, color: "text-error-text", bg: "bg-card", msg: { en: "Failed to connect to server.", pt: "Falha ao conectar ao servidor." } },
  { tipo: "warning", label: { en: "Warning", pt: "Aviso" }, icon: AlertCircle,color: "text-warning-text",bg: "bg-card", msg: { en: "Low disk space — 2 GB remaining.", pt: "Pouco espaço em disco — restam 2 GB." } },
  { tipo: "loading", label: "Loading", icon: Loader2,     color: "text-info-text",   bg: "bg-card", msg: { en: "Syncing your data...", pt: "Sincronizando seus dados..." } },
];

/* ── Skeleton ── */
function SkeletonPulse({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-sm ${className}`} />;
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
  { label: { en: "Primary", pt: "Primário" },  cls: "bg-primary/10 text-primary-text border-primary/20" },
  { label: { en: "Success", pt: "Sucesso" },  cls: "bg-success/10 text-success-text border-success/20" },
  { label: { en: "Warning", pt: "Aviso" },  cls: "bg-warning/10 text-warning-text border-warning/20" },
  { label: { en: "Error", pt: "Erro" },    cls: "bg-error/10 text-error-text border-error/20" },
  { label: { en: "Info", pt: "Info" },     cls: "bg-info/10 text-info-text border-info/20" },
];

const chipVariants = [
  { label: "Design", pt: "Design", active: true },
  { label: "Development", pt: "Desenvolvimento", active: false },
  { label: "Marketing", pt: "Marketing", active: false },
  { label: "Finance", pt: "Finanças", active: true },
  { label: "Operations", pt: "Operações", active: false },
];

const tagVariants = [
  { label: "react", color: "bg-info/10 text-info-text border-info/20 dark:text-info-text" },
  { label: "typescript", color: "bg-violet/10 text-violet border-violet/20 dark:text-violet" },
  { label: "ui-design", color: "bg-primary/10 text-primary-text border-primary/20" },
  { label: "performance", color: "bg-success/10 text-success-text border-success/20" },
  { label: "api", color: "bg-muted text-muted-foreground border-border" },
];

/* ── Timeline ── */
const timelineItems = [
  { icon: Check,         color: "bg-success text-white",   title: { en: "Deployment completed", pt: "Deploy concluído" },    desc: { en: "Production build deployed to edge network.", pt: "Build de produção publicado na rede de borda." },    time: { en: "Just now", pt: "Agora mesmo" } },
  { icon: Loader2,       color: "bg-info text-white",      title: { en: "Running tests", pt: "Executando testes" },           desc: { en: "96 of 112 test suites passing.", pt: "96 de 112 suítes de teste passando." },                time: { en: "2 min ago", pt: "há 2 min" } },
  { icon: Clock,         color: "bg-muted text-muted-foreground", title: { en: "Build queued", pt: "Build na fila" },  desc: { en: "Waiting for available runner.", pt: "Aguardando um runner disponível." },                  time: { en: "5 min ago", pt: "há 5 min" } },
  { icon: AlertCircle,   color: "bg-warning text-warning-foreground",   title: { en: "Warning: API latency", pt: "Aviso: latência da API" },    desc: { en: "P95 latency exceeded 800ms threshold.", pt: "A latência P95 excedeu o limite de 800ms." },         time: { en: "12 min ago", pt: "há 12 min" } },
  { icon: CheckCircle,   color: "bg-success text-white",   title: { en: "PR #284 merged", pt: "PR #284 mesclado" },          desc: { en: "Feature: enhanced search indexing.", pt: "Funcionalidade: indexação de busca aprimorada." },            time: { en: "1 hr ago", pt: "há 1 h" } },
];

export function FeedbackShowcase({ parte = "feedback" }: { parte?: "feedback" | "rotulos" }) {
  const { t, bi, lang } = useI18n();
  const [defaultTab,   setDefaultTab]   = useState("overview");
  const [underlineTab, setUnderlineTab] = useState("overview");
  const [chipActive, setChipActive] = useState<string[]>(["Design", "Finance"]);

  return (
    <div className="space-y-16">

      {/* ── TABS ── */}
      {parte === "feedback" && (
      <section id="tabs">
        <SectionHeader title={t("Tabs", "Abas")} description={t("Clean tab navigation for switching between content panels.", "Navegação limpa por abas para alternar entre painéis de conteúdo.")} />
        <SubSection title={t("Default Tabs", "Abas padrão")}>
          <ShowcaseCard>
            <Tabs value={defaultTab} onValueChange={setDefaultTab}>
              <TabsList className="mb-5">
                {tabItems.map(tab => (
                  <TabsTrigger key={tab.id} value={tab.id}>{bi(tab.label)}</TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={defaultTab}>
                <div className="rounded-md bg-muted/30 border border-border p-4 text-body-sm text-muted-foreground">
                  {t("Content for", "Conteúdo da aba")} <strong className="text-foreground">{bi(tabItems.find(x => x.id === defaultTab)!.label)}</strong>{lang === "en" ? " tab." : "."}
                </div>
              </TabsContent>
            </Tabs>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Underline Tabs", "Abas sublinhadas")}>
          <ShowcaseCard>
            <div className="flex flex-wrap items-center border-b border-border gap-1 mb-5">
              {tabItems.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setUnderlineTab(tab.id)}
                  className={`px-4 py-2 text-body-sm font-medium transition-all duration-150 border-b-2 -mb-px outline-none
                    ${underlineTab === tab.id ? "border-primary text-primary-text" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
                >
                  {bi(tab.label)}
                </button>
              ))}
            </div>
            <div className="text-body-sm text-muted-foreground">
              {t("Viewing:", "Visualizando:")} <strong className="text-foreground">{bi(tabItems.find(x => x.id === underlineTab)!.label)}</strong>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>
      )}

      {/* ── ALERTS ── */}
      {parte === "feedback" && (
      <section id="alerts">
        <SectionHeader title={t("Alerts", "Alertas")} description={t("Status messages for feedback, warnings, and errors. All alerts follow the same pattern: icon with base, 15 px title, 14 px text and a background in the state colour. Without an action, use the plain Alert; when the reader needs to act, use the Alert with action.", "Mensagens de status para feedback, avisos e erros. Todos os alertas seguem o mesmo padrão: ícone com base, título de 15 px, texto de 14 px e fundo com a cor do estado. Sem ação, use o Alerta simples; quando a pessoa precisa agir, use o Alerta com ação.")} />
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

        <SubSection title={t("Alert without a title", "Alerta só com descrição")}>
          <div id="alerta-sem-titulo" className="scroll-mt-32" />
          <ShowcaseCard>
            <p className="mb-4 max-w-3xl text-body-sm leading-relaxed text-muted-foreground">
              {t("When the message fits in one sentence, use the Alert without AlertTitle. The sentence becomes the main information: it takes the main text colour, sits centred on the icon and wraps evenly. It is automatic: just leave out the title.", "Quando a mensagem cabe numa frase, use o Alert sem AlertTitle. A frase passa a ser a informação principal: fica na cor do texto principal, centralizada na altura do ícone e com a quebra de linha equilibrada. É automático: basta não usar o título.")}
            </p>
            <div className="space-y-3">
              <UiAlert variant="error"><XCircle aria-hidden /><AlertDescription>{t("Wrong email or password. Check them and try again.", "E-mail ou senha incorretos. Confira e tente de novo.")}</AlertDescription></UiAlert>
              <UiAlert variant="success"><CheckCircle2 aria-hidden /><AlertDescription>{t("Changes saved.", "Alterações salvas.")}</AlertDescription></UiAlert>
              <UiAlert variant="info"><Info aria-hidden /><AlertDescription>{t("You can change this later in Settings.", "Você pode mudar isso depois em Configurações.")}</AlertDescription></UiAlert>
            </div>
          </ShowcaseCard>
        </SubSection>

        <div id="alerta-com-acao" className="scroll-mt-32">
          <AlertaComAcaoDoc />
        </div>
      </section>
      )}

      {/* ── TOASTS ── */}
      {parte === "feedback" && (
      <section id="toasts">
        <SectionHeader title={t("Toasts", "Toasts")} description={t("Floating notification toasts for transient feedback messages.", "Notificações flutuantes (toasts) para mensagens de feedback temporárias.")} />
        <SubSection title={t("Try it", "Experimente")}>
          <ShowcaseCard>
            <p className="mb-3 text-body-sm text-muted-foreground">{t("Each button shows a real notification in the corner of the screen (ui/sonner).", "Cada botão mostra uma notificação de verdade no canto da tela (ui/sonner).")}</p>
            <div className="flex flex-wrap gap-2">
              {toastTypes.map(tt => (
                <Button key={tt.tipo} variant="outline" onClick={() => {
                  const msg = bi(tt.msg);
                  if (tt.tipo === "success") toast.success(msg);
                  else if (tt.tipo === "error") toast.error(msg);
                  else if (tt.tipo === "warning") toast.warning(msg);
                  else { const id = toast.loading(msg); setTimeout(() => toast.success(t("Done.", "Pronto."), { id }), 1800); }
                }}>
                  {typeof tt.label === "string" ? t("Loading", "Carregando") : bi(tt.label)}
                </Button>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>
        <SubSection title={t("Toast Variants", "Variantes de toast")}>
          <ShowcaseCard>
            <div className="space-y-2 max-w-sm">
              {toastTypes.map(toast => {
                const Icon = toast.icon;
                return (
                  <div key={toast.label} className="flex items-center gap-3 rounded-md border border-border bg-card px-4 py-3" style={{ boxShadow: "var(--shadow-md)" }}>
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${toast.color} ${toast.label === "Loading" ? "animate-spin" : ""}`} style={{ height: "18px", width: "18px" }} />
                    <span className="text-body-sm font-medium text-foreground flex-1">{bi(toast.msg)}</span>
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
      )}

      {/* ── PROGRESS ── */}
      {parte === "feedback" && (
      <section id="progress">
        <SectionHeader title={t("Progress Bars", "Barras de progresso")} description={t("Visual feedback for task completion and resource utilization.", "Feedback visual para conclusão de tarefas e uso de recursos.")} />
        <SubSection title={t("Progress Variants", "Variantes de progresso")}>
          <ShowcaseCard>
            <div className="space-y-5">
              {progressItems.map(p => (
                <div key={p.label.en}>
                  <div className="flex justify-between text-body-sm mb-1">
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
              <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary-text" />
                {t("Processing your request...", "Processando sua solicitação...")}
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>
      )}

      {/* ── SKELETON ── */}
      {parte === "feedback" && (
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
                <SkeletonPulse className="h-8 w-20 rounded-sm" />
                <SkeletonPulse className="h-8 w-16 rounded-sm" />
              </div>
            </ShowcaseCard>

            {/* Table skeleton */}
            <ShowcaseCard className="p-0 overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <SkeletonPulse className="h-4 w-28" />
              </div>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-border/50">
                  <SkeletonPulse className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1">
                    <SkeletonPulse className="h-3.5 w-36" />
                    <SkeletonPulse className="h-3 w-24" />
                  </div>
                  <SkeletonPulse className="h-6 w-16 rounded-sm" />
                  <SkeletonPulse className="h-3.5 w-16" />
                </div>
              ))}
            </ShowcaseCard>
          </div>
        </SubSection>
      </section>
      )}

      {/* ── BADGES CHIPS TAGS ── */}
      {parte === "rotulos" && (
      <section id="badges">
        <SectionHeader title={t("Badges, Chips & Tags", "Badges, chips e tags")} description={t("Compact informational labels for categorization and status indication.", "Rótulos informativos compactos para categorização e indicação de status.")} />

        <SubSection title={t("Badges", "Badges")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map(b => (
                <span key={b.label.en} className={`inline-flex items-center px-2 py-1 rounded-sm text-label font-semibold border ${b.cls}`}>
                  {bi(b.label)}
                </span>
              ))}
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-label font-semibold border bg-primary/10 text-primary-text border-primary/20">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t("Live", "Ao vivo")}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-caption font-bold bg-primary text-primary-foreground">
                42
              </span>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Chips (Filterable)", "Chips (filtráveis)")}>
          <ShowcaseCard>
            <GrupoDeChipsFiltraveis
              rotulo={t("Filter by area", "Filtrar por área")}
              valor={chipActive}
              onValorChange={setChipActive}
              opcoes={chipVariants.map(c => ({ valor: c.label, rotulo: lang === "en" ? c.label : c.pt }))}
            />
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Tags", "Tags")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-2">
              {tagVariants.map(tag => (
                <span key={tag.label} className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-label font-medium border ${tag.color}`}>
                  <span className="opacity-60">#</span>{tag.label}
                </span>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <div id="selo" className="scroll-mt-32" />
        <SubSection title={t("Hero tag (selo)", "Selo (tag do hero)")}>
          <ShowcaseCard>
            <p className="mb-4 text-body-sm leading-relaxed text-muted-foreground">
              {t(
                "The pill used at the top of the Experience Intelligence page on the studio site: card background, thin border, small uppercase text with wide tracking and a primary dot. Use it to set the context at the top of a page or section (product name, place, theme), never for status or counts.",
                "A pílula usada no topo da página Experience Intelligence do site do estúdio: fundo de card, borda fina, texto pequeno em caixa alta com espaçamento largo e um ponto na cor primária. Use para situar a pessoa no topo de uma página ou seção (nome do produto, lugar, tema), nunca para status ou contagem.",
              )}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Selo>DM | Experience Intelligence</Selo>
              <Selo icon={<MapPin />}>{t("Local fashion in Curitiba", "Moda local em Curitiba")}</Selo>
              <Selo tone="primary" icon={<Sparkles />}>{t("New", "Novidade")}</Selo>
              <Selo size="sm">{t("Section", "Seção")}</Selo>
              <Selo dot={false}>{t("No dot", "Sem ponto")}</Selo>
            </div>
            <div className="mt-4 rounded-md bg-foreground p-5">
              <p className="mb-3 text-caption font-semibold uppercase tracking-[0.08em] text-background/60">{t("On a dark surface", "Sobre superfície escura")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-label font-semibold uppercase tracking-[0.14em] text-white/85"><span aria-hidden className="h-2 w-2 rounded-full bg-primary" />{t("Inverted", "Invertido")}</span>
              </div>
            </div>
            <ul className="mt-4 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
              <li>• {t("One hero tag per page or section; it comes right above the title.", "Um selo por página ou seção; ele vem logo acima do título.")}</li>
              <li>• {t("Short text (two to four words), uppercase by the component, never a sentence.", "Texto curto (duas a quatro palavras), caixa alta pelo componente, nunca uma frase.")}</li>
              <li>• {t("Dot or one icon in the primary color, never both.", "Ponto ou um ícone na cor primária, nunca os dois.")}</li>
              <li>• {t("It is not interactive. For filters use chips; for status use badges or the status chip.", "Não é interativo. Para filtros use chips; para status use badges ou o chip de status.")}</li>
            </ul>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { Selo } from "@/app/components/ui/selo";
<Selo>DM | Experience Intelligence</Selo>
<Selo icon={<MapPin />}>Moda local em Curitiba</Selo>`}</code></pre>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Section seal", "Selo de seção")}>
          <div id="selo-secao" className="scroll-mt-32" />
          <ShowcaseCard>
            <p className="mb-5 text-body-sm leading-relaxed text-muted-foreground">
              {t("From the sections of the studio site's Experience Intelligence 2 page (\"Current scenario\", \"The challenge\", \"Method\"): a filled pill in the light primary tint with a thin primary border and the primary text color, uppercase with wide tracking, no dot. It sits centred above a section title and names the subject of the section. The hero tag stays neutral (card surface, dot); this one is coloured.", "Das seções da página Experience Intelligence 2 do site do estúdio (\"Cenário Atual\", \"O Desafio\", \"Método\"): pílula preenchida com o tom claro da primária, borda fina na primária e texto na cor primária de texto, em caixa alta com espaçamento largo, sem ponto. Fica centralizada acima do título da seção e nomeia o assunto dela. O selo do hero continua neutro (fundo de card, ponto); este é colorido.")}
            </p>
            <div className="rounded-lg border border-border bg-background px-6 py-10 text-center">
              <SeloSecao className="mb-4">{t("Current scenario", "Cenário atual")}</SeloSecao>
              <h3 className="mx-auto max-w-[32ch] text-h3 font-bold leading-tight tracking-[-0.02em] text-foreground" style={{ fontFamily: "var(--font-sans)" }}>{t("Experience stopped being a differentiator. It became a competitive advantage.", "A experiência deixou de ser um diferencial. Ela se tornou uma vantagem competitiva.")}</h3>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SeloSecao>{t("The challenge", "O desafio")}</SeloSecao>
              <SeloSecao>{t("Method", "Método")}</SeloSecao>
              <SeloSecao size="sm">{t("Compact", "Compacto")} · sm</SeloSecao>
              <SeloSecao icon={<Sparkles />}>{t("With icon", "Com ícone")}</SeloSecao>
            </div>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { SeloSecao } from "@/app/components/ui/selo-secao";

<SeloSecao>Cenário atual</SeloSecao>
<h2>…</h2>`}</code></pre>
            <ul className="mt-4 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
              <li>• {t("One per section, above the title, centred when the title is centred.", "Um por seção, acima do título, centralizado quando o título é centralizado.")}</li>
              <li>• {t("One to three words naming the subject; never status, count or action.", "De uma a três palavras nomeando o assunto; nunca status, contagem ou ação.")}</li>
              <li>• {t("Tokens: --primary-muted (fill), primary at 25 % (border), --primary-text (text), --shadow-xs.", "Tokens: --primary-muted (fundo), primária a 25 % (borda), --primary-text (texto), --shadow-xs.")}</li>
              <li>• {t("Hero of a page: use the hero tag (Selo); sections inside the page: this one.", "Hero de uma página: use o selo do hero (Selo); seções dentro da página: este.")}</li>
            </ul>
          </ShowcaseCard>
        </SubSection>
      </section>
      )}

      {/* ── TIMELINE ── */}
      {parte === "rotulos" && (
      <section id="rotulos-timeline">
        <VejaEm secao="timeline" titulo={t("The timeline has its own page", "A linha do tempo tem página própria")} texto={t("Steps, states and accessibility of the timeline are in Components > Timeline.", "Etapas, estados e acessibilidade da linha do tempo ficam em Componentes > Linha do tempo.")} rotuloBotao={t("See Timeline", "Ver Linha do tempo")} />
      </section>
      )}

      {/* ── AVATAR ── */}
      {parte === "rotulos" && (
      <section id="avatar">
        <SectionHeader title={t("Avatar", "Avatar")} description={t("User identity representation in various sizes with presence indicators.", "Representação da identidade do usuário em vários tamanhos, com indicadores de presença.")} />
        <SubSection title={t("Avatar Sizes & States", "Tamanhos e estados de avatar")}>
          <ShowcaseCard>
            <div className="flex flex-wrap items-end gap-6">
              {[
                { size: "h-6 w-6 text-caption",  label: "XS" },
                { size: "h-8 w-8 text-caption", label: "SM" },
                { size: "h-10 w-10 text-label",label: "MD" },
                { size: "h-12 w-12 text-body-sm",label: "LG" },
                { size: "h-14 w-14 text-body",   label: "XL" },
              ].map(({ size, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className={`${size} rounded-full bg-primary/15 text-primary-text font-semibold flex items-center justify-center border-2 border-background`}>
                      AN
                    </div>
                    {label === "MD" && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
                    )}
                  </div>
                  <span className="text-caption text-muted-foreground">{label}</span>
                </div>
              ))}
              {/* Avatar group */}
              <div className="flex flex-col items-center gap-2">
                <div className="flex -space-x-2">
                  {["AN", "SL", "YT", "LO"].map((init, i) => (
                    <div
                      key={init}
                      className="h-10 w-10 rounded-full flex items-center justify-center text-label font-semibold border-2 border-background"
                      style={{ backgroundColor: `hsl(${i * 60}, 40%, ${35 + i * 8}%)`, color: "white", zIndex: 4 - i }}
                    >
                      {init}
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-label font-semibold text-muted-foreground z-0">
                    +5
                  </div>
                </div>
                <span className="text-caption text-muted-foreground">{t("Group", "Grupo")}</span>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Avatar Circles">
          <div id="avatar-circles" className="scroll-mt-32" />
          <ShowcaseCard>
            <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
              {t("Overlapping avatar circles with a final “+N” circle, ported from Magic UI and adapted to the system tokens: borders follow the background, so it works on light and dark themes, and the “+N” only becomes a link when a destination is given. Use it as social proof next to a call to action. ", "Círculos de avatares sobrepostos com um último círculo “+N”, portado do Magic UI e adaptado aos tokens do sistema: as bordas seguem o fundo, então funciona nos temas claro e escuro, e o “+N” só vira link quando há um destino. Use como prova social ao lado de uma chamada para ação. ")}
              {t('Clients already working with the studio on a product page, participants of a challenge or members of an organization.', 'Clientes que já usam o estúdio em uma página de produto, participantes de um desafio ou membros de uma organização.')}
            </p>
            <div className="flex flex-col gap-6">
              {([["sm", "SM · 32 px"], ["md", "MD · 40 px"], ["lg", "LG · 48 px"]] as const).map(([size, label]) => (
                <div key={size} className="flex flex-wrap items-center gap-4">
                  <AvatarCircles size={size} numPeople={99} moreHref="#avatar-circles" avatarUrls={DEMO_AVATARS} />
                  <span className="text-caption text-muted-foreground">{label}</span>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-muted/40 p-4">
                <AvatarCircles numPeople={48} avatarUrls={DEMO_AVATARS.slice(0, 4)} />
                <p className="text-body-sm text-foreground">
                  <span className="font-semibold">{t("52 teams", "52 times")}</span>{" "}
                  <span className="text-muted-foreground">{t("already investigate their challenges here.", "já investigam seus desafios por aqui.")}</span>
                </p>
              </div>
            </div>
            <pre className="mt-4 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { AvatarCircles } from "@/app/components/ui/avatar-circles";

<AvatarCircles
  numPeople={99}
  moreHref="/pessoas"
  avatarUrls={[
    { imageUrl: "/avatares/avatar-1.svg", profileUrl: "/perfil/ana", name: "Ana" },
    { imageUrl: "/avatares/avatar-2.svg", profileUrl: "/perfil/bruno", name: "Bruno" },
  ]}
/>`}</code></pre>
            <ul className="mt-4 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
              <li>• {t("Props: avatarUrls (imageUrl, profileUrl, name), numPeople, moreHref, size sm | md | lg, className.", "Props: avatarUrls (imageUrl, profileUrl, name), numPeople, moreHref, size sm | md | lg, className.")}</li>
              <li>• {t("Three to six avatars; beyond that, the “+N” carries the rest.", "De três a seis avatares; acima disso, o “+N” resume o restante.")}</li>
              <li>• {t("Always pass name: it becomes the image alt text and the tooltip.", "Sempre informe name: vira o texto alternativo da imagem e o tooltip.")}</li>
              <li>• {t("Only show real people with consent; otherwise use initials avatars.", "Só mostre pessoas reais com consentimento; senão, use avatares de iniciais.")}</li>
            </ul>
          </ShowcaseCard>
        </SubSection>
      </section>
      )}

      {/* ── EMPTY STATE ── */}
      {parte === "rotulos" && (
      <section id="empty-states">
        <SectionHeader title={t("Empty States", "Estados vazios")} description={t("Clear, actionable empty states that guide users forward.", "Estados vazios claros e acionáveis que orientam o usuário.")} />
        <GradeDeCards className="grid-cols-1 md:grid-cols-2 gap-4">
          <ShowcaseCard>
            <EstadoVazio
              tamanho="sm"
              nivel={4}
              icone={<SearchX />}
              titulo={t("No results found", "Nenhum resultado encontrado")}
              descricao={t("Try adjusting your search or filters to find what you're looking for.", "Tente ajustar sua busca ou os filtros para encontrar o que procura.")}
              acoes={<Button variant="outline">{t("Clear filters", "Limpar filtros")}</Button>}
            />
          </ShowcaseCard>
          <ShowcaseCard>
            <EstadoVazio
              tamanho="sm"
              nivel={4}
              tom="marca"
              icone={<Plus />}
              titulo={t("Create your first project", "Crie seu primeiro projeto")}
              descricao={t("Projects help you organize your work and collaborate with your team.", "Projetos ajudam você a organizar seu trabalho e colaborar com sua equipe.")}
              acoes={<Button><Plus aria-hidden />{t("New Project", "Novo projeto")}</Button>}
            />
          </ShowcaseCard>
        </GradeDeCards>
        <p className="mt-3 text-body-sm text-muted-foreground">{t("Component: EstadoVazio (ui/estado-vazio.tsx). More in Frames & states.", "Componente: EstadoVazio (ui/estado-vazio.tsx). Mais em Molduras e estados.")}</p>
      </section>
      )}

      {/* ── Feedback Tokens ── */}
      {parte === "feedback" && (
      <section id="feedback-tokens" className="space-y-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold tracking-[-0.02em] text-foreground">{t("Tokens — Feedback", "Tokens — Feedback")}</h2>
          <p className="text-body-sm text-muted-foreground mt-1">{t("CSS custom properties used by alerts, toasts, and status components.", "Propriedades CSS customizadas usadas por alertas, toasts e componentes de status.")}</p>
        </div>
        <TokenTable groups={feedbackTokenGroups(t)} />
      </section>
      )}

      {/* ── Labels / Badges Tokens ── */}
      {parte === "rotulos" && (
      <section id="badges-tokens" className="space-y-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold tracking-[-0.02em] text-foreground">{t("Tokens — Labels & Badges", "Tokens — Rótulos e badges")}</h2>
          <p className="text-body-sm text-muted-foreground mt-1">{t("CSS custom properties used by badges, tags, avatars, and status pills.", "Propriedades CSS customizadas usadas por badges, tags, avatares e pílulas de status.")}</p>
        </div>
        <TokenTable groups={badgesTokenGroups(t)} />
      </section>
      )}
    </div>
  );
}

const feedbackTokenGroups = (t: TFn): TokenGroup[] => [
  {
    group: t("Status Colors", "Cores de status"),
    tokens: [
      { name: "--success",              description: t("Positive / confirmed action", "Ação positiva / confirmada"),    light: "#388459", dark: "#22C55E", isColor: true },
      { name: "--success-foreground",   description: t("Text on success", "Texto sobre sucesso"),               light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--success-muted",        description: t("Success tinted background", "Fundo com tom de sucesso"),      light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--success-text",         description: t("Success text and icon on light backgrounds (alert button)", "Texto e ícone de sucesso sobre fundo claro (botão do alerta)"), light: "#327650", dark: "#22C55E", isColor: true },
      { name: "--warning",              description: t("Caution / pending action", "Atenção / ação pendente"),       light: "#F0A020", dark: "#F5B040", isColor: true },
      { name: "--warning-foreground",   description: t("Text on warning (graphite, never white)", "Texto sobre aviso (grafite, nunca branco)"),               light: "#131A27", dark: "#131A27", isColor: true },
      { name: "--warning-muted",        description: t("Warning tinted background", "Fundo com tom de aviso"),      light: "rgba(240,160,32,0.14)", dark: "rgba(245,176,64,0.14)", isColor: true },
      { name: "--warning-text",         description: t("Warning text and icon on light backgrounds (alert icon and button)", "Texto e ícone de aviso sobre fundo claro (ícone e botão dos alertas)"), light: "#935E0A", dark: "#F5B040", isColor: true },
      { name: "--error",                description: t("Error / failure state", "Estado de erro / falha"),          light: "#D9416E", dark: "#E5688F", isColor: true },
      { name: "--error-foreground",     description: t("Text on error", "Texto sobre erro"),                 light: "#FFFFFF", dark: "#131A27", isColor: true },
      { name: "--error-muted",          description: t("Error tinted background", "Fundo com tom de erro"),        light: "rgba(217,65,110,0.10)",  dark: "rgba(229,104,143,0.15)",  isColor: true },
      { name: "--error-text",           description: t("Error text and icon on light backgrounds (alert icon and button)", "Texto e ícone de erro sobre fundo claro (ícone e botão dos alertas)"), light: "#C52756", dark: "#E5688F", isColor: true },
      { name: "--info",                 description: t("Informational notice", "Aviso informativo"),           light: "#3D7CAA", dark: "#3B82F6", isColor: true },
      { name: "--info-foreground",      description: t("Text on info", "Texto sobre info"),                  light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--info-muted",           description: t("Info tinted background", "Fundo com tom de info"),         light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--info-text",            description: t("Info text and icon on light backgrounds (alert button)", "Texto e ícone de info sobre fundo claro (botão do alerta)"), light: "#366E97", dark: "#3B82F6", isColor: true },
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
      { name: "--primary-muted",description: t("Primary badge tinted", "Badge primário com tom"), light: "#FAE4E4", dark: "rgba(212,77,77,0.15)", isColor: true },
      { name: "--success",      description: t("Success badge", "Badge de sucesso"),        light: "#388459", dark: "#22C55E", isColor: true },
      { name: "--success-muted",description: t("Success badge tinted", "Badge de sucesso com tom"), light: "rgba(79,181,123,0.10)", dark: "rgba(34,197,94,0.12)", isColor: true },
      { name: "--warning",      description: t("Warning badge", "Badge de aviso"),        light: "#F0A020", dark: "#F5B040", isColor: true },
      { name: "--warning-muted",description: t("Warning badge tinted", "Badge de aviso com tom"), light: "rgba(240,160,32,0.14)", dark: "rgba(245,176,64,0.14)", isColor: true },
      { name: "--info",         description: t("Info badge", "Badge de info"),           light: "#3D7CAA", dark: "#3B82F6", isColor: true },
      { name: "--info-muted",   description: t("Info badge tinted", "Badge de info com tom"),    light: "rgba(68,138,188,0.10)", dark: "rgba(59,130,246,0.12)", isColor: true },
      { name: "--violet",       description: t("Violet accent badge", "Badge de destaque violeta"),  light: "#ba69dc", dark: "#eb6cff", isColor: true },
      { name: "--violet-muted", description: t("Violet badge tinted", "Badge violeta com tom"),  light: "rgba(186,105,220,0.10)", dark: "rgba(235,108,255,0.12)", isColor: true },
      { name: "--orange",       description: t("Orange accent badge", "Badge de destaque laranja"),  light: "#fa9852", dark: "#ff8833", isColor: true },
      { name: "--orange-muted", description: t("Orange badge tinted", "Badge laranja com tom"),  light: "rgba(250,152,82,0.10)", dark: "rgba(255,136,51,0.12)", isColor: true },
      { name: "--card / --border", description: t("Hero tag (selo) surface and border", "Superfície e borda do selo (tag do hero)"), light: "#FFFFFF", dark: "card", isColor: false },
      { name: "--graphite-700", description: t("Hero tag text (graphite-300 in dark)", "Texto do selo (graphite-300 no escuro)"), light: "graphite-700", dark: "graphite-300", isColor: false },
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
