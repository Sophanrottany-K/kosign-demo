"use client";

import Link from "next/link";
import { useLanguage, useTranslation } from "@/i18n/LanguageProvider";
import styles from "./Footer.module.css";

const PRODUCT_LINKS = [
  { href: "/products/webill365", label: "Billing & Invoicing Solution" },
  { href: "https://www.wabooks.com", label: "Smart ERP Solution", external: true },
  { href: "/products/weums365", label: "Messaging Service" },
  { href: "/products/wegroupware", label: "Groupware solution" },
  { href: "/products/weattendance", label: "Attendance Management", labelKo: "We근태관리" },
  { href: "/products/weloan", label: "Loan Origination System (LOS)" },
  { href: "/products/webizware", label: "AI Digital Banking Solution" },
];

const COMPANY_LINKS = [
  { href: "/company", labelKey: "foot.about" },
  { href: "/company#history", labelKey: "foot.history" },
  { href: "/partnership", labelKey: "nav.partnership" },
  { href: "/welfare", labelKey: "mega.company.welfare.title" },
  { href: "/csr", labelKey: "nav.csr" },
];

export function Footer() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logoLink} aria-label="KOSIGN home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/kosign_logo.svg" alt="KOSIGN" className={styles.logo} />
            </Link>
            <p className={styles.philosophy}>{t("home.phil.t")}</p>
            <p className={styles.philBody}>{t("home.phil.p")}</p>
            <p className={styles.leadP}>{t("home.lead.p")}</p>
            <p className={styles.addr}>
              #C168 (Tela Office Building 2F), Russian Federation Blvd,
              <br />
              Phnom Penh, Cambodia.
              <br />
              {t("foot.phone.label")}: (+855) 23 900 530
            </p>
          </div>

          <div className={styles.col}>
            <h6 className={styles.colHead}>{t("foot.products")}</h6>
            <ul className={styles.colList}>
              {PRODUCT_LINKS.map((p) => {
                const label = locale === "ko" && p.labelKo ? p.labelKo : p.label;
                return (
                  <li key={p.href}>
                    {p.external ? (
                      <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.colLink}>
                        {label}
                      </a>
                    ) : (
                      <Link href={p.href} prefetch={false} className={styles.colLink}>
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.col}>
            <h6 className={styles.colHead}>{t("foot.company")}</h6>
            <ul className={styles.colList}>
              {COMPANY_LINKS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} prefetch={false} className={styles.colLink}>
                    {t(c.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h6 className={styles.colHead}>{t("foot.contact.general.h")}</h6>
            <ul className={styles.colList}>
              <li>
                <span className={styles.colLink}>info@kosign.com.kh</span>
              </li>
              <li>
                <span className={styles.colLink}>(+855) 23 900 530</span>
              </li>
            </ul>
            <h6 className={styles.colHead}>{t("foot.hours.label")}</h6>
            <ul className={styles.colList}>
              <li>
                <span className={styles.colLink}>{t("foot.hours")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>{t("foot.copyright")}</span>
          <div className={styles.socialLinks}>
            <span className={styles.followUsLabel}>{t("foot.followUs")}</span>
            <a
              href="https://www.facebook.com/share/19PAWkxyhm/?mibextid=wwXIfr"
              className={styles.socialLink}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.916 3.777-3.916 1.094 0 2.238.196 2.238.196v2.475h-1.26c-1.243 0-1.63.775-1.63 1.57v1.89h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
