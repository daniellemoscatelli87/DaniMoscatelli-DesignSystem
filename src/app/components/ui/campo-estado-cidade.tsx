"use client";

import * as React from "react";
import { cn } from "./utils";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { MensagemDeErro } from "./campo";

/**
 * CampoEstadoCidade (estado e cidade, em par)
 *
 * Dois Selects do DS lado a lado: primeiro o estado (as 27 UFs), depois a cidade daquele estado. Veio da Rede de
 * Parceiros (cadastro) e do app EI (campos.tsx), que usavam <select> nativo.
 *
 * - A cidade só abre depois do estado; enquanto carrega, mostra "Carregando cidades…"; se falhar, diz o que fazer.
 * - As cidades vêm de `carregarCidades(uf)` (padrão: o arquivo /data/municipios/<UF>.json do site, uma lista de nomes
 *   do IBGE). O DS não guarda a lista de municípios.
 * - Trocar o estado limpa a cidade. Um erro só (embaixo do par) com ícone e texto.
 * - Lado a lado a partir de 28rem de largura do próprio campo (estado mais estreito); abaixo disso, um embaixo do outro,
 *   na mesma borda esquerda.
 */

export const ESTADOS_DO_BRASIL: [string, string][] = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"], ["BA", "Bahia"], ["CE", "Ceará"],
  ["DF", "Distrito Federal"], ["ES", "Espírito Santo"], ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"], ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"],
  ["PE", "Pernambuco"], ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"], ["SP", "São Paulo"],
  ["SE", "Sergipe"], ["TO", "Tocantins"],
];

const carregarPadrao = async (uf: string): Promise<string[]> => {
  const r = await fetch(`/data/municipios/${uf}.json`);
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
};

export type CampoEstadoCidadeProps = {
  uf: string;
  cidade: string;
  onChange: (uf: string, cidade: string) => void;
  carregarCidades?: (uf: string) => Promise<string[]>;
  erro?: React.ReactNode;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  textos?: { estado?: string; cidade?: string; escolhaEstado?: string; selecione?: string; carregando?: string; falha?: string; selecioneCidade?: string };
  className?: string;
};

function CampoEstadoCidade({ uf, cidade, onChange, carregarCidades = carregarPadrao, erro, obrigatorio, desabilitado, textos, className }: CampoEstadoCidadeProps) {
  const tx = {
    estado: "Estado", cidade: "Cidade", escolhaEstado: "Escolha o estado primeiro", selecione: "Selecione",
    carregando: "Carregando cidades…", falha: "Não foi possível carregar as cidades. Escolha o estado de novo.", selecioneCidade: "Selecione a cidade",
    ...textos,
  };
  const id = React.useId();
  const [cidades, setCidades] = React.useState<string[] | null>(null);
  const [estado, setEstado] = React.useState<"vazio" | "carregando" | "ok" | "falha">(uf ? "carregando" : "vazio");
  React.useEffect(() => {
    if (!uf) { setCidades(null); setEstado("vazio"); return; }
    let vivo = true;
    setEstado("carregando");
    carregarCidades(uf).then(l => { if (vivo) { setCidades(l); setEstado("ok"); } }).catch(() => { if (vivo) setEstado("falha"); });
    return () => { vivo = false; };
  }, [uf, carregarCidades]);

  const vazioDaCidade = estado === "vazio" ? tx.escolhaEstado : estado === "carregando" ? tx.carregando : estado === "falha" ? tx.selecione : tx.selecioneCidade;
  const descritor = erro ? `${id}-erro` : undefined;
  const asterisco = obrigatorio && <span aria-hidden className="-ml-1 text-primary-text">*</span>;

  return (
    <div data-slot="campo-estado-cidade" className={cn("@container/uf min-w-0 space-y-2", className)}>
      <div className="grid gap-4 @min-[28rem]/uf:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-uf`} className="text-sm font-semibold">{tx.estado}{asterisco}</Label>
          <Select value={uf} onValueChange={v => onChange(v, "")} disabled={desabilitado}>
            <SelectTrigger id={`${id}-uf`} aria-invalid={erro && !uf ? true : undefined} aria-describedby={descritor} aria-required={obrigatorio || undefined} className="w-full bg-card">
              <SelectValue placeholder={tx.selecione} />
            </SelectTrigger>
            <SelectContent>
              {ESTADOS_DO_BRASIL.map(([sigla, nome]) => <SelectItem key={sigla} value={sigla}>{nome}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-cidade`} className="text-sm font-semibold">{tx.cidade}{asterisco}</Label>
          <Select value={cidade} onValueChange={v => onChange(uf, v)} disabled={desabilitado || estado !== "ok"}>
            <SelectTrigger id={`${id}-cidade`} aria-invalid={erro && !cidade ? true : undefined} aria-describedby={descritor} aria-required={obrigatorio || undefined} aria-busy={estado === "carregando" || undefined} className="w-full bg-card">
              <SelectValue placeholder={vazioDaCidade} />
            </SelectTrigger>
            <SelectContent>
              {cidades?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      {estado === "falha" && !erro && <MensagemDeErro>{tx.falha}</MensagemDeErro>}
      {erro && <MensagemDeErro id={descritor}>{erro}</MensagemDeErro>}
    </div>
  );
}

export { CampoEstadoCidade };
