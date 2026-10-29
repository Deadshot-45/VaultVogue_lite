"use client";

import React from "react";
import {
  SlidersHorizontal,
  Search,
  X,
  ArrowUpDown,
  RotateCcw,
  LayoutGrid,
  Grid3X3,
  Radio,
} from "lucide-react";
import type { CatalogSortOption } from "@/types/catalog";

const SORT_OPTIONS: { label: string; value: CatalogSortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

interface ProductCatalogToolbarProps {
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  sort: CatalogSortOption;
  onSortChange: (sort: CatalogSortOption) => void;
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  onOpenMobileFilters: () => void;
  onToggleDesktopFilters: () => void;
  desktopFiltersOpen: boolean;
  gridDensity: 3 | 4;
  onToggleGridDensity: () => void;
  onClearAllFilters: () => void;
  activeFilterChips: { key: string; label: string }[];
  onRemoveFilter: (key: string) => void;
  isLive: boolean;
}

export function ProductCatalogToolbar({
  totalCount,
  search,
  onSearchChange,
  sort,
  onSortChange,
  activeFiltersCount,
  hasActiveFilters,
  onOpenMobileFilters,
  onToggleDesktopFilters,
  desktopFiltersOpen,
  gridDensity,
  onToggleGridDensity,
  onClearAllFilters,
  activeFilterChips,
  onRemoveFilter,
  isLive,
}: ProductCatalogToolbarProps) {
  return (
    <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Main Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Product Count & Live Indicator & Search */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[var(--vault-ink)] font-semibold">
                {totalCount} {totalCount === 1 ? "Piece" : "Pieces"}
              </span>
              {isLive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-[var(--vault-accent)]/30 bg-[var(--vault-accent)]/10 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-accent)]">
                  <Radio size={10} className="animate-pulse" />
                  Live API
                </span>
              )}
            </div>

            {/* Quick Search Input */}
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-[var(--vault-muted)] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search catalog..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-44 sm:w-60 rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] pl-8 pr-7 py-1.5 font-mono text-[11px] text-[var(--vault-ink)] placeholder-[var(--vault-muted)] focus:border-[var(--vault-accent)] focus:outline-none transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  aria-label="Clear search query"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls & Sorting */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Desktop Filters Toggle Button */}
            <button
              type="button"
              onClick={onToggleDesktopFilters}
              className={`hidden lg:flex items-center gap-2 border px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                desktopFiltersOpen
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] font-semibold"
                  : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)]"
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>{desktopFiltersOpen ? "Hide Filters" : "Filter Catalog"}</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--vault-accent)] font-mono text-[9px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Mobile Filters Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenMobileFilters}
              className="lg:hidden flex items-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-bg)] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--vault-accent)] font-mono text-[9px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Grid Density Toggle (Desktop Only) */}
            <button
              type="button"
              onClick={onToggleGridDensity}
              aria-label={`Switch to ${gridDensity === 4 ? "3 columns" : "4 columns"}`}
              className="hidden sm:flex h-9 w-9 items-center justify-center border border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)] hover:border-[var(--vault-accent)] transition-colors cursor-pointer"
            >
              {gridDensity === 4 ? <LayoutGrid size={15} /> : <Grid3X3 size={15} />}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown
                size={13}
                className="absolute left-3 text-[var(--vault-muted)] pointer-events-none"
              />
              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as CatalogSortOption)}
                aria-label="Sort products catalog"
                className="appearance-none rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] pl-8 pr-8 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[var(--vault-panel)] text-[var(--vault-ink)]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {hasActiveFilters && (
          <div className="mt-4 pt-3 border-t border-[var(--vault-line)] flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
              Active Filters:
            </span>

            {activeFilterChips.map((chip) => (
              <span
                key={chip.key}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase border border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={() => onRemoveFilter(chip.key)}
                  aria-label={`Remove filter ${chip.label}`}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={onClearAllFilters}
              className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--vault-cobalt)] hover:underline ml-2 cursor-pointer"
            >
              <RotateCcw size={10} /> Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

