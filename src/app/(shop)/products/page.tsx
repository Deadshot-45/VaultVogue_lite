"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { ProductCategoryNav } from "@/components/shop/ProductCategoryNav";
import { ProductCatalogToolbar } from "@/components/shop/ProductCatalogToolbar";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductPagination } from "@/components/shop/ProductPagination";
import { useProductCatalog } from "@/hooks/useProductCatalog";

function CatalogContent() {
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [gridDensity, setGridDensity] = useState<3 | 4>(4);

  const {
    category,
    subcategory,
    search,
    color,
    size,
    minPrice,
    maxPrice,
    sort,
    badge,
    page,
    products,
    totalCount,
    totalPages,
    startIndex,
    endIndex,
    isLive,
    isLoading,
    isError,
    errorMessage,
    setCategory,
    setSubcategory,
    setSearch,
    setColor,
    setSize,
    setPriceRange,
    setSort,
    setBadge,
    setPage,
    clearAllFilters,
    removeFilter,
    refetch,
    activeFiltersCount,
    hasActiveFilters,
  } = useProductCatalog();

  // Active Filter Chips representation
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string }[] = [];
    if (category !== "all") {
      chips.push({ key: "category", label: `Division: ${category.toUpperCase()}` });
    }
    if (subcategory !== "all") {
      chips.push({ key: "subcategory", label: `Type: ${subcategory}` });
    }
    if (search.trim()) {
      chips.push({ key: "search", label: `"${search.trim()}"` });
    }
    if (color !== "all") {
      chips.push({ key: "color", label: `Color: ${color}` });
    }
    if (size) {
      chips.push({ key: "size", label: `Size: ${size}` });
    }
    if (minPrice !== null || maxPrice !== null) {
      const minStr = minPrice ? `₹${minPrice.toLocaleString()}` : "₹0";
      const maxStr = maxPrice ? `₹${maxPrice.toLocaleString()}` : "Above";
      chips.push({ key: "price", label: `${minStr} – ${maxStr}` });
    }
    if (badge !== "all") {
      const badgeLabel =
        badge === "new"
          ? "New Arrivals"
          : badge === "bestseller"
            ? "Best Sellers"
            : "Sale & Archive";
      chips.push({ key: "badge", label: badgeLabel });
    }
    return chips;
  }, [category, subcategory, search, color, size, minPrice, maxPrice, badge]);

  return (
    <div className="min-h-screen w-full bg-[var(--vault-bg)] text-[var(--vault-ink)] transition-colors duration-300">
      {/* 1. Editorial Catalog Hero */}
      {/*<ProductCatalogHero />*/}

      {/* 2. Breadcrumb Navigation */}
      <div className="w-full border-b border-[var(--vault-line)] bg-[var(--vault-panel)]/60 py-3 backdrop-blur-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-muted)]">
            <Link href="/" className="hover:text-[var(--vault-accent)] transition-colors">
              Vault Vogue
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <Link href="/products" className="hover:text-[var(--vault-accent)] transition-colors">
              Catalog
            </Link>
            <ChevronRight size={10} className="text-[var(--vault-line)]" />
            <span className="text-[var(--vault-accent)] font-semibold">
              {category === "all" ? "All Silhouettes" : category}
            </span>
          </nav>
        </div>
      </div>

      {/* 3. Category Division Quick-Navigation */}
      <ProductCategoryNav
        activeCategory={category}
        activeBadge={badge}
        onSelectCategory={setCategory}
        onSelectBadge={setBadge}
      />

      {/* 4. Anchor for Smooth Scroll */}
      <div id="catalog-grid-anchor" className="scroll-mt-32" />

      {/* 5. Catalog Toolbar */}
      <ProductCatalogToolbar
        totalCount={totalCount}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        activeFiltersCount={activeFiltersCount}
        hasActiveFilters={hasActiveFilters}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        onToggleDesktopFilters={() => setDesktopFiltersOpen(!desktopFiltersOpen)}
        desktopFiltersOpen={desktopFiltersOpen}
        gridDensity={gridDensity}
        onToggleGridDensity={() => setGridDensity(gridDensity === 4 ? 3 : 4)}
        onClearAllFilters={clearAllFilters}
        activeFilterChips={activeFilterChips}
        onRemoveFilter={removeFilter}
        isLive={isLive}
      />

      {/* 6. Main Catalog Layout (Sticky Filters + Grid) */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-start gap-8">
          {/* Desktop Filter Sidebar */}
          <ProductFilters
            category={category}
            onSelectCategory={setCategory}
            subcategory={subcategory}
            onSelectSubcategory={setSubcategory}
            selectedSize={size}
            onSelectSize={setSize}
            selectedColor={color}
            onSelectColor={setColor}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onSelectPriceRange={setPriceRange}
            badge={badge}
            onSelectBadge={setBadge}
            onResetAll={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            isMobileOpen={mobileFiltersOpen}
            onCloseMobile={() => setMobileFiltersOpen(false)}
            isDesktopVisible={desktopFiltersOpen}
          />

          {/* Product Grid & Pagination Area */}
          <main className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isError={isError}
              errorMessage={errorMessage}
              onRetry={refetch}
              onResetFilters={clearAllFilters}
              hasFilters={hasActiveFilters}
              density={gridDensity}
            />

            {/* Pagination Controls */}
            <ProductPagination
              currentPage={page}
              totalPages={totalPages}
              totalCount={totalCount}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={setPage}
            />
          </main>
        </div>
      </div>

      {/* 7. Luxury Editorial Campaign Strip */}
      <section className="border-y border-[var(--vault-line)] bg-[var(--vault-panel)] py-16 sm:py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--vault-accent)]">
            A T E L I E R · M A N I F E S T O
          </p>
          <blockquote className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl font-light uppercase tracking-tight text-[var(--vault-ink)] leading-snug">
            “Fashion without the filter. Wear the silence. Own the silhouette.”
          </blockquote>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-[var(--vault-muted)]">
            VAULT VOGUE ARCHIVE · CRAFTED WITH ZERO-COMPROMISE SOURCING
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/#brand-story"
              className="inline-flex items-center gap-2 border border-[var(--vault-line)] px-6 py-2.5 font-mono text-[10px] uppercase tracking-widest text-[var(--vault-ink)] hover:border-[var(--vault-accent)] hover:text-[var(--vault-accent)] transition-colors"
            >
              Read Brand Philosophy <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--vault-bg)]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--vault-accent)]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--vault-muted)]">
              Curating The Vault Collection...
            </span>
          </div>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
