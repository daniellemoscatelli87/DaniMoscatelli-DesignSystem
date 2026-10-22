import React, {
  useState, useEffect, useRef, useCallback,
} from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  Zap, Shield, BarChart2, TrendingUp, Package,
  Check, ArrowRight,
} from "lucide-react";

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

/* ══════════════════════════════════════════════════════════
   1. GRADIENT ANIMATION BACKGROUND
   Inspiration: Aceternity Background Gradient Animation
   Animated color blobs that create an organic atmosphere
══════════════════════════════════════════════════════════ */

/* 10 trajectory slots — each selected color takes one slot */
const BLOB_SLOTS = [
  { w: 620, h: 620, top: "0%",   left: "0%",   x: ["0%","28%","-18%","0%"],   y: ["0%","22%","42%","0%"],    dur: 18 },
  { w: 520, h: 520, top: "-10%", left: "55%",  x: ["55%","30%","68%","55%"],   y: ["-10%","38%","6%","-10%"], dur: 23 },
  { w: 560, h: 560, top: "50%",  left: "-12%", x: ["-12%","42%","14%","-12%"], y: ["50%","8%","68%","50%"],   dur: 16 },
  { w: 360, h: 360, top: "55%",  left: "65%",  x: ["65%","18%","78%","65%"],   y: ["55%","78%","18%","55%"],  dur: 21 },
  { w: 460, h: 460, top: "25%",  left: "25%",  x: ["25%","-22%","48%","25%"],  y: ["25%","58%","-12%","25%"], dur: 19 },
  { w: 420, h: 420, top: "5%",   left: "-28%", x: ["-28%","58%","8%","-28%"],  y: ["5%","48%","78%","5%"],    dur: 25 },
  { w: 500, h: 500, top: "45%",  left: "48%",  x: ["48%","8%","68%","48%"],    y: ["45%","18%","68%","45%"],  dur: 14 },
  { w: 320, h: 320, top: "75%",  left: "18%",  x: ["18%","68%","-12%","18%"],  y: ["75%","8%","38%","75%"],   dur: 22 },
  { w: 480, h: 480, top: "8%",   left: "75%",  x: ["75%","48%","88%","75%"],   y: ["8%","38%","28%","8%"],    dur: 17 },
  { w: 380, h: 380, top: "-18%", left: "38%",  x: ["38%","78%","18%","38%"],   y: ["-18%","28%","58%","-18%"],dur: 20 },
];

/* Dark palette — visible swatches + matching blob color */
type PaletteEntry = { id: string; group: "Graphite" | "Crimson"; label: string; display: string; blob: string };

const DARK_PALETTE: PaletteEntry[] = [
  { id: "g900", group: "Graphite", label: "G-900", display: "#131A27", blob: "rgba(19,26,39,0.90)"   },
  { id: "g800", group: "Graphite", label: "G-800", display: "#1C2333", blob: "rgba(28,35,51,0.85)"   },
  { id: "g700", group: "Graphite", label: "G-700", display: "#283043", blob: "rgba(40,48,67,0.80)"   },
  { id: "g600", group: "Graphite", label: "G-600", display: "#374155", blob: "rgba(55,65,85,0.68)"   },
  { id: "g500", group: "Graphite", label: "G-500", display: "#495669", blob: "rgba(73,86,105,0.58)"  },
  { id: "c950", group: "Crimson",  label: "C-950", display: "#220505", blob: "rgba(34,5,5,0.82)"     },
  { id: "c900", group: "Crimson",  label: "C-900", display: "#3A0909", blob: "rgba(58,9,9,0.72)"     },
  { id: "c700", group: "Crimson",  label: "C-700", display: "#8C1B1B", blob: "rgba(139,27,27,0.52)"  },
  { id: "c500", group: "Crimson",  label: "C-500", display: "#B82828", blob: "rgba(184,40,40,0.38)"  },
  { id: "c400", group: "Crimson",  label: "C-400", display: "#D44D4D", blob: "rgba(212,77,77,0.26)"  },
];

/* Paleta light */
const LIGHT_PALETTE: PaletteEntry[] = [
  { id: "white", group: "Graphite", label: "White",  display: "#FFFFFF", blob: "rgba(255,255,255,1.00)" },
  { id: "g50",   group: "Graphite", label: "G-50",   display: "#EDF0F5", blob: "rgba(237,240,245,0.95)" },
  { id: "g100",  group: "Graphite", label: "G-100",  display: "#D6DCE6", blob: "rgba(214,220,230,0.90)" },
  { id: "g200",  group: "Graphite", label: "G-200",  display: "#B3BDD0", blob: "rgba(179,189,208,0.82)" },
  { id: "g300",  group: "Graphite", label: "G-300",  display: "#8898B0", blob: "rgba(136,152,176,0.62)" },
  { id: "g400",  group: "Graphite", label: "G-400",  display: "#627288", blob: "rgba(98,114,136,0.48)"  },
  { id: "c50",   group: "Crimson",  label: "C-50",   display: "#FDF2F2", blob: "rgba(253,242,242,1.00)" },
  { id: "c100",  group: "Crimson",  label: "C-100",  display: "#F5C6C6", blob: "rgba(245,198,198,0.78)" },
  { id: "c200",  group: "Crimson",  label: "C-200",  display: "#E88080", blob: "rgba(232,128,128,0.38)" },
  { id: "c400l", group: "Crimson",  label: "Primary", display: "#D44D4D", blob: "rgba(212,77,77,0.22)"  },
];

const DEFAULT_DARK  = ["g700", "c900", "g800", "c700"];
const DEFAULT_LIGHT = ["g50", "c50", "g100", "c200"];
const MAX_BLOBS = 8;

/* Core blob renderer — accepts a dynamic array of colors */
function GradientAnimBg({
  dark, blobColors, children,
}: { dark: boolean; blobColors: string[]; children: React.ReactNode }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: dark ? "#0D1119" : "#FFFFFF" }}>
      {BLOB_SLOTS.slice(0, blobColors.length).map((slot, i) => (
        <motion.div key={i}
          style={{
            position: "absolute",
            width: slot.w, height: slot.h,
            borderRadius: "50%",
            background: blobColors[i],
            filter: "blur(90px)",
            top: slot.top, left: slot.left,
          }}
          animate={{ x: slot.x, y: slot.y }}
          transition={{ duration: slot.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        />
      ))}
      <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* Color swatch button */
function Swatch({
  entry, active, disabled, onToggle,
}: { entry: PaletteEntry; active: boolean; disabled: boolean; onToggle: () => void }) {
  const isWhite = entry.display === "#FFFFFF";
  return (
    <button
      onClick={onToggle}
      title={`${entry.label}${active ? " — click to remove" : disabled ? " — maximum reached" : " — click to add"}`}
      style={{
        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
        background: entry.display,
        border: active
          ? "2.5px solid #D44D4D"
          : isWhite
            ? "2px solid rgba(0,0,0,0.18)"
            : "2px solid rgba(255,255,255,0.10)",
        boxShadow: active ? "0 0 0 1px rgba(212,77,77,0.40)" : "none",
        cursor: disabled && !active ? "not-allowed" : "pointer",
        opacity: disabled && !active ? 0.35 : 1,
        transform: active ? "scale(1.20)" : "scale(1)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        position: "relative",
      }}
    >
      {active && (
        <span style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.5rem", color: isWhite ? "#D44D4D" : "#fff",
          fontWeight: 900, userSelect: "none",
        }}>✓</span>
      )}
    </button>
  );
}

/* Inline control panel — lives inside the card, outside the preview */
function GradientControls({
  dark, activeIds, onToggle,
}: { dark: boolean; activeIds: string[]; onToggle: (id: string) => void }) {
  const palette    = dark ? DARK_PALETTE : LIGHT_PALETTE;
  const graphite   = palette.filter(e => e.group === "Graphite");
  const crimson    = palette.filter(e => e.group === "Crimson");
  const maxReached = activeIds.length >= MAX_BLOBS;

  return (
    <div className="px-5 py-4 border-b border-border flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
          Blob colors
        </span>
        <span className={`text-[0.625rem] font-bold px-2 py-0.5 rounded-full ${
          maxReached
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}>
          {activeIds.length}/{MAX_BLOBS} ativas
        </span>
      </div>

      {/* Groups */}
      {[
        { label: "Graphite", entries: graphite },
        { label: "Crimson",  entries: crimson  },
      ].map(({ label, entries }) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-[0.625rem] font-bold uppercase tracking-[0.06em] text-muted-foreground/60 w-12 shrink-0">
            {label}
          </span>
          <div className="flex gap-2 flex-wrap">
            {entries.map(e => (
              <Swatch key={e.id} entry={e}
                active={activeIds.includes(e.id)}
                disabled={maxReached && !activeIds.includes(e.id)}
                onToggle={() => onToggle(e.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Dedicated card for Gradient Animation — combines preview + controls + docs */
function GradientAnimCard() {
  const dark = useDarkMode();

  const [activeIds, setActiveIds] = useState<string[]>(() =>
    dark ? DEFAULT_DARK : DEFAULT_LIGHT
  );
  const [tab, setTab] = useState<"spec" | "usage">("spec");

  useEffect(() => {
    setActiveIds(dark ? DEFAULT_DARK : DEFAULT_LIGHT);
  }, [dark]);

  const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
  const blobColors = activeIds
    .map(id => palette.find(e => e.id === id)?.blob)
    .filter(Boolean) as string[];

  const toggle = useCallback((id: string) => {
    setActiveIds(prev => {
      if (prev.includes(id)) return prev.length > 1 ? prev.filter(x => x !== id) : prev;
      if (prev.length >= MAX_BLOBS) return prev;
      return [...prev, id];
    });
  }, []);

  const name        = "Gradient Animation";
  const description = "Color blobs that move to create an organic atmosphere. Select up to 8 colors from the graphite + crimson palette directly below.";
  const technique   = "motion/react blobs (circular divs with filter: blur) animated in a loop with repeatType 'mirror'. 10 predefined trajectory slots. Select and combine palette colors freely — each active color takes one slot.";
  const tags: EffectTag[] = ["Animado"];
  const components  = ["Hero section", "Login page", "Splash screen", "Product landing"];
  const useWhen     = [
    "Product hero with a premium tone and immersive visuals.",
    "When you want to create energy without decorative elements.",
    "High-value conversion pages (Enterprise, Custom pricing).",
  ];
  const avoidWhen   = [
    "Very dense content — the motion competes with reading.",
    "Use across multiple sections — reserve for the hero only.",
    "Marca que prioriza austeridade absoluta.",
  ];

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
      {/* Preview — clean, no overlay */}
      <div className="h-80 relative overflow-hidden">
        <GradientAnimPreview dark={dark} blobColors={blobColors} />
      </div>

      {/* Color controls — between preview and docs */}
      <GradientControls dark={dark} activeIds={activeIds} onToggle={toggle} />

      {/* Info — same as the default EffectCard */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-[0.9375rem] font-black text-foreground tracking-[-0.025em]">{name}</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-[5px] text-[0.5625rem] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: tagColors[t].bg, color: tagColors[t].color }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-[10px] bg-muted w-fit">
          {(["spec", "usage"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-[8px] text-[0.75rem] font-semibold transition-colors
                ${tab === t ? "bg-card text-foreground" : "text-muted-foreground"}`}>
              {t === "spec" ? "Technique" : "When to use"}
            </button>
          ))}
        </div>

        {tab === "spec" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Implementation</p>
              <p className="text-[0.8125rem] text-foreground/80 mt-0.5 leading-relaxed">{technique}</p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Compatible components</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {components.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-[5px] bg-muted text-[0.75rem] text-foreground/80">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "usage" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em]" style={{ color: "#4fb57b" }}>✓ Use when</p>
              <ul className="mt-1.5 space-y-1">
                {useWhen.map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#4fb57b" }} />{w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-destructive">✕ Avoid when</p>
              <ul className="mt-1.5 space-y-1">
                {avoidWhen.map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive shrink-0 mt-0.5 text-[0.75rem]">✕</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Pure preview — no controls, just the effect */
function GradientAnimPreview({ dark, blobColors }: { dark: boolean; blobColors: string[] }) {
  return (
    <GradientAnimBg dark={dark} blobColors={blobColors}>
      <HeroContent dark={dark} />
    </GradientAnimBg>
  );
}

/* ══════════════════════════════════════════════════════════
   2. CANVAS REVEAL EFFECT
   Inspiration: Aceternity Canvas Reveal Effect
   Cards: hover reveals an animated canvas of colored dots
══════════════════════════════════════════════════════════ */

type RGB = [number, number, number];

type CanvasPreset = { id: string; label: string; swatches: string[]; colors: RGB[] };

const CANVAS_PRESETS: CanvasPreset[] = [
  { id: "crimson",  label: "Crimson",  swatches: ["#D44D4D","#B82828","#E88080"], colors: [[212,77,77],[184,40,40],[232,128,128]] },
  { id: "graphite", label: "Graphite", swatches: ["#374155","#627288","#B3BDD0"], colors: [[55,65,85],[73,86,105],[136,152,176]] },
  { id: "ember",    label: "Ember",    swatches: ["#FF6B35","#F59E0B","#D44D4D"], colors: [[255,107,53],[245,158,11],[212,77,77]] },
  { id: "aurora",   label: "Aurora",   swatches: ["#0EA5E9","#10B981","#A855F7"], colors: [[14,165,233],[16,185,129],[168,85,247]] },
  { id: "rose",     label: "Rose",     swatches: ["#F43F5E","#FB7185","#E11D48"], colors: [[244,63,94],[251,113,133],[225,29,72]] },
];

const DOT_SIZES = [
  { id: "xs", label: "XP", px: 2 },
  { id: "sm", label: "P",  px: 4 },
  { id: "md", label: "M",  px: 6 },
  { id: "lg", label: "G",  px: 10 },
];

const ANIM_SPEEDS = [
  { id: "slow",   label: "Lenta",  val: 2 },
  { id: "normal", label: "Normal", val: 4 },
  { id: "fast",   label: "Fast", val: 8 },
];

/* Animated dot canvas — mounted via AnimatePresence on card hover */
function CanvasRevealEffect({
  colors = [[212, 77, 77]] as RGB[],
  dotSize = 4,
  animationSpeed = 4,
}: {
  colors?: RGB[];
  dotSize?: number;
  animationSpeed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (!W || !H) return;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const CELL  = dotSize * 5;
    const cols  = Math.ceil(W / CELL);
    const rows  = Math.ceil(H / CELL);
    const n     = cols * rows;
    const phases = new Float32Array(n).map(() => Math.random() * Math.PI * 2);
    const cIdx   = new Uint8Array(n).map(() => Math.floor(Math.random() * colors.length));
    const speed  = animationSpeed * 0.018;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += speed;
      const gap = Math.max(1, Math.round(CELL * 0.12));
      for (let i = 0; i < n; i++) {
        const a = Math.max(0, Math.sin(t + phases[i]));
        if (a < 0.02) continue;
        const r_ = Math.floor(i / cols);
        const c_ = i % cols;
        const [rr, gg, bb] = colors[cIdx[i]];
        ctx.globalAlpha = a * 0.92;
        ctx.fillStyle   = `rgb(${rr},${gg},${bb})`;
        ctx.fillRect(c_ * CELL + gap, r_ * CELL + gap, dotSize, dotSize);
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [colors, dotSize, animationSpeed]);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
  );
}

/* Corner "+" icon */
function CornerIcon({ pos }: { pos: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="currentColor"
      style={{ position: "absolute", width: 20, height: 20, color: "rgba(255,255,255,0.25)", ...Object.fromEntries(pos.split(" ").map(p => [p === "top" ? "top" : p === "bottom" ? "bottom" : p === "left" ? "left" : "right", -10])) }}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}

/* Single reveal card */
type RevealCardDef = { icon: React.ReactNode; title: string; bg: string };

function RevealCardItem({
  card, colors, dotSize, animationSpeed,
}: {
  card: RevealCardDef;
  colors: RGB[];
  dotSize: number;
  animationSpeed: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", height: 300,
        background: card.bg,
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", cursor: "pointer",
      }}
    >
      {/* Corner icons */}
      {[{top:-10,left:-10},{bottom:-10,left:-10},{top:-10,right:-10},{bottom:-10,right:-10}].map((s,i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth="1.5" stroke="currentColor"
          style={{ position:"absolute", width:20, height:20, color:"rgba(255,255,255,0.22)", ...s }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      ))}

      {/* Canvas reveal — aparece no hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <CanvasRevealEffect colors={colors} dotSize={dotSize} animationSpeed={animationSpeed} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
        <motion.div
          animate={{ y: hovered ? -16 : 0, opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}
        >
          {card.icon}
        </motion.div>
        <motion.h3
          animate={{ y: hovered ? -6 : 8, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.25 }}
        >
          {card.title}
        </motion.h3>
      </div>
    </div>
  );
}

/* Dedicated card with color, size and speed controls */
function CanvasRevealCard() {
  const dark = useDarkMode();
  const [presetId,  setPresetId]  = useState("crimson");
  const [dotSizeId, setDotSizeId] = useState("sm");
  const [speedId,   setSpeedId]   = useState("normal");
  const [tab,       setTab]       = useState<"spec" | "usage">("spec");

  const preset   = CANVAS_PRESETS.find(p => p.id === presetId)!;
  const dotOpt   = DOT_SIZES.find(s => s.id === dotSizeId)!;
  const speedOpt = ANIM_SPEEDS.find(s => s.id === speedId)!;

  const ctrl = dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)";
  const idle = dark ? "#8898B0" : "#627288";
  const tags: EffectTag[] = ["Interativo", "Canvas"];

  const demoCards: RevealCardDef[] = [
    { title: "Security",      icon: <Shield     style={{ width:38, height:38, color:"rgba(255,255,255,0.45)" }} />, bg: "#0D1119" },
    { title: "Performance",    icon: <Zap        style={{ width:38, height:38, color:"rgba(255,255,255,0.45)" }} />, bg: "#131A27" },
    { title: "Escalabilidade", icon: <TrendingUp style={{ width:38, height:38, color:"rgba(255,255,255,0.45)" }} />, bg: "#1C2333" },
  ];

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>

      {/* Preview — 3 cards lado a lado */}
      <div className="grid grid-cols-3">
        {demoCards.map(card => (
          <RevealCardItem
            key={card.title}
            card={card}
            colors={preset.colors}
            dotSize={dotOpt.px}
            animationSpeed={speedOpt.val}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card px-5 py-3.5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Cores</span>
          <div className="flex flex-wrap gap-1.5">
            {CANVAS_PRESETS.map(p => (
              <button key={p.id} onClick={() => setPresetId(p.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${presetId === p.id ? "#D44D4D" : ctrl}`,
                  background: presetId === p.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: presetId === p.id ? "#D44D4D" : idle,
                }}>
                <span className="flex gap-0.5">
                  {p.swatches.map(hex => (
                    <span key={hex} style={{ width:7, height:7, borderRadius:2, background:hex, display:"inline-block" }} />
                  ))}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Tamanho</span>
          <div className="flex gap-1">
            {DOT_SIZES.map(s => (
              <button key={s.id} onClick={() => setDotSizeId(s.id)}
                className="w-9 py-1.5 rounded-[7px] text-[0.6875rem] font-bold transition-all"
                style={{
                  border: `1.5px solid ${dotSizeId === s.id ? "#D44D4D" : ctrl}`,
                  background: dotSizeId === s.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: dotSizeId === s.id ? "#D44D4D" : idle,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Velocidade</span>
          <div className="flex gap-1">
            {ANIM_SPEEDS.map(s => (
              <button key={s.id} onClick={() => setSpeedId(s.id)}
                className="px-3 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${speedId === s.id ? "#D44D4D" : ctrl}`,
                  background: speedId === s.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: speedId === s.id ? "#D44D4D" : idle,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-[0.9375rem] font-black text-foreground tracking-[-0.025em]">Canvas Reveal</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5 leading-relaxed">
              Hover over the cards. Animated colored dots fill the card on hover — the icon rises and the title appears.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-[5px] text-[0.5625rem] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: tagColors[t].bg, color: tagColors[t].color }}>{t}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-[10px] bg-muted w-fit">
          {(["spec", "usage"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-[8px] text-[0.75rem] font-semibold transition-colors ${tab === t ? "bg-card text-foreground" : "text-muted-foreground"}`}>
              {t === "spec" ? "Technique" : "When to use"}
            </button>
          ))}
        </div>

        {tab === "spec" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Implementation</p>
              <p className="text-[0.8125rem] text-foreground/80 mt-0.5 leading-relaxed">
                2D canvas with a dot grid — each dot has a random <code className="text-primary text-[0.6875rem]">phase</code> on a sine wave, creating independent pulsing. <code className="text-primary text-[0.6875rem]">AnimatePresence</code> mounts/unmounts the canvas on hover with a fade. Content uses <code className="text-primary text-[0.6875rem]">motion.div</code> for the title slide.
              </p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Compatible components</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {["Feature cards", "Pricing cards", "Testimonials", "Product showcase"].map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-[5px] bg-muted text-[0.75rem] text-foreground/80">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "usage" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em]" style={{ color: "#4fb57b" }}>✓ Use when</p>
              <ul className="mt-1.5 space-y-1">
                {["Feature cards or product differentiators.", "Exploration sections where the user has time.", "When you want to create a wow moment without distraction."].map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#4fb57b" }} />{w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-destructive">✕ Avoid when</p>
              <ul className="mt-1.5 space-y-1">
                {["Mobile — hover doesn't exist on touch.", "Cards with a lot of internal information.", "Contexts with a reduced-motion preference."].map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive shrink-0 mt-0.5 text-[0.75rem]">✕</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   3. VORTEX
   Big Bang — cosmic explosion from the center, with shockwaves and particles
══════════════════════════════════════════════════════════ */

/* ── Big Bang config ── */
type BBPalette = {
  id: string; label: string; swatches: string[];
  fast: RGB[]; mid: RGB[]; slow: RGB[];
};
const BB_PALETTES: BBPalette[] = [
  { id: "crimson", label: "Crimson", swatches: ["#D44D4D","#E88080","#ffffff"],
    fast: [[255,255,255],[255,220,220],[255,200,200]],
    mid:  [[212,77,77],[232,128,128],[255,107,107],[184,40,40]],
    slow: [[55,65,85],[73,86,105],[40,48,67],[98,114,136]] },
  { id: "cosmos",  label: "Cosmos",  swatches: ["#7C3AED","#A78BFA","#C4B5FD"],
    fast: [[255,255,255],[230,220,255],[210,200,255]],
    mid:  [[124,58,237],[167,139,250],[139,92,246],[109,40,217]],
    slow: [[49,46,82],[67,56,120],[39,36,72],[80,60,140]] },
  { id: "ocean",   label: "Ocean",  swatches: ["#0EA5E9","#38BDF8","#7DD3FC"],
    fast: [[255,255,255],[220,245,255],[180,235,255]],
    mid:  [[14,165,233],[56,189,248],[6,182,212],[2,132,199]],
    slow: [[12,74,110],[7,89,133],[15,118,170],[10,65,100]] },
  { id: "neon",    label: "Neon",    swatches: ["#22D3EE","#4ADE80","#F0ABFC"],
    fast: [[255,255,255],[200,255,220],[255,200,255]],
    mid:  [[34,211,238],[74,222,128],[240,171,252],[16,185,129]],
    slow: [[20,60,70],[30,70,40],[60,20,70],[20,50,60]] },
];
const BB_SPEEDS = [
  { id: "slow",   label: "Lenta",  mul: 0.45, interval: 6000 },
  { id: "normal", label: "Normal", mul: 1.0,  interval: 3800 },
  { id: "fast",   label: "Fast", mul: 2.2,  interval: 1900 },
] as const;
type BBSpeedId = typeof BB_SPEEDS[number]["id"];
type BBCfg = { speedMul: number; bangInterval: number; palette: BBPalette };

/* ── Background Lines config ── */
type BglPalette = {
  id: string; label: string; swatches: string[];
  hRgb: RGB[]; vRgb: RGB[];
};
const BGL_PALETTES: BglPalette[] = [
  { id: "crimson",  label: "Crimson",  swatches: ["#D44D4D","#E88080"],
    hRgb: [[212,77,77],[232,128,128],[255,107,107],[255,255,255]],
    vRgb: [[55,65,85],[73,86,105],[98,114,136],[40,48,67]] },
  { id: "cyan",     label: "Cyan",    swatches: ["#06B6D4","#67E8F9"],
    hRgb: [[6,182,212],[103,232,249],[34,211,238],[255,255,255]],
    vRgb: [[15,60,80],[20,70,90],[30,80,100],[10,50,70]] },
  { id: "aurora",   label: "Aurora",   swatches: ["#8B5CF6","#34D399"],
    hRgb: [[139,92,246],[167,139,250],[52,211,153],[255,255,255]],
    vRgb: [[50,30,80],[60,40,90],[30,60,50],[40,20,60]] },
  { id: "graphite", label: "Graphite",  swatches: ["#8898B0","#627288"],
    hRgb: [[136,152,176],[98,114,136],[179,189,208],[200,215,230]],
    vRgb: [[40,48,67],[55,65,85],[73,86,105],[30,38,57]] },
];
const BGL_SPEEDS = [
  { id: "slow",   label: "Lenta",  mul: 0.4 },
  { id: "normal", label: "Normal", mul: 1.0 },
  { id: "fast",   label: "Fast", mul: 2.5 },
] as const;
const BGL_DENSITIES = [
  { id: "low",    label: "Baixa",  val: 0.4 },
  { id: "normal", label: "Normal", val: 1.0 },
  { id: "high",   label: "Alta",   val: 2.2 },
] as const;
type BglSpeedId   = typeof BGL_SPEEDS[number]["id"];
type BglDensityId = typeof BGL_DENSITIES[number]["id"];
type BglCfg = { speedMul: number; palette: BglPalette; densityMul: number };

type BBParticle = {
  angle: number;
  speed: number;
  r: number;          // current distance from center
  size: number;
  color: string;
  alpha: number;
  life: number;       // 0 → 1
  decay: number;      // how fast it fades
  px: number; py: number; // previous position for trail
};

type Shockwave = {
  r: number;
  maxR: number;
  alpha: number;
  width: number;
  color: string;
};

function VortexBg({ dark, cfg, children }: { dark: boolean; cfg: BBCfg; children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const cfgRef    = useRef<BBCfg>(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    if (!W || !H) return;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = W / 2, cy = H / 2;
    const MAX_R = Math.hypot(W, H) * 0.6;

    const BG      = dark ? "#0D1119" : "#F0F2F7";
    const FADE_BG = dark ? "rgba(13,17,25,0.22)" : "rgba(240,242,247,0.22)";

    let particles:  BBParticle[] = [];
    let shockwaves: Shockwave[]  = [];
    let bangTimer  = 0;

    const triggerBang = (t: number) => {
      bangTimer  = t;
      particles  = [];
      shockwaves = [];

      const { palette, speedMul } = cfgRef.current;
      const fastThresh = 5 * speedMul;
      const midThresh  = 2.8 * speedMul;

      for (let i = 0; i < 280; i++) {
        const spd = (1.2 + Math.random() * 5.5) * speedMul;
        let cArr: RGB;
        if (spd > fastThresh)      cArr = palette.fast[Math.floor(Math.random() * palette.fast.length)];
        else if (spd > midThresh)  cArr = palette.mid [Math.floor(Math.random() * palette.mid.length)];
        else                       cArr = palette.slow[Math.floor(Math.random() * palette.slow.length)];
        const [r, g, b] = cArr;
        const color = `rgb(${r},${g},${b})`;

        particles.push({
          angle: Math.random() * Math.PI * 2,
          speed: spd,
          r:     2 + Math.random() * 6,
          size:  0.6 + Math.random() * (spd > fastThresh * 0.8 ? 1.2 : 2.4),
          color,
          alpha: 0.8 + Math.random() * 0.2,
          life:  0,
          decay: 0.003 + Math.random() * 0.006 * (spd > fastThresh * 0.8 ? 1.8 : 1),
          px: cx, py: cy,
        });
      }

      const [pr, pg, pb] = palette.mid[0];
      const swColors = dark
        ? [`rgba(${pr},${pg},${pb},0.7)`, "rgba(255,255,255,0.35)", `rgba(${pr},${pg},${pb},0.4)`]
        : [`rgba(${pr},${pg},${pb},0.6)`, `rgba(${Math.floor(pr*0.8)},${Math.floor(pg*0.3)},${Math.floor(pb*0.3)},0.30)`, "rgba(100,130,180,0.35)"];
      [0, 18, 40].forEach((offset, idx) => {
        shockwaves.push({ r: offset, maxR: MAX_R * (0.55 + idx * 0.15), alpha: 1, width: 2.5 - idx * 0.5, color: swColors[idx] });
      });
    };

    const t0 = performance.now();
    triggerBang(t0);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);
    let last = t0;

    const draw = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;

      if (now - bangTimer > cfgRef.current.bangInterval) triggerBang(now);

      ctx.fillStyle = FADE_BG;
      ctx.fillRect(0, 0, W, H);

      // Core glow
      const age   = (now - bangTimer) / cfgRef.current.bangInterval;
      const coreA = Math.max(0, 0.9 - age * 1.6);
      const coreR = Math.max(1, 8 + age * 25);
      if (coreA > 0) {
        const [fr, fg, fb] = cfgRef.current.palette.fast[0];
        const [mr, mg, mb] = cfgRef.current.palette.mid[0];
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
        grd.addColorStop(0,   `rgba(${fr},${fg},${fb},${coreA.toFixed(2)})`);
        grd.addColorStop(0.3, `rgba(${mr},${mg},${mb},${(coreA * 0.7).toFixed(2)})`);
        grd.addColorStop(1,   "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nebula
      const nebulaA = 0.08 + Math.sin(now * 0.0006) * 0.04;
      const [nr, ng, nb] = cfgRef.current.palette.mid[0];
      const ngrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, MAX_R * 0.45);
      ngrd.addColorStop(0,   `rgba(${nr},${ng},${nb},${nebulaA.toFixed(3)})`);
      ngrd.addColorStop(0.5, `rgba(${Math.floor(nr*0.4)},${Math.floor(ng*0.25)},${Math.floor(nb*0.3)},${(nebulaA * 0.4).toFixed(3)})`);
      ngrd.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = ngrd;
      ctx.fillRect(0, 0, W, H);

      // Shockwaves
      for (const sw of shockwaves) {
        sw.r    += (3.2 + sw.r * 0.012) * (dt / 16);
        sw.alpha = Math.max(0, sw.alpha - 0.008 * (dt / 16));
        if (sw.r >= sw.maxR) { sw.alpha = 0; continue; }
        ctx.globalAlpha = sw.alpha;
        ctx.strokeStyle = sw.color;
        ctx.lineWidth   = sw.width * Math.max(0.2, 1 - sw.r / sw.maxR);
        ctx.shadowBlur  = 8;
        ctx.shadowColor = sw.color;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0.1, sw.r), 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      }

      // Particles
      for (const p of particles) {
        p.px = cx + Math.cos(p.angle) * p.r;
        p.py = cy + Math.sin(p.angle) * p.r;
        p.r    += p.speed * (dt / 16);
        p.life += p.decay * (dt / 16);
        const x = cx + Math.cos(p.angle) * p.r;
        const y = cy + Math.sin(p.angle) * p.r;
        const alpha = p.alpha * Math.max(0, 1 - p.life);
        if (alpha < 0.01) continue;

        ctx.globalAlpha = alpha * 0.45;
        ctx.strokeStyle = p.color;
        ctx.lineWidth   = p.size * 0.7;
        ctx.shadowBlur  = p.size * 2;
        ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(x, y); ctx.stroke();

        ctx.globalAlpha = alpha;
        ctx.fillStyle   = p.color;
        ctx.shadowBlur  = p.size * 4;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dark]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>{children}</div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   4. BACKGROUND LINES — Canvas
   Grid with horizontal streams, vertical drops,
   scanner beam and sparkles at intersections
══════════════════════════════════════════════════════════ */

function BackgroundLinesBg({ dark, cfg, children }: { dark: boolean; cfg: BglCfg; children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const cfgRef    = useRef<BglCfg>(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  // density in deps so stream count rebuilds when it changes
  const densityMul = cfg.densityMul;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W   = canvas.offsetWidth;
    const H   = canvas.offsetHeight;
    if (!W || !H) return;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const COLS = 20;
    const ROWS = 28;
    const cw = W / COLS;
    const ch = H / ROWS;

    const BG      = dark ? "#0D1119" : "#F0F2F7";
    const FADE_BG = dark ? "rgba(13,17,25,0.28)" : "rgba(240,242,247,0.28)";
    const GRID_C  = dark ? "rgba(55,65,85,0.13)"  : "rgba(139,155,180,0.16)";

    // Streams store colorIdx — actual RGB looked up from cfgRef at draw time
    type HStream = { row:number; x:number; baseSpd:number; len:number; colorIdx:number; alpha:number; dir:1|-1 };
    type VDrop   = { col:number; y:number; baseSpd:number; len:number; colorIdx:number; alpha:number };
    type Spark   = { col:number; row:number; life:number };

    const hLen = cfgRef.current.palette.hRgb.length;
    const vLen = cfgRef.current.palette.vRgb.length;

    // Build streams — density controls average count per row
    const streams: HStream[] = [];
    for (let r = 0; r < ROWS; r++) {
      const n = Math.max(1, Math.round((0.8 + Math.random() * 1.4) * densityMul));
      for (let i = 0; i < n; i++) {
        const dir = Math.random() > 0.22 ? 1 : -1 as 1|-1;
        streams.push({
          row: r,
          x: Math.random() * W,
          baseSpd: (0.7 + Math.random() * 2.8) * dir,
          len: 55 + Math.random() * 180,
          colorIdx: Math.floor(Math.random() * hLen),
          alpha: 0.55 + Math.random() * 0.45,
          dir,
        });
      }
    }

    // Build drops — density also affects column density
    const drops: VDrop[] = [];
    for (let c = 0; c < COLS; c++) {
      if (Math.random() < (0.38 + densityMul * 0.25)) {
        drops.push({
          col: c,
          y: Math.random() * H,
          baseSpd: 0.35 + Math.random() * 1.1,
          len: 28 + Math.random() * 65,
          colorIdx: Math.floor(Math.random() * vLen),
          alpha: 0.25 + Math.random() * 0.35,
        });
      }
    }

    const sparks: Spark[] = [];
    let lastSparkT = 0;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(now - last, 32);
      last = now;
      const { speedMul, palette } = cfgRef.current;

      ctx.fillStyle = FADE_BG;
      ctx.fillRect(0, 0, W, H);

      // Base grid
      ctx.strokeStyle = GRID_C;
      ctx.lineWidth   = 0.5;
      ctx.globalAlpha = 1;
      for (let r = 0; r <= ROWS; r++) {
        const y = r * ch;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let c = 0; c <= COLS; c++) {
        const x = c * cw;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Scanner beam
      const scanX = ((now * 0.000028) % 1.5 - 0.25) * W;
      const [sr0, sg0, sb0] = palette.hRgb[0];
      const sg = ctx.createLinearGradient(scanX - 220, 0, scanX + 220, 0);
      sg.addColorStop(0,    "rgba(0,0,0,0)");
      sg.addColorStop(0.35, `rgba(${sr0},${sg0},${sb0},0.045)`);
      sg.addColorStop(0.5,  dark ? "rgba(255,255,255,0.06)" : `rgba(${sr0},${sg0},${sb0},0.05)`);
      sg.addColorStop(0.65, `rgba(${sr0},${sg0},${sb0},0.045)`);
      sg.addColorStop(1,    "rgba(0,0,0,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, 0, W, H);

      // H-Streams
      for (const s of streams) {
        s.x += s.baseSpd * speedMul * (dt / 16);
        if (s.dir === 1  && s.x > W + s.len) s.x = -s.len;
        if (s.dir === -1 && s.x < -s.len)    s.x =  W + s.len;

        const y    = s.row * ch;
        const head = s.x;
        const tail = head - s.len * s.dir;
        const [r, g, b] = palette.hRgb[s.colorIdx % palette.hRgb.length];

        const g2 = ctx.createLinearGradient(tail, 0, head, 0);
        g2.addColorStop(0,    "rgba(0,0,0,0)");
        g2.addColorStop(0.65, `rgba(${r},${g},${b},${(s.alpha * 0.75).toFixed(2)})`);
        g2.addColorStop(0.88, `rgba(${r},${g},${b},${s.alpha.toFixed(2)})`);
        g2.addColorStop(1,    dark ? "rgba(255,255,255,0.95)" : `rgba(${r},${g},${b},1)`);

        ctx.globalAlpha = 1;
        ctx.strokeStyle = g2;
        ctx.lineWidth   = 1.1 + (s.len > 160 ? 0.4 : 0);
        ctx.shadowBlur  = 5;
        ctx.shadowColor = `rgba(${r},${g},${b},0.8)`;
        ctx.beginPath(); ctx.moveTo(tail, y); ctx.lineTo(head, y); ctx.stroke();
        ctx.shadowBlur  = 0;

        if (now - lastSparkT > 60 && Math.random() < 0.012) {
          const nc = Math.round(head / cw);
          if (nc >= 0 && nc <= COLS) { sparks.push({ col: nc, row: s.row, life: 1 }); lastSparkT = now; }
        }
      }

      // V-Drops
      for (const d of drops) {
        d.y += d.baseSpd * speedMul * (dt / 16);
        if (d.y > H + d.len) d.y = -d.len;

        const x    = d.col * cw;
        const head = d.y;
        const tail = head - d.len;
        const [r, g, b] = palette.vRgb[d.colorIdx % palette.vRgb.length];

        const g3 = ctx.createLinearGradient(0, tail, 0, head);
        g3.addColorStop(0,   "rgba(0,0,0,0)");
        g3.addColorStop(0.6, `rgba(${r},${g},${b},${(d.alpha * 0.7).toFixed(2)})`);
        g3.addColorStop(0.9, `rgba(${r},${g},${b},${d.alpha.toFixed(2)})`);
        g3.addColorStop(1,   dark ? "rgba(200,220,255,0.75)" : "rgba(100,130,180,0.65)");

        ctx.strokeStyle = g3;
        ctx.lineWidth   = 0.75;
        ctx.shadowBlur  = 3;
        ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
        ctx.beginPath(); ctx.moveTo(x, tail); ctx.lineTo(x, head); ctx.stroke();
        ctx.shadowBlur  = 0;
      }

      // Intersection sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.life -= 0.045 * (dt / 16);
        if (sp.life <= 0) { sparks.splice(i, 1); continue; }
        const sx = sp.col * cw;
        const sy = sp.row * ch;
        const spr = Math.max(0.1, sp.life * 4.5);
        const [sparkR, sparkG, sparkB] = dark ? [255,255,255] : palette.hRgb[0];
        ctx.globalAlpha = sp.life;
        ctx.fillStyle   = `rgb(${sparkR},${sparkG},${sparkB})`;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = `rgba(${sparkR},${sparkG},${sparkB},0.9)`;
        ctx.beginPath(); ctx.arc(sx, sy, spr, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.globalAlpha = 1;
      }

      // Vignette
      const vg = ctx.createRadialGradient(W/2, H/2, H * 0.15, W/2, H/2, H * 0.9);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, dark ? "rgba(13,17,25,0.60)" : "rgba(215,220,235,0.50)");
      ctx.globalAlpha = 1;
      ctx.fillStyle   = vg;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [dark, densityMul]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BIG BANG CARD — previews with controls
══════════════════════════════════════════════════════════ */

function BigBangCard() {
  const dark = useDarkMode();
  const [speedId,   setSpeedId]   = useState<BBSpeedId>("normal");
  const [paletteId, setPaletteId] = useState("crimson");

  const speedOpt = BB_SPEEDS.find(s => s.id === speedId)!;
  const palette  = BB_PALETTES.find(p => p.id === paletteId)!;

  const cfg: BBCfg = { speedMul: speedOpt.mul, bangInterval: speedOpt.interval, palette };

  const ctrl    = dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)";
  const idle    = dark ? "#8898B0" : "#627288";
  const ef      = { name: "Big Bang", tags: ["Animado", "Canvas"] as EffectTag[] };

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
      {/* Preview */}
      <div className="h-80 relative overflow-hidden">
        <VortexBg dark={dark} cfg={cfg}><VortexContent dark={dark} /></VortexBg>
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card px-5 py-3.5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Velocidade</span>
          <div className="flex gap-1">
            {BB_SPEEDS.map(s => (
              <button key={s.id} onClick={() => setSpeedId(s.id)}
                className="px-3 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${speedId === s.id ? "#D44D4D" : ctrl}`,
                  background: speedId === s.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: speedId === s.id ? "#D44D4D" : idle,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Cores</span>
          <div className="flex flex-wrap gap-1.5">
            {BB_PALETTES.map(p => (
              <button key={p.id} onClick={() => setPaletteId(p.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${paletteId === p.id ? "#D44D4D" : ctrl}`,
                  background: paletteId === p.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: paletteId === p.id ? "#D44D4D" : idle,
                }}>
                <span className="flex gap-0.5">
                  {p.swatches.slice(0, 2).map((hex, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: 2, background: hex, display: "inline-block" }} />
                  ))}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-[0.9375rem] font-black text-foreground tracking-[-0.025em]">{ef.name}</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5 leading-relaxed">
              Cyclic cosmic explosion: particles burst from the center with concentric shockwaves, light trails and a nebular glow. Conveys scale, power and impact.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {ef.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-[5px] text-[0.5625rem] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: tagColors[t].bg, color: tagColors[t].color }}>{t}</span>
            ))}
          </div>
        </div>
        <p className="text-[0.75rem] text-muted-foreground/70 leading-relaxed">
          2D canvas with a radially fired particle system. Shockwaves with growing radius and decreasing opacity. Core glow via radialGradient + persistent nebula. Line trail between previous and current position.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BG LINES CARD — previews with controls
══════════════════════════════════════════════════════════ */

function BgLinesCard() {
  const dark = useDarkMode();
  const [speedId,   setSpeedId]   = useState<BglSpeedId>("normal");
  const [paletteId, setPaletteId] = useState("crimson");
  const [densityId, setDensityId] = useState<BglDensityId>("normal");

  const speedOpt   = BGL_SPEEDS.find(s => s.id === speedId)!;
  const palette    = BGL_PALETTES.find(p => p.id === paletteId)!;
  const densityOpt = BGL_DENSITIES.find(d => d.id === densityId)!;

  const cfg: BglCfg = { speedMul: speedOpt.mul, palette, densityMul: densityOpt.val };

  const ctrl = dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)";
  const idle = dark ? "#8898B0" : "#627288";
  const ef   = { name: "Background Lines", tags: ["Animado", "Canvas"] as EffectTag[] };

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
      {/* Preview */}
      <div className="h-80 relative overflow-hidden">
        <BackgroundLinesBg dark={dark} cfg={cfg}><LinesContent dark={dark} /></BackgroundLinesBg>
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card px-5 py-3.5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Velocidade</span>
          <div className="flex gap-1">
            {BGL_SPEEDS.map(s => (
              <button key={s.id} onClick={() => setSpeedId(s.id)}
                className="px-3 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${speedId === s.id ? "#D44D4D" : ctrl}`,
                  background: speedId === s.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: speedId === s.id ? "#D44D4D" : idle,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Densidade</span>
          <div className="flex gap-1">
            {BGL_DENSITIES.map(d => (
              <button key={d.id} onClick={() => setDensityId(d.id)}
                className="px-3 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${densityId === d.id ? "#D44D4D" : ctrl}`,
                  background: densityId === d.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: densityId === d.id ? "#D44D4D" : idle,
                }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[0.6875rem] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">Cores</span>
          <div className="flex flex-wrap gap-1.5">
            {BGL_PALETTES.map(p => (
              <button key={p.id} onClick={() => setPaletteId(p.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] text-[0.6875rem] font-semibold transition-all"
                style={{
                  border: `1.5px solid ${paletteId === p.id ? "#D44D4D" : ctrl}`,
                  background: paletteId === p.id ? "rgba(212,77,77,0.08)" : "transparent",
                  color: paletteId === p.id ? "#D44D4D" : idle,
                }}>
                <span className="flex gap-0.5">
                  {p.swatches.map((hex, i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: 2, background: hex, display: "inline-block" }} />
                  ))}
                </span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-[0.9375rem] font-black text-foreground tracking-[-0.025em]">{ef.name}</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5 leading-relaxed">
              Horizontal streams and vertical drops with lit gradients, scanner beam and sparkles at intersections. Evokes data flow, pipelines and infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {ef.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-[5px] text-[0.5625rem] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: tagColors[t].bg, color: tagColors[t].color }}>{t}</span>
            ))}
          </div>
        </div>
        <p className="text-[0.75rem] text-muted-foreground/70 leading-relaxed">
          2D canvas with a cell grid. H-streams with a tail gradient; V-drops with a bright tip. Sinusoidal scanner beam. Sparks at intersections. Perimeter radial vignette.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   5. WOBBLE CARD
   Inspiration: Aceternity Wobble Card
   Card with 3D perspective that tilts on hover + crimson spotlight
══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   CONTEÚDO DOS PREVIEWS
══════════════════════════════════════════════════════════ */

function HeroContent({ dark }: { dark: boolean }) {
  const c = dark ? "#E4E9F0" : "#131A27";
  const m = dark ? "#627288" : "#8898B0";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: 24 }}>
      <div style={{ maxWidth: 280 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 99, border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(19,26,39,0.15)"}`, marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "#D44D4D", display: "inline-block" }} />
          <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: dark ? "rgba(255,255,255,0.6)" : "#627288", textTransform: "uppercase", letterSpacing: "0.06em" }}>v2.0 available</span>
        </div>
        <h1 style={{ fontSize: "1.375rem", fontWeight: 900, color: c, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 10 }}>
          The platform for<br />teams that ship.
        </h1>
        <p style={{ fontSize: "0.8125rem", color: m, lineHeight: 1.6, marginBottom: 18 }}>
          Deploy, observability and monitoring in one place.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, background: "#D44D4D", color: "#fff", fontSize: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer" }}>
            Get started <ArrowRight style={{ width: 12, height: 12 }} />
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(19,26,39,0.15)"}`, background: "transparent", color: dark ? "#8898B0" : "#627288", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
            Ver demo
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsContent({ dark }: { dark: boolean }) {
  const m = dark ? "#627288" : "#8898B0";
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: 300, width: "100%" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: dark ? "#E4E9F0" : "#131A27", letterSpacing: "-0.025em", textAlign: "center", lineHeight: 1.2 }}>
          Hover to reveal<br />what's below.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, width: "100%" }}>
          {[{ v: "99.9%", l: "Uptime" }, { v: "50ms", l: "Latency" }, { v: "10k+", l: "Customers" }].map(s => (
            <div key={s.l} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 10, background: dark ? "rgba(19,26,39,0.60)" : "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)"}` }}>
              <div style={{ fontSize: "1rem", fontWeight: 900, color: "#D44D4D" }}>{s.v}</div>
              <div style={{ fontSize: "0.5625rem", color: m }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VortexContent({ dark }: { dark: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: dark ? "rgba(212,77,77,0.15)" : "rgba(212,77,77,0.10)", border: `1px solid rgba(212,77,77,0.25)`, marginBottom: 14 }}>
          <Zap style={{ width: 12, height: 12, color: "#D44D4D" }} />
          <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "#D44D4D", textTransform: "uppercase", letterSpacing: "0.07em" }}>Processamento</span>
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: dark ? "#E4E9F0" : "#131A27", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 8 }}>
          1M+ eventos<br />por segundo.
        </h2>
        <p style={{ fontSize: "0.75rem", color: dark ? "#627288" : "#8898B0" }}>
          Distributed infrastructure with zero downtime.
        </p>
      </div>
    </div>
  );
}

function LinesContent({ dark }: { dark: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", padding: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 }}>
        <p style={{ fontSize: "0.5625rem", fontWeight: 700, color: dark ? "#495669" : "#8898B0", textTransform: "uppercase", letterSpacing: "0.07em" }}>Integrations</p>
        {[
          { icon: Shield, label: "GitHub Actions", status: "Ativo" },
          { icon: BarChart2, label: "Datadog", status: "Ativo" },
          { icon: Package, label: "Docker Hub", status: "Configurando" },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, background: dark ? "rgba(19,26,39,0.70)" : "rgba(255,255,255,0.80)", backdropFilter: "blur(8px)", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(19,26,39,0.08)"}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: dark ? "rgba(212,77,77,0.15)" : "rgba(212,77,77,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <item.icon style={{ width: 14, height: 14, color: "#D44D4D" }} />
            </div>
            <span style={{ flex: 1, fontSize: "0.75rem", fontWeight: 600, color: dark ? "#E4E9F0" : "#131A27" }}>{item.label}</span>
            <span style={{ fontSize: "0.5625rem", fontWeight: 700, color: item.status === "Ativo" ? "#4fb57b" : dark ? "#627288" : "#8898B0" }}>● {item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EFFECT CARD — documentation wrapper for each effect
══════════════════════════════════════════════════════════ */

type EffectTag = "Animado" | "Interativo" | "Canvas" | "SVG" | "3D";

type EffectDef = {
  id: string;
  name: string;
  tags: EffectTag[];
  description: string;
  technique: string;
  components: string[];
  useWhen: string[];
  avoidWhen: string[];
  previewDark: React.ReactNode;
  previewLight: React.ReactNode;
};

const tagColors: Record<EffectTag, { bg: string; color: string }> = {
  "Animado":    { bg: "rgba(96,165,250,0.12)",   color: "#60a5fa" },
  "Interativo": { bg: "rgba(167,139,250,0.12)",   color: "#a78bfa" },
  "Canvas":     { bg: "rgba(251,191,36,0.12)",    color: "#f59e0b" },
  "SVG":        { bg: "rgba(34,197,94,0.12)",     color: "#22c55e" },
  "3D":         { bg: "rgba(251,113,133,0.12)",   color: "#fb7185" },
};

function EffectCard({ ef }: { ef: EffectDef }) {
  const dark = useDarkMode();
  const [tab, setTab] = useState<"spec" | "usage">("spec");
  const preview = dark ? ef.previewDark : ef.previewLight;

  return (
    <div className="rounded-[20px] border border-border bg-card overflow-hidden"
      style={{ boxShadow: "var(--shadow-md)" }}>
      {/* Interactive preview */}
      <div className="h-80 relative overflow-hidden">
        {preview}
      </div>

      {/* Info */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3 justify-between">
          <div>
            <h3 className="text-[0.9375rem] font-black text-foreground tracking-[-0.025em]">{ef.name}</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-0.5 leading-relaxed">{ef.description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
            {ef.tags.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-[5px] text-[0.5625rem] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: tagColors[t].bg, color: tagColors[t].color }}>
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-[10px] bg-muted w-fit">
          {(["spec", "usage"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-[8px] text-[0.75rem] font-semibold transition-colors
                ${tab === t ? "bg-card text-foreground" : "text-muted-foreground"}`}>
              {t === "spec" ? "Technique" : "When to use"}
            </button>
          ))}
        </div>

        {tab === "spec" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Implementation</p>
              <p className="text-[0.8125rem] text-foreground/80 mt-0.5 leading-relaxed">{ef.technique}</p>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-muted-foreground">Compatible components</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {ef.components.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded-[5px] bg-muted text-[0.75rem] text-foreground/80">{c}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "usage" && (
          <div className="space-y-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em]" style={{ color: "#4fb57b" }}>✓ Use when</p>
              <ul className="mt-1.5 space-y-1">
                {ef.useWhen.map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "#4fb57b" }} />{w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.06em] text-destructive">✕ Avoid when</p>
              <ul className="mt-1.5 space-y-1">
                {ef.avoidWhen.map((w, i) => (
                  <li key={i} className="text-[0.8125rem] text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive shrink-0 mt-0.5 text-[0.75rem]">✕</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EFFECT DEFINITIONS
══════════════════════════════════════════════════════════ */

/* Gradient Animation and Canvas Reveal are rendered via dedicated cards — not included in this array */
const effects: EffectDef[] = [
];

/* ══════════════════════════════════════════════════════════
   TOKENS
══════════════════════════════════════════════════════════ */

const bgTokenGroups: TokenGroup[] = [
  {
    group: "Gradient Animation — blobs",
    tokens: [
      { name: "--graphite-700", description: "Blob base dark",    light: "#283043", dark: "#283043", isColor: true },
      { name: "--crimson-900",  description: "Blob accent dark",  light: "#3A0909", dark: "#3A0909", isColor: true },
      { name: "--graphite-100", description: "Blob base light",   light: "#D6DCE6", isColor: true },
      { name: "--crimson-50",   description: "Blob accent light", light: "#FDF2F2", isColor: true },
    ],
  },
  {
    group: "Canvas Reveal — hover cells",
    tokens: [
      { name: "--graphite-900", description: "Dark cell (tone 1)",  light: "#131A27", dark: "#131A27", isColor: true },
      { name: "--graphite-800", description: "Dark cell (tone 2)",  light: "#1C2333", dark: "#1C2333", isColor: true },
      { name: "--graphite-700", description: "Dark cell (tone 3)",  light: "#283043", dark: "#283043", isColor: true },
      { name: "--graphite-200", description: "Light cell",         light: "#B3BDD0", isColor: true },
    ],
  },
  {
    group: "Big Bang — Crimson palette (default)",
    tokens: [
      { name: "fast[0]",  description: "Fast particle — white tip",           light: "#ffffff", dark: "#ffffff", isColor: true },
      { name: "mid[0]",   description: "Medium particle — primary accent",          light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "mid[1]",   description: "Medium particle — pinkish variation",          light: "#E88080", dark: "#E88080", isColor: true },
      { name: "slow[0]",  description: "Slow particle — dark graphite",          light: "#374155", dark: "#374155", isColor: true },
      { name: "slow[2]",  description: "Slow particle — medium graphite",           light: "#627288", dark: "#627288", isColor: true },
    ],
  },
  {
    group: "Background Lines — H-streams Crimson palette (default)",
    tokens: [
      { name: "hRgb[0]",  description: "Stream horizontal — crimson puro",           light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "hRgb[1]",  description: "Stream horizontal — crimson suave",          light: "#E88080", dark: "#E88080", isColor: true },
      { name: "hRgb[3]",  description: "Stream tip — warm white",              light: "#ffffff", dark: "#ffffff", isColor: true },
    ],
  },
  {
    group: "Background Lines — V-drops (graphite, todos os modos)",
    tokens: [
      { name: "vRgb[0]",  description: "Drop vertical — graphite escuro",            light: "#374155", dark: "#374155", isColor: true },
      { name: "vRgb[1]",  description: "Vertical drop — medium graphite",             light: "#495669", dark: "#495669", isColor: true },
      { name: "vRgb[2]",  description: "Drop vertical — graphite claro",             light: "#627288", dark: "#627288", isColor: true },
    ],
  },
];

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */

export function BackgroundsShowcase() {
  return (
    <div className="space-y-14">

      {/* Intro */}
      <div className="space-y-4">
        <p className="text-[0.9375rem] text-muted-foreground leading-relaxed max-w-2xl">
          Four animated, interactive background patterns — each with a distinct visual personality, adapted to the Design System's graphite + crimson palette.
          The previews respond to the site's dark/light mode — use the toggle at the top of the page to switch.
          All previews are interactive: hover to feel the effects in real time.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(tagColors) as [EffectTag, { bg: string; color: string }][]).map(([tag, style]) => (
            <span key={tag} className="px-2.5 py-1 rounded-[6px] text-[0.6875rem] font-semibold"
              style={{ background: style.bg, color: style.color }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Gradient Animation — dedicated card with controls */}
      <section id="gradient-anim-bg">
        <GradientAnimCard />
      </section>

      {/* Canvas Reveal — dedicated card with color and size controls */}
      <section id="canvas-reveal-bg">
        <CanvasRevealCard />
      </section>

      {/* Big Bang — dedicated card with speed and palette controls */}
      <section id="vortex-bg">
        <BigBangCard />
      </section>

      {/* Background Lines — dedicated card with speed, density and palette controls */}
      <section id="bg-lines-bg">
        <BgLinesCard />
      </section>

      {/* Remaining effects */}
      {effects.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {effects.map(ef => (
            <section key={ef.id} id={`${ef.id}-bg`}>
              <EffectCard ef={ef} />
            </section>
          ))}
        </div>
      )}

      {/* Usage guide */}
      <section id="section-backgrounds" className="space-y-4">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Composition guide</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">How to combine the four effects on a landing page — with a palette suggestion for each section.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Technical SaaS",
              mode: "dark-first" as const,
              accent: "#D44D4D",
              sections: [
                { label: "Hero",     effect: "Gradient Animation", note: "Blobs suaves, alta legibilidade",   band: "#1e2a3d", accent: "#3b6fd4" },
                { label: "Features", effect: "Bg Lines Graphite",   note: "Data grid, dense",             band: "#131a27", accent: "#8898b0" },
                { label: "Pricing",  effect: "Canvas Reveal",      note: "Hover reveals plan card",       band: "#0d1119", accent: "var(--success)" },
                { label: "CTA",      effect: "Big Bang Crimson",   note: "Impact explosion at the close",band: "#1a0e0e", accent: "#D44D4D" },
              ],
            },
            {
              title: "Data product",
              mode: "dark" as const,
              accent: "#7C3AED",
              sections: [
                { label: "Hero",        effect: "Big Bang Cosmos",    note: "Transmite escala e poder",          band: "#0d1119", accent: "#7C3AED" },
                { label: "Dashboard",   effect: "Canvas Reveal",      note: "Product screenshot with hover",  band: "#1c2333", accent: "#06b6d4" },
                { label: "Integrations", effect: "Bg Lines Cyan",     note: "Evokes pipelines and flow",          band: "#0f1e2e", accent: "#0ea5e9" },
                { label: "Conversion",   effect: "Big Bang + Wobble",  note: "Highlighted crimson CTA",          band: "#0d1119", accent: "#D44D4D" },
              ],
            },
            {
              title: "Produto consumer",
              mode: "light-first" as const,
              accent: "#8B5CF6",
              sections: [
                { label: "Hero",        effect: "Gradient Animation", note: "Light — suave, acolhedor",        band: "#edf0f5", accent: "#8B5CF6" },
                { label: "Features",    effect: "Bg Lines Graphite",   note: "Neutro e elegante",               band: "#ffffff",  accent: "#8898b0" },
                { label: "Testimonials", effect: "Canvas Reveal",      note: "Light on social proof cards",  band: "#ecf0f5",  accent: "#3b82f6" },
                { label: "CTA",         effect: "Big Bang Aurora",    note: "Dark inversion + final energy",   band: "#131a27",  accent: "#8B5CF6" },
              ],
            },
          ].map(guide => (
            <div key={guide.title} className="rounded-[14px] border border-border bg-card overflow-hidden"
              style={{ boxShadow: "var(--shadow-xs)" }}>
              {/* Card header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <p className="text-[0.8125rem] font-bold text-foreground">{guide.title}</p>
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.07em] mt-0.5"
                    style={{ color: guide.accent }}>{guide.mode}</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: guide.accent }} />
              </div>

              {/* Page section strips */}
              <div className="divide-y divide-border/60">
                {guide.sections.map((s, i) => (
                  <div key={i} className="flex items-stretch">
                    {/* Color swatch strip — full height, labeled */}
                    <div className="w-1.5 shrink-0" style={{ background: s.accent, opacity: 0.7 }} />
                    <div className="flex-1 px-3 py-2.5 flex items-start gap-3"
                      style={{ background: `${s.band}12` }}>
                      {/* Section label badge */}
                      <div className="pt-0.5 shrink-0">
                        <span className="inline-block text-[0.5rem] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-[4px] text-foreground/60 border border-border bg-muted/40"
                          style={{ minWidth: 52, textAlign: "center" }}>{s.label}</span>
                      </div>
                      {/* Effect name + description */}
                      <div className="min-w-0">
                        <p className="text-[0.6875rem] font-semibold text-foreground leading-tight truncate">{s.effect}</p>
                        <p className="text-[0.5625rem] text-muted-foreground leading-snug mt-0.5">{s.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Palette × Effect — compatibility table */}
        <div className="rounded-[14px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[0.8125rem] font-bold text-foreground">Palettes × Usage context</p>
            <p className="text-[0.6875rem] text-muted-foreground mt-0.5">Quick guide to which palette to use for each section type.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[0.6875rem]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-semibold w-28">Paleta</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-semibold">Personalidade</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-semibold">Big Bang</th>
                  <th className="text-left px-3 py-2.5 text-muted-foreground font-semibold">Bg Lines</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { palette: "Crimson", dot: "#D44D4D", personality: "Energy, urgency, primary brand", bb: "Launch hero, CTA", bgl: "Technical features, B2B product" },
                  { palette: "Cosmos",  dot: "#7C3AED", personality: "Mystery, scale, ambition",         bb: "Impact hero, splash screens",  bgl: "AI product, data, ML" },
                  { palette: "Ocean",  dot: "#0EA5E9", personality: "Trust, flow, technology",      bb: "Infrastructure product, cloud",  bgl: "Pipelines, ETL, integrations" },
                  { palette: "Neon",    dot: "#22D3EE", personality: "Innovation, future, creative energy",bb: "Gaming, creativity, agencies",    bgl: "Dev product, realtime, live" },
                  { palette: "Cyan",   dot: "#06B6D4", personality: "Precision, data, clean technical",   bb: "—",                                bgl: "Dashboard, analytics, CI/CD" },
                  { palette: "Aurora",  dot: "#8B5CF6", personality: "Premium, criativo, diferenciado",  bb: "CTA consumer, produto consumer",   bgl: "Design tools, plataformas criativas" },
                  { palette: "Graphite", dot: "#8898B0", personality: "Neutral, elegant, subtle background",  bb: "—",                                bgl: "Features background, light mode" },
                ].map(row => (
                  <tr key={row.palette} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: row.dot }} />
                        <span className="font-semibold text-foreground">{row.palette}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.personality}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.bb}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.bgl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tokens */}
      <section id="backgrounds-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Color tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">
            Reference values for the system's four Canvas patterns. Big Bang and Background Lines use interchangeable palettes — the tokens below document the default palette (Crimson).
          </p>
        </div>
        <TokenTable groups={bgTokenGroups} />
      </section>

    </div>
  );
}
