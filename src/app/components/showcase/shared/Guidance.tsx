import React from "react";
import { Check, X, Info } from "lucide-react";

export const display = "font-[family-name:var(--font-display)]";

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-[0.8125rem] font-[family-name:var(--font-mono)] px-1.5 py-0.5 rounded-[5px] bg-muted text-foreground border border-border">
      {children}
    </code>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-[var(--radius)] shadow-[var(--shadow-sm)] ${className}`}>
      {children}
    </div>
  );
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={`${display} text-[1rem] font-semibold tracking-[-0.01em] text-foreground mb-3`}>{children}</h3>;
}

export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius)] border border-border bg-muted/60 p-4">
      <Info className="h-4 w-4 mt-0.5 text-primary shrink-0" aria-hidden />
      <div className="text-[0.875rem] leading-relaxed text-muted-foreground">
        <p className="font-semibold text-foreground mb-0.5">{title}</p>
        {children}
      </div>
    </div>
  );
}

export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {[
        { title: "Do", items: dos, Icon: Check },
        { title: "Don't", items: donts, Icon: X },
      ].map(col => (
        <Panel key={col.title} className="p-5">
          <p className="flex items-center gap-2 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-foreground mb-3">
            <col.Icon className="h-3.5 w-3.5 text-primary" aria-hidden /> {col.title}
          </p>
          <ul className="space-y-2">
            {col.items.map(i => (
              <li key={i} className="text-[0.8125rem] leading-relaxed text-muted-foreground flex gap-2">
                <span aria-hidden className="mt-2 h-1 w-1 rounded-full bg-muted-foreground/60 shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

export type Principle = { icon: React.ElementType; title: string; desc: string };

export function PrincipleGrid({ items, cols = "lg:grid-cols-3" }: { items: Principle[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${cols} gap-3`}>
      {items.map(p => (
        <Panel key={p.title} className="p-5">
          <p.icon className="h-5 w-5 text-primary mb-4" strokeWidth={1.75} aria-hidden />
          <h3 className={`${display} text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground mb-1.5`}>{p.title}</h3>
          <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{p.desc}</p>
        </Panel>
      ))}
    </div>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <Panel className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[0.8125rem]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {head.map(h => (
                <th key={h} scope="col" className="px-4 py-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                {r.map((c, j) => (
                  <td key={j} className={`px-4 py-3 align-top ${j === 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
