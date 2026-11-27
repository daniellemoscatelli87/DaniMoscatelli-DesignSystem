import React, { useRef, useState } from "react";
import { Building, Check, RotateCcw } from "lucide-react";
import { CardDeArtigo } from "../ui/card-de-artigo";
import { useI18n } from "../../i18n";
import { PageHeader } from "./GetStartedShowcase";
import { SectionHeader } from "./shared/SectionHeader";
import { Panel, SubTitle } from "./shared/Guidance";
import { RodapeSite } from "../ui/rodape-site";
import { BotaoWhatsApp, linkWhatsApp } from "../ui/botao-whatsapp";
import { AvisoProjeto } from "../ui/aviso-projeto";
import { BotaoSubir } from "../ui/botao-subir";
import { PilulaDeAcao } from "../ui/pilula-de-acao";
import { AvisoCookies } from "../ui/aviso-cookies";
import { SurgirAoRolar, TituloQueSurge } from "../ui/surgir-ao-rolar";
import { CurvaSecao } from "../ui/curva-secao";
import { CardDeFrente, GradeDeFrentes } from "../ui/card-frente";
import { SegmentedControl } from "../ui/segmented-control";
import { SeloSecao } from "../ui/selo-secao";
import { Button } from "../ui/button";
import logoSobreClaro from "../../../imports/Logo-Horizontal-DarkMode.png";
import logoSobreEscuro from "../../../imports/Logo-Horizontal-LightMode.png";
import { GradeDeCards, ItemDaGrade } from "../ui/grade-de-cards";

/* ─────────────────────────────────────────────────────────────
   Padrões do site
   Componentes trazidos do site do estúdio (danimoscatelli.com.br):
   rodapé, elementos flutuantes, aviso de cookies, entrada ao rolar
   e divisores curvos. Os elementos fixos aparecem aqui dentro de
   caixas de demonstração (prop fixo={false}).
   ───────────────────────────────────────────────────────────── */

const WHATS = linkWhatsApp("5541997485414", "Olá, Dani! Vim pelo site danimoscatelli.com.br e gostaria de conversar sobre um projeto.");

function Lista({ itens }: { itens: string[] }) {
  return (
    <ul className="space-y-2.5">
      {itens.map(item => (
        <li key={item} className="flex gap-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {item}
        </li>
      ))}
    </ul>
  );
}

function Orientacoes({ quando, a11y }: { quando: string[]; a11y: string[] }) {
  const { t } = useI18n();
  return (
    <GradeDeCards className="gap-4 lg:grid-cols-2">
      <Panel className="p-5">
        <SubTitle>{t("When to use", "Quando usar")}</SubTitle>
        <Lista itens={quando} />
      </Panel>
      <Panel className="p-5">
        <SubTitle>{t("Accessibility", "Acessibilidade")}</SubTitle>
        <Lista itens={a11y} />
      </Panel>
    </GradeDeCards>
  );
}

function Codigo({ children }: { children: string }) {
  const { t } = useI18n();
  return (
    <Panel className="min-w-0 p-5">
      <SubTitle>{t("Code", "Código")}</SubTitle>
      <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 font-[family-name:var(--font-mono)] text-[0.75rem] leading-relaxed text-muted-foreground"><code>{children}</code></pre>
    </Panel>
  );
}

function Rotulo({ titulo, desc }: { titulo: string; desc: string }) {
  return (
    <div className="mb-2.5">
      <p className="text-[0.875rem] font-semibold text-foreground">{titulo}</p>
      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

/** Conteúdo neutro de página atrás dos flutuantes (só formas, sem texto inventado). */
function PaginaFalsa() {
  return (
    <div aria-hidden className="space-y-3 p-5">
      <div className="h-4 w-2/3 rounded-full bg-graphite-100 dark:bg-white/10" />
      <div className="h-3 w-full rounded-full bg-graphite-100/70 dark:bg-white/5" />
      <div className="h-3 w-5/6 rounded-full bg-graphite-100/70 dark:bg-white/5" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="h-20 rounded-md bg-card shadow-xs" />
        <div className="h-20 rounded-md bg-card shadow-xs" />
      </div>
    </div>
  );
}

function Moldura({ children, className = "", rotulo }: { children: React.ReactNode; className?: string; rotulo: string }) {
  return (
    <div role="group" aria-label={rotulo} className={`relative isolate overflow-hidden rounded-lg border border-border bg-background ${className}`}>
      {children}
    </div>
  );
}

/* ───────────── Rodapé ───────────── */

function SecaoRodape() {
  const { t } = useI18n();
  const comuns = {
    rotuloLogo: t("Dani Moscatelli Experience Design Studio: home page", "Dani Moscatelli Experience Design Studio: página inicial"),
    links: [
      { href: "#site-rodape", rotulo: "Home" },
      { href: "#site-rodape", rotulo: "Projeto Piloto" },
      { href: "#site-rodape", rotulo: "Seja Parceiro" },
      { href: "#site-rodape", rotulo: t("Privacy policy", "Política de privacidade") },
    ],
    privacidade: { href: "#site-rodape", rotulo: t("Privacy policy", "Política de privacidade") },
    rotuloPreferencias: t("Cookie preferences", "Preferências de cookies"),
    areaRestrita: { href: "#site-rodape", rotulo: t("Restricted area", "Área restrita") },
    copyright: t("© 2026 Dani Moscatelli Experience Design Studio. All rights reserved.", "© 2026 Dani Moscatelli Experience Design Studio. Todos os direitos reservados."),
    credito: { prefixo: t("Built with", "Desenvolvido a partir de"), rotulo: "Dani Moscatelli - Design System", rotuloCurto: "Design System", href: "https://designsystem.danimoscatelli.com.br/" },
    rotuloNav: t("Footer", "Rodapé"),
    novaAba: t(" (opens in a new tab)", " (abre em nova aba)"),
  };
  const variantes = [
    { v: "claro" as const, logo: logoSobreClaro, titulo: t("Light", "Claro"), desc: t("Graphite 100 surface, dark-text logo. Used on Home, Seja Parceiro and its sign-up page.", "Superfície Graphite 100, logo de texto escuro. Usado na Home, no Seja Parceiro e no cadastro dele.") },
    { v: "escuro" as const, logo: logoSobreEscuro, titulo: t("Dark", "Escuro"), desc: t("Graphite 950 surface, light-text logo. Used on Projeto Piloto, after the dark sections.", "Superfície Graphite 950, logo de texto claro. Usado no Projeto Piloto, depois das seções escuras.") },
    { v: "compacto" as const, logo: undefined, titulo: t("Compact", "Compacto"), desc: t("No logo and no navigation (they are already in the header). It exists in the site code for the “Em breve” page, which no longer uses it.", "Sem logo e sem navegação (já estão no header). Existe no código do site para a página “Em breve”, que hoje não o usa mais.") },
  ];
  return (
    <section id="site-rodape" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Footer", "Rodapé")}
        description={t(
          "The site footer: logo and links on top; copyright, city and design system credit at the bottom. Same structure on every page, in three variants.",
          "O rodapé do site: logo e links em cima; copyright, cidade e crédito do design system embaixo. A mesma estrutura em todas as páginas, em três variantes.",
        )}
      />
      <div className="space-y-6">
        {variantes.map(x => (
          <div key={x.v}>
            <Rotulo titulo={x.titulo} desc={x.desc} />
            <div className="overflow-hidden rounded-lg border border-border">
              <RodapeSite variante={x.v} logo={x.logo} {...comuns} />
            </div>
          </div>
        ))}
      </div>
      <Orientacoes
        quando={[
          t("Light: pages whose last section is light.", "Claro: páginas cuja última seção é clara."),
          t("Dark: pages that end in a dark section, so the footer continues it.", "Escuro: páginas que terminam numa seção escura, para o rodapé continuar o tom."),
          t("Compact: single-purpose pages (for example, “coming soon”), where the header already has the navigation.", "Compacto: páginas de um assunto só (por exemplo, “em breve”), em que o header já tem a navegação."),
          t("With the WhatsApp button on the page, turn on espacoFlutuante so the button does not cover the last links.", "Com o botão do WhatsApp na página, ligue espacoFlutuante para o botão não cobrir os últimos links."),
        ]}
        a11y={[
          t("Links are inside a nav with a name (“Footer”).", "Os links ficam num nav com nome (“Rodapé”)."),
          t("The logo link has a name (“… home page”); the image itself has empty alt.", "O link do logo tem nome (“… página inicial”); a imagem tem alt vazio."),
          t("“Cookie preferences” is a button (it opens the notice), not a link.", "“Preferências de cookies” é um botão (abre o aviso), não um link."),
          t("The design system link says it opens in a new tab (text for screen readers).", "O link do design system avisa que abre em nova aba (texto para leitores de tela)."),
          t("The bullet between copyright and city is hidden from screen readers.", "O ponto entre o copyright e a cidade fica oculto para leitores de tela."),
          t("Visible focus ring on every link and button.", "Anel de foco visível em todos os links e botões."),
        ]}
      />
      <Codigo>{`import { RodapeSite } from "@/app/components/ui/rodape-site";
import { abrirAvisoCookies } from "@/app/components/ui/aviso-cookies";
import logo from "@/imports/Logo-Horizontal-DarkMode.png";

<RodapeSite variante="claro" logo={logo} onPreferenciasCookies={abrirAvisoCookies} espacoFlutuante />
<RodapeSite variante="escuro" logo={logoTextoClaro} />
<RodapeSite variante="compacto" />`}</Codigo>
    </section>
  );
}

/* ───────────── Flutuantes ───────────── */

function SecaoFlutuantes() {
  const { t } = useI18n();
  const [chave, setChave] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const fim = useRef<HTMLDivElement>(null);
  const raizCel = useRef<HTMLDivElement>(null);
  const conviteCel = useRef<HTMLDivElement>(null);
  const raizPc = useRef<HTMLDivElement>(null);
  const heroPc = useRef<HTMLDivElement>(null);
  const convitePc = useRef<HTMLDivElement>(null);
  const aviso = {
    titulo: t("Got a project?", "Tem um projeto?"),
    texto: t("Let's talk about it.", "Vamos conversar sobre ele."),
    rotuloAcao: t("Got a project? Chat with Dani on WhatsApp", "Tem um projeto? Conversar com a Dani no WhatsApp"),
    rotuloFechar: t("Close notice", "Fechar aviso"),
    href: WHATS,
    fixo: false,
    lembrarFechado: false,
  };
  const whats = {
    rotulo: t("Chat with Dani on WhatsApp", "Conversar com a Dani no WhatsApp"),
    titulo: t("Chat on WhatsApp", "Conversar no WhatsApp"),
    mensagem: "Olá, Dani! Vim pelo site danimoscatelli.com.br e gostaria de conversar sobre um projeto.",
    fixo: false,
  };
  return (
    <section id="site-flutuantes" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Floating elements", "Elementos flutuantes")}
        description={t(
          "Fixed at the bottom right of every site page: the WhatsApp button; on Home, the “Got a project?” notice pointing to it; on Seja Parceiro and Projeto Piloto, the action pill beside it; and, when the footer appears, the back-to-top button. The WhatsApp green is the only colour outside the DS (product owner's exception, 19/11/2026).",
          "Fixos no canto inferior direito de todas as páginas do site: o botão do WhatsApp; na Home, o aviso “Tem um projeto?” apontando para ele; no Seja Parceiro e no Projeto Piloto, a pílula de ação ao lado dele; e, quando o rodapé aparece, o botão de voltar ao topo. O verde do WhatsApp é a única cor fora do DS (exceção da dona do produto, 19/11/2026).",
        )}
      />
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => setChave(k => k + 1)}>
          <RotateCcw aria-hidden /> {t("Show the notices again", "Mostrar os avisos de novo")}
        </Button>
      </div>
      <GradeDeCards className="gap-6 lg:grid-cols-2">
        <ItemDaGrade>
          <Rotulo titulo={t("Computer: notice above the button", "Computador: aviso acima do botão")} desc={t("From 1024 px, the notice floats above the WhatsApp button, with the arrow pointing down.", "A partir de 1024 px, o aviso flutua acima do botão do WhatsApp, com a seta para baixo.")} />
          <Moldura className="h-[300px]" rotulo={t("Computer demo", "Demonstração no computador")}>
            <PaginaFalsa />
            <AvisoProjeto key={`a${chave}`} posicao="acima" {...aviso} />
            <BotaoWhatsApp {...whats} />
          </Moldura>
        </ItemDaGrade>
        <ItemDaGrade>
          <Rotulo titulo={t("Phone: notice beside the button", "Celular: aviso ao lado do botão")} desc={t("Up to 1023 px, it takes the space to the left of the button, with the arrow pointing right.", "Até 1023 px, ocupa o espaço à esquerda do botão, com a seta para a direita.")} />
          <Moldura className="mx-auto h-[300px] max-w-[390px]" rotulo={t("Phone demo", "Demonstração no celular")}>
            <PaginaFalsa />
            <AvisoProjeto key={`b${chave}`} posicao="ao-lado" {...aviso} />
            <BotaoWhatsApp {...whats} />
          </Moldura>
        </ItemDaGrade>
      </GradeDeCards>
      <div>
        <Rotulo titulo={t("Back to top", "Voltar ao topo")} desc={t("Scroll to the end of the box: when the footer appears, the button comes in beside the WhatsApp button.", "Role até o fim da caixa: quando o rodapé aparece, o botão entra ao lado do botão do WhatsApp.")} />
        <Moldura className="mx-auto h-[300px] max-w-[390px]" rotulo={t("Back-to-top demo", "Demonstração do voltar ao topo")}>
          <div ref={raiz} id="site-flutuantes-rolagem" tabIndex={0} aria-label={t("Scrollable demo page", "Página de demonstração com rolagem")} className="h-full overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
            <div data-topo-demo className="focus-visible:outline-none"><PaginaFalsa /></div>
            <PaginaFalsa />
            <PaginaFalsa />
            <div ref={fim} className="bg-graphite-100 px-5 pb-24 pt-6 dark:bg-graphite-800">
              <div aria-hidden className="mx-auto h-3 w-1/2 rounded-full bg-graphite-200 dark:bg-white/10" />
            </div>
          </div>
          <BotaoSubir raiz={raiz} alvo={fim} focoEm="[data-topo-demo]" fixo={false} rotulo={t("Back to the top of the page", "Voltar ao topo da página")} />
          <BotaoWhatsApp {...whats} />
        </Moldura>
      </div>
      <div>
        <Rotulo
          titulo={t("Action pill", "Pílula de ação")}
          desc={t(
            "The page's main action, beside the WhatsApp button. Phone: it takes the width to the left of the button, with a graphite band behind; it stays visible and leaves only when the invitation button at the end of the page is on screen. Computer: it appears when the hero button leaves the screen. Scroll inside the boxes.",
            "A ação principal da página, ao lado do botão do WhatsApp. Celular: ocupa a largura à esquerda do botão, com uma faixa grafite por trás; fica sempre visível e só sai quando o botão do convite, no fim da página, está na tela. Computador: aparece quando o botão do hero sai da tela. Role dentro das caixas.",
          )}
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Moldura className="mx-auto h-[340px] w-full max-w-[390px]" rotulo={t("Action pill on the phone (Seja Parceiro)", "Pílula de ação no celular (Seja Parceiro)")}>
            <div ref={raizCel} id="pilula-celular-rolagem" tabIndex={0} aria-label={t("Scrollable demo page", "Página de demonstração com rolagem")} className="h-full overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
              <PaginaFalsa /><PaginaFalsa /><PaginaFalsa />
              <div className="px-5 pb-28 pt-2">
                <div aria-hidden className="space-y-3 rounded-lg bg-card p-5 shadow-sm">
                  <div className="h-4 w-2/3 rounded-full bg-graphite-100 dark:bg-white/10" />
                  <div ref={conviteCel} className="h-12 w-44 rounded-full bg-primary/80" />
                </div>
              </div>
            </div>
            <PilulaDeAcao fixo={false} layout="celular" raiz={raizCel} esconderCom={[conviteCel]} href="#site-flutuantes" rotulo={t("Become a partner", "Quero ser parceiro")} />
            <BotaoWhatsApp {...whats} className="sm:bottom-5 sm:right-5" />
          </Moldura>
          <Moldura className="h-[340px] w-full" rotulo={t("Action pill on the computer (Projeto Piloto)", "Pílula de ação no computador (Projeto Piloto)")}>
            <div ref={raizPc} id="pilula-computador-rolagem" tabIndex={0} aria-label={t("Scrollable demo page", "Página de demonstração com rolagem")} className="h-full overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
              <div aria-hidden className="space-y-3 bg-graphite-100 p-5 dark:bg-graphite-800">
                <div className="h-5 w-1/2 rounded-full bg-graphite-200 dark:bg-white/10" />
                <div className="h-3 w-3/4 rounded-full bg-graphite-200/70 dark:bg-white/5" />
                <div ref={heroPc} className="h-12 w-44 rounded-full bg-primary/80" />
              </div>
              <PaginaFalsa /><PaginaFalsa /><PaginaFalsa />
              <div className="px-5 pb-28 pt-2">
                <div aria-hidden className="space-y-3 rounded-lg bg-card p-5 shadow-sm">
                  <div className="h-4 w-2/3 rounded-full bg-graphite-100 dark:bg-white/10" />
                  <div ref={convitePc} className="h-12 w-44 rounded-full bg-primary/80" />
                </div>
              </div>
            </div>
            <PilulaDeAcao fixo={false} layout="computador" raiz={raizPc} mostrarApos={heroPc} esconderCom={[convitePc]} href="#site-flutuantes" icone={<Building className="size-[1.125rem]" />} iconeAntes rotulo={t("Register company", "Cadastrar empresa")} />
            <BotaoWhatsApp {...whats} className="bottom-6 right-6" />
          </Moldura>
        </div>
      </div>
      <Orientacoes
        quando={[
          t("WhatsApp button: on every page of the site, always in the same place.", "Botão do WhatsApp: em todas as páginas do site, sempre no mesmo lugar."),
          t("“Got a project?” notice: only on the home page; once closed, it does not come back in the same session.", "Aviso “Tem um projeto?”: só na página inicial; depois de fechado, não volta na mesma sessão."),
          t("Back to top: long pages; it appears only when the footer enters the screen.", "Voltar ao topo: páginas longas; aparece só quando o rodapé entra na tela."),
          t("Action pill: one main action per page (sign up, register). It never shows together with the same button on screen (hero or invitation).", "Pílula de ação: uma ação principal por página (cadastro, inscrição). Nunca aparece junto com o mesmo botão na tela (hero ou convite)."),
          t("On phones, keep 20 px from the edges and 12 px between the floating elements; reserve space at the end of the page so they do not cover the footer.", "No celular, mantenha 20 px das bordas e 12 px entre os flutuantes; reserve espaço no fim da página para eles não cobrirem o rodapé."),
        ]}
        a11y={[
          t("Icon-only buttons have a name (“Chat with Dani on WhatsApp”, “Back to the top of the page”).", "Botões só com ícone têm nome (“Conversar com a Dani no WhatsApp”, “Voltar ao topo da página”)."),
          t("The notice has its own close button (“Close notice”), reachable by keyboard.", "O aviso tem botão próprio de fechar (“Fechar aviso”), alcançável pelo teclado."),
          t("Hidden back-to-top leaves the Tab order; after going up, focus moves to the start of the content.", "O voltar ao topo escondido sai da ordem do Tab; depois de subir, o foco vai para o começo do conteúdo."),
          t("With reduced motion: no entrance, no floating and the return to the top is instant.", "Com movimento reduzido: sem entrada, sem flutuar e a volta ao topo é instantânea."),
          t("Touch areas of 56 × 56 px.", "Áreas de toque de 56 × 56 px."),
          t("Hidden action pill also leaves the Tab order and screen readers; its text says the action.", "A pílula de ação escondida também sai da ordem do Tab e dos leitores de tela; o texto dela diz a ação."),
          t("The WhatsApp green (#25D366) is the WhatsApp brand colour, only on that button, with a white icon: product owner's exception, 19/11/2026.", "O verde do WhatsApp (#25D366) é a cor da marca do WhatsApp, só nesse botão, com ícone branco: exceção da dona do produto, 19/11/2026."),
        ]}
      />
      <Codigo>{`import { BotaoWhatsApp, linkWhatsApp } from "@/app/components/ui/botao-whatsapp";
import { AvisoProjeto } from "@/app/components/ui/aviso-projeto";
import { BotaoSubir } from "@/app/components/ui/botao-subir";
import { PilulaDeAcao } from "@/app/components/ui/pilula-de-acao";

<BotaoWhatsApp numero="5541997485414" mensagem="Olá, Dani! ..." />
<AvisoProjeto href={linkWhatsApp("5541997485414")} />   {/* só na Home */}
<BotaoSubir />                                          {/* aparece com o rodapé */}
<PilulaDeAcao rotulo="Quero ser parceiro" href="/rede-parceiros/cadastro/"
  mostrarApos={botaoDoHero} esconderCom={[botaoDoConvite]} sempreAte={1023} />`}</Codigo>
    </section>
  );
}

/* ───────────── Aviso de cookies ───────────── */

function SecaoCookies() {
  const { t } = useI18n();
  const [aberto, setAberto] = useState(true);
  const [escolha, setEscolha] = useState<string | null>(null);
  return (
    <section id="site-cookies" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Cookie notice", "Aviso de cookies")}
        description={t(
          "Consent bar of the site (LGPD): nothing is measured before “Accept”. The choice stays in the browser and can be reviewed from “Cookie preferences” in the footer.",
          "Faixa de consentimento do site (LGPD): nada é medido antes de “Aceitar”. A escolha fica no navegador e pode ser revista em “Preferências de cookies”, no rodapé.",
        )}
      />
      <Moldura className="h-[300px] sm:h-[220px]" rotulo={t("Cookie notice demo", "Demonstração do aviso de cookies")}>
        <PaginaFalsa />
        <AvisoCookies
          aberto={aberto}
          fixo={false}
          texto={t(
            "We use Google Analytics cookies to understand, in aggregate, how people use the site and improve your experience. Measurement only starts if you accept.",
            "Usamos cookies do Google Analytics para entender, de forma agregada, como as pessoas usam o site e melhorar a sua experiência. A medição só começa se você aceitar.",
          )}
          politica={{ href: "#site-cookies", rotulo: t("Privacy Policy", "Política de Privacidade") }}
          rotuloRecusar={t("Decline", "Recusar")}
          rotuloAceitar={t("Accept", "Aceitar")}
          rotuloRegiao={t("Cookie notice", "Aviso de cookies")}
          onAceitar={() => { setEscolha(t("Accepted", "Aceito")); setAberto(false); }}
          onRecusar={() => { setEscolha(t("Declined", "Recusado")); setAberto(false); }}
        />
        {!aberto && (
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-2">
            <p aria-live="polite" className="text-[0.8125rem] text-muted-foreground">{t("Choice:", "Escolha:")} <strong className="text-foreground">{escolha}</strong></p>
            <Button type="button" variant="outline" size="sm" onClick={() => setAberto(true)}>{t("Cookie preferences", "Preferências de cookies")}</Button>
          </div>
        )}
      </Moldura>
      <Orientacoes
        quando={[
          t("Whenever the page loads analytics or any non-essential cookie.", "Sempre que a página carregar medição de acessos ou qualquer cookie não essencial."),
          t("Show it on the first visit and only again when the person asks (footer button).", "Mostre na primeira visita e só de novo quando a pessoa pedir (botão do rodapé)."),
          t("Load the measurement only after “Accept”; when declining after accepting, erase its cookies.", "Carregue a medição só depois de “Aceitar”; ao recusar depois de ter aceitado, apague os cookies dela."),
        ]}
        a11y={[
          t("It is a region with a name (“Cookie notice”), easy to find with screen readers.", "É uma região com nome (“Aviso de cookies”), fácil de achar com leitores de tela."),
          t("Decline and Accept have the same size and weight of reading: neither is hidden.", "Recusar e Aceitar têm o mesmo tamanho e peso de leitura: nenhum fica escondido."),
          t("Buttons 44 px tall; below 480 px they split the width.", "Botões de 44 px de altura; abaixo de 480 px dividem a largura."),
          t("It does not block the page: the person can read and navigate before choosing.", "Não bloqueia a página: a pessoa pode ler e navegar antes de escolher."),
          t("Privacy Policy link in the primary text colour, underlined.", "Link da Política de Privacidade na cor primária de texto, sublinhado."),
        ]}
      />
      <Codigo>{`import { AvisoCookies, abrirAvisoCookies } from "@/app/components/ui/aviso-cookies";

<AvisoCookies onAceitar={ligarMedicao} onRecusar={apagarCookiesDaMedicao} />
<button onClick={abrirAvisoCookies}>Preferências de cookies</button>`}</Codigo>
    </section>
  );
}

/* ───────────── Seção "Onde podemos atuar" (reprodução do Projeto Piloto) ───────────── */

function IconeFeather({ children }: { children: React.ReactNode }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/* As seis frentes do site (projeto-piloto/index.html), com os ícones originais (traço 2, 24 × 24). */
const FRENTES: { numero: string; icone: React.ReactNode; titulo: [string, string]; subtitulo: [string, string]; descricao: [string, string]; temas: [string, string][] }[] = [
  {
    numero: "01",
    icone: <IconeFeather><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></IconeFeather>,
    titulo: ["Experience Research and Strategy", "Pesquisa e Estratégia de Experiência"],
    subtitulo: ["Understand people and identify opportunities", "Compreender pessoas e identificar oportunidades"],
    descricao: ["We investigate needs, expectations and behaviours to understand problems, support decisions and reveal opportunities to evolve.", "Investigamos necessidades, expectativas e comportamentos para compreender problemas, apoiar decisões e revelar oportunidades de evolução."],
    temas: [["Research", "Pesquisa"], ["Behaviour", "Comportamento"], ["Diagnosis", "Diagnóstico"]],
  },
  {
    numero: "02",
    icone: <IconeFeather><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></IconeFeather>,
    titulo: ["Journeys and Customer Experience", "Jornadas e Experiência do Cliente"],
    subtitulo: ["Improve each interaction along the journey", "Melhorar cada interação ao longo da jornada"],
    descricao: ["We analyse and redesign physical, digital and hybrid journeys to reduce friction and make interactions simpler, more integrated and more relevant.", "Analisamos e redesenhamos jornadas físicas, digitais e híbridas para reduzir atritos e tornar as interações mais simples, integradas e relevantes."],
    temas: [["Journeys", "Jornadas"], ["Customer service", "Atendimento"], ["Touchpoints", "Pontos de contato"]],
  },
  {
    numero: "03",
    icone: <IconeFeather><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></IconeFeather>,
    titulo: ["Service Design and Transformation", "Design e Transformação de Serviços"],
    subtitulo: ["Align operations with the desired experience", "Alinhar operações à experiência desejada"],
    descricao: ["We investigate and redesign the elements that support service delivery, connecting processes, people and operations to customers' needs.", "Investigamos e redesenhamos os elementos que sustentam a entrega dos serviços, conectando processos, pessoas e operações às necessidades dos clientes."],
    temas: [["Services", "Serviços"], ["Processes", "Processos"], ["Operations", "Operações"]],
  },
  {
    numero: "04",
    icone: <IconeFeather><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" /></IconeFeather>,
    titulo: ["Service Innovation and Development", "Inovação e Desenvolvimento de Serviços"],
    subtitulo: ["Create and reinvent services from real needs", "Criar e reinventar serviços a partir de necessidades reais"],
    descricao: ["We identify opportunities to conceive, improve and validate services and experiences that create value for people and for the business.", "Identificamos oportunidades para conceber, aprimorar e validar serviços e experiências que gerem valor para as pessoas e para o negócio."],
    temas: [["New services", "Novos serviços"], ["Prototyping", "Prototipação"], ["Validation", "Validação"]],
  },
  {
    numero: "05",
    icone: <IconeFeather><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></IconeFeather>,
    titulo: ["Employee Experience", "Experiência do Colaborador"],
    subtitulo: ["Improve the experience of those who make the service happen", "Melhorar a experiência de quem faz o serviço acontecer"],
    descricao: ["We investigate work journeys, tools and interactions that influence the teams' experience and the quality of the services delivered.", "Investigamos jornadas, ferramentas e interações de trabalho que influenciam a experiência das equipes e a qualidade dos serviços entregues."],
    temas: [["Employees", "Colaboradores"], ["Internal journeys", "Jornadas internas"], ["Collaboration", "Colaboração"]],
  },
  {
    numero: "06",
    icone: <IconeFeather><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></IconeFeather>,
    titulo: ["Experience Strategy and Management", "Estratégia e Gestão da Experiência"],
    subtitulo: ["Guide decisions and the continuous evolution of the experience", "Orientar decisões e a evolução contínua da experiência"],
    descricao: ["We support organisations in defining priorities, initiatives and indicators to structure and track the evolution of the experience.", "Apoiamos organizações na definição de prioridades, iniciativas e indicadores para estruturar e acompanhar a evolução da experiência."],
    temas: [["Strategy", "Estratégia"], ["Prioritisation", "Priorização"], ["Indicators", "Indicadores"]],
  },
];

const CSS_FUNDO = `
@keyframes dm-blob-a { 0% { transform: translate(0, 0); } 50% { transform: translate(28%, 22%); } 100% { transform: translate(-18%, 42%); } }
@keyframes dm-blob-b { 0% { transform: translate(0, 0); } 50% { transform: translate(-40%, 48%); } 100% { transform: translate(14%, 16%); } }
@keyframes dm-blob-c { 0% { transform: translate(0, 0); } 50% { transform: translate(-30%, -40%); } 100% { transform: translate(24%, -12%); } }
@media (prefers-reduced-motion: reduce) { .dm-fundo-escuro > span { animation: none !important; } }
`;

/** Fundo da seção escura do site: três manchas de luz que se movem devagar (crimson-600, graphite-600, crimson-400). */
function FundoSecaoEscura() {
  const mancha = (cor: string, pct: number) => `radial-gradient(closest-side, color-mix(in srgb, var(${cor}) ${pct}%, transparent) 0%, transparent 100%)`;
  const base: React.CSSProperties = { position: "absolute", borderRadius: 9999, scale: "1.35" };
  const mascara = "linear-gradient(to bottom, transparent 0, #000 160px, #000 calc(100% - 160px), transparent 100%)";
  return (
    <div aria-hidden className="dm-fundo-escuro pointer-events-none absolute inset-0 overflow-hidden" style={{ maskImage: mascara, WebkitMaskImage: mascara }}>
      <style>{CSS_FUNDO}</style>
      <span style={{ ...base, width: 620, height: 620, top: "12%", left: "-8%", background: mancha("--crimson-600", 45), animation: "dm-blob-a 18s ease-in-out infinite alternate" }} />
      <span style={{ ...base, width: 520, height: 520, top: "-10%", left: "60%", background: mancha("--graphite-600", 60), animation: "dm-blob-b 23s ease-in-out infinite alternate" }} />
      <span style={{ ...base, width: 460, height: 460, top: "55%", left: "30%", background: mancha("--crimson-400", 18), animation: "dm-blob-c 16s ease-in-out infinite alternate" }} />
    </div>
  );
}

/** A seção "Onde podemos atuar" do Projeto Piloto, como no site, com a entrada ao rolar (subir) do site. */
function SecaoEscopo() {
  const { t } = useI18n();
  return (
    <section aria-labelledby="escopo-demo-titulo" className="relative isolate overflow-hidden bg-graphite-950 pb-16 pt-28 font-sans sm:pb-36 sm:pt-44 lg:pt-48">
      <FundoSecaoEscura />
      <CurvaSecao posicao="topo" cor="var(--background)" />
      <CurvaSecao posicao="base" cor="var(--background)" />
      <div className="relative z-[1] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SurgirAoRolar escalonar passo={80} duracao={1400} className="mx-auto mb-8 max-w-3xl text-center sm:mb-16">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-crimson-300/60 bg-transparent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-crimson-300">
            <span aria-hidden className="size-1.5 rounded-full bg-crimson-300" />{t("Scope of work", "Escopo de atuação")}
          </p>
          <h3 id="escopo-demo-titulo" className="mb-4 text-3xl font-bold tracking-[-0.02em] text-graphite-50 sm:text-4xl">{t("Where we can work", "Onde podemos atuar")}</h3>
          <p className="mb-3 text-base font-medium leading-snug text-crimson-300 sm:text-lg">{t("Different challenges. A systemic view of the experience.", "Diferentes desafios. Uma visão sistêmica da experiência.")}</p>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-graphite-300 sm:text-base">
            {t(
              "We investigate the experience in an integrated way, considering people, journeys, services and operations to identify opportunities for improvement and innovation.",
              "Investigamos a experiência de forma integrada, considerando pessoas, jornadas, serviços e operações para identificar oportunidades de melhoria e inovação.",
            )}
          </p>
        </SurgirAoRolar>
        <SurgirAoRolar as={GradeDeFrentes} escalonar aria-label={t("Areas of work", "Frentes de atuação")}>
          {FRENTES.map(f => (
            <CardDeFrente
              key={f.numero}
              numero={f.numero}
              icone={f.icone}
              titulo={t(...f.titulo)}
              subtitulo={t(...f.subtitulo)}
              descricao={t(...f.descricao)}
              temas={f.temas.map(x => t(...x))}
              rotuloTemas={t("Topics", "Temas")}
              nivelTitulo="h4"
            />
          ))}
        </SurgirAoRolar>
        <SurgirAoRolar as="p" className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-graphite-300">
          {t(
            "The areas of work represent possibilities for investigation and project development. In the Projeto Piloto Programme, the scope will be defined according to the selected challenge and the conditions agreed with each company.",
            "As frentes de atuação representam possibilidades de investigação e desenvolvimento de projetos. No Programa Projeto Piloto, o escopo será delimitado conforme o desafio selecionado e as condições acordadas com cada empresa.",
          )}
        </SurgirAoRolar>
      </div>
    </section>
  );
}

/** Cabeçalho da seção "Insights & Artigos" da Home, com o desfoque do site; os cards são blocos neutros. */
function SecaoArtigos() {
  const { t } = useI18n();
  const titulo = t("Thoughts and views on experience and strategy", "Pensamentos e visões sobre experiência e estratégia");
  const destaque = t("experience and strategy", "experiência e estratégia");
  return (
    <div className="bg-card px-4 py-14 text-center font-sans sm:px-6 md:py-20">
      <SurgirAoRolar efeito="desfoque">
        <SeloSecao className="mb-3">{t("Insights & articles", "Insights & artigos")}</SeloSecao>
      </SurgirAoRolar>
      <TituloQueSurge as="h3" destaque={destaque} className="mx-auto mb-3 max-w-3xl text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-[2.25rem]">{titulo}</TituloQueSurge>
      <SurgirAoRolar efeito="desfoque" atraso={200 + titulo.split(" ").length * 45}>
        <p className="mx-auto mb-12 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t(
            "Reflections on human-centred design, ecosystem architecture and turning products into lasting relationships.",
            "Reflexões sobre design centrado no humano, arquitetura de ecossistemas e a transformação de produtos em relações duradouras.",
          )}
        </p>
      </SurgirAoRolar>
      <SurgirAoRolar efeito="desfoque" escalonar className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-left md:grid-cols-3">
        {[1, 2, 3].map(i => (
          <CardDeArtigo
            key={i}
            titulo={t(`Example article ${i}`, `Artigo de exemplo ${i}`)}
            href="#site-entrada"
            imagem={`${import.meta.env.BASE_URL}fotos/projeto-piloto-hero.webp`}
            categoria={t("Service design", "Design de serviços")}
            data="01/09/2026"
            tempoDeLeitura={t("8 min read", "8 min de leitura")}
            resumo={t("Short example summary.", "Resumo curto de exemplo.")}
          />
        ))}
      </SurgirAoRolar>
    </div>
  );
}

/* ───────────── Entrada ao rolar ───────────── */

function SecaoEntrada() {
  const { t } = useI18n();
  const [efeito, setEfeito] = useState<"subir" | "desfoque">("subir");
  const [chave, setChave] = useState(0);
  return (
    <section id="site-entrada" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Reveal on scroll", "Entrada ao rolar")}
        description={t(
          "Blocks come in when they reach the screen, once. Two effects from the site: slide up, here in the real “Onde podemos atuar” section of Projeto Piloto; and blur reveal with the title word by word, here in the real header of “Insights & artigos” on Home (the article cards are neutral blocks).",
          "Os blocos entram quando chegam na tela, uma vez. Dois efeitos do site: subir, aqui na seção real “Onde podemos atuar” do Projeto Piloto; e surgir do desfoque com o título palavra por palavra, aqui no cabeçalho real de “Insights & artigos” da Home (os cards de artigo são blocos neutros).",
        )}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedControl
          size="sm"
          aria-label={t("Effect", "Efeito")}
          value={efeito}
          onValueChange={v => { setEfeito(v); setChave(k => k + 1); }}
          options={[{ value: "subir", label: t("Slide up", "Subir") }, { value: "desfoque", label: t("Blur", "Desfoque") }]}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => setChave(k => k + 1)}>
          <RotateCcw aria-hidden /> {t("Play again", "Ver de novo")}
        </Button>
      </div>
      <div id="site-entrada-demo" role="group" aria-label={t("Reveal demo", "Demonstração da entrada")} className="overflow-hidden rounded-lg border border-border">
        {efeito === "subir" ? <SecaoEscopo key={`s${chave}`} /> : <SecaoArtigos key={`d${chave}`} />}
      </div>
      <Orientacoes
        quando={[
          t("Section headers and groups of cards on marketing pages.", "Cabeçalhos de seção e grupos de cards em páginas de divulgação."),
          t("Slide up for most blocks (header items every 80 ms, cards every 70 ms); blur with the word-by-word title for the main sections of a landing page.", "Subir para a maioria dos blocos (itens do cabeçalho a cada 80 ms, cards a cada 70 ms); desfoque com o título palavra por palavra nas seções principais de uma landing page."),
          t("Not in panels, forms and data: content people work with must already be there.", "Não use em painéis, formulários e dados: o conteúdo de trabalho tem de estar lá."),
        ]}
        a11y={[
          t("With reduced motion, nothing is hidden and nothing moves.", "Com movimento reduzido, nada fica escondido e nada se mexe."),
          t("Without JavaScript or IntersectionObserver, the content stays visible.", "Sem JavaScript ou sem IntersectionObserver, o conteúdo continua visível."),
          t("The word-by-word title keeps the whole sentence for screen readers.", "O título palavra por palavra mantém a frase inteira para leitores de tela."),
          t("It animates once (repeating is optional) and lasts less than 1 s per block; then the entrance styles leave, so hover stays immediate.", "Anima uma vez (repetir é opcional) e dura menos de 1 s por bloco; depois os estilos da entrada saem, e o hover continua imediato."),
        ]}
      />
      <Codigo>{`import { SurgirAoRolar, TituloQueSurge } from "@/app/components/ui/surgir-ao-rolar";
import { GradeDeFrentes, CardDeFrente } from "@/app/components/ui/card-frente";

<SurgirAoRolar escalonar passo={80}>       {/* selo, título, subtítulo, texto */}
  …
</SurgirAoRolar>
<SurgirAoRolar as={GradeDeFrentes} escalonar>{cards}</SurgirAoRolar>

<TituloQueSurge destaque="experiência e estratégia">
  Pensamentos e visões sobre experiência e estratégia
</TituloQueSurge>`}</Codigo>
    </section>
  );
}

/* ───────────── Card de frente ───────────── */

function SecaoFrentes() {
  const { t } = useI18n();
  const f = FRENTES[1];
  const props = {
    numero: f.numero,
    icone: f.icone,
    titulo: t(...f.titulo),
    subtitulo: t(...f.subtitulo),
    descricao: t(...f.descricao),
    temas: f.temas.map(x => t(...x)),
    rotuloTemas: t("Topics", "Temas"),
    nivelTitulo: "h4" as const,
  };
  return (
    <section id="site-frentes" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Area of work card", "Card de frente de atuação")}
        description={t(
          "The card of the “Onde podemos atuar” section of Projeto Piloto: icon, title, red subtitle, description and topics. Hover it: the card lifts, light runs around the border and a soft glow follows the pointer. On the glass card the icon and topics stay glass, because the card is not clickable.",
          "O card da seção “Onde podemos atuar” do Projeto Piloto: ícone, título, subtítulo em vermelho, descrição e temas. Passe o mouse: o card sobe, a luz percorre a borda e um brilho suave segue o cursor. No card de vidro, o ícone e os temas continuam em vidro, porque o card não é clicável.",
        )}
      />
      <GradeDeCards className="gap-6 lg:grid-cols-2">
        <ItemDaGrade className="min-w-0">
          <Rotulo titulo={t("Dark (as on the site)", "Escuro (como no site)")} desc={t("Light glass over the dark section. It is the default.", "Vidro claro sobre a seção escura. É o padrão.")} />
          <div className="relative flex flex-col overflow-hidden rounded-lg border border-transparent bg-graphite-950 p-5 sm:p-8">
            <FundoSecaoEscura />
            <div className="relative flex flex-1 flex-col"><CardDeFrente {...props} className="flex-1" /></div>
          </div>
        </ItemDaGrade>
        <ItemDaGrade className="min-w-0">
          <Rotulo titulo={t("Light", "Claro")} desc={t("White DS card for light sections, with the number and the red bar of the original markup turned on.", "Card branco do DS para seções claras, com o número e a barra vermelha da marcação original ligados.")} />
          <div className="flex flex-col rounded-lg border border-border bg-background p-5 sm:p-8">
            <CardDeFrente {...props} tom="claro" mostrarNumero barra className="flex-1" />
          </div>
        </ItemDaGrade>
      </GradeDeCards>
      <Panel className="p-5">
        <SubTitle>{t("Props", "Props")}</SubTitle>
        <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-[0.8125rem] leading-relaxed text-muted-foreground md:grid-cols-2">
          {[
            ["icone, titulo, subtitulo, descricao, temas", t("Content. Topics are short (1 or 2 words); on wide screens they stay on one line.", "Conteúdo. Os temas são curtos (1 ou 2 palavras); em telas largas ficam numa linha só.")],
            ["tom", t("“escuro” (default, site) or “claro”.", "“escuro” (padrão, site) ou “claro”.")],
            ["numero + mostrarNumero", t("Large decorative number at the top right. Hidden on the site today.", "Número grande decorativo no canto superior direito. Escondido no site hoje.")],
            ["barra", t("Red bar that grows at the top on hover. Hidden on the site today.", "Barra vermelha que cresce no topo no hover. Escondida no site hoje.")],
            ["nivelTitulo", t("Heading level of the title (h3 by default).", "Nível do título (h3 por padrão).")],
            ["GradeDeFrentes", t("Grid of 1/2/3 columns; carousel with snap on phones (84% per card).", "Grade de 1/2/3 colunas; carrossel com encaixe no celular (84% por card).")],
          ].map(([nome, desc]) => (
            <li key={nome}><code className="font-[family-name:var(--font-mono)] text-foreground">{nome}</code>: {desc}</li>
          ))}
        </ul>
      </Panel>
      <Orientacoes
        quando={[
          t("Areas of work, services or fronts of a programme: 3 to 6 items of the same kind.", "Frentes de atuação, serviços ou eixos de um programa: de 3 a 6 itens do mesmo tipo."),
          t("Dark tone inside a dark section; light tone on light pages.", "Tom escuro dentro de uma seção escura; tom claro em páginas claras."),
          t("On phones, put them in GradeDeFrentes: a carousel that always shows part of the next card.", "No celular, use a GradeDeFrentes: um carrossel que sempre mostra parte do próximo card."),
        ]}
        a11y={[
          t("Each card is an article named by its title; the topics are a list named “Topics”.", "Cada card é um article nomeado pelo título; os temas são uma lista com nome “Temas”."),
          t("Icon, glow, number and bar are decorative and hidden from screen readers.", "Ícone, brilho, número e barra são decorativos e ficam ocultos para leitores de tela."),
          t("The phone carousel is a named region that receives focus and scrolls with the arrow keys.", "O carrossel do celular é uma região com nome, que recebe foco e rola com as setas."),
          t("With reduced motion: no lift, no icon swing and the border light stays still.", "Com movimento reduzido: sem subir, sem balanço do ícone e a luz da borda fica parada."),
          t("On the dark section, small red text uses crimson-300 (7:1 on graphite-950), as on the site.", "Na seção escura, o texto vermelho pequeno usa crimson-300 (7:1 sobre graphite-950), como no site."),
        ]}
      />
      <Codigo>{`import { CardDeFrente, GradeDeFrentes } from "@/app/components/ui/card-frente";
import { Search } from "lucide-react";

<GradeDeFrentes aria-label="Frentes de atuação">
  <CardDeFrente
    icone={<Search />}
    titulo="Pesquisa e Estratégia de Experiência"
    subtitulo="Compreender pessoas e identificar oportunidades"
    descricao="Investigamos necessidades, expectativas e comportamentos…"
    temas={["Pesquisa", "Comportamento", "Diagnóstico"]}
  />
  …
</GradeDeFrentes>`}</Codigo>
    </section>
  );
}

/* ───────────── Divisores curvos ───────────── */

function SecaoCurvas() {
  const { t } = useI18n();
  return (
    <section id="site-curvas" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Curved dividers", "Divisores curvos")}
        description={t(
          "Soft curve between a light and a dark section, at the top and at the bottom of the dark section (Projeto Piloto). The curve takes the colour of the neighbouring section.",
          "Curva suave entre uma seção clara e uma escura, no topo e na base da seção escura (Projeto Piloto). A curva leva a cor da seção vizinha.",
        )}
      />
      <Moldura rotulo={t("Curved dividers demo", "Demonstração dos divisores curvos")}>
        <div className="bg-background px-5 py-8 text-center">
          <p className="text-[0.8125rem] font-semibold text-muted-foreground">{t("Light section", "Seção clara")}</p>
        </div>
        <div className="relative overflow-hidden bg-graphite-900 px-5 pb-20 pt-20 text-center sm:pb-28 sm:pt-28 lg:pb-32 lg:pt-32">
          <CurvaSecao posicao="topo" cor="var(--background)" />
          <SeloSecao size="sm" className="mb-3 border-crimson-300/60 bg-transparent text-crimson-300">{t("Scope of work", "Escopo de atuação")}</SeloSecao>
          <p className="text-[1.375rem] font-extrabold tracking-tight text-white">{t("Where we can work", "Onde podemos atuar")}</p>
          <p className="mx-auto mt-1 max-w-md text-[0.875rem] leading-relaxed text-graphite-200">{t("Different challenges. A systemic view of the experience.", "Diferentes desafios. Uma visão sistêmica da experiência.")}</p>
          <CurvaSecao posicao="base" cor="var(--card)" />
        </div>
        <div className="bg-card px-5 py-8 text-center">
          <p className="text-[0.8125rem] font-semibold text-muted-foreground">{t("Next light section", "Próxima seção clara")}</p>
        </div>
      </Moldura>
      <Orientacoes
        quando={[
          t("Only where a light section meets a dark one; between two light sections, use a straight edge.", "Só onde uma seção clara encontra uma escura; entre duas claras, use borda reta."),
          t("One dark section with curves per page, at most: it is a highlight.", "No máximo uma seção escura com curvas por página: é um destaque."),
          t("Add extra padding (the curve height) so text never sits under the curve.", "Acrescente respiro extra (a altura da curva) para o texto nunca ficar sob a curva."),
        ]}
        a11y={[
          t("Decorative: the SVG is hidden from screen readers and does not receive focus or clicks.", "Decorativo: o SVG fica oculto para leitores de tela e não recebe foco nem clique."),
          t("Text contrast is checked against the dark section, not the curve.", "O contraste do texto é conferido contra a seção escura, não contra a curva."),
          t("Colours by token (var(--background), var(--card)), so the curve follows the theme.", "Cores por token (var(--background), var(--card)), para a curva acompanhar o tema."),
        ]}
      />
      <Codigo>{`import { CurvaSecao } from "@/app/components/ui/curva-secao";

<section className="relative overflow-hidden bg-graphite-900 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32">
  <CurvaSecao posicao="topo" cor="var(--background)" />  {/* cor da seção de cima */}
  …
  <CurvaSecao posicao="base" cor="var(--card)" />        {/* cor da seção de baixo */}
</section>`}</Codigo>
    </section>
  );
}

export function SitePatternsShowcase() {
  const { t } = useI18n();
  return (
    <div className="min-w-0 space-y-16">
      <PageHeader
        eyebrow={t("Components", "Componentes")}
        title={t("Site **patterns**", "Padrões do **site**")}
        description={t(
          "Components brought from the studio website (danimoscatelli.com.br): footer, floating elements, cookie notice, reveal on scroll and curved dividers. Fixed elements appear here inside demo boxes.",
          "Componentes trazidos do site do estúdio (danimoscatelli.com.br): rodapé, elementos flutuantes, aviso de cookies, entrada ao rolar e divisores curvos. Os elementos fixos aparecem aqui dentro de caixas de demonstração.",
        )}
      />
      <SecaoRodape />
      <SecaoFlutuantes />
      <SecaoCookies />
      <SecaoEntrada />
      <SecaoFrentes />
      <SecaoCurvas />
    </div>
  );
}
