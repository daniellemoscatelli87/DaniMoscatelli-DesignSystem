import React, { useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { useI18n } from "../../i18n";
import { PageHeader } from "./GetStartedShowcase";
import { SectionHeader } from "./shared/SectionHeader";
import { Panel, SubTitle } from "./shared/Guidance";
import { RodapeSite } from "../ui/rodape-site";
import { BotaoWhatsApp, linkWhatsApp } from "../ui/botao-whatsapp";
import { AvisoProjeto } from "../ui/aviso-projeto";
import { BotaoSubir } from "../ui/botao-subir";
import { AvisoCookies } from "../ui/aviso-cookies";
import { SurgirAoRolar, TituloQueSurge } from "../ui/surgir-ao-rolar";
import { CurvaSecao } from "../ui/curva-secao";
import { SegmentedControl } from "../ui/segmented-control";
import { SeloSecao } from "../ui/selo-secao";
import { Button } from "../ui/button";
import logoSobreClaro from "../../../imports/Logo-Horizontal-DarkMode.png";
import logoSobreEscuro from "../../../imports/Logo-Horizontal-LightMode.png";

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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Panel className="p-5">
        <SubTitle>{t("When to use", "Quando usar")}</SubTitle>
        <Lista itens={quando} />
      </Panel>
      <Panel className="p-5">
        <SubTitle>{t("Accessibility", "Acessibilidade")}</SubTitle>
        <Lista itens={a11y} />
      </Panel>
    </div>
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
    <div role="group" aria-label={rotulo} className={`relative overflow-hidden rounded-lg border border-border bg-background ${className}`}>
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
          "Fixed at the bottom right of every site page: the WhatsApp button; on Home, the “Got a project?” notice pointing to it; and, when the footer appears, the back-to-top button beside it.",
          "Fixos no canto inferior direito de todas as páginas do site: o botão do WhatsApp; na Home, o aviso “Tem um projeto?” apontando para ele; e, quando o rodapé aparece, o botão de voltar ao topo ao lado dele.",
        )}
      />
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={() => setChave(k => k + 1)}>
          <RotateCcw aria-hidden /> {t("Show the notices again", "Mostrar os avisos de novo")}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <Rotulo titulo={t("Computer: notice above the button", "Computador: aviso acima do botão")} desc={t("From 1024 px, the notice floats above the WhatsApp button, with the arrow pointing down.", "A partir de 1024 px, o aviso flutua acima do botão do WhatsApp, com a seta para baixo.")} />
          <Moldura className="h-[300px]" rotulo={t("Computer demo", "Demonstração no computador")}>
            <PaginaFalsa />
            <AvisoProjeto key={`a${chave}`} posicao="acima" {...aviso} />
            <BotaoWhatsApp {...whats} />
          </Moldura>
        </div>
        <div>
          <Rotulo titulo={t("Phone: notice beside the button", "Celular: aviso ao lado do botão")} desc={t("Up to 1023 px, it takes the space to the left of the button, with the arrow pointing right.", "Até 1023 px, ocupa o espaço à esquerda do botão, com a seta para a direita.")} />
          <Moldura className="mx-auto h-[300px] max-w-[390px]" rotulo={t("Phone demo", "Demonstração no celular")}>
            <PaginaFalsa />
            <AvisoProjeto key={`b${chave}`} posicao="ao-lado" {...aviso} />
            <BotaoWhatsApp {...whats} />
          </Moldura>
        </div>
      </div>
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
      <Orientacoes
        quando={[
          t("WhatsApp button: on every page of the site, always in the same place.", "Botão do WhatsApp: em todas as páginas do site, sempre no mesmo lugar."),
          t("“Got a project?” notice: only on the home page; once closed, it does not come back in the same session.", "Aviso “Tem um projeto?”: só na página inicial; depois de fechado, não volta na mesma sessão."),
          t("Back to top: long pages; it appears only when the footer enters the screen.", "Voltar ao topo: páginas longas; aparece só quando o rodapé entra na tela."),
          t("On phones, keep 20 px from the edges and 12 px between the floating elements; reserve space at the end of the page so they do not cover the footer.", "No celular, mantenha 20 px das bordas e 12 px entre os flutuantes; reserve espaço no fim da página para eles não cobrirem o rodapé."),
        ]}
        a11y={[
          t("Icon-only buttons have a name (“Chat with Dani on WhatsApp”, “Back to the top of the page”).", "Botões só com ícone têm nome (“Conversar com a Dani no WhatsApp”, “Voltar ao topo da página”)."),
          t("The notice has its own close button (“Close notice”), reachable by keyboard.", "O aviso tem botão próprio de fechar (“Fechar aviso”), alcançável pelo teclado."),
          t("Hidden back-to-top leaves the Tab order; after going up, focus moves to the start of the content.", "O voltar ao topo escondido sai da ordem do Tab; depois de subir, o foco vai para o começo do conteúdo."),
          t("With reduced motion: no entrance, no floating and the return to the top is instant.", "Com movimento reduzido: sem entrada, sem flutuar e a volta ao topo é instantânea."),
          t("Touch areas of 56 × 56 px.", "Áreas de toque de 56 × 56 px."),
          t("The WhatsApp green is the WhatsApp brand colour, only on that button; the icon is white.", "O verde do WhatsApp é a cor da marca do WhatsApp, só nesse botão; o ícone é branco."),
        ]}
      />
      <Codigo>{`import { BotaoWhatsApp, linkWhatsApp } from "@/app/components/ui/botao-whatsapp";
import { AvisoProjeto } from "@/app/components/ui/aviso-projeto";
import { BotaoSubir } from "@/app/components/ui/botao-subir";

<BotaoWhatsApp numero="5541997485414" mensagem="Olá, Dani! ..." />
<AvisoProjeto href={linkWhatsApp("5541997485414")} />   {/* só na Home */}
<BotaoSubir />                                          {/* aparece com o rodapé */}`}</Codigo>
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

/* ───────────── Entrada ao rolar ───────────── */

function SecaoEntrada() {
  const { t } = useI18n();
  const [efeito, setEfeito] = useState<"subir" | "desfoque">("subir");
  const [chave, setChave] = useState(0);
  const raiz = useRef<HTMLDivElement>(null);
  const cards = [
    [t("Experience Research and Strategy", "Pesquisa e Estratégia de Experiência"), t("Understand people and identify opportunities", "Compreender pessoas e identificar oportunidades")],
    [t("Journeys and Customer Experience", "Jornadas e Experiência do Cliente"), t("Improve each interaction along the journey", "Melhorar cada interação ao longo da jornada")],
    [t("Service Design and Transformation", "Design e Transformação de Serviços"), t("Align operations with the desired experience", "Alinhar operações à experiência desejada")],
  ];
  const titulo = t("Where we can work", "Onde podemos atuar");
  const selo = t("Scope of work", "Escopo de atuação");
  const desc = t("Different challenges. A systemic view of the experience.", "Diferentes desafios. Uma visão sistêmica da experiência.");
  return (
    <section id="site-entrada" className="scroll-mt-24 space-y-6">
      <SectionHeader
        title={t("Reveal on scroll", "Entrada ao rolar")}
        description={t(
          "Blocks come in when they reach the screen, once. Two effects from the site: slide up (Projeto Piloto) and blur reveal, with the title word by word (Home and Seja Parceiro).",
          "Os blocos entram quando chegam na tela, uma vez. Dois efeitos do site: subir (Projeto Piloto) e surgir do desfoque, com o título palavra por palavra (Home e Seja Parceiro).",
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
        <Button type="button" variant="outline" size="sm" onClick={() => { raiz.current?.scrollTo({ top: 0 }); setChave(k => k + 1); }}>
          <RotateCcw aria-hidden /> {t("Play again", "Ver de novo")}
        </Button>
      </div>
      <Moldura rotulo={t("Reveal demo", "Demonstração da entrada")}>
        <div ref={raiz} id="site-entrada-rolagem" tabIndex={0} aria-label={t("Scrollable demo page", "Página de demonstração com rolagem")} className="h-[460px] overflow-y-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
          <p className="px-5 pt-5 text-center text-[0.8125rem] text-muted-foreground">{t("Scroll down inside the box ↓", "Role para baixo dentro da caixa ↓")}</p>
          <div className="h-[300px]" aria-hidden />
          <div key={`${efeito}-${chave}`} className="px-5 pb-10 text-center">
            {efeito === "subir" ? (
              <SurgirAoRolar raiz={raiz} escalonar className="flex flex-col items-center">
                <SeloSecao size="sm" className="mb-3">{selo}</SeloSecao>
                <h3 className="mb-2 text-[1.5rem] font-extrabold tracking-tight text-foreground">{titulo}</h3>
                <p className="max-w-md text-[0.875rem] leading-relaxed text-muted-foreground">{desc}</p>
              </SurgirAoRolar>
            ) : (
              <div className="flex flex-col items-center">
                <SurgirAoRolar raiz={raiz} efeito="desfoque"><SeloSecao size="sm" className="mb-3">{selo}</SeloSecao></SurgirAoRolar>
                <TituloQueSurge as="h3" raiz={raiz} className="mb-2 text-[1.5rem] font-extrabold tracking-tight text-foreground">{titulo}</TituloQueSurge>
                <SurgirAoRolar raiz={raiz} efeito="desfoque" atraso={200 + titulo.split(" ").length * 45}>
                  <p className="max-w-md text-[0.875rem] leading-relaxed text-muted-foreground">{desc}</p>
                </SurgirAoRolar>
              </div>
            )}
            <SurgirAoRolar raiz={raiz} efeito={efeito} escalonar className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {cards.map(([a, b]) => (
                <div key={a} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <p className="text-[0.9375rem] font-bold text-foreground">{a}</p>
                  <p className="mt-1 text-[0.8125rem] font-semibold text-[var(--primary-text)]">{b}</p>
                </div>
              ))}
            </SurgirAoRolar>
          </div>
        </div>
      </Moldura>
      <Orientacoes
        quando={[
          t("Section headers and groups of cards on marketing pages.", "Cabeçalhos de seção e grupos de cards em páginas de divulgação."),
          t("Slide up for most blocks; blur with the word-by-word title for the main sections of a landing page.", "Subir para a maioria dos blocos; desfoque com o título palavra por palavra nas seções principais de uma landing page."),
          t("Not in panels, forms and data: content people work with must already be there.", "Não use em painéis, formulários e dados: o conteúdo de trabalho tem de estar lá."),
        ]}
        a11y={[
          t("With reduced motion, nothing is hidden and nothing moves.", "Com movimento reduzido, nada fica escondido e nada se mexe."),
          t("Without JavaScript or IntersectionObserver, the content stays visible.", "Sem JavaScript ou sem IntersectionObserver, o conteúdo continua visível."),
          t("The word-by-word title keeps the whole sentence for screen readers.", "O título palavra por palavra mantém a frase inteira para leitores de tela."),
          t("It animates once (repeating is optional) and lasts less than 1 s per block.", "Anima uma vez (repetir é opcional) e dura menos de 1 s por bloco."),
        ]}
      />
      <Codigo>{`import { SurgirAoRolar, TituloQueSurge } from "@/app/components/ui/surgir-ao-rolar";

<SurgirAoRolar escalonar>            {/* subir: 24 px, 0,7 s, filhos a cada 70 ms */}
  <SeloSecao>Escopo de atuação</SeloSecao>
  <h2>Onde podemos atuar</h2>
</SurgirAoRolar>

<TituloQueSurge>Onde podemos atuar</TituloQueSurge>
<SurgirAoRolar efeito="desfoque" escalonar>{cards}</SurgirAoRolar>`}</Codigo>
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
      <SecaoCurvas />
    </div>
  );
}
