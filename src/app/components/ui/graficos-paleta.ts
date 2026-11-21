/**
 * Paleta dos gráficos deste design system (Dani Moscatelli): quantos tons existem e como os componentes os escolhem.
 * É o único arquivo de gráficos que muda entre os design systems: graficos-inteligencia.tsx e graficos-catalogo.tsx são
 * iguais nos dois e leem daqui. As cores ficam no theme.css (--chart-1 a --chart-7, --chart-neutral, --chart-seq-*).
 *
 * Paleta do DS Dani Moscatelli (decisão da dona do produto, 21/11/2026): 7 tons, em ordem de importância, os mesmos no
 * tema claro e no escuro. Faixas: 1–2 destaque · 3–5 apoio e transição · 6–7 contexto. As séries usam os tons em sequência.
 */

/** Quantidade de tons da paleta (--chart-1 a --chart-7). */
export const TOTAL_DE_TONS = 7;

/** Tom de --chart-neutral: "Outros" e informação sem destaque, sempre por último. */
export const TOM_NEUTRO = 7;

/**
 * Tons (1 a 7) para `n` séries, da mais importante para a mais contextual, em sequência:
 * 1 → [1] · 2 → [1, 2] · 3 → [1, 2, 3] · … · 7 → [1 a 7]. Acima de 7, as séries a mais ficam no tom 7
 * (agrupe-as em "Outros").
 */
export function tonsPorImportancia(n: number): number[] {
  const q = Math.max(0, Math.floor(n));
  return Array.from({ length: q }, (_, i) => Math.min(TOTAL_DE_TONS, i + 1));
}

/**
 * Tom de "Outros", pelo último tom usado pelas partes de verdade: no tom 6 quando as partes param antes dele
 * (pizza com 2 partes e Outros: 1, 2 e 6) e no neutro (tom 7) nos demais casos.
 */
export function tomDosOutros(ultimoTom: number): number {
  return ultimoTom < 6 ? 6 : TOM_NEUTRO;
}

/** Tons de contexto para `n` séries sem destaque que precisam ser diferenciadas: 6; 6 e 7 (e repete). */
export function tonsDeContexto(n: number): number[] {
  return n <= 1 ? [6] : [6, 7];
}

/** Tons da escala contínua (--chart-seq-1 a 4), do menor para o maior valor: do cinza ao vermelho. */
export const TONS_DA_ESCALA = [6, 4, 2, 1] as const;
