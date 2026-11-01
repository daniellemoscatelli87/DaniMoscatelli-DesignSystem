import React, { useState } from "react";
import { ArrowRight, Check, CheckCircle2, ChevronDown, Keyboard, Lock, MousePointerClick, Smartphone, X } from "lucide-react";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  SidePanel, SidePanelTrigger, SidePanelContent, SidePanelHeader, SidePanelBody, SidePanelActions, SidePanelFooter,
} from "@/app/components/ui/side-panel";

/* ─────────────────────────────────────────────────────────────
   Painel lateral (gaveta)
   Padrão do formulário de contato do site do estúdio
   (index.html + src/em-breve.ts), documentado e reaproveitável.
   ───────────────────────────────────────────────────────────── */

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[16px] border border-border bg-card p-6 ${className}`} style={{ boxShadow: "var(--shadow-xs)" }}>
      {children}
    </div>
  );
}

const field =
  "w-full rounded-[12px] border border-border bg-muted/40 px-4 py-2.5 text-[0.8125rem] leading-relaxed text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:bg-card focus:ring-2 focus:ring-ring aria-[invalid=true]:border-error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/* ── Variante: formulário de contato do site ── */
function ContactPanelDemo() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bizOpen, setBizOpen] = useState(false);
  const [values, setValues] = useState({ nome: "", email: "", telefone: "", empresa: "", cargo: "", tipo: "", outro: "", assunto: "", mensagem: "", periodo: "" });
  const [dias, setDias] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues(v => ({ ...v, [k]: k === "telefone" ? maskPhone(e.target.value) : e.target.value }));

  const validate = () => {
    const bad: Record<string, boolean> = {};
    (["nome", "email", "telefone", "empresa", "cargo", "assunto", "mensagem", "periodo"] as const).forEach(k => { if (!values[k].trim()) bad[k] = true; });
    if (values.email && !EMAIL_RE.test(values.email)) bad.email = true;
    if (values.telefone && values.telefone.replace(/\D/g, "").length < 10) bad.telefone = true;
    if (!values.tipo) { bad.tipo = true; setBizOpen(true); }
    if (!dias.length) bad.dias = true;
    setInvalid(bad);
    return Object.keys(bad).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setError(t("Fill in the required fields (*) and check the e-mail and phone number.", "Preencha os campos obrigatórios (*) e confira o e-mail e o telefone."));
      return;
    }
    setError(null);
    setSending(true);
    // Demonstração: o site grava em `contatos` (Supabase). Aqui só simulamos o envio.
    setTimeout(() => { setSending(false); setSent(true); }, 900);
  };

  const reset = () => { setSent(false); setError(null); setInvalid({}); setDias([]); setValues({ nome: "", email: "", telefone: "", empresa: "", cargo: "", tipo: "", outro: "", assunto: "", mensagem: "", periodo: "" }); };

  const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex"];

  return (
    <SidePanel open={open} onOpenChange={o => { setOpen(o); if (!o) setTimeout(reset, 300); }}>
      <SidePanelTrigger asChild>
        <button className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[0.875rem] font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          {t("Contact", "Contato")}
        </button>
      </SidePanelTrigger>
      <SidePanelContent closeLabel={t("Close contact form", "Fechar formulário de contato")}>
        {!sent && (
          <SidePanelHeader
            eyebrow={t("Contact & Partnerships", "Contato & Parcerias")}
            title={t("Start a conversation", "Inicie uma conversa")}
            description={t(
              "Fill in the details below and I will get in touch soon to schedule a conversation and present a proposal for your challenge.",
              "Preencha os dados abaixo que em breve entrarei em contato para agendar uma conversa e apresentar uma proposta para o seu desafio.",
            )}
          />
        )}
        <SidePanelBody>
          {sent ? (
            <div className="flex flex-col items-center space-y-4 px-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary-muted)] text-primary"><Check className="h-8 w-8" strokeWidth={2.5} aria-hidden /></div>
              <div>
                <h3 className="text-[1.25rem] font-bold text-foreground">{t("Message sent successfully!", "Mensagem enviada com sucesso!")}</h3>
                <p className="mx-auto mt-2 max-w-xs text-[0.875rem] text-muted-foreground">{t("We will get in touch soon to schedule our conversation.", "Entraremos em contato em breve para agendarmos a nossa conversa.")}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="mt-4 rounded-full bg-muted px-6 py-2.5 text-[0.75rem] font-semibold text-foreground transition-colors hover:bg-accent">{t("Close", "Fechar")}</button>
            </div>
          ) : (
            <form id="ds-contact-form" noValidate onSubmit={submit} className="flex flex-col gap-2.5">
              <input className={field} aria-invalid={!!invalid.nome} placeholder={t("Full name *", "Nome completo *")} aria-label={t("Full name", "Nome completo")} autoComplete="name" value={values.nome} onChange={set("nome")} />
              <input className={field} aria-invalid={!!invalid.email} type="email" placeholder={t("Corporate e-mail *", "E-mail corporativo *")} aria-label={t("Corporate e-mail", "E-mail corporativo")} autoComplete="email" value={values.email} onChange={set("email")} />
              <input className={field} aria-invalid={!!invalid.telefone} type="tel" placeholder={t("Phone / WhatsApp *", "Telefone / WhatsApp *")} aria-label={t("Phone / WhatsApp", "Telefone / WhatsApp")} autoComplete="tel" value={values.telefone} onChange={set("telefone")} />
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <input className={field} aria-invalid={!!invalid.empresa} placeholder={t("Company name *", "Nome da Empresa *")} aria-label={t("Company name", "Nome da Empresa")} autoComplete="organization" value={values.empresa} onChange={set("empresa")} />
                <input className={field} aria-invalid={!!invalid.cargo} placeholder={t("Role *", "Cargo / Função *")} aria-label={t("Role", "Cargo / Função")} autoComplete="organization-title" value={values.cargo} onChange={set("cargo")} />
              </div>

              {/* Acordeão "Meu negócio é..." */}
              <div className={`overflow-hidden rounded-[12px] border bg-muted/40 ${invalid.tipo ? "border-error" : "border-border"}`}>
                <button type="button" aria-expanded={bizOpen} aria-controls="ds-biz-body" onClick={() => setBizOpen(o => !o)} className="flex w-full items-center justify-between p-3 text-left text-[0.8125rem] font-medium text-foreground transition-colors hover:bg-accent/60">
                  <span>{values.tipo ? (values.tipo === "Outro" && values.outro ? values.outro : values.tipo) : t("My business is... *", "Meu negócio é... *")}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${bizOpen ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {bizOpen && (
                  <div id="ds-biz-body" className="space-y-1.5 border-t border-border px-3 pb-3 pt-2">
                    {[
                      [t("A digital product/service", "Um produto/serviço digital"), t("(SaaS, E-commerce, Marketplace, App, System, Software)", "(SaaS, E-commerce, Marketplace, APP, Sistema, Software)")],
                      [t("A physical business", "Um Negócio Físico"), t("(Clinics, salons, pet shops, hotels, restaurants, stores)", "(Clínicas, Salões, Petshops, Hotéis, Restaurantes, Lojas)")],
                      [t("A physical and digital business", "Um Negócio Físico e Digital"), ""],
                    ].map(([label, hint]) => (
                      <label key={label} className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-border/60 bg-card/70 p-2 transition-colors hover:bg-card">
                        <input type="radio" name="ds-tipo" className="mt-0.5 h-4 w-4 accent-[var(--primary)]" checked={values.tipo === label} onChange={() => setValues(v => ({ ...v, tipo: label }))} />
                        <span className="flex-1"><span className="block text-[0.8125rem] font-medium leading-snug text-foreground">{label}</span>{hint && <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">{hint}</span>}</span>
                      </label>
                    ))}
                    <div className="flex items-center gap-2 rounded-[10px] border border-border/60 bg-card/70 p-2">
                      <label className="flex shrink-0 cursor-pointer items-center gap-2.5">
                        <input type="radio" name="ds-tipo" className="h-4 w-4 accent-[var(--primary)]" checked={values.tipo === "Outro"} onChange={() => setValues(v => ({ ...v, tipo: "Outro" }))} />
                        <span className="text-[0.8125rem] font-medium text-foreground">{t("Other:", "Outro:")}</span>
                      </label>
                      <input className="min-w-0 flex-1 rounded-[8px] border border-border bg-card px-2.5 py-1 text-[0.8125rem] text-foreground outline-none placeholder:text-muted-foreground focus:border-primary" placeholder={t("Which? Describe briefly...", "Qual? Descreva brevemente...")} aria-label={t("Other business type", "Outro tipo de negócio")} value={values.outro} onFocus={() => setValues(v => ({ ...v, tipo: "Outro" }))} onChange={set("outro")} />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <select className={`${field} appearance-none pr-10 ${values.assunto ? "" : "text-muted-foreground"}`} aria-invalid={!!invalid.assunto} aria-label={t("Subject", "Assunto")} value={values.assunto} onChange={set("assunto")}>
                  <option value="" disabled>{t("Subject *", "Assunto *")}</option>
                  {[t("Project diagnosis or quote", "Diagnóstico ou orçamento de projeto"), t("Talk, class or content", "Palestra, aula ou conteúdo"), t("Partnership or collaboration", "Parceria ou colaboração"), t("Press or publicity", "Imprensa ou divulgação"), t("Other", "Outro")].map(o => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              </div>

              <textarea className={`${field} h-[90px] resize-none`} aria-invalid={!!invalid.mensagem} rows={3} aria-label={t("Tell us about your challenge", "Conte um pouco sobre seu desafio")} placeholder={t("Tell us a bit about your challenge (which goals, pains or ideas would you like to work on with us?) *", "Conte um pouco sobre seu desafio (Quais objetivos, dores ou ideias você gostaria de trabalhar conosco?) *")} value={values.mensagem} onChange={set("mensagem")} />

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div className={`flex flex-col justify-center rounded-[12px] border bg-muted/40 px-3 py-2 ${invalid.dias ? "border-error" : "border-border"}`}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[0.75rem] font-semibold text-foreground">{t("Best weekday *", "Melhor dia da semana *")}</span>
                    <span className="text-[0.625rem] text-muted-foreground">{t("multiple", "múltiplos")}</span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    {DAYS.map(d => {
                      const on = dias.includes(d);
                      return (
                        <label key={d} className="flex-1 text-center">
                          <input type="checkbox" className="peer sr-only" checked={on} onChange={() => setDias(x => on ? x.filter(y => y !== d) : [...x, d])} />
                          <span className={`block rounded-[8px] py-1 text-[0.75rem] font-semibold transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${on ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>{d}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="relative flex h-full items-center">
                  <select className={`${field} h-full appearance-none pr-10 ${values.periodo ? "" : "text-muted-foreground"}`} aria-invalid={!!invalid.periodo} aria-label={t("Preferred period", "Período de preferência")} value={values.periodo} onChange={set("periodo")}>
                    <option value="" disabled>{t("Period (preference) *", "Período (preferência) *")}</option>
                    {[t("Morning", "Manhã"), t("Afternoon", "Tarde"), t("Flexible", "Flexível")].map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                </div>
              </div>
              {error && <p role="alert" className="text-[0.75rem] text-error">{error}</p>}
            </form>
          )}
        </SidePanelBody>
        {!sent && (
          <>
            <SidePanelActions>
              <button type="submit" form="ds-contact-form" disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-[0.875rem] font-semibold tracking-wide text-primary-foreground shadow-[var(--shadow-md)] transition-all hover:bg-[var(--primary-hover)] hover:shadow-[var(--shadow-lg)] disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {sending ? t("Sending…", "Enviando…") : t("Request a meeting", "Solicitar reunião")}
                {!sending && <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />}
              </button>
            </SidePanelActions>
            <SidePanelFooter>
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" aria-hidden /> {t("Secure environment.", "Ambiente seguro.")}</span>
              <span className="font-medium text-foreground">Dani Moscatelli Studio</span>
            </SidePanelFooter>
          </>
        )}
      </SidePanelContent>
    </SidePanel>
  );
}

/* ── Demonstração simples ── */
function SimplePanelDemo() {
  const { t } = useI18n();
  return (
    <SidePanel>
      <SidePanelTrigger asChild>
        <button className="inline-flex h-10 items-center gap-2 rounded-[12px] border border-border bg-card px-4 text-[0.9375rem] font-semibold text-foreground transition-colors hover:bg-accent">
          {t("Open side panel", "Abrir painel lateral")}
        </button>
      </SidePanelTrigger>
      <SidePanelContent closeLabel={t("Close panel", "Fechar painel")}>
        <SidePanelHeader eyebrow={t("Details", "Detalhes")} title={t("Side panel", "Painel lateral")} description={t("Header, scrollable body and a fixed action bar.", "Cabeçalho, corpo rolável e barra de ação fixa.")} />
        <SidePanelBody>
          <div className="space-y-3 text-[0.875rem] leading-relaxed text-muted-foreground">
            {Array.from({ length: 6 }).map((_, i) => (
              <p key={i}>{t("The body scrolls on its own while the header and the action bar stay in place. Press Esc, click outside or use the close button to dismiss.", "O corpo rola sozinho enquanto o cabeçalho e a barra de ação ficam no lugar. Pressione Esc, clique fora ou use o botão fechar para sair.")}</p>
            ))}
          </div>
        </SidePanelBody>
        <SidePanelActions>
          <button className="h-10 w-full rounded-full bg-primary text-[0.875rem] font-semibold text-primary-foreground transition-colors hover:bg-[var(--primary-hover)]">{t("Primary action", "Ação principal")}</button>
        </SidePanelActions>
      </SidePanelContent>
    </SidePanel>
  );
}

export function SidePanelShowcase() {
  const { t } = useI18n();

  const tokenGroups: TokenGroup[] = [
    {
      group: t("Side panel — surface", "Painel lateral — superfície"),
      tokens: [
        { name: "--card", description: t("Panel background", "Fundo do painel"), light: "#FFFFFF", dark: "rgba(19,26,39,.75)", isColor: true },
        { name: "--border", description: t("Zone dividers", "Divisórias entre as zonas"), light: "rgba(19,26,39,.09)", dark: "rgba(255,255,255,.07)", isColor: true },
        { name: "--shadow-xl", description: t("Panel elevation", "Elevação do painel"), light: "0 16px 48px …" },
        { name: "overlay", description: t("Backdrop: foreground at 40% + blur-sm", "Fundo escurecido: foreground a 40% + blur-sm"), light: "bg-foreground/40" },
        { name: "radius", description: t("Left corners from the tablet up", "Cantos esquerdos a partir do tablet"), light: "24px (rounded-l-3xl)" },
      ],
    },
    {
      group: t("Side panel — sizes and motion", "Painel lateral — tamanhos e movimento"),
      tokens: [
        { name: "width · mobile", description: t("Full viewport width", "Largura total da tela"), light: "100%" },
        { name: "width · sm (≥ 640 px)", description: t("Tablet", "Tablet"), light: "500px" },
        { name: "width · md (≥ 768 px)", description: t("Desktop", "Desktop"), light: "540px" },
        { name: "duration", description: t("Slide in/out and backdrop fade", "Entrada/saída e fade do fundo"), light: "300ms ease-in-out" },
        { name: "--primary / --ring", description: t("Action button and focus ring", "Botão de ação e anel de foco"), light: "#D44D4D", dark: "#D44D4D", isColor: true },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="sidepanel-anatomy">
        <SectionHeader
          title={t("Side panel (drawer)", "Painel lateral (gaveta)")}
          description={t(
            "A panel that slides in from the right over the page, used on the studio site for the contact form. It keeps the person on the page, holds a long task (a form, details, filters) and closes without losing context.",
            "Painel que desliza da direita por cima da página, usado no site do estúdio para o formulário de contato. Mantém a pessoa na página, comporta uma tarefa longa (formulário, detalhes, filtros) e fecha sem perder o contexto.",
          )}
        />
        <ShowcaseCard>
          <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Anatomy", "Anatomia")}</p>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-[20px] border border-border bg-card" style={{ boxShadow: "var(--shadow-lg)" }}>
              {[
                ["1", t("Header", "Cabeçalho"), t("Eyebrow label, title, description and close button. Fixed.", "Rótulo pequeno, título, texto de apoio e botão fechar. Fixo."), "bg-card"],
                ["2", t("Body", "Corpo"), t("Scrolls on its own. Holds the form or the content.", "Rola sozinho. Guarda o formulário ou o conteúdo."), "bg-muted/30 min-h-[120px]"],
                ["3", t("Action bar", "Barra de ação"), t("One primary button, full width. Fixed.", "Um botão principal, largura total. Fixo."), "bg-card"],
                ["4", t("Footer", "Rodapé"), t("Optional note: security, signature.", "Nota opcional: segurança, assinatura."), "bg-muted/60"],
              ].map(([n, title, desc, bg], i) => (
                <div key={n} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? "border-t border-border" : ""} ${bg}`}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[0.6875rem] font-bold text-primary-foreground">{n}</span>
                  <div><p className="text-[0.8125rem] font-semibold text-foreground">{title}</p><p className="text-[0.75rem] text-muted-foreground">{desc}</p></div>
                </div>
              ))}
            </div>
            <ul className="space-y-3 text-[0.875rem] leading-relaxed text-muted-foreground">
              <li><span className="font-semibold text-foreground">{t("Width", "Largura")}:</span> {t("full screen on mobile, 500 px on tablet, 540 px on desktop; left corners rounded (24 px) from the tablet up.", "tela inteira no celular, 500 px no tablet, 540 px no desktop; cantos esquerdos arredondados (24 px) a partir do tablet.")}</li>
              <li><span className="font-semibold text-foreground">{t("Backdrop", "Fundo")}:</span> {t("page dimmed with a light blur; clicking it closes the panel.", "página escurecida com leve desfoque; clicar nele fecha o painel.")}</li>
              <li><span className="font-semibold text-foreground">{t("Motion", "Movimento")}:</span> {t("slides in from the right in 300 ms while the backdrop fades in; the reverse on close.", "entra da direita em 300 ms enquanto o fundo aparece; o inverso ao fechar.")}</li>
              <li><span className="font-semibold text-foreground">{t("When to use", "Quando usar")}:</span> {t("tasks longer than a dialog (forms with several fields, details of an item, filters) that should not leave the page.", "tarefas maiores que um diálogo (formulários com vários campos, detalhes de um item, filtros) que não devem tirar a pessoa da página.")}</li>
              <li><span className="font-semibold text-foreground">{t("When not to use", "Quando não usar")}:</span> {t("short confirmations (use a dialog) or primary navigation (use the sidebar).", "confirmações curtas (use um diálogo) ou navegação principal (use a sidebar).")}</li>
            </ul>
          </div>
        </ShowcaseCard>
      </section>

      <section id="sidepanel-behavior">
        <SectionHeader title={t("Behavior", "Comportamento")} description={t("Everything the site does when the panel opens and closes, now guaranteed by the component.", "Tudo o que o site faz ao abrir e fechar o painel, agora garantido pelo componente.")} />
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ShowcaseCard>
            <p className="mb-4 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Try it", "Experimente")}</p>
            <SimplePanelDemo />
            <p className="mt-4 text-[0.75rem] text-muted-foreground">{t("Open, scroll the body, press Esc, click outside, use Tab: the focus stays inside and returns to this button when it closes.", "Abra, role o corpo, pressione Esc, clique fora, use Tab: o foco fica dentro e volta para este botão ao fechar.")}</p>
          </ShowcaseCard>
          <ShowcaseCard>
            <ul className="space-y-3">
              {[
                [MousePointerClick, t("Opens from any button marked as trigger; the first field (or the body) receives focus.", "Abre por qualquer botão marcado como gatilho; o primeiro campo (ou o corpo) recebe o foco.")],
                [Keyboard, t("Closes with Esc, with the close button, by clicking the backdrop and, in forms, with the success state's Close button.", "Fecha com Esc, com o botão fechar, clicando no fundo e, em formulários, com o botão Fechar do estado de sucesso.")],
                [Lock, t("While open: focus trapped inside, page scroll locked, aria-modal dialog with title and description.", "Enquanto aberto: foco preso dentro, rolagem da página travada, diálogo aria-modal com título e descrição.")],
                [CheckCircle2, t("On close: focus returns to the element that opened it; a form keeps its draft unless the task was completed.", "Ao fechar: o foco volta ao elemento que abriu; um formulário mantém o rascunho, a menos que a tarefa tenha sido concluída.")],
                [Smartphone, t("Mobile: full width and height; the action bar stays above the keyboard; inputs use 16 px to avoid zoom.", "Celular: largura e altura totais; a barra de ação fica acima do teclado; campos com 16 px para evitar zoom.")],
              ].map(([Icon, text], i) => {
                const I = Icon as React.ElementType;
                return (
                  <li key={i} className="flex items-start gap-3 text-[0.875rem] leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-muted)] text-primary"><I className="h-3.5 w-3.5" aria-hidden /></span>
                    <span>{text as string}</span>
                  </li>
                );
              })}
            </ul>
          </ShowcaseCard>
        </div>
      </section>

      <section id="sidepanel-contact">
        <SectionHeader
          title={t("Variant: contact form", "Variante: formulário de contato")}
          description={t(
            "The studio site's contact drawer, rebuilt with the system's components: the same fields, texts, validation and success state.",
            "A gaveta de contato do site do estúdio, refeita com os componentes do sistema: mesmos campos, textos, validação e estado de sucesso.",
          )}
        />
        <ShowcaseCard>
          <div className="flex flex-wrap items-center gap-4">
            <ContactPanelDemo />
            <p className="text-[0.8125rem] text-muted-foreground">{t("Demo: nothing is sent. On the site, the form writes to the “contatos” table.", "Demonstração: nada é enviado. No site, o formulário grava na tabela “contatos”.")}</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              [t("Fields", "Campos"), t("Full name, corporate e-mail, phone/WhatsApp with mask, company, role, “My business is…” accordion (digital, physical, both, other), subject, message, best weekday (multiple) and period.", "Nome completo, e-mail corporativo, telefone/WhatsApp com máscara, empresa, cargo, acordeão “Meu negócio é…” (digital, físico, ambos, outro), assunto, mensagem, melhor dia da semana (múltiplos) e período.")],
              [t("Validation", "Validação"), t("All required; e-mail format; phone with at least 10 digits. One message under the form, invalid fields highlighted, the first one brought into view. Re-validates on input after the first attempt.", "Todos obrigatórios; formato do e-mail; telefone com pelo menos 10 dígitos. Uma mensagem abaixo do formulário, campos inválidos destacados e o primeiro deles trazido à vista. Revalida ao digitar depois da primeira tentativa.")],
              [t("States", "Estados"), t("Idle → “Sending…” (button disabled) → success replaces header, form and action bar inside the panel, with a Close button. On failure: “Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.”", "Parado → “Enviando…” (botão desabilitado) → sucesso substitui cabeçalho, formulário e barra de ação dentro do painel, com botão Fechar. Em falha: “Não foi possível enviar sua mensagem. Verifique sua conexão e tente novamente.”")],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[12px] border border-border bg-muted/30 p-4">
                <p className="mb-1 text-[0.8125rem] font-semibold text-foreground">{title}</p>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </ShowcaseCard>
      </section>

      <section id="sidepanel-a11y">
        <SectionHeader title={t("Accessibility checklist", "Checklist de acessibilidade")} />
        <ShowcaseCard>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              t("role=\"dialog\" with aria-modal, aria-labelledby (title) and aria-describedby (description).", "role=\"dialog\" com aria-modal, aria-labelledby (título) e aria-describedby (descrição)."),
              t("Close button with an explicit accessible name (“Fechar formulário de contato”).", "Botão fechar com nome acessível explícito (“Fechar formulário de contato”)."),
              t("Focus trapped while open and returned to the trigger on close.", "Foco preso enquanto aberto e devolvido ao gatilho ao fechar."),
              t("Esc closes; Tab and Shift+Tab cycle inside.", "Esc fecha; Tab e Shift+Tab circulam por dentro."),
              t("Every field has a visible or aria label; placeholders are not the only label.", "Todo campo tem rótulo visível ou aria; o placeholder não é o único rótulo."),
              t("Errors are announced (role=\"alert\") and shown next to the form, not only by color.", "Erros são anunciados (role=\"alert\") e mostrados junto ao formulário, não só por cor."),
              t("Touch targets of at least 44 px on the action bar and the weekday chips.", "Alvos de toque de pelo menos 44 px na barra de ação e nos chips de dia."),
              t("Respects prefers-reduced-motion through the system's animation utilities.", "Respeita prefers-reduced-motion pelas utilidades de animação do sistema."),
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />{item}</li>
            ))}
          </ul>
        </ShowcaseCard>
      </section>

      <section id="sidepanel-usage">
        <SectionHeader title={t("Usage", "Uso")} description={t("Composition of the component in code.", "Composição do componente em código.")} />
        <ShowcaseCard className="overflow-x-auto">
          <pre className="text-[0.75rem] leading-relaxed text-muted-foreground"><code>{`import { SidePanel, SidePanelTrigger, SidePanelContent, SidePanelHeader, SidePanelBody, SidePanelActions, SidePanelFooter } from "@/app/components/ui/side-panel";

<SidePanel>
  <SidePanelTrigger asChild><button>Contato</button></SidePanelTrigger>
  <SidePanelContent closeLabel="Fechar formulário de contato">
    <SidePanelHeader eyebrow="Contato & Parcerias" title="Inicie uma conversa" description="…" />
    <SidePanelBody>{/* formulário */}</SidePanelBody>
    <SidePanelActions><button type="submit" form="contato">Solicitar reunião</button></SidePanelActions>
    <SidePanelFooter><span>🔒 Ambiente seguro.</span><span>Dani Moscatelli Studio</span></SidePanelFooter>
  </SidePanelContent>
</SidePanel>`}</code></pre>
        </ShowcaseCard>
      </section>

      <section id="sidepanel-tokens">
        <SectionHeader title={t("Tokens", "Tokens")} />
        <TokenTable groups={tokenGroups} />
      </section>
    </div>
  );
}
