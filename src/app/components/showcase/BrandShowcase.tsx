import React, { useState } from "react";
import { CheckCircle, XCircle, Copy, Check, Download, Monitor, Tablet, Smartphone, Globe, Share2, Image as ImageIcon, UserCircle2, LayoutDashboard } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoVerticalLight from "@/imports/Logo-Vertical-LightMode-1.png";
import logoVerticalDark from "@/imports/Logo-Vertical-DarkMode.png";
import logoHorizontalLight from "@/imports/Logo-Horizontal-LightMode.png";
import logoHorizontalDark from "@/imports/Logo-Horizontal-DarkMode-1.png";
import iconeGrey from "@/imports/IconeLogo-grey.png";
import iconeWhite from "@/imports/IconeLogo-white.png";
import iconeRed from "@/imports/IconeLogo-red.png";
import svgVerticalLight from "@/imports/svg/dani-moscatelli-logo-vertical-light.svg?raw";
import svgVerticalDark from "@/imports/svg/dani-moscatelli-logo-vertical-dark.svg?raw";
import svgHorizontalOnLight from "@/imports/svg/dani-moscatelli-logo-horizontal-on-light.svg?raw";
import svgHorizontalOnDark from "@/imports/svg/dani-moscatelli-logo-horizontal-on-dark.svg?raw";
import svgSymbolGrey from "@/imports/svg/dani-moscatelli-symbol-grey.svg?raw";
import svgSymbolRed from "@/imports/svg/dani-moscatelli-symbol-red.svg?raw";
import svgSymbolWhite from "@/imports/svg/dani-moscatelli-symbol-white.svg?raw";

type DownloadAsset = { png: string; svg: string; filename: string };

function saveBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}

async function downloadPng(url: string, filename: string) {
  try {
    saveBlob(await (await fetch(url)).blob(), filename);
  } catch {
    window.open(url, "_blank");
  }
}

function downloadSvg(markup: string, filename: string) {
  saveBlob(new Blob([markup], { type: "image/svg+xml;charset=utf-8" }), filename);
}

function DownloadButtons({ asset }: { asset: DownloadAsset }) {
  const btn =
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[0.75rem] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => downloadPng(asset.png, `${asset.filename}.png`)}
        className={btn}
        aria-label={`Download ${asset.filename} as PNG with transparent background`}
        title="PNG, transparent background"
      >
        <Download size={13} aria-hidden /> PNG
      </button>
      <button
        type="button"
        onClick={() => downloadSvg(asset.svg, `${asset.filename}.svg`)}
        className={btn}
        aria-label={`Download ${asset.filename} as SVG`}
        title="SVG, vector"
      >
        <Download size={13} aria-hidden /> SVG
      </button>
    </div>
  );
}

/* ── Section header ── */
function SectionBlock({ id, title, subtitle }: { id: string; title: string; subtitle?: string }) {
  return (
    <div id={id} className="mb-8">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {subtitle && <p className="mt-1 text-[0.9375rem] text-muted-foreground">{subtitle}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

/* ── Logo card ── */
function LogoCard({
  label,
  description,
  bg,
  children,
  badge,
  download,
}: {
  label: string;
  description?: string;
  bg: string;
  children: React.ReactNode;
  badge?: string;
  download?: DownloadAsset;
}) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className={`flex items-center justify-center p-10 min-h-[220px] ${bg}`}>
        {children}
      </div>
      <div className="px-5 py-4 bg-card border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.875rem] font-semibold text-foreground">{label}</p>
            {description && <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {download && <DownloadButtons asset={download} />}
          {!download && badge && (
            <span className="text-[0.6875rem] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Color chip ── */
function ColorChip({ name, hex, textColor = "text-foreground" }: { name: string; hex: string; textColor?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 transition-all w-full text-left"
    >
      <div
        className="h-9 w-9 rounded-lg shrink-0 border border-border/40"
        style={{ backgroundColor: hex }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-[0.875rem] font-semibold text-foreground truncate">{name}</p>
        <p className="text-[0.8125rem] text-muted-foreground font-mono">{hex}</p>
      </div>
      <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </span>
    </button>
  );
}

/* ── Do / Don't card ── */
function RuleCard({
  type,
  bg,
  children,
  label,
}: {
  type: "do" | "dont";
  bg: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      <div className={`flex items-center justify-center p-8 min-h-[180px] ${bg}`}>{children}</div>
      <div className="px-4 py-3 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          {type === "do" ? (
            <CheckCircle className="h-4 w-4 text-success shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 text-error shrink-0" />
          )}
          <span className={`text-[0.8125rem] font-medium ${type === "do" ? "text-success" : "text-error"}`}>
            {type === "do" ? "Correct" : "Incorrect"}
          </span>
        </div>
        <p className="mt-0.5 text-[0.8125rem] text-muted-foreground pl-6">— {label}</p>
      </div>
    </div>
  );
}

export function BrandShowcase() {
  return (
    <section id="brand" className="space-y-16">

      {/* ── Intro ── */}
      <div>
        <p className="text-[0.9375rem] leading-relaxed text-muted-foreground max-w-2xl">
          Dani Moscatelli brand usage guidelines — logo versions, symbol, palette, and application rules
          to ensure consistency across all touchpoints.
        </p>
      </div>

      {/* ── Logo Vertical ── */}
      <div>
        <SectionBlock
          id="brand-logo-vertical"
          title="Primary Logo — Vertical"
          subtitle="Primary brand version. Use as the first choice in presentation materials, covers, and documents."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LogoCard
            download={{ png: logoVerticalLight, svg: svgVerticalLight, filename: "dani-moscatelli-logo-vertical-light" }}
            label="For Light Backgrounds"
            description="Dark text — use on white and neutral backgrounds"
            bg="bg-white"
                      >
            <ImageWithFallback
              src={logoVerticalLight}
              alt="Dani Moscatelli vertical logo — for light backgrounds"
              className="h-52 w-auto object-contain"
            />
          </LogoCard>
          <LogoCard
            download={{ png: logoVerticalDark, svg: svgVerticalDark, filename: "dani-moscatelli-logo-vertical-dark" }}
            label="For Dark Backgrounds"
            description="Light text — use on dark and colored backgrounds"
            bg="bg-[#0D1119]"
                      >
            <ImageWithFallback
              src={logoVerticalDark}
              alt="Dani Moscatelli vertical logo — for dark backgrounds"
              className="h-52 w-auto object-contain"
            />
          </LogoCard>
        </div>
      </div>

      {/* ── Logo Horizontal ── */}
      <div>
        <SectionBlock
          id="brand-logo-horizontal"
          title="Logo Horizontal"
          subtitle="Use when vertical space is limited — website headers, email signatures, and banners."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LogoCard
            download={{ png: logoHorizontalDark, svg: svgHorizontalOnLight, filename: "dani-moscatelli-logo-horizontal-on-light" }}
            label="For Light Backgrounds"
            description="Dark text — use on white and neutral backgrounds"
            bg="bg-white"
                      >
            <ImageWithFallback
              src={logoHorizontalDark}
              alt="Dani Moscatelli horizontal logo — for light backgrounds"
              className="h-20 w-auto object-contain"
            />
          </LogoCard>
          <LogoCard
            download={{ png: logoHorizontalLight, svg: svgHorizontalOnDark, filename: "dani-moscatelli-logo-horizontal-on-dark" }}
            label="For Dark Backgrounds"
            description="Light text — use on dark or textured backgrounds"
            bg="bg-[#0D1119]"
                      >
            <ImageWithFallback
              src={logoHorizontalLight}
              alt="Dani Moscatelli horizontal logo — for dark backgrounds"
              className="h-20 w-auto object-contain"
            />
          </LogoCard>
        </div>
      </div>

      {/* ── Symbol / Icon ── */}
      <div>
        <SectionBlock
          id="brand-symbol"
          title="Symbol — DM Icon"
          subtitle="Use the standalone symbol as an avatar, favicon, app icon, and watermark. Always keep the original proportions."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <LogoCard
            download={{ png: iconeGrey, svg: svgSymbolGrey, filename: "dani-moscatelli-symbol-grey" }}
            label="Graphite"
            description="For light and neutral backgrounds"
            bg="bg-[#F5F7FA]"
          >
            <ImageWithFallback
              src={iconeGrey}
              alt="DM Icon — Graphite"
              className="h-28 w-auto object-contain"
            />
          </LogoCard>
          <LogoCard
            download={{ png: iconeRed, svg: svgSymbolRed, filename: "dani-moscatelli-symbol-red" }}
            label="Crimson"
            description="Primary color version"
            bg="bg-white"
          >
            <ImageWithFallback
              src={iconeRed}
              alt="DM Icon — Crimson"
              className="h-28 w-auto object-contain"
            />
          </LogoCard>
          <LogoCard
            download={{ png: iconeWhite, svg: svgSymbolWhite, filename: "dani-moscatelli-symbol-white" }}
            label="White"
            description="For dark and primary backgrounds"
            bg="bg-[#0D1119]"
          >
            <ImageWithFallback
              src={iconeWhite}
              alt="DM Icon — White"
              className="h-28 w-auto object-contain"
            />
          </LogoCard>
        </div>
      </div>

      {/* ── When and where to use the symbol ── */}
      <div>
        <SectionBlock
          id="brand-symbol-usage"
          title="When and Where to Use the Symbol"
          subtitle="The symbol replaces the full logo only when space is very limited or the context already establishes the brand."
        />

        {/* Usage contexts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              icon: Globe,
              label: "Favicon",
              desc: "16 × 16 px to 32 × 32 px",
              bg: "bg-card",
              preview: iconeRed,
              previewSize: "h-6",
            },
            {
              icon: Smartphone,
              label: "App Icon",
              desc: "Mobile app and PWA icon",
              bg: "bg-[#0D1119]",
              preview: iconeWhite,
              previewSize: "h-10",
            },
            {
              icon: UserCircle2,
              label: "Avatar / Profile",
              desc: "Profile photo and thumbnails",
              bg: "bg-card",
              preview: iconeRed,
              previewSize: "h-10",
            },
            {
              icon: Share2,
              label: "Social Media",
              desc: "Profile photo on social networks",
              bg: "bg-[#0D1119]",
              preview: iconeWhite,
              previewSize: "h-10",
            },
            {
              icon: LayoutDashboard,
              label: "Mobile Navbar",
              desc: "App header on narrow screens",
              bg: "bg-card",
              preview: iconeGrey,
              previewSize: "h-8",
            },
            {
              icon: ImageIcon,
              label: "Watermark",
              desc: "Watermark on images and videos",
              bg: "bg-[#283043]",
              preview: iconeWhite,
              previewSize: "h-8",
            },
            {
              icon: Monitor,
              label: "Loading Screen",
              desc: "Splash screen and loading screen",
              bg: "bg-[#0D1119]",
              preview: iconeRed,
              previewSize: "h-12",
            },
            {
              icon: Tablet,
              label: "Collapsed Sidebar",
              desc: "Side nav in compact mode",
              bg: "bg-card",
              preview: iconeGrey,
              previewSize: "h-8",
            },
          ].map(({ icon: Icon, label, desc, bg, preview, previewSize }) => (
            <div key={label} className={`rounded-2xl border border-border ${bg} p-5 flex flex-col gap-4`}>
              <div className="flex items-start justify-between">
                <Icon className="h-4 w-4 text-muted-foreground mt-0.5" />
                <ImageWithFallback
                  src={preview}
                  alt={`DM symbol — ${label}`}
                  className={`${previewSize} w-auto object-contain`}
                />
              </div>
              <div>
                <p className="text-[0.875rem] font-semibold text-foreground">{label}</p>
                <p className="text-[0.75rem] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Minimum sizes */}
        <div className="rounded-2xl border border-border bg-card px-6 py-5">
          <p className="text-[0.8125rem] font-semibold text-foreground mb-4">Minimum Sizes</p>
          <div className="flex flex-wrap gap-6 items-end">
            {[
              { size: "h-3 w-3", label: "16px", note: "digital minimum" },
              { size: "h-5 w-5", label: "24px", note: "favicon / tab" },
              { size: "h-7 w-7", label: "32px", note: "small avatar" },
              { size: "h-10 w-10", label: "40px", note: "mobile navbar" },
              { size: "h-14 w-14", label: "56px", note: "profile / social" },
              { size: "h-20 w-20", label: "80px", note: "app icon" },
            ].map(({ size, label, note }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <ImageWithFallback
                  src={iconeRed}
                  alt={`Symbol ${label}`}
                  className={`${size} object-contain`}
                />
                <span className="text-[0.75rem] font-mono font-semibold text-foreground">{label}</span>
                <span className="text-[0.6875rem] text-muted-foreground">{note}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[0.75rem] text-muted-foreground border-t border-border pt-3">
            Never use the symbol below <span className="font-semibold text-foreground">16 px</span> in digital or <span className="font-semibold text-foreground">5 mm</span> in print.
          </p>
        </div>
      </div>

      {/* ── Responsiveness ── */}
      <div>
        <SectionBlock
          id="brand-responsive"
          title="Responsiveness — Adaptation by Device"
          subtitle="The logo adapts to the available space. Always use the most complete version the space allows."
        />

        {/* Breakpoints diagram */}
        <div className="space-y-4">

          {/* Desktop */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-[0.8125rem] font-semibold text-foreground">Desktop</span>
              <span className="text-[0.75rem] text-muted-foreground">≥ 1024 px</span>
              <span className="ml-auto text-[0.75rem] font-mono text-primary">Full Horizontal Logo</span>
            </div>
            <div className="px-8 py-6 bg-[#181F2E] flex items-center gap-0 rounded-b-2xl">
              {/* Desktop navbar simulation */}
              <ImageWithFallback
                src={iconeWhite}
                alt="Logo icon — desktop"
                className="h-8 w-auto object-contain"
              />
              <div className="ml-auto flex items-center gap-5">
                {["Home", "Services", "Portfolio", "Contact"].map(item => (
                  <span key={item} className="text-[0.8125rem] text-white/60">{item}</span>
                ))}
                <div className="h-8 w-20 rounded-lg bg-primary/80 flex items-center justify-center">
                  <span className="text-[0.75rem] text-white font-medium">Hire us</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
              <Tablet className="h-4 w-4 text-muted-foreground" />
              <span className="text-[0.8125rem] font-semibold text-foreground">Tablet</span>
              <span className="text-[0.75rem] text-muted-foreground">768 px – 1023 px</span>
              <span className="ml-auto text-[0.75rem] font-mono text-primary">Vertical Logo or reduced Horizontal</span>
            </div>
            <div className="px-8 py-6 bg-[#181F2E] flex items-center gap-0 rounded-b-2xl">
              <ImageWithFallback
                src={iconeWhite}
                alt="Logo icon — tablet"
                className="h-8 w-auto object-contain"
              />
              <div className="ml-auto flex items-center gap-4">
                {["Services", "Portfolio"].map(item => (
                  <span key={item} className="text-[0.8125rem] text-white/60">{item}</span>
                ))}
                <div className="h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center">
                  <span className="text-white/60 text-lg leading-none">☰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-border bg-muted/30">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-[0.8125rem] font-semibold text-foreground">Mobile</span>
              <span className="text-[0.75rem] text-muted-foreground">{"< 768 px"}</span>
              <span className="ml-auto text-[0.75rem] font-mono text-primary">Standalone symbol</span>
            </div>
            <div className="px-6 py-5 bg-[#181F2E] flex items-center gap-0 rounded-b-2xl">
              <ImageWithFallback
                src={iconeWhite}
                alt="Standalone symbol — mobile"
                className="h-8 w-auto object-contain"
              />
              <div className="ml-auto flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center">
                  <span className="text-white/50 text-xs">🔔</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-muted/30 flex items-center justify-center">
                  <span className="text-white/50 text-xs">👤</span>
                </div>
                <div className="h-8 w-8 rounded-lg bg-muted/40 flex items-center justify-center">
                  <span className="text-white/60 text-lg leading-none">☰</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Summary table */}
        <div className="mt-5 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-4 text-[0.75rem] font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 border-b border-border bg-muted/20">
            <span>Device</span>
            <span>Breakpoint</span>
            <span>Logo version</span>
            <span>Minimum size</span>
          </div>
          {[
            { device: "Desktop",       bp: "≥ 1024 px", version: "Full horizontal", size: "h-8 / 32 px" },
            { device: "Laptop",        bp: "1024–1280 px", version: "Horizontal or Vertical", size: "h-8 / 32 px" },
            { device: "Tablet",        bp: "768–1023 px", version: "Vertical or Horizontal", size: "h-10 / 40 px" },
            { device: "Mobile",        bp: "< 768 px",  version: "Standalone symbol",      size: "h-8 / 32 px" },
            { device: "Favicon / Tab", bp: "—",         version: "Standalone symbol",      size: "16–32 px" },
          ].map(({ device, bp, version, size }, i, arr) => (
            <div
              key={device}
              className={`grid grid-cols-4 px-5 py-3.5 text-[0.8125rem] ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className="font-medium text-foreground">{device}</span>
              <span className="text-muted-foreground font-mono">{bp}</span>
              <span className="text-foreground">{version}</span>
              <span className="text-muted-foreground font-mono">{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Application on backgrounds ── */}
      <div>
        <SectionBlock
          id="brand-backgrounds"
          title="Application on Backgrounds"
          subtitle="How the logo behaves on different design system surfaces."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { bg: "bg-background border border-border", label: "Background", useLight: true },
            { bg: "bg-card border border-border",       label: "Card",       useLight: true },
            { bg: "bg-primary",                         label: "Primary",    useLight: false },
            { bg: "bg-[#0D1119] border border-border",  label: "Graphite 950", useLight: false },
          ].map(({ bg, label, useLight }) => (
            <div key={label} className={`rounded-2xl flex flex-col items-center justify-center gap-4 p-6 min-h-[160px] ${bg}`}>
              <ImageWithFallback
                src={useLight ? iconeRed : iconeWhite}
                alt={`DM icon on ${label}`}
                className="h-14 w-auto object-contain"
              />
              <span className={`text-[0.75rem] font-medium ${useLight ? "text-muted-foreground" : "text-white/60"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Brand palette ── */}
      <div>
        <SectionBlock
          id="brand-colors"
          title="Brand Palette"
          subtitle="The institutional colors — use only these to ensure identity consistency."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ColorChip name="Crimson" hex="#D44D4D" />
          <ColorChip name="Graphite 950" hex="#0D1119" />
          <ColorChip name="Graphite 600" hex="#374155" />
          <ColorChip name="White" hex="#FFFFFF" />
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ColorChip name="Graphite 50" hex="#EDF0F5" />
          <ColorChip name="Graphite 300" hex="#8898B0" />
          <ColorChip name="Crimson 300" hex="#E88080" />
          <ColorChip name="Crimson 600" hex="#8C1B1B" />
        </div>
      </div>

      {/* ── Brand typography ── */}
      <div>
        <SectionBlock
          id="brand-typography"
          title="Institutional Typography"
          subtitle="Plus Jakarta Sans is the brand's primary font. The Experience Design Studio tagline is set in Space Grotesk."
        />
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {[
            { sample: "Dani Moscatelli", size: "text-[2.5rem]", weight: "font-bold",     label: "Display / Logotype",  tracking: "tracking-[-0.03em]" },
            { sample: "Experience Design Studio", size: "text-[1.5rem]", weight: "font-medium",  label: "Tagline",  tracking: "tracking-[0.01em]", font: "font-['Space_Grotesk',_sans-serif]" },
            { sample: "Design System · Components · Patterns", size: "text-[1.125rem]", weight: "font-normal", label: "Body / Descriptive", tracking: "" },
            { sample: "VERSION 1.0 · 2024", size: "text-[0.75rem]", weight: "font-semibold", label: "Label / Caption", tracking: "tracking-[0.12em]" },
          ].map(({ sample, size, weight, label, tracking, font }: { sample: string; size: string; weight: string; label: string; tracking: string; font?: string }, i, arr) => (
            <div
              key={label}
              className={`px-6 py-5 flex items-baseline justify-between gap-4 ${i < arr.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className={`${size} ${weight} ${tracking} text-foreground ${font ?? "font-['Plus_Jakarta_Sans',_sans-serif]"} leading-tight`}>
                {sample}
              </span>
              <span className="text-[0.75rem] text-muted-foreground shrink-0 font-mono">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Do's and Don'ts ── */}
      <div>
        <SectionBlock
          id="brand-rules"
          title="Usage Rules"
          subtitle="Do not distort, recolor, or alter brand elements. Always respect the minimum clear space."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* ── Correct 1: light-background version applied correctly ── */}
          <RuleCard type="do" bg="bg-white" label="Light-background version on a light background">
            <ImageWithFallback
              src={logoHorizontalDark}
              alt="Correct — light-background version on white background"
              className="h-14 w-auto object-contain"
            />
          </RuleCard>

          {/* ── Incorrect 1: light-background version applied on a dark background ── */}
          <RuleCard type="dont" bg="bg-[#0D1119]" label="Do not use the light-background version on a dark background">
            <ImageWithFallback
              src={logoHorizontalDark}
              alt="Incorrect — light-background version on dark background"
              className="h-14 w-auto object-contain"
            />
          </RuleCard>

          {/* ── Correct 2: dark-background version applied correctly ── */}
          <RuleCard type="do" bg="bg-[#0D1119]" label="Dark-background version on a dark background">
            <ImageWithFallback
              src={logoHorizontalLight}
              alt="Correct — dark-background version on dark background"
              className="h-14 w-auto object-contain"
            />
          </RuleCard>

          {/* ── Incorrect 2: dark-background version applied on a light background ── */}
          <RuleCard type="dont" bg="bg-white" label="Do not use the dark-background version on a light background">
            <ImageWithFallback
              src={logoHorizontalLight}
              alt="Incorrect — dark-background version on white background"
              className="h-14 w-auto object-contain opacity-60"
            />
          </RuleCard>

          {/* ── Incorrect 3: logo on a diluted primary color ── */}
          <RuleCard type="dont" bg="bg-primary/20" label="Do not use the logo on a diluted primary color">
            <ImageWithFallback
              src={logoHorizontalDark}
              alt="Incorrect — logo on colored background without contrast"
              className="h-14 w-auto object-contain opacity-50"
            />
          </RuleCard>

          {/* ── Incorrect 4: distorted proportions ── */}
          <RuleCard type="dont" bg="bg-white" label="Do not distort or resize proportions">
            <ImageWithFallback
              src={iconeRed}
              alt="Incorrect — distorted icon"
              className="h-16 w-28 object-fill"
              style={{ transform: "scaleX(1.6)" }}
            />
          </RuleCard>

        </div>
      </div>

      {/* ── Clear space ── */}
      <div>
        <SectionBlock
          id="brand-clearspace"
          title="Clear Space"
          subtitle="Always keep a minimum spacing around the logo equal to the height of the letter 'D' in the logotype."
        />
        <div className="rounded-2xl border border-border bg-card p-20 flex items-center justify-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Clear space indicator lines */}
            <div className="absolute inset-0 -m-10 border-2 border-dashed border-primary/30 rounded-lg pointer-events-none" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <div className="w-px h-8 bg-primary/40" />
              <span className="text-[0.6875rem] font-mono text-primary/60 bg-card px-1.5 py-0.5 rounded">1×</span>
            </div>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
              <span className="text-[0.6875rem] font-mono text-primary/60 bg-card px-1.5 py-0.5 rounded">1×</span>
              <div className="w-px h-8 bg-primary/40" />
            </div>
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <div className="h-px w-8 bg-primary/40" />
              <span className="text-[0.6875rem] font-mono text-primary/60 bg-card px-1.5 py-0.5 rounded rotate-0">1×</span>
            </div>
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[0.6875rem] font-mono text-primary/60 bg-card px-1.5 py-0.5 rounded">1×</span>
              <div className="h-px w-8 bg-primary/40" />
            </div>
            <ImageWithFallback
              src={logoHorizontalDark}
              alt="Logo with minimum clear space"
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>
        <p className="mt-3 text-[0.8125rem] text-muted-foreground text-center">
          Where <span className="font-semibold text-primary">1×</span> = height of the uppercase "D" in the logotype
        </p>
      </div>

    </section>
  );
}
