import { ArrowRight } from "lucide-react";
import { useI18n, type Bi } from "../../i18n";
import { PageHeader, SectionLabel, useGo, type Navigate, type Target } from "./GetStartedShowcase";

const display = "font-[family-name:var(--font-display)]";

type PrincipleItem = {
  n: string;
  title: Bi;
  statement: Bi;
  practice: Bi[];
  linkLabel: Bi;
  target: Target;
};

const principles: PrincipleItem[] = [
  {
    n: "01",
    title: { en: "One name, everywhere", pt: "Um nome, em todo lugar" },
    statement: { en: "Every visual decision has a name, and that name is the same in Figma and in code.", pt: "Toda decisão visual tem um nome, e esse nome é o mesmo no Figma e no código." },
    practice: [
      { en: "Primary in Figma = --primary in CSS = bg-primary in Tailwind", pt: "Primary no Figma = --primary no CSS = bg-primary no Tailwind" },
      { en: "Names describe intent (Primary, Background, Muted), never appearance (BrandRed, LightBackground)", pt: "Os nomes descrevem a intenção (Primary, Background, Muted), nunca a aparência (BrandRed, LightBackground)" },
    ],
    linkLabel: { en: "Design Tokens › Design ↔ Dev Mapping", pt: "Design Tokens › Mapeamento Design ↔ Dev" },
    target: { page: "tokens", anchor: "tokens-bridge" },
  },
  {
    n: "02",
    title: { en: "Intent over values", pt: "Intenção acima de valores" },
    statement: { en: "Components use decisions, never raw values.", pt: "Componentes usam decisões, nunca valores brutos." },
    practice: [
      { en: "Components reference semantic tokens, never primitives or hex", pt: "Componentes referenciam tokens semânticos, nunca primitivos ou hex" },
      { en: "If a token doesn't exist, create it first — never approximate", pt: "Se o token não existe, crie-o primeiro — nunca aproxime" },
    ],
    linkLabel: { en: "Design Tokens › The three layers", pt: "Design Tokens › As três camadas" },
    target: { page: "tokens", anchor: "tokens-hierarchy" },
  },
  {
    n: "03",
    title: { en: "Change once, update everywhere", pt: "Mude uma vez, atualize em todo lugar" },
    statement: { en: "The system is built to evolve without rework.", pt: "O sistema foi feito para evoluir sem retrabalho." },
    practice: [
      { en: "A rebrand means changing a single token", pt: "Um rebrand significa mudar um único token" },
      { en: "No find-and-replace, nothing forgotten", pt: "Sem buscar e substituir, sem nada esquecido" },
    ],
    linkLabel: { en: "Design Tokens › What are tokens", pt: "Design Tokens › O que são tokens" },
    target: { page: "tokens", anchor: "tokens-intro" },
  },
  {
    n: "04",
    title: { en: "Every theme by default", pt: "Todos os temas por padrão" },
    statement: { en: "Light and dark are not versions of a screen — they are the same screen with different values.", pt: "Claro e escuro não são versões de uma tela — são a mesma tela com valores diferentes." },
    practice: [
      { en: "Every component must work in light and dark mode automatically", pt: "Todo componente deve funcionar automaticamente nos modos claro e escuro" },
      { en: "New themes are new sets of values for the same token names", pt: "Novos temas são novos conjuntos de valores para os mesmos nomes de token" },
    ],
    linkLabel: { en: "Light Mode", pt: "Modo claro" },
    target: { page: "colors", anchor: "colors-tokens" },
  },
  {
    n: "05",
    title: { en: "Brand with consistency", pt: "Marca com consistência" },
    statement: { en: "The identity is applied the same way at every touchpoint.", pt: "A identidade é aplicada do mesmo jeito em todos os pontos de contato." },
    practice: [
      { en: "Use only the institutional palette", pt: "Use apenas a paleta institucional" },
      { en: "Never distort, recolor or alter brand elements — always respect the clear space", pt: "Nunca distorça, recolora ou altere elementos da marca — respeite sempre a área de respiro" },
    ],
    linkLabel: { en: "Brand Identity", pt: "Identidade de Marca" },
    target: { page: "brand", anchor: "brand-rules" },
  },
  {
    n: "06",
    title: { en: "Adapt to the space", pt: "Adapte-se ao espaço" },
    statement: { en: "Elements adapt to the context, always in the most complete form the space allows.", pt: "Os elementos se adaptam ao contexto, sempre na forma mais completa que o espaço permite." },
    practice: [
      { en: "Desktop gets the full horizontal logo, mobile gets the standalone symbol", pt: "O desktop usa o logo horizontal completo; o mobile usa só o símbolo" },
      { en: "Respect minimum sizes — never use the symbol below 16 px in digital", pt: "Respeite os tamanhos mínimos — nunca use o símbolo abaixo de 16 px no digital" },
    ],
    linkLabel: { en: "Brand Identity", pt: "Identidade de Marca" },
    target: { page: "brand", anchor: "brand-responsive" },
  },
  {
    n: "07",
    title: { en: "AI accelerates, people decide", pt: "A IA acelera, as pessoas decidem" },
    statement: { en: "AI speeds up the work, but the system's rules still apply.", pt: "A IA acelera o trabalho, mas as regras do sistema continuam valendo." },
    practice: [
      { en: "Give AI the allowed tokens as context", pt: "Passe à IA os tokens permitidos como contexto" },
      { en: "Always review generated code and replace literal colors with tokens", pt: "Sempre revise o código gerado e troque cores literais por tokens" },
    ],
    linkLabel: { en: "Design Tokens › AI and tokens", pt: "Design Tokens › IA e tokens" },
    target: { page: "tokens", anchor: "tokens-ia" },
  },
];

const anchorId = (p: PrincipleItem) => `principle-${p.n}`;

function PrincipleCard({ p, onGo }: { p: PrincipleItem; onGo: (t: Target) => void }) {
  const { t, bi } = useI18n();
  return (
    <article className="flex flex-col h-full bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-6">
      <h3 className={`${display} text-[1.25rem] font-semibold tracking-[-0.015em] leading-tight text-foreground mb-2`}>
        {bi(p.title)}
      </h3>
      <p className="text-[0.9375rem] leading-relaxed text-foreground mb-5">{bi(p.statement)}</p>

      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
        {t("In practice", "Na prática")}
      </p>
      <ul className="space-y-2 mb-6">
        {p.practice.map(item => (
          <li key={item.en} className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-[0.5em] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>{bi(item)}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onGo(p.target)}
        className="group mt-auto self-start inline-flex items-center gap-1.5 rounded-[6px] text-[0.8125rem] font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>
          {t("Learn more", "Saiba mais")}
          <span className="sr-only"> {t("about", "sobre")} {bi(p.linkLabel)}</span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
      </button>
    </article>
  );
}

export function PrinciplesShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);
  const { t } = useI18n();

  return (
    <div className="space-y-10 min-w-0">
      <PageHeader
        eyebrow={t("Start", "Início")}
        title={t("Design Principles", "Princípios de Design")}
        description={t("The decisions behind every screen, token and component in this system.", "As decisões por trás de cada tela, token e componente deste sistema.")}
      />

      <section>
        <SectionLabel>{t("Principles", "Princípios")}</SectionLabel>
        <ol className="relative list-none p-0 m-0">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[1.125rem] md:left-1/2 w-px -translate-x-1/2 bg-border"
          />
          {principles.map((p, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={p.n}
                id={anchorId(p)}
                className="relative scroll-mt-32 pl-14 pb-8 last:pb-0 md:pl-0 md:grid md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:items-start"
              >
                <span
                  aria-hidden
                  className={`${display} absolute left-0 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-background text-[0.8125rem] font-semibold tabular-nums text-primary md:static md:col-start-2 md:row-start-1 md:mt-5 md:justify-self-center`}
                >
                  {p.n}
                </span>
                <div
                  className={`md:row-start-1 ${
                    left ? "md:col-start-1 md:pr-3" : "md:col-start-3 md:pl-3"
                  }`}
                >
                  <PrincipleCard p={p} onGo={go} />
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <p className="text-[0.75rem] text-muted-foreground uppercase tracking-[0.08em] pt-2">
        {t("Version", "Versão")} 1.0 · 2024
      </p>
    </div>
  );
}
