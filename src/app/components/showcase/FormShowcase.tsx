import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { useI18n } from "../../i18n";
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
  const { t } = useI18n();
  const formTokenGroups = getFormTokenGroups(t);
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
        <SectionHeader title={t("Buttons", "Botões")} description={t("Consistent button hierarchy. Crimson for primary CTAs, outline for secondary, ghost for tertiary.", "Hierarquia de botões consistente. Crimson para CTAs primários, outline para secundários, ghost para terciários.")} />

        <SubSection title={t("Variants", "Variantes")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn variant="primary" icon={<Zap className="h-4 w-4" />}>{t("Primary CTA", "CTA primário")}</Btn>
              <Btn variant="outline">{t("Outline", "Contorno")}</Btn>
              <Btn variant="secondary">{t("Secondary", "Secundário")}</Btn>
              <Btn variant="ghost">Ghost</Btn>
              <Btn variant="crimson-outline">{t("Crimson Outline", "Contorno Crimson")}</Btn>
              <Btn variant="primary" disabled>{t("Disabled", "Desabilitado")}</Btn>
              <Btn variant="primary" loading onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>{t("Loading", "Carregando")}</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Sizes", "Tamanhos")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn size="sm">{t("Small", "Pequeno")}</Btn>
              <Btn size="md">{t("Medium", "Médio")}</Btn>
              <Btn size="lg">{t("Large", "Grande")}</Btn>
              <Btn size="xl">{t("Extra Large", "Extra grande")}</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Icon Buttons", "Botões de ícone")}>
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

        <SubSection title={t("Compound Buttons", "Botões compostos")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3 items-center">
              <Btn variant="primary" icon={<Send className="h-4 w-4" />}>{t("Send Report", "Enviar relatório")}</Btn>
              <Btn variant="outline" icon={<Upload className="h-4 w-4" />}>{t("Upload File", "Enviar arquivo")}</Btn>
              <Btn variant="ghost" icon={<Star className="h-4 w-4" />}>{t("Favorite", "Favoritar")}</Btn>
              <Btn variant="outline" size="lg" icon={<Plus className="h-4 w-4" />}>{t("New Project", "Novo projeto")}</Btn>
              <Btn variant="primary" size="lg" icon={<Check className="h-4 w-4" />}>{t("Confirm", "Confirmar")}</Btn>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── INPUTS ── */}
      <section id="inputs">
        <SectionHeader title={t("Form Controls", "Controles de formulário")} description={t("Clean, accessible form inputs with consistent styling across all states.", "Campos de formulário limpos e acessíveis, com estilo consistente em todos os estados.")} />

        <SubSection title={t("Text Inputs", "Campos de texto")}>
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label={t("Default Input", "Campo padrão")} placeholder={t("Enter text...", "Digite um texto...")} />
              <InputField label={t("With Icon", "Com ícone")} placeholder={t("Search anything...", "Busque qualquer coisa...")} leftIcon={<Search className="h-4 w-4" />} />
              <InputField
                label={t("Password", "Senha")}
                type={showPwd ? "text" : "password"}
                placeholder={t("Enter password...", "Digite a senha...")}
                rightElement={
                  <button onClick={() => setShowPwd(!showPwd)} className="text-muted-foreground hover:text-foreground">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <InputField label={t("With Hint", "Com dica")} placeholder={t("Enter your email...", "Digite seu e-mail...")} type="email" hint={t("We'll never share your email with anyone.", "Nunca compartilharemos seu e-mail com ninguém.")} />
              <InputField label={t("Error State", "Estado de erro")} placeholder={t("Enter value...", "Digite um valor...")} error={t("This field is required.", "Este campo é obrigatório.")} />
              <InputField label={t("Disabled", "Desabilitado")} placeholder={t("Disabled input...", "Campo desabilitado...")} disabled />
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Textarea">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">{t("Message", "Mensagem")}</label>
                <textarea
                  placeholder={t("Write your message here...", "Escreva sua mensagem aqui...")}
                  rows={4}
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none transition-all duration-150 resize-none focus:ring-2 focus:ring-ring focus:border-primary/60 hover:border-[var(--border-strong)]"
                  style={{ boxShadow: "var(--shadow-xs)" }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">{t("Notes", "Notas")}</label>
                <textarea
                  placeholder={t("Add notes...", "Adicione notas...")}
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
              {[t("Default Select", "Select padrão"), t("With Label", "Com rótulo")].map((lbl, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-[0.875rem] font-medium text-foreground">{lbl}</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-card border border-border text-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none focus:ring-2 focus:ring-ring focus:border-primary/60 hover:border-[var(--border-strong)] pr-9 cursor-pointer transition-all duration-150" style={{ boxShadow: "var(--shadow-xs)" }}>
                      <option>{t("Select an option...", "Selecione uma opção...")}</option>
                      <option>{t("Option Alpha", "Opção Alfa")}</option>
                      <option>{t("Option Beta", "Opção Beta")}</option>
                      <option>{t("Option Gamma", "Opção Gama")}</option>
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
                { id: "checked", label: t("Checked", "Marcado"), state: checkA, setter: setCheckA },
                { id: "unchecked", label: t("Unchecked", "Desmarcado"), state: checkB, setter: setCheckB },
                { id: "indeterminate", label: t("Indeterminate", "Indeterminado"), state: checkC, setter: setCheckC },
              ].map(({ id, label, state, setter }) => (
                <label key={id} className="flex items-center gap-2.5 cursor-pointer select-none group">
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
                <span className="text-[0.9375rem] text-foreground">{t("Disabled", "Desabilitado")}</span>
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
                      <span className="text-[0.9375rem] text-foreground">{t("Option", "Opção")} {val.toUpperCase()}</span>
                    </label>
                  </RadioGroupPrimitive.Item>
                ))}
                <label className="flex items-center gap-2.5 cursor-not-allowed select-none opacity-40">
                  <div className="h-5 w-5 rounded-full border-2 border-border" />
                  <span className="text-[0.9375rem] text-foreground">{t("Disabled", "Desabilitado")}</span>
                </label>
              </div>
            </RadioGroupPrimitive.Root>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Switch / Toggle", "Switch / Toggle")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { id: "notifications", label: t("Notifications", "Notificações"), state: swA, setter: setSwA },
                { id: "dark", label: t("Dark Mode", "Dark Mode"), state: swB, setter: setSwB },
              ].map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center gap-3">
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
                <span className="text-[0.9375rem] text-foreground">{t("Disabled", "Desabilitado")}</span>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Search Bar", "Barra de busca")}>
          <ShowcaseCard>
            <div className="max-w-md">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder={t("Search anything...", "Busque qualquer coisa...")}
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
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties used by buttons and form controls.", "CSS custom properties usadas por botões e controles de formulário.")}</p>
        </div>
        <TokenTable groups={formTokenGroups} />
      </section>
    </div>
  );
}

function getFormTokenGroups(t: (en: string, pt: string) => string): TokenGroup[] {
  return [
  {
    group: t("Button Colors", "Cores de botão"),
    tokens: [
      { name: "--primary",               description: t("Primary button background", "Fundo do botão primário"),     light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--primary-foreground",    description: t("Text on primary button", "Texto no botão primário"),        light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
      { name: "--primary-hover",         description: t("Hover state of primary", "Estado hover do primário"),        light: "#D44D4D", dark: "#DC5E5E", isColor: true },
      { name: "--secondary",             description: t("Secondary button background", "Fundo do botão secundário"),   light: "#E4E9F0", dark: "rgba(40,48,67,0.80)", isColor: true },
      { name: "--secondary-foreground",  description: t("Text on secondary button", "Texto no botão secundário"),      light: "#131A27", dark: "#E4E9F0", isColor: true },
      { name: "--muted",                 description: t("Ghost button hover background", "Fundo de hover do botão ghost"), light: "#E8EDF3", dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--destructive",           description: t("Danger / delete button", "Botão de perigo / excluir"),        light: "#D44D4D", dark: "#D44D4D", isColor: true },
      { name: "--destructive-foreground",description: t("Text on destructive button", "Texto no botão destrutivo"),    light: "#FFFFFF", dark: "#FFFFFF", isColor: true },
    ],
  },
  {
    group: t("Input & Form", "Input e formulário"),
    tokens: [
      { name: "--input",            description: t("Input border color", "Cor da borda do input"),          light: "transparent",         dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--input-background", description: t("Input field background", "Fundo do campo de input"),      light: "#FFFFFF",             dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--ring",             description: t("Focus ring", "Anel de foco"),                  light: "rgba(212,77,77,0.35)",dark: "rgba(212,77,77,0.40)", isColor: true },
      { name: "--border",           description: t("Default border", "Borda padrão"),              light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--border-strong",    description: t("Hover / active border", "Borda de hover / ativo"),       light: "rgba(19,26,39,0.16)", dark: "rgba(255,255,255,0.12)", isColor: true },
      { name: "--foreground",       description: t("Input text", "Texto do input"),                  light: "#131A27",             dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground", description: t("Placeholder text", "Texto de placeholder"),            light: "#627288",             dark: "#8898B0", isColor: true },
    ],
  },
  {
    group: t("Shape", "Forma"),
    tokens: [
      { name: "--radius-sm", description: t("Small inputs / badges", "Inputs pequenos / badges"),     light: "calc(0.75rem - 4px)" },
      { name: "--radius-md", description: t("Buttons, text inputs", "Botões, campos de texto"),      light: "0.75rem" },
      { name: "--radius-lg", description: t("Large controls", "Controles grandes"),            light: "calc(0.75rem + 4px)" },
    ],
  },
  {
    group: t("Typography", "Tipografia"),
    tokens: [
      { name: "--font-sans",            description: t("UI text / button labels", "Texto de UI / rótulos de botão"), light: "Plus Jakarta Sans" },
      { name: "--font-weight-semibold", description: t("Button label weight", "Peso do rótulo do botão"),     light: "600" },
      { name: "--font-weight-medium",   description: t("Input label weight", "Peso do rótulo do input"),      light: "500" },
    ],
  },
];
}
