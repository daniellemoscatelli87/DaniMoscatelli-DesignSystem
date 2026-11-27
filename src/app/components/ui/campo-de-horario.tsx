"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "./utils";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { MensagemDeErro } from "./campo";

/**
 * CampoDeHorario (hora de uma reunião ou de um envio)
 *
 * Escolhe a hora em passos de 15 minutos, com o fuso escrito ("Horário de Brasília"), para marcar reunião no Contato e
 * agendar envio em Parceiros (especificação da área restrita, ADMIN_REACT.md §7.1). Combina com o Calendar (data) ao
 * lado: o par fica lado a lado quando cabe e um embaixo do outro no celular.
 *
 * - Uma lista (Select do DS) com os horários de `inicio` a `fim`, de `passo` em `passo` minutos (padrão 07:00 a 21:00,
 *   a cada 15 min). Horários já passados ou ocupados vão em `indisponiveis` (aparecem riscados e não podem ser escolhidos).
 * - O fuso fica escrito embaixo do campo, sempre visível (nunca só no rótulo de leitores de tela).
 * - Valor "HH:MM" (24 h). Controlado: `valor` e `onValorChange`.
 * - 40 px no computador, 44 px no toque; erro com ícone + texto.
 */

export type CampoDeHorarioProps = {
  valor: string;
  onValorChange: (valor: string) => void;
  rotulo?: string;
  passo?: number;
  inicio?: string;
  fim?: string;
  indisponiveis?: string[];
  fuso?: string;
  placeholder?: string;
  obrigatorio?: boolean;
  desabilitado?: boolean;
  erro?: React.ReactNode;
  id?: string;
  className?: string;
};

const minutos = (h: string) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function CampoDeHorario({
  valor, onValorChange, rotulo = "Horário", passo = 15, inicio = "07:00", fim = "21:00", indisponiveis = [],
  fuso = "Horário de Brasília (UTC−3)", placeholder = "Escolha o horário", obrigatorio, desabilitado, erro, id: idProp, className,
}: CampoDeHorarioProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const horarios = React.useMemo(() => {
    const l: string[] = [];
    for (let m = minutos(inicio); m <= minutos(fim); m += passo) l.push(hhmm(m));
    return l;
  }, [inicio, fim, passo]);
  const descritores = [`${id}-fuso`, erro ? `${id}-erro` : null].filter(Boolean).join(" ");
  return (
    <div data-slot="campo-de-horario" className={cn("min-w-0 space-y-2", className)}>
      <Label htmlFor={id} className="text-body-sm font-semibold">
        {rotulo}
        {obrigatorio && <span aria-hidden className="-ml-1 text-primary-text">*</span>}
      </Label>
      <Select value={valor} onValueChange={onValorChange} disabled={desabilitado}>
        <SelectTrigger id={id} aria-invalid={erro ? true : undefined} aria-describedby={descritores} aria-required={obrigatorio || undefined} className="w-full bg-card tabular-nums">
          <span className="flex items-center gap-2">
            <Clock aria-hidden className="size-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </span>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {horarios.map(h => {
            const ocupado = indisponiveis.includes(h);
            return (
              <SelectItem key={h} value={h} disabled={ocupado} className="tabular-nums">
                {ocupado ? <><span className="line-through">{h}</span><span className="sr-only"> (indisponível)</span></> : h}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <p id={`${id}-fuso`} className="text-body-sm text-muted-foreground">{fuso}</p>
      {erro && <MensagemDeErro id={`${id}-erro`}>{erro}</MensagemDeErro>}
    </div>
  );
}

export { CampoDeHorario };
