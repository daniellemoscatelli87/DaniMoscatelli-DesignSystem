import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  Search, Eye, EyeOff, ChevronDown, Plus, Send, Upload,
  Loader2, Trash2, Edit3, Copy, Share, MoreHorizontal,
  ArrowRight, Check, X, AlertCircle, Zap, Star,
} from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

/* ── Shared helpers ── */
function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1">{title}</h2>
      {description && <p className="text-[0.9375rem] text-muted-foreground">{description}</p>}
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card rounded-[16px] border border-border p-6 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </div>
  );
}

/* ── Button variants ── */
const btnBase = "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none font-semibold";

function Btn({ variant = "primary", size = "md", children, loading = false, disabled = false, icon, iconOnly = false, className = "" }:
  { variant?: "primary"|"outline"|"ghost"|"secondary"|"destructive"|"crimson-outline"; size?: "sm"|"md"|"lg"|"xl"|"icon-sm"|"icon"|"icon-lg"; children?: React.ReactNode; loading?: boolean; disabled?: boolean; icon?: React.ReactNode; iconOnly?: boolean; className?: string }) {

  const sizes: Record<string, string> = {
    sm:      "h-8 px-3 text-[0.8125rem] rounded-[8px]",
    md:      "h-10 px-4 text-[0.9375rem] rounded-[12px]",
    lg:      "h-11 px-5 text-[1rem] rounded-[12px]",
    xl:      "h-13 px-7 text-[1rem] rounded-[16px]",
    "icon-sm":"h-8 w-8 rounded-[8px]",
    icon:    "h-10 w-10 rounded-[12px]",
    "icon-lg":"h-11 w-11 rounded-[12px]",
  };

  const variants: Record<string, string> = {
    primary:         "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] active:scale-[0.98] shadow-sm",
    outline:         "border border-[var(--border-strong)] bg-transparent text-foreground hover:bg-accent",
    ghost:           "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
    secondary:       "bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)]",
    destructive:     "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
    "crimson-outline":"border border-primary text-primary bg-transparent hover:bg-[var(--primary-muted)]",
  };

  return (
    <button
      className={`${btnBase} ${sizes[size] || sizes.md} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : icon && <span className="shrink-0">{icon}</span>}
      {!iconOnly && children}
    </button>
  );
}

function InputField({
  label, placeholder = "", type = "text", hint, error, leftIcon, rightElement, disabled = false,
}: {
  label?: string; placeholder?: string; type?: string; hint?: string; error?: string;
  leftIcon?: React.ReactNode; rightElement?: React.ReactNode; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[0.875rem] font-medium text-foreground">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{leftIcon}</span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-card border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none transition-all duration-150
            focus:ring-2 focus:ring-ring focus:border-primary/60
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-primary/60 focus:ring-primary/30" : "border-border hover:border-[var(--border-strong)]"}
            ${leftIcon ? "pl-10" : ""}
            ${rightElement ? "pr-10" : ""}
          `}
          style={{ boxShadow: "var(--shadow-xs)" }}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">{rightElement}</span>
        )}
      </div>
      {error && <p className="text-[0.8125rem] text-primary flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
      {hint && !error && <p className="text-[0.8125rem] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FormShowcase() {
  const [showPwd, setShowPwd] = useState(false);
  const [checkA, setCheckA] = useState<boolean | "indeterminate">(true);
  const [checkB, setCheckB] = useState<boolean | "indeterminate">(false);
  const [checkC, setCheckC] = useState<boolean | "indeterminate">("indeterminate");
  const [swA, setSwA] = useState(true);
  const [swB, setSwB] = useState(false);
  const [radio, setRadio] = useState("b");
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-16">

      {/* ── BUTTONS ── */}
      <section id="buttons">
        <SectionHeader title="Buttons" description="Consistent button hierarchy. Crimson for primary CTAs, outline for secondary, ghost for tertiary." />

        <SubSection title="Variants">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn variant="primary" icon={<Zap className="h-4 w-4" />}>Primary CTA</Btn>
              <Btn variant="outline">Outline</Btn>
              <Btn variant="secondary">Secondary</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="crimson-outline">Crimson Outline</Btn>
              <Btn variant="primary" disabled>Disabled</Btn>
              <Btn variant="primary" loading onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>Loading</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Sizes">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn size="sm">Small</Btn>
              <Btn size="md">Medium</Btn>
              <Btn size="lg">Large</Btn>
              <Btn size="xl">Extra Large</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Icon Buttons">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn size="icon-sm" variant="outline" icon={<Plus className="h-4 w-4" />} iconOnly />
              <Btn size="icon" variant="outline" icon={<Edit3 className="h-4 w-4" />} iconOnly />
              <Btn size="icon-lg" variant="outline" icon={<Share className="h-5 w-5" />} iconOnly />
              <Btn size="icon-sm" variant="ghost" icon={<Trash2 className="h-4 w-4" />} iconOnly />
              <Btn size="icon" variant="ghost" icon={<Copy className="h-4 w-4" />} iconOnly />
              <Btn size="icon" variant="primary" icon={<ArrowRight className="h-4 w-4" />} iconOnly />
              <Btn size="icon" variant="ghost" icon={<MoreHorizontal className="h-4 w-4" />} iconOnly />
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Compound Buttons">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn variant="primary" icon={<Send className="h-4 w-4" />}>Send Report</Btn>
              <Btn variant="outline" icon={<Upload className="h-4 w-4" />}>Upload File</Btn>
              <Btn variant="ghost" icon={<Star className="h-4 w-4" />}>Favorite</Btn>
              <Btn variant="outline" size="lg" icon={<Plus className="h-4 w-4" />}>New Project</Btn>
              <Btn variant="primary" size="lg" icon={<Check className="h-4 w-4" />}>Confirm</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── INPUTS ── */}
      <section id="inputs">
        <SectionHeader title="Form Controls" description="Clean, accessible form inputs with consistent styling across all states." />

        <SubSection title="Text Inputs">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Default Input" placeholder="Enter text..." />
              <InputField label="With Icon" placeholder="Search anything..." leftIcon={<Search className="h-4 w-4" />} />
              <InputField
                label="Password"
                type={showPwd ? "text" : "password"}
                placeholder="Enter password..."
                rightElement={
                  <button onClick={() => setShowPwd(!showPwd)} className="text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <InputField label="With Hint" placeholder="Enter your email..." type="email" hint="We'll never share your email with anyone." />
              <InputField label="Error State" placeholder="Enter value..." error="This field is required." />
              <InputField label="Disabled" placeholder="Disabled input..." disabled />
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Textarea">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">Message</label>
                <textarea
                  placeholder="Write your message here..."
                  rows={4}
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none transition-all duration-150 resize-none focus:ring-2 focus:ring-ring focus:border-primary/60 hover:border-[var(--border-strong)]"
                  style={{ boxShadow: "var(--shadow-xs)" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">Notes</label>
                <textarea
                  placeholder="Add notes..."
                  rows={4}
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none transition-all duration-150 resize-none focus:ring-2 focus:ring-ring focus:border-primary/60 hover:border-[var(--border-strong)] opacity-50 cursor-not-allowed"
                  disabled
                  style={{ boxShadow: "var(--shadow-xs)" }}
                />
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Select">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {["Default Select", "With Label"].map((lbl, i) => (
                <div key={lbl} className="flex flex-col gap-1.5">
                  <label className="text-[0.875rem] font-medium text-foreground">{lbl}</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-card border border-border text-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none focus:ring-2 focus:ring-ring focus:border-primary/60 hover:border-[var(--border-strong)] pr-9 cursor-pointer transition-all duration-150" style={{ boxShadow: "var(--shadow-xs)" }}>
                      <option>Select an option...</option>
                      <option>Option Alpha</option>
                      <option>Option Beta</option>
                      <option>Option Gamma</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Checkbox">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { label: "Checked", state: checkA, setter: setCheckA },
                { label: "Unchecked", state: checkB, setter: setCheckB },
                { label: "Indeterminate", state: checkC, setter: setCheckC },
              ].map(({ label, state, setter }) => (
                <label key={label} className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <CheckboxPrimitive.Root
                    checked={state}
                    onCheckedChange={setter}
                    className={`h-5 w-5 rounded-[5px] border transition-all duration-150 flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-ring
                      ${state === true ? "bg-primary border-primary" : state === "indeterminate" ? "bg-primary border-primary" : "bg-card border-border hover:border-[var(--border-strong)]"}`}
                  >
                    <CheckboxPrimitive.Indicator className="text-primary-foreground">
                      {state === "indeterminate"
                        ? <div className="w-2 h-0.5 bg-primary-foreground rounded-full" />
                        : <Check className="h-3 w-3" strokeWidth={3} />
                      }
                    </CheckboxPrimitive.Indicator>
                  </CheckboxPrimitive.Root>
                  <span className="text-[0.9375rem] text-foreground group-hover:text-foreground transition-colors">{label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2.5 cursor-not-allowed select-none opacity-40">
                <div className="h-5 w-5 rounded-[5px] border border-border bg-card" />
                <span className="text-[0.9375rem] text-foreground">Disabled</span>
              </label>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Radio">
          <ShowcaseCard>
            <RadioGroupPrimitive.Root value={radio} onValueChange={setRadio}>
              <div className="flex flex-wrap gap-6">
                {["a", "b", "c"].map((val) => (
                  <RadioGroupPrimitive.Item key={val} value={val} asChild>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-150
                        ${radio === val ? "border-primary" : "border-border group-hover:border-[var(--border-strong)]"}`}
                      >
                        {radio === val && <div className="h-2 w-2 rounded-full bg-primary" />}
                      </div>
                      <span className="text-[0.9375rem] text-foreground">Option {val.toUpperCase()}</span>
                    </label>
                  </RadioGroupPrimitive.Item>
                ))}
                <label className="flex items-center gap-2.5 cursor-not-allowed select-none opacity-40">
                  <div className="h-5 w-5 rounded-full border-2 border-border" />
                  <span className="text-[0.9375rem] text-foreground">Disabled</span>
                </label>
              </div>
            </RadioGroupPrimitive.Root>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Switch / Toggle">
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { label: "Notifications", state: swA, setter: setSwA },
                { label: "Dark Mode", state: swB, setter: setSwB },
              ].map(({ label, state, setter }) => (
                <div key={label} className="flex items-center gap-3">
                  <SwitchPrimitive.Root
                    checked={state}
                    onCheckedChange={setter}
                    className={`relative h-6 w-11 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer
                      ${state ? "bg-primary" : "bg-switch-background"}`}
                  >
                    <SwitchPrimitive.Thumb
                      className="block h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[22px]"
                      style={{ height: "18px", width: "18px", marginTop: "3px", marginLeft: "3px" }}
                    />
                  </SwitchPrimitive.Root>
                  <span className="text-[0.9375rem] text-foreground">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 opacity-40 cursor-not-allowed">
                <div className="h-6 w-11 rounded-full bg-switch-background" />
                <span className="text-[0.9375rem] text-foreground">Disabled</span>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Search Bar">
          <ShowcaseCard>
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search anything..."
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[12px] pl-10 pr-4 py-3 text-[0.9375rem] outline-none transition-all duration-150 focus:ring-2 focus:ring-ring focus:border-primary/60"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-[4px] bg-muted text-muted-foreground text-[0.625rem] font-medium border border-border">⌘K</kbd>
                </div>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── Tokens ── */}
      <section id="buttons-tokens" className="space-y-5">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">Tokens</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">CSS custom properties used by buttons and form controls.</p>
        </div>
        <TokenTable groups={formTokenGroups} />
      </section>
    </div>
  );
}

const formTokenGroups: TokenGroup[] = [
  {
    group: "Button Colors",
    tokens: [
      { name: "--primary",               description: "Primary button background",     light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-foreground",    description: "Text on primary button",        light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--primary-hover",         description: "Hover state of primary",        light: "#D44D4D", dark: "#DC5E5E", isColor: true },
      { name: "--secondary",             description: "Secondary button background",   light: "#E4E9F0", dark: "rgba(40,48,67,0.80)", isColor: true },
      { name: "--secondary-foreground",  description: "Text on secondary button",      light: "#131A27", dark: "#E4E9F0", isColor: true },
      { name: "--muted",                 description: "Ghost button hover background", light: "#E8EDF3", dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--destructive",           description: "Danger / delete button",        light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--destructive-foreground",description: "Text on destructive button",    light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
    ],
  },
  {
    group: "Input & Form",
    tokens: [
      { name: "--input",            description: "Input border color",          light: "transparent",         dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--input-background", description: "Input field background",      light: "#FFFFFF",             dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--ring",             description: "Focus ring",                  light: "rgba(212,77,77,0.35)",dark: "rgba(212,77,77,0.40)", isColor: true },
      { name: "--border",           description: "Default border",              light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--border-strong",    description: "Hover / active border",       light: "rgba(19,26,39,0.16)", dark: "rgba(255,255,255,0.12)", isColor: true },
      { name: "--foreground",       description: "Input text",                  light: "#131A27",             dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground", description: "Placeholder text",            light: "#627288",             dark: "#8898B0", isColor: true },
    ],
  },
  {
    group: "Shape",
    tokens: [
      { name: "--radius-sm", description: "Small inputs / badges",     light: "calc(0.75rem - 4px)" },
      { name: "--radius-md", description: "Buttons, text inputs",      light: "0.75rem" },
      { name: "--radius-lg", description: "Large controls",            light: "calc(0.75rem + 4px)" },
    ],
  },
  {
    group: "Typography",
    tokens: [
      { name: "--font-sans",            description: "UI text / button labels", light: "Plus Jakarta Sans" },
      { name: "--font-weight-semibold", description: "Button label weight",     light: "600" },
      { name: "--font-weight-medium",   description: "Input label weight",      light: "500" },
    ],
  },
];
