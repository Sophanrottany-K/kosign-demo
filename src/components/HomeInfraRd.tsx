"use client";

import Link from "next/link";
import { REVEAL_STAGGER_DELAYS, useReveal } from "@/hooks/useReveal";
import { useTranslation } from "@/i18n/LanguageProvider";
import styles from "./HomeInfraRd.module.css";
import { infraIcons } from "./InfraIcons";

const SERVICES = [
  { icon: "cloud", titleKey: "home.infra.s1.t", descKey: "home.infra.s1.d", anchor: "cloud-services" },
  { icon: "api", titleKey: "home.infra.s2.t", descKey: "home.infra.s2.d", anchor: "api-services" },
  { icon: "turnkey", titleKey: "home.infra.s3.t", descKey: "home.infra.s3.d", anchor: "turnkey-outsourcing" },
  { icon: "publicRd", titleKey: "home.infra.s4.t", descKey: "home.infra.s4.d", anchor: "public-rd" },
];

function ServiceCard({ service, delay }: { service: (typeof SERVICES)[number]; delay?: number }) {
  const { t } = useTranslation();
  const { ref, inView } = useReveal<HTMLAnchorElement>();
  return (
    <Link
      ref={ref}
      href={`/business/infra#${service.anchor}`}
      prefetch={false}
      className={[styles.card, styles.reveal, inView ? styles.revealIn : ""].join(" ")}
      style={inView && delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      <div className={styles.icon}>{infraIcons[service.icon]}</div>
      <div className={styles.body}>
        <h3 className={styles.title}>{t(service.titleKey)}</h3>
        <p className={styles.desc}>{t(service.descKey)}</p>
        <div className={styles.cta}>
          <span>{t("home.hl.cta")}</span>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HomeInfraRd() {
  const { t } = useTranslation();
  const { ref, inView } = useReveal();
  return (
    <section className={styles.section} id="infra-rd" aria-label="Infrastructure & R&D">
      <div className={styles.wrap}>
        <div ref={ref} className={[styles.head, styles.reveal, inView ? styles.revealIn : ""].join(" ")}>
          <span className={styles.kicker}>{t("home.infra.k")}</span>
          <h2 className={styles.heading}>{t("home.infra.h")}</h2>
          <p className={styles.para}>{t("home.infra.p")}</p>
        </div>
        <div className={styles.grid}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.anchor} service={service} delay={REVEAL_STAGGER_DELAYS[i]} />
          ))}
        </div>
      </div>
    </section>
  );
}
