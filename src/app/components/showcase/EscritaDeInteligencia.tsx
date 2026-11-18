import React, { useState } from "react";
import { CheckCircle, XCircle, ChevronDown, Lightbulb, ListChecks, MessagesSquare } from "lucide-react";
import { useI18n } from "../../i18n";
import { PageSection } from "./GetStartedShowcase";

/* Escrita de textos de inteligência: como apresentar descobertas geradas a partir de dados (e pela IA)
   como uma conversa, e não como um relatório estatístico. A estrutura e as regras são as mesmas nos dois DS;
   os exemplos mudam conforme o produto. */

export type ExemploDeEscrita = {
  regra: string;
  evitar: { titulo: string; texto?: string };
  recomendado: { titulo: string; texto?: string; detalhe?: string };
};

export type CardDeDescoberta = {
  tema: string;
  titulo: string;
  contexto: string;
  leitura?: string;
  passo?: string;
  detalhes: { rotulo: string; valor: string }[];
};

type Props = {
  prefixo: string; // prefixo das âncoras (ex.: "voice" ou "escrita")
  exemplos: ExemploDeEscrita[];
  card: CardDeDescoberta;
};

function Descoberta({ card }: { card: CardDeDescoberta }) {
  const { t } = useI18n();
  const [aberto, setAberto] = useState(false);
  const idDetalhes = React.useId();
  return (
    <article className="rounded-[var(--radius)] border border-border bg-card p-5">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-[var(--primary-text,var(--primary))] mb-2">{card.tema}</p>
      <h3 className="text-[1.125rem] font-bold tracking-[-0.015em] text-foreground leading-snug">{card.titulo}</h3>
      <p className="mt-1.5 text-[0.9375rem] text-muted-foreground leading-relaxed">{card.contexto}</p>
      {card.leitura && (
        <p className="mt-3 flex items-start gap-2 text-[0.875rem] text-foreground">
          <span className="mt-0.5 inline-flex h-5 shrink-0 items-center rounded-full border border-border bg-muted px-2 text-[0.6875rem] font-semibold text-muted-foreground">{t("Hypothesis", "Hipótese")}</span>
          {card.leitura}
        </p>
      )}
      {card.passo && (
        <p className="mt-2 flex items-start gap-2 text-[0.875rem] text-foreground">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-text,var(--primary))]" aria-hidden />
          {card.passo}
        </p>
      )}
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls={idDetalhes}
        onClick={() => setAberto(v => !v)}
        className="mt-4 inline-flex items-center gap-1 rounded-[8px] text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {aberto ? t("Hide details", "Ocultar detalhes") : t("See details", "Ver detalhes")}
        <ChevronDown className={`h-4 w-4 transition-transform ${aberto ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <dl id={idDetalhes} hidden={!aberto} className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 rounded-[12px] bg-muted/50 p-4 sm:grid-cols-2">
        {card.detalhes.map(d => (
          <div key={d.rotulo}>
            <dt className="text-[0.75rem] text-muted-foreground">{d.rotulo}</dt>
            <dd className="text-[0.875rem] font-medium text-foreground">{d.valor}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function EscritaDeInteligencia({ prefixo, exemplos, card }: Props) {
  const { t } = useI18n();

  const regras: { titulo: string; texto: string }[] = [
    { titulo: t("Natural, refined and accessible language", "Linguagem natural, sofisticada e acessível"), texto: t("Write as a person who understands the market would say it out loud. Short sentences, everyday words, no slang.", "Escreva como uma pessoa que entende do mercado diria em voz alta. Frases curtas, palavras do dia a dia, sem gíria.") },
    { titulo: t("No statistical jargon in titles, cards and summaries", "Sem jargão estatístico em títulos, cards e resumos"), texto: t("Standard deviation, p-value, correlation, percentile and sample go to the details, never to the headline.", "Desvio-padrão, p-valor, correlação, percentil e amostra vão para o detalhamento, nunca para o título.") },
    { titulo: t("Proportion is not quantity", "Proporção não é quantidade"), texto: t("\"A larger share\" is not \"more\". If the data is a percentage, say share, part or proportion.", "\"Uma fatia maior\" não é \"mais\". Se o dado é um percentual, diga fatia, parte ou proporção.") },
    { titulo: t("Do not invent opportunities, demand or vocations", "Não inventar oportunidades, demandas ou vocações"), texto: t("Say what the data shows. A gap in results is not demand; a trend in a region is not its vocation.", "Diga o que o dado mostra. Poucos resultados não são demanda; uma tendência num lugar não é vocação dele.") },
    { titulo: t("Technical data stays available", "Dados técnicos continuam disponíveis"), texto: t("Every discovery has a details area with numbers, period, base and method, for whoever wants to check.", "Toda descoberta tem um detalhamento com números, período, base e método, para quem quiser conferir.") },
    { titulo: t("Hypothesis looks like hypothesis", "Hipótese tem cara de hipótese"), texto: t("When it is an interpretation, say \"may indicate\" and mark it. Never present a cause the data does not prove.", "Quando é interpretação, diga \"pode indicar\" e marque como hipótese. Nunca apresente uma causa que o dado não comprova.") },
    { titulo: t("Same structure for every theme", "A mesma estrutura para todos os temas"), texto: t("Including new themes the AI finds: discovery, context, possible reading, next step and details.", "Inclusive os temas novos que a IA identificar: descoberta, contexto, leitura possível, próximo passo e detalhamento.") },
    { titulo: t("No repeated titles or redundant descriptions", "Sem títulos repetidos nem descrições redundantes"), texto: t("The title states the finding; the description adds context instead of repeating the title.", "O título diz a descoberta; a descrição acrescenta contexto em vez de repetir o título.") },
    { titulo: t("Scannable first", "Escaneável primeiro"), texto: t("One idea per card. The title alone must be understood in two seconds.", "Uma ideia por card. Só o título já precisa ser entendido em dois segundos.") },
    { titulo: t("Words change, the interface does not", "Muda o texto, não a interface"), texto: t("Keep the tab architecture, the layout and the design system components. Writing guidance never justifies a new component.", "Preserve a arquitetura de abas, o layout e os componentes do design system. Orientação de escrita nunca justifica um componente novo.") },
    { titulo: t("Always say the period and the base", "Sempre dizer o período e a base"), texto: t("\"In the last 4 weeks\", \"compared with the city\". Without a reference, a number does not mean anything.", "\"Nas últimas 4 semanas\", \"em comparação com a cidade\". Sem referência, um número não diz nada.") },
    { titulo: t("No exaggeration", "Sem exagero"), texto: t("Avoid \"huge\", \"explosion\", \"must\". The tone is calm and precise, like good advice.", "Evite \"enorme\", \"explosão\", \"imperdível\", \"você precisa\". O tom é calmo e preciso, como um bom conselho.") },
  ];

  const estrutura = [
    { parte: t("Discovery (title)", "Descoberta (título)"), regra: t("What changed or stood out, in plain language. Up to about 60 characters, no numbers with decimals.", "O que mudou ou chamou atenção, em linguagem natural. Até uns 60 caracteres, sem números com casas decimais.") },
    { parte: t("Context", "Contexto"), regra: t("One sentence: compared with what, and in which period.", "Uma frase: comparado com o quê e em qual período.") },
    { parte: t("Possible reading (optional)", "Leitura possível (opcional)"), regra: t("What it may indicate, marked as a hypothesis.", "O que pode indicar, marcado como hipótese.") },
    { parte: t("Next step (optional)", "Próximo passo (opcional)"), regra: t("An action within the person's reach, without promising a result.", "Uma ação ao alcance da pessoa, sem prometer resultado.") },
    { parte: t("Details (collapsed)", "Detalhamento (recolhido)"), regra: t("Exact numbers, period, base, method and limitations.", "Números exatos, período, base, método e limitações.") },
  ];

  const checklist = [
    t("Does the title make sense on its own, without the numbers?", "O título faz sentido sozinho, sem os números?"),
    t("Is there any statistical term outside the details?", "Sobrou algum termo estatístico fora do detalhamento?"),
    t("Is a percentage being presented as quantity?", "Algum percentual está sendo apresentado como quantidade?"),
    t("Is there an opportunity, cause or vocation the data does not show?", "Existe oportunidade, causa ou vocação que o dado não mostra?"),
    t("Are the period and the comparison base clear?", "O período e a base de comparação estão claros?"),
    t("Does the description add something the title does not say?", "A descrição acrescenta algo que o título não diz?"),
    t("Is the hypothesis marked as hypothesis?", "A hipótese está marcada como hipótese?"),
  ];

  return (
    <>
      <PageSection
        id={`${prefixo}-inteligencia`}
        label={t("Intelligence and data", "Inteligência e dados")}
        title={t("A conversation, not a report", "Uma conversa, não um relatório")}
        intro={
          <>
            <p>{t("When the product shows what the data or the AI found, the experience should feel like talking to a market intelligence that reveals relevant discoveries, not like reading a statistical report.", "Quando o produto mostra o que os dados ou a IA encontraram, a experiência deve parecer uma conversa com uma inteligência de mercado que revela descobertas relevantes, e não a leitura de um relatório estatístico.")}</p>
            <p>{t("The rules below apply to titles, cards, summaries, notifications and AI texts, in any tab.", "As regras abaixo valem para títulos, cards, resumos, notificações e textos gerados pela IA, em qualquer aba.")}</p>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {regras.map(r => (
            <div key={r.titulo} className="rounded-[var(--radius)] border border-border bg-card p-4">
              <p className="flex items-start gap-2 text-[0.9375rem] font-semibold text-foreground"><MessagesSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-text,var(--primary))]" aria-hidden />{r.titulo}</p>
              <p className="mt-1 pl-6 text-[0.8125rem] leading-relaxed text-muted-foreground">{r.texto}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id={`${prefixo}-estrutura`}
        label={t("Structure", "Estrutura")}
        title={t("Every discovery in the same order", "Toda descoberta na mesma ordem")}
        intro={<p>{t("The same five parts for every theme, including new ones. Only the first two are mandatory; the details are always there, collapsed.", "As mesmas cinco partes para qualquer tema, inclusive os novos. Só as duas primeiras são obrigatórias; o detalhamento existe sempre, recolhido.")}</p>}
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ol className="space-y-2">
            {estrutura.map((e, i) => (
              <li key={e.parte} className="flex gap-3 rounded-[var(--radius)] border border-border bg-card p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] text-[0.75rem] font-bold text-[var(--primary-text,var(--primary))]">{i + 1}</span>
                <div>
                  <p className="text-[0.9375rem] font-semibold text-foreground">{e.parte}</p>
                  <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{e.regra}</p>
                </div>
              </li>
            ))}
          </ol>
          <div>
            <p className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Example (fictitious data)", "Exemplo (dados fictícios)")}</p>
            <Descoberta card={card} />
          </div>
        </div>
      </PageSection>

      <PageSection
        id={`${prefixo}-exemplos`}
        label={t("Examples", "Exemplos")}
        title={t("Avoid and prefer", "Evitar e preferir")}
        intro={<p>{t("Each pair shows the same finding written two ways. The data does not change, only the conversation.", "Cada par mostra a mesma descoberta escrita de dois jeitos. O dado não muda, só a conversa.")}</p>}
      >
        <div className="space-y-4">
          {exemplos.map(ex => (
            <div key={ex.regra} className="rounded-[var(--radius)] border border-border bg-card p-4 sm:p-5">
              <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{ex.regra}</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-[12px] border border-border bg-muted/40 p-4">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-semibold text-muted-foreground"><XCircle className="h-4 w-4 text-error" aria-hidden />{t("Avoid", "Evitar")}</p>
                  <p className="text-[0.9375rem] font-semibold text-foreground/70 line-through decoration-error/40">{ex.evitar.titulo}</p>
                  {ex.evitar.texto && <p className="mt-1 text-[0.8125rem] text-muted-foreground">{ex.evitar.texto}</p>}
                </div>
                <div className="rounded-[12px] border border-success/25 bg-[var(--success-muted)] p-4">
                  <p className="mb-1.5 flex items-center gap-1.5 text-[0.75rem] font-semibold text-foreground"><CheckCircle className="h-4 w-4 text-success" aria-hidden />{t("Prefer", "Preferir")}</p>
                  <p className="text-[0.9375rem] font-semibold text-foreground">{ex.recomendado.titulo}</p>
                  {ex.recomendado.texto && <p className="mt-1 text-[0.8125rem] text-foreground/80">{ex.recomendado.texto}</p>}
                  {ex.recomendado.detalhe && <p className="mt-2 border-t border-success/20 pt-2 text-[0.75rem] text-muted-foreground"><span className="font-semibold">{t("In the details:", "No detalhamento:")}</span> {ex.recomendado.detalhe}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id={`${prefixo}-revisao`}
        label={t("Review", "Revisão")}
        title={t("Before publishing a text", "Antes de publicar um texto")}
        intro={<p>{t("Seven questions to review any discovery, written by a person or by the AI.", "Sete perguntas para revisar qualquer descoberta, escrita por uma pessoa ou pela IA.")}</p>}
      >
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {checklist.map(c => (
            <li key={c} className="flex items-start gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-[0.875rem] text-foreground">
              <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-text,var(--primary))]" aria-hidden />{c}
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
