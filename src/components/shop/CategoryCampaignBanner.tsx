"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import type { CategoryCampaign } from "@/types/category";

interface CategoryCampaignBannerProps {
  campaign: CategoryCampaign;
  categoryKey: string;
}

export function CategoryCampaignBanner({ campaign, categoryKey }: CategoryCampaignBannerProps) {
  return (
    <section
      id="category-campaign"
      aria-label="Category Campaign Spotlight"
      className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-bg)] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 sm:p-10 lg:p-12 shadow-xl">
          {/* Left Column: Editorial Campaign Visual */}
          <div className="lg:col-span-6 relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full overflow-hidden border border-[var(--vault-line)] group">
            <Image
              src={campaign.image}
              alt={campaign.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {/* Ambient Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Floating Tag */}
            <div className="absolute bottom-4 left-4 z-10 font-mono text-[9px] uppercase tracking-[0.25em] text-white/90 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/20">
              VAULT EDITORIAL // {categoryKey.toUpperCase()}
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--vault-accent)]" />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--vault-accent)]">
                  {campaign.subtitle}
                </span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-none">
                {campaign.title}
              </h2>
              <p className="font-mono text-xs uppercase tracking-widest text-[var(--vault-cobalt)] font-medium">
                {campaign.tagline}
              </p>
            </div>

            {/* Editorial Quote */}
            {campaign.quote && (
              <blockquote className="relative border-l-2 border-[var(--vault-accent)] pl-4 italic text-sm text-[var(--vault-ink)]/90 font-serif leading-relaxed">
                <Quote size={16} className="text-[var(--vault-accent)] mb-1 opacity-70" />
                “{campaign.quote}”
              </blockquote>
            )}

            {/* Narrative Body */}
            <p className="text-xs sm:text-sm text-[var(--vault-muted)] leading-relaxed font-sans">
              {campaign.description}
            </p>

            {/* Action Links */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={campaign.href}
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest font-bold shadow-md hover:scale-[1.02] active:scale-98 transition-transform"
              >
                {campaign.ctaText || "Explore Editorial"} <ArrowUpRight size={14} />
              </Link>
              <Link
                href="#category-products"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[var(--vault-ink)] hover:text-[var(--vault-accent)] transition-colors py-2"
              >
                View Curated Pieces ↓
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

