"use client";

import Link from "next/link";
import { useLanguage, useTranslation } from "@/i18n/LanguageProvider";
import styles from "./MegaMenu.module.css";
import { businessAreas, enterpriseProducts, financialProducts, infraLinks, welfareLinks } from "./nav-data";

type MenuType = "products" | "company" | "infra";

function MenuItem({
  href,
  title,
  sub,
  lead,
  onClick,
}: {
  href: string;
  title: string;
  sub: string;
  lead?: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`${styles.item} ${lead ? styles.leadItem : ""}`}
      role="menuitem"
      onClick={onClick}
    >
      <span className={styles.itemText}>
        <span className={styles.itemName}>{title}</span>
        <span className={styles.itemCat}>{sub}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true" />
    </Link>
  );
}

export function MegaMenu({ type, open, onClose }: { type: MenuType; open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const openClass = open ? styles.open : "";

  if (type === "company") {
    return (
      <div className={`${styles.panel} ${styles.companyPanel} ${openClass}`} role="menu" aria-label="Company menu" aria-hidden={!open}>
        <MenuItem lead href="/company" title={t("mega.company.lead.title")} sub={t("mega.company.lead.sub")} onClick={onClose} />
        <div className={styles.grid}>
          <div className={styles.col}>
            <p className={styles.colHead}>{t("mega.company.biz.head")}</p>
            <ul>
              {businessAreas.map((item) => (
                <li key={item.href}>
                  <MenuItem href={item.href} title={t(item.titleKey)} sub={t(item.subKey)} onClick={onClose} />
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.col}>
            <p className={styles.colHead}>{t("mega.company.csr.head")}</p>
            <ul>
              {welfareLinks.map((item) => (
                <li key={item.href}>
                  <MenuItem href={item.href} title={t(item.titleKey)} sub={t(item.subKey)} onClick={onClose} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (type === "infra") {
    return (
      <div className={`${styles.panel} ${styles.infraPanel} ${openClass}`} role="menu" aria-label="Infra R&D menu" aria-hidden={!open}>
        <MenuItem lead href="/#infra-rd" title={t("mega.infra.lead.title")} sub={t("mega.infra.lead.sub")} onClick={onClose} />
        <ul>
          {infraLinks.map((item) => (
            <li key={item.href}>
              <MenuItem href={item.href} title={t(item.titleKey)} sub={t(item.subKey)} onClick={onClose} />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={`${styles.panel} ${styles.wide} ${openClass}`} role="menu" aria-label="Products menu" aria-hidden={!open}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <p className={styles.colHead}>{t("home.grp.biz")}</p>
          <ul>
            {enterpriseProducts.map((item) => (
              <li key={item.href}>
                <MenuItem
                  href={item.href}
                  title={locale === "ko" && item.nameKo ? item.nameKo : item.name}
                  sub={t(item.catKey)}
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.col}>
          <p className={styles.colHead}>{t("home.grp.fin")}</p>
          <ul>
            {financialProducts.map((item) => (
              <li key={item.href}>
                <MenuItem href={item.href} title={item.name} sub={t(item.catKey)} onClick={onClose} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
