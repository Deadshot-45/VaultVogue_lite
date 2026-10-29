"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/lib/animations/gsap-utils";

export function ProductCatalogHero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (bgImgRef.current) {
        tl.fromTo(
          bgImgRef.current,
          { opacity: 0.6, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 1.1, ease: "power2.out" },
        );
      }

      tl.fromTo(
        ".cat-hero-tag",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4 },
        "-=0.7",
      );

      tl.fromTo(
        ".cat-hero-title",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.75, ease: "power4.out" },
        "-=0.4",
      );

      tl.fromTo(
        ".cat-hero-desc",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5 },
        "-=0.3",
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-grid-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      ref={heroRef}
      className="relative min-h-[44vh] sm:min-h-[50vh] w-full overflow-hidden border-b border-[var(--vault-line)] bg-[var(--vault-bg)] flex items-end"
    >
      {/* Background Campaign Visual */}
      <div ref={bgImgRef} className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=85"
          alt="VAULT VOGUE Full Catalog Collection"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />

        {/* Ambient Overlay for High Contrast and Theme Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--vault-bg)] via-[var(--vault-bg)]/75 to-[var(--vault-bg)]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--vault-bg)]/90 via-[var(--vault-bg)]/50 to-transparent" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-24 sm:pb-12">
        <div className="max-w-2xl">
          {/* Eyebrow Label */}
          <div className="cat-hero-tag flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--vault-accent)] border border-[var(--vault-accent)]/30 bg-[var(--vault-panel)]/80 backdrop-blur-md">
              THE VAULT COLLECTION
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-muted)]">
              ALL SILHOUETTES · EDITION 04
            </span>
          </div>

          {/* Masked Headline */}
          <div className="overflow-hidden mt-3">
            <h1 className="cat-hero-title font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[var(--vault-ink)] uppercase leading-none">
              FIND YOUR NEXT ICON.
            </h1>
          </div>

          {/* Supporting Copy */}
          <p className="cat-hero-desc mt-3 text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed font-sans max-w-xl">
            Discover contemporary essentials, expressive silhouettes, and everyday pieces designed to move with you.
          </p>

          {/* Clear Shopping CTA */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToCatalog}
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 font-mono text-xs uppercase tracking-widest font-bold shadow-md hover:scale-[1.02] active:scale-98 transition-transform cursor-pointer"
            >
              Browse Catalog <ArrowDown size={13} />
            </button>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-muted)] hidden sm:inline">
              Standard Global Dispatch · Authenticity Guaranteed
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

