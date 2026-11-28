import React, { useState } from "react";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { useI18n } from "../../i18n";
import {
  Search, Eye, EyeOff, ChevronDown, Plus, Send, Upload, Trash2, Edit3, Copy, Share, MoreHorizontal,
  ArrowRight, Check, X, Zap, Star, XCircle,
} from "lucide-react";
import { SegmentedControl } from "@/app/components/ui/segmented-control";
import { Button } from "@/app/components/ui/button";
import { Campo } from "@/app/components/ui/campo";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { PasswordConfirm, regrasPadrao, textosPadrao } from "@/app/components/ui/password-field";
import { LayoutGrid, List, Map as MapIcon } from "lucide-react";
import { SectionHeader } from "./shared/SectionHeader";
import { SecaoBotaoQuebra } from "./shared/LacunasDocs";

/* ── Shared helpers ── */

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h3 className="text-body-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-card rounded-lg border border-border p-6 ${className}`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      {children}
    </div>
  );
}

/* ── Button variants ── */
// As demonstrações usam o componente real (ui/button), o mesmo que o produto copia.
const variantesUi: Record<string, "default" | "outline" | "ghost" | "link" | "secondary" | "destructive"> = {
  primary: "default", outline: "outline", ghost: "ghost", link: "link", secondary: "secondary", destructive: "destructive", "crimson-outline": "outline",
};
const tamanhosUi: Record<string, "sm" | "default" | "lg" | "icon"> = { sm: "sm", md: "default", lg: "lg", xl: "lg", "icon-sm": "icon", icon: "icon", "icon-lg": "icon" };
const tamanhoExtra: Record<string, string> = { xl: "h-13 px-7", "icon-sm": "size-8", "icon-lg": "size-11" };

function Btn({ variant = "primary", size = "md", children, disabled = false, icon, iconOnly = false, rotulo, className = "" }:
  { variant?: "primary"|"outline"|"ghost"|"link"|"secondary"|"destructive"|"crimson-outline"; size?: "sm"|"md"|"lg"|"xl"|"icon-sm"|"icon"|"icon-lg"; children?: React.ReactNode; disabled?: boolean; icon?: React.ReactNode; iconOnly?: boolean; rotulo?: string; className?: string }) {
  const contorno = variant === "crimson-outline" ? "border-primary text-[var(--primary-text,var(--primary))] hover:bg-accent hover:text-[var(--primary-text,var(--primary))]" : "";
  return (
    <Button
      variant={variantesUi[variant]}
      size={tamanhosUi[size] ?? "default"}
      className={`${contorno} ${tamanhoExtra[size] ?? ""} ${variant === "link" ? "!px-0" : ""} ${className}`}
      disabled={disabled}
      aria-label={iconOnly ? rotulo : undefined}
    >
      {icon && <span className="shrink-0" aria-hidden>{icon}</span>}
      {!iconOnly && children}
    </Button>
  );
}


function FormShowcaseBase() {
  const { t } = useI18n();
  const formTokenGroups = getFormTokenGroups(t);
  const [condicao, setCondicao] = useState("nova");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [senhaUnica, setSenhaUnica] = useState("Sucesso@20234");
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
              <Btn variant="link">{t("Link button", "Botão link")}</Btn>
              <Btn variant="crimson-outline">{t("Crimson Outline", "Contorno Crimson")}</Btn>
              <Btn variant="primary" disabled>{t("Disabled", "Desabilitado")}</Btn>
              <Button carregando textoCarregando={t("Loading", "Carregando")}>{t("Save", "Salvar")}</Button>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Disabled and loading", "Desabilitado e carregando")}>
          <ShowcaseCard>
            <p className="mb-5 max-w-2xl text-body-sm leading-relaxed text-muted-foreground">
              {t(
                "Two different states that never share a look (owner's decision, 28/11/2026). Disabled means the action is not available right now (something is missing, or there is no permission): grey background, no colour, no click. Loading means the action was accepted and is working: the button keeps its own colour, slightly faded (80%), with the spinner before the text; it is marked aria-busy, takes no clicks and keeps its width. With reduced motion the spinner stops and the text still says it is loading.",
                "Dois estados diferentes, que nunca têm a mesma cara (decisão da dona do produto, 28/11/2026). Desabilitado quer dizer que a ação não está disponível agora (falta preencher algo ou não há permissão): fundo cinza, sem cor, sem clique. Carregando quer dizer que a ação foi aceita e está trabalhando: o botão mantém a própria cor, um pouco esmaecido (80%), com o giro antes do texto; fica marcado como ocupado (aria-busy), não recebe clique e não muda de largura. Com \"menos movimento\", o giro fica parado e o texto continua dizendo que está carregando.",
              )}
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Disabled: unavailable", "Desabilitado: indisponível")}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled>{t("Continue", "Continuar")}</Button>
                  <Button variant="outline" disabled>{t("Back", "Voltar")}</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Loading: working", "Carregando: trabalhando")}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button carregando textoCarregando={t("Saving…", "Salvando…")}>{t("Save", "Salvar")}</Button>
                  <Button variant="outline" carregando textoCarregando={t("Updating…", "Atualizando…")}>{t("Update", "Atualizar")}</Button>
                </div>
              </div>
              <div>
                <p className="mb-3 text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Try it", "Experimente")}</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    carregando={loading}
                    textoCarregando={t("Saving…", "Salvando…")}
                    onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 2000); }}
                  >
                    {t("Save changes", "Salvar alterações")}
                  </Button>
                </div>
              </div>
            </div>
            <pre className="mt-6 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { Button } from "@/app/components/ui/button";

// Desabilitado: a ação não está disponível
<Button disabled>Continuar</Button>

// Carregando: a ação está trabalhando (passe sempre true ou false: a largura não pula)
<Button carregando={salvando} textoCarregando="Salvando…">Salvar</Button>`}</code></pre>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Ghost and Link Buttons", "Botões Ghost e Link")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ShowcaseCard>
              <p className="text-body-sm font-semibold text-foreground mb-1">{t("Ghost button", "Botão ghost")}</p>
              <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
                {t("Use for tertiary or contextual actions that should remain available without competing with the primary action.", "Use para ações terciárias ou contextuais que devem continuar disponíveis sem competir com a ação principal.")}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Btn variant="ghost">{t("Dismiss", "Dispensar")}</Btn>
                <Btn variant="ghost" icon={<Star className="h-4 w-4" />}>{t("Favorite", "Favoritar")}</Btn>
                <Btn variant="ghost" size="icon" icon={<MoreHorizontal className="h-4 w-4" />} iconOnly rotulo={t("More options", "Mais opções")} />
              </div>
            </ShowcaseCard>
            <ShowcaseCard>
              <p className="text-body-sm font-semibold text-foreground mb-1">{t("Link button", "Botão link")}</p>
              <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
                {t("Use for low-emphasis navigation. Keep mutation, submission and destructive actions in standard button variants.", "Use para navegação de baixa ênfase. Mantenha ações de alteração, envio e exclusão nas variantes padrão de botão.")}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                <Btn variant="link">{t("View documentation", "Ver documentação")}</Btn>
                <Btn variant="link" icon={<ArrowRight className="h-4 w-4" />}>{t("Learn more", "Saiba mais")}</Btn>
              </div>
            </ShowcaseCard>
          </div>
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
              <Btn size="icon-sm" variant="outline" icon={<Plus className="h-4 w-4" />} iconOnly rotulo={t("Add", "Adicionar")} />
              <Btn size="icon" variant="outline" icon={<Edit3 className="h-4 w-4" />} iconOnly rotulo={t("Edit", "Editar")} />
              <Btn size="icon-lg" variant="outline" icon={<Share className="h-5 w-5" />} iconOnly rotulo={t("Share", "Compartilhar")} />
              <Btn size="icon-sm" variant="ghost" icon={<Trash2 className="h-4 w-4" />} iconOnly rotulo={t("Delete", "Excluir")} />
              <Btn size="icon" variant="ghost" icon={<Copy className="h-4 w-4" />} iconOnly rotulo={t("Copy", "Copiar")} />
              <Btn size="icon" variant="primary" icon={<ArrowRight className="h-4 w-4" />} iconOnly rotulo={t("Next", "Avançar")} />
              <Btn size="icon" variant="ghost" icon={<MoreHorizontal className="h-4 w-4" />} iconOnly rotulo={t("More options", "Mais opções")} />
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Shape: pill by default, square as a rare exception", "Forma: pílula como padrão, quadrado como exceção rara")}>
          <ShowcaseCard>
            <p className="mb-4 max-w-2xl text-body-sm text-muted-foreground">{t("Owner's decision (28/11/2026), the same in both design systems: \"Pill as the default in both projects\". Every button is a pill in every variant and size, and an icon-only button is a circle; components that draw buttons (dialogs, calendar, pagination, alert buttons, segmented control) follow the same rule. forma=\"quadrado\" (12 px corners) is a rare exception: a button glued to a field or inside a toolbar with straight corners. size=\"icon\" is 40 px with a mouse and 44 px on touch; size=\"icon-lg\" is always 44 px. Every button is 44 px tall on phones (below 640 px) and on touch screens.", "Decisão da dona do produto (28/11/2026), igual nos dois design systems: \"Pílula como padrão em ambos os projetos\". Todo botão é pílula, em qualquer variante e tamanho, e o botão só de ícone é um círculo; os componentes que desenham botões (janelas, calendário, paginação, botões do alerta, controle segmentado) seguem a mesma regra. forma=\"quadrado\" (cantos de 12 px) é exceção rara: um botão colado a um campo ou dentro de uma barra de ferramentas de cantos retos. size=\"icon\" tem 40 px com mouse e 44 px no toque; size=\"icon-lg\" tem 44 px sempre. Todo botão tem 44 px de altura no celular (abaixo de 640 px) e em telas de toque.")}</p>
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline">{t("Outline", "Contorno")}</Button>
              <Button>{t("Filled", "Preenchida")}</Button>
              <Button size="icon" variant="outline" aria-label={t("Edit", "Editar")}><Edit3 aria-hidden /></Button>
              <Button size="icon-lg" variant="ghost" aria-label={t("More options", "Mais opções")}><MoreHorizontal aria-hidden /></Button>
              </div>
              <p className="text-label font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Exception: forma=\"quadrado\"", "Exceção: forma=\"quadrado\"")}</p>
              <div className="flex flex-wrap items-center gap-3">
              <Button forma="quadrado" variant="outline">{t("Outline", "Contorno")}</Button>
              <Button forma="quadrado">{t("Filled", "Preenchida")}</Button>
              </div>
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
              <Campo rotulo={t("Default Input", "Campo padrão")} placeholder={t("Enter text...", "Digite um texto...")} />
              <Campo rotulo={t("With Icon", "Com ícone")} placeholder={t("Search anything...", "Busque qualquer coisa...")} icone={<Search />} />
              <Campo rotulo={t("Password", "Senha")} type="password" placeholder={t("Enter password...", "Digite a senha...")} />
              <Campo rotulo={t("With Hint", "Com dica")} placeholder={t("Enter your email...", "Digite seu e-mail...")} type="email" ajuda={t("We'll never share your email with anyone.", "Nunca compartilharemos seu e-mail com ninguém.")} />
              <Campo rotulo={t("Error State", "Estado de erro")} placeholder={t("Enter value...", "Digite um valor...")} erro={t("This field is required.", "Este campo é obrigatório.")} />
              <Campo rotulo={t("Disabled", "Desabilitado")} placeholder={t("Disabled input...", "Campo desabilitado...")} disabled />
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Password", "Senha")}>
          <div id="password" className="scroll-mt-32" />
          <ShowcaseCard>
            <p className="mb-5 text-body-sm leading-relaxed text-muted-foreground">
              {t("Password and confirmation fields, each with a show/hide button. Strength in four bars plus a text label, calculated from the requirements met. The hint list gives each requirement a green check as soon as it is met; the icon changes shape and screen readers hear \"met\", so colour is never the only signal. The confirmation shows whether the passwords match after the person types.", "Campos de senha e de confirmação, cada um com botão de exibir/ocultar. Força em quatro barras mais um rótulo em texto, calculada pelos requisitos atendidos. A lista de dicas dá um check verde a cada requisito assim que ele é atendido; o ícone muda de forma e o leitor de tela ouve \"atendido\", então a cor nunca é o único sinal. A confirmação mostra se as senhas coincidem depois que a pessoa digita.")}
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <p className="mb-3 text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("Try it: create and confirm", "Experimente: criar e confirmar")}</p>
                <PasswordConfirm senha={senha} confirmacao={confirmacao} onSenhaChange={setSenha} onConfirmacaoChange={setConfirmacao} regras={regrasPadrao.map((r) => ({ ...r, label: ({ tamanho: t("8 characters or more", "8 caracteres ou mais"), caixa: t("Upper and lower case", "Maiúsculas e minúsculas"), numero: t("At least one number", "Pelo menos um número"), simbolo: t("A special symbol", "Um símbolo especial") } as Record<string, string>)[r.id] }))} textos={{ senha: t("Password", "Senha"), confirmar: t("Confirm password", "Confirmar senha"), mostrar: t("Show password", "Mostrar senha"), ocultar: t("Hide password", "Ocultar senha"), forca: t("Password strength", "Força da senha"), niveis: ["—", t("Weak", "Fraca"), t("Fair", "Razoável"), t("Good", "Boa"), t("Strong", "Forte")], dicaTitulo: t("To create your password, use:", "Para criar sua senha, use:"), atendido: t("met", "atendido"), naoAtendido: t("not met", "não atendido"), naoCoincidem: t("Passwords do not match", "As senhas não coincidem"), coincidem: t("Passwords match", "As senhas coincidem") }} />
              </div>
              <div>
                <p className="mb-3 text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">{t("All requirements met (single field)", "Todos os requisitos atendidos (campo único)")}</p>
                <PasswordConfirm semConfirmacao senha={senhaUnica} confirmacao="" onSenhaChange={setSenhaUnica} onConfirmacaoChange={() => {}} regras={regrasPadrao.map((r) => ({ ...r, label: ({ tamanho: t("8 characters or more", "8 caracteres ou mais"), caixa: t("Upper and lower case", "Maiúsculas e minúsculas"), numero: t("At least one number", "Pelo menos um número"), simbolo: t("A special symbol", "Um símbolo especial") } as Record<string, string>)[r.id] }))} textos={{ senha: t("Password", "Senha"), confirmar: t("Confirm password", "Confirmar senha"), mostrar: t("Show password", "Mostrar senha"), ocultar: t("Hide password", "Ocultar senha"), forca: t("Password strength", "Força da senha"), niveis: ["—", t("Weak", "Fraca"), t("Fair", "Razoável"), t("Good", "Boa"), t("Strong", "Forte")], dicaTitulo: t("To create your password, use:", "Para criar sua senha, use:"), atendido: t("met", "atendido"), naoAtendido: t("not met", "não atendido"), naoCoincidem: t("Passwords do not match", "As senhas não coincidem"), coincidem: t("Passwords match", "As senhas coincidem") }} />
              </div>
            </div>
            <pre className="mt-6 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { PasswordConfirm } from "@/app/components/ui/password-field";

const [senha, setSenha] = useState("");
const [confirmacao, setConfirmacao] = useState("");

<PasswordConfirm
  senha={senha} onSenhaChange={setSenha}
  confirmacao={confirmacao} onConfirmacaoChange={setConfirmacao}
/>

// Campo único (troca de senha em etapas, por exemplo):
<PasswordConfirm semConfirmacao … />`}</code></pre>
            <ul className="mt-4 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
              <li>• {t("Requirements: 8+ characters, upper and lower case, a number, a special symbol. Override with the regras prop (id, label, test).", "Requisitos: 8 ou mais caracteres, maiúsculas e minúsculas, um número, um símbolo especial. Troque com a prop regras (id, label, test).")}</li>
              <li>• {t("Strength = requirements met (0–4): Weak, Fair, Good, Strong. Bars in the primary colour, label in text.", "Força = requisitos atendidos (0–4): Fraca, Razoável, Boa, Forte. Barras na cor primária, rótulo em texto.")}</li>
              <li>• {t("Show/hide: 36 px button inside the field, aria-pressed and \"Show/Hide password\" label; each field toggles on its own.", "Exibir/ocultar: botão de 36 px dentro do campo, aria-pressed e rótulo \"Mostrar/Ocultar senha\"; cada campo alterna sozinho.")}</li>
              <li>• {t("Accessibility: the field points to the strength and hints (aria-describedby); strength and match messages are announced (aria-live); autocomplete=\"new-password\".", "Acessibilidade: o campo aponta para a força e as dicas (aria-describedby); força e coincidência são anunciadas (aria-live); autocomplete=\"new-password\".")}</li>
            </ul>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Textarea">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="textarea-demo-1" className="text-body-sm font-medium text-foreground">{t("Message", "Mensagem")}</label>
                <Textarea id="textarea-demo-1" placeholder={t("Write your message here...", "Escreva sua mensagem aqui...")} rows={4} />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="textarea-demo-2" className="text-body-sm font-medium text-foreground">{t("Notes", "Notas")}</label>
                <Textarea id="textarea-demo-2" placeholder={t("Add notes...", "Adicione notas...")} rows={4} disabled />
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Select">
          <ShowcaseCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[t("Default Select", "Select padrão"), t("With Label", "Com rótulo")].map((lbl, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label htmlFor={`select-demo-${i}`} className="text-body-sm font-medium text-foreground">{lbl}</label>
                  <Select>
                    <SelectTrigger id={`select-demo-${i}`} className="w-full"><SelectValue placeholder={t("Select an option...", "Selecione uma opção...")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alfa">{t("Option Alpha", "Opção Alfa")}</SelectItem>
                      <SelectItem value="beta">{t("Option Beta", "Opção Beta")}</SelectItem>
                      <SelectItem value="gama">{t("Option Gamma", "Opção Gama")}</SelectItem>
                    </SelectContent>
                  </Select>
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
                <label key={id} className="flex items-center gap-2 cursor-pointer select-none group">
                  <Checkbox checked={state} onCheckedChange={setter} />
                  <span className="text-body text-foreground group-hover:text-foreground transition-colors">{label}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-40">
                <Checkbox disabled />
                <span className="text-body text-foreground">{t("Disabled", "Desabilitado")}</span>
              </label>
            </div>
          </ShowcaseCard>
        </SubSection>

        <SubSection title="Radio">
          <ShowcaseCard>
            <RadioGroup value={radio} onValueChange={setRadio} className="flex flex-wrap gap-6">
              {["a", "b", "c"].map((val) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer select-none">
                  <RadioGroupItem value={val} />
                  <span className="text-body text-foreground">{t("Option", "Opção")} {val.toUpperCase()}</span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-40">
                <RadioGroupItem value="d" disabled />
                <span className="text-body text-foreground">{t("Disabled", "Desabilitado")}</span>
              </label>
            </RadioGroup>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Segmented control", "Controle segmentado")}>
          <div id="segmented" className="scroll-mt-32" />
          <ShowcaseCard>
            <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
              {t("Coupled options that are tapped like buttons; exactly one is always selected. For short, exclusive choices with two to five options and one- or two-word labels: condition, period, view mode. For long lists use Select; for independent choices use Checkbox or Switch.", "Opções acopladas que se tocam como botões; sempre há exatamente uma selecionada. Para escolhas curtas e exclusivas, de duas a cinco opções com rótulos de uma ou duas palavras: condição, período, modo de exibição. Para listas longas use Select; para escolhas independentes use Checkbox ou Switch.")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("Item condition", "Condição do item")}</label>
                <SegmentedControl aria-label={t("Item condition", "Condição do item")} value={condicao} onValueChange={setCondicao} options={[{ value: "nova", label: t("New", "Nova") }, { value: "usada", label: t("Used", "Usada") }, { value: "tanto-faz", label: t("Either", "Tanto faz") }]} />
                <p className="text-label text-muted-foreground">{t("Selected: ", "Opção escolhida: ")}<span className="font-medium text-foreground">{condicao}</span></p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("Billing", "Cobrança")} <span className="text-muted-foreground font-normal">· variant="solida"</span></label>
                <SegmentedControl aria-label={t("Billing", "Cobrança")} variant="solida" options={[{ value: "mensal", label: t("Monthly", "Mensal") }, { value: "anual", label: t("Yearly", "Anual") }]} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("With icons", "Com ícones")}</label>
                <SegmentedControl aria-label={t("View mode", "Modo de exibição")} options={[{ value: "lista", label: t("List", "Lista"), icon: <List /> }, { value: "grade", label: t("Grid", "Grade"), icon: <LayoutGrid /> }, { value: "mapa", label: t("Map", "Mapa"), icon: <MapIcon /> }]} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("Full width", "Largura total")} <span className="text-muted-foreground font-normal">· fullWidth</span></label>
                <SegmentedControl aria-label={t("Period", "Período")} fullWidth options={[{ value: "pf", label: t("Individual", "Pessoa física") }, { value: "pj", label: t("Company", "Pessoa jurídica") }]} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("Sizes", "Tamanhos")}</label>
                <div className="flex flex-col items-start gap-3">
                  <SegmentedControl size="sm" aria-label={t("Period", "Período")} options={[{ value: "hoje", label: t("Today", "Hoje") }, { value: "semana", label: t("This week", "Esta semana") }, { value: "mes", label: t("This month", "Este mês") }]} />
                  <SegmentedControl size="md" aria-label={t("Period", "Período")} options={[{ value: "hoje", label: t("Today", "Hoje") }, { value: "semana", label: t("This week", "Esta semana") }, { value: "mes", label: t("This month", "Este mês") }]} />
                  <SegmentedControl size="lg" aria-label={t("Period", "Período")} options={[{ value: "hoje", label: t("Today", "Hoje") }, { value: "semana", label: t("This week", "Esta semana") }, { value: "mes", label: t("This month", "Este mês") }]} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-body-sm font-medium text-foreground">{t("Disabled option", "Opção desabilitada")}</label>
                <SegmentedControl aria-label={t("Delivery", "Entrega")} options={[{ value: "online", label: "Online" }, { value: "presencial", label: t("In person", "Presencial"), disabled: true }]} />
              </div>
            </div>
            <pre className="mt-5 whitespace-pre-wrap break-words rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { SegmentedControl } from "@/app/components/ui/segmented-control";

<SegmentedControl
  aria-label="Condição"
  value={condicao}
  onValueChange={setCondicao}
  options={[
    { value: "nova", label: "Nova" },
    { value: "usada", label: "Usada" },
    { value: "tanto-faz", label: "Tanto faz" },
  ]}
/>`}</code></pre>
            <ul className="mt-4 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
              <li>• {t("Props: options (value, label, icon, disabled), value, defaultValue, onValueChange, variant suave | solida, size sm | md | lg, fullWidth, aria-label.", "Props: options (value, label, icon, disabled), value, defaultValue, onValueChange, variant suave | solida, size sm | md | lg, fullWidth, aria-label.")}</li>
              <li>• {t("Keyboard: arrows move the selection, Tab enters and leaves the group. Minimum height 32 px (sm), 40 px (md) and 44 px (lg).", "Teclado: setas movem a seleção, Tab entra e sai do grupo. Altura mínima de 32 px (sm), 40 px (md) e 44 px (lg).")}</li>
              <li>• {t("The selection is never removed by tapping again: there is always one active option.", "A seleção nunca é removida ao tocar de novo: sempre há uma opção ativa.")}</li>
              <li>• {t("Always give the group a visible label or an aria-label.", "Dê sempre ao grupo um rótulo visível ou um aria-label.")}</li>
            </ul>
          </ShowcaseCard>
        </SubSection>

        <SubSection title={t("Switch / Toggle", "Switch / Toggle")}>
          <ShowcaseCard>
            <div className="flex flex-wrap gap-8">
              {[
                { id: "notifications", label: t("Notifications", "Notificações"), state: swA, setter: setSwA },
                { id: "dark", label: t("Dark mode", "Modo escuro"), state: swB, setter: setSwB },
              ].map(({ id, label, state, setter }) => (
                <div key={id} className="flex items-center gap-3">
                  <Switch id={`sw-${id}`} checked={state} onCheckedChange={setter} />
                  <label htmlFor={`sw-${id}`} className="text-body text-foreground cursor-pointer">{label}</label>
                </div>
              ))}
              <div className="flex items-center gap-3 opacity-40 cursor-not-allowed">
                <div className="h-6 w-11 rounded-full bg-switch-background" />
                <span className="text-body text-foreground">{t("Disabled", "Desabilitado")}</span>
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
                  className="w-full bg-card border border-border text-foreground placeholder:text-muted-foreground rounded-md pl-10 pr-4 py-3 text-body outline-none transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus:border-primary/60"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <kbd className="hidden sm:inline-flex items-center px-1 py-1 rounded-sm bg-muted text-muted-foreground text-caption font-medium border border-border">⌘K</kbd>
                </div>
              </div>
            </div>
          </ShowcaseCard>
        </SubSection>
      </section>

      {/* ── Tokens ── */}
      <section id="buttons-tokens" className="space-y-5">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold tracking-[-0.02em] text-foreground">Tokens</h2>
          <p className="text-body-sm text-muted-foreground mt-1">{t("CSS custom properties used by buttons and form controls.", "CSS custom properties usadas por botões e controles de formulário.")}</p>
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
      { name: "--input",            description: t("Outline of fields, outline buttons and chips. Owner's decision of 28/11/2026: 50% lighter than graphite 400 (2.0:1 on white, below the 3:1 adopted before; chosen knowingly)", "Contorno de campos, botões de contorno e chips. Decisão da dona do produto de 28/11/2026: 50% mais claro que o grafite 400 (2,0:1 no branco, abaixo dos 3:1 adotados antes; escolha consciente)"), light: "#B0B8C4",         dark: "var(--graphite-400)", isColor: true },
      { name: "--input-background", description: t("Input field background", "Fundo do campo de input"),      light: "#FFFFFF",             dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--input-fundo",      description: t("Field fill in the dark theme (the outline is --input)", "Preenchimento dos campos no tema escuro (o contorno é o --input; 28/11/2026)"), light: "#FFFFFF", dark: "rgba(19,26,39,0.60)", isColor: true },
      { name: "--ring",             description: t("Focus ring", "Anel de foco"),                  light: "rgba(212,77,77,0.35)",dark: "rgba(212,77,77,0.40)", isColor: true },
      { name: "--border",           description: t("Default border", "Borda padrão"),              light: "rgba(19,26,39,0.09)", dark: "rgba(255,255,255,0.07)", isColor: true },
      { name: "--border-strong",    description: t("Card border on hover (decorative, not for fields)", "Borda de card no hover (decorativa, não vale para campos)"),       light: "rgba(19,26,39,0.16)", dark: "rgba(255,255,255,0.12)", isColor: true },
      { name: "--foreground",       description: t("Input text", "Texto do input"),                  light: "#131A27",             dark: "#E4E9F0", isColor: true },
      { name: "--muted-foreground", description: t("Placeholder text", "Texto de placeholder"),            light: "#627288",             dark: "#8898B0", isColor: true },
    ],
  },
  {
    group: t("Shape", "Forma"),
    tokens: [
      { name: "--radius-sm", description: t("Small inputs / badges", "Inputs pequenos / badges"),     light: "calc(0.75rem - 4px)" },
      { name: "--radius-md", description: t("Text inputs (buttons are pills since 28/11/2026)", "Campos de texto (botões são pílula desde 28/11/2026)"),      light: "0.75rem" },
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

/* Peças de 28/11/2026 (shared/LacunasDocs): a mesma documentação nos dois design systems. */
export function FormShowcase() {
  return (
    <>
      <FormShowcaseBase />
      {(
        <div className="mt-20 space-y-20">
        <SecaoBotaoQuebra />
        </div>
      )}
    </>
  );
}
