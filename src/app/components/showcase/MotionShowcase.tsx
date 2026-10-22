import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform, useMotionTemplate } from "motion/react";
import {
  Play, RefreshCw, Heart, Star, Bell, Check, X, Zap,
  ArrowRight, ChevronDown, Sparkles, Loader, MousePointer2,
  Wind, Layers, Activity, Clock, Move, Users,
} from "lucide-react";
import { useI18n } from "../../i18n";

/* ── Section wrapper ── */
function Section({ id, title, sub, children }: { id: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-5">
      <div>
        <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{title}</h2>
        <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{sub}</p>
      </div>
      {children}
    </section>
  );
}

/* ── Token pill ── */
function Token({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] border border-border bg-card px-3.5 py-2.5" style={{ boxShadow: "var(--shadow-xs)" }}>
      <code className="text-[0.75rem] font-mono text-primary">{name}</code>
      <span className="text-[0.6875rem] text-muted-foreground font-mono">{value}</span>
    </div>
  );
}

/* ── Replay button ── */
function ReplayBtn({ onClick }: { onClick: () => void }) {
  const { t, bi } = useI18n();
  return (
    <button onClick={onClick}
      className="flex items-center gap-1 text-[0.625rem] font-semibold text-muted-foreground hover:text-primary transition-colors mt-2">
      <RefreshCw className="h-3 w-3" /> {t("replay", "repetir")}
    </button>
  );
}

/* ══════════════════════════════════════
   SECTION 1 — Enter / Exit Presets
══════════════════════════════════════ */
const enterPresets = [
  {
    label: "Fade In",
    labelPt: "Fade in",
    desc: "opacity 0 → 1",
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.8, ease: "easeOut" },
  },
  {
    label: "Slide Up",
    labelPt: "Deslizar para cima",
    desc: "y 44 → 0",
    initial: { opacity: 0, y: 44 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  {
    label: "Slide Right",
    labelPt: "Deslizar da esquerda",
    desc: "x -44 → 0",
    initial: { opacity: 0, x: -44 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  {
    label: "Scale In",
    labelPt: "Escala de entrada",
    desc: "scale 0.5 → 1",
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  {
    label: "Blur In",
    labelPt: "Blur de entrada",
    desc: "blur 16px → 0",
    initial: { opacity: 0, filter: "blur(16px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    transition: { duration: 0.75, ease: "easeOut" },
  },
  {
    label: "Rotate In",
    labelPt: "Rotação de entrada",
    desc: "rotate -20 → 0",
    initial: { opacity: 0, rotate: -20, scale: 0.8 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  {
    label: "Flip Y",
    labelPt: "Giro em Y",
    desc: "rotateX 90 → 0",
    initial: { opacity: 0, rotateX: 90 },
    animate: { opacity: 1, rotateX: 0 },
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
  {
    label: "Bounce",
    labelPt: "Salto elástico",
    desc: "spring with bounce",
    descPt: "spring com bounce",
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring", stiffness: 320, damping: 12 },
  },
];

function EnterPresets() {
  const { t, bi } = useI18n();
  const [keys, setKeys] = useState<number[]>(enterPresets.map((_, i) => i));
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const replay = (i: number) => setKeys(k => { const n = [...k]; n[i] += enterPresets.length; return n; });

  const replayAll = () => {
    // Clear any pending stagger timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    // Stagger each preset 700ms apart so you can watch them one at a time
    enterPresets.forEach((_, i) => {
      const tid = setTimeout(() => replay(i), i * 700);
      timersRef.current.push(tid);
    });
  };

  // Auto-play staggered on first mount
  useEffect(() => {
    replayAll();
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  return (
    <Section id="enter-presets" title={t("Enter & Exit Presets", "Presets de entrada e saída")} sub={t("Ready-made animation variants for mounting components into the DOM. Click «Replay all» to watch them in sequence.", "Variantes de animação prontas para montar componentes no DOM. Clique em «Repetir todos» para vê-los em sequência.")}>
      <div className="flex justify-end">
        <button onClick={replayAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> {t("Replay all", "Repetir todos")}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {enterPresets.map((preset, i) => (
          <div key={preset.label} className="rounded-[14px] border border-border bg-card p-4 flex flex-col items-center gap-3" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="flex items-center justify-center w-full" style={{ minHeight: 96 }}>
              <motion.div
                key={keys[i]}
                initial={preset.initial}
                animate={preset.animate}
                transition={preset.transition as any}
                className="h-14 w-14 rounded-[14px] bg-primary/15 border border-primary/30 flex items-center justify-center"
                style={{ perspective: 400 }}
              >
                <Sparkles className="text-primary" style={{ height: 22, width: 22 }} />
              </motion.div>
            </div>
            <div className="text-center w-full">
              <div className="text-[0.75rem] font-bold text-foreground">{t(preset.label, (preset as any).labelPt)}</div>
              <div className="text-[0.625rem] text-muted-foreground font-mono mt-0.5">{(preset as any).descPt ? t(preset.desc, (preset as any).descPt) : preset.desc}</div>
            </div>
            <ReplayBtn onClick={() => replay(i)} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 2 — Easing Reference
══════════════════════════════════════ */
const easings: { label: string; labelPt: string; curve: string; value: [number, number, number, number] | string }[] = [
  { label: "Linear", labelPt: "Linear",       curve: "M0,80 L80,0",                     value: "linear" },
  { label: "Ease In", labelPt: "Ease In",      curve: "M0,80 C60,80 80,20 80,0",          value: [0.42, 0, 1, 1] },
  { label: "Ease Out", labelPt: "Ease Out",     curve: "M0,80 C0,60 20,0 80,0",            value: [0, 0, 0.58, 1] },
  { label: "Ease In Out", labelPt: "Ease In Out",  curve: "M0,80 C20,80 60,0 80,0",           value: [0.42, 0, 0.58, 1] },
  { label: "Back", labelPt: "Back",         curve: "M0,80 C20,100 60,-20 80,0",        value: [0.34, 1.56, 0.64, 1] },
  { label: "Anticipate", labelPt: "Antecipação",   curve: "M0,80 C10,90 60,-20 80,0",        value: [0.2, -0.4, 0.8, 1.4] },
  { label: "Snappy", labelPt: "Ágil",       curve: "M0,80 C5,80 10,0 80,0",            value: [0.16, 1, 0.3, 1] },
  { label: "Expo Out", labelPt: "Expo Out",     curve: "M0,80 C0,80 2,0 80,0",             value: [0.19, 1, 0.22, 1] },
];

function EasingReference() {
  const { t, bi } = useI18n();
  const [running, setRunning] = useState<number | null>(null);
  const [keys, setKeys] = useState<number[]>(easings.map((_, i) => i));

  const run = (i: number) => {
    setRunning(i);
    setKeys(k => { const n = [...k]; n[i] += easings.length; return n; });
    setTimeout(() => setRunning(null), 1200);
  };

  return (
    <Section id="easing" title={t("Easing Reference", "Referência de easing")} sub={t("Visual comparison of cubic-bezier curves used across the design system.", "Comparação visual das curvas cubic-bezier usadas em todo o design system.")}>
      <div className="grid grid-cols-4 gap-3">
        {easings.map((e, i) => (
          <div key={e.label} className="rounded-[14px] border border-border bg-card p-4 space-y-3 cursor-pointer hover:border-primary/30 transition-colors group" style={{ boxShadow: "var(--shadow-xs)" }} onClick={() => run(i)}>
            {/* Curve SVG */}
            <div className="flex items-center justify-center">
              <svg width="80" height="80" viewBox="0 0 80 80" className="overflow-visible">
                <line x1="0" y1="80" x2="0" y2="0" stroke="var(--border)" strokeWidth="1" />
                <line x1="0" y1="80" x2="80" y2="80" stroke="var(--border)" strokeWidth="1" />
                <path d={e.curve} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
                {/* Animated dot */}
                <circle
                  key={keys[i]}
                  r={4}
                  fill="var(--primary)"
                  style={{
                    offsetPath: `path('${e.curve}')`,
                    offsetDistance: running === i ? "100%" : "0%",
                    transition: running === i
                      ? `offset-distance 0.9s ${typeof e.value === "string" ? e.value : `cubic-bezier(${e.value.join(",")})`}`
                      : "none",
                  } as React.CSSProperties}
                />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-[0.75rem] font-bold text-foreground group-hover:text-primary transition-colors">{t(e.label, e.labelPt)}</div>
              <div className="text-[0.5625rem] font-mono text-muted-foreground mt-0.5">
                {typeof e.value === "string" ? e.value : `[${e.value.join(", ")}]`}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-[0.6875rem] text-muted-foreground">{t("Click a card to animate the dot along the curve.", "Clique em um card para animar o ponto ao longo da curva.")}</p>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 3 — Spring Physics
══════════════════════════════════════ */
const springPresets = [
  { label: "Gentle", labelPt: "Suave",   stiffness: 120,  damping: 14,  mass: 1,   color: "bg-info/15 border-info/25 text-info" },
  { label: "Default", labelPt: "Padrão",  stiffness: 260,  damping: 20,  mass: 1,   color: "bg-primary/15 border-primary/25 text-primary" },
  { label: "Snappy", labelPt: "Ágil",   stiffness: 400,  damping: 25,  mass: 1,   color: "bg-warning/15 border-warning/25 text-warning" },
  { label: "Bouncy", labelPt: "Elástica",   stiffness: 600,  damping: 8,   mass: 1,   color: "bg-success/15 border-success/25 text-success" },
  { label: "Stiff", labelPt: "Rígida",    stiffness: 900,  damping: 40,  mass: 1,   color: "bg-destructive/15 border-destructive/25 text-destructive" },
  { label: "Wobbly", labelPt: "Oscilante",   stiffness: 180,  damping: 6,   mass: 1.2, color: "bg-chart-4/15 border-chart-4/25 text-chart-4" },
];

function SpringPhysics() {
  const { t, bi } = useI18n();
  const [keys, setKeys] = useState(springPresets.map((_, i) => i));
  const [active, setActive] = useState<number | null>(null);

  const trigger = (i: number) => {
    setActive(i);
    setKeys(k => { const n = [...k]; n[i] += springPresets.length; return n; });
    setTimeout(() => setActive(null), 2000);
  };
  const triggerAll = () => {
    setKeys(k => k.map((v, i) => v + springPresets.length));
  };

  return (
    <Section id="spring" title={t("Spring Physics", "Física de spring")} sub={t("Physics-based animation presets. Click a card to see the spring in action.", "Presets de animação baseados em física. Clique em um card para ver o spring em ação.")}>
      <div className="flex justify-end">
        <button onClick={triggerAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border bg-card text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors">
          <Play className="h-3.5 w-3.5" /> {t("Play all", "Tocar todos")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {springPresets.map((p, i) => (
          <div key={p.label} onClick={() => trigger(i)}
            className="rounded-[14px] border border-border bg-card p-5 flex flex-col gap-4 cursor-pointer hover:border-primary/30 transition-all group" style={{ boxShadow: "var(--shadow-xs)" }}>
            {/* Ball track */}
            <div className="relative h-10 bg-muted/40 rounded-full overflow-hidden border border-border">
              <motion.div
                key={keys[i]}
                className={`absolute top-1 bottom-1 left-1 aspect-square rounded-full border ${p.color}`}
                initial={{ x: 0 }}
                animate={{ x: "calc(100% + 24px - 2rem)" }}
                transition={{ type: "spring", stiffness: p.stiffness, damping: p.damping, mass: p.mass, delay: 0.05 }}
              />
            </div>
            <div>
              <div className="text-[0.8125rem] font-bold text-foreground group-hover:text-primary transition-colors mb-1">{t(p.label, p.labelPt)}</div>
              <div className="grid grid-cols-3 gap-1">
                {[["s", p.stiffness], ["d", p.damping], ["m", p.mass]].map(([k, v]) => (
                  <div key={k as string} className="text-center rounded-[6px] bg-muted/50 py-1 px-1">
                    <div className="text-[0.5rem] text-muted-foreground uppercase tracking-wide">{k}</div>
                    <div className="text-[0.6875rem] font-bold text-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom spring playground */}
      <SpringPlayground />
    </Section>
  );
}

function SpringPlayground() {
  const { t, bi } = useI18n();
  const [stiffness, setStiffness] = useState(260);
  const [damping, setDamping]     = useState(20);
  const [mass, setMass]           = useState(1);
  const [key, setKey]             = useState(0);

  const run = () => setKey(k => k + 1);

  return (
    <div className="rounded-[16px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[0.875rem] font-bold text-foreground">{t("Spring Playground", "Playground de spring")}</div>
          <div className="text-[0.6875rem] text-muted-foreground">{t("Tune stiffness, damping, and mass live.", "Ajuste rigidez, amortecimento e massa em tempo real.")}</div>
        </div>
        <button onClick={run} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-primary text-primary-foreground text-[0.75rem] font-semibold hover:opacity-90 transition-opacity">
          <Play className="h-3.5 w-3.5" /> {t("Play", "Tocar")}
        </button>
      </div>
      {/* Controls */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Stiffness", labelPt: "Rigidez", min: 10, max: 1000, step: 10, value: stiffness, set: setStiffness },
          { label: "Damping", labelPt: "Amortecimento", min: 0,  max: 60,   step: 1,  value: damping,   set: setDamping   },
          { label: "Mass", labelPt: "Massa", min: 0.1,max: 5,    step: 0.1,value: mass,      set: setMass      },
        ].map(ctrl => (
          <div key={ctrl.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[0.6875rem] font-semibold text-foreground">{t(ctrl.label, ctrl.labelPt)}</label>
              <span className="text-[0.6875rem] font-mono text-primary">{ctrl.value}</span>
            </div>
            <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step} value={ctrl.value}
              onChange={e => ctrl.set(Number(e.target.value))}
              className="w-full accent-[var(--primary)] h-1 rounded-full cursor-pointer" />
          </div>
        ))}
      </div>
      {/* Preview */}
      <div className="relative h-12 bg-muted/40 rounded-full overflow-hidden border border-border">
        <motion.div
          key={key}
          className="absolute top-1.5 bottom-1.5 left-1.5 aspect-square rounded-full bg-primary border border-primary/40"
          initial={{ x: 0 }}
          animate={{ x: "calc(100% + 28px - 2.25rem)" }}
          transition={{ type: "spring", stiffness, damping, mass, delay: 0.05 }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION 4 — Stagger & Sequences
══════════════════════════════════════ */
const staggerItems = [
  "Analytics Dashboard",
  "User Management",
  "Billing & Plans",
  "API Access",
  "Integrations",
  "Team Collaboration",
  "Audit Logs",
  "Settings",
  "Support",
];

const staggerItemsPt = [
  "Painel de análises",
  "Gestão de usuários",
  "Cobrança e planos",
  "Acesso à API",
  "Integrações",
  "Colaboração em equipe",
  "Logs de auditoria",
  "Configurações",
  "Suporte",
];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const staggerChild = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function StaggerSection() {
  const { t, bi } = useI18n();
  const [key, setKey] = useState(0);
  const [staggerDelay, setStaggerDelay] = useState(0.07);
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: staggerDelay } },
  };

  return (
    <Section id="stagger" title={t("Stagger & Sequences", "Stagger e sequências")} sub={t("Cascade children into view with configurable stagger delays.", "Faça os filhos entrarem em cascata com atrasos de stagger configuráveis.")}>
      <div className="rounded-[16px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-sm)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <label className="text-[0.6875rem] font-semibold text-foreground">{t("Stagger delay", "Atraso do stagger")}</label>
            <input type="range" min={0.02} max={0.2} step={0.01} value={staggerDelay}
              onChange={e => setStaggerDelay(Number(e.target.value))}
              className="w-28 accent-[var(--primary)] h-1 rounded-full cursor-pointer" />
            <span className="text-[0.6875rem] font-mono text-primary">{staggerDelay}s</span>
          </div>
          <button onClick={() => setKey(k => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] border border-border bg-muted text-[0.75rem] font-medium text-foreground hover:bg-accent transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> {t("Replay", "Repetir")}
          </button>
        </div>

        <motion.div key={key} variants={container} initial="hidden" animate="show" className="grid grid-cols-3 gap-2">
          {staggerItems.map((item, i) => (
            <motion.div key={item} variants={staggerChild}
              className="flex items-center gap-2.5 rounded-[10px] border border-border bg-muted/30 px-3 py-2.5 hover:bg-accent transition-colors">
              <div className="h-6 w-6 rounded-[7px] bg-primary/12 flex items-center justify-center shrink-0">
                <span className="text-[0.5rem] font-black text-primary">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <span className="text-[0.75rem] font-medium text-foreground">{t(item, staggerItemsPt[i])}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 5 — Hover Effects
══════════════════════════════════════ */
function HoverSection() {
  const { t, bi } = useI18n();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [22, -22]);
  const rotateY = useTransform(x, [-70, 70], [-22, 22]);

  // Specular sheen: maps cursor position to radial gradient center (%)
  const sheenX = useTransform(x, [-70, 70], [15, 85]);
  const sheenY = useTransform(y, [-50, 50], [15, 85]);
  const sheenBg = useMotionTemplate`radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.06) 40%, transparent 70%)`;

  // Directional shadow depth
  const shadowX = useTransform(rotateY, [-22, 22], [-14, 14]);
  const shadowY = useTransform(rotateX, [-22, 22], [14, -14]);
  const tiltShadow = useMotionTemplate`${shadowX}px ${shadowY}px 32px rgba(0,0,0,0.40)`;

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const resetTilt = () => { x.set(0); y.set(0); };

  return (
    <Section id="hover" title={t("Hover Interactions", "Interações de hover")} sub={t("Pointer-driven micro-animations for interactive surfaces.", "Microanimações guiadas pelo ponteiro para superfícies interativas.")}>
      <div className="grid grid-cols-4 gap-3">

        {/* Lift */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Lift", "Elevação")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 16px 40px -8px rgba(0,0,0,0.35)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="h-14 w-24 rounded-[12px] bg-card border border-border flex items-center justify-center cursor-pointer"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <Layers className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">whileHover: y -6</p>
        </div>

        {/* Scale */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Scale", "Escala")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.div
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="h-12 w-12 rounded-full bg-primary/12 border border-primary/25 flex items-center justify-center cursor-pointer"
            >
              <Zap className="h-5 w-5 text-primary" />
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">whileHover: scale 1.12</p>
        </div>

        {/* Glow */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Glow", "Brilho")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.button
              whileHover={{ boxShadow: "0 0 24px 6px var(--primary)" }}
              transition={{ duration: 0.25 }}
              className="px-4 py-2 rounded-[10px] bg-primary text-primary-foreground text-[0.75rem] font-bold"
            >
              {t("Get started", "Começar")}
            </motion.button>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">boxShadow glow</p>
        </div>

        {/* 3D Tilt */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("3D Tilt", "Inclinação 3D")}</div>
          <div className="flex items-center justify-center py-2" style={{ perspective: 500 }}>
            <motion.div
              onMouseMove={handleMouse}
              onMouseLeave={resetTilt}
              style={{ rotateX, rotateY, boxShadow: tiltShadow, transformStyle: "preserve-3d" }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative h-24 w-36 rounded-[16px] overflow-hidden cursor-pointer select-none"
            >
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-muted border border-primary/25 rounded-[16px]" />
              {/* Specular sheen that follows cursor */}
              <motion.div className="absolute inset-0 rounded-[16px]" style={{ background: sheenBg }} />
              {/* Floating content layer (raised via translateZ) */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                style={{ transform: "translateZ(20px)" }}
              >
                <Move className="text-primary" style={{ height: 20, width: 20 }} />
                <span className="text-[0.5625rem] font-semibold text-primary/70 tracking-wide">{t("MOVE CURSOR", "MOVA O CURSOR")}</span>
              </div>
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">rotateX / rotateY + sheen</p>
        </div>

        {/* Border sweep */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Border Sweep", "Varredura de borda")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.div
              initial={{ backgroundSize: "0% 2px" }}
              whileHover={{ backgroundSize: "100% 2px" }}
              transition={{ duration: 0.3 }}
              className="px-3 py-1.5 text-[0.75rem] font-semibold text-foreground cursor-pointer"
              style={{ backgroundImage: "linear-gradient(var(--primary), var(--primary))", backgroundRepeat: "no-repeat", backgroundPosition: "bottom left" }}
            >
              {t("Hover me", "Passe o mouse")}
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">backgroundSize sweep</p>
        </div>

        {/* Magnetic */}
        <MagneticButton />

        {/* Color shift */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Color Shift", "Mudança de cor")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.div
              whileHover={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
              transition={{ duration: 0.2 }}
              className="px-4 py-2 rounded-[10px] border border-border text-[0.75rem] font-semibold text-foreground cursor-pointer"
            >
              {t("Fill on hover", "Preenche no hover")}
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">backgroundColor transition</p>
        </div>

        {/* Reveal */}
        <div className="rounded-[14px] border border-border bg-card p-4 space-y-3 group overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Icon Reveal", "Ícone revelado")}</div>
          <div className="flex items-center justify-center py-3">
            <motion.div
              initial={false}
              whileHover="hover"
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-muted border border-border text-[0.75rem] font-semibold text-foreground cursor-pointer overflow-hidden"
            >
              <motion.span variants={{ hover: { x: -4 } }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                {t("Learn more", "Saiba mais")}
              </motion.span>
              <motion.div
                variants={{ hover: { x: 0, opacity: 1 } }}
                initial={{ x: -12, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </motion.div>
            </motion.div>
          </div>
          <p className="text-[0.625rem] text-muted-foreground font-mono">{t("staggered slide reveal", "revelação deslizante em sequência")}</p>
        </div>
      </div>
    </Section>
  );
}

function MagneticButton() {
  const { t, bi } = useI18n();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.4);
    y.set((e.clientY - cy) * 0.4);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <div className="rounded-[14px] border border-border bg-card p-4 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
      <div className="text-[0.75rem] font-bold text-foreground">{t("Magnetic", "Magnético")}</div>
      <div className="flex items-center justify-center py-3">
        <div onMouseMove={handleMouse} onMouseLeave={reset} className="flex items-center justify-center w-24 h-14">
          <motion.button
            style={{ x: springX, y: springY }}
            className="px-4 py-2 rounded-[10px] bg-card border border-border text-[0.75rem] font-semibold text-foreground"
          >
            <MousePointer2 className="h-4 w-4 text-muted-foreground mx-auto" />
          </motion.button>
        </div>
      </div>
      <p className="text-[0.625rem] text-muted-foreground font-mono">useSpring magnetic</p>
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION 6 — Micro-interactions
══════════════════════════════════════ */
function MicroInteractions() {
  const { t, bi } = useI18n();
  const [liked, setLiked]       = useState(false);
  const [checked, setChecked]   = useState(false);
  const [toggled, setToggled]   = useState(false);
  const [rating, setRating]     = useState(0);
  const [notified, setNotified] = useState(false);
  const [counter, setCounter]   = useState(0);

  return (
    <Section id="micro" title={t("Micro-interactions", "Microinterações")} sub={t("Delight in the details — small animations that confirm user actions.", "Encante nos detalhes — pequenas animações que confirmam as ações do usuário.")}>
      <div className="grid grid-cols-3 gap-3">

        {/* Like */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Like Button", "Botão de curtir")}</div>
          <motion.button onClick={() => setLiked(l => !l)} whileTap={{ scale: 0.85 }} className="relative">
            <motion.div
              animate={{ scale: liked ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Heart className={`h-8 w-8 transition-colors duration-200 ${liked ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </motion.div>
            <AnimatePresence>
              {liked && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 rounded-full border-2 border-destructive pointer-events-none"
                />
              )}
            </AnimatePresence>
          </motion.button>
          <span className="text-[0.6875rem] text-muted-foreground">{liked ? t("Liked!", "Curtiu!") : t("Click to like", "Clique para curtir")}</span>
        </div>

        {/* Checkbox */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Checkbox", "Checkbox")}</div>
          <motion.button
            onClick={() => setChecked(c => !c)}
            animate={{ backgroundColor: checked ? "var(--primary)" : "rgba(0, 0, 0, 0)" }}
            transition={{ duration: 0.2 }}
            className="h-8 w-8 rounded-[8px] border-2 flex items-center justify-center"
            style={{ borderColor: checked ? "var(--primary)" : "var(--border)" }}
          >
            <AnimatePresence>
              {checked && (
                <motion.div
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="h-4 w-4 text-primary-foreground" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <span className="text-[0.6875rem] text-muted-foreground">{checked ? t("Checked", "Marcado") : t("Unchecked", "Desmarcado")}</span>
        </div>

        {/* Toggle */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Toggle Switch", "Toggle switch")}</div>
          <motion.button
            onClick={() => setToggled(v => !v)}
            animate={{ backgroundColor: toggled ? "var(--primary)" : "var(--muted)" }}
            transition={{ duration: 0.2 }}
            className="relative h-7 w-12 rounded-full flex items-center px-1"
          >
            <motion.div
              animate={{ x: toggled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 28 }}
              className="h-5 w-5 rounded-full bg-white shadow-sm"
            />
          </motion.button>
          <span className="text-[0.6875rem] text-muted-foreground">{toggled ? t("On", "Ligado") : t("Off", "Desligado")}</span>
        </div>

        {/* Star Rating */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Star Rating", "Avaliação por estrelas")}</div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <motion.button key={n} onClick={() => setRating(n)}
                whileTap={{ scale: 0.75 }}
                animate={{ scale: n <= rating ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}>
                <Star className={`h-6 w-6 transition-colors duration-150 ${n <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              </motion.button>
            ))}
          </div>
          <span className="text-[0.6875rem] text-muted-foreground">{rating > 0 ? `${rating}/5 ${t("stars", "estrelas")}` : t("Rate this", "Avalie")}</span>
        </div>

        {/* Bell notification */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Notification Bell", "Sino de notificação")}</div>
          <motion.button
            onClick={() => { setNotified(true); setTimeout(() => setNotified(false), 1500); }}
            animate={{ rotate: notified ? [0, -20, 20, -15, 15, -8, 8, 0] : 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Bell className={`h-8 w-8 transition-colors duration-200 ${notified ? "text-warning" : "text-muted-foreground"}`} />
            <AnimatePresence>
              {notified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-card flex items-center justify-center"
                >
                  <span className="text-[0.4375rem] text-white font-black">1</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <span className="text-[0.6875rem] text-muted-foreground">{t("Tap to notify", "Toque para notificar")}</span>
        </div>

        {/* Counter */}
        <div className="rounded-[14px] border border-border bg-card p-5 flex flex-col items-center gap-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Counter", "Contador")}</div>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setCounter(c => Math.max(0, c - 1))}
              className="h-8 w-8 rounded-full border border-border bg-muted flex items-center justify-center text-foreground font-bold">
              -
            </motion.button>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={counter}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 12, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[1.5rem] font-black text-foreground w-10 text-center tabular-nums"
              >
                {counter}
              </motion.span>
            </AnimatePresence>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setCounter(c => c + 1)}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              +
            </motion.button>
          </div>
          <span className="text-[0.6875rem] text-muted-foreground">{t("Number flip", "Virada de número")}</span>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 7 — Loaders & Progress
══════════════════════════════════════ */
function LoadersSection() {
  const { t, bi } = useI18n();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setProgress(p => p >= 100 ? 0 : p + 1), 50);
    return () => clearInterval(id);
  }, []);

  return (
    <Section id="loaders" title={t("Loaders & Progress", "Loaders e progresso")} sub={t("Animated loading states that communicate ongoing work.", "Estados de loading animados que comunicam trabalho em andamento.")}>
      <div className="grid grid-cols-3 gap-3">

        {/* Spinner variants */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Spinners", "Spinners")}</div>
          <div className="flex items-center justify-around">
            {/* CSS border spin */}
            <div className="h-7 w-7 rounded-full border-2 border-border border-t-primary animate-spin" />
            {/* Dots */}
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity, ease: "easeInOut" }}
                  className="h-2 w-2 rounded-full bg-primary"
                />
              ))}
            </div>
            {/* Pulse ring */}
            <div className="relative h-7 w-7">
              <motion.div
                animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-primary"
              />
              <div className="absolute inset-[6px] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Progress Bars", "Barras de progresso")}</div>
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[0.6rem] text-muted-foreground">
                <span>{t("Upload", "Envio")}</span><span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} className="h-full bg-primary rounded-full" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[0.6rem] text-muted-foreground">
                <span>{t("Processing", "Processando")}</span><span className="text-warning">75%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden relative">
                <div className="absolute inset-0 h-full w-3/4 bg-warning rounded-full" />
                <motion.div
                  animate={{ x: ["-100%", "133%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Skeleton", "Skeleton")}</div>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              className="h-9 w-9 rounded-full bg-muted shrink-0"
            />
            <div className="flex-1 space-y-2">
              <motion.div animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                className="h-2.5 bg-muted rounded-full w-3/4" />
              <motion.div animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="h-2 bg-muted rounded-full w-1/2" />
            </div>
          </div>
          {[0.3, 0.1, 0.25].map((d, i) => (
            <motion.div key={i}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: d }}
              className={`h-2 bg-muted rounded-full ${i === 2 ? "w-2/3" : "w-full"}`}
            />
          ))}
        </div>

        {/* Step indicator */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Step Indicator", "Indicador de etapas")}</div>
          <StepIndicator />
        </div>

        {/* Circular */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-4 flex flex-col items-start" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Circular Progress", "Progresso circular")}</div>
          <div className="flex-1 flex items-center justify-center w-full">
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--muted)" strokeWidth="6" />
              <motion.circle
                cx="36" cy="36" r="30"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 30}`}
                strokeDashoffset={2 * Math.PI * 30 * (1 - progress / 100)}
                style={{ rotate: -90, transformOrigin: "36px 36px" }}
              />
              <text x="36" y="40" textAnchor="middle" className="text-[0.625rem]" fill="var(--foreground)" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans">
                {progress}%
              </text>
            </svg>
          </div>
        </div>

        {/* Typing dots */}
        <div className="rounded-[14px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Chat States", "Estados de chat")}</div>
          <div className="space-y-3">
            <div className="flex items-end gap-2">
              <div className="h-6 w-6 rounded-full bg-muted shrink-0" />
              <div className="rounded-[10px] rounded-bl-[2px] bg-muted px-3 py-2 flex gap-1 items-center">
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-end gap-2 justify-end">
              <motion.div
                animate={{ opacity: [0, 1], y: [6, 0] }}
                transition={{ duration: 0.3 }}
                className="rounded-[10px] rounded-br-[2px] bg-primary px-3 py-2 max-w-[140px]"
              >
                <p className="text-[0.6875rem] text-primary-foreground">{t("Message sent ✓", "Mensagem enviada ✓")}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepIndicator() {
  const { t, bi } = useI18n();
  const [step, setStep] = useState(1);
  const steps = ["Setup", "Configure", "Done"];
  const stepsPt = ["Preparar", "Configurar", "Pronto"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-0">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <motion.div
              animate={{ backgroundColor: i + 1 <= step ? "var(--primary)" : "var(--muted)", scale: i + 1 === step ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer"
              onClick={() => setStep(i + 1)}
            >
              <motion.div animate={{ scale: i + 1 <= step ? 1 : 0 }} transition={{ duration: 0.2 }}>
                <Check className="h-3 w-3 text-primary-foreground" />
              </motion.div>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-muted overflow-hidden">
                <motion.div
                  animate={{ scaleX: i + 1 < step ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "left" }}
                  className="h-full bg-primary"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between gap-2">
        {steps.map((s, i) => (
          <span key={s} className={`text-[0.5625rem] font-semibold transition-colors duration-200 ${i + 1 <= step ? "text-primary" : "text-muted-foreground"}`}>
            {t(s, stepsPt[i])}
          </span>
        ))}
      </div>
      <div className="flex gap-1.5 justify-center mt-1">
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-2.5 py-1 rounded-[7px] border border-border bg-muted text-[0.625rem] font-medium text-foreground hover:bg-accent transition-colors">
            {t("Back", "Voltar")}
          </button>
        )}
        {step < steps.length && (
          <button onClick={() => setStep(s => s + 1)}
            className="px-2.5 py-1 rounded-[7px] bg-primary text-primary-foreground text-[0.625rem] font-semibold hover:opacity-90 transition-opacity">
            {t("Next", "Próximo")}
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION 8 — Layout Transitions
══════════════════════════════════════ */
function LayoutTransitions() {
  const { t, bi } = useI18n();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab]   = useState(0);
  const tabs = ["Overview", "Analytics", "Settings"];
  const tabsPt = ["Visão geral", "Análises", "Configurações"];
  const items = ["Q4 Report", "Dashboard Alpha", "Customers", "Billing", "Users", "Support"];
  const itemsPt = ["Relatório do T4", "Painel Alpha", "Clientes", "Cobrança", "Usuários", "Suporte"];

  return (
    <Section id="layout" title={t("Layout Transitions", "Transições de layout")} sub={t("Animate layout changes and shared elements with layoutId.", "Anime mudanças de layout e elementos compartilhados com layoutId.")}>
      <div className="grid grid-cols-2 gap-3">

        {/* Grid / List switch */}
        <div className="rounded-[16px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between">
            <div className="text-[0.75rem] font-bold text-foreground">{t("Grid ↔ List", "Grade ↔ Lista")}</div>
            <div className="flex gap-1 p-0.5 bg-muted rounded-[8px]">
              {(["grid", "list"] as const).map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`relative px-2.5 py-1 rounded-[6px] text-[0.625rem] font-semibold transition-colors ${view === v ? "text-foreground" : "text-muted-foreground"}`}>
                  {view === v && (
                    <motion.div layoutId="view-pill" className="absolute inset-0 bg-card rounded-[6px]" style={{ boxShadow: "var(--shadow-xs)" }} />
                  )}
                  <span className="relative z-10">{v === "grid" ? t("grid", "grade") : t("list", "lista")}</span>
                </button>
              ))}
            </div>
          </div>
          <motion.div layout className={`gap-2 ${view === "grid" ? "grid grid-cols-3" : "flex flex-col"}`}>
            {items.map((item, idx) => (
              <motion.div key={item} layout
                className={`bg-muted/40 border border-border rounded-[8px] flex items-center gap-2 ${view === "grid" ? "flex-col p-2.5 text-center" : "px-3 py-2"}`}>
                <div className="h-5 w-5 rounded-[5px] bg-primary/15 shrink-0" />
                <span className="text-[0.625rem] font-medium text-foreground">{t(item, itemsPt[idx])}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Tab underline */}
        <div className="rounded-[16px] border border-border bg-card p-5 space-y-4" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="text-[0.75rem] font-bold text-foreground">{t("Animated Tabs", "Abas animadas")}</div>
          <div className="border-b border-border flex gap-0">
            {tabs.map((tabName, i) => (
              <button key={tabName} onClick={() => setTab(i)}
                className={`relative px-3 py-2 text-[0.75rem] font-semibold transition-colors ${tab === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {t(tabName, tabsPt[i])}
                {tab === i && <motion.div layoutId="tab-under" className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[10px] bg-muted/30 border border-border p-4 min-h-[80px] flex items-center justify-center">
              <span className="text-[0.75rem] text-muted-foreground">{t(tabs[tab], tabsPt[tab])} {t("content", "conteúdo")}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 9 — Design Tokens
══════════════════════════════════════ */
function TokensSection() {
  const { t, bi } = useI18n();
  return (
    <Section id="tokens" title={t("Motion Tokens", "Tokens de movimento")} sub={t("Consistent duration and easing values used across the design system.", "Valores consistentes de duração e easing usados em todo o design system.")}>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-[0.08em] mb-3">{t("Duration", "Duração")}</div>
          <Token name="--duration-instant"   value="80ms"  />
          <Token name="--duration-fast"      value="150ms" />
          <Token name="--duration-normal"    value="250ms" />
          <Token name="--duration-slow"      value="400ms" />
          <Token name="--duration-xslow"     value="600ms" />
        </div>
        <div className="space-y-2">
          <div className="text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-[0.08em] mb-3">Easing</div>
          <Token name="--ease-out"           value="cubic-bezier(0, 0, 0.58, 1)"          />
          <Token name="--ease-in"            value="cubic-bezier(0.42, 0, 1, 1)"           />
          <Token name="--ease-in-out"        value="cubic-bezier(0.42, 0, 0.58, 1)"        />
          <Token name="--ease-snappy"        value="cubic-bezier(0.16, 1, 0.3, 1)"         />
          <Token name="--ease-back"          value="cubic-bezier(0.34, 1.56, 0.64, 1)"     />
        </div>
      </div>

      {/* Duration visual reference */}
      <div className="rounded-[14px] border border-border bg-card p-5 space-y-3 mt-2" style={{ boxShadow: "var(--shadow-xs)" }}>
        <div className="text-[0.75rem] font-bold text-foreground mb-4">{t("Duration Reference", "Referência de duração")}</div>
        <DurationBars />
      </div>
    </Section>
  );
}

function DurationBars() {
  const { t, bi } = useI18n();
  const [key, setKey] = useState(0);
  const durations = [
    { label: "instant",  ms: 80,  color: "bg-chart-1" },
    { label: "fast",     ms: 150, color: "bg-primary" },
    { label: "normal",   ms: 250, color: "bg-chart-2" },
    { label: "slow",     ms: 400, color: "bg-warning" },
    { label: "x-slow",  ms: 600, color: "bg-destructive" },
  ];
  const maxMs = 600;

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-3">
        <button onClick={() => setKey(k => k + 1)} className="flex items-center gap-1 text-[0.625rem] font-semibold text-muted-foreground hover:text-primary transition-colors">
          <RefreshCw className="h-3 w-3" /> {t("replay", "repetir")}
        </button>
      </div>
      {durations.map((d, i) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[0.625rem] font-mono text-muted-foreground w-14 text-right shrink-0">{d.ms}ms</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              key={key}
              initial={{ width: 0 }}
              animate={{ width: `${(d.ms / maxMs) * 100}%` }}
              transition={{ duration: d.ms / 1000, ease: "easeOut", delay: i * 0.04 }}
              className={`h-full rounded-full ${d.color}`}
            />
          </div>
          <span className="text-[0.625rem] font-semibold text-muted-foreground w-12 shrink-0">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   SECTION 10 — Marquee
══════════════════════════════════════ */

const marqueeFeatures = [
  { icon: Zap,      label: "Lightning Fast", labelPt: "Ultrarrápido",   sub: "< 50ms response", subPt: "resposta em < 50ms"    },
  { icon: Star,     label: "5-star Rated", labelPt: "Nota 5 estrelas",     sub: "4.9 avg on G2", subPt: "média 4,9 no G2"      },
  { icon: Check,    label: "SOC 2 Compliant", labelPt: "Em conformidade com SOC 2",  sub: "Enterprise ready", subPt: "Pronto para empresas"   },
  { icon: Sparkles, label: "AI-powered", labelPt: "Com IA",       sub: "Native LLM support", subPt: "Suporte nativo a LLM" },
  { icon: Layers,   label: "Multi-tenant", labelPt: "Multi-tenant",     sub: "Team workspaces", subPt: "Workspaces de equipe"    },
  { icon: Activity, label: "99.99% Uptime", labelPt: "99,99% de uptime",    sub: "SLA guarantee", subPt: "Garantia de SLA"      },
  { icon: Clock,    label: "24/7 Support", labelPt: "Suporte 24/7",     sub: "Always available", subPt: "Sempre disponível"   },
  { icon: Wind,     label: "Edge Network", labelPt: "Rede edge",     sub: "Global CDN", subPt: "CDN global"         },
];

const marqueeReviews = [
  { name: "Ana Souza",   role: "CTO @ TechBR",    quote: "Best tool I've used in years.", quotePt: "A melhor ferramenta que usei em anos.",        stars: 5 },
  { name: "Pedro Lima",  role: "Product @ Scale",  quote: "Setup in 5 minutes. Absolutely incredible.", quotePt: "Configurei em 5 minutos. Simplesmente incrível.",  stars: 5 },
  { name: "Clara Nunes", role: "Dev @ Startup",    quote: "Support is fast and exceptional.", quotePt: "O suporte é rápido e excepcional.",            stars: 5 },
  { name: "Rafa Melo",   role: "CEO @ Innova",     quote: "Completely transformed our workflow.", quotePt: "Transformou completamente nosso workflow.",     stars: 5 },
  { name: "Julia Costa", role: "Design @ Studio",  quote: "Zero learning curve. Perfect.", quotePt: "Zero curva de aprendizado. Perfeito.",         stars: 5 },
  { name: "Bruno Dias",  role: "Eng @ Fintech",    quote: "API integration in under 1 hour.", quotePt: "Integração da API em menos de 1 hora.",       stars: 5 },
];

function MarqueeRow({ items, direction, duration }: {
  items: React.ReactNode[];
  direction: "left" | "right";
  duration: number;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <div className="overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="flex w-max gap-3"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="shrink-0">{item}</div>
        ))}
      </div>
    </div>
  );
}

function MarqueeSection() {
  const { t, bi } = useI18n();
  const featureCards = marqueeFeatures.map((f, i) => {
    const Icon = f.icon;
    return (
      <div key={i} className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] border border-border bg-card" style={{ boxShadow: "var(--shadow-xs)" }}>
        <div className="h-7 w-7 rounded-[8px] bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <div>
          <div className="text-[0.6875rem] font-bold text-foreground whitespace-nowrap">{t(f.label, f.labelPt)}</div>
          <div className="text-[0.5625rem] text-muted-foreground whitespace-nowrap">{t(f.sub, f.subPt)}</div>
        </div>
      </div>
    );
  });

  const reviewCards = marqueeReviews.map((r, i) => (
    <div key={i} className="flex flex-col gap-1.5 px-4 py-3 rounded-[12px] border border-border bg-card" style={{ boxShadow: "var(--shadow-xs)", width: 220 }}>
      <div className="flex gap-0.5">
        {Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="h-2.5 w-2.5 fill-warning text-warning" />)}
      </div>
      <p className="text-[0.6875rem] text-foreground italic leading-snug">"{t(r.quote, r.quotePt)}"</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <div className="h-5 w-5 rounded-full bg-primary/12 flex items-center justify-center shrink-0">
          <span className="text-[0.375rem] font-black text-primary">{r.name.split(" ").map(w => w[0]).join("")}</span>
        </div>
        <div>
          <div className="text-[0.5625rem] font-bold text-foreground whitespace-nowrap">{r.name}</div>
          <div className="text-[0.4375rem] text-muted-foreground whitespace-nowrap">{r.role}</div>
        </div>
      </div>
    </div>
  ));

  return (
    <Section id="marquee" title="Marquee" sub={t("Infinite auto-scrolling ticker. Hover to pause — ideal for logos, reviews, and feature highlights.", "Ticker com rolagem automática infinita. Passe o mouse para pausar — ideal para logos, avaliações e destaques de recursos.")}>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0); }    to { transform: translateX(-50%); } }
        @keyframes marquee-right { from { transform: translateX(-50%); } to { transform: translateX(0); }    }
      `}</style>
      <div
        className="rounded-[16px] border border-border bg-card overflow-hidden py-5 space-y-3"
        style={{
          boxShadow: "var(--shadow-sm)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <MarqueeRow items={featureCards}                          direction="left"  duration={28} />
        <MarqueeRow items={reviewCards}                           direction="right" duration={36} />
        <MarqueeRow items={[...featureCards].reverse()}           direction="left"  duration={22} />
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 11 — Animated List
══════════════════════════════════════ */

type NotifItem = {
  id: string;
  icon: React.ElementType;
  iconCls: string;
  title: string;
  desc: string;
  time: string;
  action?: string;
  titlePt: string;
  descPt: string;
  actionPt?: string;
};

const notifPool: Omit<NotifItem, "id">[] = [
  { icon: Star,       iconCls: "bg-warning/12 text-warning",     title: "New review",     desc: "Ana Souza gave the project 5 stars.", titlePt: "Nova avaliação", descPt: "Ana Souza deu 5 estrelas ao projeto.",    time: "now",  action: "View", actionPt: "Ver"      },
  { icon: Check,      iconCls: "bg-success/12 text-success",     title: "Deploy complete",   desc: "v2.4.1 in production with no errors.", titlePt: "Deploy concluído", descPt: "v2.4.1 em produção sem erros.",         time: "2s"                        },
  { icon: Bell,       iconCls: "bg-primary/12 text-primary",     title: "Payment received", desc: "$1,290 from Company X confirmed.", titlePt: "Pagamento recebido", descPt: "US$ 1.290 da Empresa X confirmados.",           time: "5s",     action: "View", actionPt: "Ver"      },
  { icon: ArrowRight, iconCls: "bg-info/12 text-info",           title: "New user",       desc: "Pedro Lima joined the Pro plan.", titlePt: "Novo usuário", descPt: "Pedro Lima entrou no plano Pro.",             time: "8s"                        },
  { icon: Activity,   iconCls: "bg-chart-4/12 text-chart-4",     title: "Goal reached",      desc: "100 conversions today — monthly record!", titlePt: "Meta atingida", descPt: "100 conversões hoje — recorde do mês!",       time: "12s",    action: "Celebrate", actionPt: "Comemorar" },
  { icon: Zap,        iconCls: "bg-destructive/12 text-destructive", title: "Usage alert",  desc: "API rate limit at 80% — check now.", titlePt: "Alerta de uso", descPt: "Limite de requisições da API em 80% — confira agora.",   time: "16s"                       },
  { icon: Layers,     iconCls: "bg-primary/12 text-primary",     title: "Integration active",   desc: "Slack connected successfully.", titlePt: "Integração ativa", descPt: "Slack conectado com sucesso.",                time: "20s"                       },
  { icon: Sparkles,   iconCls: "bg-warning/12 text-warning",     title: "Report ready",   desc: "Q4 analysis available for download.", titlePt: "Relatório pronto", descPt: "Análise do T4 disponível para download.",     time: "25s",    action: "Download", actionPt: "Baixar"   },
];

function AnimatedListSection() {
  const { t, bi } = useI18n();
  const idxRef = useRef(3);
  const [items, setItems] = useState<NotifItem[]>([
    { ...notifPool[0], id: "init-0" },
    { ...notifPool[1], id: "init-1" },
    { ...notifPool[2], id: "init-2" },
  ]);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timerId = setInterval(() => {
      const next = notifPool[idxRef.current % notifPool.length];
      idxRef.current += 1;
      setItems(prev => [{ ...next, id: `notif-${Date.now()}`, time: "now" }, ...prev].slice(0, 5));
    }, 2000);
    return () => clearInterval(timerId);
  }, [paused]);

  return (
    <Section id="animated-list" title={t("Animated List", "Lista animada")} sub={t("New items appear at the top and push existing ones down — ideal for activity feeds, inboxes, and live alerts.", "Novos itens aparecem no topo e empurram os existentes para baixo — ideal para feeds de atividade, caixas de entrada e alertas em tempo real.")}>
      <div className="max-w-lg mx-auto">
        <div className="rounded-[16px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-success"
              />
              <span className="text-[0.8125rem] font-bold text-foreground">{t("Live notifications", "Notificações ao vivo")}</span>
            </div>
            <button
              onClick={() => setPaused(p => !p)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-border bg-muted text-[0.625rem] font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {paused
                ? <><Play className="h-2.5 w-2.5" /> {t("Resume", "Retomar")}</>
                : <><span className="flex gap-0.5 items-center"><span className="block h-2.5 w-0.5 bg-current rounded-full"/><span className="block h-2.5 w-0.5 bg-current rounded-full"/></span> {t("Pause", "Pausar")}</>
              }
            </button>
          </div>

          {/* Notification list */}
          <div className="p-3 min-h-[260px]">
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map(item => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: -32, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 340, damping: 28 }}
                    className="flex items-center gap-2.5 rounded-[10px] border border-border bg-background/60 px-3 py-2.5 mb-2 last:mb-0"
                    style={{ boxShadow: "var(--shadow-xs)" }}
                  >
                    <div className={`h-8 w-8 rounded-[9px] flex items-center justify-center shrink-0 ${item.iconCls}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[0.75rem] font-bold text-foreground">{t(item.title, item.titlePt)}</span>
                        <span className="text-[0.5625rem] text-muted-foreground shrink-0 font-mono">{item.time === "now" ? t("now", "agora") : item.time}</span>
                      </div>
                      <p className="text-[0.6875rem] text-muted-foreground mt-0.5 truncate">{t(item.desc, item.descPt)}</p>
                    </div>
                    {item.action && (
                      <button className="shrink-0 px-2 py-1 rounded-[6px] bg-primary/10 text-[0.5625rem] font-bold text-primary hover:bg-primary/20 transition-colors whitespace-nowrap">
                        {t(item.action, item.actionPt ?? item.action)}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   SECTION 12 — Orbiting Circles
══════════════════════════════════════ */

type RingIcon = {
  icon: React.ElementType;
  bg: string;
  border: string;
  color: string;
  angleOffset: number; // fixed angle within the ring container (degrees)
  size: number;
};

type OrbitRingDef = {
  radius: number;
  duration: number;
  icons: RingIcon[];
};

/* Icons are evenly spaced by geometry inside a SINGLE rotating container per ring.
   This guarantees they can never drift or overlap — separation is structural, not timed. */
const orbitRings: OrbitRingDef[] = [
  {
    radius: 68, duration: 8,
    icons: [
      { icon: Zap,  bg: "bg-warning/15", border: "border-warning/40", color: "text-warning", angleOffset: 0,   size: 32 },
      { icon: Star, bg: "bg-primary/15", border: "border-primary/40", color: "text-primary", angleOffset: 180, size: 32 },
    ],
  },
  {
    radius: 108, duration: 14,
    icons: [
      { icon: Check,    bg: "bg-success/15", border: "border-success/40", color: "text-success", angleOffset: 0,   size: 36 },
      { icon: Sparkles, bg: "bg-violet/15",  border: "border-violet/40",  color: "text-violet",  angleOffset: 120, size: 36 },
      { icon: Layers,   bg: "bg-info/15",    border: "border-info/40",    color: "text-info",    angleOffset: 240, size: 36 },
    ],
  },
  {
    radius: 152, duration: 20,
    icons: [
      { icon: Activity, bg: "bg-destructive/15", border: "border-destructive/40", color: "text-destructive", angleOffset: 0,   size: 40 },
      { icon: Clock,    bg: "bg-orange/15",      border: "border-orange/40",      color: "text-orange",      angleOffset: 180, size: 40 },
    ],
  },
];

function OrbitRingComponent({ ring, reverse = false, solid = false }: { ring: OrbitRingDef; reverse?: boolean; solid?: boolean }) {
  return (
    /* One rotating container for the whole ring — icons are fixed inside it by geometry */
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{ width: 0, height: 0 }}
      animate={{ rotate: reverse ? [0, -360] : [0, 360] }}
      transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
    >
      {ring.icons.map((item, i) => {
        const Icon = item.icon;
        const rad = (item.angleOffset * Math.PI) / 180;
        const x   = Math.cos(rad) * ring.radius;
        const y   = Math.sin(rad) * ring.radius;

        const bgClass     = solid ? item.bg.replace("/15", "")     : item.bg;
        const borderClass = solid ? item.border.replace("/40", "") : item.border;
        const iconColor   = solid ? "text-white"                   : item.color;
        const shadow      = solid ? "0 4px 14px rgba(0,0,0,0.25), var(--shadow-sm)" : "var(--shadow-sm)";

        return (
          /* Counter-rotate the icon so it stays upright while the container spins */
          <motion.div
            key={i}
            className={`absolute flex items-center justify-center rounded-full border ${bgClass} ${borderClass}`}
            style={{
              width: item.size,
              height: item.size,
              left: x - item.size / 2,
              top:  y - item.size / 2,
              boxShadow: shadow,
            }}
            animate={{ rotate: reverse ? [0, 360] : [0, -360] }}
            transition={{ duration: ring.duration, repeat: Infinity, ease: "linear" }}
          >
            <Icon className={iconColor} style={{ width: item.size * 0.45, height: item.size * 0.45 }} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

const CANVAS = 340;

function OrbitCanvas({ center, reverse = false, solid = false }: { center: React.ReactNode; reverse?: boolean; solid?: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: CANVAS, height: CANVAS }}>
      {/* Dashed orbit paths */}
      {orbitRings.map(ring => (
        <div key={ring.radius} className="absolute rounded-full border border-dashed border-[#B3BDD0] dark:border-[#283043]"
          style={{ width: ring.radius * 2, height: ring.radius * 2, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
      ))}
      {/* Central element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {center}
      </div>
      {/* One rotating group per ring */}
      {orbitRings.map((ring, i) => (
        <OrbitRingComponent key={i} ring={ring} reverse={reverse} solid={solid} />
      ))}
    </div>
  );
}

/* ── Avatar orbit data ── */
type AvatarPerson = {
  name: string;
  role: string;
  photo: string;
  angleOffset: number;
  size: number;
};

type AvatarOrbitRingDef = {
  radius: number;
  duration: number;
  people: AvatarPerson[];
};

const AVATAR_PHOTO = (id: string) =>
  `${id}&crop=faces&fit=crop&w=120&h=120&q=80`;

const avatarRings: AvatarOrbitRingDef[] = [
  {
    radius: 68, duration: 9,
    people: [
      { name: "Marcos Silva", role: "CTO @ TechBR",    angleOffset: 0,   size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?cs=tinysrgb") },
      { name: "Ana Souza",    role: "Design @ Studio",  angleOffset: 180, size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1494790108377-be9c29b29330?cs=tinysrgb") },
    ],
  },
  {
    radius: 112, duration: 15,
    people: [
      { name: "Pedro Lima",   role: "Eng @ Scale",      angleOffset: 0,   size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?cs=tinysrgb") },
      { name: "Clara Nunes",  role: "CEO @ Innova",     angleOffset: 120, size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1506863530036-1efeddceb993?cs=tinysrgb") },
      { name: "Rafa Melo",    role: "Product @ Start",  angleOffset: 240, size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1590086782792-42dd2350140d?cs=tinysrgb") },
    ],
  },
  {
    radius: 158, duration: 22,
    people: [
      { name: "Julia Costa",  role: "Dev @ Fintech",    angleOffset: 60,  size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1607503873903-c5e95f80d7b9?cs=tinysrgb") },
      { name: "Bruno Dias",   role: "Design @ Labs",    angleOffset: 240, size: 34, photo: AVATAR_PHOTO("https://images.unsplash.com/photo-1590086782957-93c06ef21604?cs=tinysrgb") },
    ],
  },
];

type AvatarHoverInfo = { person: AvatarPerson; cx: number; cy: number } | null;

/* AvatarRing — tooltip is NOT rendered here; it lives at canvas level to escape
   all transform stacking contexts. Scale applied directly on the outer div via
   whileHover so no inner compositing layer darkens sibling elements. */
function AvatarRing({
  ring,
  globalPaused,
  onHover,
}: {
  ring: AvatarOrbitRingDef;
  globalPaused: boolean;
  onHover: (info: AvatarHoverInfo) => void;
}) {
  const rot    = useMotionValue(0);
  const negRot = useTransform(rot, v => -v);
  const isPausedRef = useRef(false);

  useEffect(() => { isPausedRef.current = globalPaused; }, [globalPaused]);

  useEffect(() => {
    const degsPerMs = 360 / (ring.duration * 1000);
    let last: number | null = null;
    let rafId: number;
    function tick(t: number) {
      if (!isPausedRef.current) {
        if (last !== null) rot.set((rot.get() + degsPerMs * (t - last)) % 360);
        last = t;
      } else {
        last = null;
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [ring.duration]);

  return (
    <motion.div className="absolute top-1/2 left-1/2" style={{ width: 0, height: 0, rotate: rot }}>
      {ring.people.map((person, i) => {
        const rad = (person.angleOffset * Math.PI) / 180;
        const lx  = Math.cos(rad) * ring.radius;
        const ly  = Math.sin(rad) * ring.radius;

        return (
          <motion.div
            key={i}
            className="absolute cursor-pointer"
            style={{
              width: person.size,
              height: person.size,
              left: lx - person.size / 2,
              top:  ly - person.size / 2,
              rotate: negRot,
              zIndex: 1,
            }}
            /* Scale lives here — same element as rotate so they compose cleanly.
               No inner wrapper div → no extra compositing layer → no gray siblings. */
            whileHover={{ scale: 2, zIndex: 50 }}
            transition={{ type: "spring", stiffness: 340, damping: 22 }}
            onMouseEnter={() => {
              /* Capture canvas-space position at the moment of pause */
              const totalRad = (rot.get() + person.angleOffset) * Math.PI / 180;
              onHover({
                person,
                cx: Math.cos(totalRad) * ring.radius,
                cy: Math.sin(totalRad) * ring.radius,
              });
            }}
            onMouseLeave={() => onHover(null)}
          >
            <img
              src={person.photo}
              alt={person.name}
              draggable={false}
              className="w-full h-full rounded-full object-cover select-none"
              style={{ boxShadow: "0 0 0 2px var(--border), var(--shadow-sm)" }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function AvatarOrbitCanvas() {
  const ACANVAS = 360;
  const [hovered, setHovered] = useState<AvatarHoverInfo>(null);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: ACANVAS, height: ACANVAS, overflow: "visible" }}
    >
      {/* Orbit path rings */}
      {avatarRings.map(ring => (
        <div
          key={ring.radius}
          className="absolute rounded-full border border-dashed border-[#B3BDD0] dark:border-[#283043]"
          style={{ width: ring.radius * 2, height: ring.radius * 2, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      ))}

      {/* Central element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-16 rounded-full bg-primary flex items-center justify-center border-2 border-primary/50"
          style={{ boxShadow: "0 0 28px 6px color-mix(in srgb, var(--primary) 25%, transparent), var(--shadow-lg)" }}
        >
          <Users className="h-8 w-8 text-white" />
        </motion.div>
      </div>

      {/* Rings — all pause together via globalPaused */}
      {avatarRings.map((ring, i) => (
        <AvatarRing
          key={i}
          ring={ring}
          globalPaused={hovered !== null}
          onHover={setHovered}
        />
      ))}

      {/* ── Tooltip rendered at canvas level ──
          Lives outside every ring's transform stacking context so z-index: 9999
          actually works. Position derived from canvas-space coordinates captured
          at hover time. */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.person.name}
            initial={{ opacity: 0, scale: 0.88, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute pointer-events-none"
            style={{
              /* Center on the avatar, then lift above 2× expanded size + gap */
              left: `calc(50% + ${hovered.cx}px)`,
              top:  `calc(50% + ${hovered.cy}px)`,
              transform: `translate(-50%, calc(-100% - ${hovered.person.size + 10}px))`,
              zIndex: 9999,
            }}
          >
            <div
              className="whitespace-nowrap rounded-[9px] border border-border bg-popover text-popover-foreground px-3 py-2"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <div className="text-[0.75rem] font-bold leading-tight">{hovered.person.name}</div>
              <div className="text-[0.625rem] text-muted-foreground leading-tight mt-0.5">{hovered.person.role}</div>
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 overflow-hidden" style={{ width: 12, height: 7 }}>
              <div className="w-3 h-3 bg-popover border-r border-b border-border rotate-45 mx-auto" style={{ marginTop: -6 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OrbitingCirclesSection() {
  const { t, bi } = useI18n();
  return (
    <Section id="orbiting-circles" title={t("Orbiting Circles", "Círculos em órbita")} sub={t("Icons orbit a central element at different radii and speeds — great for feature showcases and product hero sections.", "Ícones orbitam um elemento central em raios e velocidades diferentes — ótimo para vitrines de recursos e seções hero de produto.")}>
      <div className="grid grid-cols-2 gap-4">

        {/* Forward orbit */}
        <div className="rounded-[16px] border border-border bg-card flex flex-col items-center gap-3 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Clockwise", "Sentido horário")}</div>
          <OrbitCanvas
            center={
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-16 w-16 rounded-full bg-primary/12 border border-primary/30 flex items-center justify-center"
                style={{ boxShadow: "0 0 30px 6px color-mix(in srgb, var(--primary) 15%, transparent), var(--shadow-lg)" }}
              >
                <Wind className="h-8 w-8 text-primary" />
              </motion.div>
            }
          />
        </div>

        {/* Reverse orbit */}
        <div className="rounded-[16px] border border-border bg-card flex flex-col items-center gap-3 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="text-[0.75rem] font-bold text-foreground self-start">{t("Counterclockwise", "Sentido anti-horário")}</div>
          <OrbitCanvas
            reverse
            center={
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 rounded-full bg-chart-4/12 border border-chart-4/30 flex items-center justify-center"
                style={{ boxShadow: "0 0 30px 6px color-mix(in srgb, var(--chart-4) 15%, transparent), var(--shadow-lg)" }}
              >
                <Sparkles className="h-8 w-8 text-chart-4" />
              </motion.div>
            }
          />
        </div>

        {/* Solid variant — full width */}
        <div className="col-span-2 rounded-[16px] border border-border bg-card flex flex-col items-center gap-1 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between w-full mb-1">
            <div className="text-[0.75rem] font-bold text-foreground">{t("Solid icons", "Ícones sólidos")}</div>
            <span className="text-[0.625rem] text-muted-foreground px-2 py-0.5 rounded-full border border-border bg-muted">{t("solid background", "fundo sólido")}</span>
          </div>
          <OrbitCanvas
            solid
            center={
              <motion.div
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="h-16 w-16 rounded-full bg-primary border-2 border-primary flex items-center justify-center"
                style={{ boxShadow: "0 0 30px 8px color-mix(in srgb, var(--primary) 30%, transparent), var(--shadow-lg)" }}
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
            }
          />
        </div>

        {/* Avatar variant — full width */}
        <div className="col-span-2 rounded-[16px] border border-border bg-card flex flex-col items-center gap-1 p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
          <div className="flex items-center justify-between w-full mb-2">
            <div>
              <div className="text-[0.75rem] font-bold text-foreground">{t("Avatars with tooltip", "Avatares com tooltip")}</div>
              <div className="text-[0.6875rem] text-muted-foreground">{t("Hover over an avatar to pause and see the name", "Passe o mouse sobre um avatar para pausar e ver o nome")}</div>
            </div>
            <span className="text-[0.625rem] text-muted-foreground px-2 py-0.5 rounded-full border border-border bg-muted">{t("hover to pause", "passe o mouse para pausar")}</span>
          </div>
          <AvatarOrbitCanvas />
        </div>

      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   CARD ANIMATIONS — Wobble Card
══════════════════════════════════════ */

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

type SpotlightOption = {
  id: string;
  label: string;
  labelPt: string;
  swatch: string | null;       // null = no spotlight
  rgba: (alpha: number) => string;
};

const SPOTLIGHT_OPTIONS: SpotlightOption[] = [
  { id: "none",    label: "None", labelPt: "Nenhum", swatch: null,      rgba: () => "none" },
  { id: "crimson", label: "Crimson", labelPt: "Carmesim", swatch: "#D44D4D", rgba: a => `rgba(212,77,77,${a})` },
  { id: "blue",    label: "Blue", labelPt: "Azul", swatch: "#3B82F6", rgba: a => `rgba(59,130,246,${a})` },
  { id: "teal",    label: "Teal", labelPt: "Verde-azulado", swatch: "#14B8A6", rgba: a => `rgba(20,184,166,${a})` },
  { id: "purple",  label: "Purple", labelPt: "Roxo", swatch: "#A855F7", rgba: a => `rgba(168,85,247,${a})` },
  { id: "amber",   label: "Amber", labelPt: "Âmbar", swatch: "#F59E0B", rgba: a => `rgba(245,158,11,${a})` },
];

function WobbleCardDemo({
  dark, spotlightId, wobbleEnabled,
}: {
  dark: boolean;
  spotlightId: string;
  wobbleEnabled: boolean;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22 });

  const spotlight = SPOTLIGHT_OPTIONS.find(o => o.id === spotlightId)!;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (wobbleEnabled) {
      const rect = cardRef.current!.getBoundingClientRect();
      const xp = (e.clientX - rect.left) / rect.width;
      const yp = (e.clientY - rect.top) / rect.height;
      rx.set((yp - 0.5) * -16);
      ry.set((xp - 0.5) * 16);
      if (glowRef.current && spotlightId !== "none") {
        const alpha = dark ? 0.22 : 0.16;
        glowRef.current.style.background =
          `radial-gradient(140px circle at ${xp * 100}% ${yp * 100}%, ${spotlight.rgba(alpha)}, transparent 70%)`;
      }
    } else if (glowRef.current && spotlightId !== "none") {
      const rect = cardRef.current!.getBoundingClientRect();
      const xp = (e.clientX - rect.left) / rect.width;
      const yp = (e.clientY - rect.top) / rect.height;
      const alpha = dark ? 0.22 : 0.16;
      glowRef.current.style.background =
        `radial-gradient(140px circle at ${xp * 100}% ${yp * 100}%, ${spotlight.rgba(alpha)}, transparent 70%)`;
    }
  }, [rx, ry, dark, wobbleEnabled, spotlightId, spotlight]);

  const onLeave = useCallback(() => {
    rx.set(0); ry.set(0);
    if (glowRef.current) glowRef.current.style.background = "none";
  }, [rx, ry]);

  /* When wobble is disabled, snap back to flat */
  useEffect(() => {
    if (!wobbleEnabled) { rx.set(0); ry.set(0); }
  }, [wobbleEnabled, rx, ry]);

  /* Clear spotlight when option changes to none */
  useEffect(() => {
    if (spotlightId === "none" && glowRef.current) {
      glowRef.current.style.background = "none";
    }
  }, [spotlightId]);

  const bg  = dark ? "#1C2333" : "#FFFFFF";
  const bdr = dark ? "rgba(255,255,255,0.09)" : "rgba(19,26,39,0.09)";

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX: wobbleEnabled ? srx : 0,
        rotateY: wobbleEnabled ? sry : 0,
        transformPerspective: 900,
        position: "relative", cursor: "default", borderRadius: 18, overflow: "hidden",
        background: bg, border: `1px solid ${bdr}`,
        boxShadow: dark ? "0 20px 60px rgba(0,0,0,0.7)" : "0 20px 60px rgba(0,0,0,0.12)",
        maxWidth: 300, width: "100%",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div ref={glowRef} style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: 18 }} />
      <div style={{ position: "relative", zIndex: 1, padding: "24px 24px 20px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, border: `1px solid ${dark ? "rgba(212,77,77,0.30)" : "rgba(212,77,77,0.20)"}`, background: dark ? "rgba(212,77,77,0.10)" : "rgba(212,77,77,0.07)", marginBottom: 12 }}>
          <Star style={{ width: 10, height: 10, color: "#D44D4D" }} />
          <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: "#D44D4D", textTransform: "uppercase", letterSpacing: "0.06em" }}>Enterprise</span>
        </div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: dark ? "#E4E9F0" : "#131A27", lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 8 }}>
          {t("Bank-grade", "Segurança")}<br />{t("security.", "nível bancário.")}
        </h3>
        <p style={{ fontSize: "0.75rem", color: dark ? "#627288" : "#8898B0", lineHeight: 1.6, marginBottom: 16 }}>
          {t("SOC 2 Type II, end-to-end encryption and complete access auditing.", "SOC 2 Tipo II, criptografia de ponta a ponta e auditoria completa de acessos.")}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
          {[t("SSO & mandatory MFA", "SSO e MFA obrigatório"), t("Real-time audit log", "Log de auditoria em tempo real"), t("RBAC per workspace", "RBAC por workspace")].map(item => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: "rgba(212,77,77,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Check style={{ width: 9, height: 9, color: "#D44D4D" }} />
              </div>
              <span style={{ fontSize: "0.6875rem", color: dark ? "#8898B0" : "#627288", fontWeight: 500 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 1, background: dark ? "rgba(255,255,255,0.06)" : "rgba(19,26,39,0.07)", marginBottom: 16 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "1.375rem", fontWeight: 900, color: dark ? "#E4E9F0" : "#131A27" }}>R$499</span>
            <span style={{ fontSize: "0.625rem", color: dark ? "#495669" : "#8898B0" }}>{t("/mo", "/mês")}</span>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "#D44D4D", color: "#fff", fontSize: "0.6875rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
            {t("Subscribe", "Contratar")} <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function WobbleCardSection() {
  const { t, bi } = useI18n();
  const dark = useDarkMode();
  const [spotlightId,   setSpotlightId]   = useState("crimson");
  const [wobbleEnabled, setWobbleEnabled] = useState(true);

  const ctrl = dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)";
  const activeStyle = { border: "1.5px solid #D44D4D", background: "rgba(212,77,77,0.08)", color: "#D44D4D" };
  const idleColor   = dark ? "#8898B0" : "#627288";

  return (
    <Section
      id="wobble-card"
      title={t("Wobble Card", "Card com wobble")}
      sub={t("Card with 3D perspective that tilts as the mouse moves. Configure the spotlight and motion below.", "Card com perspectiva 3D que inclina conforme o mouse se move. Configure o spotlight e o movimento abaixo.")}
    >
      <div className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
        {/* Preview */}
        <div
          className="flex items-center justify-center p-12"
          style={{ background: dark ? "#0D1119" : "#ECF0F5", minHeight: 300 }}
        >
          <WobbleCardDemo dark={dark} spotlightId={spotlightId} wobbleEnabled={wobbleEnabled} />
        </div>

        {/* Controls */}
        <div className="border-t border-border bg-card px-5 py-3.5 flex flex-wrap items-center gap-6">

          {/* Spotlight color */}
          <div className="flex items-center gap-3">
            <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Spotlight</span>
            <div className="flex flex-wrap gap-1.5">
              {SPOTLIGHT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSpotlightId(opt.id)}
                  title={t(opt.label, opt.labelPt)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                  style={spotlightId === opt.id
                    ? activeStyle
                    : { border: `1.5px solid ${ctrl}`, background: "transparent", color: idleColor }}
                >
                  {opt.swatch ? (
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: opt.swatch, display: "inline-block", flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 10, height: 10, borderRadius: "50%", border: `1.5px solid ${idleColor}`, display: "inline-block", flexShrink: 0 }} />
                  )}
                  {t(opt.label, opt.labelPt)}
                </button>
              ))}
            </div>
          </div>

          {/* Wobble toggle */}
          <div className="flex items-center gap-3">
            <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{t("Motion", "Movimento")}</span>
            {[{ id: true, label: t("On", "Ativo") }, { id: false, label: t("Off", "Inativo") }].map(opt => (
              <button
                key={String(opt.id)}
                onClick={() => setWobbleEnabled(opt.id)}
                className="px-3 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={wobbleEnabled === opt.id
                  ? activeStyle
                  : { border: `1.5px solid ${ctrl}`, background: "transparent", color: idleColor }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Docs */}
        <div className="border-t border-border bg-card p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <p className="text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("Technique", "Técnica")}</p>
            <p className="text-[0.75rem] text-foreground leading-relaxed">
              <code className="text-primary text-[0.6875rem]">useMotionValue</code> + <code className="text-primary text-[0.6875rem]">useSpring</code> {t("for", "para")} <code className="text-primary text-[0.6875rem]">rotateX/Y</code> {t("with damping. Spotlight via dynamic", "com amortecimento. Spotlight via")} <code className="text-primary text-[0.6875rem]">radial-gradient</code> {t("in the DOM.", "dinâmico no DOM.")}
            </p>
          </div>
          <div>
            <p className="text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("Use when", "Quando usar")}</p>
            <ul className="space-y-1">
              {[t("Pricing card for a recommended plan.", "Card de preço para um plano recomendado."), t("Feature card that needs to stand out.", "Card de recurso que precisa se destacar."), t("Premium product or testimonial card.", "Card de produto premium ou depoimento.")].map(w => (
                <li key={w} className="flex items-start gap-1.5 text-[0.75rem] text-foreground">
                  <Check className="h-3.5 w-3.5 shrink-0 mt-0.5 text-green-500" />{w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[0.6875rem] font-bold text-muted-foreground uppercase tracking-wider mb-2">{t("Avoid when", "Evitar quando")}</p>
            <ul className="space-y-1">
              {[t("Mobile — without a cursor the effect is static.", "Mobile — sem cursor o efeito fica estático."), t("Many wobble cards in the same grid.", "Vários cards com wobble no mesmo grid."), t("Content with tables or nested grids.", "Conteúdo com tabelas ou grids aninhados.")].map(w => (
                <li key={w} className="flex items-start gap-1.5 text-[0.75rem] text-muted-foreground">
                  <span className="shrink-0 mt-0.5 text-destructive font-bold">×</span>{w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ══════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════ */
export function MotionShowcase() {
  const { t, bi } = useI18n();
  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[20px] border border-border bg-card p-8" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-chart-4/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="relative flex items-start gap-6">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="h-14 w-14 rounded-[14px] bg-primary/12 border border-primary/20 flex items-center justify-center shrink-0"
          >
            <Wind className="h-7 w-7 text-primary" />
          </motion.div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary text-[0.75rem] font-semibold mb-3">
              <Activity className="h-3 w-3" /> {t("Motion Design", "Motion design")}
            </div>
            <h1 className="text-[1.375rem] font-black text-foreground tracking-[-0.03em] mb-2">
              {t("Animations & Motion", "Animações e movimento")}
            </h1>
            <p className="text-[0.875rem] text-muted-foreground max-w-xl leading-relaxed">
              {t("Motion principles, enter and exit presets, spring physics, micro-interactions and duration/easing tokens used across the design system.", "Princípios de movimento, presets de entrada e saída, física de spring, microinterações e tokens de duração/easing usados em todo o design system.")}
            </p>
          </div>
        </div>

        {/* Principles row */}
        <div className="relative mt-8 grid grid-cols-4 gap-3">
          {[
            { icon: Clock,      label: "Purposeful", labelPt: "Com propósito",  desc: "Every animation has a reason — no gratuitous motion.", descPt: "Toda animação tem um motivo — sem movimento gratuito."   },
            { icon: Zap,        label: "Responsive", labelPt: "Responsivo",  desc: "Instant feedback (<100ms) for all interactive elements.", descPt: "Feedback instantâneo (<100ms) em todos os elementos interativos." },
            { icon: Wind,       label: "Natural", labelPt: "Natural",     desc: "Spring physics mirror real-world motion and weight.", descPt: "A física de spring reflete o movimento e o peso do mundo real."     },
            { icon: Sparkles,   label: "Consistent", labelPt: "Consistente",  desc: "Shared tokens ensure cohesive motion across surfaces.", descPt: "Tokens compartilhados garantem movimento coeso em todas as superfícies."   },
          ].map(p => {
            const Icon = p.icon;
            return (
              <div key={p.label} className="rounded-[12px] border border-border bg-muted/30 p-3.5">
                <Icon className="h-4 w-4 text-primary mb-2" />
                <div className="text-[0.75rem] font-bold text-foreground mb-0.5">{t(p.label, p.labelPt)}</div>
                <div className="text-[0.6125rem] text-muted-foreground leading-snug">{t(p.desc, p.descPt)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <EnterPresets />
      <EasingReference />
      <SpringPhysics />
      <StaggerSection />
      <HoverSection />
      <MicroInteractions />
      <LoadersSection />
      <LayoutTransitions />
      <MarqueeSection />
      <AnimatedListSection />
      <OrbitingCirclesSection />
      <WobbleCardSection />
      <TokensSection />
    </div>
  );
}
