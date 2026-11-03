"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { messages, type Locale } from "./messages";

const STORAGE_KEY = "ko.lang";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyToDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-lang", locale);
}

function readStoredLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "ko" || saved === "km" || saved === "en" ? saved : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useLayoutEffect(() => {
    const stored = readStoredLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after hydration
    setLocaleState(stored);
    applyToDocument(stored);
    document.documentElement.removeAttribute("data-locale-loading");
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the choice just won't persist.
    }
    applyToDocument(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useTranslation() {
  const { locale } = useLanguage();
  const t = useCallback(
    (key: string) => {
      const entry = messages[key];
      return entry ? (entry[locale] ?? entry.ko ?? key) : key;
    },
    [locale],
  );
  return { t, locale };
}
