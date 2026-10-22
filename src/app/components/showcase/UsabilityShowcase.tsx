import React, { useEffect, useRef, useState } from "react";
import {
  Eye, Compass, Undo2, MessageSquare, Gauge, Layers, Check, Loader2, Trash2, Inbox, AlertTriangle, RotateCcw, FileText,
} from "lucide-react";
import { PageHeader, PageSection } from "./GetStartedShowcase";
import { useI18n } from "../../i18n";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, display } from "./shared/Guidance";

type Bi = { en: string; pt: string };

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* ── Touch targets ── */
function TargetDemo() {
  const { t, bi } = useI18n();
  const sizes = [
    { px: 24, label: "24px", note: { en: "WCAG 2.2 minimum", pt: "Mínimo da WCAG 2.2" }, cls: "h-6 w-6" },
    { px: 32, label: "32px", note: { en: "Compact, desktop only", pt: "Compacto, só desktop" }, cls: "h-8 w-8" },
    { px: 40, label: "40px", note: { en: "Default control", pt: "Controle padrão" }, cls: "h-10 w-10" },
    { px: 44, label: "44px", note: { en: "Recommended on touch", pt: "Recomendado em toque" }, cls: "h-11 w-11" },
  ];
  return (
    <Panel className="p-5">
      <ul className="flex flex-wrap items-end gap-6">
        {sizes.map(s => (
          <li key={s.px} className="flex flex-col items-center gap-2">
            <button
              type="button"
              aria-label={t(`${s.label} target`, `Alvo de ${s.label}`)}
              className={`${s.cls} rounded-[8px] bg-primary/10 border border-primary/40 text-primary flex items-center justify-center transition-colors hover:bg-primary/20 ${ring}`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="text-[0.8125rem] font-semibold text-foreground">{s.label}</span>
            <span className="text-[0.6875rem] text-muted-foreground text-center max-w-[110px] leading-snug">{bi(s.note)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── System status ── */
function FeedbackDemo() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    if (state === "loading") return;
    setState("loading");
    timers.current.push(window.setTimeout(() => setState("done"), 1600));
    timers.current.push(window.setTimeout(() => setState("idle"), 3800));
  };
  return (
    <Panel className="p-5 flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={run}
        aria-disabled={state === "loading"}
        className={`h-10 min-w-[148px] px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium inline-flex items-center justify-center gap-2 transition-opacity aria-disabled:opacity-70 aria-disabled:cursor-progress ${ring}`}
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
        {state === "done" && <Check className="h-4 w-4" aria-hidden />}
        {state === "idle" ? t("Publish changes", "Publicar alterações") : state === "loading" ? t("Publishing…", "Publicando…") : t("Published", "Publicado")}
      </button>
      <p role="status" className="text-[0.8125rem] text-muted-foreground min-h-[1.25rem]">
        {state === "loading" ? t("Publishing 3 files. This usually takes a few seconds.", "Publicando 3 arquivos. Isso costuma levar alguns segundos.") : state === "done" ? t("Live at 14:32. Visitors see the update now.", "No ar às 14:32. Os visitantes já veem a atualização.") : t("Click to see the three feedback states.", "Clique para ver os três estados de feedback.")}
      </p>
    </Panel>
  );
}

/* ── Destructive action with undo ── */
const initialDocs: Bi[] = [
  { en: "Q3 roadmap", pt: "Roadmap do 3º tri" },
  { en: "Brand guidelines v2", pt: "Diretrizes da marca v2" },
  { en: "Onboarding checklist", pt: "Checklist de onboarding" },
];

function UndoDemo() {
  const { t, bi } = useI18n();
  const [docs, setDocs] = useState(initialDocs);
  const [removed, setRemoved] = useState<{ name: Bi; index: number } | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const remove = (name: Bi, index: number) => {
    setDocs(d => d.filter(x => x.en !== name.en));
    setRemoved({ name, index });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRemoved(null), 6000);
  };
  const undo = () => {
    if (!removed) return;
    setDocs(d => { const n = [...d]; n.splice(removed.index, 0, removed.name); return n; });
    setRemoved(null);
    clearTimeout(timer.current);
  };
  return (
    <Panel className="p-5">
      <ul className="divide-y divide-border rounded-[10px] border border-border overflow-hidden">
        {docs.map((d, i) => (
          <li key={d.en} className="flex items-center justify-between gap-3 px-3 py-2 bg-background/40">
            <span className="flex items-center gap-2.5 text-[0.8125rem] text-foreground"><FileText className="h-4 w-4 text-muted-foreground" aria-hidden />{bi(d)}</span>
            <button
              type="button"
              aria-label={t(`Delete ${d.en}`, `Excluir ${d.pt}`)}
              onClick={() => remove(d, i)}
              className={`h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${ring}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
        {docs.length === 0 && <li className="px-3 py-6 text-center text-[0.8125rem] text-muted-foreground">{t("No documents left.", "Nenhum documento restante.")}</li>}
      </ul>
      <div role="status" className="mt-3 min-h-[2.5rem]">
        {removed && (
          <div className="flex items-center justify-between gap-3 rounded-[10px] bg-foreground text-background px-3 py-2 text-[0.8125rem]">
            <span>{t(`“${removed.name.en}” deleted.`, `“${removed.name.pt}” excluído.`)}</span>
            <button type="button" onClick={undo} className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background">
              <Undo2 className="h-3.5 w-3.5" aria-hidden /> {t("Undo", "Desfazer")}
            </button>
          </div>
        )}
      </div>
      {docs.length < initialDocs.length && !removed && (
        <button type="button" onClick={() => setDocs(initialDocs)} className={`mt-1 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-muted-foreground hover:text-foreground rounded-[4px] ${ring}`}>
          <RotateCcw className="h-3 w-3" aria-hidden /> {t("Reset demo", "Reiniciar demo")}
        </button>
      )}
    </Panel>
  );
}

/* ── Content states ── */
type ViewState = "loading" | "empty" | "error" | "content";
const viewStates: { id: ViewState; label: Bi }[] = [
  { id: "loading", label: { en: "Loading", pt: "Carregando" } },
  { id: "empty", label: { en: "Empty", pt: "Vazio" } },
  { id: "error", label: { en: "Error", pt: "Erro" } },
  { id: "content", label: { en: "Content", pt: "Conteúdo" } },
];

function StatesDemo() {
  const { t, bi } = useI18n();
  const [view, setView] = useState<ViewState>("loading");
  return (
    <div className="space-y-3">
      <div role="group" aria-label={t("Preview state", "Estado da prévia")} className="inline-flex flex-wrap p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
        {viewStates.map(s => (
          <button
            key={s.id}
            type="button"
            aria-pressed={view === s.id}
            onClick={() => setView(s.id)}
            className={`h-8 px-3 rounded-[8px] text-[0.75rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              view === s.id ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {bi(s.label)}
          </button>
        ))}
      </div>
      <Panel className="p-6 min-h-[200px] flex">
        {view === "loading" && (
          <div className="w-full space-y-3" role="status" aria-label={t("Loading projects", "Carregando projetos")}>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[8px] bg-muted animate-pulse motion-reduce:animate-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  <div className="h-3 w-2/3 rounded bg-muted/70 animate-pulse motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>
        )}
        {view === "empty" && (
          <div className="m-auto text-center max-w-xs">
            <Inbox className="h-6 w-6 text-muted-foreground mx-auto mb-3" aria-hidden />
            <p className={`${display} text-[1rem] font-semibold text-foreground mb-1`}>{t("No projects yet", "Nenhum projeto ainda")}</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">{t("Projects you create appear here. Start with a template to see how it works.", "Os projetos que você criar aparecem aqui. Comece com um template para ver como funciona.")}</p>
            <button type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>{t("Create project", "Criar projeto")}</button>
          </div>
        )}
        {view === "error" && (
          <div role="alert" className="m-auto text-center max-w-xs">
            <AlertTriangle className="h-6 w-6 text-[var(--error)] mx-auto mb-3" aria-hidden />
            <p className={`${display} text-[1rem] font-semibold text-foreground mb-1`}>{t("We couldn't load your projects", "Não foi possível carregar seus projetos")}</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">{t("Check your connection and try again. Your work is safe.", "Verifique sua conexão e tente novamente. Seu trabalho está seguro.")}</p>
            <button type="button" className={`h-9 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.8125rem] font-medium hover:bg-muted ${ring}`}>{t("Try again", "Tentar novamente")}</button>
          </div>
        )}
        {view === "content" && (
          <ul className="w-full divide-y divide-border">
            {[[t("Atlas redesign", "Redesign do Atlas"), t("Updated 2 hours ago", "Atualizado há 2 horas")], [t("Billing flow", "Fluxo de cobrança"), t("Updated yesterday", "Atualizado ontem")], [t("Docs refresh", "Atualização da documentação"), t("Updated Mar 4", "Atualizado em 4 mar")]].map(([n, d]) => (
              <li key={n} className="flex items-center justify-between py-3">
                <span className="text-[0.875rem] font-medium text-foreground">{n}</span>
                <span className="text-[0.75rem] text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ── Button hierarchy ── */
function HierarchyDemo() {
  const { t } = useI18n();
  return (
    <Panel className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { title: t("One primary action", "Uma única ação primária"), good: true },
        { title: t("Competing primaries", "Ações primárias concorrentes"), good: false },
      ].map(c => (
        <div key={String(c.good)}>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3 flex items-center gap-1.5">
            {c.good ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <span aria-hidden className="text-[0.875rem] leading-none">×</span>}
            {c.title}
          </p>
          <div className="rounded-[10px] border border-border bg-background/40 p-4">
            <p className="text-[0.875rem] font-medium text-foreground mb-3">{t("Discard unsaved draft?", "Descartar rascunho não salvo?")}</p>
            <div className="flex flex-wrap items-center gap-2">
              {c.good ? (
                <>
                  <button type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>{t("Save draft", "Salvar rascunho")}</button>
                  <button type="button" className={`h-9 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.8125rem] font-medium hover:bg-muted ${ring}`}>{t("Keep editing", "Continuar editando")}</button>
                  <button type="button" className={`h-9 px-3 rounded-[10px] text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground ${ring}`}>{t("Discard", "Descartar")}</button>
                </>
              ) : (
                [t("Save draft", "Salvar rascunho"), t("Keep editing", "Continuar editando"), t("Discard", "Descartar")].map(l => (
                  <button key={l} type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>{l}</button>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </Panel>
  );
}

const principles: { icon: React.ElementType; title: Bi; desc: Bi }[] = [
  { icon: Gauge, title: { en: "Show system status", pt: "Mostrar o status do sistema" }, desc: { en: "Acknowledge every action within 100ms and say what is happening, how long it takes and when it finishes.", pt: "Reconheça cada ação em até 100ms e diga o que está acontecendo, quanto tempo leva e quando termina." } },
  { icon: Compass, title: { en: "Keep people oriented", pt: "Manter as pessoas orientadas" }, desc: { en: "Breadcrumbs, active states and consistent placement answer where am I, and where can I go.", pt: "Breadcrumbs, estados ativos e posicionamento consistente respondem onde estou e para onde posso ir." } },
  { icon: Undo2, title: { en: "Forgive mistakes", pt: "Perdoar erros" }, desc: { en: "Prefer undo over confirmation dialogs. Reserve blocking confirmations for irreversible actions.", pt: "Prefira desfazer a diálogos de confirmação. Reserve confirmações bloqueantes para ações irreversíveis." } },
  { icon: Layers, title: { en: "Be consistent", pt: "Ser consistente" }, desc: { en: "Same action, same component, same word. Tokens and shared components make this the default.", pt: "Mesma ação, mesmo componente, mesma palavra. Tokens e componentes compartilhados tornam isso o padrão." } },
  { icon: Eye, title: { en: "Recognize, don't recall", pt: "Reconhecer, não lembrar" }, desc: { en: "Show options, labels and recent values instead of asking people to remember them.", pt: "Mostre opções, rótulos e valores recentes em vez de pedir que as pessoas se lembrem deles." } },
  { icon: MessageSquare, title: { en: "Speak plainly", pt: "Falar de forma simples" }, desc: { en: "Use the user's words. Describe the outcome of a button, not the mechanism behind it.", pt: "Use as palavras do usuário. Descreva o resultado de um botão, não o mecanismo por trás dele." } },
];

export function UsabilityShowcase() {
  const { t, bi } = useI18n();
  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow={t("Guidelines", "Diretrizes")}
        title={t("Usability", "Usabilidade")}
        description={t("Patterns that make interfaces easy to understand and hard to get wrong. Use them as a checklist when designing a screen or reviewing what an AI tool generated.", "Padrões que tornam as interfaces fáceis de entender e difíceis de errar. Use-os como checklist ao projetar uma tela ou revisar o que uma ferramenta de IA gerou.")}
      />

      <PageSection
        id="ux-principles"
        label={t("Principles", "Princípios")}
        title={t("Six principles", "Seis princípios")}
        intro={<p>{t("Adapted from Nielsen's usability heuristics to the way this system is built and used.", "Adaptado das heurísticas de usabilidade de Nielsen para a forma como este sistema é construído e usado.")}</p>}
      >
        <PrincipleGrid items={principles.map(p => ({ ...p, title: bi(p.title), desc: bi(p.desc) }))} />
      </PageSection>

      <PageSection
        id="ux-hierarchy"
        label={t("Interaction", "Interação")}
        title={t("Action hierarchy", "Hierarquia de ações")}
        intro={<p>{t("Each view has one primary action. Secondary actions use the outlined style and tertiary ones are text only, so the next step is obvious at a glance.", "Cada tela tem uma ação primária. As ações secundárias usam o estilo com contorno e as terciárias são só texto, para que o próximo passo seja óbvio de relance.")}</p>}
      >
        <div className="space-y-5">
          <HierarchyDemo />
          <DataTable
            head={[t("Level", "Nível"), t("Style", "Estilo"), t("Use for", "Usar para")]}
            rows={[
              [t("Primary", "Primário"), <Mono>bg-primary</Mono>, t("The one thing most people came to do", "A única coisa que a maioria das pessoas veio fazer")],
              [t("Secondary", "Secundário"), <Mono>border-border bg-card</Mono>, t("Alternatives of equal importance", "Alternativas de igual importância")],
              [t("Tertiary", "Terciário"), <Mono>text-muted-foreground</Mono>, t("Low-emphasis or reversible actions", "Ações de baixa ênfase ou reversíveis")],
            ]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-targets"
        label={t("Interaction", "Interação")}
        title={t("Target size and spacing", "Tamanho e espaçamento dos alvos")}
        intro={<p>{t("Small targets cause mis-taps and exclude people with limited dexterity. WCAG 2.2 requires 24px, and 44px is the safer size on touch. Keep at least 8px between adjacent targets.", "Alvos pequenos causam toques errados e excluem pessoas com destreza limitada. A WCAG 2.2 exige 24px, e 44px é o tamanho mais seguro em toque. Mantenha pelo menos 8px entre alvos adjacentes.")}</p>}
      >
        <div className="space-y-5">
          <TargetDemo />
          <Callout title={t("Small icon, large target", "Ícone pequeno, alvo grande")}>
            <p>{t("A 16px icon can sit inside a 40px button. Grow the hit area with padding instead of enlarging the icon.", "Um ícone de 16px pode ficar dentro de um botão de 40px. Aumente a área de toque com padding em vez de aumentar o ícone.")}</p>
          </Callout>
        </div>
      </PageSection>

      <PageSection
        id="ux-feedback"
        label={t("Feedback", "Feedback")}
        title={t("System status", "Status do sistema")}
        intro={<p>{t("People should never wonder whether something worked. Match the feedback to how long the wait is.", "As pessoas nunca devem se perguntar se algo funcionou. Ajuste o feedback ao tempo de espera.")}</p>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FeedbackDemo />
          <DataTable
            head={[t("Wait", "Espera"), t("Feedback", "Feedback")]}
            rows={[
              ["< 100ms", t("None needed. Update the UI directly.", "Nenhum necessário. Atualize a UI diretamente.")],
              [t("100ms to 1s", "100ms a 1s"), t("Pressed state or inline spinner.", "Estado pressionado ou spinner inline.")],
              [t("1s to 10s", "1s a 10s"), t("Spinner or skeleton plus a status message.", "Spinner ou skeleton mais uma mensagem de status.")],
              ["> 10s", t("Determinate progress, time estimate and a way to cancel.", "Progresso determinado, estimativa de tempo e uma forma de cancelar.")],
            ]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-states"
        label={t("Feedback", "Feedback")}
        title={t("Every view has four states", "Toda tela tem quatro estados")}
        intro={<p>{t("Design loading, empty, error and content together. Empty and error states should explain what happened and offer one clear next step.", "Projete juntos os estados de loading, vazio, erro e conteúdo. Estados vazios e de erro devem explicar o que aconteceu e oferecer um próximo passo claro.")}</p>}
      >
        <StatesDemo />
      </PageSection>

      <PageSection
        id="ux-errors"
        label={t("Content", "Conteúdo")}
        title={t("Errors and microcopy", "Erros e microcopy")}
        intro={<p>{t("Say what happened, why, and how to fix it. Blame the situation, not the person, and keep technical codes out of the headline.", "Diga o que aconteceu, por quê e como corrigir. Culpe a situação, não a pessoa, e mantenha códigos técnicos fora do título.")}</p>}
      >
        <div className="space-y-5">
          <DataTable
            head={[t("Instead of", "Em vez de"), t("Write", "Escreva")]}
            rows={[
              [t("Invalid input", "Entrada inválida"), t("Enter an email like name@company.com.", "Informe um e-mail como nome@empresa.com.")],
              [t("Error 500", "Erro 500"), t("Something went wrong on our side. Try again in a minute.", "Algo deu errado do nosso lado. Tente novamente em um minuto.")],
              [t("Submit", "Enviar"), t("Send invite", "Enviar convite")],
              [t("Are you sure?", "Tem certeza?"), t("Delete “Q3 roadmap”? You can undo this for 6 seconds.", "Excluir “Roadmap do 3º tri”? Você pode desfazer por 6 segundos.")],
              [t("You entered the wrong password", "Você digitou a senha errada"), t("That password doesn't match. Try again or reset it.", "Essa senha não confere. Tente novamente ou redefina-a.")],
            ]}
          />
          <DoDont
            dos={[t("Name the object in the button: Save draft, Send invite", "Nomeie o objeto no botão: Salvar rascunho, Enviar convite"), t("Put the fix next to the field that failed", "Coloque a correção ao lado do campo que falhou"), t("Use sentence case and plain words", "Use apenas a primeira letra maiúscula e palavras simples")]}
            donts={[t("Don't use vague verbs like Submit or OK", "Não use verbos vagos como Enviar ou OK"), t("Don't clear the form after an error", "Não limpe o formulário após um erro"), t("Don't show a toast alone for field errors", "Não mostre apenas um toast para erros de campo")]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-destructive"
        label={t("Safety", "Segurança")}
        title={t("Destructive actions", "Ações destrutivas")}
        intro={<p>{t("Undo beats “Are you sure?” because people click through confirmations on autopilot. Delete immediately, offer undo for a few seconds, and keep the dialog for actions that truly cannot be reversed.", "Desfazer vence o “Tem certeza?” porque as pessoas clicam em confirmações no piloto automático. Exclua imediatamente, ofereça desfazer por alguns segundos e reserve o diálogo para ações que realmente não podem ser revertidas.")}</p>}
      >
        <UndoDemo />
      </PageSection>

      <PageSection
        id="ux-checklist"
        label={t("Review", "Revisão")}
        title={t("Quick review", "Revisão rápida")}
        intro={<p>{t("Ask these before shipping a screen. Pair with the accessibility checklist.", "Faça estas perguntas antes de publicar uma tela. Combine com o checklist de acessibilidade.")}</p>}
      >
        <DataTable
          head={[t("Question", "Pergunta"), t("Check", "Verificar")]}
          rows={[
            [t("Is there exactly one primary action?", "Existe exatamente uma ação primária?"), t("Action hierarchy", "Hierarquia de ações")],
            [t("Does every click give feedback in under 100ms?", "Todo clique dá feedback em menos de 100ms?"), t("System status", "Status do sistema")],
            [t("Can the person recover from a mistake?", "A pessoa consegue se recuperar de um erro?"), t("Undo, error messages", "Desfazer, mensagens de erro")],
            [t("Do loading, empty and error states exist?", "Existem estados de loading, vazio e erro?"), t("Content states", "Estados de conteúdo")],
            [t("Are targets at least 24px, ideally 44px on touch?", "Os alvos têm pelo menos 24px, idealmente 44px em toque?"), t("Target size", "Tamanho do alvo")],
            [t("Do labels use the user's words?", "Os rótulos usam as palavras do usuário?"), t("Microcopy", "Microcopy")],
          ]}
        />
      </PageSection>
    </div>
  );
}
