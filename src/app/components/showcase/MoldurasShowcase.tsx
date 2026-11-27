import React, { useRef, useState } from "react";
import { FolderOpen, Mail, Monitor, Plus, SearchX, Smartphone } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionBlock, ShowcaseCard } from "./shared/SectionBlock";
import { Callout } from "./shared/Guidance";
import { CabecalhoDoSite } from "../ui/cabecalho-do-site";
import { MolduraDeConta } from "../ui/moldura-de-conta";
import { EstadoVazio, EstadoFinal, PaginaDeErro } from "../ui/estado-vazio";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Logo } from "../ui/logo";
import { Button } from "../ui/button";
import { Campo } from "../ui/campo";
import { PasswordInput } from "../ui/password-field";
import { SegmentedControl } from "../ui/segmented-control";
import { RodapeSite } from "../ui/rodape-site";
import { GradeDeCards, ItemDaGrade } from "../ui/grade-de-cards";
import logoSobreClaro from "../../../imports/Logo-Horizontal-DarkMode.png";

/* Molduras e estados (27/11/2026): cabeçalho do site, rodapé, moldura das telas de conta, estados vazio/final/erro,
   alerta por tom e logo. */

function DemoCabecalho() {
  const { t } = useI18n();
  const [tela, setTela] = useState<"celular" | "computador">("celular");
  const [modelo, setModelo] = useState<"pilula" | "faixa">("pilula");
  const rolagem = useRef<HTMLDivElement>(null);
  const itens = [
    { id: "inicio", rotulo: "Home", href: "#molduras-cabecalho" },
    { id: "projeto", rotulo: "Projeto Piloto", href: "#molduras-cabecalho" },
    { id: "parceiros", rotulo: "Seja Parceiro", href: "#molduras-cabecalho" },
  ];
  return (
    <ShowcaseCard>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SegmentedControl
          size="lg"
          aria-label={t("Screen", "Tela")}
          value={tela}
          onValueChange={setTela}
          options={[
            { value: "celular", label: t("Phone", "Celular"), icon: <Smartphone aria-hidden /> },
            { value: "computador", label: t("Desktop", "Computador"), icon: <Monitor aria-hidden /> },
          ]}
        />
        {tela === "computador" && (
          <SegmentedControl
            size="lg"
            aria-label={t("Model", "Modelo")}
            value={modelo}
            onValueChange={setModelo}
            options={[{ value: "pilula", label: t("Pill", "Pílula") }, { value: "faixa", label: t("Strip", "Faixa") }]}
          />
        )}
      </div>
      <p className="mb-3 text-body-sm text-muted-foreground">{t("Scroll inside the box: the header hides when you scroll down and comes back when you scroll up.", "Role dentro da caixa: o cabeçalho some ao descer e volta ao subir.")}</p>
      <div className={`mx-auto overflow-hidden rounded-lg border border-border ${tela === "celular" ? "max-w-[390px]" : ""}`}>
        <div ref={rolagem} className="relative h-[26rem] overflow-y-auto bg-background">
          <CabecalhoDoSite
            itens={itens}
            atual="projeto"
            modelo={modelo}
            tela={tela}
            raiz={rolagem}
            acao={{ rotulo: "Contato", icone: <Mail aria-hidden /> }}
          />
          <div aria-hidden className="space-y-6 px-6 pb-12 pt-10">
            <div className="h-6 w-2/3 rounded-full bg-graphite-200" />
            <div className="h-4 w-1/2 rounded-full bg-graphite-100" />
            {[0, 1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-lg border border-border bg-card" />)}
          </div>
        </div>
      </div>
    </ShowcaseCard>
  );
}

function DemoConta() {
  const { t } = useI18n();
  const [senha, setSenha] = useState("");
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <MolduraDeConta
        telaCheia={false}
        selo={t("Restricted area", "Área restrita")}
        titulo={t("Sign in", "Entrar")}
        descricao={t("Use your administrator e-mail and password.", "Use o e-mail e a senha de administrador.")}
        inicioHref="#molduras-conta"
        rodape={<Button variant="link" className="h-11 px-0">{t("I forgot my password", "Esqueci minha senha")}</Button>}
      >
        <form className="grid gap-4" onSubmit={e => e.preventDefault()}>
          <Campo rotulo={t("E-mail", "E-mail")} type="email" autoComplete="username" placeholder="nome@exemplo.com" />
          <PasswordInput label={t("Password", "Senha")} value={senha} onValueChange={setSenha} textos={{ mostrar: t("Show password", "Mostrar senha"), ocultar: t("Hide password", "Ocultar senha") }} />
          <Button type="submit" size="lg" className="w-full">{t("Sign in", "Entrar")}</Button>
        </form>
      </MolduraDeConta>
    </div>
  );
}

export function MoldurasShowcase() {
  const { t } = useI18n();
  return (
    <div className="space-y-20">
      <SectionBlock
        id="molduras-cabecalho"
        titulo={t("Site header", "Cabeçalho do site")}
        quando={t(
          "The header of every page of the studio site: logo, the pages, one action (Contact) and, on phones, the menu in a bottom sheet. It hides when scrolling down and comes back when scrolling up.",
          "O cabeçalho de todas as páginas do site do estúdio: logo, as páginas, uma ação (Contato) e, no celular, o menu numa folha que sobe de baixo. Some ao rolar para baixo e volta ao rolar para cima.",
        )}
        arquivo="ui/cabecalho-do-site.tsx"
        nomes={["CabecalhoDoSite"]}
        api={`<CabecalhoDoSite
  itens={[{ id: "inicio", rotulo: "Home", href: "/" }, { id: "projeto", rotulo: "Projeto Piloto", href: "/projeto-piloto/" }]}
  atual="projeto"
  acao={{ rotulo: "Contato", onClick: abrirContato, icone: <Mail /> }}
  modelo="pilula"            // ou "faixa"
  superficie="clara"         // "escura" sobre foto no topo
/>`}
        faca={[
          t("Mark the current page (aria-current): underline and colour, never colour alone.", "Marque a página atual (aria-current): sublinhado e cor, nunca só cor."),
          t("Keep one action in the header; the rest goes in the page.", "Mantenha uma ação só no cabeçalho; o resto fica na página."),
        ]}
        naoFaca={[
          t("Don't build the header by hand in each page.", "Não monte o cabeçalho à mão em cada página."),
          t("Don't put more than 5 links: the phone sheet gets long.", "Não ponha mais de 5 links: a folha do celular fica longa."),
        ]}
      >
        <DemoCabecalho />
      </SectionBlock>

      <SectionBlock
        id="molduras-rodape"
        titulo={t("Site footer", "Rodapé do site")}
        quando={t(
          "The footer is already a DS component (RodapeSite) with the same content and variants as the site (light, dark and compact). The site should switch to it: same links, same copyright line, same credit.",
          "O rodapé já é um componente do DS (RodapeSite), com o mesmo conteúdo e as mesmas variantes do site (claro, escuro e compacto). O site deve trocar o dele por este: mesmos links, mesma linha de direitos, mesmo crédito.",
        )}
        arquivo="ui/rodape-site.tsx"
        nomes={["RodapeSite"]}
        api={`<RodapeSite variante="claro" logo="/logo-dm.png" onPreferenciasCookies={abrirAvisoCookies} />`}
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <RodapeSite variante="claro" logo={logoSobreClaro} />
        </div>
        <Callout title={t("Compared with the site (27/11/2026)", "Comparado com o site (27/11/2026)")}>
          {t(
            "Same links (Home, Projeto Piloto, Seja Parceiro, Privacy policy, Cookie preferences, Restricted area), same copyright, city and design system credit, same three variants. Nothing new was needed; the phone alignment of the links is being fixed with the other existing components.",
            "Mesmos links (Home, Projeto Piloto, Seja Parceiro, Política de privacidade, Preferências de cookies, Área restrita), mesmos direitos, cidade e crédito do design system, as mesmas três variantes. Nada novo foi preciso; o alinhamento dos links no celular está sendo corrigido junto com os outros componentes existentes.",
          )}
        </Callout>
      </SectionBlock>

      <SectionBlock
        id="molduras-conta"
        titulo={t("Account frame", "Moldura de conta")}
        quando={t(
          "Sign in, set or reset password, expired link, no access: one narrow card in the middle of the page with the logo, an optional seal, the title, a supporting sentence, the form and the links below.",
          "Entrar, criar ou redefinir senha, link expirado, sem acesso: um card estreito no meio da página com o logo, um selo opcional, o título, uma frase de apoio, o formulário e os links embaixo.",
        )}
        arquivo="ui/moldura-de-conta.tsx"
        nomes={["MolduraDeConta"]}
        api={`<MolduraDeConta selo="Área restrita" titulo="Entrar" descricao="Use o e-mail e a senha de administrador."
  rodape={<Button variant="link">Esqueci minha senha</Button>}>
  <form>…</form>
</MolduraDeConta>`}
        faca={[
          t("One primary button, full width, at the end of the form.", "Um botão primário, na largura toda, no fim do formulário."),
          t("Errors in an Alert with tom=\"erro\" inside the form.", "Erros num Alert com tom=\"erro\" dentro do formulário."),
        ]}
        naoFaca={[
          t("Don't centre the text: logo, title and fields share the left edge.", "Não centralize o texto: logo, título e campos dividem a borda esquerda."),
          t("Don't add menus or the site footer around it.", "Não ponha menu nem o rodapé do site em volta."),
        ]}
      >
        <DemoConta />
      </SectionBlock>

      <SectionBlock
        id="molduras-estados"
        titulo={t("Empty, final and error states", "Estados vazio, final e de erro")}
        quando={t(
          "EstadoVazio when a list has nothing yet (or a filter emptied it); EstadoFinal at the end of a flow (sign-up sent, survey done); PaginaDeErro for a whole page (404, no access).",
          "EstadoVazio quando uma lista ainda não tem nada (ou o filtro esvaziou); EstadoFinal no fim de um fluxo (cadastro enviado, pesquisa concluída); PaginaDeErro para uma página inteira (404, sem acesso).",
        )}
        arquivo="ui/estado-vazio.tsx"
        nomes={["EstadoVazio", "EstadoFinal", "PaginaDeErro"]}
        api={`<EstadoVazio icone={<FolderOpen />} titulo="Nenhum comunicado ainda" descricao="…" acoes={<Button>Escrever comunicado</Button>} />
<EstadoFinal tom="sucesso" titulo="Cadastro enviado" descricao="…" acoes={<Button asChild><a href="/">Voltar ao início</a></Button>} />
<PaginaDeErro codigo="404" titulo="Página não encontrada" acoes={<Button asChild><a href="/">Voltar ao início</a></Button>} />`}
        faca={[
          t("Say why it is empty and what to do next, in one sentence.", "Diga por que está vazio e o que fazer, numa frase."),
          t("Use tom=\"marca\" only when the empty state invites to start.", "Use tom=\"marca\" só quando o vazio convida a começar."),
        ]}
        naoFaca={[
          t("Don't show an empty table with only the header.", "Não mostre uma tabela vazia só com o cabeçalho."),
          t("Don't use the error page for a field error: that goes next to the field.", "Não use a página de erro para erro de campo: ele fica junto do campo."),
        ]}
      >
        <GradeDeCards className="md:grid-cols-2 gap-4">
          <ItemDaGrade>
            <ShowcaseCard className="h-full" rotulo={t("Empty · neutral", "Vazio · neutro")}>
              <EstadoVazio
                tamanho="sm"
                nivel={3}
                icone={<SearchX />}
                titulo={t("No results for this filter", "Nenhum resultado para este filtro")}
                descricao={t("Try another status or clear the filters.", "Tente outro status ou limpe os filtros.")}
                acoes={<Button variant="outline">{t("Clear filters", "Limpar filtros")}</Button>}
              />
            </ShowcaseCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <ShowcaseCard className="h-full" rotulo={t("Empty · brand", "Vazio · marca")}>
              <EstadoVazio
                tamanho="sm"
                nivel={3}
                tom="marca"
                icone={<FolderOpen />}
                titulo={t("No announcements yet", "Nenhum comunicado ainda")}
                descricao={t("Announcements you write appear here, with who received them.", "Os comunicados que você escrever aparecem aqui, com quem recebeu.")}
                acoes={<Button><Plus aria-hidden />{t("Write announcement", "Escrever comunicado")}</Button>}
              />
            </ShowcaseCard>
          </ItemDaGrade>
        </GradeDeCards>
        <ShowcaseCard rotulo={t("Final state", "Estado final")}>
          <EstadoFinal
            focarAoAparecer={false}
            titulo={t("Sign-up sent", "Cadastro enviado")}
            descricao={t("We received your details. The studio replies by e-mail within 5 working days.", "Recebemos seus dados. O estúdio responde por e-mail em até 5 dias úteis.")}
            acoes={<><Button>{t("Back to home", "Voltar ao início")}</Button><Button variant="outline">{t("See the partner network", "Ver a Rede de Parceiros")}</Button></>}
          />
        </ShowcaseCard>
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <PaginaDeErro
            telaCheia={false}
            codigo="404"
            titulo={t("Page not found", "Página não encontrada")}
            descricao={t("The address may have changed. Go back home or use the menu.", "O endereço pode ter mudado. Volte ao início ou use o menu.")}
            acoes={<Button>{t("Back to home", "Voltar ao início")}</Button>}
          />
        </div>
      </SectionBlock>

      <SectionBlock
        id="molduras-alerta-tom"
        titulo={t("Alert by tone", "Alerta por tom")}
        quando={t(
          "The Alert gains the tom prop (neutro, info, sucesso, aviso, erro): the same alert, in Portuguese, with the state icon already in place. The same message always has the same sign.",
          "O Alert ganha a prop tom (neutro, info, sucesso, aviso, erro): o mesmo alerta, em português, com o ícone do estado já colocado. A mesma mensagem tem sempre o mesmo sinal.",
        )}
        arquivo="ui/alert.tsx"
        nomes={["Alert tom"]}
        api={`<Alert tom="erro"><AlertDescription>E-mail ou senha incorretos.</AlertDescription></Alert>`}
      >
        <div className="grid gap-3">
          <Alert tom="sucesso"><AlertDescription>{t("Done! If this e-mail has access, we sent a link to reset the password.", "Pronto! Se este e-mail tiver acesso, enviamos um link para redefinir a senha.")}</AlertDescription></Alert>
          <Alert tom="erro"><AlertDescription>{t("Wrong e-mail or password.", "E-mail ou senha incorretos.")}</AlertDescription></Alert>
          <Alert tom="aviso"><AlertTitle>{t("Link expired", "Link expirado")}</AlertTitle><AlertDescription>{t("Ask for a new link to set your password.", "Peça um novo link para definir sua senha.")}</AlertDescription></Alert>
          <Alert tom="info"><AlertDescription>{t("Open the link in this same browser.", "Abra o link neste mesmo navegador.")}</AlertDescription></Alert>
        </div>
      </SectionBlock>

      <SectionBlock
        id="molduras-logo"
        titulo={t("Logo", "Logo")}
        quando={t(
          "The official logo as a component (inline SVG): no image copies in products. Horizontal or symbol; light or dark surface, or auto by theme.",
          "O logo oficial como componente (SVG no código): nenhum produto precisa de cópia de imagem. Horizontal ou símbolo; superfície clara ou escura, ou automática pelo tema.",
        )}
        arquivo="ui/logo.tsx"
        nomes={["Logo"]}
        api={`<a href="/" aria-label="Página inicial"><Logo variante="horizontal" superficie="auto" className="h-11" /></a>
<Logo variante="simbolo" className="h-10" />`}
        faca={[t("Give the surrounding link a name; the logo itself stays decorative.", "Dê nome ao link em volta; o logo fica decorativo.")]}
        naoFaca={[t("Don't recolour, stretch or add shadows (Brand › Usage rules).", "Não recolorir, esticar nem pôr sombra (Marca › Regras de uso).")]}
      >
        <GradeDeCards className="md:grid-cols-2 gap-4">
          <ItemDaGrade>
            <ShowcaseCard className="flex h-full flex-wrap items-center gap-6" rotulo={t("Light surface", "Superfície clara")}>
              <Logo variante="horizontal" className="h-12" rotulo="Dani Moscatelli Experience Design Studio" />
              <Logo variante="simbolo" className="h-12" />
            </ShowcaseCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <div className="flex h-full flex-wrap items-center gap-6 rounded-xl border border-border bg-graphite-950 p-4 sm:p-6">
              <Logo variante="horizontal" superficie="escura" className="h-12" rotulo="Dani Moscatelli Experience Design Studio" />
              <Logo variante="simbolo" corDoSimbolo="branco" className="h-12" />
            </div>
          </ItemDaGrade>
        </GradeDeCards>
      </SectionBlock>
    </div>
  );
}
