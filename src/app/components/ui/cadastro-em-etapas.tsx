"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Loader2, XCircle } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Stepper, type StepperEtapa } from "./stepper";
import { Alert, AlertDescription } from "./alert";
import { IconeComBase } from "./painel-dados";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { Campo, ResumoDeErros, type ErroDoResumo } from "./campo";

/**
 * Cadastro em etapas (trazido do FindLook Design System, 27/11/2026: mesmos nomes e mesma API; só as peças gerais,
 * sem o formulário do lojista). Serve ao cadastro de parceiro da Rede de Parceiros e a qualquer formulário longo:
 * - MolduraDoCadastro: card com o Stepper do DS no topo.
 * - EtapaDoCadastro: título (recebe o foco a cada etapa), explicação, aviso de campos obrigatórios, erro geral,
 *   resumo dos erros (2 ou mais), formulário, coluna lateral e a barra de ações presa ao pé.
 * - BarraDaEtapa: Voltar e Continuar (com estado "carregando").
 * - LateralDaEtapa: ícone na base (IconeComBase, tom marca), título, explicação e um destaque num Alerta do DS.
 * - ListaDeRevisao, BlocoDeRevisao e LinhaDeDado: o resumo da etapa Revisão, em blocos que abrem e fecham, com Editar
 *   para voltar à etapa. LinhaDeDado também serve sozinha, dentro de um <dl>, para qualquer par rótulo e valor.
 * - CampoDoCadastro: o mesmo Campo do DS (ui/campo.tsx), com o nome do FindLook.
 *
 * Responsivo pela largura do próprio cadastro (container queries), não pela tela: a lateral só fica ao lado do
 * formulário quando a etapa tem 56rem (896 px) ou mais; antes disso, desce para baixo do formulário.
 * Só apresentação: nenhum componente grava dados.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/** O Campo do DS com o nome usado no FindLook. */
const CampoDoCadastro = Campo;

/* ── Cadastro em etapas ──────────────────────────────────────────── */
type MolduraDoCadastroProps = {
  etapas: StepperEtapa[];
  atual: number;
  concluidas?: number[];
  onIrPara?: (indice: number) => void;
  rotulo?: string;
  children: React.ReactNode;
  className?: string;
};

function MolduraDoCadastro({ etapas, atual, concluidas, onIrPara, rotulo = "Etapas do cadastro", children, className }: MolduraDoCadastroProps) {
  return (
    <div data-slot="moldura-do-cadastro" className={cn("@container/moldura min-w-0 rounded-xl border border-border bg-card", className)}>
      <div className="px-4 pt-5 @min-[40rem]/moldura:px-8 @min-[40rem]/moldura:pt-4">
        <Stepper etapas={etapas} atual={atual} concluidas={concluidas} onIrPara={onIrPara} rotulo={rotulo} />
      </div>
      {children}
    </div>
  );
}

type EtapaDoCadastroProps = {
  titulo: string;
  explicacao?: string;
  /** Recebe o foco a cada troca de etapa (leitores de tela anunciam a nova etapa). */
  tituloRef?: React.Ref<HTMLHeadingElement>;
  /** Texto "* Campos obrigatórios" (omita quando a etapa não tem campos). */
  obrigatorios?: string;
  /** Erro geral da etapa (por exemplo, falha ao salvar), num Alerta de erro. */
  erro?: React.ReactNode;
  /** Erros dos campos, para o resumo no topo. O resumo só aparece com 2 erros ou mais (com 1, basta o erro no campo). */
  resumoDeErros?: ErroDoResumo[];
  lateral?: React.ReactNode;
  barra?: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
};

function EtapaDoCadastro({ titulo, explicacao, tituloRef, obrigatorios, erro, resumoDeErros, lateral, barra, onSubmit, children }: EtapaDoCadastroProps) {
  return (
    <form data-slot="etapa-do-cadastro" onSubmit={(e) => (onSubmit ? onSubmit(e) : e.preventDefault())} noValidate className="@container/etapa">
      <div
        className={cn(
          "grid gap-8 px-4 pt-8 pb-10 @min-[40rem]/etapa:px-8 @min-[40rem]/etapa:pt-12",
          lateral && "@min-[56rem]/etapa:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] @min-[56rem]/etapa:gap-8",
        )}
      >
        <div className="min-w-0">
          <h2 ref={tituloRef} tabIndex={-1} className="text-h3 font-bold leading-tight tracking-[-0.02em] text-foreground outline-none [text-wrap:balance]">
            {titulo}
          </h2>
          {explicacao && <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{explicacao}</p>}
          {obrigatorios && <p className="mt-5 text-body-sm text-muted-foreground">{obrigatorios}</p>}
          {erro && (
            <Alert variant="error" className="mt-5">
              <XCircle aria-hidden />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          {resumoDeErros && resumoDeErros.length >= 2 && <ResumoDeErros erros={resumoDeErros} className="mt-5" />}
          <div className="mt-6">{children}</div>
        </div>
        {lateral}
      </div>
      {barra}
    </form>
  );
}

type BarraDaEtapaProps = {
  onVoltar?: () => void;
  rotuloVoltar?: string;
  rotuloContinuar?: React.ReactNode;
  /** Mostra o carregamento no botão principal e o desativa. */
  carregando?: boolean;
  textoCarregando?: string;
  desativado?: boolean;
  /**
   * id do texto que explica o Continuar (por exemplo, "Você revisa tudo antes de publicar" ou o motivo de estar
   * desativado): vira o aria-describedby do botão principal (27/11/2026).
   */
  descricaoDoContinuar?: string;
  /** Troca os botões padrão. */
  children?: React.ReactNode;
  className?: string;
};

function BarraDaEtapa({ onVoltar, rotuloVoltar = "Voltar", rotuloContinuar, carregando = false, textoCarregando = "Salvando…", desativado = false, descricaoDoContinuar, children, className }: BarraDaEtapaProps) {
  const botao = "flex-1 @min-[40rem]/etapa:min-w-40 @min-[40rem]/etapa:flex-none";
  return (
    <div data-slot="barra-da-etapa" className={cn("sticky bottom-0 z-10 flex justify-end gap-3 rounded-b-xl border-t border-border bg-card px-4 py-3 @min-[40rem]/etapa:px-8 @min-[40rem]/etapa:py-4", className)}>
      {children ?? (
        <>
          {onVoltar && (
            <Button type="button" variant="outline" size="lg" className={botao} onClick={onVoltar}>
              <ArrowLeft aria-hidden className="@min-[40rem]/etapa:hidden" /> {rotuloVoltar}
            </Button>
          )}
          <Button type="submit" size="lg" className={botao} disabled={desativado || carregando} aria-busy={carregando || undefined} aria-describedby={descricaoDoContinuar}>
            {carregando ? (
              <>
                <Loader2 className="motion-safe:animate-spin" aria-hidden /> {textoCarregando}
              </>
            ) : (
              rotuloContinuar ?? (
                <>
                  Continuar <ArrowRight aria-hidden />
                </>
              )
            )}
          </Button>
        </>
      )}
    </div>
  );
}

/* O destaque é um Alerta do design system: info (padrão; "marca" também vira info, o Alerta não tem tom de marca) ou aviso. */
const TONS_LATERAL = { info: "info", marca: "info", aviso: "warning" } as const;

type LateralDaEtapaProps = {
  icone: React.ReactNode;
  titulo: string;
  paragrafos?: string[];
  destaque?: string;
  tom?: keyof typeof TONS_LATERAL;
  /** Ícone do Alerta (lucide). Sem ele, o Alerta fica sem ícone, o recomendado na coluna lateral: o texto ganha a
      largura toda (com ícone, numa lateral de 18rem, sobram cerca de 130 px para o texto). */
  iconeDestaque?: React.ReactElement;
  className?: string;
};

function LateralDaEtapa({ icone, titulo, paragrafos = [], destaque, tom = "info", iconeDestaque, className }: LateralDaEtapaProps) {
  const id = React.useId();
  return (
    <aside data-slot="lateral-da-etapa" aria-labelledby={id} className={cn("@container/lateral min-w-0 self-start rounded-xl border border-border bg-card p-5 @min-[56rem]/etapa:p-6", className)}>
      <IconeComBase tom="marca" tamanho="lg">{icone}</IconeComBase>
      <h3 id={id} className="mt-4 text-subtitle font-bold tracking-[-0.01em] text-foreground">{titulo}</h3>
      {paragrafos.map((p) => (
        <p key={p} className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{p}</p>
      ))}
      {destaque && (
        <Alert variant={TONS_LATERAL[tom]} role="note" className="mt-4">
          {iconeDestaque}
          <AlertDescription>{destaque}</AlertDescription>
        </Alert>
      )}
    </aside>
  );
}

/* ── Revisão ─────────────────────────────────────────────────────── */
function ListaDeRevisao({ children, valoresAbertos, className }: { children: React.ReactNode; valoresAbertos?: string[]; className?: string }) {
  return (
    <Accordion type="multiple" defaultValue={valoresAbertos} className={cn("space-y-3", className)}>
      {children}
    </Accordion>
  );
}

type BlocoDeRevisaoProps = {
  valor: string;
  /** Título do bloco, por exemplo "02 · Dados da loja". */
  titulo: string;
  /** Nome da etapa, lido junto com Editar ("Editar dados da loja"). */
  nomeEtapa?: string;
  /** Partes do resumo mostrado com o bloco fechado (as vazias são ignoradas). */
  resumo?: (string | false | null | undefined)[];
  onEditar?: () => void;
  rotuloEditar?: string;
  /** Conteúdo depois da lista de dados (por exemplo, os recursos do plano). */
  depois?: React.ReactNode;
  children: React.ReactNode;
};

function BlocoDeRevisao({ valor, titulo, nomeEtapa, resumo = [], onEditar, rotuloEditar = "Editar", depois, children }: BlocoDeRevisaoProps) {
  const texto = resumo.filter(Boolean).join(" · ");
  return (
    <AccordionItem value={valor} data-slot="bloco-de-revisao" className="@container/revisao rounded-lg border border-border px-5 last:border-b">
      <AccordionTrigger className="min-w-0 items-center py-4 hover:no-underline [&>svg]:size-5 [&>svg]:text-primary-text">
        <span className="min-w-0">
          <span className="block text-body font-bold text-foreground">{titulo}</span>
          {texto && <span className="mt-1 block truncate text-body-sm font-normal text-muted-foreground">{texto}</span>}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <dl className="grid gap-x-6 gap-y-3 text-body-sm @min-[30rem]/revisao:grid-cols-2">{children}</dl>
        {depois}
        {onEditar && (
          <button type="button" onClick={onEditar} className={cn("mt-4 rounded-sm text-body-sm font-semibold text-primary-text underline underline-offset-4", foco)}>
            {rotuloEditar}
            {nomeEtapa && <span className="sr-only"> {nomeEtapa.toLowerCase()}</span>}
          </button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function LinhaDeDado({ rotulo, valor, vazio = "Não informado", className }: { rotulo: string; valor?: React.ReactNode; vazio?: string; className?: string }) {
  return (
    <div data-slot="linha-de-dado" className={cn("min-w-0", className)}>
      <dt className="text-label text-muted-foreground">{rotulo}</dt>
      <dd className="break-words font-medium text-foreground">{valor || vazio}</dd>
    </div>
  );
}

export {
  CampoDoCadastro, MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa, ListaDeRevisao, BlocoDeRevisao, LinhaDeDado,
};
export type { MolduraDoCadastroProps, EtapaDoCadastroProps, BarraDaEtapaProps, LateralDaEtapaProps, BlocoDeRevisaoProps };
