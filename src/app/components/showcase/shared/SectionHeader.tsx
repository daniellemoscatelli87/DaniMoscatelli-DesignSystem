import React from "react";

const display = "font-[family-name:var(--font-display)]";

/** Título de seção das páginas do DS: um estilo só, com a fonte de títulos (decisão de 18/11/2026). */
export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h2 className={`${display} text-h3 font-semibold tracking-[-0.02em] text-foreground mb-1`}>{title}</h2>
      {description && <p className="max-w-3xl text-body leading-relaxed text-muted-foreground">{description}</p>}
    </div>
  );
}
