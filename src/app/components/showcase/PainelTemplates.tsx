import React, { useState } from "react";
import {
  House, Mail, MailCheck, CalendarCheck, Users, ClipboardList, Rocket, Settings, LogOut, Menu, Info,
} from "lucide-react";
import logoIconRed from "../../../imports/IconeLogo-red.png";
import { useI18n } from "../../i18n";
import {
  MenuLateralProvider, MenuLateral, NavDoMenu, TopoDoMenu, ItemDoMenu, GrupoDoMenu, BarraSuperiorDoPainel,
  BotaoDeNotificacoes, GatilhoDaConta, ContadorDoPainel, CampoDeBuscaGlobal,
} from "../ui/painel-shell";
import { CabecalhoDaPagina } from "../ui/painel-cabecalho";
import { CardIndicador, CardComCabecalho, IconeComBase, LinkVerTudo } from "../ui/painel-dados";
import { GradeDeCards } from "../ui/grade-de-cards";
import { LinhaDeLista } from "../ui/linha-de-lista";
import { AlertaComAcao, BotaoDoAlerta, LinkDoAlerta } from "../ui/alerta-com-acao";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { SidePanel, SidePanelBody, SidePanelContent, SidePanelHeader } from "../ui/side-panel";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { SubTitle, Mono, DoDont } from "./shared/Guidance";

/* ─────────────────────────────────────────────
   Template do painel (casca + Início), com as peças do painel do DS:
   painel-shell, painel-cabecalho e painel-dados. Os nomes e números são exemplos.
───────────────────────────────────────────── */

type Tr = (en: string, pt: string) => string;
type Pagina = "inicio" | "contato" | "reunioes" | "perfis" | "comunicados" | "projetos" | "lancamento";

function ConteudoDoMenu({ ativo, ir, t }: { ativo: Pagina; ir: (p: Pagina) => void; t: Tr }) {
  const clique = (p: Pagina) => (e: React.MouseEvent) => { e.preventDefault(); ir(p); };
  const item = (p: Pagina, icone: React.ReactNode, rotulo: string, contador?: number) => (
    <ItemDoMenu key={p} href={`#${p}`} icone={icone} ativo={ativo === p} contador={contador} rotuloContador={t("unread", "não lidas")} onClick={clique(p)}>
      {rotulo}
    </ItemDoMenu>
  );
  return (
    <>
      <TopoDoMenu rotuloRecolher={t("Collapse menu", "Recolher menu")} rotuloExpandir={t("Expand menu", "Expandir menu")} />
      <NavDoMenu aria-label={t("Panel pages", "Páginas do painel")}>
        <GrupoDoMenu>
          {item("inicio", <House />, t("Home", "Início"))}
          {item("contato", <Mail />, t("Contact", "Contato"), 3)}
          {item("reunioes", <CalendarCheck />, t("Meetings", "Reuniões"))}
        </GrupoDoMenu>
        <GrupoDoMenu expansivel padraoAberto titulo={t("Partners", "Parceiros")} icone={<Users />} contador={2} rotuloContador={t("not seen", "não vistas")} className="mt-0.5">
          {item("perfis", null, t("Profiles and applications", "Perfis e candidaturas"))}
          {item("comunicados", null, t("Announcements", "Comunicados"))}
        </GrupoDoMenu>
        <GrupoDoMenu className="mt-0.5">
          {item("projetos", <ClipboardList />, t("Projects", "Projetos"))}
          {item("lancamento", <Rocket />, t("Launch", "Lançamento"))}
        </GrupoDoMenu>
      </NavDoMenu>
    </>
  );
}

function MenuDaConta({ t }: { t: Tr }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <GatilhoDaConta nome="Ana Oliveira" aria-label={t("Account of Ana Oliveira. Open account menu", "Conta de Ana Oliveira. Abrir menu da conta")} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-[0.875rem] font-semibold text-foreground">Ana Oliveira</span>
          <span className="block text-[0.8125rem] text-muted-foreground">ana@exemplo.com</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem><Settings aria-hidden />{t("Settings", "Configurações")}</DropdownMenuItem>
        <DropdownMenuItem><LogOut aria-hidden />{t("Sign out", "Sair")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const mensagens = [
  { nome: "Ana Ribeiro", detalhe: "Clínica Bem Viver · Diretora de operações", assunto: { en: "Patient experience project", pt: "Projeto de experiência do paciente" }, quando: "27/11", tom: "marca" as const, icone: <Mail />, estado: { en: "Unread", pt: "Não lida" } },
  { nome: "Bruno Lima", detalhe: "Varejo Sul · Gerente", assunto: { en: "Customer research", pt: "Pesquisa com clientes" }, quando: "26/11", tom: "neutro" as const, icone: <MailCheck />, estado: { en: "Answered", pt: "Respondida" } },
  { nome: "Carla Mendes", detalhe: "Coordenadora", assunto: { en: "Journey workshop", pt: "Workshop de jornada" }, quando: "24/11", tom: "neutro" as const, icone: <CalendarCheck />, estado: { en: "Meeting booked", pt: "Reunião marcada" } },
];

function PaginaInicio({ t, bi, emDia }: { t: Tr; bi: (v: { en: string; pt: string }) => string; emDia: boolean }) {
  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo={t("Good morning, **Ana**!", "Bom dia, **Ana**!")}
        descricao={t("What came in through the website: contact messages, partner applications and launch sign-ups.", "O que chegou pelo site: mensagens de contato, candidaturas à Rede de Parceiros e cadastros para o lançamento.")}
      />

      {emDia ? (
        <AlertaComAcao tom="sucesso" titulo={t("All caught up", "Tudo em dia")}>
          {t("New messages and applications will appear here first.", "Mensagens e candidaturas novas aparecem aqui primeiro.")}
        </AlertaComAcao>
      ) : (
        <AlertaComAcao
          tom="info"
          titulo={t("Needs your attention", "Precisa da sua atenção")}
          acoes={<><BotaoDoAlerta>{t("Reply to messages", "Responder mensagens")}</BotaoDoAlerta><LinkDoAlerta>{t("See applications", "Ver candidaturas")}</LinkDoAlerta></>}
        >
          {t("3 unanswered messages, the oldest from 3 days ago. 2 partner applications not seen yet.", "3 mensagens sem resposta, a mais antiga de 3 dias atrás. 2 candidaturas de parceiros ainda não vistas.")}
        </AlertaComAcao>
      )}

      <section aria-label={t("Summary", "Resumo")}>
        <GradeDeCards className="gap-4 @min-[28rem]/conteudo:grid-cols-2 @min-[66rem]/conteudo:grid-cols-4">
          <CardIndicador href="#contato" icone={<Mail />} valor={5} rotulo={t("Messages this week", "Mensagens na semana")} />
          <CardIndicador href="#reunioes" icone={<CalendarCheck />} valor={3} rotulo={t("Meetings booked", "Reuniões marcadas")} />
          <CardIndicador href="#perfis" icone={<Users />} valor={2} rotulo={t("Applications this week", "Candidaturas na semana")} />
          <CardIndicador href="#lancamento" icone={<Rocket />} valor={2} total={9} rotulo={t("Waiting for the launch", "Aguardando o lançamento")} apoio={t("7 already notified", "7 já avisados")} />
        </GradeDeCards>
      </section>

      <CardComCabecalho
        icone={<Mail />}
        titulo={t("Contact", "Contato")}
        descricao={t("Latest messages", "Últimas mensagens")}
        acao={<LinkVerTudo href="#contato" rotulo={t("See all messages", "Ver todas as mensagens")}>{t("See all", "Ver todas")}</LinkVerTudo>}
        sangria
      >
        <ul>
          {mensagens.map(m => (
            <li key={m.nome}>
              <LinhaDeLista
                as="a"
                href="#contato"
                inicio={<IconeComBase tom={m.tom} redonda>{m.icone}</IconeComBase>}
                titulo={<>{m.nome}<span className="sr-only">, {bi(m.estado)}</span></>}
                descricao={`${m.detalhe} · ${bi(m.assunto)}`}
                fim={<span className="text-[0.8125rem] tabular-nums text-muted-foreground">{m.quando}</span>}
                quebraAcoes={false}
                className="px-5 sm:px-6"
              />
            </li>
          ))}
        </ul>
      </CardComCabecalho>
    </div>
  );
}

function PaginaEmBreve({ t }: { t: Tr }) {
  return (
    <CabecalhoDaPagina titulo={t("Coming soon", "Em breve")} descricao={t("This page of the example is not built. Go back to Home in the menu.", "Esta página do exemplo não foi montada. Volte ao Início pelo menu.")} />
  );
}

/** Template do painel: casca (barra superior, menu lateral recolhível, gaveta no celular) e a página Início. */
export function PainelTemplate({ emDia = false }: { emDia?: boolean }) {
  const { t, bi } = useI18n();
  const [pagina, setPagina] = useState<Pagina>("inicio");
  const [gaveta, setGaveta] = useState(false);
  const ir = (p: Pagina) => { setPagina(p); setGaveta(false); };
  return (
    <MenuLateralProvider chave="dm-ds:template-painel:menu-recolhido">
      <div className="@container/painel relative flex h-[min(820px,88vh)] min-h-[560px] flex-col overflow-hidden bg-background">
        <BarraSuperiorDoPainel>
          <Button variant="ghost" size="icon" onClick={() => setGaveta(true)} aria-label={t("Open menu", "Abrir menu")} aria-expanded={gaveta} className="size-11 @4xl/painel:hidden">
            <Menu aria-hidden className="size-5" />
          </Button>
          <span className="flex min-w-0 items-center gap-2.5">
            <img src={logoIconRed} alt="Dani Moscatelli" className="h-8 w-8 shrink-0 object-contain @md/painel:hidden" />
            <img src={logoIconRed} alt="" aria-hidden className="hidden h-8 w-8 shrink-0 object-contain @md/painel:block" />
            {/* Telas estreitas: só o símbolo (como no site do DS), para o nome nunca ser cortado */}
            <span className="hidden whitespace-nowrap text-[1rem] font-semibold tracking-tight text-foreground @md/painel:inline">Dani Moscatelli</span>
          </span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <BotaoDeNotificacoes naoLidas={7} aria-label={t("Notifications, 7 unread", "Notificações, 7 não lidas")} />
            <MenuDaConta t={t} />
          </div>
        </BarraSuperiorDoPainel>

        <div className="relative flex min-h-0 flex-1">
          <MenuLateral aria-label={t("Side menu", "Menu lateral")} className="hidden @4xl/painel:flex">
            <ConteudoDoMenu ativo={pagina} ir={ir} t={t} />
          </MenuLateral>
          <div className="@container/conteudo min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
            <main key={pagina} className="mx-auto w-full max-w-[72rem] p-4 animate-in fade-in-0 duration-300 motion-reduce:animate-none sm:p-6 lg:p-8">
              {pagina === "inicio" ? <PaginaInicio t={t} bi={bi} emDia={emDia} /> : <PaginaEmBreve t={t} />}
            </main>
          </div>
        </div>
      </div>

      <SidePanel open={gaveta} onOpenChange={setGaveta}>
        <SidePanelContent side="left" width="md" closeLabel={t("Close menu", "Fechar menu")} className="sm:w-80 md:w-80">
          <SidePanelHeader title={t("Menu", "Menu")} />
          <SidePanelBody className="px-3 sm:px-3">
            <ConteudoDoMenu ativo={pagina} ir={ir} t={t} />
          </SidePanelBody>
        </SidePanelContent>
      </SidePanel>
    </MenuLateralProvider>
  );
}

/* ─────────────────────────────────────────────
   Documentação das peças do painel
───────────────────────────────────────────── */
function Exemplo({ titulo, descricao, children }: { titulo: string; descricao?: string; children: React.ReactNode }) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
        {descricao && <CardDescription>{descricao}</CardDescription>}
      </CardHeader>
      <CardContent className="min-w-0">{children}</CardContent>
    </Card>
  );
}

export function PecasDoPainel() {
  const { t } = useI18n();
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <SubTitle>{t("1. Panel shell (ui/painel-shell)", "1. Casca do painel (ui/painel-shell)")}</SubTitle>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t(
            "White full-width top bar (BarraSuperiorDoPainel) with the logo on the left and the bell and account on the right; below it, the white side menu (MenuLateral) on the grey page background. The ≡ MENU button at the top (TopoDoMenu) collapses it from 240 px to 64 px (icons with a tooltip), from 1024 px up; the menu pushes the content and the choice is saved per panel (MenuLateralProvider chave). Below 1024 px the same items go in a SidePanel side=\"left\".",
            "Barra superior branca na largura toda (BarraSuperiorDoPainel), com o logo à esquerda e o sino e a conta à direita; embaixo, o menu lateral branco (MenuLateral) sobre o fundo cinza da página. O botão ≡ MENU no topo (TopoDoMenu) recolhe de 240 px para 64 px (ícones com dica), a partir de 1024 px; o menu empurra o conteúdo e a escolha fica guardada por painel (chave do MenuLateralProvider). Abaixo de 1024 px, os mesmos itens vão num SidePanel side=\"left\".",
          )}
        </p>
        <GradeDeCards className="gap-4 md:grid-cols-2">
          <Exemplo titulo={t("Menu items and states", "Itens do menu e estados")} descricao={t("Default, active (bg-primary/10 + --primary-text), with counter, and a group. Hover: --accent. Focus: ring.", "Padrão, ativo (bg-primary/10 + --primary-text), com contador e grupo. Hover: --accent. Foco: anel.")}>
            <nav aria-label={t("Example menu", "Menu de exemplo")} className="max-w-[240px] space-y-0.5">
              <ItemDoMenu href="#" icone={<House />} ativo onClick={e => e.preventDefault()}>{t("Home (active)", "Início (ativo)")}</ItemDoMenu>
              <ItemDoMenu href="#" icone={<Mail />} contador={3} rotuloContador={t("unread", "não lidas")} onClick={e => e.preventDefault()}>{t("Contact", "Contato")}</ItemDoMenu>
              <GrupoDoMenu expansivel padraoAberto titulo={t("Partners", "Parceiros")} icone={<Users />} contador={12} rotuloContador={t("not seen", "não vistas")}>
                <ItemDoMenu href="#" onClick={e => e.preventDefault()}>{t("Applications", "Candidaturas")}</ItemDoMenu>
              </GrupoDoMenu>
            </nav>
          </Exemplo>
          <Exemplo titulo={t("Counter and bell", "Contador e sino")} descricao={t("ContadorDoPainel: round, red (--primary-text, 6.2:1 with white) with white bold tabular numbers; two digits become a round-ended pill; above 99, 99+. On the bell it sits on the icon's top-right corner with a 2 px ring.", "ContadorDoPainel: redondo, vermelho (--primary-text, 6,2:1 com o branco) com número branco em negrito e tabular; com dois algarismos vira pílula de pontas redondas; acima de 99, 99+. No sino, fica no canto superior direito do ícone, com anel de 2 px.")}>
            <div className="flex flex-wrap items-center gap-4">
              <ContadorDoPainel valor={3} />
              <ContadorDoPainel valor={12} />
              <ContadorDoPainel valor={240} />
              <span className="inline-flex rounded-md bg-card">
                <BotaoDeNotificacoes naoLidas={0} aria-label={t("Notifications", "Notificações")} />
                <BotaoDeNotificacoes naoLidas={7} aria-label={t("Notifications, 7 unread", "Notificações, 7 não lidas")} />
                <BotaoDeNotificacoes naoLidas={18} aria-label={t("Notifications, 18 unread", "Notificações, 18 não lidas")} />
                <BotaoDeNotificacoes naoLidas={4} indicador="ponto" aria-label={t("Notifications, 4 unread", "Notificações, 4 não lidas")} />
              </span>
            </div>
            <div className="mt-4">
              <CampoDeBuscaGlobal placeholder={t("Search the panel", "Buscar no painel")} />
            </div>
          </Exemplo>
        </GradeDeCards>
      </div>

      <div className="space-y-4">
        <SubTitle>{t("2. Page header, Option A (ui/painel-cabecalho)", "2. Cabeçalho da página, Opção A (ui/painel-cabecalho)")}</SubTitle>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t(
            "CabecalhoDaPagina: title (Heading \"page\", the **highlight** in --primary-text), description in --foreground (on the grey background --muted-foreground is below 4.5:1), actions on the right that move below the text when they do not fit, and optional tabs. It sits outside any card; the content comes below, in cards.",
            "CabecalhoDaPagina: título (Heading \"page\", o **destaque** em --primary-text), descrição em --foreground (no fundo cinza o --muted-foreground fica abaixo de 4,5:1), ações à direita que descem para baixo do texto quando não cabem e abas opcionais. Fica fora de qualquer card; o conteúdo vem embaixo, em cards.",
          )}
        </p>
        <div className="rounded-xl border border-border bg-background p-5 sm:p-6">
          <CabecalhoDaPagina
            nivel={3}
            saudacao={t("Restricted area", "Área restrita")}
            titulo={t("Partner **network**", "Rede de **parceiros**")}
            descricao={t("Profiles, applications and the emails sent to partners.", "Perfis, candidaturas e os e-mails enviados aos parceiros.")}
            acoes={<><Button variant="outline">{t("Export", "Exportar")}</Button><Button>{t("New announcement", "Novo comunicado")}</Button></>}
            abas={
              <Tabs defaultValue="perfis">
                <TabsList aria-label={t("Partner pages", "Páginas de parceiros")}>
                  <TabsTrigger value="perfis">{t("Profiles", "Perfis")}</TabsTrigger>
                  <TabsTrigger value="candidaturas">{t("Applications", "Candidaturas")}</TabsTrigger>
                  <TabsTrigger value="emails">E-mails</TabsTrigger>
                </TabsList>
              </Tabs>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <SubTitle>{t("3. Indicator card (ui/painel-dados › CardIndicador)", "3. Card de indicador (ui/painel-dados › CardIndicador)")}</SubTitle>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t(
            "Label top left, icon with base top right, big number at the bottom so numbers line up across a row. Optional: total (\"of 9\"), support line, trend, explanation, status badge, footer action, and href to make the whole card a link (hover: --primary border at 30% and --row-hover; focus ring on the card). null shows a dash and \"No data\" for screen readers. Put them in a GradeDeCards whose columns follow the container: 4 across only when each card keeps about 15.75rem (a 66rem container), so the label fits on one line; otherwise 2 × 2, and 1 on phones.",
            "Rótulo em cima à esquerda, ícone com base no canto superior direito, número grande na base para os números se alinharem na linha. Opcionais: total (\"de 9\"), linha de apoio, variação, explicação, selo de estado, ação no rodapé e href para o card inteiro virar link (hover: borda --primary a 30% e --row-hover; anel de foco no card). null mostra um traço e \"Sem dado\" para leitores de tela. Use numa GradeDeCards com colunas pelo contêiner: 4 lado a lado só quando cada card tem ao menos ~15,75rem (contêiner de 66rem), para o rótulo caber numa linha; senão 2 × 2, e 1 no celular.",
          )}
        </p>
        <div className="@container/conteudo">
          <GradeDeCards className="gap-4 @min-[28rem]/conteudo:grid-cols-2 @min-[66rem]/conteudo:grid-cols-4">
            <CardIndicador icone={<Users />} valor={48} total={75} rotulo={t("Partners active", "Parceiros ativos")} />
            <CardIndicador icone={<Mail />} valor={1284} rotulo={t("Messages", "Mensagens")} variacao={18.6} comparacao={t("vs. last month", "vs. mês passado")} />
            <CardIndicador href="#" onClick={e => e.preventDefault()} icone={<Mail />} valor={3} rotulo={t("Unanswered (clickable)", "Sem resposta (clicável)")} tom="marca" selo={<Badge variant="outline">{t("oldest: 3 days", "mais antiga: 3 dias")}</Badge>} />
            <CardIndicador icone={<Rocket />} valor={null} rotulo={t("Waiting for launch", "Aguardando o lançamento")} explicacao={t("People who asked to be told when the product launches.", "Pessoas que pediram aviso quando o produto for lançado.")} apoio={t("The count did not load", "A contagem não carregou")} />
          </GradeDeCards>
        </div>
      </div>

      <div className="space-y-4">
        <SubTitle>{t("4. Icon with base (ui/painel-dados › IconeComBase)", "4. Ícone com base (ui/painel-dados › IconeComBase)")}</SubTitle>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t(
            "Only three ways to show an icon, never mixed: pink base + red icon (tom=\"marca\": focus, something to act on, active), grey base + grey icon (tom=\"neutro\": it only identifies; the default in grids of equal cards; paused or record-only items), or no base (inline, beside text, without this component). Sizes sm 32 px, md 40 px (default), lg 48 px; redonda for list rows.",
            "Só três jeitos de mostrar um ícone, nunca misturados: base rosa + ícone vermelho (tom=\"marca\": foco, algo para agir, ativo), base cinza + ícone cinza (tom=\"neutro\": só identifica; padrão em grades de cards iguais; itens pausados ou só de registro), ou sem base (inline, ao lado do texto, sem este componente). Tamanhos sm 32 px, md 40 px (padrão), lg 48 px; redonda para linhas de lista.",
          )}
        </p>
        <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
          {(["sm", "md", "lg"] as const).map(tm => <IconeComBase key={`m${tm}`} tom="marca" tamanho={tm}><Mail /></IconeComBase>)}
          <span aria-hidden className="h-8 w-px bg-border" />
          {(["sm", "md", "lg"] as const).map(tm => <IconeComBase key={`n${tm}`} tom="neutro" tamanho={tm}><MailCheck /></IconeComBase>)}
          <span aria-hidden className="h-8 w-px bg-border" />
          <IconeComBase tom="marca" redonda><Mail /></IconeComBase>
          <IconeComBase tom="neutro" redonda><CalendarCheck /></IconeComBase>
        </div>
        <DoDont
          dos={[
            t("Pink base with red icon for what needs action; grey base with grey icon for what only identifies.", "Base rosa com ícone vermelho para o que pede ação; base cinza com ícone cinza para o que só identifica."),
            t("The same tone for every card of a grid of equal cards.", "O mesmo tom em todos os cards de uma grade de cards iguais."),
          ]}
          donts={[
            t("Grey base with a red icon, or pink base with a grey icon.", "Base cinza com ícone vermelho, ou base rosa com ícone cinza."),
            t("Colour as the only signal: the state also goes in text (visible or for screen readers).", "Cor como único sinal: o estado vai também em texto (visível ou para leitores de tela)."),
          ]}
        />
      </div>

      <div className="space-y-4">
        <SubTitle>{t("5. Card with icon header, soft divider and \"see all\" link", "5. Card com cabeçalho de ícone, divisor suave e link \"ver tudo\"")}</SubTitle>
        <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {t(
            "CardComCabecalho: the Card of the DS with IconeComBase (marca by default), title, one-line description and an action on the right (LinkVerTudo). The header is separated by a DivisorSuave (fades at the sides); sangria lets lists run edge to edge, so row hover covers the whole row.",
            "CardComCabecalho: o Card do DS com IconeComBase (marca por padrão), título, descrição de uma linha e ação à direita (LinkVerTudo). O cabeçalho é separado por um DivisorSuave (some nas laterais); sangria deixa listas de ponta a ponta, para o hover cobrir a linha inteira.",
          )}
        </p>
        <GradeDeCards className="gap-4 md:grid-cols-2">
          <CardComCabecalho icone={<Rocket />} titulo={t("Launch", "Lançamento")} descricao={t("People waiting for the launch", "Pessoas aguardando o lançamento")} acao={<LinkVerTudo href="#" onClick={e => e.preventDefault()}>{t("See all", "Ver todas")}</LinkVerTudo>}>
            <p className="text-[0.9375rem] text-foreground">{t("2 waiting, 7 already notified.", "2 aguardando, 7 já avisadas.")}</p>
          </CardComCabecalho>
          <CardComCabecalho icone={<ClipboardList />} tom="neutro" cabecalho="simples" titulo={t("Archived projects", "Projetos arquivados")} descricao={t("Record only (neutral tone, simple header)", "Só registro (tom neutro, cabeçalho simples)")}>
            <p className="text-[0.9375rem] text-foreground">{t("4 projects", "4 projetos")}</p>
          </CardComCabecalho>
        </GradeDeCards>
      </div>

      <div className="space-y-3">
        <SubTitle>{t("Accessibility", "Acessibilidade")}</SubTitle>
        <ul className="max-w-3xl list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-muted-foreground">
          <li>{t("Menu: <nav> with a name; the current page has aria-current=\"page\"; the ≡ MENU button says the action (Collapse/Expand menu) with aria-expanded and aria-controls; collapsed items and groups keep their name for screen readers and show a tooltip on hover and keyboard focus.", "Menu: <nav> com nome; a página atual tem aria-current=\"page\"; o botão ≡ MENU diz a ação (Recolher/Expandir menu) com aria-expanded e aria-controls; itens e grupos recolhidos mantêm o nome para leitores de tela e mostram dica no hover e no foco do teclado.")}</li>
          <li>{t("Counters are read with their meaning (\"3 unread\"), never a bare number; the bell's name carries the count (\"Notifications, 7 unread\") and its visible number is aria-hidden.", "Contadores são lidos com o sentido (\"3 não lidas\"), nunca o número solto; o nome do sino leva a contagem (\"Notificações, 7 não lidas\") e o número visível é aria-hidden.")}</li>
          <li>{t("Targets: bell and account 44 px; menu items 36 px in the fixed menu (pointer) and 44 px in the drawer (touch).", "Alvos: sino e conta com 44 px; itens do menu com 36 px no menu fixo (mouse) e 44 px na gaveta (toque).")}</li>
          <li>{t("Contrast: page description in --foreground on the grey background; card text in --muted-foreground only on white; trends with an arrow and text, never colour alone.", "Contraste: descrição da página em --foreground no fundo cinza; texto de card em --muted-foreground só no branco; variação com seta e texto, nunca só cor.")}</li>
          <li>{t("Reduced motion: the menu width, the item fade and the arrow nudge do not animate.", "Menos movimento: a largura do menu, o esmaecimento dos itens e o deslize da seta não animam.")}</li>
        </ul>
        <p className="flex max-w-3xl items-start gap-2 text-[0.875rem] text-muted-foreground">
          <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary-text" />
          <span>{t("Brought from the FindLook Design System with this DS's colours. Not brought: SeletorDeLoja and CardDePlano (store-specific).", "Trazidas do FindLook Design System com as cores deste DS. Não trazidos: SeletorDeLoja e CardDePlano (próprios de loja).")} <Mono>painel-shell</Mono> <Mono>painel-cabecalho</Mono> <Mono>painel-dados</Mono></span>
        </p>
      </div>
    </div>
  );
}
