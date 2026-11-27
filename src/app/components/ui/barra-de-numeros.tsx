import * as React from "react";
import { cn } from "./utils";

/**
 * BarraDeNumeros (números de destaque de uma seção)
 *
 * Três ou quatro números grandes com o que cada um mede ("15+ anos de experiência", "35 recomendações"), numa faixa
 * de uma seção institucional. Era a "barra de números" da landing de demonstração, que sobrepunha os números no
 * celular. Para indicadores de painel com ícone e variação, use o CardIndicador.
 *
 * Responsiva pela própria largura: 2 × 2 abaixo de 40rem e todos lado a lado a partir dela, separados por linhas
 * finas; número e rótulo alinhados à mesma borda (esquerda, ou ao centro com `centralizar`). Números com algarismos de
 * mesma largura. Use só números reais e verificáveis: o DS não inventa dados.
 */

export type NumeroDaBarra = { valor: string; rotulo: string; detalhe?: string };

function BarraDeNumeros({ itens, centralizar = false, className }: { itens: NumeroDaBarra[]; centralizar?: boolean; className?: string }) {
  return (
    <div data-slot="barra-de-numeros" className={cn("@container/numeros", className)}>
      <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border", itens.length === 3 ? "@min-[40rem]/numeros:grid-cols-3" : "@min-[40rem]/numeros:grid-cols-4")}>
        {itens.map(n => (
          <div key={n.rotulo} className={cn("flex min-w-0 flex-col-reverse gap-1 bg-card p-4 @min-[40rem]/numeros:p-6", centralizar && "items-center text-center", itens.length === 3 && "last:col-span-2 @min-[40rem]/numeros:last:col-span-1")}>
            <dt className="text-body-sm text-muted-foreground text-balance">{n.rotulo}{n.detalhe && <span className="mt-1 block text-label">{n.detalhe}</span>}</dt>
            <dd className="text-h2 font-bold leading-none tracking-[-0.03em] text-foreground tabular-nums">{n.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export { BarraDeNumeros };
