import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "pt";
export type Bi = { en: string; pt: string };

const STORAGE_KEY = "ds-lang";

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt") return saved;
  } catch {}
  return "en";
}

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** t("English", "Português") returns the string for the active language. */
  t: (en: string, pt: string) => string;
  /** bi({ en, pt }) for bilingual objects stored in data arrays. */
  bi: (v: Bi) => string;
};

const I18nContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (en) => en,
  bi: (v) => v.en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (en, pt) => (lang === "pt" ? pt : en),
      bi: (v) => (lang === "pt" ? v.pt : v.en),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
