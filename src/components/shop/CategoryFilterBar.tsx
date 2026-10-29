"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X, ArrowUpDown, Search, RotateCcw } from "lucide-react";
import type { VariantSize } from "@/features/storefront/types/variant";
import type { CategorySubcategory, SortOption } from "@/types/category";

const SIZES: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

interface CategoryFilterBarProps {
  totalCount: number;
  subcategories: CategorySubcategory[];
  activeSubcategory: string;
  onSelectSubcategory: (id: string) => void;
  selectedSizes: VariantSize[];
  onToggleSize: (size: VariantSize) => void;
  activeSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function CategoryFilterBar({
  totalCount,
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
  selectedSizes,
  onToggleSize,
  activeSort,
  onSelectSort,
  searchQuery,
  onSearchChange,
  onResetFilters,
  hasActiveFilters,
}: CategoryFilterBarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeFiltersCount =
    (activeSubcategory !== "all" ? 1 : 0) +
    selectedSizes.length +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Main Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Item Counter & Search Input */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--vault-ink)] font-semibold">
              {totalCount} {totalCount === 1 ? "Piece Available" : "Pieces Available"}
            </span>

            {/* Quick Keyword Search */}
            <div className="relative flex items-center">
              <Search
                size={14}
                className="absolute left-3 text-[var(--vault-muted)] pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search silhouettes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-40 sm:w-56 rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] pl-8 pr-3 py-1.5 font-mono text-[11px] text-[var(--vault-ink)] placeholder-[var(--vault-muted)] focus:border-[var(--vault-accent)] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Desktop Size Pills */}
            <div className="hidden lg:flex items-center gap-1 border-r border-[var(--vault-line)] pr-3">
              <span className="mr-2 font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                Size:
              </span>
              {SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onToggleSize(size)}
                    className={`h-7 w-8 font-mono text-[10px] uppercase transition-colors cursor-pointer border ${
                      isSelected
                        ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                        : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)] hover:text-[var(--vault-ink)]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown
                size={13}
                className="absolute left-3 text-[var(--vault-muted)] pointer-events-none"
              />
              <select
                value={activeSort}
                onChange={(e) => onSelectSort(e.target.value as SortOption)}
                aria-label="Sort products"
                className="appearance-none rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] pl-8 pr-8 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-ink)] focus:border-[var(--vault-accent)] focus:outline-none transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[var(--vault-panel)] text-[var(--vault-ink)]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-[var(--vault-line)] bg-[var(--vault-bg)] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-[var(--vault-ink)] hover:border-[var(--vault-accent)] transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--vault-accent)] font-mono text-[9px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="mt-4 pt-3 border-t border-[var(--vault-line)] flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--vault-muted)]">
              Active:
            </span>

            {/* Subcategory chip */}
            {activeSubcategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase border border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]">
                Category: {activeSubcategory}
                <button
                  type="button"
                  onClick={() => onSelectSubcategory("all")}
                  aria-label={`Remove category filter ${activeSubcategory}`}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {/* Size chips */}
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase border border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]"
              >
                Size: {size}
                <button
                  type="button"
                  onClick={() => onToggleSize(size)}
                  aria-label={`Remove size filter ${size}`}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            {/* Search query chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase border border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)]">
                Search: “{searchQuery}”
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Remove search filter"
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={11} />
                </button>
              </span>
            )}

            {/* Clear All action */}
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--vault-cobalt)] hover:underline ml-2 cursor-pointer"
            >
              <RotateCcw size={10} /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-sm h-full bg-[var(--vault-panel)] border-l border-[var(--vault-line)] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[var(--vault-line)] pb-4">
                <div>
                  <h3 className="font-serif text-xl uppercase tracking-tight text-[var(--vault-ink)]">
                    Refine Selection
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--vault-muted)]">
                    {totalCount} pieces match
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex h-9 w-9 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] hover:text-[var(--vault-accent)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Subcategories Filter */}
              <div className="py-6 border-b border-[var(--vault-line)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] mb-3">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {subcategories.map((sub) => {
                    const isActive = activeSubcategory.toLowerCase() === sub.id.toLowerCase();
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectSubcategory(sub.id)}
                        className={`px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider border transition-colors ${
                          isActive
                            ? "border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] font-bold"
                            : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)]"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter */}
              <div className="py-6 border-b border-[var(--vault-line)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] mb-3">
                  Select Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => onToggleSize(size)}
                        className={`h-9 w-10 font-mono text-xs uppercase border transition-colors ${
                          isSelected
                            ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                            : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-ink)]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-[var(--vault-line)] space-y-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="btn-primary w-full py-3 font-mono text-xs uppercase tracking-widest font-bold"
              >
                Apply Filters ({totalCount})
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    onResetFilters();
                    setMobileDrawerOpen(false);
                  }}
                  className="btn-secondary w-full py-2.5 font-mono text-xs uppercase tracking-widest"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

