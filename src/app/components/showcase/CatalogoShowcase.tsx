import React, { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { useI18n } from "../../i18n";
import { PageHeader } from "./GetStartedShowcase";
import { navegarPara } from "./shared/VejaEm";
import { Input } from "../ui/input";

/* Catálogo de todos os componentes de ui/: para que servem, como importar e onde ver a demonstração.
   A lista é filtrada pelos arquivos que existem de fato neste DS (import.meta.glob). */

const arquivos = Object.keys(import.meta.glob("../ui/*.{ts,tsx}")).map(k => k.replace("../ui/", "").replace(/\.(tsx|ts)$/, ""));

type Item = { nome: string; en: string; pt: string; pagina?: { secao: string; ancora?: string; rotulo: [string, string] } };

const P = {
  form: { secao: "buttons", rotulo: ["Form controls", "Controles de formulário"] as [string, string] },
  feedback: { secao: "feedback", rotulo: ["Feedback", "Feedback"] as [string, string] },
  rotulos: { secao: "badges", rotulo: ["Labels", "Rótulos"] as [string, string] },
  overlays: { secao: "overlays", rotulo: ["Overlays", "Overlays"] as [string, string] },
  cards: { secao: "cards", rotulo: ["Cards", "Cards"] as [string, string] },
  dados: { secao: "data", rotulo: ["Data", "Dados"] as [string, string] },
  icones: { secao: "icons", rotulo: ["Icons", "Ícones"] as [string, string] },
  movimento: { secao: "motion", rotulo: ["Motion", "Movimento"] as [string, string] },
  fundos: { secao: "backgrounds", rotulo: ["Backgrounds", "Fundos"] as [string, string] },
  templates: { secao: "templates", rotulo: ["Templates", "Templates"] as [string, string] },
  estados: { secao: "states", rotulo: ["Information states", "Estados de informação"] as [string, string] },
  fundamentos: { secao: "colors", rotulo: ["Foundation", "Fundamentos"] as [string, string] },
  linha: { secao: "timeline", rotulo: ["Timeline", "Linha do tempo"] as [string, string] },
  etapas: { secao: "stepper", rotulo: ["Stepper", "Etapas"] as [string, string] },
  upload: { secao: "upload", rotulo: ["Upload", "Upload"] as [string, string] },
  painel: { secao: "sidepanel", rotulo: ["Side panel", "Painel lateral"] as [string, string] },
};

const itens: Item[] = [
  { nome: "accordion", en: "Expandable sections with a title; one or several open at a time.", pt: "Seções que abrem e fecham pelo título; uma ou várias abertas ao mesmo tempo.", pagina: P.overlays },
  { nome: "alert-dialog", en: "Confirmation dialog for important or destructive actions; requires an answer.", pt: "Diálogo de confirmação para ações importantes ou destrutivas; exige uma resposta.", pagina: P.overlays },
  { nome: "alert", en: "Inline message with icon, title and text, in success, info, warning and error variants.", pt: "Mensagem no meio da página com ícone, título e texto, nas variantes sucesso, informação, aviso e erro.", pagina: P.feedback },
  { nome: "aspect-ratio", en: "Keeps an image or video in a fixed proportion (for example 4:5).", pt: "Mantém imagem ou vídeo numa proporção fixa (por exemplo 4:5)." },
  { nome: "avatar-circles", en: "Row of overlapping avatars with a counter.", pt: "Fileira de avatares sobrepostos com contador.", pagina: P.rotulos },
  { nome: "avatar", en: "Photo or initials of a person or store.", pt: "Foto ou iniciais de uma pessoa ou loja.", pagina: P.rotulos },
  { nome: "badge", en: "Short label for status or category.", pt: "Rótulo curto de status ou categoria.", pagina: P.rotulos },
  { nome: "breadcrumb", en: "Trail showing where the page is in the hierarchy.", pt: "Trilha que mostra onde a página está na hierarquia.", pagina: P.overlays },
  { nome: "button", en: "Action button: 40 px, variants default, outline, secondary, ghost, link and destructive.", pt: "Botão de ação: 40 px, variantes padrão, contorno, secundário, ghost, link e destrutivo.", pagina: P.form },
  { nome: "calendar", en: "Month calendar to pick a date or a range.", pt: "Calendário mensal para escolher uma data ou um intervalo." },
  { nome: "card", en: "Base card with header, content and footer.", pt: "Card base com cabeçalho, conteúdo e rodapé.", pagina: P.cards },
  { nome: "carousel", en: "Horizontal list that slides, with previous and next buttons.", pt: "Lista horizontal que desliza, com botões de anterior e próximo." },
  { nome: "chart", en: "Wrapper for Recharts charts with DS colors and tooltip.", pt: "Base para gráficos (Recharts) com as cores e a dica do DS.", pagina: P.dados },
  { nome: "checkbox", en: "Checkbox for independent choices.", pt: "Caixa de seleção para escolhas independentes.", pagina: P.form },
  { nome: "collapsible", en: "Shows and hides a block of content.", pt: "Mostra e esconde um bloco de conteúdo." },
  { nome: "command", en: "Command palette with search (Ctrl+K).", pt: "Paleta de comandos com busca (Ctrl+K).", pagina: P.templates },
  { nome: "context-menu", en: "Menu opened with the right button.", pt: "Menu aberto com o botão direito." },
  { nome: "contrast", en: "Helpers to compute contrast between colors.", pt: "Funções para calcular o contraste entre cores.", pagina: P.cards },
  { nome: "dialog", en: "Modal window for focused tasks.", pt: "Janela modal para tarefas que pedem foco.", pagina: P.overlays },
  { nome: "doodle-texture", en: "Brand texture used as a background.", pt: "Textura da marca usada como fundo.", pagina: P.fundos },
  { nome: "drawer", en: "Panel that slides up from the bottom (mobile).", pt: "Painel que sobe da parte de baixo da tela (celular)." },
  { nome: "dropdown-menu", en: "Menu of actions opened by a button.", pt: "Menu de ações aberto por um botão.", pagina: P.overlays },
  { nome: "fashion-icons", en: "Fashion icons (garments) that Lucide does not have.", pt: "Ícones de moda (peças) que o Lucide não tem.", pagina: P.icones },
  { nome: "form", en: "Form helpers (react-hook-form) with label, message and errors.", pt: "Base de formulário (react-hook-form) com rótulo, mensagem e erros." },
  { nome: "graficos", en: "Charts: donut, ranked bars, regional heat map, dumbbell, lines, slope, treemap, 100% bars, bubbles, matrix heat map, bump chart, funnel and the discovery card.", pt: "Gráficos: rosca, barras ordenadas, mapa de calor por região, halteres, linhas, inclinação, mosaico, barras 100%, bolhas, mapa de calor em matriz, ranking, funil e o card de descoberta.", pagina: { secao: "graficos", rotulo: ["Charts", "Gráficos"] } },
  { nome: "glass-card", en: "Glass card in the approved finishes.", pt: "Card de vidro nos acabamentos aprovados.", pagina: P.cards },
  { nome: "heading", en: "Title with the highlighted word in the brand color.", pt: "Título com a palavra de destaque na cor da marca.", pagina: P.fundamentos },
  { nome: "hover-card", en: "Preview card that opens when hovering a link.", pt: "Card de prévia que abre ao passar o mouse num link." },
  { nome: "icones-preservados", en: "Brand icons kept as files (for example social networks).", pt: "Ícones de marcas guardados como arquivo (por exemplo redes sociais).", pagina: P.icones },
  { nome: "input-otp", en: "Field for verification codes, one box per digit.", pt: "Campo de código de verificação, uma caixa por dígito." },
  { nome: "input", en: "Text field: 40 px, visible border and focus ring.", pt: "Campo de texto: 40 px, borda visível e anel de foco.", pagina: P.form },
  { nome: "label", en: "Field label linked to the field.", pt: "Rótulo de campo, ligado ao campo." },
  { nome: "lucide-catalogo", en: "Searchable list of Lucide icons.", pt: "Lista pesquisável dos ícones Lucide.", pagina: P.icones },
  { nome: "luzes-difusas", en: "Soft animated lights for dark backgrounds.", pt: "Luzes suaves e animadas para fundos escuros.", pagina: P.cards },
  { nome: "menubar", en: "Horizontal menu bar, like desktop apps.", pt: "Barra de menus horizontal, como em programas de computador." },
  { nome: "navigation-menu", en: "Site navigation with submenus.", pt: "Navegação de site com submenus." },
  { nome: "pagination", en: "Page navigation with active page in the primary color.", pt: "Navegação entre páginas, com a ativa na cor primária.", pagina: P.overlays },
  { nome: "painel-cabecalho", en: "Panel page header: title, period selector and split button.", pt: "Cabeçalho das páginas do painel: título, seletor de período e botão dividido.", pagina: P.form },
  { nome: "painel-dados", en: "Panel indicators: KPI card, chart, score ring and checklist.", pt: "Indicadores do painel: card de KPI, gráfico, anel de pontuação e checklist.", pagina: P.dados },
  { nome: "painel-produtos", en: "Product table with tabs, bulk actions and performance.", pt: "Tabela de produtos com abas, ações em lote e desempenho.", pagina: P.dados },
  { nome: "painel-shell", en: "Panel frame: store selector, side menu, search, notifications and account.", pt: "Moldura do painel: seletor de loja, menu lateral, busca, notificações e conta.", pagina: P.templates },
  { nome: "partner-card", en: "Invitation card with highlight, main action and secondary link.", pt: "Card de convite com destaque, ação principal e link secundário.", pagina: P.cards },
  { nome: "password-field", en: "Password with show/hide, strength and requirements.", pt: "Senha com mostrar/ocultar, força e requisitos.", pagina: P.form },
  { nome: "popover", en: "Floating panel anchored to a button.", pt: "Painel flutuante preso a um botão." },
  { nome: "product-card", en: "Item card with photo, price and condition.", pt: "Card de peça com foto, preço e condição.", pagina: P.cards },
  { nome: "progress", en: "Progress bar.", pt: "Barra de progresso.", pagina: P.feedback },
  { nome: "radio-group", en: "Single choice among a few options.", pt: "Escolha única entre poucas opções.", pagina: P.form },
  { nome: "resizable", en: "Panels with a handle to resize.", pt: "Painéis com alça para redimensionar." },
  { nome: "scroll-area", en: "Area with a styled scrollbar.", pt: "Área com barra de rolagem estilizada." },
  { nome: "segmented-control", en: "Segmented control to switch between options or views.", pt: "Controle segmentado para alternar opções ou visualizações.", pagina: P.form },
  { nome: "select", en: "Selection list in a 40 px field.", pt: "Lista de seleção em campo de 40 px.", pagina: P.form },
  { nome: "selo-secao", en: "Section seal above the title.", pt: "Selo de seção acima do título.", pagina: P.rotulos },
  { nome: "selo", en: "Hero seal (tag at the top of the page).", pt: "Selo do hero (tag no topo da página).", pagina: P.rotulos },
  { nome: "separator", en: "Horizontal or vertical divider line.", pt: "Linha divisória horizontal ou vertical." },
  { nome: "sheet", en: "Side panel over the content; traps focus and closes with Esc.", pt: "Painel lateral sobre o conteúdo; prende o foco e fecha com Esc.", pagina: P.overlays },
  { nome: "shine-border", en: "Light that travels around the border of a highlighted card.", pt: "Luz que dá a volta na borda de um card em destaque.", pagina: P.cards },
  { nome: "side-panel", en: "Side form panel (contact, registration).", pt: "Painel lateral de formulário (contato, cadastro).", pagina: P.painel },
  { nome: "sidebar", en: "Collapsible side navigation for apps.", pt: "Navegação lateral recolhível para aplicativos." },
  { nome: "skeleton", en: "Loading placeholder in the shape of the content.", pt: "Espaço de carregamento no formato do conteúdo.", pagina: P.feedback },
  { nome: "slider", en: "Slider to choose a value or a range.", pt: "Controle deslizante para escolher um valor ou intervalo.", pagina: P.cards },
  { nome: "sonner", en: "Toast notifications. Mount <Toaster /> once and call toast().", pt: "Notificações (toast). Monte <Toaster /> uma vez e chame toast().", pagina: P.feedback },
  { nome: "status-chip", en: "Information state chip: icon and text always together.", pt: "Selo de estado de informação: ícone e texto sempre juntos.", pagina: P.estados },
  { nome: "stepper", en: "Steps of a process with the current step.", pt: "Etapas de um processo, com a etapa atual.", pagina: P.etapas },
  { nome: "switch", en: "On/off switch with immediate effect.", pt: "Chave liga/desliga com efeito imediato.", pagina: P.form },
  { nome: "table", en: "Data table with header and rows.", pt: "Tabela de dados com cabeçalho e linhas.", pagina: P.dados },
  { nome: "tabs", en: "Tabs that switch content in the same place.", pt: "Abas que trocam o conteúdo no mesmo lugar.", pagina: P.feedback },
  { nome: "textarea", en: "Multi-line text field.", pt: "Campo de texto com várias linhas.", pagina: P.form },
  { nome: "timeline", en: "Steps in a vertical line, with marker and card.", pt: "Etapas numa linha vertical, com marcador e card.", pagina: P.linha },
  { nome: "toggle-group", en: "Group of toggle buttons.", pt: "Grupo de botões que ligam e desligam." },
  { nome: "toggle", en: "Button that stays pressed (on/off).", pt: "Botão que fica pressionado (liga/desliga)." },
  { nome: "tooltip", en: "Short hint on hover or focus.", pt: "Dica curta ao passar o mouse ou focar.", pagina: P.overlays },
  { nome: "upload", en: "Photo and file upload with preview and validation.", pt: "Envio de fotos e arquivos com prévia e validação.", pagina: P.upload },
  { nome: "voltar-ao-topo", en: "Round button that takes the person back to the top of the page.", pt: "Botão redondo que leva de volta ao topo da página.", pagina: P.templates },
  { nome: "use-mobile", en: "Hook that tells whether the screen is mobile size.", pt: "Hook que diz se a tela tem tamanho de celular." },
  { nome: "utils", en: "cn() helper to combine classes.", pt: "Função cn() para combinar classes." },
];

export function CatalogoShowcase() {
  const { t } = useI18n();
  const [busca, setBusca] = useState("");
  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return itens
      .filter(i => arquivos.includes(i.nome))
      .filter(i => !termo || i.nome.includes(termo) || t(i.en, i.pt).toLowerCase().includes(termo));
  }, [busca, t]);
  const semPagina = itens.filter(i => arquivos.includes(i.nome) && !i.pagina).length;
  const total = itens.filter(i => arquivos.includes(i.nome)).length;

  return (
    <div className="space-y-10 min-w-0">
      <PageHeader
        eyebrow={t("Components", "Componentes")}
        title={t("Component **catalog**", "Catálogo de **componentes**")}
        description={t(`All ${total} files in ui/: what each one does, how to import it and where to see it working. ${semPagina} still have no demonstration page and are marked as such.`, `Todos os ${total} arquivos de ui/: o que cada um faz, como importar e onde ver funcionando. ${semPagina} ainda não têm página de demonstração e aparecem marcados assim.`)}
      />

      <section id="catalogo-lista" className="scroll-mt-32 space-y-4">
        <div className="relative max-w-md">
          <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <label htmlFor="catalogo-busca" className="sr-only">{t("Search components", "Buscar componentes")}</label>
          <Input id="catalogo-busca" value={busca} onChange={e => setBusca(e.target.value)} placeholder={t("Search by name or purpose", "Buscar por nome ou uso")} className="pl-9" />
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="hidden grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,0.9fr)] border-b border-border bg-muted/30 px-5 py-3 text-[0.75rem] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <span>{t("Component", "Componente")}</span><span>{t("What it does", "Para que serve")}</span><span>{t("Where to see", "Onde ver")}</span>
          </div>
          {lista.map((i, n) => (
            <div key={i.nome} className={`grid grid-cols-1 gap-1.5 px-5 py-3.5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_minmax(0,0.9fr)] md:gap-4 ${n < lista.length - 1 ? "border-b border-border" : ""}`}>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold text-foreground">{i.nome}</p>
                <code className="block truncate text-[0.6875rem] text-muted-foreground" title={`@/app/components/ui/${i.nome}`}>ui/{i.nome}</code>
              </div>
              <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{t(i.en, i.pt)}</p>
              <div className="flex items-start">
                {i.pagina ? (
                  <button type="button" onClick={() => navegarPara(i.pagina!.secao, i.pagina!.ancora)} className="inline-flex items-center gap-1 rounded-sm text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    {t(i.pagina.rotulo[0], i.pagina.rotulo[1])} <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted px-2.5 text-[0.6875rem] font-semibold text-muted-foreground">{t("Code only, no demo yet", "Só no código, sem demonstração")}</span>
                )}
              </div>
            </div>
          ))}
          {lista.length === 0 && <p className="px-5 py-6 text-[0.875rem] text-muted-foreground">{t("No component matches this search.", "Nenhum componente com essa busca.")}</p>}
        </div>
      </section>
    </div>
  );
}
