"use client";

import React, { useState } from "react";
import { X, RotateCcw, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CatalogCategory, CatalogBadge } from "@/types/catalog";
import type { VariantSize } from "@/features/storefront/types/variant";

const CATEGORIES: { id: CatalogCategory; label: string }[] = [
  { id: "all", label: "All Collections" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
];

const SUBCATEGORIES = [
  { id: "all", label: "All Silhouettes" },
  { id: "jackets", label: "Jackets & Outerwear" },
  { id: "hoodies", label: "Hoodies & Sweats" },
  { id: "knitwear", label: "Knitwear" },
  { id: "shirts", label: "Shirts & Polos" },
  { id: "trousers", label: "Trousers & Pants" },
  { id: "dresses", label: "Dresses & Skirts" },
  { id: "footwear", label: "Footwear" },
  { id: "accessories", label: "Accessories" },
  { id: "playsuits", label: "Playsuits & Sets" },
];

const SIZES: readonly VariantSize[] = ["XS", "S", "M", "L", "XL"];

const COLOR_SWATCHES = [
  { id: "all", name: "All Colors", hex: "transparent" },
  { id: "black", name: "Midnight Black", hex: "#080B12" },
  { id: "ivory", name: "Warm Ivory", hex: "#F8F4F1" },
  { id: "rose", name: "Rose Gold", hex: "#B76E79" },
  { id: "cobalt", name: "Electric Cobalt", hex: "#2457FF" },
  { id: "slate", name: "Charcoal Slate", hex: "#1D2330" },
  { id: "indigo", name: "Raw Indigo", hex: "#0E1C36" },
  { id: "olive", name: "Desert Olive", hex: "#555246" },
];

const PRICE_PRESETS: {
  label: string;
  min: number | null;
  max: number | null;
}[] = [
  { label: "All Prices", min: null, max: null },
  { label: "Under ₹3,000", min: null, max: 3000 },
  { label: "₹3,000 – ₹7,000", min: 3000, max: 7000 },
  { label: "₹7,000 – ₹15,000", min: 7000, max: 15000 },
  { label: "Over ₹15,000", min: 15000, max: null },
];

interface FilterBodyProps {
  category: CatalogCategory;
  onSelectCategory: (cat: CatalogCategory) => void;
  subcategory: string;
  onSelectSubcategory: (sub: string) => void;
  selectedSize: VariantSize | "";
  onSelectSize: (sz: VariantSize | "") => void;
  selectedColor: string;
  onSelectColor: (clr: string) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onSelectPriceRange: (min: number | null, max: number | null) => void;
  badge: CatalogBadge;
  onSelectBadge: (badge: CatalogBadge) => void;
  onResetAll: () => void;
  hasActiveFilters: boolean;
}

function FilterControls({
  category,
  onSelectCategory,
  subcategory,
  onSelectSubcategory,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  minPrice,
  maxPrice,
  onSelectPriceRange,
  badge,
  onSelectBadge,
  onResetAll,
  hasActiveFilters,
}: FilterBodyProps) {
  const [customMin, setCustomMin] = useState(minPrice ? String(minPrice) : "");
  const [customMax, setCustomMax] = useState(maxPrice ? String(maxPrice) : "");

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = customMin ? Math.max(0, Number(customMin)) : null;
    const max = customMax ? Math.max(0, Number(customMax)) : null;
    onSelectPriceRange(min, max);
  };

  return (
    <div className="space-y-7 text-[var(--vault-ink)]">
      {/* 1. Category Division */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Division
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                category === cat.id
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                  : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)] hover:text-[var(--vault-ink)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subcategories */}
      <div className="border-t border-[var(--vault-line)] pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Silhouettes
        </p>
        <div className="space-y-1">
          {SUBCATEGORIES.map((sub) => {
            const isActive = subcategory.toLowerCase() === sub.id.toLowerCase();
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  isActive
                    ? "border-l-2 border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] font-bold pl-2"
                    : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                }`}
              >
                <span>{sub.label}</span>
                {isActive && (
                  <Check size={12} className="text-[var(--vault-accent)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sizes */}
      <div className="border-t border-[var(--vault-line)] pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Sizes
        </p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => onSelectSize("")}
            className={`h-8 px-2.5 border font-mono text-[10px] uppercase transition-colors cursor-pointer ${
              selectedSize === ""
                ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)]"
            }`}
          >
            All
          </button>
          {SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(selectedSize === sz ? "" : sz)}
              className={`h-8 w-9 border font-mono text-[10px] uppercase transition-colors cursor-pointer ${
                selectedSize === sz
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                  : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Colors */}
      <div className="border-t border-[var(--vault-line)] pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Palette
        </p>
        <div className="grid grid-cols-2 gap-2">
          {COLOR_SWATCHES.map((c) => {
            const isActive = selectedColor.toLowerCase() === c.id.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectColor(c.id)}
                className={`flex items-center gap-2 border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  isActive
                    ? "border-[var(--vault-accent)] bg-[var(--vault-accent)]/10 text-[var(--vault-accent)] font-bold"
                    : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)] hover:text-[var(--vault-ink)]"
                }`}
              >
                {c.hex !== "transparent" ? (
                  <span
                    className="h-3 w-3 rounded-full border border-black/20 flex-shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                ) : (
                  <span className="h-3 w-3 rounded-full border border-dashed border-[var(--vault-line)] flex-shrink-0" />
                )}
                <span className="truncate">{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Price Range */}
      <div className="border-t border-[var(--vault-line)] pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Price (INR)
        </p>

        {/* Quick Presets */}
        <div className="space-y-1 mb-3">
          {PRICE_PRESETS.map((p, idx) => {
            const isActive = minPrice === p.min && maxPrice === p.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectPriceRange(p.min, p.max);
                  setCustomMin(p.min ? String(p.min) : "");
                  setCustomMax(p.max ? String(p.max) : "");
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-left transition-colors cursor-pointer ${
                  isActive
                    ? "text-[var(--vault-accent)] font-bold"
                    : "text-[var(--vault-muted)] hover:text-[var(--vault-ink)]"
                }`}
              >
                <span>{p.label}</span>
                {isActive && (
                  <Check size={11} className="text-[var(--vault-accent)]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Inputs */}
        <form
          onSubmit={handleApplyCustomPrice}
          className="flex items-center gap-2"
        >
          <input
            type="number"
            placeholder="Min ₹"
            value={customMin}
            onChange={(e) => setCustomMin(e.target.value)}
            className="w-full rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--vault-ink)] placeholder-[var(--vault-muted)] focus:border-[var(--vault-accent)] focus:outline-none"
          />
          <span className="text-[var(--vault-muted)] font-mono text-xs">–</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={customMax}
            onChange={(e) => setCustomMax(e.target.value)}
            className="w-full rounded-none border border-[var(--vault-line)] bg-[var(--vault-bg)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--vault-ink)] placeholder-[var(--vault-muted)] focus:border-[var(--vault-accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="btn-secondary px-3 py-1.5 font-mono text-[10px] uppercase font-semibold cursor-pointer"
          >
            Apply
          </button>
        </form>
      </div>

      {/* 6. Curated Badges */}
      <div className="border-t border-[var(--vault-line)] pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--vault-accent)] font-semibold mb-3">
          Curated Releases
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Edits" },
            { id: "new", label: "New Arrivals" },
            { id: "bestseller", label: "Bestsellers" },
            { id: "sale", label: "Archival Sale" },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelectBadge(b.id as CatalogBadge)}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors cursor-pointer ${
                badge === b.id
                  ? "border-[var(--vault-accent)] bg-[var(--vault-accent)] text-white font-bold"
                  : "border-[var(--vault-line)] bg-[var(--vault-bg)] text-[var(--vault-muted)] hover:border-[var(--vault-ink)]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset All */}
      {hasActiveFilters && (
        <div className="border-t border-[var(--vault-line)] pt-5">
          <button
            type="button"
            onClick={onResetAll}
            className="w-full btn-secondary py-2.5 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={12} /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

interface ProductFiltersProps extends FilterBodyProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDesktopVisible: boolean;
}

export function ProductFilters(props: ProductFiltersProps) {
  return (
    <>
      {/* Desktop Sidebar Panel */}
      {props.isDesktopVisible && (
        <aside
          aria-label="Product Catalog Filters"
          className="hidden lg:block w-72 flex-shrink-0 border-r border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 self-start sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-[var(--vault-line)] pb-4 mb-6">
            <span className="font-serif text-lg uppercase tracking-tight text-[var(--vault-ink)] flex items-center gap-2">
              Filters
            </span>
            {props.hasActiveFilters && (
              <button
                type="button"
                onClick={props.onResetAll}
                className="font-mono text-[10px] uppercase tracking-wider text-[var(--vault-cobalt)] hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <FilterControls {...props} />
        </aside>
      )}

      {/* Mobile Slide-Over Sheet */}
      <Sheet
        open={props.isMobileOpen}
        onOpenChange={(open) => !open && props.onCloseMobile()}
      >
        <SheetContent
          side="left"
          className="w-full max-w-sm border-r border-[var(--vault-line)] bg-[var(--vault-panel)] p-6 overflow-y-auto"
        >
          <SheetHeader className="border-b border-[var(--vault-line)] pb-4 mb-6 flex-row items-center justify-between">
            <SheetTitle className="font-serif text-xl uppercase tracking-tight text-[var(--vault-ink)]">
              Refine Catalog
            </SheetTitle>
            <button
              type="button"
              onClick={props.onCloseMobile}
              className="flex h-8 w-8 items-center justify-center border border-[var(--vault-line)] text-[var(--vault-ink)] hover:text-[var(--vault-accent)]"
              aria-label="Close filters sheet"
            >
              <X size={16} />
            </button>
          </SheetHeader>

          <FilterControls {...props} />

          <div className="mt-8 pt-4 border-t border-[var(--vault-line)]">
            <button
              type="button"
              onClick={props.onCloseMobile}
              className="btn-primary w-full py-3 font-mono text-xs uppercase tracking-widest font-bold"
            >
              Show Results
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
