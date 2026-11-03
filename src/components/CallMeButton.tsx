"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";
import styles from "./CallMeButton.module.css";

const TEL_HREF = "tel:+85523900530";
const PHONE = "(+855) 23 900 530";
const EMAIL = "info@kosign.com.kh";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const PHONE_PATH =
  "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.5a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z";

export function CallMeButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: globalThis.MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Phones dial straight away; larger screens open the contact card instead.
  const onFabClick = (e: MouseEvent) => {
    if (window.innerWidth > 640) {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={`${styles.card} ${open ? styles.on : ""}`} role="dialog" aria-modal="false" aria-label={t("cm.label")}>
        <button type="button" className={styles.close} aria-label={t("modal.close")} onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className={styles.row}>
          <span className={styles.ic} aria-hidden="true">
            <svg {...iconProps}>
              <path d={PHONE_PATH} />
            </svg>
          </span>
          <span>
            <a href={TEL_HREF}>{PHONE}</a>
            <small>{t("cm.phone")}</small>
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.ic} aria-hidden="true">
            <svg {...iconProps}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m3 6 9 7 9-7" />
            </svg>
          </span>
          <span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <small>{t("cm.email")}</small>
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.ic} aria-hidden="true">
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
          <span>
            <b>{t("cm.hoursval")}</b>
            <small>{t("cm.hours")}</small>
          </span>
        </div>
      </div>
      <a className={styles.fab} href={TEL_HREF} aria-label={t("cm.label")} onClick={onFabClick}>
        <svg {...iconProps}>
          <path d={PHONE_PATH} />
        </svg>
        <span className={styles.lab}>{t("cm.label")}</span>
      </a>
    </div>
  );
}
