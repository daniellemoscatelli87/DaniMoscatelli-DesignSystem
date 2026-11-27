import React from "react";
import { useI18n } from "../../../i18n";
import { SectionHeader } from "./SectionHeader";
import { DoDont, Mono } from "./Guidance";

/* Andaimes das páginas de componentes novos (27/11/2026): título, quando usar, arquivo, exemplos ao vivo, API e
   faça/não faça. Não é componente do DS (o catálogo ignora SectionBlock e CodeBlock). */

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-words rounded-md border border-border bg-muted p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed text-foreground">
      {children}
    </pre>
  );
}

export function SectionBlock({
  id, titulo, quando, arquivo, nomes, children, api, faca, naoFaca,
}: {
  id: string;
  titulo: string;
  quando: string;
  arquivo: string;
  nomes: string[];
  children: React.ReactNode;
  api?: string;
  faca?: string[];
  naoFaca?: string[];
}) {
  const { t } = useI18n();
  return (
    <section id={id} className="scroll-mt-32 space-y-6">
      <div>
        <SectionHeader title={titulo} description={quando} />
        <p className="-mt-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{t("File", "Arquivo")}:</span> <Mono>{arquivo}</Mono>
          <span aria-hidden>·</span>
          {nomes.map(n => <Mono key={n}>{n}</Mono>)}
        </p>
      </div>
      {children}
      {api && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{t("How to use", "Como usar")}</h3>
          <CodeBlock>{api}</CodeBlock>
        </div>
      )}
      {faca && naoFaca && <DoDont dos={faca} donts={naoFaca} />}
    </section>
  );
}

/** Moldura das demonstrações: card do DS com respiro, sem sombra parada. */
export function ShowcaseCard({ children, className = "", rotulo }: { children: React.ReactNode; className?: string; rotulo?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      {rotulo && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{rotulo}</p>}
      {children}
    </div>
  );
}
