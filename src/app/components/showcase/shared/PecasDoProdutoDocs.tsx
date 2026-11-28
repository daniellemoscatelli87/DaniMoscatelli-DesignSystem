import React from "react";
import { CalendarCheck, Eye, LogIn, Search, GraduationCap, Rocket, RotateCcw, Store, UserRound } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { DoDont, Mono } from "./Guidance";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { SegmentedControl } from "../../ui/segmented-control";
import { ChipDeEstado } from "../../ui/chip-de-estado";
import { ListaDePassos, PassoDaLista, NumeroDoPasso } from "../../ui/lista-de-passos";
import { ItemMarcavel, ListaMarcavel } from "../../ui/item-marcavel";
import { SeletorDeEtapa } from "../../ui/seletor-de-etapa";
import { GradeDeMiniaturas } from "../../ui/grade-de-miniaturas";
import { BarrasOrdenadas } from "../../ui/graficos-inteligencia";
import { TabelaAdaptavel } from "../../ui/tabela-adaptavel";
import { ImageUpload } from "../../ui/upload";
import { Quadro } from "../../ui/quadro";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../ui/command";
import { CabecalhoDoSite } from "../../ui/cabecalho-do-site";

/*
 * Documentação das peças que o produto FindLook ainda fazia à mão (28/11/2026), igual nos dois design systems:
 * ListaDePassos (e NumeroDoPasso), SeletorDeEtapa, ItemMarcavel, GradeDeMiniaturas, BarrasOrdenadas com link por linha,
 * TabelaAdaptavel com linhaAtual e ImageUpload ocupado e com iniciais. Cada página monta a seção que lhe cabe.
 * Todos os dados são de exemplo.
 */

/** Cabeçalho comum: título, quando usar, arquivo e componentes. */
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

function Regras({ itens }: { itens: string[] }) {
  return (
    <ul className="m-0 list-disc space-y-1 pl-5 text-body-sm text-muted-foreground">
      {itens.map(i => <li key={i}>{i}</li>)}
    </ul>
  );
}

/** Espera de exemplo, para mostrar o estado de carregando das demonstrações. */
const esperar = (ms: number) => new Promise(r => setTimeout(r, ms));

const foto = (id: string) => `https://images.unsplash.com/photo-${id}?w=240&q=60&auto=format&fit=crop`;

/* ── Lista de passos ── */

export function SecaoListaDePassos() {
  const [vista, setVista] = React.useState("lojista");
  return (
    <section id="lista-de-passos" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Lista de passos"
        quando="Instruções numeradas, todas abertas ao mesmo tempo, com qualquer conteúdo em cada passo (texto, botões, um código). Veio do “Como testar” do simulador do WhatsApp. Para um assistente de várias telas, use o Stepper; para contar uma história ao rolar a página, a Timeline."
        arquivo="ui/lista-de-passos.tsx"
        nomes={["ListaDePassos", "PassoDaLista", "NumeroDoPasso"]}
      />
      <Card>
        <CardContent className="grid gap-6 p-6">
          <ListaDePassos>
            <PassoDaLista titulo="Gere o código de teste" feito>
              <p className="m-0">Toque em Gerar código e mande o código na conversa, como a pessoa faria com o código do painel.</p>
            </PassoDaLista>
            <PassoDaLista titulo="Mande a foto de uma peça">
              <p className="m-0">Escolha uma foto. A análise leva alguns segundos; depois, dá para mandar mais fotos da mesma peça.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm"><RotateCcw aria-hidden /> Recomeçar o teste</Button>
              </div>
            </PassoDaLista>
            <PassoDaLista titulo="Escolha quem você é no teste">
              <p className="m-0">O conteúdo de um passo pode ter qualquer controle do DS.</p>
              <SegmentedControl size="sm" aria-label="Quem testa" className="mt-3" value={vista} onValueChange={setVista} options={[{ value: "lojista", label: "Lojista" }, { value: "consumidora", label: "Consumidora" }]} />
            </PassoDaLista>
          </ListaDePassos>
          <div className="border-t border-border pt-5">
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Só o número (NumeroDoPasso), em outra lista numerada</h3>
            <ol className="m-0 list-none space-y-3 p-0">
              {["As lojas de festa ficam no centro", "Poucas lojas abrem aos domingos"].map((t, i) => (
                <li key={t} className="flex items-start gap-3">
                  <NumeroDoPasso n={i + 1} tamanho="sm" className="mt-0.5" />
                  <span className="text-body font-semibold leading-snug text-foreground"><span className="sr-only">Descoberta {i + 1}: </span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<ListaDePassos>
  <PassoDaLista titulo="Gere o código de teste" feito>…</PassoDaLista>
  <PassoDaLista titulo="Mande a foto de uma peça">
    <p>…</p>
    <Button variant="outline" size="sm">…</Button>
  </PassoDaLista>
</ListaDePassos>
// Só o círculo: <NumeroDoPasso n={1} tamanho="sm" /> (decorativo: diga o número em texto)`}</ComoUsar>
      <Regras itens={[
        "Número no círculo de destaque (--primary-muted, número em --primary-text, 28 px; “sm” 24 px); passo feito com o check verde (--success-muted).",
        "Título h3 em text-body, conteúdo em text-body-sm cinza, alinhado à borda do título (nunca embaixo do número). “Passo 1:” e “(feito)” vão para leitores de tela.",
        "Os passos entram um depois do outro, deslizando 4 px; com “menos movimento”, aparecem prontos.",
      ]} />
      <DoDont
        dos={["Use para instruções que a pessoa segue lendo, com os controles de cada passo dentro dele.", "Escreva o título como uma ação curta (“Mande a foto de uma peça”)."]}
        donts={["Não use como assistente de várias telas (é o Stepper) nem para mostrar em que etapa algo está (é o SeletorDeEtapa).", "Não ponha um botão cheio em cada passo: um só botão cheio por área."]}
      />
    </section>
  );
}

/* ── Seletor de etapa ── */

const ETAPAS = [
  { id: "cadastro", titulo: "Cadastro", descricao: "A loja se cadastrou.", icone: <Store /> },
  { id: "treinamento", titulo: "Treinamento", descricao: "A loja está aprendendo a usar.", icone: <GraduationCap /> },
  { id: "ativa", titulo: "Ativa", descricao: "A loja terminou o treinamento e já usa sozinha.", icone: <Rocket /> },
];

export function SecaoSeletorDeEtapa() {
  const [atual, setAtual] = React.useState("treinamento");
  const [salvando, setSalvando] = React.useState<string | null>(null);
  const [feita, setFeita] = React.useState<string | null>(null);
  const [aviso, setAviso] = React.useState("");
  async function mudar(id: string) {
    setSalvando(id);
    setAviso("");
    await esperar(900);
    setSalvando(null);
    setAtual(id);
    setFeita(id);
    setAviso(`Etapa mudada para ${ETAPAS.find(e => e.id === id)?.titulo}.`);
    setTimeout(() => setFeita(null), 1600);
  }
  return (
    <section id="seletor-de-etapa" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Seletor de etapa"
        quando="Mostra em que etapa um processo está e deixa mudar para outra com um toque, salvando na hora (a ativação da loja parceira: Cadastro, Treinamento, Ativa). O Stepper é o progresso de um assistente (as etapas futuras não abrem e não têm explicação) e o SegmentedControl troca uma vista, sem ordem; por isso esta peça nova."
        arquivo="ui/seletor-de-etapa.tsx"
        nomes={["SeletorDeEtapa", "EtapaDoSeletor"]}
      />
      <Card>
        <CardContent className="grid gap-4 p-6">
          <SeletorDeEtapa rotulo="Etapa da ativação (exemplo)" etapas={ETAPAS} atual={atual} salvando={salvando} feita={feita} onEscolher={id => void mudar(id)} />
          <p aria-live="polite" className="m-0 min-h-5 text-body-sm text-muted-foreground">{aviso}</p>
          <div className="border-t border-border pt-4">
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Só de leitura (sem onEscolher)</h3>
            <SeletorDeEtapa rotulo="Etapa da ativação, só de leitura (exemplo)" etapas={ETAPAS} atual="ativa" />
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<SeletorDeEtapa
  rotulo="Etapa da ativação"
  etapas={[{ id: "cadastro", titulo: "Cadastro", descricao: "…", icone: <Store /> }, …]}
  atual={loja.etapa}
  salvando={salvando} // id da etapa sendo salva: trava as outras
  feita={feita} // id da que acabou de salvar: check por um momento
  onEscolher={(id) => mudar(id)}
/>`}</ComoUsar>
      <Regras itens={[
        "Atual: rosa de selecionado (--primary-suave) com a borda primária a 40 %, círculo na primária, “Etapa atual” e aria-current=“step”; continua focável (aria-disabled) para o leitor de tela encontrá-la.",
        "Já passou: círculo verde claro com o check; ainda não chegou: círculo cinza com o ícone. Hover cinza (--muted), nunca rosa.",
        "No seletor estreito (menos de 28 rem), “Mover para cá” desce para baixo do texto, na mesma borda; no toque, cada etapa tem pelo menos 44 px.",
        "Salvando: carregando e “Salvando…” na etapa escolhida; o check de sucesso entra com escala (sem escala com “menos movimento”). Avise o resultado num texto com aria-live.",
      ]} />
      <DoDont
        dos={["Explique cada etapa numa frase curta.", "Mostre o resultado da mudança num aviso perto do seletor."]}
        donts={["Não use para escolher uma opção qualquer (use o GrupoDeOpcoes ou o SegmentedControl).", "Não esconda as etapas já passadas: elas mostram o caminho."]}
      />
    </section>
  );
}

/* ── Item marcável ── */

const PASSOS_DO_PLANO = [
  { id: "a", titulo: "Escolher o bairro do plano", quem: "Você faz", como: "Comece por um bairro com muitas lojas de moda e fácil de percorrer.", indicador: "Bairro escolhido: Centro" },
  { id: "b", titulo: "Visitar as lojas do bairro", quem: "Você faz", como: "Leve o folheto e mostre o painel no celular.", indicador: null },
  { id: "c", titulo: "Publicar a primeira ideia de post", quem: "Equipe", como: "Use as fotos reais das peças e marque as lojas.", indicador: "3 posts publicados" },
];

export function SecaoItemMarcavel() {
  const [feitas, setFeitas] = React.useState<Set<string>>(new Set(["a"]));
  return (
    <section id="item-marcavel" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Item marcável (checklist)"
        quando="Uma etapa de checklist que a própria pessoa marca como feita, com quem faz, como fazer e um indicador. Veio do Plano de divulgação. Quando o estado é calculado pelo sistema e o item leva a uma tela, use o item de checklist do painel."
        arquivo="ui/item-marcavel.tsx"
        nomes={["ItemMarcavel", "ListaMarcavel"]}
      />
      <Card>
        <CardContent className="p-6">
          <p className="mb-3 text-body-sm font-semibold text-foreground">{feitas.size} de {PASSOS_DO_PLANO.length} etapas feitas</p>
          <ListaMarcavel>
            {PASSOS_DO_PLANO.map((p, i) => (
              <ItemMarcavel
                key={p.id}
                prefixoParaLeitores={`Etapa ${i + 1}:`}
                titulo={p.titulo}
                etiqueta={<ChipDeEstado tom={p.quem === "Equipe" ? "neutro" : "marca"} icone={<UserRound />}>{p.quem}</ChipDeEstado>}
                descricao={p.como}
                indicador={p.indicador ? <><Eye aria-hidden />{p.indicador}</> : undefined}
                marcado={feitas.has(p.id)}
                onMarcadoChange={v => setFeitas(f => { const n = new Set(f); if (v) n.add(p.id); else n.delete(p.id); return n; })}
              />
            ))}
            <ItemMarcavel titulo="Etapa que ainda não pode ser feita" descricao="Desabilitado: sem hover e com a caixa esmaecida." marcado={false} onMarcadoChange={() => undefined} desabilitado />
          </ListaMarcavel>
        </CardContent>
      </Card>
      <ComoUsar>{`<ListaMarcavel>
  <ItemMarcavel
    prefixoParaLeitores="Etapa 1:"
    titulo="Escolher o bairro do plano"
    etiqueta={<ChipDeEstado tom="marca" icone={<UserRound />}>Você faz</ChipDeEstado>}
    descricao="Comece por um bairro com muitas lojas."
    indicador={<><Eye aria-hidden />Bairro escolhido: Centro</>}
    marcado={feitas.has("a")}
    onMarcadoChange={(v) => marcar("a", v)}
  />
</ListaMarcavel>`}</ComoUsar>
      <Regras itens={[
        "A linha inteira é o rótulo da caixa de marcar do DS: tocar em qualquer ponto marca. A caixa tem 44 × 44 px de área no toque; a explicação é lida junto (aria-describedby).",
        "Feito: fundo verde claro (--success-muted), título riscado em cinza e o check verde que entra com uma pequena escala (sem escala com “menos movimento”). O estado nunca é só a cor.",
        "Hover cinza (--muted, borda --border-strong), nunca rosa; desabilitado sem hover.",
      ]} />
      <DoDont
        dos={["Mostre o progresso acima da lista (“1 de 3 etapas feitas”), com o ProgressoRotulado ou um texto.", "Escreva o título como uma ação e a explicação como o jeito de fazer."]}
        donts={["Não use para o que o sistema confere sozinho (use o item de checklist do painel, que leva à tela).", "Não ponha links ou botões dentro do item: a linha inteira já é o rótulo da caixa."]}
      />
    </section>
  );
}

/* ── Grade de miniaturas ── */

const PECAS = [
  { id: "1", titulo: "Vestido midi florido", detalhe: "R$ 129,90 · Loja Aurora", foto: foto("1595777457583-95e059d581b8") },
  { id: "2", titulo: "Calça jeans reta", detalhe: "R$ 89,90 · Brechó Fio", foto: foto("1542272604-787c3835535d") },
  { id: "3", titulo: "Jaqueta de couro", detalhe: "R$ 249,00 · Noir", foto: foto("1551028719-00167b16eac5") },
  { id: "4", titulo: "Peça sem foto", detalhe: "R$ 59,90 · Loja Aurora", foto: null },
];

export function SecaoGradeDeMiniaturas() {
  const [colunas, setColunas] = React.useState<"2" | "3" | "4">("2");
  return (
    <section id="grade-de-miniaturas" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Grade de miniaturas"
        quando="Poucas fotos pequenas, quadradas, com o nome e um detalhe embaixo, para dar uma ideia do que existe (as peças de uma ideia de post no Plano de divulgação). Não é a galeria de envio (ImageGrid) nem a vitrine (ProductCard)."
        arquivo="ui/grade-de-miniaturas.tsx"
        nomes={["GradeDeMiniaturas", "MiniaturaDaGrade"]}
      />
      <Card>
        <CardContent className="grid gap-5 p-6">
          <SegmentedControl size="sm" aria-label="Colunas no máximo" className="self-start" value={colunas} onValueChange={v => setColunas(v as typeof colunas)} options={[{ value: "2", label: "2 colunas" }, { value: "3", label: "3" }, { value: "4", label: "4" }]} />
          <div className="max-w-md">
            <p className="mb-2 text-body-sm font-semibold text-foreground">Achados até R$ 100 no Centro</p>
            <GradeDeMiniaturas rotulo="Peças da ideia de post (exemplo)" colunas={Number(colunas) as 2 | 3 | 4} itens={PECAS} />
          </div>
          <div className="max-w-md border-t border-border pt-4">
            <p className="mb-2 text-body-sm font-semibold text-foreground">Com link em cada miniatura</p>
            <GradeDeMiniaturas rotulo="Peças com link (exemplo)" colunas={4} maximo={4} itens={PECAS.map(p => ({ ...p, href: "#grade-de-miniaturas" }))} />
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<GradeDeMiniaturas
  rotulo="Peças da ideia de post"
  colunas={2} // máximo; em bloco estreito fica em 2
  maximo={4}
  itens={pecas.map(p => ({ id: p.id, titulo: p.nome, detalhe: \`\${preco} · \${p.loja}\`, foto: p.foto }))}
  vazio={<EstadoVazio tamanho="sm" moldura="tracejado" titulo="Aparece quando houver peças." />}
/>`}</ComoUsar>
      <Regras itens={[
        "Foto quadrada no cinza de apoio (--muted), cantos de 8 px; sem foto, o ícone de imagem no mesmo quadrado (a grade não pula).",
        "Nome em text-label (12 px) e detalhe em text-caption (11 px) cinza, cada um com até 2 linhas (o nome inteiro fica no title). A foto é decorativa: o nome escrito diz o que ela é.",
        "Nunca rola para o lado: as colunas seguem a largura do próprio bloco. Com href, cada miniatura vira link com hover cinza e foco visível.",
      ]} />
      <DoDont
        dos={["Use até 4 a 6 miniaturas: é uma amostra.", "Escreva no detalhe o que ajuda a decidir (preço, loja)."]}
        donts={["Não use para enviar ou ordenar fotos (é o ImageGrid).", "Não ponha botões sobre a foto."]}
      />
    </section>
  );
}

/* ── Barras com link ── */

const RANKING = [
  { rotulo: "Centro", valor: 12 },
  { rotulo: "Batel", valor: 9 },
  { rotulo: "Água Verde", valor: 6 },
  { rotulo: "Portão", valor: 4 },
  { rotulo: "Cabral", valor: 2 },
];

export function SecaoBarrasComLink() {
  const [aberto, setAberto] = React.useState<string | null>(null);
  return (
    <section id="barras-com-link" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Barras ordenadas com link"
        quando="Um ranking em que cada linha leva a outra tela (a lista filtrada daquele bairro) ou faz uma ação: o ranking da Visão geral do FindLook. Com href ou onClick nos itens, a linha inteira vira link ou botão."
        arquivo="ui/graficos-inteligencia.tsx"
        nomes={["BarrasOrdenadas", "ItemDasBarrasOrdenadas"]}
      />
      <Card>
        <CardContent className="grid gap-4 p-6">
          <BarrasOrdenadas rotulo="Bairros com mais lojas (exemplo)" destaques={1} itens={RANKING.map(r => ({ ...r, onClick: () => setAberto(r.rotulo) }))} formatar={n => `${n} ${n === 1 ? "loja" : "lojas"}`} />
          <p aria-live="polite" className="m-0 min-h-5 text-body-sm text-muted-foreground">{aberto ? `Abriria a lista de lojas de ${aberto}.` : "Toque numa linha."}</p>
        </CardContent>
      </Card>
      <ComoUsar>{`<BarrasOrdenadas
  rotulo="Bairros com mais lojas"
  itens={bairros.map(b => ({ rotulo: b.nome, valor: b.lojas, href: \`/admin/lojas/?bairro=\${b.nome}\` }))}
  comoLink={Link} // o Link do Next, no produto
  formatar={(n) => \`\${n} lojas\`}
/>`}</ComoUsar>
      <Regras itens={[
        "Com links, o gráfico vira uma lista ordenada; o nome de cada link é o próprio texto da linha, “1º Centro 12 lojas” (posição, nome e valor), e a barra é decorativa.",
        "Hover cinza de ponta a ponta (--row-hover, sem cantos), foco por dentro da linha, nome sublinhado no hover; no toque, cada linha tem pelo menos 44 px.",
        "Sem links, continua uma imagem com o resumo dos valores para leitores de tela. As barras crescem ao aparecer; com “menos movimento”, aparecem prontas.",
      ]} />
      <DoDont
        dos={["Leve a uma tela que mostra exatamente o que a linha conta (a lista filtrada).", "Use o mesmo tipo de destino em todas as linhas."]}
        donts={["Não misture linhas com e sem link no mesmo ranking.", "Não use link para abrir uma explicação: use a dica ou um texto perto do gráfico."]}
      />
    </section>
  );
}

/* ── Tabela com linha atual ── */

type Bairro = { nome: string; regional: string; lojas: number; parceiras: number };
const BAIRROS: Bairro[] = [
  { nome: "Centro", regional: "Matriz", lojas: 120, parceiras: 4 },
  { nome: "Batel", regional: "Matriz", lojas: 85, parceiras: 2 },
  { nome: "Água Verde", regional: "Portão", lojas: 61, parceiras: 1 },
  { nome: "Portão", regional: "Portão", lojas: 44, parceiras: 0 },
];

export function SecaoTabelaLinhaAtual() {
  const [atual, setAtual] = React.useState("Batel");
  return (
    <section id="tabela-linha-atual" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Tabela com linha atual"
        quando="Uma linha da TabelaAdaptavel em destaque, sem caixa de seleção: o bairro do plano, o item aberto ao lado. Fica no rosa de selecionado, com aria-current."
        arquivo="ui/tabela-adaptavel.tsx"
        nomes={["TabelaAdaptavel (linhaAtual)"]}
      />
      <Card>
        <CardContent className="grid gap-4 p-6">
          <SegmentedControl size="sm" aria-label="Bairro do plano" className="self-start" value={atual} onValueChange={setAtual} options={BAIRROS.slice(0, 3).map(b => ({ value: b.nome, label: b.nome }))} />
          <TabelaAdaptavel
            moldura="card"
            larguraDaLista={0}
            legenda="Bairros por lojas de moda (exemplo), com o bairro do plano em destaque"
            linhas={BAIRROS}
            chave={b => b.nome}
            linhaAtual={atual}
            colunas={[
              { id: "bairro", titulo: "Bairro", principal: true, largura: 112, celula: b => (<><span className="font-medium">{b.nome}</span>{b.nome === atual && <ChipDeEstado tom="marca" className="ml-2 align-middle">no plano</ChipDeEstado>}<span className="block text-label font-normal text-muted-foreground">{b.regional}</span></>) },
              { id: "lojas", titulo: "Lojas de moda", alinhar: "fim", prioridade: 1, largura: 112, celula: b => <span className="tabular-nums">{b.lojas}</span> },
              { id: "parceiras", titulo: "Parceiras", alinhar: "fim", prioridade: 2, largura: 96, celula: b => <span className="tabular-nums">{b.parceiras || "—"}</span> },
            ]}
          />
        </CardContent>
      </Card>
      <ComoUsar>{`<TabelaAdaptavel
  linhas={bairros}
  chave={(b) => b.nome}
  linhaAtual={bairroDoPlano} // a chave da linha
  colunas={[{ id: "bairro", principal: true, celula: (b) => <>{b.nome}{b.nome === bairroDoPlano && <ChipDeEstado tom="marca">no plano</ChipDeEstado>}</> }, …]}
/>`}</ComoUsar>
      <Regras itens={[
        "A linha atual tem o mesmo rosa da linha selecionada (--primary-suave), na tabela e na lista do celular, e continua rosa com o mouse em cima.",
        "aria-current=“true” na linha. Como o estado não pode ser só a cor, escreva na célula o que ela é (a etiqueta “no plano”).",
      ]} />
      <DoDont
        dos={["Use para uma linha só.", "Junte a etiqueta que diz por que a linha está em destaque."]}
        donts={["Não use para várias linhas escolhidas (é a seleção, com caixas).", "Não pinte a linha com outro rosa."]}
      />
    </section>
  );
}

/* ── Imagem enviando e iniciais ── */

export function SecaoImagemOcupada() {
  const [url, setUrl] = React.useState<string | null>(null);
  const [ocupado, setOcupado] = React.useState(false);
  React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  async function escolher(_: File | null, u: string | null) {
    if (!u) { setUrl(null); return; }
    setOcupado(true);
    await esperar(1500);
    setUrl(u);
    setOcupado(false);
  }
  return (
    <section id="imagem-enviando" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Imagem enviando e iniciais"
        quando="A foto de perfil do ImageUpload com o estado de envio (o carregando sobre a imagem e “Enviando…” embaixo; um novo arquivo é ignorado até acabar) e as iniciais da pessoa quando ainda não há foto."
        arquivo="ui/upload.tsx"
        nomes={["ImageUpload (ocupado, textoOcupado, iniciais)"]}
      />
      <Card>
        <CardContent className="flex flex-wrap items-start gap-8 p-6">
          <div className="grid justify-items-start gap-2">
            <p className="m-0 text-label font-semibold text-muted-foreground">Escolha uma foto (envio de exemplo de 1,5 s)</p>
            <ImageUpload shape="circle" size={88} label="Foto de perfil" iniciais="AL" value={url} ocupado={ocupado} onChange={(f, u) => void escolher(f, u)} accept={["image/jpeg", "image/png", "image/webp"]} />
          </div>
          <div className="grid justify-items-start gap-2">
            <p className="m-0 text-label font-semibold text-muted-foreground">Sempre enviando</p>
            <ImageUpload shape="circle" size={88} label="Foto de perfil" iniciais="DM" value={null} ocupado onChange={() => undefined} />
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<ImageUpload
  shape="circle" size={88} label="Foto de perfil"
  value={foto} iniciais="AL" // sem foto, as iniciais
  ocupado={enviando} textoOcupado="Enviando…"
  onChange={(arquivo) => enviar(arquivo)}
/>`}</ComoUsar>
      <Regras itens={[
        "Enviando: a imagem (ou as iniciais) esmaece, o carregando gira por cima, “Enviando…” aparece embaixo (role=“status”) e o botão fica aria-busy e aria-disabled; soltar ou escolher outro arquivo não faz nada. O Remover some até acabar.",
        "Iniciais: até 2 letras no círculo de destaque (--primary-muted, letras em --primary-text, fonte de títulos). No hover, “Adicionar” por cima.",
        "Com “menos movimento”, o carregando fica parado.",
      ]} />
      <DoDont
        dos={["Avise o resultado (foto salva ou erro) num Alert perto da foto.", "Use as iniciais do nome que a pessoa vê no perfil."]}
        donts={["Não escreva “Enviando…” à parte: o componente já mostra.", "Não deixe a pessoa trocar a foto no meio do envio."]}
      />
    </section>
  );
}

/* ── Quadro com link esticado ── */

type ItemDoQuadro = { id: string; nome: string; bairro: string; etapa: "contato" | "visita" | "cadastro" };

export function SecaoQuadroComLinkEsticado() {
  const [itens, setItens] = React.useState<ItemDoQuadro[]>([
    { id: "1", nome: "Loja Aurora", bairro: "Centro", etapa: "contato" },
    { id: "2", nome: "Brechó Fio", bairro: "Batel", etapa: "visita" },
  ]);
  const [aviso, setAviso] = React.useState("Toque no nome (abre a ficha), em Lembrar ou em Mover.");
  return (
    <section id="quadro-link-esticado" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Quadro com o cartão inteiro clicável"
        quando="Quando o cartão do Quadro abre uma ficha, o link do nome cobre o cartão inteiro (link esticado). O botão “Mover para” e os botões e campos de dentro do cartão ficam por cima do link e continuam clicáveis."
        arquivo="ui/quadro.tsx"
        nomes={["Quadro (cartao com link esticado)"]}
      />
      <Card>
        <CardContent className="grid gap-4 p-6">
          <Quadro
            rotulo="Ativação das lojas, com link esticado (exemplo)"
            colunas={[{ id: "contato", titulo: "Contato" }, { id: "visita", titulo: "Visita" }, { id: "cadastro", titulo: "Cadastro" }]}
            itens={itens}
            chave={i => i.id}
            coluna={i => i.etapa}
            rotuloItem={i => i.nome}
            onMover={(i, para) => { setItens(l => l.map(x => (x.id === i.id ? { ...x, etapa: para } : x))); setAviso(`${i.nome} foi para ${para === "contato" ? "Contato" : para === "visita" ? "Visita" : "Cadastro"}.`); }}
            cartao={i => (
              <div className="min-w-0 space-y-2">
                <a
                  href="#quadro-link-esticado"
                  data-link-esticado
                  onClick={e => { e.preventDefault(); setAviso(`Abriria a ficha de ${i.nome}.`); }}
                  className="block rounded-sm text-body-sm font-semibold text-foreground after:absolute after:inset-0 after:content-[''] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {i.nome}
                </a>
                <p className="m-0 text-label text-muted-foreground">{i.bairro}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => setAviso(`Lembrete criado para ${i.nome}.`)}><CalendarCheck aria-hidden /> Lembrar</Button>
              </div>
            )}
          />
          <p aria-live="polite" data-aviso-do-quadro className="m-0 text-body-sm text-muted-foreground">{aviso}</p>
        </CardContent>
      </Card>
      <ComoUsar>{`cartao={(loja) => (
  <>
    <a href={ficha(loja)} className="after:absolute after:inset-0 after:content-['']">{loja.nome}</a>
    <Button size="sm" variant="outline">Lembrar</Button> // fica acima do link sozinho
    <a href={site(loja)} data-acima-do-link>Site</a> // outro link: marque para ficar acima
  </>
)}`}</ComoUsar>
      <Regras itens={[
        "O cartão é relative; o ::after do link esticado cobre o cartão inteiro, e o hover do cartão continua o mesmo.",
        "O “Mover para” e os botões, campos e itens com role=“button” de dentro do cartão ficam em relative z-10, acima do link. Outro link dentro do cartão leva data-acima-do-link.",
      ]} />
      <DoDont
        dos={["Estique só o link principal (o nome).", "Mantenha o botão Mover para, além de arrastar."]}
        donts={["Não estique dois links no mesmo cartão.", "Não envolva o cartão inteiro num <a> com botões dentro (controle dentro de controle)."]}
      />
    </section>
  );
}

/* ── Janela, busca de comandos e cabeçalho sem itens ── */

const CIDADES = ["Curitiba", "Campinas", "Florianópolis", "Porto Alegre", "São Paulo"];

export function SecaoJanelasECabecalho() {
  const [busca, setBusca] = React.useState("");
  const [aberta, setAberta] = React.useState(false);
  const [escolhida, setEscolhida] = React.useState("");
  // Lista já filtrada fora do Command (como uma busca no servidor): shouldFilter={false}.
  const filtradas = CIDADES.filter(c => c.toLowerCase().startsWith(busca.trim().toLowerCase()));
  return (
    <section id="janelas-e-cabecalho" className="scroll-mt-32 space-y-6">
      <Cabecalho
        titulo="Janela, busca de comandos e cabeçalho sem itens"
        quando="Ajustes de 28/11/2026: o X de fechar das janelas com 44 px de área no toque; a busca de comandos com o título dentro da janela e as props de busca do Command; o cabeçalho do site sem itens, sem o botão Menu no celular."
        arquivo="ui/dialog.tsx · ui/command.tsx · ui/cabecalho-do-site.tsx"
        nomes={["DialogContent (fechar)", "CommandDialog (filter, shouldFilter, loop, value, onValueChange)", "CabecalhoDoSite (itens vazios)"]}
      />
      <Card>
        <CardContent className="grid gap-6 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Dialog>
              <DialogTrigger asChild><Button type="button" variant="outline">Abrir uma janela</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Janela de exemplo</DialogTitle>
                  <DialogDescription>No celular, o X tem 44 × 44 px de área de toque; o desenho continua pequeno.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button type="button" variant="outline" onClick={() => setAberta(true)}><Search aria-hidden /> Buscar cidade</Button>
            <p aria-live="polite" className="m-0 text-body-sm text-muted-foreground">{escolhida ? `Cidade escolhida: ${escolhida}.` : ""}</p>
          </div>
          <CommandDialog open={aberta} onOpenChange={setAberta} title="Buscar cidade" description="Digite o começo do nome da cidade." shouldFilter={false}>
            <CommandInput placeholder="Digite o nome da cidade" value={busca} onValueChange={setBusca} />
            <CommandList>
              <CommandEmpty>Nenhuma cidade com esse começo.</CommandEmpty>
              <CommandGroup heading="Cidades (exemplo)">
                {filtradas.map(c => <CommandItem key={c} value={c} onSelect={() => { setEscolhida(c); setAberta(false); }}>{c}</CommandItem>)}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
          <div className="border-t border-border pt-5">
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Cabeçalho sem itens, no celular</h3>
            <div className="max-w-sm overflow-hidden rounded-lg border border-border" data-cards-ignorar>
              <CabecalhoDoSite itens={[]} tela="celular" posicao="sticky" esconderAoRolar={false} inicioHref="#janelas-e-cabecalho" acao={{ rotulo: "Entrar", href: "#janelas-e-cabecalho", icone: <LogIn aria-hidden /> }} />
            </div>
          </div>
        </CardContent>
      </Card>
      <ComoUsar>{`<CommandDialog open={aberta} onOpenChange={setAberta} title="Buscar cidade"
  shouldFilter={false}              // a lista já vem filtrada (do servidor)
  filter={(valor, busca) => …}      // ou um filtro próprio
>…</CommandDialog>

<CabecalhoDoSite itens={[]} acao={{ rotulo: "Entrar", href: "/entrar" }} />   // sem botão Menu`}</ComoUsar>
      <Regras itens={[
        "Fechar das janelas: desenho de 24 px; no toque, um ::after invisível de 44 × 44 px centralizado (data-alvo-compacto evita que a regra global aumente o desenho).",
        "CommandDialog: título e descrição dentro da janela, escondidos na tela e lidos por leitores de tela (o Radix pede o DialogTitle dentro do conteúdo).",
        "CabecalhoDoSite sem itens: no celular, nada de botão Menu (abriria uma folha vazia); as ações ficam na faixa, ao lado do logo.",
      ]} />
      <DoDont
        dos={["Use shouldFilter={false} quando a busca for feita fora (no servidor).", "Deixe o cabeçalho sem itens nas telas de entrar e de cadastro."]}
        donts={["Não crie um botão de fechar próprio: o da janela já tem a área de toque certa.", "Não mostre o botão Menu sem nada para mostrar."]}
      />
    </section>
  );
}
