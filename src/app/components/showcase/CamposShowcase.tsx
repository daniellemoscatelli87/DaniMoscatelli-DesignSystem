import React, { useState } from "react";
import { Building2, Laptop, Send, Store, Trash2, User } from "lucide-react";
import { useI18n } from "../../i18n";
import { SectionBlock, ShowcaseCard } from "./shared/SectionBlock";
import { Campo, CampoDeCnpj, CampoDeTelefone, GradeDeCampos, ResumoDeErros, cnpjValido } from "../ui/campo";
import { CampoDeEmail } from "../ui/campo-de-email";
import { CampoEstadoCidade } from "../ui/campo-estado-cidade";
import { CampoDeBusca } from "../ui/campo-de-busca";
import { CampoCopiavel } from "../ui/campo-copiavel";
import { CampoDeEmails } from "../ui/campo-de-emails";
import { GrupoDeChipsFiltraveis } from "../ui/chip-filtravel";
import { GrupoDeCartoesDeEscolha, CartaoDeEscolha } from "../ui/cartao-de-escolha";
import { BotaoDeEnvio, type EstadoDoEnvio } from "../ui/botao-de-envio";
import { TabelaAdaptavel } from "../ui/tabela-adaptavel";
import { ChipDeEstado } from "../ui/chip-de-estado";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { EstadoVazio } from "../ui/estado-vazio";

/* Campos (27/11/2026): o campo padrão, e-mail com sugestão, estado e cidade, máscaras, busca, copiar, vários e-mails,
   chips de filtro, cartões de escolha, botão com estados de envio e a tabela que se adapta. */

/* Cidades de exemplo para a demonstração (o produto usa a lista do IBGE). */
const CIDADES_DE_EXEMPLO: Record<string, string[]> = {
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"],
  SP: ["Campinas", "Santos", "São Paulo"],
  SC: ["Blumenau", "Florianópolis", "Joinville"],
};
const carregarCidadesDeExemplo = (uf: string) =>
  new Promise<string[]>(resolve => window.setTimeout(() => resolve(CIDADES_DE_EXEMPLO[uf] ?? ["Capital (exemplo)"]), 500));

function DemoCampos() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [nome, setNome] = useState("");
  const [enviado, setEnviado] = useState(false);
  const erroNome = enviado && nome.trim().length < 2 ? t("Enter your full name.", "Informe seu nome completo.") : null;
  const erroCnpj = cnpj && cnpj.replace(/\D/g, "").length === 14 && !cnpjValido(cnpj) ? t("This CNPJ doesn't exist. Check the numbers.", "Este CNPJ não existe. Confira os números.") : null;
  const erroEmail = enviado && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? t("Enter an e-mail like name@example.com.", "Informe um e-mail como nome@exemplo.com.") : null;
  const erros = [erroNome && { id: "demo-nome", rotulo: t("Full name", "Nome completo"), mensagem: erroNome }, erroEmail && { id: "demo-email", rotulo: "E-mail", mensagem: erroEmail }].filter(Boolean) as { id: string; rotulo: string; mensagem: string }[];
  return (
    <ShowcaseCard>
      <form noValidate onSubmit={e => { e.preventDefault(); setEnviado(true); }} className="grid gap-6">
        <p className="text-body-sm text-muted-foreground">{t("* Required fields", "* Campos obrigatórios")}</p>
        {erros.length >= 2 && <ResumoDeErros erros={erros} titulo={t(`Check ${erros.length} fields before continuing`, `Confira ${erros.length} campos antes de continuar`)} />}
        <GradeDeCampos>
          <Campo id="demo-nome" rotulo={t("Full name", "Nome completo")} obrigatorio autoComplete="name" value={nome} onChange={e => setNome(e.target.value)} erro={erroNome} />
          <CampoDeEmail id="demo-email" rotulo="E-mail" obrigatorio valor={email} onValorChange={setEmail} erro={erroEmail} ajuda={t("Type “ana@g” to see the suggestions.", "Digite “ana@g” para ver as sugestões.")} />
          <CampoDeTelefone rotulo={t("Phone / WhatsApp", "Telefone / WhatsApp")} valor={tel} onValorChange={setTel} />
          <CampoDeCnpj rotulo="CNPJ" valor={cnpj} onValorChange={setCnpj} erro={erroCnpj} ajuda={t("Only the numbers; the mask is automatic.", "Só os números; a máscara é automática.")} />
          <Campo rotulo={t("Message", "Mensagem")} inteiro ajuda={t("Up to 500 characters.", "Até 500 caracteres.")}>
            {p => <Textarea {...p} rows={3} className="bg-card text-body" />}
          </Campo>
        </GradeDeCampos>
        <CampoEstadoCidade uf={uf} cidade={cidade} onChange={(u, c) => { setUf(u); setCidade(c); }} carregarCidades={carregarCidadesDeExemplo} obrigatorio />
        <div className="flex justify-end border-t border-border pt-4">
          <Button type="submit">{t("Check form", "Conferir formulário")}</Button>
        </div>
      </form>
    </ShowcaseCard>
  );
}

function DemoBusca() {
  const { t } = useI18n();
  const [busca, setBusca] = useState("");
  const nomes = ["Ana Ribeiro", "Bruno Lima", "Carla Souza", "Daniel Prado", "Elisa Martins"];
  const achados = nomes.filter(n => n.toLowerCase().includes(busca.toLowerCase()));
  return (
    <ShowcaseCard className="grid gap-4">
      <CampoDeBusca valor={busca} onValorChange={setBusca} rotulo={t("Search partners", "Buscar parceiros")} resultados={achados.length} />
      {achados.length ? (
        <ul className="divide-y divide-border rounded-md border border-border">
          {achados.map(n => <li key={n} className="px-4 py-3 text-body-sm text-foreground">{n}</li>)}
        </ul>
      ) : (
        <EstadoVazio tamanho="sm" nivel={3} titulo={t("No partner with this name", "Nenhum parceiro com este nome")} descricao={t("Check the spelling or search by surname.", "Confira a grafia ou busque pelo sobrenome.")} acoes={<Button variant="outline" onClick={() => setBusca("")}>{t("Clear search", "Limpar busca")}</Button>} />
      )}
    </ShowcaseCard>
  );
}

function DemoEmails() {
  const { t } = useI18n();
  const [para, setPara] = useState<string[]>(["ana@exemplo.com", "bruno@exemplo"]);
  return (
    <ShowcaseCard className="grid gap-2">
      <Label htmlFor="demo-para" className="text-body-sm font-semibold">{t("To", "Para")}</Label>
      <CampoDeEmails id="demo-para" valor={para} onValorChange={setPara} aria-describedby="demo-para-ajuda" />
      <p id="demo-para-ajuda" className="text-body-sm text-muted-foreground">{t("Press Enter, comma or space after each e-mail. You can paste a list.", "Aperte Enter, vírgula ou espaço depois de cada e-mail. Dá para colar uma lista.")}</p>
    </ShowcaseCard>
  );
}

function DemoChips() {
  const { t } = useI18n();
  const [valor, setValor] = useState<string[]>(["novas"]);
  return (
    <ShowcaseCard>
      <GrupoDeChipsFiltraveis
        rotulo={t("Filter by status", "Filtrar por status")}
        valor={valor}
        onValorChange={setValor}
        opcoes={[
          { valor: "novas", rotulo: t("New", "Novas"), contagem: 3 },
          { valor: "respondidas", rotulo: t("Answered", "Respondidas"), contagem: 12 },
          { valor: "arquivadas", rotulo: t("Archived", "Arquivadas") },
        ]}
      />
    </ShowcaseCard>
  );
}

function DemoEscolha() {
  const { t } = useI18n();
  const [v, setV] = useState("digital");
  return (
    <ShowcaseCard>
      <p id="demo-negocio" className="mb-4 text-body-sm font-semibold text-foreground">{t("My business is…", "Meu negócio é…")}</p>
      <GrupoDeCartoesDeEscolha aria-labelledby="demo-negocio" value={v} onValueChange={setV} colunas={2}>
        <CartaoDeEscolha valor="digital" icone={<Laptop />} titulo={t("A digital product or service", "Um produto ou serviço digital")} descricao={t("SaaS, e-commerce, app, system", "SaaS, e-commerce, aplicativo, sistema")} />
        <CartaoDeEscolha valor="fisico" icone={<Store />} titulo={t("A physical business", "Um negócio físico")} descricao={t("Clinics, salons, restaurants, hotels", "Clínicas, salões, restaurantes, hotéis")} />
        <CartaoDeEscolha valor="ambos" icone={<Building2 />} titulo={t("Physical and digital", "Físico e digital")} descricao={t("Store and online channels together", "Loja e canais on-line juntos")} />
        <CartaoDeEscolha valor="pessoa" icone={<User />} titulo={t("I'm a professional", "Sou profissional autônomo")} descricao={t("Consulting, services, freelance", "Consultoria, serviços, freelance")} desabilitado />
      </GrupoDeCartoesDeEscolha>
    </ShowcaseCard>
  );
}

function DemoBotoes() {
  const { t } = useI18n();
  const [estado, setEstado] = useState<EstadoDoEnvio>("parado");
  const [falhar, setFalhar] = useState(false);
  const enviar = () => {
    setEstado("enviando");
    window.setTimeout(() => { setEstado(falhar ? "erro" : "feito"); setFalhar(f => !f); }, 1400);
  };
  return (
    <ShowcaseCard className="grid gap-4">
      <p className="text-body-sm text-muted-foreground">{t("Click: sending, then sent with a check, then back. Every second click fails, to show “Try again”.", "Clique: enviando, depois enviado com check, depois volta. Um clique sim, outro não, a demonstração falha, para mostrar o “Tentar de novo”.")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <BotaoDeEnvio estado={estado} onClick={enviar} onVoltar={() => setEstado("parado")} icone={<Send aria-hidden />}>{t("Notify me", "Quero ser avisado")}</BotaoDeEnvio>
        <Button variant="outline-destructive"><Trash2 aria-hidden />{t("Delete announcement", "Excluir comunicado")}</Button>
      </div>
    </ShowcaseCard>
  );
}

type Parceiro = { nome: string; especialidade: string; cidade: string; desde: string; estado: "ativo" | "analise" };
const PARCEIROS: Parceiro[] = [
  { nome: "Parceira de exemplo 1", especialidade: "UX Research", cidade: "Curitiba", desde: "03/2026", estado: "ativo" },
  { nome: "Parceiro de exemplo 2", especialidade: "Engenharia de dados", cidade: "Florianópolis", desde: "07/2026", estado: "analise" },
  { nome: "Parceira de exemplo 3", especialidade: "Design de serviços", cidade: "São Paulo", desde: "10/2026", estado: "ativo" },
];

function DemoTabela() {
  const { t } = useI18n();
  return (
    <TabelaAdaptavel
      legenda={t("Partners (example data)", "Parceiros (dados de exemplo)")}
      mostrarLegenda
      linhas={PARCEIROS}
      chave={p => p.nome}
      colunas={[
        { id: "nome", titulo: t("Name", "Nome"), celula: p => p.nome, principal: true },
        { id: "esp", titulo: t("Specialty", "Especialidade"), celula: p => p.especialidade },
        { id: "cidade", titulo: t("City", "Cidade"), celula: p => p.cidade, prioridade: 3 },
        { id: "desde", titulo: t("Since", "Desde"), celula: p => p.desde, prioridade: 2, alinhar: "fim" },
        { id: "estado", titulo: "Status", celula: p => <ChipDeEstado tom={p.estado === "ativo" ? "sucesso" : "aviso"}>{p.estado === "ativo" ? t("Active", "Ativo") : t("In review", "Em análise")}</ChipDeEstado> },
      ]}
      acoes={() => <Button variant="outline" size="sm">{t("Open", "Abrir")}</Button>}
    />
  );
}

export function CamposShowcase() {
  const { t } = useI18n();
  return (
    <div className="space-y-20">
      <SectionBlock
        id="campos-campo"
        titulo={t("Field, e-mail, state and city, masks", "Campo, e-mail, estado e cidade, máscaras")}
        quando={t(
          "Campo is the standard field: label, control, help and error always in the same order and linked for screen readers. CampoDeEmail suggests the domain, CampoEstadoCidade pairs state and city, and phone and CNPJ get the mask while typing.",
          "Campo é o campo padrão: rótulo, controle, ajuda e erro sempre na mesma ordem e ligados para leitores de tela. CampoDeEmail sugere o domínio, CampoEstadoCidade junta estado e cidade, e telefone e CNPJ ganham a máscara enquanto a pessoa digita.",
        )}
        arquivo="ui/campo.tsx · ui/campo-de-email.tsx · ui/campo-estado-cidade.tsx"
        nomes={["Campo", "GradeDeCampos", "MensagemDeErro", "ResumoDeErros", "CampoDeEmail", "CampoEstadoCidade", "CampoDeTelefone", "CampoDeCnpj"]}
        api={`<Campo rotulo="Nome completo" obrigatorio erro={erro} value={nome} onChange={…} />
<Campo rotulo="Mensagem" ajuda="Até 500 caracteres.">{p => <Textarea {...p} />}</Campo>
<CampoDeEmail rotulo="E-mail" valor={email} onValorChange={setEmail} />
<CampoEstadoCidade uf={uf} cidade={cidade} onChange={(uf, cidade) => …} />
<CampoDeTelefone rotulo="Telefone" valor={tel} onValorChange={setTel} />
<CampoDeCnpj rotulo="CNPJ" valor={cnpj} onValorChange={setCnpj} erro={cnpjValido(cnpj) ? null : "…"} />`}
        faca={[
          t("Label always visible above the field; the placeholder is only an example.", "Rótulo sempre visível acima do campo; o placeholder é só um exemplo."),
          t("Say how to fix the error (“Enter an e-mail like name@example.com”).", "Diga como corrigir o erro (“Informe um e-mail como nome@exemplo.com”)."),
        ]}
        naoFaca={[
          t("Don't use the placeholder as the label.", "Não use o placeholder no lugar do rótulo."),
          t("Don't show the error only by the red border.", "Não mostre o erro só pela borda vermelha."),
        ]}
      >
        <DemoCampos />
      </SectionBlock>

      <SectionBlock
        id="campos-busca"
        titulo={t("Search and copy", "Busca e copiar")}
        quando={t(
          "CampoDeBusca filters a list (magnifier, clear button, Esc clears, results announced). CampoCopiavel shows a value to copy, like a survey link, with the copied feedback.",
          "CampoDeBusca filtra uma lista (lupa, botão limpar, Esc limpa, resultados anunciados). CampoCopiavel mostra um valor para copiar, como o link de uma pesquisa, com o retorno de copiado.",
        )}
        arquivo="ui/campo-de-busca.tsx · ui/campo-copiavel.tsx"
        nomes={["CampoDeBusca", "CampoCopiavel"]}
        api={`<CampoDeBusca valor={busca} onValorChange={setBusca} rotulo="Buscar parceiros" resultados={lista.length} />
<CampoCopiavel rotulo="Link da pesquisa" mostrarRotulo valor="https://danimoscatelli.com.br/pesquisa/…" />`}
      >
        <DemoBusca />
        <ShowcaseCard>
          <CampoCopiavel rotulo={t("Survey link", "Link da pesquisa")} mostrarRotulo valor="https://danimoscatelli.com.br/pesquisa/moda-curitiba/?origem=exemplo" />
        </ShowcaseCard>
      </SectionBlock>

      <SectionBlock
        id="campos-emails"
        titulo={t("Several e-mails", "Vários e-mails")}
        quando={t(
          "To, Cc and Bcc of a new e-mail, invitations: each e-mail becomes a tag; wrong formats stay marked to fix.",
          "Para, Cc e Cco de um e-mail novo, convites: cada e-mail vira uma etiqueta; formato errado fica marcado para corrigir.",
        )}
        arquivo="ui/campo-de-emails.tsx"
        nomes={["CampoDeEmails"]}
        api={`<Label htmlFor="para">Para</Label>
<CampoDeEmails id="para" valor={para} onValorChange={setPara} />`}
      >
        <DemoEmails />
      </SectionBlock>

      <SectionBlock
        id="campos-chips"
        titulo={t("Filter chips", "Chips de filtro")}
        quando={t(
          "Quick filters above a list. On: selected pink with a check; off: border with grey hover.",
          "Filtros rápidos acima de uma lista. Ligado: rosa de selecionado com check; desligado: borda com hover cinza.",
        )}
        arquivo="ui/chip-filtravel.tsx"
        nomes={["ChipFiltravel", "GrupoDeChipsFiltraveis"]}
        api={`<GrupoDeChipsFiltraveis rotulo="Filtrar por status" valor={filtros} onValorChange={setFiltros}
  opcoes={[{ valor: "novas", rotulo: "Novas", contagem: 3 }, …]} />`}
      >
        <DemoChips />
      </SectionBlock>

      <SectionBlock
        id="campos-escolha"
        titulo={t("Choice cards", "Cartões de escolha")}
        quando={t(
          "One choice among 2 to 4 big options that change the path and need a sentence of explanation. Selected: primary border with the shine, selected pink background, icon on the pink base and the radio checked.",
          "Uma escolha entre 2 a 4 opções grandes que mudam o caminho e precisam de uma frase de explicação. Selecionado: borda na primária com o brilho, fundo no rosa de selecionado, ícone na base rosa e o rádio marcado.",
        )}
        arquivo="ui/cartao-de-escolha.tsx · ui/shine-border.tsx"
        nomes={["GrupoDeCartoesDeEscolha", "CartaoDeEscolha", "BrilhoDeSelecionado", "molduraDoSelecionavel"]}
        api={`<GrupoDeCartoesDeEscolha aria-labelledby="pergunta" value={v} onValueChange={setV} colunas={2}>
  <CartaoDeEscolha valor="digital" icone={<Laptop />} titulo="Um produto digital" descricao="SaaS, app, sistema" />
</GrupoDeCartoesDeEscolha>`}
        faca={[t("Use for 2 to 4 options with an explanation.", "Use para 2 a 4 opções com explicação.")]}
        naoFaca={[t("Don't use for short options: that is the Segmented control.", "Não use para opções curtas: isso é o Controle segmentado.")]}
      >
        <DemoEscolha />
      </SectionBlock>

      <SectionBlock
        id="campos-botoes"
        titulo={t("Send button and delete in outline", "Botão de envio e exclusão em contorno")}
        quando={t(
          "BotaoDeEnvio gives feedback for each send without changing size (sending, sent with a check, try again). The outline-destructive Button is for deleting when it isn't the main action; the confirmation keeps the filled destructive button.",
          "BotaoDeEnvio dá o retorno de cada envio sem mudar de tamanho (enviando, enviado com check, tentar de novo). O Button outline-destructive é para excluir quando não é a ação principal; a confirmação continua com o botão destructive cheio.",
        )}
        arquivo="ui/botao-de-envio.tsx · ui/button.tsx"
        nomes={["BotaoDeEnvio", 'Button variant="outline-destructive"']}
        api={`<BotaoDeEnvio estado={estado} onClick={enviar} onVoltar={() => setEstado("parado")}>Quero ser avisado</BotaoDeEnvio>
<Button variant="outline-destructive"><Trash2 /> Excluir</Button>`}
      >
        <DemoBotoes />
      </SectionBlock>

      <SectionBlock
        id="campos-tabela"
        titulo={t("Adaptive table", "Tabela adaptável")}
        quando={t(
          "A table that never scrolls sideways: less important columns leave first (with a notice) and, below 480 px, each row becomes a block with label and value. Resize the window to see it.",
          "Uma tabela que nunca rola para o lado: as colunas menos importantes saem primeiro (com aviso) e, abaixo de 480 px, cada linha vira um bloco com rótulo e valor. Mude a largura da janela para ver.",
        )}
        arquivo="ui/tabela-adaptavel.tsx"
        nomes={["TabelaAdaptavel"]}
        api={`<TabelaAdaptavel legenda="Parceiros" linhas={parceiros} chave={p => p.id}
  colunas={[{ id: "nome", titulo: "Nome", celula: p => p.nome, principal: true },
            { id: "cidade", titulo: "Cidade", celula: p => p.cidade, prioridade: 3 }]}
  acoes={p => <Button size="sm" variant="outline">Abrir</Button>} />`}
      >
        <DemoTabela />
      </SectionBlock>
    </div>
  );
}
