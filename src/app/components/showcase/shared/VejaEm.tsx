import React from "react";
import { ArrowRight, Layers } from "lucide-react";
import { useI18n } from "../../../i18n";

/** Pede ao app para abrir outra página do DS, já na âncora (o App ouve o evento "ds:navegar"). */
export function navegarPara(secao: string, ancora?: string) {
  window.dispatchEvent(new CustomEvent("ds:navegar", { detail: { secao, ancora } }));
}

/**
 * Aviso de conteúdo que mudou de lugar: o assunto agora fica centralizado em outra página
 * (por exemplo, tudo sobre cards fica em Cards). Mostra o motivo e um botão para ir até lá.
 */
export function VejaEm({ secao, ancora, titulo, texto }: { secao: string; ancora?: string; titulo: string; texto: string }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col gap-3 rounded-[16px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)]">
          <Layers className="h-4 w-4 text-[var(--primary-text,var(--primary))]" />
        </span>
        <div>
          <p className="text-[0.875rem] font-semibold text-foreground">{titulo}</p>
          <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-muted-foreground">{texto}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navegarPara(secao, ancora)}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-[10px] border border-primary px-3.5 text-[0.8125rem] font-semibold text-[var(--primary-text,var(--primary))] transition-colors hover:bg-[var(--primary-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:self-center"
      >
        {t("See in Cards", "Ver em Cards")} <ArrowRight aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
