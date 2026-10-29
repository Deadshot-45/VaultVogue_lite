"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { CategoryConfig } from "@/types/category";

interface CategoryHeroProps {
  config: CategoryConfig;
}

export function CategoryHero({ config }: CategoryHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Image reveal
      if (imgWrapperRef.current) {
        tl.fromTo(
          imgWrapperRef.current,
          {
            clipPath: "polygon(0 10%, 100% 10%, 100% 90%, 0 90%)",
            scale: 1.08,
            opacity: 0.7,
          },
          {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "power2.out",
          },
        );
      }

      // Kicker & Badge reveal
      tl.fromTo(
        ".cat-hero-kicker",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.8",
      );

      // Oversized Headline reveal
      tl.fromTo(
        ".cat-hero-title",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" },
        "-=0.5",
      );

      // Subtitle & Tagline
      tl.fromTo(
        ".cat-hero-subtitle",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4",
      );

      // CTAs
      tl.fromTo(
        ".cat-hero-cta",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 },
        "-=0.3",
      );
    }, heroRef);

    return () => ctx.revert();
  }, [config.key]);

  const scrollToGrid = () => {
    const el = document.getElementById("category-products");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCampaign = () => {
    const el = document.getElementById("category-campaign");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      ref={heroRef}
      className="relative min-h-[82vh] lg:min-h-[88vh] w-full overflow-hidden border-b border-[var(--vault-line)] bg-[var(--vault-bg)] flex items-end"
    >
      {/* Background Campaign Imagery with Contrast Overlays */}
      <div ref={imgWrapperRef} className="absolute inset-0 z-0">
        <Image
          src={config.heroImage}
          alt={config.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-top"
        />

        {/* Cinematic Dual Gradient Overlays for Readability across Light & Dark themes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--vault-bg)] via-[var(--vault-bg)]/60 to-[var(--vault-bg)]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--vault-bg)]/85 via-[var(--vault-bg)]/40 to-transparent" />
        <div className="absolute inset-0 bg-black/25 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-14 pt-32 sm:pb-20">
        <div className="max-w-3xl">
          {/* Accent Kicker & Season Label */}
          <div className="cat-hero-kicker flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--vault-accent)] border border-[var(--vault-accent)]/30 bg-[var(--vault-panel)]/80 backdrop-blur-md">
              {config.accentLabel}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">
              {config.seasonBadge}
            </span>
          </div>

          {/* Masked Headline */}
          <div className="overflow-hidden mt-4">
            <h1
              ref={headlineRef}
              className="cat-hero-title font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[var(--vault-ink)] uppercase leading-[0.9]"
            >
              {config.title}
            </h1>
          </div>

          {/* Subtitle & Tagline */}
          <div className="cat-hero-subtitle mt-5 space-y-2">
            <p className="font-mono text-sm sm:text-base uppercase tracking-widest text-[var(--vault-accent)] font-semibold">
              {config.subtitle} — {config.tagline}
            </p>
            <p className="text-xs sm:text-sm text-[var(--vault-muted)] max-w-xl leading-relaxed font-sans">
              {config.description}
            </p>
          </div>

          {/* Dual CTAs */}
          <div className="cat-hero-cta mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToGrid}
              className="btn-primary inline-flex items-center gap-2 px-7 py-3.5 font-mono text-xs uppercase tracking-widest font-bold shadow-xl hover:scale-[1.02] active:scale-98 transition-transform cursor-pointer"
            >
              Shop Collection <ArrowDown size={14} />
            </button>

            <button
              type="button"
              onClick={scrollToCampaign}
              className="btn-secondary inline-flex items-center gap-2 px-6 py-3.5 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
            >
              Explore Campaign <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Corner Coordinate */}
      <div className="hidden md:flex absolute bottom-6 right-8 z-10 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--vault-muted)] border-t border-[var(--vault-line)] pt-2">
        <span>VAULT VOGUE</span>
        <span>//</span>
        <span className="text-[var(--vault-ink)]">
          {config.key.toUpperCase()} CATEGORY ARCHIVE
        </span>
      </div>
    </header>
  );
}
