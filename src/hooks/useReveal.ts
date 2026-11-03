"use client";

import { useEffect, useRef, useState } from "react";

/** Delays (seconds) applied to successive cards so they animate in as a wave. */
export const REVEAL_STAGGER_DELAYS = [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.42];

/** Flips `inView` to true the first time the element scrolls into the viewport. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
