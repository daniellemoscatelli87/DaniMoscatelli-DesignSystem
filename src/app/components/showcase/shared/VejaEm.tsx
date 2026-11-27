import React from "react";
import { ArrowRight, Layers } from "lucide-react";
import { useI18n } from "../../../i18n";
import { Button } from "../../ui/button";

/** Pede ao app para abrir outra página do DS, já na âncora (o App ouve o evento "ds:navegar"). */
export function navegarPara(secao: string, ancora?: string) {
  window.dispatchEvent(new CustomEvent("ds:navegar", { detail: { secao, ancora } }));
}

/**
 * Aviso de conteúdo que mudou de lugar: o assunto agora fica centralizado em outra página
 * (por exemplo, tudo sobre cards fica em Cards). Mostra o motivo e um botão para ir até lá.
 *
 * Celular (abaixo de 640 px), como o Alerta com ação: uma borda esquerda só. O ícone fica na linha do título,
 * centralizado com ele; o texto e o botão começam na mesma borda do ícone. Do 640 px em diante: ícone numa coluna,
 * título e texto na coluna do meio e o botão à direita, centralizado na altura.
 */
export function VejaEm({ secao, ancora, titulo, texto, rotuloBotao }: { secao: string; ancora?: string; titulo: string; texto: string; rotuloBotao?: string }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 gap-y-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:gap-y-1 sm:p-5">
      <span aria-hidden className="col-start-1 row-start-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] sm:row-span-2 sm:self-start">
        <Layers className="h-4 w-4 text-[var(--primary-text,var(--primary))]" />
      </span>
      <p className="col-start-2 row-start-1 min-w-0 text-body-sm font-semibold text-foreground [text-wrap:pretty] sm:self-end">{titulo}</p>
      <p className="col-span-2 col-start-1 row-start-2 min-w-0 text-body-sm leading-relaxed text-muted-foreground sm:col-span-1 sm:col-start-2 sm:self-start">{texto}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => navegarPara(secao, ancora)}
        className="col-span-2 col-start-1 row-start-3 justify-self-start sm:col-span-1 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:self-center"
      >
        {rotuloBotao ?? t("See in Cards", "Ver em Cards")} <ArrowRight aria-hidden />
      </Button>
    </div>
  );
}
