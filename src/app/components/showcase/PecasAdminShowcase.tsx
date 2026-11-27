import React, { useRef, useState } from "react";
import { CalendarPlus, ShieldCheck } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionBlock, ShowcaseCard, Panel } from "./shared/SectionBlock";
import { CaixaDeEntrada, type ItemDaCaixa } from "../ui/caixa-de-entrada";
import { Conversa, BalaoDaConversa, SeparadorDaConversa, IndicadorDeDigitacao } from "../ui/conversa";
import { AgendaDoMes } from "../ui/agenda-do-mes";
import { Stepper } from "../ui/stepper";
import { MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa, ListaDeRevisao, BlocoDeRevisao, LinhaDeDado } from "../ui/cadastro-em-etapas";
import { Campo, GradeDeCampos } from "../ui/campo";
import { CampoDeEmail } from "../ui/campo-de-email";
import { Quadro } from "../ui/quadro";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { BotaoDeEnvio, type EstadoDoEnvio } from "../ui/botao-de-envio";
import { EstadoFinal } from "../ui/estado-vazio";

/* Peças da área restrita (27/11/2026): caixa de entrada, conversa, agenda do mês, cadastro em etapas e quadro.
   Todos os nomes e mensagens são de exemplo. */

function DemoCaixa() {
  const { t } = useI18n();
  const [estado, setEstado] = useState<EstadoDoEnvio>("parado");
  const pessoa = (s: string) => <Avatar className="size-9"><AvatarFallback className="text-label font-semibold">{s}</AvatarFallback></Avatar>;
  const itens: ItemDaCaixa[] = [
    { id: "1", titulo: t("Example contact 1", "Contato de exemplo 1"), resumo: t("I'd like to understand the Pilot Project…", "Gostaria de entender o Projeto Piloto…"), quando: "09:42", lida: false, inicio: pessoa("C1"), etiqueta: <ChipDeEstado tom="marca">{t("New", "Nova")}</ChipDeEstado> },
    { id: "2", titulo: t("Example contact 2", "Contato de exemplo 2"), resumo: t("Thanks for the meeting yesterday.", "Obrigado pela reunião de ontem."), quando: t("Yesterday", "Ontem"), lida: true, inicio: pessoa("C2") },
    { id: "3", titulo: t("Example contact 3", "Contato de exemplo 3"), resumo: t("Can we move the call to Thursday?", "Podemos passar a conversa para quinta?"), quando: "24/11", lida: true, inicio: pessoa("C3") },
  ];
  return (
    <div className="h-[34rem]">
      <CaixaDeEntrada
        itens={itens}
        abertaInicial="1"
        topo={<h3 className="text-body font-semibold text-foreground">{t("Received", "Recebidos")}</h3>}
        renderLeitura={item => (
          <div className="grid gap-6">
            <div>
              <h3 className="text-h4 font-semibold text-foreground">{item.titulo}</h3>
              <p className="text-body-sm text-muted-foreground">{t("Example message", "Mensagem de exemplo")} · {item.quando}</p>
            </div>
            <Conversa>
              <BalaoDaConversa autor="outro" nome={item.titulo} quando={item.quando} naoLida={item.lida === false}>{item.resumo} {t("Could you tell me how it works?", "Pode me contar como funciona?")}</BalaoDaConversa>
              <BalaoDaConversa autor="eu" nome="Dani" quando="10:05" estado="aberto">{t("Of course! I'll send the details by e-mail.", "Claro! Envio os detalhes por e-mail.")}</BalaoDaConversa>
            </Conversa>
            <form onSubmit={e => { e.preventDefault(); setEstado("enviando"); window.setTimeout(() => setEstado("feito"), 1200); }} className="grid gap-3">
              <Campo rotulo={t("Reply", "Responder")}>{p => <Textarea {...p} rows={3} className="bg-card text-body" />}</Campo>
              <Panel><BotaoDeEnvio type="submit" estado={estado} onVoltar={() => setEstado("parado")}>{t("Send reply", "Enviar resposta")}</BotaoDeEnvio></Panel>
            </form>
          </div>
        )}
      />
    </div>
  );
}

function DemoConversa() {
  const { t } = useI18n();
  const av = (s: string) => <Avatar className="size-8"><AvatarFallback className="text-label">{s}</AvatarFallback></Avatar>;
  return (
    <ShowcaseCard>
      <Conversa>
        <SeparadorDaConversa>{t("Today", "Hoje")}</SeparadorDaConversa>
        <BalaoDaConversa autor="eu" avatar={av("DM")} quando="14:02" estado="lida">{t("Hello! We have a Health challenge that matches your profile. Interested?", "Olá! Temos um desafio em Saúde que combina com o seu perfil. Tem interesse?")}</BalaoDaConversa>
        <BalaoDaConversa autor="outro" avatar={av("PE")} nome={t("Example partner", "Parceira de exemplo")} quando="14:10">{t("Yes! Can we talk this week?", "Tenho! Podemos conversar esta semana?")}</BalaoDaConversa>
        <BalaoDaConversa autor="eu" avatar={av("DM")} quando="14:12" estado="clicado">{t("Thursday at 10 am works for me.", "Quinta às 10h fica bom para mim.")}</BalaoDaConversa>
        <IndicadorDeDigitacao avatar={av("PE")} />
      </Conversa>
    </ShowcaseCard>
  );
}

function hojeMais(n: number) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function DemoAgenda() {
  const { t } = useI18n();
  return (
    <AgendaDoMes
      eventos={[
        { id: "a", data: hojeMais(0), hora: "10:00", titulo: t("Call with example client", "Conversa com cliente de exemplo"), tom: "marca", descricao: t("Pilot Project · Google Meet", "Projeto Piloto · Google Meet") },
        { id: "b", data: hojeMais(0), hora: "15:30", titulo: t("Partner kickoff", "Kickoff com parceira"), tom: "sucesso" },
        { id: "c", data: hojeMais(0), hora: "17:00", titulo: t("Research review", "Revisão da pesquisa"), tom: "info" },
        { id: "d", data: hojeMais(2), hora: "09:00", titulo: t("Diagnosis workshop", "Oficina de diagnóstico"), tom: "aviso" },
        { id: "e", data: hojeMais(6), hora: "11:00", titulo: t("Example follow-up", "Retorno de exemplo"), tom: "neutro" },
      ]}
      acoesDoDia={<Button variant="outline" size="sm"><CalendarPlus aria-hidden />{t("Schedule", "Marcar")}</Button>}
    />
  );
}

function DemoCadastro() {
  const { t } = useI18n();
  const etapas = [{ titulo: t("You", "Você") }, { titulo: t("Expertise", "Atuação") }, { titulo: t("Review", "Revisão") }];
  const [atual, setAtual] = useState(0);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [area, setArea] = useState("");
  const [fim, setFim] = useState(false);
  const titulo = useRef<HTMLHeadingElement>(null);
  const ir = (i: number) => { setAtual(i); requestAnimationFrame(() => titulo.current?.focus()); };
  if (fim) {
    return (
      <ShowcaseCard>
        <EstadoFinal titulo={t("Sign-up sent", "Cadastro enviado")} descricao={t("This is a demonstration: nothing was saved.", "Esta é uma demonstração: nada foi gravado.")} acoes={<Button variant="outline" onClick={() => { setFim(false); setAtual(0); }}>{t("Start again", "Recomeçar")}</Button>} />
      </ShowcaseCard>
    );
  }
  return (
    <MolduraDoCadastro etapas={etapas} atual={atual} onIrPara={ir} rotulo={t("Partner sign-up steps", "Etapas do cadastro de parceiro")}>
      {atual === 0 && (
        <EtapaDoCadastro
          titulo={t("Tell us about you", "Conte quem é você")}
          tituloRef={titulo}
          obrigatorios={t("* Required fields", "* Campos obrigatórios")}
          onSubmit={e => { e.preventDefault(); ir(1); }}
          lateral={<LateralDaEtapa icone={<ShieldCheck />} titulo={t("Your data is safe", "Seus dados estão seguros")} paragrafos={[t("We only use these details to contact you about projects.", "Usamos esses dados só para falar com você sobre projetos.")]} />}
          barra={<BarraDaEtapa className="static" />}
        >
          <GradeDeCampos>
            <Campo rotulo={t("Full name", "Nome completo")} obrigatorio value={nome} onChange={e => setNome(e.target.value)} />
            <CampoDeEmail rotulo="E-mail" obrigatorio valor={email} onValorChange={setEmail} />
          </GradeDeCampos>
        </EtapaDoCadastro>
      )}
      {atual === 1 && (
        <EtapaDoCadastro titulo={t("Your expertise", "Sua atuação")} tituloRef={titulo} onSubmit={e => { e.preventDefault(); ir(2); }} barra={<BarraDaEtapa className="static" onVoltar={() => ir(0)} />}>
          <Campo rotulo={t("Main specialty", "Especialidade principal")} placeholder="UX Research" value={area} onChange={e => setArea(e.target.value)} />
        </EtapaDoCadastro>
      )}
      {atual === 2 && (
        <EtapaDoCadastro titulo={t("Check before sending", "Confira antes de enviar")} tituloRef={titulo} onSubmit={e => { e.preventDefault(); setFim(true); }} barra={<BarraDaEtapa className="static" onVoltar={() => ir(1)} rotuloContinuar={t("Send sign-up", "Enviar cadastro")} />}>
          <ListaDeRevisao valoresAbertos={["voce"]}>
            <BlocoDeRevisao valor="voce" titulo={`01 · ${t("You", "Você")}`} nomeEtapa={t("You", "Você")} resumo={[nome, email]} onEditar={() => ir(0)}>
              <LinhaDeDado rotulo={t("Full name", "Nome completo")} valor={nome} />
              <LinhaDeDado rotulo="E-mail" valor={email} />
            </BlocoDeRevisao>
            <BlocoDeRevisao valor="atuacao" titulo={`02 · ${t("Expertise", "Atuação")}`} nomeEtapa={t("Expertise", "Atuação")} resumo={[area]} onEditar={() => ir(1)}>
              <LinhaDeDado rotulo={t("Main specialty", "Especialidade principal")} valor={area} />
            </BlocoDeRevisao>
          </ListaDeRevisao>
        </EtapaDoCadastro>
      )}
    </MolduraDoCadastro>
  );
}

function DemoQuadro() {
  const { t } = useI18n();
  const av = (s: string) => <Avatar className="size-7"><AvatarFallback className="text-caption">{s}</AvatarFallback></Avatar>;
  return (
    <Quadro
      rotulo={t("Partners by stage (example)", "Parceiros por etapa (exemplo)")}
      colunas={[
        { id: "analise", titulo: t("In review", "Em análise"), tom: "aviso", cartoes: [{ id: "1", titulo: t("Example partner 1", "Parceira de exemplo 1"), descricao: "UX Research · Sênior", pessoa: av("P1") }] },
        { id: "convite", titulo: t("Invitation", "Convite"), tom: "info", cartoes: [{ id: "2", titulo: t("Example partner 2", "Parceiro de exemplo 2"), descricao: t("Data engineering", "Engenharia de dados"), etiqueta: <ChipDeEstado tom="info">{t("94% match", "94% compatível")}</ChipDeEstado> }] },
        { id: "colab", titulo: t("Collaborating", "Em colaboração"), tom: "sucesso", cartoes: [{ id: "3", titulo: t("Example partner 3", "Parceira de exemplo 3"), descricao: "Product Designer", etiqueta: <ChipDeEstado tom="sucesso">Kickoff</ChipDeEstado>, pessoa: av("P3") }] },
        { id: "fim", titulo: t("Finished", "Concluídos"), tom: "neutro", cartoes: [] },
      ]}
    />
  );
}

export function PecasAdminShowcase() {
  const { t } = useI18n();
  return (
    <div className="space-y-20">
      <SectionBlock
        id="admin-caixa"
        titulo={t("Inbox", "Caixa de entrada")}
        quando={t(
          "Messages in a list and the open message beside it. From 672 px of its own width both panes show; below that, one at a time, with Back. Resize the window to see it.",
          "Mensagens numa lista e a mensagem aberta ao lado. A partir de 672 px da própria largura, as duas partes aparecem; abaixo disso, uma por vez, com Voltar. Mude a largura da janela para ver.",
        )}
        arquivo="ui/caixa-de-entrada.tsx"
        nomes={["CaixaDeEntrada"]}
        api={`<CaixaDeEntrada itens={mensagens} topo={<Tabs…/>} renderLeitura={m => <Conversa>…</Conversa>} onAbrir={marcarComoLida} />`}
        faca={[t("Unread: bold title, dot and the word “unread” for screen readers.", "Não lida: título em negrito, ponto e a palavra “não lida” para leitores de tela.")]}
        naoFaca={[t("Don't squeeze list and message side by side on phones.", "Não espreme lista e mensagem lado a lado no celular.")]}
      >
        <DemoCaixa />
      </SectionBlock>

      <SectionBlock
        id="admin-conversa"
        titulo={t("Conversation", "Conversa")}
        quando={t(
          "Message history in bubbles: yours on the right in the support grey, the other person's on the left in the card. Sending state in icon and text; typing indicator stops with reduced motion.",
          "Histórico de mensagens em balões: as suas à direita no cinza de apoio, as da outra pessoa à esquerda no card. Estado do envio em ícone e texto; o indicador de digitação para com menos movimento.",
        )}
        arquivo="ui/conversa.tsx"
        nomes={["Conversa", "BalaoDaConversa", "SeparadorDaConversa", "IndicadorDeDigitacao"]}
        api={`<Conversa alinhamento="lados">   // "lados" (chat): enviadas à direita; "esquerda" (padrão): histórico de e-mails
  <SeparadorDaConversa>Hoje</SeparadorDaConversa>
  <BalaoDaConversa autor="outro" nome="Ana" quando="09:42">…</BalaoDaConversa>
  <BalaoDaConversa autor="eu" quando="10:05" estado="lida">…</BalaoDaConversa>
</Conversa>`}
      >
        <DemoConversa />
      </SectionBlock>

      <SectionBlock
        id="admin-agenda"
        titulo={t("Month agenda", "Agenda do mês")}
        quando={t(
          "The whole month with each day's appointments and the chosen day's list. The Calendar is for picking a date in a field; this is for seeing the month. Arrows move between days, PageUp/PageDown change the month.",
          "O mês inteiro com os compromissos de cada dia e a lista do dia escolhido. O Calendar serve para escolher uma data num campo; esta serve para ver o mês. As setas andam entre os dias e PageUp/PageDown trocam o mês.",
        )}
        arquivo="ui/agenda-do-mes.tsx"
        nomes={["AgendaDoMes"]}
        api={`// Como na especificação da área restrita (ADMIN_REACT.md §7.1):
<AgendaDoMes mes={mes} aoMudarMes={setMes} selecionado={dia} aoSelecionar={setDia}
  eventos={[{ data: new Date(2026, 10, 27), titulo: "Conversa", hora: "10:00" }, { data: ontem, passado: true }]}
  diasSemEventos="inativos" rotuloDoDia={(d, ev) => \`\${d.toLocaleDateString("pt-BR")}: \${ev.length} reuniões\`} />`}
      >
        <DemoAgenda />
      </SectionBlock>

      <SectionBlock
        id="admin-etapas"
        titulo={t("Steps and step-by-step sign-up", "Etapas e cadastro em etapas")}
        quando={t(
          "Brought from the FindLook DS with the same names: Stepper shows the steps (full names when they fit, “Step X of N” when they don't); MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa and the review (ListaDeRevisao, BlocoDeRevisao, LinhaDeDado) build long forms such as the partner sign-up.",
          "Trazidos do DS da FindLook com os mesmos nomes: o Stepper mostra as etapas (nomes inteiros quando cabem, “Etapa X de N” quando não); MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa e a revisão (ListaDeRevisao, BlocoDeRevisao, LinhaDeDado) montam formulários longos como o cadastro de parceiro.",
        )}
        arquivo="ui/stepper.tsx · ui/cadastro-em-etapas.tsx"
        nomes={["Stepper", "MolduraDoCadastro", "EtapaDoCadastro", "BarraDaEtapa", "LateralDaEtapa", "ListaDeRevisao", "BlocoDeRevisao", "LinhaDeDado", "CampoDoCadastro"]}
        api={`<MolduraDoCadastro etapas={[{ titulo: "Você" }, { titulo: "Atuação" }, { titulo: "Revisão" }]} atual={atual} onIrPara={ir}>
  <EtapaDoCadastro titulo="Conte quem é você" tituloRef={ref} barra={<BarraDaEtapa onVoltar={voltar} />}>…</EtapaDoCadastro>
</MolduraDoCadastro>`}
        faca={[t("Move the focus to the step title on each change.", "Leve o foco ao título da etapa a cada troca.")]}
        naoFaca={[t("Don't let people open future steps before finishing the current one.", "Não deixe abrir etapas futuras antes de terminar a atual.")]}
      >
        <ShowcaseCard rotulo="Stepper">
          <Stepper etapas={[{ titulo: t("Contact", "Contato") }, { titulo: t("Business", "Negócio") }, { titulo: t("Challenge", "Desafio") }, { titulo: t("Review", "Revisão") }]} atual={1} />
        </ShowcaseCard>
        <DemoCadastro />
      </SectionBlock>

      <SectionBlock
        id="admin-quadro"
        titulo={t("Board", "Quadro")}
        quando={t(
          "Items by stage, kanban style. Columns side by side when they fit and one under the other on phones; never sideways scrolling.",
          "Itens por etapa, no estilo kanban. Colunas lado a lado quando cabem e uma embaixo da outra no celular; nunca rolagem para o lado.",
        )}
        arquivo="ui/quadro.tsx"
        nomes={["Quadro"]}
        api={`<Quadro rotulo="Parceiros por etapa" colunas={[{ id: "analise", titulo: "Em análise", tom: "aviso", cartoes: […] }]} />`}
      >
        <DemoQuadro />
      </SectionBlock>
    </div>
  );
}
