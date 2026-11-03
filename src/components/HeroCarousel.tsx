"use client";

/* eslint-disable @next/next/no-img-element -- large decorative artwork served as-is */
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type AnimationEvent, type TouchEvent } from "react";
import { useTranslation } from "@/i18n/LanguageProvider";
import styles from "./HeroCarousel.module.css";

type Slide = {
  index: number;
  bg: "s1" | "s2" | "s3";
  kickerKey?: string;
  headingKey: string;
  paraKey: string;
  cta1Key: string;
  cta1Href: string;
  cta2Key?: string;
  cta2Href?: string;
  wide?: boolean;
  media: "webill" | "fintech" | "infra" | "gallery";
};

const SLIDES: Slide[] = [
  { index: 0, bg: "s2", headingKey: "home.s2.h", paraKey: "home.s2.p", cta1Key: "home.s2.cta1", cta1Href: "/#products", media: "webill" },
  {
    index: 1,
    bg: "s1",
    headingKey: "home.s1.h",
    paraKey: "home.s1.p",
    cta1Key: "home.s1.cta1",
    cta1Href: "/#outsourcing",
    cta2Key: "home.s1.cta2",
    cta2Href: "/partnership",
    media: "fintech",
  },
  {
    index: 2,
    bg: "s3",
    kickerKey: "home.s3.k",
    headingKey: "home.s3.h",
    paraKey: "home.s3.p",
    cta1Key: "home.s3.cta1",
    cta1Href: "/#infra-rd",
    wide: true,
    media: "infra",
  },
  {
    index: 3,
    bg: "s1",
    kickerKey: "home.s4.k",
    headingKey: "home.s4.h",
    paraKey: "home.s4.p",
    cta1Key: "home.s4.cta1",
    cta1Href: "/welfare",
    cta2Key: "home.s4.cta2",
    cta2Href: "/csr",
    wide: true,
    media: "gallery",
  },
];

const GALLERY_IMAGES = Array.from({ length: 19 }, (_, i) => i + 1);

function WebillMedia() {
  return (
    <div className={styles.webillContainer} aria-hidden="true">
      <span className={`${styles.webillBlob} ${styles.webillBlob1}`} />
      <span className={`${styles.webillBlob} ${styles.webillBlob2}`} />
      <span className={`${styles.webillBlob} ${styles.webillBlob3}`} />
      <span className={`${styles.webillBlob} ${styles.webillBlob4}`} />
      <svg viewBox="0 0 980 570" className={styles.webillSvg}>
        <g className={styles.webillPcGroup}>
          <image href="/hero/webill365-mock-pc.svg" x="10" y="10" width="760" height="500" />
        </g>
        <g className={styles.webillMobileGroup}>
          <image href="/hero/webill365-mock-mo.svg" x="670" y="70" width="280" height="500" />
        </g>
      </svg>
    </div>
  );
}

function SlideMedia({ media }: { media: Slide["media"] }) {
  switch (media) {
    case "webill":
      return <WebillMedia />;
    case "fintech":
      return (
        <div className={styles.fintechContainer} aria-hidden="true">
          <img src="/hero/banner_of_b2b.png" alt="" className={styles.fintechBg} />
        </div>
      );
    case "infra":
      return (
        <div className={styles.infraContainer} aria-hidden="true">
          <img src="/hero/infra_image.png" alt="" className={styles.infraBg} />
        </div>
      );
    case "gallery":
      return (
        <div className={styles.hcGallery} aria-hidden="true">
          <div className={styles.hcGalleryGrid}>
            {GALLERY_IMAGES.map((n) => (
              <div key={n} className={`${styles.hgCard} ${styles[`hgC${n}`]}`}>
                <img src={`/hero/gallery/act_${n}.webp`} alt="" />
              </div>
            ))}
          </div>
        </div>
      );
  }
}

function CtaLink({ href, className, children }: { href: string; className: string; children: string }) {
  // Same-page anchors stay native so the browser handles the smooth scroll.
  return href.includes("#") ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} prefetch={false} className={className}>
      {children}
    </Link>
  );
}

export function HeroCarousel() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [entered, setEntered] = useState(true);
  const [paused, setPaused] = useState(false);
  const transitioning = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Text fades out, the slide swaps at 420ms, then the new text fades back in.
  const goTo = useCallback((pick: (current: number) => number) => {
    if (transitioning.current) return;
    transitioning.current = true;
    setLeaving(true);
    setEntered(false);
    timers.current.push(
      setTimeout(() => {
        setActive((current) => {
          setPrevious(current);
          return pick(current);
        });
        setLeaving(false);
      }, 420),
      setTimeout(() => {
        setEntered(true);
        transitioning.current = false;
      }, 1140),
      setTimeout(() => setPrevious(null), 1240),
    );
  }, []);

  const next = useCallback(() => goTo((c) => (c + 1) % SLIDES.length), [goTo]);
  const prev = useCallback(() => goTo((c) => (c + SLIDES.length - 1) % SLIDES.length), [goTo]);

  // Autoplay is driven by the CSS progress animation on the active dot.
  const onDotAnimationEnd = useCallback(
    (e: AnimationEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).classList.contains(styles.dotFill)) next();
    },
    [next],
  );

  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const start = touchStart.current;
      const touch = e.changedTouches[0];
      if (!start || !touch) return;
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
      touchStart.current = null;
    },
    [next, prev],
  );

  return (
    <section id="hero" className={styles.hero}>
      <div
        className={`${styles.carousel} ${paused ? styles.paused : ""}`}
        aria-label={t("hero.aria.carousel")}
        aria-roledescription="carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.bgLayer} aria-hidden="true">
          {SLIDES.map((s) => (
            <div
              key={s.index}
              className={[
                styles.bg,
                styles[s.bg],
                s.index === active ? styles.bgActive : "",
                s.index === previous ? styles.bgPrev : "",
              ].join(" ")}
            />
          ))}
        </div>

        <div className={styles.copyLayer}>
          {SLIDES.map((s) => (
            <article
              key={s.index}
              className={[
                styles.slide,
                s.index === active && entered ? styles.slideActive : "",
                s.index === active && leaving ? styles.slideOut : "",
              ].join(" ")}
              role="group"
              aria-roledescription="slide"
              aria-label={`${s.index + 1} / ${SLIDES.length} — ${t(s.headingKey)}`}
              aria-hidden={s.index !== active}
              inert={s.index !== active}
            >
              <div className={`${styles.slideText} ${s.wide ? styles.slideTextWide : ""}`}>
                {s.kickerKey && <span className={styles.kicker}>{t(s.kickerKey)}</span>}
                <h2 className={styles.heading}>{t(s.headingKey)}</h2>
                <p className={styles.para}>{t(s.paraKey)}</p>
                <div className={styles.cta}>
                  <CtaLink href={s.cta1Href} className={`btn btn-blue ${styles.ctaBtn}`}>
                    {t(s.cta1Key)}
                  </CtaLink>
                  {s.cta2Href && s.cta2Key && (
                    <CtaLink href={s.cta2Href} className={`btn btn-white ${styles.ctaBtn}`}>
                      {t(s.cta2Key)}
                    </CtaLink>
                  )}
                </div>
              </div>
              <SlideMedia media={s.media} />
            </article>
          ))}
        </div>

        <span className="sr-only" aria-live="polite">
          {`${active + 1} / ${SLIDES.length} — ${t(SLIDES[active].headingKey)}`}
        </span>

        <div className={styles.controls}>
          <div className={styles.dots} role="tablist" aria-label={t("hero.aria.dots")} onAnimationEnd={onDotAnimationEnd}>
            {SLIDES.map((s) => (
              <button
                key={s.index}
                className={`${styles.dot} ${s.index === active ? styles.dotActive : ""}`}
                role="tab"
                aria-selected={s.index === active}
                aria-label={t("hero.aria.goToSlide").replace("{n}", String(s.index + 1))}
                onClick={() => goTo((c) => (c === s.index ? c : s.index))}
              >
                <span className={styles.dotFill} />
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.playPause}
            aria-label={t(paused ? "hero.aria.play" : "hero.aria.pause")}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        </div>

        <button className={`${styles.chev} ${styles.chevPrev}`} type="button" aria-label={t("hero.aria.prev")} onClick={prev}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button className={`${styles.chev} ${styles.chevNext}`} type="button" aria-label={t("hero.aria.next")} onClick={next}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
