"use client";

/* eslint-disable @next/next/no-img-element -- small partner logos served as-is */
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { REVEAL_STAGGER_DELAYS, useReveal } from "@/hooks/useReveal";
import { useTranslation } from "@/i18n/LanguageProvider";
import styles from "./HomeOutsourcing.module.css";

const AFFILIATES = [
  { logo: "/outsourcing/webcash.webp", name: "Webcash", descKey: "outsourcing.global.aff1.desc", countKey: "outsourcing.global.aff1.count" },
  { logo: "/outsourcing/mandras.webp", name: "Madras Check", descKey: "outsourcing.global.aff5.desc", countKey: "outsourcing.global.aff5.count" },
  { logo: "/outsourcing/bizplay.webp", name: "Bizplay", descKey: "outsourcing.global.aff3.desc", countKey: "outsourcing.global.aff3.count" },
  { logo: "/outsourcing/beple.webp", name: "BePle Pay", descKey: "outsourcing.global.aff4.desc", countKey: "outsourcing.global.aff4.count" },
  { logo: "/outsourcing/coocon.webp", name: "Coocon", descKey: "outsourcing.global.aff2.desc", countKey: "outsourcing.global.aff2.count" },
  { logo: "/outsourcing/webcash-g.png", name: "Webcash Global", descKey: "outsourcing.global.aff6.desc", countKey: "outsourcing.global.aff6.count" },
];

const BANKS = [
  { logo: "/outsourcing/shinhan-bank.webp", name: "Shinhan Bank (NBC)", roleKey: "outsourcing.local.bank1.role", descKey: "outsourcing.local.bank1.desc", brand: styles.shinhan },
  { logo: "/outsourcing/nh.webp", name: "NongHyup Finance", roleKey: "outsourcing.local.bank4.role", descKey: "outsourcing.local.bank4.desc", brand: styles.nh },
  { logo: "/outsourcing/kb.webp", name: "KB Prasac Bank", roleKey: "outsourcing.local.bank5.role", descKey: "outsourcing.local.bank5.desc", brand: styles.prasac },
  { logo: "/outsourcing/ppcb.webp", name: "PPCBank", roleKey: "outsourcing.local.bank3.role", descKey: "outsourcing.local.bank3.desc", brand: styles.ppc },
  { logo: "/outsourcing/bnkc.webp", name: "BNKC MFIs", roleKey: "outsourcing.local.bank2.role", descKey: "outsourcing.local.bank2.desc", brand: styles.bnkc },
];

const STEPS = [
  { num: "01", titleKey: "home.outsourcing.dispatch.step1.title", descKey: "home.outsourcing.dispatch.step1.desc" },
  { num: "02", titleKey: "home.outsourcing.dispatch.step2.title", descKey: "home.outsourcing.dispatch.step2.desc" },
  { num: "03", titleKey: "home.outsourcing.dispatch.step3.title", descKey: "home.outsourcing.dispatch.step3.desc" },
  { num: "04", titleKey: "home.outsourcing.dispatch.step4.title", descKey: "home.outsourcing.dispatch.step4.desc" },
];

const FEATURES = [
  { titleKey: "home.outsourcing.dispatch.feat1.title", descKey: "home.outsourcing.dispatch.feat1.desc" },
  { titleKey: "home.outsourcing.dispatch.feat2.title", descKey: "home.outsourcing.dispatch.feat2.desc" },
  { titleKey: "home.outsourcing.dispatch.feat3.title", descKey: "home.outsourcing.dispatch.feat3.desc" },
  { titleKey: "home.outsourcing.dispatch.feat4.title", descKey: "home.outsourcing.dispatch.feat4.desc" },
  { titleKey: "home.outsourcing.dispatch.feat5.title", descKey: "home.outsourcing.dispatch.feat5.desc" },
];

function revealProps(inView: boolean, delay: number | undefined, extra: string) {
  return {
    className: [styles.reveal, inView ? styles.revealIn : "", extra].join(" ").trim(),
    style: inView && delay ? { transitionDelay: `${delay}s` } : undefined,
  };
}

function AffiliateCard({ a, delay }: { a: (typeof AFFILIATES)[number]; delay?: number }) {
  const { t, locale } = useTranslation();
  const { ref, inView } = useReveal();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [overflow, setOverflow] = useState(false);
  const [collapsed, setCollapsed] = useState<number | null>(null);
  const text = t(a.descKey);

  // Text longer than two lines collapses and expands on hover (Korean always fits).
  useEffect(() => {
    if (locale === "ko") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- derived from a DOM measurement
      setOverflow(false);
      return;
    }
    const el = textRef.current;
    if (!el) return;
    const twoLines = 2 * (parseFloat(getComputedStyle(el).lineHeight) || 21);
    setCollapsed(twoLines);
    setOverflow(el.scrollHeight > twoLines + 1);
  }, [text, locale]);

  const textClass = locale === "ko" ? styles.affTextFit : overflow ? styles.affTextOverflow : "";
  const textStyle = locale !== "ko" && collapsed ? ({ "--aff-collapsed": `${collapsed}px` } as CSSProperties) : undefined;

  return (
    <div ref={ref} tabIndex={0} {...revealProps(inView, delay, styles.affCard)}>
      <div className={styles.affLogoWrap}>
        <img src={a.logo} alt={a.name} />
      </div>
      <p ref={textRef} className={`${styles.affText} ${textClass}`} style={textStyle}>
        {text}
      </p>
      <span className={styles.affBadge}>{t(a.countKey)}</span>
    </div>
  );
}

function BankCard({ b, delay }: { b: (typeof BANKS)[number]; delay?: number }) {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} tabIndex={0} {...revealProps(inView, delay, `${styles.bankCard} ${b.brand}`)}>
      <div className={styles.bankHead}>
        <div className={styles.bankIc}>
          <img src={b.logo} alt={b.name} />
        </div>
        <div>
          <h4 className={styles.bankName}>{b.name}</h4>
          <span className={styles.bankRole}>{t(b.roleKey)}</span>
        </div>
      </div>
      <p className={styles.bankText}>{t(b.descKey)}</p>
    </div>
  );
}

function Step({ s, delay }: { s: (typeof STEPS)[number]; delay?: number }) {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <div ref={ref} {...revealProps(inView, delay, styles.step)}>
      <div className={styles.stepNum}>{s.num}</div>
      <h5 className={styles.stepTitle}>{t(s.titleKey)}</h5>
      <p className={styles.stepDesc}>{t(s.descKey)}</p>
    </div>
  );
}

export function HomeOutsourcing() {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <section className={styles.section} id="outsourcing" aria-label={t("home.outsourcing.k")}>
      <div className={styles.inner}>
        <div ref={ref} {...revealProps(inView, 0, styles.head)}>
          <span className={styles.kicker}>{t("home.outsourcing.k")}</span>
          <h2 className={styles.heading}>{t("home.outsourcing.h")}</h2>
          <p className={styles.para}>{t("home.outsourcing.p")}</p>
        </div>

        <div className={styles.sub} id="outsourcing-global">
          <div className={styles.subHead}>
            <h3 className={styles.subHeading}>{t("outsourcing.global.heading")}</h3>
            <p className={styles.subPara}>{t("outsourcing.global.body")}</p>
          </div>
          <div className={styles.affGrid}>
            {AFFILIATES.map((a, i) => (
              <AffiliateCard key={a.name} a={a} delay={REVEAL_STAGGER_DELAYS[i]} />
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.sub} id="outsourcing-local">
          <div className={styles.subHead}>
            <h3 className={styles.subHeading}>{t("outsourcing.local.heading")}</h3>
            <p className={styles.subPara}>{t("outsourcing.local.body")}</p>
          </div>
          <div className={styles.bankGrid}>
            {BANKS.map((b, i) => (
              <BankCard key={b.name} b={b} delay={REVEAL_STAGGER_DELAYS[i]} />
            ))}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className={styles.sub} id="outsourcing-dispatch">
          <div className={styles.subHead}>
            <h3 className={styles.subHeading}>{t("outsourcing.dispatch.heading")}</h3>
            <p className={styles.subPara}>{t("outsourcing.dispatch.body")}</p>
          </div>
          <div className={styles.process}>
            <p className={styles.processTitle}>{t("home.outsourcing.dispatch.process_title")}</p>
            <div className={styles.timeline}>
              {STEPS.map((s, i) => (
                <Fragment key={s.num}>
                  <Step s={s} delay={REVEAL_STAGGER_DELAYS[i]} />
                  {i < STEPS.length - 1 && (
                    <div className={styles.arrow} aria-hidden="true">
                      →
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
            <div className={styles.features}>
              {FEATURES.map((f) => (
                <div key={f.titleKey} className={styles.feat}>
                  <div className={styles.featHead}>
                    <span className={styles.featIc} aria-hidden="true">
                      ✓
                    </span>
                    <h5 className={styles.featTitle}>{t(f.titleKey)}</h5>
                  </div>
                  <p className={styles.featDesc}>{t(f.descKey)}</p>
                </div>
              ))}
            </div>
            <div className={styles.highlight}>
              <p>{t("home.outsourcing.dispatch.highlight")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
