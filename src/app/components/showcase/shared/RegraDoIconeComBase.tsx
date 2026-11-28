import React from "react";
import { Mail } from "lucide-react";
import { useI18n } from "../../../i18n";
import { Card } from "../../ui/card";
import { GradeDeCards } from "../../ui/grade-de-cards";
import { IconeComBase, type TomDaBase } from "../../ui/painel-dados";
import { DoDont, Mono } from "./Guidance";

/**
 * Regra do ícone com base (decisão da dona do produto, 28/11/2026): três estados, pelo que o componente faz.
 * Arquivo igual nos dois DS (Dani Moscatelli e FindLook). Usado em Templates do painel › Ícone com base (DM) e em
 * Ícones › Base do ícone (FindLook).
 */
export function RegraDoIconeComBase() {
  const { t } = useI18n();
  const estados: { tom: TomDaBase; titulo: string; texto: string; tokens: string; exemplos: string; desabilitado?: boolean }[] = [
    {
      tom: "desabilitado",
      titulo: t("1. Disabled", "1. Desabilitado"),
      texto: t("Grey icon on a grey base. A card or item that is disabled or unavailable.", "Ícone cinza na base cinza. Card ou item desabilitado ou indisponível."),
      tokens: "--disabled + --disabled-foreground",
      exemplos: t("An unavailable option in a choice card, a feature outside the plan.", "Opção indisponível no cartão de escolha, recurso fora do plano."),
      desabilitado: true,
    },
    {
      tom: "informativo",
      titulo: t("2. Informative", "2. Informativo"),
      texto: t("Coloured icon on a light grey base. A component that only informs and cannot be clicked.", "Ícone colorido na base cinza clara. Componente que só informa e não é clicável."),
      tokens: "--muted + --primary-text",
      exemplos: t("Benefits block, indicator card without a link, header of a card that is not clickable, empty state.", "Bloco de benefícios, card de indicador sem link, cabeçalho de card que não se toca, estado vazio."),
    },
    {
      tom: "clicavel",
      titulo: t("3. Clickable", "3. Clicável"),
      texto: t("Coloured icon on a light coloured base. A card, list row or link that can be tapped.", "Ícone colorido na base colorida clara. Card, linha de lista ou link que se pode tocar."),
      tokens: "--primary-muted + --primary-text",
      exemplos: t("Navigation card, indicator card with a link, clickable list row, choice card.", "Card de navegação, card de indicador com link, linha de lista clicável, cartão de escolha."),
    },
  ];
  return (
    <div data-slot="regra-do-icone-com-base" className="space-y-4">
      <GradeDeCards className="gap-4 md:grid-cols-3">
        {estados.map((e) => (
          <Card key={e.tom} data-tom={e.tom} aria-disabled={e.desabilitado || undefined} className="h-full gap-0 p-6">
            <IconeComBase tom={e.tom} tamanho="lg"><Mail /></IconeComBase>
            <p className={e.desabilitado ? "mt-4 text-body-lg font-bold text-disabled-foreground" : "mt-4 text-body-lg font-bold text-foreground"}>{e.titulo}</p>
            <p className={e.desabilitado ? "mt-1 text-body-sm leading-relaxed text-disabled-foreground" : "mt-1 text-body-sm leading-relaxed text-muted-foreground"}>{e.texto}</p>
            <p className="mt-3 text-body-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{t("Use in: ", "Onde usar: ")}</span>{e.exemplos}
            </p>
            <p className="mt-3"><Mono>tom="{e.tom}"</Mono></p>
            <p className="mt-2 text-caption text-muted-foreground">{e.tokens}</p>
          </Card>
        ))}
      </GradeDeCards>

      {/* Tamanhos: um tom por linha (sem divisor solto no fim de uma linha quebrada). */}
      <dl className="divide-y divide-border rounded-xl border border-border bg-card">
        {estados.map((e) => (
          <div key={e.tom} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
            <dt className="w-40 text-body-sm font-semibold text-foreground">{e.titulo.replace(/^\d\. /, "")}</dt>
            <dd className="flex flex-wrap items-center gap-4">
              {(["sm", "md", "lg"] as const).map((tm) => <IconeComBase key={tm} tom={e.tom} tamanho={tm}><Mail /></IconeComBase>)}
              <IconeComBase tom={e.tom} redonda><Mail /></IconeComBase>
              <span className="text-caption text-muted-foreground">{t("sm · md · lg · round (list rows)", "sm · md · lg · redonda (linhas de lista)")}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="max-w-3xl text-body-sm leading-relaxed text-muted-foreground">
        {t(
          "A small icon next to text (16 to 20 px) has no base and takes the colour of its context. The state tones (sucesso, aviso, erro, info) stay for icons that say a state. The old names still work: marca = clicavel and neutro = informativo.",
          "Ícone pequeno ao lado do texto (16 a 20 px) fica sem base, na cor do contexto. Os tons de estado (sucesso, aviso, erro, info) continuam para o ícone que diz um estado. Os nomes antigos ainda valem: marca = clicavel e neutro = informativo.",
        )}
      </p>

      <DoDont
        dos={[
          t("Pick the tone by what the component does: it can be tapped, clickable; it only informs, informative; it is unavailable, disabled.", "Escolha o tom pelo que o componente faz: se toca, clicável; só informa, informativo; está indisponível, desabilitado."),
          t("When the same card can have a link or not, the tone follows it: with a link, clickable; without, informative.", "Quando o mesmo card pode ter link ou não, o tom acompanha: com link, clicável; sem link, informativo."),
          t("The same tone for every card of a grid of equal cards that behave the same way.", "O mesmo tom em todos os cards de uma grade de cards iguais que funcionam do mesmo jeito."),
        ]}
        donts={[
          t("A coloured base on something that cannot be tapped: it promises a click that does not exist.", "Base colorida em algo que não se toca: ela promete um clique que não existe."),
          t("A grey icon on a grey base on something that works: it looks disabled.", "Ícone cinza na base cinza em algo que funciona: parece desabilitado."),
          t("Colour as the only signal: the state also goes in text (visible or for screen readers).", "Cor como único sinal: o estado vai também em texto (visível ou para leitores de tela)."),
        ]}
      />
    </div>
  );
}
