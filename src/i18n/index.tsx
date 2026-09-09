import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type Dict, type DictKey } from "./en";
import { hi } from "./hi";
import { te } from "./te";

/**
 * The language roster. Everything about the selector is driven from here —
 * adding a language is a row in this array plus its dictionary file.
 * `label` is the compact form used when the trigger has no room for `native`.
 */
export const LANGUAGES = [
  { code: "en", label: "EN", native: "English", english: "English" },
  { code: "hi", label: "हिं", native: "हिंदी", english: "Hindi" },
  { code: "te", label: "తెలుగు", native: "తెలుగు", english: "Telugu" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const DICTS: Record<Lang, Dict> = { en, hi, te };

/** A value that exists in all three languages — used for demo data. */
export type Localized = Record<Lang, string>;

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a dictionary key, falling back to English then to the key. */
  t: (key: DictKey) => string;
  /** Resolve a localized data value (centre names, crop names, and so on). */
  tl: (value: Localized | string) => string;
  /** Script class so Devanagari / Telugu get their own line-height. */
  scriptClass: string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "kq.lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "hi" || stored === "te") return stored;
  } catch {
    /* private mode or blocked storage — fall through to the default */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* non-fatal: the choice simply will not persist */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[lang];
    return {
      lang,
      setLang,
      t: (key) => dict[key] ?? en[key] ?? key,
      tl: (v) => (typeof v === "string" ? v : (v[lang] ?? v.en)),
      scriptClass: lang === "en" ? "" : "leading-relaxed",
    };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

export type { DictKey };
