"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hook to animate an element on mount / change with GSAP
 */
export function useGsapFadeIn<T extends HTMLElement>(
  deps: React.DependencyList = [],
  options?: {
    y?: number;
    duration?: number;
    delay?: number;
  },
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: options?.y ?? 20 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.6,
          delay: options?.delay ?? 0,
          ease: "power3.out",
        },
      );
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * Hook to animate child elements with a staggered reveal using GSAP
 */
export function useGsapStagger<T extends HTMLElement>(
  selector: string,
  deps: React.DependencyList = [],
  options?: {
    stagger?: number;
    y?: number;
    duration?: number;
  },
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current || isReducedMotion()) return;

    const ctx = gsap.context(() => {
      const targets = ref.current?.querySelectorAll(selector);
      if (targets && targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0, y: options?.y ?? 24 },
          {
            opacity: 1,
            y: 0,
            duration: options?.duration ?? 0.5,
            stagger: options?.stagger ?? 0.08,
            ease: "power2.out",
          },
        );
      }
    }, ref);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
