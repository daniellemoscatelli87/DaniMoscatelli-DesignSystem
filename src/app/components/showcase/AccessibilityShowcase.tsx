import React, { useId, useMemo, useRef, useState } from "react";
import {
  Eye, Keyboard, Brain, Cpu, Check, X, AlertCircle,
} from "lucide-react";
import { PageHeader, PageSection } from "./GetStartedShowcase";
import { useI18n } from "../../i18n";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, SubTitle, display } from "./shared/Guidance";

type Bi = { en: string; pt: string };

/* ── WCAG contrast math ── */
function channel(v: number) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}
function luminance(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return null;
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}
function ratio(fg: string, bg: string) {
  const a = luminance(fg);
  const b = luminance(bg);
  if (a === null || b === null) return null;
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

function Result({ ok, label }: { ok: boolean; label: string }) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex items-center gap-1 text-[0.75rem] font-medium whitespace-nowrap ${ok ? "text-foreground" : "text-muted-foreground"}`}>
      {ok ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
      {label}: {ok ? t("Pass", "Aprovado") : t("Fail", "Reprovado")}
    </span>
  );
}

type Pair = { name: string; usage: Bi; fg: string; bg: string };

const lightPairs: Pair[] = [
  { name: "foreground / background", usage: { en: "Body text on page", pt: "Texto do corpo na página" }, fg: "#131A27", bg: "#EDF0F5" },
  { name: "card-foreground / card", usage: { en: "Text in cards", pt: "Texto em cards" }, fg: "#131A27", bg: "#FFFFFF" },
  { name: "muted-foreground / card", usage: { en: "Secondary text", pt: "Texto secundário" }, fg: "#627288", bg: "#FFFFFF" },
  { name: "muted-foreground / background", usage: { en: "Captions on page", pt: "Legendas na página" }, fg: "#627288", bg: "#EDF0F5" },
  { name: "primary-foreground / primary", usage: { en: "Label on primary button", pt: "Rótulo no botão primário" }, fg: "#FFFFFF", bg: "#D44D4D" },
  { name: "primary / card", usage: { en: "Primary as text or icon", pt: "Primário como texto ou ícone" }, fg: "#D44D4D", bg: "#FFFFFF" },
  { name: "crimson-500 / card", usage: { en: "Small primary text", pt: "Texto primário pequeno" }, fg: "#B82828", bg: "#FFFFFF" },
  { name: "success / card", usage: { en: "Status color alone", pt: "Cor de status isolada" }, fg: "#4FB57B", bg: "#FFFFFF" },
];
const darkPairs: Pair[] = [
  { name: "foreground / background", usage: { en: "Body text on page", pt: "Texto do corpo na página" }, fg: "#E4E9F0", bg: "#0D1119" },
  { name: "muted-foreground / background", usage: { en: "Secondary text", pt: "Texto secundário" }, fg: "#8898B0", bg: "#0D1119" },
  { name: "primary-foreground / primary", usage: { en: "Label on primary button", pt: "Rótulo no botão primário" }, fg: "#FFFFFF", bg: "#D44D4D" },
  { name: "primary / background", usage: { en: "Primary as text or icon", pt: "Primário como texto ou ícone" }, fg: "#D44D4D", bg: "#0D1119" },
  { name: "crimson-300 / background", usage: { en: "Primary muted text", pt: "Texto primário suave" }, fg: "#E88080", bg: "#0D1119" },
  { name: "success / background", usage: { en: "Status color alone", pt: "Cor de status isolada" }, fg: "#22C55E", bg: "#0D1119" },
];

function ContrastTable() {
  const { t, bi } = useI18n();
  const [mode, setMode] = useState<"light" | "dark">("light");
  const pairs = mode === "light" ? lightPairs : darkPairs;
  return (
    <div className="space-y-3">
      <div role="group" aria-label={t("Theme", "Tema")} className="inline-flex p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
        {(["light", "dark"] as const).map(m => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={`h-8 px-3 rounded-[8px] text-[0.75rem] font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              mode === m ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "light" ? t("light mode", "modo claro") : t("dark mode", "modo escuro")}
          </button>
        ))}
      </div>
      <Panel className="overflow-hidden">
        <ul>
          {pairs.map(p => {
            const r = ratio(p.fg, p.bg)!;
            return (
              <li key={p.name} className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 px-4 py-3 border-b border-border last:border-0">
                <span
                  className="h-10 w-24 rounded-[8px] border border-border flex items-center justify-center text-[0.9375rem] font-semibold"
                  style={{ color: p.fg, background: p.bg }}
                  aria-hidden
                >
                  Aa 12
                </span>
                <div className="min-w-0">
                  <p className="text-[0.8125rem] font-medium text-foreground">{p.name}</p>
                  <p className="text-[0.75rem] text-muted-foreground">
                    {bi(p.usage)} · <span className="font-[family-name:var(--font-mono)]">{p.fg} {t("on", "sobre")} {p.bg}</span>
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-col md:items-end gap-x-4 gap-y-0.5">
                  <span className={`${display} text-[1.125rem] font-semibold text-foreground tabular-nums`}>{r.toFixed(2)}:1</span>
                  <Result ok={r >= 4.5} label={t("Text AA", "Texto AA")} />
                  <Result ok={r >= 3} label={t("UI / large", "UI / grande")} />
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function ContrastChecker() {
  const { t } = useI18n();
  const [fg, setFg] = useState("#627288");
  const [bg, setBg] = useState("#FFFFFF");
  const r = ratio(fg, bg);
  const idFg = useId();
  const idBg = useId();
  const field = (id: string, label: string, v: string, set: (s: string) => void) => (
    <div>
      <label htmlFor={id} className="block text-[0.75rem] font-medium text-foreground mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={t(`${label} color picker`, `Seletor de cor: ${label}`)}
          value={luminance(v) === null ? "#000000" : v.length === 4 ? "#" + v.slice(1).split("").map(c => c + c).join("") : v}
          onChange={e => set(e.target.value.toUpperCase())}
          className="h-9 w-9 rounded-[8px] border border-border bg-transparent p-0.5 cursor-pointer"
        />
        <input
          id={id}
          value={v}
          onChange={e => set(e.target.value.startsWith("#") ? e.target.value : "#" + e.target.value)}
          maxLength={7}
          spellCheck={false}
          aria-invalid={luminance(v) === null}
          className="h-9 w-28 rounded-[8px] border border-border bg-[var(--input-background)] px-3 text-[0.8125rem] font-[family-name:var(--font-mono)] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
  return (
    <Panel className="p-5 grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-6">
      <div className="space-y-4">
        {field(idFg, t("Text color", "Cor do texto"), fg, setFg)}
        {field(idBg, t("Background color", "Cor de fundo"), bg, setBg)}
        <p className="text-[0.75rem] text-muted-foreground">{t("Paste any hex value from the token table.", "Cole qualquer valor hex da tabela de tokens.")}</p>
      </div>
      <div className="space-y-3">
        <div
          className="rounded-[var(--radius)] border border-border p-5"
          style={{ color: luminance(fg) === null ? "#000" : fg, background: luminance(bg) === null ? "#fff" : bg }}
        >
          <p className="text-[1.5rem] font-semibold leading-tight">{t("Large text, 24px", "Texto grande, 24px")}</p>
          <p className="text-[0.875rem] mt-1">{t("Body text at 14px must reach 4.5:1.", "Texto de corpo em 14px deve atingir 4,5:1.")}</p>
        </div>
        <div aria-live="polite" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {r === null ? (
            <span className="text-[0.8125rem] text-muted-foreground">{t("Enter a valid 6-digit hex value.", "Informe um valor hex válido de 6 dígitos.")}</span>
          ) : (
            <>
              <span className={`${display} text-[1.5rem] font-semibold text-foreground tabular-nums`}>{r.toFixed(2)}:1</span>
              <Result ok={r >= 4.5} label={t("Text AA", "Texto AA")} />
              <Result ok={r >= 3} label={t("Large / UI", "Grande / UI")} />
              <Result ok={r >= 7} label="AAA" />
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ── Focus ── */
function FocusDemo() {
  const { t, lang } = useI18n();
  return (
    <Panel className="p-5">
      <p className="text-[0.8125rem] text-muted-foreground mb-4">
        {t("Press", "Pressione")} <kbd className="px-1.5 py-0.5 rounded-[4px] border border-border bg-muted text-[0.6875rem] font-medium text-foreground">Tab</kbd> {t("to move through these controls and watch the ring.", "para percorrer estes controles e observar o anel de foco.")}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          {t("Primary", "Primário")}
        </button>
        <button className="h-10 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.875rem] font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          {t("Secondary", "Secundário")}
        </button>
        <a href="#a11y-focus" onClick={e => e.preventDefault()} className="text-[0.875rem] font-medium text-primary underline underline-offset-4 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {t("Text link", "Link de texto")}
        </a>
        <input
          aria-label={t("Sample input", "Campo de exemplo")}
          placeholder={t("Input", "Campo")}
          className="h-10 w-36 rounded-[10px] border border-border bg-[var(--input-background)] px-3 text-[0.875rem] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
        />
      </div>
    </Panel>
  );
}

/* ── Keyboard: roving tablist ── */
function TabsDemo() {
  const { t, bi } = useI18n();
  const tabs: Bi[] = [{ en: "Overview", pt: "Visão geral" }, { en: "Tokens", pt: "Tokens" }, { en: "Components", pt: "Componentes" }];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();
  const move = (i: number) => {
    const n = (i + tabs.length) % tabs.length;
    setActive(n);
    refs.current[n]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key === "ArrowRight") { e.preventDefault(); move(i + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(i - 1); }
    else if (e.key === "Home") { e.preventDefault(); move(0); }
    else if (e.key === "End") { e.preventDefault(); move(tabs.length - 1); }
  };
  return (
    <Panel className="p-5">
      <div role="tablist" aria-label={t("Sample tabs", "Abas de exemplo")} className="inline-flex gap-1 p-0.5 rounded-[10px] bg-muted border border-border">
        {tabs.map((tab, i) => (
          <button
            key={tab.en}
            ref={el => { refs.current[i] = el; }}
            role="tab"
            id={`${base}-t${i}`}
            aria-selected={active === i}
            aria-controls={`${base}-p${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={e => onKey(e, i)}
            className={`h-8 px-3 rounded-[8px] text-[0.8125rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              active === i ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {bi(tab)}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-p${active}`} aria-labelledby={`${base}-t${active}`} tabIndex={0} className="mt-4 text-[0.8125rem] text-muted-foreground rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {t("Panel for", "Painel de")} <span className="text-foreground font-medium">{bi(tabs[active])}</span>. {t("Only the active tab is in the Tab order; arrows, Home and End move between tabs.", "Apenas a aba ativa entra na ordem do Tab; setas, Home e End alternam entre as abas.")}
      </div>
    </Panel>
  );
}

const keyboardRows = (t: (en: string, pt: string) => string): React.ReactNode[][] => [
  ["Button, Link", <><Mono>Enter</Mono> <Mono>Space</Mono></>, t("Buttons activate on both. Links activate on Enter only.", "Botões ativam com ambas. Links ativam apenas com Enter.")],
  [t("Tabs", "Abas"), <><Mono>←</Mono> <Mono>→</Mono> <Mono>Home</Mono> <Mono>End</Mono></>, t("One tab stop for the list; arrows change tabs.", "Uma única parada de tab para a lista; as setas trocam de aba.")],
  [t("Dialog", "Diálogo"), <><Mono>Esc</Mono> <Mono>Tab</Mono></>, t("Focus is trapped inside, Esc closes, focus returns to the trigger.", "O foco fica preso dentro, Esc fecha e o foco volta ao gatilho.")],
  [t("Dropdown menu", "Menu dropdown"), <><Mono>↑</Mono> <Mono>↓</Mono> <Mono>Enter</Mono> <Mono>Esc</Mono></>, t("Opens on Enter or ↓. Typing a letter jumps to a matching item.", "Abre com Enter ou ↓. Digitar uma letra salta para um item correspondente.")],
  ["Accordion", <><Mono>Enter</Mono> <Mono>Space</Mono> <Mono>↑</Mono> <Mono>↓</Mono></>, t("Header buttons toggle panels; arrows move between headers.", "Os botões de cabeçalho alternam os painéis; as setas movem entre cabeçalhos.")],
  ["Tooltip", <><Mono>Tab</Mono> <Mono>Esc</Mono></>, t("Shows on focus as well as hover, and Esc dismisses it.", "Aparece no foco e no hover, e Esc o dispensa.")],
];

/* ── Forms ── */
function FormDemo() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const id = useId();
  const error = !email ? t("Enter your email address.", "Informe seu endereço de e-mail.") : !/^\S+@\S+\.\S+$/.test(email) ? t("Use the format name@company.com.", "Use o formato nome@empresa.com.") : "";
  const show = touched && !!error;
  return (
    <Panel className="p-5">
      <form
        noValidate
        onSubmit={e => { e.preventDefault(); setTouched(true); if (!error) setSent(true); }}
        className="max-w-sm space-y-3"
      >
        <div>
          <label htmlFor={id} className="block text-[0.8125rem] font-medium text-foreground mb-1.5">
            {t("Work email", "E-mail corporativo")} <span className="text-muted-foreground font-normal">{t("(required)", "(obrigatório)")}</span>
          </label>
          <input
            id={id}
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setSent(false); }}
            onBlur={() => setTouched(true)}
            aria-required="true"
            aria-invalid={show}
            aria-describedby={`${id}-hint ${show ? `${id}-err` : ""}`.trim()}
            className={`h-10 w-full rounded-[10px] border bg-[var(--input-background)] px-3 text-[0.875rem] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              show ? "border-[var(--error)]" : "border-border focus-visible:border-primary"
            }`}
          />
          <p id={`${id}-hint`} className="mt-1.5 text-[0.75rem] text-muted-foreground">{t("We only use it to send the invite.", "Usamos apenas para enviar o convite.")}</p>
          <p id={`${id}-err`} role={show ? "alert" : undefined} className="mt-1.5 text-[0.75rem] font-medium text-foreground flex items-center gap-1.5 min-h-[1rem]">
            {show && (<><AlertCircle className="h-3.5 w-3.5 text-[var(--error)] shrink-0" aria-hidden />{error}</>)}
          </p>
        </div>
        <button type="submit" className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          {t("Send invite", "Enviar convite")}
        </button>
        <p role="status" className="text-[0.8125rem] text-foreground min-h-[1.25rem]">{sent ? t("Invite sent to ", "Convite enviado para ") + email : ""}</p>
      </form>
    </Panel>
  );
}

const formCode = `<label for="email">Work email (required)</label>
<input
  id="email" type="email" autocomplete="email"
  aria-required="true"
  aria-invalid="true"
  aria-describedby="email-hint email-err" />
<p id="email-hint">{t("We only use it to send the invite.", "Usamos apenas para enviar o convite.")}</p>
<p id="email-err" role="alert">Use the format name@company.com.</p>`;

const iconButtonCode = `// Icon-only controls need a name
<button aria-label="Close dialog"><X aria-hidden /></button>

// Decorative icons are hidden from screen readers
<Check aria-hidden className="h-4 w-4" /> Saved`;

/* ── Motion ── */
function MotionDemo() {
  const { t } = useI18n();
  const [reduced, setReduced] = useState(false);
  return (
    <Panel className="p-5">
      <style>{`
        @keyframes a11y-float { 0%,100% { transform: translateX(0); } 50% { transform: translateX(calc(100% * 3.2)); } }
        .a11y-mover { animation: a11y-float 2.4s ease-in-out infinite; }
        .a11y-reduced .a11y-mover { animation: none; }
        @media (prefers-reduced-motion: reduce) { .a11y-mover { animation: none; } }
      `}</style>
      <label className="inline-flex items-center gap-2.5 text-[0.8125rem] font-medium text-foreground cursor-pointer mb-4">
        <input
          type="checkbox"
          checked={reduced}
          onChange={e => setReduced(e.target.checked)}
          className="h-4 w-4 accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {t("Simulate “Reduce motion” OS setting", "Simular a configuração “Reduzir movimento” do sistema")}
      </label>
      <div className={`${reduced ? "a11y-reduced" : ""} rounded-[10px] border border-border bg-muted/50 p-3`}>
        <div className="w-1/5">
          <div className="a11y-mover h-8 rounded-[8px] bg-primary" />
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] text-muted-foreground">
        {reduced ? t("Motion removed. State is still communicated by position and label.", "Movimento removido. O estado ainda é comunicado pela posição e pelo rótulo.") : t("Decorative motion is running. It stops automatically when the OS asks for less motion.", "O movimento decorativo está ativo. Ele para automaticamente quando o sistema pede menos movimento.")}
      </p>
    </Panel>
  );
}

const motionCode = `@media (prefers-reduced-motion: reduce) {
  .ds-shimmer { animation: none; }
  * { scroll-behavior: auto !important; }
}`;

/* ── Checklist ── */
const checklistItems: Bi[] = [
  { en: "Text and icons meet contrast on every surface in light and dark mode", pt: "Texto e ícones atendem ao contraste em todas as superfícies, nos modos claro e escuro" },
  { en: "Every interactive element is reachable and operable with the keyboard alone", pt: "Todo elemento interativo é alcançável e operável apenas com o teclado" },
  { en: "Focus is always visible and never hidden behind sticky headers", pt: "O foco está sempre visível e nunca escondido atrás de cabeçalhos fixos" },
  { en: "Each input has a visible label, not just a placeholder", pt: "Cada campo tem um rótulo visível, não apenas um placeholder" },
  { en: "Errors name the field, say how to fix it and do not rely on color", pt: "Os erros nomeiam o campo, dizem como corrigir e não dependem de cor" },
  { en: "Icon-only buttons have an accessible name", pt: "Botões somente com ícone têm um nome acessível" },
  { en: "Headings follow a logical order and page landmarks are present", pt: "Os títulos seguem uma ordem lógica e há landmarks na página" },
  { en: "Animations respect prefers-reduced-motion and nothing flashes", pt: "As animações respeitam prefers-reduced-motion e nada pisca" },
  { en: "Touch targets are at least 24px, and 44px for primary actions", pt: "Alvos de toque têm pelo menos 24px, e 44px para ações primárias" },
  { en: "Layout works at 200% zoom and 320px width without horizontal scroll", pt: "O layout funciona com zoom de 200% e largura de 320px sem rolagem horizontal" },
];

function Checklist() {
  const { t, bi } = useI18n();
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const pct = Math.round((count / checklistItems.length) * 100);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[0.8125rem] font-medium text-foreground" aria-live="polite">{count} {t("of", "de")} {checklistItems.length} {t("checked", "marcados")}</p>
        <div className="flex items-center gap-3 flex-1 max-w-[220px]">
          <div role="progressbar" aria-label={t("Checklist progress", "Progresso do checklist")} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[0.75rem] tabular-nums text-muted-foreground w-9 text-right">{pct}%</span>
        </div>
      </div>
      <ul className="space-y-1">
        {checklistItems.map((item, i) => (
          <li key={item.en}>
            <label className="flex items-start gap-3 rounded-[8px] px-2 py-2 cursor-pointer hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={!!done[i]}
                onChange={e => setDone(d => ({ ...d, [i]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span className={`text-[0.8125rem] leading-relaxed ${done[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>{bi(item)}</span>
            </label>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function AccessibilityShowcase() {
  const { t } = useI18n();
  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow={t("Guidelines", "Diretrizes")}
        title={t("Accessibility", "Acessibilidade")}
        description={t("The system targets WCAG 2.2 level AA. These patterns are built in to every component, so what you generate with AI tools inherits them as long as you keep using the tokens.", "O sistema segue o nível AA da WCAG 2.2. Esses padrões já vêm embutidos em cada componente, então o que você gera com ferramentas de IA herda tudo isso desde que continue usando os tokens.")}
      />

      <PageSection
        id="a11y-principles"
        label={t("Principles", "Princípios")}
        title={t("Four principles, applied", "Quatro princípios, na prática")}
        intro={<p>{t("WCAG groups requirements under four principles. Each maps to concrete decisions in the system.", "A WCAG agrupa os requisitos em quatro princípios. Cada um se traduz em decisões concretas no sistema.")}</p>}
      >
        <PrincipleGrid
          cols="lg:grid-cols-4"
          items={[
            { icon: Eye, title: t("Perceivable", "Perceptível"), desc: t("Contrast-checked color pairs, text alternatives and status that never depends on color alone.", "Pares de cores com contraste verificado, alternativas em texto e status que nunca depende só da cor.") },
            { icon: Keyboard, title: t("Operable", "Operável"), desc: t("Everything works from the keyboard, with a visible focus ring and generous targets.", "Tudo funciona pelo teclado, com anel de foco visível e alvos generosos.") },
            { icon: Brain, title: t("Understandable", "Compreensível"), desc: t("Visible labels, predictable navigation and errors that explain how to recover.", "Rótulos visíveis, navegação previsível e erros que explicam como se recuperar.") },
            { icon: Cpu, title: t("Robust", "Robusto"), desc: t("Radix UI primitives and native HTML give assistive tech the right roles and states.", "Primitivos do Radix UI e HTML nativo dão à tecnologia assistiva os papéis e estados corretos.") },
          ]}
        />
      </PageSection>

      <PageSection
        id="a11y-contrast"
        label={t("Color", "Cor")}
        title={t("Contrast", "Contraste")}
        intro={
          <>
            <p>{t("Normal text needs", "Texto normal precisa de")} <strong className="text-foreground">4.5:1</strong>. {t("Large text (24px, or 19px bold) and UI boundaries or icons need", "Texto grande (24px, ou 19px em negrito) e bordas de UI ou ícones precisam de")} <strong className="text-foreground">3:1</strong>. {t("Ratios below are computed live from the actual token values.", "As razões abaixo são calculadas em tempo real a partir dos valores reais dos tokens.")}</p>
          </>
        }
      >
        <div className="space-y-5">
          <ContrastTable />
          <Callout title={t("What this tells us", "O que isso nos diz")}>
            <p>
              <Mono>primary</Mono> {t("reaches the 3:1 needed for large text, icons and button fills, but not 4.5:1 for small text on white.", "atinge os 3:1 necessários para texto grande, ícones e preenchimentos de botão, mas não os 4,5:1 para texto pequeno sobre branco.")}{" "}
              {t("For small primary-colored text use", "Para texto pequeno na cor primária, use")} <Mono>crimson-500</Mono> {t("in light mode. Status colors like", "no modo claro. Cores de status como")} <Mono>success</Mono> {t("must always be paired with an icon and a text label.", "devem sempre ser acompanhadas de um ícone e de um rótulo de texto.")}
            </p>
          </Callout>
          <SubTitle>{t("Check any pair", "Verifique qualquer par")}</SubTitle>
          <ContrastChecker />
        </div>
      </PageSection>

      <PageSection
        id="a11y-focus"
        label={t("Keyboard", "Teclado")}
        title={t("Focus", "Foco")}
        intro={<p>{t("Every interactive element shows a 2px ring using", "Todo elemento interativo mostra um anel de 2px usando")} <Mono>--ring</Mono> {t("on", "em")} <Mono>:focus-visible</Mono>{t(", so mouse users are not distracted while keyboard users never lose their place.", ", assim usuários de mouse não se distraem e usuários de teclado nunca perdem a posição.")}</p>}
      >
        <div className="space-y-5">
          <FocusDemo />
          <DataTable
            head={[t("Rule", "Regra"), t("Class", "Classe")]}
            rows={[
              [t("Ring", "Anel"), <Mono>focus-visible:ring-2 focus-visible:ring-ring</Mono>],
              [t("Offset on filled controls", "Offset em controles preenchidos"), <Mono>focus-visible:ring-offset-2 focus-visible:ring-offset-background</Mono>],
              [t("Remove native outline only when a ring replaces it", "Remova o outline nativo apenas quando um anel o substituir"), <Mono>focus-visible:outline-none</Mono>],
              [t("Anchor targets clear the sticky header", "Alvos de âncora ficam livres do cabeçalho fixo"), <Mono>scroll-mt-32</Mono>],
            ]}
          />
          <DoDont
            dos={[t("Keep the ring on every control, including custom ones", "Mantenha o anel em todos os controles, inclusive nos customizados"), t("Make sure the ring has 3:1 against its neighbors", "Garanta que o anel tenha 3:1 de contraste com o entorno"), t("Move focus into dialogs and back to the trigger on close", "Mova o foco para dentro dos diálogos e de volta ao gatilho ao fechar")]}
            donts={[t("Never use outline: none without a replacement", "Nunca use outline: none sem um substituto"), t("Don't use :focus for rings, it fires on mouse clicks", "Não use :focus para anéis, ele dispara em cliques do mouse"), t("Don't build div buttons, use button or a Radix primitive", "Não crie botões com div, use button ou um primitivo do Radix")]}
          />
        </div>
      </PageSection>

      <PageSection
        id="a11y-keyboard"
        label={t("Keyboard", "Teclado")}
        title={t("Keyboard interaction", "Interação por teclado")}
        intro={<p>{t("Radix UI primitives implement the WAI-ARIA authoring patterns. When you build something custom, follow the same keys.", "Os primitivos do Radix UI implementam os padrões de autoria WAI-ARIA. Ao criar algo customizado, siga as mesmas teclas.")}</p>}
      >
        <div className="space-y-5">
          <TabsDemo />
          <DataTable head={[t("Component", "Componente"), t("Keys", "Teclas"), t("Behavior", "Comportamento")]} rows={keyboardRows(t)} />
        </div>
      </PageSection>

      <PageSection
        id="a11y-forms"
        label={t("Semantics", "Semântica")}
        title={t("Forms and labels", "Formulários e rótulos")}
        intro={<p>{t("Every field has a visible label tied to the input, hints and errors are linked with", "Todo campo tem um rótulo visível associado ao input, dicas e erros são ligados com")} <Mono>aria-describedby</Mono>{t(", and errors are announced. Try it: leave the field, then enter a bad address.", ", e os erros são anunciados. Experimente: saia do campo e depois digite um endereço inválido.")}</p>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FormDemo />
          <div className="space-y-4 min-w-0">
            <Panel className="overflow-hidden">
              <pre className="px-4 py-4 text-[0.75rem] leading-relaxed font-[family-name:var(--font-mono)] text-foreground overflow-x-auto"><code>{formCode}</code></pre>
            </Panel>
            <Panel className="overflow-hidden">
              <pre className="px-4 py-4 text-[0.75rem] leading-relaxed font-[family-name:var(--font-mono)] text-foreground overflow-x-auto"><code>{iconButtonCode}</code></pre>
            </Panel>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="a11y-structure"
        label={t("Semantics", "Semântica")}
        title={t("Structure and ARIA", "Estrutura e ARIA")}
        intro={<p>{t("Native HTML first. Reach for ARIA only when no element does the job, because bad ARIA is worse than none.", "HTML nativo primeiro. Recorra ao ARIA só quando nenhum elemento resolver, porque ARIA mal usado é pior do que nenhum.")}</p>}
      >
        <div className="space-y-5">
          <DataTable
            head={[t("Need", "Necessidade"), t("Use", "Use"), t("Avoid", "Evite")]}
            rows={[
              [t("Page regions", "Regiões da página"), <><Mono>header</Mono> <Mono>nav</Mono> <Mono>main</Mono> <Mono>footer</Mono></>, t("Anonymous div wrappers", "Wrappers de div anônimos")],
              [t("Headings", "Títulos"), t("One h1, then h2 to h3 without skipping levels", "Um h1, depois h2 a h3 sem pular níveis"), t("Choosing a level for its size", "Escolher o nível pelo tamanho")],
              [t("Action vs navigation", "Ação vs navegação"), <><Mono>button</Mono> {t("for actions,", "para ações,")} <Mono>a</Mono> {t("for navigation", "para navegação")}</>, t("Clickable spans", "Spans clicáveis")],
              [t("Live updates", "Atualizações dinâmicas"), <><Mono>role=&quot;status&quot;</Mono> {t("polite,", "educado,")} <Mono>role=&quot;alert&quot;</Mono> {t("urgent", "urgente")}</>, t("Toasts that vanish without announcement", "Toasts que somem sem anúncio")],
              [t("Toggle state", "Estado de alternância"), <><Mono>aria-pressed</Mono>, <Mono>aria-expanded</Mono>, <Mono>aria-selected</Mono></>, t("State shown only by color", "Estado indicado apenas por cor")],
              [t("Images", "Imagens"), <>{t("Meaningful", "Um")} <Mono>alt</Mono> {t("text, or", "significativo, ou")} <Mono>alt=&quot;&quot;</Mono> {t("when decorative", "quando decorativa")}</>, t("Filename or “image of” as alt", "Nome do arquivo ou “imagem de” como alt")],
            ]}
          />
          <Callout title={t("Skip link", "Skip link")}>
            <p>{t("Add a visually hidden “Skip to content” link as the first focusable element so keyboard users can bypass the sidebar on every page.", "Adicione um link “Pular para o conteúdo” visualmente oculto como primeiro elemento focável, para que usuários de teclado contornem a barra lateral em todas as páginas.")}</p>
          </Callout>
        </div>
      </PageSection>

      <PageSection
        id="a11y-motion"
        label={t("Motion", "Movimento")}
        title={t("Motion and preferences", "Movimento e preferências")}
        intro={<p>{t("Honor", "Respeite")} <Mono>prefers-reduced-motion</Mono>. {t("Keep essential feedback, drop decoration such as shimmer, parallax and looping backgrounds. Nothing should flash more than three times per second.", "Mantenha o feedback essencial e elimine decorações como shimmer, parallax e fundos em loop. Nada deve piscar mais de três vezes por segundo.")}</p>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MotionDemo />
          <Panel className="overflow-hidden">
            <pre className="px-4 py-4 text-[0.75rem] leading-relaxed font-[family-name:var(--font-mono)] text-foreground overflow-x-auto"><code>{motionCode}</code></pre>
          </Panel>
        </div>
      </PageSection>

      <PageSection
        id="a11y-checklist"
        label={t("Checklist", "Checklist")}
        title={t("Before you ship", "Antes de publicar")}
        intro={<p>{t("Run through this list on every new screen, and again after an AI tool regenerates a component.", "Percorra esta lista em toda tela nova, e de novo depois que uma ferramenta de IA regenerar um componente.")}</p>}
      >
        <Checklist />
      </PageSection>
    </div>
  );
}
