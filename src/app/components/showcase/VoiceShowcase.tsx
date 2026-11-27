import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { useI18n } from "../../i18n";
import { PageHeader, PageSection } from "./GetStartedShowcase";
import { EscritaDeInteligencia, type ExemploDeEscrita, type CardDeDescoberta } from "./EscritaDeInteligencia";

/* Tom de voz e UX writing do Dani Moscatelli: princípios tirados das regras do produto
   (linguagem simples, tipos de informação, "não sei" como resposta válida, consultoria sem pressão)
   e a escrita de textos de inteligência. */

export function VoiceShowcase() {
  const { t } = useI18n();

  const principios = [
    {
      titulo: t("Simple language", "Linguagem simples"),
      regra: t("Start from the person's problem, in their words. No Service Design jargon.", "Começar pelo problema da pessoa, com as palavras dela. Sem jargão de Service Design."),
      fazer: t("What would you like to improve?", "O que você deseja melhorar?"),
      evitar: t("Define the scope of your service design challenge.", "Defina o escopo do seu desafio de Service Design."),
    },
    {
      titulo: t("Say exactly what is known", "Dizer exatamente o que se sabe"),
      regra: t("Every piece of information carries its origin: someone said it, someone saw it, it was measured or it is a hypothesis.", "Toda informação carrega a origem: alguém disse, alguém viu, foi medido ou é uma hipótese."),
      fazer: t("Three of the five people interviewed mentioned a long wait.", "Três das cinco pessoas entrevistadas falaram de espera longa."),
      evitar: t("The wait is long.", "A espera é longa."),
    },
    {
      titulo: t("\"I don't know\" is a valid answer", "\"Não sei\" é uma resposta válida"),
      regra: t("When something is unknown, explain how to find out and offer a safe way forward.", "Quando a pessoa não sabe, explicar como descobrir e oferecer um caminho seguro para seguir."),
      fazer: t("Not sure? See how to find out, or skip for now.", "Não sabe? Veja como descobrir ou pule por agora."),
      evitar: t("Required field.", "Campo obrigatório."),
    },
    {
      titulo: t("Transparent invitations", "Convite transparente"),
      regra: t("Specialist help is an option, never a condition. Say what it is and let the person choose.", "A ajuda especializada é uma opção, nunca uma condição. Dizer o que é e deixar a pessoa escolher."),
      fazer: t("Want help from a specialist? See how the consultancy works.", "Quer ajuda de uma especialista? Veja como funciona a consultoria."),
      evitar: t("Buy the consultancy now to solve your problem.", "Contrate agora a consultoria para resolver seu problema."),
    },
  ];

  const tipos = [
    { tipo: t("Statement", "Declaração"), quando: t("Someone said it (interview, form, message).", "Alguém disse (entrevista, formulário, mensagem)."), escrever: t("\"Customers say that…\", \"Two managers reported…\"", "\"Clientes dizem que…\", \"Duas gestoras relataram…\"") },
    { tipo: t("Observation", "Observação"), quando: t("Someone saw it happen.", "Alguém viu acontecer."), escrever: t("\"During the visit we saw…\"", "\"Na visita, vimos que…\"") },
    { tipo: t("Record", "Registro"), quando: t("It is in a system, a spreadsheet or a document.", "Está num sistema, planilha ou documento."), escrever: t("\"The service log shows…\"", "\"O registro de atendimentos mostra…\"") },
    { tipo: t("Measurement", "Medição"), quando: t("It was counted or measured, with period and base.", "Foi contado ou medido, com período e base."), escrever: t("\"In March, the average wait was 18 minutes.\"", "\"Em março, a espera média foi de 18 minutos.\"") },
    { tipo: t("Hypothesis", "Hipótese"), quando: t("A possible explanation that still needs testing.", "Uma explicação possível, que ainda precisa ser testada."), escrever: t("\"It may be that… Worth testing.\"", "\"Pode ser que… Vale testar.\"") },
    { tipo: t("Conclusion", "Conclusão"), quando: t("Only after evidence confirms the hypothesis.", "Só depois que as evidências confirmam a hipótese."), escrever: t("\"After the test, the wait dropped in the morning shift.\"", "\"Depois do teste, a espera caiu no turno da manhã.\"") },
  ];

  const exemplos: ExemploDeEscrita[] = [
    {
      regra: t("Statistical jargon in the title", "Jargão estatístico no título"),
      evitar: { titulo: t("Pearson correlation r = 0.62 between wait time and complaints", "Correlação de Pearson r = 0,62 entre tempo de espera e reclamações") },
      recomendado: { titulo: t("The longer the wait, the more complaints appear", "Quanto maior a espera, mais reclamações aparecem"), texto: t("This shows they happen together, not that one causes the other.", "Isso mostra que acontecem juntas, não que uma causa a outra."), detalhe: t("correlation 0.62 (Pearson) · 214 records · January to March", "correlação 0,62 (Pearson) · 214 registros · janeiro a março") },
    },
    {
      regra: t("Proportion presented as quantity", "Proporção apresentada como quantidade"),
      evitar: { titulo: t("The night shift has more problems", "O turno da noite tem mais problemas") },
      recomendado: { titulo: t("At night, a larger share of reports mention delays", "À noite, uma parte maior dos relatos fala de atraso"), texto: t("The night shift has fewer services in total.", "O turno da noite tem menos atendimentos no total."), detalhe: t("31% of night reports against 18% during the day", "31% dos relatos da noite contra 18% do dia") },
    },
    {
      regra: t("Invented cause", "Causa inventada"),
      evitar: { titulo: t("Lack of training causes the delays", "A falta de treinamento causa os atrasos") },
      recomendado: { titulo: t("Delays appear more in teams with less time in the company", "Os atrasos aparecem mais nas equipes com menos tempo de casa"), texto: t("Hypothesis: it may be related to training. Worth investigating.", "Hipótese: pode ter relação com o treinamento. Vale investigar.") },
    },
    {
      regra: t("Invented recommendation", "Recomendação inventada"),
      evitar: { titulo: t("Hire two more attendants to solve it", "Contrate mais dois atendentes para resolver") },
      recomendado: { titulo: t("One way to test: reorganize the peak hour for two weeks", "Uma forma de testar: reorganizar o horário de pico por duas semanas"), texto: t("Then compare the wait with the previous two weeks.", "Depois, comparar a espera com as duas semanas anteriores.") },
    },
    {
      regra: t("Repetitive titles", "Títulos repetitivos"),
      evitar: { titulo: t("Insight 1 · Insight 2 · Data analysis", "Insight 1 · Insight 2 · Análise de dados") },
      recomendado: { titulo: t("The wait grows after 6 pm · Complaints come by phone · Reception is the first contact", "A espera cresce depois das 18h · As reclamações chegam por telefone · A recepção é o primeiro contato") },
    },
    {
      regra: t("Generalizing from a few people", "Generalizar a partir de poucas pessoas"),
      evitar: { titulo: t("Customers are dissatisfied", "Os clientes estão insatisfeitos") },
      recomendado: { titulo: t("Three of the five people interviewed mentioned discomfort while waiting", "Três das cinco pessoas entrevistadas falaram de desconforto na espera"), texto: t("A small sample: useful to guide the next conversations.", "Uma amostra pequena: serve para orientar as próximas conversas.") },
    },
  ];

  const card: CardDeDescoberta = {
    tema: t("Wait", "Espera"),
    titulo: t("The wait grows after 6 pm", "A espera cresce depois das 18h"),
    contexto: t("In March, compared with the rest of the day.", "Em março, em comparação com o resto do dia."),
    leitura: t("It may be related to the shift change; worth observing on site.", "Pode ter relação com a troca de turno; vale observar no local."),
    passo: t("Plan a visit after 6 pm to observe the reception.", "Planeje uma visita depois das 18h para observar a recepção."),
    detalhes: [
      { rotulo: t("Average wait after 6 pm", "Espera média depois das 18h"), valor: t("24 minutes", "24 minutos") },
      { rotulo: t("Average wait before 6 pm", "Espera média antes das 18h"), valor: t("14 minutes", "14 minutos") },
      { rotulo: t("Source", "Origem"), valor: t("Service log (record)", "Registro de atendimentos (registro)") },
      { rotulo: t("Base", "Base"), valor: t("1,312 services in March", "1.312 atendimentos em março") },
    ],
  };

  return (
    <div className="space-y-14 min-w-0">
      <PageHeader
        eyebrow={t("Guidelines", "Diretrizes")}
        title={t("Voice and **UX writing**", "Tom de voz e **UX writing**")}
        description={t("Clear, human and precise texts. We say what we know, where the information comes from and what the person can do next.", "Textos claros, humanos e precisos. Dizemos o que sabemos, de onde vem a informação e o que a pessoa pode fazer em seguida.")}
      />

      <PageSection
        id="escrita-principios"
        label={t("Principles", "Princípios")}
        title={t("Four principles for every text", "Quatro princípios para qualquer texto")}
        intro={<p>{t("From a button to an AI summary, the same principles apply. When a text sounds technical or pushy, one of them was left out.", "De um botão a um resumo da IA, os mesmos princípios valem. Quando um texto soa técnico ou insistente, algum deles ficou de fora.")}</p>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {principios.map(p => (
            <article key={p.titulo} className="flex flex-col rounded-md border border-border bg-card p-5">
              <p className="mb-2 text-label font-semibold uppercase tracking-[0.1em] text-[var(--primary-text,var(--primary))]">{p.titulo}</p>
              <p className="mb-5 text-body leading-relaxed text-foreground">{p.regra}</p>
              <div className="mt-auto space-y-3">
                <p className="flex items-start gap-2 text-body font-bold tracking-[-0.01em] text-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />{p.fazer}</p>
                <p className="flex items-start gap-2 text-body-sm text-muted-foreground line-through decoration-error/50"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" aria-hidden />{p.evitar}</p>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="escrita-tipos"
        label={t("Types of information", "Tipos de informação")}
        title={t("Every piece of information has an origin", "Toda informação tem origem")}
        intro={<p>{t("Statement, observation, record, measurement, hypothesis and conclusion are not the same thing. The text must make the difference visible.", "Declaração, observação, registro, medição, hipótese e conclusão não são a mesma coisa. O texto precisa deixar a diferença visível.")}</p>}
      >
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="hidden grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] border-b border-border bg-muted/30 px-5 py-3 text-label font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
            <span>{t("Type", "Tipo")}</span><span>{t("When", "Quando")}</span><span>{t("How to write", "Como escrever")}</span>
          </div>
          {tipos.map((x, i) => (
            <div key={x.tipo} className={`grid grid-cols-1 gap-1 px-5 py-3.5 text-body-sm sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,1.4fr)] sm:gap-4 ${i < tipos.length - 1 ? "border-b border-border" : ""}`}>
              <span className="font-semibold text-foreground">{x.tipo}</span>
              <span className="text-muted-foreground">{x.quando}</span>
              <span className="text-foreground">{x.escrever}</span>
            </div>
          ))}
        </div>
      </PageSection>

      <EscritaDeInteligencia prefixo="escrita" exemplos={exemplos} card={card} />
    </div>
  );
}
