import React from "react";
import { Check, Laptop, Search, Store } from "lucide-react";
import { Button } from "../../ui/button";
import { MensagemDeErro } from "../../ui/campo";
import { CartaoDeEscolha, GrupoDeCartoesDeEscolha } from "../../ui/cartao-de-escolha";

/**
 * Demonstração: cartões de escolha obrigatórios num formulário (28/11/2026). Enviar sem escolher mostra o erro abaixo
 * da pergunta e leva o foco ao grupo; os cartões continuam do mesmo tamanho (antes, no celular, o grupo sumia).
 */
export function EscolhaObrigatoriaDemo({ pergunta, opcoes }: { pergunta: string; opcoes: { valor: string; titulo: string; descricao: string; icone: React.ReactNode }[] }) {
  const [valor, setValor] = React.useState("");
  const [erro, setErro] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const id = React.useId();
  return (
    <form
      noValidate
      data-demo="escolha-obrigatoria"
      onSubmit={e => { e.preventDefault(); if (!valor) { setErro(true); return; } setEnviado(true); }}
      className="flex max-w-xl flex-col gap-6"
    >
      {erro && <MensagemDeErro>Confira o que falta antes de continuar.</MensagemDeErro>}
      <fieldset className="min-w-0">
        <legend id={`${id}-pergunta`} className="mb-3 text-body-sm font-semibold leading-5 text-foreground">{pergunta} <span aria-hidden className="text-primary-text">*</span></legend>
        <GrupoDeCartoesDeEscolha
          aria-labelledby={`${id}-pergunta`}
          aria-describedby={erro ? `${id}-erro` : undefined}
          aria-invalid={erro || undefined}
          aria-required
          name="perfil"
          value={valor}
          onValueChange={v => { setValor(v); setErro(false); setEnviado(false); }}
        >
          {opcoes.map(o => <CartaoDeEscolha key={o.valor} valor={o.valor} icone={o.icone} titulo={o.titulo} descricao={o.descricao} />)}
        </GrupoDeCartoesDeEscolha>
        {erro && <MensagemDeErro id={`${id}-erro`} className="mt-3">Escolha uma das opções para continuar.</MensagemDeErro>}
      </fieldset>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Continuar</Button>
        {enviado && <span role="status" className="inline-flex items-center gap-1 text-body-sm font-medium text-foreground"><Check aria-hidden className="size-4 text-primary-text" /> Escolha enviada</span>}
      </div>
    </form>
  );
}

export const opcoesDeExemplo = (sigla: "FL" | "DM") => sigla === "FL"
  ? [
      { valor: "consumidor", titulo: "Quero encontrar peças", descricao: "Buscar, salvar e seguir lojas", icone: <Search /> },
      { valor: "lojista", titulo: "Tenho uma loja ou brechó", descricao: "Mostrar meu catálogo", icone: <Store /> },
    ]
  : [
      { valor: "digital", titulo: "Um produto ou serviço digital", descricao: "SaaS, e-commerce, aplicativo, sistema", icone: <Laptop /> },
      { valor: "fisico", titulo: "Um negócio físico", descricao: "Clínicas, salões, restaurantes, hotéis", icone: <Store /> },
    ];
