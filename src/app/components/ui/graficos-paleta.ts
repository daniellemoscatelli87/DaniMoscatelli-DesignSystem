/**
 * Paleta dos gráficos deste design system (Dani Moscatelli): quantos tons existem e como os componentes os escolhem.
 * É o único arquivo de gráficos que muda entre os design systems: graficos-inteligencia.tsx e graficos-catalogo.tsx são
 * iguais nos dois e leem daqui. As cores ficam no theme.css (--chart-1 a --chart-8, --chart-neutral, --chart-seq-*).
 *
 * Paleta de transição (decisão da dona do produto, 20/11/2026): 8 tons, do destaque (1) ao contexto (8), os mesmos no
 * tema claro e no escuro. Faixas: 1–2 destaque · 3–5 apoio e transição · 6–8 contexto.
 */

/** Quantidade de tons da paleta (--chart-1 a --chart-8). */
export const TOTAL_DE_TONS = 8;

/** Tom de --chart-neutral: "Outros" e informação sem destaque, sempre por último. */
export const TOM_NEUTRO = 8;

/** Tons por número de séries, da mais importante para a mais contextual (decisão da dona do produto, 20/11/2026). */
const TONS_POR_QUANTIDADE: readonly (readonly number[])[] = [
  [],
  [1],
  [1, 6],
  [1, 4, 7],
  [1, 4, 6, 8],
  [1, 3, 5, 6, 8],
  [1, 3, 4, 5, 6, 8],
  [1, 3, 4, 5, 6, 7, 8],
  [1, 2, 3, 4, 5, 6, 7, 8],
];

/**
 * Tons (1 a 8) para `n` séries, da mais importante para a mais contextual:
 * 1 → [1] · 2 → [1, 6] · 3 → [1, 4, 7] · 4 → [1, 4, 6, 8] · 5 → [1, 3, 5, 6, 8] · 6 → [1, 3, 4, 5, 6, 8]
 * · 7 → [1, 3, 4, 5, 6, 7, 8] · 8 → todos. Acima de 8, as séries a mais ficam no tom 8 (agrupe-as em "Outros").
 */
export function tonsPorImportancia(n: number): number[] {
  const q = Math.max(0, Math.floor(n));
  if (q <= TOTAL_DE_TONS) return [...TONS_POR_QUANTIDADE[q]!];
  return [...TONS_POR_QUANTIDADE[TOTAL_DE_TONS]!, ...new Array<number>(q - TOTAL_DE_TONS).fill(TOTAL_DE_TONS)];
}

/**
 * Tom de "Outros", pelo último tom usado pelas partes de verdade: o cinza seguinte, sem saltos. No tom 6 quando as
 * partes param antes dele (pizza com 2 partes e Outros: 1, 4 e 6) e no neutro (tom 8) nos demais casos
 * (decisão da dona do produto, 21/11/2026).
 */
export function tomDosOutros(ultimoTom: number): number {
  return ultimoTom < 6 ? 6 : TOM_NEUTRO;
}

/** Tons de contexto para `n` séries sem destaque que precisam ser diferenciadas: 6; 6 e 8; 6, 7 e 8 (e repete). */
export function tonsDeContexto(n: number): number[] {
  return n <= 1 ? [6] : n === 2 ? [6, 8] : [6, 7, 8];
}

/** Tons da escala contínua (--chart-seq-1 a 4), do menor para o maior valor: do cinza ao vermelho. */
export const TONS_DA_ESCALA = [6, 5, 3, 1] as const;
