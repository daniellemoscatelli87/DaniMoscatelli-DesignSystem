import React, { useState } from "react";
import { Target, Search, Layers, Lightbulb, Wand2, CalendarCheck, LineChart, MapPin, Heart, MessageCircle, Store, Star, ShoppingBag } from "lucide-react";
import { useI18n } from "../../i18n";
import { Timeline, type TimelineStep } from "../ui/timeline";
import { SegmentedControl } from "../ui/segmented-control";
import { Callout, DataTable, DoDont, SubTitle, display } from "./shared/Guidance";
import { TokenTable } from "./shared/TokenTable";

const FINDLOOK = false;

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className={`${display} text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1`}>{title}</h2>
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground max-w-3xl">{description}</p>
    </div>
  );
}

export function TimelineShowcase() {
  const { t } = useI18n();
  const [alternar, setAlternar] = useState<"sim" | "nao">("sim");
  const [check, setCheck] = useState<"icone" | "check">("icone");
  const [animar, setAnimar] = useState<"sim" | "nao">("sim");

  const estudio: TimelineStep[] = [
    { icone: <Target />, titulo: t("Challenge", "Desafio"), descricao: t("You bring a problem, a question or an opportunity, and the platform helps define context, goals and scope.", "Você traz um problema, uma dúvida ou uma oportunidade, e a plataforma ajuda a definir contexto, objetivos e escopo.") },
    { icone: <Search />, titulo: t("Investigation", "Investigação"), descricao: t("Guides what to investigate, with whom, by which methods and sources.", "Orienta o que investigar, com quem, por quais métodos e fontes.") },
    { icone: <Layers />, titulo: t("Evidence", "Evidências"), descricao: t("Gathers accounts, data and observations in one place, reliably.", "Reúne relatos, dados e observações em um só lugar, de forma confiável.") },
    { icone: <Lightbulb />, titulo: t("Diagnosis", "Diagnóstico"), descricao: t("Connects the evidence to identify causes, impacts and opportunities.", "Conecta as evidências para identificar causas, impactos e oportunidades.") },
    { icone: <Wand2 />, titulo: t("Recommendations", "Recomendações"), descricao: t("Proposes feasible solutions, prioritized by evidence and potential impact.", "Propõe soluções viáveis, priorizadas pelas evidências e pelo potencial de impacto.") },
    { icone: <CalendarCheck />, titulo: t("Action plan", "Plano de ação"), descricao: t("Structures the actions with owners, deadlines and indicators.", "Estrutura as ações com responsáveis, prazos e indicadores.") },
    { icone: <LineChart />, titulo: t("Follow-up", "Acompanhamento"), descricao: t("Measures results, compares before and after and guides continuous evolution.", "Mede os resultados, compara antes e depois e orienta a evolução contínua.") },
  ];
  const findlook: TimelineStep[] = [
    { icone: <Search />, titulo: "Descobrir", descricao: "Busque a peça por nome, foto ou estilo e veja quem tem perto de você." },
    { icone: <MapPin />, titulo: "Comparar", descricao: "Compare preços, bairros e disponibilidade entre as lojas da cidade." },
    { icone: <Heart />, titulo: "Favoritar", descricao: "Guarde as peças e as lojas que fizeram sentido para voltar depois." },
    { icone: <MessageCircle />, titulo: "Combinar com a loja", descricao: "Confirme tamanho, cor e reserva direto com quem vende." },
    { icone: <Store />, titulo: "Visitar", descricao: "Vá até a loja com tudo combinado e experimente a peça." },
    { icone: <ShoppingBag />, titulo: "Comprar", descricao: "Feche a compra na loja, sem frete nem espera." },
    { icone: <Star />, titulo: "Avaliar", descricao: "Conte como foi e ajude outras pessoas a encontrar também." },
  ];
  const etapas = FINDLOOK ? findlook : estudio;

  return (
    <div className="space-y-16 pb-16">
      <section id="timeline-demo" className="scroll-mt-32">
        <SectionHeader
          title={t("Timeline", "Linha do tempo")}
          description={t(
            "Ported from the \"How it works\" section of the studio site: steps on a vertical line with a round marker per step and a card. On phones the line sits on the left; from 768 px it sits in the centre and the cards alternate right and left, nested, each with a small arrow pointing to the line. Scroll to see the Step Indicator animation: the step whose marker crosses 60 % of the window becomes current, the previous ones are marked done, the line fills in and each card slides in once.",
            "Portada da seção \"Como funciona\" do site do estúdio: etapas em uma linha vertical com um marcador redondo por etapa e um card. No celular a linha fica à esquerda; a partir de 768 px fica no centro e os cards alternam direita e esquerda, encaixados, cada um com uma setinha apontando para a linha. Role a página para ver a animação Step Indicator: a etapa cujo marcador cruza 60 % da janela vira a atual, as anteriores ficam feitas, a linha se preenche e cada card entra uma vez só.",
          )}
        />
        <div className="mb-6 flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="flex flex-col gap-1.5"><span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Cards", "Cards")}</span><SegmentedControl size="sm" aria-label={t("Card layout", "Disposição dos cards")} value={alternar} onValueChange={setAlternar} options={[{ value: "sim", label: t("Alternating", "Alternados") }, { value: "nao", label: t("Right only", "Só à direita") }]} /></div>
          <div className="flex flex-col gap-1.5"><span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Done steps", "Etapas feitas")}</span><SegmentedControl size="sm" aria-label={t("Done steps", "Etapas feitas")} value={check} onValueChange={setCheck} options={[{ value: "icone", label: t("Keep icon", "Mantêm o ícone") }, { value: "check", label: "Check" }]} /></div>
          <div className="flex flex-col gap-1.5"><span className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Animation", "Animação")}</span><SegmentedControl size="sm" aria-label={t("Animation", "Animação")} value={animar} onValueChange={setAnimar} options={[{ value: "sim", label: t("On scroll", "Na rolagem") }, { value: "nao", label: t("Off", "Desligada") }]} /></div>
        </div>
        <div className="rounded-[24px] border border-border bg-background p-4 sm:p-8">
          <Timeline key={`${alternar}-${check}-${animar}`} etapas={etapas} alternar={alternar === "sim"} checkNasFeitas={check === "check"} animar={animar === "sim"} />
        </div>
      </section>

      <section id="timeline-anatomy" className="scroll-mt-32">
        <SectionHeader title={t("Anatomy", "Anatomia")} description={t("Each step is a list item with three parts: the rail, the marker and the card.", "Cada etapa é um item de lista com três partes: o trilho, o marcador e o card.")} />
        <DataTable
          head={[t("Part", "Parte"), t("Rule", "Regra")]}
          rows={[
            [t("Rail", "Trilho"), t("2 px line. Idle: graphite-200 (graphite-700 in dark mode). Filled: primary. Starts at the first marker's centre and ends at the last one's.", "Linha de 2 px. Em repouso: grafite-200 (grafite-700 no escuro). Preenchida: primária. Começa no centro do primeiro marcador e termina no do último.")],
            [t("Marker", "Marcador"), t("44 px circle (52 px from 768 px), 2 px border, step icon at 22–24 px. Pending: card surface, graphite border and icon. Current or done: primary fill, white icon, --shadow-md. Current scales to 1.15.", "Círculo de 44 px (52 px a partir de 768 px), borda de 2 px, ícone da etapa a 22–24 px. Pendente: superfície do card, borda e ícone em grafite. Atual ou feita: preenchido na primária, ícone branco, --shadow-md. A atual cresce para 1,15.")],
            [t("Card", "Card"), t("Card surface, --border, 20 px radius, --shadow-sm; 16 × 18 px padding; title 18 px bold, text 15 px muted. Hover lifts 3 px with --shadow-md. From 768 px, a 12 px arrow points to the rail.", "Superfície do card, --border, raio de 20 px, --shadow-sm; padding 16 × 18 px; título 18 px bold, texto 15 px muted. Hover sobe 3 px com --shadow-md. A partir de 768 px, uma setinha de 12 px aponta para o trilho.")],
            [t("Layout", "Disposição"), t("Phone: marker column of 44 px + 14 px gap + card. From 768 px: three columns (card · 52 px · card), 28 px gaps, max width 920 px, each step overlapping the previous by 40 px so the cards nest.", "Celular: coluna do marcador de 44 px + 14 px de vão + card. A partir de 768 px: três colunas (card · 52 px · card), vãos de 28 px, largura máxima de 920 px, cada etapa sobrepondo a anterior em 40 px para os cards se encaixarem.")],
          ]}
        />
      </section>

      <section id="timeline-motion" className="scroll-mt-32">
        <SectionHeader title={t("Motion: Step Indicator", "Movimento: Step Indicator")} description={t("The same scroll-driven logic as the site, in React.", "A mesma lógica de rolagem do site, em React.")} />
        <div className="grid gap-5 lg:grid-cols-2">
          <DataTable
            head={[t("Moment", "Momento"), t("What happens", "O que acontece")]}
            rows={[
              [t("Scroll", "Rolagem"), t("On every scroll or resize (one frame at a time via requestAnimationFrame), the step whose marker centre is above 60 % of the window height becomes current; all previous steps are done.", "A cada rolagem ou redimensionamento (um quadro por vez, via requestAnimationFrame), a etapa cujo centro do marcador está acima de 60 % da altura da janela vira a atual; todas as anteriores ficam feitas.")],
              [t("Marker", "Marcador"), t("Colour, border and shadow change in 300 ms; the scale uses a spring curve (cubic-bezier 0.34, 1.56, 0.64, 1) in 400 ms.", "Cor, borda e sombra mudam em 300 ms; a escala usa curva de mola (cubic-bezier 0,34, 1,56, 0,64, 1) em 400 ms.")],
              [t("Rail", "Trilho"), t("The segment below a done marker scales from 0 to 1 (origin top) in 300 ms; the segment above the next marker turns primary.", "O trecho abaixo de um marcador feito escala de 0 a 1 (origem no topo) em 300 ms; o trecho acima do marcador seguinte fica na primária.")],
              [t("Card", "Card"), t("Enters once, 150 ms after its marker: fades in sliding 32 px from the side of the rail (from below on phones) in 700 ms with cubic-bezier 0.16, 1, 0.3, 1.", "Entra uma vez só, 150 ms depois do marcador: surge deslizando 32 px a partir do lado do trilho (de baixo no celular) em 700 ms com cubic-bezier 0,16, 1, 0,3, 1.")],
              [t("Reduced motion", "Movimento reduzido"), t("With prefers-reduced-motion, or animar={false}, nothing moves: rail and markers appear filled, cards visible.", "Com prefers-reduced-motion, ou animar={false}, nada se move: trilho e marcadores aparecem preenchidos, cards visíveis.")],
            ]}
          />
          <div className="space-y-4">
            <Callout title={t("Inner scroll containers", "Contêineres com rolagem própria")}>
              <p>{t("The component listens to scroll in capture mode, so it also works inside a panel that scrolls on its own, like this design system. The threshold is measured against the window height.", "O componente escuta a rolagem em modo de captura, então funciona também dentro de um painel com rolagem própria, como este design system. O limite é medido contra a altura da janela.")}</p>
            </Callout>
            <pre className="overflow-x-auto rounded-[10px] bg-muted/60 p-3 text-[0.75rem] text-muted-foreground"><code>{`import { Timeline } from "@/app/components/ui/timeline";
import { Target, Search } from "lucide-react";

<Timeline
  etapas={[
    { icone: <Target />, titulo: "Desafio", descricao: "…" },
    { icone: <Search />, titulo: "Investigação", descricao: "…" },
  ]}
  alternar          // cards alternando a partir de 768 px
  limite={0.6}      // fração da janela que marca a etapa atual
  checkNasFeitas={false}
/>`}</code></pre>
          </div>
        </div>
      </section>

      <section id="timeline-usage" className="scroll-mt-32">
        <SectionHeader title={t("Usage", "Uso")} description={t("For sequences the person reads top to bottom: how a product works, a journey, a process.", "Para sequências que a pessoa lê de cima para baixo: como um produto funciona, uma jornada, um processo.")} />
        <div className="grid gap-5 lg:grid-cols-2">
          <DoDont
            dos={[
              t("Three to eight steps, each with one short title and one or two sentences.", "De três a oito etapas, cada uma com um título curto e uma ou duas frases."),
              t("One icon per step, from the system's icon set, with meaning tied to the step.", "Um ícone por etapa, do conjunto de ícones do sistema, com significado ligado à etapa."),
              t("Use the alternating layout on wide pages; keep cards on one side inside narrow columns.", "Use a disposição alternada em páginas largas; mantenha os cards de um lado só em colunas estreitas."),
            ]}
            donts={[
              t("Do not use it for navigation or progress of a form: that is the Stepper.", "Não use para navegação nem para o progresso de um formulário: isso é o Stepper."),
              t("Do not put actions inside the cards; the timeline explains, it does not operate.", "Não coloque ações dentro dos cards; a linha do tempo explica, não opera."),
              t("Do not rely on the animation to convey order: the numbering is the DOM order and reads the same with motion off.", "Não dependa da animação para transmitir a ordem: a ordem é a do DOM e lê igual com o movimento desligado."),
            ]}
          />
          <TokenTable groups={[{
            group: t("Timeline tokens", "Tokens da linha do tempo"),
            tokens: [
              { name: "--primary", description: t("Filled rail, current and done markers", "Trilho preenchido, marcadores atual e feitos"), light: "var(--primary)", isColor: false },
              { name: "--graphite-200 / 700", description: t("Idle rail and pending marker (light / dark)", "Trilho em repouso e marcador pendente (claro / escuro)"), light: "#…", isColor: false },
              { name: "--card · --border", description: t("Marker and card surfaces", "Superfícies do marcador e do card"), light: "var(--card) · var(--border)", isColor: false },
              { name: "--shadow-sm · --shadow-md", description: t("Card at rest · card hover and active marker", "Card em repouso · card em hover e marcador ativo"), light: "tokens", isColor: false },
              { name: "radius", description: t("Card radius", "Raio do card"), light: "20 px" },
              { name: "marker", description: t("Marker size", "Tamanho do marcador"), light: "44 px · 52 px (≥ 768 px)" },
            ],
          }]} />
        </div>
      </section>
    </div>
  );
}
