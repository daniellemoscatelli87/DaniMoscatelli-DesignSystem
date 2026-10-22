import React, { useEffect, useRef, useState } from "react";
import {
  Eye, Compass, Undo2, MessageSquare, Gauge, Layers, Check, Loader2, Trash2, Inbox, AlertTriangle, RotateCcw, FileText,
} from "lucide-react";
import { PageHeader, PageSection } from "./GetStartedShowcase";
import { Callout, DataTable, DoDont, Mono, Panel, PrincipleGrid, display } from "./shared/Guidance";

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* ── Touch targets ── */
function TargetDemo() {
  const sizes = [
    { px: 24, label: "24px", note: "WCAG 2.2 minimum", cls: "h-6 w-6" },
    { px: 32, label: "32px", note: "Compact, desktop only", cls: "h-8 w-8" },
    { px: 40, label: "40px", note: "Default control", cls: "h-10 w-10" },
    { px: 44, label: "44px", note: "Recommended on touch", cls: "h-11 w-11" },
  ];
  return (
    <Panel className="p-5">
      <ul className="flex flex-wrap items-end gap-6">
        {sizes.map(s => (
          <li key={s.px} className="flex flex-col items-center gap-2">
            <button
              type="button"
              aria-label={`${s.label} target`}
              className={`${s.cls} rounded-[8px] bg-primary/10 border border-primary/40 text-primary flex items-center justify-center transition-colors hover:bg-primary/20 ${ring}`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden />
            </button>
            <span className="text-[0.8125rem] font-semibold text-foreground">{s.label}</span>
            <span className="text-[0.6875rem] text-muted-foreground text-center max-w-[110px] leading-snug">{s.note}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ── System status ── */
function FeedbackDemo() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const run = () => {
    if (state === "loading") return;
    setState("loading");
    timers.current.push(window.setTimeout(() => setState("done"), 1600));
    timers.current.push(window.setTimeout(() => setState("idle"), 3800));
  };
  return (
    <Panel className="p-5 flex flex-col items-start gap-3">
      <button
        type="button"
        onClick={run}
        aria-disabled={state === "loading"}
        className={`h-10 min-w-[148px] px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.875rem] font-medium inline-flex items-center justify-center gap-2 transition-opacity aria-disabled:opacity-70 aria-disabled:cursor-progress ${ring}`}
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
        {state === "done" && <Check className="h-4 w-4" aria-hidden />}
        {state === "idle" ? "Publish changes" : state === "loading" ? "Publishing…" : "Published"}
      </button>
      <p role="status" className="text-[0.8125rem] text-muted-foreground min-h-[1.25rem]">
        {state === "loading" ? "Publishing 3 files. This usually takes a few seconds." : state === "done" ? "Live at 14:32. Visitors see the update now." : "Click to see the three feedback states."}
      </p>
    </Panel>
  );
}

/* ── Destructive action with undo ── */
const initialDocs = ["Q3 roadmap", "Brand guidelines v2", "Onboarding checklist"];

function UndoDemo() {
  const [docs, setDocs] = useState(initialDocs);
  const [removed, setRemoved] = useState<{ name: string; index: number } | null>(null);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const remove = (name: string, index: number) => {
    setDocs(d => d.filter(x => x !== name));
    setRemoved({ name, index });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRemoved(null), 6000);
  };
  const undo = () => {
    if (!removed) return;
    setDocs(d => { const n = [...d]; n.splice(removed.index, 0, removed.name); return n; });
    setRemoved(null);
    clearTimeout(timer.current);
  };
  return (
    <Panel className="p-5">
      <ul className="divide-y divide-border rounded-[10px] border border-border overflow-hidden">
        {docs.map((d, i) => (
          <li key={d} className="flex items-center justify-between gap-3 px-3 py-2 bg-background/40">
            <span className="flex items-center gap-2.5 text-[0.8125rem] text-foreground"><FileText className="h-4 w-4 text-muted-foreground" aria-hidden />{d}</span>
            <button
              type="button"
              aria-label={`Delete ${d}`}
              onClick={() => remove(d, i)}
              className={`h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${ring}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </li>
        ))}
        {docs.length === 0 && <li className="px-3 py-6 text-center text-[0.8125rem] text-muted-foreground">No documents left.</li>}
      </ul>
      <div role="status" className="mt-3 min-h-[2.5rem]">
        {removed && (
          <div className="flex items-center justify-between gap-3 rounded-[10px] bg-foreground text-background px-3 py-2 text-[0.8125rem]">
            <span>“{removed.name}” deleted.</span>
            <button type="button" onClick={undo} className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4 rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background">
              <Undo2 className="h-3.5 w-3.5" aria-hidden /> Undo
            </button>
          </div>
        )}
      </div>
      {docs.length < initialDocs.length && !removed && (
        <button type="button" onClick={() => setDocs(initialDocs)} className={`mt-1 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-muted-foreground hover:text-foreground rounded-[4px] ${ring}`}>
          <RotateCcw className="h-3 w-3" aria-hidden /> Reset demo
        </button>
      )}
    </Panel>
  );
}

/* ── Content states ── */
type ViewState = "loading" | "empty" | "error" | "content";
const viewStates: { id: ViewState; label: string }[] = [
  { id: "loading", label: "Loading" },
  { id: "empty", label: "Empty" },
  { id: "error", label: "Error" },
  { id: "content", label: "Content" },
];

function StatesDemo() {
  const [view, setView] = useState<ViewState>("loading");
  return (
    <div className="space-y-3">
      <div role="group" aria-label="Preview state" className="inline-flex flex-wrap p-0.5 rounded-[10px] bg-muted border border-border gap-0.5">
        {viewStates.map(s => (
          <button
            key={s.id}
            type="button"
            aria-pressed={view === s.id}
            onClick={() => setView(s.id)}
            className={`h-8 px-3 rounded-[8px] text-[0.75rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              view === s.id ? "bg-card text-foreground border border-border shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <Panel className="p-6 min-h-[200px] flex">
        {view === "loading" && (
          <div className="w-full space-y-3" role="status" aria-label="Loading projects">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-[8px] bg-muted animate-pulse motion-reduce:animate-none" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/3 rounded bg-muted animate-pulse motion-reduce:animate-none" />
                  <div className="h-3 w-2/3 rounded bg-muted/70 animate-pulse motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>
        )}
        {view === "empty" && (
          <div className="m-auto text-center max-w-xs">
            <Inbox className="h-6 w-6 text-muted-foreground mx-auto mb-3" aria-hidden />
            <p className={`${display} text-[1rem] font-semibold text-foreground mb-1`}>No projects yet</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">Projects you create appear here. Start with a template to see how it works.</p>
            <button type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>Create project</button>
          </div>
        )}
        {view === "error" && (
          <div role="alert" className="m-auto text-center max-w-xs">
            <AlertTriangle className="h-6 w-6 text-[var(--error)] mx-auto mb-3" aria-hidden />
            <p className={`${display} text-[1rem] font-semibold text-foreground mb-1`}>We couldn't load your projects</p>
            <p className="text-[0.8125rem] text-muted-foreground mb-4">Check your connection and try again. Your work is safe.</p>
            <button type="button" className={`h-9 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.8125rem] font-medium hover:bg-muted ${ring}`}>Try again</button>
          </div>
        )}
        {view === "content" && (
          <ul className="w-full divide-y divide-border">
            {[["Atlas redesign", "Updated 2 hours ago"], ["Billing flow", "Updated yesterday"], ["Docs refresh", "Updated Mar 4"]].map(([n, d]) => (
              <li key={n} className="flex items-center justify-between py-3">
                <span className="text-[0.875rem] font-medium text-foreground">{n}</span>
                <span className="text-[0.75rem] text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

/* ── Button hierarchy ── */
function HierarchyDemo() {
  return (
    <Panel className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { title: "One primary action", good: true },
        { title: "Competing primaries", good: false },
      ].map(c => (
        <div key={c.title}>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-3 flex items-center gap-1.5">
            {c.good ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden /> : <span aria-hidden className="text-[0.875rem] leading-none">×</span>}
            {c.title}
          </p>
          <div className="rounded-[10px] border border-border bg-background/40 p-4">
            <p className="text-[0.875rem] font-medium text-foreground mb-3">Discard unsaved draft?</p>
            <div className="flex flex-wrap items-center gap-2">
              {c.good ? (
                <>
                  <button type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>Save draft</button>
                  <button type="button" className={`h-9 px-4 rounded-[10px] border border-border bg-card text-foreground text-[0.8125rem] font-medium hover:bg-muted ${ring}`}>Keep editing</button>
                  <button type="button" className={`h-9 px-3 rounded-[10px] text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground ${ring}`}>Discard</button>
                </>
              ) : (
                ["Save draft", "Keep editing", "Discard"].map(l => (
                  <button key={l} type="button" className={`h-9 px-4 rounded-[10px] bg-primary text-primary-foreground text-[0.8125rem] font-medium ${ring}`}>{l}</button>
                ))
              )}
            </div>
          </div>
        </div>
      ))}
    </Panel>
  );
}

const principles = [
  { icon: Gauge, title: "Show system status", desc: "Acknowledge every action within 100ms and say what is happening, how long it takes and when it finishes." },
  { icon: Compass, title: "Keep people oriented", desc: "Breadcrumbs, active states and consistent placement answer where am I, and where can I go." },
  { icon: Undo2, title: "Forgive mistakes", desc: "Prefer undo over confirmation dialogs. Reserve blocking confirmations for irreversible actions." },
  { icon: Layers, title: "Be consistent", desc: "Same action, same component, same word. Tokens and shared components make this the default." },
  { icon: Eye, title: "Recognize, don't recall", desc: "Show options, labels and recent values instead of asking people to remember them." },
  { icon: MessageSquare, title: "Speak plainly", desc: "Use the user's words. Describe the outcome of a button, not the mechanism behind it." },
];

export function UsabilityShowcase() {
  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow="Guidelines"
        title="Usability"
        description="Patterns that make interfaces easy to understand and hard to get wrong. Use them as a checklist when designing a screen or reviewing what an AI tool generated."
      />

      <PageSection
        id="ux-principles"
        label="Principles"
        title="Six principles"
        intro={<p>Adapted from Nielsen's usability heuristics to the way this system is built and used.</p>}
      >
        <PrincipleGrid items={principles} />
      </PageSection>

      <PageSection
        id="ux-hierarchy"
        label="Interaction"
        title="Action hierarchy"
        intro={<p>Each view has one primary action. Secondary actions use the outlined style and tertiary ones are text only, so the next step is obvious at a glance.</p>}
      >
        <div className="space-y-5">
          <HierarchyDemo />
          <DataTable
            head={["Level", "Style", "Use for"]}
            rows={[
              ["Primary", <Mono>bg-primary</Mono>, "The one thing most people came to do"],
              ["Secondary", <Mono>border-border bg-card</Mono>, "Alternatives of equal importance"],
              ["Tertiary", <Mono>text-muted-foreground</Mono>, "Low-emphasis or reversible actions"],
            ]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-targets"
        label="Interaction"
        title="Target size and spacing"
        intro={<p>Small targets cause mis-taps and exclude people with limited dexterity. WCAG 2.2 requires 24px, and 44px is the safer size on touch. Keep at least 8px between adjacent targets.</p>}
      >
        <div className="space-y-5">
          <TargetDemo />
          <Callout title="Small icon, large target">
            <p>A 16px icon can sit inside a 40px button. Grow the hit area with padding instead of enlarging the icon.</p>
          </Callout>
        </div>
      </PageSection>

      <PageSection
        id="ux-feedback"
        label="Feedback"
        title="System status"
        intro={<p>People should never wonder whether something worked. Match the feedback to how long the wait is.</p>}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FeedbackDemo />
          <DataTable
            head={["Wait", "Feedback"]}
            rows={[
              ["< 100ms", "None needed. Update the UI directly."],
              ["100ms to 1s", "Pressed state or inline spinner."],
              ["1s to 10s", "Spinner or skeleton plus a status message."],
              ["> 10s", "Determinate progress, time estimate and a way to cancel."],
            ]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-states"
        label="Feedback"
        title="Every view has four states"
        intro={<p>Design loading, empty, error and content together. Empty and error states should explain what happened and offer one clear next step.</p>}
      >
        <StatesDemo />
      </PageSection>

      <PageSection
        id="ux-errors"
        label="Content"
        title="Errors and microcopy"
        intro={<p>Say what happened, why, and how to fix it. Blame the situation, not the person, and keep technical codes out of the headline.</p>}
      >
        <div className="space-y-5">
          <DataTable
            head={["Instead of", "Write"]}
            rows={[
              ["Invalid input", "Enter an email like name@company.com."],
              ["Error 500", "Something went wrong on our side. Try again in a minute."],
              ["Submit", "Send invite"],
              ["Are you sure?", "Delete “Q3 roadmap”? You can undo this for 6 seconds."],
              ["You entered the wrong password", "That password doesn't match. Try again or reset it."],
            ]}
          />
          <DoDont
            dos={["Name the object in the button: Save draft, Send invite", "Put the fix next to the field that failed", "Use sentence case and plain words"]}
            donts={["Don't use vague verbs like Submit or OK", "Don't clear the form after an error", "Don't show a toast alone for field errors"]}
          />
        </div>
      </PageSection>

      <PageSection
        id="ux-destructive"
        label="Safety"
        title="Destructive actions"
        intro={<p>Undo beats “Are you sure?” because people click through confirmations on autopilot. Delete immediately, offer undo for a few seconds, and keep the dialog for actions that truly cannot be reversed.</p>}
      >
        <UndoDemo />
      </PageSection>

      <PageSection
        id="ux-checklist"
        label="Review"
        title="Quick review"
        intro={<p>Ask these before shipping a screen. Pair with the accessibility checklist.</p>}
      >
        <DataTable
          head={["Question", "Check"]}
          rows={[
            ["Is there exactly one primary action?", "Action hierarchy"],
            ["Does every click give feedback in under 100ms?", "System status"],
            ["Can the person recover from a mistake?", "Undo, error messages"],
            ["Do loading, empty and error states exist?", "Content states"],
            ["Are targets at least 24px, ideally 44px on touch?", "Target size"],
            ["Do labels use the user's words?", "Microcopy"],
          ]}
        />
      </PageSection>
    </div>
  );
}
