import React from "react";
import { Check, Copy, Download, History, Mail, Pencil, Trash2, X, Eye, Archive } from "lucide-react";
import { useI18n } from "../../../i18n";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { AcoesDoCard } from "../../ui/acoes-do-card";
import { BotaoDeAcoes, type OpcaoDeAcao } from "../../ui/botao-de-acoes";
import { CardDePublicacao } from "../../ui/card-de-publicacao";
import { GradeDeCards, ItemDaGrade } from "../../ui/grade-de-cards";
import { cn } from "../../ui/utils";
import { SectionHeader } from "./SectionHeader";
import { Callout, DataTable, DoDont, Mono, display } from "./Guidance";

/** Bloco de código das seções (o mesmo desenho do CodeBlock das páginas novas). */
function CodeBlockSimples({ children }: { children: string }) {
  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-4 font-[family-name:var(--font-mono)] text-label leading-relaxed text-foreground">
      {children}
    </pre>
  );
}

/*
 * Documentação da regra da ação nos cards, do Card de publicação e do Botão de ações (decisão da dona do produto,
 * 28/11/2026). O mesmo arquivo nos dois design systems; marca escolhe os exemplos (estúdio ou FindLook). Os exemplos
 * são fictícios: nenhum nome de loja, preço ou dado real.
 */
export type Marca = "dm" | "fl";

/** Rótulo curto acima de cada exemplo. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>;
}

/** Selo Certo / Errado dos exemplos. */
function SeloCerto({ certo }: { certo: boolean }) {
  const { t } = useI18n();
  return (
    <Badge variant="outline" className={cn("mb-3 gap-1 px-2 py-1", certo ? "text-[var(--success-text,var(--success))]" : "text-[var(--error-text,var(--destructive))]")}>
      {certo ? <Check aria-hidden /> : <X aria-hidden />}
      {certo ? t("Do", "Faça") : t("Don't", "Não faça")}
    </Badge>
  );
}

/** Card de exemplo da regra: título, texto e a linha da ação. */
function CardExemplo({ titulo, texto, children }: { titulo: string; texto: string; children: React.ReactNode }) {
  return (
    <Card className="h-full gap-0 border-border">
      <CardHeader className="gap-1 pb-4">
        <CardTitle className={`${display} text-body font-semibold`}>{titulo}</CardTitle>
        <CardDescription className="text-body-sm leading-relaxed">{texto}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">{children}</CardContent>
    </Card>
  );
}

/** Moldura "como fica no celular": as mesmas regras do celular, numa caixa de 360 px. */
function NoCelular({ children, rotulo }: { children: React.ReactNode; rotulo: string }) {
  return (
    <div data-tela="celular" className="w-full max-w-[22.5rem]">
      <Rotulo>{rotulo}</Rotulo>
      {children}
    </div>
  );
}

type Textos = {
  uma: { titulo: string; texto: string; info: string; acao: string };
  padrao: { titulo: string; texto: string; principal: string; secundaria: string };
  importante: { titulo: string; texto: string; principal: string; secundaria: string };
  mais: { titulo: string; texto: string; principal: string; opcoes: OpcaoDeAcao[] };
  semPrincipal: { titulo: string; texto: string; opcoes: OpcaoDeAcao[] };
};

function useTextos(marca: Marca): Textos {
  const { t } = useI18n();
  const nada = () => {};
  if (marca === "fl") {
    return {
      uma: { titulo: "Peças publicadas", texto: "As peças que aparecem na busca da sua região.", info: "Atualizado hoje", acao: "Ver peças" },
      padrao: { titulo: "Sua loja no mapa", texto: "Cadastre a loja para que suas peças apareçam para quem procura por perto.", principal: "Cadastrar minha loja", secundaria: "Saiba mais" },
      importante: { titulo: "Rascunho da peça (exemplo)", texto: "Vestido midi estampado: faltam só as fotos. Você pode publicar agora ou salvar para terminar depois.", principal: "Publicar peça", secundaria: "Salvar rascunho" },
      mais: {
        titulo: "Jaqueta jeans (exemplo)", texto: "Peça publicada. A ação mais usada fica à vista; as outras, no botão Ações.", principal: "Editar peça",
        opcoes: [
          { rotulo: "Ver como o cliente vê", icone: <Eye />, onSelect: nada },
          { rotulo: "Duplicar", icone: <Copy />, onSelect: nada },
          { rotulo: "Arquivar", icone: <Archive />, onSelect: nada },
          { rotulo: "Excluir peça", icone: <Trash2 />, onSelect: nada, destrutiva: true },
        ],
      },
      semPrincipal: {
        titulo: "Coleção de inverno (exemplo)", texto: "Nenhuma ação é mais importante que as outras: todas ficam no botão Ações.",
        opcoes: [
          { rotulo: "Renomear", icone: <Pencil />, onSelect: nada },
          { rotulo: "Duplicar", icone: <Copy />, onSelect: nada },
          { rotulo: "Excluir coleção", icone: <Trash2 />, onSelect: nada, destrutiva: true },
        ],
      },
    };
  }
  return {
    uma: { titulo: t("Interview report", "Relatório das entrevistas"), texto: t("What people said and what was observed, separated.", "O que as pessoas disseram e o que foi observado, separados."), info: t("Updated today", "Atualizado hoje"), acao: t("Open report", "Abrir relatório") },
    padrao: { titulo: t("Pilot Project Programme", "Programa Projeto Piloto"), texto: t("A new perspective on your business experience challenges.", "Uma nova perspectiva sobre os desafios de experiência do seu negócio."), principal: t("I want to take part", "Quero participar"), secundaria: t("Learn more", "Saiba mais") },
    importante: { titulo: t("Proposal sent (example)", "Proposta enviada (exemplo)"), texto: t("Both answers matter here: approve, or ask for changes before approving.", "As duas respostas importam aqui: aprovar, ou pedir ajustes antes de aprovar."), principal: t("Approve proposal", "Aprovar proposta"), secundaria: t("Ask for changes", "Pedir ajustes") },
    mais: {
      titulo: t("Alignment meeting (example)", "Reunião de alinhamento (exemplo)"), texto: t("The most used action stays in sight; the others go in the Actions button.", "A ação mais usada fica à vista; as outras, no botão Ações."), principal: t("Join the meeting", "Entrar na reunião"),
      opcoes: [
        { rotulo: t("Edit meeting", "Editar reunião"), icone: <Pencil />, onSelect: nada },
        { rotulo: t("See history", "Ver histórico"), icone: <History />, onSelect: nada },
        { rotulo: t("Send e-mail", "Enviar e-mail"), icone: <Mail />, onSelect: nada },
        { rotulo: t("Cancel meeting", "Cancelar reunião"), icone: <Trash2 />, onSelect: nada, destrutiva: true },
      ],
    },
    semPrincipal: {
      titulo: t("Journey map (example)", "Mapa da jornada (exemplo)"), texto: t("No action matters more than the others: all of them go in the Actions button.", "Nenhuma ação é mais importante que as outras: todas ficam no botão Ações."),
      opcoes: [
        { rotulo: t("Rename", "Renomear"), icone: <Pencil />, onSelect: nada },
        { rotulo: t("Download PDF", "Baixar PDF"), icone: <Download />, onSelect: nada },
        { rotulo: t("Duplicate", "Duplicar"), icone: <Copy />, onSelect: nada },
        { rotulo: t("Delete map", "Excluir mapa"), icone: <Trash2 />, onSelect: nada, destrutiva: true },
      ],
    },
  };
}

/** Seção "A ação no card" da página Cards. */
export function SecaoAcaoNoCard({ marca }: { marca: Marca }) {
  const { t } = useI18n();
  const x = useTextos(marca);
  const corPrincipal = marca === "fl" ? t("pink", "rosa") : t("red", "vermelha");
  return (
    <section id="card-acao" className="scroll-mt-32">
      <SectionHeader
        title={t("The action in the card", "A ação no card")}
        description={t(
          "Rule of the product owner (28/11/2026), for every kind of card: the action sits on the right, or takes the whole width of the card. On phones, two buttons take the whole width, one below the other; on tablets and computers, side by side when there is room.",
          "Regra da dona do produto (28/11/2026), para todo tipo de card: a ação fica no lado direito, ou ocupa a largura toda do card. No celular, dois botões ocupam a largura toda, um embaixo do outro; no tablet e no computador, lado a lado, quando há espaço.",
        )}
      />
      <div className="space-y-8">
        <Callout title={t("The rule, step by step", "A regra, passo a passo")}>
          <ol className="mt-1 list-decimal space-y-1 pl-5">
            <li>{t("The action goes at the bottom of the card, after a divider, on the RIGHT side of the line. Supporting information (reading time, date, price) goes on the left of the same line.", "A ação fica embaixo, depois de um divisor, no lado DIREITO da linha. A informação de apoio (tempo de leitura, data, preço) fica à esquerda, na mesma linha.")}</li>
            <li>{t("On phones (screens under 640 px), buttons take the whole width of the card. With two buttons, one goes below the other, the main one on top.", "No celular (tela com menos de 640 px), os botões ocupam a largura toda do card. Com dois botões, um fica embaixo do outro, o principal em cima.")}</li>
            <li>{t("On tablets and computers, when there is room, the two buttons sit side by side, on the right, with the main one at the far end.", "No tablet e no computador, se houver espaço, os dois botões ficam lado a lado, à direita, com o principal na ponta.")}</li>
            <li>{t(`Which button: the main action is the filled pill (${corPrincipal}); the secondary is the link button. When both actions really matter, the secondary becomes the outline button.`, `Qual botão: a ação principal é a pílula preenchida (${corPrincipal}); a secundária é o botão link. Quando as duas ações importam de verdade, a secundária vira o botão de contorno.`)}</li>
            <li>{t("More than two actions: the main one stays in sight and the others go in the Actions button. If no action is the main one, only the Actions button.", "Mais de duas ações: a principal fica à vista e as outras vão para o botão Ações. Se nenhuma for a principal, só o botão Ações.")}</li>
            <li>{t("A text link (\"Read article →\") also stays on the right and never takes the whole width.", "Um link de texto (\"Ler artigo →\") também fica à direita e nunca ocupa a largura toda.")}</li>
          </ol>
        </Callout>

        <h3 className={`${display} text-body font-semibold text-foreground`}>{t("Live examples", "Exemplos ao vivo")}</h3>
        <GradeDeCards colunas={{ base: 1, md: 2 }} className="gap-5">
          <ItemDaGrade>
            <Rotulo>{t("One action, with information on the left", "Uma ação, com informação à esquerda")}</Rotulo>
            <CardExemplo titulo={x.uma.titulo} texto={x.uma.texto}>
              <AcoesDoCard info={x.uma.info}><Button size="sm">{x.uma.acao}</Button></AcoesDoCard>
            </CardExemplo>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("Default pair: pill + link button", "Par padrão: pílula + botão link")}</Rotulo>
            <CardExemplo titulo={x.padrao.titulo} texto={x.padrao.texto}>
              <AcoesDoCard>
                <Button variant="link" size="sm">{x.padrao.secundaria}</Button>
                <Button size="sm">{x.padrao.principal}</Button>
              </AcoesDoCard>
            </CardExemplo>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("Both actions matter: pill + outline", "As duas importam: pílula + contorno")}</Rotulo>
            <CardExemplo titulo={x.importante.titulo} texto={x.importante.texto}>
              <AcoesDoCard>
                <Button variant="outline" size="sm">{x.importante.secundaria}</Button>
                <Button size="sm">{x.importante.principal}</Button>
              </AcoesDoCard>
            </CardExemplo>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("More than two actions: main + Actions", "Mais de duas ações: principal + Ações")}</Rotulo>
            <CardExemplo titulo={x.mais.titulo} texto={x.mais.texto}>
              <AcoesDoCard>
                <BotaoDeAcoes opcoes={x.mais.opcoes} />
                <Button size="sm">{x.mais.principal}</Button>
              </AcoesDoCard>
            </CardExemplo>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("No main action: only Actions", "Sem ação principal: só Ações")}</Rotulo>
            <CardExemplo titulo={x.semPrincipal.titulo} texto={x.semPrincipal.texto}>
              <AcoesDoCard><BotaoDeAcoes opcoes={x.semPrincipal.opcoes} /></AcoesDoCard>
            </CardExemplo>
          </ItemDaGrade>
          <ItemDaGrade>
            <Rotulo>{t("With the Card's own footer", "Com o rodapé do próprio Card")}</Rotulo>
            <Card className="h-full gap-0 border-border">
              <CardHeader className="gap-1 pb-4">
                <CardTitle className={`${display} text-body font-semibold`}>{x.padrao.titulo}</CardTitle>
                <CardDescription className="text-body-sm leading-relaxed">{t("CardFooter follows the same rule: actions on the right, full width on phones.", "O CardFooter segue a mesma regra: ações à direita, largura toda no celular.")}</CardDescription>
              </CardHeader>
              <CardFooter className="border-t pt-4">
                <Button variant="link" size="sm">{x.padrao.secundaria}</Button>
                <Button size="sm">{x.padrao.principal}</Button>
              </CardFooter>
            </Card>
          </ItemDaGrade>
        </GradeDeCards>

        <div>
          <h3 className={`${display} mb-1 text-body font-semibold text-foreground`}>{t("How it looks on a phone", "Como fica no celular")}</h3>
          <p className="mb-4 max-w-3xl text-body-sm leading-relaxed text-muted-foreground">{t("The same cards as above, at phone width: the buttons take the whole width and the main one goes on top. With the Actions button, the main action and the three dots share the line.", "Os mesmos cards de cima, na largura do celular: os botões ocupam a largura toda e o principal fica em cima. Com o botão Ações, a ação principal e os três pontinhos dividem a linha.")}</p>
          <div className="flex flex-wrap gap-5">
            <NoCelular rotulo={t("Default pair", "Par padrão")}>
              <CardExemplo titulo={x.padrao.titulo} texto={x.padrao.texto}>
                <AcoesDoCard>
                  <Button variant="link" size="sm">{x.padrao.secundaria}</Button>
                  <Button size="sm">{x.padrao.principal}</Button>
                </AcoesDoCard>
              </CardExemplo>
            </NoCelular>
            <NoCelular rotulo={t("Both matter", "As duas importam")}>
              <CardExemplo titulo={x.importante.titulo} texto={x.importante.texto}>
                <AcoesDoCard>
                  <Button variant="outline" size="sm">{x.importante.secundaria}</Button>
                  <Button size="sm">{x.importante.principal}</Button>
                </AcoesDoCard>
              </CardExemplo>
            </NoCelular>
            <NoCelular rotulo={t("Main + Actions", "Principal + Ações")}>
              <CardExemplo titulo={x.mais.titulo} texto={x.mais.texto}>
                <AcoesDoCard>
                  <BotaoDeAcoes soIcone opcoes={x.mais.opcoes} />
                  <Button size="sm">{x.mais.principal}</Button>
                </AcoesDoCard>
              </CardExemplo>
            </NoCelular>
          </div>
        </div>

        <div>
          <h3 className={`${display} mb-4 text-body font-semibold text-foreground`}>{t("Do and don't", "Faça e não faça")}</h3>
          <div className="grid gap-x-6 gap-y-8 lg:grid-cols-2">
            <div className="min-w-0">
              <SeloCerto certo />
              <CardExemplo titulo={x.padrao.titulo} texto={t("Action on the right, after the divider; the main one at the far end.", "Ação à direita, depois do divisor; a principal na ponta.")}>
                <AcoesDoCard>
                  <Button variant="link" size="sm">{x.padrao.secundaria}</Button>
                  <Button size="sm">{x.padrao.principal}</Button>
                </AcoesDoCard>
              </CardExemplo>
            </div>
            <div className="min-w-0" data-cards-ignorar data-acao-ignorar>
              <SeloCerto certo={false} />
              <CardExemplo titulo={x.padrao.titulo} texto={t("Buttons on the left, away from where the eye ends the card.", "Botões à esquerda, longe de onde o olhar termina o card.")}>
                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <Button size="sm">{x.padrao.principal}</Button>
                  <Button variant="link" size="sm">{x.padrao.secundaria}</Button>
                </div>
              </CardExemplo>
            </div>
            <div className="min-w-0">
              <SeloCerto certo />
              <CardExemplo titulo={x.mais.titulo} texto={t("Three or more actions: the main one and the Actions menu.", "Três ações ou mais: a principal e o menu Ações.")}>
                <AcoesDoCard>
                  <BotaoDeAcoes opcoes={x.mais.opcoes} />
                  <Button size="sm">{x.mais.principal}</Button>
                </AcoesDoCard>
              </CardExemplo>
            </div>
            <div className="min-w-0" data-cards-ignorar data-acao-ignorar>
              <SeloCerto certo={false} />
              <CardExemplo titulo={x.mais.titulo} texto={t("A row of buttons with the same weight: nobody knows which one to press.", "Uma fileira de botões com o mesmo peso: ninguém sabe qual apertar.")}>
                <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
                  {x.mais.opcoes.slice(0, 2).map(o => <Button key={o.rotulo} variant="outline" size="sm">{o.rotulo}</Button>)}
                  <Button size="sm">{x.mais.principal}</Button>
                </div>
              </CardExemplo>
            </div>
          </div>
          <div className="mt-6">
            <DoDont
              dos={[
                t("Put the action on the right of the last line of the card, after the divider.", "Coloque a ação à direita da última linha do card, depois do divisor."),
                t("Write the secondary before the main one: the main one ends up at the far right (and on top, on phones).", "Escreva a secundária antes da principal: a principal fica na ponta direita (e em cima, no celular)."),
                t("Use the link button for a minor second action and the outline button when both really matter.", "Use o botão link para uma segunda ação menor e o botão de contorno quando as duas importam de verdade."),
                t("With three or more actions, keep the main one and move the rest to the Actions button.", "Com três ações ou mais, mantenha a principal e leve o resto para o botão Ações."),
              ]}
              donts={[
                t("Buttons on the left, or centred under the text.", "Botões à esquerda, ou centralizados embaixo do texto."),
                t("Two buttons squeezed side by side on a phone.", "Dois botões espremidos lado a lado no celular."),
                t("Two filled buttons in the same card.", "Dois botões preenchidos no mesmo card."),
                t("A loose link alone below the button.", "Um link solto, sozinho, embaixo do botão."),
              ]}
            />
          </div>
        </div>

        <DataTable
          head={[t("Situation", "Situação"), t("Phone (under 640 px)", "Celular (menos de 640 px)"), t("Tablet and computer", "Tablet e computador")]}
          rows={[
            [t("One button", "Um botão"), t("Whole width", "Largura toda"), t("On the right", "À direita")],
            [t("Two buttons", "Dois botões"), t("Whole width, one below the other, the main one on top", "Largura toda, um embaixo do outro, o principal em cima"), t("Side by side, on the right; the main one at the far end", "Lado a lado, à direita; o principal na ponta")],
            [t("Three or more", "Três ou mais"), t("Main action + three dots, on the same line", "Ação principal + três pontinhos, na mesma linha"), t("Main action + \"Actions ⌄\", on the right", "Ação principal + \"Ações ⌄\", à direita")],
            [t("Text link", "Link de texto"), t("On the right", "À direita"), t("On the right", "À direita")],
            [t("Information (time, date, price)", "Informação (tempo, data, preço)"), t("Its own line, on top, on the left", "Numa linha só dela, em cima, à esquerda"), t("On the left of the action line", "À esquerda da linha da ação")],
          ]}
        />
        <Callout title={t("Outside this rule", "Fora desta regra")}>
          <p>{t(
            "A form inside a card keeps the form rule (buttons aligned with the fields), and centred content (empty state, error page, final confirmation) keeps the action centred under the text. Alerts follow the Alert with action rule.",
            "Um formulário dentro de um card segue a regra dos formulários (botões alinhados aos campos), e conteúdo centralizado (estado vazio, página de erro, confirmação final) mantém a ação centralizada embaixo do texto. Alertas seguem a regra do Alerta com ação.",
          )}</p>
        </Callout>
        <CodeBlockSimples>{`import { AcoesDoCard } from "@/app/components/ui/acoes-do-card";
import { BotaoDeAcoes } from "@/app/components/ui/botao-de-acoes";

<AcoesDoCard info="Atualizado hoje">                 {/* divisor em cima; info à esquerda */}
  <Button variant="link">Saiba mais</Button>         {/* secundária primeiro */}
  <Button>Quero participar</Button>                   {/* principal: na ponta direita */}
</AcoesDoCard>

<AcoesDoCard>                                        {/* mais de 2 ações */}
  <BotaoDeAcoes opcoes={[{ rotulo: "Editar", icone: <Pencil />, onSelect }, { rotulo: "Excluir", destrutiva: true, onSelect }]} />
  <Button>Entrar na reunião</Button>
</AcoesDoCard>

// HTML puro (páginas sem React): as mesmas classes do theme.css (bloco "@ds-css-puro:cards-acao")
<div class="ds-acoes-do-card"><span class="ds-acoes-do-card__info">…</span><a class="ds-acoes-do-card__botao …">…</a></div>`}</CodeBlockSimples>
        <p className="text-body-sm text-muted-foreground">
          <Mono>AcoesDoCard</Mono> · <Mono>CardFooter</Mono> · <Mono>BotaoDeAcoes</Mono> · <Mono>.ds-acoes-do-card</Mono>
        </p>
      </div>
    </section>
  );
}

/** Exemplos do Card de publicação. */
function usePublicacoes(marca: Marca, foto: string, alt: string) {
  const { t } = useI18n();
  if (marca === "fl") {
    return {
      destaque: { selo: "Mais recente", categoria: "Novidades da plataforma", data: "28/11/2026", titulo: "Título de exemplo: uma novidade da plataforma", resumo: "Resumo de exemplo: uma ou duas frases que contam o que mudou e por que vale a pena ler a publicação inteira.", info: "3 min de leitura", imagem: foto, alt },
      horizontal: [
        { categoria: "Moda", data: "20/11/2026", titulo: "Título de exemplo: tendências da estação", resumo: "Resumo curto de exemplo, com no máximo duas linhas no card horizontal.", info: "5 min de leitura", imagem: foto, alt },
        { categoria: "Promoções", data: "18/11/2026", titulo: "Título de exemplo: uma promoção das lojas participantes", resumo: "Resumo curto de exemplo. Promoções reais trazem a regra e o prazo na própria publicação.", info: "Até 30/11 (exemplo)", imagem: foto, alt },
      ],
      semFoto: [
        { categoria: "Novidades da plataforma", data: "10/11/2026", titulo: "Título de exemplo sem foto", resumo: "Sem foto, o card mostra só o texto: categoria, data, título, resumo e a linha da ação.", info: "2 min de leitura" },
        { categoria: "Promoções", data: "08/11/2026", titulo: "Título de exemplo de aviso curto", resumo: "Bom para avisos rápidos, quando não há uma foto que ajude a contar a história.", info: "Até 10/12 (exemplo)" },
      ],
      vertical: [
        { categoria: "Novidades da plataforma", data: "10/11/2026", titulo: "Título de exemplo: o que mudou no painel", resumo: "O formato vertical, com a foto em cima, para grades de 2 ou 3 colunas.", info: "2 min de leitura", imagem: foto, alt },
        { categoria: "Moda", data: "05/11/2026", titulo: "Título de exemplo com foto em cima", resumo: "O formato vertical, com a foto em cima, para grades de 3 colunas.", info: "4 min de leitura", imagem: foto, alt },
        { categoria: "Promoções", data: "01/11/2026", titulo: "Título de exemplo de promoção", resumo: "Resumo curto de exemplo.", info: "Até 15/12 (exemplo)", imagem: foto, alt },
      ],
      ler: "Ler publicação",
    };
  }
  return {
    destaque: { selo: t("Most recent", "Mais recente"), categoria: "Business design", data: "01/09/2026", titulo: t("The problem is not the sales pitch. It is the architecture of the service.", "O problema não é o discurso comercial. É a arquitetura do serviço."), resumo: t("When the client buys transformation, there is no ready product to prove its value before the contract. The challenge, then, is not to sell better, but to design an experience that makes value and trust visible along the journey.", "Quando o cliente compra transformação, não existe um produto pronto para provar seu valor antes da contratação. O desafio, então, não é vender melhor, é desenhar uma experiência que torne o valor e a confiança visíveis ao longo da jornada."), info: t("10–12 min read", "10–12 min de leitura"), imagem: foto, alt },
    horizontal: [
      { categoria: t("Service design", "Design de serviços"), data: "03/07/26", titulo: t("Example article 1", "Artigo de exemplo 1"), resumo: t("Short example summary, at most two lines in the horizontal card.", "Resumo curto de exemplo, com no máximo duas linhas no card horizontal."), info: t("8 min read", "8 min de leitura"), imagem: foto, alt },
      { categoria: t("Innovation", "Inovação"), data: "18/09/26", titulo: t("Example article 2", "Artigo de exemplo 2"), resumo: t("Short example summary.", "Resumo curto de exemplo."), info: t("6–7 min read", "6–7 min de leitura"), imagem: foto, alt },
    ],
    semFoto: [
      { categoria: t("Research", "Pesquisa"), data: "10/08/26", titulo: t("Example article without a photo", "Artigo de exemplo sem foto"), resumo: t("Without a photo, the card shows only the text: category, date, title, summary and the action line.", "Sem foto, o card mostra só o texto: categoria, data, título, resumo e a linha da ação."), info: t("5 min read", "5 min de leitura") },
      { categoria: t("News", "Novidades"), data: "05/08/26", titulo: t("Example of a short note", "Exemplo de nota curta"), resumo: t("Good for quick notes, when no photo helps tell the story.", "Bom para notas rápidas, quando nenhuma foto ajuda a contar a história."), info: t("2 min read", "2 min de leitura") },
    ],
    vertical: [
      { categoria: t("Research", "Pesquisa"), data: "10/08/26", titulo: t("Example article 4", "Artigo de exemplo 4"), resumo: t("The vertical format, photo on top, for grids of 2 or 3 columns.", "O formato vertical, com a foto em cima, para grades de 2 ou 3 colunas."), info: t("5 min read", "5 min de leitura"), imagem: foto, alt },
      { categoria: t("Strategy", "Estratégia"), data: "02/08/26", titulo: t("Example article with the photo on top", "Artigo de exemplo com a foto em cima"), resumo: t("The vertical format, photo on top, for 3-column grids.", "O formato vertical, com a foto em cima, para grades de 3 colunas."), info: t("4 min read", "4 min de leitura"), imagem: foto, alt },
      { categoria: t("Experience", "Experiência"), data: "20/07/26", titulo: t("Example article 3", "Artigo de exemplo 3"), resumo: t("Short example summary.", "Resumo curto de exemplo."), info: t("3 min read", "3 min de leitura"), imagem: foto, alt },
    ],
    ler: t("Read article", "Ler artigo"),
  };
}

/** Seção "Card de publicação" da página Cards. */
export function SecaoCardDePublicacao({ marca, foto, alt }: { marca: Marca; foto: string; alt: string }) {
  const { t } = useI18n();
  const p = usePublicacoes(marca, foto, alt);
  const textos = { ler: p.ler, novaAba: t(" (opens in a new tab)", " (abre em nova aba)") };
  return (
    <section id="card-publicacao" className="scroll-mt-32">
      <SectionHeader
        title={t("Ready-made component: publication card", "Componente pronto: card de publicação")}
        description={marca === "fl"
          ? "Para publicações da FindLook: novidades da plataforma, moda, promoções. Foto com selo opcional, categoria na cor da marca e data, título, resumo com limite de linhas, divisor e a linha da ação: a informação à esquerda e \"Ler publicação →\" à direita. O card inteiro abre a publicação."
          : t("For articles, insights and news (the home page \"Insights & articles\"). Photo with an optional badge, category in the brand colour and date, title, summary with a line limit, divider and the action line: reading time on the left and \"Read article →\" on the right. The whole card opens the article.", "Para artigos, insights e notícias (os \"Insights & artigos\" da página inicial). Foto com selo opcional, categoria na cor da marca e data, título, resumo com limite de linhas, divisor e a linha da ação: o tempo de leitura à esquerda e \"Ler artigo →\" à direita. O card inteiro abre o artigo.")}
      />
      <div className="space-y-6">
        <div>
          <Rotulo>{t("Highlight: one per section", "Destaque: um por seção")}</Rotulo>
          <CardDePublicacao formato="destaque" {...p.destaque} href="#card-publicacao" textos={textos} />
        </div>
        <div>
          <Rotulo>{t("Horizontal: two per row", "Horizontal: dois por linha")}</Rotulo>
          <GradeDeCards colunas={{ base: 1, lg: 2 }} className="gap-6">
            {p.horizontal.map(h => <CardDePublicacao key={h.titulo} formato="horizontal" {...h} href="#card-publicacao" textos={textos} />)}
          </GradeDeCards>
        </div>
        <div>
          <Rotulo>{t("Vertical: grids of 2 or 3 columns", "Vertical: grades de 2 ou 3 colunas")}</Rotulo>
          <GradeDeCards colunas={{ base: 1, md: 2, xl: 3 }} className="gap-6">
            {p.vertical.map(v => <CardDePublicacao key={v.titulo} formato="vertical" {...v} href="#card-publicacao" textos={textos} />)}
          </GradeDeCards>
        </div>
        <div>
          <Rotulo>{t("Without a photo", "Sem foto")}</Rotulo>
          <GradeDeCards colunas={{ base: 1, md: 2 }} className="gap-6">
            {p.semFoto.map(v => <CardDePublicacao key={v.titulo} formato="vertical" {...v} href="#card-publicacao" textos={textos} />)}
          </GradeDeCards>
        </div>
        <DoDont
          dos={[
            t("One highlight per section; the others horizontal or vertical.", "Um destaque por seção; os outros horizontais ou verticais."),
            t("The whole card opens the publication; the action on the right only repeats the invitation.", "O card inteiro abre a publicação; a ação à direita só repete o convite."),
            t("Category short and real; date in the same format across the page.", "Categoria curta e real; data no mesmo formato na página toda."),
            t("A badge on the photo only for what is new (\"Most recent\").", "Selo na foto só para o que é novo (\"Mais recente\")."),
          ]}
          donts={[
            t("\"Read article\" on the left and the reading time on the right.", "\"Ler artigo\" à esquerda e o tempo de leitura à direita."),
            t("Two links in the card (title and action) pointing to the same place.", "Dois links no card (título e ação) apontando para o mesmo lugar."),
            t("A shadow on the resting card: only border.", "Sombra no card parado: só borda."),
            t("A summary that runs past the line limit.", "Resumo que passa do limite de linhas."),
          ]}
        />
        <CodeBlockSimples>{`import { CardDePublicacao } from "@/app/components/ui/card-de-publicacao";

<CardDePublicacao
  formato="destaque"                 // "destaque" | "horizontal" | "vertical" (padrão)
  titulo="…" href="…" resumo="…"
  imagem="…" alt="…" selo="Mais recente"
  categoria="${marca === "fl" ? "Novidades da plataforma" : "Business design"}" data="${marca === "fl" ? "28/11/2026" : "01/09/2026"}"
  tempoDeLeitura="${marca === "fl" ? "3 min de leitura" : "10–12 min de leitura"}"   // ou info={…}
  textos={{ ler: "${p.ler}" }}       // padrão: "Ler publicação"
  novaAba nivel={3}
/>
${marca === "dm" ? `// CardDeArtigo (ui/card-de-artigo.tsx) é o mesmo card, com "Ler artigo".\n` : ""}
// HTML puro (páginas sem React): htmlDoCardDePublicacao({ … }) devolve o HTML com as classes
// .ds-card-publicacao (--destaque | --horizontal | --vertical), __cartao, __midia, __foto, __selo, __corpo,
// __meta, __categoria, __titulo, __link, __resumo, __acao e .ds-acoes-do-card no rodapé (theme.css, bloco "@ds-css-puro:cards-acao").`}</CodeBlockSimples>
      </div>
    </section>
  );
}

/** Seção "Botão de ações" (página com o Dropdown). */
export function SecaoBotaoDeAcoes({ marca }: { marca: Marca }) {
  const { t } = useI18n();
  const x = useTextos(marca);
  return (
    <section id="botao-de-acoes" className="scroll-mt-32 space-y-6">
      <SectionHeader
        title={t("Actions button", "Botão de ações")}
        description={t(
          "When there are more actions than fit, they go in one standard button: \"Actions\" with an arrow pointing down. Tapping it opens the menu of options. On phones the word does not appear and the button becomes three vertical dots. Inspired by the Actions menu of the restricted area.",
          "Quando há mais ações do que cabem, elas vão para um botão padrão: \"Ações\", com uma seta apontando para baixo. Ao tocar, abre o menu de opções. No celular a palavra não aparece e o botão vira três pontinhos verticais. Inspirado no menu Ações da área restrita.",
        )}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <Rotulo>{t("Tablet and computer", "Tablet e computador")}</Rotulo>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <BotaoDeAcoes opcoes={x.mais.opcoes} />
            <Button size="sm">{x.mais.principal}</Button>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Rotulo>{t("Phone (or soIcone)", "Celular (ou soIcone)")}</Rotulo>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <BotaoDeAcoes soIcone opcoes={x.mais.opcoes} />
            <Button size="sm">{x.mais.principal}</Button>
          </div>
        </div>
      </div>
      <DataTable
        head={[t("Part", "Parte"), t("How it works", "Como funciona")]}
        rows={[
          [t("Button", "Botão"), t("Secondary (outline) pill with \"Actions\" and the down arrow; the arrow turns when the menu opens. Under 640 px, a round button with three vertical dots, 44 px to touch.", "Pílula secundária (contorno) com \"Ações\" e a seta para baixo; a seta gira quando o menu abre. Abaixo de 640 px, botão redondo com três pontinhos verticais, 44 px para o toque.")],
          [t("Menu", "Menu"), t("The DS Dropdown, aligned to the right edge of the button. Each option with a Lucide icon and a short verb.", "O Dropdown do DS, alinhado à borda direita do botão. Cada opção com um ícone Lucide e um verbo curto.")],
          [t("Delete", "Excluir"), t("Destructive options go last, in the error colour, after a separator. Irreversible actions open a confirmation.", "Opções destrutivas ficam por último, na cor de erro, depois de um separador. Ações irreversíveis abrem uma confirmação.")],
          [t("Keyboard", "Teclado"), t("Enter, Space or down arrow open; arrows move through the options; Esc closes and returns focus to the button.", "Enter, Espaço ou seta para baixo abrem; as setas percorrem as opções; Esc fecha e devolve o foco ao botão.")],
          [t("Screen readers", "Leitores de tela"), t("The button is always called \"Actions\" (or the rotulo), also when only the dots show.", "O botão se chama sempre \"Ações\" (ou o rotulo), também quando só os pontinhos aparecem.")],
        ]}
      />
      <DoDont
        dos={[
          t("Use it when a card or a row has more than two actions.", "Use quando um card ou uma linha tem mais de duas ações."),
          t("Keep the main action out of the menu, as a pill, beside the button.", "Deixe a ação principal fora do menu, como pílula, ao lado do botão."),
          t("Short verbs in the options: Edit, Duplicate, Delete.", "Verbos curtos nas opções: Editar, Duplicar, Excluir."),
        ]}
        donts={[
          t("A menu with a single option: show the button directly.", "Um menu com uma opção só: mostre o botão direto."),
          t("Hide the main action inside the menu.", "Esconder a ação principal dentro do menu."),
          t("A different icon for \"more actions\" in each screen.", "Um ícone diferente para \"mais ações\" em cada tela."),
        ]}
      />
      <CodeBlockSimples>{`import { BotaoDeAcoes } from "@/app/components/ui/botao-de-acoes";

<BotaoDeAcoes
  rotulo="Ações"                      // padrão; no celular, só para leitores de tela
  soIcone={false}                      // true: os 3 pontinhos em qualquer largura
  opcoes={[
    { rotulo: "Editar", icone: <Pencil />, onSelect: editar },
    { rotulo: "Ver na página", icone: <Eye />, href: "/…", novaAba: true },
    { rotulo: "Excluir", icone: <Trash2 />, onSelect: excluir, destrutiva: true },  // separador antes, cor de erro
  ]}
/>`}</CodeBlockSimples>
    </section>
  );
}
