"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage, useTranslation } from "@/i18n/LanguageProvider";
import styles from "./Header.module.css";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MegaMenu } from "./MegaMenu";
import { businessAreas, enterpriseProducts, financialProducts, infraLinks, welfareLinks } from "./nav-data";

type MenuId = "products" | "company" | "infra";

export function Header() {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordion, setAccordion] = useState<MenuId | null>(null);
  const [dropdown, setDropdown] = useState<MenuId | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setAccordion(null);
  }, []);

  const toggleDrawer = () => {
    if (drawerOpen) setAccordion(null);
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("menu-open");
    return () => {
      document.body.style.overflow = previous;
      document.body.classList.remove("menu-open");
    };
  }, [drawerOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) closeDrawer();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeDrawer]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setDropdown(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdown(null);
        closeDrawer();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDrawer]);

  const menus: { id: MenuId; label: string }[] = [
    { id: "products", label: t("foot.products") },
    { id: "company", label: t("nav.company") },
    { id: "infra", label: t("mega.biz.infra.title") },
  ];

  const accordionGroup = (id: MenuId, label: string, children: React.ReactNode) => (
    <div className={styles.accGroup}>
      <button
        className={styles.accHead}
        aria-expanded={accordion === id}
        onClick={() => setAccordion((cur) => (cur === id ? null : id))}
      >
        {label}
        <span className={`${styles.accCaret} ${accordion === id ? styles.accCaretOpen : ""}`} aria-hidden="true" />
      </button>
      <div className={`${styles.accPanel} ${accordion === id ? styles.accPanelOpen : ""}`}>{children}</div>
    </div>
  );

  const accLink = (href: string, label: string) => (
    <Link key={href} href={href} prefetch={false} className={styles.accLink} onClick={closeDrawer}>
      {label}
    </Link>
  );

  return (
    <header className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${drawerOpen ? styles.drawerOpen : ""}`} role="banner">
      <nav ref={navRef} className={`${styles.navInner} container`} aria-label="Main navigation">
        <div className={styles.navLeft}>
          <Link href="/" className={styles.brand} aria-label="KOSIGN home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/kosign_logo.svg" alt="KOSIGN" className={styles.logo} />
          </Link>
          <ul className={styles.navList} role="list">
            {menus.map(({ id, label }) => (
              <li
                key={id}
                className={`${styles.hasMenu} ${dropdown === id ? styles.dropOpen : ""}`}
                onMouseEnter={() => setDropdown(id)}
                onMouseLeave={() => setDropdown((cur) => (cur === id ? null : cur))}
              >
                <button
                  className={styles.navLink}
                  aria-haspopup="true"
                  aria-expanded={dropdown === id}
                  onClick={() => setDropdown((cur) => (cur === id ? null : id))}
                >
                  {label}
                  <span className={styles.caret} aria-hidden="true" />
                </button>
                <MegaMenu type={id} open={dropdown === id} onClose={() => setDropdown(null)} />
              </li>
            ))}
            <li>
              <Link href="/partnership" prefetch={false} className={styles.navLink}>
                {t("mega.csr.partnership.title")}
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles.navEnd}>
          <LanguageSwitcher direction="down" />
          <button
            className={styles.hamburger}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            onClick={toggleDrawer}
          >
            <span className={`${styles.bar} ${drawerOpen ? styles.barTop : ""}`} />
            <span className={`${styles.bar} ${drawerOpen ? styles.barMid : ""}`} />
            <span className={`${styles.bar} ${drawerOpen ? styles.barBot : ""}`} />
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div className={styles.mobileDrawer} aria-label="Mobile navigation">
          <div className={styles.mobileDrawerInner}>
            {accordionGroup(
              "products",
              t("foot.products"),
              <>
                <p className={styles.accSubHead}>{t("home.grp.biz")}</p>
                {enterpriseProducts.map((p) => accLink(p.href, locale === "ko" && p.nameKo ? p.nameKo : p.name))}
                <p className={styles.accSubHead}>{t("home.grp.fin")}</p>
                {financialProducts.map((p) => accLink(p.href, p.name))}
              </>,
            )}
            {accordionGroup(
              "company",
              t("nav.company"),
              <>
                {accLink("/company", t("mega.company.lead.title"))}
                <p className={styles.accSubHead}>{t("mega.company.biz.head")}</p>
                {businessAreas.map((i) => accLink(i.href, t(i.titleKey)))}
                <p className={styles.accSubHead}>{t("mega.company.csr.head")}</p>
                {welfareLinks.map((i) => accLink(i.href, t(i.titleKey)))}
              </>,
            )}
            {accordionGroup(
              "infra",
              t("mega.biz.infra.title"),
              <>
                {accLink("/#infra-rd", t("mega.infra.lead.title"))}
                {infraLinks.map((i) => accLink(i.href, t(i.titleKey)))}
              </>,
            )}
            <Link href="/partnership" prefetch={false} className={styles.mobileLink} onClick={closeDrawer}>
              {t("mega.csr.partnership.title")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
