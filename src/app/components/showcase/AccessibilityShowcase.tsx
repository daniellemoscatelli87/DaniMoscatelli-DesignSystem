import React, { useId, useMemo, useRef, useState } from "react";
import {
  Eye, Keyboard, Brain, Cpu, Check, X, AlertCircle,
} from "lucide-react";
import { PageHeader, PageSection } from "./GetStartedShowcase";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, SubTitle, display } from "./shared/Guidance";

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
  return (
    <span className={`inline-flex items-center gap-1 text-[0.75rem] font-medium whitespace-nowrap ${ok ? "text-foreground" : "text-muted-foreground"}`}>
      {ok ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <X className="h-3.5 w-3.5" aria-hidden />}
      {label}: {ok ? "Pass" : "Fail"}
    </span>
  );
}

type Pair = { name: string; usage: string; fg: string; bg: string };

const lightPairs: Pair[] = [
  { name: "foreground / background", usage: "Body text on page", fg: "#131A27", bg: "#EDF0F5" },
  { name: "card-foreground / card", usage: "Text in cards", fg: "#131A27", bg: "#FFFFFF" },
  { name: "muted-foreground / card", usage: "Secondary text", fg: "#627288", bg: "#FFFFFF" },
  { name: "muted-foreground / background", usage: "Captions on page", fg: "#627288", bg: "#EDF0F5" },
  { name: "primary-foreground / primary", usage: "Label on primary button", fg: "#FFFFFF", bg: "#D44D4D" },
  { name: "primary / card", usage: "Primary as text or icon", fg: "#D44D4D", bg: "#FFFFFF" },
  { name: "crimson-500 / card", usage: "Small primary text", fg: "#B82828", bg: "#FFFFFF" },
  { name: "success / card", usage: "Status color alone", fg: "#4FB57B", bg: "#FFFFFF" },
];
const darkPairs: Pair[] = [
  { name: "foreground / background", usage: "Body text on page", fg: "#E4E9F0", bg: "#0D1119" },
  { name: "muted-foreground / background", usage: "Secondary text", fg: "#8898B0", bg: "#0D1119" },
  { name: "primary-foreground / primary", usage: "Label on primary button", fg: "#FFFFFF", bg: "#D44D4D" },
  { name: "primary / background", usage: "Primary as text or icon", fg: "#D44D4D", bg: "#0D1119" },
  { name: "crimson-300 / background", usage: "Primary muted text", fg: "#E88080", bg: "#0D1119" },
  { name: "success / background", usage: "Status color alone", fg: "#22C55E", bg: "#0D1119" },
];

function ContrastTable() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const pairs = mode === "light" ? lightPairs : darkPairs;
  return (
    <div className="space-y-3">
      <div role="group" aria-label="Theme" className="inline-flex p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
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
            {m} mode
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
                    {p.usage} · <span className="font-[family-name:var(--font-mono)]">{p.fg} on {p.bg}</span>
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-col md:items-end gap-x-4 gap-y-0.5">
                  <span className={`${display} text-[1.125rem] font-semibold text-foreground tabular-nums`}>{r.toFixed(2)}:1</span>
                  <Result ok={r >= 4.5} label="Text AA" />
                  <Result ok={r >= 3} label="UI / large" />
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
          aria-label={`${label} color picker`}
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
        {field(idFg, "Text color", fg, setFg)}
        {field(idBg, "Background color", bg, setBg)}
        <p className="text-[0.75rem] text-muted-foreground">Paste any hex value from the token table.</p>
      </div>
      <div className="space-y-3">
        <div
          className="rounded-[var(--radius)] border border-border p-5"
          style={{ color: luminance(fg) === null ? "#000" : fg, background: luminance(bg) === null ? "#fff" : bg }}
        >
          <p className="text-[1.5rem] font-semibold leading-tight">Large text, 24px</p>
          <p className="text-[0.875rem] mt-1">Body text at 14px must reach 4.5:1.</p>
        </div>
        <div aria-live="polite" className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {r === null ? (
            <span className="text-[0.8125rem] text-muted-foreground">Enter a valid 6-digit hex value.</span>
          ) : (
            <>
              <span className={`${display} text-[1.5rem] font-semibold text-foreground tabular-nums`}>{r.toFixed(2)}:1</span>
              <Result ok={r >= 4.5} label="Text AA" />
              <Result ok={r >= 3} label="Large / UI" />
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
  return (
    <Panel className="p-5">
      <p className="text-[0.8125rem] text-muted-foreground mb-4">
        Press <kbd className="px-1.5 py-0.5 rounded-[4px] border border-border bg-muted text-[0.6875rem] font-medium text-foreground">Tab</kbd> to move through these controls and watch the ring.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Primary
        </button>
        <button className="h-10 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.875rem] font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Secondary
        </button>
        <a href="#a11y-focus" onClick={e => e.preventDefault()} className="text-[0.875rem] font-medium text-primary underline underline-offset-4 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Text link
        </a>
        <input
          aria-label="Sample input"
          placeholder="Input"
          className="h-10 w-36 rounded-[10px] border border-border bg-[var(--input-background)] px-3 text-[0.875rem] text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
        />
      </div>
    </Panel>
  );
}

/* ── Keyboard: roving tablist ── */
function TabsDemo() {
  const tabs = ["Overview", "Tokens", "Components"];
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
      <div role="tablist" aria-label="Sample tabs" className="inline-flex gap-1 p-0.5 rounded-[10px] bg-muted border border-border">
        {tabs.map((t, i) => (
          <button
            key={t}
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
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-p${active}`} aria-labelledby={`${base}-t${active}`} tabIndex={0} className="mt-4 text-[0.8125rem] text-muted-foreground rounded-[6px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Panel for <span className="text-foreground font-medium">{tabs[active]}</span>. Only the active tab is in the Tab order; arrows, Home and End move between tabs.
      </div>
    </Panel>
  );
}

const keyboardRows: React.ReactNode[][] = [
  ["Button, Link", <><Mono>Enter</Mono> <Mono>Space</Mono></>, "Buttons activate on both. Links activate on Enter only."],
  ["Tabs", <><Mono>←</Mono> <Mono>→</Mono> <Mono>Home</Mono> <Mono>End</Mono></>, "One tab stop for the list; arrows change tabs."],
  ["Dialog", <><Mono>Esc</Mono> <Mono>Tab</Mono></>, "Focus is trapped inside, Esc closes, focus returns to the trigger."],
  ["Dropdown menu", <><Mono>↑</Mono> <Mono>↓</Mono> <Mono>Enter</Mono> <Mono>Esc</Mono></>, "Opens on Enter or ↓. Typing a letter jumps to a matching item."],
  ["Accordion", <><Mono>Enter</Mono> <Mono>Space</Mono> <Mono>↑</Mono> <Mono>↓</Mono></>, "Header buttons toggle panels; arrows move between headers."],
  ["Tooltip", <><Mono>Tab</Mono> <Mono>Esc</Mono></>, "Shows on focus as well as hover, and Esc dismisses it."],
];

/* ── Forms ── */
function FormDemo() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const id = useId();
  const error = !email ? "Enter your email address." : !/^\S+@\S+\.\S+$/.test(email) ? "Use the format name@company.com." : "";
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
            Work email <span className="text-muted-foreground font-normal">(required)</span>
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
          <p id={`${id}-hint`} className="mt-1.5 text-[0.75rem] text-muted-foreground">We only use it to send the invite.</p>
          <p id={`${id}-err`} role={show ? "alert" : undefined} className="mt-1.5 text-[0.75rem] font-medium text-foreground flex items-center gap-1.5 min-h-[1rem]">
            {show && (<><AlertCircle className="h-3.5 w-3.5 text-[var(--error)] shrink-0" aria-hidden />{error}</>)}
          </p>
        </div>
        <button type="submit" className="h-10 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          Send invite
        </button>
        <p role="status" className="text-[0.8125rem] text-foreground min-h-[1.25rem]">{sent ? "Invite sent to " + email : ""}</p>
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
<p id="email-hint">We only use it to send the invite.</p>
<p id="email-err" role="alert">Use the format name@company.com.</p>`;

const iconButtonCode = `// Icon-only controls need a name
<button aria-label="Close dialog"><X aria-hidden /></button>

// Decorative icons are hidden from screen readers
<Check aria-hidden className="h-4 w-4" /> Saved`;

/* ── Motion ── */
function MotionDemo() {
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
        Simulate “Reduce motion” OS setting
      </label>
      <div className={`${reduced ? "a11y-reduced" : ""} rounded-[10px] border border-border bg-muted/50 p-3`}>
        <div className="w-1/5">
          <div className="a11y-mover h-8 rounded-[8px] bg-primary" />
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] text-muted-foreground">
        {reduced ? "Motion removed. State is still communicated by position and label." : "Decorative motion is running. It stops automatically when the OS asks for less motion."}
      </p>
    </Panel>
  );
}

const motionCode = `@media (prefers-reduced-motion: reduce) {
  .ds-shimmer { animation: none; }
  * { scroll-behavior: auto !important; }
}`;

/* ── Checklist ── */
const checklistItems = [
  "Text and icons meet contrast on every surface in light and dark mode",
  "Every interactive element is reachable and operable with the keyboard alone",
  "Focus is always visible and never hidden behind sticky headers",
  "Each input has a visible label, not just a placeholder",
  "Errors name the field, say how to fix it and do not rely on color",
  "Icon-only buttons have an accessible name",
  "Headings follow a logical order and page landmarks are present",
  "Animations respect prefers-reduced-motion and nothing flashes",
  "Touch targets are at least 24px, and 44px for primary actions",
  "Layout works at 200% zoom and 320px width without horizontal scroll",
];

function Checklist() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const pct = Math.round((count / checklistItems.length) * 100);
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-[0.8125rem] font-medium text-foreground" aria-live="polite">{count} of {checklistItems.length} checked</p>
        <div className="flex items-center gap-3 flex-1 max-w-[220px]">
          <div role="progressbar" aria-label="Checklist progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-[0.75rem] tabular-nums text-muted-foreground w-9 text-right">{pct}%</span>
        </div>
      </div>
      <ul className="space-y-1">
        {checklistItems.map((t, i) => (
          <li key={t}>
            <label className="flex items-start gap-3 rounded-[8px] px-2 py-2 cursor-pointer hover:bg-muted/60 transition-colors">
              <input
                type="checkbox"
                checked={!!done[i]}
                onChange={e => setDone(d => ({ ...d, [i]: e.target.checked }))}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span className={`text-[0.8125rem] leading-relaxed ${done[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>{t}</span>
            </label>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function AccessibilityShowcase() {
  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow="Guidelines"
        title="Accessibility"
        description="The system targets WCAG 2.2 level AA. These patterns are built in to every component, so what you generate with AI tools inherits them as long as you keep using the tokens."
      />

      <PageSection
        id="a11y-principles"
        label="Principles"
        title="Four principles, applied"
        intro={<p>WCAG groups requirements under four principles. Each maps to concrete decisions in the system.</p>}
      >
        <PrincipleGrid
          cols="lg:grid-cols-4"
          items={[
            { icon: Eye, title: "Perceivable", desc: "Contrast-checked color pairs, text alternatives and status that never depends on color alone." },
            { icon: Keyboard, title: "Operable", desc: "Everything works from the keyboard, with a visible focus ring and generous targets." },
            { icon: Brain, title: "Understandable", desc: "Visible labels, predictable navigation and errors that explain how to recover." },
            { icon: Cpu, title: "Robust", desc: "Radix UI primitives and native HTML give assistive tech the right roles and states." },
          ]}
        />
      </PageSection>

      <PageSection
        id="a11y-contrast"
        label="Color"
        title="Contrast"
        intro={
          <>
            <p>Normal text needs <strong className="text-foreground">4.5:1</strong>. Large text (24px, or 19px bold) and UI boundaries or icons need <strong className="text-foreground">3:1</strong>. Ratios below are computed live from the actual token values.</p>
          </>
        }
      >
        <div className="space-y-5">
          <ContrastTable />
          <Callout title="What this tells us">
            <p>
              <Mono>primary</Mono> reaches the 3:1 needed for large text, icons and button fills, but not 4.5:1 for small text on white.
              For small primary-colored text use <Mono>crimson-500</Mono> in light mode. Status colors like <Mono>success</Mono> must always be paired with an icon and a text label.
            </p>
          </Callout>
          <SubTitle>Check any pair</SubTitle>
          <ContrastChecker />
        </div>
      </PageSection>

      <PageSection
        id="a11y-focus"
        label="Keyboard"
        title="Focus"
        intro={<p>Every interactive element shows a 2px ring using <Mono>--ring</Mono> on <Mono>:focus-visible</Mono>, so mouse users are not distracted while keyboard users never lose their place.</p>}
      >
        <div className="space-y-5">
          <FocusDemo />
          <DataTable
            head={["Rule", "Class"]}
            rows={[
              ["Ring", <Mono>focus-visible:ring-2 focus-visible:ring-ring</Mono>],
              ["Offset on filled controls", <Mono>focus-visible:ring-offset-2 focus-visible:ring-offset-background</Mono>],
              ["Remove native outline only when a ring replaces it", <Mono>focus-visible:outline-none</Mono>],
              ["Anchor targets clear the sticky header", <Mono>scroll-mt-32</Mono>],
            ]}
          />
          <DoDont
            dos={["Keep the ring on every control, including custom ones", "Make sure the ring has 3:1 against its neighbors", "Move focus into dialogs and back to the trigger on close"]}
            donts={["Never use outline: none without a replacement", "Don't use :focus for rings, it fires on mouse clicks", "Don't build div buttons, use button or a Radix primitive"]}
          />
        </div>
      </PageSection>

      <PageSection
        id="a11y-keyboard"
        label="Keyboard"
        title="Keyboard interaction"
        intro={<p>Radix UI primitives implement the WAI-ARIA authoring patterns. When you build something custom, follow the same keys.</p>}
      >
        <div className="space-y-5">
          <TabsDemo />
          <DataTable head={["Component", "Keys", "Behavior"]} rows={keyboardRows} />
        </div>
      </PageSection>

      <PageSection
        id="a11y-forms"
        label="Semantics"
        title="Forms and labels"
        intro={<p>Every field has a visible label tied to the input, hints and errors are linked with <Mono>aria-describedby</Mono>, and errors are announced. Try it: leave the field, then enter a bad address.</p>}
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
        label="Semantics"
        title="Structure and ARIA"
        intro={<p>Native HTML first. Reach for ARIA only when no element does the job, because bad ARIA is worse than none.</p>}
      >
        <div className="space-y-5">
          <DataTable
            head={["Need", "Use", "Avoid"]}
            rows={[
              ["Page regions", <><Mono>header</Mono> <Mono>nav</Mono> <Mono>main</Mono> <Mono>footer</Mono></>, "Anonymous div wrappers"],
              ["Headings", "One h1, then h2 to h3 without skipping levels", "Choosing a level for its size"],
              ["Action vs navigation", <><Mono>button</Mono> for actions, <Mono>a</Mono> for navigation</>, "Clickable spans"],
              ["Live updates", <><Mono>role=&quot;status&quot;</Mono> polite, <Mono>role=&quot;alert&quot;</Mono> urgent</>, "Toasts that vanish without announcement"],
              ["Toggle state", <><Mono>aria-pressed</Mono>, <Mono>aria-expanded</Mono>, <Mono>aria-selected</Mono></>, "State shown only by color"],
              ["Images", <>Meaningful <Mono>alt</Mono>, or <Mono>alt=&quot;&quot;</Mono> when decorative</>, "Filename or “image of” as alt"],
            ]}
          />
          <Callout title="Skip link">
            <p>Add a visually hidden “Skip to content” link as the first focusable element so keyboard users can bypass the sidebar on every page.</p>
          </Callout>
        </div>
      </PageSection>

      <PageSection
        id="a11y-motion"
        label="Motion"
        title="Motion and preferences"
        intro={<p>Honor <Mono>prefers-reduced-motion</Mono>. Keep essential feedback, drop decoration such as shimmer, parallax and looping backgrounds. Nothing should flash more than three times per second.</p>}
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
        label="Checklist"
        title="Before you ship"
        intro={<p>Run through this list on every new screen, and again after an AI tool regenerates a component.</p>}
      >
        <Checklist />
      </PageSection>
    </div>
  );
}
