import React from "react";
import { AtSign, Check, Globe, PartyPopper } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DoDont, Mono } from "./Guidance";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Campo } from "../../ui/campo";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import { AvatarCircles } from "../../ui/avatar-circles";
import { RecorteDeFoto } from "../../ui/recorte-de-foto";
import { dispararConfete } from "../../ui/confete";
import { EstadoFinal } from "../../ui/estado-vazio";
import { BarrasOrdenadas, Funil } from "../../ui/graficos-inteligencia";
import { Card, CardContent } from "../../ui/card";
import { SegmentedControl } from "../../ui/segmented-control";
import { EscolhaOrdenada } from "../../ui/escolha-ordenada";
import { EscalaDeNotas, GrupoDeEscalas } from "../../ui/escala-de-notas";

/*
 * Documentação das peças de 28/11/2026, igual nos dois design systems (FindLook e Dani Moscatelli): RecorteDeFoto,
 * Confete e EstadoFinal comemorar, Input com prefixo e sufixo, Label obrigatorio, campos desabilitados, Button quebra,
 * AvatarCircles decorativo, BarrasOrdenadas destaque e Funil, EscolhaOrdenada, EscalaDeNotas e GrupoDeEscalas. Cada página monta a seção que lhe cabe.
 */

const BASE = import.meta.env.BASE_URL;

/** Cabeçalho comum das seções desta página: título, quando usar, arquivo e componentes. */
function Cabecalho({ titulo, quando, arquivo, nomes }: { titulo: string; quando: string; arquivo: string; nomes: string[] }) {
  return (
    <div>
      <SectionHeader title={titulo} description={quando} />
      <dl className="-mt-6 grid gap-2 text-body-sm text-muted-foreground sm:grid-cols-[auto_minmax(0,1fr)] sm:items-baseline sm:gap-x-3">
        <dt>Arquivo</dt>
        <dd className="m-0 flex flex-wrap gap-2">{arquivo.split(" · ").map(a => <Mono key={a}>{a}</Mono>)}</dd>
        <dt>Componentes</dt>
        <dd className="m-0 flex flex-wrap gap-2">{nomes.map(n => <Mono key={n}>{n}</Mono>)}</dd>
      </dl>
    </div>
  );
}

function ComoUsar({ children }: { children: string }) {
  return (
    <div className="space-y-2">
      <h3 className="text-body-sm font-semibold text-foreground">Como usar</h3>
      <pre className="m-0 whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-label text-muted-foreground"><code>{children}</code></pre>
    </div>
  );
}

/* ── Recorte de foto ── */

export function SecaoRecorteDeFoto() {
  const [foto, setFoto] = React.useState<string | null>(null);
  const [forma, setForma] = React.useState<"circulo" | "quadrado">("circulo");
  React.useEffect(() => () => { if (foto) URL.revokeObjectURL(foto); }, [foto]);
  return (
    <section id="recorte-de-foto" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Recorte de foto"
        quando="Para a pessoa enviar uma foto de perfil e enquadrar o rosto antes de usar (a autorização da galeria da Rede de Parceiros, a foto da loja). Escolhe a foto, arrasta para enquadrar, ajusta o zoom, vê a prévia e usa. O recorte é feito no aparelho e sai como arquivo de 600 × 600 px, sem os dados escondidos da foto (como a localização)."
        arquivo="ui/recorte-de-foto.tsx"
        nomes={["RecorteDeFoto"]}
      />
      <Card>
        <CardContent className="grid gap-6 p-6">
          <SegmentedControl size="sm" aria-label="Forma do recorte" className="self-start" value={forma} onValueChange={v => setForma(v as typeof forma)} options={[{ value: "circulo", label: "Redondo" }, { value: "quadrado", label: "Quadrado" }]} />
          {foto ? (
            <div className="flex flex-wrap items-center gap-4">
              <img src={foto} alt="Foto recortada" className={forma === "circulo" ? "size-24 rounded-full border border-border" : "size-24 rounded-md border border-border"} />
              <div className="grid gap-2">
                <p className="m-0 inline-flex items-center gap-1 text-body-sm font-semibold text-foreground"><Check aria-hidden className="size-4 text-primary-text" /> Foto pronta (600 × 600 px)</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setFoto(null)}>Trocar foto</Button>
              </div>
            </div>
          ) : (
            <RecorteDeFoto key={forma} forma={forma} onRecortar={(_, url) => setFoto(url)} />
          )}
        </CardContent>
      </Card>
      <ComoUsar>{`<RecorteDeFoto
  forma="circulo"                 // ou "quadrado"; o arquivo sai sempre quadrado
  tamanhoDeSaida={600}            // lado do arquivo, em px
  onRecortar={(foto, url) => { /* foto é um Blob: envie; url serve para a prévia */ }}
  onCancelar={() => fecharJanela()}
/>`}</ComoUsar>
      <p className="m-0 text-body-sm text-muted-foreground">Teclado: Tab chega à área da foto; as setas movem (Shift: passo maior), + e − mudam o zoom e 0 recomeça. O zoom também tem o controle deslizante e os botões − e +. Foto menor que 300 × 300 px, de outro formato ou maior que 15 MB mostra o erro logo abaixo da área de envio.</p>
      <DoDont
        dos={["Mostre a prévia no formato em que a foto vai aparecer (redonda no perfil).", "Explique o tamanho mínimo e os formatos antes de a pessoa escolher."]}
        donts={["Não envie a foto original: envie o Blob recortado, que já vem sem os dados escondidos.", "Não use para documentos ou imagens que não podem ser cortadas."]}
      />
    </section>
  );
}

/* ── Confete ── */

export function SecaoConfete() {
  const [fim, setFim] = React.useState(false);
  return (
    <section id="confete" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Confete na conquista"
        quando="Papeizinhos que caem do topo da tela por cerca de 3 segundos e somem, para comemorar uma conquista de verdade: um cadastro concluído, a primeira loja publicada. Veio da tela final do cadastro da Rede de Parceiros. Com “menos movimento”, não aparece nada."
        arquivo="ui/confete.tsx · ui/estado-vazio.tsx"
        nomes={["Confete", "dispararConfete", "EstadoFinal"]}
      />
      <Card>
        <CardContent className="p-6">
          {fim ? (
            <EstadoFinal
              comemorar
              focarAoAparecer={false}
              titulo="Cadastro enviado"
              descricao="Exemplo de tela final: o texto diz o que aconteceu; o confete só comemora."
              acoes={<Button type="button" variant="outline" onClick={() => setFim(false)}>Ver de novo</Button>}
            />
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => setFim(true)}><PartyPopper aria-hidden /> Ver o exemplo</Button>
              <Button type="button" variant="outline" onClick={() => dispararConfete()}>Só o confete</Button>
            </div>
          )}
        </CardContent>
      </Card>
      <ComoUsar>{`<EstadoFinal comemorar titulo="Cadastro enviado" descricao="…" />
// ou, em qualquer lugar:
<Confete ativo={enviado} />      // dispara quando ativo passa a true
dispararConfete({ quantidade: 160, duracao: 4000 })`}</ComoUsar>
      <DoDont
        dos={["Use uma vez por conquista, junto com o texto de sucesso.", "Deixe as cores nos tokens (padrão: a primária, o rosa do texto, o cinza e o aviso)."]}
        donts={["Não use em ações comuns (salvar, enviar mensagem).", "Não dependa do confete para dizer que deu certo: ele é enfeite e some."]}
      />
    </section>
  );
}

/* ── Campos: prefixo e sufixo, asterisco e desabilitado ── */

export function SecaoCamposComAfixo() {
  const [site, setSite] = React.useState("");
  return (
    <section id="campo-com-prefixo" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Prefixo, sufixo, obrigatório e desabilitado"
        quando="Prefixo e sufixo: um texto fixo antes ou depois do que a pessoa digita (https://, R$, @, kg), dentro da mesma caixa e fora do valor salvo. O asterisco de obrigatório fica colado ao fim do rótulo, quebrando junto com ele. Desabilitado: o campo fica apagado e o contorno volta ao cinza sutil (o contraste mínimo não vale para o que não se usa)."
        arquivo="ui/input.tsx · ui/campo.tsx · ui/label.tsx"
        nomes={["Input", "Campo", "Label"]}
      />
      <Card>
        <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
          <Campo rotulo="Site da empresa" prefixo="https://" placeholder="suaempresa.com.br" value={site} onChange={e => setSite(e.target.value)} ajuda={site ? `Valor salvo: “${site}” (sem o https://)` : "O https:// já está no campo."} icone={undefined} />
          <Campo rotulo="Instagram" prefixo={<AtSign aria-label="arroba" className="size-4" />} placeholder="seuperfil" />
          <Campo rotulo="Valor da proposta" prefixo="R$" inputMode="decimal" placeholder="0,00" />
          <Campo rotulo="Peso do pacote" sufixo="kg" inputMode="decimal" placeholder="0" />
          <div className="grid gap-2">
            <Label htmlFor="demo-rotulo-longo" obrigatorio>Conte em poucas palavras qual é o maior desafio da experiência dos seus clientes hoje</Label>
            <Textarea id="demo-rotulo-longo" required placeholder="Escreva aqui" />
          </div>
          <div className="grid content-start gap-4">
            <Campo rotulo="Campo desabilitado" placeholder="Indisponível" disabled />
            <Campo rotulo="Domínio" prefixo={<Globe aria-hidden className="size-4" />} sufixo=".com.br" placeholder="indisponível" disabled />
            <div className="flex items-center gap-2"><Checkbox id="demo-desab" disabled /><Label htmlFor="demo-desab">Caixa desabilitada</Label></div>
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<Campo rotulo="Site" prefixo="https://" value={site} onChange={…} />   // o valor é só o digitado
<Input sufixo="kg" inputMode="decimal" />
<Label htmlFor="desafio" obrigatorio>Rótulo longo que quebra em duas linhas</Label>`}</ComoUsar>
      <DoDont
        dos={["Use prefixo só para um texto que é sempre o mesmo (https://, R$).", "Com prefixo, o className vai para a caixa (altura, fundo).", "Use Label obrigatorio (ou Campo obrigatorio) em vez de um asterisco solto."]}
        donts={["Não ponha o prefixo no valor nem no placeholder.", "Não junte prefixo com o ícone do Campo: escolha um dos dois.", "Não dê ao campo desabilitado o contorno forte dos campos que se usam."]}
      />
    </section>
  );
}

/* ── Button: texto que quebra no celular ── */

export function SecaoBotaoQuebra() {
  return (
    <section id="botao-quebra" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Texto longo no botão, no celular"
        quando="No celular (abaixo de 640 px), um texto que não cabe na largura quebra em mais de uma linha, centralizado, e o botão cresce para baixo, sem passar da borda (mínimo de 44 px). Com texto curto nada muda. É automático (quebra=“celular”); quebra=“nunca” mantém uma linha (botões de uma barra), quebra=“sempre” deixa quebrar em qualquer tela."
        arquivo="ui/button.tsx"
        nomes={["Button"]}
      />
      <Card>
        <CardContent className="grid gap-4 p-6">
          <div data-aud-ignorar className="grid max-w-xs gap-3 rounded-md border border-dashed border-border p-3">
            <p className="m-0 text-label text-muted-foreground">Espaço de 320 px (como um celular pequeno):</p>
            <Button type="button" className="w-full">Quero receber a proposta do Projeto Piloto por e-mail</Button>
            <Button type="button" variant="outline" quebra="sempre" className="w-full">Ver todas as especialidades da Rede de Parceiros</Button>
            <Button type="button" variant="outline" className="w-full">Curto</Button>
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<Button className="w-full">Texto longo que pode quebrar no celular</Button>   // quebra="celular" (padrão)
<Button quebra="nunca">Ação da barra</Button>
<Button quebra="sempre" className="w-full">Quebra em qualquer tela</Button>`}</ComoUsar>
      <DoDont
        dos={["Escreva o texto do botão curto; a quebra é a rede de segurança.", "Dê largura total ao botão no celular quando o texto for longo."]}
        donts={["Não diminua a fonte para caber.", "Não use quebra=“nunca” num botão de largura total com texto longo."]}
      />
    </section>
  );
}

/* ── AvatarCircles decorativo ── */

export function SecaoAvatarDecorativo() {
  const fotos = [1, 2, 3, 4].map(i => ({ imageUrl: `${BASE}avatares/avatar-${i}.svg`, name: `Pessoa de exemplo ${i}` }));
  return (
    <section id="avatar-decorativo" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Círculos de avatares só de enfeite"
        quando="Quando as fotos só ilustram uma frase (“Junte-se ao nosso ecossistema de parceiros”), use decorativo: as fotos não são links, não recebem foco e ficam fora dos leitores de tela, porque a frase ao lado já diz o que importa. Sem decorativo, cada foto com profileUrl continua sendo link."
        arquivo="ui/avatar-circles.tsx"
        nomes={["AvatarCircles"]}
      />
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-6">
          <AvatarCircles decorativo avatarUrls={fotos} size="sm" />
          <p className="m-0 text-body-sm font-semibold text-foreground">Junte-se ao nosso ecossistema de parceiros!</p>
        </CardContent>
      </Card>
      <ComoUsar>{`<AvatarCircles decorativo avatarUrls={[{ imageUrl: "/avatares/1.webp" }, …]} />
<p>Junte-se ao nosso ecossistema de parceiros!</p>`}</ComoUsar>
      <DoDont dos={["Use decorativo sempre que houver um texto ao lado dizendo o mesmo."]} donts={["Não ponha links em fotos de pessoas fictícias."]} />
    </section>
  );
}

/* ── Gráficos: destaque fora do topo e funil ── */

export function SecaoBarrasEFunil() {
  const escala = [
    { rotulo: "Nada", valor: 4 },
    { rotulo: "Pouco", valor: 11 },
    { rotulo: "Mais ou menos", valor: 19 },
    { rotulo: "Bastante", valor: 23 },
    { rotulo: "Muito", valor: 9 },
  ];
  return (
    <section id="barras-destaque-e-funil" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Escala em ordem natural e funil"
        quando="BarrasOrdenadas com ordenar={false} e destaque: para escalas que têm uma ordem própria (de “Nada” a “Muito”, faixas de idade), mantendo a ordem e destacando o item que importa, mesmo que não seja o primeiro. Funil: as etapas de uma jornada, com quanto seguiu de uma para a outra; agora é uma lista de verdade, que os leitores de tela percorrem etapa por etapa. Os números são de exemplo."
        arquivo="ui/graficos-inteligencia.tsx"
        nomes={["BarrasOrdenadas", "Funil"]}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="grid gap-3 p-6">
            <p className="m-0 text-body-sm font-semibold text-foreground">Quanto a experiência influencia a compra (exemplo)</p>
            <BarrasOrdenadas rotulo="Quanto a experiência influencia a compra" itens={escala} ordenar={false} posicao={false} destaque="Bastante" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="grid gap-3 p-6">
            <p className="m-0 text-body-sm font-semibold text-foreground">Do convite à resposta (exemplo)</p>
            <Funil rotulo="Do convite à resposta" etapas={[{ rotulo: "Convites", valor: 120 }, { rotulo: "Abriram", valor: 84 }, { rotulo: "Começaram", valor: 51 }, { rotulo: "Responderam", valor: 40 }]} />
          </CardContent>
        </Card>
      </div>
      <ComoUsar>{`<BarrasOrdenadas itens={escala} ordenar={false} posicao={false} destaque="Bastante" rotulo="…" />
<Funil etapas={[{ rotulo: "Convites", valor: 120 }, …]} rotulo="Do convite à resposta" />
<CardIndicador formato="percentual" valor={67} … />            // mostra 67%
<CardIndicador formatar={(n) => \`\${n} h\`} valor={12} … />`}</ComoUsar>
      <DoDont
        dos={["Numa escala com ordem própria, mantenha a ordem e destaque o que importa.", "Use o Funil para etapas em sequência, em que cada uma vem da anterior."]}
        donts={["Não ordene uma escala do maior para o menor: ela perde o sentido.", "Não use o Funil para categorias que não são etapas."]}
      />
    </section>
  );
}

/* ── Escolha ordenada ── */

export function SecaoEscolhaOrdenada() {
  const [ordem, setOrdem] = React.useState<string[]>(["marketplaces", "fisicas-cidade"]);
  const [erro, setErro] = React.useState(false);
  return (
    <section id="escolha-ordenada" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Escolha ordenada"
        quando="Para escolher até N opções na ordem de importância, sem arrastar: o primeiro toque é o 1º lugar, o próximo fica com o próximo lugar livre; tocar de novo tira, e as de depois sobem. No máximo, as outras travam. A opção exclusiva (“Não comprei…”) fica sozinha. Veio da pesquisa Moda em Curitiba."
        arquivo="ui/escolha-ordenada.tsx"
        nomes={["EscolhaOrdenada", "proximaOrdem"]}
      />
      <Card>
        <CardContent className="grid max-w-xl gap-4 p-6">
          <p id="demo-ordem-pergunta" className="m-0 text-body font-semibold text-foreground">Onde você mais comprou roupas este ano? (exemplo)</p>
          <EscolhaOrdenada
            aria-labelledby="demo-ordem-pergunta"
            maximo={3}
            valor={ordem}
            onValorChange={v => { setOrdem(v); setErro(false); }}
            erro={erro ? "Escolha pelo menos uma opção." : undefined}
            opcoes={[
              { valor: "fisicas-cidade", titulo: "Lojas físicas da cidade" },
              { valor: "online-cidade", titulo: "Lojas online da cidade (sites, redes sociais ou WhatsApp)" },
              { valor: "marketplaces", titulo: "Marketplaces" },
              { valor: "outras-cidades", titulo: "Lojas de outras cidades" },
              { valor: "nenhuma", titulo: "Não comprei nenhuma peça este ano", exclusiva: true },
            ]}
          />
          <div className="flex flex-wrap gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => { setOrdem([]); setErro(true); }}>Ver o estado de erro</Button>
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<p id="pergunta">Onde você mais comprou?</p>
<EscolhaOrdenada aria-labelledby="pergunta" maximo={3} valor={ordem} onValorChange={setOrdem}
  opcoes={[{ valor: "fisicas", titulo: "Lojas físicas" }, …, { valor: "nenhuma", titulo: "Não comprei", exclusiva: true }]} />`}</ComoUsar>
      <DoDont
        dos={["Diga na pergunta quantas opções e em que ordem (“Escolha até 3, na ordem”).", "Use exclusiva para a opção que não combina com as outras."]}
        donts={["Não use para escolhas sem ordem: aí são caixas de marcar.", "Não passe de 5 a 7 opções: a pessoa precisa ver todas para ordenar."]}
      />
    </section>
  );
}

/* ── Escala de notas ── */

export function SecaoEscalaDeNotas() {
  const [notas, setNotas] = React.useState<Record<string, number | null>>({ qualidade: 8, estetica: null, nps: null });
  const [conferir, setConferir] = React.useState(false);
  const mudar = (k: string) => (n: number) => setNotas(v => ({ ...v, [k]: n }));
  const faltando = (k: string) => (conferir && notas[k] == null ? "Escolha uma nota de 1 a 10." : undefined);
  return (
    <section id="escala-de-notas" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Escala de notas"
        quando="Uma nota numa escala curta e numerada (1 a 10, 0 a 10, 1 a 5), com o significado das pontas escrito embaixo. Estreito: metade dos números por linha; com espaço (a partir de 34 rem), todos numa linha. Várias escalas no mesmo card: GrupoDeEscalas. Veio da pesquisa Moda em Curitiba."
        arquivo="ui/escala-de-notas.tsx"
        nomes={["EscalaDeNotas", "GrupoDeEscalas"]}
      />
      <div className="grid max-w-2xl gap-4">
        <GrupoDeEscalas>
          <EscalaDeNotas rotulo="Qualidade" descricao="Qualidade dos materiais, tecidos e acabamentos" valor={notas.qualidade} onValorChange={mudar("qualidade")} rotuloMinimo="Muito ruim" rotuloMaximo="Excelente" obrigatorio erro={faltando("qualidade")} />
          <EscalaDeNotas rotulo="Estética" descricao="Aparência, estilo e beleza das peças" valor={notas.estetica} onValorChange={mudar("estetica")} rotuloMinimo="Muito ruim" rotuloMaximo="Excelente" obrigatorio erro={faltando("estetica")} />
        </GrupoDeEscalas>
        <GrupoDeEscalas>
          <EscalaDeNotas rotulo="De 0 a 10, quanto você indicaria a um amigo? (NPS)" minimo={0} maximo={10} valor={notas.nps} onValorChange={mudar("nps")} rotuloMinimo="Nada provável" rotuloMaximo="Muito provável" />
        </GrupoDeEscalas>
        <div><Button type="button" variant="outline" size="sm" onClick={() => setConferir(true)}>Conferir as notas</Button></div>
      </div>
      <ComoUsar>{`<GrupoDeEscalas>
  <EscalaDeNotas rotulo="Qualidade" descricao="…" valor={nota} onValorChange={setNota}
    rotuloMinimo="Muito ruim" rotuloMaximo="Excelente" erro={faltando} />
</GrupoDeEscalas>
<EscalaDeNotas minimo={0} maximo={10} … />   // NPS`}</ComoUsar>
      <DoDont
        dos={["Escreva o que as pontas querem dizer.", "Ponha os aspectos de uma mesma pergunta no mesmo GrupoDeEscalas."]}
        donts={["Não use estrelas ou carinhas no lugar dos números.", "Não pinte o escolhido de rosa forte: ele usa o rosa de selecionado com a borda primária."]}
      />
    </section>
  );
}
