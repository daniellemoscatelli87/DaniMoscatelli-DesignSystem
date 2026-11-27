import * as React from "react";

import { Separator } from "./separator";

/**
 * Divisor do rodapé do card (27/11/2026): o Separator do design system (1 px, --border). O Card horizontal mostra este
 * divisor acima das ações ("Card com ação: divisor e botão no canto inferior direito", dona do produto). Cada design
 * system aponta para o próprio divisor.
 */
export function DivisorDoCard({ className }: { className?: string }) {
  return (
    <div data-slot="card-divisor" className={className}>
      <Separator />
    </div>
  );
}
