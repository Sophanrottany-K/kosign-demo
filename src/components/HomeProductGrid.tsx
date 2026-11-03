"use client";

import Link from "next/link";
import { REVEAL_STAGGER_DELAYS, useReveal } from "@/hooks/useReveal";
import { useLanguage, useTranslation } from "@/i18n/LanguageProvider";
import styles from "./HomeProductGrid.module.css";
import { productIcons } from "./ProductIcons";

type Card = { slug: string; name: string; nameKo?: string; descKey: string; href: string };

const CARDS: Card[] = [
  { slug: "webill365", name: "Billing & Invoicing Solution", descKey: "home.psa.s1.p", href: "/products/webill365" },
  { slug: "weums365", name: "Messaging Service", descKey: "home.psa.s3.p", href: "/products/weums365" },
  { slug: "wegroupware", name: "Groupware solution", descKey: "home.psa.s6.p", href: "/products/wegroupware" },
  { slug: "weattendance", name: "Attendance Management", nameKo: "We근태관리", descKey: "home.psa.s11.p", href: "/products/weattendance" },
  { slug: "weloan", name: "Loan Origination System (LOS)", descKey: "home.psa.s2.p", href: "/products/weloan" },
  { slug: "webizware", name: "AI Digital Banking Solution", descKey: "home.psa.s4.p", href: "/products/webizware" },
  { slug: "consulting", name: "Smart ERP Solution", descKey: "home.psa.s10.p", href: "/products/financial-solution" },
];

function ProductCard({ card, delay, cta }: { card: Card; delay?: number; cta: string }) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const { ref, inView } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={card.href}
      prefetch={false}
      className={[styles.card, styles.reveal, inView ? styles.revealIn : ""].join(" ")}
      style={inView && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      <span className={styles.icon} aria-hidden="true">
        {productIcons[card.slug]}
      </span>
      <div className={styles.content}>
        <h3>{locale === "ko" && card.nameKo ? card.nameKo : card.name}</h3>
        <p>{t(card.descKey)}</p>
        <span className={styles.cta}>
          <span>{cta}</span>
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}

export function HomeProductGrid() {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <section className={styles.section} id="products" aria-label={t("home.hl.k")}>
      <div className={styles.wrap}>
        <div ref={ref} className={[styles.head, styles.reveal, inView ? styles.revealIn : ""].join(" ")}>
          <span className={styles.kicker}>{t("home.hl.k")}</span>
          <h2 className={styles.heading}>{t("home.hl.h")}</h2>
        </div>
        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <ProductCard key={card.slug} card={card} delay={REVEAL_STAGGER_DELAYS[i]} cta={t("home.hl.cta")} />
          ))}
        </div>
      </div>
    </section>
  );
}
