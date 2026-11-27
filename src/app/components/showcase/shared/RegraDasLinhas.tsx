import React, { useState } from "react";
import { Check, X, Trash2, CircleDot, Clock, CheckCircle2, RotateCcw } from "lucide-react";
import { useI18n, type Bi } from "../../../i18n";
import { LinhaDeLista } from "../../ui/linha-de-lista";
import { Checkbox } from "../../ui/checkbox";
import { Badge } from "../../ui/badge";
import { Callout, DoDont, Mono } from "./Guidance";

/*
 * Regras da dona do produto (24/11/2026) para linhas de listas, tabelas e grades, com exemplo certo e errado na
 * largura do celular, e a decisão de 27/11/2026: no celular, tags e ações descem para uma linha própria embaixo do
 * texto (padrão da LinhaDeLista, quebraAcoes="estreito"). Mesmo arquivo nos dois design systems (FindLook e Dani Moscatelli).
 */

type Estado = "andamento" | "afazer" | "feito";
type Item = { id: number; titulo: Bi; texto: Bi; estado: Estado };

const ITENS: Item[] = [
  {
    id: 1,
    titulo: { en: "Review the home page copy", pt: "Revisar os textos da página inicial" },
    texto: { en: "Check the titles, the description and the main button before publishing the new version.", pt: "Conferir os títulos, a descrição e o botão principal antes de publicar a nova versão." },
    estado: "andamento",
  },
  {
    id: 2,
    titulo: { en: "Update the team photos", pt: "Atualizar as fotos da equipe" },
    texto: { en: "Replace the old photos and check the alternative text of each one.", pt: "Trocar as fotos antigas e conferir o texto alternativo de cada uma." },
    estado: "afazer",
  },
  {
    id: 3,
    titulo: { en: "Answer the contact messages", pt: "Responder as mensagens de contato" },
    texto: { en: "Three messages from this week are waiting for an answer.", pt: "Três mensagens desta semana estão esperando resposta." },
    estado: "feito",
  },
];

const ESTADOS: Record<Estado, { rotulo: Bi; Icone: React.ElementType }> = {
  andamento: { rotulo: { en: "In progress", pt: "Em andamento" }, Icone: CircleDot },
  afazer: { rotulo: { en: "To do", pt: "A fazer" }, Icone: Clock },
  feito: { rotulo: { en: "Done", pt: "Feito" }, Icone: CheckCircle2 },
};

function Tag({ estado }: { estado: Estado }) {
  const { bi } = useI18n();
  const e = ESTADOS[estado];
  return <Badge variant="outline" className="h-6 rounded-full bg-card px-2"><e.Icone aria-hidden />{bi(e.rotulo)}</Badge>;
}

const lixeira = "flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * Moldura com a largura de um celular (360 px), para mostrar a linha como ela fica no telefone. É moldura de aparelho,
 * não card de conteúdo: o par certo/errado fica fora da regra de mesma altura (data-cards-ignorar na grade do par).
 */
function Celular({ tipo, legenda, children }: { tipo: "certo" | "errado"; legenda: string; children: React.ReactNode }) {
  const { t } = useI18n();
  const certo = tipo === "certo";
  return (
    <figure className="m-0 min-w-0">
      <figcaption className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.8125rem] font-semibold text-foreground">
        <span aria-hidden className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${certo ? "bg-[var(--success-text)] text-white" : "bg-[var(--error-text)] text-white"}`}>
          {certo ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
        </span>
        {certo ? t("Correct", "Certo") : t("Incorrect", "Errado")}
        <span className="font-normal text-muted-foreground">· {legenda}</span>
      </figcaption>
      <div className="w-full max-w-[22.5rem] overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-[0.75rem] font-semibold text-foreground">{t("Tasks", "Tarefas")}</span>
          <span className="text-[0.6875rem] text-muted-foreground">360 px</span>
        </div>
        {children}
      </div>
    </figure>
  );
}

/**
 * Exemplo certo, com LinhaDeLista: tags e ações numa linha própria embaixo do texto, hover e seleção na linha
 * inteira, sem cantos. A moldura simula o celular, então mostra o padrão do celular (quebraAcoes="estreito") em
 * qualquer tela, com quebraAcoes={true}.
 */
function ListaCerta() {
  const { t, bi } = useI18n();
  const [itens, setItens] = useState(ITENS);
  const [marcados, setMarcados] = useState<number[]>([2]);
  const alternar = (id: number) => setMarcados(m => (m.includes(id) ? m.filter(x => x !== id) : [...m, id]));
  return (
    <>
      <ul className="divide-y divide-border" aria-label={t("Tasks (correct example)", "Tarefas (exemplo certo)")}>
        {itens.map(i => (
          <LinhaDeLista
            key={i.id}
            as="li"
            quebraAcoes
            selecionada={marcados.includes(i.id)}
            onClick={() => alternar(i.id)}
            inicio={<span className="flex h-5 items-center" onClick={e => e.stopPropagation()}><Checkbox aria-label={`${t("Select", "Selecionar")} ${bi(i.titulo)}`} checked={marcados.includes(i.id)} onCheckedChange={() => alternar(i.id)} /></span>}
            titulo={bi(i.titulo)}
            descricao={bi(i.texto)}
            fim={
              <>
                <Tag estado={i.estado} />
                <button type="button" aria-label={`${t("Delete", "Excluir")} ${bi(i.titulo)}`} className={lixeira} onClick={e => { e.stopPropagation(); setItens(l => l.filter(x => x.id !== i.id)); }}>
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </>
            }
          />
        ))}
      </ul>
      {itens.length < ITENS.length && (
        <div className="border-t border-border px-4 py-2.5">
          <button type="button" onClick={() => setItens(ITENS)} className="inline-flex items-center gap-1.5 rounded-sm text-[0.75rem] font-semibold text-[var(--primary-text,var(--primary))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <RotateCcw aria-hidden className="h-3.5 w-3.5" /> {t("Restore the example", "Restaurar o exemplo")}
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Exemplo errado (o erro que originou a regra): áreas de grid "l1 sit" / "res res" no celular. A segunda linha do
 * texto passa por baixo da tag e da lixeira, e o hover é uma caixa cinza arredondada só no bloco do texto.
 * Só ilustração: escondido de leitores de tela (há uma descrição em texto) e fora da conferência automática.
 */
function ListaErrada() {
  const { t, bi } = useI18n();
  return (
    <div data-gc-ignorar="">
      <p className="sr-only">{t(
        "Incorrect example: the second line of text runs under the status tag and the trash icon, and the hover is a rounded grey box around the text only, leaving out the checkbox and the trash.",
        "Exemplo errado: a segunda linha do texto passa por baixo da tag de status e da lixeira, e o hover é uma caixa cinza arredondada só em volta do texto, deixando de fora a caixa de seleção e a lixeira.",
      )}</p>
      <ul aria-hidden className="divide-y divide-border">
        {ITENS.map((i, n) => (
          <li key={i.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 px-4 py-3 [grid-template-areas:'chk_l1_sit'_'chk_res_res']">
            <span className="[grid-area:chk] mt-0.5 h-4 w-4 rounded-[4px] border border-[var(--border-strong,var(--border))] bg-card" />
            <span className={`[grid-area:l1] self-center text-[0.875rem] font-semibold text-foreground ${n === 1 ? "-mx-2 -my-1 rounded-md bg-[var(--row-hover)] px-2 py-1 ring-1 ring-border" : ""}`}>{bi(i.titulo)}</span>
            <span className="[grid-area:sit] flex items-center gap-2"><Tag estado={i.estado} /><span className="flex h-8 w-8 items-center justify-center text-muted-foreground"><Trash2 className="h-4 w-4" /></span></span>
            <span className="[grid-area:res] mt-0.5 text-[0.8125rem] text-muted-foreground">{bi(i.texto)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Opção quebraAcoes={false}: tags e ações ao lado do texto também no celular, com o texto na coluna dele. */
function ListaAoLado() {
  const { t, bi } = useI18n();
  return (
    <ul className="divide-y divide-border" aria-label={t("Tasks (actions beside the text)", "Tarefas (ações ao lado do texto)")}>
      {ITENS.slice(0, 2).map(i => (
        <LinhaDeLista
          key={i.id}
          as="li"
          interativa
          quebraAcoes={false}
          titulo={bi(i.titulo)}
          descricao={bi(i.texto)}
          fim={
            <>
              <Tag estado={i.estado} />
              <button type="button" aria-label={`${t("Delete", "Excluir")} ${bi(i.titulo)}`} className={lixeira}><Trash2 aria-hidden className="h-4 w-4" /></button>
            </>
          }
        />
      ))}
    </ul>
  );
}

const codigo = `<ul className="divide-y divide-border">
  <LinhaDeLista
    as="li"
    inicio={<Checkbox aria-label="Selecionar" />}
    titulo="Revisar os textos da página inicial"
    descricao="Conferir os títulos e o botão principal."
    fim={<><Badge variant="outline">Em andamento</Badge><BotaoExcluir /></>}
    /* padrão: no celular, tags e ações descem para baixo do texto (quebraAcoes="estreito");
       quebraAcoes={false} as mantém ao lado em qualquer largura */
  />
</ul>`;

/** Seção completa da regra (página Dados > Linhas com tags e ações). */
export function RegraDasLinhas() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <Callout title={t("Product owner's rules (24/11/2026)", "Regras da dona do produto (24/11/2026)")}>
        <p className="font-semibold text-foreground">{t("1. In grids, text never goes past the tags or actions column.", "1. Nos grids, o texto nunca deve ultrapassar a coluna de tags ou ações.")}</p>
        <p className="mt-1">{t(
          "In any row of a list, table, grid or card list with a trailing column of tags, badges, status chips or actions (buttons, icons, menu, trash, a checkbox at the end), the text stays in its own column at every width. The trailing column keeps its width (auto, shrink-0); the text column is minmax(0,1fr) (min-w-0 flex-1) and wraps or is shortened inside it. On phones, never a summary with col-span-full or flex-basis 100%, and never grid areas such as \"res res\" that pass under the trailing column.",
          "Em toda linha de lista, tabela, grade ou lista de cards com uma coluna final de tags, selos, status ou ações (botões, ícones, menu, lixeira, caixa de seleção no fim), o texto fica na coluna dele em qualquer largura. A coluna final mantém a largura (auto, shrink-0); a coluna do texto é minmax(0,1fr) (min-w-0 flex-1) e quebra a linha ou é encurtada ali dentro. No celular, nunca um resumo com col-span-full ou flex-basis 100%, nem áreas de grid como \"res res\" que passam por baixo da coluna final.",
        )}</p>
        <p className="mt-3 font-semibold text-foreground">{t("2. Row hover covers the whole row, edge to edge, with no rounded corners.", "2. O hover da linha cobre a linha inteira, de ponta a ponta, sem cantos arredondados.")}</p>
        <p className="mt-1">{t(
          "The hover background (--row-hover) is painted on the whole row, including the leading controls (checkbox, avatar) and the trailing tags and actions, with border-radius 0. The only exception is a row that is itself a standalone card: it keeps the card's radius. The selected or checked row has the same shape. Inner controls (checkbox, trash, menu) may keep their own small hover, but the row hover is never a rounded box around part of the row. Keyboard focus on the row: an inset outline, no radius.",
          "O fundo do hover (--row-hover) pinta a linha inteira, incluindo os controles do início (caixa de seleção, avatar) e as tags e ações do fim, com border-radius 0. A única exceção é a linha que é um card sozinho: ela mantém o raio do card. A linha selecionada ou marcada tem a mesma forma. Os controles internos (caixa de seleção, lixeira, menu) podem ter o hover pequeno deles, mas o hover da linha nunca é uma caixa arredondada em volta de parte da linha. Foco do teclado na linha: contorno por dentro, sem cantos.",
        )}</p>
        <p className="mt-3 font-semibold text-foreground">{t("3. On phones, tags and actions move to their own row below the text (product owner's decision, 27/11/2026).", "3. No celular, tags e ações descem para uma linha própria embaixo do texto (decisão da dona do produto, 27/11/2026).")}</p>
        <p className="mt-1">{t(
          "This is the default for list rows: below 640 px, the tags, status and actions go to a row of their own below the whole text block, so the text uses the full width. In LinhaDeLista it is quebraAcoes=\"estreito\", the default; quebraAcoes={false} keeps them beside the text at every width (the text still stays in its own column), and quebraAcoes={true} puts them below at every width.",
          "É o padrão das linhas de lista: abaixo de 640 px, as tags, o status e as ações vão para uma linha própria embaixo de todo o bloco de texto, e o texto usa a largura toda. Na LinhaDeLista é quebraAcoes=\"estreito\", o padrão; quebraAcoes={false} as mantém ao lado do texto em qualquer largura (o texto continua na coluna dele), e quebraAcoes={true} as põe embaixo em qualquer largura.",
        )}</p>
      </Callout>

      <div data-cards-ignorar="" className="grid gap-6 md:grid-cols-2">
        <Celular tipo="certo" legenda={t("tags and actions below the text; full-row hover", "tags e ações embaixo do texto; hover na linha inteira")}>
          <ListaCerta />
        </Celular>
        <Celular tipo="errado" legenda={t("text under the tag and the trash; hover only on the text", "texto sob a tag e a lixeira; hover só no texto")}>
          <ListaErrada />
        </Celular>
      </div>
      <p className="text-[0.8125rem] text-muted-foreground">{t(
        "Hover or tap a row in the correct example: the whole row lights up, square, from the checkbox to the trash. Checked rows use the same shape.",
        "Passe o mouse ou toque numa linha do exemplo certo: a linha inteira acende, sem cantos, da caixa de seleção à lixeira. A linha marcada usa a mesma forma.",
      )}</p>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className="min-w-0">
          <p className="mb-2 text-[0.8125rem] font-semibold text-foreground">{t("Where the tags and actions go", "Onde ficam as tags e ações")}</p>
          <ul className="list-disc space-y-1.5 pl-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            <li>{t("Default: on phones, in their own row below the whole text block, starting at the left edge of the text column (the same x as the title), tag first, then the date or action, 8 px apart, centred with each other (LinhaDeLista quebraAcoes=\"estreito\"); from 640 px, in the trailing column. Pushing them to the right edge (alinharAcoesAbaixo=\"fim\") separates them from the text they belong to.", "Padrão: no celular, numa linha própria embaixo de todo o bloco de texto, começando na borda esquerda da coluna do texto (o mesmo x do título), a tag primeiro e depois a data ou a ação, a 8 px uma da outra, centralizadas entre si (LinhaDeLista quebraAcoes=\"estreito\"); a partir de 640 px, na coluna final. Empurrar para a borda direita (alinharAcoesAbaixo=\"fim\") afasta a linha do texto a que ela pertence.")}</li>
            <li>{t("Beside the text at every width: quebraAcoes={false}. The text stays in its own column and wraps there.", "Ao lado do texto em qualquer largura: quebraAcoes={false}. O texto fica na coluna dele e quebra ali.")}</li>
            <li>{t("Below the text at every width: quebraAcoes={true}. Or the row becomes a stacked card.", "Embaixo do texto em qualquer largura: quebraAcoes={true}. Ou a linha vira um card empilhado.")}</li>
            <li>{t("Never beside text that continues under them.", "Nunca ao lado de um texto que continua por baixo delas.")}</li>
          </ul>
        </div>
        <Celular tipo="certo" legenda={t("quebraAcoes={false}: beside the text, text in its own column", "quebraAcoes={false}: ao lado do texto, texto na coluna dele")}>
          <ListaAoLado />
        </Celular>
      </div>

      <DoDont
        dos={[
          t("Use LinhaDeLista (ui/linha-de-lista.tsx): grid auto | minmax(0,1fr) | auto.", "Use a LinhaDeLista (ui/linha-de-lista.tsx): grade auto | minmax(0,1fr) | auto."),
          t("On phones, put the tags and actions in their own row below the text (the default).", "No celular, ponha as tags e ações numa linha própria embaixo do texto (o padrão)."),
          t("Keep the trailing column at its width and top-aligned when the text wraps.", "Mantenha a coluna final na largura dela e no topo quando o texto quebra."),
          t("Wrap, clamp or truncate the text inside its own column.", "Quebre, limite as linhas ou encurte o texto dentro da coluna dele."),
          t("Paint the hover and the selection on the whole row, square.", "Pinte o hover e a seleção na linha inteira, sem cantos."),
        ]}
        donts={[
          t("Let the second line of text run under the tags or actions.", "Deixar a segunda linha do texto passar por baixo das tags ou ações."),
          t("Use col-span-full, flex-basis 100% or areas like \"res res\" for the text in a row with a trailing column.", "Usar col-span-full, flex-basis 100% ou áreas como \"res res\" no texto de uma linha com coluna final."),
          t("Round the row hover or paint it on the text block only.", "Arredondar o hover da linha ou pintá-lo só no bloco do texto."),
          t("Use an outer focus ring with radius on a row.", "Usar anel de foco por fora e com cantos na linha."),
        ]}
      />

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <p className="border-b border-border px-4 py-2.5 text-[0.75rem] font-semibold text-foreground"><Mono>LinhaDeLista</Mono></p>
        <pre className="whitespace-pre-wrap break-words px-4 py-4 text-[0.75rem] leading-relaxed font-[family-name:var(--font-mono)] text-foreground"><code>{codigo}</code></pre>
      </div>
    </div>
  );
}

/** Resumo das duas regras para a página Cards (ao lado de "card nunca tem rolagem horizontal"). */
export function ResumoDaRegraDasLinhas() {
  const { t } = useI18n();
  return (
    <>
      <p className="mt-3 font-semibold text-foreground">{t("Rule: in grids, text never goes past the tags or actions column.", "Regra: nos grids, o texto nunca ultrapassa a coluna de tags ou ações.")}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>{t("The trailing column keeps its width; the text wraps or is shortened inside its own column, at every width.", "A coluna final mantém a largura; o texto quebra ou é encurtado dentro da coluna dele, em qualquer largura.")}</li>
        <li>{t("On phones, tags and actions move to their own row below the text, which uses the full width (default, 27/11/2026: LinhaDeLista quebraAcoes=\"estreito\"; quebraAcoes={false} keeps them beside it). Or the row becomes a stacked card.", "No celular, tags e ações descem para uma linha própria embaixo do texto, que usa a largura toda (padrão, 27/11/2026: LinhaDeLista quebraAcoes=\"estreito\"; quebraAcoes={false} as mantém ao lado). Ou a linha vira um card empilhado.")}</li>
      </ul>
      <p className="mt-3 font-semibold text-foreground">{t("Rule: row hover covers the whole row, edge to edge, with no rounded corners.", "Regra: o hover da linha cobre a linha inteira, de ponta a ponta, sem cantos arredondados.")}</p>
      <ul className="mt-1 list-disc space-y-1 pl-5">
        <li>{t("Including the checkbox or avatar at the start and the tags and actions at the end; selection has the same shape; focus is an inset outline.", "Inclui a caixa de seleção ou o avatar do início e as tags e ações do fim; a seleção tem a mesma forma; o foco é um contorno por dentro.")}</li>
        <li>{t("Only a row that is itself a standalone card keeps the card's radius. Details and examples in Data display > Rows with tags and actions.", "Só a linha que é um card sozinho mantém o raio do card. Detalhes e exemplos em Dados > Linhas com tags e ações.")}</li>
      </ul>
    </>
  );
}
