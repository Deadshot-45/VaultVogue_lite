"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReducedMotion } from "@/lib/animations/gsap-utils";
import type { CategoryCampaign } from "@/types/category";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryCampaignBannerProps {
  campaign: CategoryCampaign;
  categoryKey: string;
}

export function CategoryCampaignBanner({ campaign, categoryKey }: CategoryCampaignBannerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    const ctx = gsap.context(() => {
      if (imgRef.current && contentRef.current) {
        gsap.fromTo(
          imgRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );

        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [categoryKey]);

  return (
    <section
      ref={containerRef}
      id="category-campaign"
      aria-label="Category Campaign Spotlight"
      className="w-full border-t border-(--vault-line) bg-(--vault-bg) py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-(--vault-line) bg-(--vault-panel) p-6 sm:p-10 lg:p-12">
          {/* Left Column: Editorial Campaign Visual */}
          <div
            ref={imgRef}
            className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] w-full overflow-hidden border border-(--vault-line) group"
          >
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            {/* Floating Tag */}
            <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/20">
              EDITORIAL ARCHIVE // {categoryKey.toUpperCase()}
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Copy */}
          <div ref={contentRef} className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="space-y-2">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-(--vault-accent)">
                {campaign.subtitle}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-(--vault-ink) leading-none">
                {campaign.title}
              </h2>
              <p className="font-mono text-xs uppercase tracking-widest text-(--vault-cobalt) font-medium">
                {campaign.tagline}
              </p>
            </div>

            {/* Editorial Quote */}
            {campaign.quote && (
              <blockquote className="border-l border-(--vault-accent) pl-4 italic text-sm text-(--vault-ink)/90 font-serif leading-relaxed">
                “{campaign.quote}”
              </blockquote>
            )}

            {/* Narrative Body */}
            <p className="text-xs sm:text-sm text-(--vault-muted) leading-relaxed font-sans max-w-lg">
              {campaign.description}
            </p>

            {/* Action Link */}
            <div className="pt-3">
              <Link
                href={campaign.href}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold shadow-md hover:scale-[1.02] active:scale-98 transition-transform cursor-pointer"
              >
                <span>{campaign.ctaText || "Explore Story"}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
