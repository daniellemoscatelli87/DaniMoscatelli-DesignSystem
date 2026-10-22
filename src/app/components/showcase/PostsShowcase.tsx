import React, { useState } from "react";
import logoVermelho from "../../../imports/LogoVermelho.png";
import logoWhite from "../../../imports/IconeLogo-white.png";
import avatarDani from "../../../imports/avatarDani.png";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowRight, Mail, MapPin, Sparkles, Moon, Sun } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────
type Platform = "instagram" | "linkedin";
type IgFormat = "1:1" | "4:5";
type Format = "1:1" | "4:5" | "1.91:1";
type SlideTheme = "dark" | "light";
type SlideType =
  | "cover" | "chart-area" | "chart-copy"
  | "photo" | "photo2" | "chart-bar"
  | "topics" | "steps" | "closing";

interface SlideConfig {
  type: SlideType;
  label: string;
  desc: string;
  step?: { num: number; total: number };
}

// ── Color palettes ────────────────────────────────────────────────────────
const dark = {
  bg: "#0D1119", surface: "#131A27", surfaceUp: "#1C2333",
  accent: "#D44D4D", accentGlow: "rgba(212,77,77,0.13)", accentBorder: "rgba(212,77,77,0.28)",
  text: "#E4E9F0", sub: "#8898B0", dim: "#495669",
  border: "rgba(255,255,255,0.07)", borderUp: "rgba(255,255,255,0.13)",
};
const light = {
  bg: "#FFFFFF", surface: "#F2F5FA", surfaceUp: "#E8EDF4",
  accent: "#D44D4D", accentGlow: "rgba(212,77,77,0.07)", accentBorder: "rgba(212,77,77,0.20)",
  text: "#131A27", sub: "#627288", dim: "#8898B0",
  border: "rgba(19,26,39,0.08)", borderUp: "rgba(19,26,39,0.14)",
};
function gc(t: SlideTheme) { return t === "dark" ? dark : light; }

function getFormat(platform: Platform, igFmt: IgFormat): Format {
  return platform === "linkedin" ? "1.91:1" : igFmt;
}
function getAspectClass(fmt: Format) {
  if (fmt === "4:5") return "aspect-[4/5]";
  if (fmt === "1.91:1") return "aspect-[1.91/1]";
  return "aspect-square";
}

// ── Data ─────────────────────────────────────────────────────────────────
const engData = [
  { m: "Jan", v: 24 }, { m: "Feb", v: 32 }, { m: "Mar", v: 29 },
  { m: "Apr", v: 41 }, { m: "May", v: 52 }, { m: "Jun", v: 48 },
];
const growthData = [
  { q: "Q1", v: 12 }, { q: "Q2", v: 28 }, { q: "Q3", v: 45 }, { q: "Q4", v: 67 },
];
const IMG = {
  cover: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=900&h=1350&fit=crop&auto=format",
  team:  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&h=1350&fit=crop&auto=format",
  work:  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&h=1350&fit=crop&auto=format",
};

// ── Thumbnail gradients ───────────────────────────────────────────────────
const THUMB_GRAD: Record<SlideType, string> = {
  "cover":      "linear-gradient(145deg,#0D1119 0%,#1C2333 55%,#3A0909 100%)",
  "chart-area": "linear-gradient(145deg,#0D1119 0%,#131A27 100%)",
  "chart-copy": "linear-gradient(145deg,#0D1119 0%,#1C2333 65%,#131A27 100%)",
  "photo":      "linear-gradient(145deg,#1C2333 0%,#0D1119 100%)",
  "photo2":     "linear-gradient(145deg,#283043 0%,#131A27 100%)",
  "chart-bar":  "linear-gradient(145deg,#131A27 0%,#0D1119 100%)",
  "topics":     "linear-gradient(145deg,#0D1119 0%,#283043 100%)",
  "steps":      "linear-gradient(145deg,#131A27 0%,#3A0909 55%,#0D1119 100%)",
  "closing":    "linear-gradient(145deg,#3A0909 0%,#0D1119 100%)",
};

// ── Inline SVG sparkline (no Recharts — avoids duplicate clipPath IDs) ───────
function SvgArea({ data, accent }: { data: number[]; accent: string }) {
  const W = 200, H = 58;
  const vals = data.map(d => d.v);
  const max = Math.max(...vals), min = Math.min(...vals);
  const range = max - min || 1;
  const px = (i: number) => (i / (vals.length - 1)) * W;
  const py = (v: number) => H - ((v - min) / range) * (H * 0.80) - H * 0.08;
  const pts = vals.map((v, i) => `${px(i)},${py(v)}`).join(" L ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%" }} preserveAspectRatio="none">
      <path d={`M ${pts} L ${W},${H} L 0,${H} Z`} fill={accent} fillOpacity={0.16} />
      <path d={`M ${pts}`} fill="none" stroke={accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Shared micro-elements ─────────────────────────────────────────────────
function SlideLogo({ size = 24, white }: { size?: number; white?: boolean }) {
  return (
    <img
      src={white ? logoWhite : logoVermelho}
      alt="Logo"
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}
function Num({ idx, total, color, bg }: { idx: number; total: number; color: string; bg: string }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color, backgroundColor: bg, border: `1px solid ${color}40`, padding: "2px 7px", borderRadius: 4, flexShrink: 0 }}>
      {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
    </div>
  );
}
function Arrow({ accent }: { accent: string }) {
  return (
    <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: accent, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ArrowRight size={12} color="#fff" />
    </div>
  );
}
function TagBadge({ label, accent, glow }: { label: string; accent: string; glow: string }) {
  return (
    <div style={{ display: "inline-block", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: accent, backgroundColor: glow, border: `1px solid ${accent}28`, padding: "2px 6px", borderRadius: 3 }}>
      {label}
    </div>
  );
}
function CornerAccent({ accent }: { accent: string }) {
  return (
    <svg style={{ position: "absolute", top: 0, right: 0, opacity: 0.30, pointerEvents: "none" }} width={60} height={60} viewBox="0 0 60 60" fill="none">
      <line x1="60" y1="0" x2="0" y2="60" stroke={accent} strokeWidth={2} />
      <line x1="60" y1="13" x2="13" y2="60" stroke={accent} strokeWidth={1} strokeDasharray="4 4" />
    </svg>
  );
}
// Consistent handle + arrow footer for all internal slides
function SlideFooter({ theme }: { theme: SlideTheme }) {
  const c = gc(theme);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
      <span style={{ fontSize: 9, fontWeight: 600, color: c.dim, letterSpacing: "0.01em" }}>@danimoscatellistudio</span>
      <Arrow accent={c.accent} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE COMPONENTS
// ════════════════════════════════════════════════════════════════

function CoverSlide({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#0D1119" }}>
      <img src={IMG.cover} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />

      {/* Overall subtle darkening */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: theme === "dark" ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.12)" }} />

      {/* Strong bottom-up scrim for text readability */}
      <div style={{
        position: "absolute", inset: 0,
        background: theme === "dark"
          ? "linear-gradient(to top, rgba(13,17,25,0.97) 0%, rgba(13,17,25,0.85) 28%, rgba(13,17,25,0.25) 58%, transparent 100%)"
          : "linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.90) 28%, rgba(255,255,255,0.35) 58%, transparent 100%)",
      }} />

      {/* Top-left dark corner for logo visibility (dark mode only) */}
      {theme === "dark" && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "60%", height: "30%",
          background: "radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.65) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}

      {/* Crimson top-right glow */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 120, height: 120,
        background: "radial-gradient(circle at top right, rgba(212,77,77,0.32) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Top bar — white logo for cover */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SlideLogo size={26} white />
        <Num idx={idx} total={total} color="rgba(255,255,255,0.80)" bg="rgba(0,0,0,0.35)" />
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 16px" }}>
        <div style={{ width: 24, height: 2, backgroundColor: c.accent, marginBottom: 7, borderRadius: 1 }} />
        <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.10, color: theme === "dark" ? "#F0F4FA" : c.text, letterSpacing: "-0.028em", marginBottom: 5 }}>
          Digital Content<br />Strategy
        </div>
        <div style={{ fontSize: 10.5, color: theme === "dark" ? "rgba(228,233,240,0.68)" : c.sub, lineHeight: 1.45, marginBottom: 8 }}>
          5 pillars to grow on social media with consistency and measurable results.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 20, backgroundColor: "rgba(212,77,77,0.18)", border: "1px solid rgba(212,77,77,0.30)" }}>
            <Sparkles size={9} color={c.accent} />
            <span style={{ fontSize: 9, fontWeight: 700, color: c.accent }}>Content strategy</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 500, color: theme === "dark" ? "rgba(228,233,240,0.42)" : "rgba(19,26,39,0.36)", letterSpacing: "0.01em" }}>
            @danimoscatellistudio
          </span>
        </div>
        <div style={{ height: 1, backgroundColor: theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(19,26,39,0.08)", margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Arrow accent={c.accent} />
        </div>
      </div>
    </div>
  );
}

// ── Cover variant B — Left solid panel + diagonal cut + photo ──────────────
function CoverSlideB({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: c.bg }}>
      {/* Photo full bleed */}
      <img src={IMG.team} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* Left solid panel with diagonal right edge */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: "68%",
        clipPath: "polygon(0 0, 100% 0, 78% 100%, 0 100%)",
        backgroundColor: theme === "dark" ? "rgba(13,17,25,0.96)" : "rgba(255,255,255,0.97)",
      }} />
      {/* Crimson accent edge */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="68" y1="0" x2="52" y2="100" stroke={c.accent} strokeWidth="0.5" opacity="0.85" />
      </svg>
      {/* Content confined to visible panel zone */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "57%", padding: "12px 14px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <SlideLogo size={21} />
          <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
        </div>
        <div>
          <div style={{ width: 20, height: 2, backgroundColor: c.accent, borderRadius: 1, marginBottom: 6 }} />
          <TagBadge label="Design & Strategy" accent={c.accent} glow={c.accentGlow} />
          <div style={{ marginTop: 6, fontSize: 17, fontWeight: 900, lineHeight: 1.08, color: c.text, letterSpacing: "-0.03em", marginBottom: 5 }}>
            Content that positions your brand
          </div>
          <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.48, marginBottom: 9 }}>
            From strategy to visuals — a digital presence built to last and convert.
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, fontWeight: 500, color: c.dim, letterSpacing: "0.01em" }}>@danimoscatellistudio</span>
            <Arrow accent={c.accent} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cover variant C — Full photo + frosted glass card ─────────────────────
function CoverSlideC({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: "#0D1119" }}>
      <img src={IMG.work} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      {/* Dimming overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: theme === "dark" ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.18)" }} />
      {/* Top bar */}
      <div style={{ position: "absolute", top: 12, left: 14, right: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <SlideLogo size={22} white />
        <Num idx={idx} total={total} color="rgba(255,255,255,0.75)" bg="rgba(0,0,0,0.38)" />
      </div>
      {/* Frosted glass card — centered vertically */}
      <div style={{
        position: "absolute", left: "7%", right: "7%", top: "50%", transform: "translateY(-50%)",
        backgroundColor: theme === "dark" ? "rgba(13,17,25,0.82)" : "rgba(255,255,255,0.90)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.65)"}`,
        borderRadius: 12, padding: "14px 16px",
      }}>
        <TagBadge label="Content strategy" accent={c.accent} glow={c.accentGlow} />
        <div style={{ marginTop: 7, fontSize: 17, fontWeight: 900, lineHeight: 1.10, color: c.text, letterSpacing: "-0.028em", marginBottom: 4 }}>
          Digital brand that attracts and converts
        </div>
        <div style={{ width: 18, height: 1.5, backgroundColor: c.accent, borderRadius: 1, marginBottom: 6 }} />
        <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.50, marginBottom: 10 }}>
          Visual and editorial strategy aligned to build real authority online.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: c.dim }}>@danimoscatellistudio</span>
          <Arrow accent={c.accent} />
        </div>
      </div>
    </div>
  );
}

// ── Cover variant D — Photo top + solid bottom strip ──────────────────────
function CoverSlideD({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", backgroundColor: c.bg }}>
      {/* Photo — top 58% */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "58%" }}>
        <img src={IMG.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* Fade into bg at bottom */}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 45%, ${c.bg} 100%)` }} />
        {/* Logo + num */}
        <div style={{ position: "absolute", top: 10, left: 12 }}>
          <SlideLogo size={22} white />
        </div>
        <div style={{ position: "absolute", top: 10, right: 12 }}>
          <Num idx={idx} total={total} color="rgba(255,255,255,0.78)" bg="rgba(0,0,0,0.36)" />
        </div>
      </div>
      {/* Bottom content — floats over the fade zone */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "48%", padding: "0 16px 15px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {/* Decorated tag row */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: c.borderUp }} />
          <TagBadge label="Digital Identity" accent={c.accent} glow={c.accentGlow} />
          <div style={{ flex: 1, height: 1, backgroundColor: c.borderUp }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.08, color: c.text, letterSpacing: "-0.03em", marginBottom: 5 }}>
          Design that tells your story
        </div>
        <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.48, marginBottom: 9 }}>
          Consistent visuals, content strategy and positioning that truly connect.
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, fontWeight: 500, color: c.dim, letterSpacing: "0.01em" }}>@danimoscatellistudio</span>
          <Arrow accent={c.accent} />
        </div>
      </div>
    </div>
  );
}

function ChartSlide({ theme, idx, total, type }: { theme: SlideTheme; idx: number; total: number; type: "area" | "bar" }) {
  const c = gc(theme);
  const isArea = type === "area";
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", padding: "12px 14px 13px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -55, right: -55, width: 140, height: 140, borderRadius: "50%", backgroundColor: c.accent, opacity: 0.04, pointerEvents: "none" }} />
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlideLogo size={19} />
          <TagBadge label={isArea ? "Engagement" : "Growth"} accent={c.accent} glow={c.accentGlow} />
        </div>
        <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
      </div>
      {/* Stat */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginBottom: 3, flexShrink: 0 }}>
        <span style={{ fontSize: 30, fontWeight: 900, color: c.accent, letterSpacing: "-0.038em", lineHeight: 1 }}>
          {isArea ? "+116%" : "+67%"}
        </span>
        <span style={{ fontSize: 10, color: c.sub, fontWeight: 500 }}>{isArea ? "in 6 months" : "per year"}</span>
      </div>
      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 800, color: c.text, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 8, flexShrink: 0 }}>
        {isArea ? "Engagement grew steadily with a long-term strategy" : "Growth consolidated quarter over quarter throughout the year"}
      </div>
      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0, marginBottom: 7 }}>
        <ResponsiveContainer width="100%" height="100%">
          {isArea ? (
            <AreaChart data={engData} margin={{ top: 2, right: 2, bottom: 2, left: -28 }}>
              <XAxis dataKey="m" tick={{ fontSize: 8, fill: c.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: c.dim }} axisLine={false} tickLine={false} />
              <Area type="monotone" dataKey="v" stroke={c.accent} strokeWidth={2} fill={c.accent} fillOpacity={0.18} dot={false} />
            </AreaChart>
          ) : (
            <BarChart data={growthData} margin={{ top: 2, right: 2, bottom: 2, left: -28 }}>
              <XAxis dataKey="q" tick={{ fontSize: 8, fill: c.dim }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 8, fill: c.dim }} axisLine={false} tickLine={false} />
              <Bar dataKey="v" fill={c.accent} radius={[3, 3, 0, 0]} opacity={0.9} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Copy */}
      <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.50, marginBottom: 6, flexShrink: 0 }}>
        {isArea
          ? "Posting without strategy is shouting into the void. Every point on the chart represents a decision: the right format, the right time, the right message for the right audience."
          : "Consistent results are built with method, not luck. Quarterly growth reflects a repeatable, scalable process applied week after week."}
      </div>
      <SlideFooter theme={theme} />
    </div>
  );
}

function ChartCopySlide({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", padding: "12px 14px 13px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -40, left: -40, width: 120, height: 120, borderRadius: "50%", backgroundColor: c.accent, opacity: 0.04, pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlideLogo size={19} />
          <TagBadge label="Data" accent={c.accent} glow={c.accentGlow} />
        </div>
        <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.022em", lineHeight: 1.18, marginBottom: 8, flexShrink: 0 }}>
        Why does data matter in your content strategy?
      </div>
      <div style={{ height: "38%", flexShrink: 0, marginBottom: 8, position: "relative" }}>
        <SvgArea data={engData} accent={c.accent} />
        {/* X-axis labels */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, display: "flex", justifyContent: "space-between" }}>
          {engData.map(d => (
            <span key={d.m} style={{ fontSize: 7, color: c.dim, lineHeight: 1 }}>{d.m}</span>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 10, color: c.sub, lineHeight: 1.58, marginBottom: 6 }}>
            Without tracking metrics, you publish in the dark. Every post is a hypothesis — and data is what turns a hypothesis into a real, repeatable strategy.
          </div>
          <div style={{ fontSize: 10, color: c.sub, lineHeight: 1.58 }}>
            Engagement, reach and saves reveal what the algorithm rewards and what your audience really wants to see. Ignoring this means ceding ground to those who analyze.
          </div>
        </div>
        <SlideFooter theme={theme} />
      </div>
    </div>
  );
}

function TopicsSlide({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  const topics = [
    "Clear and consistent positioning",
    "Posting frequency and rhythm",
    "Content that educates and drives engagement",
    "Weekly metrics analysis",
    "Continuous data-driven optimization",
  ];
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", padding: "12px 14px 13px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <CornerAccent accent={c.accent} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlideLogo size={19} />
          <TagBadge label="Strategy" accent={c.accent} glow={c.accentGlow} />
        </div>
        <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.022em", lineHeight: 1.18, marginBottom: 3, flexShrink: 0 }}>
        5 pillars of content strategy
      </div>
      <div style={{ width: 20, height: 2, backgroundColor: c.accent, borderRadius: 1, marginBottom: 9, flexShrink: 0 }} />

      {/* Clean topic list */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}>
          {topics.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "6px 0",
              borderBottom: i < topics.length - 1 ? `1px solid ${c.border}` : "none",
            }}>
              <span style={{ fontSize: 8.5, fontWeight: 800, color: c.accent, minWidth: 16, textAlign: "right", flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: c.text, lineHeight: 1.3 }}>{t}</span>
            </div>
          ))}
        </div>

        {/* Explanatory block */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: 7, padding: "7px 9px", marginBottom: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.55 }}>
            Each pillar is worked on in an integrated way. You don't need to master everything at once — but you need all of them on your radar. The absence of any one compromises the rest.
          </div>
        </div>

        <SlideFooter theme={theme} />
      </div>
    </div>
  );
}

function StepsSlide({ theme, idx, total, stepNum, stepTotal }: {
  theme: SlideTheme; idx: number; total: number; stepNum: number; stepTotal: number;
}) {
  const c = gc(theme);
  const steps = [
    {
      title: "Define your positioning",
      body: "Before creating any content, you need to know exactly who you are, who you speak to and what transformation you deliver. Without that, every post is just noise — well produced, but directionless.",
      tip: "Write it in one sentence: \"I help [who] achieve [result] through [method]\". Test it with people who don't know you.",
    },
    {
      title: "Choose the right platforms",
      body: "You don't need to be everywhere — you need to be good where your audience is. Instagram and LinkedIn have completely different audiences and behaviors. Choose intentionally.",
      tip: "Start with one platform. Master it before expanding to another.",
    },
    {
      title: "Create your editorial calendar",
      body: "Consistency beats inspiration. An editorial calendar sets the rhythm, formats and themes in advance, eliminating creative block and ensuring regularity.",
      tip: "Plan in 2-week cycles. Reserve Monday to review and adjust.",
    },
  ];
  const s = steps[(stepNum - 1) % steps.length];
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", padding: "12px 14px 13px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      {/* Background accent blob */}
      <div style={{ position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}16 0%, transparent 70%)`, pointerEvents: "none" }} />
      {/* Decorative step number background */}
      <div style={{ position: "absolute", right: 10, bottom: 30, fontSize: 80, fontWeight: 900, color: c.accent, opacity: 0.04, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        {String(stepNum).padStart(2, "0")}
      </div>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SlideLogo size={19} />
          <TagBadge label={`Step ${stepNum} of ${stepTotal}`} accent={c.accent} glow={c.accentGlow} />
        </div>
        <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
      </div>

      {/* Step progress dots */}
      <div style={{ display: "flex", gap: 4, marginBottom: 9, flexShrink: 0 }}>
        {Array.from({ length: stepTotal }).map((_, i) => (
          <div key={i} style={{ height: 3, flex: 1, borderRadius: 999, backgroundColor: i < stepNum ? c.accent : c.borderUp }} />
        ))}
      </div>

      {/* Big step number */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 5, flexShrink: 0 }}>
        <span style={{ fontSize: 48, fontWeight: 900, color: c.accent, lineHeight: 1, letterSpacing: "-0.045em" }}>
          {String(stepNum).padStart(2, "0")}
        </span>
        <div style={{ paddingBottom: 6 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: c.dim, lineHeight: 1 }}>Step</div>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: c.dim, lineHeight: 1.4 }}>by Step</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: "100%", height: 1, backgroundColor: c.borderUp, marginBottom: 7, flexShrink: 0 }} />

      {/* Title */}
      <div style={{ fontSize: 14, fontWeight: 800, color: c.text, letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 7, flexShrink: 0 }}>
        {s.title}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Body */}
          <div style={{ fontSize: 10, color: c.sub, lineHeight: 1.58, marginBottom: 7 }}>{s.body}</div>
          {/* Tip */}
          <div style={{
            backgroundColor: c.accentGlow, border: `1px solid ${c.accentBorder}`,
            borderRadius: 6, padding: "6px 8px", display: "flex", alignItems: "flex-start", gap: 6,
          }}>
            <span style={{ fontSize: 10, flexShrink: 0 }}>💡</span>
            <span style={{ fontSize: 9.5, color: c.text, lineHeight: 1.48 }}>{s.tip}</span>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <SlideFooter theme={theme} />
        </div>
      </div>
    </div>
  );
}

function PhotoSlide({ theme, idx, total, img, tag, title, body, platform }: {
  theme: SlideTheme; idx: number; total: number; img: string;
  tag: string; title: string; body: string; platform: Platform;
}) {
  const c = gc(theme);
  if (platform === "linkedin") {
    return (
      <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", overflow: "hidden", position: "relative" }}>
        <div style={{ width: "42%", position: "relative", flexShrink: 0 }}>
          <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: theme === "dark" ? "linear-gradient(to right, transparent 50%, #0D1119 100%)" : "linear-gradient(to right, transparent 50%, #FFFFFF 100%)" }} />
        </div>
        <div style={{ flex: 1, padding: "12px 14px 13px 10px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <SlideLogo size={18} />
            <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
          </div>
          <div>
            <TagBadge label={tag} accent={c.accent} glow={c.accentGlow} />
            <div style={{ marginTop: 5, fontSize: 13, fontWeight: 800, color: c.text, letterSpacing: "-0.022em", lineHeight: 1.18, marginBottom: 5 }}>{title}</div>
            <div style={{ fontSize: 9.5, color: c.sub, lineHeight: 1.52 }}>{body}</div>
          </div>
          <SlideFooter theme={theme} />
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      <div style={{ height: "46%", position: "relative", flexShrink: 0 }}>
        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: theme === "dark" ? "linear-gradient(to bottom, transparent 38%, rgba(13,17,25,0.72) 72%, #0D1119 100%)" : "linear-gradient(to bottom, transparent 38%, rgba(255,255,255,0.72) 72%, #FFFFFF 100%)" }} />
        <div style={{ position: "absolute", top: 10, left: 12 }}><SlideLogo size={18} white={theme === "dark"} /></div>
        <div style={{ position: "absolute", top: 10, right: 12 }}><Num idx={idx} total={total} color={theme === "dark" ? "rgba(255,255,255,0.75)" : c.sub} bg={theme === "dark" ? "rgba(0,0,0,0.36)" : c.surface} /></div>
      </div>
      <div style={{ flex: 1, padding: "10px 14px 13px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <TagBadge label={tag} accent={c.accent} glow={c.accentGlow} />
          <div style={{ marginTop: 5, fontSize: 15, fontWeight: 800, color: c.text, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 5 }}>{title}</div>
          <div style={{ fontSize: 10.5, color: c.sub, lineHeight: 1.50 }}>{body}</div>
        </div>
        <SlideFooter theme={theme} />
      </div>
    </div>
  );
}

function ClosingSlide({ theme, idx, total }: { theme: SlideTheme; idx: number; total: number }) {
  const c = gc(theme);
  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: c.bg, display: "flex", flexDirection: "column", padding: "13px 15px 15px", boxSizing: "border-box", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -70, right: -70, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}1A 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 140, height: 140, borderRadius: "50%", background: `radial-gradient(circle, ${c.accent}10 0%, transparent 70%)`, pointerEvents: "none" }} />
      <CornerAccent accent={c.accent} />

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexShrink: 0 }}>
        <SlideLogo size={21} />
        <Num idx={idx} total={total} color={c.dim} bg={c.surface} />
      </div>

      {/* Content fills the space */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Accent line + headline */}
          <div style={{ width: 20, height: 2, backgroundColor: c.accent, borderRadius: 1, marginBottom: 8 }} />
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const, color: c.accent, marginBottom: 6 }}>
            Let's talk?
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: c.text, letterSpacing: "-0.035em", lineHeight: 1.0, marginBottom: 6 }}>
            Get in touch
          </div>
          <div style={{ fontSize: 10.5, color: c.sub, lineHeight: 1.50, marginBottom: 12 }}>
            I turn brands into relevant digital presences. If you want to grow with strategy, aesthetics and consistency — this is the way.
          </div>

          {/* Email block */}
          <div style={{
            backgroundColor: c.surface, border: `1px solid ${c.borderUp}`,
            borderRadius: 8, padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
          }}>
            <Mail size={12} color={c.accent} />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: c.text }}>contact@email.com</span>
          </div>

          {/* Website row */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <MapPin size={10} color={c.dim} />
            <span style={{ fontSize: 9.5, color: c.dim }}>danimoscatellistudio.com.br</span>
          </div>
        </div>

        {/* Avatar section */}
        <div>
          <div style={{ width: "100%", height: 1, backgroundColor: c.border, marginBottom: 10 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ImageWithFallback
              src={avatarDani}
              alt="Dani Moscatelli"
              style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: `2px solid ${c.accent}`, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: c.text, lineHeight: 1.2, marginBottom: 1 }}>Dani Moscatelli</div>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: c.accent }}>@danimoscatellistudio</div>
              <div style={{ fontSize: 9, color: c.dim, marginTop: 1 }}>Brand Designer & Digital Strategist</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SLIDE REGISTRY
// ════════════════════════════════════════════════════════════════

type SlideDef =
  | { kind: "comp"; comp: React.ComponentType<{ theme: SlideTheme; idx: number; total: number }>; label: string; desc: string }
  | { kind: "config"; config: SlideConfig };

interface CategoryDef {
  id: string;
  label: string;
  icon: string;
  desc: string;
  items: SlideDef[];
}

const CATEGORIES: CategoryDef[] = [
  {
    id: "capas",
    label: "Covers",
    icon: "🖼",
    desc: "Opening slides. They combine a background photo, logo and title with strong visual hierarchy.",
    items: [
      { kind: "comp", comp: CoverSlide,  label: "Full Bleed",     desc: "Photo · reading gradient · corner scrim" },
      { kind: "comp", comp: CoverSlideB, label: "Side Panel", desc: "Solid panel with diagonal cut · photo on the right" },
      { kind: "comp", comp: CoverSlideC, label: "Glass Card",     desc: "Frosted glass card centered over photo" },
      { kind: "comp", comp: CoverSlideD, label: "Bottom Strip", desc: "Top photo · solid band with title and CTA" },
    ],
  },
  {
    id: "graficos",
    label: "Charts",
    icon: "📊",
    desc: "Visualized data with a highlighted stat and supporting copy.",
    items: [
      { kind: "config", config: { type: "chart-area", label: "Area + Stat",    desc: "Engagement · large stat · supporting copy" } },
      { kind: "config", config: { type: "chart-bar",  label: "Bars + Stat",  desc: "Quarterly growth · bars · context" } },
      { kind: "config", config: { type: "chart-copy", label: "Chart + Copy", desc: "Compact chart · two text blocks" } },
    ],
  },
  {
    id: "topicos",
    label: "Topics",
    icon: "📋",
    desc: "Numbered lists of pillars, tips or content items with an explanatory block.",
    items: [
      { kind: "config", config: { type: "topics", label: "Topic List", desc: "5 numbered items · clean dividers · context block" } },
    ],
  },
  {
    id: "steps",
    label: "Step by Step",
    icon: "🔢",
    desc: "One step per slide. Large numbering, progress bar and action tip.",
    items: [
      { kind: "config", config: { type: "steps", label: "Step 01 / 03", desc: "Define your positioning",    step: { num: 1, total: 3 } } },
      { kind: "config", config: { type: "steps", label: "Step 02 / 03", desc: "Choose the right platforms", step: { num: 2, total: 3 } } },
      { kind: "config", config: { type: "steps", label: "Step 03 / 03", desc: "Create your editorial calendar",  step: { num: 3, total: 3 } } },
    ],
  },
  {
    id: "fotos",
    label: "Photo + Copy",
    icon: "📸",
    desc: "Editorial photography with category tag, title and body text.",
    items: [
      { kind: "config", config: { type: "photo",  label: "Stacked",   desc: "Top photo · tag · title · body" } },
      { kind: "config", config: { type: "photo2", label: "Variant",  desc: "Alternate layout · photo · editorial" } },
    ],
  },
  {
    id: "fechamento",
    label: "Closing",
    icon: "✉",
    desc: "Final carousel slide with CTA, email, website and avatar.",
    items: [
      { kind: "config", config: { type: "closing", label: "Contact Me", desc: "Email · website · avatar · @handle" } },
    ],
  },
];

function renderSlide(slide: SlideConfig, theme: SlideTheme, idx: number, total: number, platform: Platform): React.ReactNode {
  switch (slide.type) {
    case "cover":      return <CoverSlide theme={theme} idx={idx} total={total} />;
    case "chart-area": return <ChartSlide theme={theme} idx={idx} total={total} type="area" />;
    case "chart-bar":  return <ChartSlide theme={theme} idx={idx} total={total} type="bar" />;
    case "chart-copy": return <ChartCopySlide theme={theme} idx={idx} total={total} />;
    case "topics":     return <TopicsSlide theme={theme} idx={idx} total={total} />;
    case "steps":      return <StepsSlide theme={theme} idx={idx} total={total} stepNum={slide.step?.num ?? 1} stepTotal={slide.step?.total ?? 3} />;
    case "photo":      return <PhotoSlide theme={theme} idx={idx} total={total} img={IMG.team} tag="Pillar #3" title="Content that truly connects" body="It's not about posting more. It's about posting with intention, consistency and a clear strategy for what you want your audience to do next." platform={platform} />;
    case "photo2":     return <PhotoSlide theme={theme} idx={idx} total={total} img={IMG.work} tag="Pillar #5" title="Digital presence that drives real results" body="You don't need to be everywhere. You need to be in the right place, with the right message, for the right person." platform={platform} />;
    case "closing":    return <ClosingSlide theme={theme} idx={idx} total={total} />;
  }
}

function SlideFrame({ children, borderRadius = 14 }: {
  children: React.ReactNode; borderRadius?: number;
}) {
  return (
    <div
      className="aspect-[4/5]"
      style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius, boxShadow: "0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.12)", backgroundColor: "#0D1119" }}
    >
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// CATEGORY BROWSER
// ════════════════════════════════════════════════════════════════

function renderDef(def: SlideDef, theme: SlideTheme, idx: number, total: number): React.ReactNode {
  if (def.kind === "comp") {
    const Comp = def.comp;
    return <Comp theme={theme} idx={idx} total={total} />;
  }
  return renderSlide(def.config, theme, idx, total, "instagram");
}

function colsForCount(n: number) {
  if (n === 1) return "";
  if (n === 2) return "sm:grid-cols-2";
  if (n === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-3";
}

function CategorySection({ cat, theme }: { cat: CategoryDef; theme: SlideTheme }) {
  const n = cat.items.length;
  const cols = colsForCount(n);
  const singleCenter = n === 1 ? "max-w-[380px] mx-auto" : "";

  return (
    <div id={`cat-${cat.id}`} className="rounded-[20px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none">{cat.icon}</span>
          <div>
            <div className="text-[1.0625rem] font-bold text-foreground leading-tight">{cat.label}</div>
            <div className="text-[0.8125rem] text-muted-foreground mt-0.5">{cat.desc}</div>
          </div>
        </div>
        <div className="shrink-0 text-[0.75rem] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
          {n} {n === 1 ? "tipo" : "tipos"}
        </div>
      </div>

      {/* Slides grid */}
      <div className={`grid grid-cols-1 ${cols} gap-5 p-6 ${singleCenter}`}>
        {cat.items.map((def, i) => {
          const label = def.kind === "comp" ? def.label : def.config.label;
          const desc  = def.kind === "comp" ? def.desc  : def.config.desc;
          return (
            <div key={i} className="space-y-2.5">
              <SlideFrame>
                {renderDef(def, theme, i, n)}
              </SlideFrame>
              <div className="px-0.5">
                <div className="text-[0.8125rem] font-semibold text-foreground">{label}</div>
                <div className="text-[0.75rem] text-muted-foreground mt-0.5 leading-relaxed">{desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ════════════════════════════════════════════════════════════════

export function PostsShowcase() {
  const [activeCat, setActiveCat] = useState("capas");
  const [theme, setTheme] = useState<SlideTheme>("dark");

  const activeCategory = CATEGORIES.find(c => c.id === activeCat)!;

  return (
    <section id="posts" className="space-y-8">

      {/* ── Header ── */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/8 text-primary text-[0.75rem] font-semibold mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Social Media Templates
        </div>
        <h2 className="text-[1.75rem] font-bold tracking-[-0.025em] text-foreground mb-2">Posts & Carousels</h2>
        <p className="text-muted-foreground text-[0.9375rem] max-w-xl leading-relaxed">
          Templates organized by category — covers, charts, topics, step by step, photos and closing.
        </p>
      </div>

      {/* ── Category tabs + theme toggle ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Category pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[0.8125rem] font-semibold transition-all border ${
                activeCat === cat.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-foreground/20"
              }`}
              style={{ boxShadow: activeCat === cat.id ? "0 2px 10px rgba(212,77,77,0.30)" : "var(--shadow-xs)" }}
            >
              <span className="text-[0.875rem] leading-none">{cat.icon}</span>
              {cat.label}
              <span className={`text-[0.6875rem] font-bold px-1.5 py-0.5 rounded-full ${activeCat === cat.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}>
                {cat.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Dark / Light toggle */}
        <div className="flex rounded-[10px] border border-border overflow-hidden shrink-0" style={{ boxShadow: "var(--shadow-xs)" }}>
          {(["dark", "light"] as SlideTheme[]).map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[0.8125rem] font-semibold transition-colors ${
                theme === t ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              {t === "dark" ? <Moon size={13} /> : <Sun size={13} />}
              {t === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active category ── */}
      <CategorySection key={activeCat} cat={activeCategory} theme={theme} />

      {/* ── Spec notes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Slide categories",
            items: [
              "Covers — 4 versions: Full Bleed, Panel, Glass Card, Strip",
              "Charts — area, bars, chart + expanded copy",
              "Topics — numbered list with explanatory block",
              "Step by Step — 1 step per slide, progress bar",
              "Photo + Copy — editorial photography with handle",
              "Closing — CTA, email, website and avatar",
            ],
          },
          {
            title: "Format and dimensions",
            items: [
              "4:5 ratio — 1080 × 1350 px (Instagram standard)",
              "Dark mode — graphite palette, background #0D1119",
              "Light mode — white palette with cool grays",
              "Crimson red #D44D4D as the accent color",
              "Carousel up to 20 slides on Instagram",
              "Static post: single self-contained frame",
            ],
          },
        ].map(card => (
          <div key={card.title} className="rounded-[14px] border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-xs)" }}>
            <div className="text-[0.875rem] font-bold text-foreground mb-3">{card.title}</div>
            <ul className="space-y-2">
              {card.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-[0.8125rem] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-[0.35rem] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
