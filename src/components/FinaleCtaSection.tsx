"use client";

import { useReveal } from "@/hooks/useReveal";
import { useTranslation } from "@/i18n/LanguageProvider";
import styles from "./FinaleCtaSection.module.css";
import { PixelBlast } from "./PixelBlast";

export function FinaleCtaSection() {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <section className={styles.finale} aria-label={t("home.fin.aria")}>
      <PixelBlast />
      <div ref={ref} className={[styles.inner, styles.reveal, inView ? styles.revealIn : ""].join(" ")}>
        <span className={styles.kicker}>{t("home.fin.k")}</span>
        <h2 className={styles.heading}>{t("home.fin.h")}</h2>
        <p className={styles.para}>{t("home.fin.p")}</p>
      </div>
    </section>
  );
}
