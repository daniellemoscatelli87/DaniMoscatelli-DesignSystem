import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ClipboardCheck, Loader2 } from "lucide-react";
import { useI18n } from "../../i18n";
import { AlertaComAcao, BotaoDoAlerta, LinkDoAlerta, type TomDoAlerta } from "../ui/alerta-com-acao";
import { Callout, DoDont, Mono, Panel } from "./shared/Guidance";

/**
 * Documentation for Alerta com ação (approved by the product owner on 23/11/2026).
 * Same structure as the FindLook DS; example texts adapted to studio projects.
 */

function Rotulo({ children }: { children: React.ReactNode }) {
  return <h4 className="mb-4 text-body-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</h4>;
}

/* Project example with a simulated action: loading, then the alert turns into success. */
function DemoAvisoDoProjeto() {
  const { t } = useI18n();
  const [fase, setFase] = useState<"aviso" | "confirmando" | "confirmado">("aviso");
  const area = useRef<HTMLDivElement>(null);
  const primeiraVez = useRef(true);
  useEffect(() => {
    if (fase !== "confirmando") return;
    const id = window.setTimeout(() => setFase("confirmado"), 700);
    return () => window.clearTimeout(id);
  }, [fase]);
  // The clicked button disappears: focus moves to the next visible action
  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return; }
    if (fase === "confirmando") return;
    area.current?.querySelector<HTMLElement>(fase === "confirmado" ? '[data-slot="link-do-alerta"]' : '[data-slot="botao-do-alerta"]')?.focus();
  }, [fase]);

  return (
    <div ref={area}>
      {fase === "confirmado" ? (
        <AlertaComAcao
          tom="sucesso"
          titulo={t("Deliverables reviewed today", "Entregas revisadas hoje")}
          rotuloFechar={t("Close", "Fechar")}
          acoes={<>
            <BotaoDoAlerta><ArrowRight aria-hidden />{t("View deliverables", "Ver entregas")}</BotaoDoAlerta>
            <LinkDoAlerta onClick={() => setFase("aviso")}>{t("Show the notice again", "Ver o aviso de novo")}</LinkDoAlerta>
          </>}
        >
          {t("The schedule stays as planned.", "O cronograma segue como combinado.")}
        </AlertaComAcao>
      ) : (
        <AlertaComAcao
          tom="aviso"
          titulo={t("Your project will be paused on Wednesday", "Seu projeto vai ficar pausado na quarta-feira")}
          acoes={
            <BotaoDoAlerta onClick={() => fase === "aviso" && setFase("confirmando")} aria-busy={fase === "confirmando"}>
              {fase === "confirmando"
                ? <><Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />{t("Confirming…", "Confirmando…")}</>
                : <><ClipboardCheck aria-hidden />{t("Confirm the deliverables are approved", "Confirmar que estão aprovadas")}</>}
            </BotaoDoAlerta>
          }
        >
          <p>{t(
            "We haven't heard back about the latest deliverables for 3 business days. While the project is paused, the next stage waits, so the team doesn't move ahead on something that may still change. Confirm to keep the schedule.",
            "Faz 3 dias úteis que não recebemos seu retorno sobre as últimas entregas. Com o projeto pausado, a próxima etapa fica em espera, para a equipe não avançar em algo que ainda pode mudar. Confirme para manter o cronograma.",
          )}</p>
          <p><strong>{t("Need changes?", "Precisa de ajustes?")}</strong> {t("Mark them as", "Marque como")} <strong>{t("“to adjust”", "“a ajustar”")}</strong> {t("before confirming.", "antes de confirmar.")}</p>
        </AlertaComAcao>
      )}
    </div>
  );
}

function DemoInfoFechavel() {
  const { t } = useI18n();
  const [aberto, setAberto] = useState(true);
  const area = useRef<HTMLDivElement>(null);
  const primeiraVez = useRef(true);
  useEffect(() => {
    if (primeiraVez.current) { primeiraVez.current = false; return; }
    area.current?.querySelector<HTMLElement>(aberto ? '[data-slot="botao-do-alerta"]' : "button")?.focus();
  }, [aberto]);
  return (
    <div ref={area} className="h-full">
      {aberto ? (
        <AlertaComAcao
          tom="info"
          titulo={t("New version of the project portal", "Nova versão do portal do projeto")}
          onFechar={() => setAberto(false)}
          rotuloFechar={t("Close", "Fechar")}
          className="h-full"
          acoes={<>
            <BotaoDoAlerta>{t("See what changed", "Ver o que mudou")}</BotaoDoAlerta>
            <LinkDoAlerta onClick={() => setAberto(false)}>{t("Not now", "Agora não")}</LinkDoAlerta>
          </>}
        >
          {t("Deliverables now show their stage in the list. You can change this in settings.", "As entregas agora mostram a etapa na lista. Você pode mudar isso nas configurações.")}
        </AlertaComAcao>
      ) : (
        <div className="flex h-full min-h-[120px] flex-col items-start justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-5">
          <p className="text-body-sm text-muted-foreground">{t("You closed the notice.", "Você fechou o aviso.")}</p>
          <LinkDoAlerta onClick={() => setAberto(true)}>{t("Show again", "Mostrar de novo")}</LinkDoAlerta>
        </div>
      )}
    </div>
  );
}

const CONTRASTES: { tom: TomDoAlerta; nome: [string, string]; token: string; valor: string; contraste: string }[] = [
  { tom: "info", nome: ["Info", "Info"], token: "--info-text", valor: "#366E97", contraste: "5.0:1|5,0:1" },
  { tom: "sucesso", nome: ["Success", "Sucesso"], token: "--success-text", valor: "#327650", contraste: "5.0:1|5,0:1" },
  { tom: "aviso", nome: ["Warning", "Aviso"], token: "--warning-text", valor: "#935E0A", contraste: "5.1:1|5,1:1" },
  { tom: "erro", nome: ["Error", "Erro"], token: "--error-text", valor: "#B82828", contraste: "5.6:1|5,6:1" },
];

const BORDA_DO_TOM: Record<TomDoAlerta, string> = {
  info: "border-info",
  sucesso: "border-success",
  aviso: "border-warning",
  erro: "border-error",
};

const exemploDeCodigo = `import { AlertaComAcao, BotaoDoAlerta, LinkDoAlerta } from "@/app/components/ui/alerta-com-acao";

<AlertaComAcao
  tom="aviso"
  titulo="Reunião sem confirmação"
  acoes={<>
    <BotaoDoAlerta onClick={confirmar}>Confirmar reunião</BotaoDoAlerta>
    <LinkDoAlerta onClick={adiar}>Lembrar depois</LinkDoAlerta>
  </>}
>
  A reunião de abertura ainda não foi confirmada.
</AlertaComAcao>`;

export function AlertaComAcaoDoc() {
  const { t, lang } = useI18n();
  const forte = "font-semibold text-foreground";
  return (
    <div className="space-y-10">
      <div>
        <h3 className="font-[family-name:var(--font-display)] text-h4 font-semibold tracking-[-0.01em] text-foreground">{t("Alert with action", "Alerta com ação")}</h3>
        <p className="mt-1 max-w-3xl text-body leading-relaxed text-muted-foreground">
          {t(
            "A notice that asks the reader to act: icon with base, title, description and, below the text, one outline primary action and, if needed, a secondary action styled as a link. Component",
            "Aviso que pede uma ação de quem lê: ícone com base, título, descrição e, embaixo do texto, uma ação principal de contorno e, se precisar, uma secundária em forma de link. Componente",
          )} <Mono>AlertaComAcao</Mono>, {t("with", "com")} <Mono>BotaoDoAlerta</Mono> {t("and", "e")} <Mono>LinkDoAlerta</Mono>, {t("in", "em")} <Mono>ui/alerta-com-acao.tsx</Mono>.
        </p>
      </div>

      <div>
        <Rotulo>{t("Example: notice in a client project", "Exemplo: aviso num projeto do cliente")}</Rotulo>
        <DemoAvisoDoProjeto />
      </div>

      <div>
        <Rotulo>{t("The 4 states (example texts)", "Os 4 estados (textos de exemplo)")}</Rotulo>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DemoInfoFechavel />
          <AlertaComAcao tom="sucesso" titulo={t("Deliverables reviewed today", "Entregas revisadas hoje")} acoes={<BotaoDoAlerta><ArrowRight aria-hidden />{t("View deliverables", "Ver entregas")}</BotaoDoAlerta>}>
            {t("The schedule stays as planned.", "O cronograma segue como combinado.")}
          </AlertaComAcao>
          <AlertaComAcao tom="aviso" titulo={t("Meeting not confirmed", "Reunião sem confirmação")} acoes={<><BotaoDoAlerta>{t("Confirm meeting", "Confirmar reunião")}</BotaoDoAlerta><LinkDoAlerta>{t("Remind me later", "Lembrar depois")}</LinkDoAlerta></>}>
            {t("The kickoff meeting hasn't been confirmed yet. Without it, the research stage can't start.", "A reunião de abertura ainda não foi confirmada. Sem ela, não dá para começar a etapa de pesquisa.")}
          </AlertaComAcao>
          <AlertaComAcao tom="erro" titulo={t("Your project is paused", "Seu projeto está pausado")} acoes={<><BotaoDoAlerta>{t("Confirm and resume", "Confirmar e retomar")}</BotaoDoAlerta><LinkDoAlerta>{t("View pending items", "Ver pendências")}</LinkDoAlerta></>}>
            {t("The team can't move to the next stage. Confirm the pending items to resume.", "A equipe não consegue avançar para a próxima etapa. Confirme as pendências para retomar.")}
          </AlertaComAcao>
        </div>
      </div>

      <div>
        <Rotulo>{t("Usage rules", "Regras de uso")}</Rotulo>
        <DoDont
          dos={[
            t("Put the actions below the text, never beside it.", "Coloque as ações embaixo do texto, nunca ao lado."),
            t("On phones (below 640 px) there is one left edge: the smaller icon base sits on the title line, centred with it, and the description, the button and the link all start at the card's padding, in line with the icon. Button and link sit side by side, centred with each other, and only wrap when they do not fit. From 640 px, the icon has its own column and everything else sits in the text column (the component does this).", "No celular (abaixo de 640 px) há uma borda esquerda só: a base do ícone, menor, fica na linha do título, centralizada com ele, e a descrição, o botão e o link começam todos no respiro do card, alinhados com o ícone. Botão e link ficam lado a lado, centralizados um com o outro, e só quebram de linha quando não cabem. A partir de 640 px, o ícone tem a coluna dele e o resto fica na coluna do texto (o componente já faz isso)."),
            t("Use a single primary action, outline only (BotaoDoAlerta), in the state colour. It has the design system button height (40 px), with the alert's 14 px text.", "Use uma só ação principal, de contorno (BotaoDoAlerta), na cor do estado. Ela tem a altura dos botões do design system (40 px), com o texto de 14 px do alerta."),
            t("If a second action is needed, use the link (LinkDoAlerta).", "Se precisar de uma segunda ação, use o link (LinkDoAlerta)."),
            t("Use <strong> only for what the reader must see: semibold, in the main text colour.", "Destaque com <strong> só o que a pessoa precisa ver: seminegrito, na cor do texto principal."),
            t("Use role=\"alert\" for warning and error and role=\"status\" for info and success (the component does this).", "Use role=\"alert\" em aviso e erro e role=\"status\" em info e sucesso (o componente já faz isso)."),
          ]}
          donts={[
            t("Vary text size inside the card: only the title is 15 px; description, note and buttons are 14 px.", "Variar o tamanho do texto dentro do card: só o título tem 15 px; descrição, nota e botões têm 14 px."),
            t("Fill the primary button or use more than one outline button.", "Preencher o botão principal ou usar mais de um botão de contorno."),
            t("Use the state colour for the button text: the text uses the state's text colour (table below).", "Usar a cor do estado no texto do botão: o texto usa a cor de texto do estado (tabela abaixo)."),
            t("Use the alert with action only to inform: without an action, use the plain Alert.", "Usar o alerta com ação só para informar: sem ação, use o Alerta simples."),
          ]}
        />
      </div>

      <div>
        <Rotulo>{t("Button text colours and contrast", "Cores de texto dos botões e contraste")}</Rotulo>
        <Panel className="divide-y divide-border">
          {CONTRASTES.map(c => (
            <div key={c.tom} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3">
              <span aria-hidden className={`h-6 w-6 shrink-0 rounded-sm border-[1.5px] ${BORDA_DO_TOM[c.tom]}`} style={{ backgroundColor: `var(${c.token})` }} />
              <span className="min-w-[7.5rem] text-body-sm font-semibold text-foreground">{t(c.nome[0], c.nome[1])}</span>
              <Mono>{c.token}</Mono>
              <span className="text-body-sm text-muted-foreground">{c.valor}</span>
              <span className="text-body-sm font-semibold text-foreground sm:ml-auto">{c.contraste.split("|")[lang === "pt" ? 1 : 0]} {t("on the alert background", "no fundo do alerta")}</span>
            </div>
          ))}
        </Panel>
        <p className="mt-3 max-w-3xl text-body-sm leading-relaxed text-muted-foreground">
          <Mono>--info-text</Mono>, <Mono>--success-text</Mono>, <Mono>--warning-text</Mono> {t("and", "e")} <Mono>--error-text</Mono> {t(
            "are new (23/11/2026): only for text and icons on light backgrounds. In the dark theme they point to",
            "são novos (23/11/2026): servem só para texto e ícone sobre fundo claro. No tema escuro, apontam para",
          )} <Mono>--info</Mono>, <Mono>--success</Mono>, <Mono>--warning</Mono> {t("and", "e")} <Mono>--error</Mono>. {t("The link uses", "O link usa")} <Mono>--foreground</Mono>, {t("with a 35% underline that turns solid on hover.", "com sublinhado a 35% que fica inteiro no hover.")}
        </p>
      </div>

      <div className="space-y-3">
        <Rotulo>{t("When to use", "Quando usar")}</Rotulo>
        <Callout title={t("All alerts follow this pattern", "Todos os alertas seguem este padrão")}>
          {t("The plain Alert", "O Alerta simples")} (<Mono>Alert</Mono>) {t(
            "has the same look: icon with base, 15 px title and everything else at 14 px. Use the",
            "tem a mesma aparência: ícone com base, título de 15 px e o resto em 14 px. Use o",
          )} <strong className={forte}>{t("plain Alert", "Alerta simples")}</strong> {t(
            "to report a state without asking for anything (changes saved, upload failed). Use the",
            "para informar um estado sem pedir nada (alterações salvas, falha ao enviar). Use o",
          )} <strong className={forte}>{t("Alert with action", "Alerta com ação")}</strong> {t(
            "when the reader needs to do something to solve or avoid the problem. For short-lived feedback on an action, use a toast.",
            "quando a pessoa precisa fazer algo para resolver ou evitar o problema. Para retorno passageiro de uma ação, use o toast.",
          )}
        </Callout>
      </div>

      <div>
        <Rotulo>{t("How to use", "Como usar")}</Rotulo>
        <pre className="whitespace-pre-wrap break-words rounded-lg border border-border bg-card p-4 text-label leading-relaxed text-muted-foreground"><code>{exemploDeCodigo}</code></pre>
      </div>
    </div>
  );
}
