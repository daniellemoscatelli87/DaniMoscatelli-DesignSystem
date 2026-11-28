import React from "react";
import { useI18n } from "../../../i18n";
import { SectionHeader } from "./SectionHeader";
import { DoDont, Mono } from "./Guidance";
import { BeneficiosDosDoisLados, type LadoDosBeneficios } from "../../ui/beneficios-dos-dois-lados";

/*
 * Documentação do BeneficiosDosDoisLados (28/11/2026). Arquivo igual nos dois DS: cada página passa o próprio exemplo
 * (no Dani Moscatelli, o conteúdo real do Projeto Piloto; no FindLook, um exemplo fictício, identificado como tal).
 */

function Codigo({ children }: { children: string }) {
  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-4 font-[family-name:var(--font-mono)] text-label leading-relaxed text-foreground">
      {children}
    </pre>
  );
}

function Moldura({ rotulo, children, className = "" }: { rotulo: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`m-0 min-w-0 ${className}`}>
      <figcaption className="mb-3 text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{rotulo}</figcaption>
      <div className="rounded-xl bg-background p-4 ring-1 ring-border">{children}</div>
    </figure>
  );
}

export function SecaoBeneficiosDosDoisLados({ id, lados, ficticio = false, api, html }: { id: string; lados: LadoDosBeneficios[]; ficticio?: boolean; api: string; html: string }) {
  const { t } = useI18n();
  const sufixo = ficticio ? t(" · fictitious example", " · exemplo fictício") : "";
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div>
        <SectionHeader
          title={t("Benefits for both sides", "Benefícios dos dois lados")}
          description={t(
            "What each side gains from a partnership, in one card. On phones, a compact switch at the top picks the side and shows its title and list. With room, the sides sit side by side in the same card, separated by a line, and the label, the title and the list start at the same height in every column.",
            "O que cada lado ganha numa parceria, num card só. No celular, um alternador compacto no alto escolhe o lado e mostra o título e a lista dele. Com espaço, os lados ficam lado a lado no mesmo card, separados por uma linha, e a etiqueta, o título e a lista começam na mesma altura em todas as colunas.",
          )}
        />
        <dl className="-mt-6 grid gap-2 text-body-sm text-muted-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-x-3">
          <dt>{t("File", "Arquivo")}</dt>
          <dd className="flex flex-wrap gap-2"><Mono>ui/beneficios-dos-dois-lados.tsx</Mono><Mono>styles/theme.css · .ds-beneficios-lados</Mono></dd>
          <dt>{t("Component", "Componente")}</dt>
          <dd className="flex flex-wrap gap-2"><Mono>BeneficiosDosDoisLados</Mono></dd>
        </dl>
      </div>

      <div className="grid gap-6">
        <Moldura rotulo={t("With room: columns side by side", "Com espaço: colunas lado a lado") + sufixo}>
          <BeneficiosDosDoisLados lados={lados} />
        </Moldura>
        <Moldura rotulo={t("Phone (390 px): compact switch", "Celular (390 px): alternador compacto") + sufixo} className="max-w-[390px]">
          <BeneficiosDosDoisLados lados={lados} />
        </Moldura>
      </div>

      <ul className="grid list-none gap-2 p-0 text-body-sm leading-relaxed text-muted-foreground">
        <li>{t("The layout follows the width of the container, not the screen: from 40rem (56rem with three sides) the switch gives way to the columns.", "O desenho segue a largura do contêiner, não da tela: a partir de 40rem (56rem com três lados), o alternador dá lugar às colunas.")}</li>
        <li>{t("Switch: grey track, the chosen side in white with a border and a light shadow, its icon in colour; each option is as wide as its name, so the whole name fits even on narrow phones; 44 px touch area. They are real radio buttons: Tab enters the group and the arrow keys change the side.", "Alternador: trilho cinza, o lado escolhido em branco com borda e sombra leve e o ícone dele colorido; cada opção tem a largura do próprio nome, para o nome inteiro caber mesmo no celular estreito; área de toque de 44 px. São rádios de verdade: Tab entra no grupo e as setas trocam o lado.")}</li>
        <li>{t("Columns: the icon is informative (coloured on the light grey base), because the block only informs; the label is uppercase in --primary-text; the list uses CircleCheckBig at 20 px in --primary-text.", "Colunas: o ícone é informativo (colorido na base cinza clara), porque o bloco só informa; a etiqueta fica em maiúsculas em --primary-text; a lista usa o CircleCheckBig de 20 px em --primary-text.")}</li>
        <li>{t("Alignment: each column takes the three rows of the grid (subgrid), so label, title and list line up even when one title wraps to two lines.", "Alinhamento: cada coluna ocupa as três linhas da grade (subgrid), então etiqueta, título e lista se alinham mesmo quando um título quebra em duas linhas.")}</li>
        <li>{t("Motion: the chosen option changes colour smoothly and the chosen side fades in; nothing moves with reduced motion.", "Movimento: a opção escolhida muda de cor suavemente e o lado escolhido aparece suave; nada se move com \"menos movimento\".")}</li>
      </ul>

      <div className="space-y-2">
        <h3 className="text-body-sm font-semibold text-foreground">{t("How to use (React)", "Como usar (React)")}</h3>
        <Codigo>{api}</Codigo>
      </div>
      <div className="space-y-2">
        <h3 className="text-body-sm font-semibold text-foreground">{t("Plain HTML pages", "Páginas em HTML puro")}</h3>
        <p className="text-body-sm leading-relaxed text-muted-foreground">
          {t(
            "The same classes, from theme.css (block @ds-css-puro:beneficios-dos-dois-lados), with no JavaScript: the switch works with the radio buttons. Give each block its own name in the radios; use ds-beneficios-lados--tres for three sides.",
            "As mesmas classes, do theme.css (bloco @ds-css-puro:beneficios-dos-dois-lados), sem JavaScript: o alternador funciona com os rádios. Dê um nome próprio aos rádios de cada bloco; com três lados, use ds-beneficios-lados--tres.",
          )}
        </p>
        <Codigo>{html}</Codigo>
      </div>

      <DoDont
        dos={[
          t("Two sides with the same kind of content: a label, a short title and three or four items each.", "Dois lados com o mesmo tipo de conteúdo: etiqueta, título curto e três ou quatro itens em cada um."),
          t("Short labels that name the side (\"For your company\"); they are the switch options on phones.", "Etiquetas curtas que nomeiam o lado (\"Para sua empresa\"); elas são as opções do alternador no celular."),
          t("Give the block room: put it in a full-width row, not in a narrow column.", "Dê espaço ao bloco: numa linha de largura inteira, não numa coluna estreita."),
        ]}
        donts={[
          t("Don't make the columns clickable or add buttons inside them: the block only informs (the action goes below it).", "Não torne as colunas clicáveis nem ponha botões dentro delas: o bloco só informa (a ação vem embaixo dele)."),
          t("Don't use a coloured icon base here: the block cannot be tapped, so the base is grey.", "Não use a base colorida no ícone: o bloco não se toca, então a base é cinza."),
          t("Don't invent benefits or numbers: the content comes from the product.", "Não invente benefícios nem números: o conteúdo vem do produto."),
        ]}
      />
    </section>
  );
}
