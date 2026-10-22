import { ArrowRight } from "lucide-react";
import { PageHeader, SectionLabel, useGo, type Navigate, type Target } from "./GetStartedShowcase";

const display = "font-[family-name:var(--font-display)]";

type PrincipleItem = {
  n: string;
  title: string;
  statement: string;
  practice: string[];
  linkLabel: string;
  target: Target;
};

const principles: PrincipleItem[] = [
  {
    n: "01",
    title: "One name, everywhere",
    statement: "Every visual decision has a name, and that name is the same in Figma and in code.",
    practice: [
      "Primary in Figma = --primary in CSS = bg-primary in Tailwind",
      "Names describe intent (Primary, Background, Muted), never appearance (BrandRed, LightBackground)",
    ],
    linkLabel: "Design Tokens › Design ↔ Dev Mapping",
    target: { page: "tokens", anchor: "tokens-bridge" },
  },
  {
    n: "02",
    title: "Intent over values",
    statement: "Components use decisions, never raw values.",
    practice: [
      "Components reference semantic tokens, never primitives or hex",
      "If a token doesn't exist, create it first — never approximate",
    ],
    linkLabel: "Design Tokens › The three layers",
    target: { page: "tokens", anchor: "tokens-hierarchy" },
  },
  {
    n: "03",
    title: "Change once, update everywhere",
    statement: "The system is built to evolve without rework.",
    practice: [
      "A rebrand means changing a single token",
      "No find-and-replace, nothing forgotten",
    ],
    linkLabel: "Design Tokens › What are tokens",
    target: { page: "tokens", anchor: "tokens-intro" },
  },
  {
    n: "04",
    title: "Every theme by default",
    statement: "Light and dark are not versions of a screen — they are the same screen with different values.",
    practice: [
      "Every component must work in light and dark mode automatically",
      "New themes are new sets of values for the same token names",
    ],
    linkLabel: "Light Mode",
    target: { page: "colors", anchor: "colors-tokens" },
  },
  {
    n: "05",
    title: "Brand with consistency",
    statement: "The identity is applied the same way at every touchpoint.",
    practice: [
      "Use only the institutional palette",
      "Never distort, recolor or alter brand elements — always respect the clear space",
    ],
    linkLabel: "Brand Identity",
    target: { page: "brand", anchor: "brand-rules" },
  },
  {
    n: "06",
    title: "Adapt to the space",
    statement: "Elements adapt to the context, always in the most complete form the space allows.",
    practice: [
      "Desktop gets the full horizontal logo, mobile gets the standalone symbol",
      "Respect minimum sizes — never use the symbol below 16 px in digital",
    ],
    linkLabel: "Brand Identity",
    target: { page: "brand", anchor: "brand-responsive" },
  },
  {
    n: "07",
    title: "AI accelerates, people decide",
    statement: "AI speeds up the work, but the system's rules still apply.",
    practice: [
      "Give AI the allowed tokens as context",
      "Always review generated code and replace literal colors with tokens",
    ],
    linkLabel: "Design Tokens › AI and tokens",
    target: { page: "tokens", anchor: "tokens-ia" },
  },
];

const anchorId = (p: PrincipleItem) => `principle-${p.n}`;

function PrincipleCard({ p, onGo }: { p: PrincipleItem; onGo: (t: Target) => void }) {
  return (
    <article className="flex flex-col h-full bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] p-6">
      <h3 className={`${display} text-[1.25rem] font-semibold tracking-[-0.015em] leading-tight text-foreground mb-2`}>
        {p.title}
      </h3>
      <p className="text-[0.9375rem] leading-relaxed text-foreground mb-5">{p.statement}</p>

      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
        In practice
      </p>
      <ul className="space-y-2 mb-6">
        {p.practice.map(item => (
          <li key={item} className="flex items-start gap-2.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            <span aria-hidden className="mt-[0.5em] h-1 w-1 rounded-full bg-primary shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onGo(p.target)}
        className="group mt-auto self-start inline-flex items-center gap-1.5 rounded-[6px] text-[0.8125rem] font-semibold text-primary hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span>
          Learn more
          <span className="sr-only"> about {p.linkLabel}</span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden />
      </button>
    </article>
  );
}

export function PrinciplesShowcase({ onNavigate }: { onNavigate: Navigate }) {
  const go = useGo(onNavigate);

  return (
    <div className="space-y-10 min-w-0">
      <PageHeader
        eyebrow="Start"
        title="Design Principles"
        description="The decisions behind every screen, token and component in this system."
      />

      <section>
        <SectionLabel>Principles</SectionLabel>
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
        Version 1.0 · 2024
      </p>
    </div>
  );
}
