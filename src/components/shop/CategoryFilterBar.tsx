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
    <div className="w-full border-b border-(--vault-line) bg-(--vault-panel)/90 backdrop-blur-sm transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        {/* Main Filter Strip */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          {/* Left: Item Counter & Search Input */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="font-mono text-xs uppercase tracking-wider text-(--vault-ink) font-medium">
              {totalCount} {totalCount === 1 ? "Piece" : "Pieces"}
            </span>

            {/* Quick Keyword Search */}
            <div className="relative flex items-center">
              <Search
                size={13}
                className="absolute left-2.5 text-(--vault-muted) pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search silhouettes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-36 sm:w-52 border border-(--vault-line) bg-(--vault-bg) pl-7 pr-7 py-1.5 font-mono text-[11px] text-(--vault-ink) placeholder-(--vault-muted) focus:border-(--vault-accent) focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2 text-(--vault-muted) hover:text-(--vault-ink) cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Right: Controls & Sort */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Desktop Size Selector */}
            <div className="hidden lg:flex items-center gap-1 border-r border-(--vault-line) pr-3">
              <span className="mr-1.5 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                Size:
              </span>
              {SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onToggleSize(size)}
                    className={`h-6 w-7 font-mono text-[10px] uppercase transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? "border-(--vault-accent) bg-(--vault-accent) text-white font-bold"
                        : "border-(--vault-line) bg-(--vault-bg) text-(--vault-muted) hover:border-(--vault-ink) hover:text-(--vault-ink)"
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
                size={12}
                className="absolute left-2.5 text-(--vault-muted) pointer-events-none"
              />
              <select
                value={activeSort}
                onChange={(e) => onSelectSort(e.target.value as SortOption)}
                aria-label="Sort products"
                className="appearance-none border border-(--vault-line) bg-(--vault-bg) pl-7 pr-7 py-1.5 font-mono text-[11px] uppercase tracking-wider text-(--vault-ink) focus:border-(--vault-accent) focus:outline-none transition-colors cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-(--vault-panel) text-(--vault-ink)">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-(--vault-line) bg-(--vault-bg) px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-(--vault-ink) hover:border-(--vault-accent) transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={12} />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-(--vault-accent) font-mono text-[9px] text-white">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="mt-3 pt-2.5 border-t border-(--vault-line) flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="font-mono text-[9px] uppercase tracking-widest text-(--vault-muted)">
              Active:
            </span>

            {/* Subcategory chip */}
            {activeSubcategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase border border-(--vault-accent) bg-(--vault-accent)/10 text-(--vault-accent)">
                <span>{activeSubcategory}</span>
                <button
                  type="button"
                  onClick={() => onSelectSubcategory("all")}
                  aria-label={`Remove category filter ${activeSubcategory}`}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Size chips */}
            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase border border-(--vault-accent) bg-(--vault-accent)/10 text-(--vault-accent)"
              >
                <span>Size: {size}</span>
                <button
                  type="button"
                  onClick={() => onToggleSize(size)}
                  aria-label={`Remove size filter ${size}`}
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={10} />
                </button>
              </span>
            ))}

            {/* Search query chip */}
            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] uppercase border border-(--vault-accent) bg-(--vault-accent)/10 text-(--vault-accent)">
                <span>Search: “{searchQuery}”</span>
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Remove search filter"
                  className="hover:opacity-70 cursor-pointer"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Reset All Action */}
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-(--vault-cobalt) hover:underline ml-1 cursor-pointer"
            >
              <RotateCcw size={10} /> Clear
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative z-10 w-full max-w-xs h-full bg-(--vault-panel) border-l border-(--vault-line) p-5 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-(--vault-line) pb-4">
                <div>
                  <h3 className="font-serif text-lg uppercase tracking-tight text-(--vault-ink)">
                    Refine Selection
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-(--vault-muted)">
                    {totalCount} pieces match
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center border border-(--vault-line) text-(--vault-ink) hover:text-(--vault-accent) cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Subcategories Filter */}
              <div className="py-5 border-b border-(--vault-line)">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-(--vault-accent) mb-3 font-semibold">
                  Silhouettes
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {subcategories.map((sub) => {
                    const isActive = activeSubcategory.toLowerCase() === sub.id.toLowerCase();
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => onSelectSubcategory(sub.id)}
                        className={`px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                          isActive
                            ? "border-(--vault-accent) bg-(--vault-accent)/10 text-(--vault-accent) font-semibold"
                            : "border-(--vault-line) bg-(--vault-bg) text-(--vault-ink)"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Filter */}
              <div className="py-5 border-b border-(--vault-line)">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-(--vault-accent) mb-3 font-semibold">
                  Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => onToggleSize(size)}
                        className={`h-8 w-9 font-mono text-xs uppercase border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-(--vault-accent) bg-(--vault-accent) text-white font-bold"
                            : "border-(--vault-line) bg-(--vault-bg) text-(--vault-ink)"
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
            <div className="pt-5 border-t border-(--vault-line) space-y-2">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="btn-primary w-full py-2.5 font-mono text-xs uppercase tracking-widest font-bold cursor-pointer"
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
                  className="btn-secondary w-full py-2 font-mono text-xs uppercase tracking-widest cursor-pointer"
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
