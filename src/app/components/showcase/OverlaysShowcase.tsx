import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import {
  X, ChevronRight, Trash2, Check,
  Bell, Settings, HelpCircle, Info,
  ChevronDown, Plus, Minus,
  ShieldCheck, CreditCard, Zap, MessageSquare, Globe,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { useI18n } from "../../i18n";

type Bi = { en: string; pt: string };
type TFn = (en: string, pt: string) => string;

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-[16px] border border-border p-6 ${className}`} style={{ boxShadow: "var(--shadow)" }}>
      {children}
    </div>
  );
}

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

/* ── Breadcrumb ── */
const bc = (en: string, pt: string): Bi => ({ en, pt });
const breadcrumbPaths: Bi[][] = [
  [bc("Dashboard", "Painel"), bc("Projects", "Projetos"), bc("Graphite UI", "Graphite UI")],
  [bc("Settings", "Configurações"), bc("Billing", "Cobrança"), bc("Subscription", "Assinatura")],
  [bc("Analytics", "Análises"), bc("Reports", "Relatórios")],
];

function Breadcrumb({ path }: { path: Bi[] }) {
  const { bi } = useI18n();
  return (
    <nav className="flex items-center gap-1.5 text-[0.875rem]">
      {path.map((item, i) => (
        <React.Fragment key={item.en}>
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />}
          <span className={i === path.length - 1 ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground cursor-pointer transition-colors"}>
            {bi(item)}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ── Pagination ── */
function Pagination({ total = 12, current = 4, onChange }: { total?: number; current?: number; onChange?: (p: number) => void }) {
  const { t } = useI18n();
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const visible: (number | "...")[] = [];

  if (total <= 7) {
    visible.push(...pages);
  } else {
    visible.push(1);
    if (current > 3) visible.push("...");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) visible.push(p);
    if (current < total - 2) visible.push("...");
    visible.push(total);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        className="h-9 w-9 rounded-[9px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
        disabled={current === 1}
        aria-label={t("Previous page", "Página anterior")}
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
      </button>
      {visible.map((p, i) => (
        <button
          key={`${p}-${i}`}
          onClick={() => typeof p === "number" && onChange?.(p)}
          className={`h-9 min-w-9 px-2 rounded-[9px] text-[0.875rem] font-medium transition-all duration-150
            ${p === current ? "bg-primary text-primary-foreground" : ""}
            ${p === "..." ? "text-muted-foreground pointer-events-none" : ""}
            ${typeof p === "number" && p !== current ? "text-muted-foreground hover:bg-accent hover:text-foreground" : ""}
          `}
        >
          {p}
        </button>
      ))}
      <button
        className="h-9 w-9 rounded-[9px] flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none"
        disabled={current === total}
        aria-label={t("Next page", "Próxima página")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Tooltip wrapper ── */
function TooltipDemo({ content, children }: { content: Bi; children: React.ReactNode }) {
  const { bi } = useI18n();
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={6}
            className="z-50 px-3 py-1.5 text-[0.8125rem] font-medium bg-popover text-popover-foreground border border-border rounded-[8px] animate-in fade-in-0 zoom-in-95"
            style={{ boxShadow: "var(--shadow-md)" }}
          >
            {bi(content)}
            <TooltipPrimitive.Arrow className="fill-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* ── Drawer ── */
function DrawerDemo({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
          <div
            className="relative z-10 w-80 h-full bg-card border-l border-border flex flex-col"
            style={{ boxShadow: "var(--shadow-xl)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-[1rem] font-semibold text-foreground">{t("Drawer Panel", "Painel lateral")}</h3>
              <button aria-label={t("Close", "Fechar")} onClick={onClose} className="h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 px-6 py-5 space-y-4">
              <p className="text-[0.9rem] text-muted-foreground">{t("This is a slide-in drawer panel. It overlays the content and provides contextual actions or additional details.", "Este é um painel lateral deslizante. Ele se sobrepõe ao conteúdo e oferece ações contextuais ou detalhes adicionais.")}</p>
              <div className="space-y-3">
                {[["Profile Settings", "Configurações do perfil"], ["Notifications", "Notificações"], ["API Keys", "Chaves de API"], ["Integrations", "Integrações"]].map(([en, pt]) => (
                  <button key={en} className="w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[0.9rem] font-medium text-foreground hover:bg-accent transition-colors">
                    {t(en, pt)}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6 py-5 border-t border-border">
              <button onClick={onClose} className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground text-[0.9375rem] font-semibold hover:bg-[var(--primary-hover)] transition-colors">
                {t("Done", "Concluído")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Accordion slide animations */
const accordionStyles = `
  @keyframes accordion-down {
    from { height: 0; opacity: 0; }
    to   { height: var(--radix-accordion-content-height); opacity: 1; }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); opacity: 1; }
    to   { height: 0; opacity: 0; }
  }
  .animate-accordion-down { animation: accordion-down 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
  .animate-accordion-up   { animation: accordion-up   0.18s ease-in; }
`;

export function OverlaysShowcase() {
  const { t, bi } = useI18n();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(4);

  return (
    <div className="space-y-16">
      <style>{accordionStyles}</style>

      {/* ── BREADCRUMB ── */}
      <section id="breadcrumb">
        <SectionHeader title={t("Breadcrumb", "Breadcrumb")} description={t("Hierarchical navigation showing the current page location.", "Navegação hierárquica que mostra a localização da página atual.")} />
        <SubSection title={t("Breadcrumb Variants", "Variantes de breadcrumb")}>
          <ShowcaseCard>
            <div className="space-y-4">
              {breadcrumbPaths.map((path, i) => (
                <Breadcrumb key={i} path={path} />
              ))}
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── PAGINATION ── */}
      <section id="pagination">
        <SectionHeader title={t("Pagination", "Paginação")} description={t("Navigate between pages with ellipsis for large page counts.", "Navegue entre páginas, com reticências para grandes quantidades de páginas.")} />
        <SubSection title={t("Pagination Controls", "Controles de paginação")}>
          <ShowcaseCard>
            <div className="space-y-6">
              <Pagination total={12} current={paginationPage} onChange={setPaginationPage} />
              <Pagination total={5} current={2} />
              <Pagination total={3} current={1} />
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── TOOLTIPS ── */}
      <section id="tooltips">
        <SectionHeader title={t("Tooltips", "Tooltips")} description={t("Contextual information on hover for icons and interactive elements.", "Informações contextuais ao passar o mouse sobre ícones e elementos interativos.")} />
        <SubSection title={t("Tooltip Variants", "Variantes de tooltip")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-4">
              <TooltipDemo content={{ en: "View notifications", pt: "Ver notificações" }}><button className="h-10 w-10 rounded-[12px] border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"><Bell className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} /></button></TooltipDemo>
              <TooltipDemo content={{ en: "Open settings", pt: "Abrir configurações" }}><button className="h-10 w-10 rounded-[12px] border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"><Settings className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} /></button></TooltipDemo>
              <TooltipDemo content={{ en: "Get help and documentation", pt: "Obter ajuda e documentação" }}><button className="h-10 w-10 rounded-[12px] border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"><HelpCircle className="h-4.5 w-4.5" style={{ height: "18px", width: "18px" }} /></button></TooltipDemo>
              <TooltipDemo content={{ en: "Important information about this field", pt: "Informação importante sobre este campo" }}><button className="inline-flex items-center gap-1.5 text-[0.875rem] text-muted-foreground underline underline-offset-2 decoration-dashed hover:text-foreground transition-colors"><Info className="h-4 w-4" />{t("Learn more", "Saiba mais")}</button></TooltipDemo>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── DROPDOWN ── */}
      <section id="dropdown">
        <SectionHeader title={t("Dropdown Menus", "Menus dropdown")} description={t("Context menus and action dropdowns with keyboard navigation.", "Menus de contexto e dropdowns de ações com navegação por teclado.")} />
        <SubSection title={t("Action Dropdown", "Dropdown de ações")}>
          <ShowcaseCard>
            <DropdownMenuPrimitive.Root>
              <DropdownMenuPrimitive.Trigger asChild>
                <button className="inline-flex items-center gap-2 h-10 px-4 text-[0.9375rem] font-semibold rounded-[12px] border border-border bg-card hover:bg-accent text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {t("Actions", "Ações")}
                  <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6"/></svg>
                </button>
              </DropdownMenuPrimitive.Trigger>
              <DropdownMenuPrimitive.Portal>
                <DropdownMenuPrimitive.Content
                  sideOffset={6}
                  align="start"
                  className="z-50 min-w-[180px] bg-card border border-border rounded-[12px] p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95"
                  style={{ boxShadow: "var(--shadow-lg)" }}
                >
                  {[
                    { icon: Settings, label: { en: "Edit", pt: "Editar" }, shortcut: "⌘E" },
                    { icon: Check,    label: { en: "Approve", pt: "Aprovar" },  shortcut: null },
                    { icon: Bell,     label: { en: "Notify", pt: "Notificar" },   shortcut: null },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuPrimitive.Item
                        key={item.label.en}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-[0.875rem] font-medium text-foreground rounded-[8px] hover:bg-accent cursor-pointer outline-none"
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          {bi(item.label)}
                        </span>
                        {item.shortcut && <span className="text-[0.75rem] text-muted-foreground font-normal">{item.shortcut}</span>}
                      </DropdownMenuPrimitive.Item>
                    );
                  })}
                  <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />
                  <DropdownMenuPrimitive.Item className="flex items-center gap-2 px-3 py-2 text-[0.875rem] font-medium text-primary rounded-[8px] hover:bg-primary/10 cursor-pointer outline-none">
                    <Trash2 className="h-4 w-4" />
                    {t("Delete", "Excluir")}
                  </DropdownMenuPrimitive.Item>
                </DropdownMenuPrimitive.Content>
              </DropdownMenuPrimitive.Portal>
            </DropdownMenuPrimitive.Root>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── DIALOGS ── */}
      <section id="dialogs">
        <SectionHeader title={t("Dialogs & Modals", "Diálogos e modais")} description={t("Focused overlay panels for forms, confirmations, and contextual actions.", "Painéis sobrepostos e focados para formulários, confirmações e ações contextuais.")} />
        <SubSection title={t("Dialog Variants", "Variantes de diálogo")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDialogOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 text-[0.9375rem] font-semibold rounded-[12px] bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors"
              >
                {t("Open Dialog", "Abrir diálogo")}
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 text-[0.9375rem] font-semibold rounded-[12px] border border-border bg-card hover:bg-accent text-foreground transition-colors"
              >
                {t("Confirm Dialog", "Diálogo de confirmação")}
              </button>
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-2 h-10 px-4 text-[0.9375rem] font-semibold rounded-[12px] border border-border bg-card hover:bg-accent text-foreground transition-colors"
              >
                {t("Open Drawer", "Abrir painel lateral")}
              </button>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── DIALOG MODALS ── */}
      <DialogPrimitive.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm animate-in fade-in-0" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-[20px] border border-border p-6 animate-in fade-in-0 zoom-in-95"
            style={{ boxShadow: "var(--shadow-xl)" }}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <DialogPrimitive.Title className="text-[1.125rem] font-semibold text-foreground">{t("Create Project", "Criar projeto")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-[0.875rem] text-muted-foreground mt-0.5">{t("Set up a new workspace project.", "Configure um novo projeto no workspace.")}</DialogPrimitive.Description>
              </div>
              <DialogPrimitive.Close aria-label={t("Close", "Fechar")} className="h-8 w-8 rounded-[8px] flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">{t("Project Name", "Nome do projeto")}</label>
                <input className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none focus:ring-2 focus:ring-ring transition-all" placeholder={t("Enter project name...", "Digite o nome do projeto...")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.875rem] font-medium text-foreground">{t("Description", "Descrição")}</label>
                <textarea className="w-full bg-background border border-border text-foreground placeholder:text-muted-foreground rounded-[10px] px-3 py-2.5 text-[0.9375rem] outline-none focus:ring-2 focus:ring-ring transition-all resize-none" rows={3} placeholder={t("Describe your project...", "Descreva seu projeto...")} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <DialogPrimitive.Close className="h-10 px-4 text-[0.9375rem] font-semibold rounded-[10px] border border-border bg-card hover:bg-accent text-foreground transition-colors">{t("Cancel", "Cancelar")}</DialogPrimitive.Close>
              <button className="h-10 px-5 text-[0.9375rem] font-semibold rounded-[10px] bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors">{t("Create Project", "Criar projeto")}</button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DialogPrimitive.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm animate-in fade-in-0" />
          <DialogPrimitive.Content
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card rounded-[20px] border border-border p-6 animate-in fade-in-0 zoom-in-95"
            style={{ boxShadow: "var(--shadow-xl)" }}
          >
            <div className="flex flex-col items-center text-center gap-4 mb-5">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <DialogPrimitive.Title className="text-[1.125rem] font-semibold text-foreground">{t("Delete Project", "Excluir projeto")}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="text-[0.875rem] text-muted-foreground mt-1">{t("This action cannot be undone. All data will be permanently removed.", "Esta ação não pode ser desfeita. Todos os dados serão removidos permanentemente.")}</DialogPrimitive.Description>
              </div>
            </div>
            <div className="flex gap-2">
              <DialogPrimitive.Close className="flex-1 h-10 text-[0.9375rem] font-semibold rounded-[10px] border border-border bg-card hover:bg-accent text-foreground transition-colors">{t("Cancel", "Cancelar")}</DialogPrimitive.Close>
              <button className="flex-1 h-10 text-[0.9375rem] font-semibold rounded-[10px] bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] transition-colors">{t("Delete", "Excluir")}</button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <DrawerDemo open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* ── Accordion ── */}
      <section id="accordion" className="space-y-5 mt-10">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Accordion", "Accordion")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("Collapsible content panels powered by Radix UI. Three style variants.", "Painéis de conteúdo recolhíveis com Radix UI. Três variantes de estilo.")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Variant 1 — Default (bordered, single open) */}
          <ShowcaseCard>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-4">{t("Default — Single open", "Padrão — Um aberto por vez")}</p>
            <AccordionPrimitive.Root type="single" collapsible className="w-full divide-y divide-border rounded-[12px] border border-border overflow-hidden">
              {defaultItems.map(item => (
                <AccordionPrimitive.Item key={item.value} value={item.value}>
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-[0.9375rem] font-semibold text-foreground bg-card hover:bg-muted transition-colors data-[state=open]:bg-muted">
                      {bi(item.label)}
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="px-5 pb-5 pt-3 text-[0.875rem] text-muted-foreground leading-relaxed bg-card">
                      {bi(item.content)}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </ShowcaseCard>

          {/* Variant 2 — Flush (no outer border, subtle separator) */}
          <ShowcaseCard>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-4">{t("Flush — Multiple open", "Flush — Vários abertos")}</p>
            <AccordionPrimitive.Root type="multiple" className="w-full divide-y divide-border">
              {flushItems.map(item => (
                <AccordionPrimitive.Item key={item.value} value={item.value}>
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between py-4 text-[0.9375rem] font-semibold text-foreground hover:text-primary transition-colors">
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 text-primary shrink-0" />
                        {bi(item.label)}
                      </span>
                      <span className="h-5 w-5 rounded-full border border-border flex items-center justify-center shrink-0 transition-colors group-data-[state=open]:bg-primary group-data-[state=open]:border-primary">
                        <Plus className="h-3 w-3 text-muted-foreground group-data-[state=open]:hidden" />
                        <Minus className="h-3 w-3 text-white hidden group-data-[state=open]:block" />
                      </span>
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pb-4 text-[0.875rem] text-muted-foreground leading-relaxed">
                      {bi(item.content)}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </ShowcaseCard>

          {/* Variant 3 — Card stack (each item is its own card) */}
          <ShowcaseCard>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground mb-4">{t("Card stack — FAQ style", "Pilha de cards — estilo FAQ")}</p>
            <AccordionPrimitive.Root type="single" collapsible className="w-full space-y-2">
              {faqItems.map(item => (
                <AccordionPrimitive.Item
                  key={item.value}
                  value={item.value}
                  className="rounded-[10px] border border-border bg-background overflow-hidden data-[state=open]:border-primary/40 data-[state=open]:bg-primary/[0.03] transition-colors"
                >
                  <AccordionPrimitive.Header>
                    <AccordionPrimitive.Trigger className="group flex w-full items-center justify-between px-4 py-3.5 text-[0.875rem] font-semibold text-foreground">
                      <span className="text-left">{bi(item.label)}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary ml-4" />
                    </AccordionPrimitive.Trigger>
                  </AccordionPrimitive.Header>
                  <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="px-4 pb-4 text-[0.8125rem] text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                      {bi(item.content)}
                    </div>
                  </AccordionPrimitive.Content>
                </AccordionPrimitive.Item>
              ))}
            </AccordionPrimitive.Root>
          </ShowcaseCard>
        </div>
      </section>

      {/* ── Tokens ── */}
      <section id="overlays-tokens" className="space-y-5 mt-10">
        <div>
          <h2 className="text-[1.125rem] font-black text-foreground tracking-[-0.025em]">{t("Tokens", "Tokens")}</h2>
          <p className="text-[0.8125rem] text-muted-foreground mt-0.5">{t("CSS custom properties used by popovers, dialogs, tooltips, and navigation.", "Propriedades CSS customizadas usadas por popovers, diálogos, tooltips e navegação.")}</p>
        </div>
        <TokenTable groups={overlaysTokenGroups(t)} />
      </section>
    </div>
  );
}

/* ── Accordion data ── */
const defaultItems = [
  {
    value: "what",
    label: { en: "What is the DaniMoscatelli Design System?", pt: "O que é o DaniMoscatelli Design System?" },
    content: { en: "A premium design system built on a cool graphite palette with a burnt crimson accent. Optimized for modern SaaS dashboards and enterprise applications, with full Dark and Light Mode support.", pt: "Um design system premium construído sobre uma paleta fria de grafite com um destaque carmim queimado. Otimizado para dashboards SaaS modernos e aplicações corporativas, com suporte completo aos modos escuro e claro." },
  },
  {
    value: "tokens",
    label: { en: "How do I use the design tokens?", pt: "Como usar os design tokens?" },
    content: { en: "All tokens are CSS custom properties accessible via var(--token-name). Use them directly in CSS or via Tailwind v4 classes mapped in the @theme inline of the theme.css file.", pt: "Todos os tokens são propriedades CSS customizadas acessíveis via var(--token-name). Use-os diretamente no CSS ou por classes do Tailwind v4 mapeadas no @theme inline do arquivo theme.css." },
  },
  {
    value: "radix",
    label: { en: "Which Radix UI primitives are included?", pt: "Quais primitivos do Radix UI estão incluídos?" },
    content: { en: "Dialog, Dropdown Menu, Tooltip, Accordion, Tabs, Popover, Switch, Checkbox, Select, Radio Group, Slider, Progress and more. All are fully keyboard accessible and follow ARIA guidelines.", pt: "Dialog, Dropdown Menu, Tooltip, Accordion, Tabs, Popover, Switch, Checkbox, Select, Radio Group, Slider, Progress e mais. Todos são totalmente acessíveis por teclado e seguem as diretrizes ARIA." },
  },
  {
    value: "dark",
    label: { en: "Is Dark Mode supported in all components?", pt: "O dark mode é suportado em todos os componentes?" },
    content: { en: "Yes. Every semantic token has a light and dark variant defined in the theme.css file. Switching modes is instant via the .dark class on the root element, with no Flash of Unstyled Content.", pt: "Sim. Todo token semântico tem uma variante clara e uma escura definidas no arquivo theme.css. A troca de modo é instantânea pela classe .dark no elemento raiz, sem Flash of Unstyled Content." },
  },
];

const flushItems = [
  {
    value: "security",
    icon: ShieldCheck,
    label: { en: "Security & Compliance", pt: "Segurança e conformidade" },
    content: { en: "End-to-end encryption, SSO/SAML, granular RBAC and SOC 2 Type II compliance. Complete audit logs for all user actions.", pt: "Criptografia de ponta a ponta, SSO/SAML, RBAC granular e conformidade SOC 2 Tipo II. Logs de auditoria completos para todas as ações dos usuários." },
  },
  {
    value: "billing",
    icon: CreditCard,
    label: { en: "Billing & Plans", pt: "Cobrança e planos" },
    content: { en: "Monthly and annual plans with a 20% discount. Upgrade or downgrade at any time, with automatic prorated billing.", pt: "Planos mensais e anuais com 20% de desconto. Faça upgrade ou downgrade quando quiser, com cobrança proporcional automática." },
  },
  {
    value: "performance",
    icon: Zap,
    label: { en: "Performance & SLA", pt: "Desempenho e SLA" },
    content: { en: "Guaranteed 99.9% uptime with enterprise SLA available. Globally distributed CDN with average latency under 50ms.", pt: "Disponibilidade garantida de 99,9% com SLA corporativo disponível. CDN distribuída globalmente com latência média abaixo de 50ms." },
  },
  {
    value: "support",
    icon: MessageSquare,
    label: { en: "Support & Onboarding", pt: "Suporte & Onboarding" },
    content: { en: "Real-time chat support, a knowledge base and guided onboarding sessions. Enterprise plans include a dedicated Customer Success Manager.", pt: "Suporte por chat em tempo real, base de conhecimento e sessões de onboarding guiadas. Planos Enterprise incluem um Customer Success Manager dedicado." },
  },
];

const faqItems = [
  {
    value: "trial",
    label: { en: "Is there a free trial period?", pt: "Existe um período de teste gratuito?" },
    content: { en: "Yes, we offer a full 14-day trial with no credit card required. Access to all Pro plan features during the period.", pt: "Sim, oferecemos 14 dias de teste completo, sem necessidade de cartão de crédito. Acesso a todos os recursos do plano Pro durante o período." },
  },
  {
    value: "cancel",
    label: { en: "Can I cancel at any time?", pt: "Posso cancelar a qualquer momento?" },
    content: { en: "Yes. No penalties or cancellation fees. When you cancel, you keep access until the end of the paid period.", pt: "Sim. Sem multas ou taxas de cancelamento. Ao cancelar, você mantém o acesso até o fim do período pago." },
  },
  {
    value: "migration",
    label: { en: "How does data migration work?", pt: "Como funciona a migração de dados?" },
    content: { en: "Our team offers free migration support. We import your data from any tool with a guided wizard and automatic integrity validation.", pt: "Nossa equipe oferece suporte gratuito à migração. Importamos seus dados de qualquer ferramenta com um assistente guiado e validação automática de integridade." },
  },
  {
    value: "limits",
    label: { en: "What are the usage limits per plan?", pt: "Quais são os limites de uso por plano?" },
    content: { en: "The Starter plan includes 5 users and 10 GB of storage. Pro includes unlimited users and 100 GB. Enterprise is fully customizable.", pt: "O plano Starter inclui 5 usuários e 10 GB de armazenamento. O Pro inclui usuários ilimitados e 100 GB. O Enterprise é totalmente personalizável." },
  },
  {
    value: "api",
    label: { en: "Is the API available on all plans?", pt: "A API está disponível em todos os planos?" },
    content: { en: "REST API access available on the Pro plan and above. The Enterprise plan includes custom rate limits, advanced webhooks and GraphQL support.", pt: "Acesso à API REST disponível no plano Pro e superiores. O plano Enterprise inclui limites de taxa personalizados, webhooks avançados e suporte a GraphQL." },
  },
];

const overlaysTokenGroups = (t: TFn): TokenGroup[] => [
  {
    group: t("Popover & Dialog Surface", "Superfície de popover e diálogo"),
    tokens: [
      { name: "--popover",            description: t("Floating panel background", "Fundo do painel flutuante"),    light: "#FFFFFF",             dark: "rgba(19,26,39,0.95)", isColor: true },
      { name: "--popover-foreground", description: t("Floating panel text", "Texto do painel flutuante"),          light: "#131A27",             dark: "#E4E9F0",             isColor: true },
      { name: "--card",               description: t("Dialog card background", "Fundo do card do diálogo"),       light: "#FFFFFF",             dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--card-foreground",    description: t("Dialog card text", "Texto do card do diálogo"),             light: "#131A27",             dark: "#E4E9F0",             isColor: true },
    ],
  },
  {
    group: t("Border & Focus", "Borda e foco"),
    tokens: [
      { name: "--border",       description: t("Default border", "Borda padrão"),              light: "rgba(19,26,39,0.09)",  dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--border-strong",description: t("Active / hover border", "Borda ativa / hover"),       light: "rgba(19,26,39,0.16)",  dark: "rgba(255,255,255,0.12)", isColor: true },
      { name: "--ring",         description: t("Keyboard focus ring", "Anel de foco do teclado"),         light: "rgba(212,77,77,0.35)", dark: "rgba(212,77,77,0.40)",   isColor: true },
    ],
  },
  {
    group: t("Elevation", "Elevação"),
    tokens: [
      { name: "--shadow-sm", description: t("Tooltip micro-shadow", "Micro-sombra do tooltip"),    light: "0 1px 3px …" },
      { name: "--shadow-md", description: t("Dropdown / popover", "Dropdown / popover"),      light: "0 4px 12px …" },
      { name: "--shadow-lg", description: t("Dialog / modal", "Diálogo / modal"),          light: "0 8px 24px …" },
      { name: "--shadow-xl", description: t("Full-page overlay", "Overlay de página inteira"),       light: "0 16px 48px …" },
    ],
  },
  {
    group: t("Background Overlay", "Overlay de fundo"),
    tokens: [
      { name: "--foreground / 20", description: t("Dialog backdrop (20% opacity)", "Backdrop do diálogo (20% de opacidade)"), light: "rgba(19,26,39,0.20)",  dark: "rgba(19,26,39,0.60)", isColor: true },
    ],
  },
  {
    group: t("Shape", "Forma"),
    tokens: [
      { name: "--radius-sm", description: t("Tooltip corner radius", "Raio de canto do tooltip"),  light: "calc(0.75rem - 4px)" },
      { name: "--radius-md", description: t("Dropdown corner radius", "Raio de canto do dropdown"), light: "0.75rem" },
      { name: "--radius-lg", description: t("Dialog corner radius", "Raio de canto do diálogo"),   light: "calc(0.75rem + 4px)" },
    ],
  },
  {
    group: t("Pagination", "Paginação"),
    tokens: [
      { name: "--primary",       description: t("Active page number bg", "Fundo do número da página ativa"), light: "#D44D4D",  dark: "#D44D4D",  isColor: true },
      { name: "--muted",         description: t("Page item hover bg", "Fundo do item de página no hover"),    light: "#E8EDF3",  dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--muted-foreground",description: t("Inactive page text", "Texto de página inativa"),  light: "#627288",  dark: "#8898B0",  isColor: true },
    ],
  },
  {
    group: t("Accordion", "Accordion"),
    tokens: [
      { name: "--card",            description: t("Accordion panel background", "Fundo do painel do accordion"),      light: "#FFFFFF",              dark: "rgba(19,26,39,0.75)", isColor: true },
      { name: "--muted",           description: t("Trigger hover background", "Fundo do gatilho no hover"),        light: "#E8EDF3",              dark: "rgba(40,48,67,0.60)", isColor: true },
      { name: "--border",          description: t("Item separator", "Separador de item"),                  light: "rgba(19,26,39,0.09)",  dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--primary",         description: t("Open item accent border / icon", "Borda de destaque / ícone do item aberto"),  light: "#D44D4D",              dark: "#D44D4D", isColor: true },
      { name: "--primary-muted",   description: t("Open item tinted background", "Fundo com tom do item aberto"),     light: "rgba(212,77,77,0.03)", dark: "rgba(212,77,77,0.05)", isColor: true },
      { name: "--foreground",      description: t("Trigger text", "Texto do gatilho"),                    light: "#131A27",              dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground",description: t("Content / chevron text", "Texto do conteúdo / chevron"),          light: "#627288",              dark: "#8898B0", isColor: true },
    ],
  },
];
