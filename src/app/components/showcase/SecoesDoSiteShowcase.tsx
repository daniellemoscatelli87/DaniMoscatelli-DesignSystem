import React from "react";
import { BookOpen, Code2, Handshake, LayoutGrid, MessageCircle, PenTool, Search, Users } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionBlock, ShowcaseCard } from "./shared/SectionBlock";
import { CardDeDepoimento } from "../ui/card-de-depoimento";
import { CardDeArtigo } from "../ui/card-de-artigo";
import { FaixaDeLogos } from "../ui/faixa-de-logos";
import { Citacao } from "../ui/citacao";
import { ListaDePilares } from "../ui/lista-de-pilares";
import { CartaoFlutuante } from "../ui/cartao-flutuante";
import { Simulacao } from "../ui/simulacao";
import { LinkSaibaMais } from "../ui/link-saiba-mais";
import { Prosa } from "../ui/prosa";
import { LuzesDifusas } from "../ui/luzes-difusas";
import { BarraDeNumeros } from "../ui/barra-de-numeros";
import { CardDeNavegacao } from "../ui/card-de-navegacao";
import { Conversa, BalaoDaConversa, IndicadorDeDigitacao } from "../ui/conversa";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { Logo } from "../ui/logo";
import { GradeDeCards, ItemDaGrade } from "../ui/grade-de-cards";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { LinhaDeDado } from "../ui/cadastro-em-etapas";

/* Seções do site (27/11/2026): peças das páginas do site do estúdio. Todo o conteúdo é de exemplo. */

const BASE = import.meta.env.BASE_URL;
const FOTO = `${BASE}fotos/projeto-piloto-hero.webp`;

function logoDeExemplo(texto: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><rect width="160" height="40" rx="8" fill="#E4E9F0"/><text x="80" y="25" font-family="sans-serif" font-size="14" font-weight="700" text-anchor="middle" fill="#283043">${texto}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function SecoesDoSiteShowcase() {
  const { t } = useI18n();
  const depoimentos = [1, 2, 3, 4].map(i => ({
    nome: t(`Example person ${i}`, `Pessoa de exemplo ${i}`),
    cargo: t("Role at an example company", "Cargo numa empresa de exemplo"),
    foto: `${BASE}avatares/avatar-${i}.svg`,
    texto: t(
      "Example testimonial: on the site this text comes from the public recommendation, with permission from who wrote it.",
      "Depoimento de exemplo: no site, este texto vem da recomendação pública, com a autorização de quem escreveu.",
    ),
  }));
  return (
    <div className="space-y-20">
      <SectionBlock
        id="secoes-depoimentos"
        titulo={t("Testimonial card", "Card de depoimento")}
        quando={t(
          "Testimonials from clients and peers (home page, presentation pages): photo, name and role, the quote and, optionally, its origin. In a Carousel: one at a time on phones, two on tablets, three on desktop, all the same height.",
          "Depoimentos de clientes e pares (página inicial, páginas de apresentação): foto, nome e cargo, o depoimento e, se quiser, a origem. No Carousel: um por vez no celular, dois no tablet, três no computador, todos da mesma altura.",
        )}
        arquivo="ui/card-de-depoimento.tsx"
        nomes={["CardDeDepoimento"]}
        api={`<CardDeDepoimento nome="…" cargo="…" foto="/img/…webp" origem="Recomendação no LinkedIn">
  “Texto do depoimento com <strong>o trecho principal</strong>.”
</CardDeDepoimento>`}
        faca={[t("Only real testimonials, with permission.", "Só depoimentos reais, com autorização.")]}
        naoFaca={[t("Don't put a resting shadow on the cards: border only.", "Não ponha sombra parada nos cards: só borda.")]}
      >
        <Carousel opts={{ align: "start" }} className="px-0">
          <CarouselContent>
            {depoimentos.map(d => (
              <CarouselItem key={d.nome} className="basis-[88%] sm:basis-1/2 lg:basis-1/3">
                <CardDeDepoimento nome={d.nome} cargo={d.cargo} foto={d.foto} origem={t("Example origin", "Origem de exemplo")}>
                  “{d.texto} <strong>{t("Key passage in bold.", "Trecho principal em negrito.")}</strong>”
                </CardDeDepoimento>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-4 flex justify-center gap-3">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </SectionBlock>

      <SectionBlock
        id="secoes-artigos"
        titulo={t("Article card", "Card de artigo")}
        quando={t(
          "Articles and insights: photo, category and date, title, summary, reading time and “Read article” at the bottom right. One highlight per section, horizontal or vertical for the rest.",
          "Artigos e insights: foto, categoria e data, título, resumo, tempo de leitura e “Ler artigo” no canto inferior direito. Um destaque por seção; horizontal ou vertical para os outros.",
        )}
        arquivo="ui/card-de-artigo.tsx"
        nomes={["CardDeArtigo"]}
        api={`<CardDeArtigo formato="destaque" titulo="…" href="…" resumo="…" imagem="…" alt="…" categoria="Business design" data="01/09/2026" tempoDeLeitura="10 min de leitura" selo="Mais recente" novaAba />`}
      >
        <div className="grid gap-6">
          <CardDeArtigo formato="destaque" selo={t("Most recent", "Mais recente")} titulo={t("Example title of a highlighted article", "Título de exemplo de um artigo em destaque")} href="#secoes-artigos" imagem={FOTO} categoria="Business design" data="01/09/2026" tempoDeLeitura={t("10 min read", "10 min de leitura")} resumo={t("Example summary: one or two sentences that make people want to read the article.", "Resumo de exemplo: uma ou duas frases que dão vontade de ler o artigo.")} />
          <GradeDeCards className="md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <ItemDaGrade key={i}>
                <CardDeArtigo formato="horizontal" titulo={t(`Example article ${i}`, `Artigo de exemplo ${i}`)} href="#secoes-artigos" imagem={FOTO} categoria={t("Service design", "Design de serviços")} data="03/07/26" tempoDeLeitura={t("8 min read", "8 min de leitura")} resumo={t("Short example summary.", "Resumo curto de exemplo.")} />
              </ItemDaGrade>
            ))}
          </GradeDeCards>
        </div>
      </SectionBlock>

      <SectionBlock
        id="secoes-logos"
        titulo={t("Logo strip", "Faixa de logos")}
        quando={t(
          "Companies served, partners, press: a strip that runs slowly, stops on hover and has a Pause button. With reduced motion it becomes a still grid.",
          "Empresas atendidas, parceiros, imprensa: uma faixa que corre devagar, para com o mouse em cima e tem o botão Pausar. Com menos movimento vira uma grade parada.",
        )}
        arquivo="ui/faixa-de-logos.tsx"
        nomes={["FaixaDeLogos"]}
        api={`<FaixaDeLogos rotulo="Empresas atendidas" logos={[{ nome: "Empresa", src: "/logos/empresa.svg" }]} />`}
      >
        <ShowcaseCard>
          <FaixaDeLogos rotulo={t("Example companies", "Empresas de exemplo")} logos={["Marca A", "Marca B", "Marca C", "Marca D", "Marca E", "Marca F"].map(n => ({ nome: n, src: logoDeExemplo(n) }))} />
        </ShowcaseCard>
      </SectionBlock>

      <SectionBlock
        id="secoes-citacao"
        titulo={t("Quote", "Citação")}
        quando={t(
          "A sentence from someone in the spotlight: “text” size inside running text (bar on the left), “highlight” size alone in a section.",
          "Uma frase de alguém em destaque: tamanho “texto” no meio do texto corrido (barra à esquerda), tamanho “destaque” sozinha numa seção.",
        )}
        arquivo="ui/citacao.tsx"
        nomes={["Citacao"]}
        api={`<Citacao autor="Nome" papel="Cargo">Frase dita pela pessoa.</Citacao>
<Citacao tamanho="destaque" autor="Nome" papel="Cargo">Frase em destaque.</Citacao>`}
      >
        <GradeDeCards className="md:grid-cols-2 gap-4">
          <ItemDaGrade>
            <ShowcaseCard className="h-full"><Citacao autor={t("Example person", "Pessoa de exemplo")} papel={t("Participant", "Participante")}>{t("Example quote in the middle of a text.", "Citação de exemplo no meio de um texto.")}</Citacao></ShowcaseCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <ShowcaseCard className="h-full"><Citacao tamanho="destaque" autor={t("Example person", "Pessoa de exemplo")} papel={t("Client", "Cliente")}>{t("An example sentence highlighted on its own.", "Uma frase de exemplo em destaque, sozinha.")}</Citacao></ShowcaseCard>
          </ItemDaGrade>
        </GradeDeCards>
      </SectionBlock>

      <SectionBlock
        id="secoes-pilares"
        titulo={t("Pillars", "Pilares")}
        quando={t(
          "Three to five ideas in sequence, each with an icon, a short title and a sentence (Contact · Relationship · Referral). Side by side with a line linking the icons; one under the other on phones.",
          "Três a cinco ideias em sequência, cada uma com ícone, título curto e uma frase (Contato · Relacionamento · Indicação). Lado a lado com uma linha que liga os ícones; um embaixo do outro no celular.",
        )}
        arquivo="ui/lista-de-pilares.tsx"
        nomes={["ListaDePilares"]}
        api={`<ListaDePilares rotulo="A força das conexões" pilares={[{ icone: <MessageCircle />, titulo: "Contato", texto: "…" }]} />`}
      >
        <ShowcaseCard>
          <ListaDePilares
            rotulo={t("The strength of connections", "A força das conexões")}
            pilares={[
              { icone: <MessageCircle />, titulo: t("Contact", "Contato"), texto: t("Every partnership starts with a conversation.", "Toda parceria começa com uma conversa.") },
              { icone: <Users />, titulo: t("Relationship", "Relacionamento"), texto: t("Trust grows project after project.", "A confiança cresce projeto a projeto.") },
              { icone: <Handshake />, titulo: t("Referral", "Indicação"), texto: t("The right talent arrives through people.", "O talento certo chega pelas pessoas.") },
            ]}
          />
        </ShowcaseCard>
      </SectionBlock>

      <SectionBlock
        id="secoes-flutuantes"
        titulo={t("Floating card and diffuse lights", "Cartão flutuante e luzes difusas")}
        quando={t(
          "CartaoFlutuante: small context cards over a hero photo, floating slowly. LuzesDifusas (from the FindLook DS): blurred brand lights behind a dark section or the hero photo. Both are decoration and stop with reduced motion.",
          "CartaoFlutuante: cartõezinhos de contexto sobre a foto do hero, flutuando devagar. LuzesDifusas (do DS da FindLook): luzes desfocadas da marca atrás de uma seção escura ou da foto do hero. Os dois são decoração e param com menos movimento.",
        )}
        arquivo="ui/cartao-flutuante.tsx · ui/luzes-difusas.tsx"
        nomes={["CartaoFlutuante", "LuzesDifusas"]}
        api={`<div className="relative isolate overflow-hidden">
  <LuzesDifusas variante="esquerda" />
  <img src="…" alt="" />
  <CartaoFlutuante className="absolute left-4 top-8" icone={<PenTool />} titulo="Design & UX" estado="Protótipo em validação" />
</div>`}
      >
        <div className="dark relative isolate grid min-h-[26rem] place-items-center overflow-hidden rounded-xl border border-border bg-graphite-950 p-6">
          <LuzesDifusas variante="esquerda" />
          <div className="relative w-full max-w-sm">
            <img src={FOTO} alt="" className="aspect-[4/5] w-full rounded-xl object-cover" />
            <CartaoFlutuante className="absolute -left-2 top-6 sm:-left-8" icone={<PenTool />} titulo="Design & UX" estado={t("Prototype in validation", "Protótipo em validação")} />
            <CartaoFlutuante className="absolute -right-2 top-1/2 sm:-right-8" atraso={0.6} tom="info" icone={<Search />} titulo={t("Research", "Pesquisa")} estado={t("User interviews", "Entrevistas com usuários")} />
            <CartaoFlutuante className="absolute bottom-6 left-4" atraso={1.2} tom="sucesso" icone={<Code2 />} titulo={t("Technology", "Tecnologia")} estado={t("Integration in progress", "Integração em andamento")} />
          </div>
        </div>
      </SectionBlock>

      <SectionBlock
        id="secoes-simulacao"
        titulo={t("Step simulation", "Simulação em etapas")}
        quando={t(
          "Tells a process in steps with an example screen that changes at each step (From connection to collaboration). Advances by itself while on screen, with Pause; arrows change the topic.",
          "Conta um processo em etapas com uma tela de exemplo que muda a cada etapa (Da conexão à colaboração). Avança sozinha enquanto está na tela, com Pausar; as setas trocam o tópico.",
        )}
        arquivo="ui/simulacao.tsx"
        nomes={["Simulacao"]}
        api={`<Simulacao intro="Como sua participação acontece" topoDaTela={<><Logo variante="simbolo" className="h-5" />Rede de Parceiros</>}
  topicos={[{ id: "1", titulo: "Faça parte da rede", descricao: "…", cena: <…/> }]} />`}
      >
        <Simulacao
          intro={t("How your participation happens", "Como sua participação acontece")}
          rotulo={t("Partner network demonstration", "Demonstração da Rede de Parceiros")}
          topoDaTela={<><Logo variante="simbolo" className="h-5" /><span className="text-body-sm font-semibold text-foreground">{t("Partner network", "Rede de Parceiros")}</span></>}
          topicos={[
            {
              id: "cadastro", titulo: t("Join the network", "Faça parte da rede"), descricao: t("Register your path, skills and areas.", "Cadastre sua trajetória, competências e áreas de atuação."),
              cena: (
                <div className="mx-auto grid max-w-sm gap-4 rounded-lg border border-border bg-card p-4">
                  <p className="text-body font-semibold text-foreground">{t("I want to be a partner", "Quero ser parceiro")}</p>
                  <dl className="grid gap-3"><LinhaDeDado rotulo={t("Full name", "Nome completo")} valor={t("Example person", "Pessoa de exemplo")} /><LinhaDeDado rotulo={t("Main specialty", "Especialidade principal")} valor="UX Research" /></dl>
                </div>
              ),
            },
            {
              id: "match", titulo: t("Finding opportunities", "Identificação de oportunidades"), descricao: t("AI helps match project challenges and profiles, curated by the studio.", "A IA apoia a análise de compatibilidade entre desafios e perfis, com curadoria do Studio."),
              cena: (
                <div className="mx-auto flex max-w-sm items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <img src={`${BASE}avatares/avatar-5.svg`} alt="" className="size-10 rounded-full" />
                  <div className="min-w-0 flex-1"><p className="text-body-sm font-semibold text-foreground">{t("Example person", "Pessoa de exemplo")}</p><p className="text-label text-muted-foreground">UX Research · Sênior</p></div>
                  <ChipDeEstado tom="sucesso">{t("High match", "Alta compatibilidade")}</ChipDeEstado>
                </div>
              ),
            },
            {
              id: "convite", titulo: t("Invitation and alignment", "Convite e alinhamento"), descricao: t("We talk about interest, availability and scope.", "Conversamos sobre interesse, disponibilidade e escopo."),
              cena: (
                <Conversa className="mx-auto max-w-sm">
                  <BalaoDaConversa autor="eu">{t("Hello! We have a Health challenge that matches your profile. Interested?", "Olá! Temos um desafio em Saúde que combina com o seu perfil. Tem interesse?")}</BalaoDaConversa>
                  <IndicadorDeDigitacao />
                </Conversa>
              ),
            },
          ]}
        />
      </SectionBlock>

      <SectionBlock
        id="secoes-numeros"
        titulo={t("Numbers and navigation cards", "Números e cards de navegação")}
        quando={t(
          "BarraDeNumeros: three or four real numbers of a section (2 × 2 on phones). CardDeNavegacao: a whole card that leads to another page, with a grey hover and an arrow.",
          "BarraDeNumeros: três ou quatro números reais de uma seção (2 × 2 no celular). CardDeNavegacao: um card inteiro que leva a outra página, com hover cinza e seta.",
        )}
        arquivo="ui/barra-de-numeros.tsx · ui/card-de-navegacao.tsx"
        nomes={["BarraDeNumeros", "CardDeNavegacao"]}
        api={`<BarraDeNumeros itens={[{ valor: "15+", rotulo: "anos de experiência" }]} />
<CardDeNavegacao href="/projeto-piloto/" icone={<LayoutGrid />} titulo="Projeto Piloto" descricao="…" />`}
      >
        <BarraDeNumeros itens={[{ valor: "00", rotulo: t("example number", "número de exemplo") }, { valor: "00", rotulo: t("example number", "número de exemplo") }, { valor: "00", rotulo: t("example number", "número de exemplo") }, { valor: "00", rotulo: t("example number", "número de exemplo") }]} />
        <GradeDeCards className="md:grid-cols-3 gap-4">
          <ItemDaGrade><CardDeNavegacao href="#secoes-numeros" icone={<LayoutGrid />} titulo="Projeto Piloto" descricao={t("A new perspective on your experience challenges.", "Uma nova perspectiva sobre os desafios de experiência do seu negócio.")} /></ItemDaGrade>
          <ItemDaGrade><CardDeNavegacao href="#secoes-numeros" icone={<Handshake />} titulo={t("Partner network", "Rede de Parceiros")} descricao={t("Professionals who join the studio's projects.", "Profissionais que somam aos projetos do Studio.")} /></ItemDaGrade>
          <ItemDaGrade><CardDeNavegacao href="#secoes-numeros" icone={<BookOpen />} titulo={t("Articles", "Artigos")} descricao={t("Thoughts on experience and strategy.", "Reflexões sobre experiência e estratégia.")} /></ItemDaGrade>
        </GradeDeCards>
      </SectionBlock>

      <SectionBlock
        id="secoes-saiba-prosa"
        titulo={t("“Learn more” link and long text", "Link “Saiba mais” e texto longo")}
        quando={t(
          "LinkSaibaMais: the hero handle that invites to scroll (arrow moving gently). Prosa: DS typography for long text written in plain HTML (privacy policy, terms).",
          "LinkSaibaMais: a alça do hero que convida a rolar (seta que se move devagar). Prosa: a tipografia do DS para texto longo escrito em HTML simples (política de privacidade, termos).",
        )}
        arquivo="ui/link-saiba-mais.tsx · ui/prosa.tsx"
        nomes={["LinkSaibaMais", "Prosa"]}
        api={`<LinkSaibaMais href="#rede" />
<Prosa><h2>…</h2><p>…</p><ul><li>…</li></ul></Prosa>`}
      >
        <GradeDeCards className="md:grid-cols-[1fr_2fr] gap-4">
          <ItemDaGrade>
            <ShowcaseCard className="grid h-full place-items-center gap-6">
              <LinkSaibaMais href="#secoes-saiba-prosa">{t("Learn more", "Saiba mais")}</LinkSaibaMais>
              <LinkSaibaMais href="#secoes-saiba-prosa" direcao="direita">{t("See how it works", "Veja como funciona")}</LinkSaibaMais>
            </ShowcaseCard>
          </ItemDaGrade>
          <ItemDaGrade>
            <ShowcaseCard className="h-full">
              <Prosa>
                <h2>{t("1. Example heading", "1. Título de exemplo")}</h2>
                <p>{t("Example paragraph of a long text, such as a privacy policy. ", "Parágrafo de exemplo de um texto longo, como uma política de privacidade. ")}<strong>{t("Important passage.", "Trecho importante.")}</strong> <a href="#secoes-saiba-prosa">{t("Example link", "Link de exemplo")}</a>.</p>
                <h3>{t("Example subheading", "Subtítulo de exemplo")}</h3>
                <ul><li>{t("First item", "Primeiro item")}</li><li>{t("Second item", "Segundo item")}</li></ul>
              </Prosa>
            </ShowcaseCard>
          </ItemDaGrade>
        </GradeDeCards>
      </SectionBlock>
    </div>
  );
}
