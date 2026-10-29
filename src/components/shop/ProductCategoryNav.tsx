"use client";

import React from "react";
import type { CatalogCategory, CatalogBadge } from "@/types/catalog";

interface ProductCategoryNavProps {
  activeCategory: CatalogCategory;
  activeBadge: CatalogBadge;
  onSelectCategory: (category: CatalogCategory) => void;
  onSelectBadge: (badge: CatalogBadge) => void;
}

export function ProductCategoryNav({
  activeCategory,
  activeBadge,
  onSelectCategory,
  onSelectBadge,
}: ProductCategoryNavProps) {
  const tabs = [
    {
      id: "all",
      label: "All Pieces",
      isActive: activeCategory === "all" && activeBadge === "all",
      onClick: () => {
        onSelectBadge("all");
        onSelectCategory("all");
      },
    },
    {
      id: "men",
      label: "Men",
      isActive: activeCategory === "men" && activeBadge === "all",
      onClick: () => {
        onSelectBadge("all");
        onSelectCategory("men");
      },
    },
    {
      id: "women",
      label: "Women",
      isActive: activeCategory === "women" && activeBadge === "all",
      onClick: () => {
        onSelectBadge("all");
        onSelectCategory("women");
      },
    },
    {
      id: "kids",
      label: "Kids",
      isActive: activeCategory === "kids" && activeBadge === "all",
      onClick: () => {
        onSelectBadge("all");
        onSelectCategory("kids");
      },
    },
    {
      id: "new",
      label: "New Arrivals",
      isActive: activeBadge === "new",
      onClick: () => {
        onSelectBadge("new");
      },
    },
    {
      id: "bestseller",
      label: "Best Sellers",
      isActive: activeBadge === "bestseller",
      onClick: () => {
        onSelectBadge("bestseller");
      },
    },
    {
      id: "sale",
      label: "Sale & Archive",
      isActive: activeBadge === "sale",
      onClick: () => {
        onSelectBadge("sale");
      },
    },
  ];

  return (
    <nav
      aria-label="Catalog Division Navigation"
      className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)] py-3 sm:py-4 sticky top-16 sm:top-20 z-30 backdrop-blur-md bg-[var(--vault-panel)]/95"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div
          tabIndex={0}
          aria-label="Category navigation options"
          className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-1 focus:outline-none focus:ring-1 focus:ring-[var(--vault-accent)]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              className={`flex-shrink-0 px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer border ${
                tab.isActive
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold shadow-sm"
                  : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)]/60 hover:text-[var(--vault-accent)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

