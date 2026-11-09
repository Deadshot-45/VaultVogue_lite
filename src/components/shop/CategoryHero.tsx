"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { gsap } from "gsap";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { CategoryConfig } from "@/types/category";

interface CategoryHeroProps {
  config: CategoryConfig;
}

export function CategoryHero({ config }: CategoryHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Subtle scale-in on the editorial campaign backdrop
      if (imgWrapperRef.current) {
        tl.fromTo(
          imgWrapperRef.current,
          { scale: 1.06, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" },
        );
      }

      // Title reveal from overflow mask
      tl.fromTo(
        ".cat-hero-title-text",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.9, ease: "power4.out" },
        "-=0.9",
      );

      // Meta and description fade & slide
      tl.fromTo(
        ".cat-hero-meta",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5",
      );
    }, heroRef);

    return () => ctx.revert();
  }, [config.key]);

  const scrollToCatalog = () => {
    const el = document.getElementById("category-catalog");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      ref={heroRef}
      className="relative min-h-[48vh] sm:min-h-[54vh] lg:min-h-[58vh] w-full overflow-hidden border-b border-(--vault-line) bg-(--vault-bg) flex items-end"
    >
      {/* Background Campaign Imagery with Atmospheric Gradients */}
      <div ref={imgWrapperRef} className="absolute inset-0 z-0">
        <Image
          src={config.heroImage}
          alt={config.heroAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-top"
        />

        {/* Ambient Dark/Light adaptive gradients for optimal contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-(--vault-bg) via-(--vault-bg)/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-(--vault-bg)/90 via-(--vault-bg)/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 pt-28 sm:pb-14">
        <div className="max-w-2xl">
          {/* Subtle Category Season Label */}
          <div className="cat-hero-meta flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-(--vault-accent)">
            <span>{config.seasonBadge || "ARCHIVE COLLECTION"}</span>
            <span className="opacity-40">/</span>
            <span className="text-(--vault-muted)">EDITION 04</span>
          </div>

          {/* Masked Editorial Headline */}
          <div ref={titleWrapperRef} className="overflow-hidden mt-3">
            <h1 className="cat-hero-title-text font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-(--vault-ink) uppercase leading-[0.9]">
              {config.title}
            </h1>
          </div>

          {/* Subtitle & Narrative */}
          <div className="cat-hero-meta mt-4 space-y-2">
            <p className="font-mono text-xs sm:text-sm uppercase tracking-wider text-(--vault-ink) font-medium">
              {config.subtitle} — {config.tagline}
            </p>
            <p className="text-xs sm:text-sm text-(--vault-muted) max-w-lg leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
              {config.description}
            </p>
          </div>

          {/* Single Streamlined Anchor CTA */}
          <div className="cat-hero-meta mt-6">
            <button
              type="button"
              onClick={scrollToCatalog}
              className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-(--vault-accent) hover:text-(--vault-ink) transition-colors cursor-pointer"
            >
              <span>Explore Collection</span>
              <span className="flex h-6 w-6 items-center justify-center border border-(--vault-accent)/50 rounded-full transition-transform duration-300 group-hover:translate-y-1 group-hover:border-(--vault-ink)">
                <ArrowDown size={11} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Minimal Corner Monospace Signature */}
      <div className="hidden lg:flex absolute bottom-6 right-8 z-10 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.25em] text-(--vault-muted)">
        <span>VAULT ARCHIVE</span>
        <span className="opacity-40">·</span>
        <span className="text-(--vault-ink)">{config.key.toUpperCase()}</span>
      </div>
    </header>
  );
}
