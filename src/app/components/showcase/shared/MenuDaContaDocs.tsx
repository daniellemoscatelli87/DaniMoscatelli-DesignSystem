import React from "react";
import { LogOut, Settings } from "lucide-react";
import { useI18n } from "../../../i18n";
import { MenuDaConta, ItemDaConta } from "../../ui/menu-da-conta";
import { DoDont } from "./Guidance";

/**
 * Documentação do MenuDaConta (28/11/2026): o menu do perfil que abre do avatar no cabeçalho do painel.
 * O mesmo arquivo nos dois DS (Dani Moscatelli e FindLook).
 */
export function MenuDaContaDocs() {
  const { t } = useI18n();
  const exemplos = [
    { titulo: t("Name and e-mail", "Nome e e-mail"), email: "ana@exemplo.com", nota: t("Short name and e-mail, the most common case.", "Nome e e-mail curtos, o caso mais comum.") },
    { titulo: t("Long e-mail", "E-mail longo"), email: "ana.oliveira.relacionamento.com.clientes@exemplo-de-empresa.com.br", nota: t("The menu grows up to 320 px; beyond that, the e-mail ends in an ellipsis and screen readers still read it all.", "O menu cresce até 320 px; passando disso, o e-mail termina em reticências e o leitor de tela lê o texto inteiro.") },
  ];
  return (
    <>
      <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
        {t(
          "The menu that opens from the avatar in the panel header. At the top, the person's name and e-mail as plain text; then a divider and the account actions, each with its icon. Sign out stays neutral, like the other actions.",
          "O menu que abre do avatar no cabeçalho do painel. No topo, o nome e o e-mail da pessoa, como texto; depois um divisor e as ações da conta, cada uma com seu ícone. O Sair fica neutro, como as outras ações.",
        )}
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {exemplos.map((ex) => (
          <div key={ex.email} className="flex min-w-0 flex-col gap-2">
            <p className="text-body-sm font-medium text-foreground">{ex.titulo}</p>
            <div className="flex items-center justify-end rounded-lg border border-border bg-card px-3 py-2">
              <MenuDaConta nome="Ana Oliveira" email={ex.email}>
                <ItemDaConta icone={<Settings />}>{t("Settings", "Configurações")}</ItemDaConta>
                <ItemDaConta icone={<LogOut />}>{t("Sign out", "Sair")}</ItemDaConta>
              </MenuDaConta>
            </div>
            <p className="text-label text-muted-foreground">{ex.nota}</p>
          </div>
        ))}
      </div>
      <pre className="mt-5 whitespace-pre-wrap [overflow-wrap:anywhere] rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { MenuDaConta, ItemDaConta, SeparadorDaConta } from "@/app/components/ui/menu-da-conta";

<MenuDaConta nome={perfil.nome} email={perfil.email} foto={perfil.foto}>
  <ItemDaConta icone={<Settings />} asChild>
    <a href="/configuracoes/">Configurações</a>
  </ItemDaConta>
  <ItemDaConta icone={<LogOut />} onSelect={sair}>Sair</ItemDaConta>
</MenuDaConta>`}</code></pre>
      <ul className="mt-4 mb-6 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
        <li>• {t("MenuDaConta props: nome (required), email, detalhe (another support line: role, store), foto, papel (next to the name in the trigger), rotuloDoGatilho, classeDoGatilho, gatilho (your own trigger), aberto and onAbertoChange, align (default end) and the other DropdownMenuContent props.", "Props do MenuDaConta: nome (obrigatório), email, detalhe (outra linha de apoio: papel, loja), foto, papel (ao lado do nome no gatilho), rotuloDoGatilho, classeDoGatilho, gatilho (um gatilho próprio), aberto e onAbertoChange, align (padrão end) e as outras props do DropdownMenuContent.")}</li>
        <li>• {t("ItemDaConta: icone (Lucide, 16 px, grey) and the DropdownMenuItem props (onSelect, disabled, asChild). With asChild, the icon goes inside the child link, such as the product's router link. SeparadorDaConta divides groups of actions.", "ItemDaConta: icone (Lucide, 16 px, cinza) e as props do DropdownMenuItem (onSelect, disabled, asChild). Com asChild, o ícone entra dentro do link filho, como o link do roteador do produto. SeparadorDaConta divide grupos de ações.")}</li>
        <li>• {t("Name and e-mail are text, never a link: no underline, no link colour, nothing happens on tap. On the iPhone, Safari turns e-mails, phone numbers and addresses into links by itself; the header cancels those links (inherited colour, no underline, no tap).", "Nome e e-mail são texto, nunca link: sem sublinhado, sem cor de link, nada acontece ao tocar. No iPhone, o Safari transforma e-mails, telefones e endereços em links sozinho; o cabeçalho anula esses links (cor herdada, sem sublinhado, sem toque).")}</li>
        <li>• {t("Every page that uses the menu should also have, in <head>: <meta name=\"format-detection\" content=\"telephone=no, email=no, address=no, date=no\">. This site already has it.", "Toda página que usa o menu deve ter também, no <head>: <meta name=\"format-detection\" content=\"telephone=no, email=no, address=no, date=no\">. Este site já tem.")}</li>
        <li>• {t("Focus: after a tap or click, the trigger is not left marked; with the keyboard (Enter or Space to open, Esc to close), focus returns with the ring.", "Foco: depois de tocar, o gatilho não fica marcado; pelo teclado (Enter ou Espaço para abrir, Esc para fechar), o foco volta com o anel.")}</li>
        <li>• {t("The iPhone's automatic links can't be reproduced in a desktop browser: the protection was checked in the code and in Chrome, not on an iPhone.", "Os links automáticos do iPhone não aparecem no navegador do computador: a proteção foi conferida no código e no Chrome, não num iPhone.")}</li>
      </ul>
      <DoDont
        dos={[
          t("Use it for the account menu in the panel header, always on the right.", "Use para o menu da conta no cabeçalho do painel, sempre à direita."),
          t("Put the account actions with a Lucide icon each: Settings (gear), Sign out (log-out).", "Coloque as ações da conta com um ícone Lucide cada: Configurações (engrenagem), Sair (porta com seta)."),
          t("Add the format-detection meta tag to the page.", "Acrescente a meta format-detection na página."),
        ]}
        donts={[
          t("Don't make the name or the e-mail a link, a button or something to tap.", "Não transforme o nome ou o e-mail em link, botão ou algo para tocar."),
          t("Don't paint Sign out red: it is not a deletion.", "Não pinte o Sair de vermelho: não é uma exclusão."),
          t("Don't build an account menu by hand with DropdownMenuLabel in a product.", "Não monte um menu da conta à mão com DropdownMenuLabel no produto."),
        ]}
      />
    </>
  );
}
