import React from "react";

const display = "font-[family-name:var(--font-display)]";

/** Título de seção das páginas do DS: um estilo só, com a fonte de títulos (decisão de 18/11/2026). */
export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className={`${display} text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground mb-1`}>{title}</h2>
      {description && <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}
