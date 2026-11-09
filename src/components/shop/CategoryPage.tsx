"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, RotateCcw, CreditCard, Radio } from "lucide-react";
import { CATEGORY_CONFIGS } from "@/data/categories";
import { CategoryHero } from "./CategoryHero";
import { CategoryNavigation } from "./CategoryNavigation";
import { CategoryCampaignBanner } from "./CategoryCampaignBanner";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { CategoryProductGrid } from "./CategoryProductGrid";
import { Newsletter } from "@/features/storefront/components/newsletter";
import { useGetProducts } from "@/lib/queries/useGetProducts";
import { mapApiProductToVariantProduct } from "@/lib/utility/category-adapter";
import type { CategoryKey, SortOption, CategorySubcategory } from "@/types/category";
import type { VariantSize, VariantProduct } from "@/features/storefront/types/variant";

interface CategoryPageProps {
  categoryKey: CategoryKey;
}

export function CategoryPage({ categoryKey }: CategoryPageProps) {
  const config = CATEGORY_CONFIGS[categoryKey];

  // Fetch real API products from backend using TanStack Query
  const {
    data: apiData,
    isLoading: isApiLoading,
    isError: isApiError,
    error: apiError,
    refetch: refetchProducts,
  } = useGetProducts({
    categoryName: categoryKey,
    label: categoryKey,
    limit: 50,
  });

  const rawApiProducts = useMemo(() => {
    return apiData?.pages.flatMap((page) => page) || [];
  }, [apiData]);

  // Transform raw API products into high-fidelity VariantProducts
  const apiVariantProducts = useMemo(() => {
    return rawApiProducts.map(mapApiProductToVariantProduct);
  }, [rawApiProducts]);

  // Determine active product pool: prefer live API data
  const baseProducts: VariantProduct[] = useMemo(() => {
    if (apiVariantProducts.length > 0) {
      return apiVariantProducts;
    }
    return [];
  }, [apiVariantProducts]);

  const isUsingLiveData = apiVariantProducts.length > 0;

  // Dynamically compute subcategories with actual product counts
  const dynamicSubcategories: CategorySubcategory[] = useMemo(() => {
    if (!config) return [];

    const defaultSubs = config.subcategories;

    return defaultSubs.map((sub) => {
      if (sub.id === "all") {
        return {
          ...sub,
          productCount: baseProducts.length,
        };
      }

      const target = sub.id.toLowerCase();
      const count = baseProducts.filter((p) => {
        const cat = p.category.toLowerCase();
        return (
          cat === target ||
          cat.includes(target) ||
          target.includes(cat) ||
          p.slug.toLowerCase().includes(target)
        );
      }).length;

      return {
        ...sub,
        productCount: count,
      };
    });
  }, [config, baseProducts]);

  // Filtering & Sorting State
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<VariantSize[]>([]);
  const [activeSort, setActiveSort] = useState<SortOption>("featured");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleToggleSize = (size: VariantSize) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleResetFilters = () => {
    setActiveSubcategory("all");
    setSelectedSizes([]);
    setSearchQuery("");
    setActiveSort("featured");
  };

  const hasActiveFilters =
    activeSubcategory !== "all" ||
    selectedSizes.length > 0 ||
    searchQuery.trim().length > 0 ||
    activeSort !== "featured";

  // Filter & Sort Logic applied across active pool
  const filteredProducts = useMemo(() => {
    let list = [...baseProducts];

    // 1. Subcategory filter
    if (activeSubcategory !== "all") {
      const target = activeSubcategory.toLowerCase();
      list = list.filter((p) => {
        const cat = p.category.toLowerCase();
        return (
          cat === target ||
          cat.includes(target) ||
          target.includes(cat) ||
          p.slug.toLowerCase().includes(target)
        );
      });
    }

    // 2. Size filter (product must have stock in at least one selected size)
    if (selectedSizes.length > 0) {
      list = list.filter((p) => {
        return p.colors.some((color) => {
          return selectedSizes.some((size) => (color.stockBySize[size] ?? 0) > 0);
        });
      });
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    // 4. Sorting
    switch (activeSort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.reverse();
        break;
      case "featured":
      default:
        break;
    }

    return list;
  }, [baseProducts, activeSubcategory, selectedSizes, searchQuery, activeSort]);

  if (!config) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-3xl uppercase text-(--vault-ink)">
          Category Not Found
        </h1>
        <Link
          href="/"
          className="mt-4 inline-block font-mono text-xs uppercase text-(--vault-accent) underline"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full bg-(--vault-bg) text-(--vault-ink) transition-colors duration-300">
      {/* 1. Category Editorial Hero */}
      <CategoryHero config={config} />

      {/* 2. Sticky Horizontal Silhouettes Filter Bar */}
      <CategoryNavigation
        subcategories={dynamicSubcategories}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={(id) => {
          setActiveSubcategory(id);
          const el = document.getElementById("category-catalog-section");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 3. Product Catalog Section */}
      <section
        id="category-catalog-section"
        aria-label={`${config.title} Products Collection`}
        className="w-full py-8 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs, Section Heading & Live API Badge */}
          <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <nav
                aria-label="Breadcrumbs"
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-(--vault-muted) mb-2"
              >
                <Link href="/" className="hover:text-(--vault-accent) transition-colors">
                  Vault Vogue
                </Link>
                <ChevronRight size={10} />
                <span className="text-(--vault-accent) font-semibold">{config.title}</span>
                {activeSubcategory !== "all" && (
                  <>
                    <ChevronRight size={10} />
                    <span className="text-(--vault-ink)">{activeSubcategory}</span>
                  </>
                )}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-serif text-2xl sm:text-3xl font-light uppercase tracking-tight text-(--vault-ink)">
                  The {config.title} Archive
                </h2>
                {isUsingLiveData && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-(--vault-accent)/30 bg-(--vault-accent)/10 font-mono text-[9px] uppercase tracking-wider text-(--vault-accent)">
                    <Radio size={10} className="animate-pulse text-(--vault-accent)" />
                    Live Catalog ({baseProducts.length})
                  </span>
                )}
              </div>
            </div>

            <p className="font-mono text-[10px] uppercase tracking-wider text-(--vault-muted)">
              Express Global Dispatch · Verified Authentic
            </p>
          </div>

          {/* Filter Toolbar */}
          <CategoryFilterBar
            totalCount={filteredProducts.length}
            subcategories={dynamicSubcategories}
            activeSubcategory={activeSubcategory}
            onSelectSubcategory={setActiveSubcategory}
            selectedSizes={selectedSizes}
            onToggleSize={handleToggleSize}
            activeSort={activeSort}
            onSelectSort={setActiveSort}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Product Grid with Loading, Error, and Empty States */}
          <CategoryProductGrid
            products={filteredProducts}
            isLoading={isApiLoading && baseProducts.length === 0}
            isError={isApiError && baseProducts.length === 0}
            errorMessage={apiError ? String(apiError) : undefined}
            onRetry={() => refetchProducts()}
            onResetFilters={handleResetFilters}
          />
        </div>
      </section>

      {/* 4. Category Campaign Spotlight Feature (Editorial Immersion below catalog) */}
      <CategoryCampaignBanner campaign={config.campaign} categoryKey={config.key} />

      {/* 5. Brand Assurance Strip */}
      <section
        aria-label="Brand Assurance"
        className="w-full border-y border-(--vault-line) bg-(--vault-panel) py-10 sm:py-12"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-(--vault-line) text-(--vault-accent)">
                <ShieldCheck size={16} />
              </div>
              <div>
                <h4 className="font-serif text-sm uppercase text-(--vault-ink)">
                  Archival Provenance
                </h4>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted) leading-relaxed">
                  Every garment is serialized with traceable provenance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-(--vault-line) text-(--vault-accent)">
                <Truck size={16} />
              </div>
              <div>
                <h4 className="font-serif text-sm uppercase text-(--vault-ink)">
                  Priority Dispatch
                </h4>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted) leading-relaxed">
                  Complimentary express shipping on orders over ₹5,000.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-(--vault-line) text-(--vault-accent)">
                <RotateCcw size={16} />
              </div>
              <div>
                <h4 className="font-serif text-sm uppercase text-(--vault-ink)">
                  Effortless Returns
                </h4>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted) leading-relaxed">
                  14-day doorstep pick-up with full refund guarantee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-(--vault-line) text-(--vault-accent)">
                <CreditCard size={16} />
              </div>
              <div>
                <h4 className="font-serif text-sm uppercase text-(--vault-ink)">
                  Encrypted Checkout
                </h4>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-(--vault-muted) leading-relaxed">
                  Bank-grade 256-bit SSL encrypted transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Editorial Newsletter */}
      <Newsletter />
    </main>
  );
}
