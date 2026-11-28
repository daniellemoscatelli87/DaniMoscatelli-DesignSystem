import React from "react";
import { CircleCheck, Handshake, Users } from "lucide-react";
import { useI18n } from "../../../i18n";
import { SectionBlock, ShowcaseCard, CodeBlock } from "./SectionBlock";
import { Callout, DataTable, Mono } from "./Guidance";
import { GradeDeCards, ItemDaGrade } from "../../ui/grade-de-cards";
import { GrupoDeRedesSociais, LinkDeRedeSocial, htmlDoLinkDeRedeSocial, nomeDaRede, redesSociais } from "../../ui/link-de-rede-social";
import { GrupoDePilulasDeDestaque, PilulaDeDestaque } from "../../ui/pilula-de-destaque";
import { CardDeRedeSocial } from "../../ui/card-de-rede-social";
import { BotaoWhatsApp, htmlDoBotaoWhatsApp } from "../../ui/botao-whatsapp";

/* Documentação do LinkDeRedeSocial e da PilulaDeDestaque (28/11/2026, aprovados pela dona do produto): as pílulas
   "Me siga nas redes sociais" do hero e os destaques da seção de depoimentos da página inicial do site. */

const PERFIL = "https://www.linkedin.com/in/danimoscatelli/";
const EMPRESA = "https://www.linkedin.com/company/danimoscatellistudio/";
const INSTAGRAM = "https://www.instagram.com/danimoscatellistudio";

export function SecaoLinkDeRedeSocial() {
  const { t } = useI18n();
  return (
    <SectionBlock
      id="secoes-redes-sociais"
      titulo={t("Social media links", "Links de redes sociais")}
      quando={t(
        "The white pills of \"Follow me on social media\" on the home page: the network's icon in its official brand colour, the text and a soft shadow. Each one opens the profile in a new tab. In a group, centred and wrapping, as on the home page.",
        "As pílulas brancas de \"Me siga nas redes sociais\" da página inicial: o ícone da rede na cor oficial da marca, o texto e uma sombra suave. Cada uma abre o perfil em nova aba. Em grupo, centralizadas e quebrando em linhas, como na página inicial.",
      )}
      arquivo="ui/link-de-rede-social.tsx · styles/theme.css (.ds-link-rede-social)"
      nomes={["LinkDeRedeSocial", "GrupoDeRedesSociais", "IconeDeRedeSocial", "htmlDoLinkDeRedeSocial"]}
      api={`<p>Me siga nas redes sociais:</p>
<GrupoDeRedesSociais aria-label="Redes sociais">
  <LinkDeRedeSocial rede="linkedin" href="https://www.linkedin.com/in/…">Perfil Profissional</LinkDeRedeSocial>
  <LinkDeRedeSocial rede="linkedin" href="https://www.linkedin.com/company/…">Página da Empresa</LinkDeRedeSocial>
  <LinkDeRedeSocial rede="instagram" href="https://www.instagram.com/…">Instagram</LinkDeRedeSocial>
</GrupoDeRedesSociais>`}
      faca={[
        t("Write what the link opens (\"Professional profile\", \"Company page\") or the network's name.", "Escreva o que o link abre (\"Perfil Profissional\", \"Página da Empresa\") ou o nome da rede."),
        t("Keep the pills in a GrupoDeRedesSociais, centred under a short title, as on the home page.", "Deixe as pílulas num GrupoDeRedesSociais, centralizadas embaixo de um título curto, como na página inicial."),
        t("Use the official colour only on the icon; the text stays in --foreground.", "Use a cor oficial só no ícone; o texto fica em --foreground."),
      ]}
      naoFaca={[
        t("Don't use it for an action of the page (send, sign up): that is the Button.", "Não use para uma ação da página (enviar, cadastrar): isso é o Button."),
        t("Don't paint the text, the background or the border in the brand colour.", "Não pinte o texto, o fundo ou a borda na cor da marca."),
        t("Don't put the pill on a dark or photo background: it was drawn for light backgrounds.", "Não ponha a pílula em fundo escuro ou sobre foto: ela foi desenhada para fundo claro."),
      ]}
    >
      <ShowcaseCard rotulo={t("As on the home page (sm, the default)", "Como na página inicial (sm, o padrão)")}>
        <div data-demo="redes-inicio" className="flex flex-col items-center gap-3 py-4">
          <p className="m-0 text-center text-body font-semibold leading-relaxed text-foreground sm:text-subtitle">{t("Follow me on social media:", "Me siga nas redes sociais:")}</p>
          <GrupoDeRedesSociais aria-label={t("Social media", "Redes sociais")}>
            <LinkDeRedeSocial rede="linkedin" href={PERFIL}>{t("Professional Profile", "Perfil Profissional")}</LinkDeRedeSocial>
            <LinkDeRedeSocial rede="linkedin" href={EMPRESA}>{t("Company Page", "Página da Empresa")}</LinkDeRedeSocial>
            <LinkDeRedeSocial rede="instagram" href={INSTAGRAM}>Instagram</LinkDeRedeSocial>
          </GrupoDeRedesSociais>
        </div>
      </ShowcaseCard>
      <GradeDeCards className="gap-4 md:grid-cols-2">
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Every network (sm)", "Todas as redes (sm)")}>
            <GrupoDeRedesSociais aria-label={t("Networks, small size", "Redes, tamanho pequeno")}>
              {redesSociais.map(r => <LinkDeRedeSocial key={r} rede={r} href="#secoes-redes-sociais">{nomeDaRede(r)}</LinkDeRedeSocial>)}
            </GrupoDeRedesSociais>
          </ShowcaseCard>
        </ItemDaGrade>
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Every network (md)", "Todas as redes (md)")}>
            <GrupoDeRedesSociais aria-label={t("Networks, medium size", "Redes, tamanho médio")}>
              {redesSociais.map(r => <LinkDeRedeSocial key={r} rede={r} tamanho="md" href="#secoes-redes-sociais">{nomeDaRede(r)}</LinkDeRedeSocial>)}
            </GrupoDeRedesSociais>
          </ShowcaseCard>
        </ItemDaGrade>
      </GradeDeCards>
      <DataTable
        head={[t("Prop", "Prop"), t("What it does", "O que faz")]}
        rows={[
          [<Mono>rede</Mono>, t("linkedin · instagram · whatsapp · facebook · youtube · tiktok · behance: picks the icon and its official colour.", "linkedin · instagram · whatsapp · facebook · youtube · tiktok · behance: escolhe o ícone e a cor oficial.")],
          [<Mono>href · children</Mono>, t("The profile's address and the pill's text.", "O endereço do perfil e o texto da pílula.")],
          [<Mono>tamanho</Mono>, t("sm (default, the reference): 32 px, 12 px text, 14 px icon. md: 40 px, 14 px text, 16 px icon. On touch screens the touch area is 44 px tall without changing the drawing.", "sm (padrão, a referência): 32 px, texto de 12 px, ícone de 14 px. md: 40 px, texto de 14 px, ícone de 16 px. No toque, a área de toque tem 44 px de altura sem mudar o desenho.")],
          [<Mono>novaAba</Mono>, t("Opens in a new tab. Default: yes for an external link (http or https), with \"(abre em nova aba)\" read only by screen readers.", "Abre em nova aba. Padrão: sim para link externo (http ou https), com \"(abre em nova aba)\" lido só pelos leitores de tela.")],
          [<Mono>GrupoDeRedesSociais</Mono>, t("The list (ul/li): centred and wrapping, 12 px apart. alinhamento=\"inicio\" aligns it to the left.", "A lista (ul/li): centralizada e quebrando em linhas, 12 px entre as pílulas. alinhamento=\"inicio\" alinha à esquerda.")],
        ]}
      />
      <div className="space-y-2">
        <h3 className="text-body-sm font-semibold text-foreground">{t("In plain HTML pages (the same classes)", "Em páginas de HTML puro (as mesmas classes)")}</h3>
        <p className="m-0 text-body-sm text-muted-foreground">
          {t(
            "The drawing lives in the classes of theme.css (block \"@ds-css-puro\"); the React component only applies them. A page without React uses the same classes and needs the DS tokens on the page. The ready HTML comes from htmlDoLinkDeRedeSocial:",
            "O desenho mora nas classes do theme.css (bloco \"@ds-css-puro\"); o componente em React só as aplica. Uma página sem React usa as mesmas classes e precisa dos tokens do DS na página. O HTML pronto sai de htmlDoLinkDeRedeSocial:",
          )}
        </p>
        <CodeBlock>{`<ul class="ds-grupo-redes-sociais" aria-label="Redes sociais">
  <li>${htmlDoLinkDeRedeSocial({ rede: "instagram", href: INSTAGRAM, texto: "Instagram" })}</li>
</ul>`}</CodeBlock>
        <DataTable
          head={[t("Class", "Classe"), t("What it does", "O que faz")]}
          rows={[
            [<Mono>.ds-link-rede-social</Mono>, t("The pill (sm).", "A pílula (sm).")],
            [<Mono>.ds-link-rede-social--md</Mono>, t("Medium size.", "Tamanho médio.")],
            [<Mono>.ds-link-rede-social--linkedin … --behance</Mono>, t("The network: sets the icon's colour (--marca-*).", "A rede: dá a cor do ícone (--marca-*).")],
            [<Mono>.ds-link-rede-social__icone</Mono>, t("The brand's svg (aria-hidden).", "O svg da marca (aria-hidden).")],
            [<Mono>.ds-grupo-redes-sociais (--inicio)</Mono>, t("The list, centred (or aligned to the left).", "A lista, centralizada (ou alinhada à esquerda).")],
            [<Mono>.ds-so-leitor</Mono>, t("Text only for screen readers (\" (abre em nova aba)\").", "Texto só para leitores de tela (\" (abre em nova aba)\").")],
          ]}
        />
      </div>
      <Callout title={t("Exceptions recorded", "Exceções registradas")}>
        {t(
          "Brand colours (product owner, 19/11 and 28/11/2026): each icon keeps its network's official colour (--marca-linkedin #0A66C2, --marca-instagram #E1306C, --marca-whatsapp #25D366, --marca-facebook #1877F2, --marca-youtube #FF0000, --marca-tiktok black, white in dark mode, --marca-behance #1769FF), only on the icon. Shadow: the pill is a link, not a card, so the rule \"cards without a resting shadow\" does not apply; it keeps the soft shadow of the original site (--shadow-suave). Hover is grey (--accent), as in every DS state.",
          "Cores das marcas (dona do produto, 19/11 e 28/11/2026): cada ícone mantém a cor oficial da rede (--marca-linkedin #0A66C2, --marca-instagram #E1306C, --marca-whatsapp #25D366, --marca-facebook #1877F2, --marca-youtube #FF0000, --marca-tiktok preto, branco no escuro, --marca-behance #1769FF), só no ícone. Sombra: a pílula é um link, não um card, então a regra \"card sem sombra parada\" não vale para ela; fica a sombra suave do site original (--shadow-suave). O hover é cinza (--accent), como todo estado do DS.",
        )}
      </Callout>
    </SectionBlock>
  );
}

export function SecaoPilulaDeDestaque() {
  const { t } = useI18n();
  return (
    <SectionBlock
      id="secoes-pilulas-destaque"
      titulo={t("Highlight pills", "Pílulas de destaque")}
      quando={t(
        "Short highlights that are not clickable, such as the ones above the testimonials on the home page: very light grey background, thin border, text in --foreground and a Lucide icon in the brand red, 18 px in all of them. A list, centred and wrapping.",
        "Destaques curtos que não são clicáveis, como os de cima dos depoimentos da página inicial: fundo cinza bem claro, borda fina, texto em --foreground e um ícone Lucide no vermelho da marca, de 18 px em todas. Uma lista, centralizada e quebrando em linhas.",
      )}
      arquivo="ui/pilula-de-destaque.tsx · styles/theme.css (.ds-pilula-destaque)"
      nomes={["PilulaDeDestaque", "GrupoDePilulasDeDestaque", "htmlDaPilulaDeDestaque"]}
      api={`import { CircleCheck, Handshake, Users } from "lucide-react";

<GrupoDePilulasDeDestaque aria-label="Destaques">
  <PilulaDeDestaque icone={CircleCheck}>35 recomendações</PilulaDeDestaque>
  <PilulaDeDestaque icone={Handshake}>Excelência e compromisso</PilulaDeDestaque>
  <PilulaDeDestaque icone={Users}>Líderes, clientes & pares</PilulaDeDestaque>
</GrupoDePilulasDeDestaque>`}
      faca={[
        t("Two to four short highlights, each with its own Lucide icon.", "De dois a quatro destaques curtos, cada um com o seu ícone Lucide."),
        t("Only real numbers and facts.", "Só números e fatos reais."),
      ]}
      naoFaca={[
        t("Don't make it a link or a button: it has no hover and no click.", "Não transforme em link ou botão: ela não tem hover nem clique."),
        t("Don't use it for a status (pending, active): that is the ChipDeEstado.", "Não use para um estado (pendente, ativo): isso é o ChipDeEstado."),
        t("Don't use emoji or star characters as the icon.", "Não use emoji ou o caractere de estrela como ícone."),
      ]}
    >
      <ShowcaseCard rotulo={t("As on the home page", "Como na página inicial")}>
        <div data-demo="pilulas-inicio" className="py-4">
          <GrupoDePilulasDeDestaque aria-label={t("Highlights", "Destaques")}>
            <PilulaDeDestaque icone={CircleCheck}>{t("35 recommendations", "35 recomendações")}</PilulaDeDestaque>
            <PilulaDeDestaque icone={Handshake}>{t("Excellence and commitment", "Excelência e compromisso")}</PilulaDeDestaque>
            <PilulaDeDestaque icone={Users}>{t("Leaders, clients & peers", "Líderes, clientes & pares")}</PilulaDeDestaque>
          </GrupoDePilulasDeDestaque>
        </div>
      </ShowcaseCard>
      <DataTable
        head={[t("Prop or class", "Prop ou classe"), t("What it does", "O que faz")]}
        rows={[
          [<Mono>icone</Mono>, t("A Lucide icon as a component (icone={Users}): 18 px, --primary-text, aria-hidden.", "Um ícone Lucide como componente (icone={Users}): 18 px, --primary-text, aria-hidden.")],
          [<Mono>children</Mono>, t("The highlight's text: 12 px on phones, 14 px from 768 px.", "O texto do destaque: 12 px no celular, 14 px a partir de 768 px.")],
          [<Mono>GrupoDePilulasDeDestaque</Mono>, t("The list (ul); each pill is an li. alinhamento=\"inicio\" aligns it to the left.", "A lista (ul); cada pílula é um li. alinhamento=\"inicio\" alinha à esquerda.")],
          [<Mono>.ds-grupo-pilulas-destaque · .ds-pilula-destaque · .ds-pilula-destaque__icone</Mono>, t("The same drawing in plain HTML pages (theme.css, block \"@ds-css-puro\"); ready HTML from htmlDaPilulaDeDestaque.", "O mesmo desenho nas páginas de HTML puro (theme.css, bloco \"@ds-css-puro\"); HTML pronto em htmlDaPilulaDeDestaque.")],
        ]}
      />
      <CodeBlock>{`<ul class="ds-grupo-pilulas-destaque" aria-label="Destaques">
  <li class="ds-pilula-destaque"><svg class="ds-pilula-destaque__icone" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">…</svg><span>35 recomendações</span></li>
</ul>`}</CodeBlock>
    </SectionBlock>
  );
}

export function SecaoCardDeRedeSocial() {
  const { t } = useI18n();
  return (
    <SectionBlock
      id="secoes-card-rede-social"
      titulo={t("Social network card", "Card de rede social")}
      quando={t(
        "An invitation to see everything on a social network, such as \"See all 35 recommendations in full\" under the testimonials on the home page: verified badge, title, text and the pill button that opens the network. Only in this DS. It follows the DS card standard: border only, 24 px corners and padding, icon on a 44 px base, 16 px from the icon to the title, 4 px to the text; card with an action: divider and the button, full width on phones and in the bottom-right corner from 640 px (owner's rule, 28/11/2026). Vertical on phones; horizontal from 640 px (icon on the left, footer across the whole card).",
        "Um convite para ver tudo numa rede social, como \"Veja todas as 35 recomendações na íntegra\" embaixo dos depoimentos da página inicial: selo de verificado, título, texto e o botão em pílula que abre a rede. Só neste DS. Segue o padrão dos cards do DS: só borda, cantos e respiro de 24 px, ícone numa base de 44 px, 16 px do ícone ao título, 4 px até o texto; card com ação: divisor e o botão, na largura inteira no celular e no canto inferior direito a partir de 640 px (regra da dona do produto, 28/11/2026). Vertical no celular; horizontal a partir de 640 px (ícone à esquerda, rodapé na largura inteira do card).",
      )}
      arquivo="ui/card-de-rede-social.tsx · styles/theme.css (.ds-card-rede-social)"
      nomes={["CardDeRedeSocial", "htmlDoCardDeRedeSocial"]}
      api={`<CardDeRedeSocial
  rede="linkedin"
  titulo="Veja todas as 35 recomendações na íntegra"
  descricao="Todas as avaliações acima são verificáveis e foram registradas…"
  href="https://www.linkedin.com/in/…"
  rotuloDoBotao="Acessar Recomendações no LinkedIn"
/>`}
      faca={[
        t("One card per section, after the content it points to (the testimonials).", "Um card por seção, depois do conteúdo a que ele se refere (os depoimentos)."),
        t("Say in the button where it leads (\"…on LinkedIn\").", "Diga no botão para onde ele leva (\"…no LinkedIn\")."),
      ]}
      naoFaca={[
        t("Don't add a resting shadow: border only, like every DS card.", "Não ponha sombra parada: só borda, como todo card do DS."),
        t("Don't paint the button in a brand colour where white text stays below 4.5:1: it falls back to the DS primary.", "Não pinte o botão na cor de uma marca em que o texto branco fica abaixo de 4,5:1: ele volta para a primária do DS."),
      ]}
    >
      <div data-demo="card-rede-social">
        <CardDeRedeSocial
          titulo={t("See all 35 recommendations in full", "Veja todas as 35 recomendações na íntegra")}
          descricao={t("All the reviews above are verifiable and were recorded by professionals and clients directly on Dani Moscatelli's LinkedIn profile.", "Todas as avaliações acima são verificáveis e foram registradas por profissionais e clientes diretamente no perfil da Dani Moscatelli no LinkedIn.")}
          href={PERFIL}
          rotuloDoBotao={t("Open recommendations on LinkedIn", "Acessar Recomendações no LinkedIn")}
        />
      </div>
      <DataTable
        head={[t("Prop or class", "Prop ou classe"), t("What it does", "O que faz")]}
        rows={[
          [<Mono>titulo · descricao</Mono>, t("The title (20 px, bold, h3 by default; nivel changes it) and the text (14 px, grey).", "O título (20 px, negrito, h3 por padrão; nivel muda) e o texto (14 px, cinza).")],
          [<Mono>href · rotuloDoBotao</Mono>, t("Where the button leads and its text. External link: new tab, with \"(abre em nova aba)\" for screen readers.", "Para onde o botão leva e o texto dele. Link externo: nova aba, com \"(abre em nova aba)\" para leitores de tela.")],
          [<Mono>rede</Mono>, t("linkedin (default) or another network of LinkDeRedeSocial: badge colour and button icon. The button takes the network colour only on LinkedIn (white text 5.7:1); otherwise the DS primary.", "linkedin (padrão) ou outra rede do LinkDeRedeSocial: cor do selo e ícone do botão. O botão fica na cor da rede só no LinkedIn (texto branco 5,7:1); nas outras, a primária do DS.")],
          [<Mono>.ds-card-rede-social (--linkedin …) · __icone · __texto · __titulo · __descricao · __rodape · __botao · __rotulo · __marca</Mono>, t("The same drawing in plain HTML pages (theme.css, block \"@ds-css-puro\"); ready HTML from htmlDoCardDeRedeSocial.", "O mesmo desenho nas páginas de HTML puro (theme.css, bloco \"@ds-css-puro\"); HTML pronto em htmlDoCardDeRedeSocial.")],
        ]}
      />
      <Callout title={t("Why one card for any network", "Por que um card para qualquer rede")}>
        {t(
          "CardDeRedeSocial with rede=\"linkedin\" by default, instead of a LinkedIn-only \"recommendations\" card: the same drawing serves \"see all the reviews\" on another network, without a new card. Badge: the DS BadgeCheck icon in the network colour, on a base with 10% of it (brand exception, like the other social pieces).",
          "CardDeRedeSocial com rede=\"linkedin\" por padrão, em vez de um card de \"recomendações\" só do LinkedIn: o mesmo desenho serve para \"veja todas as avaliações\" em outra rede, sem um card novo. Selo: o ícone BadgeCheck do DS na cor da rede, sobre uma base com 10% dela (exceção das marcas, como as outras peças de redes sociais).",
        )}
      </Callout>
    </SectionBlock>
  );
}

export function SecaoBotaoWhatsApp() {
  const { t } = useI18n();
  return (
    <SectionBlock
      id="secoes-botao-whatsapp"
      titulo={t("WhatsApp button", "Botão do WhatsApp")}
      quando={t(
        "The floating WhatsApp button of every site page: a 56 px circle in the official WhatsApp green with a white icon, at the bottom right, that opens the chat in a new tab with a ready message. Same component and API in both DS. On the site it appears with the floating elements (Site patterns › Floating elements).",
        "O botão flutuante do WhatsApp de todas as páginas do site: um círculo de 56 px no verde oficial do WhatsApp com o ícone branco, no canto inferior direito, que abre a conversa em nova aba com uma mensagem pronta. Mesmo componente e API nos dois DS. No site, aparece junto dos elementos flutuantes (Padrões do site › Elementos flutuantes).",
      )}
      arquivo="ui/botao-whatsapp.tsx · styles/theme.css (.ds-botao-whatsapp)"
      nomes={["BotaoWhatsApp", "IconeWhatsApp", "linkWhatsApp", "htmlDoBotaoWhatsApp"]}
      api={`<BotaoWhatsApp />   {/* número e mensagem padrão do estúdio */}
<BotaoWhatsApp numero="55…" mensagem="Olá! …" rotulo="Conversar com a Dani no WhatsApp" />
<footer className="ds-espaco-botao-whatsapp">…</footer>   {/* o fim da página nunca fica embaixo do botão */}`}
      faca={[
        t("One button per page, always in the same corner.", "Um botão por página, sempre no mesmo canto."),
        t("Give the last block of the page (the footer) the class .ds-espaco-botao-whatsapp.", "Dê ao último bloco da página (o rodapé) a classe .ds-espaco-botao-whatsapp."),
        t("Write in rotulo who the person will talk to.", "Escreva em rotulo com quem a pessoa vai conversar."),
      ]}
      naoFaca={[
        t("Don't change the green or put text on the button.", "Não troque o verde nem ponha texto no botão."),
        t("Don't put another floating element in the same corner without the DS layers (45 for the button).", "Não ponha outro flutuante no mesmo canto fora das camadas do DS (45 para o botão)."),
      ]}
    >
      <ShowcaseCard rotulo={t("Inside a box (fixo={false}), as on a page", "Dentro de uma caixa (fixo={false}), como numa página")}>
        <div data-demo="botao-whatsapp" className="relative mx-auto h-56 max-w-[390px] overflow-hidden rounded-lg border border-border bg-background">
          <div aria-hidden className="space-y-3 p-4">
            <div className="h-4 w-2/3 rounded-full bg-graphite-200" />
            <div className="h-3 w-1/2 rounded-full bg-graphite-100" />
            <div className="h-20 rounded-md border border-border bg-card" />
          </div>
          <BotaoWhatsApp fixo={false} />
        </div>
      </ShowcaseCard>
      <DataTable
        head={[t("Prop or class", "Prop ou classe"), t("What it does", "O que faz")]}
        rows={[
          [<Mono>numero · mensagem</Mono>, t("Number with country and area code (digits only) and the ready message. Default: the studio's.", "Número com DDI e DDD (só dígitos) e a mensagem pronta. Padrão: os do estúdio.")],
          [<Mono>rotulo · titulo</Mono>, t("The name read by screen readers (\" (abre em nova aba)\" is added) and the tooltip.", "O nome lido pelos leitores de tela (com \" (abre em nova aba)\" no fim) e a dica do mouse.")],
          [<Mono>fixo</Mono>, t("true (default): fixed on the page, 20 px from the edge (24 px from 640 px) plus the device safe area, layer 45 (above the fixed bars, 43, and the other floating pieces, 44). false: inside a box.", "true (padrão): fixo na página, 20 px da borda (24 px a partir de 640 px) mais a área segura do aparelho, camada 45 (acima das faixas fixas, 43, e dos outros flutuantes, 44). false: dentro de uma caixa.")],
          [<Mono>.ds-botao-whatsapp (--na-caixa) · __icone · .ds-espaco-botao-whatsapp</Mono>, t("The same drawing in plain HTML pages (theme.css, block \"@ds-css-puro\"); ready HTML from htmlDoBotaoWhatsApp. The footer class leaves 96 px under the content.", "O mesmo desenho nas páginas de HTML puro (theme.css, bloco \"@ds-css-puro\"); HTML pronto em htmlDoBotaoWhatsApp. A classe do rodapé deixa 96 px embaixo do conteúdo.")],
        ]}
      />
      <CodeBlock>{htmlDoBotaoWhatsApp().replace(/<path d="[^"]+"/, '<path d="…"')}</CodeBlock>
      <Callout title={t("Accessibility and exception", "Acessibilidade e exceção")}>
        {t(
          "56 × 56 px target (above 44 px), name in rotulo, focus ring, grows 5% on hover and stays still with reduced motion. The WhatsApp green with the white icon is the product owner's exception (19/11/2026): the icon on the green is 2:1, below the 3:1 of graphic elements; the button's name is what screen readers read.",
          "Alvo de 56 × 56 px (acima de 44 px), nome em rotulo, anel de foco, cresce 5% no hover e fica parado com \"menos movimento\". O verde do WhatsApp com o ícone branco é exceção da dona do produto (19/11/2026): o ícone sobre o verde tem 2:1, abaixo dos 3:1 dos elementos gráficos; o nome do botão é o que os leitores de tela leem.",
        )}
      </Callout>
    </SectionBlock>
  );
}
