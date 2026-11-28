import React, { useEffect, useState } from "react";
import {
  Activity, ArrowLeft, ArrowRight, BarChart2, Bell, Check, CheckCircle, ChevronLeft, ChevronRight, Clock, CreditCard,
  DollarSign, FileText, Globe, HelpCircle, Home, Inbox, Info, Layers, LayoutDashboard, Mail, Menu, MessageSquare,
  Moon, PlayCircle, Plus, Rocket, Send, Settings, ShieldCheck, ShoppingCart, Sparkles, Star, Sun, TrendingUp,
  UserPlus, Users, Zap, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, BarChart as ReBarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as ReTooltip,
} from "recharts";
import { useI18n } from "../../i18n";
import {
  MenuLateralProvider, MenuLateral, NavDoMenu, TopoDoMenu, ItemDoMenu, GrupoDoMenu, BarraSuperiorDoPainel,
  BotaoDeNotificacoes, GatilhoDaConta, ContadorDoPainel,
} from "../ui/painel-shell";
import { CabecalhoDaPagina } from "../ui/painel-cabecalho";
import { CardIndicador, CardComCabecalho, IconeComBase } from "../ui/painel-dados";
import { GradeDeCards } from "../ui/grade-de-cards";
import { LinhaDeLista } from "../ui/linha-de-lista";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { SegmentedControl } from "../ui/segmented-control";
import { SidePanel, SidePanelBody, SidePanelContent, SidePanelHeader } from "../ui/side-panel";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Timeline } from "../ui/timeline";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { RodapeSite } from "../ui/rodape-site";
import { CaixaDeEntrada } from "../ui/caixa-de-entrada";
import { EstadoVazio } from "../ui/estado-vazio";
import { BarraDeNumeros } from "../ui/barra-de-numeros";
import { CardDeDepoimento } from "../ui/card-de-depoimento";

/* ─────────────────────────────────────────────
   Templates de painel que se adaptam ao celular (27/11/2026).
   Dashboard, Configurações e Caixa de entrada usam a casca do painel do DS (barra superior, menu lateral que recolhe e
   vira gaveta abaixo de 56rem de largura) e as peças do painel: nada de colunas fixas espremidas no celular.
   Os nomes e números são exemplos.
───────────────────────────────────────────── */

type L = { en: string; pt: string };
type ItemDaCasca = { id: string; icone: React.ReactNode; rotulo: string };

/** Casca dos templates: a mesma do template do Painel, com o menu montado a partir de uma lista de itens. */
function CascaDoTemplate({ itens, ativo, chave, children }: { itens: ItemDaCasca[]; ativo: string; chave: string; children: React.ReactNode }) {
  const { t } = useI18n();
  const [gaveta, setGaveta] = useState(false);
  const menu = (
    <>
      <TopoDoMenu rotuloRecolher={t("Collapse menu", "Recolher menu")} rotuloExpandir={t("Expand menu", "Expandir menu")} />
      <NavDoMenu aria-label={t("Pages", "Páginas")}>
        <GrupoDoMenu>
          {itens.map(i => (
            <ItemDoMenu key={i.id} href={`#${i.id}`} icone={i.icone} ativo={i.id === ativo} onClick={e => { e.preventDefault(); setGaveta(false); }}>
              {i.rotulo}
            </ItemDoMenu>
          ))}
        </GrupoDoMenu>
      </NavDoMenu>
    </>
  );
  return (
    <MenuLateralProvider chave={chave}>
      <div className="@container/painel relative flex h-[min(760px,88vh)] min-h-[560px] flex-col overflow-hidden bg-background">
        <BarraSuperiorDoPainel>
          <Button variant="ghost" size="icon" onClick={() => setGaveta(true)} aria-label={t("Open menu", "Abrir menu")} aria-expanded={gaveta} className="size-11 @4xl/painel:hidden">
            <Menu aria-hidden className="size-5" />
          </Button>
          <span className="flex min-w-0 items-center gap-2">
            <IconeComBase tom="marca" tamanho="sm"><Zap /></IconeComBase>
            <span className="whitespace-nowrap text-body font-semibold tracking-tight text-foreground">DaniMS</span>
          </span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <BotaoDeNotificacoes naoLidas={3} aria-label={t("Notifications, 3 unread", "Notificações, 3 não lidas")} />
            <GatilhoDaConta nome="Dani Moscatelli" aria-label={t("Account of Dani Moscatelli", "Conta de Dani Moscatelli")} />
          </div>
        </BarraSuperiorDoPainel>
        <div className="relative flex min-h-0 flex-1">
          <MenuLateral aria-label={t("Side menu", "Menu lateral")} className="hidden @4xl/painel:flex">{menu}</MenuLateral>
          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
            <div className="mx-auto w-full max-w-[72rem] p-4 sm:p-6 lg:p-8">
              <div className="@container/conteudo">{children}</div>
            </div>
          </div>
        </div>
      </div>
      <SidePanel open={gaveta} onOpenChange={setGaveta}>
        <SidePanelContent side="left" width="md" closeLabel={t("Close menu", "Fechar menu")} className="sm:w-80 md:w-80">
          <SidePanelHeader title={t("Menu", "Menu")} />
          <SidePanelBody className="px-3 sm:px-3">{menu}</SidePanelBody>
        </SidePanelContent>
      </SidePanel>
    </MenuLateralProvider>
  );
}

/* ─────────────────────────────────────────────
   1. Dashboard
───────────────────────────────────────────── */
const sparkData = [40, 52, 44, 68, 55, 72, 88, 76, 92, 84, 98, 110].map(v => ({ v }));

const kpis: { rotulo: L; valor: number; variacao: number; icone: React.ElementType }[] = [
  { rotulo: { en: "Revenue (US$)", pt: "Receita (US$)" }, valor: 84320, variacao: 12.5, icone: DollarSign },
  { rotulo: { en: "Active users", pt: "Usuários ativos" }, valor: 12840, variacao: 8.2, icone: Users },
  { rotulo: { en: "Orders", pt: "Pedidos" }, valor: 3204, variacao: 5.1, icone: ShoppingCart },
  { rotulo: { en: "Churn rate (%)", pt: "Taxa de churn (%)" }, valor: 1.8, variacao: -0.3, icone: Activity },
];

const atividade: { pessoa: string; acao: L; quando: L; tom: "sucesso" | "info" | "erro" | "aviso"; estado: L }[] = [
  { pessoa: "Ana Lima", acao: { en: "purchased Pro plan", pt: "comprou o plano Pro" }, quando: { en: "2m ago", pt: "há 2 min" }, tom: "sucesso", estado: { en: "Sale", pt: "Venda" } },
  { pessoa: "Carlos M.", acao: { en: "opened a support ticket", pt: "abriu um chamado de suporte" }, quando: { en: "14m ago", pt: "há 14 min" }, tom: "info", estado: { en: "Support", pt: "Suporte" } },
  { pessoa: "Beatriz S.", acao: { en: "cancelled subscription", pt: "cancelou a assinatura" }, quando: { en: "1h ago", pt: "há 1 h" }, tom: "erro", estado: { en: "Cancelled", pt: "Cancelou" } },
  { pessoa: "Diego F.", acao: { en: "upgraded to Enterprise", pt: "fez upgrade para Enterprise" }, quando: { en: "3h ago", pt: "há 3 h" }, tom: "sucesso", estado: { en: "Upgrade", pt: "Upgrade" } },
  { pessoa: "Fernanda P.", acao: { en: "submitted a review", pt: "enviou uma avaliação" }, quando: { en: "5h ago", pt: "há 5 h" }, tom: "aviso", estado: { en: "Review", pt: "Avaliação" } },
];

const MENU_DASHBOARD = (t: (en: string, pt: string) => string): ItemDaCasca[] => [
  { id: "dashboard", icone: <LayoutDashboard />, rotulo: "Dashboard" },
  { id: "analises", icone: <BarChart2 />, rotulo: t("Analytics", "Análises") },
  { id: "clientes", icone: <Users />, rotulo: t("Customers", "Clientes") },
  { id: "pedidos", icone: <ShoppingCart />, rotulo: t("Orders", "Pedidos") },
  { id: "relatorios", icone: <FileText />, rotulo: t("Reports", "Relatórios") },
  { id: "configuracoes", icone: <Settings />, rotulo: t("Settings", "Configurações") },
];

export function DashboardTemplate() {
  const { t, bi } = useI18n();
  return (
    <CascaDoTemplate itens={MENU_DASHBOARD(t)} ativo="dashboard" chave="dm-ds:template-dashboard:menu-recolhido">
      <div className="space-y-6">
        <CabecalhoDaPagina
          titulo="Dashboard"
          descricao={t("July 29, 2026", "29 de julho de 2026")}
          acoes={<Button><Plus aria-hidden />{t("New report", "Novo relatório")}</Button>}
        />
        <section aria-label={t("Summary", "Resumo")}>
          {/* 2 × 2 até um conteúdo de 44rem, 4 lado a lado a partir dele; no celular, só rótulo e número */}
          <GradeDeCards colunas={{ base: 2 }} className="gap-4 @min-[44rem]/conteudo:grid-cols-4">
            {kpis.map(k => {
              const Icone = k.icone;
              return (
                <CardIndicador
                  key={k.rotulo.en}
                  compacto
                  soNumeroNoCelular
                  icone={<Icone />}
                  valor={k.valor}
                  rotulo={bi(k.rotulo)}
                  variacao={k.variacao}
                  comparacao={t("vs. last month", "vs. mês passado")}
                />
              );
            })}
          </GradeDeCards>
        </section>
        {/* Gráfico e atividade lado a lado só quando o conteúdo tem 56rem; antes, um embaixo do outro, na largura toda. */}
        <GradeDeCards colunas={1} className="gap-4 @min-[56rem]/conteudo:grid-cols-[minmax(0,1fr)_20rem]">
          <CardComCabecalho
            icone={<TrendingUp />}
            titulo={t("Revenue overview", "Visão geral da receita")}
            descricao={t("Last 12 months", "Últimos 12 meses")}
            acao={<ChipDeEstado tom="sucesso">+12,5%</ChipDeEstado>}
          >
            <div className="h-40" role="img" aria-label={t("Revenue grew from 40 to 110 thousand in 12 months.", "A receita cresceu de 40 para 110 mil em 12 meses.")}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tplReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <ReTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" }} itemStyle={{ color: "var(--popover-foreground)" }} />
                  <Area type="monotone" dataKey="v" stroke="var(--primary)" strokeWidth={2} fill="url(#tplReceita)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardComCabecalho>
          <CardComCabecalho icone={<Activity />} tom="neutro" titulo={t("Recent activity", "Atividade recente")} sangria>
            <ul>
              {atividade.map(a => (
                <li key={a.pessoa}>
                  <LinhaDeLista
                    titulo={a.pessoa}
                    descricao={bi(a.acao)}
                    quebraAcoes
                    fim={
                      <span className="flex items-center gap-2">
                        <ChipDeEstado tom={a.tom}>{bi(a.estado)}</ChipDeEstado>
                        <span className="text-body-sm tabular-nums text-muted-foreground">{bi(a.quando)}</span>
                      </span>
                    }
                    className="px-5 sm:px-6"
                  />
                </li>
              ))}
            </ul>
          </CardComCabecalho>
        </GradeDeCards>
      </div>
    </CascaDoTemplate>
  );
}

/* ─────────────────────────────────────────────
   2. Configurações
───────────────────────────────────────────── */
const MENU_CONFIG = (t: (en: string, pt: string) => string): ItemDaCasca[] => [
  { id: "inicio", icone: <Home />, rotulo: t("Home", "Início") },
  { id: "equipe", icone: <Users />, rotulo: t("Team", "Equipe") },
  { id: "configuracoes", icone: <Settings />, rotulo: t("Settings", "Configurações") },
  { id: "ajuda", icone: <HelpCircle />, rotulo: t("Help", "Ajuda") },
];

export function SettingsTemplate() {
  const { t } = useI18n();
  const [aba, setAba] = useState("perfil");
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [escuro, setEscuro] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const obs = new MutationObserver(() => setEscuro(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!salvo) return;
    const id = window.setTimeout(() => setSalvo(false), 2400);
    return () => window.clearTimeout(id);
  }, [salvo]);

  const campos = [
    { id: "nome", rotulo: t("Full name", "Nome completo"), valor: "Dani Moscatelli", tipo: "text" },
    { id: "email", rotulo: "E-mail", valor: "dani@moscatelli.co", tipo: "email" },
    { id: "cargo", rotulo: t("Job title", "Cargo"), valor: t("Design Lead", "Líder de design"), tipo: "text" },
    { id: "empresa", rotulo: t("Company", "Empresa"), valor: "Moscatelli Co.", tipo: "text" },
  ];

  return (
    <CascaDoTemplate itens={MENU_CONFIG(t)} ativo="configuracoes" chave="dm-ds:template-config:menu-recolhido">
      <Tabs value={aba} onValueChange={setAba} className="gap-6">
        <CabecalhoDaPagina
          titulo={t("Settings", "Configurações")}
          descricao={t("Manage your account preferences.", "Gerencie as preferências da sua conta.")}
          abas={
            <TabsList aria-label={t("Settings sections", "Seções das configurações")}>
              <TabsTrigger value="perfil">{t("Profile", "Perfil")}</TabsTrigger>
              <TabsTrigger value="notificacoes">{t("Notifications", "Notificações")}</TabsTrigger>
              <TabsTrigger value="aparencia">{t("Appearance", "Aparência")}</TabsTrigger>
              <TabsTrigger value="cobranca">{t("Billing", "Cobrança")}</TabsTrigger>
            </TabsList>
          }
        />

        <TabsContent value="perfil">
          <Card orientacao="vertical" className="max-w-2xl">
            <CardContent className="space-y-6 pb-6 pt-6">
              <div className="flex items-center gap-4">
                <IconeComBase tom="marca" tamanho="lg" redonda>{<Users />}</IconeComBase>
                <div className="min-w-0">
                  <p className="text-body font-semibold text-foreground">Dani Moscatelli</p>
                  <p className="truncate text-body-sm text-muted-foreground">dani@moscatelli.co</p>
                </div>
              </div>
              {/* Um campo por linha no celular; dois por linha a partir de 32rem de conteúdo. */}
              <div className="grid gap-4 @min-[32rem]/conteudo:grid-cols-2">
                {campos.map(c => (
                  <div key={c.id} className="space-y-2">
                    <Label htmlFor={`tpl-config-${c.id}`}>{c.rotulo}</Label>
                    <Input id={`tpl-config-${c.id}`} type={c.tipo} defaultValue={c.valor} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-3 border-t">
              {salvo && <span role="status" className="flex items-center gap-1 text-body-sm font-medium text-success-text motion-safe:animate-in motion-safe:fade-in"><CheckCircle aria-hidden className="size-4" />{t("Saved", "Salvo")}</span>}
              <Button onClick={() => setSalvo(true)}>{t("Save changes", "Salvar alterações")}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card orientacao="vertical" className="max-w-2xl gap-0 py-2">
            <ul>
              {[
                { id: "email", rotulo: t("Email notifications", "Notificações por e-mail"), desc: t("Receive updates by email.", "Receba as novidades por e-mail."), v: email, set: setEmail },
                { id: "push", rotulo: t("Push notifications", "Notificações no navegador"), desc: t("Receive alerts in the browser.", "Receba alertas no navegador."), v: push, set: setPush },
              ].map(n => (
                <li key={n.id}>
                  <LinhaDeLista
                    as="label"
                    htmlFor={`tpl-notif-${n.id}`}
                    titulo={n.rotulo}
                    descricao={n.desc}
                    quebraAcoes={false}
                    alinhar="centro"
                    fim={<Switch id={`tpl-notif-${n.id}`} checked={n.v} onCheckedChange={n.set} />}
                    className="px-6"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia">
          <Card orientacao="vertical" className="max-w-2xl">
            <CardContent className="space-y-3 pt-6">
              <p id="tpl-tema" className="text-body-sm font-semibold text-foreground">{t("Theme", "Tema")}</p>
              <SegmentedControl
                aria-labelledby="tpl-tema"
                fullWidth
                value={escuro ? "escuro" : "claro"}
                onValueChange={v => document.documentElement.classList.toggle("dark", v === "escuro")}
                options={[
                  { value: "claro", label: t("Light", "Claro"), icon: <Sun /> },
                  { value: "escuro", label: t("Dark", "Escuro"), icon: <Moon /> },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cobranca">
          <div className="max-w-2xl space-y-4">
            <CardComCabecalho
              icone={<Star />}
              titulo={t("Pro plan", "Plano Pro")}
              descricao={t("$49/month · Renews Aug 1, 2026", "US$ 49/mês · Renova em 1º de ago. de 2026")}
              acao={<Button variant="outline" size="sm">{t("Manage", "Gerenciar")}</Button>}
            />
            <CardComCabecalho
              icone={<CreditCard />}
              tom="neutro"
              titulo="•••• 4242"
              descricao={t("Expires 09/27", "Expira em 09/27")}
              acao={<Button variant="outline" size="sm">{t("Update", "Atualizar")}</Button>}
            />
          </div>
        </TabsContent>
      </Tabs>
    </CascaDoTemplate>
  );
}

/* ─────────────────────────────────────────────
   3. Caixa de entrada
───────────────────────────────────────────── */
type TomDaNotificacao = "sucesso" | "info" | "erro" | "aviso";
const notificacoes: { icone: React.ElementType; tom: TomDaNotificacao; titulo: L; corpo: L; quando: L; lida: boolean }[] = [
  { icone: CheckCircle, tom: "sucesso", titulo: { en: "Payment confirmed", pt: "Pagamento confirmado" }, corpo: { en: "Invoice #INV-2048 for $1,200 has been paid.", pt: "A fatura #INV-2048 de US$ 1.200 foi paga." }, quando: { en: "Just now", pt: "Agora mesmo" }, lida: false },
  { icone: UserPlus, tom: "info", titulo: { en: "New team member", pt: "Novo membro na equipe" }, corpo: { en: "Ana Lima joined your workspace as Editor.", pt: "Ana Lima entrou no seu espaço de trabalho como editora." }, quando: { en: "5m ago", pt: "há 5 min" }, lida: false },
  { icone: XCircle, tom: "erro", titulo: { en: "Deployment failed", pt: "Falha na publicação" }, corpo: { en: "Build #1049 failed during the test stage.", pt: "A versão #1049 falhou na etapa de testes." }, quando: { en: "22m ago", pt: "há 22 min" }, lida: false },
  { icone: Bell, tom: "aviso", titulo: { en: "Usage limit approaching", pt: "Limite de uso próximo" }, corpo: { en: "You've used 87% of your monthly API quota.", pt: "Você usou 87% da sua cota mensal de API." }, quando: { en: "1h ago", pt: "há 1 h" }, lida: true },
  { icone: Clock, tom: "info", titulo: { en: "Scheduled maintenance", pt: "Manutenção programada" }, corpo: { en: "Planned downtime Sunday Jul 30 from 02:00–04:00 UTC.", pt: "Indisponibilidade planejada no domingo, 30 de jul., das 2h às 4h (UTC)." }, quando: { en: "3h ago", pt: "há 3 h" }, lida: true },
  { icone: Info, tom: "info", titulo: { en: "New feature: Templates", pt: "Novo recurso: Templates" }, corpo: { en: "Check out the new templates section in the Design System.", pt: "Conheça a nova seção de templates no Design System." }, quando: { en: "Yesterday", pt: "Ontem" }, lida: true },
  { icone: Star, tom: "aviso", titulo: { en: "Review requested", pt: "Revisão solicitada" }, corpo: { en: "Diego F. requested a review on PR #204.", pt: "Diego F. pediu uma revisão no PR #204." }, quando: { en: "2d ago", pt: "há 2 dias" }, lida: true },
];

/**
 * Caixa de entrada: a CaixaDeEntrada do DS (27/11/2026). Lista e leitura lado a lado a partir de 42rem de largura da
 * própria caixa; antes disso, uma coisa por vez, com Voltar. Abrir uma notificação marca como lida.
 */
export function InboxTemplate() {
  const { t, bi } = useI18n();
  const [lidas, setLidas] = useState<Set<number>>(() => new Set(notificacoes.flatMap((n, i) => (n.lida ? [i] : []))));
  // Nenhuma aberta no início: no celular a lista vem primeiro; no computador, a leitura mostra "Selecione uma notificação".
  const [aberta, setAberta] = useState<string | null>(null);
  const naoLidas = notificacoes.length - lidas.size;
  const itens = notificacoes.map((n, i) => {
    const Icone = n.icone;
    const lida = lidas.has(i);
    return {
      id: String(i),
      titulo: bi(n.titulo),
      resumo: bi(n.corpo),
      quando: <span className="tabular-nums">{bi(n.quando)}</span>,
      lida,
      inicio: <IconeComBase tom={lida ? "neutro" : "marca"} tamanho="sm"><Icone /></IconeComBase>,
    };
  });
  const abrir = (id: string | null) => {
    setAberta(id);
    if (id !== null) setLidas(prev => new Set(prev).add(Number(id)));
  };

  return (
    <div className="h-[min(620px,88vh)] min-h-[520px] bg-background">
      <CaixaDeEntrada
        className="rounded-none border-0"
        itens={itens}
        aberta={aberta}
        onAbrir={abrir}
        rotulo={t("Notifications", "Notificações")}
        textos={{ voltar: t("Back", "Voltar"), naoLida: t("unread", "não lida") }}
        topo={
          <div className="flex items-center gap-2">
            <h3 className="text-body font-bold text-foreground">{t("Inbox", "Caixa de entrada")}</h3>
            {naoLidas > 0 && <ContadorDoPainel valor={naoLidas} rotulo={t("unread", "não lidas")} />}
          </div>
        }
        semSelecao={<EstadoVazio tamanho="sm" icone={<Inbox />} titulo={t("Select a notification", "Selecione uma notificação")} descricao={t("The open notification appears here.", "A notificação aberta aparece aqui.")} />}
        renderLeitura={item => {
          const n = notificacoes[Number(item.id)];
          return (
            // Ícone numa coluna própria; título, texto e ações na coluna do texto (mesma borda esquerda).
            <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
              <IconeComBase tom="marca">{React.createElement(n.icone)}</IconeComBase>
              <div className="min-w-0">
                <h3 className="text-body-lg font-semibold text-foreground [text-wrap:pretty]">{bi(n.titulo)}</h3>
                <p className="text-body-sm text-muted-foreground">{bi(n.quando)}</p>
                <p className="mt-4 text-body leading-relaxed text-foreground">{bi(n.corpo)}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button>{t("View details", "Ver detalhes")}</Button>
                  <Button variant="outline">{t("Dismiss", "Dispensar")}</Button>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   4. Landing page
   Tudo pela largura da própria landing (consulta de contêiner): no celular, uma coluna; menu em folha inferior;
   números em 2 × 2; bento e depoimentos com um card por linha; um card por plano no lugar da tabela; canais um por
   linha; confiança em cima e formulário embaixo. A partir de 42rem de largura, a versão de computador.
───────────────────────────────────────────── */
const revenueData = [
  { m: "Jan", mp: "Jan", v: 38 }, { m: "Feb", mp: "Fev", v: 52 }, { m: "Mar", mp: "Mar", v: 47 },
  { m: "Apr", mp: "Abr", v: 68 }, { m: "May", mp: "Mai", v: 61 }, { m: "Jun", mp: "Jun", v: 80 },
  { m: "Jul", mp: "Jul", v: 74 }, { m: "Aug", mp: "Ago", v: 93 }, { m: "Sep", mp: "Set", v: 87 },
  { m: "Oct", mp: "Out", v: 105 }, { m: "Nov", mp: "Nov", v: 118 }, { m: "Dec", mp: "Dez", v: 134 },
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



function Secao({ selo, titulo, children, faixa = false, className = "" }: { selo?: string; titulo?: React.ReactNode; children: React.ReactNode; faixa?: boolean; className?: string }) {
  return (
    <section className={`px-4 py-12 @2xl/landing:px-6 ${faixa ? "border-y border-border bg-card/40" : ""} ${className}`}>
      {(selo || titulo) && (
        <div className="mx-auto mb-8 max-w-2xl text-center">
          {selo && <p className="mb-2 text-label font-semibold uppercase tracking-[0.1em] text-primary-text">{selo}</p>}
          {titulo && <h2 className="text-h4 font-bold tracking-tight text-foreground [text-wrap:pretty] @2xl/landing:text-h3">{titulo}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}

export function LandingTemplate() {
  const { t, bi, lang } = useI18n();
  const cel = (v: string | L) => (typeof v === "string" ? v : bi(v));
  const meses = revenueData.map(d => ({ ...d, m: lang === "pt" ? d.mp : d.m }));
  const [email, setEmail] = useState("");
  const [inscrito, setInscrito] = useState(false);
  const [menu, setMenu] = useState(false);
  const [slide, setSlide] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const total = allTestimonials.length;
  const visiveis = [0, 1, 2].map(i => allTestimonials[(slide + i) % total]);
  const links = [t("Product", "Produto"), t("Pricing", "Preços"), "Roadmap", "Blog", t("Contact", "Contato")];
  const planos = [
    { id: "starter" as const, nome: "Starter", preco: t("Free", "Grátis"), destaque: false, acao: t("Get started", "Começar") },
    { id: "pro" as const, nome: "Pro", preco: t("$49/month", "US$ 49/mês"), destaque: true, acao: t("Upgrade", "Fazer upgrade") },
    { id: "enterprise" as const, nome: "Enterprise", preco: t("$199/month", "US$ 199/mês"), destaque: false, acao: t("Talk to sales", "Falar com vendas") },
  ];

  return (
    <div className="@container/landing max-h-[720px] overflow-y-auto bg-background">
      {/* ══ Barra de navegação: no celular, só logo, Entrar e o botão de menu (folha inferior) ══ */}
      <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/90 px-4 py-2 backdrop-blur-xl @2xl/landing:px-6">
        <span className="flex shrink-0 items-center gap-2">
          <IconeComBase tom="marca" tamanho="sm"><Zap /></IconeComBase>
          <span className="text-body font-extrabold tracking-tight text-foreground">DaniMS</span>
        </span>
        <nav aria-label={t("Main", "Principal")} className="hidden flex-1 items-center justify-center gap-1 @3xl/landing:flex">
          {links.map(l => <Button key={l} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">{l}</Button>)}
        </nav>
        <div className="ml-auto flex items-center gap-2 @3xl/landing:ml-0">
          <Button variant="ghost" size="sm" className="hidden @md/landing:inline-flex">{t("Sign in", "Entrar")}</Button>
          <Button size="sm" className="hidden @md/landing:inline-flex">{t("Get started free", "Comece grátis")}</Button>
          <Drawer open={menu} onOpenChange={setMenu}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("Open menu", "Abrir menu")} className="@3xl/landing:hidden"><Menu aria-hidden className="size-5" /></Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader><DrawerTitle>{t("Menu", "Menu")}</DrawerTitle></DrawerHeader>
              <nav aria-label={t("Main", "Principal")} className="flex flex-col px-4">
                {links.map(l => (
                  <button key={l} type="button" onClick={() => setMenu(false)} className="flex min-h-12 items-center justify-between border-b border-border text-left text-body font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
                    {l}<ArrowRight aria-hidden className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </nav>
              <DrawerFooter>
                <Button onClick={() => setMenu(false)}>{t("Get started free", "Comece grátis")}</Button>
                <Button variant="outline" onClick={() => setMenu(false)}>{t("Sign in", "Entrar")}</Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </header>

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden px-4 pb-10 pt-12 @2xl/landing:px-6 @2xl/landing:pt-16">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-72 w-[37.5rem] max-w-full -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-[var(--primary-muted)] px-3 py-1 text-label font-semibold text-primary-text">
            <Sparkles aria-hidden className="size-3.5" /> {t("New: built-in AI in the dashboard", "Novo: IA integrada ao dashboard")}
          </span>
          <h1 className="mb-4 text-h2 font-black leading-[1.1] tracking-[-0.04em] text-foreground [text-wrap:pretty] @2xl/landing:text-display-md">
            {t("The SaaS platform that ", "A plataforma SaaS que ")}<span className="text-primary-text">{t("accelerates your growth", "acelera o seu crescimento")}</span>{t(" for real", " de verdade")}
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-body leading-relaxed text-muted-foreground [text-wrap:pretty]">
            {t("Real-time analytics, smart AI automations and enterprise infrastructure, all in one dashboard your team will love.", "Análises em tempo real, automações inteligentes com IA e infraestrutura de empresa, tudo em um dashboard que sua equipe vai adorar.")}
          </p>
          {inscrito ? (
            <p role="status" className="mx-auto mb-6 inline-flex items-center gap-2 rounded-md border border-success/30 bg-success-muted px-4 py-2 text-body-sm font-medium text-success-text motion-safe:animate-in motion-safe:fade-in">
              <CheckCircle aria-hidden className="size-4" /> {t("Great! We will be in touch soon.", "Ótimo! Entraremos em contato em breve.")}
            </p>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) setInscrito(true); }} className="mx-auto mb-6 flex w-full max-w-md flex-col gap-3 @md/landing:flex-row">
              <Label htmlFor="tpl-landing-email" className="sr-only">E-mail</Label>
              <Input id="tpl-landing-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t("you@email.com", "voce@email.com")} className="flex-1" />
              <Button type="submit"><Rocket aria-hidden />{t("Get started free", "Comece grátis")}</Button>
            </form>
          )}
          {/* Um item por linha no celular, com o check colado ao texto; numa linha só a partir de 42rem. */}
          <ul className="mx-auto flex w-fit flex-col items-start gap-2 text-body-sm text-muted-foreground @2xl/landing:flex-row @2xl/landing:gap-6">
            {[t("No credit card", "Sem cartão de crédito"), t("Setup in 2 minutes", "Configuração em 2 minutos"), t("Cancel anytime", "Cancele quando quiser")].map(item => (
              <li key={item} className="flex items-center gap-2"><Check aria-hidden className="size-4 shrink-0 text-success-text" />{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ Números: a BarraDeNumeros do DS (2 × 2 no estreito, 4 lado a lado a partir de 40rem) ══ */}
      <section aria-label={t("In numbers", "Em números")} className="px-4 py-6 @2xl/landing:px-6">
        <BarraDeNumeros
          centralizar
          className="mx-auto max-w-2xl"
          itens={[
            { valor: "99,99%", rotulo: t("Uptime SLA", "SLA de uptime") },
            { valor: "50 ms", rotulo: t("P99 latency", "Latência P99") },
            { valor: "12 mil+", rotulo: t("Active customers", "Clientes ativos") },
            { valor: "200+", rotulo: t("Integrations", "Integrações") },
          ]}
        />
      </section>

      {/* ══ Produto: os indicadores e o gráfico com as peças do painel ══ */}
      <Secao selo={t("Platform", "Plataforma")} titulo={t("Everything your team needs, in one place", "Tudo o que sua equipe precisa, em um só lugar")}>
        <div className="@container/conteudo mx-auto max-w-2xl space-y-4">
          <GradeDeCards colunas={{ base: 2 }} className="gap-3 @min-[40rem]/conteudo:grid-cols-4">
            <CardIndicador compacto soNumeroNoCelular icone={<DollarSign />} valor={134} rotulo={t("MRR (US$ thousand)", "MRR (mil US$)")} variacao={12.5} />
            <CardIndicador compacto soNumeroNoCelular icone={<Users />} valor={12800} rotulo={t("Users", "Usuários")} variacao={8.2} />
            <CardIndicador compacto soNumeroNoCelular icone={<TrendingUp />} valor={3.4} rotulo={t("Conversion (%)", "Conversão (%)")} variacao={0.5} />
            <CardIndicador compacto soNumeroNoCelular icone={<Activity />} valor={1.8} rotulo="Churn (%)" variacao={-0.3} />
          </GradeDeCards>
          <CardComCabecalho icone={<BarChart2 />} titulo={t("Revenue, last 12 months", "Receita, últimos 12 meses")} acao={<ChipDeEstado tom="sucesso">+12,5%</ChipDeEstado>}>
            <div className="h-36" role="img" aria-label={t("Revenue grew every quarter, from 38 to 134 thousand.", "A receita cresceu a cada trimestre, de 38 para 134 mil.")}>
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={meses} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <ReTooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, color: "var(--popover-foreground)" }} />
                  <Bar dataKey="v" name={t("Revenue", "Receita")} fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </CardComCabecalho>
        </div>
      </Secao>

      {/* ══ Bento: uma coluna no celular; a partir de 42rem, 3 colunas com os cards grandes em 2 ══ */}
      <Secao faixa selo={t("Why DaniMS", "Por que o DaniMS")} titulo={t("Built for teams that scale fast", "Feito para equipes que crescem rápido")}>
        <GradeDeCards colunas={1} className="mx-auto max-w-2xl gap-3 @2xl/landing:grid-cols-3">
          {[
            { icone: <Sparkles />, titulo: t("AI that works for you", "IA que trabalha para você"), texto: t("Proactive suggestions, natural-language automations and automatically generated reports.", "Sugestões proativas, automações em linguagem natural e relatórios gerados automaticamente."), chips: [t("Daily summaries", "Resumos diários"), t("Smart alerts", "Alertas inteligentes"), t("Auto-tagging", "Marcação automática")], largo: true },
            { icone: <ShieldCheck />, titulo: "SOC 2 Type II", texto: t("Compliance and end-to-end encryption by default.", "Conformidade e criptografia de ponta a ponta por padrão."), chips: [], largo: false },
            { icone: <Globe />, titulo: t("20 CDN regions", "20 regiões de CDN"), texto: t("Minimal latency for users in any country.", "Latência mínima para usuários em qualquer país."), chips: [], largo: false },
            { icone: <Layers />, titulo: t("200+ native integrations", "Mais de 200 integrações nativas"), texto: t("Connect with Slack, Notion, HubSpot, Stripe and more in one click.", "Conecte com Slack, Notion, HubSpot, Stripe e mais em um clique."), chips: ["Slack", "Notion", "Stripe", "HubSpot", "Zapier"], largo: true },
          ].map(c => (
            <Card key={c.titulo} className={`gap-3 p-5 ${c.largo ? "@2xl/landing:col-span-2" : ""}`}>
              <IconeComBase tom="marca" tamanho="sm">{c.icone}</IconeComBase>
              <h3 className="text-body font-bold text-foreground [text-wrap:pretty]">{c.titulo}</h3>
              <p className="text-body-sm leading-snug text-muted-foreground">{c.texto}</p>
              {c.chips.length > 0 && <div className="flex flex-wrap gap-2">{c.chips.map(ch => <ChipDeEstado key={ch} tom="neutro">{ch}</ChipDeEstado>)}</div>}
            </Card>
          ))}
        </GradeDeCards>
      </Secao>

      {/* ══ Roadmap: a Timeline do DS ══ */}
      <Secao selo="Roadmap" titulo={t("Where we are and where we are going", "Onde estamos e para onde vamos")}>
        <div className="mx-auto max-w-2xl">
          <Timeline
            animar={false}
            checkNasFeitas
            etapas={roadmapItems.map(r => ({
              icone: r.done ? <CheckCircle /> : <Clock />,
              titulo: <span className="flex flex-wrap items-center gap-2">{bi(r.label)}{r.done && <ChipDeEstado tom="sucesso">{t("Done", "Concluído")}</ChipDeEstado>}</span>,
              descricao: <><span className="block text-label font-semibold text-primary-text">{r.date}</span>{bi(r.desc)}</>,
            }))}
          />
        </div>
      </Secao>

      {/* ══ Planos: um card por plano no celular; a tabela comparativa a partir de 42rem ══ */}
      <Secao faixa selo={t("Plans", "Planos")} titulo={t("Compare and choose your plan", "Compare e escolha seu plano")}>
        <GradeDeCards colunas={1} className="mx-auto max-w-2xl gap-3 @2xl/landing:hidden">
          {planos.map(p => (
            <Card key={p.id} className={p.destaque ? "border-primary/40" : ""}>
              <CardContent className="pb-6 pt-6">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-body-lg font-bold text-foreground">{p.nome}</h3>
                  <span className="text-body-sm font-semibold text-muted-foreground">{p.preco}</span>
                </div>
                <dl className="divide-y divide-border">
                  {comparisonPlans.map((r, i) => (
                    <div key={i} className="flex items-baseline justify-between gap-4 py-2 text-body-sm">
                      <dt className="text-muted-foreground">{cel(r.feature)}</dt>
                      <dd className="text-right font-medium text-foreground">{cel(r[p.id])}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
              <CardFooter className="justify-end border-t">
                <Button variant={p.destaque ? "default" : "outline"}>{p.acao}</Button>
              </CardFooter>
            </Card>
          ))}
        </GradeDeCards>
        <div className="mx-auto hidden max-w-2xl @2xl/landing:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Feature", "Recurso")}</TableHead>
                {planos.map(p => (
                  <TableHead key={p.id} className={`text-center ${p.destaque ? "bg-[var(--primary-muted)]" : ""}`}>
                    <span className={`block font-bold ${p.destaque ? "text-primary-text" : "text-foreground"}`}>{p.nome}</span>
                    <span className="block font-normal text-muted-foreground">{p.preco}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonPlans.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium text-foreground">{cel(r.feature)}</TableCell>
                  {planos.map(p => <TableCell key={p.id} className={`text-center ${p.destaque ? "font-medium text-foreground" : "text-muted-foreground"}`}>{cel(r[p.id])}</TableCell>)}
                </TableRow>
              ))}
              <TableRow className="hover:bg-transparent">
                <TableCell />
                {planos.map(p => <TableCell key={p.id} className="text-center"><Button size="sm" variant={p.destaque ? "default" : "outline"}>{p.acao}</Button></TableCell>)}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Secao>

      {/* ══ Depoimentos: um card por vez no celular; três a partir de 42rem ══ */}
      <Secao selo={t("Testimonials", "Depoimentos")} titulo={t("What our customers say", "O que nossos clientes dizem")}>
        <div className="mx-auto max-w-2xl">
          <GradeDeCards colunas={1} className="mb-4 gap-3 @2xl/landing:grid-cols-3" aria-live="polite">
            {visiveis.map((d, i) => (
              <CardDeDepoimento
                key={`${d.name}-${slide}`}
                nome={d.name}
                cargo={bi(d.role)}
                className={`motion-safe:animate-in motion-safe:fade-in ${i > 0 ? "hidden @2xl/landing:flex" : ""}`}
              >
                {bi(d.text)}
              </CardDeDepoimento>
            ))}
          </GradeDeCards>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSlide(s => (s - 1 + total) % total)} aria-label={t("Previous testimonial", "Depoimento anterior")}><ChevronLeft aria-hidden /></Button>
            <span className="min-w-16 text-center text-body-sm tabular-nums text-muted-foreground" aria-live="polite">{t(`${slide + 1} of ${total}`, `${slide + 1} de ${total}`)}</span>
            <Button variant="outline" size="icon" className="rounded-full" onClick={() => setSlide(s => (s + 1) % total)} aria-label={t("Next testimonial", "Próximo depoimento")}><ChevronRight aria-hidden /></Button>
          </div>
        </div>
      </Secao>

      {/* ══ Perguntas frequentes: o Accordion do DS ══ */}
      <Secao faixa selo={t("FAQ", "Dúvidas")} titulo={t("Frequently asked questions", "Perguntas frequentes")}>
        <Accordion type="single" collapsible className="mx-auto max-w-xl rounded-lg border border-border bg-card px-4">
          {faqItems.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-body-sm font-semibold">{bi(f.q)}</AccordionTrigger>
              <AccordionContent manterNoHtml className="text-body-sm leading-relaxed text-muted-foreground">{bi(f.a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Secao>

      {/* ══ Contato: canais um por linha no celular; confiança em cima e formulário embaixo ══ */}
      <Secao selo={t("Contact", "Contato")} titulo={<>{t("Let's build something ", "Vamos construir algo ")}<span className="text-primary-text">{t("amazing together", "incrível juntos")}</span></>}>
        <div className="mx-auto max-w-2xl space-y-8">
          <p className="mx-auto -mt-4 max-w-md text-center text-body-sm leading-relaxed text-muted-foreground">
            {t("Our team replies in under 2 hours on business days. Pick your preferred channel or fill out the form.", "Nossa equipe responde em menos de 2 horas em dias úteis. Escolha seu canal preferido ou preencha o formulário.")}
          </p>
          <ul className="grid gap-3 @2xl/landing:grid-cols-3">
            {[
              { icone: <Mail />, rotulo: "E-mail", valor: "contato@danimos.co", selo: "< 2h", tom: "sucesso" as const },
              { icone: <PlayCircle />, rotulo: t("Book a demo", "Agendar demonstração"), valor: t("Calendar available", "Agenda disponível"), selo: "30 min", tom: "marca" as const },
              { icone: <MessageSquare />, rotulo: t("Live chat", "Chat ao vivo"), valor: t("Mon–Fri, 9am–6pm", "Seg. a sex., 9h às 18h"), selo: "Online", tom: "sucesso" as const },
            ].map(c => (
              <li key={c.rotulo}>
                <LinhaDeLista
                  as="a"
                  href="#template-landing"
                  onClick={e => e.preventDefault()}
                  inicio={<IconeComBase tom="marca" tamanho="sm">{c.icone}</IconeComBase>}
                  titulo={c.rotulo}
                  descricao={<span className="break-words">{c.valor}</span>}
                  fim={<ChipDeEstado tom={c.tom} aoVivo={c.selo === "Online"} className="whitespace-nowrap">{c.selo}</ChipDeEstado>}
                  quebraAcoes
                  className="h-full rounded-lg border border-border bg-card px-4"
                />
              </li>
            ))}
          </ul>

          <div className="grid items-start gap-6 @2xl/landing:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div className="space-y-4">
              <h3 className="text-body font-bold text-foreground">{t("Why choose us?", "Por que nos escolher?")}</h3>
              <ul className="space-y-2">
                {[
                  { icone: CheckCircle, texto: t("Guaranteed response within 2h", "Resposta garantida em até 2h") },
                  { icone: ShieldCheck, texto: t("100% data protection (SOC 2)", "100% de proteção de dados (SOC 2)") },
                  { icone: Star, texto: t("4.9★ customer satisfaction", "4,9★ de satisfação dos clientes") },
                  { icone: Rocket, texto: t("Free guided onboarding", "Implantação guiada gratuita") },
                ].map(item => {
                  const Icone = item.icone;
                  return <li key={item.texto} className="flex items-start gap-2 text-body-sm text-muted-foreground"><Icone aria-hidden className="mt-1 size-4 shrink-0 text-primary-text" />{item.texto}</li>;
                })}
              </ul>
            </div>

            <Card>
              {enviado ? (
                <CardContent className="flex flex-col items-center gap-3 py-8 text-center motion-safe:animate-in motion-safe:fade-in">
                  <IconeComBase tom="marca" tamanho="lg" redonda><CheckCircle /></IconeComBase>
                  <p className="text-body font-bold text-foreground">{t("Message sent!", "Mensagem enviada!")}</p>
                  <p className="max-w-xs text-body-sm leading-relaxed text-muted-foreground">{t("Our team will reply within 2 hours. Check your inbox.", "Nossa equipe responderá em até 2 horas. Confira sua caixa de entrada.")}</p>
                  <Button variant="outline" onClick={() => setEnviado(false)}>{t("Send another message", "Enviar outra mensagem")}</Button>
                </CardContent>
              ) : (
                <form onSubmit={e => { e.preventDefault(); setEnviado(true); }} className="flex h-full flex-col">
                  <CardContent className="space-y-4 pb-6 pt-6">
                    <div className="grid gap-4 @lg/landing:grid-cols-2">
                      <div className="space-y-2"><Label htmlFor="tpl-ct-nome">{t("Name", "Nome")} *</Label><Input id="tpl-ct-nome" required placeholder={t("Your name", "Seu nome")} /></div>
                      <div className="space-y-2"><Label htmlFor="tpl-ct-email">E-mail *</Label><Input id="tpl-ct-email" type="email" required placeholder={t("you@email.com", "voce@email.com")} /></div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tpl-ct-assunto">{t("Subject", "Assunto")}</Label>
                      <Select defaultValue="suporte">
                        <SelectTrigger id="tpl-ct-assunto" className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suporte">{t("Support", "Suporte")}</SelectItem>
                          <SelectItem value="vendas">{t("Sales", "Vendas")}</SelectItem>
                          <SelectItem value="demo">{t("Demo", "Demonstração")}</SelectItem>
                          <SelectItem value="parcerias">{t("Partnership", "Parcerias")}</SelectItem>
                          <SelectItem value="outro">{t("Other", "Outro")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2"><Label htmlFor="tpl-ct-msg">{t("Message", "Mensagem")} *</Label><Textarea id="tpl-ct-msg" required rows={3} placeholder={t("Describe your question or project.", "Descreva sua dúvida ou projeto.")} /></div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="tpl-ct-termos" required className="mt-1" />
                      <Label htmlFor="tpl-ct-termos" className="text-body-sm font-normal leading-snug text-muted-foreground">{t("I agree to the Terms and the Privacy Policy.", "Concordo com os Termos e a Política de privacidade.")}</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end border-t">
                    <Button type="submit"><Send aria-hidden />{t("Send", "Enviar")}</Button>
                  </CardFooter>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Secao>

      {/* ══ Rodapé: o RodapeSite do DS ══ */}
      <RodapeSite
        variante="claro"
        links={[t("Product", "Produto"), t("Pricing", "Preços"), "Blog", t("Careers", "Carreiras"), t("Contact", "Contato"), t("Terms", "Termos")].map(r => ({ href: "#template-landing", rotulo: r }))}
        rotuloPreferencias={t("Cookies", "Cookies")}
        areaRestrita={null}
        credito={null}
        copyright={t("© 2026 DaniMoscatelli. All rights reserved.", "© 2026 DaniMoscatelli. Todos os direitos reservados.")}
      />
    </div>
  );
}
