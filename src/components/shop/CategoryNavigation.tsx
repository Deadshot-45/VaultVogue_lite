"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CategorySubcategory } from "@/types/category";

interface CategoryNavigationProps {
  subcategories: CategorySubcategory[];
  activeSubcategory: string;
  onSelectSubcategory: (subcategoryId: string) => void;
}

export function CategoryNavigation({
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
}: CategoryNavigationProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -280 : 280;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <nav
      aria-label="Category Sub-Navigation"
      className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)] py-6 sm:py-8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header with Scroll Controls */}
        <div className="flex items-center justify-between pb-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--vault-accent)]">
              Quick Navigation
            </p>
            <h2 className="font-serif text-lg sm:text-xl uppercase tracking-tight text-[var(--vault-ink)] font-light">
              Explore Silhouettes
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll categories left"
              className="flex h-8 w-8 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll categories right"
              className="flex h-8 w-8 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] transition hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontally Scrollable Categories Slider */}
        <div
          ref={scrollContainerRef}
          tabIndex={0}
          aria-label="Category sub-navigation options"
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)]"
        >
          {subcategories.map((sub) => {
            const isActive = activeSubcategory.toLowerCase() === sub.id.toLowerCase();

            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                className={`group relative flex-shrink-0 flex items-center gap-3 border px-4 py-3 transition-all duration-300 text-left cursor-pointer ${
                  isActive
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 shadow-md ring-1 ring-[var(--vault-accent)]"
                    : "border-[var(--vault-line)] bg-[var(--vault-bg)] hover:border-[var(--vault-ink)]/40 hover:bg-[var(--vault-panel)]"
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative h-12 w-10 sm:h-14 sm:w-12 overflow-hidden border border-[var(--vault-line)] bg-black/10">
                  <Image
                    src={sub.image}
                    alt={sub.label}
                    fill
                    sizes="48px"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-[var(--vault-accent)]/20" />
                  )}
                </div>

                {/* Subcategory Label & Piece Count */}
                <div className="min-w-[80px]">
                  <span
                    className={`block font-serif text-xs sm:text-sm uppercase tracking-wider transition-colors ${
                      isActive
                        ? "font-semibold text-[var(--vault-accent)]"
                        : "text-[var(--vault-ink)] group-hover:text-[var(--vault-ink)]"
                    }`}
                  >
                    {sub.label}
                  </span>
                  {sub.productCount !== undefined && (
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
                      {sub.productCount} {sub.productCount === 1 ? "Piece" : "Pieces"}
                    </span>
                  )}
                </div>

                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[var(--vault-accent)] animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

