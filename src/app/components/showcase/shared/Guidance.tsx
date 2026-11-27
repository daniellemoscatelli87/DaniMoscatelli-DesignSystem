import React from "react";
import { Check, X, Info } from "lucide-react";
import { useI18n } from "../../../i18n";
import { GradeDeCards } from "../../ui/grade-de-cards";

export const display = "font-[family-name:var(--font-display)]";

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-body-sm font-[family-name:var(--font-mono)] px-1 py-1 rounded-sm bg-muted text-foreground border border-border [overflow-wrap:break-word] [word-break:normal] [box-decoration-break:clone]">
      {children}
    </code>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-md shadow-[var(--shadow-sm)] ${className}`}>
      {children}
    </div>
  );
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={`${display} text-body font-semibold tracking-[-0.01em] text-foreground mb-3`}>{children}</h3>;
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-md border border-border bg-muted/60 p-4">
      <Info className="h-4 w-4 mt-1 text-primary-text shrink-0" aria-hidden />
      <div className="text-body-sm leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">{title}</p>
        {children}
      </div>
    </div>
  );
}

export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  const { t } = useI18n();
  return (
    <GradeDeCards className="md:grid-cols-2 gap-3">
      {[
        { title: "Do", label: t("Do", "Faça"), items: dos, Icon: Check },
        { title: "Don't", label: t("Don't", "Não faça"), items: donts, Icon: X },
      ].map(col => (
        <Panel key={col.title} className="p-5">
          <p className="flex items-center gap-2 text-label font-semibold uppercase tracking-[0.08em] text-foreground mb-3">
            <col.Icon className="h-3.5 w-3.5 text-primary-text" aria-hidden /> {col.label}
          </p>
          <ul className="space-y-2">
            {col.items.map(i => (
              <li key={i} className="text-body-sm leading-relaxed text-muted-foreground flex gap-2">
                <span aria-hidden className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </GradeDeCards>
  );
}

export type Principle = { icon: React.ElementType; title: string; desc: string };

export function PrincipleGrid({ items, cols = "lg:grid-cols-3" }: { items: Principle[]; cols?: string }) {
  return (
    <GradeDeCards className={`md:grid-cols-2 ${cols} gap-3`}>
      {items.map(p => (
        <Panel key={p.title} className="p-5">
          <p.icon className="h-5 w-5 text-primary-text mb-4" strokeWidth={1.75} aria-hidden />
          <h3 className={`${display} text-body font-semibold tracking-[-0.01em] text-foreground mb-1`}>{p.title}</h3>
          <p className="text-body-sm leading-relaxed text-muted-foreground">{p.desc}</p>
        </Panel>
      ))}
    </GradeDeCards>
  );
}

/**
 * Tabela de documentação (a mesma nos dois DS, 27/11/2026). Regra do DS: card nunca rola na horizontal.
 * - Com espaço (a partir de 576 px de largura da própria tabela), a tabela de sempre.
 * - No estreito (celular), toda tabela vira lista: cada linha vira um bloco com o primeiro valor em destaque (o nome
 *   da prop, a tecla, o token) e, embaixo, os outros valores. Com 3 colunas ou mais, cada valor leva o nome da coluna
 *   antes ("Teclas: Enter"); com 2, a descrição vem direto, sem rótulo repetido.
 * - Código (Mono) nunca quebra no meio da palavra: a quebra só acontece entre palavras, e uma palavra maior que a
 *   linha inteira quebra só nesse caso extremo (overflow-wrap: break-word, não anywhere).
 */
export function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  const comRotulo = head.length >= 3;
  return (
    <Panel className="@container overflow-hidden">
      <table className="hidden w-full text-left text-body-sm @xl:table">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {head.map(h => (
              <th key={h} scope="col" className="px-4 py-2 text-caption font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 align-top [overflow-wrap:break-word] ${j === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="m-0 list-none p-0 @xl:hidden">
        {rows.map((r, i) => (
          <li key={i} className="border-b border-border px-4 py-3 text-body-sm last:border-0">
            {r.map((c, j) => (
              <div key={j} className={j === 0 ? "font-semibold text-foreground [overflow-wrap:break-word]" : "mt-1 text-muted-foreground [overflow-wrap:break-word]"}>
                {j > 0 && comRotulo && <span className="mr-1 font-medium text-foreground">{head[j]}:</span>}
                {c}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
