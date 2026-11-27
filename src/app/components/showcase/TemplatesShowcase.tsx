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
  ShieldCheck, Rocket, BarChart, Layout, Minus, Lightbulb, Star, ArrowRight, PanelsTopLeft,
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip as ReTooltip,
} from "recharts";
import { useI18n } from "../../i18n";
import { SectionHeader } from "./shared/SectionHeader";
import { GradeDeCards } from "../ui/grade-de-cards";
import { PainelTemplate, PecasDoPainel } from "./PainelTemplates";
import { SegmentedControl } from "../ui/segmented-control";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { LinhaDeLista } from "../ui/linha-de-lista";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";
import { MolduraDeConta } from "../ui/moldura-de-conta";
import { Campo } from "../ui/campo";
import { EstadoFinal } from "../ui/estado-vazio";

import { DashboardTemplate, SettingsTemplate, InboxTemplate, LandingTemplate } from "./TemplatesResponsivos";

type L = { en: string; pt: string };

/* ─────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────── */

function TemplateLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="h-7 w-7 rounded-sm bg-muted flex items-center justify-center">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <span className="text-body-sm font-semibold uppercase tracking-[0.07em] text-muted-foreground">{label}</span>
    </div>
  );
}

/* Wraps each template in a browser-chrome frame */
function TemplateFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border overflow-hidden ${className}`} style={{ boxShadow: "var(--shadow-lg)" }}>
      {/* Browser chrome */}
      <div className="h-9 bg-muted/60 border-b border-border flex items-center px-4 gap-2 shrink-0">
        <div className="flex gap-1">
          <div className="h-2.5 w-2.5 rounded-full bg-primary/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-warning/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-success/50" />
        </div>
        <div className="flex-1 mx-4">
          <div className="h-5 bg-background/70 rounded-sm max-w-[280px] mx-auto flex items-center px-3">
            <span className="text-caption text-muted-foreground/60 truncate">app.danimos.co</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   3. Login / Auth Template
───────────────────────────────────────────── */
function AuthTemplate() {
  // MolduraDeConta, Campo, SegmentedControl e EstadoFinal do DS (27/11/2026): o template é feito só de componentes.
  const { t } = useI18n();
  const uid = React.useId();
  const pre = `auth${uid.replace(/:/g, "")}`;
  const [tab, setTab] = useState<"entrar" | "criar">("entrar");
  const [enviado, setEnviado] = useState(false);
  const entrar = tab === "entrar";
  const trocar = (novo: "entrar" | "criar") => { setTab(novo); setEnviado(false); };

  return (
    <TemplateFrame>
      <MolduraDeConta
        telaCheia={false}
        inicioHref="#template-auth"
        rotuloInicio={t("Go to the home page", "Ir para a página inicial")}
        titulo={entrar ? t("Welcome back", "Que bom ter você de volta") : t("Create your account", "Crie sua conta")}
        descricao={entrar ? t("Sign in to your workspace.", "Entre no seu espaço de trabalho.") : t("It takes a few minutes.", "Leva poucos minutos.")}
        lateral={
          <div className="space-y-5">
            <p className="m-0 text-h4 font-bold leading-snug text-foreground">{t("Design that starts from people.", "Design que começa pelas pessoas.")}</p>
            <ul className="m-0 grid list-none gap-2 p-0 text-body-sm text-muted-foreground">
              {[t("Your projects in one place", "Seus projetos num lugar só"), t("Progress you can follow", "Andamento que você acompanha"), t("Direct contact with the studio", "Contato direto com o estúdio")].map(f => (
                <li key={f} className="flex items-start gap-2"><Check aria-hidden className="mt-1 size-4 shrink-0 text-success-text" />{f}</li>
              ))}
            </ul>
          </div>
        }
        rodape={
          <p className="m-0">
            {entrar ? t("No account yet? ", "Ainda não tem conta? ") : t("Already have an account? ", "Já tem conta? ")}
            <Button variant="link" className="h-auto p-0" onClick={() => trocar(entrar ? "criar" : "entrar")}>{entrar ? t("Create account", "Criar conta") : t("Sign in", "Entrar")}</Button>
          </p>
        }
      >
        <SegmentedControl<"entrar" | "criar">
          aria-label={t("Choose an option", "Escolha uma opção")}
          fullWidth
          className="mb-6"
          options={[{ value: "entrar", label: t("Sign in", "Entrar") }, { value: "criar", label: t("Create account", "Criar conta") }]}
          value={tab}
          onValueChange={trocar}
        />
        {enviado ? (
          <EstadoFinal
            tom="sucesso"
            className="py-6"
            titulo={entrar ? t("All set!", "Tudo certo!") : t("Account created!", "Conta criada!")}
            descricao={entrar ? t("Opening your workspace.", "Abrindo o seu espaço de trabalho.") : t("We sent you an e-mail to confirm the address.", "Enviamos um e-mail para confirmar o endereço.")}
            acoes={<Button variant="outline" onClick={() => setEnviado(false)}>{t("Back", "Voltar")}</Button>}
          />
        ) : (
          <form className="space-y-5" onSubmit={e => { e.preventDefault(); setEnviado(true); }}>
            {!entrar && <Campo id={`${pre}-nome`} rotulo={t("Full name", "Nome completo")} icone={<User />} required autoComplete="name" placeholder="Dani Moscatelli" />}
            <Campo id={`${pre}-email`} rotulo={t("E-mail", "E-mail")} type="email" icone={<Mail />} required autoComplete="email" placeholder="nome@exemplo.com" />
            <Campo
              id={`${pre}-senha`}
              rotulo={t("Password", "Senha")}
              type="password"
              icone={<Lock />}
              required
              minLength={entrar ? undefined : 8}
              autoComplete={entrar ? "current-password" : "new-password"}
              textosDaSenha={{ mostrar: t("Show password", "Mostrar senha"), ocultar: t("Hide password", "Ocultar senha") }}
              acaoDoRotulo={entrar ? <Button variant="link" type="button" className="h-auto p-0 text-body-sm">{t("Forgot it?", "Esqueceu?")}</Button> : undefined}
              ajuda={entrar ? undefined : t("Use at least 8 characters.", "Use pelo menos 8 caracteres.")}
            />
            <Button type="submit" className="w-full">
              <LogIn aria-hidden />
              {entrar ? t("Sign in", "Entrar") : t("Create account", "Criar conta")}
            </Button>
          </form>
        )}
      </MolduraDeConta>
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

const tomDaFuncao: Record<string, "marca" | "info" | "neutro" | "sucesso"> = { Admin: "marca", Editor: "info", Viewer: "neutro", Developer: "sucesso" };

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

const tomDoStatus: Record<string, "sucesso" | "neutro" | "aviso"> = { Active: "sucesso", Inactive: "neutro", Pending: "aviso" };

/**
 * Equipe: card nunca rola para o lado. Abaixo de 40rem de largura, a tabela vira lista (LinhaDeLista, com função,
 * situação e ações embaixo do texto); a partir dela, a tabela, com a coluna Entrada só a partir de 48rem.
 */
function TeamTemplate() {
  const { t, bi } = useI18n();
  const [search, setSearch] = useState("");
  const filtered = teamMembers.filter(
    m => m.name.toLowerCase().includes(search.toLowerCase()) ||
         m.email.toLowerCase().includes(search.toLowerCase())
  );
  const acoes = (m: typeof teamMembers[number]) => (
    <span className="flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label={t(`Edit ${m.name}`, `Editar ${m.name}`)}><Edit2 aria-hidden /></Button>
      <Button variant="ghost" size="icon" aria-label={t(`Remove ${m.name}`, `Remover ${m.name}`)}><Trash2 aria-hidden /></Button>
    </span>
  );
  const avatar = (m: typeof teamMembers[number]) => (
    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] text-caption font-bold text-primary-text">{m.avatar}</span>
  );

  return (
    <TemplateFrame>
      <div className="@container/equipe flex h-[520px] flex-col overflow-hidden bg-background">
        {/* Cabeçalho: título e ações; no celular, as ações descem para baixo do título, na mesma borda */}
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-3 border-b border-border px-4 py-4 @2xl/equipe:px-6">
          <div className="min-w-0 flex-1">
            <h3 className="text-body font-bold text-foreground">{t("Team Members", "Membros da equipe")}</h3>
            <p className="text-label text-muted-foreground">{teamMembers.length} {t("members in your workspace", "membros no seu espaço de trabalho")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm"><Download aria-hidden /> {t("Export", "Exportar")}</Button>
            <Button size="sm"><UserPlus aria-hidden /> {t("Invite", "Convidar")}</Button>
          </div>
        </div>

        {/* Busca e filtro */}
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3 @2xl/equipe:px-6">
          <div className="relative min-w-0 flex-1 @2xl/equipe:max-w-xs">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} aria-label={t("Search members", "Buscar membros")} placeholder={t("Search members...", "Buscar membros…")} className="pl-9" />
          </div>
          <Button variant="outline" size="sm"><Filter aria-hidden /> {t("Filter", "Filtrar")}</Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="m-0 list-none p-0 @xl/equipe:hidden">
            {filtered.map(m => (
              <li key={m.email} className="border-b border-border">
                <LinhaDeLista
                  inicio={avatar(m)}
                  titulo={m.name}
                  descricao={<span className="[overflow-wrap:anywhere]">{m.email}</span>}
                  quebraAcoes
                  fim={
                    <span className="flex flex-wrap items-center gap-2">
                      <ChipDeEstado tom={tomDaFuncao[m.role]}>{bi(roleLabel[m.role])}</ChipDeEstado>
                      <ChipDeEstado tom={tomDoStatus[m.status]}>{bi(statusLabel[m.status])}</ChipDeEstado>
                      {acoes(m)}
                    </span>
                  }
                  className="px-4"
                />
              </li>
            ))}
          </ul>
          <table className="hidden w-full @xl/equipe:table">
            <thead className="sticky top-0 border-b border-border bg-muted">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t("Member", "Membro")}</th>
                <th scope="col" className="px-4 py-2 text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted-foreground">{t("Role", "Função")}</th>
                <th scope="col" className="px-4 py-2 text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted-foreground">Status</th>
                <th scope="col" className="hidden px-4 py-2 text-left text-caption font-semibold uppercase tracking-[0.06em] text-muted-foreground @3xl/equipe:table-cell">{t("Joined", "Entrada")}</th>
                <th scope="col" className="px-4 py-2"><span className="sr-only">{t("Actions", "Ações")}</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.email} className="border-b border-border transition-colors hover:bg-[var(--row-hover)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {avatar(m)}
                      <div className="min-w-0">
                        <div className="text-body-sm font-medium text-foreground">{m.name}</div>
                        <div className="text-label text-muted-foreground [overflow-wrap:anywhere]">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><ChipDeEstado tom={tomDaFuncao[m.role]}>{bi(roleLabel[m.role])}</ChipDeEstado></td>
                  <td className="px-4 py-3"><ChipDeEstado tom={tomDoStatus[m.status]}>{bi(statusLabel[m.status])}</ChipDeEstado></td>
                  <td className="hidden px-4 py-3 text-label text-muted-foreground @3xl/equipe:table-cell">{t("Jul 2026", "jul. de 2026")}</td>
                  <td className="px-4 py-3"><div className="flex justify-end">{acoes(m)}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="hidden px-4 py-2 text-label text-muted-foreground @xl/equipe:block @3xl/equipe:hidden">
            {t("The Joined column appears on wider screens.", "A coluna Entrada aparece em telas mais largas.")}
          </p>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
              <Search aria-hidden className="size-6" />
              <p className="text-body-sm">{t("No members found for", "Nenhum membro encontrado para")} "<strong className="text-foreground">{search}</strong>"</p>
            </div>
          )}
        </div>

        {/* Paginação: numa linha só */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border bg-background px-4 py-2 @2xl/equipe:px-6">
          <span className="text-label text-muted-foreground">{filtered.length} {t("of", "de")} {teamMembers.length} {t("results", "resultados")}</span>
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              {[1, 2, 3].map(p => (
                <PaginationItem key={p}><PaginationLink href="#" onClick={e => e.preventDefault()} isActive={p === 1}>{p}</PaginationLink></PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </TemplateFrame>
  );
}

/* ─────────────────────────────────────────────
   6. Pricing / Plans Template
───────────────────────────────────────────── */
const pricingFeatures = [
  { en: "Searchable public storefront", pt: "Vitrine pública pesquisável" },
  { en: "Product, variant and stock management", pt: "Gestão de produtos, variantes e estoque" },
  { en: "Catalog import and updates", pt: "Importação e atualização do catálogo" },
  { en: "Promotions and contact requests", pt: "Promoções e solicitações de contato" },
  { en: "Findability tasks", pt: "Tarefas de encontrabilidade" },
  { en: "Interest indicators per product", pt: "Indicadores de interesse por produto" },
  { en: "Store discovery funnel", pt: "Funil de descoberta da loja" },
  { en: "Performance-based recommendations", pt: "Recomendações baseadas no desempenho" },
  { en: "Searches with no results and regional gaps", pt: "Buscas sem resultado e lacunas regionais" },
  { en: "Market trends and comparisons", pt: "Tendências e comparativos de mercado" },
];

// "Para quem" (forWhom) é opcional: plano sem esse texto não mostra o bloco.
type Plano = { id: string; name: L; price: number; forWhom?: L; desc: L; included: number; highlight: boolean; icon: typeof Package };

const plans: Plano[] = [
  {
    id: "basico",
    name: { en: "Visibility", pt: "Visibilidade" },
    price: 79,
    forWhom: { en: "Stores and brands that want to showcase their products and win more customers in their area.", pt: "Lojas e marcas que querem destacar seus produtos e conquistar mais clientes na região." },
    desc: { en: "Your searchable storefront, organized products and more ways to be contacted.", pt: "Sua vitrine pesquisável, produtos organizados e mais possibilidades de contato." },
    included: 5,
    highlight: false,
    icon: Package,
  },
  {
    id: "intermediario",
    name: { en: "Performance", pt: "Desempenho" },
    price: 149,
    forWhom: { en: "Businesses that want to understand consumer interest and improve their results.", pt: "Negócios que desejam entender o interesse dos consumidores e melhorar seus resultados." },
    desc: { en: "Everything in the Visibility plan, plus interest and performance analysis and recommendations for your store.", pt: "Todos os recursos do plano Visibilidade, com análise de interesse, desempenho e recomendações para a sua loja." },
    included: 8,
    highlight: true,
    icon: Zap,
  },
  {
    id: "premium",
    name: { en: "Opportunities", pt: "Oportunidades" },
    price: 299,
    forWhom: { en: "Brands that want to identify market demand and discover growth opportunities.", pt: "Marcas que querem identificar demandas do mercado e descobrir oportunidades de crescimento." },
    desc: { en: "All the store's intelligence, with an aggregated view of searches and of offer gaps in the local market.", pt: "Toda a inteligência da loja, com visão agregada das buscas e das lacunas de oferta do mercado local." },
    included: 10,
    highlight: false,
    icon: Building2,
  },
];

/* Controle só da demonstração: liga e desliga o bloco opcional "Para quem" nos cards de preço */
function ChaveParaQuem({ ligado, onChange }: { ligado: boolean; onChange: (v: boolean) => void }) {
  const { t } = useI18n();
  return (
    <div className="mb-4 flex items-center gap-3">
      <Switch id="chave-para-quem" checked={ligado} onCheckedChange={onChange} />
      <Label htmlFor="chave-para-quem" className="font-medium text-foreground">{t("Show “Who it's for”", "Mostrar “Para quem”")}</Label>
    </div>
  );
}

function PricingDemo() {
  const [mostrarParaQuem, setMostrarParaQuem] = useState(true);
  return (
    <>
      <ChaveParaQuem ligado={mostrarParaQuem} onChange={setMostrarParaQuem} />
      <PricingTemplate mostrarParaQuem={mostrarParaQuem} />
    </>
  );
}

function PricingTemplate({ mostrarParaQuem = true }: { mostrarParaQuem?: boolean }) {
  const { t, bi } = useI18n();
  const [annual, setAnnual] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  // Lista de recursos começa recolhida; abrir ou fechar vale para todos os cards, que ficam sempre alinhados
  const [recursosAbertos, setRecursosAbertos] = useState(false);

  return (
    <TemplateFrame>
      <div className="bg-background min-h-[480px] p-4 sm:p-6">
        <div className="text-center mb-8">
          <h2 className="text-h4 font-bold text-foreground mb-1">{t("Plans & Pricing", "Planos e preços")}</h2>
          <p className="text-body-sm text-muted-foreground mb-4">{t("Choose the plan that fits your store. Change whenever you need.", "Escolha o plano que combina com a sua loja. Troque quando precisar.")}</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3">
            <span className={`text-label font-medium ${!annual ? "text-foreground" : "text-muted-foreground"}`}>{t("Monthly", "Mensal")}</span>
            <Switch checked={annual} onCheckedChange={setAnnual} aria-label={t("Yearly billing", "Cobrança anual")} />
            <span className={`text-label font-medium ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              {t("Yearly", "Anual")}
              <span className="ml-1 px-1 py-1 rounded-full bg-success/10 text-success-text text-caption font-bold">-20%</span>
            </span>
          </div>
        </div>

        {/* Colunas pela largura disponível (não pela tela): dentro do protótipo do painel, os 3 cards só ficam lado a lado se couberem */}
        <div className="@container/precos">
        <GradeDeCards className="@4xl/precos:grid-cols-3 gap-5 max-w-md @4xl/precos:max-w-5xl mx-auto">
          {plans.map(plan => {
            const Icon = plan.icon;
            const valor = annual ? Math.round(plan.price * 0.8) : plan.price;
            const forWhom = mostrarParaQuem && plan.forWhom ? bi(plan.forWhom) : null;
            const idLista = `recursos-${plan.id}`;
            const ativo = selecionado === plan.id;
            return (
              <div
                key={plan.id}
                className={`@container relative rounded-lg bg-card p-4 sm:p-6 flex flex-col transition-shadow
                  ${plan.highlight || ativo ? "border-2 border-primary" : "border border-border"}
                  ${ativo ? "ring-4 ring-primary/20" : ""}`}
                style={{ boxShadow: plan.highlight ? "var(--shadow-md)" : "var(--shadow-xs)" }}
              >
                {/* Topo: ícone do plano e, no destacado, o selo no estilo do card com wobble */}
                <div className="mb-4 flex items-center justify-between gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-[var(--primary-muted)] dark:bg-muted shrink-0">
                    <Icon aria-hidden className="h-4 w-4 text-[var(--primary-text,var(--primary))] dark:text-muted-foreground" />
                  </div>
                  {plan.highlight && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-[var(--primary-muted)] px-2 py-1 text-caption font-bold uppercase tracking-[0.06em] text-[var(--primary-text,var(--primary))] whitespace-nowrap">
                      <Star aria-hidden className="h-3 w-3 fill-current" />
                      {t("Recommended", "Recomendado")}
                    </span>
                  )}
                </div>

                <h3 className="mb-2 text-h3 font-black leading-tight tracking-[-0.03em] text-foreground">{bi(plan.name)}</h3>
                <p className="mb-4 text-body-sm leading-relaxed text-muted-foreground">{bi(plan.desc)}</p>

                {/* "Para quem": no máximo 4 linhas, sem reticências; altura de 4 linhas em todos os cards (só cresce, em vez de vazar, quando o card fica estreito demais). No escuro, caixa neutra e só a lâmpada em amarelo */}
                {forWhom && (
                <div className="mb-5 flex gap-2 sm:gap-2 rounded-md border border-warning/30 bg-[var(--warning-muted)] dark:border-border dark:bg-muted px-2 sm:px-3 py-2">
                  <Lightbulb aria-hidden className="mt-1 h-4 w-4 shrink-0 text-warning-text" />
                  <p className="min-h-[5.5em] text-body-sm leading-snug text-foreground">
                    <strong className="font-bold">{t("Who it's for:", "Para quem:")}</strong> {forWhom}
                  </p>
                </div>
                )}

                {/* Ocultar / expandir os recursos do plano */}
                <button
                  type="button"
                  aria-expanded={recursosAbertos}
                  aria-controls={idLista}
                  onClick={() => setRecursosAbertos(v => !v)}
                  className="mb-3 -mx-1 flex items-center justify-between gap-2 rounded-sm px-1 py-1 text-left text-body-sm font-semibold text-foreground transition-colors hover:text-[var(--primary-text,var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{recursosAbertos ? t("Hide plan features", "Ocultar recursos do plano") : t("Show plan features", "Ver recursos do plano")}</span>
                  <span className="flex items-center gap-1 text-label font-medium text-muted-foreground whitespace-nowrap">
                    {t(`${plan.included} of ${pricingFeatures.length}`, `${plan.included} de ${pricingFeatures.length}`)}
                    <ChevronDown aria-hidden className={`h-4 w-4 transition-transform ${recursosAbertos ? "rotate-180" : ""}`} />
                  </span>
                </button>

                {recursosAbertos ? (
                <ul id={idLista} className="space-y-2 flex-1 mb-5">
                  {pricingFeatures.map((f, i) => {
                    const inclui = i < plan.included;
                    return (
                      <li key={f.en} className={`flex items-start gap-2 text-body-sm leading-snug ${inclui ? "text-foreground" : "text-muted-foreground"}`}>
                        <span aria-hidden className={`mt-px h-4 w-4 shrink-0 rounded-full flex items-center justify-center ${inclui ? "bg-[var(--primary-muted)]" : "bg-muted"}`}>
                          {inclui
                            ? <Check className="h-2.5 w-2.5 text-[var(--primary-text,var(--primary))]" strokeWidth={3} />
                            : <Minus className="h-2.5 w-2.5 text-muted-foreground" strokeWidth={3} />}
                        </span>
                        <span>
                          <span className="sr-only">{inclui ? t("Included: ", "Incluído: ") : t("Not included: ", "Não incluído: ")}</span>
                          {bi(f)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                ) : (
                  <div id={idLista} className="flex-1 mb-2" />
                )}

                <div className="mb-4 border-t border-border" />

                {/* Rodapé no estilo do card com wobble: preço à esquerda e ação à direita; empilha quando o card é estreito */}
                <div className="flex flex-col gap-3 @[19rem]:flex-row @[19rem]:items-center @[19rem]:justify-between">
                  <div className="flex items-baseline gap-1 whitespace-nowrap">
                    <span className="text-h3 font-black leading-none tracking-[-0.03em] text-foreground">R$ {valor}</span>
                    <span className="text-label text-muted-foreground">{t("/ month", "/ mês")}</span>
                  </div>
                  <button
                    type="button"
                    aria-pressed={ativo}
                    aria-label={ativo
                      ? `${t("Plan selected", "Plano selecionado")}: ${bi(plan.name)}`
                      : `${t("Select Plan", "Selecionar Plano")} ${bi(plan.name)}`}
                    onClick={() => setSelecionado(plan.id)}
                    className={`h-10 w-full @[19rem]:w-auto px-4 rounded-md border border-primary text-body-sm font-semibold whitespace-nowrap transition-colors inline-flex items-center justify-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                      ${ativo
                        ? "bg-[var(--primary-suave)] text-[var(--primary-text,var(--primary))]"
                        : "bg-card text-[var(--primary-text,var(--primary))] hover:bg-accent"}`}
                  >
                    {ativo && <Check aria-hidden className="h-4 w-4" />}
                    {ativo ? t("Plan selected", "Plano selecionado") : t("Select Plan", "Selecionar Plano")}
                    {!ativo && <ArrowRight aria-hidden className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </GradeDeCards>
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
    color: "bg-info/10 text-info-text",
  },
  {
    icon: Phone,
    label: { en: "Phone", pt: "Telefone" },
    value: "+55 (11) 9 9999-0000",
    desc: { en: "Mon–Fri, 9am–6pm BRT", pt: "Seg–Sex, 9h–18h BRT" },
    color: "bg-success/10 text-success-text",
  },
  {
    icon: MapPin,
    label: { en: "Address", pt: "Endereço" },
    value: { en: "São Paulo, SP — Brazil", pt: "São Paulo, SP — Brasil" } as string | L,
    desc: { en: "Av. Paulista, 1000", pt: "Av. Paulista, 1000" },
    color: "bg-warning/10 text-warning-text",
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
            <div className="h-10 w-10 rounded-md bg-primary/12 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5 text-primary-text" />
            </div>
            <h2 className="text-body font-bold text-foreground mb-1">{t("Contact us", "Fale conosco")}</h2>
            <p className="text-body-sm text-muted-foreground leading-relaxed">
              {t("Have a question, a suggestion, or want to learn more about our plans? Get in touch.", "Tem uma dúvida, uma sugestão ou quer saber mais sobre nossos planos? Entre em contato.")}
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            {contactChannels.map(ch => {
              const Icon = ch.icon;
              return (
                <div key={ch.label.en} className="flex items-start gap-3 p-3 rounded-md border border-border bg-background/60">
                  <div className={`h-8 w-8 rounded-sm flex items-center justify-center shrink-0 ${ch.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-label font-semibold text-foreground [overflow-wrap:anywhere]">{typeof ch.value === "string" ? ch.value : bi(ch.value)}</div>
                    <div className="text-caption text-muted-foreground">{bi(ch.desc)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Social links */}
          <div className="relative z-10 mt-auto pt-4 border-t border-border">
            <p className="text-caption text-muted-foreground mb-3">{t("Follow us", "Siga-nos")}</p>
            <div className="flex items-center gap-2">
              {["LinkedIn", "Twitter", "GitHub"].map(s => (
                <Button key={s} variant="outline" size="sm">{s}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="@container/contato min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success-text" />
              </div>
              <h3 className="text-body-lg font-bold text-foreground mb-2">{t("Message sent!", "Mensagem enviada!")}</h3>
              <p className="text-body-sm text-muted-foreground max-w-xs mb-6">
                {t("Thanks for reaching out. Our team will get back to you within 24 business hours.", "Obrigado pelo contato. Nossa equipe responderá em até 24 horas úteis.")}
              </p>
              <Button variant="outline" onClick={() => setSent(false)}>{t("Send another message", "Enviar outra mensagem")}</Button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4 max-w-md">
              <div>
                <h3 className="text-body font-bold text-foreground mb-1">{t("New message", "Nova mensagem")}</h3>
                <p className="text-label text-muted-foreground">{t("Fill out the form below and we will get back to you shortly.", "Preencha o formulário abaixo e retornaremos em breve.")}</p>
              </div>

              {/* Nome e e-mail: um por linha no celular, lado a lado a partir de 28rem */}
              <div className="grid gap-4 @md/contato:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ct-nome">{t("Name", "Nome")}</Label>
                  <div className="relative">
                    <User aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="ct-nome" required type="text" placeholder={t("Your name", "Seu nome")} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ct-email">E-mail</Label>
                  <div className="relative">
                    <AtSign aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="ct-email" required type="email" placeholder={t("you@email.com", "voce@email.com")} className="pl-9" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ct-tel">{t("Phone", "Telefone")} <span className="font-normal text-muted-foreground">({t("optional", "opcional")})</span></Label>
                <div className="relative">
                  <Phone aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="ct-tel" type="tel" placeholder="+55 (11) 9 0000-0000" className="pl-9" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ct-assunto">{t("Subject", "Assunto")}</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="ct-assunto" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {subjects.map(x => <SelectItem key={x.en} value={x.en}>{bi(x)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ct-msg">{t("Message", "Mensagem")}</Label>
                <Textarea id="ct-msg" required rows={4} placeholder={t("Describe your question or request in detail...", "Descreva sua dúvida ou solicitação em detalhes…")} />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox id="consent" required className="mt-0.5" />
                <Label htmlFor="consent" className="text-body-sm font-normal leading-snug text-muted-foreground">
                  {t("I agree to the Terms of Use and the Privacy Policy.", "Concordo com os Termos de Uso e a Política de Privacidade.")}
                </Label>
              </div>

              <Button type="submit" className="w-full"><Send aria-hidden />{t("Send message", "Enviar mensagem")}</Button>
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
  const [estadoDoPainel, setEstadoDoPainel] = useState("pendencias");
  return (
    <div className="space-y-16">
      <div className="mb-2">
        <h2 className="text-h3 font-semibold tracking-[-0.02em] text-foreground mb-1">{t("Templates", "Templates")}</h2>
        <p className="text-body text-muted-foreground">
          {t("Ready-to-use layouts that combine design system components into real product screens.", "Layouts prontos para usar que combinam componentes do design system em telas reais de produto.")}
        </p>
      </div>

      {/* 0 — Painel (casca + Início), com as peças do painel do DS */}
      <section id="template-painel">
        <TemplateLabel icon={PanelsTopLeft} label={t("Panel (shell and home)", "Painel (casca e Início)")} />
        <p className="mb-4 max-w-3xl text-body leading-relaxed text-muted-foreground">
          {t(
            "The approved panel frame: white top bar across the whole width, side menu with ≡ MENU that collapses from 240 to 64 px and pushes the content, grey page background, page header outside the cards and the content in border-only cards. Names and numbers are examples. Switch the state below to see the home page with pending items and all caught up.",
            "A moldura aprovada dos painéis: barra superior branca na largura toda, menu lateral com ≡ MENU que recolhe de 240 para 64 px e empurra o conteúdo, fundo cinza, cabeçalho da página fora dos cards e o conteúdo em cards só com borda. Nomes e números são exemplos. Troque o estado abaixo para ver a Início com pendências e em dia.",
          )}
        </p>
        <SegmentedControl
          size="sm"
          aria-label={t("Example state", "Estado do exemplo")}
          value={estadoDoPainel}
          onValueChange={setEstadoDoPainel}
          options={[{ value: "pendencias", label: t("Pending items", "Com pendências") }, { value: "em-dia", label: t("All caught up", "Tudo em dia") }]}
          className="mb-4"
        />
        <TemplateFrame><PainelTemplate emDia={estadoDoPainel === "em-dia"} /></TemplateFrame>
      </section>

      <section id="template-painel-pecas">
        <SectionHeader
          title={t("Panel pieces", "Peças do painel")}
          description={t("The components of the panel template, with variations, states and accessibility.", "Os componentes do template do painel, com variações, estados e acessibilidade.")}
        />
        <PecasDoPainel />
      </section>

      {/* 1 — Dashboard */}
      <section id="template-dashboard">
        <TemplateLabel icon={LayoutDashboard} label="Dashboard" />
        <TemplateFrame><DashboardTemplate /></TemplateFrame>
      </section>

      {/* 2 — Settings */}
      <section id="template-settings">
        <TemplateLabel icon={Settings} label={t("Settings Page", "Página de configurações")} />
        <TemplateFrame><SettingsTemplate /></TemplateFrame>
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
        <TemplateFrame><InboxTemplate /></TemplateFrame>
      </section>

      {/* 6 — Pricing */}
      <section id="template-pricing">
        <TemplateLabel icon={CreditCard} label={t("Pricing & Plans", "Preços e planos")} />
        <PricingDemo />
      </section>

      {/* 7 — Contact */}
      <section id="template-contact">
        <TemplateLabel icon={MessageSquare} label={t("Contact", "Contato")} />
        <ContactTemplate />
      </section>

      {/* 8 — Landing Page */}
      <section id="template-landing">
        <TemplateLabel icon={Layout} label="Landing Page" />
        <TemplateFrame><LandingTemplate /></TemplateFrame>
      </section>

      {/* ── Tokens ── */}
      <section id="templates-tokens" className="space-y-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold tracking-[-0.02em] text-foreground">Tokens</h2>
          <p className="text-body-sm text-muted-foreground mt-1">{t("Core CSS custom properties shared across all templates.", "Propriedades CSS personalizadas principais compartilhadas por todos os templates.")}</p>
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
      { name: "--primary-muted",      description: t("Tinted CTA zone", "Área de CTA com tom"),           light: "#FAE4E4", dark: "rgba(212,77,77,0.15)", isColor: true },
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
