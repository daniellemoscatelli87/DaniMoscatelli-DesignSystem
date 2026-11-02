/** Utilitários de contraste (WCAG 2.x) para avaliar texto sobre vidro. */
export type RGB = { r: number; g: number; b: number; a: number };

/** Lê "rgb(...)", "rgba(...)", "#rgb", "#rrggbb" ou "#rrggbbaa". */
export function parseColor(input: string): RGB | null {
  const s = input.trim();
  const m = s.match(/^rgba?\(([^)]+)\)$/i);
  if (m) {
    const parts = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  }
  const h = s.replace("#", "");
  if (/^[0-9a-f]{3}$/i.test(h)) return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16), a: 1 };
  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(h)) return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 };
  return null;
}

/** Resolve uma cor CSS (inclusive var(--token)) para rgb(), usando o navegador. */
export function resolveCssColor(value: string): RGB | null {
  if (typeof document === "undefined") return parseColor(value);
  const el = document.createElement("span");
  el.style.color = value;
  el.style.display = "none";
  document.body.appendChild(el);
  const out = getComputedStyle(el).color;
  el.remove();
  return parseColor(out);
}

/** Compõe `top` (com alfa) sobre `base` opaco. */
export function over(top: RGB, base: RGB, alpha = top.a): RGB {
  const a = Math.min(1, Math.max(0, alpha));
  return { r: top.r * a + base.r * (1 - a), g: top.g * a + base.g * (1 - a), b: top.b * a + base.b * (1 - a), a: 1 };
}

export function luminance({ r, g, b }: RGB): number {
  const f = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a), lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Mínimos WCAG AA: 3:1 para texto grande (≥ 24 px, ou ≥ 18,66 px em negrito), 4,5:1 para o restante. */
export const AA = { large: 3, normal: 4.5 } as const;

export function formatRatio(r: number): string {
  return `${r.toFixed(1).replace(".", ",")}:1`;
}
