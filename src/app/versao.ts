/**
 * Versão publicada do design system.
 * O fluxo de publicação (repositório DaniMoscatelli-DesignSystem-Deploy) passa VITE_VERSAO ("v37")
 * e VITE_VERSAO_ANO ("2026") na hora de construir. Fora da publicação (ambiente local), não há número.
 */
const bruta = (import.meta.env.VITE_VERSAO as string | undefined)?.trim();
const ano = (import.meta.env.VITE_VERSAO_ANO as string | undefined)?.trim();

/** Número da versão sem o "v" (ex.: "37"), ou null fora da publicação. */
export const numeroVersao: string | null = bruta ? bruta.replace(/^v/i, "") : null;
/** Ano da publicação (ex.: "2026"), ou null fora da publicação. */
export const anoVersao: string | null = ano || null;

/** "Versão 37 · 2026" / "Version 37 · 2026"; "Versão em desenvolvimento" quando não publicado. */
export function rotuloVersao(t: (en: string, pt: string) => string): string {
  if (!numeroVersao) return t("Development version", "Versão em desenvolvimento");
  return `${t("Version", "Versão")} ${numeroVersao}${anoVersao ? ` · ${anoVersao}` : ""}`;
}
