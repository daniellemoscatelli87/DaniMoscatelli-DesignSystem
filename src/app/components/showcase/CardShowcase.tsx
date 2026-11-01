import React, { useState } from "react";
import { Check, ChevronRight, Image, LayoutPanelTop, MousePointer2, ShieldCheck, Sparkles } from "lucide-react";
import { useI18n } from "../../i18n";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { ShineBorder } from "../ui/shine-border";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, SubTitle, display } from "./shared/Guidance";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h2 className={`${display} text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1`}>{title}</h2>
      <p className="text-[0.9375rem] leading-relaxed text-muted-foreground max-w-3xl">{description}</p>
    </div>
  );
}

function SpecCard({
  title,
  description,
  action,
  children,
  footer,
  className = "",
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`gap-5 border-border shadow-[var(--shadow-sm)] ${className}`}>
      <CardHeader className="gap-1.5">
        <CardTitle className={`${display} text-[1rem] font-semibold tracking-[-0.01em]`}>{title}</CardTitle>
        <CardDescription className="text-[0.8125rem] leading-relaxed">{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="border-t border-border">{footer}</CardFooter>}
    </Card>
  );
}

export function CardShowcase() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(1);

  const cardTokens: TokenGroup[] = [
    {
      group: t("Surface", "Superfície"),
      tokens: [
        { name: "--card", description: t("Card background", "Fundo do card"), light: "#FFFFFF", dark: "rgba(19,26,39,0.75)", isColor: true },
        { name: "--card-foreground", description: t("Primary content", "Conteúdo principal"), light: "#131A27", dark: "#E4E9F0", isColor: true },
        { name: "--muted-foreground", description: t("Descriptions and metadata", "Descrições e metadados"), light: "#627288", dark: "#8898B0", isColor: true },
        { name: "--border", description: t("Default outline", "Contorno padrão"), light: "#D6DCE6", dark: "#283043", isColor: true },
      ],
    },
    {
      group: t("Shape and elevation", "Forma e elevação"),
      tokens: [
        { name: "--radius", description: t("Default card radius", "Raio padrão do card"), light: "0.75rem" },
        { name: "--shadow-sm", description: t("Default elevation", "Elevação padrão"), light: "0 1px 3px …", dark: "0 1px 3px …" },
        { name: "--shadow-md", description: t("Hover elevation", "Elevação no hover"), light: "0 4px 12px …", dark: "0 4px 12px …" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="card-anatomy" className="scroll-mt-32">
        <SectionHeader
          title={t("Card anatomy", "Anatomia do card")}
          description={t(
            "Cards group related information and actions into a scannable surface. Use a clear hierarchy and include only elements that belong to the same task or subject.",
            "Cards agrupam informações e ações relacionadas em uma superfície fácil de escanear. Use uma hierarquia clara e inclua apenas elementos da mesma tarefa ou assunto.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          <div className="relative">
            <SpecCard
              title={t("Workspace activity", "Atividade do workspace")}
              description={t("A concise description establishes context before the main content.", "Uma descrição concisa estabelece o contexto antes do conteúdo principal.")}
              action={<Button variant="ghost" size="icon" aria-label={t("Open options", "Abrir opções")}><Sparkles /></Button>}
              footer={
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-[0.75rem] text-muted-foreground">{t("Updated 5 minutes ago", "Atualizado há 5 minutos")}</span>
                  <Button size="sm">{t("View report", "Ver relatório")}<ChevronRight /></Button>
                </div>
              }
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  [t("Views", "Visualizações"), "24.8K"],
                  [t("Actions", "Ações"), "1,284"],
                  [t("Rate", "Taxa"), "5.2%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[var(--radius)] bg-muted p-3">
                    <p className="text-[0.6875rem] text-muted-foreground mb-1">{label}</p>
                    <p className={`${display} text-[1rem] font-semibold text-foreground`}>{value}</p>
                  </div>
                ))}
              </div>
            </SpecCard>
          </div>
          <DataTable
            head={[t("Part", "Parte"), t("Purpose", "Finalidade")]}
            rows={[
              [t("Container", "Container"), t("Groups the content and defines surface, border, radius and elevation.", "Agrupa o conteúdo e define superfície, borda, raio e elevação.")],
              [t("Header", "Cabeçalho"), t("Holds title, description and an optional contextual action.", "Contém título, descrição e uma ação contextual opcional.")],
              [t("Content", "Conteúdo"), t("Carries the primary information. Its structure changes by use case.", "Carrega a informação principal. Sua estrutura muda conforme o caso de uso.")],
              [t("Footer", "Rodapé"), t("Contains metadata or actions related to the whole card.", "Contém metadados ou ações relacionadas ao card inteiro.")],
            ]}
          />
        </div>
      </section>

      <section id="card-variants" className="scroll-mt-32">
        <SectionHeader
          title={t("Variants", "Variantes")}
          description={t("Choose a composition based on content and behavior, not decoration.", "Escolha a composição com base no conteúdo e no comportamento, não na decoração.")}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpecCard title={t("Standard", "Padrão")} description={t("For grouped information with optional actions.", "Para informações agrupadas com ações opcionais.")}>
            <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{t("Keep the content focused and let the surrounding layout define its width.", "Mantenha o conteúdo focado e deixe o layout ao redor definir sua largura.")}</p>
          </SpecCard>
          <Card className="gap-0 overflow-hidden border-border shadow-[var(--shadow-sm)]">
            <div className="h-32 bg-muted flex items-center justify-center border-b border-border">
              <Image className="h-8 w-8 text-muted-foreground/60" aria-hidden />
            </div>
            <CardHeader>
              <CardTitle className={`${display} text-[1rem] font-semibold`}>{t("Media card", "Card com mídia")}</CardTitle>
              <CardDescription>{t("Use meaningful imagery that adds context.", "Use imagens relevantes que adicionem contexto.")}</CardDescription>
            </CardHeader>
            <CardFooter><Button variant="outline" size="sm">{t("Learn more", "Saiba mais")}</Button></CardFooter>
          </Card>
          <SpecCard
            title={t("Action card", "Card de ação")}
            description={t("For a single, clear destination or task.", "Para um único destino ou tarefa clara.")}
            className="transition-all hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center gap-3 text-[0.875rem] font-medium text-foreground">
              <MousePointer2 className="h-5 w-5 text-primary" aria-hidden />
              {t("The complete surface may be interactive.", "A superfície completa pode ser interativa.")}
            </div>
          </SpecCard>
          <Card className="gap-3 border-border px-4 py-3 shadow-[var(--shadow-xs)]">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className={`${display} text-[0.875rem] font-semibold`}>{t("Compact card", "Card compacto")}</CardTitle>
                <CardDescription className="truncate text-[0.75rem]">{t("Dense lists and secondary information.", "Listas densas e informações secundárias.")}</CardDescription>
              </div>
              <Button variant="ghost" size="sm">{t("Open", "Abrir")}</Button>
            </div>
          </Card>
        </div>
      </section>

      <section id="card-shine" className="scroll-mt-32">
        <SectionHeader
          title="Shine Border"
          description={t(
            "An opt-in animated border for a single high-priority card. The effect decorates the card without changing its anatomy, layout or interaction.",
            "Uma borda animada opcional para um único card de alta prioridade. O efeito decora o card sem alterar sua anatomia, layout ou interação.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-5">
          <Card className="relative gap-5 overflow-hidden border-border shadow-[var(--shadow-sm)]">
            <ShineBorder
              borderWidth={1}
              duration={12}
              shineColor={["var(--primary)", "var(--chart-2)", "var(--primary)"]}
            />
            <CardHeader>
              <span className="mb-2 inline-flex w-fit items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-primary">
                {t("Recommended", "Recomendado")}
              </span>
              <CardTitle className={`${display} text-[1.125rem] font-semibold`}>{t("Studio plan", "Plano Studio")}</CardTitle>
              <CardDescription>{t("Use Shine Border to call attention to one exceptional option.", "Use Shine Border para chamar atenção para uma única opção excepcional.")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className={`${display} text-[1.75rem] font-semibold text-foreground`}>$49</span>
                <span className="text-[0.75rem] text-muted-foreground">/{t("month", "mês")}</span>
              </div>
            </CardContent>
            <CardFooter><Button className="w-full">{t("Choose Studio", "Escolher Studio")}</Button></CardFooter>
          </Card>
          <div className="space-y-4">
            <Callout title={t("Opt-in, not a Card default", "Opcional, não padrão do Card")}>
              <p>{t(
                "Shine Border is composed inside a relative, overflow-hidden card. It is not built into the base Card because most surfaces should remain quiet and static.",
                "Shine Border é composto dentro de um card relativo com overflow-hidden. Ele não faz parte do Card base porque a maioria das superfícies deve permanecer discreta e estática.",
              )}</p>
            </Callout>
            <DataTable
              head={[t("Rule", "Regra"), t("Guidance", "Orientação")]}
              rows={[
                [t("Quantity", "Quantidade"), t("Use on at most one card in the same decision group.", "Use em no máximo um card no mesmo grupo de decisão.")],
                [t("Hierarchy", "Hierarquia"), t("Reserve for recommended, premium or newly highlighted content.", "Reserve para conteúdo recomendado, premium ou recém-destacado.")],
                [t("Interaction", "Interação"), t("The border is decorative and never captures pointer events.", "A borda é decorativa e nunca captura eventos de ponteiro.")],
                [t("Reduced motion", "Movimento reduzido"), t("The border remains visible but stops animating.", "A borda continua visível, mas deixa de animar.")],
              ]}
            />
          </div>
        </div>
      </section>

      <section id="card-layout" className="scroll-mt-32">
        <SectionHeader
          title={t("Layout and sizing", "Layout e dimensionamento")}
          description={t("Card dimensions respond to the parent grid. Prefer consistent internal spacing over fixed heights.", "As dimensões do card respondem ao grid pai. Prefira espaçamento interno consistente a alturas fixas.")}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Panel className="p-5">
            <SubTitle>{t("Default specification", "Especificação padrão")}</SubTitle>
            <div className="space-y-3 text-[0.8125rem]">
              {[
                [t("Padding", "Padding"), "24px", t("16px for compact cards", "16px para cards compactos")],
                [t("Section gap", "Espaço entre seções"), "24px", t("Use 12–16px in dense layouts", "Use 12–16px em layouts densos")],
                [t("Radius", "Raio"), "var(--radius)", t("Keep consistent within the same grid", "Mantenha consistente no mesmo grid")],
                [t("Border", "Borda"), "1px", t("Use border-border", "Use border-border")],
                [t("Elevation", "Elevação"), "var(--shadow-sm)", t("Increase only for hover or overlays", "Aumente apenas em hover ou overlays")],
              ].map(([label, value, note]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div><p className="font-medium text-foreground">{label}</p><p className="text-muted-foreground">{note}</p></div>
                  <Mono>{value}</Mono>
                </div>
              ))}
            </div>
          </Panel>
          <Callout title={t("Responsive behavior", "Comportamento responsivo")}>
            <p>{t(
              "Let cards fill their grid column. Collapse multi-column content before reducing internal padding, and avoid horizontal scrolling inside a card.",
              "Deixe os cards preencherem sua coluna no grid. Reduza conteúdos em múltiplas colunas antes de diminuir o padding interno e evite rolagem horizontal dentro do card.",
            )}</p>
          </Callout>
        </div>
      </section>

      <section id="card-nested" className="scroll-mt-32">
        <SectionHeader
          title={t("Nested cards", "Cards aninhados")}
          description={t(
            "When a card needs to contain another card, only the outer card defines elevation. Inner cards must never have shadows.",
            "Quando um card precisa conter outro card, apenas o card externo define a elevação. Cards internos nunca devem ter sombras.",
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-5">
          <Card className="gap-5 border-border p-6 shadow-[var(--shadow-sm)]">
            <div>
              <CardTitle className={`${display} text-[1rem] font-semibold`}>{t("Project overview", "Visão geral do projeto")}</CardTitle>
              <CardDescription className="mt-1">{t("The parent card owns the visual elevation.", "O card pai é responsável pela elevação visual.")}</CardDescription>
            </div>
            <Card className="gap-4 border-border bg-muted/40 p-4 shadow-none">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className={`${display} text-[0.875rem] font-semibold`}>{t("Delivery status", "Status da entrega")}</CardTitle>
                  <CardDescription className="mt-1 text-[0.75rem]">{t("This inner card uses a border and no shadow.", "Este card interno usa borda e nenhuma sombra.")}</CardDescription>
                </div>
                <span className="inline-flex shrink-0 items-center rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[0.6875rem] font-semibold text-success">
                  {t("On track", "Em dia")}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-primary" />
              </div>
            </Card>
            <p className="text-[0.75rem] text-muted-foreground">
              <Mono>shadow-[var(--shadow-sm)]</Mono>{" "}
              {t("on the parent", "no card pai")} · <Mono>shadow-none</Mono>{" "}
              {t("on the child", "no card filho")}
            </p>
          </Card>
          <div className="space-y-4">
            <Callout title={t("Elevation rule", "Regra de elevação")}>
              <p>{t(
                "Nested surfaces belong to the parent's elevation context. Adding a shadow to the child creates a false layer and makes the hierarchy ambiguous.",
                "Superfícies aninhadas pertencem ao contexto de elevação do card pai. Adicionar sombra ao filho cria uma camada falsa e torna a hierarquia ambígua.",
              )}</p>
            </Callout>
            <DataTable
              head={[t("Layer", "Camada"), t("Surface treatment", "Tratamento da superfície")]}
              rows={[
                [t("Parent card", "Card pai"), t("Border plus the elevation defined for its context.", "Borda mais a elevação definida para seu contexto.")],
                [t("Inner card", "Card interno"), t("Border or tonal background with shadow-none.", "Borda ou fundo tonal com shadow-none.")],
                [t("Inner interactive card", "Card interno interativo"), t("Use border and focus ring—not elevation—to communicate state.", "Use borda e anel de foco — não elevação — para comunicar o estado.")],
              ]}
            />
          </div>
        </div>
      </section>

      <section id="card-actions" className="scroll-mt-32">
        <SectionHeader
          title={t("Buttons in cards", "Botões em cards")}
          description={t(
            "Button placement and emphasis should reflect the card's task. Keep one primary action and reduce the emphasis of supporting actions.",
            "O posicionamento e a ênfase dos botões devem refletir a tarefa do card. Mantenha uma ação principal e reduza a ênfase das ações de apoio.",
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SpecCard
            title={t("Primary and secondary actions", "Ações primária e secundária")}
            description={t("Place task-level actions together in the footer, with the primary action last.", "Coloque ações da tarefa juntas no rodapé, com a ação principal por último.")}
            footer={
              <div className="flex w-full justify-end gap-2">
                <Button variant="outline" size="sm">{t("Cancel", "Cancelar")}</Button>
                <Button size="sm">{t("Save changes", "Salvar alterações")}</Button>
              </div>
            }
          >
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t("Use this pattern when the card represents a form, configuration or focused task.", "Use este padrão quando o card representa um formulário, configuração ou tarefa focada.")}
            </p>
          </SpecCard>

          <SpecCard
            title={t("Contextual ghost action", "Ação ghost contextual")}
            description={t("Header actions should be compact and visually quiet.", "Ações no cabeçalho devem ser compactas e visualmente discretas.")}
            action={<Button variant="ghost" size="icon" aria-label={t("More options", "Mais opções")}><Sparkles /></Button>}
          >
            <div className="rounded-[var(--radius)] bg-muted p-4">
              <p className="text-[0.8125rem] text-foreground">{t("Ghost works for menus, dismiss, edit or other tertiary actions.", "Ghost funciona para menus, dispensar, editar ou outras ações terciárias.")}</p>
            </div>
          </SpecCard>

          <SpecCard
            title={t("Navigation with a link button", "Navegação com botão link")}
            description={t("Use a link button when the action only navigates to related detail.", "Use um botão link quando a ação apenas navega para um detalhe relacionado.")}
            footer={
              <Button variant="link" size="sm" className="px-0">
                {t("View full report", "Ver relatório completo")}<ChevronRight />
              </Button>
            }
          >
            <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t("Do not use the link style for save, submit, delete or other state-changing actions.", "Não use o estilo link para salvar, enviar, excluir ou outras ações que alteram estado.")}
            </p>
          </SpecCard>

          <SpecCard
            title={t("Destructive action", "Ação destrutiva")}
            description={t("Separate destructive actions from the primary flow and name the consequence.", "Separe ações destrutivas do fluxo principal e nomeie a consequência.")}
            footer={
              <div className="flex w-full items-center justify-between gap-2">
                <Button variant="ghost" size="sm">{t("Keep project", "Manter projeto")}</Button>
                <Button variant="destructive" size="sm">{t("Delete project", "Excluir projeto")}</Button>
              </div>
            }
          >
            <Callout title={t("Confirmation required", "Confirmação necessária")}>
              <p>{t("Irreversible actions should open a confirmation dialog.", "Ações irreversíveis devem abrir um diálogo de confirmação.")}</p>
            </Callout>
          </SpecCard>
        </div>
        <div className="mt-5">
          <DataTable
            head={[t("Position", "Posição"), t("Recommended use", "Uso recomendado"), t("Variant", "Variante")]}
            rows={[
              [t("Header", "Cabeçalho"), t("Contextual actions and overflow menus", "Ações contextuais e menus de opções"), "Ghost / icon"],
              [t("Content", "Conteúdo"), t("Inline navigation related to the content", "Navegação inline relacionada ao conteúdo"), "Link"],
              [t("Footer", "Rodapé"), t("Task completion and supporting actions", "Conclusão da tarefa e ações de apoio"), "Primary + Outline"],
              [t("Separated footer edge", "Extremidade separada do rodapé"), t("Destructive action with explicit consequence", "Ação destrutiva com consequência explícita"), "Destructive"],
            ]}
          />
        </div>
      </section>

      <section id="card-states" className="scroll-mt-32">
        <SectionHeader
          title={t("Interactive states", "Estados interativos")}
          description={t("Only cards with a clear action should look interactive. Selection must remain visible without relying on color alone.", "Apenas cards com uma ação clara devem parecer interativos. A seleção deve continuar visível sem depender apenas de cor.")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map(index => {
            const isSelected = selected === index;
            const labels = [
              [t("Starter", "Inicial"), t("For personal projects", "Para projetos pessoais")],
              [t("Studio", "Studio"), t("For growing teams", "Para equipes em crescimento")],
              [t("Enterprise", "Enterprise"), t("For complex organizations", "Para organizações complexas")],
            ];
            return (
              <Card key={index} className={`gap-4 border-2 transition-all ${isSelected ? "border-primary shadow-[var(--shadow-md)]" : "border-border hover:border-[var(--border-strong)]"}`}>
                <CardHeader>
                  <CardTitle className={`${display} text-[1rem] font-semibold flex items-center gap-2`}>
                    {labels[index][0]}
                    {isSelected && <Check className="h-4 w-4 text-primary" aria-label={t("Selected", "Selecionado")} />}
                  </CardTitle>
                  <CardDescription>{labels[index][1]}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" variant={isSelected ? "default" : "outline"} onClick={() => setSelected(index)} aria-pressed={isSelected}>
                    {isSelected ? t("Selected", "Selecionado") : t("Select", "Selecionar")}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="card-guidelines" className="scroll-mt-32">
        <SectionHeader
          title={t("Usage guidelines", "Diretrizes de uso")}
          description={t("Cards are a grouping mechanism, not the default container for every element.", "Cards são um mecanismo de agrupamento, não o container padrão para todos os elementos.")}
        />
        <DoDont
          dos={[
            t("Group content that shares one subject or task.", "Agrupe conteúdos que compartilham um assunto ou tarefa."),
            t("Keep card structures consistent within the same grid.", "Mantenha estruturas consistentes no mesmo grid."),
            t("Use shadow-none on every card nested inside another card.", "Use shadow-none em todo card aninhado dentro de outro card."),
            t("Use one primary action and move secondary actions to the footer or menu.", "Use uma ação principal e mova ações secundárias para o rodapé ou menu."),
          ]}
          donts={[
            t("Give an inner card its own elevation or hover shadow.", "Não dê ao card interno elevação própria nem sombra no hover."),
            t("Make the whole surface clickable when it contains other interactive controls.", "Não torne toda a superfície clicável quando houver outros controles interativos."),
            t("Use elevation only as decoration or mix multiple shadow levels in one grid.", "Não use elevação apenas como decoração nem misture vários níveis de sombra no mesmo grid."),
          ]}
        />
      </section>

      <section id="card-accessibility" className="scroll-mt-32">
        <SectionHeader
          title={t("Accessibility", "Acessibilidade")}
          description={t("Card semantics depend on purpose. A visual card does not automatically need an ARIA role.", "A semântica do card depende da finalidade. Um card visual não precisa automaticamente de um papel ARIA.")}
        />
        <PrincipleGrid
          items={[
            { icon: LayoutPanelTop, title: t("Heading structure", "Estrutura de títulos"), desc: t("Use the card title at the correct heading level within the page hierarchy.", "Use o título do card no nível correto da hierarquia da página.") },
            { icon: MousePointer2, title: t("Keyboard behavior", "Comportamento no teclado"), desc: t("Interactive cards need a visible focus ring and must activate with Enter or Space.", "Cards interativos precisam de foco visível e devem ser ativados com Enter ou Espaço.") },
            { icon: ShieldCheck, title: t("Clear labeling", "Rotulagem clara"), desc: t("Icon-only actions need accessible names, and images need useful alternative text.", "Ações apenas com ícone precisam de nomes acessíveis e imagens precisam de texto alternativo útil.") },
          ]}
        />
      </section>

      <section id="card-tokens" className="scroll-mt-32">
        <SectionHeader
          title={t("Card tokens", "Tokens de card")}
          description={t("Semantic tokens keep every variant consistent across light and dark modes.", "Tokens semânticos mantêm todas as variantes consistentes nos modos claro e escuro.")}
        />
        <TokenTable groups={cardTokens} />
      </section>
    </div>
  );
}
