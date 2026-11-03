"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Locale } from "@/i18n/messages";
import styles from "./LanguageSwitcher.module.css";

const LOCALE_NAMES: Record<Locale, string> = { en: "English", km: "ភាសាខ្មែរ", ko: "한국어" };
const LOCALES: Locale[] = ["en", "km", "ko"];

export function LanguageSwitcher({ direction = "up" }: { direction?: "up" | "down" }) {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.lsd} ${direction === "down" ? styles.down : ""} ${open ? styles.open : ""}`}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.globe} aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
          </svg>
        </span>
        <span>{LOCALE_NAMES[locale]}</span>
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>
      <div className={styles.menu} role="listbox">
        {LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            role="option"
            aria-selected={locale === code}
            className={styles.opt}
            onClick={() => {
              setLocale(code);
              setOpen(false);
            }}
          >
            <span className={styles.optText}>
              <span className={styles.optName} lang={code}>
                {LOCALE_NAMES[code]}
              </span>
            </span>
            <span className={styles.check} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
