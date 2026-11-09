"use client";

import React, { useRef } from "react";
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

  return (
    <nav
      aria-label="Silhouettes Sub-Navigation"
      className="w-full border-b border-(--vault-line) bg-(--vault-panel)/80 backdrop-blur-md sticky top-[--header-height] z-30 transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Filter by silhouette"
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5"
        >
          {subcategories.map((sub) => {
            const isActive = activeSubcategory.toLowerCase() === sub.id.toLowerCase();

            return (
              <button
                key={sub.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "border-(--vault-accent) bg-(--vault-accent) text-white font-semibold shadow-sm scale-[1.02]"
                    : "border-(--vault-line) bg-(--vault-bg) text-(--vault-muted) hover:text-(--vault-ink) hover:border-(--vault-ink)/40"
                }`}
              >
                <span>{sub.label}</span>
                {sub.productCount !== undefined && (
                  <span
                    className={`text-[9px] font-mono opacity-80 ${
                      isActive ? "text-white" : "text-(--vault-muted)"
                    }`}
                  >
                    ({sub.productCount})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
